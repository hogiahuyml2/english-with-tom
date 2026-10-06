/* Tiếng Anh phổ thông — Lớp 7 (ngữ pháp). Nội dung tự biên soạn cho English With Tom. */
(function () {
  var S = (window.SCHOOL = window.SCHOOL || { lessons: {} });
  function L(id, d) { d.id = id; S.lessons[id] = d; }

  L('g7-past-simple', {
    grade: 7, icon: '📜', title: 'Thì quá khứ đơn', sub: 'Past Simple', level: 'Cơ bản',
    summary: 'Diễn tả hành động đã xảy ra và kết thúc hẳn trong quá khứ.',
    sections: [
      { h: '1. Cấu trúc', b: [
        { f: ['(+) S + V2/V-ed', '(-) S + did not (didn\'t) + V(bare)', '(?) Did + S + V(bare)?', 'Với to be: was (I, he, she, it) / were (you, we, they)'] },
        { p: 'Sau **did / didn\'t** động từ trở về **nguyên mẫu**: **She didn\'t go.** — **Did you see him?**' }
      ] },
      { h: '2. Động từ có quy tắc và bất quy tắc', b: [
        { t: { h: ['Quy tắc thêm -ed', 'Ví dụ'], r: [['Hầu hết: + ed', 'work → worked'], ['tận cùng -e: + d', 'like → liked'], ['phụ âm + y: ied', 'study → studied'], ['1 nguyên âm + 1 phụ âm: gấp đôi', 'stop → stopped']] } },
        { t: { h: ['V1', 'V2', 'V1', 'V2'], r: [['go', 'went', 'buy', 'bought'], ['see', 'saw', 'eat', 'ate'], ['have', 'had', 'take', 'took'], ['make', 'made', 'come', 'came'], ['get', 'got', 'write', 'wrote'], ['do', 'did', 'say', 'said'], ['meet', 'met', 'give', 'gave']] } }
      ] },
      { h: '3. Dấu hiệu', b: [
        { p: '**yesterday, last night/week/year, two days ago, in 2020, when I was a child, the other day**.' }
      ] }
    ],
    ex: [['I visited my grandparents last weekend.', 'Cuối tuần trước mình đã thăm ông bà.'], ['She went to Hue two years ago.', 'Cô ấy đã đến Huế cách đây hai năm.'], ["We didn't watch TV yesterday.", 'Hôm qua chúng mình không xem TV.'], ['Did you do your homework? — Yes, I did.', 'Bạn đã làm bài tập chưa? — Rồi.'], ['He was ill last week.', 'Tuần trước anh ấy bị ốm.'], ['They were at the cinema last night.', 'Tối qua họ ở rạp chiếu phim.'], ['What did you eat for breakfast?', 'Bạn đã ăn gì cho bữa sáng?'], ['I bought a new bike in 2023.', 'Mình đã mua một chiếc xe đạp mới vào năm 2023.']],
    mis: [["I didn't went to school.", "I didn't go to school.", 'Sau didn\'t dùng động từ nguyên mẫu.'], ['Did she saw the film?', 'Did she see the film?', 'Sau did dùng động từ nguyên mẫu.'], ['He goed home early.', 'He went home early.', 'go là động từ bất quy tắc: went.'], ['She was go to the market.', 'She went to the market.', 'Không dùng was + V1.']],
    quiz: [
      ['We ___ a great film last night.', ['see', 'saw', 'seen', 'sees'], 1, 'last night → quá khứ đơn: saw.'],
      ["She ___ to the party yesterday.", ["didn't go", "didn't went", "doesn't go", "not go"], 0, "didn't + V nguyên mẫu."],
      ['___ you visit your aunt last Sunday?', ['Do', 'Did', 'Are', 'Were'], 1, 'Quá khứ đơn, câu hỏi dùng Did.'],
      ['He ___ ill yesterday, so he stayed at home.', ['is', 'was', 'were', 'be'], 1, 'He → was.'],
      ['My parents ___ in Da Lat two years ago.', ['was', 'is', 'were', 'are'], 2, 'My parents (số nhiều) → were.'],
      ['I ___ a new phone last month.', ['buy', 'buyed', 'bought', 'have bought'], 2, 'buy → bought.'],
      ['What time ___ the film start yesterday?', ['did', 'does', 'was', 'do'], 0, 'Quá khứ đơn: What time did + S + V?'],
      ['They ___ football when they were children.', ['playing', 'play', 'plays', 'played'], 3, 'when they were children → quá khứ đơn: played.']
    ]
  });

  L('g7-future', {
    grade: 7, icon: '🚀', title: 'Tương lai: will và be going to', sub: 'Future with will / be going to', level: 'Cơ bản',
    summary: 'Phân biệt quyết định tức thời, dự đoán, lời hứa (will) với kế hoạch đã định, dự đoán có căn cứ (be going to).',
    sections: [
      { h: '1. Will', b: [
        { f: ['(+) S + will + V(bare)', '(-) S + will not (won\'t) + V(bare)', '(?) Will + S + V(bare)?'] },
        { ul: ['Quyết định tức thời lúc nói: **The phone is ringing. I\'ll answer it.**', 'Lời hứa, đề nghị: **I\'ll help you. I won\'t tell anyone.**', 'Dự đoán dựa trên ý kiến, không có bằng chứng rõ: **I think it will be sunny tomorrow.**'] }
      ] },
      { h: '2. Be going to', b: [
        { f: ['(+) S + am/is/are going to + V(bare)', '(-) S + am/is/are not going to + V(bare)', '(?) Am/Is/Are + S + going to + V(bare)?'] },
        { ul: ['Kế hoạch, dự định đã có từ trước: **We are going to visit Da Nang next week.**', 'Dự đoán có bằng chứng ở hiện tại: **Look at those clouds! It is going to rain.**'] },
        { tip: 'Dấu hiệu của tương lai: **tomorrow, next week/month/year, soon, tonight, in 2030, in two days**.' }
      ] }
    ],
    ex: [["It's cold. I'll close the window.", 'Trời lạnh. Mình sẽ đóng cửa sổ.'], ['We are going to visit my grandparents this weekend.', 'Cuối tuần này chúng mình sẽ đi thăm ông bà.'], ["I promise I won't be late.", 'Mình hứa sẽ không đến muộn.'], ['Look at the sky! It is going to rain.', 'Nhìn bầu trời kìa! Sắp mưa rồi.'], ['Will you come to my party tomorrow?', 'Mai bạn sẽ đến bữa tiệc của mình chứ?'], ['She is going to study medicine at university.', 'Cô ấy dự định học y ở đại học.'], ['I think people will travel to Mars in the future.', 'Mình nghĩ trong tương lai con người sẽ du hành đến sao Hỏa.'], ["I'll carry that bag for you.", 'Để mình xách cái túi đó giúp bạn.']],
    mis: [['I will to go to school tomorrow.', 'I will go to school tomorrow.', 'Sau will dùng động từ nguyên mẫu, không có to.'], ['She will goes to Hue.', 'She will go to Hue.', 'Sau will không thêm s.'], ['Look at those black clouds! It will rain.', 'Look at those black clouds! It is going to rain.', 'Có bằng chứng ở hiện tại → be going to.'], ['He will not to come.', 'He will not come.', 'Sau will not dùng động từ nguyên mẫu, không có to.']],
    quiz: [
      ['The phone is ringing. I ___ answer it.', ["going to", "will", "am", "would to"], 1, 'Quyết định tức thời lúc nói → will.'],
      ['We have bought the tickets. We ___ to visit Da Nang next week.', ['will', 'are going', 'visit', 'are visiting'], 1, 'Kế hoạch đã chuẩn bị → are going to visit.'],
      ['Look at the sky! It ___ rain.', ['will', 'is going to', 'would', 'rains'], 1, 'Có bằng chứng (nhìn bầu trời) → is going to.'],
      ['I promise I ___ call you tonight.', ['going to', 'will', 'am', 'can to'], 1, 'Lời hứa → will.'],
      ['She ___ be a doctor when she grows up. (cô ấy dự định)', ['is going to', 'goes to', 'will to', 'going to'], 0, 'is going to + V.'],
      ['I think it ___ be hot tomorrow.', ['is', 'will', 'does', 'was'], 1, 'I think + dự đoán → will be.'],
      ['___ you help me with this exercise, please?', ['Do', 'Will', 'Are', 'Did'], 1, 'Will you ...? dùng để nhờ vả/đề nghị.'],
      ["They ___ come to the party. They are busy.", ["won't", "don't going to", "aren't to", "doesn't"], 0, "won't = will not."]
    ]
  });

  L('g7-comparisons', {
    grade: 7, icon: '⚖️', title: 'So sánh hơn & so sánh nhất', sub: 'Comparative & Superlative', level: 'Cơ bản',
    summary: 'So sánh người, vật bằng tính từ ngắn và tính từ dài; so sánh bằng.',
    sections: [
      { h: '1. Tính từ ngắn và dài', b: [
        { t: { h: ['Loại', 'So sánh hơn', 'So sánh nhất'], r: [['Ngắn (1 âm tiết): tall', 'taller + than', 'the tallest'], ['Tận cùng -e: nice', 'nicer than', 'the nicest'], ['1 nguyên âm + 1 phụ âm: big', 'bigger than', 'the biggest'], ['2 âm tiết tận cùng -y: happy', 'happier than', 'the happiest'], ['Dài (≥ 2 âm tiết): beautiful', 'more beautiful than', 'the most beautiful']] } },
        { t: { h: ['Bất quy tắc', 'So sánh hơn', 'So sánh nhất'], r: [['good', 'better', 'the best'], ['bad', 'worse', 'the worst'], ['far', 'farther / further', 'the farthest / furthest'], ['much / many', 'more', 'the most'], ['little', 'less', 'the least']] } }
      ] },
      { h: '2. So sánh bằng và các lưu ý', b: [
        { f: ['S + be + as + adj + as + ... (bằng)', 'S + be + not as/so + adj + as + ... (không bằng)', 'S + be + the + adj-est / the most + adj + in/of ... (nhất)'] },
        { tip: '**in** + nhóm/địa điểm số ít (in my class, in the world); **of** + số nhiều (of the three girls, of all).' },
        { warn: 'Không dùng "more" với tính từ ngắn đã có -er, và không dùng 2 dấu hiệu cùng lúc: **more taller**, **the most tallest** đều sai.' }
      ] }
    ],
    ex: [['Mai is taller than Lan.', 'Mai cao hơn Lan.'], ['This film is more interesting than that one.', 'Bộ phim này thú vị hơn bộ kia.'], ['He is the best student in my class.', 'Cậu ấy là học sinh giỏi nhất lớp mình.'], ['Today is hotter than yesterday.', 'Hôm nay nóng hơn hôm qua.'], ['Hanoi is not as big as Ho Chi Minh City.', 'Hà Nội không lớn bằng Thành phố Hồ Chí Minh.'], ['This is the most expensive watch in the shop.', 'Đây là chiếc đồng hồ đắt nhất trong cửa hàng.'], ['My sister is as tall as my mother.', 'Chị mình cao bằng mẹ mình.'], ['English is easier than Maths for me.', 'Với mình tiếng Anh dễ hơn Toán.']],
    mis: [['She is more taller than me.', 'She is taller than me.', 'Tính từ ngắn chỉ thêm -er, không dùng more.'], ['He is the most tallest boy.', 'He is the tallest boy.', 'Chỉ dùng -est, không dùng most.'], ['I am as tall than my brother.', 'I am as tall as my brother.', 'So sánh bằng: as ... as.'], ['Mai is the tallest of my class.', 'Mai is the tallest in my class.', 'in + nhóm (class); of + số nhiều.']],
    quiz: [
      ['My bag is ___ than yours.', ['heavy', 'heavier', 'more heavy', 'heaviest'], 1, 'heavy → heavier (y → ier).'],
      ['This is the ___ book I have ever read.', ['interesting', 'more interesting', 'most interesting', 'interestinger'], 2, 'So sánh nhất của tính từ dài: the most interesting.'],
      ['Lan is ___ student in our class.', ['good', 'better', 'the best', 'the goodest'], 2, 'good → better → the best.'],
      ['The weather today is ___ than yesterday.', ['bad', 'worse', 'worst', 'more bad'], 1, 'bad → worse.'],
      ['He runs as ___ as his brother.', ['faster', 'fast', 'fastest', 'more fast'], 1, 'as + adj/adv + as: as fast as.'],
      ['Mount Everest is the highest mountain ___ the world.', ['of', 'in', 'at', 'on'], 1, 'in the world.'],
      ['This exercise is ___ than that one.', ['more easy', 'easier', 'easiest', 'the easier'], 1, 'easy → easier.'],
      ['Which is ___, a lion or a tiger? (hỏi giữa hai con vật)', ['bigger', 'biggest', 'more big', 'the biggest'], 0, 'So sánh giữa hai đối tượng → so sánh hơn: bigger.']
    ]
  });

  L('g7-quantifiers', {
    grade: 7, icon: '🥛', title: 'Lượng từ: some, any, much, many...', sub: 'Countable & uncountable nouns', level: 'Cơ bản',
    summary: 'Phân biệt danh từ đếm được/không đếm được và các lượng từ đi kèm.',
    sections: [
      { h: '1. Danh từ đếm được và không đếm được', b: [
        { ul: ['Đếm được: **a book, two books, an apple** (có số ít và số nhiều)', 'Không đếm được: **water, milk, rice, information, advice, homework, furniture** (không thêm s, không dùng a/an)'] }
      ] },
      { h: '2. Lượng từ thông dụng', b: [
        { t: { h: ['Lượng từ', 'Dùng với', 'Ví dụ'], r: [['some', 'câu khẳng định, lời mời/đề nghị', 'I have some friends. Would you like some tea?'], ['any', 'câu phủ định & câu hỏi', "We don't have any eggs. Are there any apples?"], ['a lot of / lots of', 'cả đếm được số nhiều và không đếm được', 'a lot of books / a lot of water'], ['many', 'đếm được số nhiều (phủ định, câu hỏi)', 'How many students? There aren\'t many chairs.'], ['much', 'không đếm được (phủ định, câu hỏi)', 'How much money? I don\'t have much time.'], ['(a) few', 'đếm được số nhiều', 'a few friends (một vài), few friends (rất ít, gần như không có)'], ['(a) little', 'không đếm được', 'a little milk (một ít), little milk (rất ít)']] } },
        { tip: '**a few / a little** mang nghĩa tích cực (có một ít). **few / little** mang nghĩa tiêu cực (hầu như không có, không đủ).' }
      ] }
    ],
    ex: [['I have some good friends.', 'Mình có vài người bạn tốt.'], ["There isn't any milk in the fridge.", 'Không có sữa trong tủ lạnh.'], ['Would you like some tea?', 'Bạn có muốn uống chút trà không?'], ['How much water do you drink every day?', 'Mỗi ngày bạn uống bao nhiêu nước?'], ['How many brothers do you have?', 'Bạn có bao nhiêu anh em trai?'], ['She has a few close friends.', 'Cô ấy có một vài người bạn thân.'], ['We have little time, so hurry up.', 'Chúng ta còn rất ít thời gian, nhanh lên.'], ['There are a lot of people in the park.', 'Có rất nhiều người trong công viên.']],
    mis: [['I drink many water.', 'I drink a lot of water. / I drink much water.', 'water không đếm được: không dùng many.'], ['I need a few milk.', 'I need a little milk.', 'milk không đếm được → a little.'], ["I don't have some money.", "I don't have any money.", 'Phủ định dùng any.'], ['How many money do you have?', 'How much money do you have?', 'money không đếm được → How much.']],
    quiz: [
      ["We don't have ___ bread.", ['some', 'any', 'many', 'a few'], 1, 'Phủ định, bread không đếm được → any.'],
      ['How ___ eggs do you need?', ['much', 'many', 'any', 'a little'], 1, 'eggs đếm được số nhiều → many.'],
      ['There is ___ juice in the glass.', ['a few', 'many', 'a little', 'few'], 2, 'juice không đếm được; có một ít → a little.'],
      ['Would you like ___ coffee?', ['much', 'some', 'many', 'few'], 1, 'Lời mời dùng some.'],
      ['She has ___ friends in this city, so she feels lonely.', ['a few', 'few', 'a little', 'much'], 1, 'few = rất ít, nghĩa tiêu cực (cảm thấy cô đơn).'],
      ['I have ___ homework to do tonight.', ['many', 'a lot of', 'a few', 'any'], 1, 'homework không đếm được; câu khẳng định → a lot of.'],
      ['How ___ money do you have?', ['many', 'much', 'few', 'a few'], 1, 'money không đếm được → much.'],
      ['Is there ___ milk left?', ['some', 'any', 'a few', 'many'], 1, 'Câu hỏi → any.']
    ]
  });

  L('g7-modals', {
    grade: 7, icon: '🚦', title: 'Động từ khuyết thiếu: can, should, must, have to', sub: 'Khả năng, lời khuyên, bắt buộc, cấm đoán', level: 'Trung bình',
    summary: 'Cách dùng can/could, should, must/mustn\'t, have to/don\'t have to và may/might.',
    sections: [
      { h: '1. Hình thức chung', b: [
        { f: ['S + modal + V(bare)', '(-) S + modal + not + V(bare)', '(?) Modal + S + V(bare)?'] },
        { p: 'Động từ khuyết thiếu **không thêm s** với he/she/it và **không có to** phía sau: **She can swim.** (không phải "She cans to swim").' }
      ] },
      { h: '2. Ý nghĩa', b: [
        { t: { h: ['Động từ', 'Ý nghĩa', 'Ví dụ'], r: [['can / can\'t', 'khả năng; xin phép', 'I can swim. Can I come in?'], ['could', 'khả năng trong quá khứ; xin phép lịch sự', 'I could run fast when I was young.'], ['should / shouldn\'t', 'lời khuyên', 'You should drink more water.'], ['must', 'bắt buộc (từ ý kiến người nói)', 'I must finish my homework tonight.'], ["mustn't", 'cấm đoán', "You mustn't smoke here."], ['have to', 'bắt buộc (do quy định, hoàn cảnh)', 'Students have to wear uniforms.'], ["don't have to", 'không cần thiết (được tuỳ chọn)', "You don't have to come early."], ['may / might', 'có thể (khả năng)', 'It might rain this afternoon.']] } },
        { warn: '**mustn\'t** = cấm; **don\'t have to** = không cần. **You mustn\'t park here** (bị cấm) khác **You don\'t have to park here** (không cần đỗ ở đây).' }
      ] }
    ],
    ex: [['She can speak three languages.', 'Cô ấy nói được ba thứ tiếng.'], ['You should see a doctor.', 'Bạn nên đi khám bác sĩ.'], ["You mustn't use your phone in class.", 'Bạn không được dùng điện thoại trong lớp.'], ["You don't have to wear a tie.", 'Bạn không cần phải đeo cà vạt.'], ['Can I borrow your pen, please?', 'Cho mình mượn bút của bạn được không?'], ['We have to get up early on school days.', 'Chúng mình phải dậy sớm vào những ngày đi học.'], ['It might snow tonight.', 'Tối nay có thể có tuyết.'], ['He should not stay up so late.', 'Cậu ấy không nên thức khuya như vậy.']],
    mis: [['She musts finish it.', 'She must finish it.', 'Động từ khuyết thiếu không thêm s.'], ['You should to study harder.', 'You should study harder.', 'Sau should không có to.'], ["You mustn't wear a uniform on Sunday. (không cần mặc)", "You don't have to wear a uniform on Sunday.", 'Không cần thiết → don\'t have to.'], ['Do you can swim?', 'Can you swim?', 'can tự đảo lên đầu câu, không dùng do.']],
    quiz: [
      ['You ___ drink more water. It is good for your health.', ['can\'t', 'should', 'mustn\'t', 'might not'], 1, 'Lời khuyên → should.'],
      ['Students ___ run in the corridor. It is dangerous.', ["don't have to", "mustn't", "can", "should to"], 1, 'Cấm đoán → mustn\'t.'],
      ['Tomorrow is Sunday. We ___ go to school.', ["mustn't", "don't have to", "must", "can't to"], 1, 'Không cần thiết → don\'t have to.'],
      ['___ I use your dictionary, please?', ['Must', 'Would', 'Can', 'Do'], 2, 'Xin phép → Can I ...?'],
      ['She ___ play the piano very well when she was five.', ['can', 'could', 'should', 'must'], 1, 'Khả năng trong quá khứ → could.'],
      ['It ___ rain this evening, so take an umbrella.', ['might', 'must to', 'does', 'cans'], 0, 'Khả năng → might.'],
      ['He ___ wear a helmet when he rides a motorbike. It is the law.', ['has to', 'have to', 'having to', 'haves to'], 0, 'He → has to (quy định bắt buộc).'],
      ['You look tired. You ___ go to bed early.', ['should', 'should to', 'shoulds', 'to should'], 0, 'should + V nguyên mẫu.']
    ]
  });

  L('g7-adverbs', {
    grade: 7, icon: '🎯', title: 'Trạng từ tần suất & trạng từ chỉ cách thức', sub: 'always, usually, often / slowly, well...', level: 'Cơ bản',
    summary: 'Vị trí và cách dùng trạng từ tần suất, cách tạo trạng từ chỉ cách thức.',
    sections: [
      { h: '1. Trạng từ tần suất', b: [
        { p: '**always** (100%) › **usually** › **often** › **sometimes** › **rarely / seldom** › **never** (0%).' },
        { ul: ['Đứng **trước động từ thường**: **I always get up at 6.**', 'Đứng **sau to be / trợ động từ / động từ khuyết thiếu**: **She is never late. I can often see him.**', '**Sometimes, usually, often** có thể đứng đầu câu: **Sometimes I walk to school.**'] },
        { p: 'Hỏi tần suất: **How often do you ...?** — **Once/Twice a week, three times a month.**' }
      ] },
      { h: '2. Trạng từ chỉ cách thức', b: [
        { ul: ['Thường: tính từ + **ly**: slow → slowly, careful → carefully, quick → quickly', 'Tận cùng -y: bỏ y + ily: happy → happily', 'Bất quy tắc: **good → well**; **fast, hard, late, early** giữ nguyên hình thức'] },
        { p: 'Trạng từ chỉ cách thức đứng **sau động từ** hoặc **sau tân ngữ**: **She speaks English well. He drives carefully.**' },
        { warn: '**hard** (chăm chỉ, vất vả) khác **hardly** (hầu như không). **He works hard.** nhưng **He hardly works.** (anh ấy hầu như không làm việc).' }
      ] }
    ],
    ex: [['She always gets up at 6.', 'Cô ấy luôn dậy lúc 6 giờ.'], ['He is never late for school.', 'Cậu ấy không bao giờ đến trường muộn.'], ['I sometimes play badminton with my friends.', 'Thỉnh thoảng mình chơi cầu lông với bạn.'], ['How often do you go to the cinema? — Twice a month.', 'Bạn đi xem phim bao lâu một lần? — Hai lần một tháng.'], ['He drives very carefully.', 'Anh ấy lái xe rất cẩn thận.'], ['She speaks English well.', 'Cô ấy nói tiếng Anh giỏi.'], ['The students are working hard.', 'Các học sinh đang học hành chăm chỉ.'], ['The bus arrived late.', 'Xe buýt đến muộn.']],
    mis: [['She goes always to school by bike.', 'She always goes to school by bike.', 'Trạng từ tần suất đứng trước động từ thường.'], ['He is late always.', 'He is always late.', 'Đứng sau to be.'], ['He drives careful.', 'He drives carefully.', 'Bổ nghĩa cho động từ cần trạng từ (carefully).'], ['She speaks English good.', 'She speaks English well.', 'Trạng từ của good là well.']],
    quiz: [
      ['She ___ goes to school by bike.', ['always', 'is always', 'goes always', 'always is'], 0, 'Trạng từ tần suất đứng trước động từ thường: always goes.'],
      ['He is ___ late for class. He is very punctual.', ['always', 'never', 'often', 'usually'], 1, 'very punctual → never late.'],
      ['My brother drives very ___.', ['careful', 'carefully', 'care', 'carefulness'], 1, 'Bổ nghĩa động từ → trạng từ carefully.'],
      ['She sings ___. Everybody loves her voice.', ['good', 'well', 'goodly', 'best'], 1, 'good → trạng từ well.'],
      ['We ___ eat out. We always cook at home.', ['often', 'rarely', 'always', 'usually'], 1, 'always cook at home → rarely eat out (hiếm khi ăn ngoài).'],
      ['The students are working ___ for the exam.', ['hardly', 'hard', 'harder', 'hardy'], 1, 'work hard = làm việc chăm chỉ.'],
      ['How ___ do you visit your grandparents? — Once a month.', ['long', 'far', 'often', 'much'], 2, 'Once a month → hỏi tần suất: How often.'],
      ['He can ___ swim across the river.', ['easy', 'easily', 'ease', 'easier'], 1, 'Bổ nghĩa cho động từ swim → trạng từ easily.']
    ]
  });

  L('g7-past-be-there-was', {
    grade: 7, icon: '⏪', title: 'Quá khứ của to be và There was / There were', sub: 'Past of "be" & There was/were', level: 'Cơ bản',
    summary: 'Dùng was/were để nói về trạng thái, vị trí, cảm xúc trong quá khứ và There was/were để nói "đã có" cái gì.',
    sections: [
      { h: '1. Was / Were', b: [
        { t: { h: ['Chủ ngữ', 'Khẳng định', 'Phủ định', 'Nghi vấn'], r: [['I, he, she, it', 'was', 'was not (**wasn\'t**)', '**Was** he…?'], ['you, we, they', 'were', 'were not (**weren\'t**)', '**Were** you…?']] } },
        { p: 'Dùng với thời gian quá khứ: **yesterday, last week, in 2020, two days ago, when I was a child.** Ví dụ: **I was at home yesterday. They weren\'t late. Were you tired?**' },
        { tip: 'Trả lời ngắn: **Yes, I was. / No, they weren\'t.** Không dùng "did" với was/were: ✗ Did you were at home?' }
      ] },
      { h: '2. There was / There were', b: [
        { f: ['(+) There **was** + danh từ số ít / không đếm được', '(+) There **were** + danh từ số nhiều', '(−) There wasn\'t / weren\'t (any) …', '(?) **Was** there …? / **Were** there …?'] },
        { p: 'Ví dụ: **There was a big tree in front of the house.** · **There were three students in the room.** · **Was there any milk in the fridge? — No, there wasn\'t.**' },
        { warn: 'Động từ theo **danh từ đứng sau**, không theo "there": There **was** a book and two pens (danh từ đầu tiên là a book → was) — văn nói đôi khi dùng were, nhưng ở bài thi hãy làm theo danh từ gần nhất.' }
      ] },
      { h: '3. Câu hỏi với was/were', b: [
        { ul: ['**Where were you** last night? — I was at my grandma\'s.', '**What was** the weather like? — It was sunny.', '**How was** your trip? — It was great!', '**Who was** your first teacher? — It was Mrs. Lan.'] }
      ] }
    ],
    ex: [
      ['I was very tired yesterday.', 'Hôm qua mình rất mệt.'], ['She wasn\'t at school last Monday.', 'Thứ Hai tuần trước cô ấy không ở trường.'], ['We were in Da Nang two years ago.', 'Hai năm trước chúng mình ở Đà Nẵng.'],
      ['Were you at home last night? — No, I wasn\'t.', 'Tối qua bạn có ở nhà không? — Không.'], ['There was a small garden behind the house.', 'Phía sau nhà có một khu vườn nhỏ.'], ['There were many people at the festival.', 'Có rất nhiều người ở lễ hội.'],
      ['Was there a library in your old school? — Yes, there was.', 'Trường cũ của bạn có thư viện không? — Có.'], ['How was the film? — It was exciting.', 'Bộ phim thế nào? — Hấp dẫn lắm.'], ['The exam wasn\'t difficult.', 'Bài thi không khó.']
    ],
    mis: [
      ['I were at home yesterday.', 'I was at home yesterday.', 'I → was.'], ['They was happy.', 'They were happy.', 'they → were.'], ['Did you were tired?', 'Were you tired?', 'Câu hỏi với was/were không mượn did.'],
      ['There were a cat in the garden.', 'There was a cat in the garden.', 'a cat số ít → was.'], ['Was there any students?', 'Were there any students?', 'students số nhiều → were.']
    ],
    quiz: [
      ['My parents ___ at home last night.', ['was', 'were', 'is', 'did'], 1, 'parents số nhiều → were.'],
      ['___ she at the party yesterday?', ['Did', 'Was', 'Were', 'Is'], 1, 'she → Was.'],
      ['There ___ a lot of rain last week.', ['were', 'was', 'are', 'did'], 1, 'rain là danh từ không đếm được → was.'],
      ['We ___ in the park, so we didn\'t see the match.', ['wasn\'t', 'weren\'t', 'didn\'t', 'isn\'t'], 1, 'we → weren\'t.'],
      ['"___ there any eggs?" "No, there weren\'t."', ['Was', 'Were', 'Did', 'Are'], 1, 'eggs số nhiều, quá khứ → Were there…?'],
      ['How ___ your holiday?', ['is', 'did', 'was', 'were'], 2, 'holiday số ít → was.'],
      ['I ___ ten years old in 2020.', ['am', 'was', 'were', 'did'], 1, 'I + quá khứ → was.'],
      ['There ___ two bikes outside the school.', ['was', 'were', 'is', 'be'], 1, 'two bikes → were.'],
      ['Which is correct?', ['Did he was late?', 'Was he late?', 'Were he late?', 'Does he was late?'], 1, 'Câu hỏi với was: Was he late?']
    ]
  });

  L('g7-compound-sentences', {
    grade: 7, icon: '🧩', title: 'Câu đơn, câu ghép và dấu câu', sub: 'Simple & Compound Sentences', level: 'Cơ bản',
    summary: 'Nối hai câu đơn thành câu ghép bằng for, and, nor, but, or, yet, so (FANBOYS) hoặc dấu chấm phẩy; dùng dấu phẩy đúng chỗ.',
    sections: [
      { h: '1. Câu đơn và câu ghép', b: [
        { p: '**Câu đơn** có một mệnh đề (một chủ ngữ + một động từ chính): **I study English.** **Câu ghép** nối hai mệnh đề ngang hàng bằng liên từ: **I study English, and my brother studies French.**' },
        { t: { h: ['Liên từ (FANBOYS)', 'Ý nghĩa', 'Ví dụ'], r: [['**F**or', 'vì (trang trọng)', 'He stayed home, **for** he was ill.'], ['**A**nd', 'và', 'She sings, **and** he plays the guitar.'], ['**N**or', 'cũng không', 'I don\'t eat meat, **nor** do I drink milk.'], ['**B**ut', 'nhưng', 'I was tired, **but** I finished the work.'], ['**O**r', 'hoặc', 'Hurry up, **or** we\'ll miss the bus.'], ['**Y**et', 'tuy nhiên', 'It was cold, **yet** they went swimming.'], ['**S**o', 'vì vậy', 'It rained, **so** we stayed in.']] } }
      ] },
      { h: '2. Dấu câu trong câu ghép', b: [
        { f: ['Mệnh đề 1 **,** + liên từ + mệnh đề 2', 'Mệnh đề 1 **;** mệnh đề 2 (không có liên từ)', 'Mệnh đề 1 **; however,** mệnh đề 2'] },
        { ul: ['Có **dấu phẩy** trước liên từ khi mỗi vế có chủ ngữ + động từ riêng: **I wanted to go, but it was raining.**', 'Không cần phẩy nếu hai động từ chung chủ ngữ: **I opened the door and walked in.**', 'Dấu chấm phẩy (;) nối hai câu có ý gần nhau: **He loves music; she loves painting.**'] },
        { warn: 'Lỗi **comma splice** (nối hai câu chỉ bằng dấu phẩy): ✗ It was late, we went home. → ✓ It was late, **so** we went home. / It was late; we went home.' }
      ] },
      { h: '3. Chọn liên từ đúng', b: [
        { t: { h: ['Muốn nói', 'Dùng', 'Ví dụ'], r: [['thêm ý', 'and', 'He is kind, and he is clever.'], ['đối lập', 'but / yet', 'The test was hard, but I passed.'], ['kết quả', 'so', 'I was thirsty, so I drank water.'], ['lựa chọn / cảnh báo', 'or', 'Study hard, or you will fail.'], ['lý do', 'for / because', 'I was happy, for I got a gift.']] } }
      ] }
    ],
    ex: [
      ['I like football, but my sister prefers tennis.', 'Mình thích bóng đá nhưng em gái mình thích quần vợt hơn.'], ['We can go by bus, or we can walk.', 'Chúng ta có thể đi xe buýt hoặc đi bộ.'], ['It was late, so we took a taxi.', 'Đã muộn nên chúng mình đi taxi.'],
      ['He worked hard, and he passed the exam.', 'Cậu ấy học chăm và đã đỗ kỳ thi.'], ['She was ill, yet she went to school.', 'Cô ấy ốm nhưng vẫn đến trường.'], ['I didn\'t call him, nor did I send a message.', 'Mình không gọi cho anh ấy mà cũng không nhắn tin.'],
      ['He opened the window and looked outside.', 'Cậu ấy mở cửa sổ và nhìn ra ngoài.'], ['Take an umbrella, or you will get wet.', 'Hãy mang ô, nếu không bạn sẽ ướt.'], ['Mum cooked dinner; Dad washed the dishes.', 'Mẹ nấu bữa tối; bố rửa bát.']
    ],
    mis: [
      ['It was late, we went home.', 'It was late, so we went home.', 'Hai mệnh đề cần liên từ (comma splice).'], ['I was tired but, I kept working.', 'I was tired, but I kept working.', 'Dấu phẩy đứng trước but.'],
      ['He is rich so he is not happy.', 'He is rich, but he is not happy.', 'Quan hệ đối lập → but.'], ['She sings, and dances. (hai việc chung chủ ngữ)', 'She sings and dances.', 'Chung chủ ngữ thì không cần phẩy trước and.']
    ],
    quiz: [
      ['It was raining, ___ we stayed at home.', ['but', 'so', 'or', 'yet'], 1, 'Kết quả → so.'],
      ['I wanted to buy it, ___ it was too expensive.', ['so', 'but', 'and', 'for'], 1, 'Đối lập → but.'],
      ['Hurry up, ___ you will be late.', ['and', 'but', 'or', 'so'], 2, 'Cảnh báo "nếu không" → or.'],
      ['Which sentence is punctuated correctly?', ['I like tea, I don\'t like coffee.', 'I like tea, but I don\'t like coffee.', 'I like tea but, I don\'t like coffee.', 'I like tea but I, don\'t like coffee.'], 1, 'Dấu phẩy trước but khi hai vế có chủ ngữ riêng.'],
      ['He didn\'t study, ___ did he go to class.', ['and', 'or', 'nor', 'yet'], 2, 'Phủ định + nor + đảo ngữ.'],
      ['She was very tired, ___ she kept working.', ['so', 'yet', 'for', 'nor'], 1, 'Tương phản bất ngờ → yet.'],
      ['Which sentence is correct?', ['I opened the door, and walked in.', 'I opened the door and walked in.', 'I opened the door, so walked in.', 'I opened the door or, walked in.'], 1, 'Chung chủ ngữ → không cần dấu phẩy trước and.'],
      ['Which sentence uses a semicolon correctly?', ['Tom plays football; Anna plays tennis.', 'Tom plays; football Anna plays tennis.', 'Tom; plays football Anna plays tennis.', 'Tom plays football Anna; plays tennis.'], 0, 'Dấu chấm phẩy nối hai mệnh đề độc lập có ý gần nhau.'],
      ['He stayed home, ___ he was ill. (trang trọng)', ['for', 'nor', 'but', 'or'], 0, 'for = because (trang trọng).']
    ]
  });

  L('g7-how-questions', {
    grade: 7, icon: '📏', title: 'Câu hỏi về mức độ, khoảng cách, thời gian: How…?', sub: 'How questions & "It takes"', level: 'Trung bình',
    summary: 'Dùng How long / far / often / much / many / old / tall… để hỏi và trả lời về thời gian, khoảng cách, tần suất, số lượng.',
    sections: [
      { h: '1. Các câu hỏi với How', b: [
        { t: { h: ['Câu hỏi', 'Hỏi về', 'Trả lời mẫu'], r: [['**How long** …?', 'thời gian kéo dài / độ dài', 'For two hours. / It takes 20 minutes. / About one metre.'], ['**How far** …?', 'khoảng cách', 'About 3 kilometres.'], ['**How often** …?', 'tần suất', 'Twice a week. / Every day.'], ['**How much** + không đếm được / giá tiền', 'lượng, giá', 'How much milk? — A litre. / How much is it? — 50,000 dong.'], ['**How many** + danh từ đếm được số nhiều', 'số lượng', 'Three.'], ['**How old** …?', 'tuổi', 'I\'m 12.'], ['**How tall / high / heavy / deep** …?', 'chiều cao, cân nặng…', 'He is 1.5 metres tall.']] } }
      ] },
      { h: '2. It takes … to V', b: [
        { f: ['It takes (+ người) + thời gian + **to V**', 'How long does it take (+ người) **to V**?'] },
        { p: '**It takes me 15 minutes to walk to school.** (Mình mất 15 phút đi bộ đến trường.) · **How long does it take you to get there?** · It takes **about** an hour.' },
        { tip: 'Động từ **take** chia theo it: **takes** (hiện tại), **took** (quá khứ): It took us two hours to finish the project.' }
      ] },
      { h: '3. Phân biệt dễ nhầm', b: [
        { ul: ['**How long** (bao lâu) ≠ **How far** (bao xa): How **long** is the film? — Two hours. How **far** is the cinema? — 2 km.', '**How much** + danh từ không đếm được: How much water? — **How many** + danh từ số nhiều: How many books?', '**How often** hỏi tần suất, trả lời bằng trạng từ tần suất hoặc cụm: always, twice a month, every Sunday.'] }
      ] }
    ],
    ex: [
      ['How long is the lesson? — It\'s 45 minutes.', 'Tiết học kéo dài bao lâu? — 45 phút.'], ['How far is your school from here? — About two kilometres.', 'Trường bạn cách đây bao xa? — Khoảng hai ki-lô-mét.'], ['How often do you go swimming? — Twice a week.', 'Bạn đi bơi bao lâu một lần? — Hai lần một tuần.'],
      ['How much is this T-shirt? — It\'s 150,000 dong.', 'Chiếc áo này giá bao nhiêu? — 150.000 đồng.'], ['How many students are there in your class? — There are 40.', 'Lớp bạn có bao nhiêu học sinh? — 40 bạn.'], ['How tall is your brother? — He is 1 metre 60.', 'Anh bạn cao bao nhiêu? — 1 mét 60.'],
      ['It takes me 20 minutes to get to school by bike.', 'Mình mất 20 phút đi xe đạp đến trường.'], ['How long does it take to cook this soup? — About an hour.', 'Nấu món súp này mất bao lâu? — Khoảng một tiếng.'], ['It took us three hours to drive to Hue.', 'Chúng mình mất ba tiếng lái xe tới Huế.']
    ],
    mis: [
      ['How many water do you drink?', 'How much water do you drink?', 'water không đếm được → much.'], ['How long is it from your house to school? (hỏi khoảng cách)', 'How far is it from your house to school?', 'Khoảng cách → How far.'],
      ['It takes me 20 minutes walking to school.', 'It takes me 20 minutes to walk to school.', 'take + thời gian + to V.'], ['How often are you go to the gym?', 'How often do you go to the gym?', 'Động từ thường dùng do.'], ['How much students are there?', 'How many students are there?', 'students đếm được → many.']
    ],
    quiz: [
      ['___ is it from Hanoi to Hai Phong? — About 100 km.', ['How long', 'How far', 'How often', 'How much'], 1, 'Khoảng cách → How far.'],
      ['___ do you have English lessons? — Three times a week.', ['How long', 'How many', 'How often', 'How far'], 2, 'Tần suất → How often.'],
      ['___ sugar do you need? — Two spoons.', ['How many', 'How much', 'How long', 'How often'], 1, 'sugar không đếm được → How much.'],
      ['It ___ me an hour to do my homework.', ['takes', 'take', 'spends', 'costs'], 0, 'It takes + người + thời gian.'],
      ['___ does it take to get there by train?', ['How far', 'How long', 'How much', 'How many'], 1, 'Thời gian → How long.'],
      ['___ books do you read a month? — Two or three.', ['How much', 'How many', 'How often', 'How far'], 1, 'books đếm được → How many.'],
      ['It ___ us two hours to finish the project yesterday.', ['takes', 'took', 'taken', 'is taking'], 1, 'yesterday → quá khứ took.'],
      ['"___ is that bridge?" "About 50 metres."', ['How long', 'How old', 'How often', 'How many'], 0, 'Độ dài → How long.'],
      ['"___ is your grandfather?" "He\'s 70."', ['How tall', 'How old', 'How long', 'How many'], 1, 'Tuổi → How old.']
    ]
  });

  L('g7-present-continuous-future', {
    grade: 7, icon: '📅', title: 'Hiện tại tiếp diễn nói về kế hoạch tương lai', sub: 'Present Continuous for future plans', level: 'Trung bình',
    summary: 'Dùng thì hiện tại tiếp diễn để nói về kế hoạch đã sắp xếp chắc chắn trong tương lai gần.',
    sections: [
      { h: '1. Cấu trúc và cách dùng', b: [
        { f: ['S + am/is/are + V-ing + **thời gian tương lai**', 'Ví dụ: **I\'m meeting** Linh tomorrow. They **are flying** to Da Nang next week.'] },
        { p: 'Dùng khi **kế hoạch đã được sắp xếp** (đã đặt vé, hẹn giờ, báo cho người khác). Thường kèm: **tomorrow, tonight, next week/month, on Saturday, this weekend, at 8 o\'clock.**' },
        { tip: 'So sánh: **I am playing football now.** (đang xảy ra) và **I am playing football tomorrow.** (kế hoạch). Thời gian trong câu cho biết nghĩa.' }
      ] },
      { h: '2. So sánh với be going to và will', b: [
        { t: { h: ['', 'Present continuous', 'be going to', 'will'], r: [['Ý nghĩa', 'kế hoạch đã sắp xếp (có giờ, nơi, người)', 'dự định / dự đoán có căn cứ', 'quyết định tức thì, lời hứa, dự đoán'], ['Ví dụ', 'We\'re having a party on Friday at 7.', 'I\'m going to study abroad one day.', 'I\'ll help you with that bag.']] } },
        { p: 'Nhiều khi present continuous và be going to có thể thay cho nhau khi nói kế hoạch: **I\'m visiting / I\'m going to visit** my aunt this weekend. Nhưng với dự đoán có dấu hiệu: **Look at the clouds! It\'s going to rain.** (không dùng present continuous).' }
      ] },
      { h: '3. Câu hỏi và phủ định', b: [
        { f: ['(−) I\'m **not** working tomorrow.', '(?) **What are you doing** this weekend? — I\'m visiting my grandparents.', '(?) **Is** she **coming** to the party? — Yes, she is.'] },
        { warn: 'Các động từ chỉ trạng thái (know, like, want, have = sở hữu) không dùng ở tiếp diễn. Với kế hoạch dùng động từ hành động: go, meet, play, visit, have (a party)…' }
      ] }
    ],
    ex: [
      ['I\'m meeting my friends at the cinema tonight.', 'Tối nay mình sẽ gặp bạn ở rạp chiếu phim.'], ['We\'re going to Hue next month.', 'Tháng sau chúng mình sẽ đi Huế.'], ['She\'s taking an English exam on Saturday.', 'Thứ Bảy cô ấy sẽ thi tiếng Anh.'],
      ['What are you doing this weekend?', 'Cuối tuần này bạn định làm gì?'], ['They aren\'t coming to the party tomorrow.', 'Ngày mai họ sẽ không đến bữa tiệc.'], ['Is your brother visiting you this summer? — Yes, he is.', 'Hè này anh bạn có đến thăm bạn không? — Có.'],
      ['The match starts at 3, so we\'re leaving at 2.', 'Trận đấu bắt đầu lúc 3 giờ nên chúng mình sẽ đi lúc 2 giờ.'], ['I\'m having dinner with my grandparents on Sunday.', 'Chủ nhật mình sẽ ăn tối với ông bà.'], ['He\'s not working next Friday.', 'Thứ Sáu tuần sau anh ấy không đi làm.']
    ],
    mis: [
      ['I meet my friend tomorrow. (kế hoạch đã hẹn)', 'I\'m meeting my friend tomorrow.', 'Kế hoạch đã sắp xếp → present continuous.'], ['We are go to the zoo on Sunday.', 'We are going to the zoo on Sunday.', 'am/is/are + V-ing.'],
      ['Look at those clouds! It is raining soon.', 'Look at those clouds! It\'s going to rain.', 'Dự đoán có dấu hiệu → be going to.'], ['What you are doing tonight?', 'What are you doing tonight?', 'Trợ động từ đứng trước chủ ngữ.']
    ],
    quiz: [
      ['I ___ my cousin at the airport at 6 tomorrow. (đã hẹn)', ['meeting', 'am meeting', 'met', 'meets'], 1, 'Kế hoạch đã sắp xếp → am meeting.'],
      ['What ___ you doing this Sunday?', ['do', 'are', 'did', 'will'], 1, 'Present continuous: What are you doing…?'],
      ['She ___ to Singapore next week. She has the ticket.', ['is flying', 'flying', 'flew', 'fly'], 0, 'Đã có vé → is flying.'],
      ['Look at the dark sky! It ___ rain.', ['is raining', 'is going to', 'rains', 'rained'], 1, 'Cần "is going to rain".'],
      ['They ___ a party tonight, so don\'t be late.', ['has', 'are having', 'had', 'having'], 1, 'Kế hoạch tối nay → are having.'],
      ['He ___ tomorrow. He\'s on holiday.', ['isn\'t working', 'doesn\'t working', 'not working', 'don\'t work'], 0, 'Phủ định tiếp diễn: isn\'t working.'],
      ['___ your parents picking you up at school today?', ['Do', 'Are', 'Did', 'Is'], 1, 'parents số nhiều + V-ing → Are.'],
      ['Which sentence is about a future plan?', ['I\'m reading a book now.', 'I\'m leaving for Hue tomorrow.', 'I read books every day.', 'I was reading yesterday.'], 1, 'tomorrow → kế hoạch tương lai.'],
      ['We ___ out for dinner on Friday evening.', ['are going', 'goes', 'went', 'were going'], 0, 'Kế hoạch ngày thứ Sáu → are going.']
    ]
  });

  L('g7-exclamatory-sentences', {
    grade: 7, icon: '❗', title: 'Câu cảm thán: What…! và How…!', sub: 'Exclamatory sentences', level: 'Trung bình',
    summary: 'Diễn đạt cảm xúc mạnh (ngạc nhiên, thán phục, thất vọng) bằng What + danh từ và How + tính từ/trạng từ.',
    sections: [
      { h: '1. What + (a/an) + (adj) + noun', b: [
        { f: ['What **a/an** + (adj) + danh từ số ít đếm được (+ S + V)!', 'What + (adj) + danh từ số nhiều / không đếm được (+ S + V)!'] },
        { p: '**What a beautiful day!** · **What an interesting film!** · **What lovely flowers!** · **What terrible weather!**' },
        { warn: 'Chọn **a/an** theo từ ngay sau: **a** beautiful day, **an** amazing story. Danh từ số nhiều và không đếm được **không dùng a/an**.' }
      ] },
      { h: '2. How + adj / adv', b: [
        { f: ['How + **tính từ** (+ S + V)!', 'How + **trạng từ** (+ S + V)!'] },
        { p: '**How beautiful!** · **How kind you are!** · **How fast he runs!** · **How well she speaks English!**' },
        { t: { h: ['', 'What…!', 'How…!'], r: [['Cấu trúc', 'What + (a/an) + adj + noun', 'How + adj/adv'], ['Ví dụ', 'What a smart boy!', 'How smart he is!'], ['Có danh từ?', 'Có', 'Không (chỉ tính từ/trạng từ)']] } }
      ] },
      { h: '3. Chuyển đổi và lưu ý', b: [
        { ul: ['**What a tall boy!** = **How tall the boy is!** (cùng nghĩa, khác cấu trúc).', 'Trong văn nói, thường bỏ phần "S + V": **What a pity!** **How awful!**', 'Câu cảm thán kết thúc bằng **dấu chấm than (!)**.'] },
        { tip: 'Câu cảm thán khác câu hỏi: **How tall is he?** (hỏi chiều cao) ≠ **How tall he is!** (thán phục).' }
      ] }
    ],
    ex: [
      ['What a lovely garden!', 'Khu vườn đáng yêu làm sao!'], ['What an exciting football match!', 'Trận bóng đá hấp dẫn quá!'], ['What beautiful flowers!', 'Những bông hoa đẹp quá!'],
      ['What terrible weather!', 'Thời tiết tệ quá!'], ['How kind you are!', 'Bạn tốt bụng quá!'], ['How fast the train goes!', 'Tàu chạy nhanh quá!'],
      ['How well she sings!', 'Cô ấy hát hay quá!'], ['What a pity! You can\'t come.', 'Tiếc quá! Bạn không đến được.'], ['How delicious this cake is!', 'Chiếc bánh này ngon quá!']
    ],
    mis: [
      ['What beautiful day!', 'What a beautiful day!', 'day số ít đếm được → cần a.'], ['What a lovely flowers!', 'What lovely flowers!', 'flowers số nhiều → không dùng a.'], ['How a nice room!', 'What a nice room!', 'Có danh từ → dùng What.'],
      ['What clever he is!', 'How clever he is!', 'Không có danh từ → dùng How.'], ['How fast does he run!', 'How fast he runs!', 'Câu cảm thán không đảo trợ động từ.']
    ],
    quiz: [
      ['___ nice weather we have today!', ['How', 'What', 'What a', 'How a'], 1, 'weather không đếm được → What, không có a.'],
      ['___ interesting story!', ['What', 'What an', 'How', 'How an'], 1, 'story số ít, interesting bắt đầu nguyên âm → What an.'],
      ['___ clever the boy is!', ['What', 'What a', 'How', 'Which'], 2, 'Không có danh từ ngay sau → How.'],
      ['___ delicious food!', ['What a', 'What an', 'How', 'What'], 3, 'food không đếm được → What.'],
      ['___ well she plays the piano!', ['What', 'What a', 'How', 'Which'], 2, 'Trạng từ well → How.'],
      ['"___ pity!" he said when he heard the news.', ['What', 'What a', 'How', 'How a'], 1, 'What a pity!'],
      ['___ beautiful girls!', ['What a', 'What an', 'How', 'What'], 3, 'girls số nhiều → What (không a).'],
      ['Which sentence has the same meaning as "What a big house!"?', ['How big the house is!', 'How big is the house?', 'What big the house is!', 'How a big house!'], 0, 'What a + adj + noun = How + adj + S + be.'],
      ['___ strange noise!', ['What a', 'What an', 'How', 'What'], 0, 'a strange noise (strange bắt đầu bằng phụ âm).']
    ]
  });

  /* ───── Làm sâu các bài lớp 7 ───── */
  function P(id, d) {
    var l = S.lessons[id]; if (!l) throw new Error('Không thấy bài ' + id);
    (d.sections || []).forEach(function (s) { s.h = (l.sections.length + 1) + '. ' + s.h; l.sections.push(s); });
    ['ex', 'mis', 'quiz'].forEach(function (k) { if (d[k]) l[k] = l[k].concat(d[k]); });
  }

  P('g7-past-simple', {
    sections: [
      { h: 'Câu phủ định, câu hỏi và trả lời ngắn', b: [
        { t: { h: ['', 'Cấu trúc', 'Ví dụ'], r: [['Khẳng định', 'S + V2/V-ed', 'She **visited** Hue last year.'], ['Phủ định', 'S + **didn\'t** + V (nguyên mẫu)', 'He **didn\'t go** to school.'], ['Nghi vấn', '**Did** + S + V (nguyên mẫu)?', '**Did** you **see** him?'], ['Wh-', 'Wh-word + did + S + V?', 'Where **did** you **go**?'], ['Trả lời ngắn', 'Yes, S + did. / No, S + didn\'t.', 'Yes, I did. / No, we didn\'t.']] } },
        { warn: 'Chỉ **một** chỗ chia quá khứ: **did** mang thì, động từ chính về **nguyên mẫu**: ✗ Did you went? ✗ I didn\'t saw. Riêng **to be** không dùng did: **Was he ill?** — He **wasn\'t** ill.' },
        { tip: 'Hỏi về chủ ngữ giữ động từ ở **V2**, không dùng did: **Who broke the window?** — **What happened?**' }
      ] },
      { h: 'Cách đọc đuôi -ed', b: [
        { t: { h: ['Đọc', 'Sau âm', 'Ví dụ'], r: [['/t/', 'vô thanh: /p, k, f, s, ʃ, tʃ/', 'stopped, worked, laughed, missed, washed, watched'], ['/d/', 'hữu thanh và nguyên âm', 'played, called, lived, opened, cleaned'], ['/ɪd/', 'sau /t/ và /d/', 'wanted, needed, decided, visited']] } },
        { tip: 'Nghe và nhớ nhóm /t/: stopped, looked, helped, watched; nhóm /ɪd/ luôn là động từ kết thúc bằng t hoặc d: want → wanted.' }
      ] },
      { h: 'Thêm động từ bất quy tắc thường dùng', b: [
        { t: { h: ['V1', 'V2', 'Nghĩa', 'V1', 'V2', 'Nghĩa'], r: [['begin', 'began', 'bắt đầu', 'know', 'knew', 'biết'], ['bring', 'brought', 'mang', 'leave', 'left', 'rời đi'], ['buy', 'bought', 'mua', 'lose', 'lost', 'mất'], ['catch', 'caught', 'bắt', 'run', 'ran', 'chạy'], ['draw', 'drew', 'vẽ', 'sing', 'sang', 'hát'], ['drink', 'drank', 'uống', 'sit', 'sat', 'ngồi'], ['drive', 'drove', 'lái xe', 'sleep', 'slept', 'ngủ'], ['feel', 'felt', 'cảm thấy', 'speak', 'spoke', 'nói'], ['find', 'found', 'tìm thấy', 'swim', 'swam', 'bơi'], ['fly', 'flew', 'bay', 'tell', 'told', 'kể'], ['forget', 'forgot', 'quên', 'think', 'thought', 'nghĩ'], ['give', 'gave', 'cho', 'win', 'won', 'thắng']] } }
      ] },
      { h: 'Kể chuyện quá khứ và các từ nối thời gian', b: [
        { ul: ['Dùng quá khứ đơn để kể một chuỗi sự việc: **I got up at 6, had breakfast and went to school.**', 'Từ nối: **first, then, after that, later, finally, in the end**: First I washed my face. **Then** I had breakfast. **Finally** I left home.', '**when** + quá khứ đơn: **When I was ten, we moved to Hue.**', '**ago**: đứng sau khoảng thời gian: **three days ago** (không dùng với present perfect).'] },
        { warn: 'Với **used to** hoặc thói quen quá khứ ta có thể dùng quá khứ đơn + thời gian cụ thể: **We often went swimming last summer.**' }
      ] }
    ],
    ex: [
      ['Where did you go on holiday last summer?', 'Hè năm ngoái bạn đi nghỉ ở đâu?'], ['Who broke the window? — Tom did.', 'Ai làm vỡ cửa sổ? — Tom làm.'], ['First I got up, then I had breakfast and finally I left for school.', 'Đầu tiên mình dậy, sau đó ăn sáng và cuối cùng ra khỏi nhà đến trường.'], ['We lost the match, but we played well.', 'Chúng mình thua trận nhưng chơi tốt.']
    ],
    mis: [['Did you went to the party?', 'Did you go to the party?', 'Sau did dùng V nguyên mẫu.'], ['I didn\'t saw him.', 'I didn\'t see him.', 'Sau didn\'t dùng V nguyên mẫu.'], ['Who did break the glass?', 'Who broke the glass?', 'Hỏi chủ ngữ không dùng did.']],
    quiz: [
      ['She ___ her keys yesterday.', ['losed', 'lost', 'lose', 'has lost'], 1, 'lose → lost.'],
      ['"Where ___ you go last weekend?" "I went to Hue."', ['do', 'did', 'were', 'are'], 1, 'Wh- + did + S + V.'],
      ['Who ___ the cake? It is delicious!', ['did make', 'made', 'make', 'makes'], 1, 'Hỏi chủ ngữ: Who made…?'],
      ['I ___ a famous singer at the airport last month.', ['seen', 'saw', 'see', 'sawed'], 1, 'see → saw.']
    ]
  });

  P('g7-future', {
    sections: [
      { h: 'So sánh will và be going to', b: [
        { t: { h: ['', 'will', 'be going to'], r: [['Quyết định', 'lúc nói (tức thời)', 'đã có từ trước'], ['Dự đoán', 'dựa trên ý kiến (I think…, probably…)', 'dựa trên bằng chứng hiện tại'], ['Lời hứa/đề nghị', 'có (I\'ll help you.)', 'không'], ['Ví dụ', 'I\'m cold. I\'ll close the window.', 'I\'m going to study English at university.']] } },
        { tip: 'Câu hỏi để chọn: **Có kế hoạch từ trước không?** Có → be going to. **Đang quyết định ngay lúc nói / hứa / đề nghị?** → will.' }
      ] },
      { h: 'Các từ đi cùng will: probably, perhaps, I think…', b: [
        { ul: ['**probably** (có lẽ, đứng sau will): It **will probably** rain. ·  phủ định: It **probably won\'t** rain.', '**perhaps / maybe** đứng đầu câu: **Perhaps** we will win.', '**I think … will / I don\'t think … will**: I **don\'t think** he will come. (✗ I think he won\'t come ít tự nhiên hơn).', '**I hope / I\'m sure / I expect + will**: I\'m sure you\'ll pass.'] }
      ] },
      { h: 'Các cách khác nói tương lai', b: [
        { t: { h: ['Cấu trúc', 'Dùng khi', 'Ví dụ'], r: [['hiện tại tiếp diễn', 'kế hoạch đã sắp xếp', 'I\'m meeting Lan at 5.'], ['hiện tại đơn', 'lịch trình, thời gian biểu', 'The train leaves at 7.'], ['be about to + V', 'sắp sửa', 'The film is about to start.'], ['shall I/we…?', 'đề nghị, xin ý kiến (I, we)', 'Shall I open the window?']] } },
        { warn: 'Mệnh đề **if/when/as soon as** về tương lai dùng **hiện tại đơn**: **If it rains, we will stay home.** (✗ If it will rain).' }
      ] }
    ],
    ex: [
      ['I\'m tired. I think I\'ll go to bed early.', 'Mình mệt. Mình nghĩ mình sẽ đi ngủ sớm.'], ['It will probably rain tomorrow.', 'Có lẽ ngày mai trời sẽ mưa.'], ['Shall I carry your bag? — Yes, please.', 'Để mình xách túi cho bạn nhé? — Vâng, cảm ơn.'], ['I\'m sure you will pass the exam.', 'Mình chắc là bạn sẽ đỗ kỳ thi.']
    ],
    mis: [['I think he won\'t to come.', 'I don\'t think he will come.', 'Dạng tự nhiên với I think.'], ['If it will rain, we will stay home.', 'If it rains, we will stay home.', 'Mệnh đề if dùng hiện tại đơn.'], ['It will probably not rain. (ít tự nhiên)', 'It probably won\'t rain.', 'probably đứng trước won\'t.']],
    quiz: [
      ['A: "There is no milk." B: "I ___ buy some."', ['going to', 'will', 'am buying', 'buy'], 1, 'Quyết định tức thời → will.'],
      ['I ___ to be a teacher. I have chosen a university.', ['will', 'am going', 'shall', 'would'], 1, 'Dự định đã có → am going to be.'],
      ['It ___ rain tomorrow, so take an umbrella.', ['will probably', 'probably will not to', 'is probably', 'does probably'], 0, 'will probably + V.'],
      ['___ I open the window? It\'s hot in here.', ['Will', 'Shall', 'Do', 'Am'], 1, 'Shall I… = đề nghị.']
    ]
  });

  P('g7-comparisons', {
    sections: [
      { h: 'Chi tiết quy tắc và các từ đặc biệt', b: [
        { ul: ['Tính từ **2 âm tiết tận cùng -y, -er, -ow, -le**: thêm -er/-est: happy → happier, clever → cleverer, narrow → narrower, simple → simpler.', 'Một số tính từ **2 âm tiết** có thể dùng cả hai: common → commoner / more common, quiet → quieter / more quiet.', 'Tính từ **dài**: more/most + adj: more interesting, the most dangerous.', 'Đặt **the** trước so sánh nhất; không cần the trước so sánh hơn.', '**than** đi với so sánh hơn: **taller than me** (không dùng "then").'] },
        { warn: 'Sau **than** ở văn nói dùng **me/him/her/us/them**, văn viết trang trọng dùng **I/he/she…**: He is taller than **me** / than **I** (am).' }
      ] },
      { h: 'Mẫu so sánh nâng cao', b: [
        { t: { h: ['Mẫu', 'Nghĩa', 'Ví dụ'], r: [['**much / a lot / far + so sánh hơn**', 'nhiều hơn hẳn', 'This book is **much more interesting**.'], ['**a bit / slightly + so sánh hơn**', 'hơn một chút', 'Today is **a bit colder**.'], ['**the + so sánh hơn, the + so sánh hơn**', 'càng… càng…', '**The more** you read, **the more** you learn.'], ['**comparative + and + comparative**', 'ngày càng…', 'It is getting **hotter and hotter**.'], ['**one of the + so sánh nhất + danh từ số nhiều**', 'một trong những…nhất', 'Hanoi is **one of the biggest cities** in Viet Nam.']] } }
      ] },
      { h: 'So sánh và trạng từ', b: [
        { ul: ['Trạng từ ngắn: **faster, harder, earlier, later** (không dùng more).', 'Trạng từ dài (đuôi -ly): **more carefully, more slowly, more quickly**.', 'Bất quy tắc: well → **better**, badly → **worse**.', 'Ví dụ: He runs **faster** than me. She speaks **more clearly** than her brother. They play **better** than us.'] },
        { tip: 'Hỏi so sánh giữa **hai** vật: **Which is bigger, A or B?** Giữa **ba trở lên**: **Which is the biggest?**' }
      ] }
    ],
    ex: [
      ['This bag is much cheaper than that one.', 'Chiếc túi này rẻ hơn hẳn chiếc kia.'], ['It is getting darker and darker.', 'Trời ngày càng tối.'], ['Hue is one of the most beautiful cities in Viet Nam.', 'Huế là một trong những thành phố đẹp nhất Việt Nam.'], ['She speaks more clearly than her brother.', 'Cô ấy nói rõ ràng hơn anh trai.']
    ],
    mis: [['He is taller then me.', 'He is taller than me.', 'than đi với so sánh hơn.'], ['She is the more beautiful girl.', 'She is the most beautiful girl.', 'So sánh nhất dùng the most.'], ['It is getting more and more hot.', 'It is getting hotter and hotter.', 'Tính từ ngắn: hotter and hotter.']],
    quiz: [
      ['Today is ___ than yesterday.', ['hot', 'hotter', 'more hot', 'the hottest'], 1, 'hot → hotter.'],
      ['The ___ you practise, the better you speak.', ['more', 'most', 'many', 'much'], 0, 'The more…, the better…'],
      ['Hanoi is one of the ___ cities in Viet Nam.', ['bigger', 'biggest', 'more big', 'most big'], 1, 'one of the + so sánh nhất.'],
      ['She speaks English ___ than me.', ['more fluent', 'more fluently', 'fluentlier', 'fluentest'], 1, 'Trạng từ dài: more fluently.']
    ]
  });

  P('g7-quantifiers', {
    sections: [
      { h: 'Lượng từ với danh từ đếm được và không đếm được', b: [
        { t: { h: ['Lượng từ', 'Đếm được số nhiều', 'Không đếm được'], r: [['nhiều', 'many, a lot of, lots of, plenty of', 'much, a lot of, lots of, plenty of'], ['một ít (đủ)', 'a few', 'a little'], ['hầu như không', 'few', 'little'], ['một vài / một ít', 'some', 'some'], ['không có / bất kỳ', 'no, not any', 'no, not any'], ['tất cả', 'all, every (+ số ít)', 'all'], ['nửa / hầu hết', 'most of the + N', 'most of the + N']] } },
        { warn: '**much** thường dùng trong câu phủ định/câu hỏi; trong câu khẳng định dùng **a lot of**: ✗ I have much money. ✓ I have **a lot of** money. / I don\'t have **much** money.' }
      ] },
      { h: 'Đơn vị đo lường cho danh từ không đếm được', b: [
        { t: { h: ['Danh từ', 'Cách đếm', 'Ví dụ'], r: [['water, tea, milk', 'a glass / cup / bottle of', 'two cups of tea'], ['bread', 'a slice / loaf of', 'a slice of bread'], ['advice, information', 'a piece of', 'a piece of advice'], ['rice, sugar', 'a bowl / spoon / kilo of', 'a bowl of rice'], ['paper', 'a sheet / piece of', 'a sheet of paper'], ['news, furniture', 'a piece of', 'a piece of news']] } }
      ] },
      { h: 'Every, each, all, both, either, neither', b: [
        { ul: ['**every/each + danh từ số ít + động từ số ít**: **Every student has** a book. **Each** child **gets** a gift.', '**all + danh từ số nhiều**: **All students** are here.', '**both + danh từ số nhiều** (hai người/vật): **Both** my parents are teachers.', '**either / neither** + danh từ số ít (trong hai): Either answer is correct. **Neither** boy was late.'] },
        { tip: '**some** dùng được trong câu hỏi khi **mời hoặc đề nghị**: Would you like **some** tea? Can I have **some** water?' }
      ] }
    ],
    ex: [
      ['I don\'t have much free time these days.', 'Dạo này mình không có nhiều thời gian rảnh.'], ['Every student has a locker.', 'Mỗi học sinh đều có một tủ đồ.'], ['Both of my parents work in a hospital.', 'Cả bố lẫn mẹ mình đều làm ở bệnh viện.'], ['Can I have a glass of water and a slice of bread?', 'Cho mình một cốc nước và một lát bánh mì được không?']
    ],
    mis: [['I have much friends.', 'I have a lot of friends. / I have many friends.', 'friends đếm được → many/a lot of.'], ['Every students are here.', 'Every student is here.', 'every + danh từ số ít + động từ số ít.'], ['I need two breads.', 'I need two slices of bread.', 'bread không đếm được.']],
    quiz: [
      ['There isn\'t ___ rice in the bowl.', ['many', 'much', 'a few', 'few'], 1, 'rice không đếm được → much.'],
      ['___ student has a different book.', ['All', 'Every', 'Both', 'Most'], 1, 'every + số ít.'],
      ['She gave me ___ useful advice.', ['a', 'an', 'some', 'many'], 2, 'advice không đếm được → some.'],
      ['I\'d like two ___ of tea, please.', ['cups', 'cup', 'piece', 'slices'], 0, 'two cups of tea.']
    ]
  });

  P('g7-modals', {
    sections: [
      { h: 'Can, could, may: xin phép và nhờ vả', b: [
        { t: { h: ['Tình huống', 'Mẫu câu', 'Mức lịch sự'], r: [['Xin phép', '**Can I** …? / **Could I** …? / **May I** …?', 'can (thân mật) < could < may (trang trọng)'], ['Nhờ vả', '**Can you** …? / **Could you** …? / **Would you** …?', 'could/would lịch sự hơn can'], ['Đề nghị', '**Shall I** …? / **Can I** …? / **Would you like me to** …?', '—']] } },
        { p: 'Trả lời: **Sure. / Of course. / Certainly.** (đồng ý) — **Sorry, I can\'t. / I\'m afraid not.** (từ chối). Ví dụ: **Could you open the window, please?** — **Sure.**' }
      ] },
      { h: 'Must, have to, should — bắt buộc và lời khuyên', b: [
        { t: { h: ['', 'must', 'have to', 'should'], r: [['Nghĩa', 'bắt buộc (ý kiến người nói)', 'bắt buộc (quy định, hoàn cảnh)', 'nên (lời khuyên)'], ['Phủ định', 'mustn\'t = cấm', 'don\'t have to = không cần', 'shouldn\'t = không nên'], ['Quá khứ', 'had to', 'had to', '—'], ['Ví dụ', 'I must call Mum.', 'We have to wear uniforms.', 'You should sleep more.']] } },
        { warn: '**must** không có thì quá khứ: dùng **had to**: **I had to** stay home yesterday. (✗ I musted).' }
      ] },
      { h: 'Be able to, may/might, và các lỗi thường gặp', b: [
        { ul: ['**can** = **be able to** (có khả năng): I can swim = I am able to swim. Quá khứ: **could** / **was able to**.', '**may / might** + V: khả năng xảy ra (50%): It **may** rain. She **might** be late.', 'Phủ định của **can** là **cannot / can\'t**; viết liền **cannot** (không viết can not).', 'Câu hỏi đảo: **Can** you swim? **Should** I go? (không dùng do).', 'Sau modal là **V nguyên mẫu không to**: ✗ She can to swim.'] }
      ] }
    ],
    ex: [
      ['May I ask a question? — Of course.', 'Em hỏi một câu được không ạ? — Tất nhiên.'], ['Could you help me carry this box, please?', 'Bạn giúp mình mang cái hộp này được không?'], ['I had to stay at home because I was ill.', 'Mình phải ở nhà vì bị ốm.'], ['He might be late because of the traffic.', 'Có thể anh ấy đến muộn vì tắc đường.']
    ],
    mis: [['I musted finish the work yesterday.', 'I had to finish the work yesterday.', 'must không có quá khứ.'], ['Does she can sing?', 'Can she sing?', 'Modal không mượn do/does.'], ['You should to see a doctor.', 'You should see a doctor.', 'Sau should không có to.']],
    quiz: [
      ['___ I use your phone, please? (rất lịch sự)', ['May', 'Do', 'Am', 'Will'], 0, 'May I…? lịch sự nhất trong các lựa chọn.'],
      ['I ___ get up at 5 yesterday because I had an early flight.', ['must', 'have to', 'had to', 'should'], 2, 'Quá khứ của have to/must → had to.'],
      ['You ___ be late for the exam. It\'s important.', ['mustn\'t', 'don\'t have to', 'needn\'t to', 'would'], 0, 'Không được (cấm) → mustn\'t.'],
      ['He ___ be at home. His lights are on.', ['may', 'would', 'is', 'does'], 0, 'Khả năng → may.']
    ]
  });

  P('g7-adverbs', {
    sections: [
      { h: 'Các trạng từ thường gặp khác', b: [
        { t: { h: ['Loại', 'Ví dụ', 'Vị trí'], r: [['Mức độ', 'very, quite, really, too, so, extremely', 'trước tính từ/trạng từ: **very** good, **quite** tall'], ['Thời gian', 'now, soon, yesterday, today, already, yet, still', 'cuối câu hoặc đầu câu: See you **soon**.'], ['Nơi chốn', 'here, there, outside, upstairs, abroad', 'cuối câu: She lives **abroad**.'], ['Chỉ cách thức', 'slowly, well, carefully', 'sau động từ/ tân ngữ: He speaks **slowly**.']] } }
      ] },
      { h: 'Trạng từ và tính từ cùng dạng', b: [
        { t: { h: ['Từ', 'Là tính từ', 'Là trạng từ'], r: [['fast', 'a fast car', 'He runs fast.'], ['hard', 'a hard exam', 'She works hard.'], ['late', 'a late bus', 'He came late.'], ['early', 'an early flight', 'We left early.'], ['well', 'He is well. (khoẻ)', 'She sings well.'], ['daily / weekly', 'a daily newspaper', 'It is published daily.']] } },
        { warn: 'Đừng nhầm **hard/hardly**, **late/lately**, **near/nearly**: **He works hard.** ≠ **He hardly works.** · **I arrived late.** ≠ **I haven\'t seen him lately.** (gần đây).' }
      ] },
      { h: 'Vị trí và mẹo dùng đúng', b: [
        { ul: ['Trạng từ cách thức **không đứng giữa động từ và tân ngữ**: ✗ She speaks well English. → ✓ She speaks **English well**.', 'Sau **look, feel, sound, taste, smell** dùng **tính từ**: It tastes **good**. She looks **happy**.', 'Trạng từ tần suất đứng **trước động từ thường, sau be**; **sometimes, usually** có thể đứng đầu câu.', '**enough** đứng **sau** tính từ/ trạng từ: **fast enough**, **clearly enough**.'] }
      ] }
    ],
    ex: [
      ['The soup tastes delicious.', 'Món súp có vị rất ngon.'], ['He works hard, so he rarely fails.', 'Cậu ấy học hành chăm chỉ nên hiếm khi trượt.'], ['She speaks English very well.', 'Cô ấy nói tiếng Anh rất tốt.'], ['I haven\'t seen him lately.', 'Gần đây mình chưa gặp anh ấy.']
    ],
    mis: [['She speaks well English.', 'She speaks English well.', 'Trạng từ cách thức đứng sau tân ngữ.'], ['The cake tastes well.', 'The cake tastes good.', 'Sau taste dùng tính từ.'], ['He hardly works, so he is tired. (ý: làm việc chăm chỉ)', 'He works hard, so he is tired.', 'hard ≠ hardly.']],
    quiz: [
      ['She ___ plays the piano. She is a pianist.', ['good', 'well', 'goodly', 'best'], 1, 'Bổ nghĩa cho động từ → well.'],
      ['The food ___ delicious.', ['tastes', 'tastes well', 'is tasting well', 'tastes goodly'], 0, 'tastes + tính từ.'],
      ['He ___ studies, so he failed the test.', ['hard', 'hardly', 'harder', 'hardest'], 1, 'hardly = hầu như không.'],
      ['I haven\'t seen her ___.', ['late', 'lately', 'latest', 'lateness'], 1, 'lately = gần đây.']
    ]
  });
})();
