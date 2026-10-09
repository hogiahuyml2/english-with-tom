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
    fantasy: { icon: '✨', name: 'Vòng tròn huyền ảo', desc: 'Các vòng đồng tâm: điểm nhấn ở lõi, vòng hoa, vòng lối đi, vòng cây — cắt bởi bốn lối toả ra như hoa văn thần kỳ.' }
  };
  // kiểu bố cục đặc trưng (Mẫu 1) của từng khu; Mẫu 2, 3 là hai kiểu gần gũi khác để người chơi chọn
  var SIG = {
    cottage: 'meadow', hill: 'terraces', river: 'waterfront', pond: 'courtyard', forest: 'meadow', palace: 'formal', winter: 'meadow', beach: 'waterfront', magic: 'fantasy', farm: 'terraces',
    sakura: 'courtyard', autumn: 'meadow', mountain: 'terraces', desert: 'plaza', candy: 'fantasy', ocean: 'waterfront', sky: 'fantasy', space: 'fantasy', bamboo: 'courtyard', savanna: 'meadow',
    jungle: 'meadow', village: 'street', funfair: 'plaza', arctic: 'meadow', pirate: 'waterfront', dino: 'meadow', volcano: 'fantasy', cyber: 'street',
    vietnam: 'terraces', thailand: 'courtyard', japan: 'courtyard', china: 'formal', india: 'formal', indonesia: 'terraces', france: 'formal', italy: 'street', netherlands: 'terraces', uk: 'meadow', germany: 'street',
    usa: 'street', greece: 'street', sweden: 'meadow', switzerland: 'meadow', korea: 'courtyard', turkey: 'plaza', australia: 'meadow', canada: 'meadow', mexico: 'plaza', brazil: 'fantasy', egypt: 'formal',
    morocco: 'courtyard', spain: 'plaza', russia: 'plaza', ireland: 'meadow', norway: 'waterfront', peru: 'terraces', argentina: 'street', cuba: 'street', chile: 'waterfront', kenya: 'meadow',
    southafrica: 'waterfront', ethiopia: 'courtyard', madagascar: 'meadow'
  };
  var ALT = { formal: ['plaza', 'meadow'], plaza: ['formal', 'street'], courtyard: ['meadow', 'plaza'], terraces: ['meadow', 'street'], street: ['plaza', 'terraces'], meadow: ['courtyard', 'formal'], waterfront: ['street', 'meadow'], fantasy: ['plaza', 'meadow'] };
  var STYLES = [{ id: 'sig' }, { id: 'alt1' }, { id: 'alt2' }];
  function archFor(zid, idx) { var a = SIG[zid] || 'meadow'; return idx === 0 ? a : (ALT[a] || ['meadow', 'plaza'])[idx - 1]; }

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
    return { F: pick('plant', 5, 3), T: pick('tree', 4, 2), D: D.concat(cheapDeco).slice(0, 9), B: bigs.slice(0, 3), path: G.BY.path };
  }

  function makeOld(G, zid, landLv, lvl, styleIdx) {
    var z = G.ZBY[zid]; if (!z) return null;
    var d = G.landOf(landLv), cols = d.c, rows = d.r, P = pools(G, zid, lvl), arch = archFor(zid, styleIdx | 0), info = ARCH[arch];
    var seed = hash(zid + ':' + (styleIdx | 0)), F = P.F, T = P.T, D = P.D, B = P.B, nF = F.length, nT = T.length, nD = D.length;
    var gi = function (c, r) { return z.i * G.PER + r * G.MAXC + c; };
    var open = function (c, r) { return c >= 0 && r >= 0 && c < cols && r < rows && !G.isBlocked(gi(c, r)); };
    var map = {}, used = {}, K = function (c, r) { return r * cols + c; };
    var free = function (c, r) { return open(c, r) && map[K(c, r)] == null && !used[K(c, r)]; };
    var put = function (c, r, it) { if (it && free(c, r)) { map[K(c, r)] = it.id; return true; } return false; };
    var force = function (c, r, it) { if (it && open(c, r) && !used[K(c, r)]) { map[K(c, r)] = it.id; return true; } return false; };
    var fl = function (i) { return nF ? F[((i % nF) + nF) % nF] : null; }, tr = function (i) { return nT ? T[((i % nT) + nT) % nT] : null; }, dc = function (i) { return nD ? D[((i % nD) + nD) % nD] : null; };
    var PATH = P.path, mirror = (seed >> 3) % 2 === 1, off = seed % 5;
    var c, r;

    /* ── đặt công trình lớn gần điểm (tc,tr) trong vùng [c0..c1]×[r0..r1] ── */
    var bigBoxes = [];
    var placeBig = function (b, tc, tr0, c0, c1, r0, r1) {
      if (!b) return false; var best = null, bd = 1e9, x, y, dx, dy, ok2;
      for (y = r0; y <= r1 - b.h + 1; y++) for (x = c0; x <= c1 - b.w + 1; x++) {
        ok2 = true; for (dy = 0; dy < b.h && ok2; dy++) for (dx = 0; dx < b.w; dx++) if (!free(x + dx, y + dy)) { ok2 = false; break; }
        if (!ok2) continue; var dd = Math.abs(x + b.w / 2 - tc) + Math.abs(y + b.h / 2 - tr0); if (dd < bd) { bd = dd; best = [x, y]; }
      }
      if (!best) return false;
      for (dy = 0; dy < b.h; dy++) for (dx = 0; dx < b.w; dx++) used[K(best[0] + dx, best[1] + dy)] = 1;
      map[K(best[0], best[1])] = b.id; bigBoxes.push([best[0], best[1], b.w, b.h]); return true;
    };
    var bigIdx = 0, nextBig = function () { return B.length ? B[(bigIdx++) % B.length] : null; }, bigsLeft = B.length;
    var tryBig = function (tc, tr0, c0, c1, r0, r1) { if (bigsLeft <= 0) return false; var b = B[B.length - bigsLeft]; if (placeBig(b, tc, tr0, c0, c1, r0, r1)) { bigsLeft--; return true; } return false; };

    /* ── lối đi chia "phòng" ── */
    var nV = cols >= 17 ? 2 : cols >= 6 ? 1 : 0, nH = rows >= 12 ? 2 : rows >= 8 ? 1 : 0;
    var lines = function (n, len) { var a = [], k, v; for (k = 1; k <= n; k++) { v = Math.round(len * k / (n + 1)); if (a.indexOf(v) < 0) a.push(v); } return a; };
    var vl = lines(nV, cols), hl = lines(nH, rows);
    var isV = function (c0) { return vl.indexOf(c0) >= 0; }, isH = function (r0) { return hl.indexOf(r0) >= 0; };
    var spans = function (ls, len) { var a = [], s0 = 0, k; ls.concat([len]).forEach(function (e) { if (e - 1 >= s0) a.push([s0, e - 1]); s0 = e + 1; }); return a; };
    var cs = spans(vl, cols), rs = spans(hl, rows);
    if (mirror) cs = cs.slice().reverse();
    var room = function (ci, ri) { var a = cs[ci], b = rs[ri]; return a && b ? { c0: Math.min(a[0], a[1]), c1: Math.max(a[0], a[1]), r0: b[0], r1: b[1] } : null; };
    var eachCell = function (rm, fn) { var x, y; for (y = rm.r0; y <= rm.r1; y++) for (x = rm.c0; x <= rm.c1; x++) fn(x, y); };
    var drawPaths = function () { if (!PATH) return; for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) if (isV(c) || isH(r)) put(c, r, PATH); };

    /* ── vai trò của một phòng ── */
    var bed = function (rm, fi) { var w = rm.c1 - rm.c0 + 1, h = rm.r1 - rm.r0 + 1; eachCell(rm, function (x, y) { put(x, y, fl(fi)); }); if (w >= 5 && h >= 4 && nD) force(Math.floor((rm.c0 + rm.c1) / 2), Math.floor((rm.r0 + rm.r1) / 2), dc(fi)); };   // một luống = một loại hoa, giữa luống có một điểm nhấn
    var stripes = function (rm, fi) { eachCell(rm, function (x, y) { put(x, y, fl(fi + ((y - rm.r0) % 2))); }); };
    var grove = function (rm, ti) { eachCell(rm, function (x, y) { if ((x - rm.c0) % 2 === 0 && (y - rm.r0) % 2 === 0 && nT) put(x, y, tr(ti + ((x - rm.c0) >> 2))); else put(x, y, fl(ti)); }); };   // lùm cây thưa đều trên nền một loại hoa
    var orchard = function (rm, ti) { eachCell(rm, function (x, y) { var rr = y - rm.r0, cc = x - rm.c0; if (rr % 2 === 0 && cc % 2 === (rr >> 1) % 2 && nT) put(x, y, tr(ti)); else put(x, y, fl(ti + 1)); }); };   // vườn cây so le
    var meadowRoom = function (rm, sd) { eachCell(rm, function (x, y) { var px = Math.floor((x - rm.c0) / 3), py = Math.floor((y - rm.r0) / 3), cl = px + py * 2 + sd; if ((x - rm.c0) % 3 === 1 && (y - rm.r0) % 3 === 1 && nT) put(x, y, tr(cl)); else put(x, y, fl(cl)); }); };   // các mảng 3×3, mỗi mảng một loại hoa, giữa mảng một cây
    var plaza = function (rm, big) {
      var w = rm.c1 - rm.c0 + 1, h = rm.r1 - rm.r0 + 1, cc = (rm.c0 + rm.c1) / 2, cr = (rm.r0 + rm.r1) / 2, mx = Math.floor(cc), my = Math.floor(cr);
      var inner = (w >= 5 && h >= 4) ? { c0: rm.c0 + 1, c1: rm.c1 - 1, r0: rm.r0 + 1, r1: rm.r1 - 1 } : null;
      var done = big ? tryBig(cc, cr, inner ? inner.c0 : rm.c0, inner ? inner.c1 : rm.c1, inner ? inner.r0 : rm.r0, inner ? inner.r1 : rm.r1) : false;
      if (inner) {
        if (PATH) eachCell(inner, function (x, y) { put(x, y, PATH); });
        eachCell(rm, function (x, y) { var ring = x === rm.c0 || x === rm.c1 || y === rm.r0 || y === rm.r1; if (ring) { var corner = (x === rm.c0 || x === rm.c1) && (y === rm.r0 || y === rm.r1); put(x, y, corner ? tr(x + y) : fl(off)); } });
        if (!done) force(mx, my, dc(off)); [[inner.c0, inner.r0], [inner.c1, inner.r0], [inner.c0, inner.r1], [inner.c1, inner.r1]].forEach(function (q, j) { if (inner.c1 - inner.c0 >= 2) force(q[0], q[1], dc(off + 1 + j % 2)); });
      } else {
        if (PATH) { eachCell(rm, function (x, y) { if (x === mx || y === my) put(x, y, PATH); }); }
        if (!done) force(mx, my, dc(off)); eachCell(rm, function (x, y) { put(x, y, (x + y) % 2 ? fl(off) : tr(off + x)); });
      }
    };
    // quảng trường nhỏ ở ngã tư các lối đi: nền lát đá, điểm nhấn ở giữa, đồ trang trí ở góc, chậu cây quanh rìa
    var cx0 = vl.length ? vl[Math.floor((vl.length - 1) / 2)] : Math.floor(cols / 2), cy0 = hl.length ? hl[Math.floor((hl.length - 1) / 2)] : Math.floor(rows / 2);
    var cplaza = function (rad, big, cxx, cyy) {
      cxx = cxx == null ? cx0 : cxx; cyy = cyy == null ? cy0 : cyy;
      var done = big ? (tryBig(cxx, cyy, cxx - rad, cxx + rad, cyy - rad, cyy + rad) || tryBig(cxx, cyy, cxx - rad - 2, cxx + rad + 2, cyy - rad - 2, cyy + rad + 2)) : false, x, y;
      if (big && cols >= 11) { tryBig(cxx - rad - 4, cyy, Math.max(0, cxx - rad - 7), cxx - rad - 2, Math.max(0, cyy - 3), cyy + 3); tryBig(cxx + rad + 4, cyy, cxx + rad + 2, Math.min(cols - 1, cxx + rad + 7), Math.max(0, cyy - 3), cyy + 3); }   // hai công trình hai bên quảng trường
      if (PATH) for (y = cyy - rad; y <= cyy + rad; y++) for (x = cxx - rad; x <= cxx + rad; x++) put(x, y, PATH);
      if (PATH && bigBoxes.length > 1) {   // sân lát đá chung cho cả dãy công trình ở giữa
        var bx0 = 99, by0 = 99, bx1 = -1, by1 = -1; bigBoxes.forEach(function (q) { bx0 = Math.min(bx0, q[0]); by0 = Math.min(by0, q[1]); bx1 = Math.max(bx1, q[0] + q[2] - 1); by1 = Math.max(by1, q[1] + q[3] - 1); });
        for (y = by0 - 1; y <= by1 + 1; y++) for (x = bx0 - 1; x <= bx1 + 1; x++) put(x, y, PATH);
        [[bx0 - 1, by0 - 1], [bx1 + 1, by0 - 1], [bx0 - 1, by1 + 1], [bx1 + 1, by1 + 1]].forEach(function (q, j) { force(q[0], q[1], dc(off + j)); });
      }
      if (!done) force(cxx, cyy, dc(off));
      [[-rad, -rad], [rad, -rad], [-rad, rad], [rad, rad]].forEach(function (q, j) { force(cxx + q[0], cyy + q[1], rad >= 2 ? dc(off + 1 + (j % 2)) : (j % 2 ? tr(j) : fl(off + j))); });
      if (rad >= 2) [[0, -rad - 1], [0, rad + 1], [-rad - 1, 0], [rad + 1, 0]].forEach(function (q, j) { put(cxx + q[0], cyy + q[1], j % 2 ? tr(off + j) : fl(off + 2 + j)); });
    };
    var perimeter = function () { var hf = fl(off + 2); for (c = 0; c < cols; c++) for (r = 0; r < rows; r++) { if ((c === 0 || r === 0 || c === cols - 1 || r === rows - 1) && free(c, r)) { if (nT && (c + r + off) % 4 === 0) put(c, r, tr(c + r)); else put(c, r, hf); } } };   // hàng rào hoa một loại, xen cây

    var cw = cs.length, rh = rs.length, midC = (cw - 1) / 2, midR = (rh - 1) / 2;
    /* ── các kiểu bố cục ── */
    if (arch === 'formal') {
      cplaza(cols >= 11 && rows >= 8 ? 2 : 1, true); drawPaths();
      for (var ri = 0; ri < rh; ri++) for (var ci = 0; ci < cw; ci++) { var rm = room(ci, ri); if (!rm) continue; var dist = Math.abs(ci - midC);
        if (ri === 0 && rh > 1 && dist < 1) orchard(rm, ci + off); else if (ri === 0 && rh > 1) grove(rm, ci + off); else bed(rm, Math.round(dist) + ri + off); }
      if (rh === 1) { /* đất thấp: các phòng là luống hoa đối xứng hai bên trục */ }
    } else if (arch === 'plaza') {
      cplaza(cols >= 11 && rows >= 8 ? 2 : 1, true); drawPaths();
      for (var ri2 = 0; ri2 < rh; ri2++) for (var ci2 = 0; ci2 < cw; ci2++) { var rm2 = room(ci2, ri2); if (!rm2) continue; if ((ci2 + ri2) % 2 === 0) grove(rm2, ci2 + ri2 + off); else bed(rm2, ci2 + ri2 * 2 + off); }
    } else if (arch === 'courtyard') {
      cplaza(1, bigsLeft > 0); drawPaths();
      for (var ri3 = 0; ri3 < rh; ri3++) for (var ci3 = 0; ci3 < cw; ci3++) { var rm3 = room(ci3, ri3); if (!rm3) continue; var cor = (ci3 === 0 || ci3 === cw - 1) && (ri3 === 0 || ri3 === rh - 1);
        if (cor || cw === 2) grove(rm3, ci3 + ri3 + off); else meadowRoom(rm3, ci3 + ri3 + off); }
    } else if (arch === 'terraces') {
      // dải ngang: 2 hàng hoa + 1 hàng lối đi bậc thang, mỗi dải một màu
      for (var q0 = 0; q0 < Math.min(2, B.length) && bigsLeft > 0; q0++) tryBig(q0 ? cols - 3 : 2, 1, 0, cols - 1, 0, Math.min(rows - 1, 4));
      var band = 0; r = 0;
      while (r < rows) { for (var rr = 0; rr < 2 && r < rows; rr++, r++) for (c = 0; c < cols; c++) { if (c === Math.floor(cols / 2) && PATH) { put(c, r, PATH); } else if ((c === 0 || c === cols - 1) && rr === 0 && nT) put(c, r, tr(band + c)); else put(c, r, fl(band + off + (rr === 0 && cols > 8 && (c % 6 === 5) ? 1 : 0))); }
        if (r < rows) { for (c = 0; c < cols; c++) put(c, r, PATH); r++; } band++; }
    } else if (arch === 'street') {
      var pr = Math.floor(rows / 2), pcx = Math.floor(cols / 2);
      if (PATH) { for (c = 0; c < cols; c++) put(c, pr, PATH); for (r = 0; r < rows; r++) put(pcx, r, PATH); }
      // quảng trường ở ngã tư
      if (cols >= 7) { var cr0 = { c0: Math.max(0, pcx - 1), c1: Math.min(cols - 1, pcx + 1), r0: Math.max(0, pr - 1), r1: Math.min(rows - 1, pr + 1) }; plaza(cr0, false); }
      // công trình hai bên phố
      var side = 0; for (var cx = 0; cx < cols && bigsLeft > 0; cx += 4) { var up = side % 2 === 0; tryBig(cx + 1, up ? pr - 2 : pr + 2, Math.max(0, cx), Math.min(cols - 1, cx + 3), up ? 0 : pr + 1, up ? pr - 1 : rows - 1); side++; }
      // hoa viền sân + đèn dọc phố
      var hfs = fl(off);
      for (c = 0; c < cols; c++) for (var dd2 = -1; dd2 <= 1; dd2 += 2) { var rr1 = pr + dd2; if (rr1 >= 0 && rr1 < rows && free(c, rr1)) { if (nD && (c + off) % 3 === 0) put(c, rr1, dc(c >> 1)); else put(c, rr1, hfs); } }
      var qUp = pr - 2, qDn = pr + 2, qL = pcx - 1, qR = pcx + 1;
      [[0, qL, 0, qUp, 0], [qR, cols - 1, 0, qUp, 1], [0, qL, qDn, rows - 1, 1], [qR, cols - 1, qDn, rows - 1, 0]].forEach(function (q, qi) {
        if (q[1] < q[0] || q[3] < q[2]) return; var rmq = { c0: q[0], c1: q[1], r0: q[2], r1: q[3] };
        if (q[4]) bed(rmq, qi + off); else grove(rmq, qi + off + 1);
      });
    } else if (arch === 'waterfront') {
      var prom = rows - 2 >= 2 ? rows - 2 : rows - 1;
      for (var q1 = 0; q1 < Math.min(2, B.length) && bigsLeft > 0; q1++) tryBig(q1 ? cols - 2 : 2, rows / 2, 0, cols - 1, 0, Math.max(0, prom - 1));
      if (PATH) for (c = 0; c < cols; c++) put(c, prom, PATH);
      for (c = 0; c < cols; c++) { if (prom + 1 < rows) { if (c % 3 === 1 && nD) put(c, prom + 1, dc(c)); else put(c, prom + 1, fl(c + off)); } }
      var bandH = 2, rr0 = prom - 1, bn = 0;
      while (rr0 >= 1) { for (var k2 = 0; k2 < bandH && rr0 >= 1; k2++, rr0--) for (c = 0; c < cols; c++) put(c, rr0, k2 === 1 && rr0 <= 2 ? (nT ? tr(c + bn) : fl(c)) : fl(bn + off + (c > cols / 2 && cols > 9 ? 1 : 0))); bn++; }
      for (c = 0; c < cols; c++) put(c, 0, tr(c));
      if (PATH && cols >= 7) for (r = 0; r < prom; r++) put(Math.floor(cols / 2), r, PATH);
    } else if (arch === 'fantasy') {
      var cxx = (cols - 1) / 2, cyy = (rows - 1) / 2, cc0 = Math.round(cxx), cr1 = Math.round(cyy);
      if (!tryBig(cc0 + .5, cr1 + .5, Math.max(0, cc0 - 2), Math.min(cols - 1, cc0 + 2), Math.max(0, cr1 - 2), Math.min(rows - 1, cr1 + 2))) force(cc0, cr1, dc(off));
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
        if (!free(c, r)) continue; var dd = Math.max(Math.abs(c - cxx), Math.abs(r - cyy) * (cols / rows > 1.6 ? 1.6 : 1.2)), ring = Math.floor(dd), ax = Math.abs(c - cc0) <= 0 || Math.abs(r - cr1) <= 0;
        if (ax && ring >= 1 && PATH) put(c, r, PATH); else if (ring % 3 === 1) put(c, r, fl(ring + (c + r) % 2 + off)); else if (ring % 3 === 2) put(c, r, PATH && ring % 2 === 0 ? PATH : tr(ring)); else if (ring % 3 === 0 && ring > 0) put(c, r, nT ? tr(ring + c) : fl(ring));
      }
      [[1, 1], [cols - 2, 1], [1, rows - 2], [cols - 2, rows - 2]].forEach(function (q, j) { if (nD) force(q[0], q[1], dc(j + off)); });
    } else {   // meadow — đồng cỏ tự nhiên: các mảng hoa/cây liền khối theo "hạt giống" + lối đi uốn
      var seeds = [], ns = Math.max(4, Math.min(12, Math.round(cols * rows / 14))), s0;
      for (s0 = 0; s0 < ns; s0++) { var h1 = hash(zid + ':m' + s0 + ':' + styleIdx); seeds.push({ c: h1 % cols, r: (h1 >> 8) % rows, kind: s0 % 3 === 2 && nT ? 'T' : 'F', idx: s0 }); }
      for (var q2 = 0; q2 < 3 && bigsLeft > 0; q2++) { var sdd = seeds[(q2 * 3 + 1) % seeds.length]; tryBig(sdd.c, sdd.r, 0, cols - 1, 0, rows - 1); }
      // lối uốn: cột đi qua giữa, lệch nhẹ theo hàng
      var pathCells = {}; if (PATH) { var pcx2 = Math.floor(cols * (mirror ? .62 : .38)); for (r = 0; r < rows; r++) { var shift = Math.round(Math.sin(r * .9 + (seed % 7)) * 1.2); var px = Math.max(0, Math.min(cols - 1, pcx2 + shift)); pathCells[K(px, r)] = 1; if (cols >= 10 && r % 2 === 0) pathCells[K(Math.min(cols - 1, px + 1), r)] = 1; } }
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
        if (!free(c, r)) continue; if (pathCells[K(c, r)]) { put(c, r, PATH); continue; }
        var bs = null, bdv = 1e9; seeds.forEach(function (sd) { var dv = (sd.c - c) * (sd.c - c) + (sd.r - r) * (sd.r - r); if (dv < bdv) { bdv = dv; bs = sd; } });
        if (bs.kind === 'T') { if ((c + r) % 2 === 0) put(c, r, tr(bs.idx)); else if (bdv > 1) put(c, r, fl(bs.idx)); } else put(c, r, fl(bs.idx + (bdv > 6 ? 1 : 0)));
      }
      for (var q3 = 0; q3 < Math.min(6, nD * 2); q3++) { var h2 = hash(zid + ':d' + q3); force(h2 % cols, (h2 >> 9) % rows, dc(q3)); }
    }
    // công trình lớn chưa đặt (đất rộng): quảng trường nhỏ ở góc
    // viền cây + đồ trang trí điểm nhấn cuối cùng
    if (arch !== 'terraces' && arch !== 'waterfront' && arch !== 'fantasy') perimeter();
    // xoá ô bị công trình lớn chiếm chỗ (giữ ô góc trên-trái)
    var cells = []; Object.keys(map).map(Number).sort(function (a, b) { return a - b; }).forEach(function (key) { var r2 = Math.floor(key / cols), c2 = key % cols; cells.push({ i: gi(c2, r2), k: map[key], c: c2, r: r2 }); });
    // loại món nằm trong vùng chiếm của công trình lớn (do đặt sau)
    var bigCells = {}; cells.forEach(function (x) { var it = G.BY[x.k]; if (it && it.kind === 'big') for (var yy = 0; yy < it.h; yy++) for (var xx = 0; xx < it.w; xx++) if (xx || yy) bigCells[K(x.c + xx, x.r + yy)] = 1; });
    cells = cells.filter(function (x) { return !bigCells[K(x.c, x.r)]; });
    return { id: arch, idx: styleIdx | 0, icon: info.icon, name: info.name, desc: info.desc, zone: zid, cols: cols, rows: rows, cells: cells, arch: arch };
  }


  /* ═════════ BỐ CỤC MỚI (gọn, thống nhất): lối đi RỘNG 1 Ô, mỗi khu = một loại hoa, trung tâm là dãy công trình có ghế/đèn, lối đi dẫn tới cửa từng công trình ═════════ */
  function make(G, zid, landLv, lvl, styleIdx) {
    var z = G.ZBY[zid]; if (!z) return null;
    var arch = archFor(zid, styleIdx | 0); if (arch === 'fantasy') return makeOld(G, zid, landLv, lvl, styleIdx);
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
    } else {                               // formal · plaza · courtyard · meadow: dải công trình ở giữa, hai hàng ruộng trên/dưới
      vl = cols >= 13 ? even(2, cols) : cols >= 6 ? [Math.floor(cols / 2)] : [];
      if (rows >= 11) { var a0 = Math.floor((rows - 5) / 2); hl = [a0, a0 + 4]; band = { r0: a0 + 1, r1: a0 + 3 }; }
      else if (rows >= 8) { hl = [Math.floor(rows / 2)]; band = { r0: 0, r1: hl[0] - 1 }; }
      else band = { r0: 0, r1: rows - 1 };
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

  function all(G, zid, landLv, lvl) { return [0, 1, 2].map(function (j) { return make(G, zid, landLv, lvl, j); }).filter(function (b) { return b && b.cells.length; }); }
  // giá tham khảo (chưa trừ đồ có sẵn trong giỏ)
  function listPrice(G, bp) { var tot = 0, n = {}; bp.cells.forEach(function (x) { var it = G.BY[x.k]; if (it) { tot += it.cost || 0; n[x.k] = (n[x.k] | 0) + 1; } }); return { cost: tot, counts: n }; }

  var API = { STYLES: STYLES, ARCH: ARCH, SIG: SIG, make: make, all: all, pools: pools, listPrice: listPrice, archFor: archFor };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenBlueprints = API;
})(typeof window !== 'undefined' ? window : this);
