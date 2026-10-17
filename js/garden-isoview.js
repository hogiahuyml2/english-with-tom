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
      d: cx + cy + (o.dz || 0), y: cy, fp: [cx - w * .22, cy - w * .22, cx + w * .22, cy + w * .22], i: o.i, ov: o.ov, kind: o.kind,
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
      d: x + fw + y + fh, y: y + fh, fp: [x, y, x + fw, y + fh], i: o.i, ov: o.ov, kind: o.kind || 'big',
      draw: function (ctx, g) { var p = G.pt(g, x, y), k = g.S / 32; ctx.drawImage(sp.c, p[0] - sp.ox * k, p[1] - sp.oy * k, sp.w * k, sp.h * k); },
      rect: function (g) { var p = G.pt(g, x, y), k = g.S / 32, l = p[0] - sp.ox * k, t = p[1] - sp.oy * k, w = sp.w * k, h = sp.h * k; return [l + w * .06, t + h * .08, w * .88, h * .9]; }
    };
  };
  // tranh SVG của một khối phong cảnh (viewBox nới rộng để không bị cắt phần cao); b = {x,y,w,h}
  G.blockItem = function (key, build, b, vb, feet) {
    return {
      d: b.x + b.w + b.y + b.h, y: b.y + b.h, fp: [b.x, b.y, b.x + b.w, b.y + b.h], kind: 'scene',
      draw: function (ctx, g) {
        var im = img(key, build); if (!im) return; var u = g.ts * 1.12 / 100, a = G.pt(g, b.x + b.w / 2, b.y + b.h / 2), gy = a[1] + (b.w + b.h) * g.S * .25 * .3,   /* chân vật nằm TRONG ô đất (không lệch ra mép trước) → ao/nước không còn tràn ra ngoài đất */ w = vb[2] * u, h = vb[3] * u;
        if (feet != null) gy = a[1] - (b.y * 100 + feet - vb[1]) * u + h - vb[4] * u;   // chân tranh (đường 'feet') đặt đúng tâm nền đất
        ctx.shadowColor = 'rgba(20,35,10,.25)'; ctx.shadowBlur = g.ts * .06; ctx.shadowOffsetY = g.ts * .03; ctx.drawImage(im, a[0] - w / 2, gy - (h - vb[4] * u), w, h); ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
      }
    };
  };
  // nền phẳng cho cảnh có nước: mặt nước phủ cả khoảnh đất + một nền đất/đá nhỏ ở giữa để công trình đứng lên
  G.patchItem = function (b, water) {
    return {
      d: -1, y: -1, kind: 'ground',
      draw: function (ctx, g) {
        function dia(x0, y0, w, h, fill, stroke, lw) { var p = [G.pt(g, x0, y0), G.pt(g, x0 + w, y0), G.pt(g, x0 + w, y0 + h), G.pt(g, x0, y0 + h)]; ctx.beginPath(); ctx.moveTo(p[0][0], p[0][1]); for (var i = 1; i < 4; i++) ctx.lineTo(p[i][0], p[i][1]); ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = lw || 1; ctx.stroke(); } }
        var ix = Math.min(.45, b.w * .15), iy = Math.min(.45, b.h * .15);
        dia(b.x + .06, b.y + .06, b.w - .12, b.h - .12, '#C9B98C', 'rgba(70,50,20,.35)', 1.2);      // bờ cát/đá viền ngoài
        dia(b.x + .16, b.y + .16, b.w - .32, b.h - .32, water, 'rgba(20,70,120,.45)', 1);          // mặt nước
        ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = Math.max(1, g.ts * .03);
        [[.3, .78], [.62, .84], [.78, .4], [.2, .3]].forEach(function (q) { var c = G.pt(g, b.x + b.w * q[0], b.y + b.h * q[1]); ctx.beginPath(); ctx.moveTo(c[0] - g.ts * .22, c[1]); ctx.quadraticCurveTo(c[0] - g.ts * .11, c[1] - g.ts * .06, c[0], c[1]); ctx.quadraticCurveTo(c[0] + g.ts * .11, c[1] + g.ts * .06, c[0] + g.ts * .22, c[1]); ctx.stroke(); });
        dia(b.x + b.w * .22, b.y + b.h * .22, b.w * .56, b.h * .56, '#DDD3B8', 'rgba(70,50,20,.4)', 1.2);   // nền đất/đá giữa: công trình đứng trên đây
        dia(b.x + b.w * .22 + ix * .15, b.y + b.h * .22 + iy * .15, b.w * .56 - ix * .3, b.h * .56 - iy * .3, '#CFE3A8', null);
      }
    };
  };
  /* Thứ tự vẽ xa → gần theo KHOẢNH ĐẤT chiếm (không chỉ theo điểm giữa): vật nằm hẳn về phía +x hoặc +y của vật kia luôn được vẽ SAU (đè lên) —
     nên cờ/cây đứng cạnh nhà không bị nhà vẽ đè nữa. Sắp xếp topo, hoà thì theo d cũ. */
  G.order = function (items) {
    items.sort(function (a, b) { return a.d - b.d || a.y - b.y; });
    var n = items.length, i, j, indeg = new Array(n), adj = new Array(n), E = 1e-6;
    for (i = 0; i < n; i++) { indeg[i] = 0; adj[i] = []; }
    function behind(a, b) { return !!(a.fp && b.fp && (a.fp[2] <= b.fp[0] + E || a.fp[3] <= b.fp[1] + E)); }
    for (i = 0; i < n; i++) for (j = i + 1; j < n; j++) {
      var A = items[i], B = items[j]; if (!A.fp || !B.fp) continue;
      var ab = behind(A, B), ba = behind(B, A);
      if (ab && !ba) { adj[i].push(j); indeg[j]++; } else if (ba && !ab) { adj[j].push(i); indeg[i]++; }
    }
    var out = [], done = new Array(n), picked = 0, k, best;
    for (picked = 0; picked < n; picked++) {
      best = -1; for (k = 0; k < n; k++) if (!done[k] && indeg[k] === 0) { best = k; break; }
      if (best < 0) { for (k = 0; k < n; k++) if (!done[k]) { best = k; break; } }   // vòng lặp hiếm: rơi về thứ tự d
      done[best] = 1; out.push(items[best]); adj[best].forEach(function (m) { indeg[m]--; });
    }
    return out;
  };
  // vẽ toàn bộ vào canvas, trả về danh sách vùng bấm theo thứ tự xa → gần
  G.paint = function (canvas, g, items, o) {
    o = o || {}; var dpr = Math.min(2, root.devicePixelRatio || 1), ctx = canvas.getContext('2d'); dpr = Math.min(dpr, Math.sqrt(14e6 / Math.max(1, g.W * g.H)));   // giới hạn số điểm ảnh khi phóng to rất lớn (iPad/điện thoại)
    canvas.width = Math.round(g.W * dpr); canvas.height = Math.round(g.H * dpr); canvas.style.width = g.W + 'px'; canvas.style.height = g.H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, g.W, g.H);
    items = G.order(items);
    var XR = G.XRAY ? { big: 1, scene: 1, tree: 1 } : null;
    items.forEach(function (it) { try { if (XR && XR[it.kind]) ctx.globalAlpha = .42; it.draw(ctx, g); } catch (e) { /* bỏ qua vật lỗi */ } ctx.globalAlpha = 1; });
    if (o.tint) { ctx.globalCompositeOperation = 'source-atop'; ctx.fillStyle = o.tint; ctx.fillRect(0, 0, g.W, g.H); ctx.globalCompositeOperation = 'source-over'; }
    return items.filter(function (it) { return it.i != null && it.rect; }).map(function (it) { return { i: it.i, r: it.rect(g), ov: it.ov || '', kind: it.kind }; });
  };
  root.EWTGardenIsoView = G;
})(typeof window !== 'undefined' ? window : this);
