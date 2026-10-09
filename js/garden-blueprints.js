/* EWT Garden — GỢI Ý XÂY VƯỜN: 3 bản thiết kế mẫu cho từng khu, sinh theo "bản sắc" của khu + cấp vườn + cỡ đất hiện có.
   Dùng chung cho trình duyệt (xem trước) và máy chủ (tính giá & dựng thật) nên hai bên luôn cho CÙNG một kết quả.
   Mỗi mẫu = danh sách { i: chỉ số ô, k: id món }; công trình lớn chỉ ghi ở ô góc trên-trái.

   Cách thiết kế (để vườn gọn gàng, rõ từng khu): lối đi đá chia đất thành các "phòng" hình chữ nhật; mỗi phòng có một vai trò rõ ràng —
   luống hoa một màu (viền + lõi 2 tông), lùm cây, quảng trường lát đá có công trình/đồ trang trí làm điểm nhấn, đồng cỏ hoa… Ở cùng một khu, 3 mẫu theo 3 kiểu bố cục khác nhau;
   mỗi chủ đề có kiểu bố cục đặc trưng riêng (sân thiền châu Á, trục đối xứng cung điện, ruộng bậc thang, phố nhà cổ, quảng trường, đồng cỏ tự nhiên, bờ nước, vòng tròn huyền ảo). */
