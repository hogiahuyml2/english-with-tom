// Đấu 1 với 1 bằng mã phòng: hai học sinh thi cùng 10 câu từ vựng, ai nhiều điểm hơn (đúng + nhanh) thì thắng.
// Máy chủ giữ đáp án và tự đo thời gian từng câu → client không thể gian lận điểm hay tốc độ.
// Đồng bộ bằng polling (1,5 giây/lần) — không cần WebSocket nên chạy ổn trên Railway.
'use strict';
const crypto = require('crypto');

const Q_COUNT = 10;
const Q_TIME_MS = 15000;          // mỗi câu 15 giây
const FEEDBACK_MS = 800;          // thời gian hiện đáp án giữa các câu (không tính vào tốc độ)
const COUNTDOWN_MS = 4000;        // đếm ngược sau khi đối thủ vào phòng
const WAIT_TTL_MS = 10 * 60 * 1000;
const IDLE_FORFEIT_MS = 60 * 1000; // một bên xong rồi mà bên kia bỏ dở quá 60s → xử thua
const MAX_REWARDED_PER_DAY = 5;    // tối đa 5 trận/ngày được cộng thưởng (chống cày bằng 2 tài khoản)
const MAX_SAME_PAIR_PER_DAY = 2;
const WIN_BONUS_XP = 25, DRAW_BONUS_XP = 10, PLAY_BONUS_XP = 5;
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // bỏ ký tự dễ nhầm (O/0, I/1)

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(0, i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function newCode() { let c = ''; for (let i = 0; i < 5; i++) c += CODE_CHARS[crypto.randomInt(0, CODE_CHARS.length)]; return c; }
const J = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };

