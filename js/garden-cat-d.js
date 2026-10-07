/* EWT Garden — kho đặc sản (phần D): 15 khu văn hoá quốc gia (món đã có: hoa, thú, công trình, cờ + vật phẩm được gán về khu trong `map`). Chỉ ghi điều chắc chắn đúng về văn hoá. */
(function (root) {
  'use strict';
  var Cat = root.EWTGardenCatalog || (typeof require === 'function' ? require('./garden-catalog.js') : null); if (!Cat) return;

  Cat.add('vietnam', { map: { f: ['peachblossom'], d: ['vnflag', 'conicalhat'], b: ['onepillar'], p: ['buffalo'] },
    f: [['Sen hồng quốc hoa', 'lotus', '#FF9EC4', '#FFE36B', 3], ['Mai vàng ngày Tết', 'star', '#FFD23F', '#E58A1B', 3, 5], ['Cúc đại đóa ngày Tết', 'pom', '#F28A24', '#C9631A', 2], ['Hoa giấy phố cổ', 'paper', '#FF5CA8', '#FFD23F', 3]],
    t: [['Đa làng cổ thụ', 'mangrove', '#3C8A4A', '#E8B84A', 3], ['Dừa miền Tây', 'palm', '#3FAE4A', '#8A5A2E', 2], ['Tre làng', 'bamboo', '#6FB04A', '#F2C94C', 2], ['Xoài cát chín vàng', 'round', '#4FAE4A', '#F2B632', 2, { fruit: 1 }], ['Bưởi năm roi', 'round', '#5FB04A', '#C9D84A', 3, { fruit: 1 }]],
    d: [['Trống đồng Đông Sơn', 'barrel', 'star', '#B8733A', '#F2C94C', 4], ['Đèn ông sao Trung thu', 'starlamp', 'none', '#E23B3B', '#FFD23F', 2], ['Cổng làng', 'arch', 'bamboo', '#8A5A2E', '#C9A22A', 3]],
    b: [['Nhà rường Huế', 3, 2, 'house', '#E8D4B0', '#6B4A2B', '#C9503A', 'lantern', 4], ['Tháp Rùa Hồ Gươm', 2, 2, 'pavilion', '#E8E2D0', '#6B8A4A', '#F2C94C', 'vines', 4], ['Chùa Thiên Mụ', 2, 3, 'pagoda', '#E8D4B0', '#C98A4B', '#E23B3B', 'lantern', 5], ['Chợ nổi miền Tây', 3, 2, 'dock', '#C98A4B', '#6B4A2B', '#2E7D4F', 'bunting', 4]],
    p: [['Chó Phú Quốc', 'dog', '#B8844A', '#2A2A34', 'scarf', 3], ['Voi Tây Nguyên', 'elephant', '#9AA3AE', '#F2B8C8', 'tusks', 4], ['Sếu đầu đỏ', 'crane', '#FFFFFF', '#2A2A34', '', 4], ['Rùa Hồ Gươm', 'turtle', '#5A7A5A', '#C9D8A8', 'glow', 5]] });

  Cat.add('thailand', { map: { f: ['goldenshower'], d: ['thflag', 'thelephant'], b: ['wat'], p: ['thaielephant'] },
    f: [['Lan Thái tím', 'orchid', '#B48CFF', '#F2E8FF', 4], ['Sen Thái', 'lotus', '#FFB8D0', '#FFE36B', 3], ['Dâm bụt Thái', 'poppy', '#E8431F', '#FFD23F', 3], ['Nhài Thái trắng', 'star', '#FFFFFF', '#F2C94C', 2, 7]],
    t: [['Cọ Thái', 'palm', '#3FAE4A', '#8A5A2E', 2], ['Bồ đề cổ thụ', 'mangrove', '#3C8A4A', '#E8B84A', 3], ['Dừa xiêm', 'palm', '#5FC25A', '#F2C94C', 3], ['Xoài Thái', 'round', '#4FAE4A', '#F2B632', 2, { fruit: 1 }], ['Chuối Thái', 'tropic', '#3FAE5A', '#FFD23F', 3]],
    d: [['Tượng Phật nhỏ', 'buddha', 'none', '#F2C94C', '#FFE9A8', 4], ['Đèn trời Loy Krathong', 'skylamp', 'none', '#F28A24', '#FFE9A8', 3], ['Chuông chùa', 'gong', 'bell', '#B8861B', '#F2C94C', 3]],
    b: [['Nhà sàn Thái', 3, 2, 'stilt', '#C98A4B', '#B8532E', '#2E8B6A', 'lantern', 3], ['Tháp chùa vàng', 2, 3, 'pagoda', '#F2E8D0', '#E8A82C', '#C9431F', 'lantern', 5], ['Chợ nổi Damnoen', 3, 2, 'dock', '#C98A4B', '#6B4A2B', '#E8431F', 'bunting', 4], ['Cung điện Hoàng gia', 3, 3, 'temple', '#F2E8D0', '#E8A82C', '#2D2A4A', 'banner', 5]],
    p: [['Voi trắng', 'elephant', '#F2F2F2', '#F2C94C', 'crown', 5], ['Mèo Xiêm', 'cat', '#F2E8D8', '#6B4A3A', '', 3], ['Khỉ Lopburi', 'monkey', '#B8985A', '#F2D9B8', '', 3], ['Cá sấu nhí', 'croc', '#5CB85C', '#D8F0B0', '', 3]] });

  Cat.add('japan', { map: { f: ['bonsai'], d: ['jpflag', 'maneki'], b: ['fuji'], p: ['shiba'] },
    f: [['Anh đào Sakura', 'star', '#FFB7D0', '#FFE36B', 3, 5], ['Cúc hoàng gia Nhật', 'pom', '#F2C94C', '#E8A82C', 3], ['Mận ume', 'star', '#FF8FB8', '#FFE36B', 2, 5], ['Diên vĩ Nhật', 'orchid', '#6A6AE8', '#FFD23F', 4]],
    t: [['Phong Nhật', 'maple', '#E2331F', '#F2A32C', 3], ['Anh đào ven sông', 'blossom', '#FFB7D0', '#FF8FB8', 3], ['Thông cắt tỉa niwaki', 'conifer', '#3C7A4A', '#E8B84A', 3], ['Bạch quả Nhật', 'ginkgo', '#F2D23F', '#E8A82C', 3], ['Liễu Nhật', 'willow', '#9AD08A', '#FFFFFF', 3]],
    d: [['Đèn giấy chochin', 'lantern', 'none', '#E23B3B', '#F2C94C', 2], ['Cổng torii nhỏ', 'arch', 'sun', '#E23B3B', '#F2C94C', 3], ['Chuông chùa Bonsho', 'gong', 'bell', '#8A8F9A', '#F2C94C', 3]],
    b: [['Lâu đài Himeji', 3, 3, 'castle', '#FFFFFF', '#3A3A44', '#E23B3B', 'banner', 5], ['Nhà tắm suối nóng', 3, 2, 'house', '#C98A4B', '#6B4A2B', '#8A5A2E', 'smoke+lantern', 3], ['Đền Inari', 2, 2, 'pavilion', '#E23B3B', '#3A2A2A', '#F2C94C', 'lantern', 4], ['Sân khấu Noh', 3, 2, 'pavilion', '#C98A4B', '#3A3A44', '#E23B3B', 'banner', 4]],
    p: [['Chó Akita', 'dog', '#E8B070', '#FFFFFF', 'scarf', 3], ['Mèo cụt đuôi', 'cat', '#F2F2F2', '#E8A82C', 'bow', 3], ['Hạc Nhật', 'crane', '#FFFFFF', '#2A2A34', '', 4], ['Khỉ tuyết', 'monkey', '#B8A89A', '#E8B8A8', 'scarf', 4]] });

  Cat.add('china', { map: { f: ['plumblossom'], d: ['cnflag', 'cnlantern'], b: ['greatwall'], p: ['dragonbaby'] },
    f: [['Mẫu đơn đỏ', 'pom', '#E8143A', '#FFD23F', 4], ['Sen Trung Hoa', 'lotus', '#FFB8D0', '#FFE36B', 3], ['Cúc vàng Trung Hoa', 'pom', '#F2C94C', '#E8854A', 3], ['Lan quân tử', 'orchid', '#9AD07A', '#F2E8C8', 4]],
    t: [['Trúc Trung Hoa', 'bamboo', '#6FB04A', '#F2C94C', 2], ['Thông Hoàng Sơn', 'conifer', '#2F7A4A', '#E8B84A', 3], ['Liễu Giang Nam', 'willow', '#8ED08A', '#FFFFFF', 3], ['Đào Trung Hoa', 'blossom', '#FFB7D0', '#FF8FB8', 3], ['Bạch quả cổ', 'ginkgo', '#F2D23F', '#E8A82C', 3]],
    d: [['Sư tử đá', 'guardlion', 'none', '#C9D0D9', '#E23B3B', 3], ['Đèn kéo quân', 'tubelamp', 'none', '#E23B3B', '#FFE9A8', 3], ['Chuông đồng', 'gong', 'bell', '#B8861B', '#F2C94C', 3]],
    b: [['Cổng Tử Cấm Thành', 3, 3, 'castle', '#C9301F', '#F2C94C', '#F2C94C', 'banner+lantern', 5], ['Đình Giang Nam', 2, 2, 'pavilion', '#C9301F', '#2E7D4F', '#F2C94C', 'lantern', 3], ['Tháp Lôi Phong', 2, 3, 'pagoda', '#E8D4B0', '#8A5A2E', '#C9301F', 'lantern', 4], ['Nhà trà Quảng Đông', 3, 2, 'shop', '#C9301F', '#F2C94C', '#8A5A2E', 'lantern+bunting', 4]],
    p: [['Gấu trúc', 'panda', '#FFFFFF', '#2A2A34', 'leaf', 3], ['Khỉ vàng', 'monkey', '#E8B858', '#F2D9B8', 'crown', 3], ['Hạc đỏ đầu', 'crane', '#FFFFFF', '#2A2A34', '', 4], ['Chó Bắc Kinh', 'dog', '#E8B070', '#FFFFFF', 'bow', 3]] });

  Cat.add('india', { map: { f: ['jasmine'], d: ['inflag', 'diya'], b: ['tajmahal'], p: ['tigercub'] },
    f: [['Sen Ấn Độ', 'lotus', '#FF8FB8', '#FFE36B', 3], ['Cúc vạn thọ Ấn', 'pom', '#FF9933', '#C9631A', 2], ['Dâm bụt Ấn', 'poppy', '#E8143A', '#FFD23F', 3], ['Hoa hồng Ấn', 'paper', '#E8143A', '#FFFFFF', 4]],
    t: [['Bồ đề linh thiêng', 'mangrove', '#3C8A4A', '#E8B84A', 3], ['Xoài Ấn', 'round', '#4FAE4A', '#F2A32C', 2, { fruit: 1 }], ['Neem xanh', 'round', '#3F9A4A', '#F2E8C8', 2], ['Dừa Kerala', 'palm', '#3FAE4A', '#8A5A2E', 2], ['Me già', 'umbrella', '#5FA84A', '#B8733A', 3]],
    d: [['Tượng Ganesha', 'ganesha', 'none', '#E8743A', '#F2C94C', 4], ['Chuông đền', 'gong', 'bell', '#B8861B', '#F2C94C', 3], ['Hoa văn rangoli', 'planter', 'flower', '#E8854A', '#FF5CA8', 3]],
    b: [['Đền Hindu', 3, 3, 'temple', '#F2D9A8', '#E8854A', '#E8143A', 'banner', 5], ['Chợ gia vị', 3, 2, 'shop', '#F2D9A8', '#E8854A', '#138808', 'bunting', 3], ['Cung điện Gió', 2, 3, 'tower', '#F2A8B8', '#E8854A', '#F2C94C', 'balcony', 5], ['Cổng Ấn Độ', 3, 2, 'dome', '#E8D4B0', '#E8854A', '#138808', 'flag', 4]],
    p: [['Voi Ấn', 'elephant', '#9AA3AE', '#F2B8C8', 'crown', 4], ['Công Ấn', 'peacock', '#2E7DD6', '#37A87A', '', 5], ['Bò thiêng', 'cow', '#FFF6E8', '#E8D2B0', '', 3], ['Khỉ Hanuman', 'monkey', '#B8A89A', '#E8C79A', 'crown', 4]] });

  Cat.add('indonesia', { map: { f: ['frangipani'], d: ['idflag', 'wayang'], b: ['borobudur'], p: ['orangutan'] },
    f: [['Lan hài', 'orchid', '#FF5C9A', '#FFD23F', 4], ['Hoa Rafflesia', 'torch', '#C9431F', '#F2C94C', 5], ['Cúc Bali', 'pom', '#FFD23F', '#F28A24', 2], ['Dâm bụt Bali', 'poppy', '#FF5C7A', '#FFD23F', 3]],
    t: [['Cọ dầu', 'palm', '#2F9A4E', '#8A5A2E', 2], ['Đa Bali', 'mangrove', '#2F8F4A', '#E8B84A', 3], ['Cây tếch', 'round', '#3C8A4A', '#B8733A', 2], ['Cây chuối Java', 'tropic', '#3FAE5A', '#FFD23F', 3], ['Cây đinh hương', 'cypress', '#3F8A4A', '#E8543A', 3]],
    d: [['Tượng đá Bali', 'figure', 'flower', '#9AA3AE', '#FFD23F', 3], ['Đèn lồng Bali', 'lantern', 'leaf', '#B8733A', '#F2C94C', 3], ['Trống gamelan', 'gong', 'note', '#B8733A', '#F2C94C', 4]],
    b: [['Đền Bali thờ nước', 3, 2, 'temple', '#9AA3AE', '#6B4A2B', '#C9431F', 'flowers', 4], ['Nhà sàn Toraja', 3, 2, 'stilt', '#8A5A3A', '#6B4A2B', '#E8431F', 'banner', 4], ['Đền Prambanan', 2, 3, 'tower', '#B8A89A', '#6A5A4A', '#F2C94C', 'vines', 5], ['Chợ nổi Banjarmasin', 3, 2, 'dock', '#C98A4B', '#6B4A2B', '#E8431F', 'bunting', 4]],
    p: [['Rồng Komodo nhí', 'lizard', '#8A7A5A', '#C9B890', '', 4], ['Hổ Sumatra', 'tiger', '#E8854A', '#2A2A34', '', 4], ['Tê giác Java', 'rhino', '#9AA3B0', '#F2E8D0', '', 4], ['Chim thiên đường', 'bird', '#E8431F', '#F2C94C', 'wings', 5]] });

  Cat.add('france', { map: { f: ['fleurdelis'], d: ['frflag', 'baguette'], b: ['eiffel'], p: ['poodle'] },
    f: [['Oải hương Provence', 'spike', '#B48CFF', '#7A4ACF', 2], ['Hồng Pháp', 'pom', '#FF8FB8', '#FFD6E5', 3], ['Hướng dương Pháp', 'daisy', '#FFD23F', '#6B4A22', 2, 14], ['Anh túc Pháp', 'poppy', '#E8143A', '#2E2A33', 3]],
    t: [['Bách Địa Trung Hải', 'cypress', '#3C7A4A', '#E8B84A', 2], ['Phong Paris', 'round', '#5FB04A', '#B8733A', 2], ['Cây nho giàn', 'willow', '#7FC27A', '#8A3A8A', 3], ['Cây ô liu Provence', 'round', '#8FA870', '#4A5A2A', 3, { fruit: 1 }], ['Hạt dẻ đại lộ', 'round', '#3F9A4A', '#B8733A', 3, { fruit: 1 }]],
    d: [['Đèn đường Paris', 'lamp', 'fleur', '#2A2A34', '#F2C94C', 3], ['Tượng nghệ sĩ', 'figure', 'note', '#9A7A4A', '#2E6BD8', 3], ['Ghế quán cà phê', 'bench', 'heart', '#2A3A6A', '#FFFFFF', 3]],
    b: [['Quán cà phê Paris', 2, 2, 'shop', '#F4E4C8', '#2A3A6A', '#E23B3B', 'bunting', 3], ['Nhà thờ Đức Bà nhỏ', 3, 3, 'castle', '#D8CBA8', '#6A7A8A', '#F2C94C', 'banner', 5], ['Tiệm bánh ngọt', 2, 2, 'shop', '#FFE9F2', '#FF8FB8', '#8A5A2E', 'bunting+flowers', 3], ['Lâu đài thung lũng Loire', 3, 3, 'castle', '#F2E8D0', '#4A5A6A', '#E23B3B', 'flag', 5]],
    p: [['Mèo Paris', 'cat', '#B8B8C4', '#FFFFFF', 'bow', 3], ['Gà trống Gaulois', 'rooster', '#2E6FD6', '#E5334B', 'crown', 4], ['Bulldog Pháp', 'dog', '#8A6A4A', '#FFFFFF', 'scarf', 3], ['Ngựa Camargue', 'horse', '#E8E8EE', '#B8BCC8', '', 4]] });

  Cat.add('italy', { map: { f: ['basil'], d: ['itflag', 'pizza'], b: ['colosseum'], p: ['wolfpup'] },
    f: [['Hồng Ý', 'pom', '#E8143A', '#FFD6E5', 3], ['Hoa hướng dương Tuscany', 'daisy', '#FFD23F', '#6B4A22', 2, 14], ['Oải hương Ý', 'spike', '#B48CFF', '#7A4ACF', 2], ['Cúc La Mã', 'daisy', '#FFFFFF', '#F2C94C', 1]],
    t: [['Bách Tuscany', 'cypress', '#3C7A4A', '#E8B84A', 2], ['Thông dù La Mã', 'umbrella', '#3C8A4A', '#B8733A', 3], ['Ô liu Ý', 'round', '#8FA870', '#4A5A2A', 3, { fruit: 1 }], ['Cam Sicily', 'round', '#4FAE4A', '#F28A24', 3, { fruit: 1 }], ['Chanh Amalfi', 'round', '#5FB04A', '#F2D23F', 3, { fruit: 1 }]],
    d: [['Đài phun Trevi nhỏ', 'fountain', 'shell', '#E8E2D0', '#5AA8F0', 4], ['Cột La Mã', 'pillar', 'crown', '#E8E2D0', '#B8861B', 3], ['Thùng rượu vang', 'barrel', 'flower', '#8A3A2A', '#8A3A8A', 2]],
    b: [['Tháp nghiêng Pisa', 2, 3, 'tower', '#F2EEE0', '#B8732E', '#8A8F9A', 'lean', 4], ['Tiệm pizza Napoli', 2, 2, 'shop', '#F2D9B8', '#C9503A', '#009246', 'bunting', 3], ['Đền Pantheon', 3, 3, 'temple', '#E8E2D0', '#8A5A3A', '#F2C94C', '', 5], ['Cầu gondola Venice', 3, 2, 'dock', '#C98A4B', '#6B4A2B', '#CE2B37', 'lantern', 4]],
    p: [['Mèo Ý', 'cat', '#E8D4B0', '#FFFFFF', 'bow', 2], ['Chó Tuscan', 'dog', '#C9A66A', '#FFFFFF', 'scarf', 3], ['Gà trống Ý', 'rooster', '#E8742E', '#2E7D5A', '', 3], ['Bò Chianina', 'cow', '#F4F4F0', '#D8D4C8', '', 3]] });

  Cat.add('netherlands', { map: { f: ['hyacinth'], d: ['nlflag', 'woodenshoe'], b: ['dutchwindmill'], p: ['cowcalf'] },
    f: [['Tulip đỏ Hà Lan', 'cup', '#E8143A', '#FFD23F', 2], ['Tulip vàng', 'cup', '#FFD23F', '#E8854A', 2], ['Thủy tiên Hà Lan', 'daisy', '#FFFFFF', '#F28A24', 2, 6], ['Tulip tím', 'cup', '#9A4AE8', '#FFFFFF', 3]],
    t: [['Liễu kênh đào', 'willow', '#8ED08A', '#FFFFFF', 2], ['Phong đê điều', 'round', '#5FB04A', '#B8733A', 2], ['Bạch dương Hà Lan', 'birch', '#9AD07A', '#F2C94C', 2], ['Táo vườn Hà Lan', 'round', '#5FB04A', '#E23B3B', 3, { fruit: 1 }], ['Cây anh đào Amsterdam', 'blossom', '#FFD6E5', '#FF8FB8', 3]],
    d: [['Xe đạp Hà Lan', 'bench', 'wheel', '#E8143A', '#FFFFFF', 3], ['Pho mát Gouda', 'barrel', 'star', '#F2C94C', '#C9A22A', 2], ['Đèn kênh đào', 'lamp', 'drop', '#2A3A6A', '#FFE9A8', 3]],
    b: [['Nhà dọc kênh đào', 2, 3, 'house', '#C9503A', '#2A3A6A', '#F2E8D0', 'balcony', 4], ['Nhà máy gió đôi', 3, 3, 'mill', '#F2E8D0', '#4A6A98', '#E23B3B', 'flag', 5], ['Chợ pho mát', 3, 2, 'shop', '#F2D9B8', '#E8854A', '#21468B', 'bunting', 3], ['Nhà kính tulip', 3, 2, 'house', '#CDEFF5', '#9AB8C8', '#E8143A', 'flowers', 3]],
    p: [['Thỏ Hà Lan', 'bunny', '#FFFFFF', '#8A6A4A', 'bow', 2], ['Chó Keeshond', 'dog', '#9AA3AE', '#2A2A34', '', 3], ['Ngỗng kênh', 'goose', '#FFFFFF', '#FF9A2E', '', 2], ['Ngựa Frisian', 'horse', '#2A2A34', '#14141C', '', 4]] });

  Cat.add('uk', { map: { f: ['daffodil'], d: ['ukflag', 'phonebox'], b: ['bigben'], p: ['corgi'] },
    f: [['Hồng Tudor', 'pom', '#E8143A', '#FFFFFF', 3], ['Chuông xanh Anh', 'bell', '#4F7AE8', '#FFFFFF', 2], ['Cúc bãi cỏ', 'daisy', '#FFFFFF', '#FFD23F', 1], ['Hoa kế Scotland', 'thistle', '#B48CFF', '#7A4ACF', 3]],
    t: [['Sồi Anh', 'round', '#3C7A3E', '#B8733A', 2, { fruit: 1 }], ['Thủy tùng Anh', 'cypress', '#2F6A4A', '#E8B84A', 2], ['Liễu Thames', 'willow', '#8ED08A', '#FFFFFF', 3], ['Dẻ gai Anh', 'blossom', '#FFFFFF', '#FFB7D0', 3], ['Phong Scotland', 'maple', '#C4321C', '#F2A32C', 3]],
    d: [['Hộp thư đỏ Anh', 'barrel', 'crown', '#D8232A', '#F2C94C', 2], ['Đèn đường Luân Đôn', 'lamp', 'crown', '#2A2A34', '#F2C94C', 3], ['Ghế công viên Hyde', 'bench', 'leaf', '#3F6A4A', '#FFFFFF', 3]],
    b: [['Cổng Cung điện Buckingham', 3, 3, 'castle', '#E8E2D0', '#2A3A6A', '#F2C94C', 'flag', 5], ['Quán rượu Anh', 3, 2, 'shop', '#3A6A4A', '#4A3A2A', '#F2C94C', 'bunting+lantern', 4], ['Cầu Tháp Luân Đôn', 3, 3, 'tower', '#8A9AB0', '#3A5A8A', '#4FB4FF', 'flag', 5], ['Nhà gạch ngoại ô', 2, 2, 'house', '#C9503A', '#4A4A58', '#FFFFFF', 'chimney+flowers', 2]],
    p: [['Chó Bulldog Anh', 'dog', '#E8C8A0', '#FFFFFF', 'scarf', 3], ['Mèo Anh lông ngắn', 'cat', '#9AA3AE', '#E8E2D0', 'crown', 3], ['Cú tuyết Hogwarts', 'owl', '#FFFFFF', '#9AA3AE', 'hat', 4], ['Cáo Anh', 'fox', '#E8641A', '#FFFFFF', 'scarf', 3]] });

  Cat.add('germany', { map: { f: ['cornflower'], d: ['deflag', 'pretzel'], b: ['brandenburg'], p: ['dachshund'] },
    f: [['Cúc đồng nội', 'daisy', '#FFFFFF', '#FFD23F', 1], ['Hoa hồng Đức', 'pom', '#E8143A', '#FFD6E5', 3], ['Hoa tử đằng Đức', 'spike', '#9A7BE8', '#FFFFFF', 2], ['Hoa hướng dương Đức', 'daisy', '#FFD23F', '#6B4A22', 2, 14]],
    t: [['Thông Rừng Đen', 'conifer', '#1F5A3A', '#E8B84A', 3], ['Sồi Đức', 'round', '#3C7A3E', '#B8733A', 2, { fruit: 1 }], ['Thông Noel Đức', 'conifer', '#2F7A4A', '#E23B3B', 4, { snow: 1 }], ['Dẻ gai Bavaria', 'round', '#4A9A46', '#B8733A', 3, { fruit: 1 }], ['Bạch dương Berlin', 'birch', '#9AD07A', '#F2C94C', 2]],
    d: [['Cốc bia Đức', 'barrel', 'star', '#F2C94C', '#FFFFFF', 3], ['Đồng hồ cúc cu Đức', 'shrine', 'bell', '#8A5A2E', '#F2C94C', 4], ['Đèn Giáng sinh Đức', 'starlamp', 'none', '#E23B3B', '#FFD23F', 3]],
    b: [['Lâu đài Neuschwanstein', 3, 3, 'castle', '#F2F2F2', '#4A7AB8', '#F2C94C', 'flag', 5], ['Nhà gỗ Bavaria', 3, 2, 'house', '#FBF3DC', '#8A3A2A', '#6B4A2B', 'flowers+balcony', 4], ['Chợ Giáng sinh Đức', 3, 2, 'shop', '#C98A4B', '#E23B3B', '#F2C94C', 'bunting+lantern', 4], ['Tháp truyền hình Berlin', 2, 3, 'tower', '#C9D0D9', '#8A9AB0', '#E23B3B', 'dish', 4]],
    p: [['Chó chăn cừu Đức', 'dog', '#B8844A', '#2A2A34', '', 3], ['Gấu Berlin', 'bear', '#8A5A3A', '#C9A66A', 'crown', 4], ['Nai Rừng Đen', 'deer', '#8A5A3A', '#FFF6E8', 'antlers', 3], ['Cú Đức', 'owl', '#8A6A44', '#E8D4B0', '', 2]] });

  Cat.add('usa', { map: { f: ['cotton'], d: ['usflag', 'hotdog'], b: ['liberty'], p: ['eaglet'] },
    f: [['Hồng Mỹ', 'pom', '#E8143A', '#FFD6E5', 3], ['Hoa Mỹ cúc', 'daisy', '#FFFFFF', '#FFD23F', 1], ['Lúa mì Kansas', 'plume', '#F2D23F', '#C9A22A', 2], ['Hoa bông ngô', 'star', '#3A6EE8', '#FFFFFF', 3, 5]],
    t: [['Phong Vermont', 'maple', '#D9331F', '#F2A32C', 3], ['Sồi Mỹ', 'round', '#3C7A3E', '#B8733A', 2, { fruit: 1 }], ['Thông Alaska', 'conifer', '#2F6A4A', '#E8B84A', 2], ['Cọ Florida', 'palm', '#3FAE4A', '#8A5A2E', 2], ['Cây Joshua California', 'joshua', '#8FB45A', '#F2C94C', 3]],
    d: [['Hộp thư nước Mỹ', 'barrel', 'star', '#2E4AA8', '#FFFFFF', 2], ['Quả bóng bầu dục', 'football', 'none', '#8A4A22', '#FFFFFF', 3], ['Đèn rạp chiếu bóng', 'marquee', 'star', '#E23B3B', '#FFE9A8', 3]],
    b: [['Diner Mỹ', 2, 2, 'shop', '#E8E2D0', '#E23B3B', '#4FB4FF', 'bunting+neon', 3], ['Trang trại Texas', 3, 2, 'barn', '#C9503A', '#6B4A2B', '#FFFFFF', 'flag', 3], ['Tòa Nhà Trắng nhỏ', 3, 3, 'temple', '#FFFFFF', '#C9D0D9', '#2E4AA8', 'flag', 5], ['Cầu Cổng Vàng', 3, 2, 'dock', '#C9503A', '#C9503A', '#E8854A', 'flag', 5]],
    p: [['Bò rừng bison', 'bison', '#6B4A2F', '#3A2A1A', '', 4], ['Gấu nâu Mỹ', 'bear', '#6B4A3A', '#C9A66A', 'hat', 3], ['Gà tây', 'turkey', '#8A5A2E', '#C0392B', '', 3], ['Chó golden', 'dog', '#E8C050', '#FFF1DE', 'scarf', 3]] });

  Cat.add('greece', { map: { f: ['olive'], d: ['grflag', 'amphora'], b: ['parthenon'], p: ['dolphin'] },
    f: [['Hoa anh túc Hy Lạp', 'poppy', '#E8143A', '#2E2A33', 3], ['Hoa cúc Aegean', 'daisy', '#FFFFFF', '#F2C94C', 1], ['Oải hương Hy Lạp', 'spike', '#B48CFF', '#7A4ACF', 2], ['Hoa giấy đảo', 'paper', '#E8143A', '#FFFFFF', 3]],
    t: [['Ô liu cổ thụ', 'round', '#8FA870', '#4A5A2A', 3, { fruit: 1 }], ['Bách Hy Lạp', 'cypress', '#3C7A4A', '#E8B84A', 2], ['Lựu đảo', 'round', '#4FAE4A', '#E8143A', 3, { fruit: 1 }], ['Cây thông Aleppo', 'umbrella', '#4FA860', '#B8733A', 3], ['Cây nho Aegean', 'willow', '#7FC27A', '#8A3A8A', 3]],
    d: [['Cột Doric nhỏ', 'pillar', 'leaf', '#F2F2F2', '#4FAE4A', 3], ['Tượng nữ thần', 'athena', 'none', '#F4F4F6', '#C98A00', 4], ['Đèn lồng Aegean', 'hurricane', 'none', '#FFB02E', '#2E6BD8', 3]],
    b: [['Nhà trắng mái xanh Oia', 2, 2, 'dome', '#FFFFFF', '#2E6BD8', '#E23B3B', 'flowers', 3], ['Nhà hát cổ Epidaurus', 3, 2, 'temple', '#E8E2D0', '#C9B890', '#2E6BD8', '', 4], ['Cối xay gió Mykonos', 2, 3, 'mill', '#FFFFFF', '#C9503A', '#2E6BD8', 'flag', 4], ['Hải đăng Aegean', 2, 3, 'lighthouse', '#FFFFFF', '#2E6BD8', '#F2C94C', '', 4]],
    p: [['Mèo đảo Hy Lạp', 'cat', '#FFFFFF', '#E8B070', '', 2], ['Dê núi Hy Lạp', 'goat', '#EFE6D6', '#8A7A66', '', 3], ['Bạch tuộc Aegean', 'octo', '#E8543A', '#FFB8A8', '', 3], ['Cá heo Aegean', 'whale', '#4F9AD8', '#EAF4FA', 'wings', 4]] });

  Cat.add('sweden', { map: { f: ['lingonberry'], d: ['seflag', 'cinnamonbun'], b: ['redcottage'], p: ['moosecalf'] },
    f: [['Hoa linnea', 'bell', '#FFB8D0', '#FFFFFF', 2], ['Cúc đồng Thụy Điển', 'daisy', '#FFFFFF', '#FFD23F', 1], ['Hoa lupin Bắc Âu', 'spike', '#9A7BE8', '#FFB8D0', 3], ['Việt quất rừng', 'berry', '#3A4AA8', '#3C9A4C', 3]],
    t: [['Thông Scandinavia', 'conifer', '#2F6A4A', '#E8B84A', 2], ['Bạch dương Bắc Âu', 'birch', '#9AD07A', '#F2C94C', 2], ['Phong Thụy Điển', 'maple', '#D9531E', '#F2A32C', 3], ['Hoa lê Bắc Âu', 'blossom', '#FFFFFF', '#FFB7D0', 3], ['Sồi Midsommar', 'round', '#4A9A46', '#B8733A', 3, { fruit: 1 }]],
    d: [['Cột Midsommar', 'pillar', 'flower', '#4FAE4A', '#FFD23F', 4], ['Đèn nến Lucia', 'torch', 'none', '#FFB02E', '#FFFFFF', 3], ['Cờ buồm Viking', 'banner', 'wave', '#8A5A2E', '#F2C94C', 3]],
    b: [['Nhà thuyền Viking', 3, 2, 'ship', '#8A5A3A', '#F2E8D0', '#E23B3B', 'banner', 4], ['Lâu đài Thụy Điển', 3, 3, 'castle', '#F2C94C', '#4A5A6A', '#006AA7', 'flag', 5], ['Tiệm bánh fika', 2, 2, 'shop', '#B8321F', '#FFFFFF', '#F2C94C', 'bunting', 3], ['Nhà gỗ hồ băng', 3, 2, 'house', '#FBF3DC', '#006AA7', '#FECC02', 'chimney+smoke+snow', 3]],
    p: [['Hươu sao Bắc Âu', 'deer', '#B8793C', '#FFF6E8', 'antlers', 4], ['Chó husky Thụy Điển', 'dog', '#9AA3AE', '#FFFFFF', 'scarf', 3], ['Cú tuyết Bắc Âu', 'owl', '#FFFFFF', '#9AA3AE', '', 3], ['Cáo Bắc Âu', 'fox', '#E8641A', '#FFFFFF', 'scarf', 3]] });

  Cat.add('switzerland', { map: { f: ['gentian'], d: ['chflag', 'cuckooclock'], b: ['matterhorn'], p: ['stbernard'] },
    f: [['Hoa tuyết Alps', 'star', '#FFFFFF', '#F2C94C', 3, 8], ['Hoa chuông núi', 'bell', '#6A8CE8', '#FFFFFF', 2], ['Hoa mao lương', 'cup', '#FFD23F', '#E8A82C', 1], ['Hoa lan núi', 'orchid', '#FF8FB8', '#FFD23F', 4]],
    t: [['Thông Alps', 'conifer', '#2F6A4A', '#E8B84A', 2], ['Thông tuyết núi cao', 'conifer', '#3C7A5A', '#BFE8FF', 3, { snow: 1 }], ['Cây dương Thụy Sĩ', 'cypress', '#3C8A4A', '#F2C94C', 2], ['Hạt dẻ Ticino', 'round', '#3F9A4A', '#B8733A', 3, { fruit: 1 }], ['Phong núi Alps', 'maple', '#D9331F', '#F2A32C', 3]],
    d: [['Chuông bò Alps', 'gong', 'bell', '#B8861B', '#8A5A2E', 3], ['Pho mát Emmental', 'barrel', 'star', '#F2C94C', '#C9A22A', 2], ['Đồng hồ Thụy Sĩ', 'pillar', 'gear', '#DA291C', '#FFFFFF', 4]],
    b: [['Chalet Alps', 3, 2, 'house', '#C98A4B', '#6B4A2B', '#DA291C', 'flowers+balcony', 4], ['Tàu điện núi', 3, 2, 'tech', '#DA291C', '#FFFFFF', '#4FB4FF', 'snow', 4], ['Tiệm sô-cô-la', 2, 2, 'shop', '#7A4A32', '#E8B070', '#DA291C', 'bunting', 3], ['Lâu đài Chillon', 3, 3, 'castle', '#E8E2D0', '#8A5A3A', '#DA291C', 'flag', 5]],
    p: [['Bò sữa Alps', 'cow', '#FFFFFF', '#2E2A33', '', 3], ['Dê núi Alps', 'goat', '#FFFFFF', '#9AA3AE', '', 3], ['Chó núi Bernese', 'dog', '#2A2A34', '#FFFFFF', 'scarf', 3], ['Marmot Alps', 'mouse', '#8A6A4A', '#E8D4B0', 'scarf', 3]] });
})(typeof window !== 'undefined' ? window : this);
