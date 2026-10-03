// Góc Từ Vựng — backend: kho từ, ôn tập ngắt quãng (SRS), XP/cấp độ/xu, chuỗi ngày,
// nhiệm vụ ngày, huy hiệu, bảng xếp hạng. Mọi phần thưởng do SERVER tính (client chỉ
// báo kết quả từng câu) để học sinh không tự cộng điểm bằng cách sửa request.
const { SEED_WORDS, parseSeed } = require('./vocab-seed');

const LEVELS = ['KET', 'PET', 'FCE', 'IELTS'];
const MODES = ['flash', 'blitz', 'type', 'situation', 'smart'];
// Khoảng cách ôn lại (ngày) theo "hộp" 0..5 — đúng với phương pháp Leitner/lặp lại ngắt quãng
const INTERVALS = [0, 1, 3, 7, 14, 30];
const DAILY_GOAL = 20;     // mục tiêu: ôn 20 lượt từ/ngày
const STREAK_MIN = 5;      // chỉ cần 5 lượt là giữ được chuỗi 🔥
const FREEZE_PRICE = 100;  // xu đổi 1 "khiên giữ chuỗi" 🧊
const MAX_FREEZES = 2;
// XP cho mỗi câu đúng theo chế độ (chế độ khó hơn/đòi hỏi nhớ chủ động thì thưởng nhiều hơn; Blitz nhanh nên ít hơn để không "lạm phát")
const XP_BASE = { flash: 2, blitz: 3, smart: 5, situation: 5, type: 6 };
const MAX_RESULTS = 60;    // tối đa số câu báo lên mỗi phiên
const DAILY_HITS_CAP = 3;  // 1 từ chỉ được cộng XP tối đa 3 lần đúng/ngày (chống cày 1 từ)

// ── Ngày theo giờ Việt Nam (UTC+7), dạng YYYY-MM-DD ──
function vnDay(offset) {
  return new Date(Date.now() + 7 * 3600 * 1000 + (offset || 0) * 86400000).toISOString().slice(0, 10);
}
function dayNum(day) { return Math.floor(Date.parse(day + 'T00:00:00Z') / 86400000); }
function addDays(day, n) { return new Date((dayNum(day) + n) * 86400000).toISOString().slice(0, 10); }
function dayDiff(a, b) { return dayNum(b) - dayNum(a); }

function levelOf(xp) {
  const L = Math.floor(Math.sqrt(xp / 40)) + 1;
  return { level: L, floor: 40 * (L - 1) * (L - 1), next: 40 * L * L };
}

// ── Nhiệm vụ ngày (mỗi ngày 3 nhiệm vụ: luôn có "Học hôm nay" + 2 nhiệm vụ ngẫu nhiên theo ngày) ──
const QUESTS = [
  { id: 'smart1',     icon: '🎯', text: 'Hoàn thành 1 phiên "Học hôm nay"', goal: 1,  reward: 15, get: (d, m) => (m.smart && m.smart.s) || 0 },
  { id: 'review20',   icon: '🔁', text: 'Ôn 20 lượt từ',                    goal: 20, reward: 15, get: (d) => d.reviews },
  { id: 'new5',       icon: '🌱', text: 'Gặp 5 từ mới',                     goal: 5,  reward: 15, get: (d) => d.new_words },
  { id: 'combo8',     icon: '🔥', text: 'Đạt chuỗi 8 câu đúng liên tiếp',   goal: 8,  reward: 20, get: (d) => d.best_combo },
  { id: 'blitz1',     icon: '⚡', text: 'Chơi xong 1 ván Blitz',            goal: 1,  reward: 10, get: (d, m) => (m.blitz && m.blitz.s) || 0 },
  { id: 'type8',      icon: '⌨️', text: 'Gõ đúng 8 từ',                     goal: 8,  reward: 15, get: (d, m) => (m.type && m.type.ok) || 0 },
  { id: 'situation8', icon: '🎭', text: 'Điền đúng 8 câu tình huống',       goal: 8,  reward: 15, get: (d, m) => (m.situation && m.situation.ok) || 0 },
];

