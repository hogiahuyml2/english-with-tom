// Cơ sở dữ liệu + xác thực mật khẩu — dùng SQLite tích hợp sẵn của Node
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || __dirname;
const db = new DatabaseSync(path.join(DATA_DIR, 'data.db'));

// ===== Tạo bảng nếu chưa có =====
db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  pass TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  email_verified INTEGER NOT NULL DEFAULT 0,
  verify_token TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  program TEXT NOT NULL,
  skill TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  answer_key TEXT,
  questions TEXT,
  image_url TEXT,
  audio_url TEXT,
  auto_grade INTEGER NOT NULL DEFAULT 1,
  created_by INTEGER,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  answers TEXT,
  score INTEGER,
  max_score INTEGER,
  status TEXT NOT NULL DEFAULT 'graded',
  feedback TEXT,
  submitted_at TEXT NOT NULL
);
`);

// ===== Migration: thêm cột cho database đã tạo từ trước =====
const userCols = db.prepare('PRAGMA table_info(users)').all().map(c => c.name);
if (!userCols.includes('email_verified')) db.exec('ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0');
if (!userCols.includes('verify_token'))   db.exec('ALTER TABLE users ADD COLUMN verify_token TEXT');
if (!userCols.includes('reset_token'))    db.exec('ALTER TABLE users ADD COLUMN reset_token TEXT');
if (!userCols.includes('reset_token_expiry')) db.exec('ALTER TABLE users ADD COLUMN reset_token_expiry TEXT');

const subCols = db.prepare('PRAGMA table_info(submissions)').all().map(c => c.name);
if (!subCols.includes('feedback')) db.exec('ALTER TABLE submissions ADD COLUMN feedback TEXT');

const exCols = db.prepare('PRAGMA table_info(exercises)').all().map(c => c.name);
if (!exCols.includes('questions'))  db.exec('ALTER TABLE exercises ADD COLUMN questions TEXT');
if (!exCols.includes('image_url'))  db.exec('ALTER TABLE exercises ADD COLUMN image_url TEXT');
if (!exCols.includes('audio_url'))  db.exec('ALTER TABLE exercises ADD COLUMN audio_url TEXT');

// ===== Băm & kiểm tra mật khẩu =====
function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return salt + ':' + hash;
}
function verifyPassword(pw, stored) {
  try {
    const [salt, hash] = stored.split(':');
    const h = crypto.scryptSync(pw, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(h, 'hex'));
  } catch (e) { return false; }
}

const now = () => new Date().toISOString();

// ===== Tạo dữ liệu ban đầu =====
function seed() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count > 0) return;

  const insUser = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,created_at) VALUES (?,?,?,?,1,?)');
  insUser.run('Quản trị viên', 'admin@ewt.vn', hashPassword('Admin@123'), 'admin', now());
  const tom = insUser.run('Thầy Tom', 'tom@ewt.vn', hashPassword('Tom@1234'), 'teacher', now());
  const teacherId = Number(tom.lastInsertRowid);

  const insEx = db.prepare('INSERT INTO exercises (program,skill,title,content,answer_key,auto_grade,created_by,created_at) VALUES (?,?,?,?,?,?,?,?)');
  insEx.run('IELTS','Reading','IELTS Reading — Test 3 (The History of Tea)',
    'Đọc đoạn văn về lịch sử trà và chọn đáp án đúng cho 4 câu hỏi.',
    JSON.stringify(['B','C','A','B']),1,teacherId,now());
  insEx.run('IELTS','Listening','IELTS Listening — Test 2',
    'Nghe và chọn đáp án đúng.',
    JSON.stringify(['A','C','B','A','B']),1,teacherId,now());
  insEx.run('IELTS','Writing','IELTS Writing Task 2 — Chủ đề Môi trường',
    'Viết bài luận tối thiểu 250 từ về chủ đề bảo vệ môi trường.',
    null,0,teacherId,now());
  insEx.run('PET','Reading','PET Reading — Part 4',
    'Đọc và chọn đáp án đúng.',
    JSON.stringify(['B','A','C','B','A']),1,teacherId,now());

  console.log('✓ Đã tạo dữ liệu ban đầu (admin@ewt.vn / tom@ewt.vn + 4 đề mẫu)');
}
seed();

// ===== Đề thật bổ sung (idempotent) =====

// ---------- KET WRITING (6 đề đã có) ----------
const KET_WRITING = [
  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email hẹn gặp bạn cuối tuần',
    content:'Write an email to your English friend Alex.\nSay:\n- what you want to do this weekend\n- where you want to meet\n- what time to meet\n\nWrite 25 words or more.' },
  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Lời nhắn trả sách cho bạn',
    content:'Your friend Sam lent you a book. Write a note to Sam.\nTell Sam:\n- that you have finished the book\n- what you thought of it\n- when you can return it\n\nWrite 25 words or more.' },
  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email mời dự sinh nhật',
    content:'You are having a birthday party. Write an email to your friend Jordan.\nTell Jordan:\n- when the party is\n- where it will be\n- what to bring\n\nWrite 25 words or more.' },
  // ---- 14 đề Part 1 từ file PDF (KET Writing Part 6 / Part 1) ----
  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email rủ bạn đi xem phim cuối tuần',
    content:`You want to go to the cinema with your English friend, Sarah, this weekend. Write an email to Sarah.
In your email:
• ask Sarah to go to the cinema with you
• tell her what film you want to watch
• suggest a time and place to meet

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email khoe thú cưng mới và mời bạn đến thăm',
    content:`You have just got a new pet. Write an email to your English friend, Tom.
In your email:
• tell Tom what pet you have got
• describe what your new pet looks like
• invite Tom to come to your house to see it

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email rủ bạn đi mua sắm quần áo',
    content:`You are going shopping for some new clothes on Saturday. Write an email to your English friend, Alex.
In your email:
• ask Alex to go shopping with you
• say what clothes you need to buy
• suggest how you can travel to the shopping centre

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email nhờ bạn giúp dự án khoa học',
    content:`You need some help with your science project. Write an email to your English friend, Emma.
In your email:
• explain what the science project is about
• ask Emma to help you with it
• suggest a day to study together

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email rủ bạn tham gia câu lạc bộ thể thao',
    content:`You want to join a new sports club at school. Write an email to your English friend, David.
In your email:
• say which sports club you want to join
• tell David why you like this sport
• ask David to join the club with you

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email rủ bạn đi dã ngoại trong công viên',
    content:`You want to go to the park for a picnic with your English friend, John, on Sunday. Write an email to John.
In your email:
• say what time you want to go
• tell him what food you will bring
• suggest an activity to do there

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email khoe trò chơi điện tử mới và mời bạn chơi cùng',
    content:`You have just bought a new video game. Write an email to your English friend, Leo.
