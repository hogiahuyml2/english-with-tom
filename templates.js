'use strict';
// File MẪU nhập liệu (Excel) cho giáo viên + đọc lại file đã điền (Excel / Word / CSV / TXT) thành dòng văn bản cho các ô nhập có sẵn.
// Mẫu luôn có 3 trang: "Nhập liệu" (chỉ có dòng tiêu đề — điền vào đây), "Ví dụ" (mẫu điền), "Hướng dẫn".
const multer = require('multer');
const { buildXlsx } = require('./xlsx-lib');
const { xlsxToText, docxToText } = require('./lessonvocab').readers;

const POS = 'n,v,adj,adv,prep,conj,pron,phr v,phr';
const T = {
  'vocab-word': {
    file: 'mau-nhap-tu-vung.xlsx', title: 'Từ vựng thường',
    header: ['Từ vựng (tiếng Anh)', 'Loại từ', 'Nghĩa tiếng Việt', 'Câu ví dụ (phải chứa đúng từ ở cột A)', 'Dịch câu ví dụ'], widths: [24, 12, 28, 50, 46], validations: [{ col: 1, list: POS }],
    examples: [['umbrella', 'n', 'cái ô', 'Take an umbrella because it may rain.', 'Hãy mang theo ô vì trời có thể mưa.'], ['borrow', 'v', 'mượn', 'Can I borrow your pen?', 'Mình mượn bút của bạn được không?'], ['delicious', 'adj', 'ngon', 'The soup was delicious.', 'Món súp rất ngon.']],
    guide: ['Mỗi DÒNG là một từ. Không để trống dòng ở giữa.', 'Cột A–C bắt buộc. Cột D–E (câu ví dụ) nên có để trò chơi điền từ (Thủ môn, Tình huống) hoạt động tốt.', 'Câu ví dụ PHẢI chứa đúng từ ở cột A (viết y nguyên, ví dụ từ "borrow" thì câu có chữ "borrow").', 'Loại từ: n, v, adj, adv, prep, conj, pron, phr v (cụm động từ), phr (cụm từ).', 'Cấp độ (KET/PET/FCE/IELTS), chủ đề và loại nhập chọn trên trang web, không cần ghi trong file.', 'Từ đã có trong kho sẽ được cập nhật nghĩa/ví dụ, không bị nhân đôi.', 'Mỗi lần nhập tối đa 300 dòng.'],
    where: 'Luyện từ → Dành cho giáo viên → Nhập từ → bấm "Nhập từ file".',
  },
  'vocab-colloc': {
    file: 'mau-nhap-collocation.xlsx', title: 'Collocation (cụm từ đi cùng nhau)',
    header: ['Cụm từ', 'Từ cần điền (nằm trong cụm)', 'Nghĩa tiếng Việt', 'Câu ví dụ (chứa đúng cụm từ)', 'Dịch câu ví dụ', 'Từ gây nhiễu (cách nhau bằng dấu phẩy, không bắt buộc)'], widths: [22, 20, 22, 46, 42, 28],
    examples: [['have breakfast', 'have', 'ăn sáng', 'I usually have breakfast at seven.', 'Tôi thường ăn sáng lúc bảy giờ.', 'make,do,play'], ['make a mistake', 'make', 'mắc lỗi', 'Everyone can make a mistake sometimes.', 'Ai cũng có lúc mắc lỗi.', 'do,take,have']],
    guide: ['Mỗi DÒNG là một cụm từ. Học sinh sẽ được hỏi từ bị khuyết ở cột B.', 'Cột B phải nằm trong cụm ở cột A. Câu ví dụ (cột D) phải chứa đúng cả cụm.', 'Cột F: các từ sai để làm đáp án nhiễu, cách nhau bằng dấu phẩy. Bỏ trống thì hệ thống tự chọn.', 'Mỗi lần nhập tối đa 300 dòng.'],
    where: 'Luyện từ → Dành cho giáo viên → Nhập từ → chọn Loại "Collocation" → "Nhập từ file".',
  },
  'vocab-upgrade': {
    file: 'mau-nhap-nang-cap-tu-vung.xlsx', title: 'Nâng cấp từ vựng (từ cơ bản → từ mạnh)',
    header: ['Từ mạnh (từ nâng cấp)', 'Từ cơ bản', 'Nghĩa tiếng Việt', 'Câu dùng từ mạnh', 'Dịch câu', 'Câu dùng từ cơ bản (phải chứa từ ở cột B)'], widths: [22, 16, 22, 44, 40, 44],
    examples: [['exhausted', 'tired', 'kiệt sức', 'I was exhausted after the long trip.', 'Tôi kiệt sức sau chuyến đi dài.', 'I was very tired after the long trip.']],
    guide: ['Mỗi DÒNG một cặp: từ cơ bản (học sinh hay dùng) và từ mạnh hơn.', 'Cột D phải chứa đúng từ ở cột A; cột F phải chứa đúng từ ở cột B.', 'Mỗi lần nhập tối đa 300 dòng.'],
    where: 'Luyện từ → Dành cho giáo viên → Nhập từ → chọn Loại "Nâng cấp từ vựng" → "Nhập từ file".',
  },
  'lesson-words': {
    file: 'mau-danh-sach-tu-bai-hoc.xlsx', title: 'Danh sách từ theo bài học (AI tự tạo thẻ + 10 câu hỏi)',
    header: ['Từ vựng', 'Loại từ'], widths: [28, 16], validations: [{ col: 1, list: POS }],
    examples: [['reluctant', 'adj'], ['accommodation', 'n'], ['run out of', 'phr v'], ['schedule', 'v']],
    guide: ['Mỗi DÒNG một từ, ghi kèm loại từ (n, v, adj, adv, phr v…). Cần ít nhất 4 từ, mỗi bộ tối đa 30 từ.', 'Hệ thống sẽ tự tạo phiên âm, nghĩa tiếng Anh đơn giản, nghĩa tiếng Việt, ví dụ và 10 câu trắc nghiệm để bạn duyệt.'],
    where: 'Tạo bộ từ theo bài học (AI) → thả file vào khung "Nhập nhanh bằng ảnh hoặc file".',
  },
  students: {
    file: 'mau-danh-sach-hoc-sinh.xlsx', title: 'Danh sách email học sinh',
    header: ['Email học sinh', 'Họ tên (không bắt buộc)'], widths: [34, 26],
    examples: [['hocsinh1@gmail.com', 'Nguyễn Văn An'], ['hocsinh2@gmail.com', 'Trần Thị Bình']],
    guide: ['Mỗi DÒNG một email đã đăng ký trên website. Cột họ tên chỉ để bạn dễ theo dõi, hệ thống bỏ qua cột này.', 'Dùng khi giao bộ từ hoặc giao bài kiểm tra đầu vào cho đúng học sinh.'],
    where: 'Giao bộ từ / Kiểm tra đầu vào → Giao bài → bấm "Nhập email từ file".',
  },
  dialogue: {
    file: 'mau-hoi-thoai-dien-cho-trong.xlsx', title: 'Hội thoại điền chỗ trống',
    header: ['Người nói (tối đa 14 ký tự)', 'Câu thoại — chỗ trống viết {đáp án đúng|nhiễu 1|nhiễu 2}', 'Bản dịch tiếng Việt'], widths: [20, 64, 46],
    examples: [['Guest', 'I would like to {book|cook|look} a room for two nights.', 'Tôi muốn đặt một phòng hai đêm.'], ['Receptionist', 'Certainly. May I have your {name|game|came}?', 'Vâng ạ. Cho tôi xin tên của bạn?'], ['Guest', 'It is Linh. Is {breakfast|breakdown|bridge} included?', 'Tên tôi là Linh. Có gồm bữa sáng không?']],
    guide: ['Mỗi DÒNG là một lượt nói (3–16 dòng cho mỗi hội thoại).', 'Chỗ trống viết trong dấu { }, đáp án ĐÚNG luôn đứng đầu, các lựa chọn cách nhau bằng dấu | (2–5 lựa chọn). Hệ thống tự xáo trộn khi hiển thị.', 'Mỗi file là MỘT hội thoại. Tên hội thoại và cấp độ nhập trên trang web.'],
    where: 'Luyện từ → Dành cho giáo viên → Hội thoại → bấm "Nhập từ file".',
  },
};
const HEADER_FIRST = /^(từ vựng|từ mạnh|cụm từ|email|người nói)/i;

