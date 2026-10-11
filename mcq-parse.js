// Đọc đề trắc nghiệm từ các đoạn văn của file Word. Hỗ trợ 2 cách ghi đáp án:
//   (1) KHUNG/BẢNG ĐÁP ÁN ở cuối file hoặc dòng "Đáp án: C" ngay dưới mỗi câu
//   (2) IN ĐỎ phương án đúng
'use strict';

const MAX_Q = 200;
const KEY_HEAD = /^\s*(?:bảng\s+)?(?:đáp\s*án|dap\s*an|answer\s*key|answers?|key)\b(.*)$/i;
const INLINE_ANS = /^\s*(?:đáp\s*án|dap\s*an|answer|ans)\s*[:.\-–]?\s*\(?([A-Ea-e])\)?\s*[.)]?\s*$/i;
const EXPLAIN = /^\s*(?:giải\s*thích|giai\s*thich|explanation|hướng\s*dẫn\s*giải)\s*[:.\-–]\s*(.*)$/i;
const Q_START = /^\s*(?:(?:câu|cau|question|q)\s*)?(\d{1,3})\s*[.:)\-–]\s*(\S.*)?$/i;
const PAIR = /(?:câu\s*)?(\d{1,3})\s*[.\-:)–]?\s*\(?([A-Ea-e])\)?(?![A-Za-z])/gi;
const L = (i) => 'ABCDE'[i];

function splitOptions(text) {
  // Tìm các mốc "A." "B)" "(C)" ...; chấp nhận khi mốc đầu nằm ở đầu dòng và các chữ cái tăng dần liên tiếp
  const re = /(^|[\s\t])\(?([A-Ea-e])\s*[.)]\s*/g, marks = [];
  let m;
  while ((m = re.exec(text))) marks.push({ idx: m.index + m[1].length, len: m[0].length - m[1].length, letter: m[2].toUpperCase() });
  if (!marks.length || marks[0].idx > 1) return null;
  // chuỗi chữ cái tăng dần bắt đầu từ mốc đầu
  const seq = [marks[0]];
  for (let k = 1; k < marks.length; k++) if (marks[k].letter.charCodeAt(0) === seq[seq.length - 1].letter.charCodeAt(0) + 1) seq.push(marks[k]);
  return seq.map((mk, i) => ({ letter: mk.letter, start: mk.idx, from: mk.idx + mk.len, to: i + 1 < seq.length ? seq[i + 1].idx : text.length }));
}

// Bảng đáp án dạng bảng ngang: một hàng số câu (1 2 3 ...) và một hàng chữ cái (C A D ...)
function transposedKey(text) {
  const toks = String(text).split(/[\s,;|]+/).filter(Boolean);
  const nums = toks.filter(t => /^\d{1,3}$/.test(t)).map(Number), lets = toks.filter(t => /^[A-Ea-e]$/.test(t)).map(t => t.toUpperCase());
  if (!nums.length || nums.length !== lets.length) return null;
  const o = {}; nums.forEach((n, i) => { if (!(n in o)) o[n] = lets[i]; });
  return o;
}

