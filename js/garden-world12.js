/* EWT Garden — 10 NÔNG TRẠI quốc gia (cảnh dựng sẵn): Việt Nam, Hà Lan, Thuỵ Sĩ, Úc, Hoa Kỳ, Mexico, Argentina, Mông Cổ, Pháp, Kenya.
   Mỗi nông trại: công trình biểu tượng (3×3), cảnh văn hoá (2×2), cột cờ chuẩn (1×1; nước chưa chắc thông số quốc kỳ thì thay bằng vật phẩm) và một vật phẩm (1×1). Nạp SAU garden-world11.js. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;
  function tuft(c1, c2) { return function (R, W, H2) { return scatter(R, W, H2, 26, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q4 -9 8 0q4 -9 8 0" stroke="' + (i % 2 ? c1 : c2) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; }); }; }
  function zone(id, g1, g2, c1, c2, dth) { THEME[id] = { g1: g1, g2: g2, ground: tuft(c1, c2) }; DTH[id] = dth; }
  function tree(x, y, s, c1, c2) { return rect(x - 4 * s, y - 6 * s, 8 * s, 36 * s, '#8A5A2E') + circ(x, y - 18 * s, 22 * s, c1) + circ(x - 14 * s, y - 8 * s, 14 * s, c2) + circ(x + 15 * s, y - 6 * s, 14 * s, c2); }
  function fence(x, y, n, c) { var s = path('M' + x + ' ' + (y + 6) + 'h' + n * 20 + 'M' + x + ' ' + (y + 16) + 'h' + n * 20, '', c, 3), i; for (i = 0; i <= n; i++) s += rect(x + i * 20 - 2, y, 4, 24, c, '', 1); return s; }
  function bale(x, y, c) { return rect(x, y, 30, 22, c, '#9A7A2A', 4) + path('M' + (x + 4) + ' ' + (y + 6) + 'h22M' + (x + 4) + ' ' + (y + 14) + 'h22', '', 'rgba(120,80,10,.4)', 2); }
  function window2(x, y, w, h) { return rect(x, y, w, h, '#CFE8F5', '#6A8AA0', 2) + path('M' + (x + w / 2) + ' ' + y + 'v' + h + 'M' + x + ' ' + (y + h / 2) + 'h' + w, '', '#6A8AA0', 1.6); }

  /* ═════════ 1. VIỆT NAM — nông trại lúa nước ═════════ */
  zone('farmvn', '#A8DC7A', '#86C65E', 'rgba(60,140,60,.5)', 'rgba(120,180,60,.5)', { leaf: ['#4FB04A', '#3C9A44', '#7FD36B'], bush: ['#3C9A44', '#5DBE55'], rock: ['#9AA3AE', '#B9C1CB'], post: '#C9A66A', rail: '#B8873A' });
  ART.fvn_house = function (b) {
    var s = '', i;
    for (i = 0; i < 4; i++) s += path('M' + (0 + i * 6) + ' ' + (120 + i * 28) + 'Q150 ' + (96 + i * 28) + ' ' + (300 - i * 6) + ' ' + (120 + i * 28) + 'V' + (140 + i * 28) + 'H' + (i * 6) + 'Z', i % 2 ? '#C8D860' : '#8CC84A', '#5E9A2E', 2.2) + path('M' + (14 + i * 6) + ' ' + (126 + i * 28) + 'Q150 ' + (106 + i * 28) + ' ' + (286 - i * 6) + ' ' + (126 + i * 28), '', 'rgba(255,255,255,.45)', 2);
    s += rect(86, 130, 8, 70, '#9A7A3A', '', 2) + rect(206, 130, 8, 70, '#9A7A3A', '', 2) + rect(80, 120, 140, 14, '#C9A66A', '#8A6A2E', 3) + rect(92, 76, 116, 46, '#D9B47A', '#8A6A2E', 3) + poly('70,82 150,22 230,82 218,86 150,40 82,86', '#C9A040', '#7A5A1A') + path('M92 84l-6 22M120 84l-6 26M150 84v26M180 84l6 26M208 84l6 22', '', 'rgba(110,70,20,.45)', 2) + rect(136, 92, 28, 30, '#3A2A1A', '', 3) + path('M150 134L170 190', '', '#9A7A3A', 5);
    s += tree(262, 130, 1.1, '#3F9A44', '#2E8A3A') + path('M250 130Q258 90 242 64M262 130Q272 90 290 70M268 126Q290 110 296 92', '', '#2E9B4A', 5);
    s += ell(46, 252, 22, 11, '#5A5048') + path('M30 252q-8 -14 0 -26M62 252q8 -14 -2 -26', '', '#5A5048', 6) + circ(70, 240, 9, '#5A5048') + path('M66 232q-10 -8 -14 -2M76 232q10 -8 14 -2', '', '#D8D0B8', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.fvn_big = function (b) {
    var s = rect(10, 80, 180, 100, '#6FB8D8', '#3E7FA0', 3) + path('M10 106h180M10 132h180M10 158h180', '', 'rgba(255,255,255,.35)', 2), i;
    for (i = 0; i < 22; i++) s += path('M' + (20 + (i % 11) * 16) + ' ' + (92 + Math.floor(i / 11) * 40) + 'v-14', '', '#7BC24A', 3);
    s += rect(130, 40, 8, 60, '#9A7A3A') + rect(168, 40, 8, 60, '#9A7A3A') + rect(124, 30, 58, 22, '#D9B47A', '#8A6A2E', 3) + poly('118,34 153,8 188,34', '#C9A040', '#7A5A1A') + circ(60, 60, 12, '#EBDCA2', '#B89A4A') + path('M42 62Q60 36 78 62', '#EBDCA2', '#B89A4A', 2);
    return T(b.x * 100, b.y * 100, shadow(100, 190, 90, 6) + s);
  };
  ART.fvn_flag = flagPole('vn');
  ART.fvn_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + ell(50, 80, 22, 8, '#8A6A4A') + path('M32 78Q34 44 50 40Q66 44 68 78Z', '#C9A66A', '#8A6A2E', 2.4) + rect(46, 14, 8, 44, '#8A5A2E') + path('M40 14h20', '', '#8A5A2E', 5) + path('M38 62h24', '', 'rgba(110,70,20,.5)', 2)); };

  /* ═════════ 2. HÀ LAN — trang trại bò sữa ═════════ */
  zone('farmnl', '#9ED878', '#7CC45C', 'rgba(60,130,60,.5)', 'rgba(150,200,70,.55)', { leaf: ['#4FA04A', '#3C8A44', '#7FC86B'], bush: ['#3C8A44', '#5DB255'], rock: ['#9AA3AE', '#B9C1CB'], post: '#F4EAD8', rail: '#D9C9A8' });
  ART.fnl_house = function (b) {
    var s = rect(20, 150, 130, 130, '#B8452E', '#6A2A1A', 3) + poly('10,156 85,100 160,156', '#6A5A4A', '#3A2A1A') + rect(60, 200, 50, 80, '#F4EAD8', '#B8A88A', 3) + path('M60 200L110 280M110 200L60 280M85 200v80', '', '#B8452E', 4) + window2(66, 130, 38, 30) + path('M30 150Q85 110 140 150', '', '#F4EAD8', 4);
    s += rect(190, 190, 14, 90, '#F4EAD8', '#B8A88A', 3) + poly('178,196 197,150 216,196', '#B8532E', '#6A2A1A') + circ(197, 178, 5, '#CFE8F5');
    s += rect(176, 214, 42, 66, '#E8DCC0', '#B8A88A', 3) + path('M197 220L197 140', '', '#8A5A2E', 6) + path('M197 140L238 108M197 140L156 108M197 140L238 172M197 140L156 172', '', '#8A5A2E', 5) + poly('236,104 246,112 232,122', '#F4EAD8', '#B8A88A') + poly('158,104 148,112 162,122', '#F4EAD8', '#B8A88A') + poly('236,176 246,168 232,160', '#F4EAD8', '#B8A88A') + poly('158,176 148,168 162,160', '#F4EAD8', '#B8A88A');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.fnl_big = function (b) {
    var s = rect(20, 118, 160, 16, '#8A5A2E', '#5A3A1A', 3) + rect(30, 134, 8, 46, '#8A5A2E') + rect(162, 134, 8, 46, '#8A5A2E') + poly('10,122 100,64 190,122', '#C8402F', '#7A241B') + path('M50 100h100', '', '#F4EAD8', 4), i;
    for (i = 0; i < 4; i++) s += circ(44 + i * 38, 150, 16, '#F2C94C', '#C98A00') + path('M' + (44 + i * 38) + ' 140v20', '', '#E8A82E', 2) + circ(44 + i * 38, 156, 3, '#E8A82E');
    s += rect(90, 140, 20, 14, '#2B6BC8', '#16407A', 2);
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.fnl_flag = flagPole('nl');
  ART.fnl_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + ell(50, 72, 32, 14, '#E8A82E', '#B87A00') + ell(50, 62, 32, 14, '#F2C94C', '#C98A00') + path('M18 62v10M82 62v10', '', '#C98A00', 2) + path('M30 62Q50 74 70 62', '', 'rgba(160,100,0,.4)', 2) + circ(50, 58, 4, '#E5334B')); };

  /* ═════════ 3. THUỴ SĨ — nông trại Alps ═════════ */
  zone('farmch', '#A8D8A0', '#8CC888', 'rgba(60,130,70,.5)', 'rgba(200,230,150,.6)', { leaf: ['#4A9A5A', '#3C8A4A', '#7FC87B'], bush: ['#3C8A4A', '#5DB265'], rock: ['#A8B0BA', '#C9D0D8'], post: '#A8744A', rail: '#8A5A2E' });
  ART.fch_house = function (b) {
    var s = poly('0,150 70,50 140,150', '#B8C4D4', '#7A8AA0') + poly('50,150 130,30 210,150', '#CFD8E4', '#7A8AA0') + poly('112,60 130,30 148,60 138,56 130,66 122,56', '#FFFFFF') + poly('150,150 230,70 300,150', '#B8C4D4', '#7A8AA0');
    s += rect(60, 170, 180, 100, '#C98A4B', '#6A3A1A', 3) + path('M60 190h180M60 210h180M60 230h180M60 250h180', '', 'rgba(90,50,20,.35)', 2) + poly('44,176 150,120 256,176', '#8A5A3A', '#4A2A12') + poly('44,176 150,120 256,176 240,176 150,134 60,176', '#6A3A2A') + rect(132, 210, 36, 60, '#5A3A1E', '#3A2410', 2) + window2(78, 190, 34, 30) + window2(188, 190, 34, 30);
    s += path('M70 232q80 12 160 0', '', '#E5334B', 4) + path('M90 240l4 -10M120 244l4 -10M150 245l4 -10M180 244l4 -10M210 240l4 -10', '', '#E5334B', 3) + circ(150, 196, 6, '#F2C94C', '#C99A1B');
    s += tree(268, 200, 0.7, '#2F6A4A', '#3A7A4A') + ell(30, 266, 18, 8, '#F4EAD8') + circ(22, 258, 7, '#F4EAD8') + circ(40, 262, 4, '#2A2A34');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 134, 7) + s);
  };
  ART.fch_big = function (b) {
    var s = rect(40, 100, 120, 80, '#E8DCC0', '#8A6A3A', 3) + poly('28,106 100,50 172,106', '#8A3A2E', '#4A1A12') + rect(84, 128, 32, 52, '#5A3A1E', '#3A2410', 2) + window2(50, 118, 26, 24) + window2(126, 118, 26, 24), i;
    for (i = 0; i < 3; i++) s += rect(20 + i * 26, 162 - i * 4, 22, 26, '#C98A4B', '#6A3A1A', 3) + path('M' + (20 + i * 26) + ' ' + (172 - i * 4) + 'h22M' + (20 + i * 26) + ' ' + (180 - i * 4) + 'h22', '', '#8A94A8', 2);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s + circ(150, 150, 14, '#F2C94C', '#C98A00') + circ(150, 150, 5, '#E8A82E'));
  };
  ART.fch_flag = flagPole('ch');
  ART.fch_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 26, 5) + path('M36 24h28', '', '#8A5A2E', 6) + poly('36,28 64,28 74,74 26,74', '#C9A22A', '#8A6A1A') + ell(50, 76, 24, 7, '#E8C75A', '#8A6A1A') + circ(50, 82, 6, '#8A5A2E') + path('M40 40l-6 28M60 40l6 28', '', 'rgba(110,80,10,.4)', 2)); };

  /* ═════════ 4. ÚC — trạm cừu outback ═════════ */
  zone('farmau', '#D8D08A', '#C8BE70', 'rgba(150,120,50,.5)', 'rgba(190,160,70,.55)', { leaf: ['#7A9A4A', '#6A8A3A', '#9ABA5A'], bush: ['#7A9A4A', '#A8B86A'], rock: ['#C8956A', '#D8A87A'], post: '#8A5A2E', rail: '#A8744A' });
  ART.fau_house = function (b) {
    var s = rect(30, 120, 220, 150, '#C98A4B', '#6A3A1A', 3) + path('M30 150h220M30 180h220M30 210h220M30 240h220', '', 'rgba(90,50,20,.3)', 2) + poly('14,126 140,60 266,126', '#C8D0D8', '#7A8A98') + path('M44 118L140 70L236 118M70 118L140 82L210 118', '', 'rgba(100,110,120,.45)', 2);
    s += rect(110, 190, 60, 80, '#6A3A1A', '#3A2410', 2) + path('M110 190L170 270M170 190L110 270M140 190v80', '', '#8A5A2E', 4) + window2(50, 160, 30, 26) + window2(200, 160, 30, 26);
    s += rect(262, 60, 8, 210, '#8A94A8') + circ(266, 56, 22, 'none', '#6A7488') + path('M266 34v44M244 56h44M250 40L282 72M282 40L250 72', '', '#8A94A8', 3) + rect(256, 250, 22, 20, '#8A94A8', '#5A6478', 2);
    s += path('M6 270Q18 220 40 232Q56 210 44 262', '', '#6A8A3A', 5) + circ(24, 224, 20, '#7A9A5A') + circ(44, 214, 14, '#6A8A4A');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.fau_big = function (b) {
    var s = bale(30, 120, '#F4EAD8') + bale(66, 120, '#F4EAD8') + bale(102, 120, '#F4EAD8') + bale(48, 94, '#F4EAD8') + bale(84, 94, '#F4EAD8') + bale(66, 68, '#F4EAD8') + '<g stroke="rgba(120,100,60,.4)">' + path('M30 128h30M66 128h30M102 128h30M48 102h30M84 102h30M66 76h30', '', 'rgba(120,100,60,.5)', 2) + '</g>';
    s += ell(150, 150, 26, 14, '#F4EAD8', '#B8A88A') + circ(172, 136, 10, '#F4EAD8', '#B8A88A') + circ(168, 134, 2, '#222') + path('M138 164v12M160 164v12', '', '#8A6A4A', 4);
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.fau_flag = flagPole('au');
  ART.fau_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + rect(34, 40, 32, 44, '#8A94A8', '#5A6478', 4) + rect(38, 28, 24, 16, '#8A94A8', '#5A6478', 3) + path('M62 54q16 4 12 22', '', '#5A6478', 4) + path('M40 28q10 -14 20 0', '', '#5A6478', 3) + rect(42, 60, 16, 10, '#E8742E', '', 2)); };

  /* ═════════ 5. HOA KỲ — ranch miền Tây ═════════ */
  zone('farmus', '#A8D870', '#8CC458', 'rgba(60,140,50,.5)', 'rgba(190,200,70,.5)', { leaf: ['#5AAA3A', '#4A9A32', '#7FC85B'], bush: ['#4A9A32', '#6AB84A'], rock: ['#A8A09A', '#C9C2BC'], post: '#8A5A2E', rail: '#A8744A' });
  ART.fus_house = function (b) {
    var s = rect(20, 130, 170, 140, '#C8402F', '#7A241B', 3) + poly('6,138 105,60 204,138 190,142 105,76 20,142', '#C8402F', '#7A241B') + poly('6,138 105,60 204,138', '#B8352A', '#7A241B') + rect(70, 178, 70, 92, '#F4EAD8', '#B8A88A', 3) + path('M70 178L140 270M140 178L70 270M105 178v92', '', '#C8402F', 5) + window2(88, 100, 34, 28);
    s += rect(214, 80, 44, 190, '#C9D0D9', '#8A94A8', 3) + ell(236, 80, 22, 10, '#A8B0BC', '#8A94A8') + path('M214 120h44M214 160h44M214 200h44M214 240h44', '', '#8A94A8', 2) + path('M214 80Q236 40 258 80', '#B8C0CC', '#8A94A8', 2);
    s += rect(268, 150, 18, 120, '#8A5A2E') + poly('262,150 277,120 292,150', '#C8402F');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.fus_big = function (b) {
    var s = rect(30, 100, 130, 50, '#C98A4B', '#6A3A1A', 3) + path('M30 114h130M30 128h130', '', 'rgba(90,50,20,.35)', 2) + circ(52, 162, 18, '#3A3A42', '#1A1A22') + circ(52, 162, 7, '#8A94A8') + circ(140, 162, 18, '#3A3A42', '#1A1A22') + circ(140, 162, 7, '#8A94A8') + ell(95, 92, 52, 22, '#E8C75A', '#B8943A') + ell(95, 82, 40, 16, '#F2D76A') + path('M60 90q35 -14 70 0', '', 'rgba(160,110,10,.4)', 2) + rect(158, 120, 36, 8, '#8A5A2E', '', 2);
    return T(b.x * 100, b.y * 100, shadow(100, 186, 86, 6) + s);
  };
  ART.fus_flag = flagPole('us');
  ART.fus_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + path('M10 62Q50 76 90 62Q80 40 66 46Q50 26 34 46Q20 40 10 62Z', '#C98A4B', '#6A3A1A', 2.6) + path('M16 60Q50 70 84 60', '', '#8A5A2E', 4) + circ(50, 44, 4, '#F2C94C', '#C99A1B')); };

  /* ═════════ 6. MEXICO — hacienda ═════════ */
  zone('farmmx', '#C8D86E', '#B4C85A', 'rgba(150,130,40,.5)', 'rgba(90,150,50,.5)', { leaf: ['#6A9A3A', '#5A8A32', '#8AB84A'], bush: ['#5A8A32', '#7AA84A'], rock: ['#C8956A', '#D8A87A'], post: '#B8703A', rail: '#8A5A2E' });
  ART.fmx_house = function (b) {
    var s = rect(20, 130, 260, 140, '#F2C0A0', '#B8703A', 3) + rect(20, 130, 260, 14, '#E8A07A') + rect(110, 70, 80, 64, '#F2C0A0', '#B8703A', 3) + path('M104 78Q150 20 196 78', '#B8532E', '#6A2A16', 3) + rect(138, 40, 24, 30, '#F2C0A0', '#B8703A', 2) + circ(150, 54, 7, '#F2C94C', '#C99A1B') + path('M150 40v-14', '', '#8A5A2E', 4) + circ(150, 24, 4, '#E5334B');
    var i; for (i = 0; i < 4; i++) s += path('M' + (36 + i * 62) + ' 270V196Q' + (60 + i * 62) + ' 170 ' + (84 + i * 62) + ' 196V270', '#6A3A1E', '#3A2410', 2.4);
    s += window2(124, 92, 52, 30) + rect(26, 150, 6, 24, '#2B6BC8') + path('M30 150q40 -12 80 0', '', '#E5334B', 3);
    for (i = 0; i < 5; i++) s += circ(46 + i * 52, 156, 5, ['#E5334B', '#F2C94C', '#2B9BD8'][i % 3]);
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.fmx_big = function (b) {
    var s = '', i; for (i = 0; i < 6; i++) { var x = 24 + (i % 3) * 52, y = 96 + Math.floor(i / 3) * 40; s += path('M' + x + ' ' + (y + 30) + 'Q' + (x - 14) + ' ' + y + ' ' + (x - 4) + ' ' + (y - 14) + 'M' + x + ' ' + (y + 30) + 'Q' + x + ' ' + (y - 10) + ' ' + x + ' ' + (y - 24) + 'M' + x + ' ' + (y + 30) + 'Q' + (x + 14) + ' ' + y + ' ' + (x + 4) + ' ' + (y - 14), '', '#5E9A8A', 6); }
    s += rect(140, 120, 40, 50, '#8A5A2E', '#5A3A1A', 5) + path('M140 134h40M140 156h40', '', '#C9A66A', 3) + ell(160, 120, 20, 7, '#C9A66A', '#8A5A2E');
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.fmx_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + path('M36 20V84', '', '#8A5A2E', 4) + ell(36, 38, 10, 16, '#C8402F', '#7A1E10') + ell(50, 52, 10, 16, '#D9482E', '#7A1E10') + ell(64, 36, 10, 16, '#C8402F', '#7A1E10') + ell(50, 70, 9, 14, '#4FAE62', '#2E7D4F') + path('M30 20h40', '', '#8A5A2E', 4)); };
  ART.fmx_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 26, 5) + rect(46, 40, 8, 48, '#8A5A2E') + rect(14, 14, 72, 32, '#F2C94C', '#8A6A1A', 5) + path('M26 34q8 -14 12 0q6 -10 14 0M60 36v-12M54 30h12', '', '#2E7D4F', 3) + circ(24, 24, 3, '#E5334B') + circ(76, 24, 3, '#E5334B')); };

  /* ═════════ 7. ARGENTINA — estancia ═════════ */
  zone('farmar', '#C0D880', '#A8C868', 'rgba(150,170,60,.55)', 'rgba(100,150,50,.5)', { leaf: ['#6A9A3A', '#5A8A32', '#8AB84A'], bush: ['#5A8A32', '#7AA84A'], rock: ['#B8AC9C', '#D0C6B4'], post: '#8A5A2E', rail: '#A8744A' });
  ART.far_house = function (b) {
    var s = rect(24, 140, 252, 120, '#F4EAD8', '#B8A88A', 3) + poly('10,146 150,80 290,146', '#B8532E', '#6A2A16') + path('M40 140h220', '', '#8A5A2E', 5) + rect(100, 180, 44, 80, '#8A5A2E', '#5A3A1A', 3) + window2(46, 166, 36, 32) + window2(200, 166, 36, 32) + path('M24 260H276', '', '#8A5A2E', 6), i;
    for (i = 0; i < 6; i++) s += rect(36 + i * 40, 230, 6, 30, '#8A5A2E');
    s += path('M30 262Q10 250 22 232', '', '#2E9B4A', 5) + circ(30, 240, 14, '#4A8A3C') + path('M262 262Q290 250 280 232', '', '#2E9B4A', 5) + circ(272, 240, 14, '#4A8A3C');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 140, 7) + s);
  };
  ART.far_big = function (b) {
    var s = path('M30 150H170', '', '#6A6A74', 5) + path('M40 150v-22M160 150v-22M70 150v-22M130 150v-22M100 150v-22', '', '#6A6A74', 4) + path('M36 128H164', '', '#6A6A74', 4) + rect(46, 98, 108, 18, '#B8452E', '#7A2A1A', 5) + path('M54 106h92', '', '#E8742E', 3) + path('M54 98l-6 -10M82 98l-4 -12M110 98l-2 -12M138 98l4 -12', '', 'rgba(220,220,230,.6)', 4) + ell(100, 168, 40, 10, '#4A3A2E') + path('M76 168q24 -16 48 0', '', '#E8742E', 4);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.far_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 24, 5) + rect(46, 36, 8, 52, '#8A5A2E') + path('M30 36h40', '', '#8A5A2E', 6) + circ(30, 50, 8, '#C98A4B', '#8A5A2E') + circ(70, 54, 8, '#C98A4B', '#8A5A2E') + path('M30 42Q50 66 70 46', '', '#C9A66A', 3)); };
  ART.far_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 26, 5) + rect(46, 40, 8, 48, '#8A5A2E') + rect(14, 14, 72, 30, '#F4EAD8', '#B8A88A', 4) + path('M20 24h60M20 34h40', '', '#8A5A2E', 4) + circ(76, 30, 6, '#E8742E')); };

  /* ═════════ 8. MÔNG CỔ — du mục ═════════ */
  zone('farmmn', '#C0D888', '#A8C870', 'rgba(130,170,60,.5)', 'rgba(200,210,100,.55)', { leaf: ['#7AA84A', '#6A9A3A', '#9AC85A'], bush: ['#6A9A3A', '#8AB85A'], rock: ['#B8AC9C', '#D0C6B4'], post: '#8A5A2E', rail: '#A8744A' });
  ART.fmn_house = function (b) {
    function ger(x, y, s) { return ell(x, y + 56 * s, 62 * s, 12 * s, 'rgba(60,50,30,.25)') + rect(x - 52 * s, y + 6 * s, 104 * s, 52 * s, '#F4EAD8', '#B8A88A', 6) + path('M' + (x - 62 * s) + ' ' + (y + 12 * s) + 'Q' + x + ' ' + (y - 50 * s) + ' ' + (x + 62 * s) + ' ' + (y + 12 * s) + 'Z', '#FFFFFF', '#B8A88A', 2.4) + path('M' + (x - 40 * s) + ' ' + (y - 8 * s) + 'Q' + x + ' ' + (y - 38 * s) + ' ' + (x + 40 * s) + ' ' + (y - 8 * s), '', '#2B6BC8', 4) + rect(x - 12 * s, y + 24 * s, 24 * s, 34 * s, '#E8742E', '#8A3A14', 3) + path('M' + (x - 52 * s) + ' ' + (y + 14 * s) + 'h104', '', '#C8402F', 5) + circ(x, y - 40 * s, 5 * s, '#C8402F') + path('M' + x + ' ' + (y - 36 * s) + 'v-12', '', '#8A5A2E', 3); }
    var s = ger(96, 120, 1.05) + ger(214, 156, .8) + rect(160, 200, 6, 60, '#8A5A2E') + path('M150 204h28M150 224h28', '', '#8A5A2E', 4) + path('M130 270q8 -40 36 -50', '', 'rgba(120,80,30,.3)', 4);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.fmn_big = function (b) {
    var s = path('M30 150Q100 20 170 150Z', '#B8AC9C', '#8A8070', 3) + path('M60 130Q100 70 140 130', '', '#9A8E7C', 3) + path('M100 20L100 70', '', '#8A5A2E', 4), i;
    for (i = 0; i < 6; i++) s += path('M100 ' + (22 + i * 4) + 'q' + (i % 2 ? 24 : -24) + ' ' + (8) + ' ' + (i % 2 ? 40 : -40) + ' ' + (14 + i * 6), '', ['#2B9BD8', '#FFFFFF', '#E5334B', '#F2C94C', '#2E9B6A', '#2B9BD8'][i], 4);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.fmn_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + path('M14 32Q50 8 86 32Q70 44 50 40Q30 44 14 32Z', '#2B9BD8', '#16609A', 2.4) + path('M18 36Q50 56 82 36', '', '#2B9BD8', 5) + path('M24 46Q50 66 76 46', '', '#FFFFFF', 4) + path('M50 40v44', '', '#8A5A2E', 4)); };
  ART.fmn_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 26, 5) + path('M20 70Q50 6 80 70', '', '#8A5A2E', 6) + path('M20 70L80 70', '', '#F4EAD8', 3) + path('M30 66L86 30', '', '#B8AC9C', 4) + poly('84,26 96,28 88,38', '#8A94A8')); };

  /* ═════════ 9. PHÁP — Provence ═════════ */
  zone('farmfr', '#B8D88A', '#9CC870', 'rgba(110,150,70,.5)', 'rgba(170,120,200,.45)', { leaf: ['#7AAA5A', '#6A9A4A', '#9ABC6B'], bush: ['#8E5FC4', '#7AAA5A'], rock: ['#C9C2B4', '#DDD6C8'], post: '#B8A88A', rail: '#A89878' });
  ART.ffr_house = function (b) {
    var s = '', i; for (i = 0; i < 4; i++) s += path('M' + (6 + i * 10) + ' ' + (276) + 'Q' + (150) + ' ' + (218 + i * 8) + ' ' + (294 - i * 10) + ' 276', '', i % 2 ? '#8E5FC4' : '#A878D8', 7);
    s += rect(40, 120, 220, 130, '#E8DCC0', '#B8A88A', 3) + path('M40 150h220M40 180h220M40 210h220', '', 'rgba(150,130,90,.3)', 2) + poly('26,126 150,56 274,126', '#C8654A', '#7A3A22') + path('M50 118L150 66L250 118', '', 'rgba(255,255,255,.25)', 3) + rect(130, 170, 40, 80, '#5A8AA8', '#2E5A78', 3) + window2(60, 150, 40, 40) + window2(200, 150, 40, 40) + rect(56, 152, 8, 36, '#5A8AA8') + rect(236, 152, 8, 36, '#5A8AA8') + rect(210, 70, 18, 40, '#D8CCB0', '#B8A88A', 2);
    s += path('M250 276Q268 240 262 210', '', '#4F8A3A', 5) + circ(262, 202, 18, '#8AAA6A') + circ(250, 218, 12, '#7A9A5A');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.ffr_big = function (b) {
    var s = '', i, j; for (j = 0; j < 3; j++) { s += path('M' + (10 + j * 6) + ' ' + (170 - j * 40) + 'Q100 ' + (140 - j * 40) + ' ' + (190 - j * 6) + ' ' + (170 - j * 40), '', j % 2 ? '#A878D8' : '#8E5FC4', 14); for (i = 0; i < 10; i++) s += path('M' + (24 + i * 16 + j * 4) + ' ' + (166 - j * 40) + 'v-10', '', '#6A3A9A', 2); }
    s += rect(150, 120, 30, 36, '#E8C75A', '#B8943A', 4) + path('M150 132h30M150 144h30', '', '#B8943A', 2) + poly('146,122 165,106 184,122', '#C8654A', '#7A3A22');
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.ffr_flag = flagPole('fr');
  ART.ffr_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 24, 5) + rect(32, 34, 36, 50, '#E8B040', '#8A6A1A', 6) + rect(36, 26, 28, 12, '#C9A66A', '#8A6A3A', 3) + path('M36 54h28M36 66h28', '', 'rgba(140,100,10,.45)', 2) + rect(40, 46, 20, 14, '#F4EAD8', '#B8A88A', 2) + circ(50, 53, 4, '#E5334B')); };

  /* ═════════ 10. KENYA — làng Maasai ═════════ */
  zone('farmke', '#D8CC84', '#C8BC6C', 'rgba(150,120,50,.5)', 'rgba(180,160,70,.55)', { leaf: ['#8AA84A', '#7A983A', '#A8C85A'], bush: ['#7A983A', '#A8B86A'], rock: ['#C8956A', '#D8A87A'], post: '#8A5A2E', rail: '#A8744A' });
  ART.fke_house = function (b) {
    function hut(x, y, s) { return ell(x, y + 50 * s, 44 * s, 8 * s, 'rgba(60,50,30,.25)') + rect(x - 36 * s, y + 6 * s, 72 * s, 44 * s, '#B8703A', '#6A3A1A', 6) + path('M' + (x - 46 * s) + ' ' + (y + 10 * s) + 'L' + x + ' ' + (y - 36 * s) + 'L' + (x + 46 * s) + ' ' + (y + 10 * s) + 'Z', '#D8B060', '#8A6A2A', 2.4) + path('M' + (x - 30 * s) + ' ' + (y + 6 * s) + 'l' + (6 * s) + ' ' + (-26 * s) + 'M' + x + ' ' + (y + 6 * s) + 'v' + (-40 * s) + 'M' + (x + 30 * s) + ' ' + (y + 6 * s) + 'l' + (-6 * s) + ' ' + (-26 * s), '', 'rgba(110,70,20,.45)', 2) + rect(x - 8 * s, y + 26 * s, 16 * s, 24 * s, '#3A2A1A', '', 8); }
    var s = hut(80, 150, 1.1) + hut(210, 130, 0.9) + hut(170, 220, 0.8), i;
    for (i = 0; i < 14; i++) s += path('M' + (20 + i * 19) + ' 270l6 -16l6 16M' + (20 + i * 19) + ' 268l12 -6', '', '#6A4A2A', 2.4);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.fke_big = function (b) {
    var s = rect(94, 80, 12, 100, '#6A4A2A') + path('M100 90Q60 60 20 78M100 90Q140 60 180 78M100 70Q80 36 40 44M100 70Q120 36 160 44', '', '#6A4A2A', 6) + ell(100, 52, 84, 28, '#6A9A4A', '#3A6A2E') + ell(100, 40, 62, 18, '#7FB24A'), i;
    s += ell(52, 176, 20, 10, '#C98A4B') + circ(70, 166, 8, '#C98A4B') + path('M62 160l-6 -8M78 160l6 -8', '', '#8A5A2E', 3) + ell(150, 178, 20, 10, '#B8703A') + circ(168, 168, 8, '#B8703A');
    return T(b.x * 100, b.y * 100, shadow(100, 188, 86, 6) + s);
  };
  ART.fke_item = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 90, 24, 5) + path('M50 14L50 84', '', '#8A5A2E', 4) + poly('44,14 56,14 50,2', '#8A94A8', '#5A6478') + path('M26 36Q50 28 74 36Q74 66 50 82Q26 66 26 36Z', '#E5334B', '#7A1E10', 2.4) + path('M50 30V82M30 50h40', '', '#2A2A34', 3) + circ(50, 54, 6, '#F4EAD8', '#2A2A34')); };
  ART.fke_item2 = function (b) { return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 5) + path('M18 60Q50 20 82 60', '', '#2B6BC8', 7) + path('M26 62Q50 32 74 62', '', '#E5334B', 5) + path('M34 64Q50 44 66 64', '', '#F4EAD8', 4) + circ(50, 28, 4, '#F2C94C')); };
})(typeof window !== 'undefined' ? window : this);
