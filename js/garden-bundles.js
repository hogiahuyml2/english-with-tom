/* EWT Garden — CÁC BỘ KÈM THEO trong cửa hàng của 8 khu quốc gia mới: bộ lễ hội, bộ ẩm thực (mua trọn bộ được giảm giá) và trang phục truyền thống cho thú cưng.
   Mỗi khu có 8 món trang trí riêng (4 lễ hội + 4 ẩm thực — chỉ đặt được ở khu đó) và 1 trang phục. Dùng chung cho máy chủ và trình duyệt. */
(function (root) {
  'use strict';
  var Z = { korea: 12, turkey: 12, australia: 13, canada: 13, mexico: 13, brazil: 14, egypt: 14, morocco: 14, spain: 15, russia: 17, ireland: 19, norway: 21, peru: 23, argentina: 25, cuba: 27, chile: 29, kenya: 31, southafrica: 33, ethiopia: 35, madagascar: 37 };
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
    ,spain: { fest: 'Bộ lễ hội Tây Ban Nha', food: 'Bộ ẩm thực Tây Ban Nha', of: ['of_spain', 'Mũ cordobés', 'cordobes'],
      f: [['es_castanets', 'Castañuelas'], ['es_guitar', 'Guitar flamenco'], ['es_azulejo', 'Gạch azulejo'], ['es_peineta', 'Lược peineta']],
      e: [['es_tortilla', 'Bánh trứng khoai tortilla'], ['es_churros', 'Churros chấm sô-cô-la'], ['es_gazpacho', 'Súp lạnh gazpacho'], ['es_tapas', 'Đĩa tapas']] }
    ,russia: { fest: 'Bộ lễ hội Nga', food: 'Bộ ẩm thực Nga', of: ['of_russia', 'Mũ ushanka', 'ushanka'],
      f: [['ru_balalaika', 'Đàn balalaika'], ['ru_khokhloma', 'Bát gỗ Khokhloma'], ['ru_egg', 'Trứng trang trí kiểu Fabergé'], ['ru_sled', 'Xe trượt tuyết gỗ']],
      e: [['ru_borscht', 'Súp củ cải borscht'], ['ru_pelmeni', 'Sủi cảo pelmeni'], ['ru_blini', 'Bánh kếp blini'], ['ru_pirozhki', 'Bánh nhân pirozhki']] }
    ,ireland: { fest: 'Bộ lễ hội Ai-len', food: 'Bộ ẩm thực Ai-len', of: ['of_ireland', 'Mũ nồi kẻ ca-rô', 'flatcap'],
      f: [['ie_whistle', 'Sáo tin whistle'], ['ie_bodhran', 'Trống bodhrán'], ['ie_claddagh', 'Nhẫn Claddagh'], ['ie_knot', 'Hoa văn nút thắt Celtic']],
      e: [['ie_soda', 'Bánh mì soda'], ['ie_stew', 'Món hầm Ai-len'], ['ie_colcannon', 'Khoai nghiền colcannon'], ['ie_barmbrack', 'Bánh trái cây barmbrack']] }
    ,norway: { fest: 'Bộ lễ hội Na Uy', food: 'Bộ ẩm thực Na Uy', of: ['of_norway', 'Mũ giáp Viking', 'viking'],
      f: [['no_fiddle', 'Đàn Hardanger'], ['no_skis', 'Ván trượt tuyết'], ['no_rosemal', 'Đĩa vẽ hoa rosemaling'], ['no_spark', 'Xe trượt kiểu spark']],
      e: [['no_salmon', 'Cá hồi Na Uy'], ['no_waffle', 'Bánh vafler'], ['no_brunost', 'Phô mai nâu brunost'], ['no_lefse', 'Bánh lefse']] }
    ,peru: { fest: 'Bộ lễ hội Peru', food: 'Bộ ẩm thực Peru', of: ['of_peru', 'Mũ chullo Andes', 'chullo'],
      f: [['pe_charango', 'Đàn charango'], ['pe_tumi', 'Dao tumi nghi lễ'], ['pe_totora', 'Thuyền cói totora'], ['pe_textile', 'Tấm dệt Andes']],
      e: [['pe_ceviche', 'Cá trộn ceviche'], ['pe_lomo', 'Bò xào lomo saltado'], ['pe_papa', 'Khoai tây Andes nhiều màu'], ['pe_chicha', 'Nước ngô tím chicha morada']] }
    ,argentina: { fest: 'Bộ lễ hội Argentina', food: 'Bộ ẩm thực Argentina', of: ['of_argentina', 'Mũ gaucho', 'gaucho'],
      f: [['ar_tango', 'Đôi giày tango'], ['ar_polo', 'Gậy polo & bóng'], ['ar_bolas', 'Dây boleadoras'], ['ar_guitar', 'Đàn guitar gaucho']],
      e: [['ar_empanada', 'Bánh empanada'], ['ar_asado', 'Giá nướng asado'], ['ar_alfajor', 'Bánh alfajor'], ['ar_dulce', 'Hũ dulce de leche']] }
    ,cuba: { fest: 'Bộ lễ hội Cuba', food: 'Bộ ẩm thực Cuba', of: ['of_cuba', 'Mũ cói Panama', 'panama'],
      f: [['cu_trumpet', 'Kèn trumpet'], ['cu_bongo', 'Trống bongo'], ['cu_tres', 'Đàn tres'], ['cu_fan', 'Quạt abanico']],
      e: [['cu_cubano', 'Bánh mì Cubano'], ['cu_ropa', 'Thịt xé ropa vieja'], ['cu_tostones', 'Chuối chiên tostones'], ['cu_flan', 'Bánh flan caramel']] }
    ,chile: { fest: 'Bộ lễ hội Chile', food: 'Bộ ẩm thực Chile', of: ['of_chile', 'Mũ cói chupalla', 'chupalla'],
      f: [['cl_quena', 'Sáo quena'], ['cl_cueca', 'Khăn tay cueca'], ['cl_kultrun', 'Trống kultrun'], ['cl_pomaire', 'Bình gốm Pomaire']],
      e: [['cl_empanada', 'Bánh empanada de pino'], ['cl_completo', 'Bánh mì kẹp completo'], ['cl_pastel', 'Bánh ngô pastel de choclo'], ['cl_sopaipilla', 'Bánh sopaipilla']] }
    ,kenya: { fest: 'Bộ lễ hội Kenya', food: 'Bộ ẩm thực Kenya', of: ['of_kenya', 'Mũ safari', 'safari'],
      f: [['ke_shuka', 'Chăn shúka đỏ Maasai'], ['ke_collar', 'Vòng cổ hạt cườm Maasai'], ['ke_binoc', 'Ống nhòm safari'], ['ke_kiondo', 'Giỏ kiondo']],
      e: [['ke_ugali', 'Bột ngô ugali'], ['ke_nyama', 'Thịt nướng nyama choma'], ['ke_chapati', 'Bánh chapati'], ['ke_sukuma', 'Rau xào sukuma wiki']] }
    ,southafrica: { fest: 'Bộ lễ hội Nam Phi', food: 'Bộ ẩm thực Nam Phi', of: ['of_southafrica', 'Mũ lưỡi trai Springbok', 'springbok'],
      f: [['za_rugby', 'Bóng bầu dục'], ['za_boots', 'Ủng gumboot nhảy múa'], ['za_braai', 'Lò nướng braai'], ['za_basket', 'Giỏ đan Zulu']],
      e: [['za_bobotie', 'Món bobotie'], ['za_biltong', 'Thịt khô biltong'], ['za_bunny', 'Bánh mì bunny chow'], ['za_koek', 'Bánh koeksister']] }
    ,ethiopia: { fest: 'Bộ lễ hội Ethiopia', food: 'Bộ ẩm thực Ethiopia', of: ['of_ethiopia', 'Khăn shamma', 'shamma'],
      f: [['et_masenqo', 'Đàn masenqo'], ['et_mesob', 'Bàn đan mesob'], ['et_umbrella', 'Ô nghi lễ'], ['et_cups', 'Bộ tách cà phê sini']],
      e: [['et_injera', 'Bánh injera'], ['et_doro', 'Gà hầm doro wat'], ['et_shiro', 'Món shiro'], ['et_dabo', 'Bánh mì dabo']] }
    ,madagascar: { fest: 'Bộ lễ hội Madagascar', food: 'Bộ ẩm thực Madagascar', of: ['of_madagascar', 'Mũ rơm salova', 'salova'],
      f: [['mg_valiha', 'Đàn valiha'], ['mg_lamba', 'Khăn lamba'], ['mg_raffia', 'Giỏ cọ raffia'], ['mg_zebu', 'Tượng bò zebu']],
      e: [['mg_romazava', 'Món romazava'], ['mg_vary', 'Cơm vary amin anana'], ['mg_mofo', 'Bánh mofo gasy'], ['mg_koba', 'Bánh koba']] }
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
