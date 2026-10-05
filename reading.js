'use strict';
// 📖 Đọc hiểu theo cấp độ A1–C1: bài đọc từ nguồn công khai có ghi rõ nguồn + giấy phép, câu hỏi luyện tập, ghi chú từ vựng/collocation/cấu trúc,
// và tra từ theo ngữ cảnh SAU KHI làm xong. Đáp án & giải thích chỉ gửi sau khi nộp bài.
const fs = require('fs');
const path = require('path');

module.exports = function (app, { db, requireAuth, now }) {
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const all = (sql, ...a) => db.prepare(sql).all(...a);
  const FILE = path.join(process.env.READING_DIR || path.join(__dirname, 'reading'), 'bank.json');
  let BANK = { texts: [] }, BY = new Map();
  function load() { try { BANK = J(fs.readFileSync(FILE, 'utf8'), { texts: [] }); } catch (_) { BANK = { texts: [] }; } BY = new Map(BANK.texts.map((t) => [t.id, t])); }
  load();
  const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1'];

  const meta = (t, best) => ({ id: t.id, level: t.level, title: t.title, topic: t.topic, words: t.words, minutes: t.minutes, source: t.source.name, adapted: !!t.source.adapted, q: t.questions.length, best: best || null });
  const bestOf = (uid) => { const m = new Map(); for (const r of all('SELECT text_id, MAX(score*1.0/max_score) AS r, MAX(score) AS s, MAX(max_score) AS m, COUNT(*) AS n FROM reading_attempts WHERE user_id=? GROUP BY text_id', uid)) m.set(r.text_id, { score: r.s, max: r.m, ratio: r.r, tries: r.n }); return m; };

  // Gợi ý bài tiếp theo: theo cấp độ gần nhất; đọc tốt (≥75% ở ≥3 bài) thì lên cấp; chưa đọc gì thì theo kết quả Kiểm tra đầu vào
  function recommend(uid) {
    if (!BANK.texts.length) return null;
    const best = bestOf(uid), lvOf = (t) => LEVELS.indexOf(t.level);
    const recent = one('SELECT text_id FROM reading_attempts WHERE user_id=? ORDER BY id DESC LIMIT 1', uid);
    let li = 1;
    if (recent && BY.get(recent.text_id)) {
      li = lvOf(BY.get(recent.text_id));
      const done = BANK.texts.filter((t) => lvOf(t) === li && best.get(t.id));
      if (done.length >= 3 && done.reduce((a, t) => a + best.get(t.id).ratio, 0) / done.length >= 0.75 && li < LEVELS.length - 1) li++;
    } else {
      try { const pa = one("SELECT result FROM placement_attempts WHERE user_id=? AND status='done' AND voided=0 ORDER BY id DESC LIMIT 1", uid); const lv = String((J(pa && pa.result, {}) || {}).level || ''); const m = lv.match(/A1|A2|B1|B2|C/); if (m) li = m[0] === 'C' ? 4 : LEVELS.indexOf(m[0]); } catch (_) {}
    }
    for (let k = li; k < LEVELS.length; k++) {
      const t = BANK.texts.find((x) => lvOf(x) === k && !best.get(x.id)); if (t) return t;
    }
    const weak = BANK.texts.filter((t) => best.get(t.id)).sort((a, b) => best.get(a.id).ratio - best.get(b.id).ratio)[0];
    return weak || BANK.texts[0];
  }
  app.locals.readingNext = (uid) => { const t = recommend(uid); return t ? { id: t.id, title: t.title, level: t.level, minutes: t.minutes } : null; };

  app.get('/api/reading/list', requireAuth, (req, res) => {
    const best = bestOf(req.user.id), rec = recommend(req.user.id);
    res.json({ levels: LEVELS, recommend: rec ? rec.id : null, items: BANK.texts.map((t) => meta(t, best.get(t.id))) });
  });

  app.get('/api/reading/text/:id', requireAuth, (req, res) => {
    const t = BY.get(String(req.params.id)); if (!t) return res.status(404).json({ error: 'Không tìm thấy bài đọc.' });
    const done = !!one('SELECT 1 AS c FROM reading_attempts WHERE user_id=? AND text_id=?', req.user.id, t.id);
    res.set('Cache-Control', 'no-store');
    res.json({ ...meta(t), source: t.source, paras: t.paras, questions: t.questions.map((q) => ({ type: q.type, q: q.q, options: q.options || null })), done });
  });

  // Gói sau khi làm xong: văn bản đã gắn thẻ từ + ghi chú
  const afterPack = (t) => ({ ptok: t.ptok, lex: t.lex, notes: t.notes });

  app.post('/api/reading/text/:id/submit', requireAuth, (req, res) => {
    const t = BY.get(String(req.params.id)); if (!t) return res.status(404).json({ error: 'Không tìm thấy bài đọc.' });
    const ans = Array.isArray((req.body || {}).answers) ? req.body.answers : [];
    let score = 0;
    const results = t.questions.map((q, i) => {
      const a = ans[i], ok = q.type === 'mcq' ? Number(a) === q.answer : String(a || '').toUpperCase() === q.answer;
      if (ok) score++;
      return { ok, picked: a == null ? null : a, answer: q.answer, explain: q.explain || '' };
    });
    const secs = Math.max(0, Math.min(7200, Number((req.body || {}).seconds) || 0));
    db.prepare('INSERT INTO reading_attempts (user_id,text_id,score,max_score,answers,seconds,created_at) VALUES (?,?,?,?,?,?,?)').run(req.user.id, t.id, score, t.questions.length, JSON.stringify(ans.slice(0, 40)), secs, now());
    res.json({ ok: true, score, max: t.questions.length, results, ...afterPack(t) });
  });

  // Xem lại (chỉ khi đã từng nộp bài này) — để tra từ & đọc ghi chú lần sau
  app.get('/api/reading/text/:id/review', requireAuth, (req, res) => {
    const t = BY.get(String(req.params.id)); if (!t) return res.status(404).json({ error: 'Không tìm thấy bài đọc.' });
    if (!one('SELECT 1 AS c FROM reading_attempts WHERE user_id=? AND text_id=?', req.user.id, t.id)) return res.status(403).json({ error: 'Hãy làm bài trước, rồi bạn sẽ xem được từ vựng và ghi chú.' });
    res.set('Cache-Control', 'no-store'); res.json(afterPack(t));
  });

  /* Từ đã lưu */
  app.get('/api/reading/saved', requireAuth, (req, res) => {
    res.json({ items: all('SELECT key,word,pos,def,vi,text_id,sentence,created_at FROM reading_saved WHERE user_id=? ORDER BY created_at DESC LIMIT 500', req.user.id) });
  });
  app.post('/api/reading/save-word', requireAuth, (req, res) => {
    const b = req.body || {}, t = BY.get(String(b.text_id)), key = String(b.key || '');
    if (!t || !t.lex[key]) return res.status(400).json({ error: 'Từ không hợp lệ.' });
    if (!one('SELECT 1 AS c FROM reading_attempts WHERE user_id=? AND text_id=?', req.user.id, t.id)) return res.status(403).json({ error: 'Hãy làm bài trước.' });
    const x = t.lex[key], sentence = String(b.sentence || '').slice(0, 300);
    if (one('SELECT 1 AS c FROM reading_saved WHERE user_id=? AND key=?', req.user.id, t.id + ':' + key)) { db.prepare('DELETE FROM reading_saved WHERE user_id=? AND key=?').run(req.user.id, t.id + ':' + key); return res.json({ ok: true, saved: false }); }
    db.prepare('INSERT INTO reading_saved (user_id,key,word,pos,def,vi,text_id,sentence,created_at) VALUES (?,?,?,?,?,?,?,?,?)').run(req.user.id, t.id + ':' + key, x.w, x.pos, x.def, x.vi || null, t.id, sentence, now());
    res.json({ ok: true, saved: true });
  });
  app.get('/api/reading/saved-keys/:id', requireAuth, (req, res) => {
    res.json({ keys: all('SELECT key FROM reading_saved WHERE user_id=? AND text_id=?', req.user.id, String(req.params.id)).map((r) => r.key.split(':').slice(1).join(':')) });
  });
};