module.exports = function registerTemplates(app, { requireRole }) {
  const mem = multer({ storage: multer.memoryStorage(), limits: { fileSize: 4 * 1024 * 1024, files: 1 } });
  const staff = requireRole('teacher', 'admin');

  app.get('/api/templates', staff, (req, res) => res.json({ templates: Object.keys(T).map((k) => ({ id: k, title: T[k].title, file: T[k].file, where: T[k].where })) }));

  app.get('/api/templates/:id.xlsx', staff, (req, res) => {
    const t = T[req.params.id]; if (!t) return res.status(404).json({ error: 'Không có file mẫu này.' });
    const buf = buildXlsx([
      { name: 'Nhập liệu', header: t.header, widths: t.widths, validations: t.validations, rows: [] },
      { name: 'Ví dụ', header: t.header, widths: t.widths, rows: t.examples },
      { name: 'Hướng dẫn', widths: [110], lines: [t.title, '', 'Cách dùng:', '1. Điền dữ liệu vào trang "Nhập liệu" (bắt đầu từ dòng 2, ngay dưới dòng tiêu đề). Xem trang "Ví dụ" để biết cách điền.', '2. Lưu file (giữ nguyên định dạng .xlsx).', '3. ' + t.where, '', 'Lưu ý:'].concat(t.guide.map((g) => '• ' + g)) },
    ]);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="' + t.file + '"');
    res.setHeader('Cache-Control', 'no-store');
    res.send(buf);
  });

  // Đọc file đã điền → trả về văn bản để điền vào ô nhập (người dùng xem lại rồi mới bấm nhập)
  app.post('/api/import/parse', staff, (req, res) => {
    mem.single('file')(req, res, (err) => {
      if (err) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File quá lớn (tối đa 4MB).' : 'Không nhận được file.' });
      const f = req.file; if (!f || !f.buffer || !f.buffer.length) return res.status(400).json({ error: 'Chưa chọn file.' });
      const kind = String((req.query || {}).kind || 'vocab-word');
      try {
        const name = String(f.originalname || ''), ext = ((name.match(/\.([A-Za-z0-9]+)$/) || [])[1] || '').toLowerCase(), b = f.buffer;
        const isZip = b.length > 4 && b.readUInt32LE(0) === 0x04034b50;
        let text;
        if (isZip && ext === 'xlsx') text = xlsxToText(b);
        else if (isZip && ext === 'docx') text = docxToText(b);
        else if (['csv', 'tsv', 'txt'].includes(ext) && !isZip) text = csvToTabs(b.toString('utf8').replace(/^﻿/, ''));
        else return res.status(400).json({ error: 'Chỉ nhận file Excel (.xlsx), Word (.docx), .csv hoặc .txt. File Excel/Word cũ (.xls, .doc) hãy mở rồi "Lưu thành" định dạng mới.' });
        let lines = String(text || '').replace(/\r/g, '').split('\n').map((s) => s.replace(/\s+$/, '')).filter((s) => s.replace(/\t/g, '').trim());
        if (lines.length && HEADER_FIRST.test(lines[0].split('\t')[0].trim())) lines.shift(); // bỏ dòng tiêu đề của file mẫu
        if (kind === 'students') {
          const emails = []; for (const m of lines.join('\n').matchAll(/[A-Za-z0-9._%+'-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) { const e = m[0].toLowerCase(); if (!emails.includes(e)) emails.push(e); }
          if (!emails.length) return res.status(400).json({ error: 'Không tìm thấy email nào trong file.' });
          return res.json({ ok: true, text: emails.join('\n'), count: emails.length });
        }
        if (kind === 'dialogue') lines = lines.map((l) => { const c = l.split('\t'); return c.length >= 2 ? (c[0].trim().replace(/[:{}|]/g, '') + ': ' + c[1].trim() + (c[2] && c[2].trim() ? ' || ' + c[2].trim() : '')) : l; });
        if (!lines.length) return res.status(400).json({ error: 'File không có dòng dữ liệu nào (kiểm tra bạn đã điền vào trang "Nhập liệu" chưa).' });
        if (lines.length > 300) return res.status(400).json({ error: 'File có ' + lines.length + ' dòng — mỗi lần nhập tối đa 300 dòng, hãy chia nhỏ file.' });
        res.json({ ok: true, text: lines.join('\n'), count: lines.length });
      } catch (e) { res.status(400).json({ error: 'Không đọc được file: ' + e.message }); }
    });
  });
};

// CSV/TSV/TXT → các cột cách nhau bằng Tab (xử lý dấu ngoặc kép; tự nhận dấu phân cách , ; hoặc Tab; dòng dạng "a | b" giữ nguyên)
function csvToTabs(text) {
  const first = text.split('\n').find((l) => l.trim()) || '';
  if (first.includes('\t') || (first.includes('|') && !first.includes(','))) return text;
  const delim = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',';
  const rows = []; let row = [], cell = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (q) { if (ch === '"') { if (text[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += ch; }
    else if (ch === '"') q = true;
    else if (ch === delim) { row.push(cell); cell = ''; }
    else if (ch === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
    else if (ch !== '\r') cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.map((r) => r.map((c) => c.replace(/[\t\n]+/g, ' ').trim()).join('\t')).join('\n');
}
