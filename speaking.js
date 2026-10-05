'use strict';
// 🎤 Luyện Speaking có chấm: học sinh làm đề theo đúng cấu trúc KET/PET/FCE/Aptis/IELTS, ghi âm từng câu, AI nghe & chấm, giáo viên xem lại.
const fs = require('fs');
const path = require('path');
const AI = require('./ai');
const BANK = require('./speaking/bank');
const SAI = require('./speaking-ai');

module.exports = function (app, deps) {
  const { db, requireAuth, requireRole, now, notifyUser, upload, checkUpload, uploadsDir } = deps;
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const all = (sql, ...a) => db.prepare(sql).all(...a);
  const isStaff = (u) => u && (u.role === 'teacher' || u.role === 'admin');
  const DAILY_LIMIT = 8;                       // số bài được chấm mỗi 24 giờ / học sinh
  const KEEP_DAYS = 60;                        // giữ file ghi âm 60 ngày (bản chép & điểm giữ lâu hơn)

  const aiReady = () => AI.aiMock() || (AI.provider() === 'gemini' && !!process.env.GEMINI_API_KEY);

  function canSee(user, row) {
    if (!user) return false;
    if (row.user_id === user.id || user.role === 'admin') return true;
    if (user.role !== 'teacher') return false;
    return !!one('SELECT 1 AS c FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id=? AND g.teacher_id=? LIMIT 1', row.user_id, user.id);
  }
  const clipUrls = (row) => { const c = J(row.clips, {}), o = {}; for (const k of Object.keys(c)) if (c[k] && c[k].file) o[k] = '/uploads/' + c[k].file; return o; };

  function pub(row, user) {
    const turns = J(row.turns, []).map(BANK.publicTurn);
    const out = { id: row.id, exam: row.exam, mode: row.mode, parts: J(row.parts, null), status: row.status, error: row.error || null, turns, clips: clipUrls(row), created_at: row.created_at, submitted_at: row.submitted_at, graded_at: row.graded_at, mine: row.user_id === user.id };
    if (row.status === 'done') out.result = J(row.result, null);
    out.teacher = J(row.teacher, null);
    if (row.user_id !== user.id) { const u = one('SELECT name,email FROM users WHERE id=?', row.user_id); out.student = u ? { name: u.name, email: u.email } : null; }
    return out;
  }

  /* ───────── thông tin chung ───────── */
  app.get('/api/speaking/formats', requireAuth, (req, res) => {
    res.json({ formats: BANK.formatsPublic(), ai_ready: aiReady(), daily_limit: DAILY_LIMIT });
  });

  /* ───────── bắt đầu một phiên ───────── */
  app.post('/api/speaking/start', requireAuth, (req, res) => {
    const b = req.body || {}, exam = String(b.exam || '');
    if (!BANK.FORMATS[exam]) return res.status(400).json({ error: 'Kỳ thi không hợp lệ.' });
    if (!aiReady()) return res.status(503).json({ error: 'AI chấm giọng nói chưa sẵn sàng (cần cấu hình Gemini). Hãy báo giáo viên.' });
    let mode = b.mode === 'practice' ? 'practice' : 'exam', assignId = null;
    let parts = null;
    if (Array.isArray(b.parts) && b.parts.length) parts = [...new Set(b.parts.map(Number))].filter((n) => BANK.FORMATS[exam].parts.some((p) => p.n === n)).sort();
    if (b.assign_id) { // làm đúng bài thầy/cô giao: kỳ thi, phần, chế độ lấy theo bài giao
      const a = one('SELECT * FROM speaking_assign WHERE id=?', Number(b.assign_id));
      if (!a || !one('SELECT 1 AS c FROM group_members WHERE group_id=? AND user_id=?', a.group_id, req.user.id)) return res.status(404).json({ error: 'Không tìm thấy bài được giao.' });
      assignId = a.id; mode = a.mode === 'exam' ? 'exam' : 'practice'; parts = J(a.parts, null);
      if (a.exam !== exam) return res.status(400).json({ error: 'Bài giao không khớp kỳ thi.' });
    }
    if (!isStaff(req.user)) {
      const c = one("SELECT COUNT(*) AS c FROM speaking_sessions WHERE user_id=? AND status IN ('grading','done') AND submitted_at>?", req.user.id, new Date(Date.now() - 86400000).toISOString()).c;
      if (c >= DAILY_LIMIT) return res.status(429).json({ error: 'Hôm nay bạn đã nộp ' + c + ' bài Speaking — nghỉ ngơi và quay lại ngày mai nhé!' });
    }
    const turns = BANK.buildTest(exam, parts);
    const r = db.prepare('INSERT INTO speaking_sessions (user_id,exam,mode,parts,turns,created_at,assign_id) VALUES (?,?,?,?,?,?,?)').run(req.user.id, exam, mode, parts ? JSON.stringify(parts) : null, JSON.stringify(turns), now(), assignId);
    res.json({ id: Number(r.lastInsertRowid), exam, mode, parts, turns: turns.map(BANK.publicTurn) });
  });

  /* ───────── tải lên 1 đoạn ghi âm (1 lượt) ───────── */
  app.post('/api/speaking/:id/clip', requireAuth, (req, res) => {
    upload.single('file')(req, res, (err) => {
      const clean = () => { if (req.file) fs.unlink(req.file.path, () => {}); };
      if (err) return res.status(400).json({ error: 'Tệp ghi âm không hợp lệ hoặc quá lớn.' });
      const row = one('SELECT * FROM speaking_sessions WHERE id=?', Number(req.params.id));
      if (!row || row.user_id !== req.user.id) { clean(); return res.status(404).json({ error: 'Không tìm thấy bài.' }); }
      if (row.status !== 'open') { clean(); return res.status(409).json({ error: 'Bài này đã nộp.' }); }
      const turns = J(row.turns, []), ti = Number(req.body && req.body.turn);
      if (!req.file || !Number.isInteger(ti) || ti < 0 || ti >= turns.length) { clean(); return res.status(400).json({ error: 'Thiếu dữ liệu ghi âm.' }); }
      if (req.file.size > 6 * 1024 * 1024) { clean(); return res.status(413).json({ error: 'Đoạn ghi âm quá dài.' }); }
      const name = checkUpload(req.file, ['audio']);
      if (!name || !name.endsWith('.wav')) { if (name) fs.unlink(path.join(uploadsDir, name), () => {}); return res.status(400).json({ error: 'Chỉ nhận bản ghi định dạng WAV từ trình ghi âm của web.' }); }
      const full = path.join(uploadsDir, name);
      let m = null; try { m = SAI.measure(full); } catch (_) {}
      if (!m) { fs.unlink(full, () => {}); return res.status(400).json({ error: 'Không đọc được bản ghi âm.' }); }
      const clips = J(row.clips, {});
      if (clips[ti] && clips[ti].file) fs.unlink(path.join(uploadsDir, clips[ti].file), () => {});
      clips[ti] = { file: name, bytes: req.file.size, dur: m.dur };
      db.prepare('UPDATE speaking_sessions SET clips=? WHERE id=?').run(JSON.stringify(clips), row.id);
      res.json({ ok: true, dur: m.dur, speech: m.speech, silent: m.speech < 0.8 });
    });
  });

  /* ───────── nộp bài → xếp hàng chấm ───────── */
  const queue = []; let working = false;
  function enqueue(id) { if (!queue.includes(id)) queue.push(id); pump(); }
  async function pump() {
    if (working) return; working = true;
    try {
      while (queue.length) {
        const id = queue.shift();
        try { await gradeOne(id); } catch (e) { console.error('[speaking] lỗi chấm #' + id + ':', e.message); }
      }
    } finally { working = false; }
  }
  async function gradeOne(id) {
    const row = one('SELECT * FROM speaking_sessions WHERE id=?', id);
    if (!row || row.status !== 'grading') return;
    const turns = J(row.turns, []), clipsMeta = J(row.clips, {}), clips = [];
    for (const t of turns) { const c = clipsMeta[t.i]; if (c && c.file) { const full = path.join(uploadsDir, c.file); if (fs.existsSync(full)) clips.push({ turn: t, file: full, bytes: c.bytes || fs.statSync(full).size }); } }
    try {
      const result = await SAI.gradeSession(row.exam, turns, clips.map((c) => Object.assign({}, c, { m: SAI.measure(c.file) })));
      db.prepare("UPDATE speaking_sessions SET status='done', result=?, error=NULL, graded_at=? WHERE id=?").run(JSON.stringify(result), now(), id);
      const f = BANK.FORMATS[row.exam], ov = result.overall;
      try { notifyUser(row.user_id, 'speaking_done', '🎤 Đã chấm Speaking ' + f.short, 'Kết quả: ' + ov.value + (ov.unit === 'Band' ? ' band' : ov.unit) + ' — ' + ov.label + '. Xem nhận xét chi tiết.', '/speaking-result.html?id=' + id); } catch (_) {}
    } catch (e) {
      const msg = e.code === 'EMPTY' ? e.message : 'AI đang bận hoặc gặp lỗi tạm thời. Bạn bấm “Chấm lại” sau ít phút nhé.';
      db.prepare("UPDATE speaking_sessions SET status='error', error=? WHERE id=?").run(msg, id);
      console.error('[speaking] #' + id, e.message);
    }
  }
  app.post('/api/speaking/:id/submit', requireAuth, (req, res) => {
    const row = one('SELECT * FROM speaking_sessions WHERE id=?', Number(req.params.id));
    if (!row || row.user_id !== req.user.id) return res.status(404).json({ error: 'Không tìm thấy bài.' });
    if (row.status !== 'open') return res.json({ ok: true, status: row.status });
    if (!Object.keys(J(row.clips, {})).length) return res.status(400).json({ error: 'Bạn chưa ghi âm câu nào.' });
    db.prepare("UPDATE speaking_sessions SET status='grading', submitted_at=? WHERE id=?").run(now(), row.id);
    enqueue(row.id);
    res.json({ ok: true, status: 'grading' });
  });
  app.post('/api/speaking/:id/regrade', requireAuth, (req, res) => {
    const row = one('SELECT * FROM speaking_sessions WHERE id=?', Number(req.params.id));
    if (!row || !canSee(req.user, row)) return res.status(404).json({ error: 'Không tìm thấy bài.' });
    if (row.status !== 'error' && !(isStaff(req.user) && row.status === 'done')) return res.status(409).json({ error: 'Bài này không cần chấm lại.' });
    db.prepare("UPDATE speaking_sessions SET status='grading', error=NULL WHERE id=?").run(row.id);
    enqueue(row.id);
    res.json({ ok: true });
  });

  /* ───────── xem bài / lịch sử / xoá ───────── */
  app.get('/api/speaking/mine', requireAuth, (req, res) => {
    const ex = String(req.query.exam || '');
    const rows = all(`SELECT id,exam,mode,parts,status,result,teacher,created_at,submitted_at FROM speaking_sessions WHERE user_id=? AND status!='open' ${BANK.FORMATS[ex] ? 'AND exam=?' : ''} ORDER BY id DESC LIMIT 60`, ...(BANK.FORMATS[ex] ? [req.user.id, ex] : [req.user.id]));
    res.json({ items: rows.map((r) => { const rs = r.status === 'done' ? J(r.result, null) : null; return { id: r.id, exam: r.exam, mode: r.mode, parts: J(r.parts, null), status: r.status, at: r.submitted_at || r.created_at, overall: rs ? rs.overall : null, reviewed: !!J(r.teacher, null) }; }) });
  });
  app.get('/api/speaking/:id', requireAuth, (req, res) => {
    const row = one('SELECT * FROM speaking_sessions WHERE id=?', Number(req.params.id));
    if (!row || !canSee(req.user, row)) return res.status(404).json({ error: 'Không tìm thấy bài.' });
    res.set('Cache-Control', 'no-store');
    res.json(pub(row, req.user));
  });
  function dropFiles(row) { const c = J(row.clips, {}); for (const k of Object.keys(c)) if (c[k] && c[k].file) fs.unlink(path.join(uploadsDir, c[k].file), () => {}); }
  app.delete('/api/speaking/:id', requireAuth, (req, res) => {
    const row = one('SELECT * FROM speaking_sessions WHERE id=?', Number(req.params.id));
    if (!row || row.user_id !== req.user.id) return res.status(404).json({ error: 'Không tìm thấy bài.' });
    if (row.status === 'grading') return res.status(409).json({ error: 'Bài đang được chấm, hãy chờ xong rồi xoá.' });
    dropFiles(row); db.prepare('DELETE FROM speaking_sessions WHERE id=?').run(row.id);
    res.json({ ok: true });
  });

  /* ───────── giáo viên ───────── */
  const T = requireRole('teacher', 'admin');
  app.get('/api/teacher/speaking', T, (req, res) => {
    const u = req.user, admin = u.role === 'admin', gid = Number(req.query.class) || 0, ex = String(req.query.exam || ''), q = String(req.query.q || '').trim().toLowerCase();
    const groups = admin ? all('SELECT id,name FROM groups ORDER BY name COLLATE NOCASE') : all('SELECT id,name FROM groups WHERE teacher_id=? ORDER BY name COLLATE NOCASE', u.id);
    const gids = groups.filter((g) => !gid || g.id === gid).map((g) => g.id);
    if (!gids.length) return res.json({ groups, items: [] });
    const ph = gids.map(() => '?').join(',');
    const rows = all(`SELECT s.id,s.exam,s.mode,s.parts,s.status,s.result,s.teacher,s.submitted_at,s.created_at,u.id AS uid,u.name,u.email,
        (SELECT group_concat(g2.name, ', ') FROM group_members m2 JOIN groups g2 ON g2.id=m2.group_id WHERE m2.user_id=u.id AND g2.id IN (${ph})) AS classes
      FROM speaking_sessions s JOIN users u ON u.id=s.user_id
      WHERE s.status IN ('done','grading','error') AND u.id IN (SELECT user_id FROM group_members WHERE group_id IN (${ph})) ${BANK.FORMATS[ex] ? 'AND s.exam=?' : ''}
      ORDER BY s.id DESC LIMIT 300`, ...gids, ...gids, ...(BANK.FORMATS[ex] ? [ex] : []));
    let items = rows.map((r) => { const rs = r.status === 'done' ? J(r.result, null) : null, tv = J(r.teacher, null); return { id: r.id, exam: r.exam, mode: r.mode, parts: J(r.parts, null), status: r.status, at: r.submitted_at || r.created_at, student: r.name, email: r.email, classes: r.classes, overall: rs ? rs.overall : null, completion: rs ? rs.completion : null, reviewed: !!tv, teacher: tv }; });
    if (q) items = items.filter((x) => (x.student + ' ' + x.email).toLowerCase().includes(q));
    res.json({ groups, items });
  });
  app.post('/api/teacher/speaking/:id/review', T, (req, res) => {
    const row = one('SELECT * FROM speaking_sessions WHERE id=?', Number(req.params.id));
    if (!row || !canSee(req.user, row) || row.status !== 'done') return res.status(404).json({ error: 'Không tìm thấy bài đã chấm.' });
    const result = J(row.result, null), mx = result && result.criteria && result.criteria[0] ? result.criteria[0].max : 5, b = req.body || {};
    const scores = {};
    for (const c of (result && result.criteria) || []) { const v = b.scores && b.scores[c.key]; if (v !== undefined && v !== null && v !== '') { const n = Math.round(Number(v) * 2) / 2; if (Number.isFinite(n) && n >= 0 && n <= mx) scores[c.key] = n; } }
    const comment = String(b.comment || '').trim().slice(0, 1500);
    db.prepare('UPDATE speaking_sessions SET teacher=? WHERE id=?').run(JSON.stringify({ scores, comment, by: req.user.name, at: now() }), row.id);
    try { notifyUser(row.user_id, 'speaking_review', '👩‍🏫 Thầy/cô đã xem bài Speaking của bạn', comment ? comment.slice(0, 120) : 'Xem nhận xét của thầy/cô.', '/speaking-result.html?id=' + row.id); } catch (_) {}
    res.json({ ok: true });
  });

  /* ───────── GIAO BÀI SPEAKING CHO LỚP (tuỳ chọn) ───────── */
  const dlMs = (s) => { if (!s) return 0; const t = Date.parse(/[+-]\d{2}:?\d{2}$|Z$/i.test(s) ? s : (/^\d{4}-\d{2}-\d{2}$/.test(String(s)) ? s + 'T23:59:59' : String(s).replace(' ', 'T')) + '+07:00'); return isNaN(t) ? 0 : t; };
  const fmtVN = (iso) => { const t = dlMs(iso); if (!t) return ''; const d = new Date(t + 7 * 3600e3); return String(d.getUTCDate()).padStart(2, '0') + '/' + String(d.getUTCMonth() + 1).padStart(2, '0') + ' ' + String(d.getUTCHours()).padStart(2, '0') + ':' + String(d.getUTCMinutes()).padStart(2, '0'); };
  const ownGroup = (u, gid) => { const g = one('SELECT id,name,teacher_id FROM groups WHERE id=?', Number(gid)); return g && (u.role === 'admin' || g.teacher_id === u.id) ? g : null; };
  const partsLabel = (p) => (p && p.length ? 'Part ' + p.join(', ') : 'cả bài');

  app.post('/api/teacher/speaking/assign', T, (req, res) => {
    const b = req.body || {}, exam = String(b.exam || '');
    if (!BANK.FORMATS[exam]) return res.status(400).json({ error: 'Hãy chọn kỳ thi.' });
    const ids = [...new Set((Array.isArray(b.group_ids) ? b.group_ids : [b.group_id]).map(Number).filter(Boolean))];
    if (!ids.length) return res.status(400).json({ error: 'Hãy chọn ít nhất một lớp.' });
    let parts = null;
    if (Array.isArray(b.parts) && b.parts.length) parts = [...new Set(b.parts.map(Number))].filter((n) => BANK.FORMATS[exam].parts.some((p) => p.n === n)).sort();
    if (parts && parts.length === BANK.FORMATS[exam].parts.length) parts = null;
    const mode = b.mode === 'exam' ? 'exam' : 'practice';
    const dl = String(b.deadline || '').trim(); if (dl && !dlMs(dl)) return res.status(400).json({ error: 'Hạn nộp chưa đúng định dạng.' });
    const note = String(b.note || '').trim().slice(0, 500);
    const made = [];
    for (const gid of ids) {
      const g = ownGroup(req.user, gid); if (!g) return res.status(403).json({ error: 'Có lớp không phải của bạn.' });
      const r = db.prepare('INSERT INTO speaking_assign (group_id,assigned_by,exam,parts,mode,deadline,note,created_at) VALUES (?,?,?,?,?,?,?,?)').run(g.id, req.user.id, exam, parts ? JSON.stringify(parts) : null, mode, dl || null, note || null, now());
      const aid = Number(r.lastInsertRowid); made.push(aid);
      for (const m of all('SELECT user_id FROM group_members WHERE group_id=? AND user_id IS NOT NULL', g.id)) {
        try { notifyUser(m.user_id, 'speaking_assigned', '🎤 Bài Speaking mới từ thầy/cô: ' + BANK.FORMATS[exam].short + ' (' + partsLabel(parts) + ')', (dl ? 'Hạn: ' + fmtVN(dl) + '. ' : '') + (note ? note.slice(0, 120) : 'Ghi âm và nhận nhận xét từ AI.'), '/speaking.html'); } catch (_) {}
      }
    }
    res.json({ ok: true, ids: made });
  });

  function assignProgress(a) {
    const mem = all("SELECT u.id,u.name,u.email FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? AND u.role='student' ORDER BY u.name COLLATE NOCASE", a.group_id), dl = dlMs(a.deadline);
    return mem.map((u) => {
      const s = one("SELECT id,status,result,submitted_at FROM speaking_sessions WHERE user_id=? AND assign_id=? AND status IN ('grading','done','error') ORDER BY id DESC LIMIT 1", u.id, a.id);
      const rs = s && s.status === 'done' ? J(s.result, null) : null;
      return { id: u.id, name: u.name, email: u.email, status: s ? s.status : 'none', session: s ? s.id : null, overall: rs ? rs.overall : null, late: !!(s && dl && Date.parse(s.submitted_at) > dl + 60000) };
    });
  }
  app.get('/api/teacher/speaking/assign', T, (req, res) => {
    const u = req.user;
    const rows = u.role === 'admin' ? all('SELECT a.*, g.name AS gname FROM speaking_assign a JOIN groups g ON g.id=a.group_id ORDER BY a.id DESC LIMIT 100')
      : all('SELECT a.*, g.name AS gname FROM speaking_assign a JOIN groups g ON g.id=a.group_id WHERE g.teacher_id=? ORDER BY a.id DESC LIMIT 100', u.id);
    res.json({ items: rows.map((a) => { const p = assignProgress(a); return { id: a.id, group: a.gname, exam: a.exam, parts: J(a.parts, null), mode: a.mode, deadline: a.deadline, note: a.note, created_at: a.created_at, total: p.length, submitted: p.filter((x) => x.status !== 'none').length, students: p }; }) });
  });
  app.delete('/api/teacher/speaking/assign/:id', T, (req, res) => {
    const a = one('SELECT * FROM speaking_assign WHERE id=?', Number(req.params.id));
    if (!a || !ownGroup(req.user, a.group_id)) return res.status(404).json({ error: 'Không tìm thấy bài giao.' });
    db.prepare('UPDATE speaking_sessions SET assign_id=NULL WHERE assign_id=?').run(a.id);
    db.prepare('DELETE FROM speaking_assign WHERE id=?').run(a.id); db.prepare('DELETE FROM speaking_assign_notice WHERE assign_id=?').run(a.id);
    res.json({ ok: true });
  });
  // Học sinh: bài được giao trong các lớp của mình (chỉ để xem/làm — không bắt buộc)
  app.get('/api/speaking-assigned', requireAuth, (req, res) => {
    const rows = all(`SELECT a.*, g.name AS gname, u.name AS tname FROM speaking_assign a JOIN groups g ON g.id=a.group_id JOIN users u ON u.id=a.assigned_by
      WHERE a.group_id IN (SELECT group_id FROM group_members WHERE user_id=?) ORDER BY a.id DESC LIMIT 30`, req.user.id);
    res.json({ items: rows.map((a) => {
      const s = one("SELECT id,status,result,submitted_at FROM speaking_sessions WHERE user_id=? AND assign_id=? AND status IN ('grading','done','error') ORDER BY id DESC LIMIT 1", req.user.id, a.id), rs = s && s.status === 'done' ? J(s.result, null) : null, dl = dlMs(a.deadline);
      return { id: a.id, exam: a.exam, parts: J(a.parts, null), mode: a.mode, deadline: a.deadline, note: a.note, teacher: a.tname, group: a.gname, status: s ? s.status : 'none', session: s ? s.id : null, overall: rs ? rs.overall : null, overdue: !s && !!dl && dl < Date.now() };
    }) });
  });
  // Nhắc nhẹ (thông báo trong web): còn dưới 24 giờ & vừa quá hạn — chỉ cho bài có hạn, mỗi loại một lần
  function remindAssigned() {
    try {
      const t0 = Date.now();
      for (const a of all("SELECT * FROM speaking_assign WHERE deadline IS NOT NULL")) {
        const d = dlMs(a.deadline); if (!d) continue;
        const kind = d > t0 && d - t0 <= 24 * 3600e3 ? 'pre' : (d <= t0 && t0 - d <= 48 * 3600e3 ? 'over' : null); if (!kind) continue;
        for (const m of all("SELECT u.id FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? AND u.role='student'", a.group_id)) {
          if (one("SELECT 1 AS c FROM speaking_sessions WHERE user_id=? AND assign_id=? AND status IN ('grading','done')", m.id, a.id)) continue;
          if (db.prepare('INSERT OR IGNORE INTO speaking_assign_notice (assign_id,user_id,kind) VALUES (?,?,?)').run(a.id, m.id, kind).changes)
            notifyUser(m.id, 'speaking_deadline', (kind === 'pre' ? '⏰ Sắp đến hạn bài Speaking ' : '⚠️ Đã quá hạn bài Speaking ') + BANK.FORMATS[a.exam].short, 'Hạn: ' + fmtVN(a.deadline) + '. Ghi âm khi bạn sẵn sàng nhé.', '/speaking.html');
        }
      }
    } catch (e) { console.error('[speaking] nhắc hạn:', e.message); }
  }
  setTimeout(() => { remindAssigned(); setInterval(remindAssigned, 20 * 60 * 1000).unref(); }, 45_000).unref();

  /* ───────── dọn dẹp & khôi phục ───────── */
  function cleanup() {
    try {
      const cut = new Date(Date.now() - KEEP_DAYS * 86400000).toISOString();
      for (const r of all("SELECT * FROM speaking_sessions WHERE created_at<? AND clips!='{}' AND status IN ('done','error')", cut)) { dropFiles(r); db.prepare("UPDATE speaking_sessions SET clips='{}' WHERE id=?").run(r.id); }
      for (const r of all("SELECT * FROM speaking_sessions WHERE status='open' AND created_at<?", new Date(Date.now() - 86400000).toISOString())) { dropFiles(r); db.prepare('DELETE FROM speaking_sessions WHERE id=?').run(r.id); }
    } catch (e) { console.error('[speaking] dọn dẹp:', e.message); }
  }
  setTimeout(() => {
    for (const r of all("SELECT id FROM speaking_sessions WHERE status='grading' ORDER BY id")) enqueue(r.id);
    cleanup(); setInterval(cleanup, 6 * 3600e3).unref();
  }, 20_000).unref();
};
