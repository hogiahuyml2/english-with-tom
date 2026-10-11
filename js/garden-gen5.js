/* EWT Garden — NÔNG TRẠI: kiểu CHUỒNG nuôi thú (chuồng bò, chuồng cừu, lều ger Mông Cổ, chuồng gà, nhà sàn, hồ vịt…) + thêm mẫu vật nuôi (trâu, lừa, bò Tây Tạng yak, gà).
   Chuồng là công trình lớn có thuộc tính `pen` (loài được nuôi); vật nuôi là thú cưng có thuộc tính `sp` (loài). Nạp SAU garden-gen3.js và garden-gen4.js. */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, W = root.EWTGardenWorld, CAT = root.EWTGardenCatalog; if (!A || !W || !CAT || !CAT.HOUSE || !CAT.PETART) return;
  var K = A.K, E = function (x, y, rx, ry, f, rot, ex) { if (typeof rot === 'string') { ex = rot; rot = 0; } return K.E(x, y, rx, ry, f, rot, ex); }, P = K.P, L = K.L, C = K.C, R = K.R, eyes = K.eyes, shade = A.shade, ST = ' stroke="rgba(0,0,0,.18)" stroke-width="1.2"', DK = '#2A2A34';

  /* ═════════ THÊM MẪU VẬT NUÔI ═════════ */
  var PT = CAT.PETART;
  // lừa: ngựa nhỏ + tai dài + mõm sáng
  PT.donkey = function (c, d, acc) { return PT.horse(c, d, acc) + P('M70 24L63 -2Q73 -2 79 20Z', c, ST) + P('M70 22L66 4Q72 6 76 19Z', shade(c, .3)) + E(92, 41, 5, 4, shade(c, .38), -22) + L('M60 62Q58 76 62 84', shade(d, .1), 3); };
  // trâu: thân to sẫm màu, sừng dài cong ra sau, mõm sáng
  PT.buffalo = function (c, d, acc) {
    return L('M72 80Q92 78 86 60', c, 4) + P('M22 90Q16 58 46 56Q80 56 80 90Z', c, ST) + E(34, 90, 9, 4, shade(c, -.35)) + E(66, 90, 9, 4, shade(c, -.35)) +
      P('M38 38Q16 38 16 14Q26 22 40 28Z', d, ST) + P('M62 38Q84 38 84 14Q74 22 60 28Z', d, ST) + E(28, 46, 10, 5, c, 14, ST) + E(72, 46, 10, 5, c, -14, ST) + E(50, 44, 21, 19, c, 0, ST) +
      E(50, 56, 14, 10, shade(c, .34), 0, ST) + C(44, 56, 2, DK) + C(56, 56, 2, DK) + eyes(50, 42, 10, 2.6);
  };
  // yak: lông dài rũ xuống, sừng cong lên
  PT.yak = function (c, d, acc) {
    var s = L('M74 78Q94 76 88 58', c, 5) + P('M16 90Q10 54 40 50Q68 46 84 62Q88 84 80 92Q64 84 50 88Q32 82 16 90Z', c, ST) + P('M18 86Q22 96 28 88Q34 98 40 88Q46 98 52 88Q58 98 64 88Q70 98 78 90Q70 84 52 84Q32 84 18 86Z', shade(c, -.2), ST);
    return s + P('M34 36Q20 30 22 16Q30 22 40 30Z', '#F2E8D0', ST) + P('M66 36Q80 30 78 16Q70 22 60 30Z', '#F2E8D0', ST) + E(30, 44, 9, 4.6, c, 18, ST) + E(70, 44, 9, 4.6, c, -18, ST) + E(50, 46, 19, 18, c, 0, ST) +
      P('M32 52Q50 70 68 52Q60 80 50 82Q40 80 32 52Z', shade(c, -.14), ST) + E(50, 56, 10, 7, shade(c, .22)) + C(46, 56, 1.6, DK) + C(54, 56, 1.6, DK) + eyes(50, 42, 9, 2.4);
  };
  PT.hen = function (c, d, acc) { return PT.rooster(c, d, acc); };
  PT.alpaca = function (c, d, acc) { return PT.llama(c, d, acc); };

  /* ═════════ CÁC KIỂU CHUỒNG ═════════ */
  var S = CAT.HOUSE, FEAT = CAT.FEAT;
  function rc(x, y, w, h, f, rx) { return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="' + (rx || 0) + '" fill="' + f + '" stroke="rgba(0,0,0,.26)" stroke-width="2"/>'; }
  function pa(d, f, st, sw) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (st ? ' stroke="' + st + '" stroke-width="' + (sw || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"' : '') + '/>'; }
  function pl(pts, f) { return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="' + f + '" stroke="rgba(0,0,0,.28)" stroke-width="2.2" stroke-linejoin="round"/>'; }
  function el(x, y, rx, ry, f) { return '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" fill="' + f + '"/>'; }
  function ci(x, y, r, f) { return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + f + '" stroke="rgba(0,0,0,.22)" stroke-width="1.6"/>'; }
  // sân chuồng: nền đất + hàng rào sau / hai bên (hàng rào trước vẽ thấp để thú nhìn thấy rõ)
  function yard(w, h, col, fenceCol) {
    var s = el(w / 2, h * .74, w * .47, h * .24, shade(col, -.06)) + el(w / 2, h * .74, w * .42, h * .2, col), i, n = Math.max(5, Math.round(w / 34));
    s += pa('M' + w * .06 + ' ' + h * .56 + 'H' + w * .94, '', fenceCol, 4) + pa('M' + w * .06 + ' ' + h * .64 + 'H' + w * .94, '', fenceCol, 3);
    for (i = 0; i <= n; i++) s += rc(w * .06 + (w * .88) * i / n - 3, h * .5, 6, h * .17, fenceCol, 2);
    s += pa('M' + w * .06 + ' ' + h * .56 + 'L' + w * .02 + ' ' + h * .9 + 'M' + w * .94 + ' ' + h * .56 + 'L' + w * .98 + ' ' + h * .9, '', fenceCol, 4);
    return s;
  }
  function frontFence(w, h, fenceCol) {
    var s = pa('M' + w * .02 + ' ' + h * .9 + 'H' + w * .98, '', fenceCol, 4) + pa('M' + w * .02 + ' ' + h * .96 + 'H' + w * .98, '', fenceCol, 3), i, n = Math.max(5, Math.round(w / 30));
    for (i = 0; i <= n; i++) s += rc(w * .02 + (w * .96) * i / n - 3, h * .86, 6, h * .14, fenceCol, 2);
    return s;
  }
  function trough(x, y) { return rc(x, y, 36, 10, '#8A5A2E', 3) + pa('M' + (x + 4) + ' ' + y + 'q8 -9 14 0q8 -8 14 0', '#E8C75A', '#B8943A', 1.4); }
  // chuồng mái dốc (chuồng bò / cừu / dê / lợn…): p.wall tường, p.roof mái, p.acc hàng rào
  S.pen = function (w, h, p) {
    var s = yard(w, h, '#CDB27A', p.acc);
    s += rc(w * .3, h * .1, w * .4, h * .42, p.wall) + pl([[w * .24, h * .14], [w * .5, h * -.04], [w * .76, h * .14]], p.roof) + rc(w * .42, h * .28, w * .16, h * .24, shade(p.wall, -.25), 3) + rc(w * .44, h * .13, w * .12, h * .08, '#FFFFFF', 2);
    return s + trough(w * .12, h * .62) + frontFence(w, h, p.acc);
  };
  // lều ger Mông Cổ: nền tròn trắng, mái hình nón có dây đai, cửa cam
  S.penger = function (w, h, p) {
    var s = yard(w, h, '#C9D48A', p.acc), cx = w * .5;
    s += el(cx, h * .5, w * .2, h * .08, shade(p.wall, -.15)) + rc(cx - w * .19, h * .26, w * .38, h * .24, p.wall, 4) + pl([[cx - w * .22, h * .28], [cx, h * .06], [cx + w * .22, h * .28]], p.roof) + pa('M' + (cx - w * .19) + ' ' + h * .36 + 'H' + (cx + w * .19), '', p.acc, 3) + rc(cx - w * .05, h * .34, w * .1, h * .16, '#E8742E', 3) + pa('M' + cx + ' ' + h * .06 + 'v-' + h * .05, '', '#6B4A2B', 3);
    return s + frontFence(w, h, p.acc);
  };
  // nhà sàn tre lợp rạ (Việt Nam, Đông Nam Á)
  S.penst = function (w, h, p) {
    var s = yard(w, h, '#B8C87A', p.acc), i;
    for (i = 0; i < 4; i++) s += rc(w * (.3 + i * .13) - 3, h * .3, 6, h * .24, '#9A7A3A', 2);
    s += rc(w * .26, h * .26, w * .48, h * .08, '#C9A66A') + rc(w * .3, h * .1, w * .4, h * .17, p.wall) + pl([[w * .22, h * .14], [w * .5, h * -.06], [w * .78, h * .14]], p.roof) + pa('M' + w * .32 + ' ' + h * .1 + 'l' + w * .02 + ' ' + h * .06 + 'M' + w * .66 + ' ' + h * .1 + 'l-' + w * .02 + ' ' + h * .06, '', 'rgba(120,80,20,.45)', 2) + rc(w * .46, h * .16, w * .08, h * .11, '#3A2A1A', 2) + pa('M' + w * .5 + ' ' + h * .34 + 'L' + w * .56 + ' ' + h * .54, '', '#9A7A3A', 4);
    return s + trough(w * .12, h * .66) + frontFence(w, h, p.acc);
  };
  // chuồng gà: nhà nhỏ có dốc lên, ổ đẻ và máng
  S.pencoop = function (w, h, p) {
    var s = yard(w, h, '#CDB27A', p.acc);
    s += rc(w * .34, h * .22, w * .32, h * .3, p.wall) + pl([[w * .3, h * .26], [w * .5, h * .06], [w * .7, h * .26]], p.roof) + rc(w * .45, h * .34, w * .1, h * .12, '#3A2A1A', 8) + pa('M' + w * .5 + ' ' + h * .46 + 'L' + w * .42 + ' ' + h * .58, '', '#8A5A2E', 4) + rc(w * .68, h * .3, w * .1, h * .1, shade(p.wall, -.15)) + rc(w * .22, h * .34, w * .1, h * .1, shade(p.wall, -.15));
    s += ci(w * .24, h * .72, 5, '#FFF4DC') + ci(w * .74, h * .74, 4.5, '#FFF4DC');
    return s + trough(w * .52, h * .66) + frontFence(w, h, p.acc);
  };
  // mái che mở (kho cỏ khô): dùng cho ngựa / lừa / lạc đà
  S.penshed = function (w, h, p) {
    var s = yard(w, h, '#CDB27A', p.acc), i;
    s += rc(w * .24, h * .14, 8, h * .38, '#8A5A2E', 2) + rc(w * .72, h * .14, 8, h * .38, '#8A5A2E', 2) + pl([[w * .18, h * .18], [w * .26, h * .02], [w * .82, h * .02], [w * .86, h * .18]], p.roof) + rc(w * .3, h * .3, w * .38, h * .22, p.wall, 3);
    for (i = 0; i < 3; i++) s += ci(w * (.36 + i * .12), h * .4, 7, '#E8C75A') + pa('M' + (w * (.36 + i * .12) - 5) + ' ' + h * .4 + 'h10', '', '#B8943A', 1.4);
    return s + trough(w * .12, h * .64) + frontFence(w, h, p.acc);
  };
  // lều tròn lợp tranh (làng Maasai, châu Phi) có rào gai
  S.penhut = function (w, h, p) {
    var s = yard(w, h, '#D8B678', p.acc), cx = w * .5, i;
    s += rc(cx - w * .15, h * .26, w * .3, h * .24, p.wall, 5) + pl([[cx - w * .19, h * .28], [cx, h * .04], [cx + w * .19, h * .28]], p.roof) + rc(cx - w * .04, h * .34, w * .08, h * .16, '#3A2A1A', 8);
    for (i = 0; i < 6; i++) s += pa('M' + (cx - w * .12 + i * w * .05) + ' ' + h * .2 + 'l' + (i % 2 ? 3 : -3) + ' ' + h * .08, '', 'rgba(110,70,20,.5)', 1.6);
    return s + frontFence(w, h, p.acc);
  };
  // hồ nước có chòi nhỏ cho vịt / ngỗng
  S.penpond = function (w, h, p) {
    var s = yard(w, h, '#BFD88A', p.acc);
    s += el(w * .5, h * .72, w * .32, h * .14, '#4F9ED8') + el(w * .5, h * .72, w * .26, h * .1, '#7DBDEC') + pa('M' + w * .34 + ' ' + h * .72 + 'q' + w * .06 + ' -6 ' + w * .1 + ' 0M' + w * .54 + ' ' + h * .76 + 'q' + w * .06 + ' -6 ' + w * .1 + ' 0', '', 'rgba(255,255,255,.7)', 2);
    s += rc(w * .34, h * .16, w * .32, h * .3, p.wall) + pl([[w * .3, h * .2], [w * .5, h * .02], [w * .7, h * .2]], p.roof) + rc(w * .46, h * .3, w * .08, h * .16, '#3A2A1A', 8) + pa('M' + w * .8 + ' ' + h * .66 + 'v-16M' + w * .84 + ' ' + h * .66 + 'v-20M' + w * .88 + ' ' + h * .66 + 'v-14', '', '#5AA45A', 3);
    return s + frontFence(w, h, p.acc);
  };

  // đăng ký hình cho các công trình dùng kiểu chuồng mới (gen3 đã chạy trước nên không thấy các kiểu này)
  var BIG = W.BIG, BIGSIZE = W.BIGSIZE, MINE = { pen: 1, penger: 1, penst: 1, pencoop: 1, penshed: 1, penhut: 1, penpond: 1 };
  CAT.eachSpec(function (id, k, sp) {
    if (k !== 'b' || !MINE[sp[3]]) return;
    var w = sp[1], h = sp[2], st = S[sp[3]], pal = { wall: sp[4], roof: sp[5], acc: sp[6] }, feats = String(sp[7] || '').split('+').filter(Boolean);
    BIG[id] = function () { var W2 = w * 100, H2 = h * 100, s = '<g>' + el(W2 / 2, H2 - 2, W2 * .46, 7, 'rgba(20,50,20,.22)') + st(W2, H2, pal); feats.forEach(function (f) { if (FEAT[f]) s += FEAT[f](W2, H2, pal); }); return s + '</g>'; };
    BIGSIZE[id] = [w, h];
  });

  // vật nuôi (thú cưng có `sp`): đăng ký hình cho các mẫu mới (gen4 đã chạy nhưng chưa có buffalo/yak/donkey/hen khi duyệt)
  var PET = A.PET || (A.PET = {}), SH = K.SH;
  CAT.eachSpec(function (id, k, sp) {
    if (k !== 'p') return; var fn = PT[sp[1]]; if (!fn || PET[id]) return;
    PET[id] = function () { return SH(24) + fn(sp[2], sp[3], String(sp[4] || '')); };
  });
})(typeof window !== 'undefined' ? window : this);
