/* EWT City — ĐỒ HOẠ công trình vẽ bằng Canvas (tự vẽ, không dùng ảnh ngoài). Mỗi công trình được vẽ MỘT lần thành "sprite" rồi dán lên bản đồ → rất nhẹ khi có hàng trăm công trình.
   Hệ toạ độ: ô lưới (cx,cy) so với góc trên của chân công trình; P() đổi sang pixel xiên 2.5D (ô rộng 64, cao 32); z là độ cao pixel. */
(function (root) {
  'use strict';
  var HW = 32, HH = 16, SS = 2;                       // SS: độ nét sprite (vẽ gấp đôi rồi thu nhỏ khi dán)
  var hex = function (h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; };
  var cache = {};
  function shade(c, f) { var k = c + f; if (cache[k]) return cache[k]; var a = hex(c), r = Math.max(0, Math.min(255, Math.round(a[0] * f))), g = Math.max(0, Math.min(255, Math.round(a[1] * f))), b = Math.max(0, Math.min(255, Math.round(a[2] * f))); return (cache[k] = 'rgb(' + r + ',' + g + ',' + b + ')'); }
  var INK = 'rgba(40,28,60,.38)';

  function Gfx(ctx, ox, oy) { this.c = ctx; this.ox = ox; this.oy = oy; this.b = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 }; this.glow = []; this.meta = { smoke: [], flags: [], water: [], duck: [], crane: [], swing: [], rot: [] }; }
  var G = Gfx.prototype;
  G.P = function (cx, cy, z) { return [this.ox + (cx - cy) * HW, this.oy + (cx + cy) * HH - (z || 0)]; };
  G.ext = function (x, y, r) { var b = this.b; r = r || 0; if (x - r < b.x0) b.x0 = x - r; if (y - r < b.y0) b.y0 = y - r; if (x + r > b.x1) b.x1 = x + r; if (y + r > b.y1) b.y1 = y + r; };
  G.poly = function (pts, fill, stroke, lw) { var c = this.c, i; c.beginPath(); for (i = 0; i < pts.length; i++) { if (i) c.lineTo(pts[i][0], pts[i][1]); else c.moveTo(pts[i][0], pts[i][1]); this.ext(pts[i][0], pts[i][1], 2); } c.closePath(); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke !== false) { c.strokeStyle = stroke || INK; c.lineWidth = lw || 1.1; c.lineJoin = 'round'; c.stroke(); } };
  G.ell = function (x, y, rx, ry, fill, stroke) { var c = this.c; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); this.ext(x, y, Math.max(rx, ry) + 2); if (fill) { c.fillStyle = fill; c.fill(); } if (stroke) { c.strokeStyle = stroke; c.lineWidth = 1; c.stroke(); } };
  G.line = function (a, b, col, w) { var c = this.c; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(b[0], b[1]); this.ext(a[0], a[1], 2); this.ext(b[0], b[1], 2); c.strokeStyle = col; c.lineWidth = w || 1; c.lineCap = 'round'; c.stroke(); };
  // các mặt của một khối hộp: trái (dọc theo x, hướng +y), phải (dọc theo y, hướng +x), mặt trên
  G.faceL = function (x0, y0, w, h, z0, z1) { return [this.P(x0, y0 + h, z0), this.P(x0 + w, y0 + h, z0), this.P(x0 + w, y0 + h, z1), this.P(x0, y0 + h, z1)]; };
  G.faceR = function (x0, y0, w, h, z0, z1) { return [this.P(x0 + w, y0 + h, z0), this.P(x0 + w, y0, z0), this.P(x0 + w, y0, z1), this.P(x0 + w, y0 + h, z1)]; };
  G.faceT = function (x0, y0, w, h, z1) { return [this.P(x0, y0, z1), this.P(x0 + w, y0, z1), this.P(x0 + w, y0 + h, z1), this.P(x0, y0 + h, z1)]; };
  G.box = function (x0, y0, w, h, z0, z1, col, o) {
    o = o || {}; var top = o.top || shade(col, 1.14);
    if (!o.noL) this.poly(this.faceL(x0, y0, w, h, z0, z1), o.left || shade(col, .8));
    if (!o.noR) this.poly(this.faceR(x0, y0, w, h, z0, z1), o.right || col);
    if (!o.noT) this.poly(this.faceT(x0, y0, w, h, z1), top);
  };
  // điểm trên mặt trái / phải theo tham số t∈[0,1] dọc cạnh và độ cao z
  G.pl = function (x0, y0, w, h, t, z) { return this.P(x0 + w * t, y0 + h, z); };
  G.pr = function (x0, y0, w, h, t, z) { return this.P(x0 + w, y0 + h - h * t, z); };
  G.quadL = function (x0, y0, w, h, ta, tb, za, zb, fill, stroke) { this.poly([this.pl(x0, y0, w, h, ta, za), this.pl(x0, y0, w, h, tb, za), this.pl(x0, y0, w, h, tb, zb), this.pl(x0, y0, w, h, ta, zb)], fill, stroke === undefined ? false : stroke); };
  G.quadR = function (x0, y0, w, h, ta, tb, za, zb, fill, stroke) { this.poly([this.pr(x0, y0, w, h, ta, za), this.pr(x0, y0, w, h, tb, za), this.pr(x0, y0, w, h, tb, zb), this.pr(x0, y0, w, h, ta, zb)], fill, stroke === undefined ? false : stroke); };
  // lưới cửa sổ (nx cột × ny hàng) trên mặt trái / phải; sáng đèn vào ban đêm
  G.winsL = function (x0, y0, w, h, z0, z1, nx, ny, o) {
    o = o || {}; var i, j, m = o.m == null ? .2 : o.m, dz = (z1 - z0) / ny, col = o.col || '#9FD8F5';
    for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) { if (o.skip && o.skip(i, j)) continue; var ta = (i + m) / nx, tb = (i + 1 - m) / nx, za = z0 + j * dz + dz * .22, zb = z0 + (j + 1) * dz - dz * .22; this.quadL(x0, y0, w, h, ta, tb, za, zb, col); this.quadL(x0, y0, w, h, ta, tb, zb - (zb - za) * .35, zb, 'rgba(255,255,255,.4)'); if (((i * 7 + j * 13) % 10) < 7) this.glow.push([this.pl(x0, y0, w, h, ta, za), this.pl(x0, y0, w, h, tb, za), this.pl(x0, y0, w, h, tb, zb), this.pl(x0, y0, w, h, ta, zb)]); }
  };
  G.winsR = function (x0, y0, w, h, z0, z1, nx, ny, o) {
    o = o || {}; var i, j, m = o.m == null ? .2 : o.m, dz = (z1 - z0) / ny, col = o.col || '#8CC8EB';
    for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) { if (o.skip && o.skip(i, j)) continue; var ta = (i + m) / nx, tb = (i + 1 - m) / nx, za = z0 + j * dz + dz * .22, zb = z0 + (j + 1) * dz - dz * .22; this.quadR(x0, y0, w, h, ta, tb, za, zb, col); this.quadR(x0, y0, w, h, ta, tb, zb - (zb - za) * .35, zb, 'rgba(255,255,255,.35)'); if (((i * 5 + j * 11) % 10) < 7) this.glow.push([this.pr(x0, y0, w, h, ta, za), this.pr(x0, y0, w, h, tb, za), this.pr(x0, y0, w, h, tb, zb), this.pr(x0, y0, w, h, ta, zb)]); }
  };
  // kính liền dải (toà nhà văn phòng)
  G.glassL = function (x0, y0, w, h, z0, z1, rows, col) { var j, i, dz = (z1 - z0) / rows; for (j = 0; j < rows; j++) { this.quadL(x0, y0, w, h, .06, .94, z0 + j * dz + dz * .12, z0 + (j + 1) * dz - dz * .12, col || '#7FC0E8'); this.quadL(x0, y0, w, h, .06, .94, z0 + (j + 1) * dz - dz * .4, z0 + (j + 1) * dz - dz * .12, 'rgba(255,255,255,.35)'); for (i = 0; i < 5; i++) { if (((i * 7 + j * 5) % 10) < 6) { var ta = .08 + i * .17, tb = ta + .12; this.glow.push([this.pl(x0, y0, w, h, ta, z0 + j * dz + dz * .2), this.pl(x0, y0, w, h, tb, z0 + j * dz + dz * .2), this.pl(x0, y0, w, h, tb, z0 + (j + 1) * dz - dz * .2), this.pl(x0, y0, w, h, ta, z0 + (j + 1) * dz - dz * .2)]); } } } };
  G.glassR = function (x0, y0, w, h, z0, z1, rows, col) { var j, i, dz = (z1 - z0) / rows; for (j = 0; j < rows; j++) { this.quadR(x0, y0, w, h, .06, .94, z0 + j * dz + dz * .12, z0 + (j + 1) * dz - dz * .12, col || '#5FA8D8'); this.quadR(x0, y0, w, h, .06, .94, z0 + (j + 1) * dz - dz * .4, z0 + (j + 1) * dz - dz * .12, 'rgba(255,255,255,.3)'); for (i = 0; i < 5; i++) { if (((i * 3 + j * 7) % 10) < 5) { var ta = .08 + i * .17, tb = ta + .12; this.glow.push([this.pr(x0, y0, w, h, ta, z0 + j * dz + dz * .2), this.pr(x0, y0, w, h, tb, z0 + j * dz + dz * .2), this.pr(x0, y0, w, h, tb, z0 + (j + 1) * dz - dz * .2), this.pr(x0, y0, w, h, ta, z0 + (j + 1) * dz - dz * .2)]); } } } };
  G.doorL = function (x0, y0, w, h, t, z0, dw, dh, col) { this.quadL(x0, y0, w, h, t - dw / 2, t + dw / 2, z0, z0 + dh, col || '#7A4B2A', INK); };
  G.awnL = function (x0, y0, w, h, ta, tb, z, dz, depth, c1, c2) {      // mái che sọc bên mặt trái
    var n = 6, i, p0, p1; for (i = 0; i < n; i++) { var a = ta + (tb - ta) * i / n, b = ta + (tb - ta) * (i + 1) / n; this.poly([this.pl(x0, y0, w, h, a, z), this.pl(x0, y0, w, h, b, z), this.P(x0 + w * b, y0 + h + depth, z - dz), this.P(x0 + w * a, y0 + h + depth, z - dz)], i % 2 ? c2 : c1, INK, .8); }
  };
  G.awnR = function (x0, y0, w, h, ta, tb, z, dz, depth, c1, c2) {
    var n = 6, i; for (i = 0; i < n; i++) { var a = ta + (tb - ta) * i / n, b = ta + (tb - ta) * (i + 1) / n; this.poly([this.pr(x0, y0, w, h, a, z), this.pr(x0, y0, w, h, b, z), this.P(x0 + w + depth, y0 + h - h * b, z - dz), this.P(x0 + w + depth, y0 + h - h * a, z - dz)], i % 2 ? c2 : c1, INK, .8); }
  };
  // mái đầu hồi (ridge dọc theo x hoặc y)
  G.gable = function (x0, y0, w, h, zb, zt, alongX, col, o) {
    o = o || {}; var ov = o.over == null ? .08 : o.over, sh = o.side || shade(col, .75);
    if (alongX) {
      var ym = y0 + h / 2, A = [this.P(x0 - ov, y0 - ov, zb), this.P(x0 + w + ov, y0 - ov, zb), this.P(x0 + w + ov, ym, zt), this.P(x0 - ov, ym, zt)], Bq = [this.P(x0 - ov, ym, zt), this.P(x0 + w + ov, ym, zt), this.P(x0 + w + ov, y0 + h + ov, zb), this.P(x0 - ov, y0 + h + ov, zb)];
      this.poly(this.faceR(x0, y0, w, h, zb - 0.01, zb), 'rgba(0,0,0,0)', false); this.poly([this.P(x0 + w, y0 + h, zb), this.P(x0 + w, ym, zt), this.P(x0 + w, y0, zb)], o.wall ? shade(o.wall, 1) : sh, INK);
      this.poly(A, shade(col, .88)); this.poly(Bq, shade(col, 1.08));
      this.line(this.P(x0 - ov, ym, zt), this.P(x0 + w + ov, ym, zt), shade(col, 1.3), 1.6);
    } else {
      var xm = x0 + w / 2, A2 = [this.P(x0 - ov, y0 - ov, zb), this.P(xm, y0 - ov, zt), this.P(xm, y0 + h + ov, zt), this.P(x0 - ov, y0 + h + ov, zb)], B2 = [this.P(xm, y0 - ov, zt), this.P(x0 + w + ov, y0 - ov, zb), this.P(x0 + w + ov, y0 + h + ov, zb), this.P(xm, y0 + h + ov, zt)];
      this.poly([this.P(x0, y0 + h, zb), this.P(xm, y0 + h, zt), this.P(x0 + w, y0 + h, zb)], o.wall ? shade(o.wall, .8) : shade(sh, .9), INK);
      this.poly(A2, shade(col, .88)); this.poly(B2, shade(col, 1.08));
      this.line(this.P(xm, y0 - ov, zt), this.P(xm, y0 + h + ov, zt), shade(col, 1.3), 1.6);
    }
  };
  // mái chóp / mái thoải
  G.hip = function (x0, y0, w, h, zb, zt, col, inset) {
    var i = inset == null ? .3 : inset, xa = x0 + w * i, xb = x0 + w * (1 - i), ya = y0 + h * i, yb = y0 + h * (1 - i), ov = .06;
    var b0 = this.P(x0 - ov, y0 - ov, zb), b1 = this.P(x0 + w + ov, y0 - ov, zb), b2 = this.P(x0 + w + ov, y0 + h + ov, zb), b3 = this.P(x0 - ov, y0 + h + ov, zb), t0 = this.P(xa, ya, zt), t1 = this.P(xb, ya, zt), t2 = this.P(xb, yb, zt), t3 = this.P(xa, yb, zt);
    this.poly([b0, b1, t1, t0], shade(col, .7)); this.poly([b0, b3, t3, t0], shade(col, .78)); this.poly([b3, b2, t2, t3], shade(col, .9)); this.poly([b1, b2, t2, t1], shade(col, 1.05)); if (i < .45) this.poly([t0, t1, t2, t3], shade(col, 1.18));
  };
  G.flat = function (x0, y0, w, h, z, col, rim) { this.poly(this.faceT(x0, y0, w, h, z), col); if (rim) { var r = .06; this.box(x0, y0, w, r, z, z + 3, rim, { noT: false }); this.box(x0, y0 + h - r, w, r, z, z + 3, rim); this.box(x0, y0, r, h, z, z + 3, rim); this.box(x0 + w - r, y0, r, h, z, z + 3, rim); } };
  G.cyl = function (cx, cy, r, z0, z1, col, topCol) {       // trụ tròn
    var p0 = this.P(cx, cy, z0), p1 = this.P(cx, cy, z1), rx = r * HW * 1.25, ry = r * HH * 1.25, c = this.c;
    c.beginPath(); c.moveTo(p0[0] - rx, p0[1]); c.lineTo(p1[0] - rx, p1[1]); c.ellipse(p1[0], p1[1], rx, ry, 0, Math.PI, 0, true); c.lineTo(p0[0] + rx, p0[1]); c.ellipse(p0[0], p0[1], rx, ry, 0, 0, Math.PI, false); c.closePath(); var g = c.createLinearGradient(p0[0] - rx, 0, p0[0] + rx, 0); g.addColorStop(0, shade(col, .78)); g.addColorStop(.55, shade(col, 1.04)); g.addColorStop(1, shade(col, .9)); c.fillStyle = g; c.fill(); c.strokeStyle = INK; c.lineWidth = 1; c.stroke(); this.ext(p0[0], p0[1], rx + 2); this.ext(p1[0], p1[1] - ry, rx + 2);
    this.ell(p1[0], p1[1], rx, ry, topCol || shade(col, 1.18), INK);
  };
  G.tree = function (cx, cy, s, kind, z) {
    z = z || 0; var p = this.P(cx, cy, z), k = s || 1; this.ell(p[0], p[1] + 2, 9 * k, 4.5 * k, 'rgba(30,60,30,.22)');
    if (kind === 'pine') { this.poly([[p[0] - 1.6 * k, p[1]], [p[0] + 1.6 * k, p[1]], [p[0] + 1.6 * k, p[1] - 8 * k], [p[0] - 1.6 * k, p[1] - 8 * k]], '#7A4B2A', false); var n; for (n = 0; n < 3; n++) { var y = p[1] - (8 + n * 7) * k, w = (11 - n * 3) * k; this.poly([[p[0] - w, y + 4 * k], [p[0], y - 12 * k], [p[0] + w, y + 4 * k]], n % 2 ? '#2F8F52' : '#3AA662', INK, .8); } return; }
    this.poly([[p[0] - 1.8 * k, p[1]], [p[0] + 1.8 * k, p[1]], [p[0] + 1.4 * k, p[1] - 10 * k], [p[0] - 1.4 * k, p[1] - 10 * k]], '#8A5A33', false);
    var cols = kind === 'cherry' ? ['#F5A3C0', '#FFC4D8'] : kind === 'autumn' ? ['#E58A3C', '#F3B24A'] : ['#3FA55B', '#63C277'];
    this.ell(p[0] - 5 * k, p[1] - 14 * k, 8 * k, 7 * k, shade(cols[0], .9), INK); this.ell(p[0] + 5 * k, p[1] - 15 * k, 8 * k, 7 * k, cols[0], INK); this.ell(p[0], p[1] - 20 * k, 9 * k, 8 * k, cols[1], INK); this.ell(p[0] - 2 * k, p[1] - 22 * k, 4 * k, 3 * k, 'rgba(255,255,255,.22)');
  };
  G.lamp = function (cx, cy, z) { var p = this.P(cx, cy, z || 0); this.line(p, [p[0], p[1] - 16], '#4B4F5A', 1.8); this.ell(p[0], p[1] - 17, 2.6, 2.6, '#FFE9A0', INK); this.glow.push({ c: [p[0], p[1] - 17], r: 9 }); };

  /* ───── bảng màu ───── */
  var WALL = ['#F5E6C8', '#F6CBA2', '#C4E5CC', '#C3DCF3', '#DCCFF2', '#F2F2F2', '#F4DD8E', '#F3B9B9'];
  var ROOF = ['#D95A42', '#4F80BA', '#9A6A45', '#3E9C94', '#6B7686', '#E58A3C', '#B8485E', '#5B8F4F'];

  /* ───── công trình ───── (hàm vẽ nhận g = Gfx, rw×rh = chân công trình sau khi xoay bản đồ, lv = cấp 1..3) */
  var ART = {};
  var smoke = function (g, cx, cy, z) { var p = g.P(cx, cy, z); g.meta.smoke.push([p[0], p[1]]); };
  ART.cottage = function (g, rw, rh, lv) {
    var wall = WALL[lv % 3 === 0 ? 1 : 0], roof = ROOF[lv === 1 ? 0 : lv === 2 ? 1 : 3], zb = 13 + lv * 2;
    g.box(.12, .12, rw - .24, rh - .24, 0, zb, wall); g.gable(.12, .12, rw - .24, rh - .24, zb, zb + 12, true, roof, { wall: wall });
    g.winsL(.12, .12, rw - .24, rh - .24, 3, zb - 1, 2, 1, { m: .3 }); g.winsR(.12, .12, rw - .24, rh - .24, 3, zb - 1, 1, 1, { m: .3 });
    g.doorL(.12, .12, rw - .24, rh - .24, .5, 0, .2, 8); if (lv >= 2) g.box(.15, rh - .12, rw - .3, .14, 0, 3, '#C9A06A'); smoke(g, rw * .72, rh * .35, zb + 14); g.box(rw * .66, rh * .3, .12, .12, zb + 4, zb + 14, '#B25A3C');
    if (lv >= 3) { g.tree(rw + .0, rh * .1, .55); g.box(rw * .1, rh * .05, .18, .18, zb, zb + 5, '#fff'); }
  };
  ART.townhouse = function (g, rw, rh, lv) {
    var wall = ['#F6CBA2', '#C3DCF3', '#DCCFF2'][lv - 1], roof = ROOF[lv === 1 ? 4 : lv === 2 ? 0 : 6], zb = 26 + lv * 4;
    g.box(.1, .1, rw - .2, rh - .2, 0, zb, wall); g.hip(.1, .1, rw - .2, rh - .2, zb, zb + 12, roof, .22);
    g.winsL(.1, .1, rw - .2, rh - .2, 12, zb - 2, 2, lv > 1 ? 2 : 1, { m: .28 }); g.winsR(.1, .1, rw - .2, rh - .2, 4, zb - 2, 2, 2, { m: .28 }); g.doorL(.1, .1, rw - .2, rh - .2, .35, 0, .22, 9, '#5C3A22');
    g.awnL(.1, .1, rw - .2, rh - .2, .55, .95, 11, 3, .12, '#E9573F', '#FFF'); smoke(g, rw * .25, rh * .3, zb + 10);
  };
  ART.duplex = function (g, rw, rh, lv) {
    var h2 = rh - .2, wA = (rw - .2) / 2, zb = 16 + lv * 2;
    [0, 1].forEach(function (n) { var x0 = .1 + n * wA, wall = WALL[n === 0 ? 0 : 3], roof = ROOF[n === 0 ? 0 : 1]; g.box(x0, .1, wA - .02, h2, 0, zb, wall); g.gable(x0, .1, wA - .02, h2, zb, zb + 12, false, roof, { wall: wall }); g.winsL(x0, .1, wA, h2, 4, zb - 2, 1, 1, { m: .3 }); g.doorL(x0, .1, wA, h2, .5, 0, .3, 8); });
    g.winsR(.1, .1, rw - .2, h2, 3, zb - 1, 1, 1, { m: .3 }); smoke(g, rw * .3, rh * .5, zb + 14);
  };
  ART.villa = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#8ED067', false); var z = 24 + lv * 3;
    g.box(.35, .3, rw - .8, rh - .8, 0, z, WALL[5]); g.gable(.35, .3, rw - .8, rh - .8, z, z + 14, true, ROOF[0], { wall: WALL[5] });
    g.box(rw - .55, .55, .5, rh - 1.2, 0, 14, WALL[1]); g.flat(rw - .55, .55, .5, rh - 1.2, 14, '#8C6B4F');
    g.winsL(.35, .3, rw - .8, rh - .8, 4, z - 2, 3, 2, { m: .25 }); g.winsR(.35, .3, rw - .8, rh - .8, 4, z - 2, 2, 2, { m: .25 }); g.doorL(.35, .3, rw - .8, rh - .8, .45, 0, .16, 10);
    g.box(.12, rh - .38, rw - .3, .22, 0, 2, '#D9D3C4'); g.tree(.2, rh - .15, .8); g.tree(rw - .2, .2, .9, 'cherry'); if (lv >= 2) { g.poly([g.P(rw - .45, rh - .55, .2), g.P(rw - .05, rh - .55, .2), g.P(rw - .05, rh - .1, .2), g.P(rw - .45, rh - .1, .2)], '#5BC6E8', INK); }
    if (lv >= 3) { g.box(.3, .1, .3, .3, 0, 8, '#D8C79A'); }
    smoke(g, rw * .4, rh * .35, z + 16);
  };
  ART.apartment = function (g, rw, rh, lv) {
    var z = 84 + lv * 26, wall = lv === 1 ? WALL[7] : lv === 2 ? WALL[6] : WALL[3];
    g.box(.15, .15, rw - .3, rh - .3, 0, z, wall); g.winsL(.15, .15, rw - .3, rh - .3, 4, z - 3, 4, 3 + lv, { m: .22 }); g.winsR(.15, .15, rw - .3, rh - .3, 4, z - 3, 4, 3 + lv, { m: .22 });
    var j; for (j = 1; j < 3 + lv; j++) { g.box(.1, rh - .15, rw - .2, .08, 4 + j * (z - 7) / (3 + lv) - 2, 4 + j * (z - 7) / (3 + lv), '#FFFFFF', { noR: true, noT: true }); }
    g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .2, 9, '#4C6FA8'); g.flat(.15, .15, rw - .3, rh - .3, z, shade(wall, 1.05), '#E8E8E8'); g.box(rw * .35, rh * .3, .4, .3, z, z + 7, '#C9CED6'); g.cyl(rw * .75, rh * .65, .18, z, z + 10, '#8FA0B5');
  };
  ART.condo = function (g, rw, rh, lv) {
    var z = 170 + lv * 40;
    g.box(.1, .1, rw - .2, rh - .2, 0, 14, '#F3F0E8'); g.box(.25, .25, rw - .5, rh - .5, 14, z, '#DDE6F2'); g.glassL(.25, .25, rw - .5, rh - .5, 16, z - 4, Math.round(z / 14), '#7FC0E8'); g.glassR(.25, .25, rw - .5, rh - .5, 16, z - 4, Math.round(z / 14), '#5FA8D8');
    g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .24, 10, '#3E5C86'); g.flat(.25, .25, rw - .5, rh - .5, z, '#EDEFF2', '#CFD6E0'); g.tree(rw * .35, rh * .4, .7, null, z); g.tree(rw * .6, rh * .6, .6, 'cherry', z); g.box(rw * .45, rh * .2, .25, .25, z, z + 10, '#B8C2CF'); g.line(g.P(rw * .57, rh * .32, z + 10), g.P(rw * .57, rh * .32, z + 30), '#6B7686', 1.4);
  };
  var awning = [['#E9573F', '#fff'], ['#2E9E7F', '#fff'], ['#F29A2E', '#fff'], ['#4F80BA', '#fff'], ['#B8485E', '#fff']];
  ART.kiosk = function (g, rw, rh, lv) {
    g.box(.2, .2, rw - .4, rh - .4, 0, 14, '#F2D8A8'); g.quadL(.2, .2, rw - .4, rh - .4, .12, .88, 5, 11, '#6FB7E0'); g.awnL(.2, .2, rw - .4, rh - .4, .05, .95, 14, 4, .18, awning[0][0], '#fff'); g.flat(.2, .2, rw - .4, rh - .4, 14, '#D9573F');
    g.box(.1, rh - .12, .22, .1, 0, 6, '#8C6B4F'); g.ell(g.P(rw - .2, rh - .1, 9)[0], g.P(rw - .2, rh - .1, 9)[1], 5, 3, '#FFD84A', INK);
  };
  ART.bakery = function (g, rw, rh, lv) {
    g.box(.1, .1, rw - .2, rh - .2, 0, 22 + lv * 2, '#F6D6C2'); g.winsR(.1, .1, rw - .2, rh - .2, 6, 20, 1, 1, { m: .3 }); g.quadL(.1, .1, rw - .2, rh - .2, .1, .9, 4, 12, '#9FD8F5'); g.awnL(.1, .1, rw - .2, rh - .2, .05, .95, 14, 5, .2, awning[4][0], '#fff'); g.doorL(.1, .1, rw - .2, rh - .2, .78, 0, .16, 9, '#7A4B2A');
    g.hip(.1, .1, rw - .2, rh - .2, 22 + lv * 2, 32 + lv * 2, '#B8485E', .25); var p = g.P(rw * .5, rh + .05, 22 + lv * 2); g.ell(p[0], p[1] - 4, 6, 4, '#E8A860', INK); smoke(g, rw * .75, rh * .3, 34);
  };
  ART.cafe = function (g, rw, rh, lv) {
    g.box(.1, .1, rw - .2, rh - .2, 0, 24, '#CFE6D4'); g.quadL(.1, .1, rw - .2, rh - .2, .08, .62, 5, 17, '#9FD8F5'); g.doorL(.1, .1, rw - .2, rh - .2, .78, 0, .16, 10, '#5C3A22'); g.winsR(.1, .1, rw - .2, rh - .2, 6, 20, 1, 1, { m: .3 });
    g.awnL(.1, .1, rw - .2, rh - .2, .04, .96, 19, 5, .22, awning[1][0], '#fff'); g.flat(.1, .1, rw - .2, rh - .2, 24, '#8CBF9A', '#F2F2F2'); [[.3, rh + .12], [.62, rh + .14]].forEach(function (q) { var p = g.P(q[0] * rw, q[1], 5); g.ell(p[0], p[1], 5, 2.8, '#F4D9A6', INK); g.line(p, [p[0], p[1] + 5], '#6B4A2E', 1.4); });
    var s = g.P(rw * .85, rh * .15, 24); g.ell(s[0], s[1] - 5, 5.5, 5.5, '#fff', INK); g.line([s[0], s[1] - 8], [s[0], s[1] - 2], '#6B4A2E', 1.4);
  };
  ART.shop = function (g, rw, rh, lv) {
    var z = 28 + lv * 2; g.box(.08, .1, rw - .16, rh - .2, 0, z, '#F3D9E4'); g.quadL(.08, .1, rw - .16, rh - .2, .06, .62, 4, 18, '#9FD8F5'); g.doorL(.08, .1, rw - .16, rh - .2, .8, 0, .12, 11, '#6B4A7A'); g.awnL(.08, .1, rw - .16, rh - .2, .03, .97, 20, 6, .22, awning[2][0], '#fff');
    g.winsR(.08, .1, rw - .16, rh - .2, 6, z - 4, 1, 1, { m: .3 }); g.winsL(.08, .1, rw - .16, rh - .2, z - 12, z - 3, 5, 1, { m: .25 }); g.flat(.08, .1, rw - .16, rh - .2, z, '#C98AAF', '#fff'); var p = g.P(rw * .45, rh - .05, z + 2); g.poly([[p[0] - 15, p[1] - 8], [p[0] + 15, p[1] - 8], [p[0] + 15, p[1] + 3], [p[0] - 15, p[1] + 3]], '#FFFFFF', INK);
    g.line([p[0] - 10, p[1] - 3], [p[0] + 10, p[1] - 3], '#F29A2E', 3);
  };
  ART.market = function (g, rw, rh, lv) {
    var z = 30 + lv * 2; g.poly(g.faceT(0, 0, rw, rh, 0), '#9AA3AE', false); g.box(.1, .1, rw - .2, rh - .55, 0, z, '#F2F4F7'); g.quadL(.1, .1, rw - .2, rh - .55, .06, .72, 4, 20, '#9FD8F5'); g.doorL(.1, .1, rw - .2, rh - .55, .86, 0, .12, 12, '#3E8E6B');
    g.poly(g.faceT(.1, .1, rw - .2, rh - .55, z).map(function (p) { return p; }), '#CBD3DC'); g.box(.1, .1, rw - .2, .12, z, z + 7, '#2E9E7F'); g.quadL(.1, .1, rw - .2, rh - .55, .12, .88, z - 7, z - 1, '#2E9E7F'); var p = g.P(rw * .5, rh - .45, z - 4); g.line([p[0] - 12, p[1]], [p[0] + 12, p[1]], '#fff', 2.4);
    g.winsR(.1, .1, rw - .2, rh - .55, 6, z - 5, 2, 1, { m: .3 }); [[.3, rh - .2], [.7, rh - .2]].forEach(function (q, n) { g.box(rw * q[0], q[1], .5, .26, 0, 5, n ? '#4F80BA' : '#E9573F', {}); }); g.tree(rw - .15, rh - .2, .7);
  };
  ART.bank = function (g, rw, rh, lv) {
    var z = 34 + lv * 3; g.box(.15, .2, rw - .3, rh - .4, 0, z, '#F1EAD8'); g.poly(g.faceT(.15, .2, rw - .3, rh - .4, z), '#E4DCC6'); var i;
    for (i = 0; i < 5; i++) { var t = .1 + i * .2, a = g.pl(.15, .2, rw - .3, rh - .4, t, 0), b = g.pl(.15, .2, rw - .3, rh - .4, t, z - 6); g.poly([[a[0] - 3, a[1] + 5], [a[0] + 3, a[1] + 5], [b[0] + 3, b[1]], [b[0] - 3, b[1]]], '#FFFFFF', INK, .7); }
    g.poly([g.P(.1, rh - .2 + .05, z - 5), g.P(rw / 2, rh - .2 + .05, z + 11), g.P(rw - .15, rh - .2 + .05, z - 5)], '#D7CDB4', INK); g.doorL(.15, .2, rw - .3, rh - .4, .5, 0, .18, 12, '#8A6A2E'); g.winsR(.15, .2, rw - .3, rh - .4, 8, z - 5, 2, 1, { m: .3 }); var s = g.P(rw * .5, rh - .2, z + 14); g.ell(s[0], s[1], 5, 5, '#F2C21B', INK);
    g.box(.05, rh - .12, rw - .1, .12, 0, 3, '#D9D3C4'); g.flag = null;
  };
  ART.office = function (g, rw, rh, lv) {
    var z = 150 + lv * 34; g.box(.12, .12, rw - .24, rh - .24, 0, z, '#CED7E3'); g.glassL(.12, .12, rw - .24, rh - .24, 10, z - 4, Math.round(z / 13), '#6FB5E3'); g.glassR(.12, .12, rw - .24, rh - .24, 10, z - 4, Math.round(z / 13), '#4F96CC');
    g.doorL(.12, .12, rw - .24, rh - .24, .5, 0, .24, 9, '#2F4E74'); g.flat(.12, .12, rw - .24, rh - .24, z, '#B8C3D2', '#E2E8F0'); g.box(rw * .3, rh * .3, .35, .3, z, z + 8, '#9FAABA'); g.line(g.P(rw * .7, rh * .3, z), g.P(rw * .7, rh * .3, z + 24), '#6B7686', 1.4);
  };
  ART.hotel = function (g, rw, rh, lv) {
    var z = 130 + lv * 28; g.box(.15, .15, rw - .3, rh - .3, 0, z, '#F3E3C3'); g.winsL(.15, .15, rw - .3, rh - .3, 10, z - 3, 4, Math.round(z / 14), { m: .2, col: '#A7DDF5' }); g.winsR(.15, .15, rw - .3, rh - .3, 10, z - 3, 4, Math.round(z / 14), { m: .2 });
    g.box(.05, rh - .35, rw - .1, .4, 0, 8, '#B8485E'); g.awnL(.15, .15, rw - .3, rh - .3, .3, .7, 12, 4, .4, '#B8485E', '#F2C21B'); g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .18, 9, '#3B2A1E'); g.flat(.15, .15, rw - .3, rh - .3, z, '#E7D3A9', '#fff'); var s = g.P(rw * .5, rh * .6, z + 14); g.poly([[s[0] - 20, s[1] - 6], [s[0] + 20, s[1] - 6], [s[0] + 20, s[1] + 7], [s[0] - 20, s[1] + 7]], '#B8485E', INK); g.line([s[0] - 12, s[1]], [s[0] + 12, s[1]], '#FFE9A0', 2.4);
  };
  ART.mall = function (g, rw, rh, lv) {
    var z = 40 + lv * 4; g.poly(g.faceT(0, 0, rw, rh, 0), '#A8B0BA', false); g.box(.1, .1, rw - .2, rh - .4, 0, z, '#F2E6F6'); g.glassL(.1, .1, rw - .2, rh - .4, 5, z - 4, 3, '#8FD0F0'); g.glassR(.1, .1, rw - .2, rh - .4, 5, z - 4, 3, '#6FB8E0');
    g.box(rw * .3, rh * .22, rw * .4, rh * .3, z, z + 16, '#BFE6F5'); g.winsL(rw * .3, rh * .22, rw * .4, rh * .3, z + 2, z + 14, 3, 1, { m: .2 }); g.doorL(.1, .1, rw - .2, rh - .4, .5, 0, .2, 14, '#2F4E74'); var s = g.P(rw * .5, rh - .28, z + 4); g.poly([[s[0] - 22, s[1] - 8], [s[0] + 22, s[1] - 8], [s[0] + 22, s[1] + 5], [s[0] - 22, s[1] + 5]], '#7A4BC7', INK); g.line([s[0] - 14, s[1] - 1], [s[0] + 14, s[1] - 1], '#fff', 2.6);
    [[.2, rh - .12], [.5, rh - .1], [.8, rh - .12]].forEach(function (q) { g.tree(rw * q[0], q[1], .55); }); g.flat(.1, .1, rw - .2, rh - .4, z, '#D7C4E6', '#fff');
  };
  ART.skyscraper = function (g, rw, rh, lv) {
    var z = 380 + lv * 70, w1 = rw - .3, h1 = rh - .3; g.box(.15, .15, w1, h1, 0, z * .55, '#9DB7D5'); g.box(.45, .45, w1 - .6, h1 - .6, z * .55, z, '#8EAACB'); g.box(.75, .75, w1 - 1.2, h1 - 1.2, z, z + 30, '#7E9BBE');
    g.glassL(.15, .15, w1, h1, 12, z * .55 - 3, Math.round(z * .55 / 13), '#6FB5E3'); g.glassR(.15, .15, w1, h1, 12, z * .55 - 3, Math.round(z * .55 / 13), '#4F96CC'); g.glassL(.45, .45, w1 - .6, h1 - .6, z * .55 + 2, z - 3, Math.round(z * .45 / 13), '#7EC0EC'); g.glassR(.45, .45, w1 - .6, h1 - .6, z * .55 + 2, z - 3, Math.round(z * .45 / 13), '#5AA2D4'); g.glassL(.75, .75, w1 - 1.2, h1 - 1.2, z + 2, z + 27, 3, '#8ACBF0'); g.glassR(.75, .75, w1 - 1.2, h1 - 1.2, z + 2, z + 27, 3, '#62A9DB');
    g.doorL(.15, .15, w1, h1, .5, 0, .2, 10, '#1F3A5F'); g.line(g.P(rw / 2, rh / 2, z + 30), g.P(rw / 2, rh / 2, z + 70), '#6B7686', 2); g.ell(g.P(rw / 2, rh / 2, z + 70)[0], g.P(rw / 2, rh / 2, z + 70)[1], 2.4, 2.4, '#FF5A5A'); g.meta.beacon = g.P(rw / 2, rh / 2, z + 70);
  };
  ART.tree = function (g, rw, rh, lv) { g.poly(g.faceT(.12, .12, rw - .24, rh - .24, 0), 'rgba(110,190,90,.0)', false); g.tree(.5, .5, 1.15, lv === 2 ? 'cherry' : lv === 3 ? 'autumn' : null); g.tree(.2, .75, .7, 'pine'); };
  ART.flowerbed = function (g, rw, rh, lv) {
    g.poly(g.faceT(.12, .12, rw - .24, rh - .24, 2), '#9C6B3E', INK); g.box(.12, .12, rw - .24, rh - .24, 0, 2, '#C9A36B', { noT: true }); var i, cols = ['#FF7A9A', '#FFD84A', '#B48CFF', '#FF9A4A', '#FFFFFF'];
    for (i = 0; i < 14; i++) { var a = (i * 37 % 100) / 100, b = (i * 61 % 100) / 100, p = g.P(.2 + a * (rw - .4), .2 + b * (rh - .4), 3); g.line(p, [p[0], p[1] - 4], '#3FA55B', 1.2); g.ell(p[0], p[1] - 5, 2.3, 2.3, cols[(i + lv) % cols.length], INK); }
  };
  ART.fountain = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#D8D3C6', INK); var c = g.P(rw / 2, rh / 2, 0); g.ell(c[0], c[1], 22, 11, '#F2EEE2', INK); g.ell(c[0], c[1] + 1, 18, 9, '#6FC8EC'); g.cyl(rw / 2, rh / 2, .12, 0, 12, '#E8E3D6'); g.ell(c[0], c[1] - 14, 8, 4, '#DFF3FB', INK); g.meta.water.push([c[0], c[1] - 16]);
  };
  ART.playground = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#E8C58A', INK); g.poly(g.faceT(.2, .2, rw - .4, rh - .4, 1), '#F5D9A0', false); g.box(.35, .3, .5, .5, 0, 16, '#E9573F'); g.hip(.35, .3, .5, .5, 16, 24, '#F2C21B', .1); g.poly([g.P(.35, .8, 16), g.P(.85, .8, 16), g.P(1.25, 1.35, 2), g.P(.75, 1.35, 2)], '#4F80BA', INK);
    var a = g.P(1.15, .35, 0), sw = g.P(1.5, .35, 0); g.line([a[0], a[1]], [a[0] + 4, a[1] - 20], '#7A4B2A', 2); g.line([sw[0], sw[1]], [sw[0] - 4, sw[1] - 20], '#7A4B2A', 2); g.line([a[0] + 4, a[1] - 20], [sw[0] - 4, sw[1] - 20], '#7A4B2A', 2); g.meta.swing.push([ (a[0] + sw[0]) / 2, a[1] - 20 ]); g.tree(.15, 1.5, .7);
  };
  ART.court = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#C45B3C', INK); g.poly(g.faceT(.15, .15, rw - .3, rh - .3, 0), '#D2714E', '#fff', 1.2); g.line(g.P(rw / 2, .15, 0), g.P(rw / 2, rh - .15, 0), '#fff', 1.4); var c = g.P(rw / 2, rh / 2, 0); g.ell(c[0], c[1], 10, 5, 'rgba(255,255,255,.0)', '#fff');
    [[.18, rh / 2], [rw - .18, rh / 2]].forEach(function (q) { var p = g.P(q[0], q[1], 0); g.line(p, [p[0], p[1] - 22], '#5A6270', 2); g.poly([[p[0] - 7, p[1] - 28], [p[0] + 7, p[1] - 28], [p[0] + 7, p[1] - 18], [p[0] - 7, p[1] - 18]], '#fff', INK); g.ell(p[0], p[1] - 17, 4, 2, '#F29A2E', INK); });
  };
  ART.pondpark = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#8ED067', INK); var c = g.P(rw / 2, rh / 2, 0); g.ell(c[0], c[1], 26, 13, '#D9D3C4', INK); g.ell(c[0], c[1], 22, 10.5, '#5FC0E8'); g.ell(c[0] - 6, c[1] - 2, 3, 1.6, 'rgba(255,255,255,.55)'); g.ell(c[0] + 8, c[1] + 2, 2.4, 1.2, 'rgba(255,255,255,.5)'); g.meta.duck.push([c[0] - 4, c[1]], [c[0] + 8, c[1] + 3]);
    g.tree(.2, .3, .9, 'cherry'); g.tree(rw - .2, rh - .15, .8); g.box(.9, rh - .25, .6, .14, 0, 4, '#8C6B4F');
  };
  ART.statue = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#E6E0D0', INK); g.poly(g.faceT(.3, .3, rw - .6, rh - .6, 3), '#CFC8B4', INK); g.box(.7, .7, .6, .6, 0, 16, '#BFC4CC'); var c = g.P(1, 1, 16); g.ell(c[0], c[1] - 8, 6, 8, '#D8B35A', INK); g.ell(c[0], c[1] - 20, 4.2, 4.2, '#E8C86A', INK); g.line([c[0] + 5, c[1] - 12], [c[0] + 11, c[1] - 22], '#D8B35A', 3); g.tree(.2, .2, .8, 'cherry'); g.tree(rw - .2, rh - .15, .8);
  };
  ART.busstop = function (g, rw, rh, lv) {
    g.poly(g.faceT(.15, .35, rw - .3, rh - .5, 1), '#B9BEC6', INK); g.box(.15, .55, rw - .3, .06, 1, 20, '#7FC0E8', { noT: false }); g.poly(g.faceT(.1, .3, rw - .2, rh - .45, 20), '#2E9E7F', INK); g.box(.25, rh - .45, .5, .12, 1, 6, '#8C6B4F'); var s = g.P(rw - .12, rh * .4, 30); g.line(g.P(rw - .12, rh * .4, 0), s, '#5A6270', 1.6); g.ell(s[0], s[1], 5, 5, '#3E6FB8', INK); g.line([s[0] - 2.5, s[1]], [s[0] + 2.5, s[1]], '#fff', 1.6);
  };
  var cross = function (g, x, y, z) { var p = g.P(x, y, z); g.line([p[0] - 5, p[1]], [p[0] + 5, p[1]], '#E9573F', 2.4); g.line([p[0], p[1] - 5], [p[0], p[1] + 5], '#E9573F', 2.4); };
  ART.clinic = function (g, rw, rh, lv) {
    var z = 34; g.box(.12, .12, rw - .24, rh - .24, 0, z, '#F4F6F8'); g.winsL(.12, .12, rw - .24, rh - .24, 8, z - 5, 3, 1, { m: .22 }); g.winsR(.12, .12, rw - .24, rh - .24, 8, z - 5, 3, 1, { m: .22 }); g.doorL(.12, .12, rw - .24, rh - .24, .5, 0, .2, 11, '#2E9E7F'); g.flat(.12, .12, rw - .24, rh - .24, z, '#E1E6EC', '#fff');
    g.box(rw * .3, rh * .3, .5, .5, z, z + 8, '#E9573F'); cross(g, rw * .55, rh - .1, z - 3); g.awnL(.12, .12, rw - .24, rh - .24, .36, .64, 14, 3, .2, '#E9573F', '#fff'); g.tree(.12, rh - .1, .6);
  };
  ART.firestation = function (g, rw, rh, lv) {
    var z = 32; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#D9573F'); g.quadL(.1, .1, rw - .2, rh - .2, .1, .52, 0, 20, '#F0F0F0'); var i; for (i = 1; i < 5; i++) g.quadL(.1, .1, rw - .2, rh - .2, .1, .52, i * 4, i * 4 + 1.2, '#C9CED6'); g.winsL(.1, .1, rw - .2, rh - .2, 12, z - 4, 1, 1, { m: .2, skip: function (a) { return false; } }); g.winsR(.1, .1, rw - .2, rh - .2, 8, z - 4, 2, 1, { m: .25 });
    g.flat(.1, .1, rw - .2, rh - .2, z, '#B8483A', '#F2F2F2'); g.box(rw - .65, .15, .4, .4, z, z + 22, '#E4624A'); g.hip(rw - .65, .15, .4, .4, z + 22, z + 30, '#8C3A2E', .1); var s = g.P(rw * .4, rh - .1, z - 4); g.line([s[0] - 12, s[1]], [s[0] + 12, s[1]], '#FFE9A0', 2.6); var p = g.P(rw * .75, rh - .02, 0); g.ell(p[0], p[1], 10, 5, 'rgba(0,0,0,.18)');
  };
  ART.police = function (g, rw, rh, lv) {
    var z = 34; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#8FA8CF'); g.winsL(.1, .1, rw - .2, rh - .2, 8, z - 5, 3, 1, { m: .22 }); g.winsR(.1, .1, rw - .2, rh - .2, 8, z - 5, 3, 1, { m: .22 }); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .2, 11, '#2F4E74'); g.flat(.1, .1, rw - .2, rh - .2, z, '#6F89B3', '#E8EEF8');
    g.box(.1, rh - .22, rw - .2, .12, z - 8, z - 2, '#2F4E74', { noT: true }); var s = g.P(rw * .5, rh - .1, z + 1); g.ell(s[0], s[1] - 12, 5.5, 5.5, '#F2C21B', INK); g.line([s[0], s[1] - 15], [s[0], s[1] - 9], '#2F4E74', 1.8); g.meta.beacon = g.P(rw * .8, rh * .3, z + 6); g.ell(g.meta.beacon[0], g.meta.beacon[1], 2.4, 2.4, '#4F80FF');
  };
  ART.school = function (g, rw, rh, lv) {
    var z = 30; g.box(.1, .12, rw - .2, rh - .24, 0, z, '#F3DA9C'); g.winsL(.1, .12, rw - .2, rh - .24, 8, z - 4, 6, 1, { m: .22 }); g.winsR(.1, .12, rw - .2, rh - .24, 8, z - 4, 2, 1, { m: .25 }); g.flat(.1, .12, rw - .2, rh - .24, z, '#D95A42', '#F2F2F2');
    g.box(rw * .38, rh - .3, rw * .24, .35, 0, z + 10, '#F7E4B0'); g.hip(rw * .38, rh - .3, rw * .24, .35, z + 10, z + 22, '#D95A42', .2); g.doorL(rw * .38, rh - .3, rw * .24, .35, .5, 0, .4, 11, '#7A4B2A'); var cc = g.P(rw * .5, rh + .05, z + 6); g.ell(cc[0], cc[1], 4, 4, '#fff', INK);
    var f = g.P(rw * .9, rh * .4, z); g.line(f, [f[0], f[1] - 26], '#7A7F8A', 1.6); g.meta.flags.push([f[0], f[1] - 26, '#E9573F']);
  };
  ART.library = function (g, rw, rh, lv) {
    var z = 32; g.box(.15, .2, rw - .3, rh - .4, 0, z, '#E9D8BE'); var i; for (i = 0; i < 4; i++) { var t = .12 + i * .25, a = g.pl(.15, .2, rw - .3, rh - .4, t, 0), b = g.pl(.15, .2, rw - .3, rh - .4, t, z - 6); g.poly([[a[0] - 2.6, a[1] + 4], [a[0] + 2.6, a[1] + 4], [b[0] + 2.6, b[1]], [b[0] - 2.6, b[1]]], '#fff', INK, .7); }
    g.poly([g.P(.1, rh - .2 + .05, z - 5), g.P(rw / 2, rh - .2 + .05, z + 10), g.P(rw - .1, rh - .2 + .05, z - 5)], '#CDB88F', INK); g.doorL(.15, .2, rw - .3, rh - .4, .5, 0, .2, 12, '#5C3A22'); g.winsR(.15, .2, rw - .3, rh - .4, 8, z - 5, 2, 1, { m: .3 }); g.box(.12, rh - .15, rw - .24, .15, 0, 3, '#D9D3C4'); g.box(.08, rh - .0, rw - .16, .15, 0, 1.5, '#CFC8B4');
    var s = g.P(rw * .5, rh - .2, z + 2); g.ell(s[0], s[1], 4.4, 4.4, '#7A4BC7', INK);
  };

  /* ═════ GIAI ĐOẠN 2: công trình các quận mới ═════ */
  var rot = function (g, x, y, type, a, b) { var p = g.P(x, y, 0); g.meta.rot.push([p[0], p[1], type, a, b]); };
  var rotAt = function (g, px, py, type, a, b) { g.meta.rot.push([px, py, type, a, b]); };
  var stripe = function (g, x0, y0, w, h, z0, z1, c1, c2, n) { var i; for (i = 0; i < n; i++) g.quadL(x0, y0, w, h, i / n, (i + 1) / n, z0, z1, i % 2 ? c2 : c1); };
  var sign = function (g, x, y, z, w, col, col2) { var p = g.P(x, y, z); g.poly([[p[0] - w, p[1] - 7], [p[0] + w, p[1] - 7], [p[0] + w, p[1] + 4], [p[0] - w, p[1] + 4]], col, INK); if (col2) g.line([p[0] - w * .6, p[1] - 1.5], [p[0] + w * .6, p[1] - 1.5], col2, 2.4); };
  var crates = function (g, x, y, z) { g.box(x, y, .22, .22, z, z + 7, '#C98A4B'); g.box(x + .1, y + .1, .2, .2, z + 7, z + 13, '#E0A860'); };
  // ── Cảng & Công nghiệp ──
  ART.workshop = function (g, rw, rh, lv) {
    var z = 20 + lv * 2; g.box(.08, .12, rw - .16, rh - .24, 0, z, '#C9D3DD'); g.winsL(.08, .12, rw - .16, rh - .24, 6, z - 3, 3, 1, { m: .25 }); g.quadL(.08, .12, rw - .16, rh - .24, .62, .92, 0, 13, '#8896A6', INK); var i; for (i = 1; i < 4; i++) g.quadL(.08, .12, rw - .16, rh - .24, .62, .92, i * 3.2, i * 3.2 + .8, '#6F7C8C');
    g.gable(.08, .12, rw - .16, rh - .24, z, z + 9, true, '#6B7686', { wall: '#C9D3DD' }); g.box(.2, .2, .16, .16, z + 2, z + 18, '#8C5A44'); smoke(g, .28, .28, z + 20); crates(g, rw - .35, rh - .1, 0);
  };
  ART.watertower = function (g, rw, rh, lv) {
    var p = g.P(.5, .5, 0), i; [[.28, .28], [.72, .28], [.28, .72], [.72, .72]].forEach(function (q) { var a = g.P(q[0], q[1], 0), b = g.P(.5 + (q[0] - .5) * .5, .5 + (q[1] - .5) * .5, 40); g.line(a, b, '#6B7686', 2); });
    g.line(g.P(.28, .72, 14), g.P(.72, .72, 14), '#6B7686', 1.4); g.cyl(.5, .5, .3, 40, 62, '#C9D3DD', '#E8EEF4'); g.hip(.3, .3, .4, .4, 62, 72, '#4F80BA', .1); var s = g.P(.5, .8, 50); g.line([s[0] - 5, s[1]], [s[0] + 5, s[1]], '#4F80BA', 3);
  };
  ART.warehouse = function (g, rw, rh, lv) {
    var z = 26 + lv * 2; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#D8D2C2'); g.gable(.1, .1, rw - .2, rh - .2, z, z + 14, true, '#7B8794', { wall: '#D8D2C2' }); g.quadL(.1, .1, rw - .2, rh - .2, .3, .7, 0, 16, '#8C6B4F', INK); var i; for (i = 1; i < 4; i++) g.quadL(.1, .1, rw - .2, rh - .2, .3, .7, i * 4, i * 4 + .8, '#6E5239');
    g.winsR(.1, .1, rw - .2, rh - .2, 12, z - 4, 2, 1, { m: .3 }); crates(g, rw - .3, rh - .15, 0); crates(g, .05, rh - .1, 0);
  };
  ART.fishmarket = function (g, rw, rh, lv) {
    g.poly(g.faceT(.02, .1, rw - .04, rh - .2, 0), '#B9C4CF', INK); g.box(.15, .15, rw - .3, rh - .35, 0, 5, '#9C6B3E'); [.2, rw - .25].forEach(function (x) { var a = g.P(x, rh - .1, 0); g.line(a, [a[0], a[1] - 22], '#8C6B4F', 2); });
    g.awnL(.05, .1, rw - .1, rh - .2, .02, .98, 22, 5, .25, '#4F80BA', '#fff'); var p = g.P(rw * .5, rh - .15, 6); [-8, 0, 8].forEach(function (d, i) { g.ell(p[0] + d, p[1] + 2, 3.4, 1.8, ['#A8C8E8', '#E8A0A0', '#C8D8E0'][i], INK); }); sign(g, rw * .5, rh - .05, 30, 9, '#fff', '#4F80BA');
  };
  ART.crane = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#A9B4C0', INK); g.box(.2, .2, rw - .4, .5, 0, 5, '#7B8794'); var a = g.P(.4, .5, 5), b = g.P(rw - .4, .5, 5), c = g.P(.4, .5, 66), d2 = g.P(rw - .4, .5, 66);
    g.line(a, c, '#F2A22B', 3); g.line(b, d2, '#F2A22B', 3); g.line(c, d2, '#F2A22B', 3); g.line(a, d2, '#F2A22B', 1.6); g.line(b, c, '#F2A22B', 1.6); var arm = g.P(rw + .8, rh * .5 + 0, 62); g.line(c, arm, '#E6901A', 3); g.line(d2, arm, '#E6901A', 1.6); g.line(arm, [arm[0], arm[1] + 22], '#333', 1); g.box(rw + .55, rh * .5 - .12, .3, .24, 2, 10, '#4F80BA'); g.box(.3, rh - .4, .5, .3, 0, 8, '#E9573F'); g.box(.8, rh - .35, .5, .3, 0, 8, '#4F80BA');
  };
  ART.lighthouse = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, .9, .9, 0), '#C9B58A', INK); g.cyl(.5, .5, .3, 0, 20, '#F4F4F4'); g.cyl(.5, .5, .24, 20, 40, '#E9573F'); g.cyl(.5, .5, .2, 40, 56, '#F4F4F4'); g.box(.35, .35, .3, .3, 56, 68, '#FFE9A0'); g.hip(.3, .3, .4, .4, 68, 80, '#E9573F', .2); var p = g.P(.5, .5, 62); g.glow.push({ c: p, r: 22 }); rotAt(g, p[0], p[1], 'beam', 0, 0);
  };
  ART.factory = function (g, rw, rh, lv) {
    var z = 30; g.box(.1, .12, rw - .2, rh - .24, 0, z, '#D7C9B8'); g.winsL(.1, .12, rw - .2, rh - .24, 8, z - 5, 6, 1, { m: .22 }); g.winsR(.1, .12, rw - .2, rh - .24, 8, z - 5, 2, 1, { m: .25 }); g.doorL(.1, .12, rw - .2, rh - .24, .1, 0, .12, 10, '#6B4A2E');
    var n = 3, i; for (i = 0; i < n; i++) { var x0 = .1 + i * (rw - .2) / n; g.gable(x0, .12, (rw - .2) / n, rh - .24, z, z + 9, false, '#8896A6', { wall: '#D7C9B8' }); }
    g.cyl(rw - .35, .3, .12, z, z + 190, '#B25A3C', '#8C4430'); g.cyl(rw - .7, .3, .1, z, z + 150, '#B25A3C', '#8C4430'); var s = g.P(rw - .35, .3, z + 192); g.meta.smoke.push([s[0], s[1], 1.4]); var s2 = g.P(rw - .7, .3, z + 152); g.meta.smoke.push([s2[0], s2[1], 1.1]); g.line(g.P(rw * .4, rh - .1, z - 8), g.P(rw * .6, rh - .1, z - 8), '#E9573F', 2.6);
  };
  ART.containers = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#A9B4C0', INK); var cols = ['#E9573F', '#4F80BA', '#F2C21B', '#2E9E7F', '#8C5BD6'], i, j, k; for (i = 0; i < 2; i++) for (j = 0; j < 2; j++) { var h = 1 + ((i * 3 + j * 2) % 3); for (k = 0; k < h; k++) { g.box(.1 + i * .9, .12 + j * .85, .8, .7, k * 9, k * 9 + 8.5, cols[(i + j * 2 + k) % 5]); } }
  };
  ART.recycling = function (g, rw, rh, lv) {
    var z = 28; g.box(.1, .1, rw - .2, rh - .55, 0, z, '#CFE6C8'); g.gable(.1, .1, rw - .2, rh - .55, z, z + 10, true, '#5B8F4F', { wall: '#CFE6C8' }); g.winsL(.1, .1, rw - .2, rh - .55, 8, z - 5, 3, 1, { m: .25 }); var p = g.P(rw * .5, rh - .4, z - 4); g.ell(p[0], p[1], 7, 7, '#fff', INK); g.line([p[0] - 3, p[1] + 2], [p[0], p[1] - 4], '#2E9E7F', 2); g.line([p[0], p[1] - 4], [p[0] + 3, p[1] + 2], '#2E9E7F', 2); g.line([p[0] + 3, p[1] + 2], [p[0] - 3, p[1] + 2], '#2E9E7F', 2);
    [[.2, rh - .15, '#2E9E7F'], [.55, rh - .1, '#4F80BA'], [.9, rh - .15, '#F2C21B']].forEach(function (q) { g.box(q[0] * rw, q[1], .3, .22, 0, 9, q[2]); });
  };
  ART.coastguard = function (g, rw, rh, lv) {
    var z = 30; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#F4F6F8'); g.quadL(.1, .1, rw - .2, rh - .2, 0, 1, 0, 7, '#F2802B'); g.winsL(.1, .1, rw - .2, rh - .2, 10, z - 4, 3, 1, { m: .22 }); g.winsR(.1, .1, rw - .2, rh - .2, 10, z - 4, 3, 1, { m: .22 }); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .2, 10, '#2F4E74'); g.flat(.1, .1, rw - .2, rh - .2, z, '#E1E6EC', '#F2802B'); g.box(rw * .3, rh * .3, .4, .4, z, z + 14, '#F4F6F8'); g.winsL(rw * .3, rh * .3, .4, .4, z + 3, z + 11, 2, 1, { m: .2 });
    var f = g.P(rw * .5, rh * .5, z + 14); g.line(f, [f[0], f[1] - 18], '#7A7F8A', 1.4); g.meta.flags.push([f[0], f[1] - 18, '#F2802B']);
  };
  ART.shipyard = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#A9B4C0', INK); g.box(.1, .1, rw - .2, rh - .55, 0, 34, '#C9D3DD'); g.gable(.1, .1, rw - .2, rh - .55, 34, 46, true, '#7B8794', { wall: '#C9D3DD' }); g.winsL(.1, .1, rw - .2, rh - .55, 8, 28, 5, 1, { m: .22 });
    var a = g.P(.4, rh - .25, 3), b = g.P(rw - .4, rh - .25, 3); g.poly([[a[0], a[1]], [b[0], b[1]], [b[0] + 12, b[1] - 12], [a[0] - 12, a[1] - 12]], '#8C5A44', INK); g.poly([[a[0] - 12, a[1] - 12], [b[0] + 12, b[1] - 12], [b[0] + 8, b[1] - 20], [a[0] - 8, a[1] - 20]], '#E9573F', INK); g.line(g.P(rw - .3, rh - .15, 0), g.P(rw - .3, rh - .15, 52), '#F2A22B', 3); g.line(g.P(rw - .3, rh - .15, 52), g.P(.8, rh - .15, 48), '#F2A22B', 2);
  };
  ART.powerplant = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#B9C0C8', INK); g.box(.2, rh * .45, rw - .4, rh * .5, 0, 28, '#D8D2C2'); g.winsL(.2, rh * .45, rw - .4, rh * .5, 8, 24, 5, 1, { m: .22 }); g.flat(.2, rh * .45, rw - .4, rh * .5, 28, '#B8B0A0', '#E8E4D8');
    [[.8, .6], [1.9, .8]].forEach(function (q) { g.cyl(q[0], q[1], .5, 0, 130, '#E4E0D4', '#F4F2EA'); var s = g.P(q[0], q[1], 132); g.meta.smoke.push([s[0], s[1], 2.2]); }); g.cyl(rw - .35, rh * .3, .12, 28, 260, '#C9674A', '#E9E3D6'); var t = g.P(rw - .35, rh * .3, 260); g.ell(t[0], t[1], 2.4, 1.4, '#E9573F'); g.line(g.P(.4, rh - .15, 28), g.P(.4, rh - .15, 40), '#F2C21B', 2);
  };
  // ── Du lịch & Giải trí ──
  ART.beachhut = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, .9, .9, 0), '#F3E0AE', false); g.box(.2, .2, .6, .6, 0, 10, '#E8C48A'); g.hip(.1, .1, .8, .8, 10, 24, '#D9A84A', .12); g.doorL(.2, .2, .6, .6, .5, 0, .3, 8, '#7A4B2A'); var p = g.P(.86, .78, 0); g.line(p, [p[0] + 3, p[1] - 22], '#7A4B2A', 2); g.poly([[p[0] + 3, p[1] - 22], [p[0] - 4, p[1] - 14], [p[0] + 9, p[1] - 12]], '#E9573F', INK);
  };
  ART.icecream = function (g, rw, rh, lv) {
    g.box(.15, .15, .7, .7, 0, 16, '#FFD9E6'); g.quadL(.15, .15, .7, .7, .1, .9, 4, 11, '#9FD8F5'); g.awnL(.15, .15, .7, .7, .05, .95, 14, 4, .18, '#FF7AA8', '#fff'); g.flat(.15, .15, .7, .7, 16, '#FFB6CF', '#fff'); var p = g.P(.5, .5, 17); g.poly([[p[0] - 6, p[1]], [p[0] + 6, p[1]], [p[0], p[1] + 16]], '#E8B060', INK); g.ell(p[0], p[1] - 1, 7, 5, '#FF9ABD', INK); g.ell(p[0], p[1] - 7, 5.5, 4, '#FFFFFF', INK); g.ell(p[0], p[1] - 12, 3.4, 3, '#FF5A7A');
  };
  ART.arcade = function (g, rw, rh, lv) {
    var z = 26; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#3C2E6B'); g.quadL(.1, .1, rw - .2, rh - .2, .05, .62, 4, 17, '#6FD0FF'); g.doorL(.1, .1, rw - .2, rh - .2, .8, 0, .16, 10, '#FF4FD8'); g.flat(.1, .1, rw - .2, rh - .2, z, '#2A2150', '#FF4FD8'); var i; for (i = 0; i < 4; i++) g.quadR(.1, .1, rw - .2, rh - .2, .1 + i * .22, .25 + i * .22, 6, 20, ['#FF4FD8', '#2FE6F2', '#F2C21B', '#7CFF8A'][i]); sign(g, rw * .5, rh - .05, z + 8, 11, '#2A2150', '#2FE6F2'); g.glow.push({ c: g.P(rw * .5, rh, z + 6), r: 14 });
  };
  ART.cinema = function (g, rw, rh, lv) {
    var z = 34; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#E4D2C0'); g.quadL(.1, .1, rw - .2, rh - .2, .1, .9, 0, 12, '#4A2E40', INK); g.box(.05, rh - .3, rw - .1, .32, 12, 17, '#E9573F'); var n = 8, i; for (i = 0; i < n; i++) g.quadL(.05, rh - .3, rw - .1, .3, i / n, (i + .5) / n, 12.5, 16.5, '#FFE9A0'); g.glow.push({ c: g.P(rw * .5, rh, 15), r: 16 });
    g.winsR(.1, .1, rw - .2, rh - .2, 10, z - 6, 2, 1, { m: .3 }); g.flat(.1, .1, rw - .2, rh - .2, z, '#B8A790', '#fff'); sign(g, rw * .5, rh - .15, z - 8, 14, '#2A2150', '#FFE9A0'); g.box(.15, .15, .4, .3, z, z + 10, '#C9D3DD'); g.cyl(rw * .75, .3, .14, z, z + 12, '#9AA6B4');
  };
  ART.carousel = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#A8E070', INK); var c = g.P(rw / 2, rh / 2, 0); g.ell(c[0], c[1], 30, 15, '#E8C48A', INK); g.ell(c[0], c[1] - 3, 28, 13.5, '#F5D9A8'); g.line([c[0], c[1] - 3], [c[0], c[1] - 40], '#B8485E', 3); var top = [c[0], c[1] - 40];
    g.poly([[c[0] - 32, c[1] - 24], [c[0], c[1] - 52], [c[0] + 32, c[1] - 24], [c[0] + 28, c[1] - 20], [c[0], c[1] - 24], [c[0] - 28, c[1] - 20]], '#E9573F', INK); stripe(g, 0, 0, 0, 0, 0, 0, '#fff', '#fff', 0); g.ell(top[0], top[1] - 12, 2.4, 2.4, '#F2C21B'); rotAt(g, c[0], c[1] - 3, 'spin', 22, 5);
  };
  ART.bumpercars = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#6B7686', INK); g.poly(g.faceT(.15, .15, rw - .3, rh - .3, 1), '#8FA0B5', '#fff'); [[.4, .5, '#E9573F'], [.9, .9, '#4F80BA'], [1.3, .4, '#F2C21B'], [.6, 1.3, '#2E9E7F']].forEach(function (q) { g.box(q[0], q[1], .3, .22, 1, 8, q[2]); }); [[.15, .15], [rw - .15, .15], [.15, rh - .15], [rw - .15, rh - .15]].forEach(function (q) { var a = g.P(q[0], q[1], 0); g.line(a, [a[0], a[1] - 34], '#5A6270', 2); });
    g.poly([g.P(.1, .1, 34), g.P(rw - .1, .1, 34), g.P(rw - .1, rh - .1, 34), g.P(.1, rh - .1, 34)], 'rgba(255,225,120,.35)', '#FFD84A', 1.6);
  };
  ART.minigolf = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#7FD05C', INK); g.poly(g.faceT(.25, .3, rw - .5, .5, 1), '#4FB04A', '#fff', 1.2); var h = g.P(rw - .45, .55, 1); g.ell(h[0], h[1], 3.4, 1.8, '#222'); g.line(h, [h[0], h[1] - 18], '#7A7F8A', 1.2); g.poly([[h[0], h[1] - 18], [h[0] + 9, h[1] - 14], [h[0], h[1] - 11]], '#E9573F'); g.box(.4, rh - .55, .3, .3, 1, 14, '#E8D8B8'); g.hip(.38, rh - .57, .34, .34, 14, 22, '#E9573F', .1); g.tree(rw - .2, rh - .2, .6);
  };
  ART.circus = function (g, rw, rh, lv) {
    var c = g.P(rw / 2, rh / 2, 0); g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#E8D3A8', INK); g.cyl(rw / 2, rh / 2, .85, 0, 20, '#FFFFFF', '#fff'); var n = 8, i; for (i = 0; i < n; i++) { var a0 = i / n * Math.PI, a1 = (i + 1) / n * Math.PI; var x0 = c[0] - 30 * Math.cos(a0), x1 = c[0] - 30 * Math.cos(a1); g.poly([[x0, c[1] + 12 * Math.sin(a0) - 0], [x1, c[1] + 12 * Math.sin(a1)], [x1, c[1] + 12 * Math.sin(a1) - 20], [x0, c[1] + 12 * Math.sin(a0) - 20]], i % 2 ? '#E9573F' : '#fff', false); }
    g.poly([[c[0] - 32, c[1] - 20], [c[0], c[1] - 52], [c[0] + 32, c[1] - 20], [c[0] + 28, c[1] - 14], [c[0], c[1] - 20], [c[0] - 28, c[1] - 14]], '#4F80BA', INK); g.line([c[0], c[1] - 52], [c[0], c[1] - 66], '#7A7F8A', 1.6); g.meta.flags.push([c[0], c[1] - 66, '#F2C21B']); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .16, 9, '#B8485E');
  };
  ART.pirateship = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#E8D3A8', INK); var a = g.P(.3, rh / 2, 0), b = g.P(rw - .3, rh / 2, 0); g.line(a, [a[0] + 2, a[1] - 52], '#7A4B2A', 4); g.line(b, [b[0] - 2, b[1] - 52], '#7A4B2A', 4); g.line([a[0] + 2, a[1] - 52], [b[0] - 2, b[1] - 52], '#5A3A22', 3); rotAt(g, (a[0] + b[0]) / 2, a[1] - 52, 'swingship', 38, 0);
  };
  ART.waterpark = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#F3E0AE', INK); g.poly(g.faceT(.2, .35, 1.4, 1.6, 1.5), '#5FC8F0', '#fff', 1.4); g.poly(g.faceT(1.8, 1.7, 1.0, 1.0, 1.5), '#7FD8F8', '#fff', 1.4); var a = g.P(2.5, .3, 0); g.box(2.2, .15, .6, .6, 0, 30, '#E9573F'); g.hip(2.15, .1, .7, .7, 30, 38, '#F2C21B', .15); var top = g.P(2.5, .75, 30), bot = g.P(1.5, 1.7, 2); g.c.beginPath(); g.c.moveTo(top[0], top[1]); g.c.bezierCurveTo(top[0] - 36, top[1] + 4, bot[0] + 30, bot[1] - 30, bot[0], bot[1]); g.c.strokeStyle = '#FF7AA8'; g.c.lineWidth = 7; g.c.stroke(); g.c.strokeStyle = '#fff'; g.c.lineWidth = 2; g.c.stroke(); g.ext(top[0] - 40, top[1], 6); g.ext(bot[0], bot[1], 6);
    [[.4, 2.6, '#E9573F'], [.9, 2.7, '#4F80BA'], [2.5, 2.5, '#F2C21B']].forEach(function (q) { var p = g.P(q[0], q[1], 0); g.line(p, [p[0], p[1] - 14], '#7A4B2A', 1.4); g.ell(p[0], p[1] - 15, 9, 3.6, q[2], INK); }); g.tree(.2, .25, .7); g.tree(2.8, 2.7, .7);
  };
  ART.aquarium = function (g, rw, rh, lv) {
    var z = 30; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#CFEFF8'); g.glassL(.1, .1, rw - .2, rh - .2, 5, z - 3, 2, '#5FC8F0'); g.glassR(.1, .1, rw - .2, rh - .2, 5, z - 3, 2, '#4AB0DC'); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .16, 11, '#2F6E9E'); g.flat(.1, .1, rw - .2, rh - .2, z, '#AEDDEE', '#fff');
    var c = g.P(rw * .5, rh * .5, z); g.ell(c[0], c[1] - 8, 24, 14, 'rgba(120,210,245,.85)', INK); g.ell(c[0] - 6, c[1] - 10, 8, 3, 'rgba(255,255,255,.5)'); g.poly([[c[0] - 4, c[1] - 6], [c[0] + 6, c[1] - 9], [c[0] + 2, c[1] - 2]], '#F2802B'); sign(g, rw * .5, rh - .1, z - 10, 10, '#fff', '#2F6E9E');
  };
  ART.ferris = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#E8D3A8', INK); var c = g.P(rw / 2, rh / 2, 0); g.box(.3, rh / 2 - .3, .9, .6, 0, 7, '#B8485E'); var hub = [c[0], c[1] - 56], b1 = g.P(rw / 2 - .8, rh / 2, 0), b2 = g.P(rw / 2 + .8, rh / 2, 0); g.line(b1, hub, '#6B7686', 3); g.line(b2, hub, '#6B7686', 3); g.line([b1[0] + 4, b1[1]], hub, '#8A94A4', 1.4); g.ext(hub[0], hub[1] - 50, 4); rotAt(g, hub[0], hub[1], 'wheel', 44, 10); g.glow.push({ c: hub, r: 30 });
  };
  // ── Học đường ──
  ART.bookstore = function (g, rw, rh, lv) {
    var z = 24; g.box(.1, .1, .8, .8, 0, z, '#F4D9A8'); g.quadL(.1, .1, .8, .8, .08, .6, 3, 15, '#9FD8F5'); g.doorL(.1, .1, .8, .8, .78, 0, .16, 10, '#7A4B2A'); g.awnL(.1, .1, .8, .8, .05, .95, 17, 4, .2, '#2E9E7F', '#fff'); g.gable(.1, .1, .8, .8, z, z + 9, false, '#8C5A44', { wall: '#F4D9A8' }); var p = g.P(.5, 1.0, z - 4); [-4, 0, 4].forEach(function (d, i) { g.poly([[p[0] + d - 2.2, p[1]], [p[0] + d + 2.2, p[1]], [p[0] + d + 2.2, p[1] - 7 - i], [p[0] + d - 2.2, p[1] - 7 - i]], ['#E9573F', '#4F80BA', '#F2C21B'][i], INK, .7); });
  };
  ART.kindergarten = function (g, rw, rh, lv) {
    var z = 24; g.poly(g.faceT(0, 0, rw, rh, 0), '#8ED067', false); g.box(.15, .12, rw - .3, rh - .65, 0, z, '#FFE08A'); g.winsL(.15, .12, rw - .3, rh - .65, 6, z - 4, 3, 1, { m: .25, col: '#FFFFFF' }); g.flat(.15, .12, rw - .3, rh - .65, z, '#FF9AC0', '#fff'); stripe(g, .15, .12, rw - .3, rh - .65, 0, 4, '#FF6FA4', '#7CDFD0', 8); g.doorL(.15, .12, rw - .3, rh - .65, .5, 4, .2, 10, '#B48CFF');
    var p = g.P(rw - .5, rh - .3, 0); g.poly([[p[0], p[1]], [p[0] + 14, p[1] + 6], [p[0] + 14, p[1] - 8], [p[0] + 4, p[1] - 18]], '#F2C21B', INK); g.line(p, [p[0] - 2, p[1] - 18], '#7A4B2A', 2); g.tree(.2, rh - .2, .7, 'cherry');
  };
  ART.lab = function (g, rw, rh, lv) {
    var z = 34; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#E4ECF4'); g.glassL(.1, .1, rw - .2, rh - .2, 6, z - 4, 2, '#7FC0E8'); g.glassR(.1, .1, rw - .2, rh - .2, 6, z - 4, 2, '#5FA8D8'); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .2, 10, '#2E9E7F'); g.flat(.1, .1, rw - .2, rh - .2, z, '#C9D3DD', '#fff'); var p = g.P(rw * .55, rh - .1, z - 6); g.poly([[p[0] - 3, p[1] - 6], [p[0] + 3, p[1] - 6], [p[0] + 6, p[1] + 3], [p[0] - 6, p[1] + 3]], '#7CDFA0', INK); g.line([p[0] - 3, p[1] - 6], [p[0] - 3, p[1] - 11], '#7A7F8A', 1.4); g.line([p[0] + 3, p[1] - 6], [p[0] + 3, p[1] - 11], '#7A7F8A', 1.4); g.cyl(.3, .3, .1, z, z + 18, '#9AA6B4', '#C9D3DD'); var s = g.P(.3, .3, z + 20); g.meta.smoke.push([s[0], s[1], .9]);
  };
  ART.dorm = function (g, rw, rh, lv) {
    var z = 52; g.box(.12, .12, rw - .24, rh - .24, 0, z, '#F2D8B8'); g.winsL(.12, .12, rw - .24, rh - .24, 6, z - 3, 4, 4, { m: .22 }); g.winsR(.12, .12, rw - .24, rh - .24, 6, z - 3, 4, 4, { m: .22 }); var j; for (j = 1; j < 4; j++) g.box(.08, rh - .12, rw - .16, .08, 6 + j * (z - 9) / 4 - 2, 6 + j * (z - 9) / 4, '#fff', { noR: true, noT: true }); g.doorL(.12, .12, rw - .24, rh - .24, .5, 0, .2, 9, '#4C6FA8'); g.flat(.12, .12, rw - .24, rh - .24, z, '#C9A98A', '#F2F2F2'); g.tree(.15, rh - .08, .6);
  };
  ART.artgallery = function (g, rw, rh, lv) {
    var z = 30; g.box(.1, .12, rw - .2, rh - .24, 0, z, '#FFFFFF'); [['#E9573F', .08, .3], ['#4F80BA', .36, .56], ['#F2C21B', .62, .86]].forEach(function (q) { g.quadL(.1, .12, rw - .2, rh - .24, q[1], q[2], 8, 22, q[0], INK); }); g.box(.1, .12, rw - .2, rh - .24, z, z + 5, '#2A2A3A'); g.doorL(.1, .12, rw - .2, rh - .24, .5, 0, .14, 8, '#2A2A3A'); g.winsR(.1, .12, rw - .2, rh - .24, 8, z - 5, 2, 1, { m: .3 }); g.tree(rw - .1, rh - .1, .55, 'cherry');
    var p = g.P(.2, rh, 0); g.cyl(.2, rh + .1, .08, 0, 12, '#D8D8E0'); g.ell(p[0], p[1] - 14, 3.4, 3.4, '#E9573F');
  };
  ART.observatory = function (g, rw, rh, lv) {
    var z = 22; g.box(.12, .12, rw - .24, rh - .24, 0, z, '#E8E4F4'); g.winsL(.12, .12, rw - .24, rh - .24, 6, z - 4, 2, 1, { m: .25 }); g.flat(.12, .12, rw - .24, rh - .24, z, '#D6D0EA', '#fff'); var c = g.P(rw / 2, rh / 2, z); g.ell(c[0], c[1] - 8, 20, 12, '#B8B0DA', INK); g.c.beginPath(); g.c.ellipse(c[0], c[1] - 10, 20, 17, 0, Math.PI, 0, false); g.c.closePath(); g.c.fillStyle = '#F4F2FF'; g.c.fill(); g.c.strokeStyle = INK; g.c.lineWidth = 1; g.c.stroke(); g.ext(c[0], c[1] - 28, 22); g.poly([[c[0] - 2, c[1] - 27], [c[0] + 2, c[1] - 27], [c[0] + 4, c[1] - 8], [c[0] - 4, c[1] - 8]], '#1F2A44', false); g.line([c[0] + 3, c[1] - 14], [c[0] + 18, c[1] - 26], '#7A7F8A', 2.4); g.doorL(.12, .12, rw - .24, rh - .24, .5, 0, .2, 9, '#4C4C8A');
  };
  ART.planetarium = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#E4E0F0', INK); g.cyl(rw / 2, rh / 2, .78, 0, 12, '#F4F2FF', '#fff'); var c = g.P(rw / 2, rh / 2, 12); g.c.beginPath(); g.c.ellipse(c[0], c[1], 28, 34, 0, Math.PI, 0, false); g.c.closePath(); var gr = g.c.createRadialGradient(c[0] - 8, c[1] - 24, 4, c[0], c[1] - 10, 40); gr.addColorStop(0, '#FFFFFF'); gr.addColorStop(1, '#C9C2EA'); g.c.fillStyle = gr; g.c.fill(); g.c.strokeStyle = INK; g.c.lineWidth = 1; g.c.stroke(); g.ext(c[0], c[1] - 34, 30);
    [[-8, -14], [6, -22], [12, -8], [-14, -4]].forEach(function (s) { g.ell(c[0] + s[0], c[1] + s[1], 1.4, 1.4, '#7A5BE0'); }); g.doorL(.05, .05, rw - .1, rh - .1, .5, 0, .2, 8, '#4C4C8A');
  };
  ART.sportshall = function (g, rw, rh, lv) {
    var z = 24; g.box(.1, .12, rw - .2, rh - .24, 0, z, '#DDE6F2'); g.winsL(.1, .12, rw - .2, rh - .24, 6, z - 3, 6, 1, { m: .22 }); g.winsR(.1, .12, rw - .2, rh - .24, 6, z - 3, 2, 1, { m: .25 }); g.gable(.1, .12, rw - .2, rh - .24, z, z + 12, true, '#3A6FB8', { wall: '#DDE6F2' }); g.doorL(.1, .12, rw - .2, rh - .24, .5, 0, .14, 11, '#E9573F'); var p = g.P(rw * .5, rh - .1, z - 3); g.ell(p[0], p[1], 6, 6, '#F29A2E', INK); g.line([p[0] - 6, p[1]], [p[0] + 6, p[1]], INK, 1);
  };
  ART.museum = function (g, rw, rh, lv) {
    var z = 34; g.box(.1, .3, rw - .2, rh - .5, 0, z, '#EFE6D2'); var n = 6, i; for (i = 0; i < n; i++) { var t = .1 + i * .16, a = g.pl(.1, .3, rw - .2, rh - .5, t, 0), b = g.pl(.1, .3, rw - .2, rh - .5, t, z - 5); g.poly([[a[0] - 2.8, a[1] + 4], [a[0] + 2.8, a[1] + 4], [b[0] + 2.8, b[1]], [b[0] - 2.8, b[1]]], '#fff', INK, .7); }
    g.poly([g.P(.05, rh - .2 + .03, z - 4), g.P(rw / 2, rh - .2 + .03, z + 11), g.P(rw - .05, rh - .2 + .03, z - 4)], '#D7CDB4', INK); g.doorL(.1, .3, rw - .2, rh - .5, .5, 0, .18, 12, '#5C3A22'); g.box(.05, rh - .12, rw - .1, .12, 0, 3, '#D9D3C4'); g.box(.0, rh - .02, rw, .1, 0, 1.5, '#CFC8B4'); g.winsR(.1, .3, rw - .2, rh - .5, 8, z - 6, 2, 1, { m: .3 }); g.box(rw * .38, .15, rw * .24, .35, z, z + 12, '#E4D8BC'); g.hip(rw * .38, .15, rw * .24, .35, z + 12, z + 22, '#7A8FA8', .2);
  };
  ART.university = function (g, rw, rh, lv) {
    var z = 38; g.poly(g.faceT(0, 0, rw, rh, 0), '#8ED067', false); g.box(.15, .4, rw - .3, rh - .9, 0, z, '#F0DDB8'); g.winsL(.15, .4, rw - .3, rh - .9, 6, z - 5, 6, 2, { m: .2 }); g.winsR(.15, .4, rw - .3, rh - .9, 6, z - 5, 2, 2, { m: .25 }); g.flat(.15, .4, rw - .3, rh - .9, z, '#B8485E', '#F2F2F2'); g.box(rw * .35, rh * .3, rw * .3, rh * .3, z, z + 22, '#F6E8C8'); g.cyl(rw / 2, rh * .45, .36, z + 22, z + 38, '#E4D2A8', '#F8EED4'); g.hip(rw * .38, rh * .33, rw * .24, rh * .24, z + 38, z + 56, '#4F80BA', .1); g.doorL(.15, .4, rw - .3, rh - .9, .5, 0, .16, 13, '#6B4A2E'); g.box(.2, rh - .4, rw - .4, .12, 0, 3, '#D9D3C4'); g.tree(.2, rh - .15, .8, 'cherry'); g.tree(rw - .2, rh - .15, .8, 'cherry'); var f = g.P(rw / 2, rh * .45, z + 56); g.line(f, [f[0], f[1] - 16], '#7A7F8A', 1.4); g.meta.flags.push([f[0], f[1] - 16, '#E9573F']);
  };
  // ── Phố quốc tế ──
  ART.sushi = function (g, rw, rh, lv) {
    g.box(.12, .12, .76, .76, 0, 18, '#F4E6C8'); g.quadL(.12, .12, .76, .76, .1, .9, 3, 11, '#7A4B2A', INK); [.2, .4, .6, .8].forEach(function (t) { g.quadL(.12, .12, .76, .76, t - .06, t + .06, 3, 11, '#E9573F'); }); g.hip(.05, .05, .9, .9, 18, 28, '#3C4A6B', .1); var p = g.P(.5, .95, 12); g.ell(p[0] + 11, p[1] - 3, 3.6, 4.4, '#E9573F', INK); g.glow.push({ c: [p[0] + 11, p[1] - 3], r: 8 });
  };
  ART.pizzeria = function (g, rw, rh, lv) {
    g.box(.12, .12, .76, .76, 0, 20, '#F6E4CC'); g.quadL(.12, .12, .76, .76, .1, .6, 3, 13, '#9FD8F5'); g.awnL(.12, .12, .76, .76, .05, .95, 15, 4, .2, '#2E9E5B', '#fff'); g.gable(.12, .12, .76, .76, 20, 30, true, '#C9674A', { wall: '#F6E4CC' }); g.cyl(.7, .25, .1, 20, 38, '#B25A3C', '#8C4430'); var s = g.P(.7, .25, 40); g.meta.smoke.push([s[0], s[1], .9]); var p = g.P(.5, 1.0, 11); g.ell(p[0] + 8, p[1] - 6, 5, 5, '#F2C21B', INK); g.ell(p[0] + 8, p[1] - 6, 2.4, 2.4, '#E9573F');
  };
  ART.teahouse = function (g, rw, rh, lv) {
    g.box(.15, .15, .7, .7, 0, 12, '#EAD9BC'); g.winsL(.15, .15, .7, .7, 3, 10, 2, 1, { m: .2 }); g.hip(.0, .0, 1.0, 1.0, 12, 26, '#8C4A3A', .18); g.hip(.15, .15, .7, .7, 26, 34, '#8C4A3A', .2); var f = g.P(.5, .5, 34); g.line(f, [f[0], f[1] - 8], '#C9A06A', 1.6); g.ell(f[0], f[1] - 10, 2, 2.6, '#F2C21B'); g.tree(.9, .9, .5, 'cherry');
  };
  ART.torii = function (g, rw, rh, lv) {
    var a = g.P(.2, .5, 0), b = g.P(.8, .5, 0); g.poly(g.faceT(.05, .2, .9, .6, 0), '#D8D2C2', INK); g.line(a, [a[0] + 1, a[1] - 34], '#D8402A', 4.4); g.line(b, [b[0] - 1, b[1] - 34], '#D8402A', 4.4); g.line([a[0] - 8, a[1] - 34], [b[0] + 8, b[1] - 34], '#D8402A', 5); g.line([a[0] - 5, a[1] - 26], [b[0] + 5, b[1] - 26], '#D8402A', 3); g.line([a[0] - 10, a[1] - 38], [b[0] + 10, b[1] - 38], '#2A2030', 2.4);
  };
  ART.bigclock = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, .9, .9, 0), '#E4DDC8', INK); g.box(.22, .22, .56, .56, 0, 56, '#D9C48A'); g.box(.18, .18, .64, .64, 56, 70, '#C9B070'); g.box(.2, .2, .6, .6, 70, 90, '#D9C48A'); g.hip(.22, .22, .56, .56, 90, 112, '#3E7A6B', .22); g.cyl(.5, .5, .06, 112, 124, '#C9B070'); var c = g.P(.5, .85, 78); g.ell(c[0], c[1], 8.5, 8.5, '#fff', INK); g.line(c, [c[0], c[1] - 5], '#222', 1.4); g.line(c, [c[0] + 4, c[1] + 1], '#222', 1.4); var r = g.P(.85, .5, 78); g.ell(r[0], r[1], 7, 7, '#fff', INK); g.winsL(.22, .22, .56, .56, 10, 40, 1, 2, { m: .3 });
  };
  ART.pagoda = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#D8D2C2', INK); var i, z = 0, w = rw - .5; for (i = 0; i < 4; i++) { var x0 = (rw - w) / 2, hgt = 15; g.box(x0 + .08, x0 + .08, w - .16, w - .16, z, z + hgt, '#D8402A'); g.winsL(x0 + .08, x0 + .08, w - .16, w - .16, z + 3, z + hgt - 2, 2, 1, { m: .25, col: '#FFE9A0' }); g.hip(x0 - .12, x0 - .12, w + .24, w + .24, z + hgt, z + hgt + 9, '#3C4A6B', .25); z += hgt + 7; w *= .8; } var t = g.P(rw / 2, rh / 2, z + 6); g.line(t, [t[0], t[1] - 14], '#E4B84A', 1.6); g.ell(t[0], t[1] - 15, 2.4, 2.4, '#E4B84A');
  };
  ART.windmill = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#8ED067', INK); g.cyl(rw / 2, rh / 2, .55, 0, 40, '#F4EAD6', '#fff'); g.cyl(rw / 2, rh / 2, .5, 40, 54, '#C9674A', '#E08A66'); g.hip(rw / 2 - .4, rh / 2 - .4, .8, .8, 54, 66, '#8C5A44', .1); var c = g.P(rw / 2, rh / 2 + .45, 52); rotAt(g, c[0], c[1], 'blades', 38, 0); g.doorL(rw / 2 - .3, rh / 2 - .3, .6, .6, .5, 0, .3, 9, '#7A4B2A'); g.tree(.2, rh - .15, .8, 'cherry'); var p = g.P(.3, .4, 0); g.ell(p[0], p[1], 5, 2.6, '#F2C21B'); g.ell(p[0] + 7, p[1] + 2, 5, 2.6, '#E9573F');
  };
  ART.greektemple = function (g, rw, rh, lv) {
    var z = 30; g.poly(g.faceT(0, 0, rw, rh, 0), '#EFE9DA', INK); g.box(.1, .1, rw - .2, rh - .2, 0, 4, '#EFE9DA'); g.box(.2, .2, rw - .4, rh - .4, 4, z, '#F6F0E0'); var n = 5, i; for (i = 0; i < n; i++) { var t = .1 + i * .2, a = g.pl(.1, .1, rw - .2, rh - .2, t, 4), b = g.pl(.1, .1, rw - .2, rh - .2, t, z); g.poly([[a[0] - 3, a[1] + 5], [a[0] + 3, a[1] + 5], [b[0] + 3, b[1]], [b[0] - 3, b[1]]], '#fff', INK, .7); }
    g.poly([g.P(.05, rh - .1, z), g.P(rw / 2, rh - .1, z + 14), g.P(rw - .05, rh - .1, z)], '#EDE5CF', INK); g.box(.15, .15, rw - .3, rh - .3, z, z + 3, '#E4DCC6'); g.tree(rw - .1, rh - .1, .6, 'pine');
  };
  ART.irontower = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#D8D2C2', INK); var base = [g.P(.3, .3, 0), g.P(rw - .3, .3, 0), g.P(rw - .3, rh - .3, 0), g.P(.3, rh - .3, 0)], top = g.P(rw / 2, rh / 2, 118), mid = [g.P(.7, .7, 44), g.P(rw - .7, .7, 44), g.P(rw - .7, rh - .7, 44), g.P(.7, rh - .7, 44)], c = '#6A5A4A';
    var i; for (i = 0; i < 4; i++) { g.line(base[i], mid[i], c, 3.4); g.line(mid[i], top, c, 2.2); g.line(base[i], mid[(i + 1) % 4], c, 1.2); } g.line(mid[0], mid[1], c, 2); g.line(mid[1], mid[2], c, 2); g.line(mid[2], mid[3], c, 2); g.line(mid[3], mid[0], c, 2); var m2 = g.P(rw / 2, rh / 2, 62); g.ell(m2[0], m2[1], 9, 4.4, '#8A7A68', INK); g.line(top, [top[0], top[1] - 14], c, 1.6); g.glow.push({ c: top, r: 18 });
  };
  ART.opera = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#E4DDC8', INK); g.box(.1, .1, rw - .2, rh - .3, 0, 8, '#D8D2C2'); var n = 4, i; for (i = 0; i < n; i++) { var x = .3 + i * (rw - .9) / n, p0 = g.P(x, rh * .5, 8), p1 = g.P(x + .55, rh * .5, 8), p2 = g.P(x + .1, rh * .5, 8 + 38 - i * 4); g.poly([[p0[0], p0[1]], [p1[0], p1[1]], [p2[0] + 4, p2[1]]], i % 2 ? '#F4F6F8' : '#FFFFFF', INK); g.poly([[p0[0], p0[1]], [p2[0] + 4, p2[1]], [p0[0] - 12, p0[1] - 22 + i * 4]], '#E4E8F0', INK); }
    g.box(.1, rh - .3, rw - .2, .2, 0, 4, '#B8B0A0'); g.winsL(.1, .1, rw - .2, rh - .3, 2, 7, 5, 1, { m: .3 }); g.tree(.15, rh - .08, .6); g.tree(rw - .15, rh - .08, .6);
  };
  ART.pyramid = function (g, rw, rh, lv) {
    g.poly(g.faceT(0, 0, rw, rh, 0), '#F0DCA0', INK); var A = g.P(.2, .2, 0), Bq = g.P(rw - .2, .2, 0), Cq = g.P(rw - .2, rh - .2, 0), D = g.P(.2, rh - .2, 0), T = g.P(rw / 2, rh / 2, 78); g.poly([D, Cq, T], '#D8B55A', INK); g.poly([Cq, Bq, T], '#EBCB74', INK); g.poly([A, Bq, T], '#C9A04A', INK); var i; for (i = 1; i < 6; i++) { var k = i / 6, L = [D[0] + (T[0] - D[0]) * k, D[1] + (T[1] - D[1]) * k], R = [Cq[0] + (T[0] - Cq[0]) * k, Cq[1] + (T[1] - Cq[1]) * k]; g.line(L, R, 'rgba(120,80,20,.35)', 1); } g.tree(.1, rh - .1, .6, 'pine'); var p = g.P(rw - .3, rh * .8, 0); g.ell(p[0], p[1] - 8, 7, 5, '#C9A04A', INK); g.ell(p[0] + 7, p[1] - 14, 2.6, 3, '#C9A04A', INK);
  };
  ART.liberty = function (g, rw, rh, lv) {
    g.poly(g.faceT(.05, .05, .9, .9, 0), '#D8D2C2', INK); g.box(.25, .25, .5, .5, 0, 24, '#C9C4B4'); g.box(.32, .32, .36, .36, 24, 34, '#B8B2A0'); var c = g.P(.5, .5, 34); g.poly([[c[0] - 8, c[1]], [c[0] + 8, c[1]], [c[0] + 5, c[1] - 30], [c[0] - 5, c[1] - 30]], '#58B89A', INK); g.ell(c[0], c[1] - 34, 5.4, 5.8, '#6AC8A8', INK); [-6, -3, 0, 3, 6].forEach(function (d) { g.line([c[0] + d * .5, c[1] - 38], [c[0] + d * 1.3, c[1] - 46], '#6AC8A8', 1.4); }); g.line([c[0] + 5, c[1] - 24], [c[0] + 12, c[1] - 46], '#58B89A', 3); g.ell(c[0] + 12, c[1] - 49, 2.4, 3.6, '#FFC93C'); g.glow.push({ c: [c[0] + 12, c[1] - 49], r: 9 });
  };
  // ── Sự kiện ──
  ART.lanternarch = function (g, rw, rh, lv) {
    var a = g.P(.15, .5, 0), b = g.P(.85, .5, 0); g.poly(g.faceT(.05, .2, .9, .6, 0), '#D8D2C2', INK); g.line(a, [a[0], a[1] - 34], '#D8402A', 4); g.line(b, [b[0], b[1] - 34], '#D8402A', 4); g.line([a[0] - 6, a[1] - 34], [b[0] + 6, b[1] - 34], '#D8402A', 5); g.line([a[0] - 6, a[1] - 36], [b[0] + 6, b[1] - 36], '#F2C21B', 1.6); [0, .33, .66, 1].forEach(function (t, i) { var x = a[0] + (b[0] - a[0]) * t, y = a[1] - 30; g.ell(x, y + 5, 4, 5, '#E9573F', INK); g.line([x, y], [x, y + 1], '#F2C21B', 1); g.glow.push({ c: [x, y + 5], r: 7 }); });
  };
  ART.peachtree = function (g, rw, rh, lv) {
    var p = g.P(.5, .6, 0); g.ell(p[0], p[1] + 2, 12, 5, 'rgba(30,60,30,.22)'); g.poly([[p[0] - 2, p[1]], [p[0] + 2, p[1]], [p[0] + 1.4, p[1] - 16], [p[0] - 1.4, p[1] - 16]], '#7A4B2A', false); [[-8, -18, 9], [8, -19, 9], [0, -26, 10], [-4, -14, 8], [6, -12, 7]].forEach(function (q, i) { g.ell(p[0] + q[0], p[1] + q[1], q[2], q[2] * .85, i % 2 ? '#FFB3C8' : '#FF8FB0', INK); }); [[-9, -10], [9, -12], [0, -7]].forEach(function (q) { g.line([p[0] + q[0], p[1] + q[1]], [p[0] + q[0], p[1] + q[1] + 6], '#F2C21B', 1); g.poly([[p[0] + q[0] - 2, p[1] + q[1] + 6], [p[0] + q[0] + 2, p[1] + q[1] + 6], [p[0] + q[0] + 2, p[1] + q[1] + 11], [p[0] + q[0] - 2, p[1] + q[1] + 11]], '#E9573F'); });
  };
  ART.moonlantern = function (g, rw, rh, lv) {
    var p = g.P(.5, .6, 0); g.line(p, [p[0], p[1] - 34], '#8C6B4F', 2.4); var t = [p[0], p[1] - 40], i; g.c.beginPath(); for (i = 0; i < 10; i++) { var a = -Math.PI / 2 + i * Math.PI / 5, r = i % 2 ? 6 : 14; g.c.lineTo(t[0] + Math.cos(a) * r, t[1] + Math.sin(a) * r); } g.c.closePath(); g.c.fillStyle = '#FFD84A'; g.c.fill(); g.c.strokeStyle = '#E9573F'; g.c.lineWidth = 1.6; g.c.stroke(); g.ext(t[0], t[1], 16); g.ell(t[0], t[1], 3, 3, '#FF8A3C'); g.glow.push({ c: t, r: 20 });
  };
  ART.rabbitlantern = function (g, rw, rh, lv) {
    var p = g.P(.5, .6, 0); g.line(p, [p[0], p[1] - 28], '#8C6B4F', 2.4); var t = [p[0], p[1] - 34]; g.ell(t[0], t[1] + 4, 9, 7, '#FFFFFF', INK); g.ell(t[0], t[1] - 6, 6, 6, '#FFFFFF', INK); g.ell(t[0] - 3, t[1] - 17, 2, 6, '#FFFFFF', INK); g.ell(t[0] + 3, t[1] - 17, 2, 6, '#FFFFFF', INK); g.ell(t[0] - 2, t[1] - 7, 1, 1, '#E9573F'); g.ell(t[0] + 2, t[1] - 7, 1, 1, '#E9573F'); g.ell(t[0], t[1] + 4, 3, 2.6, '#FFC4D8'); g.glow.push({ c: [t[0], t[1] + 2], r: 16 });
  };
  ART.xmastree = function (g, rw, rh, lv) {
    var p = g.P(.5, .65, 0); g.ell(p[0], p[1] + 2, 12, 5, 'rgba(30,60,30,.22)'); g.box(.44, .56, .12, .12, 0, 6, '#7A4B2A'); [[18, 6, '#2F8F52'], [14, 20, '#3AA662'], [10, 32, '#47B872']].forEach(function (q, i) { g.poly([[p[0] - q[0], p[1] - q[1]], [p[0], p[1] - q[1] - 20], [p[0] + q[0], p[1] - q[1]]], q[2], INK, .9); }); g.ell(p[0], p[1] - 56, 3.4, 3.4, '#F2C21B'); [[-6, -14, '#E9573F'], [5, -24, '#4F80BA'], [-3, -34, '#F2C21B'], [8, -12, '#fff'], [-9, -26, '#fff']].forEach(function (q) { g.ell(p[0] + q[0], p[1] + q[1], 2.2, 2.2, q[2]); g.glow.push({ c: [p[0] + q[0], p[1] + q[1]], r: 5 }); }); g.box(.2, .75, .18, .18, 0, 6, '#E9573F'); g.box(.62, .78, .16, .16, 0, 5, '#4F80BA');
  };
  ART.bigsnowman = function (g, rw, rh, lv) {
    var p = g.P(1, 1, 0); g.ell(p[0], p[1] + 3, 22, 10, 'rgba(60,90,130,.22)'); g.ell(p[0], p[1] - 6, 18, 14, '#F4F8FF', INK); g.ell(p[0], p[1] - 26, 13, 11, '#FFFFFF', INK); g.ell(p[0], p[1] - 42, 9.4, 8.6, '#FFFFFF', INK); g.ell(p[0] - 3, p[1] - 44, 1.4, 1.4, '#222'); g.ell(p[0] + 3, p[1] - 44, 1.4, 1.4, '#222'); g.poly([[p[0], p[1] - 41], [p[0] + 9, p[1] - 39], [p[0], p[1] - 38]], '#F2802B', INK, .6); g.poly([[p[0] - 11, p[1] - 37], [p[0] + 11, p[1] - 37], [p[0] + 11, p[1] - 33], [p[0] - 11, p[1] - 33]], '#E9573F', INK, .7); g.poly([[p[0] - 7, p[1] - 50], [p[0] + 7, p[1] - 50], [p[0] + 5, p[1] - 58], [p[0] - 5, p[1] - 58]], '#2A2A3A', INK); [-6, 0, 6].forEach(function (d) { g.ell(p[0], p[1] - 22 + d * 1.4, 1.6, 1.6, '#222'); });
  };

  /* công trình cố định của thành phố */
  var FX = {};
  FX.plaza = function (g, rw, rh) {
    g.poly(g.faceT(.02, .02, .96, .96, 0), '#EFE9D9', 'rgba(60,40,30,.25)'); var c = g.P(.5, .5, 0); g.ell(c[0], c[1], 17, 8.5, '#E1DAC8', INK); g.ell(c[0], c[1] + 1, 13.5, 6.8, '#62C3EA'); g.cyl(.5, .5, .08, 0, 12, '#EDE8DB'); g.ell(c[0], c[1] - 14, 6, 3, '#DFF3FB', INK); g.meta.water.push([c[0], c[1] - 16]);
    g.box(.06, .08, .22, .12, 0, 4, '#9C6B3E'); g.lamp(.9, .1);
  };
  FX.townhall = function (g, rw, rh) {
    var z = 40; g.poly(g.faceT(0, 0, rw, rh, 0), '#EAE4D4', 'rgba(60,40,30,.25)'); g.box(.2, .3, rw - .4, rh - .65, 0, z, '#F1E8D2'); g.winsL(.2, .3, rw - .4, rh - .65, 8, z - 6, 4, 1, { m: .22 }); g.winsR(.2, .3, rw - .4, rh - .65, 8, z - 6, 3, 1, { m: .25 }); g.flat(.2, .3, rw - .4, rh - .65, z, '#C9B58A', '#fff');
    g.box(rw * .35, rh * .22, rw * .3, rh * .4, z, z + 34, '#F6EEDB'); g.hip(rw * .35, rh * .22, rw * .3, rh * .4, z + 34, z + 56, '#B8485E', .3);
    var c = g.P(rw * .5, rh * .62, z + 20); g.ell(c[0], c[1], 6.5, 6.5, '#fff', INK); g.line(c, [c[0], c[1] - 4], '#333', 1.2); g.line(c, [c[0] + 3, c[1]], '#333', 1.2); g.doorL(.2, .3, rw - .4, rh - .65, .5, 0, .16, 14, '#6B4A2E'); var f = g.P(rw * .5, rh * .42, z + 56); g.line(f, [f[0], f[1] - 20], '#7A7F8A', 1.6); g.meta.flags.push([f[0], f[1] - 20, '#E9573F']);
    var i; for (i = 0; i < 4; i++) { var t = .12 + i * .25, a = g.pl(.2, .3, rw - .4, rh - .65, t, 0), b = g.pl(.2, .3, rw - .4, rh - .65, t, z - 3); g.poly([[a[0] - 2.6, a[1] + 4], [a[0] + 2.6, a[1] + 4], [b[0] + 2.6, b[1]], [b[0] - 2.6, b[1]]], '#fff', INK, .7); } g.tree(.18, rh - .1, .7, 'cherry'); g.tree(rw - .18, rh - .1, .7, 'cherry'); g.lamp(rw * .5, rh - .06);
  };
  FX.clocktower = function (g, rw, rh) {
    g.poly(g.faceT(0, 0, 1, 1, 0), '#EAE4D4', 'rgba(60,40,30,.25)'); g.box(.2, .2, .6, .6, 0, 70, '#D8C9A0'); g.box(.12, .12, .76, .76, 70, 78, '#C9B58A'); g.hip(.2, .2, .6, .6, 78, 100, '#4F80BA', .3); var c = g.P(.5, .95, 52); g.ell(c[0], c[1], 8, 8, '#fff', INK); g.line(c, [c[0], c[1] - 5], '#333', 1.4); g.line(c, [c[0] + 4, c[1]], '#333', 1.4); g.winsL(.2, .2, .6, .6, 6, 30, 1, 1, { m: .3 }); g.winsR(.2, .2, .6, .6, 6, 30, 1, 1, { m: .3 });
  };

  FX.bigplaza = function (g, rw, rh) { FX.plaza(g, rw, rh); };
  /* công trường */
  function scaffold(g, rw, rh) {
    g.poly(g.faceT(.05, .05, rw - .1, rh - .1, 0), '#C9A872', INK); g.poly(g.faceT(.3, .3, rw - .6 < .2 ? .3 : rw - .6, rh - .6 < .2 ? .3 : rh - .6, 0), '#B8935C', false);
    [[.1, .1], [rw - .1, .1], [rw - .1, rh - .1], [.1, rh - .1]].forEach(function (q) { var p = g.P(q[0], q[1], 0); g.line(p, [p[0], p[1] - 10], '#8C6B4F', 2); });
    g.line(g.P(.1, rh - .1, 8), g.P(rw - .1, rh - .1, 8), '#F2C21B', 2.4); g.line(g.P(rw - .1, rh - .1, 8), g.P(rw - .1, .1, 8), '#F2C21B', 2.4); g.line(g.P(.1, rh - .1, 5), g.P(rw - .1, rh - .1, 5), '#333', 1);
    g.box(rw * .3, rh * .3, Math.min(.5, rw * .4), Math.min(.5, rh * .4), 0, 6, '#C9674A'); var p = g.P(rw * .75, rh * .25, 0); g.line(p, [p[0], p[1] - 34 - rh * 6], '#F2C21B', 2.6); g.meta.crane.push([p[0], p[1] - 34 - rh * 6]);
  }
  ART.__scaffold = scaffold;

  /* ───── tạo sprite ───── */
  var spriteCache = {}, tmp = null;
  function makeSprite(fn, rw, rh, lv) {
    var padX = 40, W0 = ((rw + rh) * HW + 140) * SS, H0 = ((rw + rh) * HH + 1140) * SS;
    if (!tmp) tmp = document.createElement('canvas'); if (tmp.width < W0 || tmp.height < H0) { tmp.width = Math.max(tmp.width, W0); tmp.height = Math.max(tmp.height, H0); }
    var ctx = tmp.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, tmp.width, tmp.height); ctx.scale(SS, SS);
    var ox = rh * HW + 70, oy = 1100, g = new Gfx(ctx, ox, oy);
    fn(g, rw, rh, lv);
    var b = g.b, x0 = Math.max(0, Math.floor(b.x0 - 3)), y0 = Math.max(0, Math.floor(b.y0 - 3)), x1 = Math.ceil(b.x1 + 3), y1 = Math.ceil(b.y1 + 3), w = x1 - x0, h = y1 - y0;
    var cv = document.createElement('canvas'); cv.width = w * SS; cv.height = h * SS; cv.getContext('2d').drawImage(tmp, x0 * SS, y0 * SS, w * SS, h * SS, 0, 0, w * SS, h * SS);
    // lớp ánh sáng ban đêm (cửa sổ + đèn)
    var gl = null;
    if (g.glow.length) {
      gl = document.createElement('canvas'); gl.width = w * SS; gl.height = h * SS; var gc = gl.getContext('2d'); gc.scale(SS, SS); gc.translate(-x0, -y0);
      g.glow.forEach(function (q) { if (q.c) { var gr = gc.createRadialGradient(q.c[0], q.c[1], 0, q.c[0], q.c[1], q.r); gr.addColorStop(0, 'rgba(255,230,150,.85)'); gr.addColorStop(1, 'rgba(255,230,150,0)'); gc.fillStyle = gr; gc.beginPath(); gc.arc(q.c[0], q.c[1], q.r, 0, 7); gc.fill(); } else { gc.beginPath(); q.forEach(function (p, i) { i ? gc.lineTo(p[0], p[1]) : gc.moveTo(p[0], p[1]); }); gc.closePath(); gc.fillStyle = '#FFC95A'; gc.fill(); } });
    }
    var shift = function (p) { return [p[0] - x0, p[1] - y0]; }, m = g.meta, mm = {}; Object.keys(m).forEach(function (k) { mm[k] = Array.isArray(m[k][0]) || !m[k].length ? m[k].map(function (q) { return [q[0] - x0, q[1] - y0].concat(q.slice(2)); }) : [m[k][0] - x0, m[k][1] - y0]; });
    return { c: cv, glow: gl, w: w, h: h, ox: ox - x0, oy: oy - y0, meta: mm, hpx: oy - b.y0 };
  }
  function getSprite(kind, k, lv, rw, rh) {
    var key = kind + k + '|' + lv + '|' + rw + 'x' + rh; if (spriteCache[key]) return spriteCache[key];
    var fn = kind === 'f' ? FX[k] : kind === 's' ? ART.__scaffold : ART[k]; if (!fn) fn = ART.tree;
    return (spriteCache[key] = makeSprite(fn, rw, rh, lv));
  }
  var blank = null;
  function has(kind, k, lv, rw, rh) { return !!spriteCache[kind + k + '|' + lv + '|' + rw + 'x' + rh]; }
  function placeholder() { if (!blank) { var cv = document.createElement('canvas'); cv.width = 2; cv.height = 2; blank = { c: cv, glow: null, w: 1, h: 1, ox: 0, oy: 0, meta: {}, hpx: 0, ph: true }; } return blank; }
  var API = { HW: HW, HH: HH, SS: SS, shade: shade, getSprite: getSprite, has: has, placeholder: placeholder, ART: ART, FX: FX, Gfx: Gfx,
    thumb: function (k, size, lv) { var C = root.EWTCityData, it = C.BY[k], sp = getSprite('b', k, lv || 1, it.w, it.h), cv = document.createElement('canvas'), s = Math.min(size / sp.w, size / sp.h) * 1; cv.width = size; cv.height = size; var c = cv.getContext('2d'); c.imageSmoothingQuality = 'high'; c.drawImage(sp.c, (size - sp.w * s) / 2, (size - sp.h * s) / 2, sp.w * s, sp.h * s); return cv; } };
  root.EWTCityArt = API;
})(typeof window !== 'undefined' ? window : this);
