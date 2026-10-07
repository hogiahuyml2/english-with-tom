/* EWT Garden — phong cảnh của 10 khu thêm sau (rừng tre, thảo nguyên, rừng nhiệt đới, làng trung cổ, công viên giải trí,
   Bắc Cực, đảo hải tặc, thung lũng khủng long, núi lửa, thành phố tương lai).
   Nạp SAU garden-world2.js: bổ sung ART (hình từng khối), THEME (màu nền + hoạ tiết), DTH (màu cảnh phụ), BIG (công trình lớn trong cửa hàng).
   Mỗi khối vẽ trong khung (w×h ô) × 100 đơn vị, đặt bằng T(b.x*100, b.y*100, …) như các khối cũ. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld; if (!API || !API.DTH) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, BIG = API.BIG, BIGSIZE = API.BIGSIZE, OUT = '#6B4A2B';
  function T(x, y, inner, extra) { return '<g transform="translate(' + x + ' ' + y + ')"' + (extra || '') + '>' + inner + '</g>'; }
  function shadow(cx, cy, rx, ry, c) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + (c || 'rgba(20,50,20,.3)') + '"/>'; }
  function F(id) { return 'url(#bg-' + id + ')'; }
  function circ(cx, cy, r, f, st) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function ell(cx, cy, rx, ry, f, st) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function rect(x, y, w, h, f, st, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function poly(pts, f, st) { return '<polygon points="' + pts + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2.4" stroke-linejoin="round"' : '') + '/>'; }
  function path(d, f, st, sw) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (st ? ' stroke="' + st + '" stroke-width="' + (sw || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"' : '') + '/>'; }
  function scatter(R, W, H, n, fn) { var s = '', i; for (i = 0; i < n; i++) s += fn(R() * W, R() * H, R, i); return s; }
  function f0(n) { return n.toFixed(0); }

  /* ───────── màu nền + hoạ tiết nền ───────── */
  THEME.bamboo = { g1: '#C4E6A2', g2: '#9ECD7C', ground: function (R, W, H) { return scatter(R, W, H, 50, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q9 -5 16 2q-8 5 -16 -2z" fill="rgba(70,140,50,.35)" transform="rotate(' + f0(r() * 180) + ' ' + f0(x) + ' ' + f0(y) + ')"/>'; }); } };
  THEME.savanna = { g1: '#EBD58F', g2: '#CDB063', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 110, function (x, y) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'l-3 -9m3 9l0 -11m0 11l3 -9" stroke="rgba(150,120,40,.55)" stroke-width="2" stroke-linecap="round"/>'; }); } };
  THEME.jungle = { g1: '#4E9C57', g2: '#2E7A47', ground: function (R, W, H) { return scatter(R, W, H, 40, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q18 -14 34 0q-17 10 -34 0z" fill="rgba(20,70,35,.4)" transform="rotate(' + f0(r() * 180) + ' ' + f0(x) + ' ' + f0(y) + ')"/>'; }); } };
  THEME.village = { g1: '#A5D67F', g2: '#82BE63', ground: function (R, W, H) { return scatter(R, W, H, 36, function (x, y, r) { return '<ellipse cx="' + f0(x) + '" cy="' + f0(y) + '" rx="' + f0(5 + r() * 7) + '" ry="' + f0(3 + r() * 3) + '" fill="rgba(150,140,120,.35)"/>'; }); } };
  THEME.funfair = { g1: '#BCE7A4', g2: '#98D27E', ground: function (R, W, H) { return scatter(R, W, H, 70, function (x, y, r, i) { return '<rect x="' + f0(x) + '" y="' + f0(y) + '" width="7" height="3" rx="1.5" transform="rotate(' + f0(r() * 180) + ' ' + f0(x) + ' ' + f0(y) + ')" fill="' + ['#FF6B9A', '#FFD23F', '#5BB6FF', '#8BE28A', '#B48CFF'][i % 5] + '" opacity=".7"/>'; }); } };
  THEME.arctic = { g1: '#EEF8FF', g2: '#BADAF2', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 14, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'l' + f0(20 + r() * 30) + ' ' + f0(-6 + r() * 12) + 'l' + f0(10 + r() * 20) + ' ' + f0(r() * 14) + '" stroke="rgba(120,170,210,.55)" stroke-width="2" fill="none" stroke-linecap="round"/>'; }) + scatter(R, W, H, 50, function (x, y) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="2" fill="#fff"/>'; }); } };
  THEME.pirate = { g1: '#F8E6B2', g2: '#E4C680', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 16, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q20 -10 40 0q-20 -4 -40 0" stroke="rgba(190,150,70,.5)" stroke-width="3" fill="none" stroke-linecap="round"/>'; }) + scatter(R, W, H, 14, function (x, y) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q6 -9 12 0z" fill="#FFB8C8"/>'; }); } };
  THEME.dino = { g1: '#92C25C', g2: '#6C9E46', ground: function (R, W, H) { return scatter(R, W, H, 14, function (x, y, r) { var a = f0(r() * 40 - 20); return '<g transform="rotate(' + a + ' ' + f0(x) + ' ' + f0(y) + ')" fill="rgba(60,90,30,.4)"><ellipse cx="' + f0(x) + '" cy="' + f0(y) + '" rx="9" ry="12"/><circle cx="' + f0(x - 9) + '" cy="' + f0(y - 14) + '" r="3.4"/><circle cx="' + f0(x) + '" cy="' + f0(y - 17) + '" r="3.4"/><circle cx="' + f0(x + 9) + '" cy="' + f0(y - 14) + '" r="3.4"/></g>'; }); } };
  THEME.volcano = { g1: '#5E4242', g2: '#2E2020', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 18, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'l' + f0(14 + r() * 24) + ' ' + f0(-8 + r() * 16) + 'l' + f0(10 + r() * 18) + ' ' + f0(r() * 18) + '" stroke="#FF8A2A" stroke-width="3" fill="none" stroke-linecap="round" opacity=".75"/>'; }) + scatter(R, W, H, 60, function (x, y) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="2" fill="rgba(255,255,255,.14)"/>'; }); } };
  THEME.cyber = { g1: '#2C3560', g2: '#131939', noGrass: 1, ground: function (R, W, H) { var s = '', i; for (i = 1; i < 7; i++) s += '<path d="M' + i * 100 + ' 0V' + H + '" stroke="rgba(80,220,255,.28)" stroke-width="2"/>'; for (i = 1; i < 5; i++) s += '<path d="M0 ' + i * 100 + 'H' + W + '" stroke="rgba(255,90,200,.24)" stroke-width="2"/>'; return s + scatter(R, W, H, 40, function (x, y, r, i) { return '<circle class="spk" style="animation-delay:' + (-r() * 3).toFixed(2) + 's" cx="' + f0(x) + '" cy="' + f0(y) + '" r="2.2" fill="' + (i % 2 ? '#5CE8FF' : '#FF5CC8') + '"/>'; }); } };

  DTH.bamboo = { leaf: ['#6DBB45', '#58A53A', '#8FD65A'], bush: ['#58A53A', '#7CC24A'], rock: ['#9AA89A', '#B8C4B8'], post: '#D9C58A', rail: '#B8A05A' };
  DTH.savanna = { leaf: ['#8FA845', '#7C9638', '#A8C257'], bush: ['#A8A04A', '#C4BC62'], rock: ['#C9A66A', '#E0C28A'], post: '#C9A66A', rail: '#9A7A3A' };
  DTH.jungle = { leaf: ['#2F8F4A', '#1F7A3C', '#4FAE62'], bush: ['#1F7A3C', '#3C9A52'], rock: ['#7A8A7A', '#9AA89A'], post: '#8A6A3A', rail: '#6A4A22' };
  DTH.village = { leaf: ['#5DB04C', '#4A9A3E', '#7FD36B'], bush: ['#4A9A3E', '#5DB04C'], rock: ['#9AA3AE', '#B9C1CB'], post: '#C98A4B', rail: '#8A5A2E' };
  DTH.funfair = { leaf: ['#5DBE55', '#3FAE4A', '#7FD36B'], bush: ['#FF8FB8', '#7FD36B'], rock: ['#B8C1CC', '#D8DFE8'], post: '#FF6B9A', rail: '#FFD23F' };
  DTH.arctic = { leaf: ['#DCEBF8', '#BFD8EE', '#fff'], bush: ['#CFE3F4', '#fff'], rock: ['#AEC0D2', '#DCE8F2'], post: '#EAF4FF', rail: '#A9C6E0' };
  DTH.pirate = { leaf: ['#4FB04A', '#3C9440', '#6FCB66'], bush: ['#3C9440', '#5DBE55'], rock: ['#B9A47A', '#D8C49A'], post: '#8A5A2E', rail: '#6B4120' };
  DTH.dino = { leaf: ['#4FA04A', '#3A8A3E', '#79C262'], bush: ['#3A8A3E', '#58A84C'], rock: ['#8F9A7A', '#B0BA9A'], post: '#9A7A4A', rail: '#6A4A22' };
  DTH.volcano = { leaf: ['#7A4A3A', '#9A5A3A', '#5A3A32'], bush: ['#5A3A32', '#7A4A3A'], rock: ['#4A4046', '#6A5A62'], post: '#6A5A62', rail: '#3A3036' };
  DTH.cyber = { leaf: ['#3ADFFF', '#B14CFF', '#5CE8FF'], bush: ['#B14CFF', '#3ADFFF'], rock: ['#4A5486', '#6A74A8'], post: '#5CE8FF', rail: '#FF5CC8' };

  /* ───────── rừng tre ───────── */
  ART.bamboogrove = function (b) {
    var s = '', xs = [26, 54, 82, 110, 136, 162, 184], hs = [230, 272, 205, 286, 240, 214, 256], i, j, x, top;
    for (i = 0; i < xs.length; i++) {
      x = xs[i]; top = 292 - hs[i]; s += '<g class="sway b" style="transform-origin:' + x + 'px 292px">' + rect(x - 7, top, 14, 292 - top, i % 2 ? '#86CC52' : '#62B43E', '#3F7D2C', 4);
      for (j = top + 34; j < 288; j += 42) s += path('M' + (x - 8) + ' ' + j + 'h16', '', '#3F7D2C', 3);
      s += path('M' + x + ' ' + (top + 18) + 'q28 -6 40 14q-26 6 -40 -14z', '#9AE066', '#4A9A32', 1.6) + path('M' + x + ' ' + (top + 54) + 'q-28 -6 -40 14q26 6 40 -14z', '#7FCB52', '#4A9A32', 1.6) + '</g>';
    }
    return T(b.x * 100, b.y * 100, shadow(100, 294, 94, 10) + s);
  };
  ART.bamboohouse = function (b) {
    var s = '', i;
    for (i = 0; i < 5; i++) s += rect(44 + i * 52, 128, 10, 62, F('woodD'), OUT, 2);
    s += rect(34, 120, 232, 14, F('wood'), OUT, 3) + rect(54, 64, 192, 58, '#E8D08A', '#A8873A', 4);
    for (i = 0; i < 9; i++) s += path('M' + (72 + i * 20) + ' 66v54', '', '#B8973F', 3);
    s += rect(122, 78, 56, 44, '#5B3A1E', '', 4) + rect(70, 80, 32, 24, F('glass'), '#A8873A', 3) + rect(198, 80, 32, 24, F('glass'), '#A8873A', 3) +
      poly('22,70 150,12 278,70 258,76 150,28 42,76', F('thatch'), '#A8761F') + path('M70 56l8 14M110 40l6 14M150 28v16M190 40l-6 14M230 56l-8 14', '', '#C99A3B', 3) +
      path('M130 134l-10 56M170 134l10 56', '', OUT, 3) + path('M122 152h56M118 170h64', '', OUT, 3);
    return T(b.x * 100, b.y * 100, shadow(150, 192, 126, 9) + s);
  };
  ART.pandasit = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 30, 7) + path('M70 48l6 38', '', '#62B43E', 7) + path('M66 40l8 -6', '', '#86CC52', 3) +
      ell(50, 66, 24, 22, '#fff', '#2A2A2A') + ell(36, 84, 9, 7, '#2A2A2A') + ell(64, 84, 9, 7, '#2A2A2A') + ell(32, 62, 7, 15, '#2A2A2A') + ell(66, 62, 7, 12, '#2A2A2A') +
      circ(50, 36, 17, '#fff', '#2A2A2A') + circ(37, 22, 6, '#2A2A2A') + circ(63, 22, 6, '#2A2A2A') + ell(43, 36, 4.4, 5.4, '#2A2A2A') + ell(57, 36, 4.4, 5.4, '#2A2A2A') +
      circ(44, 35, 1.6, '#fff') + circ(56, 35, 1.6, '#fff') + ell(50, 42, 3, 2.2, '#2A2A2A') + path('M46 46q4 3 8 0', '', '#2A2A2A', 1.6));
  };

  /* ───────── thảo nguyên ───────── */
  ART.acacia = function (b) {
    return T(b.x * 100, b.y * 100, shadow(100, 192, 80, 9) + path('M96 190Q92 150 100 124Q92 106 70 92M100 124Q112 104 140 92', '', '#6B4A22', 11) +
      ell(100, 70, 96, 30, '#7C9638', '#5A7228') + ell(70, 54, 58, 22, '#8FA845') + ell(134, 52, 56, 22, '#8FA845') + ell(100, 40, 44, 16, '#A8C257') + path('M30 78q40 14 70 8M110 86q40 6 66 -8', '', '#5A7228', 2));
  };
  ART.waterhole = function (b) {
    var s = '', i;
    for (i = 0; i < 12; i++) s += ell(36 + i * 21 + (i % 2) * 6, 26 + Math.sin(i * 1.7) * 9 + (i % 3) * 120, 10 + (i % 3) * 3, 5, ['#B8A56A', '#A89658', '#C9B67A'][i % 3]);
    return T(b.x * 100, b.y * 100, ell(150, 104, 130, 74, '#B79F62') + ell(150, 106, 118, 64, F('water'), '#2D9CDD') + ell(120, 90, 44, 14, 'rgba(255,255,255,.35)') + path('M70 100q22 -8 44 0M180 120q24 -8 48 0', '', 'rgba(255,255,255,.55)', 3) +
      path('M250 40v-34M260 44v-26M240 46v-22', '', '#6E8A3A', 4) + ell(70, 168, 14, 6, '#A89658') + ell(236, 164, 18, 7, '#B8A56A'));
  };
  ART.safaritower = function (b) {
    var s = '', i;
    s += path('M52 190L66 108M148 190L134 108M66 190l68 -80M134 190L66 112', '', OUT, 6);
    s += rect(40, 96, 120, 14, F('wood'), OUT, 3) + rect(48, 48, 6, 50, F('woodD'), OUT, 1) + rect(146, 48, 6, 50, F('woodD'), OUT, 1);
    for (i = 0; i < 5; i++) s += path('M' + (60 + i * 20) + ' 76v22', '', OUT, 3);
    s += path('M48 78H152', '', OUT, 4) + poly('30,52 100,12 170,52', '#D9B66A', '#9A7A3A') + path('M52 46l48 -26M148 46L100 20', '', '#B8973F', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 194, 76, 8) + s);
  };

  /* ───────── rừng nhiệt đới ───────── */
  ART.jungletemple = function (b) {
    var s = '', i, w, y;
    for (i = 0; i < 4; i++) { w = 250 - i * 52; y = 280 - i * 46; s += rect(150 - w / 2, y - 46, w, 46, i % 2 ? F('stone') : '#C9CFC0', '#6F7A68', 3); }
    s += rect(122, 92, 56, 46, '#8A9482', '#6F7A68', 3) + rect(138, 104, 24, 34, '#2A3A30', '', 3) + poly('112,92 150,62 188,92', '#A8B2A0', '#6F7A68') + rect(34, 270, 232, 10, '#5E6A58', '', 2);
    for (i = 0; i < 7; i++) s += path('M' + (150 - 120 + i * 40) + ' ' + (232 - (i % 3) * 30) + 'q-8 20 4 38', '', '#3C9A4C', 4);
    s += ell(70, 262, 30, 10, '#4FAE62') + ell(236, 258, 26, 9, '#3C9A4C') + path('M150 280v-30M150 234v-24M150 190v-24M150 144v-22', '', '#7A8470', 4);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 10) + s);
  };
  ART.vinetree = function (b) {
    var s = '', i;
    s += path('M84 292Q80 220 92 150Q88 110 100 96Q112 110 108 150Q120 220 116 292Z', F('woodD'), OUT, 3);
    s += circ(100, 70, 60, '#1F7A3C') + circ(54, 90, 40, '#2F8F4A') + circ(148, 88, 40, '#2F8F4A') + circ(100, 36, 36, '#3C9A52') + circ(70, 50, 22, '#4FAE62');
    for (i = 0; i < 6; i++) s += path('M' + (44 + i * 22) + ' 112q' + (i % 2 ? 8 : -8) + ' 50 0 ' + (60 + (i % 3) * 18), '', '#4FAE62', 5);
    s += ell(76, 150, 6, 9, '#E23B3B') + circ(76, 140, 5, '#E23B3B') + path('M72 140l-8 4', '', '#FFB02E', 3) + path('M76 158l-4 14', '', '#2E6BD8', 4) + circ(75, 139, 1.4, '#fff');
    return T(b.x * 100, b.y * 100, shadow(100, 294, 70, 9) + s);
  };
  ART.bigflower = function (b) {
    var s = '', i;
    s += path('M50 92Q54 70 50 48', '', '#2F8A4A', 5) + path('M50 80Q22 76 14 60Q36 62 50 80z', '#2F8F4A', '#1F6A38', 1.6) + path('M50 76Q78 70 88 54Q64 56 50 76z', '#3C9A52', '#1F6A38', 1.6);
    for (i = 0; i < 5; i++) s += ell(50 + Math.cos(i * 1.2566 - 1.57) * 17, 40 + Math.sin(i * 1.2566 - 1.57) * 17, 14, 9, i % 2 ? '#FF4F7A' : '#FF6B8A', '#C2284F').replace('/>', ' transform="rotate(' + (i * 72 - 90) + ' ' + (50 + Math.cos(i * 1.2566 - 1.57) * 17).toFixed(1) + ' ' + (40 + Math.sin(i * 1.2566 - 1.57) * 17).toFixed(1) + ')"/>');
    s += circ(50, 40, 7, '#FFD23F', '#D99A0B') + path('M50 40l12 -14', '', '#E2531F', 3) + circ(62, 26, 3, '#E2531F');
    return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 5) + s);
  };

  /* ───────── làng trung cổ ───────── */
  ART.tavern = function (b) {
    var s = '', i;
    s += rect(30, 86, 240, 102, '#F7EAD0', '#8A6A44', 3) + rect(30, 86, 240, 12, '#7A4A22') + path('M30 126h240M30 158h240M90 98v90M150 98v90M210 98v90', '', '#7A4A22', 6);
    s += poly('14,92 150,22 286,92 270,98 150,40 30,98', F('roofR'), '#8A2A22') + path('M60 70l12 26M110 48l8 30M190 48l-8 30M240 70l-12 26', '', '#A83A30', 3);
    s += rect(130, 130, 40, 58, F('woodD'), OUT, 4) + circ(162, 162, 3, '#FFD23F') + rect(48, 110, 34, 32, F('glass'), '#7A4A22', 3) + rect(218, 110, 34, 32, F('glass'), '#7A4A22', 3) + path('M65 110v32M48 126h34M235 110v32M218 126h34', '', '#7A4A22', 2);
    s += path('M178 100v-18h40', '', '#5E3A1E', 4) + rect(202, 82, 32, 22, '#E8C48C', OUT, 3) + path('M210 90h16M210 96h12', '', '#8A5A2E', 2);
    for (i = 0; i < 2; i++) s += ell(70 + i * 160, 188, 24, 6, '#6FBA5A');
    return T(b.x * 100, b.y * 100, shadow(150, 192, 126, 9) + s);
  };
  ART.marketstall = function (b) {
    var s = '', i;
    s += rect(24, 56, 152, 36, F('wood'), OUT, 3) + rect(30, 46, 140, 14, '#B27C45', OUT, 3);
    for (i = 0; i < 4; i++) s += circ(46 + i * 36, 42, 9, ['#E23B3B', '#F2A32C', '#7FD36B', '#E23B3B'][i], 'rgba(0,0,0,.25)');
    s += rect(20, 6, 8, 88, F('woodD'), OUT, 2) + rect(172, 6, 8, 88, F('woodD'), OUT, 2) + path('M14 8h172l-10 26H24z', F('red'), '#9E2E26', 2.4);
    for (i = 0; i < 4; i++) s += path('M' + (44 + i * 36) + ' 8l-2 26', '', '#fff', 8);
    return T(b.x * 100, b.y * 100, shadow(100, 94, 86, 6) + s);
  };

  /* ───────── công viên giải trí ───────── */
  ART.ferriswheel = function (b) {
    var s = '', i, a, cols = ['#FF5C7A', '#FFD23F', '#5BB6FF', '#7FD36B', '#B48CFF', '#FF9A3C', '#5CE8D8', '#FF5CC8'];
    s += path('M150 150L84 290M150 150L216 290M104 290h92', '', '#6A6F86', 10) + path('M150 150L70 290M150 150L230 290', '', '#8A90A8', 4);
    s += '<circle cx="150" cy="150" r="118" fill="none" stroke="#6A6F86" stroke-width="8"/><circle cx="150" cy="150" r="76" fill="none" stroke="#8A90A8" stroke-width="4"/>';
    for (i = 0; i < 8; i++) { a = i * Math.PI / 4; s += path('M150 150L' + (150 + Math.cos(a) * 118).toFixed(1) + ' ' + (150 + Math.sin(a) * 118).toFixed(1), '', '#8A90A8', 4); s += rect((150 + Math.cos(a) * 118 - 13).toFixed(1), (150 + Math.sin(a) * 118 - 6).toFixed(1), 26, 22, cols[i], 'rgba(0,0,0,.3)', 6); }
    s += circ(150, 150, 16, '#FFD23F', '#D99A0B') + circ(150, 150, 6, '#fff');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 110, 9) + '<g class="spin" style="transform-origin:150px 150px">' + s.slice(s.indexOf('<circle')) + '</g>' + path('M150 150L84 290M150 150L216 290M104 290h92', '', '#6A6F86', 10) + path('M150 150L70 290M150 150L230 290', '', '#8A90A8', 4));
  };
  ART.carousel = function (b) {
    var s = '', i, x;
    s += ell(100, 168, 86, 22, '#E8C48C', OUT) + rect(14, 150, 172, 18, F('red'), '#9E2E26', 4);
    for (i = 0; i < 4; i++) { x = 40 + i * 40; s += rect(x - 3, 70, 6, 90, '#FFD23F', '#D99A0B', 2) + ell(x, 120 + (i % 2) * 8, 13, 10, i % 2 ? '#fff' : '#F2A32C', 'rgba(0,0,0,.3)') + circ(x + 10, 110 + (i % 2) * 8, 6, i % 2 ? '#fff' : '#F2A32C', 'rgba(0,0,0,.3)'); }
    s += poly('10,72 100,14 190,72', '#FF5C7A', '#B02F4A') + path('M100 14L52 72M100 14l48 58M100 14v58', '', '#fff', 8) + path('M10 72q45 14 90 0q45 14 90 0', '#FFD23F', '#D99A0B', 2) + path('M100 14v-12', '', '#8A5A2E', 3) + poly('100,2 120,8 100,14', '#4FB4FF');
    return T(b.x * 100, b.y * 100, shadow(100, 188, 88, 8) + s);
  };
  ART.circustent = function (b) {
    var s = '', i;
    s += poly('20,92 150,10 280,92 280,186 20,186', '#fff', '#9E2E26');
    for (i = 0; i < 6; i++) s += poly((20 + i * 43.3) + ',186 ' + (20 + i * 43.3 + 21.6) + ',186 150,10 ' + (150 - (6 - i) * 2) + ',10', i % 2 ? '#fff' : '#E23B3B');
    s += path('M20 92Q150 130 280 92', '', '#9E2E26', 3) + poly('120,186 150,128 180,186', '#2A1A4A') + path('M150 10v-8', '', '#8A5A2E', 3) + poly('150,2 172,8 150,14', '#FFD23F') + circ(40, 160, 8, '#FFD23F') + circ(260, 160, 8, '#FFD23F');
    return T(b.x * 100, b.y * 100, shadow(150, 190, 134, 8) + s);
  };

  /* ───────── Bắc Cực ───────── */
  ART.igloo = function (b) {
    var s = '', i, j;
    s += '<path d="M24 176Q24 40 100 34Q176 40 176 176Z" fill="' + F('snow') + '" stroke="#8FB4D6" stroke-width="3"/>';
    for (j = 0; j < 4; j++) s += path('M' + (30 + j * 4) + ' ' + (150 - j * 34) + 'Q100 ' + (136 - j * 34) + ' ' + (170 - j * 4) + ' ' + (150 - j * 34), '', '#8FB4D6', 2);
    for (i = 0; i < 6; i++) s += path('M' + (44 + i * 22) + ' 176v-' + (30 + (i % 2) * 14), '', '#8FB4D6', 2);
    s += path('M70 176Q70 126 100 126Q130 126 130 176Z', '#3A5A82', '#8FB4D6', 3) + rect(56, 168, 88, 14, F('snow'), '#8FB4D6', 6);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 88, 8, 'rgba(60,100,150,.3)') + s);
  };
  ART.iceberg = function (b) {
    return T(b.x * 100, b.y * 100, ell(150, 266, 140, 24, 'rgba(60,150,220,.45)') + poly('20,262 80,120 110,170 170,34 224,150 252,110 290,262', F('ice'), '#7CB4D8') + poly('170,34 224,150 190,170 150,120', 'rgba(255,255,255,.55)') + poly('80,120 110,170 60,230', 'rgba(255,255,255,.4)') + path('M120 262l30 -70M200 262l-22 -60', '', '#9AD0EC', 3) +
      ell(150, 268, 120, 12, 'rgba(255,255,255,.4)'));
  };
  ART.penguins = function (b) {
    function pen(x, y, sc) {
      return '<g transform="translate(' + x + ' ' + y + ') scale(' + sc + ')">' + ell(0, 24, 14, 4, 'rgba(0,0,0,.2)') + ell(0, 0, 14, 22, '#2A3550') + ell(0, 4, 9, 16, '#fff') + circ(0, -20, 11, '#2A3550') + ell(-4, -22, 3, 3.4, '#fff') + ell(4, -22, 3, 3.4, '#fff') + circ(-4, -22, 1.2, '#222') + circ(4, -22, 1.2, '#222') + poly('-4,-17 4,-17 0,-11', '#FF9A2E') + ell(-8, 24, 5, 2.6, '#FF9A2E') + ell(8, 24, 5, 2.6, '#FF9A2E') + path('M-14 -2q-8 10 -4 18M14 -2q8 10 4 18', '', '#2A3550', 4) + '</g>';
    }
    return T(b.x * 100, b.y * 100, pen(46, 62, 1.1) + pen(100, 66, .9) + pen(152, 62, 1.05));
  };
  ART.aurora = function (b) {
    var s = '', i, cols = ['#5CFFB0', '#7CF0FF', '#B48CFF'];
    for (i = 0; i < 3; i++) s += path('M0 ' + (20 + i * 14) + 'C120 ' + (-6 + i * 10) + ' 220 ' + (46 + i * 6) + ' 340 ' + (16 + i * 12) + 'S560 ' + (6 + i * 14) + ' 700 ' + (24 + i * 10) + 'V' + (70 + i * 10) + 'C560 ' + (50 + i * 8) + ' 440 ' + (84 + i * 4) + ' 340 ' + (62 + i * 8) + 'S120 ' + (80 - i * 6) + ' 0 ' + (66 + i * 6) + 'Z', cols[i], '', 0).replace('/>', ' opacity=".34"/>');
    return T(b.x * 100, b.y * 100, '<g class="lampg">' + s + '</g>');
  };

  /* ───────── đảo hải tặc ───────── */
  ART.pirateship = function (b) {
    var s = '', i;
    s += '<g transform="rotate(-6 150 200)">' + path('M30 190Q60 250 150 258Q240 250 270 190Z', F('wood'), OUT, 3) + path('M30 190H270', '', '#5A3410', 5) + path('M50 214H250M70 236H230', '', 'rgba(60,30,10,.4)', 3);
    for (i = 0; i < 5; i++) s += circ(70 + i * 40, 212, 6, '#2A1A10', '#E8C48C');
    s += rect(144, 36, 10, 160, F('woodD'), OUT, 2) + rect(70, 74, 8, 118, F('woodD'), OUT, 2) + rect(220, 90, 8, 102, F('woodD'), OUT, 2) + path('M154 52Q214 70 154 148Z', '#F2EAD6', '#B8A878', 2) + path('M144 52Q86 70 144 148Z', '#F2EAD6', '#B8A878', 2) +
      path('M78 88Q40 100 78 150Z', '#EADFC4', '#B8A878', 2) + path('M228 100Q262 112 228 150Z', '#EADFC4', '#B8A878', 2) + path('M149 36l30 -10l-30 -10z', '#1E1E26') + circ(166, 26, 3.4, '#fff') + '</g>';
    return T(b.x * 100, b.y * 100, shadow(150, 272, 122, 10, 'rgba(120,90,30,.3)') + s);
  };
  ART.skullrock = function (b) {
    return T(b.x * 100, b.y * 100, shadow(100, 192, 80, 8) + path('M30 180Q16 120 40 70Q70 24 104 26Q150 28 172 76Q190 124 170 180Z', '#B8BCC4', '#6A7080', 3) + path('M60 70Q80 40 110 44', '', 'rgba(255,255,255,.5)', 6) +
      ell(76, 108, 20, 22, '#2A2F3A') + ell(128, 108, 20, 22, '#2A2F3A') + poly('92,138 100,124 108,138', '#2A2F3A') + rect(70, 156, 62, 24, '#2A2F3A', '', 3) + path('M84 156v24M98 156v24M112 156v24M126 156v24', '', '#B8BCC4', 4));
  };
  ART.xmark = function (b) {
    return T(b.x * 100, b.y * 100, ell(50, 66, 38, 14, '#D9B66A') + path('M30 48L70 78M70 48L30 78', '', '#D93A2E', 8) + path('M80 30l-4 52', '', '#8A5A2E', 4) + path('M74 82l10 -2l-2 10z', '#9AA3AE'));
  };

  /* ───────── thung lũng khủng long ───────── */
  ART.brontosaurus = function (b) {
    var s = '', i, G = '#6CBC48', D = '#4F9A34', O = '#2F6A22';
    s += ell(210, 262, 150, 14, 'rgba(30,60,20,.32)');
    // chân sau + chân trước (phía xa tối hơn)
    s += rect(130, 188, 30, 70, D, O, 12) + rect(268, 190, 30, 68, D, O, 12) + rect(170, 192, 32, 68, G, O, 12) + rect(304, 188, 32, 70, G, O, 12);
    s += path('M130 252h30M170 254h32M268 252h30M304 252h32', '', O, 4) + path('M138 258v-6M148 258v-6M152 258v-6M178 260v-6M188 260v-6M194 260v-6M276 258v-6M286 258v-6M290 258v-6M312 258v-6M322 258v-6M328 258v-6', '', '#F2E8C9', 3);
    // thân + cổ + đầu + đuôi: một khối liền
    s += path('M394 222C360 214 338 190 322 160C304 126 262 114 220 116C176 118 146 132 130 156C112 118 104 92 104 62C104 44 98 32 84 30C66 28 50 36 50 50C50 60 60 64 72 64C78 66 80 80 82 96C86 128 98 160 110 188C132 220 184 214 230 214C290 214 340 220 394 222Z', G, O, 3);
    s += path('M110 188C132 220 184 214 230 214C290 214 340 220 394 222C340 232 290 232 230 230C176 230 128 232 110 188Z', '#B9E08A') + path('M130 156C112 118 104 92 104 62', '', 'rgba(255,255,255,.28)', 6);
    for (i = 0; i < 7; i++) s += ell(166 + i * 28, 138 + (i % 2) * 22 + (i > 4 ? 14 : 0), 11 - (i > 4 ? 3 : 0), 8, '#4F9A34', '').replace('/>', ' opacity=".55"/>');
    for (i = 0; i < 5; i++) s += path('M' + (96 + i * 2) + ' ' + (70 + i * 14) + 'l-8 4', '', O, 2);
    s += ell(70, 36, 24, 15, G, O) + circ(64, 30, 5.5, '#fff', O) + circ(63, 30, 2.6, '#222') + path('M50 42q12 8 26 2', '', O, 2.4) + circ(52, 36, 1.6, O) + circ(58, 38, 1.2, O);
    return T(b.x * 100, b.y * 100, s);
  };
  ART.eggnest = function (b) {
    var s = '', i;
    s += ell(100, 74, 80, 22, '#8A5A2E', '#5A3410');
    for (i = 0; i < 14; i++) s += path('M' + (30 + i * 11) + ' ' + (68 + (i % 3) * 5) + 'l' + (14 - (i % 2) * 28) + ' ' + (10 - (i % 3) * 4), '', i % 2 ? '#B27C45' : '#6B4121', 4);
    s += ell(66, 52, 18, 24, '#F7EFD8', '#B8A878') + ell(104, 46, 19, 26, '#EAF4E0', '#A8B890') + ell(142, 54, 17, 23, '#F7EFD8', '#B8A878') + circ(60, 44, 3, '#8FB45A') + circ(72, 58, 2.4, '#8FB45A') + circ(98, 38, 3, '#7FA8D8') + circ(110, 54, 2.4, '#7FA8D8') + circ(138, 46, 3, '#8FB45A');
    return T(b.x * 100, b.y * 100, shadow(100, 92, 78, 6) + s);
  };
  ART.ferntree = function (b) {
    var s = '', i, a;
    s += path('M100 190Q96 150 100 100', '', '#8A5A2E', 16) + path('M90 170h20M92 148h16M94 126h12', '', '#6B4121', 3);
    for (i = 0; i < 9; i++) { a = -160 + i * 40; s += '<g transform="rotate(' + a + ' 100 100)"><path d="M100 100Q150 70 190 96" stroke="#3C9A52" stroke-width="5" fill="none" stroke-linecap="round"/>' + path('M118 92l4 -16M138 92l4 -16M158 94l5 -16M118 94l4 14M138 96l4 14M158 98l5 12', '', '#5DBE55', 4) + '</g>'; }
    return T(b.x * 100, b.y * 100, shadow(100, 194, 56, 8) + '<g class="sway b" style="transform-origin:100px 100px">' + s + '</g>');
  };

  /* ───────── núi lửa ───────── */
  ART.volcano = function (b) {
    var s = '', i;
    s += poly('10,290 150,80 250,80 390,290', '#5A4444', '#2E2020') + poly('150,80 250,80 390,290 270,290', 'rgba(0,0,0,.28)') + poly('150,80 250,80 232,98 168,98', '#2E2020');
    s += path('M168 94Q150 150 176 200Q156 240 190 290', '', '#FF6A2A', 12) + path('M232 94Q246 150 224 206Q250 248 236 290', '', '#FF8A2A', 9) + path('M168 94Q150 150 176 200', '', '#FFD23F', 4) + ell(200, 86, 38, 11, '#FF8A2A') + ell(200, 86, 26, 6, '#FFD23F');
    s += '<g class="sway b" style="transform-origin:200px 70px">' + circ(190, 54, 20, 'rgba(70,60,66,.7)') + circ(214, 36, 24, 'rgba(90,80,86,.6)') + circ(196, 18, 18, 'rgba(110,100,106,.5)') + '</g>';
    for (i = 0; i < 6; i++) s += circ(60 + i * 56, 270 - (i % 2) * 14, 5, '#FF8A2A');
    return T(b.x * 100, b.y * 100, ell(200, 292, 190, 12, 'rgba(0,0,0,.35)') + s);
  };
  ART.lavapool = function (b) {
    return T(b.x * 100, b.y * 100, ell(150, 104, 132, 76, '#3A2A2E', '#1E1418') + ell(150, 106, 118, 64, '#FF6A2A') + ell(150, 106, 92, 44, '#FF9A2A') + ell(150, 106, 56, 24, '#FFD23F') + ell(150, 106, 124, 68, 'rgba(255,120,40,.18)') +
      circ(100, 94, 7, '#FFD23F') + circ(206, 118, 9, '#FFD23F') + circ(170, 82, 5, '#fff') + path('M60 100q20 -10 40 0M190 130q20 -8 40 0', '', 'rgba(255,255,255,.4)', 3) + '<g class="lampg"><ellipse cx="150" cy="106" rx="132" ry="72" fill="url(#bg-glow)" opacity=".5"/></g>');
  };
  ART.obsidian = function (b) {
    return T(b.x * 100, b.y * 100, shadow(100, 92, 74, 6, 'rgba(0,0,0,.4)') + poly('24,92 40,34 66,62 80,92', '#1E1A26', '#0E0A14') + poly('60,92 84,16 112,50 126,92', '#2A2234', '#0E0A14') + poly('112,92 134,44 164,70 180,92', '#1E1A26', '#0E0A14') + path('M84 16L92 60M40 34l8 36M134 44l6 30', '', 'rgba(180,140,255,.55)', 3) + poly('84,16 100,34 92,60', 'rgba(170,130,255,.35)'));
  };

  /* ───────── thành phố tương lai ───────── */
  ART.neontower = function (b) {
    var s = '', i, j;
    s += rect(40, 60, 120, 232, F('night'), '#1A1240', 4) + rect(40, 60, 120, 232, 'rgba(0,0,0,.2)', '', 4) + rect(52, 40, 96, 24, '#3A2A8A', '#1A1240', 4) + path('M100 40v-34', '', '#8A90A8', 4) + circ(100, 6, 6, '#FF5CC8') + '<g class="lampg">' + circ(100, 6, 18, 'url(#bg-glowP)') + '</g>';
    for (i = 0; i < 9; i++) for (j = 0; j < 4; j++) s += rect(54 + j * 26, 76 + i * 22, 16, 12, (i * 3 + j * 5) % 7 < 3 ? '#5CE8FF' : (i + j) % 4 === 0 ? '#FF5CC8' : '#2A2A5A', '', 2);
    s += path('M40 60h120', '', '#5CE8FF', 5) + path('M40 292h120', '', '#FF5CC8', 5) + path('M34 120v100M166 150v110', '', '#5CE8FF', 3);
    return T(b.x * 100, b.y * 100, shadow(100, 294, 70, 8, 'rgba(60,20,120,.5)') + s);
  };
  ART.hovercar = function (b) {
    return T(b.x * 100, b.y * 100, ell(100, 178, 76, 12, 'rgba(92,232,255,.45)') + '<g class="sway b" style="transform-origin:100px 120px">' + path('M24 120Q30 84 80 80H130Q170 84 180 120Q184 140 160 140H40Q20 140 24 120Z', '#FF5CC8', '#8A1E6A', 3) + path('M70 84Q90 56 130 84Z', F('glass'), '#2A2A5A', 3) + path('M24 124H180', '', 'rgba(255,255,255,.6)', 4) + circ(60, 144, 14, '#2A2A5A', '#5CE8FF') + circ(144, 144, 14, '#2A2A5A', '#5CE8FF') + circ(170, 110, 6, '#FFE36B') + '<ellipse cx="100" cy="166" rx="56" ry="8" fill="#5CE8FF" opacity=".55"/></g>');
  };
  ART.robot = function (b) {
    return T(b.x * 100, b.y * 100, shadow(100, 192, 62, 8) + rect(60, 100, 80, 70, F('stone'), '#5A6A82', 8) + rect(74, 120, 52, 26, '#2A3550', '', 6) + circ(88, 133, 6, '#5CE8FF') + circ(112, 133, 6, '#FF5CC8') + rect(48, 174, 36, 20, '#5A6A82', '', 6) + rect(116, 174, 36, 20, '#5A6A82', '', 6) +
      rect(28, 108, 24, 12, '#8A90A8', '#5A6A82', 5) + rect(148, 108, 24, 12, '#8A90A8', '#5A6A82', 5) + rect(22, 112, 14, 40, '#8A90A8', '#5A6A82', 6) + rect(164, 112, 14, 40, '#8A90A8', '#5A6A82', 6) +
      rect(70, 40, 60, 54, F('stone'), '#5A6A82', 14) + circ(86, 64, 9, '#fff', '#2A3550') + circ(114, 64, 9, '#fff', '#2A3550') + circ(86, 65, 4, '#2E6BD8') + circ(114, 65, 4, '#2E6BD8') + path('M88 82q12 8 24 0', '', '#2A3550', 3) + path('M100 40v-18', '', '#8A90A8', 4) + '<g class="lampg">' + circ(100, 20, 6, '#FF5CC8') + '</g>');
  };
  ART.hologram = function (b) {
    var s = '', i;
    for (i = 0; i < 3; i++) s += '<ellipse cx="50" cy="40" rx="' + (24 - i * 7) + '" ry="22" fill="none" stroke="#5CE8FF" stroke-width="2" opacity=".85"/>';
    s += '<ellipse cx="50" cy="40" rx="24" ry="8" fill="none" stroke="#5CE8FF" stroke-width="2" opacity=".85"/><path d="M50 18v44" stroke="#5CE8FF" stroke-width="2" opacity=".85"/>';
    return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5, 'rgba(60,20,120,.4)') + rect(30, 70, 40, 18, '#2A3550', '#5CE8FF', 5) + poly('36,70 64,70 74,44 26,44', 'rgba(92,232,255,.22)') + '<g class="spk">' + s + '</g>');
  };

  /* ───────── cảnh phụ riêng của các khu mới ───────── */
  ART.pbamboo = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + '<g class="sway b" style="transform-origin:50px 90px">' + rect(30, 34, 8, 56, '#62B43E', '#3F7D2C', 3) + rect(48, 20, 9, 70, '#86CC52', '#3F7D2C', 3) + rect(66, 40, 8, 50, '#62B43E', '#3F7D2C', 3) + path('M52 40q20 -6 28 8q-18 6 -28 -8z', '#9AE066', '#4A9A32', 1.4) + path('M34 50q-18 -6 -26 8q16 6 26 -8z', '#7FCB52', '#4A9A32', 1.4) + '</g>');
  };
  ART.pfern = function (b) {
    var s = '', i;
    for (i = 0; i < 7; i++) s += '<g transform="rotate(' + (-80 + i * 27) + ' 50 88)">' + path('M50 88Q50 60 50 34', '', '#3C9A52', 4) + path('M50 76l-9 -6M50 76l9 -6M50 62l-8 -6M50 62l8 -6M50 48l-6 -5M50 48l6 -5', '', '#5DBE55', 3) + '</g>';
    return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5) + '<g class="sway b" style="transform-origin:50px 88px">' + s + '</g>');
  };
  ART.plava = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 6, 'rgba(0,0,0,.4)') + path('M24 90Q20 52 46 40Q70 36 78 66Q82 84 76 90Z', '#3A2A2E', '#1E1418', 2) + path('M40 50l8 14l10 -8l6 16M30 78l12 -6', '', '#FF8A2A', 3) + '<g class="lampg">' + circ(52, 64, 20, 'url(#bg-glow)') + '</g>');
  };
  ART.pice = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 26, 5, 'rgba(60,100,150,.3)') + poly('26,90 38,44 52,70 62,30 76,90', F('ice'), '#7CB4D8') + poly('62,30 76,90 60,90', 'rgba(255,255,255,.5)') + path('M40 90l8 -30', '', '#9AD0EC', 2));
  };
  ART.pbarrel = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 24, 5) + rect(28, 40, 44, 50, F('wood'), OUT, 10) + path('M28 54h44M28 76h44', '', '#5A3410', 4) + ell(50, 40, 22, 6, '#C98E55', OUT) + path('M38 44h24', '', 'rgba(255,255,255,.35)', 2));
  };
  ART.pneon = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 14, 5, 'rgba(60,20,120,.4)') + rect(46, 50, 8, 42, '#2A3550', '', 2) + rect(26, 18, 48, 36, '#1A1240', '#5CE8FF', 5) + path('M34 44l8 -18l8 14l8 -14l8 18', '', '#FF5CC8', 4) + '<g class="lampg">' + circ(50, 36, 30, 'url(#bg-glowP)') + '</g>');
  };

  /* ───────── công trình lớn trong cửa hàng (dùng lại hình của khối) ───────── */
  function big(id, art, w, h) { BIG[id] = function () { return ART[art]({ x: 0, y: 0 }); }; BIGSIZE[id] = [w, h]; }
  big('bamboohouse', 'bamboohouse', 3, 2); big('safaritower', 'safaritower', 2, 2); big('jungletemple', 'jungletemple', 3, 3); big('tavern', 'tavern', 3, 2);
  big('carousel', 'carousel', 2, 2); big('igloo', 'igloo', 2, 2); big('pirateship', 'pirateship', 3, 3); big('brontosaurus', 'brontosaurus', 4, 3);
  big('volcano', 'volcano', 4, 3); big('neontower', 'neontower', 2, 3);
})(typeof window !== 'undefined' ? window : this);
