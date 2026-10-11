/* EWT Garden — 10 khu văn hoá quốc gia mới (cảnh dựng sẵn): Singapore, Malaysia, Campuchia, Nepal, Jordan, Bỉ, Croatia, Colombia, Tanzania, Scotland.
   Quốc kỳ chuẩn (garden-flags.js) cho Bỉ, Colombia, Scotland. Các nước còn lại KHÔNG vẽ quốc kỳ (chưa đủ chắc thông số / có quốc huy phức tạp) — thay bằng vật phẩm văn hoá. Nạp SAU garden-world13.js. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;
  function tuft(c1, c2) { return function (R, W, H2) { return scatter(R, W, H2, 26, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q4 -9 8 0q4 -9 8 0" stroke="' + (i % 2 ? c1 : c2) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; }); }; }
  function zone(id, g1, g2, c1, c2, dth) { THEME[id] = { g1: g1, g2: g2, ground: tuft(c1, c2) }; DTH[id] = dth; }
  function win(x, y, w, h) { return rect(x, y, w, h, '#CFE8F5', '#6A8AA0', 2) + path('M' + (x + w / 2) + ' ' + y + 'v' + h + 'M' + x + ' ' + (y + h / 2) + 'h' + w, '', '#6A8AA0', 1.6); }
  function palm(x, y, s, c) { return path('M' + x + ' ' + y + 'q' + (6 * s) + ' ' + (-30 * s) + ' ' + (2 * s) + ' ' + (-56 * s), '', '#8A5A2E', 5 * s) + path('M' + (x + 2 * s) + ' ' + (y - 56 * s) + 'q' + (-26 * s) + ' ' + (-4 * s) + ' ' + (-36 * s) + ' ' + (14 * s) + 'M' + (x + 2 * s) + ' ' + (y - 56 * s) + 'q' + (26 * s) + ' ' + (-4 * s) + ' ' + (36 * s) + ' ' + (14 * s) + 'M' + (x + 2 * s) + ' ' + (y - 56 * s) + 'q' + (-14 * s) + ' ' + (-24 * s) + ' ' + (-30 * s) + ' ' + (-14 * s) + 'M' + (x + 2 * s) + ' ' + (y - 56 * s) + 'q' + (14 * s) + ' ' + (-24 * s) + ' ' + (30 * s) + ' ' + (-14 * s), '', c || '#2E8A4F', 4 * s); }
  function tree(x, y, s, c1, c2) { return rect(x - 4 * s, y - 6 * s, 8 * s, 36 * s, '#8A5A2E') + circ(x, y - 18 * s, 22 * s, c1) + circ(x - 14 * s, y - 8 * s, 14 * s, c2) + circ(x + 15 * s, y - 6 * s, 14 * s, c2); }
  function rows(x, y, w, h, nx, ny, col) { var s = '', i, j; for (i = 0; i < nx; i++) for (j = 0; j < ny; j++) s += rect(x + 3 + i * (w - 6) / nx, y + 4 + j * (h - 8) / ny, (w - 6) / nx - 3, (h - 8) / ny - 3, col || '#CFE8F5'); return s; }

  /* ═════════ SINGAPORE ═════════ */
  zone('singapore', '#B8E0A8', '#9CD08C', 'rgba(90,150,80,.5)', 'rgba(200,160,230,.4)', { leaf: ['#5AAA6A', '#6ABA7A', '#8AD08A'], bush: ['#4F9A5A', '#6ABA7A'], rock: ['#C9C2B4', '#DDD6C8'], post: '#B8B8C0', rail: '#A8A8B0' });
  ART.sg_house = function (b) {
    var s = ell(150, 276, 140, 16, '#5BC6E8', '#2E8FB0') + path('M20 276q30 -6 60 0t60 0t60 0t60 0', '', 'rgba(255,255,255,.55)', 3), x;
    [[56, 2], [130, 0], [204, -2]].forEach(function (t) { x = t[0]; s += poly((x) + ',270 ' + (x + 40) + ',270 ' + (x + 40 + t[1]) + ',84 ' + (x + t[1]) + ',84', '#8EC8E8', '#4F8AA8') + rows(x + t[1] * .4, 90, 40, 176, 4, 12, '#E8F4FA') + path('M' + (x + 20 + t[1] * .5) + ' 84V268', '', '#4F8AA8', 2); });
    s += poly('30,80 270,66 262,84 46,94', '#C8D0DC', '#6A7A8A', 3) + path('M46 76Q150 62 262 72', '', '#2E8A4F', 4) + ell(220, 70, 26, 4, '#5BC6E8', '#2E8FB0') + circ(60, 72, 6, '#3F8A3A') + circ(80, 70, 6, '#4FAE62') + circ(100, 70, 5, '#3F8A3A');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.sg_big = function (b) {
    var s = ell(100, 170, 90, 18, '#5BC6E8', '#2E8FB0') + ell(100, 164, 70, 12, '#8EDCF8') + rect(66, 130, 68, 30, '#E8E4D8', '#B8AC9C', 3) + path('M70 130Q60 90 96 70Q96 50 84 40L110 34Q124 36 120 56Q120 76 110 90Q130 110 130 130Z', '#F4F0E4', '#B8AC9C', 3) + path('M122 46Q148 48 156 66', '', '#8EDCF8', 5) + path('M126 54Q146 54 152 74', '', '#C8ECFA', 3) + circ(100, 52, 3, '#2A2A34') + path('M84 100q10 6 20 0M84 112q10 6 20 0M84 124q10 6 20 0', '', '#B8AC9C', 2) + path('M72 154q10 -6 20 0t20 0t20 0', '', 'rgba(255,255,255,.7)', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 190, 90, 6) + s);
  };
  ART.sg_item2 = function (b) {
    var s = path('M50 90V36', '', '#8A8A92', 8) + path('M50 90V36', '', '#B66CFF', 3) + poly('18,34 82,34 70,14 30,14', '#2E8A4F', '#1A5A3A', 2.4) + path('M22 32Q50 44 78 32', '', '#B66CFF', 5) + circ(36, 22, 4, '#FF8AC0') + circ(54, 18, 4, '#FFD23F') + circ(66, 24, 3.4, '#FF8AC0');
    return T(b.x * 100, b.y * 100, shadow(50, 94, 26, 5) + s);
  };
  ART.sg_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 32, 5) + ell(50, 66, 38, 16, '#F4F4F8', '#B8B8C0') + ell(50, 62, 26, 12, '#E5334B', '#8E1228') + path('M26 58q-12 -10 -4 -18M74 58q12 -10 4 -18', '', '#E5334B', 6) + circ(40, 58, 2, '#fff') + circ(60, 58, 2, '#fff') + path('M36 66q14 8 28 0', '', '#8E1228', 2.4)); };

  /* ═════════ MALAYSIA ═════════ */
  zone('malaysia', '#B0E0A0', '#94D088', 'rgba(70,150,80,.5)', 'rgba(230,120,60,.4)', { leaf: ['#3F9A5A', '#4FAE62', '#6ABA7A'], bush: ['#3F8A4A', '#5AAA5A'], rock: ['#B8AC9C', '#D0C8B8'], post: '#B8A88A', rail: '#A89878' });
  ART.my_house = function (b) {
    var s = '', x;
    [60, 168].forEach(function (x0) { x = x0; s += poly((x) + ',270 ' + (x + 72) + ',270 ' + (x + 64) + ',120 ' + (x + 8) + ',120', '#C8D0DC', '#6A7A8A') + rows(x + 8, 124, 56, 140, 5, 14, '#8EC8E8') + poly((x + 8) + ',120 ' + (x + 64) + ',120 ' + (x + 56) + ',92 ' + (x + 16) + ',92', '#B8C0CC', '#6A7A8A') + poly((x + 16) + ',92 ' + (x + 56) + ',92 ' + (x + 46) + ',62 ' + (x + 26) + ',62', '#C8D0DC', '#6A7A8A') + poly((x + 26) + ',62 ' + (x + 46) + ',62 ' + (x + 36) + ',16', '#E8F0F8', '#6A7A8A') + path('M' + (x + 36) + ' 16V4', '', '#6A7A8A', 3); });
    s += rect(132, 150, 36, 12, '#E8F0F8', '#6A7A8A', 3) + path('M132 150l14 -8h8l14 8', '', '#6A7A8A', 2);
    return T(b.x * 100, b.y * 100, shadow(150, 290, 130, 7) + s);
  };
  ART.my_big = function (b) {
    var s = poly('10,170 40,60 100,30 160,60 190,170', '#B8AC9C', '#8A8070', 3) + path('M70 170V110Q100 80 130 110V170Z', '#3A3A42') + path('M64 170L84 150L64 150L84 130L64 130', '', '#8A8A92', 2), i, cols = ['#E5334B', '#F2842E', '#F2C94C', '#4FAE62', '#2B9BD8', '#6A4ACF'];
    for (i = 0; i < 6; i++) s += rect(70 + i * 10, 150 + i * 3.4, 10, 20 - i * 3.4, cols[i]);
    s += rect(94, 120, 12, 26, '#F2C94C', '#C99A1B', 2) + circ(100, 112, 7, '#F2C94C', '#C99A1B') + path('M100 120q-10 4 -16 -2M100 120q10 4 16 -2', '', '#F2C94C', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 90, 6) + s);
  };
  ART.my_item2 = function (b) {
    var s = poly('50,6 84,40 50,72 16,40', '#E5334B', '#8E1228', 2.4) + poly('50,6 84,40 50,40', '#F2C94C', '', 0) + poly('16,40 50,40 50,72', '#2B6BC8') + path('M50 6V72M16 40H84', '', '#8E1228', 2) + path('M50 72q-12 8 0 14t0 12', '', '#E5334B', 3.4) + circ(50, 86, 3, '#F2C94C');
    return T(b.x * 100, b.y * 100, shadow(50, 96, 20, 3) + s);
  };
  ART.my_item = function (b) {
    var s = circ(50, 58, 28, '#8AB84A', '#4A7A2A'), i;
    for (i = 0; i < 12; i++) { var a = i / 12 * Math.PI * 2, x = 50 + Math.cos(a) * 26, y = 58 + Math.sin(a) * 26; s += poly(f0(x - 4) + ',' + f0(y + 3) + ' ' + f0(x) + ',' + f0(y - 8) + ' ' + f0(x + 4) + ',' + f0(y + 3), '#6A9A3A', '#4A7A2A', 1.4); }
    return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + s + path('M36 54q14 -10 28 0M34 66q16 -10 32 0', '', '#C9D84A', 2.4) + path('M50 30v-8', '', '#6A4A2E', 3));
  };

  /* ═════════ CAMPUCHIA ═════════ */
  zone('cambodia', '#C8E0A0', '#B0D488', 'rgba(100,150,60,.5)', 'rgba(230,180,70,.4)', { leaf: ['#4F9A4A', '#6ABA5A', '#8AC86A'], bush: ['#4F8A3A', '#6AAA4A'], rock: ['#B8AC9C', '#D0C8B8'], post: '#B8A88A', rail: '#A89878' });
  ART.kh_house = function (b) {
    var s = ell(150, 280, 140, 14, '#7FC8D8', '#4F9AB0') + rect(30, 232, 240, 28, '#C9B88A', '#8A7A5A', 3) + rect(54, 206, 192, 28, '#BDAC7E', '#8A7A5A', 3) + rect(80, 182, 140, 26, '#B8A674', '#8A7A5A', 3), i, xs = [86, 118, 150, 182, 214];
    xs.forEach(function (x, n) { var hgt = n === 2 ? 130 : 84, w = n === 2 ? 38 : 28; s += rect(x - w / 2, 182 - hgt, w, hgt, '#C9B88A', '#8A7A5A', 3) + path('M' + (x - w / 2) + ' ' + (182 - hgt) + 'Q' + (x - w / 2 - 4) + ' ' + (182 - hgt - 26) + ' ' + x + ' ' + (182 - hgt - 56) + 'Q' + (x + w / 2 + 4) + ' ' + (182 - hgt - 26) + ' ' + (x + w / 2) + ' ' + (182 - hgt), '#B8A674', '#8A7A5A', 3) + path('M' + x + ' ' + (182 - hgt) + 'v' + (-hgt * .3), '', '#8A7A5A', 2) + rect(x - 5, 182 - hgt * .6, 10, hgt * .6, '#6A5A3A', '', 2); });
    for (i = 0; i < 6; i++) s += rect(40 + i * 40, 236, 12, 22, '#B8A674', '#8A7A5A', 2);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s + path('M40 282q40 -6 80 0t80 0', '', 'rgba(255,255,255,.5)', 3));
  };
  ART.kh_big = function (b) {
    var s = rect(50, 110, 100, 56, '#B8AC9C', '#8A8070', 3) + rect(62, 70, 76, 44, '#C0B4A4', '#8A8070', 3) + rect(76, 30, 48, 44, '#C8BCAC', '#8A8070', 3) + path('M76 30Q100 4 124 30', '#B8AC9C', '#8A8070', 3), i, p = [[100, 50], [80, 92], [120, 92]];
    p.forEach(function (c) { s += circ(c[0], c[1], 13, '#D0C4B0', '#8A8070') + path('M' + (c[0] - 6) + ' ' + (c[1] - 2) + 'q3 -3 6 0M' + (c[0] + 1) + ' ' + (c[1] - 2) + 'q3 -3 6 0M' + (c[0] - 4) + ' ' + (c[1] + 5) + 'q4 3 8 0', '', '#6A5A4A', 2); });
    return T(b.x * 100, b.y * 100, shadow(100, 186, 70, 6) + s + path('M52 166q-10 4 -4 14M148 166q10 4 4 14', '', '#6A9A5A', 4));
  };
  ART.kh_item2 = function (b) {
    var s = '', i; for (i = 0; i < 8; i++) { var a = i / 8 * Math.PI * 2; s += ell(50 + Math.cos(a) * 18, 56 + Math.sin(a) * 12, 14, 7, '#FFB6D0', '#C94A8A', 1.6); }
    return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + ell(50, 62, 36, 14, '#4FAE62', '#2E7A4A') + s + circ(50, 56, 7, '#F2C94C', '#C99A1B'));
  };
  ART.kh_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 20, 4) + palm(50, 90, .95, '#3F7A3A') + circ(46, 38, 4, '#8A5A2E') + circ(56, 36, 4, '#8A5A2E')); };

  /* ═════════ NEPAL ═════════ */
  zone('nepal', '#C8E4B0', '#B0D498', 'rgba(110,150,80,.5)', 'rgba(230,100,110,.4)', { leaf: ['#5A9A4A', '#6ABA5A', '#8AC86A'], bush: ['#4F8A4A', '#6AAA5A'], rock: ['#B8B2A6', '#D0CABE'], post: '#B8A88A', rail: '#A89878' });
  ART.np_house = function (b) {
    var s = '', i, cols = ['#2B6BC8', '#F4F4F8', '#E5334B', '#4FAE62', '#F2C94C'];
    s += rect(40, 250, 220, 18, '#F4EAD8', '#B8A88A', 3) + rect(60, 232, 180, 20, '#F4EAD8', '#B8A88A', 3) + path('M70 232Q70 130 150 120Q230 130 230 232Z', '#FFFFFF', '#B8A88A', 3) + rect(120, 80, 60, 44, '#F2C94C', '#C99A1B', 3) + circ(138, 100, 6, '#fff', '#2A2A34') + circ(162, 100, 6, '#fff', '#2A2A34') + circ(138, 100, 2.4, '#2A2A34') + circ(162, 100, 2.4, '#2A2A34') + path('M150 104v10', '', '#E5334B', 3) + poly('112,80 188,80 168,56 132,56', '#E5C84A', '#C99A1B', 3) + rect(138, 38, 24, 20, '#F2C94C', '#C99A1B', 2) + poly('134,38 166,38 150,14', '#C9A22A', '#8A6A1A') + circ(150, 12, 3, '#F2C94C');
    for (i = 0; i < 5; i++) s += path('M150 14L' + (24 + i * 60) + ' ' + (130 + (i % 2) * 8), '', '#8A7A5A', 1.4) + poly((14 + i * 60) + ',' + (126 + (i % 2) * 8) + ' ' + (34 + i * 60) + ',' + (126 + (i % 2) * 8) + ' ' + (34 + i * 60) + ',' + (140 + (i % 2) * 8) + ' ' + (14 + i * 60) + ',' + (140 + (i % 2) * 8), cols[i], 'rgba(0,0,0,.25)', 1.2);
    return T(b.x * 100, b.y * 100, shadow(150, 290, 130, 7) + s);
  };
  ART.np_big = function (b) {
    var s = poly('4,170 70,70 100,28 130,70 196,170', '#8A94A8', '#5A647A', 3) + poly('72,68 100,28 128,68 112,60 100,74 88,60', '#FFFFFF', '#C8D0DC', 2.4) + poly('4,170 40,110 60,130 30,170', '#7A849A') + path('M100 28v-14', '', '#8A5A2E', 3) + poly('100,14 118,18 100,24', '#E5334B'), i, cols = ['#2B6BC8', '#F4F4F8', '#E5334B', '#4FAE62', '#F2C94C'];
    s += path('M30 150Q100 130 170 150', '', '#8A7A5A', 1.6);
    for (i = 0; i < 5; i++) s += rect(36 + i * 28, 150 + Math.sin(i * 1.2) * 4 - 1, 14, 12, cols[i], 'rgba(0,0,0,.25)', 1);
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.np_item2 = function (b) {
    var s = rect(36, 36, 28, 44, '#C9A22A', '#8A6A1A', 3) + path('M36 50h28M36 64h28', '', '#8A6A1A', 1.8) + ell(50, 36, 14, 5, '#E8C84A', '#8A6A1A') + rect(48, 18, 4, 18, '#8A5A2E') + path('M44 24h12', '', '#C8402F', 4) + rect(30, 80, 40, 6, '#8A5A2E', '', 2);
    return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 4) + s + path('M50 86v6', '', '#8A5A2E', 4));
  };
  ART.np_item = function (b) { var s = ell(50, 66, 38, 16, '#F4F4F8', '#B8B8C0'), i; for (i = 0; i < 5; i++) { var x = 26 + i * 12, y = 62 + (i % 2) * 6; s += poly(f0(x - 8) + ',' + f0(y + 4) + ' ' + f0(x) + ',' + f0(y - 12) + ' ' + f0(x + 8) + ',' + f0(y + 4), '#F4EAD8', '#C9A66A', 1.8) + path('M' + (x - 4) + ' ' + (y - 2) + 'l4 -4l4 4', '', '#C9A66A', 1.4); } return T(b.x * 100, b.y * 100, shadow(50, 90, 32, 5) + s + circ(80, 56, 4, '#E5334B')); };

  /* ═════════ JORDAN ═════════ */
  zone('jordan', '#EBD8A0', '#E0C98A', 'rgba(190,150,80,.5)', 'rgba(210,120,70,.4)', { leaf: ['#9AAA5A', '#AABA6A', '#BACB7A'], bush: ['#8A9A4A', '#A0B060'], rock: ['#C8A078', '#DDB88C'], post: '#B89A6A', rail: '#A8886A' });
  ART.jo_house = function (b) {
    var s = poly('0,290 0,60 40,30 260,30 300,60 300,290', '#D8906A', '#8A4A2A', 3) + poly('0,290 0,60 40,30 40,290', '#C27C58') + poly('300,290 300,60 260,30 260,290', '#C27C58'), i;
    s += rect(80, 100, 140, 190, '#E0A07A', '#8A4A2A', 3);
    for (i = 0; i < 4; i++) s += rect(90 + i * 34, 130, 20, 160, '#E8B090', '#8A4A2A', 2) + rect(86 + i * 34, 124, 28, 10, '#D8906A', '#8A4A2A', 2);
    s += poly('80,100 150,52 220,100', '#D8906A', '#8A4A2A', 3) + rect(122, 92, 56, 66, '#E8B090', '#8A4A2A', 2) + path('M122 92Q150 60 178 92', '#E8B090', '#8A4A2A', 2) + rect(136, 204, 28, 86, '#4A2A1A', '#2A1A0E', 3) + path('M122 158h56M122 176h56', '', '#8A4A2A', 2) + circ(150, 124, 10, '#C27C58', '#8A4A2A');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.jo_big = function (b) {
    var s = poly('0,170 20,100 60,70 70,100 100,60 130,100 150,70 200,170', '#D8906A', '#8A4A2A', 3) + path('M70 170Q70 100 100 100Q130 100 130 170Z', '#EAD8A0') + path('M60 70q14 -14 28 0', '', '#8A4A2A', 2);
    s += ell(110, 168, 70, 8, '#E8D4A0') + ell(150, 150, 14, 10, '#8A6A3A', '#5A4A2A') + circ(160, 138, 6, '#8A6A3A', '#5A4A2A') + path('M140 160v-12M158 160v-12', '', '#5A4A2A', 3) + ell(146, 132, 8, 8, '#8A6A3A', '#5A4A2A');
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.jo_item2 = function (b) { var s = rect(14, 14, 72, 72, '#F4EAD8', '#8A5A2E', 3), i, j, cols = ['#C8402F', '#2B6BC8', '#F2C94C', '#2E8A4F']; for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) s += rect(18 + i * 17, 18 + j * 17, 15, 15, cols[(i + j * 2) % 4], 'rgba(0,0,0,.2)', 1); s += circ(50, 50, 12, '#F4EAD8', '#8A5A2E') + circ(50, 50, 6, '#C8402F'); return T(b.x * 100, b.y * 100, shadow(50, 92, 34, 4) + s); };
  ART.jo_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 4) + path('M34 84Q28 52 44 44L44 34Q50 28 56 34L56 44Q72 52 66 84Z', '#C9A22A', '#8A6A1A', 3) + path('M56 40Q86 40 80 62', '', '#8A6A1A', 4) + path('M44 36Q34 22 50 14Q66 22 56 36', '#C9A22A', '#8A6A1A', 2.4) + path('M38 60h28M36 72h30', '', '#C8402F', 3) + circ(50, 12, 3, '#C8402F')); };

  /* ═════════ BỈ ═════════ */
  zone('belgium', '#BDE0A0', '#A4D088', 'rgba(100,150,70,.5)', 'rgba(230,200,90,.45)', { leaf: ['#5AAA4A', '#6ABA5A', '#8AC86A'], bush: ['#4F9A4A', '#6AAA5A'], rock: ['#B8B2A6', '#D0CABE'], post: '#B8A88A', rail: '#A89878' });
  ART.be_house = function (b) {
    var s = rect(10, 258, 280, 14, '#8A8A92', '#5A5A62', 2), x, i, cols = ['#E8C86A', '#D8A860', '#E8C86A', '#C89850', '#E8C86A'], hs = [120, 150, 110, 140, 118];
    for (i = 0; i < 5; i++) { x = 14 + i * 56; var h = hs[i]; s += rect(x, 258 - h, 52, h, cols[i], '#8A6A2A', 3) + poly((x - 2) + ',' + (258 - h) + ' ' + (x + 26) + ',' + (258 - h - 36 - (i % 2) * 10) + ' ' + (x + 54) + ',' + (258 - h), '#C9A22A', '#8A6A2A', 3) + circ(x + 26, 258 - h - 12, 5, '#F2C94C', '#8A6A2A') + win(x + 8, 258 - h + 14, 14, 18) + win(x + 30, 258 - h + 14, 14, 18) + win(x + 8, 258 - h + 50, 14, 18) + win(x + 30, 258 - h + 50, 14, 18) + rect(x + 18, 258 - 36, 16, 36, '#6A3A1E', '', 2); }
    s += rect(122, 40, 56, 80, '#B8AC9C', '#6A6A74', 3) + poly('118,40 150,6 182,40', '#6A6A74', '#3A3A42', 3) + circ(150, 76, 14, '#F4F0E4', '#6A6A74') + path('M150 76v-9M150 76l6 3', '', '#2A2A34', 2.4) + circ(150, 4, 3, '#C9A22A');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.be_big = function (b) {
    var s = '', pts = [[100, 36], [48, 76], [152, 76], [48, 130], [152, 130], [100, 100], [100, 164], [100, 76], [100, 130]], i, ed = [[0, 7], [7, 5], [7, 1], [7, 2], [5, 3], [5, 4], [1, 3], [2, 4], [3, 8], [4, 8], [8, 6], [5, 8], [5, 2], [5, 1]];
    ed.forEach(function (e) { s += path('M' + pts[e[0]][0] + ' ' + pts[e[0]][1] + 'L' + pts[e[1]][0] + ' ' + pts[e[1]][1], '', '#9AA8B8', 7); });
    pts.forEach(function (p, n) { s += circ(p[0], p[1], 15, n === 0 ? '#E8F0F8' : '#C8D0DC', '#6A7A8A') + path('M' + (p[0] - 8) + ' ' + (p[1] - 5) + 'q6 -6 12 -2', '', 'rgba(255,255,255,.8)', 2.4); });
    return T(b.x * 100, b.y * 100, shadow(100, 188, 60, 6) + s);
  };
  ART.be_flag = flagPole('be');
  ART.be_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 32, 5) + rect(14, 46, 72, 36, '#E8B060', '#8A5A2E', 5) + path('M14 58h72M14 70h72M34 46v36M54 46v36M72 46v36', '', '#C98A3A', 2) + circ(36, 40, 8, '#E5334B', '#8E1228') + circ(56, 38, 7, '#E5334B', '#8E1228') + path('M30 36q6 -4 12 0', '', '#F4EAD8', 2) + circ(66, 42, 6, '#6A3A1E', '#3A1E0E')); };

  /* ═════════ CROATIA ═════════ */
  zone('croatia', '#B8E0A8', '#9CD08C', 'rgba(90,150,80,.5)', 'rgba(150,110,210,.4)', { leaf: ['#5A9A5A', '#6ABA6A', '#8AC88A'], bush: ['#4F8A5A', '#6AAA6A'], rock: ['#D0C8B8', '#E4DCCC'], post: '#B8B8C0', rail: '#A8A8B0' });
  ART.hr_house = function (b) {
    var s = ell(150, 282, 150, 14, '#2B9BD8', '#1A6A9A') + path('M10 282q40 -8 80 0t80 0t80 0t60 0', '', 'rgba(255,255,255,.5)', 3) + rect(14, 160, 272, 112, '#E8DCC0', '#B8A88A', 3), i;
    for (i = 0; i < 14; i++) s += rect(14 + i * 20, 152, 12, 10, '#E8DCC0', '#B8A88A', 2);
    [[40, 90, 56], [200, 80, 62]].forEach(function (t) { s += rect(t[0], t[1], t[2], 180 - t[1] + 16, '#EAE0C8', '#B8A88A', 3) + poly((t[0] - 6) + ',' + t[1] + ' ' + (t[0] + t[2] / 2) + ',' + (t[1] - 38) + ' ' + (t[0] + t[2] + 6) + ',' + t[1], '#C8402F', '#7A2A1A', 3) + rect(t[0] + t[2] / 2 - 5, t[1] + 20, 10, 24, '#5A4A3A', '', 2); });
    for (i = 0; i < 5; i++) { var x = 100 + i * 20; s += rect(x, 188 - (i % 2) * 6, 18, 36, '#F4EAD8', '#B8A88A', 2) + poly((x - 3) + ',' + (188 - (i % 2) * 6) + ' ' + (x + 9) + ',' + (170 - (i % 2) * 6) + ' ' + (x + 21) + ',' + (188 - (i % 2) * 6), '#C8402F', '#7A2A1A', 2); }
    s += rect(130, 226, 40, 46, '#4A3A2A', '#2A1A0E', 3) + path('M124 226Q150 200 176 226', '#EAE0C8', '#B8A88A', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.hr_big = function (b) {
    var s = poly('0,40 60,10 140,14 200,50 200,110 0,110', '#6A9A5A', '#3F6A3A', 2.4), i;
    for (i = 0; i < 4; i++) { var y = 50 + i * 26, w = 60 + i * 20; s += ell(100, y + 22, w, 12, '#5BC6C8', '#2E8F90') + rect(100 - w * .5, y, w, 22, '#8EE0E8', 'rgba(0,0,0,.12)', 1) + path('M' + (100 - w * .4) + ' ' + y + 'v22M' + (100 - w * .1) + ' ' + y + 'v22M' + (100 + w * .2) + ' ' + y + 'v22M' + (100 + w * .45) + ' ' + y + 'v22', '', '#E8FAFC', 3); }
    return T(b.x * 100, b.y * 100, shadow(100, 188, 90, 6) + s + tree(24, 130, .7, '#4F8A3A', '#3F7A3A') + tree(176, 124, .7, '#4F8A3A', '#3F7A3A'));
  };
  ART.hr_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 26, 4) + poly('38,22 62,22 56,38 44,38', '#E5334B', '#8E1228', 2) + poly('44,38 56,38 66,86 50,94 34,86', '#E5334B', '#8E1228', 2.4) + path('M44 52l12 6M42 66l16 6M40 80l20 6', '', '#FFFFFF', 3) + circ(50, 28, 3, '#8E1228')); };
  ART.hr_item = function (b) { var s = ell(50, 66, 28, 18, '#FFFFFF', '#B8B8C0') + circ(76, 50, 12, '#FFFFFF', '#B8B8C0') + poly('70,42 66,28 78,38', '#2A2A34') + path('M86 50l8 4', '', '#2A2A34', 4) + path('M32 80v10M44 82v10M62 82v10M72 80v10', '', '#B8B8C0', 5) + path('M24 60q-10 -8 -6 -18', '', '#FFFFFF', 5), i; [[40, 62], [56, 70], [48, 54], [66, 60], [76, 48]].forEach(function (p) { s += circ(p[0], p[1], 3.6, '#2A2A34'); }); return T(b.x * 100, b.y * 100, shadow(50, 92, 32, 5) + s + circ(78, 48, 1.6, '#fff')); };

  /* ═════════ COLOMBIA ═════════ */
  zone('colombia', '#B0E0A0', '#94D088', 'rgba(70,150,80,.5)', 'rgba(230,110,70,.4)', { leaf: ['#3F9A5A', '#4FAE62', '#6ABA7A'], bush: ['#3F8A4A', '#5AAA5A'], rock: ['#B8AC9C', '#D0C8B8'], post: '#B8A88A', rail: '#A89878' });
  ART.co_house = function (b) {
    var s = rect(4, 262, 292, 12, '#8A8A92', '#5A5A62', 2), cols = ['#F2C94C', '#2B9BD8', '#E5534B', '#4FAE62', '#F28AB0'], x, i, hs = [160, 190, 150, 176];
    for (i = 0; i < 4; i++) { x = 8 + i * 72; var h = hs[i], c = cols[i]; s += rect(x, 262 - h, 68, h, c, 'rgba(0,0,0,.3)', 3) + rect(x - 3, 262 - h - 8, 74, 10, '#F4EAD8', 'rgba(0,0,0,.3)', 2) + rect(x + 8, 262 - h + 20, 20, 36, '#F4EAD8', '#8A6A4A', 2) + rect(x + 40, 262 - h + 20, 20, 36, '#F4EAD8', '#8A6A4A', 2) + rect(x + 4, 262 - h + 56, 60, 8, '#6A3A1E') + path('M' + (x + 6) + ' ' + (262 - h + 64) + 'v10M' + (x + 22) + ' ' + (262 - h + 64) + 'v10M' + (x + 38) + ' ' + (262 - h + 64) + 'v10M' + (x + 54) + ' ' + (262 - h + 64) + 'v10', '', '#6A3A1E', 3) + circ(x + 18, 262 - h + 90, 4, '#E5334B') + circ(x + 30, 262 - h + 90, 4, '#F2C94C') + rect(x + 22, 262 - 46, 24, 46, '#5A3A1E', '', 2); }
    s += path('M24 80q30 -10 60 0t60 0t60 0t60 0', '', '#E5334B', 2) + circ(48, 82, 4, '#F2C94C') + circ(108, 82, 4, '#2B6BC8') + circ(168, 82, 4, '#E5334B') + circ(228, 82, 4, '#F2C94C');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 6) + s);
  };
  ART.co_big = function (b) {
    var s = poly('0,170 0,100 50,70 100,100 150,60 200,100 200,170', '#6AAA5A', '#3F7A3A', 2.4) + poly('0,170 40,120 90,140 150,110 200,150 200,170', '#8AC86A'), i;
    [[30, 150, 1], [70, 160, 1.15], [112, 150, 1.25], [152, 162, 1.1], [180, 146, .9]].forEach(function (p) { var x = p[0], y = p[1], k = p[2]; s += path('M' + x + ' ' + y + 'V' + (y - 80 * k), '', '#C8B88A', 5 * k) + path('M' + x + ' ' + (y - 80 * k) + 'q-18 -6 -26 6M' + x + ' ' + (y - 80 * k) + 'q18 -6 26 6M' + x + ' ' + (y - 80 * k) + 'q-8 -18 -20 -16M' + x + ' ' + (y - 80 * k) + 'q8 -18 20 -16', '', '#3F7A3A', 3.6 * k); });
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.co_flag = flagPole('co');
  ART.co_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 4) + path('M28 50h44q0 32 -22 36q-22 -4 -22 -36Z', '#F4EAD8', '#B8A88A', 3) + path('M72 56q16 0 12 14q-4 8 -14 6', '', '#B8A88A', 4) + ell(50, 50, 22, 5, '#6A3A1E') + path('M40 34q4 -8 0 -14M52 34q4 -8 0 -14M62 34q4 -8 0 -14', '', 'rgba(120,100,80,.55)', 3) + ell(26, 92, 8, 4, '#6A3A1E') + ell(74, 92, 8, 4, '#6A3A1E')); };

  /* ═════════ TANZANIA ═════════ */
  zone('tanzania', '#DDE0A0', '#CCD488', 'rgba(170,150,70,.5)', 'rgba(210,150,60,.4)', { leaf: ['#8AAA4A', '#9ABA5A', '#AACB6A'], bush: ['#7A9A3A', '#9AB04A'], rock: ['#B8AC9C', '#D0C8B8'], post: '#B89A6A', rail: '#A8886A' });
  ART.tz_house = function (b) {
    var s = poly('0,270 70,150 120,160 160,60 190,60 240,140 300,270', '#8A7A6A', '#5A4A3A', 3) + poly('150,70 160,60 190,60 202,86 186,82 176,98 164,84', '#FFFFFF', '#C8D0DC', 2.4) + poly('160,60 190,60 174,40', '#F4F8FC', '#C8D0DC', 2) + poly('0,270 70,150 100,190 40,270', '#7A6A5A') + path('M170 40v-8', '', '#8A5A2E', 2);
    s += path('M18 270Q150 240 282 270', '#8AAA4A') + path('M0 270H300', '', '#6A8A3A', 6) + rect(48, 236, 6, 34, '#6A4A2E') + path('M30 238q22 -22 46 0', '#5A8A3A', '#3F6A2A', 2.4) + rect(238, 232, 6, 38, '#6A4A2E') + path('M214 234q26 -26 54 0', '#5A8A3A', '#3F6A2A', 2.4) + path('M60 130q16 -14 34 0M200 120q14 -12 30 0', '', 'rgba(255,255,255,.7)', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.tz_big = function (b) {
    var s = circ(160, 36, 18, '#F2C94C', '#C99A1B') + ell(100, 150, 96, 16, '#D8C070', '#B89A40') + rect(38, 82, 6, 66, '#6A4A2E') + path('M12 86q30 -34 72 0', '#5A8A3A', '#3F6A2A', 3) + rect(150, 100, 5, 48, '#6A4A2E') + path('M130 104q22 -22 50 0', '#5A8A3A', '#3F6A2A', 3), i;
    [[70, 142], [100, 148], [130, 140], [160, 146]].forEach(function (p, n) { s += ell(p[0], p[1], 14, 8, n % 2 ? '#F4F4F8' : '#6A6A74', '#2A2A34') + circ(p[0] + 14, p[1] - 5, 5, n % 2 ? '#F4F4F8' : '#6A6A74', '#2A2A34') + path('M' + (p[0] - 8) + ' ' + (p[1] + 6) + 'v8M' + (p[0] + 6) + ' ' + (p[1] + 6) + 'v8', '', '#2A2A34', 2.4); if (n % 2) for (i = 0; i < 4; i++) s += path('M' + (p[0] - 8 + i * 5) + ' ' + (p[1] - 6) + 'v10', '', '#2A2A34', 1.6); });
    return T(b.x * 100, b.y * 100, shadow(100, 186, 90, 6) + s);
  };
  ART.tz_item2 = function (b) { var s = rect(14, 24, 72, 56, '#E5334B', '#8E1228', 2.4) + rect(20, 30, 60, 44, '#F2C94C', 'none', 0) + circ(34, 44, 8, '#2B6BC8') + circ(66, 44, 8, '#2B6BC8') + circ(50, 58, 9, '#E5334B') + path('M20 30l60 44M80 30L20 74', '', '#2E8A4F', 2.4) + path('M14 80q18 8 36 0t36 0', '', '#E5334B', 3); return T(b.x * 100, b.y * 100, shadow(50, 92, 34, 4) + s); };
  ART.tz_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + poly('50,18 82,38 70,84 30,84 18,38', '#4A5AE8', '#2A3AA8', 3) + poly('50,18 82,38 50,50 18,38', '#8A9AFF', '#2A3AA8', 2) + poly('18,38 50,50 30,84', '#3A4AC8') + poly('82,38 50,50 70,84', '#2A3AA8') + path('M36 32l10 -6', '', 'rgba(255,255,255,.8)', 2.6)); };

  /* ═════════ SCOTLAND ═════════ */
  zone('scotland', '#B0D8A0', '#98C888', 'rgba(110,130,90,.5)', 'rgba(190,110,190,.45)', { leaf: ['#5A8A5A', '#6A9A6A', '#8AB08A'], bush: ['#5A7A5A', '#7A9A7A'], rock: ['#9A9AA4', '#B8B8C0'], post: '#A89878', rail: '#98886A' });
  ART.sct_house = function (b) {
    var s = poly('0,290 20,200 70,170 120,140 190,150 240,180 290,290', '#8A8A92', '#5A5A62', 3) + poly('0,290 20,200 60,230 40,290', '#7A7A82') + rect(80, 90, 150, 70, '#B8AC9C', '#6A6A74', 3), i;
    for (i = 0; i < 8; i++) s += rect(80 + i * 19, 82, 11, 10, '#B8AC9C', '#6A6A74', 2);
    s += rect(60, 60, 36, 100, '#C0B4A4', '#6A6A74', 3) + poly('56,60 78,24 100,60', '#6A6A74', '#3A3A42', 3) + rect(190, 40, 40, 120, '#C0B4A4', '#6A6A74', 3) + poly('186,40 210,4 234,40', '#6A6A74', '#3A3A42', 3) + path('M210 4v-16', '', '#8A5A2E', 3) + poly('210,-12 232,-6 210,0', '#2B6BC8') + win(70, 96, 14, 22) + win(204, 66, 14, 24) + rect(132, 120, 36, 40, '#3A2A1E', '', 3) + path('M132 120q18 -22 36 0', '#3A2A1E', '', 0) + rect(120, 160, 60, 12, '#9A9AA4', '#5A5A62', 2);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s + tree(30, 270, .8, '#3F7A4A', '#2F6A3A'));
  };
  ART.sct_big = function (b) {
    var s = poly('0,100 40,50 90,80 130,30 200,100', '#7A8A7A', '#4A5A4A', 2.4) + poly('0,100 200,100 200,180 0,180', '#5A82A0', '#3F6A8A', 2) + path('M10 120q30 -6 60 0t60 0t60 0M10 150q30 -6 60 0t60 0t60 0', '', 'rgba(255,255,255,.45)', 3), i;
    [[70, 114], [100, 108], [128, 114]].forEach(function (p, n) { s += path('M' + (p[0] - 14) + ' ' + (p[1] + 8) + 'Q' + p[0] + ' ' + (p[1] - 26) + ' ' + (p[0] + 14) + ' ' + (p[1] + 8) + 'Z', '#4A7A5A', '#2A5A3A', 2.4); });
    s += path('M146 110q16 -4 14 -30q0 -8 8 -8q8 0 4 10', '#4A7A5A', '#2A5A3A', 4) + circ(172, 76, 7, '#4A7A5A', '#2A5A3A') + circ(175, 74, 1.6, '#fff');
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.sct_flag = flagPole('sct');
  ART.sct_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 32, 4) + ell(48, 62, 26, 20, '#2E6A4A', '#1A4A2E') + path('M26 56q22 -8 44 0M28 68q20 6 40 0', '', '#C8402F', 3) + path('M36 46L24 14M48 42L48 8M60 46L72 14', '', '#2A2A34', 5) + circ(24, 12, 3, '#C9A22A') + circ(48, 8, 3, '#C9A22A') + circ(72, 12, 3, '#C9A22A') + path('M70 66Q92 70 90 88', '', '#8A5A2E', 5)); };
})(typeof window !== 'undefined' ? window : this);
