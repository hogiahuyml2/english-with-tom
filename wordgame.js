// Góc Từ Vựng — backend: kho từ, ôn tập ngắt quãng (SRS), XP/cấp độ/xu, chuỗi ngày,
// nhiệm vụ ngày, huy hiệu, bảng xếp hạng. Mọi phần thưởng do SERVER tính (client chỉ
// báo kết quả từng câu) để học sinh không tự cộng điểm bằng cách sửa request.
const { SEED_WORDS, parseSeed } = require('./vocab-seed');
const { SEED2 } = require('./vocab-seed2');
const { applyFixes } = require('./vocab-fixes');
const { SEED_DIALOGUES, parseScript } = require('./vocab-dialogues');
const crypto = require('crypto');

const LEVELS = ['KET', 'PET', 'FCE', 'IELTS'];
const MODES = ['flash', 'blitz', 'type', 'situation', 'smart', 'colloc', 'upgrade', 'dictation', 'boss', 'blaster', 'frog', 'hangman', 'wordle', 'duel'];
const ARCADE_MODES = ['blaster', 'frog', 'hangman', 'wordle', 'duel']; // các chế độ tính vào xếp hạng tuần + huy hiệu trò chơi
const WEEK_PRIZES = [100, 60, 30]; // xu thưởng top 1-2-3 mỗi tuần
const WEEK_MIN_POINTS = 20;       // cần tối thiểu 20 điểm để được tính giải
const KINDS = ['word', 'colloc', 'upgrade'];
// Khoảng cách ôn lại (ngày) theo "hộp" 0..5 — đúng với phương pháp Leitner/lặp lại ngắt quãng
const INTERVALS = [0, 1, 3, 7, 14, 30];
const DAILY_GOAL = 20;     // mục tiêu: ôn 20 lượt từ/ngày
const STREAK_MIN = 5;      // chỉ cần 5 lượt là giữ được chuỗi 🔥
const FREEZE_PRICE = 100;  // xu đổi 1 "khiên giữ chuỗi" 🧊
const MAX_FREEZES = 2;
// XP cho mỗi câu đúng theo chế độ (chế độ khó hơn/đòi hỏi nhớ chủ động thì thưởng nhiều hơn; Blitz nhanh nên ít hơn để không "lạm phát")
const XP_BASE = { flash: 2, blitz: 3, smart: 5, situation: 5, type: 6, colloc: 5, upgrade: 6, dictation: 7, boss: 5, blaster: 4, frog: 4, hangman: 6, wordle: 5, duel: 4 };
const BOSS_MIN_OK = 6, BOSS_MAX_WRONG = 2, BOSS_BONUS_XP = 20, BOSS_BONUS_COINS = 25; // thắng boss: đúng ≥6 câu và sai ≤2 (3 mạng)
const CHEST_PRICE = 80;

// ── Danh mục trang trí (mua bằng xu) ──
const ITEMS = [
  { id: 'av_fox', kind: 'avatar', icon: '🦊', name: 'Cáo lửa', price: 60 },
  { id: 'av_panda', kind: 'avatar', icon: '🐼', name: 'Gấu trúc', price: 60 },
  { id: 'av_lion', kind: 'avatar', icon: '🦁', name: 'Sư tử', price: 90 },
  { id: 'av_octo', kind: 'avatar', icon: '🐙', name: 'Bạch tuộc', price: 90 },
  { id: 'av_rocket', kind: 'avatar', icon: '🚀', name: 'Phi hành gia', price: 120 },
  { id: 'av_robot', kind: 'avatar', icon: '🤖', name: 'Robot', price: 120 },
  { id: 'av_uni', kind: 'avatar', icon: '🦄', name: 'Kỳ lân', price: 150 },
  { id: 'av_dragon', kind: 'avatar', icon: '🐲', name: 'Rồng thần', price: 200 },
  { id: 'fr_gold', kind: 'frame', icon: '🟡', name: 'Viền vàng', price: 100 },
  { id: 'fr_neon', kind: 'frame', icon: '🔵', name: 'Viền neon', price: 100 },
  { id: 'fr_fire', kind: 'frame', icon: '🔴', name: 'Viền lửa', price: 160 },
  { id: 'fr_rainbow', kind: 'frame', icon: '🌈', name: 'Viền cầu vồng', price: 220 },
];
const ITEM_BY_ID = new Map(ITEMS.map(i => [i.id, i]));
const MAX_RESULTS = 60;    // tối đa số câu báo lên mỗi phiên
const DAILY_HITS_CAP = 3;  // 1 từ chỉ được cộng XP tối đa 3 lần đúng/ngày (chống cày 1 từ)

