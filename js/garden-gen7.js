/* EWT Garden — NÂNG CẤP ĐỒ HOẠ 12 kiểu công trình còn đơn giản (hang/mỏ, mái vòm, nhà sàn, hải đăng, bến tàu, chùa tháp, lều, cối xay, tàu, trạm công nghệ,
   lều tuyết, kim tự tháp): thêm đá/ván/ngói, ánh sáng, chi tiết đời sống. Nạp SAU garden-gen6.js, ghi đè CAT.HOUSE[kiểu] — không đổi mã món nên không ảnh hưởng dữ liệu. */
(function (root) {
  'use strict';
  var A = root.EWTGardenArt, W = root.EWTGardenWorld, CAT = root.EWTGardenCatalog; if (!A || !W || !CAT || !CAT.HOUSE) return;
  var shade = A.shade, S = CAT.HOUSE;
  function rc(x, y, w, h, f, rx, st) { return '<rect x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + w.toFixed(1) + '" height="' + h.toFixed(1) + '" rx="' + (rx || 0) + '" fill="' + f + '"' + (st === 0 ? '' : ' stroke="rgba(0,0,0,.28)" stroke-width="2"') + '/>'; }
  function pl(pts, f, st) { return '<polygon points="' + pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ') + '" fill="' + f + '"' + (st === 0 ? '' : ' stroke="rgba(0,0,0,.3)" stroke-width="2.4" stroke-linejoin="round"') + '/>'; }
  function pa(d, f, st, sw) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (st ? ' stroke="' + st + '" stroke-width="' + (sw || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"' : '') + '/>'; }
  function ci(x, y, r, f, st) { return '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="' + r + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function el(x, y, rx, ry, f) { return '<ellipse cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" rx="' + rx.toFixed(1) + '" ry="' + ry.toFixed(1) + '" fill="' + f + '"/>'; }
  var GLASS = '#CFE8F5', DARK = '#3A2A1A', LIGHT = '#FFE9A0';
  function win(x, y, w, h, c) { return rc(x, y, w, h, c || GLASS, 3) + rc(x + 2, y + 2, w * .4, h * .35, 'rgba(255,255,255,.55)', 2, 0) + pa('M' + (x + w / 2) + ' ' + y + 'v' + h + 'M' + x + ' ' + (y + h / 2) + 'h' + w, '', 'rgba(60,40,20,.45)', 1.5); }
  function door(x, y, w, h, c) { return rc(x, y, w, h, c || '#8A5A2E', Math.min(w / 2, 10)) + ci(x + w * .78, y + h * .55, 2.2, '#F2C94C') + pa('M' + (x + w / 2) + ' ' + (y + 3) + 'v' + (h - 3), '', 'rgba(0,0,0,.25)', 1.2); }
  function tuft(x, y, c) { return pa('M' + (x - 5) + ' ' + y + 'q2 -8 5 -2q2 -9 5 2', '', c || '#3E9E4B', 1.8); }
  function lantern(x, y, c) { return pa('M' + x + ' ' + (y - 8) + 'v8', '', '#6B4A2B', 1.4) + el(x, y + 5, 4.4, 6, c || '#E9573F') + '<g class="lampg">' + ci(x, y + 5, 11, 'rgba(255,225,130,.5)') + '</g>'; }
  function ground(w, h, c) { return el(w / 2, h * .955, w * .46, h * .045, 'rgba(0,0,0,.16)') + (c ? el(w / 2, h * .94, w * .42, h * .035, c) : ''); }

  /* hang / mỏ: đá nhiều lớp, miệng hang tối có khung gỗ, đèn, xe goòng, tinh thể */
  S.cave = function (w, h, p) {
    var rk = p.wall, s = ground(w, h) + pa('M' + w * .02 + ' ' + h * .96 + 'Q' + w * .05 + ' ' + h * .32 + ' ' + w * .3 + ' ' + h * .2 + 'Q' + w * .46 + ' ' + h * .02 + ' ' + w * .66 + ' ' + h * .16 + 'Q' + w * .96 + ' ' + h * .26 + ' ' + w * .98 + ' ' + h * .96 + 'Z', rk, 'rgba(0,0,0,.34)', 2.8);
    s += pa('M' + w * .5 + ' ' + h * .06 + 'Q' + w * .86 + ' ' + h * .2 + ' ' + w * .98 + ' ' + h * .96 + 'L' + w * .66 + ' ' + h * .96 + 'Q' + w * .7 + ' ' + h * .4 + ' ' + w * .5 + ' ' + h * .06 + 'Z', shade(rk, -.16)) + pa('M' + w * .12 + ' ' + h * .5 + 'Q' + w * .2 + ' ' + h * .3 + ' ' + w * .34 + ' ' + h * .26, '', shade(rk, .28), 3) + pa('M' + w * .08 + ' ' + h * .7 + 'Q' + w * .12 + ' ' + h * .52 + ' ' + w * .2 + ' ' + h * .46, '', shade(rk, .2), 2.4);
    s += pa('M' + w * .3 + ' ' + h * .96 + 'V' + h * .56 + 'Q' + w * .3 + ' ' + h * .36 + ' ' + w * .5 + ' ' + h * .34 + 'Q' + w * .7 + ' ' + h * .36 + ' ' + w * .7 + ' ' + h * .56 + 'V' + h * .96 + 'Z', '#241A14', 'rgba(0,0,0,.5)', 2.4) + pa('M' + w * .36 + ' ' + h * .96 + 'V' + h * .6 + 'Q' + w * .5 + ' ' + h * .5 + ' ' + w * .64 + ' ' + h * .6 + 'V' + h * .96 + 'Z', '#3E2E22');
    s += rc(w * .27, h * .46, w * .05, h * .5, '#8A5A2B') + rc(w * .68, h * .46, w * .05, h * .5, '#8A5A2B') + rc(w * .25, h * .43, w * .5, h * .05, '#A8753A', 2) + lantern(w * .4, h * .5, '#FFC93C') + lantern(w * .6, h * .5, '#FFC93C');
    s += pl([[w * .8, h * .62], [w * .84, h * .5], [w * .88, h * .62]], p.acc) + pl([[w * .86, h * .66], [w * .9, h * .54], [w * .94, h * .66]], shade(p.acc, .2)) + rc(w * .42, h * .86, w * .16, h * .08, '#7A8794', 3) + ci(w * .44, h * .95, 3, '#4B4F5A') + ci(w * .56, h * .95, 3, '#4B4F5A') + pa('M' + w * .12 + ' ' + h * .96 + 'h' + w * .76, '', 'rgba(0,0,0,.2)', 2);
    return s + tuft(w * .1, h * .96) + tuft(w * .9, h * .96);
  };
  /* mái vòm: khối có vòm lớn có gân, vòm phụ, cột tháp, cổng vòm và bậc thềm */
  S.dome = function (w, h, p) {
    var s = ground(w, h) + rc(w * .1, h * .52, w * .8, h * .42, p.wall) + rc(w * .06, h * .9, w * .88, h * .06, shade(p.wall, -.18)) + rc(w * .1, h * .52, w * .8, h * .04, shade(p.wall, .12), 0), i, n = Math.max(2, Math.round(w / 64));
    s += pa('M' + w * .26 + ' ' + h * .52 + 'Q' + w * .26 + ' ' + h * .1 + ' ' + w * .5 + ' ' + h * .1 + 'Q' + w * .74 + ' ' + h * .1 + ' ' + w * .74 + ' ' + h * .52 + 'Z', p.roof, 'rgba(0,0,0,.3)', 2.6) + pa('M' + w * .5 + ' ' + h * .52 + 'V' + h * .1 + 'M' + w * .38 + ' ' + h * .52 + 'Q' + w * .38 + ' ' + h * .16 + ' ' + w * .5 + ' ' + h * .1 + 'M' + w * .62 + ' ' + h * .52 + 'Q' + w * .62 + ' ' + h * .16 + ' ' + w * .5 + ' ' + h * .1, '', shade(p.roof, -.2), 1.4) + pa('M' + w * .3 + ' ' + h * .34 + 'Q' + w * .34 + ' ' + h * .18 + ' ' + w * .46 + ' ' + h * .13, '', 'rgba(255,255,255,.55)', 3);
    s += pa('M' + w * .5 + ' ' + h * .1 + 'v' + (-h * .08), '', p.acc, 3) + ci(w * .5, h * .02, 4, p.acc);
    for (i = 0; i < n; i++) { var cx = w * .2 + w * .6 * (i + .5) / n; s += pa('M' + (cx - 11) + ' ' + h * .94 + 'V' + h * .7 + 'Q' + cx + ' ' + h * .58 + ' ' + (cx + 11) + ' ' + h * .7 + 'V' + h * .94 + 'Z', '#2A3A55', 'rgba(0,0,0,.35)', 2) + pa('M' + (cx - 5) + ' ' + h * .94 + 'V' + h * .72 + 'Q' + cx + ' ' + h * .66 + ' ' + (cx + 5) + ' ' + h * .72 + 'V' + h * .94, '', 'rgba(255,230,140,.7)', 2); }
    for (i = 0; i < 2; i++) { var mx = i ? w * .85 : w * .09; s += rc(mx - 7, h * .26, 14, h * .68, shade(p.wall, .06)) + pa('M' + (mx - 9) + ' ' + h * .26 + 'Q' + mx + ' ' + h * .06 + ' ' + (mx + 9) + ' ' + h * .26 + 'Z', p.roof, 'rgba(0,0,0,.3)', 2) + ci(mx, h * .05, 2.6, p.acc) + rc(mx - 3, h * .4, 6, 10, '#2A3A55', 2, 0); }
    return s;
  };
  /* nhà sàn: cột gỗ, sàn có lan can, thang, mái dốc lợp lá có đường xếp lớp, đèn lồng */
  S.stilt = function (w, h, p) {
    var s = ground(w, h), i;
    for (i = 0; i < 5; i++) s += rc(w * (.14 + i * .17), h * .62, 8, h * .34, shade(p.wall, -.32), 2) + rc(w * (.14 + i * .17) - 2, h * .94, 12, 5, 'rgba(0,0,0,.18)', 2, 0);
    s += pa('M' + w * .14 + ' ' + h * .8 + 'L' + w * .78 + ' ' + h * .9 + 'M' + w * .78 + ' ' + h * .8 + 'L' + w * .14 + ' ' + h * .9, '', shade(p.wall, -.3), 2);
    s += rc(w * .06, h * .56, w * .88, 12, shade(p.wall, -.08)) + planksH(w * .06, h * .56, w * .88, 12) + rc(w * .12, h * .3, w * .64, h * .27, p.wall) + win(w * .2, h * .38, 26, h * .13, GLASS) + door(w * .54, h * .36, 24, h * .21, p.acc);
    s += pl([[w * .02, h * .34], [w * .44, h * .04], [w * .86, h * .34]], p.roof) + pl([[w * .44, h * .04], [w * .86, h * .34], [w * .44, h * .34]], shade(p.roof, -.14), 0);
    for (i = 1; i < 5; i++) s += pa('M' + (w * .44 - w * .42 * i / 5) + ' ' + (h * .04 + h * .3 * i / 5) + 'L' + (w * .44 + w * .42 * i / 5) + ' ' + (h * .04 + h * .3 * i / 5), '', shade(p.roof, -.28), 1.3);
    s += pa('M' + w * .06 + ' ' + h * .56 + 'v-14M' + w * .94 + ' ' + h * .56 + 'v-14M' + w * .06 + ' ' + h * .5 + 'H' + w * .12 + 'M' + w * .8 + ' ' + h * .5 + 'H' + w * .94, '', shade(p.wall, -.25), 2.2) + lantern(w * .2, h * .56, '#E9573F');
    for (i = 0; i < 5; i++) s += rc(w * .84 + i * 3, h * .58 + i * h * .075, 22, 4, '#8A5A2B', 1, 0);
    return s + tuft(w * .08, h * .96) + tuft(w * .92, h * .96);
  };
  function planksH(x, y, w, h) { var s = '', i; for (i = 1; i < 6; i++) s += pa('M' + (x + w * i / 6) + ' ' + y + 'v' + h, '', 'rgba(0,0,0,.2)', 1); return s; }
  /* hải đăng: thân sọc có cửa sổ, ban công, đèn phát tia sáng, nhà người gác và đá */
  S.lighthouse = function (w, h, p) {
    var s = ground(w, h) + el(w * .5, h * .95, w * .38, h * .05, '#8A98A8') + pl([[w * .3, h * .96], [w * .7, h * .96], [w * .6, h * .28], [w * .4, h * .28]], p.wall), i;
    for (i = 0; i < 3; i++) s += pl([[w * (.34 + i * .02), h * (.82 - i * .22)], [w * (.66 - i * .02), h * (.82 - i * .22)], [w * (.63 - i * .02), h * (.62 - i * .22)], [w * (.37 + i * .02), h * (.62 - i * .22)]], p.roof, 0);
    s += pa('M' + w * .4 + ' ' + h * .28 + 'L' + w * .46 + ' ' + h * .96, '', 'rgba(255,255,255,.35)', 3) + win(w * .46, h * .5, 16, 20, GLASS) + win(w * .46, h * .72, 16, 20, GLASS) + door(w * .46, h * .86, 14, h * .1, p.acc);
    s += rc(w * .34, h * .22, w * .32, 9, '#3B3F4A', 2) + pa('M' + w * .34 + ' ' + h * .22 + 'v-8M' + w * .66 + ' ' + h * .22 + 'v-8M' + w * .5 + ' ' + h * .22 + 'v-8', '', '#3B3F4A', 2) + rc(w * .38, h * .1, w * .24, h * .12, LIGHT, 3) + pl([[w * .36, h * .1], [w * .5, h * -.02], [w * .64, h * .1]], p.roof) + ci(w * .5, h * -.025, 3, p.acc);
    s += '<g class="lampg">' + pl([[w * .62, h * .16], [w * 1.02, h * .06], [w * 1.02, h * .26]], 'rgba(255,240,150,.38)', 0) + pl([[w * .38, h * .16], [w * -.02, h * .06], [w * -.02, h * .26]], 'rgba(255,240,150,.38)', 0) + '</g>';
    s += rc(w * .68, h * .8, w * .22, h * .16, '#F2EAD8') + pl([[w * .66, h * .8], [w * .79, h * .7], [w * .92, h * .8]], '#C9503C') + door(w * .76, h * .86, 9, h * .1, '#6B4A2B') + pa('M' + w * .04 + ' ' + h * .97 + 'q' + w * .06 + ' -8 ' + w * .12 + ' 0t' + w * .12 + ' 0', '', 'rgba(255,255,255,.6)', 2);
    return s;
  };
  /* bến tàu: cầu gỗ có cọc, nhà kho, thùng hàng, thuyền neo, phao */
  S.dock = function (w, h, p) {
    var s = el(w * .5, h * .94, w * .48, h * .06, 'rgba(70,150,220,.35)'), i;
    for (i = 0; i < 7; i++) s += rc(w * (.06 + i * .14), h * .72, 8, h * .24, '#4A2E18', 2);
    s += rc(w * .03, h * .66, w * .94, 12, '#A8753A') + planksH(w * .03, h * .66, w * .94, 12) + rc(w * .1, h * .3, w * .5, h * .37, p.wall) + planksH(w * .1, h * .3, w * .5, h * .37) + pl([[w * .06, h * .34], [w * .35, h * .1], [w * .64, h * .34]], p.roof) + pl([[w * .35, h * .1], [w * .64, h * .34], [w * .35, h * .34]], shade(p.roof, -.14), 0) + door(w * .24, h * .44, 24, h * .23, p.acc) + win(w * .46, h * .42, 20, 20, GLASS);
    s += rc(w * .68, h * .52, 18, 18, '#C98A55') + pa('M' + w * .68 + ' ' + h * .52 + 'l18 18M' + (w * .68 + 18) + ' ' + h * .52 + 'l-18 18', '', '#7A4A22', 1.4) + rc(w * .78, h * .56, 16, 14, '#B8743A') + el(w * .9, h * .62, 6, 8, '#8A5A2B');
    s += pl([[w * .7, h * .86], [w * .98, h * .86], [w * .92, h * .96], [w * .76, h * .96]], '#E9573F') + pa('M' + w * .84 + ' ' + h * .86 + 'V' + h * .6, '', '#6B4A2B', 2) + pl([[w * .84, h * .6], [w * .96, h * .82], [w * .84, h * .82]], '#FFFFFF') + ci(w * .04, h * .84, 6, '#E9573F', 'rgba(0,0,0,.3)') + pa('M' + w * .04 + ' ' + h * .78 + 'h0', '', '#fff', 2);
    return s + pa('M' + w * .62 + ' ' + h * .67 + 'q10 14 20 0', '', '#8A6A3A', 1.6);
  };
  /* chùa tháp: nhiều tầng mái cong vút, cửa sổ sáng đèn, nóc vàng, bậc đá */
  S.pagoda = function (w, h, p) {
    var n = h > 220 ? 5 : 4, i, s = ground(w, h) + rc(w * .14, h * .9, w * .72, h * .06, '#B9B3A6') + rc(w * .2, h * .86, w * .6, h * .05, '#CFC9BB'), th = h * .8 / n, y = h * .86;
    for (i = 0; i < n; i++) {
      var bw = w * (.58 - i * .08), y0 = y - (i + 1) * th, rw = bw + w * .2;
      s += rc(w / 2 - bw / 2, y0 + th * .34, bw, th * .5, p.wall) + rc(w / 2 - bw / 2, y0 + th * .34, bw * .18, th * .5, 'rgba(0,0,0,.1)', 0, 0) + rc(w / 2 - 7, y0 + th * .44, 14, th * .3, LIGHT, 3) + '<g class="lampg">' + ci(w / 2, y0 + th * .58, 13, 'rgba(255,225,130,.45)') + '</g>';
      s += pa('M' + (w / 2 - rw / 2 - 6) + ' ' + (y0 + th * .38) + 'Q' + (w / 2 - rw * .2) + ' ' + (y0 + th * .34) + ' ' + w / 2 + ' ' + (y0 - th * .02) + 'Q' + (w / 2 + rw * .2) + ' ' + (y0 + th * .34) + ' ' + (w / 2 + rw / 2 + 6) + ' ' + (y0 + th * .38) + 'Q' + w / 2 + ' ' + (y0 + th * .5) + ' ' + (w / 2 - rw / 2 - 6) + ' ' + (y0 + th * .38) + 'Z', p.roof, 'rgba(0,0,0,.32)', 2.4) + pa('M' + (w / 2 - rw / 2 - 6) + ' ' + (y0 + th * .38) + 'l-5 -5M' + (w / 2 + rw / 2 + 6) + ' ' + (y0 + th * .38) + 'l5 -5', '', p.acc, 3);
    }
    return s + pa('M' + w / 2 + ' ' + (y - n * th - 2) + 'v' + (-h * .12), '', p.acc, 3.4) + ci(w / 2, y - n * th - h * .12 - 3, 4, p.acc) + door(w / 2 - 12, h * .74, 24, h * .12, '#7A2E1E') + lantern(w * .2, h * .8, '#E9573F') + lantern(w * .8, h * .8, '#E9573F');
  };
  /* lều: vải sọc, diềm lượn sóng, cờ đuôi nheo, cọc & dây */
  S.tent = function (w, h, p) {
    var s = ground(w, h), i, n = 6, bx = w * .06, bw = w * .88;
    s += pl([[bx, h * .94], [w / 2, h * .16], [bx + bw, h * .94]], p.wall);
    for (i = 0; i < n; i += 2) s += pl([[bx + bw * i / n, h * .94], [w / 2, h * .16], [bx + bw * (i + 1) / n, h * .94]], p.roof, 0);
    s += pl([[w / 2, h * .16], [bx + bw, h * .94], [w / 2, h * .94]], 'rgba(0,0,0,.1)', 0);
    var v = ''; for (i = 0; i < n; i++) { var x0 = bx + bw * i / n, x1 = bx + bw * (i + 1) / n; v += pa('M' + x0 + ' ' + h * .56 + 'Q' + (x0 + x1) / 2 + ' ' + h * .66 + ' ' + x1 + ' ' + h * .56, i % 2 ? p.roof : p.wall, 'rgba(0,0,0,.25)', 1.6); }
    s += pa('M' + w * .22 + ' ' + h * .56 + 'H' + w * .78, '', 'rgba(0,0,0,.18)', 2) + v + pl([[w * .42, h * .94], [w / 2, h * .66], [w * .58, h * .94]], '#241A14') + pa('M' + w / 2 + ' ' + h * .16 + 'V' + h * .04, '', '#6B4A2B', 2.6) + pl([[w / 2, h * .04], [w / 2 + 26, h * .1], [w / 2 + 10, h * .13], [w / 2 + 26, h * .17], [w / 2, h * .13]], p.acc);
    return s + pa('M' + bx + ' ' + h * .94 + 'L' + (bx - 14) + ' ' + h * .98 + 'M' + (bx + bw) + ' ' + h * .94 + 'L' + (bx + bw + 14) + ' ' + h * .98, '', '#6B4A2B', 2) + ci(w * .12, h * .4, 3, '#FFD84A') + ci(w * .88, h * .4, 3, '#FF7AA8');
  };
  /* cối xay gió: chân đá, thân gỗ, mái chóp, 4 cánh có khung lưới, bao lúa */
  S.mill = function (w, h, p) {
    var s = ground(w, h) + pl([[w * .26, h * .96], [w * .74, h * .96], [w * .64, h * .5], [w * .36, h * .5]], '#9AA3AE') + pl([[w * .36, h * .5], [w * .64, h * .5], [w * .58, h * .3], [w * .42, h * .3]], p.wall), i, k;
    for (i = 0; i < 4; i++) s += pa('M' + (w * .26 + i * w * .02) + ' ' + (h * .96 - i * h * .115) + 'h' + (w * .48 - i * w * .04), '', 'rgba(0,0,0,.2)', 1.2);
    s += pl([[w * .38, h * .32], [w / 2, h * .12], [w * .62, h * .32]], p.roof) + door(w / 2 - 10, h * .78, 20, h * .18, p.acc) + win(w / 2 - 8, h * .54, 16, 18, GLASS) + rc(w * .66, h * .86, 14, 12, '#E8D7B5') + rc(w * .72, h * .88, 12, 10, '#D9C69A');
    for (i = 0; i < 4; i++) { s += '<g transform="rotate(' + (i * 90 + 18) + ' ' + w / 2 + ' ' + h * .26 + ')">' + rc(w / 2 - 2.5, h * .26 - h * .3, 5, h * .3, '#8A5A2B', 1, 0) + rc(w / 2 + 2, h * .26 - h * .27, 16, h * .2, '#F2EAD8', 1);
      for (k = 1; k < 4; k++) s += pa('M' + (w / 2 + 2) + ' ' + (h * .26 - h * .27 + h * .05 * k) + 'h16', '', 'rgba(0,0,0,.25)', 1); s += '</g>'; }
    return s + ci(w / 2, h * .26, 5, '#6B4A2B') + tuft(w * .12, h * .96) + tuft(w * .88, h * .96);
  };
  /* tàu: thân ván, ô cửa tròn, hai buồm căng gió, cờ, sóng nước */
  S.ship = function (w, h, p) {
    var s = el(w * .5, h * .95, w * .5, h * .055, 'rgba(60,140,210,.4)') + pa('M' + w * .06 + ' ' + h * .68 + 'Q' + w * .18 + ' ' + h * .98 + ' ' + w * .5 + ' ' + h * .98 + 'Q' + w * .82 + ' ' + h * .98 + ' ' + w * .94 + ' ' + h * .68 + 'Z', p.wall, 'rgba(0,0,0,.32)', 2.6) + rc(w * .06, h * .64, w * .88, 10, shade(p.wall, -.22)) + pa('M' + w * .1 + ' ' + h * .78 + 'Q' + w * .5 + ' ' + h * .9 + ' ' + w * .9 + ' ' + h * .78, '', shade(p.wall, -.2), 2), i;
    for (i = 0; i < 4; i++) s += ci(w * (.24 + i * .16), h * .76, 4.2, GLASS, 'rgba(0,0,0,.4)');
    s += rc(w * .47, h * .08, 6, h * .58, '#6B4A2B') + rc(w * .72, h * .26, 5, h * .4, '#6B4A2B') + pa('M' + w * .53 + ' ' + h * .12 + 'Q' + w * .86 + ' ' + h * .3 + ' ' + w * .53 + ' ' + h * .56 + 'Z', '#FFFDF2', 'rgba(0,0,0,.25)', 2) + pa('M' + w * .45 + ' ' + h * .16 + 'Q' + w * .18 + ' ' + h * .32 + ' ' + w * .45 + ' ' + h * .56 + 'Z', shade('#FFFDF2', -.06), 'rgba(0,0,0,.25)', 2) + pa('M' + w * .78 + ' ' + h * .3 + 'Q' + w * .92 + ' ' + h * .42 + ' ' + w * .78 + ' ' + h * .58 + 'Z', p.acc, 'rgba(0,0,0,.25)', 2);
    return s + pl([[w * .5, h * .02], [w * .62, h * .06], [w * .5, h * .1]], p.roof) + pa('M' + w * .06 + ' ' + h * .66 + 'L' + w * .47 + ' ' + h * .1 + 'M' + w * .94 + ' ' + h * .66 + 'L' + w * .5 + ' ' + h * .1, '', 'rgba(60,40,20,.5)', 1.2) + pa('M' + w * .04 + ' ' + h * .93 + 'q' + w * .06 + ' -9 ' + w * .12 + ' 0t' + w * .12 + ' 0t' + w * .12 + ' 0t' + w * .12 + ' 0', '', 'rgba(255,255,255,.65)', 2);
  };
  /* trạm công nghệ: tường kính, mái pin mặt trời, ăng-ten & đĩa vệ tinh, lõi phát sáng */
  S.tech = function (w, h, p) {
    var s = ground(w, h) + rc(w * .08, h * .34, w * .84, h * .6, p.wall) + rc(w * .08, h * .34, w * .84, 12, p.acc, 0, 0) + rc(w * .08, h * .88, w * .84, 7, shade(p.wall, -.2), 0), i, j;
    for (i = 0; i < Math.max(3, Math.round(w / 40)); i++) for (j = 0; j < 3; j++) s += rc(w * .13 + i * ((w * .74) / Math.max(3, Math.round(w / 40))), h * .46 + j * h * .14, (w * .74) / Math.max(3, Math.round(w / 40)) - 6, h * .09, (i + j) % 3 ? shade(p.roof, .2) : LIGHT, 3, 0);
    s += pl([[w * .06, h * .36], [w * .94, h * .36], [w * .88, h * .26], [w * .12, h * .26]], '#2A3A66') + pa('M' + w * .2 + ' ' + h * .26 + 'l-4 10M' + w * .4 + ' ' + h * .26 + 'l-4 10M' + w * .6 + ' ' + h * .26 + 'l-4 10M' + w * .8 + ' ' + h * .26 + 'l-4 10', '', 'rgba(150,200,255,.7)', 1.4);
    s += pa('M' + w * .28 + ' ' + h * .26 + 'V' + h * .06, '', '#8A90A8', 3.4) + ci(w * .28, h * .05, 5, p.acc) + '<g class="lampg">' + ci(w * .28, h * .05, 14, 'rgba(255,120,120,.5)') + '</g>' + pa('M' + w * .62 + ' ' + h * .26 + 'Q' + w * .7 + ' ' + h * .02 + ' ' + w * .82 + ' ' + h * .12 + 'Z', '#E8EDF2', 'rgba(0,0,0,.35)', 2) + pa('M' + w * .72 + ' ' + h * .1 + 'L' + w * .66 + ' ' + h * .26, '', '#8A90A8', 2.4) + door(w * .46, h * .74, 22, h * .2, p.acc);
    return s;
  };
  /* lều tuyết: khối băng xếp gạch, lối vào hầm, sương giá và cột băng */
  S.igloo = function (w, h, p) {
    var s = ground(w, h, '#F2F7FC') + pa('M' + w * .06 + ' ' + h * .94 + 'Q' + w * .06 + ' ' + h * .1 + ' ' + w * .5 + ' ' + h * .08 + 'Q' + w * .94 + ' ' + h * .1 + ' ' + w * .94 + ' ' + h * .94 + 'Z', p.wall, 'rgba(60,100,150,.55)', 2.8), j, k;
    for (j = 0; j < 5; j++) { var yy = h * (.84 - j * .15), hw = w * (.42 - j * .055); s += pa('M' + (w / 2 - hw) + ' ' + yy + 'Q' + w / 2 + ' ' + (yy - h * .07) + ' ' + (w / 2 + hw) + ' ' + yy, '', 'rgba(70,110,170,.45)', 1.6); for (k = 1; k < 5; k++) s += pa('M' + (w / 2 - hw + hw * 2 * (k + j % 2 * .5) / 5) + ' ' + yy + 'v' + (-h * .1), '', 'rgba(70,110,170,.35)', 1.3); }
    s += pa('M' + w * .12 + ' ' + h * .5 + 'Q' + w * .2 + ' ' + h * .28 + ' ' + w * .36 + ' ' + h * .22, '', 'rgba(255,255,255,.8)', 4) + pa('M' + w * .36 + ' ' + h * .94 + 'V' + h * .72 + 'Q' + w * .5 + ' ' + h * .56 + ' ' + w * .64 + ' ' + h * .72 + 'V' + h * .94 + 'Z', '#1E2D45', 'rgba(30,60,100,.6)', 2.4) + rc(w * .4, h * .88, w * .2, 6, '#FFFFFF', 3, 0);
    for (k = 0; k < 5; k++) s += pl([[w * (.38 + k * .06) - 3, h * .72], [w * (.38 + k * .06) + 3, h * .72], [w * (.38 + k * .06), h * (.78 + (k % 2) * .03)]], '#CDEAF8', 0);
    return s + el(w * .14, h * .95, 14, 5, '#fff') + el(w * .86, h * .95, 16, 5, '#fff');
  };
  /* kim tự tháp: tầng bậc có bóng, lối vào, mặt trời vàng và cọc đá */
  S.pyramid = function (w, h, p) {
    var s = ground(w, h, shade(p.wall, .12)) + '', i, n = 6;
    for (i = 0; i < n; i++) { var y0 = h * (.92 - (i + 1) * .13), ww = w * (.9 - i * .14); s += rc(w / 2 - ww / 2, y0, ww, h * .13, i % 2 ? p.wall : shade(p.wall, -.06)) + rc(w / 2 + ww * .12, y0, ww * .38, h * .13, 'rgba(0,0,0,.12)', 0, 0) + rc(w / 2 - ww / 2, y0, ww, 4, shade(p.wall, .22), 0, 0); }
    s += pl([[w * .42, h * .14], [w / 2, h * .02], [w * .58, h * .14]], p.acc) + pa('M' + (w / 2 - 11) + ' ' + h * .92 + 'V' + h * .78 + 'H' + (w / 2 + 11) + 'V' + h * .92, '#241A14', 'rgba(0,0,0,.4)', 2) + ci(w * .86, h * .12, 9, '#FFD84A') + '<g class="lampg">' + ci(w * .86, h * .12, 17, 'rgba(255,225,130,.4)') + '</g>' + rc(w * .06, h * .84, 6, 14, shade(p.wall, -.15), 1) + rc(w * .88, h * .84, 6, 14, shade(p.wall, -.15), 1);
    return s;
  };
  /* đăng ký lại hình các công trình lớn dùng những kiểu vừa nâng cấp (BIG đã "bắt" hàm cũ lúc nạp gen3/gen6) */
  var BIG = W.BIG, BIGSIZE = W.BIGSIZE, FEAT = CAT.FEAT, NEWS = { cave: 1, dome: 1, stilt: 1, lighthouse: 1, dock: 1, pagoda: 1, tent: 1, mill: 1, ship: 1, tech: 1, igloo: 1, pyramid: 1, windmill2: 1 };
  S.windmill2 = function (w, h, p) { return S.mill(w, h, p); };
  if (BIG && BIGSIZE && FEAT) CAT.eachSpec(function (id, k, sp) {
    if (k !== 'b' || !NEWS[sp[3]]) return;
    var w = sp[1], h = sp[2], st = S[sp[3]]; if (!st) return;
    var pal = { wall: sp[4], roof: sp[5], acc: sp[6] }, feats = String(sp[7] || '').split('+').filter(Boolean);
    BIG[id] = function () { var W2 = w * 100, H2 = h * 100, lean = String(feats).indexOf('lean') >= 0, s = '<g>' + el(W2 / 2, H2 - 2, W2 * .46, 7, 'rgba(20,50,20,.28)') + (lean ? '<g transform="rotate(4.5 ' + W2 / 2 + ' ' + H2 + ')">' : '') + st(W2, H2, pal); feats.forEach(function (f) { if (FEAT[f]) s += FEAT[f](W2, H2, pal); }); return s + (lean ? '</g>' : '') + '</g>'; };
    BIGSIZE[id] = [w, h];
  });
})(typeof window !== 'undefined' ? window : this);
