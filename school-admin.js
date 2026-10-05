'use strict';
// Quản lý bài học "Tiếng Anh phổ thông" do giáo viên/admin: chỉnh sửa bài có sẵn, tạo bài mới, và để AI phân tích FILE LÝ THUYẾT
// (Word / PDF / ảnh / Excel / txt) thành bài học nháp. Bài do AI tạo luôn là NHÁP → người dùng duyệt/sửa rồi mới xuất bản.
// Dữ liệu gốc (data/school/g*.js) KHÔNG bị sửa: bản sửa lưu trong DB và được ghép đè khi hiển thị (có thể khôi phục bản gốc).
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const multer = require('multer');
const { xlsxToText, docxToText } = require('./lessonvocab').readers;

const SCHOOL_DIR = path.join(__dirname, 'data', 'school');
const LEVELS = ['Cơ bản', 'Trung bình', 'Nâng cao'];
const AI_PER_HOUR = 6;

// ───────── Bài gốc (đọc từ file data/school/g*.js) ─────────
function loadBuiltin() {
  const ctx = { window: {} }; vm.createContext(ctx);
  const files = fs.readdirSync(SCHOOL_DIR).filter((f) => /^g\d+\.js$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
  for (const f of files) { try { vm.runInContext(fs.readFileSync(path.join(SCHOOL_DIR, f), 'utf8'), ctx, { filename: f }); } catch (e) { console.error('[school-admin] không đọc được ' + f + ': ' + e.message); } }
  const lessons = (ctx.window.SCHOOL && ctx.window.SCHOOL.lessons) || {};
  const map = new Map(); for (const id of Object.keys(lessons)) map.set(id, JSON.parse(JSON.stringify(lessons[id])));
  return map;
}

// ───────── Chuẩn hoá + kiểm tra bài học ─────────
const cut = (s, n) => String(s == null ? '' : s).replace(/\r/g, '').trim().slice(0, n);
function normalizeBlock(b) {
  if (!b || typeof b !== 'object') return null;
  if (typeof b.p === 'string') return { p: cut(b.p, 1500) };
  if (typeof b.tip === 'string') return { tip: cut(b.tip, 800) };
  if (typeof b.warn === 'string') return { warn: cut(b.warn, 800) };
  if (Array.isArray(b.f)) return { f: b.f.map((x) => cut(x, 300)).filter(Boolean).slice(0, 12) };
  if (Array.isArray(b.ul)) return { ul: b.ul.map((x) => cut(x, 500)).filter(Boolean).slice(0, 20) };
  if (b.t && Array.isArray(b.t.h) && Array.isArray(b.t.r)) {
    const h = b.t.h.map((x) => cut(x, 80)).slice(0, 8); const n = h.length;
    const r = b.t.r.slice(0, 30).map((row) => { const a = (Array.isArray(row) ? row : []).map((x) => cut(x, 200)).slice(0, n); while (a.length < n) a.push(''); return a; });
    return { t: { h, r } };
  }
  return null;
}
function normalizeLesson(raw, grade) {
  const L = raw && typeof raw === 'object' ? raw : {};
  const out = {
    grade: Number.isInteger(+L.grade) ? +L.grade : grade,
    icon: cut(L.icon, 8) || '📘', title: cut(L.title, 80), sub: cut(L.sub, 90), level: LEVELS.includes(L.level) ? L.level : 'Cơ bản', summary: cut(L.summary, 500),
    sections: (Array.isArray(L.sections) ? L.sections : []).slice(0, 14).map((s) => ({ h: cut(s && s.h, 160), b: (Array.isArray(s && s.b) ? s.b : []).slice(0, 24).map(normalizeBlock).filter(Boolean) })),
    ex: (Array.isArray(L.ex) ? L.ex : []).slice(0, 30).map((e) => [cut(e && e[0], 300), cut(e && e[1], 300)]),
    mis: (Array.isArray(L.mis) ? L.mis : []).slice(0, 20).map((m) => [cut(m && m[0], 300), cut(m && m[1], 300), cut(m && m[2], 400)]),
    quiz: (Array.isArray(L.quiz) ? L.quiz : []).slice(0, 40).map((q) => {
      const o = Array.isArray(q && q[1]) ? q[1].map((x) => cut(x, 200)).slice(0, 4) : []; while (o.length < 4) o.push('');
      const item = [cut(q && q[0], 500), o, Number.isInteger(+(q && q[2])) ? +q[2] : -1, cut(q && q[3], 700)];
      if (q && q[4] === 1) item.push(1); return item;
    }),
  };
  return out;
}
// errors: bắt buộc sửa trước khi xuất bản; warns: nên xem lại
function validateLesson(L) {
  const errors = [], warns = [];
  const e = (m) => errors.push(m), w = (m) => warns.push(m);
  if (!Number.isInteger(L.grade) || L.grade < 6 || L.grade > 12) e('Lớp phải từ 6 đến 12.');
  if (!L.title) e('Thiếu tên bài học.'); if (!L.sub) e('Thiếu phụ đề (VD: Present Simple).'); if (!L.summary) e('Thiếu phần tóm tắt.');
  if (L.sections.length < 2) e('Cần ít nhất 2 phần giải thích.');
  L.sections.forEach((s, i) => { if (!s.h) e('Phần ' + (i + 1) + ': thiếu tiêu đề.'); if (!s.b.length) e('Phần ' + (i + 1) + ': chưa có nội dung.'); s.b.forEach((b) => { if (b.t && !b.t.r.length) e('Phần ' + (i + 1) + ': bảng chưa có dòng nào.'); if (b.f && !b.f.length) e('Phần ' + (i + 1) + ': công thức trống.'); if (b.ul && !b.ul.length) e('Phần ' + (i + 1) + ': danh sách trống.'); }); });
  if (L.ex.length < 6) e('Cần ít nhất 6 ví dụ (hiện có ' + L.ex.length + ').');
  L.ex.forEach((x, i) => { if (!x[0] || !x[1]) e('Ví dụ ' + (i + 1) + ': thiếu câu tiếng Anh hoặc bản dịch.'); });
  if (L.mis.length < 3) e('Cần ít nhất 3 lỗi sai thường gặp (hiện có ' + L.mis.length + ').');
  L.mis.forEach((m, i) => { if (!m[0] || !m[1] || !m[2]) e('Lỗi thường gặp ' + (i + 1) + ': cần đủ 3 ô (sai, đúng, ghi chú).'); else if (m[0].trim().toLowerCase() === m[1].trim().toLowerCase()) e('Lỗi thường gặp ' + (i + 1) + ': câu sai trùng câu đúng.'); });
  if (L.quiz.length < 8) e('Cần ít nhất 8 câu luyện tập (hiện có ' + L.quiz.length + ').');
  const seen = new Set();
  L.quiz.forEach((q, i) => {
    const at = 'Câu luyện tập ' + (i + 1) + ': ';
    if (!q[0]) e(at + 'thiếu đề.');
    if (q[1].some((o) => !o)) e(at + 'cần đủ 4 đáp án không rỗng.');
    else if (new Set(q[1].map((o) => o.toLowerCase())).size !== 4) e(at + 'có đáp án trùng nhau.');
    if (!(q[2] >= 0 && q[2] <= 3)) e(at + 'chưa chọn đáp án đúng.');
    if (!q[3] || q[3].length < 8) e(at + 'thiếu lời giải thích (≥ 8 ký tự).');
    if (q[0] && (q[0].match(/___/g) || []).length > 1) e(at + 'có nhiều hơn 1 chỗ trống ___.');
    if (q[0] && seen.has(q[0])) e(at + 'trùng đề với câu khác.'); seen.add(q[0]);
    if (q[0] && !/___/.test(q[0]) && !/\?/.test(q[0]) && q.length < 5) w(at + 'đề không có chỗ trống ___ hoặc dấu hỏi — kiểm tra lại cách đặt câu.');
  });
  if (L.summary.length > 0 && L.summary.length < 20) w('Phần tóm tắt hơi ngắn.');
  return { errors, warns };
}
const metaOf = (id, L) => ({ id, grade: L.grade, icon: L.icon, title: L.title, sub: L.sub, level: L.level, summary: L.summary, q: (L.quiz || []).length });
const slug = (s) => String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 30) || 'bai';

