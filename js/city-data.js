/* EWT City — DỮ LIỆU DÙNG CHUNG cho máy chủ và trình duyệt: bản đồ thành phố, quận, khu quy hoạch sẵn, mạng lưới đường sẵn, danh mục công trình, luật chơi.
   Mọi phép kiểm tra (đặt công trình, xây đường, giá, thời gian…) đều dùng đúng các hàm ở đây nên hai phía luôn cho cùng kết quả. */
(function (root) {
  'use strict';
  var DS = 24, DW = 3, DH = 2, W = DS * DW, H = DS * DH, PER = 6;   // 6 quận 24×24 ô → bản đồ 72×48 ô; đường chính cách nhau 6 ô → mỗi khối đất 5×5 ô

  /* ───── 6 quận ───── (zones: 4×4 khối, mỗi khối một chữ: r nhà ở · c thương mại · s dịch vụ công · p công viên · f vui chơi · e học đường · i công nghiệp · h cảng · w phố quốc tế) */
  var DISTRICTS = [
    { id: 0, key: 'home', en: 'Sunny Homes', vi: 'Khu dân cư Nắng Mai', icon: '🏡', free: true, lvl: 1, cost: 0, zones: ['rprr', 'rrcs', 'prrr', 'rscr'], blurb: 'Khu nhà ở xanh mát bên dòng sông, có công viên và trường học.' },
    { id: 1, key: 'downtown', en: 'Downtown', vi: 'Trung tâm thành phố', icon: '🏙️', lvl: 3, cost: 1500, zones: ['cccp', 'cccc', 'pccc', 'cscc'], blurb: 'Cửa hàng, văn phòng và các toà nhà cao tầng sầm uất.' },
    { id: 2, key: 'harbor', en: 'Harbor & Industry', vi: 'Cảng & Công nghiệp', icon: '⚓', lvl: 6, cost: 4000, zones: ['iihx', 'iihx', 'ishx', 'ihhx'], blurb: 'Cảng biển, cần cẩu, nhà máy và kho hàng bên bờ biển.' },
    { id: 3, key: 'fun', en: 'Fun Bay', vi: 'Du lịch & Giải trí', icon: '🎡', lvl: 8, cost: 6000, zones: ['ffpf', 'fffp', 'pffs', 'ffff'], blurb: 'Vòng quay khổng lồ, công viên nước, rạp xiếc và bãi biển.' },
    { id: 4, key: 'campus', en: 'Campus', vi: 'Học đường & Thư viện', icon: '🎓', lvl: 10, cost: 8000, zones: ['eepe', 'eees', 'peee', 'eeee'], blurb: 'Trường học, đại học, bảo tàng, đài thiên văn và phòng tranh.' },
    { id: 5, key: 'world', en: 'World Street', vi: 'Phố quốc tế & Di sản', icon: '🌍', lvl: 12, cost: 10000, zones: ['wwpx', 'wwwx', 'pwsx', 'wwwx'], blurb: 'Phố cổ và các công trình nổi tiếng từ khắp nơi trên thế giới.' }
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
    FIXED.push({ k: 'clocktower', x: 33, y: 21, w: 1, h: 1 });
    FIXED.push({ k: 'bigplaza', x: 63, y: 21, w: 1, h: 1 });            // Trung tâm
  })();
  var FOCC = new Int16Array(W * H).fill(-1); FIXED.forEach(function (f, n) { var a, b; for (b = 0; b < f.h; b++) for (a = 0; a < f.w; a++) FOCC[idx(f.x + a, f.y + b)] = n; });

  /* ───── danh mục công trình ─────
     k mã · en/vi tên · cat loại cửa hàng · w×h ô · z chữ khối đất được phép ('*' = mọi khối) · lvl cấp thành phố cần · cost xu · secs giây xây cấp 1 · inc xu/giờ cấp 1 · pop dân cấp 1 · hp điểm hạnh phúc · ds quận bán */
  var CATS = [['home', '🏠 Nhà ở'], ['shop', '🛍️ Thương mại'], ['park', '🌳 Công viên'], ['civic', '🏥 Dịch vụ'], ['port', '⚓ Cảng & CN'], ['fun', '🎡 Vui chơi'], ['edu', '🎓 Học đường'], ['world', '🌍 Quốc tế'], ['event', '🎉 Sự kiện']];
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
    B('tree', 'Garden Tree', 'Cây xanh', 'park', 1, 1, '*', 1, 60, 5, 0, 0, 1, [0, 1], 'A green tree gives shade.'),
    B('flowerbed', 'Flower Bed', 'Bồn hoa', 'park', 1, 1, '*', 1, 90, 5, 0, 0, 2, [0, 1], 'Colourful flowers make people smile.'),
    B('fountain', 'Fountain', 'Đài phun nước', 'park', 1, 1, '*', 3, 500, 20, 0, 0, 6, [0, 1], 'Water jumps up and falls down.'),
    B('playground', 'Playground', 'Sân chơi', 'park', 2, 2, '*', 4, 1200, 60, 0, 0, 14, [0, 1], 'Children play on the slide and swing.'),
    B('court', 'Basketball Court', 'Sân bóng rổ', 'park', 2, 2, '*', 6, 2000, 120, 0, 0, 20, [0, 1], 'Friends play basketball here.'),
    B('pondpark', 'Pond Park', 'Công viên hồ', 'park', 2, 2, '*', 6, 2400, 120, 0, 0, 24, [0, 1], 'Ducks swim in the pond.'),
    B('statue', 'Statue Plaza', 'Quảng trường tượng đài', 'park', 2, 2, '*', 8, 4200, 240, 0, 0, 34, [0, 1], 'A famous statue stands in the middle.'),
    B('busstop', 'Bus Stop', 'Trạm xe buýt', 'civic', 1, 1, '*', 2, 300, 15, 0, 0, 3, [0, 1], 'You wait here for the bus.'),
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
    // ── Sự kiện theo mùa (chỉ mua được khi sự kiện đang diễn ra, giống EWT Garden) ──
    B('lanternarch', 'Lantern Arch', 'Cổng đèn lồng', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 12, [0, 1, 2, 3, 4, 5], 'Red lanterns welcome the New Year.', { ev: 'tet' }),
    B('peachtree', 'Peach Blossom Tree', 'Cây đào Tết', 'event', 1, 1, '*', 1, 300, 15, 0, 0, 10, [0, 1, 2, 3, 4, 5], 'Pink flowers bring good luck at Tet.', { ev: 'tet' }),
    B('moonlantern', 'Star Lantern', 'Đèn ông sao', 'event', 1, 1, '*', 1, 300, 15, 0, 0, 10, [0, 1, 2, 3, 4, 5], 'Children carry star lanterns at Mid-Autumn.', { ev: 'trungthu' }),
    B('rabbitlantern', 'Rabbit Lantern', 'Đèn thỏ', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 12, [0, 1, 2, 3, 4, 5], 'A cute rabbit lantern for the moon festival.', { ev: 'trungthu' }),
    B('xmastree', 'Christmas Tree', 'Cây thông Noel', 'event', 1, 1, '*', 1, 400, 20, 0, 0, 12, [0, 1, 2, 3, 4, 5], 'A tree with lights and gifts.', { ev: 'noel' }),
    B('bigsnowman', 'Big Snowman', 'Người tuyết lớn', 'event', 2, 2, '*', 1, 900, 40, 0, 0, 24, [0, 1, 2, 3, 4, 5], 'A friendly snowman with a red scarf.', { ev: 'noel' })

  ];
  var BY = {}; ITEMS.forEach(function (i) { BY[i.k] = i; });
  // công trình cố định (chỉ để vẽ)
  var FIXED_DEF = { plaza: { en: 'Town Plaza', vi: 'Quảng trường', w: 1, h: 1 }, townhall: { en: 'Town Hall', vi: 'Toà thị chính', w: 3, h: 3 }, clocktower: { en: 'Clock Tower', vi: 'Tháp đồng hồ', w: 1, h: 1 }, bigplaza: { en: 'Harbor Plaza', vi: 'Quảng trường cảng', w: 1, h: 1 } };

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
    { id: 'b-tet', d: -1, ev: 'tet', icon: '🧧', en: 'Lunar New Year Pack', vi: 'Gói Tết', items: { lanternarch: 2, peachtree: 3 } },
    { id: 'b-moon', d: -1, ev: 'trungthu', icon: '🥮', en: 'Mid-Autumn Pack', vi: 'Gói Trung thu', items: { moonlantern: 3, rabbitlantern: 2 } },
    { id: 'b-noel', d: -1, ev: 'noel', icon: '🎄', en: 'Christmas Pack', vi: 'Gói Giáng sinh', items: { xmastree: 2, bigsnowman: 1 } }
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
  PLANS.forEach(function (pl) { pl.roads = Y5.map(function (y) { return [2, y]; }); });
  var PLAN_BY = {}; PLANS.forEach(function (pl) { PLAN_BY[pl.id] = pl; });
  var API = { BUNDLES: BUNDLES, BUNDLE_BY: BUNDLE_BY, bundlePrice: bundlePrice, bundleFull: bundleFull, bundleLvl: bundleLvl, PLANS: PLANS, PLAN_BY: PLAN_BY, W: W, H: H, DS: DS, DW: DW, DH: DH, PER: PER, DISTRICTS: DISTRICTS, ZONE_NAME: ZONE_NAME, ZONE_COLOR: ZONE_COLOR, TERR: TERR, ROAD: ROAD, DIST: DIST, ZONE: ZONE, FIXED: FIXED, FOCC: FOCC, FIXED_DEF: FIXED_DEF,
    CATS: CATS, ITEMS: ITEMS, BY: BY, MAXLV: MAXLV, RULES: RULES, LEVEL_AT: LEVEL_AT, idx: idx, inW: inW, itemCost: itemCost, buildSecs: buildSecs, incomeH: incomeH, popOf: popOf, hpOf: hpOf, speedCost: speedCost,
    levelOfScore: levelOfScore, scoreOf: scoreOf, buildOcc: buildOcc, canPlace: canPlace, canRoad: canRoad, adjacentRoad: adjacentRoad, zoneList: zoneList, isRoadAt: isRoadAt };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTCityData = API;
})(typeof window !== 'undefined' ? window : this);
