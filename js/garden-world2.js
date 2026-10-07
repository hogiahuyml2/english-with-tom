/* EWT Garden — phong cảnh của 9 khu mới (nông trại, vườn anh đào, rừng thu, núi, sa mạc, kẹo ngọt, đại dương, thiên đường mây, trạm vũ trụ).
   Nạp SAU garden-world.js: bổ sung vào ART (hình từng khối) và THEME (màu nền + hoạ tiết nền) của EWTGardenWorld.
   Mỗi khối vẽ trong khung (w×h ô) × 100 đơn vị, đặt bằng T(b.x*100, b.y*100, …) như các khối cũ. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld; if (!API) return;
  var ART = API.ART, THEME = API.THEME, OUT = '#6B4A2B';
  function rnd(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function T(x, y, inner, extra) { return '<g transform="translate(' + x + ' ' + y + ')"' + (extra || '') + '>' + inner + '</g>'; }
  function shadow(cx, cy, rx, ry, c) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + (c || 'rgba(20,50,20,.3)') + '"/>'; }
  function F(id) { return 'url(#bg-' + id + ')'; }
  function circ(cx, cy, r, f, st) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function rect(x, y, w, h, f, st, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function poly(pts, f, st) { return '<polygon points="' + pts + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2.4" stroke-linejoin="round"' : '') + '/>'; }

  /* ───────── màu nền + hoạ tiết nền của từng khu mới ───────── */
  function scatter(R, W, H, n, fn) { var s = '', i; for (i = 0; i < n; i++) s += fn(R() * W, R() * H, R, i); return s; }
  THEME.farm = { g1: '#A5DB6B', g2: '#86C456' };
  THEME.sakura = { g1: '#C5E7A8', g2: '#A0D18B', ground: function (R, W, H) { return scatter(R, W, H, 90, function (x, y, r, i) { return '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="5" ry="3" transform="rotate(' + (r() * 180).toFixed(0) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')" fill="' + (i % 3 ? '#FFC2D8' : '#FFE0EC') + '" opacity=".85"/>'; }); } };
  THEME.autumn = { g1: '#DDA95E', g2: '#C48A41', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 110, function (x, y, r, i) { return '<path d="M' + x.toFixed(0) + ' ' + y.toFixed(0) + 'q6 -8 12 0q-6 8 -12 0z" transform="rotate(' + (r() * 180).toFixed(0) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')" fill="' + ['#D9531E', '#F2A32C', '#B8321C', '#E8C03A'][i % 4] + '" opacity=".8"/>'; }); } };
  THEME.mountain = { g1: '#B7C7A8', g2: '#8FA487', ground: function (R, W, H) { return scatter(R, W, H, 40, function (x, y, r) { return '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="' + (6 + r() * 9).toFixed(0) + '" ry="' + (4 + r() * 5).toFixed(0) + '" fill="rgba(110,120,125,.4)"/>'; }); } };
  THEME.desert = { g1: '#F4D88F', g2: '#E1BB6C', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 34, function (x, y, r) { return '<path d="M' + x.toFixed(0) + ' ' + y.toFixed(0) + 'q20 -10 40 0q-20 -4 -40 0" stroke="rgba(190,140,60,.5)" stroke-width="3" fill="none" stroke-linecap="round"/>'; }) + scatter(R, W, H, 16, function (x, y) { return '<ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="6" ry="3.5" fill="rgba(140,100,50,.45)"/>'; }); } };
  THEME.candy = { g1: '#FFD9EC', g2: '#FFB9DC', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 120, function (x, y, r, i) { return '<rect x="' + x.toFixed(0) + '" y="' + y.toFixed(0) + '" width="9" height="3.6" rx="1.8" transform="rotate(' + (r() * 180).toFixed(0) + ' ' + x.toFixed(0) + ' ' + y.toFixed(0) + ')" fill="' + ['#FF6B9A', '#FFD23F', '#6BC8FF', '#8BE28A', '#B48CFF', '#fff'][i % 6] + '"/>'; }); } };
  THEME.ocean = { g1: '#59C1EE', g2: '#2A87C8', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 14, function (x, y, r) { return '<ellipse cx="' + x.toFixed(0) + '" cy="' + (H - 6 - r() * 40).toFixed(0) + '" rx="' + (40 + r() * 60).toFixed(0) + '" ry="14" fill="rgba(240,220,160,.35)"/>'; }) + scatter(R, W, H, 46, function (x, y, r) { return '<circle cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (2 + r() * 4).toFixed(1) + '" fill="none" stroke="rgba(255,255,255,.7)" stroke-width="1.6"/>'; }); } };
  THEME.sky = { g1: '#D5EBFF', g2: '#A6D0F8', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 18, function (x, y, r) { var rx = 30 + r() * 40; return '<g fill="rgba(255,255,255,.75)"><ellipse cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" rx="' + rx.toFixed(0) + '" ry="14"/><ellipse cx="' + (x + rx * .4).toFixed(0) + '" cy="' + (y - 8).toFixed(0) + '" rx="' + (rx * .55).toFixed(0) + '" ry="13"/></g>'; }); } };
  THEME.space = { g1: '#2C3170', g2: '#12153F', noGrass: 1, ground: function (R, W, H) { return scatter(R, W, H, 90, function (x, y, r) { return '<circle class="spk" style="animation-delay:' + (-r() * 3).toFixed(2) + 's" cx="' + x.toFixed(0) + '" cy="' + y.toFixed(0) + '" r="' + (1 + r() * 2).toFixed(1) + '" fill="#fff"/>'; }) + '<circle cx="' + (W * .86) + '" cy="' + (H * .86) + '" r="26" fill="#E4A36B"/><circle cx="' + (W * .86 - 7) + '" cy="' + (H * .86 - 6) + '" r="8" fill="#C97F4E"/><ellipse cx="' + (W * .86) + '" cy="' + (H * .86) + '" rx="46" ry="8" fill="none" stroke="#F5D9A8" stroke-width="3" opacity=".8"/>'; } };

  /* ───────── nông trại ───────── */
  ART.barn = function (b) {
    return T(b.x * 100, b.y * 100, shadow(150, 192, 138, 10) +
      rect(34, 74, 200, 114, F('red'), '#9E2E26', 4) + '<path d="M34 100h200M34 130h200M34 160h200" stroke="#B83A30" stroke-width="2" opacity=".55"/>' +
      poly('22,82 64,30 204,30 246,82', F('woodD'), OUT) + poly('22,82 64,30 204,30 246,82', 'rgba(255,255,255,.06)') +
      rect(112, 42, 44, 34, F('glass'), '#fff', 3) + '<path d="M134 42v34M112 59h44" stroke="#fff" stroke-width="3"/>' +
      rect(100, 112, 68, 76, '#fff', '#9E2E26', 3) + '<path d="M100 112L168 188M168 112L100 188" stroke="#C94B3E" stroke-width="5"/><path d="M134 112v76" stroke="#C94B3E" stroke-width="3"/>' +
      rect(238, 36, 44, 154, F('stone'), '#7E8A9A', 5) + '<path d="M238 70h44M238 104h44M238 138h44" stroke="#9AA6B6" stroke-width="2"/><path d="M234 40q26 -34 52 0z" fill="' + F('roofB') + '" stroke="#2F4AA8" stroke-width="2.4"/>' +
      '<rect x="46" y="150" width="30" height="38" rx="3" fill="#fff" stroke="#9E2E26" stroke-width="2"/><path d="M46 150L76 188M76 150L46 188" stroke="#C94B3E" stroke-width="3"/>');
  };
  ART.cropfield = function (b) {
    var s = '', r, c;
    for (r = 0; r < 4; r++) { s += rect(22, 38 + r * 36, 256, 22, '#8F5F33', '', 8); for (c = 0; c < 9; c++) s += '<g class="sway b" style="transform-origin:' + (38 + c * 28) + 'px ' + (54 + r * 36) + 'px"><path d="M' + (38 + c * 28) + ' ' + (54 + r * 36) + 'q-10 -10 -12 -22q10 4 12 22q2 -18 12 -22q-2 12 -12 22z" fill="' + (r % 2 ? '#52B04A' : '#6CC25A') + '" stroke="#2F7E34" stroke-width="1.4"/></g>'; }
    return T(b.x * 100, b.y * 100, rect(10, 20, 280, 168, '#B27C45', '#7A4F25', 14) + s + '<path d="M10 188h280" stroke="rgba(0,0,0,.18)" stroke-width="5"/>');
  };
  ART.scarecrow = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 94, 24, 6) + '<rect x="46" y="38" width="8" height="56" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><rect x="14" y="48" width="72" height="8" rx="3" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2"/>' +
      '<path d="M30 52h40l6 30H24z" fill="#5E8DE8" stroke="#2F4AA8" stroke-width="2"/><path d="M20 54l-8 14M80 54l8 14M34 82l-2 10M66 82l2 10" stroke="#E8C03A" stroke-width="3" stroke-linecap="round"/>' +
      circ(50, 32, 13, '#F6D9A8', '#B8914F') + circ(45, 30, 2, '#3A2A12') + circ(55, 30, 2, '#3A2A12') + '<path d="M44 38q6 4 12 0" stroke="#B64A3A" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      '<ellipse cx="50" cy="22" rx="24" ry="5" fill="' + F('thatch') + '" stroke="#A8761F" stroke-width="2"/><path d="M36 22q14 -26 28 0z" fill="' + F('thatch') + '" stroke="#A8761F" stroke-width="2"/>');
  };
  ART.haystack = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 36, 8) + '<path d="M12 90q0 -62 38 -66q38 4 38 66z" fill="' + F('thatch') + '" stroke="#A8761F" stroke-width="2.4"/><path d="M22 84q4 -34 14 -50M40 88q2 -40 10 -62M60 88q0 -36 -4 -60M76 84q-2 -30 -14 -48" stroke="#C99A3B" stroke-width="2" fill="none"/><path d="M14 66q36 10 72 0" stroke="#B8832B" stroke-width="3" fill="none"/>');
  };

  /* ───────── vườn anh đào (Nhật) ───────── */
  ART.torii = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 192, 46, 8) + rect(18, 56, 12, 134, F('red'), '#9E2E26', 2) + rect(70, 56, 12, 134, F('red'), '#9E2E26', 2) +
      rect(12, 70, 76, 11, '#3A2A2A', '', 2) + '<path d="M-4 40q54 -22 108 0v16q-54 -18 -108 0z" fill="#3A2A2A" stroke="#1E1414" stroke-width="2"/><path d="M0 46q50 -16 100 0v8q-50 -14 -100 0z" fill="' + F('red') + '"/>' +
      rect(14, 176, 20, 14, '#2E2E2E', '', 3) + rect(66, 176, 20, 14, '#2E2E2E', '', 3));
  };
  ART.pagoda = function (b) {
    var s = '', i, w, y0, cx = 150;
    for (i = 0; i < 4; i++) { w = 190 - i * 36; y0 = 252 - i * 56; s += rect(cx - w / 2 + 12, y0 - 8, w - 24, 38, F('wall'), '#C9A66A', 2) + rect(cx - 9, y0 + 2, 18, 26, F('woodD'), OUT, 2) + poly((cx - w / 2 - 14) + ',' + (y0 - 8) + ' ' + (cx + w / 2 + 14) + ',' + (y0 - 8) + ' ' + (cx + w / 2 - 6) + ',' + (y0 - 36) + ' ' + (cx - w / 2 + 6) + ',' + (y0 - 36), F('roofR'), '#962B25') + '<path d="M' + (cx - w / 2 - 14) + ' ' + (y0 - 8) + 'q-8 -2 -10 -10M' + (cx + w / 2 + 14) + ' ' + (y0 - 8) + 'q8 -2 10 -10" stroke="#962B25" stroke-width="3" fill="none"/>'; }
    return T(b.x * 100, b.y * 100, shadow(150, 292, 110, 10) + rect(40, 270, 220, 20, F('stone'), '#8E98A6', 4) + s + '<rect x="146" y="14" width="8" height="38" fill="' + F('gold') + '"/>' + circ(150, 12, 7, '#FFD23F', '#DDA51A') + circ(150, 30, 4, '#FFD23F'));
  };
  ART.koipond = function (b) {
    var R = rnd(31), s = '', i;
    for (i = 0; i < 14; i++) { var a = i / 14 * 6.283; s += '<ellipse cx="' + (150 + Math.cos(a) * 138).toFixed(0) + '" cy="' + (100 + Math.sin(a) * 80).toFixed(0) + '" rx="' + (9 + R() * 7).toFixed(0) + '" ry="' + (6 + R() * 4).toFixed(0) + '" fill="' + ['#B8BFC9', '#A3ABB6', '#CBD2DA'][i % 3] + '" stroke="rgba(60,70,90,.35)"/>'; }
    var koi = function (x, y, c, rot) { return '<g transform="translate(' + x + ' ' + y + ') rotate(' + rot + ')"><path d="M-14 0q14 -9 28 0q-14 9 -28 0z" fill="' + c + '" stroke="rgba(0,0,0,.2)"/><path d="M-14 0l-9 -6v12z" fill="' + c + '"/><circle cx="8" cy="-1" r="1.6" fill="#222"/><ellipse cx="-2" cy="-2" rx="5" ry="3" fill="#fff" opacity=".7"/></g>'; };
    return T(b.x * 100, b.y * 100, '<ellipse cx="150" cy="104" rx="134" ry="78" fill="url(#zw-water)" stroke="#5B8FB8" stroke-width="3"/>' + s +
      '<ellipse cx="110" cy="84" rx="12" ry="7" fill="#4FAE4A" stroke="#2F7E34"/><ellipse cx="196" cy="124" rx="14" ry="8" fill="#4FAE4A" stroke="#2F7E34"/>' + circ(110, 80, 5, '#FFC2D8') +
      '<g class="duck">' + koi(150, 100, '#FF8A3D', -10) + koi(188, 80, '#fff', 20) + koi(104, 128, '#FFB74D', 170) + '</g>' + '<path d="M96 60q12 -6 24 0" stroke="rgba(255,255,255,.7)" stroke-width="2" fill="none"/>');
  };
  ART.sakuratree = function (b) {
    var R = rnd(7), s = '', i;
    for (i = 0; i < 20; i++) s += circ((100 + (R() - .5) * 150).toFixed(0), (74 + (R() - .5) * 90).toFixed(0), (22 + R() * 16).toFixed(0), ['#FFB7D0', '#FF9FC0', '#FFD3E3', '#FFC2D8'][i % 4]);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 66, 9) + '<path d="M90 190q4 -50 -6 -86l12 -4q14 36 8 90zM98 120q-30 -20 -44 -44l8 -4q18 22 42 36z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/>' + '<g class="sway b" style="transform-origin:100px 150px">' + s + '</g>' +
      scatterPetals(R));
  };
  function scatterPetals(R) { var s = '', i; for (i = 0; i < 9; i++) s += '<ellipse cx="' + (20 + R() * 160).toFixed(0) + '" cy="' + (150 + R() * 40).toFixed(0) + '" rx="5" ry="3" fill="#FFC2D8"/>'; return s; }
  ART.lantern = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 6) + rect(30, 80, 40, 10, '#A9B1BC', '#7E8A9A', 3) + rect(42, 52, 16, 30, '#B8C0CB', '#7E8A9A', 2) + rect(32, 30, 36, 24, '#C9D0D9', '#7E8A9A', 3) + rect(40, 36, 20, 12, '#FFE9A0', '#C99E3A', 2) + '<g class="lampg"><circle cx="50" cy="42" r="16" fill="url(#bg-glow)"/></g>' + poly('24,32 50,10 76,32', '#B8C0CB', '#7E8A9A') + circ(50, 9, 4, '#A9B1BC'));
  };

  /* ───────── rừng thu ───────── */
  ART.mapletree = function (b) {
    var R = rnd(19), s = '', i;
    for (i = 0; i < 22; i++) s += circ((100 + (R() - .5) * 160).toFixed(0), (72 + (R() - .5) * 96).toFixed(0), (20 + R() * 17).toFixed(0), ['#E2531F', '#F29A2E', '#C4321C', '#F2C13E', '#D9731F'][i % 5]);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 70, 9, 'rgba(70,40,10,.3)') + '<path d="M92 190q2 -54 -4 -90h24q-6 36 -2 90z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><g class="sway b" style="transform-origin:100px 150px">' + s + '</g><path d="M30 186l8 -6M160 190l10 -7M70 194l6 -5" stroke="#C4321C" stroke-width="5" stroke-linecap="round"/>');
  };
  ART.leafpile = function (b) {
    var R = rnd(23), s = '', i;
    for (i = 0; i < 26; i++) s += '<ellipse cx="' + (50 + (R() - .5) * 64).toFixed(0) + '" cy="' + (66 + (R() - .5) * 30 - (i % 5) * 3).toFixed(0) + '" rx="' + (9 + R() * 6).toFixed(0) + '" ry="' + (5 + R() * 3).toFixed(0) + '" transform="rotate(' + (R() * 180).toFixed(0) + ' 50 66)" fill="' + ['#E2531F', '#F29A2E', '#C4321C', '#F2C13E'][i % 4] + '" stroke="rgba(90,40,10,.3)"/>';
    return T(b.x * 100, b.y * 100, shadow(50, 88, 38, 7, 'rgba(70,40,10,.3)') + s);
  };
  ART.pumpkinpatch = function (b) {
    var P = function (x, y, r) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + r + '" ry="' + (r * .8) + '" fill="#F28A24" stroke="#B4560F" stroke-width="2"/><path d="M' + (x - r * .45) + ' ' + (y - r * .6) + 'q-' + (r * .35) + ' ' + (r * .6) + ' 0 ' + (r * 1.2) + 'M' + (x + r * .45) + ' ' + (y - r * .6) + 'q' + (r * .35) + ' ' + (r * .6) + ' 0 ' + (r * 1.2) + '" stroke="#C8650F" stroke-width="2" fill="none"/><rect x="' + (x - 3) + '" y="' + (y - r * .95) + '" width="6" height="9" rx="2" fill="#5E8F3A"/>'; };
    return T(b.x * 100, b.y * 100, shadow(100, 188, 90, 9, 'rgba(70,40,10,.3)') + '<path d="M20 130q40 -30 70 0t90 -6" stroke="#5E8F3A" stroke-width="4" fill="none"/>' + P(56, 140, 28) + P(140, 120, 24) + P(104, 168, 22) + P(160, 164, 18) + P(34, 78, 16) + '<path d="M44 150q6 -10 14 -8M146 128q8 -10 16 -6" stroke="#6BAA3E" stroke-width="3" fill="none"/>');
  };

  /* ───────── núi non ───────── */
  ART.peak = function (b) {
    return T(b.x * 100, b.y * 100, shadow(200, 294, 190, 10) + poly('0,290 120,110 200,200 290,60 400,290', F('stone'), '#5F6B7A') + poly('290,60 250,130 280,116 300,150 330,120 350,150', F('snow'), '#B7CBE0') + poly('120,110 92,158 118,146 138,170 156,140', F('snow'), '#B7CBE0') +
      '<path d="M290 60L330 290M120 110L170 290M200 200L240 290" stroke="rgba(60,70,90,.22)" stroke-width="10"/>' + poly('0,290 80,230 150,290', '#6AA45A', '#3E7A3A') + poly('300,290 350,236 400,290', '#6AA45A', '#3E7A3A') + '<g class="sway b" style="transform-origin:290px 40px"><rect x="288" y="20" width="3" height="40" fill="#8A5A2E"/><path d="M291 22h28l-8 8l8 8h-28z" fill="#E24D4D"/></g>');
  };
  ART.flagpole = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 7) + '<ellipse cx="50" cy="86" rx="26" ry="10" fill="' + F('stone') + '" stroke="#7E8A9A" stroke-width="2"/><rect x="48" y="14" width="4" height="72" fill="#8A5A2E"/><g class="sway b" style="transform-origin:52px 20px"><path d="M52 16h36l-10 10l10 10H52z" fill="#E24D4D" stroke="#9E2E26" stroke-width="2"/></g>');
  };
  ART.waterfall = function (b) {
    return T(b.x * 100, b.y * 100, shadow(100, 192, 92, 8) + poly('10,190 16,30 60,10 150,16 192,40 190,190', F('stone'), '#5F6B7A') + '<path d="M70 12h60l8 150H62z" fill="#BDE8FF" stroke="#7CBFE6" stroke-width="2"/><path d="M82 16v140M100 14v146M118 16v140" stroke="#fff" stroke-width="4" opacity=".85"/>' +
      '<ellipse cx="100" cy="170" rx="66" ry="20" fill="url(#zw-water)" stroke="#5B8FB8" stroke-width="3"/><ellipse cx="100" cy="164" rx="40" ry="9" fill="#fff" opacity=".7"/>' + '<path d="M30 60q-8 20 0 40M168 80q8 20 0 40" stroke="rgba(60,70,90,.3)" stroke-width="6" stroke-linecap="round"/>');
  };

  /* ───────── sa mạc ───────── */
  ART.pyramid = function (b) {
    var s = '', i; for (i = 1; i < 5; i++) s += '<path d="M' + (150 - 128 + i * 24) + ' ' + (178 - i * 28) + 'h' + (256 - i * 48) + '" stroke="rgba(150,100,30,.45)" stroke-width="2.4"/>';
    return T(b.x * 100, b.y * 100, shadow(150, 190, 138, 10, 'rgba(120,80,20,.3)') + poly('18,184 150,28 282,184', F('sand'), '#B8872F') + poly('150,28 282,184 190,184', 'rgba(190,130,40,.45)') + s + rect(130, 150, 40, 34, '#6B4A22', '', 3) + poly('18,184 282,184 262,194 40,194', '#EBD19A', '#B8872F'));
  };
  ART.cactus = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 22, 6, 'rgba(120,80,20,.3)') + '<rect x="38" y="20" width="24" height="72" rx="12" fill="#4FA85A" stroke="#2F7A3A" stroke-width="2"/><path d="M38 60h-10a8 8 0 0 1 -8 -8v-14a7 7 0 0 1 14 0v10h4z" fill="#4FA85A" stroke="#2F7A3A" stroke-width="2"/><path d="M62 52h10a8 8 0 0 0 8 -8v-14a7 7 0 0 0 -14 0v10h-4z" fill="#4FA85A" stroke="#2F7A3A" stroke-width="2"/><path d="M50 26v62M44 30v56M56 30v56" stroke="#2F7A3A" stroke-width="1.5" opacity=".5"/>' + circ(50, 18, 6, '#FF7AA8', '#C94B7B'));
  };
  ART.tent = function (b) {
    var s = '', i; for (i = 0; i < 4; i++) s += poly((100 + (i - 2) * 38) + ',24 ' + (100 + (i - 2) * 38 + 38) + ',24 ' + (100 + (i - 1) * 56 + 18) + ',186 ' + (100 + (i - 2) * 56 + 18) + ',186', i % 2 ? '#fff' : '#E24D4D');
    return T(b.x * 100, b.y * 100, shadow(100, 190, 90, 9, 'rgba(120,80,20,.3)') + poly('100,20 184,188 16,188', '#E24D4D', '#9E2E26') + poly('100,20 140,188 60,188', '#fff', '#C9D0D9') + poly('100,20 184,188 150,188', 'rgba(0,0,0,.12)') + poly('100,96 128,188 72,188', '#3A2A1C') + '<path d="M100 20v-12" stroke="#8A5A2E" stroke-width="4"/><path d="M100 8l22 6l-22 6z" fill="#FFD23F"/>');
  };
  ART.oasis = function (b) {
    return T(b.x * 100, b.y * 100, '<ellipse cx="150" cy="112" rx="136" ry="76" fill="#CFE99A" opacity=".55"/><ellipse cx="150" cy="116" rx="104" ry="54" fill="url(#zw-water)" stroke="#5B8FB8" stroke-width="3"/><path d="M96 106q20 -8 40 0M168 126q18 -8 36 0" stroke="rgba(255,255,255,.7)" stroke-width="2.4" fill="none"/>' +
      '<g class="sway b" style="transform-origin:60px 100px"><path d="M56 110q-6 -34 4 -66q6 30 4 66z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><path d="M60 44q-30 -16 -38 6q20 -12 38 -6zM60 44q30 -16 38 6q-20 -12 -38 -6zM60 44q-4 -24 -22 -24q12 6 22 24zM60 44q4 -24 22 -24q-12 6 -22 24z" fill="#5DBE55" stroke="#2F7E34" stroke-width="2"/></g>' +
      '<g class="sway b" style="transform-origin:244px 120px"><path d="M240 120q-5 -28 3 -54q6 26 4 54z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><path d="M243 66q-26 -14 -32 4q16 -10 32 -4zM243 66q26 -14 32 4q-16 -10 -32 -4zM243 66q-3 -20 -18 -20q10 5 18 20z" fill="#5DBE55" stroke="#2F7E34" stroke-width="2"/></g>' + '<path d="M170 168q-4 -22 0 -30M178 170q4 -18 8 -26" stroke="#4E8A3A" stroke-width="4" stroke-linecap="round"/>');
  };

  /* ───────── xứ sở kẹo ngọt ───────── */
  ART.candyhouse = function (b) {
    var s = '', i; for (i = 0; i < 7; i++) s += circ(34 + i * 38, 58 + (i % 2) * 6, 10, ['#FF6B9A', '#FFD23F', '#6BC8FF', '#8BE28A'][i % 4]);
    return T(b.x * 100, b.y * 100, shadow(150, 192, 132, 10, 'rgba(160,60,100,.25)') + rect(28, 84, 244, 104, '#C98A52', '#8A5A2E', 6) + '<path d="M28 108h244M28 134h244M28 160h244" stroke="#A8693A" stroke-width="2" opacity=".5"/>' +
      poly('14,92 150,18 286,92', '#FF9EC4', '#C94B7B') + '<path d="M14 92q14 14 28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t28 0t14 0" fill="#fff" stroke="#E7C3D3" stroke-width="2"/>' + s +
      rect(124, 124, 52, 64, '#8A5A2E', '#5E3A1C', 24) + circ(168, 158, 4, '#FFD23F') + rect(48, 112, 40, 36, '#FFF3D6', '#C98A52', 4) + '<path d="M68 112v36M48 130h40" stroke="#E7C3D3" stroke-width="3"/>' + rect(212, 112, 40, 36, '#FFF3D6', '#C98A52', 4) + '<path d="M232 112v36M212 130h40" stroke="#E7C3D3" stroke-width="3"/>' +
      '<path d="M24 188V120q0 -14 10 -14" stroke="#fff" stroke-width="9" fill="none" stroke-linecap="round"/><path d="M24 180l0 -12M24 156v-12M24 132v-10" stroke="#E24D4D" stroke-width="9" stroke-linecap="butt"/>');
  };
  ART.lollipop = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 20, 5, 'rgba(160,60,100,.25)') + rect(47, 40, 6, 52, '#fff', '#D8DEE6', 2) + '<g class="sway b" style="transform-origin:50px 90px">' + circ(50, 34, 24, '#FF6B9A', '#C94B7B') + '<path d="M50 34m0 0a4 4 0 0 1 8 0a9 9 0 0 1 -17 0a15 15 0 0 1 30 0a21 21 0 0 1 -42 0" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/><ellipse cx="40" cy="24" rx="6" ry="4" fill="#fff" opacity=".6"/></g>');
  };
  ART.chocoriver = function (b) {
    return T(b.x * 100, b.y * 100, '<path d="M0 30q50 -22 100 0t100 0t100 0t100 0t100 0v58q-50 22 -100 0t-100 0t-100 0t-100 0t-100 0z" fill="#7A4A2A" stroke="#4E2E18" stroke-width="3"/><path d="M10 52q40 -14 80 0t80 0t80 0t80 0t80 0" stroke="#A8704A" stroke-width="5" fill="none" stroke-linecap="round" opacity=".8"/><path d="M30 70q40 -10 80 0t80 0t80 0" stroke="#5E361E" stroke-width="4" fill="none" opacity=".6"/>' + circ(130, 40, 5, '#C98A52') + circ(330, 66, 6, '#C98A52') + circ(420, 44, 4, '#A8704A'));
  };
  ART.cupcake = function (b) {
    return T(b.x * 100, b.y * 100, shadow(100, 192, 66, 8, 'rgba(160,60,100,.25)') + '<path d="M44 118h112l-14 70H58z" fill="#FFD98A" stroke="#C99A3B" stroke-width="2.4"/><path d="M70 118l6 70M100 118v70M130 118l-6 70" stroke="#E0B24E" stroke-width="3"/>' + '<path d="M36 120q4 -26 30 -30q-8 -22 24 -34q-2 -14 20 -18q22 4 20 18q32 12 24 34q26 4 30 30q-30 14 -64 6q-34 8 -84 -6z" fill="#FF9EC4" stroke="#C94B7B" stroke-width="2.4"/><path d="M60 100q20 -6 40 -4M80 80q20 -8 44 -2" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/>' + circ(100, 36, 10, '#E24D4D', '#9E2E26') + '<path d="M100 28q4 -14 14 -16" stroke="#5E8F3A" stroke-width="3" fill="none"/>' + '<rect x="70" y="84" width="8" height="3.6" rx="1.8" fill="#6BC8FF"/><rect x="120" y="96" width="8" height="3.6" rx="1.8" fill="#FFD23F"/><rect x="92" y="60" width="8" height="3.6" rx="1.8" fill="#8BE28A"/>');
  };

  /* ───────── đại dương ───────── */
  ART.coralreef = function (b) {
    var C = function (x, y, c, h) { return '<g class="sway b" style="transform-origin:' + x + 'px ' + y + 'px"><path d="M' + x + ' ' + y + 'v-' + h + 'M' + x + ' ' + (y - h * .5) + 'l-14 -' + (h * .35) + 'M' + x + ' ' + (y - h * .6) + 'l14 -' + (h * .3) + 'M' + x + ' ' + (y - h * .85) + 'l-8 -' + (h * .2) + '" stroke="' + c + '" stroke-width="9" stroke-linecap="round" fill="none"/></g>'; };
    return T(b.x * 100, b.y * 100, shadow(150, 190, 128, 10, 'rgba(10,50,100,.35)') + '<ellipse cx="150" cy="176" rx="130" ry="24" fill="#E8D49A" stroke="#C9B069" stroke-width="2"/>' + C(60, 176, '#FF7A9A', 90) + C(100, 180, '#FFB04A', 70) + C(150, 182, '#B48CFF', 110) + C(200, 180, '#FF7A9A', 80) + C(244, 176, '#FFB04A', 96) +
      '<ellipse cx="124" cy="164" rx="22" ry="14" fill="#FF8A6A" stroke="#C9553A" stroke-width="2"/><path d="M110 164h28M116 156h16M116 172h16" stroke="#FFC4A8" stroke-width="2"/>' + '<path d="M170 168l8 -14l8 14l-14 0z" fill="#FFD23F" stroke="#C99E3A"/>');
  };
  ART.seaweed = function (b) {
    var s = '', i; for (i = 0; i < 4; i++) s += '<g class="sway b" style="transform-origin:' + (24 + i * 18) + 'px 192px"><path d="M' + (24 + i * 18) + ' 192q-14 -30 0 -60t0 -60q-8 -20 2 -40" stroke="' + ['#3FAE5A', '#2F9A4E', '#52C26A', '#2E8A46'][i] + '" stroke-width="9" fill="none" stroke-linecap="round"/></g>';
    return T(b.x * 100, b.y * 100, s);
  };
  ART.treasure = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 34, 7, 'rgba(10,50,100,.35)') + '<ellipse cx="38" cy="82" rx="7" ry="4" fill="#FFD23F" stroke="#C99E3A"/><ellipse cx="68" cy="84" rx="7" ry="4" fill="#FFD23F" stroke="#C99E3A"/>' + rect(20, 52, 60, 34, F('woodD'), OUT, 4) + '<path d="M20 60q30 -34 60 0z" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.4"/><path d="M20 66h60" stroke="#C99E3A" stroke-width="4"/>' + rect(44, 62, 12, 14, F('gold'), '#C99E3A', 2) + '<g class="spk"><circle cx="50" cy="40" r="3" fill="#fff"/></g>' + '<path d="M26 56l-4 -8M74 56l4 -8" stroke="#FFE9A0" stroke-width="3" stroke-linecap="round"/>');
  };
  ART.shipwreck = function (b) {
    return T(b.x * 100, b.y * 100, shadow(150, 192, 126, 9, 'rgba(10,50,100,.35)') + '<g transform="rotate(-12 150 120)"><path d="M26 120h248q-10 54 -52 70H78q-42 -16 -52 -70z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="3"/><path d="M40 140h220M52 160h196" stroke="#6B4121" stroke-width="2" opacity=".6"/>' + circ(110, 142, 9, '#BDE8FF', '#C99E3A') + circ(160, 146, 9, '#BDE8FF', '#C99E3A') + circ(210, 142, 9, '#BDE8FF', '#C99E3A') + '<rect x="146" y="18" width="8" height="106" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2"/><path d="M154 28q40 20 30 66h-30z" fill="#F4ECD8" stroke="#BFB394" stroke-width="2" opacity=".85"/><path d="M146 40q-34 14 -26 50h26z" fill="#F4ECD8" stroke="#BFB394" stroke-width="2" opacity=".7"/></g>' + '<g class="sway b" style="transform-origin:60px 190px"><path d="M60 190q-6 -30 4 -50" stroke="#52C26A" stroke-width="7" fill="none" stroke-linecap="round"/></g>');
  };

  /* ───────── thiên đường mây ───────── */
  ART.rainbow = function (b) {
    var cols = ['#FF5E5E', '#FF9F4A', '#FFE14D', '#6BD16B', '#4FB4FF', '#5B6BFF', '#A66BFF'], s = '', i;
    for (i = 0; i < 7; i++) s += '<path d="M' + (212 + i * 9) + ' 196 A' + (236 - i * 9) + ' ' + (150 - i * 9) + ' 0 0 1 ' + (688 - i * 9) + ' 196" stroke="' + cols[i] + '" stroke-width="10" fill="none" opacity=".9"/>';
    return '<g opacity=".9">' + s + '</g>';
  };
  ART.cloudcastle = function (b) {
    var tower = function (x, y, w, h, roof) { return rect(x, y, w, h, F('white'), '#B7C4D4', 3) + poly((x - 6) + ',' + y + ' ' + (x + w / 2) + ',' + (y - 40) + ' ' + (x + w + 6) + ',' + y, F(roof), '#3C58C4') + rect(x + w / 2 - 6, y + 16, 12, 18, F('glass'), '#7CBFE6', 6) + '<path d="M' + (x + w / 2) + ' ' + (y - 40) + 'v-16" stroke="#8A5A2E" stroke-width="3"/><path d="M' + (x + w / 2) + ' ' + (y - 56) + 'h18l-6 7l6 7h-18z" fill="#FFD23F"/>'; };
    return T(b.x * 100, b.y * 100, '<g fill="#fff" stroke="#CFE0F2" stroke-width="2"><ellipse cx="150" cy="258" rx="140" ry="34"/><ellipse cx="70" cy="244" rx="56" ry="30"/><ellipse cx="232" cy="246" rx="58" ry="30"/><ellipse cx="150" cy="232" rx="70" ry="28"/></g>' + tower(30, 130, 44, 100, 'roofB') + tower(226, 130, 44, 100, 'roofB') + tower(116, 90, 68, 140, 'roofR') + rect(74, 180, 44, 50, F('white'), '#B7C4D4', 3) + rect(184, 180, 44, 50, F('white'), '#B7C4D4', 3) + rect(134, 186, 32, 44, F('woodD'), OUT, 16) +
      '<g class="float1"><path d="M10 40q20 -22 40 0q22 -12 34 6q-34 12 -74 -6z" fill="#fff" opacity=".9"/></g>');
  };
  ART.balloon = function (b) {
    var stripes = ''; ['#FF5E5E', '#fff', '#FFC93F', '#fff', '#4FB4FF'].forEach(function (c, i) { stripes += '<path d="M' + (50 + (i - 2) * 12) + ' 18q-' + (30 - Math.abs(i - 2) * 6) + ' 60 0 98" stroke="' + c + '" stroke-width="12" fill="none" opacity=".95"/>'; });
    return T(b.x * 100, b.y * 100, '<g class="float2">' + circ(50, 62, 42, '#FF8D7C', '#C94B3E') + '<path d="M50 20q-40 40 0 90q40 -50 0 -90z" fill="#FFF3D6" opacity=".35"/>' + stripes + '<path d="M26 102L40 150M74 102L60 150M50 106V150" stroke="#8A5A2E" stroke-width="2"/>' + rect(36, 148, 28, 22, F('woodD'), OUT, 3) + '</g>');
  };

  /* ───────── trạm vũ trụ ───────── */
  ART.rocket = function (b) {
    return T(b.x * 100, b.y * 100, shadow(100, 292, 70, 9, 'rgba(0,0,0,.4)') + '<g class="float1"><path d="M100 12q46 50 40 150h-80q-6 -100 40 -150z" fill="#F6F8FC" stroke="#9FB0C6" stroke-width="3"/><path d="M100 12q-18 22 -28 54h56q-10 -32 -28 -54z" fill="#E24D4D" stroke="#9E2E26" stroke-width="2.4"/>' + circ(100, 98, 20, '#BDE8FF', '#6A86A8') + circ(100, 98, 12, '#7CC4F0') + '<ellipse cx="94" cy="92" rx="5" ry="3" fill="#fff" opacity=".8"/>' + poly('60,130 34,176 62,166', '#E24D4D', '#9E2E26') + poly('140,130 166,176 138,166', '#E24D4D', '#9E2E26') + rect(86, 160, 28, 14, '#8A97A8', '#5F6B7A', 3) + '<path d="M90 174q10 50 20 0z" fill="#FFB63A"/><path d="M94 174q6 30 12 0z" fill="#FFF3A0"/></g>' + rect(40, 276, 120, 14, '#6A7688', '#3E4858', 3) + rect(92, 240, 16, 38, '#7A8698', '#3E4858', 2));
  };
  ART.moonbase = function (b) {
    return T(b.x * 100, b.y * 100, shadow(150, 190, 134, 9, 'rgba(0,0,0,.4)') + '<path d="M20 186a60 60 0 0 1 120 0z" fill="#CFE6F4" stroke="#8AA6BC" stroke-width="3" opacity=".95"/><path d="M40 186a40 40 0 0 1 80 0" stroke="#fff" stroke-width="3" fill="none" opacity=".7"/>' + rect(140, 130, 70, 56, '#C9D2DE', '#7E8A9A', 6) + rect(150, 144, 18, 14, '#FFE9A0', '#C99E3A', 2) + rect(176, 144, 18, 14, '#FFE9A0', '#C99E3A', 2) + rect(214, 150, 66, 36, '#B8C3D2', '#7E8A9A', 6) +
      '<rect x="236" y="60" width="6" height="94" fill="#8A97A8"/>' + circ(239, 56, 7, '#E24D4D') + '<path d="M222 70q17 -18 34 0" stroke="#8A97A8" stroke-width="3" fill="none"/>' + rect(56, 150, 18, 36, '#8A97A8', '#5E6A7A', 2) + '<g class="spk"><circle cx="239" cy="56" r="10" fill="#FF8D7C" opacity=".4"/></g>');
  };
  ART.satellite = function (b) {
    return T(b.x * 100, b.y * 100, '<g class="float1"><rect x="40" y="38" width="20" height="26" rx="3" fill="' + F('gold') + '" stroke="#C99E3A" stroke-width="2"/><rect x="6" y="42" width="30" height="18" fill="#3C58C4" stroke="#1F2F8A" stroke-width="2"/><path d="M16 42v18M26 42v18" stroke="#8FB0FF" stroke-width="1.5"/><rect x="64" y="42" width="30" height="18" fill="#3C58C4" stroke="#1F2F8A" stroke-width="2"/><path d="M74 42v18M84 42v18" stroke="#8FB0FF" stroke-width="1.5"/><path d="M50 38v-10" stroke="#C9D2DE" stroke-width="3"/><path d="M40 24q10 -10 20 0" stroke="#C9D2DE" stroke-width="3" fill="none"/>' + circ(50, 24, 3, '#FF5E5E') + '</g>');
  };
  ART.crater = function (b) {
    return T(b.x * 100, b.y * 100, '<ellipse cx="100" cy="112" rx="92" ry="66" fill="#9AA3B2" stroke="#6A7384" stroke-width="3"/><ellipse cx="100" cy="120" rx="68" ry="44" fill="#7A8394"/><ellipse cx="100" cy="126" rx="48" ry="28" fill="#646D7E"/><path d="M40 88q20 -20 50 -22" stroke="rgba(255,255,255,.45)" stroke-width="5" fill="none" stroke-linecap="round"/>' + circ(150, 74, 9, '#AAB3C2', '#6A7384') + circ(46, 150, 7, '#AAB3C2', '#6A7384') + circ(170, 150, 5, '#AAB3C2', '#6A7384'));
  };

  /* ───────── công trình lớn dành cho các khu mới (đặt trong cửa hàng "Công trình") ───────── */
  var BIG = API.BIG, BIGSIZE = API.BIGSIZE;
  BIG.barnbig = function () { return ART.barn({ x: 0, y: 0 }); };
  BIGSIZE.barnbig = [3, 2];
  BIG.pyramidbig = function () { return ART.pyramid({ x: 0, y: 0 }) + T(204, 96, '<g transform="scale(.7)">' + ART.cactus({ x: 0, y: 0 }) + '</g>'); };
  BIGSIZE.pyramidbig = [3, 2];
  BIG.teahouse = function () {
    return shadow(100, 188, 92, 9) + rect(24, 124, 152, 62, F('wall'), '#C9A66A', 3) + rect(24, 170, 152, 16, F('woodD'), OUT, 2) +
      [0, 1, 2].map(function (i) { return rect(36 + i * 48, 134, 40, 36, '#FFF8E0', OUT, 2) + '<path d="M' + (56 + i * 48) + ' 134v36M36 ' + (152) + 'h' + 0 + '" stroke="' + OUT + '" stroke-width="1.6"/><path d="M' + (46 + i * 48) + ' 134v36M' + (66 + i * 48) + ' 134v36" stroke="#D8C28A" stroke-width="1"/>'; }).join('') +
      '<path d="M2 128 Q100 66 198 128 L186 132 Q100 84 14 132Z" fill="#4A4F5C" stroke="#2A2E38" stroke-width="3"/><path d="M12 124 Q100 62 188 124" fill="none" stroke="#6A7080" stroke-width="3"/><path d="M30 104 Q100 44 170 104 L160 110 Q100 62 40 110Z" fill="#5A6070" stroke="#2A2E38" stroke-width="3"/>' +
      '<path d="M2 128 Q-4 128 -6 120M198 128 Q204 128 206 120" stroke="#2A2E38" stroke-width="3" fill="none"/>' + rect(8, 150, 8, 36, F('red'), '#9E2E26', 2) + rect(184, 150, 8, 36, F('red'), '#9E2E26', 2) + '<g class="lampg"><circle cx="100" cy="116" r="12" fill="url(#bg-glow)"/></g>' + circ(100, 118, 6, '#FFE9A0', '#C99E3A');
  };
  BIGSIZE.teahouse = [2, 2];
  BIG.treehouse = function () {
    var s = '', i, R2 = rnd(5);
    for (i = 0; i < 12; i++) s += circ((100 + (R2() - .5) * 150).toFixed(0), (50 + (R2() - .5) * 70).toFixed(0), (22 + R2() * 14).toFixed(0), ['#3FAE4A', '#52C26A', '#2F9A4E'][i % 3]);
    return shadow(100, 192, 70, 9) + '<path d="M84 190 Q88 130 80 90 H120 Q112 130 118 190Z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="3"/><path d="M92 170h16M90 140h20M92 110h18" stroke="#6B4121" stroke-width="2" opacity=".6"/>' + s +
      rect(52, 78, 96, 56, F('wood'), OUT, 4) + '<path d="M52 98h96M52 116h96" stroke="#8F5A2B" stroke-width="2"/>' + poly('44,82 100,40 156,82', F('roofR'), '#962B25') + rect(86, 96, 28, 38, F('woodD'), OUT, 14) + rect(60, 92, 20, 18, F('glass'), OUT, 2) + rect(120, 92, 20, 18, F('glass'), OUT, 2) + rect(44, 134, 112, 8, F('woodD'), OUT, 2) +
      '<path d="M70 142 V186 M78 142 V186 M70 152h8M70 164h8M70 176h8" stroke="#C9A66A" stroke-width="3"/><g class="sway b" style="transform-origin:160px 60px"><path d="M148 50 q24 -20 36 4" stroke="#fff" stroke-width="0"/>' + circ(166, 56, 14, '#3FAE4A') + '</g>';
  };
  BIGSIZE.treehouse = [2, 2];
  BIG.gingerbread = function () {
    var s = '', i; for (i = 0; i < 5; i++) s += circ(34 + i * 34, 70 + (i % 2) * 6, 9, ['#FF6B9A', '#FFD23F', '#6BC8FF', '#8BE28A', '#B48CFF'][i]);
    return shadow(100, 190, 86, 9, 'rgba(160,60,100,.25)') + rect(24, 92, 152, 96, '#C98A52', '#8A5A2E', 6) + '<path d="M24 118h152M24 144h152M24 168h152" stroke="#A8693A" stroke-width="2" opacity=".5"/>' + poly('10,98 100,24 190,98', '#FF9EC4', '#C94B7B') +
      '<path d="M10 98q12 14 24 0t24 0t24 0t24 0t24 0t24 0t24 0t12 0" fill="#fff" stroke="#E7C3D3" stroke-width="2"/>' + s + rect(76, 130, 48, 58, '#8A5A2E', '#5E3A1C', 22) + circ(114, 160, 4, '#FFD23F') + rect(36, 112, 30, 28, '#FFF3D6', '#C98A52', 4) + '<path d="M51 112v28M36 126h30" stroke="#E7C3D3" stroke-width="3"/>' + rect(134, 112, 30, 28, '#FFF3D6', '#C98A52', 4) + '<path d="M149 112v28M134 126h30" stroke="#E7C3D3" stroke-width="3"/>' + circ(100, 64, 7, '#FFD23F', '#C99E3A');
  };
  BIGSIZE.gingerbread = [2, 2];
  BIG.submarine = function () {
    return '<ellipse cx="150" cy="96" rx="130" ry="6" fill="rgba(10,50,100,.3)"/><g class="float1"><path d="M24 62 Q24 30 80 28 H230 Q286 30 286 62 Q286 90 230 94 H80 Q24 92 24 62Z" fill="#FFD23F" stroke="#C99E3A" stroke-width="3"/><path d="M40 52 Q60 38 120 38 H210" fill="none" stroke="#FFF3A0" stroke-width="4" opacity=".8"/>' + rect(120, 8, 50, 28, '#F2C21E', '#C99E3A', 6) + rect(140, -8, 6, 20, '#8A97A8') + rect(140, -10, 20, 6, '#8A97A8', '', 2) +
      [0, 1, 2, 3].map(function (i) { return circ(86 + i * 40, 62, 11, '#BDE8FF', '#7E8A9A') + circ(83 + i * 40, 58, 3, '#fff'); }).join('') + '<path d="M286 62 L300 44 L300 80Z" fill="#E5484D" stroke="#9E2E26" stroke-width="2"/><path d="M24 62 L8 52 V72Z" fill="#8A97A8"/><path d="M40 94 Q60 108 80 94" fill="#8A97A8"/></g>' + circ(12, 40, 4, 'none', '#fff') + circ(20, 24, 3, 'none', '#fff') + '<g fill="none" stroke="rgba(255,255,255,.8)" stroke-width="2"><circle cx="304" cy="30" r="4"/><circle cx="296" cy="14" r="3"/></g>';
  };
  BIGSIZE.submarine = [3, 1];
  BIG.cloudhouse = function () {
    return '<g fill="#fff" stroke="#CFE0F2" stroke-width="2"><ellipse cx="100" cy="164" rx="94" ry="26"/><ellipse cx="46" cy="156" rx="40" ry="24"/><ellipse cx="152" cy="156" rx="42" ry="24"/><ellipse cx="100" cy="148" rx="52" ry="22"/></g><g class="float2">' + rect(58, 80, 84, 62, F('wall'), '#C9A66A', 4) + poly('48,86 100,34 152,86', F('roofB'), '#3C58C4') + '<path d="M60 78 Q100 24 140 78" fill="none" stroke="#FF8D7C" stroke-width="4" opacity=".0"/>' + rect(88, 102, 24, 40, F('woodD'), OUT, 12) + rect(64, 96, 18, 18, F('glass'), OUT, 2) + rect(118, 96, 18, 18, F('glass'), OUT, 2) + '<path d="M100 34v-16" stroke="#8A5A2E" stroke-width="3"/><path d="M100 18h18l-6 6l6 6h-18z" fill="#FFD23F"/></g>';
  };
  BIGSIZE.cloudhouse = [2, 2];
  BIG.rocketbig = function () {
    return shadow(50, 192, 40, 7, 'rgba(0,0,0,.35)') + '<g class="float1"><path d="M50 8 Q80 44 74 128 H26 Q20 44 50 8Z" fill="#F6F8FC" stroke="#9FB0C6" stroke-width="3"/><path d="M50 8 Q36 24 30 48 H70 Q64 24 50 8Z" fill="#E24D4D" stroke="#9E2E26" stroke-width="2.4"/>' + circ(50, 76, 13, '#BDE8FF', '#6A86A8') + circ(50, 76, 8, '#7CC4F0') + poly('26,100 8,140 28,132', '#E24D4D', '#9E2E26') + poly('74,100 92,140 72,132', '#E24D4D', '#9E2E26') + rect(40, 126, 20, 10, '#8A97A8', '#5F6B7A', 3) + '<path d="M42 136 Q50 176 58 136Z" fill="#FFB63A"/><path d="M46 136 Q50 160 54 136Z" fill="#FFF3A0"/></g>' + rect(14, 180, 72, 10, '#6A7688', '#3E4858', 3);
  };
  BIGSIZE.rocketbig = [1, 2];
  BIG.observatory = function () {
    return shadow(100, 190, 90, 9, 'rgba(0,0,0,.3)') + rect(30, 100, 140, 86, F('white'), '#9FB0C6', 4) + '<path d="M30 100a70 62 0 0 1 140 0z" fill="' + F('stone') + '" stroke="#7E8A9A" stroke-width="3"/><path d="M92 40 L108 40 L112 100 H88Z" fill="#2B3C66" stroke="#7E8A9A" stroke-width="2"/><g transform="rotate(-32 100 70)"><rect x="86" y="44" width="30" height="64" rx="6" fill="#C9D2DE" stroke="#7E8A9A" stroke-width="2.4"/><rect x="82" y="40" width="38" height="8" rx="3" fill="#8A97A8"/></g>' +
      rect(84, 130, 32, 56, F('woodD'), OUT, 14) + rect(40, 118, 26, 22, '#BDE8FF', '#6A86A8', 3) + rect(134, 118, 26, 22, '#BDE8FF', '#6A86A8', 3) + circ(60, 128, 2, '#fff') + '<g class="spk"><circle cx="160" cy="34" r="3" fill="#FFF3A0"/></g>';
  };
  BIGSIZE.observatory = [2, 2];

  /* ───────── cảnh phụ rải trên đất mở rộng (xem genDecor trong garden-data.js) ───────── */
  var DTH = {
    default: { leaf: ['#4FAE4A', '#3C9440', '#7FD36B'], bush: ['#3C9440', '#4FAE4A'], rock: ['#9AA3AE', '#B9C1CB'], post: '#E8D4B0', rail: '#C98A4B' },
    autumn: { leaf: ['#E2531F', '#F29A2E', '#C4321C'], bush: ['#C4321C', '#E2531F'], rock: ['#A89A86', '#C4B8A4'], post: '#C98A4B', rail: '#8A5A2E' },
    sakura: { leaf: ['#FFB7D0', '#FF9FC0', '#FFD3E3'], bush: ['#E88FB0', '#FFB7D0'], rock: ['#A9B1BC', '#C9D0D9'], post: '#E24D4D', rail: '#B83A30' },
    mountain: { leaf: ['#2F7A4A', '#3D8F58', '#58A870'], bush: ['#4A8A5A', '#6AA46E'], rock: ['#8A929C', '#AAB2BC'], post: '#C9A66A', rail: '#8A5A2E' },
    winter: { leaf: ['#E8F2FA', '#CFE1F3', '#fff'], bush: ['#D8E8F6', '#fff'], rock: ['#B8C6D6', '#EAF2FA'], post: '#F5F9FF', rail: '#C9D8E8' },
    beach: { leaf: ['#5DBE55', '#3FAE4A', '#7FD36B'], bush: ['#4FAE4A', '#7FD36B'], rock: ['#D9C49A', '#EAD8B2'], post: '#F0DCB0', rail: '#C99E5A' },
    desert: { leaf: ['#7FA66A', '#6B9A5A', '#9AC07A'], bush: ['#9AA86A', '#B8C07A'], rock: ['#C9A66A', '#E0C28A'], post: '#E0C28A', rail: '#B8873A' },
    candy: { leaf: ['#FF9EC4', '#FF6B9A', '#FFD3E3'], bush: ['#FF8FB8', '#FFB3D0'], rock: ['#FFC4D8', '#fff'], post: '#fff', rail: '#FF6B9A' },
    ocean: { leaf: ['#3FAE5A', '#2F9A4E', '#52C26A'], bush: ['#2F9A4E', '#52C26A'], rock: ['#7A98B8', '#9DB8D0'], post: '#E8D4B0', rail: '#B8A070' },
    sky: { leaf: ['#fff', '#E9F3FF', '#CFE0F2'], bush: ['#E9F3FF', '#fff'], rock: ['#DCE8F5', '#fff'], post: '#fff', rail: '#CFE0F2' },
    space: { leaf: ['#8E5CF0', '#B48CFF', '#6A4CC0'], bush: ['#6A4CC0', '#8E5CF0'], rock: ['#7A8394', '#9AA3B2'], post: '#9AA3B2', rail: '#6A7384' },
    magic: { leaf: ['#7C58D8', '#9B7BE0', '#B48CFF'], bush: ['#6A4CC0', '#9B7BE0'], rock: ['#7A6AB0', '#9A8AD0'], post: '#CDA8FF', rail: '#8E5CF0' }
  };
  function th(b) { return DTH[b.th] || DTH.default; }
  ART.ptree = function (b) {
    var t = th(b), s = '';
    s += circ(50, 44, 26, t.leaf[0]) + circ(34, 54, 16, t.leaf[1]) + circ(66, 52, 16, t.leaf[1]) + circ(44, 36, 13, t.leaf[2]);
    return T(b.x * 100, b.y * 100, shadow(50, 92, 28, 7) + '<path d="M44 92 Q46 76 44 62 H56 Q54 76 56 92Z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><g class="sway b" style="transform-origin:50px 70px">' + s + '</g>');
  };
  ART.pbush = function (b) {
    var t = th(b);
    return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 6) + circ(32, 70, 16, t.bush[0]) + circ(68, 70, 16, t.bush[0]) + circ(50, 62, 20, t.bush[1]) + circ(40, 56, 11, t.leaf[2]) + (b.th === 'winter' ? '<path d="M30 54q20 -14 40 0q-20 -4 -40 0" fill="#fff"/>' : circ(60, 60, 2.6, '#FF8FA3') + circ(42, 68, 2.4, '#FFD23F')));
  };
  ART.prock = function (b) {
    var t = th(b);
    return T(b.x * 100, b.y * 100, shadow(50, 88, 26, 6) + '<path d="M22 86 Q20 64 38 56 Q56 52 72 62 Q82 74 78 86Z" fill="' + t.rock[0] + '" stroke="rgba(40,50,70,.35)" stroke-width="1.6"/><path d="M32 66 Q42 58 56 62 Q48 64 42 72Z" fill="' + t.rock[1] + '"/>' + (b.th === 'winter' || b.th === 'mountain' ? '<path d="M30 62 Q44 50 62 58 Q50 56 40 66Z" fill="#fff"/>' : '') + (b.th === 'ocean' ? circ(40, 60, 3, '#3FAE5A') + circ(66, 70, 2.4, '#FF7A9A') : ''));
  };
  ART.pflower = function (b) {
    var cs = ['#FF6B8A', '#FFD23F', '#B57BFF', '#fff', '#5BB6FF'], s = '';
    [[28, 66], [52, 58], [70, 72]].forEach(function (p, i) { s += '<path d="M' + p[0] + ' 86 V' + (p[1] + 6) + '" stroke="#3C9440" stroke-width="3"/>' + circ(p[0], p[1], 9, cs[(b.x * 3 + b.y + i) % 5], 'rgba(0,0,0,.18)') + circ(p[0], p[1], 3.2, '#FFE9A0'); });
    return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 5) + s);
  };
  ART.plamp = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 92, 14, 5) + rect(44, 64, 12, 28, '#3B4252', '', 3) + rect(46, 26, 8, 42, '#4C566A', '', 2) + poly('34,30 40,14 60,14 66,30', '#3B4252') + poly('38,30 42,18 58,18 62,30', '#FFE08A') + '<g class="lampg"><circle cx="50" cy="24" r="14" fill="url(#bg-glow)"/></g>');
  };
  ART.fenceh = function (b) {
    var t = th(b), n = b.w * 100, s = '', x;
    s += rect(0, 58, n, 7, t.rail, 'rgba(0,0,0,.25)', 2) + rect(0, 74, n, 7, t.rail, 'rgba(0,0,0,.25)', 2);
    for (x = 12; x < n; x += 40) s += poly((x - 6) + ',90 ' + (x - 6) + ',50 ' + x + ',44 ' + (x + 6) + ',50 ' + (x + 6) + ',90', t.post, 'rgba(0,0,0,.28)') + (b.th === 'winter' ? '<path d="M' + (x - 7) + ' 50q7 -9 14 0z" fill="#fff"/>' : '');
    return T(b.x * 100, b.y * 100, '<ellipse cx="' + (n / 2) + '" cy="92" rx="' + (n / 2 - 6) + '" ry="4" fill="rgba(20,50,20,.22)"/>' + s);
  };
  ART.fencev = function (b) {
    var t = th(b), n = b.h * 100, s = '', y;
    s += rect(44, 8, 7, n - 18, t.rail, 'rgba(0,0,0,.25)', 2) + rect(62, 8, 7, n - 18, t.rail, 'rgba(0,0,0,.25)', 2);
    for (y = 20; y < n - 6; y += 40) s += poly('36,' + (y + 14) + ' 36,' + (y - 12) + ' 56,' + (y - 18) + ' 76,' + (y - 12) + ' 76,' + (y + 14), t.post, 'rgba(0,0,0,.28)') + (b.th === 'winter' ? '<path d="M36 ' + (y - 12) + 'q20 -12 40 0z" fill="#fff"/>' : '');
    return T(b.x * 100, b.y * 100, '<ellipse cx="56" cy="' + (n - 6) + '" rx="26" ry="5" fill="rgba(20,50,20,.22)"/>' + s);
  };
  ART.pmush = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 22, 5, 'rgba(30,10,60,.3)') + rect(44, 62, 12, 28, '#F2E8FF', '', 5) + '<path d="M26 66 Q28 38 50 36 Q72 38 74 66Z" fill="#B48CFF"/>' + circ(40, 52, 4.4, '#fff') + circ(58, 48, 3.4, '#fff') + circ(62, 58, 3, '#fff') + '<g class="spk"><circle cx="50" cy="52" r="26" fill="url(#bg-glowP)" opacity=".5"/></g>');
  };
  ART.pgum = function (b) {
    var c = ['#FF6B9A', '#6BC8FF', '#FFD23F', '#8BE28A', '#B48CFF'][(b.x + b.y * 2) % 5], s = '';
    [[38, 56], [56, 50], [48, 68], [62, 66], [34, 70]].forEach(function (p) { s += circ(p[0], p[1], 1.6, '#fff'); });
    return T(b.x * 100, b.y * 100, shadow(50, 88, 26, 6, 'rgba(160,60,100,.25)') + '<path d="M24 86 Q22 42 50 38 Q78 42 76 86Z" fill="' + c + '" stroke="rgba(0,0,0,.2)" stroke-width="1.6"/><path d="M30 60 Q34 46 46 44" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round" opacity=".6"/>' + s + '<ellipse cx="50" cy="86" rx="26" ry="5" fill="rgba(0,0,0,.15)"/>');
  };
  ART.pcoral = function (b) {
    var cs = ['#FF7A9A', '#FFB04A', '#B48CFF'], c = cs[(b.x + b.y) % 3];
    return T(b.x * 100, b.y * 100, shadow(50, 90, 24, 5, 'rgba(10,50,100,.35)') + '<g class="sway b" style="transform-origin:50px 90px"><path d="M50 90 V44 M50 66 l-14 -16 M50 60 l16 -18 M50 76 l-18 -8" stroke="' + c + '" stroke-width="9" stroke-linecap="round" fill="none"/>' + circ(50, 42, 6, c) + circ(34, 48, 5, c) + circ(66, 40, 5, c) + circ(31, 66, 5, c) + '</g>');
  };
  ART.pcloud = function (b) {
    return T(b.x * 100, b.y * 100, E0(50, 82, 30, 5) + circ(34, 62, 14, '#fff', '#CFE0F2') + circ(52, 52, 18, '#fff', '#CFE0F2') + circ(68, 62, 14, '#fff', '#CFE0F2') + '<ellipse cx="50" cy="68" rx="28" ry="9" fill="#fff"/>');
  };
  function E0(cx, cy, rx, ry) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="rgba(120,150,200,.25)"/>'; }

  var DEC_CACHE = {};
  function decorSvg(z, lv) {
    var D = root.EWTGardenData, key = z.id + ':' + lv; if (!D || !z.decor || !lv) return '';
    if (DEC_CACHE[key]) return DEC_CACHE[key];
    var ld = D.landOf(lv), blocks = z.decor.filter(function (d) { return d.L <= lv; }).sort(function (a, b) { return (a.y + a.h) - (b.y + b.h) || a.x - b.x; }), s = '';
    if (!blocks.length) return (DEC_CACHE[key] = '');
    blocks.forEach(function (d) { if (ART[d.k]) s += API.lit(ART[d.k](d), 'bvM'); });
    return (DEC_CACHE[key] = API.uniq('<svg class="gd-zdec" viewBox="0 0 ' + (ld.c * 100) + ' ' + (ld.r * 100) + '" preserveAspectRatio="none" aria-hidden="true"><defs>' + API.DEFS + '</defs>' + s + '</svg>'));
  }
  API.decorSvg = decorSvg;
})(typeof window !== 'undefined' ? window : this);
