'use strict';
// 📅 EWT City — Nhiệm vụ hằng ngày: mỗi ngày 3 nhiệm vụ (+1 nhiệm vụ lễ hội khi có lễ hội), làm đủ cả 3 nhận rương thưởng; chuỗi ngày liên tiếp được thưởng thêm.
// Máy chủ tự theo dõi tiến độ bằng cách "nghe" các thao tác thành công của EWT City (thu thuế, xây, nâng cấp, quiz, học, thăm bạn, tặng quà...),
// nên không cần sửa từng chức năng. Phải được nạp TRƯỚC city.js để lớp lắng nghe đứng trước các đường dẫn /api/city/*.
const crypto = require('crypto');
const C = require('./js/city-data.js');

module.exports = function (app, { db, requireAuth, now }) {
  const K = () => app.locals.city;
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const vnDay = () => process.env.EWT_CITY_DAY || new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const prevDay = (d) => new Date(Date.parse(d + 'T00:00:00Z') - 86400e3).toISOString().slice(0, 10);
  const bad = (res, msg, code) => res.status(code || 400).json({ error: msg });

  db.exec(`CREATE TABLE IF NOT EXISTS city_daily (user_id INTEGER NOT NULL, day TEXT NOT NULL, data TEXT NOT NULL, PRIMARY KEY (user_id, day))`);

  // goal: [cấp thấp, trung bình, cao] theo cấp thành phố; xu: thưởng cho mỗi đơn vị mục tiêu
  const TPL = [
    { k: 'collect', icon: '💰', vi: 'Thu thuế ở {n} công trình', goal: [3, 6, 10], xu: 35 },
    { k: 'build', icon: '🏗️', vi: 'Xây {n} công trình mới', goal: [1, 2, 3], xu: 70 },
    { k: 'upgrade', icon: '⬆️', vi: 'Nâng cấp {n} công trình', goal: [1, 1, 2], xu: 90 },
    { k: 'quiz', icon: '❓', vi: 'Trả lời đúng {n} câu hỏi kiếm xu', goal: [3, 5, 8], xu: 40 },
    { k: 'learn', icon: '🎓', vi: 'Hoàn thành {n} lượt ở Học viện (kiểm tra chương hoặc ghép từ)', goal: [1, 2, 3], xu: 60 },
    { k: 'visit', icon: '👋', vi: 'Ghé thăm {n} thành phố của bạn', goal: [1, 1, 2], xu: 60, social: true },
    { k: 'gift', icon: '🎁', vi: 'Tặng quà cho bạn {n} lần', goal: [1, 1, 1], xu: 80, social: true },
    { k: 'road', icon: '🛣️', vi: 'Xây {n} ô đường', goal: [4, 8, 12], xu: 30 },
    { k: 'decor', icon: '🌳', vi: 'Đặt {n} món trang trí (cây, hoa, ghế, đèn…)', goal: [2, 3, 5], xu: 50 }
  ];
  const TBY = {}; TPL.forEach((t) => { TBY[t.k] = t; });
  const DECOR = ['tree', 'flower', 'bench', 'lamp', 'orna'];
  const BONUS = { xu: 250, perStreak: 40, maxStreak: 7, tickets: 1 };
  const FEST = { k: 'fest', icon: '🎉', vi: 'Đặt {n} món của lễ hội', goal: [1, 1, 2], xu: 150 };

  const rng = (seed) => { let h = parseInt(crypto.createHash('md5').update(seed).digest('hex').slice(0, 8), 16) >>> 0; return () => { h = (Math.imul(h ^ (h >>> 15), 2246822507) + 0x9e3779b9) >>> 0; return ((h ^ (h >>> 13)) >>> 0) / 4294967296; }; };
  const levelOf = (uid) => { try { const st = K().peek(uid); return st ? K().stats(st).level : 1; } catch (_) { return 1; } };
  const tierOf = (lv) => (lv < 6 ? 0 : lv < 14 ? 1 : 2);
  const rewardOf = (m, lv) => Math.min(900, Math.round(m.xu * m.goal * (1 + Math.min(lv, 30) * 0.06)));
  const mk = (t, lv, uid) => { const goal = t.goal[tierOf(lv)]; return { id: t.k, k: t.k, goal, p: 0, xu: t.xu, c: 0 }; };

  function rowOf(uid, day) {
    const r = one('SELECT data FROM city_daily WHERE user_id=? AND day=?', uid, day); let d = r ? J(r.data, null) : null;
    if (!d || !Array.isArray(d.m)) {
      const lv = levelOf(uid), rand = rng(uid + ':' + day), pool = TPL.slice(), pick = [];
      let hasSoc = false;
      while (pick.length < 3 && pool.length) { const t = pool.splice(Math.floor(rand() * pool.length), 1)[0]; if (t.social && hasSoc) continue; if (t.social) hasSoc = true; pick.push(t); }
      d = { m: pick.map((t) => mk(t, lv, uid)), lv, bonus: 0, swap: 0, seen: [] };
      db.prepare('INSERT OR REPLACE INTO city_daily (user_id,day,data) VALUES (?,?,?)').run(uid, day, JSON.stringify(d));
    }
    // nhiệm vụ lễ hội (thêm khi có lễ hội, kể cả khi lễ hội bắt đầu giữa ngày)
    if (C.festivalsOn(day).length && !d.m.some((m) => m.k === 'fest')) { d.m.push({ id: 'fest', k: 'fest', goal: FEST.goal[tierOf(d.lv || 1)], p: 0, xu: FEST.xu, c: 0 }); db.prepare('UPDATE city_daily SET data=? WHERE user_id=? AND day=?').run(JSON.stringify(d), uid, day); }
    return d;
  }
  const saveRow = (uid, day, d) => db.prepare('UPDATE city_daily SET data=? WHERE user_id=? AND day=?').run(JSON.stringify(d), uid, day);
  const tplOf = (k) => (k === 'fest' ? FEST : TBY[k]);
  function streakOf(uid, day) {   // số ngày liên tiếp (tính cả hôm nay nếu đã nhận rương) đã nhận rương thưởng
    let n = 0, d = day; const today = one('SELECT data FROM city_daily WHERE user_id=? AND day=?', uid, day);
    if (today && (J(today.data, {}).bonus || 0)) n++;
    d = prevDay(day);
    for (let i = 0; i < 400; i++) { const r = one('SELECT data FROM city_daily WHERE user_id=? AND day=?', uid, d); if (r && J(r.data, {}).bonus) { n++; d = prevDay(d); } else break; }
    return n;
  }
  function track(uid, kind, n, key) {
    const day = vnDay(), d = rowOf(uid, day); let ch = false;
    if (key) { d.seen = d.seen || []; if (d.seen.indexOf(kind + ':' + key) >= 0) return; d.seen.push(kind + ':' + key); ch = true; }
    d.m.forEach((m) => { if (m.k === kind && m.p < m.goal) { m.p = Math.min(m.goal, m.p + (n || 1)); ch = true; } });
    if (ch) saveRow(uid, day, d);
  }
  function view(uid) {
    const day = vnDay(), d = rowOf(uid, day), lv = levelOf(uid), st = streakOf(uid, day), normal = d.m.filter((m) => m.k !== 'fest'), allClaimed = normal.every((m) => m.c);
    const nextStreak = Math.min(BONUS.maxStreak, (d.bonus ? st : st + 1));
    return {
      day, level: lv, streak: st, bonusDone: !!d.bonus, canBonus: allClaimed && !d.bonus, swapLeft: d.swap ? 0 : 1,
      bonus: { xu: BONUS.xu + nextStreak * BONUS.perStreak, tickets: BONUS.tickets, streakNext: nextStreak },
      fest: C.festivalsOn(day).map((id) => ({ id, name: C.FEST_BY[id].name, icon: C.FEST_BY[id].icon, blurb: C.FEST_BY[id].blurb })),
      missions: d.m.map((m) => { const t = tplOf(m.k); return { id: m.id, k: m.k, icon: t.icon, text: t.vi.replace('{n}', m.goal), p: m.p, goal: m.goal, xu: rewardOf(m, lv), done: m.p >= m.goal, claimed: !!m.c, optional: m.k === 'fest' }; })
    };
  }

  // ── lắng nghe thao tác thành công của EWT City để cộng tiến độ ──
  app.use('/api/city', (req, res, next) => {
    const sub = req.path, method = req.method;
    if (!(method === 'POST' || (method === 'GET' && sub === '/visit'))) return next();
    const j = res.json.bind(res);
    res.json = (body) => {
      try {
        if (res.statusCode < 400 && req.user && body && typeof body === 'object') {
          const uid = req.user.id, b = req.body || {};
          if (sub === '/collect' && body.count > 0) track(uid, 'collect', body.count);
          else if (sub === '/place' && body.placed) { track(uid, 'build', 1); const it = C.BY[String(b.k)]; if (it && DECOR.indexOf(it.cat) >= 0) track(uid, 'decor', 1); if (it && it.ev) track(uid, 'fest', 1); }
          else if (sub === '/upgrade' && body.upgraded) track(uid, 'upgrade', 1);
          else if (sub === '/road' && body.roads > 0) track(uid, 'road', body.roads);
          else if (sub === '/quiz/answer' && body.correct) track(uid, 'quiz', 1);
          else if (sub === '/learn/submit' && body.pass) track(uid, 'learn', 1);
          else if (sub === '/learn/match/done' && !body.error) track(uid, 'learn', 1);
          else if (sub === '/visit' && body.owner && !body.owner.me && (body.owner.token || body.owner.uid)) track(uid, 'visit', 1, body.owner.token || body.owner.uid);
          else if (sub === '/visit/note' && body.ok) track(uid, 'visit', 1, String(b.token || ''));
          else if ((sub === '/gift/xu' || sub === '/gift/item') && body.ok) track(uid, 'gift', 1);
        }
      } catch (e) { console.error('[city-daily]', e.message); }
      return j(body);
    };
    next();
  });

  app.get('/api/city/daily', requireAuth, (req, res) => res.json(view(req.user.id)));
  app.post('/api/city/daily/claim', requireAuth, (req, res) => {
    const uid = req.user.id, day = vnDay(), id = String((req.body || {}).id || '');
    const out = K().tx(() => {
      const d = rowOf(uid, day), m = d.m.find((x) => x.id === id); if (!m) return { err: 'Không tìm thấy nhiệm vụ này.' };
      if (m.p < m.goal) return { err: 'Nhiệm vụ này chưa hoàn thành.' }; if (m.c) return { err: 'Bạn đã nhận thưởng nhiệm vụ này rồi.' };
      const xu = rewardOf(m, d.lv || 1); m.c = 1; saveRow(uid, day, d); K().addCoins(uid, xu); return { xu };
    });
    if (out.err) return bad(res, out.err);
    res.json({ ok: true, xu: out.xu, daily: view(uid) });
  });
  app.post('/api/city/daily/bonus', requireAuth, (req, res) => {
    const uid = req.user.id, day = vnDay();
    const out = K().tx(() => {
      const d = rowOf(uid, day); if (d.bonus) return { err: 'Hôm nay bạn đã mở rương rồi.' };
      if (!d.m.filter((m) => m.k !== 'fest').every((m) => m.c)) return { err: 'Hãy hoàn thành và nhận thưởng cả 3 nhiệm vụ trước nhé.' };
      const prev = streakOf(uid, day), s = Math.min(BONUS.maxStreak, prev + 1), xu = BONUS.xu + s * BONUS.perStreak;
      d.bonus = 1; saveRow(uid, day, d); K().addCoins(uid, xu);
      const st = K().load(uid); st.tickets = (st.tickets | 0) + BONUS.tickets; K().save(uid, st);
      return { xu, streak: prev + 1 };
    });
    if (out.err) return bad(res, out.err);
    res.json({ ok: true, xu: out.xu, tickets: BONUS.tickets, streak: out.streak, daily: view(uid) });
  });
  // đổi một nhiệm vụ chưa làm sang nhiệm vụ khác (1 lần/ngày) — phòng khi cần bạn bè mà chưa có bạn
  app.post('/api/city/daily/swap', requireAuth, (req, res) => {
    const uid = req.user.id, day = vnDay(), id = String((req.body || {}).id || '');
    const out = K().tx(() => {
      const d = rowOf(uid, day); if (d.swap) return { err: 'Hôm nay bạn đã đổi nhiệm vụ rồi.' };
      const i = d.m.findIndex((x) => x.id === id && x.k !== 'fest'); if (i < 0) return { err: 'Không tìm thấy nhiệm vụ này.' };
      const m = d.m[i]; if (m.p > 0 || m.c) return { err: 'Chỉ đổi được nhiệm vụ chưa bắt đầu.' };
      const have = d.m.map((x) => x.k), rest = TPL.filter((t) => have.indexOf(t.k) < 0 && !t.social); if (!rest.length) return { err: 'Không còn nhiệm vụ khác để đổi.' };
      const t = rest[Math.floor(Math.random() * rest.length)]; d.m[i] = mk(t, d.lv || 1, uid); d.swap = 1; saveRow(uid, day, d); return {};
    });
    if (out.err) return bad(res, out.err);
    res.json({ ok: true, daily: view(uid) });
  });
  app.locals.cityDaily = { track, view };
};
