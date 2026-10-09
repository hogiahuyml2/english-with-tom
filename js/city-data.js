/* EWT City — DỮ LIỆU DÙNG CHUNG cho máy chủ và trình duyệt: bản đồ thành phố, quận, khu quy hoạch sẵn, mạng lưới đường sẵn, danh mục công trình, luật chơi.
   Mọi phép kiểm tra (đặt công trình, xây đường, giá, thời gian…) đều dùng đúng các hàm ở đây nên hai phía luôn cho cùng kết quả. */
(function (root) {
  'use strict';
  var DS = 24, DW = 3, DH = 2, W = DS * DW, H = DS * DH, PER = 6;   // 6 quận 24×24 ô → bản đồ 72×48 ô; đường chính cách nhau 6 ô → mỗi khối đất 5×5 ô

  /* ───── 6 quận ───── (zones: 4×4 khối, mỗi khối một chữ: r nhà ở · c thương mại · s dịch vụ công · p công viên · f vui chơi · e học đường · i công nghiệp · h cảng · w phố quốc tế) */
  var DISTRICTS = [
    { id: 0, key: 'home', en: 'Sunny Homes', vi: 'Khu dân cư Nắng Mai', icon: '🏡', free: true, lvl: 1, cost: 0, zones: ['rprr', 'rrcs', 'prrr', 'rscr'], blurb: 'Khu nhà ở xanh mát bên dòng sông, có công viên và trường học.' },
    { id: 1, key: 'downtown', en: 'Downtown', vi: 'Trung tâm thành phố', icon: '🏙️', lvl: 3, cost: 1500, zones: ['cccp', 'cccc', 'pccc', 'cscc'], blurb: 'Cửa hàng, văn phòng và các toà nhà cao tầng sầm uất.' },
    { id: 2, key: 'harbor', en: 'Harbor & Industry', vi: 'Cảng & Công nghiệp', icon: '⚓', soon: 1, lvl: 6, cost: 4000, zones: ['iiii', 'iiis', 'hhii', 'hhhh'], blurb: 'Cảng biển, nhà máy và kho hàng (sắp ra mắt).' },
    { id: 3, key: 'fun', en: 'Fun Bay', vi: 'Du lịch & Giải trí', icon: '🎡', soon: 1, lvl: 8, cost: 6000, zones: ['ffpf', 'fffp', 'pffs', 'ffff'], blurb: 'Bánh xe khổng lồ, công viên nước và bãi biển (sắp ra mắt).' },
    { id: 4, key: 'campus', en: 'Campus', vi: 'Học đường & Thư viện', icon: '🎓', soon: 1, lvl: 10, cost: 8000, zones: ['eepe', 'eees', 'peee', 'eese'], blurb: 'Trường học, thư viện, bảo tàng (sắp ra mắt).' },
    { id: 5, key: 'world', en: 'World Street', vi: 'Phố quốc tế & Di sản', icon: '🌍', soon: 1, lvl: 12, cost: 10000, zones: ['wwpw', 'wwww', 'pwww', 'wwsw'], blurb: 'Phố cổ và các khu phố theo từng nước (sắp ra mắt).' }
  ];
  var ZONE_NAME = { r: 'Nhà ở', c: 'Thương mại', s: 'Dịch vụ công', p: 'Công viên', f: 'Vui chơi', e: 'Học đường', i: 'Công nghiệp', h: 'Cảng', w: 'Phố quốc tế' };
  var ZONE_COLOR = { r: '#9BD36B', c: '#8CC8E8', s: '#F2C86B', p: '#6FC98B', f: '#F29BC0', e: '#B7A0E8', i: '#B8B2A6', h: '#7FB4C9', w: '#F0A56B' };

  /* ───── địa hình & đường có sẵn ───── */
  // 0 cỏ · 1 nước · 2 cát.  Sông 2 ô ở cột 11–12 chảy dọc bản đồ; biển phía Đông (x≥68) và phía Nam (y≥45); bãi cát ở x=67 và y=43–44.
  function terrainRaw(x, y) {
    if (x < 0 || y < 0 || x >= W || y >= H) return 1;
    if (x >= 68 || y >= 45) return 1;
    if (x === 67 || (y >= 43 && y <= 44)) return 2;
    if (x === 11 || x === 12) return 1;
    return 0;
  }
  function isRoadLine(x, y) { return x >= 0 && y >= 0 && x <= 66 && y <= 42 && ((x % PER === 0 && x !== 12) || y % PER === 0); }
  var TERR = new Uint8Array(W * H), ROAD = new Uint8Array(W * H), DIST = new Uint8Array(W * H), ZONE = new Uint8Array(W * H);   // ROAD: 0 không · 1 đường · 2 cầu
  (function build() {
    var x, y, i, gbx, gby, d, bx, by;
    for (y = 0; y < H; y++) for (x = 0; x < W; x++) {
      i = y * W + x; TERR[i] = terrainRaw(x, y); DIST[i] = Math.floor(y / DS) * DW + Math.floor(x / DS);
      if (isRoadLine(x, y)) ROAD[i] = TERR[i] === 1 ? 2 : 1;
      if (!ROAD[i] && TERR[i] === 0 && x % PER !== 0 && y % PER !== 0) {
        gbx = Math.floor(x / PER); gby = Math.floor(y / PER); d = Math.floor(gby / 4) * DW + Math.floor(gbx / 4); bx = gbx % 4; by = gby % 4;
        ZONE[i] = DISTRICTS[d].zones[by].charCodeAt(bx);
      }
    }
  })();
  var idx = function (x, y) { return y * W + x; }, inW = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H; };

  /* ───── công trình cố định của thành phố (ai cũng có, không dỡ được) ───── */
  var FIXED = [];
  (function () {
    DISTRICTS.forEach(function (dd) {
      var bx, by, z, gx0, gy0, c;
      for (by = 0; by < 4; by++) for (bx = 0; bx < 4; bx++) {
        z = dd.zones[by].charAt(bx); gx0 = (dd.id % DW) * DS + bx * PER + 1; gy0 = Math.floor(dd.id / DW) * DS + by * PER + 1;
        if (TERR[idx(gx0 + 2, gy0 + 2)] !== 0) continue;
        if (z === 'p') FIXED.push({ k: 'plaza', x: gx0 + 2, y: gy0 + 2, w: 1, h: 1 });
      }
    });
    FIXED.push({ k: 'townhall', x: 20, y: 8, w: 3, h: 3 });                // Khu dân cư: khối dịch vụ (3,1)
    FIXED.push({ k: 'clocktower', x: 33, y: 21, w: 1, h: 1 });            // Trung tâm
  })();
  var FOCC = new Int16Array(W * H).fill(-1); FIXED.forEach(function (f, n) { var a, b; for (b = 0; b < f.h; b++) for (a = 0; a < f.w; a++) FOCC[idx(f.x + a, f.y + b)] = n; });

  /* ───── danh mục công trình ─────
     k mã · en/vi tên · cat loại cửa hàng · w×h ô · z chữ khối đất được phép ('*' = mọi khối) · lvl cấp thành phố cần · cost xu · secs giây xây cấp 1 · inc xu/giờ cấp 1 · pop dân cấp 1 · hp điểm hạnh phúc · ds quận bán */
  var CATS = [['home', '🏠 Nhà ở'], ['shop', '🛍️ Thương mại'], ['park', '🌳 Công viên'], ['civic', '🏥 Dịch vụ']];
  function B(k, en, vi, cat, w, h, z, lvl, cost, secs, inc, pop, hp, ds, desc) { return { k: k, en: en, vi: vi, cat: cat, w: w, h: h, z: z, lvl: lvl, cost: cost, secs: secs, inc: inc, pop: pop, hp: hp, ds: ds, desc: desc || '' }; }
  var ITEMS = [
    B('cottage', 'Small House', 'Nhà nhỏ', 'home', 1, 1, 'r', 1, 150, 10, 10, 4, 0, [0, 1], 'A small house for a family.'),
    B('townhouse', 'Townhouse', 'Nhà phố', 'home', 1, 1, 'r', 2, 400, 30, 24, 8, 0, [0, 1], 'A tall, narrow house in a row.'),
    B('duplex', 'Twin Houses', 'Nhà song lập', 'home', 2, 1, 'r', 3, 900, 60, 52, 14, 0, [0, 1], 'Two houses that share a wall.'),
    B('villa', 'Villa', 'Biệt thự', 'home', 2, 2, 'r', 5, 2600, 180, 125, 24, 1, [0], 'A big house with a garden.'),
    B('apartment', 'Apartment Block', 'Chung cư', 'home', 2, 2, 'rc', 7, 5200, 360, 250, 60, 0, [0, 1], 'Many families live in one building.'),
    B('condo', 'Condo Tower', 'Cao ốc căn hộ', 'home', 3, 3, 'rc', 10, 12000, 720, 540, 140, 0, [1], 'A tall tower with many flats.'),
    B('kiosk', 'Kiosk', 'Quầy bán báo', 'shop', 1, 1, 'rc', 1, 120, 10, 12, 0, 0, [0, 1], 'A tiny stand that sells newspapers.'),
    B('bakery', 'Bakery', 'Tiệm bánh', 'shop', 1, 1, 'rc', 2, 350, 30, 30, 0, 0, [0, 1], 'Fresh bread every morning.'),
    B('cafe', 'Coffee Shop', 'Quán cà phê', 'shop', 1, 1, 'rc', 3, 600, 45, 50, 0, 1, [0, 1], 'People drink coffee and talk here.'),
    B('shop', 'Clothes Shop', 'Cửa hàng quần áo', 'shop', 2, 1, 'c', 4, 1400, 90, 105, 0, 0, [0, 1], 'You can buy shirts and shoes.'),
    B('market', 'Supermarket', 'Siêu thị', 'shop', 2, 2, 'c', 6, 3600, 240, 240, 0, 0, [0, 1], 'A big shop with food and drinks.'),
    B('bank', 'Bank', 'Ngân hàng', 'shop', 2, 2, 'c', 8, 6200, 420, 410, 0, 0, [1], 'People keep their money here.'),
    B('office', 'Office Building', 'Toà văn phòng', 'shop', 2, 2, 'c', 9, 8000, 540, 540, 0, 0, [1], 'People work at desks in this building.'),
    B('hotel', 'Hotel', 'Khách sạn', 'shop', 2, 2, 'c', 10, 11000, 720, 820, 0, 2, [1], 'Visitors sleep here.'),
    B('mall', 'Shopping Mall', 'Trung tâm mua sắm', 'shop', 3, 3, 'c', 11, 18000, 900, 1120, 0, 2, [1], 'Many shops under one roof.'),
    B('skyscraper', 'Skyscraper', 'Nhà chọc trời', 'shop', 3, 3, 'c', 13, 30000, 1500, 1900, 0, 0, [1], 'A very tall building in the city centre.'),
    B('tree', 'Garden Tree', 'Cây xanh', 'park', 1, 1, '*', 1, 60, 5, 0, 0, 1, [0, 1], 'A green tree gives shade.'),
    B('flowerbed', 'Flower Bed', 'Bồn hoa', 'park', 1, 1, '*', 1, 90, 5, 0, 0, 2, [0, 1], 'Colourful flowers make people smile.'),
    B('fountain', 'Fountain', 'Đài phun nước', 'park', 1, 1, '*', 3, 500, 20, 0, 0, 6, [0, 1], 'Water jumps up and falls down.'),
    B('playground', 'Playground', 'Sân chơi', 'park', 2, 2, '*', 4, 1200, 60, 0, 0, 14, [0, 1], 'Children play on the slide and swing.'),
    B('court', 'Basketball Court', 'Sân bóng rổ', 'park', 2, 2, '*', 6, 2000, 120, 0, 0, 20, [0, 1], 'Friends play basketball here.'),
    B('pondpark', 'Pond Park', 'Công viên hồ', 'park', 2, 2, '*', 6, 2400, 120, 0, 0, 24, [0, 1], 'Ducks swim in the pond.'),
    B('statue', 'Statue Plaza', 'Quảng trường tượng đài', 'park', 2, 2, '*', 8, 4200, 240, 0, 0, 34, [0, 1], 'A famous statue stands in the middle.'),
    B('busstop', 'Bus Stop', 'Trạm xe buýt', 'civic', 1, 1, '*', 2, 300, 15, 0, 0, 3, [0, 1], 'You wait here for the bus.'),
    B('clinic', 'Clinic', 'Phòng khám', 'civic', 2, 2, 's', 5, 3000, 150, 0, 0, 20, [0, 1], 'A doctor helps sick people here.'),
    B('firestation', 'Fire Station', 'Trạm cứu hoả', 'civic', 2, 2, 's', 7, 5000, 300, 0, 0, 25, [0, 1], 'Firefighters wait here for a call.'),
    B('police', 'Police Station', 'Đồn cảnh sát', 'civic', 2, 2, 's', 7, 5000, 300, 0, 0, 25, [0, 1], 'Police officers keep the city safe.'),
    B('school', 'School', 'Trường học', 'civic', 3, 2, 's', 8, 8000, 480, 0, 0, 40, [0, 1], 'Students learn English and maths here.'),
    B('library', 'Library', 'Thư viện', 'civic', 2, 2, 's', 9, 7000, 420, 0, 0, 30, [0, 1], 'You can read many books here.')
  ];
  var BY = {}; ITEMS.forEach(function (i) { BY[i.k] = i; });
  // công trình cố định (chỉ để vẽ)
  var FIXED_DEF = { plaza: { en: 'Town Plaza', vi: 'Quảng trường', w: 1, h: 1 }, townhall: { en: 'Town Hall', vi: 'Toà thị chính', w: 3, h: 3 }, clocktower: { en: 'Clock Tower', vi: 'Tháp đồng hồ', w: 1, h: 1 } };

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
      if (TERR[i] !== 0) return { ok: false, err: 'Chỗ này là nước hoặc bãi cát — không xây được.' };
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

  var API = { W: W, H: H, DS: DS, DW: DW, DH: DH, PER: PER, DISTRICTS: DISTRICTS, ZONE_NAME: ZONE_NAME, ZONE_COLOR: ZONE_COLOR, TERR: TERR, ROAD: ROAD, DIST: DIST, ZONE: ZONE, FIXED: FIXED, FOCC: FOCC, FIXED_DEF: FIXED_DEF,
    CATS: CATS, ITEMS: ITEMS, BY: BY, MAXLV: MAXLV, RULES: RULES, LEVEL_AT: LEVEL_AT, idx: idx, inW: inW, itemCost: itemCost, buildSecs: buildSecs, incomeH: incomeH, popOf: popOf, hpOf: hpOf, speedCost: speedCost,
    levelOfScore: levelOfScore, scoreOf: scoreOf, buildOcc: buildOcc, canPlace: canPlace, canRoad: canRoad, adjacentRoad: adjacentRoad, zoneList: zoneList, isRoadAt: isRoadAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTCityData = API;
})(typeof window !== 'undefined' ? window : this);
