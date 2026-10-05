'use strict';
/* Kho đề + định dạng Speaking theo từng kỳ thi (KET, PET, FCE, Aptis, IELTS).
   Cấu trúc bám tài liệu chính thức mới nhất:
   - KET  = Cambridge A2 Key / A2 Key for Schools (bản 2020): 2 phần, 8–10 phút/cặp.
   - PET  = Cambridge B1 Preliminary (bản 2020): 4 phần, 10–12 phút/cặp.
   - FCE  = Cambridge B2 First: 4 phần, 14 phút/cặp.
   - Aptis= British Council Aptis General: 4 phần, 12 phút, 9 câu ngắn + 1 bài nói 2 phút.
   - IELTS= Speaking 3 phần, 11–14 phút.
   Đề do web tự soạn theo dạng bài (không sao chép đề thật). "Ảnh" là hình minh hoạ bằng biểu tượng; mô tả thật (ctx) chỉ gửi cho AI để biết ảnh thể hiện gì. */

const pick = (a, n) => { const c = a.slice(), o = []; while (o.length < n && c.length) o.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]); return o; };
const one = (a) => a[Math.floor(Math.random() * a.length)];

/* ───────────────────────── ĐỊNH DẠNG TỪNG KỲ THI ───────────────────────── */
// scale: 'cam5' (Cambridge: mỗi tiêu chí 0–5) | 'aptis' (0–50 + CEFR) | 'ielts' (band 0–9)
const CAM_GV = { key: 'gv', name: 'Grammar & Vocabulary', vi: 'Ngữ pháp & từ vựng' };
const CAM_DM = { key: 'dm', name: 'Discourse Management', vi: 'Triển khai & liên kết ý' };
const CAM_PR = { key: 'pr', name: 'Pronunciation', vi: 'Phát âm' };
const CAM_IC = { key: 'ic', name: 'Interactive Communication', vi: 'Tương tác & đáp lại câu hỏi' };

