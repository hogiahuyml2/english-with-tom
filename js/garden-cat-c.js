/* EWT Garden — kho đặc sản (phần C): Rừng tre, Thảo nguyên, Rừng nhiệt đới, Làng trung cổ, Công viên giải trí, Bắc Cực, Đảo hải tặc, Thung lũng khủng long, Núi lửa, Thành phố tương lai. */
(function (root) {
  'use strict';
  var Cat = root.EWTGardenCatalog || (typeof require === 'function' ? require('./garden-catalog.js') : null); if (!Cat) return;

  Cat.add('bamboo', { map: { f: ['bamboosprout'], t: ['bambooclump'], d: ['bamboobunch'], b: ['bamboohouse'], p: ['redpanda'] },
    f: [['Lan trúc', 'orchid', '#9AD07A', '#F2E8C8', 3], ['Hoa lau tre', 'plume', '#F2EFD8', '#C9D8A8', 2], ['Cỏ lúa xanh', 'reed', '#B8C97A', '#6FA85A', 1], ['Hoa tre vàng', 'star', '#F2D23F', '#FFFFFF', 3, 6]],
    t: [['Trúc vàng', 'cypress', '#E8C84A', '#8A6A2E', 2], ['Trúc đen', 'cypress', '#3A4A3A', '#6FA85A', 3], ['Tre long đỏ', 'tropic', '#5FB04A', '#C9431F', 3], ['Hóp quân tử', 'willow', '#8FD65A', '#FFFFFF', 3]],
    d: [['Ống tre nước', 'barrel', 'drop', '#9AD07A', '#5AA8F0', 2], ['Chuông gió tre', 'gong', 'bamboo', '#B8A05A', '#6FA85A', 3], ['Đèn lồng tre', 'lamp', 'bamboo', '#8A6A2E', '#FFE9A8', 3], ['Cầu tre nhỏ', 'arch', 'bamboo', '#B8A05A', '#6FA85A', 3]],
    b: [['Chòi tre quan cảnh', 2, 2, 'pavilion', '#C9B870', '#7FB04A', '#F2C94C', 'lantern', 3], ['Nhà trà tre', 3, 2, 'house', '#D8C58A', '#7FB04A', '#8A5A2E', 'lantern+flowers', 3], ['Tháp trúc ba tầng', 2, 3, 'pagoda', '#C9B870', '#4F8A5A', '#E23B3B', 'lantern', 4], ['Nhà gấu trúc', 3, 2, 'hut', '#E8E2D0', '#4F8A5A', '#2A2A34', 'vines', 4]],
    p: [['Gấu trúc ăn tre', 'bear', '#FFFFFF', '#2A2A34', 'leaf', 3], ['Hươu xạ tre', 'hoof', '#C9A66A', '#F2E8D0', '', 3], ['Chim trúc', 'bird', '#9AD07A', '#F2E8C8', 'crown', 3], ['Ếch tre', 'frog', '#9AD07A', '#F2E8C8', 'leaf', 2]] });

  Cat.add('savanna', { map: { f: ['savannagrass'], t: ['acaciatree'], d: ['drum'], b: ['safaritower'], p: ['giraffe'] },
    f: [['Hoa protea', 'pom', '#E8543A', '#F2C94C', 4], ['Hoa hướng nắng vàng', 'daisy', '#F2A32C', '#6B4A22', 2, 14], ['Hoa xương rồng cam', 'paddle', '#FF8A3A', '#9AAE5A', 3], ['Bông cỏ voi', 'plume', '#D8B070', '#8A6A2E', 2]],
    t: [['Baobab khổng lồ', 'baobab', '#8FA845', '#F2C94C', 4], ['Keo dù', 'umbrella', '#9AAE5A', '#F2C94C', 2], ['Cây xoài hoang', 'round', '#7C9638', '#F2A32C', 3, { fruit: 1 }], ['Cây gai savanna', 'joshua', '#A8B85A', '#F2C94C', 3]],
    d: [['Cột đá totem châu Phi', 'totem', 'paw', '#B8733A', '#F2C94C', 3], ['Hố nước đá', 'cairn', 'drop', '#C9B890', '#5AA8F0', 2], ['Lá chắn Maasai', 'banner', 'sun', '#C9503A', '#F2C94C', 3], ['Mặt nạ bộ lạc', 'sign', 'eye', '#8A5A2E', '#F2C94C', 4]],
    b: [['Lều safari', 2, 2, 'tent', '#E8D4A0', '#8A5A2E', '#C9503A', 'flag', 2], ['Làng nhà tròn', 3, 2, 'hut', '#D9B070', '#A8761F', '#8A5A2E', 'smoke', 3], ['Trạm bảo tồn', 3, 2, 'house', '#E8D4B0', '#6B8A3A', '#C9503A', 'solar+flag', 3], ['Cổng đá thảo nguyên', 3, 3, 'castle', '#C9B890', '#8A5A2E', '#F2C94C', 'banner', 4]],
    p: [['Sư tử con', 'tiger', '#E8B858', '#8A5A2E', 'crown', 4], ['Voi con châu Phi', 'elephant', '#9AA3AE', '#F2B8C8', 'tusks', 4], ['Ngựa vằn', 'hoof', '#FFFFFF', '#2A2A34', 'spots', 3], ['Linh cẩu', 'dog', '#B8985A', '#2A2A34', 'spots', 3]] });

  Cat.add('jungle', { map: { f: ['birdparadise'], t: ['banana'], d: ['totem'], b: ['jungletemple'], p: ['parrot'] },
    f: [['Lan rừng đỏ', 'orchid', '#E8431F', '#FFD23F', 4], ['Hoa môn đỏ', 'cup', '#E5334B', '#FFE36B', 2], ['Hoa bao bố', 'torch', '#E8431F', '#FFD23F', 4], ['Hoa ráy xanh', 'fern', '#3C9A52', '#1F7A3C', 2]],
    t: [['Cây dừa nước rừng', 'palm', '#2F9A4E', '#8A5A2E', 2], ['Cây đa dây leo', 'mangrove', '#2F8F4A', '#E8B84A', 4], ['Cây cao su', 'round', '#2F8F4A', '#8A5A2E', 2], ['Cây chuối rừng', 'tropic', '#3FAE5A', '#FFD23F', 3]],
    d: [['Mặt nạ đá Maya', 'totem', 'eye', '#8A9482', '#3C9A4C', 4], ['Trống rừng', 'barrel', 'leaf', '#8A5A2E', '#3C9A4C', 2], ['Đèn dây leo', 'lamp', 'leaf', '#3A5A3A', '#FFE9A8', 3], ['Cầu dây gỗ', 'arch', 'leaf', '#8A5A2E', '#3C9A4C', 3]],
    b: [['Nhà sàn rừng mưa', 3, 2, 'stilt', '#B8733A', '#3C8A4A', '#F2C94C', 'vines+lantern', 3], ['Kim tự tháp Maya', 3, 3, 'pyramid', '#8A9482', '#3C9A4C', '#F2C94C', 'vines', 5], ['Trạm nghiên cứu rừng', 3, 2, 'house', '#E8D4B0', '#3C8A4A', '#8A5A2E', 'solar+vines', 3], ['Hang thác nước', 3, 2, 'cave', '#6F8A6A', '#2F6A4A', '#4FB4FF', 'vines', 4]],
    p: [['Khỉ nhện', 'monkey', '#8A5A3A', '#E8C79A', 'leaf', 3], ['Báo đen', 'tiger', '#2A2A34', '#6A6A74', 'spots', 4], ['Ếch phi tiêu độc', 'frog', '#2E6BD8', '#FFE36B', 'spots', 3], ['Rắn lục', 'snake', '#4FAE4A', '#FFE36B', '', 3]] });

  Cat.add('village', { map: { f: ['cabbage'], t: ['oaktree'], d: ['cart'], b: ['tavern'], p: ['pony'] },
    f: [['Cà rốt làng quê', 'fern', '#FF8A2A', '#3C9A4C', 2], ['Hoa hồng cổng nhà', 'pom', '#FF6B8A', '#FFD6E5', 3], ['Củ cải đỏ', 'ball', '#E5334B', '#6FBA5A', 2], ['Hành tím', 'bell', '#B48CFF', '#6FBA5A', 2]],
    t: [['Cây táo làng', 'round', '#5FB04A', '#E23B3B', 2, { fruit: 1 }], ['Cây dẻ gai', 'round', '#4A9A3E', '#B8733A', 3, { fruit: 1 }], ['Cây bách phố cổ', 'cypress', '#3F8A4A', '#F2C94C', 2], ['Cây du bóng mát', 'umbrella', '#5FB04A', '#FFFFFF', 3]],
    d: [['Giếng làng', 'well', 'drop', '#8A5A2E', '#5AA8F0', 2], ['Quầy rau củ', 'crate', 'leaf', '#B8733A', '#E23B3B', 2], ['Biển hiệu quán', 'sign', 'key', '#8A5A2E', '#F2C94C', 3], ['Đèn dầu phố cổ', 'lamp', 'flame', '#3A3A44', '#FFE9A8', 3]],
    b: [['Lò rèn', 3, 2, 'house', '#8A8F9A', '#4A4A58', '#FF8A2A', 'chimney+smoke', 3], ['Tiệm bánh mì làng', 2, 2, 'shop', '#F2D9B8', '#C9503A', '#8A5A2E', 'bunting', 3], ['Chợ phiên', 3, 2, 'shop', '#E8D4B0', '#E23B3B', '#F2C94C', 'bunting+banner', 4], ['Tháp canh làng', 2, 3, 'castle', '#C9BFA4', '#6B4A2B', '#E23B3B', 'flag', 4]],
    p: [['Gà trống làng', 'bird', '#E8543A', '#FFD23F', 'crown', 2], ['Bò sữa làng', 'hoof', '#FFFFFF', '#8A5A3A', 'spots', 3], ['Dê con', 'hoof', '#E8E2D0', '#B8733A', 'horns', 3], ['Chó giữ làng', 'dog', '#C9884A', '#FFFFFF', 'scarf', 3]] });

  Cat.add('funfair', { map: { f: ['balloonflower'], d: ['popcorn'], b: ['carousel'], p: ['monkey'] },
    f: [['Hoa kẹo mút', 'pom', '#FF6B9A', '#FFD23F', 3], ['Hoa bóng bay', 'ball', '#4FB4FF', '#FF5C7A', 2], ['Hoa pháo hoa', 'star', '#FFD23F', '#FF5CC8', 3, 10], ['Hoa xiếc rực', 'torch', '#FF5C7A', '#FFD23F', 4]],
    t: [['Cây bóng bay', 'candy', '#FF5C7A', '#FFD23F', 3], ['Cây bông gòn hội chợ', 'cloud', '#FFB3D0', '#9AE8F2', 3], ['Cây đèn lồng', 'round', '#FFD23F', '#E23B3B', 3, { fruit: 1 }], ['Cây pháo bông', 'hex', '#FF5CC8', '#5CE8FF', 4], ['Cây dải lụa', 'willow', '#B48CFF', '#FFD23F', 3]],
    d: [['Quầy ném vòng', 'crate', 'star', '#E23B3B', '#FFD23F', 2], ['Cổng vui chơi', 'arch', 'star', '#FF5C7A', '#FFD23F', 3], ['Đèn dây rực rỡ', 'lamp', 'star', '#4FB4FF', '#FFE9A8', 3], ['Hộp nhạc', 'chest', 'note', '#B48CFF', '#FFD23F', 3]],
    b: [['Vòng đu quay ngựa', 3, 3, 'tent', '#FFFFFF', '#E23B3B', '#FFD23F', 'flag+bunting', 5], ['Nhà ma thú vị', 3, 2, 'house', '#6A3A8A', '#2E1F72', '#FFE36B', 'stars+bunting', 4], ['Quầy kem', 2, 2, 'shop', '#FFD9E6', '#FF6B9A', '#4FB4FF', 'bunting', 3], ['Tàu lượn nhỏ', 3, 2, 'tower', '#4FB4FF', '#E23B3B', '#FFD23F', 'flag', 4]],
    p: [['Hề nhí', 'monkey', '#FF5C7A', '#FFFFFF', 'hat', 3], ['Voi xiếc', 'elephant', '#8FA8D8', '#FFD23F', 'crown', 4], ['Chó xiếc', 'dog', '#FFFFFF', '#FF5C7A', 'bow', 3], ['Gấu xiếc', 'bear', '#8A5A3A', '#FFD23F', 'hat', 3]] });

  Cat.add('arctic', { map: { f: ['snowdrop'], t: ['frostpine'], d: ['snowsled'], b: ['igloo'], p: ['polarbear'] },
    f: [['Hoa băng tuyết', 'crystal', '#BFE8FF', '#7FB8E8', 3], ['Rêu địa y', 'rosette', '#BFD8C8', '#E8F4F0', 2], ['Hoa cực quang', 'plume', '#5CFFB0', '#7CF0FF', 4], ['Hoa tuyết lạnh', 'star', '#FFFFFF', '#9AD0F2', 3, 8]],
    t: [['Thông băng', 'icetree', '#BFE8FF', '#FFFFFF', 3], ['Bách tuyết', 'conifer', '#6AA4B8', '#FFFFFF', 2, { snow: 1 }], ['Cây tinh thể lạnh', 'crystal', '#9AD0F2', '#FFFFFF', 4], ['Sồi rụng băng', 'dead', '#8A9AB0', '#BFE8FF', 2]],
    d: [['Cột băng điêu khắc', 'pedestal', 'diamond', '#BFE8FF', '#FFFFFF', 4], ['Đèn cực quang', 'lamp', 'snow', '#4A6A98', '#7CF0FF', 3], ['Lỗ câu cá băng', 'barrel', 'fish', '#BFE8FF', '#4FB4FF', 3], ['Cờ thám hiểm', 'banner', 'snow', '#E23B3B', '#FFFFFF', 2]],
    b: [['Trạm nghiên cứu cực', 3, 2, 'tech', '#E8ECF1', '#E23B3B', '#4FB4FF', 'dish+snow', 4], ['Lều thám hiểm', 2, 2, 'tent', '#E23B3B', '#FFFFFF', '#F2C94C', 'flag+snow', 3], ['Hang băng', 3, 2, 'cave', '#BFE8FF', '#7FB8E8', '#4FB4FF', 'icicles', 4], ['Tháp băng tinh thể', 2, 3, 'tower', '#DDF2FF', '#7FB8E8', '#FFFFFF', 'icicles', 5]],
    p: [['Chim cánh cụt', 'penguin', '#2A3550', '#FFFFFF', 'scarf', 3], ['Hải cẩu xám', 'seal', '#8A929C', '#D8DEE4', '', 2], ['Cáo tuyết cực', 'fox', '#FFFFFF', '#BFE8FF', 'glow', 4], ['Cá voi trắng', 'whale', '#E8F2FA', '#BFE8FF', 'star', 5]] });

  Cat.add('pirate', { map: { f: ['pineapple'], d: ['pirateflag'], b: ['pirateship'], p: ['crab'] },
    f: [['Hoa chuối biển', 'torch', '#FF8A2A', '#FFD23F', 3], ['Dứa dại', 'rosette', '#6FA85A', '#F2C94C', 2], ['Hoa lan đảo', 'orchid', '#FF5C9A', '#FFD23F', 4], ['Hoa xương rồng đảo', 'paddle', '#FF8FB8', '#8FB45A', 2]],
    t: [['Dừa đảo', 'palm', '#3FAE4A', '#8A5A2E', 2], ['Dừa kho báu', 'palm', '#5FC25A', '#F2C94C', 3], ['Đước bờ biển', 'mangrove', '#3C8A4A', '#E8B84A', 4], ['Cây xương rồng cát', 'cactus', '#6FA85A', '#FF8FB8', 2], ['Cây bàng cổ', 'umbrella', '#4FAE5A', '#F2A32C', 3]],
    d: [['Rương vàng hải tặc', 'chest', 'skull', '#8A5A2E', '#F2C94C', 3], ['Thùng rum', 'barrel', 'skull', '#6B4A2B', '#E8C48C', 2], ['Bánh lái tàu', 'gong', 'wheel', '#6B4A2B', '#F2C94C', 4], ['Neo sắt', 'obelisk', 'anchor', '#4A4A58', '#C9D0D9', 3]],
    b: [['Quán rượu hải tặc', 3, 2, 'shop', '#8A5A3A', '#4A3A2A', '#E23B3B', 'bunting+lantern', 4], ['Pháo đài đảo', 3, 3, 'castle', '#8A8F9A', '#4A4A58', '#E23B3B', 'flag', 5], ['Hang kho báu', 3, 2, 'cave', '#8A929C', '#4A4A58', '#F2C94C', 'sand', 4], ['Chòi cát thuyền trưởng', 2, 2, 'hut', '#E8D4A0', '#A8761F', '#2A2A34', 'flag+sand', 3]],
    p: [['Vẹt hải tặc', 'bird', '#E23B3B', '#2E6BD8', 'hat', 3], ['Khỉ thủy thủ', 'monkey', '#8A5A3A', '#E8C79A', 'hat', 3], ['Cá voi sát thủ nhí', 'whale', '#2A2A34', '#FFFFFF', 'scarf', 4], ['Mèo thuyền trưởng', 'cat', '#2A2A34', '#F2C94C', 'hat', 4]] });

  Cat.add('dino', { map: { f: ['fiddlehead'], t: ['cycad'], d: ['dinoegg'], b: ['brontosaurus'], p: ['babydino'] },
    f: [['Quả thông cổ', 'ball', '#8A6A3A', '#6FA85A', 2], ['Hoa mộc lan cổ', 'cup', '#FFD6E5', '#FFE36B', 3], ['Dương xỉ cổ đại', 'fern', '#4FAE4A', '#2F8A4A', 2], ['Hoa bách tuế', 'torch', '#C9503A', '#F2C94C', 3]],
    t: [['Thiên tuế khổng lồ', 'palm', '#3C9A52', '#E8A13A', 3], ['Dương xỉ thân cây', 'tropic', '#4FAE4A', '#8A5A2E', 3], ['Bách tán cổ', 'conifer', '#3C7A4A', '#E8B84A', 2], ['Bạch quả hóa thạch', 'ginkgo', '#8FBF5A', '#F2C94C', 4]],
    d: [['Hóa thạch xương', 'cairn', 'bone', '#C9BFA4', '#FFFFFF', 3], ['Dấu chân khổng lồ', 'sign', 'paw', '#A89A7A', '#6B4A2B', 2], ['Tổ trứng', 'planter', 'star', '#8A5A2E', '#FFF3D6', 2], ['Hố hổ phách', 'vase', 'bug', '#E8A13A', '#6B4A2B', 4]],
    b: [['Trạm khảo cổ', 3, 2, 'tent', '#C9B890', '#8A5A2E', '#F2C94C', 'flag', 3], ['Hang khủng long', 3, 2, 'cave', '#8A7A5A', '#4A3A2A', '#6FA85A', 'vines', 3], ['Nhà ấp trứng', 2, 2, 'hut', '#C9B890', '#4F8A4A', '#F2C94C', 'smoke', 3], ['Bảo tàng hóa thạch', 3, 3, 'temple', '#D8CBA8', '#8A5A2E', '#6FA85A', 'banner', 5]],
    p: [['Khủng long ba sừng', 'lizard', '#6FA85A', '#E8A13A', 'horns', 4], ['Khủng long bay nhí', 'bird', '#8A9AB0', '#E8A13A', 'wings', 4], ['Rùa cổ', 'turtle', '#6A7A4A', '#C9B890', '', 3], ['Bọ hóa thạch', 'bug', '#A89A7A', '#6B4A2B', 'antenna', 2]] });

  Cat.add('volcano', { map: { f: ['fireflower'], t: ['firetree'], d: ['tikitorch'], b: ['volcano'], p: ['salamander'] },
    f: [['Hoa tro tàn', 'pom', '#6A5A62', '#FF8A2A', 3], ['Hoa dung nham', 'star', '#FF6A2A', '#FFD23F', 3, 6], ['Dương xỉ lửa', 'fern', '#8A4A2A', '#FF8A2A', 2], ['Hoa tinh thể đỏ', 'crystal', '#E8431F', '#FFD23F', 4]],
    t: [['Cây than hồng', 'dead', '#3A3036', '#FF8A2A', 3], ['Cây đá nham thạch', 'crystal', '#4A4046', '#FF6A2A', 4], ['Cây xương rồng tro', 'cactus', '#6A5A62', '#FF8A2A', 2], ['Cây tro tàn', 'cypress', '#5A5058', '#FF8A2A', 2]],
    d: [['Đá obsidian nhọn', 'obelisk', 'flame', '#2A2630', '#FF8A2A', 3], ['Vạc dung nham', 'barrel', 'flame', '#3A3036', '#FF6A2A', 3], ['Cổng đá lửa', 'arch', 'flame', '#4A4046', '#FF8A2A', 4], ['Tượng thần lửa', 'pedestal', 'skull', '#4A4046', '#FF6A2A', 4]],
    b: [['Lò rèn dung nham', 3, 2, 'house', '#4A4046', '#2A2630', '#FF8A2A', 'chimney+smoke', 4], ['Đền lửa', 3, 3, 'temple', '#5A5058', '#2A2630', '#FF6A2A', 'stars', 5], ['Hang nham thạch', 3, 2, 'cave', '#4A4046', '#2A2630', '#FF6A2A', 'sand', 3], ['Chòi thổ dân trên núi lửa', 2, 2, 'hut', '#8A5A3A', '#3A3036', '#FF8A2A', 'smoke', 3]],
    p: [['Rồng lửa nhí', 'lizard', '#E8431F', '#FFD23F', 'flame', 5], ['Cú lửa', 'owl', '#6A5A62', '#FF8A2A', 'flame', 4], ['Hổ lửa', 'tiger', '#E8641A', '#2A2A34', 'flame', 5], ['Nhím lửa', 'mouse', '#4A4046', '#FF6A2A', 'spots', 3]] });

  Cat.add('cyber', { map: { f: ['neonflower'], t: ['neontree'], d: ['hologramd'], b: ['neontower'], p: ['robotdog'] },
    f: [['Hoa mạch điện', 'star', '#5CE8FF', '#FF5CC8', 3, 8], ['Hoa dữ liệu', 'crystal', '#5CE8FF', '#B14CFF', 4], ['Hoa laser', 'plume', '#FF5CC8', '#5CE8FF', 3], ['Hoa pixel', 'pom', '#7AF2A0', '#5CE8FF', 3]],
    t: [['Cây sạc năng lượng', 'hex', '#7AF2A0', '#5CE8FF', 4], ['Cây cáp quang', 'willow', '#5CE8FF', '#B14CFF', 3], ['Cây tinh thể số', 'crystal', '#B14CFF', '#5CE8FF', 4], ['Cây ăng-ten', 'cypress', '#5CE8FF', '#FF5CC8', 2]],
    d: [['Cột sạc xe bay', 'lamp', 'bolt', '#2A3550', '#5CE8FF', 3], ['Biển quảng cáo neon', 'sign', 'star', '#1A1240', '#FF5CC8', 3], ['Pod giao hàng', 'barrel', 'gear', '#4A5486', '#5CE8FF', 3], ['Cổng dịch chuyển', 'arch', 'spiral', '#2A3550', '#B14CFF', 5]],
    b: [['Trạm xe bay', 3, 2, 'tech', '#2A3550', '#FF5CC8', '#5CE8FF', 'neon+stars', 4], ['Tòa nhà kính xanh', 2, 3, 'tower', '#2C3560', '#5CE8FF', '#FF5CC8', 'neon+dish', 4], ['Quán cà phê robot', 2, 2, 'shop', '#2A3550', '#B14CFF', '#5CE8FF', 'neon', 4], ['Trung tâm dữ liệu', 3, 3, 'tech', '#1A1F40', '#5CE8FF', '#B14CFF', 'neon+dish+solar', 5]],
    p: [['Mèo máy', 'cat', '#B8C4D4', '#5CE8FF', 'antenna', 4], ['Bồ câu điện tử', 'bird', '#9AA3B2', '#5CE8FF', 'glow', 4], ['Cá robot', 'fish', '#5CE8FF', '#B14CFF', 'star', 4], ['Cú hologram', 'owl', '#5CE8FF', '#FF5CC8', 'glow', 5]] });
})(typeof window !== 'undefined' ? window : this);
