// Bộ từ theo bài học: giáo viên nhập "từ | từ loại" → AI (tài khoản đã liên kết) tự tạo
// phiên âm IPA, nghĩa tiếng Anh đơn giản, nghĩa tiếng Việt, ví dụ thực tế + 10 câu trắc nghiệm A–D.
// NỘI DUNG DO AI TẠO LUÔN QUA 3 LỚP KIỂM TRA trước khi đến học sinh:
//   1) Luật cứng (định dạng IPA, ví dụ có chứa từ, định nghĩa không chứa chính từ, 4 đáp án khác nhau, 1 chỗ trống...)
//   2) Chấm chéo: AI lần 2 làm "giám khảo độc lập" giải từng câu hỏi mà KHÔNG biết đáp án; lệch đáp án hoặc có >1 đáp án hợp lý → gắn cờ
//   3) Giáo viên bắt buộc xem lại toàn bộ (có thể sửa từng ô) và tick xác nhận mới giao được
const crypto = require('crypto');
const zlib = require('zlib');
const multer = require('multer');

const MAX_PARSE = 30;      // tối đa số từ mỗi lần tạo
const MAX_CARDS = 40;      // tối đa số thẻ trong 1 bộ
const N_QUESTIONS = 10;
const BLANK = '_____';
const AI_PER_HOUR = 30;    // giới hạn số lần gọi AI / giáo viên / giờ (tiết kiệm chi phí)

