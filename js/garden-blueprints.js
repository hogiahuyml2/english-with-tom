/* EWT Garden — GỢI Ý XÂY VƯỜN: 3 bản thiết kế mẫu cho từng khu, sinh tự động từ danh mục của khu + cấp vườn + cỡ đất hiện có.
   Dùng chung cho trình duyệt (xem trước) và máy chủ (tính giá & dựng thật) nên hai bên luôn cho CÙNG một kết quả.
   Mỗi mẫu = danh sách { i: chỉ số ô, k: id món }; công trình lớn chỉ ghi ở ô góc trên-trái.
   Quy tắc thiết kế: đối xứng quanh lối đi, nhóm màu theo khối 2×2, cây ở viền, đồ trang trí ở giao lộ — chỉ dùng món mở khoá ở cấp hiện tại và đúng khu. */
(function (root) {
  'use strict';
  var STYLES = [
    { id: 'bloom', icon: '🌸', name: 'Vườn hoa rực rỡ', desc: 'Lối đi chữ thập, các luống hoa theo khối màu 2×2, cây ở viền và đèn/ghế ở giao lộ. Tiết kiệm nhất.' },
    { id: 'park', icon: '🌳', name: 'Công viên xanh mát', desc: 'Cây xanh xen hoa theo hàng chéo, nhiều bóng mát, ghế nghỉ dọc lối đi. Cân đối giá và vẻ đẹp.' },
    { id: 'street', icon: '🏛️', name: 'Phố văn hoá', desc: 'Công trình đặc trưng của khu làm điểm nhấn, đồ trang trí quanh sân và hoa dọc lối vào. Hoành tráng nhất.' }
  ];

  function pools(G, zid, lvl) {
    var ok = function (it) { return it.lvl <= lvl && !it.ev && !it.bd && (!it.z || it.z === zid); };
    var byCost = function (a, b) { return a.cost - b.cost || (a.id < b.id ? -1 : 1); };
    var zi = G.ITEMS.filter(function (i) { return i.z === zid && ok(i); }), gi = G.ITEMS.filter(function (i) { return !i.z && ok(i) && i.cost > 0; });
    var pick = function (kind, n, maxGeneric) {
      var a = zi.filter(function (i) { return i.kind === kind; }).sort(byCost), g = gi.filter(function (i) { return i.kind === kind; }).sort(byCost);
      if (a.length < n) a = a.concat(g.slice(0, Math.max(0, Math.min(maxGeneric || n, n - a.length))));
      return a.slice(0, n);
    };
    var bigs = zi.filter(function (i) { return i.kind === 'big' && i.w * i.h <= 6 && i.w * i.h >= 4; }).sort(byCost);
    if (!bigs.length) bigs = gi.filter(function (i) { return i.kind === 'big' && i.w * i.h <= 4; }).sort(byCost).slice(0, 1);
    var cheapDeco = ['bench', 'lamp', 'mailbox', 'birdhouse', 'picnic', 'gnome'].map(function (id) { return G.BY[id]; }).filter(function (i) { return i && ok(i); });
    var D = zi.filter(function (i) { return i.kind === 'deco'; }).sort(byCost);
    return { F: pick('plant', 5, 3), T: pick('tree', 4, 2), D: D.concat(cheapDeco).slice(0, 8), B: bigs.slice(0, 2), path: G.BY.path };
  }

  function make(G, zid, landLv, lvl, styleIdx) {
    var z = G.ZBY[zid]; if (!z) return null;
    var d = G.landOf(landLv), cols = d.c, rows = d.r, P = pools(G, zid, lvl), st = STYLES[styleIdx] || STYLES[0];
    var gi = function (c, r) { return z.i * G.PER + r * G.MAXC + c; };
    var open = function (c, r) { return c >= 0 && r >= 0 && c < cols && r < rows && !G.isBlocked(gi(c, r)); };
    var map = {}, put = function (c, r, it) { if (it && open(c, r) && map[r * cols + c] == null) { map[r * cols + c] = it.id; return true; } return false; };
    var F = P.F, T = P.T, D = P.D, nF = F.length, nT = T.length, nD = D.length;
    var pc = Math.floor(cols / 2), pr = Math.floor(rows / 2), c, r, k;
    var path = function (c0, r0) { put(c0, r0, P.path); };
    if (cols >= 7 && P.path) {
      for (r = 0; r < rows; r++) path(pc, r);
      if (styleIdx !== 2) for (c = 0; c < cols; c++) path(c, pr);
    }
    if (styleIdx === 0) {
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) { if (map[r * cols + c] != null || !open(c, r) || !nF) continue; if ((c * 7 + r * 3) % 11 === 4) continue; put(c, r, F[(Math.floor(c / 2) + Math.floor(r / 2)) % nF]); }
      if (nT) for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) { if ((c === 0 || c === cols - 1) && r % 3 === 1) { delete map[r * cols + c]; put(c, r, T[r % nT]); } else if ((r === 0 || r === rows - 1) && c % 4 === 2) { delete map[r * cols + c]; put(c, r, T[c % nT]); } }
      [[pc - 1, pr - 1], [pc + 1, pr - 1], [pc - 1, pr + 1], [pc + 1, pr + 1]].forEach(function (q, j) { if (nD && open(q[0], q[1])) { delete map[q[1] * cols + q[0]]; put(q[0], q[1], D[j % nD]); } });
    } else if (styleIdx === 1) {
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) {
        if (map[r * cols + c] != null || !open(c, r)) continue; var m = (c + r) % 3;
        if (m === 0 && nT) put(c, r, T[(c + Math.floor(r / 2)) % nT]); else if (m === 1 && nF) put(c, r, F[(r + c) % nF]);
      }
      var bi = 0; for (c = 1; c < cols; c += 3) { if (nD) { var rr = (pr + 1 < rows) ? pr + 1 : pr - 1; delete map[rr * cols + c]; if (put(c, rr, D[bi % nD])) bi++; } }
    } else {
      var used = {}, fp = function (c0, r0, w, h) { var a = []; for (var y = 0; y < h; y++) for (var x = 0; x < w; x++) { if (!open(c0 + x, r0 + y) || map[(r0 + y) * cols + c0 + x] != null || used[(r0 + y) * cols + c0 + x]) return null; a.push([c0 + x, r0 + y]); } return a; };
      var bigsPlaced = [];
      P.B.forEach(function (b, j) {
        var found = null, tryAt = function (c0, r0) { if (!found) { var f = fp(c0, r0, b.w, b.h); if (f) found = { c: c0, r: r0, f: f }; } };
        if (j === 0) { for (c = cols - b.w; c >= 0 && !found; c--) for (r = 0; r <= rows - b.h && !found; r++) tryAt(c, r); } else { for (c = 0; c <= cols - b.w && !found; c++) for (r = rows - b.h; r >= 0 && !found; r--) tryAt(c, r); }
        if (found) { found.f.forEach(function (q) { used[q[1] * cols + q[0]] = 1; }); map[found.r * cols + found.c] = b.id; bigsPlaced.push({ b: b, c: found.c, r: found.r }); }
      });
      var seq = 0; bigsPlaced.forEach(function (bp) { [[bp.c - 1, bp.r + bp.b.h], [bp.c + bp.b.w, bp.r + bp.b.h], [bp.c + bp.b.w, bp.r], [bp.c - 1, bp.r]].forEach(function (q) { if (nD && open(q[0], q[1]) && map[q[1] * cols + q[0]] == null && !used[q[1] * cols + q[0]]) { map[q[1] * cols + q[0]] = D[seq % nD].id; seq++; } }); });
      for (r = 0; r < rows; r++) for (c = 0; c < cols; c++) { var kx = r * cols + c; if (map[kx] != null || used[kx] || !open(c, r)) continue; if ((c + r) % 2 === 0 && nF) put(c, r, F[(c + r + Math.floor(c / 3)) % nF]); }
      if (nT) [[0, 0], [cols - 1, 0], [0, rows - 1], [cols - 1, rows - 1]].forEach(function (q, j) { if (open(q[0], q[1]) && !used[q[1] * cols + q[0]]) { delete map[q[1] * cols + q[0]]; put(q[0], q[1], T[j % nT]); } });
    }
    var cells = []; Object.keys(map).sort(function (a, b) { return a - b; }).forEach(function (key) { var r2 = Math.floor(key / cols), c2 = key % cols; cells.push({ i: gi(c2, r2), k: map[key], c: c2, r: r2 }); });
    return { id: st.id, idx: styleIdx, icon: st.icon, name: st.name, desc: st.desc, zone: zid, cols: cols, rows: rows, cells: cells };
  }

  function all(G, zid, landLv, lvl) { return [0, 1, 2].map(function (j) { return make(G, zid, landLv, lvl, j); }).filter(function (b) { return b && b.cells.length; }); }
  // giá tham khảo (chưa trừ đồ có sẵn trong giỏ)
  function listPrice(G, bp) { var tot = 0, n = {}; bp.cells.forEach(function (x) { var it = G.BY[x.k]; if (it) { tot += it.cost || 0; n[x.k] = (n[x.k] | 0) + 1; } }); return { cost: tot, counts: n }; }

  var API = { STYLES: STYLES, make: make, all: all, pools: pools, listPrice: listPrice };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenBlueprints = API;
})(typeof window !== 'undefined' ? window : this);