const FORMATS = {
  ket: {
    id: 'ket', short: 'KET', name: 'KET — A2 Key', level: 'A2', scale: 'cam5', icon: '🌱',
    official: 'Cambridge A2 Key / A2 Key for Schools (bản cập nhật 2020): 2 phần, khoảng 8–10 phút cho một cặp thí sinh, hai giám khảo (một người hỏi, một người chấm).',
    selfNote: 'Ở bản tự luyện, “giám khảo” hỏi bằng giọng đọc của trình duyệt, bạn trả lời một mình. Thi thật ở Phần 2 bạn trò chuyện với bạn thi cùng.',
    minutes: '≈ 6 phút',
    criteria: [CAM_GV, CAM_PR, CAM_IC],
    parts: [
      { n: 1, title: 'Interview', vi: 'Phỏng vấn', min: '3–4 phút', what: 'Giám khảo hỏi thông tin cá nhân (tên, nơi ở, trường lớp…), rồi hỏi về cuộc sống hằng ngày, sở thích, và một câu “Tell me about…”.', tips: ['Trả lời bằng cả câu, đừng chỉ nói một từ (“I live in Da Nang because my family is here.”).', 'Câu “Tell me about…” cần 3–4 câu: nói là gì, ở đâu/khi nào, và vì sao bạn thích.', 'Nghe kỹ thì của câu hỏi: hỏi “Did you…?” thì trả lời bằng quá khứ.'] },
      { n: 2, title: 'Discussion', vi: 'Thảo luận theo tranh', min: '5–6 phút', what: 'Giám khảo đưa một tờ tranh có chủ đề (5 hình). Bạn nói thích hay không thích từng thứ và giải thích lý do, sau đó trả lời thêm vài câu về chủ đề.', tips: ['Mẫu câu: “Yes, I do. I like … because …” / “Not really. I don’t like … because …”.', 'Luôn thêm “because” để giải thích — đó là điểm ăn tiền của phần này.', 'Có thể thêm một ví dụ nhỏ: “For example, I play football with my friends on Sundays.”'] },
    ],
  },
  pet: {
    id: 'pet', short: 'PET', name: 'PET — B1 Preliminary', level: 'B1', scale: 'cam5', icon: '🌿',
    official: 'Cambridge B1 Preliminary / for Schools (bản 2020): 4 phần, khoảng 10–12 phút cho một cặp. Phần 1 phỏng vấn, Phần 2 nói dài về một bức ảnh (~1 phút), Phần 3 thảo luận có hình gợi ý, Phần 4 trò chuyện chung.',
    selfNote: 'Ở bản tự luyện bạn nói một mình: Phần 3 bạn tự “đối thoại” với bạn thi (đưa gợi ý, đồng ý/không đồng ý) rồi tự quyết định.',
    minutes: '≈ 8 phút',
    criteria: [CAM_GV, CAM_DM, CAM_PR, CAM_IC],
    parts: [
      { n: 1, title: 'Interview', vi: 'Phỏng vấn', min: '2 phút', what: 'Giám khảo hỏi thông tin cá nhân, rồi hỏi về thói quen hằng ngày, trải nghiệm đã qua và dự định tương lai.', tips: ['Chuẩn bị sẵn 3 thì: hiện tại (thói quen), quá khứ (đã làm), tương lai (sẽ làm/muốn làm).', 'Mỗi câu trả lời 2–3 câu: đáp + lý do + ví dụ.'] },
      { n: 2, title: 'Photo — long turn', vi: 'Mô tả một bức ảnh (~1 phút)', min: '1 phút / thí sinh', what: 'Bạn nhận một bức ảnh màu và mô tả khoảng 1 phút: ai, ở đâu, đang làm gì, cảm giác ra sao.', tips: ['Nói theo thứ tự: tổng quát → phía trước/phía sau → chi tiết → cảm nhận (“It looks as if…”, “They seem to be…”).', 'Quên từ? Hãy diễn đạt vòng: “It’s a thing you use to…”. Không im lặng.', 'Nói đủ gần 1 phút — nói quá ngắn sẽ mất điểm triển khai ý.'] },
      { n: 3, title: 'Collaborative task', vi: 'Thảo luận tình huống có hình gợi ý', min: '2–3 phút', what: 'Giám khảo nêu một tình huống và đưa tranh gợi ý. Bạn và bạn thi bàn bạc, đưa gợi ý, phản hồi ý kiến của nhau rồi cùng đi đến quyết định.', tips: ['Mẫu: “How about …?”, “What do you think?”, “I’m not sure, because …”, “Let’s choose … then.”', 'Nhắc đến cả 5 gợi ý, đừng chỉ nói một cái.', 'Cuối cùng phải đưa ra quyết định rõ ràng và nêu lý do.'] },
      { n: 4, title: 'General conversation', vi: 'Trò chuyện chung', min: '3 phút', what: 'Giám khảo hỏi các câu mở rộng về chủ đề của Phần 3: sở thích, điều không thích, trải nghiệm, ý kiến, thói quen.', tips: ['Nêu ý kiến + lý do + ví dụ cá nhân.', 'Có thể nói “Personally, I think…”, “In my experience…”, “I’d rather… because…”.'] },
    ],
  },
  fce: {
    id: 'fce', short: 'FCE', name: 'FCE — B2 First', level: 'B2', scale: 'cam5', icon: '🌳',
    official: 'Cambridge B2 First / for Schools: 4 phần, khoảng 14 phút cho một cặp. Phần 1 phỏng vấn (2 phút), Phần 2 nói dài so sánh 2 ảnh (1 phút) rồi nhận xét ngắn về ảnh của bạn thi (30 giây), Phần 3 thảo luận có sơ đồ 5 gợi ý (2 phút bàn + 1 phút quyết định), Phần 4 thảo luận mở rộng (4 phút).',
    selfNote: 'Ở bản tự luyện bạn nói một mình: Phần 2 có thêm một câu 30 giây thay cho phần nhận xét ảnh của bạn thi; Phần 3 bạn tự bàn bạc rồi tự quyết định.',
    minutes: '≈ 9 phút',
    criteria: [CAM_GV, CAM_DM, CAM_PR, CAM_IC],
    parts: [
      { n: 1, title: 'Interview', vi: 'Phỏng vấn', min: '2 phút', what: 'Giám khảo hỏi về bản thân: nơi ở, học tập/công việc, sở thích, kế hoạch.', tips: ['B2 cần nói dài và tự nhiên hơn B1: thêm lý do, so sánh với quá khứ, nêu kế hoạch.'] },
      { n: 2, title: 'Long turn', vi: 'So sánh hai bức ảnh (1 phút)', min: '1 phút + 30 giây', what: 'Bạn nhận 2 ảnh và một câu hỏi. So sánh 2 ảnh và trả lời câu hỏi trong 1 phút (đừng mô tả riêng từng ảnh quá lâu), rồi trả lời nhanh một câu hỏi về ảnh của bạn thi.', tips: ['Cấu trúc: điểm giống → điểm khác → trả lời câu hỏi → kết luận ngắn.', 'Mẫu: “Both pictures show…, whereas in the first one…”, “One difference is…”, “I’d say…”.', 'Trả lời đúng câu hỏi trên thẻ — đừng chỉ tả ảnh.'] },
      { n: 3, title: 'Collaborative task', vi: 'Thảo luận & quyết định', min: '2 phút + 1 phút', what: 'Một sơ đồ có câu hỏi ở giữa và 5 gợi ý. Bạn và bạn thi bàn từng gợi ý (2 phút), rồi quyết định chọn cái nào (1 phút).', tips: ['Bàn đủ các gợi ý, mỗi cái 20–25 giây, có so sánh với nhau.', 'Mẫu: “What do you think about…?”, “That’s a good point, but…”, “I’d go for… because…”.', 'Cuối cùng phải CHỐT một lựa chọn (không cần cả hai đồng ý).'] },
      { n: 4, title: 'Discussion', vi: 'Thảo luận mở rộng', min: '4 phút', what: 'Giám khảo hỏi các câu trừu tượng hơn, liên quan chủ đề Phần 3.', tips: ['Đưa quan điểm rõ ràng, giải thích, cho ví dụ, và thừa nhận ý kiến khác (“Some people say…, but I believe…”).'] },
    ],
  },
  aptis: {
    id: 'aptis', short: 'Aptis', name: 'Aptis General', level: 'A1–C', scale: 'aptis', icon: '🎯',
    official: 'British Council Aptis General: 4 phần, khoảng 12 phút, ghi âm trên máy tính. Phần 1: 3 câu cá nhân (mỗi câu 30 giây). Phần 2: tả 1 ảnh + 2 câu hỏi liên quan (mỗi câu 45 giây). Phần 3: so sánh 2 ảnh + 2 câu hỏi (mỗi câu 45 giây). Phần 4: 3 câu về một chủ đề trừu tượng, có 1 phút chuẩn bị và nói 2 phút. Chỉ có Phần 4 được chuẩn bị.',
    selfNote: 'Giống thi thật: bạn không thể nghe lại câu hỏi nhiều lần và mỗi câu có thời gian cố định; hết giờ hệ thống tự chuyển câu.',
    minutes: '≈ 8 phút',
    criteria: [
      { key: 'gv', name: 'Grammar', vi: 'Ngữ pháp' },
      { key: 'vo', name: 'Vocabulary', vi: 'Từ vựng' },
      { key: 'pr', name: 'Pronunciation', vi: 'Phát âm' },
      { key: 'fl', name: 'Fluency (hesitation)', vi: 'Độ trôi chảy (ngập ngừng)' },
      { key: 'co', name: 'Coherence', vi: 'Sắp xếp & liên kết ý' },
    ],
    parts: [
      { n: 1, title: 'Personal information', vi: 'Thông tin cá nhân', min: '3 câu × 30 giây', what: 'Ba câu hỏi ngắn về bản thân và sở thích. Không có thời gian chuẩn bị.', tips: ['Trả lời ngay, 2–3 câu cho mỗi câu hỏi, đừng im lặng.', 'Dùng mẫu: đáp → lý do → ví dụ ngắn.'] },
      { n: 2, title: 'Describe, express opinions', vi: 'Tả ảnh & nêu ý kiến', min: '3 câu × 45 giây', what: 'Một bức ảnh: tả ảnh, rồi hai câu hỏi liên quan về ý kiến và lý do.', tips: ['Câu 1 chỉ cần tả: ai, ở đâu, đang làm gì.', 'Hai câu sau: nêu ý kiến rõ + lý do + ví dụ cá nhân.'] },
      { n: 3, title: 'Describe, compare', vi: 'Tả & so sánh hai ảnh', min: '3 câu × 45 giây', what: 'Hai bức ảnh: so sánh hai ảnh, rồi hai câu hỏi lý do/giải thích.', tips: ['Dùng “whereas / while / on the other hand / both…”.', 'Trả lời đúng điều câu hỏi cần (so sánh hay lý do?).'] },
      { n: 4, title: 'Abstract topic', vi: 'Chủ đề trừu tượng (1 phút chuẩn bị, nói 2 phút)', min: '1 phút chuẩn bị + 2 phút nói', what: 'Ba câu hỏi về một chủ đề trừu tượng. Bạn có 1 phút ghi chú rồi nói 2 phút để trả lời cả ba câu.', tips: ['Ghi nhanh 3 ý chính (mỗi câu hỏi một ý).', 'Nói đủ 2 phút: mỗi câu hỏi dành ~40 giây, có ví dụ.', 'Dùng từ nối: firstly, in addition, for example, in my opinion, on the other hand.'] },
    ],
  },
  ielts: {
    id: 'ielts', short: 'IELTS', name: 'IELTS Speaking', level: 'Band 0–9', scale: 'ielts', icon: '🌏',
    official: 'IELTS Speaking: phỏng vấn trực tiếp 11–14 phút, 3 phần. Phần 1 (4–5 phút): câu hỏi quen thuộc về bản thân. Phần 2 (3–4 phút): thẻ đề, 1 phút chuẩn bị, nói 1–2 phút. Phần 3 (4–5 phút): thảo luận trừu tượng liên quan Phần 2. Chấm 4 tiêu chí ngang nhau.',
    selfNote: 'Bản tự luyện lấy 2 chủ đề cho Phần 1 và đủ câu cho Phần 3, tổng khoảng 9–10 phút.',
    minutes: '≈ 10 phút',
    criteria: [
      { key: 'fc', name: 'Fluency & Coherence', vi: 'Trôi chảy & mạch lạc' },
      { key: 'lr', name: 'Lexical Resource', vi: 'Vốn từ' },
      { key: 'gr', name: 'Grammatical Range & Accuracy', vi: 'Ngữ pháp (đa dạng & chính xác)' },
      { key: 'pr', name: 'Pronunciation', vi: 'Phát âm' },
    ],
    parts: [
      { n: 1, title: 'Introduction & interview', vi: 'Giới thiệu & hỏi đáp', min: '4–5 phút', what: 'Giám khảo hỏi về các chủ đề quen thuộc: quê hương, học tập/công việc, sở thích…', tips: ['Mỗi câu 2–4 câu trả lời (15–30 giây): trả lời trực tiếp → lý do → ví dụ.', 'Tránh trả lời một từ hoặc học thuộc lòng.'] },
      { n: 2, title: 'Long turn', vi: 'Nói dài với thẻ đề', min: '3–4 phút', what: 'Bạn nhận thẻ đề với 4 gợi ý. Có 1 phút chuẩn bị (được ghi chú) rồi nói liên tục 1–2 phút.', tips: ['Dùng 4 gợi ý trên thẻ làm khung bài nói.', 'Nói đủ gần 2 phút, giữ mạch lạc: mở → 4 ý → kết.', 'Nếu hết ý, hãy thêm cảm xúc, ví dụ hoặc so sánh.'] },
      { n: 3, title: 'Discussion', vi: 'Thảo luận mở rộng', min: '4–5 phút', what: 'Giám khảo hỏi các câu trừu tượng, đòi hỏi nêu ý kiến, so sánh, dự đoán.', tips: ['Mỗi câu 30–45 giây: ý kiến → lý do → ví dụ → (ý kiến ngược lại).', 'Dùng: “It depends on…”, “On the one hand… on the other hand…”, “I’d say that…”.'] },
    ],
  },
};

