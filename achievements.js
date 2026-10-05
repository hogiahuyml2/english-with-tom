'use strict';
// 🏅 Thành tích: tính từ dữ liệu học thật của học sinh (không cần học sinh "bấm nhận"). Mở khoá bậc nào → nhận xu 🪙 + (có thể) món cho nhân vật.
const BD = require('./js/badges.js');
const AV = require('./js/avatar.js');

module.exports = function (app, { db, requireAuth, now }) {
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const dlMs = (s) => { if (!s) return 0; const t = Date.parse(/[+-]\d{2}:?\d{2}$|Z$/i.test(s) ? s : (/^\d{4}-\d{2}-\d{2}$/.test(String(s)) ? s + 'T23:59:59' : String(s).replace(' ', 'T')) + '+07:00'); return isNaN(t) ? 0 : t; };
  const one = (sql, ...a) => db.prepare(sql).get(...a);

  function metrics(uid, email) {
    const g = one('SELECT xp, best_streak, total_reviews FROM word_game WHERE user_id=?', uid) || { xp: 0, best_streak: 0, total_reviews: 0 };
    const graded = db.prepare(`SELECT s.score, s.max_score FROM submissions s WHERE s.user_id=? AND s.status='graded' AND s.max_score>0 AND s.score IS NOT NULL
      AND s.id=(SELECT MAX(x.id) FROM submissions x WHERE x.user_id=s.user_id AND x.exercise_id=s.exercise_id AND x.status='graded')`).all(uid);
    let ontime = 0;
    for (const r of db.prepare(`SELECT a.deadline, MIN(s.submitted_at) AS t FROM assignments a JOIN submissions s ON s.user_id=? AND s.exercise_id=a.exercise_id
      WHERE a.student_email=? AND a.deadline IS NOT NULL GROUP BY a.id`).all(uid, email)) { const d = dlMs(r.deadline); if (d && Date.parse(r.t) <= d + 60000) ontime++; }
    return {
      best_streak: g.best_streak || 0,
      words_learned: one('SELECT COUNT(*) AS c FROM word_progress WHERE user_id=? AND box>=3', uid).c,
      total_reviews: g.total_reviews || 0,
      dictation_runs: one("SELECT COUNT(*) AS c FROM dictation_runs WHERE user_id=? AND mode='dictate' AND finished_at IS NOT NULL", uid).c,
      dictation_perfect: one('SELECT COUNT(*) AS c FROM dictation_seen WHERE user_id=? AND best=100', uid).c,
      exercises_done: one('SELECT COUNT(DISTINCT exercise_id) AS c FROM submissions WHERE user_id=?', uid).c,
      ontime,
      high_scores: graded.filter((r) => r.score / r.max_score >= 0.8).length,
      perfect_scores: graded.filter((r) => r.score >= r.max_score).length,
      mistakes_fixed: one("SELECT COUNT(*) AS c FROM notebook_state WHERE user_id=? AND status='mastered'", uid).c,
      plan_days: one('SELECT COUNT(*) AS c FROM today_plan WHERE user_id=? AND done_all=1', uid).c,
      speaking_done: one("SELECT COUNT(*) AS c FROM speaking_sessions WHERE user_id=? AND status='done'", uid).c,
      placement_done: one("SELECT COUNT(*) AS c FROM placement_attempts WHERE user_id=? AND status='done' AND voided=0", uid).c,
      arcade_plays: (one('SELECT SUM(plays) AS c FROM arcade_stats WHERE user_id=?', uid) || {}).c || 0,
      level: Math.floor(Math.sqrt((g.xp || 0) / 40)) + 1,
      has_avatar: one('SELECT 1 AS c FROM users WHERE id=? AND avatar IS NOT NULL', uid) ? 1 : 0,
      in_class: one('SELECT 1 AS c FROM group_members WHERE user_id=? LIMIT 1', uid) ? 1 : 0,
    };
  }

  // Tính lại, mở khoá bậc mới (kèm thưởng) → trả danh sách bậc vừa mở
  function evaluate(user) {
    const m = metrics(user.id, user.email), have = new Set(db.prepare('SELECT key,tier FROM achievements WHERE user_id=?').all(user.id).map((r) => r.key + ':' + r.tier));
    const fresh = [];
    for (const a of BD.LIST) {
      const v = m[a.metric] || 0;
      a.tiers.forEach((need, i) => {
        if (v < need || have.has(a.id + ':' + (i + 1))) return;
        try {
          db.exec('BEGIN');
          const ins = db.prepare('INSERT OR IGNORE INTO achievements (user_id,key,tier,unlocked_at,seen) VALUES (?,?,?,?,0)').run(user.id, a.id, i + 1, now());
          if (ins.changes) {
            const rw = a.rw[i] || {};
            if (rw.coins) { db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(user.id); db.prepare('UPDATE word_game SET coins=coins+? WHERE user_id=?').run(rw.coins, user.id); }
            if (rw.item && AV.priceOfKey(rw.item)) db.prepare('INSERT OR IGNORE INTO word_inventory (user_id,item_id,acquired_at) VALUES (?,?,?)').run(user.id, 'ac_' + rw.item, now());
            fresh.push({ id: a.id, tier: i + 1 });
          }
          db.exec('COMMIT');
        } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} console.error('[achievements]', e.message); }
      });
    }
    return { metrics: m, fresh };
  }
  const itemName = (key) => { const p = AV.priceOfKey(key); return p ? p.name : null; };

  app.get('/api/achievements', requireAuth, (req, res) => {
    if (req.user.role !== 'student') return res.json({ items: [], summary: { got: 0, total: 0 }, coins: 0 });
    const { metrics: m, fresh } = evaluate(req.user);
    const rows = db.prepare('SELECT key,tier,unlocked_at,seen FROM achievements WHERE user_id=?').all(req.user.id), by = new Map();
    for (const r of rows) { const o = by.get(r.key) || { tiers: {}, unseen: 0 }; o.tiers[r.tier] = r.unlocked_at; if (!r.seen) o.unseen++; by.set(r.key, o); }
    let got = 0, total = 0;
    const items = BD.LIST.map((a) => {
      const o = by.get(a.id) || { tiers: {}, unseen: 0 }, v = m[a.metric] || 0, n = a.tiers.length; let tier = 0;
      a.tiers.forEach((need, i) => { total++; if (o.tiers[i + 1]) { tier = i + 1; got++; } });
      return { id: a.id, value: v, tier, unseen: o.unseen, tiers: a.tiers.map((need, i) => ({ need, text: BD.textOf(a, i), at: o.tiers[i + 1] || null, reward: { coins: (a.rw[i] || {}).coins || 0, item: (a.rw[i] || {}).item || null, item_name: (a.rw[i] || {}).item ? itemName(a.rw[i].item) : null } })), next: tier < n ? a.tiers[tier] : null };
    });
    const g = one('SELECT coins FROM word_game WHERE user_id=?', req.user.id);
    res.json({ items, summary: { got, total }, coins: g ? g.coins : 0, fresh });
  });

  // Các bậc vừa mở khoá mà học sinh chưa được báo (để hiện thông báo ăn mừng)
  app.get('/api/achievements/new', requireAuth, (req, res) => {
    if (req.user.role !== 'student') return res.json({ items: [] });
    evaluate(req.user);
    const rows = db.prepare('SELECT key,tier FROM achievements WHERE user_id=? AND seen=0 ORDER BY unlocked_at').all(req.user.id);
    res.json({ items: rows.map((r) => { const a = BD.find(r.key); if (!a) return null; const rw = a.rw[r.tier - 1] || {}; return { id: a.id, name: a.name, icon: a.icon, tier: r.tier, tiers: a.tiers.length, text: BD.textOf(a, r.tier - 1), coins: rw.coins || 0, item: rw.item ? itemName(rw.item) : null }; }).filter(Boolean) });
  });
  app.post('/api/achievements/seen', requireAuth, (req, res) => { db.prepare('UPDATE achievements SET seen=1 WHERE user_id=?').run(req.user.id); res.json({ ok: true }); });
};
