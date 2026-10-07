/* EWT Garden — kho đặc sản (phần B): Nông trại, Vườn anh đào, Rừng thu, Núi non, Sa mạc, Xứ kẹo, Đại dương, Thiên đường mây, Trạm vũ trụ.
   (Các món đã có từ trước được gán về đúng khu trong `map`; chỉ thêm món mới cho đủ 5 mỗi loại.) */
(function (root) {
  'use strict';
  var Cat = root.EWTGardenCatalog || (typeof require === 'function' ? require('./garden-catalog.js') : null); if (!Cat) return;

  Cat.add('farm', { map: { f: ['corn', 'carrot', 'tomato', 'wheat'], d: ['haybale', 'crates', 'rustfence', 'scarecrow', 'milkcan'], b: ['barnbig'], p: ['chick', 'lamb'] },
    f: [['Hoa hướng dương đồng', 'daisy', '#FFD23F', '#6B4A22', 2, 14]],
    t: [['Táo đồng quê', 'round', '#5FB04A', '#E23B3B', 2, { fruit: 1 }], ['Lê vàng', 'round', '#8ACB5A', '#F2C94C', 2, { fruit: 1 }], ['Anh đào chín đỏ', 'round', '#3F9A4A', '#C9143A', 3, { fruit: 1 }], ['Óc chó cổ thụ', 'round', '#3C7A3E', '#8A5A2E', 3, { fruit: 1 }], ['Cây liễu bên ao', 'willow', '#8ED08A', '#FFFFFF', 3]],
    b: [['Chuồng gà gỗ', 2, 2, 'house', '#E8C898', '#C9503A', '#8A5A2E', 'flowers', 2], ['Nhà kho nông cụ', 3, 2, 'barn', '#8A5A3A', '#4A3A2A', '#F2E8D0', 'chimney', 3], ['Cối xay lúa', 3, 3, 'mill', '#F2E8D0', '#C9503A', '#F2C94C', 'flag', 4], ['Nhà nông dân', 3, 2, 'house', '#F8E8C8', '#B8532E', '#4F8A5A', 'chimney+smoke+flowers', 4]],
    p: [['Gà trống', 'bird', '#E8543A', '#FFD23F', 'crown', 2], ['Bò sữa', 'hoof', '#FFFFFF', '#2A2A34', 'spots', 3], ['Heo hồng', 'bear', '#FFB8C8', '#FF8FA8', '', 2]] });

  Cat.add('sakura', { map: { f: ['kiku', 'camellia'], t: ['cherry', 'plum'], d: ['torii', 'stonelantern'], b: ['teahouse'], p: ['koifish'] },
    f: [['Hoa mai Nhật', 'star', '#FF9EC4', '#FFE36B', 2, 5], ['Hoa cẩm tú cầu tím', 'pom', '#9A7BE8', '#C9A8FF', 3], ['Hoa diên vĩ Nhật', 'orchid', '#6A6AE8', '#FFD23F', 4]],
    t: [['Anh đào rủ', 'willow', '#FFB7D0', '#FF8FB8', 4], ['Phong Nhật đỏ', 'maple', '#E2331F', '#F2A32C', 3], ['Bạch quả vàng', 'ginkgo', '#F2D23F', '#E8A82C', 3]],
    d: [['Chuông gió furin', 'gong', 'bell', '#B8861B', '#FFE9A8', 3], ['Đèn giấy tròn', 'lamp', 'flower', '#E23B3B', '#FFE9A8', 2], ['Bình sứ cành đào', 'vase', 'flower', '#F2F2F2', '#FF8FB8', 4]],
    b: [['Đền Shinto nhỏ', 2, 2, 'pavilion', '#E23B3B', '#3A2A2A', '#F2C94C', 'lantern', 3], ['Dojo võ đường', 3, 2, 'house', '#F2E8D0', '#3A3A44', '#8A5A2E', 'banner', 3], ['Tháp năm tầng', 2, 3, 'pagoda', '#F2E8D0', '#3A3A44', '#E23B3B', 'lantern', 5], ['Nhà trà ven hồ', 3, 2, 'dock', '#C98A4B', '#6B4A2B', '#E23B3B', 'lantern', 4]],
    p: [['Cáo Kitsune', 'fox', '#F2F2F2', '#E23B3B', 'star', 4], ['Mèo Maneki nhí', 'cat', '#FFFFFF', '#F2C94C', 'bow', 3], ['Hạc đỏ', 'bird', '#FFFFFF', '#E23B3B', 'crown', 4], ['Gấu mèo Tanuki', 'bear', '#8A7A6A', '#E8DED0', 'leaf', 4]] });

  Cat.add('autumn', { map: { f: ['mum', 'pumpkin'], t: ['maple'], d: ['pumpkinlamp', 'leafheap', 'campfired'], b: ['treehouse'], p: ['squirrel'] },
    f: [['Cúc vạn thọ cam', 'pom', '#F28A24', '#C9631A', 2], ['Hoa thu hải đường', 'poppy', '#E8543A', '#6B3A1A', 3], ['Bắp ngô rực rỡ', 'plume', '#F2C94C', '#C9A22A', 2]],
    t: [['Sồi lá đỏ', 'maple', '#D9531E', '#B8321C', 2], ['Bạch dương vàng', 'birch', '#F2C13E', '#E8A82C', 2], ['Hạt dẻ', 'round', '#C98A3A', '#8A5A2E', 3, { fruit: 1 }], ['Liễu thu', 'willow', '#E8A83A', '#C9631A', 3]],
    d: [['Bù nhìn mùa thu', 'pedestal', 'leaf', '#C98A4B', '#E2531F', 3], ['Giỏ nấm rừng', 'barrel', 'leaf', '#B8733A', '#E5334B', 2]],
    b: [['Nhà thu hoạch bí', 2, 2, 'barn', '#C9631A', '#6B3A1A', '#F2C94C', 'bunting', 3], ['Cối xay lá', 3, 3, 'mill', '#E8C898', '#8A3A2A', '#F2C94C', 'smoke', 4], ['Quán trà bí ngô', 2, 2, 'shop', '#F2D9B8', '#E8741A', '#8A5A2E', 'bunting+lantern', 4], ['Nhà gỗ lá đỏ', 3, 2, 'house', '#B8733A', '#C4321C', '#F2C94C', 'chimney+smoke', 3]],
    p: [['Cú rừng thu', 'owl', '#B8733A', '#F2E8D0', 'leaf', 3], ['Nhím', 'mouse', '#6B4A3A', '#F2D9B8', 'leaf', 2], ['Hươu thu', 'hoof', '#C98A3A', '#F2E8D0', 'antlers', 4], ['Cáo đỏ', 'fox', '#E8641A', '#FFFFFF', 'scarf', 3]] });

  Cat.add('mountain', { map: { f: ['edelweiss'], d: ['snowflag'], p: ['goat'] },
    f: [['Hoa núi tím', 'bell', '#9A7BE8', '#FFFFFF', 2], ['Long đởm xanh', 'star', '#3A5AE8', '#FFD23F', 3, 5], ['Hoa gai núi', 'thistle', '#B48CFF', '#7A4ACF', 3], ['Rêu đá đỏ', 'rosette', '#8FB88A', '#E8543A', 3]],
    t: [['Thông núi cao', 'conifer', '#2F6A4A', '#E8B84A', 2], ['Tùng bách đá', 'cypress', '#3C7A5A', '#E8B84A', 2], ['Thông đá phủ rêu', 'conifer', '#4F7A5A', '#BFE8FF', 3, { snow: 1 }], ['Bạch dương sườn núi', 'birch', '#9AD07A', '#F2C94C', 3], ['Cây hạt thông cổ', 'joshua', '#4F8A5A', '#E8B84A', 4]],
    d: [['Cọc đá chỉ đường', 'cairn', 'mountain', '#9AA3AE', '#FFFFFF', 2], ['Rìu và củi', 'crate', 'flame', '#8A5A2E', '#FF8A2A', 2], ['Chuông núi', 'gong', 'bell', '#8A8F9A', '#F2C94C', 3], ['Đèn bão leo núi', 'lamp', 'mountain', '#4A4A58', '#FFE9A8', 3]],
    b: [['Nhà nghỉ trên núi', 3, 2, 'house', '#C98A4B', '#6B4A2B', '#E23B3B', 'chimney+smoke+snow', 3], ['Cáp treo trạm', 2, 3, 'tower', '#8A929C', '#4A5A6A', '#E23B3B', 'flag', 4], ['Hang đá ẩn', 3, 2, 'cave', '#8A929C', '#4A5058', '#FF8A2A', 'snow', 3], ['Đài thiên văn núi', 2, 2, 'dome', '#E8ECF1', '#4F6AA8', '#F2C94C', 'stars', 4], ['Lều trại thám hiểm', 2, 2, 'tent', '#4F8A5A', '#E23B3B', '#F2C94C', 'flag', 3]],
    p: [['Dê núi trắng', 'hoof', '#F2F2F2', '#B8B2A4', 'horns', 3], ['Gấu núi', 'bear', '#6B4A3A', '#C9A66A', '', 3], ['Chim ưng núi', 'bird', '#6B5A4A', '#F2E8D0', 'wings', 4], ['Chó cứu hộ núi', 'dog', '#C9884A', '#FFFFFF', 'scarf', 3]] });

  Cat.add('desert', { map: { f: ['aloe', 'desertrose'], t: ['saguaro'], d: ['urn', 'camelstatue'], b: ['pyramidbig'], p: ['camel'] },
    f: [['Xương rồng lê gai', 'paddle', '#FFB02E', '#8FB45A', 2], ['Hoa lưỡi hổ', 'rosette', '#6FA85A', '#F2C94C', 2], ['Hoa sa mạc đỏ', 'torch', '#E8431F', '#FFD23F', 3]],
    t: [['Cọ chà là', 'palm', '#4FAE4A', '#8A4A22', 2], ['Cây Joshua gai', 'joshua', '#8FB45A', '#F2C94C', 3], ['Cây keo sa mạc', 'umbrella', '#9AAE5A', '#F2C94C', 2], ['Xương rồng nến', 'cactus', '#6FA85A', '#FF8FB8', 3]],
    d: [['Cột đá tượng Sphinx', 'pedestal', 'eye', '#E8C888', '#8A5A2E', 4], ['Lều ngủ sa mạc', 'tent', 'star', '#C9503A', '#F2C94C', 3], ['Đèn lồng Ả Rập', 'lamp', 'moon', '#B8861B', '#FFE9A8', 3]],
    b: [['Ốc đảo trạm nghỉ', 3, 2, 'pavilion', '#E8C888', '#4F8A5A', '#F2C94C', 'sand', 3], ['Lều hoàng gia sa mạc', 3, 2, 'tent', '#F2E8D0', '#C9503A', '#F2C94C', 'flag+sand', 4], ['Đền thờ cát', 3, 3, 'temple', '#E8C888', '#C9A22A', '#2E6BD8', 'sand', 4], ['Cung điện Ả Rập', 3, 3, 'dome', '#F2D9A8', '#2E8B9A', '#F2C94C', 'lantern+sand', 5]],
    p: [['Bọ cạp nhí', 'bug', '#B8733A', '#8A4A22', 'antenna', 3], ['Rắn hổ mang nhí', 'snake', '#C9A24A', '#6B4A22', 'crown', 4], ['Thằn lằn cát', 'lizard', '#D9B058', '#B8861B', '', 2], ['Cáo sa mạc', 'fox', '#E8C888', '#FFFFFF', 'wings', 4]] });

  Cat.add('candy', { map: { f: ['swirlflower'], t: ['candytree'], d: ['candycane', 'lollipopd'], b: ['gingerbread'] },
    f: [['Hoa kẹo bông', 'pom', '#FFB3D0', '#FFFFFF', 2], ['Hoa kẹo dẻo', 'daisy', '#FF8FB8', '#FFD23F', 1, 8], ['Hoa bạc hà', 'star', '#7FE8C8', '#FFFFFF', 3, 6], ['Hoa socola', 'poppy', '#7A4A32', '#F2D9B8', 3]],
    t: [['Cây kẹo mút xoắn', 'candy', '#FF6B9A', '#FFFFFF', 2], ['Cây kẹo bông xanh', 'cloud', '#9AE8F2', '#FFB3D0', 3], ['Cây bánh quy', 'round', '#E8B070', '#7A4A32', 3, { fruit: 1 }], ['Cây kem ốc quế', 'candy', '#F2E8C8', '#FF8FB8', 4]],
    d: [['Ly kem khổng lồ', 'pedestal', 'heart', '#FFB3D0', '#E23B3B', 3], ['Hộp bánh quy', 'chest', 'star', '#E8B070', '#FFFFFF', 2], ['Đèn kẹo cây', 'lamp', 'diamond', '#FF6B9A', '#FFE9A8', 3]],
    b: [['Cửa hàng bánh ngọt', 2, 2, 'shop', '#FFD9E6', '#FF6B9A', '#FFFFFF', 'bunting', 3], ['Lâu đài bánh kem', 3, 3, 'castle', '#FFE9F2', '#FF6B9A', '#FFD23F', 'banner', 5], ['Nhà xưởng socola', 3, 2, 'barn', '#7A4A32', '#E8B070', '#FFFFFF', 'chimney+smoke', 4], ['Nhà kẹo mút', 2, 2, 'hut', '#FFB3D0', '#FF6B9A', '#FFFFFF', 'flowers', 3]],
    p: [['Mèo bánh quy', 'cat', '#E8B070', '#FFFFFF', 'bow', 3], ['Thỏ kẹo dẻo', 'bunny', '#FFB3D0', '#FFFFFF', 'bow', 3], ['Gấu kẹo dẻo', 'bear', '#FF8FB8', '#FFD9E6', 'hat', 3], ['Hamster socola', 'mouse', '#7A4A32', '#F2D9B8', 'star', 3], ['Vịt kem dâu', 'duck', '#FFB3D0', '#FF6B9A', 'crown', 4]] });

  Cat.add('ocean', { map: { f: ['anemone', 'kelp'], t: ['coraltree'], d: ['shelld', 'anchor', 'treasured'], b: ['submarine'], p: ['seahorse', 'jellyfish'] },
    f: [['San hô hoa sao', 'star', '#FF7A9A', '#FFE36B', 3, 8], ['Hải quỳ tím', 'anemone', '#B48CFF', '#FFD23F', 3], ['Hoa biển xanh', 'fern', '#5CE8D8', '#2E8B9A', 3]],
    t: [['San hô cành hồng', 'coral', '#FF7A9A', '#FFB04A', 3], ['San hô sừng nai', 'coral', '#FFB04A', '#FF7A9A', 4], ['Rong biển khổng lồ', 'willow', '#3FAE5A', '#9BE8B0', 3], ['Cây ngọc trai', 'cloud', '#F2F2F2', '#FFB3D0', 4]],
    d: [['Vỏ sò khổng lồ', 'pedestal', 'pearl', '#FFD6C8', '#FFFFFF', 3], ['Bánh lái tàu đắm', 'gong', 'wheel', '#8A5A2E', '#F2C94C', 4]],
    b: [['Lâu đài cát dưới biển', 3, 3, 'castle', '#F2D9A8', '#E8854A', '#5CE8D8', 'shells', 4], ['Tàu đắm cổ', 3, 2, 'ship', '#6B4A2B', '#C9D0D9', '#F2C94C', 'vines', 5], ['Cung điện san hô', 3, 3, 'dome', '#FFB3C8', '#FF7A9A', '#FFE36B', 'shells', 5], ['Nhà ốc biển', 2, 2, 'hut', '#FFD6C8', '#E8854A', '#FFFFFF', 'shells', 3]],
    p: [['Cá hề', 'fish', '#FF8A2A', '#FFFFFF', 'spots', 2], ['Rùa biển xanh', 'turtle', '#3F9A7A', '#C9E8C8', '', 3], ['Cá voi nhí', 'whale', '#4F7AB8', '#EAF4FA', 'star', 4]] });

  Cat.add('sky', { map: { f: ['cloudflower'], d: ['cloudpuff', 'rainbowd'], b: ['cloudhouse'], p: ['unicorn'] },
    f: [['Hoa mây hồng', 'pom', '#FFD6E8', '#FFFFFF', 3], ['Hoa cầu vồng', 'plume', '#FF8FB8', '#7FD3FF', 3], ['Hoa sao ban ngày', 'star', '#FFE36B', '#FFFFFF', 2, 8], ['Hoa nắng nhẹ', 'daisy', '#FFF3A0', '#FFD23F', 2]],
    t: [['Cây mây bông', 'cloud', '#FFFFFF', '#FFD6E8', 2], ['Cây cầu vồng', 'candy', '#7FD3FF', '#FF8FB8', 3], ['Cây mây tím', 'cloud', '#E8D4FF', '#B48CFF', 3], ['Cây pha lê trời', 'crystal', '#BFE8FF', '#FFFFFF', 4], ['Cây gió tinh linh', 'blossom', '#FFE9F2', '#FFFFFF', 3]],
    d: [['Khinh khí cầu mini', 'banner', 'cloud', '#FF8FB8', '#FFFFFF', 3], ['Chuông gió mây', 'gong', 'bell', '#BFE8FF', '#F2C94C', 3], ['Đèn sao trời', 'lamp', 'star', '#7FB8E8', '#FFF3A0', 3]],
    b: [['Tháp mây ngọc', 2, 3, 'tower', '#FFFFFF', '#FF8FB8', '#FFE36B', 'stars', 4], ['Đền thiên sứ', 3, 2, 'temple', '#FFFFFF', '#BFE8FF', '#F2C94C', 'stars', 4], ['Cung điện cầu vồng', 3, 3, 'castle', '#FFFFFF', '#7FD3FF', '#FFD23F', 'banner+stars', 5], ['Nhà bông gòn', 2, 2, 'hut', '#FFFFFF', '#FFB3D0', '#7FD3FF', 'stars', 2]],
    p: [['Chim én trời', 'bird', '#7FD3FF', '#FFFFFF', 'wings', 3], ['Mèo mây', 'cat', '#FFFFFF', '#BFE8FF', 'wings', 4], ['Cừu mây', 'hoof', '#FFFFFF', '#E8F4FF', 'glow', 4], ['Rồng gió', 'lizard', '#9AE8F2', '#FFFFFF', 'wings', 5]] });

  Cat.add('space', { map: { f: ['alienflower'], t: ['crystaltree'], d: ['astronaut', 'ufo', 'satellited'], b: ['rocketbig', 'observatory'], p: ['alien'] },
    f: [['Hoa tinh vân', 'pom', '#7A4ACF', '#FF5CC8', 4], ['Hoa sao chổi', 'plume', '#7AF2FF', '#B48CFF', 3], ['Hoa tinh thể trăng', 'crystal', '#E8E8FF', '#9AA3FF', 4], ['Hoa vũ trụ xanh', 'star', '#5CE8FF', '#FFFFFF', 3, 6]],
    t: [['Cây thiên thạch', 'dead', '#7A8394', '#FF8A2A', 3], ['Cây tinh vân tím', 'hex', '#B48CFF', '#5CE8FF', 4], ['Cây sao băng', 'crystal', '#FFE36B', '#FFFFFF', 4], ['Cây oxy xanh', 'tropic', '#5CE8B0', '#FFE36B', 3]],
    d: [['Bàn điều khiển', 'chest', 'bolt', '#4A5486', '#5CE8FF', 3], ['Cột tín hiệu', 'obelisk', 'star', '#6A7384', '#FF5CC8', 3]],
    b: [['Trạm năng lượng', 3, 2, 'tech', '#2C3170', '#5CE8FF', '#FF5CC8', 'solar+stars', 4], ['Nhà kính Sao Hỏa', 3, 2, 'dome', '#CFE8F5', '#E8543A', '#F2C94C', 'stars', 4], ['Trạm radar', 2, 3, 'tower', '#4A5486', '#5CE8FF', '#FF5CC8', 'dish+stars', 4]],
    p: [['Mèo phi hành gia', 'cat', '#FFFFFF', '#B48CFF', 'helmet', 4], ['Chó robot sao', 'dog', '#9AA3B2', '#5CE8FF', 'antenna', 4], ['Cú vũ trụ', 'owl', '#4A5486', '#FFE36B', 'star', 4], ['Thỏ Mặt Trăng', 'bunny', '#E8E8FF', '#9AA3FF', 'glow', 5]] });
})(typeof window !== 'undefined' ? window : this);
