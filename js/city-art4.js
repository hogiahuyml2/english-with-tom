/* EWT City — ĐỒ HOẠ phần 4: công trình CAO CẤP & HIỆN ĐẠI mở khoá từ cấp 23 đến 120 — cao ốc kính xoắn / bậc thang / vườn đứng, cánh buồm, vòm kính,
   sân vận động, vòng quay siêu khổng lồ, trạm hyperloop, lò nhiệt hạch, thang máy vũ trụ, đảo bay, cây thế giới… Dựng bằng các "khuôn" tham số + một số công trình riêng. */
(function (root) {
  'use strict';
  var A = root.EWTCityArt; if (!A || !A.kit) return;
  var K = A.kit, tower = K.tower, lot = K.lot, beacon = K.beacon, H = K.H, def = K.def, INK = K.INK, sign = K.sign, shade = A.shade, TAU = Math.PI * 2, HW = 32, HH = 16;
  var P = function (g, x, y, z) { return g.P(x, y, z); };
  var glowAt = function (g, x, y, z, r) { var p = g.P(x, y, z); g.glow.push({ c: p, r: r }); };

  /* ── hình khối cơ bản vẽ trực tiếp ── */
  function orb(g, cx, cy, zc, r, c1, c2, grid) {   // quả cầu có bóng đổ + kinh tuyến
    var p = g.P(cx, cy, zc), c = g.c, gr = c.createRadialGradient(p[0] - r * .35, p[1] - r * .4, r * .1, p[0], p[1], r); gr.addColorStop(0, c1); gr.addColorStop(1, c2);
    g.ext(p[0], p[1], r + 2); c.beginPath(); c.arc(p[0], p[1], r, 0, TAU); c.fillStyle = gr; c.fill(); c.strokeStyle = INK; c.lineWidth = 1; c.stroke();
    if (grid) { c.strokeStyle = 'rgba(255,255,255,.35)'; c.lineWidth = 1; var k; for (k = 1; k < 4; k++) { c.beginPath(); c.ellipse(p[0], p[1], r * k / 4, r, 0, 0, TAU); c.stroke(); } c.beginPath(); c.ellipse(p[0], p[1], r, r * .28, 0, 0, TAU); c.stroke(); }
    return p;
  }
  function ring(g, cx, cy, zc, rx, ry, col, lw) { var p = g.P(cx, cy, zc), c = g.c; g.ext(p[0], p[1], Math.max(rx, ry) + lw); c.beginPath(); c.ellipse(p[0], p[1], rx, ry, 0, 0, TAU); c.strokeStyle = col; c.lineWidth = lw; c.stroke(); return p; }
  function cone(g, cx, cy, z0, z1, r, col) { var a = g.P(cx, cy, z0), b = g.P(cx, cy, z1); g.poly([[a[0] - r, a[1]], [a[0] + r, a[1]], [b[0], b[1]]], col, INK); g.ell(a[0], a[1], r, r * .4, shade(col, .85)); }
  var glassCols = { teal: ['#6FD3C8', '#3FB3A9'], blue: ['#74BDEA', '#4592CC'], violet: ['#B07CFF', '#8A56E0'], gold: ['#F2D27A', '#D9B04A'], dark: ['#3A4D6E', '#243350'], rose: ['#F5A8C4', '#E27DA2'], green: ['#8FDCA0', '#55B772'], ice: ['#BFE6F5', '#8CC8E3'] };

  /* ── khuôn: tháp XOẮN ── */
  function twist(g, rw, rh, z, o) {
    var n = o.n || 10, i, w = rw - .6, h = rh - .6; lot(g, rw, rh, o.lot || '#B9B3A6'); g.box(.1, .1, rw - .2, rh - .2, 0, 12, o.base || '#E8EDF2');
    for (i = 0; i < n; i++) {
      var z0 = 12 + i * (z - 12) / n, z1 = 12 + (i + 1) * (z - 12) / n, sh = Math.sin(i * (o.ang || .7)) * (o.amp || .3), sc = 1 - i * (o.dec || .035), ww = w * sc, hh = h * sc, x = (rw - ww) / 2 + sh, y = (rh - hh) / 2 - sh * .5;
      g.box(x, y, ww, hh, z0, z1, o.cols[i % o.cols.length]); g.glassL(x, y, ww, hh, z0 + 2, z1 - 2, 2, o.g1); g.glassR(x, y, ww, hh, z0 + 2, z1 - 2, 2, o.g2);
      if (i === n - 1) { g.hip(x, y, ww, hh, z1, z1 + (o.ch || 22), o.cc || '#8FA3BD', .4); g.line(g.P(x + ww / 2, y + hh / 2, z1 + (o.ch || 22)), g.P(x + ww / 2, y + hh / 2, z1 + (o.ch || 22) + (o.ant || 50)), '#9AA4B2', 1.8); beacon(g, x + ww / 2, y + hh / 2, z1 + (o.ch || 22) + (o.ant || 50)); }
    }
    g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .22, 10, '#1F3A5F');
  }
  /* ── khuôn: kim tự tháp / bậc thang nhiều tầng (có dải cây xanh) ── */
  function terrace(g, rw, rh, z, o) {
    var n = o.n || 5, i, m = .1; lot(g, rw, rh, o.lot || '#B9B3A6');
    for (i = 0; i < n; i++) {
      var ins = m + i * (o.step || .3), x = ins, y = ins, w = rw - 2 * ins, h = rh - 2 * ins, z0 = i * z / n, z1 = (i + 1) * z / n; if (w < .5 || h < .5) break;
      g.box(x, y, w, h, z0, z1, o.cols[i % o.cols.length]); g.glassL(x, y, w, h, z0 + 3, z1 - 3, 2, o.g1); g.glassR(x, y, w, h, z0 + 3, z1 - 3, 2, o.g2);
      g.quadL(x, y, w, h, 0, 1, z1 - 3, z1, o.green || '#5FB46B'); g.quadR(x, y, w, h, 0, 1, z1 - 3, z1, shade(o.green || '#5FB46B', .85));
      if (i < n - 1) { g.tree(x + w - .1, y + h - .1, .45, '', z1); g.tree(x + .2, y + h - .15, .4, 'cherry', z1); }
      o._top = [x, y, w, h, z1];
    }
    var T = o._top, cx = T[0] + T[2] / 2, cy = T[1] + T[3] / 2; if (o.spire) { g.line(g.P(cx, cy, T[4]), g.P(cx, cy, T[4] + o.spire), '#E2B33C', 2); beacon(g, cx, cy, T[4] + o.spire); }
    g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .22, 10, '#1F3A5F');
  }
  /* ── khuôn: toà VƯỜN ĐỨNG (ban công xanh) ── */
  function vforest(g, rw, rh, z, o) {
    var x = .22, y = .22, w = rw - .44, h = rh - .44, j, n = Math.round(z / 16); lot(g, rw, rh, '#8ED067'); g.box(.08, .08, rw - .16, rh - .16, 0, 14, '#EDEFEA');
    g.box(x, y, w, h, 14, z, o.wall || '#EFF3EC'); g.winsL(x, y, w, h, 18, z - 3, Math.max(2, Math.round(w * 2)), n - 1, { m: .22, col: '#BFE6F5' }); g.winsR(x, y, w, h, 18, z - 3, Math.max(2, Math.round(h * 2)), n - 1, { m: .22, col: '#9FD3EC' });
    for (j = 1; j < n; j++) { var zb = 14 + j * (z - 14) / n; g.quadL(x - .05, y - .05, w + .1, h + .1, 0, 1, zb - 1, zb + 3.5, o.green || '#3F9A55'); g.quadR(x - .05, y - .05, w + .1, h + .1, 0, 1, zb - 1, zb + 3.5, shade(o.green || '#3F9A55', .82)); if (j % 2 === 0) { g.tree(x + w + .02, y + h + .02, .3, '', zb); g.tree(x - .02, y + h + .02, .3, 'cherry', zb); } }
    g.flat(x, y, w, h, z, '#CFE0CF', '#fff'); g.tree(x + w * .3, y + h * .4, .6, '', z); g.tree(x + w * .7, y + h * .6, .55, 'cherry', z); g.tree(x + w * .5, y + h * .3, .5, '', z);
    g.doorL(.08, .08, rw - .16, rh - .16, .5, 0, .22, 10, '#3C6B4B'); g.tree(.2, rh - .1, .6); g.tree(rw - .2, rh - .1, .6, 'cherry');
  }
  /* ── khuôn: VÒM KÍNH ── */
  function domebld(g, rw, rh, o) {
    lot(g, rw, rh, o.lot || '#A8D88E'); g.box(.08, .08, rw - .16, rh - .16, 0, o.base || 10, o.bcol || '#E8EDF2');
    var c = g.P(rw / 2, rh / 2, o.base || 10), rx = (rw + rh) * 13.5, hg = o.h || rx * .95, cx = rw / 2, cy = rh / 2, k, ctx = g.c;
    (o.inside || []).forEach(function (b) { g.box(cx + b[0], cy + b[1], b[2], b[3], o.base || 10, (o.base || 10) + b[4], b[5]); g.winsL(cx + b[0], cy + b[1], b[2], b[3], (o.base || 10) + 3, (o.base || 10) + b[4] - 3, 2, Math.max(2, Math.round(b[4] / 14)), { m: .2 }); });
    for (k = 0; k < (o.trees || 0); k++) g.tree(cx + Math.cos(k * 2.1) * rw * .3, cy + Math.sin(k * 2.1) * rh * .3, .5, k % 2 ? 'cherry' : '', o.base || 10);
    g.ext(c[0], c[1] - hg, rx + 4); var gr = ctx.createLinearGradient(0, c[1] - hg, 0, c[1]); gr.addColorStop(0, o.g1 || 'rgba(70,170,235,.78)'); gr.addColorStop(1, o.g2 || 'rgba(30,120,205,.6)');
    ctx.beginPath(); ctx.ellipse(c[0], c[1], rx, rx * .5, 0, 0, Math.PI); ctx.ellipse(c[0], c[1], rx, hg, 0, Math.PI, 0, false); ctx.closePath(); ctx.fillStyle = gr; ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.95)'; ctx.lineWidth = 2; ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 1; for (k = 1; k < 4; k++) { ctx.beginPath(); ctx.ellipse(c[0], c[1], rx * k / 4, hg, 0, Math.PI, 0, false); ctx.stroke(); } ctx.beginPath(); ctx.ellipse(c[0], c[1] - hg * .5, rx * .87, hg * .5, 0, Math.PI, 0, false); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.ellipse(c[0] - rx * .35, c[1] - hg * .6, rx * .2, hg * .22, -.5, 0, TAU); ctx.fill();
    if (o.spire) { g.line([c[0], c[1] - hg], [c[0], c[1] - hg - o.spire], '#E2B33C', 2); beacon(g, rw / 2, rh / 2, (o.base || 10) + hg * 2 + o.spire - 6); }
    g.doorL(.08, .08, rw - .16, rh - .16, .5, 0, .22, 8, '#1F3A5F');
  }
  /* ── khuôn: SÂN VẬN ĐỘNG / ĐẤU TRƯỜNG ── */
  function stadium(g, rw, rh, o) {
    lot(g, rw, rh, '#B9B3A6'); var cx = rw / 2, cy = rh / 2, r = Math.min(rw, rh) * .46, z = o.z, p = g.P(cx, cy, z), rx = r * HW * 1.25, ry = r * HH * 1.25, k;
    g.cyl(cx, cy, r, 0, z, o.wall, shade(o.wall, 1.12)); var a = g.P(cx, cy, z * .5);
    for (k = 0; k < 8; k++) { var an = k * TAU / 8, qx = p[0] + Math.cos(an) * rx * .98, qy = p[1] + Math.sin(an) * ry * .98; if (Math.sin(an) > 0) g.line([qx, qy], [qx, qy + z], 'rgba(255,255,255,.55)', 1.4); }
    g.ell(p[0], p[1], rx * .84, ry * .84, '#B8BEC9', INK); g.ell(p[0], p[1] + 2, rx * .66, ry * .66, '#6BB86B'); g.c.strokeStyle = 'rgba(255,255,255,.8)'; g.c.lineWidth = 1; g.c.beginPath(); g.c.ellipse(p[0], p[1] + 2, rx * .66, ry * .66, 0, 0, TAU); g.c.stroke(); g.c.beginPath(); g.c.moveTo(p[0], p[1] + 2 - ry * .66); g.c.lineTo(p[0], p[1] + 2 + ry * .66); g.c.stroke(); g.ell(p[0], p[1] + 2, rx * .12, ry * .12, 'rgba(255,255,255,.0)', 'rgba(255,255,255,.8)');
    ring(g, cx, cy, z + 2, rx * 1.02, ry * 1.02, o.roof || '#DDE6F0', 4);
    [[0, -1], [1, 0], [0, 1], [-1, 0]].forEach(function (d) { var bx = p[0] + d[0] * rx * 1.08, by = p[1] + d[1] * ry * 1.08; g.line([bx, by], [bx, by - (o.mast || 60)], '#6B7686', 2); g.ell(bx, by - (o.mast || 60), 4, 2.4, '#FFF4C2'); g.glow.push({ c: [bx, by - (o.mast || 60)], r: 16 }); });
    if (o.sign) sign(g, cx, rh - .05, z * .5, 24, o.sign[0], o.sign[1]);
    g.doorL(.2, .2, rw - .4, rh - .4, .5, 0, .2, 10, '#1F3A5F');
  }
  /* ── khuôn: VÒNG QUAY siêu lớn (quay thật) ── */
  function wheel(g, rw, rh, o) {
    lot(g, rw, rh, '#B9B3A6'); var cx = rw / 2, cy = rh / 2, hub = g.P(cx, cy, o.z), b1 = g.P(cx - .5, cy + .2, 0), b2 = g.P(cx + .5, cy - .2, 0);
    g.box(.2, .2, rw - .4, .7, 0, 12, '#E8EDF2'); g.line(b1, hub, '#8A94A4', 4); g.line(b2, hub, '#8A94A4', 4); g.line(g.P(cx, cy + .5, 0), hub, '#9AA4B2', 3); g.ext(hub[0], hub[1], o.R + 12);
    ring(g, cx, cy, o.z, o.R, o.R, '#8A94A4', 2); ring(g, cx, cy, o.z, o.R * .55, o.R * .55, '#9AA4B2', 1); g.meta.rot.push([hub[0], hub[1], 'wheel', o.R, 0]); (o.extra || function () {})(g, rw, rh, hub);
    g.doorL(.2, .2, rw - .4, .7, .5, 0, .2, 9, '#1F3A5F'); g.tree(.2, rh - .15, .6); g.tree(rw - .2, rh - .15, .6, 'cherry');
  }
  /* ── tiện ích cho nhóm tên: tháp kính theo bảng màu ── */
  function tw(name, a, b, fn) { def(name, function (g, rw, rh, lv) { var z = H(lv, a, b); tower(g, rw, rh, fn(z, rw, rh, g)); }); }
  var GC = function (n) { return glassCols[n]; };

  /* ═════════ NHÀ Ở CAO CẤP ═════════ */
  def('skyvilla', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9ED67A'); var z = 16 + lv * 3; g.box(.12, .15, rw - .24, rh - .3, 0, z, '#F4F1EA'); g.glassL(.12, .15, rw - .24, rh - .3, 3, z - 2, 1, '#7FC8F0'); g.glassR(.12, .15, rw - .24, rh - .3, 3, z - 2, 1, '#5BA8D8'); g.flat(.12, .15, rw - .24, rh - .3, z, '#E8E4DA', '#fff');
    g.box(.5, .18, rw - .9, rh * .5, z, z + 20, '#2F3B4F'); g.glassL(.5, .18, rw - .9, rh * .5, z + 2, z + 18, 1, '#9ADCF5'); g.glassR(.5, .18, rw - .9, rh * .5, z + 2, z + 18, 1, '#6DB6DC'); g.flat(.5, .18, rw - .9, rh * .5, z + 20, '#D8D4CA', '#fff');
    g.poly(g.faceT(.25, rh * .62, rw - .55, rh * .26, z + .6), '#6FD8F0', INK); g.tree(rw - .2, rh - .12, .7); g.tree(.18, rh - .12, .6, 'cherry'); g.doorL(.12, .15, rw - .24, rh - .3, .5, 0, .22, 10, '#3B2A1E');
  });
  tw('auroratower', 150, 190, function (z) { return { wall: '#CFE0F0', tiers: [[0, z * .75], [.25, z]], g1: GC('teal')[0], g2: GC('teal')[1], floor: 11, crown: 'helipad', base: 16, bcol: '#F0F2F5', band: '#2FB36D' }; });
  def('vgarden', function (g, rw, rh, lv) { vforest(g, rw, rh, H(lv, 150, 190), {}); });
  def('marinaresi', function (g, rw, rh, lv) {
    var z = H(lv, 150, 190); lot(g, rw, rh, '#8FD0E8'); g.box(.06, .06, rw - .12, rh - .12, 0, 14, '#F0F2F5'); var a = (rw - .6) / 2;
    [[.2, z], [.4 + a, z * .8]].forEach(function (q, i) { g.box(q[0], .3, a, rh - .6, 14, q[1], i ? '#E9F1F8' : '#DDE9F4'); g.glassL(q[0], .3, a, rh - .6, 16, q[1] - 3, Math.round((q[1] - 16) / 11), '#7FD0F0'); g.glassR(q[0], .3, a, rh - .6, 16, q[1] - 3, Math.round((q[1] - 16) / 11), '#58B2E0'); g.hip(q[0], .3, a, rh - .6, q[1], q[1] + 12, '#4F80BA', .4); });
    g.box(.2 + a - .02, rh * .38, .24, rh * .24, z * .55, z * .55 + 8, '#CFE3F2'); g.doorL(.06, .06, rw - .12, rh - .12, .5, 0, .2, 10, '#1F3A5F'); g.tree(.2, rh - .1, .6); g.tree(rw - .2, rh - .1, .6, 'cherry');
  });
  def('crystalvilla', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); var z = 24 + lv * 4; g.box(.15, .15, rw - .3, rh - .3, 0, 8, '#E8EDF2'); g.box(.3, .3, rw - .6, rh - .6, 8, z, '#BFE6F5', { top: '#DFF3FB' }); g.glassL(.3, .3, rw - .6, rh - .6, 10, z - 2, 2, '#9BE0F5'); g.glassR(.3, .3, rw - .6, rh - .6, 10, z - 2, 2, '#6DC4E8');
    g.hip(.3, .3, rw - .6, rh - .6, z, z + 22, 'rgba(200,240,255,.85)', .5); g.line(g.P(rw / 2, rh / 2, z + 22), g.P(rw / 2, rh / 2, z + 36), '#E2B33C', 1.6); g.tree(.2, rh - .12, .7); g.tree(rw - .2, rh - .12, .7, 'cherry'); g.doorL(.3, .3, rw - .6, rh - .6, .5, 8, .22, 12, '#6B7686'); glowAt(g, rw / 2, rh / 2, z * .6, 20);
  });
  def('greentower', function (g, rw, rh, lv) { vforest(g, rw, rh, H(lv, 190, 240), { green: '#2F8A4A', wall: '#E6F0E2' }); });
  def('diamondtower', function (g, rw, rh, lv) { twist(g, rw, rh, H(lv, 240, 290), { n: 9, ang: .9, amp: .3, dec: .04, cols: ['#C9E6F2', '#E0F2F8'], g1: '#9BE6F2', g2: '#5CC8E0', cc: '#6FB5E3', ch: 26, ant: 56 }); });
  def('royalpalace', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8ED067'); var z = 30 + lv * 4; g.box(.1, .3, rw - .2, rh - .5, 0, z, '#F6EBD2'); g.winsL(.1, .3, rw - .2, rh - .5, 6, z - 4, 6, 2, { m: .2, col: '#BFE0F0' }); g.winsR(.1, .3, rw - .2, rh - .5, 6, z - 4, 4, 2, { m: .2, col: '#A8D0E6' });
    g.flat(.1, .3, rw - .2, rh - .5, z, '#C9A96A', '#E2C88A'); g.box(rw / 2 - .55, .45, 1.1, rh - .8, z, z + 26, '#F6EBD2'); g.winsL(rw / 2 - .55, .45, 1.1, rh - .8, z + 4, z + 22, 3, 1, { m: .2 }); g.hip(rw / 2 - .6, .4, 1.2, rh - .7, z + 26, z + 52, '#3E6FB0', .45);
    [[.12, .32], [rw - .55, .32]].forEach(function (q) { g.box(q[0], q[1], .43, .43, z, z + 24, '#F0E2C0'); g.hip(q[0] - .02, q[1] - .02, .47, .47, z + 24, z + 46, '#E2B33C', .5); g.line(g.P(q[0] + .2, q[1] + .2, z + 46), g.P(q[0] + .2, q[1] + .2, z + 58), '#E2B33C', 1.4); });
    g.line(g.P(rw / 2, rh / 2, z + 52), g.P(rw / 2, rh / 2, z + 72), '#E2B33C', 1.8); g.doorL(.1, .3, rw - .2, rh - .5, .5, 0, .2, 14, '#7A4B2A'); g.tree(.2, rh - .1, .8, 'cherry'); g.tree(rw - .2, rh - .1, .8); g.tree(rw * .3, rh - .08, .6); g.tree(rw * .7, rh - .08, .6, 'cherry');
  });
  def('cloudapts', function (g, rw, rh, lv) { terrace(g, rw, rh, H(lv, 220, 280), { n: 5, step: .26, cols: ['#E9F1F8', '#DDE9F4'], g1: '#8FD6F0', g2: '#5DB7E2', spire: 50 }); });
  def('arcology', function (g, rw, rh, lv) { terrace(g, rw, rh, H(lv, 300, 360), { n: 7, step: .32, cols: ['#E6EFE6', '#D5E4D5'], g1: '#9DE0B8', g2: '#62BE8C', green: '#2F9A55', spire: 70 }); });
  tw('orbitalresi', 270, 330, function (z) { return { wall: '#D5DEEA', tiers: [[0, z]], g1: GC('ice')[0], g2: GC('ice')[1], floor: 11, crown: 'ring', base: 18, bcol: '#EEF1F5', band: '#7A4BC7' }; });
  def('edensky', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8ED067'); var z = H(lv, 420, 500), i; g.box(.06, .06, rw - .12, rh - .12, 0, 16, '#EDEFEA');
    [[.3, .3, 1.1, z], [rw * .55, .35, 1.0, z * .8], [.4, rh * .55, 1.1, z * .66], [rw * .6, rh * .6, 1.0, z * .9]].forEach(function (q) { var x = q[0], y = q[1], w = Math.min(q[2], rw - x - .2), h = Math.min(q[2], rh - y - .2), zt = q[3], n = Math.round(zt / 18), j; g.box(x, y, w, h, 16, zt, '#EAF2E6'); g.winsL(x, y, w, h, 20, zt - 3, 2, n - 1, { m: .2, col: '#BFE6F5' }); g.winsR(x, y, w, h, 20, zt - 3, 2, n - 1, { m: .2, col: '#9FD3EC' }); for (j = 1; j < n; j++) { var zb = 16 + j * (zt - 16) / n; g.quadL(x - .04, y - .04, w + .08, h + .08, 0, 1, zb - 1, zb + 3, '#3F9A55'); g.quadR(x - .04, y - .04, w + .08, h + .08, 0, 1, zb - 1, zb + 3, '#2F7A44'); } g.tree(x + w / 2, y + h / 2, .5, '', zt); });
    g.doorL(.06, .06, rw - .12, rh - .12, .5, 0, .2, 10, '#3C6B4B'); beacon(g, rw / 2, rh / 2, z + 20);
  });

  /* ═════════ THƯƠNG MẠI – VĂN PHÒNG ═════════ */
  tw('techhub', 150, 190, function (z) { return { wall: '#D4E4F2', tiers: [[0, z * .7], [.28, z]], g1: GC('teal')[0], g2: GC('teal')[1], floor: 12, crown: 'antenna', ant: 40, base: 16, bcol: '#EEF2F6', band: '#2FB36D' }; });
  tw('sapphire', 190, 240, function (z) { return { wall: '#7FA6D6', tiers: [[0, z * .6], [.2, z * .85], [.45, z]], g1: '#5C9AE0', g2: '#3A74C0', floor: 11, crown: 'spire', ch: 22, ant: 60, cc: '#2F5DA8', base: 14, bcol: '#E2E8F0', band: '#BFD8FF' }; });
  def('auroramall', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 44 + lv * 6; g.box(.08, .08, rw - .16, rh - .16, 0, z, '#F6F0F8'); g.glassL(.08, .08, rw - .16, rh - .16, 6, z - 4, 3, '#C9A8F2'); g.glassR(.08, .08, rw - .16, rh - .16, 6, z - 4, 3, '#A88AD8'); g.flat(.08, .08, rw - .16, rh - .16, z, '#E8E0F0', '#fff');
    ring(g, rw / 2, rh / 2, z + 10, rw * 22, rh * 11, 'rgba(160,120,230,.8)', 3); var c = g.P(rw / 2, rh / 2, z); g.ell(c[0], c[1] - 12, rw * 14, rh * 7, 'rgba(200,170,250,.55)', INK); sign(g, rw / 2, rh - .08, z * .62, 34, '#7A4BC7', 'AURORA'); g.doorL(.08, .08, rw - .16, rh - .16, .5, 0, .3, 12, '#4A2E78'); glowAt(g, rw / 2, rh / 2, z * .5, 30);
  });
  tw('goldbank', 190, 240, function (z) { return { wall: '#E8D7A8', tiers: [[0, z]], style: 'win', g1: '#FFF1C2', floor: 13, crown: 'crown', cc: '#E2B33C', base: 24, bcol: '#EFE3BE', band: '#B8862A', door: '#8A5A00' }; });
  def('quantumtower', function (g, rw, rh, lv) { twist(g, rw, rh, H(lv, 270, 330), { n: 11, ang: 1.1, amp: .34, dec: .03, cols: ['#C9B8F5', '#DDD2FA'], g1: '#A88AF0', g2: '#7C58D8', cc: '#8A56E0', ch: 24, ant: 60 }); });
  def('digitalplaza', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = H(lv, 150, 190); g.box(.08, .08, rw - .16, rh - .16, 0, 26, '#E8EDF2'); var a = (rw - .8) / 2;
    [[.2, z], [.6 + a, z * .72]].forEach(function (q, i) { g.box(q[0], .35, a, rh - .7, 26, q[1], '#2F3B4F'); g.glassL(q[0], .35, a, rh - .7, 28, q[1] - 3, Math.round((q[1] - 28) / 11), i ? '#5BE0FF' : '#8A6BFF'); g.glassR(q[0], .35, a, rh - .7, 28, q[1] - 3, Math.round((q[1] - 28) / 11), i ? '#3AB4D8' : '#6A4BE0'); g.flat(q[0], .35, a, rh - .7, q[1], '#B8C3D2', '#fff'); glowAt(g, q[0] + a / 2, rh / 2, q[1] * .6, 26); });
    sign(g, rw / 2, rh - .08, 16, 28, '#2F3B4F', 'DIGITAL'); g.doorL(.08, .08, rw - .16, rh - .16, .5, 0, .24, 12, '#5BE0FF');
  });
  tw('neonskyline', 270, 330, function (z) { return { wall: '#2A2144', tiers: [[0, z * .5], [.22, z * .8], [.46, z]], g1: '#FF5FD0', g2: '#7A5BFF', floor: 11, crown: 'spire', ch: 24, ant: 80, cc: '#FF3DAA', base: 16, bcol: '#3A2E5C', band: '#5BE0FF', after: function (g, rw, rh) { glowAt(g, rw / 2, rh / 2, z * .3, 34); glowAt(g, rw / 2, rh / 2, z * .7, 28); } }; });
  def('globetower', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = H(lv, 200, 260); g.box(.15, .15, rw - .3, rh - .3, 0, 16, '#E8EDF2'); g.cyl(rw / 2, rh / 2, .42, 16, z, '#DCE6F0', '#EEF3F8'); var p = orb(g, rw / 2, rh / 2, z + 8, 40, '#BFEFFF', '#3F8FD0', true); g.ell(p[0] - 10, p[1] - 12, 8, 5, 'rgba(255,255,255,.4)'); g.line([p[0], p[1] - 30], [p[0], p[1] - 76], '#9AA4B2', 1.8); beacon(g, rw / 2, rh / 2, z + 8 + 76 / 1.0); g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .2, 10, '#1F3A5F'); glowAt(g, rw / 2, rh / 2, z + 8, 28);
  });
  def('sailhotel', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8FD0E8'); var z = H(lv, 300, 360), x0 = .3, y0 = .3, w = rw - .6, h = rh - .6, c = g.c, i; g.box(.1, .1, rw - .2, rh - .2, 0, 16, '#F0F2F5');
    g.poly([g.P(x0, y0 + h, 16), g.P(x0 + w, y0 + h, 16), g.P(x0 + w, y0 + h, z), g.P(x0, y0 + h, z * .32)], '#F6F8FB', INK); g.poly([g.P(x0 + w, y0 + h, 16), g.P(x0 + w, y0, 16), g.P(x0 + w, y0, z * .96), g.P(x0 + w, y0 + h, z)], '#C9D6E6', INK);
    for (i = 1; i < 12; i++) { var t = i / 12, za = 16 + (z * (.32 + .68 * t) - 16) * 0; g.line(g.P(x0 + w * t, y0 + h, 16), g.P(x0 + w * t, y0 + h, z * (.32 + .68 * t)), 'rgba(120,160,200,.55)', 1); }
    for (i = 1; i < 8; i++) { var zz = 16 + (z - 16) * i / 8; g.line(g.P(x0 + w, y0 + h, zz), g.P(x0 + w * Math.max(0, (zz - z * .32) / (z * .68)), y0 + h, zz), 'rgba(160,190,220,.6)', 1); }
    g.line(g.P(x0 + w, y0 + h, z), g.P(x0 + w, y0 + h, z + 40), '#E2B33C', 2); beacon(g, x0 + w, y0 + h, z + 40); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .24, 12, '#1F3A5F'); sign(g, rw / 2, rh - .08, 12, 24, '#4F80BA', 'SAIL');
  });
  def('galaxymall', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 50 + lv * 6; g.box(.08, .08, rw - .16, rh - .16, 0, z, '#2A2D4A'); g.glassL(.08, .08, rw - .16, rh - .16, 6, z - 4, 3, '#7A6BFF'); g.glassR(.08, .08, rw - .16, rh - .16, 6, z - 4, 3, '#5A4BE0'); g.flat(.08, .08, rw - .16, rh - .16, z, '#3A3E62', '#8A94C8');
    var c = g.P(rw / 2, rh / 2, z); g.ell(c[0], c[1] - 14, rw * 16, rh * 8, 'rgba(120,110,255,.6)', INK); ring(g, rw / 2, rh / 2, z + 20, rw * 24, rh * 12, 'rgba(255,230,120,.9)', 2.4); orb(g, rw / 2, rh / 2, z + 22, 10, '#FFF3B0', '#F0B040', false); sign(g, rw / 2, rh - .08, z * .6, 40, '#5A4BE0', 'GALAXY'); glowAt(g, rw / 2, rh / 2, z * .5, 40); g.doorL(.08, .08, rw - .16, rh - .16, .5, 0, .34, 14, '#FFE066');
  });
  tw('obsidian', 380, 440, function (z) { return { wall: '#18202F', tiers: [[0, z * .45], [.18, z * .75], [.36, z]], g1: GC('dark')[0], g2: GC('dark')[1], floor: 10, crown: 'spire', ch: 30, ant: 90, cc: '#2F3B55', base: 16, bcol: '#2A3446', band: '#5BE0FF', door: '#5BE0FF' }; });
  tw('crownfinance', 420, 490, function (z) { return { wall: '#C9D6E8', tiers: [[0, z * .5], [.2, z * .78], [.42, z]], g1: '#7FC0F0', g2: '#4F94D0', floor: 11, crown: 'crown', cc: '#E2B33C', base: 20, bcol: '#EEF1F5', band: '#E2B33C' }; });
  tw('titantower', 460, 540, function (z) { return { m: .18, wall: '#B3C6DC', tiers: [[0, z * .3], [.14, z * .52], [.3, z * .72], [.46, z * .88], [.62, z]], g1: '#7AC4F0', g2: '#4896D0', floor: 11, crown: 'spire', ch: 34, ant: 140, cc: '#E2B33C', base: 22, bcol: '#E4E8EE', band: '#E2B33C' }; });
  def('apexneedle', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = H(lv, 500, 580), cx = rw / 2, cy = rh / 2, i; g.box(.1, .1, rw - .2, rh - .2, 0, 22, '#E8EDF2'); g.cyl(cx, cy, .42, 22, z, '#CFE0F2', '#E4EEF8');
    [.25, .5, .72, .9].forEach(function (t, n) { var p = g.P(cx, cy, z * t), r = 26 - n * 4; g.ell(p[0], p[1] + 2, r, r * .36, '#8FAECF', INK); g.ell(p[0], p[1] - 2, r, r * .36, '#BBD6EE', INK); g.ell(p[0], p[1] - 6, r * .62, r * .2, '#6FB5E3'); glowAt(g, cx, cy, z * t, 18); });
    g.line(g.P(cx, cy, z), g.P(cx, cy, z + 150), '#E2B33C', 2); beacon(g, cx, cy, z + 150); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .22, 10, '#1F3A5F');
  });

  /* ═════════ DỊCH VỤ – HỌC ĐƯỜNG ═════════ */
  def('smarthospital', function (g, rw, rh, lv) {
    var z = H(lv, 120, 160); tower(g, rw, rh, { wall: '#F4F7FA', tiers: [[0, z * .55], [.34, z]], style: 'win', g1: '#BFE6F5', floor: 15, crown: 'helipad', base: 22, bcol: '#EAF0F6', band: '#2FB36D', after: function (g, rw, rh) { sign(g, rw / 2, rh - .08, z * .26, 12, '#E9573F', '+'); } });
  });
  def('futurelibrary', function (g, rw, rh, lv) {
    var z = H(lv, 100, 130); tower(g, rw, rh, { wall: '#F2EBDC', tiers: [[0, z * .7], [.3, z]], g1: '#9BE0F5', g2: '#6DC4E8', floor: 14, crown: 'dome', cc: '#7FC8F0', base: 18, bcol: '#E8DFCB', band: '#C9A96A', after: function (g, rw, rh) { sign(g, rw / 2, rh - .08, z * .35, 28, '#4F80BA', 'LIBRARY'); } });
  });
  def('innovuni', function (g, rw, rh, lv) {
    var z = H(lv, 190, 240); lot(g, rw, rh, '#A8D88E'); g.box(.08, .08, rw - .16, rh - .16, 0, 20, '#F0E6D2'); var a = (rw - .7) / 2;
    [[.2, z], [.5 + a, z * .66]].forEach(function (q, i) { g.box(q[0], .3, a, rh - .6, 20, q[1], '#C9785B'); g.winsL(q[0], .3, a, rh - .6, 24, q[1] - 3, 2, Math.round((q[1] - 24) / 14), { m: .2, col: '#F2E6D0' }); g.winsR(q[0], .3, a, rh - .6, 24, q[1] - 3, 2, Math.round((q[1] - 24) / 14), { m: .2, col: '#E4D6BE' }); g.hip(q[0], .3, a, rh - .6, q[1], q[1] + 18, '#8A5A33', .45); });
    g.line(g.P(.2 + a / 2, rh / 2, z + 18), g.P(.2 + a / 2, rh / 2, z + 46), '#8A5A33', 1.6); beacon(g, .2 + a / 2, rh / 2, z + 46); g.doorL(.08, .08, rw - .16, rh - .16, .5, 0, .22, 12, '#4A2E18'); g.tree(.2, rh - .1, .7); g.tree(rw - .2, rh - .1, .7, 'cherry');
  });
  def('scienceorb', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.2, .2, rw - .4, rh - .4, 0, 16, '#E8EDF2'); var z = 70 + lv * 14; orb(g, rw / 2, rh / 2, 16 + z * .5, z * .62, '#DFF7FF', '#4FA4DA', true); ring(g, rw / 2, rh / 2, 16 + z * .5, z * .9, z * .24, 'rgba(255,225,120,.9)', 2.4); g.doorL(.2, .2, rw - .4, rh - .4, .5, 0, .22, 10, '#1F3A5F'); glowAt(g, rw / 2, rh / 2, z * .6, 30); g.tree(.2, rh - .1, .6); g.tree(rw - .2, rh - .1, .6, 'cherry');
  });
  def('spaceobs', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var z = 70 + lv * 8; g.box(.15, .15, rw - .3, rh - .3, 0, z, '#E8E4F4'); g.winsL(.15, .15, rw - .3, rh - .3, 8, z - 6, 2, 3, { m: .22, col: '#BFD0F5' }); g.winsR(.15, .15, rw - .3, rh - .3, 8, z - 6, 2, 3, { m: .22, col: '#9FB6EB' }); g.flat(.15, .15, rw - .3, rh - .3, z, '#B8BED8', '#fff');
    var c = g.P(rw / 2, rh / 2, z); g.ell(c[0], c[1] - 14, 26, 15, '#F4F6FA', INK); g.poly([[c[0] - 5, c[1] - 26], [c[0] + 12, c[1] - 40], [c[0] + 17, c[1] - 34], [c[0] + 1, c[1] - 20]], '#6FB5E3', INK); g.line([c[0] + 15, c[1] - 38], [c[0] + 34, c[1] - 74], 'rgba(170,200,255,.8)', 2); glowAt(g, rw / 2, rh / 2, z + 10, 26); g.doorL(.15, .15, rw - .3, rh - .3, .5, 0, .22, 10, '#1F3A5F');
  });
  def('airesearch', function (g, rw, rh, lv) {
    var z = H(lv, 160, 200); tower(g, rw, rh, { wall: '#E4ECF4', tiers: [[0, z * .6], [.3, z]], g1: '#8FE0D0', g2: '#5FC4B2', floor: 12, crown: 'dome', cc: '#9FDBF5', base: 18, bcol: '#EDEFF2', band: '#7A4BC7', after: function (g, rw, rh) { glowAt(g, rw / 2, rh / 2, z * .5, 30); sign(g, rw / 2, rh - .08, z * .3, 12, '#7A4BC7', 'AI'); } });
  });
  def('megaacademy', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#8ED067'); var z = 40 + lv * 6; g.box(.1, .3, rw - .2, rh - .5, 0, z, '#F2E6D0'); g.winsL(.1, .3, rw - .2, rh - .5, 6, z - 4, 6, 2, { m: .2 }); g.winsR(.1, .3, rw - .2, rh - .5, 6, z - 4, 4, 2, { m: .2 }); g.flat(.1, .3, rw - .2, rh - .5, z, '#C9B58A', '#E8DFCB');
    g.box(rw / 2 - .6, .4, 1.2, rh - .7, z, z + 50, '#C9785B'); g.winsL(rw / 2 - .6, .4, 1.2, rh - .7, z + 4, z + 46, 3, 3, { m: .2, col: '#F2E6D0' }); g.hip(rw / 2 - .65, .35, 1.3, rh - .6, z + 50, z + 78, '#3E6FB0', .45); var c = g.P(rw / 2, rh - .08, z + 36); g.ell(c[0], c[1], 8, 8, '#fff', INK); g.line([c[0], c[1]], [c[0], c[1] - 5], '#333', 1.2); g.line([c[0], c[1]], [c[0] + 4, c[1]], '#333', 1.2);
    g.line(g.P(rw / 2, rh / 2, z + 78), g.P(rw / 2, rh / 2, z + 100), '#E2B33C', 1.8); beacon(g, rw / 2, rh / 2, z + 100); g.doorL(.1, .3, rw - .2, rh - .5, .5, 0, .3, 14, '#4A2E18'); g.tree(.2, rh - .1, .8); g.tree(rw - .2, rh - .1, .8, 'cherry');
  });

  /* ═════════ VUI CHƠI – THỂ THAO ═════════ */
  def('megawheel', function (g, rw, rh, lv) { wheel(g, rw, rh, { z: 150 + lv * 20, R: 78 + lv * 6 }); });
  def('skycoaster', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); var c = g.c, i, pts = [], steps = 34; for (i = 0; i <= steps; i++) { var t = i / steps; pts.push(g.P(.3 + t * (rw - .6), rh * .5 + Math.sin(t * 9) * rh * .28, 20 + (Math.sin(t * Math.PI * 2.4) * .5 + .5) * (80 + lv * 14))); }
    c.beginPath(); pts.forEach(function (p, k) { g.ext(p[0], p[1], 4); if (k) c.lineTo(p[0], p[1]); else c.moveTo(p[0], p[1]); }); c.strokeStyle = '#E9573F'; c.lineWidth = 3.4; c.lineJoin = 'round'; c.stroke();
    pts.forEach(function (p, k) { if (k % 3 === 0) { var b = g.P(.3 + k / steps * (rw - .6), rh * .5 + Math.sin(k / steps * 9) * rh * .28, 0); g.line(p, b, '#8A94A4', 1.2); } }); var tp = pts[10]; g.ell(tp[0], tp[1] - 4, 7, 3.4, '#FFE066', INK); g.ell(pts[22][0], pts[22][1] - 4, 7, 3.4, '#4F80BA', INK); g.box(.2, .2, 1.1, .8, 0, 16, '#F2E6D0'); g.glassL(.2, .2, 1.1, .8, 3, 13, 1, '#8FD0F0'); g.tree(rw - .3, rh - .2, .7); g.tree(.3, rh - .2, .7, 'cherry');
  });
  def('aquadome', function (g, rw, rh, lv) { domebld(g, rw, rh, { lot: '#6EC8E8', base: 10, bcol: '#E8F4FA', trees: 5, inside: [[-.4, -.3, .7, .7, 36, '#F2D27A'], [.4, .2, .6, .6, 50, '#7FC8F0']], spire: 18 }); });
  def('neonarena', function (g, rw, rh, lv) { stadium(g, rw, rh, { z: 34 + lv * 6, wall: '#2A2144', roof: '#5BE0FF', mast: 52, sign: ['#7A5BFF', 'NEON'] }); });
  def('olympicstadium', function (g, rw, rh, lv) { stadium(g, rw, rh, { z: 50 + lv * 8, wall: '#E8EEF4', roof: '#E9573F', mast: 80, sign: ['#4F80BA', 'OLYMPIC'] }); });
  def('vrpark', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); g.box(.15, .15, rw - .3, rh * .45, 0, 40, '#2A2D4A'); g.glassL(.15, .15, rw - .3, rh * .45, 4, 36, 2, '#8A6BFF'); g.glassR(.15, .15, rw - .3, rh * .45, 4, 36, 2, '#5A4BE0'); g.flat(.15, .15, rw - .3, rh * .45, 40, '#3A3E62', '#8A94C8');
    var c = g.P(rw * .3, rh * .75, 0), k; for (k = 0; k < 3; k++) { var p = g.P(rw * (.25 + k * .25), rh * .78, 0); orb(g, rw * (.25 + k * .25), rh * .78, 30 + k * 10, 14 + k * 3, ['#FFB0E0', '#B0F0FF', '#FFF0A0'][k], ['#E04FA8', '#4FA4E0', '#E0B040'][k], true); g.line(p, g.P(rw * (.25 + k * .25), rh * .78, 18 + k * 10), '#8A94A4', 2); } sign(g, rw / 2, rh * .6, 24, 24, '#7A4BC7', 'VR'); glowAt(g, rw / 2, rh * .3, 30, 36); g.doorL(.15, .15, rw - .3, rh * .45, .5, 0, .24, 10, '#5BE0FF');
  });
  tw('lasertower', 250, 310, function (z) { return { wall: '#26304A', tiers: [[0, z * .6], [.3, z]], g1: '#5BFFB0', g2: '#3AD8FF', floor: 10, crown: 'antenna', ant: 100, base: 14, bcol: '#3A4562', band: '#FF3DAA', after: function (g, rw, rh) { glowAt(g, rw / 2, rh / 2, z * .5, 34); } }; });

  /* ═════════ CÔNG NGHIỆP – NĂNG LƯỢNG – GIAO THÔNG ═════════ */
  def('solarpark', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B8C48A'); var i, j, nx = Math.max(2, Math.round(rw)), ny = Math.max(2, Math.round(rh)); for (j = 0; j < ny; j++) for (i = 0; i < nx; i++) { var x = .12 + i * (rw - .2) / nx, y = .12 + j * (rh - .2) / ny, w = (rw - .2) / nx - .1, h = (rh - .2) / ny - .1; g.poly([g.P(x, y, 8), g.P(x + w, y, 8), g.P(x + w, y + h, 15 + lv * 2), g.P(x, y + h, 15 + lv * 2)], '#27408B', INK); g.line(g.P(x + w / 2, y, 8), g.P(x + w / 2, y + h, 15 + lv * 2), 'rgba(160,190,255,.6)', 1); g.line(g.P(x, y + h / 2, 11), g.P(x + w, y + h / 2, 11), 'rgba(160,190,255,.45)', 1); }
    g.box(rw - .6, rh - .5, .45, .35, 0, 14, '#D8DEE6'); beacon(g, rw - .4, rh - .35, 18);
  });
  def('windfield', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#A8D88E'); [[.25, .3], [.7, .3], [.3, .75], [.75, .72]].forEach(function (q, n) { var cx = rw * q[0], cy = rh * q[1], p = g.P(cx, cy, 0), th = 78 + (n % 2) * 14; g.ell(p[0], p[1] + 2, 8, 3.4, 'rgba(30,60,30,.22)'); g.poly([[p[0] - 3.4, p[1]], [p[0] + 3.4, p[1]], [p[0] + 1.6, p[1] - th], [p[0] - 1.6, p[1] - th]], '#F4F6FA', INK); var t = g.P(cx, cy, th); g.ell(t[0], t[1], 3.4, 3.4, '#E4E8EE', INK); g.ext(t[0], t[1], 30); g.meta.rot.push([t[0], t[1], 'turbine', 30, n]); });
  });
  def('smartfactory', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); var z = 40 + lv * 8; g.box(.1, .1, rw - .2, rh - .2, 0, z, '#E8EDF2'); g.glassL(.1, .1, rw - .2, rh - .2, 6, z - 4, 2, '#7FC8F0'); g.glassR(.1, .1, rw - .2, rh - .2, 6, z - 4, 2, '#5BA8D8'); g.flat(.1, .1, rw - .2, rh - .2, z, '#9AA4B2', '#E2E8F0');
    [[.3, .3], [.6, .6]].forEach(function (q) { g.box(rw * q[0], rh * q[1], .5, .5, z, z + 14, '#2FB36D'); g.cyl(rw * q[0] + .25, rh * q[1] + .25, .12, z + 14, z + 40, '#C9D1D9'); }); g.line(g.P(.3, rh * .5, z + 20), g.P(rw - .3, rh * .5, z + 20), '#FF8A1F', 2); sign(g, rw / 2, rh - .08, z * .5, 26, '#2FB36D', 'SMART'); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .3, 12, '#4A5A70'); glowAt(g, rw / 2, rh / 2, z * .5, 26);
  });
  def('datahub', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); var z = 30 + lv * 6; g.box(.1, .15, rw - .2, rh - .3, 0, z, '#2A3446'); g.winsL(.1, .15, rw - .2, rh - .3, 6, z - 4, 8, 1, { m: .2, col: '#5BE0FF' }); g.winsR(.1, .15, rw - .2, rh - .3, 6, z - 4, 5, 1, { m: .2, col: '#3AB4D8' }); g.flat(.1, .15, rw - .2, rh - .3, z, '#4A5A70', '#8A94A8');
    var i; for (i = 0; i < 4; i++) g.box(.3 + i * (rw - .8) / 4, .3, (rw - .8) / 4 - .1, .5, z, z + 8, '#8E96A3'); g.line(g.P(.2, rh * .5, z + 6), g.P(rw - .2, rh * .5, z + 6), '#5BE0FF', 1.6); glowAt(g, rw / 2, rh / 2, z * .5, 30); g.doorL(.1, .15, rw - .2, rh - .3, .5, 0, .24, 12, '#5BE0FF');
  });
  def('hyperloop', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.2, .5, rw - .4, rh - 1, 0, 36, '#E8EDF2'); g.glassL(.2, .5, rw - .4, rh - 1, 4, 32, 1, '#8FD0F0'); g.glassR(.2, .5, rw - .4, rh - 1, 4, 32, 1, '#6DB6DC'); g.flat(.2, .5, rw - .4, rh - 1, 36, '#C9D1DA', '#fff');
    var a = g.P(0, rh / 2, 44), b = g.P(rw, rh / 2, 44); g.c.lineCap = 'round'; g.line(a, b, '#B9C6D8', 14); g.line(a, b, '#E8F0F8', 9); g.line([a[0] + (b[0] - a[0]) * .3, a[1] + (b[1] - a[1]) * .3 - 1], [a[0] + (b[0] - a[0]) * .55, a[1] + (b[1] - a[1]) * .55 - 1], '#E9573F', 7); [.1, .5, .9].forEach(function (t) { var p = g.P(rw * t, rh / 2, 44); g.line(p, g.P(rw * t, rh / 2, 0), '#8A94A4', 3); });
    sign(g, rw / 2, rh - .45, 20, 30, '#E9573F', 'HYPERLOOP'); g.doorL(.2, .5, rw - .4, rh - 1, .5, 0, .26, 12, '#1F3A5F');
  });
  def('fusionreactor', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#9AA2AE'); g.box(.1, .1, rw - .2, rh - .2, 0, 20, '#8E96A3'); var cx = rw / 2, cy = rh / 2, p = orb(g, cx, cy, 70, 40, '#F4FBFF', '#7FB8E0', false); ring(g, cx, cy, 70, 52, 17, 'rgba(255,200,80,.95)', 3.6); ring(g, cx, cy, 70, 44, 40, 'rgba(120,230,255,.9)', 2.4);
    var q = g.P(cx, cy, 20); g.poly([[q[0] - 18, q[1]], [q[0] + 18, q[1]], [p[0] + 12, p[1] + 28], [p[0] - 12, p[1] + 28]], '#B8C3D2', INK); glowAt(g, cx, cy, 70, 46); orb(g, cx, cy, 70, 14, '#FFFFFF', '#6FE0FF', false); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .24, 10, '#FFB02E');
  });
  def('maglev', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.2, .6, rw - .4, rh - 1.2, 0, 34, '#F4F7FA'); g.glassL(.2, .6, rw - .4, rh - 1.2, 4, 30, 1, '#9FD8F0'); g.glassR(.2, .6, rw - .4, rh - 1.2, 4, 30, 1, '#6DB6DC'); g.flat(.2, .6, rw - .4, rh - 1.2, 34, '#C9D1DA', '#fff');
    var a = g.P(0, rh / 2, 42), b = g.P(rw, rh / 2, 42); g.line(a, b, '#8A94A4', 5); var t0 = .15, t1 = .6; g.poly([g.P(rw * t0, rh / 2 - .2, 46), g.P(rw * t1, rh / 2 - .2, 46), g.P(rw * t1 + .2, rh / 2 + .1, 52), g.P(rw * t0, rh / 2 + .1, 52)], '#E8EEF4', INK); g.line(g.P(rw * t0 + .1, rh / 2, 49), g.P(rw * t1, rh / 2, 49), '#4F80BA', 3); [.1, .5, .9].forEach(function (t) { g.line(g.P(rw * t, rh / 2, 42), g.P(rw * t, rh / 2, 0), '#8A94A4', 3); }); sign(g, rw / 2, rh - .55, 18, 26, '#4F80BA', 'MAGLEV'); g.doorL(.2, .6, rw - .4, rh - 1.2, .5, 0, .24, 12, '#1F3A5F');
  });
  def('spaceport', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.2, rh - 1.5, 2.2, 1.2, 0, 34, '#E8EDF2'); g.glassL(.2, rh - 1.5, 2.2, 1.2, 4, 30, 1, '#8FD0F0'); g.flat(.2, rh - 1.5, 2.2, 1.2, 34, '#C9D1DA', '#fff'); var cx = rw * .62, cy = rh * .4, p = g.P(cx, cy, 0), q = g.P(cx, cy, 340);
    [-12, 12].forEach(function (d) { g.line([p[0] + d, p[1]], [q[0] + d * .5, q[1]], '#8A94A4', 2.6); }); var j; for (j = 1; j < 10; j++) { var a = g.P(cx, cy, j * 34); g.line([a[0] - 11, a[1]], [a[0] + 11, a[1]], '#8A94A4', 1.2); }
    var rx = cx + .9, rp = g.P(rx, cy + .2, 0), rt = g.P(rx, cy + .2, 250); g.poly([[rp[0] - 9, rp[1]], [rp[0] + 9, rp[1]], [rt[0] + 8, rt[1]], [rt[0] - 8, rt[1]]], '#F4F6FA', INK); g.poly([[rt[0] - 8, rt[1]], [rt[0] + 8, rt[1]], [rt[0], rt[1] - 40]], '#E9573F', INK); [-1, 1].forEach(function (d) { g.poly([[rp[0] + d * 8, rp[1] - 34], [rp[0] + d * 22, rp[1] + 2], [rp[0] + d * 8, rp[1] - 6]], '#E9573F', INK); }); glowAt(g, rx, cy + .2, 6, 20); sign(g, 1.3, rh - .3, 20, 26, '#4F80BA', 'SPACE'); g.doorL(.2, rh - 1.5, 2.2, 1.2, .5, 0, .2, 10, '#1F3A5F');
  });
  def('airshiphub', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var cx = rw * .5, cy = rh * .5, mast = g.P(rw * .2, rh * .5, 0), top = g.P(rw * .2, rh * .5, 200); g.poly([[mast[0] - 9, mast[1]], [mast[0] + 9, mast[1]], [top[0] + 4, top[1]], [top[0] - 4, top[1]]], '#DDE6F0', INK); beacon(g, rw * .2, rh * .5, 206);
    var ap = g.P(cx + 1, cy, 190), c = g.c; g.ext(ap[0], ap[1], 80); c.beginPath(); c.ellipse(ap[0], ap[1], 70, 22, -.18, 0, TAU); var gr = c.createLinearGradient(0, ap[1] - 22, 0, ap[1] + 22); gr.addColorStop(0, '#F4F7FA'); gr.addColorStop(1, '#9FB6D0'); c.fillStyle = gr; c.fill(); c.strokeStyle = INK; c.lineWidth = 1.2; c.stroke(); c.fillStyle = '#E9573F'; c.fillRect(ap[0] - 20, ap[1] + 9, 40, 5); c.fillStyle = '#6FB5E3'; c.fillRect(ap[0] - 12, ap[1] + 14, 24, 7); g.line([top[0], top[1]], [ap[0] - 66, ap[1] - 2], '#8A94A4', 1.4); g.box(.2, rh - 1.2, 2.4, .9, 0, 30, '#F0F2F5'); g.glassL(.2, rh - 1.2, 2.4, .9, 4, 26, 1, '#8FD0F0'); g.flat(.2, rh - 1.2, 2.4, .9, 30, '#C9D1DA', '#fff'); g.doorL(.2, rh - 1.2, 2.4, .9, .5, 0, .2, 10, '#1F3A5F');
  });

  /* ═════════ KỲ QUAN – HUYỀN THOẠI ═════════ */
  def('dragonpagoda', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B8D8A0'); var n = 6 + lv, i, cx = rw / 2, cy = rh / 2; for (i = 0; i < n; i++) { var s = 1 - i * .11, w = (rw - .5) * s, h = (rh - .5) * s, x = cx - w / 2, y = cy - h / 2, z0 = i * 30, z1 = z0 + 18; g.box(x + .06, y + .06, w - .12, h - .12, z0, z1, '#F2E6C8'); g.winsL(x + .06, y + .06, w - .12, h - .12, z0 + 3, z1 - 2, 2, 1, { m: .2, col: '#C0392B' }); g.hip(x - .08, y - .08, w + .16, h + .16, z1, z1 + 12, i % 2 ? '#C0392B' : '#B8862A', .12); }
    g.line(g.P(cx, cy, n * 30), g.P(cx, cy, n * 30 + 28), '#E2B33C', 2); beacon(g, cx, cy, n * 30 + 28); g.doorL(.25, .25, rw - .5, rh - .5, .5, 0, .24, 12, '#8A1F18'); g.tree(.2, rh - .1, .7, 'cherry'); g.tree(rw - .2, rh - .1, .7, 'cherry'); glowAt(g, cx, cy, n * 15, 30);
  });
  def('crystalpalace', function (g, rw, rh, lv) { domebld(g, rw, rh, { lot: '#A8D88E', base: 12, bcol: '#F4EEE0', trees: 4, g1: 'rgba(255,205,110,.8)', g2: 'rgba(240,160,60,.6)', inside: [[-.5, -.2, .6, .6, 40, '#F0E2C0'], [.2, -.1, .7, .7, 56, '#E9D6A8']], spire: 26 }); });
  def('goldpyramid', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#E8D79A'); var z = 120 + lv * 30, x = .12, y = .12, w = rw - .24, h = rh - .24; g.hip(x, y, w, h, 0, z, '#E2B33C', .5); g.poly(g.faceL(x + .1, y + .1, w - .2, h - .2, 0, 0).slice(0, 0).concat([g.P(x, y + h, 0), g.P(x + w, y + h, 0), g.P(x + w / 2, y + h / 2, z)]), 'rgba(255,240,170,.35)'); g.line(g.P(x + w / 2, y + h / 2, z), g.P(x + w / 2, y + h / 2, z + 40), '#FFF3B0', 2); orb(g, x + w / 2, y + h / 2, z + 44, 7, '#FFFFFF', '#FFD54A', false); glowAt(g, x + w / 2, y + h / 2, z + 44, 36); g.doorL(x, y, w, h, .5, 0, .2, 12, '#7A4B2A');
  });
  def('timetower', function (g, rw, rh, lv) {
    var z = H(lv, 220, 280); tower(g, rw, rh, { wall: '#E8DFCB', tiers: [[0, z * .7], [.3, z]], style: 'win', g1: '#F2E6D0', floor: 15, crown: 'spire', ch: 34, cc: '#3E6FB0', ant: 50, base: 20, bcol: '#D8CBA8', band: '#C9A96A', after: function (g, rw, rh) { var c = g.P(rw / 2, rh - .1, z * .8); g.ell(c[0], c[1], 13, 13, '#fff', INK); g.line([c[0], c[1]], [c[0], c[1] - 9], '#333', 1.6); g.line([c[0], c[1]], [c[0] + 6, c[1] + 2], '#333', 1.6); glowAt(g, rw / 2, rh - .1, z * .8, 22); } });
  });
  def('holostatue', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.3, .3, rw - .6, rh - .6, 0, 22, '#2A3446'); g.flat(.3, .3, rw - .6, rh - .6, 22, '#4A5A70', '#5BE0FF'); var p = g.P(rw / 2, rh / 2, 22), c = g.c, h = 90 + lv * 20; g.ext(p[0], p[1] - h - 20, 40);
    var gr = c.createLinearGradient(0, p[1] - h, 0, p[1]); gr.addColorStop(0, 'rgba(120,240,255,.85)'); gr.addColorStop(1, 'rgba(120,240,255,.25)'); c.fillStyle = gr; c.beginPath(); c.moveTo(p[0] - 14, p[1]); c.lineTo(p[0] - 10, p[1] - h * .55); c.lineTo(p[0] - 26, p[1] - h * .8); c.lineTo(p[0] - 18, p[1] - h * .84); c.lineTo(p[0] - 6, p[1] - h * .7); c.lineTo(p[0] - 5, p[1] - h * .9); c.arc(p[0], p[1] - h * .96, 8, Math.PI, 0); c.lineTo(p[0] + 6, p[1] - h * .7); c.lineTo(p[0] + 10, p[1] - h * .55); c.lineTo(p[0] + 14, p[1]); c.closePath(); c.fill(); c.strokeStyle = 'rgba(200,255,255,.9)'; c.lineWidth = 1; c.stroke();
    for (var k = 0; k < 8; k++) g.line([p[0] - 14, p[1] - k * h / 8], [p[0] + 14, p[1] - k * h / 8], 'rgba(255,255,255,.35)', 1); ring(g, rw / 2, rh / 2, 22, 22, 9, 'rgba(120,240,255,.9)', 2); glowAt(g, rw / 2, rh / 2, 22 + h * .5, 44); g.doorL(.3, .3, rw - .6, rh - .6, .5, 0, .22, 10, '#5BE0FF');
  });
  def('floatingisle', function (g, rw, rh, lv) {
    var cx = rw / 2, cy = rh / 2, sh = g.P(cx, cy, 0), top = g.P(cx, cy, 200 + lv * 20), c = g.c, R = (rw + rh) * 12; g.ell(sh[0], sh[1] + 2, R * .8, R * .3, 'rgba(20,30,50,.3)'); g.ext(top[0], top[1] - 120, R + 10);
    g.poly([[top[0] - R, top[1]], [top[0] + R, top[1]], [top[0] + R * .5, top[1] + 60], [top[0], top[1] + 130], [top[0] - R * .5, top[1] + 60]], '#8A6A4A', INK); g.poly([[top[0] - R * .2, top[1]], [top[0] + R * .45, top[1]], [top[0] + R * .2, top[1] + 90], [top[0], top[1] + 125]], '#6F5238'); g.ell(top[0], top[1], R, R * .42, '#6FC46A', INK); g.ell(top[0] + R * .25, top[1] - 2, R * .34, R * .14, '#5BC6E8');
    [[-.45, -.1, 54], [-.1, -.3, 76], [.35, -.05, 44]].forEach(function (b, i) { var bx = top[0] + R * b[0], by = top[1] + R * b[1] * .4; g.poly([[bx - 9, by], [bx + 9, by], [bx + 9, by - b[2]], [bx - 9, by - b[2]]], ['#EAF2F8', '#F4EBD8', '#DDE9F4'][i], INK); g.poly([[bx - 9, by - b[2]], [bx + 9, by - b[2]], [bx, by - b[2] - 14]], '#4F80BA', INK); });
    [[-.7, .05], [.6, .12], [-.2, .12], [.05, -.02]].forEach(function (t) { var tx = top[0] + R * t[0], ty = top[1] + R * t[1] * .4; g.ell(tx, ty - 6, 6, 5, '#3FA55B', INK); g.line([tx, ty], [tx, ty - 4], '#8A5A33', 1.6); });
    g.line([top[0] + R * .55, top[1] + 4], [top[0] + R * .55, top[1] + 120], 'rgba(160,220,255,.8)', 4); glowAt(g, cx, cy, 230 + lv * 20, 50); g.line(sh, [top[0], top[1] + 120], 'rgba(255,255,255,.18)', 2);
  });
  def('atlantis', function (g, rw, rh, lv) { domebld(g, rw, rh, { lot: '#5BB8E0', base: 12, bcol: '#CFE9F5', trees: 6, g1: 'rgba(60,200,245,.8)', g2: 'rgba(20,110,200,.62)', h: (rw + rh) * 15, inside: [[-.9, -.3, .7, .7, 60, '#F0D8A0'], [-.1, -.5, .8, .8, 90, '#E8EEF4'], [.7, -.1, .7, .7, 66, '#F0D8A0'], [-.3, .5, .6, .6, 48, '#C9E6F2']], spire: 30 }); });
  def('dysonmonument', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); g.box(.3, .3, rw - .6, rh - .6, 0, 20, '#E8EDF2'); var cx = rw / 2, cy = rh / 2, z = 150 + lv * 20; [[-.8, 0], [.8, 0]].forEach(function (d) { g.line(g.P(cx + d[0], cy, 20), g.P(cx + d[0] * .2, cy, z), '#C9D1DA', 5); });
    var p = orb(g, cx, cy, z, 46, '#FFF7C8', '#F5A623', false); ring(g, cx, cy, z, 66, 18, 'rgba(255,230,140,.95)', 3); ring(g, cx, cy, z, 52, 52, 'rgba(255,255,255,.55)', 1.4); ring(g, cx, cy, z, 40, 62, 'rgba(255,200,90,.75)', 1.6); glowAt(g, cx, cy, z, 60); beacon(g, cx, cy, z + 56);
    g.doorL(.3, .3, rw - .6, rh - .6, .5, 0, .22, 10, '#8A5A00');
  });
  def('spaceelevator', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#B9B3A6'); var cx = rw / 2, cy = rh / 2, z = 820 + lv * 40; g.box(.1, .1, rw - .2, rh - .2, 0, 26, '#E8EDF2'); g.glassL(.1, .1, rw - .2, rh - .2, 4, 22, 1, '#8FD0F0'); g.cyl(cx, cy, .14, 26, z, '#DDE6F0', '#EEF3F8'); g.line(g.P(cx, cy, 26), g.P(cx, cy, z), 'rgba(120,240,255,.55)', 1.2);
    [.2, .45, .7].forEach(function (t) { var p = g.P(cx, cy, z * t); g.ell(p[0], p[1], 7, 3, '#E9573F', INK); g.ell(p[0], p[1] - 3, 5, 2, '#FFE066'); glowAt(g, cx, cy, z * t, 14); });
    var top = ring(g, cx, cy, z, 46, 15, '#B8C3D2', 5); ring(g, cx, cy, z, 46, 15, 'rgba(120,240,255,.8)', 1.6); orb(g, cx, cy, z, 11, '#FFFFFF', '#8FC8F0', false); beacon(g, cx, cy, z + 24); glowAt(g, cx, cy, z, 50); g.doorL(.1, .1, rw - .2, rh - .2, .5, 0, .22, 10, '#1F3A5F');
  });
  def('worldtree', function (g, rw, rh, lv) {
    var cx = rw / 2, cy = rh / 2, p = g.P(cx, cy, 0), c = g.c, R = (rw + rh) * 11, th = 190 + lv * 30, k; lot(g, rw, rh, '#7FC46A'); g.ell(p[0], p[1] + 4, R * .6, R * .22, 'rgba(20,40,20,.3)'); g.ext(p[0], p[1] - th - R * .7, R + 20);
    c.fillStyle = '#7A5230'; c.strokeStyle = INK; c.lineWidth = 1.2; c.beginPath(); c.moveTo(p[0] - 46, p[1] + 4); c.bezierCurveTo(p[0] - 20, p[1] - th * .3, p[0] - 22, p[1] - th * .7, p[0] - 14, p[1] - th); c.lineTo(p[0] + 14, p[1] - th); c.bezierCurveTo(p[0] + 22, p[1] - th * .7, p[0] + 20, p[1] - th * .3, p[0] + 46, p[1] + 4); c.closePath(); c.fill(); c.stroke();
    for (k = 0; k < 18; k++) { var an = k * 2.4, rr = R * (.3 + (k % 5) * .13), bx = p[0] + Math.cos(an) * rr, by = p[1] - th - 10 - Math.abs(Math.sin(an * 1.3)) * R * .5; g.ell(bx, by, R * .46, R * .32, ['#2F8F52', '#3FA55B', '#63C277', '#56B86A'][k % 4], INK); }
    for (k = 0; k < 10; k++) { var a2 = k * 1.7, bx2 = p[0] + Math.cos(a2) * R * .62, by2 = p[1] - th + Math.sin(a2) * R * .22; g.ell(bx2, by2, 3, 3, '#FFE066'); g.glow.push({ c: [bx2, by2], r: 10 }); }
    g.ell(p[0], p[1] - th - R * .3, R * .22, R * .12, 'rgba(255,255,255,.28)'); glowAt(g, cx, cy, th, 60); g.doorL(.1, .1, .2, .2, .5, 0, .1, 4, '#4A2E18');
  });
  def('citygod', function (g, rw, rh, lv) {
    lot(g, rw, rh, '#E8E4D8'); g.box(.2, .2, rw - .4, rh - .4, 0, 18, '#F4EEDD'); g.box(.7, .7, rw - 1.4, rh - 1.4, 18, 40, '#E8DFCB'); var cx = rw / 2, cy = rh / 2, z = 280 + lv * 40; g.box(cx - .22, cy - .22, .44, .44, 40, z, '#E2B33C', { top: '#FFF0B0' }); var tp = g.P(cx, cy, z);
    g.poly([[tp[0] - 14, tp[1]], [tp[0] + 14, tp[1]], [tp[0], tp[1] - 34]], '#FFD54A', INK); orb(g, cx, cy, z + 56, 16, '#FFFFFF', '#FFC83A', false); ring(g, cx, cy, z + 56, 36, 11, 'rgba(255,230,140,.95)', 2.4); var k; for (k = 0; k < 12; k++) { var an = k * TAU / 12, q = g.P(cx, cy, z + 56); g.line([q[0] + Math.cos(an) * 22, q[1] + Math.sin(an) * 22], [q[0] + Math.cos(an) * 46, q[1] + Math.sin(an) * 46], 'rgba(255,240,170,.7)', 1.4); }
    glowAt(g, cx, cy, z + 56, 64); beacon(g, cx, cy, z + 100); g.tree(.2, rh - .1, .8, 'cherry'); g.tree(rw - .2, rh - .1, .8, 'cherry'); g.doorL(.2, .2, rw - .4, rh - .4, .5, 0, .3, 10, '#8A5A00');
  });
  A.kit4 = { tw: tw, twist: twist, terrace: terrace, vforest: vforest, domebld: domebld, stadium: stadium, wheel: wheel };
})(typeof window !== 'undefined' ? window : this);
