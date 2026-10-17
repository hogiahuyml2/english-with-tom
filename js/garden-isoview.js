/* EWT Garden — BỘ VẼ 2.5D KIỂU EWT CITY: mặt đất là mặt phẳng nghiêng đẳng cự 2:1 (CSS 2D, không 3D), mọi vật ĐỨNG (nhà, cây, hoa, đồ…) được vẽ vào MỘT canvas theo
   thứ tự xa → gần (painter's algorithm) nên không còn lỗi chồng/lún/méo của CSS 3D. Nhà dùng sprite khối đẳng cự của City; cây/hoa/đồ là tranh SVG đứng (dựng thành ảnh).
   Toạ độ: (x, y) là ô (có thể lẻ) tính từ góc trên-trái của đất; pt() đổi sang pixel trong khung canvas. */
(function (root) {
  'use strict';
  var IMG = {}, T = null, G = {};
  function requestRepaint() { if (T) return; T = setTimeout(function () { T = null; if (G.repaint) G.repaint(); }, 70); }
  // ảnh SVG (tạo 1 lần, nạp bất đồng bộ; chưa nạp xong thì trả null rồi tự vẽ lại)
  function img(key, build) {
    var e = IMG[key]; if (e) return e.ok ? e.img : null;
    e = IMG[key] = { ok: false, img: new Image() }; e.img.onload = function () { e.ok = true; requestRepaint(); }; e.img.onerror = function () { e.bad = true; };
    try { e.img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(build()); } catch (er) { e.bad = true; }
    return null;
  }
  // SVG của Garden dựa vào CSS trang (cửa sổ sáng, đèn chỉ bật ban đêm) → nhúng sẵn vào ảnh
  G.prep = function (svg, night) {
    if (!/xmlns=/.test(svg.slice(0, 200))) svg = svg.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
    svg = svg.replace(/<svg([^>]*)>/, function (m, at) { if (/\swidth=/.test(at)) return m; var v = /viewBox="([-\d.]+) ([-\d.]+) ([-\d.]+) ([-\d.]+)"/.exec(at); return v ? '<svg' + at + ' width="' + (v[3] * 1.6) + '" height="' + (v[4] * 1.6) + '">' : m; });
    if (!night) svg = svg.replace(/<g class="lampg">[\s\S]*?<\/g>/g, '').replace(/<circle class="smoke"[^>]*\/>/g, '');
    return svg.replace(/<svg[^>]*>/, function (m) { return m + '<style>.win{fill:' + (night ? '#FFC93C' : '#FFF3B8') + '}.lampg{opacity:1}</style>'; });
  };
  G.geom = function (cols, rows, ts) { var S = ts * 0.70711, head = ts * 3.4; return { cols: cols, rows: rows, ts: ts, S: S, head: head, W: (cols + rows) * S, H: (cols + rows) * S * 0.5 + head + ts * 0.7 }; };
  G.pt = function (g, x, y) { return [(x - y) * g.S + g.rows * g.S, (x + y) * g.S * 0.5 + g.head]; };

  // vật là ảnh SVG đứng tại điểm (cx, cy) của mặt đất; w,h tính theo ô
  G.imgItem = function (key, build, cx, cy, w, h, o) {
    o = o || {};
    return {
      d: cx + cy + (o.dz || 0), y: cy, i: o.i, ov: o.ov, kind: o.kind,
      draw: function (ctx, g) {
        var p = G.pt(g, cx, cy), W = w * g.ts, Hh = h * g.ts, im = img(key, build);
        ctx.fillStyle = 'rgba(25,45,20,.24)'; ctx.beginPath(); ctx.ellipse(p[0], p[1] + g.ts * .02, W * (o.sh || .3), W * (o.sh || .3) * .42, 0, 0, 6.2832); ctx.fill();
        if (im) { ctx.shadowColor = 'rgba(20,35,10,.28)'; ctx.shadowBlur = g.ts * .06; ctx.shadowOffsetY = g.ts * .03; ctx.drawImage(im, p[0] - W / 2, p[1] - Hh * (o.base || .92), W, Hh); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0; }
      },
      rect: function (g) { var p = G.pt(g, cx, cy), W = w * g.ts, Hh = h * g.ts, hw = (o.hw || .62) * W; return [p[0] - hw, p[1] - Hh * (o.base || .92) * (o.hh || .92), hw * 2, Hh * (o.hh || .92) * 1.05]; }
    };
  };
  // công trình khối của City: sp.c (canvas), sp.ox/oy gốc, sp.w/h kích thước logic; (x,y) = góc trên của chân (ô), fw×fh = chân
  G.sprItem = function (sp, x, y, fw, fh, o) {
    o = o || {};
    return {
      d: x + fw + y + fh, y: y + fh, i: o.i, ov: o.ov, kind: o.kind || 'big',
      draw: function (ctx, g) { var p = G.pt(g, x, y), k = g.S / 32; ctx.drawImage(sp.c, p[0] - sp.ox * k, p[1] - sp.oy * k, sp.w * k, sp.h * k); },
      rect: function (g) { var p = G.pt(g, x, y), k = g.S / 32, l = p[0] - sp.ox * k, t = p[1] - sp.oy * k, w = sp.w * k, h = sp.h * k; return [l + w * .06, t + h * .08, w * .88, h * .9]; }
    };
  };
  // tranh SVG của một khối phong cảnh → "mặt tường" đẳng cự: nghiêng theo trục x của mặt đất, chân tranh (đường feet) chạy dọc cạnh trước-trái của khoảnh đất. b = {x,y,w,h}; vb = khung tranh (toạ độ cục bộ)
  G.blockItem = function (key, build, b, vb, feet) {
    return {
      d: b.x + b.w + b.y + b.h, y: b.y + b.h, kind: 'scene',
      draw: function (ctx, g) {
        var im = img(key, build); if (!im) return; var W0 = b.w * 100, k = 1.12 * g.S / 100, dv = 1.3 * g.S / 100, gc = G.pt(g, b.x + b.w / 2, b.y + feet / 100);
        ctx.save(); ctx.transform(k, k * .5, 0, dv, gc[0] - k * W0 / 2, gc[1] - k * .5 * W0 / 2 - dv * feet);
        ctx.shadowColor = 'rgba(20,35,10,.25)'; ctx.shadowBlur = g.ts * .05; ctx.shadowOffsetY = g.ts * .02;
        ctx.drawImage(im, vb[0], vb[1], vb[2], vb[3]); ctx.restore();
      }
    };
  };
  // vật phẳng nằm trên mặt đất của khối phong cảnh (nước, bóng đổ): vẽ theo phép chiếu mặt đất, luôn nằm dưới mọi vật đứng
  G.flatItem = function (b, flats) {
    return {
      d: -1, y: -1, kind: 'ground',
      draw: function (ctx, g) {
        var o = G.pt(g, b.x, b.y), q = g.S / 100;
        ctx.save(); ctx.transform(q, q * .5, -q, q * .5, o[0], o[1]);
        flats.forEach(function (f) {
          if (f.t === 'g') { var gim = img('flat|' + f.key + '|' + (G.night ? 'n' : 'd'), function () { return G.prep('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + f.W + ' ' + f.H + '" width="' + f.W + '" height="' + f.H + '">' + f.raw + '</svg>', G.night); }); if (gim) ctx.drawImage(gim, 0, 0, f.W, f.H); return; }
          ctx.fillStyle = f.f; ctx.beginPath();
          if (f.t === 'r') { ctx.rect(f.x, f.y, f.w, f.h); } else { ctx.ellipse(f.cx, f.cy, f.rx, f.ry, 0, 0, 6.2832); }
          ctx.fill(); if (f.st && f.st !== 'none') { ctx.strokeStyle = f.st; ctx.lineWidth = 2.5; ctx.stroke(); }
        });
        ctx.restore();
      }
    };
  };
  // vẽ toàn bộ vào canvas, trả về danh sách vùng bấm theo thứ tự xa → gần
  G.paint = function (canvas, g, items, o) {
    o = o || {}; var dpr = Math.min(2, root.devicePixelRatio || 1), ctx = canvas.getContext('2d'); dpr = Math.min(dpr, Math.sqrt(14e6 / Math.max(1, g.W * g.H)));   // giới hạn số điểm ảnh khi phóng to rất lớn (iPad/điện thoại)
    canvas.width = Math.round(g.W * dpr); canvas.height = Math.round(g.H * dpr); canvas.style.width = g.W + 'px'; canvas.style.height = g.H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, g.W, g.H);
    items.sort(function (a, b) { return a.d - b.d || a.y - b.y; });
    var XR = G.XRAY ? { big: 1, scene: 1, tree: 1 } : null;
    items.forEach(function (it) { try { if (XR && XR[it.kind]) ctx.globalAlpha = .42; it.draw(ctx, g); } catch (e) { /* bỏ qua vật lỗi */ } ctx.globalAlpha = 1; });
    if (o.tint) { ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = o.tint; ctx.fillRect(0, 0, g.W, g.H); ctx.globalCompositeOperation = 'source-over'; }
    return items.filter(function (it) { return it.i != null && it.rect; }).map(function (it) { return { i: it.i, r: it.rect(g), ov: it.ov || '', kind: it.kind }; });
  };
  root.EWTGardenIsoView = G;
})(typeof window !== 'undefined' ? window : this);
