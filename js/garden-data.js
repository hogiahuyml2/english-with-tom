/* EWT Garden — dữ liệu dùng chung cho trình duyệt và máy chủ (giá, thời gian lớn, mức vườn…).
   Máy chủ luôn kiểm tra lại theo bảng này, nên sửa giá/thời gian ở đây là đủ. */
(function (root) {
  'use strict';
  var MIN = 60 * 1000;
  // kind: plant (hoa, lớn theo thời gian), tree (cây, lớn chậm), deco (trang trí), ground (nền)
  // cost = xu; lvl = cấp vườn cần có; grow = phút để nở/ra quả; y = xu nhận khi thu hoạch; b = điểm đẹp của vườn
  var ITEMS = [
    { id: 'daisy', name: 'Cúc họa mi', kind: 'plant', cost: 0, lvl: 1, grow: 5, y: 0, b: 1, c: '#FFFFFF', c2: '#FFD23F', free: 1 },
    { id: 'tulip', name: 'Tulip', kind: 'plant', cost: 10, lvl: 1, grow: 20, y: 4, b: 2, c: '#F4577A', c2: '#FFB3C6' },
    { id: 'pansy', name: 'Păng-xê', kind: 'plant', cost: 12, lvl: 1, grow: 25, y: 5, b: 2, c: '#8E5FC4', c2: '#F7D54A' },
    { id: 'rose', name: 'Hoa hồng', kind: 'plant', cost: 30, lvl: 2, grow: 45, y: 8, b: 3, c: '#E5334B', c2: '#FF8FA3' },
    { id: 'sunflower', name: 'Hướng dương', kind: 'plant', cost: 40, lvl: 2, grow: 60, y: 10, b: 3, c: '#FFC933', c2: '#7A4A22' },
    { id: 'lavender', name: 'Oải hương', kind: 'plant', cost: 60, lvl: 3, grow: 75, y: 12, b: 4, c: '#9B7BE0', c2: '#C9B6F2' },
    { id: 'lotus', name: 'Sen hồng', kind: 'plant', cost: 90, lvl: 3, grow: 90, y: 15, b: 5, c: '#FF8FB8', c2: '#FFE0EC' },
    { id: 'hydrangea', name: 'Cẩm tú cầu', kind: 'plant', cost: 140, lvl: 4, grow: 120, y: 20, b: 6, c: '#5B9BF0', c2: '#B9D5FF' },
    { id: 'orchid', name: 'Hoa lan', kind: 'plant', cost: 220, lvl: 5, grow: 180, y: 28, b: 8, c: '#E26BC8', c2: '#FFD6F4' },
    { id: 'starflower', name: 'Hoa ánh sao', kind: 'plant', cost: 400, lvl: 6, grow: 240, y: 45, b: 12, c: '#38D6C4', c2: '#FFF48A' },
    { id: 'cosmos', name: 'Cúc cánh bướm', kind: 'plant', cost: 18, lvl: 2, grow: 35, y: 6, b: 3, c: '#FF7EB6', c2: '#F7C948' },
    { id: 'poppy', name: 'Hoa anh túc', kind: 'plant', cost: 20, lvl: 2, grow: 40, y: 7, b: 3, c: '#F0453A', c2: '#2E2A33' },
    { id: 'marigold', name: 'Cúc vạn thọ', kind: 'plant', cost: 35, lvl: 3, grow: 70, y: 11, b: 4, c: '#FF9A1F', c2: '#B85A00' },
    { id: 'iris', name: 'Diên vĩ', kind: 'plant', cost: 50, lvl: 3, grow: 95, y: 14, b: 5, c: '#6D4DD8', c2: '#B7A2F5' },
    { id: 'hibiscus', name: 'Dâm bụt', kind: 'plant', cost: 75, lvl: 4, grow: 110, y: 17, b: 6, c: '#FF4D6D', c2: '#FFD0DA' },
    { id: 'bluebell', name: 'Chuông xanh', kind: 'plant', cost: 100, lvl: 4, grow: 150, y: 22, b: 7, c: '#5C8DF0', c2: '#BFD4FF' },
    { id: 'dandelion', name: 'Bồ công anh', kind: 'plant', cost: 130, lvl: 5, grow: 200, y: 27, b: 8, c: '#FFD23F', c2: '#F5B21A' },
    { id: 'peony', name: 'Mẫu đơn', kind: 'plant', cost: 260, lvl: 6, grow: 220, y: 36, b: 10, c: '#FF8FB0', c2: '#FFD6E2' },
    { id: 'moonflower', name: 'Hoa nguyệt quang', kind: 'plant', cost: 600, lvl: 8, grow: 300, y: 60, b: 16, c: '#E8F1FF', c2: '#9FC2FF' },
    { id: 'pine', name: 'Cây thông', kind: 'tree', cost: 80, lvl: 2, grow: 300, y: 30, b: 9, c: '#2E8B57', c2: '#1F6B41' },
    { id: 'apple', name: 'Cây táo', kind: 'tree', cost: 120, lvl: 3, grow: 360, y: 36, b: 10, c: '#4CAF50', c2: '#E5334B' },
    { id: 'lemon', name: 'Cây chanh', kind: 'tree', cost: 160, lvl: 4, grow: 400, y: 42, b: 11, c: '#5FBF55', c2: '#FFE14D' },
    { id: 'cherry', name: 'Hoa anh đào', kind: 'tree', cost: 300, lvl: 4, grow: 480, y: 60, b: 14, c: '#FFB7D0', c2: '#FF7FAE' },
    { id: 'palm', name: 'Cây dừa', kind: 'tree', cost: 450, lvl: 6, grow: 540, y: 75, b: 15, c: '#3FAE4A', c2: '#8A5A2E' },
    { id: 'path', name: 'Lối đi đá', kind: 'ground', cost: 0, lvl: 1, b: 1, free: 1 },
    { id: 'rock', name: 'Hòn đá', kind: 'deco', cost: 0, lvl: 1, b: 1, free: 1 },
    { id: 'bush', name: 'Bụi cây', kind: 'deco', cost: 0, lvl: 1, b: 1, free: 1 },
    { id: 'fence', name: 'Hàng rào gỗ', kind: 'deco', cost: 0, lvl: 1, b: 1, free: 1 },
    { id: 'sign', name: 'Biển EWT Garden', kind: 'deco', cost: 20, lvl: 1, b: 2 },
    { id: 'bench', name: 'Ghế gỗ', kind: 'deco', cost: 30, lvl: 2, b: 3 },
    { id: 'lamp', name: 'Đèn vườn', kind: 'deco', cost: 40, lvl: 2, b: 3 },
    { id: 'mailbox', name: 'Hộp thư', kind: 'deco', cost: 30, lvl: 2, b: 2 },
    { id: 'birdhouse', name: 'Nhà chim', kind: 'deco', cost: 50, lvl: 2, b: 4 },
    { id: 'picnic', name: 'Khăn picnic', kind: 'deco', cost: 50, lvl: 3, b: 4 },
    { id: 'gnome', name: 'Chú lùn', kind: 'deco', cost: 90, lvl: 3, b: 5 },
    { id: 'pond', name: 'Ao nhỏ', kind: 'deco', cost: 100, lvl: 3, b: 6 },
    { id: 'arch', name: 'Cổng hoa', kind: 'deco', cost: 200, lvl: 4, b: 9 },
    { id: 'swing', name: 'Xích đu', kind: 'deco', cost: 300, lvl: 5, b: 10 },
    { id: 'fountain', name: 'Đài phun nước', kind: 'deco', cost: 500, lvl: 5, b: 14 },
    { id: 'windmill', name: 'Cối xay gió', kind: 'deco', cost: 650, lvl: 6, b: 15 },
    { id: 'greenhouse', name: 'Nhà kính', kind: 'deco', cost: 900, lvl: 7, b: 18 },
    // Bộ "Nông trại" (hình của Kenney, CC0): dùng ảnh PNG đặt trong images/garden/farm
    { id: 'corn', name: 'Cây ngô', kind: 'plant', cost: 24, lvl: 2, grow: 55, y: 12, b: 3, c: '#C9D56A', c2: '#8FB04A', img: 'farm' },
    { id: 'haybale', name: 'Bó rơm', kind: 'deco', cost: 22, lvl: 2, b: 3, img: 'farm', file: 'hayBalesStacked_N', k: 1.05 },
    { id: 'crates', name: 'Thùng & bao tải', kind: 'deco', cost: 26, lvl: 2, b: 3, img: 'farm', file: 'sacksCrate_N', k: 1.5 },
    { id: 'rustfence', name: 'Hàng rào gỗ nâu', kind: 'deco', cost: 12, lvl: 1, b: 2, img: 'farm', file: 'fenceLow_N', k: 1.2 },
    { id: 'deck', name: 'Sàn gỗ', kind: 'ground', cost: 15, lvl: 1, b: 2, img: 'farm', file: 'planks_N', k: 1 },
    // Công trình lớn: chiếm w×h ô (đặt ô góc trên-trái), giá cao và rất đẹp
    { id: 'hutbig', name: 'Chòi lá', kind: 'big', w: 2, h: 2, cost: 300, lvl: 3, b: 16 },
    { id: 'pondbig', name: 'Hồ nhỏ', kind: 'big', w: 2, h: 2, cost: 450, lvl: 4, b: 18 },
    { id: 'cabinbig', name: 'Nhà gỗ', kind: 'big', w: 2, h: 2, cost: 500, lvl: 4, b: 22 },
    { id: 'bridge', name: 'Cầu vòm trắng', kind: 'big', w: 3, h: 1, cost: 400, lvl: 4, b: 16 },
    { id: 'flowerarch', name: 'Cổng hoa lớn', kind: 'big', w: 3, h: 1, cost: 550, lvl: 5, b: 22 },
    { id: 'gazebo', name: 'Chòi lục giác', kind: 'big', w: 2, h: 2, cost: 700, lvl: 5, b: 26 },
    { id: 'clocktower', name: 'Tháp đồng hồ', kind: 'big', w: 1, h: 2, cost: 900, lvl: 6, b: 30 },
    { id: 'fountainbig', name: 'Đài phun lớn', kind: 'big', w: 2, h: 2, cost: 1100, lvl: 7, b: 36 },
    { id: 'glasshouse', name: 'Nhà kính lớn', kind: 'big', w: 3, h: 2, cost: 1500, lvl: 7, b: 44 },
    { id: 'castle', name: 'Lâu đài mini', kind: 'big', w: 3, h: 2, cost: 3000, lvl: 9, b: 80 },
    // ── Món dành cho 9 khu mới (mở khoá theo cấp vườn tương ứng) ──
    { id: 'carrot', name: 'Cà rốt', kind: 'plant', cost: 28, lvl: 3, grow: 50, y: 11, b: 3, c: '#FF8A2A', c2: '#2F8A4A' },
    { id: 'tomato', name: 'Cà chua', kind: 'plant', cost: 45, lvl: 3, grow: 80, y: 14, b: 4, c: '#E5334B', c2: '#2F8A4A' },
    { id: 'wheat', name: 'Lúa mì', kind: 'plant', cost: 60, lvl: 3, grow: 100, y: 17, b: 4, c: '#E8C45A', c2: '#B79A3C' },
    { id: 'kiku', name: 'Cúc Nhật', kind: 'plant', cost: 150, lvl: 5, grow: 160, y: 26, b: 8, c: '#FFF4D6', c2: '#FFD23F' },
    { id: 'camellia', name: 'Hoa trà', kind: 'plant', cost: 230, lvl: 5, grow: 200, y: 32, b: 9, c: '#E8456B', c2: '#FFD23F' },
    { id: 'mum', name: 'Cúc thu', kind: 'plant', cost: 200, lvl: 6, grow: 190, y: 30, b: 9, c: '#F28A24', c2: '#FFD23F' },
    { id: 'pumpkin', name: 'Bí ngô', kind: 'plant', cost: 160, lvl: 6, grow: 210, y: 34, b: 8, c: '#F28A24', c2: '#5E8F3A' },
    { id: 'edelweiss', name: 'Hoa nhung tuyết', kind: 'plant', cost: 320, lvl: 7, grow: 240, y: 44, b: 11, c: '#F6F8F2', c2: '#E8D27A' },
    { id: 'aloe', name: 'Lô hội', kind: 'plant', cost: 380, lvl: 8, grow: 260, y: 52, b: 12, c: '#4FA85A', c2: '#FF7AA8' },
    { id: 'desertrose', name: 'Hồng sa mạc', kind: 'plant', cost: 450, lvl: 8, grow: 280, y: 56, b: 13, c: '#FF8FB0', c2: '#FFD6E2' },
    { id: 'swirlflower', name: 'Hoa kẹo xoắn', kind: 'plant', cost: 520, lvl: 9, grow: 300, y: 66, b: 15, c: '#FF6B9A', c2: '#6BC8FF' },
    { id: 'anemone', name: 'Hải quỳ', kind: 'plant', cost: 650, lvl: 10, grow: 320, y: 76, b: 17, c: '#FF7A9A', c2: '#B48CFF' },
    { id: 'kelp', name: 'Tảo biển', kind: 'plant', cost: 580, lvl: 10, grow: 300, y: 70, b: 16, c: '#3FAE5A', c2: '#9BE8B0' },
    { id: 'cloudflower', name: 'Hoa mây', kind: 'plant', cost: 820, lvl: 11, grow: 340, y: 90, b: 20, c: '#FFFFFF', c2: '#9FC8F5' },
    { id: 'alienflower', name: 'Hoa ngoài hành tinh', kind: 'plant', cost: 1100, lvl: 12, grow: 380, y: 110, b: 24, c: '#8E5CF0', c2: '#6BE8FF' },
    { id: 'glowshroom', name: 'Nấm phát sáng', kind: 'plant', cost: 1000, lvl: 12, grow: 360, y: 100, b: 22, c: '#38D6C4', c2: '#B8FFF0' },
    { id: 'plum', name: 'Cây mai Nhật', kind: 'tree', cost: 380, lvl: 5, grow: 500, y: 66, b: 14, c: '#4CAF50', c2: '#2E8B57' },
    { id: 'maple', name: 'Cây phong đỏ', kind: 'tree', cost: 420, lvl: 6, grow: 520, y: 70, b: 15, c: '#4CAF50', c2: '#2E8B57' },
    { id: 'saguaro', name: 'Xương rồng khổng lồ', kind: 'tree', cost: 520, lvl: 8, grow: 560, y: 84, b: 17, c: '#4CAF50', c2: '#2E8B57' },
    { id: 'candytree', name: 'Cây kẹo bông', kind: 'tree', cost: 700, lvl: 9, grow: 600, y: 98, b: 20, c: '#4CAF50', c2: '#2E8B57' },
    { id: 'coraltree', name: 'Cây san hô', kind: 'tree', cost: 850, lvl: 10, grow: 620, y: 108, b: 22, c: '#4CAF50', c2: '#2E8B57' },
    { id: 'crystaltree', name: 'Cây pha lê', kind: 'tree', cost: 1500, lvl: 12, grow: 700, y: 150, b: 30, c: '#4CAF50', c2: '#2E8B57' },
    { id: 'scarecrow', name: 'Bù nhìn', kind: 'deco', cost: 60, lvl: 3, b: 4 },
    { id: 'milkcan', name: 'Can sữa', kind: 'deco', cost: 40, lvl: 3, b: 3 },
    { id: 'torii', name: 'Cổng torii', kind: 'deco', cost: 220, lvl: 5, b: 10 },
    { id: 'stonelantern', name: 'Đèn đá Nhật', kind: 'deco', cost: 120, lvl: 5, b: 6 },
    { id: 'pumpkinlamp', name: 'Đèn bí ngô', kind: 'deco', cost: 90, lvl: 6, b: 5 },
    { id: 'leafheap', name: 'Đống lá thu', kind: 'deco', cost: 50, lvl: 6, b: 3 },
    { id: 'campfired', name: 'Lửa trại', kind: 'deco', cost: 150, lvl: 7, b: 7 },
    { id: 'snowflag', name: 'Cờ đỉnh núi', kind: 'deco', cost: 100, lvl: 7, b: 5 },
    { id: 'urn', name: 'Bình cổ', kind: 'deco', cost: 180, lvl: 8, b: 8 },
    { id: 'camelstatue', name: 'Tượng lạc đà', kind: 'deco', cost: 320, lvl: 8, b: 12 },
    { id: 'candycane', name: 'Gậy kẹo', kind: 'deco', cost: 110, lvl: 9, b: 6 },
    { id: 'lollipopd', name: 'Kẹo mút', kind: 'deco', cost: 90, lvl: 9, b: 5 },
    { id: 'shelld', name: 'Vỏ sò', kind: 'deco', cost: 130, lvl: 10, b: 6 },
    { id: 'anchor', name: 'Mỏ neo', kind: 'deco', cost: 200, lvl: 10, b: 9 },
    { id: 'treasured', name: 'Rương kho báu', kind: 'deco', cost: 400, lvl: 10, b: 13 },
    { id: 'cloudpuff', name: 'Mây bông', kind: 'deco', cost: 260, lvl: 11, b: 10 },
    { id: 'rainbowd', name: 'Cầu vồng mini', kind: 'deco', cost: 420, lvl: 11, b: 14 },
    { id: 'astronaut', name: 'Phi hành gia', kind: 'deco', cost: 600, lvl: 12, b: 18 },
    { id: 'ufo', name: 'Đĩa bay', kind: 'deco', cost: 750, lvl: 12, b: 20 },
    { id: 'satellited', name: 'Vệ tinh nhỏ', kind: 'deco', cost: 520, lvl: 12, b: 16 },
    { id: 'barnbig', name: 'Chuồng nông trại', kind: 'big', w: 3, h: 2, cost: 900, lvl: 3, b: 34 },
    { id: 'teahouse', name: 'Nhà trà Nhật', kind: 'big', w: 2, h: 2, cost: 1300, lvl: 5, b: 40 },
    { id: 'treehouse', name: 'Nhà trên cây', kind: 'big', w: 2, h: 2, cost: 1700, lvl: 6, b: 46 },
    { id: 'pyramidbig', name: 'Kim tự tháp', kind: 'big', w: 3, h: 2, cost: 2600, lvl: 8, b: 64 },
    { id: 'gingerbread', name: 'Nhà bánh quy', kind: 'big', w: 2, h: 2, cost: 2200, lvl: 9, b: 54 },
    { id: 'submarine', name: 'Tàu ngầm vàng', kind: 'big', w: 3, h: 1, cost: 2000, lvl: 10, b: 48 },
    { id: 'cloudhouse', name: 'Nhà trên mây', kind: 'big', w: 2, h: 2, cost: 3200, lvl: 11, b: 66 },
    { id: 'rocketbig', name: 'Tên lửa', kind: 'big', w: 1, h: 2, cost: 3800, lvl: 12, b: 72 },
    { id: 'observatory', name: 'Đài thiên văn', kind: 'big', w: 2, h: 2, cost: 4500, lvl: 12, b: 82 },
    // ── món cho 10 khu thêm sau: mỗi khu 1 công trình lớn + 1 đồ trang trí ──
    { id: 'bamboobunch', name: 'Bụi tre', kind: 'deco', cost: 140, lvl: 4, b: 6 },
    { id: 'drum', name: 'Trống châu Phi', kind: 'deco', cost: 180, lvl: 5, b: 7 },
    { id: 'totem', name: 'Cột totem', kind: 'deco', cost: 260, lvl: 6, b: 10 },
    { id: 'cart', name: 'Xe chở cỏ khô', kind: 'deco', cost: 200, lvl: 6, b: 8 },
    { id: 'popcorn', name: 'Xe bắp rang', kind: 'deco', cost: 320, lvl: 7, b: 11 },
    { id: 'snowsled', name: 'Xe trượt tuyết', kind: 'deco', cost: 400, lvl: 8, b: 12 },
    { id: 'pirateflag', name: 'Cờ hải tặc', kind: 'deco', cost: 520, lvl: 9, b: 14 },
    { id: 'dinoegg', name: 'Trứng khủng long', kind: 'deco', cost: 700, lvl: 10, b: 16 },
    { id: 'tikitorch', name: 'Đuốc dung nham', kind: 'deco', cost: 900, lvl: 11, b: 19 },
    { id: 'hologramd', name: 'Quả cầu hologram', kind: 'deco', cost: 1300, lvl: 13, b: 24 },
    { id: 'bamboohouse', name: 'Nhà sàn tre', kind: 'big', w: 3, h: 2, cost: 1800, lvl: 4, b: 44 },
    { id: 'safaritower', name: 'Tháp ngắm thú', kind: 'big', w: 2, h: 2, cost: 2400, lvl: 5, b: 50 },
    { id: 'tavern', name: 'Quán trọ trung cổ', kind: 'big', w: 3, h: 2, cost: 2800, lvl: 6, b: 62 },
    { id: 'jungletemple', name: 'Đền cổ trong rừng', kind: 'big', w: 3, h: 3, cost: 4200, lvl: 6, b: 88 },
    { id: 'carousel', name: 'Vòng quay ngựa gỗ', kind: 'big', w: 2, h: 2, cost: 3600, lvl: 7, b: 70 },
    { id: 'igloo', name: 'Nhà tuyết igloo', kind: 'big', w: 2, h: 2, cost: 3200, lvl: 8, b: 58 },
    { id: 'pirateship', name: 'Tàu hải tặc', kind: 'big', w: 3, h: 3, cost: 6000, lvl: 9, b: 100 },
    { id: 'brontosaurus', name: 'Khủng long cổ dài', kind: 'big', w: 4, h: 3, cost: 8000, lvl: 10, b: 130 },
    { id: 'volcano', name: 'Núi lửa nhỏ', kind: 'big', w: 4, h: 3, cost: 10000, lvl: 11, b: 150 },
    { id: 'neontower', name: 'Tháp neon', kind: 'big', w: 2, h: 3, cost: 12000, lvl: 13, b: 160 }
  ];
  var PETS = [
    { id: 'bird', name: 'Chim sẻ', cost: 60, lvl: 1 }, { id: 'cat', name: 'Mèo con', cost: 80, lvl: 1 }, { id: 'dog', name: 'Cún con', cost: 100, lvl: 1 },
    { id: 'duck', name: 'Vịt vàng', cost: 80, lvl: 2 }, { id: 'bunny', name: 'Thỏ trắng', cost: 90, lvl: 2 }, { id: 'butterfly', name: 'Bướm', cost: 50, lvl: 2 },
    { id: 'turtle', name: 'Rùa nhỏ', cost: 120, lvl: 3 }, { id: 'hamster', name: 'Chuột hamster', cost: 90, lvl: 3 }, { id: 'fox', name: 'Cáo nhỏ', cost: 300, lvl: 5 },
    { id: 'hedgehog', name: 'Nhím con', cost: 110, lvl: 3 }, { id: 'penguin', name: 'Cánh cụt', cost: 180, lvl: 4 }, { id: 'panda', name: 'Gấu trúc con', cost: 420, lvl: 6 },
    { id: 'chick', name: 'Gà con', cost: 70, lvl: 3 }, { id: 'lamb', name: 'Cừu non', cost: 160, lvl: 3 }, { id: 'koifish', name: 'Cá koi', cost: 260, lvl: 5 }, { id: 'squirrel', name: 'Sóc nâu', cost: 300, lvl: 6 }, { id: 'goat', name: 'Dê núi', cost: 340, lvl: 7 },
    { id: 'camel', name: 'Lạc đà con', cost: 460, lvl: 8 }, { id: 'seahorse', name: 'Cá ngựa', cost: 600, lvl: 10 }, { id: 'jellyfish', name: 'Sứa hồng', cost: 680, lvl: 10 }, { id: 'unicorn', name: 'Kỳ lân con', cost: 1000, lvl: 11 }, { id: 'alien', name: 'Chú ngoài hành tinh', cost: 1300, lvl: 12 }
  ];
  var LEVELS = [
    { n: 1, at: 0, title: 'Mầm non' }, { n: 2, at: 10, title: 'Vườn nhỏ xinh' }, { n: 3, at: 30, title: 'Vườn hoa' }, { n: 4, at: 60, title: 'Vườn rực rỡ' }, { n: 5, at: 100, title: 'Vườn mơ ước' },
    { n: 6, at: 160, title: 'Vườn cổ tích' }, { n: 7, at: 240, title: 'Vườn thượng uyển' }, { n: 8, at: 340, title: 'Vườn thần tiên' }, { n: 9, at: 480, title: 'Vườn huyền thoại' }, { n: 10, at: 650, title: 'Khu vườn của Tom' },
    { n: 11, at: 850, title: 'Vườn pha lê' }, { n: 12, at: 1100, title: 'Vườn ngân hà' }, { n: 13, at: 1400, title: 'Vườn bất tử' }, { n: 14, at: 1800, title: 'Vườn vô cực' }
  ];
  // Các khu của EWT Garden: mỗi khu có một "khung ô" tối đa MAXC×MAXR; đất của khu mở rộng dần (xem LAND) từ góc trên-trái.
  // "blocks" là phong cảnh có sẵn (nhà, cung điện, sông, hồ…) nằm trong vùng đất gốc 7×5 — học sinh chỉ xây trên các ô còn trống.
  // nb:1 = chỉ là hình trang trí, không chiếm ô. Chỉ số ô toàn vườn = vị trí khu × PER + (hàng × MAXC + cột).
  var BASEC = 7, BASER = 5, MAXC = 20, MAXR = 14, PER = MAXC * MAXR;
  var COLS = BASEC, ROWS = BASER;
  // Các mức mở rộng đất của MỌI khu (mỗi ô nhỏ lại để vừa màn hình, càng mở rộng càng nhiều ô)
  var LAND = [
    { c: 7, r: 5, cost: 0, lvl: 1 }, { c: 9, r: 6, cost: 120, lvl: 2 }, { c: 11, r: 7, cost: 300, lvl: 3 }, { c: 13, r: 8, cost: 600, lvl: 4 },
    { c: 15, r: 10, cost: 1100, lvl: 5 }, { c: 17, r: 11, cost: 1800, lvl: 6 }, { c: 20, r: 12, cost: 2800, lvl: 8 }, { c: 20, r: 14, cost: 4200, lvl: 10 }
  ];
  LAND.forEach(function (l) { l.cells = l.c * l.r; });
  var ZONES = [
    { id: 'cottage', name: 'Vườn nhà Tom', icon: '🏡', desc: 'Căn nhà nhỏ ấm áp, lối đi lát đá dẫn ra cổng.', cost: 0, lvl: 1, blocks: [{ k: 'house', x: 0, y: 0, w: 2, h: 2 }, { k: 'pathv', x: 3, y: 0, w: 1, h: 5 }, { k: 'gate', x: 3, y: 4, w: 1, h: 1, nb: 1 }, { k: 'well', x: 6, y: 0, w: 1, h: 1 }] },
    { id: 'hill', name: 'Đồi gió', icon: '🌬️', desc: 'Cối xay gió quay trên đồi cỏ xanh mướt.', cost: 300, lvl: 2, blocks: [{ k: 'windmill', x: 5, y: 0, w: 2, h: 3 }, { k: 'pathh', x: 0, y: 3, w: 7, h: 1 }] },
    { id: 'river', name: 'Bờ sông', icon: '🌊', desc: 'Dòng sông trong xanh, cầu gỗ và cây liễu rủ.', cost: 600, lvl: 3, blocks: [{ k: 'river', x: 3, y: 0, w: 1, h: 5 }, { k: 'willow', x: 0, y: 0, w: 1, h: 1 }, { k: 'dock', x: 4, y: 4, w: 1, h: 1 }] },
    { id: 'pond', name: 'Hồ sen', icon: '🪷', desc: 'Hồ sen thơ mộng với chòi nghỉ chân mái lá.', cost: 1000, lvl: 4, blocks: [{ k: 'pond', x: 1, y: 1, w: 3, h: 3 }, { k: 'pavilion', x: 5, y: 0, w: 2, h: 2 }] },
    { id: 'forest', name: 'Rừng chòi lá', icon: '🛖', desc: 'Những chòi lá giữa rừng, bên đống lửa trại ấm áp.', cost: 1500, lvl: 5, blocks: [{ k: 'hut', x: 0, y: 0, w: 2, h: 2 }, { k: 'hut', x: 5, y: 3, w: 2, h: 2 }, { k: 'campfire', x: 3, y: 2, w: 1, h: 1 }] },
    { id: 'palace', name: 'Cung điện hoa', icon: '🏰', desc: 'Cung điện lộng lẫy với đài phun nước và lối đi hoàng gia.', cost: 2500, lvl: 7, blocks: [{ k: 'palace', x: 1, y: 0, w: 5, h: 2 }, { k: 'fountain', x: 3, y: 2, w: 1, h: 1 }, { k: 'pathv', x: 3, y: 3, w: 1, h: 2 }] },
    { id: 'winter', name: 'Vườn mùa đông', icon: '❄️', desc: 'Tuyết rơi lấp lánh, nhà gỗ ấm cúng và hồ băng.', cost: 3500, lvl: 8, blocks: [{ k: 'cabin', x: 0, y: 0, w: 2, h: 2, snow: 1 }, { k: 'pathv', x: 3, y: 0, w: 1, h: 3, snow: 1 }, { k: 'snowman', x: 6, y: 0, w: 1, h: 1 }, { k: 'icepond', x: 4, y: 3, w: 3, h: 2 }, { k: 'snowpine', x: 2, y: 4, w: 1, h: 1 }] },
    { id: 'beach', name: 'Khu biển', icon: '🏖️', desc: 'Biển xanh sóng vỗ, hải đăng trắng đỏ và chòi dừa.', cost: 5000, lvl: 9, blocks: [{ k: 'sea', x: 0, y: 0, w: 5, h: 1 }, { k: 'lighthouse', x: 5, y: 0, w: 2, h: 2 }, { k: 'pier', x: 0, y: 1, w: 1, h: 2 }, { k: 'tikihut', x: 5, y: 3, w: 2, h: 2 }, { k: 'palm', x: 3, y: 2, w: 1, h: 1 }] },
    { id: 'magic', name: 'Khu phép thuật', icon: '🔮', desc: 'Tháp pháp sư, hồ ánh sáng và ngôi nhà nấm huyền bí.', cost: 8000, lvl: 10, blocks: [{ k: 'wizard', x: 0, y: 0, w: 2, h: 3 }, { k: 'glowpool', x: 4, y: 1, w: 3, h: 2 }, { k: 'mushhouse', x: 5, y: 3, w: 2, h: 2 }, { k: 'portal', x: 3, y: 4, w: 1, h: 1 }, { k: 'crystals', x: 3, y: 0, w: 1, h: 1 }] },
    // ── 9 khu mới (thêm vào cuối để không đổi chỉ số ô của vườn đã có) ──
    { id: 'farm', name: 'Nông trại vui vẻ', icon: '🚜', desc: 'Chuồng đỏ, ruộng rau xanh mướt và bù nhìn canh đồng.', cost: 800, lvl: 3, blocks: [{ k: 'barn', x: 0, y: 0, w: 3, h: 2 }, { k: 'cropfield', x: 4, y: 0, w: 3, h: 2 }, { k: 'pathh', x: 0, y: 2, w: 7, h: 1 }, { k: 'scarecrow', x: 3, y: 3, w: 1, h: 1 }, { k: 'haystack', x: 6, y: 4, w: 1, h: 1 }] },
    { id: 'sakura', name: 'Vườn anh đào', icon: '🌸', desc: 'Cổng torii đỏ, tháp chùa và hồ cá koi dưới tán hoa anh đào.', cost: 2000, lvl: 5, blocks: [{ k: 'sakuratree', x: 0, y: 0, w: 2, h: 2 }, { k: 'pagoda', x: 4, y: 0, w: 3, h: 3 }, { k: 'lantern', x: 3, y: 1, w: 1, h: 1 }, { k: 'koipond', x: 0, y: 2, w: 3, h: 2 }, { k: 'torii', x: 3, y: 3, w: 1, h: 2 }] },
    { id: 'autumn', name: 'Rừng thu vàng', icon: '🍁', desc: 'Lá phong đỏ rực, đống lá khô và vườn bí ngô mùa thu.', cost: 2800, lvl: 6, blocks: [{ k: 'cabin', x: 0, y: 0, w: 2, h: 2 }, { k: 'pathv', x: 3, y: 0, w: 1, h: 3 }, { k: 'mapletree', x: 4, y: 0, w: 2, h: 2 }, { k: 'leafpile', x: 3, y: 3, w: 1, h: 1 }, { k: 'pumpkinpatch', x: 5, y: 3, w: 2, h: 2 }] },
    { id: 'mountain', name: 'Núi non hùng vĩ', icon: '⛰️', desc: 'Đỉnh núi cắm cờ, thác nước trắng xoá và nhà nghỉ trên núi.', cost: 3200, lvl: 7, blocks: [{ k: 'cabin', x: 0, y: 0, w: 2, h: 2, snow: 1 }, { k: 'peak', x: 3, y: 0, w: 4, h: 3 }, { k: 'flagpole', x: 2, y: 2, w: 1, h: 1 }, { k: 'waterfall', x: 0, y: 3, w: 2, h: 2 }] },
    { id: 'desert', name: 'Sa mạc kim tự tháp', icon: '🏜️', desc: 'Kim tự tháp cổ, ốc đảo xanh và lều của người du mục.', cost: 4200, lvl: 8, blocks: [{ k: 'pyramid', x: 0, y: 0, w: 3, h: 2 }, { k: 'cactus', x: 3, y: 0, w: 1, h: 1 }, { k: 'palm', x: 6, y: 0, w: 1, h: 1 }, { k: 'tent', x: 0, y: 3, w: 2, h: 2 }, { k: 'oasis', x: 4, y: 2, w: 3, h: 2 }] },
    { id: 'candy', name: 'Xứ sở kẹo ngọt', icon: '🍭', desc: 'Nhà bánh quy, sông sô-cô-la và những cây kẹo mút khổng lồ.', cost: 6000, lvl: 9, blocks: [{ k: 'candyhouse', x: 0, y: 0, w: 3, h: 2 }, { k: 'lollipop', x: 3, y: 0, w: 1, h: 1 }, { k: 'chocoriver', x: 0, y: 3, w: 5, h: 1 }, { k: 'cupcake', x: 5, y: 2, w: 2, h: 2 }, { k: 'lollipop', x: 6, y: 0, w: 1, h: 1 }] },
    { id: 'ocean', name: 'Đại dương san hô', icon: '🐠', desc: 'Rạn san hô rực rỡ, tàu đắm cổ và rương kho báu dưới đáy biển.', cost: 9000, lvl: 10, blocks: [{ k: 'coralreef', x: 0, y: 0, w: 3, h: 2 }, { k: 'seaweed', x: 3, y: 1, w: 1, h: 2 }, { k: 'treasure', x: 6, y: 0, w: 1, h: 1 }, { k: 'shipwreck', x: 4, y: 3, w: 3, h: 2 }] },
    { id: 'sky', name: 'Thiên đường mây', icon: '☁️', desc: 'Lâu đài trên mây, cầu vồng bảy sắc và khinh khí cầu bay lượn.', cost: 12000, lvl: 11, blocks: [{ k: 'rainbow', x: 2, y: 0, w: 5, h: 1, nb: 1 }, { k: 'cloudcastle', x: 0, y: 0, w: 3, h: 3 }, { k: 'balloon', x: 5, y: 3, w: 1, h: 2 }] },
    { id: 'space', name: 'Trạm vũ trụ', icon: '🚀', desc: 'Tên lửa chờ phóng, căn cứ Mặt Trăng và vệ tinh lấp lánh.', cost: 16000, lvl: 12, blocks: [{ k: 'rocket', x: 0, y: 0, w: 2, h: 3 }, { k: 'moonbase', x: 3, y: 0, w: 3, h: 2 }, { k: 'satellite', x: 6, y: 0, w: 1, h: 1 }, { k: 'crater', x: 3, y: 3, w: 2, h: 2 }] },
    // ── 10 khu thêm sau (cũng thêm vào cuối để không đổi chỉ số ô) ──
    { id: 'bamboo', name: 'Rừng tre trúc', icon: '🎋', desc: 'Rừng tre xào xạc, nhà sàn tre và chú gấu trúc đang nhấm măng.', cost: 1200, lvl: 4, blocks: [{ k: 'bamboogrove', x: 0, y: 0, w: 2, h: 3 }, { k: 'pathv', x: 3, y: 0, w: 1, h: 5 }, { k: 'bamboohouse', x: 4, y: 0, w: 3, h: 2 }, { k: 'pandasit', x: 5, y: 3, w: 1, h: 1 }] },
    { id: 'savanna', name: 'Thảo nguyên', icon: '🦒', desc: 'Cây keo xoè tán, hố nước và tháp ngắm thú giữa đồng cỏ vàng.', cost: 2200, lvl: 5, blocks: [{ k: 'acacia', x: 0, y: 0, w: 2, h: 2 }, { k: 'safaritower', x: 5, y: 0, w: 2, h: 2 }, { k: 'waterhole', x: 2, y: 2, w: 3, h: 2 }] },
    { id: 'jungle', name: 'Rừng nhiệt đới', icon: '🦜', desc: 'Ngôi đền cổ phủ dây leo, cây cổ thụ và hoa khổng lồ.', cost: 3000, lvl: 6, blocks: [{ k: 'jungletemple', x: 0, y: 0, w: 3, h: 3 }, { k: 'vinetree', x: 4, y: 0, w: 2, h: 3 }, { k: 'bigflower', x: 6, y: 3, w: 1, h: 1 }] },
    { id: 'village', name: 'Làng trung cổ', icon: '🏘️', desc: 'Quán trọ nhà gỗ, quầy chợ rực rỡ và giếng nước giữa làng.', cost: 2600, lvl: 6, blocks: [{ k: 'tavern', x: 0, y: 0, w: 3, h: 2 }, { k: 'marketstall', x: 4, y: 0, w: 2, h: 1 }, { k: 'well', x: 6, y: 2, w: 1, h: 1 }, { k: 'pathh', x: 0, y: 3, w: 7, h: 1 }] },
    { id: 'funfair', name: 'Công viên giải trí', icon: '🎡', desc: 'Vòng đu quay khổng lồ, ngựa gỗ xoay tròn và lều xiếc sặc sỡ.', cost: 4000, lvl: 7, blocks: [{ k: 'ferriswheel', x: 0, y: 0, w: 3, h: 3 }, { k: 'carousel', x: 4, y: 0, w: 2, h: 2 }, { k: 'circustent', x: 4, y: 3, w: 3, h: 2 }] },
    { id: 'arctic', name: 'Bắc Cực', icon: '🐧', desc: 'Cực quang lung linh, nhà igloo, núi băng và đàn chim cánh cụt.', cost: 5000, lvl: 8, blocks: [{ k: 'aurora', x: 0, y: 0, w: 7, h: 1, nb: 1 }, { k: 'igloo', x: 0, y: 1, w: 2, h: 2 }, { k: 'iceberg', x: 4, y: 0, w: 3, h: 3 }, { k: 'penguins', x: 1, y: 4, w: 2, h: 1 }] },
    { id: 'pirate', name: 'Đảo hải tặc', icon: '🏴‍☠️', desc: 'Tàu hải tặc mắc cạn, hòn đảo đầu lâu và dấu X kho báu.', cost: 6500, lvl: 9, blocks: [{ k: 'pirateship', x: 0, y: 0, w: 3, h: 3 }, { k: 'skullrock', x: 4, y: 0, w: 2, h: 2 }, { k: 'xmark', x: 5, y: 3, w: 1, h: 1 }, { k: 'palm', x: 6, y: 3, w: 1, h: 1 }] },
    { id: 'dino', name: 'Thung lũng khủng long', icon: '🦕', desc: 'Chú khủng long cổ dài, ổ trứng bí ẩn và rừng dương xỉ.', cost: 8500, lvl: 10, blocks: [{ k: 'brontosaurus', x: 0, y: 0, w: 4, h: 3 }, { k: 'ferntree', x: 5, y: 0, w: 2, h: 2 }, { k: 'eggnest', x: 5, y: 3, w: 2, h: 1 }] },
    { id: 'volcano', name: 'Núi lửa', icon: '🌋', desc: 'Núi lửa phun khói, hồ dung nham đỏ rực và đá obsidian.', cost: 11000, lvl: 11, blocks: [{ k: 'volcano', x: 3, y: 0, w: 4, h: 3 }, { k: 'hut', x: 0, y: 0, w: 2, h: 2 }, { k: 'lavapool', x: 0, y: 3, w: 3, h: 2 }, { k: 'obsidian', x: 5, y: 3, w: 2, h: 1 }] },
    { id: 'cyber', name: 'Thành phố tương lai', icon: '🌆', desc: 'Toà tháp neon, xe bay và chú robot thân thiện.', cost: 22000, lvl: 13, blocks: [{ k: 'neontower', x: 0, y: 0, w: 2, h: 3 }, { k: 'hovercar', x: 3, y: 0, w: 2, h: 2 }, { k: 'robot', x: 5, y: 2, w: 2, h: 2 }, { k: 'hologram', x: 3, y: 3, w: 1, h: 1 }] }
  ];
  ZONES.forEach(function (z, zi) {
    z.i = zi; z.cols = BASEC; z.rows = BASER; z.cells = BASEC * BASER; z.mask = new Array(BASEC * BASER).fill(0);
    z.blocks.forEach(function (b) { if (b.nb) return; for (var yy = b.y; yy < b.y + b.h; yy++) for (var xx = b.x; xx < b.x + b.w; xx++) z.mask[yy * BASEC + xx] = 1; });
    z.plots = z.mask.filter(function (m) { return !m; }).length;   // số ô trống ở đất gốc
  });
  // ── Cảnh phụ có sẵn rải trên vùng đất mở rộng (cây, bụi, đá, hàng rào, lối đi…): chiếm ô cố định, học sinh trang trí thêm vào các ô còn trống ──
  // [kiểu, rộng, cao, trọng số]; kiểu nào cũng có hình vẽ trong garden-world(2).js
  var DEC_BASE = [['ptree', 1, 1, 5], ['pbush', 1, 1, 4], ['prock', 1, 1, 3], ['pflower', 1, 1, 3], ['fenceh', 3, 1, 2], ['fencev', 1, 3, 2], ['pathh', 4, 1, 1], ['pathv', 1, 3, 1], ['plamp', 1, 1, 1]];
  var DECOR_KINDS = {
    farm: [['ptree', 1, 1, 3], ['pbush', 1, 1, 3], ['haystack', 1, 1, 4], ['scarecrow', 1, 1, 1], ['cropfield', 3, 2, 2], ['fenceh', 3, 1, 3], ['fencev', 1, 3, 2], ['pathh', 4, 1, 1], ['pflower', 1, 1, 2]],
    winter: [['snowpine', 1, 1, 6], ['prock', 1, 1, 3], ['pbush', 1, 1, 3], ['snowman', 1, 1, 1], ['fenceh', 3, 1, 2], ['fencev', 1, 3, 1], ['pathh', 4, 1, 1, 1], ['pathv', 1, 3, 1, 1]],
    beach: [['palm', 1, 1, 5], ['prock', 1, 1, 3], ['pbush', 1, 1, 2], ['fenceh', 3, 1, 2], ['plamp', 1, 1, 1], ['pflower', 1, 1, 2]],
    magic: [['crystals', 1, 1, 4], ['pmush', 1, 1, 5], ['prock', 1, 1, 2], ['plamp', 1, 1, 2], ['pathh', 4, 1, 1], ['pathv', 1, 3, 1]],
    sakura: [['sakuratree', 2, 2, 2], ['lantern', 1, 1, 3], ['pbush', 1, 1, 3], ['prock', 1, 1, 2], ['fenceh', 3, 1, 2], ['fencev', 1, 3, 1], ['pathh', 4, 1, 2], ['pathv', 1, 3, 1]],
    autumn: [['mapletree', 2, 2, 2], ['leafpile', 1, 1, 4], ['ptree', 1, 1, 3], ['pbush', 1, 1, 2], ['pumpkinpatch', 2, 2, 1], ['fenceh', 3, 1, 2], ['pathh', 4, 1, 1], ['pathv', 1, 3, 1]],
    mountain: [['snowpine', 1, 1, 4], ['prock', 1, 1, 6], ['ptree', 1, 1, 2], ['flagpole', 1, 1, 1], ['fenceh', 3, 1, 2], ['pathh', 4, 1, 1], ['pbush', 1, 1, 2]],
    desert: [['cactus', 1, 1, 5], ['palm', 1, 1, 3], ['prock', 1, 1, 4], ['tent', 2, 2, 1], ['fenceh', 3, 1, 1], ['pbush', 1, 1, 2]],
    candy: [['lollipop', 1, 1, 5], ['pgum', 1, 1, 5], ['cupcake', 2, 2, 1], ['fenceh', 3, 1, 2], ['fencev', 1, 3, 2], ['pathh', 4, 1, 1], ['pathv', 1, 3, 1]],
    ocean: [['seaweed', 1, 2, 5], ['pcoral', 1, 1, 6], ['prock', 1, 1, 3], ['treasure', 1, 1, 1]],
    sky: [['pcloud', 1, 1, 7], ['balloon', 1, 2, 1], ['fenceh', 3, 1, 1], ['fencev', 1, 3, 1]],
    space: [['prock', 1, 1, 5], ['crystals', 1, 1, 3], ['satellite', 1, 1, 1], ['crater', 2, 2, 1], ['plamp', 1, 1, 2]],
    bamboo: [['pbamboo', 1, 1, 6], ['ptree', 1, 1, 2], ['prock', 1, 1, 3], ['pbush', 1, 1, 2], ['fenceh', 3, 1, 2], ['pathh', 4, 1, 1], ['pathv', 1, 3, 1]],
    savanna: [['ptree', 1, 1, 3], ['pbush', 1, 1, 4], ['prock', 1, 1, 4], ['haystack', 1, 1, 2], ['fenceh', 3, 1, 2], ['pathh', 4, 1, 1], ['pflower', 1, 1, 1]],
    jungle: [['pfern', 1, 1, 6], ['ptree', 1, 1, 4], ['pbush', 1, 1, 3], ['bigflower', 1, 1, 2], ['prock', 1, 1, 2], ['pathh', 4, 1, 1]],
    village: [['pbarrel', 1, 1, 3], ['ptree', 1, 1, 3], ['pbush', 1, 1, 2], ['fenceh', 3, 1, 3], ['fencev', 1, 3, 2], ['pathh', 4, 1, 2], ['pathv', 1, 3, 2], ['plamp', 1, 1, 2], ['haystack', 1, 1, 1]],
    funfair: [['plamp', 1, 1, 3], ['pflower', 1, 1, 3], ['pbush', 1, 1, 2], ['fenceh', 3, 1, 2], ['pathh', 4, 1, 2], ['pathv', 1, 3, 2], ['pbarrel', 1, 1, 1], ['balloon', 1, 2, 1]],
    arctic: [['snowpine', 1, 1, 5], ['pice', 1, 1, 6], ['prock', 1, 1, 3], ['snowman', 1, 1, 1], ['penguins', 2, 1, 1]],
    pirate: [['palm', 1, 1, 5], ['prock', 1, 1, 3], ['pbarrel', 1, 1, 3], ['xmark', 1, 1, 1], ['pbush', 1, 1, 2], ['fenceh', 3, 1, 1]],
    dino: [['pfern', 1, 1, 6], ['ptree', 1, 1, 3], ['prock', 1, 1, 4], ['eggnest', 2, 1, 1], ['pbush', 1, 1, 2]],
    volcano: [['plava', 1, 1, 5], ['prock', 1, 1, 5], ['obsidian', 2, 1, 1], ['plamp', 1, 1, 1]],
    cyber: [['pneon', 1, 1, 4], ['plamp', 1, 1, 3], ['hologram', 1, 1, 1], ['fenceh', 3, 1, 1], ['pathh', 4, 1, 2], ['pathv', 1, 3, 2]]
  };
  function genDecor(z) {
    var out = [], used = new Array(MAXC * MAXR).fill(0), kinds = DECOR_KINDS[z.id] || DEC_BASE, tw = 0, i, L, t, k, r;
    kinds.forEach(function (x) { tw += x[3]; });
    z.dmask = new Array(MAXC * MAXR).fill(0); z.decorUpTo = [0];
    for (L = 1; L < LAND.length; L++) {
      var pv = LAND[L - 1], cu = LAND[L], seed = z.i * 7919 + L * 131 + 17, rnd = function () { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
      var newCells = cu.cells - pv.cells, target = Math.round(newCells * 0.2), got = 0, tries = 0;
      while (got < target && tries++ < 500) {
        r = rnd() * tw; for (i = 0; i < kinds.length; i++) { r -= kinds[i][3]; if (r <= 0) break; } k = kinds[Math.min(i, kinds.length - 1)];
        var w = k[1], h = k[2], x = Math.floor(rnd() * (cu.c - w + 1)), y = Math.floor(rnd() * (cu.r - h + 1)), ok = true, dx, dy;
        if (!(x + w > pv.c || y + h > pv.r)) continue;                  // phải nằm hẳn trong phần đất mới ở mức này
        for (dy = -1; dy <= h && ok; dy++) for (dx = -1; dx <= w && ok; dx++) { var cx = x + dx, cy = y + dy; if (cx < 0 || cy < 0 || cx >= MAXC || cy >= MAXR) continue; if (cx < BASEC && cy < BASER) { if (dx >= 0 && dx < w && dy >= 0 && dy < h) ok = false; continue; } if (used[cy * MAXC + cx]) ok = false; }
        if (!ok) continue;
        // không chiếm ô nào đã thuộc đất của mức trước (đã có thể có đồ của học sinh)
        for (dy = 0; dy < h && ok; dy++) for (dx = 0; dx < w; dx++) if (x + dx < pv.c && y + dy < pv.r) ok = false;
        if (!ok) continue;
        for (dy = 0; dy < h; dy++) for (dx = 0; dx < w; dx++) { used[(y + dy) * MAXC + x + dx] = 1; z.dmask[(y + dy) * MAXC + x + dx] = 1; }
        var b = { k: k[0], x: x, y: y, w: w, h: h, L: L, th: z.id }; if (k[4]) b.snow = 1; out.push(b); got += w * h;
      }
      z.decorUpTo[L] = z.decorUpTo[L - 1] + got;
    }
    z.decor = out;
  }
  ZONES.forEach(genDecor);
  var ZBY = {}; ZONES.forEach(function (z) { ZBY[z.id] = z; });
  var TOTAL = ZONES.length * PER;
  // Kích thước đất hiện tại của một khu theo mức mở rộng
  function landOf(lv) { return LAND[Math.max(0, Math.min(LAND.length - 1, lv | 0))]; }
  // Các ô mà một công trình lớn đặt tại ô i sẽ chiếm (null nếu tràn ra ngoài đất đã mở của khu)
  function footprint(i, it, lv) {
    var w = (it && it.w) || 1, h = (it && it.h) || 1, z = Math.floor(i / PER), c = i % PER, col = c % MAXC, row = Math.floor(c / MAXC), out = [], dx, dy, ld = landOf(lv);
    if (z < 0 || z >= ZONES.length || col + w > ld.c || row + h > ld.r) return null;
    for (dy = 0; dy < h; dy++) for (dx = 0; dx < w; dx++) out.push(z * PER + (row + dy) * MAXC + col + dx);
    return out;
  }
  function zoneOfCell(i) { return ZONES[Math.floor(i / PER)] || null; }
  // Ô thuộc phong cảnh có sẵn (chỉ nằm trong vùng đất gốc 7×5)
  function isBlocked(i) { var z = zoneOfCell(i); if (!z) return true; var c = i % PER, col = c % MAXC, row = Math.floor(c / MAXC); if (col < BASEC && row < BASER) return !!z.mask[row * BASEC + col]; return !!z.dmask[c]; }
  // Số ô trống (xây được) của khu ở một mức đất
  function plotsOf(z, lv) { var l = landOf(lv); return z.plots + (l.cells - BASEC * BASER) - (z.decorUpTo[Math.max(0, Math.min(LAND.length - 1, lv | 0))] || 0); }
  // Ô có nằm trong đất đã mở của khu không
  function inLand(i, lv) { var c = i % PER, col = c % MAXC, row = Math.floor(c / MAXC), ld = landOf(lv); return i >= 0 && i < TOTAL && col < ld.c && row < ld.r; }
  // Chuyển chỉ số ô của vườn đời cũ (mỗi khu 7×5 = 35 ô) sang chỉ số mới
  function remapOld(i) { var z = Math.floor(i / 35), c = i % 35; return z * PER + Math.floor(c / BASEC) * MAXC + (c % BASEC); }
  var SIZES = [{ n: 5, cost: 0 }, { n: 6, cost: 80 }, { n: 7, cost: 200 }, { n: 8, cost: 400 }, { n: 9, cost: 700 }, { n: 10, cost: 1000 }];
  var RULES = {
    waterFree: 10,        // lượt tưới miễn phí mỗi ngày
    waterMax: 3,          // số lần tưới tối đa cho mỗi cây trong một chu kỳ
    waterCut: 0.25,       // mỗi lần tưới rút ngắn 25% thời gian lớn
    yieldCapDay: 40,      // xu tối đa nhận từ thu hoạch mỗi ngày
    feedXu: 1, feedCapDay: 5, // cho thú cưng ăn: +1 xu / con, tối đa 5 xu mỗi ngày
    quizWater: 1, quizCapDay: 150, // trả lời đúng: +1 lượt tưới và được lật thẻ thưởng (xem FLIP); tối đa 150 câu đúng được thưởng mỗi ngày
    maxPets: 6, sellBack: 0.5,
    boostRate: 0.5, boostMin: 3 // cho cây lớn ngay: 0,5 xu mỗi phút còn lại (cây chờ càng lâu càng tốn), tối thiểu 3 xu
  };
  // Thẻ thưởng khi trả lời đúng: lật 1 trong 3 thẻ. Thẻ thường 20–100 xu; thẻ lớn +500 / +1000 xu; thẻ nhân ×2 / ×3 TOÀN BỘ số xu hiện có (không giới hạn trên);
  // thẻ quà: phiếu mua miễn phí (hoa/cây/đồ trang trí/công trình/thú cưng), một thú cưng, một khu mới, lượt tưới, phép cho cây lớn ngay.
  var FLIP = { cards: 3, normal: [[20, 34], [30, 26], [40, 16], [50, 10], [60, 6], [80, 3.5], [100, 1.5]],
    types: [['coin', 44], ['b500', 11], ['b1000', 5], ['x2', 10], ['x3', 6], ['free_plant', 6], ['free_tree', 3], ['free_deco', 3], ['free_big', 2], ['free_pet', 2], ['pet', 2], ['zone', 2], ['water', 3], ['boost', 3]],
    big: { b500: 500, b1000: 1000 }, mult: { x2: 2, x3: 3 }, multMin: 100,
    free: { free_plant: { n: 5, cls: 'plant', label: 'hoa' }, free_tree: { n: 2, cls: 'tree', label: 'cây' }, free_deco: { n: 3, cls: 'deco', label: 'đồ trang trí' }, free_big: { n: 1, cls: 'big', label: 'công trình lớn' }, free_pet: { n: 1, cls: 'pet', label: 'thú cưng' } },
    water: 10, boost: 1 };
  var BY = {}; ITEMS.forEach(function (i) { BY[i.id] = i; });
  var PBY = {}; PETS.forEach(function (i) { PBY[i.id] = i; });

  function levelOf(beauty) { var l = 1; LEVELS.forEach(function (x) { if (beauty >= x.at) l = x.n; }); return l; }
  function nextLevel(beauty) { for (var i = 0; i < LEVELS.length; i++) if (beauty < LEVELS[i].at) return LEVELS[i]; return null; }
  function petSlots(level) { return Math.min(RULES.maxPets, 1 + Math.floor(level / 2) + 1); }
  // Giai đoạn cây: 0 hạt, 1 mầm, 2 nụ, 3 nở. Thời gian lớn bị rút ngắn theo số lần tưới.
  function growMs(item, waters) { return item.grow * MIN * (1 - Math.min(waters || 0, RULES.waterMax) * RULES.waterCut); }
  function stageOf(item, tile, now) {
    if (!item || (item.kind !== 'plant' && item.kind !== 'tree')) return 3;
    var tot = growMs(item, tile.w), el = Math.max(0, now - (tile.at || 0)), r = tot > 0 ? el / tot : 1;
    return r >= 1 ? 3 : r >= 0.6 ? 2 : r >= 0.25 ? 1 : 0;
  }
  function boostCost(ms) { return Math.max(RULES.boostMin, Math.ceil(ms / MIN * RULES.boostRate)); }
  function remainMs(item, tile, now) { return Math.max(0, growMs(item, tile.w) - (now - (tile.at || 0))); }
  function beautyOf(state) {
    var b = 0; (state.tiles || []).forEach(function (t) { if (t && BY[t.k]) b += BY[t.k].b; });
    (state.pets || []).forEach(function (p) { b += 5; }); b += Math.max(0, ((state.zones || []).length || 1) - 1) * 8;
    Object.keys(state.land || {}).forEach(function (k) { b += (state.land[k] | 0) * 2; }); return b;
  }

  var API = { ITEMS: ITEMS, PETS: PETS, LEVELS: LEVELS, SIZES: SIZES, RULES: RULES, FLIP: FLIP, ZONES: ZONES, ZBY: ZBY, TOTAL: TOTAL, PER: PER, COLS: COLS, ROWS: ROWS, BASEC: BASEC, BASER: BASER, MAXC: MAXC, MAXR: MAXR, LAND: LAND, landOf: landOf, plotsOf: plotsOf, inLand: inLand, remapOld: remapOld, zoneOfCell: zoneOfCell, footprint: footprint, isBlocked: isBlocked, BY: BY, PBY: PBY, levelOf: levelOf, nextLevel: nextLevel, petSlots: petSlots, growMs: growMs, stageOf: stageOf, remainMs: remainMs, boostCost: boostCost, beautyOf: beautyOf, MIN: MIN };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenData = API;
})(typeof window !== 'undefined' ? window : this);
