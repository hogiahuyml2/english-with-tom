/* EWT Garden — đồ hoạ các món SỰ KIỆN (Tết, Trung thu, Giáng sinh): hoa, cây, trang trí, thú cưng. Khung 100×100, gốc ở giữa phía dưới.
   Nạp SAU garden-art*.js và garden-gen4.js (dùng lại mẫu thú của gen4 cho vài bé). Công trình lớn nằm ở garden-events-art2.js. */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, CAT = root.EWTGardenCatalog; if (!A) return;
  var K = A.K, C = K.C, R = K.R, P = K.P, L = K.L, SH = K.SH, G1 = K.G1, G2 = K.G2, G3 = K.G3, leaf = K.leaf, stem = K.stem, eyes = K.eyes, shade = A.shade, INK = K.INK;
  var E = function (x, y, rx, ry, f, rot, ex) { if (typeof rot === 'string') { ex = rot; rot = 0; } return K.E(x, y, rx, ry, f, rot, ex); };
  var BLOOM = A.BLOOM, TREEX = A.TREEX, DECO = A.DECO, PET = A.PET, rad = Math.PI / 180;
  var ST = function (c) { return ' stroke="' + shade(c || '#888888', -.32) + '" stroke-width="1.3" stroke-linejoin="round"'; };
  var GOLD = '#FFD23F', GOLD2 = '#C98A00', RED = '#E5334B', RED2 = '#B71C2C';
  function star(cx, cy, ro, ri, n, f, ex) { var p = [], i; for (i = 0; i < n * 2; i++) { var r = i % 2 ? ri : ro, a = (-90 + i * 180 / n) * rad; p.push((cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1)); } return '<polygon points="' + p.join(' ') + '" fill="' + f + '"' + (ex || '') + '/>'; }
  function blos(x, y, r, c, c2) { var s = '', i; for (i = 0; i < 5; i++) { var a = (i * 72 - 90) * rad; s += C((x + Math.cos(a) * r * .7).toFixed(1), (y + Math.sin(a) * r * .7).toFixed(1), r * .55, c); } return s + C(x, y, r * .32, c2); }
  function env(x, y) { return L('M' + x + ' ' + y + 'v5', GOLD2, 1) + R(x - 3.5, y + 5, 7, 10, 1.5, RED, ST(RED)) + C(x, y + 10, 1.7, GOLD); }

  /* ═══════════ HOA ═══════════ */
  function narc(x, y, r, c, c2) { var s = '', i; for (i = 0; i < 6; i++) { var a = i * 60 - 90; s += E(x + Math.cos(a * rad) * r * .62, y + Math.sin(a * rad) * r * .62, r * .58, r * .34, c, a, ST('#B8C4D6')); } return s + C(x, y, r * .42, c2, ST(c2)) + C(x, y, r * .22, shade(c2, -.25)); }
  BLOOM.tet_f1 = function (c, c2) { return P('M46 90Q34 66 28 40Q42 64 50 86Z', '#58B84F') + P('M54 90Q66 66 72 42Q58 64 50 86Z', '#3F9A44') + L('M50 90Q50 66 50 52', G2, 3) + L('M44 88Q40 72 36 62', G2, 2.6) + L('M56 88Q60 74 64 64', G2, 2.6) + narc(50, 46, 15, c, c2) + narc(34, 58, 10, c, c2) + narc(66, 60, 10, c, c2); };
  BLOOM.tet_f2 = function (c, c2) { var s = P('M44 90Q36 70 40 50Q46 72 52 88Z', '#3F9A44') + P('M56 90Q64 72 60 52Q54 72 48 88Z', '#58B84F') + L('M50 90Q47 60 52 18', G2, 3.4), i; for (i = 0; i < 6; i++) { var y = 28 + i * 9.5, k = 1 - i * .05, l = i % 2 ? -1 : 1, x = 50 + l * (3 + i * .5); s += E(x - l * 5, y, 8.6 * k, 5.6 * k, c, l * -28, ST(c)) + E(x + l * 3, y - 2, 8.6 * k, 5.6 * k, shade(c, .1), l * 14, ST(c)) + E(x, y + 3.4, 7.4 * k, 4.6 * k, shade(c, -.1), 0, ST(c)) + C(x, y + .5, 2.6 * k, '#FFE0A0'); } return s + E(52, 17, 3.6, 5, shade(c, .1), 0, ST(c)); };
  BLOOM.tet_f3 = function (c, c2) { var s = stem(30) + E(50, 56, 27, 10, shade(c, -.2)), i; for (i = 0; i < 9; i++) { var a = (200 + i * 17.5) * rad, x = 50 + Math.cos(a) * 24, y = 56 + Math.sin(a) * 25; s += C(x.toFixed(1), y.toFixed(1), 10 - Math.abs(i - 4) * .5, i % 2 ? c : shade(c, .1), ST(c)); } s += C(50, 42, 12, shade(c, .08)); for (i = 0; i < 7; i++) { var b = (206 + i * 21) * rad; s += L('M' + (50 + Math.cos(b) * 12).toFixed(1) + ' ' + (56 + Math.sin(b) * 12).toFixed(1) + 'Q' + (50 + Math.cos(b) * 20).toFixed(1) + ' ' + (56 + Math.sin(b) * 22).toFixed(1) + ' ' + (50 + Math.cos(b + .12) * 26).toFixed(1) + ' ' + (56 + Math.sin(b + .12) * 26).toFixed(1), shade(c, -.32), 1.4); } return s + L('M34 40Q40 32 48 30', shade(c, .4), 2) + E(50, 62, 22, 4, c2, 0, ' opacity=".35"'); };
  // Trung thu
  BLOOM.tt_f1 = function (c, c2) { var s = L('M50 90Q48 70 50 56', G2, 3.2) + leaf(50, 82, -40, 22, G1) + leaf(50, 74, 220, 20, G1) + C(50, 46, 26, '#FFF6C8', ' opacity=".35"'), i; for (i = 0; i < 10; i++) { var a = i * 36; s += '<g transform="translate(50 46) rotate(' + a + ')">' + P('M0 0Q-5 -9 0 -22Q5 -9 0 0Z', i % 2 ? c : '#F6F3FF', ' stroke="#D9D2EE" stroke-width=".7"') + '</g>'; } for (i = 0; i < 5; i++) { var b = i * 72 + 18; s += '<g transform="translate(50 46) rotate(' + b + ')">' + P('M0 0Q-4 -6 0 -14Q4 -6 0 0Z', '#fff') + '</g>'; } return s + C(50, 46, 4.5, c2, ST(c2)); };
  BLOOM.tt_f2 = function (c, c2) { var s = L('M50 90Q48 66 50 46', '#6B4A2B', 3) + L('M50 70Q38 62 32 50M50 62Q62 54 68 42', '#6B4A2B', 2.4) + leaf(50, 80, -40, 18, G1) + leaf(50, 76, 220, 18, G1), pts = [[50, 40], [32, 48], [68, 38], [40, 58], [60, 54], [50, 30]], k; pts.forEach(function (p) { var i; for (i = 0; i < 5; i++) { var a = (i * 72 - 90) * rad; s += E(p[0] + Math.cos(a) * 5, p[1] + Math.sin(a) * 5, 4.6, 3, c, i * 72 - 90, ST('#CFCFB0')); } s += C(p[0], p[1], 2.4, c2); }); return s; };
  BLOOM.tt_f3 = function (c, c2) { var s = L('M50 90Q46 70 50 40', G2, 3.2) + L('M50 66Q36 60 30 48M50 58Q64 52 70 40', G2, 2.4) + leaf(50, 82, -40, 20, G1) + leaf(50, 76, 220, 18, G1); [[50, 36, 12], [30, 50, 10], [70, 42, 10]].forEach(function (p) { s += P('M' + p[0] + ' ' + (p[1] - p[2]) + 'Q' + (p[0] + p[2] * 1.1) + ' ' + (p[1] - p[2] * .2) + ' ' + (p[0] + p[2] * .5) + ' ' + (p[1] + p[2]) + 'Q' + p[0] + ' ' + (p[1] + p[2] * 1.3) + ' ' + (p[0] - p[2] * .5) + ' ' + (p[1] + p[2]) + 'Q' + (p[0] - p[2] * 1.1) + ' ' + (p[1] - p[2] * .2) + ' ' + p[0] + ' ' + (p[1] - p[2]) + 'Z', c, ST(c)) + L('M' + p[0] + ' ' + (p[1] - p[2] * .8) + 'V' + (p[1] + p[2]) + 'M' + (p[0] - p[2] * .5) + ' ' + (p[1] - p[2] * .3) + 'Q' + (p[0] - p[2] * .3) + ' ' + (p[1] + p[2] * .4) + ' ' + (p[0] - p[2] * .2) + ' ' + (p[1] + p[2] * .9) + 'M' + (p[0] + p[2] * .5) + ' ' + (p[1] - p[2] * .3) + 'Q' + (p[0] + p[2] * .3) + ' ' + (p[1] + p[2] * .4) + ' ' + (p[0] + p[2] * .2) + ' ' + (p[1] + p[2] * .9), shade(c, -.25), 1) + E(p[0] - p[2] * .25, p[1] - p[2] * .3, p[2] * .18, p[2] * .3, c2, 20, ' opacity=".7"'); }); return s; };
  // Giáng sinh
  BLOOM.nl_f1 = function (c, c2) { var s = L('M50 90Q47 70 50 54', G2, 3.4), i, a; for (i = 0; i < 6; i++) { a = i * 60 + 10; s += '<g transform="translate(50 52) rotate(' + a + ')">' + P('M0 0Q-8 -10 -1 -26Q8 -12 0 0Z', '#2E8B57', ST('#2E8B57')) + '</g>'; } for (i = 0; i < 6; i++) { a = i * 60 + 40; s += '<g transform="translate(50 52) rotate(' + a + ')">' + P('M0 0Q-9 -9 0 -23Q9 -9 0 0Z', i % 2 ? c : shade(c, .1), ST(c)) + L('M0 -3V-18', shade(c, -.3), 1) + '</g>'; } return s + C(50, 52, 5, '#F2D84A', ST('#F2D84A')) + C(47, 50, 1.4, '#C98A00') + C(53, 51, 1.4, '#C98A00'); };
  BLOOM.nl_f2 = function (c, c2) { var s = L('M50 90Q46 70 40 54M50 80Q60 64 66 50', '#7A5A3A', 3), pts = [[34, 46, 0], [52, 40, 40], [68, 42, 0], [44, 60, 20], [60, 62, 60]]; pts.forEach(function (p) { s += E(p[0], p[1], 8, 4, c, p[2] ? p[2] - 30 : -20, ST(c)) + E(p[0] + 8, p[1] - 6, 8, 4, shade(c, .12), 40, ST(c)); }); [[40, 48], [58, 44], [47, 62], [66, 58], [36, 56]].forEach(function (p) { s += C(p[0], p[1], 3.6, c2, ST('#CFCFCF')) + C(p[0] - 1, p[1] - 1, 1, '#fff'); }); return s + R(30, 84, 40, 6, 3, '#C62828') + L('M36 84v6M50 84v6M64 84v6', '#FFD23F', 1.4); };
  BLOOM.nl_f3 = function (c, c2) { var s = stem(26) + leaf(40, 70, 200, 20, '#5E8A4A') + leaf(60, 68, -20, 20, '#5E8A4A'), i, p = [[50, 46, 14], [34, 56, 10], [66, 58, 10]]; p.forEach(function (q) { for (i = 0; i < 5; i++) { var a = (i * 72 - 90) * rad; s += E(q[0] + Math.cos(a) * q[2] * .55, q[1] + Math.sin(a) * q[2] * .55, q[2] * .52, q[2] * .38, c, i * 72 - 90, ST('#B9B3CF')); } s += C(q[0], q[1], q[2] * .26, '#D8C84A'); for (i = 0; i < 6; i++) s += C(q[0] + Math.cos(i) * q[2] * .18, q[1] + Math.sin(i) * q[2] * .18, 1, c2); }); return s; };

  /* ═══════════ CÂY ═══════════ */
  function crown(s, list, c) { list.forEach(function (p, k) { s.v += C(p[0], p[1], p[2], k % 2 ? c : shade(c, .1)); }); }
  TREEX.tet_t1 = function (it, tr, stage) {
    var s = tr('#6B4121', 7, 30) + L('M50 70Q40 58 32 48M50 62Q62 52 70 42M50 54Q48 44 46 34', '#6B4121', 3.4);
    [[32, 44, 16], [68, 40, 16], [48, 30, 19], [38, 56, 13], [62, 56, 13], [50, 46, 17]].forEach(function (p, k) { s += C(p[0], p[1], p[2], k % 2 ? it.c : shade(it.c, .12)); });
    [[28, 40], [40, 34], [56, 26], [70, 36], [62, 50], [36, 54], [48, 44], [76, 48], [44, 20], [22, 50]].forEach(function (p) { s += blos(p[0], p[1], 5.4, '#FFE3EE', it.c2); });
    if (stage === 3) [[34, 58], [54, 54], [70, 56], [24, 54]].forEach(function (p) { s += env(p[0], p[1]); });
    return s;
  };
  TREEX.tet_t2 = function (it, tr, stage) {
    var s = tr('#6B4A2B', 6.5, 30) + L('M50 70Q38 60 30 46M50 62Q62 52 72 40M50 52Q50 40 46 28M40 56Q28 52 22 44', '#6B4A2B', 3);
    [[26, 42], [36, 30], [52, 22], [68, 32], [74, 46], [58, 46], [40, 46], [48, 34], [30, 54], [64, 58]].forEach(function (p, k) { s += leaf(p[0], p[1] + 4, k * 40, 8, '#5BBE5B'); });
    [[26, 42], [36, 30], [52, 22], [68, 32], [74, 46], [58, 46], [40, 46], [48, 34], [30, 54], [64, 58], [20, 52], [58, 32]].forEach(function (p, k) { var i; for (i = 0; i < 5; i++) { var a = (i * 72 - 90 + k * 10) * rad; s += C((p[0] + Math.cos(a) * 4).toFixed(1), (p[1] + Math.sin(a) * 4).toFixed(1), 3.6, k % 3 ? it.c : shade(it.c, .15), ' stroke="' + it.c2 + '" stroke-width=".5"'); } s += C(p[0], p[1], 2, it.c2); });
    if (stage === 3) s += env(34, 60) + env(60, 64) + env(46, 52);
    return s;
  };
  TREEX.tet_t3 = function (it, tr, stage) {
    var s = R(48, 56, 4, 18, 1, '#6B4121') + C(50, 40, 24, '#3E9B4F') + C(35, 46, 15, '#4FAE4A') + C(65, 46, 15, '#4FAE4A') + C(50, 26, 14, '#5BBE5B');
    [[40, 34], [58, 30], [66, 46], [34, 50], [50, 44], [48, 24], [58, 54], [42, 58]].forEach(function (p) { s += stage === 3 ? C(p[0], p[1], 5.2, it.c2, ST(it.c2)) + C(p[0] - 1.4, p[1] - 1.6, 1.4, '#FFE0A0') : C(p[0], p[1], 3, '#B8D86A'); });
    return s + P('M33 90L38 70H62L67 90Z', '#E8742E', ST('#E8742E')) + R(35, 66, 30, 6, 2, GOLD, ST(GOLD)) + R(36, 80, 28, 4, 0, RED) + C(50, 82, 2.4, GOLD);
  };
  TREEX.tt_t1 = function (it, tr, stage) {
    var s = P('M38 90Q42 68 38 50H62Q58 68 62 90Z', '#7A4A22', ST('#7A4A22')) + L('M34 46Q30 62 32 76M66 46Q70 62 68 76', '#7A4A22', 2) + L('M26 42Q24 58 26 70M74 42Q76 58 74 70', '#7A4A22', 1.4);
    s += C(50, 36, 30, '#3E8F4A') + C(28, 44, 18, '#4FA854') + C(72, 44, 18, '#4FA854') + C(50, 20, 18, '#5BBE5B') + C(38, 30, 12, '#6BCB68', ' opacity=".7"');
    if (stage === 3) s += L('M40 56V62', '#7A4A22', 1) + star(40, 68, 7, 3.2, 5, '#E5334B', ST(RED)) + C(40, 68, 1.6, GOLD) + C(24, 82, 3.6, '#F1C59A') + P('M19 90Q19 82 24 82Q29 82 29 90Z', '#8A5A2E') + P('M20 79L24 72L28 79Z', '#C98A4B') + E(24, 90, 10, 2, 'rgba(0,0,0,.15)');
    return s;
  };
  TREEX.tt_t2 = function (it, tr, stage) {
    var s = tr('#7A4A22', 8, 26) + C(50, 40, 27, '#4FA84F') + C(33, 48, 17, '#468F46') + C(67, 48, 17, '#468F46') + C(48, 30, 15, '#62BE5E');
    [[38, 38], [58, 32], [66, 52], [44, 54], [30, 54], [52, 44]].forEach(function (p) { s += stage === 3 ? C(p[0], p[1], 7.4, it.c2, ST(it.c2)) + C(p[0] - 2, p[1] - 2.4, 2, '#FFF6B8') : C(p[0], p[1], 3.4, '#A8D66A'); });
    [[46, 22], [64, 42], [34, 44], [52, 60], [26, 46]].forEach(function (p) { s += blos(p[0], p[1], 3.2, '#FFFFFF', '#F2D84A'); });
    return s;
  };
  TREEX.tt_t3 = function (it, tr, stage) {
    var s = C(50, 40, 36, '#FFE9A0', ' opacity=".2"') + P('M70 8A10 10 0 1 0 80 24A8 8 0 1 1 70 8Z', '#FFF1B8', ST('#E8C850')) + tr('#6B4A2B', 6, 34) + L('M50 62Q40 52 36 42M50 56Q60 46 64 36', '#6B4A2B', 2.6);
    [[50, 24, 15, 20], [34, 40, 12, 16], [66, 38, 12, 16], [42, 54, 10, 12], [58, 52, 10, 12]].forEach(function (e, k) { s += E(e[0], e[1], e[2], e[3], k % 2 ? '#7DBB5A' : '#6BAE50', 0); });
    [[50, 14], [44, 26], [56, 30], [32, 36], [38, 46], [68, 34], [62, 44], [50, 40], [46, 56], [58, 54], [28, 44], [72, 44]].forEach(function (p, k) { s += stage === 3 ? C(p[0], p[1], 2.8, k % 2 ? '#FFD86B' : '#FFC93C') + C(p[0] - .8, p[1] - .8, .9, '#FFF6C8') : C(p[0], p[1], 1.6, '#C8E08A'); });
    return s;
  };
  function tiers(w0, cols) { var s = '', ys = [[64, w0], [48, w0 - 8], [32, w0 - 15]]; ys.forEach(function (t, k) { s += P('M50 ' + (t[0] - 26) + 'L' + (50 + t[1]) + ' ' + t[0] + 'Q50 ' + (t[0] + 7) + ' ' + (50 - t[1]) + ' ' + t[0] + 'Z', k % 2 ? cols[1] : cols[0], ST(cols[0])); }); return { s: s, ys: ys }; }
  TREEX.nl_t1 = function (it, tr, stage) {
    var t = tiers(32, ['#2E8B57', '#27774A']), s = tr('#7A4A22', 7, 16) + t.s;
    t.ys.forEach(function (y, k) { s += L('M' + (50 - y[1] + 7) + ' ' + (y[0] - 4) + 'Q50 ' + (y[0] + 5) + ' ' + (50 + y[1] - 7) + ' ' + (y[0] - 4), GOLD, 1.8); });
    if (stage === 3) { [[38, 58, RED], [60, 60, '#4FB4FF'], [50, 50, GOLD], [42, 42, RED], [58, 40, '#4FB4FF'], [50, 30, RED], [44, 26, GOLD], [72, 62, GOLD], [30, 62, '#B66CFF']].forEach(function (o) { s += C(o[0], o[1], 3.4, o[2], ST(o[2])) + C(o[0] - 1, o[1] - 1.2, 1, 'rgba(255,255,255,.8)'); }); s += star(50, 6, 8, 3.6, 5, GOLD, ST(GOLD)); [[34, 56], [66, 54], [46, 38], [54, 20]].forEach(function (p) { s += C(p[0], p[1], 1.4, '#FFF7B0'); }); }
    return s;
  };
  TREEX.nl_t2 = function (it, tr, stage) {
    var t = tiers(32, ['#2F7F5A', '#276A4C']), s = tr('#7A4A22', 7, 16) + t.s;
    t.ys.forEach(function (y) { s += P('M50 ' + (y[0] - 26) + 'L' + (50 + y[1] * .7) + ' ' + (y[0] - 8) + 'Q' + (50 + y[1] * .35) + ' ' + (y[0] - 14) + ' 50 ' + (y[0] - 9) + 'Q' + (50 - y[1] * .35) + ' ' + (y[0] - 14) + ' ' + (50 - y[1] * .7) + ' ' + (y[0] - 8) + 'Z', '#F4FAFF', ST('#B8CFE6')) + C(50 - y[1] + 6, y[0] + 1, 3, '#F4FAFF') + C(50 + y[1] - 6, y[0] + 1, 3, '#F4FAFF'); });
    s += E(50, 90, 18, 4, '#F4FAFF');
    if (stage === 3) s += L('M30 70v4M70 70v4M42 55v3', '#CFE8FF', 1.6) + C(50, 12, 2, '#fff') + star(50, 6, 6, 2.6, 6, '#CFE8FF');
    return s;
  };
  TREEX.nl_t3 = function (it, tr, stage) {
    var s = R(46, 62, 8, 14, 2, '#6B4A2B') + C(50, 44, 26, '#2B7A45'), i;
    [[30, 36], [70, 38], [50, 20], [26, 54], [74, 54], [40, 28], [60, 26], [50, 64], [34, 64], [66, 64]].forEach(function (p, k) { var j; for (j = 0; j < 5; j++) s += leaf(p[0], p[1], j * 72 + k * 20, 11, k % 2 ? '#2F8A4C' : '#256B3E'); });
    s += C(50, 44, 16, '#2F8A4C', ' opacity=".6"');
    if (stage === 3) [[40, 38], [56, 34], [62, 52], [38, 54], [50, 46], [48, 26], [30, 46], [70, 44]].forEach(function (p) { s += C(p[0], p[1], 3.6, RED, ST(RED)) + C(p[0] - 1, p[1] - 1.2, 1, '#FFB0B8'); });
    return s + P('M50 78L38 72Q34 80 44 82ZM50 78L62 72Q66 80 56 82Z', RED, ST(RED)) + C(50, 78, 3, RED2) + P('M50 80L44 90M50 80L56 90', RED, ' stroke="' + RED2 + '" stroke-width="1.4"');
  };

  /* ═══════════ TRANG TRÍ ═══════════ */
  DECO.tet_d1 = function () {
    return SH(26) + E(50, 88, 26, 5, '#8E1228') + P('M34 88L38 72H62L66 88Z', RED, ST(RED)) + R(30, 66, 40, 8, 4, GOLD, ST(GOLD)) + L('M42 80h16', GOLD, 2)
      + C(50, 46, 13, '#CFE36A', ST('#CFE36A')) + C(46, 42, 3.4, 'rgba(255,255,255,.5)')
      + C(38, 58, 9, '#FF9A1F', ST('#FF9A1F')) + C(62, 58, 9, '#FF8A1F', ST('#FF8A1F')) + C(50, 62, 9, '#FFB02E', ST('#FFB02E'))
      + L('M30 56Q26 66 36 66', '#F2C94C', 5) + L('M28 56Q24 64 34 64', '#E0B030', 2.4) + C(72, 54, 6.4, '#F26A21', ST('#F26A21')) + P('M70 48l4 0l-2 3z', '#3E9B4F') + C(26, 50, 5.4, RED, ST(RED))
      + P('M47 36Q50 32 53 36', '#3E9B4F') + C(35, 56, 2, 'rgba(255,255,255,.55)') + C(60, 55, 2, 'rgba(255,255,255,.55)');
  };
  DECO.tet_d2 = function () {
    var s = SH(26) + P('M50 52L82 66L50 80L18 66Z', '#6FBE4F', ST('#6FBE4F')) + P('M18 66L50 80V92L18 78Z', '#3E8F3A', ST('#3E8F3A')) + P('M82 66L50 80V92L82 78Z', '#4FA847', ST('#4FA847'));
    s += L('M30 59L62 73M38 55L70 69', '#8ED16A', 1.4) + L('M34 70V82M42 73V85M58 79V91M66 75V87', '#2E6F2C', 1.3);
    s += L('M50 80V92', '#D9C58A', 2.4) + L('M18 72L50 86L82 72', '#D9C58A', 2.2) + L('M50 52L50 80', '#D9C58A', 2.2) + L('M34 59L66 73', '#D9C58A', 1.8) + C(50, 66, 3.4, RED, ST(RED));
    return s + P('M70 40L90 48L70 56L50 48Z', '#6FBE4F', ST('#6FBE4F') + ' opacity=".0"') + P('M68 34L84 41L68 48L52 41Z', '#7ED04F', ST('#6FBE4F')) + P('M52 41L68 48V58L52 51Z', '#3E8F3A') + P('M84 41L68 48V58L84 51Z', '#4FA847') + L('M60 38L76 45', '#D9C58A', 1.4) + C(68, 46, 1.8, RED);
  };
  DECO.tet_d3 = function () {
    return SH(18) + R(46, 20, 6, 70, 2, '#8A5A2E', ST('#8A5A2E')) + L('M49 22H74', '#8A5A2E', 4) + L('M74 22v6', '#C98A00', 1.6)
      + R(68, 28, 12, 4, 2, GOLD, ST(GOLD)) + E(74, 46, 14, 16, RED, 0, ST(RED)) + E(74, 46, 7, 16, '#FF5A66') + L('M74 30V62M64 36Q60 46 64 56M84 36Q88 46 84 56', RED2, 1.2) + R(68, 60, 12, 4, 2, GOLD, ST(GOLD)) + L('M74 64v14', GOLD, 1.6) + C(74, 80, 2.6, RED, ST(RED)) + L('M72 80l-2 8M76 80l2 8', GOLD, 1.4) + C(70, 40, 2.4, 'rgba(255,255,255,.5)');
  };
  DECO.tet_d4 = function () {
    var s = SH(28) + L('M20 90V12M80 90V12', '#6B4121', 3), side = function (x) { return R(x, 14, 22, 70, 3, RED, ST(RED)) + R(x + 2, 16, 18, 66, 2, 'none', ' stroke="' + GOLD + '" stroke-width="1.4"') + L('M' + (x + 6) + ' 24h10M' + (x + 11) + ' 24v10M' + (x + 6) + ' 40q5 -5 10 0M' + (x + 6) + ' 48q5 5 10 0M' + (x + 11) + ' 56v8M' + (x + 6) + ' 72h10', GOLD, 1.8); };
    return s + side(24) + side(54) + L('M20 12H80', '#6B4121', 3) + C(50, 24, 8, GOLD, ST(GOLD)) + blos(50, 24, 6, '#FF8FB8', RED) + L('M50 32V60', RED, 2) + P('M50 60l-5 8 5 -2 5 2z', GOLD);
  };
  DECO.tet_d5 = function () {
    var s = SH(18) + R(42, 66, 16, 24, 3, RED, ST(RED)) + R(40, 62, 20, 6, 2, GOLD, ST(GOLD)) + R(44, 78, 12, 3, 0, GOLD), cols = ['#FFD23F', '#FF5A8A', '#4FD6FF', '#9BFF7A', '#FF9A1F'], i, j;
    for (j = 0; j < 2; j++) { var cx = j ? 70 : 32, cy = j ? 30 : 38, n = 10; for (i = 0; i < n; i++) { var a = i * 360 / n * rad, c = cols[(i + j * 2) % 5]; s += L('M' + (cx + Math.cos(a) * 5).toFixed(1) + ' ' + (cy + Math.sin(a) * 5).toFixed(1) + 'L' + (cx + Math.cos(a) * 15).toFixed(1) + ' ' + (cy + Math.sin(a) * 15).toFixed(1), c, 2.4) + C((cx + Math.cos(a) * 19).toFixed(1), (cy + Math.sin(a) * 19).toFixed(1), 2.2, c); } s += C(cx, cy, 3, '#fff'); }
    s += L('M50 62Q52 50 50 40', '#FFB02E', 1.8, ' stroke-dasharray="2 3"') + star(50, 22, 6, 2.6, 4, GOLD) + C(50, 22, 12, GOLD, ' opacity=".2"') + C(14, 20, 1.6, '#fff') + C(88, 14, 1.6, '#fff') + C(84, 56, 1.4, '#fff') + C(16, 58, 1.4, '#fff');
    return s;
  };
  DECO.tt_d1 = function () {
    return SH(18) + R(48, 56, 4.4, 36, 2, '#8A5A2E', ST('#8A5A2E')) + star(50, 36, 34, 15, 5, '#E5334B', ST(RED)) + star(50, 36, 26, 11, 5, '#FFD23F') + star(50, 36, 17, 7.5, 5, '#FF7A3D') + C(50, 36, 6, '#FFF3A0', ST('#C98A00')) + L('M50 70v8', GOLD, 1.6) + L('M46 78h8M47 82h6', RED, 1.6) + C(50, 34, 40, '#FFD23F', ' opacity=".10"');
  };
  DECO.tt_d2 = function () {
    var s = SH(24) + R(30, 82, 40, 8, 2, '#6B4121', ST('#6B4121')) + R(34, 34, 32, 50, 3, '#FFB02E', ST('#C98A00')) + R(37, 38, 26, 42, 2, '#FFE9A0') + R(30, 30, 40, 5, 2, RED, ST(RED)) + P('M26 30L50 10L74 30Z', RED, ST(RED)) + P('M32 24L50 8L68 24Z', '#C62840', ST(RED)) + C(50, 8, 3, GOLD, ST(GOLD)) + L('M34 40V82M66 40V82M50 36V82', '#C98A00', 1.6);
    s += P('M42 70q2 -6 6 -6l3 -3l2 3q5 0 6 5l-3 4l-12 0z', '#7A3B0B') + P('M40 52l3 -8l3 8z', '#7A3B0B') + C(43, 41, 2.4, '#7A3B0B') + P('M57 56l4 -6l3 6l-2 4l-5 0z', '#7A3B0B') + C(61, 48, 2.2, '#7A3B0B');
    return s + L('M50 82v6', GOLD, 1.6) + C(50, 40, 34, '#FFD23F', ' opacity=".12"');
  };
  DECO.tt_d3 = function () {
    var s = SH(26) + E(50, 84, 38, 8, '#E8D6A8', ST('#C9B27A')) + E(50, 82, 30, 5, '#F7ECC8') + C(36, 62, 22, '#B8651F', ST('#8A4A12')) + C(36, 62, 17, '#D9863A') + C(36, 62, 7, '#B8651F', ST('#8A4A12')) + blos(36, 62, 6, '#E5A25A', '#8A4A12'), i;
    for (i = 0; i < 12; i++) { var a = i * 30 * rad; s += C((36 + Math.cos(a) * 19.4).toFixed(1), (62 + Math.sin(a) * 19.4).toFixed(1), 1.4, '#8A4A12'); }
    s += C(68, 66, 20, '#B8651F', ST('#8A4A12')) + P('M68 66L68 46A20 20 0 0 1 88 66Z', '#5A2E14') + C(68, 66, 9, '#FFD23F', ST('#C98A00')) + C(65, 63, 2.4, '#FFF2A8') + L('M68 66V46M68 66H88', '#8A4A12', 1.2) + C(68, 66, 20, 'none', ST('#8A4A12')) + L('M54 50Q60 44 66 46', 'rgba(255,255,255,.4)', 2.2);
    return s;
  };
  DECO.tt_d4 = function () {
    return SH(30) + E(50, 80, 38, 11, '#8A5A2E', ST('#8A5A2E')) + E(50, 77, 34, 9, '#D9A648', ST('#B8860B')) + E(50, 76, 28, 7, '#F2C766')
      + C(36, 62, 12, '#F4E57A', ST('#C9B030')) + C(33, 59, 3, 'rgba(255,255,255,.55)') + C(56, 66, 10, '#F26A21', ST('#F26A21')) + P('M56 57l3 -3l1 4z', '#3E9B4F')
      + C(72, 70, 8, '#B8651F', ST('#8A4A12')) + C(72, 70, 4, '#FFD23F') + C(24, 72, 6, '#B8651F', ST('#8A4A12'))
      + R(46, 44, 8, 4, 1, GOLD) + R(48, 28, 4, 20, 1, '#8A5A2E') + star(50, 22, 14, 6, 5, RED, ST(RED)) + star(50, 22, 8, 3.6, 5, GOLD) + C(40, 74, 4, '#8E44AD', ST('#8E44AD')) + C(44, 76, 4, '#9B59B6', ST('#8E44AD')) + C(42, 72, 3.6, '#B07AD0');
  };
  DECO.tt_d5 = function () {
    var s = SH(24) + R(26, 78, 48, 12, 3, '#B8863B', ST('#8A5A2E')) + R(30, 82, 40, 3, 1, '#8A5A2E');
    // bé chim vàng
    s += L('M34 80V44', '#C9A064', 2.4) + E(34, 38, 10, 8, '#FFD23F', 0, ST(GOLD)) + C(41, 33, 6, '#FFD23F', ST(GOLD)) + P('M46 33l6 2l-6 2z', '#FF7A3D') + C(42, 32, 1.4, INK) + P('M26 40Q20 34 24 30Q28 36 30 40Z', '#FFB02E');
    // cá đỏ
    s += L('M50 80V50', '#C9A064', 2.4) + E(50, 42, 11, 7, '#E5334B', 0, ST(RED)) + P('M60 42L70 36V48Z', '#FF7A7A', ST(RED)) + C(45, 40, 1.6, '#fff') + C(45, 40, .8, INK) + L('M50 38v8M54 38v8', '#B71C2C', 1);
    // thỏ xanh lá / ếch
    s += L('M66 80V52', '#C9A064', 2.4) + E(66, 46, 9, 8, '#6FD36B', 0, ST('#6FD36B')) + E(60, 36, 3, 8, '#6FD36B', -14) + E(72, 36, 3, 8, '#6FD36B', 14) + C(63, 45, 1.5, INK) + C(69, 45, 1.5, INK) + L('M64 50q2 2 4 0', INK, 1) + C(66, 46, 12, '#FFD23F', ' opacity="0"');
    return s + C(30, 86, 1.8, '#FF7A3D') + C(60, 86, 1.8, '#4FB4FF');
  };
  DECO.nl_d1 = function () {
    var s = SH(28) + R(18, 62, 36, 28, 3, '#E5334B', ST(RED)) + R(34, 62, 5, 28, 0, GOLD) + R(18, 74, 36, 5, 0, GOLD) + P('M36 62Q26 50 30 60Q34 62 36 62ZM36 62Q46 50 42 60Q38 62 36 62Z', GOLD, ST(GOLD)) + C(36, 62, 3, '#C98A00');
    s += R(52, 70, 30, 20, 3, '#2E8B57', ST('#2E8B57')) + R(64, 70, 5, 20, 0, RED) + R(52, 78, 30, 4, 0, RED) + P('M66 70Q58 62 61 69ZM66 70Q74 62 71 69Z', RED, ST(RED)) + C(66, 70, 2.4, RED2);
    s += R(34, 40, 24, 22, 3, '#4F8BF0', ST('#4F8BF0')) + R(44, 40, 4, 22, 0, '#fff') + R(34, 49, 24, 4, 0, '#fff') + P('M46 40Q38 32 41 39ZM46 40Q54 32 51 39Z', '#fff', ST('#9DB6E0')) + C(46, 40, 2.2, '#C8D6F0');
    return s + L('M24 66l5 0', 'rgba(255,255,255,.4)', 2);
  };
  DECO.nl_d2 = function () {
    return SH(26) + C(50, 76, 20, '#F7FBFF', ST('#B8CFE6')) + C(50, 52, 15, '#F7FBFF', ST('#B8CFE6')) + C(50, 33, 11, '#FFFFFF', ST('#B8CFE6')) + C(43, 70, 5, 'rgba(180,205,235,.35)')
      + L('M36 52L16 40M64 52L84 40M16 40l-5 -3M16 40l-1 -6M84 40l5 -3M84 40l1 -6', '#6B4121', 3) + P('M36 24H64L60 12H40Z', '#2A2A34') + R(34, 24, 32, 4, 2, '#2A2A34') + R(40, 22, 20, 3, 0, RED)
      + C(46, 31, 1.6, INK) + C(54, 31, 1.6, INK) + P('M50 34L62 36L50 38Z', '#FF8A1F') + L('M44 38q6 4 12 0', INK, 1) + R(36, 42, 28, 6, 3, RED, ST(RED)) + R(56, 44, 6, 16, 2, '#C62828') + C(50, 58, 2, INK) + C(50, 66, 2, INK) + C(50, 74, 2, INK);
  };
  DECO.nl_d3 = function () {
    return SH(18) + R(20, 18, 5, 72, 2, '#8A5A2E', ST('#8A5A2E')) + L('M22 20H62', '#8A5A2E', 4) + L('M56 20v6', '#C98A00', 1.6)
      + P('M46 26H66V56Q66 66 76 68Q84 70 80 80Q76 88 66 86Q46 82 46 60Z', RED, ST(RED)) + R(43, 22, 26, 9, 4, '#fff', ST('#B8CFE6')) + P('M52 36h6v4h-6z', '#FFD23F') + C(55, 48, 3, GOLD, ST(GOLD)) + C(56, 60, 3, '#2E8B57') + L('M50 70Q56 78 70 82', '#fff', 2) + C(72, 80, 4, GOLD)
      + star(54, 12, 5, 2.2, 5, GOLD) + P('M60 24L70 18L72 24Z', '#2E8B57');
  };
  DECO.nl_d4 = function () {
    var s = SH(24) + L('M26 90L50 40L74 90', '#8A5A2E', 4) + L('M34 74H66', '#8A5A2E', 3), i;
    s += C(50, 46, 28, '#2E8B57', ST('#2E8B57')) + C(50, 46, 16, 'rgba(0,0,0,0)', ' stroke="#F4EBD0" stroke-width="0"');
    for (i = 0; i < 16; i++) { var a = i * 22.5; s += leaf(50 + Math.cos(a * rad) * 24, 46 + Math.sin(a * rad) * 24, a + 90, 10, i % 2 ? '#3FA45B' : '#256B3E'); }
    s += '<circle cx="50" cy="46" r="16" fill="none" stroke="#2B7A45" stroke-width="10"/>' + '<circle cx="50" cy="46" r="11" fill="#E8F2E4" opacity=".0"/>';
    [[34, 40], [62, 34], [66, 56], [40, 62], [50, 28], [32, 54]].forEach(function (p) { s += C(p[0], p[1], 2.8, RED, ST(RED)); });
    return s + P('M50 66L36 58Q34 70 44 70ZM50 66L64 58Q66 70 56 70Z', RED, ST(RED)) + C(50, 66, 4, RED2) + P('M50 68L44 82M50 68L56 82', RED, ' stroke="' + RED2 + '" stroke-width="1.4"');
  };
  DECO.nl_d5 = function () {
    var cane = function (x, h, lean) { var d = 'M' + x + ' 90V' + (90 - h) + 'Q' + x + ' ' + (82 - h) + ' ' + (x + 8 + lean) + ' ' + (84 - h) + 'Q' + (x + 14 + lean) + ' ' + (88 - h) + ' ' + (x + 12 + lean) + ' ' + (96 - h); return '<path d="' + d + '" fill="none" stroke="#B71C1C" stroke-width="11" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + RED + '" stroke-width="8" stroke-dasharray="5 5" stroke-linecap="butt"/>'; };
    return SH(26) + cane(28, 52, 0) + cane(50, 64, 0) + cane(72, 46, 0) + P('M36 78Q46 70 56 78L52 82Q46 76 40 82Z', '#2E8B57', ST('#2E8B57')) + C(46, 78, 2.6, RED, ST(RED));
  };

  /* ═══════════ THÚ CƯNG ═══════════ */
  PET.tet_p1 = function () {
    var s = SH(24) + R(34, 82, 10, 9, 3, GOLD, ST(GOLD)) + R(56, 82, 10, 9, 3, GOLD, ST(GOLD)) + P('M72 78Q88 74 84 56Q80 68 68 70Z', GOLD, ST(GOLD)) + P('M28 90Q26 68 38 62H62Q74 68 72 90Z', RED, ST(RED)) + L('M30 80H70', GOLD, 3.4) + L('M32 86h36', '#FFB02E', 2), i;
    for (i = 0; i < 14; i++) { var a = (-190 + i * 14.6) * rad; s += '<g transform="translate(50 42) rotate(' + (a / rad + 90) + ')">' + P('M-5 -22L0 -34L5 -22Z', i % 2 ? GOLD : '#FFB02E', ST(GOLD)) + '</g>'; }
    return s + C(30, 30, 7, RED, ST(RED)) + C(70, 30, 7, RED, ST(RED)) + C(30, 30, 3.4, GOLD) + C(70, 30, 3.4, GOLD) + C(50, 44, 22, RED, ST(RED)) + P('M50 20L45 30H55Z', GOLD, ST(GOLD)) + C(50, 21, 1.8, '#fff')
      + C(40, 40, 7, '#fff', ST('#888')) + C(60, 40, 7, '#fff', ST('#888')) + C(41, 41, 3.6, INK) + C(59, 41, 3.6, INK) + C(42, 39.5, 1.2, '#fff') + C(60, 39.5, 1.2, '#fff')
      + L('M33 32Q40 28 46 32M54 32Q60 28 67 32', GOLD, 2.4) + C(32, 50, 4, '#FF8A9A', ' opacity=".7"') + C(68, 50, 4, '#FF8A9A', ' opacity=".7"') + E(50, 48, 4, 3, GOLD) + P('M34 54Q50 74 66 54Q50 62 34 54Z', '#fff', ST('#CFCFCF')) + L('M44 58q6 4 12 0', RED2, 1.4);
  };
  PET.tet_p2 = function () {
    return SH(24) + P('M28 90Q26 62 50 58Q74 62 72 90Z', '#FFFFFF', ST('#B8C4D6')) + P('M38 66Q50 74 62 66L60 78Q50 84 40 78Z', RED, ST(RED)) + C(50, 79, 4.4, GOLD, ST(GOLD)) + L('M50 75v8', GOLD2, 1)
      + E(34, 74, 6, 8, '#fff', 0, ST('#B8C4D6')) + E(70, 66, 11, 14, GOLD, 0, ST(GOLD2)) + L('M66 62h8M66 66h8M66 70h8', GOLD2, 1.2) + E(74, 48, 6, 12, '#fff', -18, ST('#B8C4D6')) + C(76, 40, 2.2, '#FFB7C8') + E(78, 50, 2.6, 1.6, '#FFB7C8', 0, ' opacity="0"')
      + P('M32 32L30 18L42 26Z', '#fff', ST('#B8C4D6')) + P('M68 32L70 18L58 26Z', '#fff', ST('#B8C4D6')) + P('M33 28L33 22L38 26Z', '#FFB7C8') + P('M67 28L67 22L62 26Z', '#FFB7C8') + C(50, 44, 20, '#fff', ST('#B8C4D6')) + E(60, 36, 8, 6, '#F2A24A') + C(32, 50, 3.6, '#FFB7C8', ' opacity=".6"') + C(68, 50, 3.6, '#FFB7C8', ' opacity=".6"')
      + L('M38 44q3 -4 6 0M56 44q3 -4 6 0', INK, 2) + E(50, 49, 2.6, 1.8, '#FF8FA3') + L('M50 51v3M44 55q3 3 6 0q3 3 6 0', INK, 1.3) + L('M28 50l-8 -2M28 53l-8 2M72 50l8 -2M72 53l8 2', '#9AA7B8', 1) + star(50, 24, 4, 1.8, 4, GOLD);
  };
  PET.tet_p3 = function () {
    return SH(22) + L('M42 84L38 92M52 84L52 92', '#FFB02E', 2) + P('M30 66L6 78L14 66L4 62L32 60Z', '#1E2F5C', ST('#1E2F5C')) + E(48, 62, 23, 14, '#1E2F5C', -8, ST('#1E2F5C')) + E(46, 68, 16, 8, '#F7F1E3', -8) + P('M30 54Q22 26 54 32Q52 46 42 58Z', '#2E478C', ST('#1E2F5C')) + P('M34 52Q30 38 46 36', 'none', ' stroke="#4F6FB8" stroke-width="1.4"')
      + C(66, 52, 11, '#1E2F5C', ST('#1E2F5C')) + E(68, 58, 8, 5, '#E8643A') + P('M76 50L86 53L76 56Z', '#FFB02E', ST('#C98A00')) + C(70, 49, 2.4, '#fff') + C(70.6, 49, 1.2, INK) + P('M58 44L64 40L66 46Z', '#2E478C');
  };
  var PA = function () { return (CAT && CAT.PETART) || {}; };
  PET.tt_p1 = function () { var f = PA().bunny; return SH(24) + (f ? f('#FFFFFF', '#FFC7DD', 'glow+star') : '') + star(78, 24, 6, 2.6, 4, '#FFF3B0'); };
  PET.tt_p2 = function () { var f = PA().fish; return SH(24) + (f ? f('#FF5A36', '#FFD23F', 'glow') : '') + L('M50 10V22', GOLD2, 1.4) + C(50, 8, 2.4, RED, ST(RED)); };
  PET.tt_p3 = function () { var f = PA().lizard; return SH(24) + (f ? f('#E5483A', '#FFD23F', 'antlers+glow') : ''); };
  PET.nl_p1 = function () { var f = PA().hoof; return SH(24) + (f ? f('#A8703C', '#F2D2A0', 'antlers') : '') + C(91, 31, 3.8, '#E5334B', ST(RED)) + C(89.8, 29.8, 1.1, 'rgba(255,255,255,.75)'); };
  PET.nl_p2 = function () { var f = PA().bear; return SH(24) + (f ? f('#F4F8FF', '#D8283A', 'scarf') : ''); };
  PET.nl_p3 = function () { var f = PA().owl; return SH(24) + (f ? f('#F7FAFF', '#9FB8D8', 'hat') : ''); };
})(typeof window !== 'undefined' ? window : this);
