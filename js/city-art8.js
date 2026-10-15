/* EWT City — ĐỒ HOẠ phần 8: CẦU (vòm đá, dây văng, giàn thép, cầu gỗ), GA & BẾN (ga kính, ga cổ, metro, bến xe) và công trình THEO MÙA / LỄ HỘI
   (xuân hạ thu đông, cây thông Noel, vòng quay ngựa gỗ, lều xiếc, cổng đèn lồng). R('mã','kiểu',{màu}) ở cuối file. */
(function (root) {
  'use strict';
  var A = root.EWTCityArt; if (!A || !A.kit || !A.kit6) return;
  var K = A.kit, house = K.house, lot = K.lot, def = K.def, INK = K.INK, shade = A.shade, K6 = A.kit6, cone = K6.cone, big = K6.big, sh = K6.sh, fence = K6.fence, flowersAt = K6.flowersAt, trees = K6.trees, chim = K6.chim, TAU = Math.PI * 2, HW = 32, HH = 16;
  var Z = {};
  var dot = function (g, x, y, r, c) { g.ell(x, y, r, r, c); };
  var waterBase = function (g, rw, rh, col) { g.keep = true; g.poly(g.faceT(0, 0, rw, rh, 0), col || '#5FB7E8', false); g.keep = false; var i; for (i = 0; i < 4; i++) { var q = g.P(.4 + i * (rw - .8) / 3, rh * (i % 2 ? .12 : .88), 0); g.line([q[0] - 7, q[1]], [q[0] + 7, q[1]], 'rgba(255,255,255,.4)', 1.2); } };
  var deck = function (g, rw, rh, z, w, col) { var y0 = rh * (1 - w) / 2; g.box(0, y0, rw, rh * w, z - 3, z, col || '#C9C0A8'); return y0; };
  var rails = function (g, rw, rh, z, w, col) { var y0 = rh * (1 - w) / 2, a = g.P(0, y0 + rh * w, z), b = g.P(rw, y0 + rh * w, z); g.line([a[0], a[1] - 6], [b[0], b[1] - 6], col || '#E8E4D8', 1.6); var i; for (i = 0; i <= 8; i++) { var q = g.P(rw * i / 8, y0 + rh * w, z); g.line(q, [q[0], q[1] - 6], col || '#E8E4D8', 1.1); } };
  var land = function (g, rw, rh, lv, p) { waterBase(g, rw, rh, p.water); };

  Z.b_arch = function (g, rw, rh, lv, p) {
    land(g, rw, rh, lv, p); var z = 14 + lv * 2, y0 = deck(g, rw, rh, z, .4, p.c1 || '#D9D3C4'), n = Math.max(2, Math.round(rw * 1.1)), i, w = rh * .4;
    for (i = 0; i < n; i++) { var ta = (i + .15) / n, tb = (i + .85) / n; g.quadL(0, y0, rw, w, ta, tb, 0, z - 6, p.water || '#4A97CF', false); var c = g.P(rw * (ta + tb) / 2, y0 + w, z - 6); g.ell(c[0], c[1], rw * 32 / n * .35, 5, p.c1 || '#D9D3C4', false); }
    rails(g, rw, rh, z, .4, p.c2 || '#B9B3A6'); g.tree(.2, .2, .5, p.tree); g.tree(rw - .2, rh - .2, .5, p.tree);
  };
  Z.b_cable = function (g, rw, rh, lv, p) {
    land(g, rw, rh, lv, p); var z = 12 + lv, y0 = deck(g, rw, rh, z, .3, p.c1 || '#EEF2F6'), H = 46 + lv * 8 + big(rw, rh) * 2, i, ys = y0 + rh * .15;
    [.28, .72].forEach(function (t) { g.box(rw * t - .1, ys - .08, .2, .16, z - 3, z + H, p.c2 || '#E9573F'); var top = g.P(rw * t, ys, z + H); dot(g, top[0], top[1], 1.8, '#FFE9A0'); });
    for (i = 0; i <= 9; i++) { var xs = rw * (.05 + i * .1), tw = xs < rw * .5 ? .28 : .72, a = g.P(rw * tw, ys, z + H - 4 - Math.abs(xs - rw * tw) * 3), b = g.P(xs, ys, z); g.line(a, b, p.c3 || 'rgba(230,230,240,.85)', 1); }
    g.tree(.15, .2, .5, p.tree);
  };
  Z.b_truss = function (g, rw, rh, lv, p) {
    land(g, rw, rh, lv, p); var z = 12 + lv, y0 = deck(g, rw, rh, z, .36, '#8A8F99'), H = 22 + lv * 3, i, yy = y0 + rh * .36, c = p.c1 || '#D9503C';
    [0, 1].forEach(function (s) { var yv = s ? y0 : yy; var a = g.P(0, yv, z), b = g.P(rw, yv, z); g.line([a[0], a[1] - H], [b[0], b[1] - H], c, 2.6); var n = Math.round(rw * 3); for (i = 0; i <= n; i++) { var q = g.P(rw * i / n, yv, z), q2 = g.P(rw * (i + .5) / n, yv, z); g.line([q[0], q[1]], [q2[0], q2[1] - H], c, 1.4); g.line([q2[0], q2[1] - H], [g.P(rw * (i + 1) / n, yv, z)[0], g.P(rw * (i + 1) / n, yv, z)[1]], c, 1.4); } });
    g.tree(rw - .2, .2, .5, p.tree);
  };
  Z.b_steelarch = function (g, rw, rh, lv, p) {
    land(g, rw, rh, lv, p); var z = 12 + lv, y0 = deck(g, rw, rh, z, .34, '#B9B3A6'), ym = y0 + rh * .17, a = g.P(.1, ym, z), b = g.P(rw - .1, ym, z), H = 44 + lv * 8 + big(rw, rh) * 2, i;
    g.c.strokeStyle = p.c1 || '#E9573F'; g.c.lineWidth = 4; g.c.beginPath(); g.c.moveTo(a[0], a[1]); g.c.quadraticCurveTo((a[0] + b[0]) / 2, a[1] - H * 2, b[0], b[1]); g.c.stroke(); g.ext((a[0] + b[0]) / 2, a[1] - H, 30);
    for (i = 1; i < 9; i++) { var t = i / 9, x = a[0] + (b[0] - a[0]) * t, yb = a[1] + (b[1] - a[1]) * t, yt = yb - H * 2 * 2 * t * (1 - t); g.line([x, yb], [x, yt], 'rgba(230,230,240,.85)', 1); }
  };
  Z.b_wood = function (g, rw, rh, lv, p) {
    land(g, rw, rh, lv, p); var ym = rh / 2, a = g.P(.1, ym, 6), b = g.P(rw - .1, ym, 6), H = 14 + lv * 3;
    g.c.strokeStyle = p.c1 || '#B8452E'; g.c.lineWidth = 7; g.c.lineCap = 'round'; g.c.beginPath(); g.c.moveTo(a[0], a[1]); g.c.quadraticCurveTo((a[0] + b[0]) / 2, a[1] - H * 2, b[0], b[1]); g.c.stroke();
    g.c.strokeStyle = '#E8D7B5'; g.c.lineWidth = 3; g.c.beginPath(); g.c.moveTo(a[0], a[1] - 1); g.c.quadraticCurveTo((a[0] + b[0]) / 2, a[1] - H * 2 - 1, b[0], b[1] - 1); g.c.stroke(); g.ext((a[0] + b[0]) / 2, a[1] - H, 30);
    g.tree(.2, .25, .6, 'cherry'); g.tree(rw - .2, rh - .25, .6, p.tree || 'pine');
  };

  /* ── ga & bến ── */
  var tracks = function (g, rw, rh, y, col) { var i; for (i = 0; i < 2; i++) { var a = g.P(0, y + i * .12, 0), b = g.P(rw, y + i * .12, 0); g.line(a, b, col || '#6B7686', 1.6); } var k; for (k = 0; k < rw * 4; k++) { var q = g.P(k / 4 + .1, y + .06, 0); g.line([q[0] - 1, q[1] - 2], [q[0] + 1, q[1] + 2], '#8A5A33', 1.4); } };
  var train = function (g, rw, y, z, col, n) { var i, x0 = .3; for (i = 0; i < n; i++) { var x = x0 + i * (rw - .6) / n; g.box(x, y, (rw - .6) / n - .05, .22, 1, 10, i === 0 ? shade(col, .9) : col); g.glassL(x, y, (rw - .6) / n - .05, .22, 4, 9, 1, '#BFE6F5'); } };
  Z.s_glass = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#C9C4B8'); var zb = 14 + lv * 2 + big(rw, rh);
    g.box(.1, .1, rw - .2, rh * .56, 0, zb, p.c1 || '#EEF2F6'); g.gable(.1, .1, rw - .2, rh * .56, zb, zb + 18 + lv * 2, true, p.glass || '#9AD8F2', { wall: p.c1 || '#EEF2F6' });
    g.glassL(.1, .1, rw - .2, rh * .56, 3, zb - 2, 1, p.glass || '#9AD8F2'); g.doorL(.1, .1, rw - .2, rh * .56, .5, 0, .18, 10, '#3E5C86');
    tracks(g, rw, rh, rh * .74); train(g, rw, rh * .7, 0, p.train || '#E9573F', 3);
  };
  Z.s_clock = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#C9C4B8'); var zb = 20 + lv * 3 + big(rw, rh);
    g.box(.1, .1, rw - .2, rh * .5, 0, zb, p.c1 || '#B9724A'); g.winsL(.1, .1, rw - .2, rh * .5, 5, zb - 3, Math.max(3, Math.round(rw * 1.5)), 1, { m: .16 }); g.hip(.1, .1, rw - .2, rh * .5, zb, zb + 10, p.roof || '#4A4F5C', .2);
    var cx = rw / 2, cy = rh * .35; g.box(cx - .28, cy - .22, .56, .44, zb, zb + 30, p.c1 || '#B9724A'); g.hip(cx - .32, cy - .26, .64, .52, zb + 30, zb + 44, p.roof || '#4A4F5C', .1);
    var f = g.P(cx, cy + .22, zb + 20); g.ell(f[0], f[1], 6, 6, '#fff', INK); g.line([f[0], f[1]], [f[0], f[1] - 4], '#222', 1.2); g.line([f[0], f[1]], [f[0] + 3, f[1]], '#222', 1.2);
    g.doorL(.1, .1, rw - .2, rh * .5, .5, 0, .2, 11, '#4A2E18'); tracks(g, rw, rh, rh * .74); train(g, rw, rh * .7, 0, p.train || '#3E5C86', 3);
  };
  Z.s_metro = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#C9C4B8'); var zb = 12 + lv * 2;
    g.box(.2, .2, rw - .4, rh - .4, 0, zb, p.c1 || '#EEF2F6'); g.glassL(.2, .2, rw - .4, rh - .4, 2, zb - 2, 1, '#9AD8F2'); g.glassR(.2, .2, rw - .4, rh - .4, 2, zb - 2, 1, '#9AD8F2');
    var a = g.P(.1, rh - .1, zb), b = g.P(rw - .1, rh - .1, zb); g.poly([[a[0], a[1]], [b[0], b[1]], [b[0] + 6, b[1] + 8], [a[0] + 6, a[1] + 8]], p.c2 || '#4F80BA', INK);
    g.flat(.2, .2, rw - .4, rh - .4, zb, '#D9DEE6', '#fff'); var s = g.P(rw / 2, rh / 2, zb + 6); g.ell(s[0], s[1], 9, 9, p.c2 || '#4F80BA', INK); g.c.fillStyle = '#fff'; g.c.font = 'bold 11px sans-serif'; g.c.textAlign = 'center'; g.c.fillText('M', s[0], s[1] + 4);
    g.line(g.P(rw / 2, rh / 2, zb), s, '#6B7686', 2);
  };
  Z.s_bus = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, '#B9B3A6'); var z = 18 + lv * 2, i;
    for (i = 0; i < 4; i++) g.cyl(.3 + i * (rw - .6) / 3, rh * .35, .06, 0, z, '#9AA4B2'); g.box(.2, rh * .22, rw - .4, rh * .3, z, z + 3, p.c1 || '#4F80BA'); g.flat(.2, rh * .22, rw - .4, rh * .3, z + 3, p.c1 || '#4F80BA', '#fff');
    var bx = .4; for (i = 0; i < Math.max(1, Math.round(rw / 2.4)); i++) { var x = .4 + i * 1.9; g.box(x, rh * .6, 1.4, .36, 1, 12, [p.bus || '#F28B2B', '#4F80BA', '#6BCB6F'][i % 3]); g.glassL(x, rh * .6, 1.4, .36, 5, 11, 1, '#BFE6F5'); dot(g, g.P(x + .3, rh * .6 + .36, 1)[0], g.P(x + .3, rh * .6 + .36, 1)[1], 2, '#222'); dot(g, g.P(x + 1.1, rh * .6 + .36, 1)[0], g.P(x + 1.1, rh * .6 + .36, 1)[1], 2, '#222'); }
    var sg = g.P(rw - .3, rh * .4, 0); g.line(sg, [sg[0], sg[1] - 16], '#6B7686', 1.6); g.ell(sg[0], sg[1] - 18, 4, 4, '#4F80BA', INK);
  };

  /* ── theo mùa ── */
  var SEAS = {
    spring: { lot: '#BFE6A0', roofs: '#F5A3C0', tree: 'cherry', dots: ['#FFB7CE', '#fff'] },
    summer: { lot: '#8EDB6A', roofs: '#3E9C94', tree: 'oak', dots: ['#FFD84A', '#FF7AA8'] },
    autumn: { lot: '#D9C98A', roofs: '#B8452E', tree: 'autumn', dots: ['#E58A3C', '#B8452E'] },
    winter: { lot: '#F2F7FC', roofs: '#F4F7FB', tree: 'pine', dots: ['#fff', '#BFE6F5'] }
  };
  Z.season = function (g, rw, rh, lv, p) {
    var S = SEAS[p.s || 'spring'], zb = 15 + lv * 2 + big(rw, rh);
    house(g, rw, rh, { wall: p.wall || '#F6EAD2', roof: p.roof || S.roofs, rt: p.rt || 'gable', zb: zb, rh: 13 + lv, nx: 2, lot: S.lot, door: '#7A4B2A', smoke: p.s === 'winter' ? 1 : 0, extra: function (g, x, y, w, h, top) {
      var i; for (i = 0; i < 8; i++) { var q = g.P(.25 + (i * .37) % (rw - .5), .25 + (i * .53) % (rh - .5), 1); dot(g, q[0], q[1], 1.6, S.dots[i % 2]); }
      trees(g, [[rw - .22, .22], [.2, rh - .2], [rw - .22, rh - .2]], .7, S.tree);
      if (p.s === 'summer') { var u = g.P(.4, rh - .2, 0); g.line(u, [u[0], u[1] - 14], '#F2EAD8', 1.6); g.poly([[u[0] - 8, u[1] - 12], [u[0], u[1] - 20], [u[0] + 8, u[1] - 12]], '#E9573F', INK); }
      if (p.s === 'winter') { var m = g.P(rw - .45, rh - .45, 0); g.ell(m[0], m[1] - 3, 4.4, 4, '#fff', INK); g.ell(m[0], m[1] - 9, 3.2, 3, '#fff', INK); }
      if (p.s === 'autumn') { var pp = g.P(.5, rh - .3, 0); g.ell(pp[0], pp[1], 6, 2.6, '#F28B2B', false); g.ell(pp[0] + 5, pp[1] - 1, 4, 2, '#B8452E', false); }
      if (p.s === 'spring') flowersAt(g, rw * .5, rh - .22, 5, ['#FF7AA8', '#FFD84A', '#fff'], 1.9, 6);
    } });
  };
  Z.xmas = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#F2F7FC'); var c = g.P(rw / 2, rh / 2, 0), n = 5, i, H = 22 + lv * 5 + big(rw, rh) * 2;
    g.ell(c[0], c[1] + 2, 20, 8, 'rgba(30,60,30,.22)'); g.poly([[c[0] - 3, c[1]], [c[0] + 3, c[1]], [c[0] + 3, c[1] - 10], [c[0] - 3, c[1] - 10]], '#7A4B2A', false);
    for (i = 0; i < n; i++) { var y = c[1] - 8 - i * H / n * 1.2, w = 22 - i * 3.6; g.poly([[c[0] - w, y + 10], [c[0], y - 10], [c[0] + w, y + 10]], i % 2 ? '#2F8F52' : '#3AA662', INK); dot(g, c[0] - w * .4, y + 4, 1.6, '#E9573F'); dot(g, c[0] + w * .3, y + 2, 1.6, '#FFD84A'); dot(g, c[0] + w * .6, y + 7, 1.6, '#4F9CFF'); }
    var t = [c[0], c[1] - 8 - n * H / n * 1.2 - 8]; dot(g, t[0], t[1], 3.4, '#FFD84A'); g.glow.push({ c: [t[0], t[1]], r: 22 });
    [[-18, 4, '#E9573F'], [16, 5, '#4F80BA'], [22, 0, '#6BCB6F']].forEach(function (q) { g.poly([[c[0] + q[0] - 5, c[1] + q[1]], [c[0] + q[0] + 5, c[1] + q[1]], [c[0] + q[0] + 5, c[1] + q[1] - 8], [c[0] + q[0] - 5, c[1] + q[1] - 8]], q[2], INK); g.line([c[0] + q[0], c[1] + q[1]], [c[0] + q[0], c[1] + q[1] - 8], '#FFD84A', 1.2); });
  };
  Z.carousel = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#EBD9A8'); var cx = rw / 2, cy = rh / 2, R = Math.min(rw, rh) * .38, z = 20 + lv * 3, i;
    g.cyl(cx, cy, R, 0, 5, '#D9D3C4'); for (i = 0; i < 8; i++) { var a = i * TAU / 8, q = g.P(cx + Math.cos(a) * R * .8, cy + Math.sin(a) * R * .8, 5); g.line(q, [q[0], q[1] - z + 5], '#F2D27A', 1.6); g.ell(q[0], q[1] - 8, 2.8, 3.4, ['#E9573F', '#fff', '#4F80BA', '#FFD84A'][i % 4], INK); }
    g.cyl(cx, cy, .1, 5, z, '#F2D27A'); cone(g, cx, cy, R * 1.1, z, z + 14, p.c1 || '#E9573F'); var t = g.P(cx, cy, z + 14); dot(g, t[0], t[1] - 2, 2, '#FFD84A'); g.glow.push({ c: [t[0], t[1] + 6], r: 18 });
  };
  Z.circus = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#EBD9A8'); var cx = rw / 2, cy = rh / 2, R = Math.min(rw, rh) * .4, z0 = 14 + lv * 2, z1 = z0 + 18 + lv * 3 + big(rw, rh), c0 = g.P(cx, cy, z0), rx = R * HW * 1.25, i, n = 8;
    g.cyl(cx, cy, R, 0, z0, p.c1 || '#fff');
    var top = g.P(cx, cy, z1), base = g.P(cx, cy, z0), ry = R * HH * 1.25;
    for (i = 0; i < n; i++) { var a0 = i * Math.PI / n, a1 = (i + 1) * Math.PI / n; g.poly([[base[0] + Math.cos(a0) * rx, base[1] + Math.sin(a0) * ry], [top[0], top[1]], [base[0] + Math.cos(a1) * rx, base[1] + Math.sin(a1) * ry]], i % 2 ? '#fff' : (p.c2 || '#E9573F'), INK); }
    g.line(top, [top[0], top[1] - 14], '#8A5A33', 1.6); g.poly([[top[0], top[1] - 14], [top[0] + 11, top[1] - 10], [top[0], top[1] - 6]], '#FFD84A', INK);
    var d = g.P(cx, cy + R, 0); g.poly([[d[0] - 6, d[1]], [d[0] + 6, d[1]], [d[0] + 6, d[1] - 11], [d[0] - 6, d[1] - 11]], '#4A2E18', INK);
  };
  Z.lanterns = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#D9D3C4'); var n = Math.max(3, Math.round(rw * 2)), i, z = 30 + lv * 4;
    var a = g.P(.2, rh / 2, z), b = g.P(rw - .2, rh / 2, z); g.line(g.P(.2, rh / 2, 0), a, '#8A5A33', 3); g.line(g.P(rw - .2, rh / 2, 0), b, '#8A5A33', 3); g.line(a, b, '#8A5A33', 1.4);
    for (i = 0; i < n; i++) { var t = (i + .5) / n, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t + 5 * Math.sin(t * Math.PI); g.line([x, y], [x, y + 5], '#8A5A33', 1); g.ell(x, y + 10, 4.6, 6, [p.c1 || '#E9573F', '#FFD84A'][i % 2], INK); g.glow.push({ c: [x, y + 10], r: 11 }); }
    var p2 = g.P(rw / 2, rh / 2 + .4, 0); g.ell(p2[0], p2[1], 12, 4, 'rgba(255,200,80,.3)', false);
  };
  Z.clock2 = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#D9D3C4'); var cx = rw / 2, cy = rh / 2, zb = 40 + lv * 14 + big(rw, rh) * 3, w = Math.min(rw, rh) * .3;
    g.box(cx - w, cy - w, w * 2, w * 2, 0, 10, '#B9B3A6'); g.box(cx - w * .6, cy - w * .6, w * 1.2, w * 1.2, 10, zb, p.c1 || '#E8D7B5'); g.glassL(cx - w * .6, cy - w * .6, w * 1.2, w * 1.2, 16, zb - 20, 2, '#9AD8F2');
    g.box(cx - w * .8, cy - w * .8, w * 1.6, w * 1.6, zb, zb + 22, p.c1 || '#E8D7B5'); var f = g.P(cx, cy + w * .8, zb + 11); g.ell(f[0], f[1], 7, 7, '#fff', INK); g.line([f[0], f[1]], [f[0], f[1] - 5], '#222', 1.3); g.line([f[0], f[1]], [f[0] + 4, f[1] + 1], '#222', 1.3);
    cone(g, cx, cy, w * 1.1, zb + 22, zb + 46, p.c2 || '#4A4F5C'); beacon(g, cx, cy, zb + 48);
  };
  var beacon = function (g, cx, cy, z) { var q = g.P(cx, cy, z); g.ell(q[0], q[1], 2.2, 2.2, '#FF5A5A'); g.meta.beacon = q; };
  A.kit8 = Z;
  var reg = function (key, style, p) { var f = Z[style]; if (!f) return; p = p || {}; def(key, function (g, rw, rh, lv) { f(g, rw, rh, lv || 1, p); }); };
  var R = reg;
  R('stonebridge', 'b_arch', {});
  R('mosscbridge', 'b_arch', {"c1": "#B8C9A0", "c2": "#9AA88A"});
  R('whitebridge', 'b_arch', {"c1": "#F6F6F6", "c2": "#E0E0E8"});
  R('goldbridge', 'b_arch', {"c1": "#F3D77A", "c2": "#D9B04A"});
  R('cablebridge', 'b_cable', {});
  R('redcable', 'b_cable', {"c2": "#D9503C"});
  R('azurecable', 'b_cable', {"c2": "#4F80BA", "c1": "#F2F2F2"});
  R('nightcable', 'b_cable', {"c2": "#B07CFF", "c1": "#E4D8F5", "c3": "rgba(255,230,140,.9)"});
  R('steeltruss', 'b_truss', {});
  R('greentruss', 'b_truss', {"c1": "#3E9E6B"});
  R('bluetruss', 'b_truss', {"c1": "#4F80BA"});
  R('redarch', 'b_steelarch', {});
  R('whitearch', 'b_steelarch', {"c1": "#F2F2F2"});
  R('goldarch', 'b_steelarch', {"c1": "#F2B01B"});
  R('woodbridge', 'b_wood', {});
  R('cherrybridge', 'b_wood', {"c1": "#C9503C"});
  R('lanternbridge', 'b_wood', {"c1": "#8A5A33"});
  R('glassstation', 's_glass', {});
  R('skystation', 's_glass', {"train": "#4F80BA", "glass": "#BFE6F5"});
  R('greenstation', 's_glass', {"train": "#3FA55B", "glass": "#BFEBD0"});
  R('bulletstation', 's_glass', {"train": "#F2F2F2", "c1": "#DCE3EC", "glass": "#9AB8D8"});
  R('clockstation', 's_clock', {});
  R('grandstation', 's_clock', {"c1": "#E8D7B5", "roof": "#2E6B8A", "train": "#E9573F"});
  R('royalstation', 's_clock', {"c1": "#F6EAD2", "roof": "#B8485E", "train": "#B07CFF"});
  R('metrostairs', 's_metro', {});
  R('metrohub', 's_metro', {"c2": "#E9573F"});
  R('metrostar', 's_metro', {"c2": "#B07CFF", "c1": "#E4D8F5"});
  R('busplaza', 's_bus', {});
  R('bluebusdepot', 's_bus', {"c1": "#3FA55B", "bus": "#4F80BA"});
  R('ecobusdepot', 's_bus', {"c1": "#6FD3C8", "bus": "#6BCB6F"});
  R('springcottage', 'season', {"s": "spring"});
  R('springcafe', 'season', {"s": "spring", "wall": "#FCE4EC", "roof": "#E27DA2"});
  R('springmanor', 'season', {"s": "spring", "wall": "#FFF3F6", "rt": "hip"});
  R('summercottage', 'season', {"s": "summer", "wall": "#FFF8D8"});
  R('summerbeachcafe', 'season', {"s": "summer", "wall": "#D2F0F0", "roof": "#F28B2B"});
  R('summervilla', 'season', {"s": "summer", "wall": "#FFFFFF", "rt": "hip"});
  R('autumncottage', 'season', {"s": "autumn", "wall": "#F3E3C3"});
  R('autumncafe', 'season', {"s": "autumn", "wall": "#EAD0A8", "roof": "#8A5A33"});
  R('autumnmanor', 'season', {"s": "autumn", "wall": "#F6E2C2", "rt": "hip"});
  R('wintercottage', 'season', {"s": "winter", "wall": "#EAD9B8"});
  R('wintercafe', 'season', {"s": "winter", "wall": "#E4D0B0", "roof": "#fff"});
  R('wintermanor', 'season', {"s": "winter", "wall": "#F2EAD8", "rt": "hip"});
  R('seasongarden', 'season', {"s": "spring", "wall": "#FFFFFF", "rt": "hip", "roof": "#E27DA2"});
  R('bigxmastree', 'xmas', {});
  R('grandxmas', 'xmas', {"lot": "#E8F4FA"});
  R('carouselfair', 'carousel', {});
  R('goldcarousel', 'carousel', {"c1": "#F2B01B"});
  R('circustent', 'circus', {});
  R('bluecircus', 'circus', {"c2": "#4F80BA"});
  R('lanterngate', 'lanterns', {});
  R('festivalgate', 'lanterns', {"c1": "#F28B2B"});
  R('moonlanternst', 'lanterns', {"c1": "#B07CFF"});
  R('bigben', 'clock2', {});
  R('goldclock', 'clock2', {"c1": "#F3E6C4", "c2": "#C98A30"});
  R('crystalclock', 'clock2', {"c1": "#E8F4FA", "c2": "#6FC8F2"});
})(typeof window !== 'undefined' ? window : this);