/* ───────────────────────── KHO NỘI DUNG ───────────────────────── */
// "Ảnh" minh hoạ: emoji (hiển thị) + ctx (mô tả thật cho AI)
const S = (emoji, label, ctx) => ({ emoji, label, ctx });

/* ---------- KET ---------- */
const KET_P1_PERSONAL = [
  "Where do you live?", "Where are you from?", "Do you study or do you work?", "Who do you live with?",
  "Which school do you go to?", "How do you come to school or work every day?", "Do you have any brothers or sisters?", "What's your favourite school subject?",
];
const KET_P1_TOPICS = [
  { topic: 'Free time', qs: ["What do you like doing at the weekend?", "Do you play any sports?", "What do you do when it rains?"], tell: "Tell me about your favourite hobby." },
  { topic: 'Food', qs: ["What do you usually have for breakfast?", "Do you like cooking?", "What's your favourite food?"], tell: "Tell me about a meal you enjoyed with your family." },
  { topic: 'School or work', qs: ["What time do you start school or work?", "Which lesson do you like best?", "Is it easy to get to your school or work?"], tell: "Tell me about your teacher or your classmates." },
  { topic: 'Friends', qs: ["Who do you spend most time with?", "How often do you see your friends?", "What do you do together?"], tell: "Tell me about your best friend." },
  { topic: 'Home', qs: ["Do you live in a house or a flat?", "Which is your favourite room?", "What can you see from your window?"], tell: "Tell me about your bedroom." },
  { topic: 'Shopping', qs: ["Do you like shopping?", "Where do you buy your clothes?", "What did you buy last week?"], tell: "Tell me about a shop you like." },
  { topic: 'Holidays', qs: ["Do you like holidays?", "Where did you go on your last holiday?", "Who do you go on holiday with?"], tell: "Tell me about a holiday you remember." },
  { topic: 'Music and TV', qs: ["What kind of music do you like?", "Do you watch TV in the evening?", "What's your favourite film?"], tell: "Tell me about your favourite singer or TV programme." },
  { topic: 'Getting around', qs: ["How do you travel to the city centre?", "Do you like travelling by bus?", "Can you ride a bike?"], tell: "Tell me about a journey you made." },
  { topic: 'Pets and animals', qs: ["Do you have a pet?", "What animals do you like?", "Have you ever been to a zoo?"], tell: "Tell me about an animal you like." },
  { topic: 'Phones and computers', qs: ["Do you have a mobile phone?", "What do you use your phone for?", "Do you play games on a computer?"], tell: "Tell me about the things you do online." },
];
const KET_P2 = [
  { topic: 'Free-time activities', items: [['🏊', 'swimming'], ['🎬', 'going to the cinema'], ['📚', 'reading books'], ['🎮', 'playing computer games'], ['🚴', 'cycling']], extra: ["What do you usually do at the weekend?", "What is a good free-time activity when it rains?"] },
  { topic: 'Food', items: [['🍕', 'pizza'], ['🥗', 'salad'], ['🍦', 'ice cream'], ['🍜', 'noodle soup'], ['🍎', 'fruit']], extra: ["What food do you cook at home?", "What do you like to eat at a birthday party?"] },
  { topic: 'Holidays', items: [['🏖️', 'the beach'], ['⛰️', 'the mountains'], ['🏙️', 'a big city'], ['⛺', 'camping'], ['🏨', 'a hotel']], extra: ["Where would you like to go on your next holiday?", "Who do you like to go on holiday with?"] },
  { topic: 'Hobbies and clubs', items: [['🎸', 'music'], ['🎨', 'painting'], ['⚽', 'football'], ['💃', 'dancing'], ['📷', 'taking photos']], extra: ["Which club would you like to join at school?", "Do you do any hobbies with your family?"] },
  { topic: 'Shopping', items: [['👕', 'clothes'], ['📚', 'books'], ['📱', 'phones'], ['🎁', 'presents'], ['🍫', 'sweets']], extra: ["What was the last present you bought?", "Do you prefer shopping online or in shops?"] },
  { topic: 'Animals', items: [['🐶', 'dogs'], ['🐱', 'cats'], ['🐠', 'fish'], ['🐴', 'horses'], ['🐦', 'birds']], extra: ["Would you like to have a pet?", "Which animal is the best friend for people?"] },
  { topic: 'Transport', items: [['🚌', 'the bus'], ['🚲', 'a bike'], ['🚆', 'the train'], ['✈️', 'an aeroplane'], ['🚗', 'a car']], extra: ["How do you usually go to school or work?", "What is the best way to travel a long way?"] },
  { topic: 'Weather and seasons', items: [['☀️', 'sunny days'], ['🌧️', 'rainy days'], ['❄️', 'snow'], ['💨', 'windy days'], ['🌸', 'spring']], extra: ["What is your favourite season?", "What do you wear when it is cold?"] },
  { topic: 'School subjects', items: [['🔬', 'science'], ['🎨', 'art'], ['🏃', 'PE'], ['🌍', 'geography'], ['🔢', 'maths']], extra: ["Which subject is the most useful for you?", "What do you do in your favourite lesson?"] },
  { topic: 'Jobs at home', items: [['🍳', 'cooking'], ['🧹', 'cleaning'], ['🌱', 'working in the garden'], ['🧺', 'washing clothes'], ['🛒', 'shopping for food']], extra: ["What do you do to help at home?", "Who cooks in your family?"] },
];

