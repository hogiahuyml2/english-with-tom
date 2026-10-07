/* EWT Garden — vẽ lại bộ đồ NÔNG TRẠI bằng SVG (thay các ảnh PNG cũ): cây ngô, bó rơm, thùng & bao tải, hàng rào gỗ, sàn gỗ.
   Nạp SAU garden-art4.js. Khung 100×100. */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, D = root.EWTGardenData; if (!A) return;
  var K = A.K, C = K.C, R = K.R, P = K.P, L = K.L, SH = K.SH, shade = A.shade, G2 = K.G2;
  var E = function (x, y, rx, ry, f, rot, ex) { if (typeof rot === 'string') { ex = rot; rot = 0; } return K.E(x, y, rx, ry, f, rot, ex); };
  var ST = ' stroke="rgba(0,0,0,.22)" stroke-width="1.2" stroke-linejoin="round"';
  ['corn', 'haybale', 'crates', 'rustfence', 'deck'].forEach(function (id) { if (D && D.BY[id]) D.BY[id].img = 0; });

  A.BLOOM.corn = function (c, c2) {
    var s = R(46.5, 18, 7, 74, 3, '#7FAF4A', ST) + L('M47 30V88M53 30V88', '#5E8A32', 1), i;
    [[-1, 82, 28], [1, 74, 26], [-1, 62, 24], [1, 50, 22]].forEach(function (l, k) { var d = l[0]; s += P('M50 ' + l[1] + 'Q' + (50 + d * l[2]) + ' ' + (l[1] - 14) + ' ' + (50 + d * (l[2] + 10)) + ' ' + (l[1] + 8) + 'Q' + (50 + d * l[2] * .5) + ' ' + (l[1] - 2) + ' 50 ' + (l[1] + 4) + 'Z', k % 2 ? '#7FC050' : '#6AAE42', ST) + L('M50 ' + (l[1] + 2) + 'Q' + (50 + d * l[2] * .6) + ' ' + (l[1] - 8) + ' ' + (50 + d * (l[2] + 6)) + ' ' + (l[1] + 6), '#4F8A2E', 1); });
    [[-1, 56], [1, 44]].forEach(function (e) { var d = e[0], y = e[1], x = 50 + d * 8; s += P('M' + x + ' ' + (y + 14) + 'Q' + (x + d * 8) + ' ' + (y + 2) + ' ' + (x + d * 2) + ' ' + (y - 14) + 'Q' + (x - d * 4) + ' ' + (y - 2) + ' ' + (x - d * 2) + ' ' + (y + 14) + 'Z', '#E8C84A', ST); for (i = 0; i < 4; i++) s += L('M' + (x - 3 + d) + ' ' + (y + 8 - i * 6) + 'h6', '#C9A02A', 1.2); s += P('M' + (x - d * 6) + ' ' + (y + 16) + 'Q' + (x - d * 8) + ' ' + (y - 4) + ' ' + (x + d * 1) + ' ' + (y - 16) + 'Q' + (x - d * 2) + ' ' + (y + 2) + ' ' + (x + d * 3) + ' ' + (y + 16) + 'Z', '#7FC050', ST) + L('M' + x + ' ' + (y - 16) + 'l' + d * 4 + ' -6M' + x + ' ' + (y - 16) + 'l' + d * -1 + ' -7', '#B8863B', 1.2); });
    s += L('M50 20l-6 -10M50 20l0 -12M50 20l6 -10M50 20l-3 -11M50 20l3 -11', '#E8C268', 1.6);
    return s;
  };
  A.DECO.haybale = function () {
    var s = SH(34) + E(50, 90, 34, 5, 'rgba(60,40,10,.2)') + R(48, 54, 36, 34, 4, '#D9B24A', ST) + L('M54 54V88M62 54V88M70 54V88M78 54V88', '#B8902C', 1.2) + R(46, 72, 40, 3, 1, '#8A6A2E') + C(30, 66, 24, '#E8C45A', ST) + C(30, 66, 24, 'none', ' stroke="#B8902C" stroke-width="2.4"') + C(30, 66, 18, 'none', ' stroke="#C9A22A" stroke-width="1.4"') + C(30, 66, 12, 'none', ' stroke="#C9A22A" stroke-width="1.4"') + C(30, 66, 6, 'none', ' stroke="#C9A22A" stroke-width="1.4"') + C(30, 66, 2, '#B8902C'), i;
    s += L('M8 66h44', 'rgba(120,80,20,.0)', 1);
    for (i = 0; i < 9; i++) s += L('M' + (14 + i * 3) + ' ' + (50 + (i * 7) % 12) + 'l2 -4', '#D4AE46', 1.2);
    s += L('M30 42V90', '#6B4A22', 2) + L('M12 66H48', '#6B4A22', 2) + L('M84 60l6 -4M86 66l7 0M84 74l6 4', '#E8C45A', 1.6) + P('M58 52l8 -8l2 8z', '#E8C45A', ST);
    return s;
  };
  A.DECO.crates = function () {
    var s = SH(34) + R(16, 52, 44, 38, 3, '#C98A4B', ST) + R(16, 52, 44, 7, 2, '#A8702C') + L('M16 70H60M16 82H60', '#8A5A2E', 1.4) + R(16, 52, 6, 38, 1, '#A8702C') + R(54, 52, 6, 38, 1, '#A8702C') + L('M22 52L54 90M54 52L22 90', '#8A5A2E', 2) + R(20, 60, 36, 28, 1, 'rgba(60,30,10,.12)'), i;
    for (i = 0; i < 3; i++) s += C(26 + i * 10, 52, 6, ['#E5334B', '#F28A24', '#E5334B'][i], ST) + C(24.4 + i * 10, 50, 1.6, 'rgba(255,255,255,.6)');
    s += P('M64 90Q56 66 66 52Q74 44 84 52Q92 66 86 90Z', '#D9C79A', ST) + P('M66 52Q74 58 84 52Q76 44 66 52Z', '#C8B27A', ST) + L('M62 60Q74 66 88 60', '#8A6A3A', 3) + L('M72 56l-2 -8M80 56l2 -8', '#C8B27A', 2.4) + L('M68 72l14 4M66 80l18 -2', 'rgba(120,90,40,.45)', 1.2);
    return s;
  };
  A.DECO.rustfence = function () {
    var s = SH(36) + E(50, 90, 38, 4, 'rgba(40,60,10,.22)'), i;
    for (i = 0; i < 3; i++) { var x = 16 + i * 32; s += P('M' + (x - 5) + ' 90V34L' + x + ' 26L' + (x + 5) + ' 34V90Z', '#B8733A', ST) + L('M' + (x - 1.4) + ' 38V88', '#8A5A2E', 1) + L('M' + (x - 3.6) + ' 38V88', 'rgba(255,220,160,.3)', 1.2); }
    s += R(6, 42, 88, 8, 2, '#C98A4B', ST) + R(6, 62, 88, 8, 2, '#C98A4B', ST) + L('M8 46H92M8 66H92', 'rgba(255,230,180,.35)', 1.2) + L('M30 42v8M62 42v8M22 62v8M54 62v8M86 62v8', 'rgba(60,30,10,.35)', 1) + C(16, 46, 1.4, '#6B4A22') + C(48, 46, 1.4, '#6B4A22') + C(80, 46, 1.4, '#6B4A22') + C(16, 66, 1.4, '#6B4A22') + C(48, 66, 1.4, '#6B4A22') + C(80, 66, 1.4, '#6B4A22');
    for (i = 0; i < 5; i++) s += L('M' + (8 + i * 22) + ' 90l2 -6M' + (11 + i * 22) + ' 90l-1 -5', '#5FAE3F', 1.6);
    return s;
  };
  A.DECO.deck = function () {
    var s = '', i;
    s += P('M8 62L50 38L92 62L50 86Z', '#B8733A', ST);
    for (i = 1; i < 6; i++) s += L('M' + (8 + i * 14) + ' ' + (62 - i * 4) + 'L' + (50 + i * 14) + ' ' + (86 - i * 4 - 0) , 'rgba(60,30,10,.35)', 1.2);
    for (i = 0; i < 4; i++) s += L('M' + (22 + i * 14) + ' ' + (54 + i * 6) + 'L' + (22 + i * 14 + 6) + ' ' + (58 + i * 6), 'rgba(255,225,170,.4)', 1.6);
    return s + P('M8 62L50 86V92L8 68Z', '#8A5A2E', ST) + P('M92 62L50 86V92L92 68Z', '#6B4A22', ST);
  };
})(typeof window !== 'undefined' ? window : this);
