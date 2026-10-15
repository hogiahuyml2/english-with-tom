/* EWT City — ĐỒ HOẠ phần 10: VẼ LẠI KỸ một số món trước đây còn đơn giản (nón lá, xích lô, tượng Phật, nhà mái sóng, rồng…). Chạy sau art6–9 và ghi đè. */
(function (root) {
  'use strict';
  var A = root.EWTCityArt; if (!A || !A.kit || !A.kit6 || !A.kit8) return;
  var K = A.kit, lot = K.lot, def = K.def, INK = K.INK, shade = A.shade, D = A.kit6.deco, TAU = Math.PI * 2, big = A.kit6.big;
  var sh = function (g, c, r) { g.ell(c[0], c[1] + 2, r, r * .42, 'rgba(30,60,30,.25)'); };
  var grad = function (g, x0, y0, x1, y1, stops) { var q = g.c.createLinearGradient(x0, y0, x1, y1); stops.forEach(function (s) { q.addColorStop(s[0], s[1]); }); return q; };

  D.nonla = function (g, rw, rh, c) {   // nón lá: chóp nón có sườn, viền nón, quai đỏ, đặt trên giá gỗ
    sh(g, c, 13); g.poly([[c[0] - 5, c[1]], [c[0] + 5, c[1]], [c[0] + 3, c[1] - 6], [c[0] - 3, c[1] - 6]], '#8A5A33', INK);
    var x = c[0], y = c[1] - 8, c2 = g.c;
    c2.beginPath(); c2.moveTo(x - 17, y); c2.lineTo(x, y - 17); c2.lineTo(x + 17, y); c2.ellipse(x, y, 17, 6, 0, 0, Math.PI, false); c2.closePath();
    c2.fillStyle = grad(g, x - 17, 0, x + 17, 0, [[0, '#E8C86A'], [.45, '#FBEFB4'], [1, '#CFA64A']]); c2.fill(); c2.strokeStyle = INK; c2.lineWidth = 1; c2.stroke(); g.ext(x, y - 17, 18);
    [-12, -6, 0, 6, 12].forEach(function (d) { g.line([x, y - 17], [x + d, y + 3 + (6 - Math.abs(d) * .3)], 'rgba(150,110,30,.5)', .9); });
    c2.strokeStyle = '#B8452E'; c2.lineWidth = 1.4; c2.beginPath(); c2.ellipse(x, y, 17, 6, 0, 0, Math.PI, false); c2.stroke();
    c2.strokeStyle = '#C9302B'; c2.lineWidth = 1.6; c2.beginPath(); c2.moveTo(x - 10, y + 2); c2.quadraticCurveTo(x - 6, y + 12, x, y + 8); c2.quadraticCurveTo(x + 6, y + 12, x + 10, y + 2); c2.stroke();
    g.ell(x, y - 18, 1.8, 1.8, '#B8452E');
  };
  D.cyclo = function (g, rw, rh, c) {   // xích lô: 2 bánh trước nhỏ, ghế khách có mui sọc, xe đạp phía sau
    sh(g, c, 17); var x = c[0], y = c[1], c2 = g.c;
    var wheel = function (cx, cy, r) { c2.strokeStyle = '#2E2E3A'; c2.lineWidth = 1.8; c2.beginPath(); c2.arc(cx, cy, r, 0, TAU); c2.stroke(); c2.lineWidth = .7; for (var k = 0; k < 4; k++) { c2.beginPath(); c2.moveTo(cx - Math.cos(k) * r, cy - Math.sin(k) * r); c2.lineTo(cx + Math.cos(k) * r, cy + Math.sin(k) * r); c2.stroke(); } g.ext(cx, cy, r + 2); };
    wheel(x + 14, y - 5, 5.6);                                          // bánh sau (xe đạp)
    g.poly([[x - 14, y - 12], [x + 2, y - 12], [x + 0, y - 3], [x - 12, y - 3]], '#D9302B', INK);                    // thân ghế khách
    g.poly([[x - 15, y - 12], [x + 3, y - 12], [x - 1, y - 20], [x - 13, y - 20]], '#FFD84A', INK);               // mui
    [0, 1, 2].forEach(function (i) { g.poly([[x - 14 + i * 5, y - 12], [x - 11 + i * 5, y - 12], [x - 10 + i * 5, y - 19], [x - 12 + i * 5, y - 19]], '#fff', false); });
    wheel(x - 10, y - 3.4, 4); wheel(x - 1, y - 3.4, 4);                // hai bánh trước
    g.line([x + 2, y - 4], [x + 14, y - 6], '#4B4F5A', 1.8); g.line([x + 11, y - 6], [x + 9, y - 14], '#4B4F5A', 1.6); g.line([x + 7, y - 15], [x + 12, y - 15], '#4B4F5A', 1.8);
    g.ell(x + 10, y - 17, 2.4, 2.8, '#F2C7A0', INK); g.poly([[x + 7, y - 15], [x + 12, y - 15], [x + 11, y - 9], [x + 8, y - 9]], '#4F80BA', INK);   // người đạp
  };
  var buddha = function (g, rw, rh, c, s) {   // tượng Phật ngồi toạ thiền trên đài sen, có vầng hào quang
    s = s || 1; sh(g, c, 13 * s); var x = c[0], y = c[1], c2 = g.c, i;
    for (i = -2; i <= 2; i++) g.ell(x + i * 5 * s, y - 2 * s + Math.abs(i) * .8, 4.4 * s, 3 * s, i % 2 ? '#FFB7CE' : '#FF9EBB', INK);       // cánh sen
    g.ell(x, y - 6 * s, 12 * s, 4 * s, '#E2B33C', INK);
    c2.beginPath(); c2.ellipse(x, y - 17 * s, 9 * s, 12 * s, 0, 0, TAU); c2.fillStyle = 'rgba(255,230,120,.28)'; c2.fill();            // hào quang
    g.glow.push({ c: [x, y - 18 * s], r: 22 * s });
    c2.beginPath(); c2.moveTo(x - 10 * s, y - 6 * s); c2.quadraticCurveTo(x - 9 * s, y - 20 * s, x - 3 * s, y - 24 * s); c2.lineTo(x + 3 * s, y - 24 * s); c2.quadraticCurveTo(x + 9 * s, y - 20 * s, x + 10 * s, y - 6 * s); c2.closePath();
    c2.fillStyle = grad(g, x - 10 * s, 0, x + 10 * s, 0, [[0, '#D99A1E'], [.5, '#F8CF5A'], [1, '#C98A12']]); c2.fill(); c2.strokeStyle = INK; c2.lineWidth = 1; c2.stroke();
    g.ell(x, y - 13 * s, 5 * s, 2.6 * s, '#E9A82E', INK);                                                                               // hai tay đặt gối
    g.ell(x, y - 29 * s, 4.6 * s, 5 * s, '#F8CF5A', INK); g.ell(x, y - 35 * s, 2.2 * s, 2.4 * s, '#E9A82E', INK);                       // đầu + đỉnh
    g.line([x - 2 * s, y - 29 * s], [x - .5 * s, y - 29 * s], '#7A4B12', 1); g.line([x + .5 * s, y - 29 * s], [x + 2 * s, y - 29 * s], '#7A4B12', 1);
  };
  D.buddha = function (g, rw, rh, c) { buddha(g, rw, rh, c, .95); };
  D.dragon = function (g, rw, rh, c) {   // rồng uốn trên bệ đá: thân vảy, sừng, râu, ngọc
    sh(g, c, 14); g.box(rw / 2 - .36, rh / 2 - .26, .72, .52, 0, 6, '#B9B3A6'); var x = c[0], y = c[1] - 6, c2 = g.c;
    c2.lineCap = 'round'; c2.strokeStyle = INK; c2.lineWidth = 8; c2.beginPath(); c2.moveTo(x - 13, y - 2); c2.bezierCurveTo(x - 10, y - 24, x - 2, y + 2, x + 4, y - 14); c2.bezierCurveTo(x + 7, y - 22, x + 10, y - 20, x + 11, y - 24); c2.stroke();
    c2.strokeStyle = '#2E9E6B'; c2.lineWidth = 6; c2.beginPath(); c2.moveTo(x - 13, y - 2); c2.bezierCurveTo(x - 10, y - 24, x - 2, y + 2, x + 4, y - 14); c2.bezierCurveTo(x + 7, y - 22, x + 10, y - 20, x + 11, y - 24); c2.stroke();
    c2.strokeStyle = '#F2D27A'; c2.lineWidth = 1.2; c2.setLineDash([2, 3]); c2.beginPath(); c2.moveTo(x - 13, y - 2); c2.bezierCurveTo(x - 10, y - 24, x - 2, y + 2, x + 4, y - 14); c2.stroke(); c2.setLineDash([]);
    g.ell(x + 13, y - 26, 5, 3.6, '#2E9E6B', INK); g.line([x + 11, y - 29], [x + 8, y - 34], '#F2D27A', 1.6); g.line([x + 15, y - 29], [x + 18, y - 34], '#F2D27A', 1.6); dot(g, x + 15, y - 26, 1, '#fff');
    g.line([x + 17, y - 24], [x + 23, y - 20], '#F2D27A', 1.2); g.ell(x + 22, y - 17, 3, 3, '#E9573F', INK); g.glow.push({ c: [x + 22, y - 17], r: 10 });
  };
  var dot = function (g, x, y, r, c) { g.ell(x, y, r, r, c); };

  /* ── nhà mái sóng: mái 3 dải gợn sóng nhiều lớp có bóng, tường kính ── */
  var waveHall = function (key, p) {
    def(key, function (g, rw, rh, lv) {
      lv = lv || 1; lot(g, rw, rh, p.lot || '#B8E08A'); var z = 12 + lv * 2;
      g.box(.15, .2, rw - .3, rh - .4, 0, z, p.c1 || '#F2F2F2'); g.glassL(.15, .2, rw - .3, rh - .4, 3, z - 2, 2, p.glass || '#8FD0F0'); g.glassR(.15, .2, rw - .3, rh - .4, 3, z - 2, 2, p.glass || '#8FD0F0');
      var r, c2 = g.c, H = 18 + lv * 4 + big(rw, rh);
      for (r = 0; r < 3; r++) {
        var t = .2 + r * .3, a = g.P(.1, rh * t, z), b = g.P(rw - .1, rh * t, z), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 - H * (1.4 - r * .22)];
        var up = function (pt, d) { return [pt[0], pt[1] - d]; };
        c2.beginPath(); c2.moveTo(a[0], a[1]); c2.quadraticCurveTo(m[0], m[1], b[0], b[1]); c2.lineTo(b[0] + 5, b[1] + 6); c2.quadraticCurveTo(m[0] + 5, m[1] + 12, a[0] + 5, a[1] + 6); c2.closePath();
        c2.fillStyle = grad(g, a[0], m[1], a[0], a[1] + 8, [[0, '#FFFFFF'], [.55, p.c2 || '#E8F0FA'], [1, p.edge || '#9AB8D8']]); c2.fill(); c2.strokeStyle = INK; c2.lineWidth = 1; c2.stroke();
        c2.strokeStyle = 'rgba(255,255,255,.95)'; c2.lineWidth = 1.4; c2.beginPath(); c2.moveTo(a[0] + 2, a[1] - 1); c2.quadraticCurveTo(m[0], m[1] - 2, b[0] - 2, b[1] - 1); c2.stroke(); g.ext(m[0], m[1], 12);
      }
      g.doorL(.15, .2, rw - .3, rh - .4, .5, 0, .2, 9, '#3E5C86'); g.tree(.2, rh - .15, .6, 'cherry'); g.tree(rw - .2, rh - .15, .6);
    });
  };
  waveHall('wavehall', {});
  waveHall('seawave', { c2: '#D4ECFA', edge: '#6FB5E3', glass: '#4FA4DA' });
  waveHall('aurorawave', { c1: '#E4D8F5', c2: '#E6F6EE', edge: '#B07CFF', glass: '#B9A0F0' });
})(typeof window !== 'undefined' ? window : this);
