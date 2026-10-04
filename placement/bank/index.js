'use strict';
// Gom toàn bộ ngân hàng đề Kiểm tra đầu vào. Mỗi mục có id duy nhất, nguồn (src) và loại đáp án (key).
const files = ['ket1', 'ket2', 'ket3', 'ket4', 'ket5', 'ket6', 'pet1', 'pet2', 'pet3', 'pet4', 'pet5', 'pet6', 'fce', 'writing'];
// Bài nghe cũ (giọng TTS tự tạo từ sách) đã được thay bằng bài nghe có âm thanh gốc Cambridge trong listen.json
const old = [].concat(...files.map((f) => require('./' + f))).filter((it) => it.type !== 'listen');
const all = require('./grammar-mcq').apply(old).concat(require('./listen.json'));
const ids = new Set();
for (const it of all) { if (ids.has(it.id)) throw new Error('Trùng id trong ngân hàng: ' + it.id); ids.add(it.id); }
module.exports = { all, byId: new Map(all.map((i) => [i.id, i])) };
