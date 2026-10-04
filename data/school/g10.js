/* Tiếng Anh phổ thông — Lớp 10 (ngữ pháp). Nội dung tự biên soạn cho English With Tom. */
(function () {
  var S = (window.SCHOOL = window.SCHOOL || { lessons: {} });
  function L(id, d) { d.id = id; S.lessons[id] = d; }

  L('g10-tenses-review', {
    grade: 10, icon: '🗂️', title: 'Tổng ôn các thì quan trọng', sub: 'Present · Past · Future', level: 'Trung bình',
    summary: 'Bảng tổng hợp công thức, cách dùng, dấu hiệu và cách phân biệt các thì hay nhầm.',
    sections: [
      { h: '1. Bảng tổng hợp', b: [
        { t: { h: ['Thì', 'Công thức (+)', 'Dấu hiệu'], r: [['Hiện tại đơn', 'S + V(s/es)', 'always, usually, every day'], ['Hiện tại tiếp diễn', 'S + am/is/are + V-ing', 'now, at the moment, Look!'], ['Hiện tại hoàn thành', 'S + have/has + V3', 'already, yet, ever, since, for'], ['Hiện tại hoàn thành tiếp diễn', 'S + have/has been + V-ing', 'for/since + thời gian, all day, recently'], ['Quá khứ đơn', 'S + V2/V-ed', 'yesterday, ago, in 2020, last week'], ['Quá khứ tiếp diễn', 'S + was/were + V-ing', 'at 8 p.m. yesterday, while, when'], ['Quá khứ hoàn thành', 'S + had + V3', 'before, after, by the time, already (trước mốc quá khứ)'], ['Tương lai đơn', 'S + will + V', 'tomorrow, next week, I think...'], ['Tương lai gần', 'S + am/is/are going to + V', 'kế hoạch, dự đoán có bằng chứng']] } }
      ] },
      { h: '2. Cặp dễ nhầm', b: [
        { ul: ['**Quá khứ đơn** (đã kết thúc, có mốc thời gian) và **hiện tại hoàn thành** (còn liên quan đến hiện tại): **I lived in Hue in 2015.** / **I have lived in Hue since 2015.**', '**Hiện tại hoàn thành** (nhấn vào kết quả) và **hiện tại hoàn thành tiếp diễn** (nhấn vào quá trình): **I have painted the room.** (đã xong) / **I have been painting the room.** (đang làm, có thể chưa xong)', '**Quá khứ đơn** và **quá khứ hoàn thành**: **When I arrived, the train left.** (tàu rời đi sau khi mình đến) / **When I arrived, the train had left.** (tàu đã đi trước khi mình đến)'] },
        { tip: 'Mệnh đề thời gian (when, after, as soon as, before, until, by the time) nói về tương lai dùng **hiện tại đơn**, không dùng will: **I will call you when I arrive.**' }
      ] }
    ],
    ex: [['She usually walks to school, but today she is taking the bus.', 'Cô ấy thường đi bộ đến trường nhưng hôm nay đi xe buýt.'], ['I have lived here since 2018.', 'Mình sống ở đây từ năm 2018.'], ['He was watching TV when the phone rang.', 'Anh ấy đang xem TV thì điện thoại reo.'], ['By the time we arrived, the film had started.', 'Khi chúng mình đến thì bộ phim đã bắt đầu.'], ['I have been waiting for you for an hour.', 'Mình đã đợi bạn suốt một tiếng rồi.'], ['We will go out as soon as it stops raining.', 'Chúng mình sẽ ra ngoài ngay khi trời tạnh mưa.'], ['She has just finished her homework.', 'Cô ấy vừa làm xong bài tập.'], ['They are going to open a new shop next month.', 'Họ sắp mở một cửa hàng mới vào tháng tới.']],
    mis: [['I have seen him yesterday.', 'I saw him yesterday.', 'yesterday → quá khứ đơn.'], ['I will call you when I will arrive.', 'I will call you when I arrive.', 'Mệnh đề thời gian dùng hiện tại đơn cho tương lai.'], ['When I arrived, they already left.', 'When I arrived, they had already left.', 'Việc xảy ra trước một mốc quá khứ → quá khứ hoàn thành.'], ['He is knowing the answer.', 'He knows the answer.', 'know là động từ chỉ trạng thái.']],
    quiz: [
      ['Look! The children ___ in the garden.', ['play', 'are playing', 'have played', 'played'], 1, 'Look! → hiện tại tiếp diễn.'],
      ['I ___ my keys. Can you help me find them?', ['lost', 'have lost', 'was losing', 'lose'], 1, 'Kết quả ở hiện tại → hiện tại hoàn thành.'],
      ['By the time I got to the station, the train ___.', ['left', 'has left', 'had left', 'was leaving'], 2, 'Việc xảy ra trước mốc quá khứ → quá khứ hoàn thành.'],
      ['I ___ you as soon as I get there.', ['will call', 'would call', 'called', 'am calling'], 0, 'Tương lai (as soon as + hiện tại đơn): will call.'],
      ['She ___ English for five years.', ['studies', 'is studying', 'has been studying', 'studied'], 2, 'for five years + còn tiếp diễn → has been studying.'],
      ['He ___ his leg while he was playing football yesterday.', ['breaks', 'broke', 'has broken', 'was breaking'], 1, 'yesterday → quá khứ đơn.'],
      ['We ___ to the beach next week.', ['go', 'are going', 'went', 'have gone'], 1, 'Kế hoạch → are going.'],
      ['Mr Lee ___ in Hue since he was a child.', ['lives', 'lived', 'has lived', 'is living'], 2, 'since + mốc thời gian → has lived.']
    ]
  });

  L('g10-past-perfect', {
    grade: 10, icon: '⏮️', title: 'Quá khứ hoàn thành & hiện tại hoàn thành tiếp diễn', sub: 'had + V3 · have/has been + V-ing', level: 'Trung bình',
    summary: 'Diễn tả hành động xảy ra trước một hành động/mốc trong quá khứ, và quá trình kéo dài đến hiện tại.',
    sections: [
      { h: '1. Quá khứ hoàn thành', b: [
        { f: ['(+) S + had + V3', "(-) S + hadn't + V3", '(?) Had + S + V3?'] },
        { ul: ['Hành động xảy ra **trước** một hành động/mốc khác trong quá khứ: **When I arrived, the film had started.**', 'Thường đi với **before, after, when, by the time, already, just, as soon as, until**: **After she had finished, she went home.**', 'Cấu trúc **No sooner ... than / Hardly ... when**: **No sooner had he left than it started to rain.**'] },
        { tip: 'Hành động xảy ra **trước** dùng **had + V3**, hành động xảy ra **sau** dùng **quá khứ đơn**.' }
      ] },
      { h: '2. Hiện tại hoàn thành tiếp diễn', b: [
        { f: ['S + have/has been + V-ing'] },
        { ul: ['Hành động bắt đầu trong quá khứ, **kéo dài đến hiện tại**, nhấn vào quá trình: **I have been waiting for two hours.**', 'Hành động vừa kết thúc nhưng còn dấu vết ở hiện tại: **Your eyes are red. Have you been crying?**'] },
        { warn: 'Động từ chỉ trạng thái dùng hiện tại hoàn thành, không dùng tiếp diễn: **I have known him for years.** (không phải "have been knowing").' }
      ] }
    ],
    ex: [['When I arrived, the film had already started.', 'Khi mình đến, bộ phim đã bắt đầu rồi.'], ['After she had finished her homework, she watched TV.', 'Sau khi làm xong bài tập, cô ấy xem TV.'], ["I couldn't enter because I had lost my key.", 'Mình không vào được vì đã làm mất chìa khóa.'], ['By the time he came, we had eaten everything.', 'Khi anh ấy đến thì chúng mình đã ăn hết rồi.'], ['No sooner had we arrived than it began to rain.', 'Chúng mình vừa đến thì trời bắt đầu mưa.'], ['I have been learning English for six years.', 'Mình đã học tiếng Anh được sáu năm.'], ['Why are you so tired? Have you been working all day?', 'Sao bạn mệt vậy? Bạn làm việc cả ngày à?'], ['She has known him since they were children.', 'Cô ấy biết anh ấy từ khi họ còn nhỏ.']],
    mis: [['When I arrived, the film already started.', 'When I arrived, the film had already started.', 'Việc xảy ra trước mốc quá khứ → had + V3.'], ['After he finished, he had gone home.', 'After he had finished, he went home.', 'Hành động xảy ra trước dùng had + V3.'], ['I have been knowing him for years.', 'I have known him for years.', 'know là động từ chỉ trạng thái.'], ['No sooner he had arrived than it rained.', 'No sooner had he arrived than it rained.', 'Đảo ngữ sau No sooner.']],
    quiz: [
      ['When I got home, my mother ___ dinner.', ['already cooked', 'had already cooked', 'has already cooked', 'was already cook'], 1, 'Nấu xong trước khi mình về → had already cooked.'],
      ['She was sad because she ___ her phone.', ['lost', 'had lost', 'has lost', 'was losing'], 1, 'Việc mất điện thoại xảy ra trước nỗi buồn → had lost.'],
      ['After they ___ dinner, they went for a walk.', ['had finished', 'have finished', 'finish', 'were finishing'], 0, 'Hành động xảy ra trước: had finished.'],
      ['I ___ for you for an hour. Where have you been?', ['wait', 'waited', 'have been waiting', 'am waiting'], 2, 'for an hour + kéo dài đến hiện tại → have been waiting.'],
      ['No sooner ___ the house than it began to rain.', ['he left', 'had he left', 'he had left', 'did he left'], 1, 'No sooner + đảo ngữ: had he left.'],
      ['Her eyes are red. She ___.', ['cries', 'has been crying', 'cried', 'is cry'], 1, 'Dấu vết còn ở hiện tại → has been crying.'],
      ['By the time we reached the cinema, the film ___.', ['started', 'had started', 'has started', 'starts'], 1, 'By the time + quá khứ đơn, mệnh đề kia dùng had + V3.'],
      ['We ___ each other since 2015.', ['know', 'knew', 'have known', 'have been knowing'], 2, 'know không dùng tiếp diễn; since → have known.']
    ]
  });

  L('g10-conditional-3', {
    grade: 10, icon: '🔮', title: 'Câu điều kiện loại 3 và hỗn hợp', sub: 'If + had V3, would have V3', level: 'Nâng cao',
    summary: 'Nói về điều không có thật trong quá khứ và hậu quả trái ngược; câu điều kiện hỗn hợp.',
    sections: [
      { h: '1. Loại 3 (không có thật trong quá khứ)', b: [
        { f: ['If + S + had + V3, S + would/could/might + have + V3'] },
        { p: '**If I had studied harder, I would have passed the exam.** (Thực tế: mình không học chăm nên trượt.)' },
        { p: 'Ước điều trái với quá khứ: **S + wish + S + had + V3**; **If only + had + V3**: **I wish I had listened to you.**' }
      ] },
      { h: '2. Điều kiện hỗn hợp', b: [
        { ul: ['Điều kiện trong quá khứ → kết quả ở hiện tại: **If + had V3, would + V**: **If I had saved money, I would be rich now.**', 'Điều kiện ở hiện tại → kết quả trong quá khứ: **If + V2/were, would have V3**: **If she were more careful, she wouldn\'t have broken the vase.**'] },
        { warn: 'Không dùng **would have** trong mệnh đề **if**: **If I would have known** là sai → **If I had known**.' }
      ] }
    ],
    ex: [['If I had studied harder, I would have passed the exam.', 'Nếu mình học chăm hơn thì mình đã đỗ kỳ thi.'], ["If it hadn't rained, we would have gone camping.", 'Nếu trời không mưa thì chúng mình đã đi cắm trại.'], ['If she had left earlier, she could have caught the train.', 'Nếu cô ấy đi sớm hơn thì đã kịp tàu.'], ['What would you have done if you had missed the flight?', 'Bạn sẽ làm gì nếu lỡ chuyến bay?'], ['I wish I had listened to my parents.', 'Giá mà mình đã nghe lời bố mẹ.'], ['If only I had known the truth!', 'Giá mà mình biết sự thật!'], ['If I had saved more money, I would be rich now.', 'Nếu hồi đó mình tiết kiệm hơn thì bây giờ mình đã giàu.'], ['If he were more careful, he wouldn\'t have made so many mistakes.', 'Nếu cậu ấy cẩn thận hơn thì đã không mắc nhiều lỗi như vậy.']],
    mis: [['If I would have known, I would have told you.', 'If I had known, I would have told you.', 'Mệnh đề if loại 3 dùng had + V3.'], ['If she had studied, she would passed.', 'If she had studied, she would have passed.', 'would have + V3.'], ['If he studied harder last year, he would have passed.', 'If he had studied harder last year, he would have passed.', 'last year là quá khứ → mệnh đề if dùng had + V3.'], ['I wish I would have studied harder.', 'I wish I had studied harder.', 'Ước điều trái quá khứ → had + V3.']],
    quiz: [
      ['If I ___ harder, I would have passed the exam.', ['study', 'studied', 'had studied', 'would study'], 2, 'Loại 3: If + had V3.'],
      ["If it hadn't rained, we ___ to the beach.", ['would go', 'would have gone', 'will go', 'went'], 1, 'Loại 3: would have + V3.'],
      ['She would have won if she ___ so nervous.', ["weren't", "hadn't been", "wasn't", "wouldn't be"], 1, 'Loại 3: if + hadn\'t been.'],
      ['I wish I ___ more attention in class last year.', ['pay', 'paid', 'had paid', 'would pay'], 2, 'Ước điều trái quá khứ → had paid.'],
      ['If you had told me earlier, I ___ you.', ['would help', 'would have helped', 'helped', 'will help'], 1, 'Loại 3 → would have helped.'],
      ['If he had saved money, he ___ a house now. (hỗn hợp)', ['would own', 'would have owned', 'owned', 'will own'], 0, 'Điều kiện trong quá khứ, kết quả ở hiện tại (now) → would + V: would own.'],
      ['If only she ___ the truth!', ['knew', 'had known', 'would know', 'knows'], 1, 'If only + had V3 (tiếc nuối quá khứ).'],
      ["Which is correct?", ['If I would have known, I would have gone.', 'If I had known, I would have gone.', 'If I knew, I would have gone.', 'If I have known, I would gone.'], 1, 'Loại 3: If + had V3, would have V3.']
    ]
  });

  L('g10-linking-words', {
    grade: 10, icon: '🪢', title: 'Từ nối và liên từ', sub: 'however, therefore, despite, because of...', level: 'Trung bình',
    summary: 'Chọn từ nối đúng để liên kết ý: bổ sung, tương phản, nguyên nhân, kết quả.',
    sections: [
      { h: '1. Bảng từ nối', b: [
        { t: { h: ['Chức năng', 'Từ/cụm từ', 'Sau đó dùng'], r: [['Bổ sung', 'and, also, moreover, furthermore, in addition (to)', 'Moreover, + câu; in addition to + N/V-ing'], ['Tương phản', 'but, however, nevertheless, although, though, even though, while, whereas, despite, in spite of', 'although + S + V; despite + N/V-ing; However, + câu'], ['Nguyên nhân', 'because, since, as; because of, due to, owing to', 'because + S + V; because of + N/V-ing'], ['Kết quả', 'so, therefore, as a result, consequently, thus', 'so + S + V; Therefore, + câu'], ['Mục đích', 'to, in order to, so that', 'in order to + V'], ['Trình tự', 'first, then, after that, finally', '']] } }
      ] },
      { h: '2. Lưu ý quan trọng', b: [
        { ul: ['**because + mệnh đề** nhưng **because of + cụm danh từ**: **because it rained** / **because of the rain**.', '**although + mệnh đề** nhưng **despite / in spite of + cụm danh từ hoặc V-ing**: **although he was ill** / **despite his illness** / **despite being ill**.', 'Không dùng **although** và **but** trong cùng một câu.', '**however / therefore** thường đứng đầu câu hoặc sau dấu chấm phẩy, theo sau là dấu phẩy: **It was cold; however, we went out.**'] },
        { warn: 'Không viết "despite of". Đúng: **despite** hoặc **in spite of**.' }
      ] }
    ],
    ex: [['Although it was raining, we went out.', 'Mặc dù trời mưa, chúng mình vẫn ra ngoài.'], ['We went out despite the rain.', 'Chúng mình ra ngoài bất chấp cơn mưa.'], ['He was late because of the traffic jam.', 'Anh ấy đến muộn vì kẹt xe.'], ['She studied hard; therefore, she passed the exam.', 'Cô ấy học chăm; vì vậy cô ấy đỗ kỳ thi.'], ['The hotel was cheap. However, it was very clean.', 'Khách sạn rẻ. Tuy nhiên nó rất sạch.'], ['He likes tea, whereas his wife prefers coffee.', 'Anh ấy thích trà, trong khi vợ anh ấy thích cà phê hơn.'], ['In addition to English, she speaks French.', 'Ngoài tiếng Anh, cô ấy còn nói tiếng Pháp.'], ['The shop was closed, so we went home.', 'Cửa hàng đóng cửa nên chúng mình về nhà.']],
    mis: [['Because of it was raining, we stayed home.', 'Because it was raining, we stayed home. / Because of the rain, we stayed home.', 'because + mệnh đề; because of + danh từ.'], ['Despite of the rain, we went out.', 'Despite the rain, we went out. / In spite of the rain, ...', 'Không có "despite of".'], ['Although he was tired, but he kept working.', 'Although he was tired, he kept working.', 'Không dùng although và but cùng lúc.'], ['He was ill, however, he went to school.', 'He was ill; however, he went to school. / He was ill. However, he went to school.', 'Không nối hai câu chỉ bằng dấu phẩy với however.']],
    quiz: [
      ['___ the heavy traffic, we arrived on time.', ['Although', 'Despite', 'Because', 'However'], 1, 'Despite + cụm danh từ.'],
      ['He couldn\'t come ___ his illness.', ['because', 'because of', 'although', 'so'], 1, 'because of + cụm danh từ.'],
      ['It was raining; ___, we went for a walk.', ['because', 'nevertheless', 'so', 'as'], 1, 'Tương phản, đứng sau chấm phẩy và có dấu phẩy: nevertheless.'],
      ['She studied hard, ___ she passed the exam easily.', ['although', 'despite', 'so', 'however'], 2, 'Kết quả → so.'],
      ['___ he is rich, he is not happy.', ['Despite', 'Although', 'Because of', 'Therefore'], 1, 'Although + mệnh đề.'],
      ['I like tea, ___ my brother prefers coffee.', ['whereas', 'because', 'so', 'in spite of'], 0, 'Đối lập hai đối tượng → whereas.'],
      ['The film was long. ___, it was interesting.', ['Because', 'However', 'So', 'Although'], 1, 'Tương phản giữa hai câu → However,'],
      ['___ being tired, he finished the work.', ['Although', 'Because', 'In spite of', 'However'], 2, 'In spite of + V-ing.']
    ]
  });

  L('g10-modal-perfect', {
    grade: 10, icon: '🧐', title: 'Động từ khuyết thiếu + have + V3', sub: 'should have, must have, can\'t have...', level: 'Nâng cao',
    summary: 'Nói về suy đoán, tiếc nuối, phê bình về điều đã xảy ra trong quá khứ.',
    sections: [
      { h: '1. Cấu trúc và ý nghĩa', b: [
        { f: ['S + modal + have + V3'] },
        { t: { h: ['Cấu trúc', 'Ý nghĩa', 'Ví dụ'], r: [['should have + V3', 'đáng lẽ nên làm (nhưng đã không)', 'You should have studied harder.'], ["shouldn't have + V3", 'đáng lẽ không nên làm (nhưng đã làm)', "I shouldn't have eaten so much."], ['could have + V3', 'đã có thể làm (nhưng không làm)', 'She could have won the race.'], ['must have + V3', 'chắc hẳn đã (suy đoán chắc chắn)', 'He must have forgotten the key.'], ['might/may have + V3', 'có lẽ đã (không chắc)', 'She might have missed the bus.'], ["can't/couldn't have + V3", 'không thể nào đã (chắc chắn không)', "He can't have stolen it. He was abroad."], ["needn't have + V3", 'đã làm việc không cần thiết', "You needn't have bought flowers."]] } }
      ] },
      { h: '2. Lưu ý', b: [
        { warn: 'Luôn dùng **V3** sau have, và **have** (không phải has) sau modal: **must have gone**, không phải "must has went".' },
        { tip: '**needn\'t have done** (đã làm mà không cần) khác **didn\'t need to do** (không cần làm, và có thể không làm).' }
      ] }
    ],
    ex: [['You should have studied harder for the exam.', 'Đáng lẽ bạn nên học chăm hơn cho kỳ thi.'], ["I shouldn't have eaten so much cake.", 'Đáng lẽ mình không nên ăn nhiều bánh thế.'], ['She could have won the race, but she fell.', 'Cô ấy có thể đã thắng cuộc đua nhưng bị ngã.'], ['He must have forgotten our meeting.', 'Chắc hẳn anh ấy đã quên buổi hẹn.'], ['They might have missed the bus.', 'Có lẽ họ đã lỡ xe buýt.'], ["She can't have said that. She is very polite.", 'Cô ấy không thể nào đã nói vậy. Cô ấy rất lịch sự.'], ["You needn't have bought flowers. I have many.", 'Bạn không cần mua hoa đâu. Mình có nhiều rồi.'], ['The ground is wet. It must have rained last night.', 'Mặt đất ướt. Chắc đêm qua trời mưa.']],
    mis: [['You should have went home early.', 'You should have gone home early.', 'Sau have dùng V3 (gone).'], ['He must has forgotten it.', 'He must have forgotten it.', 'Sau modal dùng have, không dùng has.'], ["She can't be at the party yesterday.", "She can't have been at the party yesterday.", 'Suy đoán chắc chắn về quá khứ → can\'t have + V3.'], ["You didn't should go.", "You shouldn't have gone.", "Dùng shouldn't have + V3 cho điều đáng lẽ không nên làm."]],
    quiz: [
      ['The ground is wet. It ___ last night.', ['must rain', 'must have rained', 'should rain', 'can have rain'], 1, 'Suy đoán chắc chắn về quá khứ → must have + V3.'],
      ['You failed the test. You ___ harder.', ['should study', 'should have studied', 'must have studied', 'could study'], 1, 'Đáng lẽ nên làm (nhưng đã không) → should have studied.'],
      ['He ___ the answer. He wasn\'t even in the room.', ["can't have known", "must have known", "should know", "may know"], 0, "Không thể nào đã biết → can't have known."],
      ['I\'m not sure where she is. She ___ home already.', ['might have gone', 'should go', 'must go', 'can have gone'], 0, 'Có thể nhưng không chắc → might have gone.'],
      ['You ___ so much money on this. It was too expensive.', ["shouldn't spend", "shouldn't have spent", "mustn't spend", "can't have spend"], 1, "Đáng lẽ không nên → shouldn't have spent."],
      ['She ___ the match, but she was injured.', ['could have won', 'must win', 'can win', 'should win'], 0, 'Đã có thể (nhưng không) → could have won.'],
      ['We took umbrellas but it didn\'t rain. We ___ them.', ["needn't have taken", "mustn't have taken", "couldn't take", "shouldn't taken"], 0, 'Đã làm việc không cần thiết → needn\'t have taken.'],
      ['Tom was late. He ___ the bus.', ['might have missed', 'might missed', 'may have miss', 'might have miss'], 0, 'might have + V3.']
    ]
  });

  L('g10-question-tags', {
    grade: 10, icon: '🏷️', title: 'Câu hỏi đuôi', sub: 'Question tags', level: 'Trung bình',
    summary: 'Câu hỏi ngắn thêm vào cuối câu để xác nhận thông tin hoặc mời người nghe đồng ý.',
    sections: [
      { h: '1. Quy tắc cơ bản', b: [
        { ul: ['Câu **khẳng định** → đuôi **phủ định**: **She is a teacher, isn\'t she?**', 'Câu **phủ định** → đuôi **khẳng định**: **They don\'t like fish, do they?**', 'Đuôi dùng **trợ động từ/ to be/ modal** của câu chính. Nếu câu chính chỉ có động từ thường: dùng **do/does/did**: **He plays tennis, doesn\'t he?** / **You went out, didn\'t you?**', 'Chủ ngữ của đuôi là **đại từ**: **Tom is late, isn\'t he?**'] }
      ] },
      { h: '2. Trường hợp đặc biệt', b: [
        { t: { h: ['Câu chính', 'Đuôi'], r: [['I am ...', "..., aren't I?"], ["Let's ...", '..., shall we?'], ['Imperative (mệnh lệnh)', '..., will you?'], ['There is/are ...', "..., isn't/aren't there?"], ['Everyone / someone / nobody ...', '..., they? (dùng they)'], ['Nothing / never / hardly / rarely (nghĩa phủ định)', '..., + đuôi khẳng định'], ['used to', "..., didn't + S?"], ['I have a car / She has to go', "..., haven't I? / doesn't she?"]] } },
        { tip: 'Lên giọng ở đuôi khi **thật sự hỏi**; xuống giọng khi **chỉ xác nhận**.' }
      ] }
    ],
    ex: [["She is a teacher, isn't she?", 'Cô ấy là giáo viên, đúng không?'], ["They don't like fish, do they?", 'Họ không thích cá, đúng không?'], ["He plays tennis, doesn't he?", 'Anh ấy chơi quần vợt, phải không?'], ["You went out last night, didn't you?", 'Tối qua bạn đã ra ngoài, đúng không?'], ["I am right, aren't I?", 'Mình đúng, phải không?'], ["Let's go to the cinema, shall we?", 'Chúng ta đi xem phim nhé?'], ["Open the window, will you?", 'Mở cửa sổ giúp nhé?'], ["Nobody called, did they?", 'Không ai gọi đúng không?']],
    mis: [["She is a teacher, isn't it?", "She is a teacher, isn't she?", 'Đuôi dùng đại từ đúng với chủ ngữ.'], ["You don't like coffee, don't you?", "You don't like coffee, do you?", 'Câu phủ định → đuôi khẳng định.'], ["I am late, amn't I?", "I am late, aren't I?", 'I am → aren\'t I.'], ["Let's go, will we?", "Let's go, shall we?", "Let's → shall we."]],
    quiz: [
      ["It is a nice day, ___?", ["is it", "isn't it", "doesn't it", "it isn't"], 1, 'Câu khẳng định → đuôi phủ định: isn\'t it?'],
      ["They didn't come to the party, ___?", ["didn't they", "did they", "do they", "were they"], 1, 'Câu phủ định (didn\'t) → did they?'],
      ["He can swim, ___?", ["can't he", "doesn't he", "isn't he", "can he"], 0, "Modal can → can't he?"],
      ["You have finished your homework, ___?", ["haven't you", "don't you", "didn't you", "aren't you"], 0, "have (trợ động từ) → haven't you?"],
      ["Open the door, ___?", ["do you", "will you", "don't you", "are you"], 1, 'Mệnh lệnh → will you?'],
      ["Let's play football, ___?", ["will we", "do we", "shall we", "shan't we"], 2, "Let's → shall we?"],
      ["Nobody was in the room, ___?", ["was he", "were they", "wasn't they", "weren't they"], 1, 'Nobody → they; câu có nghĩa phủ định → đuôi khẳng định.'],
      ["There aren't any eggs left, ___?", ["aren't there", "are there", "do there", "are they"], 1, 'There aren\'t → are there?']
    ]
  });
})();
