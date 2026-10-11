/* EWT Garden — 10 khu văn hoá quốc gia mới (cảnh dựng sẵn): Bồ Đào Nha, Ba Lan, Áo, Đan Mạch, Phần Lan, Iceland, Cộng hoà Séc, Hungary, Philippines, New Zealand.
   Quốc kỳ chuẩn (garden-flags.js) cho Ba Lan, Áo, Đan Mạch, Phần Lan, Iceland, Séc, Hungary. Bồ Đào Nha, Philippines, New Zealand KHÔNG vẽ quốc kỳ (quốc huy / ngôi sao / Union Jack phức tạp, chưa đủ chắc thông số) — thay bằng vật phẩm văn hoá. Nạp SAU garden-world12.js. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;
  function tuft(c1, c2) { return function (R, W, H2) { return scatter(R, W, H2, 26, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q4 -9 8 0q4 -9 8 0" stroke="' + (i % 2 ? c1 : c2) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; }); }; }
  function zone(id, g1, g2, c1, c2, dth) { THEME[id] = { g1: g1, g2: g2, ground: tuft(c1, c2) }; DTH[id] = dth; }
  function win(x, y, w, h) { return rect(x, y, w, h, '#CFE8F5', '#6A8AA0', 2) + path('M' + (x + w / 2) + ' ' + y + 'v' + h + 'M' + x + ' ' + (y + h / 2) + 'h' + w, '', '#6A8AA0', 1.6); }
  function tree(x, y, s, c1, c2) { return rect(x - 4 * s, y - 6 * s, 8 * s, 36 * s, '#8A5A2E') + circ(x, y - 18 * s, 22 * s, c1) + circ(x - 14 * s, y - 8 * s, 14 * s, c2) + circ(x + 15 * s, y - 6 * s, 14 * s, c2); }
  function gableHouse(x, y, w, h, wall, roof) { return rect(x, y, w, h, wall, 'rgba(0,0,0,.3)', 2) + poly((x - 4) + ',' + y + ' ' + (x + w / 2) + ',' + (y - h * .42) + ' ' + (x + w + 4) + ',' + y, roof, 'rgba(0,0,0,.3)') + win(x + w * .2, y + h * .18, w * .22, h * .22) + win(x + w * .58, y + h * .18, w * .22, h * .22) + rect(x + w * .38, y + h * .58, w * .24, h * .42, '#6A3A1E', '', 2); }

  /* ═════════ BỒ ĐÀO NHA ═════════ */
  zone('portugal', '#B8D88A', '#9CC870', 'rgba(110,150,70,.5)', 'rgba(230,190,70,.45)', { leaf: ['#7AAA5A', '#6A9A4A', '#9ABC6B'], bush: ['#6A9A4A', '#8AB86A'], rock: ['#C9C2B4', '#DDD6C8'], post: '#B8A88A', rail: '#A89878' });
  ART.pt_house = function (b) {
    var s = ell(150, 270, 140, 24, '#5BA8D8', '#2E7FB0') + path('M20 270q30 -8 60 0t60 0t60 0t60 0', '', 'rgba(255,255,255,.5)', 3) + rect(90, 70, 120, 190, '#E8DCC0', '#B8A88A', 3) + rect(80, 56, 140, 18, '#D8CCB0', '#B8A88A', 3), i;
    for (i = 0; i < 7; i++) s += rect(80 + i * 21, 40, 14, 18, '#D8CCB0', '#B8A88A', 2);
    s += rect(60, 110, 40, 150, '#E8DCC0', '#B8A88A', 3) + rect(200, 110, 40, 150, '#E8DCC0', '#B8A88A', 3);
    [60, 200].forEach(function (x) { s += rect(x - 4, 96, 48, 16, '#D8CCB0', '#B8A88A', 3) + poly((x + 4) + ',96 ' + (x + 20) + ',72 ' + (x + 36) + ',96', '#C8553A', '#7A2A1A'); });
    s += path('M92 110h116M92 150h116', '', '#2B6BC8', 4) + win(108, 120, 26, 24) + win(166, 120, 26, 24) + win(136, 170, 28, 30) + rect(132, 226, 36, 34, '#5A3A1E', '#3A2410', 3) + path('M120 90Q150 74 180 90', '', '#2B6BC8', 3) + circ(150, 100, 7, '#F2C94C', '#C99A1B') + path('M150 40v-26', '', '#8A5A2E', 4) + poly('150,14 176,22 150,30', '#2B9B6A') ;
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.pt_big = function (b) {
    var s = rect(10, 160, 180, 6, '#6A6A74') + rect(20, 80, 160, 62, '#F2C94C', '#B8932E', 8) + rect(20, 80, 160, 12, '#E5334B') + win(32, 98, 28, 26) + win(70, 98, 28, 26) + win(108, 98, 28, 26) + win(146, 98, 28, 26) + path('M20 128h160', '', '#B8932E', 3) + circ(46, 150, 9, '#3A3A42') + circ(154, 150, 9, '#3A3A42') + path('M100 80v-22M70 58h60', '', '#3A3A42', 4) + path('M60 58l-16 -10M140 58l16 -10', '', '#3A3A42', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.pt_item2 = function (b) {
    var s = rect(10, 12, 80, 80, '#FFFFFF', '#2B6BC8', 3), i, j;
    for (i = 0; i < 4; i++) for (j = 0; j < 4; j++) s += rect(14 + i * 20, 16 + j * 20, 18, 18, '#FFFFFF', '#2B6BC8', 1) + circ(23 + i * 20, 25 + j * 20, 5, (i + j) % 2 ? '#2B6BC8' : '#7FA8E8') + path('M' + (14 + i * 20) + ' ' + (25 + j * 20) + 'h18M' + (23 + i * 20) + ' ' + (16 + j * 20) + 'v18', '', '#2B6BC8', 1.4);
    return T(b.x * 100, b.y * 100, shadow(50, 94, 34, 4) + s);
  };
  ART.pt_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 24, 5) + path('M30 80Q26 54 34 40Q30 24 44 20Q50 8 58 20Q72 22 68 40Q76 54 70 80Z', '#2A2A34', '#000', 2) + path('M44 20Q40 8 48 8M54 20Q56 8 62 10M50 16q-4 -8 2 -12', '', '#E5334B', 3) + poly('68,34 82,38 68,42', '#F2A32C') + circ(58, 30, 3, '#fff') + circ(58, 30, 1.4, '#000') + circ(42, 52, 4, '#E5334B') + circ(54, 62, 4, '#2E9B6A') + circ(46, 70, 3, '#F2C94C') + path('M44 80v8M56 80v8', '', '#F2A32C', 3)); };

  /* ═════════ BA LAN ═════════ */
  zone('poland', '#B0DC8A', '#94CA70', 'rgba(90,150,60,.5)', 'rgba(220,60,70,.4)', { leaf: ['#5AAA4A', '#4A9A3C', '#7FC86B'], bush: ['#4A9A3C', '#6AB85A'], rock: ['#A8A09A', '#C9C2BC'], post: '#E8E4D8', rail: '#C9C2B4' });
  ART.pl_house = function (b) {
    var s = gableHouse(10, 100, 86, 170, '#F2C94C', '#B8452E') + gableHouse(100, 80, 90, 190, '#E8742E', '#6A5A4A') + gableHouse(196, 110, 92, 160, '#7FA8D8', '#8A3A2E');
    s += path('M10 130h86M100 118h90M196 138h92', '', '#FFFFFF', 4) + rect(40, 70, 20, 30, '#F4EAD8', '#B8A88A', 2) + circ(150, 60, 10, '#F4EAD8', '#B8A88A') + path('M150 50v-14M144 44h12', '', '#8A5A2E', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.pl_big = function (b) {
    var s = rect(60, 130, 80, 40, '#B8AC9C', '#8A8070', 4) + rect(50, 164, 100, 16, '#8A8070', '#5A5448', 3) + path('M100 130Q88 100 100 84Q112 100 100 130Z', '#2E9B6A', '#16603A', 2) + circ(100, 78, 11, '#F4D0A8', '#B8906A') + path('M89 78Q100 56 111 78Q100 70 89 78Z', '#8A5A2E') + path('M112 98L136 62', '', '#C9D0D9', 4) + poly('136,62 142,56 138,70', '#C9D0D9') + path('M84 100Q68 100 70 118Q82 124 88 114Z', '#E5334B', '#7A1E10', 2) + path('M60 140q-10 -8 -26 -2M140 140q10 -8 26 -2', '', '#5BC6E8', 4);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.pl_flag = flagPole('pl');
  ART.pl_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + ell(50, 74, 36, 12, '#F4EAD8', '#B8A88A') + path('M24 68Q38 40 52 64Q62 38 78 66Q60 78 24 68Z', '#F2D9A0', '#C9A66A', 2.4) + path('M30 62q10 -8 16 2M54 60q10 -10 18 4', '', '#C9A66A', 2) + circ(66, 54, 4, '#4FAE62') + path('M62 54l8 0', '', '#2E7D4F', 2)); };

  /* ═════════ ÁO ═════════ */
  zone('austria', '#B0DCA0', '#98CC88', 'rgba(70,140,70,.5)', 'rgba(230,230,240,.5)', { leaf: ['#4A9A5A', '#3C8A4A', '#7FC87B'], bush: ['#3C8A4A', '#5DB265'], rock: ['#A8B0BA', '#C9D0D8'], post: '#A8744A', rail: '#8A5A2E' });
  ART.at_house = function (b) {
    var s = path('M0 290Q60 120 150 110Q240 120 300 290Z', '#6AA84A', '#3E7A2E', 3) + path('M30 270Q100 190 150 186Q210 190 270 270', '', 'rgba(255,255,255,.2)', 4);
    s += rect(70, 120, 160, 70, '#F4EAD8', '#B8A88A', 3) + poly('60,126 150,60 240,126', '#8A5A4A', '#4A2A1E') + rect(130, 80, 40, 50, '#F4EAD8', '#B8A88A', 3) + poly('124,84 150,36 176,84', '#B8452E', '#6A241B') + rect(76, 94, 30, 34, '#E8DCC0', '#B8A88A', 3) + poly('72,98 91,66 110,98', '#B8452E', '#6A241B') + rect(194, 94, 30, 34, '#E8DCC0', '#B8A88A', 3) + poly('190,98 209,66 228,98', '#B8452E', '#6A241B');
    s += win(96, 140, 20, 26) + win(140, 140, 20, 26) + win(184, 140, 20, 26) + rect(138, 168, 24, 22, '#5A3A1E', '#3A2410', 2) + path('M150 36v-18', '', '#8A5A2E', 3) + poly('150,18 170,24 150,30', '#ED2939');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.at_big = function (b) {
    var s = rect(20, 120, 150, 14, '#8A5A2E', '#5A3A1A', 3) + path('M30 118Q30 78 70 74L160 70Q178 82 160 106Q150 118 130 118Z', '#2A2A34', '#000', 3) + path('M46 112v22M80 112v22M130 112v22', '', '#2A2A34', 5) + path('M44 76L40 54Q58 44 80 70', '#3A3A44', '#000', 2) + rect(54, 100, 90, 8, '#F4EAD8', '#B8A88A', 1);
    ['#B66CFF', '#E5334B', '#2B6BC8'].forEach(function (c, i) { s += circ(30 + i * 56, 38 + (i % 2) * 14, 5, c) + path('M' + (35 + i * 56) + ' ' + (38 + (i % 2) * 14) + 'v-22', '', c, 3) + path('M' + (35 + i * 56) + ' ' + (16 + (i % 2) * 14) + 'q10 4 14 12', '', c, 3); });
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.at_flag = flagPole('at');
  ART.at_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 28, 5) + poly('14,66 86,50 86,78 14,86', '#5A2E1E', '#2E140A') + poly('14,66 86,50 86,60 14,76', '#3A1E12') + path('M14 74L86 58', '', '#E8742E', 3) + ell(50, 44, 30, 8, '#5A2E1E', '#2E140A') + path('M26 44q24 -8 48 0', '', '#8A5A3A', 3) + circ(50, 40, 5, '#E5334B') + path('M44 40q6 -2 12 0', '', '#fff', 2)); };

  /* ═════════ ĐAN MẠCH ═════════ */
  zone('denmark', '#B0DCA0', '#98CC88', 'rgba(70,140,70,.5)', 'rgba(200,40,60,.35)', { leaf: ['#4A9A5A', '#3C8A4A', '#7FC87B'], bush: ['#3C8A4A', '#5DB265'], rock: ['#A8A09A', '#C9C2BC'], post: '#F4EAD8', rail: '#D9C9A8' });
  ART.dk_house = function (b) {
    var s = rect(0, 250, 300, 40, '#5BA8D8', '#2E7FB0') + path('M10 262q20 -6 40 0t40 0t40 0t40 0t40 0t40 0t40 0', '', 'rgba(255,255,255,.5)', 3);
    var cols = ['#F2C94C', '#E5334B', '#2B6BC8', '#2E9B6A', '#E8742E'];
    cols.forEach(function (c, i) { var x = 6 + i * 58, h2 = 130 + (i % 2) * 24; s += rect(x, 250 - h2, 54, h2, c, 'rgba(0,0,0,.3)', 2) + poly((x + 4) + ',' + (250 - h2) + ' ' + (x + 27) + ',' + (250 - h2 - 28) + ' ' + (x + 50) + ',' + (250 - h2), '#F4EAD8', 'rgba(0,0,0,.3)') + win(x + 8, 250 - h2 + 14, 16, 22) + win(x + 30, 250 - h2 + 14, 16, 22) + win(x + 8, 250 - h2 + 54, 16, 22) + win(x + 30, 250 - h2 + 54, 16, 22) + rect(x + 20, 250 - 34, 14, 34, '#5A3A1E', '', 2); });
    s += path('M226 262Q248 236 290 262Z', '#8A5A2E', '#5A3A1A', 2) + rect(256, 224, 5, 40, '#8A5A2E') + poly('261,226 288,252 261,252', '#F4EAD8', '#B8A88A');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.dk_big = function (b) {
    var s = ell(100, 170, 90, 18, '#5BA8D8', '#2E7FB0') + path('M30 160Q40 110 90 108Q150 104 170 160Z', '#8A8A92', '#5A5A62', 3) + path('M60 138q20 -10 50 -4', '', '#A8A8B2', 4) + path('M92 108Q84 84 96 68Q104 84 100 108Z', '#2E9B6A', '#16603A', 2) + circ(98, 62, 9, '#F4D0A8', '#B8906A') + path('M89 60Q98 40 108 60', '#8A5A2E') + path('M104 108q12 6 8 18q-6 -6 -10 -10Z', '#2E9B6A', '#16603A', 2) + path('M20 172q20 -8 40 0M120 174q20 -8 40 0', '', 'rgba(255,255,255,.6)', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.dk_flag = flagPole('dk');
  ART.dk_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + rect(12, 42, 76, 38, '#E5334B', '#8A1E1E', 3) + path('M12 54h76', '', 'rgba(255,255,255,.3)', 2) + circ(26, 38, 7, '#E5334B', '#8A1E1E') + circ(50, 38, 7, '#E5334B', '#8A1E1E') + circ(74, 38, 7, '#E5334B', '#8A1E1E') + circ(26, 38, 3, 'rgba(255,255,255,.35)') + circ(50, 38, 3, 'rgba(255,255,255,.35)') + circ(74, 38, 3, 'rgba(255,255,255,.35)')); };

  /* ═════════ PHẦN LAN ═════════ */
  zone('finland', '#B8E0B0', '#A0D098', 'rgba(60,130,90,.5)', 'rgba(220,235,245,.55)', { leaf: ['#3F8A5A', '#2F7A4A', '#6FB88A'], bush: ['#2F7A4A', '#4F9A6A'], rock: ['#A8B0BA', '#C9D0D8'], post: '#A8744A', rail: '#8A5A2E' });
  ART.fi_house = function (b) {
    var s = rect(0, 220, 300, 70, '#6FB8D8', '#3E8AB0') + path('M10 240q30 -8 60 0t60 0t60 0t60 0', '', 'rgba(255,255,255,.5)', 3) + rect(140, 238, 150, 8, '#A8744A', '#6A4A2E', 2) + rect(150, 246, 6, 24, '#6A4A2E') + rect(270, 246, 6, 24, '#6A4A2E');
    s += rect(40, 120, 150, 100, '#B8703A', '#6A3A1A', 3) + path('M40 144h150M40 168h150M40 192h150', '', 'rgba(90,50,20,.4)', 2) + poly('26,126 115,64 204,126', '#6A4A3E', '#3A2418') + rect(150, 64, 18, 40, '#8A8A92', '#5A5A62', 2) + rect(86, 164, 40, 56, '#4A2E1A', '#2A1A0E', 3) + win(52, 138, 26, 24) + win(144, 138, 26, 24);
    s += circ(160, 50, 10, 'rgba(230,234,240,.85)') + circ(168, 34, 13, 'rgba(230,234,240,.7)') + tree(250, 190, .8, '#2F6A4A', '#3A7A5A') + tree(14, 200, .6, '#2F6A4A', '#3A7A5A');
    s += path('M20 28Q80 6 150 24Q220 40 290 14', '', '#5BE8A8', 10) + path('M20 38Q90 18 160 36Q230 50 290 26', '', 'rgba(180,120,255,.5)', 8);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6, 'rgba(20,50,60,.2)') + s);
  };
  ART.fi_big = function (b) {
    var s = poly('100,24 170,150 30,150', '#C98A4B', '#6A3A1A') + poly('100,24 100,150 30,150', '#B8703A') + path('M64 90L136 90M48 120L152 120', '', '#6A3A1A', 3) + poly('86,150 100,100 114,150', '#2A1A0E') + path('M100 24v-14', '', '#8A5A2E', 3), i;
    s += circ(160, 170, 9, '#E8742E') + path('M156 170q4 -14 8 0', '', '#F2C94C', 3) + path('M150 178h22', '', '#6A4A2E', 4) + ell(48, 166, 14, 8, '#B8A88A') + path('M42 160l-6 -10M54 160l6 -10', '', '#8A5A2E', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.fi_flag = flagPole('fi');
  ART.fi_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 28, 5) + poly('16,78 70,22 84,38 36,84', '#C98A4B', '#6A3A1A') + path('M30 76L72 30M42 76L78 36M54 80L84 40', '', '#F4EAD8', 1.6) + circ(70, 24, 4, '#8A5A2E') + circ(82, 36, 4, '#8A5A2E')); };

  /* ═════════ ICELAND ═════════ */
  zone('iceland', '#B8D8B0', '#A0C8A0', 'rgba(70,130,100,.5)', 'rgba(230,240,245,.55)', { leaf: ['#5A9A6A', '#4A8A5A', '#7FB88A'], bush: ['#4A8A5A', '#6AA87A'], rock: ['#5A5A62', '#8A8A92'], post: '#8A8A92', rail: '#5A5A62' });
  ART.is_house = function (b) {
    var s = '', i;
    for (i = 0; i < 5; i++) { var x = 96 + i * 22; s += rect(x, 280 - 160 + i * 14 - (i > 2 ? (i - 2) * 28 : 0), 20, 160 - i * 14 + (i > 2 ? (i - 2) * 28 : 0), '#EDEDED', '#B8BCC4', 2); }
    s += poly('130,120 150,30 170,120', '#EDEDED', '#B8BCC4') + rect(138, 50, 24, 230, '#EDEDED', '#B8BCC4', 3) + path('M150 30v-22', '', '#8A94A8', 3) + path('M146 10h8', '', '#8A94A8', 3);
    s += rect(70, 200, 160, 80, '#EDEDED', '#B8BCC4', 3) + win(92, 220, 18, 36) + win(128, 220, 18, 36) + win(164, 220, 18, 36) + win(200, 220, 18, 36) + rect(136, 244, 28, 36, '#5A6478', '#3A4458', 3);
    for (i = 0; i < 7; i++) s += path('M' + (84 + i * 22) + ' 280V' + (210 - (i % 2) * 14), '', 'rgba(150,160,180,.5)', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 130, 7) + s);
  };
  ART.is_big = function (b) {
    var s = ell(100, 170, 80, 18, '#5BC6E8', '#2E8FB0') + ell(100, 170, 56, 10, '#9AE0F4') + path('M94 170Q90 100 96 52Q100 40 104 52Q110 100 106 170Z', 'rgba(220,245,255,.95)', '#9AC8E0', 2) + path('M96 70Q70 56 62 76M104 70Q130 56 138 76M98 54Q82 36 70 46M102 54Q118 36 130 46', '', 'rgba(220,245,255,.9)', 6) + circ(100, 46, 10, 'rgba(255,255,255,.9)') + circ(78, 60, 8, 'rgba(255,255,255,.85)') + circ(124, 62, 8, 'rgba(255,255,255,.85)') + path('M30 172q10 -10 20 0M150 174q10 -10 20 0', '', '#5A5A62', 4);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.is_flag = flagPole('is');
  ART.is_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 24, 5) + ell(50, 62, 22, 28, '#2A2A34') + ell(50, 68, 14, 20, '#FFFFFF') + circ(50, 36, 14, '#2A2A34') + ell(44, 34, 8, 8, '#FFFFFF') + poly('56,32 80,40 56,48', '#FF8A1F', '#C25A00') + path('M56 38h18', '', '#E5334B', 3) + circ(46, 32, 2.6, '#222') + path('M42 88h-6M58 88h6', '', '#FF8A1F', 4)); };

  /* ═════════ CỘNG HOÀ SÉC ═════════ */
  zone('czechia', '#B4DC94', '#9CCC7C', 'rgba(80,140,60,.5)', 'rgba(200,60,70,.4)', { leaf: ['#5AAA4A', '#4A9A3C', '#7FC86B'], bush: ['#4A9A3C', '#6AB85A'], rock: ['#A8A09A', '#C9C2BC'], post: '#E8E4D8', rail: '#C9C2B4' });
  ART.cz_house = function (b) {
    var s = rect(98, 90, 104, 190, '#E8DCC0', '#B8A88A', 3) + poly('90,96 150,10 210,96', '#4A7A8A', '#2A4A5A') + poly('120,100 150,34 180,100', '#5A8A9A') + rect(104, 36, 12, 56, '#E8DCC0', '#B8A88A', 2) + rect(184, 36, 12, 56, '#E8DCC0', '#B8A88A', 2) + poly('100,38 110,12 120,38', '#4A7A8A') + poly('180,38 190,12 200,38', '#4A7A8A');
    s += circ(150, 150, 34, '#2B4A8A', '#C9A22A') + circ(150, 150, 26, '#3A5AA0') + circ(150, 150, 6, '#F2C94C') + path('M150 124v52M124 150h52M132 132l36 36M168 132l-36 36', '', '#F2C94C', 1.6) + circ(150, 150, 34, 'none', '#C9A22A') + rect(124, 198, 52, 20, '#2B4A8A', '#C9A22A', 3) + circ(138, 208, 5, '#F2C94C') + circ(162, 208, 5, '#E8E4D8');
    s += rect(60, 170, 40, 110, '#F2C0A0', '#B8906A', 3) + poly('54,174 80,130 106,174', '#C8654A', '#7A3A22') + win(68, 190, 24, 26) + rect(200, 190, 44, 90, '#B8D8E8', '#7A9AB0', 3) + poly('194,194 222,152 250,194', '#8A3A2E', '#4A1A12') + win(210, 206, 24, 26);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.cz_big = function (b) {
    var s = rect(0, 100, 200, 14, '#8A8070', '#5A5448', 3) + rect(0, 114, 200, 40, '#A89E8A', '#5A5448', 3), i;
    for (i = 0; i < 3; i++) s += path('M' + (14 + i * 62) + ' 154Q' + (45 + i * 62) + ' 106 ' + (76 + i * 62) + ' 154Z', '#5BA8D8', '#3A3A42', 3);
    [[40, '#2A2A34'], [100, '#3A3A44'], [160, '#2A2A34']].forEach(function (q) { s += rect(q[0] - 6, 64, 12, 36, q[1]) + circ(q[0], 58, 8, q[1]) + path('M' + (q[0] - 14) + ' 70l14 -6l14 6', '', q[1], 3); });
    s += poly('96,100 100,70 104,100', '#C9A22A');
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s + path('M0 172q30 -8 60 0t60 0t60 0t20 0', '', 'rgba(255,255,255,.6)', 3));
  };
  ART.cz_flag = flagPole('cz');
  ART.cz_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 24, 5) + rect(26, 22, 48, 62, '#C98A4B', '#6A3A1A', 14) + path('M28 34q22 8 44 0M28 46q22 8 44 0M28 58q22 8 44 0M28 70q22 8 44 0', '', '#8A5A2E', 3) + ell(50, 22, 24, 7, '#E8B070', '#6A3A1A') + path('M30 22q20 -8 40 0', '', '#F4EAD8', 3)); };

  /* ═════════ HUNGARY ═════════ */
  zone('hungary', '#B4DC8E', '#9CCC76', 'rgba(80,140,60,.5)', 'rgba(205,42,62,.35)', { leaf: ['#5AAA4A', '#4A9A3C', '#7FC86B'], bush: ['#4A9A3C', '#6AB85A'], rock: ['#A8A09A', '#C9C2BC'], post: '#E8E4D8', rail: '#C9C2B4' });
  ART.hu_house = function (b) {
    var s = rect(0, 256, 300, 36, '#5B9ED8', '#2E70B0') + path('M10 270q30 -8 60 0t60 0t60 0t60 0', '', 'rgba(255,255,255,.5)', 3) + rect(20, 150, 260, 106, '#EDE4D0', '#B8A88A', 3) + rect(110, 90, 80, 66, '#EDE4D0', '#B8A88A', 3) + path('M100 96Q150 20 200 96Z', '#C8554A', '#7A2A22', 3) + path('M122 90Q150 40 178 90', '', 'rgba(255,255,255,.35)', 3) + path('M150 22v-16', '', '#C9A22A', 3), i;
    for (i = 0; i < 7; i++) s += poly((28 + i * 36) + ',150 ' + (42 + i * 36) + ',118 ' + (56 + i * 36) + ',150', '#C8554A', '#7A2A22') + win(32 + i * 36, 170, 20, 34) + win(32 + i * 36, 214, 20, 28);
    s += rect(120, 110, 60, 46, '#D8CCB0', '#B8A88A', 2) + path('M130 156V116M150 156V112M170 156V116', '', '#B8A88A', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.hu_big = function (b) {
    var s = rect(0, 124, 200, 10, '#8A8A92', '#5A5A62', 3) + rect(20, 70, 26, 90, '#D8CCB0', '#B8A88A', 3) + rect(154, 70, 26, 90, '#D8CCB0', '#B8A88A', 3) + path('M20 70Q33 40 46 70M154 70Q167 40 180 70', '#D8CCB0', '#B8A88A', 3) + path('M46 130Q100 170 154 130', '', '#8A8A92', 4) + path('M46 94Q100 120 154 94', '', '#C9A22A', 4), i;
    for (i = 0; i < 9; i++) s += path('M' + (58 + i * 12) + ' ' + (102 + Math.sin(i / 8 * Math.PI) * 8) + 'V126', '', '#C9A22A', 2);
    s += path('M0 170q30 -8 60 0t60 0t60 0t20 0', '', '#5BA8D8', 6);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.hu_flag = flagPole('hu');
  ART.hu_item = function (b) {
    var s = '', i, j, cs = ['#E5334B', '#F2C94C', '#2B6BC8', '#2E9B6A', '#FFFFFF', '#F2842E'];
    s += poly('50,14 84,32 50,50 16,32', '#FFFFFF', '#555');
    for (i = 0; i < 3; i++) for (j = 0; j < 3; j++) { var cx = 50 + (i - j) * 11 + 0, cy = 24 + (i + j) * 6.5; s += poly((cx) + ',' + (cy - 7) + ' ' + (cx + 11) + ',' + (cy - 1) + ' ' + cx + ',' + (cy + 5) + ' ' + (cx - 11) + ',' + (cy - 1), cs[(i + j * 2) % 6], '#333'); }
    s += poly('16,32 50,50 50,88 16,70', '#E5334B', '#333') + poly('50,50 84,32 84,70 50,88', '#2B6BC8', '#333') + path('M16 44l34 18M16 57l34 18M33 41v38M39 40v38', '', '#333', 1.4);
    return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 5) + s);
  };

  /* ═════════ PHILIPPINES ═════════ */
  zone('philippines', '#A8E090', '#8CD076', 'rgba(60,150,70,.5)', 'rgba(250,200,60,.45)', { leaf: ['#3F9A4A', '#2F8A3A', '#6FC87B'], bush: ['#2F8A3A', '#4FAA5A'], rock: ['#A89A88', '#C2B6A4'], post: '#B8873A', rail: '#9A6A2A' });
  ART.ph_house = function (b) {
    var s = '', i; for (i = 0; i < 6; i++) { var x = 26 + i * 46, y = 250 - (i % 3) * 22; s += path('M' + (x - 38) + ' ' + y + 'Q' + x + ' ' + (y - 74) + ' ' + (x + 38) + ' ' + y + 'Z', i % 2 ? '#8A6A3A' : '#7A5A2E', '#4A3A1A', 2.4) + path('M' + (x - 22) + ' ' + (y - 18) + 'Q' + x + ' ' + (y - 50) + ' ' + (x + 22) + ' ' + (y - 18), '', 'rgba(120,180,70,.55)', 5); }
    s += tree(268, 232, .8, '#3F9A4A', '#2F8A3A') + path('M254 232Q264 190 246 168M268 232Q280 186 298 172', '', '#2E9B4A', 5) + ell(30, 270, 18, 9, '#4A4A52') + path('M16 270q-6 -12 0 -20M44 270q6 -12 -2 -20', '', '#4A4A52', 5) + circ(50, 258, 7, '#4A4A52') + path('M44 252q-8 -4 -10 -12M56 252q8 -4 12 -12', '', '#C9B88A', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.ph_big = function (b) {
    var s = rect(10, 94, 180, 56, '#F2C94C', '#B8932E', 12) + rect(10, 94, 180, 14, '#E5334B') + rect(14, 120, 172, 8, '#2B6BC8') + path('M10 108h180', '', '#fff', 2), i;
    for (i = 0; i < 5; i++) s += win(24 + i * 32, 108, 22, 18);
    s += rect(150, 70, 36, 28, '#F2C94C', '#B8932E', 6) + win(156, 76, 24, 16) + circ(44, 156, 14, '#2A2A34', '#000') + circ(44, 156, 5, '#8A94A8') + circ(150, 156, 14, '#2A2A34', '#000') + circ(150, 156, 5, '#8A94A8') + path('M30 94l-12 -14M170 94l12 -14', '', '#E5334B', 3) + poly('88,72 100,60 112,72 100,84', '#F2C94C', '#B8932E');
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.ph_item2 = function (b) {
    var s = '', i, a, pts = []; for (i = 0; i < 10; i++) { a = (-90 + i * 36) * Math.PI / 180; pts.push((50 + Math.cos(a) * (i % 2 ? 14 : 36)).toFixed(1) + ',' + (50 + Math.sin(a) * (i % 2 ? 14 : 36)).toFixed(1)); }
    s += path('M50 6v10', '', '#8A5A2E', 3) + poly(pts.join(' '), '#F2C94C', '#C99A1B') + circ(50, 50, 9, '#E5334B', '#8A1E1E') + path('M50 82l-6 10M50 82l0 12M50 82l6 10', '', '#E5334B', 3);
    return T(b.x * 100, b.y * 100, shadow(50, 94, 20, 4) + s);
  };
  ART.ph_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + path('M26 54Q24 24 54 22Q80 30 76 58Q70 84 44 84Q24 80 26 54Z', '#F2A32C', '#B8701A', 2.4) + path('M34 40Q44 30 58 32', '', 'rgba(255,255,255,.5)', 4) + path('M52 22Q56 8 70 8Q66 20 54 24Z', '#3F9A4A', '#2A6A32', 2) + circ(50, 22, 3, '#6A4A2E')); };

  /* ═════════ NEW ZEALAND ═════════ */
  zone('newzealand', '#A8E0A0', '#8CD088', 'rgba(60,150,80,.5)', 'rgba(230,240,250,.5)', { leaf: ['#3F9A5A', '#2F8A4A', '#6FC88A'], bush: ['#2F8A4A', '#4FAA6A'], rock: ['#9AA3AE', '#B9C1CB'], post: '#8A5A2E', rail: '#6A4A2E' });
  ART.nz_house = function (b) {
    var s = poly('20,150 150,40 280,150', '#8A3A2E', '#4A1A12') + poly('34,150 150,56 266,150', '#C8402F', '#7A241B') + rect(34, 150, 232, 100, '#8A5A2E', '#4A2A12', 3) + rect(98, 174, 104, 76, '#4A2A12', '#2A1408', 3) + rect(46, 164, 40, 44, '#6A4A2A', '#3A2410', 2) + rect(214, 164, 40, 44, '#6A4A2A', '#3A2410', 2), i;
    s += path('M20 150L150 40L280 150', '', '#F4EAD8', 6) + circ(150, 74, 12, '#F4EAD8', '#B8A88A') + path('M150 62q-8 -6 -2 -12M150 62q8 -6 2 -12', '', '#C8402F', 3) + path('M150 40v-24', '', '#C8402F', 4);
    for (i = 0; i < 5; i++) s += path('M' + (60 + i * 46) + ' 150q8 14 0 28', '', '#E8DCC0', 3);
    for (i = 0; i < 4; i++) s += path('M' + (110 + i * 26) + ' 190q6 8 0 16q6 6 -2 14', '', '#C8402F', 3);
    s += rect(104, 230, 92, 14, '#B8A88A', '#8A7A5A', 2);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.nz_big = function (b) {
    var s = ell(100, 150, 96, 22, '#5BC6E8', '#2E8FB0') + path('M0 154q24 -8 48 0t48 0t48 0t56 0', '', 'rgba(255,255,255,.6)', 3) + path('M16 120Q100 150 184 100L176 90Q100 128 24 104Z', '#8A3A2E', '#4A1A12', 3) + path('M16 120Q100 154 184 100', '', '#C8402F', 4) + poly('184,100 196,76 176,90', '#8A3A2E', '#4A1A12'), i;
    for (i = 0; i < 5; i++) s += path('M' + (36 + i * 28) + ' ' + (108 + Math.sin(i / 4 * 2) * 8) + 'v-10', '', '#4A1A12', 3);
    for (i = 0; i < 4; i++) s += circ(50 + i * 28, 86, 9, '#F4D0A8', '#B8906A') + path('M' + (46 + i * 28) + ' 80h8', '', '#2A2A34', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6, 'rgba(20,60,80,.18)') + s);
  };
  ART.nz_item2 = function (b) {
    var s = path('M50 90Q50 44 52 10', '', '#2E7D4F', 4), i; for (i = 0; i < 8; i++) { var y = 18 + i * 9; s += path('M51 ' + y + 'q-' + (22 - i * 1.6) + ' ' + (6) + ' -' + (30 - i * 2.4) + ' ' + (18 - i) + 'M51 ' + y + 'q' + (22 - i * 1.6) + ' 6 ' + (30 - i * 2.4) + ' ' + (18 - i), '', '#6FAE8A', 3.4); }
    return T(b.x * 100, b.y * 100, shadow(50, 94, 20, 4) + s + circ(52, 8, 3, '#E8F0F4'));
  };
  ART.nz_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + ell(46, 62, 28, 24, '#8A6A4A', '#4A3A2A') + path('M30 50q4 -10 14 -8M40 48q4 -10 14 -6M52 46q4 -10 14 -6', '', '#6A4A2E', 2) + circ(72, 50, 8, '#8A6A4A', '#4A3A2A') + path('M78 50Q96 52 98 70', '', '#E8DCC0', 3) + circ(74, 48, 1.8, '#222') + path('M40 86v-6M52 86v-6', '', '#E8B060', 3)); };
})(typeof window !== 'undefined' ? window : this);
