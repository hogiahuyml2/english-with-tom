// Sinh data/school/index.js (danh mục bài học) từ các file g6.js … g12.js để trang tổng hợp không phải tải toàn bộ nội dung.
// Chạy: node scripts/build-school-index.js
const fs = require('fs'), path = require('path'), vm = require('vm');
const dir = path.join(__dirname, '..', 'data', 'school');
const ctx = { window: {} }; vm.createContext(ctx);
const files = fs.readdirSync(dir).filter(f => /^g\d+\.js$/.test(f)).sort((a, b) => parseInt(a.slice(1)) - parseInt(b.slice(1)));
for (const f of files) vm.runInContext(fs.readFileSync(path.join(dir, f), 'utf8'), ctx, { filename: f });
const L = ctx.window.SCHOOL.lessons;
const idx = Object.keys(L).map(id => ({ id, grade: L[id].grade, icon: L[id].icon, title: L[id].title, sub: L[id].sub, level: L[id].level, summary: L[id].summary, q: L[id].quiz.length }))
  .sort((a, b) => a.grade - b.grade || Object.keys(L).indexOf(a.id) - Object.keys(L).indexOf(b.id));
fs.writeFileSync(path.join(dir, 'index.js'), '/* TỰ ĐỘNG SINH bởi scripts/build-school-index.js — đừng sửa tay */\nwindow.SCHOOL_INDEX = ' + JSON.stringify(idx, null, 1) + ';\n');
console.log('Đã ghi data/school/index.js: ' + idx.length + ' bài học.');
