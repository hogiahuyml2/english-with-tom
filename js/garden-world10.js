/* EWT Garden — 12 khu văn hoá quốc gia mới (phần 4: CHÂU ÂU — Tây Ban Nha, Nga, Ai-len, Na Uy). Nạp SAU garden-world9.js.
   Nga, Ai-len, Na Uy dùng cờ chuẩn (garden-flags.js). Tây Ban Nha KHÔNG vẽ quốc kỳ (có quốc huy phức tạp). */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H, big = API.bigOf;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;
  function cloud(x, y, s) { return '<g opacity=".9">' + ell(x, y, 26 * s, 9 * s, '#FFFFFF') + ell(x - 14 * s, y + 3 * s, 16 * s, 7 * s, '#FFFFFF') + ell(x + 16 * s, y + 2 * s, 18 * s, 7 * s, '#FFFFFF') + '</g>'; }

  /* ═════════ TÂY BAN NHA — Spain Culture Park ═════════ */
  THEME.spain = { g1: '#D8D08A', g2: '#C2B66C', noGrass: 1, ground: function (R, W, H2) { return scatter(R, W, H2, 30, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3.2" fill="' + ['#E5334B', '#F2A32C', '#FFFFFF'][i % 3] + '" opacity=".7"/>'; }); } };
  DTH.spain = { leaf: ['#7A9A3E', '#657F32', '#98B85A'], bush: ['#E5334B', '#7A9A3E'], rock: ['#D2C29A', '#E6D8B4'], post: '#8A5A2E', rail: '#C8553A' };
  ART.sagrada = function (b) {
    var s = '', i, xs = [60, 100, 140, 180, 220], hs = [150, 190, 230, 190, 150];
    s += rect(30, 200, 240, 88, '#E0CFA8', '#9A8A62', 2.6) + rect(20, 270, 260, 20, '#D2C09A', '#9A8A62', 2.2);
    for (i = 0; i < 5; i++) { var x = xs[i], h = hs[i]; s += rect(x - 15, 290 - h, 30, h - 90, '#E8D9B4', '#9A8A62', 2.2) + path('M' + (x - 15) + ' ' + (200 - (h - 150) / 2 - 10) + 'Q' + x + ' ' + (290 - h - 36) + ' ' + (x + 15) + ' ' + (200 - (h - 150) / 2 - 10) + 'Z', '#D9C49A', '#9A8A62', 2) + path('M' + x + ' ' + (290 - h - 34) + 'v-14', '', '#9A8A62', 3) + circ(x, 290 - h - 52, 4, '#F2C94C', '#B8860B'); for (var k = 0; k < 5; k++) s += rect(x - 5, 290 - h + 14 + k * 26, 10, 14, '#6A5A3A', '', 0) + path('M' + (x - 15) + ' ' + (290 - h + 36 + k * 26) + 'h30', '', 'rgba(110,90,50,.35)', 1.6); }
    s += path('M110 288V236Q110 214 150 214Q190 214 190 236V288Z', '#5A4A2E', '#3A2E18', 2) + path('M118 288V240Q118 224 150 224Q182 224 182 240V288Z', '#7A6840', '', 0);
    for (i = 0; i < 6; i++) s += circ(46 + i * 42, 230, 5, ['#E5334B', '#F2C94C', '#2E9B6A'][i % 3], '#9A8A62') + path('M' + (46 + i * 42) + ' 236v14', '', '#9A8A62', 2);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 146, 6) + s);
  };
  ART.pueblo = function (b) {
    var s = '', i;
    for (i = 0; i < 3; i++) { var x = 8 + i * 62, h = 70 + (i % 2) * 18; s += rect(x, 190 - h, 56, h, '#FFFFFF', '#C9C2B0', 2.4) + path('M' + (x - 4) + ' ' + (190 - h) + 'L' + (x + 28) + ' ' + (190 - h - 24) + 'L' + (x + 60) + ' ' + (190 - h) + 'Z', '#C8553A', '#7A2A14', 2.2) + path('M' + (x + 4) + ' ' + (190 - h - 4) + 'L' + (x + 28) + ' ' + (190 - h - 20), '', '#E8845A', 3) + rect(x + 8, 190 - h + 14, 14, 20, '#2B6BC8', '#16407A', 2) + rect(x + 34, 190 - h + 14, 14, 20, '#2B6BC8', '#16407A', 2) + rect(x + 20, 190 - 30, 16, 30, '#7A5A3A', '#3A2410', 2) + rect(x + 6, 190 - h + 36, 18, 4, '#3A2410', '', 0); for (var k = 0; k < 3; k++) s += circ(x + 10 + k * 18, 190 - h + 32, 4, ['#E5334B', '#FF7AB6', '#F2A32C'][k], '#7A2A14'); }
    s += path('M2 190H198', '', '#B8AE96', 5);
    return T(b.x * 100, b.y * 100, shadow(100, 194, 96, 5) + s);
  };
  big('sagrada', 'sagrada', 3, 3); big('pueblo', 'pueblo', 2, 2);
  ART.paellapan = function (b) {
    var s = shadow(50, 92, 40, 5) + ell(50, 70, 44, 18, '#3A3A44', '#1E1E26') + ell(50, 68, 38, 14, '#F2C94C', '#B8860B') + path('M6 70H0M94 70H100', '', '#3A3A44', 5), i;
    for (i = 0; i < 6; i++) s += ell(28 + (i * 9) % 44, 64 + (i * 5) % 8, 5, 3, ['#E5834B', '#E5334B', '#FFFFFF'][i % 3], '#8A4A12');
    for (i = 0; i < 5; i++) s += circ(26 + i * 12, 66 + (i % 2) * 6, 2.4, ['#2E9B4A', '#E5334B'][i % 2]) + path('M' + (22 + i * 14) + ' 60l6 8', '', '#C85A2E', 2);
    return T(b.x * 100, b.y * 100, s + path('M34 58L66 78M66 58L34 78', '', 'rgba(255,255,255,.35)', 1.4));
  };
  ART.flamencofan = function (b) {
    var s = shadow(50, 92, 30, 4), i, cols = ['#E5334B', '#FFFFFF', '#E5334B', '#FFFFFF', '#E5334B', '#FFFFFF', '#E5334B'];
    for (i = 0; i < 7; i++) s += '<g transform="translate(50 84) rotate(' + (-66 + i * 22) + ')">' + path('M0 0L-10 -64Q0 -70 10 -64Z', cols[i], '#7A1E10', 1.4) + '</g>';
    return T(b.x * 100, b.y * 100, s + path('M22 36Q50 18 78 36', '', '#222', 2.4) + circ(50, 84, 5, '#222') + path('M50 84V90', '', '#222', 3));
  };

  /* ═════════ NGA — Russia Culture Park ═════════ */
  THEME.russia = { g1: '#CFE4C4', g2: '#B2D0A2', ground: function (R, W, H2) { return scatter(R, W, H2, 34, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="2.6" fill="#FFFFFF" opacity="' + (i % 2 ? .85 : .6) + '"/>'; }); } };
  DTH.russia = { leaf: ['#5E9A5A', '#4A8A4A', '#7DB67A'], bush: ['#FFFFFF', '#4A8A4A'], rock: ['#9AA5B2', '#B8C2CE'], post: '#8A5A2E', rail: '#2B6BC8' };
  function onion(x, y, w, h, c1, c2) { return rect(x - w * .28, y, w * .56, h * .3, c2, '#3A3A44', 1.6) + path('M' + (x - w * .5) + ' ' + y + 'Q' + (x - w * .62) + ' ' + (y - h * .5) + ' ' + x + ' ' + (y - h) + 'Q' + (x + w * .62) + ' ' + (y - h * .5) + ' ' + (x + w * .5) + ' ' + y + 'Z', c1, '#3A3A44', 2) + path('M' + (x - w * .34) + ' ' + (y - 4) + 'Q' + x + ' ' + (y - h * .8) + ' ' + (x + w * .34) + ' ' + (y - 4), '', c2, 2.4) + path('M' + x + ' ' + (y - h) + 'v-12', '', '#C9A22A', 2.4) + path('M' + (x - 4) + ' ' + (y - h - 6) + 'h8', '', '#C9A22A', 2.2); }
  ART.stbasil = function (b) {
    var s = rect(30, 220, 240, 68, '#B8452E', '#6A2418', 2.6) + rect(20, 270, 260, 20, '#8A3A2A', '#6A2418', 2.2), i;
    for (i = 0; i < 8; i++) s += rect(36 + i * 29, 232, 14, 36, '#F2E0C0', '#6A2418', 1.6) + path('M' + (36 + i * 29) + ' 232Q' + (43 + i * 29) + ' 222 ' + (50 + i * 29) + ' 232', '#F2E0C0', '#6A2418', 1.6);
    s += rect(128, 100, 44, 124, '#C84A32', '#6A2418', 2.4) + poly('128,100 150,36 172,100', '#2E9B4A', '#16603E') + path('M150 36v-20', '', '#C9A22A', 3) + circ(150, 12, 5, '#F2C94C', '#B8860B');
    var doms = [[70, 190, '#2E9B4A'], [110, 170, '#2B6BC8'], [190, 170, '#E5334B'], [230, 190, '#F2C94C'], [90, 214, '#8E5FC4'], [210, 214, '#2E9B6A']];
    doms.forEach(function (d, k) { s += rect(d[0] - 13, d[1], 26, 44, k % 2 ? '#F2E0C0' : '#E8D0A8', '#6A2418', 2) + onion(d[0], d[1], 40, 46, d[2], '#F2C94C') + rect(d[0] - 5, d[1] + 16, 10, 16, '#3A2410', '', 0); });
    s += onion(150, 104, 52, 58, '#E5834B', '#F2C94C'); for (i = 0; i < 4; i++) s += path('M' + (126 + i * 16) + ' 100q0 -26 8 -42', '', 'rgba(255,255,255,.35)', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 146, 6) + s);
  };
  ART.izba = function (b) {
    var s = rect(14, 90, 172, 100, '#B8864A', '#6A4A22', 2.6) + poly('6,96 100,32 194,96', '#8A5A2E', '#4A2E14') + poly('20,96 100,42 180,96', '#A8703A', '#4A2E14'), i;
    for (i = 0; i < 10; i++) s += path('M14 ' + (100 + i * 9) + 'h172', '', 'rgba(60,40,10,.3)', 1.6);
    s += path('M100 32L100 18', '', '#4A2E14', 3) + circ(100, 14, 4, '#8A5A2E', '#4A2E14');
    [[34, 110], [138, 110]].forEach(function (w) { s += rect(w[0], w[1], 30, 36, '#6FB8E8', '#2B6BC8', 2.4) + rect(w[0] - 6, w[1] - 6, 42, 8, '#2B6BC8', '#16407A', 2) + path('M' + (w[0] + 15) + ' ' + w[1] + 'v36M' + w[0] + ' ' + (w[1] + 18) + 'h30', '', '#FFFFFF', 2) + path('M' + (w[0] - 6) + ' ' + (w[1] + 40) + 'q6 8 12 0q6 8 12 0q6 8 12 0q6 8 12 0', '', '#E5334B', 2.4); });
    s += rect(80, 130, 40, 60, '#6B3A18', '#3A2410', 2) + path('M76 130h48', '', '#2B6BC8', 5) + path('M78 126q22 -12 44 0', '', '#E5334B', 3) + rect(150, 70, 12, 24, '#8A8F9A', '#4A4A52', 2) + path('M156 66q-6 -10 2 -16', '', 'rgba(255,255,255,.7)', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 94, 6) + s);
  };
  big('stbasil', 'stbasil', 3, 3); big('izba', 'izba', 2, 2);
  ART.ruflag = flagPole('ru');
  ART.matryoshka = function (b) {
    var s = shadow(50, 92, 28, 4), i, cols = ['#E5334B', '#2B6BC8', '#2E9B4A'];
    [[28, 1], [50, 0], [72, 2]].forEach(function (q, k) { var h = k === 1 ? 1 : .78, x = q[0]; s += path('M' + (x - 14 * h) + ' 90Q' + (x - 20 * h) + ' ' + (60) + ' ' + (x - 12 * h) + ' ' + (46) + 'Q' + x + ' ' + (44 - 6 * h) + ' ' + (x + 12 * h) + ' 46Q' + (x + 20 * h) + ' 60 ' + (x + 14 * h) + ' 90Z', cols[q[1]], '#222', 1.8) + circ(x, 40 + (1 - h) * 14, 11 * h, '#FFE4C8', '#222') + path('M' + (x - 11 * h) + ' ' + (36 + (1 - h) * 14) + 'Q' + x + ' ' + (22 + (1 - h) * 14) + ' ' + (x + 11 * h) + ' ' + (36 + (1 - h) * 14), '#F2C94C', '#222', 1.6) + circ(x - 4 * h, 40 + (1 - h) * 14, 1.2, '#222') + circ(x + 4 * h, 40 + (1 - h) * 14, 1.2, '#222') + circ(x, 66, 6 * h, '#FFE4C8', '#222') + circ(x - 8 * h, 78, 2.4, '#F2C94C') + circ(x + 8 * h, 78, 2.4, '#F2C94C') + circ(x, 54, 2.4, '#F2C94C'); });
    return T(b.x * 100, b.y * 100, s);
  };

  /* ═════════ AI-LEN — Ireland Culture Park ═════════ */
  THEME.ireland = { g1: '#8FD16A', g2: '#6BBA48', ground: function (R, W, H2) { return scatter(R, W, H2, 40, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'm0 -4a3 3 0 1 1 0 6a3 3 0 1 1 -3 -3a3 3 0 1 1 6 0z" fill="#3E9B3A" opacity=".5"/>'; }); } };
  DTH.ireland = { leaf: ['#3E9B3A', '#2E8A2E', '#66C25A'], bush: ['#FFFFFF', '#3E9B3A'], rock: ['#9AA5A0', '#B8C2BE'], post: '#8A5A2E', rail: '#169B62' };
  ART.moher = function (b) {
    var s = path('M0 130Q150 100 300 130V300H0Z', '#4FB4D8', '#1F7A9A', 2.4) + path('M10 200q40 -10 80 0t80 0t80 0t60 0', '', 'rgba(255,255,255,.55)', 3);
    s += cloud(70, 36, 1) + cloud(230, 60, 1.2);
    s += path('M0 290V110Q40 90 90 100Q140 80 190 96Q250 84 300 110V290Z', '#8A8478', '#4A4638', 2.6) + path('M20 140H280M10 176H290M24 212H276M14 248H286', '', 'rgba(60,50,30,.35)', 2.4);
    s += path('M0 110Q40 90 90 100Q140 80 190 96Q250 84 300 110V132Q250 114 190 124Q140 112 90 128Q40 120 0 134Z', '#5BBF4A', '#2E7A2A', 2.2) + path('M0 290V260Q100 250 300 266V290Z', '#6B6458', '', 0);
    s += rect(224, 62, 16, 40, '#FFFFFF', '#8A8F9A', 2) + poly('220,62 232,44 244,62', '#C1272D', '#7A1E10') + rect(228, 74, 8, 8, '#2B6BC8', '#16407A', 1.4) + circ(232, 42, 3, '#F2C94C');
    for (var i = 0; i < 5; i++) s += path('M' + (30 + i * 46) + ' 100q-4 -10 0 -18q6 6 0 18', '', '#FFFFFF', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 144, 6) + s);
  };
  ART.irishcottage = function (b) {
    var s = rect(14, 100, 172, 88, '#FFFFFF', '#B8B2A0', 2.6) + path('M4 106Q100 20 196 106Q192 120 180 110Q100 48 20 110Q8 120 4 106Z', '#C9A25A', '#7A5A22', 2.6), i;
    for (i = 0; i < 12; i++) s += path('M' + (16 + i * 14) + ' ' + (96 - Math.abs(i - 6) * 7) + 'l-4 14', '', 'rgba(120,80,20,.4)', 1.6);
    s += rect(80, 132, 40, 56, '#2E9B4A', '#16603E', 2) + circ(112, 160, 2.4, '#F2C94C') + rect(28, 120, 34, 30, '#6FB8E8', '#2B6BC8', 2.4) + rect(138, 120, 34, 30, '#6FB8E8', '#2B6BC8', 2.4) + path('M45 120v30M28 135h34M155 120v30M138 135h34', '', '#FFFFFF', 2) + rect(150, 54, 14, 30, '#9A9484', '#4A4638', 2);
    s += path('M26 188q2 -14 8 -20M40 188q0 -10 6 -16', '', '#3E9B3A', 3) + circ(32, 164, 4, '#FF7AB6') + circ(46, 168, 4, '#F2C94C') + path('M10 190H190', '', '#6BBA48', 6);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 94, 6) + s);
  };
  big('moher', 'moher', 3, 3); big('irishcottage', 'irishcottage', 2, 2);
  ART.ieflag = flagPole('ie');
  ART.celticharp = function (b) {
    var s = shadow(50, 92, 28, 4) + path('M22 84V30Q22 8 46 10Q40 24 46 40L80 84Z', '#C9A25A', '#7A5A22', 2.6) + path('M26 80H78', '', '#7A5A22', 4) + path('M22 30Q22 14 40 12', '', '#E8C268', 3), i;
    for (i = 0; i < 7; i++) s += path('M' + (46 - i * 3) + ' ' + (22 + i * 6) + 'L' + (30 + i * 7) + ' ' + (80 - i * 0.5), '', '#F4EFE0', 1.4);
    s += circ(34, 26, 3, '#169B62') + circ(30, 46, 3, '#169B62') + circ(28, 66, 3, '#169B62');
    return T(b.x * 100, b.y * 100, s);
  };

  /* ═════════ NA UY — Norway Culture Park ═════════ */
  THEME.norway = { g1: '#C4DEB8', g2: '#A6C89C', ground: function (R, W, H2) { return scatter(R, W, H2, 30, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + ['#FFFFFF', '#B66CFF', '#FFD23F'][i % 3] + '" opacity=".75"/>'; }); } };
  DTH.norway = { leaf: ['#3F7A4A', '#2F663A', '#5E9A66'], bush: ['#B66CFF', '#3F7A4A'], rock: ['#9AA5B2', '#B8C2CE'], post: '#6B3A18', rail: '#BA0C2F' };
  ART.stavechurch = function (b) {
    var s = '', i;
    s += rect(40, 210, 220, 78, '#3A2A1A', '#1E140A', 2.6) + rect(30, 270, 240, 20, '#2A1E12', '#1E140A', 2);
    for (i = 0; i < 4; i++) { var w = 230 - i * 44, y = 214 - i * 44; s += poly((150 - w / 2) + ',' + y + ' 150,' + (y - 52) + ' ' + (150 + w / 2) + ',' + y, i % 2 ? '#4A3622' : '#3A2A1A', '#1E140A') + path('M' + (150 - w / 2 + 14) + ' ' + (y - 6) + 'L150 ' + (y - 44) + 'L' + (150 + w / 2 - 14) + ' ' + (y - 6), '', 'rgba(255,255,255,.12)', 2); for (var k = 0; k < Math.floor(w / 22); k++) s += path('M' + (150 - w / 2 + 12 + k * 22) + ' ' + (y - 2) + 'l6 -8l6 8', '', 'rgba(255,255,255,.14)', 1.6); }
    s += rect(136, 18, 28, 60, '#3A2A1A', '#1E140A', 2.2) + poly('130,22 150,-6 170,22', '#2A1E12', '#1E140A') + path('M150 -6v-14', '', '#C9A22A', 3);
    s += path('M118 288V250Q118 232 150 232Q182 232 182 250V288Z', '#1E140A', '#000', 2) + path('M40 214l-14 -22M260 214l14 -22', '', '#4A3622', 5) + circ(24, 188, 5, '#C9A22A') + circ(276, 188, 5, '#C9A22A') + path('M70 240q10 -10 20 0M210 240q10 -10 20 0', '', '#C9A22A', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 146, 6) + s);
  };
  ART.rorbu = function (b) {
    var s = path('M0 150H200V196H0Z', '#4FB4D8', '#1F7A9A', 2) + path('M10 166q30 -8 60 0t60 0t60 0', '', 'rgba(255,255,255,.55)', 3), i;
    for (i = 0; i < 3; i++) { var x = 6 + i * 64; s += path('M' + (x + 6) + ' 164V120M' + (x + 28) + ' 164V120M' + (x + 48) + ' 164V120', '', '#6B4A2B', 4) + rect(x, 70 + (i % 2) * 8, 54, 56, '#B83A2E', '#6A1E14', 2.4) + poly((x - 4) + ',' + (72 + (i % 2) * 8) + ' ' + (x + 27) + ',' + (46 + (i % 2) * 8) + ' ' + (x + 58) + ',' + (72 + (i % 2) * 8), '#5A4A3A', '#2A2018') + rect(x + 8, 88 + (i % 2) * 8, 14, 16, '#FFF6D8', '#FFFFFF', 2.4) + rect(x + 32, 88 + (i % 2) * 8, 14, 16, '#FFF6D8', '#FFFFFF', 2.4) + rect(x + 18, 108 + (i % 2) * 8, 18, 18, '#4A2A12', '#FFFFFF', 1.6) + path('M' + (x - 2) + ' 126h58', '', '#6B4A2B', 3); }
    s += path('M150 188Q166 176 190 178L186 190Z', '#2B6BC8', '#16407A', 2) + path('M170 176V150L184 176', '#FFFFFF', '#888', 1.4);
    return T(b.x * 100, b.y * 100, shadow(100, 196, 94, 4) + s);
  };
  big('stavechurch', 'stavechurch', 3, 3); big('rorbu', 'rorbu', 2, 2);
  ART.noflag = flagPole('no');
  ART.vikingship = function (b) {
    var s = shadow(50, 92, 40, 4) + path('M8 74Q8 60 14 52Q10 66 24 74Q50 84 76 74Q90 66 86 52Q92 60 92 74Q70 88 50 88Q28 88 8 74Z', '#8A5A2E', '#4A2E14', 2.2) + path('M14 52q-2 -10 4 -16q0 8 -2 16', '', '#8A5A2E', 3) + circ(16, 34, 3.4, '#C9A22A') + rect(48, 20, 4, 54, '#6B4A2B', '#3A2410', 1.4) + path('M52 24L82 36L52 62Z', '#E5334B', '#7A1E10', 1.8) + path('M52 30L74 38M52 40L70 44M52 50L62 52', '', '#FFFFFF', 1.6), i;
    for (i = 0; i < 5; i++) s += circ(26 + i * 12, 74, 4.6, i % 2 ? '#F2C94C' : '#2B6BC8', '#222');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.troll = function (b) {
    var s = shadow(50, 92, 28, 4) + path('M22 90Q14 62 32 48Q36 30 50 28Q64 30 68 48Q86 62 78 90Z', '#6A8A4A', '#3A5A2A', 2.4) + path('M34 46Q50 40 66 46', '', '#4A6A32', 3) + circ(40, 52, 4.4, '#FFF6A0', '#3A5A2A') + circ(58, 52, 4.4, '#FFF6A0', '#3A5A2A') + circ(40, 52, 1.8, '#222') + circ(58, 52, 1.8, '#222') + path('M46 60Q50 70 54 60Z', '#8A6A4A', '#3A2A12', 1.4) + path('M38 70Q50 80 62 70', '', '#3A2A12', 2.4) + path('M42 71l2 5l3 -4M56 71l-2 5l-3 -4', '#FFFFFF', '#3A2A12', 1) + path('M34 36l-6 -14l12 8ZM66 36l6 -14l-12 8Z', '#6A8A4A', '#3A5A2A', 1.8) + path('M30 80q-6 4 -4 10M70 80q6 4 4 10', '', '#4A6A32', 4);
    return T(b.x * 100, b.y * 100, s + path('M28 92h44', '', '#5A5A62', 5));
  };
})(typeof window !== 'undefined' ? window : this);
