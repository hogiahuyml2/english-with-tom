/* Tiếng Anh phổ thông — Lớp 11 (ngữ pháp). Nội dung tự biên soạn cho English With Tom. */
(function () {
  var S = (window.SCHOOL = window.SCHOOL || { lessons: {} });
  function L(id, d) { d.id = id; S.lessons[id] = d; }

  L('g11-participle-clauses', {
    grade: 11, icon: '✂️', title: 'Rút gọn mệnh đề bằng phân từ', sub: 'V-ing / V3 / having V3 / to V', level: 'Nâng cao',
    summary: 'Rút gọn mệnh đề quan hệ và mệnh đề trạng ngữ để câu văn gọn gàng, tự nhiên.',
    sections: [
      { h: '1. Rút gọn mệnh đề quan hệ', b: [
        { ul: ['**V-ing** (chủ động): **The man who is standing there → The man standing there is my uncle.**', '**V3** (bị động): **The books which were written by him → The books written by him are famous.**', '**to V** sau **the first / the last / the only / so sánh nhất**: **She was the first woman to win the prize.**'] }
      ] },
      { h: '2. Rút gọn mệnh đề trạng ngữ (cùng chủ ngữ)', b: [
        { ul: ['**V-ing** (chủ động, hai hành động gần nhau/ cùng lúc): **While I was walking home, I met an old friend. → Walking home, I met an old friend.**', '**Having + V3** (hành động xảy ra trước): **After she had finished her work, she went home. → Having finished her work, she went home.**', '**V3 / Being + V3** (bị động): **Because he was tired, he went to bed. → Tired, he went to bed.**', 'Phủ định: **Not knowing the answer, he kept silent.**'] },
        { warn: 'Chủ ngữ của mệnh đề rút gọn **phải trùng** với chủ ngữ của mệnh đề chính. Sai: **Walking down the street, a car hit him.** (xe không đi bộ). Đúng: **Walking down the street, he was hit by a car.**' }
      ] }
    ],
    ex: [['The man standing at the door is my uncle.', 'Người đàn ông đang đứng ở cửa là chú mình.'], ['The books written by him are very famous.', 'Những cuốn sách do ông ấy viết rất nổi tiếng.'], ['She was the first woman to win the prize.', 'Bà ấy là người phụ nữ đầu tiên giành giải thưởng.'], ['Walking home, I met an old friend.', 'Trên đường đi bộ về nhà, mình gặp một người bạn cũ.'], ['Having finished his homework, he went out to play.', 'Làm xong bài tập, cậu ấy ra ngoài chơi.'], ['Not knowing the answer, she kept silent.', 'Không biết câu trả lời, cô ấy giữ im lặng.'], ['Built in 1900, the bridge is still in use.', 'Được xây vào năm 1900, cây cầu vẫn còn được sử dụng.'], ['Feeling tired, he went to bed early.', 'Cảm thấy mệt, anh ấy đi ngủ sớm.']],
    mis: [['Walking down the street, a car hit him.', 'Walking down the street, he was hit by a car.', 'Chủ ngữ của mệnh đề rút gọn phải trùng với chủ ngữ mệnh đề chính.'], ['The students sat in the room talked loudly.', 'The students sitting in the room talked loudly.', 'Rút gọn chủ động dùng V-ing.'], ['Finished his homework, he went out.', 'Having finished his homework, he went out.', 'Hành động hoàn thành trước → Having + V3.'], ['The house building in 1990 is old.', 'The house built in 1990 is old.', 'Bị động rút gọn dùng V3.']],
    quiz: [
      ['The girl ___ next to me is my cousin.', ['sit', 'sitting', 'sat', 'to sit'], 1, 'who is sitting → sitting (chủ động).'],
      ['The cars ___ in this factory are exported.', ['making', 'made', 'make', 'to make'], 1, 'which are made → made (bị động).'],
      ['___ the letter, she burst into tears.', ['Reading', 'Read', 'To read', 'Having been read'], 0, 'Hai hành động gần nhau, cùng chủ ngữ, chủ động → Reading.'],
      ['___ dinner, we went for a walk.', ['Having finished', 'Finishing', 'Finished', 'To finish'], 0, 'Hoàn thành trước khi đi dạo → Having finished.'],
      ['He was the last student ___ the room.', ['leave', 'leaving', 'to leave', 'left'], 2, 'the last + to V.'],
      ['___ the answer, he kept silent.', ['Not knowing', 'Knowing not', 'Don\'t know', 'Not known'], 0, 'Phủ định rút gọn: Not + V-ing.'],
      ['___ in 1950, the house needs repairing.', ['Building', 'Built', 'Having built', 'To build'], 1, 'Bị động: Built in 1950.'],
      ['Which sentence is correct?', ['Walking in the park, the rain started.', 'Walking in the park, we were caught in the rain.', 'Walking in the park, it started to rain on us.', 'Having walked in the park, the rain started.'], 1, 'Chủ ngữ của "walking" phải là người đi bộ: we.']
    ]
  });

  L('g11-inversion', {
    grade: 11, icon: '🔄', title: 'Đảo ngữ', sub: 'Never have I..., Not only does..., Hardly had...', level: 'Nâng cao',
    summary: 'Đưa trạng từ phủ định hoặc cụm từ nhấn mạnh lên đầu câu và đảo trợ động từ lên trước chủ ngữ.',
    sections: [
      { h: '1. Đảo ngữ với trạng từ phủ định/hạn chế', b: [
        { f: ['Trạng từ phủ định + trợ động từ + S + V'] },
        { t: { h: ['Mở đầu câu', 'Ví dụ'], r: [['Never / Rarely / Seldom / Little', 'Never have I seen such a beautiful view.'], ['Hardly / Scarcely ... when', 'Hardly had she left when it started to rain.'], ['No sooner ... than', 'No sooner had he arrived than the meeting began.'], ['Not only ... but also', 'Not only does she sing well, but she also dances beautifully.'], ['Only when / Only after / Only then', 'Only when I lost it did I realise its value.'], ['Not until ...', 'Not until midnight did he come home.'], ['Under no circumstances / At no time / In no way', 'Under no circumstances should you open this door.']] } },
        { tip: 'Nếu câu gốc không có trợ động từ, mượn **do / does / did**: **Little did he know the truth.**' }
      ] },
      { h: '2. Đảo ngữ trong câu điều kiện và với so/such', b: [
        { ul: ['Loại 1: **Should you need help, call me. (= If you should need help...)**', 'Loại 2: **Were I you, I would accept. (= If I were you...)**', 'Loại 3: **Had I known, I would have told you. (= If I had known...)**', '**So + adj + be + S + that ...**: **So beautiful was the view that we stayed for hours.**', '**Such + be + N + that...**: **Such was his anger that he shouted.**'] }
      ] }
    ],
    ex: [['Never have I seen such a beautiful view.', 'Chưa bao giờ mình thấy khung cảnh đẹp như vậy.'], ['Hardly had she left when it started to rain.', 'Cô ấy vừa đi thì trời bắt đầu mưa.'], ['No sooner had he arrived than the meeting began.', 'Anh ấy vừa đến thì cuộc họp bắt đầu.'], ['Not only does she sing well, but she also dances beautifully.', 'Cô ấy không chỉ hát hay mà còn nhảy đẹp.'], ['Only when I lost it did I realise its value.', 'Chỉ khi mất nó, mình mới nhận ra giá trị của nó.'], ['Not until midnight did he come home.', 'Mãi đến nửa đêm anh ấy mới về nhà.'], ['Had I known the truth, I would have told you.', 'Nếu mình biết sự thật thì đã nói với bạn.'], ['So beautiful was the view that we stayed for hours.', 'Khung cảnh đẹp đến mức chúng mình ở lại hàng giờ.']],
    mis: [['Never I have seen such a film.', 'Never have I seen such a film.', 'Đảo trợ động từ lên trước chủ ngữ.'], ['No sooner had he left when it rained.', 'No sooner had he left than it rained.', 'No sooner đi với than; Hardly đi với when.'], ['Not only she sings, but also she dances.', 'Not only does she sing, but she also dances.', 'Not only + đảo ngữ; vế sau không đảo.'], ['Only when he came, I knew the truth.', 'Only when he came did I know the truth.', 'Only when + mệnh đề, vế chính đảo ngữ.']],
    quiz: [
      ['Never ___ such a delicious meal.', ['I have eaten', 'have I eaten', 'I ate', 'did I eaten'], 1, 'Never + have + S + V3.'],
      ['Hardly ___ the room when the phone rang.', ['he had entered', 'had he entered', 'did he enter', 'he entered'], 1, 'Hardly + had + S + V3 + when.'],
      ['No sooner had she sat down ___ the bell rang.', ['when', 'than', 'that', 'then'], 1, 'No sooner ... than.'],
      ['Not only ___ English, but he also speaks French.', ['he speaks', 'does he speak', 'he does speak', 'speaks he'], 1, 'Not only + do/does + S + V.'],
      ['Only after the show ended ___ home.', ['they went', 'did they go', 'they did go', 'went they'], 1, 'Only after + mệnh đề + đảo ngữ: did they go.'],
      ['___ you need any help, please call me. (= If you should need...)', ['Should', 'Would', 'Did', 'Had'], 0, 'Should + S + V ở loại 1 đảo ngữ.'],
      ['___ I known about the meeting, I would have attended. (= If I had known)', ['Had', 'Did', 'Would', 'Have'], 0, 'Had I known = If I had known.'],
      ['Little ___ about the surprise party.', ['he knew', 'did he know', 'knew he', 'he did know'], 1, 'Little + did + S + V.']
    ]
  });

  L('g11-subjunctive-causative', {
    grade: 11, icon: '🎛️', title: 'Câu giả định và thể truyền khiến', sub: 'suggest that... / would rather / have sth done', level: 'Nâng cao',
    summary: 'Cách diễn đạt đề nghị, yêu cầu, mong muốn, và việc nhờ người khác làm gì.',
    sections: [
      { h: '1. Câu giả định (subjunctive)', b: [
        { ul: ['**suggest, recommend, propose, insist, demand, require, request, advise + (that) + S + (should) + V(bare)**: **The doctor recommended that he stop smoking.**', '**It is important/essential/necessary/vital that + S + (should) + V(bare)**: **It is vital that she be on time.**', '**would rather + S + V2**: **I\'d rather you came later.** (mong muốn ở hiện tại/tương lai)', '**It\'s (high/about) time + S + V2**: **It\'s time we went home.**', '**as if / as though + V2 / had V3** (điều không có thật): **He talks as if he knew everything.**'] },
        { warn: 'Không nói "suggest someone to do". Đúng: **suggest (that) he go / suggest going**.' }
      ] },
      { h: '2. Thể truyền khiến (causative)', b: [
        { f: ['have + O + V3: nhờ ai làm giúp việc gì', 'have + O (người) + V(bare)', 'get + O (người) + to V', 'make + O + V(bare): bắt buộc', 'let + O + V(bare): cho phép'] },
        { p: '**I had my car repaired.** — **I had the mechanic repair my car.** — **I got the mechanic to repair my car.** — **She made me clean the room.** — **He let me use his phone.**' }
      ] }
    ],
    ex: [['The doctor recommended that he stop smoking.', 'Bác sĩ khuyên anh ấy nên bỏ thuốc.'], ['It is essential that every student be on time.', 'Điều quan trọng là mọi học sinh phải đúng giờ.'], ["I'd rather you came later.", 'Mình muốn bạn đến muộn hơn.'], ["It's time we went home.", 'Đã đến lúc chúng ta về nhà.'], ['He talks as if he knew everything.', 'Anh ấy nói như thể biết mọi thứ.'], ['I had my car repaired yesterday.', 'Hôm qua mình đã nhờ người sửa xe.'], ['She got her brother to fix the computer.', 'Cô ấy nhờ anh trai sửa máy tính.'], ['The teacher made us rewrite the essay.', 'Cô giáo bắt chúng mình viết lại bài luận.']],
    mis: [['He suggested me to go.', 'He suggested (that) I go. / He suggested that I should go.', 'suggest không đi với O + to V.'], ['The teacher insisted that he does the work.', 'The teacher insisted that he do the work.', 'Câu giả định dùng động từ nguyên mẫu.'], ['I had my hair cut by myself.', 'I cut my hair myself. / I had my hair cut.', 'have sth done nghĩa là nhờ người khác làm.'], ["I'll get him fix the printer.", "I'll get him to fix the printer. / I'll have him fix the printer.", 'get + O + to V; have + O + V.']],
    quiz: [
      ['The manager insisted that the report ___ on time.', ['is finished', 'be finished', 'was finish', 'will be finished'], 1, 'insist that + (should) be + V3: be finished.'],
      ['I\'d rather you ___ me tomorrow.', ['call', 'called', 'will call', 'calling'], 1, 'would rather + S + V2.'],
      ['It is time we ___ home.', ['go', 'went', 'will go', 'going'], 1, "It's time + S + V2."],
      ['She ___ her hair cut every month.', ['has', 'makes', 'lets', 'gets to'], 0, 'have + O + V3 (nhờ cắt tóc).'],
      ['The teacher made the students ___ the text again.', ['to read', 'reading', 'read', 'reads'], 2, 'make + O + V(bare).'],
      ['He suggested ___ to the cinema.', ['to go', 'going', 'me to go', 'for going'], 1, 'suggest + V-ing.'],
      ['She looked as if she ___ a ghost.', ['seeing', 'had seen', 'sees', 'would see'], 1, 'Nhìn như thể vừa thấy ma (việc xảy ra trước đó) → as if + had V3.'],
      ['We ___ our house painted last week.', ['made', 'let', 'had', 'got to'], 2, 'had our house painted.']
    ]
  });

  L('g11-reporting-verbs', {
    grade: 11, icon: '📣', title: 'Động từ tường thuật', sub: 'admit, deny, suggest, accuse...', level: 'Nâng cao',
    summary: 'Các cấu trúc tường thuật nâng cao với động từ tường thuật khác nhau.',
    sections: [
      { h: '1. Các mẫu câu', b: [
        { t: { h: ['Mẫu', 'Động từ', 'Ví dụ'], r: [['V + V-ing', 'admit, deny, suggest, recommend, mention, regret', 'He admitted stealing the money.'], ['V + to V', 'promise, threaten, offer, refuse, agree, claim, decide', 'She promised to help us.'], ['V + O + to V', 'advise, ask, tell, order, warn, remind, invite, encourage, persuade', 'He advised me to see a doctor.'], ['V + O + of/for/on + V-ing', 'accuse sb of, blame sb for, congratulate sb on, thank sb for, apologise (to sb) for', 'She accused him of lying.'], ['V + that clause', 'say, explain, suggest, admit, claim, announce', 'He explained that he was late.']] } },
        { warn: 'Không dùng "explain me" hay "suggest me to". Đúng: **explain to me**, **suggest (that) I ...**.' }
      ] },
      { h: '2. Ví dụ chuyển đổi', b: [
        { ul: ['"I\'m sorry I broke the vase," she said. → She apologised for breaking the vase.', '"You should see a doctor," he said to me. → He advised me to see a doctor.', '"I didn\'t take your pen," he said. → He denied taking my pen.', '"Congratulations on passing the exam!" → She congratulated me on passing the exam.'] }
      ] }
    ],
    ex: [['He admitted stealing the money.', 'Anh ta thừa nhận đã lấy tiền.'], ['She promised to help us.', 'Cô ấy hứa sẽ giúp chúng mình.'], ['The doctor advised me to rest.', 'Bác sĩ khuyên mình nên nghỉ ngơi.'], ['She accused him of lying.', 'Cô ấy buộc tội anh ta nói dối.'], ['They congratulated me on winning the prize.', 'Họ chúc mừng mình vì đã giành giải.'], ['He denied taking my pen.', 'Anh ấy phủ nhận việc lấy bút của mình.'], ['She apologised for being late.', 'Cô ấy xin lỗi vì đến muộn.'], ['The teacher warned us not to cheat.', 'Cô giáo cảnh báo chúng mình không được gian lận.']],
    mis: [['He suggested me to see a doctor.', 'He suggested that I see a doctor. / He suggested seeing a doctor.', 'suggest không + O + to V.'], ['She promised helping me.', 'She promised to help me.', 'promise + to V.'], ['He admitted to steal the money.', 'He admitted stealing the money.', 'admit + V-ing.'], ['She explained me the rule.', 'She explained the rule to me.', 'explain to sb.']],
    quiz: [
      ['"I broke the window," he said. → He admitted ___ the window.', ['to break', 'breaking', 'break', 'to breaking'], 1, 'admit + V-ing.'],
      ['"I will help you," she said. → She promised ___ me.', ['helping', 'to help', 'help', 'that help'], 1, 'promise + to V.'],
      ['"You should stop smoking," the doctor said. → The doctor advised him ___ smoking.', ['stop', 'to stop', 'stopping', 'for stop'], 1, 'advise + O + to V.'],
      ['"You stole my wallet!" she said. → She accused him ___ stealing her wallet.', ['for', 'of', 'to', 'about'], 1, 'accuse sb of + V-ing.'],
      ['"Well done on winning!" → They congratulated her ___ winning the contest.', ['for', 'on', 'of', 'to'], 1, 'congratulate sb on + V-ing.'],
      ['"I didn\'t cheat," he said. → He denied ___.', ['to cheat', 'cheating', 'cheat', 'that cheat'], 1, 'deny + V-ing.'],
      ['"Don\'t be late," he said. → He warned me ___ late.', ['to not be', 'not to be', 'don\'t be', 'not being'], 1, 'warn + O + not to V.'],
      ['Which sentence is correct?', ['She suggested me to leave.', 'She suggested leaving.', 'She suggested to leave.', 'She suggested me leaving.'], 1, 'suggest + V-ing hoặc suggest + that clause.']
    ]
  });

  L('g11-cleft-sentences', {
    grade: 11, icon: '🔦', title: 'Câu chẻ (nhấn mạnh)', sub: 'It is ... that / What ... is ...', level: 'Nâng cao',
    summary: 'Cấu trúc nhấn mạnh một thành phần của câu.',
    sections: [
      { h: '1. It is/was ... that/who ...', b: [
        { f: ['It + is/was + thành phần cần nhấn mạnh + that/who + phần còn lại'] },
        { ul: ['Nhấn mạnh chủ ngữ (người): **Tom broke the window. → It was Tom who/that broke the window.**', 'Nhấn mạnh tân ngữ: **I met Lan yesterday. → It was Lan (that) I met yesterday.**', 'Nhấn mạnh trạng ngữ: **I met her yesterday. → It was yesterday that I met her.**'] },
        { warn: 'Không dùng **which, when, where** thay cho **that** trong cấu trúc này: **It was in 1990 that he was born.** (không phải "when").' }
      ] },
      { h: '2. What-cleft (câu chẻ với what)', b: [
        { f: ['What + S + V + is/was + ...', 'All + S + V + is/was + ...'] },
        { p: '**What I need is a long holiday.** — **All I want is some peace.** — **What happened was that the lights went out.**' },
        { tip: 'Dùng **It is ... that** để nhấn mạnh một thông tin cụ thể; dùng **What ... is** để nhấn mạnh điều ta cần, muốn, làm.' }
      ] }
    ],
    ex: [['It was Tom who broke the window.', 'Chính Tom là người làm vỡ cửa sổ.'], ['It was Lan that I met yesterday.', 'Chính Lan là người mình gặp hôm qua.'], ['It was yesterday that I met her.', 'Chính hôm qua mình đã gặp cô ấy.'], ['It is in this city that I was born.', 'Chính ở thành phố này mình đã sinh ra.'], ['What I need is a long holiday.', 'Điều mình cần là một kỳ nghỉ dài.'], ['All I want is some peace and quiet.', 'Tất cả những gì mình muốn là sự yên tĩnh.'], ['What happened was that the lights went out.', 'Chuyện đã xảy ra là đèn bị tắt.'], ["It isn't money that makes people happy.", 'Không phải tiền làm con người hạnh phúc.']],
    mis: [['It was my brother which broke the vase.', 'It was my brother who/that broke the vase.', 'Người → who/that, không dùng which.'], ['It was in 2010 when he moved to Hue.', 'It was in 2010 that he moved to Hue.', 'Dùng that, không dùng when.'], ['What I need are more time.', 'What I need is more time.', 'Cấu trúc What + S + V + is.'], ['It was in the park where we first met.', 'It was in the park that we first met.', 'Trong câu chẻ dùng that cho trạng ngữ nơi chốn, không dùng where.']],
    quiz: [
      ['It was Mai ___ won the first prize.', ['which', 'who', 'whom', 'where'], 1, 'Nhấn mạnh người làm chủ ngữ → who/that.'],
      ['It was last night ___ I saw the accident.', ['when', 'that', 'which', 'what'], 1, 'Nhấn mạnh trạng ngữ thời gian → that.'],
      ['___ I need most is a good sleep.', ['That', 'What', 'Which', 'Who'], 1, 'What-cleft: What I need most is...'],
      ['It was in this park ___ we first met.', ['where', 'that', 'when', 'what'], 1, 'Nhấn mạnh trạng ngữ nơi chốn → that.'],
      ['All she wants ___ to be left alone.', ['are', 'is', 'were', 'be'], 1, 'All she wants is ...'],
      ['It was a book ___ she gave me for my birthday.', ['who', 'that', 'where', 'whose'], 1, 'Nhấn mạnh vật → that.'],
      ['Which sentence emphasises "yesterday"?', ['It was yesterday that she called.', 'Yesterday she called it.', 'What she called was yesterday.', 'It was she who yesterday called.'], 0, 'It was yesterday that ...'],
      ['___ happened was that the car broke down.', ['It', 'What', 'That', 'Which'], 1, 'What happened was that ...']
    ]
  });

  L('g11-agreement-parallel', {
    grade: 11, icon: '⚖️', title: 'Hòa hợp chủ ngữ – động từ và cấu trúc song song', sub: 'Subject–verb agreement & parallelism', level: 'Nâng cao',
    summary: 'Chọn dạng động từ đúng theo chủ ngữ và giữ cấu trúc cân đối khi liệt kê.',
    sections: [
      { h: '1. Hòa hợp chủ ngữ – động từ', b: [
        { ul: ['**Each / every / either / neither / one of + danh từ số nhiều** → động từ **số ít**: **Each of the students has a book.**', '**A number of + N số nhiều** → số nhiều; **The number of + N số nhiều** → số ít: **A number of students are absent. The number of students is 40.**', 'Danh từ không đếm được → số ít: **The news is good. Information is useful.** Danh từ số nhiều cố định: **scissors, trousers, glasses** → số nhiều.', '**as well as, with, together with, along with**: động từ hợp với chủ ngữ **thứ nhất**: **Tom, together with his friends, is coming.**', '**either ... or / neither ... nor / not only ... but also**: hợp với danh từ **gần động từ nhất**: **Neither Tom nor his friends are here.**', '**both ... and** → số nhiều. Khoảng cách, tiền, thời gian coi như số ít: **Ten dollars is enough.**', '**There is / There are**: hợp với danh từ đứng ngay sau.'] }
      ] },
      { h: '2. Cấu trúc song song', b: [
        { p: 'Các thành phần nối bằng **and / or / but** hoặc cặp **both...and, either...or, not only...but also, neither...nor, whether...or** phải cùng dạng ngữ pháp.' },
        { ul: ['Sai: **She likes swimming, to cook, and reading.** Đúng: **She likes swimming, cooking, and reading.**', 'Sai: **He is intelligent, kind, and has a sense of humour.** Đúng: **He is intelligent, kind, and humorous.**'] }
      ] }
    ],
    ex: [['Each of the students has a book.', 'Mỗi học sinh đều có một quyển sách.'], ['A number of students are absent today.', 'Hôm nay một số học sinh vắng mặt.'], ['The number of students in my class is 40.', 'Sĩ số lớp mình là 40 học sinh.'], ['The news is very good.', 'Tin tức rất tốt.'], ['Tom, together with his friends, is going camping.', 'Tom cùng các bạn sẽ đi cắm trại.'], ['Neither Tom nor his friends are at home.', 'Cả Tom lẫn các bạn của cậu ấy đều không ở nhà.'], ['Ten dollars is enough for the ticket.', 'Mười đô là đủ cho vé.'], ['She likes swimming, cooking, and reading.', 'Cô ấy thích bơi lội, nấu ăn và đọc sách.']],
    mis: [['The number of students are increasing.', 'The number of students is increasing.', 'The number of → số ít.'], ['A number of students is absent.', 'A number of students are absent.', 'A number of → số nhiều.'], ['The news are good.', 'The news is good.', 'news là danh từ không đếm được.'], ['She likes swimming, to cook, and reading.', 'She likes swimming, cooking, and reading.', 'Cấu trúc song song: cùng V-ing.'], ['Neither Tom nor his friends is here.', 'Neither Tom nor his friends are here.', 'Hợp với danh từ gần động từ: friends → are.']],
    quiz: [
      ['Each of the girls ___ a new bike.', ['have', 'has', 'are having', 'were'], 1, 'Each of + N số nhiều → động từ số ít.'],
      ['The number of visitors ___ increasing.', ['are', 'is', 'were', 'have been'], 1, 'The number of → số ít.'],
      ['A number of students ___ late today.', ['is', 'was', 'are', 'has been'], 2, 'A number of → số nhiều.'],
      ['The information ___ very useful.', ['are', 'is', 'were', 'have been'], 1, 'information không đếm được.'],
      ['Neither my parents nor my brother ___ at home.', ['are', 'is', 'were', 'have been'], 1, 'Hợp với danh từ gần động từ nhất: my brother → is.'],
      ['My mother, as well as my aunts, ___ to the party.', ['are going', 'is going', 'go', 'have gone'], 1, 'Hợp với chủ ngữ thứ nhất: my mother → is.'],
      ['He enjoys reading, writing, and ___.', ['to travel', 'travelling', 'travel', 'travelled'], 1, 'Song song: reading, writing, travelling.'],
      ['Both Tom and Lan ___ good at English.', ['is', 'are', 'was', 'be'], 1, 'both ... and → số nhiều.']
    ]
  });

  L('g11-future-advanced', {
    grade: 11, icon: '🚀', title: 'Tương lai tiếp diễn, tương lai hoàn thành và các cách nói tương lai khác', sub: 'Future continuous, future perfect & other future forms', level: 'Nâng cao',
    summary: 'Diễn tả hành động sẽ đang diễn ra (will be V-ing), sẽ hoàn tất trước một mốc (will have V3) và các cấu trúc be about to, be to, be due to.',
    sections: [
      { h: '1. Future continuous và Future perfect', b: [
        { t: { h: ['Thì', 'Cấu trúc', 'Dùng khi', 'Ví dụ'], r: [['Future continuous', 'will be + V-ing', 'hành động đang diễn ra tại một thời điểm trong tương lai', 'At 8 p.m. tomorrow, I **will be watching** the final.'], ['Future perfect', 'will have + V3', 'hành động hoàn tất **trước** một mốc tương lai', 'By next June, she **will have graduated**.'], ['Future perfect continuous', 'will have been + V-ing', 'nhấn mạnh **độ dài** của quá trình đến một mốc', 'By 2030, he **will have been working** here for 20 years.']] } },
        { p: 'Dấu hiệu future perfect: **by + mốc tương lai** (by tomorrow, by 2030, by the time + hiện tại đơn), **before** … Ví dụ: **By the time you arrive, I will have cooked dinner.**' },
        { tip: 'Future continuous cũng dùng để hỏi lịch sự về kế hoạch: **Will you be using the car tonight?** (hỏi nhẹ nhàng hơn "Will you use…?")' }
      ] },
      { h: '2. Các cấu trúc tương lai khác', b: [
        { t: { h: ['Cấu trúc', 'Nghĩa', 'Ví dụ'], r: [['**be about to + V**', 'sắp sửa (ngay lập tức)', 'The film **is about to start**.'], ['**be due to + V**', 'dự kiến (theo lịch)', 'The train **is due to arrive** at 9.'], ['**be to + V**', 'theo kế hoạch/mệnh lệnh chính thức', 'The president **is to visit** Japan next month.'], ['**be likely to + V**', 'có khả năng', 'It **is likely to rain** tonight.'], ['**be bound to + V**', 'chắc chắn sẽ', 'You **are bound to pass** if you work hard.']] } }
      ] },
      { h: '3. Mệnh đề thời gian và điều kiện', b: [
        { ul: ['Sau **when, as soon as, before, after, until, by the time, if, unless** về tương lai: dùng **hiện tại đơn / hiện tại hoàn thành** (không dùng will): **I\'ll call you as soon as I have arrived.**', '**By the time** + hiện tại đơn, mệnh đề chính **will have V3**: By the time he **gets** home, we **will have left**.', 'Với **will be V-ing** không dùng cho hành động tức thì mới quyết định: ✗ "I\'ll be calling you now."'] }
      ] }
    ],
    ex: [
      ['This time next week, I will be lying on a beach in Phu Quoc.', 'Giờ này tuần sau mình sẽ đang nằm trên bãi biển Phú Quốc.'], ['By the end of this year, she will have saved enough money.', 'Đến cuối năm nay cô ấy sẽ tiết kiệm đủ tiền.'], ['By the time you arrive, we will have finished dinner.', 'Lúc bạn đến thì chúng mình đã ăn tối xong.'],
      ['In June, he will have been teaching for ten years.', 'Đến tháng Sáu, thầy ấy đã dạy được mười năm.'], ['The concert is about to begin.', 'Buổi hoà nhạc sắp bắt đầu.'], ['The plane is due to land at 5 p.m.', 'Máy bay dự kiến hạ cánh lúc 5 giờ chiều.'],
      ['Will you be using your laptop tonight?', 'Tối nay bạn có dùng laptop không?'], ['We are bound to meet again.', 'Chắc chắn chúng ta sẽ gặp lại.'], ['I will call you when I have finished my homework.', 'Mình sẽ gọi bạn khi làm xong bài tập.']
    ],
    mis: [
      ['By 2030 I will study here for ten years.', 'By 2030 I will have been studying here for ten years.', 'Mốc by + thời gian → future perfect (continuous).'], ['I will call you when I will arrive.', 'I will call you when I arrive.', 'Mệnh đề thời gian tương lai → hiện tại đơn.'], ['By the time she will arrive, we will have left.', 'By the time she arrives, we will have left.', 'by the time + hiện tại đơn.'],
      ['The film is about start.', 'The film is about to start.', 'be about to + V.'], ['This time tomorrow I will fly to Paris. (đang bay)', 'This time tomorrow I will be flying to Paris.', 'Đang diễn ra tại thời điểm tương lai → will be V-ing.']
    ],
    quiz: [
      ['At 9 p.m. tonight, I ___ my favourite series.', ['will watch', 'will be watching', 'will have watched', 'watch'], 1, 'Đang diễn ra lúc 9 giờ tối → will be watching.'],
      ['By next month, we ___ the project.', ['will complete', 'will have completed', 'are completing', 'completed'], 1, 'by + mốc tương lai → will have completed.'],
      ['By the time he ___ home, dinner will have been ready.', ['will get', 'gets', 'got', 'will have got'], 1, 'by the time + hiện tại đơn.'],
      ['The bus ___ to leave in five minutes.', ['is due', 'is about', 'will due', 'is going'], 0, 'be due to + V (theo lịch).'],
      ['Look! The man ___ jump into the river!', ['is about to', 'will have', 'was due', 'is to'], 0, 'be about to = sắp sửa ngay.'],
      ['She ___ for this company for 15 years by next year.', ['will work', 'will have been working', 'is working', 'works'], 1, 'Nhấn mạnh quá trình kéo dài → will have been working.'],
      ['I\'ll text you as soon as I ___.', ['will arrive', 'arrive', 'arrived', 'am going to arrive'], 1, 'as soon as + hiện tại đơn.'],
      ['"___ the car tomorrow?" "No, you can use it."', ['Will you use', 'Will you be using', 'Are you use', 'Do you using'], 1, 'Hỏi lịch sự về kế hoạch → Will you be using…?'],
      ['He is ___ to win; he practises every day.', ['bound', 'about', 'due', 'being'], 0, 'be bound to = chắc chắn sẽ.']
    ]
  });

  L('g11-passive-reporting', {
    grade: 11, icon: '📰', title: 'Bị động với động từ tường thuật: It is said that…', sub: 'Passive reporting structures', level: 'Nâng cao',
    summary: 'Cấu trúc bị động phổ biến trong tin tức: It is said/believed/thought that… và He is said to be… ; cùng bị động của câu mệnh lệnh, nhờ vả, cảm giác.',
    sections: [
      { h: '1. Hai mẫu cơ bản', b: [
        { f: ['Mẫu 1: **It + is/was + V3 (said, believed, thought, reported, expected, known…) + that + S + V**', 'Mẫu 2: **S + is/was + V3 + to V / to have V3**'] },
        { t: { h: ['Chủ động', 'Bị động mẫu 1', 'Bị động mẫu 2'], r: [['People say that he is a genius.', 'It **is said that** he is a genius.', 'He **is said to be** a genius.'], ['They believe that she left yesterday.', 'It **is believed that** she left yesterday.', 'She **is believed to have left** yesterday.'], ['People think that the building is old.', 'It **is thought that** the building is old.', 'The building **is thought to be** old.']] } },
        { tip: 'Nếu động từ trong mệnh đề **xảy ra trước** động từ tường thuật → dùng **to have V3** (to have left). Nếu **cùng thời điểm** hoặc tương lai → **to V** (to be, to leave).' }
      ] },
      { h: '2. Các động từ thường dùng', b: [
        { ul: ['**say, think, believe, report, expect, know, consider, claim, suppose, understand, rumour, allege**', 'Thì của động từ bị động theo thời điểm nói: **is said** (hiện tại) / **was said** (quá khứ): He **was said to have been** ill.', 'Với **continuous**: **is thought to be living** abroad = Người ta nghĩ anh ấy đang sống ở nước ngoài.'] }
      ] },
      { h: '3. Một số cấu trúc bị động đặc biệt', b: [
        { t: { h: ['Loại', 'Chủ động', 'Bị động'], r: [['Mệnh lệnh', 'Open the door.', '**Let the door be opened.** / The door should be opened.'], ['Nhờ vả (causative)', 'I had them repair my car.', 'I had my car **repaired**.'], ['Giác quan', 'They saw him steal the bag.', 'He was seen **to steal** the bag.'], ['Cho phép / buộc', 'They made him pay.', 'He was made **to pay**.']] } },
        { warn: 'Sau **make, see, hear, watch** ở chủ động dùng V nguyên mẫu không to (They made him **pay**). Khi chuyển bị động **thêm to**: He was made **to pay**.' }
      ] }
    ],
    ex: [
      ['It is said that this restaurant serves the best pho in town.', 'Người ta nói quán này phục vụ phở ngon nhất thành phố.'], ['He is believed to be the richest man in the country.', 'Ông ấy được cho là người giàu nhất nước.'], ['She is said to have won three gold medals.', 'Cô ấy được cho là đã giành ba huy chương vàng.'],
      ['It was reported that the fire had started in the kitchen.', 'Có thông tin rằng đám cháy bắt đầu từ nhà bếp.'], ['The building is thought to be 200 years old.', 'Toà nhà được cho là đã 200 năm tuổi.'], ['The singer is expected to arrive at noon.', 'Ca sĩ được dự kiến sẽ đến vào buổi trưa.'],
      ['I had my hair cut yesterday.', 'Hôm qua mình đi cắt tóc.'], ['He was seen to leave the house at midnight.', 'Người ta thấy anh ta rời khỏi nhà lúc nửa đêm.'], ['They were made to wait for two hours.', 'Họ bị bắt đợi hai tiếng.']
    ],
    mis: [
      ['He is said that he is clever.', 'It is said that he is clever. / He is said to be clever.', 'Hai mẫu không được trộn lẫn.'], ['She is believed to leave last night.', 'She is believed to have left last night.', 'Việc xảy ra trước → to have V3.'], ['He was made pay the fine.', 'He was made to pay the fine.', 'Bị động sau make → thêm to.'],
      ['It is thought him to be rich.', 'He is thought to be rich. / It is thought that he is rich.', 'Không dùng "It is thought him".']
    ],
    quiz: [
      ['It ___ that the road will be closed next week.', ['is reported', 'reports', 'is reporting', 'reported'], 0, 'It is reported that…'],
      ['The man is said ___ a millionaire.', ['to be', 'being', 'be', 'that he is'], 0, 'be said + to V.'],
      ['She is believed ___ the country two years ago.', ['to leave', 'to have left', 'leaving', 'having left to'], 1, 'Xảy ra trước → to have left.'],
      ['The new law is expected ___ effect next month.', ['take', 'to take', 'taking', 'to taking'], 1, 'is expected + to V.'],
      ['I had my car ___ yesterday.', ['repair', 'repairing', 'repaired', 'to repair'], 2, 'have + object + V3.'],
      ['He was seen ___ the building at night.', ['enter', 'entering', 'to enter', 'entered'], 2, 'Bị động sau see → to V (hoặc V-ing).'],
      ['They ___ to have been in the accident.', ['say', 'are said', 'said', 'is said'], 1, 'Chủ ngữ số nhiều → are said to have been.'],
      ['It ___ that the singer was ill.', ['is thought', 'thinks', 'was thinking', 'think'], 0, 'It is thought that…'],
      ['The workers ___ to stay late.', ['made', 'were made', 'make', 'was made'], 1, 'Bị động: were made to stay.']
    ]
  });

  L('g11-gerund-infinitive-meaning', {
    grade: 11, icon: '🔁', title: 'V-ing hay to V: những động từ đổi nghĩa', sub: 'remember, forget, stop, try, regret, go on…', level: 'Nâng cao',
    summary: 'Một số động từ đi với cả V-ing và to V nhưng nghĩa khác nhau; cùng các mẫu need/want/allow + tân ngữ + to V.',
    sections: [
      { h: '1. Đổi nghĩa khi đổi dạng', b: [
        { t: { h: ['Động từ', '+ V-ing (việc đã xảy ra / quá trình)', '+ to V (việc sẽ xảy ra / mục đích)'], r: [['**remember**', 'nhớ **đã làm**: I remember **meeting** her. (nhớ đã gặp)', 'nhớ **phải làm**: Remember **to lock** the door.'], ['**forget**', 'quên **đã làm**: I\'ll never forget **seeing** the sea.', 'quên **phải làm**: I forgot **to buy** milk.'], ['**stop**', 'dừng hẳn việc đang làm: He stopped **smoking**.', 'dừng lại để làm việc khác: He stopped **to smoke**.'], ['**try**', 'thử xem sao: Try **adding** more salt.', 'cố gắng: I tried **to open** the door.'], ['**regret**', 'hối tiếc **đã làm**: I regret **telling** her.', 'tiếc phải (thông báo): I regret **to inform** you…'], ['**go on**', 'tiếp tục việc đang làm: He went on **talking**.', 'chuyển sang việc tiếp theo: He went on **to talk** about sport.'], ['**mean**', 'nghĩa là / kéo theo: This means **working** harder.', 'định, có ý: I didn\'t mean **to hurt** you.']] } }
      ] },
      { h: '2. Không đổi nghĩa (gần như)', b: [
        { ul: ['**like, love, hate, prefer + V-ing hoặc to V**: I like swimming ≈ I like to swim. (V-ing nói sở thích chung; **would like/love/hate + to V** nói mong muốn cụ thể).', '**begin, start, continue** + V-ing/to V ≈ cùng nghĩa. Nhưng nếu động từ đứng trước đã ở V-ing thì dùng to V: **It was starting to rain.**', '**can\'t bear, can\'t stand**: V-ing/to V.'] }
      ] },
      { h: '3. Động từ + tân ngữ + to V', b: [
        { t: { h: ['Mẫu', 'Động từ', 'Ví dụ'], r: [['V + O + **to V**', 'want, ask, tell, advise, allow, order, invite, expect, persuade, warn, remind', 'My parents **allowed me to go** out.'], ['V + O + **V (bare)**', 'make, let, see, hear, watch, help', 'She **made me laugh**. / Mum **let me go**.'], ['V + O + **V-ing**', 'see, hear, watch, catch, keep, imagine', 'I **saw him running**.']] } },
        { warn: 'Sau **suggest, enjoy, avoid, finish, mind, consider, practise** chỉ dùng **V-ing**; sau **decide, hope, plan, promise, refuse, manage, agree** chỉ dùng **to V**.' }
      ] }
    ],
    ex: [
      ['I remember turning off the lights. (đã tắt)', 'Mình nhớ là đã tắt đèn rồi.'], ['Remember to turn off the lights. (chưa tắt)', 'Nhớ tắt đèn nhé.'], ['She stopped to buy some bread on her way home.', 'Cô ấy dừng lại để mua bánh mì trên đường về.'],
      ['He stopped eating junk food to lose weight.', 'Anh ấy ngừng ăn đồ ăn vặt để giảm cân.'], ['I tried calling him, but nobody answered.', 'Mình đã thử gọi cho anh ấy nhưng không ai nghe.'], ['I tried to call him, but my phone had no signal.', 'Mình đã cố gọi cho anh ấy nhưng điện thoại không có sóng.'],
      ['I regret telling him the secret.', 'Mình hối hận vì đã kể bí mật cho anh ấy.'], ['The teacher allowed us to use dictionaries.', 'Cô giáo cho phép chúng mình dùng từ điển.'], ['My mother made me tidy my room.', 'Mẹ bắt mình dọn phòng.']
    ],
    mis: [
      ['I forgot buying milk, so we have none.', 'I forgot to buy milk, so we have none.', 'Quên làm việc cần làm → forget to V.'], ['She stopped to smoking last year.', 'She stopped smoking last year.', 'Bỏ hẳn thói quen → stop V-ing.'], ['My parents let me to go out.', 'My parents let me go out.', 'let + O + V nguyên mẫu.'],
      ['I enjoy to swim.', 'I enjoy swimming.', 'enjoy + V-ing.'], ['He decided buying a car.', 'He decided to buy a car.', 'decide + to V.']
    ],
    quiz: [
      ['Remember ___ the door when you leave.', ['locking', 'to lock', 'lock', 'locked'], 1, 'Nhớ phải làm → remember to V.'],
      ['I\'ll never forget ___ my grandparents for the first time.', ['to meet', 'meeting', 'meet', 'met'], 1, 'Quên/nhớ việc đã xảy ra → V-ing.'],
      ['He stopped ___ because he wanted to be healthier.', ['to smoke', 'smoking', 'smoke', 'smoked'], 1, 'Bỏ hẳn → stop V-ing.'],
      ['We stopped ___ some water at the shop.', ['to buy', 'buying', 'buy', 'bought'], 0, 'Dừng lại để làm việc khác → to V.'],
      ['I tried ___ the window, but it was stuck.', ['opening', 'to open', 'open', 'opened'], 1, 'Cố gắng → try to V.'],
      ['If you have a headache, try ___ some water.', ['drinking', 'to drink', 'drink', 'drank'], 0, 'Thử xem sao → try V-ing.'],
      ['The teacher ___ us to use dictionaries during the test.', ['allowed', 'let', 'made', 'enjoyed'], 0, 'allow + O + to V (let/make + O + V không có to).'],
      ['She promised ___ me with my homework.', ['helping', 'to help', 'help', 'helped'], 1, 'promise + to V.'],
      ['I regret ___ you that your application was unsuccessful.', ['to tell', 'telling', 'tell', 'told'], 0, 'regret to + V (thông báo tin xấu).']
    ]
  });

  L('g11-concession-contrast', {
    grade: 11, icon: '⚔️', title: 'Nhượng bộ và tương phản nâng cao', sub: 'although, in spite of, however, whereas, no matter…', level: 'Nâng cao',
    summary: 'Phân biệt although/in spite of/despite, however/nevertheless, whereas/while, no matter + wh-, whatever/whoever, as/though đảo.',
    sections: [
      { h: '1. Although / In spite of / Despite', b: [
        { t: { h: ['Từ', 'Theo sau', 'Ví dụ'], r: [['**although / though / even though**', 'mệnh đề (S + V)', '**Although** it was raining, we went out.'], ['**in spite of / despite**', 'danh từ / V-ing / the fact that + mệnh đề', '**In spite of** the rain, we went out. / **Despite** being tired, he worked.'], ['**However / Nevertheless**', 'dấu phẩy + mệnh đề mới (đầu câu mới)', 'It was raining. **However**, we went out.'], ['**whereas / while**', 'mệnh đề (đối lập hai vế)', 'He is outgoing, **whereas** his brother is shy.'], ['**but / yet**', 'liên từ giữa hai mệnh đề', 'It was cold, **but** we went swimming.']] } },
        { warn: 'Không dùng **although + but** cùng câu, không dùng **despite of**: ✗ Despite of the rain → ✓ **Despite the rain / In spite of the rain**.' }
      ] },
      { h: '2. No matter / -ever', b: [
        { f: ['**No matter** + what / who / where / when / how + S + V , mệnh đề chính', '**Whatever / Whoever / Wherever / Whenever / However** + … (cùng nghĩa)'] },
        { p: '**No matter what you say**, I won\'t change my mind. = **Whatever you say**, … · **No matter how hard** he tried, he couldn\'t lift it. = **However hard** he tried, … · **Wherever you go**, I\'ll follow you.' }
      ] },
      { h: '3. Mẫu đảo ngữ nhượng bộ', b: [
        { ul: ['**Adj/Adv + as/though + S + V**, mệnh đề chính: **Tired as he was**, he went on working. = Although he was tired, he went on working.', '**Much as** I like it, I can\'t buy it. = Although I like it very much, I can\'t buy it.', 'Chuyển đổi: **Although he is poor, he is happy.** = **Despite being poor, he is happy.** = **In spite of the fact that he is poor, he is happy.**'] }
      ] }
    ],
    ex: [
      ['Although she was tired, she kept studying.', 'Dù mệt, cô ấy vẫn tiếp tục học.'], ['In spite of the heavy traffic, we arrived on time.', 'Mặc dù tắc đường nặng, chúng mình vẫn đến đúng giờ.'], ['Despite feeling ill, he went to work.', 'Dù thấy ốm, anh ấy vẫn đi làm.'],
      ['The test was difficult. Nevertheless, everyone passed.', 'Bài kiểm tra khó. Tuy nhiên ai cũng đỗ.'], ['My sister loves spicy food, whereas I can\'t eat it.', 'Chị mình thích đồ cay, trong khi mình không ăn được.'], ['No matter how hard I try, I can\'t solve it.', 'Dù mình cố thế nào, mình cũng không giải được.'],
      ['Whatever you decide, I\'ll support you.', 'Bạn quyết định thế nào mình cũng ủng hộ.'], ['Tired as he was, he finished the report.', 'Dù mệt, anh ấy vẫn hoàn thành báo cáo.'], ['Wherever you go, remember to call me.', 'Dù bạn đi đâu, nhớ gọi cho mình.']
    ],
    mis: [
      ['Despite of the rain, we played football.', 'Despite the rain, we played football.', 'Không có "of" sau despite.'], ['Although it was cold, but we went out.', 'Although it was cold, we went out.', 'Không dùng although và but cùng câu.'], ['In spite of he was ill, he went to school.', 'In spite of being ill / although he was ill, he went to school.', 'In spite of + danh từ/V-ing, không + mệnh đề.'],
      ['It was late. However we stayed.', 'It was late. However, we stayed.', 'However thường có dấu phẩy.'], ['No matter what do you say, I won\'t change.', 'No matter what you say, I won\'t change.', 'Không đảo trợ động từ.']
    ],
    quiz: [
      ['___ the bad weather, the match went ahead.', ['Although', 'In spite of', 'However', 'Because'], 1, 'Sau chỗ trống là danh từ → In spite of.'],
      ['___ he was tired, he finished the work.', ['Despite', 'In spite of', 'Although', 'However'], 2, 'Sau chỗ trống là mệnh đề → Although.'],
      ['He didn\'t study. ___, he passed the test.', ['Although', 'Nevertheless', 'Because', 'Despite'], 1, 'Đầu câu mới → Nevertheless, + mệnh đề.'],
      ['She is hard-working, ___ her brother is lazy.', ['whereas', 'despite', 'because', 'so that'], 0, 'Đối lập hai vế → whereas.'],
      ['___ you go, I\'ll find you.', ['However', 'Whatever', 'Wherever', 'Whoever'], 2, 'Dù đi đâu → Wherever.'],
      ['No matter ___ he says, I won\'t believe him.', ['that', 'what', 'how', 'if'], 1, 'No matter what + S + V.'],
      ['___ being tired, she attended the party.', ['Although', 'Despite', 'However', 'Even though'], 1, 'Sau chỗ trống là V-ing → Despite.'],
      ['Rich ___ he was, he wasn\'t happy.', ['but', 'as', 'so', 'because'], 1, 'Adj + as + S + V (nhượng bộ).'],
      ['She won ___ the fact that she was injured.', ['despite', 'in spite', 'although', 'however'], 0, 'despite the fact that + mệnh đề.']
    ]
  });

  L('g11-reflexive-reciprocal-pronouns', {
    grade: 11, icon: '🪞', title: 'Đại từ phản thân, đại từ tương hỗ và other / another', sub: 'Reflexive pronouns, each other, one/ones, other(s)', level: 'Nâng cao',
    summary: 'Dùng myself/herself…, each other/one another, one/ones, another/other/others/the other/the others một cách chính xác.',
    sections: [
      { h: '1. Đại từ phản thân (reflexive)', b: [
        { t: { h: ['Ngôi', 'Phản thân', 'Ví dụ'], r: [['I', 'myself', 'I cut **myself**.'], ['you (số ít / nhiều)', 'yourself / yourselves', 'Enjoy **yourselves**!'], ['he / she / it', 'himself / herself / itself', 'She taught **herself** English.'], ['we / they', 'ourselves / themselves', 'They blamed **themselves**.']] } },
        { ul: ['Chủ ngữ và tân ngữ **cùng một người**: He looked at **himself** in the mirror.', 'Nhấn mạnh: I **myself** saw it. / I did it **myself**. (tự mình làm)', '**by + reflexive** = một mình / không ai giúp: She lives **by herself**. He fixed it **by himself**.', 'Một số động từ **không** cần reflexive trong tiếng Anh: wash, shave, dress, relax, meet… (He washed. = He washed himself.)'] }
      ] },
      { h: '2. Each other / one another', b: [
        { p: '**each other / one another** = **lẫn nhau**, hai bên cùng tác động: **They love each other.** (A yêu B và B yêu A) ≠ **They love themselves.** (mỗi người yêu chính mình).' },
        { warn: 'Sở hữu cách: **each other\'s**: They borrowed **each other\'s** books. (✗ each others)' }
      ] },
      { h: '3. Other, another, the other, one/ones', b: [
        { t: { h: ['Từ', 'Dùng với', 'Ví dụ'], r: [['**another**', 'một cái nữa (số ít, không xác định)', 'Would you like **another** cup of tea?'], ['**other** + danh từ số nhiều', 'những cái khác', 'Some students like maths; **other students** prefer art.'], ['**others**', 'những người/cái khác (không có danh từ)', 'Some like tea, **others** prefer coffee.'], ['**the other**', 'cái còn lại (trong hai)', 'I have two pens: one is red; **the other** is blue.'], ['**the others**', 'những cái còn lại (xác định)', 'Three of them left; **the others** stayed.'], ['**one / ones**', 'thay danh từ đã nhắc', 'I like the red **one**. Those **ones** are cheaper.']] } }
      ] }
    ],
    ex: [
      ['She taught herself to play the guitar.', 'Cô ấy tự học chơi ghi-ta.'], ['Be careful, or you\'ll hurt yourself.', 'Cẩn thận, kẻo bạn bị thương đấy.'], ['The children enjoyed themselves at the zoo.', 'Bọn trẻ đã vui chơi thoải mái ở sở thú.'],
      ['Tom and Anna looked at each other and smiled.', 'Tom và Anna nhìn nhau mỉm cười.'], ['We help one another with homework.', 'Chúng mình giúp nhau làm bài tập.'], ['Can I have another piece of cake?', 'Cho mình thêm một miếng bánh nữa được không?'],
      ['Some people prefer cats; others like dogs.', 'Có người thích mèo, người khác thích chó.'], ['I have two sisters. One lives in Hanoi; the other lives in Hue.', 'Mình có hai chị gái. Một người ở Hà Nội, người kia ở Huế.'], ['I don\'t like this bag. Show me a bigger one.', 'Mình không thích cái túi này. Cho mình xem cái to hơn.']
    ],
    mis: [
      ['He cut him while shaving.', 'He cut himself while shaving.', 'Chủ ngữ = tân ngữ → himself.'], ['They helped themselves each other.', 'They helped each other.', 'Lẫn nhau → each other.'], ['Would you like other cup of tea?', 'Would you like another cup of tea?', 'another + danh từ số ít.'],
      ['Tom and Mary borrowed each others\' books.', 'Tom and Mary borrowed each other\'s books.', 'each other\'s.'], ['I have two brothers. One is a doctor and another is a teacher.', 'I have two brothers. One is a doctor and the other is a teacher.', 'Hai người → one … the other.']
    ],
    quiz: [
      ['She looked at ___ in the mirror.', ['her', 'herself', 'she', 'hers'], 1, 'Cùng một người → herself.'],
      ['The two friends have known ___ since childhood.', ['themselves', 'each other', 'another', 'others'], 1, 'Lẫn nhau → each other.'],
      ['Would you like ___ cup of coffee?', ['other', 'another', 'others', 'the other'], 1, 'another + danh từ số ít.'],
      ['I have two bags. One is black; ___ is brown.', ['another', 'other', 'the other', 'others'], 2, 'Cái còn lại trong hai → the other.'],
      ['Some students walk to school; ___ ride bikes.', ['other', 'another', 'others', 'the other'], 2, 'others (không có danh từ theo sau).'],
      ['Nobody helped me. I did it ___.', ['by me', 'myself', 'me', 'mine'], 1, 'Tự mình làm → myself.'],
      ['I don\'t like these shoes. Do you have any cheaper ___?', ['one', 'ones', 'another', 'other'], 1, 'shoes số nhiều → ones.'],
      ['We should help ___ in difficult times.', ['us', 'ourselves', 'each other', 'themselves'], 2, 'Giúp lẫn nhau → each other.'],
      ['Three of the students were late; ___ arrived on time.', ['the others', 'another', 'other', 'others'], 0, 'Những người còn lại (xác định) → the others.']
    ]
  });
})();
