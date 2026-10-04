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
      ['The phone is ringing. I ___ answer it.', ["am going to", "will", "am", "would to"], 1, 'Quyết định tức thời lúc nói → will.'],
      ['We have bought the tickets. We ___ visit Da Nang next week.', ['will', 'are going to', 'visit', 'are visiting to'], 1, 'Kế hoạch đã chuẩn bị → be going to.'],
      ['Look at the sky! It ___ rain.', ['will', 'is going to', 'would', 'rains'], 1, 'Có bằng chứng (nhìn bầu trời) → is going to.'],
      ['I promise I ___ call you tonight.', ['am going to', 'will', 'am', 'can to'], 1, 'Lời hứa → will.'],
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
      ['Would you like ___ coffee?', ['any', 'some', 'many', 'few'], 1, 'Lời mời dùng some.'],
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
      ['___ I use your dictionary, please?', ['Must', 'Should', 'Can', 'Do'], 2, 'Xin phép → Can I ...?'],
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
})();
