'use strict';
// Gom toàn bộ ngân hàng đề Kiểm tra đầu vào. Mỗi mục có id duy nhất, nguồn (src) và loại đáp án (key).
const files = ['ket1', 'ket2', 'ket3', 'ket4', 'ket5', 'ket6', 'pet1', 'pet2', 'pet3', 'pet4', 'pet5', 'pet6', 'fce', 'writing'];
const all = [].concat(...files.map((f) => require('./' + f)));
// Bài nghe "dự phòng": chưa dùng trong đề (KET Listening Part 3 — hội thoại dài 5 câu) — giữ lại để mở rộng sau
for (const it of all) if (it.type === 'listen' && /^ket\d-l3$/.test(it.id)) it.spare = true;
const ids = new Set();
for (const it of all) { if (ids.has(it.id)) throw new Error('Trùng id trong ngân hàng: ' + it.id); ids.add(it.id); }
module.exports = { all, byId: new Map(all.map((i) => [i.id, i])) };
