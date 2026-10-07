'use strict';
// 🌷 EWT Garden — khu vườn cá nhân của mỗi tài khoản: trồng hoa, trồng cây, nuôi thú cưng, trang trí.
// Dùng xu 🪙 chung với phần Luyện từ (kiếm khi làm bài). Hết xu thì trả lời câu hỏi ngữ pháp / từ vựng để kiếm thêm.
// Máy chủ giữ toàn bộ trạng thái và kiểm tra giá, cấp vườn, thời gian lớn (trình duyệt chỉ hiển thị).
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const G = require('./js/garden-data.js');
const VC = require('./js/vocab-conflict.js');

module.exports = function (app, { db, requireAuth, requireRole, now }) {
  let X = null;   // tiện ích nhiệm vụ / quà / hộ chiếu (garden-extra.js), gán ở cuối tệp
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const vnDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);

  db.exec(`CREATE TABLE IF NOT EXISTS garden (
    user_id INTEGER PRIMARY KEY, name TEXT, size INTEGER NOT NULL DEFAULT 5, tiles TEXT NOT NULL DEFAULT '[]', pets TEXT NOT NULL DEFAULT '[]',
    water INTEGER NOT NULL DEFAULT 10, water_day TEXT, yield_day TEXT, yield_xu INTEGER NOT NULL DEFAULT 0, feed_day TEXT, feed_xu INTEGER NOT NULL DEFAULT 0,
    quiz_day TEXT, quiz_ok INTEGER NOT NULL DEFAULT 0, quiz_total INTEGER NOT NULL DEFAULT 0, created_at TEXT, updated_at TEXT)`);

  for (const c of ['share TEXT', 'open INTEGER NOT NULL DEFAULT 1', 'zones TEXT', 'v INTEGER NOT NULL DEFAULT 1', 'land TEXT', 'bag TEXT', 'quests TEXT', 'passport TEXT']) { try { db.exec('ALTER TABLE garden ADD COLUMN ' + c); } catch (_) {} }

  const givenName = (n) => String(n || 'bạn').trim().split(/\s+/).slice(-1)[0] || 'bạn';
  const coinsOf = (uid) => { db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(uid); return one('SELECT coins FROM word_game WHERE user_id=?', uid).coins; };
  const addCoins = (uid, n) => db.prepare('UPDATE word_game SET coins=coins+? WHERE user_id=?').run(n, uid);

  // Chuyển vườn kiểu cũ (một lưới vuông) sang kiểu nhiều khu: xếp lần lượt các món vào ô trống của các khu, tự mở khu nếu cần
  function migrate(old) {
    const tiles = new Array(G.TOTAL).fill(null), zones = ['cottage'];
    let zi = 0, c = 0;
    const cellAt = (z, k) => z * G.PER + Math.floor(k / G.BASEC) * G.MAXC + (k % G.BASEC);
    const nextFree = () => { for (;;) { const z = G.ZONES[zi]; if (!z) return -1; while (c < z.cells && (z.mask[c] || tiles[cellAt(zi, c)])) c++; if (c < z.cells) return cellAt(zi, c); zi++; c = 0; if (G.ZONES[zi] && zones.indexOf(G.ZONES[zi].id) < 0) zones.push(G.ZONES[zi].id); } };
    old.forEach((t) => { if (!t) return; const k = nextFree(); if (k >= 0) tiles[k] = t; });
    return { tiles, zones };
  }
  // Vườn phiên bản 2 (mỗi khu 35 ô) → phiên bản 3 (mỗi khu có khung lớn để mở rộng đất)
  function remapV2(old) {
    const t = new Array(G.TOTAL).fill(null);
    (old || []).forEach((x, i) => { if (!x) return; const n = G.remapOld(i); if (n < t.length) t[n] = x.ref != null ? { ref: G.remapOld(x.ref) } : x; });
    return t;
  }
  // Giỏ hàng: đồ đã mua nhưng đang cất (items), thú cưng đang cất (pets), phiếu miễn phí (free)
  const FREE_CLS = { plant: 'plant', tree: 'tree', deco: 'deco', ground: 'deco', big: 'big' };
  function normBag(b) {
    const o = { items: {}, pets: [], free: { plant: 0, tree: 0, deco: 0, big: 0, pet: 0, boost: 0 } };
    if (!b || typeof b !== 'object') return o;
    Object.keys(b.items || {}).forEach((k) => { const n = Math.floor(Number(b.items[k])); if (G.BY[k] && n > 0) o.items[k] = Math.min(n, 999); });
    (Array.isArray(b.pets) ? b.pets : []).slice(0, 60).forEach((p) => { if (p && G.PBY[p.k]) o.pets.push({ k: p.k, name: String(p.name || G.PBY[p.k].name).replace(/[<>]/g, '').slice(0, 16) }); });
    Object.keys(o.free).forEach((k) => { const n = Math.floor(Number((b.free || {})[k])); if (n > 0) o.free[k] = Math.min(n, 9999); });
    return o;
  }
  function bagAdd(st, id, n) { st.bag.items[id] = Math.min(999, (st.bag.items[id] | 0) + (n || 1)); }
  function fromRow(r) {
    const st = { uid: r.user_id, name: r.name, size: 5, tiles: J(r.tiles, []), zones: J(r.zones, null), pets: J(r.pets, []), water: r.water, water_day: r.water_day, yield_day: r.yield_day, yield_xu: r.yield_xu, feed_day: r.feed_day, feed_xu: r.feed_xu, quiz_day: r.quiz_day, quiz_ok: r.quiz_ok, quiz_total: r.quiz_total };
    st.bag = normBag(J(r.bag, null));
    st.q = J(r.quests, {}); if (!st.q || typeof st.q !== 'object' || Array.isArray(st.q)) st.q = {};
    st.passport = J(r.passport, {}); if (!st.passport || typeof st.passport !== 'object' || Array.isArray(st.passport)) st.passport = {};
    st.land = J(r.land, {}); if (!st.land || typeof st.land !== 'object' || Array.isArray(st.land)) st.land = {};
    if ((r.v || 1) < 2 || !Array.isArray(st.zones)) { const m = migrate(st.tiles); st.tiles = m.tiles; st.zones = m.zones; }
    else if ((r.v || 1) < 3) st.tiles = remapV2(st.tiles);
    if (st.tiles.length !== G.TOTAL) { const t = new Array(G.TOTAL).fill(null); st.tiles.forEach((x, i) => { if (i < t.length) t[i] = x; }); st.tiles = t; }
    st.zones = st.zones.filter((id) => G.ZBY[id]); if (st.zones.indexOf('cottage') < 0) st.zones.unshift('cottage');
    // Thú cưng thuộc về MỘT khu: thú cũ chưa có khu → ở Vườn nhà Tom
    st.pets = (Array.isArray(st.pets) ? st.pets : []).filter((p) => p && G.PBY[p.k]).map((p) => { if (!p.z || !G.ZBY[p.z]) p.z = 'cottage'; return p; });
    // Cảnh phụ mới chiếm một số ô: đồ đã đặt trúng ô đó (nếu có) được dọn đi và hoàn xu
    st.purged = 0; st.purgedAny = false;
    for (let i = 0; i < st.tiles.length; i++) {
      const t = st.tiles[i]; if (!t || !G.isBlocked(i)) continue;
      const a = t.ref != null ? t.ref : i, at = st.tiles[a], it = at && G.BY[at.k]; st.purgedAny = true;
      if (it && (it.kind === 'deco' || it.kind === 'ground' || it.kind === 'big') && it.cost > 0) st.purged += it.cost;
      (it && it.kind === 'big' ? G.footprint(a, it, G.LAND.length - 1) || [a] : [a]).forEach((k) => { st.tiles[k] = null; }); st.tiles[i] = null;
    }
    Object.keys(st.land).forEach((k) => { const n = Number(st.land[k]); if (!G.ZBY[k] || !Number.isInteger(n) || n < 1) delete st.land[k]; else st.land[k] = Math.min(n, G.LAND.length - 1); });
    return st;
  }
  function load(user) {
    let r = one('SELECT * FROM garden WHERE user_id=?', user.id);
    if (!r) {
      db.prepare('INSERT INTO garden (user_id,name,size,tiles,zones,v,pets,water,water_day,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        .run(user.id, 'Vườn của ' + givenName(user.name), 5, '[]', JSON.stringify(['cottage']), 3, '[]', G.RULES.waterFree, vnDay(), now(), now());
      r = one('SELECT * FROM garden WHERE user_id=?', user.id);
    }
    const st = fromRow(r);
    if (st.purgedAny) { if (st.purged > 0) addCoins(user.id, st.purged); st.purged = 0; st.purgedAny = false; save(st); }
    const today = vnDay();
    if (st.water_day !== today) { st.water = Math.max(st.water, G.RULES.waterFree); st.water_day = today; }
    if (st.yield_day !== today) { st.yield_day = today; st.yield_xu = 0; }
    if (st.feed_day !== today) { st.feed_day = today; st.feed_xu = 0; }
    if (st.quiz_day !== today) { st.quiz_day = today; st.quiz_ok = 0; }
    return st;
  }
  // Chỉ lưu đến ô cuối cùng có đồ (khung ô rất lớn, phần lớn để trống)
  function trimTiles(t) { let n = t.length; while (n > 0 && !t[n - 1]) n--; return t.slice(0, n); }
  const landLv = (st, z) => (z ? st.land[z.id] | 0 : 0);
  function save(st) {
    db.prepare('UPDATE garden SET name=?,size=?,tiles=?,zones=?,land=?,bag=?,quests=?,passport=?,v=3,pets=?,water=?,water_day=?,yield_day=?,yield_xu=?,feed_day=?,feed_xu=?,quiz_day=?,quiz_ok=?,quiz_total=?,updated_at=? WHERE user_id=?')
      .run(st.name, st.size, JSON.stringify(trimTiles(st.tiles)), JSON.stringify(st.zones), JSON.stringify(st.land || {}), JSON.stringify(st.bag || normBag(null)), JSON.stringify(st.q || {}), JSON.stringify(st.passport || {}), JSON.stringify(st.pets), st.water, st.water_day, st.yield_day, st.yield_xu, st.feed_day, st.feed_xu, st.quiz_day, st.quiz_ok, st.quiz_total, now(), st.uid);
  }
  function view(st) {
    const beauty = G.beautyOf(st), level = G.levelOf(beauty), nl = G.nextLevel(beauty), t = Date.now(), R = G.RULES;
    return {
      name: st.name, zones: st.zones, land: st.land, bag: st.bag, tiles: trimTiles(st.tiles), pets: st.pets.map((p) => ({ id: p.id, k: p.k, name: p.name, z: p.z, fed: p.fed === vnDay() })), water: st.water, beauty, level, levelTitle: G.LEVELS[level - 1].title,
      next: nl ? { level: nl.n, need: nl.at - beauty, title: nl.title } : null, slots: G.petSlots(level),
      quests: X ? X.questsView(st) : null, events: X ? X.eventsView(st) : null, passport: Object.keys(st.passport || {}).filter((k) => st.passport[k] && st.passport[k].stamp),
      left: { yield: Math.max(0, R.yieldCapDay - st.yield_xu), feed: Math.max(0, R.feedCapDay - st.feed_xu), quiz: Math.max(0, R.quizCapDay - st.quiz_ok) }, now: t, quizTotal: st.quiz_total
    };
  }
  const reply = (res, user, st, extra) => res.json(Object.assign({ garden: view(st), coins: coinsOf(user.id) }, extra || {}));
  const bad = (res, msg, code) => res.status(code || 400).json({ error: msg });
  const tx = (fn) => { db.exec('BEGIN'); try { const r = fn(); db.exec('COMMIT'); return r; } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} throw e; } };

  app.get('/api/garden', requireAuth, (req, res) => { const st = load(req.user); try { X.scanHomework(req.user); } catch (e) { console.error('[garden/homework]', e.message); } X.track(st, 'login', 0); save(st); reply(res, req.user, st, { inbox: X.inboxCount(req.user.id) }); });

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
        const zn = G.zoneOfCell(i), ll = landLv(st, zn);
        const fp = it.kind === 'big' ? G.footprint(i, it, ll) : (G.inLand(i, ll) ? [i] : null);
        if (!fp) return { err: it.kind === 'big' ? 'Công trình này không vừa chỗ — hãy chọn ô khác (cần đủ ' + it.w + '×' + it.h + ' ô trống trong đất của khu).' : 'Ô này nằm ngoài đất đã mở của khu — hãy mở rộng đất trước nhé.' };
        if (it.z && it.z !== zn.id) return { err: 'Món này là đặc sản của khu "' + ((G.ZBY[it.z] || {}).name || it.z) + '" — chỉ đặt được ở khu đó nhé.' };
        if (fp.some((k) => G.isBlocked(k) || G.zoneOfCell(k).id !== G.zoneOfCell(i).id)) return { err: 'Đây là phong cảnh có sẵn của khu, hãy chọn ô đất trống khác nhé.' };
        if (fp.some((k) => st.tiles[k])) return { err: 'Chỗ này đã có đồ — cần ' + fp.length + ' ô trống liền nhau.' };
        if (st.zones.indexOf(G.zoneOfCell(i).id) < 0) return { err: 'Khu này chưa được mở.' };
        if (st.tiles[i]) return { err: 'Ô này đã có đồ — hãy dọn trước nhé.' };
        const cls = FREE_CLS[it.kind], inBag = (st.bag.items[it.id] | 0) > 0; let used = null;
        if (!inBag && it.lvl > lvl) return { err: 'Cần vườn cấp ' + it.lvl + ' để mở món này.' };
        if (it.ev && !inBag && !X.evIsActive(it.ev)) return { err: 'Món này là đồ giới hạn của sự kiện "' + G.EV.EBY[it.ev].name + '" — đã hết mùa rồi, hẹn bạn mùa sau nhé! 🎉' };
        if (inBag) { if (--st.bag.items[it.id] <= 0) delete st.bag.items[it.id]; used = 'bag'; }
        else if (it.cost > 0 && st.bag.free[cls] > 0) { st.bag.free[cls]--; used = 'free'; }
        else if (it.cost > 0) { const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(it.cost, req.user.id, it.cost); if (!r.changes) return { err: 'Chưa đủ xu (cần ' + it.cost + ' 🪙). Trả lời câu hỏi để kiếm thêm nhé!', need: it.cost }; }
        st.tiles[i] = { k: it.id, at: Date.now(), w: 0 };
        if (it.kind === 'big') fp.forEach((k) => { if (k !== i) st.tiles[k] = { ref: i }; });
        X.track(st, it.kind === 'plant' || it.kind === 'tree' ? 'plant' : 'deco', 1);
        X.evOwn(st, it.id);
        save(st); return { st, used };
      });
      if (out.err) return bad(res, out.err);
      reply(res, req.user, out.st, { used: out.used });
    } catch (e) { console.error('[garden/place]', e.message); bad(res, 'Có lỗi, thử lại nhé.', 500); }
  });

  app.post('/api/garden/remove', requireAuth, (req, res) => {
    let i = Number((req.body || {}).i);
    try {
      const out = tx(() => {
        const st = load(req.user); if (!Number.isInteger(i) || !st.tiles[i]) return { err: 'Ô này đang trống.' };
        if (st.tiles[i].ref != null) i = st.tiles[i].ref;     // bấm vào phần phụ của công trình lớn → dọn cả công trình
        const t = st.tiles[i]; if (!t) return { err: 'Ô này đang trống.' };
        const it = G.BY[t.k]; let stored = null;
        if (it && it.cost > 0) { bagAdd(st, it.id); stored = it.name; }   // món đã mua → tự cất vào giỏ để dùng lại
        (it && it.kind === 'big' ? G.footprint(i, it, G.LAND.length - 1) || [i] : [i]).forEach((k) => { st.tiles[k] = null; });
        save(st); return { st, stored };
      });
      if (out.err) return bad(res, out.err);
      reply(res, req.user, out.st, { stored: out.stored });
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
      st.water--; t.w++; X.track(st, 'water', 1); save(st); return { st };
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
    X.track(st, 'harvest', 1);
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

  // Cho cây lớn ngay: tốn xu theo thời gian còn lại (càng chờ lâu càng tốn), hoặc dùng phiếu "lớn nhanh" nếu có
  app.post('/api/garden/grow', requireAuth, (req, res) => {
    const i = Number((req.body || {}).i), useFree = !!(req.body || {}).free;
    const out = tx(() => {
      const st = load(req.user), t = st.tiles[i], it = t && G.BY[t.k];
      if (!it || (it.kind !== 'plant' && it.kind !== 'tree')) return { err: 'Chỉ cho hoa và cây lớn nhanh được.' };
      const now = Date.now();
      if (G.stageOf(it, t, now) >= 3) return { err: 'Cây này đã nở rồi.' };
      const cost = G.boostCost(G.remainMs(it, t, now));
      if (useFree && st.bag.free.boost > 0) st.bag.free.boost--;
      else { const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(cost, req.user.id, cost); if (!r.changes) return { err: 'Chưa đủ xu (cần ' + cost + ' 🪙) để cho cây lớn ngay.', need: cost }; }
      t.at = now - G.growMs(it, t.w) - 1000; save(st); return { st, cost: useFree ? 0 : cost };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { spent: out.cost });
  });

  // Mở rộng đất của một khu (đã mở): lưới ô to hơn, ô nhỏ lại để vừa màn hình
  app.post('/api/garden/land/expand', requireAuth, (req, res) => {
    const z = G.ZBY[String((req.body || {}).zone)];
    const out = tx(() => {
      const st = load(req.user), lvl = G.levelOf(G.beautyOf(st));
      if (!z) return { err: 'Khu này không tồn tại.' };
      if (st.zones.indexOf(z.id) < 0) return { err: 'Hãy mở khu này trước khi mở rộng đất.' };
      const cur = landLv(st, z), nx = G.LAND[cur + 1];
      if (!nx) return { err: 'Khu này đã mở rộng hết cỡ rồi!' };
      if (nx.lvl > lvl) return { err: 'Cần vườn cấp ' + nx.lvl + ' để mở rộng đất lên ' + nx.c + '×' + nx.r + ' ô.' };
      if (nx.cost > 0) { const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(nx.cost, req.user.id, nx.cost); if (!r.changes) return { err: 'Chưa đủ xu để mở rộng đất (cần ' + nx.cost + ' 🪙).', need: nx.cost }; }
      st.land[z.id] = cur + 1; X.track(st, 'expand', 1); save(st); return { st };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st);
  });

  // Mở thêm một khu mới (cần đủ cấp vườn và xu)
  app.post('/api/garden/zone/unlock', requireAuth, (req, res) => {
    const z = G.ZBY[String((req.body || {}).zone)];
    const out = tx(() => {
      const st = load(req.user), lvl = G.levelOf(G.beautyOf(st));
      if (!z) return { err: 'Khu này không tồn tại.' };
      if (st.zones.indexOf(z.id) >= 0) return { err: 'Khu này đã được mở rồi.' };
      if (z.lvl > lvl) return { err: 'Cần vườn cấp ' + z.lvl + ' để mở khu "' + z.name + '".' };
      if (z.cost > 0) { const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(z.cost, req.user.id, z.cost); if (!r.changes) return { err: 'Chưa đủ xu để mở khu này (cần ' + z.cost + ' 🪙).' }; }
      st.zones.push(z.id); X.track(st, 'expand', 1); save(st); return { st };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st);
  });

  /* ───── thú cưng ───── */
  app.post('/api/garden/pet/adopt', requireAuth, (req, res) => {
    const pt = G.PBY[(req.body || {}).id], zid = String((req.body || {}).zone || '');
    const out = tx(() => {
      const st = load(req.user), lvl = G.levelOf(G.beautyOf(st));
      if (!pt) return { err: 'Thú cưng này không tồn tại.' };
      if (pt.z && pt.z !== zid) return { err: 'Bé này là thú cưng đặc sản của khu "' + ((G.ZBY[pt.z] || {}).name || pt.z) + '" — chỉ nuôi được ở khu đó.' };
      if (!G.ZBY[zid] || st.zones.indexOf(zid) < 0) return { err: 'Hãy vào một khu của bạn rồi nhận nuôi thú cưng ở đó nhé — mỗi bé chỉ sống ở một khu.' };
      if (st.pets.filter((x) => x.z === zid).length >= G.petSlots(lvl)) return { err: 'Khu này đã đủ chỗ cho thú cưng — hãy lên cấp vườn để có thêm chỗ, hoặc nhận nuôi ở khu khác nhé.' };
      const bi = st.bag.pets.findIndex((x) => x.k === pt.id); let nm = pt.name, used = null;
      if (bi >= 0) { nm = st.bag.pets[bi].name || pt.name; st.bag.pets.splice(bi, 1); used = 'bag'; }
      else {
        if (pt.lvl > lvl) return { err: 'Cần vườn cấp ' + pt.lvl + ' để nhận nuôi bé này.' };
        if (pt.ev && !X.evIsActive(pt.ev)) return { err: 'Bé này là thú cưng giới hạn của sự kiện "' + G.EV.EBY[pt.ev].name + '" — đã hết mùa rồi, hẹn bạn mùa sau nhé! 🎉' };
        if (pt.cost > 0 && st.bag.free.pet > 0) { st.bag.free.pet--; used = 'free'; }
        else { const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(pt.cost, req.user.id, pt.cost); if (!r.changes) return { err: 'Chưa đủ xu (cần ' + pt.cost + ' 🪙).' }; }
      }
      st.pets.push({ id: crypto.randomBytes(3).toString('hex'), k: pt.id, name: nm, z: zid, fed: null }); X.evOwn(st, pt.id); save(st); return { st, used };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { used: out.used });
  });
  app.post('/api/garden/pet/feed', requireAuth, (req, res) => {
    const out = tx(() => {
      const st = load(req.user), p = st.pets.find((x) => x.id === (req.body || {}).pid);
      if (!p) return { err: 'Không thấy thú cưng này.' };
      if (p.fed === vnDay()) return { err: p.name + ' đã được ăn hôm nay rồi.' };
      p.fed = vnDay(); let gain = 0; X.track(st, 'feed', 1);
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
    const st = load(req.user), p = st.pets.find((x) => x.id === (req.body || {}).pid);
    if (!p) return bad(res, 'Không thấy thú cưng này.');
    st.pets = st.pets.filter((x) => x !== p); if (st.bag.pets.length < 60) st.bag.pets.push({ k: p.k, name: p.name });   // cất vào giỏ, nhận nuôi lại miễn phí
    save(st); reply(res, req.user, st, { stored: p.name });
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
    try { const me = load(req.user); X.track(me, 'visit', 1); save(me); } catch (e) { /* bỏ qua */ }
    const st = Object.assign(fromRow(row), { quiz_total: 0, yield_xu: 0, feed_xu: 0, quiz_ok: 0 });
    const v = view(st); v.left = { yield: 0, feed: 0, quiz: 0 }; v.bag = null; v.events = X.eventsView(null); v.quests = null;
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
  const userOf = (uid) => one('SELECT id, name FROM users WHERE id=?', uid);
  function rollCard(st) {
    const F = G.FLIP, t = pickW(F.types), coin = () => ({ t: 'coin', v: pickW(F.normal) });
    if (t === 'coin') return coin();
    if (F.big[t]) return { t, v: F.big[t] };
    if (F.mult[t]) return { t, v: 0 };   // ×2 / ×3: tính theo số xu lúc lật
    if (F.free[t]) return { t, v: F.free[t].n };
    if (t === 'water') return { t, v: F.water };
    if (t === 'boost') return { t, v: F.boost };
    if (t === 'pet') {
      const lv = G.levelOf(G.beautyOf(st)), pool = G.PETS.filter((p) => p.lvl <= lv + 3 && !st.pets.some((x) => x.k === p.id) && !st.bag.pets.some((x) => x.k === p.id));
      return pool.length ? { t, id: pool[crypto.randomInt(pool.length)].id, v: 1 } : coin();
    }
    if (t === 'zone') {
      const z = G.ZONES.filter((q) => st.zones.indexOf(q.id) < 0).sort((a, b) => (a.lvl - b.lvl) || (a.cost - b.cost))[0];
      return z ? { t, id: z.id, v: 1 } : coin();
    }
    return coin();
  }
  // Áp dụng một thẻ cho người chơi: cộng xu / phiếu / thú cưng / mở khu. Thẻ nhân tính trên TOÀN BỘ số xu hiện có (×3 của 2500 = 7500).
  function applyCardSt(st, uid, c) {
    const F = G.FLIP; let gained = 0, got = '';
    if (c.t === 'coin' || F.big[c.t]) gained = c.v;
    else if (F.mult[c.t]) gained = Math.max(F.multMin, coinsOf(uid) * (F.mult[c.t] - 1));
    else if (F.free[c.t]) { const f = F.free[c.t]; st.bag.free[f.cls] += f.n; got = 'Mua miễn phí ' + f.n + ' ' + f.label; }
    else if (c.t === 'water') { st.water += c.v; got = '+' + c.v + ' lượt tưới 💧'; }
    else if (c.t === 'boost') { st.bag.free.boost += c.v; got = 'Phiếu cho cây lớn ngay'; }
    else if (c.t === 'pet' && G.PBY[c.id]) { if (st.bag.pets.length < 60) st.bag.pets.push({ k: c.id, name: G.PBY[c.id].name }); got = 'Mở khoá thú cưng ' + G.PBY[c.id].name + ' (đã vào giỏ)'; }
    else if (c.t === 'zone' && G.ZBY[c.id]) {
      if (st.zones.indexOf(c.id) < 0) { st.zones.push(c.id); got = 'Mở khoá khu "' + G.ZBY[c.id].name + '"'; } else gained = 300;
    } else gained = 20;
    if (gained > 0) addCoins(uid, gained);
    return { gained, got };
  }
  function applyCard(user, c) { const st = load(user), r = applyCardSt(st, user.id, c); save(st); return { gained: r.gained, got: r.got, st }; }
  // Thẻ chưa lật (học sinh bỏ qua) → tự nhận ngẫu nhiên một thẻ để không mất thưởng
  function settleFlips(uid) {
    for (const [k, f] of flips) if (f.uid === uid) { flips.delete(k); const u = userOf(uid); if (u) applyCard(u, f.cards[crypto.randomInt(f.cards.length)]); }
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
  const sameMeaning = (a, b) => VC.conflict(a, b);   // trùng nghĩa hoặc đồng nghĩa (xem js/vocab-conflict.js)
  // Câu điền từ vào chỗ trống: lấy câu ví dụ của từ, kèm bản dịch tiếng Việt làm ngữ cảnh.
  // Độ khó theo cấp: KET (lớp 6–7) đáp án nhiễu khác chủ đề/loại từ dễ phân biệt; PET (lớp 8–10) ưu tiên cùng chủ đề; FCE/IELTS (lớp 11–12 trở lên) cùng chủ đề + cùng loại từ.
  const gapRe = (w) => new RegExp('(^|[^A-Za-z])(' + String(w).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![A-Za-z])', 'i');
  function pickVocabGap(uid, level) {
    const lv = ['KET', 'PET', 'FCE', 'IELTS'].includes(level) ? level : 'KET';
    const rows = db.prepare("SELECT id, word, pos, meaning_vi, topic, example_en, example_vi FROM vocab_words WHERE level=? AND (kind='word' OR kind IS NULL) ORDER BY RANDOM() LIMIT 90").all(lv);
    const cand = rows.filter((r) => r.example_en && r.example_vi && gapRe(r.word).test(r.example_en));
    if (cand.length < 1 || rows.length < 4) return null;
    const rc = recent.get(uid) || [], w = cand.find((r) => rc.indexOf('g' + r.id) < 0) || cand[0]; remember(uid, 'g' + w.id);
    const m = gapRe(w.word).exec(w.example_en), shown = m[2], start = m.index + m[1].length;
    const sentence = w.example_en.slice(0, start) + '_____' + w.example_en.slice(start + shown.length);
    const ok = rows.filter((r) => r.id !== w.id && !VC.conflict(w, r) && !gapRe(r.word).test(w.example_en) && w.example_en.toLowerCase().indexOf(r.word.toLowerCase()) < 0);
    const samePos = (r) => r.pos === w.pos, sameTopic = (r) => r.topic === w.topic;
    let pref;
    if (lv === 'KET') pref = shuf(ok.filter(samePos)).concat(shuf(ok.filter((r) => !samePos(r))));
    else pref = shuf(ok.filter((r) => sameTopic(r) && samePos(r))).concat(shuf(ok.filter((r) => !sameTopic(r) && samePos(r))), shuf(ok.filter((r) => sameTopic(r) && !samePos(r))), shuf(ok.filter((r) => !sameTopic(r) && !samePos(r))));
    const d = [], seen = {}; seen[w.word.toLowerCase()] = 1;
    for (const r of pref) { if (d.length >= 3) break; const k = r.word.toLowerCase(); if (!seen[k] && r.word.split(' ').length === w.word.split(' ').length) { seen[k] = 1; d.push(r); } }
    if (d.length < 3) return null;
    const cap = /^[A-Z]/.test(shown), show = (t) => (cap ? t.charAt(0).toUpperCase() + t.slice(1) : t);
    const opts = shuf([{ t: shown, ok: true }].concat(d.map((r) => ({ t: show(r.word), ok: false }))));
    return { src: 'vocab', topic: lv + ' · ' + w.topic + ' · điền từ', q: sentence, ctx: w.example_vi, opts: opts.map((o) => o.t), idx: opts.findIndex((o) => o.ok), expl: w.word + ' (' + w.pos + ') = ' + w.meaning_vi + '. ' + w.example_en };
  }
  function pickVocab(uid, level, type) {
    if (type === 'gap' || (type !== 'meaning' && Math.random() < 0.5)) { const g = pickVocabGap(uid, level); if (g) return g; }
    return pickVocabMeaning(uid, level);
  }
  function pickVocabMeaning(uid, level) {
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
    const q = src === 'vocab' ? pickVocab(req.user.id, String(req.query.level || ''), String(req.query.type || '')) : pickGrammar(req.user.id, Number(req.query.grade) || 0, String(req.query.lesson || ''));
    if (!q) return bad(res, 'Chưa có câu hỏi phù hợp, hãy chọn mục khác nhé.');
    const qid = crypto.randomBytes(6).toString('hex'); pending.set(qid, { uid: req.user.id, idx: q.idx, expl: q.expl, ts: Date.now(), opts: q.opts });
    for (const [k, v] of pending) if (Date.now() - v.ts > 15 * 60e3) pending.delete(k);
    res.json({ qid, src: q.src, topic: q.topic, q: q.q, ctx: q.ctx || '', opts: q.opts, left: Math.max(0, G.RULES.quizCapDay - st.quiz_ok) });
  });
  app.post('/api/garden/quiz/answer', requireAuth, (req, res) => {
    const p = pending.get(String((req.body || {}).qid)), pick = Number((req.body || {}).idx);
    if (!p || p.uid !== req.user.id) return bad(res, 'Câu hỏi đã hết hạn, hãy lấy câu mới nhé.');
    pending.delete(String(req.body.qid));
    const ok = pick === p.idx, R = G.RULES;
    const out = tx(() => {
      const st = load(req.user); st.quiz_total++; let wt = 0, fid = null;
      if (ok && st.quiz_ok < R.quizCapDay) {
        st.quiz_ok++; wt = R.quizWater; st.water += wt; X.track(st, 'quiz', 1);
        fid = crypto.randomBytes(6).toString('hex');
        flips.set(fid, { uid: req.user.id, ts: Date.now(), cards: Array.from({ length: G.FLIP.cards }, () => rollCard(st)) });
      }
      save(st); return { st, wt, fid };
    });
    for (const [k, v] of flips) if (Date.now() - v.ts > 15 * 60e3) { flips.delete(k); const u = userOf(v.uid); if (u) applyCard(u, v.cards[0]); }
    reply(res, req.user, out.st, { correct: ok, answer: p.idx, expl: p.expl, gained: { xu: 0, water: out.wt }, flip: out.fid, capped: ok && !out.fid });
  });
  // Lật thẻ thưởng: máy chủ đã định sẵn giá trị các thẻ, người chơi chỉ chọn vị trí
  app.post('/api/garden/quiz/flip', requireAuth, (req, res) => {
    const f = flips.get(String((req.body || {}).id)), pick = Number((req.body || {}).pick);
    if (!f || f.uid !== req.user.id) return bad(res, 'Thẻ thưởng đã được nhận hoặc đã hết hạn.');
    if (!Number.isInteger(pick) || pick < 0 || pick >= f.cards.length) return bad(res, 'Hãy chọn một thẻ.');
    flips.delete(String(req.body.id));
    const before = coinsOf(req.user.id);
    const out = tx(() => applyCard(req.user, f.cards[pick]));
    reply(res, req.user, out.st, { cards: f.cards, pick, gained: out.gained, got: out.got, before });
  });

  X = require('./garden-extra')(app, { db, requireAuth, requireRole, now, G, vnDay, load, save, tx, reply, bad, coinsOf, addCoins, rollCard, applyCardSt, bagAdd, givenName, one });
};
