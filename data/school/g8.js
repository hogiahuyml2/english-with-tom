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

  L('g8-complex-sentences', {
    grade: 8, icon: '🌳', title: 'Câu phức: mệnh đề thời gian, lý do, nhượng bộ', sub: 'Complex sentences', level: 'Trung bình',
    summary: 'Nối mệnh đề chính với mệnh đề phụ bằng when, while, before, after, as soon as, because, since, although, if, unless.',
    sections: [
      { h: '1. Câu phức là gì?', b: [
        { p: '**Câu phức** = 1 mệnh đề chính (nói được một mình) + ít nhất 1 mệnh đề phụ (bắt đầu bằng liên từ phụ thuộc, không đứng một mình): **I was cooking (chính) when the phone rang (phụ).**' },
        { f: ['Mệnh đề phụ đứng sau: **S + V + liên từ + S + V**', 'Mệnh đề phụ đứng đầu: **Liên từ + S + V , S + V** (có dấu phẩy)'] },
        { tip: 'Đổi chỗ hai mệnh đề, nghĩa không đổi: **When it rains, we stay home.** = **We stay home when it rains.**' }
      ] },
      { h: '2. Các liên từ phụ thuộc thường gặp', b: [
        { t: { h: ['Loại', 'Liên từ', 'Ví dụ'], r: [['Thời gian', '**when, while, before, after, as soon as, until, since**', 'I\'ll call you **as soon as** I arrive.'], ['Lý do', '**because, since, as**', 'We stayed in **because** it was raining.'], ['Nhượng bộ', '**although, though, even though**', '**Although** he was tired, he kept working.'], ['Điều kiện', '**if, unless**', 'You\'ll fail **unless** you study.'], ['Mục đích', '**so that, in order that**', 'I study hard **so that** I can pass.']] } },
        { warn: '**although** + mệnh đề, không dùng **but** cùng lúc: ✗ Although it rained, but we went out. → ✓ Although it rained, we went out.' }
      ] },
      { h: '3. Thì trong mệnh đề thời gian', b: [
        { ul: ['Mệnh đề thời gian nói về tương lai dùng **hiện tại đơn**: **I\'ll text you when I get home.** (✗ when I will get home)', '**while** + quá khứ tiếp diễn: **While I was studying, my brother was playing games.**', '**when** + quá khứ đơn cho hành động xen vào: **I was sleeping when the phone rang.**', '**since** + mốc thời gian với hiện tại hoàn thành: **I have lived here since 2019.**'] }
      ] }
    ],
    ex: [
      ['When I got home, my mother was cooking.', 'Khi mình về nhà, mẹ đang nấu ăn.'], ['I\'ll call you as soon as I arrive.', 'Mình sẽ gọi bạn ngay khi mình đến nơi.'], ['She went to bed after she had finished her homework.', 'Cô ấy đi ngủ sau khi làm xong bài tập.'],
      ['We stayed at home because it was raining heavily.', 'Chúng mình ở nhà vì trời mưa to.'], ['Although he is rich, he lives simply.', 'Dù giàu có, ông ấy sống giản dị.'], ['I read a book while I was waiting for the bus.', 'Mình đọc sách trong lúc đợi xe buýt.'],
      ['Wash your hands before you eat.', 'Hãy rửa tay trước khi ăn.'], ['You can\'t go out until you finish your homework.', 'Con không được ra ngoài cho đến khi làm xong bài tập.'], ['Unless we leave now, we\'ll miss the train.', 'Nếu chúng ta không đi ngay thì sẽ lỡ tàu.']
    ],
    mis: [
      ['Although it was cold, but we went swimming.', 'Although it was cold, we went swimming.', 'Không dùng although và but cùng lúc.'], ['I will call you when I will arrive.', 'I will call you when I arrive.', 'Mệnh đề thời gian chỉ tương lai dùng hiện tại đơn.'],
      ['Because it rained. We stayed home.', 'Because it rained, we stayed home.', 'Mệnh đề phụ không đứng một mình; nối bằng dấu phẩy.'], ['Unless you don\'t hurry, you will be late.', 'Unless you hurry, you will be late.', 'Unless đã mang nghĩa phủ định (= If you don\'t).']
    ],
    quiz: [
      ['___ it was raining, we played football.', ['Because', 'Although', 'So', 'But'], 1, 'Nhượng bộ: Mặc dù mưa nhưng vẫn chơi → Although.'],
      ['I\'ll tell you the news as soon as I ___ home.', ['will get', 'get', 'got', 'am getting'], 1, 'Mệnh đề thời gian tương lai → hiện tại đơn.'],
      ['She was reading ___ the phone rang.', ['because', 'when', 'unless', 'so'], 1, 'Hành động xen vào → when.'],
      ['We didn\'t go out ___ it was too cold.', ['although', 'because', 'but', 'unless'], 1, 'Nêu lý do → because.'],
      ['You will not pass ___ you study harder.', ['if', 'unless', 'when', 'because'], 1, 'unless = if … not.'],
      ['___ I was cooking, my sister was setting the table.', ['While', 'Because', 'Unless', 'Although'], 0, 'Hai hành động song song → While.'],
      ['Please call me ___ you need any help.', ['unless', 'although', 'if', 'because'], 2, 'Điều kiện → if.'],
      ['Which sentence is correct?', ['Although he was ill, but he went to school.', 'Although he was ill, he went to school.', 'He was ill although, he went to school.', 'Although he was ill so he went to school.'], 1, 'Chỉ cần although, không dùng but/so thêm.'],
      ['I have known her ___ we were children.', ['since', 'for', 'when will', 'during'], 0, 'since + mốc thời gian.']
    ]
  });

  L('g8-comparisons-as-as', {
    grade: 8, icon: '⚖️', title: 'So sánh bằng, kém và so sánh của trạng từ', sub: 'as…as, less…than & adverb comparisons', level: 'Trung bình',
    summary: 'Nói hai người/vật bằng nhau (as…as), kém hơn (not as…as, less…than), và so sánh trạng từ (faster, more carefully).',
    sections: [
      { h: '1. So sánh bằng và kém', b: [
        { f: ['(=) **as + adj/adv + as**: She is **as tall as** her brother.', '(≠) **not as/so + adj/adv + as**: This bag is **not as expensive as** that one.', '**less + adj + than** (ít hơn/kém hơn): This road is **less busy than** the main one.', '**the same + noun + as**: We are **the same age as** them.'] },
        { tip: 'Với **as…as** dùng tính từ/trạng từ **nguyên mẫu** (không thêm -er): ✗ as taller as.' }
      ] },
      { h: '2. So sánh của trạng từ', b: [
        { t: { h: ['Loại', 'So sánh hơn', 'So sánh nhất', 'Ví dụ'], r: [['Trạng từ ngắn (fast, hard, early, late)', 'fast**er**', '(the) fast**est**', 'He runs **faster than** me.'], ['Trạng từ dài (-ly)', '**more** carefully', '**the most** carefully', 'Write **more carefully**.'], ['Bất quy tắc: well', '**better**', '**the best**', 'She sings **better than** I do.'], ['badly', '**worse**', '**the worst**', 'He played **the worst** today.']] } }
      ] },
      { h: '3. Một số mẫu hay gặp', b: [
        { ul: ['**twice as … as / three times as … as**: This bag is **twice as heavy as** that one.', '**as much/many … as**: She has **as many books as** I do.', '**the + so sánh hơn, the + so sánh hơn**: **The more** you practise, **the better** you speak.', 'Nhấn mạnh so sánh hơn: **much / a lot / far + so sánh hơn**: much faster, a lot more interesting.'] },
        { warn: 'Không dùng **more** với tính từ/trạng từ đã có -er: ✗ more faster → ✓ faster.' }
      ] }
    ],
    ex: [
      ['My brother is as tall as my father.', 'Em/anh mình cao bằng bố.'], ['This exam wasn\'t as difficult as the last one.', 'Bài thi này không khó bằng bài trước.'], ['Tom swims faster than anyone in our class.', 'Tom bơi nhanh hơn bất kỳ ai trong lớp.'],
      ['Please speak more slowly.', 'Làm ơn nói chậm hơn.'], ['She dances better than I do.', 'Cô ấy nhảy giỏi hơn mình.'], ['This film is less interesting than the book.', 'Bộ phim kém thú vị hơn quyển sách.'],
      ['He worked the hardest in the team.', 'Anh ấy làm việc chăm chỉ nhất đội.'], ['The more you read, the more you learn.', 'Càng đọc nhiều, bạn càng học được nhiều.'], ['Our house is twice as big as theirs.', 'Nhà chúng mình rộng gấp đôi nhà họ.']
    ],
    mis: [
      ['She is as taller as her sister.', 'She is as tall as her sister.', 'as…as dùng tính từ nguyên mẫu.'], ['He runs more faster than me.', 'He runs faster than me.', 'faster đã là so sánh hơn.'], ['This is more good than that.', 'This is better than that.', 'good → better (bất quy tắc).'],
      ['She sings good.', 'She sings well.', 'Bổ nghĩa cho động từ dùng trạng từ well.'], ['He is not so taller than me.', 'He is not as tall as me.', 'not as/so + adj nguyên mẫu + as.']
    ],
    quiz: [
      ['My bag is as ___ as yours.', ['heavier', 'heavy', 'heaviest', 'more heavy'], 1, 'as + adj + as: heavy.'],
      ['She speaks English ___ than her brother.', ['good', 'well', 'better', 'best'], 2, 'So sánh hơn của well → better.'],
      ['This test was ___ difficult than the last one.', ['less', 'least', 'as', 'much'], 0, 'less + adj + than.'],
      ['Please drive ___. The road is wet.', ['careful', 'more careful', 'more carefully', 'carefully than'], 2, 'Cần trạng từ so sánh: more carefully.'],
      ['The ___ you practise, the better you speak.', ['more', 'most', 'many', 'much'], 0, 'The more…, the better…'],
      ['He is not as ___ as his father.', ['taller', 'tall', 'tallest', 'more tall'], 1, 'not as + adj nguyên mẫu + as.'],
      ['Tom ran ___ in the race.', ['fast', 'the fastest', 'more fast', 'fastly'], 1, 'So sánh nhất trạng từ: the fastest.'],
      ['This bag is twice as ___ as that one.', ['expensive', 'more expensive', 'expensiver', 'most expensive'], 0, 'twice as + adj + as.'],
      ['She plays tennis ___ than I do.', ['badly', 'worse', 'worst', 'more bad'], 1, 'badly → worse.']
    ]
  });

  L('g8-modals-probability', {
    grade: 8, icon: '🔮', title: 'Suy đoán với may, might, could, must, can\'t', sub: 'Modals of probability', level: 'Trung bình',
    summary: 'Diễn đạt mức độ chắc chắn về điều đang xảy ra hoặc có thể xảy ra: chắc chắn, có thể, không thể.',
    sections: [
      { h: '1. Thang mức độ chắc chắn', b: [
        { t: { h: ['Mức', 'Từ', 'Ví dụ'], r: [['Chắc chắn đúng (~95%)', '**must** + V', 'He **must** be at home. His light is on.'], ['Có thể (~50%)', '**may / might / could** + V', 'She **might** be ill. / It **could** rain later.'], ['Chắc chắn không (~5%)', '**can\'t / couldn\'t** + V', 'That **can\'t** be Tom. He\'s in Hue.']] } },
        { p: 'Cấu trúc: **S + must / may / might / could / can\'t + V (nguyên mẫu)**. Với hành động đang diễn ra: **must/might + be + V-ing**: **He must be sleeping.**' }
      ] },
      { h: '2. Lưu ý', b: [
        { ul: ['**must** trong nghĩa suy đoán nói về điều bạn **tin chắc** dựa trên dấu hiệu (không phải bắt buộc).', 'Phủ định của **must** (suy đoán) là **can\'t**, **không phải** mustn\'t: ✗ He mustn\'t be at home → ✓ He **can\'t** be at home.', '**may / might / could** gần nghĩa; **might** thể hiện khả năng thấp hơn một chút.', 'Câu hỏi về khả năng dùng **Could** hoặc **Can**: Could it be true? (không dùng may/might ở câu hỏi).'] },
        { tip: 'So sánh nghĩa của must: **You must wear a helmet.** (bắt buộc) ≠ **You must be tired.** (suy đoán rằng bạn chắc mệt).' }
      ] },
      { h: '3. Ví dụ theo tình huống', b: [
        { ul: ['Nghe tiếng gõ cửa: "It **must** be the postman." (tin chắc)', 'Chưa biết kết quả: "We **might** win the match." (có thể)', 'Thấy trời nắng chang chang: "It **can\'t** rain today." (không thể)'] }
      ] }
    ],
    ex: [
      ['She must be tired. She worked all night.', 'Cô ấy chắc là mệt. Cô ấy làm việc cả đêm.'], ['It might rain this afternoon, so take an umbrella.', 'Chiều nay có thể mưa, nên hãy mang ô.'], ['He can\'t be at school. Today is Sunday.', 'Cậu ấy không thể ở trường. Hôm nay là Chủ nhật.'],
      ['They may be late because of the traffic.', 'Họ có thể đến muộn vì tắc đường.'], ['That could be the answer.', 'Đó có thể là đáp án.'], ['The phone is ringing. It must be Mum.', 'Điện thoại đang reo. Chắc là mẹ.'],
      ['You must be joking!', 'Bạn đùa chắc!'], ['I\'m not sure, but she might be sleeping now.', 'Mình không chắc, nhưng có thể cô ấy đang ngủ.'], ['This can\'t be true!', 'Điều này không thể là thật!']
    ],
    mis: [
      ['He mustn\'t be at home. The lights are off.', 'He can\'t be at home. The lights are off.', 'Suy đoán phủ định → can\'t.'], ['She might to be ill.', 'She might be ill.', 'Sau might dùng V nguyên mẫu không to.'], ['It could rains tonight.', 'It could rain tonight.', 'could + V nguyên mẫu.'],
      ['May it be true?', 'Could it be true?', 'Câu hỏi suy đoán dùng could.']
    ],
    quiz: [
      ['The lights are on, so he ___ be at home.', ['can\'t', 'must', 'mustn\'t', 'doesn\'t'], 1, 'Tin chắc dựa trên dấu hiệu → must.'],
      ['"Where\'s Lan?" "I\'m not sure. She ___ be in the library."', ['must', 'might', 'can\'t', 'should'], 1, 'Không chắc → might.'],
      ['That ___ be Tom. He is in Singapore now.', ['must', 'might', 'can\'t', 'may'], 2, 'Chắc chắn không → can\'t.'],
      ['It ___ rain later, so take an umbrella.', ['must', 'could', 'can\'t', 'mustn\'t'], 1, 'Có khả năng → could.'],
      ['He has worked 12 hours. He ___ be exhausted.', ['must', 'could', 'might not', 'can\'t'], 0, 'Suy đoán chắc chắn → must.'],
      ['Which sentence is correct?', ['She must to be late.', 'She might be late.', 'She mights be late.', 'She might being late.'], 1, 'might + V nguyên mẫu.'],
      ['The shop is closed. They ___ be on holiday.', ['can\'t', 'may', 'don\'t', 'doesn\'t'], 1, 'Khả năng → may.'],
      ['It is 3 a.m. Everyone ___ be sleeping now.', ['must', 'can\'t', 'mustn\'t', 'doesn\'t'], 0, 'Tin chắc dựa trên giờ giấc → must be + V-ing.'],
      ['I\'m not sure about the answer. It ___ be B.', ['must', 'can\'t', 'might', 'mustn\'t'], 2, 'Không chắc → might.']
    ]
  });

  L('g8-indefinite-pronouns', {
    grade: 8, icon: '🕵️', title: 'Đại từ bất định: someone, anything, nobody, everywhere…', sub: 'some- / any- / no- / every- compounds', level: 'Trung bình',
    summary: 'Dùng đúng someone/anyone/no one/everyone, something/anything/nothing/everything, somewhere/anywhere/nowhere/everywhere.',
    sections: [
      { h: '1. Bảng tổng hợp', b: [
        { t: { h: ['', 'some-', 'any-', 'no-', 'every-'], r: [['người', 'someone / somebody', 'anyone / anybody', 'no one / nobody', 'everyone / everybody'], ['vật', 'something', 'anything', 'nothing', 'everything'], ['nơi chốn', 'somewhere', 'anywhere', 'nowhere', 'everywhere']] } },
        { ul: ['**some-** : khẳng định, lời mời/đề nghị: I saw **someone** there. Would you like **something** to drink?', '**any-** : phủ định và câu hỏi; hoặc "bất kỳ": I didn\'t see **anyone**. Is there **anything** to eat? **Anyone** can join.', '**no-** : nghĩa phủ định, động từ ở **khẳng định**: **Nobody** came. = I didn\'t see **anybody**.', '**every-** : tất cả, động từ chia **số ít**: **Everyone is** here. **Everything was** fine.'] }
      ] },
      { h: '2. Các điểm cần nhớ', b: [
        { ul: ['Các từ trên đều chia **động từ số ít**: **Everybody is** happy. **Nothing is** impossible.', 'Không dùng **hai phủ định**: ✗ I don\'t know nothing. → ✓ I don\'t know anything. / I know nothing.', 'Tính từ đứng **sau** đại từ: **something interesting, anything new, someone kind, nowhere safe**.', 'Đại từ thay thế: dùng **they/them/their** chỉ chung: Everyone has **their** own book.'] },
        { tip: 'Ở câu hỏi mời/xin phép, vẫn dùng **some-**: **Would you like something to eat?** · **Can I have something to drink?**' }
      ] },
      { h: '3. So sánh no one – none – nothing', b: [
        { t: { h: ['Từ', 'Dùng khi', 'Ví dụ'], r: [['no one / nobody', 'không có ai', 'Nobody knows the answer.'], ['nothing', 'không có gì', 'There\'s nothing in the box.'], ['none (of)', 'không ai/cái nào trong một nhóm', 'None of the students were late.']] } }
      ] }
    ],
    ex: [
      ['Someone is knocking at the door.', 'Có ai đó đang gõ cửa.'], ['I\'m hungry. Is there anything to eat?', 'Mình đói. Có gì ăn không?'], ['There is nobody in the classroom.', 'Không có ai trong lớp học.'],
      ['Everything was ready for the party.', 'Mọi thứ đã sẵn sàng cho bữa tiệc.'], ['I looked everywhere, but I couldn\'t find my keys.', 'Mình tìm khắp nơi mà không thấy chìa khoá.'], ['Would you like something to drink?', 'Bạn có muốn uống gì không?'],
      ['She has nowhere to go tonight.', 'Tối nay cô ấy không có chỗ nào để đi.'], ['Everyone is waiting for you.', 'Mọi người đang đợi bạn.'], ['He told us something interesting.', 'Cậu ấy kể cho chúng mình điều gì đó thú vị.']
    ],
    mis: [
      ['I don\'t know nothing about it.', 'I don\'t know anything about it.', 'Tránh hai phủ định.'], ['Everybody are here.', 'Everybody is here.', 'every- chia số ít.'], ['I saw anyone in the garden.', 'I saw someone in the garden.', 'Câu khẳng định → someone.'],
      ['I want to eat something sweet nowhere.', 'I want to eat something sweet.', 'Dùng đại từ phù hợp; không thêm nowhere.'], ['Nobody didn\'t come.', 'Nobody came.', 'Nobody đã mang nghĩa phủ định.']
    ],
    quiz: [
      ['I can\'t find my wallet ___. It\'s gone.', ['somewhere', 'anywhere', 'nowhere', 'everywhere'], 1, 'Phủ định → anywhere.'],
      ['___ is ready. Let\'s start the meeting.', ['Everyone', 'No one', 'Anyone', 'Someone'], 0, 'Tất cả sẵn sàng → Everyone.'],
      ['There isn\'t ___ in the fridge.', ['something', 'anything', 'nothing', 'everything'], 1, 'Phủ định → anything.'],
      ['Would you like ___ to drink?', ['anything', 'something', 'nothing', 'anyone'], 1, 'Lời mời → something.'],
      ['___ knows where he lives. It\'s a secret.', ['Everybody', 'Nobody', 'Anybody', 'Somebody'], 1, 'Bí mật → Nobody.'],
      ['Everybody ___ happy at the party.', ['was', 'were', 'are', 'be'], 0, 'Everybody + động từ số ít.'],
      ['I need ___ cold to drink.', ['something', 'cold something', 'somewhere', 'someone'], 0, 'something + tính từ.'],
      ['Which sentence is correct?', ['I didn\'t see nobody.', 'I didn\'t see anybody.', 'I saw nobody anything.', 'I didn\'t saw anybody.'], 1, 'Phủ định đơn + anybody.'],
      ['We looked ___ for the cat, but it was lost.', ['everywhere', 'nowhere', 'everything', 'anyone'], 0, 'tìm khắp nơi → everywhere.']
    ]
  });

  L('g8-phrasal-verbs-basic', {
    grade: 8, icon: '🧷', title: 'Cụm động từ thông dụng (Phrasal verbs)', sub: 'Basic phrasal verbs', level: 'Trung bình',
    summary: 'Hiểu và dùng các cụm động từ + giới từ/trạng từ phổ biến: get up, look for, turn on, give up, take off… và vị trí của tân ngữ.',
    sections: [
      { h: '1. Phrasal verb là gì?', b: [
        { p: '**Phrasal verb = động từ + (giới từ/trạng từ)**, nghĩa thường **khác nghĩa từng từ**: **look** (nhìn) + **after** → **look after** (chăm sóc). Cần học theo cụm.' },
        { t: { h: ['Cụm', 'Nghĩa', 'Ví dụ'], r: [['get up', 'thức dậy', 'I get up at 6.'], ['wake up', 'tỉnh dậy', 'She wakes up early.'], ['turn on / turn off', 'bật / tắt', 'Turn off the light.'], ['put on / take off', 'mặc, đội vào / cởi ra', 'Put on your coat.'], ['look for', 'tìm kiếm', 'I\'m looking for my keys.'], ['look after', 'chăm sóc', 'She looks after her baby brother.'], ['give up', 'từ bỏ', 'Don\'t give up!'], ['find out', 'tìm ra', 'Let\'s find out the answer.'], ['come back', 'quay lại', 'He came back late.'], ['grow up', 'lớn lên', 'I grew up in Hue.']] } }
      ] },
      { h: '2. Vị trí của tân ngữ', b: [
        { p: 'Có hai loại: **tách được** (tân ngữ đứng giữa hoặc sau) và **không tách được**.' },
        { ul: ['**Tách được**: turn **on** the TV = turn the TV **on**. Nếu tân ngữ là **đại từ** (it, them, me…) thì **bắt buộc đứng giữa**: turn **it** on (✗ turn on it).', '**Không tách được**: look **after** her, look **for** it, get **on** the bus — tân ngữ luôn đứng sau.', 'Không có tân ngữ: **Please sit down. The plane took off.**'] },
        { warn: 'Với phrasal verb tách được, **đại từ nhân xưng** luôn đứng giữa: ✓ Put **it** on. ✗ Put on it.' }
      ] },
      { h: '3. Nhóm theo chủ đề', b: [
        { t: { h: ['Chủ đề', 'Phrasal verbs'], r: [['Hằng ngày', 'get up, wake up, put on, take off, turn on/off, clean up'], ['Học tập', 'look up (tra từ), fill in (điền), write down (ghi lại), give up, find out'], ['Đi lại', 'get on/off (xe buýt, tàu), get in/out (ô tô), set off (khởi hành), pick up (đón), drop off (cho xuống)'], ['Quan hệ', 'get on with (hoà hợp), look after, take after (giống), grow up']] } }
      ] }
    ],
    ex: [
      ['I get up at six every morning.', 'Mình thức dậy lúc sáu giờ mỗi sáng.'], ['Please turn off the lights when you leave.', 'Hãy tắt đèn khi bạn ra khỏi phòng.'], ['Take off your shoes before you come in.', 'Hãy cởi giày trước khi vào nhà.'],
      ['I\'m looking for my glasses. Can you help me?', 'Mình đang tìm kính. Bạn giúp mình nhé?'], ['She looks after her little sister after school.', 'Cô ấy chăm em gái sau giờ học.'], ['Don\'t give up. You can do it!', 'Đừng bỏ cuộc. Bạn làm được mà!'],
      ['Look up the new word in the dictionary.', 'Hãy tra từ mới trong từ điển.'], ['We set off at 5 a.m. to avoid the traffic.', 'Chúng mình khởi hành lúc 5 giờ sáng để tránh tắc đường.'], ['I\'ll pick you up at 7. — OK, see you then.', 'Mình sẽ đón bạn lúc 7 giờ. — Ừ, hẹn gặp.']
    ],
    mis: [
      ['Turn on it, please.', 'Turn it on, please.', 'Đại từ phải đứng giữa phrasal verb tách được.'], ['I look for after my baby sister.', 'I look after my baby sister.', 'look after = chăm sóc.'], ['She is looking after her keys. (tìm)', 'She is looking for her keys.', 'Tìm kiếm là look for.'],
      ['He gave up it.', 'He gave it up.', 'give up tách được: đại từ ở giữa.']
    ],
    quiz: [
      ['Please ___ your shoes before you enter the house.', ['take off', 'take away', 'take after', 'take for'], 0, 'take off = cởi (giày, áo).'],
      ['I can\'t find my phone. I\'m ___ it everywhere.', ['looking after', 'looking for', 'looking up', 'looking at'], 1, 'look for = tìm kiếm.'],
      ['It\'s dark here. Can you ___ the light?', ['turn on', 'turn up', 'turn after', 'turn back'], 0, 'turn on the light = bật đèn.'],
      ['Don\'t ___! Keep trying and you\'ll succeed.', ['give up', 'give out', 'give off', 'give away'], 0, 'give up = từ bỏ.'],
      ['My grandmother ___ us when our parents are at work.', ['looks for', 'looks after', 'looks up', 'looks like'], 1, 'look after = chăm sóc.'],
      ['The light is on. Please turn ___ off.', ['it', 'its', 'itself', 'of it'], 0, 'Turn it off (đại từ ở giữa).'],
      ['We ___ at 6 a.m. and arrived at noon.', ['set off', 'set up', 'set on', 'set in'], 0, 'set off = khởi hành.'],
      ['I don\'t know this word. I\'ll ___ it up in the dictionary.', ['look', 'find', 'give', 'turn'], 0, 'look it up = tra cứu.'],
      ['She was born in Hue but ___ in Hanoi.', ['grew up', 'took up', 'woke up', 'got off'], 0, 'grew up = lớn lên.']
    ]
  });
})();
