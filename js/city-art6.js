/* EWT City — ĐỒ HOẠ phần 6: nhiều KIỂU NHÀ mới (nhà vườn, nhà Địa Trung Hải, nông trại, nhà chùa, nhà hiện đại, lâu đài…), CẢNH QUAN mới (ao cá, vườn thiền,
   cánh đồng hoa, mê cung, thác nước, ruộng bậc thang, sân băng…) và đồ trang trí nhỏ. Mỗi kiểu là một "khuôn" tham số hoá; các công trình dùng chung khuôn
   nhưng khác màu / kích thước / chi tiết. Danh sách cụ thể nằm ở cuối file (R('mã', 'kiểu', {tham số})). */
(function (root) {
  'use strict';
  var A = root.EWTCityArt; if (!A || !A.kit) return;
  var K = A.kit, house = K.house, lot = K.lot, def = K.def, INK = K.INK, shade = A.shade, TAU = Math.PI * 2, HW = 32, HH = 16;
  var X = {};
  var rng = function (seed) { var s = (seed >>> 0) || 1; return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; }; };
  var hashS = function (s) { var h = 7, i; for (i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0; return h; };
  var dot = function (g, x, y, r, c) { g.ell(x, y, r, r, c); };
  var ctr = function (g, rw, rh, z) { return g.P(rw / 2, rh / 2, z || 0); };
  var sh = function (g, p, r) { g.ell(p[0], p[1] + 2, r, r * .42, 'rgba(30,60,30,.22)'); };
  var cone = function (g, cx, cy, r, z0, z1, col) {
    var p0 = g.P(cx, cy, z0), p1 = g.P(cx, cy, z1), rx = r * HW * 1.25, ry = r * HH * 1.25;
    g.poly([[p0[0] - rx, p0[1]], [p1[0], p1[1]], [p0[0] + rx, p0[1]]], shade(col, 1.02), INK);
    g.poly([[p0[0], p0[1] + ry], [p1[0], p1[1]], [p0[0] + rx, p0[1]]], shade(col, .8), false);
  };
  var dome = function (g, cx, cy, r, z, hz, col, a) {
    var p = g.P(cx, cy, z), rx = r * HW * 1.25, ry = r * HH * 1.25, c = g.c, gr;
    hz = Math.max(hz, rx * .88); c.beginPath(); c.moveTo(p[0] - rx, p[1]); c.ellipse(p[0], p[1], rx, hz, 0, Math.PI, 0, false); c.ellipse(p[0], p[1], rx, ry, 0, 0, Math.PI, false); c.closePath();
    gr = c.createLinearGradient(p[0] - rx, 0, p[0] + rx, 0); gr.addColorStop(0, shade(col, .8)); gr.addColorStop(.5, shade(col, 1.1)); gr.addColorStop(1, shade(col, .88));
    c.globalAlpha = a == null ? 1 : a; c.fillStyle = gr; c.fill(); c.strokeStyle = INK; c.lineWidth = 1; c.stroke(); c.globalAlpha = 1; g.ext(p[0], p[1] - hz, rx); g.ext(p[0], p[1] + ry, rx);
  };
  var pool = function (g, rw, rh, s, col, z, edge) {
    var p = ctr(g, rw, rh, z || 0), rx = (rw + rh) / 2 * HW * s, ry = (rw + rh) / 2 * HH * s;
    if (edge) g.ell(p[0], p[1] + 1, rx + 3, ry + 1.6, edge, INK); g.ell(p[0], p[1], rx, ry, col, false); g.ell(p[0] - rx * .25, p[1] - ry * .25, rx * .45, ry * .3, 'rgba(255,255,255,.28)');
    return [p, rx, ry];
  };
  var fence = function (g, x, y, w, h, col) {
    var a = g.P(x, y, 0), b = g.P(x + w, y, 0), c = g.P(x + w, y + h, 0), d = g.P(x, y + h, 0), up = function (q, z) { return [q[0], q[1] - z]; };
    [[a, b], [b, c], [c, d], [d, a]].forEach(function (s) { g.line(up(s[0], 5), up(s[1], 5), col || '#E8DFC8', 1.4); g.line(up(s[0], 2.5), up(s[1], 2.5), col || '#E8DFC8', 1); });
  };
  var flowersAt = function (g, x, y, n, cols, r, spread) {
    var i, p = g.P(x, y, 2); for (i = 0; i < n; i++) dot(g, p[0] + (i - (n - 1) / 2) * (spread || 6), p[1] + (i % 2) * 2, r || 1.9, cols[i % cols.length]);
  };
  var big = function (rw, rh) { return Math.max(0, Math.round((rw + rh - 6) * 2.4)); };
  var chim = function (g, x, y, top, col) { g.box(x, y, .15, .15, top - 3, top + 8, col || '#9A5B45'); };

  /* ═════════ KIỂU NHÀ ═════════ */
  X.cottage = function (g, rw, rh, lv, p) {
    house(g, rw, rh, { wall: p.wall, roof: p.roof, rt: 'gable', zb: 14 + lv * 2, rh: 12 + lv, nx: 2, door: p.door || '#7A4B2A', lot: p.lot || '#8ED067', smoke: 1, extra: function (g, x, y, w, h) {
      g.box(x + w * .25, y + h - .02, w * .5, .16, 0, 2, '#D9CFB8'); flowersAt(g, x + w * .5, y + h + .22, 4, p.fl || ['#E9573F', '#FFD84A', '#FF7AA8'], 1.9, 6);
      g.tree(rw - .2, rh - .18, .55, p.tree); if (lv >= 2) fence(g, .06, .06, rw - .12, rh - .12, '#EDE4CF');
    } });
  };
  X.townhouse = function (g, rw, rh, lv, p) {
    house(g, rw, rh, { wall: p.wall, roof: p.roof, rt: 'hip', zb: 30 + lv * 4, rh: 12, nx: 2, ny: 2, hin: .26, door: p.door || '#3E5C86', lot: p.lot || '#C9C4B8', extra: function (g, x, y, w, h, top) {
      g.box(x + w * .15, y + h - .02, w * .7, .18, 14, 16, p.acc || '#6B7686'); var k; for (k = 0; k < 5; k++) { var q = g.P(x + w * (.18 + k * .16), y + h + .14, 16); g.line(q, [q[0], q[1] - 5], p.acc || '#6B7686', 1.2); }
      flowersAt(g, x + w * .5, y + h + .2, 3, ['#FF7AA8', '#fff', '#FFD84A'], 1.7, 5.5); if (lv >= 2) chim(g, x + .12, y + .12, top, p.chim);
    } });
  };
  X.med = function (g, rw, rh, lv, p) {
    var zb = 15 + lv * 2 + big(rw, rh);
    house(g, rw, rh, { wall: p.wall || '#FBF7EE', roof: p.roof || '#C9703A', rt: 'hip', zb: zb, rh: 9, nx: 2, hin: .3, door: p.door || '#3E7FBF', lot: p.lot || '#9ED67A', extra: function (g, x, y, w, h, top) {
      g.box(rw - .72, .15, .5, .5, 0, zb + 14, p.wall || '#FBF7EE'); cone(g, rw - .47, .4, .36, zb + 14, zb + 27, p.roof || '#C9703A');
      g.quadL(x, y, w, h, .42, .58, 0, 11, p.door || '#3E7FBF', INK); g.tree(.22, rh - .2, .6, p.tree); g.ell(g.P(x + w * .2, y + h + .1, 2)[0], g.P(x + w * .2, y + h + .1, 2)[1], 5, 3, '#E9573F');
    } });
  };
  X.farm = function (g, rw, rh, lv, p) {
    house(g, rw, rh, { wall: p.wall || '#C9503C', roof: p.roof || '#6B4A2E', rt: 'gable', zb: 18 + lv * 2, rh: 16, along: false, nx: 2, door: '#F2EAD8', lot: p.lot || '#B8D888', extra: function (g, x, y, w, h, top) {
      g.cyl(rw - .35, .4, .28, 0, 34, '#C8CDD6', '#DDE2EA'); g.ell(g.P(rw - .35, .4, 34)[0], g.P(rw - .35, .4, 34)[1] - 4, 8, 6, '#9AA3AE', INK);
      g.line(g.P(x + w * .35, y + h, 2), g.P(x + w * .65, y + h, 14), '#F2EAD8', 1.4); g.line(g.P(x + w * .65, y + h, 2), g.P(x + w * .35, y + h, 14), '#F2EAD8', 1.4); fence(g, .05, rh * .62, rw * .5, rh * .34, '#C9A06A');
    } });
  };
  X.pagoda = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#B8D8A0'); var w = rw - .4, h = rh - .4, c = p.roof || '#4A4F5C', S = big(rw, rh), z1 = 12 + lv + S;
    g.box(.2, .2, w, h, 0, z1, p.wall || '#F2EAD8'); g.winsL(.2, .2, w, h, 3, z1 - 2, 3, 1, { m: .15, col: '#E9E2CC' }); g.winsR(.2, .2, w, h, 3, z1 - 2, 2, 1, { m: .2, col: '#E9E2CC' });
    g.hip(.08, .08, w + .24, h + .24, z1, z1 + 8, c, .14); g.box(.4, .4, w - .4, h - .4, z1 + 8, z1 + 16, p.wall || '#F2EAD8'); g.hip(.28, .28, w - .16, h - .16, z1 + 16, z1 + 26, c, .1);
    var t = g.P(rw / 2, rh / 2, z1 + 26); g.line(t, [t[0], t[1] - 9], '#D9A441', 1.8); dot(g, t[0], t[1] - 10, 1.8, '#D9A441'); g.doorL(.2, .2, w, h, .5, 0, .22, 9, p.door || '#B8452E'); g.tree(rw - .25, rh - .2, .6, 'cherry');
  };
  X.modern = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#A8D88E'); var z1 = 14 + lv * 2 + big(rw, rh) / 2, z2 = z1 + 13 + lv;
    g.box(.12, .15, rw - .24, rh * .62, 0, z1, p.wall || '#F2F2F2'); g.glassL(.12, .15, rw - .24, rh * .62, 3, z1 - 2, 1, p.glass || '#7FC8F0'); g.flat(.12, .15, rw - .24, rh * .62, z1, '#D9DEE6', '#fff');
    g.box(.34, .22, rw - .46, rh * .56, z1, z2, p.wall2 || '#C9D1DA'); g.glassL(.34, .22, rw - .46, rh * .56, z1 + 2, z2 - 2, 1, p.glass || '#7FC8F0'); g.glassR(.34, .22, rw - .46, rh * .56, z1 + 2, z2 - 2, 1, p.glass || '#7FC8F0'); g.flat(.34, .22, rw - .46, rh * .56, z2, p.roof || '#8FA3BD', '#fff');
    g.doorL(.12, .15, rw - .24, rh * .62, .3, 0, .16, 9, '#3E5C86'); g.tree(.2, rh - .15, .6, p.tree); if (lv >= 2) { g.poly(g.faceT(rw - .9, rh * .66, .7, rh * .26, 0), '#6FC8F2', INK); }
  };
  X.alpine = function (g, rw, rh, lv, p) {
    house(g, rw, rh, { wall: p.wall || '#EAD9B8', roof: p.roof || '#F4F7FB', rt: 'gable', zb: 16 + lv * 2, rh: 22, along: false, nx: 2, door: '#5A3A22', lot: p.lot || '#E8F0F8', extra: function (g, x, y, w, h) {
      g.box(x - .04, y + h - .02, w + .08, .16, 9, 11, '#8A5A33'); var k; for (k = 0; k < 6; k++) { var q = g.P(x + .05 + k * w / 5.2, y + h + .12, 11); g.line(q, [q[0], q[1] - 5], '#8A5A33', 1.1); }
      g.tree(.2, rh - .2, .7, 'pine'); g.tree(rw - .2, .2, .6, 'pine'); chim(g, x + w * .7, y + h * .3, 30, '#8A6A55');
    } });
  };
  X.tudor = function (g, rw, rh, lv, p) {
    var zb = 18 + lv * 2 + big(rw, rh);
    house(g, rw, rh, { wall: p.wall || '#F5ECD7', roof: p.roof || '#7A4B2A', rt: 'gable', zb: zb, rh: 15, nx: 2, ny: 1, door: '#4A2E18', lot: p.lot || '#8ED067', smoke: 1, extra: function (g, x, y, w, h) {
      var t; for (t = .12; t < 1; t += .22) g.quadL(x, y, w, h, t - .012, t + .012, 0, zb, '#5A3A22', false); g.quadL(x, y, w, h, 0, 1, zb * .5 - 1, zb * .5 + 1, '#5A3A22', false);
      for (t = .15; t < 1; t += .25) g.quadR(x, y, w, h, t - .012, t + .012, 0, zb, '#5A3A22', false); g.tree(rw - .2, rh - .2, .55, p.tree);
    } });
  };
  X.castle = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#9ED67A'); var wc = p.wall || '#D9D3C4', rc = p.roof || '#4F80BA', zb = 22 + lv * 3 + big(rw, rh), i, j;
    g.box(.5, .5, rw - 1, rh - 1, 0, zb, wc); g.winsL(.5, .5, rw - 1, rh - 1, 6, zb - 4, 3, 1, { m: .2 }); g.winsR(.5, .5, rw - 1, rh - 1, 6, zb - 4, 3, 1, { m: .2 });
    for (i = 0; i < 6; i++) { var a = g.P(.5 + i * (rw - 1.18) / 5, rh - .5, zb); g.box(.5 + i * (rw - 1.18) / 5, rh - .68, .18, .18, zb, zb + 5, wc); }
    [[.35, .35], [rw - .35, .35], [rw - .35, rh - .35], [.35, rh - .35]].forEach(function (q, n) { g.cyl(q[0], q[1], .34, 0, zb + 14, wc); cone(g, q[0], q[1], .42, zb + 14, zb + 32, n % 2 ? rc : shade(rc, 1.1)); });
    var kt = g.P(rw / 2, rh / 2, zb); g.line(kt, [kt[0], kt[1] - 22], '#6B7686', 1.4); g.poly([[kt[0], kt[1] - 22], [kt[0] + 12, kt[1] - 18], [kt[0], kt[1] - 14]], p.flag || '#E9573F', INK);
    g.doorL(.5, .5, rw - 1, rh - 1, .5, 0, .3, 14, '#5A3A22');
  };
  X.mill = function (g, rw, rh, lv, p) {
    house(g, rw, rh, { wall: p.wall || '#F2EAD8', roof: p.roof || '#D95A42', rt: 'hip', zb: 14 + lv * 2, rh: 9, nx: 2, hin: .3, lot: p.lot || '#B8E08A', smoke: 1, extra: function () {
      var cx = rw - .5, cy = .5, z0 = 0; g.box(cx - .22, cy - .22, .44, .44, z0, 36, p.wall || '#F2EAD8'); g.hip(cx - .26, cy - .26, .52, .52, 36, 44, p.roof || '#D95A42', .15);
      var h = g.P(cx, cy + .24, 30), k, t = lv * .3; for (k = 0; k < 4; k++) { var a = k * Math.PI / 2 + .5 + t; g.line(h, [h[0] + Math.cos(a) * 22, h[1] + Math.sin(a) * 22], '#F2EAD8', 3); g.line(h, [h[0] + Math.cos(a) * 20, h[1] + Math.sin(a) * 20], '#9A7A55', 1.2); } dot(g, h[0], h[1], 2.4, '#6B4A2E');
    } });
  };
  X.lighthouse = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#F3E0AE'); var i, cx = rw * .45, cy = rh * .45, r = Math.min(rw, rh) * .22;
    g.box(rw * .55, rh * .55, rw * .35, rh * .32, 0, 11, '#F5ECD7'); g.hip(rw * .53, rh * .53, rw * .39, rh * .36, 11, 18, p.roof || '#4F80BA', .2);
    for (i = 0; i < 3; i++) g.cyl(cx, cy, r, i * 15, i * 15 + 15, i % 2 ? '#F2F2F2' : (p.stripe || '#E9573F'));
    g.cyl(cx, cy, r + .05, 45, 49, '#4B4F5A'); var t = g.P(cx, cy, 52); g.ell(t[0], t[1], 6, 5, '#FFE9A0', INK); cone(g, cx, cy, r * 1.1, 56, 68, p.stripe || '#E9573F'); g.glow.push({ c: [t[0], t[1]], r: 22 });
  };
  X.domehome = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#E8F0F8'); var R = Math.min(rw, rh) * .42, c = ctr(g, rw, rh);
    sh(g, c, R * 40); dome(g, rw / 2, rh / 2, R, 0, 22 + lv * 3, p.wall || '#F2F8FF');
    g.line([c[0] - R * 38, c[1] - 6], [c[0] + R * 38, c[1] - 6], 'rgba(60,80,110,.35)', 1); g.line([c[0] - R * 30, c[1] - 14], [c[0] + R * 30, c[1] - 14], 'rgba(60,80,110,.3)', 1); g.line([c[0], c[1]], [c[0], c[1] - 20 - lv * 3], 'rgba(60,80,110,.3)', 1);
    var d = g.P(rw / 2, rh / 2 + R * .9, 0); g.poly([[d[0] - 5, d[1] + 1], [d[0] + 5, d[1] + 1], [d[0] + 5, d[1] - 9], [d[0] - 5, d[1] - 9]], p.door || '#6B7686', INK); g.tree(rw - .2, rh - .2, .5, 'pine');
  };
  X.terrace = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#A8D88E'); var n = 3, i, w, z = 0;
    for (i = 0; i < n; i++) {
      w = rw - .3 - i * (rw - 1) / n * .9; var x0 = .15 + i * .1, y0 = .15, d = rh - .3 - i * .3, h = 11 + lv;
      g.box(x0, y0, w, d, z, z + h, p.wall || '#F6EAD2'); g.winsL(x0, y0, w, d, z + 3, z + h - 2, 2, 1, { m: .25 }); g.flat(x0, y0, w, d, z + h, '#7CC25F', '#5BAE55'); z += h;
    }
    g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .2, 8, p.door || '#B8452E'); g.tree(.4, rh - .2, .5, 'cherry'); g.tree(rw - .3, rh - .3, .5);
  };
  X.ranch = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#9ED67A'); var w = rw * .66;
    g.box(.15, .15, w, rh - .3, 0, 12 + lv, p.wall || '#F3E3C3'); g.gable(.08, .1, w + .14, rh - .2, 12 + lv, 20 + lv, true, p.roof || '#8A5A33', { wall: p.wall || '#F3E3C3' });
    g.winsL(.15, .15, w, rh - .3, 3, 10 + lv, 3, 1, { m: .15 }); g.doorL(.15, .15, w, rh - .3, .45, 0, .14, 9, '#5A3A22');
    g.box(.15 + w + .05, .2, rw - w - .35, rh - .4, 0, 10, p.wall2 || '#E8E4D8'); g.flat(.15 + w + .05, .2, rw - w - .35, rh - .4, 10, '#B9B3A6', '#fff'); g.doorL(.15 + w + .05, .2, rw - w - .35, rh - .4, .5, 0, .6, 8, '#9AA3AE');
    var c = g.P(.4, rh - .1, 0); g.poly([[c[0] - 7, c[1]], [c[0] + 7, c[1] - 3], [c[0] + 7, c[1] - 7], [c[0] - 7, c[1] - 4]], '#4F80BA', INK); g.tree(rw - .2, .2, .6, p.tree); smoke(g, .5, .3, 22 + lv);
    function smoke(g2, cx, cy, z2) { var q = g2.P(cx, cy, z2); g2.meta.smoke.push([q[0], q[1]]); }
  };
  X.yurt = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#C8DC9A'); var cx = rw / 2, cy = rh / 2, r = Math.min(rw, rh) * .38;
    g.cyl(cx, cy, r, 0, 12 + lv * 2, p.wall || '#F6F0E0'); cone(g, cx, cy, r * 1.14, 12 + lv * 2, 28 + lv * 3, p.roof || '#B8452E');
    var d = g.P(cx, cy + r * .95, 0); g.poly([[d[0] - 4, d[1]], [d[0] + 4, d[1]], [d[0] + 4, d[1] - 9], [d[0] - 4, d[1] - 9]], p.door || '#8A5A33', INK);
    var t = g.P(cx, cy, 28 + lv * 3); g.line(t, [t[0], t[1] - 7], '#8A5A33', 1.4); smokeAt(g, cx, cy, 30 + lv * 3);
  };
  var smokeAt = function (g, cx, cy, z) { var q = g.P(cx, cy, z); g.meta.smoke.push([q[0], q[1]]); };
  X.boathouse = function (g, rw, rh, lv, p) {
    g.keep = true; g.poly(g.faceT(0, 0, rw, rh, 0), '#5FB7E8', false); g.keep = false;
    var i; for (i = 0; i < 4; i++) { var q = g.P(.3 + i * (rw - .6) / 3, rh * .18 + (i % 2) * .5, 0); g.line([q[0] - 8, q[1] + 2], [q[0] + 8, q[1] + 2], 'rgba(255,255,255,.4)', 1.2); }
    g.box(.1, .2, rw * .7, rh * .6, 0, 4, '#B58555'); g.box(.2, .3, rw * .7 - .2, rh * .6 - .2, 4, 4 + 13 + lv * 2, p.wall || '#E8D7B5'); g.gable(.14, .24, rw * .7 - .08, rh * .6 - .08, 17 + lv * 2, 28 + lv * 2, true, p.roof || '#4F80BA', { wall: p.wall || '#E8D7B5' });
    g.winsL(.2, .3, rw * .7 - .2, rh * .6 - .2, 7, 15 + lv * 2, 2, 1, { m: .25 }); g.doorL(.2, .3, rw * .7 - .2, rh * .6 - .2, .5, 4, .18, 8, '#5A3A22');
    g.box(rw * .7 + .1, rh * .55, rw * .26, .2, 0, 3, '#8A5A33'); var b = g.P(rw * .82, rh * .85, 1); g.poly([[b[0] - 10, b[1]], [b[0] + 10, b[1]], [b[0] + 6, b[1] + 5], [b[0] - 6, b[1] + 5]], p.boat || '#E9573F', INK); g.line([b[0], b[1]], [b[0], b[1] - 13], '#6B4A2E', 1.4); g.poly([[b[0], b[1] - 13], [b[0] + 8, b[1] - 3], [b[0], b[1] - 3]], '#fff', INK);
  };
  X.glasshome = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#9ED67A'); var z = 14 + lv * 3 + big(rw, rh), i;
    g.box(.15, .15, rw - .3, rh - .3, 0, 3, '#C9D1DA'); g.glassL(.15, .15, rw - .3, rh - .3, 3, z, 2, p.glass || '#A8E4F2'); g.glassR(.15, .15, rw - .3, rh - .3, 3, z, 2, p.glass || '#A8E4F2');
    g.hip(.15, .15, rw - .3, rh - .3, z, z + 11, p.roof || '#D4F1F7', .3);
    for (i = 0; i < 4; i++) { var q = g.P(.4 + i * (rw - .8) / 3, rh * .5, 4); dot(g, q[0], q[1] - 5, 3, ['#3FA55B', '#E9573F', '#FFD84A', '#B77CFF'][i]); }
    g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .2, 10, '#fff'); g.tree(rw - .15, rh - .15, .5);
  };
  X.colonial = function (g, rw, rh, lv, p) {
    var zb = 22 + lv * 3 + big(rw, rh);
    house(g, rw, rh, { wall: p.wall || '#F7F2E6', roof: p.roof || '#4A4F5C', rt: 'hip', zb: zb, rh: 12, nx: 3, ny: 2, hin: .22, door: p.door || '#1F3A5F', lot: p.lot || '#8ED067', extra: function (g, x, y, w, h, top) {
      var k; for (k = 0; k < 4; k++) g.cyl(x + w * (.25 + k * .16), y + h + .14, .07, 0, zb - 2, '#fff'); g.box(x + w * .18, y + h + .06, w * .64, .22, zb - 3, zb, '#E8E4D8');
      g.box(x + w * .3, y + h + .1, w * .4, .22, 0, 2, '#D9D3C4'); chim(g, x + .1, y + .1, top, '#B9724A'); g.tree(.2, rh - .2, .6, p.tree); g.tree(rw - .2, rh - .2, .6, p.tree);
    } });
  };
  X.turret = function (g, rw, rh, lv, p) {
    var zb = 20 + lv * 2;
    house(g, rw, rh, { wall: p.wall || '#F3C7D6', roof: p.roof || '#7A4B6E', rt: 'gable', zb: zb, rh: 14, nx: 2, door: '#5A3A52', lot: p.lot || '#8ED067', extra: function (g, x, y, w, h) {
      g.cyl(x + .15, y + h - .1, .3, 0, zb + 12, p.wall || '#F3C7D6'); cone(g, x + .15, y + h - .1, .38, zb + 12, zb + 32, p.roof || '#7A4B6E'); var t = g.P(x + .15, y + h - .1, zb + 32); dot(g, t[0], t[1] - 2, 1.6, '#FFD84A');
      g.box(x + w * .45, y + h - .02, w * .5, .15, 0, 2, '#E8E4D8'); flowersAt(g, x + w * .7, y + h + .2, 3, ['#E9573F', '#fff', '#FFD84A'], 1.8, 6); g.tree(rw - .2, .2, .6, p.tree);
    } });
  };
  X.cube = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#D9D3C4'); var z = 16 + lv * 2;
    g.box(.15, .2, rw * .62, rh - .4, 0, z, p.wall || '#F2F2F2'); g.flat(.15, .2, rw * .62, rh - .4, z, '#E8E4D8', '#fff'); g.glassL(.15, .2, rw * .62, rh - .4, 3, z - 3, 1, '#9AD0EA');
    g.box(.15 + rw * .5, .35, rw * .38, rh - .6, 0, z + 10, p.wall2 || '#B58555'); g.flat(.15 + rw * .5, .35, rw * .38, rh - .6, z + 10, '#E8E4D8', '#fff');
    var k; for (k = 1; k < 6; k++) g.quadR(.15 + rw * .5, .35, rw * .38, rh - .6, 0, 1, k * (z + 10) / 6 - .4, k * (z + 10) / 6 + .4, 'rgba(60,35,15,.4)', false);
    g.doorL(.15, .2, rw * .62, rh - .4, .3, 0, .14, 10, '#4A4F5C'); g.tree(rw - .25, rh - .2, .55, 'cherry'); var s = g.P(rw * .4, rh - .1, 0); g.ell(s[0], s[1], 5, 2.4, '#9AA3AE');
  };
  X.cabin = function (g, rw, rh, lv, p) {
    var zb = 14 + lv * 2;
    house(g, rw, rh, { wall: p.wall || '#A67444', roof: p.roof || '#4E6B3A', rt: 'gable', zb: zb, rh: 12, nx: 1, door: '#3A2412', lot: p.lot || '#7FC46A', smoke: 1, extra: function (g, x, y, w, h, top) {
      var j; for (j = 1; j < 5; j++) { var z = j * zb / 5; g.line(g.P(x, y + h, z), g.P(x + w, y + h, z), 'rgba(50,28,10,.55)', 1.2); g.line(g.P(x + w, y + h, z), g.P(x + w, y, z), 'rgba(50,28,10,.55)', 1.2); }
      g.box(x + w * .8, y + h + .05, .3, .18, 0, 5, '#8A5A33'); g.box(x + w * .8, y + h + .05, .3, .18, 5, 7, '#6B4A2E'); g.tree(.2, rh - .2, .7, 'pine'); chim(g, x + w * .6, y + .1, top, '#8A8F99');
    } });
  };
  X.adobe = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#EBD9A8'); var wc = p.wall || '#E3B98A', z1 = 14 + lv * 2;
    g.box(.15, .2, rw - .3, rh - .4, 0, z1, wc); g.flat(.15, .2, rw - .3, rh - .4, z1, shade(wc, 1.05), shade(wc, 1.15)); g.box(.4, .3, rw * .5, rh - .7, z1, z1 + 12, wc); g.flat(.4, .3, rw * .5, rh - .7, z1 + 12, shade(wc, 1.05), shade(wc, 1.15));
    var k; for (k = 0; k < 3; k++) { var q = g.P(.15, .3 + k * (rh - .8) / 2, z1 - 3); g.box(.05, .3 + k * (rh - .8) / 2, .18, .08, z1 - 4, z1 - 2, '#7A4B2A'); }
    g.winsL(.15, .2, rw - .3, rh - .4, 4, z1 - 4, 2, 1, { m: .22 }); g.doorL(.15, .2, rw - .3, rh - .4, .55, 0, .18, 9, p.door || '#2E8A8A'); var c = g.P(rw - .4, rh - .15, 0); g.poly([[c[0] - 3, c[1]], [c[0] + 3, c[1]], [c[0] + 2, c[1] - 14], [c[0] - 2, c[1] - 14]], '#4DA25A', INK);
  };
  X.hobbit = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#9ED67A'); var R = Math.min(rw, rh) * .48, c = ctr(g, rw, rh);
    sh(g, c, R * 44); dome(g, rw / 2, rh / 2, R, 0, 24 + lv * 3, p.hill || '#7CC25F'); [[-12, -10], [10, -14], [0, -18]].forEach(function (q) { g.ell(c[0] + q[0], c[1] + q[1], 4, 2, '#8FD96E'); });
    var d = g.P(rw / 2, rh / 2 + R * .85, 0); g.ell(d[0], d[1] - 6, 7, 8, p.door || '#2E8A4F', INK); g.ell(d[0], d[1] - 6, 3.4, 4.2, '#D9A441', false); dot(g, d[0] - 1, d[1] - 6, 1, '#6B4A2E');
    g.line(g.P(rw / 2 + R * .5, rh / 2 - R * .4, 20), g.P(rw / 2 + R * .5, rh / 2 - R * .4, 32), '#8A8F99', 3); smokeAt(g, rw / 2 + R * .5, rh / 2 - R * .4, 34); fence(g, .1, rh * .66, rw - .2, rh * .3, '#C9A06A');
  };
  X.riad = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#EBD9A8'); var z = 16 + lv * 2, wc = p.wall || '#F6E7C8';
    g.box(.12, .12, rw - .24, rh - .24, 0, z, wc); g.winsL(.12, .12, rw - .24, rh - .24, 4, z - 3, 3, 1, { m: .18 }); g.winsR(.12, .12, rw - .24, rh - .24, 4, z - 3, 2, 1, { m: .2 });
    g.flat(.12, .12, rw - .24, rh - .24, z, '#E8D7B5', '#fff'); g.poly(g.faceT(.5, .5, rw - 1, rh - 1, z + 1), p.water || '#4DB1EA', INK);
    [[.22, .22], [rw - .22, .22], [rw - .22, rh - .22], [.22, rh - .22]].forEach(function (q) { g.cyl(q[0], q[1], .16, z, z + 8, wc); dome(g, q[0], q[1], .16, z + 8, 7, p.dome || '#2E8A8A'); });
    g.doorL(.12, .12, rw - .24, rh - .24, .5, 0, .2, 11, p.door || '#2E8A8A'); g.tree(.18, rh - .1, .5, 'palm');
  };
  X.cliff = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#9ED67A'); g.box(.1, .1, rw - .2, rh - .2, 0, 20, '#9AA3AE'); g.flat(.1, .1, rw - .2, rh - .2, 20, '#7CC25F', '#5BAE55');
    var k; for (k = 0; k < 4; k++) { var q = g.P(.3 + k * (rw - .6) / 3, rh - .12, 4 + k * 4); g.line([q[0] - 6, q[1]], [q[0] + 4, q[1] - 6], 'rgba(40,40,60,.3)', 1.4); }
    var zb = 12 + lv * 2; g.box(.3, .3, rw * .5, rh * .5, 20, 20 + zb, p.wall || '#F6EAD2'); g.winsL(.3, .3, rw * .5, rh * .5, 23, 18 + zb, 2, 1, { m: .22 }); g.gable(.24, .24, rw * .5 + .12, rh * .5 + .12, 20 + zb, 30 + zb, true, p.roof || '#C9503C', { wall: p.wall || '#F6EAD2' });
    g.tree(rw - .4, rh - .4, .6, 'pine'); smokeAt(g, .5, .45, 32 + zb);
  };
  X.condo2 = function (g, rw, rh, lv, p) {
    var zb = 38 + lv * 6;
    house(g, rw, rh, { wall: p.wall || '#F2E8D5', roof: p.roof || '#8FA3BD', rt: 'flat', zb: zb, nx: 3, ny: 3, door: p.door || '#3E5C86', lot: p.lot || '#C9C4B8', extra: function (g, x, y, w, h, top) {
      var j; for (j = 1; j < 3; j++) g.quadL(x, y, w, h, .04, .96, j * zb / 3 - 1, j * zb / 3 + 1, p.band || '#E9573F', false); g.tree(.2, rh - .15, .55); g.tree(rw - .2, rh - .15, .55, 'cherry');
      var s = g.P(rw / 2, rh / 2, top + 3); g.box(rw / 2 - .15, rh / 2 - .15, .3, .3, top, top + 6, '#6B7686'); g.cyl(rw * .3, rh * .6, .1, top, top + 6, '#7A9CC6');
    } });
  };

  /* ═════════ CẢNH QUAN (công viên lớn) ═════════ */
  var trees = function (g, list, s, kind) { list.forEach(function (q, i) { g.tree(q[0], q[1], s * (q[2] || 1), Array.isArray(kind) ? kind[i % kind.length] : kind); }); };
  var scatter = function (g, rw, rh, r, n, x0, y0, x1, y1, fn) { var i; for (i = 0; i < n; i++) fn(x0 + r() * (x1 - x0), y0 + r() * (y1 - y0), i); };
  var water = function (g, x, y, w, h, col) { g.poly(g.faceT(x, y, w, h, 0), col || '#4DB1EA', 'rgba(255,255,255,.55)'); };
  X.park_pond = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#8ED067'); var pl = pool(g, rw, rh, .55, p.water || '#4DB1EA', 0, '#E8DFC8');
    scatter(g, rw, rh, r, 5, pl[0][0], 0, 0, 0, function () { }); var i;
    for (i = 0; i < 4; i++) { var a = i * 1.6 + .5; g.ell(pl[0][0] + Math.cos(a) * pl[1] * .5, pl[0][1] + Math.sin(a) * pl[2] * .5, 4, 2, '#5FCB6E'); }
    dot(g, pl[0][0] - 8, pl[0][1] + 4, 2.4, '#fff'); dot(g, pl[0][0] + 12, pl[0][1] - 2, 2.2, '#fff');
    trees(g, [[.3, .3], [rw - .3, .3], [.3, rh - .3], [rw - .3, rh - .3], [rw / 2, .22, .9]], .75, p.tree || ['oak', 'cherry']); flowersAt(g, rw / 2, rh - .22, 5, ['#FF7AA8', '#fff', '#FFD84A']);
  };
  X.park_fountain = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#E8DFC8'); g.keep = true; g.poly(g.faceT(.25, .25, rw - .5, rh - .5, 0), '#8ED067', false); g.keep = false;
    var c = ctr(g, rw, rh), R = Math.min(rw, rh) * .22; g.cyl(rw / 2, rh / 2, R, 0, 6, '#D9D3C4'); var pl = g.P(rw / 2, rh / 2, 6); g.ell(pl[0], pl[1], R * 38, R * 18, p.water || '#6FC8F2', false);
    g.cyl(rw / 2, rh / 2, .12, 6, 22, '#E8E4D8'); var k; for (k = 0; k < 6; k++) { var a = k * TAU / 6, t = g.P(rw / 2, rh / 2, 22); g.c.strokeStyle = 'rgba(255,255,255,.85)'; g.c.lineWidth = 1.6; g.c.beginPath(); g.c.moveTo(t[0], t[1]); g.c.quadraticCurveTo(t[0] + Math.cos(a) * 12, t[1] - 8, t[0] + Math.cos(a) * 20, t[1] + 4 + Math.sin(a) * 4); g.c.stroke(); }
    [[.5, .5], [rw - .5, .5], [.5, rh - .5], [rw - .5, rh - .5]].forEach(function (q, i) { flowersAt(g, q[0], q[1], 4, [['#E9573F', '#FFD84A'], ['#FF7AA8', '#fff']][i % 2], 2, 6); });
    g.box(rw / 2 - .4, rh - .45, .8, .16, 0, 4, '#8A5A33'); g.tree(.3, rh / 2, .7, p.tree);
    if (rw >= 5) { g.tree(rw - .3, rh / 2, .7, p.tree); g.tree(rw / 2, .28, .8, 'cherry'); g.box(.5, rh / 2 - .15, .3, .3, 0, 9, '#E8E4D8'); g.box(rw - .8, rh / 2 - .15, .3, .3, 0, 9, '#E8E4D8'); }
  };
  X.park_gazebo = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#8ED067'); var cx = rw / 2, cy = rh / 2, d = Math.min(rw, rh) * .24, z = 20, wc = p.wall || '#F6F0E0';
    g.box(cx - d - .08, cy - d - .08, 2 * d + .16, 2 * d + .16, 0, 3, '#D9D3C4'); [[-d, -d], [d, -d], [d, d], [-d, d]].forEach(function (q) { g.cyl(cx + q[0], cy + q[1], .06, 3, z, wc); });
    g.hip(cx - d - .1, cy - d - .1, 2 * d + .2, 2 * d + .2, z, z + 14, p.roof || '#D95A42', .12); var t = g.P(cx, cy, z + 14); g.line(t, [t[0], t[1] - 6], '#D9A441', 1.6);
    flowersAt(g, cx, cy + d + .3, 5, ['#FF7AA8', '#fff', '#E9573F'], 2, 6); trees(g, [[.3, .3], [rw - .3, .3], [.3, rh - .3], [rw - .3, rh - .3]], .7, p.tree || ['cherry', 'oak']);
  };
  X.park_koi = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#9ED67A'); var pl = pool(g, rw, rh, .6, '#4DB1EA', 0, '#B9B3A6'), k;
    for (k = 0; k < 5; k++) { var a = k * 1.3 + 1; g.ell(pl[0][0] + Math.cos(a) * pl[1] * .45, pl[0][1] + Math.sin(a) * pl[2] * .45, 4.2, 1.8, k % 2 ? '#F28B2B' : '#fff'); }
    var b1 = g.P(rw / 2 - .8, rh / 2, 4), b2 = g.P(rw / 2 + .8, rh / 2, 4); g.c.strokeStyle = '#D9503C'; g.c.lineWidth = 4; g.c.beginPath(); g.c.moveTo(b1[0], b1[1]); g.c.quadraticCurveTo((b1[0] + b2[0]) / 2, b1[1] - 14, b2[0], b2[1]); g.c.stroke();
    var l = g.P(.35, rh - .35, 0); g.poly([[l[0] - 3, l[1]], [l[0] + 3, l[1]], [l[0] + 2, l[1] - 9], [l[0] - 2, l[1] - 9]], '#9AA3AE', INK); g.ell(l[0], l[1] - 11, 5, 3, '#B9B3A6', INK);
    trees(g, [[.3, .3], [rw - .3, .3], [rw - .3, rh - .3], [.5, rh / 2]], .8, ['autumn', 'cherry', 'autumn', 'oak']);
  };
  X.park_zen = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, '#EFE6CF'); var i; for (i = 1; i < 9; i++) { var t = i / 9; g.line(g.P(.25, .25 + t * (rh - .5), 0), g.P(rw - .25, .25 + t * (rh - .5), 0), 'rgba(150,130,90,.45)', 1.1); }
    [[.35, .4], [rw * .55, rh * .55], [rw * .7, rh * .3]].forEach(function (q, n) { var a = g.P(q[0], q[1], 0); g.ell(a[0], a[1] - 3, 7 - n, 4, '#8A8F99', INK); g.ell(a[0] - 2, a[1] - 5, 3, 1.6, 'rgba(255,255,255,.4)'); });
    g.tree(rw - .35, .35, .8, 'pine'); g.tree(.3, rh - .3, .7, 'cherry'); var m = g.P(rw / 2, rh * .2, 0); g.poly([[m[0] - 9, m[1]], [m[0] + 9, m[1]], [m[0] + 9, m[1] - 3], [m[0] - 9, m[1] - 3]], '#B8452E', INK); g.line([m[0] - 7, m[1] - 3], [m[0] - 7, m[1] - 14], '#B8452E', 2); g.line([m[0] + 7, m[1] - 3], [m[0] + 7, m[1] - 14], '#B8452E', 2); g.line([m[0] - 11, m[1] - 14], [m[0] + 11, m[1] - 14], '#B8452E', 2.4);
  };
  X.park_field = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#8ED067'); var cols = p.cols || ['#E9573F', '#FFD84A', '#FF7AA8'], n = Math.max(4, Math.round(rh * 2.4)), i, j;
    for (i = 0; i < n; i++) {
      var t0 = .2 + i * (rh - .4) / n, t1 = t0 + (rh - .4) / n * .62; g.poly([g.P(.2, t0, 0), g.P(rw - .2, t0, 0), g.P(rw - .2, t1, 0), g.P(.2, t1, 0)], p.row || '#6B4A2E', false);
      for (j = 0; j < Math.round(rw * 3); j++) { var q = g.P(.28 + j * (rw - .56) / (rw * 3), (t0 + t1) / 2, 3); g.line([q[0], q[1] + 1], [q[0], q[1] - 6 - (p.tall || 0)], '#3E9E4B', 1); dot(g, q[0], q[1] - 7 - (p.tall || 0), 2.1, cols[(i + j) % cols.length]); }
    }
    if (p.barn) { g.box(rw - .75, .1, .6, .5, 0, 9, '#C9503C'); g.gable(rw - .8, .06, .7, .58, 9, 16, false, '#6B4A2E', { wall: '#C9503C' }); }
    g.tree(.12, rh - .1, .6);
  };
  X.park_maze = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, '#E8DFC8'); var n = Math.round(rw * 2), m = Math.round(rh * 2), i, j, dx = (rw - .3) / n, dy = (rh - .3) / m;
    for (i = 0; i < n; i++) for (j = 0; j < m; j++) if ((i + j * 3 + hashS(p.id || 'm')) % 3 === 0 || i === 0 || j === 0 || i === n - 1 || j === m - 1) { if (i === n >> 1 && j === m - 1) continue; g.box(.15 + i * dx, .15 + j * dy, dx * .86, dy * .86, 0, 9, '#3F9E55', { top: '#5CBF6E' }); }
    var c = g.P(rw / 2, rh / 2, 0); g.ell(c[0], c[1] - 3, 6, 3, '#E8E4D8', INK); g.ell(c[0], c[1] - 14, 4, 5, '#F6F0E0', INK);
  };
  X.park_orchard = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#9ED67A'); var nx = Math.max(2, Math.round(rw * 1.2)), ny = Math.max(2, Math.round(rh * 1.2)), i, j;
    for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) { g.tree(.45 + i * (rw - .9) / (nx - 1 || 1), .45 + j * (rh - .9) / (ny - 1 || 1), .62, p.tree || 'oak'); }
    var q = g.P(rw - .4, rh - .25, 0); [[0, 0], [6, 2], [3, -4]].forEach(function (o) { dot(g, q[0] + o[0], q[1] + o[1] - 3, 3, p.fruit || '#E9573F'); });
  };
  X.park_picnic = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#8ED067'); [[.3, .3, '#E9573F'], [rw * .55, rh * .5, '#4F80BA'], [rw * .25, rh * .65, '#FFD84A']].forEach(function (b) { g.poly(g.faceT(b[0], b[1], .7, .55, 1), b[2], INK); g.poly(g.faceT(b[0] + .12, b[1] + .1, .26, .22, 1.5), '#fff', false); });
    var k; for (k = 0; k < 4; k++) { var s = g.P(rw * (.2 + k * .22), rh * .2, 0); g.line(s, [s[0] + 3, s[1] - 28], '#8A8F99', .9); dot(g, s[0] + 3, s[1] - 30, 5, ['#E9573F', '#4F80BA', '#FFD84A', '#6BCB6F'][k]); }
    trees(g, [[rw - .3, .3], [rw - .3, rh - .3]], .8, p.tree || ['oak', 'cherry']); var bk = g.P(rw * .72, rh * .72, 1); g.poly([[bk[0] - 5, bk[1]], [bk[0] + 5, bk[1]], [bk[0] + 4, bk[1] - 6], [bk[0] - 4, bk[1] - 6]], '#B9724A', INK);
  };
  X.park_falls = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#8ED067'); g.box(.25, .15, rw * .5, .7, 0, 26, '#9AA3AE'); g.box(.25 + rw * .25, .2, rw * .28, .6, 0, 38, '#8A8F99'); g.flat(.25 + rw * .25, .2, rw * .28, .6, 38, '#7CC25F', '#5BAE55');
    var a = g.P(.25 + rw * .39, .2 + .6, 36), b = g.P(.25 + rw * .39, .2 + .6, 3); g.poly([[a[0] - 7, a[1]], [a[0] + 7, a[1]], [b[0] + 9, b[1]], [b[0] - 9, b[1]]], 'rgba(150,215,255,.95)', false); g.line([a[0] - 2, a[1]], [b[0] - 3, b[1]], '#fff', 1.2);
    var pl = g.P(rw * .6, rh * .72, 0); g.ell(pl[0], pl[1], rw * 18, rh * 9, '#4DB1EA', 'rgba(255,255,255,.6)'); g.ell(pl[0] - 6, pl[1] - 2, rw * 6, rh * 3, 'rgba(255,255,255,.35)'); trees(g, [[.3, rh - .3], [rw - .3, .3], [rw - .3, rh - .3]], .75, ['pine', 'pine', 'oak']);
  };
  X.park_grove = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#9ED67A'); var n = Math.round(rw * rh * 2.2), i, pts = [];
    for (i = 0; i < n; i++) pts.push([.25 + r() * (rw - .5), .25 + r() * (rh - .5)]); pts.sort(function (a, b) { return (a[0] + a[1]) - (b[0] + b[1]); });
    pts.forEach(function (q, i) { var s = g.P(q[0], q[1], 0), h = 30 + (i % 4) * 8; g.line([s[0], s[1]], [s[0], s[1] - h], i % 2 ? '#6BBF4E' : '#58AE3E', 2.6); [10, 20].forEach(function (z) { g.line([s[0] - 2, s[1] - z], [s[0] + 2, s[1] - z], '#3E7E2E', 1); }); g.ell(s[0] + 3, s[1] - h + 2, 5, 2, '#7ACB5A'); g.ell(s[0] - 3, s[1] - h + 8, 5, 2, '#5CB848'); });
  };
  X.park_terrace = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#C8DC9A'); var n = 4, i, z = 0, hh = 6;
    for (i = 0; i < n; i++) { var x0 = .1 + i * .12, w = rw - .2 - i * .24, y0 = .1 + i * (rh - .6) / n, d = (rh - .6) / n + .5; g.box(x0, y0, w, d, z, z + hh, p.wall || '#B9A27A'); g.poly(g.faceT(x0 + .05, y0 + .05, w - .1, d - .1, z + hh), i % 2 ? (p.c2 || '#7CC25F') : (p.c1 || '#A8D86B'), false); var j; for (j = 0; j < Math.round(w * 3); j++) { var q = g.P(x0 + .15 + j * (w - .3) / (w * 3), y0 + d / 2, z + hh); g.line(q, [q[0], q[1] - 3], '#3E9E4B', 1.3); } z += hh; }
    var h = g.P(rw - .35, rh - .3, 0); g.box(rw - .55, rh - .5, .4, .3, 0, 8, '#F2EAD8'); g.gable(rw - .6, rh - .55, .5, .4, 8, 14, true, '#8A5A33', { wall: '#F2EAD8' });
  };
  X.park_rink = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, '#F2F7FC'); g.poly(g.faceT(.3, .3, rw - .6, rh - .6, 1), p.ice || '#CDEAF8', INK); g.line(g.P(rw / 2, .3, 1), g.P(rw / 2, rh - .3, 1), 'rgba(80,140,200,.45)', 1.2);
    var c = g.P(rw / 2, rh / 2, 1); g.ell(c[0], c[1], 9, 4.5, 'rgba(80,140,200,.4)', false); fence(g, .26, .26, rw - .52, rh - .52, '#E9573F'); [[.45, .45], [rw - .45, rh - .45]].forEach(function (q, i) { var s = g.P(q[0], q[1], 1); dot(g, s[0], s[1] - 7, 2.8, ['#E9573F', '#4F80BA'][i]); g.line([s[0], s[1] - 4], [s[0], s[1]], '#3A3A55', 1.6); });
    trees(g, [[.12, .12], [rw - .12, .12]], .7, 'pine');
  };
  X.park_skate = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, '#C9C4B8'); [[.25, .25, .9, .6, '#4F80BA'], [rw * .5, rh * .45, .8, .7, '#E9573F'], [.3, rh * .65, .6, .5, '#FFD84A']].forEach(function (b) {
      var a = g.P(b[0], b[1] + b[3], 0), c = g.P(b[0] + b[2], b[1] + b[3], 0), d = g.P(b[0] + b[2], b[1] + b[3], 9), e = g.P(b[0], b[1] + b[3], 4); g.poly([a, c, d, e], b[4], INK); g.poly([g.P(b[0], b[1], 0), a, e, g.P(b[0], b[1], 4)], shade(b[4], .8), false);
    });
    g.tree(rw - .25, .25, .7); var s = g.P(rw * .8, rh * .75, 0); g.line([s[0] - 8, s[1]], [s[0] - 8, s[1] - 18], '#6B7686', 1.6); g.line([s[0] + 8, s[1]], [s[0] + 8, s[1] - 18], '#6B7686', 1.6); g.line([s[0] - 8, s[1] - 18], [s[0] + 8, s[1] - 18], '#6B7686', 1.6); g.line([s[0] - 4, s[1] - 18], [s[0] - 4, s[1] - 6], '#B8452E', 1); g.line([s[0] + 4, s[1] - 18], [s[0] + 4, s[1] - 6], '#B8452E', 1); g.box(rw * .8 - .12, rh * .75 - .05, .24, .1, 0, 2, '#8A5A33');
  };
  X.park_dome = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#9ED67A'); g.keep = true; g.poly(g.faceT(.2, .2, rw - .4, rh - .4, 0), '#D9D3C4', false); g.keep = false; var c = ctr(g, rw, rh), R = Math.min(rw, rh) * .4;
    [[-.25, 0, '#E9573F'], [.2, -.1, '#FFD84A'], [0, .25, '#B77CFF'], [.1, .2, '#3FA55B']].forEach(function (q) { var s = g.P(rw / 2 + q[0] * R * 2, rh / 2 + q[1] * R * 2, 0); g.line(s, [s[0], s[1] - 14], '#3E9E4B', 2.2); dot(g, s[0], s[1] - 16, 3.6, q[2]); });
    dome(g, rw / 2, rh / 2, R, 0, 34 + lv * 3, p.glass || '#BFE6F5', .55); g.c.strokeStyle = 'rgba(255,255,255,.7)'; g.c.lineWidth = 1; [-.5, 0, .5].forEach(function (f) { g.c.beginPath(); g.c.moveTo(c[0] + f * R * 40, c[1] + 2); g.c.lineTo(c[0] + f * R * 24, c[1] - 30); g.c.stroke(); });
  };
  X.park_lake = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#9ED67A'); var pl = pool(g, rw, rh, .66, p.water || '#4DB1EA', 0, '#F3E0AE'); var b = g.P(rw * .4, rh * .5, 0);
    g.poly([[b[0] - 9, b[1]], [b[0] + 9, b[1]], [b[0] + 6, b[1] + 4], [b[0] - 6, b[1] + 4]], '#E9573F', INK); g.line([b[0], b[1]], [b[0], b[1] - 16], '#6B4A2E', 1.4); g.poly([[b[0], b[1] - 16], [b[0] + 9, b[1] - 3], [b[0], b[1] - 3]], '#fff', INK);
    var b2 = g.P(rw * .66, rh * .62, 0); g.poly([[b2[0] - 7, b2[1]], [b2[0] + 7, b2[1]], [b2[0] + 4, b2[1] + 3], [b2[0] - 4, b2[1] + 3]], '#4F80BA', INK); g.line([b2[0], b2[1]], [b2[0], b2[1] - 12], '#6B4A2E', 1.2); g.poly([[b2[0], b2[1] - 12], [b2[0] + 7, b2[1] - 2], [b2[0], b2[1] - 2]], '#FFD84A', INK);
    g.box(rw - .5, rh * .4, .35, rh * .3, 0, 3, '#8A5A33'); trees(g, [[.25, .25], [rw - .3, .25], [.25, rh - .25]], .75, ['oak', 'willow', 'cherry']);
  };
  X.park_rose = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#9ED67A'); var n = Math.max(2, Math.round(rw)), i;
    for (i = 0; i < n; i++) { var a = g.P(.4 + i * (rw - .8) / (n - 1 || 1), rh * .45, 0); g.line(a, [a[0], a[1] - 22], '#F2EAD8', 2.2); }
    for (i = 0; i < n - 1; i++) { var s = g.P(.4 + i * (rw - .8) / (n - 1), rh * .45, 22), e = g.P(.4 + (i + 1) * (rw - .8) / (n - 1), rh * .45, 22); g.c.strokeStyle = '#F2EAD8'; g.c.lineWidth = 2.2; g.c.beginPath(); g.c.moveTo(s[0], s[1]); g.c.quadraticCurveTo((s[0] + e[0]) / 2, s[1] - 8, e[0], e[1]); g.c.stroke(); [.3, .6].forEach(function (f) { dot(g, s[0] + (e[0] - s[0]) * f, s[1] - 6 + (e[1] - s[1]) * f, 2.4, ['#E8355A', '#FF8FAE', '#fff'][i % 3]); }); }
    var j; for (j = 0; j < 12; j++) { var q = g.P(.3 + (j % 6) * (rw - .6) / 5, rh * (j < 6 ? .18 : .8), 3); dot(g, q[0], q[1] - 4, 3, ['#E8355A', '#FF8FAE', '#fff', '#FFD84A'][j % 4]); dot(g, q[0], q[1] - 1, 2, '#3E9E4B'); }
  };
  X.park_desert = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, '#EBD9A8'); [[.35, .35], [rw - .4, .4], [rw * .5, rh * .6], [.4, rh - .35], [rw - .4, rh - .4]].forEach(function (q, n) { var s = g.P(q[0], q[1], 0); sh(g, s, 8); g.poly([[s[0] - 3, s[1]], [s[0] + 3, s[1]], [s[0] + 2.6, s[1] - 18 - n * 2], [s[0] - 2.6, s[1] - 18 - n * 2]], '#4DA25A', INK); g.line([s[0] - 3, s[1] - 9], [s[0] - 8, s[1] - 9], '#4DA25A', 3); g.line([s[0] - 8, s[1] - 9], [s[0] - 8, s[1] - 16], '#4DA25A', 3); });
    var a = g.P(rw * .7, rh * .25, 0); g.ell(a[0], a[1] - 3, 7, 4, '#B8A27A', INK); g.ell(a[0] - 10, a[1] + 2, 5, 3, '#C9B48A', INK); var o = g.P(rw * .3, rh * .6, 0); g.ell(o[0], o[1], 12, 5, '#4DB1EA', '#fff'); g.tree(rw * .3 - .3, rh * .6, .5, 'palm');
  };
  X.park_lagoon = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, '#F3E0AE'); var pl = pool(g, rw, rh, .62, '#35C2D9', 0, '#8FE6F0'), k;
    for (k = 0; k < 3; k++) { var a = k * 2.2 + .4, s = g.P(rw / 2 + Math.cos(a) * rw * .42, rh / 2 + Math.sin(a) * rh * .42, 0); g.line([s[0], s[1]], [s[0] + 2, s[1] - 24], '#8A5A33', 2.4); [[-9, -4], [9, -4], [0, -9], [-6, 2], [6, 2]].forEach(function (q) { g.line([s[0] + 2, s[1] - 24], [s[0] + 2 + q[0], s[1] - 24 + q[1] + 4], '#3FA55B', 2.4); }); }
    var u = g.P(rw * .2, rh * .75, 0); g.line(u, [u[0], u[1] - 14], '#8A5A33', 1.4); g.poly([[u[0] - 9, u[1] - 14], [u[0] + 9, u[1] - 14], [u[0], u[1] - 22]], '#E9573F', INK);
  };
  X.park_glade = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#6BC26E'); var cols = ['#E9573F', '#FFD84A', '#B77CFF', '#FF7AA8'];
    [[.35, .4, 1.3], [rw * .55, rh * .35, 1], [rw * .3, rh * .7, .9], [rw * .7, rh * .65, 1.2], [rw * .5, rh * .5, 1.6]].forEach(function (q, n) { var s = g.P(q[0], q[1], 0); sh(g, s, 6 * q[2]); g.poly([[s[0] - 1.6 * q[2], s[1]], [s[0] + 1.6 * q[2], s[1]], [s[0] + 1.3 * q[2], s[1] - 8 * q[2]], [s[0] - 1.3 * q[2], s[1] - 8 * q[2]]], '#F6F0E0', INK); g.ell(s[0], s[1] - 9 * q[2], 8 * q[2], 5 * q[2], cols[n % 4], INK); [[-3, -1], [3, -2], [0, 1]].forEach(function (d) { dot(g, s[0] + d[0] * q[2], s[1] - (9 + d[1]) * q[2], 1.1 * q[2], '#fff'); }); });
    var m, nm = Math.round(rw * rh / 3); for (m = 0; m < nm; m++) { var ms = g.P(.3 + r() * (rw - .6), .3 + r() * (rh - .6), 0), cs = .7 + r() * .5; g.poly([[ms[0] - 1.2 * cs, ms[1]], [ms[0] + 1.2 * cs, ms[1]], [ms[0] + 1 * cs, ms[1] - 6 * cs], [ms[0] - 1 * cs, ms[1] - 6 * cs]], '#F6F0E0', false); g.ell(ms[0], ms[1] - 7 * cs, 5.4 * cs, 3.6 * cs, cols[m % 4], INK); dot(g, ms[0] - 1, ms[1] - 8 * cs, 1, '#fff'); }
    var k; for (k = 0; k < 10; k++) { var f = g.P(.2 + r() * (rw - .4), .2 + r() * (rh - .4), 6 + r() * 10); dot(g, f[0], f[1], 1.2, '#FFF3A0'); g.glow.push({ c: [f[0], f[1]], r: 7 }); }
  };
  X.park_snow = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, '#F2F7FC'); [[.4, .5], [rw * .6, rh * .4], [rw * .45, rh * .75]].forEach(function (q, n) { var s = g.P(q[0], q[1], 0); sh(g, s, 8); g.ell(s[0], s[1] - 4, 7, 6, '#fff', INK); g.ell(s[0], s[1] - 13, 5, 5, '#fff', INK); dot(g, s[0] - 1.5, s[1] - 14, .8, '#222'); dot(g, s[0] + 1.5, s[1] - 14, .8, '#222'); g.poly([[s[0], s[1] - 12.5], [s[0] + 5, s[1] - 12], [s[0], s[1] - 11.5]], '#F28B2B', false); g.line([s[0] - 5, s[1] - 9], [s[0] + 5, s[1] - 9], ['#E9573F', '#4F80BA', '#4DA25A'][n], 2); });
    trees(g, [[rw - .3, .3], [.3, .3], [rw - .3, rh - .3], [.3, rh - .3]], .85, 'pine'); [[rw - .3, .3], [.3, .3]].forEach(function (q) { var s = g.P(q[0], q[1], 22); g.ell(s[0], s[1], 7, 2.6, 'rgba(255,255,255,.9)', false); });
  };
  X.park_sculpt = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#9ED67A'); var n = Math.max(2, Math.round(rw * rh / 3)), i, cols = ['#E9573F', '#4F80BA', '#FFD84A', '#6BCB6F', '#B77CFF', '#2EC4B6'];
    for (i = 0; i < n; i++) { var x = .55 + (i % 3) * (rw - 1.1) / 2, y = .5 + Math.floor(i / 3) * (rh - 1) / Math.max(1, Math.ceil(n / 3) - 1 || 1); g.box(x - .18, y - .14, .36, .28, 0, 6, '#E8E4D8'); var s = g.P(x, y, 6), c = cols[i % 6]; if (i % 3 === 0) g.ell(s[0], s[1] - 8, 6, 8, c, INK); else if (i % 3 === 1) g.poly([[s[0] - 7, s[1]], [s[0], s[1] - 17], [s[0] + 7, s[1]]], c, INK); else { g.ell(s[0] - 3, s[1] - 7, 4, 5, c, INK); g.ell(s[0] + 4, s[1] - 12, 4, 5, shade(c, .85), INK); } }
  };
  X.park_pumpkin = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#B8D888'); var k; for (k = 0; k < Math.round(rw * rh * 2.5); k++) { var s = g.P(.25 + r() * (rw - .5), .25 + r() * (rh - .5), 0); g.ell(s[0], s[1] - 3, 4.2, 3.4, '#F28B2B', INK); g.ell(s[0], s[1] - 3, 1.6, 3.4, '#E07A1B', false); g.line([s[0], s[1] - 6], [s[0] + 1, s[1] - 8], '#4DA25A', 1.4); }
    var c = g.P(rw - .4, .4, 0); g.line([c[0], c[1]], [c[0], c[1] - 24], '#8A5A33', 2); g.line([c[0] - 9, c[1] - 17], [c[0] + 9, c[1] - 17], '#8A5A33', 2); g.ell(c[0], c[1] - 27, 4.4, 4.4, '#E8D7B5', INK); g.poly([[c[0] - 6, c[1] - 30], [c[0] + 6, c[1] - 30], [c[0], c[1] - 37]], '#6B4A2E', INK);
  };
  X.park_amphi = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#9ED67A'); var i, z = 0; for (i = 0; i < 4; i++) { var x0 = .15 + i * .22, w = rw - .3 - i * .44; g.box(x0, rh * .4 + i * rh * .12, w, rh * .12, z, z + 4, i % 2 ? '#E8E4D8' : '#D9D3C4'); z += 3.5; }
    g.box(.5, .1, rw - 1, rh * .3, 0, 3, '#B58555'); var a = g.P(rw / 2, .3, 3), c; for (c = 0; c < 4; c++) g.line([a[0] - 22 + c * 15, a[1] - 3], [a[0] - 22 + c * 15, a[1] - 22], '#F2EAD8', 3); g.line([a[0] - 24, a[1] - 22], [a[0] + 24, a[1] - 22], '#F2EAD8', 3);
    trees(g, [[.2, rh - .2], [rw - .2, rh - .2]], .7, ['oak', 'cherry']);
  };
  X.park_kids = function (g, rw, rh, lv, p, r) {
    lot(g, rw, rh, p.g || '#EBD9A8'); var s = g.P(rw * .3, rh * .35, 0), k;
    g.line([s[0] - 12, s[1]], [s[0] - 6, s[1] - 24], '#E9573F', 2); g.line([s[0] + 12, s[1]], [s[0] + 6, s[1] - 24], '#E9573F', 2); g.line([s[0] - 6, s[1] - 24], [s[0] + 6, s[1] - 24], '#E9573F', 2.4); g.line([s[0] - 3, s[1] - 24], [s[0] - 3, s[1] - 8], '#6B7686', 1); g.line([s[0] + 3, s[1] - 24], [s[0] + 3, s[1] - 8], '#6B7686', 1); g.box(rw * .3 - .08, rh * .35 - .05, .16, .1, 0, 0.1, '#8A5A33');
    var sl = g.P(rw * .65, rh * .45, 0); g.box(rw * .6, rh * .4, .5, .35, 0, 16, '#FFD84A'); g.poly([g.P(rw * .6, rh * .75, 16), g.P(rw * .6 + .5, rh * .75, 16), g.P(rw * .6 + .5, rh * .75 + .9, 0), g.P(rw * .6, rh * .75 + .9, 0)], '#4F80BA', INK);
    var sd = g.P(rw * .35, rh * .75, 0); g.ell(sd[0], sd[1], 12, 5, '#C9A06A', INK); g.ell(sd[0], sd[1] - 1, 8, 3.4, '#EBD9A8', false); trees(g, [[.25, .2], [rw - .25, rh - .25]], .7);
  };
  X.park_sun = function (g, rw, rh, lv, p, r) { X.park_field(g, rw, rh, lv, { g: '#9ED67A', cols: ['#FFD84A', '#F2B01B'], tall: 8, row: '#6B4A2E', barn: false }, r); };

  /* ═════════ ĐỒ TRANG TRÍ NHỎ (1×1, 2×1, 2×2) ═════════ */
  var D = {};
  D.well = function (g, rw, rh, c) { sh(g, c, 10); g.cyl(rw / 2, rh / 2, .26, 0, 9, '#B9B3A6'); g.ell(c[0], c[1] - 9, 7, 3.2, '#4A7FA8', false); g.line([c[0] - 8, c[1] - 9], [c[0] - 8, c[1] - 24], '#8A5A33', 2); g.line([c[0] + 8, c[1] - 9], [c[0] + 8, c[1] - 24], '#8A5A33', 2); g.poly([[c[0] - 12, c[1] - 24], [c[0], c[1] - 33], [c[0] + 12, c[1] - 24]], '#B8452E', INK); };
  D.mailbox = function (g, rw, rh, c) { sh(g, c, 6); g.line([c[0], c[1]], [c[0], c[1] - 14], '#8A5A33', 2.2); g.poly([[c[0] - 7, c[1] - 14], [c[0] + 7, c[1] - 14], [c[0] + 7, c[1] - 22], [c[0] - 7, c[1] - 22]], '#E9573F', INK); g.ell(c[0], c[1] - 22, 7, 2.6, '#E9573F', INK); g.line([c[0] + 7, c[1] - 20], [c[0] + 12, c[1] - 26], '#FFD84A', 1.6); };
  D.signpost = function (g, rw, rh, c) { sh(g, c, 6); g.line([c[0], c[1]], [c[0], c[1] - 30], '#8A5A33', 2.4); [[-1, -26, '#E9573F'], [1, -20, '#4F80BA'], [-1, -14, '#FFD84A']].forEach(function (a) { g.poly([[c[0], c[1] + a[1] - 4], [c[0] + a[0] * 14, c[1] + a[1] - 4], [c[0] + a[0] * 17, c[1] + a[1]], [c[0] + a[0] * 14, c[1] + a[1] + 4], [c[0], c[1] + a[1] + 4]], a[2], INK); }); };
  D.sundial = function (g, rw, rh, c) { sh(g, c, 9); g.ell(c[0], c[1] - 2, 11, 5, '#D9D3C4', INK); g.ell(c[0], c[1] - 4, 9, 4, '#EFE9DA', false); g.poly([[c[0] - 1, c[1] - 4], [c[0] + 7, c[1] - 6], [c[0] + 1, c[1] - 16]], '#B8452E', INK); };
  D.totem = function (g, rw, rh, c) { sh(g, c, 7); [['#B8452E', 0], ['#2E8A8A', 1], ['#FFD84A', 2], ['#4F80BA', 3]].forEach(function (a) { g.poly([[c[0] - 5, c[1] - a[1] * 9], [c[0] + 5, c[1] - a[1] * 9], [c[0] + 5, c[1] - a[1] * 9 - 9], [c[0] - 5, c[1] - a[1] * 9 - 9]], a[0], INK); dot(g, c[0] - 2, c[1] - a[1] * 9 - 5, 1, '#fff'); dot(g, c[0] + 2, c[1] - a[1] * 9 - 5, 1, '#fff'); }); g.poly([[c[0] - 9, c[1] - 30], [c[0] + 9, c[1] - 30], [c[0], c[1] - 38]], '#8A5A33', INK); };
  D.bigmush = function (g, rw, rh, c) { sh(g, c, 10); g.poly([[c[0] - 3, c[1]], [c[0] + 3, c[1]], [c[0] + 2.4, c[1] - 12], [c[0] - 2.4, c[1] - 12]], '#F6F0E0', INK); g.ell(c[0], c[1] - 14, 13, 8, '#E9573F', INK); [[-5, -16], [4, -18], [0, -13], [7, -13]].forEach(function (q) { dot(g, c[0] + q[0], c[1] + q[1], 1.8, '#fff'); }); };
  D.haystack = function (g, rw, rh, c) { sh(g, c, 11); g.ell(c[0], c[1] - 6, 11, 8, '#E8C45A', INK); g.poly([[c[0] - 11, c[1] - 6], [c[0] + 11, c[1] - 6], [c[0] + 11, c[1]], [c[0] - 11, c[1]]], '#D9AE3E', false); g.ell(c[0], c[1], 11, 4, '#D9AE3E', INK); g.ell(c[0], c[1] - 12, 6, 3, '#F0D27A', false); };
  D.igloo = function (g, rw, rh, c) { sh(g, c, 13); g.c.beginPath(); g.c.moveTo(c[0] - 13, c[1]); g.c.ellipse(c[0], c[1], 13, 15, 0, Math.PI, 0); g.c.closePath(); g.c.fillStyle = '#F2F7FC'; g.c.fill(); g.c.strokeStyle = INK; g.c.stroke(); g.line([c[0] - 10, c[1] - 6], [c[0] + 10, c[1] - 6], 'rgba(100,130,170,.45)', 1); g.line([c[0] - 6, c[1] - 11], [c[0] + 6, c[1] - 11], 'rgba(100,130,170,.45)', 1); g.ell(c[0], c[1] - 3, 4, 4, '#4A6F9C', false); };
  D.snowman = function (g, rw, rh, c) { sh(g, c, 8); g.ell(c[0], c[1] - 6, 8, 7, '#fff', INK); g.ell(c[0], c[1] - 16, 6, 6, '#fff', INK); dot(g, c[0] - 2, c[1] - 17, .9, '#222'); dot(g, c[0] + 2, c[1] - 17, .9, '#222'); g.poly([[c[0], c[1] - 15.5], [c[0] + 6, c[1] - 15], [c[0], c[1] - 14.2]], '#F28B2B', false); g.line([c[0] - 5, c[1] - 12], [c[0] + 5, c[1] - 12], '#E9573F', 2.2); g.poly([[c[0] - 5, c[1] - 21], [c[0] + 5, c[1] - 21], [c[0] + 3, c[1] - 28], [c[0] - 3, c[1] - 28]], '#3A3A55', INK); };
  D.pumpkinp = function (g, rw, rh, c) { sh(g, c, 9); [[-5, 0, 1], [5, 1, .9], [0, -3, .7]].forEach(function (q) { g.ell(c[0] + q[0], c[1] + q[1] - 4, 6 * q[2], 5 * q[2], '#F28B2B', INK); g.line([c[0] + q[0], c[1] + q[1] - 9 * q[2]], [c[0] + q[0] + 1, c[1] + q[1] - 11 * q[2]], '#4DA25A', 1.4); }); };
  D.birdbath = function (g, rw, rh, c) { sh(g, c, 8); g.poly([[c[0] - 3, c[1]], [c[0] + 3, c[1]], [c[0] + 2, c[1] - 12], [c[0] - 2, c[1] - 12]], '#D9D3C4', INK); g.ell(c[0], c[1] - 13, 10, 4, '#D9D3C4', INK); g.ell(c[0], c[1] - 13, 7.5, 2.8, '#6FC8F2', false); dot(g, c[0] + 3, c[1] - 17, 2.4, '#4F80BA'); g.poly([[c[0] + 5, c[1] - 17], [c[0] + 8, c[1] - 16], [c[0] + 5, c[1] - 15]], '#F28B2B', false); };
  D.arch = function (g, rw, rh, c) { sh(g, c, 11); g.line([c[0] - 12, c[1]], [c[0] - 12, c[1] - 26], '#F2EAD8', 3); g.line([c[0] + 12, c[1]], [c[0] + 12, c[1] - 26], '#F2EAD8', 3); g.c.strokeStyle = '#F2EAD8'; g.c.lineWidth = 3; g.c.beginPath(); g.c.arc(c[0], c[1] - 26, 12, Math.PI, 0); g.c.stroke(); [[-12, -10], [-12, -20], [-8, -33], [0, -38], [8, -33], [12, -20], [12, -10]].forEach(function (q, n) { dot(g, c[0] + q[0], c[1] + q[1], 2.4, ['#FF7AA8', '#fff', '#E9573F'][n % 3]); }); };
  D.pergola = function (g, rw, rh, c) { sh(g, c, 14); [[-14, 3], [14, 3], [-14, -4], [14, -4]].forEach(function (q) { g.line([c[0] + q[0], c[1] + q[1]], [c[0] + q[0], c[1] + q[1] - 24], '#8A5A33', 2.4); }); [-14, -7, 0, 7, 14].forEach(function (x) { g.line([c[0] + x, c[1] - 28], [c[0] + x, c[1] - 20], '#6B4A2E', 2); }); g.line([c[0] - 14, c[1] - 24], [c[0] + 14, c[1] - 24], '#8A5A33', 2.4); g.line([c[0] - 14, c[1] - 20], [c[0] + 14, c[1] - 20], '#8A5A33', 2); [[-9, -22], [0, -23], [9, -22]].forEach(function (q) { g.ell(c[0] + q[0], c[1] + q[1], 4, 2.4, '#5CBF6E'); }); };
  D.swing = function (g, rw, rh, c) { sh(g, c, 12); g.line([c[0] - 13, c[1] + 2], [c[0] - 6, c[1] - 28], '#8A5A33', 2.4); g.line([c[0] + 13, c[1] + 2], [c[0] + 6, c[1] - 28], '#8A5A33', 2.4); g.line([c[0] - 6, c[1] - 28], [c[0] + 6, c[1] - 28], '#8A5A33', 2.4); g.line([c[0] - 3, c[1] - 28], [c[0] - 3, c[1] - 9], '#6B7686', 1); g.line([c[0] + 3, c[1] - 28], [c[0] + 3, c[1] - 9], '#6B7686', 1); g.poly([[c[0] - 5, c[1] - 9], [c[0] + 5, c[1] - 9], [c[0] + 5, c[1] - 7], [c[0] - 5, c[1] - 7]], '#E9573F', INK); };
  D.hammock = function (g, rw, rh, c) { sh(g, c, 13); g.line([c[0] - 16, c[1] + 1], [c[0] - 16, c[1] - 22], '#8A5A33', 2.6); g.line([c[0] + 16, c[1] + 1], [c[0] + 16, c[1] - 22], '#8A5A33', 2.6); g.c.fillStyle = '#E9573F'; g.c.strokeStyle = INK; g.c.beginPath(); g.c.moveTo(c[0] - 16, c[1] - 20); g.c.quadraticCurveTo(c[0], c[1] - 4, c[0] + 16, c[1] - 20); g.c.quadraticCurveTo(c[0], c[1] - 11, c[0] - 16, c[1] - 20); g.c.fill(); g.c.stroke(); g.ext(c[0], c[1] - 10, 18); };
  D.tent = function (g, rw, rh, c) { sh(g, c, 13); g.poly([[c[0] - 14, c[1]], [c[0], c[1] - 24], [c[0] + 14, c[1]]], '#E9573F', INK); g.poly([[c[0], c[1]], [c[0], c[1] - 24], [c[0] + 14, c[1]]], '#C9432E', false); g.poly([[c[0] - 4, c[1]], [c[0], c[1] - 12], [c[0] + 4, c[1]]], '#4A2E18', false); };
  D.campfire = function (g, rw, rh, c) { sh(g, c, 9); g.line([c[0] - 7, c[1] - 1], [c[0] + 6, c[1] - 5], '#6B4A2E', 3.4); g.line([c[0] + 7, c[1] - 1], [c[0] - 6, c[1] - 5], '#6B4A2E', 3.4); g.poly([[c[0] - 5, c[1] - 4], [c[0], c[1] - 18], [c[0] + 5, c[1] - 4]], '#F28B2B', false); g.poly([[c[0] - 2.4, c[1] - 4], [c[0], c[1] - 12], [c[0] + 2.4, c[1] - 4]], '#FFD84A', false); g.glow.push({ c: [c[0], c[1] - 8], r: 18 }); };
  D.barrels = function (g, rw, rh, c) { sh(g, c, 12); [[-7, 0], [7, 0], [0, -6]].forEach(function (q, n) { g.ell(c[0] + q[0], c[1] + q[1] - 6, 6, 8, n === 2 ? '#B58555' : '#8A5A33', INK); g.line([c[0] + q[0] - 6, c[1] + q[1] - 9], [c[0] + q[0] + 6, c[1] + q[1] - 9], '#4A2E18', 1.2); g.line([c[0] + q[0] - 6, c[1] + q[1] - 3], [c[0] + q[0] + 6, c[1] + q[1] - 3], '#4A2E18', 1.2); }); };
  D.cartp = function (g, rw, rh, c) { sh(g, c, 13); g.poly([[c[0] - 12, c[1] - 8], [c[0] + 12, c[1] - 8], [c[0] + 9, c[1] - 2], [c[0] - 9, c[1] - 2]], '#8A5A33', INK); g.ell(c[0] - 6, c[1] - 1, 4.4, 4.4, '#6B4A2E', INK); g.ell(c[0] + 6, c[1] - 1, 4.4, 4.4, '#6B4A2E', INK); [[-6, -10], [0, -12], [6, -10]].forEach(function (q) { dot(g, c[0] + q[0], c[1] + q[1], 3.4, ['#E9573F', '#FFD84A', '#6BCB6F'][Math.round(q[0] / 6) + 1]); }); g.line([c[0] + 12, c[1] - 6], [c[0] + 22, c[1] - 2], '#8A5A33', 2); };
  D.toriip = function (g, rw, rh, c) { sh(g, c, 13); g.line([c[0] - 11, c[1]], [c[0] - 11, c[1] - 30], '#D9503C', 3.4); g.line([c[0] + 11, c[1]], [c[0] + 11, c[1] - 30], '#D9503C', 3.4); g.poly([[c[0] - 17, c[1] - 30], [c[0] + 17, c[1] - 30], [c[0] + 14, c[1] - 34], [c[0] - 14, c[1] - 34]], '#2A2A36', INK); g.line([c[0] - 13, c[1] - 24], [c[0] + 13, c[1] - 24], '#D9503C', 2.6); };
  D.anchor = function (g, rw, rh, c) { sh(g, c, 9); g.c.strokeStyle = '#4B4F5A'; g.c.lineWidth = 2.6; g.c.lineCap = 'round'; g.c.beginPath(); g.c.moveTo(c[0], c[1] - 24); g.c.lineTo(c[0], c[1] - 4); g.c.moveTo(c[0] - 6, c[1] - 18); g.c.lineTo(c[0] + 6, c[1] - 18); g.c.moveTo(c[0] - 9, c[1] - 9); g.c.quadraticCurveTo(c[0], c[1] + 2, c[0] + 9, c[1] - 9); g.c.stroke(); g.ell(c[0], c[1] - 26, 3, 3, false, '#4B4F5A'); g.ext(c[0], c[1] - 10, 14); };
  D.rowboat = function (g, rw, rh, c) { sh(g, c, 12); g.poly([[c[0] - 14, c[1] - 6], [c[0] + 14, c[1] - 6], [c[0] + 9, c[1]], [c[0] - 9, c[1]]], '#4F80BA', INK); g.line([c[0] - 8, c[1] - 6], [c[0] + 8, c[1] - 6], '#E8E4D8', 2); g.line([c[0] - 12, c[1] - 9], [c[0] + 14, c[1] - 1], '#8A5A33', 1.6); };
  D.umbrella = function (g, rw, rh, c) { sh(g, c, 11); g.line([c[0], c[1]], [c[0], c[1] - 28], '#F2EAD8', 2); g.poly([[c[0] - 14, c[1] - 24], [c[0], c[1] - 36], [c[0] + 14, c[1] - 24]], '#E9573F', INK); g.poly([[c[0] - 4, c[1] - 24], [c[0], c[1] - 36], [c[0] + 5, c[1] - 24]], '#fff', false); g.ell(c[0] + 10, c[1] - 1, 6, 2.4, '#4F80BA', INK); };
  D.lanternp = function (g, rw, rh, c) { sh(g, c, 8); g.poly([[c[0] - 5, c[1]], [c[0] + 5, c[1]], [c[0] + 3, c[1] - 6], [c[0] - 3, c[1] - 6]], '#8A8F99', INK); g.poly([[c[0] - 2, c[1] - 6], [c[0] + 2, c[1] - 6], [c[0] + 2, c[1] - 14], [c[0] - 2, c[1] - 14]], '#9AA3AE', INK); g.poly([[c[0] - 6, c[1] - 14], [c[0] + 6, c[1] - 14], [c[0] + 6, c[1] - 22], [c[0] - 6, c[1] - 22]], '#FFE9A0', INK); g.poly([[c[0] - 9, c[1] - 22], [c[0], c[1] - 29], [c[0] + 9, c[1] - 22]], '#6B7686', INK); g.glow.push({ c: [c[0], c[1] - 18], r: 14 }); };
  D.obelisk = function (g, rw, rh, c) { sh(g, c, 8); g.box(rw / 2 - .2, rh / 2 - .15, .4, .3, 0, 4, '#D9D3C4'); g.poly([[c[0] - 5, c[1] - 4], [c[0] + 5, c[1] - 4], [c[0] + 3, c[1] - 38], [c[0] - 3, c[1] - 38]], '#E8E4D8', INK); g.poly([[c[0] - 3, c[1] - 38], [c[0], c[1] - 46], [c[0] + 3, c[1] - 38]], '#D9A441', INK); };
  D.beehive = function (g, rw, rh, c) { sh(g, c, 8); g.box(rw / 2 - .25, rh / 2 - .2, .5, .4, 0, 4, '#8A5A33'); [[0, 4, 9], [1, 11, 8], [2, 17, 6]].forEach(function (a) { g.ell(c[0], c[1] - a[1], a[2], 4, a[0] % 2 ? '#F2B01B' : '#E8C45A', INK); }); g.ell(c[0], c[1] - 9, 2, 2.4, '#4A2E18', false); dot(g, c[0] + 12, c[1] - 24, 1.2, '#F2B01B'); };
  D.telescope = function (g, rw, rh, c) { sh(g, c, 9); g.line([c[0], c[1]], [c[0] - 6, c[1] - 12], '#6B7686', 2); g.line([c[0], c[1]], [c[0] + 6, c[1] - 12], '#6B7686', 2); g.line([c[0] - 8, c[1] - 14], [c[0] + 12, c[1] - 26], '#4F80BA', 5); g.line([c[0] + 10, c[1] - 25], [c[0] + 15, c[1] - 28], '#FFD84A', 6); };
  D.bust = function (g, rw, rh, c) { sh(g, c, 8); g.box(rw / 2 - .2, rh / 2 - .15, .4, .3, 0, 10, '#D9D3C4'); g.ell(c[0], c[1] - 20, 5, 6, '#EFE9DA', INK); g.poly([[c[0] - 7, c[1] - 12], [c[0] + 7, c[1] - 12], [c[0] + 5, c[1] - 16], [c[0] - 5, c[1] - 16]], '#EFE9DA', INK); };
  D.gardenlion = function (g, rw, rh, c) { sh(g, c, 10); g.box(rw / 2 - .26, rh / 2 - .2, .52, .4, 0, 6, '#D9D3C4'); g.ell(c[0] - 2, c[1] - 11, 8, 5, '#C9C0A8', INK); g.ell(c[0] + 6, c[1] - 17, 5, 5, '#C9C0A8', INK); g.ell(c[0] + 6, c[1] - 17, 7, 7, 'rgba(180,160,120,.55)', false); dot(g, c[0] + 8, c[1] - 18, .9, '#333'); };
  D.windmini = function (g, rw, rh, c) { sh(g, c, 8); g.poly([[c[0] - 6, c[1]], [c[0] + 6, c[1]], [c[0] + 3, c[1] - 22], [c[0] - 3, c[1] - 22]], '#F2EAD8', INK); g.poly([[c[0] - 6, c[1] - 22], [c[0], c[1] - 29], [c[0] + 6, c[1] - 22]], '#D95A42', INK); var h = [c[0], c[1] - 20], k; for (k = 0; k < 4; k++) { var a = k * Math.PI / 2 + .6; g.line(h, [h[0] + Math.cos(a) * 14, h[1] + Math.sin(a) * 14], '#F2EAD8', 2.6); } dot(g, h[0], h[1], 2, '#6B4A2E'); };
  D.hotballoon = function (g, rw, rh, c) { sh(g, c, 8); g.line([c[0] - 6, c[1] - 18], [c[0] - 3, c[1] - 6], '#6B4A2E', 1); g.line([c[0] + 6, c[1] - 18], [c[0] + 3, c[1] - 6], '#6B4A2E', 1); g.box(rw / 2 - .1, rh / 2 - .08, .2, .16, 0, 6, '#B58555'); g.ell(c[0], c[1] - 30, 13, 15, '#E9573F', INK); g.ell(c[0], c[1] - 30, 5, 15, '#FFD84A', false); g.ell(c[0] - 4, c[1] - 36, 4, 5, 'rgba(255,255,255,.28)', false); };
  D.kitep = function (g, rw, rh, c) { sh(g, c, 5); g.line([c[0], c[1]], [c[0], c[1] - 10], '#8A5A33', 1.4); g.poly([[c[0], c[1] - 46], [c[0] + 10, c[1] - 36], [c[0], c[1] - 24], [c[0] - 10, c[1] - 36]], '#FF7AA8', INK); g.line([c[0], c[1] - 46], [c[0], c[1] - 24], '#fff', 1); g.line([c[0] - 10, c[1] - 36], [c[0] + 10, c[1] - 36], '#fff', 1); g.c.strokeStyle = '#4F80BA'; g.c.lineWidth = 1.2; g.c.beginPath(); g.c.moveTo(c[0], c[1] - 24); g.c.quadraticCurveTo(c[0] - 8, c[1] - 14, c[0], c[1] - 10); g.c.stroke(); };
  D.statuehero = function (g, rw, rh, c) { sh(g, c, 10); g.box(rw / 2 - .26, rh / 2 - .2, .52, .4, 0, 9, '#B9B3A6'); g.poly([[c[0] - 4, c[1] - 9], [c[0] + 4, c[1] - 9], [c[0] + 3, c[1] - 24], [c[0] - 3, c[1] - 24]], '#D9A441', INK); g.ell(c[0], c[1] - 27, 3.4, 3.8, '#E9C060', INK); g.line([c[0] + 3, c[1] - 22], [c[0] + 10, c[1] - 34], '#D9A441', 2); g.poly([[c[0] + 10, c[1] - 34], [c[0] + 17, c[1] - 31], [c[0] + 10, c[1] - 28]], '#E9573F', INK); };
  D.treepot = function (g, rw, rh, c) { sh(g, c, 8); g.poly([[c[0] - 6, c[1] - 8], [c[0] + 6, c[1] - 8], [c[0] + 4, c[1]], [c[0] - 4, c[1]]], '#B9724A', INK); g.ell(c[0], c[1] - 16, 8, 9, '#3FA55B', INK); g.ell(c[0] - 2, c[1] - 19, 3, 2.6, 'rgba(255,255,255,.22)', false); [[-4, -14], [4, -18]].forEach(function (q) { dot(g, c[0] + q[0], c[1] + q[1], 1.5, '#E9573F'); }); };
  D.flowertower = function (g, rw, rh, c) { sh(g, c, 8); [[0, 0, 11], [1, 8, 9], [2, 15, 7]].forEach(function (a) { g.ell(c[0], c[1] - a[1], a[2], 4.4, '#9C6B3E', INK); g.ell(c[0], c[1] - a[1] - 2, a[2] - 1.5, 3.4, '#5B4030', false); }); var k; for (k = 0; k < 10; k++) dot(g, c[0] + Math.cos(k * 2.1) * (8 - (k % 3) * 2.4), c[1] - 4 - (k % 3) * 7 - 3, 2.2, ['#FF7AA8', '#FFD84A', '#E9573F', '#fff', '#B77CFF'][k % 5]); };
  D.rainbowarch = function (g, rw, rh, c) { sh(g, c, 12); var cols = ['#E9573F', '#F28B2B', '#FFD84A', '#6BCB6F', '#4F9CFF', '#B77CFF'], k; for (k = 0; k < 6; k++) { g.c.strokeStyle = cols[k]; g.c.lineWidth = 2.4; g.c.beginPath(); g.c.arc(c[0], c[1] - 4, 22 - k * 2.4, Math.PI, 0); g.c.stroke(); } g.ext(c[0], c[1] - 28, 24); };
  D.crystalp = function (g, rw, rh, c) { sh(g, c, 9); [[-6, 0, 10, '#8FD3F5'], [5, 1, 14, '#B77CFF'], [0, -1, 20, '#6FE0D0']].forEach(function (q) { g.poly([[c[0] + q[0] - 4, c[1] + q[1]], [c[0] + q[0], c[1] + q[1] - q[2] - 6], [c[0] + q[0] + 4, c[1] + q[1]]], q[3], INK); g.poly([[c[0] + q[0], c[1] + q[1]], [c[0] + q[0], c[1] + q[1] - q[2] - 6], [c[0] + q[0] + 4, c[1] + q[1]]], shade(q[3], .8), false); }); g.glow.push({ c: [c[0], c[1] - 12], r: 16 }); };
  X.deco = function (g, rw, rh, lv, p) { var c = ctr(g, rw, rh); if (p.under) lot(g, rw, rh, p.under); (D[p.t] || D.well)(g, rw, rh, c); };

  var reg = function (key, style, p) {
    var f = X[style]; if (!f) return; p = p || {}; var seed = hashS(key); p.id = key;
    def(key, function (g, rw, rh, lv) { f(g, rw, rh, lv || 1, p, rng(seed)); });
  };
  A.kit6 = { reg: reg, styles: X, deco: D, dome: dome, cone: cone, big: big, rng: rng, hashS: hashS, pool: pool, sh: sh };
  var R = reg;
  R('gardencottage', 'cottage', {"wall": "#F6E2B8", "roof": "#D95A42", "tree": "cherry"});
  R('pinkcottage', 'cottage', {"wall": "#F8D7E3", "roof": "#B8485E", "fl": ["#fff", "#FF7AA8"]});
  R('mintcottage', 'cottage', {"wall": "#D2F0E0", "roof": "#3E9C94", "tree": "oak"});
  R('seasidecottage', 'cottage', {"wall": "#DCEEFA", "roof": "#4F80BA", "lot": "#F3E0AE"});
  R('bluetown', 'townhouse', {"wall": "#C3DCF3", "roof": "#4F80BA"});
  R('rosetown', 'townhouse', {"wall": "#F6CBD6", "roof": "#B8485E", "acc": "#E27DA2"});
  R('creamtown', 'townhouse', {"wall": "#F5E6C8", "roof": "#8A5A33", "acc": "#B58555"});
  R('medivilla', 'med', {});
  R('sunvilla', 'med', {"wall": "#FFF3D0", "roof": "#E58A3C", "door": "#2E8A8A"});
  R('seaviewvilla', 'med', {"roof": "#4F80BA", "door": "#E9573F", "lot": "#F3E0AE"});
  R('redbarnhouse', 'farm', {});
  R('goldfarmhouse', 'farm', {"wall": "#E8C45A", "roof": "#8A5A33"});
  R('pagodahome', 'pagoda', {});
  R('jadepagoda', 'pagoda', {"wall": "#DCEEDD", "roof": "#2E8A6A"});
  R('modernbox', 'modern', {});
  R('ecomodern', 'modern', {"wall": "#E8F2E4", "wall2": "#9AB88A", "roof": "#5BAE55", "glass": "#A8E4C8"});
  R('luxmodern', 'modern', {"wall": "#F6F6F6", "wall2": "#3A4252", "roof": "#2E3442", "glass": "#4FA4DA"});
  R('alpinelodge', 'alpine', {});
  R('mountainlodge', 'alpine', {"wall": "#D9B885", "roof": "#6B4A2E", "lot": "#9ED67A"});
  R('tudorhouse', 'tudor', {});
  R('tudormanor', 'tudor', {"wall": "#EFE2C8", "roof": "#4A3A2E"});
  R('littlecastle', 'castle', {});
  R('royalcastle', 'castle', {"wall": "#F2E6C8", "roof": "#B8485E"});
  R('icecastle', 'castle', {"wall": "#E8F4FA", "roof": "#6FC8F2", "flag": "#4F80BA", "lot": "#F2F7FC"});
  R('windmillhome', 'mill', {});
  R('redwindmill', 'mill', {"wall": "#F6E2B8", "roof": "#B8452E"});
  R('lighthousehome', 'lighthouse', {});
  R('goldlighthouse', 'lighthouse', {"stripe": "#E2B33C", "roof": "#8A5A33"});
  R('igloohome', 'domehome', {});
  R('geodome', 'domehome', {"wall": "#E4F4EC", "door": "#2E8A4F", "lot": "#C8E8B0"});
  R('terracehome', 'terrace', {});
  R('terracegreen', 'terrace', {"wall": "#DCEEDD", "door": "#2E8A4F"});
  R('ranchhouse', 'ranch', {});
  R('whiteranch', 'ranch', {"wall": "#F6F6F6", "roof": "#4A4F5C"});
  R('yurthome', 'yurt', {});
  R('grandyurt', 'yurt', {"wall": "#FFFFFF", "roof": "#2E8A8A", "lot": "#B8E08A"});
  R('boathomehouse', 'boathouse', {});
  R('harbourhouse', 'boathouse', {"wall": "#F6EAD2", "roof": "#C9503C", "boat": "#4F80BA"});
  R('glasshome', 'glasshome', {});
  R('crystalglass', 'glasshome', {"glass": "#D8C8F5", "roof": "#EEE4FF"});
  R('colonialhome', 'colonial', {});
  R('colonialgrand', 'colonial', {"wall": "#FBF3E0", "roof": "#7A3A2E", "door": "#7A4B2A"});
  R('turrethome', 'turret', {});
  R('purpleturret', 'turret', {"wall": "#DCCFF2", "roof": "#6B4AA8"});
  R('cubehome', 'cube', {});
  R('woodcube', 'cube', {"wall": "#F2E8D5", "wall2": "#8A5A33"});
  R('logcabinxl', 'cabin', {});
  R('pinecabin', 'cabin', {"wall": "#C99A5E", "roof": "#2E6B45"});
  R('adobehome', 'adobe', {});
  R('oasisadobe', 'adobe', {"wall": "#EBC9A0", "door": "#B8452E"});
  R('hobbithill', 'hobbit', {});
  R('goldhill', 'hobbit', {"hill": "#6BBF4E", "door": "#E2B33C"});
  R('riad', 'riad', {});
  R('grandriad', 'riad', {"wall": "#FBE9C8", "dome": "#B8452E", "door": "#B8452E"});
  R('cliffhome', 'cliff', {});
  R('cliffgrand', 'cliff', {"wall": "#F2EAD8", "roof": "#2E6B8A"});
  R('courtyardcondo', 'condo2', {});
  R('skycondo', 'condo2', {"wall": "#DCE8F4", "band": "#4F80BA", "roof": "#7FB8E0"});
  R('gardencondo', 'condo2', {"wall": "#E8F2E4", "band": "#2E8A4F", "roof": "#5BAE55"});
  R('skycastle', 'castle', {"wall": "#E4D8F5", "roof": "#8A56E0", "flag": "#FFD84A"});
  R('sunmanor', 'med', {"wall": "#FFF3D0", "roof": "#E2B33C", "door": "#B8452E"});
  R('diamondglass', 'glasshome', {"glass": "#BFE6F5", "roof": "#F2FBFF"});
  R('legendcastle', 'castle', {"wall": "#F3E6C4", "roof": "#E2B33C", "flag": "#E9573F"});
  R('eternalpagoda', 'pagoda', {"wall": "#F3E6C4", "roof": "#E2B33C", "door": "#B8452E"});
  R('duckpond', 'park_pond', {});
  R('lilypond', 'park_pond', {"water": "#5BC4C0", "tree": ["cherry", "oak"]});
  R('fountainsquare', 'park_fountain', {});
  R('royalfountain', 'park_fountain', {"g": "#F2EAD8"});
  R('gazebogarden', 'park_gazebo', {});
  R('rosegazebo', 'park_gazebo', {"roof": "#E8355A"});
  R('koipool', 'park_koi', {});
  R('koigarden', 'park_koi', {"g": "#8ED067"});
  R('zenyard', 'park_zen', {});
  R('grandzen', 'park_zen', {});
  R('tulipfield', 'park_field', {"cols": ["#E9573F", "#FFD84A", "#FF7AA8", "#B77CFF"], "g": "#8ED067"});
  R('lavenderfield', 'park_field', {"cols": ["#9A7CE0", "#7A5CC9", "#B48CFF"], "g": "#B8D888"});
  R('sunflowerfield', 'park_sun', {});
  R('poppyfield', 'park_field', {"cols": ["#E9322B", "#FF6B6B", "#fff"], "barn": true});
  R('hedgemaze', 'park_maze', {});
  R('grandmaze', 'park_maze', {});
  R('appleorchard', 'park_orchard', {});
  R('cherryorchard', 'park_orchard', {"tree": "cherry", "fruit": "#FF7AA8"});
  R('picnicmeadow', 'park_picnic', {});
  R('festivalmeadow', 'park_picnic', {"g": "#9ED67A", "tree": ["cherry", "autumn"]});
  R('waterfallpark', 'park_falls', {});
  R('bamboogrove', 'park_grove', {});
  R('ricefields', 'park_terrace', {});
  R('teaterraces', 'park_terrace', {"c1": "#5BAE55", "c2": "#3E9E4B", "wall": "#8A7A55"});
  R('icerinkpark', 'park_rink', {});
  R('skateplaza', 'park_skate', {});
  R('botanicdome', 'park_dome', {});
  R('lakesidepark', 'park_lake', {});
  R('rosegarden', 'park_rose', {});
  R('cactusgarden', 'park_desert', {});
  R('palmlagoon', 'park_lagoon', {});
  R('fairyglade', 'park_glade', {});
  R('snowmanpark', 'park_snow', {});
  R('sculpturegarden', 'park_sculpt', {});
  R('pumpkinfarm', 'park_pumpkin', {});
  R('openairtheatre', 'park_amphi', {});
  R('kidsgarden', 'park_kids', {});
  R('crystallake', 'park_lake', {"water": "#35C2D9", "g": "#8ED067"});
  R('royalgardens', 'park_fountain', {"g": "#F6EAD2"});
  R('paradisegarden', 'park_glade', {"g": "#5BD1A0"});
  R('wishingwell', 'deco', {"t": "well"});
  R('redmailbox', 'deco', {"t": "mailbox"});
  R('woodsign', 'deco', {"t": "signpost"});
  R('treepotp', 'deco', {"t": "treepot"});
  R('haystack', 'deco', {"t": "haystack"});
  R('birdbath', 'deco', {"t": "birdbath"});
  R('gardensundial', 'deco', {"t": "sundial"});
  R('pumpkins', 'deco', {"t": "pumpkinp"});
  R('beachumbrella', 'deco', {"t": "umbrella"});
  R('barrels', 'deco', {"t": "barrels"});
  R('blossomarch', 'deco', {"t": "arch"});
  R('bigmushroom', 'deco', {"t": "bigmush"});
  R('campingtent', 'deco', {"t": "tent"});
  R('swing', 'deco', {"t": "swing"});
  R('campfire', 'deco', {"t": "campfire"});
  R('snowman', 'deco', {"t": "snowman"});
  R('fruitcart', 'deco', {"t": "cartp"});
  R('beehive', 'deco', {"t": "beehive"});
  R('hammock', 'deco', {"t": "hammock"});
  R('totem', 'deco', {"t": "totem"});
  R('kite', 'deco', {"t": "kitep"});
  R('flowerpergola', 'deco', {"t": "pergola"});
  R('rowboat', 'deco', {"t": "rowboat"});
  R('anchor', 'deco', {"t": "anchor"});
  R('igloo', 'deco', {"t": "igloo"});
  R('flowertower', 'deco', {"t": "flowertower"});
  R('gardenlantern', 'deco', {"t": "lanternp"});
  R('toywindmill', 'deco', {"t": "windmini"});
  R('toriigate', 'deco', {"t": "toriip"});
  R('stoneobelisk', 'deco', {"t": "obelisk"});
  R('bust', 'deco', {"t": "bust"});
  R('telescope', 'deco', {"t": "telescope"});
  R('gardenlion', 'deco', {"t": "gardenlion"});
  R('rainbowarch', 'deco', {"t": "rainbowarch"});
  R('hotballoon', 'deco', {"t": "hotballoon"});
  R('crystalcluster', 'deco', {"t": "crystalp"});
  R('herostatue', 'deco', {"t": "statuehero"});
})(typeof window !== 'undefined' ? window : this);
