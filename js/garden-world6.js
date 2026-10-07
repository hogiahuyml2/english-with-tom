/* EWT Garden — 15 khu văn hoá quốc gia (phần 3: Hà Lan, Hy Lạp, Thụy Điển, Thụy Sĩ, Indonesia). Nạp SAU garden-world5.js. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H, big = API.bigOf;
  var T = H.T, shadow = H.shadow, F = H.F, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;

  /* ═════════ HÀ LAN — Netherlands Culture Park ═════════ */
  THEME.netherlands = { g1: '#A6DC84', g2: '#80C25C', ground: function (R, W, H2) { return scatter(R, W, H2, 60, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3.4" fill="' + ['#FF5C7A', '#FFD23F', '#fff', '#B48CFF'][i % 4] + '" opacity=".8"/>'; }); } };
  DTH.netherlands = { leaf: ['#4FA04A', '#3C8A3E', '#79C262'], bush: ['#FF5C7A', '#4FA04A'], rock: ['#9AA3AE', '#B9C1CB'], post: '#21468B', rail: '#AE1C28' };
  ART.dutchwindmill = function (b) {
    var s = '', i, a;
    s += poly('96,292 204,292 186,128 114,128', '#EADFC4', '#A89A74') + path('M114 128L96 292M186 128L204 292', '', '#A89A74', 2) + poly('104,128 196,128 150,70', '#6B4A2B', '#3A2A18') + rect(128, 230, 44, 62, '#8A5A2E', '#5A3410', 3) + rect(130, 170, 18, 24, F('glass'), '#6B4A2B', 2) + rect(152, 170, 18, 24, F('glass'), '#6B4A2B', 2);
    s += '<g class="spin" style="transform-origin:150px 100px">';
    for (i = 0; i < 4; i++) { a = i * 90; s += '<g transform="rotate(' + a + ' 150 100)">' + rect(147, 14, 6, 86, '#6B4A2B', '', 2) + rect(153, 20, 26, 72, '#FFFFFF', '#6B4A2B', 2) + path('M153 36h26M153 52h26M153 68h26', '', '#6B4A2B', 2) + '</g>'; }
    s += '</g>' + circ(150, 100, 9, '#8A5A2E', '#3A2A18');
    return T(b.x * 100, b.y * 100, shadow(150, 294, 90, 8) + s);
  };
  ART.tulipfield = function (b) {
    var s = '', i, j, c = ['#E23B3B', '#F2C94C', '#FF8FB8', '#B48CFF'];
    for (j = 0; j < 4; j++) { s += rect(14, 30 + j * 38, 172, 26, '#7A5A38', '', 8); for (i = 0; i < 9; i++) { var x = 26 + i * 18, y = 46 + j * 38; s += path('M' + x + ' ' + (y + 8) + 'V' + (y - 6), '', '#3F9A3E', 2.4) + '<path d="M' + (x - 6) + ' ' + (y - 6) + 'Q' + (x - 6) + ' ' + (y - 18) + ' ' + x + ' ' + (y - 18) + 'Q' + (x + 6) + ' ' + (y - 18) + ' ' + (x + 6) + ' ' + (y - 6) + 'Z" fill="' + c[j] + '" stroke="rgba(0,0,0,.2)" stroke-width="1"/>'; } }
    return T(b.x * 100, b.y * 100, shadow(100, 188, 90, 5) + s);
  };
  ART.nlflag = flagPole('nl');
  ART.woodenshoe = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 36, 5) + '<path d="M10 62Q10 48 28 46Q46 44 58 50Q70 40 88 52Q96 62 90 78Q80 88 50 86Q16 86 10 76Z" fill="#E8B456" stroke="#8A5A2E" stroke-width="2.6"/><path d="M28 46Q40 56 58 50" fill="none" stroke="#8A5A2E" stroke-width="2"/><ellipse cx="38" cy="54" rx="12" ry="6" fill="#6B4A2B"/><path d="M14 74h76" stroke="#C98A32" stroke-width="3"/><circle cx="64" cy="64" r="3" fill="#E23B3B"/><circle cx="74" cy="68" r="3" fill="#2E6BD8"/><circle cx="54" cy="68" r="3" fill="#fff"/>');
  };
  big('dutchwindmill', 'dutchwindmill', 3, 3);

  /* ═════════ HY LẠP — Greece Culture Park ═════════ */
  THEME.greece = { g1: '#EEE2C0', g2: '#D8C8A0', noGrass: 1, ground: function (R, W, H2) { return scatter(R, W, H2, 22, function (x, y, r) { return '<ellipse cx="' + f0(x) + '" cy="' + f0(y) + '" rx="' + f0(10 + r() * 14) + '" ry="5" fill="rgba(160,140,100,.3)"/>'; }) + scatter(R, W, H2, 20, function (x, y) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="4" fill="#7FA84A"/>'; }); } };
  DTH.greece = { leaf: ['#7FA84A', '#6A9438', '#9AC062'], bush: ['#6A9438', '#B48CFF'], rock: ['#D8D2C0', '#EFEAD8'], post: '#FFFFFF', rail: '#0D5EAF' };
  ART.parthenon = function (b) {
    var s = '', i;
    s += rect(14, 262, 272, 14, '#E8E2D0', '#A8A290', 2) + rect(24, 250, 252, 14, '#EFEAD8', '#A8A290', 2) + rect(34, 238, 232, 14, '#F4F0E2', '#A8A290', 2);
    for (i = 0; i < 8; i++) s += rect(46 + i * 29, 114, 18, 124, '#F7F2E4', '#B8B29A', 2) + path('M' + (52 + i * 29) + ' 116V236M' + (58 + i * 29) + ' 116V236', '', 'rgba(150,140,110,.35)', 1.6) + rect(42 + i * 29, 106, 26, 10, '#E8E2CE', '#B8B29A', 2) + rect(42 + i * 29, 236, 26, 8, '#E8E2CE', '#B8B29A', 2);
    s += rect(30, 92, 240, 16, '#EDE7D2', '#B8B29A', 2) + poly('24,92 276,92 150,28', '#F4F0E2', '#B8B29A') + poly('52,86 248,86 150,42', '#E4DCC4') + path('M70 80h30M120 78h20M170 78h30', '', '#B8B29A', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 280, 142, 7) + s);
  };
  ART.santorini = function (b) {
    var s = '';
    s += rect(24, 100, 80, 88, '#FFFFFF', '#B8C4D8', 2) + rect(96, 120, 80, 68, '#FFFFFF', '#B8C4D8', 2) + path('M30 100Q64 40 98 100Z', '#2E6BD8', '#1A3F8A', 2.4) + path('M64 40V22', '', '#F2C94C', 3) + path('M58 28h12M64 22v-8', '', '#F2C94C', 2) + rect(40, 122, 18, 66, '#2E6BD8', '', 8) + rect(112, 138, 16, 50, '#2E6BD8', '', 8) + rect(140, 138, 22, 22, '#CFE8F5', '#2E6BD8', 2) + rect(34, 106, 14, 14, '#CFE8F5', '#2E6BD8', 2) + circ(150, 100, 3, '#E23B3B');
    s += path('M112 120Q136 96 160 120', '#E23B3B', '#8A1E1E', 2) + ell(60, 186, 18, 4, '#E8E2D0') + circ(70, 182, 5, '#B48CFF') + circ(82, 184, 5, '#FF5C9A');
    return T(b.x * 100, b.y * 100, shadow(100, 190, 84, 6) + s);
  };
  ART.grflag = flagPole('gr');
  ART.amphora = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 91, 22, 5) + '<path d="M38 88L42 84Q22 68 34 48Q40 40 40 30L38 22H62L60 30Q60 40 66 48Q78 68 58 84L62 88Z" fill="#C9631A" stroke="#7A3A0E" stroke-width="2.4"/><path d="M36 24Q24 28 26 44Q28 52 36 48M64 24Q76 28 74 44Q72 52 64 48" fill="none" stroke="#7A3A0E" stroke-width="3"/><rect x="36" y="18" width="28" height="7" rx="3" fill="#7A3A0E"/><path d="M32 52h36M32 60h36" stroke="#1E1A16" stroke-width="3"/><path d="M36 56q4 -3 8 0t8 0t8 0t8 0" stroke="#F2E8D0" stroke-width="2" fill="none"/>');
  };
  big('parthenon', 'parthenon', 3, 3);

  /* ═════════ THỤY ĐIỂN — Sweden Culture Park ═════════ */
  THEME.sweden = { g1: '#BFE4A0', g2: '#9ACC7E', ground: function (R, W, H2) { return scatter(R, W, H2, 40, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + (i % 2 ? '#FFD23F' : '#6AA4F2') + '" opacity=".75"/>'; }); } };
  DTH.sweden = { leaf: ['#3F8A4A', '#2F763C', '#5DA660'], bush: ['#2F763C', '#C9431F'], rock: ['#9AA3AE', '#B9C1CB'], post: '#C9431F', rail: '#FFFFFF' };
  ART.redcottage = function (b) {
    var s = '';
    s += rect(30, 150, 240, 118, '#B8321F', '#6B1A10', 3) + poly('16,154 150,66 284,154 270,160 150,86 30,160', '#3A3A44', '#1A1A22') + rect(30, 150, 240, 8, '#FFFFFF') + rect(30, 260, 240, 8, '#FFFFFF') + rect(30, 150, 8, 118, '#FFFFFF') + rect(262, 150, 8, 118, '#FFFFFF');
    s += rect(132, 190, 38, 78, '#FFFFFF', '#6B1A10', 3) + rect(138, 196, 26, 72, '#8A5A2E', '', 3) + rect(54, 178, 44, 38, '#FFFFFF', '#6B1A10', 2) + rect(60, 184, 32, 26, '#CFE8F5', '#6B1A10', 1.6) + path('M76 184v26M60 197h32', '', '#FFFFFF', 3) + rect(202, 178, 44, 38, '#FFFFFF', '#6B1A10', 2) + rect(208, 184, 32, 26, '#CFE8F5', '#6B1A10', 1.6) + path('M224 184v26M208 197h32', '', '#FFFFFF', 3) + rect(124, 96, 52, 34, '#FFFFFF', '#6B1A10', 2) + rect(130, 102, 40, 22, '#CFE8F5', '#6B1A10', 1.6);
    s += rect(224, 70, 22, 40, '#B8321F', '#6B1A10', 2) + path('M228 62q-4 -10 4 -16', '', '#C9CFD8', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 270, 140, 8) + s);
  };
  ART.dalahorse = function (b) {
    var s = '';
    s += path('M40 170L44 100Q46 70 76 60Q92 34 110 40Q116 24 130 28L134 44Q150 56 148 80L146 98Q164 108 164 140L160 170L146 170L146 140Q130 138 118 140L116 170L102 170L100 134Q80 134 64 128L60 170Z', '#D93A2E', '#8A1E14', 3);
    s += path('M92 70Q104 64 112 76Q120 70 124 84M92 90Q108 84 120 98M82 120Q100 112 122 124', '', '#FFFFFF', 4) + path('M100 62Q110 56 118 66', '', '#2E6BD8', 3) + path('M70 100Q90 92 110 106', '', '#2E6BD8', 3) + circ(118, 54, 3.4, '#222') + path('M128 46l4 -8M140 54l8 -2', '', '#F2C94C', 3) + path('M64 150Q90 144 110 152M118 148Q134 142 150 148', '', '#F2C94C', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 176, 70, 6) + s);
  };
  ART.seflag = flagPole('se');
  ART.cinnamonbun = function (b) {
    var s = '', i;
    s += ell(50, 70, 36, 12, '#E8E2D0', '#B8B29A');
    s += '<circle cx="50" cy="58" r="28" fill="#C98A3A" stroke="#8A5A1E" stroke-width="2.6"/><circle cx="50" cy="58" r="22" fill="#D9A04A"/>';
    for (i = 0; i < 3; i++) s += '<circle cx="50" cy="58" r="' + (18 - i * 6) + '" fill="none" stroke="#7A4A22" stroke-width="3.4"/>';
    s += '<circle cx="50" cy="58" r="3" fill="#7A4A22"/><circle cx="34" cy="44" r="1.8" fill="#fff"/><circle cx="66" cy="46" r="1.8" fill="#fff"/><circle cx="68" cy="70" r="1.8" fill="#fff"/><circle cx="32" cy="68" r="1.8" fill="#fff"/>';
    return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + s);
  };
  big('redcottage', 'redcottage', 3, 3);

  /* ═════════ THỤY SĨ — Switzerland Culture Park ═════════ */
  THEME.switzerland = { g1: '#B4E49A', g2: '#8CCC70', ground: function (R, W, H2) { return scatter(R, W, H2, 50, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + ['#fff', '#FFD23F', '#B48CFF'][i % 3] + '" opacity=".8"/>'; }); } };
  DTH.switzerland = { leaf: ['#3F8A4A', '#2F763C', '#5DA660'], bush: ['#2F763C', '#5DA660'], rock: ['#9AA3AE', '#B9C1CB'], post: '#8A5A2E', rail: '#DA291C' };
  ART.matterhorn = function (b) {
    var s = '', i;
    s += poly('4,262 96,150 130,170 168,34 206,128 236,106 296,262', '#7D8FA8', '#46566E') + poly('168,34 206,128 236,106 296,262 214,262 188,120', 'rgba(0,0,40,.25)') + poly('168,34 148,90 160,84 168,100 178,82 190,92 184,70', '#FFFFFF', '#D0DEEE') + poly('96,150 112,176 100,186 84,172', '#FFFFFF') + poly('236,106 244,136 232,140 222,128', '#FFFFFF');
    s += ell(150, 270, 142, 22, '#7FC66A') + path('M20 270Q150 244 280 270', '', '#5FA850', 3);
    for (i = 0; i < 5; i++) s += poly((40 + i * 26) + ',262 ' + (52 + i * 26) + ',232 ' + (64 + i * 26) + ',262', '#2F8A4A', '#1B5A30');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 6) + s);
  };
  ART.swisschalet = function (b) {
    var s = '', i;
    s += rect(30, 100, 140, 88, '#C9894A', '#6B4121', 3) + path('M30 118h140M30 136h140M30 154h140M30 172h140', '', 'rgba(60,30,10,.35)', 2) + poly('14,106 100,52 186,106 174,110 100,68 26,110', '#8A5A2E', '#4A2A10') + poly('46,108 100,70 154,108', '#C9894A', '#6B4121');
    s += rect(84, 140, 32, 48, '#6B4121', '#3A2A10', 3) + rect(44, 120, 28, 24, '#CFE8F5', '#6B4121', 2) + rect(128, 120, 28, 24, '#CFE8F5', '#6B4121', 2) + rect(36, 140, 44, 8, '#8A5A2E', '#4A2A10', 2) + rect(120, 140, 44, 8, '#8A5A2E', '#4A2A10', 2);
    for (i = 0; i < 4; i++) s += circ(46 + i * 10, 138, 3.4, ['#E23B3B', '#FF8FB8'][i % 2]) + circ(130 + i * 10, 138, 3.4, ['#FF8FB8', '#E23B3B'][i % 2]);
    s += rect(96, 80, 8, 14, '#CFE8F5', '#6B4121', 1.6);
    return T(b.x * 100, b.y * 100, shadow(100, 190, 84, 6) + s);
  };
  ART.chflag = flagPole('ch');
  ART.cuckooclock = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 91, 24, 5) + '<path d="M22 44L50 12L78 44Z" fill="#8A5A2E" stroke="#4A2A10" stroke-width="2.4"/><rect x="26" y="44" width="48" height="34" rx="3" fill="#C9894A" stroke="#4A2A10" stroke-width="2.4"/><circle cx="50" cy="58" r="13" fill="#FFF8E8" stroke="#6B4121" stroke-width="2"/><path d="M50 58V49M50 58l7 4" stroke="#222" stroke-width="2.2" stroke-linecap="round"/><rect x="42" y="30" width="16" height="12" rx="2" fill="#FFF8E8" stroke="#6B4121" stroke-width="1.6"/><path d="M48 36q2 -4 6 -1l3 1" stroke="#D93A2E" stroke-width="2" fill="none"/><path d="M38 78v10" stroke="#8A5A2E" stroke-width="2.4"/><ellipse cx="38" cy="90" rx="4" ry="5" fill="#F2C94C" stroke="#B8861B" stroke-width="1.4"/><path d="M62 78v8" stroke="#8A5A2E" stroke-width="2.4"/><path d="M58 84l8 0l-4 8z" fill="#8A8F9A"/>');
  };
  big('matterhorn', 'matterhorn', 3, 3);

  /* ═════════ INDONESIA — Indonesia Culture Park ═════════ */
  THEME.indonesia = { g1: '#7FCB62', g2: '#58AE4A', ground: function (R, W, H2) { return scatter(R, W, H2, 45, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q9 -6 18 0q-9 5 -18 0z" fill="' + (i % 3 ? 'rgba(20,90,40,.4)' : 'rgba(255,255,255,.3)') + '"/>'; }); } };
  DTH.indonesia = { leaf: ['#2F9A4E', '#1F8240', '#4FB866'], bush: ['#1F8240', '#FF8FB8'], rock: ['#8A929C', '#AAB2BC'], post: '#8A5A2E', rail: '#CE1126' };
  ART.borobudur = function (b) {
    var s = '', i, y, w;
    for (i = 0; i < 4; i++) { w = 270 - i * 54; y = 270 - i * 38; s += rect(150 - w / 2, y - 40, w, 40, i % 2 ? '#9AA0A8' : '#8A9098', '#555B64', 3) + path('M' + (150 - w / 2 + 6) + ' ' + (y - 22) + 'h' + (w - 12), '', 'rgba(0,0,0,.25)', 2); }
    for (i = 0; i < 5; i++) { var x = 56 + i * 47; s += path('M' + (x - 11) + ' 118Q' + (x - 11) + ' 90 ' + x + ' 88Q' + (x + 11) + ' 90 ' + (x + 11) + ' 118Z', '#B0B6BE', '#555B64', 2) + path('M' + (x - 5) + ' 118v-14M' + (x + 5) + ' 118v-14', '', '#555B64', 2); }
    s += path('M130 98Q130 56 150 50Q170 56 170 98Z', '#B0B6BE', '#555B64', 2.4) + path('M150 50V32', '', '#8A9098', 5) + circ(150, 30, 4, '#8A9098');
    for (i = 0; i < 8; i++) s += rect(62 + i * 25, 256 - (i % 2) * 2, 12, 12, '#7A8088', '', 2);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 142, 7) + s);
  };
  ART.baligate = function (b) {
    var s = '', i, w;
    // cổng chẻ (candi bentar): hai nửa tháp đá bậc thang, mép trong thẳng đứng
    for (i = 0; i < 6; i++) { w = 74 - i * 10; s += rect(18 + (74 - w) * 0.0, 176 - i * 24, w, 24, i % 2 ? '#C98A5A' : '#B87A4A', '#6B3A18', 2) + rect(182 - w + 0, 176 - i * 24, w, 24, i % 2 ? '#C98A5A' : '#B87A4A', '#6B3A18', 2); }
    s += rect(10, 176, 90, 14, '#8A5A2E', '#4A2A10', 2) + rect(100, 176, 90, 14, '#8A5A2E', '#4A2A10', 2).replace('x="100"', 'x="100"');
    s += rect(30, 140, 26, 24, '#D8D2C0', '#8A8470', 2) + rect(144, 140, 26, 24, '#D8D2C0', '#8A8470', 2) + path('M43 146v12M157 146v12', '', '#8A8470', 2) + poly('18,54 30,32 42,54', '#6B3A18') + poly('158,54 170,32 182,54', '#6B3A18') + circ(30, 28, 4, '#F2C94C') + circ(170, 28, 4, '#F2C94C');
    return T(b.x * 100, b.y * 100, shadow(100, 192, 84, 6) + s);
  };
  ART.idflag = flagPole('id');
  ART.wayang = function (b) {
    var s = '', i;
    s += path('M50 18Q40 10 50 6Q60 10 50 18Z', '#F2C94C', '#B8861B', 1.6) + path('M36 30Q36 18 50 18Q64 18 64 30Q66 42 56 46L58 54Q80 58 80 78Q64 90 50 88Q36 90 20 78Q20 58 42 54L44 46Q34 42 36 30Z', '#C9892A', '#6B3A0E', 2.4) + circ(44, 32, 2.4, '#222') + circ(56, 32, 2.4, '#222') + path('M46 40q4 3 8 0', '', '#6B3A0E', 1.6) + path('M30 70Q50 60 70 70M26 78Q50 70 74 78', '', '#F2C94C', 2.4) + path('M18 60Q6 74 16 88M82 60Q94 74 84 88', '', '#C9892A', 5) + path('M16 88v10M84 88v10', '', '#6B3A0E', 3);
    for (i = 0; i < 5; i++) s += circ(34 + i * 8, 80 + (i % 2) * 3, 1.4, '#2E6BD8');
    return T(b.x * 100, b.y * 100, shadow(50, 94, 28, 4) + s);
  };
  big('borobudur', 'borobudur', 3, 3);
})(typeof window !== 'undefined' ? window : this);