In your email:
• say what the video game is called
• explain why you like playing it
• invite Leo to come to your house to play it with you

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email mời bạn đến xem buổi biểu diễn âm nhạc',
    content:`You are performing in a school music concert next week. Write an email to your English friend, Chloe.
In your email:
• tell Chloe what day and time the concert is
• say what instrument you will play
• ask Chloe to come and watch you

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email rủ bạn đi đạp xe chiều thứ Bảy',
    content:`You want to go for a bike ride this Saturday afternoon. Write an email to your English friend, Jack.
In your email:
• suggest a nice place to ride your bikes
• say what time you should start
• remind him what he needs to bring

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email mời bạn đến nhà làm bánh cùng',
    content:`You are going to bake a cake at home this afternoon. Write an email to your English friend, Amy.
In your email:
• tell Amy what kind of cake you are making
• invite her to come to your house to help you
• ask her to bring one ingredient (e.g. eggs, milk, sugar)

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email rủ bạn thử nhà hàng mới trong phố',
    content:`There is a new restaurant in your town. Write an email to your English friend, Sam.
In your email:
• ask Sam to go to the restaurant with you
• say what kind of food the restaurant sells
• suggest a day to go there

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email nhờ bạn giúp tìm áo khoác bị mất ở trường',
    content:`You have lost your jacket at school. Write an email to your English friend, Katy.
In your email:
• tell Katy what your jacket looks like
• say where you think you left it
• ask Katy to help you look for it

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email thông báo chuyến đi leo núi và mượn áo len',
    content:`You are going on a trip to the mountains this weekend. Write an email to your English friend, Harry.
In your email:
• say who you are going with
• tell Harry what you are going to do there
• ask to borrow a warm sweater from him

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email khoe sở thích mới và mời bạn cùng thử',
    content:`You have started a new hobby. Write an email to your English friend, Megan.
In your email:
• tell Megan what your new hobby is
• explain why you enjoy doing it
• invite Megan to try it with you

Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email rủ bạn gặp nhau sau khi đi thư viện',
    content:`You are going to the town library tomorrow. Write an email to your English friend, Paul.
In your email:
• say why you are going to the library
• ask if Paul wants you to borrow a book for him
• suggest a place to meet after you finish

Write 25 words or more.` },

  // ---- 5 đề Part 1 dạng email-reply (Read & Reply) ----
  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email trả lời bạn về chuyến đi biển ngày mai',
    content:`Read this email from your English friend, Maria.
────────────────────────────────
From: Maria
To: ...
Subject: The beach!

Hi,
I am so excited that we are going to the beach tomorrow! What time should we leave? What are we going to do there? Also, what food should I bring for our picnic?
See you soon,
Maria
────────────────────────────────
Write an email to Maria and answer her questions.
Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email trả lời bạn về bữa tiệc sinh nhật',
    content:`Read this email from your English friend, Mark.
────────────────────────────────
From: Mark
To: ...
Subject: Your birthday party

Hi,
Thanks for inviting me to your birthday party next week. I can't wait! Where are we going to have the party? Who else is coming? And what kind of present would you like?
Bye for now,
Mark
────────────────────────────────
Write an email to Mark and answer his questions.
Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email trả lời bạn về buổi hòa nhạc rock',
    content:`Read this email from your English friend, Lisa.
────────────────────────────────
From: Lisa
To: ...
Subject: Rock Concert

Hi,
My dad bought two tickets for the rock concert this Saturday. Would you like to come with me? How will we get to the stadium? What should we wear?
Write soon!
Lisa
────────────────────────────────
Write an email to Lisa and answer her questions.
Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email trả lời bạn về các buổi học tiếng Tây Ban Nha',
    content:`Read this email from your English friend, Ben.
────────────────────────────────
From: Ben
To: ...
Subject: Spanish classes

Hi,
I heard you are learning Spanish! That's great. Why did you decide to learn Spanish? Is it a difficult language to learn? How often do you have classes?
Best,
Ben
────────────────────────────────
Write an email to Ben and answer his questions.
Write 25 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 1 — Email trả lời bạn về kế hoạch nghỉ hè',
    content:`Read this email from your English friend, Anna.
────────────────────────────────
From: Anna
To: ...
Subject: Next summer

Hi,
Summer holiday is coming soon! Are you going to travel anywhere this summer with your family? Where are you going to stay? What do you want to do there?
Your friend,
Anna
────────────────────────────────
Write an email to Anna and answer her questions.
Write 25 words or more.` },

  // ---- KET Writing Part 2 (câu chuyện từ câu cho sẵn) ----
  { program:'KET', skill:'Writing', title:'KET Writing Part 2 — Câu chuyện: một ngày ở biển',
    content:'Write a story.\nYour story must begin with this sentence:\n"Last Saturday, Tom and his friends went to the beach."\n\nWrite 35 words or more.' },
  { program:'KET', skill:'Writing', title:'KET Writing Part 2 — Câu chuyện: bất ngờ sau cánh cửa',
    content:'Write a story.\nYour story must begin with this sentence:\n"When Maria opened the door, she saw a big surprise."\n\nWrite 35 words or more.' },
  { program:'KET', skill:'Writing', title:'KET Writing Part 2 — Câu chuyện: buổi sáng trời mưa',
    content:'Write a story.\nYour story must begin with this sentence:\n"It was raining when Daniel left his house in the morning."\n\nWrite 35 words or more.' },

  // ---- KET Writing Part 2 (câu chuyện từ tranh — Part 7 Cambridge) ----
  { program:'KET', skill:'Writing', title:'KET Writing Part 2 — Tranh: chú chó lạc ở bãi biển',
    content:`Look at the three pictures and write the story.

[Tranh 1] Một nhóm trẻ em đang vui chơi tại bãi biển — bơi lội, chạy nhảy và chơi bóng dưới nắng. Có ô che nắng và thuyền buồm xa xa trên biển.
[Tranh 2] Các bạn nhìn thấy một chú chó nằm một mình trên bãi cát, bên cạnh có tấm biển "ALONE" (Một mình). Các bạn dừng lại và tỏ ra lo lắng.
[Tranh 3] Các bạn đưa chú chó về nhà và giới thiệu với mẹ. Cả gia đình vây quanh chú chó, ai cũng vui mừng và hạnh phúc.

Write the story shown in the pictures.
Write 35 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 2 — Tranh: mua điện thoại mới',
    content:`Look at the three pictures and write the story.

[Tranh 1] Hai cô bạn gái đang đi bộ cùng nhau trên vỉa hè. Một người đang nói chuyện với vẻ hào hứng, có vẻ như họ đang lên kế hoạch đi đâu đó.
[Tranh 2] Hai cô bạn bước vào một cửa hàng điện thoại. Một nhân viên nữ đứng phía sau quầy trưng bày nhiều mẫu điện thoại. Các cô gái nhìn vào và chỉ trỏ thích thú.
[Tranh 3] Một cô gái cầm điện thoại mới và mỉm cười rạng rỡ. Người bạn đứng bên cạnh cũng vui lây, trông cả hai đều rất hài lòng.

Write the story shown in the pictures.
Write 35 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 2 — Tranh: muốn xem phim nhưng phải học bài',
    content:`Look at the three pictures and write the story.

