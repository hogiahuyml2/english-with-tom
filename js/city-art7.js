/* EWT City — ĐỒ HOẠ phần 7: kiến trúc hiện đại mới lạ lấy cảm hứng từ các toà nhà nổi tiếng thế giới (tháp xoắn, cổng trời, tháp kim, nhà vỏ sò,
   tháp đôi nối cầu kính, kim tự tháp kính, nhà hoa sen, cổng vòm…). Khuôn tham số hoá + bảng R('mã','kiểu',{màu}) ở cuối file. */
(function (root) {
  'use strict';
  var A = root.EWTCityArt; if (!A || !A.kit || !A.kit6) return;
  var K = A.kit, lot = K.lot, def = K.def, INK = K.INK, shade = A.shade, K6 = A.kit6, dome = K6.dome, cone = K6.cone, big = K6.big, sh = K6.sh, TAU = Math.PI * 2, HW = 32, HH = 16;
  var Y = {};
  var beaconAt = function (g, cx, cy, z) { var p = g.P(cx, cy, z); g.ell(p[0], p[1], 2.4, 2.4, '#FF5A5A'); g.meta.beacon = p; };
  var slab = function (g, x, y, w, h, z0, z1, wall, glass, rows) {
    g.box(x, y, w, h, z0, z1, wall); g.glassL(x, y, w, h, z0 + 2, z1 - 2, rows || Math.max(2, Math.round((z1 - z0) / 12)), glass); g.glassR(x, y, w, h, z0 + 2, z1 - 2, rows || Math.max(2, Math.round((z1 - z0) / 12)), glass);
  };
  var podium = function (g, rw, rh, p, z) { lot(g, rw, rh, p.lot || '#B9B3A6'); g.box(.08, .08, rw - .16, rh - .16, 0, z || 8, p.base || '#EEF2F6'); };
  var hgt = function (rw, rh, lv, p) { return (p.h || 70) + lv * 12 + big(rw, rh) * 3; };

  Y.stacked = function (g, rw, rh, lv, p) {   // các hộp xếp lệch như núi nhà
    podium(g, rw, rh, p, 6); var n = 4 + (lv > 1 ? 1 : 0), i, hh = 15 + lv * 2 + big(rw, rh), z = 6;
    for (i = 0; i < n; i++) {
      var w = (rw - .6) * (.92 - i * .1), d = (rh - .6) * (.9 - i * .08), x = .3 + (i % 2 ? (rw - .6) - w : 0) * .8, y = .3 + (i % 2 ? 0 : (rh - .6) - d) * .6;
      slab(g, x, y, w, d, z, z + hh, i % 2 ? p.c2 || '#E8E4D8' : p.c1 || '#F6F0E0', p.glass || '#8FD0F0', 1); g.flat(x, y, w, d, z + hh, '#7CC25F', '#5BAE55'); g.tree(x + w * .5, y + d * .5, .35, 'oak'); z += hh;
    }
    var t = g.P(rw / 2, rh / 2, z); g.line(t, [t[0], t[1] - 12], '#9AA4B2', 1.4); beaconAt(g, rw / 2, rh / 2, z + 14);
  };
  Y.gate = function (g, rw, rh, lv, p) {   // hai tháp nối bằng khung cổng trên cao
    podium(g, rw, rh, p, 6); var z = hgt(rw, rh, lv, p), tw = (rw - .6) * .3;
    slab(g, .3, .3, tw, rh - .6, 6, z, p.c1 || '#DCE3EC', p.glass || '#8FD0F0'); slab(g, rw - .3 - tw, .3, tw, rh - .6, 6, z, p.c1 || '#DCE3EC', p.glass || '#8FD0F0');
    slab(g, .3, .3, rw - .6, rh - .6, z - 26, z, p.c2 || '#F6F0E0', p.glass || '#8FD0F0', 2); g.flat(.3, .3, rw - .6, rh - .6, z, '#E8EDF2', '#fff');
    var c = g.P(rw / 2, rh / 2, z - 13); g.ell(c[0], c[1], (rw - 1.2) * 14, 7 + rh * 2, 'rgba(255,255,255,.18)', false); beaconAt(g, rw * .25, rh / 2, z + 10); g.line(g.P(rw * .25, rh / 2, z), g.P(rw * .25, rh / 2, z + 10), '#9AA4B2', 1.4);
  };
  Y.lean = function (g, rw, rh, lv, p) {   // tháp nghiêng từng tầng
    podium(g, rw, rh, p, 6); var n = 7, i, hh = (hgt(rw, rh, lv, p) - 6) / n, w = rw * .52, d = rh * .5, z = 6, dx = (rw - .6 - w) / (n - 1);
    for (i = 0; i < n; i++) { var x = .3 + i * dx * .9; slab(g, x, (rh - d) / 2, w, d, z, z + hh, i % 2 ? p.c1 || '#E4D8F5' : p.c2 || '#C9B8EB', p.glass || '#B9A0F0', 1); z += hh; }
    g.flat(.3 + (n - 1) * dx * .9, (rh - d) / 2, w, d, z, '#EEF2F6', '#fff'); beaconAt(g, .3 + (n - 1) * dx * .9 + w / 2, rh / 2, z + 12);
  };
  Y.hyper = function (g, rw, rh, lv, p) {   // tháp eo thắt kiểu Canton
    lot(g, rw, rh, p.lot || '#B9B3A6'); var cx = rw / 2, cy = rh / 2, n = 10, z = 0, hh = (hgt(rw, rh, lv, p)) / n, R0 = Math.min(rw, rh) * .34, i;
    g.cyl(cx, cy, R0 * 1.25, 0, 8, p.base || '#EEF2F6');
    for (i = 0; i < n; i++) { var t = i / (n - 1), r = R0 * (.5 + .5 * Math.pow(Math.abs(t - .45) * 2, 1.4)) * .9 + R0 * .18; g.cyl(cx, cy, r, 8 + z, 8 + z + hh + 1, i % 2 ? p.c1 || '#DCE3EC' : p.c2 || '#8FD0F0'); z += hh; }
    var top = g.P(cx, cy, 8 + z); g.line(top, [top[0], top[1] - 34 - lv * 6], '#9AA4B2', 2); beaconAt(g, cx, cy, 8 + z + 36 + lv * 6);
    var pd = g.P(cx, cy, 8 + z * .66); g.ell(pd[0], pd[1], R0 * 38, R0 * 8, 'rgba(255,230,140,.55)', false);
  };
  Y.sails = function (g, rw, rh, lv, p) {   // nhà vỏ sò kiểu nhà hát
    lot(g, rw, rh, p.lot || '#6FC8F2'); g.box(.15, .2, rw - .3, rh - .4, 0, 8, p.base || '#EDEAE0'); var n = Math.max(3, Math.round(rw * 1.1)), i, H = 44 + lv * 10 + big(rw, rh) * 3;
    for (i = 0; i < n; i++) {
      var t = i / (n - 1), x = .3 + t * (rw - .6), sc = 1 - Math.abs(t - .4) * .7, hh = H * sc, b = g.P(x, rh * (.55 - t * .2), 8), wd = (10 + rw * 3.4) * sc + 6;
      g.poly([[b[0] - wd, b[1]], [b[0] + wd * .2, b[1] - hh], [b[0] + wd, b[1]]], i % 2 ? p.c1 || '#FFFFFF' : p.c2 || '#F2F2F2', INK); g.poly([[b[0], b[1]], [b[0] + wd * .2, b[1] - hh], [b[0] + wd, b[1]]], shade('#E8E8E8', .9), false);
    }
    var s = g.P(rw / 2, rh - .1, 0); for (i = 0; i < 6; i++) g.line([s[0] - 20 + i * 8, s[1]], [s[0] - 24 + i * 9, s[1] + 6], '#B9B3A6', 1.4);
  };
  Y.sphere = function (g, rw, rh, lv, p) {   // quả cầu trên trụ
    lot(g, rw, rh, p.lot || '#B9B3A6'); var cx = rw / 2, cy = rh / 2, R = Math.min(rw, rh) * .36, z = 24 + lv * 5 + big(rw, rh);
    g.box(cx - R * .5, cy - R * .5, R, R, 0, 10, p.base || '#EEF2F6'); [[-1, -1], [1, -1], [1, 1], [-1, 1]].forEach(function (q) { g.cyl(cx + q[0] * R * .55, cy + q[1] * R * .55, .07, 10, z, '#9AA4B2'); });
    var c = g.P(cx, cy, z + R * 20), rr = R * HW * 1.05; var gr = g.c.createRadialGradient(c[0] - rr * .35, c[1] - rr * .35, rr * .1, c[0], c[1], rr); gr.addColorStop(0, '#fff'); gr.addColorStop(.4, p.c1 || '#8FD0F0'); gr.addColorStop(1, shade(p.c1 || '#8FD0F0', .6));
    g.c.beginPath(); g.c.arc(c[0], c[1], rr, 0, TAU); g.c.fillStyle = gr; g.c.fill(); g.c.strokeStyle = INK; g.c.stroke(); g.ext(c[0], c[1], rr + 2);
    g.ell(c[0], c[1], rr * 1.35, rr * .26, false, p.c2 || '#FFD84A'); g.c.strokeStyle = p.c2 || '#FFD84A'; g.c.lineWidth = 2; g.c.beginPath(); g.c.ellipse(c[0], c[1], rr * 1.35, rr * .26, 0, 0, TAU); g.c.stroke();
    g.glow.push({ c: [c[0], c[1]], r: rr * 1.2 });
  };
  Y.twinbridge = function (g, rw, rh, lv, p) {   // tháp đôi nối cầu kính
    podium(g, rw, rh, p, 8); var z = hgt(rw, rh, lv, p), tw = (rw - .6) * .36, zb = z * .62;
    slab(g, .3, .3, tw, rh - .6, 8, z, p.c1 || '#DCE3EC', p.glass || '#8FD0F0'); slab(g, rw - .3 - tw, .3, tw, rh - .6, 8, z * .92, p.c2 || '#E8E4D8', p.glass || '#8FD0F0');
    g.box(.3 + tw, rh * .4, rw - .6 - 2 * tw, rh * .2, zb, zb + 12, p.glass || '#8FD0F0'); g.flat(.3 + tw, rh * .4, rw - .6 - 2 * tw, rh * .2, zb + 12, '#EEF2F6', '#fff');
    g.flat(.3, .3, tw, rh - .6, z, '#EEF2F6', '#fff'); g.flat(rw - .3 - tw, .3, tw, rh - .6, z * .92, '#EEF2F6', '#fff'); beaconAt(g, .3 + tw / 2, rh / 2, z + 12); g.line(g.P(.3 + tw / 2, rh / 2, z), g.P(.3 + tw / 2, rh / 2, z + 12), '#9AA4B2', 1.4);
  };
  Y.glasspyr = function (g, rw, rh, lv, p) {   // kim tự tháp kính
    lot(g, rw, rh, p.lot || '#E8E4D8'); var H2 = 34 + lv * 8 + big(rw, rh) * 2; g.box(.2, .2, rw - .4, rh - .4, 0, 5, p.base || '#EEF2F6');
    g.hip(.3, .3, rw - .6, rh - .6, 5, 5 + H2, p.glass || '#9AD8F2', .5);
    var q = g.P(rw / 2, rh / 2, 5); g.line([q[0] - 28, q[1] - 2], [q[0], q[1] - H2], 'rgba(255,255,255,.7)', 1.1); g.line([q[0] + 28, q[1] - 2], [q[0], q[1] - H2], 'rgba(255,255,255,.7)', 1.1); g.line([q[0], q[1] + 12], [q[0], q[1] - H2], 'rgba(255,255,255,.5)', 1.1);
    [[.35, rh - .25], [rw - .35, rh - .25]].forEach(function (c2) { g.hip(c2[0] - .2, c2[1] - .2, .4, .4, 0, 12, p.glass || '#9AD8F2', .5); });
  };
  Y.wave = function (g, rw, rh, lv, p) {   // mái sóng
    lot(g, rw, rh, p.lot || '#B8E08A'); g.box(.15, .2, rw - .3, rh - .4, 0, 12 + lv * 2, p.c1 || '#F2F2F2'); g.glassL(.15, .2, rw - .3, rh - .4, 3, 10 + lv * 2, 1, p.glass || '#8FD0F0'); g.glassR(.15, .2, rw - .3, rh - .4, 3, 10 + lv * 2, 1, p.glass || '#8FD0F0');
    var z = 12 + lv * 2, r, cols = [p.c2 || '#FFFFFF', p.c1 || '#F2F2F2', p.c2 || '#FFFFFF'];
    for (r = 0; r < 3; r++) {
      var t = .22 + r * .28, s0 = g.P(.2, rh * t, z), s1 = g.P(rw - .2, rh * t, z), mid = [(s0[0] + s1[0]) / 2, (s0[1] + s1[1]) / 2 - 20 - lv * 4 - big(rw, rh)];
      g.c.lineCap = 'round'; g.c.strokeStyle = INK; g.c.lineWidth = 10; g.c.beginPath(); g.c.moveTo(s0[0], s0[1]); g.c.quadraticCurveTo(mid[0], mid[1], s1[0], s1[1]); g.c.stroke();
      g.c.strokeStyle = cols[r]; g.c.lineWidth = 8; g.c.beginPath(); g.c.moveTo(s0[0], s0[1]); g.c.quadraticCurveTo(mid[0], mid[1], s1[0], s1[1]); g.c.stroke(); g.ext(mid[0], mid[1], 16);
    }
    g.doorL(.15, .2, rw - .3, rh - .4, .5, 0, .2, 9, '#3E5C86'); g.tree(.2, rh - .15, .6, 'cherry'); g.tree(rw - .2, rh - .15, .6);
  };
  Y.petal = function (g, rw, rh, lv, p) {   // nhà hoa sen
    lot(g, rw, rh, p.lot || '#6FC8F2'); var cx = rw / 2, cy = rh / 2, R = Math.min(rw, rh) * .38, c = g.P(cx, cy, 0), i, n = 9, z = 40 + lv * 8 + big(rw, rh) * 2;
    g.ell(c[0], c[1], R * 46, R * 23, p.base || '#EEF2F6', INK);
    for (i = 0; i < n; i++) { var a = i * TAU / n + .3, bx = c[0] + Math.cos(a) * R * 30, by = c[1] + Math.sin(a) * R * 15, tx = c[0] + Math.cos(a) * R * 6, ty = c[1] + Math.sin(a) * R * 3 - z * (.8 + .2 * Math.sin(i * 2));
      var nx = -Math.sin(a) * 10, ny = Math.cos(a) * 5; g.poly([[bx - nx, by - ny], [tx, ty], [bx + nx, by + ny]], i % 2 ? p.c1 || '#FFFFFF' : p.c2 || '#FADCEA', INK); }
    for (i = 0; i < 5; i++) { var a2 = i * TAU / 5 + .9; g.poly([[c[0] + Math.cos(a2) * R * 12 - 7, c[1] + Math.sin(a2) * R * 6], [c[0], c[1] - z * 1.15], [c[0] + Math.cos(a2) * R * 12 + 7, c[1] + Math.sin(a2) * R * 6]], p.c1 || '#fff', INK); }
  };
  Y.cluster = function (g, rw, rh, lv, p) {   // cụm 3 tháp cao thấp
    podium(g, rw, rh, p, 9); var z = hgt(rw, rh, lv, p), tw = (rw - .8) * .33, i, hs = [1, .74, .56];
    for (i = 0; i < 3; i++) { var x = .4 + i * (tw + .02), y = .35 + (i === 1 ? .25 : 0); slab(g, x, y, tw, rh - .8 - (i === 1 ? .3 : 0), 9, 9 + (z - 9) * hs[i], [p.c1 || '#DCE3EC', p.c2 || '#C9D1DA', p.c1 || '#DCE3EC'][i], p.glass || '#8FD0F0'); g.flat(x, y, tw, rh - .8 - (i === 1 ? .3 : 0), 9 + (z - 9) * hs[i], '#EEF2F6', '#fff'); }
    beaconAt(g, .4 + tw / 2, rh / 2, z + 8); g.line(g.P(.4 + tw / 2, rh / 2, z), g.P(.4 + tw / 2, rh / 2, z + 8), '#9AA4B2', 1.4);
  };
  Y.needle = function (g, rw, rh, lv, p) {   // tháp kim có đĩa quan sát
    lot(g, rw, rh, p.lot || '#B8E08A'); var cx = rw / 2, cy = rh / 2, z = hgt(rw, rh, lv, p) + 30;
    g.cyl(cx, cy, Math.min(rw, rh) * .3, 0, 7, p.base || '#EEF2F6'); g.cyl(cx, cy, .12, 7, z, p.c1 || '#E8E4D8');
    var d = g.P(cx, cy, z * .78); g.ell(d[0], d[1], 24, 9, p.c2 || '#8FD0F0', INK); g.ell(d[0], d[1] - 4, 18, 6, shade(p.c2 || '#8FD0F0', 1.2), false); g.glow.push({ c: [d[0], d[1]], r: 20 });
    var t = g.P(cx, cy, z); g.line(t, [t[0], t[1] - 26], '#9AA4B2', 1.6); beaconAt(g, cx, cy, z + 28);
  };
  Y.arch = function (g, rw, rh, lv, p) {   // toà nhà khung cổng vòm
    podium(g, rw, rh, p, 6); var z = hgt(rw, rh, lv, p) * .85, t = Math.min(.5, rw * .16);
    slab(g, .3, .3, t, rh - .6, 6, z, p.c1 || '#F2F2F2', p.glass || '#8FD0F0'); slab(g, rw - .3 - t, .3, t, rh - .6, 6, z, p.c1 || '#F2F2F2', p.glass || '#8FD0F0');
    slab(g, .3, .3, rw - .6, rh - .6, z - 18, z, p.c2 || '#E4D8F5', p.glass || '#8FD0F0', 2); slab(g, .3, .3, rw - .6, rh - .6, 6, 22, p.c2 || '#E4D8F5', p.glass || '#8FD0F0', 2);
    g.flat(.3, .3, rw - .6, rh - .6, z, '#EEF2F6', '#fff'); beaconAt(g, rw / 2, rh / 2, z + 8);
  };
  Y.ziggur = function (g, rw, rh, lv, p) {   // tháp bậc tròn xanh
    lot(g, rw, rh, p.lot || '#B9B3A6'); var cx = rw / 2, cy = rh / 2, n = 5, i, z = 0, hh = (hgt(rw, rh, lv, p) * .8) / n, R = Math.min(rw, rh) * .44;
    for (i = 0; i < n; i++) { var r = R * (1 - i * .17); g.cyl(cx, cy, r, z, z + hh, i % 2 ? p.c1 || '#F2F2F2' : p.c2 || '#E8E4D8', '#7CC25F'); var gp = g.P(cx, cy, z + hh); [[-1, .3], [1, -.2], [0, 1]].forEach(function (q) { g.ell(gp[0] + q[0] * r * 20, gp[1] + q[1] * r * 6, 4, 3, '#3FA55B'); }); z += hh; }
    var t = g.P(cx, cy, z); g.line(t, [t[0], t[1] - 20], '#9AA4B2', 1.4); beaconAt(g, cx, cy, z + 22);
  };
  Y.slant = function (g, rw, rh, lv, p) {   // tháp mái cắt xéo + pin mặt trời
    podium(g, rw, rh, p, 6); var z = hgt(rw, rh, lv, p), x = .35, y = .35, w = rw - .7, d = rh - .7;
    slab(g, x, y, w, d, 6, z, p.c1 || '#DCEEDD', p.glass || '#7FD9B0'); var a = g.P(x, y + d, z), b = g.P(x + w, y + d, z), c = g.P(x + w, y, z), e = g.P(x, y, z);
    g.poly([[a[0], a[1]], [b[0], b[1]], [c[0], c[1] - 18], [e[0], e[1] - 18]], p.c2 || '#2E3A5A', INK); g.line([a[0], a[1] - 5], [e[0], e[1] - 23], 'rgba(255,255,255,.35)', 1);
    beaconAt(g, rw / 2, rh / 2, z + 24);
  };
  Y.skyvillage = function (g, rw, rh, lv, p) {   // làng trên cao: tháp + nhiều nhà nhỏ trên mái
    podium(g, rw, rh, p, 6); var z = hgt(rw, rh, lv, p) * .7; slab(g, .3, .3, rw - .6, rh - .6, 6, z, p.c1 || '#F6EAD2', p.glass || '#8FD0F0'); g.flat(.3, .3, rw - .6, rh - .6, z, '#8ED067', '#5BAE55');
    var i; for (i = 0; i < 4; i++) { var x = .55 + (i % 2) * (rw - 1.6), y = .55 + Math.floor(i / 2) * (rh - 1.6); g.box(x, y, .45, .4, z, z + 9, ['#F6CBA2', '#C3DCF3', '#F3B9B9', '#F5E6C8'][i]); g.hip(x - .03, y - .03, .51, .46, z + 9, z + 16, ['#D95A42', '#4F80BA', '#B8485E', '#E58A3C'][i], .25); }
    g.tree(rw / 2, rh / 2, .7, 'cherry'); beaconAt(g, rw / 2, rh / 2, z + 22);
  };
  var reg = function (key, style, p) { var f = Y[style]; if (!f) return; p = p || {}; def(key, function (g, rw, rh, lv) { f(g, rw, rh, lv || 1, p); }); };
  var R = reg;
  R('stackhabitat', 'stacked', {});
  R('greenstack', 'stacked', {"c1": "#E8F2E4", "c2": "#C9E0BE", "glass": "#7FD9B0"});
  R('sunstack', 'stacked', {"c1": "#FFF3D0", "c2": "#F2D27A", "glass": "#FFE08A"});
  R('cloudstack', 'stacked', {"c1": "#E4D8F5", "c2": "#CDBBF0", "glass": "#B9A0F0"});
  R('skygate', 'gate', {});
  R('silvergate', 'gate', {"c1": "#C9D1DA", "c2": "#EEF2F6", "glass": "#9AB8D8"});
  R('goldgate', 'gate', {"c1": "#F3E6C4", "c2": "#F2D27A", "glass": "#FFE08A"});
  R('galaxygate', 'gate', {"c1": "#E4D8F5", "c2": "#B07CFF", "glass": "#B9A0F0"});
  R('leantower', 'lean', {});
  R('rosetwist', 'lean', {"c1": "#F6DCE6", "c2": "#F5A8C4", "glass": "#F5A8C4"});
  R('jadelean', 'lean', {"c1": "#DCEEDD", "c2": "#8FDCA0", "glass": "#7FD9B0"});
  R('azurelean', 'lean', {"c1": "#D4E4F2", "c2": "#74BDEA", "glass": "#4FA4DA"});
  R('canton', 'hyper', {});
  R('amberhyper', 'hyper', {"c1": "#F3E6C4", "c2": "#F2D27A"});
  R('rosehyper', 'hyper', {"c1": "#F6DCE6", "c2": "#F5A8C4"});
  R('stardyper', 'hyper', {"c1": "#E4D8F5", "c2": "#B07CFF"});
  R('operahouse', 'sails', {});
  R('pearlopera', 'sails', {"c1": "#FDF6F0", "c2": "#F6DCE6", "lot": "#74BDEA"});
  R('seashellhall', 'sails', {"c1": "#FFF3D0", "c2": "#F6DCE6", "lot": "#9AD8F2"});
  R('crystalopera', 'sails', {"c1": "#E8F4FA", "c2": "#BFE6F5", "lot": "#4DB1EA"});
  R('globehall', 'sphere', {});
  R('goldglobe', 'sphere', {"c1": "#F2D27A", "c2": "#fff"});
  R('emeraldglobe', 'sphere', {"c1": "#6FD3A8", "c2": "#C8F5E0"});
  R('cosmosglobe', 'sphere', {"c1": "#B07CFF", "c2": "#6FE0D0"});
  R('twinbridge', 'twinbridge', {});
  R('pearltwin', 'twinbridge', {"c1": "#F6F0E0", "c2": "#EFE2D0", "glass": "#E8B88A"});
  R('azuretwin', 'twinbridge', {"c1": "#D4E4F2", "c2": "#B9D4EC", "glass": "#4FA4DA"});
  R('sunsettwin', 'twinbridge', {"c1": "#F6CBA2", "c2": "#F3B9B9", "glass": "#FF9F6B"});
  R('glasspyramid', 'glasspyr', {});
  R('icepyramid', 'glasspyr', {"glass": "#CDEAF8", "lot": "#F2F7FC"});
  R('emeraldpyramid', 'glasspyr', {"glass": "#7FD9B0"});
  R('solarpyramid', 'glasspyr', {"glass": "#FFE08A", "lot": "#F3E0AE"});
  R('wavehall', 'wave', {});
  R('seawave', 'wave', {"c2": "#BFE6F5", "glass": "#4FA4DA"});
  R('aurorawave', 'wave', {"c1": "#E4D8F5", "c2": "#B8F0D8", "glass": "#B9A0F0"});
  R('lotushall', 'petal', {});
  R('pinklotus', 'petal', {"c1": "#FFFFFF", "c2": "#F5A8C4"});
  R('goldlotus', 'petal', {"c1": "#FFF3D0", "c2": "#F2D27A"});
  R('jadelotus', 'petal', {"c1": "#DCEEDD", "c2": "#8FDCA0", "lot": "#5FCB9E"});
  R('trio', 'cluster', {});
  R('silvertrio', 'cluster', {"c1": "#C9D1DA", "c2": "#E8EDF2", "glass": "#9AB8D8"});
  R('hightrio', 'cluster', {"c1": "#F6F0E0", "c2": "#DCE3EC", "glass": "#8FD0F0"});
  R('aurotrio', 'cluster', {"c1": "#DCEEDD", "c2": "#E4D8F5", "glass": "#7FD9B0"});
  R('spaceneedle', 'needle', {});
  R('rubyneedle', 'needle', {"c1": "#F6DCE6", "c2": "#E27DA2"});
  R('skyneedle', 'needle', {"c1": "#E8F4FA", "c2": "#74BDEA"});
  R('arcadegate', 'arch', {});
  R('grandarche', 'arch', {"c1": "#F2F2F2", "c2": "#DCE3EC"});
  R('violetarche', 'arch', {"c1": "#E4D8F5", "c2": "#CDBBF0", "glass": "#B9A0F0"});
  R('greenziggurat', 'ziggur', {});
  R('goldziggurat', 'ziggur', {"c1": "#F3E6C4", "c2": "#F2D27A"});
  R('cloudziggurat', 'ziggur', {"c1": "#fff", "c2": "#E4D8F5"});
  R('solarslant', 'slant', {});
  R('ecoslant', 'slant', {"c1": "#E8F2E4", "glass": "#7FD9B0"});
  R('techslant', 'slant', {"c1": "#D4E4F2", "glass": "#4FA4DA", "c2": "#1F2A4A"});
  R('infinityslant', 'slant', {"c1": "#F6F0E0", "glass": "#FFE08A", "c2": "#4A2E18"});
  R('skyvillage', 'skyvillage', {});
  R('terracevillage', 'skyvillage', {"c1": "#F3E6C4"});
  R('eternalvillage', 'skyvillage', {"c1": "#E4D8F5", "glass": "#B9A0F0"});
})(typeof window !== 'undefined' ? window : this);
