'use strict';
// 🏙️ EWT City — giai đoạn 3: bạn bè (thăm thành phố, sticker/lời nhắn, tặng xu & đồ), xếp hạng, dự án cả lớp, công cụ giáo viên.
// "Bạn bè" = các bạn học sinh cùng lớp (cùng nhóm) đã bật cho bạn bè xem thành phố. Tặng xu dùng chung giới hạn ngày với Garden.
const crypto = require('crypto');
const C = require('./js/city-data.js');
const L = require('./js/city-learn.js');

module.exports = function (app, { db, requireAuth, requireRole, now, notifyUser }) {
  const K = () => app.locals.city;
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const bad = (res, msg, code) => res.status(code || 400).json({ error: msg });
  const vnDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const givenName = (n) => String(n || 'bạn').trim().split(/\s+/).slice(-1)[0] || 'bạn';
  const clean = (s, n) => (app.locals.cleanTxt ? app.locals.cleanTxt(s, n) : String(s || '').replace(/[<>]/g, '').trim().slice(0, n));
  const notify = (uid, type, title, body, link) => { try { if (notifyUser) notifyUser(uid, type, title, body, link || 'city.html'); } catch (_) { /* bỏ qua */ } };
  const SOC = { noteDay: 10, notePair: 3, visitReward: 25, visitRewardDay: 5, itemSendDay: 20, itemPairDay: 10, itemRecvDay: 40, invMax: 60, noteMax: 40 };
  const STICKERS = ['❤️', '👍', '👏', '🎉', '🏙️', '🌟', '😍', '🔥', '🏆', '🌈', '🎈', '🚀'];

  db.exec(`
    CREATE TABLE IF NOT EXISTS city_meta (k TEXT PRIMARY KEY, v TEXT);
    CREATE TABLE IF NOT EXISTS city_notes (id INTEGER PRIMARY KEY AUTOINCREMENT, owner_uid INTEGER NOT NULL, from_uid INTEGER NOT NULL, sticker TEXT, text TEXT, day TEXT NOT NULL, created_at TEXT NOT NULL, hidden INTEGER NOT NULL DEFAULT 0);
    CREATE INDEX IF NOT EXISTS idx_cn_owner ON city_notes(owner_uid, hidden, id);
    CREATE TABLE IF NOT EXISTS city_visits (day TEXT NOT NULL, from_uid INTEGER NOT NULL, to_uid INTEGER NOT NULL, PRIMARY KEY (day, from_uid, to_uid));
    CREATE TABLE IF NOT EXISTS city_gifts (id INTEGER PRIMARY KEY AUTOINCREMENT, from_uid INTEGER NOT NULL, to_uid INTEGER NOT NULL, k TEXT NOT NULL, n INTEGER NOT NULL, day TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS city_projects (id INTEGER PRIMARY KEY AUTOINCREMENT, group_id INTEGER NOT NULL, kind TEXT NOT NULL, k TEXT, target INTEGER NOT NULL, reward INTEGER NOT NULL DEFAULT 0, title TEXT, created_by INTEGER, created_at TEXT NOT NULL, status TEXT NOT NULL DEFAULT 'open', done_at TEXT, final INTEGER NOT NULL DEFAULT 0);`);

  let SECRET = (one("SELECT v FROM city_meta WHERE k='secret'") || {}).v;
  if (!SECRET) { SECRET = crypto.randomBytes(16).toString('hex'); db.prepare("INSERT OR REPLACE INTO city_meta (k,v) VALUES ('secret',?)").run(SECRET); }
  const tokOf = (uid) => crypto.createHash('sha256').update(SECRET + ':' + uid).digest('hex').slice(0, 16);

  const classmates = (uid) => db.prepare(`SELECT DISTINCT u.id, u.name FROM group_members gm JOIN group_members gm2 ON gm2.group_id=gm.group_id JOIN users u ON u.id=gm2.user_id
    WHERE gm.user_id=? AND u.id<>? AND u.role='student' ORDER BY u.name LIMIT 120`).all(uid, uid);
  const userRow = (id) => one('SELECT id, name, role FROM users WHERE id=?', id);
  // tìm bạn qua mã; giáo viên / quản trị xem được mọi học sinh (qua uid)
  function findFriend(me, tok, uid) {
    if (me.role === 'teacher' || me.role === 'admin') { const id = Number(uid); if (Number.isInteger(id) && id > 0) { const u = userRow(id); if (u) return Object.assign({ staff: true }, u); } }
    if (!tok) return null;
    const f = classmates(me.id).find((x) => tokOf(x.id) === String(tok)); return f || null;
  }
  const myGroups = (uid) => db.prepare('SELECT g.id, g.name FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id=?').all(uid);
  const sendBrief = (uid) => { const st = K().peek(uid); if (!st) return null; const s = K().stats(st); return { st, s }; };

  /* ───── danh sách bạn bè ───── */
  app.get('/api/city/friends', requireAuth, (req, res) => {
    const day = vnDay(), me = K().load(req.user.id), out = [];
    classmates(req.user.id).forEach((f) => {
      const b = sendBrief(f.id); if (!b || b.st.open === 0) return;
      out.push({ token: tokOf(f.id), name: f.name, short: givenName(f.name), level: b.s.level, score: b.s.score, pop: b.s.pop, happy: b.s.happy, n: b.s.n, districts: b.st.districts.length,
        visited: !!one('SELECT 1 x FROM city_visits WHERE day=? AND from_uid=? AND to_uid=?', day, req.user.id, f.id) });
    });
    const rewardLeft = Math.max(0, SOC.visitRewardDay - one('SELECT COUNT(*) c FROM city_visits WHERE day=? AND from_uid=? AND rewarded=1', day, req.user.id).c);
    res.json({ friends: out, open: me.open, stickers: STICKERS, rewardLeft, reward: SOC.visitReward });
  });
  // visits.rewarded: thêm cột nếu chưa có
  try { db.exec('ALTER TABLE city_visits ADD COLUMN rewarded INTEGER NOT NULL DEFAULT 0'); } catch (_) { /* đã có */ }

  app.post('/api/city/privacy', requireAuth, (req, res) => {
    const open = (req.body || {}).open ? 1 : 0, K1 = K();
    const out = K1.tx(() => { const st = K1.load(req.user.id); st.open = open; K1.save(req.user.id, st); return { st }; });
    res.json({ open: out.st.open });
  });

  /* ───── thăm thành phố bạn ───── */
  const notesOf = (owner, viewer, limit) => db.prepare('SELECT n.id, n.from_uid, n.sticker, n.text, n.created_at, u.name FROM city_notes n JOIN users u ON u.id=n.from_uid WHERE n.owner_uid=? AND n.hidden=0 ORDER BY n.id DESC LIMIT ?').all(owner, limit || 15)
    .map((r) => ({ id: r.id, who: givenName(r.name), sticker: r.sticker || '', text: r.text || '', at: r.created_at, mine: r.from_uid === viewer }));
  app.get('/api/city/visit', requireAuth, (req, res) => {
    const f = findFriend(req.user, req.query.token, req.query.uid); if (!f) return bad(res, 'Không tìm thấy thành phố này.', 404);
    const st = K().peek(f.id); if (!st) return bad(res, 'Bạn ấy chưa bắt đầu xây thành phố.', 404);
    if (st.open === 0 && !f.staff) return bad(res, 'Bạn ấy chưa mở thành phố cho bạn bè.', 404);
    const day = vnDay(), left = SOC.noteDay - one('SELECT COUNT(*) c FROM city_notes WHERE from_uid=? AND day=?', req.user.id, day).c;
    res.json({ owner: { name: f.name, short: givenName(f.name), token: f.staff ? '' : tokOf(f.id), uid: f.staff ? f.id : undefined }, city: K().viewOther(st), notes: notesOf(f.id, req.user.id, 12), stickers: STICKERS, noteLeft: Math.max(0, left), staff: !!f.staff });
  });
  app.post('/api/city/visit/note', requireAuth, (req, res) => {
    const b = req.body || {}, sticker = STICKERS.indexOf(String(b.sticker || '')) >= 0 ? String(b.sticker) : '', text = clean(b.text, 80);
    if (!sticker && !text) return bad(res, 'Hãy chọn một sticker hoặc viết vài chữ nhé.');
    const f = findFriend(req.user, b.token, null); if (!f || f.staff) return bad(res, 'Không tìm thấy thành phố của bạn này.', 404);
    const st = K().peek(f.id); if (!st || st.open === 0) return bad(res, 'Bạn ấy chưa mở thành phố cho bạn bè.', 404);
    const day = vnDay(), me = req.user.id;
    if (one('SELECT COUNT(*) c FROM city_notes WHERE from_uid=? AND day=?', me, day).c >= SOC.noteDay) return bad(res, 'Hôm nay bạn đã thả nhiều sticker rồi — mai tiếp tục nhé!');
    if (one('SELECT COUNT(*) c FROM city_notes WHERE from_uid=? AND owner_uid=? AND day=?', me, f.id, day).c >= SOC.notePair) return bad(res, 'Hôm nay bạn đã để lại ' + SOC.notePair + ' lời nhắn ở thành phố bạn này rồi.');
    let reward = 0;
    K().tx(() => {
      db.prepare('INSERT INTO city_notes (owner_uid,from_uid,sticker,text,day,created_at) VALUES (?,?,?,?,?,?)').run(f.id, me, sticker, text, day, now());
      db.prepare('DELETE FROM city_notes WHERE owner_uid=? AND id NOT IN (SELECT id FROM city_notes WHERE owner_uid=? ORDER BY id DESC LIMIT ?)').run(f.id, f.id, SOC.noteMax);
      const ins = db.prepare('INSERT OR IGNORE INTO city_visits (day,from_uid,to_uid,rewarded) VALUES (?,?,?,0)').run(day, me, f.id);
      if (ins.changes && one('SELECT COUNT(*) c FROM city_visits WHERE day=? AND from_uid=? AND rewarded=1', day, me).c < SOC.visitRewardDay) { db.prepare('UPDATE city_visits SET rewarded=1 WHERE day=? AND from_uid=? AND to_uid=?').run(day, me, f.id); K().addCoins(me, SOC.visitReward); reward = SOC.visitReward; }
      return {};
    });
    notify(f.id, 'city_note', '💬 ' + givenName(req.user.name) + ' ghé thăm thành phố của bạn' + (sticker ? ' ' + sticker : ''), text ? '“' + text + '”' : 'Bạn ấy vừa thả một sticker ở EWT City của bạn.');
    res.json({ ok: true, reward, notes: notesOf(f.id, me, 12), noteLeft: Math.max(0, SOC.noteDay - one('SELECT COUNT(*) c FROM city_notes WHERE from_uid=? AND day=?', me, day).c) });
  });
  app.get('/api/city/notes', requireAuth, (req, res) => res.json({ notes: notesOf(req.user.id, req.user.id, 15) }));
  app.post('/api/city/notes/delete', requireAuth, (req, res) => {
    const id = Number((req.body || {}).id), n = one('SELECT * FROM city_notes WHERE id=?', id);
    if (!n || (n.owner_uid !== req.user.id && n.from_uid !== req.user.id)) return bad(res, 'Không tìm thấy lời nhắn này.', 404);
    db.prepare('UPDATE city_notes SET hidden=1 WHERE id=?').run(id); res.json({ ok: true });
  });

  /* ───── tặng xu & tặng đồ trong kho ───── */
  const slowMap = new Map();
  const slow = (key, n, ms) => { const t = Date.now(), a = (slowMap.get(key) || []).filter((x) => t - x < ms); a.push(t); slowMap.set(key, a); return a.length > n; };
  app.post('/api/city/gift/xu', requireAuth, (req, res) => {
    const b = req.body || {}, f = findFriend(req.user, b.token, null); if (!f || f.staff) return bad(res, 'Không tìm thấy bạn này.', 404);
    const st = K().peek(f.id); if (!st || st.open === 0) return bad(res, 'Bạn ấy chưa mở thành phố cho bạn bè.', 404);
    if (!app.locals.xuTransfer) return bad(res, 'Tính năng chưa sẵn sàng, thử lại sau nhé.', 503);
    const xu = Math.floor(Number(b.xu) || 0), note = clean(b.note, 60), out = app.locals.xuTransfer(req.user, { id: f.id, name: f.name }, xu, note);
    if (out.err) return bad(res, out.err, out.code);
    notify(f.id, 'garden_xu', '💰 ' + givenName(req.user.name) + ' tặng bạn ' + xu + ' xu!', note ? '“' + note + '”' : 'Xu đã vào ví của bạn (dùng chung cho EWT City và Garden).');
    res.json({ ok: true, coins: out.coins, left: out.left });
  });
  app.post('/api/city/gift/item', requireAuth, (req, res) => {
    const b = req.body || {}, it = C.BY[String(b.k)], n = Math.floor(Number(b.n)), me = req.user.id;
    if (!it || !(n >= 1 && n <= SOC.itemPairDay)) return bad(res, 'Hãy chọn món và số lượng từ 1 đến ' + SOC.itemPairDay + '.');
    if (slow(me + ':gi', 8, 60e3)) return bad(res, 'Bạn thao tác nhanh quá, chờ một chút nhé.', 429);
    const f = findFriend(req.user, b.token, null); if (!f || f.staff) return bad(res, 'Không tìm thấy bạn này.', 404);
    const K1 = K(), day = vnDay(), sum = (q, ...a) => one(q, ...a).s | 0;
    const out = K1.tx(() => {
      const rs = K1.peek(f.id); if (!rs || rs.open === 0) return { err: 'Bạn ấy chưa mở thành phố cho bạn bè.' };
      const sent = sum('SELECT COALESCE(SUM(n),0) s FROM city_gifts WHERE from_uid=? AND day=?', me, day); if (sent + n > SOC.itemSendDay) return { err: 'Mỗi ngày bạn tặng tối đa ' + SOC.itemSendDay + ' món (hôm nay đã tặng ' + sent + ').' };
      const pair = sum('SELECT COALESCE(SUM(n),0) s FROM city_gifts WHERE from_uid=? AND to_uid=? AND day=?', me, f.id, day); if (pair + n > SOC.itemPairDay) return { err: 'Mỗi ngày tặng một bạn tối đa ' + SOC.itemPairDay + ' món.' };
      const recv = sum('SELECT COALESCE(SUM(n),0) s FROM city_gifts WHERE to_uid=? AND day=?', f.id, day); if (recv + n > SOC.itemRecvDay) return { err: 'Hôm nay bạn ấy đã nhận khá nhiều quà rồi, hãy tặng vào ngày mai nhé.' };
      const mine = K1.load(me); if ((mine.inv[it.k] | 0) < n) return { err: 'Trong kho của bạn chưa đủ ' + it.vi + ' (có ' + (mine.inv[it.k] | 0) + ').' };
      const theirs = K1.load(f.id); if ((theirs.inv[it.k] | 0) + n > SOC.invMax) return { err: 'Kho của bạn ấy sắp đầy món này rồi.' };
      mine.inv[it.k] -= n; if (!mine.inv[it.k]) delete mine.inv[it.k]; theirs.inv[it.k] = (theirs.inv[it.k] | 0) + n; K1.save(me, mine); K1.save(f.id, theirs);
      db.prepare('INSERT INTO city_gifts (from_uid,to_uid,k,n,day,created_at) VALUES (?,?,?,?,?,?)').run(me, f.id, it.k, n, day, now());
      return { st: mine };
    });
    if (out.err) return bad(res, out.err);
    notify(f.id, 'city_gift', '🎁 ' + givenName(req.user.name) + ' tặng bạn ' + n + ' × ' + it.vi, 'Món quà đã nằm trong kho EWT City của bạn.');
    res.json({ ok: true, inv: out.st.inv });
  });

  /* ───── bảng xếp hạng ───── */
  let rankCache = { at: 0, rows: [] };
  function allRows() {
    if (Date.now() - rankCache.at < 45e3) return rankCache.rows;
    const rows = db.prepare("SELECT c.user_id, u.name FROM city c JOIN users u ON u.id=c.user_id WHERE u.role='student'").all(), out = [];
    rows.forEach((r) => { const st = K().peek(r.user_id); if (!st || st.open === 0) return; const s = K().stats(st); out.push({ uid: r.user_id, name: r.name, level: s.level, score: s.score, pop: s.pop, happy: s.happy, n: s.n, learn: Object.keys(st.chapters).length }); });
    rankCache = { at: Date.now(), rows: out }; return out;
  }
  app.get('/api/city/rank', requireAuth, (req, res) => {
    const scope = req.query.scope === 'school' ? 'school' : 'class', metric = ['score', 'pop', 'happy', 'learn'].indexOf(req.query.metric) >= 0 ? req.query.metric : 'score', me = req.user.id;
    let rows = allRows(), ids = null;
    if (scope === 'class') { ids = new Set(classmates(me).map((x) => x.id)); ids.add(me); rows = rows.filter((r) => ids.has(r.uid)); }
    // người chơi đang tắt chia sẻ vẫn thấy mình trong bảng của chính mình
    if (!rows.some((r) => r.uid === me)) { const st = K().peek(me); if (st) { const s = K().stats(st); rows = rows.concat([{ uid: me, name: req.user.name, level: s.level, score: s.score, pop: s.pop, happy: s.happy, n: s.n, learn: Object.keys(st.chapters).length }]); } }
    rows = rows.slice().sort((a, b) => b[metric] - a[metric] || b.score - a.score || a.uid - b.uid);
    const list = rows.map((r, i) => ({ rank: i + 1, short: givenName(r.name), level: r.level, score: r.score, pop: r.pop, happy: r.happy, n: r.n, learn: r.learn, me: r.uid === me, token: scope === 'class' && r.uid !== me ? tokOf(r.uid) : '' }));
    const mine = list.find((x) => x.me) || null;
    res.json({ scope, metric, total: list.length, top: list.slice(0, 30), me: mine });
  });

  /* ───── dự án cả lớp ───── */
  const KINDS = { build: 'Cả lớp cùng xây một loại công trình', pop: 'Cả lớp cùng tăng dân số', learn: 'Cả lớp cùng học chương từ vựng' };
  const membersOf = (gid) => db.prepare("SELECT DISTINCT u.id, u.name FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? AND u.role='student' LIMIT 80").all(gid);
  function contribOf(p, uid) {
    const st = K().peek(uid); if (!st) return 0;
    if (p.kind === 'build') return st.bs.filter((b) => b.k === p.k && b.lv > 0).length;
    if (p.kind === 'pop') return K().stats(st).pop;
    return Object.keys(st.chapters).length;
  }
  function projView(p, me) {
    const ms = membersOf(p.group_id), rows = ms.map((m) => ({ id: m.id, name: givenName(m.name), v: contribOf(p, m.id) })).sort((a, b) => b.v - a.v);
    const total = p.status === 'done' ? Math.max(p.final, 0) : rows.reduce((s, r) => s + r.v, 0), g = one('SELECT name FROM groups WHERE id=?', p.group_id) || {}, it = p.k ? C.BY[p.k] : null;
    return { id: p.id, group: g.name || '', title: p.title || KINDS[p.kind], kind: p.kind, k: p.k || '', itemVi: it ? it.vi : '', itemEn: it ? it.en : '', target: p.target, total, reward: p.reward, status: p.status, members: ms.length, mine: rows.find((r) => r.id === me) ? rows.find((r) => r.id === me).v : 0, top: rows.filter((r) => r.v > 0).slice(0, 5).map((r) => ({ name: r.name, v: r.v })), at: p.created_at, doneAt: p.done_at || '' };
  }
  // kiểm tra hoàn thành → phát thưởng một lần cho mọi bạn đã đóng góp
  function checkProject(p) {
    if (p.status !== 'open') return p;
    const ms = membersOf(p.group_id), rows = ms.map((m) => ({ id: m.id, v: contribOf(p, m.id) })), total = rows.reduce((s, r) => s + r.v, 0);
    if (total < p.target) return p;
    const K1 = K(), r = K1.tx(() => {
      const cur = one('SELECT status FROM city_projects WHERE id=?', p.id); if (!cur || cur.status !== 'open') return { skip: true };
      db.prepare("UPDATE city_projects SET status='done', done_at=?, final=? WHERE id=?").run(now(), total, p.id);
      rows.filter((x) => x.v > 0).forEach((x) => { if (p.reward > 0) K1.addCoins(x.id, p.reward); });
      return { rows };
    });
    if (!r.skip) r.rows.filter((x) => x.v > 0).forEach((x) => notify(x.id, 'city_project', '🏆 Cả lớp đã hoàn thành dự án EWT City!', (p.title || KINDS[p.kind]) + (p.reward ? ' — bạn nhận +' + p.reward + ' xu.' : '')));
    return one('SELECT * FROM city_projects WHERE id=?', p.id);
  }
  app.get('/api/city/class', requireAuth, (req, res) => {
    const gs = myGroups(req.user.id).map((g) => g.id); if (!gs.length) return res.json({ joined: false, projects: [] });
    const rows = db.prepare('SELECT * FROM city_projects WHERE group_id IN (' + gs.map(() => '?').join(',') + ") AND (status='open' OR done_at>=?) ORDER BY id DESC LIMIT 10").all(...gs, new Date(Date.now() - 14 * 86400e3).toISOString());
    res.json({ joined: true, projects: rows.map((p) => projView(checkProject(p), req.user.id)) });
  });
  setInterval(() => { try { db.prepare("SELECT * FROM city_projects WHERE status='open' LIMIT 50").all().forEach(checkProject); } catch (_) { /* bỏ qua */ } }, 10 * 60e3).unref();

  /* ───── giáo viên ───── */
  const ownsGroup = (u, gid) => u.role === 'admin' || !!one('SELECT 1 x FROM groups WHERE id=? AND teacher_id=?', gid, u.id);
  app.post('/api/city/teacher/project', requireRole('teacher', 'admin'), (req, res) => {
    const b = req.body || {}, gid = Number(b.group_id), kind = KINDS[b.kind] ? b.kind : '', target = Math.floor(Number(b.target) || 0), reward = Math.floor(Number(b.reward) || 0), title = clean(b.title, 80);
    if (!one('SELECT id FROM groups WHERE id=?', gid) || !ownsGroup(req.user, gid)) return bad(res, 'Không tìm thấy lớp của bạn.');
    if (!kind) return bad(res, 'Hãy chọn loại dự án.');
    let k = null; if (kind === 'build') { const it = C.BY[String(b.k)]; if (!it || it.ev) return bad(res, 'Hãy chọn một công trình (không phải món sự kiện).'); k = it.k; }
    const max = kind === 'build' ? 300 : kind === 'pop' ? 100000 : 12 * 60; if (!(target >= 1 && target <= max)) return bad(res, 'Mục tiêu cần từ 1 đến ' + max + '.');
    if (reward < 0 || reward > 2000) return bad(res, 'Thưởng mỗi bạn từ 0 đến 2000 xu.');
    if (one("SELECT 1 x FROM city_projects WHERE group_id=? AND status='open'", gid)) return bad(res, 'Lớp này đang có một dự án chưa hoàn thành. Hãy hoàn thành hoặc huỷ trước.');
    const r = db.prepare('INSERT INTO city_projects (group_id,kind,k,target,reward,title,created_by,created_at) VALUES (?,?,?,?,?,?,?,?)').run(gid, kind, k, target, reward, title, req.user.id, now());
    membersOf(gid).forEach((m) => notify(m.id, 'city_project', '🏙️ Dự án mới của lớp trong EWT City', title || KINDS[kind]));
    res.json({ ok: true, id: Number(r.lastInsertRowid) });
  });
  app.get('/api/city/teacher/projects', requireRole('teacher', 'admin'), (req, res) => {
    const gid = Number(req.query.group_id); if (!ownsGroup(req.user, gid)) return bad(res, 'Không tìm thấy lớp của bạn.');
    const rows = db.prepare('SELECT * FROM city_projects WHERE group_id=? ORDER BY id DESC LIMIT 10').all(gid);
    res.json({ projects: rows.map((p) => projView(checkProject(p), 0)) });
  });
  app.post('/api/city/teacher/project/cancel', requireRole('teacher', 'admin'), (req, res) => {
    const p = one('SELECT * FROM city_projects WHERE id=?', Number((req.body || {}).id)); if (!p || p.status !== 'open' || !ownsGroup(req.user, p.group_id)) return bad(res, 'Không tìm thấy dự án đang mở.');
    db.prepare("UPDATE city_projects SET status='cancelled', done_at=? WHERE id=?").run(now(), p.id); res.json({ ok: true });
  });
  app.get('/api/city/teacher/social', requireRole('teacher', 'admin'), (req, res) => {
    const nm = (id) => (userRow(id) || {}).name || '?';
    const notes = db.prepare('SELECT * FROM city_notes ORDER BY id DESC LIMIT 60').all().map((n) => ({ id: n.id, at: n.created_at, from: nm(n.from_uid), to: nm(n.owner_uid), sticker: n.sticker || '', text: n.text || '', hidden: !!n.hidden }));
    const gifts = db.prepare('SELECT * FROM city_gifts ORDER BY id DESC LIMIT 60').all().map((g) => ({ at: g.created_at, from: nm(g.from_uid), to: nm(g.to_uid), item: (C.BY[g.k] || {}).vi || g.k, n: g.n }));
    res.json({ notes, gifts });
  });
  app.post('/api/city/teacher/note/hide', requireRole('teacher', 'admin'), (req, res) => {
    db.prepare('UPDATE city_notes SET hidden=? WHERE id=?').run((req.body || {}).hide ? 1 : 0, Number((req.body || {}).id)); res.json({ ok: true });
  });
};
