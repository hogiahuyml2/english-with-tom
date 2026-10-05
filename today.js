'use strict';
// 🎯 "Hôm nay mình học gì?": mỗi ngày gợi ý 3–5 việc đáng làm nhất (~20–35 phút) cho từng học sinh, dựa trên dữ liệu học thật.
// Kế hoạch được chốt một lần/ngày (giờ Việt Nam) để việc đã xong vẫn hiện tick; tự đánh dấu hoàn thành từ hoạt động thật, không cần học sinh bấm.
module.exports = function (app, { db, requireAuth, now }) {
  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const one = (sql, ...a) => db.prepare(sql).get(...a);
  const all = (sql, ...a) => db.prepare(sql).all(...a);
  const vnDay = (off) => new Date(Date.now() + 7 * 3600e3 + (off || 0) * 86400000).toISOString().slice(0, 10);
  const dlMs = (s) => { if (!s) return 0; const t = Date.parse(/[+-]\d{2}:?\d{2}$|Z$/i.test(s) ? s : (/^\d{4}-\d{2}-\d{2}$/.test(String(s)) ? s + 'T23:59:59' : String(s).replace(' ', 'T')) + '+07:00'); return isNaN(t) ? 0 : t; };
  const DAY = 86400000;
  const urlFor = (skill, id) => (skill === 'Speaking' ? 'practice-speaking.html?id=' : skill === 'Writing' ? 'practice-writing.html?id=' : 'practice-quiz.html?id=') + id;
  const SK = { Reading: 'Đọc', Listening: 'Nghe', Writing: 'Viết', Speaking: 'Nói' };
  const dayHash = (uid, day) => { let h = uid * 31; for (const c of day) h = (h * 33 + c.charCodeAt(0)) >>> 0; return h; };

  /* ───────── Thu thập tình hình của học sinh ───────── */
  function situation(user) {
    const uid = user.id, today = vnDay(), t0 = Date.now();
    const sit = { uid, today };
    const g = one('SELECT streak,last_day FROM word_game WHERE user_id=?', uid) || {};
    sit.streak = (g.last_day && g.last_day >= vnDay(-1)) ? (g.streak || 0) : 0;
    sit.streakAtRisk = sit.streak > 0 && g.last_day !== today;
    const wd = one('SELECT reviews,new_words FROM word_daily WHERE user_id=? AND day=?', uid, today) || { reviews: 0, new_words: 0 };
    sit.reviewsToday = wd.reviews; sit.newToday = wd.new_words;
    sit.due = one('SELECT COUNT(*) AS c FROM word_progress WHERE user_id=? AND due_day<=?', uid, today).c;
    sit.seenWords = one('SELECT COUNT(*) AS c FROM word_progress WHERE user_id=?', uid).c;
    sit.notebookOpen = app.locals.notebookOpen ? app.locals.notebookOpen(uid) : 0;
    sit.mastered = one("SELECT COUNT(*) AS c FROM notebook_state WHERE user_id=? AND status='mastered'", uid).c;
    // bài được giao chưa nộp
    sit.assigned = [];
    const seen = new Set();
    for (const a of all(`SELECT a.id AS aid, a.exercise_id, a.deadline, e.title, e.skill FROM assignments a JOIN exercises e ON e.id=a.exercise_id
        WHERE a.student_email=? AND a.deadline IS NOT NULL ORDER BY a.id DESC LIMIT 300`, user.email)) {
      if (seen.has(a.exercise_id)) continue; seen.add(a.exercise_id);
      if (one('SELECT 1 AS c FROM submissions WHERE user_id=? AND exercise_id=?', uid, a.exercise_id)) continue;
      const d = dlMs(a.deadline); if (!d) continue;
      if (d < t0 - 14 * DAY || d > t0 + 3 * DAY) continue;
      sit.assigned.push({ aid: a.aid, exercise_id: a.exercise_id, title: a.title, skill: a.skill, d, over: d < t0 });
    }
    for (const a of all(`SELECT a.id,a.exam,a.deadline,a.parts FROM speaking_assign a WHERE a.group_id IN (SELECT group_id FROM group_members WHERE user_id=?) ORDER BY a.id DESC LIMIT 20`, uid)) {
      if (one("SELECT 1 AS c FROM speaking_sessions WHERE user_id=? AND assign_id=? AND status IN ('grading','done')", uid, a.id)) continue;
      const d = a.deadline ? dlMs(a.deadline) : 0; if (d && (d < t0 - 14 * DAY || d > t0 + 3 * DAY)) continue; if (!d) continue; // chỉ gợi ý khi có hạn gần — không ép
      sit.assigned.push({ aid: 'sp' + a.id, speak: a.exam, parts: a.parts, d, over: d < t0, title: 'Bài Speaking ' + a.exam.toUpperCase() + ' thầy/cô giao' });
    }
    sit.assigned.sort((x, y) => (y.over - x.over) || x.d - y.d);
    // kỹ năng yếu nhất (cần ≥ 3 bài đã chấm theo kỹ năng) + chương trình hay làm
    const graded = all(`SELECT e.skill, e.program, s.score, s.max_score FROM submissions s JOIN exercises e ON e.id=s.exercise_id
      WHERE s.user_id=? AND s.status='graded' AND s.max_score>0 AND s.score IS NOT NULL ORDER BY s.id DESC LIMIT 60`, uid);
    const bySk = {}, byPg = {};
    for (const r of graded) { (bySk[r.skill] = bySk[r.skill] || []).push(r.score / r.max_score * 100); byPg[r.program] = (byPg[r.program] || 0) + 1; }
    const sk = Object.entries(bySk).filter(([, a]) => a.length >= 2).map(([k, a]) => [k, a.reduce((x, y) => x + y, 0) / a.length]).sort((x, y) => x[1] - y[1]);
    sit.weak = sk.length >= 2 && sk[0][1] < sk[sk.length - 1][1] - 5 ? { skill: sk[0][0], avg: Math.round(sk[0][1]) } : (sk.length === 1 && sk[0][1] < 70 ? { skill: sk[0][0], avg: Math.round(sk[0][1]) } : null);
    sit.program = Object.entries(byPg).sort((x, y) => y[1] - x[1]).map((x) => x[0])[0] || null;
    sit.hasPlacement = !!one("SELECT 1 AS c FROM placement_attempts WHERE user_id=? AND status='done' AND voided=0", uid);
    let lvl = null; try { const pa = one("SELECT result FROM placement_attempts WHERE user_id=? AND status='done' AND voided=0 ORDER BY id DESC LIMIT 1", uid); lvl = pa && (J(pa.result, {}) || {}).level; } catch (_) {}
    sit.level = lvl || null;
    sit.lastDict = one("SELECT finished_at FROM dictation_runs WHERE user_id=? AND mode='dictate' AND finished_at IS NOT NULL ORDER BY id DESC LIMIT 1", uid);
    sit.lastSpeak = one("SELECT submitted_at FROM speaking_sessions WHERE user_id=? AND status='done' ORDER BY id DESC LIMIT 1", uid);
    sit.inClass = !!one('SELECT 1 AS c FROM group_members WHERE user_id=? LIMIT 1', uid);
    return sit;
  }

  const speakExam = (s) => { const p = String(s.program || '').toLowerCase(); if (['ket', 'pet', 'fce', 'aptis', 'ielts'].includes(p)) return p; const l = String(s.level || ''); return /A1|A2/.test(l) ? 'ket' : /B1/.test(l) ? 'pet' : /B2|C/.test(l) ? 'fce' : 'ket'; };

  /* ───────── Chọn việc ───────── */
  function choose(s) {
    const jit = (k) => (dayHash(s.uid, s.today + k) % 7) - 3, C = [];
    if (!s.hasPlacement) C.push({ score: 100, kind: 'placement', icon: '🎯', title: 'Làm bài Kiểm tra đầu vào', desc: 'Biết trình độ hiện tại để web gợi ý đúng bài cho bạn (khoảng 20 phút).', min: 20, link: 'placement.html' });
    s.assigned.slice(0, 2).forEach((a, i) => {
      const hrs = Math.round((a.d - Date.now()) / 3600e3);
      C.push({ score: (a.over ? 95 : hrs <= 24 ? 92 : 80) - i, kind: 'assign', icon: a.over ? '⚠️' : '⏰', title: a.title, desc: a.over ? 'Bài được giao đã QUÁ HẠN — nộp sớm nhất có thể.' : hrs <= 24 ? 'Bài được giao — còn khoảng ' + Math.max(1, hrs) + ' giờ.' : 'Bài được giao — hạn trong ' + Math.ceil(hrs / 24) + ' ngày.', min: a.speak ? 10 : (a.skill === 'Writing' || a.skill === 'Speaking' ? 25 : 15), link: a.speak ? 'speaking.html' : urlFor(a.skill, a.exercise_id) + '&assigned=1', aid: a.aid, exercise_id: a.exercise_id, spassign: a.speak ? Number(String(a.aid).slice(2)) : 0 });
    });
    if (s.due >= 1) { const n = Math.min(20, Math.max(8, s.due)); C.push({ score: 76 + (s.streakAtRisk ? 10 : 0) + jit('w') / 3, kind: 'words', icon: '🧠', title: 'Ôn ' + n + ' từ vựng đến hạn', desc: s.streakAtRisk ? 'Giữ chuỗi ' + s.streak + ' ngày liên tiếp của bạn! 🔥' : 'Ôn đúng lúc sắp quên để nhớ lâu hơn.', min: 7, link: 'word-hub.html', target: Math.min(n, 15) }); }
    else C.push({ score: 56, kind: 'newwords', icon: '🌱', title: 'Học 5 từ mới', desc: s.seenWords ? 'Hôm nay chưa có từ nào đến hạn ôn — học thêm từ mới nhé.' : 'Bắt đầu xây vốn từ của bạn.', min: 6, link: 'word-hub.html', target: 5 });
    if (s.notebookOpen >= 1) { const n = Math.min(5, s.notebookOpen); C.push({ score: 70 + Math.min(10, s.notebookOpen) + jit('n') / 3, kind: 'notebook', icon: '📒', title: 'Sửa ' + n + ' câu trong Sổ lỗi sai', desc: 'Câu từng làm sai — ôn tới khi nắm chắc.', min: 5, link: 'notebook.html', target: n }); }
    if (s.weak) C.push({ score: 66 + jit('k') / 3, kind: 'weak', icon: '💪', title: 'Luyện kỹ năng ' + (SK[s.weak.skill] || s.weak.skill) + ' (đang yếu nhất)', desc: 'Điểm trung bình kỹ năng này mới ' + s.weak.avg + '% — làm thêm 1 bài để cải thiện.', min: s.weak.skill === 'Writing' ? 25 : 15, skill: s.weak.skill, link: 'exercises.html' });
    const daysSince = (r) => r && r.finished_at ? (Date.now() - Date.parse(r.finished_at)) / DAY : (r && r.submitted_at ? (Date.now() - Date.parse(r.submitted_at)) / DAY : 99);
    C.push({ score: 58 + Math.min(10, daysSince(s.lastDict)) + jit('d') / 2, kind: 'dict', icon: '🎧', title: 'Chép chính tả 1 lượt', desc: 'Luyện nghe và viết chính xác (khoảng 6–8 phút).', min: 7, link: 'dictation.html' });
    const ds = daysSince(s.lastSpeak);
    C.push({ score: 50 + Math.min(18, ds * 2) + jit('s') / 2, kind: 'speak', icon: '🎤', title: 'Luyện nói 1 phần Speaking', desc: 'Ghi âm và nhận nhận xét từ AI — kỹ năng khó luyện nhất ở nhà.', min: 8, link: 'speaking.html?exam=' + speakExam(s) });
    C.sort((a, b) => b.score - a.score);
    const out = []; let mins = 0;
    for (const c of C) { if (out.length >= 5) break; if (out.length >= 3 && mins + c.min > 38) continue; out.push(c); mins += c.min; }
    return out.map((c, i) => Object.assign({ id: c.kind + (c.aid ? ':' + c.aid : '') + ':' + i }, c, { score: undefined }));
  }

  /* ───────── Đánh giá hoàn thành bằng hoạt động thật ───────── */
  function snapshot(s) { return { rev: s.reviewsToday, nw: s.newToday, mast: s.mastered }; }
  function isDone(t, s, base, since) {
    const uid = s.uid;
    switch (t.kind) {
      case 'placement': return s.hasPlacement;
      case 'assign': if (t.spassign) return !!one("SELECT 1 AS c FROM speaking_sessions WHERE user_id=? AND assign_id=? AND status IN ('grading','done')", uid, t.spassign); return !!one('SELECT 1 AS c FROM submissions WHERE user_id=? AND exercise_id=?', uid, t.exercise_id);
      case 'words': return s.reviewsToday - base.rev >= (t.target || 10);
      case 'newwords': return s.newToday - base.nw >= (t.target || 5);
      case 'notebook': return s.mastered - base.mast >= (t.target || 3);
      case 'weak': return !!one('SELECT 1 AS c FROM submissions x JOIN exercises e ON e.id=x.exercise_id WHERE x.user_id=? AND e.skill=? AND x.submitted_at>=?', uid, t.skill, since);
      case 'dict': return !!one("SELECT 1 AS c FROM dictation_runs WHERE user_id=? AND mode='dictate' AND finished_at>=?", uid, since);
      case 'speak': return !!one("SELECT 1 AS c FROM speaking_sessions WHERE user_id=? AND status IN ('grading','done') AND submitted_at>=?", uid, since);
    }
    return false;
  }

  function weekDots(uid) {
    const rows = new Map(all('SELECT day,done_n,total,done_all FROM today_plan WHERE user_id=? AND day>=?', uid, vnDay(-6)).map((r) => [r.day, r]));
    const out = [];
    for (let i = 6; i >= 0; i--) { const d = vnDay(-i), r = rows.get(d), wd = new Date(d + 'T00:00:00Z').getUTCDay(); out.push({ day: d, dow: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][wd], state: !r ? 'none' : r.done_all ? 'full' : r.done_n > 0 ? 'part' : 'none', today: i === 0 }); }
    return out;
  }

  app.get('/api/today', requireAuth, (req, res) => {
    const user = req.user;
    if (user.role !== 'student') return res.json({ staff: true, tasks: [], dots: [] });
    const s = situation(user), day = s.today;
    let row = one('SELECT * FROM today_plan WHERE user_id=? AND day=?', user.id, day), plan;
    if (!row) {
      const tasks = choose(s), base = snapshot(s);
      plan = { tasks, base, since: now() };
      db.prepare('INSERT OR IGNORE INTO today_plan (user_id,day,tasks,total,created_at) VALUES (?,?,?,?,?)').run(user.id, day, JSON.stringify(plan), tasks.length, now());
      row = one('SELECT * FROM today_plan WHERE user_id=? AND day=?', user.id, day);
    } else plan = J(row.tasks, { tasks: [], base: snapshot(s), since: row.created_at });
    // việc "Luyện kỹ năng yếu": gắn đúng 1 bài chưa làm (chọn khi hiển thị)
    const tasks = plan.tasks.map((t) => {
      const done = isDone(t, s, plan.base, plan.since);
      let link = t.link;
      if (t.kind === 'weak' && !done) {
        const ex = one(`SELECT id,title,skill FROM exercises WHERE is_private=0 AND skill=? AND id NOT IN (SELECT exercise_id FROM submissions WHERE user_id=?) ${s.program ? 'AND program=?' : ''} ORDER BY id LIMIT 1`, ...(s.program ? [t.skill, user.id, s.program] : [t.skill, user.id]));
        if (ex) link = urlFor(ex.skill, ex.id); else link = 'exercises.html';
      }
      return { id: t.id, kind: t.kind, icon: t.icon, title: t.title, desc: t.desc, min: t.min, link, done };
    });
    const n = tasks.filter((t) => t.done).length, allDone = tasks.length > 0 && n === tasks.length;
    let reward = null;
    if (n !== row.done_n || (allDone && !row.done_all)) db.prepare('UPDATE today_plan SET done_n=?, done_all=? WHERE user_id=? AND day=?').run(n, allDone ? 1 : 0, user.id, day);
    if (allDone && !row.rewarded) {
      const upd = db.prepare('UPDATE today_plan SET rewarded=1 WHERE user_id=? AND day=? AND rewarded=0').run(user.id, day);
      if (upd.changes) { db.prepare('INSERT OR IGNORE INTO word_game (user_id) VALUES (?)').run(user.id); db.prepare('UPDATE word_game SET coins=coins+10 WHERE user_id=?').run(user.id); reward = { coins: 10 }; }
    }
    const left = tasks.filter((t) => !t.done).reduce((a, t) => a + t.min, 0);
    const headline = !tasks.length ? 'Hôm nay chưa có gợi ý — bạn cứ học điều mình thích nhé!' : allDone ? 'Tuyệt vời! Bạn đã hoàn thành kế hoạch hôm nay 🎉' : n === 0 ? 'Chỉ khoảng ' + left + ' phút cho hôm nay. Bắt đầu từ việc đầu tiên nhé!' : 'Làm tốt lắm! Còn ' + (tasks.length - n) + ' việc (khoảng ' + left + ' phút).';
    res.set('Cache-Control', 'no-store');
    res.json({ day, tasks, done_n: n, total: tasks.length, minutes_left: left, all_done: allDone, reward, streak: s.streak, headline, dots: weekDots(user.id) });
  });
};
