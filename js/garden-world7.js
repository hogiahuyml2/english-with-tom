/* EWT Garden — 8 khu văn hoá quốc gia mới (phần 1: Hàn Quốc, Thổ Nhĩ Kỳ, Úc, Canada). Nạp SAU garden-world6.js.
   Mỗi khu: công trình biểu tượng 3×3, công trình văn hoá 2×2, cột cờ ĐÚNG CHUẨN 1×1 (garden-flags.js), một vật phẩm văn hoá 1×1, và vài món trang trí riêng. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H, big = API.bigOf;
  var T = H.T, shadow = H.shadow, F = H.F, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;
  var DK = '#2A2A34';
  // dải hoạ tiết sơn màu (dancheong) dưới mái hiên Hàn Quốc
  function dancheong(x, y, w, h) { var s = rect(x, y, w, h, '#2E7D5A', '#1B4F36', 1.4), i, n = Math.floor(w / 12); for (i = 0; i < n; i++) s += rect(x + 1 + i * 12, y + 1.5, 10, h - 3, i % 3 === 0 ? '#D9402E' : i % 3 === 1 ? '#2B6BC8' : '#F2C94C', '', 1) + circ(x + 6 + i * 12, y + h / 2, 2, '#fff'); return s; }
  // mái cong kiểu Á Đông: cx tâm, y đường mái hiên, w rộng đáy, h cao mái
  function eastRoof(cx, y, w, h, col, rim) {
    var l = cx - w / 2, r = cx + w / 2, s = path('M' + (l - 8) + ' ' + (y + 6) + 'Q' + (l + 8) + ' ' + (y + 18) + ' ' + (l + 32) + ' ' + (y - 4) + 'Q' + (cx - w * .2) + ' ' + (y - h * .8) + ' ' + (cx - w * .15) + ' ' + (y - h) + 'H' + (cx + w * .15) + 'Q' + (cx + w * .2) + ' ' + (y - h * .8) + ' ' + (r - 32) + ' ' + (y - 4) + 'Q' + (r - 8) + ' ' + (y + 18) + ' ' + (r + 8) + ' ' + (y + 6) + 'Q' + cx + ' ' + (y + 26) + ' ' + (l - 8) + ' ' + (y + 6) + 'Z', col, rim || '#262A33', 2.4), k;
    for (k = 1; k < 4; k++) s += path('M' + (l + 30 + k * 4) + ' ' + (y - 2 - k * h * .17) + 'Q' + cx + ' ' + (y + 10 - k * h * .17) + ' ' + (r - 30 - k * 4) + ' ' + (y - 2 - k * h * .17), '', 'rgba(255,255,255,.22)', 1.6);
    return s + rect(cx - w * .15, y - h - 4, w * .3, 5, '#6B7280', '#262A33', 1.4) + circ(cx - w * .15, y - h - 2, 3.4, '#F2C94C') + circ(cx + w * .15, y - h - 2, 3.4, '#F2C94C');
  }

  /* ═════════ HÀN QUỐC — Korea Culture Park ═════════ */
  THEME.korea = { g1: '#BFE4A0', g2: '#9ACF7C', ground: function (R, W, H2) { return scatter(R, W, H2, 40, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3.2" fill="' + ['#FFC4D8', '#FFFFFF', '#FFB0CC'][i % 3] + '" opacity=".85"/>'; }) + scatter(R, W, H2, 8, function (x, y) { return '<ellipse cx="' + f0(x) + '" cy="' + f0(y) + '" rx="20" ry="6" fill="rgba(160,150,130,.28)"/>'; }); } };
  DTH.korea = { leaf: ['#3F8A4A', '#2F763C', '#5DA660'], bush: ['#FF8FB8', '#4FAE62'], rock: ['#B8B2A0', '#D2CCBB'], post: '#8A5A2E', rail: '#B83A2E' };
  ART.gyeongbok = function (b) {
    var s = '', i;
    s += rect(10, 266, 280, 20, '#CFC9B8', '#8E8878', 3) + rect(30, 246, 240, 22, '#DDD7C6', '#8E8878', 3) + rect(50, 228, 200, 20, '#E8E2D2', '#8E8878', 3);
    s += poly('118,286 182,286 172,228 128,228', '#D8D2C0', '#8E8878') + rect(138, 228, 24, 58, '#B8B2A0', '', 0) + path('M142 238h16M142 252h16M142 266h16M142 278h16', '', '#8E8878', 1.6);
    for (i = 0; i < 9; i++) if (i !== 4) s += rect(58 + i * 20, 220, 6, 10, '#F4EFE0', '#8E8878', 1);
    s += rect(60, 164, 180, 64, '#7A2E22', '#4A1A12', 2);
    for (i = 0; i < 4; i++) s += rect(80 + i * 36, 176, 28, 46, '#F3E6C6', '#5A2A1A', 2) + path('M' + (94 + i * 36) + ' 176v46M80 ' + (192 + 0) + 'h28M80 208h28', '', '#8A5A3A', 1.2);
    for (i = 0; i < 6; i++) s += rect(60 + i * 35, 160, 9, 68, '#B83A2E', '#6B1F18', 1.4);
    s += dancheong(52, 152, 196, 12) + eastRoof(150, 150, 266, 52, '#4A4E58');
    s += rect(86, 92, 128, 40, '#7A2E22', '#4A1A12', 2);
    for (i = 0; i < 3; i++) s += rect(104 + i * 36, 100, 28, 30, '#F3E6C6', '#5A2A1A', 2) + path('M' + (118 + i * 36) + ' 100v30', '', '#8A5A3A', 1.2);
    for (i = 0; i < 4; i++) s += rect(84 + i * 42, 90, 8, 42, '#B83A2E', '#6B1F18', 1.4);
    s += dancheong(80, 84, 140, 10) + eastRoof(150, 82, 190, 44, '#4A4E58');
    s += circ(150, 24, 5, '#F2C94C', '#C99A1B') + path('M150 29v8', '', '#C99A1B', 3) + ell(70, 276, 30, 6, 'rgba(0,0,0,.1)');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 142, 7) + s);
  };
  ART.hanok = function (b) {
    var s = '', i;
    s += rect(14, 150, 172, 42, '#CFC9B8', '#8E8878', 3) + rect(24, 108, 152, 46, '#F4EAD0', '#8A7A5A', 2);
    for (i = 0; i < 5; i++) s += rect(24 + i * 30, 108, 7, 46, '#8A5A2E', '#5A3410', 1);
    for (i = 0; i < 4; i++) s += rect(34 + i * 30, 116, 24, 34, '#F8F1DE', '#8A5A2E', 1.6) + path('M' + (46 + i * 30) + ' 116v34M34 ' + (133) + 'h24', '', '#B8946A', 1);
    s += eastRoof(100, 108, 190, 46, '#454953') + path('M70 56q30 -8 60 0', '', 'rgba(255,255,255,.2)', 2);
    s += rect(146, 52, 18, 40, '#9A7A5A', '#5A4020', 2) + rect(142, 46, 26, 8, '#6B7280', '#262A33', 2) + ell(156, 36, 8, 5, 'rgba(255,255,255,.5)');
    s += rect(8, 178, 184, 14, '#8E8878', '#5E5A4E', 2) + path('M20 184h160', '', '#B8B2A0', 1.4) + circ(34, 176, 8, '#FFC4D8') + circ(40, 172, 6, '#FFE0EC') + circ(166, 176, 7, '#FFB0CC');
    return T(b.x * 100, b.y * 100, shadow(100, 192, 94, 6) + s);
  };
  big('gyeongbok', 'gyeongbok', 3, 3); big('hanok', 'hanok', 2, 2);
  ART.krflag = flagPole('kr');
  ART.kimchijar = function (b) {
    var s = '';
    s += shadow(50, 92, 40, 5) + path('M26 86Q14 64 24 50Q28 40 36 40H52Q60 40 64 50Q74 64 62 86Z', '#B8734A', '#7A4426', 2.4) + path('M22 48Q50 38 78 48Q74 56 50 58Q26 56 22 48Z', '#C98A5C', '#7A4426', 2) + ell(50, 48, 26, 7, '#D94A2E') + path('M34 46l6 -2M46 48l8 -3M58 46l6 0', '', '#FFC24A', 2) + circ(40, 48, 2, '#7BBF4A') + circ(56, 49, 2, '#7BBF4A');
    s += path('M60 88Q70 74 84 80Q88 88 84 90Z', '#B8734A', '#7A4426', 2) + ell(72, 80, 12, 4, '#D94A2E');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.jangseung = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 34, 5) + rect(22, 28, 14, 62, '#8A5A2E', '#5A3410', 2) + rect(58, 28, 14, 62, '#8A5A2E', '#5A3410', 2) + ell(29, 24, 11, 14, '#B8865A', '#5A3410') + ell(65, 24, 11, 14, '#B8865A', '#5A3410') + path('M24 22q5 -3 10 0M60 22q5 -3 10 0M26 30q3 3 6 0M62 30q3 3 6 0', '', '#2A1A0A', 2) + rect(22, 40, 14, 8, '#E8C84A', '#8A6A1A', 1) + rect(58, 40, 14, 8, '#D94A2E', '#7A241B', 1) + path('M24 52h10M24 62h10M60 52h10M60 62h10', '', '#5A3410', 1.6));
  };
  ART.dolhareubang = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 5) + path('M30 90Q26 54 34 44Q36 24 50 20Q64 24 66 44Q74 54 70 90Z', '#6E6A66', '#3E3A38', 2.4) + rect(30, 18, 40, 10, '#5A5652', '#3E3A38', 3) + path('M36 44q6 -4 12 0M52 44q6 -4 12 0', '', '#2A2826', 2.4) + ell(50, 58, 5, 3, '#4A4642') + path('M44 66q6 4 12 0', '', '#2A2826', 2) + path('M34 74Q50 66 66 74', '', '#4A4642', 2) + rect(36, 78, 12, 8, '#7E7A76', '#3E3A38', 2) + rect(52, 78, 12, 8, '#7E7A76', '#3E3A38', 2));
  };

  /* ═════════ THỔ NHĨ KỲ — Turkey Culture Park ═════════ */
  THEME.turkey = { g1: '#E6D8A8', g2: '#D2BE86', noGrass: 1, ground: function (R, W, H2) { return scatter(R, W, H2, 26, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'l14 0l-7 12z" fill="rgba(200,60,50,.18)"/>'; }) + scatter(R, W, H2, 30, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + ['#E5334B', '#FFFFFF', '#F2C94C'][i % 3] + '" opacity=".8"/>'; }); } };
  DTH.turkey = { leaf: ['#7FA84A', '#6A9438', '#9AC062'], bush: ['#E5334B', '#6A9438'], rock: ['#D8CFA8', '#EDE6C8'], post: '#8A5A2E', rail: '#2B6BC8' };
  function minaret(x, y, h, col) { return rect(x - 7, y - h, 14, h, col, '#9A9484', 2) + rect(x - 11, y - h * .62, 22, 5, '#CFC8B0', '#9A9484', 1.4) + path('M' + (x - 8) + ' ' + (y - h) + 'L' + x + ' ' + (y - h - 28) + 'L' + (x + 8) + ' ' + (y - h) + 'Z', '#5E7A9A', '#34485E', 2) + circ(x, y - h - 30, 2.6, '#F2C94C'); }
  ART.hagiasophia = function (b) {
    var s = '', i;
    s += rect(30, 220, 240, 68, '#E4C890', '#A88A52', 3) + rect(20, 256, 260, 32, '#D6B87A', '#A88A52', 3);
    s += minaret(30, 246, 140, '#F4ECD8') + minaret(270, 246, 140, '#F4ECD8');
    s += path('M60 190Q60 150 98 148Q106 118 150 116Q194 118 202 148Q240 150 240 190Z', '#B8C4D4', '#6A7A90', 2.4) + path('M104 126Q150 82 196 126Q150 108 104 126Z', '#CDD7E4', '#6A7A90', 2) + path('M76 192Q76 170 104 168', '', '#7A8AA0', 2) + path('M224 192Q224 170 196 168', '', '#7A8AA0', 2);
    s += path('M112 120Q150 56 188 120Z', '#9AA8BC', '#5A6A80', 2.6) + path('M118 116Q150 76 182 116', '', 'rgba(255,255,255,.4)', 3) + circ(150, 54, 4, '#F2C94C') + path('M150 58v-14M146 48h8', '', '#C99A1B', 2.4);
    for (i = 0; i < 7; i++) s += path('M' + (120 + i * 10) + ' 112Q150 96 ' + (126 + i * 8) + ' 124', '', 'rgba(60,80,110,.35)', 1.2);
    for (i = 0; i < 6; i++) s += path('M' + (84 + i * 26) + ' 232V206Q' + (84 + i * 26 + 9) + ' 196 ' + (84 + i * 26 + 18) + ' 206V232Z', '#3A2A1A', '#8A6A3A', 2) + rect(84 + i * 26, 196, 18, 3, '#C9A25A', '', 0);
    s += path('M130 288V250Q150 232 170 250V288Z', '#5A3410', '#C99A1B', 2.4) + path('M60 190v30M240 190v30M30 208q30 -14 60 -18', '', '#A88A52', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 290, 142, 7) + s);
  };
  ART.cappadocia = function (b) {
    var s = '', i, cols = ['#DEB887', '#D2A878', '#E8C99A'];
    s += path('M0 190Q40 168 100 176Q160 168 200 190V194H0Z', '#C99A68', '', 0);
    [[34, 150, 28, 70], [76, 130, 34, 92], [122, 148, 30, 74], [160, 156, 24, 64]].forEach(function (c, k) { s += path('M' + (c[0] - c[2] / 2) + ' 192Q' + (c[0] - c[2] / 2 + 2) + ' ' + (192 - c[3] * .5) + ' ' + (c[0] - 6) + ' ' + (192 - c[3]) + 'Q' + c[0] + ' ' + (192 - c[3] - 14) + ' ' + (c[0] + 6) + ' ' + (192 - c[3]) + 'Q' + (c[0] + c[2] / 2 - 2) + ' ' + (192 - c[3] * .5) + ' ' + (c[0] + c[2] / 2) + ' 192Z', cols[k % 3], '#8A6A3A', 2.4) + path('M' + (c[0] - 4) + ' ' + (192 - c[3] * .3) + 'q4 -6 8 0', '', '#7A5A2A', 2) + rect(c[0] - 4, 192 - c[3] * .2 - 6, 8, 12, '#5A3A1A', '', 2); });
    s += path('M92 100Q76 84 92 62Q100 52 108 62Q124 84 108 100Z', '#E5334B', '#8A1E1E', 2) + path('M92 100Q100 80 100 56M108 100Q100 80 100 56', '', 'rgba(255,255,255,.4)', 2) + rect(94, 102, 12, 8, '#8A5A2E', '#5A3410', 1.4) + path('M95 100l-2 2M105 100l2 2', '', '#5A3410', 1.4);
    s += path('M150 58Q136 44 150 28Q158 18 166 28Q180 44 166 58Z', '#F2C94C', '#B8860B', 2) + rect(152, 60, 12, 7, '#8A5A2E', '#5A3410', 1.4);
    s += path('M30 60Q22 54 30 48Q36 42 42 48Q50 54 42 60Z', '#2B6BC8', '#16407A', 2);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 90, 5) + s);
  };
  big('hagiasophia', 'hagiasophia', 3, 3); big('cappadocia', 'cappadocia', 2, 2);
  ART.trflag = flagPole('tr');
  ART.turkishtea = function (b) {
    var s = shadow(50, 92, 36, 5) + ell(50, 84, 34, 7, '#F4EFE0', '#8A7A5A') + ell(50, 82, 26, 5, '#E8DEC4');
    s += path('M38 80Q36 54 42 46H58Q64 54 62 80Z', 'rgba(210,100,50,.85)', '#8A3A18', 2.2) + path('M38 60h24', '', '#FFD8A0', 2) + rect(36, 44, 28, 5, '#F4EFE0', '#8A7A5A', 1.6) + ell(50, 46, 12, 2.6, '#8A3A18') + path('M44 52q3 8 0 18', '', 'rgba(255,255,255,.4)', 2);
    s += path('M74 56q10 4 6 20q-4 6 -10 4', '', '#B8860B', 3) + path('M70 40q4 -10 10 -4q4 6 -4 10z', '#E5334B', '#8A1E1E', 1.6);
    return T(b.x * 100, b.y * 100, s);
  };
  ART.evileye = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 4) + path('M50 4V16', '', '#8A8F9A', 3) + circ(50, 38, 24, '#1E4FA8', '#12306A') + circ(50, 38, 18, '#FFFFFF', '#9AA8C0') + circ(50, 38, 12, '#4FB4FF', '#1E4FA8') + circ(50, 38, 6, '#14143A') + circ(47, 35, 2, '#fff') + rect(46, 66, 8, 22, '#8A8F9A', '#5A6070', 2));
  };
  ART.turkishlamp = function (b) {
    var s = shadow(50, 92, 22, 4) + path('M50 6V16', '', '#8A8F9A', 3) + rect(40, 14, 20, 6, '#C99A1B', '#8A6A1A', 1.4) + path('M32 26Q50 12 68 26L72 54Q50 74 28 54Z', '#2B6BC8', '#16407A', 2.2), i;
    for (i = 0; i < 5; i++) s += circ(36 + i * 7, 44 + (i % 2) * 5, 3.4, ['#E5334B', '#F2C94C', '#2E9B6A', '#E5334B', '#F2C94C'][i], '#fff') + path('M' + (34 + i * 8) + ' 30l2 8', '', 'rgba(255,255,255,.4)', 1.4);
    return T(b.x * 100, b.y * 100, s + ell(50, 62, 18, 5, '#F2C94C', '#8A6A1A') + circ(50, 76, 4, '#F2C94C', '#8A6A1A') + rect(48, 80, 4, 8, '#C99A1B', '', 0) + ell(50, 90, 14, 3, '#C99A1B') + ell(50, 66, 10, 7, 'rgba(255,200,80,.35)'));
  };

  /* ═════════ ÚC — Australia Culture Park ═════════ */
  THEME.australia = { g1: '#E9D2A0', g2: '#D9B77C', noGrass: 1, ground: function (R, W, H2) { return scatter(R, W, H2, 26, function (x, y, r) { return '<ellipse cx="' + f0(x) + '" cy="' + f0(y) + '" rx="' + f0(12 + r() * 16) + '" ry="4" fill="rgba(190,110,60,.28)"/>'; }) + scatter(R, W, H2, 18, function (x, y) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q4 -10 8 0M' + f0(x + 8) + ' ' + f0(y) + 'q3 -8 6 0" stroke="rgba(120,140,60,.55)" stroke-width="2.4" fill="none" stroke-linecap="round"/>'; }); } };
  DTH.australia = { leaf: ['#7A9A4A', '#6A8A3C', '#9AB868'], bush: ['#7A9A4A', '#E5A33B'], rock: ['#C8734A', '#DE8A5C'], post: '#8A5A2E', rail: '#B8733A' };
  ART.sydneyopera = function (b) {
    var s = '', i;
    s += rect(0, 246, 300, 44, '#D8D2C0', '#9A9484', 2) + rect(20, 270, 260, 20, '#C9C3B1', '#9A9484', 2) + path('M0 292Q150 270 300 292V300H0Z', '#4FB4D8', '#2A7A9A', 2);
    var shell = function (x, y, w, h, c) { return path('M' + x + ' ' + y + 'Q' + (x - w * .05) + ' ' + (y - h * .9) + ' ' + (x + w * .5) + ' ' + (y - h) + 'Q' + (x + w * 1.05) + ' ' + (y - h * .5) + ' ' + (x + w) + ' ' + y + 'Z', c, '#8A8470', 2.2) + path('M' + (x + w * .08) + ' ' + y + 'Q' + (x + w * .1) + ' ' + (y - h * .6) + ' ' + (x + w * .5) + ' ' + (y - h * .92), '', 'rgba(255,255,255,.7)', 1.6) + path('M' + (x + w * .3) + ' ' + y + 'Q' + (x + w * .36) + ' ' + (y - h * .5) + ' ' + (x + w * .6) + ' ' + (y - h * .85), '', 'rgba(150,140,110,.4)', 1.4); };
    s += shell(20, 248, 100, 86, '#F4EFE0') + shell(86, 248, 92, 118, '#FAF6EC') + shell(160, 248, 100, 150, '#F4EFE0') + shell(222, 248, 62, 80, '#FAF6EC');
    s += shell(40, 248, 56, 54, '#EDE6D2') + shell(112, 248, 58, 76, '#F1EAD8') + shell(186, 248, 64, 98, '#EDE6D2');
    for (i = 0; i < 12; i++) s += rect(24 + i * 22, 246, 10, 8, '#7A8A9A', '', 1);
    s += path('M150 54l4 -14l4 14z', '', '', 0);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 146, 6) + s);
  };
  ART.outbackhouse = function (b) {
    var s = '', i;
    s += rect(20, 112, 160, 76, '#E8D2A0', '#A88A52', 2) + path('M8 116L100 52L192 116Z', '#B8442E', '#7A2418', 2.6);
    for (i = 0; i < 9; i++) s += path('M' + (24 + i * 18) + ' 114L' + (100 + (i - 4.5) * 2) + ' 56', '', 'rgba(255,255,255,.28)', 2);
    s += rect(8, 150, 184, 6, '#8A5A2E', '#5A3410', 1.4) + rect(8, 186, 184, 6, '#8A5A2E', '#5A3410', 1.4);
    for (i = 0; i < 6; i++) s += rect(10 + i * 34, 150, 6, 40, '#8A5A2E', '#5A3410', 1);
    s += rect(36, 124, 34, 28, '#CFE8F5', '#5A3410', 2) + rect(130, 124, 34, 28, '#CFE8F5', '#5A3410', 2) + path('M53 124v28M36 138h34M147 124v28M130 138h34', '', '#8A5A2E', 1.6) + rect(82, 136, 36, 52, '#8A5A2E', '#5A3410', 2) + path('M100 136v52', '', '#5A3410', 1.4);
    s += rect(140, 74, 14, 28, '#8A8F9A', '#5A6070', 2) + rect(150, 170, 26, 18, '#B8733A', '#7A4A22', 2) + circ(60, 176, 5, '#6A9A3A');
    return T(b.x * 100, b.y * 100, shadow(100, 192, 94, 6) + s);
  };
  big('sydneyopera', 'sydneyopera', 3, 3); big('outbackhouse', 'outbackhouse', 2, 2);
  ART.auflag = flagPole('au');
  ART.boomerang = function (b) {
    var s = shadow(50, 92, 36, 5) + path('M14 62Q26 24 62 22Q70 22 70 30Q44 32 32 66Q28 74 18 72Q12 70 14 62Z', '#C8734A', '#7A3A1A', 2.4) + path('M22 60Q30 38 54 30', '', '#F2C94C', 2) + circ(24, 62, 2, '#F2C94C') + circ(36, 44, 2, '#fff') + circ(52, 32, 2, '#F2C94C');
    s += rect(58, 34, 12, 56, '#8A5A2E', '#5A3410', 3) + path('M58 46h12M58 58h12M58 70h12', '', '#E5A33B', 2.4) + ell(64, 34, 8, 3, '#5A3410') + circ(62, 50, 2, '#E5334B') + circ(66, 64, 2, '#F2C94C');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.kangaroosign = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 26, 4) + rect(46, 40, 8, 52, '#8A8F9A', '#5A6070', 2) + poly('50,6 82,38 50,70 18,38', '#FFD23F', '#1E1E1E') + poly('50,12 76,38 50,64 24,38', '#FFD23F', '') + path('M34 44q4 -14 14 -16q2 -6 8 -4q-2 8 -6 10q6 4 6 14l-6 -2l-4 8l-3 -10l-6 2z', '#1E1E1E', '', 0));
  };

  /* ═════════ CANADA — Canada Culture Park ═════════ */
  THEME.canada = { g1: '#BFE6A8', g2: '#98CF84', ground: function (R, W, H2) { return scatter(R, W, H2, 28, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'l4 -8l4 8l-4 -2z" fill="' + ['#D5381E', '#F2A32C', '#B8332A'][i % 3] + '" opacity=".75"/>'; }) + scatter(R, W, H2, 10, function (x, y) { return '<ellipse cx="' + f0(x) + '" cy="' + f0(y) + '" rx="22" ry="6" fill="rgba(255,255,255,.35)"/>'; }); } };
  DTH.canada = { leaf: ['#3F8A4A', '#2F763C', '#D5381E'], bush: ['#2F763C', '#D5381E'], rock: ['#9AA3AE', '#B9C1CB'], post: '#8A5A2E', rail: '#D52B1E' };
  ART.cntower = function (b) {
    var s = '', i;
    s += poly('20,290 60,230 60,290', '#9AA8BC', '#5A6A80') + poly('280,290 240,230 240,290', '#9AA8BC', '#5A6A80') + rect(40, 250, 40, 40, '#B8C4D4', '#6A7A90', 2) + rect(220, 250, 40, 40, '#B8C4D4', '#6A7A90', 2) + rect(80, 262, 30, 28, '#A8B4C6', '#6A7A90', 2) + rect(190, 262, 30, 28, '#A8B4C6', '#6A7A90', 2);
    for (i = 0; i < 6; i++) s += rect(46 + (i % 3) * 11, 256 + Math.floor(i / 3) * 14, 7, 9, '#FFE9A8', '', 1) + rect(226 + (i % 3) * 11, 256 + Math.floor(i / 3) * 14, 7, 9, '#FFE9A8', '', 1);
    s += poly('142,290 158,290 153,150 147,150', '#D8DEE8', '#7A8AA0') + poly('150,150 154,90 146,90', '#C8D0DC', '#7A8AA0');
    s += ell(150, 158, 30, 9, '#E8EDF4', '#7A8AA0') + ell(150, 148, 28, 9, '#C8D4E4', '#7A8AA0') + path('M122 150Q150 160 178 150', '', '#7A8AA0', 2) + rect(120, 146, 60, 8, '#9AA8BC', '', 0);
    for (i = 0; i < 9; i++) s += rect(124 + i * 6.4, 148, 3.4, 5, '#FFE9A8', '', 0);
    s += ell(150, 120, 14, 4, '#B8C4D4', '#7A8AA0') + path('M150 90V20', '', '#8A93A0', 4) + path('M150 20V8', '', '#E5334B', 3) + circ(150, 8, 3, '#E5334B');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.logcabin = function (b) {
    var s = '', i;
    s += rect(20, 100, 160, 88, '#B8733A', '#5A3410', 2);
    for (i = 0; i < 8; i++) s += path('M20 ' + (108 + i * 11) + 'H180', '', '#7A4426', 2) + circ(20, 108 + i * 11, 5, '#C98A5C', '#7A4426') + circ(180, 108 + i * 11, 5, '#C98A5C', '#7A4426');
    s += poly('4,106 100,40 196,106', '#6B4A2B', '#3A2A18') + poly('4,106 100,40 100,106', '#7A5A38') + path('M20 100L100 52M180 100L100 52', '', 'rgba(255,255,255,.35)', 3);
    s += rect(130, 56, 18, 34, '#8A8F9A', '#5A6070', 2) + ell(140, 44, 9, 6, 'rgba(255,255,255,.55)') + ell(150, 32, 7, 5, 'rgba(255,255,255,.4)');
    s += path('M4 106Q50 96 100 106Q150 96 196 106V112Q150 104 100 112Q50 104 4 112Z', '#F4FAFF', '#B8CFE6', 1.6);
    s += rect(82, 128, 36, 60, '#7A4A22', '#4A2A12', 2) + rect(30, 120, 34, 32, '#FFE9A8', '#4A2A12', 2) + rect(136, 120, 34, 32, '#FFE9A8', '#4A2A12', 2) + path('M47 120v32M30 136h34M153 120v32M136 136h34', '', '#4A2A12', 1.6) + circ(110, 160, 2.4, '#F2C94C');
    s += ell(176, 188, 22, 6, '#F4FAFF') + path('M150 188l6 -22h8l-4 22z', '#6B4A2B', '#3A2A18', 1.4);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 96, 6) + s);
  };
  big('cntower', 'cntower', 3, 3); big('logcabin', 'logcabin', 2, 2);
  ART.caflag = flagPole('ca');
  ART.maplesyrup = function (b) {
    var s = shadow(50, 92, 36, 5) + path('M30 88V50Q30 42 36 38V28H50V38Q56 42 56 50V88Z', '#B8733A', '#6B3A18', 2.2) + rect(33, 56, 20, 22, '#F2C94C', '#8A6A1A', 1.6) + path('M43 60l-6 12h12z', '#D5381E', '', 0) + rect(34, 22, 18, 8, '#6B4A2B', '#3A2A18', 2) + path('M38 38q5 -4 10 0', '', 'rgba(255,255,255,.5)', 2);
    s += ell(76, 84, 20, 6, '#F4EFE0', '#8A7A5A') + ell(76, 78, 16, 5, '#E8C98A', '#A88A52') + ell(76, 72, 14, 4, '#F2D49A', '#A88A52') + path('M66 70Q76 62 86 70Q86 80 76 82Q66 80 66 70Z', '#B8733A', '', 0) + circ(76, 66, 5, '#D5381E', '#7A1E10');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.totempole = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 4) + rect(36, 8, 28, 84, '#C98A4B', '#6B3A18', 3) + ell(50, 24, 14, 12, '#2E9B6A', '#16603E') + path('M38 18Q50 4 62 18Z', '#E5334B', '#7A1E10', 1.6) + circ(44, 24, 3, '#fff') + circ(56, 24, 3, '#fff') + circ(44, 24, 1.4, '#14143A') + circ(56, 24, 1.4, '#14143A') + path('M42 32q8 5 16 0', '', '#14143A', 2) + rect(36, 40, 28, 18, '#E5334B', '#7A1E10', 2) + path('M30 50l6 -8M70 50l-6 -8M30 56l6 0M70 56l-6 0', '', '#F2C94C', 3) + circ(50, 49, 5, '#fff', '#7A1E10') + circ(50, 49, 2, '#14143A') + ell(50, 72, 14, 10, '#2B6BC8', '#16407A') + path('M40 68l5 4l5 -4l5 4l5 -4', '', '#fff', 2) + path('M42 80h16', '', '#F2C94C', 2.4));
  };
  ART.canoe = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 40, 5) + path('M6 60Q30 80 50 80Q70 80 94 60Q70 66 50 66Q30 66 6 60Z', '#C98A4B', '#6B3A18', 2.4) + path('M10 62Q30 72 50 72Q70 72 90 62', '', '#E8B070', 2) + rect(36, 54, 28, 6, '#8A5A2E', '#5A3410', 1.4) + path('M70 40L88 76', '', '#8A5A2E', 3) + path('M84 70l8 8l-10 -2z', '#C98A4B', '#6B3A18', 1.6) + path('M22 56l10 -14', '', '#8A5A2E', 3));
  };
  ART.uluru = function (b) {
    var s = '';
    s += path('M4 190Q8 150 36 140Q50 120 90 124Q150 112 214 130Q244 138 252 170Q256 184 250 196H8Z', '#C8553A', '#7A2A14', 2.6) + path('M40 150Q60 128 100 130Q150 120 206 134', '', 'rgba(255,200,150,.45)', 5) + path('M30 170Q80 160 130 172Q190 162 240 178', '', 'rgba(120,40,20,.35)', 4) + path('M60 140q4 24 -2 48M110 130q6 22 0 56M170 128q4 26 -4 60M214 140q6 24 -2 46', '', 'rgba(110,40,20,.4)', 3);
    s += path('M14 190Q60 196 130 192Q200 196 248 190', '', '#9A3A22', 3);
    return T(b.x * 100, b.y * 100, shadow(130, 196, 128, 6) + s);
  };
  big('uluru', 'uluru', 3, 2);
})(typeof window !== 'undefined' ? window : this);