// ── Ngày theo giờ Việt Nam (UTC+7), dạng YYYY-MM-DD ──
function vnDay(offset) {
  return new Date(Date.now() + 7 * 3600 * 1000 + (offset || 0) * 86400000).toISOString().slice(0, 10);
}
function dayNum(day) { return Math.floor(Date.parse(day + 'T00:00:00Z') / 86400000); }
function addDays(day, n) { return new Date((dayNum(day) + n) * 86400000).toISOString().slice(0, 10); }
function dayDiff(a, b) { return dayNum(b) - dayNum(a); }
// Tuần thi đấu: bắt đầu từ thứ Hai (giờ Việt Nam)
function weekStart(day) { const dow = (new Date(day + 'T00:00:00Z').getUTCDay() + 6) % 7; return addDays(day, -dow); }

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
  { id: 'colloc8',    icon: '🔗', text: 'Chọn đúng 8 cụm từ (Collocations)', goal: 8,  reward: 15, get: (d, m) => (m.colloc && m.colloc.ok) || 0 },
  { id: 'dict5',      icon: '🎧', text: 'Chép đúng 5 câu chính tả',          goal: 5,  reward: 20, get: (d, m) => (m.dictation && m.dictation.ok) || 0 },
  { id: 'dialog1',    icon: '🗣️', text: 'Hoàn thành 1 hội thoại điền từ',     goal: 1,  reward: 20, get: (d, m) => (m.dialogue && m.dialogue.s) || 0 },
  { id: 'boss1',      icon: '🐉', text: 'Hạ gục 1 Boss',                     goal: 1,  reward: 25, get: (d, m) => (m.boss && m.boss.w) || 0 },
  { id: 'upgrade5',   icon: '🚀', text: 'Nâng cấp đúng 5 từ',               goal: 5,  reward: 15, get: (d, m) => (m.upgrade && m.upgrade.ok) || 0 },
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
  { id: 'dialog1',  icon: '🗣️', name: 'Người giao tiếp',  text: 'Làm đúng hết 1 hội thoại',        goal: 1,    have: s => s.dialogues_done },
  { id: 'dialog5',  icon: '🎭', name: 'Diễn viên ngôn ngữ', text: 'Làm đúng hết 5 hội thoại',      goal: 5,    have: s => s.dialogues_done },
  { id: 'boss1',    icon: '🐉', name: 'Thợ săn Boss',      text: 'Hạ gục 1 Boss',                  goal: 1,    have: s => s.boss_wins },
  { id: 'boss10',   icon: '👑', name: 'Chúa tể Boss',      text: 'Hạ gục 10 Boss',                 goal: 10,   have: s => s.boss_wins },
  { id: 'chest10',  icon: '🎁', name: 'Săn kho báu',       text: 'Mở 10 rương',                    goal: 10,   have: s => s.chests },
  { id: 'xp1000',   icon: '💎', name: '1000 XP',           text: 'Đạt 1000 điểm kinh nghiệm',        goal: 1000, have: s => s.xp },
  // ── Huy hiệu trò chơi (có xu thưởng khi đạt) ──
  { id: 'blast50',  game: true, reward: 20,  icon: '🚀', name: 'Thợ săn thiên thạch', text: 'Bắn đúng 50 thiên thạch',            goal: 50,  have: s => s.arc.blaster.ok },
  { id: 'blast200', game: true, reward: 60,  icon: '🌌', name: 'Thuyền trưởng thiên hà', text: 'Bắn đúng 200 thiên thạch',        goal: 200, have: s => s.arc.blaster.ok },
  { id: 'frog30',   game: true, reward: 20,  icon: '🐸', name: 'Ếch nhảy giỏi',       text: 'Nhảy đúng 30 lá sen',                goal: 30,  have: s => s.arc.frog.ok },
  { id: 'frog100',  game: true, reward: 60,  icon: '🪷', name: 'Vua ao sen',           text: 'Nhảy đúng 100 lá sen',               goal: 100, have: s => s.arc.frog.ok },
  { id: 'hang10',   game: true, reward: 20,  icon: '👨‍🚀', name: 'Người giải cứu',      text: 'Cứu thành công 10 phi hành gia',     goal: 10,  have: s => s.arc.hangman.ok },
  { id: 'hang30',   game: true, reward: 60,  icon: '🛰️', name: 'Đội cứu hộ vũ trụ',    text: 'Cứu thành công 30 phi hành gia',     goal: 30,  have: s => s.arc.hangman.ok },
  { id: 'wordle3',  game: true, reward: 20,  icon: '🔍', name: 'Thám tử chữ',          text: 'Thắng Đoán từ mỗi ngày 3 lần',       goal: 3,   have: s => s.wordle_wins },
  { id: 'wordle30', game: true, reward: 100, icon: '🧠', name: 'Bậc thầy đoán chữ',    text: 'Thắng Đoán từ mỗi ngày 30 lần',      goal: 30,  have: s => s.wordle_wins },
  { id: 'wstreak7', game: true, reward: 80,  icon: '🔥', name: 'Chuỗi thắng 7 ngày',   text: 'Thắng Đoán từ 7 ngày liên tiếp',     goal: 7,   have: s => s.wordle_streak },
  { id: 'duel1',    game: true, reward: 20,  icon: '⚔️', name: 'Tân binh đấu trường',  text: 'Thắng 1 trận đấu 1-1',               goal: 1,   have: s => s.duel_wins },
  { id: 'duel10',   game: true, reward: 100, icon: '🥋', name: 'Võ sĩ từ vựng',        text: 'Thắng 10 trận đấu 1-1',              goal: 10,  have: s => s.duel_wins },
  { id: 'weekwin',  game: true, reward: 100, icon: '🏆', name: 'Nhà vô địch tuần',     text: 'Đứng nhất bảng xếp hạng trò chơi tuần', goal: 1, have: s => s.week_wins },
  { id: 'allgames', game: true, reward: 30,  icon: '🎮', name: 'Tay chơi toàn năng',   text: 'Chơi đủ 4 trò: Thiên thạch, Ếch, Phi hành gia, Đoán từ', goal: 4, have: s => ['blaster', 'frog', 'hangman', 'wordle'].filter(m => s.arc[m].plays > 0).length },
];

