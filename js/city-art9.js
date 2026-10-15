/* EWT City — ĐỒ HOẠ phần 9: 8 KHU PHỐ VĂN HOÁ (Hoa · Nhật · Việt · Thái · Indonesia · Anh · Mỹ · Úc). Mỗi khu có bộ kiến trúc & đồ trang trí riêng, và các
   công trình có sẵn trên khu đất (cổng, biểu tượng, đồ trang trí) vẽ bằng A.FX[...]. Danh sách ở cuối file: R('mã','kiểu',{tham số}) · F('mã cố định','kiểu',{tham số}). */
(function (root) {
  'use strict';
  var A = root.EWTCityArt; if (!A || !A.kit || !A.kit6 || !A.kit7 || !A.kit8) return;
  var K = A.kit, house = K.house, lot = K.lot, def = K.def, INK = K.INK, shade = A.shade, K6 = A.kit6, K7 = A.kit7, K8 = A.kit8, cone = K6.cone, dome = K6.dome, big = K6.big, sh = K6.sh, fence = K6.fence, trees = K6.trees, flowersAt = K6.flowersAt, D = K6.deco, TAU = Math.PI * 2, HW = 32, HH = 16;
  var Q = {};
  var dot = function (g, x, y, r, c) { g.ell(x, y, r, r, c); };
  var ctr = function (g, rw, rh, z) { return g.P(rw / 2, rh / 2, z || 0); };
  var beacon = function (g, cx, cy, z) { var q = g.P(cx, cy, z); g.ell(q[0], q[1], 2.2, 2.2, '#FF5A5A'); g.meta.beacon = q; };
  var lamp = function (g, x, y, z, col) { var q = g.P(x, y, z); g.ell(q[0], q[1], 3.2, 4, col || '#E9573F', INK); g.glow.push({ c: [q[0], q[1]], r: 11 }); };
  var eaveTips = function (g, x, y, w, h, z, col) {   // đầu mái cong vút lên
    [[x, y], [x + w, y], [x + w, y + h], [x, y + h]].forEach(function (c) { var a = g.P(c[0], c[1], z), s = c[0] > x + w / 2 ? 1 : -1; g.c.strokeStyle = col; g.c.lineWidth = 2.4; g.c.lineCap = 'round'; g.c.beginPath(); g.c.moveTo(a[0], a[1]); g.c.quadraticCurveTo(a[0] + s * 4, a[1] + 1, a[0] + s * 6, a[1] - 5); g.c.stroke(); g.ext(a[0] + s * 6, a[1] - 5, 3); });
  };

  /* ═════ nhà phố châu Á: nhiều tầng, mái ngói cong, đèn lồng ═════ */
  Q.asia = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#C9C4B8'); var n = p.fl || 1, fh = 12 + lv, z = 0, i, x0 = .15, y0 = .15, w = rw - .3, h = rh - .3;
    for (i = 0; i < n; i++) {
      var inset = i * .1; g.box(x0 + inset, y0 + inset, w - 2 * inset, h - 2 * inset, z, z + fh, p.wall || '#C9503C');
      g.winsL(x0 + inset, y0 + inset, w - 2 * inset, h - 2 * inset, z + 3, z + fh - 2, Math.max(2, Math.round(w * 1.2)), 1, { m: .18, col: p.win || '#F2D27A' }); g.winsR(x0 + inset, y0 + inset, w - 2 * inset, h - 2 * inset, z + 3, z + fh - 2, 1, 1, { m: .22, col: p.win || '#F2D27A' });
      z += fh; var ez = i === n - 1 ? 12 + lv * 2 : 4; g.hip(x0 + inset - .08, y0 + inset - .08, w - 2 * inset + .16, h - 2 * inset + .16, z, z + ez, p.roof || '#2E8A6A', i === n - 1 ? .18 : .05); if (i < n - 1) z += 4;
    }
    var top = z + 12 + lv * 2 - 12 + (n === 1 ? 0 : 0); eaveTips(g, x0 - .06, y0 - .06, w + .12, h + .12, z - (n === 1 ? 0 : 0) + 0, p.roof || '#2E8A6A');
    g.doorL(x0, y0, w, h, .5, 0, .2, 10, p.door || '#7A2E1E'); var k; for (k = 0; k < 2; k++) lamp(g, x0 + w * (.18 + k * .64), y0 + h + .05, 12, p.lan || '#E9573F');
    if (p.sign) { var s = g.P(x0 + w * .5, y0 + h + .02, fh - 3); g.poly([[s[0] - 9, s[1] - 4], [s[0] + 9, s[1] - 4], [s[0] + 9, s[1] + 3], [s[0] - 9, s[1] + 3]], p.sign, INK); }
    g.tree(rw - .2, rh - .15, .5, p.tree || 'pine');
  };
  Q.tiers = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#B9B3A6'); var n = p.n || 5, i, z = 0, bw = rw - .3, bh = rh - .3, step = .12 + (p.step || 0), fh = 10 + lv * 2 + big(rw, rh) * .6;
    g.box(.1, .1, rw - .2, rh - .2, 0, 6, p.base || '#9AA3AE'); z = 6;
    for (i = 0; i < n; i++) {
      var inset = .15 + i * (Math.min(rw, rh) * .3 / n + step * .4), w = rw - 2 * inset, h = rh - 2 * inset; if (w < .5 || h < .5) break;
      g.box(inset + .06, inset + .06, w - .12, h - .12, z, z + fh, p.wall || '#C9503C'); g.winsL(inset + .06, inset + .06, w - .12, h - .12, z + 3, z + fh - 2, 2, 1, { m: .22, col: '#F2D27A' });
      g.hip(inset - .1, inset - .1, w + .2, h + .2, z + fh, z + fh + 8, p.roof || '#2E8A6A', .12); eaveTips(g, inset - .1, inset - .1, w + .2, h + .2, z + fh, p.roof || '#2E8A6A'); z += fh + 6;
    }
    var t = g.P(rw / 2, rh / 2, z); g.line(t, [t[0], t[1] - 14], p.fin || '#D9A441', 2); dot(g, t[0], t[1] - 15, 2, p.fin || '#D9A441'); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .2, 8, '#7A2E1E');
  };
  Q.gate = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#D9D3C4'); var t = p.t || 'pailou', cx = rw / 2, cy = rh / 2, z = 28 + lv * 4, col = p.c1 || '#D9503C', W = rw * .42;
    var post = function (x) { g.cyl(x, cy, .1, 0, z, col); g.box(x - .16, cy - .16, .32, .32, 0, 4, '#B9B3A6'); };
    if (t === 'bentar') {
      [[-1], [1]].forEach(function (s) { var x0 = cx + s[0] * .8 - .55, i; for (i = 0; i < 5; i++) { var w = 1.1 - i * .17, xx = cx + s[0] * .8 - w / 2; g.box(xx, cy - .3, w, .6, i * 8, i * 8 + 9, p.stone || '#9AA3AE'); } });
      return;
    }
    post(cx - W); post(cx + W);
    if (t === 'pailou') { post(cx - W * .45); post(cx + W * .45); }
    var a = g.P(cx - W, cy, z), b = g.P(cx + W, cy, z); g.line([a[0], a[1] - 2], [b[0], b[1] - 2], col, 4.5); g.line([a[0], a[1] + 5], [b[0], b[1] + 5], p.c2 || '#2E2E3A', 3);
    if (t === 'torii') { var a2 = g.P(cx - W * 1.15, cy, z + 5), b2 = g.P(cx + W * 1.15, cy, z + 5); g.line([a2[0], a2[1]], [b2[0], b2[1]], '#2A2A36', 5); g.line([a[0], a[1] + 12], [b[0], b[1] + 12], col, 2.6); }
    else { var m = g.P(cx, cy, z + 2); g.poly([[a[0] - 6, a[1] - 3], [m[0], m[1] - 14 - lv * 2], [b[0] + 6, b[1] - 3]], p.roof || '#2E8A6A', INK); g.poly([[a[0] - 1, a[1] + 4], [b[0] + 1, b[1] + 4], [b[0], b[1] + 12], [a[0], a[1] + 12]], p.c2 || '#F2D27A', INK); }
  };
  Q.temple = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#D9D3C4'); fence(g, .12, .12, rw - .24, rh - .24, p.wall || '#C9503C'); var zb = 14 + lv * 2 + big(rw, rh) * .7, x = rw * .2, y = rh * .2, w = rw * .6, h = rh * .5;
    g.box(x, y, w, h, 0, zb, p.wall || '#C9503C'); g.winsL(x, y, w, h, 3, zb - 2, 3, 1, { m: .2, col: '#F2D27A' }); g.hip(x - .1, y - .1, w + .2, h + .2, zb, zb + 14, p.roof || '#2E8A6A', .15); eaveTips(g, x - .1, y - .1, w + .2, h + .2, zb, p.roof || '#2E8A6A');
    g.doorL(x, y, w, h, .5, 0, .24, 11, '#7A2E1E'); g.cyl(rw / 2, rh * .84, .14, 0, 8, '#7A7A86'); g.ell(g.P(rw / 2, rh * .84, 8)[0], g.P(rw / 2, rh * .84, 8)[1] - 2, 5, 3, '#E9573F'); trees(g, [[.3, rh - .3], [rw - .3, rh - .3]], .6, p.tree || 'pine');
  };
  Q.stilt = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#8ED067'); var z = 14 + lv, x = .2, y = .25, w = rw - .4, h = rh - .5, i;
    for (i = 0; i < 6; i++) { var q = g.P(x + (i % 3) * w / 2, y + Math.floor(i / 3) * h, 0); g.line(q, [q[0], q[1] - z], '#8A5A33', 2.6); }
    g.box(x - .05, y - .05, w + .1, h + .1, z, z + 3, p.floor || '#C9A06A'); g.box(x + .08, y + .08, w - .16, h - .16, z + 3, z + 3 + 14, p.wall || '#D9B885'); g.winsL(x + .08, y + .08, w - .16, h - .16, z + 6, z + 14, 2, 1, { m: .25 });
    g.gable(x - .12, y - .08, w + .24, h + .16, z + 17, z + 33 + lv * 2, false, p.roof || '#C9503C', { wall: p.wall || '#D9B885' });
    var a = g.P(x - .12, y + h / 2, z + 17), b = g.P(x + w + .12, y + h / 2, z + 17); g.c.strokeStyle = p.roof || '#C9503C'; g.c.lineWidth = 2.4; g.c.beginPath(); g.c.moveTo(a[0], a[1]); g.c.lineTo(a[0] - 4, a[1] - 8); g.c.moveTo(b[0], b[1]); g.c.lineTo(b[0] + 4, b[1] - 8); g.c.stroke();
    for (i = 0; i < 4; i++) g.line(g.P(rw / 2 - .2, y + h + .05 + i * .06, z - i * 3.4), g.P(rw / 2 + .2, y + h + .05 + i * .06, z - i * 3.4), '#8A5A33', 1.3);
  };
  Q.stupa = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#D9D3C4'); var cx = rw / 2, cy = rh / 2, R = Math.min(rw, rh) * .42, i;
    if (p.k === 'candi') {   // chùa bậc thang kiểu Borobudur
      for (i = 0; i < 4; i++) { var r = R * (1 - i * .2); g.box(cx - r, cy - r, r * 2, r * 2, i * 9, i * 9 + 9, i % 2 ? p.c1 || '#9AA3AE' : p.c2 || '#B9B3A6'); }
      for (i = 0; i < 4; i++) { var a = i * TAU / 4 + .78, q = g.P(cx + Math.cos(a) * R * .5, cy + Math.sin(a) * R * .5, 36); g.ell(q[0], q[1] - 4, 4.4, 5.4, p.c1 || '#9AA3AE', INK); }
      dome(g, cx, cy, R * .2, 36, 10, p.c1 || '#9AA3AE'); var t = g.P(cx, cy, 46); g.line(t, [t[0], t[1] - 8], '#9AA3AE', 1.6);
    } else {   // chedi vàng
      g.cyl(cx, cy, R * .9, 0, 6, '#E8D7B5'); g.cyl(cx, cy, R * .62, 6, 14, p.c1 || '#F2D27A'); g.cyl(cx, cy, R * .42, 14, 30 + lv * 4, p.c1 || '#F2D27A'); cone(g, cx, cy, R * .4, 30 + lv * 4, 60 + lv * 8 + big(rw, rh), p.c2 || '#E2B33C');
      var t2 = g.P(cx, cy, 62 + lv * 8 + big(rw, rh)); dot(g, t2[0], t2[1] - 2, 2, '#FF5A5A'); g.glow.push({ c: [t2[0], t2[1]], r: 16 });
    }
  };
  Q.row = function (g, rw, rh, lv, p) {   // dãy nhà phố phương Tây
    lot(g, rw, rh, p.lot || '#B9B3A6'); var n = Math.max(2, Math.round(rw)), cols = p.cols || ['#B9724A', '#C98A55', '#A85D3E', '#D9A06A'], roofs = p.roofs || ['#4A4F5C', '#3A3F4C'], zb = (p.h || 26) + lv * 3 + big(rw, rh) * .6, i;
    for (i = 0; i < n; i++) {
      var x0 = .08 + i * (rw - .16) / n, w = (rw - .16) / n - .02, hh = zb + (i % 2) * 5; g.box(x0, .12, w, rh - .24, 0, hh, cols[i % cols.length]); g.winsL(x0, .12, w, rh - .24, 8, hh - 2, 1, Math.max(2, Math.round(hh / 14)), { m: .24 });
      if (p.flat) { g.flat(x0, .12, w, rh - .24, hh, '#9AA3AE', shade(cols[i % cols.length], 1.15)); g.box(x0 + .02, .1, w - .04, .06, hh - 3, hh + 2, shade(cols[i % cols.length], 1.2)); } else g.gable(x0, .12, w, rh - .24, hh, hh + 11, false, roofs[i % roofs.length], { wall: cols[i % cols.length] });
      g.doorL(x0, .12, w, rh - .24, .5, 0, .36, 9, p.door || '#2E3A5A'); chimAt(g, x0 + w * .3, .2, hh + 6);
      if (p.stoop) for (var s = 0; s < 3; s++) g.box(x0 + w * .3, rh - .14 + s * .05, w * .4, .08, 0, 2 + (2 - s) * 2, '#C9C0A8');
    }
  };
  var chimAt = function (g, x, y, z) { g.box(x, y, .13, .13, z - 3, z + 8, '#9A5B45'); };
  Q.deco = function (g, rw, rh, lv, p) {   // chọn đồ trang trí từ K6.deco
    var c = ctr(g, rw, rh); if (p.under) lot(g, rw, rh, p.under); (D[p.t] || D.well)(g, rw, rh, c);
  };
  Q.skyscraper = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#B9B3A6'); var n = 4, i, z = 6, hh = (60 + lv * 14 + big(rw, rh) * 4) / n, wc = p.wall || '#E8E4D8'; g.box(.1, .1, rw - .2, rh - .2, 0, 6, '#9AA3AE');
    for (i = 0; i < n; i++) { var inset = .25 + i * Math.min(rw, rh) * .12; g.box(inset, inset, rw - 2 * inset, rh - 2 * inset, z, z + hh, wc); g.glassL(inset, inset, rw - 2 * inset, rh - 2 * inset, z + 2, z + hh - 2, 3, p.glass || '#8FD0F0'); g.glassR(inset, inset, rw - 2 * inset, rh - 2 * inset, z + 2, z + hh - 2, 3, p.glass || '#8FD0F0'); g.flat(inset, inset, rw - 2 * inset, rh - 2 * inset, z + hh, shade(wc, .96), '#fff'); z += hh; }
    var t = g.P(rw / 2, rh / 2, z); g.line(t, [t[0], t[1] - 26], '#9AA4B2', 2); beacon(g, rw / 2, rh / 2, z + 28); if (p.neon) g.glow.push({ c: [t[0], t[1] - 8], r: 22 });
  };
  Q.diner = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, '#6B7686'); var zb = 12 + lv * 2; g.box(.15, .2, rw - .3, rh - .4, 0, zb, p.wall || '#E8EDF2'); g.glassL(.15, .2, rw - .3, rh - .4, 3, zb - 2, 1, '#BFE6F5'); g.quadL(.15, .2, rw - .3, rh - .4, 0, 1, zb * .45, zb * .6, p.c1 || '#E9573F', false);
    g.flat(.15, .2, rw - .3, rh - .4, zb, p.c1 || '#E9573F', '#fff'); g.doorL(.15, .2, rw - .3, rh - .4, .5, 0, .16, 9, '#3E5C86');
    var s = g.P(rw - .35, rh - .3, 0); g.line(s, [s[0], s[1] - 30], '#8A8F99', 2); g.poly([[s[0] - 12, s[1] - 38], [s[0] + 12, s[1] - 38], [s[0] + 12, s[1] - 26], [s[0] - 12, s[1] - 26]], p.sign || '#4F9CFF', INK); g.glow.push({ c: [s[0], s[1] - 32], r: 18 });
  };
  Q.liberty = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#6FC8F2'); var cx = rw / 2, cy = rh / 2; g.box(.3, .3, rw - .6, rh - .6, 0, 8, '#9AA3AE'); g.box(cx - .5, cy - .5, 1, 1, 8, 26 + lv * 4, '#C9C0A8'); g.box(cx - .65, cy - .65, 1.3, 1.3, 26 + lv * 4, 30 + lv * 4, '#B9B3A6');
    var b = g.P(cx, cy, 30 + lv * 4), gc = p.c1 || '#7FD0B0'; g.poly([[b[0] - 7, b[1]], [b[0] + 7, b[1]], [b[0] + 5, b[1] - 26], [b[0] - 5, b[1] - 26]], gc, INK); g.ell(b[0], b[1] - 30, 5, 5.4, gc, INK);
    [[-7, -2], [-4, -5], [0, -7], [4, -5], [7, -2]].forEach(function (q) { g.line([b[0], b[1] - 33], [b[0] + q[0] * 1.4, b[1] - 33 + q[1] * 1.4 - 3], gc, 1.6); });
    g.line([b[0] + 4, b[1] - 24], [b[0] + 12, b[1] - 42], gc, 3); g.ell(b[0] + 12, b[1] - 46, 2.6, 3.6, '#FFD84A', INK); g.glow.push({ c: [b[0] + 12, b[1] - 46], r: 16 });
  };
  Q.towerbridge = function (g, rw, rh, lv, p) {
    g.keep = true; g.poly(g.faceT(0, 0, rw, rh, 0), '#5FB7E8', false); g.keep = false; var z = 36 + lv * 4, t = rw * .2, c1 = p.c1 || '#B9A88A';
    g.box(0, rh * .3, rw, rh * .4, 6, 10, '#9AA3AE'); [t, rw - t].forEach(function (x) { g.box(x - .35, rh * .28, .7, rh * .44, 0, z, c1); g.glassL(x - .35, rh * .28, .7, rh * .44, 10, z - 4, 2, '#BFE6F5'); g.hip(x - .4, rh * .24, .8, rh * .52, z, z + 14, p.roof || '#4F80BA', .1); g.cyl(x - .28, rh * .28, .06, z, z + 22, p.roof || '#4F80BA'); g.cyl(x + .28, rh * .28, .06, z, z + 22, p.roof || '#4F80BA'); });
    var a = g.P(t, rh * .5, z - 4), b = g.P(rw - t, rh * .5, z - 4); g.line(a, b, '#4F80BA', 3.4); g.line(g.P(t, rh * .5, z - 4), g.P(.1, rh * .5, 10), '#4F80BA', 2); g.line(g.P(rw - t, rh * .5, z - 4), g.P(rw - .1, rh * .5, 10), '#4F80BA', 2);
  };
  Q.uluru = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#E8C080'); var c = ctr(g, rw, rh), R = (rw + rh) / 2 * 20, H = 26 + lv * 8 + big(rw, rh) * 2; sh(g, c, R * .9);
    g.c.beginPath(); g.c.moveTo(c[0] - R, c[1]); g.c.bezierCurveTo(c[0] - R * .9, c[1] - H * 1.1, c[0] + R * .9, c[1] - H * 1.1, c[0] + R, c[1]); g.c.ellipse(c[0], c[1], R, R * .42, 0, 0, Math.PI, false); g.c.closePath();
    var gr = g.c.createLinearGradient(c[0] - R, 0, c[0] + R, 0); gr.addColorStop(0, '#B8502E'); gr.addColorStop(.5, '#E0703C'); gr.addColorStop(1, '#9A4226'); g.c.fillStyle = gr; g.c.fill(); g.c.strokeStyle = INK; g.c.stroke(); g.ext(c[0], c[1] - H, R);
    [[-.5, -.3], [0, -.55], [.45, -.35]].forEach(function (q) { g.c.strokeStyle = 'rgba(80,30,10,.4)'; g.c.lineWidth = 1.2; g.c.beginPath(); g.c.moveTo(c[0] + q[0] * R, c[1] + q[1] * H * .6 + 8); g.c.lineTo(c[0] + q[0] * R * 1.05, c[1] + q[1] * H * .6 - 10); g.c.stroke(); });
  };
  Q.outback = function (g, rw, rh, lv, p) {
    lot(g, rw, rh, p.lot || '#E8C080'); var zb = 14 + lv * 2;
    g.box(.2, .15, rw - .4, rh * .55, 0, zb, p.wall || '#F6EAD2'); g.winsL(.2, .15, rw - .4, rh * .55, 4, zb - 2, 3, 1, { m: .18 }); g.gable(.12, .1, rw - .24, rh * .65, zb, zb + 10, true, p.roof || '#C9503C', { wall: p.wall || '#F6EAD2' });
    var i; for (i = 0; i < 5; i++) g.cyl(.25 + i * (rw - .5) / 4, rh * .72, .05, 0, zb - 2, '#8A5A33'); g.box(.15, rh * .6, rw - .3, rh * .2, zb - 2, zb, p.roof || '#C9503C'); g.doorL(.2, .15, rw - .4, rh * .55, .5, 0, .16, 9, '#5A3A22');
    g.tree(rw - .2, .2, .55, 'palm');
  };
  Q.sail = function (g, rw, rh, lv, p) { K7.sails(g, rw, rh, lv, p || {}); };

  /* ── đồ trang trí đặc trưng ── */
  D.redlantern = function (g, rw, rh, c) { sh(g, c, 8); g.line([c[0], c[1]], [c[0], c[1] - 26], '#4A2E18', 2); g.line([c[0], c[1] - 26], [c[0] + 8, c[1] - 26], '#4A2E18', 2); g.ell(c[0] + 8, c[1] - 20, 5, 6.4, '#E9573F', INK); g.line([c[0] + 3, c[1] - 20], [c[0] + 13, c[1] - 20], '#F2D27A', 1); g.glow.push({ c: [c[0] + 8, c[1] - 20], r: 14 }); };
  D.dragon = function (g, rw, rh, c) { sh(g, c, 10); g.box(rw / 2 - .3, rh / 2 - .2, .6, .4, 0, 5, '#9AA3AE'); g.c.strokeStyle = '#2E8A6A'; g.c.lineWidth = 5; g.c.lineCap = 'round'; g.c.beginPath(); g.c.moveTo(c[0] - 10, c[1] - 6); g.c.bezierCurveTo(c[0] - 6, c[1] - 24, c[0] + 2, c[1] - 4, c[0] + 8, c[1] - 20); g.c.stroke(); g.ell(c[0] + 11, c[1] - 22, 4.4, 3.2, '#E9573F', INK); g.ext(c[0], c[1] - 18, 14); };
  D.sakura = function (g, rw, rh, c) { sh(g, c, 10); g.line([c[0], c[1]], [c[0] + 2, c[1] - 16], '#6B4A2E', 3); [[-8, -20, 8], [8, -22, 8], [0, -28, 9], [-3, -17, 7]].forEach(function (q, i) { g.ell(c[0] + q[0], c[1] + q[1], q[2], q[2] * .8, i % 2 ? '#FFC4D8' : '#F5A3C0', INK); }); };
  D.bonsaip = function (g, rw, rh, c) { sh(g, c, 8); g.poly([[c[0] - 8, c[1] - 4], [c[0] + 8, c[1] - 4], [c[0] + 6, c[1]], [c[0] - 6, c[1]]], '#8A5A33', INK); g.line([c[0], c[1] - 4], [c[0] + 3, c[1] - 12], '#6B4A2E', 2.4); g.ell(c[0] + 3, c[1] - 16, 8, 5, '#2E9E55', INK); g.ell(c[0] - 4, c[1] - 11, 5, 3, '#3FA55B', INK); };
  D.cyclo = function (g, rw, rh, c) { sh(g, c, 12); g.ell(c[0] - 8, c[1] - 3, 5, 5, false, '#4B4F5A'); g.ell(c[0] + 10, c[1] - 3, 5, 5, false, '#4B4F5A'); g.c.strokeStyle = '#4B4F5A'; g.c.lineWidth = 1.4; g.c.beginPath(); g.c.arc(c[0] - 8, c[1] - 3, 5, 0, TAU); g.c.arc(c[0] + 10, c[1] - 3, 5, 0, TAU); g.c.stroke(); g.poly([[c[0] - 14, c[1] - 12], [c[0] - 2, c[1] - 12], [c[0] - 3, c[1] - 4], [c[0] - 14, c[1] - 4]], '#E9573F', INK); g.line([c[0] + 2, c[1] - 4], [c[0] + 10, c[1] - 14], '#4B4F5A', 1.6); };
  D.nonla = function (g, rw, rh, c) { sh(g, c, 9); g.poly([[c[0] - 12, c[1] - 6], [c[0], c[1] - 18], [c[0] + 12, c[1] - 6]], '#F2D27A', INK); g.line([c[0] - 12, c[1] - 6], [c[0] + 12, c[1] - 6], '#B8452E', 1.6); g.line([c[0] - 4, c[1] - 10], [c[0] + 4, c[1] - 10], '#E9573F', 1.2); };
  D.tuktuk = function (g, rw, rh, c) { sh(g, c, 12); g.poly([[c[0] - 11, c[1] - 14], [c[0] + 9, c[1] - 14], [c[0] + 12, c[1] - 4], [c[0] - 11, c[1] - 4]], '#FF7AA8', INK); g.poly([[c[0] - 12, c[1] - 14], [c[0] + 10, c[1] - 14], [c[0] + 8, c[1] - 20], [c[0] - 10, c[1] - 20]], '#FFD84A', INK); dot(g, c[0] - 7, c[1] - 3, 3.4, '#2A2A36'); dot(g, c[0] + 8, c[1] - 3, 3.4, '#2A2A36'); };
  D.buddha = function (g, rw, rh, c) { sh(g, c, 10); g.box(rw / 2 - .3, rh / 2 - .25, .6, .5, 0, 6, '#E8D7B5'); g.ell(c[0], c[1] - 12, 8, 6, '#F2B01B', INK); g.ell(c[0], c[1] - 20, 5, 5.4, '#F2B01B', INK); g.poly([[c[0] - 1.6, c[1] - 26], [c[0] + 1.6, c[1] - 26], [c[0], c[1] - 31]], '#E2B33C', INK); g.glow.push({ c: [c[0], c[1] - 16], r: 16 }); };
  D.balioffer = function (g, rw, rh, c) { sh(g, c, 8); g.ell(c[0], c[1] - 3, 9, 4, '#9AA3AE', INK); g.ell(c[0], c[1] - 5, 7, 3, '#F2EAD8', false); [[-4, -6], [0, -9], [4, -6]].forEach(function (q, i) { dot(g, c[0] + q[0], c[1] + q[1], 2.4, ['#FF7AA8', '#FFD84A', '#E9573F'][i]); }); g.line([c[0] + 10, c[1]], [c[0] + 10, c[1] - 14], '#8A5A33', 1.4); g.poly([[c[0] + 10, c[1] - 14], [c[0] + 17, c[1] - 11], [c[0] + 10, c[1] - 8]], '#FFD84A', INK); };
  D.phonebox = function (g, rw, rh, c) { sh(g, c, 7); g.poly([[c[0] - 5, c[1]], [c[0] + 5, c[1]], [c[0] + 5, c[1] - 22], [c[0] - 5, c[1] - 22]], '#D9302B', INK); g.poly([[c[0] - 3, c[1] - 3], [c[0] + 3, c[1] - 3], [c[0] + 3, c[1] - 18], [c[0] - 3, c[1] - 18]], '#BFE6F5', false); g.ell(c[0], c[1] - 22, 5, 2, '#B8211D', INK); };
  D.doubledecker = function (g, rw, rh, c) { sh(g, c, 14); g.poly([[c[0] - 14, c[1] - 22], [c[0] + 14, c[1] - 22], [c[0] + 14, c[1] - 3], [c[0] - 14, c[1] - 3]], '#D9302B', INK); [0, 1].forEach(function (r) { var k; for (k = 0; k < 4; k++) g.poly([[c[0] - 12 + k * 7, c[1] - 19 + r * 9], [c[0] - 7 + k * 7, c[1] - 19 + r * 9], [c[0] - 7 + k * 7, c[1] - 14 + r * 9], [c[0] - 12 + k * 7, c[1] - 14 + r * 9]], '#BFE6F5', false); }); dot(g, c[0] - 8, c[1] - 3, 3, '#222'); dot(g, c[0] + 8, c[1] - 3, 3, '#222'); };
  D.taxi = function (g, rw, rh, c) { sh(g, c, 12); g.poly([[c[0] - 13, c[1] - 9], [c[0] + 13, c[1] - 9], [c[0] + 13, c[1] - 3], [c[0] - 13, c[1] - 3]], '#FFD84A', INK); g.poly([[c[0] - 7, c[1] - 9], [c[0] - 4, c[1] - 16], [c[0] + 6, c[1] - 16], [c[0] + 9, c[1] - 9]], '#FFD84A', INK); g.poly([[c[0] - 3, c[1] - 9], [c[0] - 2, c[1] - 14], [c[0] + 5, c[1] - 14], [c[0] + 6, c[1] - 9]], '#BFE6F5', false); dot(g, c[0] - 7, c[1] - 3, 3, '#222'); dot(g, c[0] + 8, c[1] - 3, 3, '#222'); g.poly([[c[0] - 3, c[1] - 16], [c[0] + 3, c[1] - 16], [c[0] + 3, c[1] - 19], [c[0] - 3, c[1] - 19]], '#fff', INK); };
  D.hotdog = function (g, rw, rh, c) { sh(g, c, 11); g.poly([[c[0] - 10, c[1] - 12], [c[0] + 10, c[1] - 12], [c[0] + 9, c[1] - 3], [c[0] - 9, c[1] - 3]], '#E8EDF2', INK); g.line([c[0] - 12, c[1] - 24], [c[0] - 12, c[1] - 12], '#8A5A33', 1.4); g.poly([[c[0] - 15, c[1] - 24], [c[0] + 12, c[1] - 24], [c[0] + 9, c[1] - 18], [c[0] - 12, c[1] - 18]], '#E9573F', INK); dot(g, c[0] - 6, c[1] - 1, 2.6, '#222'); dot(g, c[0] + 6, c[1] - 1, 2.6, '#222'); };
  D.kangaroo = function (g, rw, rh, c) { sh(g, c, 9); g.ell(c[0] - 2, c[1] - 9, 6, 8, '#C98A55', INK); g.ell(c[0] + 3, c[1] - 20, 3.4, 3.6, '#C98A55', INK); g.poly([[c[0] + 2, c[1] - 24], [c[0] + 3, c[1] - 30], [c[0] + 5, c[1] - 24]], '#C98A55', INK); g.line([c[0] - 8, c[1] - 5], [c[0] - 14, c[1] - 1], '#C98A55', 3); g.ell(c[0] - 3, c[1] - 1, 5, 2, '#A87040', false); };
  D.surfboard = function (g, rw, rh, c) { sh(g, c, 8); [[-5, '#4F9CFF'], [1, '#FF7AA8'], [7, '#FFD84A']].forEach(function (q) { g.ell(c[0] + q[0], c[1] - 14, 3.6, 14, q[1], INK); g.line([c[0] + q[0], c[1] - 26], [c[0] + q[0], c[1] - 2], '#fff', 1); }); };
  D.eucalyptus = function (g, rw, rh, c) { sh(g, c, 10); g.line([c[0], c[1]], [c[0] + 1, c[1] - 22], '#B9B3A6', 3); [[-7, -26, 7], [6, -30, 7], [0, -36, 6], [-2, -22, 6]].forEach(function (q) { g.ell(c[0] + q[0], c[1] + q[1], q[2], q[2] * .6, '#6B9E78', INK); }); };
  D.liberty2 = function (g, rw, rh, c) { Q.liberty(g, rw, rh, 1, {}); };

  Q.pillar = function (g, rw, rh, lv, p) {   // Chùa Một Cột: hồ sen, một cột đá, đình nhỏ
    g.keep = true; g.poly(g.faceT(0, 0, rw, rh, 0), '#5FB7E8', false); g.keep = false; var cx = rw / 2, cy = rh / 2, c = g.P(cx, cy, 0);
    g.ell(c[0], c[1], rw * 26, rh * 12, '#6FC8F2', false); [[-14, 2], [12, 5], [4, -6]].forEach(function (q) { g.ell(c[0] + q[0], c[1] + q[1], 5, 2.4, '#5FCB6E'); dot(g, c[0] + q[0], c[1] + q[1] - 1, 1.6, '#FF9EC0'); });
    g.cyl(cx, cy, .14, 0, 22, '#B9B3A6'); g.box(cx - .38, cy - .38, .76, .76, 22, 28, '#C9503C'); g.hip(cx - .5, cy - .5, 1, 1, 28, 40, '#8A5A33', .1); eaveTips(g, cx - .5, cy - .5, 1, 1, 28, '#8A5A33');
  };
  Q.stadium = function (g, rw, rh, lv, p) { A.kit4.stadium(g, rw, rh, { z: 30 + lv * 6, wall: p.wall || '#E8EDF2', roof: p.roof || '#4F80BA', mast: 50, sign: [p.c || '#E9573F', 'BASEB'] }); };
  // dùng lại các khuôn của art6/7/8 qua tên 'k6_*', 'k7_*', 'k8_*'
  [['k6_', K6.styles], ['k7_', K7], ['k8_', K8]].forEach(function (pr) {
    Object.keys(pr[1]).forEach(function (n) { var f = pr[1][n]; if (typeof f !== 'function') return; Q[pr[0] + n] = function (g, rw, rh, lv, p) { f(g, rw, rh, lv, p, K6.rng(K6.hashS(p.id || n))); }; });
  });
  var reg = function (key, style, p) { var f = Q[style]; if (!f) return; p = p || {}; p.id = key; def(key, function (g, rw, rh, lv) { f(g, rw, rh, lv || 1, p); }); };
  var fx = function (key, style, p) { var f = Q[style]; if (!f) return; p = p || {}; p.id = key; A.FX[key] = function (g, rw, rh) { f(g, rw, rh, 2, p); }; };
  var R = reg, F = fx;
  R('cnteahouse', 'asia', {"wall": "#C9503C", "roof": "#2E8A6A", "fl": 2, "sign": "#F2D27A"});
  R('cndimsum', 'asia', {"wall": "#B8452E", "roof": "#2E8A6A", "fl": 2, "sign": "#FFD84A"});
  R('cnherb', 'asia', {"wall": "#8A5A33", "roof": "#4A4F5C", "sign": "#E8D7B5"});
  R('cnsilk', 'asia', {"wall": "#F2D27A", "roof": "#C9503C", "fl": 2, "sign": "#E9573F"});
  R('cnshophouse', 'asia', {"wall": "#D9503C", "roof": "#2E8A6A", "fl": 3});
  R('cncourtyard', 'temple', {"wall": "#B8452E", "roof": "#2E8A6A"});
  R('cntemple', 'temple', {"wall": "#C9503C", "roof": "#F2B01B"});
  R('cnpagoda', 'tiers', {"n": 5, "wall": "#C9503C", "roof": "#2E8A6A"});
  R('cnpailou', 'gate', {"t": "pailou"});
  R('cnlanternst', 'k8_lanterns', {"c1": "#E9573F"});
  R('cndragonsq', 'deco', {"t": "dragon", "under": "#D9D3C4"});
  R('cnmoonbridge', 'k8_b_wood', {"c1": "#C9503C"});
  R('cnlanternpost', 'deco', {"t": "redlantern"});
  R('cndragonstat', 'deco', {"t": "dragon"});
  R('jpmachiya', 'asia', {"wall": "#6B4A2E", "roof": "#4A4F5C", "fl": 2, "lan": "#fff", "sign": "#fff"});
  R('jpsushi', 'asia', {"wall": "#F2EAD8", "roof": "#4A4F5C", "sign": "#E9573F", "lan": "#fff"});
  R('jpramen', 'asia', {"wall": "#8A5A33", "roof": "#3A3F4C", "sign": "#E9573F"});
  R('jptea', 'asia', {"wall": "#E8D7B5", "roof": "#4A4F5C"});
  R('jphouse', 'asia', {"wall": "#F2EAD8", "roof": "#4A4F5C", "lan": "#fff"});
  R('jpapart', 'asia', {"wall": "#E8EDF2", "roof": "#4A4F5C", "fl": 3, "win": "#BFE6F5"});
  R('jpshrine', 'temple', {"wall": "#D9503C", "roof": "#4A4F5C"});
  R('jpcastle', 'tiers', {"n": 4, "wall": "#F6F6F6", "roof": "#3A3F4C", "base": "#9AA3AE"});
  R('jppagoda5', 'tiers', {"n": 5, "wall": "#B8452E", "roof": "#4A4F5C"});
  R('jptorii', 'gate', {"t": "torii"});
  R('jpzen', 'k6_park_zen', {});
  R('jpkoi', 'k6_park_koi', {});
  R('jpsakura', 'k6_park_orchard', {"tree": "cherry", "fruit": "#FF7AA8"});
  R('jpsakuratree', 'deco', {"t": "sakura"});
  R('jpbonsai', 'deco', {"t": "bonsaip"});
  R('vntube', 'row', {"cols": ["#F6CBA2", "#C3DCF3", "#F3B9B9", "#F5E6C8"], "roofs": ["#D95A42"], "h": 36, "door": "#7A4B2A"});
  R('vnpho', 'asia', {"wall": "#F6E2B8", "roof": "#C9503C", "sign": "#E9573F"});
  R('vncoffee', 'row', {"cols": ["#F5E6C8", "#D9B885", "#C3DCF3"], "roofs": ["#8A5A33"], "h": 26});
  R('vnmarket', 'k8_s_clock', {"c1": "#F2D27A", "roof": "#C9503C", "train": "#E9573F", "lot": "#D9D3C4"});
  R('vnstilt', 'stilt', {"wall": "#C9A06A", "roof": "#8A5A33"});
  R('vnpagoda', 'temple', {"wall": "#F2D27A", "roof": "#B8452E"});
  R('vnonepillar', 'pillar', {});
  R('vnlake', 'k6_park_lake', {});
  R('vngate', 'gate', {"t": "pailou", "c1": "#8A5A33", "roof": "#8A5A33"});
  R('vnrice', 'k6_park_terrace', {});
  R('vnlantern', 'k8_lanterns', {"c1": "#F28B2B"});
  R('vncovered', 'k8_b_wood', {"c1": "#C9503C"});
  R('vnconical', 'deco', {"t": "nonla"});
  R('vncyclo', 'deco', {"t": "cyclo"});
  R('thwat', 'temple', {"wall": "#F2D27A", "roof": "#C9503C"});
  R('thchedi', 'stupa', {});
  R('thstilt', 'stilt', {"wall": "#C9A06A", "roof": "#B8452E"});
  R('thstilt2', 'stilt', {"wall": "#E8D7B5", "roof": "#2E8A6A"});
  R('thfloat', 'k6_boathouse', {"wall": "#F6E2B8", "roof": "#E9573F", "boat": "#FFD84A"});
  R('thmassage', 'asia', {"wall": "#F2D27A", "roof": "#B8452E"});
  R('thnoodle', 'asia', {"wall": "#E9573F", "roof": "#8A5A33"});
  R('thhotel', 'asia', {"wall": "#F2D27A", "roof": "#B8452E", "fl": 3});
  R('thgate', 'gate', {"t": "pailou", "c1": "#F2B01B", "roof": "#E2B33C"});
  R('thlotus', 'k6_park_pond', {"water": "#5BC4C0"});
  R('thbuddha', 'deco', {"t": "buddha", "under": "#E8D7B5"});
  R('thgarden', 'k6_park_lagoon', {});
  R('thtuktuk', 'deco', {"t": "tuktuk"});
  R('thbuddhasm', 'deco', {"t": "buddha"});
  R('idborobudur', 'stupa', {"k": "candi"});
  R('idbalitemple', 'temple', {"wall": "#9AA3AE", "roof": "#3A3A44", "tree": "palm"});
  R('idjoglo', 'asia', {"wall": "#C9A06A", "roof": "#8A5A33", "lan": "#F2D27A"});
  R('idvilla', 'stilt', {"wall": "#F6EAD2", "roof": "#C9A55A"});
  R('idwarung', 'asia', {"wall": "#E8D7B5", "roof": "#C9A55A"});
  R('idbatik', 'asia', {"wall": "#B8452E", "roof": "#C9A55A", "sign": "#F2D27A"});
  R('idmarket', 'asia', {"wall": "#F2D27A", "roof": "#C9A55A", "fl": 1});
  R('idgate', 'gate', {"t": "bentar"});
  R('idrice', 'k6_park_terrace', {"c1": "#8FDB6A", "c2": "#5BAE55"});
  R('idbeach', 'k6_park_lagoon', {});
  R('idspa', 'temple', {"wall": "#F2EAD8", "roof": "#C9A55A", "tree": "palm"});
  R('idoffering', 'deco', {"t": "balioffer"});
  R('idumbrella', 'deco', {"t": "umbrella"});
  R('ukterrace', 'row', {"cols": ["#B9724A", "#C98A55", "#A85D3E"], "roofs": ["#4A4F5C"]});
  R('ukvictorian', 'row', {"cols": ["#F6E2B8", "#C3DCF3", "#F3B9B9", "#D2F0E0"], "roofs": ["#6B7686"], "h": 30});
  R('ukpub', 'k6_tudor', {"wall": "#F5ECD7", "roof": "#4A3A2E"});
  R('ukbookshop', 'row', {"cols": ["#2E5A4A"], "roofs": ["#3A3F4C"], "h": 26, "door": "#B8452E"});
  R('ukmarket', 'row', {"cols": ["#B9724A", "#C9C0A8"], "flat": true, "h": 24});
  R('ukbigben', 'k8_clock2', {"c1": "#E8D7B5", "c2": "#4A4F5C"});
  R('ukcastle', 'k6_castle', {"wall": "#B9B3A6", "roof": "#6B7686", "flag": "#D9302B"});
  R('uktowerbridge', 'towerbridge', {});
  R('ukstation', 'k8_s_clock', {"c1": "#B9724A", "roof": "#3A3F4C", "train": "#2E5A8A"});
  R('ukhyde', 'k6_park_pond', {});
  R('ukrose', 'k6_park_rose', {});
  R('ukphone', 'deco', {"t": "phonebox"});
  R('ukbus', 'deco', {"t": "doubledecker"});
  R('ussky', 'skyscraper', {});
  R('usdeco', 'skyscraper', {"wall": "#D9C98A", "glass": "#BFE6F5", "neon": true});
  R('usbrownstone', 'row', {"cols": ["#8A5A3E", "#9A6A4A", "#7A4A32"], "flat": true, "stoop": true, "h": 32});
  R('ustownhouse', 'row', {"cols": ["#C9503C", "#D9C98A", "#9AA3AE"], "flat": true, "stoop": true, "h": 30});
  R('usdiner', 'diner', {});
  R('usgas', 'diner', {"c1": "#4F80BA", "sign": "#E9573F"});
  R('usbarn', 'k6_farm', {});
  R('usliberty', 'liberty', {});
  R('usstadium', 'stadium', {});
  R('uscentral', 'k6_park_pond', {});
  R('ustheatre', 'k7_wave', {"c2": "#FFD84A"});
  R('ushotdog', 'deco', {"t": "hotdog"});
  R('ustaxi', 'deco', {"t": "taxi"});
  R('auopera', 'sail', {});
  R('auharbour', 'k8_b_steelarch', {"c1": "#8A8F99"});
  R('auuluru', 'uluru', {});
  R('ausurf', 'outback', {"wall": "#BFE6F5", "roof": "#4F9CFF"});
  R('aubeachhouse', 'outback', {"wall": "#FFF8D8", "roof": "#2E8A8A"});
  R('aupub', 'outback', {"wall": "#F6EAD2", "roof": "#C9503C"});
  R('aufarm', 'k6_farm', {"wall": "#F6EAD2", "roof": "#C9503C"});
  R('aureef', 'k6_park_lagoon', {});
  R('aukoala', 'k6_park_orchard', {"tree": "oak", "fruit": "#6B9E78"});
  R('aubotanic', 'k6_park_dome', {});
  R('auroo', 'deco', {"t": "kangaroo"});
  R('ausurfboards', 'deco', {"t": "surfboard"});
  R('aucumtree', 'deco', {"t": "eucalyptus"});
  F('fx22gate', 'gate', {"t": "pailou"});
  F('fx22mark', 'tiers', {"n": 5, "wall": "#C9503C", "roof": "#2E8A6A"});
  F('fx22da', 'deco', {"t": "redlantern"});
  F('fx22db', 'deco', {"t": "dragon"});
  F('fx23gate', 'gate', {"t": "torii"});
  F('fx23mark', 'tiers', {"n": 4, "wall": "#F6F6F6", "roof": "#3A3F4C", "base": "#9AA3AE"});
  F('fx23da', 'deco', {"t": "sakura"});
  F('fx23db', 'deco', {"t": "bonsaip"});
  F('fx24gate', 'gate', {"t": "pailou", "c1": "#8A5A33", "roof": "#8A5A33"});
  F('fx24mark', 'temple', {"wall": "#F2D27A", "roof": "#B8452E"});
  F('fx24da', 'deco', {"t": "nonla"});
  F('fx24db', 'deco', {"t": "cyclo"});
  F('fx25gate', 'gate', {"t": "pailou", "c1": "#F2B01B", "roof": "#E2B33C"});
  F('fx25mark', 'stupa', {});
  F('fx25da', 'deco', {"t": "buddha"});
  F('fx25db', 'deco', {"t": "tuktuk"});
  F('fx26gate', 'gate', {"t": "bentar"});
  F('fx26mark', 'stupa', {"k": "candi"});
  F('fx26da', 'deco', {"t": "balioffer"});
  F('fx26db', 'deco', {"t": "umbrella"});
  F('fx27gate', 'deco', {"t": "arch"});
  F('fx27mark', 'k8_clock2', {"c1": "#E8D7B5", "c2": "#4A4F5C"});
  F('fx27da', 'deco', {"t": "phonebox"});
  F('fx27db', 'deco', {"t": "doubledecker"});
  F('fx28gate', 'deco', {"t": "signpost"});
  F('fx28mark', 'liberty', {});
  F('fx28da', 'deco', {"t": "hotdog"});
  F('fx28db', 'deco', {"t": "taxi"});
  F('fx29gate', 'deco', {"t": "signpost"});
  F('fx29mark', 'uluru', {});
  F('fx29da', 'deco', {"t": "kangaroo"});
  F('fx29db', 'deco', {"t": "eucalyptus"});
})(typeof window !== 'undefined' ? window : this);
