/* EWT Garden — KHO ĐẶC SẢN TỪNG KHU: mỗi khu có bộ 25 món riêng (5 hoa, 5 cây, 5 trang trí, 5 công trình, 5 thú cưng).
   Lõi: nơi các tệp dữ liệu (garden-cat-*.js) đăng ký danh sách, và hàm build() biến chúng thành món trong cửa hàng
   (gán khu `z` cho các món đã có, thêm món mới, tính giá theo độ tinh xảo: càng phức tạp càng đắt). Dùng chung cho máy chủ và trình duyệt.
   Định dạng mỗi khu: { map: { f: [id có sẵn], t: [], d: [], b: [], p: [] },
     f: [[tên, mẫu hoa, màu 1, màu 2, độ tinh xảo 1–5, tuỳ chọn]], t: [[tên, mẫu cây, màu 1, màu 2, tinh xảo, tuỳ chọn]],
     d: [[tên, đế, biểu tượng, màu 1, màu 2, tinh xảo]], b: [[tên, rộng, cao, kiểu nhà, màu tường, màu mái, màu nhấn, chi tiết, tinh xảo]],
     p: [[tên, mẫu thú, màu 1, màu 2, phụ kiện, tinh xảo]] } */
(function (root) {
  'use strict';
  var Z = {}, SPEC = {};   // Z: khu → định nghĩa; SPEC: id món → [loại, spec]
  var TIER = { plant: [0.6, 0.9, 1.3, 1.8, 2.5], tree: [1.2, 1.8, 2.6, 3.6, 5], deco: [0.7, 1.1, 1.7, 2.5, 3.6], big: [3, 4.5, 6.5, 9, 13], pet: [2, 3, 4.5, 6.5, 9] };
  var LV = { plant: [0, 0, 1, 1, 2], tree: [0, 0, 1, 1, 2], deco: [0, 0, 1, 1, 2], big: [0, 1, 1, 2, 2], pet: [0, 0, 1, 1, 2] };
  var r10 = function (n) { return Math.max(10, Math.round(n / 10) * 10); }, r50 = function (n) { return Math.max(100, Math.round(n / 50) * 50); };
  function add(zid, def) { Z[zid] = def; }
  function cx(n) { n = Math.round(n) || 1; return Math.max(1, Math.min(5, n)); }
  // Biến định nghĩa của từng khu thành món: gán z cho món đã có, thêm món mới vào ctx.items / ctx.pets
  function build(ctx) {
    var byId = {}; ctx.items.forEach(function (i) { byId[i.id] = i; }); var pby = {}; ctx.pets.forEach(function (p) { pby[p.id] = p; });
    ctx.zones.forEach(function (z) {
      var d = Z[z.id]; if (!d) return;
      var L = z.lvl, unit = 30 + L * 22, m = d.map || {};
      ['f', 't', 'd', 'b'].forEach(function (k) { (m[k] || []).forEach(function (id) { if (byId[id]) byId[id].z = z.id; }); });
      (m.p || []).forEach(function (id) { if (pby[id]) pby[id].z = z.id; });
      (d.f || []).forEach(function (s, i) { var t = cx(s[4]), id = z.id + '_f' + (i + 1); SPEC[id] = ['f', s];
        ctx.items.push({ id: id, name: s[0], kind: 'plant', cost: r10(unit * TIER.plant[t - 1]), lvl: Math.min(14, L + LV.plant[t - 1]), grow: 100 + L * 14 + t * 30, y: Math.round(unit * TIER.plant[t - 1] * 0.15), b: 2 + t + Math.floor(L / 3), c: s[2], c2: s[3], z: z.id, cx: t }); });
      (d.t || []).forEach(function (s, i) { var t = cx(s[4]), id = z.id + '_t' + (i + 1); SPEC[id] = ['t', s];
        ctx.items.push({ id: id, name: s[0], kind: 'tree', cost: r10(unit * TIER.tree[t - 1]), lvl: Math.min(14, L + LV.tree[t - 1]), grow: 240 + L * 20 + t * 60, y: Math.round(unit * TIER.tree[t - 1] * 0.13), b: 6 + t * 3 + Math.floor(L / 2), c: s[2], c2: s[3], z: z.id, cx: t }); });
      (d.d || []).forEach(function (s, i) { var t = cx(s[5]), id = z.id + '_d' + (i + 1); SPEC[id] = ['d', s];
        ctx.items.push({ id: id, name: s[0], kind: 'deco', cost: r10(unit * TIER.deco[t - 1]), lvl: Math.min(14, L + LV.deco[t - 1]), b: 3 + t * 3 + Math.floor(L / 2), z: z.id, cx: t }); });
      (d.b || []).forEach(function (s, i) { var t = cx(s[8]), id = z.id + '_b' + (i + 1), area = s[1] * s[2]; SPEC[id] = ['b', s];
        ctx.items.push({ id: id, name: s[0], kind: 'big', w: s[1], h: s[2], cost: r50(unit * TIER.big[t - 1] * Math.pow(area / 4, 0.6)), lvl: Math.min(14, L + LV.big[t - 1]), b: 16 + t * 14 + L * 3 + area * 2, z: z.id, cx: t }); });
      (d.p || []).forEach(function (s, i) { var t = cx(s[5]), id = z.id + '_p' + (i + 1); SPEC[id] = ['p', s];
        ctx.pets.push({ id: id, name: s[0], cost: r10(unit * TIER.pet[t - 1]), lvl: Math.min(14, L + LV.pet[t - 1]), z: z.id, cx: t }); });
    });
  }
  function eachSpec(fn) { Object.keys(SPEC).forEach(function (id) { fn(id, SPEC[id][0], SPEC[id][1]); }); }
  var API = { Z: Z, SPEC: SPEC, add: add, build: build, eachSpec: eachSpec };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenCatalog = API;
})(typeof window !== 'undefined' ? window : this);
