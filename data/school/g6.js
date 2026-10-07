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
      ['There ___ no students in the classroom.', ['is', 'are', 'has', 'have'], 1, 'students là danh từ số nhiều → There are no students.'],
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

  L('g6-demonstratives-pronouns', {
    grade: 6, icon: '👆', title: 'This / That / These / Those và đại từ nhân xưng', sub: 'Demonstratives & Personal pronouns', level: 'Cơ bản',
    summary: 'Chỉ người/vật ở gần – xa, số ít – số nhiều; dùng đúng đại từ chủ ngữ (I, you, he…) và tân ngữ (me, you, him…).',
    sections: [
      { h: '1. This, that, these, those', b: [
        { t: { h: ['', 'Gần người nói', 'Xa người nói'], r: [['Số ít', '**this** (cái này)', '**that** (cái kia)'], ['Số nhiều', '**these** (những cái này)', '**those** (những cái kia)']] } },
        { f: ['This/That + is/\'s + danh từ số ít: **This is my book.**', 'These/Those + are + danh từ số nhiều: **Those are my shoes.**'] },
        { p: 'Khi hỏi: **What\'s this/that?** — It\'s a … ; **What are these/those?** — They\'re … . Hỏi người: **Who\'s that?** — That\'s my teacher.' },
        { tip: 'Khi nghe điện thoại, người Anh nói **This is Mai** (tôi là Mai) và hỏi **Who is that?** (ai đấy?) — không dùng "I am Mai" nếu muốn lịch sự trong cuộc gọi.' }
      ] },
      { h: '2. Đại từ nhân xưng: chủ ngữ và tân ngữ', b: [
        { t: { h: ['Chủ ngữ (đứng trước động từ)', 'Tân ngữ (đứng sau động từ/giới từ)', 'Nghĩa'], r: [['I', 'me', 'tôi'], ['you', 'you', 'bạn / các bạn'], ['he', 'him', 'anh ấy'], ['she', 'her', 'cô ấy'], ['it', 'it', 'nó'], ['we', 'us', 'chúng tôi/ta'], ['they', 'them', 'họ / chúng nó']] } },
        { p: 'Chủ ngữ: **She** likes music. Tân ngữ: I like **her**. — Sau giới từ cũng dùng tân ngữ: Listen to **me**. Come with **us**.' },
        { warn: 'Không nói "Her likes music" hay "I like she". Chủ ngữ → I/he/she…, tân ngữ → me/him/her…' }
      ] },
      { h: '3. Dùng đại từ để tránh lặp từ', b: [
        { p: 'Thay danh từ đã nhắc: **Mai** is my friend. **She** is kind. I often help **her**.' },
        { ul: ['Chỉ **it** cho đồ vật, con vật, sự việc: I have a cat. **It** is cute.', 'Nhiều người/vật: **they/them**: My parents are teachers. I love **them**.', 'Gộp mình và người khác: **we/us**: Tom and I → **we**; Tom and me → hỏi **us**.'] }
      ] }
    ],
    ex: [
      ['This is my classroom.', 'Đây là lớp học của mình.'], ['That is our teacher over there.', 'Kia là giáo viên của chúng mình.'], ['These are my new notebooks.', 'Đây là những quyển vở mới của mình.'],
      ['Those boys are my classmates.', 'Mấy cậu bé kia là bạn cùng lớp của mình.'], ['What\'s that? — It\'s a rabbit.', 'Kia là gì? — Là một con thỏ.'], ['Who are those girls? — They are my cousins.', 'Mấy bạn gái kia là ai? — Họ là chị em họ của mình.'],
      ['He is my brother. I love him very much.', 'Anh ấy là anh trai mình. Mình rất yêu anh ấy.'], ['Please help us with this exercise.', 'Làm ơn giúp chúng em bài tập này.'], ['Mai lives near me, and I walk to school with her.', 'Mai sống gần mình và mình đi bộ đến trường cùng bạn ấy.']
    ],
    mis: [
      ['This are my friends.', 'These are my friends.', 'friends là số nhiều → these/those.'], ['That boys are tall.', 'Those boys are tall.', 'boys số nhiều → those.'],
      ['I like she very much.', 'I like her very much.', 'Sau động từ dùng tân ngữ her.'], ['Him is my brother.', 'He is my brother.', 'Làm chủ ngữ dùng he, không dùng him.'], ['Listen to I, please.', 'Listen to me, please.', 'Sau giới từ to dùng tân ngữ me.']
    ],
    quiz: [
      ['___ is my pen, and those are my pencils.', ['These', 'This', 'Those', 'They'], 1, 'my pen số ít, ở gần → This.'],
      ['Look at ___ birds in the tree over there!', ['this', 'that', 'those', 'it'], 2, 'birds số nhiều, ở xa → those.'],
      ['My sister is shy, so I talk to ___ slowly.', ['she', 'her', 'hers', 'him'], 1, 'Sau giới từ to dùng tân ngữ her.'],
      ['___ are my parents. Do you know them?', ['That', 'This', 'They', 'These'], 3, 'parents số nhiều, gần → These are…'],
      ['Tom and I are friends. ___ study in the same class.', ['We', 'Us', 'They', 'Our'], 0, 'Tom and I = chúng tôi, làm chủ ngữ → We.'],
      ['"What\'s ___?" "It\'s a dictionary." (vật ở xa, số ít)', ['this', 'that', 'these', 'those'], 1, 'Vật số ít ở xa → that.'],
      ['I have two dogs. I take ___ for a walk every morning.', ['it', 'they', 'them', 'their'], 2, 'two dogs → them (tân ngữ số nhiều).'],
      ['Is ___ your bag over there?', ['this', 'that', 'these', 'they'], 1, 'Một cái túi ở xa → that.'],
      ['My brother is eight. ___ plays football every day.', ['Him', 'He', 'His', 'Her'], 1, 'Chủ ngữ nam số ít → He.'],
      ['These are Anna and Ben. I know ___ well.', ['they', 'them', 'their', 'she'], 1, 'know + tân ngữ → them.']
    ]
  });

  L('g6-imperatives-suggestions', {
    grade: 6, icon: '📣', title: 'Câu mệnh lệnh và lời đề nghị', sub: 'Imperatives & Suggestions', level: 'Cơ bản',
    summary: 'Ra lệnh, nhắc nhở, hướng dẫn (Open the door!) và rủ rê, gợi ý (Let\'s…, Why don\'t we…, How about…?).',
    sections: [
      { h: '1. Câu mệnh lệnh (Imperatives)', b: [
        { f: ['(+) V (nguyên mẫu) + …: **Open** your books.', '(−) **Don\'t** + V + …: **Don\'t talk** in class.', 'Lịch sự: **Please** + V / V + **please**: **Please sit down.**'] },
        { p: 'Câu mệnh lệnh **không có chủ ngữ** (người nghe là "you"). Dùng cho nội quy, chỉ đường, công thức, biển báo: **Turn left. Don\'t run in the corridor. Add some salt.**' },
        { tip: 'Muốn nói nhẹ nhàng, thêm **please** hoặc dùng "Could you…?" ở các lớp trên. Không bao giờ thêm "to": ✗ To open the door.' }
      ] },
      { h: '2. Rủ rê và gợi ý', b: [
        { t: { h: ['Mẫu câu', 'Theo sau', 'Ví dụ'], r: [['**Let\'s** (= Let us)', 'V nguyên mẫu', 'Let\'s play badminton.'], ['**Why don\'t we** …?', 'V nguyên mẫu', 'Why don\'t we go swimming?'], ['**How about** …? / **What about** …?', 'V-ing hoặc danh từ', 'How about going to the zoo?'], ['**Shall we** …?', 'V nguyên mẫu', 'Shall we meet at 7?'], ['**Would you like to** …?', 'to + V', 'Would you like to join us?']] } },
        { p: 'Đồng ý: **Good idea! / Great! / OK, let\'s do it.** Từ chối nhẹ: **Sorry, I can\'t. I have to do my homework.** / **I\'d love to, but…**' }
      ] },
      { h: '3. Phân biệt nhanh', b: [
        { ul: ['**Let\'s + V** (rủ cả mình và người nghe): Let\'s go!', '**Let me + V** (để tôi làm): Let me help you.', '**How about + V-ing** (không dùng to V): How about **playing** chess?', 'Phủ định của Let\'s: **Let\'s not** talk about it.'] }
      ] }
    ],
    ex: [
      ['Close the window, please.', 'Làm ơn đóng cửa sổ lại.'], ['Don\'t be late for school.', 'Đừng đi học muộn.'], ['Listen and repeat after me.', 'Hãy nghe và lặp lại theo cô/thầy.'],
      ['Let\'s have lunch at the school canteen.', 'Chúng mình ăn trưa ở căng-tin trường nhé.'], ['Why don\'t we visit Grandma this weekend?', 'Sao chúng mình không thăm bà vào cuối tuần này nhỉ?'],
      ['How about watching a film tonight?', 'Tối nay xem phim thì sao nhỉ?'], ['Shall we start now? — Yes, let\'s.', 'Chúng ta bắt đầu nhé? — Ừ, bắt đầu thôi.'], ['Don\'t touch the paintings.', 'Không được chạm vào các bức tranh.'],
      ['Turn right at the corner, then go straight.', 'Rẽ phải ở góc phố rồi đi thẳng.']
    ],
    mis: [
      ['To open your book.', 'Open your book.', 'Câu mệnh lệnh dùng V nguyên mẫu, không có to.'], ['Not run in the corridor.', 'Don\'t run in the corridor.', 'Phủ định mệnh lệnh = Don\'t + V.'],
      ['Let\'s going to the park.', 'Let\'s go to the park.', 'Sau Let\'s dùng V nguyên mẫu.'], ['How about to play chess?', 'How about playing chess?', 'Sau How about dùng V-ing.'], ['Why we don\'t go swimming?', 'Why don\'t we go swimming?', 'Trật tự: Why don\'t we + V?']
    ],
    quiz: [
      ['___ talk in the library. It\'s quiet here.', ['Not', 'Don\'t', 'Doesn\'t', 'No'], 1, 'Câu cấm đoán: Don\'t + V.'],
      ['Let\'s ___ to the cinema tonight.', ['going', 'to go', 'go', 'goes'], 2, 'Let\'s + V nguyên mẫu.'],
      ['How about ___ a picnic on Sunday?', ['have', 'having', 'to have', 'has'], 1, 'How about + V-ing.'],
      ['"Why don\'t we play table tennis?" — "___"', ['Yes, I don\'t.', 'Good idea!', 'No, we aren\'t.', 'I play it.'], 1, 'Trả lời lời rủ: Good idea!'],
      ['___ your hands before meals, please.', ['Washing', 'To wash', 'Wash', 'Washes'], 2, 'Mệnh lệnh khẳng định = V nguyên mẫu.'],
      ['Shall we ___ at the bus stop at 7?', ['meeting', 'meet', 'to meet', 'meets'], 1, 'Shall we + V nguyên mẫu.'],
      ['Don\'t ___ the grass! (Cấm giẫm lên cỏ)', ['walk on', 'walking on', 'to walk on', 'walks on'], 0, 'Don\'t + V nguyên mẫu (walk on).'],
      ['Which sentence is an invitation?', ['Sit down.', 'Don\'t shout.', 'Would you like to come to my party?', 'Open the door.'], 2, 'Would you like to… dùng để mời.'],
      ['"What about ___ ice cream?" (Ăn kem thì sao?)', ['eat', 'eating', 'ate', 'eats'], 1, 'What about + V-ing.']
    ]
  });

  L('g6-conjunctions-basic', {
    grade: 6, icon: '🔗', title: 'Liên từ cơ bản: and, but, so, because, or', sub: 'Basic Conjunctions', level: 'Cơ bản',
    summary: 'Nối từ và nối câu để nói ý dài hơn: thêm ý (and), đối lập (but), kết quả (so), lý do (because), lựa chọn (or).',
    sections: [
      { h: '1. Năm liên từ thường dùng', b: [
        { t: { h: ['Liên từ', 'Ý nghĩa', 'Ví dụ'], r: [['**and**', 'và, thêm ý', 'I like tea **and** coffee.'], ['**but**', 'nhưng (đối lập)', 'He is small **but** strong.'], ['**or**', 'hoặc (lựa chọn)', 'Do you want milk **or** juice?'], ['**so**', 'vì vậy (kết quả)', 'It was cold, **so** I wore a coat.'], ['**because**', 'bởi vì (lý do)', 'I wore a coat **because** it was cold.']] } }
      ] },
      { h: '2. Nối hai câu hoàn chỉnh', b: [
        { f: ['Câu 1 **, and / but / so / or** + câu 2 (có dấu phẩy khi mỗi vế có chủ ngữ riêng)', 'Câu chính + **because** + lý do (thường không có dấu phẩy)'] },
        { p: '**I was tired, so I went to bed early.** (kết quả đứng sau so) = **I went to bed early because I was tired.** (lý do đứng sau because)' },
        { warn: '**so** và **because** đối nghịch vị trí: so + KẾT QUẢ, because + LÝ DO. Không dùng cả hai trong cùng một câu: ✗ Because it rained, so we stayed home.' }
      ] },
      { h: '3. Mẹo dùng đúng', b: [
        { ul: ['Có thể bắt đầu câu bằng **Because**, nhưng khi đó phải có dấu phẩy: **Because it rained, we stayed home.**', 'Nối nhiều từ: A, B **and** C (and đứng trước từ cuối): I have a pen, a ruler **and** an eraser.', '**but** ≠ **and**: and cùng hướng ý, but ngược hướng ý.', 'Trả lời câu hỏi **Why…?** bắt đầu bằng **Because…**: Why are you happy? — Because it\'s my birthday.'] }
      ] }
    ],
    ex: [
      ['I have a brother and a sister.', 'Mình có một anh trai và một chị gái.'], ['She likes cats, but she doesn\'t like dogs.', 'Cô ấy thích mèo nhưng không thích chó.'], ['Would you like to walk or take a bus?', 'Bạn muốn đi bộ hay đi xe buýt?'],
      ['It was raining, so we stayed at home.', 'Trời mưa nên chúng mình ở nhà.'], ['I love summer because I can swim every day.', 'Mình yêu mùa hè vì mình có thể bơi mỗi ngày.'], ['Why are you late? — Because I missed the bus.', 'Sao bạn đến muộn? — Vì mình lỡ chuyến xe buýt.'],
      ['The film was long, but it was interesting.', 'Bộ phim dài nhưng thú vị.'], ['He is hungry, so he is making a sandwich.', 'Cậu ấy đói nên đang làm bánh mì kẹp.'], ['Because it is late, we must go home.', 'Vì muộn rồi nên chúng ta phải về nhà.']
    ],
    mis: [
      ['Because I was ill, so I stayed in bed.', 'Because I was ill, I stayed in bed. (hoặc: I was ill, so I stayed in bed.)', 'Không dùng because và so cùng lúc.'],
      ['I like tea but coffee.', 'I like tea and coffee.', 'Thêm ý cùng hướng → and.'], ['I was hungry because I ate a big lunch.', 'I was hungry, so I ate a big lunch.', 'Ăn là kết quả của đói → so.'],
      ['Do you want rice and noodles? (hỏi chọn một)', 'Do you want rice or noodles?', 'Lựa chọn → or.']
    ],
    quiz: [
      ['I was very tired, ___ I went to bed early.', ['because', 'but', 'so', 'or'], 2, 'Đi ngủ sớm là kết quả → so.'],
      ['She doesn\'t go out ___ it is raining.', ['so', 'because', 'but', 'and'], 1, 'Nêu lý do → because.'],
      ['I like pizza, ___ my sister doesn\'t.', ['so', 'because', 'but', 'or'], 2, 'Hai ý trái ngược → but.'],
      ['Would you like tea ___ coffee?', ['and', 'but', 'so', 'or'], 3, 'Lựa chọn → or.'],
      ['We bought some apples ___ oranges.', ['and', 'but', 'so', 'because'], 0, 'Thêm ý → and.'],
      ['It was sunny, ___ we went to the beach.', ['because', 'so', 'but', 'or'], 1, 'Kết quả → so.'],
      ['He passed the test ___ he studied hard.', ['so', 'but', 'because', 'or'], 2, 'Lý do của việc đỗ → because.'],
      ['The bag is old, ___ it is still useful.', ['so', 'but', 'because', 'or'], 1, 'Cũ nhưng vẫn hữu ích → but.'],
      ['Which sentence is correct?', ['Because it was cold, so I wore a coat.', 'Because it was cold, I wore a coat.', 'It was cold because, I wore a coat.', 'Because it was cold but I wore a coat.'], 1, 'Chỉ dùng một liên từ: Because…, + mệnh đề chính.']
    ]
  });

  L('g6-like-would-like', {
    grade: 6, icon: '❤️', title: 'Nói về sở thích: like / love / hate + V-ing và would like', sub: 'Likes, dislikes & Would like', level: 'Cơ bản',
    summary: 'Nói điều mình thích/không thích (like, love, enjoy, hate + V-ing) và đề nghị/yêu cầu lịch sự (would like).',
    sections: [
      { h: '1. Like / love / enjoy / hate + V-ing', b: [
        { f: ['S + like / love / enjoy / hate / don\'t mind + **V-ing**', 'Ví dụ: I **love** playing football. She **hates** getting up early.'] },
        { t: { h: ['Mức độ', 'Động từ', 'Ví dụ'], r: [['Rất thích', 'love, enjoy, be fond of', 'I **love** swimming.'], ['Thích', 'like', 'He **likes** reading comics.'], ['Không ngại', 'don\'t mind', 'I **don\'t mind** cooking.'], ['Không thích', 'don\'t like', 'We **don\'t like** waiting.'], ['Ghét', 'hate', 'She **hates** doing housework.']] } },
        { tip: 'Thì hiện tại đơn: he/she/it → **likes / loves / hates**; câu hỏi: **Do you like dancing?** — Yes, I do. / No, I don\'t.' }
      ] },
      { h: '2. Would like — lời mời, lời đề nghị lịch sự', b: [
        { f: ['I **would like** (I\'d like) + **to V** / + danh từ', 'Would you like + **to V** / + danh từ**?**'] },
        { p: '**I\'d like a glass of water.** (Tôi muốn một cốc nước — lịch sự) · **Would you like to come to my party?** (Bạn có muốn đến dự tiệc không?) · Trả lời: **Yes, please. / No, thanks.** / **Yes, I\'d love to.**' },
        { warn: '**would like** luôn đi với **to V** (không dùng V-ing) và **không thêm s** cho he/she: ✗ She would likes. ✓ She would like to go.' }
      ] },
      { h: '3. Phân biệt like và would like', b: [
        { t: { h: ['', 'like', 'would like'], r: [['Nghĩa', 'sở thích nói chung', 'mong muốn/lời mời ở hiện tại'], ['Theo sau', 'V-ing / danh từ', 'to V / danh từ'], ['Ví dụ', 'I like tea. (Mình hay thích trà.)', 'I\'d like some tea. (Cho mình xin trà.)'], ['Câu hỏi', 'Do you like tea?', 'Would you like some tea?']] } }
      ] }
    ],
    ex: [
      ['I like listening to music in my free time.', 'Mình thích nghe nhạc lúc rảnh.'], ['My brother loves playing video games.', 'Em/anh mình rất thích chơi điện tử.'], ['She doesn\'t like getting up early.', 'Cô ấy không thích dậy sớm.'],
      ['Do you enjoy cooking? — Yes, I do.', 'Bạn có thích nấu ăn không? — Có.'], ['I don\'t mind walking to school.', 'Mình không ngại đi bộ đến trường.'], ['I\'d like a cup of tea, please.', 'Làm ơn cho mình một tách trà.'],
      ['Would you like to join our club?', 'Bạn có muốn tham gia câu lạc bộ của bọn mình không?'], ['What would you like to drink? — I\'d like orange juice.', 'Bạn muốn uống gì? — Cho mình nước cam.'], ['He hates doing homework at night.', 'Cậu ấy ghét làm bài tập vào buổi tối.']
    ],
    mis: [
      ['I like to playing chess.', 'I like playing chess. (hoặc I like to play chess.)', 'Không kết hợp to + V-ing.'], ['She would likes an ice cream.', 'She would like an ice cream.', 'would like không thêm s.'], ['Would you like going out?', 'Would you like to go out?', 'would like + to V.'],
      ['He don\'t like swimming.', 'He doesn\'t like swimming.', 'he → doesn\'t.']
    ],
    quiz: [
      ['My sister loves ___ pictures.', ['draw', 'drawing', 'to drawing', 'draws'], 1, 'love + V-ing.'],
      ['Would you like ___ some more rice?', ['have', 'having', 'to have', 'has'], 2, 'would like + to V.'],
      ['He doesn\'t ___ washing the dishes.', ['likes', 'like', 'liking', 'to like'], 1, 'doesn\'t + V nguyên mẫu: like.'],
      ['"___ you like a sandwich?" "Yes, please."', ['Do', 'Are', 'Would', 'Does'], 2, 'Lời mời lịch sự → Would you like…?'],
      ['I\'d like ___ a doctor when I grow up.', ['be', 'being', 'to be', 'am'], 2, 'I\'d like + to V.'],
      ['They ___ playing computer games.', ['enjoys', 'enjoy', 'is enjoy', 'enjoying'], 1, 'They + enjoy (hiện tại đơn).'],
      ['She hates ___ in crowded places.', ['been', 'being', 'be', 'is'], 1, 'hate + V-ing (đã học ở bài này).'],
      ['Which sentence is polite when you order food?', ['I want a burger.', 'Give me a burger.', 'I\'d like a burger, please.', 'A burger!'], 2, 'I\'d like… please là cách lịch sự.'],
      ['Do you mind ___ the window?', ['open', 'opening', 'to open', 'opens'], 1, 'mind + V-ing.']
    ]
  });

  L('g6-time-dates-numbers', {
    grade: 6, icon: '🗓️', title: 'Giờ giấc, ngày tháng và số đếm – số thứ tự', sub: 'Time, Dates & Numbers', level: 'Cơ bản',
    summary: 'Nói giờ, đọc ngày tháng, dùng số đếm (cardinal) và số thứ tự (ordinal) đúng cách trong giao tiếp hằng ngày.',
    sections: [
      { h: '1. Nói giờ', b: [
        { t: { h: ['Giờ', 'Cách nói', 'Ví dụ'], r: [['Giờ đúng', 'It\'s + số + o\'clock', '7:00 → It\'s seven o\'clock.'], ['Giờ hơn (1–30 phút)', 'số phút + **past** + giờ', '7:10 → ten **past** seven; 7:15 → a quarter past seven; 7:30 → half past seven'], ['Giờ kém (31–59 phút)', 'số phút còn thiếu + **to** + giờ kế', '7:40 → twenty **to** eight; 7:45 → a quarter to eight'], ['Cách nói số', 'giờ + phút', '7:25 → seven twenty-five']] } },
        { p: 'Hỏi giờ: **What time is it? / What\'s the time?** Hỏi lúc mấy giờ ra sao: **What time do you get up? — At six thirty.** Dùng **at** trước giờ: **at 6:30**, **at noon**, **at midnight**. Nói sáng/chiều: **a.m.** (trước 12 trưa) – **p.m.** (sau 12 trưa).' }
      ] },
      { h: '2. Số đếm và số thứ tự', b: [
        { t: { h: ['Số đếm', 'Số thứ tự', 'Cách viết'], r: [['one', '**first**', '1st'], ['two', '**second**', '2nd'], ['three', '**third**', '3rd'], ['four', 'fourth', '4th'], ['five', '**fifth**', '5th'], ['eight', '**eighth**', '8th'], ['nine', '**ninth**', '9th'], ['twelve', '**twelfth**', '12th'], ['twenty', '**twentieth**', '20th'], ['twenty-one', 'twenty-**first**', '21st']] } },
        { tip: 'Quy tắc: thêm **-th** vào số đếm (four → fourth) nhưng nhớ các số bất quy tắc: **first, second, third, fifth, eighth, ninth, twelfth**; số tận cùng -y đổi thành **-ieth** (twenty → twentieth).' }
      ] },
      { h: '3. Ngày tháng', b: [
        { p: 'Cách nói thường gặp (Anh – Anh): **the + số thứ tự + of + tháng**: **the fifth of May**; (Anh – Mỹ): **May the fifth / May 5th**. Cách viết: **5th May** hoặc **May 5th**; năm đọc theo cặp số: **1999 → nineteen ninety-nine; 2025 → twenty twenty-five**.' },
        { ul: ['Hỏi ngày: **What\'s the date today? — It\'s the 10th of October.** Hỏi thứ: **What day is it today? — It\'s Monday.**', 'Giới từ: **on** + ngày (on Monday, on 5th May), **in** + tháng/năm (in May, in 2025), **at** + giờ (at 7).', 'Tên tháng và thứ **viết hoa chữ cái đầu**: January, Monday.'] },
        { warn: 'Nhớ **12 tháng** và **7 thứ**: January, February, March, April, May, June, July, August, September, October, November, December · Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday.' }
      ] }
    ],
    ex: [
      ['It\'s half past six. Time to get up!', 'Sáu giờ rưỡi rồi. Đến giờ dậy rồi!'], ['The lesson starts at a quarter past seven.', 'Tiết học bắt đầu lúc bảy giờ mười lăm.'], ['It\'s ten to nine. We\'re late!', 'Chín giờ kém mười rồi. Chúng ta muộn rồi!'],
      ['My birthday is on the 15th of March.', 'Sinh nhật mình vào ngày 15 tháng Ba.'], ['Today is Friday, the second of June.', 'Hôm nay là thứ Sáu, ngày mùng hai tháng Sáu.'], ['Tet usually comes in January or February.', 'Tết thường đến vào tháng Giêng hoặc tháng Hai (dương lịch).'],
      ['I was born in 2013.', 'Mình sinh năm 2013.'], ['She lives on the third floor.', 'Cô ấy sống ở tầng ba.'], ['What time do you go to bed? — At nine thirty.', 'Bạn đi ngủ lúc mấy giờ? — Lúc chín giờ rưỡi.']
    ],
    mis: [
      ['My birthday is in 5th May.', 'My birthday is on 5th May.', 'Ngày cụ thể → on; tháng/năm → in.'], ['It\'s five past to seven.', 'It\'s five past seven. / It\'s five to seven.', 'Chỉ dùng past (hơn) hoặc to (kém), không dùng cả hai.'],
      ['He lives on the twoth floor.', 'He lives on the second floor.', 'two → second (bất quy tắc).'], ['I get up in 6 o\'clock.', 'I get up at 6 o\'clock.', 'Giờ giấc dùng at.'], ['monday and tuesday', 'Monday and Tuesday', 'Tên thứ viết hoa.']
    ],
    quiz: [
      ['It\'s 7:30. We say: It\'s ___ seven.', ['half to', 'half past', 'a quarter past', 'thirty to'], 1, '30 phút = half past.'],
      ['It\'s 8:45. We say: It\'s a quarter ___ nine.', ['past', 'to', 'at', 'in'], 1, 'Còn 15 phút nữa tới 9 giờ → a quarter to nine.'],
      ['The ordinal number of "three" is ___.', ['threeth', 'third', 'thirth', 'thrid'], 1, 'three → third.'],
      ['My birthday is ___ October.', ['on', 'at', 'in', 'of'], 2, 'Tháng → in.'],
      ['We have English ___ Monday morning.', ['in', 'at', 'on', 'to'], 2, 'Thứ trong tuần → on.'],
      ['The ordinal number of "twelve" is ___.', ['twelveth', 'twelfth', 'twelfeth', 'twelvth'], 1, 'twelve → twelfth.'],
      ['Which sentence is correct?', ['My birthday is in 5th May.', 'My birthday is on 5th May.', 'My birthday is at 5th May.', 'My birthday is by 5th May.'], 1, 'Ngày cụ thể → on.'],
      ['What time is 3:10?', ['ten past three', 'ten to three', 'three to ten', 'half past three'], 0, '10 phút sau 3 giờ → ten past three.'],
      ['She was born ___ 2012.', ['on', 'at', 'in', 'by'], 2, 'Năm → in.'],
      ['The 21st is read as "the twenty-___".', ['one', 'first', 'oneth', 'ones'], 1, '21st → twenty-first.']
    ]
  });

  L('g6-adjectives-position', {
    grade: 6, icon: '🎨', title: 'Tính từ: vị trí, thứ tự và tính từ tận cùng -ed/-ing', sub: 'Adjectives: position & order', level: 'Cơ bản',
    summary: 'Tính từ đứng ở đâu trong câu, không đổi theo số nhiều, thứ tự khi có nhiều tính từ và các tính từ mô tả người/vật thường gặp.',
    sections: [
      { h: '1. Hai vị trí của tính từ', b: [
        { f: ['**Trước danh từ**: a **nice** house, **red** flowers, an **interesting** book', 'Sau **to be / look / feel / seem…**: The house is **nice**. She looks **happy**.'] },
        { ul: ['Tính từ **không thêm -s** khi danh từ số nhiều: ✓ two **big** dogs (✗ bigs).', 'Trước tính từ bắt đầu bằng nguyên âm dùng **an**: **an** old man, **an** interesting film.', 'Mẫu câu: **S + be + adj** (She is tall) và **S + have/has + a/an + adj + noun** (She has a long hair ✗ → She has **long hair**).'] },
        { tip: 'Tính từ không đứng sau danh từ như tiếng Việt ("nhà đẹp"). Tiếng Anh: **beautiful house** (đẹp trước, nhà sau).' }
      ] },
      { h: '2. Thứ tự khi có nhiều tính từ (cơ bản)', b: [
        { p: 'Khi dùng 2–3 tính từ trước danh từ, thường theo thứ tự: **ý kiến → kích thước → tuổi/hình dạng → màu sắc → nguồn gốc → chất liệu → danh từ**.' },
        { t: { h: ['Ý kiến', 'Kích thước', 'Màu sắc', 'Chất liệu / nguồn gốc', 'Danh từ'], r: [['lovely', 'small', 'white', 'cotton', 'T-shirt'], ['a beautiful', 'big', 'old', 'Vietnamese', 'house'], ['two nice', 'little', 'brown', 'wooden', 'chairs']] } },
        { p: 'Ví dụ: **a lovely small white cotton T-shirt**. Trong thực tế bài lớp 6, chủ yếu gặp **ý kiến + kích thước + màu**: **a nice big red balloon.**' }
      ] },
      { h: '3. Tính từ -ed và -ing', b: [
        { t: { h: ['', '-ing (mô tả vật/việc gây ra cảm giác)', '-ed (mô tả cảm giác của người)'], r: [['bore', 'a **boring** film (bộ phim chán)', 'I am **bored** (mình thấy chán)'], ['interest', 'an **interesting** book', 'She is **interested** in music.'], ['excite', 'an **exciting** game', 'We are **excited**.'], ['tire', 'a **tiring** day', 'He feels **tired**.']] } },
        { warn: 'Nhớ: **-ing = làm người khác cảm thấy…**, **-ed = người ta cảm thấy…**. "I am boring" nghĩa là "mình là người nhàm chán"!' }
      ] }
    ],
    ex: [
      ['She has long black hair.', 'Cô ấy có mái tóc đen dài.'], ['This is a very interesting book.', 'Đây là một quyển sách rất thú vị.'], ['The flowers in the garden are beautiful.', 'Những bông hoa trong vườn rất đẹp.'],
      ['My bedroom is small but comfortable.', 'Phòng ngủ của mình nhỏ nhưng thoải mái.'], ['I bought a nice new blue bag.', 'Mình mua một chiếc cặp xanh mới rất đẹp.'], ['The film was boring, so we were bored.', 'Bộ phim chán nên chúng mình thấy chán.'],
      ['He is an honest and friendly boy.', 'Cậu ấy là một cậu bé trung thực và thân thiện.'], ['They live in a big old wooden house.', 'Họ sống trong một ngôi nhà gỗ cũ kỹ rộng lớn.'], ['I\'m very excited about the school trip.', 'Mình rất háo hức về chuyến đi học tập.']
    ],
    mis: [
      ['I have two bigs dogs.', 'I have two big dogs.', 'Tính từ không thêm s.'], ['She has a long hair.', 'She has long hair.', 'hair thường là danh từ không đếm được trong nghĩa "tóc"; không dùng a.'],
      ['It is a house beautiful.', 'It is a beautiful house.', 'Tính từ đứng trước danh từ.'], ['I am boring in this class.', 'I am bored in this class.', 'Người cảm thấy chán → bored.'], ['an red apple', 'a red apple', 'red bắt đầu bằng phụ âm → a.']
    ],
    quiz: [
      ['She is wearing a ___ dress.', ['beautifully', 'beautiful', 'beautifuls', 'beauty'], 1, 'Trước danh từ dress cần tính từ: a beautiful dress.'],
      ['The story is very ___. I can\'t stop reading.', ['interested', 'interesting', 'interest', 'interests'], 1, 'Vật gây hứng thú → interesting.'],
      ['I\'m ___ because the lesson is too long.', ['bored', 'boring', 'bore', 'boredom'], 0, 'Cảm giác của người → bored.'],
      ['Which order is correct?', ['a brown small bag', 'a small brown bag', 'a bag small brown', 'a brown bag small'], 1, 'Kích thước trước màu sắc: small brown.'],
      ['They have two ___ cats.', ['cutes', 'cute', 'cuteness', 'cuter'], 1, 'Tính từ không thêm s: two cute cats.'],
      ['It was a ___ day, so we went to bed early.', ['tiring', 'tired', 'tire', 'tiredness'], 0, 'Ngày làm người ta mệt → tiring.'],
      ['I have ___ eyes.', ['a big blue', 'big blue', 'blue big a', 'bigs blue'], 1, 'eyes số nhiều, không dùng a: big blue eyes.'],
      ['The park is ___.', ['a clean', 'cleans', 'clean', 'cleanly'], 2, 'Sau to be dùng tính từ: is clean.'],
      ['Mai looks very ___ today.', ['happily', 'happy', 'happiness', 'happier than'], 1, 'Sau look dùng tính từ: looks happy.']
    ]
  });

  /* ───── Làm sâu các bài lớp 6 ───── */
  function P(id, d) {
    var l = S.lessons[id]; if (!l) throw new Error('Không thấy bài ' + id);
    (d.sections || []).forEach(function (s) { s.h = (l.sections.length + 1) + '. ' + s.h; l.sections.push(s); });
    ['ex', 'mis', 'quiz'].forEach(function (k) { if (d[k]) l[k] = l[k].concat(d[k]); });
  }

  P('g6-tobe', {
    sections: [
      { h: 'Giới thiệu bản thân và người khác', b: [
        { t: { h: ['Mục đích', 'Mẫu câu', 'Ví dụ'], r: [['Giới thiệu tên', 'My name is… / I\'m…', 'My name is Lan. I\'m Nam.'], ['Nói quê quán', 'I\'m from… / I come from…', 'I\'m from Hue.'], ['Giới thiệu người khác', 'This is… / These are…', 'This is my friend, Tom.'], ['Hỏi thăm', 'How are you? — I\'m fine, thanks.', 'How are you today?'], ['Gặp lần đầu', 'Nice to meet you. — Nice to meet you, too.', 'Hello, I\'m Mai. Nice to meet you.']] } },
        { tip: 'Với tên người dùng **My name is Lan** hoặc **I\'m Lan**; nói tuổi dùng **I\'m 12** (không nói "I have 12 years old").' }
      ] },
      { h: 'Câu hỏi Wh- với to be', b: [
        { f: ['Wh-word + **am/is/are** + S + …?'] },
        { t: { h: ['Câu hỏi', 'Trả lời mẫu'], r: [['What **is** your name?', 'My name is Lan.'], ['How old **are** you?', 'I\'m twelve.'], ['Where **are** you from?', 'I\'m from Viet Nam.'], ['Who **is** that boy?', 'He\'s my brother.'], ['What **are** these?', 'They\'re my books.'], ['How **is** your mother?', 'She\'s fine, thank you.']] } },
        { warn: 'Viết tắt **What\'s / Who\'s / Where\'s / How\'s** được dùng nhiều trong nói; nhưng ở câu trả lời ngắn **Yes, I am** không viết tắt: ✗ Yes, I\'m.' }
      ] },
      { h: 'To be và động từ thường: đừng nhầm', b: [
        { ul: ['Mỗi câu chỉ có **một động từ chính**: **She is a teacher.** (be) — **She teaches English.** (động từ thường). Không dùng cả hai: ✗ She is teach English.', 'Phủ định của **be** thêm **not**: **I am not tired.** Phủ định động từ thường dùng **don\'t/doesn\'t**: **I don\'t like tea.**', 'Sau **be** thường là danh từ, tính từ hoặc cụm giới từ: He is **a doctor / tall / in the garden**.'] },
        { t: { h: ['', 'to be', 'động từ thường'], r: [['Câu hỏi', 'Are you tired?', 'Do you like tea?'], ['Phủ định', 'I\'m not tired.', 'I don\'t like tea.'], ['Trả lời ngắn', 'Yes, I am.', 'Yes, I do.']] } }
      ] }
    ],
    ex: [
      ['My name is Mai and I\'m from Hue.', 'Mình tên Mai và mình đến từ Huế.'], ['How old are you? — I\'m eleven.', 'Bạn bao nhiêu tuổi? — Mình mười một tuổi.'], ['Where are your parents? — They\'re at work.', 'Bố mẹ bạn ở đâu? — Họ đang ở chỗ làm.'], ['Who is that girl? — She\'s my cousin.', 'Cô gái kia là ai? — Chị họ mình.']
    ],
    mis: [['How old you are?', 'How old are you?', 'Câu hỏi Wh- với be: Wh + be + S.'], ['I have 12 years old.', 'I am 12 years old.', 'Nói tuổi dùng be, không dùng have.'], ['She is teach English.', 'She teaches English.', 'Không dùng be cùng động từ thường.']],
    quiz: [
      ['___ is your name? — My name is Nam.', ['Who', 'What', 'Where', 'How'], 1, 'Hỏi tên → What is your name?'],
      ['Where ___ you from? — I\'m from Da Nang.', ['is', 'am', 'are', 'do'], 2, 'you → are.'],
      ['"Are you a student?" "No, I ___."', ['amn\'t', 'isn\'t', 'am not', 'not am'], 2, 'Trả lời ngắn phủ định: No, I am not / I\'m not.'],
      ['Which sentence is correct?', ['She is like pizza.', 'She likes pizza.', 'She is likes pizza.', 'She like pizza.'], 1, 'like là động từ thường, không dùng be.']
    ]
  });

  P('g6-present-simple', {
    sections: [
      { h: 'Câu phủ định và câu hỏi chi tiết', b: [
        { t: { h: ['Chủ ngữ', 'Phủ định', 'Câu hỏi', 'Trả lời ngắn'], r: [['I / you / we / they', 'don\'t + V', 'Do + S + V?', 'Yes, I do. / No, they don\'t.'], ['he / she / it', 'doesn\'t + V', 'Does + S + V?', 'Yes, she does. / No, it doesn\'t.']] } },
        { ul: ['Sau **do/does/don\'t/doesn\'t** luôn dùng **V nguyên mẫu** (không thêm s, không chia): **Does she like tea?** (✗ likes).', 'Câu hỏi có từ để hỏi: **Wh-word + do/does + S + V?**: **Where does he work?** — **What do you do?** (hỏi nghề nghiệp).', 'Câu hỏi về **chủ ngữ** không dùng do/does: **Who likes pizza?** — Tom does.'] },
        { tip: 'Hỏi nghề: **What do you do?** = Bạn làm nghề gì? Trả lời: **I\'m a teacher.** (dùng be, không lặp "do").' }
      ] },
      { h: 'Trạng từ tần suất và vị trí', b: [
        { t: { h: ['Trạng từ', 'Mức độ', 'Ví dụ'], r: [['always', '100%', 'She always gets up at 6.'], ['usually', '~80%', 'I usually walk to school.'], ['often', '~60%', 'We often play football.'], ['sometimes', '~40%', 'He sometimes forgets his keys.'], ['rarely / hardly ever', '~10%', 'They rarely eat out.'], ['never', '0%', 'I never drink coffee.']] } },
        { ul: ['Đứng **trước động từ thường**: I **often** read books.', 'Đứng **sau to be**: She is **always** late.', 'Cụm từ chỉ tần suất đứng **cuối câu**: **every day, once a week, twice a month, three times a year**.'] },
        { warn: 'Câu hỏi: **How often do you…?** — trả lời bằng trạng từ hoặc cụm: **Twice a week.** Với **never** không dùng phủ định: ✗ I don\'t never go → ✓ I never go.' }
      ] },
      { h: 'Các lỗi và lưu ý quan trọng', b: [
        { ul: ['**Chủ ngữ số ít** (danh từ số ít, tên riêng, it, he, she) + V-s/es: **My brother plays**. Danh từ số nhiều không thêm s: **My brothers play**.', '**Do/does** là trợ động từ, còn **do/does** làm động từ chính nghĩa "làm": **She does her homework.** (does = làm).', 'Dạng đặc biệt: **go → goes, do → does, have → has, fly → flies, watch → watches, pass → passes, mix → mixes**.', 'Hiện tại đơn cũng dùng cho **lịch trình/thời gian biểu**: The train **leaves** at 9.'] }
      ] }
    ],
    ex: [
      ['She never eats meat.', 'Cô ấy không bao giờ ăn thịt.'], ['How often do you visit your grandparents? — Once a month.', 'Bao lâu bạn thăm ông bà một lần? — Mỗi tháng một lần.'], ['Does your sister work in a bank? — No, she doesn\'t.', 'Chị bạn làm ở ngân hàng à? — Không.'], ['The train leaves at 9 o\'clock.', 'Tàu khởi hành lúc 9 giờ.']
    ],
    mis: [['She always is late.', 'She is always late.', 'Trạng từ tần suất đứng sau to be.'], ['I don\'t never watch TV.', 'I never watch TV.', 'never đã mang nghĩa phủ định.'], ['My brothers plays football.', 'My brothers play football.', 'brothers số nhiều → không thêm s.']],
    quiz: [
      ['She ___ gets up late on Sundays.', ['usually', 'usual', 'is usually', 'does usually'], 0, 'Trạng từ tần suất đứng trước động từ thường.'],
      ['He is ___ late for class.', ['never', 'doesn\'t never', 'not never', 'never is'], 0, 'be + never (He is never late).'],
      ['What time ___ your mother go to work?', ['do', 'does', 'is', 'did'], 1, 'mother → does.'],
      ['My uncle ___ in a hospital.', ['work', 'works', 'is work', 'does work'], 1, 'uncle số ít → works.']
    ]
  });

  P('g6-present-continuous', {
    sections: [
      { h: 'Câu phủ định, câu hỏi và trả lời ngắn', b: [
        { t: { h: ['', 'Cấu trúc', 'Ví dụ'], r: [['Khẳng định', 'S + am/is/are + V-ing', 'She **is cooking** now.'], ['Phủ định', 'S + am/is/are **not** + V-ing', 'They **aren\'t watching** TV.'], ['Nghi vấn', '**Am/Is/Are** + S + V-ing?', '**Is** he **sleeping**?'], ['Wh-', 'Wh-word + am/is/are + S + V-ing?', 'What **are you doing**?'], ['Trả lời ngắn', 'Yes, S + am/is/are. / No, S + am/is/are + not.', 'Yes, he is. / No, he isn\'t.']] } },
        { tip: 'Hỏi về chủ ngữ: **Who is singing?** (không cần trợ động từ khác).' }
      ] },
      { h: 'Hiện tại tiếp diễn và hiện tại đơn', b: [
        { t: { h: ['', 'Hiện tại đơn', 'Hiện tại tiếp diễn'], r: [['Ý nghĩa', 'thói quen, sự thật, lịch trình', 'đang xảy ra, tạm thời'], ['Dấu hiệu', 'always, usually, every day, on Mondays', 'now, at the moment, look!, listen!'], ['Ví dụ', 'I **play** football on Sundays.', 'I **am playing** football now.'], ['Câu hỏi', 'Do you play football?', 'Are you playing football?']] } },
        { p: 'Kết hợp hai thì trong một câu: **I usually walk to school, but today I\'m taking the bus.** (thói quen ≠ việc đặc biệt hôm nay).' }
      ] },
      { h: 'Quy tắc thêm -ing và lưu ý', b: [
        { ul: ['Động từ **một âm tiết** có cấu trúc phụ âm–nguyên âm–phụ âm: gấp đôi phụ âm cuối: **run → running, sit → sitting, swim → swimming, stop → stopping**.', 'Động từ tận cùng **-w, -x, -y** không gấp đôi: **play → playing, fix → fixing, snow → snowing**.', '**be** có hai dạng: **am/is/are being** (cư xử) — chưa học ở lớp 6.', 'Nhớ không dùng **be** thiếu: ✗ She reading → ✓ She **is** reading.'] },
        { warn: 'Các động từ **know, like, love, want, need, understand, believe, have (sở hữu)** thường **không** dùng ở thì tiếp diễn.' }
      ] }
    ],
    ex: [
      ['What is she doing? — She is cooking dinner.', 'Cô ấy đang làm gì? — Cô ấy đang nấu bữa tối.'], ['I usually walk to school, but today I\'m taking the bus.', 'Mình thường đi bộ đến trường nhưng hôm nay mình đi xe buýt.'], ['The boys are swimming in the pool.', 'Các cậu bé đang bơi trong hồ.'], ['Who is playing the piano?', 'Ai đang chơi đàn piano thế?']
    ],
    mis: [['She reading a book now.', 'She is reading a book now.', 'Thiếu am/is/are.'], ['They are swiming.', 'They are swimming.', 'swim → swimming (gấp đôi m).'], ['Are you work now?', 'Are you working now?', 'Câu hỏi tiếp diễn dùng V-ing.']],
    quiz: [
      ['My mother is ___ dinner in the kitchen.', ['cook', 'cooks', 'cooking', 'cooked'], 2, 'is + V-ing.'],
      ['The children ___ in the garden now.', ['plays', 'is playing', 'are playing', 'play'], 2, 'children số nhiều → are playing.'],
      ['I usually go by bus, but at the moment I ___ by bike.', ['go', 'am going', 'goes', 'gone'], 1, 'Hôm nay tạm thời khác thường lệ → am going.'],
      ['He is ___ his shoes.', ['putting', 'puting', 'puts', 'put'], 0, 'put → putting (gấp đôi t).']
    ]
  });

  P('g6-there-is-are', {
    sections: [
      { h: 'Nói về nơi chốn: There is/are + giới từ', b: [
        { p: 'Thường theo sau là cụm giới từ chỉ vị trí để nói đồ vật **ở đâu**:' },
        { t: { h: ['Giới từ', 'Ví dụ'], r: [['in / on / under', 'There is a cat **under** the table.'], ['next to / near / opposite', 'There is a bank **next to** the school.'], ['in front of / behind', 'There are two trees **behind** the house.'], ['between', 'There is a lamp **between** the bed and the desk.'], ['on the left / right', 'There is a window **on the left**.']] } },
        { tip: 'Mô tả phòng/ nhà: bắt đầu bằng **There is/are** rồi thêm chi tiết bằng **It is…** hoặc **They are…**: There is a desk. **It is** next to the window.' }
      ] },
      { h: 'There is/are với số lượng', b: [
        { ul: ['**a / an / one** + danh từ số ít: There is **a** library. · There is **one** bathroom.', 'Số lượng khác 1 + danh từ số nhiều: There are **four** bedrooms.', 'Không đếm được: **some / a lot of / much / any**: There is **a lot of** snow. There isn\'t **much** water.', 'Hỏi số lượng: **How many** + danh từ số nhiều + are there…? / **How much** + danh từ không đếm được + is there…?'] },
        { t: { h: ['Câu', 'Dạng', 'Ví dụ'], r: [['Khẳng định', 'There is/are (some)', 'There are some pens.'], ['Phủ định', 'There isn\'t/aren\'t (any)', 'There aren\'t any pens.'], ['Nghi vấn', 'Is/Are there (any)…?', 'Are there any pens?']] } }
      ] },
      { h: 'There is/are và Have/has — đừng nhầm', b: [
        { ul: ['**There is/are** = có (tồn tại ở đâu đó): **There is a park near my house.**', '**have/has** = sở hữu (ai có cái gì): **I have a new bike.** — **My house has three rooms.** (nhà gồm có)', 'Không dùng **it has** để nói "có" nơi chốn: ✗ It has a park near my house. ✓ **There is** a park near my house.'] },
        { warn: 'Danh từ **không đếm được** (water, milk, rice, money, time) dùng **There is**, không dùng There are.' }
      ] }
    ],
    ex: [
      ['There is a cat under the table.', 'Có một con mèo ở dưới bàn.'], ['There aren\'t any eggs, but there is some milk.', 'Không có quả trứng nào nhưng có ít sữa.'], ['How much water is there in the bottle?', 'Có bao nhiêu nước trong chai?'], ['There is a lot of snow in the mountains in winter.', 'Mùa đông có rất nhiều tuyết ở trên núi.']
    ],
    mis: [['There are a lot of water.', 'There is a lot of water.', 'water không đếm được → is.'], ['In my room has a bed.', 'There is a bed in my room.', 'Dùng There is, không dùng has.'], ['Is there any students?', 'Are there any students?', 'students số nhiều → Are there.']],
    quiz: [
      ['There ___ a lot of water in the lake.', ['are', 'is', 'have', 'has'], 1, 'water không đếm được → is.'],
      ['___ there any pencils in your bag?', ['Is', 'Are', 'Do', 'Have'], 1, 'pencils số nhiều → Are there.'],
      ['"How many rooms are there in your house?" "___ five."', ['It is', 'There are', 'There is', 'They have'], 1, 'There are five.'],
      ['Which sentence is correct?', ['It has a school near my house.', 'There has a school near my house.', 'There is a school near my house.', 'Have a school near my house.'], 2, 'Nói "có" nơi chốn → There is.']
    ]
  });

  P('g6-articles-plurals', {
    sections: [
      { h: 'Khi nào dùng the?', b: [
        { ul: ['Người nghe đã **biết** là cái nào: Open **the** window. (cửa sổ trong phòng)', 'Đã nhắc ở trước: I have a dog. **The** dog is black.', 'Vật **duy nhất**: the sun, the moon, the Earth, the sky, the world.', 'Sau **so sánh nhất** và **số thứ tự**: the best, the first, the tallest.', 'Tên một số địa danh: the Pacific, the Mekong River, the United States; nhạc cụ: play **the** piano/guitar.'] },
        { t: { h: ['Dùng a/an', 'Dùng the', 'Không dùng mạo từ'], r: [['lần đầu nhắc / nghề nghiệp', 'đã xác định / duy nhất', 'danh từ nói chung, bữa ăn, môn thể thao, ngôn ngữ, tên người'], ['She is **a** teacher.', '**The** teacher is kind.', 'She teaches English. · I like music. · Tom plays football.']] } }
      ] },
      { h: 'Danh từ đếm được và không đếm được', b: [
        { t: { h: ['', 'Đếm được', 'Không đếm được'], r: [['Số ít', 'a book, an apple', 'water, milk, rice, money, information, furniture, advice'], ['Số nhiều', 'books, apples', 'không có dạng số nhiều'], ['Đi với', 'a/an, many, a few, some', 'much, a little, some, a lot of'], ['Đơn vị đo', '—', 'a glass of water, a piece of advice, a bottle of milk']] } },
        { warn: 'Không thêm **s** vào danh từ không đếm được: ✗ informations, furnitures, advices. Dùng **some information / a piece of information**.' }
      ] },
      { h: 'Cách đọc đuôi -s/-es của danh từ số nhiều', b: [
        { t: { h: ['Đọc', 'Khi nào', 'Ví dụ'], r: [['/s/', 'sau âm vô thanh /p, t, k, f, θ/', 'books, cats, maps, cliffs'], ['/z/', 'sau âm hữu thanh và nguyên âm', 'dogs, pens, bags, boys'], ['/ɪz/', 'sau /s, z, ʃ, ʒ, tʃ, dʒ/', 'buses, boxes, watches, bridges']] } },
        { ul: ['Danh từ tận cùng -o: nhiều từ +es (tomato → tomatoes, potato → potatoes, hero → heroes) nhưng **photo → photos, piano → pianos, radio → radios**.', 'Danh từ chỉ nhóm người: **people** (số nhiều, không thêm s), **police** (số nhiều), **family/team** (số ít hoặc nhiều).', 'Danh từ chỉ đồ vật có hai phần dùng số nhiều: **glasses, jeans, trousers, scissors** → a pair of jeans.'] }
      ] }
    ],
    ex: [
      ['I have a dog. The dog is very friendly.', 'Mình có một con chó. Con chó rất thân thiện.'], ['She plays the piano and her brother plays the guitar.', 'Cô ấy chơi piano còn em trai chơi ghi-ta.'], ['We need some information about the course.', 'Chúng mình cần ít thông tin về khoá học.'], ['I bought a pair of jeans and two photos.', 'Mình mua một cái quần jean và hai tấm ảnh.']
    ],
    mis: [['I have a dog. A dog is black.', 'I have a dog. The dog is black.', 'Đã nhắc ở trước → the.'], ['She gave me an advice.', 'She gave me some advice. / a piece of advice.', 'advice không đếm được.'], ['I need some informations.', 'I need some information.', 'information không có số nhiều.']],
    quiz: [
      ['I have a cat. ___ cat is white.', ['A', 'An', 'The', 'Some'], 2, 'Đã nhắc ở trước → The.'],
      ['She plays ___ piano very well.', ['a', 'an', 'the', 'no article'], 2, 'play + the + nhạc cụ.'],
      ['We need some ___ about the trip.', ['informations', 'information', 'an information', 'informing'], 1, 'information không đếm được.'],
      ['The plural of "tomato" is ___.', ['tomatos', 'tomatoes', 'tomatoies', 'tomati'], 1, 'tomato → tomatoes.']
    ]
  });

  P('g6-possessives', {
    sections: [
      { h: 'Whose và cách trả lời', b: [
        { f: ['**Whose** + danh từ + is/are + this/that/these/those? — It\'s / They\'re + \'s / đại từ sở hữu'] },
        { t: { h: ['Câu hỏi', 'Trả lời mẫu'], r: [['Whose bag is this?', 'It\'s **Lan\'s**. / It\'s **hers**. / It\'s **my** bag.'], ['Whose books are these?', 'They\'re **Tom\'s**. / They\'re **ours**.'], ['Whose is this pen?', 'It\'s **mine**.']] } },
        { tip: 'Sau **Whose** có thể không có danh từ: **Whose is this?** — It\'s **mine**.' }
      ] },
      { h: 'Sở hữu cách \'s — các trường hợp đặc biệt', b: [
        { ul: ['Hai người sở hữu chung: ghi \'s ở người cuối: **Tom and Anna\'s house** (nhà của cả hai).', 'Mỗi người một vật riêng: **Tom\'s and Anna\'s houses**.', 'Tên tận cùng -s: thêm **\'s** hoặc chỉ **\'**: **James\'s book / James\' book**.', 'Dùng cho người, con vật; với đồ vật dùng **of**: **the door of the room** (✗ the room\'s door ít dùng).', '**\'s** còn là dạng viết tắt của **is/has**: **Tom\'s tall.** (Tom is) / **Tom\'s got a bike.** (Tom has) — dựa vào ngữ cảnh.'] }
      ] },
      { h: 'Tính từ sở hữu hay đại từ sở hữu?', b: [
        { t: { h: ['Dùng khi', 'Tính từ sở hữu', 'Đại từ sở hữu'], r: [['Sau nó có danh từ', 'This is **my** book.', '—'], ['Không có danh từ sau', '—', 'This book is **mine**.'], ['So sánh', '**Her** house is bigger than **our** house.', 'Her house is bigger than **ours**.']] } },
        { warn: 'Không dùng mạo từ cùng tính từ sở hữu: ✗ the my book, a my friend → ✓ **my book**, **a friend of mine** (một người bạn của mình).' }
      ] }
    ],
    ex: [
      ['Whose pencil is this? — It\'s Mai\'s.', 'Cây bút chì này của ai? — Của Mai.'], ['Tom and Anna\'s house is near the park.', 'Nhà của Tom và Anna ở gần công viên.'], ['Our classroom is bigger than theirs.', 'Lớp học của chúng mình lớn hơn lớp của họ.'], ['She\'s my friend. She\'s very kind.', 'Cô ấy là bạn của mình. Cô ấy rất tốt bụng.']
    ],
    mis: [['The my book is on the table.', 'My book is on the table.', 'Không dùng the cùng tính từ sở hữu.'], ['This is the room of Lan.', 'This is Lan\'s room.', 'Dùng \'s với người.'], ['Their\'s house is big.', 'Their house is big. / The house is theirs.', 'their không có dấu \'.']],
    quiz: [
      ['___ shoes are these? — They\'re Tom\'s.', ['Who', 'Whose', 'Who\'s', 'Which'], 1, 'Hỏi sở hữu → Whose.'],
      ['This isn\'t my pen. It\'s ___.', ['her', 'hers', 'she', 'her\'s'], 1, 'Đại từ sở hữu đứng một mình: hers.'],
      ['Anna and Tom are friends. That is ___ house.', ['Anna and Tom\'s', 'Anna\'s and Tom', 'Anna and Toms', 'Anna and Tom'], 0, 'Chung một vật → Anna and Tom\'s house.'],
      ['The ___ room is on the left. (một cậu bé)', ['boys\'', 'boy\'s', 'boys', 'boy'], 1, 'Số ít + \'s.']
    ]
  });

  P('g6-prepositions', {
    sections: [
      { h: 'Giới từ chỉ chuyển động và hướng', b: [
        { t: { h: ['Giới từ', 'Nghĩa', 'Ví dụ'], r: [['to', 'đến (một nơi)', 'I go **to** school by bus.'], ['from', 'từ (nơi xuất phát)', 'She comes **from** Hue.'], ['into / out of', 'vào trong / ra khỏi', 'Go **into** the room. Get **out of** the car.'], ['along', 'dọc theo', 'Walk **along** the river.'], ['across', 'băng qua', 'Walk **across** the bridge.'], ['through', 'xuyên qua', 'The train goes **through** a tunnel.'], ['up / down', 'lên / xuống', 'Go **up** the stairs.'], ['past', 'đi ngang qua', 'Go **past** the bank.']] } },
        { tip: 'Chỉ đường: **Go straight → turn left/right → go past the bank → it\'s on your left / opposite the school**.' }
      ] },
      { h: 'Giới từ chỉ thời gian khác', b: [
        { t: { h: ['Giới từ', 'Dùng với', 'Ví dụ'], r: [['**from … to / until**', 'khoảng thời gian', 'School is open **from** 7 **to** 5.'], ['**for**', 'bao lâu', 'I have lived here **for** three years.'], ['**before / after**', 'trước / sau', 'Wash your hands **before** meals.'], ['**during**', 'trong suốt', 'I slept **during** the film.'], ['**by**', 'chậm nhất lúc', 'Finish it **by** Friday.']] } },
        { warn: 'Không dùng giới từ trước **tomorrow, yesterday, today, tonight, next week, last year, this morning, every day**: ✗ on tomorrow → ✓ tomorrow.' }
      ] },
      { h: 'Giới từ đi với động từ và tính từ quen thuộc', b: [
        { t: { h: ['Cụm', 'Nghĩa', 'Ví dụ'], r: [['listen to', 'nghe', 'Listen to the teacher.'], ['look at', 'nhìn vào', 'Look at the board.'], ['wait for', 'chờ', 'I\'m waiting for the bus.'], ['good at', 'giỏi', 'She is good at maths.'], ['interested in', 'quan tâm', 'He is interested in music.'], ['arrive in / at', 'đến (thành phố / nơi nhỏ)', 'We arrived in Hanoi at the station.'], ['live in / at', 'sống ở', 'She lives in a big city, at 25 Hang Bac Street.']] } }
      ] }
    ],
    ex: [
      ['I go to school from Monday to Friday.', 'Mình đi học từ thứ Hai đến thứ Sáu.'], ['Walk along this street and turn left at the bank.', 'Đi dọc con đường này rồi rẽ trái ở ngân hàng.'], ['He is waiting for the bus.', 'Anh ấy đang đợi xe buýt.'], ['She is very good at drawing.', 'Cô ấy vẽ rất giỏi.']
    ],
    mis: [['I\'m waiting the bus.', 'I\'m waiting for the bus.', 'wait for.'], ['See you on tomorrow.', 'See you tomorrow.', 'Không dùng giới từ trước tomorrow.'], ['He is good in English.', 'He is good at English.', 'good at.']],
    quiz: [
      ['Please listen ___ me carefully.', ['at', 'to', 'for', 'in'], 1, 'listen to.'],
      ['We arrived ___ Hanoi at 9 a.m.', ['to', 'in', 'on', 'at'], 1, 'arrive in + thành phố.'],
      ['I\'m not good ___ football.', ['at', 'in', 'on', 'for'], 0, 'good at.'],
      ['Go ___ the bank and you will see the school.', ['past', 'at', 'on', 'for'], 0, 'go past = đi ngang qua.']
    ]
  });

  P('g6-wh-questions', {
    sections: [
      { h: 'Những cặp từ để hỏi dễ nhầm', b: [
        { t: { h: ['Cặp', 'Khác nhau', 'Ví dụ'], r: [['**What** / **Which**', 'What: không giới hạn; Which: có lựa chọn cụ thể', 'What colour do you like? — Which colour do you like, red or blue?'], ['**Who** / **Whose** / **Whom**', 'Who: ai; Whose: của ai', 'Who is she? — Whose is this bag?'], ['**When** / **What time**', 'When: khi nào; What time: mấy giờ', 'When is the party? — What time does it start?'], ['**How** / **What … like**', 'How: tính chất (sức khoẻ, cách thức); What…like: mô tả', 'How is your mother? — What\'s your mother like?'], ['**How long / How far**', 'long: bao lâu/dài; far: khoảng cách', 'How long is the film? — How far is your school?']] } }
      ] },
      { h: 'Câu hỏi với giới từ và câu hỏi đuôi chủ ngữ', b: [
        { ul: ['Giới từ thường đứng **cuối câu**: **Who are you talking to?** — **What are you looking at?** — **Where are you from?**', 'Hỏi về **chủ ngữ** không đảo: **Who called you?** — **What happened?** — **Which team won?**', 'Hỏi về **tân ngữ** cần trợ động từ: **Who did you call?** — **What did you see?**'] },
        { warn: 'Không dùng **did/do/does** khi hỏi về chủ ngữ: ✗ Who did call you? → ✓ Who called you?' }
      ] },
      { h: 'Từ để hỏi + danh từ / what for / how come', b: [
        { t: { h: ['Mẫu', 'Ví dụ'], r: [['**What** + danh từ', 'What time/kind/sport/colour…?'], ['**Which** + danh từ', 'Which book do you want?'], ['**Whose** + danh từ', 'Whose phone is ringing?'], ['**How many/much** + danh từ', 'How many apples? How much milk?'], ['**What for?**', 'Để làm gì? — What is this knife for? — It\'s for cutting bread.']] } },
        { tip: 'Mẫu câu giao tiếp lớp học: **What does … mean?** (… nghĩa là gì?), **How do you spell …?** (đánh vần thế nào?), **How do you say … in English?**' }
      ] }
    ],
    ex: [
      ['Which bag do you prefer, the red one or the blue one?', 'Bạn thích cái túi nào hơn, cái đỏ hay cái xanh?'], ['What are you looking at?', 'Bạn đang nhìn gì thế?'], ['Who called you last night?', 'Tối qua ai gọi cho bạn?'], ['How do you spell your name?', 'Tên bạn đánh vần thế nào?']
    ],
    mis: [['Who did call you?', 'Who called you?', 'Hỏi chủ ngữ không dùng did.'], ['Where you are from?', 'Where are you from?', 'Phải đảo trợ động từ trước chủ ngữ.'], ['What time you go to bed?', 'What time do you go to bed?', 'Thiếu trợ động từ do.']],
    quiz: [
      ['___ is your favourite colour? — Blue.', ['Who', 'What', 'Where', 'Whose'], 1, 'What + danh từ…'],
      ['___ is the party? — On Saturday evening.', ['What', 'When', 'Which', 'Whose'], 1, 'Hỏi thời gian → When.'],
      ['Who ___ you yesterday?', ['did call', 'called', 'do call', 'calls'], 1, 'Hỏi chủ ngữ: Who called you?'],
      ['What are you looking ___?', ['at', 'to', 'for', 'on'], 0, 'look at.']
    ]
  });
})();
