'use strict';
// Chép chính tả (Dictation): học sinh nghe từng câu ngắn cắt từ đề nghe Cambridge (KET/PET/FCE + A1) rồi gõ lại.
// Ngân hàng câu: dictation/bank.json (dựng bằng dictation/tools/, xem README ở đó). Âm thanh: dictation/audio/<id>.m4a (chỉ phát qua API có đăng nhập).
// Mỗi lượt lấy 8–10 câu NGẪU NHIÊN, ưu tiên câu học sinh chưa luyện → mỗi lần luyện (và mỗi học sinh) gặp bộ câu khác nhau.
const fs = require('fs');
const path = require('path');
const { check } = require('./dictation-check');

module.exports = function (app, { db, requireAuth, now }) {
  const DIR = process.env.DICTATION_DIR || path.join(__dirname, 'dictation'), AUD = path.join(DIR, 'audio');
  let bank = [], byId = new Map();
  try {
    bank = JSON.parse(fs.readFileSync(path.join(DIR, 'bank.json'), 'utf8')).items || [];
    bank = bank.filter((x) => x && x.id && x.text && /^[a-z0-9-]+$/i.test(x.id) && fs.existsSync(path.join(AUD, x.id + '.m4a')));
    byId = new Map(bank.map((x) => [x.id, x]));
  } catch (e) { console.warn('[dictation] chưa có ngân hàng câu:', e.message); }
  console.log('[dictation] sẵn sàng: ' + bank.length + ' câu');

  const LEVELS = [
    { lv: 'A1', label: 'A1 · Cơ bản', exam: 'Starters / Movers', desc: 'Câu rất ngắn, đời sống hằng ngày' },
    { lv: 'A2', label: 'A2 · KET', exam: 'KET (A2 Key)', desc: 'Câu đơn giản, từ vựng quen thuộc' },
    { lv: 'B1', label: 'B1 · PET', exam: 'PET (B1 Preliminary)', desc: 'Câu dài hơn, nhiều ý' },
    { lv: 'B2', label: 'B2 · FCE', exam: 'FCE (B2 First)', desc: 'Câu phức, tốc độ tự nhiên' },
    { lv: 'C1', label: 'C1 · CAE', exam: 'CAE (C1 Advanced)', desc: 'Câu dài, từ vựng học thuật, nói nhanh' },
  ];
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const clipOf = (id) => String(id).replace(/-s\d+$/, '');
  const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const pub = (x) => ({ id: x.id, sec: x.sec, words: x.words });

  app.get('/api/dictation/meta', requireAuth, (req, res) => {
    const seen = new Map(db.prepare('SELECT item_id, times, best FROM dictation_seen WHERE user_id=?').all(req.user.id).map((r) => [r.item_id, r]));
    const levels = LEVELS.filter((L) => bank.some((x) => x.lv === L.lv)).map((L) => {
      const items = bank.filter((x) => x.lv === L.lv);
      return Object.assign({}, L, { count: items.length, single: items.filter((x) => x.kind === 'single').length, compound: items.filter((x) => x.kind === 'compound').length, seen: items.filter((x) => seen.has(x.id) && seen.get(x.id).times > 0).length });
    });
    const st = db.prepare('SELECT COUNT(*) AS runs, AVG(score) AS avg FROM dictation_runs WHERE user_id=? AND finished_at IS NOT NULL AND mode=\'dictate\'').get(req.user.id);
    const done = db.prepare('SELECT COUNT(*) AS n FROM dictation_seen WHERE user_id=? AND times>0').get(req.user.id).n;
    res.json({ ready: bank.length > 0, total: bank.length, levels, stats: { runs: st.runs || 0, avg: st.avg == null ? null : Math.round(st.avg), sentences: done } });
  });

  // Bắt đầu một lượt: chọn ngẫu nhiên 8–10 câu theo cấp độ + loại câu, ưu tiên câu chưa luyện
  app.post('/api/dictation/run', requireAuth, (req, res) => {
    const b = req.body || {};
    const lv = LEVELS.some((L) => L.lv === b.lv) ? b.lv : 'all';
    const kind = b.kind === 'single' || b.kind === 'compound' ? b.kind : 'any';
    const mode = b.mode === 'listen' ? 'listen' : 'dictate';
    const n = Math.max(8, Math.min(10, parseInt(b.n, 10) || 10));
    if (db.prepare('SELECT COUNT(*) AS c FROM dictation_runs WHERE user_id=? AND created_at>?').get(req.user.id, new Date(Date.now() - 3600e3).toISOString()).c >= 60) return res.status(429).json({ error: 'Bạn bắt đầu quá nhiều lượt trong 1 giờ. Hãy nghỉ một chút rồi luyện tiếp nhé.' });
    let pool = bank.filter((x) => (lv === 'all' || x.lv === lv) && (kind === 'any' || x.kind === kind));
    if (pool.length < 4) return res.status(400).json({ error: 'Cấp độ / loại câu này chưa đủ câu để luyện. Hãy chọn “Cả hai loại” hoặc cấp độ khác.' });
    const seen = new Map(db.prepare('SELECT item_id, times, best, last_at FROM dictation_seen WHERE user_id=?').all(req.user.id).map((r) => [r.item_id, r]));
    // 3 nhóm ưu tiên: (1) câu CHƯA TỪNG hiện ra, (2) câu từng hiện ra nhưng chưa làm (bỏ dở), (3) câu đã làm — điểm thấp trước, rồi lâu chưa luyện
    const fresh = shuffle(pool.filter((x) => !seen.has(x.id)));
    const shownOnly = shuffle(pool.filter((x) => seen.has(x.id) && !seen.get(x.id).times)).sort((a, c) => String(seen.get(a.id).last_at).localeCompare(String(seen.get(c.id).last_at)));
    const old = shuffle(pool.filter((x) => seen.has(x.id) && seen.get(x.id).times)).sort((a, c) => {
      const A = seen.get(a.id), C = seen.get(c.id); const ba = A.best == null ? 100 : A.best, bc = C.best == null ? 100 : C.best;
      return (ba - bc) || String(A.last_at).localeCompare(String(C.last_at));
    });
    const order = fresh.concat(shownOnly, old), pick = [], per = {};
    for (const cap of [2, 99]) { // lần 1: tối đa 2 câu / đoạn nghe (đa dạng); lần 2: lấp chỗ còn thiếu
      for (const x of order) { if (pick.length >= n) break; if (pick.includes(x)) continue; const c = clipOf(x.id); if ((per[c] || 0) >= cap) continue; pick.push(x); per[c] = (per[c] || 0) + 1; }
    }
    const items = shuffle(pick.slice(0, Math.min(n, pick.length)));
    const showT = now(), ins = db.prepare('INSERT OR IGNORE INTO dictation_seen (user_id,item_id,times,best,last_at) VALUES (?,?,0,NULL,?)'), upd = db.prepare('UPDATE dictation_seen SET last_at=? WHERE user_id=? AND item_id=? AND times=0');
    for (const x of items) { ins.run(req.user.id, x.id, showT); upd.run(showT, req.user.id, x.id); } // đánh dấu "đã hiện" để lượt sau ưu tiên câu khác
    const r = db.prepare('INSERT INTO dictation_runs (user_id,level,kind,mode,items,created_at) VALUES (?,?,?,?,?,?)')
      .run(req.user.id, lv, kind, mode, JSON.stringify(items.map((x) => ({ id: x.id }))), now());
    res.json({ ok: true, run: Number(r.lastInsertRowid), mode, level: lv, kind, fresh: items.filter((x) => !seen.has(x.id) || !seen.get(x.id).times).length,
      items: items.map((x) => Object.assign(pub(x), mode === 'listen' ? { text: x.text } : {})) });
  });

  const runOf = (req, id) => { const r = db.prepare('SELECT * FROM dictation_runs WHERE id=? AND user_id=?').get(Number(id) || 0, req.user.id); return r ? Object.assign(r, { list: J(r.items, []) }) : null; };
  const saveRun = (run) => db.prepare('UPDATE dictation_runs SET items=? WHERE id=?').run(JSON.stringify(run.list), run.id);
  function markSeen(uid, id, score) {
    const row = db.prepare('SELECT times, best FROM dictation_seen WHERE user_id=? AND item_id=?').get(uid, id);
    if (!row) db.prepare('INSERT INTO dictation_seen (user_id,item_id,times,best,last_at) VALUES (?,?,?,?,?)').run(uid, id, 1, score, now());
    else db.prepare('UPDATE dictation_seen SET times=times+1, best=?, last_at=? WHERE user_id=? AND item_id=?').run(score == null ? row.best : (row.best == null ? score : Math.max(row.best, score)), now(), uid, id);
  }

  // Âm thanh của một câu — chỉ khi câu đó nằm trong một lượt luyện gần đây của chính học sinh (hỗ trợ Range cho Safari/iOS)
  app.get('/api/dictation/audio/:id', requireAuth, (req, res) => {
    const id = String(req.params.id || ''); if (!/^[a-z0-9-]+$/i.test(id) || !byId.has(id)) return res.status(404).end();
    const since = new Date(Date.now() - 12 * 3600e3).toISOString();
    if (!db.prepare('SELECT 1 FROM dictation_runs WHERE user_id=? AND created_at>? AND items LIKE ? LIMIT 1').get(req.user.id, since, '%"' + id + '"%')) return res.status(403).json({ error: 'Câu này không nằm trong lượt luyện của bạn.' });
    const file = path.join(AUD, id + '.m4a'); let stat; try { stat = fs.statSync(file); } catch (e) { return res.status(404).end(); }
    res.setHeader('Content-Type', 'audio/mp4'); res.setHeader('Accept-Ranges', 'bytes'); res.setHeader('Cache-Control', 'private, max-age=3600');
    const size = stat.size, range = req.headers.range;
    if (range) {
      const m = /^bytes=(\d*)-(\d*)$/.exec(range); if (!m) return res.status(416).end();
      const start = m[1] === '' ? size - Number(m[2]) : Number(m[1]); const end = m[2] === '' || m[1] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
      if (!(start >= 0) || start > end || start >= size) { res.setHeader('Content-Range', 'bytes */' + size); return res.status(416).end(); }
      res.status(206).setHeader('Content-Range', 'bytes ' + start + '-' + end + '/' + size); res.setHeader('Content-Length', end - start + 1);
      return fs.createReadStream(file, { start, end }).pipe(res);
    }
    res.setHeader('Content-Length', size); fs.createReadStream(file).pipe(res);
  });

  // Xem phụ đề của một câu (khi chép khó quá): câu đó sẽ KHÔNG được tính điểm
  app.post('/api/dictation/reveal', requireAuth, (req, res) => {
    const run = runOf(req, (req.body || {}).run), id = String((req.body || {}).id || '');
    const it = run && run.list.find((x) => x.id === id); if (!it) return res.status(404).json({ error: 'Không tìm thấy câu.' });
    if (it.done) return res.json({ ok: true, text: byId.get(id).text });
    it.assisted = true; saveRun(run); res.json({ ok: true, text: byId.get(id).text });
  });

  // Chấm một câu: trả điểm 0–100 + so khớp từng từ
  app.post('/api/dictation/check', requireAuth, (req, res) => {
    const b = req.body || {}, run = runOf(req, b.run), id = String(b.id || '');
    const it = run && run.list.find((x) => x.id === id), ref = byId.get(id);
    if (!it || !ref) return res.status(404).json({ error: 'Không tìm thấy câu.' });
    const typed = String(b.text == null ? '' : b.text).slice(0, 500);
    if (run.mode === 'listen') { if (!it.done) { it.done = true; it.score = null; it.assisted = true; saveRun(run); markSeen(req.user.id, id, null); } return res.json({ ok: true, text: ref.text }); }
    const r = check(ref.text, typed);
    if (it.done) return res.json(Object.assign({ ok: true, already: true, text: ref.text }, r)); // làm lại câu đã chấm: chỉ xem, không đổi điểm
    it.done = true; it.score = it.assisted ? null : r.score; it.typed = typed.slice(0, 300); saveRun(run);
    markSeen(req.user.id, id, it.assisted ? null : r.score);
    res.json(Object.assign({ ok: true, assisted: !!it.assisted, text: ref.text }, r));
  });

  // Kết thúc lượt: tổng kết điểm, danh sách câu cần luyện lại
  app.post('/api/dictation/finish', requireAuth, (req, res) => {
    const run = runOf(req, (req.body || {}).run); if (!run) return res.status(404).json({ error: 'Không tìm thấy lượt luyện.' });
    const scored = run.list.filter((x) => x.done && x.score != null);
    const avg = scored.length ? Math.round(scored.reduce((s, x) => s + x.score, 0) / scored.length) : null;
    if (!run.finished_at) db.prepare('UPDATE dictation_runs SET finished_at=?, score=? WHERE id=?').run(now(), avg, run.id);
    res.json({
      ok: true, mode: run.mode, avg, total: run.list.length, done: run.list.filter((x) => x.done).length, perfect: scored.filter((x) => x.score === 100).length, assisted: run.list.filter((x) => x.assisted).length,
      results: run.list.map((x) => ({ id: x.id, score: x.score == null ? null : x.score, assisted: !!x.assisted, done: !!x.done, text: x.done || run.mode === 'listen' ? byId.get(x.id).text : null, typed: x.typed || '' })),
    });
  });
};
