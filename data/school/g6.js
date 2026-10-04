/* Tiếng Anh phổ thông — Lớp 6 (ngữ pháp). Nội dung tự biên soạn cho English With Tom.
   Cấu trúc: L(id, {grade, icon, title, sub, level, summary, sections:[{h,b:[...]}], ex:[[en,vi]], mis:[[sai,đúng,ghi chú]], quiz:[[câu hỏi,[4 đáp án],chỉ số đúng,giải thích]]}) */
(function () {
  var S = (window.SCHOOL = window.SCHOOL || { lessons: {} });
  function L(id, d) { d.id = id; S.lessons[id] = d; }

  L('g6-tobe', {
    grade: 6, icon: '🙋', title: 'Động từ to be', sub: 'am / is / are', level: 'Cơ bản',
    summary: 'Dùng để giới thiệu tên, tuổi, nghề nghiệp, quốc tịch, nơi chốn và mô tả người/vật.',
    sections: [
      { h: '1. Chia động từ to be ở thì hiện tại', b: [
        { t: { h: ['Chủ ngữ', 'to be', 'Viết tắt', 'Phủ định'], r: [['I', 'am', "I'm", 'am not (không viết tắt)'], ['he / she / it / danh từ số ít', 'is', "he's / she's / it's", "isn't"], ['you / we / they / danh từ số nhiều', 'are', "you're / we're / they're", "aren't"]] } },
        { f: ['(+) S + am/is/are + ...', '(-) S + am/is/are + not + ...', '(?) Am/Is/Are + S + ...?'] },
        { p: 'Trả lời ngắn: **Yes, I am. / No, I\'m not.** — **Yes, she is. / No, she isn\'t.** — **Yes, they are. / No, they aren\'t.**' }
      ] },
      { h: '2. Khi nào dùng to be?', b: [
        { ul: ['Giới thiệu tên, tuổi, nghề nghiệp, quốc tịch: **I am Lan. I am 11. He is a doctor.**', 'Nói về nơi chốn: **They are at school.**', 'Mô tả tính chất: **The room is big.**'] },
        { tip: 'Nói tuổi trong tiếng Anh dùng **to be**, không dùng "have": **I am 12 years old.**' }
      ] }
    ],
    ex: [['I am Lan. Nice to meet you.', 'Mình là Lan. Rất vui được gặp bạn.'], ['She is a teacher at my school.', 'Cô ấy là giáo viên ở trường mình.'], ['They are my friends.', 'Họ là bạn của mình.'], ["He isn't at home now.", 'Bây giờ anh ấy không ở nhà.'], ['Are you a student? — Yes, I am.', 'Bạn là học sinh à? — Vâng, đúng vậy.'], ['It is a big city.', 'Đó là một thành phố lớn.'], ["We aren't late for class.", 'Chúng mình không đến lớp muộn.'], ['Is your mother a nurse? — No, she isn\'t.', 'Mẹ bạn là y tá à? — Không phải.']],
    mis: [['I is a student.', 'I am a student.', 'Chủ ngữ I đi với am.'], ['She are happy.', 'She is happy.', 'She (số ít) đi với is.'], ['I am agree with you.', 'I agree with you.', '"agree" là động từ thường, không dùng thêm to be.'], ['He is have a bike.', 'He has a bike.', 'Không dùng to be + động từ thường.']],
    quiz: [
      ['I ___ twelve years old.', ['am', 'is', 'are', 'be'], 0, 'Chủ ngữ I đi với am.'],
      ['My parents ___ teachers.', ['is', 'am', 'are', 'be'], 2, 'My parents là số nhiều → are.'],
      ['___ she a nurse?', ['Are', 'Is', 'Am', 'Do'], 1, 'She đi với is; câu hỏi đảo is lên trước.'],
      ['We ___ not in the classroom.', ['is', 'are', 'am', 'does'], 1, 'We đi với are: We are not.'],
      ['That ___ my new bike.', ['am', 'are', 'is', 'be'], 2, 'That là số ít → is.'],
      ['Tom and I ___ good friends.', ['am', 'is', 'are', 'be'], 2, 'Tom and I = we (số nhiều) → are.'],
      ['Are you ready? — Yes, I ___.', ['am', 'is', 'are', 'do'], 0, 'Trả lời ngắn với I dùng am.'],
      ['The shoes ___ under the bed.', ['is', 'are', 'am', 'be'], 1, 'The shoes là số nhiều → are.']
    ]
  });

  L('g6-present-simple', {
    grade: 6, icon: '⏰', title: 'Thì hiện tại đơn', sub: 'Present Simple', level: 'Cơ bản',
    summary: 'Diễn tả thói quen, sự thật hiển nhiên và lịch trình cố định.',
    sections: [
      { h: '1. Cấu trúc', b: [
        { f: ['(+) S + V(s/es) — he/she/it thêm s/es', '(-) S + do not (don\'t) / does not (doesn\'t) + V(bare)', '(?) Do/Does + S + V(bare)?'] },
        { p: 'Với **he / she / it** (và danh từ số ít) dùng **does/doesn\'t**, động từ **không** thêm s: **She doesn\'t like fish.** — **Does he play football?**' }
      ] },
      { h: '2. Quy tắc thêm -s / -es', b: [
        { t: { h: ['Trường hợp', 'Cách thêm', 'Ví dụ'], r: [['Hầu hết động từ', '+ s', 'work → works'], ['tận cùng -s, -sh, -ch, -x, -z, -o', '+ es', 'watch → watches, go → goes'], ['phụ âm + y', 'bỏ y + ies', 'study → studies'], ['nguyên âm + y', '+ s', 'play → plays'], ['have', 'has', 'She has a pet.']] } }
      ] },
      { h: '3. Cách dùng & dấu hiệu', b: [
        { ul: ['Thói quen: **I get up at 6 every day.**', 'Sự thật, chân lý: **The sun rises in the east.**', 'Lịch trình: **The film starts at 8.**'] },
        { p: 'Dấu hiệu: **always, usually, often, sometimes, never, every day/week, on Mondays, once a week**.' }
      ] }
    ],
    ex: [['She goes to school by bike.', 'Cô ấy đi học bằng xe đạp.'], ["I don't like fish.", 'Mình không thích cá.'], ['Does he play football? — Yes, he does.', 'Cậu ấy có chơi bóng đá không? — Có.'], ['The sun rises in the east.', 'Mặt trời mọc ở hướng đông.'], ['School starts at 7 a.m.', 'Trường bắt đầu lúc 7 giờ sáng.'], ["They don't watch TV in the morning.", 'Họ không xem TV vào buổi sáng.'], ['My mother cooks dinner every day.', 'Mẹ mình nấu bữa tối mỗi ngày.'], ['What time do you get up?', 'Bạn thức dậy lúc mấy giờ?']],
    mis: [['She go to school.', 'She goes to school.', 'Chủ ngữ she → động từ thêm es.'], ["He doesn't likes pizza.", "He doesn't like pizza.", 'Sau doesn\'t dùng động từ nguyên mẫu.'], ['Does she plays the piano?', 'Does she play the piano?', 'Sau does dùng động từ nguyên mẫu.'], ['I am go to school every day.', 'I go to school every day.', 'Không dùng am + động từ thường ở hiện tại đơn.']],
    quiz: [
      ['He ___ to school every day.', ['go', 'goes', 'going', 'is go'], 1, 'He → go + es = goes.'],
      ['My sister ___ coffee.', ["don't drink", "doesn't drink", "doesn't drinks", "isn't drink"], 1, "She → doesn't + V nguyên mẫu."],
      ['___ your father work in a bank?', ['Do', 'Does', 'Is', 'Are'], 1, 'Your father là số ít → Does.'],
      ['Water ___ at 100°C.', ['boil', 'boils', 'boiling', 'is boil'], 1, 'Sự thật hiển nhiên; water (số ít) → boils.'],
      ['They ___ football on Sundays.', ['plays', 'play', 'playing', 'does play'], 1, 'They → động từ nguyên mẫu.'],
      ['She ___ her homework in the evening.', ['do', 'does', 'dos', 'doing'], 1, 'do → does với she.'],
      ['Lan ___ English very hard.', ['study', 'studys', 'studies', 'studyes'], 2, 'Phụ âm + y → ies: studies.'],
      ['What time ___ the film start?', ['do', 'does', 'is', 'are'], 1, 'The film (số ít) → does.']
    ]
  });

  L('g6-present-continuous', {
    grade: 6, icon: '🏃', title: 'Thì hiện tại tiếp diễn', sub: 'Present Continuous', level: 'Cơ bản',
    summary: 'Diễn tả hành động đang xảy ra ngay lúc nói hoặc trong khoảng thời gian hiện tại.',
    sections: [
      { h: '1. Cấu trúc', b: [
        { f: ['(+) S + am/is/are + V-ing', '(-) S + am/is/are + not + V-ing', '(?) Am/Is/Are + S + V-ing?'] },
        { t: { h: ['Quy tắc thêm -ing', 'Ví dụ'], r: [['Hầu hết động từ: + ing', 'work → working'], ['tận cùng -e (không đọc): bỏ e + ing', 'make → making'], ['1 nguyên âm + 1 phụ âm: gấp đôi phụ âm', 'run → running, sit → sitting'], ['tận cùng -ie: đổi thành -ying', 'lie → lying']] } }
      ] },
      { h: '2. Cách dùng & dấu hiệu', b: [
        { ul: ['Hành động đang diễn ra: **I am reading a book now.**', 'Giai đoạn tạm thời: **She is staying with her aunt this week.**'] },
        { p: 'Dấu hiệu: **now, right now, at the moment, at present, Look!, Listen!, Be quiet!**' },
        { warn: 'Động từ chỉ trạng thái **không** dùng thì tiếp diễn: like, love, hate, want, know, understand, need, have (sở hữu). Nói **I want a drink**, không nói "I am wanting".' }
      ] }
    ],
    ex: [['I am reading a book now.', 'Bây giờ mình đang đọc sách.'], ['Look! It is raining.', 'Nhìn kìa! Trời đang mưa.'], ["They aren't playing football.", 'Họ đang không chơi bóng đá.'], ['What are you doing?', 'Bạn đang làm gì vậy?'], ['She is wearing a red dress.', 'Cô ấy đang mặc một chiếc váy đỏ.'], ['My dad is working in the garden at the moment.', 'Lúc này bố mình đang làm việc trong vườn.'], ['Listen! Someone is singing.', 'Nghe kìa! Có ai đó đang hát.'], ["Is he watching TV? — No, he isn't.", 'Cậu ấy đang xem TV à? — Không.']],
    mis: [['I am read a book.', 'I am reading a book.', 'Sau am/is/are phải dùng V-ing.'], ['She is play the guitar.', 'She is playing the guitar.', 'Thiếu -ing.'], ['He is runing now.', 'He is running now.', 'Gấp đôi phụ âm: run → running.'], ['I am wanting a drink.', 'I want a drink.', 'want là động từ chỉ trạng thái.']],
    quiz: [
      ['Look! The children ___ in the park.', ['play', 'plays', 'are playing', 'is playing'], 2, 'Look! → đang xảy ra; children (số nhiều) → are playing.'],
      ['Be quiet! The baby ___.', ['sleeps', 'is sleeping', 'sleeping', 'are sleeping'], 1, 'Be quiet! → hiện tại tiếp diễn; baby (số ít) → is sleeping.'],
      ['What ___ at the moment?', ['do you do', 'are you doing', 'you are doing', 'does you do'], 1, 'at the moment → are you doing?'],
      ['She ___ TV right now.', ["doesn't watch", "isn't watching", "aren't watching", "don't watching"], 1, "She → isn't watching."],
      ['I ___ to music now.', ['am listening', 'listen', 'is listening', 'listens'], 0, 'I + am + V-ing.'],
      ['He is ___ in the park.', ['run', 'runs', 'running', 'runing'], 2, 'run → running (gấp đôi n).'],
      ['I ___ this song. It is great!', ['am liking', 'like', 'liking', 'am like'], 1, 'like là động từ chỉ trạng thái, không dùng tiếp diễn.'],
      ['___ it raining? — Yes, it is.', ['Do', 'Does', 'Is', 'Are'], 2, 'Is it raining? — it → is.']
    ]
  });

  L('g6-there-is-are', {
    grade: 6, icon: '📍', title: 'There is / There are', sub: 'Nói về sự tồn tại của người, vật', level: 'Cơ bản',
    summary: 'Dùng để nói "có" cái gì ở đâu: there is + số ít/không đếm được, there are + số nhiều.',
    sections: [
      { h: '1. Cấu trúc', b: [
        { f: ['(+) There is + danh từ số ít / không đếm được', '(+) There are + danh từ số nhiều', "(-) There isn't / There aren't (+ any)", '(?) Is there ...? / Are there ...?'] },
        { p: 'Trả lời ngắn: **Yes, there is. / No, there isn\'t.** — **Yes, there are. / No, there aren\'t.**' },
        { p: 'Hỏi số lượng: **How many chairs are there in the room?** — **There are four.**' }
      ] },
      { h: '2. Lưu ý', b: [
        { ul: ['Với nhiều danh từ nối bằng and, động từ hòa hợp với danh từ **đứng gần nhất**: **There is a pen and two books on the desk.**', 'Dùng **some** trong câu khẳng định, **any** trong câu phủ định và câu hỏi: **There aren\'t any eggs.**'] },
        { tip: 'Dùng **there is/are** để nói sự tồn tại ("có"). Dùng **it is** để nói về một vật cụ thể đã biết: **It is a big park.**' }
      ] }
    ],
    ex: [['There is a lamp on the table.', 'Có một cái đèn trên bàn.'], ['There are three bedrooms in my house.', 'Nhà mình có ba phòng ngủ.'], ["There isn't any milk in the fridge.", 'Không có sữa trong tủ lạnh.'], ['Are there any students in the room? — No, there aren\'t.', 'Có học sinh nào trong phòng không? — Không có.'], ['Is there a bank near here? — Yes, there is.', 'Gần đây có ngân hàng không? — Có.'], ['There are some flowers in the vase.', 'Có vài bông hoa trong lọ.'], ['How many people are there in your family?', 'Gia đình bạn có bao nhiêu người?'], ['There is some water in the bottle.', 'Có một ít nước trong chai.']],
    mis: [['There is two cats in the garden.', 'There are two cats in the garden.', 'two cats là số nhiều → are.'], ['It has a park near my house.', 'There is a park near my house.', '"Có" (tồn tại) dùng there is, không dùng it has.'], ['Have there a library in your town?', 'Is there a library in your town?', 'Câu hỏi: Is/Are there ...?'], ['There are some milk in the glass.', 'There is some milk in the glass.', 'milk là danh từ không đếm được → is.']],
    quiz: [
      ['There ___ a swimming pool in our school.', ['are', 'is', 'am', 'have'], 1, 'a swimming pool là số ít → is.'],
      ['There ___ many trees in the park.', ['is', 'are', 'has', 'have'], 1, 'many trees là số nhiều → are.'],
      ['___ there a cinema near your house?', ['Are', 'Do', 'Is', 'Does'], 2, 'a cinema là số ít → Is there ...?'],
      ["There aren't ___ chairs in the room.", ['some', 'any', 'a', 'an'], 1, 'Câu phủ định dùng any.'],
      ['There ___ some juice in the fridge.', ['are', 'is', 'am', 'be'], 1, 'juice không đếm được → is.'],
      ['How many bedrooms ___ there in your flat?', ['is', 'are', 'do', 'does'], 1, 'How many + danh từ số nhiều + are there?'],
      ['There ___ a book and two pens on the desk.', ['is', 'are', 'have', 'has'], 0, 'Có nhiều danh từ, động từ hòa hợp với danh từ đứng gần nhất: "a book" (số ít) → is.'],
      ['Are there any eggs? — No, ___.', ["there isn't", "there aren't", "it isn't", "they aren't"], 1, 'eggs số nhiều → No, there aren\'t.']
    ]
  });

  L('g6-articles-plurals', {
    grade: 6, icon: '📦', title: 'Mạo từ a/an/the & danh từ số nhiều', sub: 'Articles & Plural nouns', level: 'Cơ bản',
    summary: 'Biết khi nào dùng a, an, the hoặc không dùng mạo từ; cách tạo danh từ số nhiều.',
    sections: [
      { h: '1. Mạo từ', b: [
        { ul: ['**a** + danh từ số ít đếm được bắt đầu bằng **âm phụ âm**: a book, a university (/ju:/)', '**an** + danh từ số ít đếm được bắt đầu bằng **âm nguyên âm**: an apple, an hour (h câm)', '**the** + danh từ đã xác định / duy nhất / so sánh nhất: the sun, the best student', 'Không dùng mạo từ với danh từ số nhiều hoặc không đếm được nói chung, bữa ăn, môn thể thao, ngôn ngữ: **I play football. We have lunch at 11.**'] },
        { tip: 'Chú ý **âm** chứ không phải **chữ cái**: **an hour** (/aʊə/), **a university** (/ju:/), **an MP3 player**.' }
      ] },
      { h: '2. Danh từ số nhiều', b: [
        { t: { h: ['Quy tắc', 'Ví dụ'], r: [['Thêm s', 'book → books'], ['tận cùng -s, -x, -ch, -sh, -o: thêm es', 'bus → buses, box → boxes, tomato → tomatoes'], ['phụ âm + y: ies', 'city → cities'], ['-f/-fe → -ves', 'leaf → leaves, knife → knives'], ['bất quy tắc', 'man → men, woman → women, child → children, foot → feet, tooth → teeth, mouse → mice, person → people'], ['giữ nguyên', 'sheep, fish']] } }
      ] }
    ],
    ex: [['She has an umbrella.', 'Cô ấy có một cái ô.'], ['My father is an engineer.', 'Bố mình là kỹ sư.'], ['The moon goes around the Earth.', 'Mặt trăng quay quanh Trái Đất.'], ['We play chess after school.', 'Chúng mình chơi cờ sau giờ học.'], ['There are three children in the room.', 'Có ba đứa trẻ trong phòng.'], ['I need two knives and some tomatoes.', 'Mình cần hai con dao và vài quả cà chua.'], ['Mai is the best student in my class.', 'Mai là học sinh giỏi nhất lớp mình.'], ['He works in a hospital.', 'Anh ấy làm việc trong một bệnh viện.']],
    mis: [['I have an university degree.', 'I have a university degree.', 'university bắt đầu bằng âm /j/ → a.'], ['She waits for a hour.', 'She waits for an hour.', 'hour bắt đầu bằng âm /aʊ/ → an.'], ['There are five childs.', 'There are five children.', 'child → children (bất quy tắc).'], ['I play the football.', 'I play football.', 'Môn thể thao không dùng the.']],
    quiz: [
      ['She has ___ umbrella.', ['a', 'an', 'the', '(không cần mạo từ)'], 1, 'umbrella bắt đầu bằng nguyên âm → an.'],
      ['He is ___ honest boy.', ['a', 'an', 'the', '(không cần mạo từ)'], 1, 'honest có h câm, đọc /ˈɒnɪst/ → an.'],
      ['I have two ___.', ['child', 'childs', 'children', 'childrens'], 2, 'child → children.'],
      ['My father works in ___ hospital.', ['a', 'an', 'the', '(không cần mạo từ)'], 0, 'hospital bắt đầu bằng phụ âm → a.'],
      ['___ moon goes around the Earth.', ['A', 'An', 'The', '(không cần mạo từ)'], 2, 'Mặt trăng là duy nhất → the.'],
      ['We play ___ chess after school.', ['a', 'an', 'the', '(không cần mạo từ)'], 3, 'Môn chơi/thể thao không dùng mạo từ.'],
      ['There are three ___ in the box.', ['knifes', 'knives', 'knife', 'knifs'], 1, '-fe → -ves: knives.'],
      ['Mai is ___ best student in my class.', ['a', 'an', 'the', '(không cần mạo từ)'], 2, 'So sánh nhất → the best.']
    ]
  });

  L('g6-possessives', {
    grade: 6, icon: '🎒', title: 'Sở hữu: tính từ sở hữu & \'s', sub: 'my, your, his... / Tom\'s / mine, yours', level: 'Cơ bản',
    summary: 'Cách nói "của ai" với tính từ sở hữu, sở hữu cách \'s và đại từ sở hữu.',
    sections: [
      { h: '1. Tính từ sở hữu và đại từ sở hữu', b: [
        { t: { h: ['Chủ ngữ', 'Tính từ sở hữu (+ danh từ)', 'Đại từ sở hữu (đứng một mình)'], r: [['I', 'my', 'mine'], ['you', 'your', 'yours'], ['he', 'his', 'his'], ['she', 'her', 'hers'], ['it', 'its', '—'], ['we', 'our', 'ours'], ['they', 'their', 'theirs']] } },
        { p: '**This is my book.** → **This book is mine.**' }
      ] },
      { h: '2. Sở hữu cách \'s', b: [
        { ul: ['Danh từ số ít + **\'s**: **Tom\'s bike**', 'Danh từ số nhiều tận cùng -s + **\'**: **the students\' room**', 'Danh từ số nhiều bất quy tắc + **\'s**: **the children\'s toys**'] },
        { warn: '**its** (của nó) khác **it\'s** (= it is / it has). Không có dấu \' trong its, hers, yours, ours, theirs.' }
      ] }
    ],
    ex: [['This is Lan. Her house is big.', 'Đây là Lan. Nhà của bạn ấy rộng.'], ['The cat is licking its paws.', 'Con mèo đang liếm chân của nó.'], ["That is Tom's bike.", 'Đó là xe đạp của Tom.'], ["These are the children's toys.", 'Đây là đồ chơi của bọn trẻ.'], ['This pen is mine, not yours.', 'Cây bút này của mình, không phải của bạn.'], ['Our teacher is very kind.', 'Cô giáo của chúng mình rất tốt bụng.'], ["The students' classroom is on the second floor.", 'Phòng học của các học sinh ở tầng hai.'], ['Is this bag hers?', 'Cái cặp này là của cô ấy phải không?']],
    mis: [["Her's book is on the table.", 'Her book is on the table. / The book is hers.', 'Không có dấu \' trong hers.'], ['The girl book is new.', "The girl's book is new.", 'Sở hữu của danh từ số ít: thêm \'s.'], ["The dog wags it's tail.", 'The dog wags its tail.', "it's = it is; sở hữu là its."], ['This is mine book.', 'This is my book.', 'Trước danh từ dùng tính từ sở hữu my, không dùng mine.']],
    quiz: [
      ['This is Lan. ___ house is big.', ['His', 'Her', 'She', 'Hers'], 1, 'Lan là nữ → her (tính từ sở hữu trước danh từ).'],
      ['The cat is licking ___ paws.', ["it's", 'its', 'his', 'their'], 1, 'its = của nó (không có dấu phẩy trên).'],
      ['These toys belong to the children. They are the ___ toys.', ["children's", "childrens'", "childrens", "child's"], 0, 'children là số nhiều bất quy tắc → children\'s.'],
      ['That book isn\'t ___. It is Tom\'s.', ['my', 'mine', 'me', "mine's"], 1, 'Đứng một mình, không có danh từ theo sau → đại từ sở hữu mine.'],
      ['Five boys have bags. These are the ___ bags.', ["boy's", "boys'", "boys's", "boys"], 1, 'boys số nhiều tận cùng -s → thêm dấu \' : boys\'.'],
      ['We love ___ school.', ['we', 'our', 'ours', "we're"], 1, 'Trước danh từ school dùng tính từ sở hữu our.'],
      ['Is this pencil ___? — No, it is hers.', ['you', 'your', 'yours', "you're"], 2, 'Không có danh từ theo sau → yours.'],
      ['Whose bike is that? — It is ___.', ['Tom', "Tom's", 'Toms', 'Tom is'], 1, "Sở hữu của danh từ số ít: Tom's (= Tom's bike)."]
    ]
  });

  L('g6-prepositions', {
    grade: 6, icon: '🧭', title: 'Giới từ chỉ nơi chốn & thời gian', sub: 'in / on / at và các giới từ vị trí', level: 'Cơ bản',
    summary: 'Phân biệt in, on, at trong thời gian và nơi chốn; các giới từ vị trí thường gặp.',
    sections: [
      { h: '1. In / On / At chỉ thời gian', b: [
        { t: { h: ['Giới từ', 'Dùng với', 'Ví dụ'], r: [['in', 'tháng, năm, mùa, buổi trong ngày (morning/afternoon/evening)', 'in May, in 2024, in summer, in the morning'], ['on', 'thứ, ngày tháng, ngày cụ thể', 'on Monday, on 5th May, on Monday morning'], ['at', 'giờ giấc, thời điểm', 'at 7 o\'clock, at noon, at night, at the weekend']] } },
        { tip: '**in the morning/afternoon/evening** nhưng **at night**. **On Monday morning** (có thứ) thì dùng on.' }
      ] },
      { h: '2. In / On / At chỉ nơi chốn', b: [
        { ul: ['**in**: bên trong, thành phố, quốc gia: in the box, in Hanoi, in Vietnam', '**on**: trên bề mặt, tầng: on the table, on the wall, on the second floor', '**at**: một điểm, địa điểm cụ thể/địa chỉ có số nhà: at school, at the bus stop, at 25 Nguyen Trai Street'] },
        { p: 'Giới từ vị trí khác: **next to** (bên cạnh), **between** (ở giữa hai), **in front of** (phía trước), **behind** (phía sau), **opposite** (đối diện), **under** (bên dưới), **above** (phía trên), **near** (gần).' }
      ] }
    ],
    ex: [['I get up at 6 o\'clock.', 'Mình thức dậy lúc 6 giờ.'], ['My birthday is on 5th May.', 'Sinh nhật mình vào ngày 5 tháng 5.'], ['It is very hot in summer.', 'Mùa hè rất nóng.'], ['The book is on the table.', 'Quyển sách ở trên bàn.'], ['She lives in Da Nang.', 'Cô ấy sống ở Đà Nẵng.'], ['Meet me at the bus stop.', 'Gặp mình ở trạm xe buýt nhé.'], ['The bank is opposite the post office.', 'Ngân hàng đối diện bưu điện.'], ['The cat is between the sofa and the table.', 'Con mèo ở giữa ghế sofa và cái bàn.']],
    mis: [['I study on the morning.', 'I study in the morning.', 'Buổi trong ngày dùng in.'], ['She was born in Monday.', 'She was born on Monday.', 'Thứ trong tuần dùng on.'], ['I get up in 6 o\'clock.', "I get up at 6 o'clock.", 'Giờ giấc dùng at.'], ['He lives in 25 Le Loi Street.', 'He lives at 25 Le Loi Street.', 'Địa chỉ có số nhà dùng at.'], ['I sleep on night.', 'I sleep at night.', 'at night là cụm cố định.']],
    quiz: [
      ['We have English ___ Monday.', ['in', 'on', 'at', 'to'], 1, 'Thứ trong tuần dùng on.'],
      ['The film starts ___ 7.30.', ['in', 'on', 'at', 'by'], 2, 'Giờ giấc dùng at.'],
      ['My birthday is ___ June.', ['in', 'on', 'at', 'of'], 0, 'Tháng dùng in.'],
      ['The picture is ___ the wall.', ['in', 'on', 'at', 'under'], 1, 'Trên bề mặt (tường) dùng on.'],
      ['She gets up early ___ the morning.', ['at', 'on', 'in', 'to'], 2, 'in the morning.'],
      ['Wait for me ___ the school gate.', ['at', 'on', 'in', 'to'], 0, 'Một điểm cụ thể → at.'],
      ['The bank is ___ the post office and the café. (ở giữa)', ['between', 'behind', 'above', 'opposite'], 0, 'between A and B = ở giữa A và B.'],
      ['I often go to bed late ___ night.', ['in', 'on', 'at', 'by'], 2, 'at night.']
    ]
  });

  L('g6-wh-questions', {
    grade: 6, icon: '❓', title: 'Câu hỏi với Wh- và How', sub: 'What, Where, When, Why, Who, How...', level: 'Cơ bản',
    summary: 'Cách đặt câu hỏi với từ để hỏi và trật tự từ đúng.',
    sections: [
      { h: '1. Trật tự câu hỏi', b: [
        { f: ['Wh-word + trợ động từ (do/does/did, am/is/are...) + S + V ...?', 'Câu hỏi về chủ ngữ: Wh-word (làm chủ ngữ) + V ...?'] },
        { t: { h: ['Từ để hỏi', 'Hỏi về', 'Ví dụ'], r: [['What', 'cái gì', 'What is your name?'], ['Who', 'ai', 'Who is your teacher?'], ['Where', 'ở đâu', 'Where do you live?'], ['When / What time', 'khi nào / mấy giờ', 'What time do you get up?'], ['Why', 'tại sao (trả lời: Because...)', 'Why are you late?'], ['Which', 'cái nào (có lựa chọn)', 'Which colour do you like?'], ['Whose', 'của ai', 'Whose bag is this?'], ['How', 'như thế nào', 'How do you go to school?']] } }
      ] },
      { h: '2. How + tính từ/trạng từ', b: [
        { ul: ['**How old** (bao nhiêu tuổi), **How tall** (cao bao nhiêu)', '**How many** + danh từ đếm được số nhiều; **How much** + danh từ không đếm được / giá tiền', '**How often** (bao lâu một lần), **How long** (bao lâu), **How far** (bao xa)'] },
        { tip: 'Câu hỏi về chủ ngữ **không** cần do/does: **Who lives here?** (không phải "Who does live here?").' }
      ] }
    ],
    ex: [['What is your name?', 'Tên bạn là gì?'], ['Where do you live?', 'Bạn sống ở đâu?'], ['Why are you late? — Because I missed the bus.', 'Sao bạn đến muộn? — Vì mình lỡ xe buýt.'], ['How often do you play sport?', 'Bạn chơi thể thao bao lâu một lần?'], ['Who lives next door?', 'Ai sống ở nhà bên cạnh?'], ['Whose bag is this?', 'Cái cặp này của ai?'], ['How much is this shirt?', 'Cái áo này giá bao nhiêu?'], ['How many students are there in your class?', 'Lớp bạn có bao nhiêu học sinh?']],
    mis: [['Where you live?', 'Where do you live?', 'Thiếu trợ động từ do.'], ['How many water do you drink?', 'How much water do you drink?', 'water không đếm được → How much.'], ['Who does live here?', 'Who lives here?', 'Hỏi về chủ ngữ không dùng does.'], ['What do you doing?', 'What are you doing?', 'Hiện tại tiếp diễn dùng are + V-ing.']],
    quiz: [
      ['___ do you live? — In Hue.', ['What', 'Where', 'Who', 'When'], 1, 'Trả lời về nơi chốn → Where.'],
      ['___ is your birthday? — On 5th May.', ['Where', 'Who', 'When', 'Why'], 2, 'Hỏi thời gian → When.'],
      ['___ are you crying? — Because I am sad.', ['Who', 'Why', 'What', 'How'], 1, 'Trả lời bằng Because → Why.'],
      ['___ is that man? — He is my uncle.', ['Where', 'Whose', 'Who', 'How'], 2, 'Hỏi người → Who.'],
      ['How ___ sugar do you want?', ['many', 'much', 'often', 'long'], 1, 'sugar không đếm được → much.'],
      ['___ bag is this? — It is Lan\'s.', ['Who', 'Whose', 'What', 'Which'], 1, 'Hỏi sở hữu → Whose.'],
      ['___ do you go swimming? — Twice a week.', ['How long', 'How far', 'How often', 'How old'], 2, 'twice a week trả lời cho tần suất → How often.'],
      ['___ lives in this house?', ['Who', 'Who does', 'Whom does', 'Where'], 0, 'Câu hỏi về chủ ngữ: Who + V(s).']
    ]
  });
})();
