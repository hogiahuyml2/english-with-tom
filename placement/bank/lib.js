'use strict';
// Trình dựng mục cho ngân hàng đề Kiểm tra đầu vào.
// Mọi mục đều ghi rõ NGUỒN (src) và loại đáp án (key): 'official' = lấy từ bảng đáp án chính thức của sách,
// 'assistant' = không có bảng đáp án trong sách, đáp án do người biên soạn suy luận (cần giáo viên duyệt).
const L = 'ABCDEFGH';
const idx = (c) => L.indexOf(c);
const clean = (s) => String(s).replace(/\s+/g, ' ').trim();

// Thông báo / tin nhắn ngắn (đọc hiểu) — 3 phương án
const notice = (id, lv, text, q, opts, ans, src, key = 'official') => ({ id, type: 'mcq', sk: 'reading', lv, text: String(text).trim(), q: q || 'What does this say?', opts: opts.map(clean), a: idx(ans), src, key });
// Câu điền từ có phương án (ngữ pháp / từ vựng) — "____" là chỗ trống
const cloze = (id, sk, lv, text, opts, ans, src, key = 'official') => ({ id, type: 'mcq', sk, lv, text: clean(text), q: 'Choose the word or phrase that best fills the gap.', opts: opts.map(clean), a: idx(ans), src, key });
// Điền từ tự do (gõ 1 từ) — accept: các đáp án được chấp nhận
const fill = (id, lv, text, accept, src, key = 'official') => ({ id, type: 'fill', sk: 'grammar', lv, text: clean(text), q: 'Write ONE word in the gap.', accept: [].concat(accept), src, key });
// Tạo từ (word formation): hint = từ gốc viết HOA; học sinh gõ dạng đúng
const wordform = (id, lv, text, hint, accept, src, key = 'official') => ({ id, type: 'fill', sk: 'vocab', lv, text: clean(text), q: 'Use the word in capitals to form a word that fits the gap.', hint, accept: [].concat(accept), src, key });
// Bài đọc nhiều câu hỏi: qs = [[câu hỏi, [A,B,C(,D)], 'B'], ...]
const passage = (id, lv, title, text, qs, src, key = 'official') => ({ id, type: 'passage', sk: 'reading', lv, title, text: String(text).trim(), qs: qs.map(([q, o, a]) => ({ q: clean(q), opts: o.map(clean), a: idx(a) })), src, key });
// Bài nghe: script = [['M'|'F'|'M2'|'F2', 'lời thoại'], ...]
const listen = (id, lv, intro, script, qs, src, key = 'official') => ({ id, type: 'listen', sk: 'listening', lv, intro: clean(intro), script, qs: qs.map(([q, o, a]) => ({ q: clean(q), opts: o.map(clean), a: idx(a) })), src, key });
// Đề viết ngắn
const writing = (id, lv, prompt, minWords, src, extra = {}) => Object.assign({ id, type: 'writing', sk: 'writing', lv, prompt: String(prompt).trim(), minWords, src, key: 'official' }, extra);

module.exports = { notice, cloze, fill, wordform, passage, listen, writing };
