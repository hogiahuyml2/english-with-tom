/* EWT Garden — 10 khu CHỦ ĐỀ mới (cảnh dựng sẵn): Dưới nước, Cổ đại, Hiện đại, Sắc hồng, Sắc vàng, Sắc tím, Xanh ngọc, Hoàng hôn, Bạc tuyết, Thiên văn.
   Mỗi khu có 4 cảnh: nhà chính (3×3), công trình phụ (2×2) và 2 vật nhỏ (1×1). Nạp SAU garden-world14.js. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld; if (!API || !API.H) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0;
  function tuft(c1, c2) { return function (R, W, H2) { return scatter(R, W, H2, 26, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q4 -9 8 0q4 -9 8 0" stroke="' + (i % 2 ? c1 : c2) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; }); }; }
  function sparks(c1, c2) { return function (R, W, H2) { return scatter(R, W, H2, 22, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="' + (2 + (i % 3)) + '" fill="' + (i % 2 ? c1 : c2) + '" opacity=".7"/>'; }); }; }
  function zone(id, g1, g2, ground, dth) { THEME[id] = { g1: g1, g2: g2, ground: ground }; DTH[id] = dth; }
  function win(x, y, w, h, c) { return rect(x, y, w, h, c || '#CFE8F5', '#6A8AA0', 2) + path('M' + (x + w / 2) + ' ' + y + 'v' + h + 'M' + x + ' ' + (y + h / 2) + 'h' + w, '', '#6A8AA0', 1.6); }
  function col(x, y0, y1, c) { return rect(x - 6, y0, 12, y1 - y0, c, 'rgba(0,0,0,.25)', 2) + rect(x - 9, y0 - 5, 18, 7, c, 'rgba(0,0,0,.25)', 2) + rect(x - 9, y1 - 2, 18, 6, c, 'rgba(0,0,0,.25)', 2); }
  function star(cx, cy, r, f) { var p = [], i; for (i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * .45 : r; p.push(f0(cx + Math.cos(a) * rr) + ',' + f0(cy + Math.sin(a) * rr)); } return poly(p.join(' '), f, 'rgba(0,0,0,.25)', 1.4); }
  function bubbles(n, x0, y0, w, h) { var s = '', i; for (i = 0; i < n; i++) s += circ(x0 + (i * 53 % w), y0 + (i * 37 % h), 3 + i % 4 * 2, 'rgba(255,255,255,.55)', 'rgba(120,200,235,.9)'); return s; }
  function tree(x, y, s, c1, c2, tr) { return rect(x - 4 * s, y - 6 * s, 8 * s, 36 * s, tr || '#8A5A2E') + circ(x, y - 18 * s, 22 * s, c1) + circ(x - 14 * s, y - 8 * s, 14 * s, c2) + circ(x + 15 * s, y - 6 * s, 14 * s, c2); }

  /* ═════════ DƯỚI NƯỚC ═════════ */
  zone('th_aqua', '#9AE0E0', '#7AD0D8', tuft('rgba(40,150,150,.55)', 'rgba(255,140,160,.5)'), { leaf: ['#3AB8A0', '#4AC8B0', '#2E9A8A'], bush: ['#2E9A8A', '#FF8A9A'], rock: ['#B8C8D0', '#D0DCE4'], post: '#B8A88A', rail: '#A8C8D0' });
  ART.aq_house = function (b) {
    var s = ell(150, 270, 140, 24, '#E8D8A8', '#C9B078') + circ(150, 150, 118, 'rgba(160,230,250,.4)', 'rgba(255,255,255,.9)') + rect(100, 150, 100, 110, '#F4F0E0', '#B8A88A', 3) + poly('92,154 150,96 208,154', '#FF7A8A', '#B84A5A') + rect(130, 90, 40, 70, '#D8F4F0', '#6AB8B8', 3) + poly('124,92 150,50 176,92', '#2BA8C8', '#1A6A8A') + win(110, 170, 24, 28) + win(166, 170, 24, 28) + rect(136, 206, 28, 54, '#2B6A8A', '#1A4A6A', 3) + circ(150, 118, 8, '#FFE066', '#C9A22A'), i;
    for (i = 0; i < 4; i++) s += path('M' + (40 + i * 70) + ' 266q-10 -40 6 -64q10 22 0 64', i % 2 ? '#FF7A8A' : '#5BE0C8', 'rgba(0,0,0,.2)', 1.6);
    s += bubbles(9, 40, 40, 220, 160) + path('M236 120q14 -4 22 6q-8 8 -22 6z', '#FF9A3A', '#C8601A', 1.6) + path('M60 90q14 -4 22 6q-8 8 -22 6z', '#FFD23F', '#C99A1B', 1.6);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.aq_big = function (b) {
    var s = ell(100, 160, 92, 22, '#E8D8A8', '#C9B078'), i;
    for (i = 0; i < 5; i++) s += path('M' + (40 + i * 28) + ' 160q-14 -40 4 -70q8 14 -2 26q10 -8 16 -26q4 40 -8 70z', ['#FF7A8A', '#FF9A5A', '#B66CFF', '#FF7A8A', '#FF9A5A'][i], 'rgba(0,0,0,.25)', 2);
    s += rect(120, 120, 44, 30, '#8A5A2E', '#4A2A12', 3) + poly('116,122 142,98 168,122', '#A8743A', '#4A2A12') + rect(138, 128, 8, 10, '#F2C94C', '#C99A1B') + circ(130, 112, 5, '#FFFFFF') + circ(150, 108, 4, '#FFFFFF') + bubbles(6, 30, 20, 150, 70);
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.aq_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 32, 5) + path('M14 76Q14 24 50 22Q86 24 86 76Q50 92 14 76Z', '#FFD6C8', '#C98A7A', 3) + path('M50 22V80M32 28v50M68 28v50', '', '#E8B0A0', 2.4) + circ(50, 62, 9, '#FFFFFF', '#B8C8D0') + circ(47, 59, 3, 'rgba(255,255,255,.9)')); };
  ART.aq_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 4) + path('M46 20q-14 2 -10 14q10 4 10 14q-10 14 -2 30q12 8 14 -6q-12 -16 -4 -26q12 -10 4 -22q-4 -6 -12 -4z', '#FFB84A', '#C98A1A', 2.4) + circ(40, 28, 2.4, '#222') + path('M34 32l-10 2', '', '#C98A1A', 2.4) + path('M60 40q10 6 6 18', '', '#FF8A3A', 3) + path('M38 70q-6 10 4 16', '', '#FF8A3A', 3) + bubbles(3, 56, 16, 30, 40)); };

  /* ═════════ CỔ ĐẠI ═════════ */
  zone('th_ancient', '#E8DCA8', '#D8C890', tuft('rgba(150,130,60,.5)', 'rgba(120,150,70,.45)'), { leaf: ['#8AAA5A', '#7A9A4A', '#9ABA6A'], bush: ['#7A9A4A', '#9ABA6A'], rock: ['#D8C8A0', '#E8DCC0'], post: '#C8B890', rail: '#B8A878' });
  ART.an_house = function (b) {
    var s = poly('20,262 280,262 262,246 38,246', '#EADFC8', '#B8A878', 2.4) + poly('34,246 266,246 252,232 48,232', '#E0D4B4', '#B8A878', 2.4) + rect(50, 120, 200, 112, '#F2E8D0', '#B8A878', 3), i;
    for (i = 0; i < 7; i++) s += col(60 + i * 30, 126, 226, '#EADFC8');
    s += poly('40,122 150,56 260,122', '#E8DCC0', '#B8A878', 3) + poly('70,118 150,72 230,118', '#D8C8A0', '#B8A878', 2) + circ(150, 100, 11, '#C9A66A', '#8A6A3A') + rect(30, 114, 240, 10, '#D8C8A0', '#B8A878', 2) + rect(136, 170, 28, 62, '#3A2A1A', '#1A1008', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.an_big = function (b) {
    var s = rect(30, 150, 140, 14, '#D8C8A0', '#B8A878', 2) + poly('50,150 50,100 70,74 90,60 130,60 150,74 150,100 150,150', '#D8B878', '#B8903A', 3) + ell(100, 98, 30, 22, '#D8B878', '#B8903A') + circ(100, 62, 16, '#E0C488', '#B8903A') + path('M90 56q10 -6 20 0', '', '#8A6A3A', 3) + circ(94, 62, 2, '#3A2A1A') + circ(106, 62, 2, '#3A2A1A') + poly('150,100 190,124 150,150', '#C8A868', '#B8903A', 2.4) + path('M60 120h80', '', 'rgba(0,0,0,.2)', 2);
    return T(b.x * 100, b.y * 100, shadow(100, 186, 84, 6) + s);
  };
  ART.an_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 4) + rect(26, 70, 48, 12, '#D8C8A0', '#B8A878', 2.4) + rect(36, 28, 28, 44, '#EADFC8', '#B8A878', 2.4) + path('M36 28l6 8l6 -6l6 10l6 -8l4 4', '', '#B8A878', 2) + rect(32, 22, 36, 8, '#E0D4B4', '#B8A878', 2) + path('M44 40v28M56 40v28', '', 'rgba(0,0,0,.18)', 2)); };
  ART.an_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 4) + path('M38 14h24l-4 12q18 8 14 34q-2 20 -22 20q-20 0 -22 -20q-4 -26 14 -34z', '#C8703A', '#6A3A1A', 2.6) + path('M36 38q14 8 28 0M34 52q16 8 32 0', '', '#2A2A34', 2.6) + path('M34 32q-14 4 -10 18q4 6 12 2M66 32q14 4 10 18q-4 6 -12 2', '', '#6A3A1A', 3)); };

  /* ═════════ HIỆN ĐẠI ═════════ */
  zone('th_modern', '#C8E0C8', '#B4D4B4', tuft('rgba(70,130,90,.45)', 'rgba(200,210,220,.5)'), { leaf: ['#5AAA6A', '#4F9A5A', '#6ABA7A'], bush: ['#4F9A5A', '#7ABA8A'], rock: ['#C9CED6', '#DCE0E6'], post: '#B8BCC4', rail: '#A8ACB4' });
  ART.md_house = function (b) {
    var s = rect(30, 168, 150, 84, '#F4F6F8', '#8A94A4', 3) + rect(100, 94, 170, 74, '#E8ECF2', '#8A94A4', 3) + rect(20, 160, 170, 12, '#3A4A5A') + rect(90, 88, 190, 12, '#3A4A5A') + rect(112, 108, 140, 48, 'rgba(150,210,240,.9)', '#6A8AA0', 2) + rect(44, 184, 100, 56, 'rgba(150,210,240,.9)', '#6A8AA0', 2) + path('M162 108v48M200 108v48', '', '#6A8AA0', 2) + path('M74 184v56M110 184v56', '', '#6A8AA0', 2) + ell(232, 252, 52, 14, '#5BC6E8', '#2E8FB0') + ell(232, 250, 40, 9, '#8EDCF8') + rect(184, 190, 60, 62, '#F4F6F8', '#8A94A4', 3) + rect(196, 206, 36, 46, '#2A3A4A', '', 2);
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s + tree(266, 258, .6, '#4F9A5A', '#3F8A4A'));
  };
  ART.md_big = function (b) {
    var s = rect(24, 150, 152, 8, '#C9CED6', '#8A94A4', 2) + poly('40,150 100,40 160,150', 'rgba(150,210,240,.8)', '#6A8AA0', 3) + poly('70,150 100,92 130,150', 'rgba(255,255,255,.55)', '#6A8AA0', 2) + path('M100 40V150', '', '#6A8AA0', 2) + circ(100, 36, 6, '#5BE0FF', '#2B6BC8');
    return T(b.x * 100, b.y * 100, shadow(100, 176, 80, 6) + s);
  };
  ART.md_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 20, 4) + rect(46, 20, 8, 70, '#8A94A4', '#4A5464', 2) + rect(24, 14, 52, 8, '#5BE0FF', '#2B8AB8', 2) + circ(50, 18, 18, 'rgba(91,224,255,.3)')); };
  ART.md_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 32, 5) + rect(14, 62, 72, 8, '#E8ECF2', '#8A94A4', 2) + rect(20, 70, 6, 18, '#3A4A5A') + rect(74, 70, 6, 18, '#3A4A5A') + rect(18, 42, 20, 22, '#C9CED6', '#8A94A4', 2) + circ(28, 36, 12, '#4F9A5A', '#2E7A3A') + circ(24, 30, 6, '#6ABA7A')); };

  /* ═════════ SẮC HỒNG ═════════ */
  zone('th_pink', '#FFD8E4', '#FFC4D6', tuft('rgba(230,110,150,.5)', 'rgba(255,255,255,.7)'), { leaf: ['#FF9AB8', '#FFB6C8', '#FF8AA8'], bush: ['#FF8AA8', '#FFC4D6'], rock: ['#F4D8E0', '#FCE8EE'], post: '#E8B8C8', rail: '#F0A8BC' });
  ART.pk_house = function (b) {
    var s = rect(40, 120, 220, 130, '#FFE0EC', '#D890A8', 3) + poly('28,126 150,48 272,126', '#E87A9A', '#A84A68') + rect(120, 36, 60, 16, '#FF9AB8', '#A84A68', 2) + rect(50, 70, 30, 56, '#FFD0DC', '#D890A8', 2) + poly('44,72 65,40 86,72', '#E87A9A', '#A84A68') + rect(220, 70, 30, 56, '#FFD0DC', '#D890A8', 2) + poly('214,72 235,40 256,72', '#E87A9A', '#A84A68'), i;
    for (i = 0; i < 4; i++) s += win(66 + i * 44, 144, 26, 34, '#FFF0F6');
    s += rect(132, 190, 36, 60, '#FF8AA8', '#A84A68', 3) + path('M100 250Q100 190 150 180Q200 190 200 250', '', '#FF8AA8', 6) + circ(100, 220, 7, '#FF7A9A') + circ(112, 192, 7, '#FF9AB8') + circ(150, 180, 8, '#FF7A9A') + circ(188, 192, 7, '#FF9AB8') + circ(200, 220, 7, '#FF7A9A') + circ(150, 100, 9, '#FFFFFF', '#A84A68');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.pk_big = function (b) {
    var s = tree(100, 118, 1.5, '#FFB6C8', '#FF9AB8', '#8A5A3A') + rect(60, 150, 80, 8, '#F4D8E0', '#D890A8', 2) + poly('56,150 100,116 144,150', '#E87A9A', '#A84A68') + rect(66, 150, 6, 22, '#F4D8E0') + rect(128, 150, 6, 22, '#F4D8E0'), i;
    for (i = 0; i < 10; i++) s += circ(20 + (i * 47) % 160, 150 + (i * 13) % 30, 3, '#FFD0E0');
    return T(b.x * 100, b.y * 100, shadow(100, 186, 80, 6) + s);
  };
  ART.pk_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + rect(22, 54, 56, 32, '#FFD0DC', '#D890A8', 2.4) + path('M22 62h56M30 54v32M44 54v32M58 54v32M70 54v32', '', '#E87A9A', 1.6) + circ(50, 46, 24, '#FFFFFF', '#E8C0D0') + circ(30, 54, 14, '#FFF0F6', '#E8C0D0') + circ(70, 54, 14, '#FFF0F6', '#E8C0D0') + circ(50, 22, 7, '#E5334B', '#8E1228')); };
  ART.pk_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 4) + rect(40, 70, 20, 20, '#D8A0B0', '#A84A68', 2) + path('M50 70q-30 -18 -22 -40q12 -10 22 6q10 -16 22 -6q8 22 -22 40z', '#FF7A9A', '#C94A6A', 2.6)); };

  /* ═════════ SẮC VÀNG ═════════ */
  zone('th_gold', '#FFEFA8', '#FFE57A', tuft('rgba(210,160,30,.5)', 'rgba(255,255,255,.55)'), { leaf: ['#E8C840', '#F2D45A', '#D8B030'], bush: ['#D8B030', '#F2D45A'], rock: ['#E8DCB0', '#F4EAC8'], post: '#C9A22A', rail: '#B8921A' });
  ART.gl_house = function (b) {
    var s = rect(50, 232, 200, 20, '#C9A22A', '#8A6A1A', 3) + rect(66, 206, 168, 28, '#F2C94C', '#8A6A1A', 3) + rect(82, 156, 136, 52, '#F2D47A', '#8A6A1A', 3) + poly('60,160 150,100 240,160', '#C8402F', '#7A1A10') + rect(100, 104, 100, 28, '#F2D47A', '#8A6A1A', 3) + poly('92,108 150,60 208,108', '#C8402F', '#7A1A10') + rect(124, 66, 52, 26, '#F2D47A', '#8A6A1A', 3) + poly('114,70 150,22 186,70', '#C8402F', '#7A1A10') + path('M150 22v-14', '', '#C9A22A', 4) + circ(150, 8, 5, '#FFE066', '#C99A1B'), i;
    for (i = 0; i < 4; i++) s += win(96 + i * 30, 172, 20, 26, '#FFF3A0');
    s += rect(136, 214, 28, 20, '#8A3A1A', '#4A1A08', 2) + circ(62, 150, 6, '#FFE066') + circ(238, 150, 6, '#FFE066') + circ(72, 106, 5, '#FFE066') + circ(228, 106, 5, '#FFE066');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.gl_big = function (b) {
    var s = ell(100, 158, 84, 20, '#FFE57A', '#C9A22A') + ell(100, 152, 64, 14, '#FFF3A0') + rect(86, 90, 28, 62, '#F2C94C', '#8A6A1A', 3) + path('M86 100q-30 -10 -34 -40q20 10 34 24M114 100q30 -10 34 -40q-20 10 -34 24', '#F2D47A', '#8A6A1A', 2.4) + circ(100, 78, 14, '#FFE066', '#C99A1B') + path('M100 78v-32', '', '#F2C94C', 4) + path('M70 124q30 -26 60 0', '', '#FFF3A0', 3) + star(100, 36, 12, '#FFE066');
    return T(b.x * 100, b.y * 100, shadow(100, 186, 84, 6) + s);
  };
  ART.gl_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 4) + rect(44, 18, 12, 14, '#8A6A1A') + rect(26, 30, 48, 50, '#F2C94C', '#8A6A1A', 3) + path('M26 44h48M26 60h48', '', '#C9A22A', 2) + circ(50, 55, 12, '#C8402F', '#7A1A10') + path('M50 80v14', '', '#C8402F', 3) + circ(50, 96, 3, '#FFE066')); };
  ART.gl_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + poly('18,84 28,52 72,52 82,84', '#F2C94C', '#8A6A1A', 2.6) + poly('34,52 42,30 58,30 66,52', '#FFE066', '#8A6A1A', 2.6) + path('M30 72h40', '', '#FFF3A0', 3) + star(50, 22, 8, '#FFF3A0')); };

  /* ═════════ SẮC TÍM ═════════ */
  zone('th_violet', '#E0D0F8', '#D0BCF0', tuft('rgba(130,90,200,.5)', 'rgba(255,200,255,.5)'), { leaf: ['#B890F0', '#A880E0', '#C8A0FF'], bush: ['#A880E0', '#C8A0FF'], rock: ['#D8CCEC', '#E8E0F8'], post: '#C8B0F0', rail: '#B8A0E0' });
  ART.vl_house = function (b) {
    var s = rect(40, 150, 220, 100, '#D8C8F4', '#7A4AB8', 3) + rect(30, 60, 50, 110, '#C8B0F0', '#7A4AB8', 3) + poly('22,64 55,8 88,64', '#7A4AB8', '#4A2A7A') + rect(220, 70, 50, 100, '#C8B0F0', '#7A4AB8', 3) + poly('212,74 245,18 278,74', '#7A4AB8', '#4A2A7A') + rect(112, 90, 76, 70, '#E8DEF8', '#7A4AB8', 3) + poly('104,94 150,32 196,94', '#9A6ADA', '#4A2A7A') + circ(150, 130, 14, '#FFE066', '#C99A1B') + win(46, 90, 18, 28, '#FFF3A0') + win(236, 100, 18, 28, '#FFF3A0') + rect(136, 190, 28, 60, '#4A2A7A', '#2A1A4A', 3) + star(150, 22, 12, '#FFE066') + star(55, 4, 7, '#FFF3A0') + star(245, 12, 7, '#FFF3A0');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.vl_big = function (b) {
    var s = ell(100, 164, 84, 18, '#E8E0F8', '#B8A0E0'), cs = [[50, 150, 22, 80, '#9A6ADA'], [84, 154, 26, 110, '#B890F0'], [120, 150, 22, 70, '#7A4AB8'], [150, 156, 18, 56, '#C8A0FF']], i;
    for (i = 0; i < cs.length; i++) { var c = cs[i]; s += poly(c[0] + ',' + c[1] + ' ' + (c[0] - c[2] / 2) + ',' + (c[1] - c[3] * .7) + ' ' + c[0] + ',' + (c[1] - c[3]) + ' ' + (c[0] + c[2] / 2) + ',' + (c[1] - c[3] * .7) + ' ' + (c[0] + c[2]) + ',' + c[1], c[4], '#4A2A7A', 2.4) + path('M' + c[0] + ' ' + (c[1] - c[3]) + 'V' + c[1], '', 'rgba(255,255,255,.5)', 1.6); }
    return T(b.x * 100, b.y * 100, shadow(100, 186, 84, 6) + s + star(36, 40, 8, '#FFE066') + star(160, 30, 6, '#FFF3A0'));
  };
  ART.vl_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 24, 4) + rect(34, 70, 32, 18, '#D8CCEC', '#7A4AB8', 2.4) + circ(50, 48, 24, 'rgba(154,106,218,.85)', '#4A2A7A') + circ(42, 40, 8, 'rgba(255,255,255,.55)') + star(50, 50, 8, '#FFE066')); };
  ART.vl_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 20, 4) + rect(44, 18, 12, 14, '#8A5A2E') + path('M40 32h20l8 40q2 16 -18 16q-20 0 -18 -16z', 'rgba(154,106,218,.9)', '#4A2A7A', 2.6) + path('M36 60q14 8 28 0', '', 'rgba(255,255,255,.6)', 2.4) + circ(46, 50, 3, '#FFE066') + circ(56, 66, 2.4, '#FFF3A0')); };

  /* ═════════ XANH NGỌC ═════════ */
  zone('th_emerald', '#B8F0D0', '#9AE4BE', tuft('rgba(30,140,90,.55)', 'rgba(255,255,255,.45)'), { leaf: ['#3AB87A', '#2EA860', '#5AE8A8'], bush: ['#2EA860', '#7AE0A8'], rock: ['#B8D8C8', '#D0E8DC'], post: '#8AB8A0', rail: '#7AA890' });
  ART.em_house = function (b) {
    var s = rect(60, 232, 180, 18, '#9AC8B0', '#4A8A6A', 3), i;
    for (i = 0; i < 4; i++) { var y = 232 - (i + 1) * 46, w = 170 - i * 28; s += rect(150 - w / 2, y + 12, w, 34, '#B8F0D0', '#2E8A5A', 3) + poly((150 - w / 2 - 14) + ',' + (y + 14) + ' ' + 150 + ',' + (y - 6) + ' ' + (150 + w / 2 + 14) + ',' + (y + 14), '#2E8A5A', '#1A5A3A') + win(150 - w / 2 + 12, y + 20, 18, 18, '#FFF3A0') + win(150 + w / 2 - 30, y + 20, 18, 18, '#FFF3A0'); }
    s += rect(136, 194, 28, 38, '#8A5A2E', '#4A2A12', 3) + path('M150 4v20', '', '#C9A22A', 4) + circ(150, 6, 5, '#F2C94C');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s + path('M20 262q4 -60 10 -120M280 262q-4 -60 -10 -120', '', '#3AB87A', 8) + path('M30 142l14 -10M270 142l-14 -10', '', '#3AB87A', 5));
  };
  ART.em_big = function (b) {
    var s = ell(100, 158, 88, 22, '#7AD8C8', '#2E9A8A') + path('M20 152Q100 110 180 152', '#C9C2B4', '#8A8070', 3) + rect(24, 120, 6, 36, '#8A8070') + rect(170, 120, 6, 36, '#8A8070') + path('M20 136Q100 100 180 136', '', '#8A8070', 4), i;
    for (i = 0; i < 6; i++) s += rect(28 + i * 26, 30 + (i % 3) * 6, 8, 100 - (i % 3) * 6, '#3AB87A', '#1F8A5A', 2) + path('M' + (28 + i * 26) + ' ' + (60 + i * 3) + 'h8', '', '#1F8A5A', 1.6);
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.em_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 24, 4) + rect(30, 70, 40, 18, '#B8643A', '#6A3A1A', 2.6) + path('M50 70v-18M50 60q-22 -4 -26 -22q16 -6 26 8q10 -14 26 -8q-4 18 -26 22z', '#2EA860', '#1F6A3A', 2.4) + circ(34, 40, 8, '#3AB87A') + circ(66, 40, 8, '#3AB87A') + circ(50, 30, 10, '#5AE8A8')); };
  ART.em_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 20, 4) + rect(40, 76, 20, 12, '#B8C8C0', '#6A7A72', 2) + rect(44, 50, 12, 28, '#C9D8D0', '#6A7A72', 2) + rect(36, 38, 28, 14, '#D8E8E0', '#6A7A72', 2) + poly('32,40 50,22 68,40', '#8AA89A', '#4A6A5A') + rect(44, 42, 12, 8, '#FFF3A0')); };

  /* ═════════ HOÀNG HÔN ═════════ */
  zone('th_sunset', '#FFD8A8', '#FFC088', tuft('rgba(200,90,40,.5)', 'rgba(255,230,140,.55)'), { leaf: ['#E5533B', '#F2842E', '#D8403A'], bush: ['#C8402F', '#F2842E'], rock: ['#E8C8A8', '#F4DCC0'], post: '#C8905A', rail: '#B8803A' });
  ART.ss_house = function (b) {
    var s = circ(222, 76, 44, '#FFB84A', '#F2842E') + circ(222, 76, 28, '#FFE066') + rect(60, 150, 160, 100, '#FFE8D0', '#C8805A', 3) + poly('48,154 140,90 232,154', '#C8553A', '#7A2A1A') + rect(104, 100, 72, 60, '#FFD8A8', '#C8805A', 3) + win(66, 176, 30, 36, '#FFF3C8') + win(184, 176, 30, 36, '#FFF3C8') + win(122, 112, 36, 30, '#FFF3C8') + rect(126, 196, 28, 54, '#8A3A1A', '#4A1A08', 3) + path('M50 262q50 -10 100 0t100 0', '', '#FF8A4A', 3) + rect(244, 120, 14, 130, '#F4F0E0', '#C8805A', 2.4) + poly('238,122 251,96 264,122', '#E5334B', '#7A1A10') + circ(251, 134, 5, '#FFE066');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.ss_big = function (b) {
    var s = ell(100, 160, 90, 20, '#F4D8A8', '#C8A060') + path('M150 156q10 -50 4 -84M150 72q-26 -6 -36 12M150 72q26 -6 36 12M150 72q-8 -22 -26 -22M150 72q8 -22 26 -22', '', '#3F7A3A', 5) + path('M150 156q10 -50 4 -84', '', '#8A5A2E', 6) + poly('60,150 76,108 92,150', '#8A5A2E', '#4A2A12') + poly('66,150 76,122 86,150', '#FF8A2E') + poly('70,150 76,134 82,150', '#FFE066') + circ(30, 40, 22, '#FFB84A') + circ(30, 40, 14, '#FFE066');
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.ss_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 36, 4) + rect(10, 20, 8, 70, '#8A5A2E') + rect(82, 20, 8, 70, '#8A5A2E') + path('M18 36Q50 74 82 36', '#E5534B', '#7A1A10', 3) + path('M24 40Q50 66 76 40', '', '#FFD23F', 3) + circ(14, 18, 8, '#3F7A3A') + circ(86, 18, 8, '#3F7A3A')); };
  ART.ss_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 20, 4) + rect(48, 20, 5, 70, '#8A5A2E') + path('M10 40Q50 -4 90 40Q70 30 50 34Q30 30 10 40Z', '#FF8A2E', '#B8501A', 2.6) + path('M30 34l8 8M50 34v10M70 34l-8 8', '', '#FFD23F', 2)); };

  /* ═════════ BẠC TUYẾT ═════════ */
  zone('th_silver', '#F0F6FC', '#E0ECF8', sparks('rgba(160,200,235,.8)', 'rgba(255,255,255,.95)'), { leaf: ['#C9E0EE', '#B8D4E8', '#DCEEF8'], bush: ['#B8D4E8', '#E8F4FA'], rock: ['#D0DCE8', '#E8F0F8'], post: '#B8C8D8', rail: '#A8B8C8' });
  ART.sv_house = function (b) {
    var s = rect(50, 150, 200, 100, '#E8F4FA', '#7AA8C8', 3) + rect(40, 70, 50, 100, '#DDEEF8', '#7AA8C8', 3) + poly('32,74 65,10 98,74', '#BFE6F5', '#6AA0C0') + rect(210, 80, 50, 90, '#DDEEF8', '#7AA8C8', 3) + poly('202,84 235,24 268,84', '#BFE6F5', '#6AA0C0') + rect(110, 90, 80, 70, '#F0F8FC', '#7AA8C8', 3) + poly('100,94 150,30 200,94', '#8EC8E8', '#6AA0C0') + win(48, 100, 30, 26, '#EAF8FF') + win(220, 108, 30, 26, '#EAF8FF') + arcWinSv(150) + rect(136, 190, 28, 60, '#5A7A9A', '#3A5A7A', 3), i;
    for (i = 0; i < 9; i++) s += poly((60 + i * 22 - 4) + ',160 ' + (60 + i * 22 + 4) + ',160 ' + (60 + i * 22) + ',' + (176 + (i % 3) * 8), '#DDF2FF', 'rgba(0,0,0,.15)', 1);
    s += poly('44,76 65,40 86,76', 'rgba(255,255,255,.85)') + poly('216,86 235,50 254,86', 'rgba(255,255,255,.85)');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  function arcWinSv(cx) { return path('M' + (cx - 14) + ' 150V126Q' + (cx - 14) + ' 108 ' + cx + ' 108Q' + (cx + 14) + ' 108 ' + (cx + 14) + ' 126V150Z', '#EAF8FF', '#7AA8C8', 2); }
  ART.sv_big = function (b) {
    var s = ell(100, 150, 90, 28, '#DDF2FF', '#8EC8E8') + ell(100, 148, 74, 20, '#F4FAFF') + path('M40 148q30 -12 60 0t60 -6', '', '#BFE6F5', 3) + circ(70, 100, 16, '#FFFFFF', '#B8D4E8') + circ(70, 78, 11, '#FFFFFF', '#B8D4E8') + circ(70, 78, 0, '#fff') + rect(60, 62, 20, 8, '#2A3A5A') + circ(66, 76, 1.6, '#222') + circ(74, 76, 1.6, '#222') + poly('70,80 84,84 70,86', '#F2842E') + circ(140, 108, 14, '#FFFFFF', '#B8D4E8') + circ(140, 90, 10, '#FFFFFF', '#B8D4E8') + circ(137, 88, 1.5, '#222') + circ(143, 88, 1.5, '#222') + poly('140,92 152,95 140,98', '#F2842E');
    return T(b.x * 100, b.y * 100, shadow(100, 176, 84, 6, 'rgba(60,100,160,.18)') + s);
  };
  ART.sv_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 4) + circ(50, 70, 22, '#FFFFFF', '#B8D4E8') + circ(50, 42, 15, '#FFFFFF', '#B8D4E8') + rect(38, 24, 24, 8, '#2A3A5A') + rect(44, 14, 12, 12, '#2A3A5A') + circ(45, 40, 2, '#222') + circ(55, 40, 2, '#222') + poly('50,44 66,48 50,50', '#F2842E') + circ(50, 64, 2.4, '#222') + circ(50, 74, 2.4, '#222')); };
  ART.sv_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 20, 4) + rect(40, 78, 20, 10, '#8EA8C0', '#4A6A8A', 2) + poly('36,78 42,34 58,34 64,78', 'rgba(191,230,245,.9)', '#6AA0C0', 2.4) + path('M44 40l-2 34M50 36v40M56 40l2 34', '', 'rgba(255,255,255,.7)', 1.6) + circ(50, 56, 7, '#FFF3A0') + circ(50, 56, 12, 'rgba(255,243,160,.3)')); };

  /* ═════════ THIÊN VĂN ═════════ */
  zone('th_celestial', '#9AA8E8', '#8898DC', sparks('rgba(255,240,150,.9)', 'rgba(190,200,255,.8)'), { leaf: ['#7A8AF0', '#8A9AFF', '#6A7AE0'], bush: ['#6A7AE0', '#B8C0FF'], rock: ['#8A94C8', '#A8B0E0'], post: '#8A94C8', rail: '#7A84B8' });
  ART.cl_house = function (b) {
    var s = rect(70, 150, 160, 100, '#C8D0F0', '#4A5AB8', 3) + path('M60 152Q60 40 150 40Q240 40 240 152Z', '#E8ECFF', '#4A5AB8', 3) + path('M150 40V152M104 52Q116 100 120 152M196 52Q184 100 180 152', '', '#8A9AD8', 2) + poly('136,50 164,50 170,152 130,152', 'rgba(20,30,90,.85)', '#2A3A8A', 2) + rect(176, 70, 70, 14, '#7A8AF0', '#2A3A8A', 2.4) + path('M240 77l36 -34', '', '#B8C0FF', 8) + circ(280, 40, 6, '#FFE066') + rect(130, 180, 40, 70, '#2A3A8A', '#1A2A6A', 3) + circ(150, 215, 6, '#FFE066') + star(40, 40, 10, '#FFE066') + star(262, 100, 8, '#FFF3A0') + star(80, 100, 6, '#FFF3A0') + circ(30, 120, 18, '#F4F0D0', '#C8C0A0') + circ(24, 114, 3, 'rgba(0,0,0,.12)') + circ(36, 126, 4, 'rgba(0,0,0,.12)');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7, 'rgba(20,30,90,.3)') + s);
  };
  ART.cl_big = function (b) {
    var s = ell(100, 162, 80, 18, '#B8C0F0', '#6A7AC8') + rect(30, 150, 140, 8, '#8A94C8', '#4A5AB8', 2) + path('M50 150V96Q100 50 150 96V150', 'rgba(232,236,255,.85)', '#4A5AB8', 3) + path('M62 118Q100 86 138 118', '', '#B8C0FF', 2.4) + path('M100 56a24 24 0 1 0 22 32a18 18 0 1 1 -22 -32z', '#FFE066', '#C99A1B', 2.4) + star(40, 40, 8, '#FFF3A0') + star(160, 52, 7, '#FFE066');
    return T(b.x * 100, b.y * 100, shadow(100, 186, 80, 6) + s);
  };
  ART.cl_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 20, 4) + path('M40 88h20M50 88V66', '', '#8A94C8', 4) + circ(50, 46, 26, 'none', '#C9A22A') + path('M24 46Q50 30 76 46', '', '#C9A22A', 3) + path('M50 20V72', '', '#C9A22A', 3) + circ(50, 46, 7, '#7A8AF0', '#2A3A8A') + circ(70, 30, 4, '#FFE066')); };
  ART.cl_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 16, 4) + rect(48, 52, 5, 38, '#6A7AC8') + star(50, 34, 24, '#FFE066') + circ(50, 34, 30, 'rgba(255,224,102,.25)') + path('M72 20l22 -10M74 30l20 -2', '', 'rgba(255,240,170,.8)', 3)); };
})(typeof window !== 'undefined' ? window : this);
