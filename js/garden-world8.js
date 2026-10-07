/* EWT Garden — 8 khu văn hoá quốc gia mới (phần 2: Mexico, Brazil, Ai Cập, Ma-rốc). Nạp SAU garden-world7.js.
   Mexico, Brazil và Ai Cập KHÔNG vẽ quốc kỳ (huy hiệu/khẩu hiệu quá phức tạp, chưa đủ chắc thông số) — thay bằng vật phẩm văn hoá. Ma-rốc dùng cờ chuẩn. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H, big = API.bigOf;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;

  /* ═════════ MEXICO ═════════ */
  THEME.mexico = { g1: '#E2D49A', g2: '#CDBA78', noGrass: 1, ground: function (R, W, H2) { return scatter(R, W, H2, 34, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'l5 -10l5 10z" fill="' + ['#E5334B', '#2E9B6A', '#F2A32C', '#FF7AB6'][i % 4] + '" opacity=".5"/>'; }); } };
  DTH.mexico = { leaf: ['#5E9A4A', '#4A8A3C', '#7DB663'], bush: ['#E5334B', '#4A8A3C'], rock: ['#C9B48A', '#E0CCA0'], post: '#8A5A2E', rail: '#2E9B6A' };
  ART.chichen = function (b) {
    var s = '', i, k;
    for (k = 0; k < 5; k++) { var w = 250 - k * 38, y = 280 - k * 40; s += rect(150 - w / 2, y - 40, w, 40, k % 2 ? '#D9C99E' : '#CFBE90', '#8A7A52', 2.4) + path('M' + (150 - w / 2 + 6) + ' ' + (y - 14) + 'H' + (150 + w / 2 - 6), '', 'rgba(110,90,50,.35)', 2); for (i = 0; i < Math.floor(w / 18); i++) s += rect(150 - w / 2 + 6 + i * 18, y - 30, 10, 8, 'rgba(110,90,50,.25)', '', 1); }
    s += poly('130,290 170,290 164,120 136,120', '#E6D9B2', '#8A7A52') + path('M140 270h20M140 240h20M140 210h20M140 180h20M140 150h20', '', '#A89A72', 1.6);
    s += rect(112, 80, 76, 42, '#CFBE90', '#8A7A52', 2.4) + rect(132, 94, 36, 28, '#5A4A2A', '#3A2A12', 2) + path('M118 86h64', '', 'rgba(110,90,50,.5)', 2) + rect(106, 74, 88, 8, '#D9C99E', '#8A7A52', 2);
    for (i = 0; i < 4; i++) s += rect(120 + i * 18, 62 + (i % 2) * 2, 10, 14, '#E6D9B2', '#8A7A52', 1.6);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
  };
  ART.hacienda = function (b) {
    var s = '', i;
    s += rect(12, 90, 176, 100, '#F2C46A', '#A87A22', 2.4) + rect(12, 90, 176, 12, '#E0522F', '#8A2A12', 2) + path('M4 92Q100 56 196 92L188 100Q100 70 12 100Z', '#C8553A', '#7A2A14', 2.4);
    for (i = 0; i < 4; i++) s += path('M' + (24 + i * 40) + ' 190V132Q' + (24 + i * 40 + 14) + ' 112 ' + (24 + i * 40 + 28) + ' 132V190Z', '#7A2E22', '#3A1208', 2) + rect(24 + i * 40, 130, 28, 4, '#F2E0A8', '', 0);
    for (i = 0; i < 10; i++) s += rect(18 + i * 17.4, 104, 8, 8, i % 2 ? '#2E9B6A' : '#2B6BC8', '', 1);
    s += rect(76, 56, 48, 34, '#F2C46A', '#A87A22', 2) + path('M80 90V72Q100 56 120 72V90Z', '#3A1208', '#A87A22', 2) + path('M88 56L100 44L112 56Z', '#C8553A', '#7A2A14', 2) + circ(100, 66, 4, '#F2C94C');
    for (i = 0; i < 3; i++) s += rect(18 + i * 60, 170, 22, 20, '#2E9B6A', '#16603E', 2) + circ(26 + i * 60, 166, 5, '#FF7AB6') + circ(34 + i * 60, 164, 5, '#F2A32C');
    return T(b.x * 100, b.y * 100, shadow(100, 192, 96, 6) + s);
  };
  big('chichen', 'chichen', 3, 3); big('hacienda', 'hacienda', 2, 2);
  ART.sombrero = function (b) {
    var s = shadow(50, 92, 40, 5) + ell(50, 70, 44, 12, '#E8B84A', '#8A5A1A') + ell(50, 66, 38, 9, '#F2CE68') + path('M32 66Q32 30 50 28Q68 30 68 66Q50 74 32 66Z', '#E8B84A', '#8A5A1A', 2.2) + path('M34 56Q50 64 66 56', '', '#E5334B', 4) + path('M34 50Q50 58 66 50', '', '#2E9B6A', 2.4) + circ(50, 28, 3, '#E5334B') + path('M12 70Q50 82 88 70', '', '#E5334B', 2) + circ(18, 70, 2, '#F2C94C') + circ(50, 76, 2, '#F2C94C') + circ(82, 70, 2, '#F2C94C');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.pinata = function (b) {
    var s = shadow(50, 92, 24, 4) + path('M50 2V14', '', '#8A8F9A', 3) + path('M24 36L50 14L76 36L68 66L50 74L32 66Z', '#E5334B', '#7A1E10', 2.2) + path('M24 36L50 14L76 36L50 40Z', '#FF7AB6', '#7A1E10', 2) + path('M50 40L68 66L50 74L32 66Z', '#F2C94C', '#8A6A1A', 2), i;
    for (i = 0; i < 6; i++) s += path('M' + (18 + i * 13) + ' 70q0 8 -4 14M' + (22 + i * 13) + ' 70q2 10 6 14', '', ['#2B6BC8', '#2E9B6A', '#E5334B', '#F2C94C', '#FF7AB6', '#2B6BC8'][i], 3);
    return T(b.x * 100, b.y * 100, s + path('M30 40L50 20L70 40', '', 'rgba(255,255,255,.45)', 3));
  };
  ART.tacocart = function (b) {
    var s = shadow(50, 92, 40, 5) + circ(30, 84, 8, '#4A4A52', '#222') + circ(70, 84, 8, '#4A4A52', '#222') + circ(30, 84, 3, '#C9C9D2') + circ(70, 84, 3, '#C9C9D2') + rect(14, 52, 72, 28, '#E8B84A', '#8A5A1A', 3) + path('M10 52L50 18L90 52Z', '#E5334B', '#7A1E10', 2.4) + path('M10 52h80', '', '#FFFFFF', 4);
    for (var i = 0; i < 6; i++) s += path('M' + (14 + i * 14) + ' 52q7 8 14 0', '#FFFFFF', '#E5334B', 1.6);
    s += rect(20, 60, 60, 14, '#F4E2B0', '#8A5A1A', 2) + path('M26 66q6 -8 12 0q6 -8 12 0q6 -8 12 0', '', '#2E9B6A', 3) + circ(32, 64, 2, '#E5334B') + circ(54, 64, 2, '#E5334B');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.altar = function (b) {
    var s = shadow(50, 92, 36, 5) + rect(10, 74, 80, 14, '#8A5A2E', '#5A3410', 2) + rect(18, 52, 64, 24, '#2E9B6A', '#16603E', 2) + rect(28, 32, 44, 22, '#E5334B', '#7A1E10', 2) + rect(38, 14, 24, 20, '#F2A32C', '#8A5A1A', 2), i;
    for (i = 0; i < 6; i++) s += circ(16 + i * 14, 70, 5, i % 2 ? '#F2A32C' : '#FF7A1A', '#8A4A10') + circ(22 + i * 12, 50, 4, '#FFFFFF');
    s += path('M46 22q4 -6 8 0q4 6 -2 8q-4 0 -6 -8z', '#FFFFFF', '#5A3410', 1.2) + circ(48, 24, 1.4, '#222') + circ(52, 24, 1.4, '#222') + path('M12 52v-10M88 52v-10', '', '#F2C94C', 3) + path('M12 42q-3 -8 0 -12M88 42q3 -8 0 -12', '', '#FF7A1A', 3);
    return T(b.x * 100, b.y * 100, s);
  };

  /* ═════════ BRAZIL ═════════ */
  THEME.brazil = { g1: '#9ADB6A', g2: '#6EC24A', ground: function (R, W, H2) { return scatter(R, W, H2, 34, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3.2" fill="' + ['#FFD23F', '#FF5C7A', '#4FB4FF', '#FFFFFF'][i % 4] + '" opacity=".85"/>'; }) + scatter(R, W, H2, 10, function (x, y) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q12 -14 24 0q-12 -4 -24 0" fill="rgba(30,110,40,.35)"/>'; }); } };
  DTH.brazil = { leaf: ['#2E9B4A', '#1F7F3A', '#5ACB6A'], bush: ['#FF5C7A', '#2E9B4A'], rock: ['#8A93A0', '#A8B0BC'], post: '#8A5A2E', rail: '#FFD23F' };
  ART.christredeemer = function (b) {
    var s = '', i;
    s += path('M0 290Q30 214 90 196Q150 160 210 196Q270 214 300 290Z', '#4FA84F', '#2E6E30', 2.6) + path('M30 270Q60 224 100 214', '', 'rgba(255,255,255,.3)', 5) + path('M40 258q10 -8 22 -4M70 232q10 -8 24 -6M120 214q10 -6 24 -4', '', '#3A8A3C', 4);
    s += rect(114, 186, 72, 26, '#D8D8D2', '#8A8A84', 2.4) + rect(126, 150, 48, 40, '#E8E8E2', '#8A8A84', 2.4) + path('M132 150V190M168 150V190', '', 'rgba(120,120,110,.4)', 2);
    s += path('M142 40Q150 34 158 40L160 56L170 62L254 72L252 82L170 84L168 120L172 150H128L132 120L130 84L48 82L46 72L130 62L140 56Z', '#F2F2EC', '#9A9A92', 2.6);
    s += path('M150 36V120', '', 'rgba(150,150,140,.45)', 2) + circ(150, 46, 12, '#F2F2EC', '#9A9A92') + path('M144 46h12', '', '#9A9A92', 2) + path('M146 54q4 3 8 0', '', '#9A9A92', 1.6) + path('M52 77H138M162 77H248', '', 'rgba(150,150,140,.45)', 2);
    s += path('M120 4L150 -4L180 4', '', 'rgba(255,255,255,0)', 1) + '<g opacity=".35">' + path('M150 14L128 -6M150 14L172 -6M150 14V-8', '', '#FFF6A0', 2) + '</g>';
    return T(b.x * 100, b.y * 100, shadow(150, 292, 146, 6) + s);
  };
  ART.carnival = function (b) {
    var s = '', i;
    s += rect(14, 120, 172, 66, '#8A5ACF', '#4A2A8A', 2.4) + rect(8, 180, 184, 12, '#2A2A34', '#14141A', 2) + circ(36, 190, 10, '#4A4A52', '#222') + circ(164, 190, 10, '#4A4A52', '#222');
    for (i = 0; i < 12; i++) s += circ(24 + i * 14, 124, 5, ['#FFD23F', '#FF5C7A', '#4FB4FF', '#2E9B4A'][i % 4], '#fff');
    s += path('M28 120Q100 40 172 120Z', '#FFD23F', '#B8860B', 2.4) + path('M44 118Q100 62 156 118', '', '#FF5C7A', 4) + path('M60 116Q100 80 140 116', '', '#2E9B4A', 4);
    for (i = 0; i < 9; i++) s += path('M' + (100 + (i - 4) * 12) + ' 56l' + ((i - 4) * 3) + ' -26', '', ['#FFD23F', '#FF5C7A', '#4FB4FF', '#2E9B4A', '#FF7A1A'][i % 5], 4) + circ(100 + (i - 4) * 15, 28 + Math.abs(i - 4), 4, ['#FFD23F', '#FF5C7A', '#4FB4FF', '#2E9B4A', '#FF7A1A'][i % 5]);
    s += rect(30, 140, 36, 30, '#FFE9A8', '#4A2A8A', 2) + path('M48 140v30', '', '#4A2A8A', 1.6) + circ(100, 152, 12, '#FF5C7A', '#7A1E40') + path('M92 152h16M100 144v16', '', '#fff', 2) + rect(132, 140, 36, 30, '#FFE9A8', '#4A2A8A', 2) + path('M150 140v30', '', '#4A2A8A', 1.6);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 96, 6) + s);
  };
  big('christredeemer', 'christredeemer', 3, 3); big('carnival', 'carnival', 2, 2);
  ART.braball = function (b) {
    var s = shadow(50, 92, 34, 5) + circ(50, 54, 32, '#FFFFFF', '#444') + path('M50 38L62 46L58 60H42L38 46Z', '#222', '#222', 1.6) + path('M50 38V22M62 46L76 42M58 60L68 72M42 60L32 72M38 46L24 42', '', '#444', 2) + path('M50 22L40 24L34 30M50 22L60 24L66 30', '', '#444', 2) + circ(42, 38, 3, 'rgba(255,255,255,.7)');
    s += poly('14,92 86,92 80,80 20,80', '#2E9B4A', '#16603E');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.toucanpost = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 4) + rect(44, 50, 10, 42, '#8A5A2E', '#5A3410', 2) + path('M30 52H70', '', '#8A5A2E', 4) + ell(48, 36, 14, 18, '#1E1E26', '#000') + ell(46, 42, 8, 8, '#FFFFFF') + path('M56 30Q80 26 84 40Q70 42 58 40Z', '#FF7A1A', '#B8460A', 2) + path('M60 32Q76 30 80 38', '', '#FFD23F', 3) + circ(52, 30, 4, '#4FB4FF', '#fff') + circ(52, 30, 1.6, '#000') + path('M34 54L28 70', '', '#1E1E26', 4) + path('M60 52l4 4', '', '#FF7A1A', 3));
  };
  ART.victoria = function (b) {
    var s = shadow(50, 80, 44, 8, 'rgba(10,60,60,.3)') + ell(50, 74, 44, 14, '#3FB4A0', '#1F7A6A') + ell(50, 70, 40, 11, '#52C8B4'), i;
    s += path('M10 72Q50 40 90 72', 'rgba(60,160,120,.9)', '#1F7A6A', 2.2) + ell(50, 62, 36, 8, '#4FC9A8', '#1F7A6A');
    for (i = 0; i < 8; i++) s += path('M' + (14 + i * 10) + ' 66L' + (50 + (i - 3.5) * 2) + ' 62', '', '#1F7A6A', 1.6);
    s += path('M44 60Q50 40 56 60Z', '#FFB0D0', '#C04A7A', 1.6) + path('M36 62Q42 44 50 60Z', '#FF8AB6', '#C04A7A', 1.6) + path('M64 62Q58 44 50 60Z', '#FF8AB6', '#C04A7A', 1.6) + circ(50, 58, 3, '#FFD23F');
    return T(b.x * 100, b.y * 100, s);
  };

  /* ═════════ AI CẬP — Egypt Culture Park ═════════ */
  THEME.egypt = { g1: '#EED9A0', g2: '#DDC07A', noGrass: 1, ground: function (R, W, H2) { return scatter(R, W, H2, 30, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q14 -6 28 0" stroke="rgba(190,150,80,.5)" stroke-width="3" fill="none" stroke-linecap="round"/>'; }); } };
  DTH.egypt = { leaf: ['#6FAA4A', '#5A9638', '#8CC862'], bush: ['#8CC862', '#E8B84A'], rock: ['#D9C08A', '#EBD7A6'], post: '#C9A25A', rail: '#2E9BB0' };
  ART.giza = function (b) {
    var s = '', i;
    s += path('M0 292Q60 280 150 284Q240 280 300 292V300H0Z', '#E4C888', '', 0);
    s += poly('60,292 170,60 280,292', '#E8C878', '#A88A44') + poly('170,60 280,292 190,292', '#CFAE5E', '') + poly('170,60 190,292 150,292', '#DDBC6A', '');
    for (i = 1; i < 9; i++) s += path('M' + (60 + i * 11) + ' ' + (292 - i * 25.8) + 'H' + (280 - i * 11), '', 'rgba(150,110,40,.4)', 1.6);
    s += poly('4,292 70,150 136,292', '#EBCD84', '#A88A44') + poly('70,150 136,292 90,292', '#D2B25E', '') + poly('150,292 214,190 280,292', '#EBCD84', '#A88A44') + poly('214,190 280,292 236,292', '#D2B25E', '');
    for (i = 1; i < 5; i++) s += path('M' + (4 + i * 13) + ' ' + (292 - i * 28) + 'H' + (136 - i * 13), '', 'rgba(150,110,40,.4)', 1.4);
    s += poly('160,60 170,40 180,60', '#F2C94C', '#B8860B') + path('M200 288h40v-6h-40z', '#2A2A34', '', 0);
    return T(b.x * 100, b.y * 100, shadow(150, 294, 146, 6, 'rgba(120,90,30,.3)') + s);
  };
  ART.karnak = function (b) {
    var s = '', i;
    s += rect(12, 174, 176, 16, '#CFAE5E', '#8A6A2A', 2) + rect(24, 66, 152, 110, '#E4C888', '#8A6A2A', 2.4);
    for (i = 0; i < 6; i++) s += rect(32 + i * 24, 78, 14, 96, '#EBD39A', '#8A6A2A', 1.8) + path('M' + (36 + i * 24) + ' 90h6M' + (36 + i * 24) + ' 110h6M' + (36 + i * 24) + ' 130h6M' + (36 + i * 24) + ' 150h6', '', '#2E9BB0', 3) + rect(28 + i * 24, 70, 22, 10, '#CFAE5E', '#8A6A2A', 1.6) + path('M' + (28 + i * 24) + ' 70q11 -10 22 0', '#2E9BB0', '#16707A', 1.4);
    s += poly('20,66 180,66 170,50 30,50', '#CFAE5E', '#8A6A2A') + rect(30, 40, 140, 12, '#E4C888', '#8A6A2A', 2) + path('M30 44h140', '', '#2E9BB0', 2.4);
    s += rect(84, 130, 32, 46, '#3A2A12', '#8A6A2A', 2) + path('M30 52q70 -26 140 0', '', '#F2C94C', 3);
    s += rect(96, 8, 8, 36, '#CFAE5E', '#8A6A2A', 1.6) + poly('92,10 100,0 108,10', '#F2C94C', '#B8860B');
    return T(b.x * 100, b.y * 100, shadow(100, 192, 96, 6, 'rgba(120,90,30,.3)') + s);
  };
  big('giza', 'giza', 3, 3); big('karnak', 'karnak', 2, 2);
  ART.ankh = function (b) {
    var s = shadow(50, 92, 28, 4) + rect(20, 80, 60, 10, '#E4C888', '#8A6A2A', 2) + path('M50 80V40M30 52H70', '', '#F2C94C', 9) + path('M50 40Q34 40 34 26Q34 8 50 8Q66 8 66 26Q66 40 50 40Z', 'none', '#F2C94C', 8) + path('M50 80V40M30 52H70', '', '#B8860B', 2.4) + circ(50, 52, 3.4, '#2E9BB0', '#16707A') + circ(50, 24, 5, '#E5334B', '#7A1E10');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.scarab = function (b) {
    var s = shadow(50, 90, 30, 4) + ell(50, 60, 24, 26, '#2E7FD0', '#16407A') + path('M50 36V86', '', '#16407A', 2.4) + ell(50, 32, 12, 9, '#3C8FE0', '#16407A') + path('M26 56Q10 46 8 62Q14 70 28 68M74 56Q90 46 92 62Q86 70 72 68M30 74Q16 80 20 88M70 74Q84 80 80 88', '', '#16407A', 4) + circ(44, 30, 2.4, '#F2C94C') + circ(56, 30, 2.4, '#F2C94C') + path('M36 50Q50 44 64 50', '', '#F2C94C', 2) + circ(50, 62, 5, '#F2C94C', '#B8860B');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.obelisk = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 4) + rect(28, 80, 44, 12, '#CFAE5E', '#8A6A2A', 2) + poly('36,80 40,22 60,22 64,80', '#E4C888', '#8A6A2A') + poly('40,22 50,4 60,22', '#F2C94C', '#B8860B') + path('M44 34v6M44 46v6M44 58v6M44 70v6M56 34v6M56 46v6M56 58v6', '', '#2E9BB0', 3) + path('M50 30v40', '', '#8A6A2A', 1.4));
  };
  ART.papyrus = function (b) {
    var s = shadow(50, 92, 30, 4) + path('M30 90Q26 60 28 28M50 90Q50 54 50 12M70 90Q74 60 72 30', '', '#6FAA4A', 4);
    [[28, 28], [50, 12], [72, 30]].forEach(function (p) { var i; for (var k = 0; k < 9; k++) s += path('M' + p[0] + ' ' + p[1] + 'L' + (p[0] + Math.cos((k * 40 - 90) * Math.PI / 180) * 18).toFixed(1) + ' ' + (p[1] + Math.sin((k * 40 - 90) * Math.PI / 180) * 18).toFixed(1), '', '#8CC862', 2); });
    return T(b.x * 100, b.y * 100, s);
  };
  ART.eyehorus = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 4) + rect(30, 82, 40, 8, '#CFAE5E', '#8A6A2A', 2) + rect(34, 28, 32, 56, '#E4C888', '#8A6A2A', 2) + path('M24 52Q50 34 76 52Q50 68 24 52Z', '#FFFFFF', '#16407A', 2.4) + circ(50, 52, 7, '#2E7FD0', '#16407A') + circ(50, 52, 3, '#000') + path('M50 59Q50 72 40 74M62 56q10 4 12 14', '', '#16407A', 3) + path('M24 52Q16 46 10 48', '', '#16407A', 3) + path('M30 44Q50 32 70 44', '', '#16407A', 3));
  };

  /* ═════════ MA-RỐC — Morocco Culture Park ═════════ */
  THEME.morocco = { g1: '#E8C8A0', g2: '#D5AC7A', noGrass: 1, ground: function (R, W, H2) { return scatter(R, W, H2, 30, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'l7 -7l7 7l-7 7z" fill="' + ['#2B6BC8', '#2E9B6A', '#E5334B', '#F2C94C'][i % 4] + '" opacity=".35"/>'; }); } };
  DTH.morocco = { leaf: ['#6FAA4A', '#5A9638', '#8CC862'], bush: ['#E5334B', '#6FAA4A'], rock: ['#D9B88A', '#EBCFA6'], post: '#2B6BC8', rail: '#C1272D' };
  ART.koutoubia = function (b) {
    var s = '', i;
    s += rect(14, 214, 272, 74, '#E8C890', '#A8804A', 2.4) + rect(8, 270, 284, 20, '#D9B073', '#A8804A', 2);
    for (i = 0; i < 7; i++) s += path('M' + (30 + i * 34) + ' 270V236Q' + (30 + i * 34 + 10) + ' 220 ' + (30 + i * 34 + 20) + ' 236V270Z', '#3A2A12', '#8A5A2A', 2) + path('M' + (34 + i * 34) + ' 240q6 -8 12 0', '', '#F2C94C', 2);
    for (i = 0; i < 12; i++) s += rect(14 + i * 22.6, 206, 12, 10, '#F4DEB0', '#A8804A', 1.6);
    s += rect(112, 40, 76, 172, '#E8C890', '#A8804A', 2.4) + rect(106, 34, 88, 10, '#D9B073', '#A8804A', 2);
    for (i = 0; i < 6; i++) s += path('M' + (122 + (i % 2) * 36) + ' ' + (190 - i * 24) + 'v-14q8 -12 16 0v14z', '#3A2A12', '#8A5A2A', 1.8) + rect(112, 200 - i * 24, 76, 3, '#CFA860', '', 0);
    s += rect(122, 56, 56, 16, '#2E9B6A', '#16603E', 2) + path('M122 64h56', '', '#F2C94C', 2) + rect(124, 12, 52, 24, '#E8C890', '#A8804A', 2) + rect(136, 0, 28, 14, '#E8C890', '#A8804A', 2) + circ(150, -3, 4, '#F2C94C') + path('M150 4v6', '', '#B8860B', 2) + path('M130 24h40', '', '#2E9B6A', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 144, 6) + s);
  };
  ART.riad = function (b) {
    var s = '', i;
    s += rect(8, 74, 184, 116, '#E8B88A', '#A8704A', 2.4) + path('M8 80Q100 48 192 80', '', '#A8704A', 2);
    s += rect(26, 90, 148, 96, '#F6E2B8', '#A8704A', 2) + ell(100, 156, 46, 18, '#4FB4D8', '#1F7A9A') + ell(100, 154, 38, 13, '#7FD0E8') + circ(100, 154, 6, '#E8F6FA', '#1F7A9A') + path('M100 148v-18M92 136q8 -8 16 0', '', '#BFE8FF', 2);
    for (i = 0; i < 4; i++) s += path('M' + (34 + i * 34) + ' 134V108Q' + (34 + i * 34 + 8) + ' 96 ' + (34 + i * 34 + 16) + ' 108V134Z', '#2B6BC8', '#16407A', 2) + path('M' + (38 + i * 34) + ' 110q4 -6 8 0', '', '#F2C94C', 1.6);
    for (i = 0; i < 8; i++) s += rect(26 + i * 18.4, 176, 12, 10, i % 2 ? '#2B6BC8' : '#2E9B6A', '', 1) + rect(26 + i * 18.4, 90, 12, 6, i % 2 ? '#F2C94C' : '#E5334B', '', 1);
    s += circ(36, 160, 8, '#2E9B6A') + circ(166, 160, 8, '#2E9B6A') + rect(30, 166, 12, 10, '#C8553A', '#7A2A14', 1.6) + rect(160, 166, 12, 10, '#C8553A', '#7A2A14', 1.6);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 94, 6) + s);
  };
  big('koutoubia', 'koutoubia', 3, 3); big('riad', 'riad', 2, 2);
  ART.maflag = flagPole('ma');
  ART.moroccanteapot = function (b) {
    var s = shadow(50, 92, 32, 4) + ell(50, 86, 34, 6, '#B8860B', '#7A5A0A') + path('M30 84Q22 54 38 44H62Q78 54 70 84Z', '#E8D8A0', '#B8860B', 2.4) + path('M30 66H70', '', '#B8860B', 3) + path('M34 52H66', '', '#C99A1B', 2) + rect(40, 36, 20, 10, '#E8D8A0', '#B8860B', 2) + path('M46 36q4 -14 8 0', '#F2C94C', '#B8860B', 2) + circ(50, 22, 4, '#F2C94C', '#B8860B') + path('M70 54Q90 50 88 70Q86 78 72 76', '', '#B8860B', 4) + path('M30 62Q12 56 8 44', '', '#B8860B', 5) + circ(40, 74, 2.4, '#2B6BC8') + circ(50, 76, 2.4, '#E5334B') + circ(60, 74, 2.4, '#2B6BC8');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.moroccanlamp = function (b) {
    var s = shadow(50, 92, 22, 4) + path('M50 2V14', '', '#8A8F9A', 3) + rect(42, 12, 16, 6, '#B8860B', '#7A5A0A', 1.6) + path('M36 24Q50 14 64 24L70 56Q50 74 30 56Z', '#C99A1B', '#7A5A0A', 2) + path('M40 30h20L66 54Q50 66 34 54Z', '#E5334B', '#7A1E10', 1.6) + path('M44 36h12M42 44h16M40 52h20', '', '#F2C94C', 1.4) + path('M50 30v30', '', '#7A1E10', 1.2) + path('M36 62Q50 76 64 62L58 80H42Z', '#C99A1B', '#7A5A0A', 2) + circ(50, 84, 4, '#F2C94C', '#7A5A0A') + ell(50, 46, 12, 10, 'rgba(255,200,80,.4)');
    return T(b.x * 100, b.y * 100, s);
  };
  ART.carpet = function (b) {
    var s = shadow(50, 90, 40, 4) + poly('10,84 24,48 90,48 76,84', '#C1272D', '#7A1E10') + poly('18,78 29,52 82,52 71,78', '#F2C94C', '#B8860B') + poly('24,72 33,56 76,56 67,72', '#2B6BC8', '#16407A') + poly('50,70 58,64 50,58 42,64', '#F2C94C', '#B8860B'), i;
    for (i = 0; i < 8; i++) s += path('M' + (10 + i * 8.6) + ' 84v6M' + (24 + i * 8.4) + ' 48v-4', '', '#F2C94C', 2);
    return T(b.x * 100, b.y * 100, s);
  };
})(typeof window !== 'undefined' ? window : this);