module.exports = function registerWordGame(app, { db, requireAuth, requireRole, now, notifyUser }) {
  // ───────────── Kho từ (cache RAM — học sinh đọc kho từ không đụng đĩa) ─────────────
  let bank = { list: [], byId: new Map() };

  function loadBank() {
    const rows = db.prepare('SELECT id,level,topic,word,pos,meaning_vi,example_en,example_vi,kind,basic,extra,example_basic FROM vocab_words ORDER BY id').all();
    const list = rows.map(r => ({
      id: Number(r.id), kind: r.kind || 'word', level: r.level, topic: r.topic, word: r.word, pos: r.pos || '',
      vi: r.meaning_vi, ex: r.example_en || '', exVi: r.example_vi || '',
      basic: r.basic || '', extra: r.extra ? String(r.extra).split(',').map(s => s.trim()).filter(Boolean) : [], exB: r.example_basic || ''
    }));
    bank = { list, byId: new Map(list.map(w => [w.id, w])) };
  }

  function seedBank() {
    try {
      const ins = db.prepare(
        'INSERT OR IGNORE INTO vocab_words (level,topic,word,pos,meaning_vi,example_en,example_vi,created_at,kind,basic,extra,example_basic) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)'
      );
      db.exec('BEGIN');
      let n = 0;
      for (const w of SEED_WORDS) n += Number(ins.run(w.level, w.topic, w.word, w.pos, w.vi, w.ex, w.exVi, now(), 'word', null, null, null).changes || 0);
      for (const w of SEED2) n += Number(ins.run(w.level, w.topic, w.word, w.pos, w.vi, w.ex, w.exVi, now(), w.kind, w.basic || null, w.extra || null, w.exampleBasic || null).changes || 0);
      db.exec('COMMIT');
      if (n) console.log('[wordgame] Đã nạp ' + n + ' mục khởi đầu.');
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame] seed lỗi:', e.message);
    }
  }

  function seedDialogues() {
    try {
      const ins = db.prepare('INSERT OR IGNORE INTO word_dialogues (level,title,scene,script,blanks,created_at) VALUES (?,?,?,?,?,?)');
      let n = 0;
      for (const d of SEED_DIALOGUES) n += Number(ins.run(d.level, d.title, d.scene, d.script, parseScript(d.script).blanks, now()).changes || 0);
      if (n) console.log('[wordgame] Đã nạp ' + n + ' hội thoại.');
    } catch (e) { console.error('[wordgame] seed hội thoại lỗi:', e.message); }
  }
  seedDialogues();
  try { seedBank(); applyFixes(db, console.log); loadBank(); console.log('[wordgame] Kho từ: ' + bank.list.length + ' từ.'); }
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
    const dd = Number(db.prepare('SELECT COUNT(*) c FROM word_dialog_progress p JOIN word_dialogues d ON d.id=p.dialogue_id WHERE p.user_id=? AND p.best>=d.blanks').get(uid).c);
    const arc = {}; for (const m of ARCADE_MODES) arc[m] = { ok: 0, n: 0, plays: 0 };
    for (const r of db.prepare('SELECT mode,ok,n,plays FROM arcade_stats WHERE user_id=?').all(uid)) if (arc[r.mode]) arc[r.mode] = { ok: Number(r.ok), n: Number(r.n), plays: Number(r.plays) };
    const wdays = db.prepare('SELECT day FROM word_wordle WHERE user_id=? AND win=1 ORDER BY day').all(uid).map(r => r.day);
    let wbest = 0, run = 0, prev = null;
    for (const d of wdays) { run = prev && dayDiff(prev, d) === 1 ? run + 1 : 1; prev = d; if (run > wbest) wbest = run; }
    return {
      xp: g.xp, sessions: g.sessions, best_combo: g.best_combo, best_streak: g.best_streak, quests_done: g.quests_done, learned: learnedCount(uid), dialogues_done: dd, boss_wins: g.boss_wins || 0, chests: g.chests || 0,
      arc, wordle_wins: wdays.length, wordle_streak: wbest,
      duel_wins: Number(db.prepare('SELECT COUNT(*) c FROM word_duels WHERE winner_id=?').get(uid).c),
      week_wins: Number(db.prepare('SELECT COUNT(*) c FROM arcade_week_winners WHERE user_id=? AND rank=1').get(uid).c)
    };
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
    const owned = new Set(db.prepare('SELECT item_id FROM word_inventory WHERE user_id=?').all(uid).map(r => r.item_id));
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
      badges: BADGES.map(b => ({ id: b.id, icon: b.icon, name: b.name, text: b.text, goal: b.goal, have: Math.min(b.goal, b.have(stats)), got: got.has(b.id), game: !!b.game, reward: b.reward || 0 })),
      learned: stats.learned,
      total: bank.list.length,
      progress: prog,
      avatar: (ITEM_BY_ID.get(g.avatar) || {}).icon || '', avatarId: g.avatar || '', frame: g.frame || '',
      shop: ITEMS.map(i => ({ id: i.id, kind: i.kind, icon: i.icon, name: i.name, price: i.price, owned: owned.has(i.id) })),
      chest: { price: CHEST_PRICE, dailyClaimed: claimed.has('chest'), dailyReady: !claimed.has('chest') && questsFor(uid, today).every(q => claimed.has(q.id)), opened: g.chests || 0 },
      bossWins: g.boss_wins || 0,
    };
  }

  function awardBadges(uid, g) {
    const stats = badgeStats(uid, g);
    const got = new Set(db.prepare('SELECT badge_id FROM word_badges WHERE user_id=?').all(uid).map(r => r.badge_id));
    const fresh = [];
    for (const b of BADGES) {
      if (!got.has(b.id) && b.have(stats) >= b.goal) {
        db.prepare('INSERT OR IGNORE INTO word_badges (user_id,badge_id,earned_at) VALUES (?,?,?)').run(uid, b.id, now());
        if (b.reward) db.prepare('UPDATE word_game SET coins=coins+? WHERE user_id=?').run(b.reward, uid);
        fresh.push({ id: b.id, icon: b.icon, name: b.name, text: b.text, reward: b.reward || 0 });
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

  // Ghi phần thưởng của 1 phiên chơi vào bản ghi ngày/chuỗi/xu/huy hiệu (gọi TRONG transaction)
  function commitReward(uid, day, g, mode, xp, total, okN, newN, bestCombo) {
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
    return { coinGain, streakUp, usedFreeze, streakBonus, streak, newBadges };
  }

  // Báo kết quả 1 phiên chơi → server cập nhật SRS, XP, xu, chuỗi ngày, nhiệm vụ, huy hiệu
  // Ghi kết quả 1 phiên chơi (dùng chung cho mọi chế độ, kể cả các trò chơi đồ hoạ và Đoán từ mỗi ngày).
  // Trả về payload cho client; ném lỗi nếu không lưu được (transaction tự rollback).
  function recordSession(uid, name, mode, results, bonusXp) {
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
      const bossWin = mode === 'boss' && okN >= BOSS_MIN_OK && (total - okN) <= BOSS_MAX_WRONG;
      let comboBonus = 0, accBonus = 0;
      if (bestCombo >= 10) comboBonus = 10;
      if (total >= 5 && okN / total >= 0.8) accBonus = 10;
      xp += comboBonus + accBonus + (bossWin ? BOSS_BONUS_XP : 0) + (bonusXp || 0);

      const rw = commitReward(uid, day, g, mode, xp, total, okN, newN, bestCombo);
      if (ARCADE_MODES.includes(mode)) {
        db.prepare(`INSERT INTO arcade_stats (user_id,mode,ok,n,plays) VALUES (?,?,?,?,1)
          ON CONFLICT(user_id,mode) DO UPDATE SET ok=ok+excluded.ok, n=n+excluded.n, plays=plays+1`).run(uid, mode, okN, total);
        db.prepare(`INSERT INTO arcade_weekly (week,user_id,points,plays) VALUES (?,?,?,1)
          ON CONFLICT(week,user_id) DO UPDATE SET points=points+excluded.points, plays=plays+1`).run(weekStart(day), uid, xp);
        rw.newBadges = rw.newBadges.concat(awardBadges(uid, db.prepare('SELECT * FROM word_game WHERE user_id=?').get(uid)));
      }
      let extraBadges = [];
      if (bossWin) {
        const dd = dailyRow(uid, day), mm = parseModes(dd.modes);
        mm.boss = mm.boss || { n: 0, ok: 0, s: 0 }; mm.boss.w = (mm.boss.w || 0) + 1;
        db.prepare('UPDATE word_daily SET modes=? WHERE user_id=? AND day=?').run(JSON.stringify(mm), uid, day);
        db.prepare('UPDATE word_game SET boss_wins=boss_wins+1, coins=coins+? WHERE user_id=?').run(BOSS_BONUS_COINS, uid);
        extraBadges = awardBadges(uid, db.prepare('SELECT * FROM word_game WHERE user_id=?').get(uid));
      }
      db.exec('COMMIT');

      return {
        gained: { xp, coins: rw.coinGain, total, correct: okN, newWords: newN, bestCombo, comboBonus, accBonus, streakUp: rw.streakUp, usedFreeze: rw.usedFreeze, streakBonus: rw.streakBonus, streak: rw.streak, win: bossWin, bossCoins: bossWin ? BOSS_BONUS_COINS : 0 },
        newBadges: rw.newBadges.concat(extraBadges),
        me: statePayload(uid, name)
      };
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      throw e;
    }
  }

  // Báo kết quả 1 phiên chơi → server cập nhật SRS, XP, xu, chuỗi ngày, nhiệm vụ, huy hiệu
  app.post('/api/word-game/session', requireAuth, (req, res) => {
    const body = req.body || {};
    const mode = MODES.includes(body.mode) && body.mode !== 'wordle' && body.mode !== 'duel' ? body.mode : null; // wordle & duel chỉ được tính qua máy chủ
    let results = Array.isArray(body.results) ? body.results.slice(0, MAX_RESULTS) : [];
    results = results.filter(r => r && Number.isInteger(r.id) && bank.byId.has(r.id));
    if (!mode || !results.length) return res.status(400).json({ error: 'Dữ liệu phiên chơi không hợp lệ.' });
    try { res.json(recordSession(req.user.id, req.user.name, mode, results, 0)); }
    catch (e) {
      console.error('[wordgame/session]', e.message);
      res.status(500).json({ error: 'Không lưu được kết quả phiên học.' });
    }
  });

  // ───────────── Đoán từ mỗi ngày (kiểu Wordle, có gợi ý nghĩa tiếng Việt) ─────────────
  // Đáp án chỉ nằm ở máy chủ; client gửi từng lượt đoán và nhận lại màu từng ô → không thể "soi" đáp án.
  const WORDLE_TRIES = 6;
  const WORDLE_XP = [0, 50, 42, 34, 26, 18, 10]; // thưởng theo số lượt đoán đúng
  function wordleEligible() { return bank.list.filter(w => w.kind === 'word' && /^[A-Za-z]{4,8}$/.test(w.word)); }
  function wordlePick(day) {
    const el = wordleEligible();
    if (!el.length) return null;
    const h = crypto.createHash('sha256').update('ewt-wordle:' + day).digest().readUInt32BE(0);
    return el[h % el.length];
  }
  function wordlePattern(guess, answer) {
    const g = guess.toLowerCase(), a = answer.toLowerCase(), n = a.length, res = new Array(n).fill('x'), left = {};
    for (let i = 0; i < n; i++) { if (g[i] === a[i]) res[i] = 'g'; else left[a[i]] = (left[a[i]] || 0) + 1; }
    for (let i = 0; i < n; i++) if (res[i] === 'x' && left[g[i]] > 0) { res[i] = 'y'; left[g[i]]--; }
    return res.join('');
  }
  function wordleStreak(uid, day) {
    const rows = db.prepare('SELECT day,win FROM word_wordle WHERE user_id=? AND done=1 ORDER BY day DESC LIMIT 60').all(uid);
    let streak = 0, want = day;
    const map = new Map(rows.map(r => [r.day, r.win]));
    if (!map.has(want)) want = addDays(day, -1); // hôm nay chưa chơi xong thì tính từ hôm qua
    while (map.get(want) === 1) { streak++; want = addDays(want, -1); }
    return streak;
  }
  function wordleState(uid, day, extra) {
    const row = db.prepare('SELECT * FROM word_wordle WHERE user_id=? AND day=?').get(uid, day);
    if (!row) return null;
    const w = bank.byId.get(Number(row.word_id));
    const guesses = JSON.parse(row.guesses || '[]');
    const done = !!row.done;
    return Object.assign({
      day, len: w.word.length, tries: WORDLE_TRIES, guesses, done, win: !!row.win,
      hint: { vi: w.vi, pos: w.pos, level: w.level, topic: w.topic },
      answer: done ? { word: w.word, vi: w.vi, ex: w.ex, exVi: w.exVi } : null,
      streak: wordleStreak(uid, day)
    }, extra || {});
  }
  app.get('/api/word-game/wordle', requireAuth, (req, res) => {
    try {
      const day = vnDay();
      let row = db.prepare('SELECT * FROM word_wordle WHERE user_id=? AND day=?').get(req.user.id, day);
      if (!row) {
        const w = wordlePick(day);
        if (!w) return res.status(503).json({ error: 'Kho từ chưa đủ từ để chơi.' });
        db.prepare('INSERT OR IGNORE INTO word_wordle (user_id,day,word_id,guesses,done,win) VALUES (?,?,?,?,0,0)').run(req.user.id, day, w.id, '[]');
      }
      res.json(wordleState(req.user.id, day));
    } catch (e) { console.error('[wordle/get]', e.message); res.status(500).json({ error: 'Không tải được trò chơi.' }); }
  });
  app.post('/api/word-game/wordle/guess', requireAuth, (req, res) => {
    try {
      const uid = req.user.id, day = vnDay();
      const row = db.prepare('SELECT * FROM word_wordle WHERE user_id=? AND day=?').get(uid, day);
      if (!row) return res.status(400).json({ error: 'Hãy mở trò chơi trước.' });
      if (row.done) return res.status(400).json({ error: 'Hôm nay bạn đã chơi xong rồi. Mai quay lại nhé!' });
      const w = bank.byId.get(Number(row.word_id));
      const guess = String((req.body || {}).guess || '').trim().toLowerCase();
      if (!/^[a-z]+$/.test(guess) || guess.length !== w.word.length) return res.status(400).json({ error: 'Từ cần có đúng ' + w.word.length + ' chữ cái.' });
      const guesses = JSON.parse(row.guesses || '[]');
      if (guesses.length >= WORDLE_TRIES) return res.status(400).json({ error: 'Đã hết lượt đoán.' });
      if (guesses.some(x => x.g === guess)) return res.status(400).json({ error: 'Bạn đã đoán từ này rồi.' });
      const pattern = wordlePattern(guess, w.word);
      guesses.push({ g: guess, p: pattern });
      const win = pattern === 'g'.repeat(w.word.length);
      const done = win || guesses.length >= WORDLE_TRIES;
      db.prepare('UPDATE word_wordle SET guesses=?, done=?, win=? WHERE user_id=? AND day=?').run(JSON.stringify(guesses), done ? 1 : 0, win ? 1 : 0, uid, day);
      let reward = null;
      if (done) {
        try { reward = recordSession(uid, req.user.name, 'wordle', [{ id: w.id, ok: win }], win ? WORDLE_XP[guesses.length] : 0); }
        catch (e) { console.error('[wordle/reward]', e.message); }
      }
      res.json(wordleState(uid, day, reward ? { reward } : {}));
    } catch (e) { console.error('[wordle/guess]', e.message); res.status(500).json({ error: 'Không xử lý được lượt đoán.' }); }
  });

  // ───────────── Bảng xếp hạng trò chơi theo TUẦN + thưởng xu top 3 ─────────────
  // Điểm tuần = XP kiếm được từ các trò chơi (Thiên thạch, Ếch, Phi hành gia, Đoán từ, Đấu 1-1).
  // XP đã bị giới hạn theo từ/ngày nên khó "cày" — công bằng cho mọi học sinh.
  function settleWeeks() {
    try {
      const cur = weekStart(vnDay());
      const weeks = db.prepare('SELECT DISTINCT week FROM arcade_weekly WHERE week<? ORDER BY week DESC LIMIT 6').all(cur).map(r => r.week);
      for (const wk of weeks) {
        if (db.prepare('SELECT 1 FROM arcade_week_winners WHERE week=? AND rank=0').get(wk)) continue;
        const top = db.prepare(`SELECT w.user_id, w.points FROM arcade_weekly w JOIN users u ON u.id=w.user_id
          WHERE w.week=? AND u.role='student' AND w.points>=? ORDER BY w.points DESC, w.user_id ASC LIMIT 3`).all(wk, WEEK_MIN_POINTS);
        try {
          db.exec('BEGIN');
          db.prepare('INSERT INTO arcade_week_winners (week,rank,user_id,points,coins) VALUES (?,0,0,0,0)').run(wk);
          top.forEach((r, i) => {
            ensureGame(r.user_id);
            db.prepare('INSERT INTO arcade_week_winners (week,rank,user_id,points,coins) VALUES (?,?,?,?,?)').run(wk, i + 1, r.user_id, r.points, WEEK_PRIZES[i]);
            db.prepare('UPDATE word_game SET coins=coins+? WHERE user_id=?').run(WEEK_PRIZES[i], r.user_id);
          });
          db.exec('COMMIT');
        } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} throw e; }
        const medals = ['🥇', '🥈', '🥉'];
        top.forEach((r, i) => {
          try { notifyUser(r.user_id, 'arcade_week', medals[i] + ' Bạn đạt hạng ' + (i + 1) + ' bảng xếp hạng trò chơi tuần!', '+' + WEEK_PRIZES[i] + ' xu đã được cộng vào ví. Chúc mừng!', 'arcade.html'); } catch (e) {}
          try { awardBadges(r.user_id, db.prepare('SELECT * FROM word_game WHERE user_id=?').get(r.user_id)); } catch (e) {}
        });
        if (top.length) console.log('[arcade] Chốt tuần ' + wk + ': ' + top.map(r => r.user_id + '=' + r.points).join(', '));
      }
    } catch (e) { console.error('[arcade/settle]', e.message); }
  }
  setTimeout(function () { settleWeeks(); setInterval(settleWeeks, 60 * 60 * 1000).unref(); }, 45 * 1000).unref();

  app.get('/api/arcade/leaderboard', requireAuth, (req, res) => {
    try {
      settleWeeks();
      const today = vnDay(), wk = weekStart(today);
      const rows = db.prepare(`SELECT u.id, u.name, w.points, w.plays, g.avatar AS avatar FROM arcade_weekly w JOIN users u ON u.id=w.user_id LEFT JOIN word_game g ON g.user_id=u.id
        WHERE w.week=? AND u.role='student' AND w.points>0 ORDER BY w.points DESC, u.id ASC LIMIT 100`).all(wk);
      const board = rows.map((r, i) => ({ rank: i + 1, name: givenName(r.name), avatar: (ITEM_BY_ID.get(r.avatar) || {}).icon || '', points: Number(r.points), plays: Number(r.plays), me: r.id === req.user.id }));
      const prevWk = addDays(wk, -7);
      const last = db.prepare(`SELECT x.rank, x.points, x.coins, u.name, g.avatar AS avatar FROM arcade_week_winners x JOIN users u ON u.id=x.user_id LEFT JOIN word_game g ON g.user_id=u.id
        WHERE x.week=? AND x.rank>0 ORDER BY x.rank`).all(prevWk).map(r => ({ rank: r.rank, name: givenName(r.name), avatar: (ITEM_BY_ID.get(r.avatar) || {}).icon || '', points: r.points, coins: r.coins }));
      res.json({ weekStart: wk, weekEnd: addDays(wk, 6), daysLeft: 7 - dayDiff(wk, today), prizes: WEEK_PRIZES, minPoints: WEEK_MIN_POINTS, top: board.slice(0, 10), me: board.find(b => b.me) || null, lastWeek: { start: prevWk, winners: last } });
    } catch (e) { console.error('[arcade/leaderboard]', e.message); res.status(500).json({ error: 'Không tải được bảng xếp hạng.' }); }
  });

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

  // Cửa hàng: khiên giữ chuỗi 🧊 (mặc định) hoặc mua trang trí theo mã (avatar/khung)
  app.post('/api/word-game/shop/buy', requireAuth, (req, res) => {
    const uid = req.user.id;
    const itemId = String((req.body || {}).item || 'freeze');
    try {
      db.exec('BEGIN');
      const g = ensureGame(uid);
      if (itemId === 'freeze') {
        if (g.freezes >= MAX_FREEZES) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Bạn đang giữ tối đa ' + MAX_FREEZES + ' khiên.' }); }
        if (g.coins < FREEZE_PRICE) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Chưa đủ xu (cần ' + FREEZE_PRICE + ' 🪙).' }); }
        db.prepare('UPDATE word_game SET coins=coins-?, freezes=freezes+1 WHERE user_id=?').run(FREEZE_PRICE, uid);
      } else {
        const it = ITEM_BY_ID.get(itemId);
        if (!it) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Vật phẩm không tồn tại.' }); }
        if (db.prepare('SELECT 1 FROM word_inventory WHERE user_id=? AND item_id=?').get(uid, itemId)) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Bạn đã sở hữu vật phẩm này rồi.' }); }
        if (g.coins < it.price) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Chưa đủ xu (cần ' + it.price + ' 🪙).' }); }
        db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=?').run(it.price, uid);
        db.prepare('INSERT INTO word_inventory (user_id,item_id,acquired_at) VALUES (?,?,?)').run(uid, itemId, now());
      }
      db.exec('COMMIT');
      res.json({ ok: true, me: statePayload(uid, req.user.name) });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/buy]', e.message);
      res.status(500).json({ error: 'Không mua được.' });
    }
  });

  // Đeo / bỏ avatar hoặc khung (chỉ đeo được đồ đã sở hữu)
  app.post('/api/word-game/shop/equip', requireAuth, (req, res) => {
    const uid = req.user.id, b = req.body || {};
    const kind = b.kind === 'frame' ? 'frame' : (b.kind === 'avatar' ? 'avatar' : null);
    if (!kind) return res.status(400).json({ error: 'Loại vật phẩm không hợp lệ.' });
    try {
      ensureGame(uid);
      if (b.id) {
        const it = ITEM_BY_ID.get(String(b.id));
        if (!it || it.kind !== kind) return res.status(400).json({ error: 'Vật phẩm không hợp lệ.' });
        if (!db.prepare('SELECT 1 FROM word_inventory WHERE user_id=? AND item_id=?').get(uid, it.id)) return res.status(403).json({ error: 'Bạn chưa sở hữu vật phẩm này.' });
        db.prepare('UPDATE word_game SET ' + kind + '=? WHERE user_id=?').run(it.id, uid);
      } else {
        db.prepare('UPDATE word_game SET ' + kind + '=NULL WHERE user_id=?').run(uid);
      }
      res.json({ ok: true, me: statePayload(uid, req.user.name) });
    } catch (e) { console.error('[wordgame/equip]', e.message); res.status(500).json({ error: 'Không đổi được.' }); }
  });

  // Rương thưởng 🎁: miễn phí 1 rương/ngày khi nhận đủ 3 nhiệm vụ; hoặc mua bằng xu
  function rollChest(uid, g) {
    const r = crypto.randomInt(0, 100);
    const ownedSet = new Set(db.prepare('SELECT item_id FROM word_inventory WHERE user_id=?').all(uid).map(x => x.item_id));
    if (r < 55) return { type: 'coins', amount: crypto.randomInt(20, 61) };
    if (r < 75) return { type: 'coins', amount: crypto.randomInt(80, 151) };
    if (r < 85) return g.freezes < MAX_FREEZES ? { type: 'freeze' } : { type: 'coins', amount: 50 };
    const free = ITEMS.filter(i => !ownedSet.has(i.id));
    if (!free.length) return { type: 'coins', amount: 100 };
    return { type: 'item', item: free[crypto.randomInt(0, free.length)] };
  }
  app.post('/api/word-game/chest/open', requireAuth, (req, res) => {
    const uid = req.user.id, source = (req.body || {}).source === 'daily' ? 'daily' : 'buy';
    const day = vnDay();
    try {
      db.exec('BEGIN');
      const g = ensureGame(uid);
      if (source === 'daily') {
        const d = dailyRow(uid, day);
        const claimed = String(d.claimed || '').split(',').filter(Boolean);
        if (claimed.includes('chest')) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Hôm nay bạn đã mở rương miễn phí rồi.' }); }
        if (!questsFor(uid, day).every(q => claimed.includes(q.id))) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Hãy nhận thưởng đủ 3 nhiệm vụ hôm nay để mở rương miễn phí.' }); }
        claimed.push('chest');
        db.prepare(`INSERT INTO word_daily (user_id,day,claimed) VALUES (?,?,?) ON CONFLICT(user_id,day) DO UPDATE SET claimed=excluded.claimed`).run(uid, day, claimed.join(','));
      } else {
        if (g.coins < CHEST_PRICE) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Chưa đủ xu (cần ' + CHEST_PRICE + ' 🪙).' }); }
        db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=?').run(CHEST_PRICE, uid);
      }
      const reward = rollChest(uid, g);
      if (reward.type === 'coins') db.prepare('UPDATE word_game SET coins=coins+? WHERE user_id=?').run(reward.amount, uid);
      else if (reward.type === 'freeze') db.prepare('UPDATE word_game SET freezes=freezes+1 WHERE user_id=?').run(uid);
      else db.prepare('INSERT OR IGNORE INTO word_inventory (user_id,item_id,acquired_at) VALUES (?,?,?)').run(uid, reward.item.id, now());
      db.prepare('UPDATE word_game SET chests=chests+1 WHERE user_id=?').run(uid);
      const newBadges = awardBadges(uid, db.prepare('SELECT * FROM word_game WHERE user_id=?').get(uid));
      db.exec('COMMIT');
      res.json({ ok: true, reward: reward.type === 'item' ? { type: 'item', item: { id: reward.item.id, icon: reward.item.icon, name: reward.item.name, kind: reward.item.kind } } : reward, newBadges, me: statePayload(uid, req.user.name) });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/chest]', e.message);
      res.status(500).json({ error: 'Không mở được rương.' });
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
        SELECT u.id, u.name, SUM(d.xp) AS xp, COALESCE(g.xp,0) AS total_xp, COALESCE(g.streak,0) AS streak, g.last_day AS last_day, g.avatar AS avatar
        FROM word_daily d JOIN users u ON u.id=d.user_id LEFT JOIN word_game g ON g.user_id=u.id
        WHERE d.day>=? AND u.role='student'
        GROUP BY u.id HAVING SUM(d.xp)>0 ORDER BY xp DESC, u.id ASC LIMIT 50`).all(since);
      const today = vnDay();
      const board = rows.map((r, i) => ({
        rank: i + 1, name: givenName(r.name), avatar: (ITEM_BY_ID.get(r.avatar) || {}).icon || '', xp: Number(r.xp), level: levelOf(r.total_xp).level,
        streak: liveStreak({ streak: r.streak, last_day: r.last_day, freezes: 0 }, today), me: r.id === req.user.id
      }));
      res.json({ week: board.slice(0, 10), me: board.find(b => b.me) || null, since });
    } catch (e) {
      console.error('[wordgame/leaderboard]', e.message);
      res.status(500).json({ error: 'Không tải được bảng xếp hạng.' });
    }
  });

  // ───────────── Dành cho giáo viên/admin ─────────────
  // Dán danh sách: mỗi dòng 1 mục, ngăn cách bằng | hoặc Tab. Định dạng theo loại (kind):
  //  word    : từ | loại | nghĩa | ví dụ | dịch ví dụ
  //  colloc  : cụm từ | từ cần điền | nghĩa | ví dụ | dịch ví dụ | nhiễu1,nhiễu2,nhiễu3 (tuỳ chọn)
  //  upgrade : từ mạnh | từ cơ bản | nghĩa | câu dùng từ mạnh | dịch | câu dùng từ cơ bản
  function hasWord(text, word) {
    return new RegExp('(^|[^A-Za-z])' + word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '([^A-Za-z]|$)', 'i').test(text || '');
  }
  app.post('/api/words/import', requireRole('teacher', 'admin'), (req, res) => {
    const { level, topic, text } = req.body || {};
    const kind = KINDS.includes((req.body || {}).kind) ? req.body.kind : 'word';
    if (!LEVELS.includes(level)) return res.status(400).json({ error: 'Cấp độ phải là KET, PET, FCE hoặc IELTS.' });
    const topicName = String(topic || '').trim().slice(0, 40);
    if (!topicName) return res.status(400).json({ error: 'Vui lòng nhập tên chủ đề.' });
    const lines = String(text || '').split('\n').map(s => s.trim()).filter(Boolean);
    if (!lines.length) return res.status(400).json({ error: 'Chưa có dòng nào để nhập.' });
    if (lines.length > 300) return res.status(400).json({ error: 'Mỗi lần nhập tối đa 300 mục.' });

    let added = 0, updated = 0;
    const skipped = [];
    try {
      const ins = db.prepare(`INSERT INTO vocab_words (level,topic,word,pos,meaning_vi,example_en,example_vi,created_by,created_at,kind,basic,extra,example_basic)
                              VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`);
      const find = db.prepare('SELECT id FROM vocab_words WHERE level=? AND lower(word)=lower(?)');
      const upd = db.prepare('UPDATE vocab_words SET topic=?, pos=?, meaning_vi=?, example_en=?, example_vi=?, kind=?, basic=?, extra=?, example_basic=? WHERE id=?');
      db.exec('BEGIN');
      lines.forEach((line, i) => {
        const P = line.split(/\t|\|/).map(s => s.trim());
        const at = 'Dòng ' + (i + 1) + ': ';
        let word, pos = '', vi, ex, exVi, basic = null, extra = null, exB = null;
        if (kind === 'word') {
          [word, pos, vi, ex, exVi] = P;
        } else if (kind === 'colloc') {
          let ds;
          [word, basic, vi, ex, exVi, ds] = P; pos = 'phr';
          extra = ds ? ds.split(',').map(s => s.trim()).filter(Boolean).join(',') : null;
          if (word && basic && !hasWord(word, basic)) { skipped.push(at + 'từ cần điền "' + basic + '" phải nằm trong cụm "' + word + '"'); return; }
          if (!basic) { skipped.push(at + 'thiếu từ cần điền'); return; }
          if (!ex) { skipped.push(at + 'cần có câu ví dụ chứa cụm từ'); return; }
        } else {
          [word, basic, vi, ex, exVi, exB] = P; pos = 'upgrade';
          if (!basic || !exB) { skipped.push(at + 'cần từ cơ bản và câu dùng từ cơ bản'); return; }
          if (!ex) { skipped.push(at + 'cần câu dùng từ mạnh'); return; }
          if (!hasWord(exB, basic)) { skipped.push(at + 'câu cơ bản phải chứa từ "' + basic + '"'); return; }
        }
        if (!word || !vi) { skipped.push(at + 'thiếu từ hoặc nghĩa'); return; }
        if (word.length > 60 || vi.length > 200 || (ex || '').length > 300 || (exB || '').length > 300) { skipped.push(at + 'quá dài'); return; }
        if (ex && !hasWord(ex, word)) { skipped.push(at + 'câu ví dụ phải chứa đúng "' + word + '"'); return; }
        const ex0 = find.get(level, word);
        if (ex0) { upd.run(topicName, pos, vi, ex || '', exVi || '', kind, basic, extra, exB, ex0.id); updated++; }
        else { ins.run(level, topicName, word, pos, vi, ex || '', exVi || '', req.user.id, now(), kind, basic, extra, exB); added++; }
      });
      db.exec('COMMIT');
      loadBank();
      res.json({ ok: true, added, updated, skipped, total: bank.list.length });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/import]', e.message);
      console.error('[wordgame/import]', e.message); res.status(500).json({ error: 'Không nhập được, vui lòng kiểm tra định dạng rồi thử lại.' });
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

  // ───────────── Hội thoại điền nhiều chỗ trống ─────────────
  app.get('/api/word-dialogues', requireAuth, (req, res) => {
    try {
      const rows = db.prepare(`SELECT d.id,d.level,d.title,d.scene,d.script,d.blanks,COALESCE(p.best,0) AS best,COALESCE(p.plays,0) AS plays
        FROM word_dialogues d LEFT JOIN word_dialog_progress p ON p.dialogue_id=d.id AND p.user_id=? ORDER BY d.id`).all(req.user.id);
      res.json({ dialogues: rows.map(r => ({ id: r.id, level: r.level, title: r.title, scene: r.scene || '', script: r.script, blanks: r.blanks, best: r.best, plays: r.plays })) });
    } catch (e) { console.error('[wordgame/dialogues]', e.message); res.status(500).json({ error: 'Không tải được hội thoại.' }); }
  });

  app.post('/api/word-dialogues', requireRole('teacher', 'admin'), (req, res) => {
    const { level, title, scene, script } = req.body || {};
    if (!LEVELS.includes(level)) return res.status(400).json({ error: 'Cấp độ phải là KET, PET, FCE hoặc IELTS.' });
    const t = String(title || '').trim().slice(0, 80);
    if (!t) return res.status(400).json({ error: 'Vui lòng đặt tên hội thoại.' });
    let parsed;
    try { parsed = parseScript(script); } catch (e) { return res.status(400).json({ error: e.message }); }
    try {
      const old = db.prepare('SELECT id FROM word_dialogues WHERE level=? AND title=?').get(level, t);
      if (old) {
        db.prepare('UPDATE word_dialogues SET scene=?, script=?, blanks=? WHERE id=?').run(String(scene || '').slice(0, 120), String(script).trim(), parsed.blanks, old.id);
        return res.json({ ok: true, id: old.id, updated: true, blanks: parsed.blanks });
      }
      const r = db.prepare('INSERT INTO word_dialogues (level,title,scene,script,blanks,created_by,created_at) VALUES (?,?,?,?,?,?,?)')
        .run(level, t, String(scene || '').slice(0, 120), String(script).trim(), parsed.blanks, req.user.id, now());
      res.json({ ok: true, id: Number(r.lastInsertRowid), updated: false, blanks: parsed.blanks });
    } catch (e) { console.error('[wordgame/dialogue-save]', e.message); res.status(500).json({ error: 'Không lưu được hội thoại.' }); }
  });

  app.delete('/api/word-dialogues/:id', requireRole('teacher', 'admin'), (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Mã không hợp lệ.' });
    try {
      db.exec('BEGIN');
      db.prepare('DELETE FROM word_dialog_progress WHERE dialogue_id=?').run(id);
      const r = db.prepare('DELETE FROM word_dialogues WHERE id=?').run(id);
      db.exec('COMMIT');
      res.json({ ok: true, deleted: Number(r.changes || 0) });
    } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} res.status(500).json({ error: 'Không xoá được.' }); }
  });

  // Báo kết quả 1 lượt làm hội thoại: 4 XP/chỗ đúng (+10 nếu đúng hết); mỗi hội thoại chỉ tính XP 2 lượt đầu/ngày
  app.post('/api/word-game/dialogue', requireAuth, (req, res) => {
    const uid = req.user.id, b = req.body || {};
    const id = Number(b.id), correct = Number(b.correct);
    const d = Number.isInteger(id) ? db.prepare('SELECT id,blanks FROM word_dialogues WHERE id=?').get(id) : null;
    if (!d) return res.status(404).json({ error: 'Không tìm thấy hội thoại.' });
    if (!Number.isInteger(correct) || correct < 0 || correct > d.blanks) return res.status(400).json({ error: 'Kết quả không hợp lệ.' });
    const day = vnDay();
    try {
      db.exec('BEGIN');
      const g = ensureGame(uid);
      const p = db.prepare('SELECT * FROM word_dialog_progress WHERE user_id=? AND dialogue_id=?').get(uid, id) || { best: 0, plays: 0, last_day: null, day_n: 0 };
      const dayN = p.last_day === day ? p.day_n : 0;
      const perfect = correct === d.blanks;
      const xp = dayN < 2 ? correct * 4 + (perfect ? 10 : 0) : 0;
      const rw = commitReward(uid, day, g, 'dialogue', xp, d.blanks, correct, 0, 0);
      db.prepare(`INSERT INTO word_dialog_progress (user_id,dialogue_id,best,plays,last_day,day_n) VALUES (?,?,?,?,?,?)
        ON CONFLICT(user_id,dialogue_id) DO UPDATE SET best=MAX(best,excluded.best), plays=plays+1, last_day=excluded.last_day, day_n=excluded.day_n`)
        .run(uid, id, correct, 1, day, dayN + 1);
      const g2 = db.prepare('SELECT * FROM word_game WHERE user_id=?').get(uid);
      const extra = awardBadges(uid, g2);
      db.exec('COMMIT');
      res.json({ gained: { xp, coins: rw.coinGain, total: d.blanks, correct, perfect, streakUp: rw.streakUp, usedFreeze: rw.usedFreeze, streakBonus: rw.streakBonus, streak: rw.streak },
        newBadges: rw.newBadges.concat(extra), me: statePayload(uid, req.user.name) });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/dialogue]', e.message);
      res.status(500).json({ error: 'Không lưu được kết quả hội thoại.' });
    }
  });

  // ───────────── Giao bộ từ cho học sinh/lớp ─────────────
  function isPastDeadline(s) {
    if (!s) return false;
    const hasZone = /[+-]\d{2}:?\d{2}$|Z$/i.test(s);
    return new Date(hasZone ? s : s.replace(' ', 'T') + '+07:00') < new Date();
  }
  function parseIds(json) { try { const a = JSON.parse(json); return Array.isArray(a) ? a.map(Number).filter(Number.isInteger) : []; } catch (e) { return []; } }
  function setStats(uid, ids, today) {
    const live = ids.filter(id => bank.byId.has(id));
    if (!live.length) return { total: 0, learned: 0, seen: 0, due: 0 };
    const q = live.map(() => '?').join(',');
    const rows = db.prepare(`SELECT box,due_day FROM word_progress WHERE user_id=? AND word_id IN (${q})`).all(uid, ...live);
    return { total: live.length, learned: rows.filter(r => r.box >= 3).length, seen: rows.length, due: rows.filter(r => (r.due_day || '') <= today).length };
  }

  // Giáo viên giao 1 bộ từ cho lớp (group) và/hoặc danh sách email học sinh
  app.post('/api/word-sets', requireRole('teacher', 'admin'), (req, res) => {
    const b = req.body || {};
    const title = String(b.title || '').trim().slice(0, 80);
    if (!title) return res.status(400).json({ error: 'Vui lòng đặt tên cho bộ từ.' });
    let ids = Array.isArray(b.word_ids) ? b.word_ids.map(Number).filter(n => bank.byId.has(n)) : [];
    ids = Array.from(new Set(ids));
    if (!ids.length) return res.status(400).json({ error: 'Chưa chọn từ nào cho bộ từ.' });
    if (ids.length > 60) return res.status(400).json({ error: 'Mỗi bộ từ tối đa 60 mục.' });
    const deadline = b.deadline ? String(b.deadline).slice(0, 25) : null;
    if (deadline && Number.isNaN(new Date(deadline.includes('T') ? deadline : deadline.replace(' ', 'T')).getTime())) return res.status(400).json({ error: 'Hạn nộp không hợp lệ.' });
    const note = String(b.note || '').trim().slice(0, 300);

    const recipients = new Set();
    try {
      for (const gid of (Array.isArray(b.group_ids) ? b.group_ids : []).map(Number).filter(Number.isInteger)) {
        for (const r of db.prepare('SELECT user_id FROM group_members WHERE group_id=? AND user_id IS NOT NULL').all(gid)) recipients.add(Number(r.user_id));
      }
      for (const em of (Array.isArray(b.emails) ? b.emails : []).map(s => String(s).trim().toLowerCase()).filter(Boolean)) {
        const u = db.prepare("SELECT id FROM users WHERE lower(email)=? AND role='student'").get(em);
        if (u) recipients.add(Number(u.id));
      }
      if (b.all_students) for (const r of db.prepare("SELECT id FROM users WHERE role='student'").all()) recipients.add(Number(r.id));
    } catch (e) { return res.status(500).json({ error: 'Không đọc được danh sách học sinh.' }); }
    if (!recipients.size) return res.status(400).json({ error: 'Chưa có học sinh nào nhận bộ từ (chọn lớp hoặc nhập email học sinh đã đăng ký).' });

    try {
      db.exec('BEGIN');
      const r = db.prepare('INSERT INTO word_sets (teacher_id,title,word_ids,deadline,note,created_at) VALUES (?,?,?,?,?,?)')
        .run(req.user.id, title, JSON.stringify(ids), deadline, note || null, now());
      const setId = Number(r.lastInsertRowid);
      const ins = db.prepare('INSERT OR IGNORE INTO word_set_assign (set_id,user_id,assigned_at) VALUES (?,?,?)');
      for (const uid of recipients) ins.run(setId, uid, now());
      db.exec('COMMIT');
      const dl = deadline ? ' · hạn ' + deadline.replace('T', ' ') : '';
      for (const uid of recipients) {
        try { notifyUser(uid, 'word_set', '📚 Bộ từ mới: ' + title, ids.length + ' mục' + dl, 'word-hub.html?set=' + setId); } catch (e) {}
      }
      res.json({ ok: true, id: setId, count: ids.length, recipients: recipients.size });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[wordgame/sets]', e.message);
      res.status(500).json({ error: 'Không giao được bộ từ.' });
    }
  });

  // Học sinh: các bộ từ được giao cho mình + tiến độ
  app.get('/api/word-sets/mine', requireAuth, (req, res) => {
    try {
      const today = vnDay();
      const rows = db.prepare(`SELECT s.id,s.title,s.word_ids,s.deadline,s.note,s.created_at,u.name AS teacher
        FROM word_set_assign a JOIN word_sets s ON s.id=a.set_id LEFT JOIN users u ON u.id=s.teacher_id
        WHERE a.user_id=? ORDER BY s.id DESC LIMIT 30`).all(req.user.id);
      res.json({ sets: rows.map(s => {
        const ids = parseIds(s.word_ids).filter(id => bank.byId.has(id));
        const st = setStats(req.user.id, ids, today);
        return { id: s.id, title: s.title, note: s.note || '', deadline: s.deadline || '', overdue: isPastDeadline(s.deadline), teacher: s.teacher || '', ids, ...st };
      }) });
    } catch (e) { console.error('[wordgame/mine]', e.message); res.status(500).json({ error: 'Không tải được bộ từ.' }); }
  });

  // Giáo viên: danh sách bộ từ đã giao + tiến độ từng học sinh (admin thấy tất cả)
  app.get('/api/word-sets', requireRole('teacher', 'admin'), (req, res) => {
    try {
      const today = vnDay();
      const rows = req.user.role === 'admin'
        ? db.prepare('SELECT * FROM word_sets ORDER BY id DESC LIMIT 50').all()
        : db.prepare('SELECT * FROM word_sets WHERE teacher_id=? ORDER BY id DESC LIMIT 50').all(req.user.id);
      res.json({ sets: rows.map(s => {
        const ids = parseIds(s.word_ids).filter(id => bank.byId.has(id));
        const students = db.prepare(`SELECT u.id,u.name,u.email FROM word_set_assign a JOIN users u ON u.id=a.user_id WHERE a.set_id=? ORDER BY u.name`).all(s.id)
          .map(u => ({ name: u.name, email: u.email, ...setStats(u.id, ids, today) }));
        return { id: s.id, title: s.title, deadline: s.deadline || '', overdue: isPastDeadline(s.deadline), note: s.note || '', total: ids.length, created: s.created_at, students };
      }) });
    } catch (e) { console.error('[wordgame/sets]', e.message); res.status(500).json({ error: 'Không tải được danh sách bộ từ.' }); }
  });

  app.delete('/api/word-sets/:id', requireRole('teacher', 'admin'), (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: 'Mã không hợp lệ.' });
    const s = db.prepare('SELECT teacher_id FROM word_sets WHERE id=?').get(id);
    if (!s) return res.status(404).json({ error: 'Không tìm thấy bộ từ.' });
    if (req.user.role !== 'admin' && s.teacher_id !== req.user.id) return res.status(403).json({ error: 'Chỉ người giao mới được xoá.' });
    try {
      db.exec('BEGIN');
      db.prepare('DELETE FROM word_set_assign WHERE set_id=?').run(id);
      db.prepare('DELETE FROM word_sets WHERE id=?').run(id);
      db.exec('COMMIT');
      res.json({ ok: true });
    } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} res.status(500).json({ error: 'Không xoá được.' }); }
  });

  // ───────────── Nhắc học tự động (chuông + push) ─────────────
  // 1) Nhắc giữ chuỗi 🔥: từ 19h–22h (giờ VN), nếu hôm qua có học mà hôm nay chưa — mỗi người 1 lần/ngày
  // 2) Nhắc hạn bộ từ: còn dưới 24 giờ mà chưa thuộc hết — 1 lần
  function runReminders(force) {
    const out = { streak: 0, sets: 0 };
    try {
      const today = vnDay(), yesterday = vnDay(-1);
      const hourVN = new Date(Date.now() + 7 * 3600 * 1000).getUTCHours();
      if (force || (hourVN >= 19 && hourVN < 22)) {
        const rows = db.prepare(`SELECT g.user_id,g.streak FROM word_game g JOIN users u ON u.id=g.user_id
          WHERE u.role='student' AND g.streak>=1 AND g.last_day=? AND COALESCE(g.reminded_day,'')<>?`).all(yesterday, today);
        for (const r of rows) {
          db.prepare('UPDATE word_game SET reminded_day=? WHERE user_id=?').run(today, r.user_id);
          notifyUser(r.user_id, 'streak_reminder', '🔥 Chuỗi ' + r.streak + ' ngày sắp đứt!', 'Chỉ cần ôn ' + STREAK_MIN + ' từ hôm nay để giữ chuỗi nhé.', 'word-hub.html');
          out.streak++;
        }
      }
      const pend = db.prepare(`SELECT a.set_id,a.user_id,s.title,s.word_ids,s.deadline FROM word_set_assign a JOIN word_sets s ON s.id=a.set_id
        WHERE a.reminded=0 AND s.deadline IS NOT NULL AND s.deadline<>''`).all();
      for (const p of pend) {
        const hasZone = /[+-]\d{2}:?\d{2}$|Z$/i.test(p.deadline);
        const t = new Date(hasZone ? p.deadline : p.deadline.replace(' ', 'T') + '+07:00').getTime();
        const left = t - Date.now();
        if (!(left > 0 && left <= 24 * 3600 * 1000)) continue;
        const st = setStats(p.user_id, parseIds(p.word_ids), today);
        db.prepare('UPDATE word_set_assign SET reminded=1 WHERE set_id=? AND user_id=?').run(p.set_id, p.user_id);
        if (st.total && st.learned >= st.total) continue;
        notifyUser(p.user_id, 'word_set_deadline', '⏰ Sắp hết hạn bộ từ: ' + p.title, 'Bạn đã thuộc ' + st.learned + '/' + st.total + ' mục.', 'word-hub.html?set=' + p.set_id);
        out.sets++;
      }
    } catch (e) { console.error('[wordgame/reminders]', e.message); }
    return out;
  }
  const remTimer = setTimeout(function loop() { runReminders(); setInterval(function () { runReminders(); }, 30 * 60 * 1000).unref(); }, 3 * 60 * 1000);
  remTimer.unref();
  // Cho admin chạy thử/kiểm tra thủ công
  app.post('/api/admin/word-reminders/run', requireRole('admin'), (req, res) => res.json({ ok: true, ...runReminders(req.query.force === '1') }));

  // Đấu 1 với 1 bằng mã phòng
  try {
    require('./duel')(app, { db, requireAuth, now, getBank: () => bank, recordSession, vnDay, givenName, ITEM_BY_ID, LEVELS, notifyUser });
  } catch (e) { console.error('[duel] Không khởi động được:', e.message); }

  // Dùng cho kiểm thử/tool nội bộ
  return { parseSeed, vnDay, addDays, levelOf };
};