[Tranh 1] Hai cô bạn đang nói chuyện điện thoại. Một cô nói "Movies!" (Xem phim đi!) với vẻ mặt vui vẻ, rủ rê. Cô kia có vẻ muốn đồng ý.
[Tranh 2] Mẹ (hoặc giáo viên) bước vào phòng cầm tờ bài kiểm tra có điểm kém (chữ F), nhìn cô bé với vẻ nghiêm nghị và không vui. Cô bé cúi đầu.
[Tranh 3] Cô bé ngồi một mình bên bàn học, mở sách vở ra học bài chăm chỉ. Trên bàn có bút chì và sách giáo khoa, trông cô bé đang cố gắng tập trung.

Write the story shown in the pictures.
Write 35 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 2 — Tranh: tìm thấy túi bị mất và trả lại',
    content:`Look at the three pictures and write the story.

[Tranh 1] Hai cậu bé đứng trong hành lang trường học. Một chiếc túi chấm bi rơi trên sàn, không có ai nhận. Một cậu bé chỉ vào chiếc túi, trông có vẻ ngạc nhiên.
[Tranh 2] Cậu bé nhặt chiếc túi lên và mở ra để tìm thông tin của chủ nhân. Cậu cầm thứ gì đó bên trong (có thể là ví hoặc thẻ ID) và mỉm cười — cậu đã biết ai là chủ nhân.
[Tranh 3] Cậu bé đưa chiếc túi đến tận nhà trả lại. Một người phụ nữ mở cửa với hai đứa trẻ nhỏ đứng bên cạnh. Bà cảm ơn cậu bé rất nhiệt tình.

Write the story shown in the pictures.
Write 35 words or more.` },

  { program:'KET', skill:'Writing', title:'KET Writing Part 2 — Tranh: cuộc gọi rủ bạn chơi bóng đá',
    content:`Look at the three pictures and write the story.

[Tranh 1] Một cậu bé đang ngồi trên giường trong phòng, ánh nắng chiều chiếu qua cửa sổ. Cậu đang nói chuyện điện thoại và trông rất vui mừng, hào hứng.
[Tranh 2] Một nhóm bạn bè đang chạy vội ra ngoài cùng nhau, vui vẻ và náo nhiệt. Trông như họ đang hẹn nhau ở sân chơi hoặc bãi đất trống.
[Tranh 3] Cả nhóm đang chơi bóng đá trên một sân cỏ rộng có khung thành. Các bạn chạy, tranh bóng và sút cầu môn — ai cũng đang thỏa sức vui đùa.

Write the story shown in the pictures.
Write 35 words or more.` },
];

// ---------- KET READING ----------
const KET_READING = [
  {
    program:'KET', skill:'Reading',
    title:'KET Reading Part 4 — Life on a Houseboat',
    content:`Read the article and choose the correct answer (A, B or C).

LIFE ON A HOUSEBOAT

Many people dream of living near water, but the Smith family takes this one step further — they actually live ON the water. Their home is a houseboat on the River Thames in London.

"We moved here five years ago," says Mrs Smith. "At first, I was worried about space, but actually we have everything we need — a kitchen, two bedrooms, a bathroom and a small living room."

The children love living on the water. "It's exciting!" says twelve-year-old Jamie. "Sometimes when it rains, the river gets very high and we have to be careful. But most days it's really peaceful."

The family does have to think about some things that other families don't. "We use electricity from the riverbank," explains Mr Smith, "and we need to move our home to get it cleaned every few months. But we wouldn't change it for anything!"`,
    questions:[
      { q:'Gia đình Smith đã sống trên nhà thuyền được bao lâu?', options:['Năm năm','Một năm','Ba năm'] },
      { q:'Lúc đầu, bà Smith cảm thấy lo lắng về điều gì?', options:['Chi phí','Không gian','Thời tiết'] },
      { q:'Jamie cảm thấy thế nào khi sống trên nhà thuyền?', options:['Buồn chán','Thú vị','Sợ hãi'] },
      { q:'Gia đình lấy điện từ đâu?', options:['Máy phát điện','Pin mặt trời','Bờ sông'] },
      { q:'Gia đình phải làm gì sau vài tháng?', options:['Di chuyển nhà thuyền để vệ sinh','Sửa chữa động cơ','Đổi chỗ đỗ thuyền'] },
    ],
    answer_key:['A','B','B','C','A'],
  },
  {
    program:'KET', skill:'Reading',
    title:'KET Reading Part 4 — My Favourite Sport: Swimming',
    content:`Read the article and choose the correct answer (A, B or C).

MY FAVOURITE SPORT

My name is Maria and swimming is my favourite sport. I started learning to swim when I was just four years old, and now I swim three times a week at my local pool.

I love swimming because it keeps me healthy and it's great fun. My favourite style is backstroke because I can look at the ceiling and relax while I swim!

Last year, I joined a swimming club. At first it was hard because we had to wake up at 5 a.m. for early morning training. But I made lots of new friends there.

My goal is to swim in a national competition next year. I'm training very hard for this. My coach says I need to improve my butterfly stroke if I want to win a medal.`,
    questions:[
      { q:'Maria bắt đầu học bơi khi mấy tuổi?', options:['Bốn tuổi','Sáu tuổi','Tám tuổi'] },
      { q:'Maria bơi mấy lần mỗi tuần?', options:['Hai lần','Ba lần','Bốn lần'] },
      { q:'Kiểu bơi yêu thích của Maria là gì?', options:['Bơi sải','Bơi ngửa','Bơi ếch'] },
      { q:'Khó khăn khi tham gia câu lạc bộ bơi lội là gì?', options:['Phải dậy sớm lúc 5 giờ sáng','Không có bạn','Bể bơi xa nhà'] },
      { q:'Huấn luyện viên nói Maria cần cải thiện điều gì?', options:['Bơi ngửa','Bơi ếch','Bơi bướm'] },
    ],
    answer_key:['A','B','B','A','C'],
  },
  {
    program:'KET', skill:'Reading',
    title:'KET Reading Part 4 — Westfield City Library',
    content:`Read the notice and choose the correct answer (A, B or C).

WELCOME TO WESTFIELD CITY LIBRARY

Opening hours:
Monday to Friday: 9 a.m. – 8 p.m.
Saturday: 10 a.m. – 6 p.m.
Sunday: Closed

Library cards:
All visitors need a library card to borrow books. Cards are free for students and people under 18. Adults pay £5 per year.

Borrowing rules:
• You can borrow up to 6 books at one time.
• Books must be returned within 3 weeks.
• DVDs can be borrowed for 1 week only.
• If you return items late, you pay 20p per day.

Facilities:
The library has free Wi-Fi, a study room (booking required), a children's corner, and a café on the ground floor. Computers are available for 1-hour sessions.`,
    questions:[
      { q:'Thư viện mở cửa đến mấy giờ vào thứ Sáu?', options:['6 giờ tối','8 giờ tối','9 giờ tối'] },
      { q:'Thẻ thư viện miễn phí cho ai?', options:['Tất cả mọi người','Học sinh và người dưới 18 tuổi','Chỉ học sinh tiểu học'] },
      { q:'Một lần có thể mượn tối đa bao nhiêu cuốn sách?', options:['3 cuốn','5 cuốn','6 cuốn'] },
      { q:'Mượn DVD phải trả trong bao lâu?', options:['1 tuần','2 tuần','3 tuần'] },
      { q:'Muốn dùng phòng học cần làm gì?', options:['Trả phí','Đặt trước','Có thẻ đặc biệt'] },
    ],
    answer_key:['B','B','C','A','B'],
  },
];

