'use strict';
// 🏙️ EWT City — game xây thành phố. Máy chủ giữ toàn bộ trạng thái và kiểm tra giá, cấp, thời gian xây (trình duyệt chỉ hiển thị).
// Dùng chung ví xu 🪙 với EWT Garden / Luyện từ (bảng word_game.coins). Luật và danh mục nằm ở js/city-data.js (dùng chung với trình duyệt).
const crypto = require('crypto');
const C = require('./js/city-data.js');
const L = require('./js/city-learn.js');

module.exports = function (app, { db, requireAuth, now, notifyUser }) {
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const vnDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const R = C.RULES, MATCH_DAY = 5;
  const evOn = (id) => { try { return !!(app.locals.gardenEvActive && app.locals.gardenEvActive(id)); } catch (_) { return false; } };
  const evList = () => { try { return app.locals.gardenEvList ? app.locals.gardenEvList() : []; } catch (_) { return []; } };
  // kiểm tra chung: cấp thành phố, chương đã học, sự kiện đang diễn ra
  const itemGate = (st, s, it, role) => {
    if (s.level < it.lvl) return 'Cần thành phố cấp ' + it.lvl + ' để mở ' + it.vi + '.';
    if (it.ch && !st.chapters[it.ch] && role !== 'admin') return 'Hãy học xong chương “' + L.BY[it.ch].en + '” (' + L.BY[it.ch].vi + ') để mở ' + it.vi + '.';
    if (it.ev && !evOn(it.ev)) return it.vi + ' là vật phẩm sự kiện — chỉ có khi sự kiện đang diễn ra.';
    return '';
  };

  db.exec(`CREATE TABLE IF NOT EXISTS city (user_id INTEGER PRIMARY KEY, state TEXT NOT NULL, updated_at TEXT)`);
  const coinsOf = (uid) => { db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(uid); return one('SELECT coins FROM word_game WHERE user_id=?', uid).coins; };
  const addCoins = (uid, n) => { db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(uid); db.prepare('UPDATE word_game SET coins=coins+? WHERE user_id=?').run(n, uid); };
  const spend = (uid, n) => n <= 0 || db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(n, uid, n).changes > 0;
  const bad = (res, msg, code) => res.status(code || 400).json({ error: msg });
  const tx = (fn) => { db.exec('BEGIN'); try { const r = fn(); if (r && r.err) db.exec('ROLLBACK'); else db.exec('COMMIT'); return r; } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} throw e; } };

  function fresh() { return { v: 1, districts: [0], roads: {}, bs: [], nid: 1, free: Object.assign({}, R.freeStart), tickets: 0, coupons: 0, q: { d: '', n: 0 }, chapters: {}, inv: {}, open: 1, lm: { d: '', n: 0 }, created: Date.now() }; }
  function load(uid) {
    const r = one('SELECT state FROM city WHERE user_id=?', uid); let st = r ? J(r.state, null) : null;
    if (!st || typeof st !== 'object') { st = fresh(); db.prepare('INSERT OR REPLACE INTO city (user_id,state,updated_at) VALUES (?,?,?)').run(uid, JSON.stringify(st), now()); }
    st.districts = (Array.isArray(st.districts) ? st.districts : [0]).filter((d) => C.DISTRICTS[d]); if (st.districts.indexOf(0) < 0) st.districts.unshift(0);
    st.roads = st.roads && typeof st.roads === 'object' ? st.roads : {}; st.bs = (Array.isArray(st.bs) ? st.bs : []).filter((b) => b && C.BY[b.k]);
    st.free = st.free || {}; st.tickets = st.tickets | 0; st.coupons = st.coupons | 0; st.q = st.q || { d: '', n: 0 }; st.chapters = st.chapters && typeof st.chapters === 'object' ? st.chapters : {}; st.lm = st.lm || { d: '', n: 0 }; st.inv = st.inv && typeof st.inv === 'object' ? st.inv : {}; st.open = st.open === 0 ? 0 : 1; st.nid = st.nid || (st.bs.reduce((m, b) => Math.max(m, b.i), 0) + 1);
    settle(st, Date.now()); return st;
  }
  const save = (uid, st) => db.prepare('UPDATE city SET state=?, updated_at=? WHERE user_id=?').run(JSON.stringify(st), now(), uid);
  // hoàn tất các công trình đã xây/nâng cấp xong
  function settle(st, t) { st.bs.forEach((b) => { if (b.tg > b.lv && b.t1 <= t) { if (b.lv === 0) b.last = b.t1; b.lv = b.tg; } }); }

  /* ───── số liệu thành phố ───── */
  function stats(st) {
    let pop = 0, hp = 0, n = 0;
    st.bs.forEach((b) => { if (b.lv > 0) { const it = C.BY[b.k]; pop += C.popOf(it, b.lv); hp += C.hpOf(it, b.lv); n++; } });
    const ratio = hp / (0.35 * pop + 10), happy = Math.round(40 + 60 * Math.min(1, ratio)), mult = 0.7 + 0.4 * (happy / 100);
    const score = C.scoreOf(st.bs.map((b) => ({ k: b.k, lv: b.lv, bt: b.lv === 0 }))), level = C.levelOfScore(score);
    return { pop, hp, happy, mult, score, level, nextAt: C.LEVEL_AT[level] || null, n };
  }
  const pending = (b, s, t) => { if (b.lv <= 0) return 0; const it = C.BY[b.k], inc = C.incomeH(it, b.lv); if (!inc) return 0; const h = Math.min(R.incomeCapH, Math.max(0, (t - (b.last || t)) / 3600e3)); return Math.floor(inc * s.mult * h); };
  function view(st, uid) {
    const t = Date.now(), s = stats(st);
    return { districts: st.districts, roads: Object.keys(st.roads).map(Number), bs: st.bs.map((b) => ({ i: b.i, k: b.k, x: b.x, y: b.y, lv: b.lv, tg: b.tg, t0: b.t0, t1: b.t1, pend: pending(b, s, t) })),
      free: st.free, inv: st.inv, open: st.open, ev: evList(), tickets: st.tickets, coupons: st.coupons, stats: s, quizLeft: Math.max(0, R.quizDayCap - (st.q.d === vnDay() ? st.q.n : 0)), chapters: Object.keys(st.chapters), matchLeft: Math.max(0, MATCH_DAY - (st.lm.d === vnDay() ? st.lm.n : 0)), now: t, coins: coinsOf(uid) };
  }
  const reply = (res, st, uid, extra) => res.json(Object.assign({ city: view(st, uid) }, extra || {}));
  const getB = (st, id) => st.bs.find((b) => b.i === Number(id));

  app.get('/api/city', requireAuth, (req, res) => {
    const st = load(req.user.id);
    // tài khoản quản trị: tặng sẵn xu lớn MỘT lần để thử game (học sinh thì không — tự kiếm)
    if (req.user.role === 'admin' && !st.adminBonus) { st.adminBonus = 1; db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(req.user.id); db.prepare('UPDATE word_game SET coins=MAX(coins, ?) WHERE user_id=?').run(999999999, req.user.id); }
    save(req.user.id, st); reply(res, st, req.user.id, { role: req.user.role });
  });

  /* ───── đặt công trình ───── */
  app.post('/api/city/place', requireAuth, (req, res) => {
    const b = req.body || {}, it = C.BY[String(b.k)], x = Number(b.x), y = Number(b.y), uid = req.user.id;
    if (!it || !Number.isInteger(x) || !Number.isInteger(y)) return bad(res, 'Yêu cầu không hợp lệ.');
    const out = tx(() => {
      const st = load(uid), s = stats(st);
      const gate = itemGate(st, s, it, req.user.role); if (gate) return { err: gate };
      const occ = C.buildOcc(st.bs), ok = C.canPlace(st, it, x, y, occ); if (!ok.ok) return { err: ok.err };
      if (st.free[it.k] > 0) { st.free[it.k]--; if (!st.free[it.k]) delete st.free[it.k]; }
      else if (st.inv[it.k] > 0) { st.inv[it.k]--; if (!st.inv[it.k]) delete st.inv[it.k]; }
      else if (!spend(uid, it.cost)) return { err: 'Chưa đủ xu (cần ' + it.cost + ' 🪙). Trả lời câu hỏi để kiếm thêm nhé!' };
      const t = Date.now(), nb = { i: st.nid++, k: it.k, x, y, lv: 0, tg: 1, t0: t, t1: t + C.buildSecs(it, 1) * 1000, last: t };
      st.bs.push(nb); save(uid, st); return { st, id: nb.i };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { placed: out.id });
  });

  /* ───── xây / dỡ đường ───── */
  app.post('/api/city/road', requireAuth, (req, res) => {
    const cells = Array.isArray((req.body || {}).cells) ? req.body.cells.map(Number) : [], uid = req.user.id;
    if (!cells.length || cells.length > 120 || cells.some((c) => !Number.isInteger(c) || c < 0 || c >= C.W * C.H)) return bad(res, 'Yêu cầu không hợp lệ.');
    const out = tx(() => {
      const st = load(uid), occ = C.buildOcc(st.bs), add = {}; let n = 0;
      // thêm lần lượt: mỗi ô phải nối với đường có sẵn / đường vừa thêm
      let left = cells.slice(), progress = true;
      while (left.length && progress) {
        progress = false; const rest = [];
        for (const c of left) {
          const x = c % C.W, y = Math.floor(c / C.W), ck = C.canRoad({ districts: st.districts, roads: Object.assign({}, st.roads, add) }, x, y, occ);
          if (!ck.ok) { if (/Đã có đường/.test(ck.err)) { progress = true; continue; } return { err: ck.err }; }
          const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].some((d) => C.isRoadAt(x + d[0], y + d[1], Object.assign({}, st.roads, add)));
          if (nb) { add[c] = 1; n++; progress = true; } else rest.push(c);
        }
        left = rest;
      }
      if (left.length) return { err: 'Đường mới phải nối liền với một con đường đã có.' };
      if (!n) return { err: 'Không có ô đường mới nào để xây.' };
      const cost = n * R.roadCost; if (!spend(uid, cost)) return { err: 'Chưa đủ xu (cần ' + cost + ' 🪙 cho ' + n + ' ô đường).' };
      Object.assign(st.roads, add); save(uid, st); return { st, n, cost };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { roads: out.n, cost: out.cost });
  });
  app.post('/api/city/road/remove', requireAuth, (req, res) => {
    const cells = Array.isArray((req.body || {}).cells) ? req.body.cells.map(Number) : [], uid = req.user.id;
    if (!cells.length || cells.length > 120) return bad(res, 'Yêu cầu không hợp lệ.');
    const out = tx(() => {
      const st = load(uid); let n = 0;
      cells.forEach((c) => { if (st.roads[c]) { delete st.roads[c]; n++; } });
      if (!n) return { err: 'Chỉ dỡ được đường do bạn tự xây.' };
      // không để công trình nào mất lối ra đường
      for (const b of st.bs) { const it = C.BY[b.k]; if (!C.adjacentRoad(b.x, b.y, it.w, it.h, st.roads)) return { err: it.vi + ' sẽ mất đường vào — hãy dỡ công trình trước hoặc giữ lại đường này.' }; }
      addCoins(uid, n * R.roadRefund); save(uid, st); return { st, n };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { removed: out.n });
  });

  /* ───── dỡ / nâng cấp / đẩy nhanh / thu thuế ───── */
  app.post('/api/city/demolish', requireAuth, (req, res) => {
    const uid = req.user.id;
    const out = tx(() => {
      const st = load(uid), b = getB(st, (req.body || {}).i); if (!b) return { err: 'Không thấy công trình này.' };
      const it = C.BY[b.k]; let paid = 0, lv; for (lv = 1; lv <= Math.max(1, b.lv); lv++) paid += C.itemCost(it, lv);
      const back = Math.floor(paid * R.sellBack) + pending(b, stats(st), Date.now());
      st.bs = st.bs.filter((x) => x.i !== b.i); addCoins(uid, back); save(uid, st); return { st, back };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { refund: out.back });
  });
  app.post('/api/city/upgrade', requireAuth, (req, res) => {
    const uid = req.user.id;
    const out = tx(() => {
      const st = load(uid), b = getB(st, (req.body || {}).i); if (!b) return { err: 'Không thấy công trình này.' };
      const it = C.BY[b.k]; if (b.tg > b.lv) return { err: 'Công trình đang xây, hãy chờ xong rồi nâng cấp nhé.' };
      if (b.lv >= C.MAXLV) return { err: 'Công trình đã ở cấp cao nhất.' };
      const nl = b.lv + 1, cost = C.itemCost(it, nl), s = stats(st);
      if (s.level < it.lvl + (nl - 1) * 2) return { err: 'Cần thành phố cấp ' + (it.lvl + (nl - 1) * 2) + ' để nâng ' + it.vi + ' lên cấp ' + nl + '.' };
      if (!spend(uid, cost)) return { err: 'Chưa đủ xu (cần ' + cost + ' 🪙).' };
      const t = Date.now(); addCoins(uid, pending(b, s, t));             // thu nốt thuế trước khi nâng cấp
      b.tg = nl; b.t0 = t; b.t1 = t + C.buildSecs(it, nl) * 1000; b.last = b.t1; save(uid, st); return { st };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { upgraded: true });
  });
  app.post('/api/city/speed', requireAuth, (req, res) => {
    const uid = req.user.id, mode = ['x2', 'now', 'ticket'].indexOf(String((req.body || {}).mode)) >= 0 ? String(req.body.mode) : '';
    if (!mode) return bad(res, 'Yêu cầu không hợp lệ.');
    const out = tx(() => {
      const st = load(uid), b = getB(st, (req.body || {}).i); if (!b || !(b.tg > b.lv)) return { err: 'Công trình này không còn đang xây.' };
      const t = Date.now(), remain = Math.max(0, (b.t1 - t) / 1000);
      if (mode === 'ticket') { if (st.tickets < 1) return { err: 'Bạn chưa có phiếu xây nhanh.' }; st.tickets--; b.t1 = t; }
      else if (mode === 'now') { const c = C.speedCost('now', remain); if (!spend(uid, c)) return { err: 'Chưa đủ xu (cần ' + c + ' 🪙).' }; b.t1 = t; }
      else { const c = C.speedCost('x2', remain); if (!spend(uid, c)) return { err: 'Chưa đủ xu (cần ' + c + ' 🪙).' }; b.t1 = t + Math.ceil(remain / 2) * 1000; }
      if (b.lv > 0) b.last = b.t1;            // đang nâng cấp: thuế tiếp tục tính từ lúc xong
      save(uid, st); return { st };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { sped: mode });
  });
  app.post('/api/city/collect', requireAuth, (req, res) => {
    const uid = req.user.id, body = req.body || {};
    const out = tx(() => {
      const st = load(uid), s = stats(st), t = Date.now(); let sum = 0, n = 0;
      st.bs.forEach((b) => { if (body.all || b.i === Number(body.i)) { const p = pending(b, s, t); if (p > 0) { sum += p; n++; b.last = t; } } });
      if (!sum) return { err: 'Chưa có thuế để thu — hãy chờ thêm một lúc nhé.' };
      addCoins(uid, sum); save(uid, st); return { st, sum, n };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { collected: out.sum, count: out.n });
  });

  /* ───── mở quận ───── */
  app.post('/api/city/district/unlock', requireAuth, (req, res) => {
    const uid = req.user.id, d = Number((req.body || {}).d), dd = C.DISTRICTS[d], useCoupon = !!(req.body || {}).coupon;
    if (!dd) return bad(res, 'Quận không tồn tại.');
    const out = tx(() => {
      const st = load(uid), s = stats(st);
      if (st.districts.indexOf(d) >= 0) return { err: 'Quận này đã mở rồi.' };
      if (dd.soon) return { err: 'Quận này sắp ra mắt — hãy chờ nhé!' };
      if (s.level < dd.lvl) return { err: 'Cần thành phố cấp ' + dd.lvl + ' để mở ' + dd.vi + '.' };
      let cost = dd.cost; if (useCoupon) { if (st.coupons < 1) return { err: 'Bạn chưa có phiếu giảm giá mở quận.' }; st.coupons--; cost = Math.round(cost * 0.6); }
      if (!spend(uid, cost)) return { err: 'Chưa đủ xu (cần ' + cost + ' 🪙).' };
      st.districts.push(d); save(uid, st); return { st };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { unlocked: d });
  });



  /* ───── mua trữ vào kho, gói combo, bản quy hoạch ───── */
  const INV_MAX = 60;
  app.post('/api/city/buy', requireAuth, (req, res) => {
    const b = req.body || {}, it = C.BY[String(b.k)], n = Math.floor(Number(b.n)), uid = req.user.id;
    if (!it || !(n >= 1 && n <= 50)) return bad(res, 'Yêu cầu không hợp lệ.');
    const out = tx(() => {
      const st = load(uid), s = stats(st), gate = itemGate(st, s, it, req.user.role); if (gate) return { err: gate };
      if ((st.inv[it.k] | 0) + n > INV_MAX) return { err: 'Kho chỉ chứa tối đa ' + INV_MAX + ' món mỗi loại.' };
      const cost = it.cost * n; if (!spend(uid, cost)) return { err: 'Chưa đủ xu (cần ' + cost + ' 🪙).' };
      st.inv[it.k] = (st.inv[it.k] | 0) + n; save(uid, st); return { st, cost };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { bought: n, cost: out.cost });
  });
  app.post('/api/city/bundle', requireAuth, (req, res) => {
    const bd = C.BUNDLE_BY[String((req.body || {}).id)], uid = req.user.id; if (!bd) return bad(res, 'Không tìm thấy gói này.');
    const out = tx(() => {
      const st = load(uid), s = stats(st);
      if (bd.ev && !evOn(bd.ev)) return { err: 'Gói này chỉ bán khi sự kiện đang diễn ra.' };
      if (bd.d >= 0 && st.districts.indexOf(bd.d) < 0) return { err: 'Hãy mở quận này trước nhé.' };
      for (const k of Object.keys(bd.items)) { const g = itemGate(st, s, C.BY[k], req.user.role); if (g && !/sự kiện/.test(g)) return { err: g }; if ((st.inv[k] | 0) + bd.items[k] > INV_MAX) return { err: 'Kho đầy ' + C.BY[k].vi + ' rồi.' }; }
      const cost = C.bundlePrice(bd); if (!spend(uid, cost)) return { err: 'Chưa đủ xu (cần ' + cost + ' 🪙).' };
      for (const k of Object.keys(bd.items)) st.inv[k] = (st.inv[k] | 0) + bd.items[k];
      save(uid, st); return { st, cost };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { cost: out.cost });
  });
  // Tính một bản quy hoạch đặt vào khối (bx,by): trả danh sách món hợp lệ + chi phí (dùng kho/phiếu miễn phí trước)
  function planEval(st, s, pl, bx, by, role) {
    const tmpRoads = Object.assign({}, st.roads), occ = C.buildOcc(st.bs), stub = { districts: st.districts, roads: tmpRoads }, roads = [], items = [];
    for (const r of pl.roads) { const x = bx + r[0], y = by + r[1], i = y * C.W + x; if (C.ROAD[i] || tmpRoads[i]) continue; const ck = C.canRoad(stub, x, y, occ); if (!ck.ok) return null; tmpRoads[i] = 1; roads.push(i); }
    const inv = Object.assign({}, st.inv), fr = Object.assign({}, st.free); let cost = roads.length * R.roadCost, ok = 0;
    for (const e of pl.items) {
      const it = C.BY[e[0]], x = bx + e[1], y = by + e[2], gate = itemGate(st, s, it, role); let why = gate;
      if (!why) { const ck = C.canPlace(stub, it, x, y, occ); if (!ck.ok) why = ck.err; }
      if (why) { items.push({ k: it.k, x, y, ok: false, why }); continue; }
      for (let a = 0; a < it.h; a++) for (let b2 = 0; b2 < it.w; b2++) occ[(y + a) * C.W + x + b2] = 9999;
      let src = 'xu'; if (fr[it.k] > 0) { fr[it.k]--; src = 'free'; } else if (inv[it.k] > 0) { inv[it.k]--; src = 'kho'; } else cost += it.cost;
      items.push({ k: it.k, x, y, ok: true, src }); ok++;
    }
    return { bx, by, roads, items, cost, ok, total: pl.items.length };
  }
  function planFind(st, s, pl, role, dFilter, alt) {
    const res = [];
    for (let by = 1; by + 5 <= C.H; by += 6) for (let bx = 1; bx + 5 <= C.W; bx += 6) {
      const d = C.DIST[by * C.W + bx]; if (st.districts.indexOf(d) < 0 || (dFilter >= 0 && d !== dFilter)) continue;
      const ev = planEval(st, s, pl, bx, by, role); if (ev && ev.ok > 0) { ev.d = d; res.push(ev); }
    }
    res.sort((a, b) => b.ok - a.ok || a.cost - b.cost || a.by - b.by || a.bx - b.bx);
    return { list: res, pick: res.length ? res[((alt % res.length) + res.length) % res.length] : null };
  }
  const planBody = (req) => { const b = req.body || {}; return { pl: C.PLAN_BY[String(b.plan)], d: b.d == null || b.d === '' ? -1 : Number(b.d), alt: Math.floor(Number(b.alt) || 0) }; };
  app.post('/api/city/plan/quote', requireAuth, (req, res) => {
    const { pl, d, alt } = planBody(req); if (!pl) return bad(res, 'Không tìm thấy bản quy hoạch.');
    const st = load(req.user.id), s = stats(st), f = planFind(st, s, pl, req.user.role, d, alt);
    if (!f.pick) return bad(res, 'Chưa có khối đất trống phù hợp (khu ' + C.zoneList(pl.z === '*' ? 'prfcseihw' : pl.z) + ') trong các quận đã mở, hoặc bạn chưa đủ cấp / chưa học chương cần thiết.');
    const p = f.pick; res.json({ plan: pl.id, d: p.d, bx: p.bx, by: p.by, cost: p.cost, roads: p.roads.length, ok: p.ok, total: p.total, items: p.items, blocks: f.list.length, coins: coinsOf(req.user.id) });
  });
  app.post('/api/city/plan/apply', requireAuth, (req, res) => {
    const { pl, d, alt } = planBody(req), uid = req.user.id, bx = Number((req.body || {}).bx), by = Number((req.body || {}).by); if (!pl) return bad(res, 'Không tìm thấy bản quy hoạch.');
    const out = tx(() => {
      const st = load(uid), s = stats(st); let ev;
      if (Number.isInteger(bx) && Number.isInteger(by) && (bx - 1) % 6 === 0 && (by - 1) % 6 === 0 && bx >= 1 && by >= 1 && bx + 5 <= C.W && by + 5 <= C.H) ev = planEval(st, s, pl, bx, by, req.user.role); else { const f = planFind(st, s, pl, req.user.role, d, alt); ev = f.pick; }
      if (!ev || !ev.ok) return { err: 'Không còn chỗ phù hợp cho bản quy hoạch này.' };
      if (ev.cost > 0 && !spend(uid, ev.cost)) return { err: 'Chưa đủ xu (cần ' + ev.cost + ' 🪙).' };
      ev.roads.forEach((i) => { st.roads[i] = 1; });
      const t = Date.now(); let n = 0;
      for (const e of ev.items) {
        if (!e.ok) continue; const it = C.BY[e.k];
        if (st.free[e.k] > 0) { st.free[e.k]--; if (!st.free[e.k]) delete st.free[e.k]; } else if (st.inv[e.k] > 0) { st.inv[e.k]--; if (!st.inv[e.k]) delete st.inv[e.k]; }
        st.bs.push({ i: st.nid++, k: it.k, x: e.x, y: e.y, lv: 0, tg: 1, t0: t, t1: t + C.buildSecs(it, 1) * 1000, last: t }); n++;
      }
      save(uid, st); return { st, n, cost: ev.cost, bx: ev.bx, by: ev.by };
    });
    if (out.err) return bad(res, out.err);
    reply(res, out.st, uid, { built: out.n, cost: out.cost, bx: out.bx, by: out.by });
  });

  /* ───── học từ theo chương (song ngữ) ───── */
  const shuf = (a) => { const r = a.slice(); for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; } return r; };
  // 3 dạng câu cho mỗi từ: nghĩa tiếng Việt / chọn từ tiếng Anh / điền chỗ trống theo ngữ cảnh. Luôn đúng 1 đáp án (đáp án nhiễu lấy từ các từ KHÁC trong cùng chương).
  function makeQ(chp, wi, type) {
    const w = chp.w[wi], others = shuf(chp.w.filter((_, i) => i !== wi)).slice(0, 3), all = shuf([w].concat(others)), ans = all.indexOf(w);
    const ex = { en: '“' + w[0] + '” ' + w[2] + ' means “' + w[1] + '”.', vi: '“' + w[0] + '” ' + w[2] + ' nghĩa là “' + w[1] + '”.' };
    if (type === 0) return { q: { en: 'What does “' + w[0] + '” mean?', vi: '“' + w[0] + '” nghĩa là gì?' }, opts: all.map((x) => ({ en: '', vi: x[1] })), ans, ex };
    if (type === 1) return { q: { en: 'Which English word means “' + w[1] + '”?', vi: 'Từ tiếng Anh nào có nghĩa là “' + w[1] + '”?' }, opts: all.map((x) => ({ en: x[0], vi: '' })), ans, ex };
    return { q: { en: 'Fill in the blank: ' + w[3], vi: 'Điền vào chỗ trống: ' + w[4] }, ctx: true, opts: all.map((x) => ({ en: x[0], vi: x[1] })), ans, ex };
  }
  const lsess = new Map(), msess = new Map(), lcl = () => { for (const [k, v] of lsess) if (Date.now() - v.ts > 30 * 60e3) lsess.delete(k); for (const [k, v] of msess) if (Date.now() - v.ts > 30 * 60e3) msess.delete(k); };
  const chInfo = (st) => L.CH.map((c) => ({ id: c.id, d: c.d, en: c.en, vi: c.vi, icon: c.icon, passed: !!st.chapters[c.id], best: (st.chapters[c.id] || {}).best || 0, items: C.ITEMS.filter((i) => i.ch === c.id).map((i) => i.k), words: c.w.map((w) => ({ en: w[0], vi: w[1], ipa: w[2], s: w[3].replace('___', w[0]), sv: w[4].replace('___', w[1]) })) }));
  app.get('/api/city/learn', requireAuth, (req, res) => { const st = load(req.user.id); res.json({ chapters: chInfo(st), pass: L.PASS, ask: L.ASK, reward: L.REWARD, matchLeft: Math.max(0, MATCH_DAY - (st.lm.d === vnDay() ? st.lm.n : 0)) }); });
  // bài kiểm tra chương: 5 câu, đúng từ 4 câu trở lên thì mở khoá công trình của chương
  app.post('/api/city/learn/start', requireAuth, (req, res) => {
    const chp = L.BY[String((req.body || {}).ch)]; if (!chp) return bad(res, 'Không tìm thấy chương này.');
    const st = load(req.user.id); if (st.districts.indexOf(chp.d) < 0) return bad(res, 'Hãy mở quận này trước nhé.');
    const idx = shuf(chp.w.map((_, i) => i)).slice(0, L.ASK), types = shuf([0, 1, 2, 2, 2]), qs = idx.map((wi, n) => makeQ(chp, wi, types[n]));
    lcl(); const sid = crypto.randomBytes(6).toString('hex'); lsess.set(sid, { uid: req.user.id, ch: chp.id, qs, ts: Date.now() });
    res.json({ sid, ch: chp.id, need: L.PASS, qs: qs.map((q) => ({ q: q.q, ctx: q.ctx, opts: q.opts })) });
  });
  app.post('/api/city/learn/submit', requireAuth, (req, res) => {
    const b = req.body || {}, ss = lsess.get(String(b.sid)), uid = req.user.id, picks = Array.isArray(b.picks) ? b.picks.map(Number) : [];
    if (!ss || ss.uid !== uid) return bad(res, 'Bài kiểm tra đã hết hạn, hãy bắt đầu lại nhé.'); lsess.delete(String(b.sid));
    const res2 = ss.qs.map((q, i) => ({ ok: picks[i] === q.ans, ans: q.ans, ex: q.ex })), score = res2.filter((r) => r.ok).length, pass = score >= L.PASS;
    const out = tx(() => {
      const st = load(uid); const rec = st.chapters[ss.ch] || null; let reward = 0, first = false;
      if (pass) { if (!rec) { st.chapters[ss.ch] = { best: score, at: Date.now() }; first = true; reward = L.REWARD; addCoins(uid, reward); } else if (score > rec.best) rec.best = score; }
      save(uid, st); return { st, reward, first };
    });
    reply(res, out.st, uid, { score, pass, need: L.PASS, results: res2, reward: out.reward, first: out.first });
  });
  // trò chơi ghép từ: nối 6 cặp EN–VI. Thưởng nhỏ, tối đa 5 lượt có thưởng mỗi ngày
  app.post('/api/city/learn/match/start', requireAuth, (req, res) => {
    const chp = L.BY[String((req.body || {}).ch)]; if (!chp) return bad(res, 'Không tìm thấy chương này.');
    const st = load(req.user.id); if (st.districts.indexOf(chp.d) < 0) return bad(res, 'Hãy mở quận này trước nhé.');
    const ws = shuf(chp.w).slice(0, 6); lcl(); const sid = crypto.randomBytes(6).toString('hex'); msess.set(sid, { uid: req.user.id, ts: Date.now() });
    res.json({ sid, pairs: ws.map((w) => ({ en: w[0], vi: w[1] })), left: Math.max(0, MATCH_DAY - (st.lm.d === vnDay() ? st.lm.n : 0)) });
  });
  app.post('/api/city/learn/match/done', requireAuth, (req, res) => {
    const b = req.body || {}, ss = msess.get(String(b.sid)), uid = req.user.id, miss = Math.max(0, Math.min(30, Number(b.miss) | 0));
    if (!ss || ss.uid !== uid) return bad(res, 'Lượt chơi đã hết hạn.'); msess.delete(String(b.sid));
    const secs = (Date.now() - ss.ts) / 1000; if (secs < 8) return bad(res, 'Chơi chậm lại một chút để nhớ từ nhé!');
    const out = tx(() => { const st = load(uid), day = vnDay(); if (st.lm.d !== day) st.lm = { d: day, n: 0 }; let reward = 0; if (st.lm.n < MATCH_DAY) { st.lm.n++; reward = Math.max(10, 40 - miss * 6); addCoins(uid, reward); } save(uid, st); return { st, reward }; });
    reply(res, out.st, uid, { reward: out.reward, capped: !out.reward });
  });

  /* ───── kiếm xu bằng câu hỏi (dùng kho câu hỏi của Garden) ───── */
  const pend = new Map(), flips = new Map();
  const wpick = (list) => { const tot = list.reduce((a, x) => a + x[1], 0); let r = Math.random() * tot; for (const [k, w] of list) { if ((r -= w) <= 0) return k; } return list[0][0]; };
  const rollCard = () => {
    const r = Math.random();
    if (r < R.ticketChance * 0.12) return { t: 'ticket', v: 3 }; if (r < R.ticketChance * 0.35) return { t: 'ticket', v: 2 }; if (r < R.ticketChance) return { t: 'ticket', v: 1 };
    if (r < R.ticketChance + 0.05) return { t: 'coupon', v: 1 };
    return { t: 'xu', v: wpick(R.quizReward) };
  };
  app.get('/api/city/quiz', requireAuth, (req, res) => {
    const Q = app.locals.gardenQuiz; if (!Q) return bad(res, 'Chưa sẵn sàng, thử lại sau nhé.', 503);
    const st = load(req.user.id); let src = req.query.src === 'vocab' ? 'vocab' : req.query.src === 'city' ? 'city' : req.query.src === 'mix' ? (Math.random() < 0.5 ? 'city' : (Math.random() < 0.5 ? 'vocab' : 'grammar')) : 'grammar';
    if (src === 'city') {   // câu hỏi riêng của EWT City (song ngữ), chỉ từ các quận đã mở
      const chs = L.CH.filter((c) => st.districts.indexOf(c.d) >= 0), chp = chs[Math.floor(Math.random() * chs.length)], cq = makeQ(chp, Math.floor(Math.random() * chp.w.length), Math.floor(Math.random() * 3));
      const qid = crypto.randomBytes(6).toString('hex'); pend.set(qid, { uid: req.user.id, idx: cq.ans, expl: cq.ex.en + ' — ' + cq.ex.vi, ts: Date.now() });
      return res.json({ qid, src: 'city', topic: chp.icon + ' ' + chp.en + ' · ' + chp.vi, q: cq.q.en, qvi: cq.q.vi, ctx: '', opts: cq.opts.map((o) => (o.en && o.vi ? o.en + ' · ' + o.vi : o.en || o.vi)), left: Math.max(0, R.quizDayCap - (st.q.d === vnDay() ? st.q.n : 0)) });
    }
    const q = src === 'vocab' ? Q.pickVocab(req.user.id, String(req.query.level || ''), String(req.query.type || '')) : Q.pickGrammar(req.user.id, Number(req.query.grade) || 0, String(req.query.lesson || ''));
    if (!q) return bad(res, 'Chưa có câu hỏi phù hợp, hãy chọn mục khác nhé.');
    const qid = crypto.randomBytes(6).toString('hex'); pend.set(qid, { uid: req.user.id, idx: q.idx, expl: q.expl, ts: Date.now() });
    for (const [k, v] of pend) if (Date.now() - v.ts > 15 * 60e3) pend.delete(k);
    res.json({ qid, src: q.src, topic: q.topic, q: q.q, ctx: q.ctx || '', opts: q.opts, left: Math.max(0, R.quizDayCap - (st.q.d === vnDay() ? st.q.n : 0)) });
  });
  app.post('/api/city/quiz/answer', requireAuth, (req, res) => {
    const p = pend.get(String((req.body || {}).qid)), pick = Number((req.body || {}).idx), uid = req.user.id;
    if (!p || p.uid !== uid) return bad(res, 'Câu hỏi đã hết hạn, hãy lấy câu mới nhé.');
    pend.delete(String(req.body.qid)); const ok = pick === p.idx;
    const out = tx(() => {
      const st = load(uid), day = vnDay(); if (st.q.d !== day) st.q = { d: day, n: 0 };
      let fid = null;
      if (ok && st.q.n < R.quizDayCap) { st.q.n++; fid = crypto.randomBytes(6).toString('hex'); flips.set(fid, { uid, ts: Date.now(), cards: [rollCard(), rollCard(), rollCard()] }); }
      save(uid, st); return { st, fid };
    });
    for (const [k, v] of flips) if (Date.now() - v.ts > 15 * 60e3) { flips.delete(k); applyCard(v.uid, v.cards[0]); }
    reply(res, out.st, uid, { correct: ok, answer: p.idx, expl: p.expl, flip: out.fid, capped: ok && !out.fid });
  });
  function applyCard(uid, c) {
    return tx(() => {
      const st = load(uid);
      if (c.t === 'xu') addCoins(uid, c.v); else if (c.t === 'ticket') st.tickets += c.v; else if (c.t === 'coupon') st.coupons += c.v;
      save(uid, st); return { st };
    });
  }
  app.post('/api/city/quiz/flip', requireAuth, (req, res) => {
    const f = flips.get(String((req.body || {}).id)), pick = Number((req.body || {}).pick), uid = req.user.id;
    if (!f || f.uid !== uid) return bad(res, 'Thẻ thưởng đã được nhận hoặc đã hết hạn.');
    if (!Number.isInteger(pick) || pick < 0 || pick >= f.cards.length) return bad(res, 'Hãy chọn một thẻ.');
    flips.delete(String(req.body.id));
    const out = applyCard(uid, f.cards[pick]);
    reply(res, out.st, uid, { cards: f.cards, pick, got: f.cards[pick] });
  });

  // thầy cô / quản trị xem nhanh thành phố học sinh (số liệu)
  app.get('/api/city/teacher/overview', requireAuth, (req, res) => {
    if (!req.user || ['teacher', 'admin'].indexOf(req.user.role) < 0) return bad(res, 'Bạn không có quyền xem mục này.', 403);
    const rows = db.prepare('SELECT c.user_id, c.state, c.updated_at, u.name FROM city c JOIN users u ON u.id=c.user_id ORDER BY c.updated_at DESC LIMIT 200').all();
    res.json({ cities: rows.map((r) => { const st = J(r.state, {}); st.bs = st.bs || []; st.districts = st.districts || [0]; st.roads = st.roads || {}; const s = stats(Object.assign({}, st, { free: {}, q: {} })); return { uid: r.user_id, name: r.name, level: s.level, pop: s.pop, happy: s.happy, buildings: s.n, districts: st.districts.length, chapters: Object.keys(st.chapters || {}).length, chaptersTotal: L.CH.length, at: r.updated_at }; }) });
  });

  // đọc trạng thái người khác để xem / xếp hạng (KHÔNG tạo dữ liệu mới); trả null nếu chưa chơi
  function peek(uid) {
    const r = one('SELECT state FROM city WHERE user_id=?', uid); if (!r) return null; const st = J(r.state, null); if (!st || typeof st !== 'object') return null;
    st.districts = (Array.isArray(st.districts) ? st.districts : [0]).filter((d) => C.DISTRICTS[d]); if (st.districts.indexOf(0) < 0) st.districts.unshift(0);
    st.roads = st.roads && typeof st.roads === 'object' ? st.roads : {}; st.bs = (Array.isArray(st.bs) ? st.bs : []).filter((b) => b && C.BY[b.k]); st.chapters = st.chapters || {}; st.inv = st.inv || {}; st.open = st.open === 0 ? 0 : 1; st.free = {}; st.q = {};
    settle(st, Date.now()); return st;
  }
  // dạng hiển thị cho người xem (không có xu, không thu thuế)
  function viewOther(st) {
    const s = stats(st); return { districts: st.districts, roads: Object.keys(st.roads).map(Number), bs: st.bs.map((b) => ({ i: b.i, k: b.k, x: b.x, y: b.y, lv: b.lv, tg: b.tg, t0: b.t0, t1: b.t1, pend: 0 })),
      free: {}, inv: {}, ev: [], tickets: 0, coupons: 0, stats: s, quizLeft: 0, chapters: Object.keys(st.chapters), matchLeft: 0, now: Date.now(), coins: 0, open: st.open };
  }
  app.locals.city = { load, save, peek, viewOther, stats, tx, addCoins, coinsOf, spend, bad, vnDay, J, one };
};
