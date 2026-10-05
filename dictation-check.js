'use strict';
// Chấm bài chép chính tả: so khớp từng TỪ giữa câu gốc và bài học sinh gõ.
// Không phạt: viết hoa/thường, dấu câu, dạng viết tắt (I'm = I am), số bằng chữ hay chữ số (six = 6), vài khác biệt Anh–Mỹ (color = colour).
// Phạt nhẹ (nửa điểm): sai chính tả 1–2 chữ cái ở từ dài. Phạt: thiếu từ, thừa từ, sai từ.

const ONES = { zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19 };
const TENS = { twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90 };
const US2UK = { color: 'colour', colors: 'colours', colored: 'coloured', favorite: 'favourite', favorites: 'favourites', center: 'centre', centers: 'centres', theater: 'theatre', theaters: 'theatres', neighbor: 'neighbour', neighbors: 'neighbours', neighborhood: 'neighbourhood', realize: 'realise', realized: 'realised', organize: 'organise', organized: 'organised', traveling: 'travelling', traveled: 'travelled', traveler: 'traveller', program: 'programme', programs: 'programmes', gray: 'grey', mom: 'mum', moms: 'mums', cookie: 'biscuit', cookies: 'biscuits', apologize: 'apologise', behavior: 'behaviour', honor: 'honour', labor: 'labour', defense: 'defence', license: 'licence', catalog: 'catalogue', dialog: 'dialogue', analyze: 'analyse', meter: 'metre', liter: 'litre', fiber: 'fibre', jewelry: 'jewellery', cozy: 'cosy', pajamas: 'pyjamas', tire: 'tyre', tires: 'tyres', skeptical: 'sceptical' };
const NOT = { 'can\'t': ['can', 'not'], 'cannot': ['can', 'not'], 'won\'t': ['will', 'not'], 'shan\'t': ['shall', 'not'], 'ain\'t': ['is', 'not'], 'let\'s': ['let', 'us'] };
const IS_HOST = new Set(['he', 'she', 'it', 'that', 'there', 'here', 'what', 'who', 'where', 'how', 'when', 'why', 'this', 'everyone', 'everybody', 'someone', 'nobody', 'somebody', 'one']);