function questsFor(uid, day) {
  const rest = QUESTS.filter(q => q.id !== 'smart1');
  let seed = (uid * 7919 + dayNum(day) * 104729) >>> 0;
  const rnd = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  const pool = rest.slice();
  const pick = [QUESTS[0]];
  while (pick.length < 3 && pool.length) pick.push(pool.splice(Math.floor(rnd() * pool.length), 1)[0]);
  return pick;
}

// ── Huy hiệu ──
const BADGES = [
  { id: 'first',    icon: '🌱', name: 'Bước đầu tiên',     text: 'Hoàn thành phiên học đầu tiên',   goal: 1,    have: s => s.sessions },
  { id: 'learn10',  icon: '📗', name: '10 từ đã thuộc',    text: 'Thuộc 10 từ (hộp 3 trở lên)',      goal: 10,   have: s => s.learned },
  { id: 'learn50',  icon: '📘', name: '50 từ đã thuộc',    text: 'Thuộc 50 từ',                      goal: 50,   have: s => s.learned },
  { id: 'learn100', icon: '📙', name: '100 từ đã thuộc',   text: 'Thuộc 100 từ',                     goal: 100,  have: s => s.learned },
  { id: 'learn300', icon: '🎓', name: 'Kho từ vựng khủng', text: 'Thuộc 300 từ',                     goal: 300,  have: s => s.learned },
  { id: 'streak3',  icon: '🔥', name: 'Lửa nhỏ',           text: 'Học 3 ngày liên tiếp',             goal: 3,    have: s => s.best_streak },
  { id: 'streak7',  icon: '📅', name: 'Lửa bền',           text: 'Học 7 ngày liên tiếp',             goal: 7,    have: s => s.best_streak },
  { id: 'streak30', icon: '🌟', name: 'Không bỏ ngày nào', text: 'Học 30 ngày liên tiếp',            goal: 30,   have: s => s.best_streak },
  { id: 'combo10',  icon: '⚡', name: 'Liên hoàn',         text: '10 câu đúng liên tiếp',            goal: 10,   have: s => s.best_combo },
  { id: 'sess20',   icon: '🏃', name: 'Chăm chỉ',          text: 'Hoàn thành 20 phiên học',          goal: 20,   have: s => s.sessions },
  { id: 'quest10',  icon: '📋', name: 'Thợ săn nhiệm vụ',  text: 'Nhận thưởng 10 nhiệm vụ ngày',     goal: 10,   have: s => s.quests_done },
  { id: 'xp1000',   icon: '💎', name: '1000 XP',           text: 'Đạt 1000 điểm kinh nghiệm',        goal: 1000, have: s => s.xp },
];

