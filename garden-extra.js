'use strict';
// EWT Garden — nhiệm vụ hằng ngày/tuần + chuỗi ngày chăm chỉ, quà từ thầy cô (kèm thưởng bài tập), dự án cả lớp, Hộ chiếu văn hoá.
// Dùng chung trạng thái vườn với garden.js (máy chủ giữ toàn bộ, trình duyệt chỉ hiển thị).
const crypto = require('crypto');
const CUL = require('./js/garden-culture.js');
const QUIZ = require('./garden-culture-quiz.js');

module.exports = function (app, C) {
  const { db, requireAuth, requireRole, now, G, vnDay, load, save, tx, reply, bad, coinsOf, addCoins, rollCard, applyCardSt, bagAdd, givenName, one } = C;

  db.exec(`
  CREATE TABLE IF NOT EXISTS garden_gifts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, xu INTEGER NOT NULL DEFAULT 0, chests INTEGER NOT NULL DEFAULT 0, item TEXT,
    label TEXT, from_name TEXT, from_uid INTEGER, day TEXT, created_at TEXT NOT NULL, claimed_at TEXT);
  CREATE INDEX IF NOT EXISTS idx_gg_user ON garden_gifts(user_id, claimed_at);
  CREATE TABLE IF NOT EXISTS garden_hw (user_id INTEGER NOT NULL, kind TEXT NOT NULL, ref INTEGER NOT NULL, created_at TEXT NOT NULL, PRIMARY KEY (user_id, kind, ref));
  CREATE TABLE IF NOT EXISTS garden_meta (k TEXT PRIMARY KEY, v TEXT);
  CREATE TABLE IF NOT EXISTS garden_class_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT, group_id INTEGER NOT NULL, item_id TEXT NOT NULL, target INTEGER NOT NULL, raised INTEGER NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'open', created_by INTEGER, created_at TEXT NOT NULL, done_at TEXT);
  CREATE TABLE IF NOT EXISTS garden_class_contribs (project_id INTEGER NOT NULL, user_id INTEGER NOT NULL, amount INTEGER NOT NULL DEFAULT 0, PRIMARY KEY (project_id, user_id));
  `);
  const meta = (k, init) => { const r = one('SELECT v FROM garden_meta WHERE k=?', k); if (r) return r.v; db.prepare('INSERT OR IGNORE INTO garden_meta (k,v) VALUES (?,?)').run(k, init); return init; };
  const HW_SINCE = meta('homework_since', now());   // chỉ thưởng các bài hoàn thành SAU khi bật tính năng (không thưởng bù bài cũ)

  /* ───────────────────────── Nhiệm vụ ───────────────────────── */
  const DAILY = {
    d_quiz5: { ev: 'quiz', goal: 5, title: 'Trả lời đúng 5 câu hỏi ở mục Kiếm xu', rw: { xu: 60 } },
    d_quiz10: { ev: 'quiz', goal: 10, title: 'Trả lời đúng 10 câu hỏi ở mục Kiếm xu', rw: { xu: 120, chest: 1 } },
    d_harvest: { ev: 'harvest', goal: 3, title: 'Thu hoạch 3 cây', rw: { xu: 50 } },
    d_feed: { ev: 'feed', goal: 2, title: 'Cho thú cưng ăn 2 lần', rw: { xu: 40, water: 3 } },
    d_water: { ev: 'water', goal: 5, title: 'Tưới nước 5 lần', rw: { xu: 40 } },
    d_plant: { ev: 'plant', goal: 3, title: 'Trồng 3 hoa hoặc cây', rw: { xu: 50, free: { plant: 1 } } },
    d_deco: { ev: 'deco', goal: 2, title: 'Đặt 2 món trang trí', rw: { xu: 50 } },
    d_passport: { ev: 'passport', goal: 1, title: 'Làm 1 mini-quiz trong Hộ chiếu văn hoá', rw: { xu: 60, chest: 1 } }
  };
  const WEEKLY = {
    w_quiz: { ev: 'quiz', goal: 50, title: 'Trả lời đúng 50 câu hỏi trong tuần', rw: { xu: 300, chest: 1 } },
    w_daily: { ev: 'dailydone', goal: 8, title: 'Hoàn thành 8 nhiệm vụ hằng ngày', rw: { xu: 400, free: { pet: 1 } } },
    w_harvest: { ev: 'harvest', goal: 20, title: 'Thu hoạch 20 cây', rw: { xu: 250 } },
    w_plant: { ev: 'plant', goal: 12, title: 'Trồng 12 hoa hoặc cây', rw: { xu: 250, free: { tree: 2 } } },
    w_expand: { ev: 'expand', goal: 1, title: 'Mở rộng đất hoặc mở một khu mới', rw: { xu: 200, chest: 1 } },
    w_passport: { ev: 'passport', goal: 3, title: 'Làm 3 mini-quiz Hộ chiếu văn hoá', rw: { xu: 300, free: { big: 1 } } }
  };
  const MILES = [[3, { xu: 100 }], [7, { xu: 300, chest: 1 }], [14, { xu: 600, free: { big: 1 } }], [30, { xu: 1500, chest: 2 }], [60, { xu: 3000, chest: 3 }], [100, { xu: 6000, free: { big: 2 }, chest: 3 }]];
  const FREEN = { plant: 'hoa', tree: 'cây', deco: 'đồ trang trí', big: 'công trình lớn', pet: 'thú cưng' };
  const rwText = (rw) => [rw.xu ? rw.xu + ' xu' : '', rw.water ? rw.water + ' 💧' : '', rw.chest ? rw.chest + ' rương quà' : ''].concat(Object.keys(rw.free || {}).map((k) => 'phiếu miễn phí ' + rw.free[k] + ' ' + FREEN[k])).filter(Boolean).join(' + ');
  const dayShift = (n) => new Date(Date.now() + 7 * 3600e3 + n * 86400e3).toISOString().slice(0, 10);
  const mondayOf = () => { const d = new Date(Date.now() + 7 * 3600e3); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.toISOString().slice(0, 10); };
  const seeded = (str) => { let h = 2166136261; for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); let s = (h >>> 0) % 2147483646 + 1; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; };
  const pickN = (arr, n, rnd) => { const a = arr.slice(), out = []; while (out.length < n && a.length) out.push(a.splice(Math.floor(rnd() * a.length), 1)[0]); return out; };

  function roll(st) {
    const q = st.q, today = vnDay(), wk = mondayOf();
    if (!q.c) q.c = {}; if (!q.dd) q.dd = {}; if (!q.cl) q.cl = {}; if (!q.wc) q.wc = {}; if (!q.wcl) q.wcl = {};
    if (!q.s || typeof q.s !== 'object') q.s = { n: 0, best: 0, last: '', got: [] };
    if (!Array.isArray(q.s.got)) q.s.got = [];
    if (q.d !== today || !Array.isArray(q.ids)) {
      q.d = today; q.c = {}; q.dd = {}; q.cl = {};
      const rnd = seeded(st.uid + ':' + today), pool = ['d_harvest', 'd_water', 'd_plant', 'd_deco', 'd_passport'];
      if (st.pets && st.pets.length) pool.push('d_feed', 'd_feed');
      q.ids = [rnd() < 0.5 ? 'd_quiz5' : 'd_quiz10'].concat(pickN(pool.filter((v, i, a) => a.indexOf(v) === i), 2, rnd));
    }
    if (q.w !== wk || !Array.isArray(q.wids)) { q.w = wk; q.wc = {}; q.wcl = {}; const rnd = seeded(st.uid + ':' + wk); q.wids = ['w_quiz', 'w_daily'].concat(pickN(['w_harvest', 'w_plant', 'w_expand', 'w_passport'], 1, rnd)); }
    q.ids = q.ids.filter((id) => DAILY[id]); q.wids = q.wids.filter((id) => WEEKLY[id]);
  }
  // Mỗi lần có hành động: cộng bộ đếm ngày + tuần, ghi nhận nhiệm vụ vừa xong, cập nhật chuỗi ngày
  function track(st, ev, n) {
    roll(st); const q = st.q, today = vnDay();
    if (n) { q.c[ev] = (q.c[ev] || 0) + n; q.wc[ev] = (q.wc[ev] || 0) + n; }
    q.ids.forEach((id) => { const d = DAILY[id]; if ((q.c[d.ev] || 0) >= d.goal && !q.dd[id]) { q.dd[id] = 1; q.wc.dailydone = (q.wc.dailydone || 0) + 1; } });
    // Ngày "chăm chỉ" = hoàn thành ít nhất 2 trong 3 nhiệm vụ ngày
    if (Object.keys(q.dd).length >= 2 && q.s.last !== today) { q.s.n = q.s.last === dayShift(-1) ? q.s.n + 1 : 1; q.s.best = Math.max(q.s.best || 0, q.s.n); q.s.last = today; }
  }
  const streakNow = (q) => (q.s.last === vnDay() || q.s.last === dayShift(-1) ? q.s.n : 0);
  function questsView(st) {
    roll(st); const q = st.q, sn = streakNow(q), nx = MILES.find((m) => m[0] > sn);
    const row = (id, def, cnt, claimed) => ({ id, title: def.title, goal: def.goal, p: Math.min(def.goal, cnt[def.ev] || 0), claimed: !!claimed, rw: rwText(def.rw) });
    return {
      daily: q.ids.map((id) => row(id, DAILY[id], q.c, q.cl[id])), weekly: q.wids.map((id) => row(id, WEEKLY[id], q.wc, q.wcl[id])),
      streak: { n: sn, best: q.s.best || 0, today: q.s.last === vnDay(), next: nx ? nx[0] : null, doneToday: Object.keys(q.dd).length,
        miles: MILES.map((m) => ({ d: m[0], rw: rwText(m[1]), got: q.s.got.indexOf(m[0]) >= 0, ready: sn >= m[0] && q.s.got.indexOf(m[0]) < 0 })) }
    };
  }
  // Trao phần thưởng vào trạng thái vườn (rương quà = 1 thẻ ngẫu nhiên như thẻ lật)
  function grant(st, uid, rw) {
    const out = [];
    if (rw.xu) { addCoins(uid, rw.xu); out.push('+' + rw.xu + ' xu'); }
    if (rw.water) { st.water += rw.water; out.push('+' + rw.water + ' lượt tưới 💧'); }
    Object.keys(rw.free || {}).forEach((k) => { st.bag.free[k] = (st.bag.free[k] | 0) + rw.free[k]; out.push('Phiếu miễn phí ' + rw.free[k] + ' ' + FREEN[k]); });
    for (let i = 0; i < (rw.chest | 0); i++) { let card = rollCard(st); /* rương quà không có thẻ nhân xu để không thành lỗ hổng */ if (G.FLIP.mult[card.t] || card.t === 'b1000') card = { t: 'coin', v: 100 }; const r = applyCardSt(st, uid, card); out.push(r.gained ? '🎁 Rương quà: +' + r.gained + ' xu' : '🎁 Rương quà: ' + r.got); }
    if (rw.item && G.BY[rw.item]) { bagAdd(st, rw.item); out.push('Công trình "' + G.BY[rw.item].name + '" đã vào giỏ 🧺'); }
    return out;
  }
  app.post('/api/garden/quests/claim', requireAuth, (req, res) => {
    const b = req.body || {}, kind = String(b.kind || ''), id = String(b.id || '');
    const out = tx(() => {
      const st = load(req.user); roll(st); const q = st.q; let rw;
      if (kind === 'd') { const d = DAILY[id]; if (!d || q.ids.indexOf(id) < 0) return { err: 'Nhiệm vụ này không có hôm nay.' }; if ((q.c[d.ev] || 0) < d.goal) return { err: 'Bạn chưa hoàn thành nhiệm vụ này.' }; if (q.cl[id]) return { err: 'Bạn đã nhận thưởng nhiệm vụ này rồi.' }; q.cl[id] = 1; rw = d.rw; }
      else if (kind === 'w') { const d = WEEKLY[id]; if (!d || q.wids.indexOf(id) < 0) return { err: 'Nhiệm vụ này không có tuần này.' }; if ((q.wc[d.ev] || 0) < d.goal) return { err: 'Bạn chưa hoàn thành nhiệm vụ này.' }; if (q.wcl[id]) return { err: 'Bạn đã nhận thưởng nhiệm vụ này rồi.' }; q.wcl[id] = 1; rw = d.rw; }
      else if (kind === 's') { const m = MILES.find((x) => String(x[0]) === id); if (!m) return { err: 'Mốc chuỗi không hợp lệ.' }; if (streakNow(q) < m[0]) return { err: 'Chuỗi ngày của bạn chưa đủ ' + m[0] + ' ngày.' }; if (q.s.got.indexOf(m[0]) >= 0) return { err: 'Bạn đã nhận thưởng mốc này rồi.' }; q.s.got.push(m[0]); rw = m[1]; }
      else return { err: 'Yêu cầu không hợp lệ.' };
      const got = grant(st, req.user.id, rw); track(st, 'login', 0); save(st); return { st, got };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { reward: out.got });
  });

  /* ───────────────────────── Quà từ thầy cô + thưởng bài tập ───────────────────────── */
  const hwTs = new Map();
  const mkGift = (uid, g) => db.prepare('INSERT INTO garden_gifts (user_id,xu,chests,item,label,from_name,from_uid,day,created_at) VALUES (?,?,?,?,?,?,?,?,?)')
    .run(uid, g.xu | 0, g.chests | 0, g.item || null, String(g.label || '').slice(0, 120), String(g.from || '').slice(0, 60), g.fromUid || null, vnDay(), now());
  // Quét các bài được giao mà học sinh đã hoàn thành (bài tập, đề trắc nghiệm, bộ từ theo bài) → mỗi bài thưởng 1 lần: 50 xu + 1 rương quà
  function scanHomework(user) {
    const t = Date.now(); if ((hwTs.get(user.id) || 0) > t - 90e3) return; hwTs.set(user.id, t);
    const ins = db.prepare('INSERT OR IGNORE INTO garden_hw (user_id,kind,ref,created_at) VALUES (?,?,?,?)');
    const reward = (kind, rows) => rows.forEach((r) => { if (ins.run(user.id, kind, r.ref, now()).changes) mkGift(user.id, { xu: 50, chests: 1, label: 'Hoàn thành bài giáo viên giao: ' + (r.title || 'Bài tập'), from: 'EWT Garden' }); });
    try {
      reward('ex', db.prepare(`SELECT a.id AS ref, e.title AS title FROM assignments a JOIN users u ON lower(u.email)=lower(a.student_email) LEFT JOIN exercises e ON e.id=a.exercise_id
        WHERE u.id=? AND EXISTS (SELECT 1 FROM submissions s WHERE s.user_id=u.id AND s.exercise_id=a.exercise_id AND s.submitted_at>=? AND s.submitted_at>=a.created_at) LIMIT 60`).all(user.id, HW_SINCE));
    } catch (e) { console.error('[garden/hw ex]', e.message); }
    try {
      reward('mcq', db.prepare(`SELECT t.id AS ref, t.title AS title FROM mcq_assign m JOIN mcq_tests t ON t.id=m.test_id
        WHERE m.user_id=? AND EXISTS (SELECT 1 FROM mcq_attempts a WHERE a.test_id=m.test_id AND a.user_id=m.user_id AND a.status<>'in_progress' AND a.voided=0 AND a.finished_at>=?) LIMIT 60`).all(user.id, new Date(HW_SINCE).getTime()));
    } catch (e) { console.error('[garden/hw mcq]', e.message); }
    try {
      reward('lesson', db.prepare(`SELECT s.id AS ref, s.title AS title FROM lesson_assign la JOIN lesson_sets s ON s.id=la.set_id
        WHERE la.user_id=? AND EXISTS (SELECT 1 FROM lesson_results r WHERE r.set_id=la.set_id AND r.user_id=la.user_id AND r.created_at>=?) LIMIT 60`).all(user.id, HW_SINCE));
    } catch (e) { console.error('[garden/hw lesson]', e.message); }
  }
  const inboxCount = (uid) => one('SELECT COUNT(*) c FROM garden_gifts WHERE user_id=? AND claimed_at IS NULL', uid).c;
  app.get('/api/garden/inbox', requireAuth, (req, res) => {
    try { scanHomework(req.user); } catch (e) { /* bỏ qua */ }
    const rows = db.prepare('SELECT id,xu,chests,item,label,from_name,created_at FROM garden_gifts WHERE user_id=? AND claimed_at IS NULL ORDER BY id DESC LIMIT 60').all(req.user.id);
    res.json({ gifts: rows.map((r) => ({ id: r.id, xu: r.xu, chests: r.chests, item: r.item ? { id: r.item, name: (G.BY[r.item] || {}).name || r.item } : null, label: r.label, from: r.from_name, at: r.created_at })) });
  });
  app.post('/api/garden/inbox/claim', requireAuth, (req, res) => {
    const b = req.body || {};
    const out = tx(() => {
      const rows = b.all ? db.prepare('SELECT * FROM garden_gifts WHERE user_id=? AND claimed_at IS NULL ORDER BY id LIMIT 40').all(req.user.id) : db.prepare('SELECT * FROM garden_gifts WHERE id=? AND user_id=? AND claimed_at IS NULL').all(Number(b.id) || 0, req.user.id);
      if (!rows.length) return { err: 'Không có quà nào để nhận.' };
      const st = load(req.user), got = [];
      rows.forEach((r) => { db.prepare('UPDATE garden_gifts SET claimed_at=? WHERE id=?').run(now(), r.id); got.push(...grant(st, req.user.id, { xu: r.xu, chest: r.chests, item: r.item })); });
      save(st); return { st, got };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { reward: out.got, inbox: inboxCount(req.user.id) });
  });

  /* ───────────────────────── Dự án cả lớp ───────────────────────── */
  const myGroups = (uid) => db.prepare('SELECT g.id, g.name FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id=?').all(uid);
  const projView = (p, uid) => {
    const it = G.BY[p.item_id] || {}, mine = one('SELECT amount FROM garden_class_contribs WHERE project_id=? AND user_id=?', p.id, uid);
    const top = db.prepare('SELECT c.amount, u.name FROM garden_class_contribs c JOIN users u ON u.id=c.user_id WHERE c.project_id=? ORDER BY c.amount DESC LIMIT 5').all(p.id).map((r) => ({ name: givenName(r.name), amount: r.amount }));
    return { id: p.id, group: p.group_name, item: { id: p.item_id, name: it.name || p.item_id }, target: p.target, raised: p.raised, status: p.status, mine: mine ? mine.amount : 0, top };
  };
  app.get('/api/garden/class', requireAuth, (req, res) => {
    const gs = myGroups(req.user.id).map((g) => g.id); if (!gs.length) return res.json({ projects: [], joined: false });
    const rows = db.prepare('SELECT p.*, g.name AS group_name FROM garden_class_projects p JOIN groups g ON g.id=p.group_id WHERE p.group_id IN (' + gs.map(() => '?').join(',') + ") AND (p.status='open' OR p.done_at>=?) ORDER BY p.id DESC LIMIT 12").all(...gs, new Date(Date.now() - 14 * 86400e3).toISOString());
    res.json({ projects: rows.map((p) => projView(p, req.user.id)), joined: true });
  });
  app.post('/api/garden/class/contribute', requireAuth, (req, res) => {
    const pid = Number((req.body || {}).project_id), amt = Math.floor(Number((req.body || {}).amount));
    if (!(amt >= 1 && amt <= 5000)) return bad(res, 'Hãy nhập số xu từ 1 đến 5000.');
    const out = tx(() => {
      const p = one('SELECT p.*, g.name AS group_name FROM garden_class_projects p JOIN groups g ON g.id=p.group_id WHERE p.id=?', pid);
      if (!p || p.status !== 'open') return { err: 'Dự án này đã hoàn thành hoặc không còn nữa.' };
      if (!one('SELECT 1 x FROM group_members WHERE group_id=? AND user_id=?', p.group_id, req.user.id)) return { err: 'Bạn không thuộc lớp này.' };
      const give = Math.min(amt, p.target - p.raised);
      const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(give, req.user.id, give); if (!r.changes) return { err: 'Bạn chưa đủ xu (cần ' + give + ' 🪙).' };
      db.prepare('INSERT INTO garden_class_contribs (project_id,user_id,amount) VALUES (?,?,?) ON CONFLICT(project_id,user_id) DO UPDATE SET amount=amount+excluded.amount').run(pid, req.user.id, give);
      db.prepare('UPDATE garden_class_projects SET raised=raised+? WHERE id=?').run(give, pid);
      const np = one('SELECT p.*, g.name AS group_name FROM garden_class_projects p JOIN groups g ON g.id=p.group_id WHERE p.id=?', pid); let done = false;
      if (np.raised >= np.target) {   // cả lớp góp đủ → mọi thành viên nhận công trình vào quà
        done = true; db.prepare("UPDATE garden_class_projects SET status='done', done_at=? WHERE id=?").run(now(), pid);
        db.prepare('SELECT user_id FROM group_members WHERE group_id=? AND user_id IS NOT NULL').all(np.group_id).forEach((m) => mkGift(m.user_id, { item: np.item_id, label: 'Cả lớp ' + np.group_name + ' đã cùng xây xong: ' + ((G.BY[np.item_id] || {}).name || np.item_id), from: 'EWT Garden' }));
      }
      return { give, done, p: projView(np, req.user.id) };
    });
    if (out.err) return bad(res, out.err);
    res.json({ gave: out.give, done: out.done, project: out.p, coins: coinsOf(req.user.id) });
  });

  /* ───────────────────────── Giáo viên: thưởng + dự án lớp ───────────────────────── */
  app.post('/api/garden/teacher/gift', requireRole('teacher', 'admin'), (req, res) => {
    const b = req.body || {}, xu = Math.floor(Number(b.xu) || 0), chests = Math.floor(Number(b.chests) || 0), note = String(b.note || '').replace(/[<>]/g, '').trim().slice(0, 80);
    if (xu < 0 || xu > 500 || chests < 0 || chests > 3 || (!xu && !chests)) return bad(res, 'Mỗi lần tặng tối đa 500 xu và 3 rương quà (cần chọn ít nhất một thứ).');
    let ids = [];
    if (b.group_id) ids = db.prepare('SELECT DISTINCT user_id FROM group_members WHERE group_id=? AND user_id IS NOT NULL').all(Number(b.group_id)).map((r) => r.user_id);
    else if (Array.isArray(b.user_ids)) ids = b.user_ids.map(Number).filter((n) => Number.isInteger(n));
    ids = ids.filter((id) => one("SELECT 1 x FROM users WHERE id=? AND role='student'", id)).slice(0, 100);
    if (!ids.length) return bad(res, 'Chưa chọn học sinh nào.');
    const today = vnDay(), used = one('SELECT COALESCE(SUM(xu),0) s FROM garden_gifts WHERE from_uid=? AND day=?', req.user.id, today).s;
    if (used + xu * ids.length > 20000) return bad(res, 'Hôm nay bạn đã tặng gần tới giới hạn 20.000 xu (đã tặng ' + used + ').');
    tx(() => ids.forEach((id) => mkGift(id, { xu, chests, label: note || 'Quà thưởng từ giáo viên', from: 'Thầy/cô ' + givenName(req.user.name), fromUid: req.user.id })));
    res.json({ ok: true, count: ids.length });
  });
  app.post('/api/garden/teacher/project', requireRole('teacher', 'admin'), (req, res) => {
    const b = req.body || {}, it = G.BY[String(b.item_id || '')], gid = Number(b.group_id), g = one('SELECT id,name FROM groups WHERE id=?', gid);
    if (!g) return bad(res, 'Không tìm thấy lớp.'); if (!it || it.kind !== 'big') return bad(res, 'Hãy chọn một công trình lớn.');
    const target = Math.floor(Number(b.target) || it.cost);
    if (target < 100 || target > 200000) return bad(res, 'Số xu mục tiêu cần từ 100 đến 200.000.');
    if (one("SELECT 1 x FROM garden_class_projects WHERE group_id=? AND status='open'", gid)) return bad(res, 'Lớp này đang có một dự án chưa hoàn thành. Hãy hoàn thành hoặc huỷ trước khi tạo dự án mới.');
    const r = db.prepare('INSERT INTO garden_class_projects (group_id,item_id,target,created_by,created_at) VALUES (?,?,?,?,?)').run(gid, it.id, target, req.user.id, now());
    res.json({ ok: true, id: Number(r.lastInsertRowid) });
  });
  app.get('/api/garden/teacher/projects', requireRole('teacher', 'admin'), (req, res) => {
    const gid = Number(req.query.group_id);
    const rows = db.prepare('SELECT p.*, g.name AS group_name FROM garden_class_projects p JOIN groups g ON g.id=p.group_id WHERE p.group_id=? ORDER BY p.id DESC LIMIT 10').all(gid);
    res.json({ projects: rows.map((p) => projView(p, 0)) });
  });
  app.post('/api/garden/teacher/project/cancel', requireRole('teacher', 'admin'), (req, res) => {   // huỷ dự án đang mở: hoàn lại xu cho từng bạn
    const pid = Number((req.body || {}).id);
    const out = tx(() => {
      const p = one('SELECT * FROM garden_class_projects WHERE id=?', pid); if (!p || p.status !== 'open') return { err: 'Không tìm thấy dự án đang mở.' };
      db.prepare('SELECT user_id, amount FROM garden_class_contribs WHERE project_id=?').all(pid).forEach((c) => { addCoins(c.user_id, c.amount); });
      db.prepare('DELETE FROM garden_class_contribs WHERE project_id=?').run(pid); db.prepare("UPDATE garden_class_projects SET status='cancelled', done_at=? WHERE id=?").run(now(), pid); return { ok: true };
    });
    if (out.err) return bad(res, out.err); res.json({ ok: true });
  });

  /* ───────────────────────── Sự kiện theo mùa (Tết, Trung thu, Giáng sinh) ───────────────────────── */
  const EV = G.EV;
  const evForce = () => { try { return JSON.parse((one("SELECT v FROM garden_meta WHERE k='ev_force'") || {}).v || '{}') || {}; } catch (_) { return {}; } };
  const evActive = () => EV.activeOn(vnDay(), evForce());
  const evIsActive = (id) => evActive().some((e) => e.id === id);
  const evRec = (st, key) => { if (!st.q.ev || typeof st.q.ev !== 'object') st.q.ev = {}; const r = st.q.ev[key] || (st.q.ev[key] = { d: '', n: 0, own: [], m: [] }); if (!Array.isArray(r.own)) r.own = []; if (!Array.isArray(r.m)) r.m = []; return r; };
  // Ghi nhận món sự kiện học sinh vừa có (đặt / nhận nuôi / nhận từ bạn): tính vào bộ sưu tập của đợt sự kiện đang diễn ra
  function evOwn(st, itemId) {
    const it = G.BY[itemId] || G.PBY[itemId]; if (!it || !it.ev) return;
    evActive().filter((e) => e.id === it.ev).forEach((e) => { const r = evRec(st, e.key); if (r.own.indexOf(itemId) < 0) r.own.push(itemId); });
  }
  function eventsView(st) {
    const act = evActive(), nx = EV.upcomingOn(vnDay());
    return {
      active: act.map((a) => {
        const e = EV.EBY[a.id], base = { id: e.id, key: a.key, name: e.name, short: e.short, icon: e.icon, en: e.en, from: a.from, to: a.to, left: a.left, forced: a.forced, col: e.col };
        if (!st) return base;
        const r = evRec(st, a.key), all = EV.itemsOf(e.id);
        return Object.assign(base, { blurb: e.blurb, gift: e.gift, vocab: e.vocab, claimed: r.d === vnDay(), days: r.n, own: r.own.filter((x) => all.indexOf(x) >= 0), total: all.length, items: all,
          miles: EV.MILES.map((m) => ({ n: m[0], label: m[2], rw: rwText(m[1]), got: r.m.indexOf(m[0]) >= 0, ready: r.own.length >= m[0] && r.m.indexOf(m[0]) < 0 })) });
      }),
      next: nx ? { id: nx.id, name: EV.EBY[nx.id].name, icon: EV.EBY[nx.id].icon, days: nx.days } : null
    };
  }
  const evGift = (id, rnd) => {   // quà đăng nhập mỗi ngày trong sự kiện
    if (id === 'tet') { const x = rnd(); return { xu: x < .5 ? 30 : x < .8 ? 60 : x < .95 ? 100 : 200 }; }
    return { xu: 50, water: 2 };
  };
  app.post('/api/garden/event/daily', requireAuth, (req, res) => {
    const id = String((req.body || {}).id || '');
    const out = tx(() => {
      const a = evActive().find((x) => x.id === id); if (!a) return { err: 'Sự kiện này hiện chưa diễn ra.' };
      const st = load(req.user), r = evRec(st, a.key), today = vnDay();
      if (r.d === today) return { err: 'Hôm nay bạn đã nhận quà sự kiện rồi — mai quay lại nhé!' };
      r.d = today; r.n = (r.n | 0) + 1;
      const rw = evGift(id, seeded(st.uid + ':' + a.key + ':' + today));
      if (id === 'noel' && r.n % 5 === 0) rw.chest = 1;
      const got = grant(st, req.user.id, rw); track(st, 'login', 0); save(st); return { st, got };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { reward: out.got });
  });
  app.post('/api/garden/event/milestone', requireAuth, (req, res) => {
    const id = String((req.body || {}).id || ''), n = Number((req.body || {}).n);
    const out = tx(() => {
      const a = evActive().find((x) => x.id === id), m = EV.MILES.find((x) => x[0] === n); if (!a || !m) return { err: 'Mốc thưởng này không còn nữa.' };
      const st = load(req.user), r = evRec(st, a.key), all = EV.itemsOf(id);
      if (r.own.filter((x) => all.indexOf(x) >= 0).length < n) return { err: 'Bạn chưa sưu tầm đủ ' + n + ' món của sự kiện này.' };
      if (r.m.indexOf(n) >= 0) return { err: 'Bạn đã nhận phần thưởng mốc này rồi.' };
      r.m.push(n); const got = grant(st, req.user.id, m[1]); save(st); return { st, got };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { reward: out.got });
  });
  // Thầy cô: xem lịch, mở sớm / đóng / trả về lịch tự động
  const evAdminList = () => {
    const f = evForce(), today = vnDay(), act = evActive();
    return EV.EVENTS.map((e) => {
      const a = act.find((x) => x.id === e.id), ws = EV.windowsOf(e.id).filter((w) => w.to >= today), nxw = ws[0] || null;
      return { id: e.id, name: e.name, icon: e.icon, active: !!a, forced: !!(f[e.id] && !f[e.id].closed && a && a.forced), closed: !!(f[e.id] && f[e.id].closed), until: a ? a.to : null, next: nxw ? { from: nxw.from, to: nxw.to } : null };
    });
  };
  app.get('/api/garden/teacher/events', requireRole('teacher', 'admin'), (req, res) => res.json({ events: evAdminList(), today: vnDay() }));
  app.post('/api/garden/teacher/event', requireRole('teacher', 'admin'), (req, res) => {
    const b = req.body || {}, id = String(b.id || ''), act = String(b.action || '');
    if (!EV.EBY[id]) return bad(res, 'Sự kiện không tồn tại.');
    const f = evForce();
    if (act === 'open') { const days = Math.max(1, Math.min(60, Math.floor(Number(b.days) || 7))); f[id] = { from: vnDay(), to: new Date(Date.now() + 7 * 3600e3 + (days - 1) * 86400e3).toISOString().slice(0, 10) }; }
    else if (act === 'close') f[id] = { closed: true };
    else if (act === 'auto') delete f[id];
    else return bad(res, 'Thao tác không hợp lệ.');
    db.prepare('INSERT INTO garden_meta (k,v) VALUES (?,?) ON CONFLICT(k) DO UPDATE SET v=excluded.v').run('ev_force', JSON.stringify(f));
    res.json({ ok: true, events: evAdminList() });
  });

  /* ───────────────────────── Hộ chiếu văn hoá ───────────────────────── */
  const pend = new Map();
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  app.get('/api/garden/culture/quiz', requireAuth, (req, res) => {
    const zid = String(req.query.zone || ''), qs = QUIZ[zid], st = load(req.user);
    if (!qs || !CUL.CULTURE[zid]) return bad(res, 'Khu này chưa có Hộ chiếu văn hoá.');
    if (st.zones.indexOf(zid) < 0) return bad(res, 'Hãy mở khu này trước nhé.');
    const items = qs.map((q) => { const order = shuf(q[1].map((_, i) => i)); return { q: q[0], opts: order.map((i) => q[1][i]), a: order.indexOf(0), expl: q[2] }; });
    pend.set(req.user.id + ':' + zid, { items, ts: Date.now() });
    for (const [k, v] of pend) if (Date.now() - v.ts > 30 * 60e3) pend.delete(k);
    res.json({ zone: zid, stamped: !!(st.passport[zid] && st.passport[zid].stamp), questions: items.map((x) => ({ q: x.q, opts: x.opts })) });
  });
  app.post('/api/garden/culture/answer', requireAuth, (req, res) => {
    const zid = String((req.body || {}).zone || ''), ans = (req.body || {}).answers, key = req.user.id + ':' + zid, p = pend.get(key);
    if (!p) return bad(res, 'Bài kiểm tra đã hết hạn, hãy mở lại nhé.');
    if (!Array.isArray(ans) || ans.length !== p.items.length) return bad(res, 'Hãy trả lời đủ các câu hỏi.');
    pend.delete(key);
    const results = p.items.map((x, i) => ({ ok: Number(ans[i]) === x.a, answer: x.a, expl: x.expl })), correct = results.filter((r) => r.ok).length;
    const out = tx(() => {
      const st = load(req.user); let got = [], first = false;
      if (correct >= 2) {
        track(st, 'passport', 1);
        const rec = st.passport[zid] || (st.passport[zid] = {});
        if (!rec.stamp) { rec.stamp = 1; rec.at = now(); first = true; got = got.concat(grant(st, req.user.id, { xu: correct === 3 ? 250 : 150, chest: 1 })); }
        rec.best = Math.max(rec.best | 0, correct);
        const n = Object.keys(st.passport).filter((k) => k !== '_m' && st.passport[k] && st.passport[k].stamp).length, mm = st.passport._m || (st.passport._m = []);
        [[5, { xu: 300, free: { big: 1 } }], [10, { xu: 800, chest: 2 }], [15, { xu: 2000, chest: 3, free: { big: 1 } }]].forEach((m) => { if (n >= m[0] && mm.indexOf(m[0]) < 0) { mm.push(m[0]); got = got.concat(['🏅 Đủ ' + m[0] + ' dấu hộ chiếu!'], grant(st, req.user.id, m[1])); } });
      }
      save(st); return { st, got, first };
    });
    reply(res, req.user, out.st, { results, correct, passed: correct >= 2, first: out.first, reward: out.got });
  });

  return { track, questsView, scanHomework, inboxCount, eventsView, evIsActive, evOwn };
};
