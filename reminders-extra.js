'use strict';
// ⏰ Nhắc học sinh chưa nộp — phần bổ sung: nhắc "1–2 giờ cuối" cho bài được giao thường, và nhắc 24 giờ + 2 giờ cho BÀI TỰ LUẬN và ĐỀ TRẮC NGHIỆM.
// (Bài giao thường đã có nhắc 24 giờ + nhắc quá hạn ở server.js.) Mỗi học sinh chỉ bị nhắc 1 lần cho mỗi mốc (bảng reminder_log).
// Giáo viên tắt/bật bằng users.auto_remind (cùng công tắc với nhắc cũ).
module.exports = function (app, { db, requireRole, notifyUser }) {
  db.exec(`CREATE TABLE IF NOT EXISTS reminder_log (kind TEXT NOT NULL, ref INTEGER NOT NULL, user_id INTEGER NOT NULL, stage TEXT NOT NULL, at TEXT NOT NULL, PRIMARY KEY (kind, ref, user_id, stage))`);
  const all = (sql, ...a) => db.prepare(sql).all(...a), one = (sql, ...a) => db.prepare(sql).get(...a);
  const H = 3600e3;
  // Hạn không có múi giờ → coi là giờ Việt Nam (UTC+7)
  const dlMs = (s) => { if (!s) return 0; s = String(s).trim().replace(' ', 'T'); if (/Z$|[+-]\d\d:?\d\d$/.test(s)) return Date.parse(s) || 0; if (/^\d{4}-\d\d-\d\d$/.test(s)) s += 'T23:59:00'; const t = Date.parse(s + 'Z'); return t ? t - 7 * H : 0; };
  const fmtVN = (ms) => new Date(ms).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
  const stageOf = (left) => (left <= 0 ? null : left <= 2 * H ? 'h2' : left <= 24 * H ? 'h24' : null);
  const logged = (kind, ref, uid, stage) => !!one('SELECT 1 FROM reminder_log WHERE kind=? AND ref=? AND user_id=? AND stage=?', kind, ref, uid, stage);
  const mark = (kind, ref, uid, stage) => db.prepare('INSERT OR IGNORE INTO reminder_log (kind,ref,user_id,stage,at) VALUES (?,?,?,?,?)').run(kind, ref, uid, stage, new Date().toISOString());
  const autoOn = (teacherId) => { try { const r = one('SELECT auto_remind FROM users WHERE id=?', teacherId); return !r || r.auto_remind !== 0; } catch (_) { return true; } };
  const msgFor = (stage, left, what, title, dl) => stage === 'h2'
    ? ['🚨 Chỉ còn ' + Math.max(1, Math.ceil(left / (30 * 60e3)) * 30) + ' phút: ' + title, what + ' hết hạn lúc ' + dl + ' mà bạn chưa nộp. Làm ngay nhé!']
    : ['⏰ Còn khoảng ' + Math.max(1, Math.round(left / H)) + ' giờ: ' + title, what + ' hết hạn lúc ' + dl + '. Bạn chưa nộp — làm ngay nhé!'];

  function run() {
    const t0 = Date.now(), stat = { assign: 0, essay: 0, mcq: 0 };
    // 1) Bài giao thường — chỉ mốc 2 giờ (mốc 24 giờ do server.js lo)
    all(`SELECT a.id, a.deadline, a.assigned_by, e.title, e.id AS ex_id, u.id AS uid FROM assignments a JOIN exercises e ON e.id=a.exercise_id JOIN users u ON u.email=a.student_email
         WHERE a.deadline IS NOT NULL AND substr(a.deadline,1,10) >= date('now','-1 day') AND NOT EXISTS (SELECT 1 FROM submissions s WHERE s.user_id=u.id AND s.exercise_id=a.exercise_id) LIMIT 4000`).forEach((r) => {
      const d = dlMs(r.deadline), left = d - t0; if (!d || stageOf(left) !== 'h2' || !autoOn(r.assigned_by) || logged('ex', r.id, r.uid, 'h2')) return;
      mark('ex', r.id, r.uid, 'h2'); const m = msgFor('h2', left, 'Bài tập', r.title, fmtVN(d)); try { notifyUser(r.uid, 'deadline_final', m[0], m[1], '/assigned.html'); stat.assign++; } catch (_) { /* bỏ qua */ }
    });
    // 2) Bài tự luận — học sinh chưa nộp (chưa bắt đầu hoặc đang viết dở)
    all("SELECT * FROM essay_tasks WHERE status='open' AND deadline IS NOT NULL").forEach((t) => {
      const d = dlMs(t.deadline), left = d - t0, stage = stageOf(left); if (!d || !stage || !autoOn(t.teacher_id)) return;
      const ids = new Set(); all('SELECT user_id, group_id FROM essay_targets WHERE task_id=?', t.id).forEach((r) => { if (r.user_id) ids.add(r.user_id); if (r.group_id) all("SELECT DISTINCT gm.user_id FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? AND u.role='student'", r.group_id).forEach((m) => ids.add(m.user_id)); });
      ids.forEach((uid) => {
        const s = one('SELECT status FROM essay_subs WHERE task_id=? AND user_id=?', t.id, uid); if (s && s.status !== 'draft') return; if (logged('essay', t.id, uid, stage)) return;
        mark('essay', t.id, uid, stage); const m = msgFor(stage, left, 'Bài tự luận', t.title, fmtVN(d)); try { notifyUser(uid, 'essay_reminder', m[0], m[1], 'essay.html?id=' + t.id); stat.essay++; } catch (_) { /* bỏ qua */ }
      });
    });
    // 3) Đề trắc nghiệm
    all("SELECT * FROM mcq_tests WHERE deadline IS NOT NULL AND deadline != ''").forEach((t) => {
      const d = dlMs(t.deadline), left = d - t0, stage = stageOf(left); if (!d || !stage || !autoOn(t.teacher_id)) return;
      all('SELECT user_id FROM mcq_assign WHERE test_id=?', t.id).forEach((a) => {
        const done = one("SELECT 1 FROM mcq_attempts WHERE test_id=? AND user_id=? AND status='done'", t.id, a.user_id); if (done || logged('mcq', t.id, a.user_id, stage)) return;
        mark('mcq', t.id, a.user_id, stage); const m = msgFor(stage, left, 'Đề trắc nghiệm', t.title, fmtVN(d)); try { notifyUser(a.user_id, 'mcq_reminder', m[0], m[1], 'mcq.html?id=' + t.id); stat.mcq++; } catch (_) { /* bỏ qua */ }
      });
    });
    Object.assign(stat, weakWordsReminder(false));
    if (stat.assign + stat.essay + stat.mcq) console.log('📬 Nhắc bổ sung:', JSON.stringify(stat));
    return stat;
  }
  // 🔁 Nhắc ôn từ hay sai: mỗi sáng (6–10 giờ VN) báo cho học sinh có từ sai ngày hôm qua. Mỗi ngày tối đa 1 lần / học sinh.
  function weakWordsReminder(force) {
    const vn = new Date(Date.now() + 7 * H), hour = vn.getUTCHours(), today = vn.toISOString().slice(0, 10), yest = new Date(vn.getTime() - 24 * H).toISOString().slice(0, 10), out = { weak: 0 };
    if (!force && (hour < 6 || hour >= 10)) return out;
    try {
      all(`SELECT p.user_id AS uid, COUNT(*) AS n FROM word_progress p JOIN users u ON u.id=p.user_id WHERE u.role='student' AND p.wrong>=1 AND p.box<=1 AND substr(p.due_day,1,10) <= ? AND substr(p.last_seen,1,10) >= ? GROUP BY p.user_id HAVING n >= 3 LIMIT 3000`, today, yest).forEach((r) => {
        if (logged('weak', Number(today.replace(/-/g, '')), r.uid, 'd')) return; mark('weak', Number(today.replace(/-/g, '')), r.uid, 'd');
        try { notifyUser(r.uid, 'weak_words', '🔁 ' + r.n + ' từ bạn hay sai đang chờ ôn lại', 'Ôn nhanh 5 phút hôm nay để nhớ chắc hơn nhé!', 'word-hub.html?weak=1'); out.weak++; } catch (_) { /* bỏ qua */ }
      });
    } catch (e) { console.error('[remind-weak]', e.message); }
    return out;
  }
  app.post('/api/admin/auto-remind2/run', requireRole('admin'), (req, res) => { try { res.json({ ok: true, ...run(), ...(req.query.force === '1' ? weakWordsReminder(true) : {}) }); } catch (e) { console.error('[remind2]', e.message); res.status(500).json({ error: 'Chạy nhắc thất bại.' }); } });
  app.locals.remindExtra = run;
  setTimeout(() => { try { run(); } catch (e) { console.error('[remind2]', e.message); } setInterval(() => { try { run(); } catch (e) { console.error('[remind2]', e.message); } }, 10 * 60 * 1000); }, 50_000);
};