/* ---------- PET ---------- */
const PET_PERSONAL = ["Where do you come from, and what do you like about your town?", "Do you study or work? What do you enjoy most about it?", "Tell me about your family.", "What do you do in your free time?", "What kind of music or films do you enjoy?"];
const PET_PRESENT = ["Tell me about a typical day in your life.", "How do you usually spend your weekends?", "Who do you spend most of your free time with?", "What do you usually do in the evenings?", "How do you usually travel around your town?"];
const PET_PAST = ["Tell me about a place you visited recently.", "What did you do last weekend?", "Tell me about a good day you had with your friends.", "Can you describe your last birthday?", "What did you do during your last school holiday?"];
const PET_FUTURE = ["What are you going to do next weekend?", "What would you like to do after you finish school?", "Where would you like to go on your next holiday?", "What job would you like to do in the future?", "What are your plans for the next summer?"];
const PET_PHOTOS = [
  S('🧺🌳👨‍👩‍👧☀️', 'a family having a picnic', 'A family (parents and a child) sit on a blanket in a green park on a sunny day, eating sandwiches from a basket; there are trees behind them.'),
  S('📚👩‍🎓💻', 'students studying in a library', 'Several students sit at wooden tables in a quiet library, reading books and using laptops; shelves full of books are behind them.'),
  S('🛒🍎🥕🧑‍🌾', 'people at a market', 'People walk past outdoor market stalls with fruit and vegetables; a seller is putting apples into a bag for a customer.'),
  S('🍳👨‍🍳👧', 'a family cooking dinner', 'A father and his young daughter cook together in a kitchen; the girl is stirring a pot while the father cuts vegetables.'),
  S('⚽🏃‍♂️🥅', 'friends playing football', 'A group of teenage boys play football on a grass pitch; one of them is kicking the ball towards the goal.'),
  S('🚉🧳🧍', 'people waiting at a station', 'Passengers with suitcases and backpacks wait on a railway platform for a train; some look at their phones, one looks at a timetable board.'),
  S('🎂🎈🎉', 'a birthday party', 'Children and adults stand around a table with a birthday cake and balloons; a girl is blowing out the candles.'),
  S('🏖️🏄‍♀️🌊', 'people at the beach', 'People relax on a sandy beach under umbrellas; some are swimming and a girl is carrying a surfboard.'),
  S('💻🧑‍💻🏠', 'a young person working at home', 'A teenager sits at a desk in a bedroom using a laptop, with headphones on and some notebooks beside the computer.'),
  S('🏫👩‍🏫🧒', 'a lesson in a classroom', 'A teacher stands next to a board and explains something to a class of students sitting at desks; some students raise their hands.'),
];
const PET_P3 = [
  { situation: 'A friend from another country is coming to visit your town for a weekend.', task: 'Talk together about the different things you could do with your friend, and say which would be the best.', items: [['🏛️', 'visit a museum'], ['🍜', 'eat in a local restaurant'], ['🚲', 'go cycling'], ['🛍️', 'go shopping'], ['🎬', 'see a film']], topic: 'visitors and free time',
    p4: ["What do you like to do at the weekend?", "Do you prefer going out with friends or staying at home? Why?", "Tell us about a place you would like to show to a visitor.", "Do you think it is important to learn about other countries? Why?"] },
  { situation: 'Your class is planning an end-of-year party.', task: 'Talk together about the different things you could have at the party, and say which would be the most important.', items: [['🎵', 'music'], ['🍰', 'food and drinks'], ['🎲', 'games'], ['🎈', 'decorations'], ['📷', 'a photographer']], topic: 'parties and celebrations',
    p4: ["Do you like going to parties? Why / why not?", "Tell us about a party you enjoyed.", "How do people usually celebrate special days in your country?", "Would you rather have a big party or a small one? Why?"] },
  { situation: 'A friend has a birthday next week and you want to give a present.', task: 'Talk together about the different presents you could buy, and say which would be the best.', items: [['📖', 'a book'], ['👕', 'a T-shirt'], ['🎮', 'a video game'], ['🪴', 'a plant'], ['🎫', 'concert tickets']], topic: 'presents and shopping',
    p4: ["What was the best present you ever got?", "Do you enjoy buying presents for other people?", "Do you prefer shopping online or in a shop? Why?", "How much money should people spend on presents?"] },
  { situation: 'Some students want to join a club at their school.', task: 'Talk together about the different clubs they could join, and say which would be the most interesting.', items: [['⚽', 'sports club'], ['🎭', 'drama club'], ['🎨', 'art club'], ['💻', 'computer club'], ['🎶', 'choir']], topic: 'hobbies and clubs',
    p4: ["What hobbies do you have?", "Have you ever joined a club? What was it like?", "Do you think it is good for students to do activities after school?", "Would you like to learn a new hobby? Which one?"] },
  { situation: 'Your class is going to spend a day out together.', task: 'Talk together about the different places you could go, and say which would be the best for the class.', items: [['🦁', 'a zoo'], ['🏖️', 'the beach'], ['🏰', 'a castle'], ['🎢', 'a theme park'], ['🏞️', 'a national park']], topic: 'days out and travel',
    p4: ["Where did you go on your last day out?", "Do you prefer to travel with friends or with your family?", "What do you take with you when you go on a trip?", "Do you think school trips are useful? Why?"] },
  { situation: 'Your school wants to help the environment.', task: 'Talk together about the different ideas the school could try, and say which would be the most useful.', items: [['♻️', 'recycling bins'], ['🌳', 'planting trees'], ['🚲', 'cycling to school'], ['💡', 'switching off lights'], ['🥤', 'no plastic bottles']], topic: 'the environment',
    p4: ["Do you do anything at home to help the environment?", "Why do some people not care about the environment?", "How could young people encourage others to look after nature?", "What is the biggest problem for the environment in your town?"] },
];

