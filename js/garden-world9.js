/* EWT Garden — 12 khu văn hoá quốc gia mới (phần 3: CHÂU MỸ — Peru, Argentina, Cuba, Chile). Nạp SAU garden-world8.js.
   Cuba và Chile dùng cờ chuẩn (garden-flags.js). Peru và Argentina KHÔNG vẽ quốc kỳ (có quốc huy / Mặt Trời Tháng Năm phức tạp, chưa đủ chắc thông số). */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H, big = API.bigOf;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;
  function cloud(x, y, s) { return '<g opacity=".9">' + ell(x, y, 26 * s, 9 * s, '#FFFFFF') + ell(x - 14 * s, y + 3 * s, 16 * s, 7 * s, '#FFFFFF') + ell(x + 16 * s, y + 2 * s, 18 * s, 7 * s, '#FFFFFF') + '</g>'; }

  /* ═════════ PERU — Peru Culture Park ═════════ */
  THEME.peru = { g1: '#B9CC7A', g2: '#9CB45C', ground: function (R, W, H2) { return scatter(R, W, H2, 32, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q4 -8 8 0q-4 -3 -8 0" fill="' + ['#C8553A', '#F2C94C', '#8E5FC4'][i % 3] + '" opacity=".6"/>'; }); } };
  DTH.peru = { leaf: ['#6B8E3A', '#557A2E', '#8BA85A'], bush: ['#C8553A', '#6B8E3A'], rock: ['#A89A88', '#C2B6A4'], post: '#8A5A2E', rail: '#C8553A' };
  ART.machupicchu = function (b) {
    var s = '', i, k;
    s += cloud(60, 40, 1.1) + cloud(240, 56, 1.3);
    s += path('M70 292L110 150Q124 70 150 44Q178 70 196 150L250 292Z', '#4F7A3A', '#2F5A28', 2.6) + path('M140 80Q150 60 160 80M120 130Q150 100 182 130', '', 'rgba(255,255,255,.25)', 5) + path('M110 160q20 -14 36 0M160 190q20 -14 40 0', '', '#3A6A2E', 4);
    s += path('M0 292V200Q70 170 150 196Q230 170 300 200V292Z', '#6FA043', '#3E6E2A', 2.4);
    for (k = 0; k < 5; k++) { var y = 292 - k * 22; s += path('M' + (14 + k * 14) + ' ' + y + 'Q150 ' + (y - 24) + ' ' + (286 - k * 14) + ' ' + y + 'V' + (y + 8) + 'H' + (14 + k * 14) + 'Z', k % 2 ? '#8CB85A' : '#7DAA4A', '#B8AE96', 2.2) + path('M' + (14 + k * 14) + ' ' + (y + 6) + 'Q150 ' + (y - 18) + ' ' + (286 - k * 14) + ' ' + (y + 6), '', '#C9C2A8', 4); }
    for (i = 0; i < 6; i++) { var x = 70 + i * 32, y2 = 250 - (i % 3) * 22; s += rect(x, y2, 24, 20, '#CFC8B0', '#8A8470', 2) + path('M' + (x - 3) + ' ' + y2 + 'L' + (x + 12) + ' ' + (y2 - 14) + 'L' + (x + 27) + ' ' + y2 + 'Z', '#D9B96A', '#8A6A2A', 2) + rect(x + 8, y2 + 8, 8, 12, '#4A4538', '', 0); }
    s += circ(150, 120, 3, '#fff') + path('M60 290l8 -14l8 14M230 290l8 -14l8 14', '', '#3A6A2E', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 144, 6) + s);
  };
  ART.andeanhouse = function (b) {
    var s = '', i;
    s += rect(14, 100, 172, 88, '#C9A878', '#8A6A3A', 2.4) + path('M6 104L100 30L194 104L186 112L100 52L14 112Z', '#E0C070', '#8A6A2A', 2.6) + path('M30 100L100 44L170 100', '', '#B8964A', 3);
    for (i = 0; i < 8; i++) s += path('M' + (24 + i * 20) + ' 108l-6 12M' + (30 + i * 18) + ' 90l-4 8', '', 'rgba(120,80,20,.35)', 1.6);
    s += rect(78, 130, 40, 58, '#5A3A1E', '#3A2410', 2) + rect(36, 124, 26, 22, '#3A2A12', '#8A6A3A', 2) + rect(140, 124, 26, 22, '#3A2A12', '#8A6A3A', 2) + path('M10 190H190', '', '#6B8E3A', 6);
    s += path('M130 160V120', '', '#8A5A2E', 3) + path('M146 160V120', '', '#8A5A2E', 3) + rect(130, 122, 16, 30, '#C8553A', '#7A2A14', 1.6) + path('M130 130h16M130 138h16M130 146h16', '', '#F2C94C', 2);
    s += ell(164, 168, 14, 9, '#F4E8D0', '#B8A88A') + path('M174 164Q180 144 176 132', '', '#F4E8D0', 7) + circ(176, 130, 6, '#F4E8D0', '#B8A88A') + path('M172 126l-2 -8M180 126l2 -8', '', '#F4E8D0', 3) + circ(178, 129, 1.3, '#222') + path('M158 176v10M170 176v10', '', '#B8A88A', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 94, 6) + s);
  };
  big('machupicchu', 'machupicchu', 3, 3); big('andeanhouse', 'andeanhouse', 2, 2);
  ART.panflute = function (b) {
    var s = shadow(50, 92, 36, 4), i, n = 7;
    for (i = 0; i < n; i++) { var h = 54 - i * 6.4; s += rect(14 + i * 10.4, 30 + (54 - h), 9, h + 8, i % 2 ? '#C98A4B' : '#B8734A', '#6B3A18', 1.8) + ell(18.5 + i * 10.4, 30 + (54 - h), 4.5, 2, '#3A2410'); }
    return T(b.x * 100, b.y * 100, s + rect(12, 56, 78, 5, '#E5334B', '#7A1E10', 1.4) + rect(12, 72, 78, 4, '#2B6BC8', '#16407A', 1.4) + path('M50 76v10', '', '#F2C94C', 2) + circ(50, 88, 3, '#F2C94C'));
  };
  ART.quipu = function (b) {
    var s = shadow(50, 92, 34, 4) + path('M10 24H90', '', '#8A5A2E', 5) + circ(10, 24, 4, '#6B3A18') + circ(90, 24, 4, '#6B3A18'), i, c = ['#E5334B', '#F2C94C', '#2B6BC8', '#FFFFFF', '#2E9B6A', '#F2A32C', '#8E5FC4'];
    for (i = 0; i < 9; i++) { var x = 18 + i * 8.6, l = 30 + (i * 17) % 34; s += path('M' + x + ' 24V' + (24 + l), '', c[i % 7], 2.6) + circ(x, 24 + l * .35, 2.2, c[(i + 2) % 7], '#333') + circ(x, 24 + l * .7, 2.2, c[(i + 3) % 7], '#333'); }
    return T(b.x * 100, b.y * 100, s);
  };

  /* ═════════ ARGENTINA — Argentina Culture Park ═════════ */
  THEME.argentina = { g1: '#A8D878', g2: '#86BE58', ground: function (R, W, H2) { return scatter(R, W, H2, 40, function (x, y) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q-3 -10 0 -16M' + f0(x + 5) + ' ' + f0(y) + 'q-1 -12 3 -18" fill="none" stroke="#E8D8A0" stroke-width="2" opacity=".7"/>'; }); } };
  DTH.argentina = { leaf: ['#5E9A4A', '#4A8A3C', '#7DB663'], bush: ['#FFFFFF', '#4A8A3C'], rock: ['#9AA5B2', '#B8C2CE'], post: '#8A5A2E', rail: '#6FB8E8' };
  ART.perito = function (b) {
    var s = '', i;
    s += path('M0 150L50 70L90 110L140 50L200 100L250 60L300 130V200H0Z', '#8FA3B8', '#5A6E84', 2.4) + path('M50 70L66 92L40 100ZM140 50L158 76L128 80ZM250 60L266 84L240 92Z', '#FFFFFF');
    s += path('M0 190L40 150L70 176L110 140L150 182L196 134L240 176L280 148L300 170V250H0Z', '#EAF6FF', '#8FC4E4', 2.6) + path('M40 150V250M70 176V250M110 140V250M150 182V250M196 134V250M240 176V250M280 148V250', '', '#BFE4F8', 3);
    s += path('M0 250H300V292H0Z', '#4FB4D8', '#1F7A9A', 2.4) + path('M10 262q40 -8 80 0t80 0t80 0M10 278q40 -8 80 0t80 0t80 0', '', 'rgba(255,255,255,.55)', 3);
    for (i = 0; i < 5; i++) s += path('M' + (30 + i * 56) + ' 232l8 8l-4 6z', '#FFFFFF', '#8FC4E4', 1.4) + ell(40 + i * 56, 268 + (i % 2) * 8, 10, 3.6, '#EAF6FF', '#8FC4E4');
    s += cloud(80, 28, 1) + cloud(220, 22, .9);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 144, 6) + s);
  };
  ART.laboca = function (b) {
    var s = '', i, cols = [['#2B6BC8', '#F2C94C'], ['#E5334B', '#2E9B6A'], ['#F2C94C', '#2B6BC8'], ['#2E9B6A', '#E5334B']];
    for (i = 0; i < 4; i++) { var x = 6 + i * 47, h = 90 + (i % 2) * 20, c = cols[i]; s += rect(x, 188 - h, 44, h, c[0], '#222', 2) + path('M' + (x - 2) + ' ' + (188 - h) + 'L' + (x + 22) + ' ' + (188 - h - 16) + 'L' + (x + 46) + ' ' + (188 - h) + 'Z', c[1], '#222', 2) + path('M' + (x + 4) + ' ' + (188 - h + 10) + 'h36M' + (x + 4) + ' ' + (188 - h + 20) + 'h36', '', 'rgba(0,0,0,.18)', 1.4) + rect(x + 8, 188 - h + 28, 12, 18, '#FFF6D8', '#222', 1.6) + rect(x + 26, 188 - h + 28, 12, 18, '#FFF6D8', '#222', 1.6) + rect(x + 6, 188 - h + 46, 32, 4, '#222', '', 0) + path('M' + (x + 8) + ' ' + (188 - h + 46) + 'v6M' + (x + 36) + ' ' + (188 - h + 46) + 'v6', '', '#222', 1.6) + rect(x + 16, 188 - 26, 14, 26, c[1], '#222', 1.6); }
    return T(b.x * 100, b.y * 100, shadow(100, 192, 94, 5) + s + path('M2 190H198', '', '#8A8F9A', 4));
  };
  big('perito', 'perito', 3, 3); big('laboca', 'laboca', 2, 2);
  ART.mategourd = function (b) {
    var s = shadow(50, 92, 30, 4) + path('M24 46Q22 86 50 88Q78 86 76 46Z', '#8A5A2E', '#4A2E14', 2.4) + ell(50, 46, 26, 7, '#6B8E3A', '#3A5A1E') + ell(50, 45, 20, 4.4, '#8FB04A') + path('M24 60Q50 70 76 60', '', '#C9A25A', 3) + path('M24 72Q50 82 76 72', '', '#C9A25A', 3) + path('M56 50L78 14', '', '#C9C9D2', 4) + path('M74 14h10', '', '#C9C9D2', 5) + circ(48, 44, 2, '#B8D060');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.bandoneon = function (b) {
    var s = shadow(50, 92, 34, 4) + rect(8, 30, 20, 48, '#2A2A34', '#000', 2.4) + rect(72, 30, 20, 48, '#2A2A34', '#000', 2.4) + path('M28 34H72V74H28Z', '#8A1E2A', '#4A0E16', 2), i;
    for (i = 0; i < 9; i++) s += path('M' + (31 + i * 4.6) + ' 34V74', '', i % 2 ? '#5A0E18' : '#C0394B', 2.4);
    for (i = 0; i < 4; i++) s += circ(18, 40 + i * 10, 3.2, '#E8E8F0', '#999') + circ(82, 40 + i * 10, 3.2, '#E8E8F0', '#999');
    return T(b.x * 100, b.y * 100, s + rect(10, 32, 16, 3, '#C9A25A', '', 0) + rect(74, 32, 16, 3, '#C9A25A', '', 0));
  };

  /* ═════════ CUBA — Cuba Culture Park ═════════ */
  THEME.cuba = { g1: '#A8DE82', g2: '#7CC95E', ground: function (R, W, H2) { return scatter(R, W, H2, 34, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3.4" fill="' + ['#FFD23F', '#FF7AB6', '#FFFFFF'][i % 3] + '" opacity=".8"/>'; }); } };
  DTH.cuba = { leaf: ['#2E9B4A', '#1F7F3A', '#5ACB6A'], bush: ['#FF5C7A', '#2E9B4A'], rock: ['#D9CBA0', '#EBDFB8'], post: '#8A5A2E', rail: '#2B9BD8' };
  ART.capitolio = function (b) {
    var s = '', i;
    s += rect(20, 210, 260, 78, '#F2EEE0', '#A8A290', 2.6) + rect(8, 270, 284, 20, '#D8D2BE', '#A8A290', 2.4);
    for (i = 0; i < 14; i++) s += rect(32 + i * 17.4, 218, 8, 50, '#FFFFFF', '#B8B2A0', 1.6);
    s += poly('20,210 150,176 280,210', '#E8E2D0', '#A8A290') + rect(90, 160, 120, 52, '#F2EEE0', '#A8A290', 2.4);
    for (i = 0; i < 6; i++) s += rect(98 + i * 18.6, 170, 8, 40, '#FFFFFF', '#B8B2A0', 1.6);
    s += rect(100, 140, 100, 22, '#EDE8D8', '#A8A290', 2.2) + path('M104 140Q104 96 150 90Q196 96 196 140Z', '#F8F4E6', '#A8A290', 2.4) + path('M118 134Q118 106 150 100Q182 106 182 134', '', '#D8D2BE', 2.4) + path('M150 90V50', '', '#A8A290', 3) + rect(134, 108, 32, 8, '#D8D2BE', '#A8A290', 1.4);
    s += path('M126 100Q150 40 174 100Z', '#E8E2D0', '#A8A290', 2.2) + path('M150 52V20', '', '#C9A22A', 3) + circ(150, 18, 5, '#F2C94C', '#B8860B') + path('M100 160h100', '', '#A8A290', 2);
    for (i = 0; i < 10; i++) s += path('M' + (24 + i * 28) + ' 292l2 -10', '', '#2E9B4A', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 146, 6) + s + path('M70 288H230', '', '#C9C2A8', 6));
  };
  ART.vintagecar = function (b) {
    var s = shadow(100, 188, 90, 5) + path('M16 140Q14 112 40 108L62 80Q70 72 92 72H132Q150 72 160 86L176 110Q192 114 190 140V150H16Z', '#F2A0C0', '#9A4A6A', 3) + path('M64 106L76 82H132Q144 84 152 106Z', '#BFE8FF', '#5A8AAA', 2.4) + path('M104 82V106', '', '#9A4A6A', 2.4) + path('M16 126H188', '', '#FFFFFF', 4) + path('M184 112L196 94L190 126Z', '#F2A0C0', '#9A4A6A', 2.4) + path('M18 138H186V150H18Z', '#E8E8F0', '#8A8A94', 2) + circ(30, 128, 5, '#FFF6A0', '#C9A22A') + circ(176, 128, 5, '#FFF6A0', '#C9A22A') + path('M56 150h82', '', '#C9C9D2', 3);
    s += circ(52, 152, 20, '#222', '#000') + circ(52, 152, 14, '#FFFFFF', '#BBB') + circ(52, 152, 6, '#C9C9D2', '#888') + circ(150, 152, 20, '#222', '#000') + circ(150, 152, 14, '#FFFFFF', '#BBB') + circ(150, 152, 6, '#C9C9D2', '#888');
    return T(b.x * 100, b.y * 100, s + path('M70 96h24', '', 'rgba(255,255,255,.7)', 3));
  };
  big('capitolio', 'capitolio', 3, 3); big('vintagecar', 'vintagecar', 2, 2);
  ART.cuflag = flagPole('cu');
  ART.congadrum = function (b) {
    var s = shadow(50, 92, 22, 4) + ell(50, 24, 20, 6, '#F2E0B0', '#8A5A2E') + path('M30 24Q22 56 32 84H68Q78 56 70 24Z', '#E5834B', '#7A3A12', 2.4) + path('M28 38Q50 46 72 38M26 52Q50 60 74 52M28 66Q50 74 72 66', '', '#FFD23F', 3) + path('M32 84H68', '', '#6B4A2B', 4) + ell(50, 24, 20, 6, 'rgba(255,255,255,.35)') + path('M32 32V80M50 34V84M68 32V80', '', 'rgba(0,0,0,.12)', 1.4);
    return T(b.x * 100, b.y * 100, s + ell(50, 88, 22, 3.4, '#3A2A12'));
  };

  /* ═════════ CHILE — Chile Culture Park ═════════ */
  THEME.chile = { g1: '#BCCB8C', g2: '#9CB46C', ground: function (R, W, H2) { return scatter(R, W, H2, 30, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + ['#E5334B', '#FFFFFF', '#E8C84A'][i % 3] + '" opacity=".7"/>'; }); } };
  DTH.chile = { leaf: ['#5E8A4A', '#4A763C', '#7DAA63'], bush: ['#E5334B', '#4A763C'], rock: ['#9A8E80', '#B8AC9C'], post: '#8A5A2E', rail: '#2B6BC8' };
  function moai(x, y, s, top) {
    var h = 130 * s, w = 40 * s;
    return path('M' + (x - w * .5) + ' ' + y + 'L' + (x - w * .46) + ' ' + (y - h * .62) + 'Q' + (x - w * .6) + ' ' + (y - h * .8) + ' ' + (x - w * .42) + ' ' + (y - h * .92) + 'Q' + x + ' ' + (y - h * 1.02) + ' ' + (x + w * .42) + ' ' + (y - h * .92) + 'Q' + (x + w * .6) + ' ' + (y - h * .8) + ' ' + (x + w * .46) + ' ' + (y - h * .62) + 'L' + (x + w * .5) + ' ' + y + 'Z', '#7A6E5E', '#4A4034', 2.4)
      + path('M' + (x - w * .4) + ' ' + (y - h * .74) + 'Q' + x + ' ' + (y - h * .8) + ' ' + (x + w * .4) + ' ' + (y - h * .74), '', '#5A5042', 4 * s)
      + path('M' + x + ' ' + (y - h * .78) + 'L' + (x - 3 * s) + ' ' + (y - h * .52) + 'H' + (x + 3 * s) + 'Z', '#8A7E6E', '#4A4034', 1.6)
      + rect(x - w * .28, y - h * .46, w * .56, h * .06, '#5A5042', '', 0) + path('M' + (x - w * .3) + ' ' + (y - h * .32) + 'H' + (x + w * .3), '', '#5A5042', 3 * s)
      + ell(x - w * .2, y - h * .72, 4 * s, 3 * s, '#2A241C') + ell(x + w * .2, y - h * .72, 4 * s, 3 * s, '#2A241C')
      + (top ? rect(x - w * .3, y - h * 1.12, w * .6, h * .14, '#B8452E', '#6A2418', 2) : '');
  }
  ART.moai = function (b) {
    var s = cloud(70, 36, 1) + cloud(230, 50, 1.2) + path('M0 232Q150 214 300 232V292H0Z', '#8FB45A', '#4E7A2E', 2.4) + path('M10 254H290V288H10Z', '#8A7E6E', '#4A4034', 2.6) + path('M10 262H290M10 272H290', '', '#6A5E4E', 2);
    s += moai(60, 256, 1.0, false) + moai(150, 256, 1.26, true) + moai(240, 256, 1.0, false) + path('M20 290q20 -10 40 0M250 290q16 -8 34 0', '', '#4E7A2E', 4);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 144, 6) + s);
  };
  ART.palafito = function (b) {
    var s = path('M0 158H200V196H0Z', '#4FB4D8', '#1F7A9A', 2) + path('M8 170q30 -8 60 0t60 0t64 0', '', 'rgba(255,255,255,.55)', 3), i, cols = ['#E5334B', '#2B9BD8', '#F2C94C'];
    for (i = 0; i < 3; i++) { var x = 8 + i * 62, c = cols[i]; s += path('M' + (x + 6) + ' 160V120M' + (x + 36) + ' 160V120M' + (x + 21) + ' 160V120', '', '#6B4A2B', 4) + rect(x, 70 + (i % 2) * 10, 48, 54 - (i % 2) * 10, c, '#222', 2) + path('M' + (x - 4) + ' ' + (72 + (i % 2) * 10) + 'L' + (x + 24) + ' ' + (44 + (i % 2) * 10) + 'L' + (x + 52) + ' ' + (72 + (i % 2) * 10) + 'Z', '#7A5A3A', '#3A2A12', 2) + path('M' + x + ' ' + (82 + (i % 2) * 10) + 'h48M' + x + ' ' + (92 + (i % 2) * 10) + 'h48M' + x + ' ' + (102 + (i % 2) * 10) + 'h48', '', 'rgba(0,0,0,.2)', 1.2) + rect(x + 8, 88 + (i % 2) * 10, 12, 14, '#FFF6D8', '#222', 1.4) + rect(x + 28, 90 + (i % 2) * 10, 12, 30 - (i % 2) * 10, '#4A2A12', '#222', 1.4); }
    s += path('M120 188L132 176H178L190 188Z', '#E5834B', '#7A3A12', 2) + path('M154 176V150L174 176', '#FFFFFF', '#888', 1.4);
    return T(b.x * 100, b.y * 100, shadow(100, 196, 94, 4) + s);
  };
  big('moai', 'moai', 3, 3); big('palafito', 'palafito', 2, 2);
  ART.clflag = flagPole('cl');
  ART.copihue = function (b) {
    var s = shadow(50, 92, 32, 4) + path('M16 86Q40 60 30 30Q56 56 84 40', '', '#4A8A3C', 4), i;
    for (i = 0; i < 4; i++) s += path('M' + (20 + i * 18) + ' 88q-3 -16 4 -20q8 4 4 20z', '#3E9B4F', '#16603E', 1.6);
    [[34, 44], [60, 54], [74, 40], [46, 70]].forEach(function (q) { s += path('M' + q[0] + ' ' + q[1] + 'q-12 6 -10 22q10 -4 16 -8q4 -8 -6 -14z', '#D61F3A', '#7A0E1E', 1.8) + path('M' + (q[0] - 2) + ' ' + (q[1] + 4) + 'l-6 16', '', '#FF8FA8', 1.4); });
    return T(b.x * 100, b.y * 100, s);
  };
})(typeof window !== 'undefined' ? window : this);