module.exports = function registerWordGame(app, { db, requireAuth, requireRole, now }) {
  // ───────────── Kho từ (cache RAM — học sinh đọc kho từ không đụng đĩa) ─────────────
  let bank = { list: [], byId: new Map() };

  function loadBank() {
    const rows = db.prepare('SELECT id,level,topic,word,pos,meaning_vi,example_en,example_vi FROM vocab_words ORDER BY id').all();
    const list = rows.map(r => ({
      id: Number(r.id), level: r.level, topic: r.topic, word: r.word, pos: r.pos || '',
      vi: r.meaning_vi, ex: r.example_en || '', exVi: r.example_vi || ''
    }));
    bank = { list, byId: new Map(list.map(w => [w.id, w])) };
  }

  function seedBank() {
    try {
      const ins = db.prepare(
        'INSERT OR IGNORE INTO vocab_words (level,topic,word,pos,meaning_vi,example_en,example_vi,created_at) VALUES (?,?,?,?,?,?,?,?)'
      );
      db.exec('BEGIN');
      let n = 0;
      for (const w of SEED_WORDS) n += Number(ins.run(w.level, w.topic, w.word, w.pos, w.vi, w.ex, w.exVi, now()).changes || 0);
      db.exec('COMMIT');
      if (n) console.log('[wordgame] Đã nạp ' + n + ' từ khởi đầu.');
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame] seed lỗi:', e.message);
    }
  }

  try { seedBank(); loadBank(); console.log('[wordgame] Kho từ: ' + bank.list.length + ' từ.'); }
  catch (e) { console.error('[wordgame] Khởi tạo lỗi:', e.message); }

  // ───────────── Trạng thái người chơi ─────────────
  function ensureGame(uid) {
    db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(uid);
    return db.prepare('SELECT * FROM word_game WHERE user_id=?').get(uid);
  }
  function dailyRow(uid, day) {
    return db.prepare('SELECT * FROM word_daily WHERE user_id=? AND day=?').get(uid, day)
      || { user_id: uid, day, xp: 0, reviews: 0, new_words: 0, correct: 0, sessions: 0, modes: '{}', best_combo: 0, claimed: '' };
  }
  function parseModes(s) { try { return JSON.parse(s || '{}') || {}; } catch (e) { return {}; } }
  function learnedCount(uid) {
    return Number(db.prepare('SELECT COUNT(*) c FROM word_progress WHERE user_id=? AND box>=3').get(uid).c);
  }

  // Chuỗi hiển thị: còn "sống" nếu hôm nay/hôm qua đã học (hoặc còn khiên cứu được 1 ngày)
  function liveStreak(g, today) {
    if (!g.last_day) return 0;
    const gap = dayDiff(g.last_day, today);
    if (gap <= 1) return g.streak;
    if (gap === 2 && g.freezes > 0) return g.streak;
    return 0;
  }

  function badgeStats(uid, g) {
    return { xp: g.xp, sessions: g.sessions, best_combo: g.best_combo, best_streak: g.best_streak, quests_done: g.quests_done, learned: learnedCount(uid) };
  }

  function statePayload(uid, userName) {
    const today = vnDay();
    const g = ensureGame(uid);
    const d = dailyRow(uid, today);
    const m = parseModes(d.modes);
    const claimed = new Set(String(d.claimed || '').split(',').filter(Boolean));
    const lv = levelOf(g.xp);
    const stats = badgeStats(uid, g);
    const got = new Set(db.prepare('SELECT badge_id FROM word_badges WHERE user_id=?').all(uid).map(r => r.badge_id));
    const prog = {};
    for (const r of db.prepare('SELECT word_id,box,due_day,correct,wrong FROM word_progress WHERE user_id=?').all(uid)) {
      prog[r.word_id] = [r.box, r.due_day || '', r.correct, r.wrong];
    }
    return {
      name: userName || '',
      today,
      xp: g.xp, level: lv.level, xpFloor: lv.floor, xpNext: lv.next,
      coins: g.coins, streak: liveStreak(g, today), bestStreak: g.best_streak,
      freezes: g.freezes, freezePrice: FREEZE_PRICE, maxFreezes: MAX_FREEZES,
      doneToday: g.last_day === today,
      today_stats: { reviews: d.reviews, newWords: d.new_words, xp: d.xp, goal: DAILY_GOAL, streakMin: STREAK_MIN },
      quests: questsFor(uid, today).map(q => {
        const n = Math.min(q.goal, Number(q.get(d, m)) || 0);
        return { id: q.id, icon: q.icon, text: q.text, goal: q.goal, reward: q.reward, n, done: n >= q.goal, claimed: claimed.has(q.id) };
      }),
      badges: BADGES.map(b => ({ id: b.id, icon: b.icon, name: b.name, text: b.text, goal: b.goal, have: Math.min(b.goal, b.have(stats)), got: got.has(b.id) })),
      learned: stats.learned,
      total: bank.list.length,
      progress: prog,
    };
  }

  function awardBadges(uid, g) {
    const stats = badgeStats(uid, g);
    const got = new Set(db.prepare('SELECT badge_id FROM word_badges WHERE user_id=?').all(uid).map(r => r.badge_id));
    const fresh = [];
    for (const b of BADGES) {
      if (!got.has(b.id) && b.have(stats) >= b.goal) {
        db.prepare('INSERT OR IGNORE INTO word_badges (user_id,badge_id,earned_at) VALUES (?,?,?)').run(uid, b.id, now());
        fresh.push({ id: b.id, icon: b.icon, name: b.name, text: b.text });
      }
    }
    return fresh;
  }

  // ───────────── API ─────────────
  app.get('/api/words', requireAuth, (req, res) => {
    res.json({ words: bank.list, levels: LEVELS });
  });

  app.get('/api/word-game/me', requireAuth, (req, res) => {
    try { res.json(statePayload(req.user.id, req.user.name)); }
    catch (e) { console.error('[wordgame/me]', e.message); res.status(500).json({ error: 'Không tải được tiến độ học.' }); }
  });

  // Báo kết quả 1 phiên chơi → server cập nhật SRS, XP, xu, chuỗi ngày, nhiệm vụ, huy hiệu
  app.post('/api/word-game/session', requireAuth, (req, res) => {
    const uid = req.user.id;
    const body = req.body || {};
    const mode = MODES.includes(body.mode) ? body.mode : null;
    let results = Array.isArray(body.results) ? body.results.slice(0, MAX_RESULTS) : [];
    results = results.filter(r => r && Number.isInteger(r.id) && bank.byId.has(r.id));
    if (!mode || !results.length) return res.status(400).json({ error: 'Dữ liệu phiên chơi không hợp lệ.' });

    const day = vnDay();
    try {
      db.exec('BEGIN');
      const g = ensureGame(uid);
      const getP = db.prepare('SELECT * FROM word_progress WHERE user_id=? AND word_id=?');
      const putP = db.prepare(`
        INSERT INTO word_progress (user_id,word_id,box,correct,wrong,last_seen,due_day,hit_day,hit_n)
        VALUES (?,?,?,?,?,?,?,?,?)
        ON CONFLICT(user_id,word_id) DO UPDATE SET
          box=excluded.box, correct=excluded.correct, wrong=excluded.wrong,
          last_seen=excluded.last_seen, due_day=excluded.due_day, hit_day=excluded.hit_day, hit_n=excluded.hit_n`);

      let xp = 0, okN = 0, newN = 0, combo = 0, bestCombo = 0;
      for (const r of results) {
        const p = getP.get(uid, r.id) || { box: 0, correct: 0, wrong: 0, hit_day: null, hit_n: 0 };
        const ok = !!r.ok;
        const isNew = (p.correct + p.wrong) === 0;
        let hitN = p.hit_day === day ? p.hit_n : 0;
        let box = p.box;
        if (isNew) newN++;
        if (ok) {
          okN++; combo++; bestCombo = Math.max(bestCombo, combo);
          if (hitN < DAILY_HITS_CAP) { xp += XP_BASE[mode] + (isNew ? (mode === 'flash' ? 2 : 5) : 0); hitN++; }
          // Tự đánh giá (flashcard) chỉ đưa từ lên tối đa hộp 2; muốn "thuộc" phải qua các game có chấm đúng/sai
          box = mode === 'flash' ? (box < 2 ? box + 1 : box) : Math.min(5, box + 1);
        } else {
          combo = 0;
          box = Math.max(0, box - 2);
        }
        const due = ok ? addDays(day, INTERVALS[box]) : day;
        putP.run(uid, r.id, box, p.correct + (ok ? 1 : 0), p.wrong + (ok ? 0 : 1), now(), due, day, hitN);
      }

      const total = results.length;
      let comboBonus = 0, accBonus = 0;
      if (bestCombo >= 10) comboBonus = 10;
      if (total >= 5 && okN / total >= 0.8) accBonus = 10;
      xp += comboBonus + accBonus;

      // Cập nhật bản ghi ngày
      const d = dailyRow(uid, day);
      const m = parseModes(d.modes);
      const cur = m[mode] || { n: 0, ok: 0, s: 0 };
      cur.n += total; cur.ok += okN; cur.s += 1;
      m[mode] = cur;
      const nd = {
        xp: d.xp + xp, reviews: d.reviews + total, new_words: d.new_words + newN,
        correct: d.correct + okN, sessions: d.sessions + 1,
        best_combo: Math.max(d.best_combo, bestCombo)
      };
      db.prepare(`
        INSERT INTO word_daily (user_id,day,xp,reviews,new_words,correct,sessions,modes,best_combo,claimed)
        VALUES (?,?,?,?,?,?,?,?,?,?)
        ON CONFLICT(user_id,day) DO UPDATE SET
          xp=excluded.xp, reviews=excluded.reviews, new_words=excluded.new_words, correct=excluded.correct,
          sessions=excluded.sessions, modes=excluded.modes, best_combo=excluded.best_combo`)
        .run(uid, day, nd.xp, nd.reviews, nd.new_words, nd.correct, nd.sessions, JSON.stringify(m), nd.best_combo, d.claimed || '');

      // Chuỗi ngày 🔥 — tính khi tổng lượt ôn trong ngày đạt mức tối thiểu
      let streak = g.streak, bestStreak = g.best_streak, lastDay = g.last_day, freezes = g.freezes;
      let streakUp = false, usedFreeze = false, streakBonus = 0;
      if (nd.reviews >= STREAK_MIN && g.last_day !== day) {
        if (!g.last_day) streak = 1;
        else {
          const gap = dayDiff(g.last_day, day);
          if (gap === 1) streak = g.streak + 1;
          else if (gap === 2 && g.freezes > 0) { streak = g.streak + 1; freezes = g.freezes - 1; usedFreeze = true; }
          else streak = 1;
        }
        lastDay = day; streakUp = true;
        bestStreak = Math.max(bestStreak, streak);
        streakBonus = Math.min(streak, 10) * 2;
      }

      const coinGain = Math.floor(xp / 5) + streakBonus;
      db.prepare(`UPDATE word_game SET xp=xp+?, coins=coins+?, streak=?, best_streak=?, last_day=?, freezes=?,
                  total_reviews=total_reviews+?, sessions=sessions+1, best_combo=MAX(best_combo,?) WHERE user_id=?`)
        .run(xp, coinGain, streak, bestStreak, lastDay, freezes, total, bestCombo, uid);

      const g2 = db.prepare('SELECT * FROM word_game WHERE user_id=?').get(uid);
      const newBadges = awardBadges(uid, g2);
      db.exec('COMMIT');

      res.json({
        gained: { xp, coins: coinGain, total, correct: okN, newWords: newN, bestCombo, comboBonus, accBonus, streakUp, usedFreeze, streakBonus, streak },
        newBadges,
        me: statePayload(uid, req.user.name)
      });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/session]', e.message);
      res.status(500).json({ error: 'Không lưu được kết quả phiên học.' });
    }
  });

  // Nhận thưởng nhiệm vụ ngày
  app.post('/api/word-game/quest/claim', requireAuth, (req, res) => {
    const uid = req.user.id;
    const id = String((req.body || {}).id || '');
    const day = vnDay();
    try {
      const q = questsFor(uid, day).find(x => x.id === id);
      if (!q) return res.status(400).json({ error: 'Nhiệm vụ không tồn tại hôm nay.' });
      db.exec('BEGIN');
      ensureGame(uid);
      const d = dailyRow(uid, day);
      const claimed = String(d.claimed || '').split(',').filter(Boolean);
      if (claimed.includes(id)) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Bạn đã nhận thưởng nhiệm vụ này rồi.' }); }
      if ((Number(q.get(d, parseModes(d.modes))) || 0) < q.goal) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Chưa hoàn thành nhiệm vụ.' }); }
      claimed.push(id);
      db.prepare(`INSERT INTO word_daily (user_id,day,claimed) VALUES (?,?,?)
                  ON CONFLICT(user_id,day) DO UPDATE SET claimed=excluded.claimed`).run(uid, day, claimed.join(','));
      db.prepare('UPDATE word_game SET coins=coins+?, quests_done=quests_done+1 WHERE user_id=?').run(q.reward, uid);
      const newBadges = awardBadges(uid, db.prepare('SELECT * FROM word_game WHERE user_id=?').get(uid));
      db.exec('COMMIT');
      res.json({ ok: true, reward: q.reward, newBadges, me: statePayload(uid, req.user.name) });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/claim]', e.message);
      res.status(500).json({ error: 'Không nhận được thưởng.' });
    }
  });

  // Đổi xu lấy "khiên giữ chuỗi" 🧊 (cứu chuỗi khi lỡ nghỉ đúng 1 ngày)
  app.post('/api/word-game/shop/buy', requireAuth, (req, res) => {
    const uid = req.user.id;
    try {
      db.exec('BEGIN');
      const g = ensureGame(uid);
      if (g.freezes >= MAX_FREEZES) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Bạn đang giữ tối đa ' + MAX_FREEZES + ' khiên.' }); }
      if (g.coins < FREEZE_PRICE) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Chưa đủ xu (cần ' + FREEZE_PRICE + ' 🪙).' }); }
      db.prepare('UPDATE word_game SET coins=coins-?, freezes=freezes+1 WHERE user_id=?').run(FREEZE_PRICE, uid);
      db.exec('COMMIT');
      res.json({ ok: true, me: statePayload(uid, req.user.name) });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/buy]', e.message);
      res.status(500).json({ error: 'Không mua được.' });
    }
  });

  // Bảng xếp hạng tuần (XP 7 ngày gần nhất) — chỉ hiện TÊN GỌI (từ cuối của họ tên) để bảo vệ riêng tư
  function givenName(full) {
    const parts = String(full || '').trim().split(/\s+/);
    return parts[parts.length - 1] || 'Bạn';
  }
  app.get('/api/word-game/leaderboard', requireAuth, (req, res) => {
    try {
      const since = vnDay(-6);
      const rows = db.prepare(`
        SELECT u.id, u.name, SUM(d.xp) AS xp, COALESCE(g.xp,0) AS total_xp, COALESCE(g.streak,0) AS streak, g.last_day AS last_day
        FROM word_daily d JOIN users u ON u.id=d.user_id LEFT JOIN word_game g ON g.user_id=u.id
        WHERE d.day>=? AND u.role='student'
        GROUP BY u.id HAVING SUM(d.xp)>0 ORDER BY xp DESC, u.id ASC LIMIT 50`).all(since);
      const today = vnDay();
      const board = rows.map((r, i) => ({
        rank: i + 1, name: givenName(r.name), xp: Number(r.xp), level: levelOf(r.total_xp).level,
        streak: liveStreak({ streak: r.streak, last_day: r.last_day, freezes: 0 }, today), me: r.id === req.user.id
      }));
      res.json({ week: board.slice(0, 10), me: board.find(b => b.me) || null, since });
    } catch (e) {
      console.error('[wordgame/leaderboard]', e.message);
      res.status(500).json({ error: 'Không tải được bảng xếp hạng.' });
    }
  });

  // ───────────── Dành cho giáo viên/admin ─────────────
  // Dán danh sách từ: mỗi dòng "từ | loại | nghĩa | ví dụ | dịch ví dụ" (ngăn cách bằng | hoặc Tab)
  app.post('/api/words/import', requireRole('teacher', 'admin'), (req, res) => {
    const { level, topic, text } = req.body || {};
    if (!LEVELS.includes(level)) return res.status(400).json({ error: 'Cấp độ phải là KET, PET, FCE hoặc IELTS.' });
    const topicName = String(topic || '').trim().slice(0, 40);
    if (!topicName) return res.status(400).json({ error: 'Vui lòng nhập tên chủ đề.' });
    const lines = String(text || '').split('\n').map(s => s.trim()).filter(Boolean);
    if (!lines.length) return res.status(400).json({ error: 'Chưa có dòng nào để nhập.' });
    if (lines.length > 300) return res.status(400).json({ error: 'Mỗi lần nhập tối đa 300 từ.' });

    let added = 0, updated = 0;
    const skipped = [];
    try {
      const ins = db.prepare(`INSERT INTO vocab_words (level,topic,word,pos,meaning_vi,example_en,example_vi,created_by,created_at)
                              VALUES (?,?,?,?,?,?,?,?,?)`);
      const find = db.prepare('SELECT id FROM vocab_words WHERE level=? AND lower(word)=lower(?)');
      const upd = db.prepare('UPDATE vocab_words SET topic=?, pos=?, meaning_vi=?, example_en=?, example_vi=? WHERE id=?');
      db.exec('BEGIN');
      lines.forEach((line, i) => {
        const parts = line.split(/\t|\|/).map(s => s.trim());
        const [word, pos, vi, ex, exVi] = parts;
        if (!word || !vi) { skipped.push('Dòng ' + (i + 1) + ': thiếu từ hoặc nghĩa'); return; }
        if (word.length > 60 || vi.length > 200 || (ex || '').length > 300) { skipped.push('Dòng ' + (i + 1) + ': quá dài'); return; }
        if (ex && !new RegExp('(^|[^A-Za-z])' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^A-Za-z]|$)', 'i').test(ex)) {
          skipped.push('Dòng ' + (i + 1) + ': câu ví dụ phải chứa đúng từ "' + word + '"'); return;
        }
        const ex0 = find.get(level, word);
        if (ex0) { upd.run(topicName, pos || '', vi, ex || '', exVi || '', ex0.id); updated++; }
        else { ins.run(level, topicName, word, pos || '', vi, ex || '', exVi || '', req.user.id, now()); added++; }
      });
      db.exec('COMMIT');
      loadBank();
      res.json({ ok: true, added, updated, skipped, total: bank.list.length });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/import]', e.message);
      res.status(500).json({ error: 'Không nhập được: ' + e.message });
    }
  });

  app.delete('/api/words/:id', requireRole('teacher', 'admin'), (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Mã từ không hợp lệ.' });
    try {
      db.exec('BEGIN');
      db.prepare('DELETE FROM word_progress WHERE word_id=?').run(id);
      const r = db.prepare('DELETE FROM vocab_words WHERE id=?').run(id);
      db.exec('COMMIT');
      loadBank();
      res.json({ ok: true, deleted: Number(r.changes || 0) });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      res.status(500).json({ error: 'Không xoá được.' });
    }
  });

  // Tiến độ học từ vựng của tất cả học sinh (giáo viên theo dõi)
  app.get('/api/word-game/students', requireRole('teacher', 'admin'), (req, res) => {
    try {
      const today = vnDay();
      const since = vnDay(-6);
      const rows = db.prepare(`
        SELECT u.id, u.name, u.email,
               COALESCE(g.xp,0) AS xp, COALESCE(g.streak,0) AS streak, g.last_day AS last_day, COALESCE(g.sessions,0) AS sessions,
               (SELECT COUNT(*) FROM word_progress p WHERE p.user_id=u.id AND p.box>=3) AS learned,
               (SELECT COALESCE(SUM(d.xp),0) FROM word_daily d WHERE d.user_id=u.id AND d.day>=?) AS week_xp
        FROM users u LEFT JOIN word_game g ON g.user_id=u.id
        WHERE u.role='student' ORDER BY week_xp DESC, xp DESC LIMIT 200`).all(since);
      res.json({
        students: rows.map(r => ({
          id: r.id, name: r.name, email: r.email, xp: Number(r.xp), level: levelOf(Number(r.xp)).level,
          streak: liveStreak({ streak: r.streak, last_day: r.last_day, freezes: 0 }, today),
          lastDay: r.last_day || '', sessions: Number(r.sessions), learned: Number(r.learned), weekXp: Number(r.week_xp)
        }))
      });
    } catch (e) {
      console.error('[wordgame/students]', e.message);
      res.status(500).json({ error: 'Không tải được danh sách.' });
    }
  });

  // Dùng cho kiểm thử/tool nội bộ
  return { parseSeed, vnDay, addDays, levelOf };
};
