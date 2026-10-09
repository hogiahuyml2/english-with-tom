/* EWT City — ĐỒ HOẠ công trình vẽ bằng Canvas (tự vẽ, không dùng ảnh ngoài). Mỗi công trình được vẽ MỘT lần thành "sprite" rồi dán lên bản đồ → rất nhẹ khi có hàng trăm công trình.
   Hệ toạ độ: ô lưới (cx,cy) so với góc trên của chân công trình; P() đổi sang pixel xiên 2.5D (ô rộng 64, cao 32); z là độ cao pixel. */
(function (root) {
  'use strict';
  var HW = 32, HH = 16, SS = 2;                       // SS: độ nét sprite (vẽ gấp đôi rồi thu nhỏ khi dán)
  var hex = function (h) { h = h.replace('#', ''); if (h.length === 3) h = h.replace(/./g, '$&$&'); return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)]; };
  var cache = {};
  function shade(c, f) { var k = c + f; if (cache[k]) return cache[k]; var a = hex(c), r = Math.max(0, Math.min(255, Math.round(a[0] * f))), g = Math.max(0, Math.min(255, Math.round(a[1] * f))), b = Math.max(0, Math.min(255, Math.round(a[2] * f))); return (cache[k] = 'rgb(' + r + ',' + g + ',' + b + ')'); }
  var INK = 'rgba(40,28,60,.38)';

  function Gfx(ctx, ox, oy) { this.c = ctx; this.ox = ox; this.oy = oy; this.b = { x0: 1e9, y0: 1e9, x1: -1e9, y1: -1e9 }; this.glow = []; this.meta = { smoke: [], flags: [], water: [], duck: [], crane: [], swing: [] }; }
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
    var z = 44 + lv * 12, wall = lv === 1 ? WALL[7] : lv === 2 ? WALL[6] : WALL[3];
    g.box(.15, .15, rw - .3, rh - .3, 0, z, wall); g.winsL(.15, .15, rw - .3, rh - .3, 4, z - 3, 4, 3 + lv, { m: .22 }); g.winsR(.15, .15, rw - .3, rh - .3, 4, z - 3, 4, 3 + lv, { m: .22 });
    var j; for (j = 1; j < 3 + lv; j++) { g.box(.1, rh - .15, rw - .2, .08, 4 + j * (z - 7) / (3 + lv) - 2, 4 + j * (z - 7) / (3 + lv), '#FFFFFF', { noR: true, noT: true }); }
    g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .2, 9, '#4C6FA8'); g.flat(.15, .15, rw - .3, rh - .3, z, shade(wall, 1.05), '#E8E8E8'); g.box(rw * .35, rh * .3, .4, .3, z, z + 7, '#C9CED6'); g.cyl(rw * .75, rh * .65, .18, z, z + 10, '#8FA0B5');
  };
  ART.condo = function (g, rw, rh, lv) {
    var z = 90 + lv * 20;
    g.box(.1, .1, rw - .2, rh - .2, 0, 14, '#F3F0E8'); g.box(.25, .25, rw - .5, rh - .5, 14, z, '#DDE6F2'); g.glassL(.25, .25, rw - .5, rh - .5, 16, z - 4, 6 + lv * 2, '#7FC0E8'); g.glassR(.25, .25, rw - .5, rh - .5, 16, z - 4, 6 + lv * 2, '#5FA8D8');
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
    var z = 70 + lv * 14; g.box(.12, .12, rw - .24, rh - .24, 0, z, '#CED7E3'); g.glassL(.12, .12, rw - .24, rh - .24, 10, z - 4, 6 + lv, '#6FB5E3'); g.glassR(.12, .12, rw - .24, rh - .24, 10, z - 4, 6 + lv, '#4F96CC');
    g.doorL(.12, .12, rw - .24, rh - .24, .5, 0, .24, 9, '#2F4E74'); g.flat(.12, .12, rw - .24, rh - .24, z, '#B8C3D2', '#E2E8F0'); g.box(rw * .3, rh * .3, .35, .3, z, z + 8, '#9FAABA'); g.line(g.P(rw * .7, rh * .3, z), g.P(rw * .7, rh * .3, z + 24), '#6B7686', 1.4);
  };
  ART.hotel = function (g, rw, rh, lv) {
    var z = 62 + lv * 10; g.box(.15, .15, rw - .3, rh - .3, 0, z, '#F3E3C3'); g.winsL(.15, .15, rw - .3, rh - .3, 10, z - 3, 4, 5 + lv, { m: .2, col: '#A7DDF5' }); g.winsR(.15, .15, rw - .3, rh - .3, 10, z - 3, 4, 5 + lv, { m: .2 });
    g.box(.05, rh - .35, rw - .1, .4, 0, 8, '#B8485E'); g.awnL(.15, .15, rw - .3, rh - .3, .3, .7, 12, 4, .4, '#B8485E', '#F2C21B'); g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .18, 9, '#3B2A1E'); g.flat(.15, .15, rw - .3, rh - .3, z, '#E7D3A9', '#fff'); var s = g.P(rw * .5, rh * .6, z + 14); g.poly([[s[0] - 20, s[1] - 6], [s[0] + 20, s[1] - 6], [s[0] + 20, s[1] + 7], [s[0] - 20, s[1] + 7]], '#B8485E', INK); g.line([s[0] - 12, s[1]], [s[0] + 12, s[1]], '#FFE9A0', 2.4);
  };
  ART.mall = function (g, rw, rh, lv) {
    var z = 40 + lv * 4; g.poly(g.faceT(0, 0, rw, rh, 0), '#A8B0BA', false); g.box(.1, .1, rw - .2, rh - .4, 0, z, '#F2E6F6'); g.glassL(.1, .1, rw - .2, rh - .4, 5, z - 4, 3, '#8FD0F0'); g.glassR(.1, .1, rw - .2, rh - .4, 5, z - 4, 3, '#6FB8E0');
    g.box(rw * .3, rh * .22, rw * .4, rh * .3, z, z + 16, '#BFE6F5'); g.winsL(rw * .3, rh * .22, rw * .4, rh * .3, z + 2, z + 14, 3, 1, { m: .2 }); g.doorL(.1, .1, rw - .2, rh - .4, .5, 0, .2, 14, '#2F4E74'); var s = g.P(rw * .5, rh - .28, z + 4); g.poly([[s[0] - 22, s[1] - 8], [s[0] + 22, s[1] - 8], [s[0] + 22, s[1] + 5], [s[0] - 22, s[1] + 5]], '#7A4BC7', INK); g.line([s[0] - 14, s[1] - 1], [s[0] + 14, s[1] - 1], '#fff', 2.6);
    [[.2, rh - .12], [.5, rh - .1], [.8, rh - .12]].forEach(function (q) { g.tree(rw * q[0], q[1], .55); }); g.flat(.1, .1, rw - .2, rh - .4, z, '#D7C4E6', '#fff');
  };
  ART.skyscraper = function (g, rw, rh, lv) {
    var z = 200 + lv * 24, w1 = rw - .3, h1 = rh - .3; g.box(.15, .15, w1, h1, 0, z * .55, '#9DB7D5'); g.box(.45, .45, w1 - .6, h1 - .6, z * .55, z, '#8EAACB'); g.box(.75, .75, w1 - 1.2, h1 - 1.2, z, z + 30, '#7E9BBE');
    g.glassL(.15, .15, w1, h1, 12, z * .55 - 3, 12, '#6FB5E3'); g.glassR(.15, .15, w1, h1, 12, z * .55 - 3, 12, '#4F96CC'); g.glassL(.45, .45, w1 - .6, h1 - .6, z * .55 + 2, z - 3, 8, '#7EC0EC'); g.glassR(.45, .45, w1 - .6, h1 - .6, z * .55 + 2, z - 3, 8, '#5AA2D4'); g.glassL(.75, .75, w1 - 1.2, h1 - 1.2, z + 2, z + 27, 3, '#8ACBF0'); g.glassR(.75, .75, w1 - 1.2, h1 - 1.2, z + 2, z + 27, 3, '#62A9DB');
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
    var padX = 40, W0 = ((rw + rh) * HW + 140) * SS, H0 = ((rw + rh) * HH + 560) * SS;
    if (!tmp) tmp = document.createElement('canvas'); if (tmp.width < W0 || tmp.height < H0) { tmp.width = Math.max(tmp.width, W0); tmp.height = Math.max(tmp.height, H0); }
    var ctx = tmp.getContext('2d'); ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, tmp.width, tmp.height); ctx.scale(SS, SS);
    var ox = rh * HW + 70, oy = 520, g = new Gfx(ctx, ox, oy);
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