/* ---------- FCE ---------- */
const FCE_P1 = [
  ["Where are you from, and what do you enjoy about living there?", "How long have you been studying or working there?"],
  ["What do you do in your free time, and how long have you been doing it?", "Is there anything new you would like to try?"],
  ["Tell us about a person who is important to you.", "How do you usually keep in touch with your friends?"],
  ["Which season do you like best, and why?", "What do you enjoy doing in that season?"],
  ["Do you prefer to spend time alone or with other people? Why?", "What did you do the last time you spent a day with friends?"],
  ["What are you looking forward to this year?", "What would you like to be doing in five years' time?"],
  ["How do you usually travel when you go somewhere new?", "What was the most interesting place you have visited?"],
];
const FCE_P2 = [
  { topic: 'studying in different places', a: S('📚🏛️', 'studying in a library', 'A student studies at a desk in a quiet university library, surrounded by books and other silent students.'), b: S('🌳📖🧑‍🎓', 'studying outdoors', 'A student sits on the grass in a park, reading a book and taking notes under a tree.'),
    q: 'Why might the people have chosen to study in these places, and how comfortable do you think they feel?', q2: 'Which of these two places would you prefer to study in, and why?' },
  { topic: 'travelling in different ways', a: S('🚆🧍🧍🧍', 'a crowded train', 'Passengers stand close together in a crowded commuter train during rush hour; most look tired.'), b: S('🚲🌄🧑', 'riding a bike', 'A cyclist rides along a quiet country road in the early morning, with fields and hills around.'),
    q: 'What are the good and bad points of travelling in these ways, and how might the people be feeling?', q2: 'Which of these ways of travelling would you prefer for a long journey?' },
  { topic: 'celebrating in different ways', a: S('🍽️👨‍👩‍👧‍👦🎂', 'a family dinner', 'A large family sits around a dining table sharing a meal and a cake, smiling and talking.'), b: S('🎉🕺🎶', 'a party with friends', 'Young people dance and laugh at a lively party with music and coloured lights.'),
    q: 'Why do you think people celebrate in these ways, and how important is it to celebrate special occasions?', q2: 'Which of these celebrations would you enjoy more?' },
  { topic: 'doing different jobs', a: S('👷🏗️☀️', 'working on a building site', 'A construction worker in a helmet carries bricks on a sunny building site.'), b: S('🧑‍💼💻🏢', 'working in an office', 'An employee works at a computer in a quiet modern open-plan office with colleagues at other desks.'),
    q: 'What might the people enjoy about these jobs, and what might they find difficult?', q2: 'Which of these jobs would you prefer to do, and why?' },
  { topic: 'shopping in different places', a: S('🛒🥬🧺', 'a street market', 'Shoppers walk between colourful stalls in an open-air street market, choosing vegetables.'), b: S('🏬🛍️🧍‍♀️', 'a shopping centre', 'People walk through a bright modern shopping centre with shops on several floors and shopping bags in their hands.'),
    q: 'Why might people choose to shop in these places, and what are the advantages of each?', q2: 'Where do you prefer to shop, and why?' },
  { topic: 'learning something new', a: S('👩‍🍳🍳👥', 'a cooking class', 'A group of adults wear aprons and follow a chef who demonstrates how to cook in a large kitchen.'), b: S('💻📺🧑', 'following an online lesson', 'A young man sits alone at home watching a video lesson on his laptop and writing notes.'),
    q: 'How are the people learning, and which way of learning might be more effective?', q2: 'Which of these ways of learning would you choose?' },
  { topic: 'spending time with animals', a: S('🐕🧍‍♀️🌳', 'walking a dog', 'A woman walks a large dog on a lead along a path in the park in autumn.'), b: S('🦁👨‍👩‍👧🏞️', 'visiting a zoo', 'A family stands in front of a glass enclosure at a zoo, looking at a lion lying on a rock.'),
    q: 'Why do people like spending time with animals, and what responsibilities might they have?', q2: 'Which of these activities would you rather do?' },
  { topic: 'keeping fit', a: S('🏋️🏢🧑', 'working out in a gym', 'A man lifts weights in a busy gym with machines and mirrors; others exercise around him.'), b: S('🏃‍♀️🌅🌲', 'running outdoors', 'A woman jogs through a forest path at sunrise.'),
    q: 'Why have the people chosen to keep fit in these ways, and how might they be feeling?', q2: 'Which of these ways of keeping fit do you prefer?' },
];
const FCE_P3 = [
  { situation: 'Some students are discussing how their school could help students stay healthy.', q: 'How could each of these ideas help students to stay healthy?', decide: 'Which idea would be the most effective?', items: ['healthy school meals', 'longer sports lessons', 'lessons about sleep', 'classes about managing stress', 'regular health check-ups'], topic: 'health and lifestyle',
    p4: ["Do you think young people today are healthier than in the past? Why?", "How important is it to have a healthy diet? ", "Some people say exercise should be compulsory at school. What do you think?", "What can people do to reduce stress in their lives?"] },
  { situation: 'A town council wants to attract more tourists.', q: 'How might each of these ideas attract more tourists?', decide: 'Which would be the best way to attract tourists?', items: ['building a new museum', 'organising a yearly festival', 'improving public transport', 'advertising on social media', 'opening more hotels'], topic: 'travel and tourism',
    p4: ["What are the advantages and disadvantages of living in a place with many tourists?", "Do you think tourism always benefits local people?", "How has technology changed the way people plan holidays?", "Would you prefer a holiday in a busy city or in the countryside? Why?"] },
  { situation: 'A school wants to encourage students to use less plastic.', q: 'How could each of these ideas help reduce plastic use?', decide: 'Which idea would work best?', items: ['water bottles that can be refilled', 'a plastic-free day each month', 'a recycling competition between classes', 'lessons about pollution', 'removing plastic from the canteen'], topic: 'the environment',
    p4: ["What can individual people do to protect the environment?", "Do you think governments should do more than ordinary people?", "Why do some people find it difficult to change their habits?", "Is it fair to expect young people to solve environmental problems?"] },
  { situation: 'A company wants to help its employees learn new skills.', q: 'How would each of these ways help employees to learn?', decide: 'Which way would be the most useful?', items: ['evening language classes', 'online courses', 'working with an experienced colleague', 'visits to other companies', 'a library of books and videos'], topic: 'work and learning',
    p4: ["Which skills are the most important for young people today?", "Do you think it is better to learn in a classroom or online?", "How can people stay motivated when they are learning something difficult?", "Would you like to change your job several times in your life? Why?"] },
  { situation: 'A city wants to make its parks more popular with young people.', q: 'How could each of these ideas make parks more popular?', decide: 'Which idea would be the most successful?', items: ['free wifi', 'sports courts', 'outdoor concerts', 'cafés and food stalls', 'a skate park'], topic: 'leisure and city life',
    p4: ["How important are green spaces in a city?", "What do young people in your area do in their free time?", "Do you think there is enough for young people to do where you live?", "How could a city be improved for older people?"] },
  { situation: 'A school is thinking of ways to make students more independent.', q: 'How might each of these activities make students more independent?', decide: 'Which one would you recommend?', items: ['organising a school trip themselves', 'managing a small student shop', 'choosing their own projects', 'helping younger students', 'cooking lunch once a week'], topic: 'education and growing up',
    p4: ["At what age do you think people become independent?", "What responsibilities should teenagers have at home?", "Do you think parents should make most decisions for their children?", "What is the hardest part of leaving home for the first time?"] },
];

