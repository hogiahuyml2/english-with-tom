/* Tiếng Anh phổ thông — Lớp 8 (ngữ pháp). Nội dung tự biên soạn cho English With Tom. */
(function () {
  var S = (window.SCHOOL = window.SCHOOL || { lessons: {} });
  function L(id, d) { d.id = id; S.lessons[id] = d; }

  L('g8-present-perfect', {
    grade: 8, icon: '🕰️', title: 'Thì hiện tại hoàn thành', sub: 'Present Perfect', level: 'Trung bình',
    summary: 'Nối quá khứ với hiện tại: trải nghiệm, hành động kéo dài đến nay, kết quả còn ở hiện tại.',
    sections: [
      { h: '1. Cấu trúc', b: [
        { f: ['(+) S + have/has + V3/V-ed', "(-) S + have/has + not (haven't/hasn't) + V3", '(?) Have/Has + S + V3?'] },
        { p: 'He/she/it + **has**; I/you/we/they + **have**. V3 của động từ bất quy tắc: go → gone, see → seen, eat → eaten, write → written, do → done, take → taken.' }
      ] },
      { h: '2. Cách dùng và dấu hiệu', b: [
        { ul: ['**Trải nghiệm** (ever, never, before, twice, many times): **I have never eaten sushi.**', '**Kéo dài đến hiện tại** với **for** (khoảng thời gian) và **since** (mốc thời gian): **She has lived here for 5 years / since 2019.**', '**Kết quả ở hiện tại / việc vừa xảy ra** (just, already, yet, recently): **I have just finished my homework.**'] },
        { p: 'Dấu hiệu khác: **so far, up to now, lately, how long...?, This is the first time ...**' },
        { warn: 'Không dùng thì này với **mốc thời gian đã kết thúc** (yesterday, last week, in 2020, ago). Khi đó dùng quá khứ đơn: **I saw him yesterday.**' }
      ] },
      { h: '3. Các điểm dễ nhầm', b: [
        { ul: ['**yet** dùng trong câu phủ định/nghi vấn, đứng cuối câu: **Have you finished yet?**; **already** dùng trong câu khẳng định: **I have already eaten.**', '**have been to** (đã từng đến và đã về) ≠ **have gone to** (đã đi và chưa về): **She has gone to Hue.** (cô ấy còn ở Huế)'] }
      ] }
    ],
    ex: [['I have never eaten sushi.', 'Mình chưa bao giờ ăn sushi.'], ['She has lived in Hue for five years.', 'Cô ấy sống ở Huế được năm năm rồi.'], ['They have known each other since 2019.', 'Họ quen nhau từ năm 2019.'], ['Have you finished your homework yet?', 'Bạn làm xong bài tập chưa?'], ["He hasn't called me yet.", 'Anh ấy vẫn chưa gọi cho mình.'], ['We have just arrived at the airport.', 'Chúng mình vừa đến sân bay.'], ['This is the first time I have flown in a plane.', 'Đây là lần đầu tiên mình đi máy bay.'], ['How long have you studied English?', 'Bạn đã học tiếng Anh được bao lâu rồi?']],
    mis: [['I have seen him yesterday.', 'I saw him yesterday.', 'Có yesterday (mốc quá khứ) → quá khứ đơn.'], ['She has lived here since five years.', 'She has lived here for five years.', 'Khoảng thời gian dùng for; mốc thời gian dùng since.'], ['I have gone to Hue twice.', 'I have been to Hue twice.', 'Đã từng đến và trở về → have been to.'], ['Did you finish yet?', 'Have you finished yet?', 'yet thường đi với hiện tại hoàn thành.']],
    quiz: [
      ['She ___ in this city since 2018.', ['lives', 'lived', 'has lived', 'is living'], 2, 'since 2018 → hiện tại hoàn thành: has lived.'],
      ['I have never ___ a kangaroo.', ['saw', 'seen', 'see', 'seeing'], 1, 'have never + V3: seen.'],
      ['We have been friends ___ ten years.', ['since', 'for', 'ago', 'in'], 1, 'ten years là khoảng thời gian → for.'],
      ['Have you done your homework ___?', ['since', 'yet', 'ago', 'last night'], 1, 'Câu hỏi hiện tại hoàn thành, hỏi "đã … chưa" → yet đứng cuối câu.'],
      ['I ___ my keys. I cannot open the door.', ['lose', 'lost', 'have lost', 'am losing'], 2, 'Kết quả ở hiện tại (không mở được cửa) → have lost.'],
      ['They ___ to London last year.', ['have gone', 'went', 'have been', 'go'], 1, 'last year là mốc quá khứ → quá khứ đơn: went.'],
      ['This is the first time she ___ sushi.', ['eats', 'ate', 'has eaten', 'is eating'], 2, 'This is the first time + hiện tại hoàn thành.'],
      ['Mr Nam is not here. He ___ to the post office.', ['has been', 'has gone', 'went', 'goes'], 1, 'Đã đi và chưa về → has gone to.']
    ]
  });

  L('g8-past-continuous', {
    grade: 8, icon: '🎞️', title: 'Thì quá khứ tiếp diễn', sub: 'Past Continuous: was/were + V-ing', level: 'Trung bình',
    summary: 'Diễn tả hành động đang diễn ra tại một thời điểm trong quá khứ, hoặc bị một hành động khác xen vào.',
    sections: [
      { h: '1. Cấu trúc', b: [
        { f: ['(+) S + was/were + V-ing', "(-) S + wasn't/weren't + V-ing", '(?) Was/Were + S + V-ing?'] },
        { p: 'I/he/she/it + **was**; you/we/they + **were**.' }
      ] },
      { h: '2. Cách dùng', b: [
        { ul: ['Hành động đang xảy ra vào một thời điểm xác định trong quá khứ: **At 8 p.m. yesterday, I was doing my homework.**', 'Hành động đang diễn ra (**quá khứ tiếp diễn**) thì bị một hành động ngắn xen vào (**quá khứ đơn**): **I was cooking when the phone rang.**', 'Hai hành động diễn ra song song: **While I was reading, my brother was playing games.**'] },
        { t: { h: ['Liên từ', 'Đi với', 'Ví dụ'], r: [['when', 'hành động xen vào (quá khứ đơn)', 'I was sleeping when he came.'], ['while', 'hành động đang diễn ra (quá khứ tiếp diễn)', 'He came while I was sleeping.']] } },
        { warn: 'Động từ chỉ trạng thái (know, like, want, believe...) thường không dùng thì tiếp diễn.' }
      ] }
    ],
    ex: [['At 8 p.m. yesterday, I was doing my homework.', 'Lúc 8 giờ tối qua, mình đang làm bài tập.'], ['I was cooking when the phone rang.', 'Mình đang nấu ăn thì điện thoại reo.'], ['While she was reading, her brother was playing games.', 'Trong lúc cô ấy đọc sách thì em trai chơi game.'], ['They were walking home when it started to rain.', 'Họ đang đi bộ về nhà thì trời bắt đầu mưa.'], ['What were you doing at 9 o\'clock last night?', 'Lúc 9 giờ tối qua bạn đang làm gì?'], ["It wasn't raining when we left.", 'Lúc chúng mình rời đi thì trời không mưa.'], ['The students were talking when the teacher came in.', 'Học sinh đang nói chuyện thì cô giáo bước vào.'], ['Was he sleeping at that time?', 'Lúc đó anh ấy đang ngủ à?']],
    mis: [['While I watched TV, he came in.', 'While I was watching TV, he came in.', 'Hành động đang diễn ra dùng quá khứ tiếp diễn.'], ['I was having dinner when the phone was ringing.', 'I was having dinner when the phone rang.', 'Hành động xen vào dùng quá khứ đơn.'], ['She were reading a book.', 'She was reading a book.', 'She đi với was.'], ['I was knowing the answer.', 'I knew the answer.', 'know là động từ chỉ trạng thái.']],
    quiz: [
      ['I ___ TV when the lights went out.', ['watched', 'was watching', 'were watching', 'watch'], 1, 'Hành động đang diễn ra bị xen vào → was watching.'],
      ['While my mother ___ dinner, I was doing my homework.', ['cooked', 'was cooking', 'cooks', 'is cooking'], 1, 'Hai hành động song song → quá khứ tiếp diễn.'],
      ['What ___ at 7 o\'clock last night?', ['did you do', 'were you doing', 'are you doing', 'was you doing'], 1, 'You → were; at 7 o\'clock last night → were you doing.'],
      ['They ___ football when it started to rain.', ['played', 'was playing', 'were playing', 'play'], 2, 'They → were playing; started to rain là hành động xen vào.'],
      ['When the teacher came in, the students ___.', ['talk', 'were talking', 'was talking', 'talks'], 1, 'students số nhiều → were talking.'],
      ['He ___ asleep when I called him.', ['is', 'were', 'was', 'be'], 2, 'He → was (asleep là tính từ, dùng to be).'],
      ['She broke her arm while she ___ a bike.', ['rode', 'was riding', 'were riding', 'rides'], 1, 'while + quá khứ tiếp diễn.'],
      ['At this time yesterday we ___ at the beach.', ['was lying', 'lie', 'were lying', 'are lying'], 2, 'we → were lying.']
    ]
  });

  L('g8-conditional-1', {
    grade: 8, icon: '🌦️', title: 'Câu điều kiện loại 1', sub: 'If + present simple, will + V', level: 'Trung bình',
    summary: 'Diễn tả điều kiện có thể xảy ra ở hiện tại hoặc tương lai và kết quả của nó.',
    sections: [
      { h: '1. Cấu trúc', b: [
        { f: ['If + S + V (hiện tại đơn), S + will + V(bare)', 'S + will + V(bare) + if + S + V (hiện tại đơn)', 'Unless + S + V (khẳng định) = If + S + do/does not + V'] },
        { ul: ['Mệnh đề **if** chỉ điều kiện, dùng **hiện tại đơn** (kể cả khi nói về tương lai).', 'Mệnh đề chính có thể dùng **will / can / may / might / imperative**: **If you are tired, go to bed.**', 'Khi mệnh đề **if** đứng đầu thì có dấu phẩy sau nó.'] },
        { tip: '**Unless** = **if ... not**. **Unless you hurry, you will be late.** = **If you don\'t hurry, you will be late.**' }
      ] },
      { h: '2. Không dùng will trong mệnh đề if', b: [
        { p: 'Sai: **If it will rain, we will stay home.** Đúng: **If it rains, we will stay home.**' }
      ] }
    ],
    ex: [['If it rains tomorrow, we will stay at home.', 'Nếu ngày mai trời mưa, chúng mình sẽ ở nhà.'], ['If you study hard, you will pass the exam.', 'Nếu bạn học chăm, bạn sẽ đỗ kỳ thi.'], ["She will be late if she doesn't hurry.", 'Cô ấy sẽ muộn nếu không nhanh lên.'], ['Unless you hurry, you will miss the bus.', 'Nếu bạn không nhanh lên, bạn sẽ lỡ xe buýt.'], ['If you see Tom, tell him to call me.', 'Nếu bạn gặp Tom, bảo cậu ấy gọi cho mình nhé.'], ['What will you do if you fail the test?', 'Bạn sẽ làm gì nếu trượt bài kiểm tra?'], ['If the weather is nice, we can go to the beach.', 'Nếu thời tiết đẹp, chúng mình có thể đi biển.'], ["We won't go out if it is too cold.", 'Chúng mình sẽ không ra ngoài nếu trời quá lạnh.']],
    mis: [['If it will rain, we will stay home.', 'If it rains, we will stay home.', 'Không dùng will trong mệnh đề if.'], ['If I will see her, I will tell her.', 'If I see her, I will tell her.', 'Mệnh đề if dùng hiện tại đơn.'], ["Unless you don't hurry, you will be late.", 'Unless you hurry, you will be late.', 'Unless đã mang nghĩa phủ định, không dùng thêm not.'], ['If she studies hard, she would pass the exam.', 'If she studies hard, she will pass the exam.', 'Loại 1 dùng will ở mệnh đề chính.']],
    quiz: [
      ['If it ___ tomorrow, we will not go camping.', ['will rain', 'rains', 'rained', 'is raining to'], 1, 'Mệnh đề if dùng hiện tại đơn: rains.'],
      ['If you ___ hard, you will pass the exam.', ['study', 'studied', 'will study', 'studies'], 0, 'you + study (hiện tại đơn).'],
      ['She will be angry if you ___ her.', ['will not help', "don't help", "didn't help", 'not helping'], 1, "Mệnh đề if: you don't help."],
      ['___ you hurry, you will be late.', ['If', 'Unless', 'Although', 'Because'], 1, 'Unless = if not: Unless you hurry...'],
      ['If I ___ time tomorrow, I will call you.', ['have', 'had', 'will have', 'would have'], 0, 'Loại 1: If + hiện tại đơn.'],
      ['If he ___ the bus, he will be late for school.', ['misses', 'missed', 'will miss', 'would miss'], 0, 'he → misses.'],
      ['We ___ a picnic if the weather is fine.', ['have', 'will have', 'would have', 'had'], 1, 'Mệnh đề chính loại 1: will + V.'],
      ["Unless it ___, we will have a picnic.", ['rains', "doesn't rain", "won't rain", "didn't rain"], 0, 'Unless + động từ khẳng định (rains).']
    ]
  });

  L('g8-passive-simple', {
    grade: 8, icon: '🔁', title: 'Câu bị động đơn giản', sub: 'be + V3 (hiện tại, quá khứ, tương lai)', level: 'Trung bình',
    summary: 'Chuyển câu chủ động sang bị động khi muốn nhấn mạnh hành động hoặc đối tượng chịu tác động.',
    sections: [
      { h: '1. Cách chuyển', b: [
        { f: ['Chủ động: S + V + O', 'Bị động: O + be + V3/V-ed + (by S)'] },
        { t: { h: ['Thì', 'Bị động', 'Ví dụ'], r: [['Hiện tại đơn', 'am/is/are + V3', 'English is spoken in many countries.'], ['Quá khứ đơn', 'was/were + V3', 'The window was broken yesterday.'], ['Tương lai đơn', 'will be + V3', 'A new school will be built next year.']] } },
        { p: 'Chỉ thêm **by + tác nhân** khi quan trọng/ cần biết ai làm: **The Mona Lisa was painted by Leonardo da Vinci.**' }
      ] },
      { h: '2. Lưu ý', b: [
        { ul: ['Chỉ **ngoại động từ** (có tân ngữ) mới chuyển được sang bị động. **happen, arrive, die, seem** không có bị động.', 'Động từ **be** phải chia theo thì và theo chủ ngữ mới.'] },
        { tip: 'Dùng bị động khi không biết hoặc không cần nói ai làm: **My bike was stolen.**' }
      ] }
    ],
    ex: [['English is spoken in many countries.', 'Tiếng Anh được nói ở nhiều quốc gia.'], ['The window was broken yesterday.', 'Cửa sổ bị vỡ hôm qua.'], ['A new bridge will be built next year.', 'Một cây cầu mới sẽ được xây vào năm tới.'], ['The Mona Lisa was painted by Leonardo da Vinci.', 'Bức Mona Lisa được Leonardo da Vinci vẽ.'], ['Rice is grown in many parts of Vietnam.', 'Lúa được trồng ở nhiều nơi tại Việt Nam.'], ['My bike was stolen last night.', 'Xe đạp của mình bị trộm lấy tối qua.'], ['Are these rooms cleaned every day?', 'Những phòng này có được dọn mỗi ngày không?'], ["The homework wasn't finished.", 'Bài tập về nhà chưa được làm xong.']],
    mis: [['The cake made by my mother.', 'The cake was made by my mother.', 'Thiếu động từ to be.'], ['The letter is wrote by Tom.', 'The letter is written by Tom.', 'Dùng V3: written.'], ['The accident was happened last night.', 'The accident happened last night.', 'happen là nội động từ, không có bị động.'], ['A house will built here.', 'A house will be built here.', 'will be + V3.']],
    quiz: [
      ['English ___ in many countries.', ['speaks', 'is spoken', 'is speaking', 'spoke'], 1, 'English là đối tượng chịu tác động → is spoken.'],
      ['The window ___ by the boys yesterday.', ['broke', 'is broken', 'was broken', 'were broken'], 2, 'Quá khứ đơn, window số ít → was broken.'],
      ['A new school ___ next year.', ['will build', 'will be built', 'is built', 'was built'], 1, 'Tương lai đơn bị động: will be built.'],
      ['These books ___ by many students every day.', ['read', 'are read', 'is read', 'were read'], 1, 'books số nhiều, hiện tại đơn → are read.'],
      ['My phone ___ last week.', ['was stolen', 'is stolen', 'stole', 'has stolen'], 0, 'last week → was stolen.'],
      ['Chuyển sang bị động: "They clean the classrooms every day."', ['The classrooms clean every day.', 'The classrooms are cleaned every day.', 'The classrooms is cleaned every day.', 'The classrooms were cleaned every day.'], 1, 'classrooms số nhiều, hiện tại đơn → are cleaned.'],
      ['Which sentence is correct?', ['The accident was happened.', 'The accident happened.', 'The accident is happened.', 'The accident has been happening by him.'], 1, 'happen là nội động từ nên không dùng bị động.'],
      ['The Eiffel Tower ___ by Gustave Eiffel.', ['designed', 'was designed', 'is designed', 'will design'], 1, 'Sự kiện quá khứ → was designed.']
    ]
  });

  L('g8-gerund-infinitive', {
    grade: 8, icon: '🔀', title: 'V-ing và to V', sub: 'Gerund & Infinitive', level: 'Trung bình',
    summary: 'Động từ nào theo sau là V-ing, to V hay cả hai, và giới từ + V-ing.',
    sections: [
      { h: '1. Động từ + V-ing (gerund)', b: [
        { p: '**enjoy, avoid, finish, mind, practise, keep, suggest, consider, give up, miss, deny, imagine, can\'t stand, can\'t help**' },
        { p: '**I enjoy swimming. — She finished doing her homework. — Would you mind opening the window?**' }
      ] },
      { h: '2. Động từ + to V (infinitive)', b: [
        { p: '**want, would like, decide, hope, plan, learn, promise, refuse, agree, manage, afford, expect, need, offer**' },
        { p: '**I want to go home. — They decided to move. — He promised to help me.**' }
      ] },
      { h: '3. Giới từ + V-ing và các cặp đặc biệt', b: [
        { ul: ['Sau **giới từ** luôn dùng V-ing: **interested in learning, good at swimming, thank you for helping, look forward to seeing**.', '**like / love / hate / prefer** dùng được cả hai: **I like swimming / I like to swim.**', '**stop doing** (ngừng hẳn) ≠ **stop to do** (dừng lại để làm): **He stopped smoking.** / **He stopped to buy a drink.**', '**remember / forget doing** (việc đã xảy ra) ≠ **remember / forget to do** (việc cần làm): **Remember to lock the door.**'] }
      ] }
    ],
    ex: [['I enjoy listening to music.', 'Mình thích nghe nhạc.'], ['She decided to study abroad.', 'Cô ấy quyết định đi du học.'], ['He promised to help me with my homework.', 'Cậu ấy hứa sẽ giúp mình làm bài tập.'], ['Would you mind opening the window?', 'Bạn có phiền mở cửa sổ giúp mình không?'], ["I'm interested in learning Japanese.", 'Mình quan tâm đến việc học tiếng Nhật.'], ['They avoided talking about the problem.', 'Họ tránh nói về vấn đề đó.'], ['My father stopped smoking last year.', 'Bố mình đã bỏ thuốc từ năm ngoái.'], ["Don't forget to turn off the lights.", 'Đừng quên tắt đèn nhé.']],
    mis: [['I enjoy to swim.', 'I enjoy swimming.', 'enjoy + V-ing.'], ['She decided going abroad.', 'She decided to go abroad.', 'decide + to V.'], ["I'm interested in learn English.", "I'm interested in learning English.", 'Sau giới từ in dùng V-ing.'], ['He is good at play football.', 'He is good at playing football.', 'Sau giới từ at dùng V-ing.']],
    quiz: [
      ['She enjoys ___ novels in her free time.', ['to read', 'reading', 'read', 'reads'], 1, 'enjoy + V-ing.'],
      ['They decided ___ a new house.', ['buying', 'buy', 'to buy', 'bought'], 2, 'decide + to V.'],
      ["I'm looking forward to ___ you next week.", ['see', 'seeing', 'to see', 'saw'], 1, 'look forward to + V-ing (to là giới từ).'],
      ['He is very good at ___ pictures.', ['draw', 'to draw', 'drawing', 'drew'], 2, 'Sau giới từ at dùng V-ing.'],
      ['My brother stopped ___ because it was bad for his health.', ['to smoke', 'smoking', 'smoke', 'smoked'], 1, 'stop + V-ing = ngừng hẳn việc đang làm.'],
      ['Would you mind ___ the door?', ['to close', 'close', 'closing', 'closed'], 2, 'mind + V-ing.'],
      ['I forgot ___ the window, so it rained into the room.', ['closing', 'to close', 'close', 'closed'], 1, 'forget + to V: quên làm việc cần làm.'],
      ['She promised ___ me tomorrow.', ['calling', 'to call', 'call', 'called'], 1, 'promise + to V.']
    ]
  });

  L('g8-reported-statements', {
    grade: 8, icon: '💬', title: 'Câu tường thuật (câu trần thuật)', sub: 'Reported speech: statements', level: 'Trung bình',
    summary: 'Thuật lại lời người khác: lùi thì, đổi đại từ và trạng từ chỉ thời gian/nơi chốn.',
    sections: [
      { h: '1. Cấu trúc', b: [
        { f: ['S + said (that) + S + V (lùi thì)', 'S + told + O + (that) + S + V (lùi thì)'] },
        { p: '**say** không có tân ngữ trực tiếp theo sau (**He said that...**); **tell** luôn có tân ngữ (**He told me that...**).' }
      ] },
      { h: '2. Lùi thì (khi động từ tường thuật ở quá khứ)', b: [
        { t: { h: ['Lời nói trực tiếp', 'Câu tường thuật'], r: [['Hiện tại đơn', 'Quá khứ đơn'], ['Hiện tại tiếp diễn', 'Quá khứ tiếp diễn'], ['Hiện tại hoàn thành / Quá khứ đơn', 'Quá khứ hoàn thành'], ['will', 'would'], ['can', 'could'], ['must', 'had to']] } },
        { t: { h: ['Trực tiếp', 'Tường thuật'], r: [['now', 'then / at that time'], ['today', 'that day'], ['tomorrow', 'the next day / the following day'], ['yesterday', 'the day before / the previous day'], ['this / these', 'that / those'], ['here', 'there']] } },
        { tip: 'Cũng phải **đổi đại từ** cho hợp ngữ cảnh: **"I am tired," she said. → She said that she was tired.** Không lùi thì với sự thật hiển nhiên hoặc khi động từ tường thuật ở hiện tại.' }
      ] }
    ],
    ex: [['"I am tired," she said. → She said (that) she was tired.', 'Cô ấy nói cô ấy mệt.'], ['"I will help you," he said. → He said he would help me.', 'Anh ấy nói anh ấy sẽ giúp mình.'], ['"We live in Hue," they said. → They said they lived in Hue.', 'Họ nói họ sống ở Huế.'], ['"I can swim," Tom told me. → Tom told me he could swim.', 'Tom bảo mình rằng cậu ấy biết bơi.'], ['"I am going to Da Nang tomorrow," she said. → She said she was going to Da Nang the next day.', 'Cô ấy nói hôm sau cô ấy sẽ đi Đà Nẵng.'], ['"I visited my aunt yesterday," he said. → He said he had visited his aunt the day before.', 'Anh ấy nói hôm trước anh ấy đã thăm dì.'], ['"I must go now," she said. → She said she had to go then.', 'Cô ấy nói lúc đó cô ấy phải đi.'], ['The teacher said that the Earth goes around the Sun.', 'Cô giáo nói rằng Trái Đất quay quanh Mặt Trời.']],
    mis: [['She said me that she was tired.', 'She told me that she was tired. / She said that she was tired.', 'say không có tân ngữ; tell + O.'], ['He told that he was busy.', 'He said that he was busy. / He told me that he was busy.', 'tell cần có tân ngữ.'], ['She said she will come tomorrow.', 'She said she would come the next day.', 'Lùi thì: will → would; tomorrow → the next day.'], ['He said me he lived in Hue.', 'He told me he lived in Hue.', 'tell + O.']],
    quiz: [
      ['"I am hungry," Tom said. → Tom said that he ___ hungry. (lùi thì)', ['is', 'was', 'were', 'will be'], 1, 'am/is → was.'],
      ['"We will visit you," they said. → They said they ___ visit me. (lùi thì)', ['will', 'would', 'can', 'did'], 1, 'will → would.'],
      ['"I can swim," she said. → She said she ___ swim. (lùi thì)', ['can', 'could', 'may', 'would'], 1, 'can → could.'],
      ['"I am leaving tomorrow," he said. → He said he was leaving ___.', ['tomorrow', 'the next day', 'yesterday', 'today'], 1, 'tomorrow → the next day.'],
      ['She ___ me that she was busy.', ['said', 'told', 'spoke', 'talked'], 1, 'tell + O + that.'],
      ['"I live here," he said. → He said that he lived ___.', ['here', 'there', 'now', 'this'], 1, 'here → there.'],
      ['"We watched a film yesterday," they said. → They said they ___ a film the day before.', ['watched', 'had watched', 'have watched', 'would watch'], 1, 'Quá khứ đơn → quá khứ hoàn thành: had watched.'],
      ['The teacher said that water ___ at 100°C. (sự thật hiển nhiên)', ['boiled', 'boils', 'had boiled', 'would boil'], 1, 'Sự thật hiển nhiên giữ nguyên thì hiện tại đơn.']
    ]
  });
})();