// ---------- KET LISTENING ----------
const KET_LISTENING = [
  {
    program:'KET', skill:'Listening',
    title:'KET Listening Part 1 — Short Dialogues (5 conversations)',
    content:`Nghe 5 đoạn hội thoại ngắn và chọn đáp án đúng (A, B hoặc C) cho mỗi câu hỏi.\n\n⚠️ File âm thanh do giáo viên cập nhật. Câu hỏi bên dưới để bạn làm quen dạng bài.`,
    questions:[
      { q:'1. Where does the boy want to meet his friend?', options:['At the park','At the library','At the sports centre'] },
      { q:'2. What time does the film start?', options:['6:30','7:00','7:30'] },
      { q:'3. What does the girl buy at the market?', options:['Vegetables','Fruit','Bread'] },
      { q:'4. How does Tom travel to school every day?', options:['By bus','By bike','On foot'] },
      { q:'5. What is the weather like tomorrow?', options:['Sunny','Cloudy','Rainy'] },
    ],
    answer_key:['A','C','B','B','C'],
  },
  {
    program:'KET', skill:'Listening',
    title:'KET Listening Part 2 — School Trip Announcement',
    content:`Nghe thông báo về chuyến đi của trường và chọn đáp án đúng.\n\n⚠️ File âm thanh do giáo viên cập nhật.`,
    questions:[
      { q:'1. The school trip is to:', options:['A museum','A theme park','A science centre'] },
      { q:'2. Students need to arrive at school at:', options:['7:45 a.m.','8:00 a.m.','8:30 a.m.'] },
      { q:'3. The cost of the trip is:', options:['£8','£10','£12'] },
      { q:'4. Students should bring:', options:['A packed lunch','Money for food','A packed lunch and money for drinks'] },
      { q:'5. The trip is on:', options:['Friday 14th March','Monday 17th March','Wednesday 19th March'] },
    ],
    answer_key:['C','A','B','A','A'],
  },
];

// ---------- PET WRITING ----------
const PET_WRITING = [
  { program:'PET', skill:'Writing', title:'PET Writing Part 1 — Email: Chuyến đi cắm trại cuối tuần',
    content:`You are going on a camping trip this weekend. Write an email to your English friend Sam.\n\nIn your email:\n- tell Sam where you are going camping\n- explain why you are excited about the trip\n- ask Sam if they have been camping before\n\nWrite 100 words or more.` },
  { program:'PET', skill:'Writing', title:'PET Writing Part 1 — Email: Kế hoạch làm dự án nhóm',
    content:`Your class is going to do a group project. Write an email to your classmate Alex about it.\n\nIn your email:\n- describe what the project is about\n- suggest when and where you could meet to work on it\n- ask Alex what part of the project they want to do\n\nWrite 100 words or more.` },
  { program:'PET', skill:'Writing', title:'PET Writing Part 2 — Article: My favourite way to relax',
    content:`You see this notice in an international student magazine:\n\nARTICLES WANTED!\nHow do you relax after studying?\nWhat do you like to do? Why does it help you relax?\nWrite an article for our magazine.\nThe best articles will be published!\n\nWrite your article in 100 words or more.` },
  { program:'PET', skill:'Writing', title:'PET Writing Part 2 — Story: The unexpected visitor',
    content:`Your English teacher has asked you to write a story. Your story must begin with this sentence:\n\n"When I opened the door, I couldn't believe who was standing there."\n\nWrite your story in 100 words or more.` },
];

// ---------- PET READING ----------
const PET_READING = [
  {
    program:'PET', skill:'Reading',
    title:'PET Reading Part 4 — The History of the Internet',
    content:`Read the article and choose the best answer (A, B or C).

THE HISTORY OF THE INTERNET

The internet as we know it today began as a project for the United States military in the 1960s. Scientists created a network called ARPANET that allowed different computers to share information. At the time, it was mainly used by universities and government departments.

In 1991, a British scientist named Tim Berners-Lee invented the World Wide Web, which made it possible for ordinary people to access information online using websites. This was the moment that changed everything. By the mid-1990s, millions of people around the world were connecting to the internet for the first time.

Today, the internet connects over 5 billion people worldwide. We use it for entertainment, shopping, education, and staying in touch with friends and family. Some people argue that the internet has made the world a better, more connected place. Others worry that it has created new problems, such as the spread of false information and issues with privacy.

Whatever your view, there is no doubt that the internet has transformed modern life in ways that few people predicted back in the 1960s.`,
    questions:[
      { q:'When was ARPANET first created?', options:['In the 1950s','In the 1960s','In the 1970s'] },
      { q:'Who invented the World Wide Web?', options:['An American scientist','A British scientist','A French scientist'] },
      { q:'What happened in the mid-1990s?', options:['ARPANET was created','The World Wide Web was invented','Millions of people went online for the first time'] },
      { q:'How many people use the internet today?', options:['Over 3 billion','Over 4 billion','Over 5 billion'] },
      { q:'What is one concern about the internet mentioned in the article?', options:['It is too slow','It spreads false information','It is too expensive'] },
    ],
    answer_key:['B','B','C','C','B'],
  },
  {
    program:'PET', skill:'Reading',
    title:'PET Reading Part 4 — Why People Choose to Go Vegetarian',
    content:`Read the article and choose the best answer (A, B or C).

WHY PEOPLE CHOOSE TO GO VEGETARIAN

More and more people around the world are choosing to eat less meat or give it up completely. But what are the reasons behind this growing trend?

For many people, the decision is about health. Research shows that a diet rich in vegetables, fruits and whole grains can reduce the risk of heart disease and certain types of cancer. Vegetarians often have lower blood pressure and a healthier body weight.

Others choose vegetarianism for environmental reasons. Producing meat requires large amounts of land, water and energy. Cattle farming in particular produces significant amounts of greenhouse gases. By eating less meat, people can reduce their environmental impact.

Animal welfare is another important reason. Many people are concerned about the conditions in which farm animals are kept, and they do not want to support industries that they believe cause suffering.

Of course, giving up meat is not without challenges. It requires careful planning to make sure you get enough protein, iron and other nutrients. But with a wide variety of vegetarian foods now available, many people find it easier than ever to make the switch.`,
    questions:[
      { q:'Which health benefit of vegetarianism is mentioned?', options:['Stronger muscles','Lower blood pressure','Better eyesight'] },
      { q:'Why is cattle farming especially harmful to the environment?', options:['It uses too many workers','It produces greenhouse gases','It takes too long'] },
      { q:'What is the third reason mentioned for choosing vegetarianism?', options:['Saving money','Animal welfare','Religious beliefs'] },
      { q:'What challenge do vegetarians face according to the article?', options:['Finding restaurants','Getting enough nutrients','Cooking at home'] },
      { q:'What is the main purpose of this article?', options:['To persuade everyone to become vegetarian','To explain different reasons people choose vegetarianism','To compare the costs of meat and vegetarian diets'] },
    ],
    answer_key:['B','B','B','B','B'],
  },
  {
    program:'PET', skill:'Reading',
    title:'PET Reading Part 5 — Technology in the Classroom',
    content:`Read the article. Choose the best word (A, B or C) for each space.

TECHNOLOGY IN THE CLASSROOM

Technology has (1)_____ the way students learn in schools around the world. In many countries, students now (2)_____ tablets and laptops instead of traditional textbooks. This means they (3)_____ access a huge amount of information instantly.

However, not everyone believes that technology in the classroom is a good thing. Some teachers (4)_____ that students spend too much time on screens and not enough time developing social skills. There are also concerns about students (5)_____ distracted by games or social media during lessons.`,
    questions:[
      { q:'1. Technology has _____ the way students learn.', options:['changed','broken','stopped'] },
      { q:'2. Students now _____ tablets and laptops.', options:['refuse','use','make'] },
      { q:'3. They _____ access a huge amount of information instantly.', options:['should','must','can'] },
      { q:'4. Some teachers _____ that students spend too much time on screens.', options:['worry','enjoy','hope'] },
      { q:'5. Concerns about students _____ distracted.', options:['become','became','becoming'] },
    ],
    answer_key:['A','B','C','A','C'],
  },
];