// ── Văn bản có định dạng (đậm/nghiêng/gạch chân…): chuỗi + mảng bit định dạng theo từng ký tự ──
const RT = (s, f) => ({ s: s, f: f && f.length === s.length ? f : new Array(s.length).fill(0) });
const rtSlice = (r, a, b) => ({ s: r.s.slice(a, b), f: r.f.slice(a, b) });
const rtTrim = (r) => { const m = /^\s*/.exec(r.s)[0].length, e = r.s.replace(/\s+$/, '').length; return rtSlice(r, m, Math.max(m, e)); };
const rtCat = (a, sep, b) => ({ s: a.s + sep + b.s, f: a.f.concat(new Array(sep.length).fill(0), b.f) });
const rtHas = (r) => r.f.some(Boolean);
const hEsc = (c) => c === '&' ? '&amp;' : c === '<' ? '&lt;' : c === '>' ? '&gt;' : c === '"' ? '&quot;' : c;
// Đổi sang HTML an toàn: chỉ dùng thẻ b, i, u, sup, sub, s, br (không bao giờ mang theo màu chữ — để không lộ đáp án in đỏ)
function rtHtml(r) {
  let out = '', i = 0;
  while (i < r.s.length) {
    let j = i; while (j < r.s.length && r.f[j] === r.f[i]) j++;
    const f = r.f[i], txt = [...r.s.slice(i, j)].map(c => c === '\n' ? '<br>' : c === '\t' ? '&emsp;' : hEsc(c)).join('');
    if (!txt.replace(/<br>/g, '').trim()) out += txt;
    else {
      const open = (f & 1 ? '<b>' : '') + (f & 2 ? '<i>' : '') + (f & 4 ? '<u>' : '') + (f & 8 ? '<sup>' : '') + (f & 16 ? '<sub>' : '') + (f & 32 ? '<s>' : '');
      const close = (f & 32 ? '</s>' : '') + (f & 16 ? '</sub>' : '') + (f & 8 ? '</sup>' : '') + (f & 4 ? '</u>' : '') + (f & 2 ? '</i>' : '') + (f & 1 ? '</b>' : '');
      out += open + txt + close;
    }
    i = j;
  }
  return out;
}
const tokens = (s) => String(s || '').toLowerCase().normalize('NFC').match(/[\p{L}\p{N}]+/gu) || [];
const IGNORE = new Set(['câu', 'cau', 'question', 'đáp', 'án', 'dap', 'an', 'answer', 'answers', 'giải', 'thích', 'giai', 'thich', 'explanation', 'key', 'bảng', 'bang']);

