/* EWT Garden — CÔNG TRÌNH ĐẶC TRƯNG của các khu quốc gia & nông trại (Belém, Nyhavn, Petronas, Angkor, Atomium, chuồng bò, lều Mông Cổ…) dựng bằng bộ vẽ khối của City.
   Mỗi hàm: (A = EWTCityArt, g = bút vẽ, rw/rh = chân ô, p = màu) → vẽ khối đặc đúng chân đất (không còn tranh phẳng). Khoá = khoá ART của phong cảnh (vd 'dk_house').
   Nạp bởi garden-iso3d.js; thêm công trình mới: thêm 1 hàm vào LM + 1 dòng trong LMCOL (màu mặc định). */
(function (root) {
  'use strict';
  var LM = {}, COL = {};
  function sh(A, c, k) { return A.shade(c, k); }
  // hộp có cửa sổ 2 mặt
  function B(A, g, x, y, w, h, z0, z1, c, nx, ny) { g.box(x, y, w, h, z0, z1, c); if (nx) { g.winsL(x, y, w, h, z0 + 4, z1 - 4, nx, ny || 1, { m: .24 }); g.winsR(x, y, w, h, z0 + 4, z1 - 4, Math.max(1, Math.round(nx * h / w)), ny || 1, { m: .24 }); } }
  function water(g, rw, rh, c, ins) { ins = ins || .06; g.poly(g.faceT(ins, ins, rw - ins * 2, rh - ins * 2, 1), c || '#5FB7E8', 'rgba(20,70,120,.4)'); }
  function stone(A, g, x, y, w, h, z0, z1, c) { g.box(x, y, w, h, z0, z1, c); }
  function pole(A, g, cx, cy, z0, z1, c, r) { g.cyl(cx, cy, r || .03, z0, z1, c); }
  function stepsPyr(A, g, cx, cy, rw0, rh0, n, z0, dz, c) { var i; for (i = 0; i < n; i++) { var k = i / n, w = rw0 * (1 - k * .72), h = rh0 * (1 - k * .72); g.box(cx - w / 2, cy - h / 2, w, h, z0 + i * dz, z0 + (i + 1) * dz, sh(A, c, 1 - i * .02)); } }
  function fig(A, g, cx, cy, z, c, hc) { g.cyl(cx, cy, .1, z, z + 18, c); var h = g.P(cx, cy, z + 24); g.ell(h[0], h[1], 4, 4, hc || '#F4D0A8', 'rgba(0,0,0,.3)'); }
  function bush(A, g, cx, cy, r, c) { var p = g.P(cx, cy, 4); g.ell(p[0], p[1], r * 32, r * 17, c || '#4FA24A', 'rgba(20,60,20,.35)'); }
  function tower(A, g, x, y, w, h, z0, z1, c, roof, rc) { g.box(x, y, w, h, z0, z1, c); g.winsL(x, y, w, h, z0 + 5, z1 - 5, 1, 2, { m: .3 }); A.kit6.cone(g, x + w / 2, y + h / 2, Math.max(w, h) * .66, z1, z1 + (rc || 14), roof); }

  /* ───── NÔNG TRẠI ───── */
  LM.fvn_house = function (A, g, rw, rh, p) {   // nhà sàn mái tranh + ruộng bậc thang
    var i; for (i = 0; i < 3; i++) g.box(.1 + i * .08, rh - .62 - i * .52, rw - .2 - i * .16, .42, 0, 6 + i * 5, i % 2 ? '#C8D860' : '#8CC84A');
    var x = rw * .3, y = .12, w = rw * .46, h = rh * .34; [[0, 0], [1, 0], [0, 1], [1, 1]].forEach(function (q) { g.cyl(x + .06 + q[0] * (w - .12), y + .06 + q[1] * (h - .12), .04, 0, 22, '#9A7A3A'); });
    g.box(x, y, w, h, 22, 22 + 5, '#C9A66A'); g.box(x + .04, y + .04, w - .08, h - .08, 27, 46, '#D9B47A'); g.winsL(x + .04, y + .04, w - .08, h - .08, 31, 43, 2, 1, { m: .3, col: '#3A2A1A' });
    g.gable(x - .08, y - .06, w + .16, h + .12, 46, 66, false, '#C9A040', { wall: '#D9B47A' });
  };
  LM.fvn_big = function (A, g, rw, rh, p) {   // ruộng lúa nước
    g.box(.04, .04, rw - .08, rh - .08, 0, 3, '#9A7A3A'); g.poly(g.faceT(.12, .12, rw - .24, rh - .24, 3.4), '#6FB8D8', false); var i, j;
    for (j = 0; j < 3; j++) for (i = 0; i < 5; i++) { var q = g.P(.3 + i * (rw - .6) / 4, .35 + j * (rh - .6) / 2, 4); g.ell(q[0], q[1] - 5, 2.4, 6, '#7BC24A'); g.ell(q[0] + 2, q[1] - 3, 2, 5, '#9BD65A'); }
    g.cyl(rw - .3, .3, .03, 0, 30, '#9A7A3A'); g.cyl(rw - .6, .3, .03, 0, 30, '#9A7A3A'); g.box(rw - .74, .22, .5, .16, 30, 33, '#D9B47A'); g.gable(rw - .8, .18, .62, .24, 33, 46, false, '#C9A040', { wall: '#D9B47A' });
  };
  LM.fnl_house = function (A, g, rw, rh, p) {   // trại bò sữa: chuồng đỏ + tháp ủ
    B(A, g, .2, .5, rw * .62, rh * .5, 0, 30, '#C9503C', 3, 1); g.gable(.14, .44, rw * .62 + .12, rh * .5 + .12, 30, 52, true, '#7A5A3A', { wall: '#C9503C' });
    g.cyl(rw - .5, rh * .42, .3, 0, 64, '#CFD6DC'); A.kit6.cone(g, rw - .5, rh * .42, .3, 64, 78, '#8A94A0');
  };
  LM.fnl_big = function (A, g, rw, rh, p) {   // chợ phô mai
    var i; g.box(.2, .5, rw - .4, rh - 1, 0, 14, '#B58555'); for (i = 0; i < 4; i++) { var cx = .5 + (i % 2) * .8 * (rw - 1), cy = .8 + Math.floor(i / 2) * .45; g.cyl(cx, cy, .22, 14, 24, i % 2 ? '#F2C94C' : '#E8B83A'); }
    g.cyl(.3, .3, .03, 0, 40, '#8A5A2E'); g.cyl(rw - .3, .3, .03, 0, 40, '#8A5A2E'); g.box(.2, .22, rw - .4, rh - .4, 40, 44, '#C9503C');
  };
  LM.fch_house = function (A, g, rw, rh, p) {   // nhà gỗ Alps
    B(A, g, .35, .4, rw - .7, rh - .8, 0, 34, '#B98A55', 2, 1); g.box(.3, rh - .62, rw - .6, .2, 22, 25, '#8A5A2E'); g.gable(.22, .32, rw - .44, rh - .64, 34, 60, true, '#7A4B2A', { wall: '#B98A55', over: .2 });
    g.cyl(rw - .6, .6, .08, 52, 70, '#8A8A92');
  };
  LM.fch_big = function (A, g, rw, rh, p) { B(A, g, .25, .3, rw - .5, rh - .6, 0, 24, '#C9A06A', 1, 1); g.gable(.18, .24, rw - .36, rh - .48, 24, 42, true, '#8A5A33', { wall: '#C9A06A' }); [0, 1, 2].forEach(function (i) { g.cyl(.5 + i * .4, rh - .22, .12, 0, 8, '#F2C94C'); }); };
  LM.fau_house = function (A, g, rw, rh, p) {   // chuồng cắt lông cừu: mái tôn dài
    B(A, g, .15, .5, rw - .3, rh * .5, 0, 24, '#C9B88A', 4, 1); g.gable(.1, .44, rw - .2, rh * .5 + .12, 24, 44, true, '#9AA3AE', { wall: '#C9B88A', over: .1 });
    [0, 1, 2].forEach(function (i) { bush(A, g, .5 + i * .55, rh - .38, .26, '#F2F2EA'); });
  };
  LM.fau_big = function (A, g, rw, rh, p) { var i, j; for (j = 0; j < 2; j++) for (i = 0; i < 3; i++) g.box(.2 + i * (rw - .4) / 3, .3 + j * .6, (rw - .4) / 3 - .06, .5, 0, 16, '#F2EAD8'); };
  LM.fus_house = function (A, g, rw, rh, p) {   // chuồng đỏ kiểu Mỹ (mái gambrel) + silo
    B(A, g, .2, .45, rw * .62, rh * .52, 0, 32, '#B8402F', 2, 1); g.gable(.14, .39, rw * .62 + .12, rh * .52 + .12, 32, 62, true, '#4A4F5C', { wall: '#B8402F', over: .1 });
    g.cyl(rw - .5, rh * .5, .28, 0, 58, '#CFD6DC'); g.cyl(rw - .5, rh * .5, .28, 58, 62, '#8A94A0');
  };
  LM.fus_big = function (A, g, rw, rh, p) { g.box(.3, .5, rw - .6, rh - 1, 6, 18, '#9A6A3A'); g.box(.35, .55, rw - .7, rh - 1.1, 18, 30, '#E3C25A'); [.5, rw - .5].forEach(function (x) { g.cyl(x, rh - .45, .2, 0, 14, '#5A4030'); }); };
  LM.fmx_house = function (A, g, rw, rh, p) {   // hacienda: nhà bột trét + mái ngói + sân
    B(A, g, .2, .4, rw - .4, rh * .5, 0, 28, '#F2D9A8', 4, 1); g.hip(.14, .34, rw - .28, rh * .5 + .12, 28, 42, '#C9503C', .22); tower(A, g, rw - .7, .3, .5, .5, 0, 44, '#F2D9A8', '#C9503C', 10);
    g.box(.3, rh - .6, rw - .6, .1, 0, 14, '#E8C890');
  };
  LM.fmx_big = function (A, g, rw, rh, p) { var i, j; g.poly(g.faceT(.1, .1, rw - .2, rh - .2, 1), '#D9B070', false); for (j = 0; j < 2; j++) for (i = 0; i < 3; i++) { var q = g.P(.4 + i * (rw - .8) / 2, .5 + j * .8, 4); g.ell(q[0], q[1], 8, 4, '#5FA6A0', 'rgba(0,60,50,.4)'); g.ell(q[0], q[1] - 4, 3, 6, '#7FC0B4'); } };
  LM.far_house = function (A, g, rw, rh, p) {   // estancia Pampas: nhà trắng + hiên
    B(A, g, .2, .5, rw - .4, rh * .45, 0, 26, '#F6F0E0', 4, 1); g.gable(.14, .44, rw - .28, rh * .45 + .12, 26, 42, true, '#B8452E', { wall: '#F6F0E0' }); g.box(.2, .5 + rh * .45, rw - .4, .26, 0, 3, '#C9A06A');
  };
  LM.far_big = function (A, g, rw, rh, p) { g.box(.3, .5, rw - .6, .5, 0, 12, '#3A3A44'); [.5, .8, 1.1].forEach(function (x, i) { var q = g.P(Math.min(x, rw - .4), .75, 14); g.ell(q[0], q[1] - 3, 3, 7, i % 2 ? '#FF9A2E' : '#E9573F'); }); g.box(.3, .5 + .7, rw - .6, .3, 0, 8, '#8A5A33'); };
  LM.fmn_house = function (A, g, rw, rh, p) {   // trại lều Mông Cổ
    [[.9, .9, .62], [rw - .9, rh - .8, .5], [rw - .8, .8, .4]].forEach(function (q) { g.cyl(q[0], q[1], q[2], 0, 22, '#F2EAD8'); A.kit6.cone(g, q[0], q[1], q[2] * 1.12, 22, 22 + q[2] * 34, '#3E6A8A'); g.cyl(q[0], q[1] + q[2] * .85, .06, 0, 14, '#2E6B8A'); });
  };
  LM.fmn_big = function (A, g, rw, rh, p) { A.kit6.dome(g, rw / 2, rh / 2, rw * .4, 0, 26, '#9AA3AE'); var i; for (i = 0; i < 5; i++) { var q = g.P(rw / 2 + (i - 2) * .2, rh / 2 + .3, 12 + i % 2 * 4); g.ell(q[0], q[1], 3.4, 2.2, i % 2 ? '#4F9ED8' : '#F2F2F2'); } pole(A, g, rw / 2, rh / 2, 26, 46, '#6B4A2E'); };
  LM.ffr_house = function (A, g, rw, rh, p) {   // nông trại Provence đá + mái ngói
    B(A, g, .25, .4, rw - .5, rh * .55, 0, 30, '#E8D9B8', 3, 1); g.hip(.19, .34, rw - .38, rh * .55 + .12, 30, 46, '#C9703A', .2); g.box(rw - .75, .3, .4, .4, 30, 52, '#E8D9B8'); bush(A, g, .5, rh - .3, .3, '#7C9A5A');
  };
  LM.ffr_big = function (A, g, rw, rh, p) { var i, j; g.poly(g.faceT(.08, .08, rw - .16, rh - .16, 1), '#9BC068', false); for (j = 0; j < 4; j++) for (i = 0; i < 6; i++) { var q = g.P(.25 + i * (rw - .5) / 5, .3 + j * (rh - .6) / 3, 4); g.ell(q[0], q[1] - 4, 2, 6, '#9A6AD8'); g.ell(q[0] + 1, q[1] - 6, 1.6, 4, '#B48CF0'); } };
  LM.fke_house = function (A, g, rw, rh, p) {   // làng Maasai: nhà tròn mái tranh + hàng rào gai
    [[.8, .8], [rw - .8, .9], [rw / 2, rh - .8], [.9, rh - .9]].forEach(function (q, i) { g.cyl(q[0], q[1], .4, 0, 16, '#C9A06A'); A.kit6.cone(g, q[0], q[1], .5, 16, 34, i % 2 ? '#C9A55A' : '#B8934A'); });
  };
  LM.fke_big = function (A, g, rw, rh, p) { g.cyl(rw / 2, rh / 2, .1, 0, 38, '#6B4A2E'); var c = g.P(rw / 2, rh / 2, 46); g.ell(c[0], c[1], 34, 9, '#4F8A3A', 'rgba(20,60,20,.4)'); g.ell(c[0] - 6, c[1] - 5, 22, 6, '#6AAA4A'); };

  /* ───── QUỐC GIA ───── */
  LM.pt_house = function (A, g, rw, rh, p) {   // Tháp Belém
    var c = '#E8DCC0'; g.box(.5, .5, rw - 1, rh - 1, 0, 50, c); g.winsL(.5, .5, rw - 1, rh - 1, 10, 44, 2, 2, { m: .26 }); g.winsR(.5, .5, rw - 1, rh - 1, 10, 44, 2, 2, { m: .26 });
    g.box(.4, .4, rw - .8, rh - .8, 50, 56, sh(A, c, .95)); [[.4, .4], [rw - .4, .4], [.4, rh - .4], [rw - .4, rh - .4]].forEach(function (q) { g.cyl(q[0], q[1], .12, 50, 72, c); A.kit6.cone(g, q[0], q[1], .15, 72, 82, '#C9503C'); });
    g.box(.6, .6, rw - 1.2, rh - 1.2, 56, 80, sh(A, c, 1.04)); g.hip(.55, .55, rw - 1.1, rh - 1.1, 80, 96, '#A8A294', .3);
  };
  LM.pt_big = function (A, g, rw, rh, p) {   // tàu điện 28 vàng
    g.box(.2, .5, rw - .4, rh - 1, 8, 28, '#F2C94C'); g.winsL(.2, .5, rw - .4, rh - 1, 12, 24, 3, 1, { m: .2 }); g.box(.2, .5, rw - .4, rh - 1, 28, 31, '#EDEDED');
    [[.4, rh - .5], [rw - .4, rh - .5]].forEach(function (q) { var w = g.P(q[0], q[1], 6); g.ell(w[0], w[1], 5, 5, '#2A2A34'); }); pole(A, g, rw / 2, rh / 2, 31, 44, '#5A6470');
  };
  LM.pl_house = function (A, g, rw, rh, p) {   // phố cổ Warsaw: 3 nhà màu so le nhau, mỗi nhà lộ rõ mặt tiền
    var cols = ['#F2C94C', '#E8742E', '#7FA8E0'], hs = [44, 54, 40], i, w = (rw - .5) / 3;
    for (i = 0; i < 3; i++) { var x = .15 + i * (w + .1), y = .2 + (2 - i) * .55, d = 1.0; g.box(x, y, w, d, 0, hs[i], cols[i]); g.winsL(x, y, w, d, 8, hs[i] - 4, 1, 2, { m: .25 }); g.winsR(x, y, w, d, 8, hs[i] - 4, 1, 2, { m: .25 }); g.gable(x - .03, y - .03, w + .06, d + .06, hs[i], hs[i] + 16, true, i % 2 ? '#6B5A4A' : '#B8402F', { wall: cols[i] }); }
  };
  LM.pl_big = function (A, g, rw, rh, p) { g.box(rw / 2 - .4, rh / 2 - .3, .8, .6, 0, 12, '#9AA3AE'); g.box(rw / 2 - .3, rh / 2 - .22, .6, .44, 12, 20, '#B8C0C8'); fig(A, g, rw / 2, rh / 2, 20, '#2E9B6A'); var s = g.P(rw / 2 + .3, rh / 2, 36); g.ell(s[0], s[1], 7, 2, '#B8C0C8'); };
  LM.at_house = function (A, g, rw, rh, p) {   // pháo đài Hohensalzburg trên đồi
    A.kit6.dome(g, rw / 2, rh / 2, Math.min(rw, rh) * .5, 0, 28, '#8CB86A'); g.box(.8, .8, rw - 1.6, rh - 1.6, 28, 54, '#F2EAD8'); g.winsL(.8, .8, rw - 1.6, rh - 1.6, 34, 50, 2, 1); g.gable(.74, .74, rw - 1.48, rh - 1.48, 54, 68, true, '#7A8A9A', { wall: '#F2EAD8' });
    tower(A, g, .7, .7, .4, .4, 28, 70, '#E8DCC0', '#B8402F', 14); tower(A, g, rw - 1.1, rh - 1.1, .4, .4, 28, 64, '#E8DCC0', '#B8402F', 12);
  };
  LM.at_big = function (A, g, rw, rh, p) { g.box(rw / 2 - .35, rh / 2 - .3, .7, .6, 0, 16, '#B8B0A0'); fig(A, g, rw / 2, rh / 2, 16, '#3A3A5A'); };
  LM.dk_house = function (A, g, rw, rh, p) {   // Nyhavn: dãy nhà màu bên kênh
    water(g, rw, rh, '#5BA8D8', .04); var cols = ['#F2C94C', '#E5334B', '#2B6BC8', '#2E9B6A', '#E8742E'], i, w = (rw - .3) / 5;
    for (i = 0; i < 5; i++) { var x = .15 + i * w, hz = 44 + (i % 2) * 14; g.box(x, .15, w - .03, 1.0, 0, hz, cols[i]); g.winsL(x, .15, w - .03, 1.0, 8, hz - 4, 1, 2, { m: .22 }); g.gable(x - .02, .12, w + .01, 1.06, hz, hz + 16, false, '#F4EAD8', { wall: cols[i] }); }
    var m = g.P(rw * .75, rh - .5, 6); g.ell(m[0], m[1], 12, 3, '#8A5A2E'); pole(A, g, rw * .75, rh - .5, 6, 24, '#8A5A2E', .02);
  };
  LM.dk_big = function (A, g, rw, rh, p) {   // Nàng tiên cá trên tảng đá giữa nước
    water(g, rw, rh, '#5BA8D8', .05); A.kit6.dome(g, rw / 2, rh / 2, .55, 0, 26, '#8A8A92'); fig(A, g, rw / 2, rh / 2, 22, '#2E9B6A');
  };
  LM.fi_house = function (A, g, rw, rh, p) {   // nhà xông hơi Phần Lan bằng gỗ
    B(A, g, .35, .5, rw - .7, rh - 1, 0, 30, '#A67444', 2, 1); g.gable(.28, .44, rw - .56, rh - .88, 30, 48, true, '#4A4F5C', { wall: '#A67444' }); g.cyl(rw - .6, .7, .08, 40, 66, '#6B6B72'); var s = g.P(rw - .6, .7, 74); g.ell(s[0], s[1], 5, 3, 'rgba(255,255,255,.6)'); g.ell(s[0] + 4, s[1] - 7, 4, 2.4, 'rgba(255,255,255,.45)');
  };
  LM.fi_big = function (A, g, rw, rh, p) { A.kit6.cone(g, rw / 2, rh / 2, .7, 0, 44, '#E8DCC0'); g.box(rw / 2 - .1, rh / 2 + .4, .22, .05, 0, 18, '#5A3A1E'); A.kit6.cone(g, rw / 2, rh / 2, .35, 44, 56, '#F6F8FB'); [[.3, rh - .35], [rw - .3, rh - .3]].forEach(function (q) { var t = g.P(q[0], q[1], 6); g.ell(t[0], t[1], 8, 4, '#9A7A5A'); }); };
  LM.is_house = function (A, g, rw, rh, p) {   // Hallgrímskirkja
    var c = '#EDEDF2'; g.box(rw / 2 - .35, rh / 2 - .3, .7, .6, 0, 104, c); g.box(rw / 2 - .2, rh / 2 - .18, .4, .36, 104, 128, sh(A, c, 1.05)); A.kit6.cone(g, rw / 2, rh / 2, .22, 128, 150, '#C9D6E2');
    [-1, 1].forEach(function (d) { g.box(rw / 2 + d * .75 - .18, rh / 2 - .25, .36, .5, 0, 44 - Math.abs(d) * 4, sh(A, c, .96)); g.box(rw / 2 + d * 1.15 - .15, rh / 2 - .22, .3, .44, 0, 30, sh(A, c, .92)); }); g.box(rw / 2 - .5, rh / 2 + .3, 1, .5, 0, 24, sh(A, c, .98));
  };
  LM.is_big = function (A, g, rw, rh, p) { water(g, rw, rh, '#7FD4E8', .08); g.cyl(rw / 2, rh / 2, .07, 0, 46, '#F2FAFF'); var t = g.P(rw / 2, rh / 2, 54); g.ell(t[0], t[1], 16, 10, 'rgba(255,255,255,.85)'); g.ell(t[0] - 8, t[1] + 4, 10, 7, 'rgba(255,255,255,.75)'); g.ell(t[0] + 9, t[1] + 4, 9, 6, 'rgba(255,255,255,.7)'); };
  LM.cz_house = function (A, g, rw, rh, p) {   // Tháp đồng hồ cổ Praha
    B(A, g, .3, .6, rw - .6, rh - 1.2, 0, 34, '#E8D7B5', 4, 1); g.gable(.24, .54, rw - .48, rh - 1.08, 34, 46, true, '#B8402F', { wall: '#E8D7B5' });
    g.box(.5, .4, .62, .6, 0, 88, '#DCCBA5'); g.winsL(.5, .4, .62, .6, 54, 78, 1, 1, { m: .3 }); var c = g.P(.81, .4, 62); g.ell(c[0], c[1], 5, 5, '#F6F0E0', '#6B5A3A'); A.kit6.cone(g, .81, .7, .46, 88, 112, '#5A8A72');
  };
  LM.cz_big = function (A, g, rw, rh, p) {   // cầu Charles bằng đá + tượng
    water(g, rw, rh, '#5FA0C8', .05); var i; g.box(.1, rh / 2 - .2, rw - .2, .4, 8, 18, '#B8AC98'); for (i = 0; i < 3; i++) { var q = g.P(.4 + i * (rw - .8) / 2, rh / 2 + .2, 12); g.ell(q[0], q[1], 7, 5, '#3F6A8A'); } for (i = 0; i < 4; i++) g.box(.3 + i * (rw - .6) / 3, rh / 2 - .17, .08, .08, 18, 30, '#3A3A44'); g.box(.1, rh / 2 - .2, .36, .4, 0, 30, '#A89C86'); g.box(rw - .46, rh / 2 - .2, .36, .4, 0, 30, '#A89C86');
  };
  LM.hu_house = function (A, g, rw, rh, p) {   // Quốc hội Hungary
    var c = '#EDE4D0'; B(A, g, .15, .5, rw - .3, rh * .45, 0, 36, c, 7, 1); g.hip(.1, .46, rw - .2, rh * .45 + .08, 36, 46, '#C8554A', .3);
    A.kit6.dome(g, rw / 2, .5 + rh * .22, .55, 46, 30, '#C8554A'); [.7, rw - .7].forEach(function (x) { g.cyl(x, .6, .08, 46, 70, c); A.kit6.cone(g, x, .6, .1, 70, 82, '#C8554A'); });
    var wt = g.P(rw / 2, rh - .3, 1); g.poly(g.faceT(.05, rh * .45 + .7, rw - .1, rh * .3, 1), '#5B9ED8', false);
  };
  LM.hu_big = function (A, g, rw, rh, p) {   // cầu Xích
    water(g, rw, rh, '#5B9ED8', .05); g.box(.1, rh / 2 - .16, rw - .2, .32, 10, 14, '#B8B0A0'); [.5, rw - .5].forEach(function (x) { g.box(x - .12, rh / 2 - .18, .24, .36, 0, 54, '#D8D0BC'); }); var a = g.P(.5, rh / 2 + .2, 50), b = g.P(rw - .5, rh / 2 + .2, 50), m = g.P(rw / 2, rh / 2 + .2, 18); g.c.strokeStyle = '#4A4A52'; g.c.lineWidth = 1.6; g.c.beginPath(); g.c.moveTo(a[0], a[1]); g.c.quadraticCurveTo(m[0], m[1], b[0], b[1]); g.c.stroke();
  };
  LM.ph_house = function (A, g, rw, rh, p) {   // Đồi Sôcôla
    [[.8, .8, .7, 30], [rw - .8, .9, .6, 26], [rw / 2, rh / 2 + .2, .8, 36], [.9, rh - .8, .55, 22], [rw - .8, rh - .8, .62, 28]].forEach(function (q, i) { A.kit6.dome(g, q[0], q[1], q[2], 0, q[3], i % 2 ? '#8A6A3A' : '#9A7A44'); });
  };
  LM.ph_big = function (A, g, rw, rh, p) {   // xe jeepney
    g.box(.2, .5, rw - .4, rh - 1, 8, 24, '#F2C94C'); g.box(.2, .5, rw - .4, .12, 8, 24, '#E5334B'); g.winsL(.2, .5, rw - .4, rh - 1, 12, 22, 4, 1, { m: .2 }); g.box(.3, .55, rw - .6, rh - 1.1, 24, 27, '#E5334B'); [[.45, rh - .5], [rw - .45, rh - .5]].forEach(function (q) { var w = g.P(q[0], q[1], 6); g.ell(w[0], w[1], 5, 5, '#2A2A34'); g.ell(w[0], w[1], 2, 2, '#D9D9E0'); });
  };
  LM.nz_house = function (A, g, rw, rh, p) {   // nhà họp Marae chạm khắc
    B(A, g, .3, .5, rw - .6, rh - 1, 0, 30, '#8A3A2E', 3, 1); g.gable(.22, .44, rw - .44, rh - .88, 30, 56, false, '#C8402F', { wall: '#7A2E24' }); g.box(.3, rh - .52, rw - .6, .3, 0, 5, '#6B4A2E'); [.7, rw - .7].forEach(function (x) { g.cyl(x, rh - .4, .06, 0, 28, '#4A1A12'); });
  };
  LM.nz_big = function (A, g, rw, rh, p) {   // thuyền waka
    water(g, rw, rh, '#5BC6E8', .05); var m = g.P(rw / 2, rh / 2, 8); g.ell(m[0], m[1] + 2, 38, 9, '#4A1A12'); g.ell(m[0], m[1] - 2, 36, 8, '#8A3A2E'); g.poly([[m[0] + 34, m[1] - 4], [m[0] + 46, m[1] - 26], [m[0] + 38, m[1] - 2]], '#8A3A2E', '#4A1A12'); [-20, -6, 8, 22].forEach(function (d) { g.ell(m[0] + d, m[1] - 8, 3, 3, '#F4D0A8'); });
  };
  LM.sg_house = function (A, g, rw, rh, p) {   // Marina Bay Sands
    water(g, rw, rh, '#5BC6E8', .06); var c = '#8EC8E8', i, x; for (i = 0; i < 3; i++) { x = rw * (.25 + i * .25); g.box(x - .17, rh / 2 - .3, .34, .6, 0, 78, sh(A, c, i === 1 ? 1.05 : 1)); g.winsL(x - .17, rh / 2 - .3, .34, .6, 6, 74, 2, 8, { m: .2 }); }
    g.box(.2, rh / 2 - .26, rw - .4, .52, 78, 86, '#C8D0DC'); [.5, 1, 1.5].forEach(function (d) { bush(A, g, rw * .25 + d * (rw * .25), rh / 2, .12, '#3F8A3A'); });
  };
  LM.sg_big = function (A, g, rw, rh, p) {   // Merlion
    water(g, rw, rh, '#5BC6E8', .06); g.box(rw / 2 - .45, rh / 2 - .3, .9, .6, 0, 8, '#C8C2B4'); g.cyl(rw / 2, rh / 2, .32, 8, 40, '#F4F0E4'); g.cyl(rw / 2 - .05, rh / 2, .24, 40, 52, '#F4F0E4'); var h = g.P(rw / 2, rh / 2, 58); g.ell(h[0], h[1], 8, 7, '#F4F0E4', 'rgba(0,0,0,.3)'); var s = g.P(rw / 2 + .35, rh / 2, 46); g.ell(s[0], s[1], 10, 3, '#8EDCF8'); g.ell(s[0] + 8, s[1] + 10, 2, 8, '#8EDCF8');
  };
  LM.my_house = function (A, g, rw, rh, p) {   // Petronas Twin Towers
    var c = '#C8D4E4', i; [-1, 1].forEach(function (d) { var x = rw / 2 + d * .65; for (i = 0; i < 4; i++) { var k = 1 - i * .12, w = .62 * k; g.box(x - w / 2, rh / 2 - w / 2, w, w, i * 28, (i + 1) * 28, sh(A, c, 1 - i * .02)); g.winsL(x - w / 2, rh / 2 - w / 2, w, w, i * 28 + 4, (i + 1) * 28 - 3, 2, 2, { m: .2 }); } A.kit6.cone(g, x, rh / 2, .12, 112, 140, '#9AA8B8'); });
    g.box(rw / 2 - .4, rh / 2 - .08, .8, .16, 50, 58, '#9AA8B8');
  };
  LM.my_big = function (A, g, rw, rh, p) {   // hang Batu + tượng vàng + cầu thang
    A.kit6.dome(g, rw / 2 + .1, rh / 2 - .1, .75, 0, 36, '#8A8F99'); g.cyl(rw / 2 - .4, rh - .5, .1, 0, 44, '#F2C94C'); var h = g.P(rw / 2 - .4, rh - .5, 52); g.ell(h[0], h[1], 4, 4, '#F2C94C'); var i; for (i = 0; i < 6; i++) g.box(rw / 2 + .1 - .3, rh / 2 + .3 + i * .1, .6, .1, 0, 4 + (5 - i) * 2, '#C8C2B4');
  };
  LM.kh_house = function (A, g, rw, rh, p) {   // Angkor Wat
    var c = '#C9B88A'; g.box(.1, .1, rw - .2, rh - .2, 0, 8, '#B8A674'); g.box(.4, .4, rw - .8, rh - .8, 8, 22, c); g.box(.7, .7, rw - 1.4, rh - 1.4, 22, 36, sh(A, c, 1.04));
    [[.5, .5], [rw - .5, .5], [.5, rh - .5], [rw - .5, rh - .5]].forEach(function (q) { g.cyl(q[0], q[1], .16, 22, 56, c); A.kit6.cone(g, q[0], q[1], .2, 56, 74, '#B8A674'); }); g.cyl(rw / 2, rh / 2, .26, 36, 78, sh(A, c, 1.06)); A.kit6.cone(g, rw / 2, rh / 2, .3, 78, 108, '#B8A674');
  };
  LM.kh_big = function (A, g, rw, rh, p) {   // Bayon: tháp mặt người
    var c = '#9AA09A'; stepsPyr(A, g, rw / 2, rh / 2, rw - .2, rh - .2, 3, 0, 8, c); g.cyl(rw / 2, rh / 2, .3, 24, 62, sh(A, c, 1.05)); A.kit6.cone(g, rw / 2, rh / 2, .34, 62, 82, '#8A9088'); [[-.5, 0], [.5, 0]].forEach(function (d) { g.cyl(rw / 2 + d[0], rh / 2 + .1, .14, 24, 44, c); });
  };
  LM.np_house = function (A, g, rw, rh, p) {   // Bảo tháp Boudhanath
    stepsPyr(A, g, rw / 2, rh / 2, rw - .3, rh - .3, 3, 0, 6, '#F2F2EC'); A.kit6.dome(g, rw / 2, rh / 2, rw * .32, 18, 36, '#FBFBF6'); g.box(rw / 2 - .22, rh / 2 - .22, .44, .44, 54, 66, '#F2C94C'); A.kit6.cone(g, rw / 2, rh / 2, .16, 66, 92, '#E2B33C');
    var i; for (i = 0; i < 8; i++) { var a = i / 8 * 6.28, q = g.P(rw / 2 + Math.cos(a) * .9, rh / 2 + Math.sin(a) * .9, 24); g.ell(q[0], q[1], 2.2, 2.2, ['#E5334B', '#2B6BC8', '#F2C94C', '#2E9B6A'][i % 4]); }
  };
  LM.np_big = function (A, g, rw, rh, p) { A.kit6.cone(g, rw / 2, rh / 2, Math.min(rw, rh) * .5, 0, 70, '#8D97A6'); A.kit6.cone(g, rw / 2 - .05, rh / 2 - .04, Math.min(rw, rh) * .24, 42, 74, '#F6F8FB'); };
  LM.jo_house = function (A, g, rw, rh, p) {   // Kho báu Petra: mặt tiền cột khoét vào vách đá hồng
    var c = '#D9906A'; g.box(.1, .5, rw - .2, rh - 1, 0, 76, '#B8704A'); g.box(.5, rh - .55, rw - 1, .25, 0, 52, c); var i; for (i = 0; i < 4; i++) g.cyl(.7 + i * (rw - 1.4) / 3, rh - .3, .1, 0, 44, sh(A, c, 1.1)); g.box(.45, rh - .55, rw - .9, .3, 44, 52, sh(A, c, 1.05)); A.kit6.dome(g, rw / 2, rh - .45, .5, 52, 14, sh(A, c, 1.05)); g.box(rw / 2 - .2, rh - .3, .4, .1, 0, 30, '#5A3A2E');
  };
  LM.jo_big = function (A, g, rw, rh, p) { [[.7, .8, .55, 44], [rw - .6, .7, .45, 36], [rw / 2, rh - .6, .5, 28]].forEach(function (q) { g.cyl(q[0], q[1], q[2] * .8, 0, q[3], '#C9703A'); A.kit6.cone(g, q[0], q[1], q[2], q[3], q[3] + 8, '#B8602F'); }); };
  LM.be_house = function (A, g, rw, rh, p) {   // Grand Place: nhà phường hội mạ vàng + tháp, so le
    var cols = ['#E8D7B5', '#D9B85A', '#C9A06A'], i, w = (rw - .9) / 3;
    for (i = 0; i < 3; i++) { var x = .1 + i * (w + .08), y = .3 + (2 - i) * .5, hz = 38 + (i % 2) * 10, d = 1.0; g.box(x, y, w, d, 0, hz, cols[i]); g.winsL(x, y, w, d, 8, hz - 4, 1, 2, { m: .24 }); g.winsR(x, y, w, d, 8, hz - 4, 1, 2, { m: .24 }); g.gable(x - .02, y - .02, w + .04, d + .04, hz, hz + 12, true, '#6B5A3A', { wall: cols[i] }); }
    tower(A, g, rw - .6, rh - .75, .45, .45, 0, 84, '#DCCBA5', '#5A8A72', 22);
  };
  LM.be_big = function (A, g, rw, rh, p) {   // Atomium: 9 quả cầu
    var pts = [[0, 0, 1], [-.5, -.5, 0], [.5, -.5, 0], [-.5, .5, 0], [.5, .5, 0]], i; pts.forEach(function (q) { var c = g.P(rw / 2 + q[0] * .9, rh / 2 + q[1] * .9, 8); g.cyl(rw / 2 + q[0] * .9, rh / 2 + q[1] * .9, .03, 0, 30, '#9AA3AE'); });
    [[-.5, -.5, 30], [.5, -.5, 30], [-.5, .5, 30], [.5, .5, 30], [0, 0, 56], [-.5, -.5, 80], [.5, .5, 80]].forEach(function (q) { var c = g.P(rw / 2 + q[0] * .9, rh / 2 + q[1] * .9, q[2]); g.ell(c[0], c[1], 11, 11, '#D5DBE2', 'rgba(60,70,90,.5)'); g.ell(c[0] - 3, c[1] - 3, 4, 4, 'rgba(255,255,255,.7)'); });
  };
  LM.hr_house = function (A, g, rw, rh, p) {   // tường thành Dubrovnik + nhà mái cam
    g.box(.1, .5, rw - .2, .4, 0, 40, '#E3D4B0'); g.box(.1, rh - .8, rw - .2, .4, 0, 30, '#E3D4B0'); var i; for (i = 0; i < 5; i++) g.box(.15 + i * (rw - .4) / 5, .5, .22, .4, 40, 46, '#E3D4B0'); tower(A, g, .1, .4, .55, .6, 0, 66, '#E8DCC0', '#C8402F', 16);
    for (i = 0; i < 3; i++) { var x = .9 + i * .55; g.box(x, 1.1, .46, .6, 0, 22, '#F2EADA'); g.hip(x - .02, 1.08, .5, .64, 22, 30, '#C8402F', .25); }
  };
  LM.hr_big = function (A, g, rw, rh, p) {   // hồ bậc thang Plitvice
    var i; for (i = 0; i < 3; i++) { var z = (2 - i) * 7 + 3; g.box(.15 + i * .06, .15 + i * .5, rw - .3 - i * .12, .62, 0, z, '#6A9A5A'); g.poly(g.faceT(.2 + i * .06, .2 + i * .5, rw - .4 - i * .12, .52, z + .5), '#5BC6C8', false); }
    bush(A, g, .3, rh - .3, .28, '#4F8A3A'); bush(A, g, rw - .3, rh - .3, .28, '#4F8A3A');
  };
  LM.co_house = function (A, g, rw, rh, p) {   // Cartagena: nhà thuộc địa nhiều màu + ban công, so le
    var cols = ['#F2C94C', '#E5334B', '#2B9BD8', '#E8742E'], i, w = (rw - .45) / 4;
    for (i = 0; i < 4; i++) { var x = .1 + i * (w + .05), y = .25 + (3 - i) * .42, hz = 34 + (i % 2) * 8, d = .95; g.box(x, y, w, d, 0, hz, cols[i]); g.winsL(x, y, w, d, 8, hz - 4, 1, 2, { m: .2 }); g.winsR(x, y, w, d, 8, hz - 4, 1, 2, { m: .2 }); g.box(x, y + d - .02, w, .12, 20, 22, '#6B4A2E'); g.hip(x - .02, y - .02, w + .04, d + .04, hz, hz + 8, '#C9703A', .3); }
  };
  LM.co_big = function (A, g, rw, rh, p) {   // thung lũng Cocora: cọ sáp cao
    [[.5, .5, 70], [rw - .5, .6, 82], [rw / 2, rh / 2, 64], [.6, rh - .5, 76], [rw - .6, rh - .5, 60]].forEach(function (q) { g.cyl(q[0], q[1], .05, 0, q[2], '#D8D0B8'); var c = g.P(q[0], q[1], q[2] + 6); g.ell(c[0], c[1], 14, 5, '#4F9A3A', 'rgba(20,60,20,.4)'); g.ell(c[0], c[1] - 3, 9, 3, '#6AAA4A'); });
  };
  LM.tz_house = function (A, g, rw, rh, p) { A.kit6.cone(g, rw / 2, rh / 2, Math.min(rw, rh) * .5, 0, 82, '#8A7A5A'); A.kit6.cone(g, rw / 2 - .05, rh / 2 - .04, Math.min(rw, rh) * .22, 54, 86, '#F6F8FB'); };
  LM.tz_big = function (A, g, rw, rh, p) {   // Serengeti: cây keo đỉnh bằng + hươu cao cổ
    g.cyl(rw / 2 - .3, rh / 2, .07, 0, 42, '#6B4A2E'); var c = g.P(rw / 2 - .3, rh / 2, 48); g.ell(c[0], c[1], 28, 8, '#5E9A3A', 'rgba(20,60,20,.4)'); g.ell(c[0] - 4, c[1] - 4, 17, 4, '#7AB44A');
    g.cyl(rw / 2 + .5, rh / 2 + .2, .12, 0, 20, '#E3B84A'); g.cyl(rw / 2 + .5, rh / 2 + .2, .05, 20, 46, '#E3B84A'); var h = g.P(rw / 2 + .5, rh / 2 + .2, 50); g.ell(h[0] + 2, h[1], 4, 3, '#E3B84A');
  };
  LM.sct_house = function (A, g, rw, rh, p) {   // Lâu đài Edinburgh trên núi đá
    A.kit6.dome(g, rw / 2, rh / 2, Math.min(rw, rh) * .5, 0, 26, '#8A8F99'); g.box(.7, .7, rw - 1.4, rh - 1.4, 26, 52, '#C9C2B4'); g.winsL(.7, .7, rw - 1.4, rh - 1.4, 32, 48, 3, 1); g.box(.62, .62, rw - 1.24, rh - 1.24, 52, 56, '#B8B0A0');
    tower(A, g, rw - 1.3, .6, .5, .5, 26, 72, '#C9C2B4', '#4A4F5C', 14);
  };
  LM.sct_big = function (A, g, rw, rh, p) {   // hồ Loch Ness + quái vật
    water(g, rw, rh, '#4F7FA8', .05); [[.6, rh / 2, 14], [rw / 2, rh / 2 + .1, 20], [rw - .6, rh / 2, 12]].forEach(function (q) { var c = g.P(q[0], q[1], 3); g.ell(c[0], c[1] - q[2] / 2, 9, q[2] * .6, '#3F7A4A', 'rgba(10,40,20,.5)'); });
  };


  /* ───── 6 NÔNG TRẠI MỚI (Nhật, Trung Quốc, Brazil, Ý, Ấn Độ, Thái) ───── */
  function rows(A, g, x0, y0, w, h, nx, ny, z, col, r) { var i, j; for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) { var q = g.P(x0 + w * (i + .5) / nx, y0 + h * (j + .5) / ny, z); g.ell(q[0], q[1] - 3, r || 4, (r || 4) * .8, col, 'rgba(20,60,20,.35)'); } }
  LM.fjp_house = function (A, g, rw, rh, p) {   // nhà minka mái tranh dốc + ruộng bậc thang
    var i; for (i = 0; i < 3; i++) g.box(.1 + i * .06, rh - .5 - i * .42, rw - .2 - i * .12, .36, 0, 5 + i * 5, i % 2 ? '#C8D860' : '#8CC84A');
    B(A, g, .5, .2, rw - 1, rh * .5, 0, 26, '#F2E8D0', 3, 1); g.gable(.36, .1, rw - .72, rh * .5 + .2, 26, 62, true, '#C9A55A', { wall: '#F2E8D0', over: .16 }); g.box(rw - .75, .3, .3, .3, 26, 66, '#8A7A5A');
  };
  LM.fjp_big = function (A, g, rw, rh, p) {   // ao cá koi + đèn đá
    water(g, rw, rh, '#6FB8D8', .1); g.poly(g.faceT(.04, .04, rw - .08, rh - .08, 1.5), 'rgba(0,0,0,0)', 'rgba(150,140,120,.8)');
    [[.8, .8, '#F2842E'], [1.3, 1.2, '#FFFFFF'], [.9, 1.4, '#E5334B']].forEach(function (q) { var c = g.P(q[0], q[1], 2); g.ell(c[0], c[1], 7, 3, q[2]); });
    g.box(rw - .55, .2, .3, .3, 0, 6, '#9A9488'); g.cyl(rw - .4, .35, .06, 6, 18, '#B8B0A0'); g.box(rw - .52, .23, .24, .24, 18, 24, '#B8B0A0'); A.kit6.cone(g, rw - .4, .35, .22, 24, 32, '#8A8478');
  };
  LM.fcn_house = function (A, g, rw, rh, p) {   // nhà sân vườn: 3 dãy nhà quanh sân, mái ngói xám
    B(A, g, .2, .25, rw - .4, .7, 0, 24, '#F0E6D2', 4, 1); g.gable(.12, .2, rw - .24, .8, 24, 40, true, '#7A8490', { wall: '#F0E6D2' });
    B(A, g, .2, rh - .85, rw - .4, .6, 0, 20, '#F0E6D2', 3, 1); g.gable(.12, rh - .9, rw - .24, .7, 20, 34, true, '#7A8490', { wall: '#F0E6D2' });
    g.box(rw / 2 - .18, rh - .62, .36, .02, 0, 14, '#B8402F');
  };
  LM.fcn_big = function (A, g, rw, rh, p) {   // đồi chè bậc thang
    var i; for (i = 0; i < 3; i++) { g.box(.1 + i * .06, .1 + i * .6, rw - .2 - i * .12, .55, 0, (3 - i) * 7, '#5FA04A'); rows(A, g, .2 + i * .06, .12 + i * .6, rw - .4 - i * .12, .5, 6, 1, (3 - i) * 7 + 1, i % 2 ? '#7AC25A' : '#3F8A32', 6); }
    g.cyl(rw - .35, .3, .04, 21, 40, '#8A5A2E'); A.kit6.cone(g, rw - .35, .3, .24, 40, 52, '#C9503C');
  };
  LM.fbr_house = function (A, g, rw, rh, p) {   // fazenda vàng có hiên và tháp chuông
    B(A, g, .2, .35, rw - .4, rh * .5, 0, 28, '#F2C94C', 4, 1); g.hip(.14, .29, rw - .28, rh * .5 + .12, 28, 44, '#C9503C', .2); var i; for (i = 0; i < 5; i++) g.cyl(.35 + i * (rw - .7) / 4, .35 + rh * .5 + .12, .035, 0, 22, '#F2E8D0'); g.box(.3, .35 + rh * .5, rw - .6, .26, 22, 25, '#F2E8D0'); tower(A, g, rw - .7, .2, .4, .4, 28, 56, '#F2C94C', '#C9503C', 12);
  };
  LM.fbr_big = function (A, g, rw, rh, p) {   // đồi cà phê chín đỏ + bao tải
    g.box(.05, .05, rw - .1, rh - .1, 0, 3, '#8A5A3A'); rows(A, g, .2, .2, rw - .4, rh - .7, 5, 3, 4, '#2E7A3A', 6); var i; for (i = 0; i < 10; i++) { var c = g.P(.35 + (i % 5) * (rw - .7) / 4, .35 + Math.floor(i / 5) * .55, 11); g.ell(c[0] + 2, c[1] - 2, 1.6, 1.6, '#E5334B'); }
    g.box(rw - .6, rh - .5, .26, .26, 3, 14, '#C9A66A'); g.box(rw - .85, rh - .45, .24, .24, 3, 11, '#C9A66A');
  };
  LM.fit_house = function (A, g, rw, rh, p) {   // biệt thự đá Tuscany + hàng bách
    B(A, g, .2, .35, rw - .9, rh * .5, 0, 30, '#EAD9B8', 3, 1); g.hip(.14, .29, rw - .78, rh * .5 + .12, 30, 46, '#C9703A', .2); tower(A, g, rw - .95, .25, .45, .45, 0, 58, '#EAD9B8', '#C9703A', 12);
    [.2, .5, .8, 1.1].forEach(function (d, i) { A.kit6.cone(g, rw - .3, rh - .3 - d * 1.6, .13, 0, 40 - i * 3, '#2E6A3A'); });
  };
  LM.fit_big = function (A, g, rw, rh, p) {   // vườn nho
    g.box(.05, .05, rw - .1, rh - .1, 0, 3, '#B8D880'); var j, i; for (j = 0; j < 3; j++) { for (i = 0; i < 6; i++) { var q = g.P(.3 + i * (rw - .6) / 5, .35 + j * .5, 6); g.cyl(.3 + i * (rw - .6) / 5, .35 + j * .5, .02, 3, 12, '#8A5A2E'); g.ell(q[0], q[1] - 4, 5, 3.6, i % 2 ? '#5A9A3A' : '#7AB24A'); g.ell(q[0] + 2, q[1] - 1, 1.8, 1.8, '#8A3A9A'); } }
  };
  LM.fin_house = function (A, g, rw, rh, p) {   // nhà đất làng quê: 2 nhà tròn mái tranh + tường sân
    [[.9, .9, .5], [rw - .9, rh - .9, .55]].forEach(function (q) { g.cyl(q[0], q[1], q[2], 0, 18, '#D9A070'); A.kit6.cone(g, q[0], q[1], q[2] * 1.15, 18, 18 + q[2] * 44, '#C9A55A'); g.box(q[0] - .12, q[1] + q[2] - .02, .24, .04, 0, 12, '#5A3A1E'); });
    g.box(.2, rh - .45, rw * .5, .1, 0, 8, '#C98A5A'); g.box(rw - .5, .2, .1, rh * .5, 0, 8, '#C98A5A');
  };
  LM.fin_big = function (A, g, rw, rh, p) {   // cánh đồng lúa mì + giếng
    g.box(.05, .05, rw - .1, rh - .1, 0, 3, '#E8C75A'); var j, i; for (j = 0; j < 4; j++) for (i = 0; i < 8; i++) { var q = g.P(.2 + i * (rw - .5) / 7, .25 + j * (rh - .5) / 3, 4); g.cyl(.2 + i * (rw - .5) / 7, .25 + j * (rh - .5) / 3, .02, 3, 14, '#C98A1A'); g.ell(q[0], q[1] - 11, 1.8, 3.2, '#F2C94C'); }
    g.cyl(rw - .35, .35, .22, 0, 10, '#B8B0A0'); g.cyl(rw - .35, .35, .15, 10, 11, '#6FB8D8');
  };
  LM.fth_house = function (A, g, rw, rh, p) {   // nhà sàn Thái trên nước
    water(g, rw, rh, '#5BA8D8', .05); var i; for (i = 0; i < 4; i++) g.cyl(.8 + (i % 2) * (rw - 1.6), .8 + Math.floor(i / 2) * (rh - 1.6), .05, 0, 24, '#6A4A2A');
    B(A, g, .7, .7, rw - 1.4, rh - 1.4, 24, 44, '#C9A06A', 2, 1); g.gable(.58, .58, rw - 1.16, rh - 1.16, 44, 66, true, '#8A5A2E', { wall: '#C9A06A', over: .16 }); g.box(.6, rh - .55, rw - 1.2, .16, 20, 23, '#6A4A2A');
    var m = g.P(rw - .45, rh - .4, 4); g.ell(m[0], m[1], 10, 3, '#C9503C');
  };
  LM.fth_big = function (A, g, rw, rh, p) {   // chợ nổi: 2 thuyền mui chất trái cây
    water(g, rw, rh, '#5BC6E8', .05); [[.7, .7, '#E5334B'], [1.3, 1.3, '#F2C94C']].forEach(function (q) { var m = g.P(q[0], q[1], 4); g.ell(m[0], m[1], 24, 7, '#8A5A2E'); g.ell(m[0], m[1] - 2, 22, 6, '#C9503C'); g.poly([[m[0] - 14, m[1] - 4], [m[0], m[1] - 20], [m[0] + 14, m[1] - 4]], q[2], 'rgba(0,0,0,.3)'); [-10, 0, 10].forEach(function (d, i) { g.ell(m[0] + d, m[1] - 4, 3, 3, ['#F2842E', '#F2D84A', '#E5334B'][i]); }); });
  };

  // màu mặc định khi tạo sprite (không quan trọng với kiểu tự chọn màu)
  Object.keys(LM).forEach(function (k) { COL[k] = ['#E8DCC0', '#B8402F']; });
  root.EWTGardenLM = { LM: LM, COL: COL };
})(typeof window !== 'undefined' ? window : this);
