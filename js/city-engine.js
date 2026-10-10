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
    // điện thoại / iPad: giảm độ phân giải vẽ, bắt đầu ở chất lượng vừa, tự hạ thêm nếu máy yếu
    E.mobile = (function () { try { return (window.matchMedia && matchMedia('(pointer: coarse)').matches) || (navigator.maxTouchPoints || 0) > 1; } catch (e) { return false; } })();
    var lowMem = (navigator.deviceMemory && navigator.deviceMemory <= 2) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4);
    if (E.mobile) E.dpr = Math.min(E.dpr, 1.5); E.inputT = performance.now(); E.lastDraw = 0;
    E.bs = []; E.roadsX = new Uint8Array(W * H); E.open = {}; E.occ = new Int32Array(W * H); E.mode = 'view'; E.ghost = null; E.sel = -1; E.hover = null; E.roadPrev = null;
    E.weather = 'clear'; E.hourOverride = null; E.quality = E.mobile ? (lowMem ? 0 : 1) : 2; E.fx = { cars: true, people: true, boats: true, sky: true, shimmer: true, lasers: true };
    E.gcache = {}; E.entities = { cars: [], people: [], boats: [], birds: [], balloons: [], planes: [], clouds: [] }; E.rain = []; E.skew = 0; E.dirtyRoads = true; E.fixedSorted = [];
    E.msel = {}; E.boxSel = false; E.mrect = null; E.paint = false; E.paintCells = null;
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
    var budget = E.mobile ? 2.4e6 : 6e6, d = Math.max(1, Math.min(E.dpr, Math.sqrt(budget / (E.cw * E.ch)))); if (d < E.dpr) E.dpr = d;   // không để canvas quá lớn (iPad)
    E.cv.width = Math.round(E.cw * E.dpr); E.cv.height = Math.round(E.ch * E.dpr);
  };

  /* ───── trạng thái từ máy chủ ───── */
  P.setState = function (v) {
    var E = this; E.skew = v.now - Date.now(); E.bs = v.bs.slice(); var prevOpen = E.open || {}; E.open = {}; v.districts.forEach(function (d) { E.open[d] = 1; }); E.open_key = v.districts.slice().sort().join(',');
    var nr = new Uint8Array(W * H); v.roads.forEach(function (i) { nr[i] = 1; });
    var changed = E.roadsX.length !== nr.length || v.roads.length !== E.roadCount; if (!changed) for (var i = 0; i < nr.length; i++) if (nr[i] !== E.roadsX[i]) { changed = true; break; }
    E.roadsX = nr; E.roadCount = v.roads.length; E.roadTiles = null; if (changed) { E.dirtyRoads = true; E.gcache = {}; E.scCache = null; }
    E.occ = C.buildOcc(E.bs.map(function (b) { return { k: b.k, x: b.x, y: b.y }; })); E.version++; E.pendSum = 0; E.bs.forEach(function (b) { E.pendSum += b.pend; });
    var mk = Object.keys(E.msel), mch = false; mk.forEach(function (id) { if (!E.bs.some(function (b) { return b.i === +id; })) { delete E.msel[id]; mch = true; } }); if (mch && E.o.onMulti) E.o.onMulti();
    if (E.sel >= 0 && !E.bs.some(function (b) { return b.i === E.sel; })) { E.sel = -1; if (E.o.onSelect) E.o.onSelect(null); }
    E.allowed = null; if (E.mode === 'place' && E.ghost) E.refreshGhost(); E.lockCache = null;
  };
  P.stateObj = function () { var E = this, roads = {}, i; for (i = 0; i < E.roadsX.length; i++) if (E.roadsX[i]) roads[i] = 1; return { districts: Object.keys(E.open).map(Number), roads: roads }; };
  P.isRoad = function (x, y) { return C.inW(x, y) && (C.ROAD[y * W + x] > 0 || this.roadsX[y * W + x] > 0); };

  /* ───── nền: Path2D dựng sẵn mỗi hướng ───── */
  function dia(path, r, x, y) { var q = rotRect(r, x, y, 1, 1), X = q.rx, Y = q.ry, a = [(X - Y) * HW, (X + Y) * HH], b = [(X + 1 - Y) * HW, (X + 1 + Y) * HH], c = [(X + 1 - Y - 1) * HW, (X + 1 + Y + 1) * HH], d = [(X - Y - 1) * HW, (X + Y + 1) * HH]; path.moveTo(a[0], a[1]); path.lineTo(b[0], b[1]); path.lineTo(c[0], c[1]); path.lineTo(d[0], d[1]); path.closePath(); }
  function quadW(path, r, pts) { var i, s; for (i = 0; i < pts.length; i++) { s = scr(r, pts[i][0], pts[i][1]); if (i) path.lineTo(s[0], s[1]); else path.moveTo(s[0], s[1]); } path.closePath(); }
  /* ───── nền: chia thành các mảnh (chunk) 24×24 ô, dựng Path2D theo từng hướng xoay, chỉ vẽ mảnh đang nhìn thấy ───── */
  var CHK = 24;
  // gộp các ô liên tiếp trên một hàng thành một dải (ít đường vẽ hơn nhiều)
  function runs(path, r, x0, y0, x1, y1, test) {
    var x, y, a;
    for (y = y0; y < y1; y++) { a = -1; for (x = x0; x <= x1; x++) { var ok = x < x1 && test(x, y); if (ok && a < 0) a = x; if (!ok && a >= 0) { quadW(path, r, [[a, y], [x, y], [x, y + 1], [a, y + 1]]); a = -1; } } }
  }
  P.chunk = function (cx, cy) {
    var E = this, r = E.rot, key = 'c' + r + ':' + cx + ':' + cy; if (E.gcache[key]) return E.gcache[key];
    var x0 = cx * CHK, y0 = cy * CHK, x1 = Math.min(W, x0 + CHK), y1 = Math.min(H, y0 + CHK), x, y, i, T = C.TERR, R = C.ROAD;
    var g = { land: new Path2D(), sand: new Path2D(), rock: new Path2D(), snow: new Path2D(), forest: new Path2D(), tarmac: new Path2D(), check: new Path2D(), road: new Path2D(), walk: new Path2D(), dash: new Path2D(), rail: new Path2D(), wavesT: [], sandDots: [] };
    var isRd = function (a, b) { return E.isRoad(a, b); }, snowy = function (x, y) { return y < 6 + 2.5 * Math.sin(x * .37) + (C.hash(x, y, 11) * 2.5); };
    runs(g.land, r, x0, y0, x1, y1, function (x, y) { return T[y * W + x] !== 1; });
    runs(g.sand, r, x0, y0, x1, y1, function (x, y) { return T[y * W + x] === 2; });
    runs(g.rock, r, x0, y0, x1, y1, function (x, y) { return T[y * W + x] === 3 && !snowy(x, y); });
    runs(g.snow, r, x0, y0, x1, y1, function (x, y) { return T[y * W + x] === 3 && snowy(x, y); });
    runs(g.forest, r, x0, y0, x1, y1, function (x, y) { return T[y * W + x] === 4; });
    runs(g.tarmac, r, x0, y0, x1, y1, function (x, y) { return T[y * W + x] === 5; });
    // đường: dải ngang (≥2 ô) trước, ô còn lại gộp theo cột
    var inRun = new Uint8Array(CHK * CHK), a;
    for (y = y0; y < y1; y++) { a = -1; for (x = x0; x <= x1; x++) { var rd = x < x1 && isRd(x, y); if (rd && a < 0) a = x; if (!rd && a >= 0) { if (x - a >= 2) { quadW(g.road, r, [[a, y], [x, y], [x, y + 1], [a, y + 1]]); var k; for (k = a; k < x; k++) inRun[(y - y0) * CHK + (k - x0)] = 1; } a = -1; } } }
    for (x = x0; x < x1; x++) { a = -1; for (y = y0; y <= y1; y++) { var rd2 = y < y1 && isRd(x, y) && !inRun[(y - y0) * CHK + (x - x0)]; if (rd2 && a < 0) a = y; if (!rd2 && a >= 0) { quadW(g.road, r, [[x, a], [x + 1, a], [x + 1, y], [x, y]]); a = -1; } } }
    for (y = y0; y < y1; y++) for (x = x0; x < x1; x++) {
      i = y * W + x; var t = T[i], road = isRd(x, y);
      if (t === 1) { if ((x * 7 + y * 3) % 5 === 0) g.wavesT.push([x, y]); }
      else if (t === 2) { if ((x + y) % 3 === 0) g.sandDots.push([x, y]); }
      else if (t === 0 && !road && (x + y) % 2 === 0) dia(g.check, r, x, y);
      if (road) {
        var nE = isRd(x + 1, y), nW = isRd(x - 1, y), nS = isRd(x, y + 1), nN = isRd(x, y - 1), br = R[i] === 2;
        var e = .11, edge = function (dx, dy) { return dx ? [[x + (dx > 0 ? 1 - e : 0), y], [x + (dx > 0 ? 1 : e), y], [x + (dx > 0 ? 1 : e), y + 1], [x + (dx > 0 ? 1 - e : 0), y + 1]] : [[x, y + (dy > 0 ? 1 - e : 0)], [x + 1, y + (dy > 0 ? 1 - e : 0)], [x + 1, y + (dy > 0 ? 1 : e)], [x, y + (dy > 0 ? 1 : e)]]; };
        var tgt = br ? g.rail : g.walk;
        if (!nE) quadW(tgt, r, edge(1, 0)); if (!nW) quadW(tgt, r, edge(-1, 0)); if (!nS) quadW(tgt, r, edge(0, 1)); if (!nN) quadW(tgt, r, edge(0, -1));
        var horiz = nE && nW && !nN && !nS, vert = nN && nS && !nE && !nW;
        if (horiz) { var a1 = scr(r, x + .28, y + .5), b1 = scr(r, x + .72, y + .5); g.dash.moveTo(a1[0], a1[1]); g.dash.lineTo(b1[0], b1[1]); }
        if (vert) { var a2 = scr(r, x + .5, y + .28), b2 = scr(r, x + .5, y + .72); g.dash.moveTo(a2[0], a2[1]); g.dash.lineTo(b2[0], b2[1]); }
      }
    }
    var cs = [scr(r, x0, y0), scr(r, x1, y0), scr(r, x1, y1), scr(r, x0, y1)]; g.box = [Math.min(cs[0][0], cs[1][0], cs[2][0], cs[3][0]) - 50, Math.min(cs[0][1], cs[1][1], cs[2][1], cs[3][1]) - 120, Math.max(cs[0][0], cs[1][0], cs[2][0], cs[3][0]) + 50, Math.max(cs[0][1], cs[1][1], cs[2][1], cs[3][1]) + 60];
    E.gcache[key] = g; return g;
  };
  P.visChunks = function () {
    var E = this, vis = E.visBox(), out = [], cx, cy, nx = Math.ceil(W / CHK), ny = Math.ceil(H / CHK), r = E.rot;
    for (cy = 0; cy < ny; cy++) for (cx = 0; cx < nx; cx++) {
      var x0 = cx * CHK, y0 = cy * CHK, x1 = Math.min(W, x0 + CHK), y1 = Math.min(H, y0 + CHK), c = [scr(r, x0, y0), scr(r, x1, y0), scr(r, x1, y1), scr(r, x0, y1)];
      var mnx = Math.min(c[0][0], c[1][0], c[2][0], c[3][0]) - 50, mxx = Math.max(c[0][0], c[1][0], c[2][0], c[3][0]) + 50, mny = Math.min(c[0][1], c[1][1], c[2][1], c[3][1]) - 120, mxy = Math.max(c[0][1], c[1][1], c[2][1], c[3][1]) + 60;
      if (mxx < vis[0] || mnx > vis[2] || mxy < vis[1] || mny > vis[3]) continue; out.push(E.chunk(cx, cy));
    }
    return out;
  };
  // một Path2D toàn bản đồ cho các ô thoả điều kiện (dải ngang gộp)
  P.mapPath = function (test) { var p = new Path2D(); runs(p, this.rot, 0, 0, W, H, test); return p; };
  P.zonePath = function (letter) {
    var E = this, key = 'z' + E.rot + letter; if (E.gcache[key]) return E.gcache[key];
    var code = letter.charCodeAt(0); return (E.gcache[key] = E.mapPath(function (x, y) { var i = y * W + x; return C.ZONE[i] === code && !E.roadsX[i]; }));
  };
  // các ô cho phép đặt công trình đang chọn (tô xanh khi đang ở chế độ xây)
  P.allowedPath = function () {
    var E = this, g = E.ghost; if (!g) return null; if (E.allowed && E.allowed.k === g.k && E.allowed.v === E.version && E.allowed.r === E.rot) return E.allowed;
    var it = C.BY[g.k], st = E.stateObj(), occ = E.occ, near = new Path2D(), ok = new Path2D(), x, y, a, a2;
    var good = function (x, y) { var i = y * W + x; if (C.TERR[i] !== 0 || C.ROAD[i] || E.roadsX[i] || C.FOCC[i] >= 0 || occ[i] || !E.open[C.DIST[i]]) return 0; var zs = String.fromCharCode(C.ZONE[i]); if (it.z !== '*' && it.z.indexOf(zs) < 0) return 0; return C.adjacentRoad(x, y, 1, 1, st.roads) ? 1 : (it.w * it.h > 1 ? 2 : 0); };
    var cache = new Uint8Array(W * H); for (y = 0; y < H; y++) for (x = 0; x < W; x++) cache[y * W + x] = good(x, y);
    runs(ok, E.rot, 0, 0, W, H, function (x, y) { return cache[y * W + x] === 1; }); runs(near, E.rot, 0, 0, W, H, function (x, y) { return cache[y * W + x] === 2; });
    return (E.allowed = { k: g.k, v: E.version, r: E.rot, ok: ok, near: near });
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
    var E = this; E.mode = m; E.allowed = null; E.roadPrev = null; E.mrect = null; E.paintCells = null; if (m !== 'multi') { E.msel = {}; E.boxSel = false; } if (m !== 'place') E.paint = false;
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
  P.fitAll = function (instant) { var E = this, c = scr(E.rot, W / 2, H / 2), z = Math.min(E.cw / ((W + H) * HW * 1.05), E.ch / ((W + H) * HH * 1.05)); E.goto(c[0], c[1], Math.max(.09, z), instant); };
  P.goto = function (x, y, z, instant) { var E = this; if (instant) { E.cam.x = x; E.cam.y = y; E.cam.z = z == null ? E.cam.z : z; E.anim = null; return; } E.anim = { x0: E.cam.x, y0: E.cam.y, z0: E.cam.z, x1: x, y1: y, z1: z == null ? E.cam.z : z, t: 0, d: .55 }; };
  P.focusDistrict = function (d) { var E = this, dd = C.DISTRICTS[d]; if (!dd) return; var an = distAnchor(dd), s = scr(E.rot, an[0], an[1]), w = Math.max(an[2][2], 24), h = Math.max(an[2][3], 24), z = Math.min(E.cw / ((w + h) * HW * 1.1), E.ch / ((w + h) * HH * 1.15)); E.goto(s[0], s[1], clamp(z, .3, 1.2)); };
  P.focusTile = function (x, y, z) { var s = scr(this.rot, x + .5, y + .5); this.goto(s[0], s[1], z); };
  P.rotate = function (dir) {
    var E = this, c = E.baseToWorld(E.cam.x, E.cam.y); E.rot = (E.rot + (dir > 0 ? 1 : 3)) % 4; var s = scr(E.rot, c[0], c[1]); E.cam.x = s[0]; E.cam.y = s[1]; E.anim = null; E.allowed = null; E.lockCache = null;
    if (E.ghost) { E.refreshGhost(); } if (E.o.onRotate) E.o.onRotate(E.rot);
  };
  P.zoomAt = function (f, px, py) { var E = this, before = E.toBase(px, py), z = clamp(E.cam.z * f, .09, 2.6); E.cam.z = z; var after = E.toBase(px, py); E.cam.x += before[0] - after[0]; E.cam.y += before[1] - after[1]; E.anim = null; };
  P.clampCam = function () { var E = this, a = scr(E.rot, W / 2, H / 2), lim = (W + H) * HW * .55; E.cam.x = clamp(E.cam.x, a[0] - lim, a[0] + lim); E.cam.y = clamp(E.cam.y, a[1] - lim * .62, a[1] + lim * .62); };

  /* ───── nhập liệu ───── */
  P.bind = function () {
    var E = this, cv = E.cv, ptrs = {}, drag = null, pinch = null, lastTap = 0, lastTapPos = null;
    var pos = function (e) { var r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    cv.style.touchAction = 'none';
    cv.addEventListener('pointerdown', function (e) {
      E.poke();
      try { cv.setPointerCapture(e.pointerId); } catch (er) { /* bỏ qua */ } var p = pos(e); ptrs[e.pointerId] = p; var ids = Object.keys(ptrs);
      if (ids.length === 2) { var a = ptrs[ids[0]], b = ptrs[ids[1]]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: E.cam.z }; drag = null; return; }
      drag = { x: p[0], y: p[1], cx: E.cam.x, cy: E.cam.y, moved: false, pid: e.pointerId, touch: e.pointerType !== 'mouse', t: performance.now(), mode: E.mode, startTile: E.screenToTile(p[0], p[1]) };
      if (E.mode === 'road') { E.roadDrag = { a: drag.startTile, b: drag.startTile }; E.roadPrev = E.roadCells(); }
      else if (E.mode === 'multi' && E.boxSel) { drag.box = true; E.mrect = { x0: p[0], y0: p[1], x1: p[0], y1: p[1] }; }
      else if (E.mode === 'place' && E.paint && E.ghost && C.BY[E.ghost.k].w === 1 && C.BY[E.ghost.k].h === 1) { drag.paint = true; E.paintCells = []; E.paintSt = E.stateObj(); E.paintAdd(p); }
    });
    cv.addEventListener('pointermove', function (e) {
      E.poke();
      var p = pos(e); if (ptrs[e.pointerId]) ptrs[e.pointerId] = p;
      if (pinch && Object.keys(ptrs).length >= 2) { var ids = Object.keys(ptrs), a = ptrs[ids[0]], b = ptrs[ids[1]], d = Math.hypot(a[0] - b[0], a[1] - b[1]); E.zoomAt((pinch.z * d / pinch.d) / E.cam.z, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2); E.clampCam(); return; }
      if (drag && drag.pid === e.pointerId) {
        var dx = p[0] - drag.x, dy = p[1] - drag.y; if (!drag.moved && Math.hypot(dx, dy) > 7) drag.moved = true;
        if (drag.box) { E.mrect.x1 = p[0]; E.mrect.y1 = p[1]; return; } if (drag.paint) { E.paintAdd(p); return; }
        if (E.mode === 'road' && !E.panRoad) { var t = E.screenToTile(p[0], p[1]); E.roadDrag.b = t; E.roadPrev = E.roadCells(); return; }
        if (drag.moved) { E.cam.x = drag.cx - dx / E.cam.z; E.cam.y = drag.cy - dy / E.cam.z; E.clampCam(); E.anim = null; }
      } else if (e.pointerType === 'mouse') { E.hover = E.screenToTile(p[0], p[1]); if (E.mode === 'place' && E.ghost) { var it = C.BY[E.ghost.k]; E.setGhost(E.hover[0] - (it.w >> 1), E.hover[1] - (it.h >> 1)); } }
    });
    var up = function (e) {
      var p = pos(e); delete ptrs[e.pointerId]; if (pinch) { if (Object.keys(ptrs).length < 2) pinch = null; return; }
      if (!drag || drag.pid !== e.pointerId) return; var d = drag; drag = null;
      if (d.box) { E.finishBox(); return; }
      if (d.paint) { var pc = (E.paintCells || []).filter(function (c) { return c.ok; }); E.paintCells = null; E.paintSt = null; if (E.o.onPaint) E.o.onPaint(pc); return; }
      if (E.mode === 'road') { var cells = E.roadCells(); E.roadDrag = null; E.roadPrev = null; if (E.o.onRoad) E.o.onRoad(cells, !d.moved); return; }
      if (!d.moved) { var now = performance.now(), dbl = now - lastTap < 320 && lastTapPos && Math.hypot(p[0] - lastTapPos[0], p[1] - lastTapPos[1]) < 24; lastTap = now; lastTapPos = p; E.tap(p[0], p[1], dbl); }
    };
    cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', function (e) { delete ptrs[e.pointerId]; drag = null; pinch = null; E.roadDrag = null; E.roadPrev = null; E.mrect = null; E.paintCells = null; });
    cv.addEventListener('wheel', function (e) { e.preventDefault(); E.poke(); var p = pos(e); E.zoomAt(Math.exp(-e.deltaY * .0016), p[0], p[1]); E.clampCam(); }, { passive: false });
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
    if (E.mode === 'multi') { var mbd = E.pickBuilding(px, py); if (mbd) { if (E.msel[mbd.i]) delete E.msel[mbd.i]; else E.msel[mbd.i] = 1; if (E.o.onMulti) E.o.onMulti(); } return; }
    if (E.mode === 'place' && E.ghost) { var it = C.BY[E.ghost.k], g = E.ghost, inside = t[0] >= g.x && t[0] < g.x + it.w && t[1] >= g.y && t[1] < g.y + it.h; if (inside) { if (E.o.onPlace) E.o.onPlace(g); } else E.setGhost(t[0] - (it.w >> 1), t[1] - (it.h >> 1)); return; }
    // bóng bay thu thuế
    var bub = E.pickBubble(px, py); if (bub) { if (E.o.onBubble) E.o.onBubble(bub); return; }
    var b = E.pickBuilding(px, py);
    if (b) { E.sel = b.i; if (E.o.onSelect) E.o.onSelect(b); return; }
    // công trình cố định / quận khoá
    if (C.inW(t[0], t[1])) { var i = t[1] * W + t[0], f = C.FOCC[i]; if (f >= 0) { if (E.o.onFixed) E.o.onFixed(C.FIXED[f]); return; } var d = C.DIST[i]; if (d !== 255 && !E.open[d]) { if (E.o.onLocked) E.o.onLocked(d); return; } if (C.ROAD[i] === 0 && E.roadsX[i]) { if (E.o.onRoadTap) E.o.onRoadTap(i); return; } }
    E.sel = -1; if (E.o.onSelect) E.o.onSelect(null);
  };
  /* ───── chọn nhiều / vẽ nhiều ô ───── */
  P.mselIds = function () { return Object.keys(this.msel).map(Number); };
  P.mselSet = function (ids, add) { var E = this; if (!add) E.msel = {}; ids.forEach(function (i) { E.msel[i] = 1; }); if (E.o.onMulti) E.o.onMulti(); };
  P.finishBox = function () {
    var E = this, r = E.mrect; E.mrect = null; if (!r) return; var x0 = Math.min(r.x0, r.x1), x1 = Math.max(r.x0, r.x1), y0 = Math.min(r.y0, r.y1), y1 = Math.max(r.y0, r.y1), ids = [];
    if (x1 - x0 < 6 && y1 - y0 < 6) return;
    E.bs.forEach(function (b) { var it = C.BY[b.k], s2 = E.worldToScreen(b.x + it.w / 2, b.y + it.h / 2, 0); if (s2[0] >= x0 && s2[0] <= x1 && s2[1] >= y0 && s2[1] <= y1) ids.push(b.i); });
    E.mselSet(ids, true);
  };
  P.paintAdd = function (p) {
    var E = this, t = E.screenToTile(p[0], p[1]), g = E.ghost, cells = E.paintCells; if (!cells || !g || !C.inW(t[0], t[1])) return;
    var i; for (i = 0; i < cells.length; i++) if (cells[i].x === t[0] && cells[i].y === t[1]) return; if (cells.length >= 150) return;
    var r = C.canPlace(E.paintSt || E.stateObj(), C.BY[g.k], t[0], t[1], E.occ); cells.push({ x: t[0], y: t[1], ok: r.ok });
  };
  P.drawPaint = function (ctx) {
    var E = this, cells = E.paintCells; if (!cells || !cells.length) return; var i, okp = new Path2D(), badp = new Path2D();
    for (i = 0; i < cells.length; i++) quadW(cells[i].ok ? okp : badp, E.rot, [[cells[i].x, cells[i].y], [cells[i].x + 1, cells[i].y], [cells[i].x + 1, cells[i].y + 1], [cells[i].x, cells[i].y + 1]]);
    ctx.fillStyle = 'rgba(70,220,120,.6)'; ctx.fill(okp); ctx.fillStyle = 'rgba(255,70,70,.5)'; ctx.fill(badp);
  };
  P.drawBox = function (ctx) { var r = this.mrect; if (!r) return; ctx.save(); ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0); ctx.fillStyle = 'rgba(60,200,130,.18)'; ctx.strokeStyle = 'rgba(30,170,100,.95)'; ctx.lineWidth = 2; ctx.setLineDash([7, 5]); ctx.fillRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); ctx.strokeRect(r.x0, r.y0, r.x1 - r.x0, r.y1 - r.y0); ctx.restore(); };
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

  /* ───── hướng mặt trước: f (0 +y, 1 +x, 2 −y, 3 −x) cố định theo thế giới; chưa đặt (null) = luôn quay về mặt trái màn hình như trước ───── */
  var DIRS = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  P.faceOf = function (f, x, y, w, h) {
    if (f == null) return 0;
    var cx = x + w / 2, cy = y + h / 2, d = DIRS[f & 3], a = scr(this.rot, cx, cy), b = scr(this.rot, cx + d[0], cy + d[1]), vx = b[0] - a[0], vy = b[1] - a[1];
    return vy > 0 ? (vx < 0 ? 0 : 1) : (vx < 0 ? 2 : 3);
  };
  /* ───── danh sách công trình đã sắp theo chiều sâu ───── */
  P.sortedBuildings = function () {
    var E = this, key = E.version + ':' + E.rot + ':' + Math.floor(E.nowMs() / 1000 / 5); if (E.sbKey === key) return E.sb; var out = [], i, b, it, r, sp, now = E.nowMs(), t0 = performance.now(), late = false;
    for (i = 0; i < E.bs.length; i++) {
      b = E.bs[i]; it = C.BY[b.k]; r = rotRect(E.rot, b.x, b.y, it.w, it.h); var rw = Math.round(r.rw), rh = Math.round(r.rh);
      var lvShow = b.lv; if (b.tg > b.lv && b.t1 <= now) lvShow = b.tg;
      var kind = lvShow === 0 ? 's' : 'b', kk = lvShow === 0 ? 'scaf' : b.k, ll = lvShow === 0 ? 1 : lvShow;
      // dựng sprite dần dần (tối đa ~12 ms mỗi khung hình) để lần mở đầu không bị khựng
      var fc = lvShow === 0 ? 0 : E.faceOf(b.f, b.x, b.y, it.w, it.h), pc = lvShow === 0 ? '' : (b.c || '');
      if (!A.has(kind, kk, ll, rw, rh, pc, fc) && performance.now() - t0 > (E.mobile ? 6 : 12)) { late = true; sp = A.placeholder(); } else sp = A.getSprite(kind, kk, ll, rw, rh, pc, fc);
      out.push({ b: b, it: it, sp: sp, rw: rw, rh: rh, sx: (r.rx - r.ry) * HW, sy: (r.rx + r.ry) * HH, d: (r.rx + r.rw) + (r.ry + r.rh), site: lvShow === 0 });
    }
    E.sb = out.sort(function (a, b) { return a.d - b.d; }); E.sbKey = late ? null : key; return E.sb;
  };

  /* ───── VẼ ───── */
  P.frame = function (ts) {
    var E = this; if (document.hidden) return;
    // máy cảm ứng khi không chạm quá 2,5 giây (hoặc chất lượng thấp nhất) → 30 khung/giây cho mát máy, đỡ giật
    var gap = (E.mobile && ts - E.inputT > 2500) || E.quality === 0 ? 31 : 0; if (gap && ts - E.lastDraw < gap) return; E.lastDraw = ts;
    var dt = Math.min(.08, (ts - E.last) / 1000); E.last = ts; E.t = (ts - E.t0) / 1000; E.nf = (E.nf | 0) + 1;
    if (!gap) { E.frameMs = E.frameMs * .94 + dt * 1000 * .06; if (E.nf > 200 && E.frameMs > 26) { if (++E.slow > 90) { E.slow = 0; if (E.dpr > 1.05) { E.dpr = Math.max(1, E.dpr * .8); E.resize(); } else if (E.quality > 0) { E.quality--; E.applyQuality(); } } } else E.slow = Math.max(0, E.slow - 1); }
    else E.frameMs = Math.min(E.frameMs, 24);
    if (E.anim) { var a = E.anim; a.t += dt; var k = clamp(a.t / a.d, 0, 1), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; E.cam.x = a.x0 + (a.x1 - a.x0) * e; E.cam.y = a.y0 + (a.y1 - a.y0) * e; E.cam.z = a.z0 + (a.z1 - a.z0) * e; if (k >= 1) E.anim = null; }
    E.update(dt); E.draw(); if (E.mini && (ts - (E.miniT || 0) > (E.mobile ? 600 : 250))) { E.miniT = ts; E.drawMini(); }
  };
  P.poke = function () { this.inputT = performance.now(); };
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
    var chs = E.visChunks(); E.drawSeaWaves(ctx);
    // đất liền, cát, núi, rừng, đường băng
    ctx.fillStyle = '#92D56A'; chs.forEach(function (c) { ctx.fill(c.land); });
    if (z >= .5) { ctx.fillStyle = 'rgba(70,140,50,.12)'; chs.forEach(function (c) { ctx.fill(c.check); }); }
    ctx.fillStyle = '#6FBF5A'; chs.forEach(function (c) { ctx.fill(c.forest); });
    ctx.fillStyle = '#8F98A6'; chs.forEach(function (c) { ctx.fill(c.rock); });
    ctx.fillStyle = '#F2F6FC'; chs.forEach(function (c) { ctx.fill(c.snow); });
    ctx.fillStyle = '#F3E0AE'; chs.forEach(function (c) { ctx.fill(c.sand); });
    ctx.fillStyle = '#6B7280'; chs.forEach(function (c) { ctx.fill(c.tarmac); });
    if (E.fx.shimmer || true) E.drawWaterFx(ctx, chs);
    // khu quy hoạch khi đang xây
    if (E.mode === 'place' && E.ghost) { var al = E.allowedPath(); ctx.fillStyle = 'rgba(80,220,120,.34)'; ctx.fill(al.ok); ctx.fillStyle = 'rgba(255,200,60,.2)'; ctx.fill(al.near); }
    if (E.showZones) { Object.keys(C.ZONE_COLOR).forEach(function (zk) { ctx.fillStyle = C.ZONE_COLOR[zk] + '66'; ctx.fill(E.zonePath(zk)); }); }
    // đường
    ctx.fillStyle = '#5C6472'; chs.forEach(function (c) { ctx.fill(c.road); });
    if (z >= .4) { ctx.fillStyle = '#D8D4C6'; chs.forEach(function (c) { ctx.fill(c.walk); }); ctx.fillStyle = '#8A6A4A'; chs.forEach(function (c) { ctx.fill(c.rail); }); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 1.5; ctx.lineCap = 'round'; chs.forEach(function (c) { ctx.stroke(c.dash); }); E.drawRunway(ctx, chs); }
    // xem trước đường
    if (E.roadPrev && E.roadPrev.length) E.drawRoadPreview(ctx);
    // quận khoá
    E.drawLocked(ctx);
    // vật thể theo chiều sâu
    E.drawObjects(ctx, now, night); E.drawPaint(ctx);
    E.drawLockIcons(ctx);
    E.drawCelebrate(ctx);
    // bầu trời
    ctx.setTransform(E.dpr * z, 0, 0, E.dpr * z, E.dpr * (cw / 2 - E.cam.x * z), E.dpr * (ch / 2 - E.cam.y * z)); E.drawSky(ctx, night);
    // ban đêm + thời tiết
    ctx.setTransform(E.dpr, 0, 0, E.dpr, 0, 0); E.drawAtmosphere(ctx, night); E.drawBox(ctx);
  };
  // vạch kẻ đường băng
  P.drawRunway = function (ctx) {
    var E = this, a = scr(E.rot, 100, 99.5), b = scr(E.rot, 144, 99.5); ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,.9)'; ctx.lineWidth = 1.6; ctx.setLineDash([10, 9]); ctx.beginPath(); ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,.85)'; [100.6, 143.4].forEach(function (x) { var k; for (k = 0; k < 3; k++) { var p = scr(E.rot, x, 98.5 + k * 1), q = scr(E.rot, x + (x < 120 ? 1.6 : -1.6), 98.5 + k * 1); ctx.beginPath(); ctx.moveTo(p[0], p[1]); ctx.lineTo(q[0], q[1]); ctx.strokeStyle = 'rgba(255,255,255,.8)'; ctx.lineWidth = 1.2; ctx.stroke(); } }); ctx.restore();
  };
  P.drawSeaWaves = function (ctx) {
    var t = this.t, i; ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.4; ctx.beginPath(); var cx = scr(this.rot, W / 2, H / 2);
    for (i = 0; i < 90; i++) { var a = i * 2.399, rr = 1500 + (i % 9) * 420, x = cx[0] + Math.cos(a) * rr * 1.3, y = cx[1] + Math.sin(a) * rr * .72, w = 26 + (i % 5) * 8, o = Math.sin(t * .8 + i) * 6; ctx.moveTo(x - w + o, y); ctx.quadraticCurveTo(x + o, y - 4, x + w + o, y); }
    ctx.stroke();
  };
  P.drawWaterFx = function (ctx, chs) {
    var t = this.t, i, w, vis = this.visBox(), z = this.cam.z, step = z < .35 ? 4 : z < .6 ? 2 : 1; ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 1.2; ctx.beginPath();
    chs.forEach(function (c) { var n = c.wavesT.length; for (i = 0; i < n; i += step) { w = c.wavesT[i]; var s = scr(this.rot, w[0] + .5, w[1] + .5); if (s[0] < vis[0] || s[0] > vis[2] || s[1] < vis[1] || s[1] > vis[3]) continue; var o = Math.sin(t * 1.6 + i) * 5; ctx.moveTo(s[0] - 9 + o, s[1]); ctx.quadraticCurveTo(s[0] + o, s[1] - 3, s[0] + 9 + o, s[1]); } }, this);
    ctx.stroke();
    if (z >= .5) { ctx.fillStyle = 'rgba(255,230,160,.5)'; chs.forEach(function (c) { var n = c.sandDots.length; for (i = 0; i < n; i += 2) { var d = c.sandDots[i], s2 = scr(this.rot, d[0] + .5, d[1] + .5); if (s2[0] < vis[0] || s2[0] > vis[2] || s2[1] < vis[1] || s2[1] > vis[3]) continue; ctx.fillRect(s2[0] - 5, s2[1], 2, 1.5); ctx.fillRect(s2[0] + 4, s2[1] + 3, 1.6, 1.4); } }, this); }
  };
  P.visBox = function () { var E = this, a = E.toBase(-60, -120), b = E.toBase(E.cw + 60, E.ch + 120); return [a[0], a[1], b[0], b[1]]; };
  P.drawRoadPreview = function (ctx) {
    var E = this, cells = E.roadPrev, st = E.stateObj(), n = 0, any = false; cells.forEach(function (c) { var ok = C.canRoad(st, c[0], c[1], E.occ); var p = new Path2D(); dia(p, E.rot, c[0], c[1]); if (ok.ok) n++; ctx.fillStyle = ok.ok ? 'rgba(80,220,120,.65)' : (E.isRoad(c[0], c[1]) ? 'rgba(120,160,255,.35)' : 'rgba(255,80,80,.55)'); ctx.fill(p); });
    E.roadInfo = { n: n, cells: cells.length };
  };
  // trọng tâm hiển thị của một quận (tâm hình chữ nhật lớn nhất)
  function distAnchor(dd) { var best = dd.rects[0]; dd.rects.forEach(function (r) { if (r[2] * r[3] > best[2] * best[3]) best = r; }); return [best[0] + best[2] / 2, best[1] + best[3] / 2, best]; }
  P.drawLocked = function (ctx) {
    var E = this; C.DISTRICTS.forEach(function (dd) {
      if (E.open[dd.id]) return; var p = new Path2D(); dd.rects.forEach(function (r) { quadW(p, E.rot, [[r[0], r[1]], [r[0] + r[2], r[1]], [r[0] + r[2], r[1] + r[3]], [r[0], r[1] + r[3]]]); }); ctx.fillStyle = 'rgba(38,52,86,.52)'; ctx.fill(p);
      ctx.strokeStyle = 'rgba(255,255,255,.35)'; ctx.lineWidth = 2 / Math.max(.3, E.cam.z); ctx.setLineDash([10, 8]); ctx.stroke(p); ctx.setLineDash([]);
    });
  };
  // ổ khoá + tên quận (vẽ đè lên, giữ kích thước dễ nhìn khi phóng to/thu nhỏ)
  P.drawLockIcons = function (ctx) {
    var E = this, z = E.cam.z, k = clamp(1 / z, .9, 5), vis = E.visBox(), t = E.t;
    C.DISTRICTS.forEach(function (dd) {
      if (E.open[dd.id]) return; var an = distAnchor(dd), s = scr(E.rot, an[0], an[1]); if (s[0] < vis[0] - 120 || s[0] > vis[2] + 120 || s[1] < vis[1] - 160 || s[1] > vis[3] + 120) return;
      var bob = Math.sin(t * 2 + dd.id) * 2 * k, x = s[0], y = s[1] - 40 * k + bob, u = k * 1;
      ctx.save(); ctx.translate(x, y); ctx.scale(u, u);
      ctx.fillStyle = 'rgba(20,30,60,.75)'; ctx.beginPath(); ctx.ellipse(0, 36, 34, 9, 0, 0, TAU); ctx.fill();
      ctx.lineWidth = 6; ctx.strokeStyle = '#CFD6E4'; ctx.beginPath(); ctx.arc(0, -4, 11, Math.PI, 0); ctx.lineTo(11, 6); ctx.moveTo(-11, 6); ctx.lineTo(-11, -4); ctx.stroke();
      var gr = ctx.createLinearGradient(0, 4, 0, 30); gr.addColorStop(0, '#FFD76B'); gr.addColorStop(1, '#E0A21A'); ctx.fillStyle = gr; ctx.strokeStyle = '#8A5A00'; ctx.lineWidth = 1.5;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(-17, 4, 34, 26, 6); else ctx.rect(-17, 4, 34, 26); ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#7A4B00'; ctx.beginPath(); ctx.arc(0, 15, 3.6, 0, TAU); ctx.fill(); ctx.fillRect(-1.6, 15, 3.2, 8);
      ctx.font = '800 15px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.lineJoin = 'round'; ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(10,20,50,.85)'; ctx.fillStyle = '#fff'; var nm = dd.icon + ' ' + dd.vi; ctx.strokeText(nm, 0, 54); ctx.fillText(nm, 0, 54);
      ctx.font = '700 12px system-ui,sans-serif'; ctx.fillStyle = '#FFE08A'; var sub = 'Cấp ' + dd.lvl + (dd.cost ? ' · ' + (dd.cost >= 1000 ? (dd.cost / 1000) + 'k' : dd.cost) + ' xu' : '') + ' · tự mở ở cấp ' + dd.auto; ctx.strokeText(sub, 0, 70); ctx.fillText(sub, 0, 70);
      ctx.restore();
    });
  };
  // hiệu ứng tung hoa khi mở khoá quận
  P.celebrate = function (d) {
    var E = this, dd = C.DISTRICTS[d]; if (!dd) return; var an = distAnchor(dd), n = 140, i; E.focusDistrict(d); E.petals = E.petals || [];
    for (i = 0; i < n; i++) E.petals.push({ wx: an[0] + (Math.random() - .5) * Math.min(an[2][2], 40), wy: an[1] + (Math.random() - .5) * Math.min(an[2][3], 30), h: 40 + Math.random() * 160, vh: 60 + Math.random() * 120, vx: (Math.random() - .5) * 26, vy: (Math.random() - .5) * 14, c: ['#FF7AA8', '#FFD84A', '#FFFFFF', '#FF9A4F', '#B48CFF', '#7CDFD0'][i % 6], r: 2 + Math.random() * 3, rot: Math.random() * 6, life: 3.4 + Math.random() * 2.2, age: -Math.random() * .6, sw: Math.random() * 6 });
  };
  P.drawCelebrate = function (ctx) {
    var E = this, list = E.petals; if (!list || !list.length) return; var dt = Math.min(.05, E.frameMs / 1000 || .016), i;
    for (i = list.length - 1; i >= 0; i--) {
      var p = list[i]; p.age += dt; if (p.age < 0) continue; if (p.age > p.life) { list.splice(i, 1); continue; }
      p.h += (p.vh - p.age * 70) * dt; p.wx += p.vx * dt * .04; p.wy += p.vy * dt * .04; var s = scr(E.rot, p.wx + Math.sin(E.t * 2 + p.sw) * .6, p.wy), fade = 1 - Math.max(0, (p.age - p.life * .7) / (p.life * .3));
      ctx.save(); ctx.globalAlpha = Math.max(0, fade); ctx.translate(s[0], s[1] - Math.max(0, p.h)); ctx.rotate(p.rot + E.t * 3 + p.sw); ctx.fillStyle = p.c; ctx.beginPath(); ctx.ellipse(0, 0, p.r * 1.6, p.r * .9, 0, 0, TAU); ctx.ellipse(0, 0, p.r * .9, p.r * 1.6, 0, 0, TAU); ctx.fill(); ctx.restore();
    }
  };
  // vẽ công trình + thực thể
  // tập vật thể TĨNH (nhà, công trình cố định, cảnh quan) đã xếp sẵn theo chiều sâu — chỉ dựng lại khi dữ liệu / góc xoay đổi, không xếp lại mỗi khung hình
  P.staticItems = function (list, F, sc) {
    var E = this, c = E.stCache; if (c && c.a === list && c.b === F && c.c === sc) return c.items;
    var items = [], i; for (i = 0; i < list.length; i++) items.push({ d: list[i].d, k: 0, e: list[i] }); for (i = 0; i < F.length; i++) items.push({ d: F[i].d, k: 2, e: F[i] }); for (i = 0; i < sc.length; i++) items.push({ d: sc[i].d, k: 3, e: sc[i] });
    items.sort(function (a, b) { return a.d - b.d; }); E.stCache = { a: list, b: F, c: sc, items: items }; return items;
  };
  // cảnh quan nhỏ bị bỏ khi thu nhỏ bản đồ (không nhìn thấy gì mà vẫn tốn công vẽ)
  var TINY = { lamp: 1, buoy: 1, umbrella: 1, lounger: 1, rock: 1 };
  P.drawObjects = function (ctx, now, night) {
    var E = this, list = E.sortedBuildings(), vis = E.visBox(), items = [], i, e, en = E.entities, t = E.t, z = E.cam.z, st = E.staticItems(list, E.fixedList(), E.sceneryList()), dyn = [];
    var skipTiny = z < .38, onlyBig = z < .2;
    for (i = 0; i < st.length; i++) {
      var o0 = st[i]; e = o0.e;
      if (o0.k === 3) { if (onlyBig ? e.t !== 'peak' : (skipTiny && TINY[e.t])) continue; if (e.sx + 100 < vis[0] || e.sx - 100 > vis[2] || e.sy - 40 > vis[3] || e.sy + 130 < vis[1]) continue; }
      else if (e.sx + 200 < vis[0] || e.sx - 300 > vis[2] || e.sy - e.sp.oy - 300 > vis[3] || e.sy + 200 < vis[1]) continue;
      items.push(o0);
    }
    if (E.fx.cars !== false && z >= .16) for (i = 0; i < en.cars.length; i++) { var c = en.cars[i]; dyn.push({ d: E.depthOf(c.x, c.y), k: 1, e: c, car: true }); }
    if (z >= .3) for (i = 0; i < en.people.length; i++) { var pp = en.people[i]; dyn.push({ d: E.depthOf(pp.x, pp.y), k: 1, e: pp, car: false }); }
    if (E.fx.boats !== false) E.boats().forEach(function (b) { dyn.push({ d: E.depthOf(b.x, b.y), k: 4, e: b }); });
    if (E.mode === 'place' && E.ghost) { var it = C.BY[E.ghost.k], r = rotRect(E.rot, E.ghost.x, E.ghost.y, it.w, it.h); dyn.push({ d: (r.rx + r.rw) + (r.ry + r.rh) + .001, k: 5, e: { g: E.ghost, it: it, r: r } }); }
    if (dyn.length) {   // trộn hai danh sách đã xếp theo chiều sâu
      dyn.sort(function (a, b) { return a.d - b.d; }); var m = [], a = 0, b2 = 0; while (a < items.length || b2 < dyn.length) m.push(b2 >= dyn.length || (a < items.length && items[a].d <= dyn[b2].d) ? items[a++] : dyn[b2++]); items = m;
    }
    var gl = []; E.glowList = gl;
    for (i = 0; i < items.length; i++) {
      var o = items[i];
      if (o.k === 0 || o.k === 2 || o.k === 3) E.drawSprite(ctx, o.e, now, t, o.k === 0, gl);
      else if (o.k === 1) E.drawWalker(ctx, o.e, o.car, night);
      else if (o.k === 4) E.drawBoat(ctx, o.e);
      else E.drawGhost(ctx, o.e);
    }
    // các công trình đang được chọn nhiều
    if (E.mode === 'multi') { var ms = E.msel; for (i = 0; i < list.length; i++) { var mb = list[i].b; if (!ms[mb.i]) continue; var mp = new Path2D(); quadW(mp, E.rot, [[mb.x, mb.y], [mb.x + list[i].it.w, mb.y], [mb.x + list[i].it.w, mb.y + list[i].it.h], [mb.x, mb.y + list[i].it.h]]); ctx.strokeStyle = 'rgba(40,190,110,.98)'; ctx.lineWidth = 3 / E.cam.z; ctx.stroke(mp); ctx.fillStyle = 'rgba(60,220,130,.3)'; ctx.fill(mp); } }
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
    var E = this, ok = Object.keys(E.open).sort().join(','), key = 's' + E.rot + ':' + ok; if (E.scCache && E.scCache.key === key) return E.scCache.l; var l = [];
    C.PROPS.forEach(function (p) { var s = scr(E.rot, p.x + .5, p.y + .5); l.push({ t: p.t, sx: s[0], sy: s[1], d: E.depthOf(p.x + .5, p.y + .5), s: p.s || 1, c: p.c || 0, k: p.x * 7 + p.y * 3 }); });
    C.LAMPS.forEach(function (q) { if (!E.open[C.DIST[q[1] * W + q[0]]]) return; var s = scr(E.rot, q[0] + .85, q[1] + .85); l.push({ t: 'lamp', sx: s[0], sy: s[1], d: E.depthOf(q[0] + .85, q[1] + .85), k: q[0] * 5 + q[1] }); });
    E.scCache = { key: key, l: l }; return l;
  };
  // vẽ cảnh quan: đèn đường, cây, núi, đá, cọ, dù, phao…
  P.drawProp = function (ctx, e, t, gl) {
    var x = e.sx, y = e.sy, s = e.s || 1, k;
    switch (e.t) {
      case 'lamp': ctx.strokeStyle = '#4B4F5A'; ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y - 17); ctx.stroke(); ctx.fillStyle = '#FFE9A0'; ctx.beginPath(); ctx.arc(x, y - 18, 2.8, 0, TAU); ctx.fill(); gl.push([x, y - 18, 9]); break;
      case 'palm': ctx.strokeStyle = '#8A5A33'; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x, y); ctx.quadraticCurveTo(x + 3, y - 12, x + 1 + Math.sin(t + x) * 1.2, y - 24); ctx.stroke(); ctx.fillStyle = '#3FA55B'; var tx = x + 1, ty = y - 24; for (k = 0; k < 5; k++) { var a = k * 1.26 + Math.sin(t * 1.4 + k) * .12; ctx.beginPath(); ctx.ellipse(tx + Math.cos(a) * 6, ty + Math.sin(a) * 3 - 1, 7, 2.2, a, 0, TAU); ctx.fill(); } break;
      case 'pine': ctx.fillStyle = 'rgba(20,50,30,.2)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 9 * s, 3.4 * s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#6B4A2E'; ctx.fillRect(x - 1.4 * s, y - 6 * s, 2.8 * s, 7 * s);
        for (k = 0; k < 3; k++) { var yy = y - (4 + k * 8) * s, ww = (11 - k * 2.6) * s; ctx.fillStyle = k % 2 ? '#2F7D4A' : '#3A9158'; ctx.beginPath(); ctx.moveTo(x - ww, yy); ctx.lineTo(x, yy - 14 * s); ctx.lineTo(x + ww, yy); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.55)'; if (e.sy < 0 || (e.k % 4 === 0)) { ctx.beginPath(); ctx.moveTo(x - ww * .45, yy - 6 * s); ctx.lineTo(x, yy - 14 * s); ctx.lineTo(x + ww * .45, yy - 6 * s); ctx.closePath(); ctx.fill(); } } break;
      case 'tree': ctx.fillStyle = 'rgba(20,50,30,.2)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 10 * s, 3.8 * s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#7A4B2A'; ctx.fillRect(x - 1.6 * s, y - 9 * s, 3.2 * s, 10 * s); ctx.fillStyle = e.k % 3 === 0 ? '#E58A3C' : '#3FA55B'; ctx.beginPath(); ctx.ellipse(x - 4 * s, y - 13 * s, 7 * s, 6 * s, 0, 0, TAU); ctx.ellipse(x + 4 * s, y - 14 * s, 7 * s, 6 * s, 0, 0, TAU); ctx.ellipse(x, y - 19 * s, 8 * s, 7 * s, 0, 0, TAU); ctx.fill(); break;
      case 'rock': ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 11 * s, 4 * s, 0, 0, TAU); ctx.fill(); ctx.fillStyle = e.sea ? '#7C8590' : '#9AA3AE'; ctx.beginPath(); ctx.moveTo(x - 10 * s, y + 1); ctx.lineTo(x - 6 * s, y - 9 * s); ctx.lineTo(x + 1 * s, y - 12 * s); ctx.lineTo(x + 8 * s, y - 6 * s); ctx.lineTo(x + 11 * s, y + 1); ctx.closePath(); ctx.fill(); ctx.fillStyle = 'rgba(255,255,255,.28)'; ctx.beginPath(); ctx.moveTo(x - 6 * s, y - 9 * s); ctx.lineTo(x + 1 * s, y - 12 * s); ctx.lineTo(x + 2 * s, y - 4 * s); ctx.closePath(); ctx.fill(); if (e.sea) { ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.ellipse(x, y + 2, 13 * s + Math.sin(t * 2 + x) * 1.5, 4.6 * s, 0, 0, TAU); ctx.stroke(); } break;
      case 'peak': var hh = 78 * s, ww2 = 46 * s; ctx.fillStyle = 'rgba(30,40,60,.22)'; ctx.beginPath(); ctx.ellipse(x + 10 * s, y + 2, ww2 * 1.1, 11 * s, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = '#6E7A8C'; ctx.beginPath(); ctx.moveTo(x - ww2, y + 3); ctx.lineTo(x - 4 * s, y - hh); ctx.lineTo(x + 4 * s, y + 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#8D98AA'; ctx.beginPath(); ctx.moveTo(x - 4 * s, y - hh); ctx.lineTo(x + ww2, y + 3); ctx.lineTo(x + 4 * s, y + 3); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#F5F9FF'; ctx.beginPath(); ctx.moveTo(x - 4 * s, y - hh); ctx.lineTo(x - 15 * s, y - hh * .62); ctx.lineTo(x - 6 * s, y - hh * .68); ctx.lineTo(x + 2 * s, y - hh * .58); ctx.lineTo(x + 9 * s, y - hh * .66); ctx.lineTo(x + 15 * s, y - hh * .62); ctx.closePath(); ctx.fill();
        ctx.fillStyle = 'rgba(70,90,120,.25)'; ctx.beginPath(); ctx.moveTo(x - 4 * s, y - hh); ctx.lineTo(x + 15 * s, y - hh * .62); ctx.lineTo(x + 9 * s, y - hh * .66); ctx.closePath(); ctx.fill(); break;
      case 'umbrella': var uc = ['#E9573F', '#F2C21B', '#4F80BA', '#2E9E7F', '#FF7AA8'][e.c % 5]; ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 9, 3, 0, 0, TAU); ctx.fill(); ctx.strokeStyle = '#E8E4D8'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(x, y + 1); ctx.lineTo(x, y - 17); ctx.stroke(); ctx.fillStyle = uc; ctx.beginPath(); ctx.moveTo(x - 11, y - 14); ctx.quadraticCurveTo(x, y - 27, x + 11, y - 14); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.moveTo(x - 3, y - 14); ctx.quadraticCurveTo(x, y - 24, x + 3, y - 14); ctx.closePath(); ctx.fill(); break;
      case 'lounger': ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.beginPath(); ctx.ellipse(x, y + 2, 9, 3, 0, 0, TAU); ctx.fill(); ctx.fillStyle = ['#fff', '#FFE08A', '#9FD8F5'][e.c % 3]; ctx.strokeStyle = 'rgba(40,40,60,.5)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(x - 8, y - 1); ctx.lineTo(x + 3, y - 3); ctx.lineTo(x + 8, y - 8); ctx.lineTo(x + 8, y - 5); ctx.lineTo(x + 4, y + 1); ctx.lineTo(x - 8, y + 2); ctx.closePath(); ctx.fill(); ctx.stroke(); break;
      case 'buoy': var bb = Math.sin(t * 1.8 + e.k) * 1.6; ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(x, y + 3, 8, 3, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#E9573F'; ctx.beginPath(); ctx.ellipse(x, y - 3 + bb, 4.6, 6, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(x - 4.6, y - 5 + bb, 9.2, 2.4); ctx.fillStyle = '#FFD84A'; ctx.beginPath(); ctx.arc(x, y - 10 + bb, 1.6, 0, TAU); ctx.fill(); break;
    }
  };
  // ảnh thu nhỏ sẵn (mipmap) cho công trình khi bản đồ thu nhỏ: ít điểm ảnh phải đọc hơn → nhẹ GPU điện thoại
  P.lodImg = function (sp) {
    if (sp.ph || !sp.c || !sp.c.width) return sp.c;
    var need = (A.SS || 2) / (this.cam.z * this.dpr);   // số điểm ảnh gốc trên mỗi điểm ảnh màn hình
    if (need < 1.9) return sp.c;
    var lvl = need >= 3.8 ? 2 : 1, key = lvl === 2 ? 'c4' : 'c2';
    if (!sp[key]) { var f = lvl === 2 ? .25 : .5, cv = document.createElement('canvas'); cv.width = Math.max(1, Math.round(sp.c.width * f)); cv.height = Math.max(1, Math.round(sp.c.height * f)); var cx = cv.getContext('2d'); cx.imageSmoothingQuality = 'high'; cx.drawImage(lvl === 2 && sp.c2 ? sp.c2 : sp.c, 0, 0, cv.width, cv.height); sp[key] = cv; }
    return sp[key];
  };
  P.drawSprite = function (ctx, e, now, t, isB, gl) {
    var E = this, sp = e.sp, x, y;
    if (e.t) { E.drawProp(ctx, e, t, gl); return; }
    x = e.sx - sp.ox; y = e.sy - sp.oy;
    ctx.drawImage(E.lodImg(sp), x, y, sp.w, sp.h);
    var b = isB ? e.b : null, m = sp.meta;
    if (isB && e.site) { E.drawSiteExtras(ctx, e, sp, now); }
    else if (E.cam.z >= .3) {   // khói, cờ, vòi nước, vòng quay… chỉ vẽ khi đủ gần
      var k;
      if (m.smoke) for (k = 0; k < m.smoke.length; k++) { var s = m.smoke[k], ph; for (ph = 0; ph < 3; ph++) { var u = (t * .42 + ph / 3 + s[0] * .01) % 1; ctx.fillStyle = 'rgba(235,235,240,' + (.55 * (1 - u)) + ')'; ctx.beginPath(); ctx.arc(x + s[0] + u * 6, y + s[1] - u * 20, 2 + u * 4.2, 0, TAU); ctx.fill(); } }
      if (m.flags) m.flags.forEach(function (f) { ctx.fillStyle = f[2]; ctx.beginPath(); var fx = x + f[0], fy = y + f[1]; ctx.moveTo(fx, fy); var j; for (j = 0; j <= 6; j++) ctx.lineTo(fx + j * 2.2, fy + Math.sin(t * 5 + j * .8) * 1.4 + j * .1); for (j = 6; j >= 0; j--) ctx.lineTo(fx + j * 2.2, fy + 6 + Math.sin(t * 5 + j * .8) * 1.4 + j * .1); ctx.closePath(); ctx.fill(); });
      if (m.water) m.water.forEach(function (w) { var j; ctx.strokeStyle = 'rgba(210,240,255,.9)'; ctx.lineWidth = 1.4; for (j = 0; j < 4; j++) { var u = (t * .9 + j * .25) % 1, ang = -1.2 + j * .8; ctx.beginPath(); ctx.moveTo(x + w[0], y + w[1]); ctx.quadraticCurveTo(x + w[0] + Math.cos(ang) * 8 * u, y + w[1] - 14 * Math.sin(u * 3.14), x + w[0] + Math.cos(ang) * 14 * u, y + w[1] + 2 * u); ctx.stroke(); } });
      if (m.duck) m.duck.forEach(function (d, j) { var ox = Math.sin(t * .8 + j * 2) * 5, oy = Math.cos(t * .8 + j * 2) * 2.4; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(x + d[0] + ox, y + d[1] + oy, 3.4, 2.1, 0, 0, TAU); ctx.fill(); ctx.fillStyle = '#F29A2E'; ctx.fillRect(x + d[0] + ox + 3, y + d[1] + oy - 1, 2, 1.2); });
      if (m.swing) m.swing.forEach(function (s) { var a = Math.sin(t * 2.2) * .5; ctx.strokeStyle = '#7A4B2A'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x + s[0], y + s[1]); ctx.lineTo(x + s[0] + Math.sin(a) * 14, y + s[1] + Math.cos(a) * 14); ctx.stroke(); ctx.fillStyle = '#E9573F'; ctx.fillRect(x + s[0] + Math.sin(a) * 14 - 3, y + s[1] + Math.cos(a) * 14, 6, 2); });
      if (m.beacon) { var on = Math.sin(t * 6) > 0; ctx.fillStyle = on ? '#FF4F4F' : '#5A1F1F'; ctx.beginPath(); ctx.arc(x + m.beacon[0], y + m.beacon[1], 2.6, 0, TAU); ctx.fill(); if (on) gl.push([x + m.beacon[0], y + m.beacon[1], 8]); }
      if (m.rot) m.rot.forEach(function (r) { E.drawRot(ctx, x + r[0], y + r[1], r[2], r[3], r[4], t, gl); });
      if (isB && e.b.tg > e.b.lv && e.b.lv > 0) E.drawSiteExtras(ctx, e, sp, now, true);
    }
    if (sp.glow) gl.push([x, y, sp]);
    if (isB) E.drawBar(ctx, e, sp, now, x, y);
  };
  P.drawRot = function (ctx, cx, cy, type, a, b, t, gl) {
    var k, n, an;
    if (type === 'spin') {   // ngựa xoay vòng
      var cols = ['#FF7AA8', '#7CDFD0', '#F2C21B', '#B48CFF', '#FF9A4F', '#6FD0FF'];
      var arr = []; for (k = 0; k < 6; k++) { an = t * 1.1 + k * TAU / 6; arr.push([an, k]); }
      arr.sort(function (u, v) { return Math.sin(u[0]) - Math.sin(v[0]); });
      arr.forEach(function (q) { var px = cx + Math.cos(q[0]) * a, py = cy + Math.sin(q[0]) * b, bob = Math.sin(t * 4 + q[1]) * 2.4; ctx.strokeStyle = '#E8D8A8'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(px, py - 38); ctx.lineTo(px, py - 10 + bob); ctx.stroke(); ctx.fillStyle = cols[q[1]]; ctx.strokeStyle = 'rgba(40,30,40,.7)'; ctx.beginPath(); ctx.ellipse(px, py - 8 + bob, 5, 3.4, 0, 0, TAU); ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.arc(px + 4, py - 12 + bob, 2.2, 0, TAU); ctx.fill(); ctx.stroke(); });
    } else if (type === 'swingship') {   // tàu cướp biển lắc
      an = Math.sin(t * 1.3) * .7; var bx = cx + Math.sin(an) * 40, by = cy + Math.cos(an) * 40 - 8;
      ctx.strokeStyle = '#6B7686'; ctx.lineWidth = 1.6; ctx.beginPath(); ctx.moveTo(cx - 3, cy); ctx.lineTo(bx - 14, by); ctx.moveTo(cx + 3, cy); ctx.lineTo(bx + 14, by); ctx.stroke();
      ctx.save(); ctx.translate(bx, by); ctx.rotate(-an * .9); ctx.fillStyle = '#8C4A3A'; ctx.strokeStyle = 'rgba(40,30,30,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-22, -4); ctx.lineTo(22, -4); ctx.lineTo(15, 8); ctx.lineTo(-15, 8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#F4EEDD'; ctx.beginPath(); ctx.moveTo(-1, -5); ctx.lineTo(-1, -22); ctx.lineTo(12, -8); ctx.closePath(); ctx.fill(); ctx.stroke(); ctx.restore();
    } else if (type === 'wheel') {   // vòng quay khổng lồ
      var R = a, cols2 = ['#E9573F', '#4F80BA', '#F2C21B', '#2E9E7F', '#B48CFF', '#FF7AA8', '#FF9A4F', '#6FD0FF'];
      ctx.strokeStyle = '#8A94A4'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(cx, cy, R, 0, TAU); ctx.stroke(); ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(cx, cy, R * .55, 0, TAU); ctx.stroke();
      n = 8; for (k = 0; k < n; k++) { an = t * .35 + k * TAU / n; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * R, cy + Math.sin(an) * R); ctx.stroke(); }
      for (k = 0; k < n; k++) { an = t * .35 + k * TAU / n; var gx = cx + Math.cos(an) * R, gy = cy + Math.sin(an) * R; ctx.fillStyle = cols2[k]; ctx.strokeStyle = 'rgba(40,30,40,.8)'; ctx.lineWidth = 1; ctx.beginPath(); ctx.rect(gx - 4.5, gy, 9, 8); ctx.fill(); ctx.stroke(); gl && gl.push([gx, gy + 4, 6]); }
      ctx.fillStyle = '#F2C21B'; ctx.beginPath(); ctx.arc(cx, cy, 3.4, 0, TAU); ctx.fill();
    } else if (type === 'blades') {   // cối xay gió
      ctx.strokeStyle = '#7A4B2A'; ctx.lineWidth = 2.4; for (k = 0; k < 4; k++) { an = t * .9 + k * TAU / 4; var ex = cx + Math.cos(an) * a, ey = cy + Math.sin(an) * a * .9; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke(); ctx.fillStyle = 'rgba(250,245,230,.95)'; ctx.beginPath(); ctx.moveTo(cx + Math.cos(an) * 8, cy + Math.sin(an) * 8 * .9); ctx.lineTo(ex, ey); ctx.lineTo(ex + Math.cos(an + 1.57) * 6, ey + Math.sin(an + 1.57) * 6 * .9); ctx.lineTo(cx + Math.cos(an) * 8 + Math.cos(an + 1.57) * 6, cy + Math.sin(an) * 8 * .9 + Math.sin(an + 1.57) * 5); ctx.closePath(); ctx.fill(); ctx.stroke(); }
      ctx.fillStyle = '#7A4B2A'; ctx.beginPath(); ctx.arc(cx, cy, 3, 0, TAU); ctx.fill();
    } else if (type === 'turbine') {   // tua-bin gió: 3 cánh trắng
      ctx.strokeStyle = '#F4F6FA'; ctx.lineWidth = 2.2; ctx.lineCap = 'round'; for (k = 0; k < 3; k++) { an = t * 1.3 + b * 2 + k * TAU / 3; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an) * a, cy + Math.sin(an) * a * .9); ctx.stroke(); }
      ctx.fillStyle = '#C9D1D9'; ctx.beginPath(); ctx.arc(cx, cy, 2.6, 0, TAU); ctx.fill();
    } else if (type === 'gondola') {   // cabin cáp treo chạy dọc dây
      var u = (1 + Math.sin(t * .5)) / 2, gx2 = cx - a + u * a * 2, gy2 = cy - 24 + u * 28; ctx.strokeStyle = '#3A3A3A'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(gx2, gy2); ctx.lineTo(gx2, gy2 + 4); ctx.stroke(); ctx.fillStyle = '#E9573F'; ctx.strokeStyle = 'rgba(40,28,60,.6)'; ctx.beginPath(); ctx.rect(gx2 - 4.5, gy2 + 4, 9, 7); ctx.fill(); ctx.stroke(); ctx.fillStyle = '#BFE8F8'; ctx.fillRect(gx2 - 3, gy2 + 5.5, 6, 3);
    } else if (type === 'beam') {   // chùm sáng hải đăng
      an = t * 1.4; var L = 70, w2 = .18; ctx.save(); ctx.globalAlpha = .28 + .1 * Math.sin(t * 3); ctx.fillStyle = '#FFF2A8'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx + Math.cos(an - w2) * L, cy + Math.sin(an - w2) * L * .5); ctx.lineTo(cx + Math.cos(an + w2) * L, cy + Math.sin(an + w2) * L * .5); ctx.closePath(); ctx.fill(); ctx.restore();
      var bright = Math.max(0, Math.cos(an)); ctx.fillStyle = 'rgba(255,240,150,' + (.5 + bright * .5) + ')'; ctx.beginPath(); ctx.arc(cx, cy, 3.2, 0, TAU); ctx.fill(); gl && gl.push([cx, cy, 14]);
    }
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
    var E = this, t = E.t, out = [];
    if (!E.laneLen) E.laneLen = C.LANES.map(function (l) { var tot = 0, seg = [], i; for (i = 1; i < l.p.length; i++) { var d = Math.hypot(l.p[i][0] - l.p[i - 1][0], l.p[i][1] - l.p[i - 1][1]); seg.push(d); tot += d; } return { seg: seg, tot: tot }; });
    C.LANES.forEach(function (l, li) {
      var L = E.laneLen[li], i; for (i = 0; i < l.n; i++) {
        var u = ((t * l.v / (L.tot / 60) + i / l.n) % 1), pp = u < .5 ? u * 2 : 2 - u * 2, dist = pp * L.tot, k = 0; while (k < L.seg.length - 1 && dist > L.seg[k]) { dist -= L.seg[k]; k++; }
        var a = l.p[k], b = l.p[k + 1], f = L.seg[k] ? dist / L.seg[k] : 0; out.push({ x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, dir: u < .5 ? 1 : 0, c: l.c[i % l.c.length], s: l.s });
      }
    }); return out;
  };
  P.drawBoat = function (ctx, b) {
    var E = this, s = scr(E.rot, b.x, b.y), k = b.s, bob = Math.sin(E.t * 2 + b.x) * 1.2; ctx.fillStyle = 'rgba(255,255,255,.4)'; ctx.beginPath(); ctx.ellipse(s[0], s[1] + 2, 12 * k, 4.4 * k, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = '#7A4B2A'; ctx.beginPath(); ctx.moveTo(s[0] - 9 * k, s[1] - 2 + bob); ctx.lineTo(s[0] + 9 * k, s[1] - 2 + bob); ctx.lineTo(s[0] + 6 * k, s[1] + 3 + bob); ctx.lineTo(s[0] - 6 * k, s[1] + 3 + bob); ctx.closePath(); ctx.fill(); ctx.fillStyle = b.c; ctx.fillRect(s[0] - 7 * k, s[1] - 5 + bob, 14 * k, 3.4);
    ctx.fillStyle = '#fff'; ctx.strokeStyle = 'rgba(40,28,60,.35)'; ctx.lineWidth = .8; ctx.beginPath(); ctx.moveTo(s[0], s[1] - 6 + bob); ctx.lineTo(s[0], s[1] - 20 * k + bob); ctx.lineTo(s[0] + 8 * k, s[1] - 7 + bob); ctx.closePath(); ctx.fill(); ctx.stroke();
  };
  P.drawGhost = function (ctx, o) {
    var E = this, g = o.g, it = o.it, r = o.r, rw = Math.round(r.rw), rh = Math.round(r.rh), sp = A.getSprite('b', g.k, 1, rw, rh, g.c || '', E.faceOf(g.f, g.x, g.y, it.w, it.h)), sx = (r.rx - r.ry) * HW, sy = (r.rx + r.ry) * HH, p = new Path2D(); quadW(p, E.rot, [[g.x, g.y], [g.x + it.w, g.y], [g.x + it.w, g.y + it.h], [g.x, g.y + it.h]]);
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
  /* ───── đèn laser lấp lánh trên các toà nhà cao tầng: quét khắp khu vực vào ban đêm ───── */
  var LASERC = [[125, 249, 255], [255, 92, 244], [124, 255, 138], [255, 209, 102], [150, 130, 255], [255, 120, 120]];
  P.drawLasers = function (ctx, night) {
    var E = this, list = E.sb; if (!E.fx.lasers || !list || night < .22) return;
    var maxN = E.quality >= 2 ? (E.mobile ? 8 : 18) : E.quality === 1 ? 6 : 0; if (!maxN) return;
    var z = E.cam.z, cw = E.cw, ch = E.ch, vis = E.visBox(), t = E.t, srcs = [], i, e;
    for (i = 0; i < list.length; i++) {
      e = list[i]; if (e.site || !e.sp || !e.sp.hpx || e.sp.hpx < 260) continue;
      var ax = e.sx + (e.rw - e.rh) / 2 * HW, gy = e.sy + (e.rw + e.rh) / 2 * HH; if (ax < vis[0] - 300 || ax > vis[2] + 300 || gy < vis[1] - 100 || gy - e.sp.hpx > vis[3] + 300) continue;
      srcs.push({ ax: ax, gy: gy, ty: gy - e.sp.hpx, i: e.b.i, d: Math.abs(ax - E.cam.x) + Math.abs(gy - E.cam.y) });
    }
    if (!srcs.length) return; srcs.sort(function (a, b) { return a.d - b.d; }); if (srcs.length > maxN) srcs.length = maxN;
    ctx.save(); ctx.setTransform(E.dpr * z, 0, 0, E.dpr * z, E.dpr * (cw / 2 - E.cam.x * z), E.dpr * (ch / 2 - E.cam.y * z)); ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round';
    var lw = Math.min(6, 1.5 / z), a0 = Math.min(1, night * 1.2);
    srcs.forEach(function (q) {
      var col = LASERC[q.i % LASERC.length], rgb = col[0] + ',' + col[1] + ',' + col[2], k, dir = q.i % 2 ? 1 : -1, sp = .45 + (q.i % 3) * .13, R = 150 + (q.i % 4) * 45;
      for (k = 0; k < 3; k++) {
        var ang = t * sp * dir + k * 2.094 + q.i, ex = q.ax + Math.cos(ang) * R, ey = q.gy + 4 + Math.sin(ang) * R * .5, gr = ctx.createLinearGradient(q.ax, q.ty, ex, ey);
        gr.addColorStop(0, 'rgba(' + rgb + ',' + (.9 * a0) + ')'); gr.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.strokeStyle = gr; ctx.lineWidth = lw * 3.4; ctx.globalAlpha = .22; ctx.beginPath(); ctx.moveTo(q.ax, q.ty); ctx.lineTo(ex, ey); ctx.stroke();
        ctx.lineWidth = lw; ctx.globalAlpha = .95; ctx.stroke();
        // điểm sáng lấp lánh nơi tia chạm đất
        var tw = .5 + .5 * Math.sin(t * 9 + k * 2 + q.i), sz = (3 + 4 * tw) * Math.min(2, 1 / Math.sqrt(z + .2));
        ctx.globalAlpha = (.35 + .5 * tw) * a0; ctx.strokeStyle = 'rgba(' + rgb + ',1)'; ctx.lineWidth = lw * .9; ctx.beginPath(); ctx.moveTo(ex - sz, ey); ctx.lineTo(ex + sz, ey); ctx.moveTo(ex, ey - sz * .7); ctx.lineTo(ex, ey + sz * .7); ctx.stroke();
      }
      // ngôi sao nhấp nháy trên đỉnh tháp
      var pu = .55 + .45 * Math.sin(t * 5 + q.i * 1.7), rr = (4 + 5 * pu) * Math.min(2.2, 1 / Math.sqrt(z + .2)), rg2 = ctx.createRadialGradient(q.ax, q.ty, 0, q.ax, q.ty, rr * 2.2);
      rg2.addColorStop(0, 'rgba(255,255,255,.95)'); rg2.addColorStop(.35, 'rgba(' + rgb + ',.7)'); rg2.addColorStop(1, 'rgba(' + rgb + ',0)'); ctx.globalAlpha = a0; ctx.fillStyle = rg2; ctx.beginPath(); ctx.arc(q.ax, q.ty, rr * 2.2, 0, TAU); ctx.fill();
    });
    ctx.restore();
  };
  P.drawAtmosphere = function (ctx, night) {
    var E = this, cw = E.cw, ch = E.ch, w = E.weather;
    // ánh sáng đèn ban đêm
    if (night > .02 && E.glowList) {
      var z = E.cam.z; ctx.save(); ctx.globalCompositeOperation = 'multiply'; var k = night, fr = 255 - Math.round(150 * k), fg = 255 - Math.round(125 * k), fb = 255 - Math.round(60 * k); ctx.fillStyle = 'rgb(' + fr + ',' + fg + ',' + fb + ')'; ctx.fillRect(0, 0, cw, ch); ctx.restore();
      ctx.save(); ctx.setTransform(E.dpr * z, 0, 0, E.dpr * z, E.dpr * (cw / 2 - E.cam.x * z), E.dpr * (ch / 2 - E.cam.y * z)); ctx.globalCompositeOperation = 'lighter'; ctx.globalAlpha = Math.min(.85, night * 1.1);
      var gmax = E.quality >= 2 ? 1e9 : E.quality === 1 ? 140 : 0, gcount = 0;
      if (gmax) E.glowList.forEach(function (q) { if (++gcount > gmax) return; if (q[2] && q[2].glow) ctx.drawImage(q[2].glow, q[0], q[1], q[2].w, q[2].h); else { var g = ctx.createRadialGradient(q[0], q[1], 0, q[0], q[1], q[2]); g.addColorStop(0, 'rgba(255,225,140,.9)'); g.addColorStop(1, 'rgba(255,225,140,0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(q[0], q[1], q[2], 0, TAU); ctx.fill(); } });
      ctx.restore();
      E.drawLasers(ctx, night);
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
    var key = E.roadCount + ':' + E.open_key + ':' + w; if (!E.miniBase || E.miniBase.key !== key) {
      var cv = document.createElement('canvas'); cv.width = w; cv.height = h; var b = cv.getContext('2d'); b.fillStyle = '#4AA8DD'; b.fillRect(0, 0, w, h);
      for (y = 0; y < H; y++) for (x = 0; x < W; x++) { i = y * W + x; var t = C.TERR[i], col = t === 1 ? null : t === 2 ? '#F3E0AE' : t === 3 ? '#9AA3AE' : t === 4 ? '#4E9E4E' : t === 5 ? '#6B7280' : (C.ROAD[i] || E.roadsX[i]) ? '#6A7280' : '#92D56A'; if (col) { b.fillStyle = col; b.fillRect(x * sx, y * sy, Math.ceil(sx), Math.ceil(sy)); } }
      E.miniBase = { key: key, cv: cv };
    }
    c.clearRect(0, 0, w, h); c.drawImage(E.miniBase.cv, 0, 0);
    E.bs.forEach(function (b) { var it = C.BY[b.k]; c.fillStyle = b.lv === 0 ? '#C9A872' : it.cat === 'home' ? '#E9573F' : it.cat === 'shop' ? '#4F80BA' : it.cat === 'park' || it.cat === 'deco' ? '#2E9E7F' : '#F2C21B'; c.fillRect(b.x * sx, b.y * sy, Math.max(1.6, it.w * sx), Math.max(1.6, it.h * sy)); });
    C.DISTRICTS.forEach(function (d) { d.rects.forEach(function (r) { if (!E.open[d.id]) { c.fillStyle = 'rgba(38,52,86,.58)'; c.fillRect(r[0] * sx, r[1] * sy, r[2] * sx, r[3] * sy); } c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 1; c.strokeRect(r[0] * sx, r[1] * sy, r[2] * sx, r[3] * sy); }); });
    // vùng đang xem
    var pts = [[0, 0], [E.cw, 0], [E.cw, E.ch], [0, E.ch]].map(function (p) { var b = E.toBase(p[0], p[1]), q = E.baseToWorld(b[0], b[1]); return [q[0] * sx, q[1] * sy]; });
    c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); pts.forEach(function (p, k) { k ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]); }); c.closePath(); c.stroke();
  };

  root.EWTCityEngine = Engine;
})(typeof window !== 'undefined' ? window : this);