/* ---------- Aptis ---------- */
const APTIS_P1 = [
  ["Please tell me about your family.", "What do you usually do at the weekend?", "Tell me about the place where you live."],
  ["Please tell me about your favourite food.", "What do you like to do in your free time?", "Tell me about your best friend."],
  ["Tell me about your job or your studies.", "What kind of music do you like?", "How do you usually get to work or school?"],
  ["Please tell me about your last holiday.", "What do you usually do in the evenings?", "Tell me about your favourite season."],
  ["What do you do to keep healthy?", "Tell me about a film or TV programme you like.", "Where would you like to live in the future?"],
  ["Please tell me about your home.", "What do you enjoy about your town or city?", "What do you usually do on your birthday?"],
  ["Tell me about a teacher you remember.", "Do you like shopping? Why or why not?", "What is your daily routine?"],
  ["Tell me about the sports you play or watch.", "How do you use your phone every day?", "What do you like to eat for breakfast?"],
];
const APTIS_P2 = [
  { photo: S('📱🚆🧍‍♀️', 'a person using a phone on a train', 'A young woman sits on a train and looks at her smartphone, wearing headphones; other passengers sit nearby.'), qs: ["Why do you think people use their phones so much when they travel?", "Do you think people spend too much time on their phones? Why or why not?"] },
  { photo: S('🥗🍎🧑‍🍳', 'a person preparing a healthy meal', 'A man prepares a salad in a bright kitchen with fresh vegetables and fruit on the table.'), qs: ["Why is it important to eat healthy food?", "Do you prefer to cook at home or eat in restaurants? Why?"] },
  { photo: S('👨‍👩‍👧‍👦🏖️', 'a family on holiday at the beach', 'A family with two children builds a sand castle on a beach; the parents sit under an umbrella.'), qs: ["Why do many families like to go on holiday together?", "What is the best way to spend a holiday, in your opinion?"] },
  { photo: S('📚🎒🧒', 'a student going to school', 'A boy with a heavy backpack walks along a street towards his school, holding a book.'), qs: ["Why is education important for young people?", "What would make school more interesting for students?"] },
  { photo: S('🐕🧍🌳', 'a person walking a dog in a park', 'An older man walks a small dog in a park; there are trees and a bench.'), qs: ["Why do many people have pets?", "Do you think it is easy to look after a pet? Why or why not?"] },
  { photo: S('🚲🏙️🧑', 'a person cycling in a city', 'A man in a helmet cycles along a bike lane in a busy city street with cars beside him.'), qs: ["Why do some people prefer to cycle in cities?", "What could cities do to make cycling safer?"] },
  { photo: S('🎶🎤👯', 'friends at a music concert', 'A crowd of young people raise their hands and sing at an outdoor concert; a band plays on stage.'), qs: ["Why do people enjoy going to concerts?", "How do you like to listen to music, and why?"] },
  { photo: S('💻👩‍💼🏠', 'a woman working from home', 'A woman works on a laptop at a dining table at home, with a cup of coffee and a notebook.'), qs: ["What are the good things about working from home?", "Would you like to work from home in the future? Why or why not?"] },
];
const APTIS_P3 = [
  { a: S('🏙️🚕🏢', 'a big city', 'A busy city street with tall buildings, taxis and crowds of people.'), b: S('🌾🏡🐄', 'the countryside', 'A quiet farm house in green fields with cows and hills in the background.'), qs: ["Which of these two places would you prefer to live in, and why?", "What do you think are the biggest problems of living in a big city?"] },
  { a: S('📖🧑‍🏫👥', 'a classroom lesson', 'Students sit in a classroom while a teacher writes on the board.'), b: S('💻🏠🧒', 'studying online at home', 'A child studies alone at home with a laptop and headphones.'), qs: ["What are the advantages of each way of studying?", "Which way of studying do you think is better for young people?"] },
  { a: S('🛒🏬👥', 'shopping in a shop', 'Customers walk through a large supermarket pushing trolleys.'), b: S('📦💻🛋️', 'shopping online', 'A person sits on a sofa with a laptop, with parcels beside them.'), qs: ["Which way of shopping do you prefer, and why?", "How has online shopping changed people's lives?"] },
  { a: S('🏋️🏢🧑', 'exercising in a gym', 'People use running machines in a bright gym.'), b: S('⚽🌳👦', 'playing sport outdoors', 'A group of friends play football in a park.'), qs: ["Why might people choose each of these ways to exercise?", "How can we encourage people to do more exercise?"] },
  { a: S('🍔🍟🧑', 'eating fast food', 'A teenager eats a burger and chips at a fast-food restaurant.'), b: S('🍲🥦👨‍👩‍👧', 'eating a home-cooked meal', 'A family eats soup and vegetables together at home.'), qs: ["What are the differences between these two meals?", "Why do some people prefer fast food even though it is not healthy?"] },
  { a: S('🚌🧍🧍', 'taking a bus', 'People stand and sit on a crowded city bus.'), b: S('🚗🧑🛣️', 'driving a car', 'A man drives a car alone on a motorway.'), qs: ["Which way of travelling would you choose, and why?", "What can governments do to reduce traffic in cities?"] },
];
const APTIS_P4 = [
  { topic: 'friendship', qs: ["Tell me about a good friend you have had for a long time and why you get on well.", "Some people say it is better to have a few close friends than many friends. What do you think?", "How can technology help or damage friendships?"] },
  { topic: 'technology in daily life', qs: ["Tell me about a piece of technology you use every day and how it helps you.", "Do you think people depend too much on technology? Why or why not?", "What technology do you think will be important in the next ten years?"] },
  { topic: 'learning a language', qs: ["Tell me about your experience of learning English.", "What do you think is the best way to learn a foreign language?", "Why is it useful to speak more than one language?"] },
  { topic: 'free time and hobbies', qs: ["Tell me about a hobby you enjoy and why you started it.", "Is it important for people to have hobbies? Why or why not?", "How have the ways people spend their free time changed in the last twenty years?"] },
  { topic: 'the place where you live', qs: ["Describe the town or city where you live and what you like about it.", "What problems does your town or city have?", "How would you improve it for young people?"] },
  { topic: 'travel', qs: ["Tell me about a trip that you remember very well.", "What are the advantages of travelling with other people compared to travelling alone?", "How can travelling change the way people think?"] },
  { topic: 'jobs and work', qs: ["Tell me about a job you would like to do and why.", "What things are the most important when choosing a job?", "Do you think people should change jobs often? Why or why not?"] },
  { topic: 'health and fitness', qs: ["Tell me about something you do to stay healthy.", "Why do some people find it hard to live a healthy life?", "Who should be responsible for people's health: the person, the family, or the government?"] },
];

/* ---------- IELTS ---------- */
const IELTS_P1 = [
  { topic: 'Hometown', qs: ["Where is your hometown?", "What do you like most about your hometown?", "Has your hometown changed much since you were a child?", "Would you like to live there in the future?"] },
  { topic: 'Work or studies', qs: ["Do you work or are you a student?", "Why did you choose that job or subject?", "What do you find most interesting about it?", "What would you like to do in the future?"] },
  { topic: 'Home', qs: ["Do you live in a house or a flat?", "Which room do you spend most time in?", "What would you like to change about your home?", "Do you prefer living with others or alone?"] },
  { topic: 'Hobbies', qs: ["What do you like doing in your free time?", "How long have you had this hobby?", "Do you prefer doing hobbies alone or with other people?", "Is there a hobby you would like to try?"] },
  { topic: 'Food', qs: ["What kind of food do you like?", "Do you prefer to eat at home or in restaurants?", "Is there any food you disliked as a child but like now?", "Do people in your country eat healthily?"] },
  { topic: 'Technology', qs: ["How often do you use the internet?", "What do you usually use your phone for?", "Do you think you spend too much time on your phone?", "How has technology changed the way people study?"] },
  { topic: 'Travel', qs: ["Do you like travelling?", "Where did you go on your last trip?", "Do you prefer to travel alone or with others?", "Which country would you most like to visit?"] },
  { topic: 'Weather', qs: ["What is the weather like in your hometown?", "What is your favourite kind of weather?", "Does the weather affect your mood?", "What do you do on a rainy day?"] },
  { topic: 'Friends', qs: ["Do you have many friends?", "How often do you see your friends?", "What do you usually do together?", "What qualities do you look for in a friend?"] },
  { topic: 'Reading', qs: ["Do you like reading?", "What kinds of books or articles do you read?", "Did you read more when you were younger?", "Do you prefer paper books or reading on a screen?"] },
];
const IELTS_P2 = [
  { card: 'Describe a person who has had an important influence on you.', bullets: ['who this person is', 'how you know them', 'what they have done', 'and explain why they have been so important to you'], p3: ["Why do some people influence others more than other people?", "Do you think parents or teachers have more influence on children?", "How do the people we admire change as we get older?", "Can social media personalities have a good influence on young people?"] },
  { card: 'Describe a place you visited that you would like to go back to.', bullets: ['where it is', 'when you went there', 'what you did there', 'and explain why you would like to go back'], p3: ["Why do people like to travel to other countries?", "What are the positive and negative effects of tourism on local places?", "Do you think travelling is better for young people or older people?", "How might holidays change in the future?"] },
  { card: 'Describe a useful skill you learned.', bullets: ['what the skill is', 'how you learned it', 'how long it took you', 'and explain why the skill is useful to you'], p3: ["Which skills are the most important for young people today?", "Is it better to learn skills at school or by yourself?", "Why do some people give up when they learn something new?", "How will the skills needed for work change in the future?"] },
  { card: 'Describe a time when you helped someone.', bullets: ['who you helped', 'what the problem was', 'how you helped them', 'and explain how you felt about it'], p3: ["Why do some people enjoy helping others?", "Should schools teach students to do volunteer work?", "Do you think people today help each other less than in the past?", "What kinds of help should the government give to people?"] },
  { card: 'Describe a book or film that you enjoyed.', bullets: ['what it was', 'what it was about', 'when you read or saw it', 'and explain why you enjoyed it'], p3: ["Why are stories important to people?", "Do films have more influence on people than books?", "How have the ways of watching films changed?", "Should children be encouraged to read more?"] },
  { card: 'Describe a celebration or festival in your country.', bullets: ['what the celebration is', 'when it takes place', 'what people do', 'and explain why it is important to people'], p3: ["Why do people like to celebrate special days?", "Are traditional festivals as important now as in the past?", "How do celebrations bring people together?", "Do you think festivals have become too commercial?"] },
  { card: 'Describe a piece of technology that you find useful.', bullets: ['what it is', 'how you use it', 'how long you have had it', 'and explain why it is useful to you'], p3: ["How has technology changed the way people communicate?", "Are there any disadvantages of people depending on technology?", "Do you think older people find it more difficult to use new technology?", "What technology will be important in the future?"] },
  { card: 'Describe a time when you were very busy.', bullets: ['when it was', 'what you had to do', 'why you were so busy', 'and explain how you felt about it'], p3: ["Why are people so busy nowadays?", "How can people manage their time better?", "Is a busy life good or bad for health?", "Do you think people will have more free time in the future?"] },
  { card: 'Describe a healthy activity you enjoy.', bullets: ['what it is', 'where and when you do it', 'who you do it with', 'and explain why it is good for you'], p3: ["Why do some people not exercise even though they know it is healthy?", "Should the government encourage people to exercise?", "How do the ways people keep fit differ across ages?", "Do you think sport should be compulsory at school?"] },
  { card: 'Describe a building you like.', bullets: ['where it is', 'what it looks like', 'what it is used for', 'and explain why you like it'], p3: ["Why do some cities keep old buildings?", "Should new buildings follow the style of old ones?", "How can architecture affect the way people feel?", "What is more important in a building: beauty or function?"] },
];

