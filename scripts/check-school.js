// Kiểm tra cấu trúc dữ liệu bài học "Tiếng Anh phổ thông" (data/school/*.js).
// Chạy:  node scripts/check-school.js        (thoát mã 1 nếu có lỗi)
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..', 'data', 'school');
const files = fs.readdirSync(dir).filter(f => /^g\d+\.js$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
const ctx = { window: {} }; vm.createContext(ctx);
const errors = [], warns = [];
const err = (id, m) => errors.push(id + ': ' + m);
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f }); }
  catch (e) { errors.push(f + ': không chạy được — ' + e.message); }
}
const lessons = (ctx.window.SCHOOL && ctx.window.SCHOOL.lessons) || {};
const ids = Object.keys(lessons);
let nQuiz = 0;
for (const id of ids) {
  const L = lessons[id];
  const g = parseInt((id.match(/^g(\d+)-/) || [])[1]);
  if (!g || g < 6 || g > 12 || L.grade !== g) err(id, 'grade không khớp với id');
  for (const k of ['icon', 'title', 'sub', 'level', 'summary']) if (!L[k] || typeof L[k] !== 'string') err(id, 'thiếu ' + k);
  if (!['Cơ bản', 'Trung bình', 'Nâng cao'].includes(L.level)) err(id, 'level lạ: ' + L.level);
  if (!Array.isArray(L.sections) || L.sections.length < 2) err(id, 'cần ≥ 2 phần giải thích');
  (L.sections || []).forEach((s, i) => {
    if (!s.h || !Array.isArray(s.b) || !s.b.length) err(id, 'phần ' + (i + 1) + ' thiếu h/b');
    (s.b || []).forEach(b => {
      const kinds = ['p', 'f', 't', 'tip', 'warn', 'ul'].filter(k => k in b);
      if (kinds.length !== 1) err(id, 'khối không hợp lệ ' + JSON.stringify(b).slice(0, 40));
      if (b.t && (!Array.isArray(b.t.h) || !Array.isArray(b.t.r) || b.t.r.some(r => r.length !== b.t.h.length))) err(id, 'bảng lệch cột');
      if (b.f && (!Array.isArray(b.f) || !b.f.length)) err(id, 'công thức rỗng');
      if (b.ul && (!Array.isArray(b.ul) || !b.ul.length)) err(id, 'danh sách rỗng');
    });
  });
  if (!Array.isArray(L.ex) || L.ex.length < 6 || L.ex.some(e => !Array.isArray(e) || e.length !== 2 || !e[0] || !e[1])) err(id, 'cần ≥ 6 ví dụ [en, vi]');
  if (!Array.isArray(L.mis) || L.mis.length < 3 || L.mis.some(m => !Array.isArray(m) || m.length !== 3 || m.some(x => !x))) err(id, 'cần ≥ 3 lỗi thường gặp [sai, đúng, ghi chú]');
  if (L.mis) L.mis.forEach(m => { if (m[0] === m[1]) err(id, 'lỗi thường gặp: câu sai trùng câu đúng: ' + m[0]); });
  if (!Array.isArray(L.quiz) || L.quiz.length < 8) err(id, 'cần ≥ 8 câu luyện tập');
  const seenQ = new Set();
  (L.quiz || []).forEach((q, i) => {
    nQuiz++;
    const at = 'câu ' + (i + 1);
    if (!Array.isArray(q) || (q.length !== 4 && q.length !== 5) || (q.length === 5 && q[4] !== 1)) return err(id, at + ': sai định dạng (4 phần tử, hoặc 5 với cờ giữ thứ tự = 1)');
    const [stem, opts, ans, exp] = q;
    if (!stem || typeof stem !== 'string') err(id, at + ': thiếu đề');
    if (!Array.isArray(opts) || opts.length !== 4 || opts.some(o => !String(o).trim())) return err(id, at + ': cần đúng 4 đáp án không rỗng');
    if (new Set(opts.map(o => String(o).trim().toLowerCase())).size !== 4) err(id, at + ': đáp án trùng nhau');
    if (!Number.isInteger(ans) || ans < 0 || ans > 3) err(id, at + ': chỉ số đáp án sai');
    if (!exp || exp.length < 8) err(id, at + ': thiếu giải thích');
    if (seenQ.has(stem)) err(id, at + ': trùng đề'); seenQ.add(stem);
    if (/___/.test(stem) && (stem.match(/___/g) || []).length !== 1) err(id, at + ': nhiều hơn 1 chỗ trống');
  });
  const pos = (L.quiz || []).map(q => q[2]);
  // (vị trí đáp án đúng được xáo ngẫu nhiên khi làm bài nên không cần kiểm tra phân bố)
}
// chỉ mục khớp với dữ liệu
try {
  const idxFile = path.join(dir, 'index.js');
  if (fs.existsSync(idxFile)) {
    const c2 = { window: {} }; vm.createContext(c2); vm.runInContext(fs.readFileSync(idxFile, 'utf8'), c2);
    const idx = c2.window.SCHOOL_INDEX || [];
    const iid = idx.map(x => x.id);
    for (const id of ids) if (!iid.includes(id)) err(id, 'chưa có trong data/school/index.js (chạy node scripts/build-school-index.js)');
    for (const x of idx) if (!lessons[x.id]) err(x.id, 'có trong index nhưng không có bài học');
  }
} catch (e) { errors.push('index.js: ' + e.message); }
console.log('[check-school] ' + files.length + ' file, ' + ids.length + ' bài học, ' + nQuiz + ' câu luyện tập.');
if (warns.length) console.log('Cảnh báo nhẹ:\n - ' + warns.join('\n - '));
if (errors.length) { console.log('LỖI (' + errors.length + '):\n - ' + errors.join('\n - ')); process.exit(1); }
console.log('[check-school] ✅ Cấu trúc dữ liệu hợp lệ.');
