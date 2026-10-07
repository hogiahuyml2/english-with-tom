/* EWT Garden — bộ vẽ ĐỒ TRANG TRÍ theo "đế + biểu tượng": mỗi món = một kiểu đế (đèn, tượng, cổng vòm, biển, đài phun…) gắn một biểu tượng
   (vỏ sò, bông tuyết, ngọn lửa, bánh răng…) với hai màu riêng của khu. Hơn 20 kiểu đế × gần 30 biểu tượng → mỗi món một dáng khác nhau. Nạp SAU garden-gen1.js. */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, CAT = root.EWTGardenCatalog; if (!A || !CAT) return;
  var K = A.K, C = K.C, E = function (x, y, rx, ry, f, rot, ex) { if (typeof rot === 'string') { ex = rot; rot = 0; } return K.E(x, y, rx, ry, f, rot, ex); }, R = K.R, P = K.P, L = K.L, SH = K.SH, shade = A.shade, DECO = A.DECO, rad = Math.PI / 180;
  function cs(a) { return Math.cos(a * rad); } function sn(a) { return Math.sin(a * rad); }
  function G(x, y, inner, rot, sc) { return '<g transform="translate(' + x + ' ' + y + ')' + (rot ? ' rotate(' + rot + ')' : '') + (sc ? ' scale(' + sc + ')' : '') + '">' + inner + '</g>'; }
  var ST = ' stroke="rgba(0,0,0,.2)" stroke-width="1.2"';

  /* ═════════ BIỂU TƯỢNG (vẽ quanh gốc (0,0), bán kính ≈ 10) ═════════ */
  var EM = {
    shell: function (c, d) { var s = P('M0 9Q-12 4 -11 -3Q-8 -11 0 -11Q8 -11 11 -3Q12 4 0 9Z', c, ST), i; for (i = -3; i <= 3; i++) s += L('M0 8L' + (i * 3.4) + ' -9', d, 1); return s + R(-4, 8, 8, 3, 1.4, d); },
    star: function (c, d) { var p = [], i; for (i = 0; i < 10; i++) { p.push((cs(-90 + i * 36) * (i % 2 ? 4.4 : 11)).toFixed(1) + ',' + (sn(-90 + i * 36) * (i % 2 ? 4.4 : 11)).toFixed(1)); } return '<polygon points="' + p.join(' ') + '" fill="' + c + '"' + ST + '/>'; },
    snow: function (c, d) { var s = '', i; for (i = 0; i < 3; i++) s += G(0, 0, L('M0 -11V11M-3 -8L0 -5L3 -8M-3 8L0 5L3 8', c, 2), i * 60); return s + C(0, 0, 2.4, d); },
    leaf: function (c, d) { return P('M-9 8Q-10 -8 8 -10Q10 6 -9 8Z', c, ST) + L('M-8 7Q0 0 6 -8', d, 1.6); },
    flame: function (c, d) { return P('M0 11Q-11 6 -8 -4Q-5 -1 -4 -8Q0 -12 2 -5Q8 -2 8 4Q6 11 0 11Z', c, ST) + P('M0 10Q-5 7 -3 2Q0 4 1 -2Q5 2 4 6Q3 10 0 10Z', d); },
    gear: function (c, d) { var s = '', i; for (i = 0; i < 8; i++) s += G(0, 0, R(-2.4, -11.4, 4.8, 5, 1, c), i * 45); return s + C(0, 0, 8, c, ST) + C(0, 0, 3.4, d); },
    fish: function (c, d) { return P('M-10 0Q-2 -8 7 -2L12 -7L12 7L7 2Q-2 8 -10 0Z', c, ST) + C(-5, -1.6, 1.6, d) + L('M0 -4Q2 0 0 4', d, 1.2); },
    sun: function (c, d) { var s = '', i; for (i = 0; i < 10; i++) s += G(0, 0, L('M0 -8V-12', c, 2), i * 36); return s + C(0, 0, 6.4, c, ST) + C(-1.6, -1.6, 2, d); },
    moon: function (c, d) { return '<path d="M4 -10A11 11 0 1 0 4 10A8.5 8.5 0 1 1 4 -10Z" fill="' + c + '"' + ST + '/>'; },
    crown: function (c, d) { return P('M-10 8L-12 -6L-5 0L0 -9L5 0L12 -6L10 8Z', c, ST) + C(-12, -7, 1.8, d) + C(0, -10, 1.8, d) + C(12, -7, 1.8, d) + L('M-9 5H9', d, 1.4); },
    anchor: function (c, d) { return L('M0 -8V9M-5 -3H5M-9 3Q-8 10 0 10Q8 10 9 3', c, 2.4) + C(0, -9, 2.6, 'none').replace('fill="none"', 'fill="none" stroke="' + c + '" stroke-width="1.8"'); },
    flower: function (c, d) { var s = '', i; for (i = 0; i < 5; i++) s += C(cs(-90 + i * 72) * 6, sn(-90 + i * 72) * 6, 4.2, c, ST); return s + C(0, 0, 3.4, d); },
    paw: function (c, d) { return E(0, 4, 6.4, 5.4, c, 0, ST) + C(-7, -3, 2.8, c, ST) + C(-2.4, -8, 2.8, c, ST) + C(2.4, -8, 2.8, c, ST) + C(7, -3, 2.8, c, ST); },
    heart: function (c, d) { return P('M0 9Q-12 0 -9 -6Q-5 -11 0 -5Q5 -11 9 -6Q12 0 0 9Z', c, ST); },
    diamond: function (c, d) { return P('M0 -11L9 -3L0 11L-9 -3Z', c, ST) + P('M-9 -3H9L0 -11Z', shade(c, .3)) + L('M-3 -3L0 11L3 -3', d, 1); },
    wave: function (c, d) { return L('M-11 -4Q-7 -9 -3 -4T5 -4T11 -4M-11 3Q-7 -2 -3 3T5 3T11 3', c, 2.4); },
    cloud: function (c, d) { return C(-5, 2, 5, c) + C(1, -2, 6.4, c) + C(7, 2, 4.6, c) + R(-10, 2, 20, 5, 2.5, c); },
    note: function (c, d) { return L('M3 8V-8L10 -5', c, 2.4) + E(0, 8, 4.4, 3.4, c, -20); },
    eye: function (c, d) { return P('M-11 0Q0 -10 11 0Q0 10 -11 0Z', c, ST) + C(0, 0, 4.4, d) + C(0, 0, 2, '#222') + C(-1, -1, 1, '#fff'); },
    key: function (c, d) { return C(-5, 0, 4.6, 'none').replace('fill="none"', 'fill="none" stroke="' + c + '" stroke-width="2.6"') + L('M0 0H11M7 0V5M10 0V4', c, 2.4); },
    feather: function (c, d) { return P('M-8 9Q-12 -6 6 -11Q10 4 -8 9Z', c, ST) + L('M-8 9L5 -8', d, 1.4) + L('M-3 3L-9 2M0 -1L-6 -2M3 -5L-2 -6', d, 1); },
    drop: function (c, d) { return P('M0 -11Q9 0 8 4Q6 10 0 10Q-6 10 -8 4Q-9 0 0 -11Z', c, ST) + E(-3, 3, 2, 3.4, d, 20); },
    bolt: function (c, d) { return P('M3 -11L-6 2H0L-3 11L8 -3H2Z', c, ST); },
    skull: function (c, d) { return P('M-9 2Q-10 -10 0 -10Q10 -10 9 2Q8 5 5 6V10H-5V6Q-8 5 -9 2Z', c, ST) + C(-3.6, -1, 2.8, d) + C(3.6, -1, 2.8, d) + P('M0 3L-1.6 6H1.6Z', d); },
    spiral: function (c, d) { return '<path d="M0 0Q3 -2 3 1Q3 5 -2 5Q-8 5 -8 -1Q-8 -8 0 -9Q9 -9 10 0Q10 10 0 11" fill="none" stroke="' + c + '" stroke-width="2.4" stroke-linecap="round"/>'; },
    cactus: function (c, d) { return R(-3, -10, 6, 20, 3, c, ST) + P('M-3 1H-7Q-9 1 -9 -2V-5', 'none', ' stroke="' + c + '" stroke-width="3.4" stroke-linecap="round"') + P('M3 -1H7Q9 -1 9 -4V-7', 'none', ' stroke="' + c + '" stroke-width="3.4" stroke-linecap="round"') + C(0, -10, 2, d); },
    palm: function (c, d) { var s = P('M-1 10Q-3 0 0 -4H2Q0 0 1 10Z', d), i; for (i = 0; i < 5; i++) s += G(1, -4, P('M0 0Q7 -7 14 0Q7 -2 0 0Z', c), -80 + i * 40); return s; },
    mountain: function (c, d) { return P('M-12 9L-3 -8L2 0L6 -5L12 9Z', c, ST) + P('M-3 -8L-6 -3L-3 -4L0 -2Z', '#fff'); },
    bell: function (c, d) { return P('M-8 6Q-8 -2 -6 -6Q0 -12 6 -6Q8 -2 8 6Z', c, ST) + R(-9, 5, 18, 3, 1.4, d) + C(0, 10, 2.4, d) + C(0, -11, 1.6, d); },
    wheel: function (c, d) { var s = '', i; for (i = 0; i < 8; i++) s += G(0, 0, L('M0 0V-12', c, 2) + C(0, -12, 1.8, c), i * 45); return s + C(0, 0, 8, 'none').replace('fill="none"', 'fill="none" stroke="' + c + '" stroke-width="2"') + C(0, 0, 2.6, d); },
    sail: function (c, d) { return P('M0 -11L0 9L-11 9Z', c, ST) + P('M2 -8L2 9L10 9Z', shade(c, -.15), ST) + L('M0 -12V11', d, 1.4); },
    bone: function (c, d) { return L('M-8 0H8', c, 4) + C(-9, -2.4, 2.8, c) + C(-9, 2.4, 2.8, c) + C(9, -2.4, 2.8, c) + C(9, 2.4, 2.8, c); },
    pearl: function (c, d) { return C(0, 0, 8, c, ST) + C(-2.6, -2.6, 2.6, '#fff'); },
    lotus: function (c, d) { var s = '', i; [-38, -18, 0, 18, 38].forEach(function (a, k) { s += G(0, 8, P('M0 0Q-5 -8 0 -16Q5 -8 0 0Z', k === 2 ? c : shade(c, k % 2 ? .08 : -.08), ST), a); }); return s + E(0, 9, 11, 2.4, d); },
    bamboo: function (c, d) { return R(-3, -11, 6, 22, 2, c, ST) + L('M-3 -3H3M-3 5H3', d, 1.6) + P('M3 -6Q9 -8 11 -4Q6 -2 3 -6Z', d); },
    paper: function (c, d) { return R(-8, -9, 16, 18, 2, c, ST) + L('M-5 -4H5M-5 0H5M-5 4H2', d, 1.4); },
    tooth: function (c, d) { return P('M-7 -9Q0 -12 7 -9Q9 0 4 10Q2 4 0 10Q-2 4 -4 10Q-9 0 -7 -9Z', c, ST); }
  };
  CAT.EMBLEM = EM;
  function em(name, x, y, s, c, d) { var f = EM[name] || EM.star; return G(x, y, f(c, d), 0, s / 10); }

  /* ═════════ ĐẾ (trả về [svg, x, y, cỡ biểu tượng]) ═════════ */
  var wood = '#B8733A', woodD = '#8A5A2E', stone = '#C9D0D9', stoneD = '#9AA3AE';
  var B = {
    lamp: function (c, d) { return [R(44, 62, 12, 26, 3, '#3B4252') + R(46, 26, 8, 40, 2, '#4C566A') + R(36, 18, 28, 12, 3, c, ST) + P('M32 18L50 6L68 18Z', c, ST) + R(40, 22, 20, 12, 3, '#FFE9A8', ' opacity=".9"') + C(50, 28, 16, '#FFF2B0', ' opacity=".28"'), 50, 28, 8]; },
    pedestal: function (c, d) { return [R(30, 78, 40, 10, 2, stoneD, ST) + R(36, 66, 28, 14, 2, stone, ST) + R(42, 40, 16, 28, 2, shade(stone, .1), ST) + R(36, 32, 28, 10, 3, stone, ST), 50, 22, 14]; },
    planter: function (c, d) { return [P('M24 60L30 88H70L76 60Z', c, ST) + E(50, 60, 26, 6, shade(c, -.2)) + E(50, 59, 22, 4, '#6B4A2B') + L('M40 58Q36 40 30 34M50 58V30M60 58Q64 40 70 34', '#4FAE4A', 3) + C(30, 34, 5, '#FF8FB8') + C(50, 30, 5, '#FFD23F') + C(70, 34, 5, '#B48CFF'), 50, 74, 8]; },
    arch: function (c, d) { return [R(22, 30, 10, 58, 3, c, ST) + R(68, 30, 10, 58, 3, c, ST) + P('M22 38Q50 -4 78 38V48Q50 8 22 48Z', c, ST) + L('M30 50V86M70 50V86', shade(c, -.2), 1.4), 50, 24, 9]; },
    banner: function (c, d) { return [R(48, 10, 4, 80, 2, woodD) + C(50, 9, 4, '#F2C94C') + P('M52 14H80V54L66 46L52 54Z', c, ST) + P('M52 14H80V20H52Z', shade(c, -.2)), 66, 32, 8]; },
    sign: function (c, d) { return [R(46, 48, 8, 42, 2, woodD) + R(18, 24, 64, 32, 7, c, ST) + R(23, 29, 54, 22, 4, shade(c, .22)), 50, 40, 9]; },
    fountain: function (c, d) { return [E(50, 82, 34, 9, stoneD, ST) + E(50, 79, 30, 7, '#79D4F5') + R(44, 50, 12, 28, 4, stone, ST) + E(50, 50, 20, 6, stoneD) + E(50, 48, 17, 4, '#8EDDFA') + L('M50 48Q44 30 38 36M50 48Q56 30 62 36M50 48V26', '#B8E8FF', 2.4), 50, 24, 8]; },
    totem: function (c, d) { return [R(34, 70, 32, 20, 3, shade(c, -.2), ST) + R(36, 46, 28, 24, 3, c, ST) + R(36, 22, 28, 24, 3, shade(c, .12), ST) + P('M30 22L70 22L50 8Z', shade(c, -.1), ST), 50, 58, 10]; },
    chest: function (c, d) { return [R(22, 52, 56, 34, 4, c, ST) + P('M22 52Q22 36 50 36Q78 36 78 52Z', shade(c, .12), ST) + R(22, 56, 56, 5, 0, d) + R(46, 52, 8, 12, 2, '#F2C94C', ST) + L('M32 52V86M68 52V86', shade(c, -.25), 2), 50, 74, 8]; },
    barrel: function (c, d) { return [P('M26 44Q20 66 26 88H74Q80 66 74 44Q50 36 26 44Z', c, ST) + L('M24 56Q50 62 76 56M24 78Q50 84 76 78', d, 3.4) + E(50, 42, 24, 6, shade(c, .15), ST), 50, 68, 8]; },
    tent: function (c, d) { return [P('M16 88L50 18L84 88Z', c, ST) + P('M50 18L84 88H64Z', shade(c, -.15)) + P('M40 88L50 56L60 88Z', '#3A2A1A') + L('M50 18V8', woodD, 3) + P('M50 8L62 12L50 16Z', d), 50, 44, 8]; },
    cairn: function (c, d) { return [E(50, 82, 26, 9, stoneD, ST) + E(50, 68, 20, 8, stone, ST) + E(50, 56, 15, 7, shade(stone, .08), ST) + E(50, 46, 10, 6, stone, ST) + E(50, 38, 6, 4.6, stoneD, ST), 50, 66, 7]; },
    parasol: function (c, d) { return [R(48, 30, 4, 60, 2, '#8A8F9A') + P('M12 40Q50 -6 88 40Q69 33 50 40Q31 33 12 40Z', c, ST) + P('M50 18Q42 28 50 40Q58 28 50 18Z', d, ' opacity=".7"'), 50, 31, 8]; },
    bench: function (c, d) { return [R(18, 56, 64, 9, 3, shade(c, .1)) + R(18, 36, 64, 16, 3, c, ST) + R(22, 64, 8, 24, 2, woodD) + R(70, 64, 8, 24, 2, woodD), 50, 44, 8]; },
    well: function (c, d) { return [E(50, 80, 28, 9, stoneD, ST) + R(24, 56, 52, 26, 3, stone, ST) + E(50, 56, 26, 8, '#5A8AA8') + R(26, 30, 5, 28, 1, woodD) + R(69, 30, 5, 28, 1, woodD) + P('M20 32L50 12L80 32Z', c, ST), 50, 28, 7]; },
    obelisk: function (c, d) { return [R(30, 80, 40, 9, 2, stoneD, ST) + P('M38 80L42 24L50 12L58 24L62 80Z', c, ST) + P('M50 12L58 24L62 80H50Z', shade(c, -.14)), 50, 54, 9]; },
    boat: function (c, d) { return [P('M16 70Q50 92 84 70L76 80Q50 90 24 80Z', c, ST) + R(48, 22, 4, 52, 1, woodD) + P('M52 24L80 66H52Z', '#FFF8E8', ST) + P('M48 30L26 66H48Z', shade('#FFF8E8', -.08), ST), 64, 56, 6]; },
    gong: function (c, d) { return [R(22, 20, 6, 70, 2, woodD) + R(72, 20, 6, 70, 2, woodD) + R(18, 18, 64, 7, 3, woodD) + L('M50 25V40', '#8A8F9A', 2) + C(50, 56, 20, c, ST) + C(50, 56, 14, shade(c, .15)), 50, 56, 11]; },
    vase: function (c, d) { return [P('M38 88Q28 62 38 48L40 38H60L62 48Q72 62 62 88Z', c, ST) + R(35, 32, 30, 8, 3, shade(c, .1)) + L('M34 62H66M36 74H64', d, 2.4), 50, 56, 9]; },
    shrine: function (c, d) { return [R(30, 52, 40, 34, 3, '#FBF3DC', ST) + P('M22 54L50 28L78 54Z', c, ST) + R(44, 62, 12, 24, 2, woodD) + R(34, 86, 32, 4, 1, stoneD), 50, 44, 6]; },
    crate: function (c, d) { return [R(24, 50, 52, 38, 3, c, ST) + L('M24 50L76 88M76 50L24 88', shade(c, -.22), 3) + R(24, 50, 52, 6, 0, shade(c, -.15)), 50, 36, 8]; },
    pillar: function (c, d) { return [R(32, 82, 36, 8, 2, stoneD, ST) + R(40, 28, 20, 54, 2, c, ST) + R(34, 20, 32, 10, 3, shade(c, .1), ST) + L('M46 32V80M54 32V80', shade(c, -.18), 1.4), 50, 50, 8]; }
  };
  CAT.DECOBASE = B;

  CAT.eachSpec(function (id, k, sp) {
    if (k !== 'd') return;
    var base = B[sp[1]], emb = sp[2], c = sp[3], d = sp[4];
    if (!base) return;
    DECO[id] = function () { var r = base(c, d); return SH(24) + r[0] + em(emb, r[1], r[2], r[3], d, shade(c, -.3)); };
  });
})(typeof window !== 'undefined' ? window : this);
