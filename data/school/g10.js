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
      ['I ___ my keys three times this month.', ['lost', 'have lost', 'was losing', 'lose'], 1, 'this month là khoảng thời gian chưa kết thúc → hiện tại hoàn thành: have lost.'],
      ['By the time I got to the station, the train ___.', ['left', 'has left', 'had left', 'was leaving'], 2, 'Việc xảy ra trước mốc quá khứ → quá khứ hoàn thành.'],
      ['I ___ you as soon as I get there.', ['will call', 'would call', 'called', 'have called'], 0, 'Tương lai (as soon as + hiện tại đơn): will call.'],
      ['She ___ English for five years.', ['studies', 'is studying', 'has been studying', 'studied'], 2, 'for five years + còn tiếp diễn → has been studying.'],
      ['He ___ his leg while he was playing football yesterday.', ['breaks', 'broke', 'has broken', 'was breaking'], 1, 'yesterday → quá khứ đơn.'],
      ['We ___ to the beach next week.', ['did go', 'are going', 'went', 'have gone'], 1, 'next week → tương lai; kế hoạch → are going.'],
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
      ['When I got home, my mother ___ dinner.', ['would already cook', 'had already cooked', 'has already cooked', 'was already cook'], 1, 'Nấu xong trước khi mình về → had already cooked.'],
      ['She told me that she ___ the film twice before.', ['saw', 'had seen', 'has seen', 'was seeing'], 1, 'Việc xem phim xảy ra trước thời điểm nói trong quá khứ (twice before) → had seen.'],
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

  L('g10-stative-verbs', {
    grade: 10, icon: '🧠', title: 'Động từ chỉ trạng thái và động từ có hai nghĩa', sub: 'Stative vs Dynamic verbs', level: 'Trung bình',
    summary: 'Biết những động từ thường không dùng thì tiếp diễn (know, like, want…) và các động từ đổi nghĩa khi dùng tiếp diễn (think, have, see, taste…).',
    sections: [
      { h: '1. Hai loại động từ', b: [
        { p: '**Động từ hành động (dynamic)** diễn tả việc làm có thể xảy ra từng phần: run, eat, study → dùng được ở thì tiếp diễn. **Động từ trạng thái (stative)** diễn tả suy nghĩ, cảm xúc, sở hữu, giác quan → **thường không dùng tiếp diễn**.' },
        { t: { h: ['Nhóm', 'Động từ'], r: [['Suy nghĩ', 'know, understand, believe, remember, forget, mean, doubt'], ['Cảm xúc', 'like, love, hate, prefer, want, need, wish'], ['Sở hữu', 'have (= có), own, belong, possess, contain'], ['Giác quan', 'see, hear, smell, taste, sound, look (= có vẻ), seem, appear']] } },
        { p: '✓ I **know** the answer. ✗ I am knowing the answer. · ✓ She **loves** music. ✗ She is loving music.' }
      ] },
      { h: '2. Động từ đổi nghĩa khi dùng tiếp diễn', b: [
        { t: { h: ['Động từ', 'Nghĩa trạng thái (đơn)', 'Nghĩa hành động (tiếp diễn)'], r: [['think', 'I **think** it\'s a good idea. (cho rằng)', 'I\'**m thinking** about my holiday. (đang suy nghĩ)'], ['have', 'She **has** a car. (có)', 'She\'**s having** lunch. (đang ăn); having a good time'], ['see', 'I **see** what you mean. (hiểu)', 'I\'**m seeing** the doctor. (đang gặp/khám)'], ['taste', 'The soup **tastes** good. (có vị)', 'He\'**s tasting** the soup. (đang nếm)'], ['be', 'He **is** kind. (bản chất)', 'He **is being** silly. (đang cư xử như vậy)'], ['look', 'You **look** tired. (trông có vẻ)', 'She\'**s looking** at the sky. (đang nhìn)']] } },
        { tip: 'Khi muốn nhấn mạnh cảm xúc **đang** thay đổi, một số động từ cảm xúc cho phép dùng tiếp diễn trong văn nói: **I\'m loving this song!** — nhưng ở bài thi, hãy dùng dạng đơn.' }
      ] },
      { h: '3. Mẹo làm bài', b: [
        { ul: ['Gặp **know, like, want, need, believe, belong, seem** → chọn **hiện tại đơn**.', 'Gặp **have lunch / have a bath / have a good time / have a meeting** (nghĩa "ăn, tắm, trải qua") → có thể **tiếp diễn**.', 'Với **see / hear / smell**, dùng **can** để diễn tả đang cảm nhận: **I can hear music.** (✗ I am hearing music.)'] }
      ] }
    ],
    ex: [
      ['I know the answer, but I don\'t want to say it.', 'Mình biết đáp án nhưng không muốn nói.'], ['She owns two houses in Da Nang.', 'Cô ấy sở hữu hai ngôi nhà ở Đà Nẵng.'], ['This soup tastes delicious.', 'Món súp này có vị rất ngon.'],
      ['Why are you tasting the soup? Is it too salty?', 'Sao bạn nếm súp thế? Có mặn quá không?'], ['I think you are right.', 'Mình nghĩ bạn đúng.'], ['I\'m thinking about changing my job.', 'Mình đang nghĩ đến chuyện đổi việc.'],
      ['We\'re having a great time in Hue!', 'Chúng mình đang có một khoảng thời gian tuyệt vời ở Huế!'], ['He has a new bike.', 'Anh ấy có một chiếc xe đạp mới.'], ['I can hear someone singing in the next room.', 'Mình nghe thấy ai đó hát ở phòng bên.']
    ],
    mis: [
      ['I am knowing her very well.', 'I know her very well.', 'know là động từ trạng thái.'], ['She is wanting a new phone.', 'She wants a new phone.', 'want không dùng tiếp diễn.'], ['I am hearing a strange noise.', 'I can hear a strange noise.', 'hear dùng với can.'],
      ['He is having a car.', 'He has a car.', 'have = sở hữu → dạng đơn.'], ['This cake is tasting wonderful.', 'This cake tastes wonderful.', 'taste = có vị → dạng đơn.']
    ],
    quiz: [
      ['I ___ what you mean.', ['am understanding', 'understand', 'understanding', 'was understanding'], 1, 'understand là động từ trạng thái.'],
      ['Right now she ___ a shower.', ['has', 'is having', 'have', 'having'], 1, 'have a shower = hành động → is having.'],
      ['This perfume ___ lovely.', ['is smelling', 'smells', 'smelling', 'smell'], 1, 'smell (có mùi) → dạng đơn.'],
      ['He ___ a lot of money, so he can buy anything.', ['has', 'is having', 'are having', 'having'], 0, 'have = có → dạng đơn.'],
      ['I ___ about my future at the moment.', ['think', 'am thinking', 'thinks', 'thought'], 1, 'Đang suy nghĩ → am thinking.'],
      ['The chef ___ the sauce to check the flavour.', ['tastes', 'is tasting', 'taste', 'has tasted'], 1, 'Hành động nếm → is tasting.'],
      ['I ___ you\'re tired. You look pale.', ['am believing', 'believe', 'believing', 'was believing'], 1, 'believe → dạng đơn.'],
      ['Which sentence is correct?', ['I am liking this song.', 'I like this song.', 'I am wanting a drink.', 'I am knowing him.'], 1, 'like là động từ trạng thái.'],
      ['"What are you doing?" "I ___ a book on the table."', ['am seeing', 'see', 'am looking at', 'look'], 2, 'Đang nhìn → am looking at.']
    ]
  });

  L('g10-noun-clauses', {
    grade: 10, icon: '💬', title: 'Mệnh đề danh từ: that, wh-, if / whether', sub: 'Noun clauses', level: 'Trung bình',
    summary: 'Mệnh đề đóng vai trò danh từ (chủ ngữ, tân ngữ, bổ ngữ): I know that…, I wonder where…, I don\'t know if…',
    sections: [
      { h: '1. Ba dạng mệnh đề danh từ', b: [
        { t: { h: ['Loại', 'Từ nối', 'Ví dụ'], r: [['that-clause', '**that** (có thể bỏ khi là tân ngữ)', 'I think **(that)** he is right.'], ['wh-clause', '**what, where, when, why, how, who, which**', 'Do you know **where he lives**?'], ['if / whether-clause', '**if / whether** (cho câu hỏi Yes/No)', 'I wonder **if/whether** she knows.']] } },
        { warn: 'Trong mệnh đề danh từ **không đảo trợ động từ** (trật tự như câu khẳng định): ✗ I don\'t know where is he. → ✓ I don\'t know **where he is**.' }
      ] },
      { h: '2. Chức năng trong câu', b: [
        { ul: ['**Chủ ngữ**: **What he said** surprised everyone. / **That she passed** is great news.', '**Tân ngữ**: I don\'t know **what she wants**. / She said **that she was tired**.', '**Bổ ngữ**: The problem is **that we have no time**. / This is **what I need**.', '**Sau giới từ**: We talked about **how we can help**. (không dùng that sau giới từ)'] },
        { tip: 'Chủ ngữ là mệnh đề danh từ thì động từ chính **chia số ít**: What he said **was** true.' }
      ] },
      { h: '3. Câu hỏi gián tiếp (embedded questions)', b: [
        { p: 'Để hỏi lịch sự, nhúng câu hỏi vào mệnh đề danh từ: **Where is the station?** → **Could you tell me where the station is?** · **Does he like tea?** → **I wonder if he likes tea.** (không dùng do/does trong mệnh đề danh từ).' },
        { t: { h: ['Câu hỏi trực tiếp', 'Câu hỏi gián tiếp'], r: [['What time does the train leave?', 'Do you know **what time the train leaves**?'], ['Is she at home?', 'I\'m not sure **whether she is at home**.'], ['Why did he leave?', 'Nobody knows **why he left**.']] } },
        { tip: '**whether** dùng được ở mọi vị trí (kể cả đầu câu, sau giới từ, trước to V); **if** chủ yếu dùng ở vị trí tân ngữ: ✓ **Whether** he comes doesn\'t matter. ✗ If he comes doesn\'t matter.' }
      ] }
    ],
    ex: [
      ['I think that English is very useful.', 'Mình nghĩ tiếng Anh rất hữu ích.'], ['Do you know where the post office is?', 'Bạn có biết bưu điện ở đâu không?'], ['I wonder whether he will come.', 'Mình tự hỏi liệu cậu ấy có đến không.'],
      ['What she told me was a secret.', 'Điều cô ấy nói với mình là một bí mật.'], ['The problem is that we don\'t have enough time.', 'Vấn đề là chúng ta không đủ thời gian.'], ['Could you tell me how much this costs?', 'Bạn cho mình biết cái này giá bao nhiêu được không?'],
      ['She asked me if I liked spicy food.', 'Cô ấy hỏi mình có thích đồ cay không.'], ['We talked about what we would do next year.', 'Chúng mình nói về việc sẽ làm gì vào năm sau.'], ['Whether you win or lose doesn\'t matter.', 'Thắng hay thua không quan trọng.']
    ],
    mis: [
      ['I don\'t know where is the bank.', 'I don\'t know where the bank is.', 'Không đảo trật tự trong mệnh đề danh từ.'], ['Could you tell me what time does the film start?', 'Could you tell me what time the film starts?', 'Không dùng does trong mệnh đề danh từ.'],
      ['I wonder that he is ill.', 'I wonder if/whether he is ill.', 'Câu hỏi Yes/No → if/whether.'], ['If he comes is not important.', 'Whether he comes is not important.', 'Mệnh đề làm chủ ngữ dùng whether.'], ['We talked about that we should do.', 'We talked about what we should do.', 'Sau giới từ dùng wh-clause, không dùng that.']
    ],
    quiz: [
      ['Do you know ___ the library opens?', ['when', 'when does', 'when did', 'does when'], 0, 'Trật tự khẳng định: when the library opens.'],
      ['I\'m not sure ___ he will accept the offer.', ['that', 'whether', 'what', 'which'], 1, 'Câu hỏi Yes/No → whether.'],
      ['___ she said made me very happy.', ['That', 'What', 'If', 'Whether'], 1, 'Mệnh đề chủ ngữ = điều mà → What.'],
      ['He asked me ___ I had finished the test.', ['that', 'if', 'what', 'where'], 1, 'Yes/No question → if.'],
      ['Could you tell me ___?', ['where is the station', 'where the station is', 'where does the station', 'where the station does be'], 1, 'Câu hỏi gián tiếp: where the station is.'],
      ['The truth is ___ nobody knows the answer.', ['that', 'what', 'whether', 'who'], 0, 'Bổ ngữ: The truth is that…'],
      ['___ he wins or loses is not important.', ['If', 'Whether', 'That', 'What'], 1, 'Đầu câu với "or" → Whether.'],
      ['I\'d like to know ___ you think about the plan.', ['what', 'that', 'whether', 'where'], 0, 'what you think = bạn nghĩ gì.'],
      ['She told us ___ she was moving to Canada.', ['that', 'whether', 'what', 'where is'], 0, 'Tường thuật khẳng định → that.']
    ]
  });

  L('g10-relative-clauses-advanced', {
    grade: 10, icon: '🔗', title: 'Mệnh đề quan hệ nâng cao', sub: 'Advanced relative clauses', level: 'Nâng cao',
    summary: 'Giới từ + whom/which, whose, where/when/why, mệnh đề quan hệ bổ nghĩa cho cả câu và khi nào lược bỏ đại từ quan hệ.',
    sections: [
      { h: '1. Giới từ + whom / which', b: [
        { f: ['Danh từ chỉ người + **giới từ + whom**: the man **to whom** I spoke', 'Danh từ chỉ vật + **giới từ + which**: the house **in which** I live'] },
        { p: 'Cách nói trang trọng. Văn nói thường đưa giới từ về cuối: **the man (whom/who/that) I spoke to**; **the house (which/that) I live in**. Khi có giới từ đứng trước: **chỉ dùng whom / which** (không dùng who/that).' },
        { warn: '✗ the girl with who I work → ✓ the girl **with whom** I work. ✗ the pen with that I write → ✓ the pen **with which** I write.' }
      ] },
      { h: '2. Whose, where, when, why', b: [
        { t: { h: ['Từ', 'Thay cho', 'Ví dụ'], r: [['**whose** + danh từ', 'sở hữu (người/vật)', 'The boy **whose bike was stolen** called the police.'], ['**where**', 'nơi chốn (= in/at which)', 'This is the town **where I was born**.'], ['**when**', 'thời gian (= on/in which)', 'I remember the day **when we met**.'], ['**why**', 'lý do (= for which)', 'Tell me the reason **why you left**.']] } },
        { tip: 'Sau **whose** luôn có **danh từ**: the girl **whose father** is a doctor. Không dùng **whose** với đại từ như "whose she".' }
      ] },
      { h: '3. Mệnh đề quan hệ bổ nghĩa cả câu và lược bỏ', b: [
        { ul: ['**, which** thay cho **cả mệnh đề trước**: He passed the exam, **which** surprised everyone. (việc anh ấy đỗ gây ngạc nhiên) — luôn có dấu phẩy.', '**Lược bỏ** who/which/that khi nó là **tân ngữ** của mệnh đề quan hệ xác định: The book **(that)** I bought is great. Không được bỏ khi nó là **chủ ngữ**: The man **who** lives next door…', 'Mệnh đề **không xác định** (có dấu phẩy) **không dùng that** và không thể bỏ đại từ: My brother, **who lives in Hue**, is a nurse.', 'Sau **all, everything, something, anything, nothing, the only, the first, the best** dùng **that**: Everything **that** she said was true.'] }
      ] }
    ],
    ex: [
      ['The teacher to whom I spoke was very helpful.', 'Cô giáo mà mình đã nói chuyện rất nhiệt tình.'], ['This is the house in which my grandparents lived.', 'Đây là ngôi nhà nơi ông bà mình từng sống.'], ['She is the girl whose father is a famous singer.', 'Cô ấy là cô gái có bố là một ca sĩ nổi tiếng.'],
      ['That is the café where we first met.', 'Đó là quán cà phê nơi chúng mình gặp nhau lần đầu.'], ['I can\'t forget the day when I won the prize.', 'Mình không thể quên ngày mình giành giải.'], ['Please tell me the reason why you are late.', 'Hãy cho mình biết lý do bạn đến muộn.'],
      ['He didn\'t come, which made her angry.', 'Anh ấy không đến, điều đó khiến cô ấy tức giận.'], ['The book I borrowed from you is excellent.', 'Quyển sách mình mượn của bạn rất hay.'], ['Everything that he said was true.', 'Mọi điều anh ấy nói đều đúng.']
    ],
    mis: [
      ['The man with who I work is kind.', 'The man with whom I work is kind.', 'Sau giới từ dùng whom.'], ['The girl whose she is my friend is tall.', 'The girl who is my friend is tall.', 'whose phải đi với danh từ.'], ['My sister, that lives in Hue, is a doctor.', 'My sister, who lives in Hue, is a doctor.', 'Không dùng that trong mệnh đề không xác định.'],
      ['The town which I was born is small.', 'The town where I was born is small. (hoặc in which)', 'Chỉ nơi chốn → where / in which.'], ['He failed, that surprised us.', 'He failed, which surprised us.', 'Dùng , which thay cả mệnh đề trước.']
    ],
    quiz: [
      ['The woman ___ I met yesterday is a doctor.', ['whom', 'whose', 'which', 'where'], 0, 'whom làm tân ngữ chỉ người (có thể lược bỏ).'],
      ['This is the room ___ we have meetings.', ['which', 'who', 'where', 'whose'], 2, 'Nơi chốn → where.'],
      ['The boy ___ bike was stolen is crying.', ['who', 'whom', 'whose', 'which'], 2, 'Sở hữu → whose.'],
      ['She is the person with ___ I work.', ['who', 'whom', 'whose', 'that'], 1, 'Giới từ + whom.'],
      ['He passed the exam, ___ made his parents proud.', ['that', 'what', 'which', 'who'], 2, '", which" thay cả mệnh đề.'],
      ['All ___ I want is a quiet place to study.', ['which', 'what', 'that', 'who'], 2, 'Sau all dùng that.'],
      ['I remember the summer ___ we travelled to Da Nang.', ['where', 'when', 'which', 'why'], 1, 'Thời gian → when.'],
      ['Tell me the reason ___ you didn\'t come.', ['when', 'why', 'where', 'whose'], 1, 'Lý do → why.'],
      ['My neighbour, ___ is a pilot, is away a lot.', ['that', 'who', 'which', 'whose'], 1, 'Mệnh đề không xác định về người → who.']
    ]
  });

  L('g10-wish-as-if-would-rather', {
    grade: 10, icon: '💭', title: 'wish, as if / as though, would rather, it\'s time', sub: 'Unreal situations', level: 'Nâng cao',
    summary: 'Diễn đạt điều ước, sự so sánh không có thật và sở thích/yêu cầu với wish, as if, would rather, it\'s (high) time.',
    sections: [
      { h: '1. Wish (ước)', b: [
        { t: { h: ['Ước về', 'Cấu trúc', 'Ví dụ'], r: [['hiện tại', 'S + wish + S + **V2 / were**', 'I wish I **had** a bike. / I wish I **were** taller.'], ['quá khứ', 'S + wish + S + **had V3**', 'I wish I **had studied** harder.'], ['tương lai / phàn nàn', 'S + wish + S + **would V**', 'I wish it **would stop** raining.'], ['khả năng', 'S + wish + S + **could V**', 'I wish I **could swim**.']] } },
        { tip: 'Với wish, **be** thường dùng **were** cho mọi ngôi: I wish he **were** here. Dùng **would** khi mong người/việc thay đổi (không dùng với I/we khi ước mình): ✗ I wish I would be rich → ✓ I wish I **were** rich.' }
      ] },
      { h: '2. As if / as though và it\'s time', b: [
        { f: ['**as if / as though** + **V2/were** (trái với hiện tại): He talks **as if he knew** everything. (thực ra không biết)', '**as if** + **had V3** (trái với quá khứ): She looked **as if she had seen** a ghost.', '**It\'s (high) time** + S + **V2**: It\'s time **we left**. (đã đến lúc đi rồi)'] },
        { p: 'Nếu điều so sánh **có thể đúng**, dùng thì thường: **It looks as if it is going to rain.** (có khả năng mưa).' }
      ] },
      { h: '3. Would rather và prefer', b: [
        { t: { h: ['Cấu trúc', 'Ví dụ'], r: [['S + would rather + **V** (+ than + V)', 'I would rather **stay** home than **go** out.'], ['S + would rather + S + **V2** (hiện/tương lai)', 'I\'d rather you **didn\'t smoke** here.'], ['S + would rather + S + **had V3** (quá khứ)', 'I\'d rather you **had told** me the truth.'], ['S + would prefer + **to V** (than/rather than V)', 'I would prefer **to walk** than take the bus.']] } },
        { warn: 'Chủ ngữ hai vế **cùng người**: would rather + V nguyên mẫu. **Khác người**: would rather + S2 + V2 (hiện tại/tương lai).' }
      ] }
    ],
    ex: [
      ['I wish I had more free time.', 'Giá mà mình có nhiều thời gian rảnh hơn.'], ['She wishes she were taller.', 'Cô ấy ước mình cao hơn.'], ['I wish I had listened to your advice.', 'Giá mà mình đã nghe lời khuyên của bạn.'],
      ['I wish it would stop raining.', 'Mình ước trời ngừng mưa.'], ['He acts as if he were the boss.', 'Anh ta cư xử như thể mình là sếp.'], ['It\'s time we went home.', 'Đã đến lúc chúng ta về nhà.'],
      ['I\'d rather stay at home tonight than go out.', 'Tối nay mình thích ở nhà hơn là ra ngoài.'], ['I\'d rather you didn\'t tell anyone.', 'Mình mong bạn đừng nói với ai.'], ['She looked as if she had seen a ghost.', 'Cô ấy trông như thể vừa nhìn thấy ma.']
    ],
    mis: [
      ['I wish I am taller.', 'I wish I were taller.', 'Điều ước hiện tại → V2/were.'], ['I wish I studied harder last year.', 'I wish I had studied harder last year.', 'Quá khứ → had V3.'], ['She talks as if she is the manager. (thực ra không phải)', 'She talks as if she were the manager.', 'Trái thực tế → were.'],
      ['I would rather to go home.', 'I would rather go home.', 'would rather + V không to.'], ['It\'s time we go home.', 'It\'s time we went home.', 'It\'s time + S + V2.']
    ],
    quiz: [
      ['I wish I ___ a car. Then I could drive to work.', ['have', 'had', 'will have', 'would have'], 1, 'Ước ở hiện tại → had.'],
      ['I wish I ___ the exam last week. I failed.', ['passed', 'had passed', 'pass', 'would pass'], 1, 'Ước ở quá khứ → had passed.'],
      ['He behaves as if he ___ everything.', ['know', 'knows', 'knew', 'has known'], 2, 'as if + V2 (trái hiện tại).'],
      ['It\'s high time you ___ to bed.', ['go', 'went', 'will go', 'going'], 1, 'It\'s high time + V2.'],
      ['I\'d rather ___ at home than go out.', ['to stay', 'staying', 'stay', 'stayed'], 2, 'would rather + V.'],
      ['I\'d rather you ___ so loudly.', ['don\'t talk', 'didn\'t talk', 'won\'t talk', 'not talking'], 1, 'would rather + S + V2.'],
      ['I wish it ___ stop raining. I want to go out.', ['will', 'would', 'did', 'has'], 1, 'wish + would (mong thay đổi).'],
      ['She looks as if she ___ a ghost.', ['saw', 'has seen', 'had seen', 'sees'], 2, 'as if + had V3 (trái quá khứ).'],
      ['If only I ___ tall enough to join the team!', ['am', 'were', 'was being', 'will be'], 1, 'If only giống wish: were.']
    ]
  });

  L('g10-conditional-alternatives', {
    grade: 10, icon: '🔀', title: 'Cách khác để diễn đạt điều kiện', sub: 'unless, provided, as long as, otherwise…', level: 'Nâng cao',
    summary: 'Thay "if" bằng unless, as long as, provided/providing that, in case, otherwise, or else và các mẫu rút gọn.',
    sections: [
      { h: '1. Các từ thay cho if', b: [
        { t: { h: ['Từ', 'Nghĩa', 'Ví dụ'], r: [['**unless** (= if … not)', 'trừ khi', '**Unless** you hurry, you\'ll be late. = If you don\'t hurry…'], ['**as long as / so long as**', 'miễn là', 'You can go out **as long as** you finish your homework.'], ['**provided / providing (that)**', 'với điều kiện là', 'I\'ll lend you the money **provided that** you pay it back.'], ['**in case**', 'phòng khi', 'Take an umbrella **in case** it rains.'], ['**suppose / supposing**', 'giả sử', '**Suppose** you won a million, what would you do?'], ['**on condition that**', 'với điều kiện', 'I\'ll join **on condition that** the work is part-time.']] } },
        { warn: '**unless** đã mang nghĩa phủ định; không thêm "not": ✗ Unless you don\'t study → ✓ **Unless you study**. Và **in case** nghĩa "phòng khi" (chưa xảy ra), khác với **if**.' }
      ] },
      { h: '2. Otherwise và or else', b: [
        { f: ['Câu mệnh lệnh / lời khuyên + **, otherwise / or (else)** + S + will/would + V'] },
        { p: '**Hurry up, otherwise we\'ll miss the bus.** = If you don\'t hurry, we\'ll miss the bus. · **Study hard, or else you will fail.** · Quá khứ: **I took a taxi; otherwise I would have been late.**' }
      ] },
      { h: '3. Rút gọn và thể giả định', b: [
        { ul: ['**Rút gọn if-clause**: **If possible** = if it is possible; **If necessary**, call me; **If in doubt**, ask.', '**Without / But for + danh từ** (= nếu không có): **Without your help**, I would have failed. = If it hadn\'t been for your help…', '**Should** + S + V (trang trọng, loại 1): **Should you need help**, call me. = If you need help…', 'Cả ba loại điều kiện (1, 2, 3) đều có thể dùng với các từ thay thế ở trên (ở loại 2/3 dùng với would / would have).'] }
      ] }
    ],
    ex: [
      ['Unless you study hard, you won\'t pass the exam.', 'Trừ khi bạn học chăm, bạn sẽ không đỗ.'], ['You can borrow my bike as long as you take care of it.', 'Bạn mượn xe mình được, miễn là bạn giữ gìn nó.'], ['I\'ll lend you the book provided that you return it on Monday.', 'Mình cho bạn mượn sách với điều kiện thứ Hai trả.'],
      ['Take a sweater in case it gets cold.', 'Mang theo áo len phòng khi trời lạnh.'], ['Hurry up, otherwise we\'ll miss the train.', 'Nhanh lên, không thì chúng ta lỡ tàu.'], ['Without your help, I couldn\'t have finished the project.', 'Không có sự giúp đỡ của bạn, mình không thể hoàn thành dự án.'],
      ['Should you need any help, please contact me.', 'Nếu bạn cần giúp đỡ, hãy liên hệ mình.'], ['If necessary, we can change the plan.', 'Nếu cần, chúng ta có thể đổi kế hoạch.'], ['Suppose you lost your phone, what would you do?', 'Giả sử bạn mất điện thoại, bạn sẽ làm gì?']
    ],
    mis: [
      ['Unless you don\'t hurry, you will be late.', 'Unless you hurry, you will be late.', 'unless đã có nghĩa phủ định.'], ['I\'ll take an umbrella if it will rain.', 'I\'ll take an umbrella in case it rains.', 'Mục đích phòng ngừa → in case + hiện tại đơn.'], ['You can use my laptop as long you are careful.', 'You can use my laptop as long as you are careful.', 'Đủ cụm: as long as.'],
      ['Study hard, otherwise you pass.', 'Study hard, otherwise you will fail.', 'otherwise đưa ra hậu quả xấu.']
    ],
    quiz: [
      ['___ you hurry, you will miss the bus.', ['Unless', 'If', 'As long as', 'Provided'], 0, 'unless = if … not: Unless you hurry = If you don\'t hurry.'],
      ['You can stay out late ___ you call us.', ['unless', 'as long as', 'otherwise', 'in case'], 1, 'as long as = miễn là.'],
      ['Take a map ___ you get lost.', ['unless', 'in case', 'provided', 'otherwise'], 1, 'in case = phòng khi.'],
      ['Leave now, ___ you will be late.', ['otherwise', 'unless', 'as long as', 'provided'], 0, 'otherwise = nếu không thì.'],
      ['___ your help, we couldn\'t have won.', ['With', 'Without', 'Unless', 'In case'], 1, 'Without = nếu không có.'],
      ['___ you need help, call me.', ['Should', 'Unless', 'Otherwise', 'Provided'], 0, 'Should + S + V (trang trọng) = If you need.'],
      ['I\'ll go ___ the weather is good.', ['unless', 'provided that', 'otherwise', 'in case of'], 1, 'provided that = với điều kiện.'],
      ['"Unless it rains" has the same meaning as ___.', ['if it rains', 'if it doesn\'t rain', 'in case it rains', 'as long as it rains'], 1, 'unless = if … not.'],
      ['___ you won the lottery, what would you do?', ['Suppose', 'Unless', 'Otherwise', 'As long as'], 0, 'Suppose = giả sử.']
    ]
  });

  /* ───── Làm sâu các bài lớp 10 ───── */
  function P(id, d) {
    var l = S.lessons[id]; if (!l) throw new Error('Không thấy bài ' + id);
    (d.sections || []).forEach(function (s) { s.h = (l.sections.length + 1) + '. ' + s.h; l.sections.push(s); });
    ['ex', 'mis', 'quiz'].forEach(function (k) { if (d[k]) l[k] = l[k].concat(d[k]); });
  }

  P('g10-tenses-review', {
    sections: [
      { h: 'Phủ định và nghi vấn của từng thì', b: [
        { t: { h: ['Thì', 'Phủ định', 'Nghi vấn'], r: [['Hiện tại đơn', 'don\'t/doesn\'t + V', 'Do/Does + S + V?'], ['Hiện tại tiếp diễn', 'am/is/are not + V-ing', 'Am/Is/Are + S + V-ing?'], ['Hiện tại hoàn thành', 'haven\'t/hasn\'t + V3', 'Have/Has + S + V3?'], ['Quá khứ đơn', 'didn\'t + V', 'Did + S + V?'], ['Quá khứ tiếp diễn', 'wasn\'t/weren\'t + V-ing', 'Was/Were + S + V-ing?'], ['Quá khứ hoàn thành', 'hadn\'t + V3', 'Had + S + V3?'], ['Tương lai đơn', 'won\'t + V', 'Will + S + V?'], ['Tương lai gần', 'am/is/are not going to + V', 'Am/Is/Are + S + going to + V?']] } }
      ] },
      { h: 'Các thì trong đoạn văn và mệnh đề thời gian', b: [
        { ul: ['**When/while/as** + quá khứ tiếp diễn / quá khứ đơn (hành động dài – ngắn).', '**By the time** + quá khứ đơn, mệnh đề chính **quá khứ hoàn thành**: By the time I arrived, they **had left**.', '**By the time** + hiện tại đơn, mệnh đề chính **will have + V3**: By the time you come, I **will have finished**.', '**since + mốc thời gian** đi với hiện tại hoàn thành; mệnh đề sau since dùng quá khứ đơn: **I have lived here since I was born.**', '**It is the first time + hiện tại hoàn thành**: **It\'s the first time I have eaten sushi.**'] }
      ] },
      { h: 'Cách chọn thì khi làm bài', b: [
        { ul: ['**Bước 1**: tìm **dấu hiệu thời gian** (now, yesterday, since, by the time, for…).', '**Bước 2**: xác định **hành động xảy ra khi nào** (xong hẳn hay còn liên quan hiện tại?).', '**Bước 3**: nếu có hai hành động trong quá khứ, hành động **xảy ra trước** dùng **had V3**.', '**Bước 4**: kiểm tra **chủ ngữ** (số ít/nhiều) và **động từ trạng thái** (không dùng tiếp diễn).'] },
        { tip: 'Các động từ trạng thái **know, like, want, belong, seem, understand** dùng thì đơn; không nói I am knowing / She is wanting.' }
      ] }
    ],
    ex: [
      ['By the time you get home, I will have cooked dinner.', 'Lúc bạn về đến nhà thì mình đã nấu xong bữa tối.'], ['It is the first time I have eaten durian.', 'Đây là lần đầu tiên mình ăn sầu riêng.'], ['I have lived here since I was born.', 'Mình sống ở đây từ khi sinh ra.'], ['She was cooking while he was watching TV.', 'Cô ấy nấu ăn trong lúc anh ấy xem TV.']
    ],
    mis: [['By the time I arrived, they left.', 'By the time I arrived, they had left.', 'Hành động trước mốc quá khứ → had V3.'], ['This is the first time I eat sushi.', 'This is the first time I have eaten sushi.', 'the first time + hiện tại hoàn thành.'], ['She is wanting a new phone.', 'She wants a new phone.', 'want không dùng tiếp diễn.']],
    quiz: [
      ['By the time I arrived at the party, everyone ___.', ['has left', 'had left', 'leaves', 'was leaving'], 1, 'Trước mốc quá khứ → had left.'],
      ['It\'s the first time he ___ a horse.', ['rides', 'rode', 'has ridden', 'is riding'], 2, 'the first time + present perfect.'],
      ['By next year, they ___ the bridge.', ['will finish', 'will have finished', 'finish', 'are finishing'], 1, 'by + mốc tương lai → will have finished.'],
      ['"What ___ you doing at 8 last night?" "I was cooking."', ['did', 'were', 'have', 'are'], 1, 'Quá khứ tiếp diễn: were you doing.']
    ]
  });

  P('g10-past-perfect', {
    sections: [
      { h: 'Trình tự hai hành động trong quá khứ', b: [
        { t: { h: ['Câu', 'Thứ tự xảy ra'], r: [['When I got to the cinema, the film **had started**.', 'Phim bắt đầu **trước** → rồi mình đến.'], ['When I got to the cinema, the film **started**.', 'Mình đến **xong** thì phim mới bắt đầu.'], ['After she **had eaten**, she went out.', 'Ăn xong **trước** → rồi mới ra ngoài.'], ['She went out after she **ate** dinner. (nói thông thường)', 'Quá khứ đơn vẫn dùng được nếu thứ tự rõ ràng.']] } },
        { tip: 'Khi dùng **before/after** mà thứ tự đã rõ, người bản xứ thường dùng **quá khứ đơn**; dùng **had V3** để nhấn mạnh hành động hoàn tất trước.' }
      ] },
      { h: 'Các cấu trúc đảo ngữ và cố định', b: [
        { ul: ['**No sooner + had + S + V3 + than + S + V2**: **No sooner had I sat down than the phone rang.**', '**Hardly/Scarcely + had + S + V3 + when + S + V2**: **Hardly had he left when it started to rain.**', '**It was the first/second time + S + had V3** (trong quá khứ): It was the first time she **had flown**.', '**By the time + quá khứ đơn, S + had V3**.', '**Reported speech**: He said that he **had seen** her. (từ present perfect / past simple).'] }
      ] },
      { h: 'Hiện tại hoàn thành tiếp diễn: so sánh và lưu ý', b: [
        { t: { h: ['', 'have been V-ing', 'have V3'], r: [['Nhấn mạnh', 'quá trình, thời gian kéo dài', 'kết quả, số lượng'], ['Ví dụ', 'I **have been reading** since 7.', 'I **have read** 50 pages.'], ['Kết quả hiện tại', 'There are signs: **You have been crying.**', 'Result: **I have lost my keys.**'], ['Câu hỏi', 'How long have you been waiting?', 'How many pages have you read?']] } },
        { warn: 'Với **always, live, work, teach** có thể dùng cả hai mà nghĩa gần như giống nhau: **I have lived / have been living here for 5 years.**' }
      ] }
    ],
    ex: [
      ['Hardly had we sat down when the lights went out.', 'Chúng mình vừa ngồi xuống thì mất điện.'], ['It was the first time she had flown in a plane.', 'Đó là lần đầu tiên cô ấy đi máy bay.'], ['How long have you been waiting here?', 'Bạn đã đợi ở đây bao lâu rồi?'], ['She said she had already seen the film.', 'Cô ấy nói cô ấy đã xem phim đó rồi.']
    ],
    mis: [['Hardly he had left when it rained.', 'Hardly had he left when it rained.', 'Đảo ngữ: Hardly had + S + V3.'], ['I have been reading 50 pages today.', 'I have read 50 pages today.', 'Có số lượng/kết quả → have V3.'], ['I had seen him yesterday.', 'I saw him yesterday.', 'Mốc quá khứ xác định, không có hành động khác để so trước – sau → quá khứ đơn.']],
    quiz: [
      ['No sooner ___ he arrived than the rain stopped.', ['had', 'has', 'did', 'was'], 0, 'No sooner had + S + V3 + than.'],
      ['I\'m tired because I ___ all day.', ['worked', 'have been working', 'had worked', 'work'], 1, 'Nhấn quá trình kéo dài đến nay.'],
      ['It was the first time I ___ snow.', ['have seen', 'had seen', 'saw', 'see'], 1, 'the first time (quá khứ) → had seen.'],
      ['How many pages have you ___ so far?', ['read', 'reading', 'been read', 'to read'], 0, 'Có số lượng → have read.']
    ]
  });

  P('g10-conditional-3', {
    sections: [
      { h: 'Câu hỏi, phủ định và trả lời loại 3', b: [
        { t: { h: ['', 'Cấu trúc', 'Ví dụ'], r: [['Khẳng định', 'If + had V3, would have V3', 'If I had left earlier, I would have caught the bus.'], ['Phủ định', 'If + hadn\'t V3, would have V3', 'If it **hadn\'t rained**, we would have gone out.'], ['Nghi vấn', 'What would + S + have V3 + if + had V3?', 'What would you have done if you had missed the flight?'], ['Khả năng', 'could/might have V3', 'If she had tried, she **could have** won.']] } }
      ] },
      { h: 'Điều kiện hỗn hợp', b: [
        { t: { h: ['Kiểu', 'Cấu trúc', 'Ví dụ'], r: [['Quá khứ → hiện tại', 'If + had V3, would + V', 'If I **had studied** medicine, I **would be** a doctor now.'], ['Hiện tại → quá khứ', 'If + V2/were, would have V3', 'If he **were** smarter, he **would have** passed.'], ['Thói quen/ đặc điểm → quá khứ', 'If + V2, would have V3', 'If she **cared** more, she **would have called**.']] } },
        { tip: 'Hỏi: **Điều kiện** thuộc thời gian nào? **Kết quả** thuộc thời gian nào? Mỗi vế chọn dạng theo thời gian của riêng nó.' }
      ] },
      { h: 'Đảo ngữ và các cách diễn đạt khác', b: [
        { ul: ['**Had + S + V3**, S + would have V3: **Had I known, I would have told you.** (= If I had known…)', '**Without / But for + danh từ**: **Without your help, I would have failed.** = **If it hadn\'t been for your help…**', '**Wish / If only + had V3**: **I wish I had studied.** · **If only I had listened!**', '**as if / as though + had V3**: **He talked as if he had seen it.**'] },
        { warn: 'Không dùng **would have** trong mệnh đề **if**: ✗ If I would have known → ✓ If I **had known**.' }
      ] }
    ],
    ex: [
      ['Had I known about the meeting, I would have come.', 'Nếu mình biết về cuộc họp thì mình đã đến.'], ['Without your help, I would have failed the exam.', 'Không có sự giúp của bạn, mình đã trượt rồi.'], ['If I had studied medicine, I would be a doctor now.', 'Nếu mình học y thì giờ mình là bác sĩ rồi.'], ['If only I had listened to my teacher!', 'Giá mà mình nghe lời thầy cô!']
    ],
    mis: [['If I would have known, I would have told you.', 'If I had known, I would have told you.', 'Không dùng would trong if.'], ['Had I would known, I would have told you.', 'Had I known, I would have told you.', 'Đảo ngữ: Had + S + V3.'], ['If she had studied, she would passed.', 'If she had studied, she would have passed.', 'would have + V3.']],
    quiz: [
      ['___ I known the truth, I would have acted differently.', ['If', 'Had', 'Would', 'Should'], 1, 'Đảo ngữ loại 3: Had I known.'],
      ['If it ___ so cold, we would have gone out.', ['wasn\'t', 'hadn\'t been', 'weren\'t', 'isn\'t'], 1, 'If + hadn\'t been.'],
      ['She could have won if she ___ harder.', ['tried', 'had tried', 'would try', 'tries'], 1, 'could have + V3 + if + had V3.'],
      ['If he had saved money, he ___ rich now.', ['would have been', 'would be', 'will be', 'is'], 1, 'Hỗn hợp: kết quả hiện tại → would be.']
    ]
  });

  P('g10-linking-words', {
    sections: [
      { h: 'Từ nối trong bài viết: bổ sung ý, nêu ví dụ, kết luận', b: [
        { t: { h: ['Chức năng', 'Từ nối'], r: [['Mở đầu ý', 'Firstly, First of all, To begin with'], ['Thêm ý', 'Moreover, Furthermore, In addition, Besides, What\'s more'], ['Đưa ví dụ', 'For example, For instance, such as'], ['Nhấn mạnh', 'In fact, Indeed, Especially'], ['Đối lập', 'However, On the other hand, In contrast'], ['Kết luận', 'In conclusion, To sum up, Overall, In short'], ['Giải thích', 'That is to say, In other words']] } },
        { tip: 'Đặt **dấu phẩy** sau từ nối đầu câu: **However, we decided to go.** — **For example, many people prefer tea.**' }
      ] },
      { h: 'Because / since / as / because of / due to', b: [
        { t: { h: ['Từ', 'Theo sau', 'Ví dụ'], r: [['because / since / as', 'mệnh đề S + V', '**Since** it was late, we left.'], ['because of / due to / owing to / thanks to', 'danh từ / V-ing', 'We left **because of** the noise.'], ['so / therefore / as a result', 'kết quả', 'It was late; **therefore**, we left.']] } },
        { warn: '**thanks to** thường mang nghĩa tích cực: **Thanks to your help, I passed.** Khi tiêu cực dùng **because of / due to**: **The flight was cancelled due to the storm.**' }
      ] },
      { h: 'Mẫu câu tương phản nâng cao', b: [
        { ul: ['**Whereas / While** (đối lập hai vế): **While some prefer cities, others like the countryside.**', '**Even though / though** mạnh hơn although.', '**Nevertheless / Nonetheless** (tuy nhiên – trang trọng).', '**Despite the fact that / In spite of the fact that + mệnh đề**.', '**Yet / still** (nhưng vẫn): **He is old, yet he runs every day.**'] }
      ] }
    ],
    ex: [
      ['First of all, we need to set a clear goal.', 'Trước hết, chúng ta cần đặt mục tiêu rõ ràng.'], ['Thanks to your advice, I passed the test.', 'Nhờ lời khuyên của bạn, mình đã đỗ.'], ['The match was cancelled due to bad weather.', 'Trận đấu bị huỷ do thời tiết xấu.'], ['In conclusion, exercise is good for both body and mind.', 'Kết luận, tập thể dục tốt cho cả thể chất lẫn tinh thần.']
    ],
    mis: [['Despite the fact he was ill, he came.', 'Despite the fact that he was ill, he came.', 'Cần that sau the fact.'], ['The flight was cancelled thanks to the storm.', 'The flight was cancelled due to the storm.', 'Việc tiêu cực → due to.'], ['It was late; moreover we went home early.', 'It was late; therefore, we went home early.', 'Kết quả → therefore; moreover là thêm ý.']],
    quiz: [
      ['___ your help, I finished the work early.', ['Thanks to', 'Due to', 'Although', 'Despite'], 0, 'Nguyên nhân tích cực → Thanks to.'],
      ['The trip was postponed ___ the bad weather.', ['because', 'due to', 'although', 'so'], 1, 'Sau chỗ trống là danh từ → due to.'],
      ['Many students like online classes. ___, some prefer face-to-face ones.', ['Therefore', 'However', 'Because', 'Moreover'], 1, 'Đối lập → However.'],
      ['He is old, ___ he exercises every day.', ['so', 'yet', 'because', 'therefore'], 1, 'Nhưng vẫn → yet.']
    ]
  });

  P('g10-modal-perfect', {
    sections: [
      { h: 'Khác biệt giữa các mức độ suy đoán trong quá khứ', b: [
        { t: { h: ['Mức', 'Cấu trúc', 'Ví dụ'], r: [['Chắc chắn đã xảy ra', 'must have + V3', 'The lights are off. They **must have gone** out.'], ['Có thể đã xảy ra', 'may/might/could have + V3', 'She **might have forgotten** it.'], ['Chắc chắn không xảy ra', 'can\'t/couldn\'t have + V3', 'He **can\'t have taken** it. He was abroad.']] } },
        { tip: 'Có **bằng chứng rõ** → must have / can\'t have; **chưa chắc** → may/might/could have.' }
      ] },
      { h: 'Tiếc nuối và phê bình', b: [
        { ul: ['**should have + V3**: đáng lẽ nên (nhưng đã không): **You should have called me.**', '**shouldn\'t have + V3**: đáng lẽ không nên: **I shouldn\'t have shouted at her.**', '**ought to have + V3** gần nghĩa should have.', '**could have + V3**: có khả năng nhưng không làm: **We could have won, but we gave up.**', '**needn\'t have + V3**: đã làm mà không cần: **You needn\'t have waited.**'] },
        { warn: '**didn\'t need to V** (không cần làm, có thể đã không làm) ≠ **needn\'t have V3** (đã làm rồi mà hoá ra không cần).' }
      ] },
      { h: 'Câu hỏi và thể tiếp diễn', b: [
        { ul: ['Câu hỏi: **Could she have missed the bus?** — **Should we have left earlier?** (đảo modal lên trước).', 'Thể tiếp diễn: **must have been + V-ing**: **He must have been sleeping.** (lúc đó chắc đang ngủ)', '**might have been + V-ing**: **They might have been waiting outside.**', 'Phủ định: **may not have / might not have**: **She may not have heard you.**'] }
      ] }
    ],
    ex: [
      ['Could she have missed the bus?', 'Có thể cô ấy đã lỡ xe buýt không?'], ['He must have been sleeping when I called.', 'Chắc lúc mình gọi anh ấy đang ngủ.'], ['You ought to have told me earlier.', 'Lẽ ra bạn nên nói với mình sớm hơn.'], ['She may not have heard the bell.', 'Có thể cô ấy đã không nghe thấy chuông.']
    ],
    mis: [['She must have been to Hue last year. (ý: không chắc)', 'She might have been to Hue last year.', 'Không chắc → might.'], ['You should have called me, didn\'t you?', 'You should have called me.', 'Không cần đuôi sai.'], ['He should had told me.', 'He should have told me.', 'should have + V3.']],
    quiz: [
      ['The streets are wet. It ___ last night.', ['must have rained', 'must rain', 'should rain', 'can\'t rain'], 0, 'Có bằng chứng → must have + V3.'],
      ['I failed. I ___ harder.', ['should have studied', 'must study', 'might study', 'can have studied'], 0, 'Tiếc nuối → should have + V3.'],
      ['He ___ the news. He looked totally surprised.', ['can\'t have heard', 'must hear', 'should hear', 'might hearing'], 0, 'Chắc chắn không → can\'t have heard.'],
      ['When I called, she ___ a shower.', ['must have been taking', 'must take', 'should take', 'might to take'], 0, 'must have been + V-ing.']
    ]
  });

  P('g10-question-tags', {
    sections: [
      { h: 'Cách chọn đuôi cho từng loại động từ', b: [
        { t: { h: ['Câu chính có', 'Đuôi', 'Ví dụ'], r: [['to be', 'be (đảo ngược khẳng định/ phủ định)', 'You are tired, **aren\'t you**?'], ['trợ động từ (have, will, can, should…)', 'chính trợ động từ đó', 'She can swim, **can\'t she**? He has left, **hasn\'t he**?'], ['động từ thường', 'do / does / did', 'They live here, **don\'t they**? You saw him, **didn\'t you**?'], ['have (sở hữu) nói thông thường', 'haven\'t hoặc don\'t', 'She has a car, **hasn\'t she**? / **doesn\'t she**?'], ['must (suy đoán)', 'mustn\'t → needn\'t / hay đuôi theo have', 'He must be ill, **isn\'t he**?']] } }
      ] },
      { h: 'Câu hỏi đuôi trong tình huống đặc biệt', b: [
        { ul: ['**I am** … → **aren\'t I?** · **I am not** … → **am I?**', '**Let\'s** … → **shall we?** · **Let me** … → **will you?**', 'Mệnh lệnh: **Close the door, will you?** (lịch sự: **would you? / could you?**) · phủ định: **Don\'t move, will you?**', '**There is/are** …, **isn\'t/aren\'t there?**', '**This/That is** … → **isn\'t it?** · **These/Those are** … → **aren\'t they?**', 'Các từ phủ định **no, never, hardly, rarely, seldom, nothing, nobody** → đuôi **khẳng định**: **He never smokes, does he?**'] },
        { warn: 'Với **everyone, someone, nobody, anyone**: đuôi dùng **they**: **Everyone is here, aren\'t they?** Với **nothing, something, everything, that**: đuôi dùng **it**.' }
      ] },
      { h: 'Ngữ điệu và cách trả lời', b: [
        { t: { h: ['Ngữ điệu', 'Ý nghĩa', 'Ví dụ'], r: [['lên giọng ↗', 'thật sự hỏi (không chắc)', 'You didn\'t lock the door, did you? ↗'], ['xuống giọng ↘', 'xác nhận, mong đồng ý', 'It\'s a lovely day, isn\'t it? ↘']] } },
        { p: 'Cách trả lời theo **sự thật**: **"You don\'t like fish, do you?" — Yes, I do. / No, I don\'t.** (Yes = có thích; No = không thích).' }
      ] }
    ],
    ex: [
      ['He never smokes, does he?', 'Anh ấy không bao giờ hút thuốc, đúng không?'], ['Everyone is here, aren\'t they?', 'Mọi người có mặt đủ cả rồi, đúng không?'], ['Don\'t forget the key, will you?', 'Đừng quên chìa khoá nhé?'], ['You have never been to Japan, have you?', 'Bạn chưa từng đến Nhật, đúng không?']
    ],
    mis: [['She can swim, doesn\'t she?', 'She can swim, can\'t she?', 'Đuôi dùng chính modal can.'], ['Everyone is here, isn\'t he?', 'Everyone is here, aren\'t they?', 'everyone → they.'], ['I am right, am not I?', 'I am right, aren\'t I?', 'Đuôi đặc biệt: aren\'t I?']],
    quiz: [
      ['Open the window, ___?', ['will you', 'shall we', 'do you', 'are you'], 0, 'Câu mệnh lệnh → will you?'],
      ['She has never been abroad, ___?', ['hasn\'t she', 'has she', 'is she', 'does she'], 1, 'never là phủ định → đuôi khẳng định: has she?'],
      ['Nobody called, ___?', ['did they', 'didn\'t they', 'did he', 'do they'], 0, 'nobody → they, đuôi khẳng định.'],
      ['These are your keys, ___?', ['isn\'t it', 'aren\'t they', 'are these', 'don\'t they'], 1, 'These are → aren\'t they?']
    ]
  });
})();