// ───────── AI: lời nhắc + lược đồ ─────────
const REFERENCE_BOOKS = [
  'English Grammar in Use (Raymond Murphy)', 'Advanced Grammar in Use (Martin Hewings)', 'Oxford English Grammar (Sidney Greenbaum)', 'Oxford Practice Grammar – Advanced (George Yule)',
  'Longman English Grammar Practice (L. G. Alexander)', 'A Practical English Grammar (Thomson & Martinet)', 'Basic English Grammar for Dummies', 'Understanding and Using English Grammar (Betty Azar)',
  'TOEFL preparation guides', 'Cambridge Grammar for IELTS', 'Collins Grammar for IELTS', 'Achieve IELTS Grammar and Vocabulary', 'Destination Grammar & Vocabulary (Malcolm Mann)',
  'Vietnamese references: Ngữ pháp tiếng Anh căn bản, Tiếng Anh cơ bản, 25 chủ điểm ngữ pháp quan trọng trong IELTS, Sách vàng ngữ pháp và biên tập tiếng Anh',
];
const SYS_COMMON = `You are a senior English grammar teacher and course-material editor writing for VIETNAMESE school students (grades 6-12, Vietnamese national curriculum, CEFR A1-B2).
Authoritative guidance: follow standard grammar as described consistently in these reputable references: ${REFERENCE_BOOKS.join('; ')}.
Rules for accuracy:
- Base the lesson on the TEACHER'S SOURCE FILE, but check and complete every rule against standard English grammar. Prefer rules on which the references agree. Never present a disputed, regional, or very rare usage as an absolute rule; say "thường" (usually) when appropriate.
- If the source file contains a statement that contradicts standard grammar, or is unclear/incomplete, DO NOT silently copy it: follow standard grammar and describe the problem in "issues" (in Vietnamese, short and specific).
- Write original explanations and original example sentences. Do not copy sentences from the reference books or reproduce long passages of any copyrighted text.
- Explanations in clear, friendly Vietnamese for students; example sentences in natural English, with correct Vietnamese translations. Use **double asterisks** to bold key forms/words.
- Everything must be factually correct. If unsure about something, leave it out and mention it in "issues".`;
const SYS_OUTLINE = SYS_COMMON + `\n\nTASK: read the source file and split it into separate grammar TOPICS (chủ điểm) that each deserve one lesson. Merge tiny related points; split huge ones. Order from easier to harder. For each topic give: a short Vietnamese title, an English sub-title (e.g. "Present Simple"), one emoji icon, a level (Cơ bản/Trung bình/Nâng cao), 3-8 key points taken from the file (short, in Vietnamese or English as in the file), and source_notes (brief notes on which part of the file covers it). Never invent topics that are absent from the file.`;
const SYS_LESSON = SYS_COMMON + `\n\nTASK: write ONE complete lesson for the given topic. Required structure:
- title (Vietnamese, ≤60 chars), sub (English or bilingual sub-title ≤60 chars), icon (1 emoji), level, summary (1-3 Vietnamese sentences).
- sections: 3-5 sections, each with a heading (numbered like "1. ...") and 2-6 blocks. Block kinds: "p" (paragraph; text), "f" (formula lines, e.g. "(+) S + V(s/es) + O"; lines), "t" (table; header + rows, every row has the same number of cells as the header), "tip" (helpful tip; text), "warn" (common-trap warning; text), "ul" (bullet list; lines). Include at least one table or formula block when the topic has forms.
- examples: 8-10 natural sentences {en, vi}, covering different uses; keep vocabulary suitable for the level.
- mistakes: 4-5 typical Vietnamese-learner errors {wrong, right, note}: "wrong" must really be wrong, "right" the correction, "note" a short Vietnamese reason.
- quiz: exactly 10 multiple-choice questions for school students. Each: stem with exactly one blank "___" (or a short direct question), 4 options, answer_index (0-3), explanation in Vietnamese stating the rule. Exactly ONE option may be correct: check that every distractor is clearly wrong for the stem and no two options are both acceptable. Vary the difficulty and the position of the correct answer. Do not reuse the example sentences verbatim as quiz stems.
- issues: Vietnamese notes about anything in the source file that was wrong, unclear, or that you could not verify (empty array if none).`;
const SYS_SOLVE = `You are an English grammar expert. Answer each multiple-choice question independently as an examiner would. Choose the single best option (0-based index). If more than one option is acceptable, or none is, or the question is unclear, set ambiguous=true and explain briefly in "note" (Vietnamese). Be strict: standard written English as in Murphy's English Grammar in Use / Oxford English Grammar.`;
const STR = { type: 'string' }, ARR_STR = { type: 'array', items: STR };
const SCHEMA_OUTLINE = { type: 'object', properties: { topics: { type: 'array', items: { type: 'object', properties: { title: STR, sub: STR, icon: STR, level: STR, key_points: ARR_STR, source_notes: STR }, required: ['title', 'sub', 'icon', 'level', 'key_points', 'source_notes'] } }, issues: ARR_STR }, required: ['topics', 'issues'] };
const SCHEMA_LESSON = { type: 'object', properties: {
  title: STR, sub: STR, icon: STR, level: STR, summary: STR,
  sections: { type: 'array', items: { type: 'object', properties: { heading: STR, blocks: { type: 'array', items: { type: 'object', properties: { kind: STR, text: STR, lines: ARR_STR, header: ARR_STR, rows: { type: 'array', items: ARR_STR } }, required: ['kind', 'text', 'lines', 'header', 'rows'] } } }, required: ['heading', 'blocks'] } },
  examples: { type: 'array', items: { type: 'object', properties: { en: STR, vi: STR }, required: ['en', 'vi'] } },
  mistakes: { type: 'array', items: { type: 'object', properties: { wrong: STR, right: STR, note: STR }, required: ['wrong', 'right', 'note'] } },
  quiz: { type: 'array', items: { type: 'object', properties: { stem: STR, options: ARR_STR, answer_index: { type: 'integer' }, explanation: STR }, required: ['stem', 'options', 'answer_index', 'explanation'] } },
  issues: ARR_STR }, required: ['title', 'sub', 'icon', 'level', 'summary', 'sections', 'examples', 'mistakes', 'quiz', 'issues'] };
