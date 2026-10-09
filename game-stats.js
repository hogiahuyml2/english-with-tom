'use strict';
// 📊 Thống kê EWT Garden & EWT City cho giáo viên: ai đang chơi, ai chưa vào, cấp độ, mức độ hoạt động theo lớp.
// Chỉ ĐỌC dữ liệu (không tạo vườn / thành phố mới). Giáo viên thấy học sinh trong các lớp mình dạy; quản trị thấy tất cả lớp.
const C = require('./js/city-data.js');

module.exports = function (app, { db, requireRole }) {
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const all = (sql, ...a) => db.prepare(sql).all(...a);
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const vnDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  const dayAgo = (n) => new Date(Date.now() + 7 * 3600e3 - n * 86400e3).toISOString().slice(0, 10);
  const daysSince = (iso) => { if (!iso) return null; const t = Date.parse(iso); return Number.isFinite(t) ? Math.max(0, Math.floor((Date.now() - t) / 86400e3)) : null; };
  const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length * 10) / 10 : 0);

  const myGroups = (u) => (u.role === 'admin' ? all('SELECT id, name FROM groups ORDER BY name') : all('SELECT id, name FROM groups WHERE teacher_id=? ORDER BY name', u.id));

  app.get('/api/teacher/game-stats', requireRole('teacher', 'admin'), (req, res) => {
    const groups = myGroups(req.user), gq = String(req.query.group || 'all'), gids = gq === 'all' ? groups.map((g) => g.id) : groups.filter((g) => String(g.id) === gq).map((g) => g.id);
    if (gq !== 'all' && !gids.length) return res.status(404).json({ error: 'Không tìm thấy lớp của bạn.' });
    const ph = gids.map(() => '?').join(',');
    const studs = gids.length ? all(`SELECT u.id, u.name, u.email, GROUP_CONCAT(DISTINCT g.name) AS classes FROM group_members gm JOIN users u ON u.id=gm.user_id JOIN groups g ON g.id=gm.group_id WHERE gm.group_id IN (${ph}) AND u.role='student' GROUP BY u.id ORDER BY u.name`, ...gids) : [];
    const d7 = dayAgo(6), d30 = dayAgo(29), K = app.locals.city, GS = app.locals.gardenStat;
    const rows = studs.map((u) => {
      const coins = (one('SELECT coins FROM word_game WHERE user_id=?', u.id) || {}).coins | 0;
      let g = null, c = null;
      try { g = GS ? GS(u.id) : null; } catch (_) { g = null; }
      try {
        const st = K ? K.peek(u.id) : null;
        if (st) {
          const s = K.stats(st), r = one('SELECT updated_at FROM city WHERE user_id=?', u.id) || {};
          const dd = all('SELECT day, data FROM city_daily WHERE user_id=? AND day>=?', u.id, d30).map((x) => ({ day: x.day, d: J(x.data, {}) }));
          const played = (x) => (x.d.m || []).some((m) => m.p > 0) || x.d.bonus;
          c = { level: s.level, pop: s.pop, happy: s.happy, bs: st.bs.filter((b) => b.lv > 0).length, districts: st.districts.length, last: r.updated_at || null,
            days7: dd.filter((x) => x.day >= d7 && played(x)).length, days30: dd.filter(played).length, chests: dd.filter((x) => x.d.bonus).length, done: dd.reduce((a, x) => a + (x.d.m || []).filter((m) => m.c).length, 0) };
        }
      } catch (_) { c = null; }
      const last = [g && g.updated, c && c.last].filter(Boolean).sort().pop() || null, ds = daysSince(last);
      const state = !g && !c ? 'never' : ds <= 3 ? 'active' : ds <= 14 ? 'slow' : 'idle';
      return { id: u.id, name: u.name, email: u.email, classes: u.classes || '', coins, g: g && { level: g.level, beauty: g.beauty, tiles: g.tiles, pets: g.pets, zones: g.zones, quiz: g.quizTotal, last: g.updated, ago: daysSince(g.updated) }, c: c && Object.assign(c, { ago: daysSince(c.last) }), last, ago: ds, state };
    });
    const gs = rows.filter((r) => r.g), cs = rows.filter((r) => r.c);
    const summary = {
      students: rows.length, gardenPlayers: gs.length, cityPlayers: cs.length, both: rows.filter((r) => r.g && r.c).length, never: rows.filter((r) => r.state === 'never').length,
      active: rows.filter((r) => r.state === 'active').length, slow: rows.filter((r) => r.state === 'slow').length, idle: rows.filter((r) => r.state === 'idle').length,
      gardenAvgLevel: avg(gs.map((r) => r.g.level)), cityAvgLevel: avg(cs.map((r) => r.c.level)), cityAvgPop: Math.round(avg(cs.map((r) => r.c.pop))),
      gardenActive7: gs.filter((r) => r.g.ago != null && r.g.ago <= 6).length, cityActive7: cs.filter((r) => r.c.days7 > 0 || (r.c.ago != null && r.c.ago <= 6)).length,
      cityDays7: cs.reduce((a, r) => a + r.c.days7, 0), chests7: cs.length ? cs.reduce((a, r) => a + r.c.chests, 0) : 0,
      topGarden: gs.slice().sort((a, b) => b.g.beauty - a.g.beauty).slice(0, 5).map((r) => ({ name: r.name, v: r.g.level })),
      topCity: cs.slice().sort((a, b) => b.c.level - a.c.level || b.c.pop - a.c.pop).slice(0, 5).map((r) => ({ name: r.name, v: r.c.level }))
    };
    res.json({ groups, rows, summary, day: vnDay(), festivals: C.festivalsOn(vnDay()) });
  });
};