// ---------- PET LISTENING ----------
const PET_LISTENING = [
  {
    program:'PET', skill:'Listening',
    title:'PET Listening Part 1 — Multiple choice: Short extracts',
    content:`Nghe 7 đoạn trích ngắn và chọn đáp án đúng (A, B hoặc C) cho mỗi câu hỏi.\n\n⚠️ File âm thanh do giáo viên cập nhật.`,
    questions:[
      { q:'1. What will the man buy at the market?', options:['Vegetables','Fish','Bread and cheese'] },
      { q:'2. Where are the friends planning to go on Saturday?', options:['To the cinema','To the shopping mall','To the park'] },
      { q:'3. What time does the next train to London leave?', options:['14:15','14:45','15:10'] },
      { q:'4. Why did the girl miss the party?', options:['She was ill','She forgot about it','She had to work'] },
      { q:'5. How much does the blue jacket cost?', options:['£35','£45','£55'] },
    ],
    answer_key:['C','A','B','A','B'],
  },
  {
    program:'PET', skill:'Listening',
    title:'PET Listening Part 4 — Interview with a young musician',
    content:`Nghe bài phỏng vấn với một nhạc sĩ trẻ và chọn câu trả lời đúng.\n\n⚠️ File âm thanh do giáo viên cập nhật.`,
    questions:[
      { q:'1. When did Sophie start learning the guitar?', options:['When she was six','When she was eight','When she was ten'] },
      { q:'2. What type of music does Sophie most enjoy playing?', options:['Classical','Pop','Jazz'] },
      { q:'3. How often does Sophie practise?', options:['Every day','Three times a week','At weekends only'] },
      { q:'4. What is Sophie\'s biggest challenge as a musician?', options:['Finding time to practise','Performing in front of people','Writing her own music'] },
      { q:'5. What does Sophie plan to do next year?', options:['Join a band','Record an album','Give music lessons'] },
    ],
    answer_key:['B','C','A','B','A'],
  },
];

// ---------- FCE WRITING ----------
const FCE_WRITING = [
  { program:'FCE', skill:'Writing', title:'FCE Writing Part 1 — Essay: The benefits of social media',
    content:`In your English class you have been discussing the impact of social media on young people. Your teacher has now asked you to write an essay.\n\nWrite an essay using all the notes and give reasons for your point of view.\n\n"Social media has more benefits than drawbacks for young people."\n\nNotes — Write about:\n1. communication and friendships\n2. information and learning opportunities\n3. ........... (your own idea)\n\nWrite your essay in 140–190 words.` },
  { program:'FCE', skill:'Writing', title:'FCE Writing Part 1 — Essay: Living in cities vs the countryside',
    content:`In your English class you have been discussing where young people prefer to live. Your teacher has now asked you to write an essay.\n\nWrite an essay using all the notes and give reasons for your point of view.\n\n"Young people today prefer to live in cities rather than the countryside."\n\nNotes — Write about:\n1. job opportunities and career development\n2. lifestyle and entertainment\n3. ........... (your own idea)\n\nWrite your essay in 140–190 words.` },
  { program:'FCE', skill:'Writing', title:'FCE Writing Part 2 — Article: A memorable journey',
    content:`You see this announcement in an international travel magazine:\n\nARTICLES WANTED!\nTell us about a journey you'll never forget.\nWhat made it so special or memorable?\nWould you recommend this kind of travel to others? Why?\n\nWrite your article for the magazine in 140–190 words.` },
  { program:'FCE', skill:'Writing', title:'FCE Writing Part 2 — Review: A book that changed your life',
    content:`You see this notice on a school English department website:\n\nBOOK REVIEWS NEEDED!\nWe are collecting reviews of books that have had an impact on students.\nTell us about a book that changed the way you think or feel about something.\nWould you recommend it to other students? Why?\n\nWrite your review in 140–190 words.` },
];

