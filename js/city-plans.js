/* EWT City — MẪU XÂY DỰNG (quy hoạch): rất nhiều bản mẫu cho từng loại khu, người chơi xem hình minh hoạ rồi chọn (tương tự "Mẫu vườn" của EWT Garden).
   Dùng chung cho trình duyệt (xem trước) và máy chủ (tính giá & dựng thật) nên hai bên luôn ra CÙNG một kết quả.
   Mẫu cỡ S = một khối 5×5 ô (khối phố bình thường). Mẫu cỡ L = 11×11 ô, ghép 4 mẫu S + đường chữ thập (dành cho khu đất rộng: nông trại, bãi biển, công viên, thể thao…).
   Mỗi mẫu = { items: [[mã, x, y]…], roads: [[x, y]…] } tính từ góc trên-trái của khối. */
(function (root) {
  'use strict';
  var C = root.EWTCityData || (typeof require === 'function' ? require('./city-data.js') : null); if (!C) return;
  var BY = C.BY;

  /* ───── 5 kiểu bố cục cho khối 5×5 ───── */
  var ARCH = {
    twin: { vi: 'Hai dãy bên đường', desc: 'Hai dãy công trình đứng đối diện nhau, con đường nhỏ chạy dọc ở giữa; cuối mỗi dãy có cây và hoa.' },
    quad: { vi: 'Bốn góc quanh quảng trường', desc: 'Bốn công trình ở bốn góc, hai con đường cắt nhau thành chữ thập, giữa là điểm nhấn.' },
    big: { vi: 'Một công trình lớn', desc: 'Một công trình lớn làm điểm nhấn ở góc, phía bên là hàng cây, đèn; phía dưới là các cửa hàng nhỏ.' },
    row: { vi: 'Dãy cửa hàng nhỏ', desc: 'Đường ngang chạy ở giữa, hai bên là dãy công trình nhỏ xen cây xanh và hoa — phố nhỏ nhộn nhịp.' },
    ring: { vi: 'Vòng quanh điểm nhấn', desc: 'Vòng đường nhỏ ôm lấy điểm nhấn ở giữa; công trình, hoa và cây xếp quanh ngoài như một quảng trường.' }
  };

  /* ───── trang trí mặc định theo từng loại khu ───── */
  var DECO = {
    r: { t: ['oak', 'cherry', 'tree'], f: ['flowerbed', 'tulip', 'rose'], b: ['benchwood', 'mailbox'], p: ['streetlamp', 'gardenlamp'], c: 'fountain' },
    c: { t: ['tree', 'oak'], f: ['flowerbed', 'hedge'], b: ['benchmodern', 'busstop'], p: ['modernlamp', 'streetlamp'], c: 'streetclock' },
    s: { t: ['oak', 'tree'], f: ['flowerbed', 'hedge'], b: ['benchwood', 'signpost'], p: ['classiclamp', 'streetlamp'], c: 'flagpole' },
    p: { t: ['oak', 'willow', 'cherry'], f: ['tulip', 'rose', 'daisy'], b: ['benchwood', 'picnic'], p: ['gardenlamp', 'stonelantern'], c: 'fountain' },
    f: { t: ['tree', 'maple'], f: ['rainbowbed', 'sunflower'], b: ['swingbench', 'benchmodern'], p: ['lanternstring', 'neonsign'], c: 'fountain' },
    e: { t: ['oak', 'maple'], f: ['flowerbed', 'tulip'], b: ['benchwood', 'infoboard'], p: ['classiclamp', 'streetlamp'], c: 'sundial' },
    i: { t: ['pine', 'tree'], f: ['hedge', 'flowerpot'], b: ['benchstone', 'bins'], p: ['modernlamp', 'spotlight'], c: 'flagpole' },
    h: { t: ['palmtree', 'tree'], f: ['hedge', 'flowerpot'], b: ['benchstone', 'bikerack'], p: ['modernlamp', 'streetlamp'], c: 'flagpole' },
    w: { t: ['cherry', 'bonsai'], f: ['lotus', 'orchid'], b: ['benchstone', 'swingbench'], p: ['stonelantern', 'lanternstring'], c: 'zengarden' },
    b: { t: ['palmtree', 'palmtree'], f: ['hibiscus', 'flowerpot'], b: ['benchwood', 'swingbench'], p: ['lanternstring', 'torch'], c: 'fountain' },
    m: { t: ['pine', 'birch'], f: ['lavender', 'daisy'], b: ['benchwood', 'picnic'], p: ['torch', 'stonelantern'], c: 'rockgarden' },
    a: { t: ['fruit', 'tree'], f: ['sunflower', 'poppy'], b: ['benchwood', 'picnic'], p: ['gardenlamp', 'torch'], c: 'stonewell' },
    t: { t: ['tree', 'oak'], f: ['hedge', 'flowerpot'], b: ['benchmodern', 'busstop'], p: ['modernlamp', 'spotlight'], c: 'flagpole' },
    g: { t: ['tree', 'oak'], f: ['hedge', 'tulip'], b: ['benchmodern', 'drinkfountain'], p: ['spotlight', 'modernlamp'], c: 'flagpole' }
  };
  var ZICON = { r: '🏠', c: '🛍️', s: '🏥', p: '🌳', f: '🎡', e: '🎓', i: '🏭', h: '⚓', w: '🌍', b: '🏖️', m: '⛰️', a: '🌾', t: '✈️', g: '🏟️' };

  /* ───── các mẫu theo từng loại khu: [kiểu bố cục, biểu tượng, tên Việt, tên Anh, mô tả, vai trò món] ─────
     vai trò: a = món 2×2 · l = món lớn 3×3 / 3×2 / 4×4 · s = món nhỏ 1×1 · c = điểm nhấn giữa · t f b p = cây, hoa, ghế, đèn (nếu bỏ trống dùng mặc định theo khu) */
  var STY = {
    r: [
      ['twin', '🏡', 'Phố biệt thự hiện đại', 'Modern Villa Street', 'Hai dãy biệt thự hiện đại, kiểu Pháp và Địa Trung Hải đối diện nhau, hai bên trồng anh đào và hoa.', { a: ['modernvilla', 'frenchvilla', 'medvilla', 'frenchvilla'] }],
      ['quad', '🏢', 'Cụm chung cư xanh', 'Green Apartments', 'Bốn toà chung cư từ thấp tầng đến 40 tầng quanh một đài phun nước.', { a: ['lowrise', 'apartment', 'midrise', 'towerblock'] }],
      ['big', '🏰', 'Dinh thự và khu vườn', 'Mansion & Garden', 'Một dinh thự lớn có cột, bên dưới là những ngôi nhà nhỏ xinh.', { l: ['mansion'], s: ['cottage', 'townhouse', 'onefloor', 'tubehouse'] }],
      ['row', '🏘️', 'Phố nhà nhỏ xinh', 'Cosy Little Street', 'Con phố ngang với nhà trệt, nhà phố, nhà Nhật, nhà gỗ, nhà sàn — mỗi nhà một kiểu.', { s: ['cottage', 'townhouse', 'onefloor', 'japhouse', 'chalet', 'logcabin', 'stilthouse'] }],
      ['ring', '🛖', 'Làng quê quanh giếng', 'Village Round the Well', 'Những ngôi nhà gỗ và nhà sàn xếp vòng quanh chiếc giếng đá giữa làng.', { s: ['logcabin', 'stilthouse', 'onefloor', 'chalet', 'japhouse'], c: 'stonewell' }],
      ['twin', '🌊', 'Nhà ven hồ', 'Lakeside Homes', 'Hai dãy nhà ven hồ có bến gỗ nhỏ, mát mẻ và yên tĩnh.', { a: ['lakehouse', 'beachvilla', 'lakehouse', 'medvilla'], t: ['willow', 'oak'] }]
    ],
    c: [
      ['twin', '🛍️', 'Phố mua sắm lớn', 'Grand Shopping Street', 'Siêu thị, chợ, chợ đêm và rạp chiếu phim đứng hai bên phố.', { a: ['supermarket', 'market', 'nightmarket', 'cinema2'] }],
      ['quad', '🏢', 'Quảng trường văn phòng', 'Office Square', 'Bốn toà văn phòng kính, ngân hàng và khu khởi nghiệp quanh đồng hồ phố.', { a: ['office', 'glassoffice', 'bankhq', 'coworking'] }],
      ['big', '🏬', 'Trung tâm thương mại', 'Shopping Centre', 'Một trung tâm mua sắm lớn, xung quanh là cửa hàng thời trang, tiệm hoa và hiệu thuốc.', { l: ['mall'], s: ['boutique', 'minimart', 'flowershop', 'pharmacy'] }],
      ['big', '🌆', 'Đường chân trời', 'City Skyline', 'Một toà nhà chọc trời nổi bật cùng các quán nhỏ dưới chân.', { l: ['skyscraper'], s: ['cafe', 'bakery', 'minimart', 'kiosk'] }],
      ['row', '🍜', 'Phố ẩm thực', 'Food Street', 'Quán phở, cà phê, tiệm bánh, quầy báo — hương thơm cả con phố.', { s: ['noodleshop', 'cafe', 'bakery', 'kiosk', 'flowershop'] }],
      ['ring', '⏰', 'Ngã tư phố cà phê', 'Coffee Corner', 'Một vòng cửa hàng nhỏ quanh chiếc đồng hồ phố giữa ngã tư.', { s: ['cafe', 'bakery', 'boutique', 'pharmacy', 'minimart'] }]
    ],
    s: [
      ['twin', '🏥', 'Khu y tế & cứu hộ', 'Health & Rescue', 'Phòng khám, trạm cứu hỏa và đồn cảnh sát chăm lo cho cả khu phố.', { a: ['clinic', 'firestation', 'police', 'clinic'] }],
      ['quad', '📚', 'Trung tâm hành chính', 'Civic Centre', 'Thư viện, toà án, nhà văn hoá và phòng khám quanh cột cờ.', { a: ['library', 'courthouse', 'commcenter', 'clinic'] }],
      ['big', '🏨', 'Bệnh viện lớn', 'Big Hospital', 'Một bệnh viện ba tầng có bãi trực thăng, cây xanh và hoa xung quanh.', { l: ['hospital'] }],
      ['big', '🏫', 'Khu trường học', 'School Block', 'Trường học lớn, sân chơi và bồn hoa.', { l: ['school'] }],
      ['big', '🚆', 'Khu nhà ga', 'Station Block', 'Nhà ga tàu hoả với đồng hồ lớn, ghế chờ và đèn.', { l: ['railstation'] }],
      ['quad', '♻️', 'Trung tâm tiện ích', 'Utility Centre', 'Trạm tái chế, ga tàu điện ngầm, nhà văn hoá và đội bảo vệ bờ biển.', { a: ['commcenter', 'recyclecenter', 'metroentry', 'coastguard'] }],
      ['big', '🏛️', 'Toà thị chính', 'City Hall Block', 'Toà thị chính bề thế ở góc phố, vườn hoa phía trước.', { l: ['cityhall'] }]
    ],
    p: [
      ['twin', '🎠', 'Công viên gia đình', 'Family Park', 'Sân chơi, khu dã ngoại, công viên chó và ao nhỏ hai bên lối dạo.', { a: ['playground', 'picnicarea', 'dogpark', 'pondpark'] }],
      ['quad', '🎶', 'Vườn nhạc & thú nhỏ', 'Music & Pets Garden', 'Nhà hát ngoài trời, vườn thú nhỏ, nhà trên cây quanh đài phun nước.', { a: ['bandstand', 'petting', 'treehouse', 'pondpark'] }],
      ['big', '🌺', 'Vườn bách thảo', 'Botanical Garden', 'Nhà kính bách thảo lớn, xung quanh hoa và đèn vườn.', { l: ['botanical'] }],
      ['big', '🦁', 'Vườn thú', 'Little Zoo', 'Một vườn thú rộng rãi với nhiều chuồng, ghế nghỉ dưới tán cây.', { l: ['zoo'] }],
      ['quad', '⚽', 'Thể thao ngoài trời', 'Outdoor Sports', 'Bóng chuyền, tennis, sân đa năng và khu cắm trại.', { a: ['volleyball', 'tenniscourt', 'court', 'campsite'] }],
      ['ring', '⛲', 'Vòng hoa đài phun nước', 'Fountain Garden', 'Vòng hoa và cây quanh đài phun nước — nơi thư giãn yên tĩnh.', { c: 'fountain', f: ['tulip', 'rose', 'daisy', 'lavender'], t: ['cherry', 'willow'] }],
      ['big', '⛳', 'Sân golf nhỏ', 'Golf Corner', 'Một sân golf rộng giữa bãi cỏ xanh.', { l: ['golf'] }]
    ],
    f: [
      ['twin', '🎠', 'Phố trò chơi', 'Game Street', 'Đu quay ngựa gỗ, xe điện đụng, rạp xiếc và sân gôn mini.', { a: ['carousel', 'bumpercars', 'circus', 'minigolf'] }],
      ['quad', '🏴‍☠️', 'Công viên giải trí', 'Funfair Square', 'Tàu cướp biển, bowling, rạp phim và quán karaoke quanh quảng trường.', { a: ['pirateship', 'bowling', 'cinema', 'karaoke'] }],
      ['big', '💦', 'Công viên nước', 'Water Park', 'Một công viên nước lớn với cầu trượt và hồ bơi.', { l: ['waterpark'] }],
      ['big', '🎡', 'Vòng quay khổng lồ', 'Giant Wheel', 'Vòng quay khổng lồ nhìn được cả thành phố, bên dưới là quầy kem.', { l: ['ferris'], s: ['icecream', 'beachhut', 'icecream', 'beachhut'] }],
      ['row', '🍦', 'Phố kem & quà', 'Ice Cream Row', 'Dãy quầy kem và nhà bãi biển sặc sỡ, đèn dây lấp lánh.', { s: ['icecream', 'beachhut', 'droptower', 'icecream'] }],
      ['big', '🐠', 'Thuỷ cung', 'Aquarium Block', 'Thuỷ cung lớn có nhiều loài cá, kèm quầy kem.', { l: ['aquarium'], s: ['icecream', 'beachhut'] }]
    ],
    e: [
      ['twin', '🧒', 'Khu trường mầm non', 'Kindergarten Row', 'Trường mầm non, phòng thí nghiệm, ký túc xá và trường nghệ thuật.', { a: ['kindergarten', 'lab', 'dorm', 'artschool'] }],
      ['quad', '🔭', 'Quảng trường tri thức', 'Knowledge Square', 'Cung thiên văn, đài quan sát, phòng tranh và phòng công nghệ.', { a: ['planetarium', 'observatory', 'artgallery', 'techlab'] }],
      ['big', '🎓', 'Đại học', 'University Block', 'Một trường đại học lớn có sân cỏ và hàng cây.', { l: ['university'] }],
      ['big', '🏛️', 'Bảo tàng', 'Museum Block', 'Bảo tàng rộng rãi, vườn hoa và ghế nghỉ.', { l: ['museum'] }],
      ['row', '📖', 'Phố sách', 'Book Street', 'Dãy hiệu sách xen cây xanh, đèn đường cổ.', { s: ['bookstore'] }],
      ['ring', '☀️', 'Sân trường đồng hồ mặt trời', 'Sundial Yard', 'Sân trường với đồng hồ mặt trời ở giữa, hiệu sách và hoa xung quanh.', { s: ['bookstore'], c: 'sundial' }]
    ],
    i: [
      ['twin', '🏭', 'Khu xưởng', 'Workshop Row', 'Kho hàng, trạm tái chế và trung tâm dữ liệu.', { a: ['warehouse', 'recycling', 'recyclecenter', 'datacenter'] }],
      ['quad', '⚡', 'Khu năng lượng', 'Energy Square', 'Tháp silo, tháp hoá chất, trạm tái chế và kho hàng.', { a: ['silotower', 'chemtower', 'recyclecenter', 'warehouse'] }],
      ['big', '🏗️', 'Nhà máy lớn', 'Big Factory', 'Nhà máy với dãy mái răng cưa và hai ống khói.', { l: ['factory'] }],
      ['big', '🔌', 'Nhà máy điện', 'Power Plant', 'Nhà máy điện với tháp làm mát và ống khói cao.', { l: ['powerplant'] }],
      ['big', '🏭', 'Nhà máy ống khói cao', 'Smokestack Works', 'Nhà máy có hai ống khói sọc đỏ trắng cao vút.', { l: ['smokestackfactory'] }],
      ['ring', '💧', 'Sân kho tháp nước', 'Water Tower Yard', 'Tháp nước và xưởng nhỏ xếp quanh cột cờ.', { s: ['watertower'], c: 'flagpole' }]
    ],
    h: [
      ['twin', '⚓', 'Bến kho vận', 'Logistics Quay', 'Kho hàng, cần cẩu và bãi container hai bên bến.', { a: ['warehouse', 'containers', 'crane', 'warehouse'] }],
      ['quad', '🚢', 'Bến cảng', 'Harbour Square', 'Hai cần cẩu, hai bãi container quanh quảng trường cảng.', { a: ['crane', 'containers', 'warehouse', 'containers'] }],
      ['big', '🛠️', 'Xưởng đóng tàu', 'Shipyard Block', 'Xưởng đóng tàu lớn bên bến, kho nhỏ xung quanh.', { l: ['shipyard'] }],
      ['ring', '🗼', 'Quảng trường hải đăng', 'Lighthouse Square', 'Hải đăng ở giữa, các hàng cây cọ và ghế đá quanh đài.', { c: 'lighthouse', s: ['lighthouse'] }]
    ],
    w: [
      ['twin', '🏯', 'Phố kiến trúc thế giới', 'World Architecture Street', 'Chùa, cối xay gió, đền Hy Lạp và tháp sắt đứng hai bên.', { a: ['pagoda', 'windmill', 'greektemple', 'irontower'] }],
      ['quad', '🗽', 'Quảng trường kỳ quan', 'Wonders Square', 'Bốn công trình nổi tiếng thế giới quanh quảng trường.', { a: ['irontower', 'pagoda', 'greektemple', 'windmill'] }],
      ['big', '🏰', 'Lâu đài cổ', 'Old Castle', 'Một lâu đài đá lớn với tháp canh và cờ.', { l: ['castle'] }],
      ['big', '🏟️', 'Đấu trường La Mã', 'Roman Arena', 'Đấu trường tròn rộng lớn, xung quanh là hoa và đèn đá.', { l: ['colosseum'] }],
      ['big', '🔺', 'Kim tự tháp', 'Pyramid Block', 'Kim tự tháp lớn giữa cát vàng cùng đèn đá.', { l: ['pyramid'] }],
      ['row', '🍣', 'Phố ẩm thực quốc tế', 'World Food Street', 'Sushi, pizza, quán trà và cổng torii thành một con phố đẹp.', { s: ['sushi', 'pizzeria', 'teahouse', 'torii'] }],
      ['ring', '🗽', 'Vườn Nhật & tượng Nữ thần', 'Garden Round the Statue', 'Quán trà, sushi và cổng torii quanh tượng Nữ thần Tự do.', { s: ['sushi', 'teahouse', 'torii'], c: 'liberty' }]
    ],
    b: [
      ['twin', '🦞', 'Dải nhà hàng biển', 'Seafood Strip', 'Nhà hàng hải sản, bóng chuyền, spa và biệt thự biển.', { a: ['seafood', 'volleyball', 'spa', 'beachvilla'] }],
      ['quad', '🏝️', 'Khu nghỉ dưỡng', 'Resort Square', 'Spa, nhà hàng, biệt thự và nhà biển quanh đài phun nước.', { a: ['spa', 'seafood', 'beachhouse', 'beachvilla'] }],
      ['big', '🏨', 'Resort lớn', 'Grand Resort', 'Một khu nghỉ dưỡng lớn có hồ bơi, quầy bar và cửa hàng lưu niệm.', { l: ['resorthotel'], s: ['beachbar', 'souvenir', 'surfshop', 'lifeguard'] }],
      ['big', '⛵', 'Câu lạc bộ du thuyền', 'Yacht Club', 'Câu lạc bộ du thuyền bên bờ biển, quầy bar nhỏ phía dưới.', { l: ['yachtclub'], s: ['beachbar', 'lifeguard'] }],
      ['row', '🏄', 'Phố bãi biển', 'Beach Street', 'Quầy bar, cửa hàng lướt sóng, lưu niệm và chòi cứu hộ.', { s: ['beachbar', 'surfshop', 'souvenir', 'lifeguard'] }],
      ['ring', '🌴', 'Quảng trường biển', 'Beach Plaza', 'Quầy bar và cửa hàng lưu niệm quanh đài phun nước giữa hàng cọ.', { s: ['beachbar', 'souvenir', 'lifeguard', 'surfshop'], c: 'fountain' }]
    ],
    m: [
      ['twin', '⛺', 'Làng nghỉ dưỡng núi', 'Mountain Retreat', 'Khu cắm trại, suối nước nóng và cáp treo hai bên đường mòn.', { a: ['campsite', 'hotspring', 'cablecar', 'campsite'] }],
      ['quad', '🚡', 'Trạm cáp treo', 'Cable Car Station', 'Cáp treo, suối nước nóng và khu cắm trại quanh hòn non bộ.', { a: ['cablecar', 'hotspring', 'campsite', 'hotspring'] }],
      ['big', '🏔️', 'Khách sạn núi', 'Mountain Hotel', 'Khách sạn núi lớn, quanh đó là nhà gỗ và quán cà phê.', { l: ['mounthotel'], s: ['cabin', 'alpinecafe', 'chalet', 'lookout'] }],
      ['big', '⛷️', 'Nhà trượt tuyết', 'Ski Lodge', 'Nhà nghỉ trượt tuyết mái dốc, nhà gỗ nhỏ bên dưới.', { l: ['skilodge'], s: ['cabin', 'chalet', 'lookout'] }],
      ['row', '🛖', 'Dãy nhà gỗ', 'Cabin Row', 'Nhà gỗ, quán cà phê núi, nhà thờ nhỏ và đài ngắm cảnh.', { s: ['cabin', 'alpinecafe', 'chalet', 'lookout', 'chapel'] }],
      ['ring', '🔥', 'Sân lửa trại', 'Campfire Circle', 'Nhà gỗ xếp vòng quanh ngọn đuốc sáng giữa sân.', { s: ['cabin', 'chalet', 'alpinecafe'], c: 'torch' }]
    ],
    a: [
      ['twin', '🌾', 'Sân trang trại', 'Farm Yard', 'Nhà nông, nhà kính, ao cá và nhà trang trại đỏ.', { a: ['farmhouse', 'greenhouse', 'fishpond', 'redfarmhouse'] }],
      ['quad', '🥬', 'Khu trồng trọt', 'Growing Square', 'Nhà kính và ao cá quanh giếng đá giữa trang trại.', { a: ['greenhouse', 'fishpond', 'farmhouse', 'greenhouse'] }],
      ['big', '🐄', 'Chuồng trại lớn', 'Big Barn', 'Một chuồng trại lớn, quanh đó là chuồng gà, cuộn rơm và kho thóc.', { l: ['barn'], s: ['henhouse', 'hayroll', 'silo', 'windpump'] }],
      ['big', '🌾', 'Ruộng lúa mì', 'Wheat Field', 'Cánh đồng lúa mì vàng óng, hàng rào cây hai bên.', { l: ['wheatfield'], s: ['hayroll', 'silo'] }],
      ['big', '🍎', 'Vườn cây ăn quả', 'Orchard', 'Vườn cây ăn quả rộng, quầy bán hàng nhỏ bên đường.', { l: ['orchard'], s: ['hayroll', 'windpump'] }],
      ['big', '🐑', 'Đồng cỏ chăn thả', 'Pasture', 'Đồng cỏ rộng cho gia súc chăn thả.', { l: ['pasture'], s: ['henhouse', 'silo'] }],
      ['big', '🥕', 'Ruộng rau', 'Vegetable Field', 'Ruộng rau xanh tốt và cuộn rơm.', { l: ['vegfield'], s: ['hayroll', 'henhouse'] }],
      ['row', '🐔', 'Dãy chuồng nhỏ', 'Small Barns Row', 'Chuồng gà, cuộn rơm, kho thóc và cối xay nước.', { s: ['henhouse', 'hayroll', 'silo', 'windpump'] }],
      ['ring', '🪣', 'Giếng làng', 'Village Well', 'Chuồng gà và cuộn rơm xếp vòng quanh chiếc giếng đá.', { s: ['henhouse', 'hayroll', 'silo'], c: 'stonewell' }]
    ],
    t: [
      ['twin', '🚁', 'Bãi trực thăng', 'Helipad Row', 'Hai bãi đáp trực thăng đối diện nhau cùng cây xanh.', { a: ['helipad', 'helipad'] }],
      ['big', '🚉', 'Ga tàu hoả', 'Railway Station', 'Nhà ga tàu hoả lớn có đồng hồ, bên dưới là điểm đón taxi.', { l: ['railstation'], s: ['taxistand', 'taxistand'] }],
      ['big', '🚌', 'Bến xe buýt', 'Bus Depot', 'Bến xe buýt rộng, điểm đón taxi và ghế chờ.', { l: ['busdepot'], s: ['taxistand', 'taxistand'] }],
      ['big', '📦', 'Kho hàng vận tải', 'Cargo Depot', 'Kho vận tải lớn cho hàng hoá đi khắp nơi.', { l: ['cargodepot'], s: ['taxistand'] }],
      ['big', '🅿️', 'Bãi đỗ xe', 'Car Park', 'Bãi đỗ xe rộng, vài điểm taxi bên cạnh.', { l: ['parking'], s: ['taxistand', 'taxistand'] }],
      ['big', '✈️', 'Nhà chứa máy bay', 'Aircraft Hangar', 'Nhà chứa máy bay lớn trên đảo sân bay.', { l: ['hangar'], s: ['taxistand'] }],
      ['big', '🛫', 'Nhà ga sân bay', 'Airport Terminal', 'Nhà ga hành khách lớn với kính và mái cong.', { l: ['terminal'] }],
      ['ring', '🗼', 'Vòng xuyến tháp điều khiển', 'Control Tower Circle', 'Tháp điều khiển ở giữa, các điểm taxi xung quanh.', { s: ['taxistand'], c: 'controltower' }]
    ],
    g: [
      ['twin', '🎾', 'Dãy sân tennis', 'Tennis Row', 'Sân tennis, phòng tập, sân trượt ván hai bên lối đi.', { a: ['tenniscourt', 'gym', 'skatepark', 'tenniscourt'] }],
      ['quad', '🏋️', 'Trung tâm thể thao', 'Sports Square', 'Phòng tập, sân tennis, trượt ván và bãi đáp trực thăng.', { a: ['gym', 'tenniscourt', 'skatepark', 'helipad'] }],
      ['big', '⚽', 'Sân bóng đá', 'Football Pitch', 'Sân bóng đá cỏ xanh có khán đài.', { l: ['football'], s: ['sportsshop'] }],
      ['big', '🏀', 'Nhà thi đấu', 'Arena Block', 'Nhà thi đấu lớn, quầy dụng cụ thể thao bên dưới.', { l: ['arena'], s: ['sportsshop'] }],
      ['big', '🏊', 'Hồ bơi', 'Swimming Pool', 'Hồ bơi 3×2 và quầy đồ bơi.', { l: ['pool'], s: ['sportsshop'] }],
      ['big', '🏟️', 'Sân vận động', 'Stadium', 'Sân vận động lớn nhất thành phố.', { l: ['stadium'] }],
      ['big', '🎪', 'Trung tâm triển lãm', 'Expo Centre', 'Nhà triển lãm lớn cho những buổi trình diễn.', { l: ['expohall'], s: ['sportsshop'] }],
      ['big', '⛳', 'Sân golf', 'Golf Course', 'Sân golf lớn giữa thảm cỏ.', { l: ['golf'] }],
      ['row', '👟', 'Phố thể thao', 'Sports Street', 'Dãy cửa hàng đồ thể thao nhộn nhịp.', { s: ['sportsshop'] }]
    ]
  };

  /* ───── bộ dựng bố cục ───── */
  function builder(z, roles) {
    var D = DECO[z] || DECO.r, st = {}, key;
    ['t', 'f', 'b', 'p'].forEach(function (r) { st[r] = (roles[r] && roles[r].length ? roles[r] : D[r]).filter(function (k) { return BY[k]; }); });
    ['a', 'l', 's'].forEach(function (r) { st[r] = (roles[r] || []).filter(function (k) { return BY[k]; }); });
    st.c = BY[roles.c] ? roles.c : BY[D.c] ? D.c : null;
    var cnt = {}; function pick(r) { var l = st[r]; if (!l || !l.length) return null; var i = cnt[r] = (cnt[r] || 0); cnt[r]++; return l[i % l.length]; }
    return { st: st, pick: pick };
  }
  function layout(arch, z, roles, W, H) {
    var b = builder(z, roles), pick = b.pick, st = b.st, items = [], roads = [], used = {};
    var inb = function (x, y) { return x >= 0 && y >= 0 && x < W && y < H; };
    var road = function (x, y) { if (inb(x, y) && !used[y * 99 + x]) { used[y * 99 + x] = 'r'; roads.push([x, y]); } };
    var put = function (k, x, y) { var it = BY[k]; if (!k || !it) return false; if (x < 0 || y < 0 || x + it.w > W || y + it.h > H) return false; var a, c; for (a = 0; a < it.h; a++) for (c = 0; c < it.w; c++) if (used[(y + a) * 99 + x + c]) return false; for (a = 0; a < it.h; a++) for (c = 0; c < it.w; c++) used[(y + a) * 99 + x + c] = 1; items.push([k, x, y]); return true; };
    var deco = function (x, y, seq) { var r = seq || 'tf'; put(pick(r.charAt((x * 3 + y) % r.length)), x, y); };
    var small = function (x, y) { var k = pick('s'); if (k) put(k, x, y); else deco(x, y, 'ftbf'); };
    var i, j, side, k1;
    if (arch === 'twin') {
      for (j = 0; j < H; j++) road(2, j);
      [0, 3].forEach(function (sx) { put(pick('a') || pick('s'), sx, 0); put(pick('a') || pick('s'), sx, 2); put(pick('t'), sx, 4); put(pick('f'), sx + 1, 4); });
      if (!st.a.length) { for (i = 0; i < 5; i++) { small(0, i); small(1, i); small(3, i); small(4, i); } }
    } else if (arch === 'quad') {
      for (j = 0; j < 5; j++) { if (j !== 2) { road(2, j); road(j, 2); } }
      if (st.c) put(st.c, 2, 2);
      [[0, 0], [3, 0], [0, 3], [3, 3]].forEach(function (p) { var k = pick('a'); if (k) put(k, p[0], p[1]); else { small(p[0], p[1]); small(p[0] + 1, p[1]); small(p[0], p[1] + 1); small(p[0] + 1, p[1] + 1); } });
    } else if (arch === 'big') {
      k1 = pick('l') || pick('a'); var it = BY[k1], lw = it ? it.w : 2, lh = it ? it.h : 2;
      if (lw < 5) for (j = 0; j < H; j++) road(lw, j);
      if (lh < 4) for (i = 0; i < lw; i++) road(i, lh);
      put(k1, 0, 0);
      if (lw < 4) for (j = 0; j < H; j++) { deco(lw + 1, j, j % 2 ? 'tf' : 'pb'); }
      for (j = lh + 1; j < H; j++) for (i = 0; i < lw; i++) small(i, j);
      if (lh >= 4 && lw < 4) { /* khối cao: phần dưới đã đầy */ }
      if (lh + 1 >= H) { /* không còn chỗ phía dưới */ }
    } else if (arch === 'row') {
      for (i = 0; i < 5; i++) road(i, 2);
      for (i = 0; i < 5; i++) { small(i, 1); deco(i, 0, i % 2 ? 'ft' : 'tp'); small(i, 3); deco(i, 4, i % 2 ? 'pt' : 'bf'); }
    } else if (arch === 'ring') {
      for (i = 1; i <= 3; i++) for (j = 1; j <= 3; j++) if (!(i === 2 && j === 2)) road(i, j);
      if (st.c) put(st.c, 2, 2);
      for (i = 0; i < 5; i++) for (j = 0; j < 5; j++) { if (i > 0 && i < 4 && j > 0 && j < 4) continue; if ((i === 0 || i === 4) && (j === 0 || j === 4)) deco(i, j, 'tp'); else if ((i + j) % 2) small(i, j); else deco(i, j, 'fbf'); }
    }
    return { items: items, roads: roads };
  }

  /* ───── dựng toàn bộ danh sách mẫu ───── */
  var NEWPLANS = [];
  Object.keys(STY).forEach(function (z) {
    STY[z].forEach(function (s, n) {
      var arch = s[0], lay = layout(arch, z, s[5], 5, 5);
      NEWPLANS.push({ id: 'm-' + z + (n + 1), z: z, w: 5, h: 5, size: 'S', arch: arch, icon: s[1], vi: s[2], en: s[3], desc: s[4], items: lay.items, roads: lay.roads, src: [z, n] });
    });
  });
  // mẫu cỡ L (11×11): ghép 4 mẫu S khác nhau + đường chữ thập — cho khu đất rộng
  var LZ = { a: 1, b: 1, r: 1, g: 1, p: 1 };   // chỉ những khu có khối đất ≥ 11×11
  var LNAMES = { r: ['Khu dân cư hoàn chỉnh', 'Complete Residential Quarter', '🏘️'], a: ['Trang trại hoàn chỉnh', 'Complete Farm', '🚜'], b: ['Khu du lịch biển hoàn chỉnh', 'Complete Beach Resort', '🏖️'], g: ['Khu thể thao hoàn chỉnh', 'Complete Sports Park', '🏟️'], p: ['Công viên hoàn chỉnh', 'Complete Park', '🌳'], f: ['Công viên giải trí hoàn chỉnh', 'Complete Funfair', '🎢'], c: ['Khu thương mại hoàn chỉnh', 'Complete Business Quarter', '🏙️'], s: ['Khu dịch vụ công hoàn chỉnh', 'Complete Civic Quarter', '🏛️'], e: ['Khuôn viên học đường hoàn chỉnh', 'Complete Campus', '🎓'], i: ['Khu công nghiệp hoàn chỉnh', 'Complete Industrial Zone', '🏭'] };
  Object.keys(LZ).forEach(function (z) {
    var S = NEWPLANS.filter(function (p) { return p.z === z; }); if (S.length < 4) return;
    var combos = [[0, 1, 2, 3], [3, 2, 1, 0], [1, 4 % S.length, 0, 2 % S.length]];
    combos.forEach(function (cb, n) {
      var items = [], roads = [], seen = {}, used = {}, origins = [[0, 0], [6, 0], [0, 6], [6, 6]], names = [];
      for (var i = 0; i < 11; i++) { roads.push([5, i]); if (i !== 5) roads.push([i, 5]); }
      cb.forEach(function (ix, q) {
        var P = S[ix % S.length], o = origins[q]; names.push(P.vi);
        P.items.forEach(function (e) { items.push([e[0], e[1] + o[0], e[2] + o[1]]); });
        P.roads.forEach(function (r) { var x = r[0] + o[0], y = r[1] + o[1], key = y * 99 + x; if (!seen[key]) { seen[key] = 1; roads.push([x, y]); } });
      });
      var seenR = {}; roads = roads.filter(function (r) { var k = r[1] * 99 + r[0]; if (seenR[k]) return false; seenR[k] = 1; return true; });
      var nm = LNAMES[z];
      NEWPLANS.push({ id: 'm-' + z + 'L' + (n + 1), z: z, w: 11, h: 11, size: 'L', arch: 'multi', icon: nm[2], vi: nm[0] + ' ' + (n + 1), en: nm[1] + ' ' + (n + 1), desc: 'Cả khu 11×11 ô gồm 4 khối: ' + names.join(' · ') + ', ngăn bởi đường chữ thập.', items: items, roads: roads });
    });
  });

  /* ───── thống kê một mẫu: số món, giá lẻ, cấp cần, chương cần, thuế/giờ… ───── */
  function planInfo(pl) {
    var o = { count: pl.items.length, price: 0, lvl: 1, chs: [], counts: {}, inc: 0, pop: 0, hp: 0, roads: pl.roads.length }, seenCh = {};
    pl.items.forEach(function (e) { var it = BY[e[0]]; if (!it) return; o.price += it.cost; o.lvl = Math.max(o.lvl, it.lvl); o.counts[it.k] = (o.counts[it.k] || 0) + 1; o.inc += C.incomeH(it, 1); o.pop += C.popOf(it, 1); o.hp += C.hpOf(it, 1); if (it.ch && !seenCh[it.ch]) { seenCh[it.ch] = 1; o.chs.push(it.ch); } });
    o.cost = o.price + o.roads * C.RULES.roadCost; return o;
  }
  // mẫu cũ (14 mẫu đầu tiên) cũng có cỡ + loại khu
  C.PLANS.forEach(function (pl) { pl.w = pl.w || 5; pl.h = pl.h || 5; pl.size = pl.size || 'S'; pl.legacy = true; });
  NEWPLANS.forEach(function (pl) { C.PLANS.push(pl); C.PLAN_BY[pl.id] = pl; });
  C.PLAN_ARCH = ARCH; C.PLAN_ZICON = ZICON; C.planInfo = planInfo;
})(typeof window !== 'undefined' ? window : this);
