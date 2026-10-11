// Đề trắc nghiệm: giáo viên tải file Word (đáp án in đỏ hoặc có bảng đáp án) → giao cho học sinh làm online.
// Máy chủ giữ đáp án, đếm giờ, đếm số lần rời tab, tự nộp khi hết giờ / vượt quá số lần rời tab, tự chấm điểm.
'use strict';
const crypto = require('crypto');
const multer = require('multer');
const { docxParagraphs, buildDocx } = require('./docx-lib');
const { parseMcq } = require('./mcq-parse');

const MAX_Q = 200;
const GRACE_MS = 15 * 1000;      // cho phép nộp trễ tối đa 15 giây sau khi hết giờ (độ trễ mạng)
const J = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(0, i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
const range = (n) => Array.from({ length: n }, (_, i) => i);

module.exports = function registerMcq(app, { db, requireAuth, requireRole, now, notifyUser }) {
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 1 } });

  // ───────────── tiện ích ─────────────
  const loadTest = (id) => Number.isInteger(id) ? db.prepare('SELECT t.*, u.name AS teacher_name FROM mcq_tests t LEFT JOIN users u ON u.id=t.teacher_id WHERE t.id=?').get(id) : null;
  const isOwner = (user, t) => user.role === 'admin' || (user.role === 'teacher' && t.teacher_id === user.id);
  const assigned = (tid, uid) => !!db.prepare('SELECT 1 FROM mcq_assign WHERE test_id=? AND user_id=?').get(tid, uid);
  const activeAttempt = (tid, uid) => db.prepare('SELECT * FROM mcq_attempts WHERE test_id=? AND user_id=? AND voided=0 ORDER BY id DESC LIMIT 1').get(tid, uid);

  // Giờ giáo viên nhập (không có múi giờ) = giờ Việt Nam (UTC+7), không phụ thuộc múi giờ của máy chủ
  function vnMs(s) {
    if (!s) return 0; s = String(s).trim().replace(' ', 'T');
    if (/Z$|[+-]\d\d:?\d\d$/.test(s)) { const t = Date.parse(s); return Number.isNaN(t) ? 0 : t; }
    if (/^\d{4}-\d\d-\d\d$/.test(s)) s += 'T23:59'; const t = Date.parse(s + (s.length <= 16 ? ':00' : '') + '+07:00'); return Number.isNaN(t) ? 0 : t;
  }
  const fmtVN = (ms) => new Date(ms).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
  // Làm sạch HTML định dạng từ file Word: chỉ giữ đậm / nghiêng / gạch chân / chỉ số trên-dưới / gạch ngang / xuống dòng. Mọi thứ khác (màu, thẻ lạ, script) bị bỏ.
  const RICH_ALIAS = { strong: 'b', b: 'b', em: 'i', i: 'i', u: 'u', sup: 'sup', sub: 'sub', s: 's', strike: 's', del: 's' };
  const decode = (x) => x.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  const escH = (x) => x.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  function cleanRich(html) {
    if (typeof html !== 'string' || !html) return null;
    html = html.slice(0, 6000).replace(/<(script|style)[\s\S]*?<\/\1>/gi, ''); let out = '', plain = '', hasTag = false; const stack = [];
    for (const m of html.matchAll(/<(\/?)([a-z][a-z0-9]*)\b[^>]*>|([^<]+)|</gi)) {
      if (m[3] !== undefined) { const t = decode(m[3]); out += escH(t); plain += t; continue; }
      if (!m[2]) { out += '&lt;'; plain += '<'; continue; }
      const tag = m[2].toLowerCase();
      if (tag === 'br') { out += '<br>'; plain += '\n'; continue; }
      const al = RICH_ALIAS[tag]; if (!al) { if (m[1] && (tag === 'div' || tag === 'p')) { out += '<br>'; plain += '\n'; } continue; }
      if (!m[1]) { stack.push(al); out += '<' + al + '>'; hasTag = true; } else { const k = stack.lastIndexOf(al); if (k >= 0) { while (stack.length > k) out += '</' + stack.pop() + '>'; } }
    }
    while (stack.length) out += '</' + stack.pop() + '>';
    return hasTag ? { html: out, plain } : null;
  }
  const norm = (x) => String(x || '').replace(/\s+/g, ' ').trim();
  function cleanQuestions(arr) {
    if (!Array.isArray(arr) || !arr.length) throw new Error('Đề chưa có câu hỏi nào.');
    if (arr.length > MAX_Q) throw new Error('Đề tối đa ' + MAX_Q + ' câu.');
    return arr.map((q, i) => {
      const at = 'Câu ' + (i + 1) + ': ';
      const text = String(q.q || '').trim(), opts = Array.isArray(q.opts) ? q.opts.map(o => String(o || '').trim()) : [];
      if (!text || text.length > 2000) throw new Error(at + 'nội dung câu hỏi trống hoặc quá dài.');
      if (opts.length < 2 || opts.length > 5) throw new Error(at + 'cần từ 2 đến 5 phương án.');
      if (opts.some(o => !o || o.length > 600)) throw new Error(at + 'có phương án trống hoặc quá dài.');
      if (!Number.isInteger(q.ans) || q.ans < 0 || q.ans >= opts.length) throw new Error(at + 'chưa chọn đáp án đúng.');
      const o = { q: text, opts, ans: q.ans, exp: String(q.exp || '').trim().slice(0, 1500) };
      // bản có định dạng: chỉ nhận khi phần chữ khớp ĐÚNG với bản thuần văn bản (tránh sai lệch nội dung)
      const qh = cleanRich(q.qh); if (qh && norm(qh.plain) === norm(text)) o.qh = qh.html;
      if (Array.isArray(q.oh) && q.oh.length === opts.length) { const oh = q.oh.map((h, k) => { const c = cleanRich(h); return c && norm(c.plain) === norm(opts[k]) ? c.html : null; }); if (oh.some(Boolean)) o.oh = oh; }
      const eh = cleanRich(q.eh); if (eh && o.exp && norm(eh.plain) === norm(o.exp)) o.eh = eh.html;
      return o;
    });
  }

  const __mcqJoinNew = !db.prepare("SELECT 1 FROM sqlite_master WHERE name='mcq_groups'").get();
  db.exec('CREATE TABLE IF NOT EXISTS mcq_groups (test_id INTEGER NOT NULL, group_id INTEGER NOT NULL, PRIMARY KEY (test_id, group_id))'); // đề giao cho CẢ LỚP → học sinh vào lớp sau vẫn nhận
  const recGroups = (testId, b) => { for (const gid of (Array.isArray(b.group_ids) ? b.group_ids : []).map(Number).filter(Number.isInteger)) db.prepare('INSERT OR IGNORE INTO mcq_groups (test_id,group_id) VALUES (?,?)').run(testId, gid); };
  const mcqJoin = (user, gid, gname) => {
    let n = 0;
    for (const t of db.prepare('SELECT t.* FROM mcq_groups mg JOIN mcq_tests t ON t.id=mg.test_id WHERE mg.group_id=?').all(gid)) {
      if (t.deadline && vnMs(t.deadline) && vnMs(t.deadline) < Date.now()) continue; // đề đã hết hạn → không báo
      if (!Number(db.prepare('INSERT OR IGNORE INTO mcq_assign (test_id,user_id,assigned_at) VALUES (?,?,?)').run(t.id, user.id, now()).changes || 0)) continue;
      n++; const sf = vnMs(t.start_at) > Date.now() + 30000;
      try { notifyUser(user.id, 'mcq', (sf ? '📅 Sắp có đề trắc nghiệm: ' : '📝 Đề trắc nghiệm mới: ') + t.title + ' (lớp ' + gname + ')', (sf ? 'Đề mở lúc ' + fmtVN(vnMs(t.start_at)) + ' · ' : '') + effN(t, J(t.questions, []).length) + ' câu · ' + fmtLimit(t) + (t.deadline ? ' · hạn nộp ' + fmtVN(vnMs(t.deadline)) : ''), 'mcq.html?id=' + t.id); } catch (e) {}
    }
    return n;
  };
  if (app.locals.classJoin) app.locals.classJoin.push(mcqJoin);
  // Một lần duy nhất: đề/bộ từ giao TRƯỚC khi có tính năng này → suy ra lớp (mọi thành viên lớp của cùng giáo viên đều đã được giao) rồi giao bù cho người vào lớp muộn
  if (__mcqJoinNew) {
    try {
      for (const g of db.prepare('SELECT id, teacher_id, name FROM groups').all()) {
        const ms = (x) => { const v = String(x || ''); const t = Date.parse(v.replace(' ', 'T') + (/[zZ]|[+-]\d\d:?\d\d$/.test(v) ? '' : 'Z')); return Number.isFinite(t) ? t : 0; };
        const mem = db.prepare('SELECT u.id, u.name, u.email, gm.added_at FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=?').all(g.id);
        if (!mem.length) continue;
        for (const t of db.prepare('SELECT id, teacher_id, created_at FROM mcq_tests WHERE teacher_id=?').all(g.teacher_id)) {
          const have = new Set(db.prepare('SELECT user_id FROM mcq_assign WHERE test_id=?').all(t.id).map(r => Number(r.user_id)));
          const early = mem.filter(m => ms(m.added_at) <= ms(t.created_at) + 60000); // thành viên đã có trong lớp lúc giao
          if (early.length && early.every(m => have.has(Number(m.id)))) db.prepare('INSERT OR IGNORE INTO mcq_groups (test_id,group_id) VALUES (?,?)').run(t.id, g.id);
        }
        for (const m of mem) { try { mcqJoin(m, g.id, g.name); } catch (e) { console.error('[classJoin/migrate]', e.message); } }
      }
    } catch (e) { console.error('[classJoin/migrate]', e.message); }
  }
  function collectRecipients(b) {
    const set = new Set();
    for (const gid of (Array.isArray(b.group_ids) ? b.group_ids : []).map(Number).filter(Number.isInteger))
      for (const r of db.prepare('SELECT user_id FROM group_members WHERE group_id=? AND user_id IS NOT NULL').all(gid)) set.add(Number(r.user_id));
    for (const em of (Array.isArray(b.emails) ? b.emails : []).map(s => String(s).trim().toLowerCase()).filter(Boolean)) {
      const u = db.prepare("SELECT id FROM users WHERE lower(email)=? AND role='student'").get(em);
      if (u) set.add(Number(u.id));
    }
    for (const uid of (Array.isArray(b.user_ids) ? b.user_ids : []).map(Number).filter(Number.isInteger).slice(0, 2000))
      if (db.prepare("SELECT 1 FROM users WHERE id=? AND role='student'").get(uid)) set.add(uid);
    if (b.all_students) for (const r of db.prepare("SELECT id FROM users WHERE role='student'").all()) set.add(Number(r.id));
    return set;
  }
  const effN = (t, n) => (t.pick_n > 0 && t.pick_n < n ? t.pick_n : n);
  const fmtLimit = (t) => (t.duration_min ? t.duration_min + ' phút' : 'không giới hạn thời gian');

  // ── Chấm điểm một lượt làm bài (theo hoán vị đã lưu) ──
  function grade(test, att, answers) {
    const qs = J(test.questions, []), perm = J(att.perm, { q: [], o: [] });
    let score = 0;
    const per = perm.q.map((qi, pos) => {
      const q = qs[qi]; const c = answers[pos];
      const chosenOrig = Number.isInteger(c) && c >= 0 && c < q.opts.length ? perm.o[pos][c] : -1;
      const ok = chosenOrig === q.ans; if (ok) score++;
      return { pos, qi, chosen: Number.isInteger(c) ? c : -1, ok };
    });
    return { score, total: perm.q.length, per };
  }
  function reviewOf(test, att, answers) {
    const qs = J(test.questions, []), perm = J(att.perm, { q: [], o: [] });
    return perm.q.map((qi, pos) => {
      const q = qs[qi], order = perm.o[pos];
      const chosen = Number.isInteger(answers[pos]) ? answers[pos] : -1;
      const r = { n: pos + 1, q: q.q, opts: order.map(k => q.opts[k]), chosen, correct: order.indexOf(q.ans), ok: chosen >= 0 && order[chosen] === q.ans, exp: q.exp || '' };
      if (q.qh) r.qh = q.qh; if (q.oh) r.oh = order.map(k => q.oh[k] || null); if (q.eh) r.eh = q.eh;
      return r;
    });
  }
  function finalize(att, reason, override) {
    const fresh = db.prepare('SELECT * FROM mcq_attempts WHERE id=?').get(att.id);
    if (!fresh || fresh.status !== 'in_progress') return fresh;
    const test = db.prepare('SELECT * FROM mcq_tests WHERE id=?').get(fresh.test_id);
    const answers = Array.isArray(override) ? override : J(fresh.answers, []);
    const g = grade(test, fresh, answers);
    const t = Date.now(), fin = fresh.ends_at ? Math.min(t, fresh.ends_at) : t;
    db.prepare("UPDATE mcq_attempts SET status='done', finished_at=?, answers=?, score=?, total=?, auto_submit=? WHERE id=? AND status='in_progress'")
      .run(fin, JSON.stringify(answers), g.score, g.total, reason && reason !== 'manual' ? reason : null, fresh.id);
    try {
      const u = db.prepare('SELECT name FROM users WHERE id=?').get(fresh.user_id);
      notifyUser(test.teacher_id, 'mcq_result', '📝 ' + (u ? u.name : 'Học sinh') + ' đã nộp: ' + test.title, 'Điểm: ' + ptsOf(g.score, g.total, maxPts(test)) + '/' + maxPts(test) + ' (' + g.score + '/' + g.total + ' câu)' + (reason === 'time' ? ' (hết giờ)' : reason === 'leave' ? ' (rời tab quá số lần)' : ''), 'mcq.html?id=' + test.id + '&tab=results');
    } catch (e) {}
    return db.prepare('SELECT * FROM mcq_attempts WHERE id=?').get(fresh.id);
  }
  // Dọn bài hết giờ mà học sinh đã bỏ đi (nộp tự động bằng đáp án đã lưu)
  function sweep(att) {
    if (att && att.status === 'in_progress' && att.ends_at && Date.now() > att.ends_at + GRACE_MS) return finalize(att, 'time');
    return att;
  }
  // Điểm = số câu đúng / tổng số câu × tổng điểm cả bài (giáo viên đặt), làm tròn 2 chữ số
  const maxPts = t => { const m = Number(t && t.max_points); return m > 0 ? m : 10; };
  const ptsOf = (score, total, max) => (total ? Math.round(score / total * max * 100) / 100 : 0);
  function resultPayload(test, att, forceReveal) {
    const answers = J(att.answers, []);
    const hideScore = !test.show_score && !forceReveal && att.status === 'done';
    const out = { attemptId: att.id, status: att.status, score: hideScore ? null : att.score, total: att.total, percent: hideScore ? null : (att.total ? Math.round(att.score / att.total * 100) : 0), points: hideScore ? null : ptsOf(att.score, att.total, maxPts(test)), maxPoints: maxPts(test), scoreHidden: hideScore,
      autoSubmit: att.auto_submit || null, leaves: att.leaves, awayMs: att.away_ms, usedMs: att.finished_at ? att.finished_at - att.started_at : null,
      reveal: !!test.reveal, showExp: !!test.show_exp, review: null };
    if (att.status === 'done' && (test.reveal || test.show_exp || forceReveal)) {
      out.review = reviewOf(test, att, answers).map(x => {
        if (forceReveal) return x;
        const y = { n: x.n, q: x.q, opts: x.opts, chosen: x.chosen, qh: x.qh, oh: x.oh };
        if (test.reveal) { y.correct = x.correct; y.ok = x.ok; }
        if (test.show_exp) { y.exp = x.exp; y.eh = x.eh; }
        return y;
      });
    }
    return out;
  }

  // ───────────── File Word MẪU để giáo viên tải về làm theo ─────────────
  const SAMPLE_Q = [
    { q: 'She ___ to school every day.', o: ['go', 'goes', 'going', 'went'], a: 1, e: 'Chủ ngữ she (ngôi thứ ba số ít) → động từ thêm -es.' },
    { q: 'They ___ football now.', o: ['play', 'plays', 'are playing', 'played'], a: 2, e: 'Có "now" → hiện tại tiếp diễn.' },
    { q: 'I have lived here ___ 2010.', o: ['for', 'since', 'ago', 'in'], a: 1, e: 'since + mốc thời gian.' }
  ];
  function sampleDoc(type) {
    const P = [[{ t: type === 'red' ? 'MẪU 2 — ĐÁP ÁN IN ĐỎ' : 'MẪU 1 — KHUNG ĐÁP ÁN', bold: true }], [{ t: 'ĐỀ KIỂM TRA TIẾNG ANH — UNIT 5 (dòng tiêu đề này sẽ được bỏ qua)' }]];
    SAMPLE_Q.forEach((x, i) => {
      P.push([{ t: 'Câu ' + (i + 1) + '. ' + x.q, bold: true }]);
      x.o.forEach((o, k) => P.push([{ t: 'ABCD'[k] + '. ' + o, color: type === 'red' && k === x.a ? 'FF0000' : undefined }]));
      if (type === 'red') P.push([{ t: 'Giải thích: ' + x.e }]);
    });
    if (type !== 'red') {
      P.push([{ t: 'ĐÁP ÁN', bold: true }]);
      P.push([{ t: SAMPLE_Q.map((x, i) => (i + 1) + '. ' + 'ABCD'[x.a]).join('    ') }]);
    }
    return buildDocx(P);
  }
  app.get('/api/mcq/sample/:type', requireRole('teacher', 'admin'), (req, res) => {
    const type = req.params.type === 'red' ? 'red' : 'key';
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', 'attachment; filename="' + (type === 'red' ? 'de-mau-dap-an-in-do.docx' : 'de-mau-khung-dap-an.docx') + '"');
    res.send(sampleDoc(type));
  });

  // ───────────── Giáo viên: đọc file Word ─────────────
  app.post('/api/mcq/parse', requireRole('teacher', 'admin'), (req, res) => {
    upload.single('file')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File quá lớn (tối đa 8MB).' : 'Không nhận được file.' });
      const f = req.file;
      if (!f || !f.buffer || !f.buffer.length) return res.status(400).json({ error: 'Chưa chọn file.' });
      if (!/\.docx$/i.test(f.originalname || '') || f.buffer.readUInt32LE(0) !== 0x04034b50)
        return res.status(400).json({ error: 'Chỉ nhận file Word định dạng .docx (không nhận .doc cũ). Hãy mở file trong Word → Lưu thành (Save As) → chọn "Word Document (.docx)".' });
      try {
        const d = docxParagraphs(f.buffer);
        const r = parseMcq(d.paragraphs);
        if (d.hasMath) r.warnings.unshift('File có công thức toán (Equation) — hệ thống chỉ đọc được phần chữ/số của công thức, KHÔNG giữ nguyên dạng phân số, căn… Hãy xem kỹ các câu có công thức.');
        if (d.hasImages) r.warnings.unshift('File có hình ảnh/biểu đồ — hình ảnh KHÔNG được đưa vào đề. Nếu câu hỏi cần xem hình, hãy mô tả bằng chữ.');
        res.json({ ok: true, title: String(f.originalname || '').replace(/\.docx$/i, '').slice(0, 80), questions: r.questions, errors: r.errors, warnings: r.warnings, mode: r.mode, report: r.report, fileName: String(f.originalname || ''), fileSize: f.buffer.length });
      } catch (e) {
        console.error('[mcq/parse]', e.message);
        res.status(422).json({ error: 'Không đọc được file Word: ' + String(e.message).slice(0, 150) });
      }
    });
  });

  // ───────────── Giáo viên: tạo + giao đề ─────────────
  app.post('/api/mcq', requireRole('teacher', 'admin'), (req, res) => {
    const b = req.body || {};
    const title = String(b.title || '').trim().slice(0, 100);
    if (!title) return res.status(400).json({ error: 'Vui lòng đặt tên đề.' });
    let questions; try { questions = cleanQuestions(b.questions); } catch (e) { return res.status(400).json({ error: e.message }); }
    const duration = Math.max(0, Math.min(300, parseInt(b.duration_min, 10) || 0));
    const maxLeaves = Math.max(0, Math.min(20, parseInt(b.max_leaves, 10) || 0));
    const deadline = b.deadline ? String(b.deadline).slice(0, 25) : null, startAt = b.start_at ? String(b.start_at).slice(0, 25) : null;
    if (deadline && !vnMs(deadline)) return res.status(400).json({ error: 'Hạn nộp không hợp lệ.' });
    if (startAt && !vnMs(startAt)) return res.status(400).json({ error: 'Giờ mở đề không hợp lệ.' });
    if (startAt && deadline && vnMs(startAt) >= vnMs(deadline)) return res.status(400).json({ error: 'Giờ mở đề phải sớm hơn hạn nộp bài.' });
    if (deadline && vnMs(deadline) < Date.now() - 60000) return res.status(400).json({ error: 'Hạn nộp đã qua — hãy chọn thời điểm trong tương lai.' });
    const startFuture = !!(startAt && vnMs(startAt) > Date.now() + 30000);
    const pickN = Math.max(0, parseInt(b.pick_n, 10) || 0);
    if (pickN > questions.length) return res.status(400).json({ error: 'Số câu mỗi học sinh (' + pickN + ') lớn hơn số câu trong ngân hàng (' + questions.length + ').' });
    const rec = collectRecipients(b);
    if (!rec.size) return res.status(400).json({ error: 'Chưa chọn học sinh nào nhận đề (chọn lớp, tick học sinh hoặc nhập email).' });
    try {
      db.exec('BEGIN');
      const r = db.prepare('INSERT INTO mcq_tests (teacher_id,title,note,questions,duration_min,max_leaves,shuffle_q,shuffle_o,reveal,deadline,source_name,created_at,pick_n,show_score,show_exp,start_at,start_notified,max_points) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
        .run(req.user.id, title, String(b.note || '').trim().slice(0, 400) || null, JSON.stringify(questions), duration, maxLeaves, b.shuffle_q === false ? 0 : 1, b.shuffle_o === false ? 0 : 1, b.reveal ? 1 : 0, deadline, String(b.source_name || '').slice(0, 120) || null, now(), pickN >= questions.length ? 0 : pickN, b.show_score === false ? 0 : 1, b.show_exp ? 1 : 0, startAt, startFuture ? 0 : 1, Math.min(1000, Math.max(0.5, Number(b.max_points) || 10)));
      const id = Number(r.lastInsertRowid);
      const ins = db.prepare('INSERT OR IGNORE INTO mcq_assign (test_id,user_id,assigned_at) VALUES (?,?,?)');
      for (const uid of rec) ins.run(id, uid, now());
      recGroups(id, b);
      db.exec('COMMIT');
      const t = { duration_min: duration };
      for (const uid of rec) { try { notifyUser(uid, 'mcq', (startFuture ? '📅 Sắp có đề trắc nghiệm: ' : '📝 Đề trắc nghiệm mới: ') + title, (startFuture ? 'Đề mở lúc ' + fmtVN(vnMs(startAt)) + ' · ' : '') + effN({ pick_n: pickN }, questions.length) + ' câu · ' + fmtLimit(t) + (deadline ? ' · hạn nộp ' + fmtVN(vnMs(deadline)) : ''), 'mcq.html?id=' + id); } catch (e) {} }
      res.json({ ok: true, id, recipients: rec.size });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[mcq/create]', e.message);
      res.status(500).json({ error: 'Không tạo được đề.' });
    }
  });

  app.post('/api/mcq/:id/assign', requireRole('teacher', 'admin'), (req, res) => {
    const t = loadTest(Number(req.params.id));
    if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    if (!isOwner(req.user, t)) return res.status(403).json({ error: 'Chỉ người tạo đề mới giao thêm được.' });
    const rec = collectRecipients(req.body || {});
    if (!rec.size) return res.status(400).json({ error: 'Chưa chọn học sinh nào.' });
    recGroups(t.id, req.body || {});
    let added = 0; const ins = db.prepare('INSERT OR IGNORE INTO mcq_assign (test_id,user_id,assigned_at) VALUES (?,?,?)');
    for (const uid of rec) if (Number(ins.run(t.id, uid, now()).changes || 0)) { added++; try { const sf = vnMs(t.start_at) > Date.now() + 30000; notifyUser(uid, 'mcq', (sf ? '📅 Sắp có đề trắc nghiệm: ' : '📝 Đề trắc nghiệm mới: ') + t.title, (sf ? 'Đề mở lúc ' + fmtVN(vnMs(t.start_at)) + ' · ' : '') + effN(t, J(t.questions, []).length) + ' câu · ' + fmtLimit(t), 'mcq.html?id=' + t.id); } catch (e) {} }
    res.json({ ok: true, added, already: rec.size - added });
  });

  app.get('/api/mcq', requireRole('teacher', 'admin'), (req, res) => {
    try {
      const rows = req.user.role === 'admin' ? db.prepare('SELECT * FROM mcq_tests ORDER BY id DESC LIMIT 80').all() : db.prepare('SELECT * FROM mcq_tests WHERE teacher_id=? ORDER BY id DESC LIMIT 80').all(req.user.id);
      res.json({ tests: rows.map(t => {
        const assignedN = Number(db.prepare('SELECT COUNT(*) c FROM mcq_assign WHERE test_id=?').get(t.id).c);
        const st = db.prepare("SELECT COUNT(*) c, AVG(score*100.0/total) a FROM mcq_attempts WHERE test_id=? AND status='done' AND voided=0").get(t.id);
        return { id: t.id, title: t.title, questions: J(t.questions, []).length, pick: effN(t, J(t.questions, []).length), duration: t.duration_min, deadline: t.deadline || '', startAt: t.start_at || '', reveal: !!t.reveal, showScore: !!t.show_score, showExp: !!t.show_exp, maxLeaves: t.max_leaves, maxPoints: maxPts(t), created: t.created_at, assigned: assignedN, done: Number(st.c || 0), avg: st.a == null ? null : Math.round(Number(st.a)) };
      }) });
    } catch (e) { console.error('[mcq/list]', e.message); res.status(500).json({ error: 'Không tải được danh sách đề.' }); }
  });

  // Ẩn/hiện đáp án, đổi hạn, đổi số lần rời tab, sửa đáp án đúng (tự chấm lại toàn bộ bài đã nộp)
  app.patch('/api/mcq/:id', requireRole('teacher', 'admin'), (req, res) => {
    const t = loadTest(Number(req.params.id));
    if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    if (!isOwner(req.user, t)) return res.status(403).json({ error: 'Chỉ người tạo đề mới được sửa.' });
    const b = req.body || {};
    try {
      if (b.reveal !== undefined) db.prepare('UPDATE mcq_tests SET reveal=? WHERE id=?').run(b.reveal ? 1 : 0, t.id);
      if (b.show_score !== undefined) db.prepare('UPDATE mcq_tests SET show_score=? WHERE id=?').run(b.show_score ? 1 : 0, t.id);
      if (b.max_points !== undefined) { const m = Number(b.max_points); if (!(m > 0 && m <= 1000)) return res.status(400).json({ error: 'Tổng điểm phải từ 0.5 đến 1000.' }); db.prepare('UPDATE mcq_tests SET max_points=? WHERE id=?').run(m, t.id); }
      if (b.show_exp !== undefined) db.prepare('UPDATE mcq_tests SET show_exp=? WHERE id=?').run(b.show_exp ? 1 : 0, t.id);
      if (b.duration_min !== undefined) db.prepare('UPDATE mcq_tests SET duration_min=? WHERE id=?').run(Math.max(0, Math.min(300, parseInt(b.duration_min, 10) || 0)), t.id); // chỉ áp dụng cho lượt làm mới
      if (b.pick_n !== undefined) { const n = Math.max(0, parseInt(b.pick_n, 10) || 0); if (n > J(t.questions, []).length) return res.status(400).json({ error: 'Số câu lớn hơn ngân hàng câu hỏi.' }); db.prepare('UPDATE mcq_tests SET pick_n=? WHERE id=?').run(n >= J(t.questions, []).length ? 0 : n, t.id); } // chỉ áp dụng cho lượt làm mới
      if (b.start_at !== undefined) { const v = b.start_at ? String(b.start_at).slice(0, 25) : null; if (v && !vnMs(v)) return res.status(400).json({ error: 'Giờ mở đề không hợp lệ.' }); db.prepare('UPDATE mcq_tests SET start_at=?, start_notified=? WHERE id=?').run(v, v && vnMs(v) > Date.now() + 30000 ? 0 : 1, t.id); }
      if (b.deadline !== undefined) { const v = b.deadline ? String(b.deadline).slice(0, 25) : null; if (v && !vnMs(v)) return res.status(400).json({ error: 'Hạn nộp không hợp lệ.' }); db.prepare('UPDATE mcq_tests SET deadline=? WHERE id=?').run(v, t.id); }
      if (b.max_leaves !== undefined) db.prepare('UPDATE mcq_tests SET max_leaves=? WHERE id=?').run(Math.max(0, Math.min(20, parseInt(b.max_leaves, 10) || 0)), t.id);
      if (b.title !== undefined && String(b.title).trim()) db.prepare('UPDATE mcq_tests SET title=? WHERE id=?').run(String(b.title).trim().slice(0, 100), t.id);
      let regraded = 0;
      if (Array.isArray(b.fix) && b.fix.length) {
        const qs = J(t.questions, []);
        for (const f of b.fix) {
          const i = Number(f.i);
          if (!Number.isInteger(i) || i < 0 || i >= qs.length) continue;
          if (f.ans !== undefined) { if (!Number.isInteger(f.ans) || f.ans < 0 || f.ans >= qs[i].opts.length) return res.status(400).json({ error: 'Đáp án không hợp lệ.' }); qs[i].ans = f.ans; }
          if (f.exp !== undefined) qs[i].exp = String(f.exp).slice(0, 1500);
        }
        db.prepare('UPDATE mcq_tests SET questions=? WHERE id=?').run(JSON.stringify(qs), t.id);
        const nt = db.prepare('SELECT * FROM mcq_tests WHERE id=?').get(t.id);
        for (const a of db.prepare("SELECT * FROM mcq_attempts WHERE test_id=? AND status='done'").all(t.id)) {
          const g = grade(nt, a, J(a.answers, []));
          if (g.score !== a.score) { db.prepare('UPDATE mcq_attempts SET score=? WHERE id=?').run(g.score, a.id); regraded++; }
        }
      }
      res.json({ ok: true, regraded });
    } catch (e) { console.error('[mcq/patch]', e.message); res.status(500).json({ error: 'Không lưu được thay đổi.' }); }
  });

  app.delete('/api/mcq/:id', requireRole('teacher', 'admin'), (req, res) => {
    const t = loadTest(Number(req.params.id));
    if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    if (!isOwner(req.user, t)) return res.status(403).json({ error: 'Chỉ người tạo đề mới được xoá.' });
    try {
      db.exec('BEGIN');
      db.prepare('DELETE FROM mcq_attempts WHERE test_id=?').run(t.id); db.prepare('DELETE FROM mcq_assign WHERE test_id=?').run(t.id); db.prepare('DELETE FROM mcq_tests WHERE id=?').run(t.id);
      db.exec('COMMIT'); res.json({ ok: true });
    } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} res.status(500).json({ error: 'Không xoá được.' }); }
  });

  // Toàn bộ đề kèm đáp án (chỉ giáo viên) — để rà soát/sửa đáp án
  app.get('/api/mcq/:id/full', requireRole('teacher', 'admin'), (req, res) => {
    const t = loadTest(Number(req.params.id));
    if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    if (!isOwner(req.user, t)) return res.status(403).json({ error: 'Chỉ người tạo đề mới xem được.' });
    res.json({ id: t.id, title: t.title, questions: J(t.questions, []) });
  });

  // Xem kết quả: từng học sinh + câu sai nhiều nhất
  app.get('/api/mcq/:id/results', requireRole('teacher', 'admin'), (req, res) => {
    const t = loadTest(Number(req.params.id));
    if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    if (!isOwner(req.user, t)) return res.status(403).json({ error: 'Chỉ người tạo đề mới xem được kết quả.' });
    try {
      const qs = J(t.questions, []);
      const studs = db.prepare('SELECT u.id,u.name,u.email FROM mcq_assign a JOIN users u ON u.id=a.user_id WHERE a.test_id=? ORDER BY u.name').all(t.id);
      const wrong = qs.map(() => 0), seen = qs.map(() => 0); let doneN = 0;
      const students = studs.map(u => {
        const a = sweep(activeAttempt(t.id, u.id));
        const o = { id: u.id, name: u.name, email: u.email, status: a ? a.status : 'new', score: null, total: effN(t, qs.length), percent: null, usedMs: null, leaves: a ? a.leaves : 0, awayMs: a ? a.away_ms : 0, auto: a ? a.auto_submit : null, startedAt: a ? a.started_at : null };
        o.class_ids = db.prepare('SELECT group_id FROM group_members WHERE user_id=?').all(u.id).map(r => Number(r.group_id));
        o.wrongQ = [];
        if (a && a.status === 'done') {
          o.score = a.score; o.total = a.total; o.percent = a.total ? Math.round(a.score / a.total * 100) : 0; o.points = ptsOf(a.score, a.total, maxPts(t)); o.usedMs = a.finished_at - a.started_at; doneN++;
          const g = grade(t, a, J(a.answers, [])); g.per.forEach(p => { seen[p.qi]++; if (!p.ok) { wrong[p.qi]++; o.wrongQ.push(p.qi); } });
        }
        return o;
      });
      // Các lớp để giáo viên lọc: lớp được giao đề + lớp (của giáo viên) có học sinh được giao
      const gAll = req.user.role === 'admin' ? db.prepare('SELECT id,name FROM groups ORDER BY name').all() : db.prepare('SELECT id,name FROM groups WHERE teacher_id=? ORDER BY name').all(req.user.id);
      const used = new Set(); students.forEach(o => o.class_ids.forEach(g => used.add(g))); db.prepare('SELECT group_id FROM mcq_groups WHERE test_id=?').all(t.id).forEach(r => used.add(Number(r.group_id)));
      const groups = gAll.filter(g => used.has(Number(g.id))).map(g => ({ id: Number(g.id), name: g.name }));
      res.json({ groups, qlist: qs.map((q, i) => ({ n: i + 1, q: q.q.slice(0, 140) })), test: { id: t.id, title: t.title, maxPoints: maxPts(t), total: effN(t, qs.length), bank: qs.length, showScore: !!t.show_score, showExp: !!t.show_exp, duration: t.duration_min, maxLeaves: t.max_leaves, reveal: !!t.reveal, deadline: t.deadline || '' }, students,
        hardest: qs.map((q, i) => ({ n: i + 1, q: q.q.slice(0, 140), wrong: wrong[i], of: seen[i] })).filter(x => x.wrong > 0).sort((a, b) => b.wrong - a.wrong).slice(0, 8) });
    } catch (e) { console.error('[mcq/results]', e.message); res.status(500).json({ error: 'Không tải được kết quả.' }); }
  });

  // Xem chi tiết bài làm của 1 học sinh (luôn thấy đáp án đúng)
  app.get('/api/mcq/:id/attempt/:uid', requireRole('teacher', 'admin'), (req, res) => {
    const t = loadTest(Number(req.params.id));
    if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    if (!isOwner(req.user, t)) return res.status(403).json({ error: 'Không có quyền.' });
    const a = sweep(activeAttempt(t.id, Number(req.params.uid)));
    if (!a || a.status !== 'done') return res.status(404).json({ error: 'Học sinh này chưa nộp bài.' });
    const u = db.prepare('SELECT name,email FROM users WHERE id=?').get(a.user_id);
    res.json({ student: u, leaveLog: J(a.leave_log, []), ...resultPayload(t, a, true) });
  });

  // Cho học sinh làm lại: huỷ lượt làm hiện tại
  app.post('/api/mcq/:id/reset', requireRole('teacher', 'admin'), (req, res) => {
    const t = loadTest(Number(req.params.id));
    if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    if (!isOwner(req.user, t)) return res.status(403).json({ error: 'Không có quyền.' });
    const uid = Number((req.body || {}).user_id);
    const r = db.prepare('UPDATE mcq_attempts SET voided=1 WHERE test_id=? AND user_id=? AND voided=0').run(t.id, uid);
    if (Number(r.changes)) { try { notifyUser(uid, 'mcq', '📝 Bạn được làm lại: ' + t.title, 'Giáo viên đã mở lại đề cho bạn.', 'mcq.html?id=' + t.id); } catch (e) {} }
    res.json({ ok: true, reset: Number(r.changes) });
  });

  // ───────────── Học sinh ─────────────
  app.get('/api/mcq/mine', requireAuth, (req, res) => {
    try {
      const rows = db.prepare(`SELECT t.id,t.title,t.note,t.duration_min,t.deadline,t.start_at,t.reveal,t.show_score,t.pick_n,t.max_points,t.questions,u.name AS teacher FROM mcq_assign a JOIN mcq_tests t ON t.id=a.test_id LEFT JOIN users u ON u.id=t.teacher_id WHERE a.user_id=? ORDER BY t.id DESC LIMIT 60`).all(req.user.id);
      const t0 = Date.now();
      res.json({ tests: rows.map(r => {
        const a = sweep(activeAttempt(r.id, req.user.id));
        const dl = vnMs(r.deadline), st0 = vnMs(r.start_at);
        let status = a ? (a.status === 'done' ? 'done' : 'in_progress') : 'new';
        if (status === 'new' && dl && t0 > dl) status = 'expired'; else if (status === 'new' && st0 && t0 < st0) status = 'upcoming';
        return { id: r.id, title: r.title, note: r.note || '', duration: r.duration_min, deadline: r.deadline || '', startAt: r.start_at || '', teacher: r.teacher || '', questions: effN(r, J(r.questions, []).length), status, score: a && a.status === 'done' && r.show_score ? a.score : null, scoreHidden: !!(a && a.status === 'done' && !r.show_score), total: a && a.status === 'done' ? a.total : null, points: a && a.status === 'done' && r.show_score ? ptsOf(a.score, a.total, maxPts(r)) : null, maxPoints: maxPts(r) };
      }) });
    } catch (e) { console.error('[mcq/mine]', e.message); res.status(500).json({ error: 'Không tải được đề.' }); }
  });

  app.get('/api/mcq/:id/info', requireAuth, (req, res) => {
    const t = loadTest(Number(req.params.id));
    if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    const owner = isOwner(req.user, t);
    if (!owner && !assigned(t.id, req.user.id)) return res.status(403).json({ error: 'Đề này chưa được giao cho bạn.' });
    const a = owner ? null : sweep(activeAttempt(t.id, req.user.id));
    const info = { id: t.id, title: t.title, note: t.note || '', teacher: t.teacher_name || '', duration: t.duration_min, total: effN(t, J(t.questions, []).length), maxLeaves: t.max_leaves, deadline: t.deadline || '', startAt: t.start_at || '', startsInMs: vnMs(t.start_at) > Date.now() ? vnMs(t.start_at) - Date.now() : 0, reveal: !!t.reveal, owner, status: a ? (a.status === 'done' ? 'done' : 'in_progress') : 'new', serverNow: Date.now() };
    if (a && a.status === 'done') info.result = resultPayload(t, a, false);
    res.json(info);
  });

  app.post('/api/mcq/:id/start', requireAuth, (req, res) => {
    try {
      const t = loadTest(Number(req.params.id));
      if (!t) return res.status(404).json({ error: 'Không tìm thấy đề.' });
      if (!assigned(t.id, req.user.id)) return res.status(403).json({ error: 'Đề này chưa được giao cho bạn.' });
      let a = sweep(activeAttempt(t.id, req.user.id));
      if (a && a.status === 'done') return res.status(409).json({ error: 'Bạn đã nộp bài này rồi. Nếu cần làm lại, hãy nhờ giáo viên mở lại đề.' });
      const qs = J(t.questions, []);
      if (!a) {
        const st0 = vnMs(t.start_at); if (st0 && Date.now() < st0) return res.status(403).json({ error: 'Đề này chưa mở. Đề sẽ mở lúc ' + fmtVN(st0) + '.' });
        const dl = vnMs(t.deadline);
        if (dl && Date.now() > dl) return res.status(403).json({ error: 'Đề này đã quá hạn làm bài.' });
        const n = effN(t, qs.length);
        let qOrder = n < qs.length ? shuffle(range(qs.length)).slice(0, n) : range(qs.length); // mỗi học sinh một bộ câu ngẫu nhiên riêng
        qOrder = t.shuffle_q ? shuffle(qOrder) : qOrder.sort((x, y) => x - y);
        const perm = { q: qOrder, o: qOrder.map(qi => t.shuffle_o ? shuffle(range(qs[qi].opts.length)) : range(qs[qi].opts.length)) };
        const t0 = Date.now(), ends = t.duration_min ? t0 + t.duration_min * 60000 : 0;
        const r = db.prepare('INSERT INTO mcq_attempts (test_id,user_id,started_at,ends_at,perm,answers) VALUES (?,?,?,?,?,?)').run(t.id, req.user.id, t0, ends, JSON.stringify(perm), JSON.stringify(qOrder.map(() => null)));
        a = db.prepare('SELECT * FROM mcq_attempts WHERE id=?').get(Number(r.lastInsertRowid));
      }
      const perm = J(a.perm, { q: [], o: [] });
      res.json({
        attemptId: a.id, title: t.title, total: perm.q.length, serverNow: Date.now(), startedAt: a.started_at, endsAt: a.ends_at, maxLeaves: t.max_leaves, leaves: a.leaves,
        questions: perm.q.map((qi, pos) => { const x = { q: qs[qi].q, opts: perm.o[pos].map(k => qs[qi].opts[k]) }; if (qs[qi].qh) x.qh = qs[qi].qh; if (qs[qi].oh) x.oh = perm.o[pos].map(k => qs[qi].oh[k] || null); return x; }), answers: J(a.answers, [])
      });
    } catch (e) { console.error('[mcq/start]', e.message); res.status(500).json({ error: 'Không bắt đầu được bài làm.' }); }
  });

  function myAttempt(req, res) {
    const a = db.prepare('SELECT * FROM mcq_attempts WHERE id=?').get(Number(req.params.aid));
    if (!a || a.user_id !== req.user.id || a.voided) { res.status(404).json({ error: 'Không tìm thấy bài làm.' }); return null; }
    return sweep(a);
  }
  const validAnswers = (arr, total) => Array.isArray(arr) && arr.length === total && arr.every(x => x === null || (Number.isInteger(x) && x >= -1 && x <= 4));

  app.post('/api/mcq/attempt/:aid/save', requireAuth, (req, res) => {
    const a = myAttempt(req, res); if (!a) return;
    if (a.status !== 'in_progress') return res.json({ ok: true, status: a.status });
    const total = J(a.perm, { q: [] }).q.length, ans = (req.body || {}).answers;
    if (!validAnswers(ans, total)) return res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
    db.prepare("UPDATE mcq_attempts SET answers=? WHERE id=? AND status='in_progress'").run(JSON.stringify(ans.map(x => (x === -1 ? null : x))), a.id);
    res.json({ ok: true, status: 'in_progress', remainingMs: a.ends_at ? Math.max(0, a.ends_at - Date.now()) : null });
  });

  // Ghi nhận rời tab / quay lại tab
  app.post('/api/mcq/attempt/:aid/leave', requireAuth, (req, res) => {
    let a = myAttempt(req, res); if (!a) return;
    if (a.status !== 'in_progress') return res.json({ ok: true, status: a.status });
    const t = db.prepare('SELECT * FROM mcq_tests WHERE id=?').get(a.test_id);
    const state = (req.body || {}).state === 'visible' ? 'visible' : 'hidden', n = Date.now();
    const log = J(a.leave_log, []);
    if (state === 'hidden') {
      if (a.last_leave_at) return res.json({ ok: true, leaves: a.leaves, maxLeaves: t.max_leaves, status: 'in_progress' }); // đã đang ở trạng thái rời tab
      const kind = String((req.body || {}).kind || 'hidden').slice(0, 20);
      log.push({ at: n, kind }); if (log.length > 60) log.shift();
      db.prepare('UPDATE mcq_attempts SET leaves=leaves+1, last_leave_at=?, leave_log=? WHERE id=?').run(n, JSON.stringify(log), a.id);
      a = db.prepare('SELECT * FROM mcq_attempts WHERE id=?').get(a.id);
      if (t.max_leaves > 0 && a.leaves > t.max_leaves) { a = finalize(a, 'leave'); return res.json({ ok: true, leaves: a.leaves, maxLeaves: t.max_leaves, status: 'done', autoSubmit: 'leave' }); }
    } else if (a.last_leave_at) {
      const away = Math.max(0, n - a.last_leave_at);
      if (log.length) log[log.length - 1].away = away;
      db.prepare('UPDATE mcq_attempts SET away_ms=away_ms+?, last_leave_at=NULL, leave_log=? WHERE id=?').run(away, JSON.stringify(log), a.id);
      a = db.prepare('SELECT * FROM mcq_attempts WHERE id=?').get(a.id);
    }
    res.json({ ok: true, leaves: a.leaves, maxLeaves: t.max_leaves, status: a.status });
  });

  app.post('/api/mcq/attempt/:aid/submit', requireAuth, (req, res) => {
    let a = myAttempt(req, res); if (!a) return;
    const t = db.prepare('SELECT * FROM mcq_tests WHERE id=?').get(a.test_id);
    if (a.status === 'in_progress') {
      const total = J(a.perm, { q: [] }).q.length, ans = (req.body || {}).answers;
      const override = validAnswers(ans, total) ? ans.map(x => (x === -1 ? null : x)) : null;
      // nộp sau khi hết giờ + dung sai: chỉ chấm theo đáp án đã lưu trước đó
      const late = a.ends_at && Date.now() > a.ends_at + GRACE_MS;
      a = finalize(a, late ? 'time' : 'manual', late ? null : override);
    }
    res.json(resultPayload(t, a, false));
  });

  app.get('/api/mcq/attempt/:aid', requireAuth, (req, res) => {
    const a = myAttempt(req, res); if (!a) return;
    const t = db.prepare('SELECT * FROM mcq_tests WHERE id=?').get(a.test_id);
    res.json(resultPayload(t, a, false));
  });

  // Đến giờ mở đề → báo cho học sinh đã được giao ("📝 Đề đã mở")
  function openScheduled() {
    try {
      for (const t of db.prepare("SELECT id,title,start_at,deadline,duration_min,questions,pick_n FROM mcq_tests WHERE start_at IS NOT NULL AND start_notified=0").all()) {
        if (vnMs(t.start_at) > Date.now()) continue;
        db.prepare('UPDATE mcq_tests SET start_notified=1 WHERE id=?').run(t.id);
        for (const a of db.prepare('SELECT user_id FROM mcq_assign WHERE test_id=?').all(t.id)) { try { notifyUser(a.user_id, 'mcq', '📝 Đề đã mở: ' + t.title, effN(t, J(t.questions, []).length) + ' câu · ' + fmtLimit(t) + (t.deadline ? ' · hạn nộp ' + fmtVN(vnMs(t.deadline)) : '') + '. Làm ngay nhé!', 'mcq.html?id=' + t.id); } catch (e) {} }
      }
    } catch (e) { console.error('[mcq/open]', e.message); }
  }
  setTimeout(() => { openScheduled(); setInterval(openScheduled, 60 * 1000).unref(); }, 20 * 1000).unref();
};
