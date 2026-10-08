/* EWT Garden — kho đặc sản (phần F): 12 khu văn hoá quốc gia mới — châu Mỹ (Peru, Argentina, Cuba, Chile), châu Âu (Tây Ban Nha, Nga, Ai-len, Na Uy), châu Phi (Kenya, Nam Phi, Ethiopia, Madagascar).
   Mỗi khu 5 hoa · 5 cây · 5 trang trí · 5 công trình · 5 thú cưng (món đã vẽ ở garden-world9/10/11 được gán về khu trong `map`). Chỉ ghi điều chắc chắn đúng về văn hoá. */
(function (root) {
  'use strict';
  var Cat = root.EWTGardenCatalog || (typeof require === 'function' ? require('./garden-catalog.js') : null); if (!Cat) return;

  /* ═════ CHÂU MỸ ═════ */
  Cat.add('peru', { map: { d: ['panflute', 'quipu'], b: ['machupicchu', 'andeanhouse'] },
    f: [['Hoa cantuta', 'bell', '#E5334B', '#F2C94C', 3], ['Hoa amancay', 'cup', '#FFD23F', '#E8742E', 2], ['Lan Waqanki', 'orchid', '#FF5CA8', '#FFFFFF', 4], ['Hoa kiwicha', 'plume', '#C0394B', '#8A1E2A', 2], ['Cúc Andes', 'daisy', '#FFFFFF', '#F2C94C', 2]],
    t: [['Cây quina', 'round', '#4F8A3A', '#C8553A', 3], ['Cây queñua Andes', 'birch', '#C8A060', '#E8DCC0', 3], ['Bơ Peru', 'round', '#3F7A3A', '#7AAE3A', 3, { fruit: 1 }], ['Cọ Amazon', 'palm', '#2E9B4A', '#8A5A2E', 3], ['Cây tara', 'umbrella', '#4A8A4A', '#E8B84A', 3]],
    d: [['Đĩa Mặt Trời Inti', 'gong', 'sun', '#F2C94C', '#C98A00', 3], ['Đá Intihuatana', 'pillar', 'none', '#B8AC9C', '#8A8070', 3], ['Cờ dệt Andes', 'banner', 'wave', '#C8553A', '#F2C94C', 3]],
    b: [['Nhà sàn Amazon', 3, 2, 'stilt', '#C98A4B', '#6B8E3A', '#2E9B4A', 'vines', 4], ['Chợ len Cusco', 2, 2, 'shop', '#E8B070', '#C8553A', '#8E5FC4', 'bunting', 3], ['Đền Mặt Trời Qorikancha', 2, 3, 'temple', '#CFC8B0', '#8A8470', '#F2C94C', '', 4]],
    p: [['Lạc đà llama', 'llama', '#F4EAD8', '#C9A878', '', 4], ['Lạc đà alpaca', 'llama', '#8A5A2E', '#C9A878', 'bow', 4], ['Kền kền condor', 'eagle', '#2A2A34', '#FFFFFF', '', 4], ['Chuột lang cuy', 'mouse', '#C98A4B', '#FFF0D8', 'spots', 3], ['Chim gà đá Andes', 'bird', '#FF6A1F', '#2A2A34', '', 4]] });

  Cat.add('argentina', { map: { d: ['mategourd', 'bandoneon'], b: ['perito', 'laboca'] },
    f: [['Hoa ceibo', 'plume', '#D61F3A', '#8E1228', 3], ['Cỏ pampas', 'reed', '#F4EAD0', '#C9B88A', 2], ['Hoa lạc tiên', 'star', '#8E5FC4', '#FFFFFF', 3, 5], ['Cúc Patagonia', 'daisy', '#FFD23F', '#C98A00', 2], ['Quả calafate', 'berry', '#2B3AC8', '#4A8A3C', 3]],
    t: [['Jacaranda Buenos Aires', 'blossom', '#B66CFF', '#D8B8FF', 3], ['Cây ombú', 'umbrella', '#4A8A3C', '#8A5A2E', 4], ['Tùng Araucaria', 'conifer', '#2F6A4A', '#9AC0D8', 3], ['Sồi lenga', 'maple', '#E8742E', '#F2C94C', 3], ['Quebracho', 'round', '#5E8A4A', '#8A5A2E', 3]],
    d: [['Đài Obelisco', 'obelisk', 'none', '#EDEDED', '#B8B8C0', 3], ['Đèn phố tango', 'lamp', 'heart', '#E5334B', '#F2C94C', 3], ['Rương alfajores', 'chest', 'none', '#C98A4B', '#F2C94C', 3]],
    b: [['Trang trại estancia', 3, 2, 'barn', '#E8D8B0', '#B8452E', '#2E9B4A', 'flowers', 4], ['Nhà hát Teatro Colón', 3, 2, 'dome', '#EDE0C8', '#6A8AB8', '#C9A22A', 'banner', 5], ['Phố Caminito', 2, 2, 'shop', '#F2C94C', '#2B6BC8', '#E5334B', 'bunting', 3]],
    p: [['Ngựa Criollo', 'horse', '#A8703A', '#2A2A34', 'scarf', 3], ['Chim hornero', 'bird', '#B8703A', '#F4E8D0', '', 3], ['Cánh cụt Magellan', 'penguin', '#2A2A34', '#FFFFFF', '', 3], ['Cá voi franca', 'whale', '#4A5A6A', '#EAF4FA', '', 4], ['Lạc đà guanaco', 'llama', '#C98A4B', '#F4E8D0', '', 4]] });

  Cat.add('cuba', { map: { d: ['cuflag', 'congadrum'], b: ['capitolio', 'vintagecar'] },
    f: [['Hoa bướm trắng', 'lily', '#FFFFFF', '#E8E8D0', 3], ['Dâm bụt Cuba', 'cup', '#FF5C7A', '#FFD23F', 2], ['Lan Caribe', 'orchid', '#FF8A1F', '#FFD23F', 4], ['Hoa gừng đỏ', 'spike', '#E5334B', '#FF8A1F', 3], ['Phong lữ', 'pom', '#FF4F7A', '#FFE0EC', 2]],
    t: [['Cọ hoàng gia', 'palm', '#2E9B4A', '#8A8070', 4], ['Phượng vĩ', 'umbrella', '#E5334B', '#2E9B4A', 3], ['Xoài Cuba', 'round', '#3F8A3A', '#F2A32C', 3, { fruit: 1 }], ['Dừa Caribe', 'tropic', '#2E9B4A', '#8A5A2E', 3], ['Cây gạo ceiba', 'baobab', '#5E8A4A', '#B8A88A', 4]],
    d: [['Đèn đường Havana', 'lamp', 'none', '#2B9BD8', '#F2C94C', 3], ['Bàn cờ domino', 'bench', 'none', '#2A2A34', '#FFFFFF', 3], ['Cối ép mía', 'barrel', 'leaf', '#C98A4B', '#4FAE4A', 3]],
    b: [['Nhà thuộc địa Havana', 3, 2, 'house', '#F2A0C0', '#C8553A', '#2B9BD8', 'balcony', 4], ['Pháo đài Morro', 3, 2, 'castle', '#E8DCC0', '#B8A88A', '#E5334B', 'flag', 4], ['Hải đăng Havana', 2, 3, 'lighthouse', '#FFFFFF', '#E5334B', '#2B9BD8', '', 3]],
    p: [['Chim tocororo', 'bird', '#2B6BC8', '#E5334B', 'wings', 4], ['Cá sấu Cuba', 'croc', '#6A8A3A', '#E8E0A0', '', 4], ['Hồng hạc Caribe', 'flamingo', '#FF8FA8', '#FFFFFF', '', 3], ['Rùa biển xanh', 'turtle', '#4A8A5A', '#B8D8A0', '', 3], ['Thằn lằn anole', 'lizard', '#5ACB6A', '#FFD23F', '', 3]] });

  Cat.add('chile', { map: { d: ['clflag', 'copihue'], b: ['moai', 'palafito'] },
    f: [['Hoa copihue', 'bell', '#D61F3A', '#FFFFFF', 3], ['Alstroemeria', 'lily', '#FF8A1F', '#FFD23F', 3], ['Hoa sa mạc Atacama', 'pom', '#FF8FB8', '#8E5FC4', 3], ['Hoa calceolaria', 'cup', '#FFD23F', '#E8742E', 2], ['Cúc Chile', 'daisy', '#FF5C7A', '#FFE0EC', 2]],
    t: [['Tùng Araucaria', 'conifer', '#2F6A4A', '#9AC0D8', 4], ['Cọ Chile', 'palm', '#4A8A3C', '#8A5A2E', 3], ['Cây quillay', 'round', '#5E8A4A', '#8A8070', 3], ['Sồi lenga', 'maple', '#E8742E', '#F2C94C', 3], ['Bách Patagonia', 'cypress', '#2F6A4A', '#9AC0D8', 3]],
    d: [['Tượng moai mini', 'totem', 'none', '#7A6E5E', '#5A5042', 3], ['Đèn Valparaíso', 'lamp', 'none', '#2B6BC8', '#F2C94C', 3], ['Thuyền gỗ Chiloé', 'boat', 'none', '#E5834B', '#2B6BC8', 3]],
    b: [['Nhà gỗ Valparaíso', 2, 2, 'house', '#2B9BD8', '#E5334B', '#F2C94C', 'balcony', 3], ['Đài thiên văn Atacama', 2, 3, 'dome', '#EEF2F8', '#8FA3B8', '#2B6BC8', 'dish', 4], ['Hải đăng Patagonia', 2, 3, 'lighthouse', '#FFFFFF', '#E5334B', '#2B6BC8', '', 3]],
    p: [['Cánh cụt Humboldt', 'penguin', '#2A2A34', '#FFFFFF', '', 3], ['Kền kền condor', 'eagle', '#2A2A34', '#FFFFFF', '', 4], ['Hươu huemul', 'deer', '#8A6A4A', '#F4E8D0', '', 4], ['Sư tử biển', 'seal', '#8A6A4A', '#C9A878', '', 3], ['Cáo Darwin', 'fox', '#8A8A94', '#F4F4F8', '', 3]] });

  /* ═════ CHÂU ÂU ═════ */
  Cat.add('spain', { map: { d: ['paellapan', 'flamencofan'], b: ['sagrada', 'pueblo'] },
    f: [['Cẩm chướng Tây Ban Nha', 'pom', '#E5334B', '#FFE0EC', 2], ['Hoa cam azahar', 'star', '#FFFFFF', '#F2C94C', 3, 5], ['Oải hương Andalusia', 'spike', '#8E5FC4', '#E8D8FF', 2], ['Hướng dương', 'daisy', '#FFD23F', '#8A5A1A', 3, 14], ['Phong lữ Seville', 'pom', '#FF4F7A', '#FFE0EC', 2]],
    t: [['Ô liu Andalusia', 'round', '#7A8A5A', '#3A4A1A', 3, { fruit: 1 }], ['Cam Valencia', 'round', '#3F8A3A', '#FF8A1F', 3, { fruit: 1 }], ['Hạnh nhân hoa', 'blossom', '#FFE0EC', '#FFFFFF', 3], ['Thông dù', 'umbrella', '#3F7A4A', '#8A5A2E', 3], ['Cọ chà là Elche', 'palm', '#4A8A3A', '#8A5A2E', 3]],
    d: [['Bình gốm Talavera', 'vase', 'flower', '#2B6BC8', '#FFFFFF', 3], ['Đèn lồng Andalusia', 'lantern', 'none', '#E5334B', '#F2C94C', 3], ['Đài phun nước Moorish', 'fountain', 'none', '#E8DCC0', '#4FB4D8', 3]],
    b: [['Cung điện Alhambra', 3, 2, 'castle', '#E8C890', '#C8553A', '#2B9BD8', 'banner', 5], ['Chợ La Boqueria', 2, 2, 'shop', '#F2C94C', '#E5334B', '#2E9B4A', 'bunting', 3], ['Cối xay gió La Mancha', 2, 3, 'windmill2', '#FFFFFF', '#8A5A2E', '#C8553A', '', 3]],
    p: [['Bò đực Tây Ban Nha', 'cow', '#2A2A34', '#F4E8D0', 'horns', 4], ['Linh miêu Iberia', 'cat', '#D9A24A', '#2A2A34', 'spots', 5], ['Ngựa Andalusia', 'horse', '#F4F4F8', '#B8B8C0', '', 4], ['Đại bàng hoàng đế', 'eagle', '#3A2A1A', '#F4E8D0', '', 4], ['Cò trắng', 'crane', '#FFFFFF', '#2A2A34', '', 3]] });

  Cat.add('russia', { map: { d: ['ruflag', 'matryoshka'], b: ['stbasil', 'izba'] },
    f: [['Cúc La Mã', 'daisy', '#FFFFFF', '#FFD23F', 2], ['Hoa ngô xanh', 'star', '#2B6BC8', '#8FB4F2', 3, 5], ['Hoa giọt tuyết', 'bell', '#FFFFFF', '#9AD8A8', 2], ['Hoa liễu thảo', 'spike', '#FF5CA8', '#FFD0E2', 3], ['Hướng dương Nga', 'daisy', '#FFD23F', '#6B4A1A', 3, 14]],
    t: [['Bạch dương Nga', 'birch', '#7DAA4A', '#F4F4F0', 3], ['Thông Siberia', 'conifer', '#2F6A4A', '#9AC0D8', 4], ['Vân sam Nga', 'conifer', '#2F7A52', '#CFE8D8', 3], ['Phong bạc', 'maple', '#9AB84A', '#E8F0C8', 3], ['Táo Antonovka', 'round', '#4F8A3A', '#C9D56A', 3, { fruit: 1 }]],
    d: [['Ấm trà samovar', 'vase', 'flame', '#C9A22A', '#8A5A1E', 3], ['Đèn Cung điện', 'lamp', 'star', '#2B6BC8', '#F2C94C', 3], ['Chuông Sa hoàng', 'gong', 'bell', '#C9A22A', '#8A5A1E', 3]],
    b: [['Điện Kremlin', 3, 2, 'castle', '#B8452E', '#2E9B4A', '#F2C94C', 'flag', 5], ['Nhà hát Bolshoi', 3, 2, 'temple', '#F2E8D0', '#8A8070', '#C9A22A', 'banner', 4], ['Ga tàu điện ngầm', 2, 2, 'dome', '#E8DCC0', '#8A8F9A', '#C9A22A', 'lantern', 3]],
    p: [['Gấu nâu Nga', 'bear', '#8A5A2E', '#C9A878', 'scarf', 4], ['Hổ Siberia', 'tiger', '#F2B84A', '#2A2A34', '', 5], ['Sói xám', 'dog', '#9AA3B0', '#F4F4F8', '', 4], ['Cú tuyết', 'owl', '#FFFFFF', '#2A2A34', '', 4], ['Hải cẩu Baikal', 'seal', '#8A8F9A', '#EAEAF0', '', 3]] });

  Cat.add('ireland', { map: { d: ['ieflag', 'celticharp'], b: ['moher', 'irishcottage'] },
    f: [['Cỏ ba lá shamrock', 'fern', '#2E9B4A', '#7BBF4A', 2], ['Hoa lồng đèn fuchsia', 'bell', '#D61F7A', '#8E5FC4', 3], ['Hoa thạch nam', 'spike', '#B66CFF', '#E8D8FF', 2], ['Thuỷ tiên vàng', 'cup', '#FFD23F', '#E8742E', 2], ['Cúc dại', 'daisy', '#FFFFFF', '#F2C94C', 2]],
    t: [['Sồi Ai-len', 'round', '#4A8A3C', '#8A5A2E', 4], ['Tần bì', 'round', '#5E9A4A', '#7A6A4A', 3], ['Táo gai hawthorn', 'blossom', '#FFFFFF', '#FFC4D8', 3], ['Thông Scots', 'conifer', '#2F6A4A', '#8A5A2E', 3], ['Liễu rủ', 'willow', '#7DAA4A', '#B8D87A', 3]],
    d: [['Cây thánh giá Celtic', 'pillar', 'none', '#9AA5A0', '#6A7570', 3], ['Đèn lồng Dublin', 'lamp', 'leaf', '#169B62', '#F2C94C', 3], ['Hũ vàng cuối cầu vồng', 'chest', 'sun', '#2A2A34', '#F2C94C', 4]],
    b: [['Lâu đài Blarney', 3, 2, 'castle', '#9AA5A0', '#4A6A52', '#169B62', 'flag', 4], ['Cửa hàng len Aran', 2, 2, 'shop', '#F2E8D0', '#169B62', '#FF883E', 'bunting', 3], ['Tháp tròn cổ', 2, 3, 'tower', '#B8B2A0', '#6A6458', '#169B62', '', 3]],
    p: [['Cừu Ai-len', 'sheep', '#FFFFFF', '#2A2A34', '', 3], ['Chó sói Ai-len', 'dog', '#9AA3B0', '#F4F4F8', '', 4], ['Chim hải âu puffin', 'bird', '#2A2A34', '#FF8A1F', '', 4], ['Thỏ rừng Ai-len', 'bunny', '#C9A06B', '#FFF0D8', '', 3], ['Ngựa Connemara', 'horse', '#8A8A94', '#2A2A34', '', 4]] });

  Cat.add('norway', { map: { d: ['noflag', 'vikingship', 'troll'], b: ['stavechurch', 'rorbu'] },
    f: [['Quả mây cloudberry', 'berry', '#FF8A1F', '#4A8A3C', 3], ['Hoa linnaea', 'bell', '#FF8FB8', '#FFE0EC', 2], ['Hoa chân ngỗng', 'anemone', '#FFFFFF', '#F2C94C', 2], ['Tử đinh hương Bắc Âu', 'cup', '#8E5FC4', '#E8D8FF', 2], ['Thạch nam Na Uy', 'spike', '#B66CFF', '#E8D8FF', 2]],
    t: [['Vân sam Na Uy', 'conifer', '#2F6A4A', '#CFE8D8', 4], ['Bạch dương lùn', 'birch', '#7DAA4A', '#F4F4F0', 3], ['Thông Scots', 'conifer', '#2F7A4A', '#8A5A2E', 3], ['Thanh lương trà rowan', 'round', '#5E9A4A', '#E5334B', 3, { fruit: 1 }], ['Liễu Bắc Cực', 'willow', '#9AB86A', '#D8E8B0', 3]],
    d: [['Đèn cực quang', 'starlamp', 'none', '#4FD8A8', '#B66CFF', 4], ['Đá khắc rune', 'cairn', 'none', '#8A8F9A', '#B8C2CE', 3]],
    b: [['Nhà sàn Fjord', 3, 2, 'stilt', '#B83A2E', '#5A4A3A', '#FFFFFF', 'flowers', 4], ['Nhà gỗ lợp cỏ', 2, 2, 'hut', '#B8864A', '#4E8A3A', '#B83A2E', 'smoke', 3], ['Hải đăng Lindesnes', 2, 3, 'lighthouse', '#FFFFFF', '#BA0C2F', '#2B6BC8', '', 3]],
    p: [['Tuần lộc', 'deer', '#8A6A4A', '#F4F4F8', 'antlers', 4], ['Nai sừng tấm', 'moose', '#6B4A2B', '#C9A878', '', 4], ['Cáo Bắc Cực', 'fox', '#F4F4F8', '#9AA3B0', '', 4], ['Cá voi orca', 'whale', '#2A2A34', '#FFFFFF', '', 5], ['Gấu trắng Svalbard', 'bear', '#F4F4F8', '#C9D8E8', '', 5]] });

  /* ═════ CHÂU PHI ═════ */
  Cat.add('kenya', { map: { d: ['maasaishield', 'safarijeep'], b: ['kilimanjaro', 'maasaiboma'] },
    f: [['Hoa thiên điểu', 'torch', '#FF8A1F', '#2B6BC8', 3], ['Dâm bụt Kenya', 'cup', '#E5334B', '#FFD23F', 2], ['Hoa cúc Savanna', 'daisy', '#FFD23F', '#C98A00', 2], ['Lan Rift Valley', 'orchid', '#FF8FB8', '#FFFFFF', 4], ['Hoa móng rồng', 'spike', '#E5834B', '#F2C94C', 3]],
    t: [['Keo ô dù', 'umbrella', '#5E8A3A', '#8A5A2E', 4], ['Bao báp Kenya', 'baobab', '#6A9A4A', '#A8805A', 4], ['Cọ doum', 'palm', '#4A8A3A', '#8A5A2E', 3], ['Xoài Kenya', 'round', '#3F8A3A', '#F2A32C', 3, { fruit: 1 }], ['Cà phê Kenya', 'round', '#2F6A3A', '#E5334B', 3, { fruit: 1 }]],
    d: [['Đèn bão safari', 'hurricane', 'none', '#6B4A2B', '#F2C94C', 3], ['Chum nước đất nung', 'vase', 'none', '#C8553A', '#8A3A1E', 3], ['Lều nhỏ safari', 'tent', 'none', '#C8A25A', '#8A6A2A', 3]],
    b: [['Trại safari', 3, 2, 'tent', '#C8A25A', '#8A6A2A', '#E5334B', 'flag', 4], ['Nhà gỗ đảo Lamu', 2, 2, 'house', '#F2E8D0', '#8A5A2E', '#2B9BD8', 'balcony', 3], ['Chợ Nairobi', 2, 2, 'shop', '#E8B070', '#E5334B', '#2E9B4A', 'bunting', 3]],
    p: [['Sư tử Maasai Mara', 'lion', '#E8B84A', '#8A5A1A', '', 5], ['Hươu cao cổ Maasai', 'giraffe', '#E8B84A', '#8A5A1A', '', 4], ['Ngựa vằn Grevy', 'zebra', '#FFFFFF', '#2A2A34', '', 4], ['Voi châu Phi', 'elephant', '#9AA3B0', '#F4F4F8', 'tusks', 5], ['Hồng hạc Nakuru', 'flamingo', '#FF8FA8', '#FFFFFF', '', 4]] });

  Cat.add('southafrica', { map: { d: ['vuvuzela', 'proteaflower'], b: ['tablemountain', 'ndebele'] },
    f: [['Hoa thiên điểu', 'torch', '#FF8A1F', '#2B6BC8', 3], ['Hoa agapanthus', 'pom', '#5E8AF2', '#B8D0FF', 2], ['Hoa fynbos', 'plume', '#FF7AB6', '#FFD0E2', 3], ['Cúc Namaqua', 'daisy', '#FF8A1F', '#6B3A18', 2, 14], ['Hoa lô hội', 'spike', '#E5334B', '#FF8A1F', 3]],
    t: [['Phượng tím Pretoria', 'blossom', '#B66CFF', '#D8B8FF', 3], ['Cây marula', 'umbrella', '#5E8A3A', '#8A5A2E', 4], ['Cây fever tree', 'umbrella', '#C8B84A', '#9A8A2A', 3], ['Bao báp Nam Phi', 'baobab', '#6A9A4A', '#A8805A', 4], ['Cọ Nam Phi', 'palm', '#4A8A3A', '#8A5A2E', 3]],
    d: [['Chuỗi hạt cườm Zulu', 'banner', 'diamond', '#E5334B', '#FFFFFF', 3], ['Đèn Cape Town', 'lamp', 'none', '#2B6BC8', '#F2C94C', 3], ['Rương kim cương', 'chest', 'diamond', '#2A2A34', '#4FD8F8', 4]],
    b: [['Trang trại nho Cape Dutch', 3, 2, 'house', '#FFFFFF', '#6A4A2A', '#2E9B4A', 'vines', 4], ['Hải đăng Cape Point', 2, 3, 'lighthouse', '#FFFFFF', '#E5334B', '#2B6BC8', '', 3], ['Sân vận động Soccer City', 3, 2, 'dome', '#E8B070', '#C8553A', '#2B6BC8', 'flag', 5]],
    p: [['Cánh cụt châu Phi', 'penguin', '#2A2A34', '#FFFFFF', '', 3], ['Tê giác trắng', 'rhino', '#9AA3B0', '#F2E8D0', '', 5], ['Linh dương springbok', 'deer', '#C98A4B', '#FFF6E8', 'horns', 4], ['Chồn đất meerkat', 'meerkat', '#C9A878', '#F4E8D0', '', 3], ['Sư tử biển Cape', 'seal', '#8A6A4A', '#C9A878', '', 3]] });

  Cat.add('ethiopia', { map: { d: ['jebena', 'meskelcross'], b: ['lalibela', 'tukul'] },
    f: [['Hoa Meskel', 'daisy', '#FFD23F', '#C98A00', 2, 14], ['Hoa kosso', 'plume', '#E5334B', '#8E1228', 3], ['Lan cao nguyên', 'orchid', '#FF8FB8', '#FFFFFF', 4], ['Hoa cúc Abyssinia', 'daisy', '#FF8A1F', '#FFD23F', 2], ['Hoa đuốc đỏ', 'torch', '#E5334B', '#FFD23F', 3]],
    t: [['Cà phê Arabica', 'round', '#2F6A3A', '#E5334B', 4, { fruit: 1 }], ['Keo cao nguyên', 'umbrella', '#5E8A3A', '#8A5A2E', 3], ['Bách xù Ethiopia', 'cypress', '#2F6A4A', '#9AC0D8', 3], ['Bạch đàn', 'round', '#6A9A5A', '#B8C8B0', 3], ['Hoàng liên cọ', 'palm', '#4A8A3A', '#8A5A2E', 3]],
    d: [['Bàn lễ cà phê', 'bench', 'none', '#6B3A18', '#E5834B', 3], ['Trống kebero', 'barrel', 'none', '#8A4A22', '#F2E0B0', 3], ['Khăn dệt shamma', 'banner', 'none', '#FFFFFF', '#2E9B4A', 3]],
    b: [['Nhà thờ Gondar', 3, 2, 'castle', '#C98A5A', '#8A5A3A', '#F2C94C', 'flag', 4], ['Tháp đá Axum', 2, 3, 'tower', '#9A9484', '#6A6458', '#C9A22A', '', 3], ['Chợ Mercato', 2, 2, 'shop', '#E8B070', '#2E9B4A', '#E5334B', 'bunting', 3]],
    p: [['Khỉ gelada', 'monkey', '#A8703A', '#E5334B', '', 4], ['Sói Ethiopia', 'fox', '#E5834B', '#FFFFFF', '', 5], ['Dê núi Walia', 'goat', '#C9A878', '#6B4A2B', 'horns', 5], ['Linh dương nyala', 'deer', '#8A6A4A', '#F4E8D0', 'horns', 4], ['Đại bàng vàng', 'eagle', '#8A5A2E', '#F2C94C', '', 4]] });

  Cat.add('madagascar', { map: { d: ['mgflag', 'vanilla'], b: ['baobabs', 'tsingy'] },
    f: [['Dừa cạn Madagascar', 'star', '#FF8FB8', '#FFFFFF', 3, 5], ['Lan vani', 'orchid', '#FFF6D8', '#F2C94C', 4], ['Hoa ylang', 'plume', '#F2D84A', '#C99A1B', 3], ['Hoa phượng hoàng', 'torch', '#E5334B', '#FF8A1F', 3], ['Hoa lô hội đỏ', 'spike', '#E5334B', '#F2C94C', 3]],
    t: [['Phượng Madagascar', 'umbrella', '#E5334B', '#3E9B4F', 4], ['Cọ du khách', 'palm', '#2E9B4A', '#8A5A2E', 4], ['Cây ylang', 'tropic', '#4A8A3C', '#F2D84A', 3], ['Cọ raffia', 'tropic', '#4FAE4A', '#8A5A2E', 3], ['Bao báp Grandidier', 'baobab', '#6A9A4A', '#A8805A', 5]],
    d: [['Thuyền pirogue', 'boat', 'none', '#8A5A2E', '#2B9BD8', 3], ['Đèn dầu làng chài', 'lantern', 'none', '#F2A32C', '#8A5A2E', 3], ['Hộp đá quý', 'chest', 'diamond', '#6B4A2B', '#F2C94C', 3]],
    b: [['Nhà sàn Malagasy', 3, 2, 'stilt', '#C98A4B', '#2E9B4A', '#E5334B', 'vines', 4], ['Chợ vani', 2, 2, 'shop', '#FFF6D8', '#E5334B', '#2E9B4A', 'bunting', 3], ['Hải đăng Nosy Be', 2, 3, 'lighthouse', '#FFFFFF', '#E5334B', '#2B6BC8', '', 3]],
    p: [['Vượn cáo đuôi vòng', 'lemur', '#9AA3B0', '#FFFFFF', '', 5], ['Tắc kè hoa', 'lizard', '#5ACB6A', '#FFD23F', '', 4], ['Cầy fossa', 'cat', '#8A5A2E', '#C9A878', '', 4], ['Vượn cáo sifaka', 'lemur', '#FFFFFF', '#8A5A2E', '', 5], ['Ếch cà chua', 'frog', '#E5334B', '#FF8A1F', '', 3]] });
})(typeof window !== 'undefined' ? window : this);
