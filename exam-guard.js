'use strict';
// Chế độ thi (chống gian lận): ghi nhận học sinh rời trang / chuyển tab / mở lại trang khi làm bài được giáo viên bật "chế độ thi".
// Máy chủ là nơi đếm (học sinh không xoá được bằng cách xoá dữ liệu trình duyệt). Chỉ ghi nhận cho bài ĐƯỢC GIAO có bật chế độ thi.
module.exports = function (app, { db, requireAuth, requireRole, now }) {
  const LEAVE = ['tab', 'blur', 'reopen'];          // các loại tính vào số lần được phép rời trang
  const INFO = ['paste', 'copy', 'key'];            // chỉ ghi lại để giáo viên xem, không tính vào giới hạn
  const ALL = LEAVE.concat(INFO);

  function conf(user, exId) {
    return db.prepare('SELECT strict, max_leaves FROM assignments WHERE exercise_id=? AND student_email=? ORDER BY id DESC LIMIT 1').get(exId, user.email);
  }
  // Số lần rời trang của lần làm hiện tại = các sự kiện sau lần nộp gần nhất
  function leavesOf(userId, exId) {
    const last = db.prepare('SELECT MAX(submitted_at) AS t FROM submissions WHERE user_id=? AND exercise_id=?').get(userId, exId);
    return db.prepare(`SELECT COUNT(*) AS c FROM exam_events WHERE user_id=? AND exercise_id=? AND type IN ('tab','blur','reopen') AND created_at > ?`).get(userId, exId, (last && last.t) || '').c;
  }
  const out = (c, leaves) => ({ ok: true, strict: true, leaves, max: c.max_leaves || 3, force: leaves >= (c.max_leaves || 3) });

  app.get('/api/exam-guard/status', requireAuth, (req, res) => {
    const exId = Number(req.query.exercise_id) || 0, c = exId && conf(req.user, exId);
    if (!c || !c.strict) return res.json({ ok: true, strict: false, leaves: 0, max: 0, force: false });
    res.json(out(c, leavesOf(req.user.id, exId)));
  });
  app.post('/api/exam-guard/event', requireAuth, (req, res) => {
    const exId = Number((req.body || {}).exercise_id) || 0, type = String((req.body || {}).type || '');
    if (req.user.role !== 'student' || !ALL.includes(type)) return res.json({ ok: true, strict: false, leaves: 0, max: 0, force: false });
    const c = exId && conf(req.user, exId);
    if (!c || !c.strict) return res.json({ ok: true, strict: false, leaves: 0, max: 0, force: false });
    const prev = db.prepare('SELECT created_at FROM exam_events WHERE user_id=? AND exercise_id=? AND type=? ORDER BY id DESC LIMIT 1').get(req.user.id, exId, type);
    if (!prev || Date.now() - Date.parse(prev.created_at) > 1500) { // gộp các sự kiện trùng (tab + blur xảy ra gần như cùng lúc)
      const recent = LEAVE.includes(type) ? db.prepare(`SELECT created_at FROM exam_events WHERE user_id=? AND exercise_id=? AND type IN ('tab','blur','reopen') ORDER BY id DESC LIMIT 1`).get(req.user.id, exId) : null;
      if (!recent || Date.now() - Date.parse(recent.created_at) > 1500) db.prepare('INSERT INTO exam_events (user_id,exercise_id,type,created_at) VALUES (?,?,?,?)').run(req.user.id, exId, type, now());
    }
    res.json(out(c, leavesOf(req.user.id, exId)));
  });

  // Giáo viên xem chi tiết các lần rời trang của một học sinh ở một đề
  app.get('/api/teacher/exam-events', requireRole('teacher', 'admin'), (req, res) => {
    const uid = Number(req.query.user_id) || 0, exId = Number(req.query.exercise_id) || 0;
    if (!uid || !exId) return res.status(400).json({ error: 'Thiếu thông tin.' });
    const events = db.prepare('SELECT type, created_at FROM exam_events WHERE user_id=? AND exercise_id=? ORDER BY id DESC LIMIT 60').all(uid, exId);
    res.json({ events, leaves: events.filter(e => LEAVE.includes(e.type)).length, pastes: events.filter(e => e.type === 'paste' || e.type === 'copy').length });
  });
};
