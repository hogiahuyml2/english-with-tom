'use strict';
// Công cụ quản lý cho giáo viên: Việc cần làm hôm nay · Duyệt học sinh vào lớp · Bộ lọc đã lưu · Sổ điểm theo lớp (+ Excel) · Hồ sơ từng học sinh.
const { buildXlsx } = require('./xlsx-lib');

module.exports = function (app, deps) {
  const { db, requireRole, notifyUser, now, applySelfJoin } = deps;
  const T = requireRole('teacher', 'admin');
  const isAdmin = (u) => u.role === 'admin';
  const DAY = 86400000;

  // Hạn nộp do giáo viên nhập ở Việt Nam (không có múi giờ) → coi là giờ UTC+7
  function dlMs(s) {
    if (!s) return 0;
    const iso = /[+-]\d{2}:?\d{2}$|Z$/i.test(s) ? s : String(s).replace(' ', 'T') + '+07:00';
    const t = Date.parse(iso); return isNaN(t) ? 0 : t;
  }
  const pctOf = (score, max) => (score != null && max) ? Math.round(score / max * 100) : null;
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const ownGroups = (u) => isAdmin(u) ? db.prepare('SELECT id,name,teacher_id FROM groups ORDER BY name COLLATE NOCASE').all()
    : db.prepare('SELECT id,name,teacher_id FROM groups WHERE teacher_id=? ORDER BY name COLLATE NOCASE').all(u.id);

  /* ───────────────────────── 1. VIỆC CẦN LÀM HÔM NAY ───────────────────────── */
  app.get('/api/teacher/todo', T, (req, res) => {
    const u = req.user, admin = isAdmin(u), t0 = Date.now();

    // Bài chờ chấm: bài nộp ở đề do mình tạo hoặc đề mình đã giao
    const pend = db.prepare(`
      SELECT s.id, s.submitted_at, s.status, us.name AS student_name, us.email, e.title, e.skill
      FROM submissions s JOIN exercises e ON e.id = s.exercise_id JOIN users us ON us.id = s.user_id
      WHERE s.status IN ('pending','pending_review')
        ${admin ? '' : 'AND (e.created_by = ? OR EXISTS (SELECT 1 FROM assignments a WHERE a.exercise_id = s.exercise_id AND a.assigned_by = ?))'}
      ORDER BY s.submitted_at ASC LIMIT 2000`).all(...(admin ? [] : [u.id, u.id]));
    const grading = {
      total: pend.length,
      items: pend.slice(0, 6).map(r => ({ id: r.id, student: r.student_name || r.email, title: r.title, skill: r.skill, waiting_h: Math.max(0, Math.round((t0 - Date.parse(r.submitted_at)) / 3600e3)) })),
    };

    // Bài đã giao chưa nộp: gom theo (lớp, đề)
    const open = db.prepare(`
      SELECT a.id AS aid, a.deadline, a.group_id, e.id AS exercise_id, e.title, u2.id AS student_id, u2.name AS student_name, a.student_email, g.name AS group_name
      FROM assignments a JOIN exercises e ON e.id = a.exercise_id
      LEFT JOIN users u2 ON u2.email = a.student_email
      LEFT JOIN groups g ON g.id = a.group_id
      WHERE a.deadline IS NOT NULL ${admin ? '' : 'AND a.assigned_by = ?'}
        AND NOT EXISTS (SELECT 1 FROM submissions s WHERE s.user_id = u2.id AND s.exercise_id = a.exercise_id)
      ORDER BY a.id DESC LIMIT 20000`).all(...(admin ? [] : [u.id]));
    const over = {}, soon = {}; let overN = 0, soonN = 0;
    for (const r of open) {
      if (!r.student_id) continue; // chưa có tài khoản thì không nhắc được
      const d = dlMs(r.deadline); if (!d) continue;
      let bucket = null;
      if (d < t0 && d > t0 - 30 * DAY) { bucket = over; overN++; }
      else if (d >= t0 && d <= t0 + 3 * DAY) { bucket = soon; soonN++; }
      if (!bucket) continue;
      const key = (r.group_name || '') + '|' + r.exercise_id;
      const o = bucket[key] || (bucket[key] = { group: r.group_name || null, group_id: r.group_id || null, exercise_id: r.exercise_id, title: r.title, deadline: r.deadline, ids: [], names: [], count: 0 });
      o.count++; if (o.ids.length < 300) o.ids.push(r.aid); if (o.names.length < 4) o.names.push(r.student_name || r.student_email);
    }
    const top = (m) => Object.values(m).sort((a, b) => b.count - a.count).slice(0, 8);
    const overdue = { total: overN, groups: top(over) };
    const dueSoon = { total: soonN, groups: top(soon) };

    // Yêu cầu vào lớp đang chờ duyệt (lớp của mình; quản trị viên thấy tất cả)
    const reqs = db.prepare(`
      SELECT r.id, r.group_id, r.created_at, g.name AS group_name, us.id AS user_id, us.name, us.email
      FROM group_join_requests r JOIN groups g ON g.id = r.group_id JOIN users us ON us.id = r.user_id
      ${admin ? '' : 'WHERE g.teacher_id = ?'} ORDER BY r.id ASC LIMIT 500`).all(...(admin ? [] : [u.id]));

    // Học sinh chưa vào lớp nào và chưa xác nhận tự do (để GV biết còn bao nhiêu em chưa chọn lớp)
    let noClass = 0;
    try {
      noClass = db.prepare(`SELECT COUNT(*) AS c FROM users WHERE role='student' AND (class_choice IS NULL OR class_choice='')
        AND NOT EXISTS (SELECT 1 FROM group_members gm WHERE gm.user_id = users.id)`).get().c;
    } catch (_) {}
    res.json({ now: t0, grading, overdue, due_soon: dueSoon, requests: reqs, no_class: noClass });
  });

  /* ───────────────────────── 2. DUYỆT HỌC SINH VÀO LỚP ───────────────────────── */
  app.put('/api/groups/:id/approval', T, (req, res) => {
    const g = db.prepare('SELECT id,teacher_id FROM groups WHERE id=?').get(Number(req.params.id));
    if (!g) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
    if (!isAdmin(req.user) && g.teacher_id !== req.user.id) return res.status(403).json({ error: 'Chỉ giáo viên tạo lớp mới đổi được cài đặt này.' });
    const on = (req.body || {}).on ? 1 : 0;
    db.prepare('UPDATE groups SET needs_approval=? WHERE id=?').run(on, g.id);
    res.json({ ok: true, needs_approval: on });
  });

  // Duyệt / từ chối hàng loạt: { ids:[requestId...], action:'approve'|'reject' }
  app.post('/api/groups/requests/decide', T, (req, res) => {
    const ids = Array.isArray((req.body || {}).ids) ? req.body.ids.map(Number).filter(Boolean).slice(0, 300) : [];
    const action = (req.body || {}).action === 'reject' ? 'reject' : 'approve';
    if (!ids.length) return res.status(400).json({ error: 'Chưa chọn yêu cầu nào.' });
    let done = 0, skipped = 0, backfilled = 0;
    for (const id of ids) {
      const r = db.prepare('SELECT r.id, r.group_id, r.user_id, g.name AS gname, g.teacher_id, g.self_join FROM group_join_requests r JOIN groups g ON g.id=r.group_id WHERE r.id=?').get(id);
      if (!r || (!isAdmin(req.user) && r.teacher_id !== req.user.id)) { skipped++; continue; }
      const st = db.prepare("SELECT id,name,email FROM users WHERE id=? AND role='student'").get(r.user_id);
      try {
        db.exec('BEGIN');
        if (!st) { db.prepare('DELETE FROM group_join_requests WHERE id=?').run(id); db.exec('COMMIT'); skipped++; continue; }
        if (action === 'approve') {
          backfilled += applySelfJoin(st, { id: r.group_id, name: r.gname }) || 0;
        } else {
          db.prepare('DELETE FROM group_join_requests WHERE id=?').run(id);
          const inAny = db.prepare('SELECT 1 FROM group_members WHERE user_id=? LIMIT 1').get(st.id);
          db.prepare('UPDATE users SET class_choice=? WHERE id=?').run(inAny ? 'class' : null, st.id);
        }
        db.exec('COMMIT'); done++;
      } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} console.error('[class-requests]', e.message); skipped++; continue; }
      if (action === 'approve') notifyUser(st.id, 'class_approved', '✅ Bạn đã vào lớp ' + r.gname, 'Giáo viên đã duyệt. Bài tập của lớp sẽ hiện ở mục “Bài tập được giao”.', '/assigned.html');
      else notifyUser(st.id, 'class_rejected', 'Yêu cầu vào lớp ' + r.gname + ' chưa được duyệt', 'Hãy kiểm tra lại lớp bạn đang học rồi chọn lại ở Tài khoản → Lớp đang theo học nhé.', '/account.html#classCard');
    }
    res.json({ ok: true, done, skipped, backfilled });
  });

  /* ───────────────────────── 3. BỘ LỌC ĐÃ LƯU ───────────────────────── */
  const PAGES = new Set(['track', 'gradebook']);
  app.get('/api/me/filters', T, (req, res) => {
    const page = String(req.query.page || 'track'); if (!PAGES.has(page)) return res.status(400).json({ error: 'Trang không hợp lệ.' });
    const rows = db.prepare('SELECT id,name,data FROM saved_filters WHERE user_id=? AND page=? ORDER BY id').all(req.user.id, page);
    res.json({ filters: rows.map(r => ({ id: r.id, name: r.name, data: J(r.data, {}) })) });
  });
  app.post('/api/me/filters', T, (req, res) => {
    const b = req.body || {}, page = String(b.page || 'track'); if (!PAGES.has(page)) return res.status(400).json({ error: 'Trang không hợp lệ.' });
    const name = String(b.name || '').trim().slice(0, 60); if (!name) return res.status(400).json({ error: 'Hãy đặt tên cho bộ lọc.' });
    if (!b.data || typeof b.data !== 'object') return res.status(400).json({ error: 'Thiếu cấu hình lọc.' });
    const data = JSON.stringify(b.data); if (data.length > 4000) return res.status(400).json({ error: 'Cấu hình lọc quá dài.' });
    const ex = db.prepare('SELECT id FROM saved_filters WHERE user_id=? AND page=? AND name=?').get(req.user.id, page, name);
    if (ex) { db.prepare('UPDATE saved_filters SET data=? WHERE id=?').run(data, ex.id); return res.json({ ok: true, id: ex.id, updated: true }); }
    if (db.prepare('SELECT COUNT(*) AS c FROM saved_filters WHERE user_id=? AND page=?').get(req.user.id, page).c >= 30) return res.status(400).json({ error: 'Tối đa 30 bộ lọc — hãy xoá bớt bộ lọc cũ.' });
    const r = db.prepare('INSERT INTO saved_filters (user_id,page,name,data,created_at) VALUES (?,?,?,?,?)').run(req.user.id, page, name, data, now());
    res.json({ ok: true, id: Number(r.lastInsertRowid) });
  });
  app.delete('/api/me/filters/:id', T, (req, res) => {
    const r = db.prepare('DELETE FROM saved_filters WHERE id=? AND user_id=?').run(Number(req.params.id), req.user.id);
    res.json({ ok: !!r.changes });
  });

  /* ───────────────────────── 4. SỔ ĐIỂM THEO LỚP ───────────────────────── */
  function buildGradebook(user, gid) {
    const g = db.prepare('SELECT id,name,teacher_id FROM groups WHERE id=?').get(gid);
    if (!g) return { status: 404, error: 'Không tìm thấy lớp.' };
    if (!isAdmin(user) && g.teacher_id !== user.id) return { status: 403, error: 'Đây không phải lớp của bạn.' };
    const members = db.prepare('SELECT u.id,u.name,u.email FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? ORDER BY u.name COLLATE NOCASE').all(gid).slice(0, 500);
    const exs = db.prepare(`SELECT e.id, e.title, e.skill, e.program, MIN(a.id) AS first_a FROM assignments a JOIN exercises e ON e.id=a.exercise_id WHERE a.group_id=? GROUP BY e.id ORDER BY MIN(a.id) DESC LIMIT 60`).all(gid).reverse();
    const have = new Set(exs.map(e => e.id));
    for (const e of db.prepare('SELECT e.id, e.title, e.skill, e.program FROM group_assignments ga JOIN exercises e ON e.id=ga.exercise_id WHERE ga.group_id=? ORDER BY ga.id').all(gid)) if (!have.has(e.id) && exs.length < 60) { exs.push(e); have.add(e.id); }
    const emails = members.map(m => m.email), uids = members.map(m => m.id), eids = exs.map(e => e.id);
    const asg = new Map(), subs = new Map();
    const chunk = (arr, n) => { const o = []; for (let i = 0; i < arr.length; i += n) o.push(arr.slice(i, i + n)); return o; };
    if (emails.length && eids.length) {
      const exPh = eids.map(() => '?').join(',');
      for (const part of chunk(emails, 200)) {
        for (const a of db.prepare(`SELECT exercise_id, student_email, deadline FROM assignments WHERE exercise_id IN (${exPh}) AND student_email IN (${part.map(() => '?').join(',')})`).all(...eids, ...part)) asg.set(a.exercise_id + '|' + a.student_email, a.deadline);
      }
      for (const part of chunk(uids, 200)) {
        for (const s of db.prepare(`SELECT id, user_id, exercise_id, status, score, max_score, submitted_at FROM submissions WHERE exercise_id IN (${exPh}) AND user_id IN (${part.map(() => '?').join(',')}) ORDER BY id ASC`).all(...eids, ...part)) subs.set(s.user_id + '|' + s.exercise_id, s);
      }
    }
    const students = members.map(m => {
      const cells = {}; let sum = 0, nOk = 0, done = 0, total = 0;
      for (const e of exs) {
        const k = e.id + '|' + m.email, s = subs.get(m.id + '|' + e.id), assigned = asg.has(k) || !!s;
        if (!assigned) { cells[e.id] = { a: 0 }; continue; }
        total++;
        if (!s) { cells[e.id] = { a: 1, st: 'none' }; continue; }
        done++;
        const pct = s.status === 'graded' ? pctOf(s.score, s.max_score) : null;
        const dl = dlMs(asg.get(k));
        cells[e.id] = { a: 1, st: s.status === 'graded' ? 'ok' : 'pend', pct, score: s.score, max: s.max_score, sub: s.id, late: !!(dl && Date.parse(s.submitted_at) > dl + 60000) };
        if (pct != null) { sum += pct; nOk++; }
      }
      return { id: m.id, name: m.name, email: m.email, cells, avg: nOk ? Math.round(sum / nOk) : null, done, total };
    });
    const exOut = exs.map(e => {
      let sum = 0, n = 0, done = 0, total = 0;
      for (const s of students) { const c = s.cells[e.id]; if (!c || !c.a) continue; total++; if (c.st && c.st !== 'none') done++; if (c.pct != null) { sum += c.pct; n++; } }
      return { id: e.id, title: e.title, skill: e.skill, program: e.program, avg: n ? Math.round(sum / n) : null, done, total };
    });
    return { group: { id: g.id, name: g.name }, exercises: exOut, students };
  }

  app.get('/api/teacher/gradebook', T, (req, res) => {
    const groups = ownGroups(req.user);
    const gid = Number(req.query.class) || 0;
    if (!gid) return res.json({ groups: groups.map(g => ({ id: g.id, name: g.name })) });
    const gb = buildGradebook(req.user, gid);
    if (gb.error) return res.status(gb.status).json({ error: gb.error });
    res.json({ groups: groups.map(g => ({ id: g.id, name: g.name })), ...gb });
  });

  const band = (p) => p == null ? 9 : p >= 80 ? 6 : p >= 50 ? 7 : 8;
  function sheetOf(gb) {
    const today = new Date().toLocaleDateString('vi-VN');
    const header = ['STT', 'Họ và tên', 'Email'].concat(gb.exercises.map(e => e.title), ['Đã nộp', 'Điểm TB (%)']);
    const rows = gb.students.map((s, i) => [i + 1, s.name || '', s.email].concat(gb.exercises.map(e => {
      const c = s.cells[e.id];
      if (!c || !c.a) return { v: '—', s: 9 };
      if (c.st === 'none') return { v: 'Chưa nộp', s: 9 };
      if (c.st === 'pend') return { v: 'Chờ chấm', s: 7 };
      return c.pct == null ? { v: 'Đã chấm', s: 5 } : { v: c.pct, s: band(c.pct) };
    }), [s.done + '/' + s.total, s.avg == null ? { v: '—', s: 9 } : { v: s.avg, s: band(s.avg) }]));
    rows.push(['', 'Trung bình lớp', ''].concat(gb.exercises.map(e => e.avg == null ? { v: '—', s: 9 } : { v: e.avg, s: band(e.avg) }), ['', '']));
    const avgs = gb.students.map(s => s.avg).filter(v => v != null);
    rows[rows.length - 1][rows[0].length - 1] = avgs.length ? { v: Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length), s: band(Math.round(avgs.reduce((a, b) => a + b, 0) / avgs.length)) } : { v: '—', s: 9 };
    return { title: 'Sổ điểm lớp ' + gb.group.name + ' — xuất ngày ' + today + ' (điểm tính theo % mỗi bài)', header, rows, widths: [6, 26, 28].concat(gb.exercises.map(() => 16), [10, 12]) };
  }
  const sheetName = (s, used) => { let n = String(s).replace(/[\[\]:*?\/\\]/g, ' ').trim().slice(0, 28) || 'Lop'; let k = n, i = 2; while (used.has(k.toLowerCase())) k = n.slice(0, 25) + ' ' + (i++); used.add(k.toLowerCase()); return k; };
  app.get('/api/teacher/gradebook.xlsx', T, (req, res) => {
    const gid = Number(req.query.class) || 0, sheets = [], used = new Set();
    if (gid) {
      const gb = buildGradebook(req.user, gid); if (gb.error) return res.status(gb.status).json({ error: gb.error });
      sheets.push(Object.assign({ name: sheetName(gb.group.name, used) }, sheetOf(gb)));
    } else {
      for (const g of ownGroups(req.user)) { const gb = buildGradebook(req.user, g.id); if (!gb.error && gb.students.length) sheets.push(Object.assign({ name: sheetName(g.name, used) }, sheetOf(gb))); }
      if (!sheets.length) return res.status(404).json({ error: 'Chưa có lớp nào có học sinh để xuất.' });
    }
    const buf = buildXlsx(sheets), day = new Date().toISOString().slice(0, 10);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="so-diem-' + (gid ? 'lop' : 'tat-ca-lop') + '-' + day + '.xlsx"');
    res.send(buf);
  });

  /* ───────────────────────── 5. HỒ SƠ TỪNG HỌC SINH ───────────────────────── */
  app.get('/api/teacher/student360/:id', T, (req, res) => {
    const sid = Number(req.params.id);
    const st = db.prepare("SELECT id,name,email,created_at,class_choice FROM users WHERE id=? AND role='student'").get(sid);
    if (!st) return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
    const t0 = Date.now();
    const classes = db.prepare('SELECT g.id,g.name,gm.source FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id=? ORDER BY g.name').all(sid);
    const pendingReq = db.prepare('SELECT g.id,g.name FROM group_join_requests r JOIN groups g ON g.id=r.group_id WHERE r.user_id=?').get(sid) || null;

    const subs = db.prepare(`SELECT s.id, s.exercise_id, s.submitted_at, s.status, s.score, s.max_score, s.feedback, e.title, e.program, e.skill
      FROM submissions s JOIN exercises e ON e.id=s.exercise_id WHERE s.user_id=? ORDER BY s.submitted_at ASC, s.id ASC`).all(sid);
    const asgAll = db.prepare(`SELECT a.id AS aid, a.exercise_id, a.deadline, a.created_at, e.title, e.skill, e.program, g.name AS group_name
      FROM assignments a JOIN exercises e ON e.id=a.exercise_id LEFT JOIN groups g ON g.id=a.group_id WHERE a.student_email=? ORDER BY a.id DESC`).all(st.email);

    const timeline = [], skillMap = {}, progMap = {}, crit = {}, recent = [];
    const subByEx = new Map();
    for (const s of subs) {
      subByEx.set(s.exercise_id, s);
      const pct = s.status === 'graded' ? pctOf(s.score, s.max_score) : null;
      if (pct != null) {
        timeline.push({ id: s.id, date: s.submitted_at, pct, title: s.title, skill: s.skill, program: s.program });
        const k = s.skill || '—', o = skillMap[k] || (skillMap[k] = { skill: k, n: 0, sum: 0 }); o.n++; o.sum += pct;
        const p = progMap[s.program || '—'] || (progMap[s.program || '—'] = { program: s.program || '—', n: 0, sum: 0, best: 0 }); p.n++; p.sum += pct; if (pct > p.best) p.best = pct;
        const fb = J(s.feedback, null);
        if (fb && Array.isArray(fb.criteria)) for (const c of fb.criteria) {
          if (!c || !c.name || !c.max) continue; const nm = String(c.name).split('(')[0].trim(); const o2 = crit[nm] || (crit[nm] = { name: nm, n: 0, sum: 0 }); o2.n++; o2.sum += c.score / c.max * 100;
        }
      }
      recent.push({ id: s.id, title: s.title, skill: s.skill, program: s.program, status: s.status, pct, score: s.score, max: s.max_score, submitted_at: s.submitted_at });
    }
    const skills = Object.values(skillMap).map(o => ({ skill: o.skill, n: o.n, avg: Math.round(o.sum / o.n) })).sort((a, b) => b.avg - a.avg);
    const programs = Object.values(progMap).map(o => ({ program: o.program, n: o.n, avg: Math.round(o.sum / o.n), best: o.best })).sort((a, b) => b.n - a.n);
    const criteria = Object.values(crit).map(o => ({ name: o.name, n: o.n, avg: Math.round(o.sum / o.n) })).sort((a, b) => a.avg - b.avg);

    let onTime = 0, withDl = 0; const outstanding = []; let overdueN = 0;
    for (const a of asgAll) {
      const s = subByEx.get(a.exercise_id), d = dlMs(a.deadline);
      if (s) { if (d) { withDl++; if (Date.parse(s.submitted_at) <= d + 60000) onTime++; } continue; }
      const over = !!d && d < t0; if (over) overdueN++;
      outstanding.push({ aid: a.aid, exercise_id: a.exercise_id, title: a.title, skill: a.skill, program: a.program, group: a.group_name, deadline: a.deadline, overdue: over, days: d ? Math.round((d - t0) / DAY) : null });
    }
    outstanding.sort((x, y) => (y.overdue - x.overdue) || String(x.deadline || '9').localeCompare(String(y.deadline || '9')));

    const avgAll = timeline.length ? Math.round(timeline.reduce((s, r) => s + r.pct, 0) / timeline.length) : null;
    const last5 = timeline.slice(-5), prev5 = timeline.slice(-10, -5);
    const mean = (a) => a.length ? a.reduce((s, r) => s + r.pct, 0) / a.length : null;
    const trend = (last5.length >= 2 && prev5.length >= 2) ? Math.round(mean(last5) - mean(prev5)) : null;

    let placement = null;
    try {
      const pa = db.prepare("SELECT finished_at, result FROM placement_attempts WHERE user_id=? AND status='done' AND voided=0 ORDER BY id DESC LIMIT 1").get(sid);
      const r = pa && J(pa.result, null);
      if (r && r.level) placement = { level: r.level, score: r.score, at: pa.finished_at, skills: (r.skills || []).map(k => ({ name: k.name, level: k.level, pct: k.pct })) };
    } catch (_) {}

    res.json({
      student: { id: st.id, name: st.name, email: st.email, created_at: st.created_at, class_choice: st.class_choice },
      classes, pending_request: pendingReq,
      kpi: { assigned: asgAll.length, submitted: subs.length, graded: timeline.length, avg: avgAll, trend, on_time_rate: withDl ? Math.round(onTime / withDl * 100) : null, outstanding: outstanding.length, overdue: overdueN, last_active: subs.length ? subs[subs.length - 1].submitted_at : null },
      timeline: timeline.slice(-60), skills, programs, criteria_weak: criteria.slice(0, 4), criteria_strong: criteria.slice().reverse().slice(0, 3).filter(c => c.avg >= 70),
      outstanding: outstanding.slice(0, 40), recent: recent.slice(-12).reverse(), placement,
    });
  });
};
