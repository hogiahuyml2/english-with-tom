'use strict';
// EWT Garden — nhiệm vụ hằng ngày/tuần + chuỗi ngày chăm chỉ, quà từ thầy cô (kèm thưởng bài tập), dự án cả lớp, Hộ chiếu văn hoá.
// Dùng chung trạng thái vườn với garden.js (máy chủ giữ toàn bộ, trình duyệt chỉ hiển thị).
const crypto = require('crypto');
const CUL = require('./js/garden-culture.js');
const QUIZ = require('./garden-culture-quiz.js');
const QUIZVI = require('./garden-culture-quiz-vi.js');   // bản dịch tiếng Việt song song (cùng thứ tự câu & đáp án)

module.exports = function (app, C) {
  const { db, requireAuth, requireRole, now, G, vnDay, load, save, tx, reply, bad, coinsOf, addCoins, rollCard, applyCardSt, bagAdd, givenName, one, notifyUser } = C;

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
  // Quản trị: nạp xu thử nghiệm cho CHÍNH tài khoản admin đang đăng nhập (để thử game); học sinh không dùng được
  app.post('/api/garden/admin/test-coins', requireRole('admin'), (req, res) => {
    const TEST_COINS = 999999999;
    db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(req.user.id);
    db.prepare('UPDATE word_game SET coins=? WHERE user_id=?').run(TEST_COINS, req.user.id);
    res.json({ ok: true, coins: TEST_COINS });
  });
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
  app.locals.gardenEvActive = evIsActive; app.locals.gardenEvList = () => evActive().map((e) => e.id);   // EWT City dùng chung lịch sự kiện
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

  /* ───────────────────────── Tặng / đổi quà giữa bạn bè ───────────────────────── */
  // Chỉ chuyển ĐỒ TRONG GIỎ (đồ đã mua). Món được giữ "ký gửi" cho tới khi bạn nhận / từ chối / người gửi huỷ / quá 7 ngày. Không chuyển xu.
  db.exec(`CREATE TABLE IF NOT EXISTS garden_trades (
    id INTEGER PRIMARY KEY AUTOINCREMENT, from_uid INTEGER NOT NULL, to_uid INTEGER NOT NULL, give_kind TEXT NOT NULL, give_id TEXT NOT NULL, give_name TEXT,
    want_kind TEXT, want_id TEXT, note TEXT, status TEXT NOT NULL DEFAULT 'pending', day TEXT, created_at TEXT NOT NULL, done_at TEXT);
  CREATE INDEX IF NOT EXISTS idx_gtr_to ON garden_trades(to_uid, status); CREATE INDEX IF NOT EXISTS idx_gtr_from ON garden_trades(from_uid, status);`);
  const TR = { expireDays: 7, maxOut: 8, maxDay: 10, maxPair: 3, maxIn: 25 };
  const tokNew = () => crypto.randomBytes(9).toString('base64url');
  const shareOf = (uid) => { const r = one('SELECT share FROM garden WHERE user_id=?', uid); if (!r) return null; if (r.share) return r.share; const t = tokNew(); db.prepare('UPDATE garden SET share=? WHERE user_id=?').run(t, uid); return t; };
  const thing = (kind, id) => (kind === 'pet' ? G.PBY[id] : G.BY[id]);
  const kindOf = (k) => (k === 'pet' ? 'pet' : 'item');
  const bagTake = (st, kind, id) => {
    if (kind === 'pet') { const i = st.bag.pets.findIndex((p) => p.k === id); return i < 0 ? null : st.bag.pets.splice(i, 1)[0]; }
    if ((st.bag.items[id] | 0) <= 0) return null; if (--st.bag.items[id] <= 0) delete st.bag.items[id]; return { k: id };
  };
  const bagHas = (st, kind, id) => (kind === 'pet' ? st.bag.pets.some((p) => p.k === id) : (st.bag.items[id] | 0) > 0);
  const bagPut = (st, kind, id, name) => {
    if (kind === 'pet') { if (st.bag.pets.length >= 60) return false; st.bag.pets.push({ k: id, name: String(name || G.PBY[id].name).slice(0, 16) }); return true; }
    if ((st.bag.items[id] | 0) >= 999) return false; bagAdd(st, id, 1); return true;
  };
  const userRow = (uid) => one('SELECT id, name FROM users WHERE id=?', uid);
  // trả món ký gửi về giỏ người gửi (hết hạn / bị từ chối / huỷ)
  function refund(tr) {
    const u = userRow(tr.from_uid); if (!u) return;
    const st = load(u); if (!bagPut(st, tr.give_kind, tr.give_id, tr.give_name)) { const it = thing(tr.give_kind, tr.give_id); if (it && it.cost > 0) addCoins(tr.from_uid, it.cost); } save(st);
  }
  let lastExp = 0;
  function expireOld() {
    const t = Date.now(); if (t - lastExp < 60e3) return; lastExp = t;
    const cut = new Date(t - TR.expireDays * 86400e3).toISOString();
    db.prepare("SELECT * FROM garden_trades WHERE status='pending' AND created_at<? LIMIT 50").all(cut).forEach((tr) => { refund(tr); db.prepare("UPDATE garden_trades SET status='expired', done_at=? WHERE id=?").run(now(), tr.id); });
  }
  const tview = (tr, me, st) => {
    const out = tr.from_uid === me, other = userRow(out ? tr.to_uid : tr.from_uid) || {}, g = thing(tr.give_kind, tr.give_id) || {}, w = tr.want_id ? thing(tr.want_kind, tr.want_id) || {} : null;
    return { id: tr.id, dir: out ? 'out' : 'in', who: givenName(other.name), status: tr.status, note: tr.note || '', at: tr.created_at, done: tr.done_at,
      give: { kind: tr.give_kind, id: tr.give_id, name: tr.give_name || g.name || tr.give_id, cost: g.cost || 0 }, want: w ? { kind: tr.want_kind, id: tr.want_id, name: w.name || tr.want_id, cost: w.cost || 0 } : null,
      can: !out && tr.status === 'pending' ? (!w || (st && bagHas(st, tr.want_kind, tr.want_id))) : null };
  };
  const tradeCount = (uid) => one("SELECT COUNT(*) c FROM garden_trades WHERE to_uid=? AND status='pending'", uid).c + (typeof parcelCount === 'function' ? parcelCount(uid) : 0);
  app.get('/api/garden/trades', requireAuth, (req, res) => {
    try { expireOld(); } catch (e) { console.error('[garden/trade expire]', e.message); }
    const me = req.user.id, st = load(req.user), cut = new Date(Date.now() - 14 * 86400e3).toISOString();
    const inc = db.prepare("SELECT * FROM garden_trades WHERE to_uid=? AND status='pending' ORDER BY id DESC LIMIT 40").all(me), outg = db.prepare("SELECT * FROM garden_trades WHERE from_uid=? AND status='pending' ORDER BY id DESC LIMIT 40").all(me);
    const hist = db.prepare("SELECT * FROM garden_trades WHERE (from_uid=? OR to_uid=?) AND status<>'pending' AND created_at>? ORDER BY id DESC LIMIT 14").all(me, me, cut);
    res.json({ incoming: inc.map((t) => tview(t, me, st)), outgoing: outg.map((t) => tview(t, me, st)), history: hist.map((t) => tview(t, me, st)), limits: { sentToday: one('SELECT COUNT(*) c FROM garden_trades WHERE from_uid=? AND day=?', me, vnDay()).c, maxDay: TR.maxDay, expireDays: TR.expireDays } });
  });
  app.get('/api/garden/friends', requireAuth, (req, res) => {   // bạn cùng lớp đang mở vườn cho bạn bè xem
    const rows = db.prepare(`SELECT DISTINCT u.id, u.name FROM group_members gm JOIN group_members gm2 ON gm2.group_id=gm.group_id JOIN users u ON u.id=gm2.user_id JOIN garden g ON g.user_id=u.id
      WHERE gm.user_id=? AND u.id<>? AND g.open=1 AND u.role='student' ORDER BY u.name LIMIT 80`).all(req.user.id, req.user.id);
    res.json({ friends: rows.map((r) => ({ name: r.name, short: givenName(r.name), token: shareOf(r.id) })) });
  });
  const trSends = new Map();
  app.post('/api/garden/trade/send', requireAuth, (req, res) => {
    const b = req.body || {}, give = b.give || {}, want = b.want || null, note = String(b.note || '').replace(/[<>]/g, '').trim().slice(0, 60), tok = String(b.to || '');
    const k = req.user.id, t = Date.now(), arr = (trSends.get(k) || []).filter((x) => t - x < 60e3); arr.push(t); trSends.set(k, arr);
    if (arr.length > 12) return bad(res, 'Bạn thao tác nhanh quá, chờ một chút rồi thử lại nhé.', 429);
    const out = tx(() => {
      expireOld();
      const to = tok ? one('SELECT g.user_id AS id, g.open, u.name FROM garden g JOIN users u ON u.id=g.user_id WHERE g.share=?', tok) : null;
      if (!to || !to.open) return { err: 'Không tìm thấy bạn này, hoặc bạn ấy chưa mở vườn cho bạn bè.' };
      if (to.id === req.user.id) return { err: 'Bạn không thể tặng quà cho chính mình.' };
      const gk = kindOf(give.kind), gt = thing(gk, String(give.id || ''));
      if (!gt || !(gt.cost > 0)) return { err: 'Món này không thể tặng.' };
      let wk = null, wid = null;
      if (want && want.id) { wk = kindOf(want.kind); wid = String(want.id); const wt = thing(wk, wid); if (!wt || !(wt.cost > 0)) return { err: 'Món bạn muốn đổi không hợp lệ.' }; if (wk === gk && wid === gt.id) return { err: 'Hãy chọn món khác để đổi nhé.' }; }
      if (one('SELECT COUNT(*) c FROM garden_trades WHERE from_uid=? AND day=?', k, vnDay()).c >= TR.maxDay) return { err: 'Hôm nay bạn đã gửi ' + TR.maxDay + ' lời tặng/đổi rồi — mai tiếp tục nhé!' };
      if (one("SELECT COUNT(*) c FROM garden_trades WHERE from_uid=? AND status='pending'", k).c >= TR.maxOut) return { err: 'Bạn đang có ' + TR.maxOut + ' lời gửi chưa được trả lời — hãy chờ bạn bè phản hồi hoặc huỷ bớt.' };
      if (one("SELECT COUNT(*) c FROM garden_trades WHERE from_uid=? AND to_uid=? AND status='pending'", k, to.id).c >= TR.maxPair) return { err: 'Bạn đã gửi ' + TR.maxPair + ' món cho bạn này mà chưa được trả lời. Chờ bạn ấy phản hồi nhé.' };
      if (tradeCount(to.id) >= TR.maxIn) return { err: 'Hộp thư của bạn ấy đang đầy, thử lại sau nhé.' };
      const st = load(req.user), taken = bagTake(st, gk, gt.id);
      if (!taken) return { err: 'Món này không có trong giỏ của bạn. Hãy dọn món đã mua vào giỏ (nút Dọn) rồi tặng nhé.' };
      const r = db.prepare('INSERT INTO garden_trades (from_uid,to_uid,give_kind,give_id,give_name,want_kind,want_id,note,day,created_at) VALUES (?,?,?,?,?,?,?,?,?,?)')
        .run(k, to.id, gk, gt.id, gk === 'pet' ? (taken.name || gt.name) : gt.name, wk, wid, note, vnDay(), now());
      save(st); return { id: Number(r.lastInsertRowid), to, swap: !!wid, gt };
    });
    if (out.err) return bad(res, out.err);
    try { if (notifyUser) notifyUser(out.to.id, 'garden_trade', '🎁 ' + givenName(req.user.name) + (out.swap ? ' muốn đổi quà với bạn' : ' gửi quà cho bạn'), 'Vào EWT Garden → Nhiệm vụ → Bạn bè để xem nhé.', 'garden.html?tab=friends'); } catch (e) { /* bỏ qua */ }
    reply(res, req.user, load(req.user), { sent: true, to: givenName(out.to.name) });
  });
  app.post('/api/garden/trade/respond', requireAuth, (req, res) => {
    const id = Number((req.body || {}).id), accept = String((req.body || {}).action) === 'accept';
    const out = tx(() => {
      const tr = one("SELECT * FROM garden_trades WHERE id=? AND to_uid=? AND status='pending'", id, req.user.id); if (!tr) return { err: 'Lời đề nghị này không còn nữa.' };
      if (!accept) { refund(tr); db.prepare("UPDATE garden_trades SET status='declined', done_at=? WHERE id=?").run(now(), id); return { tr, declined: true }; }
      const me = load(req.user), snd = userRow(tr.from_uid) ? load(userRow(tr.from_uid)) : null; if (!snd) return { err: 'Không tìm thấy người gửi.' };
      if (tr.want_id) { const taken = bagTake(me, tr.want_kind, tr.want_id); if (!taken) return { err: 'Bạn chưa có "' + ((thing(tr.want_kind, tr.want_id) || {}).name || 'món đó') + '" trong giỏ để đổi.' }; if (!bagPut(snd, tr.want_kind, tr.want_id, taken.name)) return { err: 'Giỏ của bạn ấy đã đầy, chưa đổi được.' }; evOwn(snd, tr.want_id); }
      if (!bagPut(me, tr.give_kind, tr.give_id, tr.give_name)) return { err: 'Giỏ của bạn đã đầy, hãy dọn bớt rồi nhận nhé.' };
      evOwn(me, tr.give_id); save(me); if (tr.want_id) save(snd);   // chỉ lưu khi mọi bước đã hợp lệ
      db.prepare("UPDATE garden_trades SET status='accepted', done_at=? WHERE id=?").run(now(), id); return { tr, st: me };
    });
    if (out.err) return bad(res, out.err);
    try { if (notifyUser) notifyUser(out.tr.from_uid, 'garden_trade', out.declined ? '😅 ' + givenName(req.user.name) + ' chưa nhận lời gửi của bạn' : '🎉 ' + givenName(req.user.name) + ' đã ' + (out.tr.want_id ? 'đồng ý đổi quà' : 'nhận quà của bạn'), out.declined ? 'Món quà đã về lại giỏ của bạn.' : 'Cảm ơn bạn đã chia sẻ!', 'garden.html?tab=friends'); } catch (e) { /* bỏ qua */ }
    reply(res, req.user, load(req.user), { done: true, accepted: !out.declined });
  });
  app.post('/api/garden/trade/cancel', requireAuth, (req, res) => {
    const id = Number((req.body || {}).id);
    const out = tx(() => { const tr = one("SELECT * FROM garden_trades WHERE id=? AND from_uid=? AND status='pending'", id, req.user.id); if (!tr) return { err: 'Lời gửi này không còn nữa.' }; refund(tr); db.prepare("UPDATE garden_trades SET status='cancelled', done_at=? WHERE id=?").run(now(), id); return { ok: 1 }; });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, load(req.user), { cancelled: true });
  });
  // Thầy cô: xem các lượt tặng/đổi gần đây để nắm tình hình
  app.get('/api/garden/teacher/trades', requireRole('teacher', 'admin'), (req, res) => {
    const rows = db.prepare('SELECT * FROM garden_trades ORDER BY id DESC LIMIT 100').all();
    res.json({ trades: rows.map((t) => ({ id: t.id, from: (userRow(t.from_uid) || {}).name, to: (userRow(t.to_uid) || {}).name, give: t.give_name || t.give_id, want: t.want_id ? (thing(t.want_kind, t.want_id) || {}).name : null, note: t.note, status: t.status, at: t.created_at })) });
  });

  /* ───────────────────────── Mua trữ kho · tặng xu · tặng nhiều món · sticker & lời nhắn ───────────────────────── */
  const SOCIAL = {
    xuMin: 10, xuMax: 50000, xuSendDay: 1000000, xuPairDay: 300000, xuRecvDay: 800000, xuCountDay: 20,
    parcelMaxKinds: 20, parcelMaxQty: 60, parcelDay: 8, parcelOut: 6, parcelPair: 3, parcelIn: 25,
    noteDayPair: 8, noteDay: 30, noteMax: 60, stockQty: 99
  };
  db.exec(`CREATE TABLE IF NOT EXISTS garden_xu_gifts (id INTEGER PRIMARY KEY AUTOINCREMENT, from_uid INTEGER NOT NULL, to_uid INTEGER NOT NULL, xu INTEGER NOT NULL, note TEXT, day TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE INDEX IF NOT EXISTS idx_gxg_from ON garden_xu_gifts(from_uid, day); CREATE INDEX IF NOT EXISTS idx_gxg_to ON garden_xu_gifts(to_uid, day);
    CREATE TABLE IF NOT EXISTS garden_parcels (id INTEGER PRIMARY KEY AUTOINCREMENT, from_uid INTEGER NOT NULL, to_uid INTEGER NOT NULL, items TEXT NOT NULL, note TEXT, status TEXT NOT NULL DEFAULT 'pending', day TEXT, created_at TEXT NOT NULL, done_at TEXT);
    CREATE INDEX IF NOT EXISTS idx_gpc_to ON garden_parcels(to_uid, status); CREATE INDEX IF NOT EXISTS idx_gpc_from ON garden_parcels(from_uid, status);
    CREATE TABLE IF NOT EXISTS garden_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, owner_uid INTEGER NOT NULL, from_uid INTEGER NOT NULL, sticker TEXT, text TEXT, zone TEXT, day TEXT NOT NULL, created_at TEXT NOT NULL, hidden INTEGER NOT NULL DEFAULT 0);
    CREATE INDEX IF NOT EXISTS idx_gnt_owner ON garden_notes(owner_uid, hidden, id); CREATE INDEX IF NOT EXISTS idx_gnt_from ON garden_notes(from_uid, day);`);
  const STICKERS = ['🌸', '🌻', '🌷', '💐', '🌈', '⭐', '✨', '💖', '😍', '👍', '👏', '🎉', '🦋', '🐰', '🐶', '🍀', '🌟', '😊', '🥰', '🏆'];
  const cleanTxt = (s, n) => String(s || '').replace(/<[^>]*>/g, '').replace(/https?:\/\/\S+|www\.\S+/gi, '').replace(/[\u0000-\u001f<>]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, n);
  const friendByToken = (tok) => (tok ? one('SELECT g.user_id AS id, g.open, u.name FROM garden g JOIN users u ON u.id=g.user_id WHERE g.share=?', String(tok)) : null);
  const bursts = new Map();
  const slow = (uid, n, ms) => { const t = Date.now(), a = (bursts.get(uid) || []).filter((x) => t - x < ms); a.push(t); bursts.set(uid, a); return a.length > n; };

  // 1) Mua đồ cất vào kho (giỏ) — dùng sau hoặc tặng lại
  app.post('/api/garden/stock/buy', requireAuth, (req, res) => {
    const b = req.body || {}, kind = b.kind === 'pet' ? 'pet' : 'item', id = String(b.id || ''), qty = Math.floor(Number(b.qty) || 1);
    if (qty < 1 || qty > SOCIAL.stockQty) return bad(res, 'Chọn số lượng từ 1 đến ' + SOCIAL.stockQty + ' nhé.');
    if (slow(req.user.id + ':stock', 25, 60e3)) return bad(res, 'Bạn thao tác nhanh quá, chờ một chút nhé.', 429);
    const out = tx(() => {
      const st = load(req.user), it = thing(kind, id); if (!it || !(it.cost > 0)) return { err: 'Món này không bán trong cửa hàng.' };
      const lvl = G.levelOf(G.beautyOf(st)); if (it.lvl > lvl) return { err: 'Cần vườn cấp ' + it.lvl + ' để mua món này.' };
      if (kind === 'item' && it.ev && !evIsActive(it.ev)) return { err: 'Món giới hạn sự kiện — đã hết mùa nên không mua được nữa.' };
      if (kind === 'item' && (st.bag.items[id] | 0) + qty > 999) return { err: 'Kho chỉ chứa tối đa 999 món mỗi loại.' };
      if (kind === 'pet' && st.bag.pets.length + qty > 60) return { err: 'Kho thú cưng chỉ chứa tối đa 60 bé.' };
      const cost = it.cost * qty, r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(cost, req.user.id, cost);
      if (!r.changes) return { err: 'Chưa đủ xu (cần ' + cost + ' 🪙).' };
      for (let k = 0; k < qty; k++) bagPut(st, kind, id, it.name);
      if (kind === 'item') evOwn(st, id);
      save(st); return { st, cost, name: it.name };
    });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, out.st, { stocked: qty, name: out.name, cost: out.cost });
  });

  // 2) Tặng xu cho bạn (chuyển ngay, có hạn mức mỗi ngày)
  // Chuyển xu giữa hai bạn (dùng chung giới hạn ngày cho cả Garden lẫn EWT City). to = { id, name }; trả { err } hoặc { to, left, coins }
  function xuTransfer(fromUser, to, xu, note) {
    if (xu < SOCIAL.xuMin || xu > SOCIAL.xuMax) return { err: 'Mỗi lần tặng từ ' + SOCIAL.xuMin + ' đến ' + SOCIAL.xuMax + ' xu nhé.' };
    if (slow(fromUser.id + ':xu', 10, 60e3)) return { err: 'Bạn thao tác nhanh quá, chờ một chút nhé.', code: 429 };
    const out = tx(() => {
      if (!to) return { err: 'Không tìm thấy bạn này, hoặc bạn ấy chưa mở cho bạn bè.' };
      if (to.id === fromUser.id) return { err: 'Bạn không thể tặng xu cho chính mình.' };
      const day = vnDay(), sum = (q, ...a) => one(q, ...a).s | 0;
      if (one('SELECT COUNT(*) c FROM garden_xu_gifts WHERE from_uid=? AND day=?', fromUser.id, day).c >= SOCIAL.xuCountDay) return { err: 'Hôm nay bạn đã tặng xu nhiều lần rồi — mai tiếp tục nhé!' };
      const sent = sum('SELECT COALESCE(SUM(xu),0) s FROM garden_xu_gifts WHERE from_uid=? AND day=?', fromUser.id, day);
      if (sent + xu > SOCIAL.xuSendDay) return { err: 'Mỗi ngày bạn tặng tối đa ' + SOCIAL.xuSendDay + ' xu (hôm nay đã tặng ' + sent + ').' };
      const pair = sum('SELECT COALESCE(SUM(xu),0) s FROM garden_xu_gifts WHERE from_uid=? AND to_uid=? AND day=?', fromUser.id, to.id, day);
      if (pair + xu > SOCIAL.xuPairDay) return { err: 'Mỗi ngày tặng một bạn tối đa ' + SOCIAL.xuPairDay + ' xu (hôm nay đã tặng bạn này ' + pair + ').' };
      const recv = sum('SELECT COALESCE(SUM(xu),0) s FROM garden_xu_gifts WHERE to_uid=? AND day=?', to.id, day);
      if (recv + xu > SOCIAL.xuRecvDay) return { err: 'Hôm nay bạn ấy đã nhận khá nhiều xu rồi, hãy tặng vào ngày mai nhé.' };
      const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(xu, fromUser.id, xu); if (!r.changes) return { err: 'Chưa đủ xu (cần ' + xu + ' 🪙).' };
      db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(to.id); addCoins(to.id, xu);
      db.prepare('INSERT INTO garden_xu_gifts (from_uid,to_uid,xu,note,day,created_at) VALUES (?,?,?,?,?,?)').run(fromUser.id, to.id, xu, note, day, now());
      return { to, left: SOCIAL.xuSendDay - sent - xu };
    });
    if (out.err) return out;
    out.coins = coinsOf(fromUser.id); return out;
  }
  app.locals.xuTransfer = xuTransfer; app.locals.cleanTxt = cleanTxt;
  app.post('/api/garden/xu/send', requireAuth, (req, res) => {
    const b = req.body || {}, xu = Math.floor(Number(b.xu) || 0), note = cleanTxt(b.note, 60), to = friendByToken(b.to);
    const out = xuTransfer(req.user, to && to.open ? to : null, xu, note);
    if (out.err) return bad(res, out.err, out.code);
    try { if (notifyUser) notifyUser(out.to.id, 'garden_xu', '💰 ' + givenName(req.user.name) + ' tặng bạn ' + xu + ' xu!', note ? '“' + note + '”' : 'Xu đã vào ví của bạn trong EWT Garden.', 'garden.html'); } catch (e) { /* bỏ qua */ }
    res.json({ ok: true, to: givenName(out.to.name), coins: out.coins, left: out.left });
  });

  // 3) Tặng NHIỀU món cùng lúc (chọn số lượng) — gửi thành "gói quà", bạn nhận đồng ý thì vào giỏ
  const parcelView = (p, me) => {
    const out = p.from_uid === me, other = userRow(out ? p.to_uid : p.from_uid) || {};
    let items = []; try { items = JSON.parse(p.items) || []; } catch (e) { /* bỏ qua */ }
    return { id: p.id, dir: out ? 'out' : 'in', who: givenName(other.name), status: p.status, note: p.note || '', at: p.created_at, items: items.map((x) => ({ kind: x.kind, id: x.id, qty: x.qty, name: x.name, cost: (thing(x.kind, x.id) || {}).cost || 0 })) };
  };
  const parcelItems = (p) => { try { return JSON.parse(p.items) || []; } catch (e) { return []; } };
  function parcelRefund(p) {
    const u = userRow(p.from_uid); if (!u) return; const st = load(u);
    parcelItems(p).forEach((x) => { for (let k = 0; k < x.qty; k++) { if (!bagPut(st, x.kind, x.id, x.name)) { const it = thing(x.kind, x.id); if (it && it.cost > 0) addCoins(p.from_uid, it.cost); } } });
    save(st);
  }
  const parcelCount = (uid) => one("SELECT COUNT(*) c FROM garden_parcels WHERE to_uid=? AND status='pending'", uid).c;
  let lastPExp = 0;
  function expireParcels() {
    const t = Date.now(); if (t - lastPExp < 60e3) return; lastPExp = t;
    const cut = new Date(t - TR.expireDays * 86400e3).toISOString();
    db.prepare("SELECT * FROM garden_parcels WHERE status='pending' AND created_at<? LIMIT 50").all(cut).forEach((p) => { parcelRefund(p); db.prepare("UPDATE garden_parcels SET status='expired', done_at=? WHERE id=?").run(now(), p.id); });
  }
  app.get('/api/garden/parcels', requireAuth, (req, res) => {
    try { expireParcels(); } catch (e) { console.error('[garden/parcel expire]', e.message); }
    const me = req.user.id, cut = new Date(Date.now() - 14 * 86400e3).toISOString();
    const q = (sql, ...a) => db.prepare(sql).all(...a).map((p) => parcelView(p, me));
    res.json({ incoming: q("SELECT * FROM garden_parcels WHERE to_uid=? AND status='pending' ORDER BY id DESC LIMIT 40", me), outgoing: q("SELECT * FROM garden_parcels WHERE from_uid=? AND status='pending' ORDER BY id DESC LIMIT 40", me),
      history: q("SELECT * FROM garden_parcels WHERE (from_uid=? OR to_uid=?) AND status<>'pending' AND created_at>? ORDER BY id DESC LIMIT 14", me, me, cut),
      xu: { sentToday: one('SELECT COALESCE(SUM(xu),0) s FROM garden_xu_gifts WHERE from_uid=? AND day=?', me, vnDay()).s, maxDay: SOCIAL.xuSendDay, min: SOCIAL.xuMin, max: SOCIAL.xuMax } });
  });
  app.post('/api/garden/parcel/send', requireAuth, (req, res) => {
    const b = req.body || {}, note = cleanTxt(b.note, 60), want = Array.isArray(b.items) ? b.items : [];
    if (slow(req.user.id + ':parcel', 12, 60e3)) return bad(res, 'Bạn thao tác nhanh quá, chờ một chút nhé.', 429);
    const out = tx(() => {
      expireParcels();
      const to = friendByToken(b.to); if (!to || !to.open) return { err: 'Không tìm thấy bạn này, hoặc bạn ấy chưa mở vườn cho bạn bè.' };
      if (to.id === req.user.id) return { err: 'Bạn không thể tặng quà cho chính mình.' };
      const merged = new Map(); let total = 0;
      for (const x of want) {
        const kind = kindOf(x && x.kind), id = String((x && x.id) || ''), qty = Math.floor(Number(x && x.qty) || 0), t = thing(kind, id);
        if (!t || !(t.cost > 0) || qty < 1) return { err: 'Có món không hợp lệ trong gói quà.' };
        const key = kind + ':' + id; merged.set(key, { kind, id, qty: (merged.get(key) ? merged.get(key).qty : 0) + qty, name: t.name }); total += qty;
      }
      if (!merged.size) return { err: 'Hãy chọn ít nhất một món để tặng.' };
      if (merged.size > SOCIAL.parcelMaxKinds || total > SOCIAL.parcelMaxQty) return { err: 'Mỗi gói quà tối đa ' + SOCIAL.parcelMaxKinds + ' loại và ' + SOCIAL.parcelMaxQty + ' món.' };
      const k = req.user.id, day = vnDay();
      if (one('SELECT COUNT(*) c FROM garden_parcels WHERE from_uid=? AND day=?', k, day).c >= SOCIAL.parcelDay) return { err: 'Hôm nay bạn đã gửi ' + SOCIAL.parcelDay + ' gói quà rồi — mai tiếp tục nhé!' };
      if (one("SELECT COUNT(*) c FROM garden_parcels WHERE from_uid=? AND status='pending'", k).c >= SOCIAL.parcelOut) return { err: 'Bạn đang có ' + SOCIAL.parcelOut + ' gói quà chưa được trả lời — hãy chờ hoặc huỷ bớt.' };
      if (one("SELECT COUNT(*) c FROM garden_parcels WHERE from_uid=? AND to_uid=? AND status='pending'", k, to.id).c >= SOCIAL.parcelPair) return { err: 'Bạn đã gửi ' + SOCIAL.parcelPair + ' gói cho bạn này mà chưa được trả lời. Chờ bạn ấy phản hồi nhé.' };
      if (parcelCount(to.id) >= SOCIAL.parcelIn) return { err: 'Hộp thư của bạn ấy đang đầy, thử lại sau nhé.' };
      const st = load(req.user), list = [...merged.values()];
      for (const x of list) { for (let n = 0; n < x.qty; n++) { const taken = bagTake(st, x.kind, x.id); if (!taken) return { err: 'Trong giỏ của bạn không đủ "' + x.name + '" (×' + x.qty + '). Hãy kiểm tra lại số lượng.', rollback: 1 }; if (x.kind === 'pet' && n === 0) x.pname = taken.name; } }
      db.prepare('INSERT INTO garden_parcels (from_uid,to_uid,items,note,status,day,created_at) VALUES (?,?,?,?,?,?,?)').run(k, to.id, JSON.stringify(list.map((x) => ({ kind: x.kind, id: x.id, qty: x.qty, name: x.pname || x.name }))), note, 'pending', day, now());
      save(st); return { to, n: total };
    });
    if (out.err) return bad(res, out.err);
    try { if (notifyUser) notifyUser(out.to.id, 'garden_trade', '🎁 ' + givenName(req.user.name) + ' gửi bạn gói quà ' + out.n + ' món', 'Vào EWT Garden → Nhiệm vụ → Bạn bè để nhận nhé.', 'garden.html?tab=friends'); } catch (e) { /* bỏ qua */ }
    reply(res, req.user, load(req.user), { sent: true, to: givenName(out.to.name), n: out.n });
  });
  app.post('/api/garden/parcel/respond', requireAuth, (req, res) => {
    const id = Number((req.body || {}).id), accept = String((req.body || {}).action) === 'accept';
    const out = tx(() => {
      const p = one("SELECT * FROM garden_parcels WHERE id=? AND to_uid=? AND status='pending'", id, req.user.id); if (!p) return { err: 'Gói quà này không còn nữa.' };
      if (!accept) { parcelRefund(p); db.prepare("UPDATE garden_parcels SET status='declined', done_at=? WHERE id=?").run(now(), id); return { p, declined: true }; }
      const me = load(req.user), items = parcelItems(p);
      const needPets = items.filter((x) => x.kind === 'pet').reduce((a, x) => a + x.qty, 0);
      if (me.bag.pets.length + needPets > 60) return { err: 'Kho thú cưng của bạn không đủ chỗ (tối đa 60 bé).' };
      for (const x of items) if (x.kind === 'item' && (me.bag.items[x.id] | 0) + x.qty > 999) return { err: 'Kho của bạn đã quá đầy món "' + x.name + '" (tối đa 999).' };
      items.forEach((x) => { for (let k = 0; k < x.qty; k++) bagPut(me, x.kind, x.id, x.name); if (x.kind === 'item') evOwn(me, x.id); });
      save(me); db.prepare("UPDATE garden_parcels SET status='accepted', done_at=? WHERE id=?").run(now(), id); return { p };
    });
    if (out.err) return bad(res, out.err);
    try { if (notifyUser) notifyUser(out.p.from_uid, 'garden_trade', out.declined ? '😅 ' + givenName(req.user.name) + ' chưa nhận gói quà của bạn' : '🎉 ' + givenName(req.user.name) + ' đã nhận gói quà của bạn', out.declined ? 'Các món đã về lại giỏ của bạn.' : 'Cảm ơn bạn đã chia sẻ!', 'garden.html?tab=friends'); } catch (e) { /* bỏ qua */ }
    reply(res, req.user, load(req.user), { done: true, accepted: !out.declined });
  });
  app.post('/api/garden/parcel/cancel', requireAuth, (req, res) => {
    const id = Number((req.body || {}).id);
    const out = tx(() => { const p = one("SELECT * FROM garden_parcels WHERE id=? AND from_uid=? AND status='pending'", id, req.user.id); if (!p) return { err: 'Gói quà này không còn nữa.' }; parcelRefund(p); db.prepare("UPDATE garden_parcels SET status='cancelled', done_at=? WHERE id=?").run(now(), id); return { ok: 1 }; });
    if (out.err) return bad(res, out.err);
    reply(res, req.user, load(req.user), { cancelled: true });
  });

  // 4) Thả sticker + lời nhắn nổi trên khu vườn của bạn
  const noteView = (n) => ({ id: n.id, who: givenName((userRow(n.from_uid) || {}).name || 'Bạn'), sticker: n.sticker || '', text: n.text || '', zone: n.zone || 'map', at: n.created_at, mine: 0 });
  const notesOf = (uid, me) => db.prepare('SELECT * FROM garden_notes WHERE owner_uid=? AND hidden=0 ORDER BY id DESC LIMIT 40').all(uid).map((n) => Object.assign(noteView(n), { mine: n.from_uid === me ? 1 : 0 }));
  app.get('/api/garden/notes', requireAuth, (req, res) => {
    const tok = String(req.query.token || ''), to = tok ? friendByToken(tok) : { id: req.user.id, open: 1 };
    if (!to || (!to.open && to.id !== req.user.id)) return bad(res, 'Không tìm thấy khu vườn.', 404);
    res.json({ notes: notesOf(to.id, req.user.id), stickers: STICKERS, own: to.id === req.user.id });
  });
  app.post('/api/garden/note', requireAuth, (req, res) => {
    const b = req.body || {}, sticker = STICKERS.indexOf(String(b.sticker || '')) >= 0 ? String(b.sticker) : '', text = cleanTxt(b.text, 80), zone = (G.ZBY[String(b.zone || '')] ? String(b.zone) : 'map');
    if (!sticker && !text) return bad(res, 'Hãy chọn một sticker hoặc viết vài chữ nhé.');
    const to = friendByToken(b.to); if (!to || !to.open) return bad(res, 'Không tìm thấy khu vườn này, hoặc bạn ấy chưa mở vườn.', 404);
    if (to.id === req.user.id) return bad(res, 'Hãy ghé vườn bạn bè để thả sticker nhé.');
    if (slow(req.user.id + ':note', 12, 60e3)) return bad(res, 'Bạn thao tác nhanh quá, chờ một chút nhé.', 429);
    const day = vnDay();
    if (one('SELECT COUNT(*) c FROM garden_notes WHERE from_uid=? AND day=?', req.user.id, day).c >= SOCIAL.noteDay) return bad(res, 'Hôm nay bạn đã thả nhiều sticker rồi — mai tiếp tục nhé!');
    if (one('SELECT COUNT(*) c FROM garden_notes WHERE from_uid=? AND owner_uid=? AND day=?', req.user.id, to.id, day).c >= SOCIAL.noteDayPair) return bad(res, 'Hôm nay bạn đã để lại ' + SOCIAL.noteDayPair + ' lời nhắn trong vườn bạn này rồi.');
    const recent = one('SELECT COUNT(*) c FROM garden_notes WHERE from_uid=? AND owner_uid=? AND created_at>?', req.user.id, to.id, new Date(Date.now() - 30 * 60e3).toISOString()).c;
    db.prepare('INSERT INTO garden_notes (owner_uid,from_uid,sticker,text,zone,day,created_at) VALUES (?,?,?,?,?,?,?)').run(to.id, req.user.id, sticker, text, zone, day, now());
    db.prepare('DELETE FROM garden_notes WHERE owner_uid=? AND id NOT IN (SELECT id FROM garden_notes WHERE owner_uid=? ORDER BY id DESC LIMIT ?)').run(to.id, to.id, SOCIAL.noteMax);
    if (!recent) { try { if (notifyUser) notifyUser(to.id, 'garden_note', '💬 ' + givenName(req.user.name) + ' ghé vườn bạn' + (sticker ? ' ' + sticker : ''), text ? '“' + text + '”' : 'Bạn ấy vừa thả một sticker trong khu vườn của bạn.', 'garden.html'); } catch (e) { /* bỏ qua */ } }
    res.json({ ok: true, notes: notesOf(to.id, req.user.id) });
  });
  app.post('/api/garden/note/delete', requireAuth, (req, res) => {   // chủ vườn hoặc người đã viết được xoá
    const id = Number((req.body || {}).id), n = one('SELECT * FROM garden_notes WHERE id=?', id);
    if (!n || (n.owner_uid !== req.user.id && n.from_uid !== req.user.id)) return bad(res, 'Không tìm thấy lời nhắn này.', 404);
    db.prepare('UPDATE garden_notes SET hidden=1 WHERE id=?').run(id); res.json({ ok: true });
  });
  app.get('/api/garden/teacher/social', requireRole('teacher', 'admin'), (req, res) => {   // thầy cô theo dõi xu / lời nhắn / gói quà gần đây
    const nm = (u) => (userRow(u) || {}).name || '?';
    res.json({
      xu: db.prepare('SELECT * FROM garden_xu_gifts ORDER BY id DESC LIMIT 60').all().map((g) => ({ from: nm(g.from_uid), to: nm(g.to_uid), xu: g.xu, note: g.note, at: g.created_at })),
      notes: db.prepare('SELECT * FROM garden_notes ORDER BY id DESC LIMIT 80').all().map((n) => ({ id: n.id, from: nm(n.from_uid), to: nm(n.owner_uid), sticker: n.sticker, text: n.text, hidden: !!n.hidden, at: n.created_at })),
      parcels: db.prepare('SELECT * FROM garden_parcels ORDER BY id DESC LIMIT 60').all().map((p) => ({ from: nm(p.from_uid), to: nm(p.to_uid), n: parcelItems(p).reduce((a, x) => a + x.qty, 0), status: p.status, at: p.created_at }))
    });
  });
  app.post('/api/garden/teacher/note/hide', requireRole('teacher', 'admin'), (req, res) => { db.prepare('UPDATE garden_notes SET hidden=? WHERE id=?').run((req.body || {}).hide === false ? 0 : 1, Number((req.body || {}).id)); res.json({ ok: true }); });

  /* ───────────────────────── Hộ chiếu văn hoá ───────────────────────── */
  const pend = new Map();
  const shuf = (a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  app.get('/api/garden/culture/quiz', requireAuth, (req, res) => {
    const zid = String(req.query.zone || ''), qs = QUIZ[zid], st = load(req.user);
    if (!qs || !CUL.CULTURE[zid]) return bad(res, 'Khu này chưa có Hộ chiếu văn hoá.');
    if (st.zones.indexOf(zid) < 0) return bad(res, 'Hãy mở khu này trước nhé.');
    const vi = QUIZVI[zid] || [];
    const items = qs.map((q, n) => { const order = shuf(q[1].map((_, i) => i)), v = vi[n] || []; return { q: q[0], qv: v[0] || '', opts: order.map((i) => q[1][i]), optsVi: order.map((i) => (v[1] || [])[i] || ''), a: order.indexOf(0), expl: q[2], explVi: v[2] || '' }; });
    pend.set(req.user.id + ':' + zid, { items, ts: Date.now() });
    for (const [k, v] of pend) if (Date.now() - v.ts > 30 * 60e3) pend.delete(k);
    res.json({ zone: zid, stamped: !!(st.passport[zid] && st.passport[zid].stamp), questions: items.map((x) => ({ q: x.q, qv: x.qv, opts: x.opts, optsVi: x.optsVi })) });
  });
  app.post('/api/garden/culture/answer', requireAuth, (req, res) => {
    const zid = String((req.body || {}).zone || ''), ans = (req.body || {}).answers, key = req.user.id + ':' + zid, p = pend.get(key);
    if (!p) return bad(res, 'Bài kiểm tra đã hết hạn, hãy mở lại nhé.');
    if (!Array.isArray(ans) || ans.length !== p.items.length) return bad(res, 'Hãy trả lời đủ các câu hỏi.');
    pend.delete(key);
    const results = p.items.map((x, i) => ({ ok: Number(ans[i]) === x.a, answer: x.a, expl: x.expl, explVi: x.explVi })), correct = results.filter((r) => r.ok).length;
    const out = tx(() => {
      const st = load(req.user); let got = [], first = false;
      if (correct >= 2) {
        track(st, 'passport', 1);
        const rec = st.passport[zid] || (st.passport[zid] = {});
        if (!rec.stamp) { rec.stamp = 1; rec.at = now(); first = true; got = got.concat(grant(st, req.user.id, { xu: correct === 3 ? 250 : 150, chest: 1 })); }
        rec.best = Math.max(rec.best | 0, correct);
        const n = Object.keys(st.passport).filter((k) => k !== '_m' && st.passport[k] && st.passport[k].stamp).length, mm = st.passport._m || (st.passport._m = []);
        [[5, { xu: 300, free: { big: 1 } }], [10, { xu: 800, chest: 2 }], [15, { xu: 2000, chest: 3, free: { big: 1 } }], [20, { xu: 3500, chest: 3, free: { big: 1 } }], [23, { xu: 6000, chest: 4, free: { big: 2 } }], [25, { xu: 4000, chest: 3, free: { big: 1 } }], [30, { xu: 7000, chest: 4, free: { big: 2 } }], [35, { xu: 12000, chest: 6, free: { big: 3 } }]].forEach((m) => { if (n >= m[0] && mm.indexOf(m[0]) < 0) { mm.push(m[0]); got = got.concat(['🏅 Đủ ' + m[0] + ' dấu hộ chiếu!'], grant(st, req.user.id, m[1])); } });
      }
      save(st); return { st, got, first };
    });
    reply(res, req.user, out.st, { results, correct, passed: correct >= 2, first: out.first, reward: out.got });
  });

  return { track, questsView, scanHomework, inboxCount, tradeCount, eventsView, evIsActive, evOwn };
};
