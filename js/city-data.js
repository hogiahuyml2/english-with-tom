/* EWT City — DỮ LIỆU DÙNG CHUNG cho máy chủ và trình duyệt: bản đồ thành phố, quận, khu quy hoạch sẵn, mạng lưới đường sẵn, danh mục công trình, luật chơi.
   Mọi phép kiểm tra (đặt công trình, xây đường, giá, thời gian…) đều dùng đúng các hàm ở đây nên hai phía luôn cho cùng kết quả. */
(function (root) {
  'use strict';
  /* ───── bản đồ 168×120 ô (gấp ~5 lần bản đồ cũ 72×48). Thành phố cũ (6 quận) được giữ NGUYÊN VẸN ở vị trí (OX,OY) để không ai mất công trình ───── */
  var W = 168, H = 120, OX = 60, OY = 36, OW = 72, OH = 48, PER = 6;

  /* ───── các quận ─────
     rects: các hình chữ nhật tạo nên quận (đa dạng diện tích) · lvl: cấp thành phố tối thiểu để MUA bằng xu · cost: giá xu · auto: đạt cấp này thì được MỞ MIỄN PHÍ
     (zones: chữ khối đất, xem ZONE_NAME) */
  var DISTRICTS = [
    { id: 0, key: 'home', en: 'Sunny Homes', vi: 'Khu dân cư Nắng Mai', icon: '🏡', free: true, lvl: 1, cost: 0, auto: 1, rects: [[60, 36, 24, 24]], blurb: 'Khu nhà ở xanh mát bên dòng sông, có công viên và trường học.' },
    { id: 1, key: 'downtown', en: 'Downtown', vi: 'Trung tâm thành phố', icon: '🏙️', lvl: 3, cost: 1500, auto: 8, rects: [[84, 36, 24, 24]], blurb: 'Cửa hàng, văn phòng và các toà nhà cao tầng sầm uất.' },
    { id: 2, key: 'harbor', en: 'Harbor & Industry', vi: 'Cảng & Công nghiệp', icon: '⚓', lvl: 6, cost: 4000, auto: 14, rects: [[108, 36, 24, 24]], blurb: 'Cảng biển, cần cẩu, nhà máy và kho hàng bên bờ biển.' },
    { id: 3, key: 'fun', en: 'Fun Bay', vi: 'Du lịch & Giải trí', icon: '🎡', lvl: 8, cost: 6000, auto: 17, rects: [[60, 60, 24, 24]], blurb: 'Vòng quay khổng lồ, công viên nước, rạp xiếc bên vịnh.' },
    { id: 4, key: 'campus', en: 'Campus', vi: 'Học đường & Thư viện', icon: '🎓', lvl: 10, cost: 8000, auto: 19, rects: [[84, 60, 24, 24]], blurb: 'Trường học, đại học, bảo tàng, đài thiên văn và phòng tranh.' },
    { id: 5, key: 'world', en: 'World Street', vi: 'Phố quốc tế & Di sản', icon: '🌍', lvl: 12, cost: 10000, auto: 22, rects: [[108, 60, 24, 24]], blurb: 'Phố cổ và các công trình nổi tiếng từ khắp nơi trên thế giới.' },
    { id: 6, key: 'beach', en: 'Golden Beach', vi: 'Bãi biển Nắng Vàng', icon: '🏖️', lvl: 8, cost: 9000, auto: 18, rects: [[0, 80, 60, 32]], blurb: 'Bán đảo ven vịnh với bãi cát dài, khách sạn nghỉ dưỡng, cầu tàu và làng chài.' },
    { id: 7, key: 'mountain', en: 'Cloudy Mountain', vi: 'Núi Mây Xanh', icon: '⛰️', lvl: 9, cost: 12000, auto: 20, rects: [[0, 0, 72, 36]], blurb: 'Dãy núi tuyết, rừng thông, hồ trên núi — nơi nghỉ dưỡng, trượt tuyết và cáp treo.' },
    { id: 8, key: 'farm', en: 'Green Fields', vi: 'Nông trại Đồng Xanh', icon: '🌾', lvl: 5, cost: 3000, auto: 11, rects: [[0, 36, 60, 44]], blurb: 'Cánh đồng rộng, ao cá, vườn cây ăn trái và trang trại chăn nuôi.' },
    { id: 9, key: 'transport', en: 'Airport Island', vi: 'Đảo Giao thông & Sân bay', icon: '✈️', lvl: 11, cost: 15000, auto: 24, rects: [[94, 92, 56, 24], [96, 79, 1, 13]], blurb: 'Đảo nối với đất liền bằng cầu dài: sân bay, ga tàu, bến xe và kho vận.' },
    { id: 10, key: 'park', en: 'Grand Park', vi: 'Công viên Hồ Lớn', icon: '🌳', lvl: 4, cost: 2500, auto: 10, rects: [[72, 0, 60, 36]], blurb: 'Hồ nước rộng, đồng cỏ, vườn thú và khu dã ngoại giữa thành phố.' },
    { id: 11, key: 'sports', en: 'Sports & Expo', vi: 'Thể thao & Triển lãm', icon: '🏟️', lvl: 13, cost: 18000, auto: 26, rects: [[132, 0, 28, 36]], blurb: 'Sân vận động, nhà thi đấu, hồ bơi và trung tâm triển lãm lớn.' }
  ];
  var ZONE_NAME = { r: 'Nhà ở', c: 'Thương mại', s: 'Dịch vụ công', p: 'Công viên', f: 'Vui chơi', e: 'Học đường', i: 'Công nghiệp', h: 'Cảng', w: 'Phố quốc tế', b: 'Du lịch biển', m: 'Du lịch núi', a: 'Nông trại', t: 'Giao thông', g: 'Thể thao & Triển lãm' };
  var ZONE_COLOR = { r: '#9BD36B', c: '#8CC8E8', s: '#F2C86B', p: '#6FC98B', f: '#F29BC0', e: '#B7A0E8', i: '#B8B2A6', h: '#7FB4C9', w: '#F0A56B', b: '#FFD36B', m: '#9DB8E8', a: '#C9D96B', t: '#A8B0BC', g: '#FF9A7A' };

  /* ───── địa hình ─────  0 đất · 1 nước · 2 cát (bờ) · 3 núi đá · 4 rừng · 5 đường băng / sân bãi */
  var TERR = new Uint8Array(W * H), ROAD = new Uint8Array(W * H), DIST = new Uint8Array(W * H).fill(255), ZONE = new Uint8Array(W * H);   // ROAD: 0 không · 1 đường · 2 cầu
  var idx = function (x, y) { return y * W + x; }, inW = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H; };
  var hash = function (x, y, s) { var h = (Math.imul(x + 1, 73856093) ^ Math.imul(y + 1, 19349663) ^ Math.imul((s || 0) + 1, 83492791)) >>> 0; h = Math.imul(h ^ (h >>> 13), 0x5bd1e995) >>> 0; return ((h ^ (h >>> 15)) >>> 0) % 10000 / 10000; };
  function fillRect(x0, y0, x1, y1, v) { var x, y; for (y = Math.max(0, y0); y <= Math.min(H - 1, y1); y++) for (x = Math.max(0, x0); x <= Math.min(W - 1, x1); x++) TERR[idx(x, y)] = v; }
  function fillEll(cx, cy, rx, ry, v, only) { var x, y; for (y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++) for (x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) { if (!inW(x, y)) continue; var dx = (x + .5 - cx) / rx, dy = (y + .5 - cy) / ry; if (dx * dx + dy * dy <= 1 && (only == null || TERR[idx(x, y)] === only)) TERR[idx(x, y)] = v; } }
  // thành phố cũ — công thức nguyên bản (toạ độ cục bộ 0..71 × 0..47)
  function oldTerr(x, y) { if (x >= 68 || y >= 45) return 1; if (x === 67 || (y >= 43 && y <= 44)) return 2; if (x === 11 || x === 12) return 1; return 0; }
  function oldRoadLine(x, y) { return x <= 66 && y <= 42 && ((x % PER === 0 && x !== 12) || y % PER === 0); }
  var OLD_ZONES = [['rprr', 'rrcs', 'prrr', 'rscr'], ['cccp', 'cccc', 'pccc', 'cscc'], ['iihx', 'iihx', 'ishx', 'ihhx'], ['ffpf', 'fffp', 'pffs', 'ffff'], ['eepe', 'eees', 'peee', 'eeee'], ['wwpx', 'wwwx', 'pwsx', 'wwwx']];

  (function buildTerrain() {
    var x, y, i;
    TERR.fill(1);
    // đất liền: dải phía Bắc (núi – công viên – thể thao), dải phía Tây (nông trại – bãi biển), đảo sân bay
    fillRect(0, 0, 159, 35, 0); fillRect(0, 36, 59, 111, 0); fillRect(94, 92, 149, 115, 0);
    // bờ cát
    fillRect(157, 0, 159, 35, 2); fillRect(0, 109, 59, 111, 2); fillRect(56, 84, 59, 111, 2);
    fillRect(94, 92, 149, 93, 2); fillRect(94, 114, 149, 115, 2); fillRect(94, 92, 95, 115, 2); fillRect(148, 92, 149, 115, 2);
    // bo tròn góc đảo
    [[94, 92], [149, 92], [94, 115], [149, 115]].forEach(function (c) { TERR[idx(c[0], c[1])] = 1; });
    // sông & hồ
    fillRect(71, 12, 72, 35, 1);                                 // sông chính, nối hồ Núi với dòng sông cũ (cột 71–72)
    fillEll(58, 9, 14, 6, 1);                                    // hồ trên núi
    fillRect(33, 14, 34, 111, 1);                                // sông Xanh chảy xuống vịnh phía Nam
    fillEll(20, 22, 6, 3, 1);                                    // hồ nhỏ
    fillEll(104, 16, 17, 9, 1); fillRect(73, 15, 88, 16, 1);     // hồ lớn trong công viên + kênh nối
    fillEll(104, 16, 4, 2, 2);                                   // đảo cát giữa hồ
    fillEll(12, 58, 7, 4, 1); fillEll(46, 66, 5, 3, 1);          // ao ở nông trại
    // núi đá & rừng (dải phía Bắc của quận Núi)
    for (y = 0; y <= 20; y++) for (x = 0; x <= 71; x++) {
      i = idx(x, y); if (TERR[i] !== 0) continue;
      var rl = 8.5 + 3.2 * Math.sin(x * .21) + 2.2 * Math.sin(x * .53 + 1) + (x > 40 ? -1.5 : 0), r = hash(x, y, 3);
      if (y < rl) TERR[i] = 3; else if (y < rl + 4.5 && r > .25) TERR[i] = 4; else if (y < rl + 7 && r > .78) TERR[i] = 4;
    }
    for (y = 0; y <= 35; y++) for (x = 0; x <= 5; x++) { i = idx(x, y); if (TERR[i] === 0 && hash(x, y, 4) > .3) TERR[i] = 4; }          // rừng thông bên rìa Tây
    // rừng nhỏ ở góc công viên & nông trại
    [[74, 2, 5, 3], [124, 2, 6, 4], [3, 38, 3, 6], [56, 38, 3, 5]].forEach(function (g) { var a, b; for (b = 0; b < g[3] * 2; b++) for (a = 0; a < g[2] * 2; a++) { var xx = g[0] + a, yy = g[1] + b; if (inW(xx, yy) && TERR[idx(xx, yy)] === 0 && hash(xx, yy, 5) > .35) TERR[idx(xx, yy)] = 4; } });
    // đường băng & sân bãi sân bay (đảo)
    fillRect(100, 98, 143, 100, 5);
    // thành phố cũ: nguyên bản
    for (y = 0; y < OH; y++) for (x = 0; x < OW; x++) TERR[idx(OX + x, OY + y)] = oldTerr(x, y);
    // cầu dẫn ra đảo: cát hai đầu để đường nối liền
    fillRect(96, 79, 96, 80, 2);
  })();

  /* ───── phân quận ───── */
  (function buildDist() {
    var x, y;
    DISTRICTS.forEach(function (d) { d.rects.forEach(function (r) { var xx, yy; for (yy = r[1]; yy < r[1] + r[3]; yy++) for (xx = r[0]; xx < r[0] + r[2]; xx++) if (inW(xx, yy)) DIST[idx(xx, yy)] = d.id; }); });
    for (y = 0; y < OH; y++) for (x = 0; x < OW; x++) DIST[idx(OX + x, OY + y)] = Math.floor(y / 24) * 3 + Math.floor(x / 24);
    // cầu nối ra đảo thuộc quận Giao thông
    for (y = 79; y <= 94; y++) DIST[idx(96, y)] = 9;
  })();

  /* ───── đường (có sẵn) & khối đất ───── */
  var BLOCKS = [];   // { d, x, y, w, h, z } — mỗi khối đất giữa các đường
  // vẽ một đoạn đường thẳng: bỏ qua núi/rừng; nước hẹp (≤4 ô, như sông) thì bắc cầu
  function roadSeg(x0, y0, x1, y1, force) {
    var horiz = y0 === y1, n = horiz ? Math.abs(x1 - x0) + 1 : Math.abs(y1 - y0) + 1, sx = horiz ? Math.sign(x1 - x0) || 1 : 0, sy = horiz ? 0 : Math.sign(y1 - y0) || 1, k, run = [];
    var flush = function (landAfter) { if (run.length && (run.length <= 4 || force) && landAfter) run.forEach(function (i) { ROAD[i] = 2; }); run = []; };
    var prevLand = false;
    for (k = 0; k < n; k++) {
      var x = x0 + sx * k, y = y0 + sy * k; if (!inW(x, y)) { run = []; prevLand = false; continue; } var i = idx(x, y), t = TERR[i];
      if (t === 1) { if (prevLand || run.length) run.push(i); continue; }
      if (t === 3 || t === 4 || t === 5) { run = []; prevLand = false; continue; }
      flush(prevLand); ROAD[i] = 1; prevLand = true;
    }
    run = [];
  }
  function gridRoads(xs, ys, rx0, ry0, rx1, ry1) {
    xs.forEach(function (x) { roadSeg(x, ry0, x, ry1); }); ys.forEach(function (y) { roadSeg(rx0, y, rx1, y); });
  }
  function gridZones(d, xs, ys, pat) {
    var i, j, x, y;
    for (j = 0; j < ys.length - 1; j++) for (i = 0; i < xs.length - 1; i++) {
      var x0 = xs[i] + 1, x1 = xs[i + 1] - 1, y0 = ys[j] + 1, y1 = ys[j + 1] - 1, row = pat[Math.min(j, pat.length - 1)], z = row.charAt(i % row.length);
      if (x1 < x0 || y1 < y0 || z === '.') continue;
      BLOCKS.push({ d: d, x: x0, y: y0, w: x1 - x0 + 1, h: y1 - y0 + 1, z: z });
      for (y = y0; y <= y1; y++) for (x = x0; x <= x1; x++) { var q = idx(x, y); if (inW(x, y) && TERR[q] === 0 && !ROAD[q] && DIST[q] === d) ZONE[q] = z.charCodeAt(0); }
    }
  }
  (function buildRoads() {
    var x, y, i;
    // thành phố cũ
    for (y = 0; y < OH; y++) for (x = 0; x < OW; x++) { i = idx(OX + x, OY + y); if (oldRoadLine(x, y)) ROAD[i] = TERR[i] === 1 ? 2 : 1; }
    for (y = 0; y < OH; y++) for (x = 0; x < OW; x++) {
      i = idx(OX + x, OY + y);
      if (!ROAD[i] && TERR[i] === 0 && x % PER !== 0 && y % PER !== 0) {
        var gbx = Math.floor(x / PER), gby = Math.floor(y / PER), d = Math.floor(gby / 4) * 3 + Math.floor(gbx / 4), bx = gbx % 4, by = gby % 4;
        ZONE[i] = OLD_ZONES[d][by].charCodeAt(bx);
      }
    }
    for (y = 0; y < 8; y++) for (x = 0; x < 12; x++) { var d2 = Math.floor(y / 4) * 3 + Math.floor(x / 4); if (OLD_ZONES[d2][y % 4].charAt(x % 4) !== 'x') BLOCKS.push({ d: d2, x: OX + x * PER + 1, y: OY + y * PER + 1, w: 5, h: 5, z: OLD_ZONES[d2][y % 4].charAt(x % 4) }); }
    // trục đường lớn: nối thành phố cũ sang phía Tây & Bắc
    roadSeg(0, 36, 59, 36);
    // Núi Mây Xanh: các lô lớn nhỏ khác nhau
    var mx = [6, 14, 24, 36, 48, 60, 66], my = [17, 26, 36];
    gridRoads(mx, [17, 26], 6, 17, 66, 36); mx.forEach(function (xx) { roadSeg(xx, 17, xx, 36); }); roadSeg(6, 17, 66, 17); roadSeg(6, 26, 66, 26);
    gridZones(7, mx, my, ['mmpmmm', 'mmmmpm']);
    // Công viên Hồ Lớn: lô rất lớn bao quanh hồ
    var px = [78, 84, 126], py = [3, 30, 36];
    px.forEach(function (xx) { roadSeg(xx, 3, xx, 36); }); roadSeg(78, 3, 158, 3); roadSeg(78, 30, 126, 30);
    gridZones(10, px, py, ['pp', 'pp']);
    // Thể thao & Triển lãm
    var sx = [132, 146, 158], sy = [3, 15, 28];
    sx.forEach(function (xx) { roadSeg(xx, 3, xx, 35); }); sy.forEach(function (yy) { roadSeg(132, yy, 158, yy); });
    gridZones(11, sx, [3, 15, 28, 35], ['gg', 'gg', 'pg']);
    // Nông trại: lô to, có đường nhỏ
    var fx = [2, 14, 26, 40, 54], fy = [36, 48, 60, 72, 80];
    fx.forEach(function (xx) { roadSeg(xx, 36, xx, 106); }); fy.forEach(function (yy) { roadSeg(2, yy, 54, yy); });
    gridZones(8, fx, fy, ['aara', 'aaaa', 'araa', 'aaap']);
    // Bãi biển: dọc bờ
    var by2 = [80, 92, 106];
    by2.forEach(function (yy) { roadSeg(2, yy, 54, yy); });
    gridZones(6, fx, by2, ['rrbb', 'rbbb']);
    // Đảo giao thông + cầu dài
    roadSeg(96, 79, 96, 112, true); var tx = [96, 112, 128, 146], ty = [95, 103, 112];
    tx.forEach(function (xx) { roadSeg(xx, 95, xx, 112); }); ty.forEach(function (yy) { roadSeg(96, yy, 146, yy); });
    gridZones(9, tx, ty, ['ttt', 'tgt']);
    // đường nối công viên – thành phố cũ: cột x=60 .. 66 đã có; nối Núi với trục
    roadSeg(60, 36, 126, 36);
    // cầu dựng sẵn trên đất trống: chỉ phủ lên mặt NƯỚC (và cát bờ), không đụng ô đất xây được → không ảnh hưởng thành phố đã có
    function bridgeLine(x0, y0, x1, y1) {
      var horiz = y0 === y1, n = horiz ? x1 - x0 + 1 : y1 - y0 + 1, k, cells = [];
      for (k = 0; k < n; k++) { var x = horiz ? x0 + k : x0, y = horiz ? y0 : y0 + k; cells.push(inW(x, y) ? idx(x, y) : -1); }
      var run = [], prevLand = false;
      var flush = function (landNext) { if (run.length && run.length <= 40 && prevLand && landNext) run.forEach(function (q) { ROAD[q] = 2; }); run = []; };
      cells.forEach(function (q) {
        if (q < 0) { run = []; prevLand = false; return; }
        if (TERR[q] === 1) { if (ROAD[q] === 0 && (prevLand || run.length)) run.push(q); else if (ROAD[q] === 2) { run = []; prevLand = true; } return; }
        flush(true); prevLand = true;
        if (TERR[q] === 2 && !ROAD[q] && ZONE[q] === 0) ROAD[q] = 1;   // cát bờ thành lối đi nối vào cầu
      });
      run = [];
    }
    // sông Xanh (cột 33–34) và dòng sông cũ (cột 71–72): thêm cầu giữa các cầu có sẵn
    [20, 31, 43, 54, 66, 86, 98].forEach(function (yy) { bridgeLine(30, yy, 37, yy); });
    [20, 30, 39, 57, 75].forEach(function (yy) { bridgeLine(68, yy, 75, yy); });
    // kênh nối hồ công viên, hồ lớn có đảo cát (hai cầu cắt nhau ở đảo), hồ nhỏ và ao nông trại
    bridgeLine(77, 12, 77, 20); bridgeLine(83, 12, 83, 20);
    bridgeLine(104, 4, 104, 28); bridgeLine(84, 17, 126, 17);
    bridgeLine(19, 16, 19, 28); bridgeLine(2, 58, 22, 58); bridgeLine(38, 66, 54, 66);
    bridgeLine(36, 10, 76, 10);                                  // cầu gỗ ngang hồ trên núi
    // cầu vịnh dài nối bãi biển với đảo sân bay
    bridgeLine(54, 106, 96, 106);
  })();

  /* ───── công trình cố định của thành phố (ai cũng có, không dỡ được) ───── */
  var FIXED = [];
  (function () {
    var q;
    // quảng trường ở các khối công viên của thành phố cũ & quận mới
    BLOCKS.forEach(function (b) {
      if (b.z !== 'p') return;
      var cx = b.x + Math.floor(b.w / 2), cy = b.y + Math.floor(b.h / 2); if (b.w < 5 || b.h < 5) return; q = idx(cx, cy); if (TERR[q] !== 0 || ROAD[q]) return;
      if (b.d === 10 || b.d === 7 || b.d === 8) { cx = b.x + 2; cy = b.y + 2; q = idx(cx, cy); if (TERR[q] !== 0) return; }
      FIXED.push({ k: 'plaza', x: cx, y: cy, w: 1, h: 1 });
    });
    FIXED.push({ k: 'townhall', x: OX + 20, y: OY + 8, w: 3, h: 3 });
    FIXED.push({ k: 'clocktower', x: OX + 33, y: OY + 21, w: 1, h: 1 });
    FIXED.push({ k: 'bigplaza', x: OX + 63, y: OY + 21, w: 1, h: 1 });
    FIXED.push({ k: 'pier', x: 60, y: 95, w: 7, h: 2 });                  // cầu tàu của bãi biển
    FIXED.push({ k: 'airport', x: 100, y: 96, w: 4, h: 2 });              // nhà ga sân bay (trang trí)
  })();
  var FOCC = new Int16Array(W * H).fill(-1); FIXED.forEach(function (f, n) { var a, b; for (b = 0; b < f.h; b++) for (a = 0; a < f.w; a++) if (inW(f.x + a, f.y + b)) FOCC[idx(f.x + a, f.y + b)] = n; });

  /* ───── cảnh quan có sẵn: núi, rừng, cọ biển, dù bãi biển, đá, phao, đèn đường… ───── */
  var PROPS = [], LAMPS = [];
  (function () {
    var x, y, i, t;
    var near = function (x, y, v, r) { var a, b; for (b = -r; b <= r; b++) for (a = -r; a <= r; a++) if (inW(x + a, y + b) && TERR[idx(x + a, y + b)] === v) return true; return false; };
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      i = idx(x, y); t = TERR[i]; var r = hash(x, y, 9);
      if (t === 3) { if (r > .93) PROPS.push({ t: 'peak', x: x, y: y, s: .8 + hash(x, y, 2) * .9 }); else if (r > .75) PROPS.push({ t: 'rock', x: x, y: y, s: .7 + hash(x, y, 6) * .5 }); }
      else if (t === 4) { if (r > .2) PROPS.push({ t: hash(x, y, 7) > .25 ? 'pine' : 'tree', x: x, y: y, s: .8 + hash(x, y, 8) * .5 }); }
      else if (t === 2 && DIST[i] !== 255 && DIST[i] !== 7) {
        if (r > .84 && (DIST[i] === 6 || DIST[i] === 9 || DIST[i] === 3 || DIST[i] === 5 || DIST[i] === 2 || DIST[i] === 11)) PROPS.push({ t: 'palm', x: x, y: y });
        else if (r > .66 && DIST[i] === 6 && ((x + y) % 3 === 0)) PROPS.push({ t: r > .78 ? 'lounger' : 'umbrella', x: x, y: y, c: Math.floor(hash(x, y, 1) * 5) });
      } else if (t === 1) {
        if (r > .985 && near(x, y, 2, 5)) PROPS.push({ t: 'rock', x: x, y: y, s: 1, sea: 1 });
        else if (r > .975 && (DIST[i] === 255) && near(x, y, 2, 4) && x > 56 && y > 82) PROPS.push({ t: 'buoy', x: x, y: y });
      }
    }
    // đèn đường ở các ngã tư
    for (y = 1; y < H - 1; y++) for (x = 1; x < W - 1; x++) {
      i = idx(x, y); if (ROAD[i] !== 1) continue; var n4 = (ROAD[i - 1] > 0 ? 1 : 0) + (ROAD[i + 1] > 0 ? 1 : 0) + (ROAD[i - W] > 0 ? 1 : 0) + (ROAD[i + W] > 0 ? 1 : 0);
      if (n4 >= 3) LAMPS.push([x, y]); else if (n4 === 2 && ((x * 7 + y * 13) % 11 === 0) && DIST[i] !== 255) LAMPS.push([x, y]);
    }
  })();

  /* ───── luồng thuyền (thuyền chạy theo các tuyến đường nước) ───── */
  var LANES = [
    { p: [[71.6, 14], [71.6, 82]], n: 3, v: .03, s: .9, c: ['#fff', '#F2C21B', '#E9573F'] },
    { p: [[33.6, 20], [33.6, 112]], n: 2, v: .03, s: .9, c: ['#fff', '#4F80BA'] },
    { p: [[132, 38], [140, 60], [138, 118]], n: 3, v: .03, s: 1.2, c: ['#fff', '#4F80BA', '#F2C21B'] },
    { p: [[62, 86], [92, 96], [92, 118], [64, 117]], n: 3, v: .026, s: 1.2, c: ['#fff', '#E9573F', '#F2C21B'] },
    { p: [[150, 90], [150, 118], [166, 110], [166, 50]], n: 2, v: .026, s: 1.4, c: ['#fff', '#2E9E7F'] },
    { p: [[90, 12], [104, 24], [118, 14], [104, 8], [90, 12]], n: 3, v: .02, s: .8, c: ['#F2C21B', '#E9573F', '#fff'] },
    { p: [[48, 6], [62, 12], [66, 8], [52, 5]], n: 2, v: .02, s: .8, c: ['#fff', '#4F80BA'] }
  ];

  /* ───── chuyển dữ liệu từ bản đồ cũ (72×48) sang bản đồ mới: toàn bộ công trình & đường tự xây được DỊCH nguyên vẹn ───── */
  function migrateState(st) {
    if (!st || (st.v | 0) >= 2) return st;
    (st.bs || []).forEach(function (b) { b.x += OX; b.y += OY; });
    var nr = {}; Object.keys(st.roads || {}).forEach(function (k) { var i = Number(k), x = i % OW, y = Math.floor(i / OW); nr[idx(x + OX, y + OY)] = 1; });
    st.roads = nr; st.v = 2; return st;
  }

  /* ───── danh mục công trình ─────
     k mã · en/vi tên · cat loại cửa hàng · w×h ô · z chữ khối đất được phép ('*' = mọi khối) · lvl cấp thành phố cần · cost xu · secs giây xây cấp 1 · inc xu/giờ cấp 1 · pop dân cấp 1 · hp điểm hạnh phúc · ds quận bán */
  var CATS = [['home', '🏠 Nhà ở'], ['shop', '🛍️ Thương mại'], ['civic', '🏥 Dịch vụ'], ['park', '🎠 Công viên'], ['tree', '🌳 Cây cối'], ['flower', '🌸 Hoa & cây cảnh'], ['bench', '🪑 Ghế & tiện ích phố'], ['lamp', '💡 Đèn'], ['orna', '🗿 Trang trí'], ['port', '⚓ Cảng & CN'], ['fun', '🎡 Vui chơi'], ['edu', '🎓 Học đường'], ['world', '🌍 Quốc tế'], ['beach', '🏖️ Biển'], ['mount', '⛰️ Núi'], ['farm', '🌾 Nông trại'], ['trans', '✈️ Giao thông'], ['sport', '🏟️ Thể thao'], ['event', '🎉 Sự kiện']];
  function B(k, en, vi, cat, w, h, z, lvl, cost, secs, inc, pop, hp, ds, desc, ex) { var o = { k: k, en: en, vi: vi, cat: cat, w: w, h: h, z: z, lvl: lvl, cost: cost, secs: secs, inc: inc, pop: pop, hp: hp, ds: ds, desc: desc || '' }; if (ex) Object.keys(ex).forEach(function (q) { o[q] = ex[q]; }); return o; }
  var ITEMS = [
    B('cottage', 'Small House', 'Nhà nhỏ', 'home', 1, 1, 'r', 1, 150, 10, 10, 4, 0, [0, 1], 'A small house for a family.'),
    B('townhouse', 'Townhouse', 'Nhà phố', 'home', 1, 1, 'r', 2, 400, 30, 24, 8, 0, [0, 1], 'A tall, narrow house in a row.'),
    B('duplex', 'Twin Houses', 'Nhà song lập', 'home', 2, 1, 'r', 3, 900, 60, 52, 14, 0, [0, 1], 'Two houses that share a wall.'),
    B('villa', 'Villa', 'Biệt thự', 'home', 2, 2, 'r', 5, 2600, 180, 125, 24, 1, [0], 'A big house with a garden.', { ch: 'home1' }),
    B('apartment', 'Apartment Block', 'Chung cư', 'home', 2, 2, 'rc', 7, 5200, 360, 250, 60, 0, [0, 1], 'Many families live in one building.', { ch: 'home1' }),
    B('condo', 'Condo Tower', 'Cao ốc căn hộ', 'home', 3, 3, 'rc', 10, 12000, 720, 540, 140, 0, [1], 'A tall tower with many flats.', { ch: 'home2' }),
    B('kiosk', 'Kiosk', 'Quầy bán báo', 'shop', 1, 1, 'rc', 1, 120, 10, 12, 0, 0, [0, 1], 'A tiny stand that sells newspapers.'),
    B('bakery', 'Bakery', 'Tiệm bánh', 'shop', 1, 1, 'rc', 2, 350, 30, 30, 0, 0, [0, 1], 'Fresh bread every morning.'),
    B('cafe', 'Coffee Shop', 'Quán cà phê', 'shop', 1, 1, 'rc', 3, 600, 45, 50, 0, 1, [0, 1], 'People drink coffee and talk here.'),
    B('shop', 'Clothes Shop', 'Cửa hàng quần áo', 'shop', 2, 1, 'c', 4, 1400, 90, 105, 0, 0, [0, 1], 'You can buy shirts and shoes.'),
    B('market', 'Supermarket', 'Siêu thị', 'shop', 2, 2, 'c', 6, 3600, 240, 240, 0, 0, [0, 1], 'A big shop with food and drinks.'),
    B('bank', 'Bank', 'Ngân hàng', 'shop', 2, 2, 'c', 8, 6200, 420, 410, 0, 0, [1], 'People keep their money here.', { ch: 'town1' }),
    B('office', 'Office Building', 'Toà văn phòng', 'shop', 2, 2, 'c', 9, 8000, 540, 540, 0, 0, [1], 'People work at desks in this building.', { ch: 'town2' }),
    B('hotel', 'Hotel', 'Khách sạn', 'shop', 2, 2, 'c', 10, 11000, 720, 820, 0, 2, [1], 'Visitors sleep here.', { ch: 'town1' }),
    B('mall', 'Shopping Mall', 'Trung tâm mua sắm', 'shop', 3, 3, 'c', 11, 18000, 900, 1120, 0, 2, [1], 'Many shops under one roof.', { ch: 'town2' }),
    B('skyscraper', 'Skyscraper', 'Nhà chọc trời', 'shop', 3, 3, 'c', 13, 30000, 1500, 1900, 0, 0, [1], 'A very tall building in the city centre.', { ch: 'town2' }),
    B('tree', 'Garden Tree', 'Cây xanh', 'tree', 1, 1, '*', 1, 60, 5, 0, 0, 1, [0, 1], 'A green tree gives shade.'),
    B('flowerbed', 'Flower Bed', 'Bồn hoa', 'flower', 1, 1, '*', 1, 90, 5, 0, 0, 2, [0, 1], 'Colourful flowers make people smile.'),
    B('fountain', 'Fountain', 'Đài phun nước', 'orna', 1, 1, '*', 3, 500, 20, 0, 0, 6, [0, 1], 'Water jumps up and falls down.'),
    B('playground', 'Playground', 'Sân chơi', 'park', 2, 2, '*', 4, 1200, 60, 0, 0, 14, [0, 1], 'Children play on the slide and swing.'),
    B('court', 'Basketball Court', 'Sân bóng rổ', 'park', 2, 2, '*', 6, 2000, 120, 0, 0, 20, [0, 1], 'Friends play basketball here.'),
    B('pondpark', 'Pond Park', 'Công viên hồ', 'park', 2, 2, '*', 6, 2400, 120, 0, 0, 24, [0, 1], 'Ducks swim in the pond.'),
    B('statue', 'Statue Plaza', 'Quảng trường tượng đài', 'park', 2, 2, '*', 8, 4200, 240, 0, 0, 34, [0, 1], 'A famous statue stands in the middle.'),
    B('busstop', 'Bus Stop', 'Trạm xe buýt', 'bench', 1, 1, '*', 2, 300, 15, 0, 0, 3, [0, 1], 'You wait here for the bus.'),
    B('clinic', 'Clinic', 'Phòng khám', 'civic', 2, 2, 's', 5, 3000, 150, 0, 0, 20, [0, 1], 'A doctor helps sick people here.'),
    B('firestation', 'Fire Station', 'Trạm cứu hoả', 'civic', 2, 2, 's', 7, 5000, 300, 0, 0, 25, [0, 1], 'Firefighters wait here for a call.', { ch: 'civic1' }),
    B('police', 'Police Station', 'Đồn cảnh sát', 'civic', 2, 2, 's', 7, 5000, 300, 0, 0, 25, [0, 1], 'Police officers keep the city safe.', { ch: 'civic1' }),
    B('school', 'School', 'Trường học', 'civic', 3, 2, 's', 8, 8000, 480, 0, 0, 40, [0, 1], 'Students learn English and maths here.', { ch: 'civic1' }),
    B('library', 'Library', 'Thư viện', 'civic', 2, 2, 's', 9, 7000, 420, 0, 0, 30, [0, 1], 'You can read many books here.', { ch: 'civic1' }),
    // ── Quận Cảng & Công nghiệp ──
    B('workshop', 'Workshop', 'Xưởng cơ khí', 'port', 2, 1, 'i', 6, 2200, 150, 200, 0, 0, [2], 'People fix machines in a workshop.'),
    B('watertower', 'Water Tower', 'Tháp nước', 'port', 1, 1, 'is', 7, 1800, 120, 120, 0, 3, [2], 'A tall tank keeps water for the city.'),
    B('warehouse', 'Warehouse', 'Nhà kho', 'port', 2, 2, 'ih', 7, 3800, 240, 320, 0, 0, [2], 'Boxes and goods wait here.'),
    B('fishmarket', 'Fish Market', 'Chợ cá', 'port', 2, 1, 'h', 7, 2600, 180, 260, 0, 2, [2], 'Fishermen sell fresh fish here.'),
    B('crane', 'Port Crane', 'Cần cẩu cảng', 'port', 2, 2, 'h', 8, 6800, 420, 650, 0, 0, [2], 'A big crane lifts containers from ships.', { ch: 'port1' }),
    B('lighthouse', 'Lighthouse', 'Hải đăng', 'port', 1, 1, 'h', 8, 3000, 180, 0, 0, 10, [2], 'Its light helps ships find the way at night.'),
    B('factory', 'Factory', 'Nhà máy', 'port', 3, 2, 'i', 8, 7500, 420, 700, 0, 0, [2], 'Machines and workers make things here.', { ch: 'port2' }),
    B('containers', 'Container Yard', 'Bãi container', 'port', 2, 2, 'h', 9, 5200, 300, 480, 0, 0, [2], 'Colourful boxes are stored here.', { ch: 'port1' }),
    B('recycling', 'Recycling Plant', 'Nhà máy tái chế', 'port', 2, 2, 'i', 9, 6000, 360, 420, 0, 8, [2], 'Old paper and plastic become new things.', { ch: 'port2' }),
    B('coastguard', 'Coast Guard', 'Cảnh sát biển', 'port', 2, 2, 's', 9, 5200, 300, 0, 0, 22, [2], 'They help people at sea.'),
    B('shipyard', 'Shipyard', 'Xưởng đóng tàu', 'port', 3, 2, 'h', 10, 12000, 600, 950, 0, 0, [2], 'Workers build big ships here.', { ch: 'port1' }),
    B('powerplant', 'Power Plant', 'Nhà máy điện', 'port', 3, 3, 'i', 11, 16000, 720, 1200, 0, 0, [2], 'It makes electricity for the whole city.', { ch: 'port2' }),
    // ── Quận Du lịch & Giải trí ──
    B('beachhut', 'Beach Hut', 'Chòi bãi biển', 'fun', 1, 1, 'f', 8, 1200, 60, 120, 0, 3, [3], 'A small hut on the sand.'),
    B('icecream', 'Ice Cream Shop', 'Tiệm kem', 'fun', 1, 1, 'f', 8, 1500, 60, 160, 0, 3, [3], 'Cold and sweet — everyone loves it.'),
    B('arcade', 'Arcade', 'Khu trò chơi điện tử', 'fun', 2, 1, 'f', 8, 3200, 150, 300, 0, 4, [3], 'Children play video games here.'),
    B('cinema', 'Cinema', 'Rạp chiếu phim', 'fun', 2, 2, 'f', 9, 6500, 360, 560, 0, 6, [3], 'You watch films on a big screen.', { ch: 'fun1' }),
    B('carousel', 'Carousel', 'Vòng quay ngựa gỗ', 'fun', 2, 2, 'fp', 9, 4800, 240, 0, 0, 16, [3], 'Wooden horses go round and round.', { ch: 'fun1' }),
    B('bumpercars', 'Bumper Cars', 'Xe điện đụng', 'fun', 2, 2, 'f', 10, 5500, 300, 400, 0, 8, [3], 'Small electric cars bump into each other.', { ch: 'fun1' }),
    B('minigolf', 'Mini Golf', 'Sân golf mini', 'fun', 2, 2, 'fp', 10, 4200, 240, 0, 0, 18, [3], 'Hit the ball into the small hole.'),
    B('circus', 'Circus Tent', 'Rạp xiếc', 'fun', 2, 2, 'f', 10, 7200, 360, 620, 0, 8, [3], 'Clowns and acrobats perform here.', { ch: 'fun1' }),
    B('pirateship', 'Pirate Ship Ride', 'Tàu cướp biển', 'fun', 2, 2, 'f', 11, 8500, 420, 700, 0, 10, [3], 'A big ship swings high and low.', { ch: 'fun2' }),
    B('waterpark', 'Water Park', 'Công viên nước', 'fun', 3, 3, 'f', 12, 15000, 720, 1100, 0, 12, [3], 'Slide down into the cool water.', { ch: 'fun2' }),
    B('aquarium', 'Aquarium', 'Thuỷ cung', 'fun', 3, 2, 'f', 12, 13000, 660, 980, 0, 10, [3], 'Look at fish, sharks and turtles.', { ch: 'fun2' }),
    B('ferris', 'Ferris Wheel', 'Vòng quay khổng lồ', 'fun', 3, 3, 'f', 13, 22000, 900, 1500, 0, 15, [3], 'See the whole city from the top.', { ch: 'fun2' }),
    // ── Quận Học đường ──
    B('bookstore', 'Bookstore', 'Hiệu sách', 'edu', 1, 1, 'e', 10, 2400, 90, 220, 0, 3, [4], 'Buy storybooks and notebooks here.'),
    B('kindergarten', 'Kindergarten', 'Trường mẫu giáo', 'edu', 2, 2, 'e', 10, 5400, 300, 0, 0, 24, [4], 'Little children sing and draw here.', { ch: 'edu1' }),
    B('lab', 'Science Lab', 'Phòng thí nghiệm', 'edu', 2, 2, 'e', 11, 7200, 360, 450, 0, 6, [4], 'Scientists do experiments here.', { ch: 'edu1' }),
    B('dorm', 'Dormitory', 'Ký túc xá', 'edu', 2, 2, 'e', 11, 6800, 330, 380, 40, 0, [4], 'Students live and sleep here.', { ch: 'edu1' }),
    B('artgallery', 'Art Gallery', 'Phòng tranh', 'edu', 2, 2, 'e', 12, 8800, 420, 0, 0, 30, [4], 'You can see paintings on the walls.', { ch: 'edu1' }),
    B('observatory', 'Observatory', 'Đài thiên văn', 'edu', 2, 2, 'e', 12, 9500, 480, 0, 0, 28, [4], 'A telescope looks at the stars.', { ch: 'edu2' }),
    B('planetarium', 'Planetarium', 'Cung thiên văn', 'edu', 2, 2, 'e', 13, 11000, 540, 0, 0, 34, [4], 'A dome shows the sky inside.', { ch: 'edu2' }),
    B('sportshall', 'Sports Hall', 'Nhà thi đấu', 'edu', 3, 2, 'e', 13, 12500, 600, 0, 0, 36, [4], 'Teams play volleyball and basketball.', { ch: 'edu2' }),
    B('museum', 'Museum', 'Bảo tàng', 'edu', 3, 2, 'e', 14, 16000, 720, 600, 0, 48, [4], 'Old and special things are shown here.', { ch: 'edu2' }),
    B('university', 'University', 'Đại học', 'edu', 3, 3, 'e', 15, 26000, 1000, 1200, 0, 60, [4], 'Young adults study many subjects here.', { ch: 'edu2' }),
    // ── Phố quốc tế ──
    B('sushi', 'Sushi Bar', 'Quán sushi', 'world', 1, 1, 'w', 12, 2800, 90, 280, 0, 2, [5], 'A Japanese restaurant with fresh fish.'),
    B('pizzeria', 'Pizzeria', 'Tiệm pizza', 'world', 1, 1, 'w', 12, 2800, 90, 280, 0, 2, [5], 'An Italian restaurant with hot pizza.'),
    B('teahouse', 'Tea House', 'Trà quán', 'world', 1, 1, 'w', 12, 2600, 90, 250, 0, 4, [5], 'People drink tea in a quiet place.'),
    B('torii', 'Torii Gate', 'Cổng torii', 'world', 1, 1, 'w', 12, 2000, 90, 0, 0, 8, [5], 'A red gate in front of a Japanese temple.'),
    B('bigclock', 'Big Clock Tower', 'Tháp đồng hồ lớn', 'world', 1, 1, 'w', 13, 6000, 300, 0, 0, 22, [5], 'A famous clock tower from London.', { ch: 'world1' }),
    B('pagoda', 'Pagoda', 'Chùa tháp', 'world', 2, 2, 'w', 13, 8000, 420, 0, 0, 30, [5], 'A tall temple with many roofs.', { ch: 'world1' }),
    B('windmill', 'Windmill', 'Cối xay gió', 'world', 2, 2, 'w', 13, 7600, 400, 600, 0, 8, [5], 'A Dutch windmill turns in the wind.', { ch: 'world1' }),
    B('greektemple', 'Greek Temple', 'Đền Hy Lạp', 'world', 2, 2, 'w', 14, 9500, 480, 0, 0, 34, [5], 'White columns hold up the roof.', { ch: 'world1' }),
    B('irontower', 'Iron Tower', 'Tháp sắt', 'world', 2, 2, 'w', 14, 12000, 600, 500, 0, 40, [5], 'A famous tower in Paris.', { ch: 'world1' }),
    B('opera', 'Opera House', 'Nhà hát opera', 'world', 3, 2, 'w', 15, 16000, 720, 800, 0, 46, [5], 'Its roof looks like white sails.', { ch: 'world1' }),
    B('pyramid', 'Pyramid', 'Kim tự tháp', 'world', 3, 3, 'w', 16, 24000, 900, 1000, 0, 50, [5], 'A giant stone tomb from Egypt.', { ch: 'world1' }),
    B('liberty', 'Liberty Statue', 'Tượng nữ thần', 'world', 1, 1, 'w', 16, 14000, 600, 0, 0, 40, [5], 'A lady holds a torch high.', { ch: 'world1' }),
    B('oak', 'Oak Tree', 'Cây sồi', 'tree', 1, 1, '*', 1, 80, 5, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A strong tree with many leaves.'),
    B('pine', 'Pine Tree', 'Cây thông', 'tree', 1, 1, '*', 1, 80, 5, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A green tree that stays green all year.'),
    B('birch', 'Birch Tree', 'Cây bạch dương', 'tree', 1, 1, '*', 2, 100, 6, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A tree with white bark.'),
    B('palmtree', 'Palm Tree', 'Cây cọ', 'tree', 1, 1, '*', 2, 120, 8, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A tall tree that grows near the beach.'),
    B('fruit', 'Apple Tree', 'Cây táo', 'tree', 1, 1, '*', 2, 140, 9, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Red apples hang from its branches.'),
    B('cactus', 'Cactus', 'Xương rồng', 'tree', 1, 1, '*', 2, 90, 6, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A desert plant with sharp spines.'),
    B('cherry', 'Cherry Blossom', 'Hoa anh đào', 'tree', 1, 1, '*', 3, 260, 16, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Pink flowers cover the whole tree in spring.'),
    B('maple', 'Maple Tree', 'Cây phong', 'tree', 1, 1, '*', 3, 220, 14, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Its leaves turn red and orange in autumn.'),
    B('bamboo', 'Bamboo', 'Bụi tre', 'tree', 1, 1, '*', 3, 160, 10, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Tall green stems that grow very fast.'),
    B('willow', 'Weeping Willow', 'Cây liễu rủ', 'tree', 1, 1, '*', 4, 300, 19, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Long thin branches hang down to the ground.'),
    B('bonsai', 'Bonsai', 'Cây bonsai', 'tree', 1, 1, '*', 4, 350, 22, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A tiny tree in a small pot.'),
    B('banyan', 'Banyan Tree', 'Cây đa cổ thụ', 'tree', 2, 2, '*', 5, 560, 35, 0, 0, 4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A huge old tree with many roots.'),
    B('baobab', 'Baobab Tree', 'Cây bao báp', 'tree', 2, 2, '*', 6, 700, 44, 0, 0, 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'An African tree with a very thick trunk.'),
    B('daisy', 'Daisies', 'Hoa cúc họa mi', 'flower', 1, 1, '*', 1, 70, 5, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Small white flowers with yellow centres.'),
    B('hedge', 'Hedge', 'Hàng rào cây xanh', 'flower', 1, 1, '*', 1, 60, 5, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A green wall made of small bushes.'),
    B('flowerpot', 'Flower Pot', 'Chậu hoa', 'flower', 1, 1, '*', 1, 50, 5, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A flower in a clay pot.'),
    B('tulip', 'Tulip Bed', 'Bồn hoa tulip', 'flower', 1, 1, '*', 2, 110, 7, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Colourful tulips from the Netherlands.'),
    B('sunflower', 'Sunflowers', 'Hoa hướng dương', 'flower', 1, 1, '*', 2, 100, 6, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Tall yellow flowers that follow the sun.'),
    B('hibiscus', 'Hibiscus', 'Hoa dâm bụt', 'flower', 1, 1, '*', 2, 120, 8, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A bush with big red flowers.'),
    B('rose', 'Rose Garden', 'Vườn hoa hồng', 'flower', 1, 1, '*', 3, 180, 11, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Sweet red and pink roses.'),
    B('lavender', 'Lavender', 'Hoa oải hương', 'flower', 1, 1, '*', 3, 160, 10, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Purple flowers with a calm smell.'),
    B('hydrangea', 'Hydrangeas', 'Cẩm tú cầu', 'flower', 1, 1, '*', 3, 200, 12, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Round blue and pink flower balls.'),
    B('poppy', 'Red Poppies', 'Hoa anh túc đỏ', 'flower', 1, 1, '*', 3, 150, 9, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Bright red flowers in the grass.'),
    B('lotus', 'Lotus Pond', 'Hồ sen', 'flower', 1, 1, '*', 4, 320, 20, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Pink lotus flowers float on the water.'),
    B('orchid', 'Orchids', 'Hoa lan', 'flower', 1, 1, '*', 4, 260, 16, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Beautiful flowers with a graceful shape.'),
    B('topiary', 'Topiary', 'Cây cắt tỉa', 'flower', 1, 1, '*', 4, 350, 22, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A bush cut into the shape of balls.'),
    B('rainbowbed', 'Rainbow Flower Bed', 'Bồn hoa cầu vồng', 'flower', 1, 1, '*', 5, 400, 25, 0, 0, 4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Flowers in every colour of the rainbow.'),
    B('flowerarch', 'Flower Arch', 'Cổng hoa', 'flower', 1, 1, '*', 5, 600, 38, 0, 0, 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Walk under an arch full of flowers.'),
    B('mailbox', 'Mailbox', 'Hòm thư', 'bench', 1, 1, '*', 1, 70, 5, 0, 0, 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Drop your letters in the box.'),
    B('signpost', 'Signpost', 'Biển chỉ đường', 'bench', 1, 1, '*', 1, 60, 5, 0, 0, 0, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'It shows you which way to go.'),
    B('benchwood', 'Wooden Bench', 'Ghế gỗ', 'bench', 1, 1, '*', 1, 90, 6, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A place to sit and rest.'),
    B('bins', 'Recycling Bins', 'Thùng rác phân loại', 'bench', 1, 1, '*', 1, 80, 5, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Put paper, plastic and food in the right bin.'),
    B('benchstone', 'Stone Bench', 'Ghế đá', 'bench', 1, 1, '*', 2, 140, 9, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A strong bench made of stone.'),
    B('picnic', 'Picnic Table', 'Bàn dã ngoại', 'bench', 1, 1, '*', 2, 220, 14, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Families eat lunch outside here.'),
    B('bikerack', 'Bike Rack', 'Giá để xe đạp', 'bench', 1, 1, '*', 2, 110, 7, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Lock your bike here.'),
    B('drinkfountain', 'Drinking Fountain', 'Vòi nước uống', 'bench', 1, 1, '*', 2, 120, 8, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Cool, clean water to drink.'),
    B('infoboard', 'Info Board', 'Bảng thông tin', 'bench', 1, 1, '*', 2, 100, 6, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A map and news for visitors.'),
    B('benchmodern', 'Modern Bench', 'Ghế hiện đại', 'bench', 1, 1, '*', 3, 200, 12, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A bench with a clean modern look.'),
    B('swingbench', 'Swing Bench', 'Ghế xích đu', 'bench', 1, 1, '*', 3, 260, 16, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Sit and swing slowly.'),
    B('phonebooth', 'Phone Booth', 'Bốt điện thoại', 'bench', 1, 1, '*', 3, 200, 12, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A red box with an old phone inside.'),
    B('toilet', 'Public Restroom', 'Nhà vệ sinh công cộng', 'bench', 1, 1, '*', 3, 300, 19, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Clean toilets for park visitors.'),
    B('vending', 'Vending Machine', 'Máy bán nước', 'bench', 1, 1, '*', 3, 260, 16, 20, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Buy a cold drink for a few coins.'),
    B('gardenlamp', 'Garden Light', 'Đèn sân vườn', 'lamp', 1, 1, '*', 1, 70, 5, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A small light for the garden.'),
    B('pathlight', 'Path Light', 'Đèn lối đi', 'lamp', 1, 1, '*', 1, 60, 5, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'It lights up the path at night.'),
    B('streetlamp', 'Street Lamp', 'Đèn đường', 'lamp', 1, 1, '*', 1, 100, 6, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A tall lamp for the street.'),
    B('classiclamp', 'Classic Lamp', 'Đèn cổ điển', 'lamp', 1, 1, '*', 2, 180, 11, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'An old-style lamp like in London.'),
    B('modernlamp', 'Modern Lamp', 'Đèn hiện đại', 'lamp', 1, 1, '*', 3, 220, 14, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A bright white LED lamp.'),
    B('stonelantern', 'Stone Lantern', 'Đèn đá', 'lamp', 1, 1, '*', 3, 240, 15, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A Japanese lantern made of stone.'),
    B('torch', 'Torch', 'Đuốc', 'lamp', 1, 1, '*', 3, 160, 10, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A flame that burns at night.'),
    B('lanternstring', 'Lantern String', 'Dây đèn lồng', 'lamp', 1, 1, '*', 3, 200, 12, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Coloured lanterns hang between two poles.'),
    B('fairytree', 'Fairy-Light Tree', 'Cây đèn lấp lánh', 'lamp', 1, 1, '*', 4, 420, 26, 0, 0, 4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A tree covered with tiny sparkling lights.'),
    B('neonsign', 'Neon Sign', 'Biển đèn neon', 'lamp', 1, 1, '*', 4, 350, 22, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Bright pink and blue neon lights.'),
    B('solarlamp', 'Solar Lamp', 'Đèn năng lượng mặt trời', 'lamp', 1, 1, '*', 5, 260, 16, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'It uses the sun to make light.'),
    B('spotlight', 'Spotlight', 'Đèn pha', 'lamp', 1, 1, '*', 5, 300, 19, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A strong light for big buildings.'),
    B('gnome', 'Garden Gnome', 'Chú lùn vườn', 'orna', 1, 1, '*', 1, 90, 6, 0, 0, 1, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A funny little man with a red hat.'),
    B('flagpole', 'Flagpole', 'Cột cờ', 'orna', 1, 1, '*', 2, 150, 9, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A flag waves in the wind.'),
    B('scarecrow', 'Scarecrow', 'Bù nhìn', 'orna', 1, 1, '*', 2, 140, 9, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'It keeps birds away from the field.'),
    B('gardenstatue', 'Garden Statue', 'Tượng vườn', 'orna', 1, 1, '*', 3, 300, 19, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A white statue in the garden.'),
    B('rockgarden', 'Rock Garden', 'Vườn đá', 'orna', 1, 1, '*', 3, 220, 14, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Stones and sand make a calm garden.'),
    B('stonewell', 'Stone Well', 'Giếng nước', 'orna', 1, 1, '*', 3, 260, 16, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'People took water from wells long ago.'),
    B('gardenarch', 'Garden Arch', 'Cổng vòm', 'orna', 1, 1, '*', 3, 220, 14, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A white arch at the garden gate.'),
    B('streetclock', 'Street Clock', 'Đồng hồ phố', 'orna', 1, 1, '*', 3, 260, 16, 0, 0, 2, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A clock on a pole shows the time.'),
    B('zengarden', 'Zen Garden', 'Vườn thiền', 'orna', 1, 1, '*', 4, 400, 25, 0, 0, 4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A quiet garden for thinking.'),
    B('koipond', 'Koi Pond', 'Hồ cá koi', 'orna', 2, 2, '*', 4, 900, 56, 0, 0, 8, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Orange fish swim under lotus leaves.'),
    B('gazebo', 'Gazebo', 'Nhà chòi', 'orna', 2, 2, '*', 4, 1100, 69, 0, 0, 8, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A small house with open sides.'),
    B('pergola', 'Pergola', 'Giàn hoa', 'orna', 2, 1, '*', 4, 700, 44, 0, 0, 6, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Flowers climb over a wooden frame.'),
    B('sundial', 'Sundial', 'Đồng hồ mặt trời', 'orna', 1, 1, '*', 4, 300, 19, 0, 0, 3, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'The shadow shows the time.'),
    B('angel', 'Angel Statue', 'Tượng thiên thần', 'orna', 1, 1, '*', 5, 500, 31, 0, 0, 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'An angel with big white wings.'),
    B('minimill', 'Mini Windmill', 'Cối xay gió mini', 'orna', 1, 1, '*', 5, 450, 28, 0, 0, 4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A small windmill that really turns.'),
    B('obelisk', 'Obelisk', 'Đài tưởng niệm', 'orna', 1, 1, '*', 5, 500, 31, 0, 0, 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A tall stone pillar from old Egypt.'),
    B('sculpture', 'Modern Sculpture', 'Tác phẩm điêu khắc', 'orna', 1, 1, '*', 5, 600, 38, 0, 0, 5, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Curved lines make a modern work of art.'),
    B('grandfountain', 'Grand Fountain', 'Đài phun nước lớn', 'orna', 2, 2, '*', 6, 1800, 112, 0, 0, 12, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A big fountain with water in every direction.'),
    B('picnicarea', 'Picnic Area', 'Khu dã ngoại', 'park', 2, 2, '*', 4, 1400, 88, 0, 0, 14, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Spread a blanket and eat under a tree.'),
    B('dogpark', 'Dog Park', 'Công viên chó', 'park', 2, 2, '*', 5, 1800, 112, 0, 0, 14, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Dogs run and play together.'),
    B('bandstand', 'Bandstand', 'Nhà hát ngoài trời', 'park', 2, 2, 'p', 6, 3500, 219, 0, 0, 18, [10, 0, 1], 'A band plays music in the park.'),
    B('petting', 'Petting Zoo', 'Sân thú cưng', 'park', 2, 2, 'p', 6, 3000, 188, 150, 0, 18, [10, 0], 'Children can touch gentle animals.'),
    B('treehouse', 'Tree House', 'Nhà trên cây', 'park', 2, 2, 'p', 6, 2800, 175, 0, 0, 16, [10, 0], 'A wooden house high in a big tree.'),
    B('botanical', 'Botanical Garden', 'Vườn bách thảo', 'park', 3, 3, 'p', 7, 9000, 562, 600, 0, 24, [10], 'A glass house full of plants from the world.'),
    B('zoo', 'City Zoo', 'Vườn thú', 'park', 4, 4, 'p', 8, 16000, 1000, 1100, 0, 40, [10], 'Elephants, lions and penguins live here.'),
    B('souvenir', 'Souvenir Stand', 'Quầy lưu niệm', 'beach', 1, 1, 'b', 8, 1300, 81, 140, 0, 2, [6], 'Buy a shell or a postcard for your friends.'),
    B('surfshop', 'Surf Shop', 'Cửa hàng lướt sóng', 'beach', 1, 1, 'b', 8, 1600, 100, 150, 0, 3, [6], 'Surfboards in every colour.'),
    B('beachbar', 'Beach Bar', 'Quầy bar biển', 'beach', 1, 1, 'b', 8, 1800, 112, 180, 0, 4, [6], 'Fresh juice and coconut water.'),
    B('lifeguard', 'Lifeguard Tower', 'Chòi cứu hộ', 'beach', 1, 1, 'b', 8, 1400, 88, 0, 0, 8, [6], 'A lifeguard watches the swimmers.'),
    B('seafood', 'Seafood Restaurant', 'Nhà hàng hải sản', 'beach', 2, 2, 'b', 9, 5200, 325, 450, 0, 5, [6], 'Fresh crab, shrimp and fish.'),
    B('divecenter', 'Dive Center', 'Trung tâm lặn biển', 'beach', 2, 1, 'b', 9, 3600, 225, 330, 0, 4, [6], 'Learn to swim with the fish.'),
    B('volleyball', 'Beach Volleyball', 'Bóng chuyền bãi biển', 'beach', 2, 2, 'bp', 9, 3000, 188, 0, 0, 18, [6], 'Play volleyball on the sand.'),
    B('spa', 'Sea Spa', 'Spa biển', 'beach', 2, 2, 'b', 10, 6500, 406, 520, 0, 10, [6], 'Relax in warm water and calm music.'),
    B('bungalow', 'Beach Bungalow', 'Nhà gỗ bungalow', 'beach', 2, 1, 'br', 10, 4200, 262, 360, 12, 4, [6], 'A small wooden house near the sea.'),
    B('yachtclub', 'Yacht Club', 'Câu lạc bộ du thuyền', 'beach', 3, 2, 'b', 11, 11000, 688, 900, 0, 6, [6], 'Sailing boats wait at the dock.'),
    B('resorthotel', 'Resort Hotel', 'Khách sạn nghỉ dưỡng', 'beach', 3, 3, 'b', 12, 20000, 1250, 1500, 0, 8, [6], 'A big hotel with a swimming pool.'),
    B('beachhouse', 'Beach House', 'Biệt thự biển', 'beach', 2, 2, 'br', 13, 14000, 875, 600, 40, 6, [6], 'A white house with a sea view.'),
    B('cabin', 'Mountain Cabin', 'Nhà gỗ trên núi', 'mount', 1, 1, 'm', 9, 1800, 112, 160, 6, 3, [7], 'A warm wooden cabin with a chimney.'),
    B('alpinecafe', 'Alpine Café', 'Quán cà phê núi', 'mount', 1, 1, 'm', 9, 1700, 106, 170, 0, 4, [7], 'Hot chocolate with a mountain view.'),
    B('campsite', 'Campsite', 'Khu cắm trại', 'mount', 2, 2, 'mp', 10, 3200, 200, 0, 0, 14, [7], 'Tents, a campfire and stars at night.'),
    B('skirental', 'Ski Rental', 'Cho thuê đồ trượt tuyết', 'mount', 2, 1, 'm', 10, 3000, 188, 280, 0, 3, [7], 'Skis, boots and warm jackets.'),
    B('hotspring', 'Hot Spring', 'Suối nước nóng', 'mount', 2, 2, 'm', 11, 6800, 425, 520, 0, 16, [7], 'Warm water comes out of the ground.'),
    B('lookout', 'Lookout Tower', 'Tháp ngắm cảnh', 'mount', 1, 1, 'm', 11, 4200, 262, 0, 0, 14, [7], 'Climb up to see the whole valley.'),
    B('cablecar', 'Cable Car Station', 'Ga cáp treo', 'mount', 2, 2, 'm', 12, 9000, 562, 750, 0, 8, [7], 'Little cabins go up to the top.'),
    B('chapel', 'Mountain Chapel', 'Nhà thờ nhỏ', 'mount', 1, 1, 'm', 12, 3500, 219, 0, 0, 12, [7], 'A tiny church with a bell.'),
    B('skilodge', 'Ski Lodge', 'Nhà nghỉ trượt tuyết', 'mount', 3, 2, 'm', 12, 11000, 688, 900, 0, 6, [7], 'Skiers rest here after a long day.'),
    B('mounthotel', 'Mountain Hotel', 'Khách sạn núi', 'mount', 3, 2, 'm', 13, 13000, 812, 1000, 0, 6, [7], 'A big hotel high in the mountains.'),
    B('hayroll', 'Hay Roll', 'Cuộn rơm', 'farm', 1, 1, 'a', 5, 300, 19, 0, 0, 1, [8], 'Dry grass rolled into a big circle.'),
    B('henhouse', 'Hen House', 'Chuồng gà', 'farm', 1, 1, 'a', 5, 900, 56, 90, 0, 1, [8], 'Hens lay eggs here every morning.'),
    B('farmhouse', 'Farmhouse', 'Nhà nông trại', 'farm', 2, 2, 'ar', 5, 2400, 150, 180, 12, 2, [8], 'The farmer and family live here.'),
    B('vegfield', 'Vegetable Field', 'Ruộng rau', 'farm', 3, 3, 'a', 5, 2200, 138, 220, 0, 2, [8], 'Carrots, cabbages and tomatoes grow here.'),
    B('silo', 'Grain Silo', 'Kho thóc', 'farm', 1, 1, 'a', 6, 1500, 94, 130, 0, 0, [8], 'A tall tank stores corn and wheat.'),
    B('barn', 'Red Barn', 'Nhà kho nông trại', 'farm', 3, 2, 'a', 6, 3600, 225, 320, 0, 2, [8], 'Animals and hay stay in the barn.'),
    B('wheatfield', 'Wheat Field', 'Ruộng lúa mì', 'farm', 3, 3, 'a', 6, 2600, 162, 260, 0, 2, [8], 'Golden wheat moves in the wind.'),
    B('farmshop', 'Farm Shop', 'Cửa hàng nông sản', 'farm', 2, 1, 'a', 6, 2000, 125, 190, 0, 1, [8], 'Fresh fruit and vegetables for sale.'),
    B('greenhouse', 'Greenhouse', 'Nhà kính', 'farm', 2, 2, 'a', 7, 4200, 262, 400, 0, 3, [8], 'Plants grow warm inside the glass.'),
    B('orchard', 'Orchard', 'Vườn cây ăn quả', 'farm', 3, 3, 'a', 7, 3800, 238, 330, 0, 4, [8], 'Apple and orange trees in rows.'),
    B('pasture', 'Pasture', 'Bãi chăn bò', 'farm', 3, 3, 'a', 8, 4400, 275, 390, 0, 3, [8], 'Cows eat green grass all day.'),
    B('fishpond', 'Fish Pond', 'Ao cá', 'farm', 2, 2, 'a', 8, 3000, 188, 260, 0, 4, [8], 'Farmers raise fish in the water.'),
    B('windpump', 'Wind Pump', 'Cối gió bơm nước', 'farm', 1, 1, 'a', 9, 2500, 156, 200, 0, 2, [8], 'The wind pumps water to the fields.'),
    B('taxistand', 'Taxi Stand', 'Điểm taxi', 'trans', 1, 1, 't', 11, 1500, 94, 130, 0, 1, [9], 'Yellow taxis wait for passengers.'),
    B('gasstation', 'Gas Station', 'Trạm xăng', 'trans', 2, 1, 't', 11, 3000, 188, 300, 0, 0, [9], 'Cars get fuel here.'),
    B('parking', 'Car Park', 'Bãi đỗ xe', 'trans', 3, 2, 't', 11, 3200, 200, 280, 0, 0, [9], 'Many cars park in rows.'),
    B('busterminal', 'Bus Terminal', 'Bến xe buýt', 'trans', 3, 2, 't', 12, 7500, 469, 640, 0, 3, [9], 'Buses leave for many cities.'),
    B('cargodepot', 'Cargo Depot', 'Kho vận', 'trans', 3, 2, 't', 12, 6800, 425, 600, 0, 0, [9], 'Boxes wait for a truck or a plane.'),
    B('trainstation', 'Train Station', 'Ga tàu', 'trans', 4, 2, 't', 13, 12500, 781, 1000, 0, 4, [9], 'Trains arrive and leave all day.'),
    B('helipad', 'Helipad', 'Bãi đáp trực thăng', 'trans', 2, 2, 'tg', 13, 5000, 312, 400, 0, 4, [9], 'A helicopter lands on the big H.'),
    B('controltower', 'Control Tower', 'Tháp không lưu', 'trans', 1, 1, 't', 14, 6000, 375, 0, 0, 10, [9], 'Controllers talk to the pilots from here.'),
    B('hangar', 'Hangar', 'Nhà chứa máy bay', 'trans', 3, 2, 't', 14, 9000, 562, 800, 0, 0, [9], 'Planes sleep in a big shed.'),
    B('terminal', 'Airport Terminal', 'Nhà ga hàng không', 'trans', 4, 3, 't', 15, 22000, 1375, 1800, 0, 6, [9], 'Passengers check in and wait for flights.'),
    B('sportsshop', 'Sports Shop', 'Cửa hàng thể thao', 'sport', 1, 1, 'g', 13, 2200, 138, 200, 0, 1, [11], 'Balls, shoes and sports clothes.'),
    B('gym', 'Gym', 'Phòng tập', 'sport', 2, 2, 'g', 13, 5500, 344, 480, 0, 5, [11], 'Lift weights and get strong.'),
    B('tenniscourt', 'Tennis Court', 'Sân tennis', 'sport', 2, 2, 'gp', 13, 3500, 219, 0, 0, 14, [11], 'Hit the yellow ball over the net.'),
    B('skatepark', 'Skate Park', 'Công viên trượt ván', 'sport', 2, 2, 'gp', 14, 3800, 238, 0, 0, 16, [11], 'Ramps and rails for skateboards.'),
    B('pool', 'Swimming Pool', 'Hồ bơi', 'sport', 3, 2, 'g', 14, 7000, 438, 560, 0, 8, [11], 'Swim lanes and a cool blue pool.'),
    B('football', 'Football Field', 'Sân bóng đá', 'sport', 3, 3, 'gp', 14, 8000, 500, 0, 0, 26, [11], 'Two teams play on green grass.'),
    B('arena', 'Arena', 'Nhà thi đấu lớn', 'sport', 3, 3, 'g', 15, 14000, 875, 1150, 0, 8, [11], 'Basketball and concerts under one roof.'),
    B('expohall', 'Expo Hall', 'Trung tâm triển lãm', 'sport', 4, 3, 'g', 16, 20000, 1250, 1700, 0, 6, [11], 'Big shows with colourful stands.'),
    B('golf', 'Golf Course', 'Sân golf', 'sport', 4, 4, 'gp', 16, 18000, 1125, 900, 0, 40, [11], 'Hit the ball into a tiny hole.'),
    B('stadium', 'Stadium', 'Sân vận động', 'sport', 4, 4, 'g', 18, 34000, 1500, 3000, 0, 12, [11], 'Thousands of fans cheer for the team.'),
    // ── Sự kiện theo mùa (chỉ mua được khi sự kiện đang diễn ra, giống EWT Garden) ──
    B('lanternarch', 'Lantern Arch', 'Cổng đèn lồng', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 12, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Red lanterns welcome the New Year.', { ev: 'tet' }),
    B('peachtree', 'Peach Blossom Tree', 'Cây đào Tết', 'event', 1, 1, '*', 1, 300, 15, 0, 0, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Pink flowers bring good luck at Tet.', { ev: 'tet' }),
    B('moonlantern', 'Star Lantern', 'Đèn ông sao', 'event', 1, 1, '*', 1, 300, 15, 0, 0, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Children carry star lanterns at Mid-Autumn.', { ev: 'trungthu' }),
    B('rabbitlantern', 'Rabbit Lantern', 'Đèn thỏ', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 12, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A cute rabbit lantern for the moon festival.', { ev: 'trungthu' }),
    B('xmastree', 'Christmas Tree', 'Cây thông Noel', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 12, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A tree with lights and gifts.', { ev: 'noel' }),
    B('bigsnowman', 'Big Snowman', 'Người tuyết lớn', 'event', 2, 2, '*', 1, 900, 40, 0, 0, 24, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A friendly snowman with a red scarf.', { ev: 'noel' }),
    // ── Lễ hội mùa của EWT City (Hoa Xuân · Biển Hè · Thu Vàng) ──
    B('sakuraarch', 'Cherry Blossom Arch', 'Cổng hoa anh đào', 'event', 1, 1, '*', 1, 450, 20, 0, 0, 14, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A pink arch of cherry blossoms.', { ev: 'hoaxuan' }),
    B('flowercart', 'Flower Cart', 'Xe hoa tươi', 'event', 1, 1, '*', 1, 350, 15, 0, 0, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A cart full of fresh spring flowers.', { ev: 'hoaxuan' }),
    B('kitefield', 'Kite Meadow', 'Cánh đồng thả diều', 'event', 2, 2, '*', 1, 1000, 40, 0, 0, 26, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Colourful kites fly in the spring wind.', { ev: 'hoaxuan' }),
    B('springpavilion', 'Blossom Pavilion', 'Chòi ngắm hoa', 'event', 2, 2, '*', 1, 1200, 50, 0, 0, 28, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A quiet place to watch the blossoms.', { ev: 'hoaxuan' }),
    B('sandcastle', 'Sandcastle', 'Lâu đài cát', 'event', 1, 1, '*', 1, 350, 15, 0, 0, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A castle made of sand with a little flag.', { ev: 'bienhe' }),
    B('icecreamcart', 'Ice Cream Cart', 'Xe kem', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 8, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Cold ice cream on a hot summer day.', { ev: 'bienhe' }),
    B('beachvolley', 'Beach Volleyball Court', 'Sân bóng chuyền bãi biển', 'event', 2, 2, '*', 1, 1000, 40, 0, 0, 24, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Play volleyball on the warm sand.', { ev: 'bienhe' }),
    B('surfrack', 'Surfboard Rack', 'Giá ván lướt sóng', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 12, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Colourful boards wait for the waves.', { ev: 'bienhe' }),
    B('pumpkinpatch', 'Pumpkin Patch', 'Ruộng bí ngô', 'event', 2, 2, '*', 1, 900, 40, 0, 0, 22, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Round orange pumpkins grow in autumn.', { ev: 'thuvang' }),
    B('scarecrow', 'Scarecrow', 'Bù nhìn', 'event', 1, 1, '*', 1, 350, 15, 0, 0, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A friendly scarecrow watches the field.', { ev: 'thuvang' }),
    B('harvestcart', 'Harvest Cart', 'Xe thu hoạch', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A cart full of autumn fruit and vegetables.', { ev: 'thuvang' }),
    B('leafpile', 'Maple Leaf Pile', 'Đống lá phong', 'event', 1, 1, '*', 1, 300, 15, 0, 0, 8, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'Red and orange leaves for jumping in.', { ev: 'thuvang' })

  ];
  /* ───── lễ hội mùa riêng của EWT City (cố định theo ngày dương lịch; Tết · Trung thu · Giáng sinh dùng lịch sự kiện chung với Garden) ───── */
  var FESTIVALS = [
    { id: 'hoaxuan', icon: '🌸', name: 'Lễ hội Hoa Xuân', en: 'Spring Blossom Festival', from: '03-01', to: '04-05', bonus: 0.15, blurb: 'Hoa anh đào nở khắp phố: mở cửa hàng hoa, thả diều và ngắm hoa. Thuế thu được +15%.' },
    { id: 'bienhe', icon: '🏖️', name: 'Lễ hội Biển Hè', en: 'Summer Beach Festival', from: '06-01', to: '08-15', bonus: 0.15, blurb: 'Mùa hè sôi động: xe kem, lâu đài cát và bóng chuyền bãi biển. Thuế thu được +15%.' },
    { id: 'thuvang', icon: '🍂', name: 'Mùa Thu Vàng', en: 'Golden Autumn Festival', from: '10-01', to: '11-15', bonus: 0.15, blurb: 'Lá phong đỏ, bí ngô và những chiếc xe chở mùa thu hoạch. Thuế thu được +15%.' }
  ];
  var FEST_BY = {}; FESTIVALS.forEach(function (f) { FEST_BY[f.id] = f; });
  // các lễ hội đang diễn ra vào ngày `day` (YYYY-MM-DD)
  function festivalsOn(day) { var md = String(day).slice(5, 10); return FESTIVALS.filter(function (f) { return md >= f.from && md <= f.to; }).map(function (f) { return f.id; }); }
  var BY = {}; ITEMS.forEach(function (i) { BY[i.k] = i; });
  // công trình cố định (chỉ để vẽ)
  var FIXED_DEF = { plaza: { en: 'Town Plaza', vi: 'Quảng trường', w: 1, h: 1 }, townhall: { en: 'Town Hall', vi: 'Toà thị chính', w: 3, h: 3 }, clocktower: { en: 'Clock Tower', vi: 'Tháp đồng hồ', w: 1, h: 1 }, bigplaza: { en: 'Harbor Plaza', vi: 'Quảng trường cảng', w: 1, h: 1 }, pier: { en: 'Fishing Pier', vi: 'Cầu tàu bãi biển', w: 7, h: 2 }, airport: { en: 'Airport Gate', vi: 'Cổng sân bay', w: 4, h: 2 } };

  /* ───── luật chơi ───── */
  var MAXLV = 3, LVMUL = [0, 1, 1.8, 3.0], POPMUL = [0, 1, 1.8, 3.0];
  var RULES = {
    incomeCapH: 8,               // tích luỹ xu tối đa 8 giờ rồi dừng (phải bấm thu)
    roadCost: 8, roadRefund: 4, // xu mỗi ô đường tự xây
    sellBack: 0.5,              // dỡ công trình hoàn 50% giá
    upgradeMul: [0, 0, 0.9, 2.2], timeMul: [0, 1, 2.5, 6],
    speedX2: { base: 6, perMin: 3 },     // đẩy nhanh x2: còn lại giảm một nửa
    speedNow: { base: 15, perMin: 10 },  // xong ngay: đắt hơn
    freeStart: { cottage: 2, kiosk: 1 }, // vài món miễn phí để học sinh có "vốn" đầu tiên (không phát xu)
    quizReward: [[20, 40], [30, 30], [40, 18], [60, 8], [100, 4]],   // [xu, trọng số]
    quizDayCap: 60,
    ticketChance: 0.12
  };
  var itemCost = function (it, lv) { return lv <= 1 ? it.cost : Math.round(it.cost * RULES.upgradeMul[lv]); };
  var buildSecs = function (it, lv) { return Math.max(3, Math.round(it.secs * RULES.timeMul[lv])); };
  var incomeH = function (it, lv) { return Math.round(it.inc * LVMUL[lv]); };
  var popOf = function (it, lv) { return Math.round(it.pop * POPMUL[lv]); };
  var hpOf = function (it, lv) { return Math.round(it.hp * (lv === 1 ? 1 : lv === 2 ? 1.5 : 2)); };
  // giá đẩy nhanh theo thời gian còn lại (giây)
  var speedCost = function (mode, remainSec) { var m = Math.max(0.2, remainSec / 60), r = mode === 'now' ? RULES.speedNow : RULES.speedX2; return Math.ceil(r.base + r.perMin * m * (mode === 'x2' ? 0.5 : 1)); };

  // điểm thành phố → cấp (1..30)
  var LEVEL_AT = [0]; (function () { var n; for (n = 1; n < 30; n++) LEVEL_AT.push(Math.round(35 * Math.pow(n, 1.9))); })();
  var levelOfScore = function (s) { var l = 1; while (l < LEVEL_AT.length && s >= LEVEL_AT[l]) l++; return l; };
  var scoreOf = function (buildings) { var s = 0; buildings.forEach(function (b) { var it = BY[b.k]; if (it && !b.bt) { var n, c = 0; for (n = 1; n <= b.lv; n++) c += itemCost(it, n); s += c / 25 + popOf(it, b.lv); } }); return Math.round(s); };

  /* ───── kiểm tra đặt công trình / đường ───── */
  // occ: Int32Array(W*H) chứa (chỉ số công trình + 1) hoặc 0 — do bên gọi dựng bằng buildOcc
  function buildOcc(buildings) { var o = new Int32Array(W * H), n, b, it, x, y; for (n = 0; n < buildings.length; n++) { b = buildings[n]; it = BY[b.k]; if (!it) continue; for (y = 0; y < it.h; y++) for (x = 0; x < it.w; x++) o[idx(b.x + x, b.y + y)] = n + 1; } return o; }
  var isRoadAt = function (x, y, extra) { return inW(x, y) && (ROAD[idx(x, y)] > 0 || !!(extra && extra[idx(x, y)])); };
  function adjacentRoad(x, y, w, h, extra) {
    var a, b;
    for (a = 0; a < w; a++) { if (isRoadAt(x + a, y - 1, extra) || isRoadAt(x + a, y + h, extra)) return true; }
    for (b = 0; b < h; b++) { if (isRoadAt(x - 1, y + b, extra) || isRoadAt(x + w, y + b, extra)) return true; }
    return false;
  }
  // st: { districts:[ids mở], roads:{idx:1} (đường tự xây) }. Trả { ok, err }
  function canPlace(st, it, x, y, occ) {
    var a, b, i, zs, lvlOk = true;
    if (!it) return { ok: false, err: 'Công trình không tồn tại.' };
    for (b = 0; b < it.h; b++) for (a = 0; a < it.w; a++) {
      if (!inW(x + a, y + b)) return { ok: false, err: 'Ra ngoài bản đồ.' };
      i = idx(x + a, y + b);
      if (TERR[i] !== 0) return { ok: false, err: TERR[i] === 3 ? 'Đây là núi đá — không xây được.' : TERR[i] === 4 ? 'Đây là rừng tự nhiên — không xây được.' : TERR[i] === 5 ? 'Đây là đường băng — không xây được.' : 'Chỗ này là nước hoặc bãi cát — không xây được.' };
      if (ROAD[i] || (st.roads && st.roads[i])) return { ok: false, err: 'Chỗ này đang là đường.' };
      if (FOCC[i] >= 0) return { ok: false, err: 'Chỗ này đã có công trình của thành phố.' };
      if (occ && occ[i]) return { ok: false, err: 'Chỗ này đã có công trình.' };
      if (st.districts.indexOf(DIST[i]) < 0) return { ok: false, err: 'Quận này chưa được mở.' };
      zs = String.fromCharCode(ZONE[i]); if (it.z !== '*' && it.z.indexOf(zs) < 0) return { ok: false, err: it.vi + ' chỉ xây được ở khu ' + zoneList(it.z) + '. Ô này là khu "' + (ZONE_NAME[zs] || 'khác') + '".' };
    }
    if (!adjacentRoad(x, y, it.w, it.h, st.roads)) return { ok: false, err: 'Công trình cần nằm sát một con đường. Hãy xây thêm đường dẫn tới đây.' };
    return { ok: true };
  }
  function zoneList(z) { return z.split('').map(function (c) { return ZONE_NAME[c] || c; }).join(' / ').toLowerCase(); }
  function canRoad(st, x, y, occ) {
    var i;
    if (!inW(x, y)) return { ok: false, err: 'Ra ngoài bản đồ.' };
    i = idx(x, y);
    if (TERR[i] !== 0 || ROAD[i]) return { ok: false, err: 'Không xây đường ở đây được.' };
    if ((st.roads && st.roads[i])) return { ok: false, err: 'Đã có đường.' };
    if (FOCC[i] >= 0 || (occ && occ[i])) return { ok: false, err: 'Có công trình đang đứng ở đây.' };
    if (st.districts.indexOf(DIST[i]) < 0) return { ok: false, err: 'Quận này chưa được mở.' };
    return { ok: true };
  }


  /* ───── gói combo (giảm 15%) và bản quy hoạch mẫu (khối 5×5 giữa hai đường, có đường dọc ở giữa) ───── */
  var BUNDLE_OFF = 0.85;
  var BUNDLES = [
    { id: 'b-start', d: 0, icon: '🏡', en: 'Starter Pack', vi: 'Gói Khởi nghiệp', items: { cottage: 4, kiosk: 1, tree: 4, flowerbed: 3 } },
    { id: 'b-family', d: 0, icon: '👨‍👩‍👧', en: 'Family Pack', vi: 'Gói Gia đình', items: { townhouse: 3, bakery: 1, cafe: 1, fountain: 1, tree: 4 } },
    { id: 'b-town', d: 1, icon: '🛍️', en: 'Downtown Pack', vi: 'Gói Phố mua sắm', items: { shop: 2, cafe: 2, bakery: 1, busstop: 2, flowerbed: 4 } },
    { id: 'b-port', d: 2, icon: '⚓', en: 'Harbor Pack', vi: 'Gói Bến cảng', items: { warehouse: 2, workshop: 2, fishmarket: 1, watertower: 1 } },
    { id: 'b-fun', d: 3, icon: '🎠', en: 'Fun Pack', vi: 'Gói Vui chơi', items: { beachhut: 2, icecream: 2, arcade: 1, minigolf: 1, tree: 4 } },
    { id: 'b-campus', d: 4, icon: '📚', en: 'Campus Pack', vi: 'Gói Học đường', items: { bookstore: 3, tree: 3, flowerbed: 3 } },
    { id: 'b-world', d: 5, icon: '🌏', en: 'World Pack', vi: 'Gói Phố quốc tế', items: { sushi: 1, pizzeria: 1, teahouse: 1, torii: 2, tree: 3 } },
    { id: 'b-beach', d: 6, icon: '🏖️', en: 'Beach Pack', vi: 'Gói Bãi biển', items: { beachbar: 1, surfshop: 1, lifeguard: 1, souvenir: 1, palmtree: 4, volleyball: 1 } },
    { id: 'b-mount', d: 7, icon: '⛰️', en: 'Mountain Pack', vi: 'Gói Nghỉ dưỡng núi', items: { cabin: 2, alpinecafe: 1, campsite: 1, pine: 4, torch: 2 } },
    { id: 'b-farm', d: 8, icon: '🌾', en: 'Farm Pack', vi: 'Gói Nông trại', items: { farmhouse: 1, henhouse: 2, silo: 1, vegfield: 1, hayroll: 3, scarecrow: 1 } },
    { id: 'b-trans', d: 9, icon: '🚕', en: 'Transport Pack', vi: 'Gói Giao thông', items: { taxistand: 2, gasstation: 1, parking: 1, busterminal: 1 } },
    { id: 'b-park', d: 10, icon: '🎪', en: 'Park Pack', vi: 'Gói Công viên', items: { bandstand: 1, picnicarea: 1, benchwood: 4, oak: 4, flowerpot: 4 } },
    { id: 'b-sport', d: 11, icon: '⚽', en: 'Sports Pack', vi: 'Gói Thể thao', items: { gym: 1, tenniscourt: 2, sportsshop: 1, football: 1 } },
    { id: 'b-garden', d: -1, icon: '🌷', en: 'Flower Garden Pack', vi: 'Gói Vườn hoa', items: { tulip: 2, rose: 2, daisy: 3, lavender: 2, hedge: 3, flowerpot: 3 } },
    { id: 'b-street', d: -1, icon: '🛋️', en: 'Pretty Street Pack', vi: 'Gói Phố đẹp', items: { benchwood: 3, streetlamp: 4, bins: 2, mailbox: 1, signpost: 2 } },
    { id: 'b-lights', d: -1, icon: '💡', en: 'Night Lights Pack', vi: 'Gói Đèn đêm', items: { gardenlamp: 4, pathlight: 4, lanternstring: 1, fairytree: 1 } },
    { id: 'b-trees', d: -1, icon: '🌳', en: 'Little Forest Pack', vi: 'Gói Rừng nhỏ', items: { oak: 3, pine: 3, birch: 2, maple: 2, willow: 1 } },
    { id: 'b-tet', d: -1, ev: 'tet', icon: '🧧', en: 'Lunar New Year Pack', vi: 'Gói Tết', items: { lanternarch: 2, peachtree: 3 } },
    { id: 'b-moon', d: -1, ev: 'trungthu', icon: '🥮', en: 'Mid-Autumn Pack', vi: 'Gói Trung thu', items: { moonlantern: 3, rabbitlantern: 2 } },
    { id: 'b-noel', d: -1, ev: 'noel', icon: '🎄', en: 'Christmas Pack', vi: 'Gói Giáng sinh', items: { xmastree: 2, bigsnowman: 1 } },
    { id: 'b-hoaxuan', d: -1, ev: 'hoaxuan', icon: '🌸', en: 'Spring Blossom Pack', vi: 'Gói Hoa Xuân', items: { sakuraarch: 2, flowercart: 2, kitefield: 1 } },
    { id: 'b-bienhe', d: -1, ev: 'bienhe', icon: '🏖️', en: 'Summer Beach Pack', vi: 'Gói Biển Hè', items: { sandcastle: 2, icecreamcart: 1, surfrack: 2, beachvolley: 1 } },
    { id: 'b-thuvang', d: -1, ev: 'thuvang', icon: '🍂', en: 'Golden Autumn Pack', vi: 'Gói Thu Vàng', items: { pumpkinpatch: 1, scarecrow: 2, harvestcart: 1, leafpile: 3 } }
  ];
  var BUNDLE_BY = {}; BUNDLES.forEach(function (b) { BUNDLE_BY[b.id] = b; });
  function bundleFull(b) { var t = 0, k; for (k in b.items) t += BY[k].cost * b.items[k]; return t; }
  function bundlePrice(b) { return Math.round(bundleFull(b) * BUNDLE_OFF); }
  function bundleLvl(b) { var m = 1, k; for (k in b.items) m = Math.max(m, BY[k].lvl); return m; }
  var col = function (k, dx, ys) { return ys.map(function (y) { return [k, dx, y]; }); }, Y5 = [0, 1, 2, 3, 4];
  var PLANS = [
    { id: 'p-row', icon: '🏘️', z: 'r', en: 'Row Houses', vi: 'Phố nhà liền kề', desc: 'Hai dãy nhà hai bên con đường nhỏ ở giữa: nhà phố, nhà cấp 4 và nhà song lập.', items: [].concat(col('townhouse', 0, Y5), col('cottage', 1, Y5), col('duplex', 3, Y5)) },
    { id: 'p-shop', icon: '🛍️', z: 'c', en: 'Shopping Street', vi: 'Phố mua sắm', desc: 'Một dãy cửa hàng lớn đối diện hai dãy quán cà phê và tiệm bánh.', items: [].concat(col('shop', 0, Y5), col('cafe', 3, Y5), col('bakery', 4, Y5)) },
    { id: 'p-green', icon: '🌳', z: '*', en: 'Green Block', vi: 'Khối công viên xanh', desc: 'Hàng cây và hoa, sân chơi, đài phun nước — hợp với mọi khu.', items: [].concat(col('tree', 0, Y5), col('flowerbed', 1, Y5), [['playground', 3, 0], ['fountain', 3, 2], ['fountain', 4, 2], ['tree', 3, 3], ['tree', 4, 3], ['tree', 3, 4], ['tree', 4, 4]]) },
    { id: 'p-dock', icon: '⚓', z: 'h', en: 'Dock Block', vi: 'Khối bến kho vận', desc: 'Kho hàng, hải đăng và dãy chợ cá sát bến cảng.', items: [['warehouse', 0, 0], ['warehouse', 0, 2], ['lighthouse', 0, 4], ['lighthouse', 1, 4]].concat(col('fishmarket', 3, Y5)) },
    { id: 'p-work', icon: '🏭', z: 'i', en: 'Workshop Block', vi: 'Cụm công xưởng', desc: 'Xưởng cơ khí, nhà kho và tháp nước.', items: [].concat(col('workshop', 0, Y5), [['warehouse', 3, 0], ['warehouse', 3, 2], ['watertower', 3, 4], ['watertower', 4, 4]]) },
    { id: 'p-fun', icon: '🎡', z: 'f', en: 'Fun Street', vi: 'Phố vui chơi', desc: 'Trò chơi điện tử, kem, nhà bãi biển và sân gôn mini.', items: [['arcade', 0, 0], ['arcade', 0, 1], ['arcade', 0, 2], ['icecream', 0, 3], ['icecream', 1, 3], ['beachhut', 0, 4], ['beachhut', 1, 4], ['minigolf', 3, 0], ['minigolf', 3, 2], ['icecream', 3, 4], ['icecream', 4, 4]] },
    { id: 'p-edu', icon: '📚', z: 'e', en: 'Campus Street', vi: 'Phố học đường', desc: 'Hiệu sách, cây xanh và hai trường mẫu giáo (cần đã học chương “School & Lab”).', items: [].concat(col('bookstore', 0, Y5), col('tree', 1, Y5), [['kindergarten', 3, 0], ['kindergarten', 3, 2], ['tree', 3, 4], ['tree', 4, 4]]) },
    { id: 'p-world', icon: '🍜', z: 'w', en: 'World Food Street', vi: 'Phố ẩm thực quốc tế', desc: 'Sushi, pizza, quán trà và cổng torii thành một con phố đẹp.', items: [].concat(col('sushi', 0, Y5), col('pizzeria', 1, Y5), col('teahouse', 3, Y5), col('torii', 4, Y5)) }
  ];
  PLANS.push(
    { id: 'p-flower', icon: '💐', z: '*', en: 'Flower Walk', vi: 'Lối dạo hoa', desc: 'Hàng sồi, ghế gỗ, tulip và hoa hồng hai bên lối đi nhỏ.', items: [].concat(col('oak', 0, Y5), col('benchwood', 1, Y5), col('tulip', 3, Y5), col('rose', 4, Y5)) },
    { id: 'p-beach', icon: '🏖️', z: 'b', en: 'Beach Strip', vi: 'Dải bãi biển', desc: 'Quầy bar, cửa hàng lướt sóng, nhà hàng hải sản và sân bóng chuyền.', items: [['beachbar', 0, 0], ['surfshop', 1, 0], ['souvenir', 0, 1], ['souvenir', 1, 1], ['lifeguard', 0, 2], ['lifeguard', 1, 2], ['divecenter', 0, 3], ['bungalow', 0, 4], ['seafood', 3, 0], ['volleyball', 3, 2], ['souvenir', 3, 4], ['souvenir', 4, 4]] },
    { id: 'p-mount', icon: '⛰️', z: 'm', en: 'Mountain Village', vi: 'Làng nghỉ dưỡng núi', desc: 'Nhà gỗ, quán cà phê núi, khu cắm trại và đuốc sáng.', items: [['cabin', 0, 0], ['cabin', 1, 0], ['cabin', 0, 1], ['cabin', 1, 1], ['alpinecafe', 0, 2], ['alpinecafe', 1, 2], ['lookout', 0, 3], ['torch', 1, 3], ['torch', 1, 4], ['campsite', 3, 0], ['campsite', 3, 2], ['cabin', 3, 4], ['cabin', 4, 4]] },
    { id: 'p-farm', icon: '🌾', z: 'a', en: 'Farm Yard', vi: 'Sân trang trại', desc: 'Nhà nông, chuồng gà, kho thóc, cuộn rơm và nhà kính.', items: [['farmhouse', 0, 0], ['henhouse', 0, 2], ['henhouse', 1, 2], ['silo', 0, 3], ['silo', 1, 3], ['hayroll', 0, 4], ['hayroll', 1, 4], ['greenhouse', 3, 0], ['farmshop', 3, 2], ['farmshop', 3, 3], ['windpump', 3, 4], ['windpump', 4, 4]] },
    { id: 'p-trans', icon: '🚕', z: 't', en: 'Taxi & Fuel', vi: 'Điểm taxi & trạm xăng', desc: 'Điểm đón taxi, trạm xăng và hai bãi đáp trực thăng.', items: [['taxistand', 0, 0], ['taxistand', 1, 0], ['gasstation', 0, 1], ['gasstation', 0, 2], ['taxistand', 0, 3], ['taxistand', 1, 3], ['helipad', 3, 0], ['helipad', 3, 2], ['gasstation', 3, 4]] },
    { id: 'p-sport', icon: '⚽', z: 'g', en: 'Sports Row', vi: 'Dãy thể thao', desc: 'Phòng tập, sân tennis và cửa hàng thể thao.', items: [['gym', 0, 0], ['gym', 0, 2], ['sportsshop', 0, 4], ['sportsshop', 1, 4], ['tenniscourt', 3, 0], ['tenniscourt', 3, 2], ['sportsshop', 3, 4], ['sportsshop', 4, 4]] }
  );
  PLANS.forEach(function (pl) { pl.roads = Y5.map(function (y) { return [2, y]; }); });
  var PLAN_BY = {}; PLANS.forEach(function (pl) { PLAN_BY[pl.id] = pl; });
  var API = { FESTIVALS: FESTIVALS, FEST_BY: FEST_BY, festivalsOn: festivalsOn, BUNDLES: BUNDLES, BUNDLE_BY: BUNDLE_BY, bundlePrice: bundlePrice, bundleFull: bundleFull, bundleLvl: bundleLvl, PLANS: PLANS, PLAN_BY: PLAN_BY, W: W, H: H, OX: OX, OY: OY, PER: PER, BLOCKS: BLOCKS, PROPS: PROPS, LAMPS: LAMPS, LANES: LANES, migrateState: migrateState, hash: hash, DISTRICTS: DISTRICTS, ZONE_NAME: ZONE_NAME, ZONE_COLOR: ZONE_COLOR, TERR: TERR, ROAD: ROAD, DIST: DIST, ZONE: ZONE, FIXED: FIXED, FOCC: FOCC, FIXED_DEF: FIXED_DEF,
    CATS: CATS, ITEMS: ITEMS, BY: BY, MAXLV: MAXLV, RULES: RULES, LEVEL_AT: LEVEL_AT, idx: idx, inW: inW, itemCost: itemCost, buildSecs: buildSecs, incomeH: incomeH, popOf: popOf, hpOf: hpOf, speedCost: speedCost,
    levelOfScore: levelOfScore, scoreOf: scoreOf, buildOcc: buildOcc, canPlace: canPlace, canRoad: canRoad, adjacentRoad: adjacentRoad, zoneList: zoneList, isRoadAt: isRoadAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTCityData = API;
})(typeof window !== 'undefined' ? window : this);