(function (root) {
  'use strict';
  var ARCH = {
    formal: { icon: '⚜️', name: 'Vườn đối xứng cung đình', desc: 'Dãy công trình ở giữa có ghế và đèn, lối đi 1 ô dẫn tới từng cửa. Phía trên và dưới là các khu hoa đối xứng — mỗi khu một loại hoa, lùm cây ở hai góc.' },
    plaza: { icon: '⛲', name: 'Quảng trường & vòng hoa', desc: 'Dãy công trình ở giữa quanh có ghế, đèn; các khu hoa và lùm cây xen kẽ như bàn cờ, ngăn bằng lối đi 1 ô.' },
    courtyard: { icon: '🏮', name: 'Sân vườn thanh tịnh', desc: 'Công trình ở giữa, bốn góc là lùm cây, các khu hoa còn lại mỗi khu một loại — gọn như sân thiền.' },
    terraces: { icon: '🌾', name: 'Ruộng bậc thang', desc: 'Hàng công trình ở trên cùng, bên dưới là các ruộng hoa chạy ngang — mỗi dải một loại hoa, ngăn bằng lối đi bậc thang 1 ô.' },
    street: { icon: '🏘️', name: 'Phố văn hoá', desc: 'Con phố chính 1 ô chạy ngang, công trình hai bên phố hướng ra đường, phía sau là các khu hoa và lùm cây.' },
    meadow: { icon: '🌿', name: 'Đồng cỏ tự nhiên', desc: 'Công trình ở giữa, các khu hoa và lùm cây xen kẽ theo hàng, lối đi 1 ô dẫn vào từng cửa. Thoáng và dễ nhìn.' },
    waterfront: { icon: '⚓', name: 'Bờ nước & lối dạo', desc: 'Hàng công trình ở trên, các dải hoa và lùm cây xen kẽ chạy ngang, đèn dọc lối đi.' },
    gallery: { icon: '🏛️', name: 'Phòng trưng bày', desc: 'Dãy công trình đứng hàng ngang phía trên như một phố triển lãm, bên dưới chia thành các ô hoa vuông vắn, mỗi ô một loại.' },
    mosaic: { icon: '🎨', name: 'Tấm thảm hoa', desc: 'Nhiều ô hoa nhỏ ghép như tấm thảm nhiều màu, mỗi ô một loại hoa, công trình ở giữa. Rực rỡ mà vẫn ngăn nắp.' },
    orchard: { icon: '🌳', name: 'Vườn cây & lùm hoa', desc: 'Các lùm cây trồng thưa đều trên nền hoa chiếm đa số, công trình ở giữa có lối đi 1 ô — xanh mát, nhiều bóng râm.' }
  };
  // kiểu bố cục đặc trưng (Mẫu 1) của từng khu; Mẫu 2, 3 là hai kiểu gần gũi; Mẫu 4, 5 là hai kiểu sáng tạo thêm (xem EXTRA)
  var SIG = {
    cottage: 'meadow', hill: 'terraces', river: 'waterfront', pond: 'courtyard', forest: 'orchard', palace: 'formal', winter: 'meadow', beach: 'waterfront', magic: 'mosaic', farm: 'terraces',
    sakura: 'courtyard', autumn: 'orchard', mountain: 'terraces', desert: 'plaza', candy: 'mosaic', ocean: 'waterfront', sky: 'mosaic', space: 'mosaic', bamboo: 'courtyard', savanna: 'meadow',
    jungle: 'orchard', village: 'street', funfair: 'plaza', arctic: 'meadow', pirate: 'waterfront', dino: 'meadow', volcano: 'mosaic', cyber: 'street',
    vietnam: 'terraces', thailand: 'courtyard', japan: 'courtyard', china: 'formal', india: 'formal', indonesia: 'terraces', france: 'formal', italy: 'street', netherlands: 'terraces', uk: 'meadow', germany: 'street',
    usa: 'street', greece: 'gallery', sweden: 'meadow', switzerland: 'meadow', korea: 'courtyard', turkey: 'plaza', australia: 'meadow', canada: 'orchard', mexico: 'plaza', brazil: 'mosaic', egypt: 'formal',
    morocco: 'courtyard', spain: 'plaza', russia: 'plaza', ireland: 'meadow', norway: 'waterfront', peru: 'terraces', argentina: 'street', cuba: 'street', chile: 'waterfront', kenya: 'meadow',
    southafrica: 'waterfront', ethiopia: 'courtyard', madagascar: 'orchard'
  };
  var ALT = { formal: ['plaza', 'gallery'], plaza: ['formal', 'street'], courtyard: ['meadow', 'plaza'], terraces: ['meadow', 'gallery'], street: ['plaza', 'terraces'], meadow: ['courtyard', 'formal'], waterfront: ['street', 'meadow'], gallery: ['formal', 'terraces'], mosaic: ['plaza', 'meadow'], orchard: ['meadow', 'courtyard'] };
  var EXTRA = ['gallery', 'mosaic', 'orchard', 'terraces', 'courtyard', 'street', 'plaza', 'formal', 'meadow'];
  var STYLES = [{ id: 'sig' }, { id: 'alt1' }, { id: 'alt2' }, { id: 'new1' }, { id: 'new2' }];
  function archFor(zid, idx) {
    var a = SIG[zid] || 'meadow', alt = ALT[a] || ['meadow', 'plaza'], used = [a, alt[0], alt[1]];
    if (idx === 0) return a; if (idx === 1) return alt[0]; if (idx === 2) return alt[1];
    var pool = EXTRA.filter(function (x) { return used.indexOf(x) < 0; }), h = hash(zid), p1 = pool[h % pool.length], p2 = pool[(h >>> 5) % pool.length];
    if (p2 === p1) p2 = pool[((h >>> 5) + 1) % pool.length];
    return idx === 3 ? p1 : p2;
  }

  function hash(str) { var h = 2166136261, i; for (i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619); return h >>> 0; }

  function pools(G, zid, lvl) {
    var ok = function (it) { return it.lvl <= lvl && !it.ev && !it.bd && (!it.z || it.z === zid); };
    var byCost = function (a, b) { return a.cost - b.cost || (a.id < b.id ? -1 : 1); };
    var zi = G.ITEMS.filter(function (i) { return i.z === zid && ok(i); }), gi = G.ITEMS.filter(function (i) { return !i.z && ok(i) && i.cost > 0; });
    var pick = function (kind, n, maxGeneric) {
      var a = zi.filter(function (i) { return i.kind === kind; }).sort(byCost), g = gi.filter(function (i) { return i.kind === kind; }).sort(byCost);
      if (a.length < n) a = a.concat(g.slice(0, Math.max(0, Math.min(maxGeneric || n, n - a.length))));
      return a.slice(0, n);
    };
    var bigs = zi.filter(function (i) { return i.kind === 'big' && i.w * i.h >= 4 && i.w <= 3 && i.h <= 3; }).sort(function (a, b) { return b.w * b.h - a.w * a.h || a.cost - b.cost; });
    if (!bigs.length) bigs = gi.filter(function (i) { return i.kind === 'big' && i.w * i.h <= 6 && i.w * i.h >= 4; }).sort(byCost).slice(0, 2);
    var cheapDeco = ['lamp', 'bench', 'birdhouse', 'mailbox', 'picnic', 'gnome'].map(function (id) { return G.BY[id]; }).filter(function (i) { return i && ok(i); });
    var D = zi.filter(function (i) { return i.kind === 'deco'; }).sort(byCost);
    return { F: pick('plant', 5, 3), T: pick('tree', 4, 2), D: D.concat(cheapDeco).slice(0, 9), B: bigs.slice(0, 3), path: (function () { var t = G.PATHOF && G.BY[G.PATHOF[zid]]; return t && ok(t) ? t : G.BY.path; })() };
  }

  /* ═════════ BỐ CỤC MỚI (gọn, thống nhất): lối đi RỘNG 1 Ô, mỗi khu = một loại hoa, trung tâm là dãy công trình có ghế/đèn, lối đi dẫn tới cửa từng công trình ═════════ */
  function make(G, zid, landLv, lvl, styleIdx) {
    var z = G.ZBY[zid]; if (!z) return null;
    var arch = archFor(zid, styleIdx | 0);
    var d = G.landOf(landLv), cols = d.c, rows = d.r, P = pools(G, zid, lvl), info = ARCH[arch];
    var seed = hash(zid + ':' + (styleIdx | 0)), F = P.F, T = P.T, D = P.D, B = P.B, nF = F.length, nT = T.length, nD = D.length, PATH = P.path, off = seed % 5;
    var gi = function (c, r) { return z.i * G.PER + r * G.MAXC + c; };
    var open = function (c, r) { return c >= 0 && r >= 0 && c < cols && r < rows && !G.isBlocked(gi(c, r)); };
    var map = {}, used = {}, K = function (c, r) { return r * cols + c; };
    var free = function (c, r) { return open(c, r) && map[K(c, r)] == null && !used[K(c, r)]; };
    var put = function (c, r, it) { if (it && free(c, r)) { map[K(c, r)] = it.id; return true; } return false; };
    var fl = function (i) { return nF ? F[((i % nF) + nF) % nF] : null; }, tr = function (i) { return nT ? T[((i % nT) + nT) % nT] : null; }, dc = function (i) { return nD ? D[((i % nD) + nD) % nD] : null; };
    var okI = function (id) { var it = G.BY[id]; return it && it.lvl <= lvl && !it.ev ? it : null; };
    var BENCH = okI('bench') || dc(1), LAMP = okI('lamp') || dc(0);
    var isPath = function (c, r) { return PATH && map[K(c, r)] === PATH.id; };
    var c, r;

    /* ── đường kẻ (1 ô): cột dọc vl, hàng ngang hl ── */
    var vl = [], hl = [];
    var even = function (n, len) { var a = [], k; for (k = 1; k <= n; k++) a.push(Math.round(len * k / (n + 1))); return a; };
    var band = null;                       // dải trung tâm chứa công trình {r0, r1}
    if (arch === 'terraces' || arch === 'waterfront') {
      var cH = rows >= 9 ? 4 : 3; band = { r0: 0, r1: Math.min(rows - 1, cH - 1) };
      if (rows > cH + 1) { hl.push(cH); for (r = cH + 1 + (arch === 'waterfront' ? 3 : 3); r < rows - 1; r += (arch === 'waterfront' ? 3 : 4)) hl.push(r); }
      if (cols >= 7) vl.push(Math.floor(cols / 2));
    } else if (arch === 'street') {
      var pr = Math.floor(rows / 2); if (rows >= 8) hl.push(pr);
      vl = cols >= 13 ? [Math.floor(cols / 2)] : cols >= 6 ? [Math.floor(cols / 2)] : [];
      band = rows >= 8 ? { r0: Math.max(0, pr - 3), r1: pr - 1, r2: pr + 1, r3: Math.min(rows - 1, pr + 3) } : { r0: 0, r1: rows - 1 };
    } else if (arch === 'gallery') {      // dãy công trình hàng ngang phía trên, bên dưới là lưới ô hoa vuông vắn
      var cH2 = rows >= 9 ? 4 : 3; band = { r0: 0, r1: Math.min(rows - 1, cH2 - 1) };
      if (rows > cH2 + 1) { hl.push(cH2); var rest = rows - cH2 - 1; if (rest >= 8) hl.push(cH2 + 1 + Math.floor(rest / 2)); }
      vl = cols >= 13 ? even(2, cols) : cols >= 6 ? [Math.floor(cols / 2)] : [];
    } else {                               // formal · plaza · courtyard · meadow: dải công trình ở giữa, hai hàng ruộng trên/dưới
      vl = cols >= 13 ? even(2, cols) : cols >= 6 ? [Math.floor(cols / 2)] : [];
      if (rows >= 11) { var a0 = Math.floor((rows - 5) / 2); hl = [a0, a0 + 4]; band = { r0: a0 + 1, r1: a0 + 3 }; }
      else if (rows >= 8) { hl = [Math.floor(rows / 2)]; band = { r0: 0, r1: hl[0] - 1 }; }
      else band = { r0: 0, r1: rows - 1 };
      if (arch === 'mosaic') {                                   // tấm thảm hoa: chia nhỏ hơn nữa
        if (cols >= 17) vl = even(3, cols); else if (cols >= 13) vl = even(2, cols);
        if (rows >= 11) { var ta = hl[0], bt = rows - hl[1] - 1; if (ta >= 7) hl.unshift(Math.floor(ta / 2)); if (bt >= 7) hl.push(hl[hl.length - 1] + 1 + Math.floor(bt / 2)); }
      }
    }
    var spans = function (ls, len) { var a = [], s0 = 0; ls.concat([len]).forEach(function (e) { if (e - 1 >= s0) a.push([s0, e - 1]); s0 = e + 1; }); return a; };
    var cs = spans(vl, cols), rs = spans(hl, rows);
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) if (PATH && (vl.indexOf(c) >= 0 || hl.indexOf(r) >= 0)) put(c, r, PATH);

    /* ── công trình lớn: mỗi đoạn của dải trung tâm một công trình, cửa quay về lối đi gần nhất ── */
    var boxes = [], bigsLeft = B.length;
    var tryPlace = function (b, c0, c1, r0, r1, tc, trw) {
      var best = null, bd = 1e9, x, y, dx, dy, ok2;
      for (y = r0; y <= r1 - b.h + 1; y++) for (x = c0; x <= c1 - b.w + 1; x++) {
        ok2 = true; for (dy = 0; dy < b.h && ok2; dy++) for (dx = 0; dx < b.w; dx++) if (!free(x + dx, y + dy)) { ok2 = false; break; }
        if (!ok2) continue; var dd = Math.abs(x + b.w / 2 - tc) * 2 + Math.abs(y + b.h / 2 - trw); if (dd < bd) { bd = dd; best = [x, y]; }
      }
      if (!best) return false;
      for (dy = 0; dy < b.h; dy++) for (dx = 0; dx < b.w; dx++) used[K(best[0] + dx, best[1] + dy)] = 1;
      map[K(best[0], best[1])] = b.id; boxes.push({ x: best[0], y: best[1], w: b.w, h: b.h }); return true;
    };
    var segOrder = function () { var idx = cs.map(function (_, i) { return i; }), mid = (cs.length - 1) / 2; return idx.sort(function (a, b) { return Math.abs(a - mid) - Math.abs(b - mid) || a - b; }); };
    var bands = band.r2 != null ? [[band.r0, band.r1], [band.r2, band.r3]] : [[band.r0, band.r1]];
    var segsWithoutBig = [];
    bands.forEach(function (bd, bi) {
      segOrder().forEach(function (si) {
        var sg = cs[si], placed = false;
        if (bigsLeft > 0) { placed = tryPlace(B[B.length - bigsLeft], sg[0], sg[1], bd[0], bd[1], (sg[0] + sg[1] + 1) / 2, bi ? bd[0] + 1 : bd[1] - 0); if (placed) bigsLeft--; }
        if (!placed) segsWithoutBig.push({ c0: sg[0], c1: sg[1], r0: bd[0], r1: bd[1] });
      });
    });
    // lối dẫn từ cửa mỗi công trình tới lối đi gần nhất (rộng 1 ô)
    boxes.forEach(function (b) {
      var sides = [[Math.floor(b.w / 2), b.h, 0, 1], [Math.floor(b.w / 2), -1, 0, -1], [-1, Math.floor(b.h / 2), -1, 0], [b.w, Math.floor(b.h / 2), 1, 0]], best = null;
      sides.forEach(function (sd) {
        var x = b.x + sd[0], y = b.y + sd[1], n = 0, okp = false, steps = [];
        while (n < 8 && x >= 0 && y >= 0 && x < cols && y < rows) { if (isPath(x, y)) { okp = true; break; } if (!free(x, y)) break; steps.push([x, y]); x += sd[2]; y += sd[3]; n++; }
        if (okp && (!best || steps.length < best.length)) best = steps;
      });
      if (best) best.forEach(function (q) { put(q[0], q[1], PATH); });
    });
    // ghế & đèn quanh công trình: ghế hai bên cửa, đèn ở góc trên
    boxes.forEach(function (b, bi) {
      var my = b.y + Math.floor(b.h / 2);
      put(b.x - 1, my, BENCH); put(b.x + b.w, my, BENCH);
      if (b.h >= 2) { put(b.x - 1, b.y, LAMP); put(b.x + b.w, b.y, LAMP); }
      put(b.x - 1, b.y + b.h - 1, dc(bi + off)); put(b.x + b.w, b.y + b.h - 1, dc(bi + off + 1));
    });
    // đoạn trung tâm chưa có công trình: bồn hoa nhỏ có đồ trang trí ở giữa
    var fieldN = 0;
    var bed = function (c0, c1, r0, r1, idx, accent) { var x, y, w = c1 - c0 + 1, h = r1 - r0 + 1; if (w < 1 || h < 1) return; for (y = r0; y <= r1; y++) for (x = c0; x <= c1; x++) put(x, y, fl(idx)); if (accent && w >= 3 && h >= 3 && nD) put(Math.floor((c0 + c1) / 2), Math.floor((r0 + r1) / 2), dc(idx + off)); };
    var grove = function (c0, c1, r0, r1, idx) { var x, y; for (y = r0; y <= r1; y++) for (x = c0; x <= c1; x++) { if ((x - c0) % 2 === 0 && (y - r0) % 2 === 0 && nT) put(x, y, tr(idx)); else put(x, y, fl(idx)); } };
    segsWithoutBig.forEach(function (sgm, i) { bed(sgm.c0, sgm.c1, sgm.r0, sgm.r1, i + 2 + off, true); });
    // đèn dọc đường chính (trước khi đổ hoa) cho dễ nhìn
    for (c = 0; c < cols; c++) hl.forEach(function (hr) { if ((c + off) % 5 === 0) { put(c, hr - 1, LAMP); } });
    // ruộng: mỗi ô phòng một loại hoa (hoặc lùm cây xen kẽ)
    var bandRows = {}; bands.forEach(function (bd) { var y; for (y = bd[0]; y <= bd[1]; y++) bandRows[y] = 1; });
    var kind = function (ci, ri, cw, rh) {
      if (arch === 'orchard') return 'grove';
      if (arch === 'mosaic' || arch === 'gallery') return (ci * 2 + ri * 3 + off) % 7 === 0 ? 'grove' : 'bed';
      if (arch === 'plaza') return (ci + ri) % 2 === 0 ? 'grove' : 'bed';
      if (arch === 'courtyard') return ((ci === 0 || ci === cw - 1) && (ri === 0 || ri === rh - 1)) ? 'grove' : 'bed';
      if (arch === 'meadow') return ri % 2 === 0 && ci % 2 === 1 ? 'grove' : 'bed';
      if (arch === 'street') return (ci + ri) % 3 === 2 ? 'grove' : 'bed';
      return (ri === 0 && (ci === 0 || ci === cw - 1) && rh > 1) ? 'grove' : 'bed';
    };
    rs.forEach(function (rg, ri) {
      var isBand = bandRows[rg[0]] && bandRows[rg[1]];
      cs.forEach(function (cg, ci) {
        if (isBand) return;
        var mi = Math.min(ci, cs.length - 1 - ci), idx = (arch === 'formal' ? mi : ci) + 2 * ri + off;      // đối xứng cho vườn cung đình
        if (arch === 'terraces' || arch === 'waterfront') {   // các dải ngang: hai nửa trái/phải cùng một loại hoa, mỗi dải một màu
          var alt = arch === 'waterfront' && ri % 2 === 1 && nT;
          if (alt) grove(cg[0], cg[1], rg[0], rg[1], ri + off); else bed(cg[0], cg[1], rg[0], rg[1], ri + off, false);
        } else if (kind(ci, ri, cs.length, rs.length) === 'grove') grove(cg[0], cg[1], rg[0], rg[1], idx + 1);
        else bed(cg[0], cg[1], rg[0], rg[1], idx, (rg[1] - rg[0] + 1) >= 3 && (cg[1] - cg[0] + 1) >= 4);
      });
    });
    // chừa ô trống nào còn lại trong ruộng chưa lấp (ô sát tường/phong cảnh) bằng hoa cùng loại với ô lân cận
    for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) if (free(c, r) && !bandRows[r] && !(vl.indexOf(c) >= 0) && hl.indexOf(r) < 0) { var nb = map[K(c - 1, r)] || map[K(c + 1, r)] || map[K(c, r - 1)] || map[K(c, r + 1)]; var nit = nb && G.BY[nb]; if (nit && nit.kind === 'plant') map[K(c, r)] = nb; }
    // bốn góc đất: cây
    [[0, 0], [cols - 1, 0], [0, rows - 1], [cols - 1, rows - 1]].forEach(function (q, j) { if (nT && cols >= 9) { var cell = map[K(q[0], q[1])], ci0 = cell && G.BY[cell]; if (!cell || (ci0 && ci0.kind === 'plant')) { delete map[K(q[0], q[1])]; put(q[0], q[1], tr(j + off)); } } });
    var cells = []; Object.keys(map).map(Number).sort(function (a, b) { return a - b; }).forEach(function (key) { var r2 = Math.floor(key / cols), c2 = key % cols; cells.push({ i: gi(c2, r2), k: map[key], c: c2, r: r2 }); });
    return { id: arch, idx: styleIdx | 0, icon: info.icon, name: info.name, desc: info.desc, zone: zid, cols: cols, rows: rows, cells: cells, arch: arch };
  }

  function all(G, zid, landLv, lvl) { return [0, 1, 2, 3, 4].map(function (j) { return make(G, zid, landLv, lvl, j); }).filter(function (b) { return b && b.cells.length; }); }
  // giá tham khảo (chưa trừ đồ có sẵn trong giỏ)
  function listPrice(G, bp) { var tot = 0, n = {}; bp.cells.forEach(function (x) { var it = G.BY[x.k]; if (it) { tot += it.cost || 0; n[x.k] = (n[x.k] | 0) + 1; } }); return { cost: tot, counts: n }; }

  var API = { STYLES: STYLES, ARCH: ARCH, SIG: SIG, make: make, all: all, pools: pools, listPrice: listPrice, archFor: archFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenBlueprints = API;
})(typeof window !== 'undefined' ? window : this);