// ---------- FCE READING ----------
const FCE_READING = [
  {
    program:'FCE', skill:'Reading',
    title:'FCE Reading Part 5 — The Art of Forgetting',
    content:`Read the text and choose the best answer (A, B or C).

THE ART OF FORGETTING

We tend to think of memory as something precious — the ability to hold on to our experiences, knowledge and the people we love. Yet scientists are increasingly coming to view forgetting not as a failure, but as an essential feature of a healthy mind.

Research by neuroscientists at the University of Toronto suggests that the brain actively works to delete information it no longer needs. This process, known as 'synaptic pruning', allows the brain to focus on what is most relevant and to make quicker, more efficient decisions. In other words, forgetting is not a bug — it is a feature.

This has important implications for how we think about artificial intelligence. Current AI systems are designed to remember everything, but this may actually make them less flexible and adaptable than the human brain. Scientists are now exploring ways to build 'forgetting' into AI models to help them make better decisions.

Of course, forgetting is not always beneficial. Conditions such as Alzheimer's disease involve harmful memory loss that can be devastating for individuals and families. But these are cases of uncontrolled forgetting — very different from the targeted, selective process that healthy brains carry out every day.

The conclusion? Sometimes, the most intelligent thing a brain can do is know what to let go of.`,
    questions:[
      { q:'What does recent research suggest about forgetting?', options:['It is an active and useful brain process','It is a sign of poor mental health','It only affects older people'] },
      { q:'What is "synaptic pruning"?', options:['A technique for improving memory','A type of brain surgery','A process where the brain removes unneeded information'] },
      { q:'Why might current AI systems be less adaptable than human brains?', options:['They process information too slowly','They are designed to remember everything','They cannot learn new information'] },
      { q:'What does the article say about Alzheimer\'s disease?', options:['It is similar to healthy forgetting','It involves harmful, uncontrolled memory loss','It can be cured by neuroscientists'] },
      { q:'What is the writer\'s main conclusion?', options:['Forgetting should always be avoided','AI systems should copy human memory perfectly','The ability to forget selectively is a sign of intelligence'] },
    ],
    answer_key:['A','C','B','B','C'],
  },
  {
    program:'FCE', skill:'Reading',
    title:'FCE Reading Part 5 — Urban Beekeeping: A Growing Trend',
    content:`Read the article and choose the best answer (A, B or C).

URBAN BEEKEEPING: A GROWING TREND

Cities might not seem like the ideal home for bees, but urban beekeeping has been growing rapidly over the past decade. From rooftop hives in New York to community gardens in London, more and more city dwellers are taking up this ancient practice — and the bees, it turns out, seem to be thriving.

Research has shown that urban bees can actually be healthier than their rural counterparts. The reason is somewhat surprising: the modern countryside, dominated by intensive agriculture, offers bees a limited and often pesticide-laden diet. Cities, by contrast, offer a more diverse range of flowering plants in parks, gardens and verges, providing bees with a richer nutritional diet throughout the year.

Urban beekeeping also offers important benefits for the city environment. Bees are essential pollinators — without them, many of the fruits and vegetables we eat would not exist. Having more bees in cities helps local plants and gardens to thrive, supports biodiversity and can even improve food security in urban areas.

Critics, however, raise concerns about overcrowding. In some cities, the number of urban hives has grown so quickly that competition for food between bee colonies has become a problem. Beekeeping organisations have called for better regulation to prevent this.

Despite these concerns, the trend shows no sign of slowing. For many city residents, keeping bees offers a connection to the natural world and a sense of purpose that urban life can sometimes lack.`,
    questions:[
      { q:'Why are urban bees often healthier than rural bees?', options:['Cities have fewer predators','Cities offer a more varied diet of plants','Cities have better veterinary care'] },
      { q:'What problem does intensive agriculture create for bees?', options:['It provides a limited and contaminated food supply','It destroys bee habitats completely','It increases bee populations too fast'] },
      { q:'How does urban beekeeping benefit city environments?', options:['It reduces air pollution','It supports biodiversity and food production','It provides income for city residents'] },
      { q:'What concern do critics raise about urban beekeeping?', options:['The noise disturbs residents','There are too many hives competing for food','Bees are dangerous in cities'] },
      { q:'What motivates many city people to keep bees, according to the writer?', options:['The financial rewards','A desire to connect with nature','Health benefits of honey'] },
    ],
    answer_key:['B','A','B','B','B'],
  },
];

// ---------- FCE LISTENING ----------
const FCE_LISTENING = [
  {
    program:'FCE', skill:'Listening',
    title:'FCE Listening Part 1 — Multiple choice: Short extracts',
    content:`Nghe 8 đoạn trích ngắn và chọn đáp án đúng (A, B hoặc C) cho mỗi câu hỏi.\n\n⚠️ File âm thanh do giáo viên cập nhật.`,
    questions:[
      { q:'1. What did the woman most enjoy about her holiday?', options:['The food','The scenery','Meeting local people'] },
      { q:'2. Why is the man calling the restaurant?', options:['To book a table','To complain about the food','To ask about the menu'] },
      { q:'3. What does the teacher say students should do to improve their writing?', options:['Read more books','Keep a journal','Join a writing group'] },
      { q:'4. What is the man\'s opinion of the new shopping centre?', options:['It is too expensive','It is poorly designed','It is too far from the city centre'] },
      { q:'5. What will the friends do this evening?', options:['Watch a film at home','Go to the cinema','Go to a restaurant'] },
    ],
    answer_key:['C','A','B','B','A'],
  },
  {
    program:'FCE', skill:'Listening',
    title:'FCE Listening Part 3 — Multiple matching: People talk about hobbies',
    content:`Nghe 5 người nói về sở thích và ghép mỗi người với ý kiến đúng.\n\n⚠️ File âm thanh do giáo viên cập nhật.`,
    questions:[
      { q:'Speaker 1 enjoys their hobby mainly because:', options:['It helps them meet people','It allows them to be creative','It keeps them fit'] },
      { q:'Speaker 2 started their hobby because:', options:['A friend recommended it','They read about it online','A family member introduced them'] },
      { q:'Speaker 3 says the biggest challenge is:', options:['Finding enough time','The cost involved','Improving their skills'] },
      { q:'Speaker 4 would like to:', options:['Turn their hobby into a job','Teach others their hobby','Learn a new hobby soon'] },
      { q:'Speaker 5 thinks their hobby is valuable because:', options:['It is good for mental health','It has improved their confidence','It has taught them patience'] },
    ],
    answer_key:['B','C','A','A','C'],
  },
];

// ---------- IELTS WRITING (thêm ngoài đề mẫu ban đầu) ----------
const IELTS_WRITING_EXTRA = [
  { program:'IELTS', skill:'Writing', title:'IELTS Writing Task 1 — Bar Chart: Leisure Activities by Age Group',
    content:`The bar chart below shows the percentage of people in five age groups who participate in four different leisure activities.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.\n\nWrite at least 150 words.\n\n[Dữ liệu biểu đồ (%) — giáo viên cung cấp hình ảnh thực tế]\n• Watching TV: tăng theo tuổi (35% ở 16–24, lên 78% ở 55+)\n• Playing sports: giảm theo tuổi (65% ở 16–24, xuống 22% ở 55+)\n• Reading: ổn định (40–50% mọi nhóm tuổi)\n• Gaming: cao nhất ở 16–24 (58%), giảm mạnh ở nhóm lớn tuổi hơn` },
  { program:'IELTS', skill:'Writing', title:'IELTS Writing Task 2 — Online learning vs traditional education',
    content:`Write about the following topic:\n\nSome people believe that online education is just as effective as traditional classroom-based learning. Others disagree.\n\nDiscuss both views and give your own opinion.\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.` },
  { program:'IELTS', skill:'Writing', title:'IELTS Writing Task 2 — Traffic congestion in cities',
    content:`Write about the following topic:\n\nIn many cities around the world, traffic congestion has become a serious problem. What are the main causes of this problem, and what measures can be taken to address it?\n\nGive reasons for your answer and include any relevant examples from your own knowledge or experience.\n\nWrite at least 250 words.` },
];

