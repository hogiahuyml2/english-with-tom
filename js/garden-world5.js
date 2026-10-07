/* EWT Garden — 15 khu văn hoá quốc gia (phần 2: Pháp, Ý, Vương quốc Anh, Hoa Kỳ, Đức). Nạp SAU garden-world4.js. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H, big = API.bigOf;
  var T = H.T, shadow = H.shadow, F = H.F, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;

  /* ═════════ PHÁP — France Culture Park ═════════ */
  THEME.france = { g1: '#B8E0A0', g2: '#92C87E', ground: function (R, W, H2) { return scatter(R, W, H2, 40, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + (i % 2 ? '#C9A8FF' : '#fff') + '" opacity=".75"/>'; }); } };
  DTH.france = { leaf: ['#5DB04C', '#4A9A3E', '#7FD36B'], bush: ['#4A9A3E', '#B48CFF'], rock: ['#B8B2A4', '#D8D2C4'], post: '#2A2A34', rail: '#4A4A58' };
  ART.eiffel = function (b) {
    var s = '';
    s += path('M70 292L108 200L120 200L112 292Z M230 292L192 200L180 200L188 292Z', '#6B5646') + path('M70 292Q84 216 114 156L128 156Q110 224 108 292Z M230 292Q216 216 186 156L172 156Q190 224 192 292Z', '#7A6454');
    s += path('M52 292Q60 270 76 256Q150 236 224 256Q240 270 248 292Z', '#5E4A3C') + path('M100 292Q150 244 200 292', '', '#7A6454', 5);
    s += rect(96, 196, 108, 10, '#6B5646') + rect(112, 150, 76, 10, '#6B5646') + path('M114 160L142 70H158L186 160Z', '#7A6454') + path('M126 160L146 96M174 160L154 96M118 196L134 160M182 196L166 160', '', '#4A3A30', 3) + rect(130, 68, 40, 8, '#6B5646') + path('M138 68L148 30H152L162 68Z', '#7A6454') + path('M150 30V6', '', '#6B5646', 4) + circ(150, 6, 3.4, '#F2C94C');
    s += path('M108 230h84M118 178h64M140 110h20', '', '#4A3A30', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 112, 8) + s);
  };
  ART.cafe = function (b) {
    var s = '', i;
    s += rect(24, 70, 152, 118, '#F4E4C8', '#B89A6A', 3) + rect(24, 70, 152, 14, '#2A3A6A') + rect(36, 96, 64, 56, F('glass'), '#2A3A6A', 3) + rect(108, 96, 56, 92, '#2A3A6A', '', 3) + circ(154, 144, 3, '#F2C94C');
    for (i = 0; i < 8; i++) s += poly((24 + i * 19) + ',92 ' + (43 + i * 19) + ',92 ' + (43 + i * 19 - 3) + ',112 ' + (24 + i * 19 + 3) + ',112', i % 2 ? '#fff' : '#E23B3B', '#8A1E1E');
    s += path('M30 92h140', '', '#8A1E1E', 2) + ell(56, 178, 14, 4, '#B89A6A') + rect(54, 160, 4, 18, '#6B5646') + ell(56, 160, 16, 4, '#8A5A2E') + ell(150, 188, 10, 3, '#B89A6A') + rect(60, 56, 80, 14, '#2A3A6A', '', 3) + '<text x="100" y="67" text-anchor="middle" font-size="11" font-weight="800" fill="#F2E8D0" font-family="serif">CAFÉ</text>';
    return T(b.x * 100, b.y * 100, shadow(100, 192, 84, 6) + s);
  };
  ART.frflag = flagPole('fr');
  ART.baguette = function (b) {
    var s = '', i;
    s += '<path d="M14 78Q8 40 32 34Q42 32 46 40L58 84Q50 92 38 88Z" fill="#6B4A2B" opacity=".25"/><path d="M20 90L74 24Q84 14 92 22Q98 30 90 40L36 98Q26 102 20 90Z" fill="#E8B456" stroke="#A8762A" stroke-width="2.4"/>';
    for (i = 0; i < 4; i++) s += '<path d="M' + (34 + i * 12) + ' ' + (84 - i * 14) + 'l12 -10" stroke="#C98A32" stroke-width="3.4" stroke-linecap="round"/>';
    return T(b.x * 100, b.y * 100, shadow(50, 92, 32, 5) + s + '<path d="M16 96Q50 106 84 96" stroke="#8A5A2E" stroke-width="3" fill="none"/>');
  };
  big('eiffel', 'eiffel', 3, 3);

  /* ═════════ Ý — Italy Culture Park ═════════ */
  THEME.italy = { g1: '#C9E2A0', g2: '#A8CE80', ground: function (R, W, H2) { return scatter(R, W, H2, 30, function (x, y, r) { return '<ellipse cx="' + f0(x) + '" cy="' + f0(y) + '" rx="' + f0(8 + r() * 8) + '" ry="4" fill="rgba(190,170,130,.4)"/>'; }); } };
  DTH.italy = { leaf: ['#6DA84A', '#58963C', '#8FC062'], bush: ['#58963C', '#7FB84C'], rock: ['#C9BFA4', '#E0D8C0'], post: '#C9BFA4', rail: '#9A8A6A' };
  ART.colosseum = function (b) {
    var s = '', i, j;
    s += path('M14 250Q14 130 150 118Q286 130 286 250Z', '#E2CFA2', '#A8946A', 3) + path('M14 250Q14 160 150 148Q286 160 286 250Z', '#D4BF8E');
    for (j = 0; j < 3; j++) for (i = 0; i < 10; i++) { var x = 36 + i * 23.4, y = 140 + j * 34 + (Math.abs(i - 4.5) * 3 * (j === 0 ? 1.2 : 1)); s += path('M' + x + ' ' + (y + 28) + 'V' + (y + 10) + 'Q' + (x + 6) + ' ' + (y - 2) + ' ' + (x + 12) + ' ' + (y + 10) + 'V' + (y + 28) + 'Z', '#6A5A44'); }
    s += path('M14 250Q150 276 286 250', '', '#A8946A', 3) + path('M22 232Q150 252 278 232', '', '#B89E6E', 2) + path('M60 126Q80 112 108 120L98 140Z', '#C0A978') + path('M230 120Q252 114 270 130L252 142Z', '#C0A978');
    return T(b.x * 100, b.y * 100, shadow(150, 268, 140, 8) + s);
  };
  ART.pizzeria = function (b) {
    var s = '', i;
    s += rect(26, 74, 148, 112, '#F2D49A', '#B8934A', 3) + rect(26, 74, 148, 14, '#B8532E') + poly('16,76 100,34 184,76', '#B8532E', '#6B2A16') + ell(100, 150, 38, 34, '#8A6A4A', '#4A3A2A') + path('M62 150Q62 112 100 108Q138 112 138 150Z', '#3A2A20') + path('M80 150Q80 130 100 128Q120 130 120 150Z', '#FF8A2A', '', 0) + path('M86 150Q86 138 100 134Q114 138 114 150Z', '#FFD23F');
    for (i = 0; i < 7; i++) s += poly((26 + i * 21.3) + ',88 ' + (47 + i * 21.3) + ',88 ' + (44 + i * 21.3) + ',104 ' + (29 + i * 21.3) + ',104', i % 2 ? '#fff' : '#009246', '#6A6A6A');
    s += rect(150, 60, 14, 22, '#8A5A4A', '#4A2A20', 2) + path('M154 56q-4 -10 4 -16', '', '#C9CFD8', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 190, 84, 6) + s);
  };
  ART.itflag = flagPole('it');
  ART.pizza = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 34, 6) + '<path d="M50 84L14 28Q50 6 86 28Z" fill="#F2C54B" stroke="#B8832B" stroke-width="2.4"/><path d="M14 28Q50 6 86 28" fill="none" stroke="#D99A3A" stroke-width="7" stroke-linecap="round"/><circle cx="40" cy="38" r="6" fill="#D93A2E"/><circle cx="58" cy="34" r="5.4" fill="#D93A2E"/><circle cx="50" cy="54" r="6" fill="#D93A2E"/><circle cx="46" cy="70" r="4" fill="#D93A2E"/><path d="M30 44q4 -3 8 0M62 48q4 -3 8 0M56 64q4 -3 8 0" stroke="#009246" stroke-width="3" fill="none" stroke-linecap="round"/>');
  };
  big('colosseum', 'colosseum', 3, 3);

  /* ═════════ VƯƠNG QUỐC ANH — UK Culture Park ═════════ */
  THEME.uk = { g1: '#9FD68A', g2: '#7DBE6C', ground: function (R, W, H2) { return scatter(R, W, H2, 60, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'l-3 -8m3 8l0 -10m0 10l3 -8" stroke="rgba(30,100,50,.4)" stroke-width="2" stroke-linecap="round"/>'; }); } };
  DTH.uk = { leaf: ['#4F9A4A', '#3C843E', '#6FB866'], bush: ['#3C843E', '#5DAE55'], rock: ['#9AA3AE', '#B9C1CB'], post: '#2A2A34', rail: '#C8102E' };
  ART.bigben = function (b) {
    var s = '', i;
    s += rect(98, 120, 104, 172, '#D8C49A', '#8A7440', 3) + path('M106 120V292M122 120V292M178 120V292M194 120V292', '', 'rgba(120,96,50,.35)', 2);
    s += rect(88, 110, 124, 14, '#C9B27A', '#8A7440', 2) + rect(96, 52, 108, 62, '#E8D8AA', '#8A7440', 3) + circ(150, 84, 24, '#FFFFFF', '#8A7440') + circ(150, 84, 20, '#F7F1E0') + path('M150 84V68M150 84l10 6', '', '#2A2A34', 3) + circ(150, 84, 2.4, '#2A2A34');
    for (i = 0; i < 12; i++) s += circ(150 + Math.cos(i * Math.PI / 6) * 17, 84 + Math.sin(i * Math.PI / 6) * 17, 1.2, '#2A2A34');
    s += rect(100, 140, 22, 40, '#7A6A44', '', 10) + rect(178, 140, 22, 40, '#7A6A44', '', 10) + rect(100, 190, 22, 40, '#7A6A44', '', 10) + rect(178, 190, 22, 40, '#7A6A44', '', 10);
    s += poly('96,52 204,52 190,24 110,24', '#6B8A7A', '#3A5A4A') + poly('112,24 188,24 150,-6', '#6B8A7A', '#3A5A4A') + path('M150 -6V-18', '', '#F2C94C', 3) + circ(150, -20, 4, '#F2C94C');
    return T(b.x * 100, b.y * 100, shadow(150, 294, 70, 8) + '<g transform="translate(0 40) scale(1 .86)">' + s + '</g>');
  };
  ART.doubledecker = function (b) {
    var s = '', i;
    s += rect(18, 60, 164, 96, '#D8232A', '#8A1418', 8) + rect(18, 106, 164, 6, '#8A1418') + rect(22, 150, 156, 12, '#B01C22', '', 3);
    for (i = 0; i < 6; i++) s += rect(28 + i * 26, 70, 20, 28, F('glass'), '#8A1418', 2) + rect(28 + i * 26, 120, 20, 24, F('glass'), '#8A1418', 2);
    s += rect(150, 120, 24, 36, '#3A3A44', '', 3) + circ(52, 164, 14, '#2A2A34', '#555') + circ(52, 164, 5, '#CFC8B8') + circ(146, 164, 14, '#2A2A34', '#555') + circ(146, 164, 5, '#CFC8B8') + rect(60, 44, 80, 14, '#fff', '#8A1418', 3) + '<text x="100" y="55" text-anchor="middle" font-size="9" font-weight="800" fill="#8A1418" font-family="Arial">LONDON</text>';
    return T(b.x * 100, b.y * 100, shadow(100, 180, 84, 6) + s);
  };
  ART.ukflag = flagPole('uk');
  ART.phonebox = function (b) {
    var s = '', i, j;
    s += rect(26, 14, 48, 76, '#D8232A', '#8A1418', 4) + path('M22 14Q50 -2 78 14Z', '#D8232A', '#8A1418', 2) + rect(34, 22, 32, 52, '#FFE9B0', '#8A1418', 2) + rect(36, 8, 28, 8, '#FFFFFF', '#8A1418', 2);
    for (i = 0; i < 3; i++) for (j = 0; j < 4; j++) s += rect(36 + i * 10, 24 + j * 12, 8, 10, '#CFE8F5', '#8A1418', 1);
    return T(b.x * 100, b.y * 100, shadow(50, 91, 28, 5) + s);
  };
  big('bigben', 'bigben', 3, 3);

  /* ═════════ HOA KỲ — USA Culture Park ═════════ */
  THEME.usa = { g1: '#A8DC86', g2: '#82C25E', ground: function (R, W, H2) { return scatter(R, W, H2, 24, function (x, y, r, i) { return FL.star(x, y, 6, r() * 70, i % 2 ? 'rgba(255,255,255,.55)' : 'rgba(60,70,160,.2)'); }); } };
  DTH.usa = { leaf: ['#4FA04A', '#3C8A3E', '#79C262'], bush: ['#3C8A3E', '#B22234'], rock: ['#9AA3AE', '#B9C1CB'], post: '#FFFFFF', rail: '#B22234' };
  ART.liberty = function (b) {
    var s = '';
    s += poly('96,292 204,292 192,222 108,222', '#CFC8B8', '#8A8470') + rect(104, 190, 92, 36, '#D8D2C0', '#8A8470', 3) + rect(116, 150, 68, 44, '#C9C2AC', '#8A8470', 3);
    s += path('M126 150L132 100Q150 90 168 100L174 150Z', '#5FB8A0', '#2F7F6A', 2.4) + path('M132 100L120 70M168 100L184 56', '', '#5FB8A0', 11) + rect(116, 84, 12, 22, '#4FA890', '#2F7F6A', 2) + path('M184 56V22', '', '#5FB8A0', 9) + path('M178 22Q184 6 190 22Z', '#F2C94C', '#B8861B', 2) + circ(184, 28, 8, '#F2C94C', '#B8861B');
    s += circ(150, 78, 16, '#5FB8A0', '#2F7F6A') + path('M132 66L124 50M140 60L134 42M150 58V38M160 60L166 42M168 66L176 50', '', '#5FB8A0', 5) + path('M136 74q14 -8 28 0', '', '#2F7F6A', 2) + rect(112, 82, 14, 18, '#4FA890', '#2F7F6A', 2) + path('M126 150L118 132M174 150L182 132', '', '#4FA890', 6);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 110, 8) + s);
  };
  ART.yellowcab = function (b) {
    var s = '';
    s += path('M22 152Q24 112 60 106L74 84H126L142 106Q178 112 180 152Z', '#F8C21C', '#B8860B', 2.6) + path('M78 90H124L134 106H70Z', F('glass'), '#B8860B', 2) + rect(88, 66, 24, 12, '#fff', '#222', 2) + rect(22, 126, 158, 5, '#222') + '<g fill="#222">' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<rect x="' + (30 + i * 18) + '" y="120" width="9" height="6"/>'; }).join('') + '</g>' + circ(58, 154, 14, '#2A2A34', '#555') + circ(58, 154, 5, '#CFC8B8') + circ(146, 154, 14, '#2A2A34', '#555') + circ(146, 154, 5, '#CFC8B8');
    return T(b.x * 100, b.y * 100, shadow(100, 174, 82, 6) + s);
  };
  ART.usflag = flagPole('us');
  ART.hotdog = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 36, 5) + '<path d="M10 70Q10 52 50 52Q90 52 90 70Q90 84 50 84Q10 84 10 70Z" fill="#E8B456" stroke="#A8762A" stroke-width="2.4"/><path d="M12 62Q50 78 88 62" fill="none" stroke="#C98A32" stroke-width="2"/><rect x="6" y="56" width="88" height="14" rx="7" fill="#B8533A" stroke="#7A2A1A" stroke-width="2.2"/><path d="M14 63q8 -6 16 0t16 0t16 0t16 0" stroke="#F2C94C" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M14 68q8 -4 16 0t16 0t16 0t16 0" stroke="#D93A2E" stroke-width="2.4" fill="none" stroke-linecap="round"/>');
  };
  big('liberty', 'liberty', 3, 3);

  /* ═════════ ĐỨC — Germany Culture Park ═════════ */
  THEME.germany = { g1: '#A8D88A', g2: '#82BE66', ground: function (R, W, H2) { return scatter(R, W, H2, 40, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + (i % 2 ? '#5B8BE8' : '#fff') + '" opacity=".7"/>'; }); } };
  DTH.germany = { leaf: ['#3F8A3E', '#2F7632', '#5DA856'], bush: ['#2F7632', '#4F9A46'], rock: ['#9AA3AE', '#B9C1CB'], post: '#6B4A2B', rail: '#DD0000' };
  ART.brandenburg = function (b) {
    var s = '', i;
    s += rect(14, 80, 272, 22, '#E2D8BE', '#A89A74', 3) + rect(14, 100, 272, 10, '#C9BFA0', '#A89A74', 2);
    for (i = 0; i < 6; i++) s += rect(26 + i * 46, 110, 24, 160, '#EADFC4', '#A89A74', 3) + rect(22 + i * 46, 104, 32, 10, '#D8CCAE', '#A89A74', 2) + rect(22 + i * 46, 268, 32, 12, '#D8CCAE', '#A89A74', 2) + path('M' + (34 + i * 46) + ' 116V264M' + (42 + i * 46) + ' 116V264', '', 'rgba(150,130,90,.35)', 2);
    s += rect(124, 56, 52, 26, '#D8CCAE', '#A89A74', 2) + path('M126 56Q150 28 174 56', '', '#6B8A58', 8) + path('M138 56Q134 30 150 20Q166 30 162 56', '#6B8A58', '#3A5A38', 2) + path('M150 20V8', '', '#6B8A58', 4) + poly('142,10 158,10 150,0', '#F2C94C') + path('M134 46q8 -16 16 -10t16 10', '', '#F2C94C', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 286, 142, 8) + s);
  };
  ART.bavarianhouse = function (b) {
    var s = '', i;
    s += rect(24, 84, 152, 104, '#FBF3DC', '#B8A878', 3) + poly('10,90 100,28 190,90 176,94 100,44 24,94', '#8A3A2A', '#4A1A10') + path('M24 120h152M24 154h152M64 94v94M100 94v94M136 94v94M24 94L64 120M176 94L136 120', '', '#6B4A2B', 4) + rect(82, 138, 36, 50, '#8A5A2E', '#5A3410', 3);
    for (i = 0; i < 2; i++) s += rect(34 + i * 118, 100, 28, 28, '#CFE8F5', '#6B4A2B', 2) + rect(30 + i * 118, 126, 36, 8, '#B23A3A') + circ(40 + i * 118, 124, 3, '#FF5C7A') + circ(52 + i * 118, 124, 3, '#F2C94C') + circ(60 + i * 118, 124, 3, '#FF5C7A');
    s += rect(34, 150, 28, 28, '#CFE8F5', '#6B4A2B', 2) + rect(138, 150, 28, 28, '#CFE8F5', '#6B4A2B', 2) + '<circle cx="100" cy="70" r="12" fill="#fff" stroke="#6B4A2B" stroke-width="2"/><path d="M100 70V62M100 70l6 3" stroke="#222" stroke-width="2"/>';
    return T(b.x * 100, b.y * 100, shadow(100, 190, 84, 6) + s);
  };
  ART.deflag = flagPole('de');
  ART.pretzel = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 34, 5) + '<path d="M50 80Q16 78 16 52Q16 28 38 28Q54 28 50 46Q46 60 30 66M50 80Q84 78 84 52Q84 28 62 28Q46 28 50 46Q54 60 70 66M30 66Q50 54 70 66" fill="none" stroke="#8A4A1E" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/><path d="M50 80Q16 78 16 52Q16 28 38 28Q54 28 50 46Q46 60 30 66M50 80Q84 78 84 52Q84 28 62 28Q46 28 50 46Q54 60 70 66M30 66Q50 54 70 66" fill="none" stroke="#C97A32" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><circle cx="26" cy="40" r="1.6" fill="#fff"/><circle cx="34" cy="34" r="1.6" fill="#fff"/><circle cx="74" cy="40" r="1.6" fill="#fff"/><circle cx="66" cy="34" r="1.6" fill="#fff"/><circle cx="50" cy="56" r="1.6" fill="#fff"/>');
  };
  big('brandenburg', 'brandenburg', 3, 3);
})(typeof window !== 'undefined' ? window : this);
