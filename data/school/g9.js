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
})();
