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
    mstreet: { vi: 'Phố nhỏ (5×3)', desc: 'Một con đường ngắn, hai dãy công trình nhỏ đối diện nhau — gọn, rẻ, hợp khi mới bắt đầu.' },
    mduo: { vi: 'Cặp công trình (5×3)', desc: 'Hai công trình 2×2 đứng cạnh nhau bên một con đường ngắn, ở giữa có cây hoặc hoa.' },
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


  /* ───── thêm nhiều mẫu: nhỏ (5×3), vừa (5×5), lớn (công trình lớn 3×3 trở lên / 11×11) ───── */
  var EXTRA = {
    r: [
      ['mstreet', '🏠', 'Phố nhà nhỏ (mini)', 'Mini Street', 'Hai dãy nhà nhỏ đối diện nhau qua con đường ngắn — rẻ, hợp khi mới bắt đầu.', { s: ['cottage', 'onefloor', 'townhouse'] }],
      ['mstreet', '🛖', 'Dãy nhà gỗ mini', 'Mini Wooden Row', 'Nhà gỗ, nhà sàn và nhà Alps nhỏ xinh.', { s: ['logcabin', 'stilthouse', 'chalet'] }],
      ['mduo', '🏡', 'Cặp biệt thự nhỏ', 'Villa Pair', 'Hai biệt thự đứng cạnh nhau, cây xanh ở giữa.', { a: ['modernvilla', 'frenchvilla'] }],
      ['mduo', '🌊', 'Cặp nhà ven hồ', 'Lakeside Pair', 'Hai ngôi nhà ven hồ yên tĩnh.', { a: ['lakehouse', 'medvilla'], t: ['willow'] }],
      ['twin', '🌻', 'Phố nhà vườn', 'Garden Homes', 'Nhà trang trại, biệt thự và vườn hoa hướng dương.', { a: ['redfarmhouse', 'medvilla', 'redfarmhouse', 'frenchvilla'], t: ['fruit', 'oak'], f: ['sunflower', 'rose'] }],
      ['quad', '🏙️', 'Quảng trường chung cư cao tầng', 'Tall Apartments Square', 'Bốn toà chung cư cao quanh quảng trường.', { a: ['towerblock', 'midrise', 'towerblock', 'midrise'] }],
      ['big', '🌆', 'Tháp kính hiện đại', 'Glass Condo Tower', 'Cao ốc căn hộ kính có bãi đáp trực thăng, quán nhỏ dưới chân.', { l: ['glasscondo'], s: ['minimart', 'flowershop', 'pharmacy', 'noodleshop'] }],
      ['big', '🌿', 'Tháp bậc thang xanh', 'Green Terrace Tower', 'Tháp bậc thang phủ đầy cây xanh.', { l: ['terracetower'], s: ['flowershop', 'minimart', 'cafe'] }],
      ['big', '☁️', 'Toà nhà ở chọc trời', 'Sky Residence', 'Căn hộ cao cấp ở trên mây.', { l: ['skyresi'], s: ['cafe', 'bakery', 'minimart'] }],
      ['big', '🌱', 'Tháp sinh thái', 'Eco Tower', 'Mỗi ban công là một khu vườn nhỏ.', { l: ['ecotower'], s: ['flowershop', 'cafe'] }],
      ['big', '👑', 'Tháp căn hộ hạng sang', 'Luxury Tower', 'Ban công vàng và vương miện trên đỉnh.', { l: ['luxtower'], s: ['cafe', 'bakery'] }],
      ['big', '🌉', 'Chung cư song tháp', 'Twin Apartments', 'Hai tháp nối nhau bằng cầu trên cao.', { l: ['twinapt'], s: ['minimart', 'cafe'] }],
      ['big', '🏘️', 'Dãy nhà liên kế', 'Terraced Row', 'Ba căn liên kế nhiều màu, nhà nhỏ bên dưới.', { l: ['rowhouses'], s: ['cottage', 'townhouse', 'onefloor'] }],
      ['ring', '🌸', 'Làng hoa quanh đài phun', 'Flower Village', 'Những ngôi nhà nhỏ giữa vườn hoa quanh đài phun nước.', { s: ['cottage', 'townhouse', 'japhouse', 'onefloor'], c: 'fountain', f: ['tulip', 'rose', 'hydrangea'] }],
      ['big', '🏰', 'Dinh thự cổ điển', 'Classic Mansion', 'Dinh thự lớn cùng hàng nhà nhỏ phía trước.', { l: ['mansion'], s: ['japhouse', 'chalet', 'logcabin'] }]
    ],
    c: [
      ['mstreet', '☕', 'Phố cà phê nhỏ', 'Mini Cafe Street', 'Cà phê, tiệm bánh và quầy báo hai bên.', { s: ['cafe', 'bakery', 'kiosk'] }],
      ['mstreet', '💊', 'Phố tiện lợi mini', 'Mini Mart Street', 'Cửa hàng tiện lợi, hiệu thuốc, tiệm hoa, quán phở.', { s: ['minimart', 'pharmacy', 'flowershop', 'noodleshop'] }],
      ['mduo', '🏢', 'Cặp văn phòng', 'Office Pair', 'Hai toà văn phòng kính đứng cạnh nhau.', { a: ['office', 'glassoffice'] }],
      ['mduo', '🛒', 'Cặp siêu thị', 'Market Pair', 'Siêu thị và chợ lớn đối diện.', { a: ['supermarket', 'market'] }],
      ['mduo', '🎬', 'Cặp giải trí', 'Fun Pair', 'Rạp phim và sân bowling.', { a: ['cinema2', 'bowling'] }],
      ['big', '🌀', 'Tháp xoắn ốc', 'Spiral Tower', 'Tháp xoắn ốc nổi bật giữa quảng trường.', { l: ['spiraltower'], s: ['cafe', 'bakery', 'kiosk'] }],
      ['big', '🏙️', 'Trụ sở tập đoàn', 'Company HQ', 'Toà trụ sở kính tối có bãi đáp trực thăng.', { l: ['hqtower'], s: ['cafe', 'minimart'] }],
      ['big', '💻', 'Trụ sở công nghệ', 'Tech HQ', 'Toà nhà xanh ngọc có vòng sáng trên đỉnh.', { l: ['techhq'], s: ['cafe', 'bakery'] }],
      ['big', '🏨', 'Khách sạn chọc trời', 'Skyline Hotel', 'Khách sạn cao với hàng trăm phòng.', { l: ['hotelskyline'], s: ['cafe', 'bakery', 'minimart'] }],
      ['big', '🛍️', 'Cửa hàng bách hoá', 'Department Store', 'Bách hoá nhiều tầng, quán nhỏ bên dưới.', { l: ['department'], s: ['boutique', 'cafe', 'bakery'] }],
      ['big', '🎪', 'Trung tâm hội nghị', 'Convention Centre', 'Mái vòm kính cho các buổi triển lãm.', { l: ['conventioncenter'], s: ['cafe', 'minimart'] }],
      ['big', '🌉', 'Văn phòng song tháp', 'Twin Offices', 'Hai tháp văn phòng nối nhau bằng cầu.', { l: ['twinoffice'], s: ['cafe', 'bakery'] }],
      ['big', '🌃', 'Trung tâm tài chính', 'Finance Centre', 'Ba toà tháp cao thấp khác nhau.', { l: ['financecentre'] }],
      ['big', '🌐', 'Trung tâm thương mại thế giới', 'World Trade Centre', 'Hai siêu tháp nối nhau bằng cầu trời.', { l: ['worldtrade'] }],
      ['big', '🗼', 'Tháp kim quan sát', 'Needle Tower', 'Tháp kim có sàn ngắm cảnh hình đĩa.', { l: ['needletower'], s: ['cafe', 'kiosk'] }],
      ['big', '🔺', 'Khách sạn kim tự tháp', 'Pyramid Hotel', 'Ngủ trong kim tự tháp kính.', { l: ['pyramidhotel'], s: ['cafe', 'bakery'] }]
    ],
    s: [
      ['mduo', '🏥', 'Cặp y tế mini', 'Mini Health', 'Phòng khám và nhà văn hoá.', { a: ['clinic', 'commcenter'] }],
      ['mduo', '🚒', 'Cặp cứu hộ', 'Rescue Pair', 'Trạm cứu hoả và đồn cảnh sát.', { a: ['firestation', 'police'] }],
      ['big', '🏥', 'Bệnh viện cao tầng', 'Hospital Tower', 'Bệnh viện cao có bãi đáp trực thăng.', { l: ['hospitaltower'] }],
      ['big', '🏙️', 'Toà thị chính cao tầng', 'City Hall Tower', 'Toà nhà cao có đồng hồ và mái vòm.', { l: ['cityhalltower'] }],
      ['big', '📡', 'Tháp truyền hình', 'TV Tower', 'Tháp truyền hình cao vút.', { l: ['tvtower'] }],
      ['big', '💧', 'Nhà máy nước', 'Water Plant', 'Bể lọc và tháp nước cho cả thành phố.', { l: ['waterplant'] }]
    ],
    p: [
      ['mduo', '🎠', 'Cặp công viên nhỏ', 'Park Pair', 'Sân chơi và khu dã ngoại.', { a: ['playground', 'picnicarea'] }],
      ['mduo', '🐕', 'Cặp thú cưng', 'Pets Pair', 'Công viên chó và vườn thú nhỏ.', { a: ['dogpark', 'petting'] }],
      ['mstreet', '🌷', 'Lối dạo hoa mini', 'Mini Flower Walk', 'Hai hàng hoa và cây quanh lối đi ngắn.', { f: ['tulip', 'rose', 'daisy', 'lavender'], t: ['cherry', 'oak'] }],
      ['big', '🏐', 'Sân bóng đá công viên', 'Park Football', 'Sân bóng cỏ xanh giữa công viên.', { l: ['football'] }]
    ],
    f: [
      ['mduo', '🎳', 'Cặp bowling & karaoke', 'Bowling Pair', 'Hai điểm vui chơi nhộn nhịp.', { a: ['bowling', 'karaoke'] }],
      ['mduo', '🎪', 'Cặp xiếc & xe điện', 'Circus Pair', 'Rạp xiếc và xe điện đụng.', { a: ['circus', 'bumpercars'] }],
      ['mstreet', '🍦', 'Phố kem mini', 'Mini Ice Cream Street', 'Quầy kem và nhà bãi biển sặc sỡ.', { s: ['icecream', 'beachhut'] }],
      ['big', '👻', 'Nhà ma', 'Haunted House Block', 'Ngôi nhà ma rùng rợn.', { l: ['hauntedhouse'] }]
    ],
    e: [
      ['mduo', '🧒', 'Cặp trường nhỏ', 'School Pair', 'Mầm non và trung tâm ngoại ngữ.', { a: ['kindergarten', 'languagecenter'] }],
      ['mduo', '🔬', 'Cặp thí nghiệm', 'Lab Pair', 'Phòng thí nghiệm và phòng công nghệ.', { a: ['lab', 'techlab'] }],
      ['mstreet', '📖', 'Phố sách mini', 'Mini Book Street', 'Hai dãy hiệu sách nhỏ.', { s: ['bookstore'] }],
      ['big', '🏙️', 'Đại học cao tầng', 'University Tower', 'Giảng đường xếp tầng trong toà tháp gạch đỏ.', { l: ['uniskytower'] }],
      ['big', '🔭', 'Tháp nghiên cứu', 'Research Tower', 'Các nhà khoa học làm việc trong tháp kính.', { l: ['researchtower'] }]
    ],
    i: [
      ['mduo', '🏭', 'Cặp kho hàng', 'Warehouse Pair', 'Kho hàng và trạm tái chế.', { a: ['warehouse', 'recyclecenter'] }],
      ['mduo', '⚙️', 'Cặp xưởng tái chế', 'Recycling Pair', 'Tái chế và trung tâm dữ liệu.', { a: ['recycling', 'datacenter'] }],
      ['mstreet', '🔧', 'Xưởng nhỏ mini', 'Mini Workshops', 'Tháp nước và xưởng nhỏ.', { s: ['watertower'] }],
      ['big', '🧵', 'Nhà máy dệt', 'Textile Mill', 'Máy dệt chạy suốt ngày.', { l: ['textilemill'] }],
      ['big', '🍹', 'Nhà máy nước giải khát', 'Brewery', 'Các bồn lớn làm đồ uống có ga.', { l: ['brewery'] }],
      ['big', '🧱', 'Nhà máy xi măng', 'Cement Plant', 'Xi măng cho đường và nhà cao tầng.', { l: ['cementplant'] }],
      ['big', '🛢️', 'Nhà máy lọc dầu', 'Oil Refinery', 'Tháp cao và ngọn lửa trên đỉnh.', { l: ['refinery'] }],
      ['big', '♨️', 'Tháp làm mát', 'Cooling Towers', 'Hai tháp làm mát khổng lồ nhả hơi trắng.', { l: ['coolingtowers'] }],
      ['big', '🏗️', 'Nhà máy nhiều tầng', 'Multi-storey Factory', 'Nhà máy cao với bồn và ống khói.', { l: ['skyfactory'] }],
      ['big', '☀️', 'Trang trại điện mặt trời', 'Solar Farm', 'Hàng tấm pin đón nắng.', { l: ['solarfarm'] }],
      ['big', '🌬️', 'Cánh đồng điện gió', 'Wind Farm', 'Các cánh quạt khổng lồ quay trong gió.', { l: ['windturbines'] }],
      ['quad', '🏙️', 'Khu công nghiệp cao', 'Tall Industry Square', 'Silo, tháp hoá chất và trung tâm dữ liệu.', { a: ['silotower', 'chemtower', 'datacenter', 'silotower'] }]
    ],
    h: [
      ['mduo', '⚓', 'Cặp kho cảng', 'Dock Pair', 'Kho hàng và bãi container.', { a: ['warehouse', 'containers'] }],
      ['mduo', '🏗️', 'Cặp cần cẩu', 'Crane Pair', 'Cần cẩu và container.', { a: ['crane', 'containers'] }],
      ['mstreet', '🐟', 'Hải đăng mini', 'Mini Lighthouses', 'Các ngọn hải đăng nhỏ bên bến.', { s: ['lighthouse'] }]
    ],
    w: [
      ['mduo', '🏯', 'Cặp chùa & cối xay', 'Pagoda & Windmill', 'Hai công trình nổi tiếng đứng cạnh nhau.', { a: ['pagoda', 'windmill'] }],
      ['mstreet', '🍣', 'Phố sushi mini', 'Mini Sushi Street', 'Sushi, pizza, quán trà hai bên.', { s: ['sushi', 'pizzeria', 'teahouse'] }],
      ['big', '🗿', 'Vòng đá cổ', 'Stone Circle', 'Những phiến đá lớn xếp thành vòng.', { l: ['stonehenge'] }],
      ['big', '🦁', 'Tượng nhân sư', 'Sphinx Block', 'Sư tử mặt người nhìn xa xăm.', { l: ['sphinx'] }],
      ['big', '🗿', 'Tượng Moai', 'Moai Block', 'Hai tượng đầu đá khổng lồ.', { l: ['moai'] }],
      ['big', '🗼', 'Tháp Sky Pod', 'Sky Pod Block', 'Tháp cao có nhà hàng trên trời.', { l: ['skypod'] }]
    ],
    b: [
      ['mstreet', '🏖️', 'Quầy biển mini', 'Mini Beach Stalls', 'Quầy bar, lướt sóng và lưu niệm.', { s: ['beachbar', 'surfshop', 'souvenir'] }],
      ['mduo', '🦞', 'Cặp nhà hàng biển', 'Seafood Pair', 'Nhà hàng hải sản và spa.', { a: ['seafood', 'spa'] }],
      ['mduo', '🏝️', 'Cặp biệt thự biển', 'Beach Villa Pair', 'Hai biệt thự sát bờ biển.', { a: ['beachvilla', 'beachhouse'] }],
      ['big', '🏨', 'Khách sạn nghỉ dưỡng lớn', 'Grand Resort Hotel', 'Khu nghỉ dưỡng lớn có hồ bơi.', { l: ['grandresort'] }]
    ],
    m: [
      ['mstreet', '🛖', 'Dãy nhà gỗ mini', 'Mini Cabins', 'Nhà gỗ, nhà Alps và quán cà phê núi.', { s: ['cabin', 'chalet', 'alpinecafe'] }],
      ['mduo', '♨️', 'Cặp trại & suối nước nóng', 'Camp & Spa', 'Khu cắm trại và suối nước nóng.', { a: ['campsite', 'hotspring'] }],
      ['mduo', '🚡', 'Cáp treo đôi', 'Cable Duo', 'Hai trạm cáp treo.', { a: ['cablecar', 'cablecar'] }]
    ],
    a: [
      ['mstreet', '🐔', 'Chuồng gà mini', 'Mini Henhouses', 'Chuồng gà, cuộn rơm và kho thóc.', { s: ['henhouse', 'hayroll', 'silo'] }],
      ['mduo', '🏠', 'Cặp nhà nông', 'Farm Pair', 'Hai ngôi nhà trang trại.', { a: ['farmhouse', 'redfarmhouse'] }],
      ['mduo', '🌱', 'Cặp nhà kính & ao cá', 'Greenhouse Pair', 'Nhà kính trồng rau và ao cá.', { a: ['greenhouse', 'fishpond'] }],
      ['big', '☀️', 'Điện mặt trời nông trại', 'Farm Solar', 'Tấm pin trên đồng.', { l: ['solarfarm'] }],
      ['big', '🌬️', 'Điện gió nông trại', 'Farm Wind', 'Tua-bin gió trên cánh đồng.', { l: ['windturbines'] }]
    ],
    t: [
      ['mstreet', '🚕', 'Điểm taxi mini', 'Mini Taxi Rank', 'Hai hàng điểm đón taxi.', { s: ['taxistand'] }],
      ['mduo', '🚀', 'Bệ phóng tên lửa', 'Rocket Pad', 'Tháp phóng tên lửa và bãi trực thăng.', { a: ['rocketlab', 'helipad'] }]
    ],
    g: [
      ['mduo', '🎾', 'Cặp sân tennis', 'Tennis Pair', 'Hai sân tennis.', { a: ['tenniscourt', 'tenniscourt'] }],
      ['mduo', '🏋️', 'Cặp phòng tập', 'Gym Pair', 'Phòng tập và sân trượt ván.', { a: ['gym', 'skatepark'] }],
      ['mduo', '🚁', 'Bãi trực thăng thể thao', 'Sports Helipad', 'Phòng tập và bãi đáp trực thăng.', { a: ['helipad', 'gym'] }],
      ['mstreet', '👟', 'Phố thể thao mini', 'Mini Sports Street', 'Hai dãy cửa hàng đồ thể thao.', { s: ['sportsshop'] }]
    ]
  };
  Object.keys(EXTRA).forEach(function (z) { STY[z] = (STY[z] || []).concat(EXTRA[z]); });

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
      for (j = lh + 1; j < H; j++) { if (j !== lh + 1 && j !== H - 1) continue; for (i = 0; i < lw; i++) small(i, j); }   // chỉ hàng sát đường ngang hoặc sát rìa khối mới giáp đường
      if (lh >= 4 && lw < 4) { /* khối cao: phần dưới đã đầy */ }
      if (lh + 1 >= H) { /* không còn chỗ phía dưới */ }
    } else if (arch === 'row') {
      for (i = 0; i < 5; i++) road(i, 2);
      for (i = 0; i < 5; i++) { small(i, 1); deco(i, 0, i % 2 ? 'ft' : 'tp'); small(i, 3); deco(i, 4, i % 2 ? 'pt' : 'bf'); }
    } else if (arch === 'mstreet') {
      for (i = 0; i < 5; i++) road(i, 1);
      for (i = 0; i < 5; i++) { small(i, 0); small(i, 2); }
    } else if (arch === 'mduo') {
      for (i = 0; i < 5; i++) road(i, 2);
      [0, 3].forEach(function (sx) { var k = pick('a'); if (k) put(k, sx, 0); else { small(sx, 0); small(sx + 1, 0); small(sx, 1); small(sx + 1, 1); } });
      put(pick('f') || pick('t'), 2, 1);
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
      var arch = s[0], ph = (arch === 'mstreet' || arch === 'mduo') ? 3 : 5, lay = layout(arch, z, s[5], 5, ph);
      NEWPLANS.push({ id: 'm-' + z + (n + 1), z: z, w: 5, h: ph, size: ph === 3 ? 'S' : 'M', arch: arch, icon: s[1], vi: s[2], en: s[3], desc: s[4], items: lay.items, roads: lay.roads, src: [z, n] });
    });
  });
  // mẫu cỡ L (11×11): ghép 4 mẫu S khác nhau + đường chữ thập — cho khu đất rộng
  var LZ = { a: 1, b: 1, r: 1, g: 1, p: 1 };   // chỉ những khu có khối đất ≥ 11×11
  var LNAMES = { r: ['Khu dân cư hoàn chỉnh', 'Complete Residential Quarter', '🏘️'], a: ['Trang trại hoàn chỉnh', 'Complete Farm', '🚜'], b: ['Khu du lịch biển hoàn chỉnh', 'Complete Beach Resort', '🏖️'], g: ['Khu thể thao hoàn chỉnh', 'Complete Sports Park', '🏟️'], p: ['Công viên hoàn chỉnh', 'Complete Park', '🌳'], f: ['Công viên giải trí hoàn chỉnh', 'Complete Funfair', '🎢'], c: ['Khu thương mại hoàn chỉnh', 'Complete Business Quarter', '🏙️'], s: ['Khu dịch vụ công hoàn chỉnh', 'Complete Civic Quarter', '🏛️'], e: ['Khuôn viên học đường hoàn chỉnh', 'Complete Campus', '🎓'], i: ['Khu công nghiệp hoàn chỉnh', 'Complete Industrial Zone', '🏭'] };
  Object.keys(LZ).forEach(function (z) {
    var S = NEWPLANS.filter(function (p) { return p.z === z && p.h === 5 && p.arch !== 'big'; }); if (S.length < 4) return;
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
  // phân cấp: S nhỏ (5×3) · M vừa (5×5) · L lớn (cả khu 11×11, hoặc có công trình lớn từ 3×3)
  function tierOf(pl) { if (pl.h <= 3) return 'S'; if (pl.w >= 11) return 'L'; var big = 0; pl.items.forEach(function (e) { var it = BY[e[0]]; if (it && it.w * it.h >= 9) big = 1; }); return big ? 'L' : 'M'; }
  // mẫu cũ (14 mẫu đầu tiên) cũng có cỡ + loại khu
  C.PLANS.forEach(function (pl) { pl.w = pl.w || 5; pl.h = pl.h || 5; pl.size = pl.size || 'S'; pl.legacy = true; });
  NEWPLANS.forEach(function (pl) { C.PLANS.push(pl); C.PLAN_BY[pl.id] = pl; });
  C.PLANS.forEach(function (pl) { pl.tier = tierOf(pl); pl.dim = pl.w + '×' + pl.h; });
  C.PLAN_ARCH = ARCH; C.PLAN_ZICON = ZICON; C.planInfo = planInfo;

  /* ───────────── QUY HOẠCH KHU VỰC & THỊ TRẤN ─────────────
     Một "quy hoạch khu vực" phủ cùng lúc NHIỀU khối đất của một quận (¼ khu, nửa khu hoặc cả thị trấn). Mỗi khối được gán một mẫu khối (5×5 / 11×11…)
     theo loại khu của khối đó (nhà ở, thương mại, công viên…) và theo chủ đề của quy hoạch. Giá = tổng giá các món + đường (cao hơn nhiều so với mẫu khối nhỏ). */
  var REG = {
    0: [   // Sunny Homes
      ['green', '🌳', 'Thị trấn xanh', 'Green Town', 'Nhà ở xen công viên, phố nhỏ, dịch vụ đầy đủ — thị trấn yên bình nhiều cây xanh.', { r: { arch: ['twin', 'ring', 'row'], tier: ['M'] }, p: { tier: ['M'] }, c: { arch: ['row', 'ring'] }, s: { tier: ['M'] } }],
      ['luxury', '👑', 'Khu dân cư cao cấp', 'Luxury Residences', 'Biệt thự, dinh thự và tháp ở sang trọng cùng công viên và dịch vụ cao cấp.', { r: { has: ['modernvilla', 'frenchvilla', 'medvilla', 'mansion', 'lakehouse', 'luxtower', 'glasscondo'] }, p: { has: ['botanical', 'zoo', 'football', 'golf'] }, c: { has: ['boutique', 'department', 'mall', 'bankhq'] }, s: { has: ['hospital', 'cityhall', 'hospitaltower'] } }],
      ['cozy', '🏘️', 'Làng nhà nhỏ', 'Cosy Village', 'Những ngôi nhà nhỏ xinh xếp thành phố ngắn, quán cà phê và công viên gia đình.', { r: { has: ['cottage', 'townhouse', 'japhouse', 'logcabin', 'onefloor'], arch: ['row', 'ring', 'mstreet'] }, p: { arch: ['twin', 'ring'] }, c: { has: ['cafe', 'bakery', 'noodleshop', 'minimart'] }, s: { tier: ['M'] } }],
      ['sky', '🏙️', 'Khu cao tầng', 'High-rise District', 'Chung cư cao tầng, tháp văn phòng và bệnh viện cao giữa công viên.', { r: { has: ['towerblock', 'midrise', 'lowrise', 'glasscondo', 'ecotower', 'terracetower', 'skyresi'] }, p: { tier: ['M'] }, c: { has: ['skyoffice', 'hqtower', 'techhq', 'twinoffice', 'skyscraper'] }, s: { has: ['hospitaltower', 'cityhalltower', 'tvtower'] } }]
    ],
    1: [   // Downtown
      ['shop', '🛍️', 'Phố mua sắm sầm uất', 'Shopping Heart', 'Siêu thị, chợ đêm, trung tâm thương mại và cà phê ở khắp ngã tư.', { c: { has: ['supermarket', 'market', 'nightmarket', 'mall', 'department', 'boutique', 'cinema2'] }, p: { tier: ['M'] }, s: { tier: ['M'] } }],
      ['finance', '🏦', 'Khu văn phòng & tài chính', 'Business & Finance', 'Văn phòng kính, ngân hàng, khu khởi nghiệp và trung tâm tài chính.', { c: { has: ['office', 'glassoffice', 'bankhq', 'coworking', 'financecentre', 'twinoffice', 'bankskyscraper'] }, p: { tier: ['M'] }, s: { has: ['metroentry', 'cityhall', 'cityhalltower'] } }],
      ['skyline', '🌆', 'Đường chân trời', 'Skyline District', 'Dãy tháp chọc trời: xoắn ốc, trụ sở tập đoàn, tháp kim — đèn laser sáng rực về đêm.', { c: { has: ['skyscraper', 'skyoffice', 'spiraltower', 'hqtower', 'worldtrade', 'needletower', 'techhq', 'hotelskyline'] }, p: { tier: ['M'] }, s: { has: ['tvtower', 'hospitaltower'] } }],
      ['food', '🍜', 'Downtown xanh & ẩm thực', 'Green Food Downtown', 'Phố ẩm thực, quán cà phê, công viên nhỏ giữa trung tâm.', { c: { arch: ['row', 'ring', 'mstreet'], has: ['noodleshop', 'cafe', 'bakery', 'kiosk', 'flowershop'] }, p: { arch: ['ring', 'twin'] }, s: { tier: ['M'] } }]
    ],
    2: [   // Harbor & Industry
      ['port', '🚢', 'Cảng container', 'Container Port', 'Cần cẩu, bãi container, kho hàng và xưởng đóng tàu.', { h: { has: ['crane', 'containers', 'warehouse', 'shipyard'] }, i: { has: ['warehouse', 'recyclecenter', 'recycling'] }, s: { tier: ['M'] } }],
      ['heavy', '🏭', 'Khu công nghiệp nặng', 'Heavy Industry', 'Nhà máy điện, lọc dầu, xi măng, tháp làm mát — khói trắng cuồn cuộn.', { i: { has: ['factory', 'powerplant', 'refinery', 'cementplant', 'coolingtowers', 'textilemill', 'brewery'] }, h: { tier: ['M'] }, s: { tier: ['M'] } }],
      ['green', '🌿', 'Công nghiệp xanh', 'Green Industry', 'Điện mặt trời, điện gió, nhà máy nước và trạm tái chế.', { i: { has: ['solarfarm', 'windturbines', 'waterplant', 'recycling', 'recyclecenter', 'datacenter'] }, h: { tier: ['M'] }, s: { has: ['waterplant', 'recyclecenter'] } }],
      ['tall', '🏗️', 'Cảng & nhà máy cao tầng', 'Tall Industry', 'Nhà máy nhiều tầng, ống khói cao, silo và tháp hoá chất.', { i: { has: ['skyfactory', 'smokestackfactory', 'silotower', 'chemtower'] }, h: { has: ['crane', 'containers'] }, s: { tier: ['M'] } }]
    ],
    3: [   // Fun Bay
      ['funfair', '🎡', 'Thành phố giải trí', 'Funfair City', 'Vòng quay, tàu cướp biển, rạp xiếc, nhà ma — vui cả ngày.', { f: { has: ['ferris', 'pirateship', 'circus', 'carousel', 'bumpercars', 'hauntedhouse'] }, p: { tier: ['M'] }, s: { tier: ['M'] } }],
      ['water', '💦', 'Công viên nước & thuỷ cung', 'Water Fun', 'Công viên nước, thuỷ cung, quầy kem.', { f: { has: ['waterpark', 'aquarium', 'icecream', 'beachhut'] }, p: { has: ['pondpark', 'botanical'] }, s: { tier: ['M'] } }],
      ['family', '🎈', 'Phố vui chơi gia đình', 'Family Fun', 'Bowling, karaoke, phố kem và sân chơi cho cả nhà.', { f: { has: ['bowling', 'karaoke', 'icecream', 'minigolf', 'cinema'], arch: ['twin', 'quad', 'row', 'mduo'] }, p: { has: ['playground', 'picnicarea', 'dogpark'] }, s: { tier: ['M'] } }]
    ],
    4: [   // Campus
      ['uni', '🎓', 'Khuôn viên đại học', 'University Campus', 'Đại học, bảo tàng, ký túc xá và thư viện giữa vườn cây.', { e: { has: ['university', 'museum', 'dorm', 'artgallery', 'uniskytower'] }, p: { tier: ['M'] }, s: { has: ['library', 'school'] } }],
      ['science', '🔬', 'Khoa học & công nghệ', 'Science & Tech', 'Cung thiên văn, đài quan sát, phòng thí nghiệm, tháp nghiên cứu.', { e: { has: ['planetarium', 'observatory', 'lab', 'techlab', 'researchtower'] }, p: { tier: ['M'] }, s: { tier: ['M'] } }],
      ['kids', '🧒', 'Học đường xanh', 'Green Schools', 'Mầm non, trung tâm ngoại ngữ, phố sách và công viên.', { e: { has: ['kindergarten', 'languagecenter', 'bookstore', 'artschool'] }, p: { has: ['playground', 'picnicarea', 'dogpark'] }, s: { has: ['school', 'library', 'commcenter'] } }]
    ],
    5: [   // World Street
      ['wonders', '🗽', 'Kỳ quan thế giới', 'World Wonders', 'Lâu đài, đấu trường La Mã, kim tự tháp, nhân sư, tháp sắt.', { w: { has: ['castle', 'colosseum', 'pyramid', 'sphinx', 'irontower', 'greektemple', 'skypod'] }, p: { tier: ['M'] }, s: { tier: ['M'] } }],
      ['food', '🍣', 'Phố ẩm thực quốc tế', 'World Food', 'Sushi, pizza, quán trà và cổng torii nối nhau thành các con phố đẹp.', { w: { has: ['sushi', 'pizzeria', 'teahouse', 'torii'] }, p: { has: ['bandstand', 'petting', 'pondpark'] }, s: { tier: ['M'] } }],
      ['ancient', '🏯', 'Kiến trúc cổ', 'Old Architecture', 'Chùa, cối xay, đền Hy Lạp, vòng đá cổ và tượng Moai.', { w: { has: ['pagoda', 'windmill', 'greektemple', 'stonehenge', 'moai'] }, p: { tier: ['M'] }, s: { tier: ['M'] } }]
    ],
    6: [   // Golden Beach
      ['resort', '🏖️', 'Khu nghỉ dưỡng biển', 'Beach Resort Town', 'Resort lớn, biệt thự biển, spa và phố bãi biển sát vịnh.', { b: { tier: ['L'] }, r: { tier: ['L'] } }],
      ['fish', '🦞', 'Làng chài du lịch', 'Seaside Village', 'Phố hải sản, quầy bar, nhà biển nhỏ xinh.', { b: { tier: ['M'] }, r: { tier: ['M'] } }]
    ],
    7: [   // Cloudy Mountain
      ['alpine', '🏔️', 'Làng núi nghỉ dưỡng', 'Alpine Village', 'Nhà gỗ, khách sạn núi, cáp treo và suối nước nóng.', { m: { tier: ['M', 'L'] }, p: { tier: ['M'] } }]
    ],
    8: [   // Green Fields
      ['farm', '🌾', 'Làng nông trại', 'Farm Town', 'Chuồng trại lớn, ruộng lúa, vườn cây ăn quả và nhà nông.', { a: { tier: ['L'] }, r: { tier: ['L', 'M'] }, p: { tier: ['M'] } }],
      ['green', '☀️', 'Nông trại xanh', 'Green Farm', 'Nhà kính, điện mặt trời, đồng cỏ chăn thả.', { a: { has: ['greenhouse', 'solarfarm', 'windturbines', 'pasture', 'fishpond'] }, r: { tier: ['M'] }, p: { tier: ['M'] } }]
    ],
    9: [   // Airport Island
      ['air', '✈️', 'Sân bay & bến xe', 'Airport & Transit', 'Nhà ga sân bay, nhà chứa máy bay, ga tàu, bến xe buýt.', { t: { tier: ['L', 'M'] }, g: { tier: ['M'] } }]
    ],
    10: [   // Grand Park
      ['park', '🌳', 'Công viên Hồ Lớn hoàn chỉnh', 'Grand Park Complete', 'Vườn thú, vườn bách thảo, sân golf và sân bóng quanh hồ lớn.', { p: { tier: ['L', 'M'] } }]
    ],
    11: [  // Sports & Expo
      ['sports', '🏟️', 'Thành phố thể thao', 'Sports City', 'Sân vận động, nhà thi đấu, hồ bơi và trung tâm triển lãm.', { g: { tier: ['L'] }, p: { tier: ['M'] } }]
    ]
  };
  var SCOPES = { all: ['Cả khu / thị trấn', 'Whole Town', '🏙️'], half: ['Nửa khu', 'Half District', '🏘️'], quarter: ['Một góc phố', 'Quarter', '🏠'] };
  function blockGridOf(d) {
    var l = C.BLOCKS.filter(function (b) { return b.d === d; }), xs = [], ys = [];
    l.forEach(function (b) { if (xs.indexOf(b.x) < 0) xs.push(b.x); if (ys.indexOf(b.y) < 0) ys.push(b.y); }); xs.sort(function (a, b) { return a - b; }); ys.sort(function (a, b) { return a - b; });
    var g = ys.map(function () { return xs.map(function () { return null; }); }); l.forEach(function (b) { g[ys.indexOf(b.y)][xs.indexOf(b.x)] = b; });
    return { cols: xs.length, rows: ys.length, g: g };
  }
  var GRID = {}; C.DISTRICTS.forEach(function (d) { GRID[d.id] = blockGridOf(d.id); });
  var REGIONS = [];
  Object.keys(REG).forEach(function (dk) {
    var d = +dk, gr = GRID[d], nb = gr.cols * gr.rows;
    REG[dk].forEach(function (t) {
      ['all', 'half', 'quarter'].forEach(function (sc) {
        if (sc === 'quarter' && nb < 12) return; if (sc === 'half' && nb < 4) return;
        REGIONS.push({ id: 'g-' + d + '-' + t[0] + '-' + sc, kind: 'region', d: d, theme: t[0], scope: sc, icon: t[1], vi: t[2] + ' — ' + SCOPES[sc][0], en: t[3] + ' — ' + SCOPES[sc][1], desc: t[4], sel: t[5], z: 'R', tier: sc === 'all' ? 'T' : sc === 'half' ? 'H' : 'Q' });
      });
    });
  });
  // các hình chữ nhật khối (i0, j0, ci, cj) có thể dùng cho một quy hoạch khu vực
  function regionRects(rg) {
    var gr = GRID[rg.d], C0 = gr.cols, R0 = gr.rows, out = [];
    if (rg.scope === 'all') out.push({ i0: 0, j0: 0, ci: C0, cj: R0 });
    else if (rg.scope === 'half') { var hr = Math.ceil(R0 / 2), hc = Math.ceil(C0 / 2); out.push({ i0: 0, j0: 0, ci: C0, cj: hr }, { i0: 0, j0: R0 - hr, ci: C0, cj: hr }, { i0: 0, j0: 0, ci: hc, cj: R0 }, { i0: C0 - hc, j0: 0, ci: hc, cj: R0 }); }
    else { var qc = Math.ceil(C0 / 2), qr = Math.ceil(R0 / 2); out.push({ i0: 0, j0: 0, ci: qc, cj: qr }, { i0: C0 - qc, j0: 0, ci: qc, cj: qr }, { i0: 0, j0: R0 - qr, ci: qc, cj: qr }, { i0: C0 - qc, j0: R0 - qr, ci: qc, cj: qr }); }
    return out;
  }
  function matchSel(p, sel) {
    if (!sel) return true; if (sel.tier && sel.tier.indexOf(p.tier) < 0) return false; if (sel.arch && sel.arch.indexOf(p.arch) < 0) return false;
    if (sel.has) { var ok = false; p.items.forEach(function (e) { if (sel.has.indexOf(e[0]) >= 0) ok = true; }); if (!ok) return false; } return true;
  }
  // danh sách đặt mẫu cho một quy hoạch khu vực trong hình chữ nhật khối rc → [{ plan, bx, by }]
  function regionPlacements(rg, rc) {
    var gr = GRID[rg.d], out = [], n = 0;
    for (var j = rc.j0; j < rc.j0 + rc.cj; j++) for (var i = rc.i0; i < rc.i0 + rc.ci; i++) {
      var b = gr.g[j] && gr.g[j][i]; if (!b) continue;
      var sel = rg.sel[b.z]; var pool = C.PLANS.filter(function (p) { return p.z === b.z && p.id.charAt(0) === 'm' && p.w <= b.w && p.h <= b.h; });
      var cand = pool.filter(function (p) { return matchSel(p, sel); }); if (!cand.length) cand = pool.filter(function (p) { return p.tier === 'M'; }); if (!cand.length) cand = pool; if (!cand.length) continue;
      cand.sort(function (a, b2) { return a.id < b2.id ? -1 : 1; });
      var m = 0;
      for (var ay = b.y; ay + 4 <= b.y + b.h - 1 || (m === 0 && ay === b.y); ay += 6) for (var ax = b.x; ax + 4 <= b.x + b.w - 1 || (m === 0 && ax === b.x); ax += 6) {
        var plan = cand[(n + m) % cand.length]; if (ax + plan.w > b.x + b.w || ay + plan.h > b.y + b.h) { plan = cand.filter(function (p) { return ax + p.w <= b.x + b.w && ay + p.h <= b.y + b.h; })[0]; if (!plan) continue; }
        out.push({ plan: plan, bx: ax, by: ay, d: b.d }); m++; n++;
      }
    }
    return out;
  }
  C.REGIONS = REGIONS; C.REGION_BY = {}; REGIONS.forEach(function (r) { C.REGION_BY[r.id] = r; });
  C.regionRects = regionRects; C.regionPlacements = regionPlacements; C.REGION_SCOPES = SCOPES; C.blockGrid = GRID;
  // thống kê chung (không cần đất thật): số khối, số món, giá
  C.regionInfo = function (rg, rc) {
    var pl = regionPlacements(rg, rc || regionRects(rg)[0]), o = { blocks: pl.length, count: 0, price: 0, roads: 0, lvl: 1, counts: {}, inc: 0, pop: 0, hp: 0 };
    pl.forEach(function (x) { var inf = planInfo(x.plan); o.count += inf.count; o.price += inf.price; o.roads += inf.roads; o.lvl = Math.max(o.lvl, inf.lvl); o.inc += inf.inc; o.pop += inf.pop; o.hp += inf.hp; Object.keys(inf.counts).forEach(function (k) { o.counts[k] = (o.counts[k] || 0) + inf.counts[k]; }); });
    o.cost = o.price + o.roads * C.RULES.roadCost; return o;
  };

})(typeof window !== 'undefined' ? window : this);
