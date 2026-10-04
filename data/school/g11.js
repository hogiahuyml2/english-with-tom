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
})();
