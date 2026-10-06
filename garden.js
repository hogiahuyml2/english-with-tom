'use strict';
// 🌷 EWT Garden — khu vườn cá nhân của mỗi tài khoản: trồng hoa, trồng cây, nuôi thú cưng, trang trí.
// Dùng xu 🪙 chung với phần Luyện từ (kiếm khi làm bài). Hết xu thì trả lời câu hỏi ngữ pháp / từ vựng để kiếm thêm.
// Máy chủ giữ toàn bộ trạng thái và kiểm tra giá, cấp vườn, thời gian lớn (trình duyệt chỉ hiển thị).
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const G = require('./js/garden-data.js');

module.exports = function (app, { db, requireAuth, now }) {
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const vnDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);

  db.exec(`CREATE TABLE IF NOT EXISTS garden (
    user_id INTEGER PRIMARY KEY, name TEXT, size INTEGER NOT NULL DEFAULT 5, tiles TEXT NOT NULL DEFAULT '[]', pets TEXT NOT NULL DEFAULT '[]',
    water INTEGER NOT NULL DEFAULT 10, water_day TEXT, yield_day TEXT, yield_xu INTEGER NOT NULL DEFAULT 0, feed_day TEXT, feed_xu INTEGER NOT NULL DEFAULT 0,
    quiz_day TEXT, quiz_ok INTEGER NOT NULL DEFAULT 0, quiz_total INTEGER NOT NULL DEFAULT 0, created_at TEXT, updated_at TEXT)`);

  for (const c of ['share TEXT', 'open INTEGER NOT NULL DEFAULT 1']) { try { db.exec('ALTER TABLE garden ADD COLUMN ' + c); } catch (_) {} }

  const givenName = (n) => String(n || 'bạn').trim().split(/\s+/).slice(-1)[0] || 'bạn';
  const coinsOf = (uid) => { db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(uid); return one('SELECT coins FROM word_game WHERE user_id=?', uid).coins; };
  const addCoins = (uid, n) => db.prepare('UPDATE word_game SET coins=coins+? WHERE user_id=?').run(n, uid);

  function load(user) {
    let r = one('SELECT * FROM garden WHERE user_id=?', user.id);
    if (!r) {
      const n = G.SIZES[0].n;
      db.prepare('INSERT INTO garden (user_id,name,size,tiles,pets,water,water_day,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)')
        .run(user.id, 'Vườn của ' + givenName(user.name), n, JSON.stringify(new Array(n * n).fill(null)), '[]', G.RULES.waterFree, vnDay(), now(), now());
      r = one('SELECT * FROM garden WHERE user_id=?', user.id);
    }
    const st = { uid: r.user_id, name: r.name, size: r.size, tiles: J(r.tiles, []), pets: J(r.pets, []), water: r.water, water_day: r.water_day, yield_day: r.yield_day, yield_xu: r.yield_xu, feed_day: r.feed_day, feed_xu: r.feed_xu, quiz_day: r.quiz_day, quiz_ok: r.quiz_ok, quiz_total: r.quiz_total };
    if (st.tiles.length !== st.size * st.size) { const t = new Array(st.size * st.size).fill(null); st.tiles.forEach((x, i) => { if (i < t.length) t[i] = x; }); st.tiles = t; }
    const today = vnDay();
    if (st.water_day !== today) { st.water = Math.max(st.water, G.RULES.waterFree); st.water_day = today; }
    if (st.yield_day !== today) { st.yield_day = today; st.yield_xu = 0; }
    if (st.feed_day !== today) { st.feed_day = today; st.feed_xu = 0; }
    if (st.quiz_day !== today) { st.quiz_day = today; st.quiz_ok = 0; }
    return st;
  }
  function save(st) {
    db.prepare('UPDATE garden SET name=?,size=?,tiles=?,pets=?,water=?,water_day=?,yield_day=?,yield_xu=?,feed_day=?,feed_xu=?,quiz_day=?,quiz_ok=?,quiz_total=?,updated_at=? WHERE user_id=?')
      .run(st.name, st.size, JSON.stringify(st.tiles), JSON.stringify(st.pets), st.water, st.water_day, st.yield_day, st.yield_xu, st.feed_day, st.feed_xu, st.quiz_day, st.quiz_ok, st.quiz_total, now(), st.uid);
  }
  function view(st) {
    const beauty = G.beautyOf(st), level = G.levelOf(beauty), nl = G.nextLevel(beauty), t = Date.now(), R = G.RULES;
    return {
      name: st.name, size: st.size, tiles: st.tiles, pets: st.pets.map((p) => ({ id: p.id, k: p.k, name: p.name, fed: p.fed === vnDay() })), water: st.water, beauty, level, levelTitle: G.LEVELS[level - 1].title,
      next: nl ? { level: nl.n, need: nl.at - beauty, title: nl.title } : null, slots: G.petSlots(level), nextSize: G.SIZES.find((s) => s.n === st.size + 1) || null,
      left: { yield: Math.max(0, R.yieldCapDay - st.yield_xu), feed: Math.max(0, R.feedCapDay - st.feed_xu), quiz: Math.max(0, R.quizCapDay - st.quiz_ok) }, now: t, quizTotal: st.quiz_total
    };
  }
  const reply = (res, user, st, extra) => res.json(Object.assign({ garden: view(st), coins: coinsOf(user.id) }, extra || {}));
  const bad = (res, msg, code) => res.status(code || 400).json({ error: msg });
  const tx = (fn) => { db.exec('BEGIN'); try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} throw e; } };

  app.get('/api/garden', requireAuth, (req, res) => { const st = load(req.user); save(st); reply(res, req.user, st); });

  app.post('/api/garden/name', requireAuth, (req, res) => {
    const nm = String((req.body || {}).name || '').replace(/[<>]/g, '').trim().slice(0, 30);
    if (nm.length < 2) return bad(res, 'Tên vườn cần ít nhất 2 ký tự.');
    const st = load(req.user); st.name = nm; save(st); reply(res, req.user, st);
  });

  app.post('/api/garden/place', requireAuth, (req, res) => {
    const i = Number((req.body || {}).i), it = G.BY[(req.body || {}).item];
    try {
      const out = tx(() => {
        const st = load(req.user), lvl = G.levelOf(G.beautyOf(st));
        if (!it) return { err: 'Món này không tồn tại.' };
        if (!Number.isInteger(i) || i < 0 || i >= st.tiles.length) return { err: 'Ô đất không hợp lệ.' };
        if (st.tiles[i]) return { err: 'Ô này đã có đồ — hãy dọn trước nhé.' };
        if (it.lvl > lvl) return { err: 'Cần vườn cấp ' + it.lvl + ' để mở món này.' };
        if (it.cost > 0) { const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(it.cost, req.user.id, it.cost); if (!r.changes) return { err: 'Chưa đủ xu (cần ' + it.cost + ' 🪙). Trả lời câu hỏi để kiếm thêm nhé!', need: it.cost }; }
        st.tiles[i] = { k: it.id, at: Date.now(), w: 0 }; save(st); return { st };
      });
      if (out.err) return bad(res, out.err);
      reply(res, req.user, out.st);
    } catch (e) { console.error('[garden/place]', e.message); bad(res, 'Có lỗi, thử lại nhé.', 500); }
  });

  app.post('/api/garden/remove', requireAuth, (req, res) => {
    const i = Number((req.body || {}).i);
    try {
      const out = tx(() => {
        const st = load(req.user); if (!Number.isInteger(i) || !st.tiles[i]) return { err: 'Ô này đang trống.' };
        const it = G.BY[st.tiles[i].k]; let back = 0;
        if (it && (it.kind === 'deco' || it.kind === 'ground') && it.cost > 0) { back = Math.floor(it.cost * G.RULES.sellBack); if (back) addCoins(req.user.id, back); }
        st.tiles[i] = null; save(st); return { st, back };
      });
      if (out.err) return bad(res, out.err);
      reply(res, req.user, out.st, { refund: out.back });
    } catch (e) { bad(res, 'Có lỗi, thử lại nhé.', 500); }
  });

  app.post('/api/garden/water', requireAuth, (req, res) => {
    const i = Number((req.body || {}).i);
    const out = tx(() => {
      const st = load(req.user), t = st.tiles[i], it = t && G.BY[t.k];
      if (!it || (it.kind !== 'plant' && it.kind !== 'tree')) return { err: 'Chỉ tưới được hoa và cây.' };
      if (G.stageOf(it, t, Date.now()) >= 3) return { err: 'Cây đã nở rồi, không cần tưới nữa.' };
      if (t.w >= G.RULES.waterMax) return { err: 'Cây này đã được tưới đủ ' + G.RULES.waterMax + ' lần.' };
      if (st.water <= 0) return { err: 'Hết lượt tưới hôm nay. Trả lời đúng câu hỏi để có thêm 💧 nhé!' };
      st.water--; t.w++; save(st); return { st };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st);
  });

  function harvestOne(st, i, uid) {
    const t = st.tiles[i], it = t && G.BY[t.k];
    if (!it || (it.kind !== 'plant' && it.kind !== 'tree') || G.stageOf(it, t, Date.now()) < 3) return null;
    const left = Math.max(0, G.RULES.yieldCapDay - st.yield_xu), gain = Math.min(it.y, left);
    if (gain > 0) { addCoins(uid, gain); st.yield_xu += gain; }
    st.tiles[i] = { k: it.id, at: Date.now(), w: 0 };
    return { gain, item: it.id };
  }
  app.post('/api/garden/harvest', requireAuth, (req, res) => {
    const i = Number((req.body || {}).i);
    const out = tx(() => { const st = load(req.user); const h = harvestOne(st, i, req.user.id); if (!h) return { err: 'Chưa thể thu hoạch — chờ cây nở nhé.' }; save(st); return { st, h }; });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { gained: out.h.gain, capped: out.h.gain === 0 && (G.BY[out.h.item].y || 0) > 0 });
  });
  app.post('/api/garden/harvest-all', requireAuth, (req, res) => {
    const out = tx(() => { const st = load(req.user); let n = 0, xu = 0; st.tiles.forEach((t, i) => { const h = t && harvestOne(st, i, req.user.id); if (h) { n++; xu += h.gain; } }); if (n) save(st); return { st, n, xu }; });
    if (!out.n) return bad(res, 'Chưa có cây nào nở để thu hoạch.');
    reply(res, req.user, out.st, { gained: out.xu, count: out.n });
  });

  app.post('/api/garden/expand', requireAuth, (req, res) => {
    const out = tx(() => {
      const st = load(req.user), nx = G.SIZES.find((s) => s.n === st.size + 1);
      if (!nx) return { err: 'Khu vườn đã ở kích thước lớn nhất.' };
      const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(nx.cost, req.user.id, nx.cost);
      if (!r.changes) return { err: 'Chưa đủ xu để mở rộng (cần ' + nx.cost + ' 🪙).' };
      const t = new Array(nx.n * nx.n).fill(null); st.tiles.forEach((x, k) => { const row = Math.floor(k / st.size), col = k % st.size; t[row * nx.n + col] = x; });
      st.tiles = t; st.size = nx.n; save(st); return { st };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st);
  });

  /* ───── thú cưng ───── */
  app.post('/api/garden/pet/adopt', requireAuth, (req, res) => {
    const pt = G.PBY[(req.body || {}).id];
    const out = tx(() => {
      const st = load(req.user), lvl = G.levelOf(G.beautyOf(st));
      if (!pt) return { err: 'Thú cưng này không tồn tại.' };
      if (pt.lvl > lvl) return { err: 'Cần vườn cấp ' + pt.lvl + ' để nhận nuôi bé này.' };
      if (st.pets.length >= G.petSlots(lvl)) return { err: 'Vườn chưa đủ chỗ cho thêm thú cưng — nâng cấp vườn để có thêm chỗ nhé.' };
      const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(pt.cost, req.user.id, pt.cost);
      if (!r.changes) return { err: 'Chưa đủ xu (cần ' + pt.cost + ' 🪙).' };
      st.pets.push({ id: crypto.randomBytes(3).toString('hex'), k: pt.id, name: pt.name, fed: null }); save(st); return { st };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st);
  });
  app.post('/api/garden/pet/feed', requireAuth, (req, res) => {
    const out = tx(() => {
      const st = load(req.user), p = st.pets.find((x) => x.id === (req.body || {}).pid);
      if (!p) return { err: 'Không thấy thú cưng này.' };
      if (p.fed === vnDay()) return { err: p.name + ' đã được ăn hôm nay rồi.' };
      p.fed = vnDay(); let gain = 0;
      if (st.feed_xu < G.RULES.feedCapDay) { gain = G.RULES.feedXu; st.feed_xu += gain; addCoins(req.user.id, gain); }
      save(st); return { st, gain };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { gained: out.gain });
  });
  app.post('/api/garden/pet/rename', requireAuth, (req, res) => {
    const nm = String((req.body || {}).name || '').replace(/[<>]/g, '').trim().slice(0, 16);
    const st = load(req.user), p = st.pets.find((x) => x.id === (req.body || {}).pid);
    if (!p || nm.length < 1) return bad(res, 'Tên không hợp lệ.');
    p.name = nm; save(st); reply(res, req.user, st);
  });
  app.post('/api/garden/pet/release', requireAuth, (req, res) => {
    const st = load(req.user), n = st.pets.length; st.pets = st.pets.filter((x) => x.id !== (req.body || {}).pid);
    if (st.pets.length === n) return bad(res, 'Không thấy thú cưng này.');
    save(st); reply(res, req.user, st);
  });

  /* ───── Tham quan vườn của bạn (chỉ xem): nhập email của bạn hoặc dùng link được chia sẻ ───── */
  const newToken = () => crypto.randomBytes(9).toString('base64url');
  function myShare(user) {
    if (!one('SELECT 1 FROM garden WHERE user_id=?', user.id)) save(load(user));
    let r = one('SELECT share, open FROM garden WHERE user_id=?', user.id);
    if (!r.share) { db.prepare('UPDATE garden SET share=? WHERE user_id=?').run(newToken(), user.id); r = one('SELECT share, open FROM garden WHERE user_id=?', user.id); }
    return { token: r.share, open: !!r.open };
  }
  app.get('/api/garden/share', requireAuth, (req, res) => res.json(myShare(req.user)));
  app.post('/api/garden/share', requireAuth, (req, res) => {
    const b = req.body || {}; myShare(req.user);
    if (b.renew) db.prepare('UPDATE garden SET share=? WHERE user_id=?').run(newToken(), req.user.id);
    if (typeof b.open === 'boolean') db.prepare('UPDATE garden SET open=? WHERE user_id=?').run(b.open ? 1 : 0, req.user.id);
    res.json(myShare(req.user));
  });
  const visitTries = new Map();
  app.get('/api/garden/visit', requireAuth, (req, res) => {
    const k = req.user.id, t = Date.now(), arr = (visitTries.get(k) || []).filter((x) => t - x < 60e3); arr.push(t); visitTries.set(k, arr);
    if (arr.length > 20) return bad(res, 'Bạn thử nhiều lần quá, chờ một phút rồi thử lại nhé.', 429);
    const token = String(req.query.token || '').trim(), email = String(req.query.email || '').trim().toLowerCase();
    const Q = 'SELECT g.*, u.name AS uname, u.avatar AS uavatar FROM garden g JOIN users u ON u.id=g.user_id WHERE ';
    let row = null;
    if (token) row = one(Q + 'g.share=?', token);
    else if (email) row = one(Q + 'lower(u.email)=?', email);
    else return bad(res, 'Hãy nhập email của bạn bè nhé.');
    if (!row || !row.open) return bad(res, 'Không tìm thấy khu vườn nào. Hãy kiểm tra lại email, hoặc bạn ấy chưa mở khu vườn.', 404);
    const st = { uid: row.user_id, name: row.name, size: row.size, tiles: J(row.tiles, []), pets: J(row.pets, []), quiz_total: 0, yield_xu: 0, feed_xu: 0, quiz_ok: 0 };
    const v = view(st); v.left = { yield: 0, feed: 0, quiz: 0 };
    let av = null; try { av = row.uavatar ? require('./js/avatar.js').normalize(JSON.parse(row.uavatar)) : null; } catch (_) {}
    res.json({ garden: v, owner: { name: givenName(row.uname), avatar: av, me: row.user_id === req.user.id }, readonly: true });
  });

  /* ───── Kiếm xu bằng câu hỏi ───── */
  const GR = [];
  (function loadGrammar() {
    try {
      const dir = path.join(__dirname, 'data', 'school'), ctx = { window: {} }; vm.createContext(ctx);
      fs.readdirSync(dir).filter((f) => /^g\d+\.js$/.test(f)).forEach((f) => vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f }));
      Object.keys(ctx.window.SCHOOL.lessons).forEach((id) => { const l = ctx.window.SCHOOL.lessons[id]; l.quiz.forEach((q, n) => GR.push({ key: id + '#' + n, grade: l.grade, lesson: id, title: l.title, q: q[0], opts: q[1], idx: q[2], expl: q[3], fixed: q[4] === 1 })); });
    } catch (e) { console.error('[garden] không nạp được câu hỏi ngữ pháp:', e.message); }
  })();
  const LESSONS = (() => { const m = new Map(); GR.forEach((q) => { if (!m.has(q.lesson)) m.set(q.lesson, { id: q.lesson, grade: q.grade, title: q.title, n: 0 }); m.get(q.lesson).n++; }); return [...m.values()]; })();
  const pending = new Map(), recent = new Map(), flips = new Map();
  function pickW(list) { const tot = list.reduce((x, y) => x + y[1], 0); let r = Math.random() * tot; for (const [k, w] of list) { if ((r -= w) <= 0) return k; } return list[0][0]; }
  function rollCard() {
    const F = G.FLIP, t = pickW(F.types);
    if (t === 'coin') return { t, v: pickW(F.normal) };
    if (F.big[t]) return { t, v: F.big[t] };
    return { t, v: 0 }; // ×2 / ×3: tính theo số xu lúc lật
  }
  // Số xu thật sự nhận được của một thẻ (thẻ nhân tính trên số xu hiện có, có mức tối thiểu và tối đa)
  function cardGain(uid, c) {
    const m = G.FLIP.mult[c.t]; if (!m) return c.v;
    return Math.max(G.FLIP.multMin, Math.min(G.FLIP.multCap, coinsOf(uid) * (m - 1)));
  }
  // Thẻ chưa lật (học sinh bỏ qua) → tự nhận ngẫu nhiên một thẻ để không mất thưởng
  function settleFlips(uid) {
    for (const [k, f] of flips) if (f.uid === uid) { flips.delete(k); addCoins(uid, cardGain(uid, f.cards[crypto.randomInt(f.cards.length)])); }
  }
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  function remember(uid, key) { const r = recent.get(uid) || []; r.push(key); if (r.length > 40) r.shift(); recent.set(uid, r); }
  function pickGrammar(uid, grade, lesson) {
    let pool = GR.filter((q) => (!grade || q.grade === grade) && (!lesson || q.lesson === lesson));
    if (!pool.length) pool = GR.filter((q) => !grade || q.grade === grade);
    const rc = recent.get(uid) || [], fresh = pool.filter((q) => rc.indexOf(q.key) < 0); const q = (fresh.length ? fresh : pool)[Math.floor(Math.random() * (fresh.length || pool.length))];
    if (!q) return null; remember(uid, q.key);
    const order = q.fixed ? q.opts.map((_, i) => i) : shuf(q.opts.map((_, i) => i));
    return { src: 'grammar', topic: 'Lớp ' + q.grade + ' · ' + q.title, q: q.q, opts: order.map((i) => q.opts[i]), idx: order.indexOf(q.idx), expl: q.expl };
  }
  // Tách nghĩa tiếng Việt thành các ý nhỏ để so trùng nghĩa (tránh 2 đáp án cùng đúng).
  const meaningBits = (m) => String(m || '').toLowerCase().replace(/\([^)]*\)/g, ' ').split(/[,;/]|\bhoặc\b/).map((x) => x.replace(/\s+/g, ' ').trim()).filter(Boolean);
  const sameMeaning = (a, b) => {
    const x = meaningBits(a.meaning_vi), y = meaningBits(b.meaning_vi);
    return x.some((p) => y.some((q) => p === q || (p.length >= 4 && q.length >= 4 && (p.indexOf(q) >= 0 || q.indexOf(p) >= 0))));
  };
  function pickVocab(uid, level) {
    const lv = ['KET', 'PET', 'FCE', 'IELTS'].includes(level) ? level : 'KET';
    const rows = db.prepare('SELECT id, word, pos, meaning_vi, topic FROM vocab_words WHERE level=? ORDER BY RANDOM() LIMIT 60').all(lv);
    if (rows.length < 4) return null;
    const rc = recent.get(uid) || [], w = rows.find((r) => rc.indexOf('v' + r.id) < 0) || rows[0]; remember(uid, 'v' + w.id);
    // Đáp án nhiễu: khác từ, khác nghĩa, ưu tiên cùng loại từ, và không trùng nghĩa với nhau.
    const pool = shuf(rows.filter((r) => r.id !== w.id && r.word.toLowerCase() !== w.word.toLowerCase() && !sameMeaning(r, w)));
    pool.sort((p, q) => (q.pos === w.pos) - (p.pos === w.pos));
    const d = [];
    for (const r of pool) { if (d.length >= 3) break; if (!d.some((x) => sameMeaning(x, r) || x.word.toLowerCase() === r.word.toLowerCase())) d.push(r); }
    if (d.length < 3) return null;
    const opts = shuf([w].concat(d));
    if (Math.random() < 0.5) return { src: 'vocab', topic: lv + ' · ' + w.topic, q: 'Nghĩa của từ "' + w.word + '"' + (w.pos ? ' (' + w.pos + ')' : '') + ' là gì?', opts: opts.map((o) => o.meaning_vi), idx: opts.indexOf(w), expl: w.word + ' = ' + w.meaning_vi + '.' };
    return { src: 'vocab', topic: lv + ' · ' + w.topic, q: 'Từ tiếng Anh nào có nghĩa "' + w.meaning_vi + '"?', opts: opts.map((o) => o.word), idx: opts.indexOf(w), expl: w.meaning_vi + ' = ' + w.word + '.' };
  }
  app.get('/api/garden/topics', requireAuth, (req, res) => res.json({ lessons: LESSONS, levels: ['KET', 'PET', 'FCE', 'IELTS'], grades: [6, 7, 8, 9, 10, 11, 12] }));
  app.get('/api/garden/quiz', requireAuth, (req, res) => {
    settleFlips(req.user.id);
    const st = load(req.user), src = req.query.src === 'vocab' ? 'vocab' : 'grammar';
    const q = src === 'vocab' ? pickVocab(req.user.id, String(req.query.level || '')) : pickGrammar(req.user.id, Number(req.query.grade) || 0, String(req.query.lesson || ''));
    if (!q) return bad(res, 'Chưa có câu hỏi phù hợp, hãy chọn mục khác nhé.');
    const qid = crypto.randomBytes(6).toString('hex'); pending.set(qid, { uid: req.user.id, idx: q.idx, expl: q.expl, ts: Date.now(), opts: q.opts });
    for (const [k, v] of pending) if (Date.now() - v.ts > 15 * 60e3) pending.delete(k);
    res.json({ qid, src: q.src, topic: q.topic, q: q.q, opts: q.opts, left: Math.max(0, G.RULES.quizCapDay - st.quiz_ok) });
  });
  app.post('/api/garden/quiz/answer', requireAuth, (req, res) => {
    const p = pending.get(String((req.body || {}).qid)), pick = Number((req.body || {}).idx);
    if (!p || p.uid !== req.user.id) return bad(res, 'Câu hỏi đã hết hạn, hãy lấy câu mới nhé.');
    pending.delete(String(req.body.qid));
    const ok = pick === p.idx, R = G.RULES;
    const out = tx(() => {
      const st = load(req.user); st.quiz_total++; let wt = 0, fid = null;
      if (ok && st.quiz_ok < R.quizCapDay) {
        st.quiz_ok++; wt = R.quizWater; st.water += wt;
        fid = crypto.randomBytes(6).toString('hex');
        flips.set(fid, { uid: req.user.id, ts: Date.now(), cards: Array.from({ length: G.FLIP.cards }, rollCard) });
      }
      save(st); return { st, wt, fid };
    });
    for (const [k, v] of flips) if (Date.now() - v.ts > 15 * 60e3) { flips.delete(k); addCoins(v.uid, cardGain(v.uid, v.cards[0])); }
    reply(res, req.user, out.st, { correct: ok, answer: p.idx, expl: p.expl, gained: { xu: 0, water: out.wt }, flip: out.fid, capped: ok && !out.fid });
  });
  // Lật thẻ thưởng: máy chủ đã định sẵn giá trị các thẻ, người chơi chỉ chọn vị trí
  app.post('/api/garden/quiz/flip', requireAuth, (req, res) => {
    const f = flips.get(String((req.body || {}).id)), pick = Number((req.body || {}).pick);
    if (!f || f.uid !== req.user.id) return bad(res, 'Thẻ thưởng đã được nhận hoặc đã hết hạn.');
    if (!Number.isInteger(pick) || pick < 0 || pick >= f.cards.length) return bad(res, 'Hãy chọn một thẻ.');
    flips.delete(String(req.body.id));
    let gained = 0;
    const out = tx(() => { gained = cardGain(req.user.id, f.cards[pick]); addCoins(req.user.id, gained); const st = load(req.user); save(st); return st; });
    reply(res, req.user, out, { cards: f.cards, pick, gained });
  });
};
