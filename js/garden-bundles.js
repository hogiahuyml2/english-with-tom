/* EWT Garden — CÁC BỘ KÈM THEO trong cửa hàng của 8 khu quốc gia mới: bộ lễ hội, bộ ẩm thực (mua trọn bộ được giảm giá) và trang phục truyền thống cho thú cưng.
   Mỗi khu có 8 món trang trí riêng (4 lễ hội + 4 ẩm thực — chỉ đặt được ở khu đó) và 1 trang phục. Dùng chung cho máy chủ và trình duyệt. */
(function (root) {
  'use strict';
  var Z = { korea: 12, turkey: 12, australia: 13, canada: 13, mexico: 13, brazil: 14, egypt: 14, morocco: 14 };
  // [id, tên] — 4 món lễ hội rồi 4 món ẩm thực của từng khu
  var DEF = {
    korea: { fest: 'Bộ lễ hội Hàn Quốc', food: 'Bộ ẩm thực Hàn Quốc', of: ['of_korea', 'Mũ gat truyền thống', 'gat'],
      f: [['kr_lotus', 'Đèn hoa sen Yeondeung'], ['kr_kite', 'Diều Hàn Quốc'], ['kr_drum', 'Trống janggu'], ['kr_yut', 'Bàn chơi yut nori']],
      e: [['kr_bibim', 'Cơm trộn bibimbap'], ['kr_gimbap', 'Cơm cuộn gimbap'], ['kr_song', 'Bánh gạo songpyeon'], ['kr_tteok', 'Bánh gạo cay tteokbokki']] },
    turkey: { fest: 'Bộ lễ hội Thổ Nhĩ Kỳ', food: 'Bộ ẩm thực Thổ Nhĩ Kỳ', of: ['of_turkey', 'Mũ kavuk Ottoman', 'kavuk'],
      f: [['tr_tulipbed', 'Bồn hoa tulip'], ['tr_kilim', 'Thảm kilim'], ['tr_davul', 'Trống davul'], ['tr_iznik', 'Đĩa gốm İznik']],
      e: [['tr_baklava', 'Bánh baklava'], ['tr_kebab', 'Xiên thịt kebab'], ['tr_lokum', 'Kẹo lokum'], ['tr_simit', 'Bánh vòng simit']] },
    australia: { fest: 'Bộ lễ hội Úc', food: 'Bộ ẩm thực Úc', of: ['of_australia', 'Mũ Akubra', 'akubra'],
      f: [['au_surf', 'Giá ván lướt sóng'], ['au_dots', 'Tranh chấm thổ dân'], ['au_barbie', 'Lò nướng barbecue'], ['au_buoy', 'Phao cứu hộ bãi biển']],
      e: [['au_pie', 'Bánh nhân thịt meat pie'], ['au_lami', 'Bánh lamington'], ['au_pavlova', 'Bánh pavlova'], ['au_damper', 'Bánh mì damper nướng']] },
    canada: { fest: 'Bộ lễ hội Canada', food: 'Bộ ẩm thực Canada', of: ['of_canada', 'Mũ len toque', 'toque'],
      f: [['ca_hockey', 'Gậy khúc côn cầu & bóng'], ['ca_snowshoe', 'Giày đi tuyết'], ['ca_tipi', 'Lều tipi'], ['ca_toboggan', 'Xe trượt tuyết gỗ']],
      e: [['ca_poutine', 'Khoai chiên poutine'], ['ca_nanaimo', 'Bánh Nanaimo'], ['ca_beavertail', 'Bánh đuôi hải ly'], ['ca_taffy', 'Kẹo xi-rô phong trên tuyết']] },
    mexico: { fest: 'Bộ lễ hội Mexico', food: 'Bộ ẩm thực Mexico', of: ['of_mexico', 'Mũ sombrero cho thú cưng', 'sombrero'],
      f: [['mx_papel', 'Dây cờ giấy papel picado'], ['mx_skull', 'Đầu lâu đường calavera'], ['mx_guitar', 'Đàn guitar mariachi'], ['mx_arch', 'Cổng hoa vạn thọ']],
      e: [['mx_tacos', 'Đĩa taco'], ['mx_tamale', 'Bánh tamale'], ['mx_churro', 'Bánh churro'], ['mx_guac', 'Guacamole & bánh ngô']] },
    brazil: { fest: 'Bộ lễ hội Brazil', food: 'Bộ ẩm thực Brazil', of: ['of_brazil', 'Mũ lông vũ samba', 'samba'],
      f: [['br_mask', 'Mặt nạ Carnival'], ['br_berimbau', 'Đàn berimbau'], ['br_festa', 'Dây cờ Festa Junina'], ['br_feather', 'Giá mũ lông vũ samba']],
      e: [['br_feijoada', 'Nồi feijoada'], ['br_brigadeiro', 'Kẹo brigadeiro'], ['br_pao', 'Bánh phô mai pão de queijo'], ['br_acai', 'Tô açaí']] },
    egypt: { fest: 'Bộ lễ hội Ai Cập', food: 'Bộ ẩm thực Ai Cập', of: ['of_egypt', 'Khăn nemes pharaoh', 'pharaoh'],
      f: [['eg_mask', 'Mặt nạ vàng pharaoh'], ['eg_sistrum', 'Lục lạc sistrum'], ['eg_bastet', 'Tượng mèo Bastet'], ['eg_barque', 'Thuyền mặt trời']],
      e: [['eg_koshari', 'Tô koshari'], ['eg_falafel', 'Đĩa falafel'], ['eg_bread', 'Bánh mì baladi'], ['eg_tea', 'Trà hoa karkadé']] },
    morocco: { fest: 'Bộ lễ hội Ma-rốc', food: 'Bộ ẩm thực Ma-rốc', of: ['of_morocco', 'Mũ fez Ma-rốc', 'fez'],
      f: [['ma_gate', 'Cổng vòm zellige'], ['ma_bendir', 'Trống bendir'], ['ma_khamsa', 'Bàn tay Khamsa'], ['ma_slipper', 'Dép babouche']],
      e: [['ma_tagine', 'Nồi tagine'], ['ma_couscous', 'Đĩa couscous'], ['ma_pastilla', 'Bánh pastilla'], ['ma_dates', 'Khay chà là & hạnh nhân']] }
  };
  var PCT = 20, BUNDLES = [], OUTFITS = [], OBY = {}, BDBY = {}, ITEMS = [];
  Object.keys(DEF).forEach(function (zid) {
    var d = DEF[zid], L = Z[zid], i;
    var mk = function (arr, kind, ofs) { return arr.map(function (x, k) { var cost = Math.round((kind === 'fest' ? 440 + L * 12 + k * 40 : 360 + L * 10 + k * 36) / 10) * 10; ITEMS.push({ id: x[0], name: x[1], kind: 'deco', cost: cost, lvl: L, b: 10 + k * 2 + (kind === 'fest' ? 2 : 0), z: zid, bd: 'bd_' + zid + '_' + kind }); return x[0]; }); };
    var fi = mk(d.f, 'fest'), ei = mk(d.e, 'food');
    var of = { id: d.of[0], name: d.of[1], z: zid, acc: d.of[2], cost: 1000 + L * 40, lvl: L }; OUTFITS.push(of); OBY[of.id] = of;
    [{ id: 'bd_' + zid + '_fest', name: d.fest, icon: '🎪', kind: 'fest', items: fi.concat([of.id]), z: zid }, { id: 'bd_' + zid + '_food', name: d.food, icon: '🍽️', kind: 'food', items: ei, z: zid }].forEach(function (b) { BUNDLES.push(b); BDBY[b.id] = b; });
  });
  // thêm các món trang trí vào cửa hàng
  function build(ctx) { ITEMS.forEach(function (x) { ctx.items.push(Object.assign({}, x)); }); }
  // giá của một bộ: tổng giá lẻ giảm PCT%
  function priceOf(b, by) { var sum = 0; b.items.forEach(function (id) { var o = by[id] || OBY[id]; if (o) sum += o.cost; }); return { full: sum, price: Math.round(sum * (100 - PCT) / 1000) * 10 }; }
  var API = { PCT: PCT, BUNDLES: BUNDLES, BDBY: BDBY, OUTFITS: OUTFITS, OBY: OBY, build: build, priceOf: priceOf, ITEMIDS: ITEMS.map(function (x) { return x.id; }) };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenBundles = API;
})(typeof window !== 'undefined' ? window : this);