// ---------- IELTS READING ----------
const IELTS_READING = [
  {
    program:'IELTS', skill:'Reading',
    title:'IELTS Reading — Passage 1: The Science of Sleep',
    content:`Read the passage and choose the best answer (A, B or C).

THE SCIENCE OF SLEEP

Sleep is one of the most fundamental biological processes, yet for centuries it remained poorly understood. Today, neuroscientists are uncovering the remarkable ways in which sleep affects almost every aspect of human health and performance.

During sleep, the brain cycles through several distinct stages. The first stage is light sleep, in which the body begins to relax and brain activity slows. This is followed by deeper stages of sleep, culminating in what is known as slow-wave sleep, during which the body repairs tissues, builds muscle and strengthens the immune system. Finally, periods of REM (Rapid Eye Movement) sleep occur, during which most dreaming takes place and emotional memories are processed.

One of the most significant findings in recent sleep research concerns the brain's waste-removal system, known as the glymphatic system. During sleep, channels between brain cells widen, allowing cerebrospinal fluid to flush out toxic proteins — including those associated with Alzheimer's disease. This suggests that poor sleep may be an important risk factor for neurodegenerative conditions.

Research has also established clear links between sleep and emotional regulation. Studies show that people who are sleep-deprived are significantly more likely to experience anxiety, irritability and depression. One study at the University of California found that just one night of poor sleep increased emotional reactivity by 60%.

Despite the well-documented benefits of sleep, millions of people worldwide regularly fail to get enough. The recommended amount for adults is seven to nine hours per night, yet surveys suggest that a significant proportion of adults in developed countries sleep fewer than six hours.`,
    questions:[
      { q:'What happens during slow-wave sleep?', options:['Most dreaming occurs','The body repairs itself and strengthens immunity','Brain activity speeds up'] },
      { q:'What is the glymphatic system?', options:['A system that stores memories','A network of emotional processing centres','The brain\'s waste-removal system'] },
      { q:'What may be a risk factor for Alzheimer\'s disease, according to the passage?', options:['Poor sleep habits','Excessive dreaming','Overactive immune system'] },
      { q:'By how much did poor sleep increase emotional reactivity in the California study?', options:['40%','50%','60%'] },
      { q:'How many hours of sleep per night do adults need?', options:['6–7 hours','7–9 hours','8–10 hours'] },
    ],
    answer_key:['B','C','A','C','B'],
  },
  {
    program:'IELTS', skill:'Reading',
    title:'IELTS Reading — Passage 2: The Rise of Vertical Farming',
    content:`Read the passage and choose the best answer (A, B or C).

THE RISE OF VERTICAL FARMING

As the global population continues to grow and arable land becomes increasingly scarce, agricultural scientists and entrepreneurs are looking upward for solutions. Vertical farming, the practice of growing crops in stacked layers inside controlled indoor environments, is emerging as one of the most promising innovations in modern agriculture.

Unlike conventional farming, vertical farms require no soil. Instead, plants grow in nutrient-rich water solutions — a technique known as hydroponics — or in the air itself, where their roots are regularly misted with water and nutrients in a process called aeroponics. These methods use up to 95% less water than traditional agriculture and allow year-round production regardless of weather conditions or season.

The environmental advantages are significant. Vertical farms can be located close to cities, reducing transportation distances and the carbon emissions associated with food distribution. Because crops grow in sealed, controlled environments, there is no need for pesticides, resulting in cleaner produce. Furthermore, LED lighting technology has dramatically reduced the energy costs that once made vertical farming economically unviable.

However, challenges remain. The initial investment required to set up a vertical farm is substantial. Energy costs, while falling, are still considerably higher than those for open-field farming. Critics also argue that vertical farming is currently only suitable for crops such as leafy vegetables and herbs, and that staple crops like wheat and rice cannot yet be grown economically in this way.

Despite these limitations, investment in vertical farming has been growing rapidly. Major companies in the United States, Japan and the United Kingdom have raised hundreds of millions of dollars to expand their operations.`,
    questions:[
      { q:'What technique involves growing plants in nutrient-rich water solutions?', options:['Aeroponics','Hydroponics','Bioponics'] },
      { q:'How much less water do vertical farms use compared to traditional farming?', options:['Up to 75%','Up to 85%','Up to 95%'] },
      { q:'Why is locating vertical farms near cities beneficial?', options:['Land is cheaper in cities','It reduces transportation emissions','Workers are easier to find'] },
      { q:'What criticism do opponents of vertical farming raise?', options:['It produces unhealthy food','It is currently only suitable for some crops','It requires too much land'] },
      { q:'What trend is described in the final paragraph?', options:['Investment in vertical farming is decreasing','Vertical farming is being banned in some countries','Investment in vertical farming is growing rapidly'] },
    ],
    answer_key:['B','C','B','B','C'],
  },
];

// ---------- IELTS LISTENING ----------
const IELTS_LISTENING = [
  {
    program:'IELTS', skill:'Listening',
    title:'IELTS Listening Section 1 — Sports centre membership enquiry',
    content:`Nghe cuộc hội thoại giữa một khách hàng và nhân viên trung tâm thể thao.\n\n⚠️ File âm thanh do giáo viên cập nhật.`,
    questions:[
      { q:'1. What type of membership is the customer enquiring about?', options:['Student membership','Family membership','Annual membership'] },
      { q:'2. What is the monthly cost of the standard membership?', options:['£25','£35','£45'] },
      { q:'3. Which facility is NOT included in the basic membership?', options:['The gym','The swimming pool','The tennis courts'] },
      { q:'4. What time does the centre open on Sundays?', options:['8:00 a.m.','9:00 a.m.','10:00 a.m.'] },
      { q:'5. What does the customer need to bring to register?', options:['A passport photo and proof of address','A bank card only','A letter from their doctor'] },
    ],
    answer_key:['A','B','C','B','A'],
  },
  {
    program:'IELTS', skill:'Listening',
    title:'IELTS Listening Section 3 — University research project discussion',
    content:`Nghe cuộc thảo luận giữa hai sinh viên và giáo sư về dự án nghiên cứu.\n\n⚠️ File âm thanh do giáo viên cập nhật.`,
    questions:[
      { q:'1. What is the main topic of the students\' research project?', options:['Climate change and agriculture','Urban transport systems','Social media and mental health'] },
      { q:'2. Which age group does the professor suggest focusing on?', options:['Children aged 8–12','Teenagers aged 13–18','Young adults aged 18–25'] },
      { q:'3. What research method does the professor recommend most strongly?', options:['Online surveys','Face-to-face interviews','Analysis of existing data'] },
      { q:'4. How long does the professor say the project should take?', options:['Four weeks','Six weeks','Eight weeks'] },
      { q:'5. What does the professor say about the final report length?', options:['At least 5,000 words','Around 3,000 words','Word count is not specified'] },
    ],
    answer_key:['C','B','B','B','A'],
  },
];

