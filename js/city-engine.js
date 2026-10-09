/* EWT City — ĐỘNG CƠ BẢN ĐỒ (Canvas 2D, góc nhìn xiên 2.5D).
   Mượt vì: nền (đường/nước/cát) gom thành vài đường vẽ lớn Path2D dựng sẵn mỗi hướng xoay; công trình là sprite vẽ sẵn; chỉ vẽ phần đang nhìn thấy;
   xe/người/thuyền/chim/mây/khói… tính bằng công thức theo thời gian (không cần nhiều đối tượng DOM). Tự giảm hiệu ứng nếu máy chậm. */
(function (root) {
  'use strict';
  var C = root.EWTCityData, A = root.EWTCityArt, HW = 32, HH = 16, W = C.W, H = C.H, TAU = Math.PI * 2;
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  // xoay bản đồ (toạ độ góc ô liên tục)
  function rotPt(r, x, y) { return r === 0 ? [x, y] : r === 1 ? [H - y, x] : r === 2 ? [W - x, H - y] : [y, W - x]; }
  function unrotPt(r, X, Y) { return r === 0 ? [X, Y] : r === 1 ? [Y, H - X] : r === 2 ? [W - X, H - Y] : [W - Y, X]; }
  function rotRect(r, x, y, w, h) { var a = rotPt(r, x, y), b = rotPt(r, x + w, y + h); return { rx: Math.min(a[0], b[0]), ry: Math.min(a[1], b[1]), rw: Math.abs(b[0] - a[0]), rh: Math.abs(b[1] - a[1]) }; }
  var scr = function (r, x, y) { var q = rotPt(r, x, y); return [(q[0] - q[1]) * HW, (q[0] + q[1]) * HH]; };

  var CAR_COLORS = ['#E9573F', '#4F80BA', '#F2C21B', '#2E9E7F', '#F2F2F2', '#8C5BD6', '#F29A2E', '#2F3640'];
  var SHIRT = ['#E9573F', '#4F80BA', '#F2C21B', '#2E9E7F', '#B8485E', '#8C5BD6', '#F29A2E'];

  function Engine(canvas, mini, opts) {
    var E = this; E.cv = canvas; E.ctx = canvas.getContext('2d'); E.mini = mini || null; E.o = opts || {};
    E.cam = { x: 0, y: 0, z: .7 }; E.rot = 0; E.t0 = performance.now(); E.t = 0; E.dpr = Math.min(2, window.devicePixelRatio || 1);
    E.bs = []; E.roadsX = new Uint8Array(W * H); E.open = {}; E.occ = new Int32Array(W * H); E.mode = 'view'; E.ghost = null; E.sel = -1; E.hover = null; E.roadPrev = null;
    E.weather = 'clear'; E.hourOverride = null; E.quality = 2; E.fx = { cars: true, people: true, boats: true, sky: true, shimmer: true };
    E.gcache = {}; E.entities = { cars: [], people: [], boats: [], birds: [], balloons: [], planes: [], clouds: [] }; E.rain = []; E.skew = 0; E.dirtyRoads = true; E.fixedSorted = [];
    E.tri = []; E.last = performance.now(); E.frameMs = 16; E.slow = 0; E.cullBox = null; E.version = 0; E.allowed = null;
    E.applyQuality(); E.resize(); E.bind(); E.initSky(); E.fitAll(true);
    var loop = function (ts) { E.frame(ts); E.raf = requestAnimationFrame(loop); }; E.raf = requestAnimationFrame(loop);
    document.addEventListener('visibilitychange', function () { E.last = performance.now(); });
  }
  var P = Engine.prototype;

  /* ───── tiện ích toạ độ ───── */
  P.toBase = function (px, py) { return [(px - this.cw / 2) / this.cam.z + this.cam.x, (py - this.ch / 2) / this.cam.z + this.cam.y]; };
  P.baseToWorld = function (u, v) { var X = (u / HW + v / HH) / 2, Y = (v / HH - u / HW) / 2; return unrotPt(this.rot, X, Y); };
  P.screenToTile = function (px, py) { var b = this.toBase(px, py), w = this.baseToWorld(b[0], b[1]); return [Math.floor(w[0]), Math.floor(w[1])]; };
  P.worldToScreen = function (x, y, z) { var s = scr(this.rot, x, y); return [(s[0] - this.cam.x) * this.cam.z + this.cw / 2, (s[1] - (z || 0) - this.cam.y) * this.cam.z + this.ch / 2]; };
  P.nowMs = function () { return Date.now() + this.skew; };

  P.resize = function () {
    var E = this, r = E.cv.getBoundingClientRect(); E.cw = Math.max(200, Math.round(r.width)); E.ch = Math.max(200, Math.round(r.height));
    E.cv.width = Math.round(E.cw * E.dpr); E.cv.height = Math.round(E.ch * E.dpr);
  };

  /* ───── trạng thái từ máy chủ ───── */
  P.setState = function (v) {
    var E = this; E.skew = v.now - Date.now(); E.bs = v.bs.slice(); E.open = {}; v.districts.forEach(function (d) { E.open[d] = 1; });
    var nr = new Uint8Array(W * H); v.roads.forEach(function (i) { nr[i] = 1; });
    var changed = E.roadsX.length !== nr.length || v.roads.length !== E.roadCount; if (!changed) for (var i = 0; i < nr.length; i++) if (nr[i] !== E.roadsX[i]) { changed = true; break; }
    E.roadsX = nr; E.roadCount = v.roads.length; E.roadTiles = null; if (changed) { E.dirtyRoads = true; E.gcache = {}; E.scCache = null; }
    E.occ = C.buildOcc(E.bs.map(function (b) { return { k: b.k, x: b.x, y: b.y }; })); E.version++; E.pendSum = 0; E.bs.forEach(function (b) { E.pendSum += b.pend; });
    if (E.sel >= 0 && !E.bs.some(function (b) { return b.i === E.sel; })) { E.sel = -1; if (E.o.onSelect) E.o.onSelect(null); }
    E.allowed = null; if (E.mode === 'place' && E.ghost) E.refreshGhost(); E.lockCache = null;
  };
  P.stateObj = function () { var E = this, roads = {}, i; for (i = 0; i < E.roadsX.length; i++) if (E.roadsX[i]) roads[i] = 1; return { districts: Object.keys(E.open).map(Number), roads: roads }; };
  P.isRoad = function (x, y) { return C.inW(x, y) && (C.ROAD[y * W + x] > 0 || this.roadsX[y * W + x] > 0); };

  /* ───── nền: Path2D dựng sẵn mỗi hướng ───── */
  function dia(path, r, x, y) { var q = rotRect(r, x, y, 1, 1), X = q.rx, Y = q.ry, a = [(X - Y) * HW, (X + Y) * HH], b = [(X + 1 - Y) * HW, (X + 1 + Y) * HH], c = [(X + 1 - Y - 1) * HW, (X + 1 + Y + 1) * HH], d = [(X - Y - 1) * HW, (X + Y + 1) * HH]; path.moveTo(a[0], a[1]); path.lineTo(b[0], b[1]); path.lineTo(c[0], c[1]); path.lineTo(d[0], d[1]); path.closePath(); }
  function quadW(path, r, pts) { var i, s; for (i = 0; i < pts.length; i++) { s = scr(r, pts[i][0], pts[i][1]); if (i) path.lineTo(s[0], s[1]); else path.moveTo(s[0], s[1]); } path.closePath(); }
  P.ground = function () {
    var E = this, r = E.rot, key = 'g' + r; if (E.gcache[key]) return E.gcache[key];
    var g = { check: new Path2D(), water: new Path2D(), sand: new Path2D(), road: new Path2D(), walk: new Path2D(), dash: new Path2D(), rail: new Path2D(), wavesT: [], sandDots: [], zone: {} }, x, y, i, isR = function (a, b) { return E.isRoad(a, b); };
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      i = y * W + x; var t = C.TERR[i], road = C.ROAD[i] > 0 || E.roadsX[i] > 0;
      if (t === 1) { dia(g.water, r, x, y); if ((x * 7 + y * 3) % 5 === 0) g.wavesT.push([x, y]); }
      else if (t === 2) { dia(g.sand, r, x, y); if ((x + y) % 3 === 0) g.sandDots.push([x, y]); }
      else if (!road && (x + y) % 2 === 0) dia(g.check, r, x, y);
      if (road) {
        dia(g.road, r, x, y); var nE = isR(x + 1, y), nW = isR(x - 1, y), nS = isR(x, y + 1), nN = isR(x, y - 1), br = C.ROAD[i] === 2;
        var e = .11, edge = function (dx, dy) { return dx ? [[x + (dx > 0 ? 1 - e : 0), y], [x + (dx > 0 ? 1 : e), y], [x + (dx > 0 ? 1 : e), y + 1], [x + (dx > 0 ? 1 - e : 0), y + 1]] : [[x, y + (dy > 0 ? 1 - e : 0)], [x + 1, y + (dy > 0 ? 1 - e : 0)], [x + 1, y + (dy > 0 ? 1 : e)], [x, y + (dy > 0 ? 1 : e)]]; };
        var tgt = br ? g.rail : g.walk;
        if (!nE) quadW(tgt, r, edge(1, 0)); if (!nW) quadW(tgt, r, edge(-1, 0)); if (!nS) quadW(tgt, r, edge(0, 1)); if (!nN) quadW(tgt, r, edge(0, -1));
        var horiz = nE && nW && !nN && !nS, vert = nN && nS && !nE && !nW;
        if (horiz) { var a = scr(r, x + .28, y + .5), b = scr(r, x + .72, y + .5); g.dash.moveTo(a[0], a[1]); g.dash.lineTo(b[0], b[1]); }
        if (vert) { var a2 = scr(r, x + .5, y + .28), b2 = scr(r, x + .5, y + .72); g.dash.moveTo(a2[0], a2[1]); g.dash.lineTo(b2[0], b2[1]); }
      }
    }
    // khung bản đồ (đất liền)
    var q = [scr(r, 0, 0), scr(r, W, 0), scr(r, W, H), scr(r, 0, H)]; g.quad = q;
    E.gcache[key] = g; return g;
  };
  P.zonePath = function (letter) {
    var E = this, key = 'z' + E.rot + letter; if (E.gcache[key]) return E.gcache[key];
    var p = new Path2D(), x, y, i, code = letter.charCodeAt(0); for (y = 0; y < H; y++) for (x = 0; x < W; x++) { i = y * W + x; if (C.ZONE[i] === code && !E.roadsX[i]) dia(p, E.rot, x, y); }
    return (E.gcache[key] = p);
  };
  // các ô cho phép đặt công trình đang chọn (tô xanh khi đang ở chế độ xây)
  P.allowedPath = function () {
    var E = this, g = E.ghost; if (!g) return null; if (E.allowed && E.allowed.k === g.k && E.allowed.v === E.version && E.allowed.r === E.rot) return E.allowed;
    var it = C.BY[g.k], st = E.stateObj(), p = new Path2D(), bad = new Path2D(), x, y; var occ = E.occ;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) { var i = y * W + x; if (C.TERR[i] !== 0 || C.ROAD[i] || E.roadsX[i] || C.FOCC[i] >= 0 || occ[i] || !E.open[C.DIST[i]]) continue; var zs = String.fromCharCode(C.ZONE[i]); if (it.z !== '*' && it.z.indexOf(zs) < 0) continue; if (C.adjacentRoad(x, y, 1, 1, st.roads) || (it.w * it.h > 1 && C.adjacentRoad(x, y, it.w, it.h, st.roads))) dia(p, E.rot, x, y); else dia(bad, E.rot, x, y); }
    return (E.allowed = { k: g.k, v: E.version, r: E.rot, ok: p, near: bad });
  };

  /* ───── bầu trời, thực thể ───── */
  P.initSky = function () {
    var E = this, i, e = E.entities;
    for (i = 0; i < 9; i++) e.clouds.push({ x: Math.random() * W, y: Math.random() * H, s: .7 + Math.random() * .9, v: .15 + Math.random() * .2 });
    for (i = 0; i < 2; i++) e.balloons.push({ x: Math.random() * W, y: Math.random() * H, vx: .08 + Math.random() * .05, vy: .03 * (Math.random() - .5), c: ['#E9573F', '#4F80BA', '#F2C21B'][i % 3], ph: Math.random() * 6 });
    e.birds.push({ x: -5, y: 10, vx: .9, vy: .5, n: 6, ph: 0 }); e.birds.push({ x: W + 5, y: 30, vx: -.8, vy: -.3, n: 5, ph: 2 });
    e.planes.push({ x: -20, y: 20 + Math.random() * 10, vx: 1.7, vy: .9, wait: 8 });
    for (i = 0; i < 160; i++) E.rain.push({ x: Math.random(), y: Math.random(), v: .6 + Math.random() * .6 });
  };
  P.roadList = function () { var E = this; if (E.roadTiles) return E.roadTiles; var a = [], i; for (i = 0; i < W * H; i++) if ((C.ROAD[i] === 1 || E.roadsX[i]) && E.open[C.DIST[i]]) a.push(i); return (E.roadTiles = a); };
  var DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  P.spawnWalker = function (kind) {
    var E = this, L = E.roadList(); if (!L.length) return null; var i = L[(Math.random() * L.length) | 0], x = i % W, y = Math.floor(i / W), d = DIRS[(Math.random() * 4) | 0];
    return { x: x + .5, y: y + .5, tx: x, ty: y, dx: d[0], dy: d[1], v: kind === 'car' ? 1.5 + Math.random() * .8 : .38 + Math.random() * .2, c: kind === 'car' ? CAR_COLORS[(Math.random() * CAR_COLORS.length) | 0] : SHIRT[(Math.random() * SHIRT.length) | 0], side: Math.random() < .5 ? 1 : -1, ph: Math.random() * 6, nxt: null };
  };
  P.stepWalker = function (w, dt, isCar) {
    var E = this, sp = w.v * dt;
    while (sp > 0) {
      if (!w.nxt) { // chọn ô đường kế tiếp
        var opts = [], k, d; for (k = 0; k < 4; k++) { d = DIRS[k]; if (d[0] === -w.dx && d[1] === -w.dy) continue; if (E.isRoad(w.tx + d[0], w.ty + d[1]) && E.open[C.DIST[(w.ty + d[1]) * W + w.tx + d[0]]]) opts.push(d); }
        if (!opts.length) { w.dx = -w.dx; w.dy = -w.dy; if (!E.isRoad(w.tx + w.dx, w.ty + w.dy)) { return false; } opts = [[w.dx, w.dy]]; }
        var st = opts.filter(function (o) { return o[0] === w.dx && o[1] === w.dy; }); d = st.length && Math.random() < .72 ? st[0] : opts[(Math.random() * opts.length) | 0];
        w.dx = d[0]; w.dy = d[1]; w.nxt = [w.tx + d[0], w.ty + d[1]];
      }
      var gx = w.nxt[0] + .5, gy = w.nxt[1] + .5, rx = gx - w.x, ry = gy - w.y, dist = Math.abs(rx) + Math.abs(ry);
      if (dist <= sp) { w.x = gx; w.y = gy; w.tx = w.nxt[0]; w.ty = w.nxt[1]; sp -= dist; w.nxt = null; } else { w.x += Math.sign(rx) * sp; w.y += Math.sign(ry) * sp; sp = 0; }
    }
    return true;
  };

  /* ───── thời gian & thời tiết ───── */
  P.hour = function () { if (this.hourOverride != null) return this.hourOverride; var d = new Date(); return d.getHours() + d.getMinutes() / 60; };
  P.nightK = function () { var h = this.hour(); if (h >= 19.5 || h < 5) return 1; if (h >= 18 && h < 19.5) return (h - 18) / 1.5; if (h >= 5 && h < 6.5) return 1 - (h - 5) / 1.5; return 0; };

  /* ───── chế độ & bóng ma ───── */
  P.setMode = function (m, k) {
    var E = this; E.mode = m; E.allowed = null; E.roadPrev = null;
    if (m === 'place' && k) {
      var it = C.BY[k], c = E.screenToTile(E.cw / 2, E.ch / 2), st = E.stateObj(), best = null, rad, dx, dy, x, y;
      E.ghost = { k: k, x: clamp(c[0] - (it.w >> 1), 0, W - it.w), y: clamp(c[1] - (it.h >> 1), 0, H - it.h), ok: false, err: '' };
      for (rad = 0; rad < 24 && !best; rad++) for (dy = -rad; dy <= rad && !best; dy++) for (dx = -rad; dx <= rad; dx++) { if (Math.max(Math.abs(dx), Math.abs(dy)) !== rad) continue; x = c[0] + dx - (it.w >> 1); y = c[1] + dy - (it.h >> 1); if (x < 0 || y < 0 || x + it.w > W || y + it.h > H) continue; if (C.canPlace(st, it, x, y, E.occ).ok) { best = [x, y]; break; } }
      if (best) { E.ghost.x = best[0]; E.ghost.y = best[1]; } E.refreshGhost();
    }
    else E.ghost = null;
    if (E.o.onMode) E.o.onMode(m);
  };
  P.refreshGhost = function () {
    var E = this, g = E.ghost; if (!g) return; var it = C.BY[g.k], r = C.canPlace(E.stateObj(), it, g.x, g.y, E.occ); g.ok = r.ok; g.err = r.err || ''; if (E.o.onGhost) E.o.onGhost(g);
  };

  /* ───── điều khiển camera ───── */
  P.fitAll = function (instant) { var E = this, c = scr(E.rot, W / 2, H / 2), z = Math.min(E.cw / ((W + H) * HW * 1.05), E.ch / ((W + H) * HH * 1.05)); E.goto(c[0], c[1], Math.max(.26, z), instant); };
  P.goto = function (x, y, z, instant) { var E = this; if (instant) { E.cam.x = x; E.cam.y = y; E.cam.z = z == null ? E.cam.z : z; E.anim = null; return; } E.anim = { x0: E.cam.x, y0: E.cam.y, z0: E.cam.z, x1: x, y1: y, z1: z == null ? E.cam.z : z, t: 0, d: .55 }; };
  P.focusDistrict = function (d) { var E = this, dd = C.DISTRICTS[d], cx = (dd.id % C.DW) * C.DS + C.DS / 2, cy = Math.floor(dd.id / C.DW) * C.DS + C.DS / 2, s = scr(E.rot, cx, cy), z = Math.min(E.cw / (C.DS * 2 * HW * 1.15), E.ch / (C.DS * 2 * HH * 1.2)); E.goto(s[0], s[1], clamp(z, .5, 1.3)); };
  P.focusTile = function (x, y, z) { var s = scr(this.rot, x + .5, y + .5); this.goto(s[0], s[1], z); };
  P.rotate = function (dir) {
    var E = this, c = E.baseToWorld(E.cam.x, E.cam.y); E.rot = (E.rot + (dir > 0 ? 1 : 3)) % 4; var s = scr(E.rot, c[0], c[1]); E.cam.x = s[0]; E.cam.y = s[1]; E.anim = null; E.allowed = null; E.lockCache = null;
    if (E.ghost) { E.refreshGhost(); } if (E.o.onRotate) E.o.onRotate(E.rot);
  };
  P.zoomAt = function (f, px, py) { var E = this, before = E.toBase(px, py), z = clamp(E.cam.z * f, .24, 2.6); E.cam.z = z; var after = E.toBase(px, py); E.cam.x += before[0] - after[0]; E.cam.y += before[1] - after[1]; E.anim = null; };
  P.clampCam = function () { var E = this, a = scr(E.rot, W / 2, H / 2), lim = (W + H) * HW * .55; E.cam.x = clamp(E.cam.x, a[0] - lim, a[0] + lim); E.cam.y = clamp(E.cam.y, a[1] - lim * .62, a[1] + lim * .62); };

  /* ───── nhập liệu ───── */
  P.bind = function () {
    var E = this, cv = E.cv, ptrs = {}, drag = null, pinch = null, lastTap = 0, lastTapPos = null;
    var pos = function (e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', function (e) {
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* bỏ qua */ } var p = pos(e); ptrs[e.pointerId] = p; var ids = Object.keys(ptrs);
      if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: E.cam.z }; drag = null; return; }
      drag = { x: p[0], y: p[1], cx: E.cam.x, cy: E.cam.y, moved: false, pid: e.pointerId, touch: e.pointerType !== 'mouse', t: performance.now(), mode: E.mode, startTile: E.screenToTile(p[0], p[1]) };
      if (E.mode === 'road') { E.roadDrag = { a: drag.startTile, b: drag.startTile }; E.roadPrev = E.roadCells(); }
    });
    cv.addEventListener('pointermove', function (e) {
      var p = pos(e); if (ptrs[e.pointerId]) ptrs[e.pointerId] = p;
      if (pinch && Object.keys(ptrs).length >= 2) { var ids = Object.keys(ptrs), a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]); E.zoomAt((pinch.z * d / pinch.d) / E.cam.z, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); E.clampCam(); return; }
      if (drag && drag.pid === e.pointerId) {
        var dx = p[0] - drag.x, dy = p[1] - drag.y; if (!drag.moved && Math.hypot(dx, dy) > 7) drag.moved = true;
        if (E.mode === 'road' && !E.panRoad) { var t = E.screenToTile(p[0], p[1]); E.roadDrag.b = t; E.roadPrev = E.roadCells(); return; }
        if (drag.moved) { E.cam.x = drag.cx - dx / E.cam.z; E.cam.y = drag.cy - dy / E.cam.z; E.clampCam(); E.anim = null; }
      } else if (e.pointerType === 'mouse') { E.hover = E.screenToTile(p[0], p[1]); if (E.mode === 'place' && E.ghost) { var it = C.BY[E.ghost.k]; E.setGhost(E.hover[0] - (it.w >> 1), E.hover[1] - (it.h >> 1)); } }
    });
    var up = function (e) {
      var p = pos(e); delete ptrs[e.pointerId]; if (pinch) { if (Object.keys(ptrs).length < 2) pinch = null; return; }
      if (!drag || drag.pid !== e.pointerId) return; var d = drag; drag = null;
      if (E.mode === 'road') { var cells = E.roadCells(); E.roadDrag = null; E.roadPrev = null; if (E.o.onRoad) E.o.onRoad(cells, !d.moved); return; }
      if (!d.moved) { var now = performance.now(), dbl = now - lastTap < 320 && lastTapPos && Math.hypot(p[0] - lastTapPos[0], p[1] - lastTapPos[1]) < 24; lastTap = now; lastTapPos = p; E.tap(p[0], p[1], dbl); }
    };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', function (e) { delete ptrs[e.pointerId]; drag = null; pinch = null; E.roadDrag = null; E.roadPrev = null; });
    cv.addEventListener('wheel', function (e) { e.preventDefault(); var p = pos(e); E.zoomAt(Math.exp(-e.deltaY * .0016), p[0], p[1]); E.clampCam(); }, { passive: false });
    cv.addEventListener('pointerleave', function () { E.hover = null; });
    window.addEventListener('resize', function () { E.resize(); });
    // mini-map
    if (E.mini) {
      var mm = E.mini, md = false, mpos = function (e) { var r = mm.getBoundingClientRect(), fx = (e.clientX - r.left) / r.width, fy = (e.clientY - r.top) / r.height, x = fx * W, y = fy * H, s = scr(E.rot, x, y); E.goto(s[0], s[1], null, true); };
      mm.addEventListener('pointerdown', function (e) { md = true; try { mm.setPointerCapture(e.pointerId); } catch (er) {} mpos(e); }); mm.addEventListener('pointermove', function (e) { if (md) mpos(e); }); mm.addEventListener('pointerup', function () { md = false; });
    }
  };
  P.setGhost = function (x, y) { var E = this, g = E.ghost; if (!g) return; var it = C.BY[g.k]; x = clamp(x, 0, W - it.w); y = clamp(y, 0, H - it.h); if (x === g.x && y === g.y) return; g.x = x; g.y = y; E.refreshGhost(); };
  P.roadCells = function () {
    var E = this, d = E.roadDrag; if (!d) return []; var a = d.a, b = d.b, cells = [], dx = Math.abs(b[0] - a[0]), dy = Math.abs(b[1] - a[1]), x, y;
    if (dx >= dy) { for (x = Math.min(a[0], b[0]); x <= Math.max(a[0], b[0]); x++) cells.push([x, a[1]]); } else { for (y = Math.min(a[1], b[1]); y <= Math.max(a[1], b[1]); y++) cells.push([a[0], y]); }
    return cells.filter(function (c) { return C.inW(c[0], c[1]); });
  };
  P.tap = function (px, py, dbl) {
    var E = this, t = E.screenToTile(px, py);
    if (dbl && E.mode === 'view') { E.zoomAt(1.6, px, py); E.clampCam(); return; }
    if (E.mode === 'place' && E.ghost) { var it = C.BY[E.ghost.k], g = E.ghost, inside = t[0] >= g.x && t[0] < g.x + it.w && t[1] >= g.y && t[1] < g.y + it.h; if (inside) { if (E.o.onPlace) E.o.onPlace(g); } else E.setGhost(t[0] - (it.w >> 1), t[1] - (it.h >> 1)); return; }
    // bóng bay thu thuế
    var bub = E.pickBubble(px, py); if (bub) { if (E.o.onBubble) E.o.onBubble(bub); return; }
    var b = E.pickBuilding(px, py);
    if (b) { E.sel = b.i; if (E.o.onSelect) E.o.onSelect(b); return; }
    // công trình cố định / quận khoá
    if (C.inW(t[0], t[1])) { var i = t[1] * W + t[0], f = C.FOCC[i]; if (f >= 0) { if (E.o.onFixed) E.o.onFixed(C.FIXED[f]); return; } var d = C.DIST[i]; if (!E.open[d]) { if (E.o.onLocked) E.o.onLocked(d); return; } if (C.ROAD[i] === 0 && E.roadsX[i]) { if (E.o.onRoadTap) E.o.onRoadTap(i); return; } }
    E.sel = -1; if (E.o.onSelect) E.o.onSelect(null);
  };
  P.pickBubble = function (px, py) {
    var E = this, i, b, best = null; if (E.cam.z < .45) return null;
    for (i = E.bs.length - 1; i >= 0; i--) { b = E.bs[i]; if (b.pend < 1 || b.lv < 1) continue; var p = E.bubblePos(b); if (!p) continue; if (Math.hypot(px - p[0], py - p[1]) < Math.max(16, 14 * E.cam.z + 6)) { best = b; break; } }
    return best;
  };
  P.bubblePos = function (b) { var it = C.BY[b.k], r = rotRect(this.rot, b.x, b.y, it.w, it.h), sp = A.getSprite('b', b.k, b.lv, Math.round(r.rw), Math.round(r.rh)), s = [(r.rx - r.ry) * HW, (r.rx + r.ry) * HH], bob = Math.sin(this.t * 3 + b.i) * 2.5; return [(s[0] - this.cam.x) * this.cam.z + this.cw / 2, (s[1] - sp.oy - 14 + bob - this.cam.y) * this.cam.z + this.ch / 2]; };
  P.pickBuilding = function (px, py) {
    var E = this, u = E.toBase(px, py), list = E.sortedBuildings(), i, e;
    for (i = list.length - 1; i >= 0; i--) { e = list[i]; var lx = u[0] - (e.sx - e.sp.ox), ly = u[1] - (e.sy - e.sp.oy); if (lx < 0 || ly < 0 || lx >= e.sp.w || ly >= e.sp.h) continue; var c = e.sp.c.getContext('2d'); if (c.getImageData(Math.floor(lx * A.SS), Math.floor(ly * A.SS), 1, 1).data[3] > 24) return e.b; }
    return null;
  };

  /* ───── danh sách công trình đã sắp theo chiều sâu ───── */
  P.sortedBuildings = function () {
    var E = this, key = E.version + ':' + E.rot + ':' + Math.floor(E.nowMs() / 1000 / 5); if (E.sbKey === key) return E.sb; var out = [], i, b, it, r, sp, now = E.nowMs(), t0 = performance.now(), late = false;
    for (i = 0; i < E.bs.length; i++) {
      b = E.bs[i]; it = C.BY[b.k]; r = rotRect(E.rot, b.x, b.y, it.w, it.h); var rw = Math.round(r.rw), rh = Math.round(r.rh);
      var lvShow = b.lv; if (b.tg > b.lv && b.t1 <= now) lvShow = b.tg;
      var kind = lvShow === 0 ? 's' : 'b', kk = lvShow === 0 ? 'scaf' : b.k, ll = lvShow === 0 ? 1 : lvShow;
      // dựng sprite dần dần (tối đa ~12 ms mỗi khung hình) để lần mở đầu không bị khựng
      if (!A.has(kind, kk, ll, rw, rh) && performance.now() - t0 > 12) { late = true; sp = A.placeholder(); } else sp = A.getSprite(kind, kk, ll, rw, rh);
      out.push({ b: b, it: it, sp: sp, rw: rw, rh: rh, sx: (r.rx - r.ry) * HW, sy: (r.rx + r.ry) * HH, d: (r.rx + r.rw) + (r.ry + r.rh), site: lvShow === 0 });
    }
    E.sb = out.sort(function (a, b) { return a.d - b.d; }); E.sbKey = late ? null : key; return E.sb;
  };

  /* ───── VẼ ───── */
  P.frame = function (ts) {
    var E = this; if (document.hidden) return; var dt = Math.min(.08, (ts - E.last) / 1000); E.last = ts; E.t = (ts - E.t0) / 1000; E.nf = (E.nf | 0) + 1;
    E.frameMs = E.frameMs * .94 + dt * 1000 * .06; if (E.nf > 200 && E.frameMs > 26) { if (++E.slow > 90 && E.quality > 0) { E.quality--; E.slow = 0; E.applyQuality(); } } else E.slow = Math.max(0, E.slow - 1);
    if (E.anim) { var a = E.anim; a.t += dt; var k = clamp(a.t / a.d, 0, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; E.cam.x = a.x0 + (a.x1 - a.x0) * e; E.cam.y = a.y0 + (a.y1 - a.y0) * e; E.cam.z = a.z0 + (a.z1 - a.z0) * e; if (k >= 1) E.anim = null; }
    E.update(dt); E.draw(); if (E.mini && (ts - (E.miniT || 0) > 250)) { E.miniT = ts; E.drawMini(); }
  };
  P.applyQuality = function () { var f = this.fx; f.shimmer = this.quality >= 2; f.people = this.quality >= 1; f.sky = this.quality >= 1; f.carsMax = this.quality >= 2 ? 60 : this.quality === 1 ? 30 : 12; };
  P.update = function (dt) {
    var E = this, en = E.entities, i, L = E.roadList(), nc = Math.min(E.fx.carsMax || 60, Math.round(L.length / 28)), np = E.fx.people ? Math.min(E.quality >= 2 ? 70 : 30, Math.round(L.length / 22)) : 0;
    if (L.length) {
      while (en.cars.length < nc) { var c = E.spawnWalker('car'); if (!c) break; en.cars.push(c); } while (en.cars.length > nc) en.cars.pop();
      while (en.people.length < np) { var p = E.spawnWalker('ppl'); if (!p) break; en.people.push(p); } while (en.people.length > np) en.people.pop();
    }
    for (i = 0; i < en.cars.length; i++) { if (!E.stepWalker(en.cars[i], dt, true) || !E.open[C.DIST[en.cars[i].ty * W + en.cars[i].tx]]) { var n = E.spawnWalker('car'); if (n) en.cars[i] = n; } }
    for (i = 0; i < en.people.length; i++) { if (!E.stepWalker(en.people[i], dt, false) || !E.open[C.DIST[en.people[i].ty * W + en.people[i].tx]]) { var n2 = E.spawnWalker('ppl'); if (n2) en.people[i] = n2; } }
    en.clouds.forEach(function (c) { c.x += c.v * dt; if (c.x > W + 12) { c.x = -12; c.y = Math.random() * H; } });
    en.balloons.forEach(function (b) { b.x += b.vx * dt; b.y += b.vy * dt; if (b.x > W + 10) { b.x = -10; b.y = Math.random() * H; } });
    en.birds.forEach(function (b) { b.x += b.vx * dt; b.y += b.vy * dt; b.ph += dt * 9; if (b.x > W + 8 || b.x < -8 || b.y > H + 8 || b.y < -8) { if (b.vx > 0) { b.x = -6; b.y = Math.random() * H * .6; } else { b.x = W + 6; b.y = Math.random() * H; } } });
    en.planes.forEach(function (p) { if (p.wait > 0) { p.wait -= dt; return; } p.x += p.vx * dt; p.y += p.vy * dt; if (p.x > W + 25 || p.y > H + 25) { p.x = -20; p.y = Math.random() * 14; p.wait = 40 + Math.random() * 40; } });
    if (E.weather === 'rain' || E.weather === 'snow') E.rain.forEach(function (r) { r.y += r.v * dt * (E.weather === 'snow' ? .22 : 1.6); r.x += dt * (E.weather === 'snow' ? Math.sin(E.t + r.v * 9) * .03 : .06); if (r.y > 1) { r.y = -.02; r.x = Math.random(); } if (r.x > 1) r.x = 0; });
  };

  P.draw = function () {
    var E = this, ctx = E.ctx, cw = E.cw, ch = E.ch, z = E.cam.z, now = E.nowMs(), night = E.nightK();
    ctx.setTransform(E.dpr, 0, 0, E.dpr, 0, 0); ctx.imageSmoothingEnabled = true;
    // biển
    var g0 = ctx.createLinearGradient(0, 0, 0, ch); g0.addColorStop(0, '#59B8EC'); g0.addColorStop(1, '#3E9ED8'); ctx.fillStyle = g0; ctx.fillRect(0, 0, cw, ch);
    ctx.setTransform(E.dpr * z, 0, 0, E.dpr * z, E.dpr * (cw / 2 - E.cam.x * z), E.dpr * (ch / 2 - E.cam.y * z));
    var gr = E.ground(); E.drawSeaWaves(ctx);
    // đất liền
    ctx.beginPath(); gr.quad.forEach(function (q, i) { i ? ctx.lineTo(q[0], q[1]) : ctx.moveTo(q[0], q[1]); }); ctx.closePath(); ctx.fillStyle = '#92D56A'; ctx.fill();
    ctx.fillStyle = 'rgba(70,140,50,.12)'; ctx.fill(gr.check);
    ctx.fillStyle = '#F3E0AE'; ctx.fill(gr.sand); ctx.fillStyle = '#4DB1EA'; ctx.fill(gr.water);
    if (E.fx.shimmer || true) E.drawWaterFx(ctx, gr);
    // khu quy hoạch khi đang xây
    if (E.mode === 'place' && E.ghost) { var al = E.allowedPath(); ctx.fillStyle = 'rgba(80,220,120,.34)'; ctx.fill(al.ok); ctx.fillStyle = 'rgba(255,200,60,.2)'; ctx.fill(al.near); }
    if (E.showZones) { Object.keys(C.ZONE_COLOR).forEach(function (zk) { ctx.fillStyle = C.ZONE_COLOR[zk] + '66'; ctx.fill(E.zonePath(zk)); }); }
    // đường
    ctx.fillStyle = '#5C6472'; ctx.fill(gr.road); ctx.fillStyle = '#D8D4C6'; ctx.fill(gr.walk); ctx.fillStyle = '#8A6A4A'; ctx.fill(gr.rail); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; ctx.stroke(gr.dash);
    // xem trước đường
    if (E.roadPrev && E.roadPrev.length) E.drawRoadPreview(ctx);
    // quận khoá
    E.drawLocked(ctx);
    // vật thể theo chiều sâu
    E.drawObjects(ctx, now, night);
    // bầu trời
    ctx.setTransform(E.dpr * z, 0, 0, E.dpr * z, E.dpr * (cw / 2 - E.cam.x * z), E.dpr * (ch / 2 - E.cam.y * z)); E.drawSky(ctx, night);
    // ban đêm + thời tiết
    ctx.setTransform(E.dpr, 0, 0, E.dpr, 0, 0); E.drawAtmosphere(ctx, night);
  };
  P.drawSeaWaves = function (ctx) {
    var t = this.t, i; ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.4; ctx.beginPath(); var q = this.ground().quad, cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
    for (i = 0; i < 70; i++) { var a = i * 2.399, rr = 1500 + (i % 7) * 260, x = cx + Math.cos(a) * rr * 1.1, y = cy + Math.sin(a) * rr * .62, w = 26 + (i % 5) * 8, o = Math.sin(t * .8 + i) * 6; ctx.moveTo(x - w + o, y); ctx.quadraticCurveTo(x + o, y - 4, x + w + o, y); }
    ctx.stroke();
  };
  P.drawWaterFx = function (ctx, gr) {
    var t = this.t, i, w, n = gr.wavesT.length, vis = this.visBox(); ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.2; ctx.beginPath();
    for (i = 0; i < n; i++) { w = gr.wavesT[i]; var s = scr(this.rot, w[0] + .5, w[1] + .5); if (s[0] < vis[0] || s[0] > vis[2] || s[1] < vis[1] || s[1] > vis[3]) continue; var o = Math.sin(t * 1.6 + i) * 5; ctx.moveTo(s[0] - 9 + o, s[1]); ctx.quadraticCurveTo(s[0] + o, s[1] - 3, s[0] + 9 + o, s[1]); }
    ctx.stroke(); ctx.fillStyle = 'rgba(255,230,160,.5)'; for (i = 0; i < gr.sandDots.length; i += 2) { var d = gr.sandDots[i], s2 = scr(this.rot, d[0] + .5, d[1] + .5); if (s2[0] < vis[0] || s2[0] > vis[2] || s2[1] < vis[1] || s2[1] > vis[3]) continue; ctx.fillRect(s2[0] - 5, s2[1], 2, 1.5); ctx.fillRect(s2[0] + 6, s2[1] + 3, 2, 1.5); }
  };
  P.visBox = function () { var E = this, a = E.toBase(-60, -120), b = E.toBase(E.cw + 60, E.ch + 120); return [a[0], a[1], b[0], b[1]]; };
  P.drawRoadPreview = function (ctx) {
    var E = this, cells = E.roadPrev, st = E.stateObj(), n = 0, any = false; cells.forEach(function (c) { var ok = C.canRoad(st, c[0], c[1], E.occ); var p = new Path2D(); dia(p, E.rot, c[0], c[1]); if (ok.ok) n++; ctx.fillStyle = ok.ok ? 'rgba(80,220,120,.65)' : (E.isRoad(c[0], c[1]) ? 'rgba(120,160,255,.35)' : 'rgba(255,80,80,.55)'); ctx.fill(p); });
    E.roadInfo = { n: n, cells: cells.length };
  };
  P.drawLocked = function (ctx) {
    var E = this; C.DISTRICTS.forEach(function (dd) {
      if (E.open[dd.id]) return; var x0 = (dd.id % C.DW) * C.DS, y0 = Math.floor(dd.id / C.DW) * C.DS, p = new Path2D(); quadW(p, E.rot, [[x0, y0], [x0 + C.DS, y0], [x0 + C.DS, y0 + C.DS], [x0, y0 + C.DS]]); ctx.fillStyle = 'rgba(38,52,86,.5)'; ctx.fill(p);
    });
  };
  // vẽ công trình + thực thể
  P.drawObjects = function (ctx, now, night) {
    var E = this, list = E.sortedBuildings(), vis = E.visBox(), items = [], i, e, en = E.entities, t = E.t;
    for (i = 0; i < list.length; i++) { e = list[i]; if (e.sx + 200 < vis[0] || e.sx - 300 > vis[2] || e.sy - e.sp.oy - 300 > vis[3] || e.sy + 200 < vis[1]) continue; items.push({ d: e.d, k: 0, e: e }); }
    var F = E.fixedList(); for (i = 0; i < F.length; i++) { e = F[i]; if (e.sx + 200 < vis[0] || e.sx - 300 > vis[2] || e.sy - e.sp.oy - 300 > vis[3] || e.sy + 200 < vis[1]) continue; items.push({ d: e.d, k: 2, e: e }); }
    var sc = E.sceneryList(); for (i = 0; i < sc.length; i++) { e = sc[i]; if (e.sx + 100 < vis[0] || e.sx - 100 > vis[2] || e.sy - 120 > vis[3] || e.sy + 60 < vis[1]) continue; items.push({ d: e.d, k: 3, e: e }); }
    if (E.fx.cars !== false) for (i = 0; i < en.cars.length; i++) { var c = en.cars[i]; items.push({ d: E.depthOf(c.x, c.y), k: 1, e: c, car: true }); }
    for (i = 0; i < en.people.length; i++) { var pp = en.people[i]; items.push({ d: E.depthOf(pp.x, pp.y), k: 1, e: pp, car: false }); }
    if (E.fx.boats !== false) E.boats().forEach(function (b) { items.push({ d: E.depthOf(b.x, b.y), k: 4, e: b }); });
    if (E.mode === 'place' && E.ghost) { var it = C.BY[E.ghost.k], r = rotRect(E.rot, E.ghost.x, E.ghost.y, it.w, it.h); items.push({ d: (r.rx + r.rw) + (r.ry + r.rh) + .001, k: 5, e: { g: E.ghost, it: it, r: r } }); }
    items.sort(function (a, b) { return a.d - b.d; });
    var gl = []; E.glowList = gl;
    for (i = 0; i < items.length; i++) {
      var o = items[i];
      if (o.k === 0 || o.k === 2 || o.k === 3) E.drawSprite(ctx, o.e, now, t, o.k === 0, gl);
      else if (o.k === 1) E.drawWalker(ctx, o.e, o.car, night);
      else if (o.k === 4) E.drawBoat(ctx, o.e);
      else E.drawGhost(ctx, o.e);
    }
    // vòng chọn
    if (E.sel >= 0) { var sb = list.filter(function (x) { return x.b.i === E.sel; })[0]; if (sb) { var r2 = rotRect(E.rot, sb.b.x, sb.b.y, sb.it.w, sb.it.h), p = new Path2D(); quadW(p, E.rot, [[sb.b.x, sb.b.y], [sb.b.x + sb.it.w, sb.b.y], [sb.b.x + sb.it.w, sb.b.y + sb.it.h], [sb.b.x, sb.b.y + sb.it.h]]); ctx.strokeStyle = 'rgba(255,230,80,.95)'; ctx.lineWidth = 3 / E.cam.z * 1.0; ctx.stroke(p); ctx.fillStyle = 'rgba(255,230,80,.25)'; ctx.fill(p); } }
  };
  P.depthOf = function (x, y) { var q = rotPt(this.rot, x, y); return q[0] + q[1]; };
  P.fixedList = function () {
    var E = this, key = 'f' + E.rot; if (E.fixedCache && E.fixedCache.key === key) return E.fixedCache.l;
    var l = C.FIXED.map(function (f) { var r = rotRect(E.rot, f.x, f.y, f.w, f.h), rw = Math.round(r.rw), rh = Math.round(r.rh); return { f: f, sp: A.getSprite('f', f.k, 1, rw, rh), sx: (r.rx - r.ry) * HW, sy: (r.rx + r.ry) * HH, d: (r.rx + r.rw) + (r.ry + r.rh) }; });
    E.fixedCache = { key: key, l: l }; return l;
  };
  P.sceneryList = function () {
    var E = this, key = 's' + E.rot + ':' + E.roadCount; if (E.scCache && E.scCache.key === key) return E.scCache.l; var l = [], x, y, i;
    // cột đèn tại các ngã tư lớn + cọ ven biển
    for (y = 0; y <= 42; y += 6) for (x = 0; x <= 66; x += 6) { if (x === 12) continue; var s = scr(E.rot, x + .85, y + .85); l.push({ t: 'lamp', sx: s[0], sy: s[1], d: E.depthOf(x + .85, y + .85) }); var s2 = scr(E.rot, x + .15, y + .15); l.push({ t: 'lamp', sx: s2[0], sy: s2[1], d: E.depthOf(x + .15, y + .15) }); }
    for (y = 1; y < 43; y += 3) { var s3 = scr(E.rot, 67.5, y + .5); l.push({ t: 'palm', sx: s3[0], sy: s3[1], d: E.depthOf(67.5, y + .5) }); }
    E.scCache = { key: key, l: l }; return l;
  };
  P.drawSprite = function (ctx, e, now, t, isB, gl) {
    var E = this, sp = e.sp, x, y;
    if (e.t) {   // cảnh phụ nhỏ (đèn, cọ)
      if (e.t === 'lamp') { ctx.strokeStyle = '#4B4F5A'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(e.sx, e.sy); ctx.lineTo(e.sx, e.sy - 17); ctx.stroke(); ctx.fillStyle = '#FFE9A0'; ctx.beginPath(); ctx.arc(e.sx, e.sy - 18, 2.8, 0, TAU); ctx.fill(); gl.push([e.sx, e.sy - 18, 9]); }
      else { ctx.strokeStyle = '#8A5A33'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(e.sx, e.sy); ctx.quadraticCurveTo(e.sx + 3, e.sy - 12, e.sx + 1 + Math.sin(t + e.sx) * 1.2, e.sy - 24); ctx.stroke(); ctx.fillStyle = '#3FA55B'; var tx = e.sx + 1, ty = e.sy - 24, k; for (k = 0; k < 5; k++) { var a = k * 1.26 + Math.sin(t * 1.4 + k) * .12; ctx.beginPath(); ctx.ellipse(tx + Math.cos(a) * 6, ty + Math.sin(a) * 3 - 1, 7, 2.2, a, 0, TAU); ctx.fill(); } }
      return;
    }
    x = e.sx - sp.ox; y = e.sy - sp.oy;
    ctx.drawImage(sp.c, x, y, sp.w, sp.h);
    var b = isB ? e.b : null, m = sp.meta;
    if (isB && e.site) { E.drawSiteExtras(ctx, e, sp, now); }
    else {
      var k;
      if (m.smoke) for (k = 0; k < m.smoke.length; k++) { var s = m.smoke[k], ph; for (ph = 0; ph < 3; ph++) { var u = (t * .42 + ph / 3 + s[0] * .01) % 1; ctx.fillStyle = 'rgba(235,235,240,' + (.55 * (1 - u)) + ')'; ctx.beginPath(); ctx.arc(x + s[0] + u * 6, y + s[1] - u * 20, 2 + u * 4.2, 0, TAU); ctx.fill(); } }
      if (m.flags) m.flags.forEach(function (f) { ctx.fillStyle = f[2]; ctx.beginPath(); var fx = x + f[0], fy = y + f[1]; ctx.moveTo(fx, fy); var j; for (j = 0; j <= 6; j++) ctx.lineTo(fx + j * 2.2, fy + Math.sin(t * 5 + j * .8) * 1.4 + j * .1); for (j = 6; j >= 0; j--) ctx.lineTo(fx + j * 2.2, fy + 6 + Math.sin(t * 5 + j * .8) * 1.4 + j * .1); ctx.closePath(); ctx.fill(); });
      if (m.water) m.water.forEach(function (w) { var j; ctx.strokeStyle = 'rgba(210,240,255,.9)'; ctx.lineWidth = 1.4; for (j = 0; j < 4; j++) { var u = (t * .9 + j * .25) % 1, ang = -1.2 + j * .8; ctx.beginPath(); ctx.moveTo(x + w[0], y + w[1]); ctx.quadraticCurveTo(x + w[0] + Math.cos(ang) * 8 * u, y + w[1] - 14 * Math.sin(u * 3.14), x + w[0] + Math.cos(ang) * 14 * u, y + w[1] + 2 * u); ctx.stroke(); } });
      if (m.duck) m.duck.forEach(function (d, j) { var ox = Math.sin(t * .8 + j * 2) * 5, oy = Math.cos(t * .8 + j * 2) * 2.4; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x + d[0] + ox, y + d[1] + oy, 3.4, 2.1, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#F29A2E'; ctx.fillRect(x + d[0] + ox + 3, y + d[1] + oy - 1, 2, 1.2); });
      if (m.swing) m.swing.forEach(function (s) { var a = Math.sin(t * 2.2) * .5; ctx.strokeStyle = '#7A4B2A'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + s[0], y + s[1]); ctx.lineTo(x + s[0] + Math.sin(a) * 14, y + s[1] + Math.cos(a) * 14); ctx.stroke(); ctx.fillStyle = '#E9573F'; ctx.fillRect(x + s[0] + Math.sin(a) * 14 - 3, y + s[1] + Math.cos(a) * 14, 6, 2); });
      if (m.beacon) { var on = Math.sin(t * 6) > 0; ctx.fillStyle = on ? '#FF4F4F' : '#5A1F1F'; ctx.beginPath(); ctx.arc(x + m.beacon[0], y + m.beacon[1], 2.6, 0, TAU); ctx.fill(); if (on) gl.push([x + m.beacon[0], y + m.beacon[1], 8]); }
      if (isB && e.b.tg > e.b.lv && e.b.lv > 0) E.drawSiteExtras(ctx, e, sp, now, true);
    }
    if (sp.glow) gl.push([x, y, sp]);
    if (isB) E.drawBar(ctx, e, sp, now, x, y);
  };
  P.drawSiteExtras = function (ctx, e, sp, now, upgrade) {
    var t = this.t, c = sp.meta.crane && sp.meta.crane[0], x = e.sx - sp.ox, y = e.sy - sp.oy; if (!c) { c = [sp.ox, 10]; }
    var cx = x + c[0], cy = y + c[1], a = Math.sin(t * .8 + e.b.i) * .9; ctx.strokeStyle = '#F2C21B'; ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(a) * 22, cy + Math.sin(a) * 7 - 4); ctx.stroke(); ctx.strokeStyle = '#333'; ctx.lineWidth = .9; ctx.beginPath(); ctx.moveTo(cx + Math.cos(a) * 20, cy + Math.sin(a) * 7 - 4); ctx.lineTo(cx + Math.cos(a) * 20, cy + 6 + Math.sin(t * 3) * 2); ctx.stroke();
    ctx.fillStyle = 'rgba(180,160,130,.5)'; var k; for (k = 0; k < 3; k++) { var u = (t * .7 + k / 3) % 1; ctx.beginPath(); ctx.arc(x + sp.ox + (k - 1) * 10, y + sp.oy - 4 - u * 8, 2 + u * 3, 0, TAU); ctx.globalAlpha = .5 * (1 - u); ctx.fill(); ctx.globalAlpha = 1; }
  };
  P.drawBar = function (ctx, e, sp, now, x, y) {
    var b = e.b, E = this; if (b.tg > b.lv) {
      var p = clamp((now - b.t0) / Math.max(1, b.t1 - b.t0), 0, 1), w = 40, cx = e.sx, cy = y - 6; ctx.fillStyle = 'rgba(30,30,50,.75)'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - w / 2 - 1.5, cy - 2.5, w + 3, 8, 4) : ctx.rect(cx - w / 2 - 1.5, cy - 2.5, w + 3, 8); ctx.fill(); ctx.fillStyle = '#4CD08A'; ctx.beginPath(); ctx.roundRect ? ctx.roundRect(cx - w / 2, cy - 1, Math.max(3, w * p), 5, 2.5) : ctx.rect(cx - w / 2, cy - 1, Math.max(3, w * p), 5); ctx.fill();
      if (E.cam.z > .6) { var rem = Math.max(0, Math.ceil((b.t1 - now) / 1000)), txt = rem >= 3600 ? Math.floor(rem / 3600) + 'h' + ('0' + Math.floor(rem % 3600 / 60)).slice(-2) : Math.floor(rem / 60) + ':' + ('0' + rem % 60).slice(-2); ctx.font = '700 9px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 2.5; ctx.strokeText(txt, cx, cy - 6); ctx.fillText(txt, cx, cy - 6); }
    } else if (b.pend >= 1 && E.cam.z >= .45) {
      var bob = Math.sin(E.t * 3 + b.i) * 2.5, bx = e.sx, by = y - 14 + bob, br = E.cam.z < .8 ? 7 : 9; ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(bx, by + br + 2, 6, 2, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#FFD84A'; ctx.strokeStyle = '#C48A10'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(bx, by, br, 0, TAU); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#9A6A00'; ctx.font = '800 ' + (br + 2) + 'px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('$', bx, by + .5); ctx.textBaseline = 'alphabetic';
    }
  };
  P.drawWalker = function (ctx, w, car, night) {
    var E = this, r = E.rot, nx = -w.dy * (car ? .17 : .4) * w.side * (car ? -1 : 1), ny = w.dx * (car ? .17 : .4) * w.side * (car ? -1 : 1), cx = w.x + nx, cy = w.y + ny;
    if (!car) { var s = scr(r, cx, cy), bob = Math.abs(Math.sin(E.t * 7 + w.ph)) * 1.4; ctx.fillStyle = 'rgba(0,0,0,.22)'; ctx.beginPath(); ctx.ellipse(s[0], s[1] + 1, 3, 1.4, 0, 0, TAU); ctx.fill(); ctx.fillStyle = w.c; ctx.fillRect(s[0] - 1.8, s[1] - 7 - bob, 3.6, 5.2); ctx.fillStyle = '#F2C9A0'; ctx.beginPath(); ctx.arc(s[0], s[1] - 9 - bob, 2, 0, TAU); ctx.fill(); return; }
    var len = .3, wid = .16, ax = w.dx !== 0, hx = ax ? len : wid, hy = ax ? wid : len, z = 3.2, body = [scr(r, cx - hx, cy - hy), scr(r, cx + hx, cy - hy), scr(r, cx + hx, cy + hy), scr(r, cx - hx, cy + hy)];
    var up = function (p, zz) { return [p[0], p[1] - zz]; }, face = function (pts, col) { ctx.fillStyle = col; ctx.beginPath(); pts.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1]); }); ctx.closePath(); ctx.fill(); };
    var pz = body.map(function (p) { return up(p, z); }); ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); body.forEach(function (p, i) { i ? ctx.lineTo(p[0], p[1] + 1) : ctx.moveTo(p[0], p[1] + 1); }); ctx.closePath(); ctx.fill();
    // hai mặt nhìn thấy: chọn các cạnh phía dưới màn hình
    var idx = [0, 1, 2, 3].sort(function (a, b) { return (body[b][1] + body[(b + 1) % 4][1]) - (body[a][1] + body[(a + 1) % 4][1]); }).slice(0, 2);
    idx.forEach(function (i, n) { var j = (i + 1) % 4; face([body[i], body[j], pz[j], pz[i]], n ? Cshade(w.c, .78) : Cshade(w.c, .92)); });
    face(pz, w.c); var cabin = [0, 1, 2, 3].map(function (i) { var c = [(pz[i][0] * 3 + (pz[0][0] + pz[2][0]) / 2) / 4, (pz[i][1] * 3 + (pz[0][1] + pz[2][1]) / 2) / 4 - 2]; return c; }); face(cabin, 'rgba(255,255,255,.55)');
    if (night > .3) { ctx.fillStyle = 'rgba(255,240,170,.9)'; var hp = scr(r, cx + w.dx * len, cy + w.dy * len); ctx.beginPath(); ctx.arc(hp[0], hp[1] - 2.5, 1.6, 0, TAU); ctx.fill(); this.glowList && this.glowList.push([hp[0], hp[1] - 2.5, 7]); }
  };
  function Cshade(c, f) { return A.shade(c, f); }
  P.boats = function () {
    var E = this, t = E.t, out = [], i; for (i = 0; i < 3; i++) { var u = (t * .045 + i * .33) % 1, y = u * 44, x = 11.5 + Math.sin(u * 6.28 * 2 + i) * .3; out.push({ x: x, y: i % 2 ? 44 - y : y, dir: i % 2 ? 0 : 1, c: ['#fff', '#F2C21B', '#E9573F'][i], s: .9 }); }
    for (i = 0; i < 3; i++) { var u2 = (t * .03 + i * .31) % 1; out.push({ x: 70 + Math.sin(u2 * 6.28 + i) * .8, y: u2 * 46, dir: 1, c: ['#fff', '#4F80BA', '#F2C21B'][i], s: 1.2 }); }
    for (i = 0; i < 2; i++) { var u3 = (t * .028 + i * .5) % 1; out.push({ x: 66 - u3 * 62, y: 46.5 + Math.sin(u3 * 6.28 + i) * .5, dir: 2, c: ['#fff', '#E9573F'][i], s: 1.2 }); }
    return out;
  };
  P.drawBoat = function (ctx, b) {
    var E = this, s = scr(E.rot, b.x, b.y), k = b.s, bob = Math.sin(E.t * 2 + b.x) * 1.2; ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(s[0], s[1] + 2, 12 * k, 4.4 * k, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#7A4B2A'; ctx.beginPath(); ctx.moveTo(s[0] - 9 * k, s[1] - 2 + bob); ctx.lineTo(s[0] + 9 * k, s[1] - 2 + bob); ctx.lineTo(s[0] + 6 * k, s[1] + 3 + bob); ctx.lineTo(s[0] - 6 * k, s[1] + 3 + bob); ctx.closePath(); ctx.fill(); ctx.fillStyle = b.c; ctx.fillRect(s[0] - 7 * k, s[1] - 5 + bob, 14 * k, 3.4);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(40,28,60,.35)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(s[0], s[1] - 6 + bob); ctx.lineTo(s[0], s[1] - 20 * k + bob); ctx.lineTo(s[0] + 8 * k, s[1] - 7 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
  };
  P.drawGhost = function (ctx, o) {
    var E = this, g = o.g, it = o.it, r = o.r, rw = Math.round(r.rw), rh = Math.round(r.rh), sp = A.getSprite('b', g.k, 1, rw, rh), sx = (r.rx - r.ry) * HW, sy = (r.rx + r.ry) * HH, p = new Path2D(); quadW(p, E.rot, [[g.x, g.y], [g.x + it.w, g.y], [g.x + it.w, g.y + it.h], [g.x, g.y + it.h]]);
    ctx.fillStyle = g.ok ? 'rgba(70,220,120,.55)' : 'rgba(255,70,70,.55)'; ctx.fill(p); ctx.strokeStyle = g.ok ? '#1FA85A' : '#D93A3A'; ctx.lineWidth = 2.5 / E.cam.z; ctx.stroke(p);
    ctx.globalAlpha = g.ok ? .88 : .5; ctx.drawImage(sp.c, sx - sp.ox, sy - sp.oy - Math.abs(Math.sin(E.t * 4)) * 2, sp.w, sp.h); ctx.globalAlpha = 1;
  };
  P.drawSky = function (ctx, night) {
    var E = this, en = E.entities, t = E.t, vis = E.visBox(); if (!E.fx.sky) return;
    // bóng mây trên mặt đất + mây
    var cl = E.weather === 'cloud' || E.weather === 'rain' ? 1.6 : 1;
    en.clouds.forEach(function (c) {
      var s = scr(E.rot, c.x, c.y); ctx.fillStyle = 'rgba(30,50,80,.10)'; ctx.beginPath(); ctx.ellipse(s[0] + 20, s[1] + 10, 60 * c.s * cl, 24 * c.s * cl, 0, 0, TAU); ctx.fill();
      var cx = s[0], cy = s[1] - 230; if (cx < vis[0] - 200 || cx > vis[2] + 200 || cy < vis[1] - 200 || cy > vis[3] + 200) return; ctx.fillStyle = 'rgba(255,255,255,' + (night > .5 ? .35 : .88) + ')'; [[0, 0, 36], [-34, 8, 26], [34, 8, 28], [14, -10, 26], [-12, -8, 24]].forEach(function (q) { ctx.beginPath(); ctx.ellipse(cx + q[0] * c.s * cl, cy + q[1] * c.s * cl * .6, q[2] * c.s * cl, q[2] * .55 * c.s * cl, 0, 0, TAU); ctx.fill(); });
    });
    en.balloons.forEach(function (b) { var s = scr(E.rot, b.x, b.y), bob = Math.sin(t * .9 + b.ph) * 4, x = s[0], y = s[1] - 150 + bob; if (x < vis[0] - 60 || x > vis[2] + 60 || y < vis[1] - 80 || y > vis[3] + 80) return; ctx.fillStyle = 'rgba(0,0,0,.12)'; ctx.beginPath(); ctx.ellipse(x + 10, s[1] + 4, 12, 5, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#6B4A2E'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(x - 6, y + 9); ctx.lineTo(x - 3, y + 19); ctx.moveTo(x + 6, y + 9); ctx.lineTo(x + 3, y + 19); ctx.stroke(); ctx.fillStyle = '#7A4B2A'; ctx.fillRect(x - 3.5, y + 19, 7, 5); ctx.fillStyle = b.c; ctx.beginPath(); ctx.ellipse(x, y, 13, 15, 0, 0, TAU); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.beginPath(); ctx.ellipse(x, y, 4.4, 15, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = 'rgba(40,28,60,.4)'; ctx.lineWidth = .9; ctx.beginPath(); ctx.ellipse(x, y, 13, 15, 0, 0, TAU); ctx.stroke(); });
    en.birds.forEach(function (b) { var k; for (k = 0; k < b.n; k++) { var s = scr(E.rot, b.x - k * .8 * Math.sign(b.vx), b.y + k * .5 * (k % 2 ? 1 : -1)), x = s[0], y = s[1] - 130 - k * 2, f = Math.sin(b.ph + k) * 4; if (x < vis[0] - 20 || x > vis[2] + 20 || y < vis[1] - 20 || y > vis[3] + 20) continue; ctx.strokeStyle = night > .5 ? '#cfd6e8' : '#fff'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x - 6, y - f); ctx.quadraticCurveTo(x - 2, y - 3, x, y); ctx.quadraticCurveTo(x + 2, y - 3, x + 6, y - f); ctx.stroke(); } });
    en.planes.forEach(function (p) { if (p.wait > 0) return; var s = scr(E.rot, p.x, p.y), x = s[0], y = s[1] - 210; if (x < vis[0] - 80 || x > vis[2] + 80 || y < vis[1] - 80 || y > vis[3] + 80) return; var ang = Math.atan2(scr(E.rot, p.x + p.vx, p.y + p.vy)[1] - s[1], scr(E.rot, p.x + p.vx, p.y + p.vy)[0] - s[0]); ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.fillStyle = '#F4F6FA'; ctx.strokeStyle = 'rgba(40,28,60,.45)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(0, 0, 18, 4, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-2, 0); ctx.lineTo(-9, -11); ctx.lineTo(-4, -11); ctx.lineTo(5, 0); ctx.lineTo(-4, 11); ctx.lineTo(-9, 11); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#E9573F'; ctx.beginPath(); ctx.moveTo(-16, 0); ctx.lineTo(-20, -6); ctx.lineTo(-14, -1); ctx.fill(); ctx.restore(); ctx.fillStyle = 'rgba(0,0,0,.1)'; ctx.beginPath(); ctx.ellipse(x + 20, s[1] + 8, 16, 4, 0, 0, TAU); ctx.fill(); });
  };
  P.drawAtmosphere = function (ctx, night) {
    var E = this, cw = E.cw, ch = E.ch, w = E.weather;
    // ánh sáng đèn ban đêm
    if (night > .02 && E.glowList) {
      var z = E.cam.z; ctx.save(); ctx.globalCompositeOperation = 'multiply'; var k = night, fr = 255 - Math.round(150 * k), fg = 255 - Math.round(125 * k), fb = 255 - Math.round(60 * k); ctx.fillStyle = 'rgb(' + fr + ',' + fg + ',' + fb + ')'; ctx.fillRect(0, 0, cw, ch); ctx.restore();
      ctx.save(); ctx.setTransform(E.dpr * z, 0, 0, E.dpr * z, E.dpr * (cw / 2 - E.cam.x * z), E.dpr * (ch / 2 - E.cam.y * z)); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(.85, night * 1.1);
      E.glowList.forEach(function (q) { if (q[2] && q[2].glow) ctx.drawImage(q[2].glow, q[0], q[1], q[2].w, q[2].h); else { var g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], q[2]); g.addColorStop(0, 'rgba(255,225,140,.9)'); g.addColorStop(1, 'rgba(255,225,140,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q[0], q[1], q[2], 0, TAU); ctx.fill(); } });
      ctx.restore();
    } else { var h = E.hour(); if (h >= 17 && h < 18.5) { ctx.save(); ctx.globalCompositeOperation = 'multiply'; var gv = (h - 17) / 1.5; ctx.fillStyle = 'rgb(255,' + (255 - Math.round(40 * gv)) + ',' + (255 - Math.round(90 * gv)) + ')'; ctx.fillRect(0, 0, cw, ch); ctx.restore(); } }
    if (w === 'rain' || w === 'snow') {
      ctx.save(); if (w === 'rain') { ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgb(200,210,225)'; ctx.fillRect(0, 0, cw, ch); ctx.globalCompositeOperation = 'source-over'; ctx.strokeStyle = 'rgba(210,225,255,.65)'; ctx.lineWidth = 1.1; ctx.beginPath(); E.rain.forEach(function (r) { var x = r.x * cw, y = r.y * ch; ctx.moveTo(x, y); ctx.lineTo(x - 3, y + 11); }); ctx.stroke(); }
      else { ctx.fillStyle = 'rgba(255,255,255,.9)'; E.rain.forEach(function (r) { ctx.beginPath(); ctx.arc(r.x * cw, r.y * ch, 1.6 + r.v * 1.2, 0, TAU); ctx.fill(); }); ctx.globalCompositeOperation = 'screen'; ctx.fillStyle = 'rgba(170,190,220,.12)'; ctx.fillRect(0, 0, cw, ch); }
      ctx.restore();
    } else if (w === 'cloud') { ctx.save(); ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = 'rgb(225,230,238)'; ctx.fillRect(0, 0, cw, ch); ctx.restore(); }
  };

  /* ───── mini-map ───── */
  P.drawMini = function () {
    var E = this, m = E.mini, c = m.getContext('2d'), w = m.width, h = m.height, sx = w / W, sy = h / H, i, x, y;
    c.clearRect(0, 0, w, h); c.fillStyle = '#4AA8DD'; c.fillRect(0, 0, w, h);
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) { i = y * W + x; var col = C.TERR[i] === 1 ? '#4DB1EA' : C.TERR[i] === 2 ? '#F3E0AE' : (C.ROAD[i] || E.roadsX[i]) ? '#6A7280' : '#92D56A'; if (col !== '#4AA8DD') { c.fillStyle = col; c.fillRect(x * sx, y * sy, Math.ceil(sx), Math.ceil(sy)); } }
    E.bs.forEach(function (b) { var it = C.BY[b.k]; c.fillStyle = b.lv === 0 ? '#C9A872' : it.cat === 'home' ? '#E9573F' : it.cat === 'shop' ? '#4F80BA' : it.cat === 'park' ? '#2E9E7F' : '#F2C21B'; c.fillRect(b.x * sx, b.y * sy, it.w * sx, it.h * sy); });
    C.DISTRICTS.forEach(function (d) { var x0 = (d.id % C.DW) * C.DS * sx, y0 = Math.floor(d.id / C.DW) * C.DS * sy; if (!E.open[d.id]) { c.fillStyle = 'rgba(38,52,86,.55)'; c.fillRect(x0, y0, C.DS * sx, C.DS * sy); } c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1; c.strokeRect(x0 + .5, y0 + .5, C.DS * sx - 1, C.DS * sy - 1); });
    // vùng đang xem
    var pts = [[0, 0], [E.cw, 0], [E.cw, E.ch], [0, E.ch]].map(function (p) { var b = E.toBase(p[0], p[1]), q = E.baseToWorld(b[0], b[1]); return [q[0] * sx, q[1] * sy]; });
    c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); pts.forEach(function (p, k) { k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.stroke();
  };

  root.EWTCityEngine = Engine;
})(typeof window !== 'undefined' ? window : this);
