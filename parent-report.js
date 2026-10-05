'use strict';
// 👪 Báo cáo tuần cho phụ huynh: tự gửi email vào tối Chủ nhật (giờ Việt Nam) cho phụ huynh đã được giáo viên đăng ký.
// Nội dung tính từ dữ liệu học thật của 7 ngày gần nhất. Chỉ gửi điểm đã chấm xong — không gửi đáp án hay danh sách lỗi.
const crypto = require('crypto');
const BD = require('./js/badges.js');

module.exports = function (app, deps) {
  const { db, requireRole, notifyUser, now, sendBrevoEmail, emailEnabled, htmlEsc } = deps;
  const T = requireRole('teacher', 'admin');
  const isAdmin = (u) => u.role === 'admin';
  const EMAIL_RE = /^[^\s@,;<>"]+@[^\s@,;<>"]+\.[^\s@,;<>"]+$/;
  const BASE = () => (process.env.BASE_URL || 'https://engwithtom.online').replace(/\/$/, '');
  const DAY = 86400000;
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const all = (sql, ...a) => db.prepare(sql).all(...a);
  const dlMs = (s) => { if (!s) return 0; const t = Date.parse(/[+-]\d{2}:?\d{2}$|Z$/i.test(s) ? s : (/^\d{4}-\d{2}-\d{2}$/.test(String(s)) ? s + 'T23:59:59' : String(s).replace(' ', 'T')) + '+07:00'); return isNaN(t) ? 0 : t; };
  const vnDayOf = (ms) => new Date(ms + 7 * 3600e3).toISOString().slice(0, 10);
  const vnStartMs = (day) => Date.parse(day + 'T00:00:00+07:00');
  const dmy = (day) => day.slice(8, 10) + '/' + day.slice(5, 7);
  const cleanName = (v) => String(v || '').normalize('NFC').replace(/[\u0000-\u001f\u007f<>"`{}\\&$%^*=|;]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
  const firstName = (n) => String(n || '').trim().split(/\s+/).pop() || 'em';

  function canManage(user, sid) {
    if (isAdmin(user)) return true;
    return !!one('SELECT 1 AS c FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id=? AND g.teacher_id=? LIMIT 1', sid, user.id);
  }

  /* ───────────── Tính số liệu 7 ngày gần nhất ───────────── */
  function collect(st, endMs) {
    const endDay = vnDayOf(endMs), startDay = vnDayOf(endMs - 6 * DAY), prevStartDay = vnDayOf(endMs - 13 * DAY);
    const startMs = vnStartMs(startDay), prevMs = vnStartMs(prevStartDay);
    const sid = st.id;
    const daysIn = (from, to) => {
      const set = new Set();
      for (const r of all('SELECT day FROM word_daily WHERE user_id=? AND day>=? AND day<=? AND (reviews>0 OR xp>0)', sid, from, to)) set.add(r.day);
      for (const r of all('SELECT submitted_at AS t FROM submissions WHERE user_id=? AND submitted_at>=?', sid, new Date(vnStartMs(from)).toISOString())) { const d = vnDayOf(Date.parse(r.t)); if (d >= from && d <= to) set.add(d); }
      for (const r of all("SELECT finished_at AS t FROM dictation_runs WHERE user_id=? AND finished_at IS NOT NULL AND finished_at>=?", sid, new Date(vnStartMs(from)).toISOString())) { const d = vnDayOf(Date.parse(r.t)); if (d >= from && d <= to) set.add(d); }
      return set;
    };
    const active = daysIn(startDay, endDay), activePrev = daysIn(prevStartDay, vnDayOf(endMs - 7 * DAY));

    // bài nộp trong tuần: mỗi đề lấy lần nộp mới nhất
    const subs = all(`SELECT s.id, s.exercise_id, s.status, s.score, s.max_score, s.submitted_at, e.title, e.skill, e.program
      FROM submissions s JOIN exercises e ON e.id=s.exercise_id
      WHERE s.user_id=? AND s.submitted_at>=? AND s.id=(SELECT MAX(x.id) FROM submissions x WHERE x.user_id=s.user_id AND x.exercise_id=s.exercise_id AND x.submitted_at>=?)
      ORDER BY s.submitted_at ASC LIMIT 40`, sid, new Date(startMs).toISOString(), new Date(startMs).toISOString());
    const work = subs.map((s) => ({ title: s.title, skill: s.skill || '', pct: (s.status === 'graded' && s.max_score > 0 && s.score != null) ? Math.round(s.score / s.max_score * 100) : null }));
    const graded = work.filter((w) => w.pct != null);
    const avg = graded.length ? Math.round(graded.reduce((a, w) => a + w.pct, 0) / graded.length) : null;

    // bài được giao: quá hạn / sắp đến hạn / nộp đúng hạn trong tuần
    const asg = all(`SELECT a.exercise_id, a.deadline, e.title FROM assignments a JOIN exercises e ON e.id=a.exercise_id WHERE a.student_email=? AND a.deadline IS NOT NULL ORDER BY a.id DESC LIMIT 400`, st.email);
    const overdue = [], soon = []; let ontimeWeek = 0;
    const seenEx = new Set();
    for (const a of asg) {
      if (seenEx.has(a.exercise_id)) continue; seenEx.add(a.exercise_id);
      const d = dlMs(a.deadline); if (!d) continue;
      const sub = one('SELECT MIN(submitted_at) AS t FROM submissions WHERE user_id=? AND exercise_id=?', sid, a.exercise_id);
      if (sub && sub.t) { const t = Date.parse(sub.t); if (t >= startMs && t <= d + 60000) ontimeWeek++; continue; }
      if (d < endMs && d > endMs - 30 * DAY) overdue.push({ title: a.title, dl: vnDayOf(d) });
      else if (d >= endMs && d <= endMs + 7 * DAY) soon.push({ title: a.title, dl: vnDayOf(d) });
    }
    soon.sort((x, y) => x.dl.localeCompare(y.dl));

    // từ vựng
    const wd = one('SELECT COALESCE(SUM(new_words),0) AS nw, COALESCE(SUM(reviews),0) AS rv, COALESCE(SUM(correct),0) AS ok FROM word_daily WHERE user_id=? AND day>=? AND day<=?', sid, startDay, endDay);
    const wg = one('SELECT streak, last_day FROM word_game WHERE user_id=?', sid) || {};
    const streak = (wg.last_day && wg.last_day >= vnDayOf(endMs - DAY)) ? (wg.streak || 0) : 0;
    const mastered = one('SELECT COUNT(*) AS c FROM word_progress WHERE user_id=? AND box>=3', sid).c;

    // chép chính tả
    const dr = all("SELECT score FROM dictation_runs WHERE user_id=? AND mode='dictate' AND finished_at>=? AND score IS NOT NULL", sid, new Date(startMs).toISOString());
    const dict = { n: dr.length, avg: dr.length ? Math.round(dr.reduce((a, r) => a + r.score, 0) / dr.length) : null };

    const sp = all("SELECT result FROM speaking_sessions WHERE user_id=? AND status='done' AND graded_at>=?", sid, new Date(startMs).toISOString());
    const speaking = { n: sp.length, best: sp.map((r) => { try { return JSON.parse(r.result).overall; } catch (_) { return null; } }).filter(Boolean) };

    const badges = all('SELECT key, tier FROM achievements WHERE user_id=? AND unlocked_at>=? ORDER BY unlocked_at', sid, new Date(startMs).toISOString())
      .map((r) => { const a = BD.find(r.key); return a ? { icon: a.icon, name: a.name, tier: BD.TIER_NAME[BD.look(a.tiers.length, r.tier - 1)] } : null; }).filter(Boolean).slice(0, 5);

    return { startDay, endDay, activeDays: active.size, prevActive: activePrev.size, work, avg, graded: graded.length, pending: work.length - graded.length, overdue, soon: soon.slice(0, 5), ontimeWeek,
      speaking, words: { fresh: wd.nw, reviews: wd.rv, acc: wd.rv > 0 ? Math.round(wd.ok / wd.rv * 100) : null, mastered }, streak, dict, badges };
  }

  // Nhận xét bằng lời — nêu điểm sáng trước, rồi mới đến việc cần đồng hành
  function remarks(st, d) {
    const nm = firstName(st.name), good = [], todo = [];
    if (d.activeDays >= 5) good.push(nm + ' học rất đều: <b>' + d.activeDays + '/7 ngày</b> trong tuần.');
    else if (d.activeDays >= 3) good.push(nm + ' đã học <b>' + d.activeDays + '/7 ngày</b> — khá đều đặn.');
    if (d.activeDays > d.prevActive && d.prevActive >= 0 && d.activeDays >= 2) good.push('Số ngày học tăng so với tuần trước (' + d.prevActive + ' → ' + d.activeDays + ').');
    if (d.avg != null && d.avg >= 80) good.push('Điểm trung bình các bài đã chấm là <b>' + d.avg + '%</b> — kết quả tốt.');
    else if (d.avg != null && d.avg >= 65) good.push('Điểm trung bình các bài đã chấm là <b>' + d.avg + '%</b> — mức khá.');
    if (d.ontimeWeek > 0) good.push('Nộp đúng hạn <b>' + d.ontimeWeek + '</b> bài được giao.');
    if (d.words.fresh >= 10) good.push('Học thêm <b>' + d.words.fresh + ' từ mới</b>.');
    if (d.streak >= 3) good.push('Đang giữ chuỗi học <b>' + d.streak + ' ngày liên tiếp</b> 🔥.');
    if (d.dict.avg != null && d.dict.avg >= 80) good.push('Luyện chép chính tả đạt trung bình <b>' + d.dict.avg + '%</b>.');
    if (d.activeDays === 0) todo.push('Tuần này ' + nm + ' chưa học trên web. Phụ huynh có thể nhắc con dành khoảng 15 phút mỗi ngày — đều đặn sẽ hiệu quả hơn học dồn.');
    else if (d.activeDays <= 2) todo.push(nm + ' mới học ' + d.activeDays + '/7 ngày. Mục tiêu nhỏ cho tuần tới: học ít nhất 4 ngày, mỗi ngày 15 phút.');
    if (d.overdue.length) todo.push('Có <b>' + d.overdue.length + ' bài đã quá hạn</b> chưa nộp: ' + d.overdue.slice(0, 3).map((o) => '“' + htmlEsc(o.title) + '”').join(', ') + (d.overdue.length > 3 ? '…' : '') + '. Phụ huynh nhắc con hoàn thành sớm nhé.');
    if (d.soon.length) todo.push('Sắp đến hạn: ' + d.soon.slice(0, 3).map((o) => '“' + htmlEsc(o.title) + '” (' + dmy(o.dl) + ')').join(', ') + '.');
    if (d.avg != null && d.avg < 50) todo.push('Điểm các bài đã chấm còn thấp (' + d.avg + '%). Thầy/cô sẽ hỗ trợ thêm; ở nhà, con nên xem lại phần giải thích sau mỗi bài.');
    if (d.words.acc != null && d.words.reviews >= 20 && d.words.acc < 60) todo.push('Độ chính xác khi ôn từ còn ' + d.words.acc + '% — nên ôn lại các từ hay sai thường xuyên hơn.');
    if (!good.length && d.activeDays > 0) good.push(nm + ' đã duy trì việc học trong tuần — cố gắng này rất đáng ghi nhận.');
    return { good, todo };
  }

  const skillVN = (s) => ({ Reading: 'Đọc', Listening: 'Nghe', Writing: 'Viết', Speaking: 'Nói', Grammar: 'Ngữ pháp', Vocabulary: 'Từ vựng' }[s] || s);
  function tile(label, value, sub, color) {
    return '<td style="width:50%;padding:4px"><div style="background:#F6F5FF;border-radius:12px;padding:12px 6px;text-align:center"><div style="font-size:24px;font-weight:800;color:' + color + ';line-height:1.1">' + value + '</div><div style="font-size:12px;color:#6B6880;margin-top:4px">' + label + '</div>' + (sub ? '<div style="font-size:11px;color:#9C99AE">' + sub + '</div>' : '') + '</div></td>';
  }
  function sect(title, inner) { return '<div style="margin:18px 0 0"><div style="font-weight:800;font-size:15px;color:#2E2B45;margin-bottom:8px">' + title + '</div>' + inner + '</div>'; }

  function renderEmail(st, d, opts) {
    opts = opts || {};
    const nm = firstName(st.name), greet = st.parent_name ? htmlEsc(st.parent_name) : 'Quý phụ huynh';
    const r = remarks(st, d);
    const rows = d.work.length ? d.work.map((w) => '<tr><td style="padding:7px 8px;border-bottom:1px solid #EEECF7;font-size:14px">' + htmlEsc(w.title) + (w.skill ? ' <span style="color:#9C99AE;font-size:12px">· ' + htmlEsc(skillVN(w.skill)) + '</span>' : '') + '</td><td style="padding:7px 8px;border-bottom:1px solid #EEECF7;text-align:right;font-weight:800;font-size:14px;white-space:nowrap;color:' + (w.pct == null ? '#B45309' : w.pct >= 80 ? '#059669' : w.pct >= 50 ? '#D97706' : '#DC2626') + '">' + (w.pct == null ? 'chờ chấm' : w.pct + '%') + '</td></tr>').join('') : '';
    const body =
      '<div style="font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#2E2B45;line-height:1.65;max-width:600px;margin:0 auto">' +
      '<div style="background:linear-gradient(135deg,#6F58EE,#4F8BF0);padding:22px 24px;border-radius:14px 14px 0 0;color:#fff"><div style="font-size:13px;opacity:.9">English With Tom</div><div style="font-size:21px;font-weight:800;margin-top:2px">Báo cáo học tập tuần của ' + htmlEsc(st.name) + '</div><div style="font-size:13px;opacity:.9;margin-top:4px">' + dmy(d.startDay) + ' – ' + dmy(d.endDay) + '</div></div>' +
      '<div style="background:#fff;padding:22px 24px;border:1px solid #E8E6F2;border-top:0;border-radius:0 0 14px 14px">' +
      '<p style="margin:0 0 6px">Kính gửi ' + greet + ',</p>' +
      '<p style="margin:0 0 10px;color:#4B4863">Dưới đây là tóm tắt việc học của <b>' + htmlEsc(nm) + '</b> trong 7 ngày qua trên English With Tom.</p>' +
      (st.note ? '<div style="background:#FFF8E1;border-left:4px solid #F0B429;padding:12px 14px;border-radius:8px;margin:12px 0"><div style="font-size:12px;color:#8A6D00;font-weight:700;margin-bottom:2px">💬 Lời nhắn của giáo viên</div>' + htmlEsc(st.note).replace(/\n/g, '<br>') + '</div>' : '') +
      '<table role="presentation" width="100%" style="border-collapse:collapse;margin:8px -4px 0"><tr>' +
        tile('Ngày học', d.activeDays + '/7', d.prevActive ? 'tuần trước ' + d.prevActive : '', '#6F58EE') +
        tile('Điểm TB', d.avg == null ? '—' : d.avg + '%', d.graded ? d.graded + ' bài đã chấm' : 'chưa có bài chấm', d.avg == null ? '#9C99AE' : d.avg >= 80 ? '#059669' : d.avg >= 50 ? '#D97706' : '#DC2626') +
      '</tr><tr>' +
        tile('Bài đã nộp', d.work.length, d.ontimeWeek ? d.ontimeWeek + ' đúng hạn' : '', '#4F8BF0') +
        tile('Từ mới', d.words.fresh, d.words.reviews + ' lượt ôn', '#E57C2B') +
      '</tr></table>' +
      (r.good.length ? sect('🌟 Điểm sáng', '<ul style="margin:0;padding-left:20px;font-size:14.5px">' + r.good.map((x) => '<li style="margin:3px 0">' + x + '</li>').join('') + '</ul>') : '') +
      (r.todo.length ? sect('🤝 Phụ huynh có thể đồng hành', '<ul style="margin:0;padding-left:20px;font-size:14.5px">' + r.todo.map((x) => '<li style="margin:3px 0">' + x + '</li>').join('') + '</ul>') : '') +
      (rows ? sect('📝 Bài đã nộp trong tuần', '<table role="presentation" width="100%" style="border-collapse:collapse">' + rows + '</table>' + (d.pending ? '<div style="font-size:12px;color:#9C99AE;margin-top:4px">“Chờ chấm”: thầy/cô sẽ chấm và gửi kết quả sau.</div>' : '')) : '') +
      sect('📚 Từ vựng &amp; luyện nghe', '<div style="font-size:14.5px">Đã thuộc tổng cộng <b>' + d.words.mastered + '</b> từ' + (d.words.acc != null ? ' · độ chính xác khi ôn tuần này <b>' + d.words.acc + '%</b>' : '') + (d.streak ? ' · chuỗi học <b>' + d.streak + ' ngày</b>' : '') + (d.dict.n ? '<br>Chép chính tả: <b>' + d.dict.n + '</b> lượt' + (d.dict.avg != null ? ', trung bình <b>' + d.dict.avg + '%</b>' : '') : '') + (d.speaking.n ? '<br>Luyện nói (Speaking): <b>' + d.speaking.n + '</b> bài' + (d.speaking.best.length ? ', gần nhất đạt <b>' + htmlEsc(d.speaking.best[d.speaking.best.length - 1].value + (d.speaking.best[d.speaking.best.length - 1].unit === 'Band' ? ' band' : d.speaking.best[d.speaking.best.length - 1].unit)) + '</b>' : '') : '') + '</div>') +
      (d.badges.length ? sect('🏅 Huy hiệu mới', '<div style="font-size:14.5px">' + d.badges.map((b) => b.icon + ' ' + htmlEsc(b.name) + ' (' + b.tier + ')').join(' · ') + '</div>') : '') +
      '<p style="margin:22px 0 4px;color:#4B4863">Cảm ơn Quý phụ huynh đã luôn đồng hành cùng ' + htmlEsc(nm) + '. Nếu cần trao đổi thêm, xin liên hệ trực tiếp thầy/cô.</p>' +
      '<p style="margin:0;color:#4B4863">Trân trọng,<br><b>' + htmlEsc(st.teacher || 'English With Tom') + '</b></p>' +
      '<hr style="border:0;border-top:1px solid #EEECF7;margin:20px 0 10px">' +
      '<div style="font-size:12px;color:#9C99AE">Báo cáo được tổng hợp tự động từ dữ liệu học trên ' + BASE().replace(/^https?:\/\//, '') + ' và gửi vào tối Chủ nhật hằng tuần. ' +
      (opts.unsub ? '<a href="' + opts.unsub + '" style="color:#9C99AE">Không muốn nhận báo cáo nữa</a>.' : '') + '</div>' +
      '</div></div>';
    return { subject: (opts.prefix || '') + '📊 Báo cáo tuần ' + dmy(d.startDay) + '–' + dmy(d.endDay) + ' của ' + st.name + ' — English With Tom', html: body };
  }

  function loadStudent(sid) {
    const st = one("SELECT id,name,email,parent_email,parent_name,parent_report,parent_note AS note,parent_token,parent_unsub_at FROM users WHERE id=? AND role='student'", sid);
    if (!st) return null;
    const t = one('SELECT u.name FROM group_members gm JOIN groups g ON g.id=gm.group_id JOIN users u ON u.id=g.teacher_id WHERE gm.user_id=? ORDER BY gm.id LIMIT 1', sid);
    st.teacher = t ? t.name : '';
    return st;
  }
  function ensureToken(st) {
    if (st.parent_token) return st.parent_token;
    const t = crypto.randomBytes(18).toString('hex');
    db.prepare('UPDATE users SET parent_token=? WHERE id=?').run(t, st.id); st.parent_token = t; return t;
  }
  function build(st, kind) {
    const d = collect(st, Date.now());
    return renderEmail(st, d, { unsub: BASE() + '/api/parent-report/unsub?t=' + ensureToken(st), prefix: kind === 'me' ? '[Gửi thử] ' : '' });
  }

  async function sendTo(st, to, kind) {
    const m = build(st, kind);
    const r = await sendBrevoEmail({ email: to, name: kind === 'me' ? to : (st.parent_name || 'Phụ huynh ' + st.name) }, m.subject, m.html);
    if (kind !== 'me') {
      db.prepare('INSERT INTO parent_reports (user_id,to_email,kind,ok,sent_at) VALUES (?,?,?,?,?)').run(st.id, to, kind, r.ok ? 1 : 0, now());
      if (r.ok && st.note) db.prepare('UPDATE users SET parent_note=NULL WHERE id=?').run(st.id);
    }
    return r;
  }

  /* ───────────── API cho giáo viên ───────────── */
  app.get('/api/parent-report/students', T, (req, res) => {
    const u = req.user, gid = Number(req.query.group) || 0;
    const groups = isAdmin(u) ? all('SELECT id,name FROM groups ORDER BY name COLLATE NOCASE') : all('SELECT id,name FROM groups WHERE teacher_id=? ORDER BY name COLLATE NOCASE', u.id);
    const ids = groups.filter((g) => !gid || g.id === gid).map((g) => g.id);
    let rows = [];
    if (ids.length) rows = all(`SELECT DISTINCT us.id, us.name, us.email, us.parent_email, us.parent_name, us.parent_report, us.parent_note, us.parent_unsub_at,
        (SELECT group_concat(g2.name, ', ') FROM group_members m2 JOIN groups g2 ON g2.id=m2.group_id WHERE m2.user_id=us.id AND g2.id IN (${ids.map(() => '?').join(',')})) AS classes,
        (SELECT sent_at FROM parent_reports pr WHERE pr.user_id=us.id AND pr.ok=1 ORDER BY pr.id DESC LIMIT 1) AS last_sent
      FROM group_members gm JOIN users us ON us.id=gm.user_id WHERE gm.group_id IN (${ids.map(() => '?').join(',')}) AND us.role='student'
      ORDER BY us.name COLLATE NOCASE`, ...ids, ...ids);
    res.json({ groups, students: rows, email_ready: emailEnabled() });
  });

  app.post('/api/parent-report/set', T, (req, res) => {
    const b = req.body || {}, sid = Number(b.user_id);
    if (!sid || !canManage(req.user, sid)) return res.status(403).json({ error: 'Học sinh này không thuộc lớp của bạn.' });
    const st = loadStudent(sid); if (!st) return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
    const pe = String(b.parent_email || '').trim().toLowerCase();
    if (pe && !EMAIL_RE.test(pe)) return res.status(400).json({ error: 'Email phụ huynh chưa đúng định dạng.' });
    const changed = pe !== (st.parent_email || '');
    const stillUnsub = !changed && st.parent_unsub_at;
    const enabled = pe && b.enabled && !stillUnsub ? 1 : 0;
    db.prepare('UPDATE users SET parent_email=?, parent_name=?, parent_report=?, parent_note=?, parent_unsub_at=? WHERE id=?')
      .run(pe || null, cleanName(b.parent_name) || null, enabled, String(b.note || '').slice(0, 600).trim() || null, changed ? null : st.parent_unsub_at, sid);
    if (pe) ensureToken(st);
    res.json({ ok: true });
  });

  // Dán nhiều dòng: email học sinh, email phụ huynh[, tên phụ huynh]
  app.post('/api/parent-report/bulk', T, (req, res) => {
    const lines = String((req.body || {}).lines || '').split(/\r?\n/).map((x) => x.trim()).filter(Boolean).slice(0, 500);
    if (!lines.length) return res.status(400).json({ error: 'Hãy dán danh sách (mỗi dòng: email học sinh, email phụ huynh).' });
    const out = { ok: 0, bad: [], notYours: [], unknown: [], unsub: [] };
    for (const ln of lines) {
      const em = ln.match(/[^\s@,;\t]+@[^\s@,;\t]+\.[^\s@,;\t]+/g) || [];
      if (em.length < 2) { out.bad.push(ln.slice(0, 60)); continue; }
      const se = em[0].toLowerCase(), pe = em[1].toLowerCase();
      if (!EMAIL_RE.test(pe)) { out.bad.push(ln.slice(0, 60)); continue; }
      const nameTxt = cleanName(ln.slice(ln.toLowerCase().indexOf(pe) + pe.length).replace(/^[\s,;\t]+/, ''));
      const st = one("SELECT id,parent_email,parent_unsub_at FROM users WHERE email=? AND role='student'", se);
      if (!st) { out.unknown.push(se); continue; }
      if (!canManage(req.user, st.id)) { out.notYours.push(se); continue; }
      if (st.parent_unsub_at && st.parent_email === pe) { out.unsub.push(se); continue; }
      db.prepare('UPDATE users SET parent_email=?, parent_name=COALESCE(?,parent_name), parent_report=1, parent_unsub_at=NULL WHERE id=?').run(pe, nameTxt || null, st.id);
      ensureToken(loadStudent(st.id)); out.ok++;
    }
    res.json({ ok: true, ...out });
  });

  app.post('/api/parent-report/enable-class', T, (req, res) => {
    const gid = Number((req.body || {}).group_id), on = (req.body || {}).enabled ? 1 : 0;
    const g = one('SELECT id,teacher_id FROM groups WHERE id=?', gid);
    if (!g || (!isAdmin(req.user) && g.teacher_id !== req.user.id)) return res.status(403).json({ error: 'Không phải lớp của bạn.' });
    const r = db.prepare(`UPDATE users SET parent_report=? WHERE parent_email IS NOT NULL AND parent_unsub_at IS NULL AND id IN (SELECT user_id FROM group_members WHERE group_id=?)`).run(on, gid);
    res.json({ ok: true, changed: Number(r.changes) });
  });

  app.get('/api/parent-report/preview/:uid', T, (req, res) => {
    const sid = Number(req.params.uid);
    if (!canManage(req.user, sid)) return res.status(403).json({ error: 'Học sinh này không thuộc lớp của bạn.' });
    const st = loadStudent(sid); if (!st) return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
    const m = build(st, 'preview'); res.json({ subject: m.subject, html: m.html, to: st.parent_email || null });
  });

  app.post('/api/parent-report/send', T, async (req, res) => {
    const sid = Number((req.body || {}).user_id), to = (req.body || {}).to === 'me' ? 'me' : 'parent';
    if (!canManage(req.user, sid)) return res.status(403).json({ error: 'Học sinh này không thuộc lớp của bạn.' });
    if (!emailEnabled()) return res.status(400).json({ error: 'Email chưa được cấu hình trên máy chủ (BREVO_API_KEY / FROM_EMAIL).' });
    const st = loadStudent(sid); if (!st) return res.status(404).json({ error: 'Không tìm thấy học sinh.' });
    let addr;
    if (to === 'me') { addr = req.user.email; }
    else {
      if (!st.parent_email) return res.status(400).json({ error: 'Chưa có email phụ huynh của học sinh này.' });
      if (st.parent_unsub_at) return res.status(400).json({ error: 'Phụ huynh đã chọn không nhận báo cáo nữa.' });
      const last = one('SELECT sent_at FROM parent_reports WHERE user_id=? AND ok=1 ORDER BY id DESC LIMIT 1', sid);
      if (last && Date.now() - Date.parse(last.sent_at) < 10 * 60 * 1000) return res.status(429).json({ error: 'Vừa gửi cách đây chưa đến 10 phút.' });
      addr = st.parent_email;
    }
    const r = await sendTo(st, addr, to === 'me' ? 'me' : 'manual');
    if (!r.ok) return res.status(502).json({ error: 'Gửi không được: ' + (r.detail ? String(r.detail).slice(0, 120) : 'lỗi email') });
    res.json({ ok: true, to: addr });
  });

  /* ───────────── Huỷ nhận (phụ huynh bấm trong email, không cần đăng nhập) ───────────── */
  const page = (msg, form) => '<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Báo cáo tuần — English With Tom</title></head><body style="font-family:-apple-system,Segoe UI,Arial,sans-serif;background:#F6F5FF;margin:0;padding:24px"><div style="max-width:440px;margin:40px auto;background:#fff;border-radius:16px;padding:28px;text-align:center;box-shadow:0 8px 30px rgba(111,88,238,.12)"><div style="font-size:42px">📬</div><p style="font-size:16px;color:#2E2B45;line-height:1.6">' + msg + '</p>' + (form || '') + '</div></body></html>';
  app.get('/api/parent-report/unsub', (req, res) => {
    const t = String(req.query.t || '');
    const st = t.length >= 20 && one('SELECT id,name FROM users WHERE parent_token=?', t);
    res.set('Cache-Control', 'no-store');
    if (!st) return res.status(404).send(page('Liên kết không còn hiệu lực.'));
    res.send(page('Bạn muốn ngừng nhận báo cáo học tập hằng tuần của <b>' + htmlEsc(st.name) + '</b>?', '<form method="post" action="/api/parent-report/unsub?t=' + encodeURIComponent(t) + '"><button style="background:#6F58EE;color:#fff;border:0;border-radius:10px;padding:12px 26px;font-size:15px;font-weight:700;cursor:pointer">Ngừng nhận báo cáo</button></form>'));
  });
  app.post('/api/parent-report/unsub', (req, res) => {
    const t = String(req.query.t || '');
    const st = t.length >= 20 && one('SELECT id FROM users WHERE parent_token=?', t);
    res.set('Cache-Control', 'no-store');
    if (!st) return res.status(404).send(page('Liên kết không còn hiệu lực.'));
    db.prepare('UPDATE users SET parent_report=0, parent_unsub_at=? WHERE id=?').run(now(), st.id);
    res.send(page('Đã ghi nhận. Bạn sẽ không nhận báo cáo tuần nữa. Cảm ơn bạn đã đồng hành cùng con!'));
  });

  /* ───────────── Gửi tự động: Chủ nhật 18:00 → Thứ hai 12:00 (giờ Việt Nam) ───────────── */
  let busy = false;
  async function runWeekly(force) {
    if (busy) return { skipped: 'busy' };
    const vn = new Date(Date.now() + 7 * 3600e3), dow = vn.getUTCDay(), hr = vn.getUTCHours();
    if (!force && !((dow === 0 && hr >= 18) || (dow === 1 && hr < 12))) return { skipped: 'ngoài khung giờ' };
    if (!emailEnabled()) return { skipped: 'email chưa cấu hình' };
    busy = true;
    const stat = { sent: 0, failed: 0 }, perTeacher = new Map();
    try {
      const cand = all("SELECT id FROM users WHERE role='student' AND parent_report=1 AND parent_email IS NOT NULL AND parent_unsub_at IS NULL LIMIT 1500");
      for (const c of cand) {
        if (stat.sent + stat.failed >= 250) break; // giới hạn mỗi lượt chạy (đợt sau sẽ gửi tiếp)
        if (one('SELECT 1 AS c FROM parent_reports WHERE user_id=? AND ok=1 AND sent_at>?', c.id, new Date(Date.now() - 5 * DAY).toISOString())) continue;
        if ((one('SELECT COUNT(*) AS c FROM parent_reports WHERE user_id=? AND ok=0 AND sent_at>?', c.id, new Date(Date.now() - 20 * 3600e3).toISOString()) || {}).c >= 2) continue;
        const st = loadStudent(c.id); if (!st || !EMAIL_RE.test(st.parent_email || '')) continue;
        let r; try { r = await sendTo(st, st.parent_email, 'auto'); } catch (e) { r = { ok: false }; }
        if (r.ok) stat.sent++; else stat.failed++;
        const tid = (one('SELECT g.teacher_id AS t FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id=? ORDER BY gm.id LIMIT 1', c.id) || {}).t;
        if (tid) { const o = perTeacher.get(tid) || { ok: 0, bad: 0 }; r.ok ? o.ok++ : o.bad++; perTeacher.set(tid, o); }
        await new Promise((res) => setTimeout(res, 500));
      }
      for (const [tid, o] of perTeacher) {
        try { notifyUser(tid, 'parent_report', '👪 Đã gửi báo cáo tuần cho ' + o.ok + ' phụ huynh' + (o.bad ? ' (' + o.bad + ' email lỗi)' : ''), 'Báo cáo học tập 7 ngày qua đã được gửi tự động.', '/teacher-parents.html'); } catch (_) {}
      }
      if (stat.sent || stat.failed) console.log('👪 Báo cáo phụ huynh: gửi ' + stat.sent + ', lỗi ' + stat.failed);
    } finally { busy = false; }
    return stat;
  }
  app.post('/api/admin/parent-report/run', requireRole('admin'), async (req, res) => {
    try { res.json({ ok: true, ...(await runWeekly(true)) }); } catch (e) { console.error('[parent-report]', e.message); res.status(500).json({ error: 'Chạy thất bại.' }); }
  });
  setTimeout(() => { runWeekly().catch(console.error); setInterval(() => runWeekly().catch(console.error), 15 * 60 * 1000); }, 60_000).unref();
};