// ---------- APTIS WRITING ----------
const APTIS_WRITING = [
  { program:'APTIS', skill:'Writing', title:'APTIS Writing Component 1 — Short answers about yourself',
    content:`APTIS Writing Component 1: Answer the questions in short phrases or sentences.\n\n1. What is your favourite type of food and why? (Write 5–10 words)\n\n2. Describe what you usually do on weekends. (Write 10–20 words)\n\n3. Tell us about a skill you would like to learn and explain why. (Write 20–30 words)` },
  { program:'APTIS', skill:'Writing', title:'APTIS Writing Component 2 — Reply to a friend\'s email',
    content:`Read the email from your friend and write a reply.\n\nFrom: Sophie\nSubject: My new job!\n\nHi! I've just started a new job at a marketing company in the city centre. It's really exciting but also quite tiring. I have to commute for an hour each way every day. I was wondering — what do you think is the best way to deal with a long commute? Also, what do you do to relax after a busy day at work? I'd love to know!\n\nHope to hear from you soon,\nSophie\n\nWrite your reply in 40–50 words.` },
  { program:'APTIS', skill:'Writing', title:'APTIS Writing Component 4 — Essay: The importance of lifelong learning',
    content:`Write about the following topic:\n\nMany people believe that learning should not stop when formal education ends. They argue that adults should continue to develop new skills and knowledge throughout their lives.\n\nDo you agree with this view? What are the benefits of lifelong learning? Are there any challenges?\n\nGive reasons and examples to support your ideas.\n\nWrite 120–150 words.` },
];

// ---------- APTIS READING ----------
const APTIS_READING = [
  {
    program:'APTIS', skill:'Reading',
    title:'APTIS Reading Part 1 — Word meaning matching',
    content:`Choose the correct meaning for each word (A, B or C).`,
    questions:[
      { q:'1. AMBITIOUS', options:['Having a strong desire to succeed','Feeling nervous about something','Being satisfied with what you have'] },
      { q:'2. SUSTAINABLE', options:['Very expensive to produce','Able to continue without harming the environment','Difficult to understand'] },
      { q:'3. COMMUTE', options:['To save money for the future','To change your opinion','To travel regularly between home and work'] },
      { q:'4. COLLABORATE', options:['To argue with a colleague','To work together with others','To check information carefully'] },
      { q:'5. FLEXIBLE', options:['Very strict about rules','Interested in many different things','Able to change or adapt easily'] },
    ],
    answer_key:['A','B','C','B','C'],
  },
  {
    program:'APTIS', skill:'Reading',
    title:'APTIS Reading Part 4 — Remote Work and Productivity',
    content:`Read the article and choose the best answer (A, B or C).

REMOTE WORK: IS IT REALLY MORE PRODUCTIVE?

The shift to remote work that followed the global pandemic forced millions of companies to rethink how work gets done. Now, several years on, the debate about remote work and productivity shows no sign of settling.

Supporters point to studies suggesting that employees who work from home are more productive than their office-based counterparts. Without the distractions of a busy office — impromptu meetings, noisy open-plan spaces, long commutes — workers can focus more deeply on complex tasks. A study by Stanford University found that remote workers were 13% more productive than those in the office.

However, critics argue that this productivity boost is not universal. For some roles, particularly those that involve creative collaboration or mentoring, physical proximity remains important. Junior employees, in particular, may miss out on the informal learning opportunities that come from working alongside more experienced colleagues.

There are also concerns about the long-term effects on wellbeing. Without the social interactions of office life, some workers report feeling isolated and disconnected. The boundary between work and home life can also become blurred, leading to longer working hours and burnout.

Many organisations are now experimenting with hybrid models — combining remote and office work — in an attempt to gain the benefits of both.`,
    questions:[
      { q:'According to the Stanford study, how much more productive were remote workers?', options:['9% more','13% more','18% more'] },
      { q:'For which type of work is physical proximity said to be important?', options:['Administrative tasks','Data analysis','Creative collaboration and mentoring'] },
      { q:'What negative effect might remote work have on junior employees?', options:['They are paid less','They miss informal learning opportunities','They work fewer hours'] },
      { q:'What wellbeing concern is raised about remote workers?', options:['They exercise less','They feel isolated and may experience burnout','They find it hard to use technology'] },
      { q:'What solution are many organisations currently exploring?', options:['Fully remote working','Hybrid models combining office and remote work','Reducing working hours'] },
    ],
    answer_key:['B','C','B','B','B'],
  },
];

// ---------- APTIS LISTENING ----------
const APTIS_LISTENING = [
  {
    program:'APTIS', skill:'Listening',
    title:'APTIS Listening Part 1 — Short extracts: Multiple choice',
    content:`Nghe 6 đoạn trích ngắn và chọn đáp án đúng.\n\n⚠️ File âm thanh do giáo viên cập nhật.`,
    questions:[
      { q:'1. The company has offices in how many countries?', options:['Two','Three','Four'] },
      { q:'2. What time does the conference start?', options:['9:00 a.m.','9:30 a.m.','10:00 a.m.'] },
      { q:'3. What does the speaker recommend about the new restaurant?', options:['It\'s highly recommended','It\'s good but expensive','It hasn\'t opened yet'] },
      { q:'4. What has happened to the training session?', options:['It has been cancelled','It has been moved to next week','It is still on as planned'] },
      { q:'5. How must participants register for the workshop?', options:['Online before the event','By phone','At the door on the day'] },
    ],
    answer_key:['B','A','A','A','A'],
  },
];

// ===== Gộp tất cả đề và chèn idempotent =====
const ALL_PRESET_EXERCISES = [
  ...KET_WRITING,
  ...KET_READING,
  ...KET_LISTENING,
  ...PET_WRITING,
  ...PET_READING,
  ...PET_LISTENING,
  ...FCE_WRITING,
  ...FCE_READING,
  ...FCE_LISTENING,
  ...IELTS_WRITING_EXTRA,
  ...IELTS_READING,
  ...IELTS_LISTENING,
  ...APTIS_WRITING,
  ...APTIS_READING,
  ...APTIS_LISTENING,
];

function ensureExercises() {
  const tom = db.prepare("SELECT id FROM users WHERE email='tom@ewt.vn'").get();
  const by = tom ? tom.id : null;
  const has = db.prepare('SELECT id FROM exercises WHERE title=?');
  const insWriting = db.prepare('INSERT INTO exercises (program,skill,title,content,auto_grade,created_by,created_at) VALUES (?,?,?,?,0,?,?)');
  const insQuiz    = db.prepare('INSERT INTO exercises (program,skill,title,content,questions,answer_key,auto_grade,created_by,created_at) VALUES (?,?,?,?,?,?,1,?,?)');

  ALL_PRESET_EXERCISES.forEach(e => {
    if (has.get(e.title)) return;
    if (e.questions) {
      insQuiz.run(e.program, e.skill, e.title, e.content || '',
        JSON.stringify(e.questions), JSON.stringify(e.answer_key), by, now());
    } else {
      insWriting.run(e.program, e.skill, e.title, e.content || '', by, now());
    }
  });
}
ensureExercises();

module.exports = { db, hashPassword, verifyPassword, now };