function parseMcq(paragraphs) {
  const errors = [], warnings = [];
  const paras = (paragraphs || []).map((p, idx) => { const text = String(p.text || '').replace(/ /g, ' ').replace(/\s+$/, ''); return { text, red: p.red || [], fmt: (p.fmt || []).slice(0, text.length), num: p.num || null, idx: idx + 1 }; }).filter(p => p.text.trim());
  // ── tìm khu vực bảng đáp án ──
  let kStart = -1;
  for (let i = 0; i < paras.length; i++) {
    const m = KEY_HEAD.exec(paras[i].text);
    if (!m) continue;
    if (INLINE_ANS.test(paras[i].text)) continue; // "Đáp án: C" của từng câu
    const rest = paras.slice(i).map(p => p.text.replace(KEY_HEAD, '$1')).join(' ');
    if ((((rest.match(PAIR) || []).length) >= 1 || transposedKey(rest)) && (i === 0 || paras[i].text.trim().length <= 80 || /\d/.test(m[1] || ''))) { kStart = i; break; }
  }
  const body = kStart >= 0 ? paras.slice(0, kStart) : paras;
  const keyMap = {}; let keyCount = 0;
  if (kStart >= 0) {
    const ktext = paras.slice(kStart).map(p => p.text.replace(KEY_HEAD, '$1')).join(' ');
    const tp = transposedKey(ktext);
    if (tp) { for (const n in tp) { keyMap[n] = tp[n]; keyCount++; } }
    else { let m; PAIR.lastIndex = 0; while ((m = PAIR.exec(ktext))) { const n = +m[1]; if (!(n in keyMap)) { keyMap[n] = m[2].toUpperCase(); keyCount++; } } }
  }

  // ── tách câu hỏi ──
  const qs = []; let cur = null, qNumId = null, expOpen = false;
  const addOptionsFrom = (r, red) => {
    const parts = splitOptions(r.s);
    if (!parts) return false;
    parts.forEach(pt => {
      const label = red.slice(pt.start, pt.from), content = r.s.slice(pt.from, pt.to), cr = red.slice(pt.from, pt.to);
      const nonSp = [...content].map((ch, k) => ({ ch, r: !!cr[k] })).filter(x => !/\s/.test(x.ch));
      const redN = nonSp.filter(x => x.r).length;
      const isRed = (nonSp.length && redN / nonSp.length >= 0.5) || label.some(Boolean);
      const rr = rtTrim(rtSlice(r, pt.from, pt.to));
      cur.opts.push({ r: rr, red: !!isRed, letter: pt.letter });
    });
    return true;
  };
  for (const p of body) {
    const prt = RT(p.text, p.fmt), tt = rtTrim(prt), t = tt.s;
    let em = EXPLAIN.exec(t);
    if (em && cur) { cur.exp = rtTrim(rtSlice(tt, t.length - em[1].length)); expOpen = true; continue; }
    if (cur && INLINE_ANS.test(t)) { cur.key = INLINE_ANS.exec(t)[1].toUpperCase(); expOpen = false; continue; }
    const startsOpt = splitOptions(t);
    const qm = Q_START.exec(t);
    // đoạn đánh số tự động, không có nhãn: dựa vào cấp độ danh sách
    if (!startsOpt && !qm && p.num) {
      if (qNumId === null && !cur) qNumId = p.num.numId + ':' + p.num.ilvl;
      const sig = p.num.numId + ':' + p.num.ilvl;
      if (!cur || sig === qNumId) { cur = { n: qs.length + 1, q: tt, opts: [], key: null, exp: RT('', []), auto: true, src: p.idx }; qs.push(cur); expOpen = false; continue; }
      if (cur) { cur.opts.push({ r: tt, red: p.red.length > 0 && p.red.filter(Boolean).length / Math.max(1, t.length) >= 0.5, letter: L(cur.opts.length) }); continue; }
    }
    if (startsOpt && cur) { expOpen = false; addOptionsFrom(prt, p.red); continue; }
    if (qm) {
      // một dòng "1. ..." là câu hỏi mới
      const g2 = qm[2] || '';
      cur = { n: +qm[1], q: rtTrim(rtSlice(tt, t.length - g2.length)), opts: [], key: null, exp: RT('', []), src: p.idx }; qs.push(cur); expOpen = false;
      // câu hỏi và các phương án có thể nằm chung 1 dòng: "1. Stem ... A. x B. y C. z D. w"
      const inl = /\s(\(?[Aa]\s*[.)])\s+/.exec(' ' + cur.q.s);
      if (inl) {
        const idx = cur.q.s.search(/(^|\s)\(?[Aa]\s*[.)]\s+/);
        if (idx >= 0) {
          const stem = rtTrim(rtSlice(cur.q, 0, idx)), tail = rtTrim(rtSlice(cur.q, idx)); const redTail = [];
          const baseOff = p.text.indexOf(tail.s);
          for (let k = 0; k < tail.s.length; k++) redTail.push(!!p.red[baseOff + k]);
          const saved = cur.q; cur.q = stem;
          if (!addOptionsFrom(tail, redTail) || cur.opts.length < 2) { cur.opts = []; cur.q = saved; }
        }
      }
      continue;
    }
    if (cur) {
      if (expOpen) { cur.exp = cur.exp.s ? rtCat(cur.exp, '\n', tt) : tt; continue; }
      if (cur.opts.length === 0) cur.q = cur.q.s ? rtCat(cur.q, '\n', tt) : tt;
      else { const o = cur.opts[cur.opts.length - 1]; o.r = rtCat(o.r, '\n', tt); }
    }
  }
  if (!qs.length) { errors.push('Không tìm thấy câu hỏi nào. Mỗi câu cần bắt đầu bằng số thứ tự (VD: "Câu 1." hoặc "1.") và có các phương án A. B. C. D.'); return { questions: [], errors, warnings, mode: 'none', report: { paragraphs: paras.length, questions: 0, skipped: [], coverage: 0 } }; }
  if (qs.length > MAX_Q) { errors.push('File có ' + qs.length + ' câu — tối đa ' + MAX_Q + ' câu mỗi đề. Hãy chia thành nhiều đề.'); }

  // ── gán đáp án ──
  const useIndex = keyCount > 0 && qs.every((q, i) => q.n === i + 1);
  let usedRed = 0, usedKey = 0, fmtQ = 0;
  const out = qs.slice(0, MAX_Q).map((q, i) => {
    const label = 'Câu ' + (i + 1);
    const o = { n: i + 1, q: q.q.s.trim(), opts: q.opts.map(x => x.r.s.trim()), ans: -1, exp: q.exp.s.trim(), src: q.src };
    // bản có định dạng (chỉ lưu khi file gốc thật sự có chữ đậm / nghiêng / gạch chân…)
    const qr = rtTrim(q.q), er = rtTrim(q.exp);
    if (rtHas(qr)) o.qh = rtHtml(qr);
    if (q.opts.some(x => rtHas(rtTrim(x.r)))) o.oh = q.opts.map(x => rtHtml(rtTrim(x.r)));
    if (rtHas(er)) o.eh = rtHtml(er);
    if (o.qh || o.oh || o.eh) fmtQ++;
    if (!o.q) errors.push(label + ': chưa có nội dung câu hỏi.');
    if (q.opts.length < 2) errors.push(label + ': cần ít nhất 2 phương án (A., B., ...). Hãy kiểm tra cách ghi A. B. C. D.');
    if (q.opts.length > 5) errors.push(label + ': có ' + q.opts.length + ' phương án (tối đa 5).');
    q.opts.forEach((x, k) => { if (!o.opts[k]) errors.push(label + ': phương án ' + L(k) + ' đang trống.'); if (x.letter !== L(k)) warnings.push(label + ': thứ tự nhãn phương án không liên tục (' + q.opts.map(y => y.letter).join(', ') + ').'); });
    const reds = q.opts.map((x, k) => x.red ? k : -1).filter(k => k >= 0);
    let fromRed = null;
    if (reds.length === q.opts.length && reds.length > 1) { warnings.push(label + ': tất cả phương án đều in đỏ nên bỏ qua màu đỏ ở câu này.'); }
    else if (reds.length === 1) fromRed = reds[0];
    else if (reds.length > 1) errors.push(label + ': có ' + reds.length + ' phương án in đỏ (' + reds.map(L).join(', ') + ') — mỗi câu chỉ được 1 đáp án đúng.');
    const keyLetter = q.key || (useIndex ? keyMap[i + 1] : keyMap[q.n]);
    const fromKey = keyLetter ? 'ABCDE'.indexOf(keyLetter) : -1;
    if (fromRed !== null) {
      o.ans = fromRed; usedRed++;
      if (fromKey >= 0 && fromKey !== fromRed) warnings.push(label + ': đáp án in đỏ (' + L(fromRed) + ') khác bảng đáp án (' + keyLetter + ') — đã lấy theo màu đỏ, hãy kiểm tra.');
    } else if (fromKey >= 0) {
      if (fromKey >= q.opts.length) errors.push(label + ': bảng đáp án ghi ' + keyLetter + ' nhưng câu chỉ có ' + q.opts.length + ' phương án.');
      else { o.ans = fromKey; usedKey++; }
    } else if (reds.length <= 1) errors.push(label + ': chưa tìm thấy đáp án đúng (không có chữ đỏ và không có trong bảng đáp án).');
    return o;
  });
  const dupNums = qs.length !== new Set(qs.map(q => q.n)).size;
  if (dupNums && !useIndex) warnings.push('Số thứ tự câu bị trùng/lặp lại — đề được đánh số lại từ 1 theo thứ tự xuất hiện.');
  if (kStart >= 0 && keyCount < qs.length && usedRed < qs.length) warnings.push('Bảng đáp án chỉ có ' + keyCount + ' đáp án trong khi đề có ' + qs.length + ' câu.');
  if (qs.some(q => q.auto)) warnings.push('Một số câu dùng đánh số tự động của Word — hãy xem kỹ bản xem trước bên dưới có đúng không (khuyến nghị gõ trực tiếp "Câu 1." và "A.").');
  // định dạng có thể làm lộ đáp án: chỉ ĐÚNG MỘT phương án in đậm/nghiêng/gạch chân trong nhiều câu
  let leak = 0; out.forEach((o, i) => { if (!o.oh) return; const marked = qs[i].opts.map(x => rtHas(rtTrim(x.r))); if (marked.filter(Boolean).length === 1 && marked[o.ans]) leak++; });
  if (leak >= Math.max(2, Math.ceil(out.length * 0.3))) warnings.push('⚠️ Ở ' + leak + ' câu, CHỈ phương án đúng đang được in đậm/nghiêng/gạch chân — học sinh sẽ nhìn thấy và đoán được đáp án. Nên tắt "Giữ định dạng chữ" ở bước kiểm tra bên dưới.');
  const mode = usedRed && usedKey ? 'mixed' : usedRed ? 'red' : usedKey ? 'key' : 'none';

  // ── ĐỐI CHIẾU với file gốc: mọi chữ trong phần đề của file có nằm trong các câu đã đọc không? ──
  const pool = new Map(); out.forEach(o => { tokens(o.q + ' ' + o.opts.join(' ') + ' ' + o.exp).forEach(w => pool.set(w, (pool.get(w) || 0) + 1)); });
  let totalTok = 0, missTok = 0; const skipped = [], present = new Set(pool.keys());
  const tokOf = (p) => tokens(p.text.trim().replace(/^(?:(?:câu|cau|question|q)\s*)?\d{1,3}\s*[.:)\-–]\s*/i, '').replace(/^\(?[A-Ea-e]\s*[.)]\s*/, '')).filter(w => !(IGNORE.has(w) || (w.length === 1 && /[a-e]/.test(w))));
  body.forEach(p => {
    const tk = tokOf(p); if (!tk.length) return;
    const hit = tk.filter(w => present.has(w)).length;
    if (hit / tk.length < 0.5) { totalTok += tk.length; missTok += tk.length - hit; skipped.push({ n: p.idx, text: p.text.trim().slice(0, 140), miss: tk.length - hit }); return; }   // đoạn gần như không có trong đề: báo cáo, không "ăn" chữ của câu khác
    const miss = []; tk.forEach(w => { totalTok++; const c = pool.get(w) || 0; if (c > 0) pool.set(w, c - 1); else { miss.push(w); missTok++; } });
    if (miss.length >= 2 || (miss.length === 1 && tk.length <= 3)) skipped.push({ n: p.idx, text: p.text.trim().slice(0, 140), miss: miss.length });
  });
  const coverage = totalTok ? Math.round((totalTok - missTok) / totalTok * 1000) / 10 : 100;
  const optStat = {}; out.forEach(o => { optStat[o.opts.length] = (optStat[o.opts.length] || 0) + 1; });
  if (skipped.length) warnings.push('Có ' + skipped.length + ' đoạn trong file KHÔNG được đưa vào đề (có thể là tiêu đề/hướng dẫn — bỏ qua nếu đúng): ' + skipped.slice(0, 3).map(x => '"' + x.text.slice(0, 40) + (x.text.length > 40 ? '…' : '') + '" (đoạn ' + x.n + ')').join('; ') + (skipped.length > 3 ? '…' : ''));
  return { questions: out, errors, warnings, mode, report: { paragraphs: paras.length, bodyParagraphs: body.length, questions: out.length, withFormat: fmtQ, options: optStat, skipped: skipped.slice(0, 30), coverage, withKey: usedKey, withRed: usedRed } };
}

module.exports = { parseMcq, splitOptions, rtHtml };