const POS_MAP = {
  n: 'n', noun: 'n', v: 'v', verb: 'v', adj: 'adj', adjective: 'adj', adv: 'adv', adverb: 'adv',
  prep: 'prep', preposition: 'prep', conj: 'conj', conjunction: 'conj', pron: 'pron', pronoun: 'pron',
  det: 'det', determiner: 'det', 'phr v': 'phr v', 'phrasal verb': 'phr v', phrv: 'phr v', 'phrasal v': 'phr v',
  idiom: 'idiom', phr: 'phr', phrase: 'phr', excl: 'excl', exclamation: 'excl', interj: 'excl', interjection: 'excl'
};
const DICT_POS = { n: ['noun'], v: ['verb'], adj: ['adjective'], adv: ['adverb'], prep: ['preposition'], conj: ['conjunction'], pron: ['pronoun'], det: ['determiner', 'article', 'adjective'], excl: ['exclamation', 'interjection'] };
const WORD_RE = /^[A-Za-z](?:[A-Za-z' -]{0,38}[A-Za-z])?$/;
const IPA_RE = /^\/[A-Za-zæɑɒɔəɜɪʊʌðθŋʃʒɡɛɫɹɾʔʤʧːˈˌ.‿ᵻɐɚɝ()\s\-]{1,78}\/$/;
const VI_DIACRITIC = /[àáảãạăằắẳẵặâầấẩẫậèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵđ]/i;

function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = crypto.randomInt(0, i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function reEsc(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function normPos(p) { const k = String(p || '').trim().toLowerCase().replace(/\./g, '').replace(/\s+/g, ' '); return POS_MAP[k] || ''; }

// ── Đọc danh sách giáo viên dán: hỗ trợ "từ | loại", "từ, loại", "từ (loại)", "từ - loại", Tab ──
function parseWords(text, max) {
  max = max || MAX_PARSE;
  const lines = String(text || '').split('\n').map(s => s.trim()).filter(Boolean);
  const words = [], errors = [], seen = new Set();
  lines.forEach((raw, i) => {
    const at = 'Dòng ' + (i + 1) + ' (' + raw.slice(0, 30) + '): ';
    let line = raw.replace(/^\s*(?:\d+[.)]|[-•*])\s*/, '');
    let w, p;
    let m;
    if (/[|\t]/.test(line)) { const parts = line.split(/[|\t]/).map(s => s.trim()); w = parts[0]; p = parts[1]; }
    else if ((m = line.match(/^(.+?)\s*\(([^)]+)\)\s*$/))) { w = m[1]; p = m[2]; }
    else if ((m = line.match(/^(.+?)\s*,\s*([A-Za-z. ]+)$/))) { w = m[1]; p = m[2]; }
    else if ((m = line.match(/^(.+?)\s+[-–—]\s+([A-Za-z. ]+)$/))) { w = m[1]; p = m[2]; }
    else { w = line; p = ''; }
    w = String(w || '').trim().replace(/\s+/g, ' ');
    const pos = normPos(p);
    if (!w) { errors.push(at + 'thiếu từ'); return; }
    if (!WORD_RE.test(w)) { errors.push(at + 'từ chỉ được gồm chữ cái tiếng Anh, khoảng trắng, dấu - hoặc \''); return; }
    if (!p) { errors.push(at + 'thiếu từ loại (n, v, adj, adv, prep, conj, phr v, idiom...)'); return; }
    if (!pos) { errors.push(at + 'không hiểu từ loại "' + p + '" — dùng n, v, adj, adv, prep, conj, pron, det, phr v, idiom, phr'); return; }
    const key = w.toLowerCase() + '|' + pos;
    if (seen.has(key)) { errors.push(at + 'bị trùng'); return; }
    seen.add(key);
    words.push({ word: w, pos });
  });
  if (words.length > max) errors.push('Mỗi lần tối đa ' + max + ' từ — hãy chia thành nhiều bộ nhỏ.');
  return { words: words.slice(0, max), errors };
}

// ── Kiểm tra thẻ từ (luật cứng) ──
function hasForm(sentence, word) {
  // câu có chứa từ (cho phép biến đổi -s/-ed/-ing/đổi y→i...): mỗi thành phần của cụm phải xuất hiện như tiền tố của một từ trong câu
  const toks = String(sentence).toLowerCase().replace(/[^a-z' -]/g, ' ').split(/\s+/).filter(Boolean);
  return String(word).toLowerCase().split(/[\s-]+/).filter(Boolean).every(part => {
    if (part.length <= 2) return toks.includes(part);
    const stem = part.length >= 5 ? part.slice(0, part.length - 1) : part;
    return toks.some(t => t.startsWith(stem));
  });
}
function lev(a, b) {
  const m = a.length, n = b.length, d = [];
  for (let i = 0; i <= m; i++) { d.push([i]); }
  for (let j = 1; j <= n; j++) d[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return d[m][n];
}
function ipaNorm(s) { return String(s).replace(/[\/ˈˌ.ːˑ‿()\s\-]/g, '').replace(/[ɚɝ]/g, 'ə'); }

function checkCard(c, input) {
  const flags = [];
  const warn = (code, msg) => flags.push({ level: 'warn', code, msg });
  const card = {
    word: input.word, pos: input.pos, // luôn giữ đúng từ & từ loại giáo viên nhập
    ipa: String(c.ipa || '').trim(), simple: String(c.simple || '').trim(), vi: String(c.vi || '').trim(), example: String(c.example || '').trim()
  };
  if (c.issue && String(c.issue).trim()) warn('ai_issue', String(c.issue).trim().slice(0, 200));
  if (String(c.word || '').trim().toLowerCase() !== input.word.toLowerCase()) warn('word_changed', 'AI trả về từ khác với từ bạn nhập — đã khôi phục từ gốc, hãy kiểm tra lại nội dung.');
  if (card.ipa && !card.ipa.startsWith('/') && !card.ipa.endsWith('/')) card.ipa = '/' + card.ipa + '/';
  if (!card.ipa) warn('ipa_missing', 'Thiếu phiên âm.');
  else if (!IPA_RE.test(card.ipa)) warn('ipa_format', 'Phiên âm có ký tự lạ hoặc sai định dạng /…/ — hãy đối chiếu từ điển.');
  if (!card.simple) warn('simple_missing', 'Thiếu nghĩa tiếng Anh đơn giản.');
  else {
    if (hasForm(card.simple, input.word) && input.word.split(/\s+/).length === 1 && new RegExp('\\b' + reEsc(input.word.slice(0, Math.max(3, input.word.length - 2))), 'i').test(card.simple))
      warn('simple_has_word', 'Nghĩa tiếng Anh đang dùng lại chính từ này — nên diễn đạt bằng từ khác.');
    if (card.simple.split(/\s+/).length > 25) warn('simple_long', 'Nghĩa tiếng Anh hơi dài — nên rút gọn.');
  }
  if (!card.vi) warn('vi_missing', 'Thiếu nghĩa tiếng Việt.');
  else if (card.vi.length > 14 && !VI_DIACRITIC.test(card.vi)) warn('vi_not_vi', 'Nghĩa tiếng Việt có vẻ chưa phải tiếng Việt — hãy kiểm tra.');
  if (!card.example) warn('ex_missing', 'Thiếu câu ví dụ.');
  else {
    if (!hasForm(card.example, input.word)) warn('ex_no_word', 'Câu ví dụ có thể không chứa từ này — hãy kiểm tra.');
    const wc = card.example.split(/\s+/).length;
    if (wc < 5 || wc > 30) warn('ex_len', 'Câu ví dụ quá ngắn/dài (' + wc + ' từ).');
    if (/[\[\]{}]/.test(card.example)) warn('ex_brackets', 'Câu ví dụ có ký tự lạ.');
  }
  return { card, flags };
}

// ── Kiểm tra câu hỏi trắc nghiệm (luật cứng) ──
function normStem(s) { return String(s || '').replace(/_{2,}|\.{4,}|…+|\[\s*\]|\(\s*\)/g, BLANK).replace(/\s+/g, ' ').trim(); }
function buildQuestion(raw, target) {
  const answer = String(raw.answer || '').trim();
  const stem = normStem(raw.stem);
  const flags = [];
  const warn = (code, msg) => flags.push({ level: 'warn', code, msg });
  const ds = [];
  for (const d of (Array.isArray(raw.distractors) ? raw.distractors : [])) {
    const t = String(d || '').trim();
    if (t && t.toLowerCase() !== answer.toLowerCase() && !ds.some(x => x.toLowerCase() === t.toLowerCase())) ds.push(t);
  }
  // CỨNG: không đủ dữ liệu → loại hẳn (sẽ được tạo lại)
  if (!answer || (stem.split(BLANK).length - 1) !== 1 || ds.length < 3 || answer.length > 60) return { q: null, flags: [{ level: 'error', code: 'invalid', msg: 'Câu hỏi AI tạo không hợp lệ.' }] };
  const options = shuffle([answer, ...ds.slice(0, 3)]);
  const answerIndex = options.findIndex(o => o === answer);
  if (!hasForm(answer, target.word)) warn('answer_not_target', 'Đáp án đúng có thể không phải từ "' + target.word + '".');
  if (new RegExp('(^|[^A-Za-z])' + reEsc(answer) + '([^A-Za-z]|$)', 'i').test(stem.replace(BLANK, ' '))) warn('answer_in_stem', 'Đáp án xuất hiện sẵn trong câu — lộ đáp án.');
  const wc = stem.split(/\s+/).length;
  if (wc < 6 || wc > 40) warn('stem_len', 'Câu hỏi quá ngắn/dài.');
  return { q: { target: target.word, stem, options, answer_index: answerIndex }, flags };
}

// ── Đọc nội dung file giáo viên tải lên: .txt .csv .tsv .docx .xlsx (không cần thư viện) ──
const MAX_UNZIP = 8 * 1024 * 1024;
function zipEntries(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 66000); i--) if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  if (eocd < 0) throw new Error('File không phải định dạng Word/Excel hợp lệ.');
  const count = Math.min(buf.readUInt16LE(eocd + 10), 3000);
  let p = buf.readUInt32LE(eocd + 16);
  const map = new Map();
  for (let n = 0; n < count && p + 46 <= buf.length; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) break;
    const method = buf.readUInt16LE(p + 10), csize = buf.readUInt32LE(p + 20), usize = buf.readUInt32LE(p + 24);
    const nlen = buf.readUInt16LE(p + 28), elen = buf.readUInt16LE(p + 30), clen = buf.readUInt16LE(p + 32), off = buf.readUInt32LE(p + 42);
    map.set(buf.toString('utf8', p + 46, p + 46 + nlen), { method, csize, usize, off });
    p += 46 + nlen + elen + clen;
  }
  return map;
}
function zipRead(buf, e) {
  if (!e || e.usize > MAX_UNZIP) throw new Error('File quá lớn hoặc không đọc được.');
  const nlen = buf.readUInt16LE(e.off + 26), elen = buf.readUInt16LE(e.off + 28);
  const start = e.off + 30 + nlen + elen;
  const data = buf.subarray(start, start + e.csize);
  if (e.method === 0) return data;
  if (e.method === 8) return zlib.inflateRawSync(data, { maxOutputLength: MAX_UNZIP });
  throw new Error('Kiểu nén của file không được hỗ trợ.');
}
function xmlText(x) {
  return String(x).replace(/<[^>]+>/g, '').replace(/&#(\d+);/g, (m, d) => String.fromCodePoint(Math.min(+d, 0x10ffff)))
    .replace(/&#x([0-9a-f]+);/gi, (m, h) => String.fromCodePoint(Math.min(parseInt(h, 16), 0x10ffff)))
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, '&');
}
function docxToText(buf) {
  const z = zipEntries(buf);
  let xml = zipRead(buf, z.get('word/document.xml')).toString('utf8');
  xml = xml.replace(/<\/w:p>\s*<\/w:tc>/g, '</w:tc>').replace(/<\/w:tc>/g, '\t').replace(/<\/w:tr>/g, '\n').replace(/<\/w:p>/g, '\n')
    .replace(/<w:tab\/>/g, '\t').replace(/<w:br\/>/g, '\n');
  return xmlText(xml);
}
function colIndex(ref) { let n = 0; for (const ch of String(ref).replace(/[^A-Za-z]/g, '').toUpperCase()) n = n * 26 + (ch.charCodeAt(0) - 64); return Math.max(0, n - 1); }
function xlsxToText(buf) {
  const z = zipEntries(buf);
  const shared = [];
  if (z.has('xl/sharedStrings.xml')) {
    const sx = zipRead(buf, z.get('xl/sharedStrings.xml')).toString('utf8');
    for (const m of sx.matchAll(/<si[^>]*>([\s\S]*?)<\/si>/g)) shared.push(xmlText((m[1].match(/<t[^>]*>[\s\S]*?<\/t>/g) || []).join('')));
  }
  const sheetName = z.has('xl/worksheets/sheet1.xml') ? 'xl/worksheets/sheet1.xml' : [...z.keys()].find(k => /^xl\/worksheets\/sheet\d+\.xml$/.test(k));
  if (!sheetName) throw new Error('Không tìm thấy trang tính trong file Excel.');
  const sh = zipRead(buf, z.get(sheetName)).toString('utf8');
  const lines = [];
  for (const row of sh.matchAll(/<row[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells = [];
    for (const c of row[1].matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = c[1], inner = c[2] || '';
      const ref = (attrs.match(/\br="([A-Za-z]+\d*)"/) || [])[1] || '', t = (attrs.match(/\bt="(\w+)"/) || [])[1] || '';
      let val = '';
      if (t === 's') val = shared[parseInt((inner.match(/<v>(\d+)<\/v>/) || [])[1], 10)] || '';
      else if (t === 'inlineStr') val = xmlText(inner);
      else val = xmlText((inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1] || '');
      cells[colIndex(ref)] = String(val).replace(/[\t\n\r]+/g, ' ').trim();
    }
    if (cells.some(Boolean)) lines.push(Array.from(cells, x => x || '').join('\t'));
    if (lines.length > 600) break;
  }
  return lines.join('\n');
}
function sniffKind(buf, name) {
  const ext = (String(name || '').match(/\.([A-Za-z0-9]+)$/) || [])[1];
  const e = (ext || '').toLowerCase();
  if (buf.length > 3 && buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return { kind: 'image', mime: 'image/jpeg' };
  if (buf.length > 8 && buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return { kind: 'image', mime: 'image/png' };
  if (buf.length > 12 && buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') return { kind: 'image', mime: 'image/webp' };
  if (buf.length > 4 && buf.toString('ascii', 0, 4) === '%PDF') return { kind: 'pdf', mime: 'application/pdf' };
  if (buf.length > 4 && buf.readUInt32LE(0) === 0x04034b50) {
    if (e === 'docx') return { kind: 'docx' };
    if (e === 'xlsx') return { kind: 'xlsx' };
    return { kind: 'zip' };
  }
  if (['txt', 'csv', 'tsv', 'md'].includes(e)) return { kind: 'text' };
  return { kind: 'unknown' };
}
function normExtracted(items) {
  const out = [], seen = new Set(), needPos = [], skipped = [];
  for (const it of (Array.isArray(items) ? items : [])) {
    let w = String(it && it.word || '').replace(/^\s*(?:\d+[.)]|[-•*])\s*/, '').replace(/[\s.,;:!?]+$/, '').replace(/\s+/g, ' ').trim();
    if (!w) continue;
    if (!WORD_RE.test(w)) { skipped.push(w.slice(0, 30)); continue; }
    const pos = normPos(it.pos);
    if (!pos) { needPos.push(w); continue; }
    const key = w.toLowerCase() + '|' + pos;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push({ word: w, pos, guessed: !!it.guessed, uncertain: !!it.uncertain });
    if (out.length >= 150) break;
  }
  return { words: out, needPos, skipped };
}

// ── Gọi AI (thật hoặc giả lập khi kiểm thử cục bộ) ──
const SYS_CARDS = `You are an experienced ESL lexicographer preparing vocabulary cards for Vietnamese learners (CEFR A2–C1).
For EACH input item return exactly one card, in the SAME ORDER, keeping "word" and "pos" EXACTLY as given.
Fields:
- ipa: British English IPA as in the Cambridge Dictionary, between slashes, with stress marks, e.g. /rɪˈlʌk.tənt/. For multi-word items transcribe every word.
- simple: ONE short definition (max 15 words) in very simple English (A2 vocabulary) for the given part of speech. Never use the headword (or its derivatives) in the definition.
- vi: natural Vietnamese meaning (1–4 words/phrases separated by "; ") matching the part of speech and the sense used in "example".
- example: ONE natural sentence (10–20 words) in a realistic context (school, work, travel, family, news, technology...) that uses the headword with the given part of speech. Use the exact headword; only add regular inflections (-s, -ed, -ing) if grammar requires it. No quotation marks, no brackets, not a definition.
- issue: "" when everything is fine. Otherwise ONE short note IN VIETNAMESE when: the spelling looks wrong (suggest the correct spelling), it is not standard English, the part of speech does not fit, or you are unsure about the IPA or meaning. NEVER invent a meaning for a word you do not recognise — explain the problem in "issue" instead.`;
const SYS_QUESTIONS = `You write multiple-choice cloze questions for Vietnamese learners of English.
You receive a vocabulary list and a list of TARGET words. Write exactly one question per TARGET, in the same order.
Each question:
- stem: a NEW sentence (12–22 words, different from the given examples) with EXACTLY ONE blank written as _____
- answer: the target word in the exact form needed to fill the blank (regular inflection allowed)
- distractors: EXACTLY 3 DIFFERENT words taken from the same vocabulary list (other words than the target), in the same grammatical form as the answer so grammar does not give the answer away, and which clearly do NOT fit the meaning of the sentence.
Rules: exactly ONE option can be correct; the sentence must give enough context (meaning or collocation) to decide; never write the answer anywhere else in the stem; if a target appears more than once, use different sentences. Return "target" = the headword exactly as in the list.`;
const SYS_VERIFY = `You are an independent English exam checker. For each numbered question, choose the single best option (A, B, C or D) to fill the blank.
Set "ambiguous" to true if a second option could ALSO fit grammatically and logically, or if no option fits well, or if the stem has an error. Put a short Vietnamese note (max 20 words) in "note" when ambiguous is true, otherwise "".`;

const SYS_EXTRACT = `You read a PHOTO, SCAN or DOCUMENT of an English vocabulary list used by a teacher (textbook word list, handwritten notes, whiteboard, table, worksheet) and extract the vocabulary items to study.
Rules:
- Return every English vocabulary item: single words, phrasal verbs, idioms and short collocations (max 4 words). Keep the order of the source. Use lowercase unless it is a proper noun.
- IGNORE: Vietnamese or other translations, IPA/phonetics, example sentences, page numbers, headings, unit titles, exercise instructions, numbering.
- "pos": the part of speech printed next to the item if present, written as one of: n, v, adj, adv, prep, conj, pron, det, phr v, idiom, phr. If the source does NOT show it, choose the most common part of speech of the item in a learner's word list and set "guessed" to true.
- "uncertain": true when the handwriting/print is hard to read or you are not sure of the exact spelling. NEVER invent words you cannot read — skip them instead.
- If a source line lists several words, return each separately. Do not return duplicates.
- "notes": at most one short sentence IN VIETNAMESE about quality problems (blurry image, cut-off text, items skipped), otherwise "".`;
const SCHEMA_EXTRACT = { type: 'object', properties: { items: { type: 'array', items: { type: 'object', properties: { word: { type: 'string' }, pos: { type: 'string' }, guessed: { type: 'boolean' }, uncertain: { type: 'boolean' } }, required: ['word', 'pos', 'guessed', 'uncertain'] } }, notes: { type: 'string' } }, required: ['items', 'notes'] };
const SCHEMA_CARDS = { type: 'object', properties: { cards: { type: 'array', items: { type: 'object', properties: {
  word: { type: 'string' }, pos: { type: 'string' }, ipa: { type: 'string' }, simple: { type: 'string' }, vi: { type: 'string' }, example: { type: 'string' }, issue: { type: 'string' } },
  required: ['word', 'pos', 'ipa', 'simple', 'vi', 'example', 'issue'] } } }, required: ['cards'] };
const SCHEMA_QUESTIONS = { type: 'object', properties: { questions: { type: 'array', items: { type: 'object', properties: {
  target: { type: 'string' }, stem: { type: 'string' }, answer: { type: 'string' }, distractors: { type: 'array', items: { type: 'string' } } },
  required: ['target', 'stem', 'answer', 'distractors'] } } }, required: ['questions'] };
const SCHEMA_VERIFY = { type: 'object', properties: { results: { type: 'array', items: { type: 'object', properties: {
  n: { type: 'integer' }, choice: { type: 'string' }, ambiguous: { type: 'boolean' }, note: { type: 'string' } }, required: ['n', 'choice', 'ambiguous', 'note'] } } }, required: ['results'] };

// AI giả lập (chỉ bật khi đặt EWT_AI_MOCK=1 để kiểm thử cục bộ; trên production KHÔNG đặt biến này).
// Có "lỗi cài sẵn" để chứng minh các lớp kiểm tra hoạt động.
const MOCK_KEY = new Map();
function mockAI(kind, payload) {
  if (kind === 'cards') {
    return { cards: payload.words.map(w => {
      const lw = w.word.toLowerCase();
      const c = { word: w.word, pos: w.pos, ipa: '/ˈmɒk.wɜːd/', simple: 'A short mock meaning for testing.', vi: 'nghĩa thử nghiệm', example: 'We often talk about ' + w.word + ' in our English class today.', issue: '' };
      if (lw === 'noexample') c.example = 'This sentence never mentions the target at all.';
      if (lw === 'badipa') c.ipa = 'xyz123';
      if (lw === 'selfdef') c.simple = 'The selfdef is when something is selfdef.';
      if (lw === 'zzzbad') c.issue = 'Từ này có vẻ viết sai chính tả.';
      if (lw === 'changeme') c.word = 'different';
      return c;
    }) };
  }
  if (kind === 'questions') {
    const qs = payload.targets.map((t, i) => {
      const others = payload.cards.filter(c => c.word.toLowerCase() !== t.word.toLowerCase()).map(c => c.word);
      const stem = 'Mock sentence number ' + (i + 1) + ' for ' + payload.runId + ' says they really needed to _____ it yesterday.';
      MOCK_KEY.set(stem, t.word);
      const q = { target: t.word, stem, answer: t.word, distractors: others.slice(0, 3) };
      if (t.word.toLowerCase() === 'brokenq') q.stem = 'This stem has no blank at all so it is invalid.';
      return q;
    });
    return { questions: qs };
  }
  if (kind === 'verify') {
    return { results: payload.items.map(it => {
      const answer = MOCK_KEY.get(it.stem);
      const idx = it.options.findIndex(o => o === answer);
      const wrong = answer && answer.toLowerCase() === 'ambig';
      return { n: it.n, choice: 'ABCD'[wrong ? (idx + 1) % 4 : Math.max(idx, 0)], ambiguous: !!wrong, note: wrong ? 'Có thể có hơn một đáp án phù hợp.' : '' };
    }) };
  }
  if (kind === 'extract') {
    if (payload.text) return { items: payload.text.split('\n').map(l => ({ word: l.split(/[|\t,]/)[0].trim(), pos: 'n', guessed: true, uncertain: false })).filter(x => x.word), notes: '' };
    return { items: [
      { word: 'reluctant', pos: 'adj', guessed: false, uncertain: false }, { word: 'accommodation', pos: 'n', guessed: false, uncertain: false },
      { word: 'run out of', pos: 'phr v', guessed: false, uncertain: false }, { word: 'schedule', pos: 'v', guessed: true, uncertain: false },
      { word: 'enthusiastic', pos: 'adj', guessed: true, uncertain: true }, { word: 'mystery', pos: '', guessed: true, uncertain: false },
      { word: 'bad@word', pos: 'n', guessed: false, uncertain: false }, { word: 'schedule', pos: 'v', guessed: false, uncertain: false }
    ], notes: 'Ảnh hơi mờ ở góc dưới.' };
  }
  throw new Error('mock: unknown kind');
}

module.exports = function registerLessonVocab(app, { db, requireAuth, requireRole, now, notifyUser, ai, dictFetch }) {
  const MOCK = process.env.EWT_AI_MOCK === '1';
  const doFetch = dictFetch || (typeof fetch === 'function' ? fetch : null);
  const aiReady = () => MOCK || (ai && ai.aiEnabled && ai.aiEnabled());

  async function callAI(kind, payload) {
    if (MOCK) return mockAI(kind, payload);
    if (kind === 'extract') return ai.generateJSON({ system: SYS_EXTRACT, user: payload.user, schema: SCHEMA_EXTRACT, maxTokens: 5000, temperature: 0, files: payload.files });
    if (kind === 'cards') {
      const user = 'Create vocabulary cards for these items (JSON):\n' + JSON.stringify(payload.words);
      return ai.generateJSON({ system: SYS_CARDS, user, schema: SCHEMA_CARDS, maxTokens: 8000 });
    }
    if (kind === 'questions') {
      const vocab = payload.cards.map(c => ({ word: c.word, pos: c.pos, meaning: c.simple, vi: c.vi, example: c.example }));
      const user = 'VOCABULARY LIST (JSON):\n' + JSON.stringify(vocab) + '\n\nTARGETS (one question each, in this order):\n' + JSON.stringify(payload.targets.map(t => t.word));
      return ai.generateJSON({ system: SYS_QUESTIONS, user, schema: SCHEMA_QUESTIONS, maxTokens: 8000 });
    }
    const user = 'Questions:\n' + payload.items.map(it => it.n + '. ' + it.stem + '\n   A) ' + it.options[0] + '  B) ' + it.options[1] + '  C) ' + it.options[2] + '  D) ' + it.options[3]).join('\n');
    return ai.generateJSON({ system: SYS_VERIFY, user, schema: SCHEMA_VERIFY, maxTokens: 4000, temperature: 0 });
  }

  // ── Đối chiếu từ điển tham chiếu (miễn phí, best-effort: lỗi mạng thì bỏ qua, KHÔNG chặn) ──
  const dictCache = new Map();
  async function dictLookup(word) {
    if (MOCK || !doFetch || !/^[A-Za-z]+$/.test(word)) return null;
    const key = word.toLowerCase();
    if (dictCache.has(key)) return dictCache.get(key);
    let res = null;
    try {
      const ctrl = new AbortController(); const timer = setTimeout(() => ctrl.abort(), 3500);
      const r = await doFetch('https://api.dictionaryapi.dev/v2/entries/en/' + encodeURIComponent(key), { signal: ctrl.signal });
      clearTimeout(timer);
      if (r.status === 404) res = { found: false };
      else if (r.ok) {
        const d = await r.json();
        const pos = new Set(), ipa = [];
        for (const e of (Array.isArray(d) ? d : [])) {
          for (const m of (e.meanings || [])) if (m.partOfSpeech) pos.add(String(m.partOfSpeech).toLowerCase());
          for (const p of (e.phonetics || [])) if (p.text) ipa.push(String(p.text));
          if (e.phonetic) ipa.push(String(e.phonetic));
        }
        res = { found: true, pos, ipa };
      }
    } catch (e) { res = null; }
    if (res) dictCache.set(key, res);
    return res;
  }
  async function dictCheckCard(card) {
    const flags = [];
    const d = await dictLookup(card.word);
    if (!d) return { flags };
    if (!d.found) { flags.push({ level: 'warn', code: 'dict_notfound', msg: 'Không tìm thấy trong từ điển tham chiếu — kiểm tra lại chính tả.' }); return { flags }; }
    const want = DICT_POS[card.pos];
    if (want && d.pos.size && !want.some(p => d.pos.has(p))) flags.push({ level: 'warn', code: 'dict_pos', msg: 'Từ điển tham chiếu không ghi "' + card.word + '" là loại từ này (có: ' + [...d.pos].join(', ') + ').' });
    if (d.ipa.length && IPA_RE.test(card.ipa)) {
      const mine = ipaNorm(card.ipa);
      const best = Math.min(...d.ipa.map(x => lev(mine, ipaNorm(x))));
      card.ipaRef = d.ipa[0];
      if (best > 4) flags.push({ level: 'warn', code: 'dict_ipa', msg: 'Phiên âm khác nhiều so với từ điển tham chiếu (' + d.ipa[0] + ') — hãy đối chiếu.' });
    }
    return { flags };
  }

  // ── Giới hạn số lần gọi AI để tiết kiệm chi phí ──
  const aiUse = new Map();
  function aiAllowed(uid) {
    const t = Date.now(), arr = (aiUse.get(uid) || []).filter(x => x > t - 3600e3);
    if (arr.length >= AI_PER_HOUR) { aiUse.set(uid, arr); return false; }
    arr.push(t); aiUse.set(uid, arr); return true;
  }

  // ── Quy trình tạo thẻ: AI → luật cứng → đối chiếu từ điển ──
  async function generateCards(words) {
    const out = [];
    for (let i = 0; i < words.length; i += 12) {
      const chunk = words.slice(i, i + 12);
      const resp = await callAI('cards', { words: chunk });
      const arr = Array.isArray(resp && resp.cards) ? resp.cards : [];
      for (let k = 0; k < chunk.length; k++) {
        let raw = arr[k];
        if (!raw || String(raw.word || '').trim().toLowerCase() !== chunk[k].word.toLowerCase()) raw = arr.find(c => String(c.word || '').trim().toLowerCase() === chunk[k].word.toLowerCase()) || raw || {};
        const { card, flags } = checkCard(raw, chunk[k]);
        const dc = await dictCheckCard(card);
        out.push({ ...card, flags: flags.concat(dc.flags) });
      }
    }
    return out;
  }

  // ── Quy trình tạo câu hỏi: AI → luật cứng → chấm chéo độc lập ──
  function pickTargets(cards, n) {
    const order = shuffle(cards);
    const t = [];
    for (let i = 0; i < n; i++) t.push(order[i % order.length]);
    return shuffle(t);
  }
  async function generateQuestions(cards, targetWords, n) {
    const targets = (targetWords && targetWords.length ? targetWords.map(w => cards.find(c => c.word.toLowerCase() === String(w).toLowerCase())).filter(Boolean) : pickTargets(cards, n));
    const built = [];
    const runId = crypto.randomBytes(3).toString('hex');
    let todo = targets.slice();
    for (let attempt = 0; attempt < 2 && todo.length; attempt++) {
      const resp = await callAI('questions', { cards, targets: todo, runId: runId + attempt });
      const arr = Array.isArray(resp && resp.questions) ? resp.questions : [];
      const nextTodo = [];
      todo.forEach((t, i) => {
        let raw = arr[i];
        if (!raw || String(raw.target || '').trim().toLowerCase() !== t.word.toLowerCase()) raw = arr.find(q => String(q.target || '').trim().toLowerCase() === t.word.toLowerCase() && !built.some(b => b.raw === q)) || raw;
        const r = raw ? buildQuestion(raw, t) : { q: null };
        if (r.q) built.push({ q: r.q, flags: r.flags, raw }); else nextTodo.push(t);
      });
      todo = nextTodo;
    }
    // chấm chéo độc lập
    let verify = null;
    try { verify = await callAI('verify', { items: built.map((b, i) => ({ n: i + 1, stem: b.q.stem, options: b.q.options })) }); } catch (e) { console.warn('[lesson-vocab] verify lỗi:', e.message); }
    const vr = verify && Array.isArray(verify.results) ? verify.results : null;
    const questions = built.map((b, i) => {
      const flags = b.flags.slice();
      if (vr) {
        const r = vr.find(x => Number(x.n) === i + 1);
        if (!r) flags.push({ level: 'warn', code: 'verify_missing', msg: 'Chưa chấm chéo được câu này.' });
        else {
          const idx = 'ABCD'.indexOf(String(r.choice || '').trim().toUpperCase().charAt(0));
          if (idx !== b.q.answer_index) flags.push({ level: 'warn', code: 'verify_mismatch', msg: 'Giám khảo AI độc lập chọn đáp án khác với đáp án đang đặt — rất có thể đáp án sai hoặc câu mơ hồ.' });
          else if (r.ambiguous) flags.push({ level: 'warn', code: 'verify_ambiguous', msg: String(r.note || 'Có thể có hơn một đáp án phù hợp.').slice(0, 200) });
        }
      } else flags.push({ level: 'warn', code: 'verify_failed', msg: 'Không chấm chéo được (AI bận) — hãy tự kiểm tra kỹ câu này.' });
      return { ...b.q, flags };
    });
    return { questions, missing: Math.max(0, (targetWords && targetWords.length ? targets.length : n) - questions.length) };
  }

  // ───────────── API: tạo nội dung bằng AI (chỉ giáo viên/admin) ─────────────
  app.post('/api/lesson-vocab/ai-cards', requireRole('teacher', 'admin'), async (req, res) => {
    const b = req.body || {};
    let words;
    if (Array.isArray(b.words)) {
      words = b.words.slice(0, MAX_PARSE).map(w => ({ word: String(w.word || '').trim(), pos: normPos(w.pos) || String(w.pos || '').trim() })).filter(w => WORD_RE.test(w.word) && w.pos);
      if (!words.length) return res.status(400).json({ error: 'Danh sách từ không hợp lệ.' });
    } else {
      const p = parseWords(b.text);
      if (p.errors.length && !p.words.length) return res.status(400).json({ error: p.errors[0], errors: p.errors });
      if (!p.words.length) return res.status(400).json({ error: 'Chưa nhập từ nào.' });
      words = p.words; b._errors = p.errors;
    }
    if (!aiReady()) return res.status(503).json({ error: 'Hệ thống AI chưa sẵn sàng (chưa liên kết tài khoản AI).' });
    if (!aiAllowed(req.user.id)) return res.status(429).json({ error: 'Bạn đã dùng AI nhiều trong 1 giờ qua, vui lòng thử lại sau ít phút.' });
    try {
      const cards = await generateCards(words);
      res.json({ ok: true, cards, parseErrors: b._errors || [] });
    } catch (e) {
      console.error('[lesson-vocab/ai-cards]', e.message);
      res.status(500).json({ error: 'AI chưa tạo được thẻ từ: ' + String(e.message).slice(0, 200) });
    }
  });

  app.post('/api/lesson-vocab/ai-questions', requireRole('teacher', 'admin'), async (req, res) => {
    const b = req.body || {};
    const cards = Array.isArray(b.cards) ? b.cards.slice(0, MAX_CARDS).filter(c => c && WORD_RE.test(String(c.word || '').trim())).map(c => ({ word: String(c.word).trim(), pos: String(c.pos || '').trim(), simple: String(c.simple || '').trim(), vi: String(c.vi || '').trim(), example: String(c.example || '').trim() })) : [];
    if (cards.length < 4) return res.status(400).json({ error: 'Cần ít nhất 4 từ để tạo câu hỏi 4 đáp án.' });
    const only = Array.isArray(b.only) ? b.only.map(String).slice(0, N_QUESTIONS) : null;
    if (!aiReady()) return res.status(503).json({ error: 'Hệ thống AI chưa sẵn sàng (chưa liên kết tài khoản AI).' });
    if (!aiAllowed(req.user.id)) return res.status(429).json({ error: 'Bạn đã dùng AI nhiều trong 1 giờ qua, vui lòng thử lại sau ít phút.' });
    try {
      const r = await generateQuestions(cards, only, only ? only.length : N_QUESTIONS);
      res.json({ ok: true, questions: r.questions, missing: r.missing });
    } catch (e) {
      console.error('[lesson-vocab/ai-questions]', e.message);
      res.status(500).json({ error: 'AI chưa tạo được câu hỏi: ' + String(e.message).slice(0, 200) });
    }
  });

  // ───────────── Lưu + giao bộ từ ─────────────
  function cleanCards(arr) {
    if (!Array.isArray(arr)) throw new Error('Thiếu danh sách thẻ từ.');
    if (arr.length < 4 || arr.length > MAX_CARDS) throw new Error('Bộ từ cần từ 4 đến ' + MAX_CARDS + ' từ.');
    const seen = new Set();
    return arr.map((c, i) => {
      const at = 'Thẻ ' + (i + 1) + ': ';
      const word = String(c.word || '').trim().replace(/\s+/g, ' ');
      const pos = String(c.pos || '').trim().slice(0, 12);
      const o = { word, pos, ipa: String(c.ipa || '').trim(), simple: String(c.simple || '').trim(), vi: String(c.vi || '').trim(), example: String(c.example || '').trim() };
      if (!WORD_RE.test(word)) throw new Error(at + 'từ không hợp lệ.');
      if (seen.has(word.toLowerCase())) throw new Error(at + 'từ "' + word + '" bị trùng.');
      seen.add(word.toLowerCase());
      if (!pos) throw new Error(at + 'thiếu từ loại.');
      if (!o.ipa || o.ipa.length > 80) throw new Error(at + 'thiếu hoặc quá dài phiên âm.');
      if (!o.simple || o.simple.length > 220) throw new Error(at + 'nghĩa tiếng Anh trống hoặc quá dài.');
      if (!o.vi || o.vi.length > 200) throw new Error(at + 'nghĩa tiếng Việt trống hoặc quá dài.');
      if (!o.example || o.example.length > 300) throw new Error(at + 'câu ví dụ trống hoặc quá dài.');
      return o;
    });
  }
  function cleanQuestions(arr) {
    if (!Array.isArray(arr) || arr.length !== N_QUESTIONS) throw new Error('Cần đúng ' + N_QUESTIONS + ' câu hỏi trắc nghiệm.');
    return arr.map((q, i) => {
      const at = 'Câu ' + (i + 1) + ': ';
      const stem = normStem(q.stem);
      const options = Array.isArray(q.options) ? q.options.map(o => String(o || '').trim()) : [];
      const ai2 = q.answer_index; // phải là số nguyên thật (null/chuỗi bị từ chối, tránh hiểu nhầm thành đáp án A)
      if ((stem.split(BLANK).length - 1) !== 1 || stem.length > 300) throw new Error(at + 'câu hỏi cần đúng 1 chỗ trống (_____) và không quá dài.');
      if (options.length !== 4 || options.some(o => !o || o.length > 60)) throw new Error(at + 'cần đủ 4 đáp án (mỗi đáp án không trống, không quá dài).');
      if (new Set(options.map(o => o.toLowerCase())).size !== 4) throw new Error(at + '4 đáp án phải khác nhau.');
      if (!Number.isInteger(ai2) || ai2 < 0 || ai2 > 3) throw new Error(at + 'chưa chọn đáp án đúng.');
      if (new RegExp('(^|[^A-Za-z])' + reEsc(options[ai2]) + '([^A-Za-z]|$)', 'i').test(stem.replace(BLANK, ' '))) throw new Error(at + 'đáp án đúng đã xuất hiện sẵn trong câu hỏi.');
      return { target: String(q.target || '').trim().slice(0, 40), stem, options, answer_index: ai2 };
    });
  }
  function collectRecipients(b) {
    const set = new Set();
    for (const gid of (Array.isArray(b.group_ids) ? b.group_ids : []).map(Number).filter(Number.isInteger)) {
      for (const r of db.prepare('SELECT user_id FROM group_members WHERE group_id=? AND user_id IS NOT NULL').all(gid)) set.add(Number(r.user_id));
    }
    for (const em of (Array.isArray(b.emails) ? b.emails : []).map(s => String(s).trim().toLowerCase()).filter(Boolean)) {
      const u = db.prepare("SELECT id FROM users WHERE lower(email)=? AND role='student'").get(em);
      if (u) set.add(Number(u.id));
    }
    for (const uid of (Array.isArray(b.user_ids) ? b.user_ids : []).map(Number).filter(Number.isInteger).slice(0, 2000)) {
      if (db.prepare("SELECT 1 FROM users WHERE id=? AND role='student'").get(uid)) set.add(uid);
    }
    if (b.all_students) for (const r of db.prepare("SELECT id FROM users WHERE role='student'").all()) set.add(Number(r.id));
    return set;
  }

  app.post('/api/lesson-vocab', requireRole('teacher', 'admin'), (req, res) => {
    const b = req.body || {};
    const title = String(b.title || '').trim().slice(0, 80);
    if (!title) return res.status(400).json({ error: 'Vui lòng đặt tên bài học/bộ từ.' });
    if (b.reviewed !== true) return res.status(400).json({ error: 'Bạn cần xác nhận đã xem lại toàn bộ nội dung trước khi giao.' });
    let cards, questions;
    try { cards = cleanCards(b.cards); questions = cleanQuestions(b.questions); } catch (e) { return res.status(400).json({ error: e.message }); }
    const deadline = b.deadline ? String(b.deadline).slice(0, 25) : null;
    if (deadline && Number.isNaN(new Date(deadline.includes('T') ? deadline : deadline.replace(' ', 'T')).getTime())) return res.status(400).json({ error: 'Hạn nộp không hợp lệ.' });
    let recipients;
    try { recipients = collectRecipients(b); } catch (e) { return res.status(500).json({ error: 'Không đọc được danh sách học sinh.' }); }
    if (!recipients.size) return res.status(400).json({ error: 'Chưa có học sinh nào nhận bộ từ (chọn lớp hoặc nhập email học sinh đã đăng ký).' });
    try {
      db.exec('BEGIN');
      const r = db.prepare('INSERT INTO lesson_sets (teacher_id,title,cards,questions,deadline,note,created_at) VALUES (?,?,?,?,?,?,?)')
        .run(req.user.id, title, JSON.stringify(cards), JSON.stringify(questions), deadline, String(b.note || '').trim().slice(0, 300) || null, now());
      const id = Number(r.lastInsertRowid);
      const ins = db.prepare('INSERT OR IGNORE INTO lesson_assign (set_id,user_id,assigned_at) VALUES (?,?,?)');
      for (const uid of recipients) ins.run(id, uid, now());
      db.exec('COMMIT');
      const dl = deadline ? ' · hạn ' + deadline.replace('T', ' ') : '';
      for (const uid of recipients) { try { notifyUser(uid, 'lesson_vocab', '📘 Bộ từ mới: ' + title, cards.length + ' từ + 10 câu luyện tập' + dl, 'lesson-vocab.html?id=' + id); } catch (e) {} }
      res.json({ ok: true, id, recipients: recipients.size });
    } catch (e) {
      try { db.exec('ROLLBACK'); } catch (_) {}
      console.error('[lesson-vocab/create]', e.message);
      res.status(500).json({ error: 'Không giao được bộ từ.' });
    }
  });


  // ───────────── Đọc danh sách từ từ ẢNH / PDF / FILE (txt, csv, docx, xlsx) ─────────────
  const memUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024, files: 1 } });
  const MAX_EXTRACT_SHOW = MAX_PARSE;
  app.post('/api/lesson-vocab/extract', requireRole('teacher', 'admin'), (req, res) => {
    memUpload.single('file')(req, res, async (err) => {
      if (err) return res.status(400).json({ error: err.code === 'LIMIT_FILE_SIZE' ? 'File quá lớn (tối đa 8MB). Hãy chụp/cắt nhỏ ảnh hơn.' : 'Không nhận được file.' });
      if (!req.file || !req.file.buffer || !req.file.buffer.length) return res.status(400).json({ error: 'Chưa chọn file.' });
      const buf = req.file.buffer;
      const fk = sniffKind(buf, req.file.originalname);
      try {
        let text = null, files = null, source;
        if (fk.kind === 'image' || fk.kind === 'pdf') { files = [{ mime: fk.mime, data: buf.toString('base64') }]; source = fk.kind; }
        else if (fk.kind === 'text') { text = buf.toString('utf8').replace(/^﻿/, ''); source = 'text'; }
        else if (fk.kind === 'docx') { text = docxToText(buf); source = 'docx'; }
        else if (fk.kind === 'xlsx') { text = xlsxToText(buf); source = 'xlsx'; }
        else return res.status(400).json({ error: 'Chỉ nhận ảnh (JPG, PNG, WEBP), PDF, Word (.docx), Excel (.xlsx), .csv hoặc .txt.' });
        if (text !== null) {
          text = text.replace(/\r/g, '').slice(0, 20000);
          if (!text.trim()) return res.status(400).json({ error: 'File không có nội dung chữ để đọc.' });
        }

        let items = null, notes = '', via = 'ai';
        // Văn bản đã đúng dạng "từ | loại" → đọc thẳng, không tốn lượt AI
        if (text !== null) {
          const lines = text.split('\n').map(x => x.trim()).filter(Boolean);
          const local = parseWords(text, 150);
          if (local.words.length && local.words.length >= Math.ceil(lines.length * 0.8)) { items = local.words.map(w => ({ ...w, guessed: false, uncertain: false })); via = 'local'; }
        }
        if (!items) {
          if (!aiReady()) return res.status(503).json({ error: 'Hệ thống AI chưa sẵn sàng (chưa liên kết tài khoản AI) nên chưa đọc được file này.' });
          if (!aiAllowed(req.user.id)) return res.status(429).json({ error: 'Bạn đã dùng AI nhiều trong 1 giờ qua, vui lòng thử lại sau ít phút.' });
          const user = files ? 'Extract the vocabulary list from the attached ' + (fk.kind === 'pdf' ? 'document' : 'image') + '.' : 'Extract the vocabulary list from this document text (columns are separated by tabs):\n' + text;
          const r = await callAI('extract', { user, files, text });
          items = Array.isArray(r && r.items) ? r.items : [];
          notes = String(r && r.notes || '').slice(0, 200);
        }
        const n = normExtracted(items);
        if (!n.words.length) return res.status(422).json({ error: 'Không đọc được từ vựng nào' + (notes ? ' — ' + notes : '. Hãy thử ảnh rõ nét hơn, chụp thẳng và đủ sáng.'), needPos: n.needPos });
        res.json({
          ok: true, via, source, notes,
          words: n.words.slice(0, MAX_EXTRACT_SHOW), rest: n.words.slice(MAX_EXTRACT_SHOW),
          needPos: n.needPos.slice(0, 20), skipped: n.skipped.slice(0, 20)
        });
      } catch (e) {
        console.error('[lesson-vocab/extract]', e.message);
        res.status(500).json({ error: 'Không đọc được file: ' + String(e.message).slice(0, 160) });
      }
    });
  });

  // Danh sách học sinh để giáo viên tick chọn người nhận
  app.get('/api/lesson-vocab/students', requireRole('teacher', 'admin'), (req, res) => {
    try {
      res.json({ students: db.prepare("SELECT id,name,email FROM users WHERE role='student' ORDER BY name COLLATE NOCASE LIMIT 1500").all().map(u => ({ id: Number(u.id), name: u.name, email: u.email })) });
    } catch (e) { res.status(500).json({ error: 'Không tải được danh sách học sinh.' }); }
  });

  // Giao thêm bộ từ đã có cho học sinh khác
  app.post('/api/lesson-vocab/:id/assign', requireRole('teacher', 'admin'), (req, res) => {
    const id = Number(req.params.id), set = loadSet(id);
    if (!set) return res.status(404).json({ error: 'Không tìm thấy bộ từ.' });
    if (!isOwnerOrAdmin(req.user, set)) return res.status(403).json({ error: 'Chỉ giáo viên giao bộ từ mới giao thêm được.' });
    const rec = collectRecipients(req.body || {});
    if (!rec.size) return res.status(400).json({ error: 'Chưa chọn học sinh nào.' });
    let added = 0;
    const ins = db.prepare('INSERT OR IGNORE INTO lesson_assign (set_id,user_id,assigned_at) VALUES (?,?,?)');
    const cards = JSON.parse(set.cards);
    for (const uid of rec) {
      if (Number(ins.run(id, uid, now()).changes || 0)) {
        added++;
        try { notifyUser(uid, 'lesson_vocab', '📘 Bộ từ mới: ' + set.title, cards.length + ' từ + 10 câu luyện tập' + (set.deadline ? ' · hạn ' + String(set.deadline).replace('T', ' ') : ''), 'lesson-vocab.html?id=' + id); } catch (e) {}
      }
    }
    res.json({ ok: true, added, already: rec.size - added });
  });

  // ───────────── Thời gian học (học sinh gửi nhịp "đang học" mỗi ~30 giây) ─────────────
  const lastBeat = new Map(); // "uid:set" -> thời điểm nhịp trước (chống cộng khống thời gian)
  const vnDay = () => new Date(Date.now() + 7 * 3600e3).toISOString().slice(0, 10);
  app.post('/api/lesson-vocab/:id/time', requireAuth, (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || !db.prepare('SELECT 1 FROM lesson_assign WHERE set_id=? AND user_id=?').get(id, req.user.id)) return res.json({ ok: true, counted: 0 });
    const b = req.body || {};
    let sec = Math.round(Number(b.seconds));
    const open = b.open === true;
    if (!(sec >= 0)) return res.status(400).json({ error: 'Dữ liệu không hợp lệ.' });
    sec = Math.min(sec, 60);
    const key = req.user.id + ':' + id, t = Date.now(), prev = lastBeat.get(key);
    // Không cộng nhiều hơn thời gian thực đã trôi qua kể từ nhịp trước (+5s dung sai)
    if (prev) sec = Math.min(sec, Math.floor((t - prev) / 1000) + 5); else sec = Math.min(sec, 35);
    lastBeat.set(key, t);
    if (lastBeat.size > 5000) { for (const [k, v] of lastBeat) if (t - v > 3600e3) lastBeat.delete(k); }
    if (sec <= 0 && !open) return res.json({ ok: true, counted: 0 });
    try {
      db.prepare(`INSERT INTO lesson_time (set_id,user_id,day,seconds,opens,last_at) VALUES (?,?,?,?,?,?)
        ON CONFLICT(set_id,user_id,day) DO UPDATE SET seconds=MIN(seconds+excluded.seconds, 14400), opens=opens+excluded.opens, last_at=excluded.last_at`)
        .run(id, req.user.id, vnDay(), Math.max(0, sec), open ? 1 : 0, now());
      res.json({ ok: true, counted: Math.max(0, sec) });
    } catch (e) { console.error('[lesson-vocab/time]', e.message); res.status(500).json({ error: 'Không ghi được thời gian học.' }); }
  });

  // ───────────── Báo cáo tổng hợp: điểm + thời gian học theo học sinh ─────────────
  app.get('/api/lesson-vocab/report', requireRole('teacher', 'admin'), (req, res) => {
    try {
      const days = Math.min(365, Math.max(1, parseInt(req.query.days, 10) || 30));
      const since = new Date(Date.now() + 7 * 3600e3 - days * 86400e3).toISOString().slice(0, 10);
      const sets = req.user.role === 'admin' ? db.prepare('SELECT id,title,questions FROM lesson_sets').all() : db.prepare('SELECT id,title,questions FROM lesson_sets WHERE teacher_id=?').all(req.user.id);
      const setIds = sets.map(x => x.id);
      if (!setIds.length) return res.json({ days, students: [], sets: [] });
      const inList = setIds.join(',');
      const assigns = db.prepare('SELECT a.set_id, a.user_id FROM lesson_assign a WHERE a.set_id IN (' + inList + ')').all();
      const results = db.prepare('SELECT set_id,user_id,MAX(score*1.0/total) best, COUNT(*) n, MAX(created_at) last FROM lesson_results WHERE set_id IN (' + inList + ') GROUP BY set_id,user_id').all();
      const times = db.prepare('SELECT set_id,user_id,SUM(seconds) sec, COUNT(CASE WHEN seconds>0 THEN 1 END) days, MAX(last_at) last FROM lesson_time WHERE set_id IN (' + inList + ') AND day>=? GROUP BY set_id,user_id').all(since);
      const users = new Map(db.prepare('SELECT id,name,email FROM users').all().map(u => [Number(u.id), u]));
      const resMap = new Map(results.map(r => [r.set_id + ':' + r.user_id, r]));
      const timeMap = new Map(times.map(r => [r.set_id + ':' + r.user_id, r]));
      const st = new Map();
      const setAgg = new Map(sets.map(x => [x.id, { id: x.id, title: x.title, assigned: 0, done: 0, pctSum: 0, seconds: 0 }]));
      for (const a of assigns) {
        const u = users.get(Number(a.user_id)); if (!u) continue;
        let s0 = st.get(a.user_id);
        if (!s0) { s0 = { id: Number(a.user_id), name: u.name, email: u.email, assigned: 0, done: 0, pctSum: 0, seconds: 0, dayCount: 0, last: null }; st.set(a.user_id, s0); }
        const r = resMap.get(a.set_id + ':' + a.user_id), tm = timeMap.get(a.set_id + ':' + a.user_id), sa = setAgg.get(a.set_id);
        s0.assigned++; sa.assigned++;
        if (r) { s0.done++; s0.pctSum += r.best * 100; sa.done++; sa.pctSum += r.best * 100; if (!s0.last || r.last > s0.last) s0.last = r.last; }
        if (tm) { s0.seconds += Number(tm.sec || 0); s0.dayCount = Math.max(s0.dayCount, Number(tm.days || 0)); sa.seconds += Number(tm.sec || 0); if (tm.last && (!s0.last || tm.last > s0.last)) s0.last = tm.last; }
      }
      res.json({
        days,
        students: [...st.values()].map(x => ({ id: x.id, name: x.name, email: x.email, assigned: x.assigned, done: x.done, avgPct: x.done ? Math.round(x.pctSum / x.done) : null, seconds: x.seconds, activeDays: x.dayCount, last: x.last })).sort((a, b) => a.name.localeCompare(b.name, 'vi')),
        sets: [...setAgg.values()].filter(x => x.assigned).map(x => ({ id: x.id, title: x.title, assigned: x.assigned, done: x.done, avgPct: x.done ? Math.round(x.pctSum / x.done) : null, seconds: x.seconds })).sort((a, b) => b.id - a.id)
      });
    } catch (e) { console.error('[lesson-vocab/report]', e.message); res.status(500).json({ error: 'Không tải được báo cáo.' }); }
  });

  // ───────────── Xem / làm bài ─────────────
  function isOwnerOrAdmin(user, set) { return user.role === 'admin' || (user.role === 'teacher' && set.teacher_id === user.id); }
  function loadSet(id) { return Number.isInteger(id) ? db.prepare('SELECT s.*, u.name AS teacher_name FROM lesson_sets s LEFT JOIN users u ON u.id=s.teacher_id WHERE s.id=?').get(id) : null; }

  app.get('/api/lesson-vocab/mine', requireAuth, (req, res) => {
    try {
      const rows = db.prepare(`SELECT s.id,s.title,s.deadline,s.note,s.cards,u.name AS teacher,
          (SELECT MAX(score) FROM lesson_results r WHERE r.set_id=s.id AND r.user_id=a.user_id) AS best,
          (SELECT COUNT(*) FROM lesson_results r WHERE r.set_id=s.id AND r.user_id=a.user_id) AS sent
        FROM lesson_assign a JOIN lesson_sets s ON s.id=a.set_id LEFT JOIN users u ON u.id=s.teacher_id WHERE a.user_id=? ORDER BY s.id DESC LIMIT 40`).all(req.user.id);
      res.json({ sets: rows.map(r => ({ id: r.id, title: r.title, deadline: r.deadline || '', note: r.note || '', teacher: r.teacher || '', words: JSON.parse(r.cards).length, best: r.best == null ? null : r.best, sent: Number(r.sent) })) });
    } catch (e) { console.error('[lesson-vocab/mine]', e.message); res.status(500).json({ error: 'Không tải được bộ từ.' }); }
  });

  app.get('/api/lesson-vocab', requireRole('teacher', 'admin'), (req, res) => {
    try {
      const rows = req.user.role === 'admin' ? db.prepare('SELECT * FROM lesson_sets ORDER BY id DESC LIMIT 60').all() : db.prepare('SELECT * FROM lesson_sets WHERE teacher_id=? ORDER BY id DESC LIMIT 60').all(req.user.id);
      res.json({ sets: rows.map(s => {
        const assigned = Number(db.prepare('SELECT COUNT(*) c FROM lesson_assign WHERE set_id=?').get(s.id).c);
        const sub = db.prepare('SELECT COUNT(DISTINCT user_id) c, AVG(sc) a FROM (SELECT user_id, MAX(score) sc FROM lesson_results WHERE set_id=? GROUP BY user_id)').get(s.id);
        return { id: s.id, title: s.title, deadline: s.deadline || '', created: s.created_at, words: JSON.parse(s.cards).length, assigned, submitted: Number(sub.c || 0), avg: sub.a == null ? null : Math.round(Number(sub.a) * 10) / 10 };
      }) });
    } catch (e) { console.error('[lesson-vocab/list]', e.message); res.status(500).json({ error: 'Không tải được danh sách.' }); }
  });

  app.get('/api/lesson-vocab/:id', requireAuth, (req, res) => {
    const id = Number(req.params.id), set = loadSet(id);
    if (!set) return res.status(404).json({ error: 'Không tìm thấy bộ từ.' });
    const owner = isOwnerOrAdmin(req.user, set);
    if (!owner && !db.prepare('SELECT 1 FROM lesson_assign WHERE set_id=? AND user_id=?').get(id, req.user.id)) return res.status(403).json({ error: 'Bộ từ này chưa được giao cho bạn.' });
    const attempts = db.prepare('SELECT score,total,created_at FROM lesson_results WHERE set_id=? AND user_id=? ORDER BY id DESC LIMIT 10').all(id, req.user.id);
    res.json({ id: set.id, title: set.title, note: set.note || '', deadline: set.deadline || '', teacher: set.teacher_name || '', owner, cards: JSON.parse(set.cards), questions: JSON.parse(set.questions), attempts });
  });

  // Học sinh gửi kết quả luyện tập cho giáo viên — server tự chấm lại từ đáp án đã chọn
  app.post('/api/lesson-vocab/:id/submit', requireAuth, (req, res) => {
    const id = Number(req.params.id), set = loadSet(id);
    if (!set) return res.status(404).json({ error: 'Không tìm thấy bộ từ.' });
    if (!db.prepare('SELECT 1 FROM lesson_assign WHERE set_id=? AND user_id=?').get(id, req.user.id)) return res.status(403).json({ error: 'Bộ từ này chưa được giao cho bạn.' });
    const questions = JSON.parse(set.questions);
    const ans = (req.body || {}).answers;
    if (!Array.isArray(ans) || ans.length !== questions.length || ans.some(a => a !== null && !(Number.isInteger(a) && a >= 0 && a <= 3))) return res.status(400).json({ error: 'Kết quả không hợp lệ.' });
    const used = Number(db.prepare('SELECT COUNT(*) c FROM lesson_results WHERE set_id=? AND user_id=?').get(id, req.user.id).c);
    if (used >= 30) return res.status(429).json({ error: 'Bạn đã gửi quá nhiều lần cho bộ từ này.' });
    const score = questions.reduce((s, q, i) => s + (ans[i] === q.answer_index ? 1 : 0), 0);
    try {
      db.prepare('INSERT INTO lesson_results (set_id,user_id,score,total,answers,created_at) VALUES (?,?,?,?,?,?)').run(id, req.user.id, score, questions.length, JSON.stringify(ans), now());
      try { notifyUser(set.teacher_id, 'lesson_result', '📘 ' + req.user.name + ' đã gửi kết quả: ' + set.title, 'Điểm luyện tập: ' + score + '/' + questions.length, 'lesson-vocab.html?id=' + id + '&tab=results'); } catch (e) {}
      res.json({ ok: true, score, total: questions.length, attempt: used + 1 });
    } catch (e) { console.error('[lesson-vocab/submit]', e.message); res.status(500).json({ error: 'Không gửi được kết quả.' }); }
  });

  // Giáo viên: kết quả từng học sinh + câu/từ khó
  app.get('/api/lesson-vocab/:id/results', requireRole('teacher', 'admin'), (req, res) => {
    const id = Number(req.params.id), set = loadSet(id);
    if (!set) return res.status(404).json({ error: 'Không tìm thấy bộ từ.' });
    if (!isOwnerOrAdmin(req.user, set)) return res.status(403).json({ error: 'Chỉ giáo viên giao bộ từ mới xem được kết quả.' });
    try {
      const questions = JSON.parse(set.questions);
      const studs = db.prepare('SELECT u.id,u.name,u.email FROM lesson_assign a JOIN users u ON u.id=a.user_id WHERE a.set_id=? ORDER BY u.name').all(id);
      const wrongCount = questions.map(() => 0); let latestN = 0;
      const students = studs.map(u => {
        const rs = db.prepare('SELECT score,total,answers,created_at FROM lesson_results WHERE set_id=? AND user_id=? ORDER BY id DESC').all(id, u.id);
        const last = rs[0];
        let missed = [];
        if (last) {
          const a = JSON.parse(last.answers); latestN++;
          questions.forEach((q, i) => { if (a[i] !== q.answer_index) { wrongCount[i]++; missed.push(i + 1); } });
        }
        const tm = db.prepare('SELECT COALESCE(SUM(seconds),0) sec, COUNT(CASE WHEN seconds>0 THEN 1 END) days, COALESCE(SUM(opens),0) opens, MAX(last_at) lastAt FROM lesson_time WHERE set_id=? AND user_id=?').get(id, u.id);
        return { id: u.id, seconds: Number(tm.sec || 0), studyDays: Number(tm.days || 0), opens: Number(tm.opens || 0), lastStudy: tm.lastAt || null, name: u.name, email: u.email, attempts: rs.length, best: rs.length ? Math.max(...rs.map(r => r.score)) : null, last: last ? { score: last.score, total: last.total, at: last.created_at } : null, missed };
      });
      res.json({ title: set.title, total: questions.length, students, hardest: questions.map((q, i) => ({ n: i + 1, target: q.target, stem: q.stem, wrong: wrongCount[i], of: latestN })).filter(x => x.wrong > 0).sort((a, b) => b.wrong - a.wrong).slice(0, 5) });
    } catch (e) { console.error('[lesson-vocab/results]', e.message); res.status(500).json({ error: 'Không tải được kết quả.' }); }
  });

  app.delete('/api/lesson-vocab/:id', requireRole('teacher', 'admin'), (req, res) => {
    const id = Number(req.params.id), set = loadSet(id);
    if (!set) return res.status(404).json({ error: 'Không tìm thấy bộ từ.' });
    if (!isOwnerOrAdmin(req.user, set)) return res.status(403).json({ error: 'Chỉ người giao mới được xoá.' });
    try {
      db.exec('BEGIN');
      db.prepare('DELETE FROM lesson_results WHERE set_id=?').run(id);
      db.prepare('DELETE FROM lesson_assign WHERE set_id=?').run(id);
      db.prepare('DELETE FROM lesson_sets WHERE id=?').run(id);
      db.exec('COMMIT');
      res.json({ ok: true });
    } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} res.status(500).json({ error: 'Không xoá được.' }); }
  });

  return { parseWords, checkCard, buildQuestion, cleanCards, cleanQuestions, generateCards, generateQuestions, dictCheckCard, hasForm };
};
module.exports.pure = { parseWords, checkCard, buildQuestion, hasForm, normStem, ipaNorm, lev, IPA_RE };
