/* EWT Garden — 6 CÔNG TRÌNH LỚN của sự kiện: Cổng chào Xuân, Chợ hoa Tết, Cổng đèn lồng, Lầu ngắm trăng, Nhà bánh gừng, Xưởng ông già Noel.
   Nạp SAU garden-world*.js: đăng ký vào BIG / BIGSIZE của EWTGardenWorld. */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, W = root.EWTGardenWorld; if (!A || !W || !W.BIG) return;
  var K = A.K, C = K.C, R = K.R, P = K.P, L = K.L, shade = A.shade, BIG = W.BIG, BIGSIZE = W.BIGSIZE, rad = Math.PI / 180;
  var E = function (x, y, rx, ry, f, rot, ex) { if (typeof rot === 'string') { ex = rot; rot = 0; } return K.E(x, y, rx, ry, f, rot, ex); };
  var ST = function (c, w) { return ' stroke="' + shade(c || '#888888', -.34) + '" stroke-width="' + (w || 2) + '" stroke-linejoin="round"'; };
  var GOLD = '#FFD23F', GOLD2 = '#C98A00', RED = '#E5334B', RED2 = '#B71C2C';
  function star(cx, cy, ro, ri, n, f, ex) { var p = [], i; for (i = 0; i < n * 2; i++) { var r = i % 2 ? ri : ro, a = (-90 + i * 180 / n) * rad; p.push((cx + Math.cos(a) * r).toFixed(1) + ',' + (cy + Math.sin(a) * r).toFixed(1)); } return '<polygon points="' + p.join(' ') + '" fill="' + f + '"' + (ex || '') + '/>'; }
  function blos(x, y, r, c, c2) { var s = '', i; for (i = 0; i < 5; i++) { var a = (i * 72 - 90) * rad; s += C((x + Math.cos(a) * r * .7).toFixed(1), (y + Math.sin(a) * r * .7).toFixed(1), r * .55, c); } return s + C(x, y, r * .32, c2); }
  function lantern(x, y, k, c, c2) { c = c || RED; c2 = c2 || GOLD; return L('M' + x + ' ' + (y - 8 * k) + 'V' + y, '#8A5A2E', 1.6) + R(x - 5 * k, y, 10 * k, 3 * k, 1, c2) + E(x, y + 13 * k, 10 * k, 12 * k, c, 0, ST(c, 1.4)) + E(x, y + 13 * k, 4.6 * k, 12 * k, shade(c, .3)) + R(x - 5 * k, y + 23 * k, 10 * k, 3 * k, 1, c2) + L('M' + x + ' ' + (y + 26 * k) + 'v' + 8 * k, c2, 1.6) + C(x, y + 35 * k, 1.8 * k, c); }
  function pot(x, y, k, col) { return P('M' + (x - 9 * k) + ' ' + y + 'L' + (x - 7 * k) + ' ' + (y + 12 * k) + 'H' + (x + 7 * k) + 'L' + (x + 9 * k) + ' ' + y + 'Z', col || '#E8742E', ST(col || '#E8742E', 1.2)) + R(x - 10 * k, y - 2 * k, 20 * k, 4 * k, 1.5, shade(col || '#E8742E', .15)); }
  function branchPot(x, y, k, c, c2) { var s = L('M' + x + ' ' + y + 'Q' + (x - 6 * k) + ' ' + (y - 14 * k) + ' ' + (x - 12 * k) + ' ' + (y - 24 * k) + 'M' + x + ' ' + y + 'Q' + (x + 4 * k) + ' ' + (y - 16 * k) + ' ' + (x + 12 * k) + ' ' + (y - 28 * k), '#6B4121', 2 * k); [[-12, -26], [-6, -18], [12, -30], [6, -22], [0, -32], [-16, -18], [16, -20]].forEach(function (p) { s += blos(x + p[0] * k, y + p[1] * k, 5 * k, c, c2); }); return s + pot(x, y, k); }
  function kumquat(x, y, k) { var s = pot(x, y, k, '#E8742E') + R(x - 1.5 * k, y - 8 * k, 3 * k, 9 * k, 1, '#6B4121') + C(x, y - 20 * k, 14 * k, '#3E9B4F') + C(x - 8 * k, y - 14 * k, 9 * k, '#4FAE4A') + C(x + 8 * k, y - 14 * k, 9 * k, '#4FAE4A'); [[-6, -24], [6, -22], [0, -14], [-10, -12], [10, -12], [0, -28]].forEach(function (p) { s += C(x + p[0] * k, y + p[1] * k, 3.4 * k, '#FF9A1F', ST('#FF9A1F', .8)); }); return s; }
  function marigoldPot(x, y, k) { var s = pot(x, y, k, '#B8733A') + C(x, y - 8 * k, 12 * k, '#3E9B4F'); [[-7, -10], [0, -16], [7, -10], [-3, -6], [4, -5]].forEach(function (p, i) { s += C(x + p[0] * k, y + p[1] * k, 5 * k, i % 2 ? '#FF9A1F' : '#FFB02E', ST('#E8742E', .6)); }); return s; }

  /* Cổng chào Xuân — 3×1 */
  BIG.tet_b1 = function () {
    var s = E(150, 96, 142, 6, 'rgba(20,50,20,.28)') + R(18, 86, 34, 10, 3, '#8A5A2E', ST('#8A5A2E')) + R(248, 86, 34, 10, 3, '#8A5A2E', ST('#8A5A2E'));
    [28, 252].forEach(function (x) { s += R(x, 24, 20, 64, 3, RED, ST(RED)) + R(x + 3, 24, 5, 64, 0, '#FF6A78', ' opacity=".6"') + R(x - 2, 38, 24, 5, 1, GOLD, ST(GOLD, 1)) + R(x - 2, 72, 24, 5, 1, GOLD, ST(GOLD, 1)); });
    s += R(20, 18, 260, 14, 3, RED2, ST(RED2)) + L('M24 25H276', GOLD, 2.4);
    s += P('M-4 22Q150 -26 304 22L296 34Q150 -2 4 34Z', '#C62828', ST('#C62828')) + L('M-4 22Q150 -26 304 22', GOLD, 4) + L('M10 28Q150 -10 290 28', '#FF8A8A', 1.6);
    s += P('M-8 16Q-2 14 2 22L-4 26Z', GOLD, ST(GOLD, 1)) + P('M308 16Q302 14 298 22L304 26Z', GOLD, ST(GOLD, 1));
    s += R(108, 14, 84, 36, 7, GOLD, ST(GOLD2, 2.4)) + R(114, 20, 72, 24, 5, RED, ST(RED, 1.4)) + blos(150, 32, 10, '#FF8FB8', GOLD) + blos(128, 32, 5, '#FFE3EE', GOLD) + blos(172, 32, 5, '#FFE3EE', GOLD);
    s += lantern(74, 32, 1, RED) + lantern(226, 32, 1, RED) + lantern(96, 34, .7, '#F59E0B') + lantern(204, 34, .7, '#F59E0B');
    s += branchPot(18, 96, 1, '#FF8FB8', RED) + branchPot(282, 96, 1, '#FFD23F', GOLD2) + kumquat(60, 96, .8) + marigoldPot(240, 96, .8);
    return '<g>' + s + '</g>';
  };
  BIGSIZE.tet_b1 = [3, 1];

  /* Chợ hoa Tết — 2×2 */
  BIG.tet_b2 = function () {
    var s = E(100, 190, 94, 8, 'rgba(20,50,20,.28)'), i;
    s += R(26, 60, 8, 126, 2, '#8A5A2E', ST('#8A5A2E')) + R(166, 60, 8, 126, 2, '#8A5A2E', ST('#8A5A2E'));
    s += R(36, 84, 128, 56, 0, '#F6E2B8') + L('M36 112H164', '#E5CE9A', 1.4);
    s += R(34, 98, 132, 5, 1, '#B8733A', ST('#B8733A', 1)) + branchPot(56, 96, .8, '#FF8FB8', RED) + marigoldPot(82, 96, .75) + branchPot(108, 96, .8, '#FFD23F', GOLD2) + marigoldPot(134, 96, .75) + branchPot(154, 96, .7, '#FFE3EE', GOLD);
    s += R(18, 138, 164, 46, 4, '#B8733A', ST('#B8733A')) + L('M18 150H182M18 162H182M18 174H182', '#8A5A2E', 1.4) + R(14, 134, 172, 8, 3, '#D9A666', ST('#D9A666', 1.2));
    s += kumquat(50, 134, .9) + branchPot(100, 134, 1, '#FF8FB8', RED) + marigoldPot(144, 134, .9);
    for (i = 0; i < 8; i++) s += P('M' + (14 + i * 21.5) + ' 54L' + (35.5 + i * 21.5) + ' 54L' + (35.5 + i * 21.5) + ' 66Q' + (24.75 + i * 21.5) + ' 76 ' + (14 + i * 21.5) + ' 66Z', i % 2 ? GOLD : RED, ST(i % 2 ? GOLD : RED, 1.2));
    s += P('M8 56L100 14L192 56Z', RED2, ST(RED2)) + P('M16 54L100 20L184 54Z', RED, ' opacity="0"') + L('M8 56L100 14L192 56', GOLD, 3.4);
    s += R(66, -2, 68, 24, 6, GOLD, ST(GOLD2, 2.4)) + R(71, 3, 58, 14, 4, RED, ST(RED, 1.2)) + blos(100, 10, 6, '#FF8FB8', GOLD) + blos(82, 10, 3.4, '#FFE3EE', GOLD) + blos(118, 10, 3.4, '#FFE3EE', GOLD);
    s += lantern(30, 70, .7, RED) + lantern(170, 70, .7, RED) + lantern(100, 70, .6, '#F59E0B');
    s += kumquat(18, 184, .8) + branchPot(184, 184, .8, '#FF8FB8', RED);
    return '<g>' + s + '</g>';
  };
  BIGSIZE.tet_b2 = [2, 2];

  /* Cổng đèn lồng — 3×1 */
  BIG.tt_b1 = function () {
    var s = E(150, 96, 140, 6, 'rgba(20,50,20,.28)') + R(22, 86, 30, 10, 3, '#8A6A3A', ST('#8A6A3A')) + R(248, 86, 30, 10, 3, '#8A6A3A', ST('#8A6A3A')), i;
    [28, 254].forEach(function (x) { s += R(x, 26, 18, 62, 7, '#C9972E', ST('#C9972E')) + L('M' + (x + 2) + ' 40h14M' + (x + 2) + ' 60h14M' + (x + 2) + ' 78h14', '#8A6A1A', 2) + R(x + 3, 26, 4, 62, 2, '#E8C268', ' opacity=".6"'); });
    s += '<path d="M18 30Q150 -34 282 30" fill="none" stroke="#8A6A1A" stroke-width="11" stroke-linecap="round"/><path d="M18 30Q150 -34 282 30" fill="none" stroke="#C9972E" stroke-width="8" stroke-linecap="round"/><path d="M20 28Q150 -34 280 28" fill="none" stroke="#E8C268" stroke-width="2" stroke-linecap="round" opacity=".7"/>';
    var cols = ['#E5334B', '#F59E0B', '#FFD23F', '#8E44AD', '#EC407A', '#26A69A'];
    for (i = 0; i < 9; i++) { var x = 46 + i * 26, t = (x - 150) / 132, y = 30 - 50 * (1 - t * t) + 6; if (Math.abs(x - 150) < 22) continue; s += i % 2 ? lantern(x, y, .72, cols[i % 6]) : '<g>' + L('M' + x + ' ' + (y - 6) + 'V' + (y + 2), '#8A5A2E', 1.4) + star(x, y + 20, 15, 7, 5, cols[i % 6], ST(cols[i % 6], 1.2)) + star(x, y + 20, 9, 4, 5, '#FFF3A0') + '</g>'; }
    s += C(150, 12, 24, '#FFE9A0', ' opacity=".28"') + P('M150 -6A18 18 0 1 0 164 22A14 14 0 1 1 150 -6Z', '#FFF1B8', ST('#E8C850', 1.6)) + star(172, 8, 5, 2.2, 4, '#FFF3B0') + star(128, 14, 4, 1.8, 4, '#FFF3B0');
    s += lantern(150, 32, .9, '#E5334B');
    return '<g>' + s + '</g>';
  };
  BIGSIZE.tt_b1 = [3, 1];

  /* Lầu ngắm trăng — 2×2 */
  BIG.tt_b2 = function () {
    var s = E(100, 192, 94, 8, 'rgba(20,20,60,.3)') + R(18, 172, 164, 16, 4, '#CFC8BC', ST('#CFC8BC', 1.6)) + R(32, 160, 136, 14, 3, '#DDD6CA', ST('#CFC8BC', 1.4)), i;
    s += R(44, 112, 112, 48, 2, '#8E2B3A', ST('#8E2B3A')) + R(60, 122, 24, 30, 11, '#FFD86B', ST(GOLD2, 1.6)) + R(116, 122, 24, 30, 11, '#FFD86B', ST(GOLD2, 1.6)) + R(88, 128, 24, 32, 12, '#5A1A24') + C(100, 140, 20, '#FFD23F', ' opacity=".12"');
    [40, 152].forEach(function (x) { s += R(x, 108, 8, 54, 2, '#C9972E', ST('#C9972E', 1.2)); });
    s += P('M8 114Q100 76 192 114L182 126Q100 96 18 126Z', '#2B3A6B', ST('#2B3A6B', 2)) + L('M8 114Q100 76 192 114', GOLD, 3) + P('M2 108Q8 104 12 112L6 118Z', '#2B3A6B', ST('#2B3A6B', 1)) + P('M198 108Q192 104 188 112L194 118Z', '#2B3A6B', ST('#2B3A6B', 1));
    s += R(68, 66, 64, 42, 2, '#8E2B3A', ST('#8E2B3A')) + R(76, 76, 18, 26, 8, '#FFD86B', ST(GOLD2, 1.4)) + R(106, 76, 18, 26, 8, '#FFD86B', ST(GOLD2, 1.4)); [66, 126].forEach(function (x) { s += R(x, 64, 8, 46, 2, '#C9972E', ST('#C9972E', 1)); });
    s += L('M64 108H136', '#C9972E', 4) + '<g stroke="#C9972E" stroke-width="2">' + (function () { var t = ''; for (i = 0; i < 8; i++) t += '<path d="M' + (68 + i * 9) + ' 100v8"/>'; return t; })() + '</g>';
    s += P('M42 72Q100 28 158 72L150 80Q100 46 50 80Z', '#2B3A6B', ST('#2B3A6B', 2)) + L('M42 72Q100 28 158 72', GOLD, 3) + L('M100 40V14', GOLD2, 3) + C(100, 12, 3, GOLD, ST(GOLD2, 1));
    s += C(100, 8, 22, '#FFE9A0', ' opacity=".28"') + P('M100 -8A14 14 0 1 0 112 14A11 11 0 1 1 100 -8Z', '#FFF1B8', ST('#E8C850', 1.4)) + star(124, -2, 5, 2.2, 4, '#FFF3B0') + star(80, 4, 4, 1.8, 4, '#FFF3B0');
    s += lantern(52, 128, .6, RED) + lantern(148, 128, .6, RED) + lantern(74, 82, .5, '#F59E0B') + lantern(126, 82, .5, '#F59E0B');
    return '<g>' + s + '</g>';
  };
  BIGSIZE.tt_b2 = [2, 2];

  /* Nhà bánh gừng — 2×2 */
  BIG.nl_b1 = function () {
    var s = E(100, 190, 96, 9, 'rgba(120,150,190,.35)') + E(100, 186, 90, 10, '#F4FAFF', ST('#CFE0F2', 1.4)), i;
    s += R(34, 100, 132, 82, 6, '#B8733A', ST('#B8733A', 2.4)) + L('M34 120H166M34 140H166M34 160H166', '#A0612E', 1.2);
    s += R(138, 40, 20, 40, 3, '#B8733A', ST('#B8733A', 2)) + R(134, 34, 28, 8, 4, '#FFFFFF', ST('#CFE0F2', 1.2)) + C(146, 24, 6, 'rgba(255,255,255,.7)') + C(152, 14, 5, 'rgba(255,255,255,.5)');
    s += P('M14 108L100 36L186 108Z', '#8A4A22', ST('#8A4A22', 2.4)) + P('M22 108L100 42L178 108Z', '#C98A4B');
    for (i = 0; i < 12; i++) { var rx = 44 + (i % 6) * 22 + (Math.floor(i / 6) ? 11 : 0), ry = 92 - Math.floor(i / 6) * 22; if (ry < 54 && Math.floor(i / 6)) ry = 70; s += C(rx - (Math.floor(i / 6) ? 0 : 6), ry - (i < 6 ? 0 : 6), 5.4, ['#EC407A', '#FFFFFF', '#4FB4FF', '#FFD23F', '#66BB6A', '#FF7043'][i % 6], ST('#8A4A22', 1)); }
    s += '<path d="M14 108Q26 120 38 108Q50 120 62 108Q74 120 86 108Q98 120 110 108Q122 120 134 108Q146 120 158 108Q170 120 186 108" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>';
    s += L('M100 36L100 30', '#fff', 5) + star(100, 26, 8, 3.6, 5, '#FFD23F', ST(GOLD2, 1.2));
    s += R(84, 130, 34, 52, 17, '#7A3B0B', ST('#5A2E14', 2)) + R(84, 168, 34, 14, 0, '#7A3B0B') + L('M84 130Q101 126 118 130', '#fff', 4) + C(110, 156, 3, '#EC407A') + L('M101 134V182', '#5A2E14', 1.2);
    [[44, 124], [122, 124]].forEach(function (p) { s += R(p[0], p[1], 30, 30, 5, '#FFF3B0', ST(GOLD2, 1.6)) + L('M' + (p[0] + 15) + ' ' + p[1] + 'v30M' + p[0] + ' ' + (p[1] + 15) + 'h30', '#fff', 3); });
    for (i = 0; i < 6; i++) s += E(40 + i * 24, 184, 8, 6, ['#EC407A', '#4FB4FF', '#FFD23F', '#66BB6A', '#FF7043', '#8E44AD'][i], 0, ST('#8A4A22', 1) + ' opacity=".95"');
    [[24, 182], [176, 182]].forEach(function (p) { var d = 'M' + p[0] + ' ' + p[1] + 'V150Q' + p[0] + ' 140 ' + (p[0] + 8) + ' 142'; s += '<path d="' + d + '" fill="none" stroke="#B71C1C" stroke-width="8" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + RED + '" stroke-width="5" stroke-dasharray="4 4"/>'; });
    return '<g>' + s + '</g>';
  };
  BIGSIZE.nl_b1 = [2, 2];

  /* Xưởng ông già Noel — 3×2 */
  BIG.nl_b2 = function () {
    var s = E(150, 192, 146, 9, 'rgba(120,150,190,.35)') + E(150, 188, 140, 10, '#F4FAFF', ST('#CFE0F2', 1.4)), i;
    s += R(44, 102, 172, 82, 4, '#9B5A2E', ST('#7A4A22', 2.4)); for (i = 0; i < 7; i++) s += L('M44 ' + (112 + i * 11) + 'H216', '#7A4A22', 1.6) + C(44, 112 + i * 11, 2.4, '#C98A4B') + C(216, 112 + i * 11, 2.4, '#C98A4B');
    s += R(172, 48, 24, 46, 3, '#8A8A96', ST('#6A6A76', 2)) + L('M172 62h24M172 76h24M184 48v14M178 62v14', '#6A6A76', 1.2) + R(168, 42, 32, 8, 4, '#F4FAFF', ST('#CFE0F2', 1.2)) + C(184, 32, 7, 'rgba(255,255,255,.75)') + C(192, 20, 5.4, 'rgba(255,255,255,.55)') + C(198, 10, 4, 'rgba(255,255,255,.4)');
    s += P('M26 108L130 36L234 108Z', '#C62828', ST('#9E1E1E', 2.4)) + P('M26 108L130 36L234 108L222 108L130 46L38 108Z', '#E24B4B', ' opacity=".5"');
    s += P('M22 110Q40 90 62 80L130 28L198 80Q220 90 238 110Q220 100 200 104L130 52L60 104Q40 100 22 110Z', '#FFFFFF', ST('#CFE0F2', 1.4));
    s += star(130, 24, 9, 4, 5, '#FFD23F', ST(GOLD2, 1.2)) + C(130, 24, 16, '#FFD23F', ' opacity=".2"');
    s += R(104, 134, 52, 50, 24, '#6B3A18', ST('#4A2810', 2)) + R(104, 164, 52, 20, 0, '#6B3A18') + L('M130 134V184', '#4A2810', 1.6) + C(144, 162, 3, GOLD) + L('M104 134Q130 126 156 134', '#FFFFFF', 5);
    s += R(98, 108, 64, 20, 5, '#FFF3D6', ST('#B8863B', 1.6)) + star(116, 118, 5, 2.2, 5, RED) + star(144, 118, 5, 2.2, 5, '#2E8B57') + L('M124 118h12', '#8A5A2E', 2);
    [[58, 124], [172, 124]].forEach(function (p) { s += R(p[0], p[1], 32, 32, 5, '#FFE27A', ST(GOLD2, 2)) + R(p[0] + 4, p[1] + 4, 24, 24, 3, '#FFF3B0') + L('M' + (p[0] + 16) + ' ' + p[1] + 'v32M' + p[0] + ' ' + (p[1] + 16) + 'h32', '#8A5A2E', 2.2) + R(p[0] - 4, p[1] + 30, 40, 6, 2, '#F4FAFF', ST('#CFE0F2', 1)) + C(p[0] + 16, p[1] + 16, 26, '#FFD23F', ' opacity=".12"'); });
    // quà
    s += R(236, 158, 24, 26, 3, '#E5334B', ST(RED, 1.4)) + R(245, 158, 6, 26, 0, GOLD) + R(262, 168, 24, 16, 3, '#2E8B57', ST('#2E8B57', 1.4)) + R(271, 168, 6, 16, 0, RED) + R(246, 140, 20, 18, 3, '#4F8BF0', ST('#4F8BF0', 1.4)) + R(254, 140, 5, 18, 0, '#fff') + P('M256 140Q248 132 251 139ZM256 140Q264 132 261 139Z', '#fff', ST('#9DB6E0', .8));
    // cột kẹo + đèn
    [[20, 184]].forEach(function (p) { var d = 'M20 184V138Q20 126 30 128'; s += '<path d="' + d + '" fill="none" stroke="#B71C1C" stroke-width="9" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/><path d="' + d + '" fill="none" stroke="' + RED + '" stroke-width="6" stroke-dasharray="5 5"/>' + C(33, 134, 5, '#FFE27A') + C(33, 134, 12, '#FFD23F', ' opacity=".25"'); });
    return '<g>' + s + '</g>';
  };
  BIGSIZE.nl_b2 = [3, 2];
})(typeof window !== 'undefined' ? window : this);
