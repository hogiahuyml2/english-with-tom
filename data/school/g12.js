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
      ['By the time he arrives, we ___ dinner.', ['will finish', 'will have finished', 'finished', 'are finishing'], 1, 'by the time + hiện tại đơn → tương lai hoàn thành.'],
      ['By the time I got to the airport, the plane ___.', ['took off', 'had taken off', 'has taken off', 'was taken off'], 1, 'by the time + quá khứ đơn → quá khứ hoàn thành.'],
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
      ['It is ___ to live without water. (possible)', ['possible', 'impossible', 'unpossible', 'dispossible'], 1, 'im- + possible = impossible.'],
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
      ['The train arrived ___ time, so we weren\'t late.', ['in', 'on', 'at', 'by'], 1, 'on time = đúng giờ.'],
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
      ['It is the best book I ___ read.', ['ever', 'have ever', 'am ever', 'did ever'], 1, 'so sánh nhất + have ever + V3.'],
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
      ['She likes (A) swimming, (B) to cook, (C) and (D) reading. — Tìm lỗi sai (nhãn đặt trước phần cần xét).', ['A', 'B', 'C', 'D'], 1, 'Cấu trúc song song: swimming, cooking, and reading (cùng dạng V-ing).', 1],
      ['I (A) have seen (B) him (C) yesterday (D) at the market. — Tìm lỗi sai.', ['A', 'B', 'C', 'D'], 0, 'yesterday là mốc quá khứ → phải dùng quá khứ đơn "saw", không dùng "have seen".', 1],
      ['The number (A) of students (B) in my class (C) are (D) forty. — Tìm lỗi sai.', ['A', 'B', 'C', 'D'], 2, 'The number of + N số nhiều → động từ số ít: "is".', 1],
      ['She gave me (A) some (B) good (C) advices (D) yesterday. — Tìm lỗi sai.', ['A', 'B', 'C', 'D'], 2, 'advice là danh từ không đếm được, không thêm s: "some good advice".', 1],
      ['(A) Despite of (B) the heavy rain, (C) we (D) went out. — Tìm lỗi sai.', ['A', 'B', 'C', 'D'], 0, 'Đúng là "Despite" hoặc "In spite of", không có "Despite of".', 1],
      ['We (A) talked (B) about the plan (C) and discussed (D) about the schedule. — Tìm lỗi sai.', ['A', 'B', 'C', 'D'], 3, 'discuss không đi với about: "discussed the schedule".', 1],
      ['My brother (A) is (B) very good (C) in (D) mathematics. — Tìm lỗi sai.', ['A', 'B', 'C', 'D'], 2, 'Tính từ good đi với giới từ at: "good at mathematics".', 1],
      ["I'm (A) looking forward (B) to (C) meet (D) you soon. — Tìm lỗi sai.", ['A', 'B', 'C', 'D'], 2, 'look forward to + V-ing: "meeting" (phần (C) meet là phần sai).', 1]
    ]
  });
})();
