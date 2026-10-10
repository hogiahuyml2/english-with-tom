/* 💡 EWT City — GỢI Ý XÂY DỰNG: phân tích từng quận xem còn thiếu loại công trình nào, rồi đưa ra lời khuyên cụ thể.
   Thuần dữ liệu (không vẽ): city.html gọi EWTCityAdvice.analyze(C, S, role) rồi tự hiển thị. */
(function (root) {
  'use strict';
  var DECOR = { tree: 1, flower: 1, orna: 1, bench: 1, lamp: 1, event: 1 };
  // slot: id, ic, t (tên thứ còn thiếu), why (vì sao), ks (món cụ thể) / cats (cả nhóm) / re (regex theo mã), need (số cố định hoặc {per, of}),
  //       from (chỉ nhắc khi quận đã có ≥ from công trình chính), pri (1 cần gấp · 2 nên có · 3 cho đẹp), variety (cần ≥ N loại khác nhau)
  var R = {
    0: [
      { id: 'home', ic: '🏠', t: 'nhiều kiểu nhà ở', why: 'Nhiều loại nhà (nhà phố, biệt thự, chung cư…) giúp dân cư đông hơn và khu phố đẹp, không đơn điệu.', cats: ['home'], variety: 5, pri: 2 },
      { id: 'school', ic: '🏫', t: 'trường học', why: 'Có trường gần nhà thì dân cư vui hơn và nộp nhiều thuế hơn.', ks: ['school', 'kindergarten', 'library'], need: { per: 12, of: 'home' }, from: 3, pri: 1 },
      { id: 'clinic', ic: '🏥', t: 'phòng khám / bệnh viện', why: 'Dân cư cần chăm sóc sức khoẻ — điểm hạnh phúc tăng đáng kể.', ks: ['clinic', 'hospital', 'pharmacy'], need: { per: 14, of: 'home' }, from: 3, pri: 1 },
      { id: 'safe', ic: '🚒', t: 'cứu hoả / công an', why: 'Khu đông dân cần trạm cứu hoả và đồn công an để an toàn.', ks: ['firestation', 'police'], need: 2, from: 8, pri: 1 },
      { id: 'park', ic: '🛝', t: 'sân chơi / công viên nhỏ', why: 'Trẻ em và người lớn cần chỗ vui chơi gần nhà.', ks: ['playground', 'pondpark', 'dogpark', 'picnicarea', 'court'], need: { per: 12, of: 'home' }, from: 3, pri: 2 },
      { id: 'shop', ic: '🛒', t: 'cửa hàng tiện lợi', why: 'Cửa hàng nhỏ, tiệm bánh, quán cà phê giúp khu dân cư sống động và có thêm thuế.', ks: ['kiosk', 'minimart', 'bakery', 'cafe', 'market', 'flowershop'], need: { per: 8, of: 'home' }, from: 3, pri: 2 },
      { id: 'green', ic: '🌳', t: 'cây xanh & hoa', why: 'Cây và hoa làm không khí trong lành, khu phố đẹp hơn.', cats: ['tree', 'flower'], need: { per: 2, of: 'home' }, from: 4, pri: 2 },
      { id: 'bus', ic: '🚏', t: 'trạm xe buýt', why: 'Dân cư cần đi lại thuận tiện.', ks: ['busstop'], need: { per: 20, of: 'home' }, from: 5, pri: 3 },
      { id: 'lamp', ic: '💡', t: 'đèn đường', why: 'Đèn làm phố sáng đẹp về đêm.', cats: ['lamp'], need: { per: 8, of: 'core' }, from: 4, pri: 3 }
    ],
    1: [
      { id: 'biz', ic: '🏢', t: 'văn phòng & ngân hàng', why: 'Trung tâm cần nơi làm việc — nguồn thuế lớn nhất của thành phố.', ks: ['office', 'bank', 'skyscraper'], need: { per: 8, of: 'core' }, pri: 1 },
      { id: 'shopv', ic: '🛍️', t: 'nhiều loại cửa hàng', why: 'Đa dạng cửa hàng thu hút khách và tăng thuế.', cats: ['shop'], variety: 6, pri: 2 },
      { id: 'mall', ic: '🏬', t: 'khách sạn / trung tâm thương mại', why: 'Điểm nhấn thu hút nhiều khách đến Downtown.', ks: ['hotel', 'mall'], need: 1, pri: 2 },
      { id: 'safe', ic: '🚓', t: 'công an / cứu hoả', why: 'Khu đông đúc cần được bảo vệ.', ks: ['police', 'firestation'], need: 1, from: 6, pri: 1 },
      { id: 'tran', ic: '🚇', t: 'giao thông (buýt, taxi, tàu điện, bãi đỗ xe)', why: 'Khách và nhân viên cần chỗ đi lại, đỗ xe.', ks: ['busstop', 'taxistand', 'parking', 'metroentry'], need: { per: 10, of: 'core' }, from: 4, pri: 2 },
      { id: 'tower', ic: '🌆', t: 'toà nhà cao tầng', why: 'Toà cao tầng tạo đường chân trời đẹp (và còn chiếu đèn laser ban đêm!).', re: 'tower|skyscraper|plaza', need: 1, from: 6, pri: 3 },
      { id: 'green', ic: '🌳', t: 'cây xanh & hoa', why: 'Một chút cây xanh giữa phố cao tầng giúp dân vui hơn.', cats: ['tree', 'flower', 'park'], need: { per: 8, of: 'core' }, from: 4, pri: 2 },
      { id: 'bench', ic: '🪑', t: 'ghế & tiện ích đường phố', why: 'Ghế, thùng rác, hộp thư làm phố tiện nghi.', cats: ['bench'], need: { per: 10, of: 'core' }, from: 4, pri: 3 },
      { id: 'lamp', ic: '💡', t: 'đèn đường', why: 'Đèn làm phố sáng đẹp về đêm.', cats: ['lamp'], need: { per: 8, of: 'core' }, from: 4, pri: 3 }
    ],
    2: [
      { id: 'fact', ic: '🏭', t: 'nhà máy / xưởng', why: 'Nhà máy tạo việc làm và nhiều thuế.', ks: ['factory', 'workshop', 'textilemill', 'brewery'], need: 2, pri: 1 },
      { id: 'util', ic: '⚡', t: 'điện & nước', why: 'Nhà máy cần nhà máy điện, nhà máy nước hoặc tháp nước.', ks: ['powerplant', 'waterplant', 'watertower'], need: 1, from: 3, pri: 1 },
      { id: 'safe', ic: '🚒', t: 'trạm cứu hoả', why: 'Khu công nghiệp dễ cháy — cần trạm cứu hoả.', ks: ['firestation', 'coastguard'], need: 1, from: 4, pri: 1 },
      { id: 'store', ic: '📦', t: 'kho & bãi container', why: 'Kho hàng và container giúp cảng vận hành.', ks: ['warehouse', 'containers', 'cargodepot'], need: 2, from: 2, pri: 2 },
      { id: 'port', ic: '⚓', t: 'thiết bị cảng (cần cẩu, hải đăng, xưởng tàu)', why: 'Cần cẩu và hải đăng làm cảng biển đúng nghĩa.', ks: ['crane', 'lighthouse', 'shipyard', 'fishmarket'], need: 2, from: 2, pri: 2 },
      { id: 'rec', ic: '♻️', t: 'tái chế / xử lý rác', why: 'Giảm ô nhiễm từ nhà máy.', ks: ['recycling', 'recyclecenter'], need: 1, from: 4, pri: 2 },
      { id: 'green', ic: '🌳', t: 'cây xanh chắn ô nhiễm', why: 'Cây xanh giúp dân bớt khó chịu vì khói bụi.', cats: ['tree', 'flower'], need: { per: 6, of: 'core' }, from: 4, pri: 2 },
      { id: 'lamp', ic: '💡', t: 'đèn đường', why: 'Đèn giúp bến cảng sáng về đêm.', cats: ['lamp'], need: { per: 8, of: 'core' }, from: 4, pri: 3 }
    ],
    3: [
      { id: 'ride', ic: '🎡', t: 'trò chơi lớn (đu quay, vòng ngựa, tàu cướp biển…)', why: 'Trò chơi lớn là nam châm thu hút khách du lịch.', ks: ['ferris', 'carousel', 'pirateship', 'bumpercars', 'circus'], need: 2, pri: 1 },
      { id: 'indoor', ic: '🎬', t: 'rạp chiếu phim / khu game / bowling', why: 'Giải trí trong nhà để khách chơi cả khi trời mưa.', ks: ['cinema', 'arcade', 'bowling', 'karaoke', 'minigolf'], need: 2, from: 2, pri: 2 },
      { id: 'water', ic: '🐠', t: 'công viên nước / thuỷ cung', why: 'Điểm hút khách mùa nóng.', ks: ['waterpark', 'aquarium'], need: 1, from: 3, pri: 2 },
      { id: 'food', ic: '🍦', t: 'quầy kem & đồ ăn', why: 'Khách chơi xong cần ăn uống.', ks: ['icecream', 'cafe', 'kiosk'], need: { per: 4, of: 'core' }, from: 2, pri: 2 },
      { id: 'funv', ic: '🎪', t: 'nhiều loại trò chơi khác nhau', why: 'Đa dạng trò chơi để khách không chán.', cats: ['fun'], variety: 6, pri: 2 },
      { id: 'bench', ic: '🪑', t: 'ghế & nhà vệ sinh', why: 'Khách đông cần chỗ nghỉ.', cats: ['bench'], need: 3, from: 3, pri: 2 },
      { id: 'safe', ic: '🚓', t: 'công an / y tế', why: 'Chỗ đông người cần an ninh và trạm y tế.', ks: ['police', 'clinic'], need: 1, from: 5, pri: 1 },
      { id: 'lamp', ic: '💡', t: 'đèn & biển neon', why: 'Khu giải trí lung linh nhất về đêm.', ks: ['neonsign', 'lanternstring', 'spotlight'], cats: ['lamp'], need: { per: 5, of: 'core' }, from: 3, pri: 3 }
    ],
    4: [
      { id: 'school', ic: '🏫', t: 'trường học', why: 'Khu Học đường cần trường mẫu giáo và trường học làm nền tảng.', ks: ['kindergarten', 'artschool', 'languagecenter', 'school'], need: 2, pri: 1 },
      { id: 'uni', ic: '🎓', t: 'đại học', why: 'Đại học là trái tim của khu Campus.', ks: ['university', 'uniskytower'], need: 1, from: 2, pri: 1 },
      { id: 'lib', ic: '📚', t: 'thư viện / hiệu sách', why: 'Nơi học sinh đọc sách, học nhóm.', ks: ['library', 'bookstore'], need: 1, from: 2, pri: 1 },
      { id: 'lab', ic: '🔬', t: 'phòng thí nghiệm', why: 'Học thực hành và nghiên cứu khoa học.', ks: ['lab', 'techlab'], need: 1, from: 3, pri: 2 },
      { id: 'cult', ic: '🏛️', t: 'bảo tàng / phòng tranh / đài thiên văn', why: 'Mở rộng kiến thức và nghệ thuật cho học sinh.', ks: ['museum', 'artgallery', 'observatory', 'planetarium', 'artschool', 'languagecenter'], need: 2, from: 3, pri: 2 },
      { id: 'dorm', ic: '🛏️', t: 'ký túc xá', why: 'Sinh viên cần chỗ ở.', ks: ['dorm'], need: 2, from: 3, pri: 2 },
      { id: 'sport', ic: '🏀', t: 'nhà thi đấu / sân thể thao', why: 'Học sinh cần vận động.', ks: ['sportshall', 'court', 'tenniscourt'], need: 1, from: 4, pri: 3 },
      { id: 'green', ic: '🌳', t: 'cây xanh & ghế đá', why: 'Khuôn viên xanh giúp học sinh thư giãn.', cats: ['tree', 'flower', 'bench'], need: { per: 4, of: 'core' }, from: 3, pri: 2 },
      { id: 'lamp', ic: '💡', t: 'đèn đường', why: 'Đèn giúp sinh viên đi học tối an toàn.', cats: ['lamp'], need: { per: 8, of: 'core' }, from: 4, pri: 3 }
    ],
    5: [
      { id: 'land', ic: '🗼', t: 'công trình nổi tiếng thế giới', why: 'Kim tự tháp, tháp Eiffel, đền Hy Lạp… là điểm tham quan chính.', ks: ['pyramid', 'liberty', 'irontower', 'pagoda', 'colosseum', 'castle', 'greektemple', 'torii', 'windmill', 'opera'], need: 3, pri: 1 },
      { id: 'worldv', ic: '🌍', t: 'nhiều nền văn hoá khác nhau', why: 'Mỗi nước một công trình khiến phố quốc tế phong phú.', cats: ['world'], variety: 7, pri: 2 },
      { id: 'food', ic: '🍣', t: 'quán ăn các nước', why: 'Sushi, pizza, trà… cho khách thưởng thức.', ks: ['sushi', 'pizzeria', 'teahouse'], need: 2, from: 2, pri: 2 },
      { id: 'plaza', ic: '⛲', t: 'quảng trường / đài phun nước', why: 'Chỗ tụ họp giữa phố cổ.', ks: ['fountain', 'bigclock', 'streetclock', 'gardenstatue'], need: 1, from: 3, pri: 3 },
      { id: 'hotel', ic: '🏨', t: 'khách sạn', why: 'Du khách cần chỗ nghỉ.', ks: ['hotel'], need: 1, from: 4, pri: 2 },
      { id: 'safe', ic: '🚓', t: 'công an', why: 'Phố du lịch cần an ninh.', ks: ['police', 'clinic'], need: 1, from: 6, pri: 1 },
      { id: 'lamp', ic: '🏮', t: 'đèn lồng & đèn đường', why: 'Phố cổ đẹp nhất khi lên đèn.', ks: ['stonelantern', 'lanternstring'], cats: ['lamp'], need: { per: 6, of: 'core' }, from: 3, pri: 3 }
    ],
    6: [
      { id: 'stay', ic: '🏨', t: 'nơi nghỉ dưỡng', why: 'Khách biển cần khách sạn, bungalow.', ks: ['resorthotel', 'bungalow', 'beachhouse', 'hotel'], need: 2, pri: 1 },
      { id: 'safe', ic: '🛟', t: 'trạm cứu hộ bãi biển', why: 'An toàn cho người tắm biển.', ks: ['lifeguard'], need: 1, from: 2, pri: 1 },
      { id: 'food', ic: '🍤', t: 'quán hải sản / bar biển', why: 'Ăn uống bên bờ biển.', ks: ['beachbar', 'seafood', 'icecream'], need: 2, from: 2, pri: 2 },
      { id: 'act', ic: '🏄', t: 'hoạt động biển (lướt sóng, lặn, bóng chuyền, spa)', why: 'Khách cần việc để làm.', ks: ['surfshop', 'divecenter', 'volleyball', 'yachtclub', 'spa'], need: 2, from: 3, pri: 2 },
      { id: 'shop', ic: '🎁', t: 'cửa hàng quà lưu niệm', why: 'Du khách mua quà mang về.', ks: ['souvenir'], need: 1, from: 3, pri: 2 },
      { id: 'palm', ic: '🌴', t: 'cây dừa & cây cảnh', why: 'Dừa làm bãi biển đúng chất nhiệt đới.', cats: ['tree', 'flower'], need: 4, from: 3, pri: 2 },
      { id: 'lamp', ic: '💡', t: 'đèn & ghế ven biển', why: 'Dạo biển buổi tối thật thích.', cats: ['lamp', 'bench'], need: { per: 5, of: 'core' }, from: 3, pri: 3 }
    ],
    7: [
      { id: 'stay', ic: '🏔️', t: 'nhà nghỉ trên núi', why: 'Khách leo núi cần chỗ ngủ.', ks: ['cabin', 'skilodge', 'mounthotel', 'chalet'], need: 2, pri: 1 },
      { id: 'move', ic: '🚠', t: 'cáp treo / trượt tuyết / điểm ngắm cảnh', why: 'Điểm nhấn du lịch núi.', ks: ['cablecar', 'skirental', 'lookout'], need: 2, from: 2, pri: 1 },
      { id: 'warm', ic: '♨️', t: 'suối nước nóng / quán cà phê núi', why: 'Chỗ sưởi ấm cho khách.', ks: ['hotspring', 'alpinecafe'], need: 1, from: 3, pri: 2 },
      { id: 'camp', ic: '⛺', t: 'khu cắm trại', why: 'Hoạt động ngoài trời được yêu thích.', ks: ['campsite'], need: 1, from: 3, pri: 2 },
      { id: 'safe', ic: '🚒', t: 'trạm cứu hoả (cháy rừng)', why: 'Rừng thông dễ cháy.', ks: ['firestation', 'clinic'], need: 1, from: 5, pri: 1 },
      { id: 'pine', ic: '🌲', t: 'cây thông', why: 'Rừng thông làm núi đẹp hơn.', cats: ['tree'], need: 5, from: 3, pri: 2 }
    ],
    8: [
      { id: 'house', ic: '🏡', t: 'nhà nông trại', why: 'Người làm nông cần chỗ ở.', ks: ['farmhouse', 'redfarmhouse'], need: 1, pri: 1 },
      { id: 'crop', ic: '🌾', t: 'ruộng / vườn cây / ao cá', why: 'Nguồn thu nhập chính của nông trại.', ks: ['vegfield', 'wheatfield', 'orchard', 'pasture', 'fishpond'], need: 3, from: 1, pri: 1 },
      { id: 'live', ic: '🐔', t: 'chuồng trại chăn nuôi', why: 'Gà, bò, cừu cho thêm sản phẩm.', ks: ['henhouse', 'barn', 'pasture'], need: 2, from: 3, pri: 2 },
      { id: 'store', ic: '🌽', t: 'kho chứa (silo, rơm)', why: 'Chứa nông sản.', ks: ['silo', 'hayroll', 'barn'], need: 1, from: 3, pri: 2 },
      { id: 'water', ic: '💧', t: 'tưới nước (cối xay gió, tháp nước)', why: 'Cây trồng cần nước.', ks: ['windpump', 'watertower'], need: 1, from: 3, pri: 2 },
      { id: 'shop', ic: '🧺', t: 'cửa hàng nông sản', why: 'Bán nông sản trực tiếp cho dân thành phố.', ks: ['farmshop'], need: 1, from: 4, pri: 2 },
      { id: 'deco', ic: '🌻', t: 'trang trí đồng quê (bù nhìn, hoa hướng dương)', why: 'Cho nông trại thêm duyên.', ks: ['scarecrow', 'sunflower', 'greenhouse'], need: 1, from: 4, pri: 3 }
    ],
    9: [
      { id: 'term', ic: '✈️', t: 'nhà ga sân bay', why: 'Hành khách cần nhà ga.', ks: ['terminal'], need: 1, pri: 1 },
      { id: 'ctrl', ic: '🗼', t: 'tháp điều khiển', why: 'Không thể cất hạ cánh nếu thiếu tháp điều khiển.', ks: ['controltower'], need: 1, from: 1, pri: 1 },
      { id: 'hang', ic: '🚁', t: 'nhà chứa máy bay / bãi trực thăng', why: 'Chỗ đậu máy bay.', ks: ['hangar', 'helipad'], need: 1, from: 2, pri: 1 },
      { id: 'rail', ic: '🚆', t: 'ga tàu / bến xe / taxi', why: 'Nối sân bay với thành phố.', ks: ['trainstation', 'busterminal', 'taxistand', 'busdepot', 'railstation'], need: 2, from: 2, pri: 1 },
      { id: 'park', ic: '🅿️', t: 'bãi đỗ xe / trạm xăng', why: 'Xe cộ cần chỗ đỗ và tiếp nhiên liệu.', ks: ['parking', 'gasstation', 'petrolstation'], need: 1, from: 3, pri: 2 },
      { id: 'cargo', ic: '📦', t: 'kho vận hàng hoá', why: 'Hàng hoá đi qua sân bay.', ks: ['cargodepot'], need: 1, from: 3, pri: 2 },
      { id: 'safe', ic: '🚓', t: 'công an / cứu hoả', why: 'Sân bay cần an ninh nghiêm ngặt.', ks: ['police', 'firestation'], need: 1, from: 4, pri: 1 },
      { id: 'lamp', ic: '💡', t: 'đèn đường băng & lối đi', why: 'Đèn làm sân bay sáng về đêm.', cats: ['lamp'], need: { per: 6, of: 'core' }, from: 3, pri: 3 }
    ],
    10: [
      { id: 'tree', ic: '🌳', t: 'cây xanh', why: 'Công viên không thể thiếu cây.', cats: ['tree'], need: 8, pri: 1 },
      { id: 'flower', ic: '🌸', t: 'hoa & bồn hoa', why: 'Hoa làm công viên rực rỡ.', cats: ['flower'], need: 5, from: 2, pri: 2 },
      { id: 'play', ic: '🛝', t: 'sân chơi / sân thể thao nhỏ', why: 'Trẻ em cần chỗ chơi.', ks: ['playground', 'court', 'dogpark', 'swingbench'], need: 2, from: 3, pri: 1 },
      { id: 'water', ic: '⛲', t: 'hồ nhỏ / đài phun nước', why: 'Nước làm công viên mát và đẹp.', ks: ['pondpark', 'koipond', 'fountain'], need: 1, from: 3, pri: 2 },
      { id: 'pic', ic: '🧺', t: 'khu dã ngoại', why: 'Chỗ cả nhà trải thảm ăn trưa.', ks: ['picnicarea', 'picnic'], need: 1, from: 3, pri: 2 },
      { id: 'wild', ic: '🦁', t: 'vườn thú / vườn bách thảo', why: 'Điểm thu hút lớn của công viên.', ks: ['zoo', 'petting', 'botanical'], need: 1, from: 5, pri: 2 },
      { id: 'bench', ic: '🪑', t: 'ghế nghỉ chân', why: 'Người đi dạo cần chỗ ngồi.', cats: ['bench'], need: 4, from: 4, pri: 2 },
      { id: 'wc', ic: '🚻', t: 'nhà vệ sinh', why: 'Công viên đông người cần nhà vệ sinh.', ks: ['toilet'], need: 1, from: 6, pri: 2 },
      { id: 'lamp', ic: '💡', t: 'đèn đường', why: 'Dạo công viên buổi tối.', cats: ['lamp'], need: 4, from: 4, pri: 3 }
    ],
    11: [
      { id: 'big', ic: '🏟️', t: 'sân vận động / nhà thi đấu lớn', why: 'Công trình chính của khu Thể thao.', ks: ['stadium', 'arena'], need: 1, pri: 1 },
      { id: 'train', ic: '🏋️', t: 'phòng tập / hồ bơi / sân tennis…', why: 'Cho nhiều môn thể thao.', ks: ['gym', 'pool', 'tenniscourt', 'football', 'skatepark', 'skaterink', 'golf'], need: 3, from: 1, pri: 1 },
      { id: 'expo', ic: '🎪', t: 'trung tâm triển lãm', why: 'Tổ chức hội chợ và sự kiện.', ks: ['expohall'], need: 1, from: 3, pri: 2 },
      { id: 'shop', ic: '👟', t: 'cửa hàng đồ thể thao', why: 'Mua sắm cho vận động viên.', ks: ['sportsshop'], need: 1, from: 3, pri: 2 },
      { id: 'med', ic: '🏥', t: 'trạm y tế', why: 'Chấn thương cần được chăm sóc.', ks: ['clinic', 'hospital'], need: 1, from: 4, pri: 1 },
      { id: 'tran', ic: '🚌', t: 'bãi đỗ xe / trạm buýt', why: 'Khán giả cần đến và về.', ks: ['parking', 'busstop', 'busterminal'], need: 1, from: 3, pri: 2 },
      { id: 'lamp', ic: '💡', t: 'đèn sân & đèn đường', why: 'Thi đấu buổi tối.', cats: ['lamp'], need: { per: 6, of: 'core' }, from: 4, pri: 3 }
    ]
  };

  function analyze(C, S, role) {
    var W = C.W, lvl = S.stats.level, ch = S.chapters || [], evs = S.ev || [];
    var byD = {}; C.DISTRICTS.forEach(function (d) { byD[d.id] = []; });
    S.bs.forEach(function (b) { if (b.lv > 0 || b.tg > 0) { var d = C.DIST[b.y * W + b.x]; if (byD[d]) byD[d].push(b); } });
    var locked = function (it) { return it.lvl > lvl || (it.ch && role !== 'admin' && ch.indexOf(it.ch) < 0) || (it.ev && evs.indexOf(it.ev) < 0); };
    var out = { districts: [], global: [], urgent: 0 };
    C.DISTRICTS.forEach(function (dd) {
      var open = S.districts.indexOf(dd.id) >= 0, bl = byD[dd.id] || [], core = bl.filter(function (b) { return !DECOR[(C.BY[b.k] || {}).cat]; }), homes = bl.filter(function (b) { return (C.BY[b.k] || {}).cat === 'home'; });
      var D = { d: dd.id, open: open, built: bl.length, core: core.length, tips: [], done: 0, total: 0, pct: 0, soon: !!dd.soon };
      if (open && R[dd.id]) {
        var kinds = {}; bl.forEach(function (b) { kinds[b.k] = (kinds[b.k] || 0) + 1; });
        var wsum = 0, wok = 0;
        R[dd.id].forEach(function (sl) {
          var match = function (it) { return (sl.ks && sl.ks.indexOf(it.k) >= 0) || (sl.cats && sl.cats.indexOf(it.cat) >= 0) || (sl.re && new RegExp(sl.re).test(it.k)); };
          var cand = C.ITEMS.filter(function (it) { return match(it) && it.ds.indexOf(dd.id) >= 0 && !(it.ev && evs.indexOf(it.ev) < 0); });
          if (!cand.length) return;
          var have = 0, distinct = 0, seen = {}; bl.forEach(function (b) { var it = C.BY[b.k]; if (it && match(it)) { have++; if (!seen[b.k]) { seen[b.k] = 1; distinct++; } } });
          var need, got;
          if (sl.variety) { need = Math.min(sl.variety, cand.length); got = distinct; }
          else { var n = sl.need; if (typeof n === 'object') { var base = n.of === 'home' ? homes.length : core.length; n = Math.max(1, Math.ceil(base / n.per)); } need = n; got = have; }
          if (sl.from && core.length < sl.from) return;   // chưa đến lúc nhắc
          var w = sl.pri === 1 ? 3 : sl.pri === 2 ? 2 : 1; wsum += w; if (got >= need) { wok += w; return; } wok += w * Math.min(1, got / need) * .5;
          cand.sort(function (a, b) { var na = kinds[a.k] ? 1 : 0, nb = kinds[b.k] ? 1 : 0, la = locked(a) ? 1 : 0, lb = locked(b) ? 1 : 0; return la - lb || na - nb || a.cost - b.cost; });
          D.tips.push({ id: sl.id, ic: sl.ic, t: sl.t, why: sl.why, have: got, need: need, miss: need - got, pri: sl.pri, variety: !!sl.variety, cands: cand.slice(0, 5).map(function (it) { return { k: it.k, locked: locked(it) }; }), anyOpen: cand.some(function (it) { return !locked(it); }) });
        });
        D.tips.sort(function (a, b) { return a.pri - b.pri; });
        D.pct = wsum ? Math.round(wok / wsum * 100) : 100; D.urgent = D.tips.filter(function (t) { return t.pri === 1; }).length;
        if (core.length === 0) {   // quận còn trống: gợi ý bắt đầu
          var firsts = []; R[dd.id].filter(function (s) { return s.pri === 1 && !s.from; }).forEach(function (s) { if (D.tips.some(function (t) { return t.id === s.id; })) firsts.push(s); });
          D.empty = true; D.pct = 0;
        }
        out.urgent += D.urgent;
      }
      if (!open) {
        D.canOpen = !dd.soon && lvl >= dd.lvl; D.cost = dd.cost; D.needLvl = dd.lvl;
        if (D.canOpen) out.urgent += 0;
      }
      out.districts.push(D);
    });
    // lời nhắc chung
    var hap = S.stats.happy;
    if (hap < 65) out.global.push({ ic: '😟', t: 'Dân cư chưa vui (hạnh phúc ' + hap + '%)', why: 'Hạnh phúc thấp làm thuế giảm. Hãy thêm công viên, trường học, bệnh viện, cây xanh ở các khu có nhiều nhà.', cands: ['playground', 'clinic', 'school', 'oak', 'pondpark'].filter(function (k) { return C.BY[k]; }).map(function (k) { return { k: k, locked: locked(C.BY[k]) }; }), pri: 1 });
    var canOpen = out.districts.filter(function (x) { return !x.open && x.canOpen; });
    if (canOpen.length) out.global.push({ ic: '🗺️', t: 'Có ' + canOpen.length + ' quận mới đủ cấp để mở', why: canOpen.map(function (x) { return C.DISTRICTS[x.d].vi + ' (' + x.cost + ' xu)'; }).slice(0, 4).join(' · ') + '. Mở thêm quận để có đất xây và nhiều loại công trình mới.', openDist: canOpen[0].d, pri: 2 });
    out.count = out.urgent + out.global.filter(function (g) { return g.pri === 1; }).length;
    return out;
  }
  root.EWTCityAdvice = { analyze: analyze, RULES: R };
  if (typeof module !== 'undefined') module.exports = root.EWTCityAdvice;
})(typeof window !== 'undefined' ? window : this);