const SCHEMA_SOLVE = { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: { n: { type: 'integer' }, choice_index: { type: 'integer' }, ambiguous: { type: 'boolean' }, note: STR }, required: ['n', 'choice_index', 'ambiguous', 'note'] } } }, required: ['results'] };

function fromAI(a, grade) {
  const sections = (a.sections || []).map((s) => ({
    h: s.heading, b: (s.blocks || []).map((b) => {
      const k = String(b.kind || '').toLowerCase();
      if (k === 'p' || k === 'tip' || k === 'warn') return b.text ? { [k]: b.text } : null;
      if (k === 'f') return (b.lines || []).length ? { f: b.lines } : null;
      if (k === 'ul') return (b.lines || []).length ? { ul: b.lines } : null;
      if (k === 't') return (b.header || []).length && (b.rows || []).length ? { t: { h: b.header, r: b.rows } } : null;
      return null;
    }).filter(Boolean),
  }));
  return normalizeLesson({ grade, icon: a.icon, title: a.title, sub: a.sub, level: a.level, summary: a.summary, sections,
    ex: (a.examples || []).map((e) => [e.en, e.vi]), mis: (a.mistakes || []).map((m) => [m.wrong, m.right, m.note]),
    quiz: (a.quiz || []).map((q) => [q.stem, q.options, q.answer_index, q.explanation]) }, grade);
}

