/* EWT City — DỮ LIỆU DÙNG CHUNG cho máy chủ và trình duyệt: bản đồ thành phố, quận, khu quy hoạch sẵn, mạng lưới đường sẵn, danh mục công trình, luật chơi.
   Mọi phép kiểm tra (đặt công trình, xây đường, giá, thời gian…) đều dùng đúng các hàm ở đây nên hai phía luôn cho cùng kết quả. */
(function (root) {
  'use strict';
  /* ───── bản đồ 168×152 ô (hàng 120–151 là vùng mở rộng phía Nam; chỉ số ô y*168+x của vùng cũ KHÔNG đổi) (gấp ~5 lần bản đồ cũ 72×48). Thành phố cũ (6 quận) được giữ NGUYÊN VẸN ở vị trí (OX,OY) để không ai mất công trình ───── */
  var W = 168, H = 206, OX = 60, OY = 36, OW = 72, OH = 48, PER = 6;

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
    { id: 11, key: 'sports', en: 'Sports & Expo', vi: 'Thể thao & Triển lãm', icon: '🏟️', lvl: 13, cost: 18000, auto: 26, rects: [[132, 0, 28, 36]], blurb: 'Sân vận động, nhà thi đấu, hồ bơi và trung tâm triển lãm lớn.' },
    // ── 5 quận mới xây trên vùng biển phía Đông & vịnh phía Nam (mở khi thành phố đã lớn) ──
    { id: 12, key: 'tech', en: 'Tech Valley', vi: 'Thung lũng Công nghệ', icon: '💻', lvl: 40, cost: 40000, auto: 56, rects: [[135, 38, 30, 19]], blurb: 'Toà văn phòng kính, phòng thí nghiệm, trung tâm dữ liệu và khuôn viên nghiên cứu trên đảo phía Đông.' },
    { id: 13, key: 'lake', en: 'Crystal Lake', vi: 'Hồ Pha Lê & Nghỉ dưỡng', icon: '🏞️', lvl: 52, cost: 60000, auto: 68, rects: [[135, 57, 30, 16]], blurb: 'Hồ nước trong vắt, khu nghỉ dưỡng, công viên giải trí và những bãi cát nhỏ bên hồ.' },
    { id: 14, key: 'heritage', en: 'Heritage Old Town', vi: 'Phố cổ Di sản', icon: '🏯', lvl: 64, cost: 90000, auto: 80, rects: [[151, 93, 14, 26]], blurb: 'Hòn đảo nhỏ phía Đông Nam với phố cổ lát đá, đền chùa và các công trình di sản.' },
    { id: 15, key: 'eco', en: 'Eco Forest Village', vi: 'Làng Sinh thái Rừng Xanh', icon: '🌲', lvl: 76, cost: 130000, auto: 92, rects: [[68, 86, 25, 18]], blurb: 'Làng xanh giữa vịnh: nông trại hữu cơ, nhà gỗ trên núi nhỏ và rừng cây xanh mát.' },
    { id: 16, key: 'space', en: 'Space Port', vi: 'Cảng Vũ trụ & Khoa học', icon: '🚀', lvl: 88, cost: 180000, auto: 104, rects: [[135, 73, 30, 19]], blurb: 'Bệ phóng tên lửa, đài thiên văn, nhà thi đấu và trung tâm khoa học ở cực Đông.' },
    // ── 5 quận mới ở dải đảo phía Nam (hàng 124–147) ──
    { id: 17, key: 'arts', en: 'Arts & Fashion', vi: 'Phố Nghệ thuật & Thời trang', icon: '🎨', lvl: 84, cost: 220000, auto: 100, rects: [[4, 124, 29, 24]], blurb: 'Phòng tranh, cửa hàng thời trang, nhà hát và quán cà phê nghệ sĩ.' },
    { id: 18, key: 'garden', en: 'Garden Residences', vi: 'Biệt thự Vườn Hoa', icon: '🌷', lvl: 90, cost: 280000, auto: 106, rects: [[36, 124, 29, 24]], blurb: 'Khu nhà ở cao cấp giữa những khu vườn, hồ nhỏ và công viên.' },
    { id: 19, key: 'snow', en: 'Snow Village', vi: 'Làng Tuyết & Trượt tuyết', icon: '⛄', lvl: 96, cost: 360000, auto: 112, rects: [[68, 124, 29, 24]], blurb: 'Đảo núi nhỏ với nhà gỗ, cáp treo, sân trượt và rừng thông.' },
    { id: 20, key: 'marina', en: 'Marina Port', vi: 'Bến Du thuyền & Cảng Xanh', icon: '⛵', lvl: 102, cost: 450000, auto: 116, rects: [[100, 124, 29, 24]], blurb: 'Bến du thuyền, nhà hàng bên cảng, kho lạnh và bãi biển nhỏ.' },
    { id: 21, key: 'oasis', en: 'Oasis Wonders', vi: 'Ốc đảo Kỳ quan', icon: '🏺', lvl: 108, cost: 560000, auto: 120, rects: [[132, 124, 29, 24]], blurb: 'Ốc đảo xanh với các công trình kỳ quan, bến xe và nhà thi đấu.' },
    // ── 8 khu phố văn hoá (hàng 152–203) ──
    { id: 22, key: 'chinatown', en: 'Chinatown', vi: 'Khu phố Hoa', icon: '🏮', lvl: 30, cost: 25000, auto: 46, rects: [[4, 152, 29, 24]], blurb: 'Cổng bài lâu đỏ, đèn lồng, chùa Hoa và những quán dimsum nhộn nhịp.' },
    { id: 23, key: 'japantown', en: 'Japan Town', vi: 'Khu phố Nhật', icon: '⛩️', lvl: 34, cost: 32000, auto: 50, rects: [[36, 152, 29, 24]], blurb: 'Cổng torii, nhà gỗ machiya, lâu đài trắng và hoa anh đào.' },
    { id: 24, key: 'vietnam', en: 'Viet Quarter', vi: 'Khu phố Việt', icon: '🛵', lvl: 38, cost: 40000, auto: 54, rects: [[68, 152, 29, 24]], blurb: 'Nhà ống nhiều màu, quán phở, chợ lớn, chùa và ruộng bậc thang.' },
    { id: 25, key: 'thai', en: 'Thai Town', vi: 'Khu phố Thái', icon: '🛕', lvl: 42, cost: 50000, auto: 58, rects: [[100, 152, 29, 24]], blurb: 'Chùa vàng nhọn, nhà sàn, chợ nổi và xe tuk-tuk.' },
    { id: 26, key: 'bali', en: 'Bali Quarter', vi: 'Khu phố Indonesia', icon: '🌴', lvl: 46, cost: 60000, auto: 62, rects: [[132, 152, 29, 24]], blurb: 'Đền bậc thang, cổng Bali, nhà joglo và ruộng bậc thang xanh.' },
    { id: 27, key: 'british', en: 'British Quarter', vi: 'Khu phố Anh', icon: '☎️', lvl: 50, cost: 75000, auto: 66, rects: [[4, 180, 29, 24]], blurb: 'Tháp đồng hồ, hộp điện thoại đỏ, xe buýt hai tầng và lâu đài cổ.' },
    { id: 28, key: 'american', en: 'American Quarter', vi: 'Khu phố Mỹ', icon: '🗽', lvl: 54, cost: 90000, auto: 70, rects: [[36, 180, 29, 24]], blurb: 'Nhà chọc trời, quán diner, nhà gạch nâu và tượng Nữ thần Tự do.' },
    { id: 29, key: 'aussie', en: 'Aussie Quarter', vi: 'Khu phố Úc', icon: '🦘', lvl: 58, cost: 110000, auto: 74, rects: [[68, 180, 29, 24]], blurb: 'Nhà hát vỏ sò, cầu cảng, núi đá đỏ, bãi biển lướt sóng và kangaroo.' }
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
    // 5 quận mới: dải đảo phía Đông (3 quận), đảo nhỏ Đông Nam, đảo giữa vịnh phía Nam — viền cát bên ngoài, đất xây bên trong
    fillRect(135, 38, 164, 91, 2); fillRect(137, 40, 162, 89, 0);
    fillEll(143.5, 60.5, 4.6, 3.6, 2, 0); fillEll(143.5, 60.5, 3.5, 2.5, 1);          // hồ Pha Lê (có bờ cát)
    fillRect(141, 76, 146, 79, 5);                                                      // bệ phóng của Cảng Vũ trụ
    fillRect(151, 93, 164, 118, 2); fillRect(153, 95, 163, 116, 0);
    fillRect(68, 86, 92, 103, 2); fillRect(70, 88, 90, 101, 0);
    // dải đảo phía Nam (5 quận mới, hàng 124–147)
    [[4, 17], [36, 18], [68, 19], [100, 20], [132, 21]].forEach(function (a) { fillRect(a[0], 124, a[0] + 28, 147, 2); fillRect(a[0] + 2, 126, a[0] + 26, 145, 0); });
    fillEll(22, 131, 3.4, 2, 1);                                       // ao nhỏ phố Nghệ thuật
    fillEll(48, 139.5, 4.6, 3.4, 2, 0); fillEll(48, 139.5, 3.6, 2.4, 1);  // hồ khu Vườn Hoa
    fillRect(108, 128, 109, 133, 1);                                   // kênh nhỏ trong bến du thuyền
    fillEll(140, 130.5, 4.4, 3.4, 2, 0); fillEll(140, 130.5, 3.2, 2.2, 1); // ao ốc đảo
    // 8 khu phố văn hoá: hai dải đảo ở hàng 152–175 và 180–203 (viền cát bên ngoài, đất bên trong, ao ở khối công viên)
    [[4, 152],[36, 152],[68, 152],[100, 152],[132, 152],[4, 180],[36, 180],[68, 180]].forEach(function (a) { fillRect(a[0], a[1], a[0] + 28, a[1] + 23, 2); fillRect(a[0] + 2, a[1] + 2, a[0] + 26, a[1] + 21, 0); var cx = [[6, 14, 30], [38, 54, 62], [70, 82, 94], [102, 112, 126], [134, 146, 158]][[4, 36, 68, 100, 132].indexOf(a[0])], px = (cx[1] + cx[2]) / 2 + .5, py = a[1] + 16.5, rr = Math.min(4.5, (cx[2] - cx[1]) / 2 - 1.8); fillEll(px, py, rr + 1, 3.2, 2, 0); fillEll(px, py, rr, 2.2, 1); });
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
    // ─── 5 quận mới ───
    // nối thẳng một đoạn: nước → cầu, cát → lối đi; ô nước/cầu thuộc quận d (để xe & người đi lại khi quận mở)
    function link(x0, y0, x1, y1, d) {
      var horiz = y0 === y1, n = horiz ? Math.abs(x1 - x0) + 1 : Math.abs(y1 - y0) + 1, sx = horiz ? Math.sign(x1 - x0) || 1 : 0, sy = horiz ? 0 : Math.sign(y1 - y0) || 1, k, q, x, y;
      for (k = 0; k < n; k++) { x = x0 + sx * k; y = y0 + sy * k; if (!inW(x, y)) continue; q = idx(x, y);
        if (TERR[q] === 1) { ROAD[q] = 2; if (DIST[q] === 255) DIST[q] = d; } else if (TERR[q] === 2 || TERR[q] === 0) { if (!ZONE[q] || ROAD[q]) { ROAD[q] = ROAD[q] || 1; if (DIST[q] === 255) DIST[q] = d; } } }
    }
    // dải đảo phía Đông: lưới đường chung cho 3 quận (Thung lũng Công nghệ · Hồ Pha Lê · Cảng Vũ trụ)
    var ex = [137, 149, 162], ey = [40, 48, 56, 64, 72, 80, 88];
    gridRoads(ex, ey, 137, 40, 162, 88);
    gridZones(12, ex, [40, 48, 56], ['ce', 'sp']);
    gridZones(13, ex, [56, 64, 72], ['bf', 'rb']);
    gridZones(16, ex, [72, 80, 88], ['tg', 'ge']);
    link(127, 48, 136, 48, 12); link(127, 72, 136, 72, 13);                          // cầu nối từ phố cũ sang đảo Đông
    // đảo Đông Nam: phố cổ
    var hx = [153, 163], hy = [95, 103, 110, 116];
    gridRoads(hx, hy, 153, 95, 163, 116); gridZones(14, hx, hy, ['w', 'w', 'p']);
    link(147, 103, 152, 103, 14);                                                      // cầu nối từ đảo sân bay
    // đảo giữa vịnh phía Nam: làng sinh thái (+ rừng thông ở các khối công viên)
    var vx = [70, 80, 90], vy = [88, 94, 101];
    gridRoads(vx, vy, 70, 88, 90, 101); gridZones(15, vx, vy, ['am', 'rp']);
    link(80, 102, 80, 105, 15);                                                        // nối xuống cầu vịnh dài (hàng 106)
    // ─── 5 quận phía Nam ───
    var sy2 = [126, 135, 145];
    [[17, [6, 14, 30], ['ce', 'wp'], 14, 107], [18, [38, 54, 62], ['rp', 'pr'], 54, 107], [19, [70, 82, 94], ['mf', 'pm'], 82, 107], [20, [102, 112, 126], ['hb', 'bi'], 112, 113], [21, [134, 146, 158], ['wg', 'tw'], 146, 113]].forEach(function (q) {
      gridRoads(q[1], sy2, q[1][0], 126, q[1][2], 145); gridZones(q[0], q[1], sy2, q[2]); link(q[3], q[4], q[3], 125, q[0]);
    });
    // ─── 8 khu phố văn hoá ───
    [[22, 4, 152, 14, 146], [23, 36, 152, 54, 146], [24, 68, 152, 82, 146], [25, 100, 152, 112, 146], [26, 132, 152, 146, 146], [27, 4, 180, 14, 174], [28, 36, 180, 54, 174], [29, 68, 180, 82, 174]].forEach(function (q) {
      var cx = [[6, 14, 30], [38, 54, 62], [70, 82, 94], [102, 112, 126], [134, 146, 158]][[4, 36, 68, 100, 132].indexOf(q[1])], cy = [q[2] + 2, q[2] + 11, q[2] + 21];
      gridRoads(cx, cy, cx[0], cy[0], cx[2], cy[2]); gridZones(q[0], cx, cy, ['cw', 'rp']); link(q[3], q[4], q[3], q[2] + 1, q[0]);
    });
    BLOCKS.forEach(function (b) { if (b.d === 18 && b.z === 'p') { var a, c, q; for (c = b.y; c < b.y + b.h; c++) for (a = b.x; a < b.x + b.w; a++) { q = idx(a, c); if (TERR[q] === 0 && !ROAD[q] && hash(a, c, 31) > .55) { TERR[q] = 4; ZONE[q] = 0; } } }
      if (b.d === 19 && b.z === 'm') { var a2, c2, q2, hv; for (c2 = b.y; c2 < b.y + b.h; c2++) for (a2 = b.x; a2 < b.x + b.w; a2++) { q2 = idx(a2, c2); hv = hash(a2, c2, 41); if (TERR[q2] === 0 && !ROAD[q2] && hv > .82) { TERR[q2] = hv > .94 ? 3 : 4; ZONE[q2] = 0; } } } });
    BLOCKS.forEach(function (b) { if (b.d !== 15 || b.z !== 'p') return; var a, c, q; for (c = b.y; c < b.y + b.h; c++) for (a = b.x; a < b.x + b.w; a++) { q = idx(a, c); if (TERR[q] === 0 && !ROAD[q] && hash(a, c, 21) > .4) { TERR[q] = 4; ZONE[q] = 0; } } });
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
  // công trình CÓ SẴN của 8 khu phố văn hoá: cổng, biểu tượng ở khối trung tâm, đồ trang trí đặc trưng
  (function () {
    FIXED.push({ k: 'fx22gate', x: 9, y: 155, w: 3, h: 1 }); FIXED.push({ k: 'fx22mark', x: 21, y: 157, w: 3, h: 3 });
    FIXED.push({ k: 'fx22da', x: 15, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx22db', x: 29, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx22da', x: 29, y: 162, w: 1, h: 1 }); FIXED.push({ k: 'fx22db', x: 15, y: 162, w: 1, h: 1 });
    FIXED.push({ k: 'fx23gate', x: 45, y: 155, w: 3, h: 1 }); FIXED.push({ k: 'fx23mark', x: 57, y: 157, w: 3, h: 3 });
    FIXED.push({ k: 'fx23da', x: 55, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx23db', x: 61, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx23da', x: 61, y: 162, w: 1, h: 1 }); FIXED.push({ k: 'fx23db', x: 55, y: 162, w: 1, h: 1 });
    FIXED.push({ k: 'fx24gate', x: 75, y: 155, w: 3, h: 1 }); FIXED.push({ k: 'fx24mark', x: 87, y: 157, w: 3, h: 3 });
    FIXED.push({ k: 'fx24da', x: 83, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx24db', x: 93, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx24da', x: 93, y: 162, w: 1, h: 1 }); FIXED.push({ k: 'fx24db', x: 83, y: 162, w: 1, h: 1 });
    FIXED.push({ k: 'fx25gate', x: 106, y: 155, w: 3, h: 1 }); FIXED.push({ k: 'fx25mark', x: 118, y: 157, w: 3, h: 3 });
    FIXED.push({ k: 'fx25da', x: 113, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx25db', x: 125, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx25da', x: 125, y: 162, w: 1, h: 1 }); FIXED.push({ k: 'fx25db', x: 113, y: 162, w: 1, h: 1 });
    FIXED.push({ k: 'fx26gate', x: 139, y: 155, w: 3, h: 1 }); FIXED.push({ k: 'fx26mark', x: 151, y: 157, w: 3, h: 3 });
    FIXED.push({ k: 'fx26da', x: 147, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx26db', x: 157, y: 156, w: 1, h: 1 }); FIXED.push({ k: 'fx26da', x: 157, y: 162, w: 1, h: 1 }); FIXED.push({ k: 'fx26db', x: 147, y: 162, w: 1, h: 1 });
    FIXED.push({ k: 'fx27gate', x: 9, y: 183, w: 3, h: 1 }); FIXED.push({ k: 'fx27mark', x: 21, y: 185, w: 3, h: 3 });
    FIXED.push({ k: 'fx27da', x: 15, y: 184, w: 1, h: 1 }); FIXED.push({ k: 'fx27db', x: 29, y: 184, w: 1, h: 1 }); FIXED.push({ k: 'fx27da', x: 29, y: 190, w: 1, h: 1 }); FIXED.push({ k: 'fx27db', x: 15, y: 190, w: 1, h: 1 });
    FIXED.push({ k: 'fx28gate', x: 45, y: 183, w: 3, h: 1 }); FIXED.push({ k: 'fx28mark', x: 57, y: 185, w: 3, h: 3 });
    FIXED.push({ k: 'fx28da', x: 55, y: 184, w: 1, h: 1 }); FIXED.push({ k: 'fx28db', x: 61, y: 184, w: 1, h: 1 }); FIXED.push({ k: 'fx28da', x: 61, y: 190, w: 1, h: 1 }); FIXED.push({ k: 'fx28db', x: 55, y: 190, w: 1, h: 1 });
    FIXED.push({ k: 'fx29gate', x: 75, y: 183, w: 3, h: 1 }); FIXED.push({ k: 'fx29mark', x: 87, y: 185, w: 3, h: 3 });
    FIXED.push({ k: 'fx29da', x: 83, y: 184, w: 1, h: 1 }); FIXED.push({ k: 'fx29db', x: 93, y: 184, w: 1, h: 1 }); FIXED.push({ k: 'fx29da', x: 93, y: 190, w: 1, h: 1 }); FIXED.push({ k: 'fx29db', x: 83, y: 190, w: 1, h: 1 });
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
        if (r > .84 && (DIST[i] === 6 || DIST[i] === 9 || DIST[i] === 3 || DIST[i] === 5 || DIST[i] === 2 || DIST[i] === 11 || DIST[i] === 13 || DIST[i] === 14 || DIST[i] === 20 || DIST[i] === 21)) PROPS.push({ t: 'palm', x: x, y: y });
        else if (r > .66 && DIST[i] === 6 && ((x + y) % 3 === 0)) PROPS.push({ t: r > .78 ? 'lounger' : 'umbrella', x: x, y: y, c: Math.floor(hash(x, y, 1) * 5) });
      } else if (t === 1) {
        if (r > .985 && near(x, y, 2, 5)) PROPS.push({ t: 'rock', x: x, y: y, s: 1, sea: 1 });
        else if (r > .975 && (DIST[i] === 255) && near(x, y, 2, 4) && x > 56 && y > 82) PROPS.push({ t: 'buoy', x: x, y: y });
      }
    }
    // đèn đường ở các ngã tư
    for (y = 1; y < H - 1; y++) for (x = 1; x < W - 1; x++) {
      i = idx(x, y); if (ROAD[i] !== 1) continue; var n4 = (ROAD[i - 1] > 0 ? 1 : 0) + (ROAD[i + 1] > 0 ? 1 : 0) + (ROAD[i - W] > 0 ? 1 : 0) + (ROAD[i + W] > 0 ? 1 : 0);
      if (n4 >= 3) LAMPS.push([x, y]); else if (n4 === 2 && ((x * 7 + y * 13) % 3 === 0) && DIST[i] !== 255) LAMPS.push([x, y]);
    }
  })();

  /* ───── luồng thuyền (thuyền chạy theo các tuyến đường nước) ───── */
  var LANES = [
    { p: [[2, 120.5], [165, 120.5]], n: 4, v: .03, s: 1.2, c: ['#fff', '#4F80BA', '#F2C21B'] },
    { p: [[165, 149.5], [2, 149.5]], n: 3, v: .028, s: 1.2, c: ['#fff', '#E9573F', '#2E9E7F'] },
    { p: [[71.6, 14], [71.6, 82]], n: 3, v: .03, s: .9, c: ['#fff', '#F2C21B', '#E9573F'] },
    { p: [[33.6, 20], [33.6, 112]], n: 2, v: .03, s: .9, c: ['#fff', '#4F80BA'] },
    { p: [[132, 38], [132.5, 60], [132.5, 90], [133, 118]], n: 3, v: .03, s: 1.2, c: ['#fff', '#4F80BA', '#F2C21B'] },
    { p: [[62, 109], [92, 109], [92, 118], [64, 118]], n: 3, v: .026, s: 1.2, c: ['#fff', '#E9573F', '#F2C21B'] },
    { p: [[166.4, 40], [166.4, 118], [150, 118], [150, 94]], n: 2, v: .026, s: 1.4, c: ['#fff', '#2E9E7F'] },
    { p: [[90, 12], [104, 24], [118, 14], [104, 8], [90, 12]], n: 3, v: .02, s: .8, c: ['#F2C21B', '#E9573F', '#fff'] },
    { p: [[48, 6], [62, 12], [66, 8], [52, 5]], n: 2, v: .02, s: .8, c: ['#fff', '#4F80BA'] },
    { p: [[165, 177.5], [2, 177.5]], n: 3, v: .028, s: 1.2, c: ['#fff', '#E9573F', '#4F80BA'] }
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
    // ── Đa dạng hoá (đợt 4): nhà ở, cao ốc chọc trời, cửa hàng, dịch vụ, nhà máy, vui chơi, học đường, danh thắng ──
    B('onefloor', 'Bungalow', 'Nhà trệt một tầng', 'home', 1, 1, 'r', 2, 300, 15, 14, 4, 0, [0, 6, 8], 'A cosy house with only one floor.'),
    B('logcabin', 'Log Cabin', 'Nhà gỗ rừng thông', 'home', 1, 1, 'r', 3, 520, 26, 25, 6, 0, [0, 6, 8, 7], 'A warm wooden house in the forest.'),
    B('stilthouse', 'House on Stilts', 'Nhà sàn', 'home', 1, 1, 'r', 3, 480, 24, 23, 6, 0, [0, 6, 8], 'A traditional house raised on wooden posts.'),
    B('tubehouse', 'Tube House', 'Nhà ống', 'home', 1, 1, 'rc', 4, 700, 35, 33, 8, 0, [0, 1, 6, 8], 'A tall, narrow house squeezed between others.'),
    B('japhouse', 'Japanese House', 'Nhà phong cách Nhật', 'home', 1, 1, 'r', 5, 900, 45, 43, 11, 0, [0, 6, 8], 'A calm house with a curved dark roof.'),
    B('chalet', 'Alpine Chalet', 'Nhà gỗ kiểu Alps', 'home', 1, 1, 'rm', 5, 950, 48, 45, 11, 0, [0, 6, 8, 7], 'A steep-roof wooden house for the mountains.'),
    B('rowhouses', 'Terraced Houses', 'Dãy nhà liên kế', 'home', 3, 1, 'rc', 6, 1800, 90, 86, 21, 0, [0, 1, 6, 8], 'A colourful row of houses side by side.'),
    B('lowrise', 'Low-rise Apartments', 'Chung cư thấp tầng', 'home', 2, 2, 'rc', 6, 3600, 180, 171, 42, 0, [0, 1, 6, 8], 'A small apartment block with balconies.'),
    B('modernvilla', 'Modern Villa', 'Biệt thự hiện đại', 'home', 2, 2, 'r', 7, 4200, 210, 200, 49, 0, [0, 6, 8], 'A flat-roof villa with big glass walls.'),
    B('frenchvilla', 'French Villa', 'Biệt thự kiểu Pháp', 'home', 2, 2, 'r', 8, 5200, 260, 248, 61, 0, [0, 6, 8], 'An elegant villa with a blue slate roof.'),
    B('medvilla', 'Mediterranean Villa', 'Biệt thự Địa Trung Hải', 'home', 2, 2, 'r', 8, 5400, 270, 257, 64, 0, [0, 6, 8], 'A sunny villa with orange tiles and a pool.'),
    B('redfarmhouse', 'Farmhouse', 'Nhà trang trại', 'home', 2, 2, 'ra', 6, 3000, 150, 143, 35, 0, [0, 8], 'A red barn-style house on the farm.'),
    B('beachvilla', 'Beach Villa', 'Biệt thự biển', 'home', 2, 2, 'rb', 9, 6500, 325, 310, 76, 0, [6], 'A white villa right by the sea.'),
    B('lakehouse', 'Lake House', 'Nhà ven hồ', 'home', 2, 2, 'rp', 9, 6200, 310, 295, 73, 0, [0, 6, 8], 'A wooden house with a little dock.'),
    B('midrise', 'Mid-rise Apartments', 'Chung cư trung tầng', 'home', 2, 2, 'rc', 9, 8600, 430, 410, 101, 0, [0, 1, 6, 8], 'Twelve floors of homes with a green roof.'),
    B('glasshouse', 'Glass House', 'Nhà kính hiện đại', 'home', 2, 2, 'r', 10, 8800, 440, 419, 104, 0, [0, 6, 8], 'A modern home with floor-to-ceiling windows.', { ch: 'home2' }),
    B('mansion', 'Mansion', 'Dinh thự', 'home', 3, 2, 'r', 11, 14000, 700, 667, 165, 0, [0, 6, 8], 'A grand house with columns and a big garden.', { ch: 'home2' }),
    B('twinapt', 'Twin Apartment Blocks', 'Chung cư song tháp', 'home', 3, 2, 'rc', 11, 16000, 800, 762, 188, 0, [0, 1, 6, 8], 'Two tall blocks linked by a sky bridge.', { ch: 'home2' }),
    B('glasscondo', 'Glass Condo', 'Cao ốc căn hộ kính', 'home', 3, 3, 'rc', 12, 24000, 1200, 1143, 282, 0, [0, 1, 6, 8], 'A shiny tower with a helipad on top.', { ch: 'home2' }),
    B('pencil', 'Pencil Tower', 'Tháp bút chì siêu mảnh', 'home', 1, 1, 'rc', 13, 15000, 750, 714, 176, 0, [0, 1, 6, 8], 'A super thin and super tall tower.', { ch: 'home2' }),
    B('terracetower', 'Terrace Tower', 'Tháp bậc thang xanh', 'home', 3, 3, 'rc', 14, 34000, 1700, 1619, 400, 0, [0, 1, 6, 8], 'A stepped tower covered with trees.', { ch: 'home2' }),
    B('skyresi', 'Sky Residence', 'Toà nhà ở chọc trời', 'home', 3, 3, 'rc', 15, 55000, 2400, 2619, 647, 0, [0, 1, 6, 8], 'Luxury flats high above the clouds.', { ch: 'home2' }),
    B('ecotower', 'Eco Tower', 'Tháp sinh thái', 'home', 3, 3, 'rc', 16, 62000, 2400, 2952, 729, 0, [0, 1, 6, 8], 'Every balcony is a little garden.', { ch: 'home2' }),
    B('landmarkres', 'Landmark Residences', 'Tổ hợp tháp Landmark', 'home', 4, 4, 'rc', 18, 120000, 2400, 5714, 1412, 0, [0, 1, 6], 'Three giant towers on one big base.', { ch: 'home2' }),
    B('minimart', 'Mini Mart', 'Cửa hàng tiện lợi', 'shop', 1, 1, 'rc', 3, 450, 22, 28, 0, 0, [0, 1, 6, 8], 'Open 24 hours every day.'),
    B('flowershop', 'Flower Shop', 'Tiệm hoa', 'shop', 1, 1, 'rc', 3, 400, 20, 25, 0, 0, [0, 1, 6, 8], 'Fresh flowers for every day.'),
    B('pharmacy', 'Pharmacy', 'Hiệu thuốc', 'shop', 1, 1, 'rc', 4, 650, 32, 41, 0, 0, [0, 1, 6, 8], 'Medicine and vitamins.'),
    B('noodleshop', 'Noodle Shop', 'Quán phở', 'shop', 1, 1, 'rc', 4, 600, 30, 38, 0, 0, [0, 1, 6, 8], 'A hot bowl of noodle soup.'),
    B('coffeehouse', 'Coffee House', 'Quán cà phê', 'shop', 2, 1, 'rc', 6, 2000, 100, 125, 0, 0, [0, 1, 6, 8], 'Coffee and cakes with outdoor tables.'),
    B('restaurant', 'Restaurant', 'Nhà hàng', 'shop', 2, 1, 'rc', 5, 1500, 75, 94, 0, 0, [0, 1, 6, 8], 'Delicious meals for the whole family.'),
    B('boutique', 'Boutique', 'Cửa hàng thời trang', 'shop', 1, 1, 'c', 5, 900, 45, 56, 0, 0, [0, 1], 'Stylish clothes and bags.'),
    B('petrolstation', 'Petrol Station', 'Trạm xăng', 'shop', 2, 1, 'ct', 6, 1700, 85, 106, 0, 0, [0, 1, 9], 'Fuel for cars and buses.'),
    B('supermarket', 'Supermarket', 'Siêu thị', 'shop', 2, 2, 'c', 7, 4200, 210, 262, 0, 0, [0, 1], 'Everything you need under one roof.'),
    B('nightmarket', 'Night Market', 'Chợ đêm', 'shop', 2, 2, 'c', 8, 5200, 260, 325, 0, 0, [0, 1], 'Lanterns, snacks and little stalls at night.'),
    B('officepark', 'Office Park', 'Khu văn phòng thấp tầng', 'shop', 3, 2, 'c', 9, 9000, 450, 562, 0, 1, [0, 1], 'Three low office blocks with trees.'),
    B('glassoffice', 'Glass Office', 'Toà văn phòng kính', 'shop', 2, 2, 'c', 10, 11000, 550, 688, 0, 1, [0, 1], 'A blue glass tower with a helipad.', { ch: 'town2' }),
    B('department', 'Department Store', 'Cửa hàng bách hoá', 'shop', 3, 2, 'c', 10, 12000, 600, 750, 0, 1, [0, 1], 'Clothes, toys and gifts on many floors.', { ch: 'town2' }),
    B('bankhq', 'Bank Headquarters', 'Trụ sở ngân hàng', 'shop', 2, 2, 'c', 11, 14000, 700, 875, 0, 1, [0, 1], 'A strong building with tall columns.', { ch: 'town2' }),
    B('grandresort', 'Grand Resort', 'Khu nghỉ dưỡng lớn', 'shop', 3, 3, 'cb', 12, 22000, 1100, 1375, 0, 1, [1, 6], 'A big hotel with a swimming pool.', { ch: 'town2' }),
    B('coworking', 'Startup Hub', 'Tổ hợp khởi nghiệp', 'shop', 2, 2, 'c', 12, 18000, 900, 1125, 0, 1, [0, 1], 'Young companies share this green office.', { ch: 'town2' }),
    B('twinoffice', 'Twin Office Towers', 'Văn phòng song tháp', 'shop', 3, 2, 'c', 12, 24000, 1200, 1500, 0, 1, [0, 1], 'Two glass towers joined by a bridge.', { ch: 'town2' }),
    B('conventioncenter', 'Convention Center', 'Trung tâm hội nghị', 'shop', 3, 3, 'c', 13, 30000, 1500, 1875, 0, 1, [0, 1], 'Big shows and meetings under a glass dome.', { ch: 'town2' }),
    B('skyoffice', 'Sky Office Tower', 'Toà văn phòng chọc trời', 'shop', 3, 3, 'c', 14, 42000, 2100, 2625, 0, 1, [0, 1], 'A stepped tower with a golden spire.', { ch: 'town2' }),
    B('pyramidhotel', 'Pyramid Hotel', 'Khách sạn kim tự tháp', 'shop', 3, 3, 'c', 15, 50000, 2400, 3125, 0, 1, [0, 1], 'Sleep inside a glass pyramid.', { ch: 'town2' }),
    B('spiraltower', 'Spiral Tower', 'Tháp xoắn ốc', 'shop', 3, 3, 'c', 16, 70000, 2400, 4375, 0, 1, [0, 1], 'Each floor turns a little, like a twisting rope.', { ch: 'town2' }),
    B('needletower', 'Needle Tower', 'Tháp kim quan sát', 'shop', 2, 2, 'c', 17, 82000, 2400, 5125, 0, 1, [0, 1], 'A thin tower with a disc-shaped deck.', { ch: 'town2' }),
    B('worldtrade', 'World Trade Centre', 'Trung tâm thương mại thế giới', 'shop', 4, 4, 'c', 18, 140000, 2400, 8750, 0, 1, [0, 1], 'Two supertall towers with a sky bridge.', { ch: 'town2' }),
    B('megaspire', 'Mega Spire', 'Siêu cao ốc Mega Spire', 'shop', 4, 4, 'c', 20, 200000, 2400, 12500, 0, 1, [0, 1], 'The tallest building in the city!', { ch: 'town2' }),
    B('cinema2', 'Multiplex Cinema', 'Rạp chiếu phim lớn', 'shop', 2, 2, 'fc', 8, 5600, 280, 350, 0, 0, [0, 1, 3], 'Many screens and lots of popcorn.'),
    B('postoffice', 'Post Office', 'Bưu điện', 'civic', 2, 1, 's', 4, 1500, 75, 0, 0, 10, [0, 1, 2, 3, 4, 5], 'Letters and parcels travel from here.'),
    B('hospital', 'Hospital', 'Bệnh viện', 'civic', 3, 2, 's', 9, 12000, 600, 0, 0, 80, [0, 1, 2, 3, 4, 5], 'Doctors and nurses help sick people.', { ch: 'civic1' }),
    B('cityhall', 'City Hall', 'Toà thị chính', 'civic', 3, 2, 's', 10, 15000, 750, 0, 0, 100, [0, 1], 'The mayor works under the blue dome.', { ch: 'civic1' }),
    B('courthouse', 'Courthouse', 'Toà án', 'civic', 2, 2, 's', 9, 8000, 400, 0, 0, 53, [0, 1], 'Judges decide what is fair.', { ch: 'civic1' }),
    B('railstation', 'Train Station', 'Ga tàu hoả', 'civic', 3, 2, 'st', 8, 9000, 450, 0, 0, 60, [0, 1, 2, 9], 'Trains arrive and leave all day.', { ch: 'civic1' }),
    B('busdepot', 'Bus Terminal', 'Bến xe buýt', 'civic', 3, 2, 'st', 7, 6500, 325, 0, 0, 43, [0, 1, 9], 'Buses start their trips here.'),
    B('metroentry', 'Metro Station', 'Ga tàu điện ngầm', 'civic', 2, 2, 'sc', 9, 7000, 350, 0, 0, 47, [0, 1], 'Go down the stairs and ride underground.', { ch: 'civic1' }),
    B('recyclecenter', 'Recycling Hub', 'Trạm tái chế', 'civic', 2, 2, 'si', 8, 6000, 300, 0, 0, 40, [0, 1, 2], 'Sort paper, plastic and glass.'),
    B('waterplant', 'Water Plant', 'Nhà máy nước', 'civic', 3, 2, 'si', 9, 9000, 450, 0, 0, 60, [0, 2], 'Clean water for every home.', { ch: 'civic1' }),
    B('commcenter', 'Community Center', 'Nhà văn hoá', 'civic', 2, 2, 'sp', 6, 4000, 200, 0, 0, 27, [0, 1, 2, 3, 4, 5], 'Classes, clubs and parties for everyone.'),
    B('tvtower', 'TV Tower', 'Tháp truyền hình', 'civic', 2, 2, 'sc', 12, 18000, 900, 0, 0, 120, [0, 1], 'A tall tower that sends TV and radio.', { ch: 'civic1' }),
    B('solarfarm', 'Solar Farm', 'Trang trại điện mặt trời', 'civic', 3, 2, 'ia', 10, 10000, 500, 0, 0, 67, [2, 8], 'Panels turn sunshine into power.', { ch: 'port2' }),
    B('windturbines', 'Wind Turbines', 'Cánh đồng điện gió', 'civic', 3, 2, 'ia', 11, 12000, 600, 0, 0, 80, [2, 8], 'Big blades spin in the wind.', { ch: 'port2' }),
    B('bowling', 'Bowling Alley', 'Sân bowling', 'fun', 2, 2, 'fc', 8, 4200, 210, 365, 0, 4, [0, 1, 3], 'Roll the ball and knock down the pins.'),
    B('karaoke', 'Karaoke Club', 'Quán karaoke', 'fun', 2, 2, 'fc', 9, 5200, 260, 452, 0, 5, [0, 1, 3], 'Sing your favourite songs with friends.', { ch: 'fun1' }),
    B('skaterink', 'Skate Park', 'Công viên trượt ván', 'fun', 2, 2, 'fp', 8, 3600, 180, 313, 0, 3, [0, 1, 3, 4, 5, 8, 10, 11], 'Ramps and rails for skaters.'),
    B('hauntedhouse', 'Haunted House', 'Nhà ma', 'fun', 2, 2, 'f', 11, 8000, 400, 696, 0, 7, [3], 'A spooky house full of surprises.', { ch: 'fun1' }),
    B('languagecenter', 'Language Center', 'Trung tâm ngoại ngữ', 'edu', 2, 2, 'ec', 9, 6000, 300, 375, 0, 30, [0, 1, 4], 'Learn English, Chinese, Korean and more.', { ch: 'edu1' }),
    B('artschool', 'Art School', 'Trường nghệ thuật', 'edu', 2, 2, 'e', 11, 9000, 450, 562, 0, 45, [4], 'Paint, sing, dance and make music.', { ch: 'edu1' }),
    B('techlab', 'Tech Lab', 'Phòng thí nghiệm công nghệ', 'edu', 2, 2, 'e', 13, 13000, 650, 812, 0, 65, [4], 'Robots and computers with a green dome.', { ch: 'edu2' }),
    B('textilemill', 'Textile Mill', 'Nhà máy dệt', 'port', 3, 2, 'i', 8, 7000, 350, 667, 0, 0, [2], 'Machines make cloth from thread.', { ch: 'port2' }),
    B('brewery', 'Brewery', 'Nhà máy nước giải khát', 'port', 3, 2, 'i', 9, 8500, 425, 810, 0, 0, [2], 'Big tanks make fizzy drinks.', { ch: 'port2' }),
    B('cementplant', 'Cement Plant', 'Nhà máy xi măng', 'port', 3, 2, 'i', 10, 10500, 525, 1000, 0, 0, [2], 'Cement for roads and buildings.', { ch: 'port2' }),
    B('datacenter', 'Data Center', 'Trung tâm dữ liệu', 'port', 2, 2, 'ic', 12, 18000, 900, 1714, 0, 0, [1, 2], 'Rows of servers glow with blue lights.', { ch: 'port2' }),
    B('refinery', 'Oil Refinery', 'Nhà máy lọc dầu', 'port', 3, 3, 'i', 13, 26000, 1300, 2476, 0, 0, [2], 'Tall towers and a flame on top.', { ch: 'port2' }),
    B('castle', 'Castle', 'Lâu đài cổ', 'world', 3, 3, 'w', 14, 26000, 1300, 1000, 0, 46, [5], 'Stone walls, towers and a flag.', { ch: 'world1' }),
    B('colosseum', 'Colosseum', 'Đấu trường La Mã', 'world', 3, 3, 'w', 15, 28000, 1400, 1077, 0, 50, [5], 'An ancient arena for big shows.', { ch: 'world1' }),
    B('sphinx', 'Sphinx', 'Tượng nhân sư', 'world', 2, 2, 'w', 15, 16000, 800, 615, 0, 29, [5], 'A lion with a human face.', { ch: 'world1' }),
    B('stonehenge', 'Stone Circle', 'Vòng đá cổ', 'world', 2, 2, 'wp', 14, 12000, 600, 462, 0, 21, [5], 'Big stones stand in a circle.', { ch: 'world1' }),
    B('moai', 'Moai Statues', 'Tượng đá Moai', 'world', 2, 2, 'wp', 14, 11000, 550, 423, 0, 20, [5], 'Giant stone heads from an island.', { ch: 'world1' }),
    // ── Đợt cao tầng: tháp ở, trụ sở công ty, nhà máy ống khói, tháp công nghiệp ──
    B('towerblock', 'Tower Block', 'Chung cư 40 tầng', 'home', 2, 2, 'rc', 12, 26000, 1300, 1238, 306, 0, [0, 1, 6, 8], 'Forty floors of homes with a red stripe.', { ch: 'home2' }),
    B('slimtower', 'Slim Tower', 'Tháp ở mảnh hồng', 'home', 1, 1, 'rc', 14, 22000, 1100, 1048, 259, 0, [0, 1, 6, 8], 'A thin pink tower that touches the sky.', { ch: 'home2' }),
    B('luxtower', 'Luxury Tower', 'Tháp căn hộ hạng sang', 'home', 3, 3, 'rc', 16, 80000, 2400, 3810, 941, 0, [0, 1, 6, 8], 'Golden balconies and a crown on top.', { ch: 'home2' }),
    B('skygarden', 'Sky Garden Tower', 'Tháp vườn trên không', 'home', 3, 3, 'rc', 17, 90000, 2400, 4286, 1059, 0, [0, 1, 6, 8], 'Five green terraces climb to the clouds.', { ch: 'home2' }),
    B('cloudtower', 'Cloud Tower', 'Tháp chạm mây', 'home', 3, 3, 'rc', 19, 150000, 2400, 7143, 1765, 0, [0, 1, 6], 'So tall that clouds float around it.', { ch: 'home2' }),
    B('shoptower', 'Shopping Tower', 'Tháp mua sắm', 'shop', 3, 2, 'c', 12, 26000, 1300, 1625, 0, 1, [0, 1], 'Shops on the bottom floors, offices above.', { ch: 'town2' }),
    B('bankskyscraper', 'Bank Skyscraper', 'Tháp ngân hàng', 'shop', 2, 2, 'c', 14, 48000, 2400, 3000, 0, 1, [0, 1], 'A stone tower with a golden crown.', { ch: 'town2' }),
    B('hqtower', 'Company HQ Tower', 'Trụ sở tập đoàn', 'shop', 3, 3, 'c', 15, 70000, 2400, 4375, 0, 1, [0, 1], 'A dark glass tower with a helipad.', { ch: 'town2' }),
    B('hotelskyline', 'Skyline Hotel', 'Khách sạn chọc trời', 'shop', 3, 3, 'c', 15, 62000, 2400, 3875, 0, 1, [0, 1], 'Hundreds of rooms with a view.', { ch: 'town2' }),
    B('techhq', 'Tech HQ', 'Trụ sở công nghệ', 'shop', 3, 3, 'c', 16, 76000, 2400, 4750, 0, 1, [0, 1], 'A green glass tower with a shining ring.', { ch: 'town2' }),
    B('mediatower', 'Media Tower', 'Tháp truyền thông', 'shop', 2, 2, 'c', 17, 88000, 2400, 5500, 0, 1, [0, 1], 'TV studios under a giant antenna.', { ch: 'town2' }),
    B('financecentre', 'Finance Centre', 'Trung tâm tài chính', 'shop', 4, 4, 'c', 19, 180000, 2400, 11250, 0, 1, [0, 1], 'Three huge towers of different heights.', { ch: 'town2' }),
    B('infinitytower', 'Infinity Tower', 'Tháp Vô Cực', 'shop', 4, 4, 'c', 22, 300000, 2400, 18750, 0, 1, [0, 1], 'The highest tower you can build.', { ch: 'town2' }),
    B('hospitaltower', 'Hospital Tower', 'Bệnh viện cao tầng', 'civic', 2, 2, 's', 12, 22000, 1100, 0, 0, 147, [0, 1, 2, 3, 4, 5], 'A tall hospital with a rooftop helipad.', { ch: 'civic1' }),
    B('cityhalltower', 'City Hall Tower', 'Toà thị chính cao tầng', 'civic', 2, 2, 's', 13, 26000, 1300, 0, 0, 173, [0, 1], 'A tall office for the city with a clock.', { ch: 'civic1' }),
    B('uniskytower', 'University Tower', 'Đại học cao tầng', 'edu', 3, 3, 'e', 14, 28000, 1400, 1750, 0, 140, [4], 'Lecture halls stacked in a red-brick tower.', { ch: 'edu2' }),
    B('researchtower', 'Research Tower', 'Tháp nghiên cứu', 'edu', 2, 2, 'e', 15, 36000, 1800, 2250, 0, 180, [4], 'Scientists work in a glass dome tower.', { ch: 'edu2' }),
    B('smokestackfactory', 'Smokestack Factory', 'Nhà máy ống khói cao', 'port', 3, 2, 'i', 10, 16000, 800, 1524, 0, 0, [2], 'Two striped chimneys rise above the factory.', { ch: 'port2' }),
    B('silotower', 'Silo Towers', 'Cụm tháp silo', 'port', 2, 2, 'ia', 11, 20000, 1000, 1905, 0, 0, [2, 8], 'Four giant silos store grain and cement.', { ch: 'port2' }),
    B('coolingtowers', 'Cooling Towers', 'Tháp làm mát nhà máy điện', 'port', 3, 3, 'i', 12, 34000, 1700, 3238, 0, 0, [2], 'Huge towers that puff white steam.', { ch: 'port2' }),
    B('chemtower', 'Chemical Tower', 'Tháp hoá chất', 'port', 2, 2, 'i', 13, 30000, 1500, 2857, 0, 0, [2], 'A tall column with a flame on top.', { ch: 'port2' }),
    B('skyfactory', 'Multi-storey Factory', 'Nhà máy nhiều tầng', 'port', 3, 3, 'i', 14, 44000, 2200, 4190, 0, 0, [2], 'A high factory with tanks and chimneys.', { ch: 'port2' }),
    B('rocketlab', 'Rocket Launch Tower', 'Tháp phóng tên lửa', 'trans', 2, 2, 'tg', 16, 90000, 2400, 8571, 0, 0, [9], 'A rocket waits beside a tall steel tower.', { ch: 'world1' }),
    B('droptower', 'Drop Tower', 'Tháp thả rơi', 'fun', 1, 1, 'f', 11, 14000, 700, 1217, 0, 13, [3], 'Go up very high, then drop down!', { ch: 'fun1' }),
    B('skypod', 'Sky Pod Tower', 'Tháp Sky Pod', 'world', 2, 2, 'w', 18, 100000, 2400, 3846, 0, 179, [5], 'A tall tower with a restaurant in the sky.', { ch: 'world1' }),
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
    B('festscarecrow', 'Festival Scarecrow', 'Bù nhìn mùa thu', 'event', 1, 1, '*', 1, 350, 15, 0, 0, 10, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11], 'A friendly scarecrow watches the field.', { ev: 'thuvang' }),
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

  /* ───── bảng màu (đổi màu công trình / cây / hoa) ─────
     h: sắc độ thân nhà · s: độ đậm · l: tăng/giảm sáng · h2: sắc cho phần tối (mái, cửa) · gh: sắc cho kính (null = giữ kính xanh) · f: có đổi cả màu lá cây không */
  var PALETTES = [
    { id: 'gold', g: 'lux', name: 'Vàng champagne', h: 42, s: .55, l: .08, h2: 36, gh: 44 },
    { id: 'rosegold', g: 'lux', name: 'Vàng hồng', h: 14, s: .45, l: .06, h2: 8, gh: 16 },
    { id: 'platinum', g: 'lux', name: 'Bạch kim', h: 212, s: .06, l: .05, h2: 212, gh: 208, gs: .35 },
    { id: 'graphite', g: 'lux', name: 'Đen than', h: 215, s: .1, l: -.2, h2: 215, gh: 212, gs: .3 },
    { id: 'navy', g: 'lux', name: 'Xanh hoàng gia', h: 222, s: .5, l: -.14, h2: 230, gh: 222 },
    { id: 'emerald', g: 'lux', name: 'Ngọc lục bảo', h: 155, s: .45, l: -.08, h2: 162, gh: 165 },
    { id: 'purple', g: 'lux', name: 'Tím hoàng gia', h: 268, s: .45, l: -.04, h2: 280, gh: 270 },
    { id: 'wine', g: 'lux', name: 'Đỏ rượu vang', h: 350, s: .5, l: -.12, h2: 345, gh: 352 },
    { id: 'p-pink', g: 'pastel', name: 'Hồng pastel', h: 345, s: .6, l: .14, h2: 332, gh: 340 },
    { id: 'p-peach', g: 'pastel', name: 'Cam đào', h: 20, s: .7, l: .12, h2: 12, gh: 22 },
    { id: 'p-cream', g: 'pastel', name: 'Vàng kem', h: 48, s: .7, l: .12, h2: 40, gh: 50 },
    { id: 'p-mint', g: 'pastel', name: 'Xanh bạc hà', h: 150, s: .45, l: .14, h2: 160, gh: 165 },
    { id: 'p-aqua', g: 'pastel', name: 'Xanh ngọc', h: 178, s: .5, l: .12, h2: 186, gh: 180 },
    { id: 'p-sky', g: 'pastel', name: 'Xanh da trời', h: 205, s: .65, l: .12, h2: 215, gh: 202 },
    { id: 'p-lilac', g: 'pastel', name: 'Tím oải hương', h: 265, s: .5, l: .14, h2: 275, gh: 268 },
    { id: 'terracotta', g: 'theme', name: 'Đất nung', h: 18, s: .55, l: 0, h2: 12 },
    { id: 'brick', g: 'theme', name: 'Gạch đỏ', h: 8, s: .5, l: -.06, h2: 5 },
    { id: 'timber', g: 'theme', name: 'Gỗ nâu', h: 28, s: .45, l: -.05, h2: 24 },
    { id: 'steel', g: 'theme', name: 'Thép công nghiệp', h: 210, s: .15, l: -.04, h2: 215, gh: 205, gs: .5 },
    { id: 'sea', g: 'theme', name: 'Màu biển', h: 185, s: .55, l: 0, h2: 195, gh: 185 },
    { id: 'eco', g: 'theme', name: 'Xanh sinh thái', h: 112, s: .4, l: .02, h2: 125, gh: 150 },
    { id: 'sunset', g: 'theme', name: 'Hoàng hôn', h: 24, s: .75, l: .02, h2: 350, gh: 30 },
    { id: 'snow', g: 'theme', name: 'Tuyết trắng', h: 210, s: .08, l: .18, h2: 215, gh: 205, gs: .4 },
    { id: 'sakura', g: 'season', name: 'Anh đào', h: 340, s: .55, l: .14, h2: 330, f: 1 },
    { id: 'autumn', g: 'season', name: 'Thu vàng', h: 28, s: .8, l: 0, h2: 15, f: 1 },
    { id: 'spring', g: 'season', name: 'Xuân tươi', h: 95, s: .6, l: .06, h2: 110, f: 1 },
    { id: 'f-red', g: 'vivid', name: 'Đỏ tươi', h: 355, s: .85, l: 0, h2: 350, f: 1 },
    { id: 'f-orange', g: 'vivid', name: 'Cam', h: 28, s: .9, l: 0, h2: 22, f: 1 },
    { id: 'f-yellow', g: 'vivid', name: 'Vàng tươi', h: 50, s: .9, l: .02, h2: 44, f: 1 },
    { id: 'f-blue', g: 'vivid', name: 'Xanh dương', h: 215, s: .8, l: 0, h2: 222, gh: 215, f: 1 },
    { id: 'f-violet', g: 'vivid', name: 'Tím', h: 280, s: .7, l: 0, h2: 285, f: 1 },
    { id: 'f-white', g: 'vivid', name: 'Trắng tinh', h: 60, s: .04, l: .3, h2: 60, f: 1 }
  ];
  var PAL_BY = {}; PALETTES.forEach(function (p) { PAL_BY[p.id] = p; });
  var PAL_GROUPS = [['lux', '👑 Sang trọng'], ['pastel', '🍬 Pastel'], ['theme', '🎯 Theo chủ đề'], ['season', '🌸 Theo mùa'], ['vivid', '🌈 Tươi sáng']];
  var SUGGEST = { home: ['p-peach', 'p-cream', 'p-mint', 'terracotta', 'timber', 'p-sky', 'p-pink'], shop: ['sunset', 'p-pink', 'gold', 'p-aqua', 'brick', 'navy'], civic: ['p-sky', 'platinum', 'brick', 'p-mint', 'navy'],
    park: ['p-pink', 'p-aqua', 'sunset', 'f-yellow', 'p-lilac'], fun: ['p-pink', 'p-aqua', 'sunset', 'f-yellow', 'p-lilac'], tree: ['sakura', 'autumn', 'spring', 'eco', 'f-yellow'], flower: ['f-red', 'f-yellow', 'f-blue', 'p-pink', 'f-violet', 'f-white', 'sunset'],
    bench: ['gold', 'graphite', 'timber', 'platinum', 'p-mint'], lamp: ['gold', 'graphite', 'platinum', 'timber', 'f-yellow'], orna: ['gold', 'platinum', 'terracotta', 'p-lilac', 'emerald'], port: ['steel', 'brick', 'navy', 'sunset', 'graphite'],
    edu: ['brick', 'navy', 'p-sky', 'p-cream', 'emerald'], world: ['gold', 'terracotta', 'platinum', 'emerald', 'sunset'], beach: ['sea', 'p-aqua', 'p-cream', 'sunset', 'p-pink'], mount: ['timber', 'snow', 'eco', 'brick', 'autumn'],
    farm: ['brick', 'timber', 'p-cream', 'eco', 'terracotta'], trans: ['steel', 'platinum', 'navy', 'sunset', 'graphite'], sport: ['p-aqua', 'sunset', 'navy', 'emerald', 'f-blue'], event: ['sakura', 'autumn', 'gold', 'wine', 'p-pink'] };
  // gợi ý màu theo loại công trình (cao ốc kính thì gợi ý màu kính sang trọng)
  function recolorCost(it) { return Math.max(RULES.recolorMin, Math.round(it.cost * RULES.recolorPct)); }
  function suggestFor(it) { if ((it.cat === 'home' || it.cat === 'shop') && (it.lvl >= 12 || it.w * it.h >= 9)) return ['navy', 'graphite', 'platinum', 'emerald', 'gold', 'wine', 'p-sky']; return SUGGEST[it.cat] || ['p-peach', 'p-sky', 'p-mint', 'gold']; }
  // hướng (0 +y, 1 +x, 2 −y, 3 −x) mà mặt trước nhìn ra đường; −1 nếu không giáp đường
  function facingToRoad(st, it, x, y) {
    var best = -1, d, k, cnt, bc = 0, W2 = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    for (d = 0; d < 4; d++) { cnt = 0; for (k = 0; k < (d % 2 ? it.h : it.w); k++) { var tx = d === 0 ? x + k : d === 2 ? x + k : d === 1 ? x + it.w : x - 1, ty = d === 1 || d === 3 ? y + k : d === 0 ? y + it.h : y - 1; if (isRoadAt(tx, ty, st.roads)) cnt++; } if (cnt > bc) { bc = cnt; best = d; } }
    return best;
  }

  /* ───── công trình CAO CẤP mở khoá từ cấp 23 đến 120 (siêu tháp, kỳ quan, công nghệ…) ───── */
  (function () {
    // [mã, en, vi, loại, w, h, khu, cấp, quận, chương, kiểu kinh tế, mô tả]
    var T = [
      ['skyvilla', 'Sky Villa', 'Biệt thự trên không', 'home', 3, 2, 'r', 23, [0, 6, 8], 'home2', 'home', 'A glass villa with a rooftop pool.'],
      ['auroratower', 'Aurora Residences', 'Cao ốc Cực Quang', 'home', 3, 3, 'rc', 25, [0, 1], 'home2', 'home', 'Green glass apartments with a helipad.'],
      ['vgarden', 'Vertical Garden Tower', 'Toà nhà vườn đứng', 'home', 3, 3, 'rc', 28, [0, 1], 'home2', 'home', 'Every floor has a balcony full of plants.'],
      ['marinaresi', 'Marina Residences', 'Căn hộ Bến Du Thuyền', 'home', 4, 3, 'rc', 31, [0, 1, 6], 'home2', 'home', 'Twin towers by the water.'],
      ['crystalvilla', 'Crystal Villa', 'Biệt thự Pha Lê', 'home', 3, 3, 'r', 34, [0, 6, 8], 'home2', 'home', 'A sparkling glass villa.'],
      ['greentower', 'Eco Tower', 'Toà nhà Sinh Thái', 'home', 3, 3, 'rc', 38, [0, 1], 'home2', 'home', 'A green tower full of trees.'],
      ['diamondtower', 'Diamond Residences', 'Chung cư Kim Cương', 'home', 3, 3, 'rc', 44, [0, 1], 'home2', 'home', 'A twisting diamond-glass tower.'],
      ['royalpalace', 'Royal Palace', 'Cung điện Hoàng Gia', 'home', 5, 4, 'r', 50, [0, 6, 8], 'home2', 'home', 'A palace with golden domes.'],
      ['cloudapts', 'Cloud Apartments', 'Căn hộ Trên Mây', 'home', 4, 4, 'rc', 58, [0, 1], 'home2', 'home', 'Terraced towers above the clouds.'],
      ['arcology', 'Arcology Pyramid', 'Thành phố trong tháp', 'home', 5, 5, 'rc', 70, [0, 1], 'home2', 'home', 'A whole town inside one green pyramid.'],
      ['orbitalresi', 'Orbital Residences', 'Cao ốc Vành Đai', 'home', 4, 4, 'rc', 85, [0, 1], 'home2', 'home', 'A tower with a ring in the sky.'],
      ['edensky', 'Eden Skycity', 'Thiên Đường Xanh', 'home', 5, 5, 'rc', 100, [0, 1], 'home2', 'home', 'Four green towers: a garden city in the sky.'],
      ['techhub', 'Tech Hub Tower', 'Toà Công Nghệ', 'shop', 3, 3, 'c', 23, [0, 1], 'town2', 'shop', 'Start-ups and computers work here.'],
      ['sapphire', 'Sapphire Tower', 'Toà Sapphire', 'shop', 3, 3, 'c', 26, [0, 1], 'town2', 'shop', 'A deep-blue glass tower.'],
      ['auroramall', 'Aurora Mall', 'TTTM Cực Quang', 'shop', 4, 4, 'c', 29, [0, 1], 'town2', 'shop', 'A shiny purple shopping mall.'],
      ['goldbank', 'Golden Bank Tower', 'Toà Ngân hàng Vàng', 'shop', 3, 3, 'c', 32, [0, 1], 'town2', 'shop', 'A bank tower with a golden crown.'],
      ['quantumtower', 'Quantum Tower', 'Toà Lượng Tử', 'shop', 3, 3, 'c', 36, [0, 1], 'town2', 'shop', 'A violet tower that twists as it rises.'],
      ['digitalplaza', 'Digital Plaza', 'Quảng trường Số', 'shop', 4, 4, 'c', 40, [0, 1], 'town2', 'shop', 'Twin screens and neon lights.'],
      ['neonskyline', 'Neon Skyline Tower', 'Toà Neon', 'shop', 3, 3, 'c', 45, [0, 1], 'town2', 'shop', 'It glows pink and blue all night.'],
      ['globetower', 'Globe Tower', 'Toà Quả Cầu', 'shop', 3, 3, 'c', 52, [0, 1], 'town2', 'shop', 'A giant glass globe on a tower.'],
      ['sailhotel', 'Sail Hotel', 'Khách sạn Cánh Buồm', 'shop', 4, 3, 'c', 55, [0, 1, 6], 'town2', 'shop', 'A hotel shaped like a huge sail.'],
      ['galaxymall', 'Galaxy Mall', 'TTTM Dải Ngân Hà', 'shop', 5, 5, 'c', 62, [0, 1], 'town2', 'shop', 'The biggest mall under a ring of stars.'],
      ['obsidian', 'Obsidian Spire', 'Tháp Hắc Diện', 'shop', 3, 3, 'c', 68, [0, 1], 'town2', 'shop', 'A black glass spire with cyan lights.'],
      ['crownfinance', 'Crown Finance Tower', 'Toà Vương Miện', 'shop', 4, 4, 'c', 76, [0, 1], 'town2', 'shop', 'The golden crown of the city.'],
      ['titantower', 'Titan Tower', 'Tháp Titan', 'shop', 4, 4, 'c', 90, [0, 1], 'town2', 'shop', 'A supertall tower with a golden spire.'],
      ['apexneedle', 'Apex Sky Needle', 'Kim Chọc Trời', 'shop', 4, 4, 'c', 110, [0, 1], 'town2', 'shop', 'The tallest needle in the world.'],
      ['smarthospital', 'Smart Hospital', 'Bệnh viện Thông Minh', 'civic', 4, 3, 's', 24, [0, 1], 'civic1', 'civic', 'A hospital with robots and a helipad.'],
      ['futurelibrary', 'Future Library', 'Thư viện Tương Lai', 'civic', 4, 3, 's', 27, [0, 1], 'civic1', 'civic', 'Books and screens under a glass dome.'],
      ['innovuni', 'Innovation University', 'Đại học Đổi Mới', 'edu', 4, 4, 'e', 33, [4], 'edu2', 'edu', 'Two brick towers of new ideas.'],
      ['scienceorb', 'Science Orb', 'Bảo tàng Quả Cầu', 'edu', 3, 3, 'e', 41, [4], 'edu2', 'edu', 'A huge globe full of science.'],
      ['spaceobs', 'Space Observatory', 'Đài Vũ Trụ', 'edu', 3, 3, 'e', 48, [4], 'edu2', 'edu', 'A big telescope looks at the stars.'],
      ['airesearch', 'AI Institute', 'Viện Trí Tuệ Nhân Tạo', 'edu', 4, 4, 'e', 56, [4], 'edu2', 'edu', 'Smart computers learn here.'],
      ['megaacademy', 'Mega Academy', 'Học Viện Đại Siêu', 'edu', 5, 4, 'e', 73, [4], 'edu2', 'edu', 'A grand academy with a clock tower.'],
      ['megawheel', 'Mega Wheel', 'Vòng Quay Siêu Khổng Lồ', 'fun', 4, 4, 'f', 30, [3], 'fun2', 'fun', 'A wheel so big you can see the whole city.'],
      ['skycoaster', 'Sky Coaster Park', 'Công viên Tàu Lượn Trời', 'fun', 5, 4, 'f', 37, [3], 'fun2', 'fun', 'A fast roller coaster in the sky.'],
      ['aquadome', 'Aqua Dome', 'Vòm Đại Dương', 'fun', 5, 5, 'f', 43, [3], 'fun2', 'fun', 'A glass dome with a water world inside.'],
      ['neonarena', 'Neon Arena', 'Đấu trường Neon', 'sport', 4, 4, 'g', 49, [11], 'edu2', 'sport', 'A glowing arena for e-sports.'],
      ['olympicstadium', 'Olympic Stadium', 'Sân Vận Động Olympic', 'sport', 6, 6, 'g', 57, [11], 'edu2', 'sport', 'The biggest stadium for the Games.'],
      ['vrpark', 'VR Theme Park', 'Công viên Thực Tế Ảo', 'fun', 5, 5, 'f', 65, [3], 'fun2', 'fun', 'Virtual worlds you can walk into.'],
      ['lasertower', 'Laser Show Tower', 'Tháp Laser', 'fun', 3, 3, 'f', 80, [3], 'fun2', 'fun', 'It shoots colourful lasers at night.'],
      ['solarpark', 'Solar Farm', 'Trang trại Mặt Trời', 'port', 4, 4, 'i', 25, [2], 'port2', 'port', 'Rows of panels make clean power.'],
      ['windfield', 'Wind Field', 'Cánh đồng Gió', 'port', 4, 4, 'i', 28, [2], 'port2', 'port', 'Tall wind turbines spin all day.'],
      ['smartfactory', 'Smart Factory', 'Nhà máy Thông Minh', 'port', 4, 4, 'i', 31, [2], 'port2', 'port', 'Robots build things here.'],
      ['datahub', 'Data Center', 'Trung tâm Dữ liệu', 'port', 4, 3, 'i', 35, [2], 'port2', 'port', 'Thousands of computers keep the city online.'],
      ['hyperloop', 'Hyperloop Station', 'Ga Hyperloop', 'trans', 5, 3, 't', 46, [9], 'world1', 'port', 'A super-fast train in a tube.'],
      ['fusionreactor', 'Fusion Reactor', 'Lò Phản ứng Nhiệt Hạch', 'port', 4, 4, 'i', 60, [2], 'port2', 'port', 'A little sun that makes endless power.'],
      ['maglev', 'Maglev Terminal', 'Ga Tàu Đệm Từ', 'trans', 6, 4, 't', 53, [9], 'world1', 'port', 'A train that floats on magnets.'],
      ['spaceport', 'Spaceport', 'Cảng Vũ Trụ', 'trans', 7, 5, 't', 75, [9], 'world1', 'port', 'Rockets leave for space from here.'],
      ['airshiphub', 'Airship Hub', 'Bến Khinh Khí Cầu', 'trans', 6, 5, 't', 95, [9], 'world1', 'port', 'Giant airships dock at the tall mast.'],
      ['dragonpagoda', 'Dragon Pagoda', 'Bảo Tháp Rồng', 'world', 3, 3, 'w', 35, [5], 'world1', 'world', 'A tall pagoda with red and gold roofs.'],
      ['crystalpalace', 'Crystal Palace', 'Cung Pha Lê', 'world', 4, 4, 'w', 47, [5], 'world1', 'world', 'A glass palace full of golden light.'],
      ['goldpyramid', 'Golden Pyramid', 'Kim Tự Tháp Vàng', 'world', 4, 4, 'w', 64, [5], 'world1', 'world', 'A pyramid of pure gold.'],
      ['timetower', 'Grand Time Tower', 'Tháp Đồng Hồ Vĩ Đại', 'world', 3, 3, 'w', 72, [5], 'world1', 'world', 'The clock everyone in the city can see.'],
      ['holostatue', 'Hologram Statue', 'Tượng Hologram', 'world', 3, 3, 'w', 82, [5], 'world1', 'world', 'A glowing statue made of light.'],
      ['floatingisle', 'Floating Island', 'Đảo Bay', 'park', 6, 6, 'p', 88, [10], 'world1', 'park', 'A green island floats in the sky.'],
      ['atlantis', 'Atlantis Dome', 'Thành phố Atlantis', 'park', 7, 7, 'p', 96, [10], 'world1', 'park', 'A whole city under a glass dome.'],
      ['dysonmonument', 'Sun Sphere Monument', 'Đài Cầu Mặt Trời', 'sport', 5, 5, 'g', 104, [11], 'world1', 'sport', 'A burning sun held by golden rings.'],
      ['spaceelevator', 'Space Elevator', 'Thang Máy Vũ Trụ', 'trans', 4, 4, 't', 112, [9], 'world1', 'port', 'A cable that goes all the way to space.'],
      ['worldtree', 'World Tree', 'Cây Thế Giới', 'park', 6, 6, 'p', 116, [10], 'world1', 'park', 'The giant tree of all the world.'],
      ['citygod', 'Monument of EWT', 'Đài Tưởng Niệm EWT', 'world', 4, 4, 'w', 120, [5], 'world1', 'world', 'The highest honour for a city.'],
      ['techpark', 'Tech Park', 'Công viên Công nghệ', 'shop', 3, 3, 'c', 41, [12], 'town2', 'shop', 'Glass offices for new companies.'],
      ['startuphub', 'Start-up Hub', 'Trung tâm Khởi nghiệp', 'shop', 2, 2, 'c', 44, [12], 'town2', 'shop', 'Young teams build apps here.'],
      ['robotlab', 'Robot Lab', 'Phòng thí nghiệm Robot', 'edu', 3, 3, 'e', 47, [12], 'edu2', 'edu', 'Students build smart robots.'],
      ['cloudhq', 'Cloud HQ', 'Trụ sở Đám Mây', 'shop', 4, 4, 'c', 57, [12], 'town2', 'shop', 'A big company keeps data in the cloud.'],
      ['quantumlab', 'Quantum Lab', 'Phòng Lượng Tử', 'edu', 4, 3, 'e', 66, [12], 'edu2', 'edu', 'A glass dome for very small science.'],
      ['aicampus', 'AI Campus', 'Khuôn viên Trí tuệ Nhân tạo', 'edu', 5, 4, 'e', 78, [12], 'edu2', 'edu', 'Green terraces where smart computers learn.'],
      ['lakeresort', 'Lake Resort', 'Khu nghỉ bên Hồ', 'fun', 4, 3, 'b', 53, [13], 'fun2', 'fun', 'Guests relax next to the clear lake.'],
      ['crystalspa', 'Crystal Spa', 'Spa Pha Lê', 'fun', 3, 3, 'b', 58, [13], 'fun2', 'fun', 'A glass spa with warm pools.'],
      ['glasslakehouse', 'Glass Lake House', 'Nhà Kính Bên Hồ', 'home', 3, 3, 'r', 60, [13], 'home2', 'home', 'A glass house with a lake view.'],
      ['lakecoaster', 'Lake Coaster', 'Tàu lượn Bên Hồ', 'fun', 4, 4, 'f', 63, [13], 'fun2', 'fun', 'A roller coaster that flies over the water.'],
      ['floatvillas', 'Floating Villas', 'Biệt thự Nổi', 'home', 4, 3, 'b', 70, [13], 'home2', 'home', 'Villas that sit on the water.'],
      ['crystalpier', 'Crystal Pier', 'Cầu Tàu Pha Lê', 'fun', 5, 2, 'b', 74, [13], 'fun2', 'fun', 'A long glass pier with shops and lights.'],
      ['lanternstreet', 'Lantern Street', 'Phố Đèn Lồng', 'world', 4, 2, 'w', 65, [14], 'world1', 'world', 'Hundreds of lanterns hang over the street.'],
      ['oldteahall', 'Old Tea Hall', 'Trà Đường Cổ', 'world', 3, 3, 'w', 69, [14], 'world1', 'world', 'People drink tea in a quiet old hall.'],
      ['stonegate', 'Great Stone Gate', 'Cổng Đá Lớn', 'world', 3, 2, 'w', 72, [14], 'world1', 'world', 'A big gate to the old town.'],
      ['heritagemuseum', 'Heritage Museum', 'Bảo tàng Di sản', 'world', 4, 4, 'w', 75, [14], 'world1', 'world', 'Old treasures are kept here.'],
      ['artisanvillage', 'Artisan Village', 'Làng Nghề', 'world', 4, 3, 'w', 78, [14], 'world1', 'world', 'Craftspeople make pots, silk and lamps.'],
      ['templecomplex', 'Temple Complex', 'Quần thể Đền', 'world', 5, 4, 'w', 82, [14], 'world1', 'world', 'Many temples around one big courtyard.'],
      ['organicfarm', 'Organic Farm', 'Nông trại Hữu cơ', 'farm', 4, 4, 'a', 77, [15], 'port2', 'port', 'Fresh vegetables grow without chemicals.'],
      ['treehouse', 'Tree House Hotel', 'Khách sạn Nhà Cây', 'shop', 3, 3, 'm', 79, [15], 'town2', 'shop', 'Rooms high up in the trees.'],
      ['windpark', 'Wind Park', 'Công viên Gió', 'port', 3, 3, 'a', 80, [15], 'port2', 'port', 'Tall wind turbines make clean power.'],
      ['biodome', 'Bio Dome', 'Vòm Sinh học', 'park', 4, 4, 'a', 84, [15], 'world1', 'park', 'A glass garden of plants from all over the world.'],
      ['forestlodge', 'Forest Lodge', 'Nhà nghỉ Rừng Xanh', 'shop', 4, 3, 'm', 86, [15], 'town2', 'shop', 'A wooden lodge in the pine forest.'],
      ['seedbank', 'Seed Bank', 'Ngân hàng Hạt giống', 'edu', 3, 3, 'a', 90, [15], 'edu2', 'edu', 'It keeps seeds safe for the future.'],
      ['launchpad', 'Launch Pad', 'Bệ Phóng Tên lửa', 'trans', 4, 4, 'g', 89, [16], 'world1', 'port', 'Rockets lift off from here.'],
      ['missioncontrol', 'Mission Control', 'Trung tâm Điều khiển', 'edu', 4, 3, 'e', 92, [16], 'edu2', 'edu', 'People watch every rocket on big screens.'],
      ['rocketmuseum', 'Rocket Museum', 'Bảo tàng Tên lửa', 'edu', 4, 4, 'e', 95, [16], 'edu2', 'edu', 'See real rockets and space suits.'],
      ['planetdome', 'Planet Dome', 'Vòm Hành tinh', 'edu', 4, 4, 'e', 98, [16], 'edu2', 'edu', 'A huge dome shows the planets.'],
      ['lunarhab', 'Lunar Habitat', 'Căn cứ Mặt Trăng', 'home', 3, 3, 'g', 101, [16], 'home2', 'home', 'Homes made for life on the Moon.'],
      ['satellitearray', 'Satellite Dish Array', 'Dàn Ăng-ten Vệ tinh', 'trans', 3, 3, 't', 104, [16], 'world1', 'port', 'Big dishes talk to the satellites.'],
      ['fashionhouse', 'Fashion House', 'Nhà Thời trang', 'shop', 3, 3, 'c', 85, [17], 'town2', 'shop', 'Famous designers show new clothes.'],
      ['grandtheatre', 'Grand Theatre', 'Đại Nhà hát', 'world', 4, 4, 'w', 89, [17], 'world1', 'world', 'Plays and music under a golden roof.'],
      ['designstudio', 'Design Studio', 'Xưởng Thiết kế', 'edu', 3, 3, 'e', 93, [17], 'edu2', 'edu', 'Young artists draw and make models.'],
      ['artmuseum', 'Modern Art Museum', 'Bảo tàng Nghệ thuật Hiện đại', 'edu', 4, 4, 'e', 97, [17], 'edu2', 'edu', 'Colourful art in a white building.'],
      ['sculpturepark', 'Sculpture Park', 'Công viên Điêu khắc', 'park', 4, 4, 'p', 101, [17], 'world1', 'park', 'Giant statues stand among the trees.'],
      ['cinemapalace', 'Cinema Palace', 'Cung Điện Ảnh', 'fun', 4, 3, 'c', 105, [17], 'fun2', 'fun', 'The biggest screen in the city.'],
      ['rosevilla', 'Rose Villa', 'Biệt thự Hoa Hồng', 'home', 3, 3, 'r', 91, [18], 'home2', 'home', 'A pink villa full of roses.'],
      ['gardenhouse', 'Lake Garden House', 'Nhà Vườn Bên Hồ', 'home', 4, 3, 'r', 96, [18], 'home2', 'home', 'A big house with a garden and a pond.'],
      ['gardenmanor', 'Garden Manor', 'Dinh thự Vườn Hoa', 'home', 4, 4, 'r', 100, [18], 'home2', 'home', 'A manor surrounded by flower gardens.'],
      ['orchidhouse', 'Orchid House', 'Nhà Kính Lan', 'park', 3, 3, 'p', 103, [18], 'world1', 'park', 'Hundreds of orchids in a glass house.'],
      ['fountainpalace', 'Fountain Palace', 'Cung Đài Phun Nước', 'park', 4, 4, 'p', 108, [18], 'world1', 'park', 'Water dances in front of a white palace.'],
      ['sunsetmanor', 'Sunset Manor', 'Dinh thự Hoàng hôn', 'home', 5, 4, 'r', 112, [18], 'home2', 'home', 'A golden manor that shines at sunset.'],
      ['snowlodge', 'Snow Lodge', 'Nhà gỗ Tuyết', 'shop', 4, 3, 'm', 97, [19], 'town2', 'shop', 'A cosy wooden lodge covered with snow.'],
      ['icepalace', 'Ice Palace', 'Cung Điện Băng', 'fun', 4, 4, 'm', 100, [19], 'fun2', 'fun', 'A palace made of ice.'],
      ['skiresort', 'Ski Resort', 'Khu Trượt Tuyết', 'fun', 5, 4, 'f', 104, [19], 'fun2', 'fun', 'Ski lifts and slopes for everyone.'],
      ['icerink', 'Ice Rink', 'Sân Trượt Băng', 'sport', 4, 4, 'f', 107, [19], 'edu2', 'sport', 'Skate on shiny ice.'],
      ['aurorainn', 'Aurora Inn', 'Nhà nghỉ Cực Quang', 'shop', 3, 3, 'm', 110, [19], 'town2', 'shop', 'See the green lights in the sky.'],
      ['reindeerpark', 'Reindeer Park', 'Công viên Tuần lộc', 'park', 3, 3, 'p', 113, [19], 'world1', 'park', 'Reindeer play in the snow.'],
      ['grandyacht', 'Grand Yacht Club', 'CLB Du thuyền Lớn', 'fun', 4, 3, 'b', 103, [20], 'fun2', 'fun', 'White yachts wait in the harbour.'],
      ['cruiseterminal', 'Cruise Terminal', 'Bến Tàu Du lịch', 'port', 5, 4, 'h', 107, [20], 'port2', 'port', 'Big cruise ships stop here.'],
      ['grandbeacon', 'Grand Beacon', 'Hải đăng Lớn', 'port', 3, 3, 'h', 111, [20], 'port2', 'port', 'A very tall lighthouse guides the ships.'],
      ['seafoodhall', 'Seafood Hall', 'Chợ Hải sản', 'shop', 3, 3, 'h', 114, [20], 'town2', 'shop', 'Fresh fish, crab and shrimp.'],
      ['megacrane', 'Mega Crane', 'Cần cẩu Khổng lồ', 'port', 4, 3, 'h', 117, [20], 'port2', 'port', 'A giant crane lifts huge boxes.'],
      ['marinahotel', 'Marina Hotel', 'Khách sạn Bến Thuyền', 'shop', 4, 4, 'b', 119, [20], 'town2', 'shop', 'A tall hotel with a sea view.'],
      ['grandsphinx', 'Grand Sphinx', 'Nhân sư Vĩ đại', 'world', 4, 4, 'w', 109, [21], 'world1', 'world', 'A giant stone guardian of the desert.'],
      ['oasispalace', 'Oasis Palace', 'Cung Ốc đảo', 'world', 5, 4, 'w', 112, [21], 'world1', 'world', 'A palace beside a green oasis.'],
      ['desertarena', 'Desert Arena', 'Đấu trường Sa mạc', 'sport', 5, 5, 'g', 115, [21], 'edu2', 'sport', 'An arena built from golden stone.'],
      ['oasisgarden', 'Oasis Garden', 'Vườn Ốc đảo', 'park', 4, 4, 'w', 116, [21], 'world1', 'park', 'Palm trees and a blue pool in the desert.'],
      ['caravanstation', 'Caravan Station', 'Bến Lạc đà', 'trans', 4, 3, 't', 118, [21], 'world1', 'port', 'Camels and travellers rest here.'],
      ['sunpyramid', 'Sun Pyramid', 'Kim tự tháp Mặt Trời', 'world', 4, 4, 'w', 120, [21], 'world1', 'world', 'A pyramid with a shining sun on top.'],
      ['skyloft', 'Sky Loft Towers', 'Căn hộ Trên Trời', 'home', 4, 4, 'rc', 122, [0, 1], 'home2', 'home', 'Homes so high that clouds pass below.'],
      ['smartcityhall', 'Smart City Hall', 'Toà Thị chính Thông minh', 'civic', 5, 4, 's', 123, [0, 1], 'civic1', 'civic', 'The city is managed by smart screens.'],
      ['infinitymall', 'Infinity Mall', 'TTTM Vô Cực', 'shop', 5, 5, 'c', 125, [0, 1], 'town2', 'shop', 'A mall that seems to have no end.'],
      ['worldexpo', 'World Expo Hall', 'Hội chợ Thế giới', 'world', 5, 4, 'w', 128, [5], 'world1', 'world', 'Every country shows its best things.'],
      ['megahospital', 'Mega Hospital', 'Bệnh viện Siêu cấp', 'civic', 5, 4, 's', 129, [0, 1], 'civic1', 'civic', 'The biggest and smartest hospital.'],
      ['dreamland', 'Dreamland Park', 'Xứ Sở Mộng Mơ', 'fun', 6, 5, 'f', 131, [3], 'fun2', 'fun', 'A magic park full of rides.'],
      ['genomelab', 'Genome Institute', 'Viện Gen', 'edu', 4, 4, 'e', 134, [4], 'edu2', 'edu', 'Scientists read the code of life.'],
      ['hyperport', 'Hyper Port', 'Cảng Siêu tốc', 'trans', 6, 5, 't', 135, [9], 'world1', 'port', 'Trains and flying cars meet here.'],
      ['cloudgarden', 'Cloud Garden', 'Vườn Trên Mây', 'park', 6, 5, 'p', 137, [10], 'world1', 'park', 'A garden that floats above the city.'],
      ['helixresi', 'Helix Residences', 'Cao ốc Xoắn Ốc', 'home', 4, 4, 'rc', 140, [0, 1], 'home2', 'home', 'Two towers twist around each other.'],
      ['orbitalfactory', 'Orbital Factory', 'Nhà máy Quỹ đạo', 'port', 5, 4, 'i', 141, [2], 'port2', 'port', 'A factory that makes parts for space.'],
      ['solartower', 'Solar Tower', 'Tháp Mặt Trời', 'shop', 4, 4, 'c', 143, [0, 1], 'town2', 'shop', 'A tower covered with golden solar glass.'],
      ['spacearena', 'Space Arena', 'Đấu trường Vũ trụ', 'sport', 6, 6, 'g', 146, [11], 'edu2', 'sport', 'Games are played under a star dome.'],
      ['dreamacademy', 'Dream Academy', 'Học viện Giấc mơ', 'edu', 5, 4, 'e', 147, [4], 'edu2', 'edu', 'Students learn to make their dreams real.'],
      ['skyrail', 'Sky Rail Station', 'Ga Đường Ray Trời', 'trans', 6, 4, 't', 149, [9], 'world1', 'port', 'Trains run on rails in the sky.'],
      ['moonshrine', 'Moon Shrine', 'Điện Trăng', 'world', 5, 5, 'w', 152, [5], 'world1', 'world', 'A white shrine that glows like the Moon.'],
      ['stardome', 'Star Dome', 'Vòm Sao', 'fun', 6, 6, 'f', 153, [3], 'fun2', 'fun', 'A dome full of stars and shows.'],
      ['cityinbubble', 'Bubble City', 'Thành phố Bong bóng', 'home', 5, 5, 'rc', 155, [0, 1], 'home2', 'home', 'A whole neighbourhood inside a glass bubble.'],
      ['galaxycoaster', 'Galaxy Coaster', 'Tàu lượn Thiên hà', 'fun', 6, 5, 'f', 158, [3], 'fun2', 'fun', 'A roller coaster through the stars.'],
      ['zenisland', 'Zen Island', 'Đảo Thiền', 'park', 6, 6, 'p', 159, [10], 'world1', 'park', 'A quiet island with a pond and a temple.'],
      ['timeuniversity', 'Time University', 'Đại học Thời gian', 'edu', 5, 5, 'e', 161, [4], 'edu2', 'edu', 'A university with a giant clock.'],
      ['diamondexchange', 'Diamond Exchange', 'Sàn Kim cương', 'shop', 4, 4, 'c', 164, [0, 1], 'town2', 'shop', 'A bank built like a diamond.'],
      ['infinitelibrary', 'Infinite Library', 'Thư viện Vô Tận', 'civic', 5, 5, 's', 165, [0, 1], 'civic1', 'civic', 'A library with endless shelves.'],
      ['edenpark', 'Eden Park', 'Vườn Địa đàng', 'park', 7, 6, 'p', 167, [10], 'world1', 'park', 'The most beautiful park in the world.'],
      ['fusioncore', 'Fusion Core', 'Lõi Nhiệt hạch Lớn', 'port', 5, 5, 'i', 170, [2], 'port2', 'port', 'A bright core that powers the whole region.'],
      ['phoenixmonument', 'Phoenix Monument', 'Đài Phượng Hoàng', 'world', 4, 4, 'w', 172, [5], 'world1', 'world', 'A fire bird spreads its wings.'],
      ['aethersky', 'Aether Skycity', 'Thiên Đô Aether', 'home', 5, 5, 'rc', 174, [0, 1], 'home2', 'home', 'A city of towers connected by bridges.'],
      ['solargames', 'Solar Games Stadium', 'Sân Thế vận Mặt Trời', 'sport', 7, 6, 'g', 176, [11], 'edu2', 'sport', 'The greatest stadium under a sun sphere.'],
      ['eternityspire', 'Eternity Spire', 'Tháp Vĩnh Cửu', 'shop', 5, 5, 'c', 178, [0, 1], 'town2', 'shop', 'A spire that touches the sky.'],
      ['eternalmonument', 'Eternal Monument', 'Đài Vĩnh Cửu EWT', 'world', 5, 5, 'w', 180, [5], 'world1', 'world', 'The final honour for a legendary city.']
    ];
    var nice = function (n) { var m = Math.pow(10, Math.max(0, String(Math.round(n)).length - 3)); return Math.round(n / m) * m; };
    T.forEach(function (r) {
      var lvl = r[7], area = r[4] * r[5], cost = nice(60000 * Math.pow(lvl / 20, 2.4) * Math.pow(area / 12, .6)), secs = Math.min(2400, Math.max(900, Math.round(cost / 80))), kind = r[10], inc = 0, pop = 0, hp = 0;
      if (kind === 'home') { inc = Math.round(cost / 21); pop = Math.round(cost / 85); }
      else if (kind === 'civic') { hp = 60 + Math.round(lvl * 1.6); }
      else if (kind === 'edu') { inc = Math.round(cost / 16); hp = 80 + Math.round(lvl * 1.5); }
      else if (kind === 'shop') { inc = Math.round(cost / 15); hp = 1; }
      else if (kind === 'fun') { inc = Math.round(cost / 12); hp = 6 + Math.round(lvl / 4); }
      else if (kind === 'sport') { inc = Math.round(cost / 13); hp = 8 + Math.round(lvl / 4); }
      else if (kind === 'park') { inc = Math.round(cost / 18); hp = 40 + Math.round(lvl * 1.2); }
      else if (kind === 'world') { inc = Math.round(cost / 16); hp = 60 + Math.round(lvl * 1.4); }
      else { inc = Math.round(cost / 12); hp = r[3] === 'trans' ? 6 : 0; }
      ITEMS.push(B(r[0], r[1], r[2], r[3], r[4], r[5], r[6], lvl, cost, secs, inc, pop, hp, r[8], r[11], { ch: r[9] }));
    });
  })();
  /* ───── đợt mở rộng "kiến trúc & cảnh quan": 64 kiểu nhà ở, 40 công viên cảnh quan, 37 đồ trang trí (cấp 2–175) — đồ hoạ ở js/city-art6.js ───── */
  (function () {
    var ALLD = []; for (var q = 0; q < 22; q++) ALLD.push(q);
    // [mã, en, vi, loại, w, h, khu, cấp, quận, chương, kiểu, mô tả, giá]
    var T = [
      ['gardencottage', 'Garden Cottage', 'Nhà vườn xinh', 'home', 2, 2, 'r', 3, [0, 6, 8], 'home2', 'home', 'A tiny home with a flower garden.', 327],
      ['pinkcottage', 'Pink Cottage', 'Nhà hồng nhỏ', 'home', 2, 2, 'r', 9, [0, 6, 8], 'home2', 'home', 'A sweet pink house with a red roof.', 4570],
      ['mintcottage', 'Mint Cottage', 'Nhà bạc hà', 'home', 2, 2, 'r', 15, [0, 6, 8], 'home2', 'home', 'A cool green cottage under tall trees.', 15600],
      ['seasidecottage', 'Seaside Cottage', 'Nhà ven biển', 'home', 2, 2, 'r', 21, [0, 6, 8], 'home2', 'home', 'A blue house where you can hear the waves.', 34900],
      ['bluetown', 'Blue Townhouse', 'Nhà phố xanh', 'home', 2, 2, 'r', 6, [0, 6, 8], 'home2', 'home', 'A tall blue house with a balcony.', 1730],
      ['rosetown', 'Rose Townhouse', 'Nhà phố hồng', 'home', 2, 2, 'r', 13, [0, 6, 8], 'home2', 'home', 'A pink city house with flowers.', 11000],
      ['creamtown', 'Cream Townhouse', 'Nhà phố kem', 'home', 2, 2, 'r', 27, [0, 6, 8], 'home2', 'home', 'A warm cream townhouse with a brown roof.', 63800],
      ['medivilla', 'Mediterranean Villa', 'Biệt thự Địa Trung Hải', 'home', 3, 3, 'rc', 11, [0, 1, 6, 8], 'home2', 'home', 'White walls, a tower and orange roof tiles.', 12000],
      ['sunvilla', 'Sunny Villa', 'Biệt thự Nắng Vàng', 'home', 3, 3, 'rc', 26, [0, 1, 6, 8], 'home2', 'home', 'A golden villa that loves the sun.', 94800],
      ['seaviewvilla', 'Sea-view Villa', 'Biệt thự Hướng Biển', 'home', 3, 3, 'rc', 42, [0, 1, 6, 8], 'home2', 'home', 'A white villa with a blue roof by the sea.', 300000],
      ['redbarnhouse', 'Red Farmhouse', 'Nhà nông trại đỏ', 'home', 3, 3, 'rc', 8, [0, 1, 6, 8], 'home2', 'home', 'A red barn house with a tall silo.', 5600],
      ['goldfarmhouse', 'Golden Farmhouse', 'Nhà nông trại vàng', 'home', 3, 3, 'rc', 30, [0, 1, 6, 8], 'home2', 'home', 'A golden farm house in the wheat fields.', 134000],
      ['pagodahome', 'Pagoda House', 'Nhà mái chùa', 'home', 3, 3, 'rc', 14, [0, 1, 6, 8], 'home2', 'home', 'A home with two curved roofs.', 21400],
      ['jadepagoda', 'Jade Pagoda House', 'Nhà chùa Ngọc', 'home', 3, 3, 'rc', 38, [0, 1, 6, 8], 'home2', 'home', 'A calm green pagoda house.', 236000],
      ['modernbox', 'Modern Box House', 'Nhà hộp hiện đại', 'home', 3, 3, 'rc', 17, [0, 1, 6, 8], 'home2', 'home', 'Two white boxes with big glass windows.', 34200],
      ['ecomodern', 'Eco Modern House', 'Nhà hiện đại xanh', 'home', 3, 3, 'rc', 33, [0, 1, 6, 8], 'home2', 'home', 'A green modern house with solar glass.', 168000],
      ['luxmodern', 'Luxury Modern Villa', 'Biệt thự hiện đại sang', 'home', 4, 3, 'rc', 55, [0, 1, 6, 8], 'home2', 'home', 'A black and white villa with a pool.', 680000],
      ['alpinelodge', 'Alpine Chalet', 'Nhà gỗ núi tuyết', 'home', 3, 3, 'rc', 12, [0, 1, 6, 8], 'home2', 'home', 'A wooden chalet with a snowy roof.', 14800],
      ['mountainlodge', 'Mountain Lodge', 'Nhà nghỉ núi', 'home', 3, 3, 'rc', 29, [0, 1, 6, 8], 'home2', 'home', 'A big brown lodge among the pines.', 123000],
      ['tudorhouse', 'Tudor House', 'Nhà kiểu Tudor', 'home', 3, 3, 'rc', 19, [0, 1, 6, 8], 'home2', 'home', 'A white house with dark wooden beams.', 44600],
      ['tudormanor', 'Grand Tudor Manor', 'Dinh thự Tudor', 'home', 4, 3, 'rc', 46, [0, 1, 6, 8], 'home2', 'home', 'A large old manor with beams and chimneys.', 443000],
      ['littlecastle', 'Little Castle', 'Lâu đài nhỏ', 'home', 4, 4, 'rc', 36, [0, 1, 6, 8], 'home2', 'home', 'Four towers and a flag: a castle of your own.', 292000],
      ['royalcastle', 'Royal Castle', 'Lâu đài Hoàng gia', 'home', 5, 5, 'rc', 62, [0, 1, 6, 8], 'home2', 'home', 'A royal castle with red towers.', 1410000],
      ['icecastle', 'Ice Castle', 'Lâu đài Băng', 'home', 5, 4, 'rc', 88, [0, 1, 6, 8], 'home2', 'home', 'A castle that glitters like ice.', 2850000],
      ['windmillhome', 'Windmill House', 'Nhà cối xay gió', 'home', 3, 3, 'rc', 24, [0, 1, 6, 8], 'home2', 'home', 'A house with a turning windmill.', 78200],
      ['redwindmill', 'Red Windmill Farm', 'Trại cối xay đỏ', 'home', 4, 3, 'rc', 50, [0, 1, 6, 8], 'home2', 'home', 'A big windmill farm on the hill.', 541000],
      ['lighthousehome', 'Lighthouse Home', 'Nhà hải đăng', 'home', 3, 3, 'rc', 28, [0, 1, 6, 8], 'home2', 'home', 'You live next to a red and white lighthouse.', 113000],
      ['goldlighthouse', 'Golden Lighthouse Home', 'Nhà hải đăng Vàng', 'home', 3, 3, 'rc', 66, [0, 1, 6, 8], 'home2', 'home', 'A lighthouse with golden stripes.', 886000],
      ['igloohome', 'Igloo House', 'Nhà tuyết', 'home', 2, 2, 'r', 16, [0, 6, 8], 'home2', 'home', 'A round white home for cold days.', 18200],
      ['geodome', 'Geodesic Dome Home', 'Nhà mái vòm', 'home', 3, 3, 'rc', 40, [0, 1, 6, 8], 'home2', 'home', 'A round eco-home with a smooth dome.', 266000],
      ['terracehome', 'Terrace Home', 'Nhà bậc thang', 'home', 3, 3, 'rc', 31, [0, 1, 6, 8], 'home2', 'home', 'A home with garden roofs like stairs.', 145000],
      ['terracegreen', 'Green Terrace Home', 'Nhà bậc thang xanh', 'home', 4, 3, 'rc', 57, [0, 1, 6, 8], 'home2', 'home', 'Every level has a green garden.', 741000],
      ['ranchhouse', 'Ranch House', 'Nhà trang trại ngang', 'home', 4, 3, 'rc', 22, [0, 1, 6, 8], 'home2', 'home', 'A long one-floor house with a garage.', 75400],
      ['whiteranch', 'White Ranch House', 'Nhà ngang trắng', 'home', 4, 3, 'rc', 47, [0, 1, 6, 8], 'home2', 'home', 'A white house with a big garage.', 466000],
      ['yurthome', 'Yurt Home', 'Nhà lều tròn', 'home', 2, 2, 'r', 10, [0, 6, 8], 'home2', 'home', 'A round tent-house with a red roof.', 5880],
      ['grandyurt', 'Grand Yurt', 'Lều tròn lớn', 'home', 3, 3, 'rc', 35, [0, 1, 6, 8], 'home2', 'home', 'A big white yurt for the whole family.', 193000],
      ['boathomehouse', 'Boat House', 'Nhà bến thuyền', 'home', 3, 3, 'rc', 25, [0, 1, 6, 8], 'home2', 'home', 'A house on the water with its own boat.', 86300],
      ['harbourhouse', 'Harbour House', 'Nhà bến cảng', 'home', 4, 3, 'rc', 52, [0, 1, 6, 8], 'home2', 'home', 'A big house with a pier and a sailboat.', 594000],
      ['glasshome', 'Glasshouse Home', 'Nhà kính', 'home', 3, 3, 'rc', 32, [0, 1, 6, 8], 'home2', 'home', 'A house made of glass and plants.', 156000],
      ['crystalglass', 'Crystal Glasshouse', 'Nhà kính Pha Lê', 'home', 4, 3, 'rc', 72, [0, 1, 6, 8], 'home2', 'home', 'Purple glass shines in the sun.', 1300000],
      ['colonialhome', 'Colonial House', 'Nhà thuộc địa', 'home', 4, 3, 'rc', 27, [0, 1, 6, 8], 'home2', 'home', 'A white house with tall columns.', 123000],
      ['colonialgrand', 'Grand Colonial', 'Dinh thự thuộc địa', 'home', 5, 4, 'rc', 64, [0, 1, 6, 8], 'home2', 'home', 'A very grand white mansion.', 1330000],
      ['turrethome', 'Turret House', 'Nhà tháp nhọn', 'home', 3, 3, 'rc', 18, [0, 1, 6, 8], 'home2', 'home', 'A pink house with a pointed tower.', 39200],
      ['purpleturret', 'Purple Turret House', 'Nhà tháp Tím', 'home', 3, 3, 'rc', 41, [0, 1, 6, 8], 'home2', 'home', 'A purple house like a fairy tale.', 283000],
      ['cubehome', 'Cube House', 'Nhà khối lập phương', 'home', 3, 3, 'rc', 23, [0, 1, 6, 8], 'home2', 'home', 'Two simple cubes of white and wood.', 70600],
      ['woodcube', 'Wooden Cube House', 'Nhà khối gỗ', 'home', 3, 3, 'rc', 49, [0, 1, 6, 8], 'home2', 'home', 'A warm wooden cube in the garden.', 434000],
      ['logcabinxl', 'Log Cabin XL', 'Nhà gỗ lớn', 'home', 3, 3, 'rc', 20, [0, 1, 6, 8], 'home2', 'home', 'A strong log cabin with a stone chimney.', 50500],
      ['pinecabin', 'Pine Cabin', 'Nhà gỗ thông', 'home', 3, 3, 'rc', 44, [0, 1, 6, 8], 'home2', 'home', 'A cabin deep in the pine forest.', 335000],
      ['adobehome', 'Desert Adobe', 'Nhà đất sa mạc', 'home', 3, 3, 'rc', 20, [0, 1, 6, 8], 'home2', 'home', 'A clay house that stays cool in the desert.', 50500],
      ['oasisadobe', 'Oasis Adobe', 'Nhà đất Ốc đảo', 'home', 4, 3, 'rc', 54, [0, 1, 6, 8], 'home2', 'home', 'A big clay house near the oasis.', 651000],
      ['hobbithill', 'Hill House', 'Nhà đồi cỏ', 'home', 3, 3, 'rc', 13, [0, 1, 6, 8], 'home2', 'home', 'A home inside a green hill with a round door.', 18000],
      ['goldhill', 'Golden Door Hill House', 'Nhà đồi Cửa Vàng', 'home', 4, 4, 'rc', 60, [0, 1, 6, 8], 'home2', 'home', 'A grand hill house with a golden door.', 996000],
      ['riad', 'Desert Riad', 'Nhà sân trong', 'home', 3, 3, 'rc', 34, [0, 1, 6, 8], 'home2', 'home', 'A house with a pool in the courtyard.', 180000],
      ['grandriad', 'Grand Riad', 'Dinh sân trong', 'home', 4, 4, 'rc', 70, [0, 1, 6, 8], 'home2', 'home', 'Four domes and a blue pool.', 1440000],
      ['cliffhome', 'Cliff House', 'Nhà vách đá', 'home', 3, 3, 'rc', 39, [0, 1, 6, 8], 'home2', 'home', 'A cosy house on a high rock.', 251000],
      ['cliffgrand', 'Cliff Manor', 'Dinh thự vách đá', 'home', 4, 4, 'rc', 78, [0, 1, 6, 8], 'home2', 'home', 'A big manor above the sea.', 1870000],
      ['courtyardcondo', 'Courtyard Condo', 'Chung cư sân vườn', 'home', 3, 3, 'rc', 15, [0, 1, 6, 8], 'home2', 'home', 'Three floors of homes with trees.', 25300],
      ['skycondo', 'Sky Condo', 'Chung cư Trời Xanh', 'home', 4, 3, 'rc', 37, [0, 1, 6, 8], 'home2', 'home', 'A blue condo with a roof garden.', 263000],
      ['gardencondo', 'Garden Condo', 'Chung cư Vườn', 'home', 4, 4, 'rc', 76, [0, 1, 6, 8], 'home2', 'home', 'Green stripes and flowers on every floor.', 1760000],
      ['skycastle', 'Sky Castle', 'Lâu đài Trên Mây', 'home', 5, 5, 'rc', 110, [0, 1, 6, 8], 'home2', 'home', 'A violet castle above the clouds.', 5580000],
      ['sunmanor', 'Sun Manor', 'Dinh thự Mặt Trời', 'home', 5, 4, 'rc', 125, [0, 1, 6, 8], 'home2', 'home', 'A manor of gold and sunshine.', 6630000],
      ['diamondglass', 'Diamond Glasshouse', 'Nhà kính Kim Cương', 'home', 5, 4, 'rc', 140, [0, 1, 6, 8], 'home2', 'home', 'A huge glass house that sparkles.', 8700000],
      ['legendcastle', 'Legend Castle', 'Lâu đài Huyền Thoại', 'home', 6, 5, 'rc', 160, [0, 1, 6, 8], 'home2', 'home', 'The greatest castle in the whole city.', 15300000],
      ['eternalpagoda', 'Eternal Pagoda House', 'Nhà chùa Vĩnh Hằng', 'home', 5, 5, 'rc', 175, [0, 1, 6, 8], 'home2', 'home', 'A golden pagoda that never ages.', 17000000],
      ['duckpond', 'Duck Pond', 'Hồ vịt', 'park', 3, 3, '*', 4, ALLD, 'world1', 'park', 'Ducks swim in a small blue pond.', 1060],
      ['lilypond', 'Lily Pond', 'Hồ sen nhỏ', 'park', 3, 3, '*', 12, ALLD, 'world1', 'park', 'Green lily pads float on the water.', 14800],
      ['fountainsquare', 'Fountain Square', 'Quảng trường đài phun', 'park', 4, 4, '*', 7, ALLD, 'world1', 'park', 'A big fountain with flower beds.', 5740],
      ['royalfountain', 'Royal Fountain', 'Đài phun Hoàng gia', 'park', 5, 5, '*', 35, ALLD, 'world1', 'park', 'A grand fountain for a royal garden.', 357000],
      ['gazebogarden', 'Garden Gazebo', 'Vườn có chòi', 'park', 3, 3, '*', 9, ALLD, 'world1', 'park', 'A little pavilion for a quiet rest.', 7430],
      ['rosegazebo', 'Rose Gazebo', 'Chòi hoa hồng', 'park', 4, 4, '*', 27, ALLD, 'world1', 'park', 'A red pavilion among rose bushes.', 147000],
      ['koipool', 'Koi Pond', 'Ao cá Koi', 'park', 3, 3, '*', 14, ALLD, 'world1', 'park', 'Orange and white koi swim under a red bridge.', 21400],
      ['koigarden', 'Koi Garden', 'Vườn cá Koi', 'park', 4, 4, '*', 43, ALLD, 'world1', 'park', 'A large Japanese garden with a stone lantern.', 448000],
      ['zenyard', 'Zen Garden', 'Vườn thiền', 'park', 3, 3, '*', 16, ALLD, 'world1', 'park', 'Raked sand, big rocks and a red gate.', 29600],
      ['grandzen', 'Grand Zen Garden', 'Vườn thiền Lớn', 'park', 5, 4, '*', 58, ALLD, 'world1', 'park', 'A peaceful garden as big as a temple yard.', 1050000],
      ['tulipfield', 'Tulip Field', 'Cánh đồng tulip', 'park', 4, 3, '*', 11, ALLD, 'world1', 'park', 'Rows and rows of colourful tulips.', 14300],
      ['lavenderfield', 'Lavender Field', 'Cánh đồng oải hương', 'park', 4, 3, '*', 18, ALLD, 'world1', 'park', 'A purple field that smells so sweet.', 46600],
      ['sunflowerfield', 'Sunflower Field', 'Cánh đồng hướng dương', 'park', 4, 3, '*', 24, ALLD, 'world1', 'park', 'Tall sunflowers all face the sun.', 92900],
      ['poppyfield', 'Poppy Field', 'Cánh đồng anh túc đỏ', 'park', 4, 4, '*', 31, ALLD, 'world1', 'park', 'A red field with a small barn.', 204000],
      ['hedgemaze', 'Hedge Maze', 'Mê cung cây xanh', 'park', 4, 4, '*', 21, ALLD, 'world1', 'park', 'Can you find the way to the middle?', 80200],
      ['grandmaze', 'Grand Maze', 'Mê cung Lớn', 'park', 6, 5, '*', 63, ALLD, 'world1', 'park', 'A huge maze with a statue in the middle.', 1630000],
      ['appleorchard', 'Apple Orchard', 'Vườn táo', 'park', 4, 4, '*', 13, ALLD, 'world1', 'park', 'Rows of apple trees full of red fruit.', 25400],
      ['cherryorchard', 'Cherry Orchard', 'Vườn anh đào', 'park', 5, 4, '*', 45, ALLD, 'world1', 'park', 'Pink blossoms make a sweet cloud.', 571000],
      ['picnicmeadow', 'Picnic Meadow', 'Bãi cỏ dã ngoại', 'park', 4, 3, '*', 8, ALLD, 'world1', 'park', 'Blankets, baskets and balloons on the grass.', 6650],
      ['festivalmeadow', 'Festival Meadow', 'Bãi hội hoa', 'park', 5, 4, '*', 38, ALLD, 'world1', 'park', 'A huge meadow for picnics and parties.', 380000],
      ['waterfallpark', 'Waterfall Park', 'Công viên thác nước', 'park', 4, 4, '*', 29, ALLD, 'world1', 'park', 'A waterfall pours into a blue pool.', 174000],
      ['bamboogrove', 'Bamboo Grove', 'Rừng tre', 'park', 4, 4, '*', 19, ALLD, 'world1', 'park', 'Tall green bamboo whispers in the wind.', 63000],
      ['ricefields', 'Rice Terraces', 'Ruộng bậc thang', 'park', 5, 4, '*', 33, ALLD, 'world1', 'park', 'Green steps climb up the hill.', 271000],
      ['teaterraces', 'Tea Terraces', 'Đồi chè bậc thang', 'park', 5, 4, '*', 51, ALLD, 'world1', 'park', 'Rows of tea plants on soft hills.', 771000],
      ['icerinkpark', 'Ice Rink Park', 'Sân trượt băng', 'park', 4, 4, '*', 26, ALLD, 'world1', 'park', 'Skate on shiny ice with friends.', 134000],
      ['skateplaza', 'Skate Park', 'Công viên trượt ván', 'park', 3, 3, '*', 17, ALLD, 'world1', 'park', 'Ramps and a bar for tricks.', 34200],
      ['botanicdome', 'Botanic Dome', 'Nhà kính thực vật', 'park', 4, 4, '*', 48, ALLD, 'world1', 'park', 'A glass dome full of rare flowers.', 583000],
      ['lakesidepark', 'Lakeside Park', 'Công viên bên hồ', 'park', 5, 4, '*', 25, ALLD, 'world1', 'park', 'Sailboats on a calm blue lake.', 139000],
      ['rosegarden', 'Rose Garden', 'Vườn hồng', 'park', 4, 3, '*', 22, ALLD, 'world1', 'park', 'Arches full of red and pink roses.', 75400],
      ['cactusgarden', 'Cactus Garden', 'Vườn xương rồng', 'park', 3, 3, '*', 15, ALLD, 'world1', 'park', 'Tall cacti and a tiny oasis.', 25300],
      ['palmlagoon', 'Palm Lagoon', 'Vịnh cọ', 'park', 4, 4, '*', 40, ALLD, 'world1', 'park', 'Palm trees around a turquoise lagoon.', 376000],
      ['fairyglade', 'Fairy Glade', 'Khu rừng cổ tích', 'park', 4, 4, '*', 53, ALLD, 'world1', 'park', 'Giant mushrooms and tiny glowing lights.', 739000],
      ['snowmanpark', 'Snowman Park', 'Công viên người tuyết', 'park', 4, 4, '*', 28, ALLD, 'world1', 'park', 'Three snowmen in warm scarves.', 160000],
      ['sculpturegarden', 'Sculpture Garden', 'Vườn tượng', 'park', 4, 4, '*', 67, ALLD, 'world1', 'park', 'Colourful statues on white stands.', 1300000],
      ['pumpkinfarm', 'Pumpkin Patch', 'Ruộng bí ngô', 'park', 4, 3, '*', 20, ALLD, 'world1', 'park', 'Orange pumpkins and a friendly scarecrow.', 60000],
      ['openairtheatre', 'Open-air Theatre', 'Sân khấu ngoài trời', 'park', 4, 4, '*', 56, ALLD, 'world1', 'park', 'Stone seats around a wooden stage.', 844000],
      ['kidsgarden', 'Kids Garden', 'Vườn trẻ em', 'park', 3, 3, '*', 10, ALLD, 'world1', 'park', 'Swings, a slide and a sandpit.', 9570],
      ['crystallake', 'Crystal Lake Park', 'Công viên Hồ Pha Lê', 'park', 6, 5, '*', 90, ALLD, 'world1', 'park', 'A big shining lake with sailboats.', 3840000],
      ['royalgardens', 'Royal Gardens', 'Vườn Hoàng Gia', 'park', 6, 6, '*', 120, ALLD, 'world1', 'park', 'Fountains and flowers fit for a king.', 8550000],
      ['paradisegarden', 'Paradise Garden', 'Vườn Thiên Đường', 'park', 6, 6, '*', 150, ALLD, 'world1', 'park', 'A magic garden that glows at night.', 14600000],
      ['wishingwell', 'Wishing Well', 'Giếng ước', 'orna', 1, 1, '*', 2, ALLD, 'world1', 'deco', 'Make a wish and throw a coin.', 177],
      ['redmailbox', 'Red Mailbox', 'Hòm thư đỏ', 'orna', 1, 1, '*', 2, ALLD, 'world1', 'deco', 'Letters for everyone.', 177],
      ['woodsign', 'Signpost', 'Biển chỉ đường', 'orna', 1, 1, '*', 3, ALLD, 'world1', 'deco', 'Which way to go?', 280],
      ['treepotp', 'Potted Tree', 'Cây chậu', 'tree', 1, 1, '*', 3, ALLD, 'world1', 'deco', 'A small tree in a clay pot.', 280],
      ['haystack', 'Haystack', 'Đống rơm', 'orna', 1, 1, '*', 4, ALLD, 'world1', 'deco', 'Soft golden straw.', 403],
      ['birdbath', 'Bird Bath', 'Bể chim tắm', 'orna', 1, 1, '*', 4, ALLD, 'world1', 'deco', 'Little birds love to splash.', 403],
      ['gardensundial', 'Sundial', 'Đồng hồ mặt trời', 'orna', 1, 1, '*', 5, ALLD, 'world1', 'deco', 'Tells the time with a shadow.', 545],
      ['pumpkins', 'Pumpkins', 'Bí ngô', 'orna', 1, 1, '*', 5, ALLD, 'world1', 'deco', 'Three round orange pumpkins.', 545],
      ['beachumbrella', 'Beach Umbrella', 'Dù đi biển', 'orna', 1, 1, '*', 5, ALLD, 'world1', 'deco', 'Shade and a towel.', 545],
      ['barrels', 'Barrels', 'Thùng gỗ', 'orna', 1, 1, '*', 5, ALLD, 'world1', 'deco', 'Wooden barrels in a stack.', 545],
      ['blossomarch', 'Flower Arch', 'Cổng hoa', 'orna', 1, 1, '*', 6, ALLD, 'world1', 'deco', 'Walk under the flowers.', 703],
      ['bigmushroom', 'Giant Mushroom', 'Nấm khổng lồ', 'orna', 1, 1, '*', 6, ALLD, 'world1', 'deco', 'Red with white dots.', 703],
      ['campingtent', 'Camping Tent', 'Lều cắm trại', 'orna', 1, 1, '*', 6, ALLD, 'world1', 'deco', 'A cosy red tent.', 703],
      ['swing', 'Garden Swing', 'Xích đu', 'orna', 1, 1, '*', 7, ALLD, 'world1', 'deco', 'Swing high and low.', 877],
      ['campfire', 'Campfire', 'Lửa trại', 'orna', 1, 1, '*', 7, ALLD, 'world1', 'deco', 'Warm and bright at night.', 877],
      ['snowman', 'Snowman', 'Người tuyết', 'orna', 1, 1, '*', 8, ALLD, 'world1', 'deco', 'He wears a hat and a scarf.', 1060],
      ['fruitcart', 'Fruit Cart', 'Xe trái cây', 'orna', 1, 1, '*', 8, ALLD, 'world1', 'deco', 'Apples, oranges and limes.', 1060],
      ['beehive', 'Beehive', 'Tổ ong', 'orna', 1, 1, '*', 8, ALLD, 'world1', 'deco', 'Bees make sweet honey.', 1060],
      ['hammock', 'Hammock', 'Võng', 'orna', 1, 1, '*', 9, ALLD, 'world1', 'deco', 'Relax between two posts.', 1270],
      ['totem', 'Totem Pole', 'Cột Totem', 'orna', 1, 1, '*', 9, ALLD, 'world1', 'deco', 'Four colourful faces.', 1270],
      ['kite', 'Colourful Kite', 'Diều bay', 'orna', 1, 1, '*', 9, ALLD, 'world1', 'deco', 'It dances in the wind.', 1270],
      ['flowerpergola', 'Flower Pergola', 'Giàn hoa', 'orna', 2, 1, '*', 10, ALLD, 'world1', 'deco', 'Shade under green leaves.', 1540],
      ['rowboat', 'Rowboat', 'Thuyền chèo', 'orna', 1, 1, '*', 10, ALLD, 'world1', 'deco', 'A small boat for the lake.', 1480],
      ['anchor', 'Ship Anchor', 'Neo tàu', 'orna', 1, 1, '*', 11, ALLD, 'world1', 'deco', 'A strong sea anchor.', 1710],
      ['igloo', 'Igloo', 'Lều tuyết', 'orna', 1, 1, '*', 12, ALLD, 'world1', 'deco', 'A tiny home of ice.', 1940],
      ['flowertower', 'Flower Tower', 'Tháp hoa', 'flower', 1, 1, '*', 12, ALLD, 'world1', 'deco', 'Flowers on three levels.', 1940],
      ['gardenlantern', 'Stone Lantern', 'Đèn đá', 'orna', 1, 1, '*', 12, ALLD, 'world1', 'deco', 'It glows softly at night.', 1940],
      ['toywindmill', 'Little Windmill', 'Cối xay nhỏ', 'orna', 1, 1, '*', 13, ALLD, 'world1', 'deco', 'Its blades turn slowly.', 2190],
      ['toriigate', 'Red Torii Gate', 'Cổng Torii đỏ', 'orna', 1, 1, '*', 14, ALLD, 'world1', 'deco', 'A gate to a quiet place.', 2450],
      ['stoneobelisk', 'Obelisk', 'Tháp bia', 'orna', 1, 1, '*', 16, ALLD, 'world1', 'deco', 'A tall stone needle.', 3000],
      ['bust', 'Stone Bust', 'Tượng bán thân', 'orna', 1, 1, '*', 18, ALLD, 'world1', 'deco', 'A wise face on a stand.', 3590],
      ['telescope', 'Telescope', 'Kính thiên văn', 'orna', 1, 1, '*', 22, ALLD, 'world1', 'deco', 'Look at the stars.', 4880],
      ['gardenlion', 'Stone Lion', 'Sư tử đá', 'orna', 1, 1, '*', 24, ALLD, 'world1', 'deco', 'A lion guards the garden.', 5570],
      ['rainbowarch', 'Rainbow Arch', 'Cổng cầu vồng', 'orna', 1, 1, '*', 26, ALLD, 'world1', 'deco', 'Seven colours over your path.', 6300],
      ['hotballoon', 'Balloon Stand', 'Khinh khí cầu đỗ', 'orna', 1, 1, '*', 30, ALLD, 'world1', 'deco', 'A balloon waits for a flight.', 7850],
      ['crystalcluster', 'Crystal Cluster', 'Cụm pha lê', 'orna', 1, 1, '*', 34, ALLD, 'world1', 'deco', 'Glowing stones in three colours.', 9520],
      ['herostatue', 'Hero Statue', 'Tượng Anh hùng', 'orna', 1, 1, '*', 40, ALLD, 'world1', 'deco', 'A golden hero with a red cape.', 12200]
    ];
    T.forEach(function (r) {
      var kind = r[10], lvl = r[7], cost = r[12], area = r[4] * r[5], inc = 0, pop = 0, hp = 0, secs;
      if (kind === 'home') { inc = Math.round(cost / 21); pop = Math.round(cost / 85); }
      else if (kind === 'park') { inc = Math.round(cost / 22); hp = 14 + Math.round(lvl * 1.1) + area; }
      else { hp = 2 + Math.round(lvl / 6); }
      secs = kind === 'deco' ? Math.max(4, Math.min(300, Math.round(cost / 40))) : Math.max(8, Math.min(2400, Math.round(cost / (lvl < 23 ? 45 : 80))));
      ITEMS.push(B(r[0], r[1], r[2], r[3], r[4], r[5], r[6], lvl, cost, secs, inc, pop, hp, r[8].slice ? r[8].slice() : r[8], r[11], { ch: r[9] }));
    });
  })();
  /* ───── đợt kiến trúc mới lạ (tháp nghiêng, cổng trời, tháp kim, nhà vỏ sò, kim tự tháp kính, nhà hoa sen…) — đồ hoạ ở js/city-art7.js ───── */
  (function () {
    var ALLD = []; for (var q = 0; q < 22; q++) ALLD.push(q);
    var T = [
      ['stackhabitat', 'Stacked Habitat', 'Khối Nhà Xếp Tầng', 'home', 3, 3, 'rc', 7, [0, 1], 'home2', 'home', 'Boxes stacked like a hill, with gardens on every roof.', 4060],
      ['greenstack', 'Green Stack Homes', 'Nhà Xếp Tầng Xanh', 'home', 4, 3, 'rc', 34, [0, 1], 'home2', 'home', 'Stacked homes covered in plants.', 214000],
      ['sunstack', 'Sun Stack Residences', 'Căn Hộ Xếp Tầng Nắng', 'home', 4, 4, 'rc', 69, [0, 1], 'home2', 'home', 'Golden terraces that catch the sun.', 1390000],
      ['cloudstack', 'Cloud Stack Towers', 'Tháp Xếp Tầng Mây', 'home', 5, 4, 'rc', 118, [0, 1], 'home2', 'home', 'Terraces above the clouds.', 5770000],
      ['skygate', 'Sky Gate', 'Cổng Trời', 'shop', 3, 3, 'c', 19, [0, 1], 'world1', 'shop', 'Two towers joined by a big frame in the sky.', 44600],
      ['silvergate', 'Silver Gate Tower', 'Tháp Cổng Bạc', 'shop', 4, 3, 'c', 43, [0, 1], 'world1', 'shop', 'A silver gate for the business district.', 377000],
      ['goldgate', 'Golden Gate Plaza', 'Quảng Trường Cổng Vàng', 'shop', 4, 4, 'c', 81, [0, 1], 'world1', 'shop', 'A gate of golden glass.', 2050000],
      ['galaxygate', 'Galaxy Gate', 'Cổng Thiên Hà', 'shop', 5, 4, 'c', 132, [0, 1], 'world1', 'shop', 'Violet lights shine through the gate.', 7550000],
      ['leantower', 'Leaning Tower', 'Tháp Nghiêng', 'shop', 3, 3, 'c', 22, [0, 1], 'world1', 'shop', 'Every floor leans a little more.', 63500],
      ['rosetwist', 'Rose Leaning Tower', 'Tháp Nghiêng Hồng', 'home', 3, 3, 'rc', 46, [0, 1], 'home2', 'home', 'A pink tower that seems to dance.', 373000],
      ['jadelean', 'Jade Leaning Tower', 'Tháp Nghiêng Ngọc', 'shop', 4, 3, 'c', 72, [0, 1], 'world1', 'shop', 'A green tower of smooth glass.', 1300000],
      ['azurelean', 'Azure Leaning Tower', 'Tháp Nghiêng Lam', 'shop', 4, 4, 'c', 126, [0, 1], 'world1', 'shop', 'A blue tower leaning over the avenue.', 5910000],
      ['canton', 'Canton Needle', 'Tháp Eo Thắt', 'fun', 3, 3, 'f', 24, [3], 'world1', 'fun', 'A tall twisting tower with a thin waist.', 78200],
      ['amberhyper', 'Amber Hyper Tower', 'Tháp Eo Hổ Phách', 'fun', 3, 3, 'f', 52, [3], 'world1', 'fun', 'It glows amber at night.', 500000],
      ['rosehyper', 'Rose Hyper Tower', 'Tháp Eo Hồng', 'fun', 4, 4, 'f', 90, [3], 'world1', 'fun', 'A pink tower with a lit pod.', 2640000],
      ['stardyper', 'Star Hyper Tower', 'Tháp Eo Sao', 'fun', 4, 4, 'f', 152, [3], 'world1', 'fun', 'The tower of the stars.', 9270000],
      ['operahouse', 'Opera Sails', 'Nhà Hát Vỏ Sò', 'fun', 5, 4, 'f', 27, [3], 'world1', 'fun', 'White shells rise from the harbour.', 168000],
      ['pearlopera', 'Pearl Opera', 'Nhà Hát Ngọc Trai', 'fun', 5, 4, 'f', 60, [3], 'world1', 'fun', 'Pink-white shells like a pearl.', 1140000],
      ['seashellhall', 'Seashell Hall', 'Hội Trường Vỏ Ốc', 'civic', 4, 3, 's', 84, [0, 1], 'world1', 'civic', 'A hall that looks like a seashell.', 1880000],
      ['crystalopera', 'Crystal Opera', 'Nhà Hát Pha Lê', 'fun', 6, 5, 'f', 138, [3], 'world1', 'fun', 'Shells of blue glass.', 10700000],
      ['globehall', 'Globe Hall', 'Hội Trường Quả Cầu', 'world', 3, 3, 'w', 30, [5], 'world1', 'world', 'A big shining ball on four legs.', 134000],
      ['goldglobe', 'Golden Globe Center', 'Trung Tâm Cầu Vàng', 'world', 3, 3, 'w', 65, [5], 'world1', 'world', 'A golden ball above the plaza.', 854000],
      ['emeraldglobe', 'Emerald Globe', 'Cầu Ngọc Lục Bảo', 'world', 4, 4, 'w', 105, [5], 'world1', 'world', 'A green ball that glows at night.', 3820000],
      ['cosmosglobe', 'Cosmos Globe', 'Cầu Vũ Trụ', 'world', 4, 4, 'w', 165, [5], 'world1', 'world', 'A purple planet with a bright ring.', 11300000],
      ['twinbridge', 'Twin Bridge Towers', 'Tháp Đôi Nối Cầu', 'shop', 4, 3, 'c', 32, [0, 1], 'world1', 'shop', 'Two towers with a glass sky bridge.', 185000],
      ['pearltwin', 'Pearl Twin Towers', 'Tháp Đôi Ngọc', 'home', 4, 3, 'rc', 58, [0, 1], 'home2', 'home', 'Pearl towers with a bridge between them.', 773000],
      ['azuretwin', 'Azure Twin Towers', 'Tháp Đôi Lam', 'shop', 4, 4, 'c', 96, [0, 1], 'world1', 'shop', 'Blue twin towers.', 3080000],
      ['sunsettwin', 'Sunset Twin Towers', 'Tháp Đôi Hoàng Hôn', 'home', 5, 4, 'rc', 145, [0, 1], 'home2', 'home', 'Orange glass glows at sunset.', 9460000],
      ['glasspyramid', 'Glass Pyramid', 'Kim Tự Tháp Kính', 'civic', 4, 4, 's', 29, [0, 1], 'world1', 'civic', 'A glass pyramid full of light.', 174000],
      ['icepyramid', 'Ice Pyramid', 'Kim Tự Tháp Băng', 'edu', 4, 4, 'e', 55, [4], 'world1', 'edu', 'A pyramid of ice and science.', 808000],
      ['emeraldpyramid', 'Emerald Pyramid', 'Kim Tự Tháp Lục Bảo', 'world', 5, 5, 'w', 100, [5], 'world1', 'world', 'A green pyramid in the city centre.', 4440000],
      ['solarpyramid', 'Solar Pyramid', 'Kim Tự Tháp Mặt Trời', 'world', 5, 5, 'w', 160, [5], 'world1', 'world', 'It stores the power of the sun.', 13700000],
      ['wavehall', 'Wave Hall', 'Toà Mái Sóng', 'civic', 3, 3, 's', 21, [0, 1], 'world1', 'civic', 'A hall with a roof like waves.', 56800],
      ['seawave', 'Sea Wave Centre', 'Trung Tâm Mái Sóng Biển', 'fun', 4, 3, 'f', 48, [3], 'world1', 'fun', 'Blue waves on the roof.', 491000],
      ['aurorawave', 'Aurora Wave Museum', 'Bảo Tàng Sóng Cực Quang', 'edu', 5, 4, 'e', 92, [4], 'world1', 'edu', 'Colourful waves like the aurora.', 3180000],
      ['lotushall', 'Lotus Hall', 'Hội Trường Hoa Sen', 'world', 4, 4, 'w', 36, [5], 'world1', 'world', 'White petals open like a lotus.', 292000],
      ['pinklotus', 'Pink Lotus Temple', 'Đền Sen Hồng', 'world', 4, 4, 'w', 70, [5], 'world1', 'world', 'Pink petals around a quiet lake.', 1440000],
      ['goldlotus', 'Golden Lotus Palace', 'Cung Sen Vàng', 'world', 5, 5, 'w', 112, [5], 'world1', 'world', 'A golden lotus palace.', 5820000],
      ['jadelotus', 'Jade Lotus Garden', 'Vườn Sen Ngọc', 'park', 5, 5, '*', 148, ALLD, 'world1', 'park', 'A giant green lotus in the garden.', 11400000],
      ['trio', 'Trio Towers', 'Ba Tháp Kề Vai', 'shop', 4, 3, 'c', 25, [0, 1], 'world1', 'shop', 'Three towers of different heights.', 103000],
      ['silvertrio', 'Silver Trio', 'Bộ Ba Bạc', 'shop', 4, 4, 'c', 54, [0, 1], 'world1', 'shop', 'Silver glass towers side by side.', 773000],
      ['hightrio', 'Harbour Trio Residences', 'Căn Hộ Ba Tháp Cảng', 'home', 5, 4, 'rc', 85, [0, 1], 'home2', 'home', 'Three apartment towers by the harbour.', 2630000],
      ['aurotrio', 'Aurora Trio', 'Ba Tháp Cực Quang', 'shop', 5, 4, 'c', 136, [0, 1], 'world1', 'shop', 'Green and violet glass towers.', 8110000],
      ['spaceneedle', 'Space Needle', 'Tháp Kim Vũ Trụ', 'fun', 3, 3, 'f', 33, [3], 'world1', 'fun', 'A tall needle with a flying-saucer lookout.', 168000],
      ['rubyneedle', 'Ruby Needle', 'Tháp Kim Ruby', 'fun', 3, 3, 'f', 67, [3], 'world1', 'fun', 'A ruby-red lookout over the city.', 919000],
      ['skyneedle', 'Sky Needle Plus', 'Tháp Kim Trời Xanh', 'fun', 4, 4, 'f', 114, [3], 'world1', 'fun', 'A needle that touches the clouds.', 4650000],
      ['arcadegate', 'Arcade Gate', 'Toà Khung Cổng', 'shop', 4, 3, 'c', 38, [0, 1], 'world1', 'shop', 'A building shaped like a big gate.', 280000],
      ['grandarche', 'Grand Arche', 'Cổng Vòm Lớn', 'civic', 5, 4, 's', 76, [0, 1], 'world1', 'civic', 'A hollow cube you can see through.', 2010000],
      ['violetarche', 'Violet Arche', 'Cổng Vòm Tím', 'shop', 5, 5, 'c', 128, [0, 1], 'world1', 'shop', 'A violet gate of glass.', 8020000],
      ['greenziggurat', 'Green Ziggurat', 'Tháp Bậc Xanh', 'park', 4, 4, '*', 41, ALLD, 'world1', 'park', 'Round steps covered with gardens.', 399000],
      ['goldziggurat', 'Golden Ziggurat', 'Tháp Bậc Vàng', 'world', 4, 4, 'w', 78, [5], 'world1', 'world', 'A stepped tower with golden rings.', 1870000],
      ['cloudziggurat', 'Cloud Ziggurat', 'Tháp Bậc Mây', 'home', 5, 5, 'rc', 122, [0, 1], 'home2', 'home', 'Rounded terraces above the city.', 7150000],
      ['solarslant', 'Solar Slant Tower', 'Tháp Mái Xéo Mặt Trời', 'shop', 3, 3, 'c', 35, [0, 1], 'world1', 'shop', 'The slanted roof is covered with solar panels.', 193000],
      ['ecoslant', 'Eco Slant Tower', 'Tháp Mái Xéo Sinh Thái', 'home', 4, 3, 'rc', 63, [0, 1], 'home2', 'home', 'A green home tower that makes its own power.', 942000],
      ['techslant', 'Tech Slant Tower', 'Tháp Mái Xéo Công Nghệ', 'shop', 4, 4, 'c', 104, [0, 1], 'world1', 'shop', 'A blue tower for smart companies.', 3730000],
      ['infinityslant', 'Infinity Slant', 'Tháp Mái Xéo Vô Cực', 'shop', 5, 4, 'c', 156, [0, 1], 'world1', 'shop', 'The roof points to the sky.', 11300000],
      ['skyvillage', 'Sky Village', 'Làng Trên Mây', 'home', 4, 4, 'rc', 44, [0, 1], 'home2', 'home', 'Little houses live on the roof of a tower.', 473000],
      ['terracevillage', 'Terrace Village', 'Làng Trên Sân Thượng', 'home', 5, 4, 'rc', 88, [0, 1], 'home2', 'home', 'A whole village in the sky.', 2850000],
      ['eternalvillage', 'Eternal Sky Village', 'Làng Mây Vĩnh Cửu', 'home', 5, 5, 'rc', 170, [0, 1], 'home2', 'home', 'The most peaceful village of all.', 15800000]
    ];
    T.forEach(function (r) {
      var kind = r[10], lvl = r[7], cost = r[12], inc = 0, pop = 0, hp = 0, secs = Math.max(8, Math.min(2400, Math.round(cost / (lvl < 23 ? 45 : 80))));
      if (kind === 'home') { inc = Math.round(cost / 21); pop = Math.round(cost / 85); }
      else if (kind === 'civic') { hp = 60 + Math.round(lvl * 1.6); }
      else if (kind === 'edu') { inc = Math.round(cost / 16); hp = 80 + Math.round(lvl * 1.5); }
      else if (kind === 'shop') { inc = Math.round(cost / 15); hp = 1; }
      else if (kind === 'fun') { inc = Math.round(cost / 12); hp = 6 + Math.round(lvl / 4); }
      else if (kind === 'park') { inc = Math.round(cost / 22); hp = 40 + Math.round(lvl * 1.2); }
      else { inc = Math.round(cost / 16); hp = 60 + Math.round(lvl * 1.4); }
      ITEMS.push(B(r[0], r[1], r[2], r[3], r[4], r[5], r[6], lvl, cost, secs, inc, pop, hp, r[8].slice(), r[11], { ch: r[9] }));
    });
  })();
  /* ───── đợt CẦU, GA & BẾN, công trình THEO MÙA và LỄ HỘI — đồ hoạ ở js/city-art8.js ───── */
  (function () {
    var ALLD = []; for (var q = 0; q < 22; q++) ALLD.push(q);
    var T = [
      ['stonebridge', 'Stone Arch Bridge', 'Cầu Vòm Đá', 'park', 4, 2, '*', 6, ALLD, 'world1', 'park', 'An old stone bridge with round arches.', 2620],
      ['mosscbridge', 'Mossy Stone Bridge', 'Cầu Đá Rêu', 'park', 4, 2, '*', 18, ALLD, 'world1', 'park', 'A quiet bridge covered by green moss.', 36500],
      ['whitebridge', 'White Marble Bridge', 'Cầu Đá Trắng', 'park', 5, 2, '*', 37, ALLD, 'world1', 'park', 'A white bridge with smooth arches.', 235000],
      ['goldbridge', 'Golden Arch Bridge', 'Cầu Vòm Vàng', 'park', 5, 3, '*', 86, ALLD, 'world1', 'park', 'A bridge of shining gold stone.', 2270000],
      ['cablebridge', 'Cable Bridge', 'Cầu Dây Văng', 'park', 6, 3, '*', 16, ALLD, 'world1', 'park', 'Two towers hold the road with long cables.', 44800],
      ['redcable', 'Red Cable Bridge', 'Cầu Dây Văng Đỏ', 'park', 6, 3, '*', 40, ALLD, 'world1', 'park', 'Red towers and white cables.', 404000],
      ['azurecable', 'Azure Cable Bridge', 'Cầu Dây Văng Lam', 'park', 7, 3, '*', 74, ALLD, 'world1', 'park', 'A blue bridge that is long and graceful.', 1940000],
      ['nightcable', 'Night Light Bridge', 'Cầu Ánh Đêm', 'park', 7, 3, '*', 120, ALLD, 'world1', 'park', 'Its cables glow golden at night.', 6190000],
      ['steeltruss', 'Steel Truss Bridge', 'Cầu Giàn Thép', 'park', 5, 2, '*', 12, ALLD, 'world1', 'park', 'A strong red steel bridge for trains.', 15800],
      ['greentruss', 'Green Truss Bridge', 'Cầu Giàn Xanh', 'park', 5, 2, '*', 31, ALLD, 'world1', 'park', 'A green steel bridge by the park.', 154000],
      ['bluetruss', 'Blue Truss Bridge', 'Cầu Giàn Lam', 'park', 6, 2, '*', 59, ALLD, 'world1', 'park', 'A blue bridge over the wide river.', 805000],
      ['redarch', 'Red Steel Arch Bridge', 'Cầu Vòm Thép Đỏ', 'park', 5, 2, '*', 26, ALLD, 'world1', 'park', 'A tall red arch holds the road.', 101000],
      ['whitearch', 'White Arch Bridge', 'Cầu Vòm Trắng', 'park', 6, 3, '*', 64, ALLD, 'world1', 'park', 'A white arch like a rainbow of steel.', 1250000],
      ['goldarch', 'Golden Arch Bridge XL', 'Cầu Vòm Vàng Lớn', 'park', 7, 3, '*', 110, ALLD, 'world1', 'park', 'A giant golden arch over the bay.', 5020000],
      ['woodbridge', 'Wooden Bridge', 'Cầu Gỗ Cong', 'park', 3, 2, '*', 4, ALLD, 'world1', 'park', 'A small red bridge in the garden.', 832],
      ['cherrybridge', 'Cherry Blossom Bridge', 'Cầu Hoa Anh Đào', 'park', 4, 2, '*', 23, ALLD, 'world1', 'park', 'A red bridge under pink flowers.', 65800],
      ['lanternbridge', 'Lantern Bridge', 'Cầu Đèn Lồng', 'park', 4, 2, '*', 52, ALLD, 'world1', 'park', 'A wooden bridge with a view of the pond.', 466000],
      ['glassstation', 'Glass Station', 'Ga Kính', 'trans', 5, 3, 't', 15, [9], 'world1', 'port', 'A big glass roof over the platforms.', 34400],
      ['skystation', 'Sky Glass Station', 'Ga Kính Trời', 'trans', 6, 4, 't', 45, [9], 'world1', 'port', 'A modern station with blue trains.', 637000],
      ['greenstation', 'Green Eco Station', 'Ga Sinh Thái', 'trans', 6, 4, 't', 78, [9], 'world1', 'port', 'Solar glass and a green train.', 2380000],
      ['bulletstation', 'Bullet Train Station', 'Ga Tàu Cao Tốc', 'trans', 7, 4, 't', 115, [9], 'world1', 'port', 'White fast trains rush through here.', 6640000],
      ['clockstation', 'Clock Station', 'Ga Đồng Hồ', 'trans', 5, 3, 't', 10, [9], 'world1', 'port', 'A brick station with a clock tower.', 13000],
      ['grandstation', 'Grand Central', 'Ga Trung Tâm', 'trans', 6, 4, 't', 35, [9], 'world1', 'port', 'The biggest old station in the city.', 348000],
      ['royalstation', 'Royal Station', 'Ga Hoàng Gia', 'trans', 6, 4, 't', 68, [9], 'world1', 'port', 'A pink-roof station for royal trains.', 1720000],
      ['metrostairs', 'Metro Entrance', 'Lối Vào Metro', 'trans', 2, 2, 't', 8, [9], 'world1', 'port', 'Stairs go down to the underground train.', 3440],
      ['metrohub', 'Metro Hub', 'Ga Metro Trung Tâm', 'trans', 3, 3, 't', 28, [9], 'world1', 'port', 'A hub where five lines meet.', 113000],
      ['metrostar', 'Metro Star Station', 'Ga Metro Sao', 'trans', 3, 3, 't', 60, [9], 'world1', 'port', 'A bright violet station.', 705000],
      ['busplaza', 'Bus Stop Plaza', 'Bến Xe Buýt', 'trans', 4, 2, 't', 5, [9], 'world1', 'port', 'Orange buses wait under a roof.', 1690],
      ['bluebusdepot', 'Blue Bus Terminal', 'Bến Xe Buýt Xanh', 'trans', 5, 3, 't', 21, [9], 'world1', 'port', 'A big terminal for city buses.', 77100],
      ['ecobusdepot', 'Eco Bus Terminal', 'Bến Xe Điện', 'trans', 6, 3, 't', 50, [9], 'world1', 'port', 'Electric buses charge here.', 690000],
      ['springcottage', 'Spring Cottage', 'Nhà Mùa Xuân', 'home', 3, 3, 'rc', 9, [0, 1], 'home2', 'home', 'A home among blooming cherry trees.', 7430],
      ['springcafe', 'Spring Cafe', 'Quán Cà Phê Mùa Xuân', 'shop', 3, 3, 'c', 17, [0, 1], 'world1', 'shop', 'Sweet tea and flower petals.', 34200],
      ['springmanor', 'Spring Manor', 'Dinh Thự Mùa Xuân', 'home', 4, 4, 'rc', 47, [0, 1], 'home2', 'home', 'A large house full of pink blossoms.', 554000],
      ['summercottage', 'Summer Cottage', 'Nhà Mùa Hè', 'home', 3, 3, 'rc', 11, [0, 1], 'home2', 'home', 'A bright house with sunflowers.', 12000],
      ['summerbeachcafe', 'Summer Beach Cafe', 'Quán Mùa Hè', 'shop', 3, 3, 'c', 19, [0, 1], 'world1', 'shop', 'Cold drinks for hot days.', 44600],
      ['summervilla', 'Summer Villa', 'Biệt Thự Mùa Hè', 'home', 4, 4, 'rc', 49, [0, 1], 'home2', 'home', 'A white villa with a sunny garden.', 613000],
      ['autumncottage', 'Autumn Cottage', 'Nhà Mùa Thu', 'home', 3, 3, 'rc', 13, [0, 1], 'home2', 'home', 'A cosy house with orange leaves.', 18000],
      ['autumncafe', 'Autumn Cafe', 'Quán Mùa Thu', 'shop', 3, 3, 'c', 25, [0, 1], 'world1', 'shop', 'Hot cocoa and warm bread.', 86300],
      ['autumnmanor', 'Autumn Manor', 'Dinh Thự Mùa Thu', 'home', 4, 4, 'rc', 55, [0, 1], 'home2', 'home', 'A red-roof manor in a golden garden.', 808000],
      ['wintercottage', 'Winter Cottage', 'Nhà Mùa Đông', 'home', 3, 3, 'rc', 15, [0, 1], 'home2', 'home', 'A snowy house with a warm chimney.', 25300],
      ['wintercafe', 'Winter Cafe', 'Quán Mùa Đông', 'shop', 3, 3, 'c', 29, [0, 1], 'world1', 'shop', 'Hot soup when it snows.', 123000],
      ['wintermanor', 'Winter Manor', 'Dinh Thự Mùa Đông', 'home', 4, 4, 'rc', 61, [0, 1], 'home2', 'home', 'A big white house under the snow.', 1040000],
      ['seasongarden', 'Four Seasons Lodge', 'Nhà Bốn Mùa', 'home', 5, 4, 'rc', 92, [0, 1], 'home2', 'home', 'A lodge for all year long.', 3180000],
      ['bigxmastree', 'Big Christmas Tree', 'Cây Thông Noel Lớn', 'park', 3, 3, '*', 14, ALLD, 'world1', 'park', 'A giant tree with lights and gifts.', 21400],
      ['grandxmas', 'Grand Christmas Tree', 'Cây Thông Noel Khổng Lồ', 'park', 4, 4, '*', 56, ALLD, 'world1', 'park', 'It lights up the whole square.', 844000],
      ['carouselfair', 'Merry-go-round', 'Vòng Quay Ngựa Gỗ', 'fun', 3, 3, 'f', 13, [3], 'world1', 'fun', 'Painted horses go round and round.', 18000],
      ['goldcarousel', 'Golden Carousel', 'Vòng Quay Ngựa Vàng', 'fun', 4, 4, 'f', 50, [3], 'world1', 'fun', 'A carousel with golden horses.', 643000],
      ['circustent', 'Circus Tent', 'Rạp Xiếc', 'fun', 4, 4, 'f', 20, [3], 'world1', 'fun', 'Clowns, acrobats and lions.', 71300],
      ['bluecircus', 'Big Blue Circus', 'Rạp Xiếc Lam', 'fun', 5, 5, 'f', 66, [3], 'world1', 'fun', 'A giant blue and white circus.', 1640000],
      ['lanterngate', 'Lantern Gate', 'Cổng Đèn Lồng', 'park', 4, 2, '*', 12, ALLD, 'world1', 'park', 'Red lanterns light up the street.', 13800],
      ['festivalgate', 'Festival Lanterns', 'Phố Đèn Lồng', 'park', 5, 3, '*', 44, ALLD, 'world1', 'park', 'A festival of warm lights.', 455000],
      ['moonlanternst', 'Moon Lantern Street', 'Phố Đèn Trăng', 'park', 6, 3, '*', 95, ALLD, 'world1', 'park', 'Violet and gold lanterns for the moon night.', 3220000],
      ['bigben', 'Great Clock Tower', 'Tháp Đồng Hồ Lớn', 'world', 3, 3, 'w', 26, [5], 'world1', 'world', 'A famous tower with a big clock.', 94800],
      ['goldclock', 'Golden Clock Tower', 'Tháp Đồng Hồ Vàng', 'world', 3, 3, 'w', 57, [5], 'world1', 'world', 'A tower with a golden roof.', 623000],
      ['crystalclock', 'Crystal Clock Tower', 'Tháp Đồng Hồ Pha Lê', 'world', 4, 4, 'w', 98, [5], 'world1', 'world', 'A clock tower of light blue glass.', 3230000]
    ];
    T.forEach(function (r) {
      var kind = r[10], lvl = r[7], cost = r[12], inc = 0, pop = 0, hp = 0, secs = Math.max(8, Math.min(2400, Math.round(cost / (lvl < 23 ? 45 : 80))));
      if (kind === 'home') { inc = Math.round(cost / 21); pop = Math.round(cost / 85); }
      else if (kind === 'shop') { inc = Math.round(cost / 15); hp = 1; }
      else if (kind === 'fun') { inc = Math.round(cost / 12); hp = 6 + Math.round(lvl / 4); }
      else if (kind === 'park') { inc = Math.round(cost / 22); hp = 20 + Math.round(lvl * 1.1); }
      else if (kind === 'port') { inc = Math.round(cost / 12); hp = 6; }
      else { inc = Math.round(cost / 16); hp = 60 + Math.round(lvl * 1.4); }
      ITEMS.push(B(r[0], r[1], r[2], r[3], r[4], r[5], r[6], lvl, cost, secs, inc, pop, hp, r[8].slice(), r[11], { ch: r[9] }));
    });
  })();
  /* ───── 8 KHU PHỐ VĂN HOÁ (Hoa · Nhật · Việt · Thái · Indonesia · Anh · Mỹ · Úc): công trình bán riêng cho từng khu — đồ hoạ ở js/city-art9.js ───── */
  (function () {
    var T = [
      ['cnteahouse', 'Tea House', 'Trà lầu', 'shop', 2, 2, '*', 30, [22], 'world1', 'shop', 'Hot tea and sweet cakes.', 82100],
      ['cndimsum', 'Dim Sum Restaurant', 'Nhà hàng dimsum', 'shop', 3, 2, '*', 32, [22], 'world1', 'shop', 'Steamers full of dumplings.', 122000],
      ['cnherb', 'Herbal Shop', 'Tiệm thuốc Bắc', 'shop', 2, 2, '*', 34, [22], 'world1', 'shop', 'Little drawers of herbs.', 111000],
      ['cnsilk', 'Silk Market', 'Chợ lụa', 'shop', 3, 3, '*', 38, [22], 'world1', 'shop', 'Colourful silk cloth for sale.', 236000],
      ['cnshophouse', 'Shophouse Apartments', 'Nhà phố Hoa', 'home', 3, 2, '*', 36, [22], 'home2', 'home', 'A narrow home above a little shop.', 162000],
      ['cncourtyard', 'Courtyard Home', 'Tứ hợp viện', 'home', 4, 4, '*', 44, [22], 'home2', 'home', 'Rooms around a quiet yard.', 473000],
      ['cntemple', 'Chinese Temple', 'Chùa Hoa', 'world', 4, 4, '*', 48, [22], 'world1', 'world', 'Incense smoke and golden roofs.', 583000],
      ['cnpagoda', 'Nine-tier Pagoda', 'Bảo tháp chín tầng', 'world', 3, 3, '*', 54, [22], 'world1', 'world', 'A tall tower with curved roofs.', 548000],
      ['cnpailou', 'Paifang Gate', 'Cổng bài lâu', 'park', 4, 2, '*', 40, [22], 'world1', 'park', 'A grand gate to the old street.', 248000],
      ['cnlanternst', 'Lantern Street', 'Phố đèn lồng Hoa', 'park', 5, 2, '*', 42, [22], 'world1', 'park', 'Hundreds of red lights.', 319000],
      ['cndragonsq', 'Dragon Dance Square', 'Quảng trường múa lân', 'fun', 3, 3, '*', 46, [22], 'world1', 'fun', 'A dragon dances on New Year.', 373000],
      ['cnmoonbridge', 'Moon Bridge', 'Cầu Trăng', 'park', 4, 2, '*', 36, [22], 'world1', 'park', 'A round red bridge.', 193000],
      ['cnlanternpost', 'Red Lantern', 'Đèn lồng đỏ', 'orna', 1, 1, '*', 30, [22], 'world1', 'deco', 'It glows red at night.', 7850],
      ['cndragonstat', 'Dragon Statue', 'Tượng rồng', 'orna', 1, 1, '*', 45, [22], 'world1', 'deco', 'A green dragon on a stone.', 14700],
      ['jpmachiya', 'Machiya Shop', 'Cửa hàng machiya', 'shop', 2, 2, '*', 34, [23], 'world1', 'shop', 'A dark wooden shop with a curtain.', 111000],
      ['jpsushi', 'Sushi Bar', 'Quán sushi', 'shop', 2, 2, '*', 36, [23], 'world1', 'shop', 'Fresh fish on rice.', 127000],
      ['jpramen', 'Ramen Shop', 'Quán ramen', 'shop', 2, 2, '*', 38, [23], 'world1', 'shop', 'Hot noodle soup.', 145000],
      ['jptea', 'Tea Garden House', 'Nhà trà vườn', 'shop', 3, 2, '*', 42, [23], 'world1', 'shop', 'A quiet tea ceremony.', 235000],
      ['jphouse', 'Japanese House', 'Nhà Nhật', 'home', 3, 3, '*', 40, [23], 'home2', 'home', 'Paper doors and a tiled roof.', 266000],
      ['jpapart', 'Japanese Apartments', 'Chung cư Nhật', 'home', 3, 2, '*', 46, [23], 'home2', 'home', 'Small and neat homes.', 292000],
      ['jpshrine', 'Shinto Shrine', 'Đền thần đạo', 'world', 4, 4, '*', 50, [23], 'world1', 'world', 'A red shrine in the trees.', 643000],
      ['jpcastle', 'White Castle', 'Lâu đài trắng', 'world', 4, 4, '*', 58, [23], 'world1', 'world', 'A white castle with grey roofs.', 918000],
      ['jppagoda5', 'Five-storey Pagoda', 'Tháp năm tầng', 'world', 3, 3, '*', 62, [23], 'world1', 'world', 'A tall wooden pagoda.', 763000],
      ['jptorii', 'Great Torii', 'Cổng torii lớn', 'park', 4, 2, '*', 44, [23], 'world1', 'park', 'The red gate of a sacred place.', 312000],
      ['jpzen', 'Zen Garden', 'Vườn thiền Nhật', 'park', 4, 3, '*', 46, [23], 'world1', 'park', 'Rocks and raked sand.', 443000],
      ['jpkoi', 'Koi Garden', 'Vườn cá Koi Nhật', 'park', 4, 4, '*', 52, [23], 'world1', 'park', 'A pond with red bridge.', 706000],
      ['jpsakura', 'Sakura Park', 'Công viên anh đào', 'park', 5, 4, '*', 56, [23], 'world1', 'park', 'Pink blossoms everywhere.', 965000],
      ['jpsakuratree', 'Sakura Tree', 'Cây anh đào Nhật', 'orna', 1, 1, '*', 34, [23], 'world1', 'deco', 'A tree full of pink flowers.', 9520],
      ['jpbonsai', 'Bonsai Pot', 'Chậu bonsai', 'orna', 1, 1, '*', 38, [23], 'world1', 'deco', 'A tiny old tree.', 11300],
      ['vntube', 'Tube House', 'Nhà ống', 'home', 2, 2, '*', 38, [24], 'home2', 'home', 'Narrow, tall and very colourful.', 145000],
      ['vnpho', 'Pho Restaurant', 'Quán phở', 'shop', 2, 2, '*', 40, [24], 'world1', 'shop', 'A bowl of hot beef noodles.', 164000],
      ['vncoffee', 'Coffee Shop', 'Quán cà phê', 'shop', 3, 2, '*', 42, [24], 'world1', 'shop', 'Strong coffee with milk.', 235000],
      ['vnmarket', 'Central Market', 'Chợ trung tâm', 'shop', 4, 3, '*', 48, [24], 'world1', 'shop', 'Fruit, fish, flowers and a clock tower.', 491000],
      ['vnstilt', 'Stilt House', 'Nhà sàn', 'home', 3, 3, '*', 44, [24], 'home2', 'home', 'A wooden house on poles.', 335000],
      ['vnpagoda', 'Old Pagoda', 'Chùa cổ Việt', 'world', 3, 3, '*', 50, [24], 'world1', 'world', 'A peaceful temple with ochre walls.', 455000],
      ['vnonepillar', 'One Pillar Pagoda', 'Chùa Một Cột', 'world', 2, 2, '*', 54, [24], 'world1', 'world', 'A little temple on one pillar.', 337000],
      ['vnlake', 'Sword Lake', 'Hồ Gươm', 'park', 5, 4, '*', 46, [24], 'world1', 'park', 'A calm lake with a small tower.', 602000],
      ['vngate', 'Village Gate', 'Cổng làng', 'park', 4, 2, '*', 40, [24], 'world1', 'park', 'A brick village gate.', 248000],
      ['vnrice', 'Rice Terraces', 'Ruộng bậc thang Việt', 'park', 5, 4, '*', 52, [24], 'world1', 'park', 'Green steps for rice.', 808000],
      ['vnlantern', 'Lantern Town Street', 'Phố đèn lồng Hội An', 'park', 5, 2, '*', 56, [24], 'world1', 'park', 'Yellow walls and bright lanterns.', 637000],
      ['vncovered', 'Covered Bridge', 'Cầu có mái', 'park', 4, 2, '*', 42, [24], 'world1', 'park', 'A bridge with a little roof.', 279000],
      ['vnconical', 'Conical Hat', 'Nón lá', 'orna', 1, 1, '*', 38, [24], 'world1', 'deco', 'A hat made of palm leaves.', 11300],
      ['vncyclo', 'Cyclo', 'Xích lô', 'orna', 1, 1, '*', 46, [24], 'world1', 'deco', 'A three-wheel city ride.', 15200],
      ['thwat', 'Wat Temple', 'Chùa Wat', 'world', 4, 4, '*', 42, [25], 'world1', 'world', 'Gold and red roofs.', 423000],
      ['thchedi', 'Golden Chedi', 'Chùa tháp vàng', 'world', 4, 4, '*', 50, [25], 'world1', 'world', 'A tall golden spire.', 643000],
      ['thstilt', 'Thai Stilt House', 'Nhà sàn Thái', 'home', 3, 3, '*', 44, [25], 'home2', 'home', 'A teak house with tall roof.', 335000],
      ['thstilt2', 'Thai Garden Villa', 'Biệt thự vườn Thái', 'home', 4, 3, '*', 56, [25], 'home2', 'home', 'A wooden villa in the garden.', 710000],
      ['thfloat', 'Floating Market', 'Chợ nổi', 'shop', 3, 3, '*', 48, [25], 'world1', 'shop', 'Boats full of fruit.', 413000],
      ['thmassage', 'Massage Spa', 'Tiệm massage', 'shop', 2, 2, '*', 46, [25], 'world1', 'shop', 'Calm hands and herbal tea.', 229000],
      ['thnoodle', 'Street Noodle Shop', 'Quán mì Thái', 'shop', 2, 2, '*', 40, [25], 'world1', 'shop', 'Spicy and sweet noodles.', 164000],
      ['thhotel', 'Boutique Hotel', 'Khách sạn Thái', 'shop', 4, 3, '*', 60, [25], 'world1', 'shop', 'A gold hotel with many roofs.', 838000],
      ['thgate', 'Golden Gate', 'Cổng vàng Thái', 'park', 4, 2, '*', 44, [25], 'world1', 'park', 'A bright golden gate.', 312000],
      ['thlotus', 'Lotus Pond', 'Hồ sen Thái', 'park', 4, 4, '*', 50, [25], 'world1', 'park', 'Pink lotus on green leaves.', 643000],
      ['thbuddha', 'Golden Buddha', 'Tượng Phật vàng', 'world', 2, 2, '*', 58, [25], 'world1', 'world', 'A calm golden statue.', 400000],
      ['thgarden', 'Tropical Garden', 'Vườn nhiệt đới', 'park', 4, 4, '*', 52, [25], 'world1', 'park', 'Palms and warm water.', 706000],
      ['thtuktuk', 'Tuk-tuk', 'Xe tuk-tuk', 'orna', 1, 1, '*', 42, [25], 'world1', 'deco', 'A three-wheel taxi.', 13200],
      ['thbuddhasm', 'Small Buddha', 'Tượng Phật nhỏ', 'orna', 1, 1, '*', 48, [25], 'world1', 'deco', 'A little golden friend.', 16200],
      ['idborobudur', 'Stepped Temple', 'Đền bậc thang', 'world', 5, 5, '*', 60, [26], 'world1', 'world', 'Stone terraces and little stupas.', 1300000],
      ['idbalitemple', 'Bali Temple', 'Đền Bali', 'world', 4, 4, '*', 50, [26], 'world1', 'world', 'Black thatched roofs and stone walls.', 643000],
      ['idjoglo', 'Joglo House', 'Nhà Joglo', 'home', 3, 3, '*', 48, [26], 'home2', 'home', 'A big roof made of wood.', 413000],
      ['idvilla', 'Bali Villa', 'Biệt thự Bali', 'home', 4, 3, '*', 58, [26], 'home2', 'home', 'A thatched villa by the rice field.', 773000],
      ['idwarung', 'Warung', 'Quán warung', 'shop', 2, 2, '*', 46, [26], 'world1', 'shop', 'A small cafe with fried rice.', 229000],
      ['idbatik', 'Batik Shop', 'Cửa hàng batik', 'shop', 3, 2, '*', 50, [26], 'world1', 'shop', 'Cloth printed with wax.', 357000],
      ['idmarket', 'Art Market', 'Chợ nghệ thuật', 'shop', 4, 3, '*', 54, [26], 'world1', 'shop', 'Wooden masks and paintings.', 651000],
      ['idgate', 'Split Gate', 'Cổng chẻ Bali', 'park', 4, 2, '*', 46, [26], 'world1', 'park', 'A gate split in two.', 347000],
      ['idrice', 'Rice Terraces Bali', 'Ruộng bậc thang Bali', 'park', 5, 4, '*', 52, [26], 'world1', 'park', 'Water and green rice steps.', 808000],
      ['idbeach', 'Palm Beach', 'Bãi biển cọ', 'park', 4, 4, '*', 56, [26], 'world1', 'park', 'Blue water and white sand.', 844000],
      ['idspa', 'Garden Spa', 'Spa vườn', 'shop', 3, 3, '*', 62, [26], 'world1', 'shop', 'A quiet place with flowers.', 763000],
      ['idoffering', 'Offering Basket', 'Lễ vật Bali', 'orna', 1, 1, '*', 46, [26], 'world1', 'deco', 'Flowers and a small flag.', 15200],
      ['idumbrella', 'Beach Umbrella', 'Dù biển Bali', 'orna', 1, 1, '*', 40, [26], 'world1', 'deco', 'Shade by the sea.', 12200],
      ['ukterrace', 'Terraced Houses', 'Nhà dãy kiểu Anh', 'home', 3, 2, '*', 50, [27], 'home2', 'home', 'Brick houses with chimneys.', 357000],
      ['ukvictorian', 'Victorian Row', 'Dãy nhà Victoria', 'home', 4, 2, '*', 56, [27], 'home2', 'home', 'Pastel houses with bay windows.', 557000],
      ['ukpub', 'Old Pub', 'Quán rượu cổ', 'shop', 3, 2, '*', 52, [27], 'world1', 'shop', 'Fish and chips and a warm fire.', 392000],
      ['ukbookshop', 'Bookshop', 'Hiệu sách Anh', 'shop', 2, 2, '*', 48, [27], 'world1', 'shop', 'Old books and a cat.', 254000],
      ['ukmarket', 'Covered Market', 'Chợ có mái', 'shop', 3, 3, '*', 56, [27], 'world1', 'shop', 'A market in a brick hall.', 598000],
      ['ukbigben', 'Great Clock Tower', 'Tháp đồng hồ Anh', 'world', 3, 3, '*', 60, [27], 'world1', 'world', 'A famous tower and bell.', 705000],
      ['ukcastle', 'Old Castle', 'Lâu đài cổ Anh', 'world', 5, 4, '*', 66, [27], 'world1', 'world', 'Stone walls and towers.', 1430000],
      ['uktowerbridge', 'Tower Bridge', 'Cầu Tháp', 'world', 6, 3, '*', 70, [27], 'world1', 'world', 'Two towers over a river.', 1550000],
      ['ukstation', 'Victorian Station', 'Ga Victoria', 'trans', 5, 3, '*', 54, [27], 'world1', 'port', 'Brick station with a clock.', 744000],
      ['ukhyde', 'Royal Park Pond', 'Công viên hồ Hoàng gia', 'park', 5, 4, '*', 58, [27], 'world1', 'park', 'Ducks and benches.', 1050000],
      ['ukrose', 'English Rose Garden', 'Vườn hồng Anh', 'park', 4, 3, '*', 62, [27], 'world1', 'park', 'Roses along stone paths.', 907000],
      ['ukphone', 'Red Phone Box', 'Hộp điện thoại đỏ', 'orna', 1, 1, '*', 50, [27], 'world1', 'deco', 'A famous red box.', 17300],
      ['ukbus', 'Double-decker Bus', 'Xe buýt hai tầng', 'orna', 1, 1, '*', 58, [27], 'world1', 'deco', 'A red bus with two floors.', 21700],
      ['ussky', 'Skyscraper', 'Nhà chọc trời Mỹ', 'shop', 4, 4, '*', 54, [28], 'world1', 'shop', 'A tall tower with a spire.', 773000],
      ['usdeco', 'Art Deco Tower', 'Toà Art Deco', 'shop', 3, 3, '*', 58, [28], 'world1', 'shop', 'Stepped tower with golden light.', 650000],
      ['usbrownstone', 'Brownstone Row', 'Dãy nhà gạch nâu', 'home', 4, 2, '*', 56, [28], 'home2', 'home', 'Stone steps and tall windows.', 557000],
      ['ustownhouse', 'City Townhouses', 'Nhà phố Mỹ', 'home', 3, 2, '*', 60, [28], 'home2', 'home', 'Neat homes with stairs.', 553000],
      ['usdiner', 'Retro Diner', 'Quán diner xưa', 'shop', 3, 2, '*', 58, [28], 'world1', 'shop', 'Milkshakes and burgers.', 510000],
      ['usgas', 'Route 66 Gas Station', 'Trạm xăng Route 66', 'shop', 2, 2, '*', 62, [28], 'world1', 'shop', 'A road trip stop.', 469000],
      ['usbarn', 'Red Barn House', 'Nhà kho đỏ', 'home', 3, 3, '*', 64, [28], 'home2', 'home', 'A farm house from the prairie.', 823000],
      ['usliberty', 'Statue of Liberty', 'Tượng Nữ thần Tự do', 'world', 4, 4, '*', 70, [28], 'world1', 'world', 'A torch lights the harbour.', 1440000],
      ['usstadium', 'Baseball Stadium', 'Sân bóng chày', 'sport', 5, 5, '*', 68, [28], 'world1', 'sport', 'Peanuts and a home run.', 1760000],
      ['uscentral', 'Central Park Pond', 'Công viên Trung tâm', 'park', 6, 4, '*', 60, [28], 'world1', 'park', 'A big park in the city.', 1270000],
      ['ustheatre', 'Broadway Theatre', 'Nhà hát Broadway', 'fun', 4, 3, '*', 74, [28], 'world1', 'fun', 'Bright lights and big shows.', 1390000],
      ['ushotdog', 'Hot Dog Cart', 'Xe xúc xích', 'orna', 1, 1, '*', 56, [28], 'world1', 'deco', 'A snack on the street.', 20600],
      ['ustaxi', 'Yellow Taxi', 'Taxi vàng', 'orna', 1, 1, '*', 64, [28], 'world1', 'deco', 'A New York cab.', 25300],
      ['auopera', 'Harbour Opera House', 'Nhà hát vỏ sò Úc', 'fun', 5, 4, '*', 64, [29], 'world1', 'fun', 'White shells by the harbour.', 1330000],
      ['auharbour', 'Harbour Bridge', 'Cầu cảng lớn', 'park', 7, 3, '*', 72, [29], 'world1', 'park', 'A steel arch over the bay.', 1820000],
      ['auuluru', 'Red Rock', 'Núi đá đỏ', 'world', 5, 5, '*', 60, [29], 'world1', 'world', 'A giant red rock in the desert.', 1300000],
      ['ausurf', 'Surf Shop', 'Cửa hàng lướt sóng', 'shop', 2, 2, '*', 58, [29], 'world1', 'shop', 'Boards, wax and sun cream.', 400000],
      ['aubeachhouse', 'Beach House', 'Nhà bãi biển', 'home', 3, 3, '*', 62, [29], 'home2', 'home', 'A house by the surf.', 763000],
      ['aupub', 'Outback Pub', 'Quán rượu miền hoang', 'shop', 3, 2, '*', 66, [29], 'world1', 'shop', 'A cold drink and a long veranda.', 695000],
      ['aufarm', 'Sheep Farm House', 'Nhà trang trại cừu', 'home', 4, 3, '*', 68, [29], 'home2', 'home', 'Big farm in the dry land.', 1130000],
      ['aureef', 'Reef Lagoon', 'Đầm rạn san hô', 'park', 4, 4, '*', 70, [29], 'world1', 'park', 'Clear water and coral.', 1440000],
      ['aukoala', 'Koala Park', 'Công viên koala', 'park', 4, 4, '*', 64, [29], 'world1', 'park', 'Koalas sleep in gum trees.', 1160000],
      ['aubotanic', 'Botanic Glasshouse', 'Nhà kính thực vật Úc', 'park', 4, 4, '*', 72, [29], 'world1', 'park', 'Flowers of the continent.', 1540000],
      ['auroo', 'Kangaroo Statue', 'Tượng kangaroo', 'orna', 1, 1, '*', 60, [29], 'world1', 'deco', 'A big hopper.', 22900],
      ['ausurfboards', 'Surfboards', 'Ván lướt sóng', 'orna', 1, 1, '*', 56, [29], 'world1', 'deco', 'Three colourful boards.', 20600],
      ['aucumtree', 'Gum Tree', 'Cây bạch đàn', 'tree', 1, 1, '*', 50, [29], 'world1', 'deco', 'The koala’s home.', 17300]
    ];
    T.forEach(function (r) {
      var kind = r[10], lvl = r[7], cost = r[12], inc = 0, pop = 0, hp = 0, secs = Math.max(8, Math.min(2400, Math.round(cost / (lvl < 23 ? 45 : 80))));
      if (kind === 'home') { inc = Math.round(cost / 21); pop = Math.round(cost / 85); }
      else if (kind === 'shop') { inc = Math.round(cost / 15); hp = 1; }
      else if (kind === 'fun') { inc = Math.round(cost / 12); hp = 6 + Math.round(lvl / 4); }
      else if (kind === 'sport') { inc = Math.round(cost / 13); hp = 8 + Math.round(lvl / 4); }
      else if (kind === 'park') { inc = Math.round(cost / 22); hp = 20 + Math.round(lvl * 1.1); }
      else if (kind === 'port') { inc = Math.round(cost / 12); hp = 6; }
      else if (kind === 'deco') { hp = 2 + Math.round(lvl / 6); secs = Math.max(4, Math.min(300, Math.round(cost / 40))); }
      else { inc = Math.round(cost / 16); hp = 60 + Math.round(lvl * 1.4); }
      ITEMS.push(B(r[0], r[1], r[2], r[3], r[4], r[5], r[6], lvl, cost, secs, inc, pop, hp, r[8].slice(), r[11], { ch: r[9] }));
    });
  })();
  var BY = {}; ITEMS.forEach(function (i) { BY[i.k] = i; });
  /* ───── xây "lấn khu": nhà ở, công viên, dịch vụ, cửa hàng nhỏ… vẫn cần ở mọi nơi (nhà gần trường, công viên cạnh nhà máy) ─────
     Mở rộng chữ khối đất (z) được phép + danh sách quận (ds) cho các nhóm công trình "dùng chung". Giữ bản gốc ở z0 / ds0. */
  /* ───── quận mới "thừa hưởng" danh mục của các quận mẫu: công trình xây được ở quận mẫu cũng xây được ở quận mới (khối đất mới dùng cùng chữ khối) ───── */
  (function () {
    var MIRROR = { 12: [1, 4], 13: [3, 6], 14: [5], 15: [8, 7, 10], 16: [9, 11, 4], 17: [1, 4, 5], 18: [0, 10], 19: [7, 3], 20: [2, 6], 21: [5, 11], 22: [1, 5], 23: [1, 5], 24: [0, 5], 25: [5, 3], 26: [5, 6], 27: [1, 5], 28: [1, 11], 29: [6, 11] };
    ITEMS.forEach(function (it) { Object.keys(MIRROR).forEach(function (nd) { nd = +nd; if (it.ds.indexOf(nd) < 0 && MIRROR[nd].some(function (m) { return it.ds.indexOf(m) >= 0; })) it.ds = it.ds.concat([nd]); }); });
  })();
  (function () {
    var ALLZ = 'rcspfeihwbmatg', SERVICE = { clinic: 1, hospital: 1, firestation: 1, police: 1, school: 1, library: 1, postoffice: 1 };
    var zd = {}; for (var q = 0; q < W * H; q++) { if (ZONE[q] && DIST[q] !== 255) { var dz = zd[DIST[q]] || (zd[DIST[q]] = {}); dz[String.fromCharCode(ZONE[q])] = 1; } }
    var drop = function (str, rm) { return str.split('').filter(function (c) { return rm.indexOf(c) < 0; }).join(''); };
    ITEMS.forEach(function (it) {
      var add = '', area = it.w * it.h;
      if (it.cat === 'home') add = drop(ALLZ, 'ht');                                   // nhà ở: mọi nơi trừ cảng & sân bay
      else if (it.cat === 'park') add = ALLZ;                                          // công viên: mọi nơi
      else if (it.cat === 'civic' && SERVICE[it.k]) add = ALLZ;                        // trường, y tế, cứu hoả, công an, thư viện, bưu điện: mọi nơi
      else if (it.cat === 'shop' && area <= 4) add = drop(ALLZ, 'ht');                 // cửa hàng nhỏ: mọi nơi trừ cảng & sân bay
      else if (it.cat === 'edu' && area <= 4) add = 'rcwp';                            // mẫu giáo, hiệu sách… gần nhà
      else if (it.cat === 'sport' && area <= 6) add = 'rcepf';                         // phòng tập, sân nhỏ…
      else if (it.cat === 'fun' && area <= 4) add = 'rcwbpg';                          // quầy kem, game nhỏ…
      if (!add || it.z === '*' || (it.lvl > 22 && it.cat !== 'home')) return;
      it.z0 = it.z; it.ds0 = it.ds; var z2 = it.z; add.split('').forEach(function (c) { if (z2.indexOf(c) < 0) z2 += c; }); it.z = z2;
      it.ds = Object.keys(zd).map(Number).filter(function (d) { return z2.split('').some(function (c) { return zd[d][c]; }); }).concat(it.ds).filter(function (d, i, a) { return a.indexOf(d) === i; }).sort(function (x, y) { return x - y; });
    });
  })();
  // công trình cố định (chỉ để vẽ)
  var FIXED_DEF = { plaza: { en: 'Town Plaza', vi: 'Quảng trường', w: 1, h: 1 }, townhall: { en: 'Town Hall', vi: 'Toà thị chính', w: 3, h: 3 }, clocktower: { en: 'Clock Tower', vi: 'Tháp đồng hồ', w: 1, h: 1 }, bigplaza: { en: 'Harbor Plaza', vi: 'Quảng trường cảng', w: 1, h: 1 }, pier: { en: 'Fishing Pier', vi: 'Cầu tàu bãi biển', w: 7, h: 2 }, airport: { en: 'Airport Gate', vi: 'Cổng sân bay', w: 4, h: 2 },
    fx22gate: { en: 'Pailou Gate', vi: 'Cổng Bài Lâu', w: 3, h: 1 },
    fx22mark: { en: 'Dragon Pagoda', vi: 'Bảo tháp Rồng', w: 3, h: 3 },
    fx22da: { en: 'Red Lantern', vi: 'Đèn lồng đỏ', w: 1, h: 1 },
    fx22db: { en: 'Dragon Statue', vi: 'Tượng rồng', w: 1, h: 1 },
    fx23gate: { en: 'Torii Gate', vi: 'Cổng Torii', w: 3, h: 1 },
    fx23mark: { en: 'White Castle', vi: 'Lâu đài Trắng', w: 3, h: 3 },
    fx23da: { en: 'Cherry Tree', vi: 'Cây anh đào', w: 1, h: 1 },
    fx23db: { en: 'Bonsai', vi: 'Cây bonsai', w: 1, h: 1 },
    fx24gate: { en: 'Village Gate', vi: 'Cổng làng', w: 3, h: 1 },
    fx24mark: { en: 'Old Temple', vi: 'Chùa cổ', w: 3, h: 3 },
    fx24da: { en: 'Conical Hat', vi: 'Nón lá', w: 1, h: 1 },
    fx24db: { en: 'Cyclo', vi: 'Xích lô', w: 1, h: 1 },
    fx25gate: { en: 'Golden Gate', vi: 'Cổng vàng', w: 3, h: 1 },
    fx25mark: { en: 'Golden Chedi', vi: 'Chùa tháp vàng', w: 3, h: 3 },
    fx25da: { en: 'Golden Buddha', vi: 'Phật vàng', w: 1, h: 1 },
    fx25db: { en: 'Tuk-tuk', vi: 'Xe tuk-tuk', w: 1, h: 1 },
    fx26gate: { en: 'Bali Split Gate', vi: 'Cổng chẻ Bali', w: 3, h: 1 },
    fx26mark: { en: 'Stone Temple', vi: 'Đền đá bậc thang', w: 3, h: 3 },
    fx26da: { en: 'Offering', vi: 'Lễ vật', w: 1, h: 1 },
    fx26db: { en: 'Beach Umbrella', vi: 'Dù biển', w: 1, h: 1 },
    fx27gate: { en: 'Welcome Arch', vi: 'Cổng chào', w: 3, h: 1 },
    fx27mark: { en: 'Great Clock Tower', vi: 'Tháp đồng hồ lớn', w: 3, h: 3 },
    fx27da: { en: 'Red Phone Box', vi: 'Hộp điện thoại đỏ', w: 1, h: 1 },
    fx27db: { en: 'Double-decker Bus', vi: 'Xe buýt hai tầng', w: 1, h: 1 },
    fx28gate: { en: 'Welcome Sign', vi: 'Biển chào', w: 3, h: 1 },
    fx28mark: { en: 'Statue of Liberty', vi: 'Tượng Nữ thần Tự do', w: 3, h: 3 },
    fx28da: { en: 'Hot Dog Cart', vi: 'Xe bánh mì xúc xích', w: 1, h: 1 },
    fx28db: { en: 'Yellow Taxi', vi: 'Taxi vàng', w: 1, h: 1 },
    fx29gate: { en: 'Welcome Sign', vi: 'Biển chào', w: 3, h: 1 },
    fx29mark: { en: 'Red Rock', vi: 'Núi đá đỏ', w: 3, h: 3 },
    fx29da: { en: 'Kangaroo', vi: 'Kangaroo', w: 1, h: 1 },
    fx29db: { en: 'Gum Tree', vi: 'Cây bạch đàn', w: 1, h: 1 } };

  /* ───── luật chơi ───── */
  var MAXLV = 3, LVMUL = [0, 1, 1.8, 3.0], POPMUL = [0, 1, 1.8, 3.0];
  var RULES = {
    incomeCapH: 8,               // tích luỹ xu tối đa 8 giờ rồi dừng (phải bấm thu)
    roadCost: 8, roadRefund: 4, // xu mỗi ô đường tự xây
    sellBack: 0.5,              // dỡ công trình hoàn 50% giá
    recolorPct: 0.03, recolorMin: 30,   // đổi màu sau khi đã xây: 3% giá món (tối thiểu 30 xu); chọn màu lúc mua thì miễn phí
    upgradeMul: [0, 0, 0.9, 2.2], timeMul: [0, 1, 2.5, 6],
    speedX2: { base: 6, perMin: 3 },     // đẩy nhanh x2: còn lại giảm một nửa
    speedNow: { base: 15, perMin: 10 },  // xong ngay: đắt hơn
    freeStart: { cottage: 2, kiosk: 1 }, // vài món miễn phí để học sinh có "vốn" đầu tiên (không phát xu)
    quizReward: [[20, 40], [30, 30], [40, 18], [60, 8], [100, 4]],   // [xu, trọng số]
    quizDayCap: 1000000,
    ticketChance: 0.12
  };
  var itemCost = function (it, lv) { return lv <= 1 ? it.cost : Math.round(it.cost * RULES.upgradeMul[lv]); };
  var buildSecs = function (it, lv) { return Math.max(3, Math.round(it.secs * RULES.timeMul[lv])); };
  var incomeH = function (it, lv) { return Math.round(it.inc * LVMUL[lv]); };
  var popOf = function (it, lv) { return Math.round(it.pop * POPMUL[lv]); };
  var hpOf = function (it, lv) { return Math.round(it.hp * (lv === 1 ? 1 : lv === 2 ? 1.5 : 2)); };
  // giá đẩy nhanh theo thời gian còn lại (giây)
  var speedCost = function (mode, remainSec) { var m = Math.max(0.2, remainSec / 60), r = mode === 'now' ? RULES.speedNow : RULES.speedX2; return Math.ceil(r.base + r.perMin * m * (mode === 'x2' ? 0.5 : 1)); };

  // điểm thành phố → cấp (1..180). Cấp 1–30 giữ nguyên công thức cũ (không ai bị tụt cấp); từ cấp 31 trở đi tăng dần độ khó
  var MAXLEVEL = 180, LEVEL_AT = [0]; (function () { var n, v; for (n = 1; n < MAXLEVEL; n++) { v = 35 * Math.pow(n, 1.9); if (n >= 30) v *= 1 + (n - 29) * 0.01; LEVEL_AT.push(Math.round(v)); } })();
  var LEVEL_TITLES = [[1, 'Dân mới'], [5, 'Thợ xây'], [10, 'Kiến trúc sư'], [15, 'Thị trưởng'], [20, 'Nhà quy hoạch'], [30, 'Đại thị trưởng'], [40, 'Nhà kiến tạo'], [50, 'Huyền thoại thành phố'], [60, 'Bậc thầy đô thị'], [75, 'Kỳ quan đô thị'], [90, 'Thiên tài quy hoạch'], [105, 'Đại đế thành phố'], [120, 'Thần Thành Phố'], [135, 'Thiên đế đô thị'], [150, 'Chúa tể kiến tạo'], [165, 'Bất diệt thành phố'], [180, 'Vĩnh cửu EWT']];
  var levelTitle = function (l) { var t = LEVEL_TITLES[0][1], i; for (i = 0; i < LEVEL_TITLES.length; i++) if (l >= LEVEL_TITLES[i][0]) t = LEVEL_TITLES[i][1]; return t; };
  var levelBonus = function (l) { l = Math.min(l, MAXLEVEL); return 1 + 0.004 * Math.max(0, Math.min(l, 120) - 30) + 0.002 * Math.max(0, l - 120); };   // từ cấp 31: mỗi cấp +0,4% thuế (đến cấp 120 = +36%); cấp 121–180: +0,2%/cấp (tối đa +48%)
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
      zs = String.fromCharCode(ZONE[i]); if (it.z !== '*' && it.z.indexOf(zs) < 0) return { ok: false, err: it.z.length > 5 ? it.vi + ' xây được hầu hết mọi khu, trừ khu "' + (ZONE_NAME[zs] || 'khác') + '" (dành cho công trình chuyên dụng).' : it.vi + ' chỉ xây được ở khu ' + zoneList(it.z) + '. Ô này là khu "' + (ZONE_NAME[zs] || 'khác') + '".' };
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
    { id: 'b-village', d: 0, icon: '🛖', en: 'Village Homes Pack', vi: 'Gói Nhà làng quê', items: { onefloor: 3, logcabin: 2, stilthouse: 2, japhouse: 1 } },
    { id: 'b-modern', d: 0, icon: '🏡', en: 'Modern Living Pack', vi: 'Gói Nhà hiện đại', items: { modernvilla: 1, glasshouse: 1, lowrise: 1, tubehouse: 2 } },
    { id: 'b-estate', d: 0, icon: '🏰', en: 'Grand Estate Pack', vi: 'Gói Dinh thự', items: { mansion: 1, frenchvilla: 1, medvilla: 1, lakehouse: 1 } },
    { id: 'b-foodst', d: 1, icon: '🍜', en: 'Food Street Pack', vi: 'Gói Phố ẩm thực', items: { noodleshop: 2, restaurant: 2, coffeehouse: 1, minimart: 2, flowershop: 1 } },
    { id: 'b-skyline', d: 1, icon: '🌆', en: 'City Skyline Pack', vi: 'Gói Đường chân trời', items: { glassoffice: 1, twinoffice: 1, skyoffice: 1, bankhq: 1 } },
    { id: 'b-civic2', d: 0, icon: '🏛️', en: 'Public Services Pack', vi: 'Gói Dịch vụ công', items: { postoffice: 1, hospital: 1, courthouse: 1, commcenter: 1 } },
    { id: 'b-power', d: 2, icon: '🔋', en: 'Green Energy Pack', vi: 'Gói Năng lượng xanh', items: { solarfarm: 1, windturbines: 1, waterplant: 1, recyclecenter: 1 } },
    { id: 'b-wonders', d: 5, icon: '🗿', en: 'Ancient Wonders Pack', vi: 'Gói Kỳ quan cổ đại', items: { colosseum: 1, sphinx: 1, stonehenge: 1, moai: 1 } },
    { id: 'b-skyline2', d: 1, icon: '🏙️', en: 'Supertall Pack', vi: 'Gói Siêu cao tầng', items: { hqtower: 1, bankskyscraper: 1, mediatower: 1, hotelskyline: 1 } },
    { id: 'b-heavy', d: 2, icon: '🏭', en: 'Tall Industry Pack', vi: 'Gói Công nghiệp cao', items: { smokestackfactory: 1, silotower: 1, chemtower: 1, coolingtowers: 1 } },
    { id: 'b-hoaxuan', d: -1, ev: 'hoaxuan', icon: '🌸', en: 'Spring Blossom Pack', vi: 'Gói Hoa Xuân', items: { sakuraarch: 2, flowercart: 2, kitefield: 1 } },
    { id: 'b-bienhe', d: -1, ev: 'bienhe', icon: '🏖️', en: 'Summer Beach Pack', vi: 'Gói Biển Hè', items: { sandcastle: 2, icecreamcart: 1, surfrack: 2, beachvolley: 1 } },
    { id: 'b-thuvang', d: -1, ev: 'thuvang', icon: '🍂', en: 'Golden Autumn Pack', vi: 'Gói Thu Vàng', items: { pumpkinpatch: 1, festscarecrow: 2, harvestcart: 1, leafpile: 3 } }
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
  var API = { recolorCost: recolorCost, PALETTES: PALETTES, PAL_BY: PAL_BY, PAL_GROUPS: PAL_GROUPS, suggestFor: suggestFor, facingToRoad: facingToRoad, FESTIVALS: FESTIVALS, FEST_BY: FEST_BY, festivalsOn: festivalsOn, BUNDLES: BUNDLES, BUNDLE_BY: BUNDLE_BY, bundlePrice: bundlePrice, bundleFull: bundleFull, bundleLvl: bundleLvl, PLANS: PLANS, PLAN_BY: PLAN_BY, W: W, H: H, OX: OX, OY: OY, PER: PER, BLOCKS: BLOCKS, PROPS: PROPS, LAMPS: LAMPS, LANES: LANES, migrateState: migrateState, hash: hash, DISTRICTS: DISTRICTS, ZONE_NAME: ZONE_NAME, ZONE_COLOR: ZONE_COLOR, TERR: TERR, ROAD: ROAD, DIST: DIST, ZONE: ZONE, FIXED: FIXED, FOCC: FOCC, FIXED_DEF: FIXED_DEF,
    CATS: CATS, ITEMS: ITEMS, BY: BY, MAXLV: MAXLV, RULES: RULES, LEVEL_AT: LEVEL_AT, MAXLEVEL: MAXLEVEL, levelTitle: levelTitle, levelBonus: levelBonus, idx: idx, inW: inW, itemCost: itemCost, buildSecs: buildSecs, incomeH: incomeH, popOf: popOf, hpOf: hpOf, speedCost: speedCost,
    levelOfScore: levelOfScore, scoreOf: scoreOf, buildOcc: buildOcc, canPlace: canPlace, canRoad: canRoad, adjacentRoad: adjacentRoad, zoneList: zoneList, isRoadAt: isRoadAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTCityData = API;
})(typeof window !== 'undefined' ? window : this);