/* ───────────────────────── DỰNG ĐỀ ───────────────────────── */
const T = (part, id, o) => Object.assign({ id: id, part: part, min: 3, max: 30, prep: 0 }, o);

function buildKet(parts) {
  const t = [];
  if (parts.includes(1)) {
    const per = pick(KET_P1_PERSONAL, 2), tp = one(KET_P1_TOPICS);
    t.push(T(1, 'k1a', { say: "What's your name, and how do you spell your family name?", q: "What's your name, and how do you spell your family name?", max: 20, min: 3, ph: 'Phỏng vấn — thông tin cá nhân' }));
    per.forEach((q, i) => t.push(T(1, 'k1b' + i, { say: q, q, max: 20, ph: 'Phỏng vấn — thông tin cá nhân' })));
    pick(tp.qs, 2).forEach((q, i) => t.push(T(1, 'k1c' + i, { say: q, q, max: 25, ph: 'Phỏng vấn — ' + tp.topic.toLowerCase() })));
    t.push(T(1, 'k1d', { say: tp.tell, q: tp.tell, min: 12, max: 45, ph: 'Phỏng vấn — nói dài hơn', kind: 'tell' }));
  }
  if (parts.includes(2)) {
    const s = one(KET_P2);
    const items = s.items.map(([e, l]) => ({ emoji: e, label: l }));
    pick(items, 4).forEach((it, i) => t.push(T(2, 'k2a' + i, { say: (i === 0 ? 'Now, I am going to ask you some questions about ' + s.topic.toLowerCase() + '. ' : '') + 'Do you like ' + it.label + '? Why, or why not?', q: 'Do you like ' + it.label + '? Why / why not?', items: items, topic: s.topic, min: 5, max: 30, ph: 'Thảo luận theo tranh — ' + s.topic.toLowerCase(), kind: 'cards' })));
    s.extra.forEach((q, i) => t.push(T(2, 'k2b' + i, { say: q, q, items: items, topic: s.topic, min: 5, max: 35, ph: 'Câu hỏi thêm về chủ đề', kind: 'cards' })));
  }
  return t;
}

function buildPet(parts) {
  const t = [];
  const p3 = one(PET_P3);
  if (parts.includes(1)) {
    t.push(T(1, 'p1a', { say: "What's your name, and where do you come from?", q: "What's your name, and where do you come from?", max: 20, ph: 'Phỏng vấn — thông tin cá nhân' }));
    t.push(T(1, 'p1b', { say: one(PET_PERSONAL), q: null, max: 30, ph: 'Phỏng vấn — thông tin cá nhân' }));
    t.push(T(1, 'p1c', { say: one(PET_PRESENT), q: null, max: 35, ph: 'Phỏng vấn — hiện tại' }));
    t.push(T(1, 'p1d', { say: one(PET_PAST), q: null, max: 35, ph: 'Phỏng vấn — quá khứ' }));
    t.push(T(1, 'p1e', { say: one(PET_FUTURE), q: null, max: 35, ph: 'Phỏng vấn — tương lai' }));
    t.forEach((x) => { if (x.q === null) x.q = x.say; });
  }
  if (parts.includes(2)) {
    const p = one(PET_PHOTOS);
    t.push(T(2, 'p2a', { say: 'Here is your photo. It shows ' + p.label + '. Please tell me what you can see in the photo.', q: 'Your photo shows ' + p.label + '. Tell the examiner what you can see in the photo.', scene: { emoji: p.emoji, label: p.label }, ctx: p.ctx, min: 40, max: 75, ph: 'Mô tả ảnh (khoảng 1 phút)', kind: 'photo' }));
  }
  if (parts.includes(3)) {
    const items = p3.items.map(([e, l]) => ({ emoji: e, label: l }));
    t.push(T(3, 'p3a', { say: p3.situation + ' ' + p3.task + ' You have about two minutes. Talk to each other as if your partner is here.', q: p3.situation + ' ' + p3.task, items: items, topic: p3.topic, min: 60, max: 150, ph: 'Thảo luận tình huống (2 phút)', kind: 'discuss', hint: 'Hãy nói như đang trò chuyện với bạn: đưa gợi ý, hỏi ý bạn, đồng ý hoặc phản đối nhẹ nhàng.' }));
    t.push(T(3, 'p3b', { say: 'Now, please decide together which one would be the best.', q: 'Bây giờ hãy quyết định chọn một gợi ý và giải thích vì sao.', items: items, topic: p3.topic, min: 15, max: 50, ph: 'Quyết định cuối cùng', kind: 'decide' }));
  }
  if (parts.includes(4)) {
    pick(p3.p4, 4).forEach((q, i) => t.push(T(4, 'p4' + i, { say: q, q, max: 45, min: 12, topic: p3.topic, ph: 'Trò chuyện chung — ' + p3.topic })));
  }
  return t;
}