module.exports = function registerSchoolAdmin(app, { db, requireAuth, requireRole, now, ai }) {
  const staff = requireRole('teacher', 'admin');
  const MOCK = process.env.EWT_AI_MOCK === '1';
  const aiReady = () => MOCK || (ai && ai.aiEnabled && ai.aiEnabled());
  const builtin = loadBuiltin();
  const J = (s, d) => { try { return s ? JSON.parse(s) : d; } catch (e) { return d; } };

  db.exec(`CREATE TABLE IF NOT EXISTS school_lessons (
    id TEXT PRIMARY KEY, grade INTEGER NOT NULL, status TEXT NOT NULL, data TEXT, flags TEXT, source TEXT,
    created_by INTEGER, created_at TEXT, updated_at TEXT, updated_by INTEGER);
  CREATE TABLE IF NOT EXISTS school_lesson_versions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, lesson_id TEXT NOT NULL, data TEXT, status TEXT, saved_at TEXT, saved_by INTEGER, note TEXT);
  CREATE INDEX IF NOT EXISTS idx_slv_lesson ON school_lesson_versions(lesson_id);`);
  const getRow = (id) => db.prepare('SELECT * FROM school_lessons WHERE id=?').get(id);
  const pushVersion = (id, data, status, uid, note) => {
    if (!data) return;
    db.prepare('INSERT INTO school_lesson_versions (lesson_id,data,status,saved_at,saved_by,note) VALUES (?,?,?,?,?,?)').run(id, data, status, now(), uid, note || '');
    db.prepare('DELETE FROM school_lesson_versions WHERE lesson_id=? AND id NOT IN (SELECT id FROM school_lesson_versions WHERE lesson_id=? ORDER BY id DESC LIMIT 15)').run(id, id);
  };
  const isBuiltin = (id) => builtin.has(id);

  // ───────── Công khai: bài đã xuất bản (ghi đè / mới) + danh sách bài ẩn ─────────
  app.get('/api/school/extra', (req, res) => {
    const lessons = {}, hidden = [];
    for (const r of db.prepare("SELECT id,status,data FROM school_lessons WHERE status IN ('published','hidden')").all()) {
      if (r.status === 'hidden') { hidden.push(r.id); continue; }
      const d = J(r.data, null); if (!d) continue; lessons[r.id] = Object.assign({ id: r.id }, d);
    }
    res.setHeader('Cache-Control', 'no-cache'); res.json({ lessons, hidden });
  });

  // ───────── Giáo viên / admin ─────────
  function stateOf(id, row) {
    if (row) return row.status === 'published' ? (isBuiltin(id) ? 'edited' : 'published') : row.status; // draft | hidden | published | edited
    return 'builtin';
  }
  app.get('/api/school/admin/list', requireAuth, staff, (req, res) => {
    const rows = new Map(db.prepare('SELECT id,grade,status,data,flags,source,updated_at FROM school_lessons').all().map((r) => [r.id, r]));
    const out = [];
    for (const [id, L] of builtin) { const r = rows.get(id); const d = r && r.data ? J(r.data, null) : null; const M = metaOf(id, d || L); out.push(Object.assign(M, { builtin: true, state: stateOf(id, r), flags: r ? (J(r.flags, []) || []).length : 0, updated_at: r ? r.updated_at : null, hasOverride: !!r })); }
    for (const r of rows.values()) { if (isBuiltin(r.id)) continue; const d = J(r.data, null); if (!d) continue; out.push(Object.assign(metaOf(r.id, d), { builtin: false, state: stateOf(r.id, r), flags: (J(r.flags, []) || []).length, updated_at: r.updated_at, source: r.source || '' })); }
    res.json({ lessons: out });
  });

  app.get('/api/school/admin/lesson/:id', requireAuth, staff, (req, res) => {
    const id = String(req.params.id); const row = getRow(id); const b = builtin.get(id);
    if (!row && !b) return res.status(404).json({ error: 'Không tìm thấy bài học.' });
    const data = row && row.data ? J(row.data, null) : b;
    if (!data) return res.status(404).json({ error: 'Không đọc được nội dung bài học.' });
    const vers = db.prepare('SELECT id,saved_at,note,status FROM school_lesson_versions WHERE lesson_id=? ORDER BY id DESC LIMIT 15').all(id);
    res.json({ id, lesson: Object.assign({}, data, { id: undefined }), state: stateOf(id, row), builtin: !!b, hasOverride: !!row, flags: row ? J(row.flags, []) : [], source: row ? row.source : '', versions: vers });
  });
  app.get('/api/school/admin/builtin/:id', requireAuth, staff, (req, res) => { const b = builtin.get(String(req.params.id)); if (!b) return res.status(404).json({ error: 'Không có bài gốc.' }); res.json({ lesson: b }); });

  app.post('/api/school/admin/lesson', requireAuth, staff, (req, res) => {
    const grade = parseInt((req.body || {}).grade, 10);
    if (!(grade >= 6 && grade <= 12)) return res.status(400).json({ error: 'Chọn lớp từ 6 đến 12.' });
    const title = cut((req.body || {}).title, 80) || 'Bài học mới';
    const id = 'g' + grade + '-' + slug(title) + '-' + crypto.randomBytes(2).toString('hex');
    const L = normalizeLesson({ grade, icon: '📘', title, sub: '', level: 'Cơ bản', summary: '', sections: [{ h: '1. ', b: [{ p: '' }] }], ex: [], mis: [], quiz: [] }, grade);
    db.prepare('INSERT INTO school_lessons (id,grade,status,data,flags,source,created_by,created_at,updated_at,updated_by) VALUES (?,?,?,?,?,?,?,?,?,?)').run(id, grade, 'draft', JSON.stringify(L), '[]', 'manual', req.user.id, now(), now(), req.user.id);
    res.json({ ok: true, id });
  });

  // Lưu (nháp hoặc xuất bản). Xuất bản chỉ khi hết lỗi bắt buộc.
  app.put('/api/school/admin/lesson/:id', requireAuth, staff, (req, res) => {
    const id = String(req.params.id); const row = getRow(id), b = builtin.get(id);
    if (!row && !b) return res.status(404).json({ error: 'Không tìm thấy bài học.' });
    const want = (req.body || {}).status; // 'published' | 'draft' | (bỏ trống = giữ nguyên trạng thái hiện tại; bài chưa có bản sửa → nháp)
    const status = want === 'published' ? 'published' : want === 'draft' ? 'draft' : (row ? row.status : 'draft');
    const grade = (row && row.grade) || (b && b.grade);
    const L = normalizeLesson((req.body || {}).lesson, grade);
    L.grade = grade; // lớp gắn với mã bài, không đổi ở đây
    const v = validateLesson(L);
    if (status === 'published' && v.errors.length) return res.status(400).json({ error: 'Chưa thể xuất bản — còn ' + v.errors.length + ' lỗi cần sửa.', errors: v.errors, warns: v.warns });
    if (!L.title) return res.status(400).json({ error: 'Cần có tên bài học.', errors: v.errors, warns: v.warns });
    if (row && row.data) pushVersion(id, row.data, row.status, req.user.id, 'trước khi lưu');
    else if (b && !row) pushVersion(id, JSON.stringify(b), 'builtin', req.user.id, 'bản gốc');
    const flags = JSON.stringify(((req.body || {}).flags && Array.isArray(req.body.flags) ? req.body.flags : (row ? J(row.flags, []) : [])).slice(0, 60));
    if (row) db.prepare('UPDATE school_lessons SET status=?, data=?, flags=?, updated_at=?, updated_by=? WHERE id=?').run(status, JSON.stringify(L), flags, now(), req.user.id, id);
    else db.prepare('INSERT INTO school_lessons (id,grade,status,data,flags,source,created_by,created_at,updated_at,updated_by) VALUES (?,?,?,?,?,?,?,?,?,?)').run(id, grade, status, JSON.stringify(L), flags, 'edit', req.user.id, now(), now(), req.user.id);
    res.json({ ok: true, status, errors: v.errors, warns: v.warns, state: stateOf(id, getRow(id)) });
  });

  app.post('/api/school/admin/lesson/:id/status', requireAuth, staff, (req, res) => {
    const id = String(req.params.id); const st = (req.body || {}).status; const row = getRow(id), b = builtin.get(id);
    if (!row && !b) return res.status(404).json({ error: 'Không tìm thấy bài học.' });
    if (!['published', 'draft', 'hidden', 'builtin'].includes(st)) return res.status(400).json({ error: 'Trạng thái không hợp lệ.' });
    if (st === 'builtin') { if (!b) return res.status(400).json({ error: 'Bài này không có bản gốc.' }); if (row) { pushVersion(id, row.data, row.status, req.user.id, 'trước khi khôi phục bản gốc'); db.prepare('DELETE FROM school_lessons WHERE id=?').run(id); } return res.json({ ok: true, state: 'builtin' }); }
    if (st === 'published') { const d = row && row.data ? normalizeLesson(J(row.data, {}), row.grade) : null; if (d) { const v = validateLesson(d); if (v.errors.length) return res.status(400).json({ error: 'Chưa thể xuất bản — còn ' + v.errors.length + ' lỗi cần sửa.', errors: v.errors }); } else if (!b) return res.status(400).json({ error: 'Bài chưa có nội dung.' }); }
    if (row) db.prepare('UPDATE school_lessons SET status=?, updated_at=?, updated_by=? WHERE id=?').run(st, now(), req.user.id, id);
    else db.prepare('INSERT INTO school_lessons (id,grade,status,data,flags,source,created_by,created_at,updated_at,updated_by) VALUES (?,?,?,?,?,?,?,?,?,?)').run(id, b.grade, st, null, '[]', 'edit', req.user.id, now(), now(), req.user.id);
    res.json({ ok: true, state: stateOf(id, getRow(id)) });
  });

  app.delete('/api/school/admin/lesson/:id', requireAuth, staff, (req, res) => {
    const id = String(req.params.id); const row = getRow(id);
    if (!row) return res.status(isBuiltin(id) ? 400 : 404).json({ error: isBuiltin(id) ? 'Bài gốc không thể xoá — hãy dùng "Ẩn bài".' : 'Không tìm thấy bài học.' });
    if (row.data) pushVersion(id, row.data, row.status, req.user.id, 'trước khi xoá');
    db.prepare('DELETE FROM school_lessons WHERE id=?').run(id); res.json({ ok: true });
  });

  app.post('/api/school/admin/lesson/:id/restore', requireAuth, staff, (req, res) => {
    const id = String(req.params.id); const vid = parseInt((req.body || {}).version_id, 10);
    const v = db.prepare('SELECT * FROM school_lesson_versions WHERE id=? AND lesson_id=?').get(vid, id);
    if (!v) return res.status(404).json({ error: 'Không tìm thấy phiên bản.' });
    res.json({ ok: true, lesson: J(v.data, null), saved_at: v.saved_at });
  });

  // Kiểm tra cấu trúc (không lưu)
  app.post('/api/school/admin/validate', requireAuth, staff, (req, res) => {
    const L = normalizeLesson((req.body || {}).lesson, parseInt((req.body || {}).grade, 10) || 6); res.json(validateLesson(L));
  });

  // ───────── AI ─────────
  const aiUse = new Map();
  function aiAllowed(uid) { const t = Date.now(), a = (aiUse.get(uid) || []).filter((x) => x > t - 3600e3); if (a.length >= AI_PER_HOUR) { aiUse.set(uid, a); return false; } a.push(t); aiUse.set(uid, a); return true; }

  function mockAI(kind, p) {
    if (kind === 'outline') return { topics: [{ title: 'Thì hiện tại đơn (mô phỏng)', sub: 'Present Simple', icon: '⏰', level: 'Cơ bản', key_points: ['thói quen', 'sự thật'], source_notes: 'mô phỏng' }, { title: 'So sánh hơn (mô phỏng)', sub: 'Comparatives', icon: '📏', level: 'Trung bình', key_points: ['tính từ ngắn'], source_notes: 'mô phỏng' }], issues: ['(Mô phỏng) File nói "he go" là đúng — thực tế phải là "he goes".'] };
    if (kind === 'lesson') {
      const q = []; for (let i = 0; i < 10; i++) q.push({ stem: 'Câu ' + (i + 1) + ': She ___ to school every day (' + p.topic.title + ').', options: ['goes', 'go', 'going', 'gone'], answer_index: i === 6 ? 1 : 0, explanation: 'Chủ ngữ she (ngôi 3 số ít) nên động từ thêm -es: goes.' });
      return { title: p.topic.title, sub: p.topic.sub, icon: p.topic.icon, level: 'Cơ bản', summary: 'Bài học mô phỏng để kiểm thử công cụ phân tích file.',
        sections: [{ heading: '1. Cách dùng', blocks: [{ kind: 'p', text: 'Dùng để nói về **thói quen**.', lines: [], header: [], rows: [] }, { kind: 'f', text: '', lines: ['(+) S + V(s/es)', '(-) S + do/does not + V'], header: [], rows: [] }] }, { heading: '2. Bảng chia', blocks: [{ kind: 't', text: '', lines: [], header: ['Chủ ngữ', 'Động từ'], rows: [['I / you / we / they', 'go'], ['he / she / it', 'goes']] }, { kind: 'tip', text: 'Thêm -es sau động từ tận cùng bằng o, s, x, ch, sh.', lines: [], header: [], rows: [] }] }],
        examples: Array.from({ length: 8 }, (_, i) => ({ en: 'She goes to school by bus ' + (i + 1) + '.', vi: 'Cô ấy đi học bằng xe buýt ' + (i + 1) + '.' })),
        mistakes: [{ wrong: 'She go to school.', right: 'She goes to school.', note: 'Thiếu -es.' }, { wrong: 'He don\'t like tea.', right: 'He doesn\'t like tea.', note: 'Dùng doesn\'t.' }, { wrong: 'I goes home.', right: 'I go home.', note: 'I không thêm -es.' }],
        quiz: q, issues: [] };
    }
    return { results: p.items.map((it) => { const ci = it.options.indexOf('goes'); return { n: it.n, choice_index: ci >= 0 ? ci : 0, ambiguous: it.n === 3, note: it.n === 3 ? '(Mô phỏng) Có hai đáp án chấp nhận được.' : '' }; }) };
  }
  async function callAI(kind, p) {
    if (MOCK) return mockAI(kind, p);
    const cfg = {
      outline: { system: SYS_OUTLINE, schema: SCHEMA_OUTLINE, maxTokens: 6000, temperature: 0.1 },
      lesson: { system: SYS_LESSON, schema: SCHEMA_LESSON, maxTokens: 12000, temperature: 0.3 },
      solve: { system: SYS_SOLVE, schema: SCHEMA_SOLVE, maxTokens: 4000, temperature: 0 },
    }[kind];
    let last;
    for (let i = 0; i < 2; i++) { try { return await ai.generateJSON(Object.assign({ user: p.user, files: p.files }, cfg)); } catch (e) { last = e; } }
    throw last;
  }
  const quizItems = (quiz) => quiz.map((q, i) => ({ n: i + 1, stem: q[0], options: q[1] }));
  async function solveQuiz(quiz) {
    const items = quizItems(quiz); const user = 'Questions:\n' + items.map((it) => it.n + '. ' + it.stem + '\n   0) ' + it.options[0] + '  1) ' + it.options[1] + '  2) ' + it.options[2] + '  3) ' + it.options[3]).join('\n');
    const r = await callAI('solve', { user, items }); const flags = [];
    const by = new Map(((r && r.results) || []).map((x) => [x.n, x]));
    quiz.forEach((q, i) => {
      const x = by.get(i + 1); if (!x) return;
      if (x.ambiguous) flags.push({ where: 'Câu luyện tập ' + (i + 1), msg: 'AI thấy câu này có thể có nhiều đáp án hoặc chưa rõ' + (x.note ? ': ' + x.note : '.') + ' Hãy xem lại.' });
      else if (x.choice_index !== q[2]) flags.push({ where: 'Câu luyện tập ' + (i + 1), msg: 'AI chọn "' + (q[1][x.choice_index] || '?') + '" nhưng đáp án đặt là "' + (q[1][q[2]] || '?') + '". Hãy kiểm tra lại đáp án.' + (x.note ? ' (' + x.note + ')' : '') });
    });
    return flags;
  }
  app.post('/api/school/admin/check-quiz', requireAuth, staff, async (req, res) => {
    if (!aiReady()) return res.status(503).json({ error: 'Hệ thống AI chưa sẵn sàng.' });
    if (!aiAllowed(req.user.id)) return res.status(429).json({ error: 'Bạn đã dùng AI nhiều trong 1 giờ qua, vui lòng thử lại sau.' });
    const L = normalizeLesson((req.body || {}).lesson, 6); const q = L.quiz.filter((x) => x[0] && x[1].every(Boolean) && x[2] >= 0);
    if (!q.length) return res.status(400).json({ error: 'Chưa có câu luyện tập hợp lệ để kiểm tra.' });
    try { res.json({ flags: await solveQuiz(q), checked: q.length }); } catch (e) { console.error('[school-admin/check-quiz]', e.message); res.status(502).json({ error: 'AI chưa kiểm tra được, hãy thử lại.' }); }
  });

  // ───────── Phân tích file lý thuyết → các bài NHÁP ─────────
  const mem = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 1 } });
  const jobs = new Map();
  function sniff(buf, name) {
    const e = ((String(name || '').match(/\.([A-Za-z0-9]+)$/) || [])[1] || '').toLowerCase();
    if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { kind: 'file', mime: 'image/jpeg' };
    if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { kind: 'file', mime: 'image/png' };
    if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return { kind: 'file', mime: 'image/webp' };
    if (buf.length > 4 && buf.toString('ascii', 0, 4) === '%PDF') return { kind: 'file', mime: 'application/pdf' };
    if (buf.length > 4 && buf.readUInt32LE(0) === 0x04034b50) return e === 'docx' ? { kind: 'docx' } : e === 'xlsx' ? { kind: 'xlsx' } : { kind: 'unknown' };
    if (['txt', 'md', 'csv', 'tsv'].includes(e)) return { kind: 'text' };
    return { kind: 'unknown' };
  }
  app.post('/api/school/admin/analyze', requireAuth, staff, (req, res) => {
    mem.single('file')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File quá lớn (tối đa 8MB).' : 'Không nhận được file.' });
      const f = req.file; if (!f || !f.buffer || !f.buffer.length) return res.status(400).json({ error: 'Chưa chọn file.' });
      const grade = parseInt(req.body.grade, 10); if (!(grade >= 6 && grade <= 12)) return res.status(400).json({ error: 'Hãy chọn lớp (6–12) cho các bài sẽ tạo.' });
      const maxLessons = Math.max(1, Math.min(8, parseInt(req.body.max, 10) || 4)); const note = cut(req.body.note, 600);
      if ([...jobs.values()].some((j) => j.user === req.user.id && j.status === 'running')) return res.status(409).json({ error: 'Bạn đang có một lượt phân tích chạy dở — hãy chờ nó xong.' });
      if (!aiReady()) return res.status(503).json({ error: 'Hệ thống AI chưa sẵn sàng (chưa liên kết tài khoản AI).' });
      if (!aiAllowed(req.user.id)) return res.status(429).json({ error: 'Bạn đã dùng AI nhiều trong 1 giờ qua (tối đa ' + AI_PER_HOUR + ' lượt/giờ), vui lòng thử lại sau.' });
      const sk = sniff(f.buffer, f.originalname); let text = null, files = null;
      try {
        if (sk.kind === 'file') files = [{ mime: sk.mime, data: f.buffer.toString('base64') }];
        else if (sk.kind === 'docx') text = docxToText(f.buffer); else if (sk.kind === 'xlsx') text = xlsxToText(f.buffer); else if (sk.kind === 'text') text = f.buffer.toString('utf8').replace(/^﻿/, '');
        else return res.status(400).json({ error: 'Chỉ nhận file Word (.docx), PDF, ảnh (JPG/PNG/WEBP), Excel (.xlsx) hoặc .txt.' });
      } catch (e) { return res.status(400).json({ error: 'Không đọc được file: ' + e.message }); }
      if (text !== null) { text = text.replace(/\r/g, '').trim(); if (text.length < 80) return res.status(400).json({ error: 'File gần như không có chữ để phân tích.' }); text = text.slice(0, 40000); }
      const id = crypto.randomBytes(6).toString('hex');
      const job = { id, user: req.user.id, status: 'running', phase: 'Đang đọc file…', total: 0, done: 0, lessons: [], issues: [], error: null, started: Date.now(), file: cut(f.originalname, 100), grade };
      jobs.set(id, job); for (const [k, j] of jobs) if (Date.now() - j.started > 2 * 3600e3) jobs.delete(k);
      runJob(job, { text, files, grade, maxLessons, note, uid: req.user.id }).catch((e) => { job.status = 'error'; job.error = 'Lỗi không mong muốn: ' + e.message; });
      res.json({ ok: true, job: id });
    });
  });
  app.get('/api/school/admin/jobs/:id', requireAuth, staff, (req, res) => {
    const j = jobs.get(req.params.id); if (!j || j.user !== req.user.id) return res.status(404).json({ error: 'Không tìm thấy lượt phân tích (có thể đã quá cũ).' });
    res.json({ id: j.id, status: j.status, phase: j.phase, total: j.total, done: j.done, lessons: j.lessons, issues: j.issues, error: j.error, file: j.file });
  });

  async function runJob(job, o) {
    const srcBlock = o.text !== null ? 'SOURCE FILE TEXT:\n"""\n' + o.text + '\n"""' : 'The source file is attached (image/PDF). Read all of it.';
    const extra = o.note ? '\nTEACHER NOTE: ' + o.note : '';
    try {
      job.phase = 'AI đang đọc file và tách các chủ điểm ngữ pháp…';
      const ol = await callAI('outline', { user: 'Target grade: ' + o.grade + '. Return at most ' + o.maxLessons + ' topics.' + extra + '\n\n' + srcBlock, files: o.files });
      let topics = ((ol && ol.topics) || []).filter((t) => t && t.title).slice(0, o.maxLessons);
      (ol.issues || []).forEach((x) => job.issues.push(String(x).slice(0, 400)));
      if (!topics.length) throw new Error('AI không tìm thấy chủ điểm ngữ pháp nào trong file này.');
      job.total = topics.length;
      for (let i = 0; i < topics.length; i++) {
        const t = topics[i]; job.phase = 'Đang viết bài ' + (i + 1) + '/' + topics.length + ': ' + String(t.title).slice(0, 60) + '…';
        try {
          const a = await callAI('lesson', { topic: t, user: 'Target grade: ' + o.grade + ' (' + (t.level || 'Cơ bản') + ').\nTOPIC: ' + JSON.stringify(t) + extra + '\n\n' + srcBlock, files: o.files });
          const L = fromAI(a, o.grade); L.level = LEVELS.includes(t.level) && !LEVELS.includes(a.level) ? t.level : L.level;
          const v = validateLesson(L); const flags = [];
          v.errors.forEach((m) => flags.push({ where: 'Cấu trúc', msg: m })); v.warns.forEach((m) => flags.push({ where: 'Lưu ý', msg: m }));
          (a.issues || []).forEach((m) => flags.push({ where: 'AI ghi chú về file gốc', msg: String(m).slice(0, 400) }));
          job.phase = 'Đang kiểm tra chéo đáp án bài ' + (i + 1) + '/' + topics.length + '…';
          const valid = L.quiz.filter((q) => q[0] && q[1].every(Boolean) && q[2] >= 0);
          try { if (valid.length === L.quiz.length) (await solveQuiz(L.quiz)).forEach((x) => flags.push(x)); else flags.push({ where: 'Kiểm tra chéo', msg: 'Bỏ qua kiểm tra chéo vì có câu luyện tập chưa hợp lệ.' }); }
          catch (e) { flags.push({ where: 'Kiểm tra chéo', msg: 'AI chưa kiểm tra chéo được đáp án — hãy bấm "Kiểm tra đáp án bằng AI" trong trang sửa.' }); }
          const id = 'g' + o.grade + '-' + slug(L.title) + '-' + crypto.randomBytes(2).toString('hex');
          db.prepare('INSERT INTO school_lessons (id,grade,status,data,flags,source,created_by,created_at,updated_at,updated_by) VALUES (?,?,?,?,?,?,?,?,?,?)').run(id, o.grade, 'draft', JSON.stringify(L), JSON.stringify(flags.slice(0, 60)), 'ai:' + job.file, o.uid, now(), now(), o.uid);
          job.lessons.push({ id, title: L.title, flags: flags.length, errors: v.errors.length });
        } catch (e) { console.error('[school-admin] bài ' + (i + 1) + ': ' + e.message); job.lessons.push({ id: null, title: t.title, failed: true, flags: 0 }); }
        job.done = i + 1;
      }
      job.status = 'done'; job.phase = 'Hoàn tất';
    } catch (e) { console.error('[school-admin/job]', e.message); job.status = 'error'; job.error = e.message || 'AI gặp lỗi, hãy thử lại.'; }
  }
  console.log('[school-admin] sẵn sàng: ' + builtin.size + ' bài gốc');
};
module.exports.pure = { normalizeLesson, validateLesson, fromAI };