module.exports = function registerDuel(app, { db, requireAuth, now, getBank, recordSession, vnDay, givenName, ITEM_BY_ID, LEVELS, notifyUser }) {
  function buildQuestions(level) {
    const bank = getBank().list;
    const pool = bank.filter(w => w.kind === 'word' && w.vi && (level === 'all' || w.level === level));
    if (pool.length < 14) return null;
    const picks = shuffle(pool).slice(0, Q_COUNT);
    return picks.map((w, i) => {
      const type = i % 2; // 0: từ tiếng Anh → chọn nghĩa; 1: nghĩa → chọn từ tiếng Anh
      const others = shuffle(pool.filter(x => x.id !== w.id && x.word.toLowerCase() !== w.word.toLowerCase() && x.vi !== w.vi)).slice(0, 3);
      const answerText = type === 0 ? w.vi : w.word;
      const opts = shuffle([answerText].concat(others.map(o => type === 0 ? o.vi : o.word)));
      return { id: w.id, type, prompt: type === 0 ? w.word : w.vi, pos: w.pos || '', opts, ans: opts.indexOf(answerText) };
    });
  }

  const get = (code) => db.prepare('SELECT * FROM word_duels WHERE code=?').get(code);
  const userName = (id) => { const u = db.prepare('SELECT name FROM users WHERE id=?').get(id); return u ? u.name : '?'; };
  const avatarOf = (id) => { const g = db.prepare('SELECT avatar FROM word_game WHERE user_id=?').get(id); return g ? ((ITEM_BY_ID.get(g.avatar) || {}).icon || '') : ''; };
  function role(d, uid) { return d.host_id === uid ? 'host' : d.guest_id === uid ? 'guest' : null; }
  const ansKey = (r) => r === 'host' ? 'host_ans' : 'guest_ans';
  const sum = (arr, f) => arr.reduce((s, x) => s + f(x), 0);

  // ── Chốt kết quả + phát thưởng (chỉ chạy 1 lần nhờ cập nhật status trước) ──
  function finalize(d, why) {
    const fresh = get(d.code);
    if (!fresh || fresh.status !== 'playing') return fresh;
    const qs = J(fresh.questions, []);
    const ha = J(fresh.host_ans, []), ga = J(fresh.guest_ans, []);
    const fill = (a) => { const out = a.slice(); while (out.length < qs.length) out.push({ c: -1, ok: false, pts: 0, ms: Q_TIME_MS, at: Date.now() }); return out; };
    const H = fill(ha), G = fill(ga);
    const stat = (a) => ({ score: sum(a, x => x.pts), correct: a.filter(x => x.ok).length, ms: sum(a.filter(x => x.ok), x => x.ms) });
    const hs = stat(H), gs = stat(G);
    let winner = null;
    if (hs.score !== gs.score) winner = hs.score > gs.score ? fresh.host_id : fresh.guest_id;
    else if (hs.correct !== gs.correct) winner = hs.correct > gs.correct ? fresh.host_id : fresh.guest_id;
    else if (hs.ms !== gs.ms) winner = hs.ms < gs.ms ? fresh.host_id : fresh.guest_id;
    const day = vnDay();
    const result = { host: hs, guest: gs, why: why || 'done', rewards: {} };
    db.prepare("UPDATE word_duels SET status='done', winner_id=?, host_ans=?, guest_ans=?, finished_day=?, result=? WHERE code=? AND status='playing'")
      .run(winner, JSON.stringify(H), JSON.stringify(G), day, JSON.stringify(result), fresh.code);
    // Thưởng cho từng người (có trần/ngày và trần theo cặp)
    const rewardOne = (uid, oppId, answers, st) => {
      const today = Number(db.prepare("SELECT COUNT(*) c FROM word_duels WHERE finished_day=? AND status='done' AND code<>? AND (host_id=? OR guest_id=?) AND json_extract(result,'$.rewards.u'||?)='1'").get(day, fresh.code, uid, uid, uid).c);
      const pair = Number(db.prepare("SELECT COUNT(*) c FROM word_duels WHERE finished_day=? AND status='done' AND code<>? AND ((host_id=? AND guest_id=?) OR (host_id=? AND guest_id=?))").get(day, fresh.code, uid, oppId, oppId, uid).c);
      const capped = today >= MAX_REWARDED_PER_DAY || pair >= MAX_SAME_PAIR_PER_DAY;
      const results = qs.map((q, i) => ({ id: q.id, ok: !!answers[i].ok }));
      // Quá giới hạn thưởng trong ngày → trận vẫn tính thắng/thua nhưng không cộng XP/xu (chống cày bằng 2 tài khoản)
      if (capped) { result.rewards['u' + uid] = '2'; result.rewards[uid] = { xp: 0, coins: 0, capped: true, badges: [] }; return; }
      const bonus = winner === uid ? WIN_BONUS_XP : winner === null ? DRAW_BONUS_XP : PLAY_BONUS_XP;
      try {
        const r = recordSession(uid, userName(uid), 'duel', results, bonus);
        result.rewards['u' + uid] = '1';
        result.rewards[uid] = { xp: r.gained.xp, coins: r.gained.coins, capped: false, badges: (r.newBadges || []).map(b => ({ icon: b.icon, name: b.name, reward: b.reward || 0 })) };
      } catch (e) { console.error('[duel/reward]', e.message); result.rewards[uid] = { xp: 0, coins: 0, capped: false, error: true }; }
    };
    rewardOne(fresh.host_id, fresh.guest_id, H, hs);
    rewardOne(fresh.guest_id, fresh.host_id, G, gs);
    db.prepare('UPDATE word_duels SET result=? WHERE code=?').run(JSON.stringify(result), fresh.code);
    return get(fresh.code);
  }

  // Dọn trạng thái "treo": phòng chờ quá hạn, đối thủ bỏ dở
  function refresh(d) {
    if (!d) return d;
    const t = Date.now();
    if (d.status === 'waiting' && t - d.created_at > WAIT_TTL_MS) { db.prepare("UPDATE word_duels SET status='expired' WHERE code=? AND status='waiting'").run(d.code); return get(d.code); }
    if (d.status === 'playing') {
      const ha = J(d.host_ans, []), ga = J(d.guest_ans, []);
      if (ha.length >= Q_COUNT && ga.length >= Q_COUNT) return finalize(d, 'done');
      const hardEnd = d.start_at + Q_COUNT * (Q_TIME_MS + FEEDBACK_MS + 4000) + 15000;
      const lastAt = Math.max(ha.length ? ha[ha.length - 1].at : 0, ga.length ? ga[ga.length - 1].at : 0);
      const oneDone = ha.length >= Q_COUNT || ga.length >= Q_COUNT;
      if (t > hardEnd || (oneDone && t - lastAt > IDLE_FORFEIT_MS)) return finalize(d, 'timeout');
    }
    return d;
  }

  function stateFor(d, uid) {
    const r = role(d, uid), t = Date.now();
    const qs = J(d.questions, []);
    const mine = J(d[ansKey(r)], []), theirs = J(d[ansKey(r === 'host' ? 'guest' : 'host')], []);
    const oppId = r === 'host' ? d.guest_id : d.host_id;
    const started = d.status === 'playing' && d.start_at && t >= d.start_at;
    const out = {
      code: d.code, status: d.status, level: d.level, role: r, now: t, startAt: d.start_at || null, qCount: Q_COUNT, qTimeMs: Q_TIME_MS,
      opp: oppId ? { name: givenName(userName(oppId)), avatar: avatarOf(oppId) } : null,
      me: { name: givenName(userName(uid)), avatar: avatarOf(uid) },
      answered: mine.length, oppAnswered: theirs.length, myScore: mine.reduce((s, x) => s + x.pts, 0),
      started,
      questions: started ? qs.map(q => ({ prompt: q.prompt, pos: q.pos, type: q.type, opts: q.opts })) : null,
      lastQuestionAt: mine.length ? mine[mine.length - 1].at : d.start_at
    };
    if (d.status === 'done') {
      const res = J(d.result, {});
      const my = r === 'host' ? res.host : res.guest, op = r === 'host' ? res.guest : res.host;
      out.result = { winner: d.winner_id === null ? 'draw' : (d.winner_id === uid ? 'me' : 'opp'), me: my, opp: op, why: res.why, reward: (res.rewards || {})[uid] || null,
        review: qs.map((q, i) => ({ prompt: q.prompt, answer: q.opts[q.ans], mine: mine[i] ? mine[i].c : -1, ok: mine[i] ? mine[i].ok : false, oppOk: theirs[i] ? theirs[i].ok : false })) };
    }
    return out;
  }

  // ───────────── API ─────────────
  app.get('/api/duel/mine', requireAuth, (req, res) => {
    try {
      const rows = db.prepare("SELECT * FROM word_duels WHERE (host_id=? OR guest_id=?) AND status IN ('waiting','playing') ORDER BY created_at DESC LIMIT 3").all(req.user.id, req.user.id);
      for (const d of rows) { const f = refresh(d); if (f && (f.status === 'waiting' || f.status === 'playing')) return res.json({ code: f.code, status: f.status }); }
      res.json({ code: null });
    } catch (e) { console.error('[duel/mine]', e.message); res.status(500).json({ error: 'Không tải được trận đấu.' }); }
  });

  app.post('/api/duel', requireAuth, (req, res) => {
    try {
      const uid = req.user.id;
      const active = db.prepare("SELECT * FROM word_duels WHERE (host_id=? OR guest_id=?) AND status IN ('waiting','playing')").all(uid, uid);
      for (const d of active) { const f = refresh(d); if (f && (f.status === 'waiting' || f.status === 'playing')) return res.status(409).json({ error: 'Bạn đang có một trận chưa kết thúc.', code: f.code }); }
      const level = LEVELS.includes((req.body || {}).level) ? req.body.level : 'all';
      const qs = buildQuestions(level);
      if (!qs) return res.status(400).json({ error: 'Cấp độ này chưa đủ từ để đấu (cần ≥ 14 từ). Hãy chọn "Tất cả".' });
      let code = newCode();
      for (let i = 0; i < 8 && get(code); i++) code = newCode();
      db.prepare("INSERT INTO word_duels (code,host_id,level,status,questions,created_at) VALUES (?,?,?,'waiting',?,?)").run(code, uid, level, JSON.stringify(qs), Date.now());
      res.json({ code });
    } catch (e) { console.error('[duel/create]', e.message); res.status(500).json({ error: 'Không tạo được phòng.' }); }
  });

  app.post('/api/duel/join', requireAuth, (req, res) => {
    try {
      const uid = req.user.id;
      const code = String((req.body || {}).code || '').trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8);
      if (code.length !== 5) return res.status(400).json({ error: 'Mã phòng gồm 5 ký tự.' });
      // Chống dò mã phòng: tối đa 20 lần thử/10 phút/người
      const key = 'duelj' + uid, t = Date.now(); const bucket = (registerDuel._tries = registerDuel._tries || new Map());
      const b = bucket.get(key) && bucket.get(key).r > t ? bucket.get(key) : { n: 0, r: t + 600000 }; b.n++; bucket.set(key, b);
      if (b.n > 20) return res.status(429).json({ error: 'Bạn thử mã quá nhiều lần. Hãy đợi vài phút.' });
      let d = refresh(get(code));
      if (!d) return res.status(404).json({ error: 'Không tìm thấy phòng này. Hãy kiểm tra lại mã.' });
      if (d.host_id === uid || d.guest_id === uid) return res.json({ code: d.code });
      if (d.status !== 'waiting') return res.status(409).json({ error: d.status === 'expired' ? 'Phòng đã hết hạn.' : 'Phòng này đã đủ người hoặc đã kết thúc.' });
      const busy = db.prepare("SELECT code FROM word_duels WHERE (host_id=? OR guest_id=?) AND status IN ('waiting','playing')").all(uid, uid).map(x => refresh(get(x.code))).filter(x => x && (x.status === 'waiting' || x.status === 'playing'));
      if (busy.length) return res.status(409).json({ error: 'Bạn đang có một trận chưa kết thúc.', code: busy[0].code });
      const r = db.prepare("UPDATE word_duels SET guest_id=?, status='playing', start_at=? WHERE code=? AND status='waiting' AND guest_id IS NULL").run(uid, Date.now() + COUNTDOWN_MS, code);
      if (!Number(r.changes)) return res.status(409).json({ error: 'Phòng này vừa có người khác vào.' });
      try { notifyUser(d.host_id, 'duel', '⚔️ ' + givenName(req.user.name) + ' đã vào phòng đấu của bạn!', 'Trận đấu sắp bắt đầu.', 'arcade.html?duel=' + code); } catch (e) {}
      res.json({ code });
    } catch (e) { console.error('[duel/join]', e.message); res.status(500).json({ error: 'Không vào được phòng.' }); }
  });

  app.get('/api/duel/:code', requireAuth, (req, res) => {
    try {
      const code = String(req.params.code || '').toUpperCase();
      const d = refresh(get(code));
      if (!d || !role(d, req.user.id)) return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
      res.json(stateFor(d, req.user.id));
    } catch (e) { console.error('[duel/get]', e.message); res.status(500).json({ error: 'Không tải được trận đấu.' }); }
  });

  app.post('/api/duel/:code/cancel', requireAuth, (req, res) => {
    const code = String(req.params.code || '').toUpperCase();
    const r = db.prepare("UPDATE word_duels SET status='cancelled' WHERE code=? AND host_id=? AND status='waiting'").run(code, req.user.id);
    res.json({ ok: !!Number(r.changes) });
  });

  app.post('/api/duel/:code/answer', requireAuth, (req, res) => {
    try {
      const uid = req.user.id, code = String(req.params.code || '').toUpperCase();
      let d = refresh(get(code));
      const r = d && role(d, uid);
      if (!r) return res.status(404).json({ error: 'Không tìm thấy trận đấu.' });
      if (d.status !== 'playing') return res.status(409).json({ error: 'Trận đấu đã kết thúc.', state: stateFor(d, uid) });
      const t = Date.now();
      if (t < d.start_at) return res.status(409).json({ error: 'Trận đấu chưa bắt đầu.' });
      const qs = J(d.questions, []), mine = J(d[ansKey(r)], []);
      const qi = Number((req.body || {}).q), choice = Number((req.body || {}).choice);
      if (!Number.isInteger(qi) || qi !== mine.length || qi >= qs.length) return res.status(409).json({ error: 'Câu hỏi không khớp.', answered: mine.length });
      if (!Number.isInteger(choice) || choice < -1 || choice > 3) return res.status(400).json({ error: 'Đáp án không hợp lệ.' });
      const from = qi === 0 ? d.start_at : mine[qi - 1].at + FEEDBACK_MS;
      const elapsed = Math.max(0, t - from);
      const timedOut = choice === -1 || elapsed > Q_TIME_MS + 2500;
      const ok = !timedOut && choice === qs[qi].ans;
      const pts = ok ? 100 + Math.max(0, 50 - Math.floor(Math.min(elapsed, Q_TIME_MS) / 300)) : 0;
      mine.push({ c: timedOut ? -1 : choice, ok, pts, ms: Math.min(elapsed, Q_TIME_MS), at: t });
      db.prepare('UPDATE word_duels SET ' + ansKey(r) + '=? WHERE code=? AND status=\'playing\'').run(JSON.stringify(mine), code);
      let fin = refresh(get(code));
      const out = { ok, pts, correct: qs[qi].ans, answered: mine.length, at: t, score: mine.reduce((s, x) => s + x.pts, 0) };
      if (fin && fin.status === 'done') out.state = stateFor(fin, uid);
      res.json(out);
    } catch (e) { console.error('[duel/answer]', e.message); res.status(500).json({ error: 'Không ghi được đáp án.' }); }
  });
};
