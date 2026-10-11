/* EWT Garden — kho đặc sản (phần G): 10 NÔNG TRẠI đặc trưng của các quốc gia (Việt Nam, Hà Lan, Thuỵ Sĩ, Úc, Mỹ, Mexico, Argentina, Mông Cổ, Pháp, Kenya).
   Mỗi nông trại: 5 cây trồng · 5 cây · 5 trang trí · 5 CHUỒNG (mỗi chuồng nuôi MỘT loài) · 5 vật nuôi. Vật nuôi có thể thả VÀO chuồng đúng loài hoặc để chạy NGOÀI chuồng. */
(function (root) {
  'use strict';
  var Cat = root.EWTGardenCatalog || (typeof require === 'function' ? require('./garden-catalog.js') : null); if (!Cat) return;
  // chuồng: [tên, rộng, cao, kiểu chuồng, màu tường, màu mái, màu hàng rào, '', tinh xảo, { pen: loài }]
  function pen(n, sp, style, wall, roof, fence, tier, w, h) { return [n, w || 3, h || 2, style, wall, roof, fence, '', tier, { pen: sp }]; }
  // vật nuôi: [tên, mẫu thú, màu 1, màu 2, phụ kiện, tinh xảo, { sp: loài }]
  function pet(n, art, c1, c2, tier, sp, acc) { return [n, art, c1, c2, acc || '', tier, { sp: sp || art }]; }

  /* ═════ 1. VIỆT NAM — nông trại lúa nước ═════ */
  Cat.add('farmvn', { map: {},
    f: [['Lúa nước', 'reed', '#E8C75A', '#8BB04A', 2], ['Bắp ngô', 'plume', '#F2C94C', '#4F8A3A', 2], ['Sen đồng', 'lotus', '#FF9EC4', '#FFFFFF', 3], ['Rau muống', 'fern', '#4FAE62', '#2E7D4F', 1], ['Dưa hấu', 'berry', '#E23B3B', '#4F8A3A', 3]],
    t: [['Cây chuối', 'tropic', '#4FAE62', '#8A5A2E', 2], ['Cây dừa', 'palm', '#2E9B4A', '#8A5A2E', 3], ['Cây xoài', 'round', '#3F8A3A', '#F2A32C', 3, { fruit: 1 }], ['Cây đa làng', 'umbrella', '#3F8A3A', '#7A5A3A', 4], ['Bụi tre', 'willow', '#7BC24A', '#5A8A2E', 2]],
    d: [['Bồ lúa rơm', 'barrel', 'leaf', '#C9A66A', '#E8C75A', 2], ['Chum nước mưa', 'vase', 'drop', '#C98A4B', '#4F9ED8', 1], ['Giỏ cá đồng', 'crate', 'fish', '#C9A66A', '#3C9A8A', 2], ['Bù nhìn rơm', 'totem', 'none', '#E8C75A', '#8A5A2E', 2], ['Đèn lồng đồng quê', 'lamp', 'none', '#E23B3B', '#F2C94C', 3]],
    b: [pen('Chuồng trâu', 'buffalo', 'penshed', '#C9A66A', '#A8742E', '#8A5A2E', 3), pen('Chuồng bò', 'cow', 'pen', '#D9B47A', '#B8532E', '#8A5A2E', 2), pen('Chuồng heo', 'pig', 'pen', '#E8C9A0', '#8A6A4A', '#8A5A2E', 2), pen('Chuồng gà', 'hen', 'pencoop', '#E0B070', '#B8532E', '#8A5A2E', 2, 2, 2), pen('Ao vịt', 'duck', 'penpond', '#D9B47A', '#9A7A3A', '#8A5A2E', 3, 2, 2)],
    p: [pet('Trâu nước', 'buffalo', '#5A5048', '#E8DCC0', 3), pet('Bò vàng', 'cow', '#C98A4B', '#8A5A2E', 2, 'cow'), pet('Heo ỉ', 'pig', '#8A8A92', '#5A5A62', 2), pet('Gà ri', 'rooster', '#C98A4B', '#D9482E', 2, 'hen'), pet('Vịt cỏ', 'duck', '#F4EAD8', '#F2A32C', 2)] });

  /* ═════ 2. HÀ LAN — trang trại bò sữa ═════ */
  Cat.add('farmnl', { map: {},
    f: [['Hoa tulip', 'cup', '#E5334B', '#F2C94C', 2], ['Cà rốt', 'fern', '#F2842E', '#4FAE62', 2], ['Củ cải đường', 'rosette', '#8E3A6A', '#4FAE62', 2], ['Hoa lục bình', 'bell', '#5B8DEF', '#B8D8FF', 3], ['Cỏ linh lăng', 'spike', '#8E5FC4', '#4F8A3A', 2]],
    t: [['Cây liễu bờ kênh', 'willow', '#6FAE4A', '#8A5A2E', 2], ['Cây dương', 'cypress', '#5A9A4A', '#6A5A3A', 2], ['Cây táo', 'round', '#4F9A3A', '#E5334B', 3, { fruit: 1 }], ['Cây sồi', 'round', '#4A8A3A', '#6A4A2A', 3], ['Cây bạch dương', 'birch', '#7FB24A', '#E8E4D8', 2]],
    d: [['Can sữa', 'barrel', 'drop', '#C9D0D9', '#8A94A8', 2], ['Cối xay gió nhỏ', 'pedestal', 'wheel', '#F4EAD8', '#B8532E', 3], ['Đôi guốc gỗ', 'planter', 'flower', '#E8B060', '#E5334B', 2], ['Cổng kênh đào', 'arch', 'none', '#8A5A2E', '#C9A66A', 3], ['Bánh phô mai', 'chest', 'none', '#F2C94C', '#E8A82E', 2]],
    b: [pen('Chuồng bò sữa', 'cow', 'pen', '#B8452E', '#6A5A4A', '#F4EAD8', 3), pen('Chuồng dê', 'goat', 'pen', '#E8DCC0', '#8A6A4A', '#8A5A2E', 2), pen('Chuồng cừu', 'sheep', 'penshed', '#E8DCC0', '#6B8A9A', '#F4EAD8', 2), pen('Chuồng ngựa Friesian', 'horse', 'pen', '#3A5A8A', '#4A4A52', '#F4EAD8', 4), pen('Chuồng gà', 'hen', 'pencoop', '#E5334B', '#6A5A4A', '#F4EAD8', 2, 2, 2)],
    p: [pet('Bò sữa Hà Lan', 'cow', '#FFFFFF', '#2A2A34', 3, 'cow', 'spots'), pet('Dê Hà Lan', 'goat', '#F4EAD8', '#C9B88A', 2), pet('Cừu Texel', 'sheep', '#FFFFFF', '#D8C8B0', 2), pet('Ngựa Friesian', 'horse', '#2A2A34', '#1A1A22', 4), pet('Gà Hà Lan', 'rooster', '#F2842E', '#E5334B', 2, 'hen')] });

  /* ═════ 3. THUỴ SĨ — nông trại núi Alps ═════ */
  Cat.add('farmch', { map: {},
    f: [['Hoa edelweiss', 'star', '#FFFFFF', '#E8E4D8', 3, 6], ['Hoa long đởm Alps', 'bell', '#2B6BC8', '#8EC8FF', 3], ['Hoa tử la lan', 'daisy', '#B66CFF', '#FFFFFF', 2], ['Khoai tây', 'rosette', '#C9A66A', '#4FAE62', 1], ['Cỏ Alps', 'reed', '#8BC24A', '#4F8A3A', 1]],
    t: [['Thông Alps', 'conifer', '#2F6A4A', '#8A5A2E', 2], ['Thông tuyết', 'icetree', '#CFE8F0', '#8A94A8', 3], ['Cây thông mác', 'conifer', '#3A7A4A', '#6A5A3A', 3], ['Cây phong núi', 'maple', '#C8553A', '#8A5A2E', 3], ['Cây thanh lương trà', 'round', '#4F8A3A', '#8E3A3A', 2, { fruit: 1 }]],
    d: [['Chuông bò Alps', 'banner', 'bell', '#C9A22A', '#8A5A2E', 2], ['Thùng phô mai', 'barrel', 'none', '#E8C75A', '#8A5A2E', 2], ['Kèn alphorn', 'totem', 'note', '#C9A66A', '#8A5A2E', 3], ['Xe đẩy sữa', 'crate', 'drop', '#C98A4B', '#E8F0F4', 2], ['Biển chỉ đường núi', 'sign', 'mountain', '#C9A66A', '#8A5A2E', 2]],
    b: [pen('Chuồng bò nâu', 'cow', 'pen', '#C98A4B', '#8A3A2E', '#F4EAD8', 3), pen('Chuồng dê núi', 'goat', 'pen', '#E8DCC0', '#6A4A2E', '#8A5A2E', 2), pen('Chuồng cừu Alps', 'sheep', 'penshed', '#E8DCC0', '#7A5A3A', '#8A5A2E', 2), pen('Chuồng ngựa Freiberger', 'horse', 'penshed', '#C9A66A', '#8A3A2E', '#8A5A2E', 4), pen('Chuồng thỏ', 'bunny', 'pencoop', '#E8C9A0', '#8A3A2E', '#8A5A2E', 2, 2, 2)],
    p: [pet('Bò nâu Alps', 'cow', '#B8703A', '#E8DCC0', 3), pet('Dê Saanen', 'goat', '#F4EAD8', '#C9B88A', 3), pet('Cừu núi Alps', 'sheep', '#EDE4D0', '#8A6A4A', 2), pet('Ngựa Freiberger', 'horse', '#C98A4B', '#F4EAD8', 4), pet('Thỏ núi', 'bunny', '#F4EAD8', '#E8B8C0', 2)] });

  /* ═════ 4. ÚC — trạm cừu vùng outback ═════ */
  Cat.add('farmau', { map: {},
    f: [['Hoa bông len Kangaroo paw', 'plume', '#E5334B', '#4FAE62', 3], ['Hoa bạch đàn', 'pom', '#FF5C7A', '#F2C94C', 3], ['Hoa cúc vàng Úc', 'daisy', '#FFD23F', '#C98A00', 2], ['Lúa mì', 'reed', '#E8C75A', '#C9A03A', 1], ['Hoa banksia', 'spike', '#E8742E', '#8A5A2E', 3]],
    t: [['Cây bạch đàn', 'round', '#6A9A5A', '#B8AC9C', 2], ['Cây thông Wollemi', 'conifer', '#4F8A4A', '#8A5A2E', 4], ['Cây keo vàng', 'blossom', '#F2C94C', '#6A9A4A', 3], ['Cây chai (bottle)', 'baobab', '#6A9A4A', '#B8AC9C', 3], ['Cây tràm', 'willow', '#7FA84A', '#E8E4D8', 2]],
    d: [['Hòm thư outback', 'chest', 'none', '#C8553A', '#8A5A2E', 2], ['Cối gió bơm nước', 'pedestal', 'wheel', '#C9D0D9', '#8A94A8', 3], ['Mũ da cao bồi Úc', 'planter', 'none', '#C9A66A', '#8A5A2E', 2], ['Biển báo kangaroo', 'sign', 'paw', '#F2C94C', '#2A2A34', 2], ['Bình nước da', 'vase', 'drop', '#C98A4B', '#4F9ED8', 1]],
    b: [pen('Trạm cừu merino', 'sheep', 'penshed', '#C98A4B', '#8A3A2E', '#8A5A2E', 3), pen('Chuồng bò Úc', 'cow', 'pen', '#C9A66A', '#8A5A4A', '#8A5A2E', 3), pen('Chuồng ngựa stockhorse', 'horse', 'pen', '#B8703A', '#6A4A2E', '#8A5A2E', 3), pen('Bãi đà điểu emu', 'emu', 'penshed', '#D9B47A', '#8A6A4A', '#8A5A2E', 4), pen('Chuồng dê', 'goat', 'pen', '#E8DCC0', '#8A5A4A', '#8A5A2E', 2)],
    p: [pet('Cừu merino', 'sheep', '#F4EAD8', '#C9A66A', 2), pet('Bò Úc', 'cow', '#B8703A', '#E8DCC0', 3), pet('Ngựa stockhorse', 'horse', '#B8703A', '#2A2A34', 3), pet('Đà điểu emu', 'emu', '#8A6A4A', '#5A4A3A', 4), pet('Dê Úc', 'goat', '#C9A66A', '#8A6A4A', 2)] });

  /* ═════ 5. HOA KỲ — trang trại (ranch) miền Tây ═════ */
  Cat.add('farmus', { map: {},
    f: [['Hoa hướng dương', 'daisy', '#FFD23F', '#8A5A2E', 2], ['Bắp ngô Mỹ', 'plume', '#F2C94C', '#4F8A3A', 2], ['Hoa lúa mì', 'reed', '#E8C75A', '#C9A03A', 1], ['Hoa bluebonnet', 'spike', '#4A6AD8', '#FFFFFF', 3], ['Cây bí ngô', 'berry', '#F2842E', '#4F8A3A', 3]],
    t: [['Cây sồi Mỹ', 'round', '#4A8A3A', '#6A4A2A', 3], ['Cây dương cottonwood', 'umbrella', '#7FB24A', '#B8AC9C', 2], ['Cây táo Mỹ', 'round', '#4F9A3A', '#E5334B', 3, { fruit: 1 }], ['Cây hồ đào', 'round', '#5A8A3A', '#8A5A2E', 3], ['Cây thông ponderosa', 'conifer', '#3A7A4A', '#8A5A2E', 3]],
    d: [['Hòm thư nông trại', 'chest', 'none', '#2B6BC8', '#E5334B', 2], ['Tháp nước', 'pedestal', 'drop', '#C98A4B', '#8A94A8', 3], ['Bù nhìn ngô', 'totem', 'none', '#E8C75A', '#C8553A', 2], ['Xe đẩy cỏ khô', 'crate', 'leaf', '#C98A4B', '#E8C75A', 2], ['Cờ sao sọc nhỏ', 'banner', 'star', '#E5334B', '#FFFFFF', 3]],
    b: [pen('Chuồng bò Texas', 'cow', 'pen', '#B8452E', '#6A3A2E', '#F4EAD8', 3), pen('Chuồng ngựa cao bồi', 'horse', 'pen', '#C98A4B', '#6A3A2E', '#F4EAD8', 3), pen('Chuồng gà tây', 'turkey', 'pencoop', '#E8C9A0', '#8A3A2E', '#8A5A2E', 3, 2, 2), pen('Chuồng lợn', 'pig', 'pen', '#D9B47A', '#7A5A4A', '#8A5A2E', 2), pen('Bãi bò rừng bison', 'bison', 'penshed', '#C9A66A', '#6A4A2E', '#8A5A2E', 4)],
    p: [pet('Bò Texas Longhorn', 'cow', '#B8703A', '#F4EAD8', 3), pet('Ngựa Mustang', 'horse', '#8A5A2E', '#2A2A34', 3), pet('Gà tây', 'turkey', '#8A5A2E', '#E5334B', 3), pet('Lợn Duroc', 'pig', '#C8553A', '#8A3A2E', 2), pet('Bò rừng bison', 'bison', '#6A4A2E', '#8A6A4A', 4)] });

  /* ═════ 6. MEXICO — hacienda ═════ */
  Cat.add('farmmx', { map: {},
    f: [['Hoa vạn thọ cempasúchil', 'pom', '#F2842E', '#F2C94C', 3], ['Ngô Mexico', 'plume', '#F2C94C', '#4F8A3A', 2], ['Hoa dahlia', 'rosette', '#E5334B', '#F2C94C', 3], ['Ớt jalapeño', 'berry', '#4FAE62', '#2E7D4F', 2], ['Hoa xương rồng nở', 'star', '#FF5C7A', '#F2C94C', 3, 6]],
    t: [['Xương rồng nopal', 'cactus', '#4FAE62', '#E5334B', 2], ['Cây agave', 'joshua', '#6A9A8A', '#8A5A2E', 3], ['Cây bơ', 'round', '#3F7A3A', '#7AAE3A', 3, { fruit: 1 }], ['Cây phượng Mexico', 'umbrella', '#E5334B', '#2E9B4A', 3], ['Cây cọ', 'palm', '#2E9B4A', '#8A5A2E', 2]],
    d: [['Piñata nhiều màu', 'banner', 'star', '#E5334B', '#F2C94C', 3], ['Mũ sombrero', 'planter', 'none', '#F2C94C', '#E5334B', 2], ['Bình gốm talavera', 'vase', 'flower', '#2B6BC8', '#FFFFFF', 3], ['Giếng hacienda', 'well', 'none', '#E8B070', '#8A5A2E', 3], ['Hàng ớt khô', 'sign', 'flame', '#E5334B', '#8A5A2E', 2]],
    b: [pen('Chuồng ngựa hacienda', 'horse', 'pen', '#F2C0A0', '#B8532E', '#8A5A2E', 4), pen('Chuồng lừa', 'donkey', 'penshed', '#E8B070', '#B8532E', '#8A5A2E', 2), pen('Chuồng gà tây guajolote', 'turkey', 'pencoop', '#F2A0C0', '#2B6BC8', '#8A5A2E', 3, 2, 2), pen('Chuồng dê', 'goat', 'pen', '#E8B070', '#8A5A4A', '#8A5A2E', 2), pen('Chuồng heo', 'pig', 'pen', '#F2C94C', '#B8532E', '#8A5A2E', 2)],
    p: [pet('Ngựa Azteca', 'horse', '#8A5A2E', '#2A2A34', 4), pet('Lừa Mexico', 'donkey', '#8A8A92', '#5A5A62', 2), pet('Gà tây bản địa', 'turkey', '#2A5A4A', '#E5334B', 3), pet('Dê xứ nóng', 'goat', '#C9A66A', '#8A6A4A', 2), pet('Heo Pelón', 'pig', '#E8B8A8', '#C98A7A', 2)] });

  /* ═════ 7. ARGENTINA — estancia trên đồng cỏ pampas ═════ */
  Cat.add('farmar', { map: {},
    f: [['Cỏ pampas', 'reed', '#F4EAD0', '#C9B88A', 2], ['Hoa ceibo', 'plume', '#D61F3A', '#8E1228', 3], ['Hạt đậu nành', 'fern', '#8BC24A', '#4F8A3A', 1], ['Hoa cúc Patagonia', 'daisy', '#FFD23F', '#C98A00', 2], ['Hoa lạc tiên', 'star', '#8E5FC4', '#FFFFFF', 3, 5]],
    t: [['Cây ombú', 'umbrella', '#4A8A3C', '#8A5A2E', 4], ['Cây quebracho', 'round', '#5E8A4A', '#8A5A2E', 3], ['Cây liễu Pampa', 'willow', '#7FA84A', '#8A5A2E', 2], ['Cây bạch đàn', 'round', '#6A9A5A', '#B8AC9C', 2], ['Cây đào', 'blossom', '#F2A0C0', '#8A5A2E', 3]],
    d: [['Lò nướng asado', 'chest', 'flame', '#8A94A8', '#E8742E', 3], ['Bầu trà mate', 'vase', 'leaf', '#C98A4B', '#4FAE62', 2], ['Yên ngựa gaucho', 'bench', 'none', '#8A5A2E', '#C9A66A', 3], ['Cổng estancia', 'arch', 'none', '#F4EAD8', '#8A5A2E', 3], ['Tù và chăn gia súc', 'totem', 'note', '#C9A66A', '#8A5A2E', 2]],
    b: [pen('Chuồng bò Angus', 'cow', 'pen', '#F4EAD8', '#8A3A2E', '#8A5A2E', 3), pen('Chuồng ngựa criollo', 'horse', 'pen', '#E8DCC0', '#B8532E', '#8A5A2E', 4), pen('Chuồng cừu Patagonia', 'sheep', 'penshed', '#E8DCC0', '#6B8A9A', '#8A5A2E', 2), pen('Bãi lạc đà llama', 'llama', 'penshed', '#C9A66A', '#8A6A4A', '#8A5A2E', 3), pen('Chuồng heo', 'pig', 'pen', '#E8C9A0', '#8A5A4A', '#8A5A2E', 2)],
    p: [pet('Bò Angus', 'cow', '#2A2A34', '#5A5A62', 3), pet('Ngựa Criollo', 'horse', '#A8703A', '#2A2A34', 4), pet('Cừu Corriedale', 'sheep', '#F4EAD8', '#C9A66A', 2), pet('Lạc đà llama', 'llama', '#F4EAD8', '#C9A878', 3), pet('Heo Pampa', 'pig', '#F2C0B0', '#C98A7A', 2)] });

  /* ═════ 8. MÔNG CỔ — du mục trên thảo nguyên ═════ */
  Cat.add('farmmn', { map: {},
    f: [['Cỏ thảo nguyên', 'reed', '#C8D46A', '#8BAA3A', 1], ['Hoa edelweiss Mông Cổ', 'star', '#FFFFFF', '#E8E4D8', 3, 6], ['Hoa thược dược dại', 'daisy', '#FF8FB8', '#FFE0EC', 2], ['Hoa hành dại', 'pom', '#B66CFF', '#E0C8FF', 2], ['Cỏ ngải', 'spike', '#8AAA7A', '#5A7A4A', 2]],
    t: [['Cây thông Siberia', 'conifer', '#2F6A4A', '#8A5A2E', 2], ['Cây bạch dương', 'birch', '#7FB24A', '#E8E4D8', 2], ['Cây du núi', 'round', '#5A8A3A', '#8A5A2E', 2], ['Cây saxaul sa mạc', 'joshua', '#8AAA6A', '#8A5A2E', 3], ['Cây táo gai', 'round', '#4F8A3A', '#E5334B', 3, { fruit: 1 }]],
    d: [['Cọc buộc ngựa', 'totem', 'none', '#8A5A2E', '#C9A66A', 2], ['Đống đá cầu may ovoo', 'cairn', 'none', '#B8AC9C', '#2B9BD8', 3], ['Túi sữa ngựa', 'barrel', 'drop', '#C98A4B', '#E8F0F4', 2], ['Cung tên Mông Cổ', 'sign', 'none', '#8A5A2E', '#C9A66A', 3], ['Bếp lửa du mục', 'lamp', 'flame', '#8A94A8', '#E8742E', 2]],
    b: [pen('Bãi ngựa thảo nguyên', 'horse', 'penshed', '#C9A66A', '#8A3A2E', '#8A5A2E', 4), pen('Bãi lạc đà hai bướu', 'camel', 'penshed', '#D9B47A', '#8A5A4A', '#8A5A2E', 4), pen('Chuồng cừu bên lều ger', 'sheep', 'penger', '#F4EAD8', '#B8452E', '#8A5A2E', 3), pen('Chuồng dê', 'goat', 'penger', '#F4EAD8', '#2B6BC8', '#8A5A2E', 2), pen('Bãi bò Tây Tạng yak', 'yak', 'pen', '#C9A66A', '#5A4A3A', '#8A5A2E', 4)],
    p: [pet('Ngựa Mông Cổ', 'horse', '#B8703A', '#2A2A34', 4), pet('Lạc đà hai bướu', 'camel', '#C9A66A', '#8A6A4A', 4), pet('Cừu đuôi béo', 'sheep', '#F4EAD8', '#C9A66A', 2), pet('Dê Cashmere', 'goat', '#F4EAD8', '#C9B88A', 3), pet('Bò Tây Tạng yak', 'yak', '#4A3A30', '#8A6A4A', 4)] });

  /* ═════ 9. PHÁP — trang trại Provence ═════ */
  Cat.add('farmfr', { map: {},
    f: [['Hoa oải hương', 'spike', '#8E5FC4', '#4F8A3A', 3], ['Hoa hướng dương Pháp', 'daisy', '#FFD23F', '#8A5A2E', 2], ['Hoa anh túc', 'poppy', '#E5334B', '#2A2A34', 2], ['Nho Pháp', 'berry', '#6A3A8A', '#4F8A3A', 3], ['Dâu tây vườn', 'berry', '#E5334B', '#4F8A3A', 2]],
    t: [['Cây ô liu', 'round', '#8AAA6A', '#8A5A2E', 3, { fruit: 1 }], ['Cây bách Provence', 'cypress', '#3F7A4A', '#6A5A3A', 3], ['Cây anh đào', 'blossom', '#F2A0C0', '#8A5A2E', 3], ['Cây sồi truffle', 'round', '#4A8A3A', '#6A4A2A', 3], ['Cây phong lữ', 'maple', '#C8553A', '#8A5A2E', 2]],
    d: [['Giỏ pho mát', 'crate', 'none', '#C9A66A', '#F2E3B8', 2], ['Xe đạp bánh mì', 'bench', 'wheel', '#E5334B', '#C9A66A', 3], ['Bình rượu vang', 'vase', 'drop', '#6A3A8A', '#C9A66A', 2], ['Cối xay Provence', 'pedestal', 'wheel', '#F4EAD8', '#B8532E', 3], ['Hàng oải hương', 'planter', 'flower', '#8E5FC4', '#C9A66A', 3]],
    b: [pen('Chuồng cừu Provence', 'sheep', 'penshed', '#F2E3B8', '#B8532E', '#8A5A2E', 3), pen('Ao ngỗng', 'goose', 'penpond', '#F4EAD8', '#B8532E', '#8A5A2E', 3, 2, 2), pen('Chuồng heo truffle', 'pig', 'pen', '#E8C9A0', '#B8532E', '#8A5A2E', 3), pen('Chuồng lừa', 'donkey', 'pen', '#E8DCC0', '#B8532E', '#8A5A2E', 2), pen('Chuồng thỏ', 'bunny', 'pencoop', '#F2E3B8', '#B8532E', '#8A5A2E', 2, 2, 2)],
    p: [pet('Cừu Provence', 'sheep', '#F4EAD8', '#8A6A4A', 2), pet('Ngỗng nông trại', 'goose', '#FFFFFF', '#F2A32C', 3), pet('Heo Gascon', 'pig', '#8A8A92', '#5A5A62', 3), pet('Lừa Provence', 'donkey', '#A8A09A', '#6A625A', 2), pet('Thỏ vườn', 'bunny', '#E8DCC0', '#C9A66A', 2)] });

  /* ═════ 10. KENYA — làng chăn nuôi Maasai ═════ */
  Cat.add('farmke', { map: {},
    f: [['Cỏ savanna', 'reed', '#D8C06A', '#A89A3A', 1], ['Hoa lan Kenya', 'orchid', '#FF8A1F', '#FFD23F', 3], ['Ngô trắng', 'plume', '#F4EAD0', '#4F8A3A', 2], ['Hoa cúc trà', 'daisy', '#FFFFFF', '#F2C94C', 2], ['Hoa gừng đỏ', 'spike', '#E5334B', '#FF8A1F', 3]],
    t: [['Cây keo ô', 'umbrella', '#7FA84A', '#8A5A2E', 3], ['Cây bao báp', 'baobab', '#8A7A5A', '#6A5A3A', 4], ['Cây xương rồng candelabra', 'cactus', '#4FAE62', '#8A5A2E', 3], ['Cây cọ doum', 'palm', '#2E9B4A', '#8A5A2E', 2], ['Cây xoài', 'round', '#3F8A3A', '#F2A32C', 3, { fruit: 1 }]],
    d: [['Khiên Maasai', 'banner', 'diamond', '#E5334B', '#2A2A34', 3], ['Vòng cổ hạt Maasai', 'planter', 'pearl', '#2B6BC8', '#E5334B', 3], ['Trống gỗ', 'barrel', 'note', '#8A5A2E', '#C9A66A', 2], ['Bình sữa bầu', 'vase', 'drop', '#C98A4B', '#F4EAD8', 2], ['Rào gai boma', 'sign', 'none', '#8A5A2E', '#C9A66A', 2]],
    b: [pen('Boma bò zebu', 'cow', 'penhut', '#C98A4B', '#D8B060', '#8A5A2E', 3), pen('Boma dê', 'goat', 'penhut', '#B8703A', '#C9A040', '#8A5A2E', 2), pen('Boma cừu', 'sheep', 'penhut', '#C9A66A', '#D8B060', '#8A5A2E', 2), pen('Chuồng lừa', 'donkey', 'penshed', '#C98A4B', '#8A5A2E', '#8A5A2E', 2), pen('Chuồng gà', 'hen', 'pencoop', '#C98A4B', '#D8B060', '#8A5A2E', 2, 2, 2)],
    p: [pet('Bò zebu bướu', 'cow', '#C98A4B', '#F4EAD8', 3), pet('Dê Đông Phi', 'goat', '#C9A66A', '#8A5A2E', 2), pet('Cừu đuôi đỏ', 'sheep', '#E8DCC0', '#8A4A2E', 2), pet('Lừa Kenya', 'donkey', '#8A8A92', '#5A5A62', 2), pet('Gà trống Kenya', 'rooster', '#8A5A2E', '#E5334B', 2, 'hen')] });
})(typeof window !== 'undefined' ? window : this);
