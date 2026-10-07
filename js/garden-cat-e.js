/* EWT Garden — kho đặc sản (phần E): 8 khu văn hoá quốc gia mới — Hàn Quốc, Thổ Nhĩ Kỳ, Úc, Canada, Mexico, Brazil, Ai Cập, Ma-rốc.
   Mỗi khu 5 hoa · 5 cây · 5 trang trí · 5 công trình · 5 thú cưng (món đã vẽ ở garden-world7/8 được gán về khu trong `map`). Chỉ ghi điều chắc chắn đúng về văn hoá. */
(function (root) {
  'use strict';
  var Cat = root.EWTGardenCatalog || (typeof require === 'function' ? require('./garden-catalog.js') : null); if (!Cat) return;

  Cat.add('korea', { map: { d: ['krflag', 'kimchijar', 'jangseung', 'dolhareubang'], b: ['gyeongbok'] },
    f: [['Hoa mugunghwa', 'star', '#F8B6DA', '#B02E7A', 3, 5], ['Đỗ quyên Jindallae', 'pom', '#FF8FB8', '#FFD0E2', 2], ['Cúc vàng Hàn Quốc', 'daisy', '#FFD23F', '#B8730A', 2, 14], ['Hoa mơ Hàn', 'paper', '#FFC4D8', '#FFE08A', 3], ['Bách hợp trắng', 'lily', '#FFFFFF', '#FFD23F', 3]],
    t: [['Thông đỏ Hàn Quốc', 'conifer', '#2F7A4A', '#B8451F', 3], ['Cây hồng Hàn', 'round', '#4FA84F', '#FF8A1F', 3, { fruit: 1 }], ['Anh đào Jeju', 'blossom', '#FFC4D8', '#FF8FB8', 3], ['Bạch quả Hàn Quốc', 'ginkgo', '#F2C94C', '#C9A22A', 3], ['Phong đỏ Naejangsan', 'maple', '#D9331F', '#F2A32C', 3]],
    d: [['Đèn lồng cheongsachorong', 'lantern', 'none', '#E5334B', '#F2C94C', 3]],
    b: [['Làng hanok', 3, 2, 'pavilion', '#F2E9D2', '#454953', '#B83A2E', 'lantern', 4], ['Tháp Namsan Seoul', 2, 3, 'tower', '#E8EDF4', '#C9D0DB', '#E5334B', 'flag', 4], ['Chùa Bulguksa', 3, 2, 'pagoda', '#F2E9D2', '#454953', '#B83A2E', 'lantern', 5], ['Chợ Namdaemun', 2, 2, 'shop', '#E8B070', '#E5334B', '#2B6BC8', 'bunting', 3]],
    p: [['Chó Jindo', 'dog', '#F4E4C8', '#FFFFFF', 'scarf', 3], ['Chim hỉ thước', 'bird', '#1E2A3A', '#FFFFFF', '', 3], ['Hổ Baekdu', 'tiger', '#F2B84A', '#2A2A34', '', 4], ['Hươu sao Jeju', 'deer', '#C98A4B', '#FFF6E8', 'spots', 3], ['Haetae nhí', 'lion', '#E8C84A', '#C98A00', 'horns+glow', 5]] });

  Cat.add('turkey', { map: { d: ['trflag', 'turkishtea', 'evileye', 'turkishlamp'], b: ['hagiasophia'] },
    f: [['Tulip Thổ Nhĩ Kỳ', 'cup', '#E5334B', '#FFD23F', 2], ['Lan dạ hương Thổ', 'spike', '#8E5FC4', '#E8D8FF', 2], ['Hồng Isparta', 'pom', '#FF8FB8', '#E5334B', 3], ['Anh túc Anatolia', 'poppy', '#E5334B', '#1E1E1E', 2], ['Cẩm chướng Thổ', 'pom', '#FF5C7A', '#FFE0EC', 2]],
    t: [['Ô liu Aegean', 'round', '#6A8A5A', '#2A3A1A', 3, { fruit: 1 }], ['Tuyết tùng Taurus', 'conifer', '#2F6A4A', '#9AC0D8', 3], ['Hạt dẻ cười Gaziantep', 'round', '#7FB05A', '#C9D56A', 3, { fruit: 1 }], ['Thông Aleppo', 'umbrella', '#3F7A4A', '#E8B84A', 3], ['Bách Istanbul', 'cypress', '#2F6A4A', '#F2C94C', 3]],
    d: [['Bình gốm Çanakkale', 'vase', 'flower', '#C8553A', '#2B6BC8', 3]],
    b: [['Nhà gỗ Ottoman', 3, 2, 'house', '#C8553A', '#8A3A2A', '#F2C94C', 'lantern', 4], ['Tháp Galata', 2, 3, 'tower', '#E8DCC0', '#5E7A9A', '#E5334B', 'flag', 4], ['Chợ Grand Bazaar', 3, 2, 'shop', '#E8B070', '#2B6BC8', '#E5334B', 'bunting', 4], ['Nhà tắm hammam', 2, 2, 'dome', '#E8DCC0', '#5E7A9A', '#C99A1B', '', 4]],
    p: [['Mèo Van', 'cat', '#FFFFFF', '#E8B070', '', 4], ['Chó Kangal', 'dog', '#C9A06B', '#3A2A1A', '', 3], ['Dê Angora', 'goat', '#FFFFFF', '#B8A890', '', 3], ['Cò trắng', 'crane', '#FFFFFF', '#2A2A34', '', 3], ['Cá heo Bosphorus', 'whale', '#6FA8D8', '#EAF4FA', 'glow', 4]] });

  Cat.add('australia', { map: { d: ['auflag', 'boomerang', 'kangaroosign'], b: ['sydneyopera', 'uluru'] },
    f: [['Keo vàng wattle', 'pom', '#FFD23F', '#C99A1B', 2], ['Hoa banksia', 'torch', '#E8742E', '#FFD23F', 3], ['Chân chuột kangaroo', 'spike', '#E5334B', '#2E9B4A', 3], ['Hoa waratah đỏ', 'plume', '#D61F3A', '#8E1228', 3], ['Hoa sa mạc Sturt', 'star', '#E5334B', '#1E1E1E', 3, 6]],
    t: [['Bạch đàn gum', 'round', '#7A9A6A', '#C9D6B0', 3, { trunk: '#F2EEE0' }], ['Cây chai bottle', 'baobab', '#6A9A4A', '#F2A32C', 4], ['Dương xỉ cây Úc', 'tropic', '#4FA84F', '#A8D65F', 3], ['Cây kèn banksia', 'joshua', '#7A9A4A', '#E8742E', 3], ['Tràm vỏ giấy', 'birch', '#9ABA6A', '#F2C94C', 3]],
    d: [['Hộp thư đỏ vùng quê', 'barrel', 'star', '#E5334B', '#FFFFFF', 2], ['Đèn bão outback', 'hurricane', 'none', '#FF9A2E', '#4A4A58', 3]],
    b: [['Trang trại Outback', 3, 2, 'barn', '#C8553A', '#8A8F9A', '#FFFFFF', '', 3], ['Quán cà phê Bondi', 2, 2, 'shop', '#4FB4D8', '#FFFFFF', '#E5334B', 'bunting', 3], ['Hải đăng Cape Byron', 2, 3, 'lighthouse', '#FFFFFF', '#E5334B', '#8A8F9A', '', 4]],
    p: [['Chuột túi kangaroo', 'kangaroo', '#C98A5C', '#F2D2A0', '', 3], ['Gấu koala', 'koala', '#9AA3AE', '#E8EDF4', '', 4], ['Thú mỏ vịt', 'platypus', '#8A6A4A', '#E8D4B0', '', 4], ['Đà điểu emu', 'emu', '#6B5A4A', '#B8A890', '', 3], ['Vẹt mào cockatoo', 'parrot', '#FFFFFF', '#FFD23F', '', 3]] });

  Cat.add('canada', { map: { d: ['caflag', 'maplesyrup', 'totempole', 'canoe'], b: ['cntower'] },
    f: [['Trillium trắng', 'lily', '#FFFFFF', '#FFD23F', 3], ['Cúc dại thảo nguyên', 'daisy', '#FFD23F', '#8A5A2E', 2, 12], ['Bồ công anh Canada', 'pom', '#FFD23F', '#C99A1B', 2], ['Hoa lửa fireweed', 'spike', '#E55CA8', '#8E2E6A', 3], ['Chuông núi Rocky', 'bell', '#C45CD8', '#FFE0F6', 3]],
    t: [['Phong đường', 'maple', '#D5381E', '#F2A32C', 3], ['Phong đỏ rực', 'maple', '#F26A1E', '#B8332A', 3], ['Thông Ponderosa', 'conifer', '#2F6A4A', '#B8733A', 3], ['Vân sam tuyết', 'conifer', '#3F7A5A', '#F4FAFF', 3, { snow: 1 }], ['Bạch dương giấy', 'birch', '#C9D66A', '#F2C94C', 3]],
    d: [['Hộp thư đỏ Canada', 'barrel', 'leaf', '#D52B1E', '#FFFFFF', 2]],
    b: [['Quán xi-rô phong', 3, 2, 'shop', '#B8733A', '#D52B1E', '#F2C94C', 'bunting', 3], ['Lâu đài Frontenac', 3, 3, 'castle', '#D9C9A0', '#2E7A6A', '#F2C94C', 'flag', 5], ['Nhà gỗ trượt tuyết Banff', 3, 2, 'house', '#C98A4B', '#6B4A2B', '#D52B1E', 'snow', 4], ['Nhà thuyền hồ Louise', 2, 2, 'dock', '#C98A4B', '#2E7A6A', '#4FB4D8', '', 3]],
    p: [['Nai sừng tấm', 'moose', '#6B4A2F', '#B8946A', '', 4], ['Hải ly', 'beaver', '#8A5A3A', '#E8C898', '', 3], ['Gấu grizzly', 'bear', '#7A5A3A', '#C9A27A', '', 3], ['Cú tuyết Canada', 'owl', '#FFFFFF', '#CFD8E6', '', 3], ['Sóc đỏ', 'squirrel', '#D9602E', '#F6DDB8', '', 3]] });

  Cat.add('mexico', { map: { d: ['sombrero', 'pinata', 'tacocart', 'altar'], b: ['chichen'] },
    f: [['Vạn thọ cempasúchil', 'pom', '#FF9A1F', '#E8742E', 3], ['Dahlia Mexico', 'pom', '#FF5C8A', '#FFD23F', 3], ['Lan vani', 'orchid', '#FFFFFF', '#FFD23F', 3], ['Xương rồng nở hoa', 'paddle', '#E5334B', '#6A9A4A', 3], ['Hoa giấy bougainvillea', 'paper', '#E5338A', '#FFD0EA', 2]],
    t: [['Xương rồng saguaro', 'cactus', '#5E9A4A', '#FFD0E0', 3], ['Cọ Mexico', 'palm', '#4FAE4A', '#8A5A2E', 2], ['Bơ avocado', 'round', '#3F8A4A', '#6A3A2A', 3, { fruit: 1 }], ['Xoài Mexico', 'round', '#4FA84F', '#FFB02E', 3, { fruit: 1 }], ['Ceiba thiêng Maya', 'baobab', '#6A9A4A', '#F2C94C', 4]],
    d: [['Cặp maracas', 'maracas', 'none', '#E5334B', '#2E9B6A', 2]],
    b: [['Chợ Oaxaca', 3, 2, 'shop', '#F2A32C', '#E5334B', '#2E9B6A', 'bunting', 3], ['Nhà thờ Mexico', 3, 3, 'dome', '#F2E0B0', '#B8553A', '#F2C94C', '', 4], ['Trang trại tequila', 3, 2, 'barn', '#C8553A', '#8A5A2E', '#F2C94C', '', 3], ['Quảng trường mariachi', 2, 2, 'pavilion', '#E5334B', '#2B6BC8', '#F2C94C', 'lantern', 3]],
    p: [['Chó Chihuahua', 'dog', '#E8C898', '#FFFFFF', 'bow', 3], ['Kỳ nhông axolotl', 'axolotl', '#FFB0D0', '#FF7AB6', '', 4], ['Báo đốm jaguar', 'tiger', '#F2B84A', '#2A2A34', '', 4], ['Vẹt macaw đỏ', 'parrot', '#E5334B', '#2B6BC8', '', 3], ['Bướm vua monarch', 'butterfly', '#FF8A1F', '#1E1E26', '', 3]] });

  Cat.add('brazil', { map: { d: ['braball', 'toucanpost', 'victoria'], b: ['christredeemer'] },
    f: [['Lan Cattleya', 'orchid', '#E55CC8', '#FFD23F', 4], ['Hoa ipê vàng', 'bell', '#FFD23F', '#E8A82C', 3], ['Chuối cảnh heliconia', 'torch', '#E5334B', '#FFD23F', 3], ['Dứa cảnh bromeliad', 'rosette', '#E5334B', '#FFD23F', 3], ['Hoa lạc tiên', 'star', '#9B5CD8', '#FFFFFF', 3, 10]],
    t: [['Cọ açaí', 'palm', '#4FAE4A', '#7A2E8A', 3], ['Hạt Brazil', 'round', '#2F8A4A', '#8A5A2E', 3, { fruit: 1 }], ['Ipê vàng', 'blossom', '#FFD23F', '#F2A32C', 3], ['Ca cao', 'round', '#3F8A4A', '#C8553A', 3, { fruit: 1 }], ['Rễ chống Amazon', 'mangrove', '#2F8A4A', '#F2C94C', 4]],
    d: [['Trống surdo samba', 'barrel', 'note', '#FFD23F', '#2E9B4A', 3], ['Thùng cà phê Brazil', 'crate', 'leaf', '#8A5A2E', '#2E9B4A', 2]],
    b: [['Cầu thang màu sắc Rio', 3, 2, 'shop', '#FFD23F', '#2E9B4A', '#2B6BC8', 'bunting', 3], ['Nhà thờ Salvador', 3, 3, 'castle', '#F2E8D0', '#B8553A', '#F2C94C', '', 4], ['Sân vận động Maracanã', 3, 3, 'tech', '#F4F4F0', '#2E9B4A', '#FFD23F', 'flag', 5], ['Nhà gỗ Amazon trên cọc', 3, 2, 'stilt', '#C98A4B', '#6B8A3A', '#E5334B', '', 4]],
    p: [['Chim toucan', 'toucan', '#1E1E26', '#FFFFFF', '', 4], ['Lười ba ngón', 'sloth', '#B8A890', '#E8DCC8', '', 4], ['Capybara', 'capybara', '#8A6A4A', '#B8946A', '', 3], ['Vẹt macaw xanh vàng', 'parrot', '#2B6BC8', '#FFD23F', '', 3], ['Khỉ sư tử vàng', 'monkey', '#F2A32C', '#FFD23F', '', 4]] });

  Cat.add('egypt', { map: { d: ['ankh', 'scarab', 'obelisk', 'papyrus', 'eyehorus'], b: ['giza'] },
    f: [['Sen xanh sông Nile', 'lotus', '#6FA8F5', '#FFD23F', 4], ['Sen trắng', 'lotus', '#FFFFFF', '#FFD23F', 3], ['Hoa karkadé', 'star', '#C1272D', '#F2C94C', 3, 5], ['Nhài Ai Cập', 'star', '#FFFFFF', '#FFE08A', 2, 5], ['Lan hương sa mạc', 'spike', '#9B5CD8', '#E8D8FF', 2]],
    t: [['Chà là sông Nile', 'palm', '#4FAE4A', '#8A3A18', 3], ['Sung Ai Cập', 'round', '#6A9A4A', '#C9A25A', 3, { fruit: 1 }], ['Keo sa mạc', 'umbrella', '#8CB05A', '#F2C94C', 2], ['Tamarisk', 'willow', '#8CB05A', '#FFB0D0', 2], ['Cọ doum', 'palm', '#6FA84A', '#B8733A', 3]],
    d: [],
    b: [['Đền Abu Simbel', 3, 3, 'temple', '#E8C888', '#CFAE5E', '#2E9BB0', '', 5], ['Thuyền buồm felucca', 3, 2, 'ship', '#C98A4B', '#FFFFFF', '#2E9BB0', '', 3], ['Chợ Khan el-Khalili', 3, 2, 'shop', '#E8B070', '#2E9BB0', '#C1272D', 'bunting', 3], ['Nhà bùn Nubia', 2, 2, 'hut', '#E8A870', '#C98A4B', '#2E9BB0', '', 3]],
    p: [['Lạc đà Ai Cập', 'camel', '#D9B073', '#F2E0B0', '', 4], ['Mèo Mau Ai Cập', 'cat', '#E8C888', '#8A5A2E', '', 4], ['Rắn hổ mang Ai Cập', 'snake', '#6B4A2F', '#E8C888', 'crown', 4], ['Cò quăm thiêng', 'crane', '#FFFFFF', '#2A2A34', '', 3], ['Hà mã sông Nile', 'hippo', '#8A7A9A', '#F2B8C8', '', 4]] });

  Cat.add('morocco', { map: { d: ['maflag', 'moroccanteapot', 'moroccanlamp', 'carpet'], b: ['koutoubia'] },
    f: [['Hồng Dades', 'pom', '#FF8FB8', '#E5334B', 3], ['Hoa cam Marrakech', 'star', '#FFFFFF', '#FFD23F', 2, 5], ['Oải hương Atlas', 'spike', '#9B7BE0', '#C9B6F2', 2], ['Hạnh nhân Tafraoute', 'paper', '#FFE0EC', '#FFB0CC', 3], ['Nghệ tây Morocco', 'cup', '#B66CFF', '#E5334B', 3]],
    t: [['Argan', 'umbrella', '#6A8A3A', '#E8C84A', 4], ['Cam đắng', 'round', '#3F8A4A', '#FF8A1F', 3, { fruit: 1 }], ['Cọ Marrakech', 'palm', '#4FAE4A', '#8A5A2E', 3], ['Tuyết tùng Atlas', 'conifer', '#2F6A5A', '#9AC0D8', 3], ['Ô liu Fez', 'round', '#6A8A5A', '#2A3A1A', 3, { fruit: 1 }]],
    d: [['Đài phun nước zellige', 'fountain', 'none', '#2B6BC8', '#FFFFFF', 3]],
    b: [['Cổng thành Marrakech', 3, 2, 'castle', '#D9906A', '#8A4A2A', '#C1272D', 'flag', 4], ['Chợ Souk Marrakech', 3, 2, 'shop', '#D9906A', '#C1272D', '#2E9B6A', 'bunting', 4], ['Nhà xanh Chefchaouen', 2, 2, 'house', '#7FB4E8', '#2B6BC8', '#F2C94C', '', 3], ['Pháo đài Ait Benhaddou', 3, 3, 'castle', '#C8855A', '#8A4A2A', '#F2C94C', '', 5]],
    p: [['Dê leo cây argan', 'goat', '#B8793C', '#F2E0B0', '', 4], ['Cáo fennec', 'fox', '#F2D2A0', '#FFFFFF', '', 4], ['Khỉ Barbary', 'monkey', '#B8946A', '#E8D2B0', '', 3], ['Hồng hạc', 'flamingo', '#FF8FB8', '#FFD0E0', '', 3], ['Chim đầu rìu', 'hoopoe', '#E8A060', '#222222', '', 3]] });
})(typeof window !== 'undefined' ? window : this);
