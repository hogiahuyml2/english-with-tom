'use strict';
// Kiểm tra cấu trúc & chất lượng ngân hàng đề Kiểm tra đầu vào. Chạy: node placement/check-bank.js
const fs = require('fs'), path = require('path');
const bank = require('./bank');
const LV = ['A1', 'A2', 'B1', 'B2', 'C1'];
let err = 0, warn = 0;
const bad = (id, m) => { err++; console.log('❌', id, m); };
const meh = (id, m) => { warn++; console.log('⚠️ ', id, m); };
const manifest = fs.existsSync(path.join(__dirname, 'audio', 'manifest.json')) ? JSON.parse(fs.readFileSync(path.join(__dirname, 'audio', 'manifest.json'), 'utf8')) : {};
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const seenText = new Map();
for (const it of bank.all) {
  const id = it.id;
  if (!LV.includes(it.lv)) bad(id, 'bậc không hợp lệ ' + it.lv);
  if (!it.src) bad(id, 'thiếu nguồn'); if (!['official', 'assistant'].includes(it.key)) bad(id, 'key không hợp lệ');
  const checkOpts = (q, where) => {
    if (!Array.isArray(q.opts) || q.opts.length < 2 || q.opts.length > 4) bad(id, where + ' số phương án ' + (q.opts && q.opts.length));
    if (q.opts.some((o) => !String(o).trim())) bad(id, where + ' có phương án rỗng');
    if (new Set(q.opts.map(norm)).size !== q.opts.length) bad(id, where + ' có 2 phương án giống nhau: ' + JSON.stringify(q.opts));
    if (!Number.isInteger(q.a) || q.a < 0 || q.a >= q.opts.length) bad(id, where + ' đáp án ngoài phạm vi');
    if (q.opts.some((o) => /^[A-D][.)]\s/.test(o))) meh(id, where + ' phương án còn chứa nhãn A/B/C');
    if (q.opts.some((o) => /[\u0000-\u001f]/.test(o))) bad(id, where + ' ký tự điều khiển');
  };
  if (it.type === 'mcq') {
    checkOpts(it, 'mcq');
    if (it.sk !== 'reading' && !/_{3,}/.test(it.text)) bad(id, 'câu điền từ không có chỗ trống ____');
    if (it.sk === 'reading' && !it.text) bad(id, 'thông báo rỗng');
    const k = norm(it.text + '|' + it.opts.join('|')); if (seenText.has(k)) bad(id, 'trùng nội dung với ' + seenText.get(k)); seenText.set(k, id);
  } else if (it.type === 'fill') {
    if (!/_{3,}/.test(it.text)) bad(id, 'fill không có chỗ trống'); if (!it.accept || !it.accept.length) bad(id, 'fill thiếu đáp án');
    if (it.accept.some((a) => !a.trim() || a.length > 30)) bad(id, 'đáp án fill bất thường');
    const k = norm(it.text); if (seenText.has(k)) bad(id, 'trùng nội dung với ' + seenText.get(k)); seenText.set(k, id);
  } else if (it.type === 'passage') {
    if ((it.text || '').split(/\s+/).length < 80) meh(id, 'bài đọc ngắn (<80 từ)'); if (!it.qs.length) bad(id, 'bài đọc không có câu hỏi');
    it.qs.forEach((q, i) => checkOpts(q, 'câu ' + (i + 1)));
  } else if (it.type === 'listen') {
    if (!it.script || !it.script.length) bad(id, 'thiếu lời thoại'); else for (const [, t] of it.script) { if (!String(t).trim()) bad(id, 'lời rỗng'); }
    it.qs.forEach((q, i) => checkOpts(q, 'câu ' + (i + 1)));
    if (it.img && !fs.existsSync(path.join(__dirname, 'img', id + '.jpg'))) bad(id, 'thiếu file hình');
    if (!it.plays || ![1, 2].includes(it.plays)) bad(id, 'thiếu số lượt nghe');
    if (!it.spare && !manifest[id]) bad(id, 'chưa có file âm thanh');
    if (!it.spare && manifest[id] && (manifest[id].sec < 8 || manifest[id].sec > 400)) meh(id, 'độ dài âm thanh bất thường ' + manifest[id].sec + 's');
  } else if (it.type === 'writing') {
    if (!it.prompt || !it.minWords || ![1, 2].includes(it.task)) bad(id, 'đề viết thiếu thông tin');
  } else bad(id, 'loại không biết ' + it.type);
  // ký tự lạ / lỗi OCR phổ biến
  const blob = JSON.stringify(it);
  if (/[­​�]/.test(blob)) bad(id, 'có ký tự ẩn/hỏng');
  if (/\b(l'll|l've|l'm|\bl\s)\b/.test(blob.replace(/\\n/g, ' '))) meh(id, 'có thể có lỗi OCR chữ "I" thành "l"');
  if (/\s{2,}\S/.test((it.text || '').replace(/\n/g, ' ').replace(/\s{2}/g, ' ')) && false) meh(id, 'khoảng trắng thừa');
}
// thống kê
const cnt = {}; for (const it of bank.all) { const k = it.sk + '/' + it.lv + '/' + it.type; cnt[k] = (cnt[k] || 0) + 1; }
console.log('\nTổng ' + bank.all.length + ' mục; lỗi ' + err + ', cảnh báo ' + warn);
const pos = {}; for (const it of bank.all) { if (it.type === 'mcq') pos[it.a] = (pos[it.a] || 0) + 1; }
console.log('Phân bố vị trí đáp án đúng (trắc nghiệm đơn):', JSON.stringify(pos), '(đề được hoán vị phương án mỗi lần làm nên không ảnh hưởng)');
process.exit(err ? 1 : 0);