function clean(s) {
  return String(s == null ? '' : s).normalize('NFKC')
    .replace(/[’‘`´]/g, '\'').replace(/[“”«»]/g, ' ').replace(/[–—‒―]/g, ' ')
    .replace(/(\d)[.:,](\d)/g, '$1 $2')          // 7.30 / 7:30 / 1,000 → hai mốc số liền nhau
    .replace(/[£$€]/g, ' ').replace(/%/g, ' percent ');
}
// Tách thành các "từ gốc" (giữ nguyên chữ để hiển thị), bỏ dấu câu ở hai đầu
function words(s) {
  return clean(s).split(/[\s]+/).map((w) => w.replace(/^[^A-Za-z0-9']+|[^A-Za-z0-9']+$/g, '').replace(/^'+|'+$/g, '')).filter(Boolean);
}
// Từ gốc → các token chuẩn (một từ gốc có thể thành nhiều token, vd. "I'm" → i, am)
function canon(word) {
  let w = word.toLowerCase().replace(/[^a-z0-9'-]/g, '');
  if (!w) return [];
  if (w.includes('-')) return w.split('-').filter(Boolean).flatMap(canon);
  if (NOT[w]) return NOT[w].slice();
  let m;
  if ((m = /^(.+)n't$/.exec(w))) { const b = m[1] === 'wo' ? 'will' : m[1] === 'ca' ? 'can' : m[1] === 'sha' ? 'shall' : m[1]; return [b, 'not']; }
  if ((m = /^(.+)'m$/.exec(w))) return [m[1], 'am'];
  if ((m = /^(.+)'re$/.exec(w))) return [m[1], 'are'];
  if ((m = /^(.+)'ve$/.exec(w))) return [m[1], 'have'];
  if ((m = /^(.+)'ll$/.exec(w))) return [m[1], 'will'];
  if ((m = /^(.+)'d$/.exec(w))) return [m[1], 'would'];
  if ((m = /^(.+)'s$/.exec(w)) && IS_HOST.has(m[1])) return [m[1], 'is'];
  if (US2UK[w]) w = US2UK[w];
  return [w];
}
// Gộp số bằng chữ thành chữ số: "twenty five" → 25, "seventy" → 70, "one hundred" → 100
function numbers(tokens) {
  const out = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t in TENS) { const nx = tokens[i + 1]; if (nx in ONES && ONES[nx] >= 1 && ONES[nx] <= 9) { out.push({ t: String(TENS[t] + ONES[nx]), n: 2 }); i++; continue; } out.push({ t: String(TENS[t]), n: 1 }); continue; }
    if (t in ONES) {
      if (tokens[i + 1] === 'hundred') { out.push({ t: String(ONES[t] * 100), n: 2 }); i++; continue; }
      out.push({ t: String(ONES[t]), n: 1 }); continue;
    }
    if (t === 'hundred') { out.push({ t: '100', n: 1 }); continue; }
    out.push({ t, n: 1 });
  }
  return out;
}
// Danh sách token chuẩn kèm chỉ số "từ gốc" (o) để hiển thị
function tokenize(s) {
  const ws = words(s), toks = [];
  ws.forEach((w, o) => {
    const parts = canon(w);
    for (const p of numbers(parts)) toks.push({ t: p.t.replace(/'/g, '\''), o });
  });
  // "1 000"/"7 30": các mốc số kề nhau giữ nguyên là token riêng (hai bên cùng chuẩn hoá nên vẫn khớp)
  return { words: ws, toks };
}

function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
// Sai chính tả nhẹ: từ dài ≥ 4 chữ, sai tối đa 1 (từ < 8 chữ) hoặc 2 (từ ≥ 8 chữ) chữ cái; không áp dụng cho số
function near(a, b) {
  if (a === b) return 'ok';
  if (/\d/.test(a) || /\d/.test(b)) return null;
  const L = Math.max(a.length, b.length); if (L < 4) return null;
  const d = lev(a, b); return d <= (L >= 8 ? 2 : 1) ? 'typo' : null;
}

// Căn hàng hai chuỗi token bằng quy hoạch động (tối ưu điểm: ok=2, typo=1, lệch=0)
function align(R, T) {
  const m = R.length, n = T.length;
  const S = Array.from({ length: m + 1 }, () => new Int16Array(n + 1)), K = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(null));
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) {
    const c = near(R[i - 1].t, T[j - 1].t); let best = S[i - 1][j], k = 'up';
    if (S[i][j - 1] > best) { best = S[i][j - 1]; k = 'left'; }
    if (c) { const v = S[i - 1][j - 1] + (c === 'ok' ? 2 : 1); if (v >= best) { best = v; k = c; } }
    S[i][j] = best; K[i][j] = k;
  }
  const ops = []; let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && (K[i][j] === 'ok' || K[i][j] === 'typo')) { ops.push({ k: K[i][j], r: i - 1, t: j - 1 }); i--; j--; }
    else if (j > 0 && (i === 0 || K[i][j] === 'left')) { ops.push({ k: 'extra', t: j - 1 }); j--; }
    else { ops.push({ k: 'miss', r: i - 1 }); i--; }
  }
  return ops.reverse();
}

// Kết quả: điểm 0–100, danh sách từ gốc có màu (cho câu đúng và bài học sinh)
function check(refText, typedText) {
  const R = tokenize(refText), T = tokenize(typedText);
  if (!R.toks.length) return { score: 0, perfect: false, ref: [], typed: [], counts: { ok: 0, typo: 0, miss: 0, extra: 0 } };
  const ops = align(R.toks, T.toks);
  const rs = R.words.map(() => 'ok'), ts = T.words.map(() => 'ok'), fix = {};
  const rank = { ok: 0, typo: 1, miss: 2, extra: 2 };
  const worse = (arr, i, v) => { if (rank[v] > rank[arr[i]]) arr[i] = v; };
  const c = { ok: 0, typo: 0, miss: 0, extra: 0 };
  for (const op of ops) {
    c[op.k]++;
    if (op.k === 'ok') { /* giữ nguyên */ }
    else if (op.k === 'typo') { worse(rs, R.toks[op.r].o, 'typo'); worse(ts, T.toks[op.t].o, 'typo'); fix[T.toks[op.t].o] = R.words[R.toks[op.r].o]; }
    else if (op.k === 'miss') worse(rs, R.toks[op.r].o, 'miss');
    else worse(ts, T.toks[op.t].o, 'extra');
  }
  const denom = Math.max(R.toks.length, T.toks.length);
  const score = Math.max(0, Math.min(100, Math.round(((c.ok + 0.5 * c.typo) / denom) * 100)));
  const perfect = c.typo === 0 && c.miss === 0 && c.extra === 0;
  return {
    score, perfect, counts: c,
    ref: R.words.map((w, i) => ({ w, s: rs[i] })),
    typed: T.words.map((w, i) => ({ w, s: ts[i], fix: fix[i] || undefined })),
  };
}

module.exports = { check, tokenize, canon, words };
