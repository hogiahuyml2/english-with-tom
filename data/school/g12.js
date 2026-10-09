/* Tiếng Anh phổ thông — Lớp 12 (ngữ pháp ôn thi THPT). Nội dung tự biên soạn cho English With Tom. */
(function () {
  var S = (window.SCHOOL = window.SCHOOL || { lessons: {} });
  function L(id, d) { d.id = id; S.lessons[id] = d; }

  L('g12-sequence-tenses', {
    grade: 12, icon: '⏳', title: 'Sự phối hợp thì', sub: 'Sequence of tenses', level: 'Nâng cao',
    summary: 'Chọn thì đúng ở mệnh đề phụ và mệnh đề chính trong các cấu trúc thường gặp.',
    sections: [
      { h: '1. Mệnh đề thời gian', b: [
        { t: { h: ['Cấu trúc', 'Ví dụ'], r: [['Tương lai: when/as soon as/before/after/until + hiện tại đơn (hoặc hiện tại hoàn thành), main clause dùng will', 'I will call you as soon as I arrive.'], ['by the time + quá khứ đơn, main clause: quá khứ hoàn thành', 'By the time we arrived, the film had started.'], ['by the time + hiện tại đơn, main clause: tương lai hoàn thành', 'By the time you come, I will have finished.'], ['since + quá khứ đơn, main clause: hiện tại hoàn thành', 'I have known her since we were children.'], ['when + quá khứ đơn, quá khứ tiếp diễn xen vào', 'I was cooking when he called.'], ['It is the first/second time + hiện tại hoàn thành', 'It is the first time I have visited Hue.'], ['It was the first time + quá khứ hoàn thành', 'It was the first time I had seen snow.']] } }
      ] },
      { h: '2. Các thì ít gặp hơn', b: [
        { ul: ['**Tương lai tiếp diễn**: will be + V-ing — hành động đang diễn ra ở một thời điểm tương lai: **This time tomorrow, I will be flying to Paris.**', '**Tương lai hoàn thành**: will have + V3 — hoàn thành trước một mốc tương lai: **By 2030, she will have graduated.**'] },
        { tip: 'Khi chọn thì, hãy tìm **mốc thời gian** và **trật tự trước – sau** của các hành động.' }
      ] }
    ],
    ex: [['I will call you as soon as I arrive.', 'Mình sẽ gọi cho bạn ngay khi mình đến.'], ['By the time we arrived, the film had started.', 'Khi chúng mình đến, bộ phim đã bắt đầu.'], ['By the time you come back, I will have finished the report.', 'Đến lúc bạn quay lại, mình đã làm xong báo cáo.'], ['I have known her since we were children.', 'Mình quen cô ấy từ khi còn nhỏ.'], ['It is the first time I have visited Hue.', 'Đây là lần đầu tiên mình đến Huế.'], ['It was the first time I had seen snow.', 'Đó là lần đầu tiên mình nhìn thấy tuyết.'], ['This time tomorrow, I will be flying to Paris.', 'Giờ này ngày mai mình sẽ đang bay đi Paris.'], ['She will have graduated by 2030.', 'Đến năm 2030 cô ấy đã tốt nghiệp.']],
    mis: [['I will call you when I will arrive.', 'I will call you when I arrive.', 'Mệnh đề thời gian dùng hiện tại đơn.'], ['It is the first time I visit Hue.', 'It is the first time I have visited Hue.', 'It is the first time + hiện tại hoàn thành.'], ['By the time I got there, the film already started.', 'By the time I got there, the film had already started.', 'by the time + quá khứ đơn → mệnh đề kia dùng quá khứ hoàn thành.'], ['I know her since 2015.', 'I have known her since 2015.', 'since → hiện tại hoàn thành.']],
    quiz: [
      ['I will phone you as soon as I ___ home.', ['will get', 'get', 'got', 'am getting to'], 1, 'Mệnh đề thời gian chỉ tương lai dùng hiện tại đơn.'],
      ['By the time he arrives, we ___ dinner.', ['will finished', 'will have finished', 'finished', 'are finishing'], 1, 'by the time + hiện tại đơn → tương lai hoàn thành.'],
      ['By the time I got to the airport, the plane ___.', ['take off', 'had taken off', 'has taken off', 'was taken off'], 1, 'by the time + quá khứ đơn → quá khứ hoàn thành.'],
      ['It is the first time she ___ abroad.', ['travels', 'travelled', 'has travelled', 'will travel'], 2, 'It is the first time + hiện tại hoàn thành.'],
      ['She ___ here since she was ten.', ['lives', 'lived', 'has lived', 'is living'], 2, 'since + quá khứ đơn → has lived.'],
      ['This time next week, we ___ on the beach.', ['lie', 'will be lying', 'would lie', 'have lain'], 1, 'This time next week → tương lai tiếp diễn.'],
      ['I ___ for you since 7 o\'clock.', ['wait', 'am waiting', 'have been waiting', 'will wait'], 2, 'since 7 o\'clock → hiện tại hoàn thành tiếp diễn.'],
      ['When I came, she ___ the piano. (lúc tôi đến cô ấy đang chơi dở)', ['played', 'was playing', 'has played', 'plays'], 1, 'Hành động đang diễn ra lúc "tôi đến" → quá khứ tiếp diễn.']
    ]
  });

  L('g12-word-formation', {
    grade: 12, icon: '🧬', title: 'Cấu tạo từ', sub: 'Word formation: tiền tố, hậu tố, từ loại', level: 'Nâng cao',
    summary: 'Nhận biết từ loại cần điền từ vị trí trong câu và chọn hậu tố, tiền tố phù hợp.',
    sections: [
      { h: '1. Vị trí quyết định từ loại', b: [
        { ul: ['**Sau mạo từ / tính từ sở hữu / tính từ** → **danh từ**: **the beauty of the city, a great achievement**', '**Trước danh từ** → **tính từ**: **a beautiful city, an interesting book**', '**Sau to be / become / seem / look / feel** → **tính từ**: **She looks happy.**', 'Bổ nghĩa cho **động từ, tính từ, cả câu** → **trạng từ**: **She sings beautifully. an extremely difficult test**', 'Sau **to / modal / do** → **động từ nguyên mẫu**.'] }
      ] },
      { h: '2. Hậu tố và tiền tố thường gặp', b: [
        { t: { h: ['Loại', 'Hậu tố / tiền tố', 'Ví dụ'], r: [['Danh từ', '-tion/-sion, -ment, -ness, -ity, -ance/-ence, -er/-or, -ist, -ship', 'education, development, happiness, ability, importance, teacher, scientist'], ['Tính từ', '-ful, -less, -able/-ible, -ous, -ive, -al, -ic, -ent/-ant, -y, -ish', 'helpful, careless, comfortable, dangerous, active, national, scientific'], ['Động từ', '-ize/-ise, -en, -ify', 'organise, widen, simplify'], ['Trạng từ', '-ly', 'quickly, carefully'], ['Phủ định', 'un-, in-, im- (trước b/m/p), il- (trước l), ir- (trước r), dis-, mis-', 'unhappy, incorrect, impossible, illegal, irregular, dishonest, misunderstand'], ['Khác', 're- (lại), over- (quá), under- (thiếu)', 'rewrite, overwork, underestimate']] } },
        { tip: 'Hãy xác định **từ loại cần điền** trước, rồi chọn hậu tố; đừng chọn theo cảm tính nghĩa.' }
      ] }
    ],
    ex: [['The beauty of the city attracts many tourists.', 'Vẻ đẹp của thành phố thu hút nhiều du khách.'], ['She sings beautifully.', 'Cô ấy hát rất hay.'], ['This is an extremely difficult question.', 'Đây là một câu hỏi cực kỳ khó.'], ['His carelessness caused the accident.', 'Sự bất cẩn của anh ấy gây ra tai nạn.'], ['It is impossible to finish it in an hour.', 'Không thể hoàn thành nó trong một giờ.'], ['The teacher gave us helpful advice.', 'Thầy giáo cho chúng mình lời khuyên hữu ích.'], ['Pollution is a serious problem.', 'Ô nhiễm là một vấn đề nghiêm trọng.'], ['The new law will widen the gap between rich and poor.', 'Luật mới sẽ nới rộng khoảng cách giàu nghèo.']],
    mis: [['He drives careful.', 'He drives carefully.', 'Bổ nghĩa cho động từ → trạng từ.'], ['She is a beauty girl.', 'She is a beautiful girl.', 'Trước danh từ cần tính từ.'], ['He is a very care driver.', 'He is a very careful driver.', 'Trước danh từ cần tính từ: careful.'], ['The educate system is good.', 'The education system is good.', 'Cần danh từ bổ nghĩa (education system).']],
    quiz: [
      ['The ___ of the project made everyone happy. (succeed)', ['success', 'successful', 'successfully', 'succeeding'], 0, 'Sau the và trước of → danh từ: success.'],
      ['She spoke ___ to the audience. (confidence)', ['confident', 'confidently', 'confidence', 'confide'], 1, 'Bổ nghĩa cho động từ spoke → trạng từ confidently.'],
      ['No one can survive for weeks without water, so it is ___ to live without it. (possible)', ['possible', 'impossible', 'unpossible', 'dispossible'], 1, 'im- + possible = impossible.'],
      ['He is a very ___ student. (hard-work)', ['hard-working', 'hard-worked', 'hard-workful', 'hardly-working'], 0, 'Tính từ ghép: hard-working.'],
      ['Air ___ is a big problem in big cities. (pollute)', ['pollute', 'polluting', 'pollution', 'polluted'], 2, 'Danh từ: pollution.'],
      ['The film was so ___ that I fell asleep. (bore)', ['bored', 'boring', 'bore', 'boredom'], 1, 'Mô tả tính chất của bộ phim → boring.'],
      ['We must ___ the road to reduce traffic jams. (wide)', ['widen', 'wideness', 'widely', 'width'], 0, 'Sau must dùng động từ: widen.'],
      ['Her ___ made her very popular. (friend)', ['friendly', 'friendliness', 'friended', 'friendless'], 1, 'Sau her + danh từ: friendliness (sự thân thiện).']
    ]
  });

  L('g12-articles-prepositions', {
    grade: 12, icon: '📌', title: 'Mạo từ và giới từ thường gặp', sub: 'Articles & dependent prepositions', level: 'Nâng cao',
    summary: 'Các quy tắc mạo từ nâng cao và giới từ đi kèm động từ, tính từ, danh từ.',
    sections: [
      { h: '1. Mạo từ nâng cao', b: [
        { ul: ['**the** với: vật duy nhất (the sun, the Internet), so sánh nhất, số thứ tự (the first), nhóm người (the poor, the rich), tên sông/biển/dãy núi/quần đảo (the Mekong, the Pacific, the Alps), quốc gia dạng số nhiều/liên bang (the USA, the Philippines), nhạc cụ (play the piano).', '**Không dùng mạo từ**: hầu hết tên nước/thành phố, bữa ăn, môn thể thao, ngôn ngữ, danh từ trừu tượng/số nhiều nói chung: **Life is beautiful. I play football.**'] }
      ] },
      { h: '2. Giới từ đi với từ khác', b: [
        { t: { h: ['Nhóm', 'Ví dụ'], r: [['Tính từ + giới từ', 'good at, interested in, afraid of, fond of, responsible for, different from, similar to, famous for, capable of'], ['Động từ + giới từ', 'depend on, rely on, succeed in, apologise for, believe in, listen to, look forward to + V-ing, congratulate on'], ['Động từ KHÔNG đi với giới từ', 'discuss (không "discuss about"), marry (không "marry with"), enter (không "enter into" khi vào phòng), attend']] } },
        { ul: ['**on time** (đúng giờ) ≠ **in time** (kịp lúc); **at the end of** (vào cuối) ≠ **in the end** (cuối cùng).', '**by bus / by car** nhưng **on foot**.'] }
      ] }
    ],
    ex: [['The Mekong is the longest river in Vietnam.', 'Mê Kông là con sông dài nhất ở Việt Nam.'], ['She plays the piano very well.', 'Cô ấy chơi piano rất giỏi.'], ['The rich should help the poor.', 'Người giàu nên giúp đỡ người nghèo.'], ['He is good at solving problems.', 'Anh ấy giỏi giải quyết vấn đề.'], ['We depend on the Internet for information.', 'Chúng ta phụ thuộc vào Internet để lấy thông tin.'], ['I am looking forward to meeting you.', 'Mình rất mong được gặp bạn.'], ['We discussed the problem for hours.', 'Chúng mình đã thảo luận vấn đề đó hàng giờ.'], ['The film is famous for its beautiful scenery.', 'Bộ phim nổi tiếng nhờ phong cảnh đẹp.']],
    mis: [['We discussed about the plan.', 'We discussed the plan.', 'discuss không đi với about.'], ['She married with a doctor.', 'She married a doctor.', 'marry không đi với with.'], ['I am good in English.', 'I am good at English.', 'good at.'], ['They depend of their parents.', 'They depend on their parents.', 'depend on.'], ['I look forward to meet you.', 'I look forward to meeting you.', 'look forward to + V-ing.']],
    quiz: [
      ['She is very good ___ playing the guitar.', ['in', 'at', 'on', 'for'], 1, 'good at + V-ing.'],
      ['We depend ___ tourism for our income.', ['of', 'in', 'on', 'at'], 2, 'depend on.'],
      ['He is afraid ___ spiders.', ['of', 'from', 'with', 'about'], 0, 'afraid of.'],
      ['We ___ the plan yesterday.', ['discussed about', 'discussed', 'discussed on', 'discussed for'], 1, 'discuss không đi với giới từ.'],
      ['The train arrived ___ time, so we weren\'t late.', ['of', 'on', 'at', 'by'], 1, 'on time = đúng giờ.'],
      ['___ Pacific Ocean is the largest ocean in the world.', ['A', 'An', 'The', '(không cần mạo từ)'], 2, 'Tên đại dương dùng the.'],
      ['My brother plays ___ football every weekend.', ['a', 'the', 'an', '(không cần mạo từ)'], 3, 'Môn thể thao không dùng mạo từ.'],
      ['She apologised ___ being late.', ['for', 'of', 'to', 'about'], 0, 'apologise for + V-ing.']
    ]
  });

  L('g12-advanced-comparison', {
    grade: 12, icon: '📈', title: 'So sánh nâng cao', sub: 'The more..., the more... / twice as ... as', level: 'Nâng cao',
    summary: 'Các cấu trúc so sánh kép, so sánh bội số, so sánh với danh từ và các từ nhấn mạnh.',
    sections: [
      { h: '1. Các cấu trúc', b: [
        { f: ['The + so sánh hơn + S + V, the + so sánh hơn + S + V (càng ... càng ...)', 'so sánh hơn + and + so sánh hơn (ngày càng ...)', 'twice / three times / half + as + adj + as', 'as many/much + N + as; more/fewer/less + N + than'] },
        { ul: ['**The more you practise, the better you become.**', '**The weather is getting hotter and hotter. / more and more crowded**', '**This bag is twice as expensive as that one.**', '**She has as many books as I do. / He drinks less coffee than I do.**', '**much / far / a lot / slightly + so sánh hơn**: **much taller, slightly cheaper**'] },
        { tip: '**fewer** + danh từ đếm được số nhiều, **less** + danh từ không đếm được: **fewer mistakes, less water**.' }
      ] },
      { h: '2. So sánh nhất với hiện tại hoàn thành', b: [
        { p: '**It is the most interesting film I have ever seen.** — **She is the kindest person I have ever met.**' },
        { warn: 'Không dùng 2 dấu hiệu so sánh cùng lúc: **more better, much more taller** đều sai (đúng: **better**, **much taller**).' }
      ] }
    ],
    ex: [['The more you practise, the better you become.', 'Càng luyện tập nhiều, bạn càng giỏi.'], ['The weather is getting hotter and hotter.', 'Thời tiết ngày càng nóng hơn.'], ['This bag is twice as expensive as that one.', 'Cái túi này đắt gấp đôi cái kia.'], ['She has as many books as I do.', 'Cô ấy có nhiều sách bằng mình.'], ['He drinks less coffee than I do.', 'Anh ấy uống ít cà phê hơn mình.'], ['This room is much bigger than mine.', 'Căn phòng này lớn hơn phòng mình nhiều.'], ['It is the most interesting film I have ever seen.', 'Đó là bộ phim thú vị nhất mà mình từng xem.'], ['There are fewer students in this class than in that one.', 'Lớp này có ít học sinh hơn lớp kia.']],
    mis: [['The more you study, you will pass.', 'The more you study, the better your results will be.', 'Cấu trúc The + so sánh hơn ..., the + so sánh hơn ...'], ['She is much more taller than me.', 'She is much taller than me.', 'Không dùng more với tính từ ngắn đã có -er.'], ['There is fewer water in the bottle.', 'There is less water in the bottle.', 'water không đếm được → less.'], ['This is the most interesting film I ever saw.', 'This is the most interesting film I have ever seen.', 'So sánh nhất + hiện tại hoàn thành.']],
    quiz: [
      ['The more you read, ___ you know.', ['the more', 'more', 'the most', 'most'], 0, 'The more ..., the more ...'],
      ['Life in the city is getting ___.', ['expensive and expensive', 'more and more expensive', 'the more expensive', 'most expensive'], 1, 'Ngày càng + tính từ dài: more and more expensive.'],
      ['This laptop is twice ___ as that one.', ['as expensive', 'more expensive', 'expensiver', 'the most expensive'], 0, 'twice + as + adj + as.'],
      ['There are ___ cars on the road than before, so the air is cleaner.', ['less', 'fewer', 'little', 'much'], 1, 'cars đếm được số nhiều → fewer.'],
      ['She is ___ taller than her sister.', ['very', 'much', 'more', 'too'], 1, 'much + so sánh hơn.'],
      ['It is the best book I ___ read.', ['never', 'have ever', 'am ever', 'did ever'], 1, 'so sánh nhất + have ever + V3.'],
      ['The older he gets, ___ he becomes.', ['the wiser', 'wiser', 'the wisest', 'more wiser'], 0, 'The older ..., the wiser ...'],
      ['I have ___ homework than my brother.', ['less', 'fewer', 'many', 'a few'], 0, 'homework không đếm được → less.']
    ]
  });

  L('g12-sentence-transformation', {
    grade: 12, icon: '🔁', title: 'Viết lại câu', sub: 'Sentence transformation', level: 'Nâng cao',
    summary: 'Các cặp cấu trúc tương đương thường gặp để viết lại câu sao cho nghĩa không đổi.',
    sections: [
      { h: '1. Cặp cấu trúc hay gặp', b: [
        { t: { h: ['Câu gốc', 'Câu viết lại'], r: [['Although he was tired, he kept working.', 'Despite being tired, he kept working.'], ['The test was so difficult that nobody passed.', 'It was such a difficult test that nobody passed.'], ['She is too young to drive.', 'She is not old enough to drive.'], ['People say that he is rich.', 'He is said to be rich. / It is said that he is rich.'], ['"I will call you," he said.', 'He said he would call me. / He promised to call me.'], ['Unless you hurry, you will be late.', 'If you do not hurry, you will be late.'], ['It takes me 30 minutes to get to school.', 'I spend 30 minutes getting to school.'], ['I last saw him in 2020.', 'I have not seen him since 2020.'], ['It is the first time she has flown.', 'She has never flown before.'], ['He prefers tea to coffee.', 'He would rather drink tea than coffee.'], ['"Why don\'t you rest?" she said.', 'She suggested that I rest. / She suggested resting.'], ['The film was very boring. We left.', 'The film was so boring that we left.'], ['You should see a doctor.', 'If I were you, I would see a doctor.']] } },
        { tip: 'Trước khi viết lại, xác định **cấu trúc ngữ pháp** của câu gốc (so/such, too/enough, bị động, điều kiện, tường thuật, since/for...), rồi chọn cặp tương đương.' }
      ] },
      { h: '2. Quy trình làm nhanh', b: [
        { ul: ['Bước 1: Tìm từ khóa/cấu trúc đặc trưng (unless, so...that, the first time, last...).', 'Bước 2: Chọn cấu trúc tương đương, kiểm tra thì và chủ ngữ.', 'Bước 3: Đọc lại câu mới, bảo đảm nghĩa không đổi và đúng ngữ pháp.'] }
      ] }
    ],
    ex: [['Although it was raining, we went out. → Despite the rain, we went out.', 'Dù trời mưa, chúng mình vẫn ra ngoài.'], ['The bag is too heavy for me to carry. → The bag is so heavy that I cannot carry it.', 'Cái túi nặng quá, mình không xách nổi.'], ['People say that she is a genius. → She is said to be a genius.', 'Người ta nói cô ấy là thiên tài.'], ['I last visited Hue in 2019. → I have not visited Hue since 2019.', 'Lần cuối mình đến Huế là năm 2019.'], ['It takes me an hour to do my homework. → I spend an hour doing my homework.', 'Mình mất một giờ để làm bài tập.'], ['"Don\'t be late," she told me. → She told me not to be late.', 'Cô ấy bảo mình đừng đến muộn.'], ['Unless you study, you will fail. → If you do not study, you will fail.', 'Nếu bạn không học, bạn sẽ trượt.'], ['He is the tallest in the class. → No one in the class is taller than him.', 'Cậu ấy cao nhất lớp.']],
    mis: [['Despite he was tired, he kept working. (viết lại từ Although)', 'Despite being tired, he kept working.', 'Despite + V-ing/cụm danh từ.'], ['I have not seen him since 3 years.', 'I have not seen him for three years.', 'since + mốc; for + khoảng thời gian.'], ['It takes me 30 minutes for getting to school.', 'It takes me 30 minutes to get to school.', 'It takes + O + time + to V.'], ['She said me she would come.', 'She told me she would come.', 'tell + O.']],
    quiz: [
      ['Although she was ill, she went to work. → ___ she went to work.', ['Despite her illness,', 'Because of her illness,', 'In spite she was ill,', 'Despite she was ill,'], 0, 'Despite + cụm danh từ.'],
      ['The test was so hard that nobody passed. → It was ___ that nobody passed.', ['so a hard test', 'such a hard test', 'such hard test', 'too hard a test'], 1, 'such + a + adj + N.'],
      ['I last saw him two years ago. → I have not seen him ___ two years.', ['since', 'for', 'ago', 'during'], 1, 'for + khoảng thời gian.'],
      ['She is too short to reach the shelf. → She is not ___ to reach the shelf.', ['enough tall', 'tall enough', 'so tall', 'taller enough'], 1, 'not tall enough.'],
      ['"I will help you," he said. → He ___ to help me.', ['said', 'promised', 'asked', 'suggested'], 1, 'promise + to V.'],
      ['People say that he is a famous singer. → He ___ a famous singer.', ['is said to be', 'says to be', 'is said be', 'said to be'], 0, 'is said to be.'],
      ['Unless you work harder, you will fail. → If you ___ harder, you will fail.', ["don't work", "won't work", "didn't work", "not work"], 0, "unless = if ... not."],
      ['It takes him an hour to cook dinner. → He ___ an hour cooking dinner.', ['spends', 'takes', 'makes', 'costs'], 0, 'spend + time + V-ing.']
    ]
  });

  L('g12-error-spotting', {
    grade: 12, icon: '🔍', title: 'Tìm lỗi sai thường gặp', sub: 'Error identification', level: 'Nâng cao',
    summary: 'Nhận diện nhanh các nhóm lỗi hay gặp trong đề thi: thì, hòa hợp, từ loại, giới từ, mạo từ, so sánh.',
    sections: [
      { h: '1. Các nhóm lỗi hay gặp', b: [
        { ul: ['**Thì**: dùng sai thì với mốc thời gian (yesterday + hiện tại hoàn thành).', '**Hòa hợp chủ – vị**: The number of ... are; Each of ... have; news are.', '**Từ loại**: dùng tính từ thay trạng từ (drive careful) hay ngược lại.', '**Giới từ**: discuss about, depend of, good in.', '**Mạo từ**: an university, play the football, a information.', '**So sánh**: more taller, the most tallest, as ... than.', '**Danh từ đếm được/không đếm được**: many advices, a lot of informations, much people.', '**Song song**: liệt kê không cùng dạng; **Đại từ**: him/his, who/which.'] },
        { tip: 'Trong câu hỏi tìm lỗi, các phần được đánh dấu A, B, C, D. Đọc cả câu, xác định **chủ ngữ – động từ – mốc thời gian**, rồi kiểm tra từng phần.' }
      ] },
      { h: '2. Cách làm bài', b: [
        { ul: ['Đọc câu để hiểu nghĩa, tìm chủ ngữ chính và động từ chính.', 'Kiểm tra từng phần được gạch chân theo danh sách lỗi ở trên.', 'Loại trừ phần chắc chắn đúng; chọn phần sai rõ nhất.'] }
      ] }
    ],
    ex: [['She doesn\'t like coffee very much.', 'Cô ấy không thích cà phê lắm.'], ['The number of students in my school is increasing.', 'Số lượng học sinh ở trường mình đang tăng.'], ['I have never been to Hue.', 'Mình chưa từng đến Huế.'], ['He drove carefully to avoid an accident.', 'Anh ấy lái xe cẩn thận để tránh tai nạn.'], ['We discussed the problem for an hour.', 'Chúng mình đã thảo luận vấn đề đó một tiếng.'], ['She gave me some useful advice.', 'Cô ấy cho mình vài lời khuyên hữu ích.'], ['My house is bigger than hers.', 'Nhà mình lớn hơn nhà cô ấy.'], ['Not only the students but also the teacher was surprised.', 'Không chỉ học sinh mà cả giáo viên cũng ngạc nhiên.']],
    mis: [['She don\'t like coffee.', "She doesn't like coffee.", 'Lỗi hòa hợp chủ vị / trợ động từ.'], ['I have seen him yesterday.', 'I saw him yesterday.', 'Lỗi thì.'], ['He gave me many advices.', 'He gave me a lot of advice.', 'advice không đếm được.'], ['She is more taller than me.', 'She is taller than me.', 'Lỗi so sánh.']],
    quiz: [
      ['She likes (A) swimming, (B) to cook, (C) and (D) reading. — Tìm lỗi sai (nhãn đặt trước phần cần xét).', ['A — swimming', 'B — to cook', 'C — and', 'D — reading'], 1, 'Cấu trúc song song: swimming, cooking, and reading (cùng dạng V-ing).', 1],
      ['I (A) have seen (B) him (C) yesterday (D) at the market. — Tìm lỗi sai.', ['A — have seen', 'B — him', 'C — yesterday', 'D — at the market'], 0, 'yesterday là mốc quá khứ → phải dùng quá khứ đơn "saw", không dùng "have seen".', 1],
      ['The number (A) of students (B) in my class (C) are (D) forty. — Tìm lỗi sai.', ['A — of students', 'B — in my class', 'C — are', 'D — forty'], 2, 'The number of + N số nhiều → động từ số ít: "is".', 1],
      ['She gave me (A) some (B) good (C) advices (D) yesterday. — Tìm lỗi sai.', ['A — some', 'B — good', 'C — advices', 'D — yesterday'], 2, 'advice là danh từ không đếm được, không thêm s: "some good advice".', 1],
      ['(A) Despite of (B) the heavy rain, (C) we (D) went out. — Tìm lỗi sai.', ['A — Despite of', 'B — the heavy rain', 'C — we', 'D — went out'], 0, 'Đúng là "Despite" hoặc "In spite of", không có "Despite of".', 1],
      ['We (A) talked (B) about the plan (C) and discussed (D) about the schedule. — Tìm lỗi sai.', ['A — talked', 'B — about the plan', 'C — and discussed', 'D — about the schedule'], 3, 'discuss không đi với about: "discussed the schedule".', 1],
      ['My brother (A) is (B) very good (C) in (D) mathematics. — Tìm lỗi sai.', ['A — is', 'B — very good', 'C — in', 'D — mathematics'], 2, 'Tính từ good đi với giới từ at: "good at mathematics".', 1],
      ["I'm (A) looking forward (B) to (C) meet (D) you soon. — Tìm lỗi sai.", ['A — looking forward', 'B — to', 'C — meet', 'D — you soon'], 2, 'look forward to + V-ing: "meeting" (phần (C) meet là phần sai).', 1]
    ]
  });

  L('g12-pronunciation-stress', {
    grade: 12, icon: '🔊', title: 'Phát âm đuôi -ed, -s/-es và quy tắc trọng âm', sub: 'Pronunciation & Word stress', level: 'Nâng cao',
    summary: 'Quy tắc đọc đuôi -ed (/t/, /d/, /ɪd/), đuôi -s/-es (/s/, /z/, /ɪz/) và các quy tắc trọng âm hay ra trong đề thi.',
    sections: [
      { h: '1. Đuôi -ed', b: [
        { t: { h: ['Đọc là', 'Khi động từ kết thúc bằng âm', 'Ví dụ'], r: [['**/ɪd/**', '/t/ hoặc /d/', 'wanted, needed, decided, visited'], ['**/t/**', 'âm vô thanh: /p/, /k/, /f/, /s/, /ʃ/, /tʃ/, /θ/', 'stopped, worked, laughed, missed, washed, watched'], ['**/d/**', 'âm hữu thanh còn lại và nguyên âm', 'played, called, loved, opened, cleaned, lived']] } },
        { tip: 'Mẹo nhớ nhóm /t/: **"Thử Phải Khó Sống Sót Cho Thật Hết Fan"** ≈ /θ/, /p/, /k/, /s/, /ʃ/, /tʃ/, /f/. Một số tính từ đuôi -ed đọc **/ɪd/**: naked, wicked, beloved, learned, ragged, rugged, crooked, wretched, aged (adj).' }
      ] },
      { h: '2. Đuôi -s / -es', b: [
        { t: { h: ['Đọc là', 'Khi từ kết thúc bằng âm', 'Ví dụ'], r: [['**/ɪz/**', '/s/, /z/, /ʃ/, /ʒ/, /tʃ/, /dʒ/', 'watches, washes, boxes, buses, judges, garages'], ['**/s/**', 'âm vô thanh: /p/, /t/, /k/, /f/, /θ/', 'stops, cats, books, laughs, months'], ['**/z/**', 'âm hữu thanh còn lại và nguyên âm', 'dogs, plays, bags, rooms, lives']] } }
      ] },
      { h: '3. Trọng âm', b: [
        { ul: ['**Danh từ và tính từ 2 âm tiết**: thường nhấn âm **1**: **TA**ble, **PEN**cil, **HAP**py. **Động từ 2 âm tiết**: thường nhấn âm **2**: re**PLY**, ad**MIT**, de**CIDE**. Ngoại lệ: **VIsit**, **EN**ter, **O**pen, **LIS**ten, **TRAV**el (động từ nhấn âm 1).', '**Đuôi -tion, -sion, -ic, -ical, -ity, -ify, -ial, -ious, -ular**: nhấn **âm ngay trước đuôi**: eduCAtion, deCIsion, ecoNOMic, aBILity, persoNALity, maTErial.', '**Đuôi -ee, -eer, -ese, -ique, -esque, -ette**: nhấn **chính đuôi đó**: employEE, enginEER, JapanESE, techNIQUE.', '**Đuôi -al, -ate, -ize, -ise, -ish, -ment, -ness, -er, -or, -ing, -ful, -less, -able, -ous** thường **không đổi trọng âm** của từ gốc: DEvelop → deVElopment.', 'Danh từ ghép: nhấn **từ đầu** (BLACKboard); cụm tính từ/ động từ ghép: nhấn **từ sau** (bad-TEMpered, well-KNOWN).'] },
        { warn: 'Cặp danh từ – động từ: **REcord (n) – reCORD (v)**, **PREsent (n) – preSENT (v)**, **IMport (n) – imPORT (v)**, **CONtract (n) – conTRACT (v)**.' }
      ] }
    ],
    ex: [
      ['She wanted to stop and call him. — wanted /ɪd/, stopped /t/, called /d/', 'Cô ấy muốn dừng lại và gọi anh ấy.'], ['He watched TV and washed the dishes.', 'Anh ấy xem TV và rửa bát. (watched /t/, washed /t/)'], ['They visited their grandparents.', 'Họ thăm ông bà. (visited /ɪd/)'],
      ['The boxes were on the buses.', 'Những chiếc hộp ở trên xe buýt. (boxes, buses /ɪz/)'], ['She loves books and cats.', 'Cô ấy thích sách và mèo. (books /s/, cats /s/)'], ['The dogs played in the garden.', 'Những chú chó chơi trong vườn. (dogs /z/, played /d/)'],
      ['Teacher ➜ TEAcher (nhấn âm 1).', 'Giáo viên (danh từ 2 âm tiết, nhấn âm 1).'], ['Decide ➜ deCIDE (nhấn âm 2).', 'Quyết định (động từ 2 âm tiết, nhấn âm 2).'], ['Education ➜ eduCAtion (nhấn âm trước -tion).', 'Giáo dục.']
    ],
    mis: [
      ['"Wanted" /wɒntɪt/', '"Wanted" /ˈwɒntɪd/', 'Kết thúc /t/ → đọc /ɪd/.'], ['"Missed" /mɪsɪd/', '"Missed" /mɪst/', 'Kết thúc /s/ vô thanh → /t/.'], ['"Watches" /ˈwɒtʃs/', '"Watches" /ˈwɒtʃɪz/', 'Kết thúc /tʃ/ → /ɪz/.'],
      ['"Employee" nhấn âm 1: EMployee', '"Employee": emploYEE', 'Đuôi -ee nhấn chính nó.']
    ],
    quiz: [
      ['Which word ends with the sound /ɪd/?', ['looked', 'wanted', 'played', 'helped'], 1, 'wanted kết thúc /t/ nên đọc /ɪd/.'],
      ['Which word has the ending pronounced /t/?', ['needed', 'stopped', 'played', 'decided'], 1, 'stopped: /p/ vô thanh → /t/.'],
      ['Which word has the ending pronounced /ɪz/?', ['books', 'dogs', 'watches', 'cats'], 2, 'watches kết thúc /tʃ/ → /ɪz/.'],
      ['Which word has the ending pronounced /z/?', ['laughs', 'stops', 'plays', 'works'], 2, 'plays kết thúc bằng nguyên âm → /z/.'],
      ['Which word has a different stress pattern?', ['teacher', 'table', 'reply', 'pencil'], 2, 'reply nhấn âm 2; các từ còn lại nhấn âm 1.'],
      ['In "education" (ed-u-ca-tion), the stressed syllable is the ___ syllable.', ['first', 'second', 'third', 'fourth'], 2, 'Nhấn âm ngay trước -tion: ed-u-CA-tion → âm thứ ba.'],
      ['Which word is stressed on the LAST syllable?', ['engineer', 'enter', 'visit', 'open'], 0, 'engineer có đuôi -eer → nhấn chính nó.'],
      ['The noun "present" is stressed on the ___ syllable.', ['first', 'second', 'third', 'no stress'], 0, 'PREsent (n) nhấn âm 1.'],
      ['Which word\'s ending is NOT pronounced /ɪd/?', ['decided', 'visited', 'missed', 'needed'], 2, 'missed kết thúc /s/ → /t/.']
    ]
  });

  L('g12-communicative-expressions', {
    grade: 12, icon: '🗣️', title: 'Hoàn thành hội thoại và tình huống giao tiếp', sub: 'Communicative functions', level: 'Nâng cao',
    summary: 'Các mẫu câu giao tiếp thường gặp trong đề thi: xin phép, đề nghị, cảm ơn, xin lỗi, khen ngợi, đồng ý/không đồng ý, mời, gợi ý, an ủi.',
    sections: [
      { h: '1. Cặp hỏi – đáp thông dụng', b: [
        { t: { h: ['Tình huống', 'Câu nói', 'Đáp lại phù hợp'], r: [['Cảm ơn', 'Thank you very much.', 'You\'re welcome. / Not at all. / My pleasure. / No problem.'], ['Xin lỗi', 'I\'m sorry I\'m late.', 'That\'s OK. / Never mind. / No worries.'], ['Khen ngợi', 'You look great today!', 'Thank you. / Thanks, that\'s nice of you to say so.'], ['Xin phép', 'Do you mind if I open the window?', 'Not at all. / Please do. / Sorry, I\'d rather you didn\'t.'], ['Nhờ vả', 'Could you help me with this bag?', 'Sure. / Of course. / Sorry, I\'m busy now.'], ['Đề nghị giúp', 'Shall I carry that for you?', 'Yes, please. That\'s very kind. / No, thanks. I can manage.'], ['Mời', 'Would you like to come to my party?', 'I\'d love to. / Yes, that would be great. / Sorry, I can\'t.'], ['Gợi ý', 'Why don\'t we go swimming?', 'Good idea! / That sounds great. / I\'d rather not.']] } },
        { warn: 'Với **Do you mind if I…?** / **Would you mind…?**, trả lời **Not at all** nghĩa là **đồng ý** (không phiền). **Yes, I do mind** là từ chối.' }
      ] },
      { h: '2. Đồng ý, không đồng ý, nêu ý kiến', b: [
        { ul: ['Đồng ý: **I agree. / Exactly. / You\'re right. / I couldn\'t agree more. / That\'s true.**', 'Không đồng ý lịch sự: **I\'m afraid I don\'t agree. / I see what you mean, but… / I\'m not sure about that.**', 'Nêu ý kiến: **In my opinion, … / As far as I\'m concerned, … / I think/believe that …**', 'Hỏi ý kiến: **What do you think of …? / How do you feel about …? / What\'s your opinion on …?**'] }
      ] },
      { h: '3. Tình huống đặc biệt', b: [
        { t: { h: ['Tình huống', 'Cách nói'], r: [['Chúc mừng', 'Congratulations! / Well done! → **Thank you.**'], ['An ủi', 'I\'m sorry to hear that. / Cheer up! → **Thanks for your kind words.**'], ['Chúc', 'Good luck! / Have a nice trip! → **Thanks. Same to you.**'], ['Hỏi đường', 'Excuse me, could you tell me the way to …? → **Go straight and turn left.**'], ['Gọi điện', 'Can I speak to …? → **Speaking. / Hold on, please.**'], ['Cảnh báo', 'Watch out! / Be careful! → **Thanks for warning me.**']] } },
        { tip: 'Cách làm bài: (1) xác định **chức năng** của câu nói; (2) loại các đáp án **không cùng chức năng** (ví dụ lời cảm ơn mà trả lời "I\'m sorry"); (3) chọn câu **tự nhiên, lịch sự** nhất.' }
      ] }
    ],
    ex: [
      ['A: Thank you for your help. — B: You\'re welcome.', 'A: Cảm ơn bạn đã giúp. — B: Không có gì.'], ['A: I\'m sorry I broke your cup. — B: Never mind.', 'A: Xin lỗi mình làm vỡ cái cốc. — B: Không sao.'], ['A: Do you mind if I sit here? — B: Not at all. Please do.', 'A: Mình ngồi đây được không? — B: Được chứ, mời bạn.'],
      ['A: Would you like some tea? — B: Yes, please.', 'A: Bạn uống trà không? — B: Có, cảm ơn.'], ['A: Could you pass me the salt? — B: Sure, here you are.', 'A: Đưa giúp mình lọ muối nhé? — B: Chắc chắn rồi, đây.'], ['A: You have a lovely dress! — B: Thank you. I bought it yesterday.', 'A: Váy của bạn đẹp quá! — B: Cảm ơn bạn. Mình mới mua hôm qua.'],
      ['A: I\'m afraid I disagree. — B: Really? Why?', 'A: Mình e là mình không đồng ý. — B: Thế à? Tại sao?'], ['A: Good luck with your exam! — B: Thanks.', 'A: Chúc bạn thi tốt! — B: Cảm ơn.'], ['A: Shall we go for a walk? — B: That sounds great!', 'A: Mình đi dạo nhé? — B: Nghe tuyệt đấy!']
    ],
    mis: [
      ['A: Thank you. — B: Thank you too.', 'A: Thank you. — B: You\'re welcome.', 'Đáp lại lời cảm ơn là You\'re welcome / Not at all.'], ['A: Would you mind opening the window? — B: Yes, of course. (muốn đồng ý)', 'A: Would you mind opening the window? — B: No, not at all.', 'Mind = phiền; đồng ý phải nói No/Not at all.'], ['A: Congratulations! — B: Congratulations to you.', 'A: Congratulations! — B: Thank you.', 'Được chúc mừng thì cảm ơn.'],
      ['A: I\'m sorry. — B: Thank you.', 'A: I\'m sorry. — B: That\'s all right.', 'Đáp lời xin lỗi: That\'s all right / Never mind.']
    ],
    quiz: [
      ['"Would you mind turning down the music?" — "___"', ['Yes, I\'d love to.', 'Not at all. Sorry.', 'You\'re welcome.', 'Never mind.'], 1, 'Mind = phiền; Not at all = không phiền → đồng ý.'],
      ['"Thank you for the lovely gift." — "___"', ['That\'s a pity.', 'My pleasure.', 'I agree.', 'Yes, I do.'], 1, 'Đáp lại lời cảm ơn.'],
      ['"I\'m sorry I forgot your book." — "___"', ['That\'s all right.', 'Thanks a lot.', 'You\'re welcome.', 'Good idea.'], 0, 'Đáp lại lời xin lỗi.'],
      ['"Would you like to join our club?" — "___"', ['No, I don\'t.', 'I\'d love to, but I\'m busy.', 'Yes, I would not.', 'You\'re welcome.'], 1, 'Từ chối lời mời lịch sự.'],
      ['"You look wonderful today!" — "___"', ['I\'m sorry to hear that.', 'Thank you. That\'s very kind of you.', 'No, I don\'t think so.', 'Not at all.'], 1, 'Nhận lời khen: Thank you.'],
      ['"Why don\'t we go to the cinema?" — "___"', ['Yes, we don\'t.', 'That\'s a good idea.', 'You\'re welcome.', 'I\'m fine, thanks.'], 1, 'Đáp lại lời gợi ý.'],
      ['"Good luck with your interview!" — "___"', ['Good luck to me.', 'Thanks.', 'Never mind.', 'It\'s my pleasure.'], 1, 'Cảm ơn lời chúc.'],
      ['"Can I speak to Mr. Nam, please?" — "___"', ['Speaking.', 'You\'re welcome.', 'I\'m sorry to hear that.', 'Not at all.'], 0, 'Trên điện thoại, người nghe là người cần gặp → Speaking.'],
      ['"Shall I carry your bag?" — "___"', ['Yes, please. That\'s very kind.', 'It doesn\'t matter.', 'You\'re welcome.', 'No problem at all, I do.'], 0, 'Chấp nhận lời đề nghị.']
    ]
  });

  L('g12-phrasal-verbs-exam', {
    grade: 12, icon: '🧷', title: 'Cụm động từ trọng tâm ôn thi THPT', sub: 'Phrasal verbs for the exam', level: 'Nâng cao',
    summary: 'Nhóm cụm động từ hay gặp trong đề thi tốt nghiệp: get, take, put, look, turn, come, go, bring, make, set, run, break, carry, call, give…',
    sections: [
      { h: '1. Nhóm động từ chính', b: [
        { t: { h: ['Động từ', 'Cụm', 'Nghĩa'], r: [['get', 'get along/on with; get over; get through; get away with; get by', 'hòa hợp; vượt qua (bệnh/khó khăn); hoàn thành/ vượt qua; thoát tội; xoay xở'], ['take', 'take after; take up; take over; take on; take off; take in', 'giống; bắt đầu theo đuổi; tiếp quản; nhận (việc); cất cánh/cởi ra; hiểu/lừa'], ['put', 'put off; put up with; put out; put forward; put on weight', 'hoãn; chịu đựng; dập tắt; đề xuất; tăng cân'], ['look', 'look after; look up to; look down on; look into; look out; look forward to', 'chăm sóc; kính trọng; coi thường; điều tra; cẩn thận; mong chờ'], ['turn', 'turn down; turn up; turn into; turn out; turn over', 'từ chối / vặn nhỏ; xuất hiện / vặn to; trở thành; hoá ra; lật'], ['come', 'come across; come up with; come down with; come out; come about', 'tình cờ gặp; nghĩ ra; mắc bệnh; xuất bản / lộ ra; xảy ra'], ['go', 'go on; go off; go through; go up; go over', 'tiếp tục / xảy ra; nổ / reo; trải qua; tăng; xem lại'], ['bring', 'bring up; bring about; bring back; bring out', 'nuôi dưỡng; gây ra; mang trả / gợi nhớ; ra mắt'], ['make', 'make up; make out; make for', 'bịa ra / làm lành; nhìn ra; tiến về'], ['run', 'run out of; run into; run over', 'cạn; tình cờ gặp; đâm / cán phải'], ['break', 'break down; break up; break out; break into', 'hỏng; chia tay / giải tán; bùng nổ; đột nhập'], ['carry', 'carry on; carry out', 'tiếp tục; thực hiện'], ['give', 'give up; give in; give out; give away', 'từ bỏ; nhượng bộ; phân phát; cho đi / làm lộ'], ['call', 'call off; call for; call on', 'huỷ; kêu gọi / đòi hỏi; ghé thăm']] } }
      ] },
      { h: '2. Cách học và cách làm bài', b: [
        { ul: ['**Học theo cụm + ví dụ**, không học nghĩa từng từ. Nhớ **tách / không tách** (put **it** off, look after **her**).', 'Đề thi thường cho **tình huống + chọn giới từ/trạng từ**: gặp "illness" → **come down with / get over**; gặp "meeting" → **put off / call off**; gặp "problem" → **deal with / sort out / come up with**.', 'Cẩn thận các cụm **ba từ**: **put up with** (chịu), **look forward to** (+ V-ing), **get on with**, **come up with**, **run out of**, **catch up with**, **keep up with**, **cut down on**.'] },
        { warn: 'Nhiều cụm có **nhiều nghĩa**: **take off** (cất cánh / cởi ra / nghỉ), **turn out** (hoá ra / sản xuất), **put out** (dập tắt / xuất bản). Hãy dựa vào ngữ cảnh.' }
      ] },
      { h: '3. Thành ngữ gần với cụm động từ', b: [
        { t: { h: ['Cụm', 'Ví dụ'], r: [['**catch up with** (đuổi kịp)', 'I must catch up with my classmates after being ill.'], ['**keep up with** (theo kịp)', 'It is hard to keep up with the latest technology.'], ['**deal with** (giải quyết)', 'How do you deal with stress?'], ['**do away with** (loại bỏ)', 'The school did away with uniforms.'], ['**face up to** (đối mặt)', 'You must face up to the truth.']] } }
      ] }
    ],
    ex: [
      ['She is getting over the flu.', 'Cô ấy đang hồi phục sau trận cúm.'], ['I can\'t put up with this noise any longer.', 'Mình không thể chịu tiếng ồn này thêm nữa.'], ['The meeting has been put off until next week.', 'Cuộc họp bị hoãn sang tuần sau.'],
      ['He takes after his father in everything.', 'Anh ấy giống bố ở mọi mặt.'], ['We came across an old photo while cleaning.', 'Chúng mình tình cờ thấy một tấm ảnh cũ khi dọn dẹp.'], ['She came down with a bad cold.', 'Cô ấy bị cảm nặng.'],
      ['The firefighters put out the fire in an hour.', 'Lính cứu hoả dập tắt đám cháy trong một giờ.'], ['The experiment turned out to be a success.', 'Thí nghiệm hoá ra thành công.'], ['War broke out in 1939.', 'Chiến tranh nổ ra năm 1939.']
    ],
    mis: [
      ['I look forward to see you.', 'I look forward to seeing you.', 'to là giới từ → V-ing.'], ['Please put on it.', 'Please put it on.', 'Đại từ đứng giữa.'], ['She got over from the illness.', 'She got over the illness.', 'get over + tân ngữ (không có from).'],
      ['He takes up his mother.', 'He takes after his mother.', 'Giống = take after.']
    ],
    quiz: [
      ['She is ___ a bad cold, so she can\'t come.', ['coming down with', 'getting on with', 'putting up with', 'looking after'], 0, 'come down with = mắc bệnh.'],
      ['The match was ___ because of the storm.', ['called off', 'called on', 'called for', 'called in'], 0, 'call off = huỷ.'],
      ['I\'m looking ___ to the new school year.', ['forward', 'after', 'into', 'down'], 0, 'look forward to + danh từ/V-ing.'],
      ['Our teacher ___ our English essays carefully.', ['went over', 'went off', 'went on', 'went up'], 0, 'go over = xem lại.'],
      ['They decided to ___ the old system.', ['do away with', 'get on for', 'look up to', 'put up for'], 0, 'do away with = loại bỏ.'],
      ['It was hard to ___ the fast pace of the course.', ['keep up with', 'give in', 'break out', 'take after'], 0, 'keep up with = theo kịp.'],
      ['I\'ll ___ you at 7 if you give me your address.', ['pick up', 'get over', 'break down', 'run out'], 0, 'pick up = đón.'],
      ['The thief ___ the house through the window.', ['broke into', 'broke up', 'broke out', 'broke down'], 0, 'break into = đột nhập.'],
      ['She was ___ by her grandparents.', ['brought up', 'brought about', 'brought in', 'brought out'], 0, 'bring up = nuôi dưỡng.']
    ]
  });

  L('g12-conditionals-wishes-review', {
    grade: 12, icon: '🎯', title: 'Tổng ôn câu điều kiện, câu ước và đảo ngữ điều kiện', sub: 'Conditionals & wishes review', level: 'Nâng cao',
    summary: 'Hệ thống lại điều kiện loại 0–3, hỗn hợp, câu ước, as if/ it\'s time, đảo ngữ điều kiện (Should/Were/Had) để làm bài chính xác.',
    sections: [
      { h: '1. Bảng tổng hợp', b: [
        { t: { h: ['Loại', 'If-clause', 'Main clause', 'Ví dụ'], r: [['0 (sự thật)', 'If + hiện tại đơn', 'hiện tại đơn', 'If you heat ice, it melts.'], ['1 (có thể xảy ra)', 'If + hiện tại đơn', 'will/can/may + V', 'If it rains, we will stay home.'], ['2 (không có thật ở hiện tại)', 'If + V2 / were', 'would/could/might + V', 'If I were you, I would apologise.'], ['3 (không có thật ở quá khứ)', 'If + had V3', 'would/could/might + have V3', 'If I had studied, I would have passed.'], ['Hỗn hợp (quá khứ → hiện tại)', 'If + had V3', 'would + V', 'If I had taken that job, I would be rich now.'], ['Hỗn hợp (hiện tại → quá khứ)', 'If + V2', 'would have V3', 'If he were smarter, he would have solved it.']] } },
        { tip: 'Xác định **loại câu** bằng thời gian + mức độ thật: hiện tại không thật → loại 2; quá khứ không thật → loại 3.' }
      ] },
      { h: '2. Đảo ngữ điều kiện', b: [
        { t: { h: ['Loại', 'Câu thường', 'Đảo ngữ (bỏ if)'], r: [['1', 'If you need help, call me.', '**Should** you need help, call me.'], ['2', 'If I were rich, I would travel.', '**Were** I rich, I would travel.'], ['3', 'If she had known, she would have come.', '**Had** she known, she would have come.']] } },
        { warn: 'Đảo ngữ phủ định: **Were it not for** your help… / **Had it not been for** your help… / **Should you not** agree…' }
      ] },
      { h: '3. Ước muốn và các cấu trúc liên quan', b: [
        { ul: ['**wish + V2/were** (hiện tại), **wish + had V3** (quá khứ), **wish + would V** (tương lai/phàn nàn); **If only** dùng giống wish.', '**as if / as though** + V2/were (hiện tại không thật), + had V3 (quá khứ).', '**It\'s (high) time + S + V2**; **would rather + S + V2/had V3**.', '**Unless = if…not**, **as long as**, **provided (that)**, **in case**, **otherwise**, **but for / without** + danh từ.', 'Câu điều kiện với **be + to**: If you are to succeed, you must work hard. (ý định); **happen to**: If you **should** meet him, say hello.'] }
      ] }
    ],
    ex: [
      ['If you mix blue and yellow, you get green.', 'Trộn xanh dương với vàng thì được xanh lá.'], ['If it rains tomorrow, we will cancel the picnic.', 'Nếu mai trời mưa, chúng ta sẽ huỷ buổi dã ngoại.'], ['If I were you, I would take that job.', 'Nếu mình là bạn, mình sẽ nhận công việc đó.'],
      ['If she had worked harder, she would have passed the exam.', 'Nếu cô ấy học chăm hơn thì đã đỗ.'], ['If I had met her earlier, I would be happier now.', 'Nếu mình gặp cô ấy sớm hơn thì giờ mình hạnh phúc hơn.'], ['Should you need any help, don\'t hesitate to ask.', 'Nếu bạn cần giúp, đừng ngần ngại hỏi.'],
      ['Were I in your position, I wouldn\'t say that.', 'Nếu mình ở vị trí của bạn, mình sẽ không nói thế.'], ['Had we left earlier, we wouldn\'t have missed the train.', 'Nếu chúng ta đi sớm hơn thì đã không lỡ tàu.'], ['I wish I could speak French fluently.', 'Giá mà mình nói được tiếng Pháp trôi chảy.']
    ],
    mis: [
      ['If I would have time, I would help you.', 'If I had time, I would help you.', 'Không dùng would trong mệnh đề if.'], ['If she studied harder, she would pass last year.', 'If she had studied harder, she would have passed last year.', 'Quá khứ không thật → loại 3.'], ['Had you called me, I will help you.', 'Had you called me, I would have helped you.', 'Đảo ngữ loại 3 + would have V3.'],
      ['Unless you don\'t hurry, you\'ll be late.', 'Unless you hurry, you\'ll be late.', 'unless đã phủ định.'], ['Were I am rich, I would travel.', 'Were I rich, I would travel.', 'Were + S + adj (không thêm am).']
    ],
    quiz: [
      ['If I ___ you, I would accept the offer.', ['am', 'was being', 'were', 'will be'], 2, 'Loại 2: If I were you.'],
      ['If she ___ harder, she would have passed.', ['studies', 'studied', 'had studied', 'would study'], 2, 'Loại 3: had V3.'],
      ['___ you need any help, please call me.', ['Should', 'Were', 'Had', 'Did'], 0, 'Đảo ngữ loại 1: Should + S + V.'],
      ['___ I known about the traffic, I would have left earlier.', ['If', 'Had', 'Were', 'Should'], 1, 'Đảo ngữ loại 3: Had + S + V3.'],
      ['If he ___ the key yesterday, he would be inside now. (hỗn hợp)', ['had found', 'found', 'finds', 'would find'], 0, 'If + had V3 (quá khứ) → would + V (hiện tại).'],
      ['I wish I ___ speak Japanese. It would help me at work.', ['can', 'could', 'will', 'would'], 1, 'wish + could.'],
      ['___ your help, we couldn\'t have finished on time.', ['Without', 'Unless', 'If', 'Should'], 0, 'Without = nếu không có.'],
      ['If it ___ rain tomorrow, we will have the picnic in the hall.', ['will', 'would', 'should', 'did'], 2, 'if it should rain = nếu lỡ trời mưa.'],
      ['If you heat water to 100°C, it ___.', ['will boils', 'boils', 'would boil', 'boiled'], 1, 'Loại 0 (sự thật): hiện tại đơn.']
    ]
  });

  L('g12-collocations-expressions', {
    grade: 12, icon: '🧲', title: 'Kết hợp từ (collocations) và thành ngữ thường gặp', sub: 'Collocations & fixed expressions', level: 'Nâng cao',
    summary: 'Các cặp từ đi cùng nhau tự nhiên (make a decision, take a risk, heavy rain…) và thành ngữ phổ biến trong bài thi.',
    sections: [
      { h: '1. make, do, take, have', b: [
        { t: { h: ['Động từ', 'Hay đi với', 'Ví dụ'], r: [['**make**', 'a decision, a mistake, progress, an effort, a suggestion, money, a noise, friends, a plan, a living', 'He **made a mistake**. · She **made progress**.'], ['**do**', 'homework, housework, research, business, one\'s best, a favour, damage, harm, the shopping', 'Please **do me a favour**. · Smoking **does harm**.'], ['**take**', 'a risk, a chance, advantage of, part in, place, care of, notice of, responsibility, a break, a photo', 'We **took a risk**. · The event **took place** in May.'], ['**have**', 'a look, a rest, a meal, a talk, fun, a chat, a bath, a headache, difficulty (in)', 'We **had fun**. · She **has difficulty (in) sleeping**.'], ['**pay**', 'attention, a visit, a compliment, respect', '**Pay attention** to the board.'], ['**keep**', 'in touch, a promise, a secret, calm, silent', 'Let\'s **keep in touch**.']] } }
      ] },
      { h: '2. Tính từ + danh từ, trạng từ + tính từ', b: [
        { t: { h: ['Loại', 'Ví dụ'], r: [['Thời tiết', 'heavy rain, strong wind, thick fog, torrential rain, bitterly cold'], ['Cảm xúc/ mức độ', 'deeply grateful, utterly ridiculous, highly recommended, fully aware, bitterly disappointed'], ['Danh từ + giới từ', 'a reason for, an increase in, a solution to, a lack of, an interest in, a demand for, damage to'], ['Tính từ + giới từ', 'good at, interested in, afraid of, responsible for, famous for, keen on, capable of'], ['Động từ + giới từ', 'depend on, rely on, consist of, result in, suffer from, apologise for, object to, contribute to']] } },
        { warn: 'Hầu hết collocations **không dịch từng từ**: "mạnh mưa" ✗ → **heavy rain** ✓; "làm bài tập" → **do homework** (✗ make homework).' }
      ] },
      { h: '3. Thành ngữ hay gặp', b: [
        { t: { h: ['Thành ngữ', 'Nghĩa', 'Ví dụ'], r: [['a piece of cake', 'rất dễ', 'The test was a piece of cake.'], ['once in a blue moon', 'rất hiếm khi', 'He visits us once in a blue moon.'], ['break the ice', 'phá vỡ sự ngượng ngập', 'A joke helped break the ice.'], ['on the other hand', 'mặt khác', 'It is cheap; on the other hand, it is slow.'], ['by heart', 'thuộc lòng', 'She learned the poem by heart.'], ['in the long run', 'về lâu dài', 'Exercise pays off in the long run.'], ['at the end of the day', 'cuối cùng thì', 'At the end of the day, it\'s your decision.'], ['the more … the more …', 'càng … càng …', 'The more you practise, the better you get.']] } }
      ] }
    ],
    ex: [
      ['You should make a decision before Friday.', 'Bạn nên đưa ra quyết định trước thứ Sáu.'], ['She does her best to help everyone.', 'Cô ấy cố hết sức để giúp mọi người.'], ['We took a risk by investing in the project.', 'Chúng mình đã liều khi đầu tư vào dự án.'],
      ['The festival takes place every autumn.', 'Lễ hội diễn ra vào mỗi mùa thu.'], ['I have difficulty in understanding fast speech.', 'Mình gặp khó khăn khi hiểu người nói nhanh.'], ['Heavy rain caused serious flooding.', 'Mưa lớn gây ra lũ lụt nghiêm trọng.'],
      ['He is responsible for organising the event.', 'Anh ấy chịu trách nhiệm tổ chức sự kiện.'], ['Smoking can result in serious illnesses.', 'Hút thuốc có thể dẫn đến các bệnh nghiêm trọng.'], ['The exam was a piece of cake.', 'Bài thi dễ như ăn bánh.']
    ],
    mis: [
      ['She made her homework.', 'She did her homework.', 'do homework.'], ['We did a mistake.', 'We made a mistake.', 'make a mistake.'], ['Strong rain fell all day.', 'Heavy rain fell all day.', 'heavy rain.'],
      ['He is afraid from spiders.', 'He is afraid of spiders.', 'afraid of.'], ['I\'m interested on music.', 'I\'m interested in music.', 'interested in.']
    ],
    quiz: [
      ['Don\'t forget to ___ attention to the instructions.', ['pay', 'make', 'take', 'do'], 0, 'pay attention.'],
      ['They ___ a mistake when they signed the contract.', ['did', 'took', 'made', 'had'], 2, 'make a mistake.'],
      ['Let\'s ___ in touch after graduation.', ['keep', 'hold', 'make', 'have'], 0, 'keep in touch.'],
      ['Smoking can ___ serious damage to your health.', ['make', 'do', 'take', 'have'], 1, 'do damage.'],
      ['There was ___ rain last night, so the streets were flooded.', ['strong', 'heavy', 'big', 'hardly'], 1, 'heavy rain.'],
      ['The meeting ___ place in the main hall.', ['made', 'took', 'did', 'held'], 1, 'took place.'],
      ['She is very good ___ solving problems.', ['in', 'at', 'on', 'with'], 1, 'good at.'],
      ['The new rule may ___ in better results.', ['result', 'lead', 'cause', 'bring'], 0, 'result in (đáp án duy nhất đi với in).'],
      ['After the long exam, it was ___ of cake! (rất dễ)', ['a piece', 'a part', 'a bit', 'a slice'], 0, 'a piece of cake.']
    ]
  });

  /* ───── Làm sâu các bài lớp 12 ───── */
  function P(id, d) {
    var l = S.lessons[id]; if (!l) throw new Error('Không thấy bài ' + id);
    (d.sections || []).forEach(function (s) { s.h = (l.sections.length + 1) + '. ' + s.h; l.sections.push(s); });
    ['ex', 'mis', 'quiz'].forEach(function (k) { if (d[k]) l[k] = l[k].concat(d[k]); });
  }

  P('g12-sequence-tenses', {
    sections: [
      { h: 'Phối hợp thì trong câu tường thuật và câu điều kiện', b: [
        { t: { h: ['Cấu trúc', 'Mệnh đề phụ', 'Mệnh đề chính', 'Ví dụ'], r: [['Tường thuật (động từ ở quá khứ)', 'lùi một thì', 'said/told + …', 'He said he **had finished**.'], ['Điều kiện loại 1', 'hiện tại đơn', 'will + V', 'If it rains, we **will stay** home.'], ['Điều kiện loại 2', 'quá khứ đơn', 'would + V', 'If I **had** time, I **would help**.'], ['Điều kiện loại 3', 'quá khứ hoàn thành', 'would have V3', 'If I **had known**, I **would have told** you.'], ['wish (hiện tại)', 'quá khứ đơn', 'wish', 'I **wish** I **knew**.'], ['As if (không thật)', 'quá khứ đơn', 'hiện tại đơn', 'He **talks** as if he **knew** everything.']] } }
      ] },
      { h: 'Các mốc thời gian đi với mỗi thì', b: [
        { t: { h: ['Mốc', 'Thì thường dùng', 'Ví dụ'], r: [['for / since', 'hiện tại hoàn thành (tiếp diễn)', 'I have worked here **since** 2018.'], ['ago, last, yesterday, in 2019', 'quá khứ đơn', 'I moved here **three years ago**.'], ['by + mốc quá khứ', 'quá khứ hoàn thành', '**By 8 p.m.**, they had left.'], ['by + mốc tương lai', 'tương lai hoàn thành', '**By 2030**, she will have graduated.'], ['at this time tomorrow', 'tương lai tiếp diễn', 'This time tomorrow I will be flying.'], ['while / when (hai hành động song song)', 'quá khứ tiếp diễn', 'While I was cooking, he was reading.'], ['just / already / yet / ever / never', 'hiện tại hoàn thành', 'I have **just** finished.']] } }
      ] },
      { h: 'Ba trường hợp dễ nhầm', b: [
        { ul: ['**since / for**: **since** + mốc (2020, Monday), **for** + khoảng (3 years, a week).', '**It is the first time + hiện tại hoàn thành** vs **It was the first time + quá khứ hoàn thành**.', '**by the time**: xác định mệnh đề chính sau đó: (quá khứ đơn → had V3), (hiện tại đơn → will have V3).', 'Sau **hardly/scarcely … when**, **no sooner … than** dùng **quá khứ hoàn thành ở vế trước** và **quá khứ đơn ở vế sau**.', 'Với **when** nối hai hành động nối tiếp trong quá khứ dùng **quá khứ đơn cả hai**: **When he arrived, I left.**'] },
        { warn: 'Không chia **will** trong mệnh đề **if/when/as soon as/before/until/by the time** khi nói tương lai.' }
      ] }
    ],
    ex: [
      ['He said he had already finished the report.', 'Anh ấy nói anh đã làm xong báo cáo rồi.'], ['By 2030, she will have graduated.', 'Đến năm 2030, cô ấy sẽ tốt nghiệp.'], ['When he arrived, I left.', 'Khi anh ấy đến thì mình đi.'], ['Hardly had I arrived when it started to rain.', 'Mình vừa đến thì trời đổ mưa.']
    ],
    mis: [['I have lived here since five years.', 'I have lived here for five years.', 'for + khoảng thời gian.'], ['By 2030, she will graduate.', 'By 2030, she will have graduated.', 'by + mốc tương lai → will have V3.'], ['It was the first time I saw snow.', 'It was the first time I had seen snow.', 'It was the first time + had V3.']],
    quiz: [
      ['By the end of this month, I ___ the whole book.', ['will reading', 'will have read', 'read', 'am reading'], 1, 'by + mốc tương lai → will have read.'],
      ['He said that he ___ the work already.', ['finish', 'had finished', 'has finished', 'will finish'], 1, 'Tường thuật → had finished.'],
      ['I\'ll wait here until you ___ back.', ['will come', 'come', 'came', 'would come'], 1, 'until + hiện tại đơn.'],
      ['She has been learning English ___ six years.', ['since', 'for', 'ago', 'during'], 1, 'for + khoảng thời gian.']
    ]
  });

  P('g12-word-formation', {
    sections: [
      { h: 'Bảng họ từ thường gặp trong đề', b: [
        { t: { h: ['Danh từ', 'Tính từ', 'Trạng từ', 'Động từ'], r: [['success', 'successful', 'successfully', 'succeed'], ['help', 'helpful / helpless', 'helpfully', 'help'], ['care', 'careful / careless', 'carefully / carelessly', 'care'], ['beauty', 'beautiful', 'beautifully', 'beautify'], ['danger', 'dangerous', 'dangerously', 'endanger'], ['decision', 'decisive', 'decisively', 'decide'], ['economy', 'economic / economical', 'economically', 'economise'], ['environment', 'environmental', 'environmentally', '—'], ['create / creation', 'creative', 'creatively', 'create'], ['peace', 'peaceful', 'peacefully', '—'], ['strength', 'strong', 'strongly', 'strengthen'], ['length', 'long', 'long', 'lengthen']] } },
        { warn: 'Cặp dễ nhầm: **economic** (thuộc kinh tế) ≠ **economical** (tiết kiệm); **historic** (có tầm quan trọng lịch sử) ≠ **historical** (thuộc lịch sử); **childish** (trẻ con, xấu) ≠ **childlike** (ngây thơ).' }
      ] },
      { h: 'Danh từ chỉ người, danh từ trừu tượng và từ phủ định', b: [
        { ul: ['**Người**: -er/-or (teacher, visitor), -ist (scientist, artist), -ian (musician), -ant/-ent (assistant, student), -ee (employee).', '**Trừu tượng**: -tion/-sion, -ment, -ness, -ity, -ance/-ence, -ship, -hood: (information, agreement, kindness, ability, importance, friendship, childhood).', '**Phủ định**: **un-** (unhappy, unfair), **in-** (incorrect), **im-** (impossible, impolite), **il-** (illegal), **ir-** (irregular), **dis-** (dislike, disagree), **non-** (nonsense), **mis-** (misunderstand).', 'Một từ có thể có **hai dạng phủ định tương ứng hai nghĩa**: **independent / dependent**.'] }
      ] },
      { h: 'Mẹo làm bài điền từ', b: [
        { ul: ['**Vị trí trước, nghĩa sau**: xác định từ cần điền là N/Adj/Adv/V theo vị trí; **sau đó** mới xem nghĩa (tích cực/ tiêu cực, số nhiều/số ít).', 'Sau **a/an/the/this/some/many/…** có thể là **danh từ** hoặc **tính từ + danh từ**.', 'Trước danh từ có thể cần **tính từ** hoặc **danh từ ghép** (e.g. **a tourist attraction**).', 'Số nhiều hay số ít: nếu trước chỗ trống có **many, several, two**, danh từ cần **số nhiều**: **many opportunities**.', 'Kiểm tra **nghĩa phủ định** của ngữ cảnh: "…to him because he was **un**…".'] },
        { tip: 'Làm bài: đặt từ vào câu và đọc lại; nếu câu có "unluckily", "impossible" cần xét nghĩa phủ định.' }
      ] }
    ],
    ex: [
      ['Her creativity impressed the judges.', 'Sự sáng tạo của cô ấy gây ấn tượng với ban giám khảo.'], ['This is an economical way to travel.', 'Đây là cách đi lại tiết kiệm.'], ['The government plans to strengthen the economy.', 'Chính phủ dự định củng cố nền kinh tế.'], ['He was unable to attend because of his illness.', 'Anh ấy không thể tham dự vì bị bệnh.']
    ],
    mis: [['She is a very success businesswoman.', 'She is a very successful businesswoman.', 'Trước danh từ cần tính từ.'], ['The meeting was an economical success.', 'The meeting was an economic success.', 'economic = thuộc kinh tế.'], ['He is dependence on his parents.', 'He is dependent on his parents.', 'be + tính từ.']],
    quiz: [
      ['Many young people have ___ opportunities nowadays. (employ)', ['employ', 'employment', 'employing', 'employed'], 1, 'Trong ngữ cảnh: employment opportunities (danh từ ghép) — chọn employment.'],
      ['It is ___ to finish this in an hour; we need at least three. (possible)', ['possible', 'impossible', 'possibly', 'possibility'], 1, 'Nghĩa phủ định: impossible.'],
      ['He solved the problem ___. (clever)', ['clever', 'cleverly', 'cleverness', 'cleverer'], 1, 'Bổ nghĩa cho động từ → trạng từ.'],
      ['The ___ of the new law surprised everyone. (introduce)', ['introduce', 'introduction', 'introductory', 'introduced'], 1, 'Sau the → danh từ.']
    ]
  });

  P('g12-articles-prepositions', {
    sections: [
      { h: 'Mạo từ: các trường hợp đặc biệt', b: [
        { t: { h: ['Dùng the', 'Không dùng the'], r: [['the Netherlands, the UK, the USA, the Philippines', 'Vietnam, France, Japan, Hue, Asia'], ['the Mekong, the Nile, the Pacific, the Alps, the Himalayas', 'Mount Everest, Lake Hoan Kiem'], ['the + nhạc cụ: play **the** guitar', 'play + môn thể thao/trò chơi: play football, chess'], ['in the morning/afternoon/evening', 'at night, at noon; **by** bus; **at** home'], ['the + adj: the elderly, the young', 'go to school/bed/work/hospital (mục đích chính)'], ['the + so sánh nhất / số thứ tự', 'danh từ số nhiều/không đếm được nói chung']] } },
        { tip: 'So sánh: **go to school** (đi học) ≠ **go to the school** (đến toà nhà trường, ví dụ để họp); **in hospital** (nằm viện) ≠ **in the hospital** (ở toà nhà bệnh viện).' }
      ] },
      { h: 'Giới từ đi với danh từ và cụm cố định', b: [
        { t: { h: ['Danh từ + giới từ', 'Ví dụ'], r: [['reason for', 'the reason for his absence'], ['solution to', 'a solution to the problem'], ['increase/decrease in', 'an increase in prices'], ['demand for', 'a demand for workers'], ['key to', 'the key to success'], ['advantage / disadvantage of', 'the advantages of travelling'], ['difference between', 'the difference between A and B'], ['effect/impact on', 'the effect of pollution on health']] } },
        { ul: ['**in** + year/month/century; **on** + date/day; **at** + time/ night/ weekend.', 'Cụm cố định: **in fact, in general, in particular, at first, at last, on purpose, by accident, by mistake, on the whole, on average, under pressure, out of order, in charge of, on behalf of**.'] }
      ] },
      { h: 'Lỗi giới từ hay gặp', b: [
        { ul: ['✗ discuss **about** → ✓ discuss sth (talk **about**).', '✗ depend **of** → ✓ depend **on**.', '✗ good **in** → ✓ good **at**; ✗ interested **on** → ✓ interested **in**.', '✗ arrive **to** Hanoi → ✓ arrive **in** Hanoi / **at** the station.', '✗ married **with** → ✓ married **to** / marry sb.', '✗ different **than** (văn trang trọng) → ✓ different **from**.', '✗ explain **me** → ✓ explain **to** me.'] }
      ] }
    ],
    ex: [
      ['There has been an increase in the number of tourists.', 'Số lượng khách du lịch đã tăng lên.'], ['She is in charge of the marketing team.', 'Cô ấy phụ trách nhóm tiếp thị.'], ['I deleted the file by mistake.', 'Mình xoá nhầm tập tin.'], ['He was taken to hospital after the accident.', 'Anh ấy được đưa vào viện sau tai nạn.']
    ],
    mis: [['We arrived to Hanoi at night.', 'We arrived in Hanoi at night.', 'arrive in + thành phố.'], ['She is married with a doctor.', 'She is married to a doctor.', 'married to.'], ['The reason of his absence is unknown.', 'The reason for his absence is unknown.', 'reason for.']],
    quiz: [
      ['There is an increase ___ the price of oil.', ['of', 'in', 'on', 'for'], 1, 'an increase in.'],
      ['We bumped into each other ___ accident.', ['by', 'in', 'on', 'at'], 0, 'by accident.'],
      ['The Mekong is ___ longest river in Southeast Asia.', ['a', 'an', 'the', 'no article'], 2, 'So sánh nhất → the.'],
      ['He is the person who is ___ charge of this project.', ['at', 'in', 'on', 'by'], 1, 'in charge of.']
    ]
  });

  P('g12-advanced-comparison', {
    sections: [
      { h: 'So sánh bằng và so sánh gấp nhiều lần', b: [
        { t: { h: ['Mẫu', 'Ví dụ'], r: [['**twice / three times / half + as + adj + as**', 'This bag is **twice as heavy as** that one.'], ['**as + many/much + N + as**', 'She has **as many books as** I do.'], ['**the same + N + as**', 'My brother is **the same age as** me.'], ['**as … as possible / as … as one can**', 'Come **as soon as possible**.'], ['**not so/as … as**', 'He isn\'t **as tall as** his brother.'], ['**no more … than** / **no less … than**', 'He is **no more intelligent than** his brother.']] } },
        { tip: 'Có thể dùng **times** + **as … as** hoặc **times** + so sánh hơn + **than**: three times as big as = three times bigger than (đều chấp nhận trong nói).' }
      ] },
      { h: 'So sánh kép và so sánh dần', b: [
        { ul: ['**The + so sánh hơn, the + so sánh hơn**: **The harder you work, the more you earn.**', 'Có thể lược chủ ngữ + be: **The sooner, the better.**', '**Comparative + and + comparative**: **more and more important / better and better**.', '**more and more + adj dài / adj-er and adj-er**: more and more expensive; colder and colder.', 'Dạng đảo: **The more** + S + V, **the more** + S + V: **The more he studies, the more he knows.**'] }
      ] },
      { h: 'So sánh nhất và các mẫu nhấn mạnh', b: [
        { ul: ['**the + so sánh nhất + (N) + (that) + S + have/has ever + V3**: **It is the best film I have ever seen.**', '**one of the + so sánh nhất + N số nhiều**: one of the most famous singers.', '**by far / easily + the + so sánh nhất**: **She is by far the best student.**', '**not … any + so sánh hơn**: **I can\'t walk any faster.**', '**far / much / a great deal / considerably + so sánh hơn**; **a bit / slightly / a little** (chút ít).'] },
        { warn: 'So sánh **hai** đối tượng dùng so sánh hơn: **Which is bigger, A or B?**; từ **ba** trở lên dùng so sánh nhất.' }
      ] }
    ],
    ex: [
      ['The sooner, the better.', 'Càng sớm càng tốt.'], ['He is no more intelligent than his brother.', 'Anh ấy cũng không thông minh hơn em trai.'], ['She is by far the best student in the class.', 'Cô ấy là học sinh giỏi nhất lớp với khoảng cách xa.'], ['Please come as soon as possible.', 'Hãy đến sớm nhất có thể.']
    ],
    mis: [['The harder you work, you earn more.', 'The harder you work, the more you earn.', 'Cần cặp the…, the….'], ['Which is more big, A or B?', 'Which is bigger, A or B?', 'big → bigger.'], ['It is the best film I have ever saw.', 'It is the best film I have ever seen.', 'ever + V3.']],
    quiz: [
      ['This bag is three times ___ as that one.', ['expensive', 'more expensive', 'as expensive', 'the most expensive'], 2, 'three times as expensive as.'],
      ['The ___ you leave, the better.', ['early', 'earlier', 'earliest', 'more early'], 1, 'The + so sánh hơn.'],
      ['She is ___ the best player in the team.', ['by far', 'so far', 'as far', 'far from'], 0, 'by far + the best.'],
      ['It is getting more and ___ difficult.', ['more', 'much', 'most', 'many'], 0, 'more and more + adj dài.']
    ]
  });

  P('g12-sentence-transformation', {
    sections: [
      { h: 'Thêm các cặp tương đương quan trọng', b: [
        { t: { h: ['Cấu trúc gốc', 'Cấu trúc viết lại'], r: [['I haven\'t seen her for two years.', 'The last time I saw her was two years ago.'], ['He started learning English five years ago.', 'He has been learning English for five years.'], ['"Shall we go swimming?" she said.', 'She suggested going swimming.'], ['It is not necessary to bring a gift.', 'You needn\'t bring a gift.'], ['People believe that he is honest.', 'He is believed to be honest.'], ['I regret not studying harder.', 'I wish I had studied harder.'], ['Without your help, I would fail.', 'If it were not for your help, I would fail.'], ['She worked so hard that she passed.', 'She worked hard in order to pass.'], ['I\'d prefer you to stay.', 'I\'d rather you stayed.'], ['His house is bigger than mine.', 'My house is not as big as his.']] } }
      ] },
      { h: 'Nhóm cấu trúc theo chủ điểm', b: [
        { ul: ['**Bị động**: She is painting the wall. → The wall is being painted. · They say… → It is said that…', '**Tường thuật**: "I will help you," he said. → He promised to help me.', '**Điều kiện**: If you don\'t hurry, you will be late. → Unless you hurry…; If I were you… → Were I you…', '**Câu ước**: I\'m sorry I didn\'t come. → I wish I had come.', '**So sánh**: A is taller than B. → B is not as tall as A. · He is the tallest. → No one is taller than him.', '**Mệnh đề quan hệ rút gọn**: The man who is standing there → The man standing there…', '**Tương phản**: Although he was ill → Despite being ill / In spite of his illness.', '**Nhấn mạnh**: He didn\'t realise it until later. → Not until later did he realise it.'] }
      ] },
      { h: 'Lưu ý khi viết lại câu', b: [
        { ul: ['Giữ **nghĩa** và **sắc thái**; không thêm/bớt thông tin.', 'Giữ **thì** (trừ khi cấu trúc buộc đổi).', 'Kiểm tra **chủ ngữ** và **động từ** hòa hợp sau khi đổi.', 'Tránh lặp lại **từ đã gợi ý** nếu đề bắt đầu sẵn bằng một từ.', '**Dấu câu** và **hoa thường** đúng; dùng **từ phủ định** (not, never) đúng chỗ.'] },
        { tip: 'Hỏi bản thân: "Đề muốn kiểm tra cấu trúc nào?" Ghi lại cặp tương đương trước khi viết.' }
      ] }
    ],
    ex: [
      ['She wishes she had told him the truth. ← She regrets not telling him the truth.', 'Cô ấy tiếc vì đã không nói sự thật với anh ấy.'], ['The last time I saw him was in 2019. → I haven\'t seen him since 2019.', 'Lần cuối mình gặp anh ấy là năm 2019.'], ['He didn\'t realise the danger until later. → Not until later did he realise the danger.', 'Mãi sau anh ấy mới nhận ra nguy hiểm.'], ['His house is bigger than mine. → My house is not as big as his.', 'Nhà anh ấy to hơn nhà mình.']
    ],
    mis: [['The last time I saw her was two years. (viết lại)', 'The last time I saw her was two years ago.', 'Thiếu ago.'], ['Not until he left, I understood.', 'Not until he left did I understand.', 'Đảo ngữ sau Not until.'], ['She suggested me to go swimming.', 'She suggested going swimming.', 'suggest + V-ing.']],
    quiz: [
      ['I haven\'t seen her for two years. → The last time I ___ her was two years ago.', ['saw', 'have seen', 'see', 'had seen'], 0, 'The last time I saw… was…'],
      ['"Let\'s go to the beach," she said. → She suggested ___ to the beach.', ['go', 'going', 'to go', 'that we going'], 1, 'suggest + V-ing.'],
      ['People believe that he is honest. → He ___ to be honest.', ['believes', 'is believed', 'was believing', 'believed'], 1, 'Bị động: is believed to be.'],
      ['He is the tallest student in the class. → No other student in the class is ___ than him.', ['tall', 'taller', 'tallest', 'as tall'], 1, 'No one is taller than him.']
    ]
  });

  P('g12-error-spotting', {
    sections: [
      { h: 'Danh sách lỗi hay gặp theo cấu trúc', b: [
        { t: { h: ['Chủ điểm', 'Lỗi mẫu', 'Sửa'], r: [['so sánh', 'He is the most tallest.', 'the tallest'], ['bị động', 'The window was broke.', 'was broken'], ['to V / V-ing', 'She enjoys to read.', 'enjoys reading'], ['điều kiện', 'If I will see her, I will tell her.', 'If I see her'], ['tường thuật', 'He told that he was busy.', 'He said (that) / He told me (that)'], ['quan hệ', 'The man which lives next door…', 'who'], ['liên từ', 'Although he is poor but he is happy.', 'bỏ but'], ['từ nối', 'Despite of the rain…', 'Despite the rain'], ['đại từ', 'Everyone should do their best, doesn\'t he?', 'don\'t they'], ['thì', 'I live here since 2015.', 'have lived']] } }
      ] },
      { h: 'Lỗi về từ loại và vị trí', b: [
        { ul: ['**Tính từ ↔ trạng từ**: ✗ She sings beautiful. → ✓ beautifully; ✗ He is a good-looked man → ✓ good-looking.', '**Danh từ ↔ tính từ**: ✗ She is a success woman. → ✓ successful.', '**Tính từ -ed/-ing**: ✗ The film was bored. → ✓ boring; ✗ I am boring. → ✓ bored.', '**Số nhiều**: ✗ two informations / many advices / a furnitures.', '**Thứ tự từ**: ✗ I don\'t know where is he. → ✓ where he is.'] }
      ] },
      { h: 'Chiến lược khi làm bài tìm lỗi', b: [
        { ul: ['**Đọc nhanh cả câu** lấy nghĩa, rồi quay lại tìm chủ ngữ – động từ – mốc thời gian.', 'Chú ý **ngữ pháp cố định**: look forward to + V-ing, be used to + V-ing, in spite of + N, so/such, too/enough.', 'Kiểm tra **hòa hợp**: the number of/ a number of; each/every + số ít; news, information.', 'Phần **không bị gạch chân** thường đúng; tập trung vào ô A, B, C, D.', 'Nếu phân vân giữa hai phần, hỏi: **lỗi này có tên gọi ngữ pháp rõ ràng không?**'] },
        { warn: 'Đừng sửa phần chỉ "nghe lạ" mà đúng ngữ pháp; tìm **lỗi có quy tắc**.' }
      ] }
    ],
    ex: [
      ['The window was broken by the storm.', 'Cửa sổ bị vỡ do cơn bão.'], ['He said that he was busy.', 'Anh ấy nói anh bận.'], ['Everyone should do their best.', 'Mọi người nên cố gắng hết sức.'], ['She sings beautifully.', 'Cô ấy hát rất hay.']
    ],
    mis: [['The film was bored.', 'The film was boring.', 'Vật gây cảm giác → -ing.'], ['He is the most tallest boy.', 'He is the tallest boy.', 'Không dùng most cùng -est.'], ['I don\'t know where is he.', 'I don\'t know where he is.', 'Không đảo trong mệnh đề danh từ.']],
    quiz: [
      ['She (A) enjoys (B) to read (C) novels (D) in her free time. — Tìm lỗi sai.', ['A — enjoys', 'B — to read', 'C — novels', 'D — in her free time'], 1, 'enjoy + V-ing: "reading".', 1],
      ['If (A) it (B) will rain (C) tomorrow, we (D) will stay home. — Tìm lỗi sai.', ['A — it', 'B — will rain', 'C — tomorrow, we', 'D — will stay home'], 1, 'Mệnh đề if dùng hiện tại đơn: "rains".', 1],
      ['The film (A) was (B) so (C) bored (D) that we left. — Tìm lỗi sai.', ['A — was', 'B — so', 'C — bored', 'D — that we left'], 2, 'Vật gây cảm giác: "boring".', 1],
      ['He (A) told (B) that (C) he (D) was tired. — Tìm lỗi sai.', ['A — told', 'B — that', 'C — he', 'D — was tired'], 0, 'told cần tân ngữ: "told me that…" hoặc dùng "said".', 1]
    ]
  });
})();