function buildFce(parts) {
  const t = [];
  const p3 = one(FCE_P3), p2 = one(FCE_P2), p2b = one(FCE_P2.filter((x) => x !== p2));
  if (parts.includes(1)) {
    const set = one(FCE_P1);
    t.push(T(1, 'f1a', { say: "Good morning. Can I have your names, please? And where are you from?", q: "Where are you from? (giới thiệu tên và nơi bạn sống)", max: 25, ph: 'Phỏng vấn — giới thiệu' }));
    set.forEach((q, i) => t.push(T(1, 'f1b' + i, { say: q, q, max: 40, min: 8, ph: 'Phỏng vấn' })));
    t.push(T(1, 'f1c', { say: one(["What do you enjoy doing with your family?", "Tell us about a hobby you have had for a long time.", "How do you usually spend your weekends?", "What kind of place would you like to live in?"]), q: null, max: 40, min: 8, ph: 'Phỏng vấn' }));
    t.forEach((x) => { if (x.q === null) x.q = x.say; });
  }
  if (parts.includes(2)) {
    t.push(T(2, 'f2a', { say: 'Here are your photographs. They show people ' + p2.topic + '. I would like you to compare the photographs and say: ' + p2.q + ' Remember, you have about one minute.', q: p2.q, photos: [{ emoji: p2.a.emoji, label: 'Photo 1' }, { emoji: p2.b.emoji, label: 'Photo 2' }], ctx: 'Photo 1: ' + p2.a.ctx + ' Photo 2: ' + p2.b.ctx, min: 40, max: 70, ph: 'So sánh hai ảnh (1 phút)', kind: 'photos' }));
    t.push(T(2, 'f2b', { say: 'Now, a quick question about a different pair of photographs, which show people ' + p2b.topic + '. ' + p2b.q2, q: p2b.q2, photos: [{ emoji: p2b.a.emoji, label: 'Photo 1' }, { emoji: p2b.b.emoji, label: 'Photo 2' }], ctx: 'Photo 1: ' + p2b.a.ctx + ' Photo 2: ' + p2b.b.ctx, min: 10, max: 35, ph: 'Câu hỏi ngắn (30 giây)', kind: 'photos' }));
  }
  if (parts.includes(3)) {
    t.push(T(3, 'f3a', { say: p3.situation + ' Talk to each other about ' + p3.q.replace(/^How /, 'how ').replace(/\?$/, '') + '. You have about two minutes.', q: p3.situation + ' ' + p3.q, mind: { center: p3.q, items: p3.items }, topic: p3.topic, min: 70, max: 150, ph: 'Thảo luận 5 gợi ý (2 phút)', kind: 'mindmap', hint: 'Nói lần lượt từng gợi ý, hỏi ý “bạn thi” và so sánh các gợi ý với nhau.' }));
    t.push(T(3, 'f3b', { say: 'Now you have about a minute to decide. ' + p3.decide, q: p3.decide, mind: { center: p3.decide, items: p3.items }, topic: p3.topic, min: 20, max: 70, ph: 'Chốt lựa chọn (1 phút)', kind: 'decide' }));
  }
  if (parts.includes(4)) {
    pick(p3.p4, 4).forEach((q, i) => t.push(T(4, 'f4' + i, { say: q, q: q.trim(), max: 55, min: 15, topic: p3.topic, ph: 'Thảo luận mở rộng — ' + p3.topic })));
  }
  return t;
}

function buildAptis(parts) {
  const t = [];
  if (parts.includes(1)) {
    one(APTIS_P1).forEach((q, i) => t.push(T(1, 'a1' + i, { say: q, q, max: 30, min: 10, strict: true, ph: 'Phần 1 — thông tin cá nhân' })));
  }
  if (parts.includes(2)) {
    const p = one(APTIS_P2);
    const sc = { emoji: p.photo.emoji, label: 'Photo' };
    t.push(T(2, 'a2a', { say: 'Look at the photograph. Describe the photograph.', q: 'Describe the photograph.', scene: sc, ctx: p.photo.ctx, max: 45, min: 15, strict: true, ph: 'Phần 2 — tả ảnh', kind: 'photo' }));
    p.qs.forEach((q, i) => t.push(T(2, 'a2' + 'bc'[i], { say: q, q, scene: sc, ctx: p.photo.ctx, max: 45, min: 15, strict: true, ph: 'Phần 2 — ý kiến', kind: 'photo' })));
  }
  if (parts.includes(3)) {
    const p = one(APTIS_P3);
    const photos = [{ emoji: p.a.emoji, label: 'Photo 1' }, { emoji: p.b.emoji, label: 'Photo 2' }], ctx = 'Photo 1: ' + p.a.ctx + ' Photo 2: ' + p.b.ctx;
    t.push(T(3, 'a3a', { say: 'Look at the two photographs. Describe the two photographs and compare them.', q: 'Describe the two photographs and compare them.', photos, ctx, max: 45, min: 15, strict: true, ph: 'Phần 3 — so sánh 2 ảnh', kind: 'photos' }));
    p.qs.forEach((q, i) => t.push(T(3, 'a3' + 'bc'[i], { say: q, q, photos, ctx, max: 45, min: 15, strict: true, ph: 'Phần 3 — lý do & giải thích', kind: 'photos' })));
  }
  if (parts.includes(4)) {
    const p = one(APTIS_P4);
    t.push(T(4, 'a4', { say: 'Now, I am going to ask you three questions about ' + p.topic + '. You have one minute to prepare and then two minutes to answer all three questions. ' + p.qs.join(' '), q: p.qs.join('\n'), numbered: p.qs, topic: p.topic, prep: 60, max: 120, min: 90, strict: true, ph: 'Phần 4 — chủ đề trừu tượng (1 phút chuẩn bị, nói 2 phút)', kind: 'long', note: 'Bạn có 1 phút để ghi chú, sau đó nói tối đa 2 phút để trả lời cả 3 câu hỏi.' }));
  }
  return t;
}

function buildIelts(parts) {
  const t = [];
  const c = one(IELTS_P2);
  if (parts.includes(1)) {
    const fr = pick(IELTS_P1, 2);
    t.push(T(1, 'i1a', { say: "Good morning. My name is Tom. Can you tell me your full name, please? And what shall I call you?", q: "Can you tell me your full name? What shall I call you?", max: 15, min: 3, ph: 'Phần 1 — giới thiệu' }));
    fr.forEach((f, fi) => pick(f.qs, fi === 0 ? 3 : 3).forEach((q, i) => t.push(T(1, 'i1' + 'bc'[fi] + i, { say: (i === 0 ? "Now, let's talk about " + f.topic.toLowerCase() + ". " : '') + q, q, max: 35, min: 8, ph: 'Phần 1 — ' + f.topic }))));
  }
  if (parts.includes(2)) {
    t.push(T(2, 'i2', { say: "Now I am going to give you a topic. You will have one minute to prepare, and then talk about it for one to two minutes. " + c.card, q: c.card, cue: { card: c.card, bullets: c.bullets }, prep: 60, min: 70, max: 125, ph: 'Phần 2 — thẻ đề (nói 1–2 phút)', kind: 'cue' }));
  }
  if (parts.includes(3)) {
    pick(c.p3, 4).forEach((q, i) => t.push(T(3, 'i3' + i, { say: (i === 0 ? "We have been talking about " + c.card.replace(/^Describe\s+/, '').replace(/\.$/, '') + ". Now I would like to ask you some more general questions. " : '') + q, q, max: 55, min: 15, topic: c.card, ph: 'Phần 3 — thảo luận' })));
  }
  return t;
}

const BUILDERS = { ket: buildKet, pet: buildPet, fce: buildFce, aptis: buildAptis, ielts: buildIelts };

// parts: mảng số phần, hoặc null = cả bài. Trả về mảng lượt (turn).
function buildTest(exam, parts) {
  const f = FORMATS[exam]; if (!f) return null;
  const all = f.parts.map((p) => p.n);
  const want = Array.isArray(parts) && parts.length ? parts.filter((n) => all.includes(n)) : all;
  const turns = BUILDERS[exam](want);
  turns.forEach((x, i) => { x.i = i; });
  return turns;
}

// Phiên bản gửi cho trình duyệt (bỏ ctx — mô tả thật của ảnh dùng cho AI)
function publicTurn(t) { const o = Object.assign({}, t); delete o.ctx; return o; }

// Thông tin định dạng hiển thị trên trang (không gồm kho đề)
function formatsPublic() {
  const o = {};
  for (const k of Object.keys(FORMATS)) { const f = FORMATS[k]; o[k] = Object.assign({}, f); }
  return o;
}

module.exports = { FORMATS, buildTest, publicTurn, formatsPublic };
