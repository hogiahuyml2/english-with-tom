/* EWT Garden — KIẾN TRÚC MỚI: 17 kiểu nhà / trường học / công trình (trường làng, trường hiện đại, học viện cổ điển, mẫu giáo, thư viện, biệt thự phẳng,
   nhà trên cây, bungalow, nhà kính, kim tự tháp bậc, nhà hát cổ, nhà bong bóng dưới nước, dinh thự, toà cao tầng, cổng vòm, tháp đồng hồ, nhà hoa sen).
   Nạp SAU garden-gen5.js. Mỗi kiểu là hàm (w, h, p) với p = { wall, roof, acc } và dùng chung hệ chi tiết FEAT (cờ, đèn lồng, khói, tuyết…). */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, W = root.EWTGardenWorld, CAT = root.EWTGardenCatalog; if (!A || !W || !CAT || !CAT.HOUSE || !CAT.FEAT || !W.BIG) return;
  var shade = A.shade, BIG = W.BIG, BIGSIZE = W.BIGSIZE, S = CAT.HOUSE, FEAT = CAT.FEAT;
  function rc(x, y, w, h, f, rx, st) { return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="' + (rx || 0) + '" fill="' + f + '"' + (st === 0 ? '' : ' stroke="rgba(0,0,0,.28)" stroke-width="2"') + '/>'; }
  function pl(pts, f, st) { return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="' + f + '"' + (st === 0 ? '' : ' stroke="rgba(0,0,0,.3)" stroke-width="2.4" stroke-linejoin="round"') + '/>'; }
  function pa(d, f, st, sw) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (st ? ' stroke="' + st + '" stroke-width="' + (sw || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"' : '') + '/>'; }
  function ci(x, y, r, f, st) { return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function el(x, y, rx, ry, f) { return '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" fill="' + f + '"/>'; }
  var GLASS = '#CFE8F5', GLASS2 = 'rgba(190,230,250,.85)';
  function win(x, y, w, h, c) { return rc(x, y, w, h, c || GLASS, 3) + pa('M' + (x + w / 2) + ' ' + y + 'v' + h + 'M' + x + ' ' + (y + h / 2) + 'h' + w, '', 'rgba(60,40,20,.45)', 1.5); }
  function arcWin(x, y, w, h, c) { return pa('M' + x + ' ' + (y + h) + 'V' + (y + w / 2) + 'Q' + x + ' ' + y + ' ' + (x + w / 2) + ' ' + y + 'Q' + (x + w) + ' ' + y + ' ' + (x + w) + ' ' + (y + w / 2) + 'V' + (y + h) + 'Z', c || GLASS, 'rgba(60,40,20,.4)', 1.8); }
  function door(x, y, w, h, c) { return rc(x, y, w, h, c || '#8A5A2E', Math.min(w / 2, 10)) + ci(x + w * .78, y + h * .55, 2.4, '#F2C94C'); }
  function flag(x, y, c) { return pa('M' + x + ' ' + y + 'v-34', '', '#6B4A2B', 2.4) + pl([[x, y - 34], [x + 20, y - 28], [x, y - 22]], c); }
  function clock(x, y, r) { return ci(x, y, r, '#FFFDF2', 'rgba(0,0,0,.4)') + pa('M' + x + ' ' + y + 'v' + (-r * .6) + 'M' + x + ' ' + y + 'l' + (r * .45) + ' ' + (r * .2), '', '#3A2A1A', 2); }
  function cols(x0, x1, y0, y1, n, c) { var s = '', i; for (i = 0; i < n; i++) { var x = x0 + (x1 - x0) * (n === 1 ? .5 : i / (n - 1)); s += rc(x - 6, y0, 12, y1 - y0, c, 2) + rc(x - 9, y0 - 4, 18, 6, shade(c, -.1), 2, 0) + rc(x - 9, y1 - 2, 18, 5, shade(c, -.1), 2, 0); } return s; }
  function steps(x, y, w, n, c) { var s = '', i; for (i = 0; i < n; i++) s += rc(x - i * 8, y + i * 7, w + i * 16, 7, shade(c, -.04 * i), 1, 0); return s; }

  // trường làng: dãy nhà thấp mái đỏ, tháp chuông giữa có đồng hồ, cột cờ và sân
  S.school = function (w, h, p) {
    var s = el(w / 2, h * .94, w * .48, 9, 'rgba(210,190,130,.55)') + rc(w * .06, h * .5, w * .88, h * .42, p.wall), i, n = Math.max(3, Math.round(w / 80));
    s += pl([[w * .02, h * .52], [w * .14, h * .36], [w * .86, h * .36], [w * .98, h * .52]], p.roof);
    for (i = 0; i < n; i++) if (Math.abs((i + .5) / n - .5) > .14) s += win(w * (.1 + .8 * (i + .5) / n) - 14, h * .6, 28, h * .18, GLASS);
    s += rc(w * .42, h * .16, w * .16, h * .4, shade(p.wall, .06)) + pl([[w * .39, h * .18], [w * .5, h * .02], [w * .61, h * .18]], p.roof) + clock(w * .5, h * .3, 12) + door(w * .5 - 15, h * .66, 30, h * .26, p.acc);
    return s + flag(w * .1, h * .5, p.acc) + ci(w * .88, h * .88, 6, '#4FAE62') + ci(w * .93, h * .9, 4, '#F2C94C');
  };
  // trường hiện đại: ba khối xếp lệch, kính xanh, vườn mái và biển tên
  S.campus = function (w, h, p) {
    var s = rc(w * .04, h * .62, w * .5, h * .32, p.wall) + rc(w * .3, h * .38, w * .4, h * .56, shade(p.wall, .05)) + rc(w * .56, h * .54, w * .4, h * .4, p.wall), i;
    s += rc(w * .3, h * .34, w * .4, h * .06, p.roof) + rc(w * .04, h * .58, w * .5, h * .05, p.roof) + rc(w * .56, h * .5, w * .4, h * .05, p.roof);
    for (i = 0; i < 3; i++) s += rc(w * .33, h * (.43 + i * .15), w * .34, h * .1, GLASS2, 2);
    s += rc(w * .07, h * .67, w * .44, h * .1, GLASS2, 2, 0);
    s += rc(w * .59, h * .6, w * .34, h * .1, GLASS2, 2) + ci(w * .16, h * .56, 6, '#4FAE62') + ci(w * .24, h * .57, 5, '#7FD08A') + ci(w * .86, h * .48, 6, '#4FAE62');
    return s + rc(w * .4, h * .86, w * .2, h * .08, p.acc, 2) + pa('M' + w * .4 + ' ' + h * .86 + 'h' + w * .2, '', '#fff', 1.5);
  };
  // học viện cổ điển: mặt tiền cột, đầu hồi tam giác, tháp đồng hồ vòm
  S.academy = function (w, h, p) {
    var s = steps(w * .22, h * .86, w * .56, 3, p.wall) + rc(w * .12, h * .46, w * .76, h * .4, p.wall) + cols(w * .2, w * .8, h * .5, h * .84, 6, shade(p.wall, .12));
    s += pl([[w * .08, h * .46], [w * .5, h * .24], [w * .92, h * .46]], p.roof) + ci(w * .5, h * .38, 8, p.acc, 'rgba(0,0,0,.3)') + rc(w * .42, h * .1, w * .16, h * .2, shade(p.wall, .06)) + clock(w * .5, h * .2, 9);
    return s + pa('M' + w * .4 + ' ' + h * .1 + 'Q' + w * .5 + ' ' + (h * -.04) + ' ' + w * .6 + ' ' + h * .1 + 'Z', p.roof, 'rgba(0,0,0,.3)', 2) + door(w * .5 - 14, h * .64, 28, h * .22, p.acc);
  };
  // mẫu giáo: ba khối nhiều màu, mái tròn, cầu vồng, đồ chơi
  S.kinder = function (w, h, p) {
    var s = rc(w * .06, h * .5, w * .3, h * .42, '#FFB6C8') + rc(w * .36, h * .4, w * .28, h * .52, p.wall) + rc(w * .64, h * .5, w * .3, h * .42, '#B8E0FF'), i;
    s += pa('M' + w * .04 + ' ' + h * .5 + 'Q' + w * .21 + ' ' + h * .28 + ' ' + w * .38 + ' ' + h * .5 + 'Z', p.roof, 'rgba(0,0,0,.28)', 2) + pa('M' + w * .34 + ' ' + h * .4 + 'Q' + w * .5 + ' ' + h * .12 + ' ' + w * .66 + ' ' + h * .4 + 'Z', p.acc, 'rgba(0,0,0,.28)', 2) + pa('M' + w * .62 + ' ' + h * .5 + 'Q' + w * .79 + ' ' + h * .28 + ' ' + w * .96 + ' ' + h * .5 + 'Z', p.roof, 'rgba(0,0,0,.28)', 2);
    for (i = 0; i < 3; i++) s += ci(w * (.21 + i * .29), h * .66, 11, '#FFF8D8', 'rgba(0,0,0,.25)');
    ['#E5334B', '#F2842E', '#F2C94C', '#4FAE62', '#2B9BD8'].forEach(function (c, k) { s += pa('M' + (w * .18 + k * 3) + ' ' + h * .93 + 'Q' + w * .5 + ' ' + (h * .5 - k * 3) + ' ' + (w * .82 - k * 3) + ' ' + h * .93, '', c, 3); });
    return s + door(w * .5 - 12, h * .7, 24, h * .22, '#8A5A2E') + ci(w * .12, h * .9, 6, '#E5334B') + rc(w * .86, h * .86, 12, 12, '#F2C94C', 2);
  };
  // thư viện: khối chữ nhật có vòm kính lớn, cột và bậc thềm, sách trên cửa sổ
  S.library = function (w, h, p) {
    var s = steps(w * .2, h * .86, w * .6, 3, p.wall) + rc(w * .1, h * .44, w * .8, h * .42, p.wall) + cols(w * .2, w * .8, h * .5, h * .84, 5, shade(p.wall, .1)), i;
    s += pa('M' + w * .22 + ' ' + h * .44 + 'Q' + w * .5 + ' ' + (h * -.1) + ' ' + w * .78 + ' ' + h * .44 + 'Z', GLASS2, 'rgba(0,0,0,.3)', 2.4) + pa('M' + w * .5 + ' ' + h * .44 + 'V' + h * .1 + 'M' + w * .36 + ' ' + h * .44 + 'Q' + w * .4 + ' ' + h * .18 + ' ' + w * .46 + ' ' + h * .12 + 'M' + w * .64 + ' ' + h * .44 + 'Q' + w * .6 + ' ' + h * .18 + ' ' + w * .54 + ' ' + h * .12, '', 'rgba(255,255,255,.8)', 2);
    s += rc(w * .06, h * .42, w * .88, h * .05, p.roof);
    for (i = 0; i < 4; i++) s += rc(w * (.26 + i * .14), h * .54, 16, h * .16, ['#E5534B', '#2B9BD8', '#F2C94C', '#4FAE62'][i], 2);
    return s + door(w * .5 - 12, h * .7, 24, h * .16, p.acc);
  };
  // biệt thự hiện đại: các khối phẳng chồng lệch, kính lớn, hồ bơi
  S.villa = function (w, h, p) {
    var s = rc(w * .06, h * .56, w * .5, h * .36, p.wall) + rc(w * .3, h * .3, w * .46, h * .3, shade(p.wall, .06)) + rc(w * .58, h * .6, w * .34, h * .32, p.wall);
    s += rc(w * .02, h * .52, w * .58, h * .06, p.roof) + rc(w * .26, h * .26, w * .54, h * .06, p.roof) + rc(w * .54, h * .56, w * .42, h * .06, p.roof);
    s += rc(w * .34, h * .36, w * .38, h * .18, GLASS2, 2) + rc(w * .1, h * .64, w * .42, h * .14, GLASS2, 2) + rc(w * .62, h * .68, w * .26, h * .12, GLASS2, 2);
    return s + el(w * .75, h * .92, w * .16, 9, '#5BC6E8') + el(w * .75, h * .91, w * .12, 6, '#8EDCF8') + ci(w * .12, h * .5, 7, '#4FAE62') + rc(w * .16, h * .56, 5, h * .06, '#6B4A2B', 0);
  };
  // nhà trên cây: thân cây lớn, sàn gỗ, nhà nhỏ mái lá, cầu thang dây
  S.treehouse = function (w, h, p) {
    var s = rc(w * .42, h * .42, w * .16, h * .52, '#7A5230') + pa('M' + w * .42 + ' ' + h * .94 + 'q-16 4 -26 0M' + w * .58 + ' ' + h * .94 + 'q16 4 26 0', '', '#7A5230', 6) + ci(w * .5, h * .26, w * .26, '#3F9A4A') + ci(w * .26, h * .34, w * .16, '#4FAE62') + ci(w * .76, h * .32, w * .17, '#4FAE62');
    s += rc(w * .24, h * .5, w * .52, 8, '#9A6A3A') + rc(w * .32, h * .3, w * .36, h * .21, p.wall) + pl([[w * .28, h * .31], [w * .5, h * .14], [w * .72, h * .31]], p.roof) + win(w * .4, h * .35, 18, 18, GLASS) + door(w * .54, h * .38, 16, h * .12, p.acc);
    return s + pa('M' + w * .3 + ' ' + h * .52 + 'L' + w * .22 + ' ' + h * .92, '', '#C9A66A', 3) + pa('M' + w * .34 + ' ' + h * .52 + 'L' + w * .26 + ' ' + h * .92, '', '#C9A66A', 3) + [0, 1, 2, 3, 4].map(function (k) { return pa('M' + (w * .3 - k * 4 + 1) + ' ' + (h * .58 + k * h * .08) + 'h-' + 6, '', '#C9A66A', 3); }).join('') + flag(w * .72, h * .3, p.acc);
  };
  // bungalow: nhà thấp dài mái lá, hiên có cột, ghế võng
  S.bungalow = function (w, h, p) {
    var s = rc(w * .1, h * .52, w * .8, h * .36, p.wall) + pl([[w * .02, h * .56], [w * .18, h * .3], [w * .82, h * .3], [w * .98, h * .56]], p.roof), i;
    for (i = 0; i < 12; i++) s += pa('M' + (w * .08 + i * w * .07) + ' ' + h * .52 + 'l-3 10', '', 'rgba(0,0,0,.2)', 1.4);
    s += win(w * .18, h * .6, 30, h * .16, GLASS) + win(w * .62, h * .6, 30, h * .16, GLASS) + door(w * .46, h * .6, 26, h * .28, p.acc) + rc(w * .06, h * .84, w * .88, 6, '#9A6A3A');
    for (i = 0; i < 4; i++) s += rc(w * (.1 + i * .27), h * .56, 6, h * .3, '#8A5A2E', 1, 0);
    return s + pa('M' + w * .76 + ' ' + h * .8 + 'q12 10 24 0', '', '#E5534B', 4);
  };
  // nhà kính: khung vòm với tấm kính, cây xanh bên trong
  S.glasshouse = function (w, h, p) {
    var s = rc(w * .06, h * .82, w * .88, h * .12, shade(p.wall, -.05)) + pa('M' + w * .1 + ' ' + h * .82 + 'V' + h * .5 + 'Q' + w * .1 + ' ' + h * .12 + ' ' + w * .5 + ' ' + h * .12 + 'Q' + w * .9 + ' ' + h * .12 + ' ' + w * .9 + ' ' + h * .5 + 'V' + h * .82 + 'Z', GLASS2, p.acc, 3), i;
    for (i = 1; i < 5; i++) s += pa('M' + (w * .1 + w * .8 * i / 5) + ' ' + h * .82 + 'V' + h * .16, '', p.acc, 1.8);
    s += pa('M' + w * .1 + ' ' + h * .5 + 'H' + w * .9, '', p.acc, 1.8);
    s += ci(w * .3, h * .66, 14, '#3F9A4A') + ci(w * .5, h * .6, 18, '#4FAE62') + ci(w * .7, h * .68, 13, '#2E8A4F') + ci(w * .4, h * .72, 6, '#FF8AC0') + ci(w * .62, h * .74, 6, '#F2C94C');
    return s + pa('M' + w * .5 + ' ' + h * .12 + 'v-12', '', p.acc, 3) + door(w * .5 - 12, h * .7, 24, h * .24, 'rgba(120,180,210,.8)');
  };
  // kim tự tháp bậc thang: 4 tầng + cầu thang trung tâm + đền đỉnh
  S.ziggurat = function (w, h, p) {
    var s = '', i, n = 4;
    for (i = 0; i < n; i++) { var x = w * (.06 + i * .1), bw = w * (.88 - i * .2), y = h * (.82 - i * .16); s += rc(x, y, bw, h * .16, shade(p.wall, -.06 * i)) + pa('M' + x + ' ' + (y + 5) + 'H' + (x + bw), '', 'rgba(0,0,0,.18)', 1.6); }
    s += pl([[w * .44, h * .98], [w * .56, h * .98], [w * .53, h * .26], [w * .47, h * .26]], shade(p.wall, .18)) + rc(w * .4, h * .12, w * .2, h * .14, p.acc) + pl([[w * .38, h * .13], [w * .5, h * .02], [w * .62, h * .13]], p.roof) + door(w * .46, h * .17, w * .08, h * .09, '#3A2A1A');
    return s + ci(w * .12, h * .8, 5, '#4FAE62') + ci(w * .88, h * .8, 5, '#4FAE62');
  };
  // nhà hát / đấu trường cổ: các bậc khán đài bán nguyệt + hàng cột
  S.amphi = function (w, h, p) {
    var s = pa('M' + w * .04 + ' ' + h * .9 + 'Q' + w * .5 + ' ' + (h * .12) + ' ' + w * .96 + ' ' + h * .9 + 'Z', shade(p.wall, -.05), 'rgba(0,0,0,.3)', 2.4), i;
    for (i = 1; i < 5; i++) s += pa('M' + (w * .04 + i * w * .045) + ' ' + h * .9 + 'Q' + w * .5 + ' ' + (h * (.12 + i * .13)) + ' ' + (w * .96 - i * w * .045) + ' ' + h * .9, '', 'rgba(0,0,0,.2)', 2);
    s += el(w * .5, h * .9, w * .3, h * .06, p.roof) + rc(w * .2, h * .84, w * .6, h * .1, p.wall) + cols(w * .24, w * .76, h * .7, h * .86, 6, shade(p.wall, .15));
    return s + pa('M' + w * .22 + ' ' + h * .68 + 'H' + w * .78, '', p.acc, 5) + flag(w * .5, h * .22, p.acc);
  };
  // nhà bong bóng dưới nước: vòm trong suốt, san hô, bong bóng
  S.bubble = function (w, h, p) {
    var s = el(w * .5, h * .94, w * .46, 10, 'rgba(220,200,150,.8)') + pa('M' + w * .1 + ' ' + h * .9 + 'Q' + w * .1 + ' ' + h * .16 + ' ' + w * .5 + ' ' + h * .12 + 'Q' + w * .9 + ' ' + h * .16 + ' ' + w * .9 + ' ' + h * .9 + 'Z', 'rgba(160,230,250,.45)', 'rgba(255,255,255,.9)', 3), i;
    s += rc(w * .28, h * .56, w * .44, h * .34, p.wall) + pl([[w * .24, h * .58], [w * .5, h * .38], [w * .76, h * .58]], p.roof) + win(w * .36, h * .64, 22, 22, GLASS) + door(w * .52, h * .7, 20, h * .2, p.acc);
    for (i = 0; i < 5; i++) s += ci(w * (.2 + i * .15), h * (.3 + (i % 3) * .1), 4 + i % 3 * 2, 'rgba(255,255,255,.7)', 'rgba(120,200,230,.8)');
    return s + pa('M' + w * .16 + ' ' + h * .9 + 'q-6 -26 4 -40q8 12 2 40', '#FF7A8A', 'rgba(0,0,0,.2)', 1.6) + pa('M' + w * .84 + ' ' + h * .9 + 'q8 -22 -2 -36q-8 10 -2 36', '#5BE0C8', 'rgba(0,0,0,.2)', 1.6);
  };
  // dinh thự: hai cánh đối xứng, mái mansard, tháp góc, vườn trước
  S.mansion = function (w, h, p) {
    var s = rc(w * .06, h * .5, w * .88, h * .42, p.wall), i;
    s += pl([[w * .02, h * .52], [w * .1, h * .34], [w * .9, h * .34], [w * .98, h * .52]], p.roof) + rc(w * .38, h * .22, w * .24, h * .32, shade(p.wall, .06)) + pl([[w * .34, h * .24], [w * .5, h * .06], [w * .66, h * .24]], p.roof) + ci(w * .5, h * .34, 7, p.acc, 'rgba(0,0,0,.3)');
    s += rc(w * .06, h * .3, w * .12, h * .24, shade(p.wall, .04)) + pl([[w * .04, h * .32], [w * .12, h * .16], [w * .2, h * .32]], p.roof) + rc(w * .82, h * .3, w * .12, h * .24, shade(p.wall, .04)) + pl([[w * .8, h * .32], [w * .88, h * .16], [w * .96, h * .32]], p.roof);
    for (i = 0; i < 6; i++) s += arcWin(w * (.12 + i * .13) - 8, h * .6, 16, h * .18, GLASS);
    return s + door(w * .5 - 14, h * .66, 28, h * .26, p.acc) + steps(w * .44, h * .9, w * .12, 2, p.wall) + ci(w * .12, h * .92, 7, '#4FAE62') + ci(w * .88, h * .92, 7, '#4FAE62');
  };
  // toà cao tầng nhỏ: thân kính thon có bậc lùi, ăng-ten, đèn đỏ
  S.skyrise = function (w, h, p) {
    var s = rc(w * .3, h * .5, w * .4, h * .44, p.wall) + rc(w * .36, h * .26, w * .28, h * .26, shade(p.wall, .04)) + rc(w * .42, h * .08, w * .16, h * .2, shade(p.wall, .08)), i, j;
    for (i = 0; i < 6; i++) for (j = 0; j < 3; j++) s += rc(w * (.33 + j * .12), h * (.54 + i * .065), w * .09, h * .04, GLASS2, 1, 0);
    for (i = 0; i < 3; i++) s += rc(w * (.39 + i * .09), h * (.3 + (i % 2) * .08), w * .06, h * .04, GLASS2, 1, 0);
    return s + pa('M' + w * .5 + ' ' + h * .08 + 'v-' + h * .08, '', '#8A90A8', 3) + ci(w * .5, 2, 3, '#FF3B3B') + rc(w * .18, h * .8, w * .64, h * .14, p.acc, 4) + door(w * .5 - 12, h * .84, 24, h * .1, '#2A3A4A');
  };
  // cổng vòm / khải hoàn môn
  S.gate = function (w, h, p) {
    var s = rc(w * .1, h * .3, w * .8, h * .62, p.wall) + rc(w * .06, h * .24, w * .88, h * .1, shade(p.wall, .08)) + rc(w * .14, h * .16, w * .72, h * .08, p.roof), i;
    s += pa('M' + w * .32 + ' ' + h * .92 + 'V' + h * .56 + 'Q' + w * .32 + ' ' + h * .36 + ' ' + w * .5 + ' ' + h * .36 + 'Q' + w * .68 + ' ' + h * .36 + ' ' + w * .68 + ' ' + h * .56 + 'V' + h * .92 + 'Z', '#2A3A4A', 'rgba(0,0,0,.4)', 2);
    for (i = 0; i < 5; i++) s += rc(w * (.12 + i * .02) + (i > 1 ? w * .68 : 0), h * .5, 4, h * .16, 'rgba(0,0,0,.18)', 0, 0);
    return s + ci(w * .5, h * .2, 9, p.acc, 'rgba(0,0,0,.3)') + pa('M' + w * .1 + ' ' + h * .92 + 'H' + w * .9, '', 'rgba(0,0,0,.25)', 3);
  };
  // tháp đồng hồ cao
  S.clocktower = function (w, h, p) {
    var s = rc(w * .34, h * .34, w * .32, h * .6, p.wall) + rc(w * .3, h * .3, w * .4, h * .08, shade(p.wall, .08)) + pl([[w * .3, h * .3], [w * .5, h * .04], [w * .7, h * .3]], p.roof) + ci(w * .5, h * .46, w * .11, '#FFFDF2', 'rgba(0,0,0,.4)') + pa('M' + w * .5 + ' ' + h * .46 + 'v' + (-w * .07) + 'M' + w * .5 + ' ' + h * .46 + 'l' + w * .05 + ' ' + w * .02, '', '#3A2A1A', 3), i;
    for (i = 0; i < 12; i++) s += ci(w * .5 + Math.sin(i * Math.PI / 6) * w * .09, h * .46 - Math.cos(i * Math.PI / 6) * w * .09, 1.4, '#3A2A1A');
    return s + arcWin(w * .44, h * .6, 22, h * .18, GLASS) + door(w * .5 - 12, h * .8, 24, h * .14, p.acc) + ci(w * .5, h * .02, 4, p.acc) + rc(w * .28, h * .92, w * .44, 6, shade(p.wall, -.15));
  };
  // nhà hoa sen: mái cánh hoa nhiều lớp
  S.lotushouse = function (w, h, p) {
    var s = rc(w * .22, h * .56, w * .56, h * .36, p.wall), i;
    for (i = -2; i <= 2; i++) s += pa('M' + w * .5 + ' ' + h * .56 + 'Q' + (w * .5 + i * w * .18) + ' ' + (h * .16 - Math.abs(i) * -6) + ' ' + (w * .5 + i * w * .13) + ' ' + h * .52 + 'Q' + (w * .5 + i * w * .08) + ' ' + h * .58 + ' ' + w * .5 + ' ' + h * .56, shade(p.roof, i === 0 ? .1 : -Math.abs(i) * .06), 'rgba(0,0,0,.22)', 2);
    s += arcWin(w * .34, h * .64, 22, h * .2, GLASS) + arcWin(w * .6, h * .64, 22, h * .2, GLASS) + door(w * .5 - 11, h * .7, 22, h * .22, p.acc);
    return s + pa('M' + w * .08 + ' ' + h * .94 + 'q' + w * .1 + ' -10 ' + w * .2 + ' 0t' + w * .2 + ' 0t' + w * .2 + ' 0t' + w * .2 + ' 0t' + w * .2 + ' 0', '', 'rgba(255,255,255,.7)', 3) + ci(w * .5, h * .3, 6, '#F2C94C');
  };
  var NEW = { school: 1, campus: 1, academy: 1, kinder: 1, library: 1, villa: 1, treehouse: 1, bungalow: 1, glasshouse: 1, ziggurat: 1, amphi: 1, bubble: 1, mansion: 1, skyrise: 1, gate: 1, clocktower: 1, lotushouse: 1 };
  // đăng ký hình cho mọi công trình dùng kiểu mới (kể cả món chung "Kiến trúc" không thuộc khu nào)
  CAT.eachSpec(function (id, k, sp) {
    if (k !== 'b' || !NEW[sp[3]]) return;
    var w = sp[1], h = sp[2], st = S[sp[3]], pal = { wall: sp[4], roof: sp[5], acc: sp[6] }, feats = String(sp[7] || '').split('+').filter(Boolean);
    BIG[id] = function () { var W2 = w * 100, H2 = h * 100, s = '<g>' + el(W2 / 2, H2 - 2, W2 * .46, 7, 'rgba(20,50,20,.26)') + st(W2, H2, pal); feats.forEach(function (f) { if (FEAT[f]) s += FEAT[f](W2, H2, pal); }); return s + '</g>'; };
    BIGSIZE[id] = [w, h];
  });
  CAT.NEWSTYLES = NEW;
})(typeof window !== 'undefined' ? window : this);
