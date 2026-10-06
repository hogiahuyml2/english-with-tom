/* Tiếng Anh phổ thông — Lớp 9 (ngữ pháp). Nội dung tự biên soạn cho English With Tom. */
(function () {
  var S = (window.SCHOOL = window.SCHOOL || { lessons: {} });
  function L(id, d) { d.id = id; S.lessons[id] = d; }

  L('g9-relative-clauses', {
    grade: 9, icon: '🔗', title: 'Mệnh đề quan hệ', sub: 'who, whom, which, that, whose, where, when', level: 'Trung bình',
    summary: 'Dùng đại từ/trạng từ quan hệ để nối câu và bổ sung thông tin cho danh từ.',
    sections: [
      { h: '1. Các từ quan hệ', b: [
        { t: { h: ['Từ', 'Thay cho', 'Ví dụ'], r: [['who', 'người (chủ ngữ)', 'The girl who lives next door is my friend.'], ['whom', 'người (tân ngữ, trang trọng)', 'The man whom I met was kind.'], ['which', 'vật / sự việc', 'The book which is on the desk is mine.'], ['that', 'người hoặc vật (mệnh đề xác định)', 'The film that we watched was boring.'], ['whose', 'sở hữu (của người/vật)', 'The boy whose bike was stolen is crying.'], ['where', 'nơi chốn', 'This is the school where I study.'], ['when', 'thời gian', 'I remember the day when we met.']] } }
      ] },
      { h: '2. Mệnh đề xác định và không xác định', b: [
        { ul: ['**Xác định** (cần thiết để hiểu danh từ, không có dấu phẩy): **The man who called you is my uncle.** — có thể dùng **that**.', '**Không xác định** (thêm thông tin phụ, có dấu phẩy): **My mother, who is a teacher, loves reading.** — **không** dùng **that**; dùng sau danh từ riêng.'] },
        { ul: ['Có thể **bỏ đại từ quan hệ** khi nó làm **tân ngữ** trong mệnh đề xác định: **The book (that) I bought is great.**', 'Không lặp lại tân ngữ/chủ ngữ sau đại từ quan hệ: **The book which I bought it** là sai.'] },
        { tip: 'Giới từ có thể đứng cuối mệnh đề hoặc trước **whom/which**: **the girl (who) I talked to** = **the girl to whom I talked**.' }
      ] }
    ],
    ex: [['The girl who lives next door is my best friend.', 'Cô gái sống bên cạnh là bạn thân nhất của mình.'], ['The book which I bought yesterday is very interesting.', 'Quyển sách mình mua hôm qua rất hay.'], ['The man whose car was stolen called the police.', 'Người đàn ông có xe bị mất cắp đã gọi cảnh sát.'], ['This is the house where I was born.', 'Đây là ngôi nhà nơi mình sinh ra.'], ['My mother, who is a nurse, works at night.', 'Mẹ mình, người là y tá, làm việc ban đêm.'], ['Do you remember the day when we first met?', 'Bạn có nhớ ngày chúng ta gặp nhau lần đầu không?'], ['The film (that) we watched last night was boring.', 'Bộ phim chúng mình xem tối qua rất chán.'], ['Hanoi, which is the capital of Vietnam, is a beautiful city.', 'Hà Nội, thủ đô của Việt Nam, là một thành phố đẹp.']],
    mis: [['The man who he lives next door is kind.', 'The man who lives next door is kind.', 'who đã làm chủ ngữ, không thêm he.'], ['The book which I bought it is great.', 'The book which I bought is great.', 'Không lặp lại tân ngữ it.'], ['My mother, that is a teacher, is kind.', 'My mother, who is a teacher, is kind.', 'Mệnh đề không xác định (có dấu phẩy) không dùng that.'], ['The girl whose her bag was lost cried.', 'The girl whose bag was lost cried.', 'whose + danh từ, không thêm her.'], ['This is the house which I was born in it.', 'This is the house where I was born. / ... which I was born in.', 'Không lặp lại in it.']],
    quiz: [
      ['The woman ___ lives next door is a doctor.', ['which', 'who', 'whose', 'where'], 1, 'Thay cho người, làm chủ ngữ → who.'],
      ['The book ___ I read last week was fantastic.', ['who', 'whose', 'which', 'where'], 2, 'Thay cho vật → which (hoặc that).'],
      ['That is the boy ___ father is a pilot.', ['who', 'whose', 'which', 'whom is'], 1, 'Sở hữu → whose.'],
      ['This is the restaurant ___ we had dinner last night.', ['which', 'who', 'where', 'whose'], 2, 'Thay cho nơi chốn → where.'],
      ['My uncle, ___ lives in Canada, is visiting us.', ['that', 'who', 'which', 'whose'], 1, 'Mệnh đề không xác định (có dấu phẩy) → who, không dùng that.'],
      ['Which sentence is correct?', ['The film which we saw it was good.', 'The film which we saw was good.', 'The film who we saw was good.', 'The film what we saw was good.'], 1, 'Không lặp lại tân ngữ it; film là vật → which.'],
      ['Do you remember the day ___ we met?', ['where', 'which', 'when', 'who'], 2, 'Thay cho thời gian → when.'],
      ['The pen ___ you lent me is broken.', ['who', 'whose', 'where', 'that'], 3, 'Thay cho vật, mệnh đề xác định → that (hoặc which).']
    ]
  });

  L('g9-conditional-2-wish', {
    grade: 9, icon: '💭', title: 'Câu điều kiện loại 2 và câu ước', sub: 'If + past simple, would + V / I wish...', level: 'Trung bình',
    summary: 'Nói về điều không có thật ở hiện tại và những mong ước.',
    sections: [
      { h: '1. Điều kiện loại 2 (không có thật ở hiện tại)', b: [
        { f: ['If + S + V2/V-ed (quá khứ đơn), S + would/could/might + V(bare)', 'If + S + were ... (dùng were cho tất cả các ngôi)'] },
        { p: '**If I were you, I would study harder.** (Thật ra mình không phải là bạn.) — **If I had a million dollars, I would travel the world.**' },
        { tip: '**If I were you...** là cách đưa ra lời khuyên rất thường dùng.' }
      ] },
      { h: '2. Câu ước ở hiện tại (wish)', b: [
        { f: ['S + wish + S + V2/V-ed / were  (ước điều không có thật ở hiện tại)', 'S + wish + S + would/could + V  (ước điều gì thay đổi / than phiền)'] },
        { ul: ['**I wish I had a bike.** (nhưng thực tế mình không có)', '**I wish I were taller.**', '**I wish I could swim.**', '**I wish it would stop raining.**'] },
        { warn: 'Trong mệnh đề **if** của loại 2 không dùng **would**: **If I would have time** là sai (phải là **If I had time**). Với **wish**, **would** chỉ dùng để than phiền hoặc mong một sự việc thay đổi (**I wish it would stop raining**), không dùng cho điều mong ước về chính bản thân mình.' }
      ] }
    ],
    ex: [['If I were you, I would study harder.', 'Nếu mình là bạn, mình sẽ học chăm hơn.'], ['If I had a million dollars, I would travel around the world.', 'Nếu có một triệu đô, mình sẽ đi du lịch vòng quanh thế giới.'], ['If she lived near here, we could meet every day.', 'Nếu cô ấy sống gần đây, chúng mình có thể gặp nhau mỗi ngày.'], ['What would you do if you won the lottery?', 'Bạn sẽ làm gì nếu trúng xổ số?'], ['I wish I had a bike.', 'Ước gì mình có một chiếc xe đạp.'], ['I wish I were taller.', 'Ước gì mình cao hơn.'], ['She wishes she could play the guitar.', 'Cô ấy ước gì mình biết chơi guitar.'], ['I wish it would stop raining.', 'Ước gì trời tạnh mưa.']],
    mis: [['If I would have money, I would buy a car.', 'If I had money, I would buy a car.', 'Mệnh đề if loại 2 dùng quá khứ đơn, không dùng would.'], ['If he studies harder, he would pass. (nói điều không có thật)', 'If he studied harder, he would pass.', 'Loại 2: quá khứ đơn + would.'], ['I wish I can fly.', 'I wish I could fly.', 'Sau wish lùi thì: can → could.'], ['I wish it stops raining.', 'I wish it would stop raining.', 'Mong sự thay đổi / than phiền → would + V.']],
    quiz: [
      ['If I ___ a bird, I would fly to you.', ['am', 'be', 'were', 'would be'], 2, 'Điều không có thật: If I were ...'],
      ['If she ___ more time, she would learn another language.', ['has', 'had', 'will have', 'would have'], 1, 'Loại 2: If + quá khứ đơn.'],
      ['What ___ you do if you saw a ghost?', ['will', 'would', 'did', 'are'], 1, 'Loại 2: mệnh đề chính dùng would.'],
      ['I wish I ___ speak French.', ['can', 'could', 'will', 'am able'], 1, 'Wish ở hiện tại: could.'],
      ['I am short. I wish I ___ taller.', ['am', 'were', 'will be', 'would be'], 1, 'Wish ở hiện tại dùng quá khứ đơn: I wish I were taller.'],
      ['If I were you, I ___ apologise to her.', ['will', 'would', 'did', 'am going to'], 1, 'If I were you, I would + V (lời khuyên).'],
      ['It is raining again. I wish it ___ stop.', ['will', 'would', 'can', 'did'], 1, 'Than phiền về điều đang xảy ra → would.'],
      ['If I won the competition, I ___ a trip to Japan.', ['will take', 'would take', 'take', 'am taking'], 1, 'If + quá khứ đơn, would + V.']
    ]
  });

  L('g9-reported-questions', {
    grade: 9, icon: '🗣️', title: 'Tường thuật câu hỏi và câu mệnh lệnh', sub: 'asked if/whether, wh-... / told ... to', level: 'Trung bình',
    summary: 'Thuật lại câu hỏi, lời yêu cầu và mệnh lệnh: trật tự từ như câu khẳng định, lùi thì.',
    sections: [
      { h: '1. Câu hỏi Yes/No', b: [
        { f: ['S + asked (+ O) + if/whether + S + V (lùi thì)'] },
        { p: '**"Do you like pizza?" → She asked me if/whether I liked pizza.** Trật tự như câu khẳng định (không đảo trợ động từ, không có dấu ?).' }
      ] },
      { h: '2. Câu hỏi Wh-', b: [
        { f: ['S + asked (+ O) + Wh-word + S + V (lùi thì)'] },
        { p: '**"Where do you live?" → He asked me where I lived.** — **"What are you doing?" → She asked what I was doing.**' }
      ] },
      { h: '3. Mệnh lệnh, yêu cầu, lời khuyên', b: [
        { f: ['S + told/asked/ordered/advised/warned + O + (not) + to V'] },
        { p: '**"Open the door," he said. → He told me to open the door.** — **"Don\'t be late," she said. → She told us not to be late.** — **"Please help me," he said. → He asked me to help him.**' },
        { tip: 'Đổi đại từ, trạng từ chỉ thời gian/nơi chốn giống câu tường thuật: now → then, today → that day, tomorrow → the next day, here → there.' }
      ] }
    ],
    ex: [['"Do you like pizza?" → She asked me if I liked pizza.', 'Cô ấy hỏi mình có thích pizza không.'], ['"Where do you live?" → He asked me where I lived.', 'Anh ấy hỏi mình sống ở đâu.'], ['"What are you doing?" → She asked what I was doing.', 'Cô ấy hỏi mình đang làm gì.'], ['"Have you finished?" → He asked whether I had finished.', 'Anh ấy hỏi mình đã xong chưa.'], ['"Open the window," the teacher said. → The teacher told us to open the window.', 'Cô giáo bảo chúng mình mở cửa sổ.'], ['"Don\'t touch it," he said. → He told me not to touch it.', 'Anh ấy bảo mình đừng chạm vào nó.'], ['"Please help me," Lan said. → Lan asked me to help her.', 'Lan nhờ mình giúp cô ấy.'], ['"When will you come back?" → She asked when I would come back.', 'Cô ấy hỏi khi nào mình quay lại.']],
    mis: [['She asked me where did I live.', 'She asked me where I lived.', 'Tường thuật câu hỏi không đảo trợ động từ.'], ['He asked me do I like tea.', 'He asked me if I liked tea.', 'Yes/No question → if/whether + S + V.'], ['She told me don\'t be late.', 'She told me not to be late.', 'Mệnh lệnh phủ định: not to V.'], ['He asked if was I tired.', 'He asked if I was tired.', 'Không đảo ngữ.']],
    quiz: [
      ['"Where do you live?" → She asked me where ___.', ['do I live', 'I lived', 'live I', 'did I live'], 1, 'Không đảo, lùi thì: I lived.'],
      ['"Are you tired?" → He asked me ___ tired.', ['that I was', 'if I was', 'was I', 'if was I'], 1, 'Yes/No question → if + S + V.'],
      ['"Close the door," she said. → She told me ___ the door.', ['close', 'closing', 'to close', 'that I close'], 2, 'told + O + to V.'],
      ['"Don\'t talk in class," the teacher said. → The teacher told us ___ in class.', ["don't talk", 'not to talk', 'to not talking', 'no talk'], 1, 'not to V.'],
      ['"What is your name?" → He asked me ___.', ['what my name were', 'what was my name', 'what my name was', 'what is my name'], 2, 'Lùi thì và không đảo: what my name was.'],
      ['"Will you come to my party?" → She asked me ___ to her party.', ['will I come', 'if I would come', 'that I would come', 'did I come'], 1, 'will → would; Yes/No question → if.'],
      ['"Please lend me your pen," he said. → He asked me ___ him my pen.', ['lend', 'to lend', 'lending', 'if lend'], 1, 'asked + O + to V.'],
      ['"How old are you?" → She asked me how old ___.', ['I was', 'was I', 'am I', 'I were'], 0, 'Lùi thì, không đảo: how old I was.']
    ]
  });

  L('g9-passive-extended', {
    grade: 9, icon: '🛠️', title: 'Bị động mở rộng', sub: 'Perfect, modal, continuous, questions', level: 'Trung bình',
    summary: 'Bị động với hiện tại hoàn thành, động từ khuyết thiếu, thì tiếp diễn và câu hỏi.',
    sections: [
      { h: '1. Các dạng bị động', b: [
        { t: { h: ['Thì / cấu trúc', 'Bị động', 'Ví dụ'], r: [['Hiện tại hoàn thành', 'have/has been + V3', 'The house has been sold.'], ['Hiện tại tiếp diễn', 'am/is/are being + V3', 'The road is being repaired.'], ['Quá khứ tiếp diễn', 'was/were being + V3', 'The bridge was being built.'], ['Động từ khuyết thiếu', 'modal + be + V3', 'This work must be finished today.'], ['be going to', 'be going to be + V3', 'A new mall is going to be opened.']] } }
      ] },
      { h: '2. Câu hỏi và phủ định ở bị động', b: [
        { ul: ['**Was the window broken by Tom?**', '**When was this temple built?**', '**The letters have not been posted yet.**'] },
        { tip: 'Câu có hai tân ngữ có thể có hai bị động: **She gave me a book. → I was given a book. / A book was given to me.**' }
      ] }
    ],
    ex: [['The house has been sold.', 'Ngôi nhà đã được bán.'], ['The road is being repaired at the moment.', 'Con đường đang được sửa chữa lúc này.'], ['This work must be finished today.', 'Công việc này phải được hoàn thành hôm nay.'], ['A new shopping mall is going to be built here.', 'Một trung tâm mua sắm mới sẽ được xây ở đây.'], ['The bridge was being built when I visited.', 'Cây cầu đang được xây khi mình đến thăm.'], ['When was this temple built?', 'Ngôi chùa này được xây khi nào?'], ["The letters haven't been posted yet.", 'Những bức thư vẫn chưa được gửi đi.'], ['I was given a present for my birthday.', 'Mình được tặng một món quà vào sinh nhật.']],
    mis: [['The problem must solve soon.', 'The problem must be solved soon.', 'modal + be + V3.'], ['The road is been repaired.', 'The road is being repaired.', 'Hiện tại tiếp diễn bị động: is being + V3.'], ['The house has built recently.', 'The house has been built recently.', 'have/has been + V3.'], ['The rooms are cleaning now.', 'The rooms are being cleaned now.', 'Đối tượng bị tác động → are being cleaned.']],
    quiz: [
      ['The house ___ since last year.', ['has sold', 'has been sold', 'is sold', 'was been sold'], 1, 'Hiện tại hoàn thành bị động: has been sold.'],
      ['Be quiet! The baby ___ to sleep.', ['is being put', 'is putting', 'has put', 'put'], 0, 'Đang diễn ra, bị động: is being put.'],
      ['This homework ___ by tomorrow.', ['must finish', 'must be finished', 'must finished', 'must is finished'], 1, 'modal + be + V3.'],
      ['The streets ___ at the moment.', ['are cleaned', 'are being cleaned', 'were cleaned', 'have cleaned'], 1, 'at the moment → are being cleaned.'],
      ['___ the letters been posted yet?', ['Have', 'Has', 'Are', 'Did'], 0, 'letters số nhiều, hiện tại hoàn thành bị động: Have the letters been posted yet?'],
      ['A new hospital is going ___ next year.', ['to build', 'to be built', 'to be building', 'building'], 1, 'be going to be + V3.'],
      ['The bridge ___ when the storm came.', ['was being built', 'was building', 'is being built', 'has been built'], 0, 'Quá khứ tiếp diễn bị động: was being built.'],
      ['Chuyển bị động: "They have repaired my bike."', ['My bike has been repaired.', 'My bike was repaired.', 'My bike has repaired.', 'My bike is repaired.'], 0, 'have repaired → has been repaired.']
    ]
  });

  L('g9-used-to', {
    grade: 9, icon: '⏪', title: 'used to, be used to, get used to', sub: 'Thói quen trong quá khứ và sự quen với điều gì', level: 'Trung bình',
    summary: 'Phân biệt used to + V với be/get used to + V-ing.',
    sections: [
      { h: '1. used to + V (thói quen/trạng thái trong quá khứ, nay không còn)', b: [
        { f: ['(+) S + used to + V(bare)', "(-) S + didn't use to + V(bare)", '(?) Did + S + use to + V(bare)?'] },
        { p: '**I used to live in Hue.** (bây giờ không còn sống ở đó) — **She didn\'t use to like coffee.** — **Did you use to play football?**' }
      ] },
      { h: '2. be used to / get used to + V-ing hoặc danh từ (quen với)', b: [
        { f: ['be used to + V-ing / N  (đã quen với)', 'get used to + V-ing / N  (dần trở nên quen với)'] },
        { p: '**I am used to getting up early.** (mình đã quen) — **He is getting used to the cold weather.** (đang dần quen)' },
        { warn: '**used to + V** (thói quen quá khứ) khác **be used to + V-ing** (quen với). Chú ý: **I used to walk** (ngày xưa mình thường đi bộ) ≠ **I am used to walking** (mình quen đi bộ).' },
        { tip: 'Với thói quen lặp lại trong quá khứ (không phải trạng thái) có thể dùng **would**: **When I was a child, we would go fishing every summer.**' }
      ] }
    ],
    ex: [['I used to live in Hue when I was a child.', 'Hồi nhỏ mình từng sống ở Huế.'], ["She didn't use to like coffee.", 'Trước đây cô ấy không thích cà phê.'], ['Did you use to play football?', 'Trước đây bạn có hay chơi bóng đá không?'], ['I am used to getting up early.', 'Mình đã quen dậy sớm.'], ['He is getting used to the hot weather.', 'Anh ấy đang dần quen với thời tiết nóng.'], ['We used to have a dog, but it died.', 'Nhà mình từng có một con chó nhưng nó đã chết.'], ["My grandfather isn't used to using smartphones.", 'Ông mình chưa quen dùng điện thoại thông minh.'], ['It took me a month to get used to the new school.', 'Mình mất một tháng để quen với ngôi trường mới.']],
    mis: [['I used to going to the beach.', 'I used to go to the beach.', 'used to + V nguyên mẫu.'], ["I'm used to get up early.", "I'm used to getting up early.", 'be used to + V-ing.'], ["He didn't used to smoke.", "He didn't use to smoke.", "Sau didn't dùng use (không có d)."], ['She is used to live alone.', 'She is used to living alone.', 'be used to + V-ing.']],
    quiz: [
      ['When I was a child, I ___ in a small village.', ['used to live', 'am used to living', 'got used to live', 'use to living'], 0, 'Thói quen/trạng thái trong quá khứ → used to live.'],
      ["I am used to ___ up early.", ['get', 'getting', 'got', 'gets'], 1, 'be used to + V-ing.'],
      ["She ___ like spicy food, but now she loves it.", ["didn't used to", "didn't use to", "doesn't use to", "isn't used to"], 1, "Phủ định của used to: didn't use to."],
      ['It was difficult at first, but now I have got used ___ the cold weather.', ['to', 'for', 'with', 'of'], 0, 'get used to + N/V-ing.'],
      ['My grandfather ___ smoke, but he stopped ten years ago.', ['was used to', 'used to', 'is used to', 'uses to'], 1, 'Thói quen quá khứ nay đã bỏ → used to smoke.'],
      ['___ you use to play the piano when you were young?', ['Do', 'Did', 'Are', 'Were'], 1, 'Câu hỏi: Did you use to ...?'],
      ["He isn't used to ___ with chopsticks.", ['eat', 'eating', 'ate', 'eaten'], 1, 'be used to + V-ing.'],
      ['Which sentence means "I am accustomed to getting up early"?', ['I used to get up early.', 'I am used to getting up early.', 'I used to getting up early.', 'I use to get up early.'], 1, 'be used to + V-ing = quen với.']
    ]
  });

  L('g9-clauses', {
    grade: 9, icon: '🧩', title: 'Mệnh đề chỉ mục đích, kết quả và nhượng bộ', sub: 'to / in order to / so that · so...that · such...that · although', level: 'Trung bình',
    summary: 'Nối câu để nói mục đích, kết quả và sự tương phản.',
    sections: [
      { h: '1. Mục đích', b: [
        { ul: ['**to V / in order to V / so as to V**: **I study hard to pass the exam.** — phủ định: **in order not to / so as not to**.', '**so that + S + can/could/will/would + V**: **I study hard so that I can pass the exam.**'] }
      ] },
      { h: '2. Kết quả', b: [
        { f: ['S + be/V + so + adj/adv + that + S + V', 'S + be + such + (a/an) + (adj) + N + that + S + V', 'S + be + too + adj + (for O) + to V', 'S + be + adj + enough + (for O) + to V'] },
        { p: '**The test was so difficult that nobody passed.** — **It was such a difficult test that nobody passed.** — **She is too young to drive.** — **He is old enough to vote.**' },
        { tip: 'Chú ý vị trí: **adj + enough** (tall enough), nhưng **enough + noun** (enough money).' }
      ] },
      { h: '3. Nhượng bộ (tương phản)', b: [
        { ul: ['**although / though / even though + S + V**: **Although he was tired, he kept working.**', '**despite / in spite of + N / V-ing**: **Despite being tired, he kept working.**', '**However / Nevertheless,** (trạng từ liên kết, có dấu phẩy): **He was tired. However, he kept working.**'] },
        { warn: 'Không dùng **but** cùng **although**: **Although it rained, but we went out** là sai.' }
      ] }
    ],
    ex: [['I study hard to pass the exam.', 'Mình học chăm để đỗ kỳ thi.'], ['He ran quickly in order not to be late.', 'Cậu ấy chạy nhanh để không bị muộn.'], ['She speaks slowly so that everyone can understand.', 'Cô ấy nói chậm để mọi người đều hiểu.'], ['The test was so difficult that nobody passed.', 'Bài kiểm tra khó đến mức không ai đỗ.'], ['It was such a hot day that we stayed inside.', 'Đó là một ngày nóng đến mức chúng mình ở trong nhà.'], ['She is too young to drive a car.', 'Cô bé còn quá nhỏ để lái xe.'], ['He is tall enough to play basketball.', 'Cậu ấy đủ cao để chơi bóng rổ.'], ['Although it rained heavily, we went out.', 'Mặc dù trời mưa to, chúng mình vẫn ra ngoài.']],
    mis: [['Despite he was tired, he kept working.', 'Although he was tired, he kept working. / Despite being tired, he kept working.', 'despite + N/V-ing; although + mệnh đề.'], ['It was so a nice day that we went out.', 'It was such a nice day that we went out.', 'such + a/an + adj + N.'], ['She is enough tall to join the team.', 'She is tall enough to join the team.', 'adj + enough.'], ['Although it rained, but we went out.', 'Although it rained, we went out.', 'Không dùng although và but cùng lúc.'], ['He studies hard so that to pass the exam.', 'He studies hard so that he can pass the exam. / He studies hard to pass the exam.', 'so that + S + can/will + V (có mệnh đề); không dùng so that + to V.']],
    quiz: [
      ['I got up early ___ catch the first bus.', ['for', 'so that', 'in order to', 'because'], 2, 'in order to + V chỉ mục đích.'],
      ['It was ___ a good film that I watched it twice.', ['so', 'such', 'too', 'very'], 1, 'such + a + adj + N + that.'],
      ['The coffee was ___ hot that I couldn\'t drink it.', ['so', 'such', 'too', 'enough'], 0, 'so + adj + that.'],
      ['___ it was cold, he went swimming.', ['Despite', 'In spite of', 'Although', 'However'], 2, 'Although + mệnh đề (S + V).'],
      ['She is ___ to carry this heavy bag.', ['enough strong', 'strong enough', 'too strong', 'so strong'], 1, 'adj + enough + to V.'],
      ['He was ___ tired to walk any further.', ['so', 'such', 'too', 'enough'], 2, 'too + adj + to V.'],
      ['___ the heavy rain, we had a picnic.', ['Although', 'Despite', 'However', 'Even though'], 1, 'Despite + cụm danh từ.'],
      ['She speaks slowly ___ we can understand her.', ['in order to', 'so as to', 'so that', 'because of'], 2, 'so that + S + can + V.']
    ]
  });

  L('g9-so-such-too-enough', {
    grade: 9, icon: '📐', title: 'so … that, such … that, too … to, enough … to', sub: 'Degree & result structures', level: 'Trung bình',
    summary: 'Diễn đạt mức độ và kết quả: quá … đến nỗi …, đủ … để …, quá … không thể ….',
    sections: [
      { h: '1. so … that và such … that', b: [
        { f: ['S + V + **so** + adj/adv + **that** + S + V', 'S + V + **such** + (a/an) + (adj) + noun + **that** + S + V'] },
        { p: '**The film was so boring that we left early.** = **It was such a boring film that we left early.** · **He ran so fast that nobody could catch him.**' },
        { t: { h: ['', 'so', 'such'], r: [['Theo sau', 'tính từ / trạng từ', '(a/an) + (tính từ) + danh từ'], ['Ví dụ', 'so tired', 'such a tired boy / such tired boys / such bad weather'], ['Nhớ', 'so + adj; so many/much + noun', 'such + danh từ có/không a']] } },
        { tip: 'Với danh từ số nhiều/không đếm được: **such nice people**, **such good news** (không dùng a/an). Với **many/much/few/little**: dùng **so**: **so many books that…**' }
      ] },
      { h: '2. too … to và enough … to', b: [
        { t: { h: ['Cấu trúc', 'Nghĩa', 'Ví dụ'], r: [['**too + adj/adv + (for sb) + to V**', 'quá … không thể …', 'The tea is **too hot** (for me) **to drink**.'], ['**adj/adv + enough + (for sb) + to V**', 'đủ … để …', 'She is **old enough to** drive.'], ['**enough + noun + to V**', 'đủ … để …', 'We have **enough money to** buy it.'], ['**not + adj + enough + to V**', 'không đủ … để …', 'He isn\'t **strong enough to** lift it.']] } },
        { warn: '**enough** đứng **sau** tính từ/trạng từ (old enough) nhưng **trước** danh từ (enough money). Khác với **too** luôn đứng **trước** tính từ.' }
      ] },
      { h: '3. Chuyển đổi câu', b: [
        { ul: ['**too … to** = **so … that … can\'t**: The box is **too heavy to lift**. = The box is **so heavy that I can\'t lift it.**', '**adj + enough to** = **so adj that … can**: She is **tall enough to reach** the shelf. = She is **so tall that she can reach** the shelf.', 'Khi dùng **that**-clause giữ nguyên chủ ngữ riêng, đừng lặp tân ngữ ở **too…to**: ✗ too heavy to lift it → ✓ too heavy to lift.'] }
      ] }
    ],
    ex: [
      ['The soup was so hot that I couldn\'t eat it.', 'Món súp nóng đến nỗi mình không ăn nổi.'], ['It was such a long journey that we were exhausted.', 'Chuyến đi dài đến mức chúng mình kiệt sức.'], ['He is too young to drive a car.', 'Cậu ấy còn quá trẻ để lái xe.'],
      ['She is old enough to travel alone.', 'Cô ấy đủ lớn để đi một mình.'], ['We didn\'t have enough time to finish the test.', 'Chúng mình không đủ thời gian làm xong bài kiểm tra.'], ['It was such nice weather that we went to the beach.', 'Thời tiết đẹp đến mức chúng mình ra biển.'],
      ['There were so many people that we couldn\'t find a seat.', 'Đông người đến nỗi chúng mình không tìm được chỗ ngồi.'], ['The bag is too heavy for me to carry.', 'Chiếc túi quá nặng, mình không xách nổi.'], ['Is the water warm enough to swim in?', 'Nước có đủ ấm để bơi không?']
    ],
    mis: [
      ['It was so a beautiful day that we went out.', 'It was such a beautiful day that we went out.', 'so + adj; such + a + adj + noun.'], ['She is enough old to drive.', 'She is old enough to drive.', 'enough đứng sau tính từ.'], ['The tea is too hot to drink it.', 'The tea is too hot to drink.', 'Không lặp tân ngữ sau to V ở cấu trúc too…to.'],
      ['He has too much money to buy a house. (ý: đủ tiền)', 'He has enough money to buy a house.', 'too mang nghĩa tiêu cực "quá", đủ → enough.'], ['It was such delicious that we ate all.', 'It was so delicious that we ate it all.', 'Sau such cần danh từ; delicious là tính từ → dùng so.']
    ],
    quiz: [
      ['The film was ___ boring that we left early.', ['such', 'so', 'too', 'enough'], 1, 'so + adj + that.'],
      ['It was ___ hot day that nobody wanted to go out.', ['so', 'such a', 'too', 'such'], 1, 'such a + adj + noun.'],
      ['He is ___ young to join the army.', ['so', 'enough', 'too', 'such'], 2, 'too young to … = quá trẻ để.'],
      ['She is tall ___ to play basketball.', ['enough', 'too', 'so', 'such'], 0, 'adj + enough + to V.'],
      ['We have ___ money to buy a new car.', ['enough', 'so', 'too', 'such'], 0, 'enough + noun + to V.'],
      ['There were ___ many people that we had to wait outside.', ['such', 'too', 'so', 'enough'], 2, 'so many + noun + that.'],
      ['The coffee is too hot ___.', ['to drink it', 'for drinking it', 'to drink', 'that I drink'], 2, 'too + adj + to V (không lặp it).'],
      ['It was ___ interesting a book that I read it twice.', ['so', 'such', 'too', 'enough'], 0, 'so + adj + a + noun (cấu trúc đảo): so interesting a book.'],
      ['The question was ___ difficult for me to answer.', ['too', 'enough', 'such', 'so'], 0, 'too difficult for me to answer.']
    ]
  });

  L('g9-present-perfect-vs-past-simple', {
    grade: 9, icon: '🆚', title: 'Hiện tại hoàn thành và quá khứ đơn', sub: 'Present Perfect vs Past Simple', level: 'Trung bình',
    summary: 'Phân biệt khi nào dùng hiện tại hoàn thành (nối với hiện tại) và quá khứ đơn (đã kết thúc, có mốc thời gian).',
    sections: [
      { h: '1. Quy tắc phân biệt', b: [
        { t: { h: ['', 'Past simple', 'Present perfect'], r: [['Cấu trúc', 'V2/V-ed', 'have/has + V3'], ['Thời gian', 'xác định, đã kết thúc: yesterday, last year, in 2020, two days ago, when I was five', 'không nói rõ / còn liên quan hiện tại: already, yet, ever, never, just, since, for, so far, recently'], ['Ý nghĩa', 'hành động xong hẳn', 'kết quả, trải nghiệm, kéo dài đến nay'], ['Ví dụ', 'I **visited** Hue **last year**.', 'I **have visited** Hue **twice**.']] } },
        { tip: 'Mẹo: nếu câu có **mốc quá khứ cụ thể** (yesterday, last week, in 2019, ago) → **past simple**. Nếu hỏi **đã từng chưa / bao lâu / xong chưa** → **present perfect**.' }
      ] },
      { h: '2. Since, for, ago', b: [
        { ul: ['**for + khoảng thời gian**: I have lived here **for** five years.', '**since + mốc thời gian**: I have lived here **since** 2019.', '**ago + past simple**: I moved here five years **ago**. (✗ have moved five years ago)', 'Câu hỏi: **How long have you lived here?** (present perfect) — **When did you move here?** (past simple)'] },
        { warn: 'Không dùng present perfect với mốc thời gian đã kết thúc: ✗ I have seen him yesterday. → ✓ I saw him yesterday.' }
      ] },
      { h: '3. Trải nghiệm và kết quả', b: [
        { ul: ['**Trải nghiệm** (không nói khi nào): **Have you ever been to Japan?** — Yes, I have. → Nếu hỏi tiếp chi tiết, chuyển past simple: **When did you go?** — I went there in 2022.', '**Kết quả ở hiện tại**: **I have lost my keys.** (bây giờ chưa tìm thấy) / **I lost my keys yesterday.** (chuyện đã qua).', '**This is the first time …** + present perfect: **This is the first time I have eaten sushi.**'] }
      ] }
    ],
    ex: [
      ['I have lived in Hanoi for ten years.', 'Mình đã sống ở Hà Nội mười năm rồi.'], ['She moved to Hue in 2018.', 'Cô ấy chuyển đến Huế năm 2018.'], ['Have you ever eaten snails? — Yes, I have.', 'Bạn đã từng ăn ốc chưa? — Rồi.'],
      ['We saw that film last weekend.', 'Cuối tuần trước chúng mình đã xem bộ phim đó.'], ['He has just finished his homework.', 'Cậu ấy vừa làm xong bài tập.'], ['I haven\'t seen her since Monday.', 'Mình chưa gặp cô ấy từ hôm Thứ Hai.'],
      ['When did you start learning English? — Five years ago.', 'Bạn bắt đầu học tiếng Anh khi nào? — Năm năm trước.'], ['This is the first time I have ridden a horse.', 'Đây là lần đầu tiên mình cưỡi ngựa.'], ['They have already left, so we can\'t say goodbye.', 'Họ đã đi rồi nên chúng ta không chào tạm biệt được.']
    ],
    mis: [
      ['I have seen him yesterday.', 'I saw him yesterday.', 'yesterday là mốc quá khứ → past simple.'], ['I live here since 2019.', 'I have lived here since 2019.', 'since + present perfect.'], ['She has moved here five years ago.', 'She moved here five years ago.', 'ago đi với past simple.'],
      ['When have you visited Paris?', 'When did you visit Paris?', 'Câu hỏi when dùng past simple.']
    ],
    quiz: [
      ['I ___ my keys yesterday and found them this morning.', ['lost', 'have lost', 'lose', 'has lost'], 0, 'yesterday → past simple.'],
      ['She has lived in this town ___ 2015.', ['for', 'since', 'ago', 'in'], 1, 'since + mốc thời gian.'],
      ['How long ___ you learned English?', ['did', 'have', 'do', 'are'], 1, 'How long + present perfect (kéo dài đến nay).'],
      ['We ___ to Da Lat two years ago.', ['have been', 'went', 'go', 'have gone'], 1, 'ago → past simple.'],
      ['He ___ his homework yet.', ['hasn\'t finished', 'didn\'t finished', 'doesn\'t finish', 'wasn\'t finish'], 0, 'yet → present perfect: hasn\'t finished.'],
      ['I have never ___ sushi before.', ['eaten', 'ate', 'eating', 'eat'], 0, 'have never + V3 (eaten).'],
      ['When ___ you visit the museum?', ['have', 'did', 'do', 'are'], 1, 'When → past simple: did you visit.'],
      ['This is the first time she ___ a plane.', ['took', 'has taken', 'takes', 'was taking'], 1, 'the first time → present perfect.'],
      ['They ___ here for three years now.', ['lived', 'have lived', 'live', 'are living'], 1, 'for + khoảng thời gian đến nay → have lived.']
    ]
  });

  L('g9-compound-adjectives-order', {
    grade: 9, icon: '🧱', title: 'Tính từ ghép và thứ tự các tính từ', sub: 'Compound adjectives & adjective order', level: 'Trung bình',
    summary: 'Tạo tính từ ghép (a ten-minute walk, a well-known writer) và sắp xếp nhiều tính từ theo thứ tự tự nhiên.',
    sections: [
      { h: '1. Tính từ ghép', b: [
        { t: { h: ['Mẫu', 'Ví dụ', 'Nghĩa'], r: [['số + danh từ (số ít) + (-ed)', 'a **ten-minute** walk, a **five-year-old** girl, a **two-storey** house', 'một quãng đi bộ 10 phút…'], ['tính từ + danh từ + -ed', 'a **kind-hearted** man, **blue-eyed** children', 'tốt bụng, mắt xanh'], ['trạng từ + V3', 'a **well-known** singer, a **newly-built** school', 'nổi tiếng, mới xây'], ['danh từ + V-ing', 'an **English-speaking** country, a **time-consuming** job', 'nói tiếng Anh, tốn thời gian'], ['danh từ + V3', '**hand-made** soap, **sun-dried** fish', 'làm bằng tay, phơi nắng']] } },
        { warn: 'Trong tính từ ghép có số, danh từ **luôn ở số ít**, không thêm s: ✓ a **ten-minute** walk (✗ ten-minutes). So sánh: The walk takes ten **minutes**.' }
      ] },
      { h: '2. Thứ tự của nhiều tính từ (OSASCOMP)', b: [
        { t: { h: ['Thứ tự', 'Loại', 'Ví dụ'], r: [['1', 'Opinion (ý kiến)', 'lovely, nice, terrible'], ['2', 'Size (kích thước)', 'big, small, tall'], ['3', 'Age (tuổi)', 'old, new, young'], ['4', 'Shape (hình dạng)', 'round, square'], ['5', 'Colour (màu)', 'red, blue'], ['6', 'Origin (nguồn gốc)', 'Vietnamese, French'], ['7', 'Material (chất liệu)', 'wooden, silk'], ['8', 'Purpose (mục đích)', 'running (shoes), sleeping (bag)']] } },
        { p: 'Ví dụ: **a beautiful small old round brown Vietnamese wooden table**. Thực tế chỉ dùng 2–3 tính từ: **a lovely old wooden house**, **a big black dog**.' }
      ] },
      { h: '3. Lưu ý dùng đúng', b: [
        { ul: ['Giữa các tính từ cùng loại dùng dấu phẩy hoặc **and**: a **tall, handsome** man; a **tall and handsome** man. Sau động từ liên kết (be, seem) dùng **and** trước tính từ cuối: She is **tall, kind and clever**.', 'Tính từ ghép dùng trước danh từ thường viết có **gạch nối**; sau **be** có thể bỏ: **a well-known writer** / The writer is **well known**.', 'Không dùng **a** + tính từ ghép số nhiều: ✗ a three-days trip → ✓ **a three-day trip**.'] }
      ] }
    ],
    ex: [
      ['It\'s a ten-minute walk to the station.', 'Đi bộ đến ga mất mười phút.'], ['She is a five-year-old girl.', 'Cô bé năm tuổi.'], ['He is a well-known writer in Viet Nam.', 'Ông ấy là nhà văn nổi tiếng ở Việt Nam.'],
      ['They live in a two-storey house.', 'Họ sống trong một ngôi nhà hai tầng.'], ['We bought some hand-made souvenirs.', 'Chúng mình mua vài món quà lưu niệm làm bằng tay.'], ['She wore a lovely long red silk dress.', 'Cô ấy mặc một chiếc váy lụa đỏ dài rất đẹp.'],
      ['It was a time-consuming project.', 'Đó là một dự án tốn nhiều thời gian.'], ['He has a big old brown leather bag.', 'Anh ấy có chiếc cặp da nâu to và cũ.'], ['This is an English-speaking country.', 'Đây là một quốc gia nói tiếng Anh.']
    ],
    mis: [
      ['a ten-minutes walk', 'a ten-minute walk', 'Danh từ trong tính từ ghép giữ số ít.'], ['a red big car', 'a big red car', 'Kích thước đứng trước màu sắc.'], ['a three-days trip', 'a three-day trip', 'Không thêm s trong tính từ ghép.'],
      ['a wooden old table', 'an old wooden table', 'Tuổi trước chất liệu.'], ['a good-looked boy', 'a good-looking boy', 'Dùng V-ing: good-looking.']
    ],
    quiz: [
      ['It is a ___ walk from here.', ['five-minutes', 'five-minute', 'five minute\'s', 'five-minuted'], 1, 'Danh từ số ít trong tính từ ghép.'],
      ['She has a ___ dog.', ['brown big', 'big brown', 'brown-big', 'bigs brown'], 1, 'Size → colour.'],
      ['He is a ___ singer; everyone knows him.', ['well-knowing', 'well-known', 'well-know', 'known-well'], 1, 'well-known (trạng từ + V3).'],
      ['We went on a ___ trip to Sa Pa.', ['three-day', 'three-days', 'three day\'s', 'third-day'], 0, 'three-day trip.'],
      ['They live in a ___ house.', ['two-storeys', 'two-storey', 'second-storey', 'two-storied'], 1, 'two-storey house.'],
      ['Which order is correct?', ['a wooden old table', 'an old wooden table', 'a table old wooden', 'a wooden table old'], 1, 'Age → material.'],
      ['My grandfather is a ___ man.', ['kind-hearted', 'kind-heart', 'kindly-heart', 'kind-hearts'], 0, 'kind-hearted (adj + noun-ed).'],
      ['It was a ___ job and I got tired.', ['time-consumed', 'time-consuming', 'time-consume', 'time-consumes'], 1, 'time-consuming (danh từ + V-ing).'],
      ['She bought a ___ dress.', ['red lovely silk', 'lovely red silk', 'silk lovely red', 'red silk lovely'], 1, 'Opinion → colour → material.']
    ]
  });

  L('g9-correlative-conjunctions', {
    grade: 9, icon: '🔀', title: 'both…and, either…or, neither…nor, not only…but also', sub: 'Correlative conjunctions', level: 'Trung bình',
    summary: 'Dùng các cặp liên từ đi đôi để liệt kê, lựa chọn, phủ định kép và nhấn mạnh; chú ý cấu trúc song song và hòa hợp động từ.',
    sections: [
      { h: '1. Bốn cặp liên từ', b: [
        { t: { h: ['Cặp', 'Nghĩa', 'Ví dụ'], r: [['**both … and …**', 'cả … lẫn …', 'He speaks **both** English **and** French.'], ['**either … or …**', 'hoặc … hoặc … (một trong hai)', 'You can **either** call me **or** send an email.'], ['**neither … nor …**', 'không … cũng không …', '**Neither** Tom **nor** Anna came.'], ['**not only … but also …**', 'không những … mà còn …', 'She is **not only** smart **but also** kind.']] } },
        { tip: '**both…and** chỉ dùng cho **hai** đối tượng. Sau **neither…nor** và **either…or** động từ **không cần phủ định thêm**: **Neither** of us **knows** (✗ doesn\'t know).' }
      ] },
      { h: '2. Cấu trúc song song', b: [
        { p: 'Hai thành phần sau hai nửa của cặp liên từ **phải cùng loại**: cùng danh từ / cùng tính từ / cùng động từ / cùng cụm giới từ.' },
        { ul: ['✓ He is **both** a teacher **and** a writer. (hai danh từ)', '✗ He is both a teacher and writes books. → ✓ He **both teaches and writes** books.', '✓ I like **neither** coffee **nor** tea. · ✗ I neither like coffee nor tea. → ✓ I **neither like** coffee **nor drink** tea (hai động từ).'] }
      ] },
      { h: '3. Hòa hợp chủ ngữ – động từ', b: [
        { ul: ['**both A and B** + động từ **số nhiều**: **Both** Tom **and** Lan **are** here.', '**either A or B / neither A nor B**: động từ hòa hợp với **chủ ngữ gần động từ nhất**: **Either** the students **or** the teacher **is** wrong. · **Neither** he **nor** his parents **know**.', '**not only A but also B**: động từ theo B: **Not only** the teacher **but also** the students **were** surprised.'] },
        { warn: '**not only** đứng đầu câu thì **đảo ngữ**: **Not only did she win, but she also broke the record.**' }
      ] }
    ],
    ex: [
      ['Both my brother and I like football.', 'Cả anh mình và mình đều thích bóng đá.'], ['You can either stay here or go home.', 'Bạn có thể ở lại đây hoặc về nhà.'], ['Neither Tom nor Anna was late.', 'Cả Tom lẫn Anna đều không đến muộn.'],
      ['She is not only beautiful but also intelligent.', 'Cô ấy không những xinh đẹp mà còn thông minh.'], ['He can both sing and dance.', 'Cậu ấy vừa hát vừa nhảy giỏi.'], ['I have neither time nor money for that trip.', 'Mình không có thời gian cũng không có tiền cho chuyến đi đó.'],
      ['Either you apologise or I will leave.', 'Hoặc bạn xin lỗi hoặc mình sẽ đi.'], ['Not only the children but also their parents enjoyed the show.', 'Không chỉ trẻ em mà cả bố mẹ cũng thích buổi biểu diễn.'], ['Both the book and the film are interesting.', 'Cả quyển sách lẫn bộ phim đều thú vị.']
    ],
    mis: [
      ['Both Tom or Anna can come.', 'Both Tom and Anna can come.', 'both đi với and.'], ['Neither he doesn\'t nor she knows.', 'Neither he nor she knows.', 'neither…nor đã mang nghĩa phủ định.'], ['He is not only a doctor but also writes novels.', 'He is not only a doctor but also a novelist.', 'Hai nửa phải song song.'],
      ['Either you or I are wrong.', 'Either you or I am wrong.', 'Động từ hòa hợp với chủ ngữ gần nhất (I → am).'], ['She not only sings but dances also.', 'She not only sings but also dances.', 'Dùng cặp not only…but also.']
    ],
    quiz: [
      ['___ Tom and Mai are good at English.', ['Neither', 'Both', 'Either', 'Not only'], 1, 'both … and.'],
      ['You can ___ pay by cash or by card.', ['neither', 'both', 'either', 'not only'], 2, 'either … or.'],
      ['He speaks ___ French nor German.', ['both', 'either', 'neither', 'not only'], 2, 'neither … nor.'],
      ['She is not only kind ___ also funny.', ['and', 'but', 'or', 'nor'], 1, 'not only … but also.'],
      ['Neither my father nor my mother ___ English.', ['speak', 'speaks', 'are speaking', 'speaking'], 1, 'chủ ngữ gần động từ: mother → speaks.'],
      ['Either the teachers or the principal ___ coming.', ['are', 'is', 'were', 'be'], 1, 'principal số ít → is.'],
      ['Both the girls and the boy ___ the winners.', ['is', 'are', 'was', 'be'], 1, 'both … and → số nhiều.'],
      ['Which sentence is parallel?', ['He neither smokes nor is drinking.', 'He neither smokes nor drinks.', 'He neither smokes nor to drink.', 'He neither smoking nor drinks.'], 1, 'smokes / drinks cùng loại.'],
      ['Not only ___ she smart, but she was also kind.', ['is', 'was', 'does', 'did'], 1, 'Đảo ngữ với be quá khứ: Not only was she smart…']
    ]
  });

  L('g9-phrasal-verbs-intermediate', {
    grade: 9, icon: '🧷', title: 'Cụm động từ thường gặp (nâng cao)', sub: 'Phrasal verbs – intermediate', level: 'Trung bình',
    summary: 'Học thêm các cụm động từ hay xuất hiện trong bài đọc và đề thi: carry on, run out of, put off, take up, break down, turn down…',
    sections: [
      { h: '1. Nhóm theo chủ đề', b: [
        { t: { h: ['Chủ đề', 'Cụm động từ', 'Nghĩa'], r: [['Kế hoạch & thời gian', 'put off', 'trì hoãn (to delay)'], ['', 'carry on', 'tiếp tục (to continue)'], ['', 'call off', 'huỷ bỏ'], ['', 'set up', 'thành lập, thiết lập'], ['Sở thích & thói quen', 'take up', 'bắt đầu theo đuổi (một môn)'], ['', 'cut down on', 'giảm bớt'], ['', 'give up', 'từ bỏ'], ['Vấn đề & giải quyết', 'break down', 'hỏng (xe/máy)'], ['', 'work out', 'tìm ra cách / tập luyện'], ['', 'sort out', 'giải quyết'], ['Lời đề nghị', 'turn down', 'từ chối'], ['', 'run out of', 'cạn kiệt, hết'], ['', 'come up with', 'nghĩ ra']] } }
      ] },
      { h: '2. Cấu trúc và vị trí tân ngữ', b: [
        { ul: ['**Cụm tách được**: put **off** the meeting = put the meeting **off** (đại từ ở giữa: put **it** off).', '**Cụm không tách**: run **out of** money, come **up with** an idea, cut **down on** sugar, look **forward to** (+ V-ing).', 'Cụm ba từ luôn đi với tân ngữ sau: **get on with** (hoà hợp), **look up to** (kính trọng), **put up with** (chịu đựng).'] },
        { warn: '**look forward to** + **V-ing/danh từ** (to là giới từ): ✓ I look forward to **meeting** you. ✗ look forward to meet.' }
      ] },
      { h: '3. Phân biệt dễ nhầm', b: [
        { t: { h: ['Cụm', 'Nghĩa', 'Ví dụ'], r: [['look after', 'chăm sóc', 'She looks after her grandmother.'], ['look up to', 'ngưỡng mộ', 'I look up to my teacher.'], ['look into', 'điều tra, xem xét', 'The police are looking into the case.'], ['take after', 'giống (người thân)', 'He takes after his father.'], ['take up', 'bắt đầu một thói quen', 'She took up yoga.'], ['take over', 'tiếp quản', 'My sister took over the shop.']] } }
      ] }
    ],
    ex: [
      ['The match was called off because of the storm.', 'Trận đấu bị huỷ vì bão.'], ['We ran out of milk, so I went to the shop.', 'Chúng mình hết sữa nên mình ra cửa hàng.'], ['Don\'t put off your homework until tomorrow.', 'Đừng hoãn bài tập đến ngày mai.'],
      ['She took up swimming last summer.', 'Mùa hè rồi cô ấy bắt đầu tập bơi.'], ['Our car broke down on the way to Hue.', 'Xe của chúng mình hỏng trên đường tới Huế.'], ['I turned down the job offer.', 'Mình đã từ chối lời mời làm việc.'],
      ['We need to come up with a new idea.', 'Chúng ta cần nghĩ ra một ý tưởng mới.'], ['He takes after his mother; both are artistic.', 'Cậu ấy giống mẹ; cả hai đều có khiếu nghệ thuật.'], ['I look forward to seeing you again.', 'Mình mong sớm gặp lại bạn.']
    ],
    mis: [
      ['I look forward to see you.', 'I look forward to seeing you.', 'to là giới từ → V-ing.'], ['We ran out money.', 'We ran out of money.', 'run out of + danh từ.'], ['Put off it until Friday.', 'Put it off until Friday.', 'Đại từ đứng giữa.'],
      ['She takes up her mother. (giống)', 'She takes after her mother.', 'giống = take after.']
    ],
    quiz: [
      ['The concert was ___ because of the rain.', ['called off', 'called on', 'called up', 'called for'], 0, 'call off = huỷ.'],
      ['We have ___ of paper. Can you buy some?', ['run out', 'put off', 'taken up', 'broken down'], 0, 'run out of = hết.'],
      ['I\'d like to ___ judo. Do you know a good club?', ['take up', 'take after', 'take off', 'take out'], 0, 'take up = bắt đầu theo đuổi.'],
      ['He ___ his father; they both love music.', ['takes after', 'takes up', 'takes over', 'takes in'], 0, 'take after = giống.'],
      ['The bus ___ so we were late for school.', ['broke down', 'broke up', 'broke into', 'broke out'], 0, 'break down = hỏng.'],
      ['She ___ the invitation because she was busy.', ['turned down', 'turned on', 'turned up', 'turned into'], 0, 'turn down = từ chối.'],
      ['I\'m looking forward ___ you.', ['to meet', 'to meeting', 'meeting', 'for meeting'], 1, 'look forward to + V-ing.'],
      ['We must ___ a solution to this problem.', ['come up with', 'come back to', 'come out of', 'come across'], 0, 'come up with = nghĩ ra.'],
      ['Doctors advise us to ___ sugar.', ['cut down on', 'cut off', 'cut up', 'cut out of'], 0, 'cut down on = giảm bớt.']
    ]
  });

  /* ───── Làm sâu các bài lớp 9 ───── */
  function P(id, d) {
    var l = S.lessons[id]; if (!l) throw new Error('Không thấy bài ' + id);
    (d.sections || []).forEach(function (s) { s.h = (l.sections.length + 1) + '. ' + s.h; l.sections.push(s); });
    ['ex', 'mis', 'quiz'].forEach(function (k) { if (d[k]) l[k] = l[k].concat(d[k]); });
  }

  P('g9-relative-clauses', {
    sections: [
      { h: 'Chọn who, which hay that?', b: [
        { t: { h: ['Danh từ đứng trước', 'Dùng', 'Ví dụ'], r: [['người', 'who / that', 'The girl **who/that** won the prize is my cousin.'], ['vật / con vật', 'which / that', 'The dog **which/that** barked is mine.'], ['người và vật cùng lúc', 'that', 'We talked about the people and places **that** we visited.'], ['sau all, everything, something, nothing, the only, so sánh nhất, số thứ tự', 'that', 'Everything **that** he said was true.']] } },
        { warn: 'Với mệnh đề **không xác định** (có dấu phẩy) không dùng **that**: My bike, **which** I bought last year, is broken. (✗ that).' }
      ] },
      { h: 'Mệnh đề quan hệ với where, when, why và whose', b: [
        { ul: ['**where** = in/at which (nơi chốn): **The town where she lives is small.** = The town **in which** she lives is small.', '**when** = on/in which (thời gian): **I remember the day when we met.**', '**why** = for which (lý do), sau danh từ **reason**: **That is the reason why I left.**', '**whose + danh từ**: **The girl whose father is a pilot is my friend.** (✗ whose her father).'] }
      ] },
      { h: 'Rút gọn và các lỗi thường gặp', b: [
        { ul: ['Bỏ đại từ quan hệ là **tân ngữ**: **The man (who/whom) I met was kind.** Không được bỏ khi nó là **chủ ngữ**: The man **who** called you is my uncle.', 'Không lặp lại **chủ ngữ/tân ngữ** sau đại từ quan hệ: ✗ The book which I read **it**. ✗ The man who **he** lives next door.', 'Mệnh đề quan hệ đứng **ngay sau danh từ** mà nó bổ nghĩa.', '**, which** có thể bổ nghĩa cho cả mệnh đề trước: **He passed the exam, which made his parents happy.**'] },
        { tip: 'Cách làm bài: (1) xem danh từ phía trước là **người / vật / nơi / thời gian**; (2) xem trong mệnh đề quan hệ, từ cần điền là **chủ ngữ, tân ngữ hay sở hữu**.' }
      ] }
    ],
    ex: [
      ['Everything that he told me was true.', 'Mọi điều anh ấy nói với mình đều đúng.'], ['The reason why she left is a secret.', 'Lý do cô ấy ra đi là một bí mật.'], ['He passed the test, which made his parents happy.', 'Cậu ấy đỗ kỳ thi, điều đó làm bố mẹ vui.'], ['The boy whose dog got lost looked sad.', 'Cậu bé có con chó bị lạc trông rất buồn.']
    ],
    mis: [['My bike, that I bought last year, is broken.', 'My bike, which I bought last year, is broken.', 'Không dùng that trong mệnh đề không xác định.'], ['The man whose his car was stolen called the police.', 'The man whose car was stolen called the police.', 'whose + danh từ (không thêm his).'], ['The town where she lives in is small.', 'The town where she lives is small. / The town (that) she lives in is small.', 'where đã gồm giới từ.']],
    quiz: [
      ['Everything ___ you said was right.', ['who', 'which', 'that', 'whose'], 2, 'Sau everything dùng that.'],
      ['That is the reason ___ I was late.', ['why', 'where', 'who', 'whose'], 0, 'reason + why.'],
      ['The man ___ car is parked outside is a doctor.', ['who', 'whose', 'which', 'that'], 1, 'Sở hữu → whose.'],
      ['My laptop, ___ I bought last year, is slow.', ['that', 'which', 'who', 'what'], 1, 'Không xác định → which (có phẩy).']
    ]
  });

  P('g9-conditional-2-wish', {
    sections: [
      { h: 'Câu hỏi, phủ định và trả lời loại 2', b: [
        { t: { h: ['', 'Cấu trúc', 'Ví dụ'], r: [['Khẳng định', 'If + V2, would/could/might + V', 'If I had a car, I **would drive** to work.'], ['Phủ định', 'If + didn\'t + V, would + V', 'If I **didn\'t have** homework, I **would go** out.'], ['Nghi vấn', 'What/Would + S + do/V + if + V2?', 'What **would you do** if you **won** a million dollars?'], ['Mệnh đề chính', 'would = chắc chắn; could = có thể làm được; might = có thể', 'If I had time, I **could** help you.']] } },
        { tip: 'Với **be** dùng **were** cho mọi ngôi (trang trọng): **If I were rich…** / **If he were here…**; trong văn nói **was** cũng dùng với I/he/she/it, nhưng **If I were you** thì luôn dùng **were**.' }
      ] },
      { h: 'So sánh loại 1 và loại 2', b: [
        { t: { h: ['', 'Loại 1', 'Loại 2'], r: [['Mức khả năng', 'có thể xảy ra', 'ít hoặc không thể xảy ra / tưởng tượng'], ['If-clause', 'hiện tại đơn', 'quá khứ đơn / were'], ['Main clause', 'will + V', 'would + V'], ['Ví dụ', 'If I win, I\'ll buy a house.', 'If I won, I\'d buy a house. (khó có khả năng thắng)']] } },
        { p: 'Khi người nói tin chuyện **có thể xảy ra** dùng loại 1; khi nói **tưởng tượng / giả định không có thật** dùng loại 2.' }
      ] },
      { h: 'Các mẫu với wish và if only', b: [
        { ul: ['**wish + V2/were**: điều ước ở hiện tại. **I wish I knew the answer.**', '**wish + would/could**: mong sự việc thay đổi / khả năng. **I wish he would be quiet.** · **I wish I could fly.**', '**If only** mạnh hơn wish: **If only I had more time!**', 'Không dùng **would** sau wish khi chủ ngữ hai vế **cùng một người**: ✗ I wish I would be rich → ✓ I wish I **were** rich.', 'Dùng **were** sau wish cho mọi ngôi: **I wish she were here.**'] }
      ] }
    ],
    ex: [
      ['What would you do if you won a million dollars?', 'Bạn sẽ làm gì nếu trúng một triệu đô?'], ['If I didn\'t have homework, I would go out with friends.', 'Nếu không có bài tập, mình sẽ đi chơi với bạn.'], ['If only I had more time!', 'Giá mà mình có nhiều thời gian hơn!'], ['I wish she were here.', 'Mình ước cô ấy ở đây.']
    ],
    mis: [['If I would be rich, I would buy a house.', 'If I were rich, I would buy a house.', 'Không dùng would trong mệnh đề if.'], ['What will you do if you won the lottery?', 'What would you do if you won the lottery?', 'Loại 2 dùng would.'], ['I wish I would be taller.', 'I wish I were taller.', 'Ước về bản thân dùng were/V2.']],
    quiz: [
      ['If I ___ rich, I would travel around the world.', ['am', 'were', 'will be', 'would be'], 1, 'Loại 2: were.'],
      ['What ___ you do if you saw a snake?', ['will', 'do', 'would', 'did'], 2, 'Loại 2: would.'],
      ['I wish I ___ the answer. I can\'t remember it.', ['know', 'knew', 'will know', 'would know'], 1, 'wish + V2 (hiện tại không có thật).'],
      ['If only I ___ more money!', ['have', 'had', 'will have', 'would have'], 1, 'If only + V2.']
    ]
  });

  P('g9-reported-questions', {
    sections: [
      { h: 'Câu hỏi có từ hỏi làm chủ ngữ', b: [
        { p: 'Khi từ hỏi (who, what, which) **làm chủ ngữ**, giữ nguyên trật tự và chỉ lùi thì: **"Who called you?" → She asked who had called me.** — **"What happened?" → He asked what had happened.**' },
        { t: { h: ['Trực tiếp', 'Tường thuật'], r: [['"Who is that boy?"', 'She asked who that boy was.'], ['"Which bus goes to the airport?"', 'He asked which bus went to the airport.'], ['"What is in the box?"', 'She asked what was in the box.']] } }
      ] },
      { h: 'Động từ tường thuật cho lời yêu cầu, đề nghị', b: [
        { t: { h: ['Ý nghĩa', 'Cấu trúc', 'Ví dụ'], r: [['yêu cầu / ra lệnh', 'tell / ask / order + O + (not) to V', 'He **ordered** us **to leave**.'], ['khuyên', 'advise / warn + O + (not) to V', 'She **advised** me **to rest**. He **warned** us **not to touch** it.'], ['gợi ý', 'suggest + V-ing / that + S + (should) V', 'He **suggested going** out. She **suggested that we go** early.'], ['đề nghị giúp', 'offer + to V', 'He **offered to carry** my bag.'], ['mời', 'invite + O + to V', 'She **invited me to join** the club.']] } }
      ] },
      { h: 'Chuyển đổi chi tiết và lỗi thường gặp', b: [
        { ul: ['Bước 1: đổi **đại từ** và **trạng từ** (now → then, here → there, today → that day…).', 'Bước 2: bỏ dấu ?, **không đảo** trợ động từ, bỏ **do/does/did**: ✗ asked me where did I live → ✓ where I lived.', 'Bước 3: lùi thì (khi động từ tường thuật ở quá khứ).', 'Câu hỏi **Yes/No** dùng **if/whether**; câu hỏi **Wh-** giữ từ hỏi.', 'Câu hỏi **"Could you…?"** (nhờ vả) → **asked me to V**: "Could you open the window?" → She asked me to open the window.'] },
        { warn: 'Không dùng **that** để nối câu hỏi Yes/No: ✗ He asked me that I was tired → ✓ He asked me **if/whether** I was tired.' }
      ] }
    ],
    ex: [
      ['"Who called you?" → She asked who had called me.', 'Cô ấy hỏi ai đã gọi cho mình.'], ['"Could you open the window?" → She asked me to open the window.', 'Cô ấy nhờ mình mở cửa sổ.'], ['He advised me to see a doctor.', 'Anh ấy khuyên mình đi khám bác sĩ.'], ['She warned us not to touch the wire.', 'Cô ấy cảnh báo chúng mình đừng chạm vào dây điện.']
    ],
    mis: [['He asked me that I was tired.', 'He asked me if I was tired.', 'Yes/No → if/whether.'], ['She asked me where did I live.', 'She asked me where I lived.', 'Không đảo trợ động từ.'], ['He suggested to go out.', 'He suggested going out.', 'suggest + V-ing.']],
    quiz: [
      ['"What happened?" → She asked what ___.', ['happens', 'had happened', 'did happen', 'was happen'], 1, 'Lùi thì: had happened.'],
      ['"Could you help me?" → He asked me ___.', ['to help him', 'help him', 'that I help him', 'helping him'], 0, 'ask + O + to V.'],
      ['She ___ me not to tell anyone.', ['warned', 'suggested', 'said', 'asked that'], 0, 'warn + O + not to V.'],
      ['He asked me ___ I wanted tea or coffee.', ['that', 'whether', 'what', 'who'], 1, 'Yes/No hoặc lựa chọn → whether.']
    ]
  });

  P('g9-passive-extended', {
    sections: [
      { h: 'Câu hỏi Wh- và câu có hai tân ngữ ở bị động', b: [
        { t: { h: ['Chủ động', 'Bị động'], r: [['Who wrote this book?', 'Who was this book written by? / By whom was this book written?'], ['When did they build the bridge?', 'When was the bridge built?'], ['Where do they make these shoes?', 'Where are these shoes made?'], ['Someone has stolen my bike.', 'My bike has been stolen.'], ['They are painting the house.', 'The house is being painted.']] } }
      ] },
      { h: 'Have/get something done (thể truyền khiến)', b: [
        { f: ['have + O + V3 : I **had my hair cut**.', 'get + O + V3 : She **got her car repaired**.'] },
        { p: 'Dùng khi **nhờ người khác** làm giúp (dịch vụ): **I\'m having my bike repaired.** — **Where do you have your hair cut?** Không dùng khi tự làm: ✗ I had my homework done (ý: tự làm).' },
        { warn: 'So sánh: **I repaired the bike.** (tự sửa) ≠ **I had the bike repaired.** (nhờ người sửa).' }
      ] },
      { h: 'Những điểm cần nhớ và lỗi thường gặp', b: [
        { ul: ['Bị động của **hiện tại hoàn thành**: **has/have been + V3**; của **tiếp diễn**: **is/are being + V3**; của **modal**: **modal + be + V3**.', 'Có thể dùng **get** thay **be** trong văn nói không trang trọng: **He got hurt.** · **The cup got broken.**', 'Với **say, think, believe** có thể dùng: **It is said that…** (xem lớp 11).', 'Lỗi: ✗ The house has built. → ✓ The house **has been built**. ✗ The road is been repaired → ✓ is **being** repaired.'] }
      ] }
    ],
    ex: [
      ['Where are these shoes made?', 'Những đôi giày này được sản xuất ở đâu?'], ['I had my hair cut yesterday.', 'Hôm qua mình đi cắt tóc.'], ['She is having her car repaired.', 'Cô ấy đang nhờ người sửa xe.'], ['The cup got broken when we moved the table.', 'Cái cốc bị vỡ khi chúng mình di chuyển cái bàn.']
    ],
    mis: [['The house has built recently.', 'The house has been built recently.', 'has been + V3.'], ['I repaired my bike at the shop. (nhờ người sửa)', 'I had my bike repaired at the shop.', 'Nhờ người làm → have + O + V3.'], ['The road is been repaired.', 'The road is being repaired.', 'is being + V3.']],
    quiz: [
      ['My phone ___ yesterday.', ['stole', 'was stolen', 'has stolen', 'is stolen'], 1, 'Bị động quá khứ: was stolen.'],
      ['I ___ my hair cut every month.', ['have', 'am', 'make', 'do'], 0, 'have + O + V3.'],
      ['The old market ___ right now.', ['is rebuilding', 'is being rebuilt', 'was rebuilt', 'rebuilds'], 1, 'Tiếp diễn bị động: is being rebuilt.'],
      ['The new library ___ yet.', ['hasn\'t been opened', 'hasn\'t opened been', 'isn\'t being opened', 'wasn\'t opening'], 0, 'hasn\'t been + V3.']
    ]
  });

  P('g9-used-to', {
    sections: [
      { h: 'Used to và would', b: [
        { t: { h: ['', 'used to', 'would'], r: [['Thói quen lặp lại', 'có', 'có (không dùng cho trạng thái)'], ['Trạng thái (live, have, be, like)', 'có', 'không'], ['Ví dụ', 'I **used to live** in Hue. · She **used to be** shy.', 'Every summer we **would go** to the beach.']] } },
        { warn: 'Không dùng would cho **trạng thái**: ✗ I would live in Hue. → ✓ I **used to** live in Hue.' }
      ] },
      { h: 'Used to khác với quá khứ đơn', b: [
        { ul: ['**used to** nhấn mạnh **ngày xưa như vậy, bây giờ không còn**: **I used to play football.** (bây giờ không chơi nữa)', '**quá khứ đơn** nói sự kiện có thời gian xác định: **I played football yesterday.**', '**used to** không dùng với khoảng thời gian cụ thể: ✗ I used to live in Hue for 5 years. → ✓ I **lived** in Hue for 5 years.', 'Hiện tại **không có** "use to" cho thói quen hiện tại; hiện tại dùng **usually**: **I usually get up at 6.**'] }
      ] },
      { h: 'Be used to và get used to nâng cao', b: [
        { t: { h: ['Cấu trúc', 'Nghĩa', 'Ví dụ'], r: [['be used to + V-ing / N', 'đã quen với', 'I\'m used to **the noise**. She is used to **living** alone.'], ['get used to + V-ing / N', 'dần quen', 'I\'m getting used to **the food**.'], ['become used to', 'trở nên quen', 'He became used to the cold.'], ['used to + V', 'thói quen quá khứ', 'I used to **smoke**.']] } },
        { tip: 'Cách phân biệt: sau **be/get used to** là **V-ing hoặc danh từ**; sau **used to** (không có be/get) là **V nguyên mẫu**.' }
      ] }
    ],
    ex: [
      ['When I was a child, I would visit my grandma every summer.', 'Hồi nhỏ mình hay đến thăm bà mỗi mùa hè.'], ['I used to be afraid of dogs, but now I love them.', 'Ngày trước mình sợ chó, bây giờ mình lại thích chúng.'], ['She is used to living alone.', 'Cô ấy đã quen sống một mình.'], ['I lived in Hue for five years.', 'Mình đã sống ở Huế năm năm.']
    ],
    mis: [['I would live in Hue when I was young.', 'I used to live in Hue when I was young.', 'would không dùng cho trạng thái.'], ['I used to live in Hue for five years.', 'I lived in Hue for five years.', 'Khoảng thời gian xác định → quá khứ đơn.'], ['I\'m used to wake up early.', 'I\'m used to waking up early.', 'be used to + V-ing.']],
    quiz: [
      ['Every Sunday we ___ go fishing with Grandpa.', ['would', 'are used to', 'get used to', 'is'], 0, 'Thói quen lặp lại → would.'],
      ['I ___ shy, but now I\'m confident.', ['would be', 'am used to be', 'used to be', 'get used to being'], 2, 'Trạng thái → used to be.'],
      ['She isn\'t used ___ in a big city.', ['live', 'living', 'to living', 'lived'], 2, 'be used to + V-ing: not used to living.'],
      ['He lived in Hanoi ___ ten years.', ['used to for', 'for', 'would for', 'is used to'], 1, 'Khoảng thời gian xác định → quá khứ đơn + for.']
    ]
  });

  P('g9-clauses', {
    sections: [
      { h: 'Từ nối chỉ kết quả: so, therefore, as a result', b: [
        { t: { h: ['Từ', 'Vị trí', 'Ví dụ'], r: [['so', 'giữa hai mệnh đề, có dấu phẩy trước so', 'It rained, **so** we stayed in.'], ['therefore / consequently / as a result', 'đầu câu mới, theo sau là dấu phẩy', 'It rained. **Therefore**, we stayed in.'], ['thus', 'trang trọng', 'He was ill. **Thus** he missed class.'], ['that is why', 'nêu kết quả', 'I was ill. **That is why** I stayed in bed.']] } },
        { warn: 'Không dùng dấu phẩy để nối hai câu độc lập bằng **therefore**: ✗ It rained, therefore we stayed in. → ✓ It rained; **therefore**, we stayed in. / It rained. **Therefore**, we stayed in.' }
      ] },
      { h: 'Mục đích: các cách diễn đạt khác', b: [
        { ul: ['**for + danh từ / V-ing** chỉ **công dụng**: **This knife is for cutting bread.** · **I went there for a rest.**', '**to avoid + V-ing / not to V**: **I left early to avoid being late.**', '**so that + S + will/would/can/could + V**: **I wrote it down so that I wouldn\'t forget.**', '**in order that**: trang trọng hơn so that.'] },
        { tip: 'Khi hai mệnh đề **cùng chủ ngữ** dùng **to V / in order to / so as to**; khi **khác chủ ngữ** dùng **so that**.' }
      ] },
      { h: 'Tương phản và đối lập', b: [
        { t: { h: ['Từ', 'Theo sau', 'Ví dụ'], r: [['although / though / even though', 'S + V', 'Although it was cold, we went out.'], ['despite / in spite of', 'N / V-ing', 'Despite the cold, we went out.'], ['however / nevertheless', 'dấu phẩy + mệnh đề', 'It was cold. However, we went out.'], ['but / yet', 'giữa hai mệnh đề', 'It was cold, but we went out.'], ['while / whereas', 'đối lập hai vế', 'He likes tea, whereas she likes coffee.']] } },
        { warn: 'Không nói **despite of**. **Even though** mạnh hơn although: **Even though she was ill, she came.**' }
      ] }
    ],
    ex: [
      ['It rained heavily. Therefore, the match was cancelled.', 'Trời mưa to. Vì vậy trận đấu bị huỷ.'], ['This tool is for cutting wood.', 'Dụng cụ này dùng để cắt gỗ.'], ['I wrote the address down so that I wouldn\'t forget it.', 'Mình ghi địa chỉ lại để khỏi quên.'], ['He likes tea, whereas his wife likes coffee.', 'Anh ấy thích trà, còn vợ anh thích cà phê.']
    ],
    mis: [['It rained, therefore we stayed home.', 'It rained; therefore, we stayed home. / It rained, so we stayed home.', 'therefore cần dấu chấm/chấm phẩy trước.'], ['Despite of the rain, we went out.', 'Despite the rain, we went out.', 'Không có of.'], ['I wrote it down for not forget.', 'I wrote it down so that I wouldn\'t forget.', 'Dùng so that hoặc to V.']],
    quiz: [
      ['It was late. ___, we took a taxi.', ['Therefore', 'Although', 'Despite', 'Because'], 0, 'Kết quả → Therefore,.'],
      ['I got up early ___ I wouldn\'t miss the bus.', ['so as', 'so that', 'in spite', 'because of'], 1, 'so that + S + would + V.'],
      ['___ the strong wind, the ferry kept running.', ['Although', 'In spite of', 'However', 'But'], 1, 'Sau chỗ trống là danh từ → In spite of.'],
      ['She likes tea, ___ her sister likes coffee.', ['whereas', 'despite', 'because', 'so that'], 0, 'Đối lập hai vế → whereas.']
    ]
  });
})();
