/* EWT Garden — 12 khu văn hoá quốc gia mới (phần 5: CHÂU PHI — Kenya, Nam Phi, Ethiopia, Madagascar). Nạp SAU garden-world10.js.
   Madagascar dùng cờ chuẩn (garden-flags.js). Kenya, Nam Phi, Ethiopia KHÔNG vẽ quốc kỳ (hoa văn phức tạp, chưa đủ chắc thông số) — thay bằng vật phẩm văn hoá. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H, big = API.bigOf;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;
  function cloud(x, y, s) { return '<g opacity=".9">' + ell(x, y, 26 * s, 9 * s, '#FFFFFF') + ell(x - 14 * s, y + 3 * s, 16 * s, 7 * s, '#FFFFFF') + ell(x + 16 * s, y + 2 * s, 18 * s, 7 * s, '#FFFFFF') + '</g>'; }
  function acacia(x, y, s) { return path('M' + x + ' ' + y + 'V' + (y - 40 * s), '', '#6B4A2B', 4 * s) + path('M' + x + ' ' + (y - 26 * s) + 'L' + (x - 14 * s) + ' ' + (y - 40 * s), '', '#6B4A2B', 3 * s) + ell(x, y - 46 * s, 30 * s, 9 * s, '#5E8A3A', '#3A5A1E') + ell(x - 4 * s, y - 50 * s, 22 * s, 6 * s, '#7DAA4A'); }

  /* ═════════ KENYA — Kenya Culture Park ═════════ */
  THEME.kenya = { g1: '#E0D08A', g2: '#CDBA6A', noGrass: 1, ground: function (R, W, H2) { return scatter(R, W, H2, 34, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q-3 -9 0 -14M' + f0(x + 5) + ' ' + f0(y) + 'q0 -11 3 -16" fill="none" stroke="#9A8A3A" stroke-width="2" opacity=".6"/>'; }); } };
  DTH.kenya = { leaf: ['#7A9A3E', '#657F32', '#98B85A'], bush: ['#E5834B', '#7A9A3E'], rock: ['#B8A27A', '#D2BE96'], post: '#6B4A2B', rail: '#C8553A' };
  ART.kilimanjaro = function (b) {
    var s = cloud(70, 40, 1.1) + cloud(240, 30, .9);
    s += path('M0 292L70 190L110 220L170 60Q190 30 210 60L300 292Z', '#8A7A9A', '#4A3E5A', 2.6) + path('M110 130L170 60Q190 30 210 90L240 130Q210 112 190 134Q160 108 134 128Z', '#FFFFFF', '#B8C2D0', 2.2) + path('M120 200L150 160L190 210', '', 'rgba(255,255,255,.3)', 4);
    s += path('M0 292V236Q80 220 150 236Q230 220 300 236V292Z', '#C8B26A', '#8A7A3A', 2.4) + path('M0 292V262Q100 250 300 266V292Z', '#B89A4A', '', 0);
    s += acacia(60, 262, 1.3) + acacia(240, 268, 1.1) + acacia(160, 256, .8);
    [[110, 270], [130, 272]].forEach(function (g, k) { s += path('M' + g[0] + ' ' + g[1] + 'v-22', '', '#E8B84A', 4) + circ(g[0], g[1] - 24, 4, '#E8B84A', '#8A5A1A') + path('M' + (g[0] + 4) + ' ' + (g[1] - 24) + 'h6', '', '#8A5A1A', 3) + rect(g[0] - 8, g[1] - 12, 16, 10, '#E8B84A', '#8A5A1A', 1.4) + path('M' + (g[0] - 5) + ' ' + (g[1] - 2) + 'v8M' + (g[0] + 5) + ' ' + (g[1] - 2) + 'v8', '', '#8A5A1A', 2.4) + circ(g[0] - 3, g[1] - 8, 1.6, '#8A5A1A') + circ(g[0] + 3, g[1] - 6, 1.6, '#8A5A1A'); });
    return T(b.x * 100, b.y * 100, shadow(150, 294, 144, 6) + s);
  };
  ART.maasaiboma = function (b) {
    var s = ell(100, 150, 96, 36, '#C9B26A', '#8A7A3A'), i;
    s += path('M14 150Q100 190 186 150', '', '#8A5A2E', 6);
    for (i = 0; i < 5; i++) s += path('M' + (24 + i * 36) + ' 160V148', '', '#8A5A2E', 4);
    [[40, 120], [100, 104], [160, 120]].forEach(function (h, k) { s += rect(h[0] - 24, h[1], 48, 40, '#B8864A', '#6A4A22', 2.2) + path('M' + (h[0] - 28) + ' ' + (h[1] + 2) + 'Q' + h[0] + ' ' + (h[1] - 34) + ' ' + (h[0] + 28) + ' ' + (h[1] + 2) + 'Z', '#D9B96A', '#7A5A22', 2.2) + path('M' + (h[0] - 18) + ' ' + h[1] + 'L' + h[0] + ' ' + (h[1] - 22) + 'L' + (h[0] + 18) + ' ' + h[1], '', 'rgba(120,80,20,.35)', 2) + path('M' + (h[0] - 8) + ' ' + (h[1] + 40) + 'V' + (h[1] + 22) + 'Q' + h[0] + ' ' + (h[1] + 14) + ' ' + (h[0] + 8) + ' ' + (h[1] + 22) + 'V' + (h[1] + 40) + 'Z', '#3A2410', '', 0); });
    s += circ(60, 172, 6, '#E5334B') + circ(140, 176, 6, '#2B6BC8') + path('M60 178v8M140 182v8', '', '#8A5A2E', 3) + circ(60, 166, 4, '#8A5A2E') + circ(140, 170, 4, '#8A5A2E');
    return T(b.x * 100, b.y * 100, shadow(100, 192, 94, 5) + s);
  };
  big('kilimanjaro', 'kilimanjaro', 3, 3); big('maasaiboma', 'maasaiboma', 2, 2);
  ART.maasaishield = function (b) {
    var s = shadow(50, 92, 22, 4) + path('M50 6Q22 20 24 52Q28 84 50 94Q72 84 76 52Q78 20 50 6Z', '#B8452E', '#6A2418', 2.6) + path('M50 14Q30 26 32 52Q36 78 50 86Q64 78 68 52Q70 26 50 14Z', '#F2E0B0', '#6A2418', 1.6) + path('M50 14V86', '', '#6A2418', 3) + poly('50,24 62,50 50,76 38,50', '#E5334B', '#6A2418') + circ(50, 50, 6, '#222') + circ(50, 50, 2.4, '#F2C94C') + path('M24 50h8M68 50h8', '', '#2B6BC8', 3);
    return T(b.x * 100, b.y * 100, s);
  };
  ART.safarijeep = function (b) {
    var s = shadow(50, 92, 40, 4) + rect(10, 50, 80, 30, '#C8A25A', '#7A5A22', 2.4) + rect(20, 32, 44, 22, '#C8A25A', '#7A5A22', 2.2) + rect(24, 36, 16, 14, '#BFE8FF', '#5A8AAA', 1.6) + rect(44, 36, 16, 14, '#BFE8FF', '#5A8AAA', 1.6) + path('M18 32H66', '', '#3A2A12', 4) + path('M72 52h12', '', '#FFF6A0', 5) + rect(66, 30, 16, 22, '#C8A25A', '#7A5A22', 2) + circ(28, 82, 10, '#2A2A34', '#000') + circ(72, 82, 10, '#2A2A34', '#000') + circ(28, 82, 4, '#C9C9D2') + circ(72, 82, 4, '#C9C9D2') + path('M14 64h72', '', 'rgba(60,40,10,.3)', 1.6) + path('M2 62h8', '', '#8A8F9A', 3);
    return T(b.x * 100, b.y * 100, s + path('M22 24h40', '', '#6B4A2B', 2) + circ(30, 20, 5, '#8A5A2E') + circ(54, 20, 5, '#B8864A'));
  };

  /* ═════════ NAM PHI — South Africa Culture Park ═════════ */
  THEME.southafrica = { g1: '#BFD68A', g2: '#A2BE6A', ground: function (R, W, H2) { return scatter(R, W, H2, 32, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3.4" fill="' + ['#FF7AB6', '#F2C94C', '#FFFFFF', '#E5334B'][i % 4] + '" opacity=".75"/>'; }); } };
  DTH.southafrica = { leaf: ['#5E8A4A', '#4A763C', '#7DAA63'], bush: ['#FF7AB6', '#5E8A4A'], rock: ['#B8A88A', '#D2C4A6'], post: '#6B4A2B', rail: '#2B9BD8' };
  ART.tablemountain = function (b) {
    var s = cloud(60, 36, 1) + path('M0 292V150L40 120H260L300 150V292Z', '#8A7A6A', '#4A3E32', 2.6) + path('M0 150L40 120H260L300 150', '', '#B8A890', 4) + path('M30 150L60 292M90 140L110 292M170 140L160 292M230 140L250 292', '', 'rgba(60,50,40,.3)', 3), i;
    s += '<g opacity=".95">' + ell(70, 118, 60, 14, '#FFFFFF') + ell(150, 112, 70, 16, '#FFFFFF') + ell(230, 118, 62, 14, '#FFFFFF') + '</g>';
    s += path('M0 292V250Q100 230 200 248Q260 236 300 250V292Z', '#6FA043', '#3E6E2A', 2.2) + path('M40 280q20 -20 40 0M200 276q20 -18 44 0', '', '#4E8A2E', 3);
    s += path('M60 136L240 118', '', '#3A3A44', 1.6) + rect(130, 122, 18, 14, '#E5334B', '#7A1E10', 1.6) + path('M139 122v-4', '', '#3A3A44', 1.4) + circ(136, 128, 2, '#FFF6A0') + circ(142, 128, 2, '#FFF6A0');
    for (i = 0; i < 4; i++) s += path('M' + (24 + i * 70) + ' 292l4 -22l8 22', '#E5334B', '#7A1E10', 1.4);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 144, 6) + s);
  };
  ART.ndebele = function (b) {
    var s = rect(14, 70, 172, 120, '#FFFFFF', '#222', 2.6) + rect(8, 62, 184, 14, '#2B6BC8', '#222', 2.2), i, cols = ['#E5334B', '#2B6BC8', '#F2C94C', '#2E9B4A', '#222'];
    for (i = 0; i < 8; i++) s += poly((20 + i * 21) + ',76 ' + (30 + i * 21) + ',90 ' + (40 + i * 21) + ',76', cols[i % 5], '#222') + path('M' + (20 + i * 21) + ' 190V170', '', '#222', 2);
    s += rect(24, 106, 40, 32, '#F2C94C', '#222', 2.2) + poly('30,112 44,132 58,112', '#E5334B', '#222') + rect(136, 106, 40, 32, '#2E9B4A', '#222', 2.2) + poly('142,132 156,112 170,132', '#2B6BC8', '#222') + rect(76, 120, 48, 70, '#E5334B', '#222', 2.4) + poly('82,190 100,140 118,190', '#2B6BC8', '#222') + poly('90,190 100,160 110,190', '#F2C94C', '#222') + path('M14 146h48M138 146h48', '', '#222', 3) + path('M14 160h48M138 160h48', '', '#E5334B', 3);
    for (i = 0; i < 7; i++) s += rect(18 + i * 24, 170, 14, 14, cols[i % 4], '#222', 1.4);
    return T(b.x * 100, b.y * 100, shadow(100, 194, 94, 5) + s);
  };
  big('tablemountain', 'tablemountain', 3, 3); big('ndebele', 'ndebele', 2, 2);
  ART.vuvuzela = function (b) {
    var s = shadow(50, 92, 22, 4) + path('M30 88L62 20Q66 12 74 14Q82 18 78 28L44 90Z', '#F2C94C', '#B8860B', 2.4) + path('M58 28L76 20', '', '#FFF6A0', 3) + ell(78, 22, 10, 8, '#E5334B', '#7A1E10') + ell(78, 22, 5, 3.6, '#7A1E10') + path('M32 84L52 40M40 86L58 50', '', 'rgba(255,255,255,.4)', 2.4) + circ(34, 88, 5, '#2E9B4A', '#16603E');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.proteaflower = function (b) {
    var s = shadow(50, 92, 24, 4) + path('M50 92V58', '', '#4A8A3C', 5), i;
    s += path('M50 78Q30 74 24 58Q40 60 50 72Z', '#4FAE4A', '#2A6A2A', 1.6) + path('M50 78Q70 74 76 58Q60 60 50 72Z', '#4FAE4A', '#2A6A2A', 1.6);
    for (i = 0; i < 11; i++) { var a = (-78 + i * 15.6); s += '<g transform="translate(50 50) rotate(' + a + ')">' + path('M0 0Q-8 -14 0 -34Q8 -14 0 0Z', i % 2 ? '#FFB0CE' : '#FF7AA8', '#B8346A', 1.2) + '</g>'; }
    s += circ(50, 50, 13, '#FFE4EE', '#B8346A') + circ(50, 50, 8, '#7A3A4A');
    for (i = 0; i < 12; i++) s += path('M50 50L' + (50 + Math.cos(i * 30 * Math.PI / 180) * 12).toFixed(1) + ' ' + (50 + Math.sin(i * 30 * Math.PI / 180) * 12).toFixed(1), '', '#4A2030', 1.2);
    return T(b.x * 100, b.y * 100, s);
  };

  /* ═════════ ETHIOPIA — Ethiopia Culture Park ═════════ */
  THEME.ethiopia = { g1: '#C8D68A', g2: '#AEBE6C', ground: function (R, W, H2) { return scatter(R, W, H2, 30, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + ['#FFD23F', '#E5334B', '#FFFFFF'][i % 3] + '" opacity=".75"/>'; }); } };
  DTH.ethiopia = { leaf: ['#5E8A3A', '#4A762E', '#7DAA4E'], bush: ['#F2C94C', '#5E8A3A'], rock: ['#B8946A', '#D2AE84'], post: '#6B4A2B', rail: '#2E9B4A' };
  ART.lalibela = function (b) {
    var s = path('M0 292V120H300V292Z', '#B8744A', '#6A3A22', 2.6) + path('M0 120H300', '', '#8A5230', 4), i;
    for (i = 0; i < 10; i++) s += path('M' + (14 + i * 30) + ' 120v-8', '', '#6A3A22', 3);
    s += path('M40 292V200H260V292Z', '#9A5A38', '#6A3A22', 2.6) + rect(70, 150, 160, 100, '#C98A5A', '#6A3A22', 2.8) + rect(120, 130, 60, 20, '#C98A5A', '#6A3A22', 2.4) + rect(130, 98, 40, 34, '#C98A5A', '#6A3A22', 2.4) + path('M130 98h40', '', '#6A3A22', 3);
    s += rect(142, 76, 16, 24, '#5A2E18', '#3A1E10', 2) + path('M150 62v16M142 70h16', '', '#C9A22A', 3.4);
    for (i = 0; i < 4; i++) s += path('M' + (84 + i * 36) + ' 250V196Q' + (84 + i * 36 + 12) + ' 178 ' + (84 + i * 36 + 24) + ' 196V250Z', '#3A1E10', '#1E0E06', 1.8) + path('M' + (90 + i * 36) + ' 200q6 -8 12 0', '', '#8A5230', 2);
    s += path('M150 150v-14M144 142h12', '', '#3A1E10', 3) + path('M150 218v26M138 232h24', '', '#C9A22A', 4);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 144, 6) + s);
  };
  ART.tukul = function (b) {
    var s = rect(40, 96, 120, 92, '#B8864A', '#6A4A22', 2.6) + path('M24 100Q100 -4 176 100Q164 110 100 36Q36 110 24 100Z', '#D9B96A', '#7A5A22', 2.6), i;
    for (i = 0; i < 9; i++) s += path('M' + (36 + i * 16) + ' ' + (100 - Math.sin(i / 8 * 3.14) * 40) + 'l-4 12', '', 'rgba(120,80,20,.4)', 1.6);
    for (i = 0; i < 6; i++) s += path('M40 ' + (112 + i * 12) + 'h120', '', 'rgba(60,40,10,.25)', 1.6);
    s += path('M80 188V138Q100 122 120 138V188Z', '#3A2410', '#1E1206', 2) + circ(100, 22, 4, '#8A5A2E') + path('M100 24V34', '', '#6B4A2B', 2.4) + rect(46, 130, 22, 18, '#3A2410', '#6A4A22', 1.6) + rect(132, 130, 22, 18, '#3A2410', '#6A4A22', 1.6);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 80, 5) + s + path('M20 190h160', '', '#9A8A4A', 5));
  };
  big('lalibela', 'lalibela', 3, 3); big('tukul', 'tukul', 2, 2);
  ART.jebena = function (b) {
    var s = shadow(50, 92, 28, 4) + path('M30 86Q16 56 34 44Q42 40 44 28L56 28Q58 40 66 44Q84 56 70 86Z', '#2A2A34', '#000', 2.4) + path('M42 28L40 14Q50 6 60 14L58 28Z', '#2A2A34', '#000', 2) + path('M30 62Q50 70 70 62', '', '#F2C94C', 3) + path('M70 50Q90 52 84 72Q80 78 72 74', '', '#2A2A34', 5) + path('M34 50Q16 40 12 24', '', '#2A2A34', 5) + circ(52, 12, 4, '#6B4A2B', '#000') + path('M36 74q14 6 28 0', '', 'rgba(255,255,255,.2)', 2) + path('M10 86Q50 98 90 86', '', '#8A5A2E', 4);
    return T(b.x * 100, b.y * 100, s + path('M52 6q-4 -8 2 -12', '', 'rgba(255,255,255,.6)', 2.4));
  };
  ART.meskelcross = function (b) {
    var s = shadow(50, 92, 24, 4) + path('M50 90V36', '', '#B8860B', 7) + path('M26 54H74', '', '#B8860B', 7), i;
    s += path('M50 90V36', '', '#F2C94C', 4) + path('M26 54H74', '', '#F2C94C', 4);
    [[50, 24], [50, 36], [20, 54], [80, 54], [50, 76]].forEach(function (q) { s += circ(q[0], q[1], 7, '#F2C94C', '#B8860B') + circ(q[0], q[1], 3, '#E5334B'); });
    for (i = 0; i < 4; i++) s += circ(38 + (i % 2) * 24, 42 + Math.floor(i / 2) * 24, 3, '#F2C94C', '#B8860B');
    return T(b.x * 100, b.y * 100, s + path('M40 88h20', '', '#B8860B', 5) + path('M44 16Q50 6 56 16', '', '#B8860B', 2.4));
  };

  /* ═════════ MADAGASCAR — Madagascar Culture Park ═════════ */
  THEME.madagascar = { g1: '#9ADB7A', g2: '#76C458', ground: function (R, W, H2) { return scatter(R, W, H2, 34, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3.2" fill="' + ['#FF7AB6', '#FFD23F', '#FFFFFF'][i % 3] + '" opacity=".75"/>'; }); } };
  DTH.madagascar = { leaf: ['#2E9B4A', '#1F7F3A', '#5ACB6A'], bush: ['#FF7AB6', '#2E9B4A'], rock: ['#B8AA96', '#D2C6B2'], post: '#6B4A2B', rail: '#007E3A' };
  ART.baobabs = function (b) {
    var s = path('M0 292V200Q150 150 300 200V292Z', '#F0A84A', '', 0) + path('M0 292V232Q150 200 300 232V292Z', '#C98A3A', '', 0), i;
    s += '<circle cx="150" cy="80" r="46" fill="#FFD23F" opacity=".55"/><circle cx="150" cy="80" r="30" fill="#FF8A1F" opacity=".7"/>';
    s += path('M0 292V240H300V292Z', '#B8782E', '#8A5A1E', 2.2) + path('M20 266H280', '', 'rgba(60,30,10,.25)', 2.4);
    [[70, 252, 1.1], [150, 246, 1.5], [236, 252, 1.2]].forEach(function (t) { var x = t[0], y = t[1], k = t[2]; s += path('M' + (x - 14 * k) + ' ' + y + 'Q' + (x - 20 * k) + ' ' + (y - 60 * k) + ' ' + (x - 10 * k) + ' ' + (y - 110 * k) + 'L' + (x + 10 * k) + ' ' + (y - 110 * k) + 'Q' + (x + 20 * k) + ' ' + (y - 60 * k) + ' ' + (x + 14 * k) + ' ' + y + 'Z', '#A8805A', '#5A3A1E', 2.4) + path('M' + (x - 6 * k) + ' ' + (y - 10) + 'V' + (y - 100 * k) + 'M' + (x + 6 * k) + ' ' + (y - 14) + 'V' + (y - 96 * k), '', 'rgba(60,30,10,.3)', 2) + path('M' + x + ' ' + (y - 108 * k) + 'L' + (x - 24 * k) + ' ' + (y - 132 * k) + 'M' + x + ' ' + (y - 108 * k) + 'L' + (x + 22 * k) + ' ' + (y - 134 * k) + 'M' + x + ' ' + (y - 108 * k) + 'L' + x + ' ' + (y - 138 * k), '', '#5A3A1E', 4 * k); for (i = 0; i < 5; i++) s += circ(x + (i - 2) * 12 * k, y - 134 * k + Math.abs(i - 2) * 6, 8 * k, '#4A8A3A', '#2A5A1E'); });
    return T(b.x * 100, b.y * 100, shadow(150, 294, 144, 6) + s);
  };
  ART.tsingy = function (b) {
    var s = path('M0 190V150H200V190Z', '#7A7468', '', 0) + path('M0 192Q100 176 200 192V200H0Z', '#4E8A3A', '#2E5A1E', 2), i;
    for (i = 0; i < 11; i++) { var x = 8 + i * 17, h = 50 + ((i * 37) % 60); s += poly((x - 9) + ',190 ' + (x + 1) + ',' + (190 - h) + ' ' + (x + 11) + ',190', i % 2 ? '#9A9488' : '#B0AA9C', '#5A564C') + path('M' + (x + 1) + ' ' + (190 - h) + 'L' + (x + 4) + ' 190', '', 'rgba(255,255,255,.3)', 2); }
    for (i = 0; i < 5; i++) s += path('M' + (14 + i * 40) + ' 190q4 -16 10 -22', '', '#4E8A3A', 3) + circ(24 + i * 40, 166, 3, ['#FF7AB6', '#F2C94C'][i % 2]);
    return T(b.x * 100, b.y * 100, shadow(100, 196, 94, 4) + s);
  };
  big('baobabs', 'baobabs', 3, 3); big('tsingy', 'tsingy', 2, 2);
  ART.mgflag = flagPole('mg');
  ART.vanilla = function (b) {
    var s = shadow(50, 92, 26, 4) + path('M20 50Q50 30 80 50', '', '#4A8A3C', 4), i;
    for (i = 0; i < 5; i++) s += path('M' + (24 + i * 12) + ' ' + (44 + Math.abs(i - 2) * 3) + 'Q' + (22 + i * 12) + ' ' + (66 + i * 2) + ' ' + (26 + i * 12) + ' ' + (88 - i * 2), '', '#4A2E14', 5) + path('M' + (24 + i * 12) + ' ' + (44 + Math.abs(i - 2) * 3) + 'Q' + (22 + i * 12) + ' ' + (66 + i * 2) + ' ' + (26 + i * 12) + ' ' + (88 - i * 2), '', '#6B4A2B', 2);
    s += path('M44 36Q36 22 50 14Q56 24 50 36Z', '#FFF6D8', '#C9A22A', 1.6) + path('M50 36Q62 24 58 12Q48 20 50 36Z', '#FFFDF0', '#C9A22A', 1.6) + circ(50, 36, 3, '#F2C94C');
    return T(b.x * 100, b.y * 100, s);
  };
})(typeof window !== 'undefined' ? window : this);
