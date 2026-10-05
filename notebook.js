'use strict';
// 📒 Sổ lỗi sai: gom các câu học sinh làm sai ở mọi nơi để ôn lại cho tới khi nắm chắc.
// Nguồn: bài trắc nghiệm tự chấm · đề trắc nghiệm Word (CHỈ khi giáo viên bật hiện đáp án) · lỗi trong bài Writing (theo quyền hiển thị giáo viên đặt)
//        · từ vựng hay sai · câu chép chính tả điểm thấp.
// Câu đúng KHÔNG được gửi cho trình duyệt: học sinh chọn → máy chủ trả "đúng/chưa đúng"; chỉ khi đúng mới lộ đáp án (và giải thích nếu có).
const fs = require('fs');
const path = require('path');

module.exports = function (app, { db, requireAuth, now }) {
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const LETTERS = 'ABCDEFGH';
  let bank = new Map();
  try { for (const x of (J(fs.readFileSync(path.join(process.env.DICTATION_DIR || path.join(__dirname, 'dictation'), 'bank.json'), 'utf8'), {}).items || [])) bank.set(x.id, x); } catch (_) {}
  const DICT_LOW = 85; // câu chép chính tả dưới mức này thì vào sổ

  const stateOf = (uid) => { const m = new Map(); for (const r of db.prepare('SELECT key,status,tries FROM notebook_state WHERE user_id=?').all(uid)) m.set(r.key, r); return m; };
  function setState(uid, key, status, addTry) {
    const row = db.prepare('SELECT tries FROM notebook_state WHERE user_id=? AND key=?').get(uid, key);
    if (!row) db.prepare('INSERT INTO notebook_state (user_id,key,status,tries,updated_at) VALUES (?,?,?,?,?)').run(uid, key, status, addTry ? 1 : 0, now());
    else db.prepare('UPDATE notebook_state SET status=?, tries=tries+?, updated_at=? WHERE user_id=? AND key=?').run(status, addTry ? 1 : 0, now(), uid, key);
  }

  /* ── 1) Trắc nghiệm tự chấm: các câu sai ở lần nộp MỚI NHẤT của mỗi đề ── */
  function quizItems(uid) {
    const rows = db.prepare(`SELECT s.id AS sid, s.answers, s.submitted_at, e.id AS eid, e.title, e.program, e.skill, e.questions, e.answer_key
      FROM submissions s JOIN exercises e ON e.id = s.exercise_id
      WHERE s.user_id=? AND e.auto_grade=1 AND e.answer_key IS NOT NULL AND e.questions IS NOT NULL
        AND s.id = (SELECT MAX(s2.id) FROM submissions s2 WHERE s2.user_id=s.user_id AND s2.exercise_id=s.exercise_id)
      ORDER BY s.id DESC LIMIT 80`).all(uid);
    const out = [];
    for (const r of rows) {
      const qs = J(r.questions, []), key = J(r.answer_key, []), ans = J(r.answers, []);
      if (!Array.isArray(qs) || !Array.isArray(key) || !Array.isArray(ans)) continue;
      key.forEach((k, i) => {
        const pick = String(ans[i] || '').toUpperCase(), q = qs[i]; if (!q || !Array.isArray(q.options)) return;
        if (pick === String(k).toUpperCase()) return;
        out.push({ key: 'q:' + r.sid + ':' + i, kind: 'quiz', src: r.title, tag: r.program + ' ' + r.skill, ex_id: r.eid, q: String(q.q || ''), options: q.options.map(String), picked: LETTERS.indexOf(pick), at: r.submitted_at });
      });
    }
    return out;
  }
  function quizAnswer(uid, key) { // → { answer: index, text } hoặc null
    const m = /^q:(\d+):(\d+)$/.exec(key); if (!m) return null;
    const r = db.prepare('SELECT s.answers, e.questions, e.answer_key FROM submissions s JOIN exercises e ON e.id=s.exercise_id WHERE s.id=? AND s.user_id=?').get(Number(m[1]), uid);
    if (!r) return null; const k = J(r.answer_key, []), qs = J(r.questions, []), i = Number(m[2]); if (!k[i] || !qs[i]) return null;
    return { answer: LETTERS.indexOf(String(k[i]).toUpperCase()), exp: '' };
  }

  /* ── 2) Đề trắc nghiệm Word: chỉ khi giáo viên bật hiện đáp án ── */
  function mcqItems(uid) {
    const rows = db.prepare(`SELECT a.id AS aid, a.perm, a.answers, a.finished_at, t.title, t.questions
      FROM mcq_attempts a JOIN mcq_tests t ON t.id=a.test_id
      WHERE a.user_id=? AND a.status='done' AND a.voided=0 AND t.reveal=1
        AND a.id = (SELECT MAX(a2.id) FROM mcq_attempts a2 WHERE a2.test_id=a.test_id AND a2.user_id=a.user_id AND a2.status='done' AND a2.voided=0)
      ORDER BY a.id DESC LIMIT 40`).all(uid);
    const out = [];
    for (const r of rows) {
      const qs = J(r.questions, []), perm = J(r.perm, { q: [], o: [] }), ans = J(r.answers, []);
      (perm.q || []).forEach((qi, pos) => {
        const q = qs[qi]; if (!q) return; const order = perm.o[pos] || [];
        const chosen = Number.isInteger(ans[pos]) ? ans[pos] : -1; if (chosen >= 0 && order[chosen] === q.ans) return;
        out.push({ key: 'm:' + r.aid + ':' + pos, kind: 'quiz', src: r.title, tag: 'Đề trắc nghiệm', q: q.q, options: order.map((k) => q.opts[k]), picked: chosen, at: r.finished_at ? new Date(r.finished_at).toISOString() : '', reveal: { answer: order.indexOf(q.ans), exp: q.exp || '' } });
      });
    }
    return out;
  }
  function mcqAnswer(uid, key) {
    const m = /^m:(\d+):(\d+)$/.exec(key); if (!m) return null;
    const r = db.prepare("SELECT a.perm, t.questions, t.reveal FROM mcq_attempts a JOIN mcq_tests t ON t.id=a.test_id WHERE a.id=? AND a.user_id=? AND a.status='done'").get(Number(m[1]), uid);
    if (!r || !r.reveal) return null; const perm = J(r.perm, { q: [], o: [] }), pos = Number(m[2]), q = J(r.questions, [])[perm.q[pos]]; if (!q) return null;
    return { answer: (perm.o[pos] || []).indexOf(q.ans), exp: q.exp || '' };
  }

  /* ── 3) Lỗi trong bài Writing đã được chấm (chỉ khi giáo viên cho học sinh xem danh sách lỗi) ── */
  function writingItems(uid) {
    const rows = db.prepare(`SELECT s.id AS sid, s.feedback, s.submitted_at, e.title FROM submissions s JOIN exercises e ON e.id=s.exercise_id
      WHERE s.user_id=? AND s.status='graded' AND s.feedback LIKE '%error_list%' ORDER BY s.id DESC LIMIT 25`).all(uid);
    const out = [];
    for (const r of rows) {
      const fb = J(r.feedback, null); if (!fb || !fb.visibility || !fb.visibility.error_list || !Array.isArray(fb.error_list)) continue;
      fb.error_list.filter((e) => e && e.severity !== 'improvement' && e.error && e.correction).slice(0, 10).forEach((e, i) => {
        out.push({ key: 'w:' + r.sid + ':' + i, kind: 'writing', src: r.title, tag: String(e.category || 'Lỗi'), wrong: String(e.error), right: String(e.correction), why: String(e.explanation || ''), rule: String(e.rule || ''), at: r.submitted_at });
      });
    }
    return out;
  }

  /* ── 4) Từ vựng hay sai ── */
  function wordItems(uid) {
    return db.prepare(`SELECT w.id, w.word, w.pos, w.meaning_vi, w.example_en, p.wrong, p.correct FROM word_progress p JOIN vocab_words w ON w.id=p.word_id
      WHERE p.user_id=? AND p.wrong>0 AND p.box<3 ORDER BY p.wrong DESC, p.last_seen DESC LIMIT 60`).all(uid)
      .map((w) => ({ key: 'v:' + w.id, kind: 'word', word: w.word, pos: w.pos || '', meaning: w.meaning_vi, example: w.example_en || '', wrong: w.wrong, correct: w.correct }));
  }

  /* ── 5) Câu chép chính tả điểm thấp ── */
  function dictItems(uid) {
    return db.prepare('SELECT item_id, best, times FROM dictation_seen WHERE user_id=? AND times>0 AND best IS NOT NULL AND best<? ORDER BY best ASC, last_at DESC LIMIT 60').all(uid, DICT_LOW)
      .filter((r) => bank.has(r.item_id)).map((r) => ({ key: 'd:' + r.item_id, kind: 'dict', text: bank.get(r.item_id).text, lv: bank.get(r.item_id).lv, best: r.best, times: r.times }));
  }

  app.get('/api/notebook', requireAuth, (req, res) => {
    const uid = req.user.id, st = stateOf(uid);
    const split = (list) => { const open = [], done = []; for (const it of list) { const s = st.get(it.key); if (s && s.status === 'mastered') done.push(it); else { it.tries = s ? s.tries : 0; open.push(it); } } return { open, done }; };
    const quiz = split(quizItems(uid).concat(mcqItems(uid))), writing = split(writingItems(uid)), words = split(wordItems(uid));
    // mcq có reveal sẵn: gửi đáp án + giải thích (giáo viên đã cho phép xem); câu tự chấm thường thì KHÔNG gửi đáp án
    const clean = (it) => { const o = Object.assign({}, it); return o; };
    const dict = dictItems(uid);
    const weekAgo = new Date(Date.now() - 7 * 86400e3).toISOString();
    const mastered = db.prepare("SELECT COUNT(*) AS c FROM notebook_state WHERE user_id=? AND status='mastered'").get(uid).c;
    const week = db.prepare("SELECT COUNT(*) AS c FROM notebook_state WHERE user_id=? AND status='mastered' AND updated_at>?").get(uid, weekAgo).c;
    res.json({
      counts: { quiz: quiz.open.length, writing: writing.open.length, words: words.open.length, dict: dict.length, mastered },
      quiz: quiz.open.map(clean), writing: writing.open, words: words.open, dict,
      done: { quiz: quiz.done.slice(0, 30).map(clean), writing: writing.done.slice(0, 30), words: words.done.slice(0, 30) },
      stats: { mastered, week },
    });
  });

  // Thử lại một câu trắc nghiệm trong sổ: trả "đúng/chưa đúng"; đúng thì lộ đáp án (và giải thích) rồi đánh dấu đã nắm
  app.post('/api/notebook/check', requireAuth, (req, res) => {
    const key = String((req.body || {}).key || ''), pick = Number((req.body || {}).pick);
    if (!Number.isInteger(pick) || pick < 0 || pick > 7) return res.status(400).json({ error: 'Lựa chọn không hợp lệ.' });
    const a = key.startsWith('q:') ? quizAnswer(req.user.id, key) : key.startsWith('m:') ? mcqAnswer(req.user.id, key) : null;
    if (!a || a.answer < 0) return res.status(404).json({ error: 'Không tìm thấy câu này.' });
    const ok = pick === a.answer;
    setState(req.user.id, key, ok ? 'mastered' : 'open', true);
    res.json(ok ? { ok: true, correct: true, answer: a.answer, exp: a.exp || '' } : { ok: true, correct: false });
  });
  // Học sinh tự đánh dấu "đã nhớ" (lỗi Writing, từ vựng) hoặc mở lại
  app.post('/api/notebook/mark', requireAuth, (req, res) => {
    const key = String((req.body || {}).key || ''), done = (req.body || {}).done !== false;
    if (!/^(w:\d+:\d+|v:\d+|q:\d+:\d+|m:\d+:\d+)$/.test(key)) return res.status(400).json({ error: 'Mã không hợp lệ.' });
    setState(req.user.id, key, done ? 'mastered' : 'open', false); res.json({ ok: true });
  });
  // Số câu đang cần ôn (cho khung nhắc ở Hồ sơ)
  const openCount = (uid) => { const st = stateOf(uid), open = (l) => l.filter((it) => { const s = st.get(it.key); return !(s && s.status === 'mastered'); }).length;
    return open(quizItems(uid).concat(mcqItems(uid))) + open(writingItems(uid)) + open(wordItems(uid)) + dictItems(uid).length; };
  app.locals.notebookOpen = openCount; // dùng cho "Hôm nay mình học gì?"
  app.get('/api/notebook/count', requireAuth, (req, res) => { res.json({ open: openCount(req.user.id) }); });
};
