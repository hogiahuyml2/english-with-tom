// Cơ sở dữ liệu + xác thực mật khẩu — dùng SQLite tích hợp sẵn của Node
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR || __dirname;
const db = new DatabaseSync(path.join(DATA_DIR, 'data.db'));

// ===== Tối ưu hiệu năng SQLite =====
db.exec('PRAGMA journal_mode=WAL');       // cho phép đọc song song với ghi
db.exec('PRAGMA synchronous=NORMAL');     // an toàn nhưng nhanh hơn FULL
db.exec('PRAGMA cache_size=-16000');      // 16MB page cache trong RAM
db.exec('PRAGMA temp_store=MEMORY');      // sort/index temp tables trong RAM
db.exec('PRAGMA mmap_size=134217728');    // 128MB memory-mapped I/O

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
if (!userCols.includes('reset_token'))         db.exec('ALTER TABLE users ADD COLUMN reset_token TEXT');
if (!userCols.includes('reset_token_expiry'))  db.exec('ALTER TABLE users ADD COLUMN reset_token_expiry TEXT');
if (!userCols.includes('verify_token_expiry')) db.exec('ALTER TABLE users ADD COLUMN verify_token_expiry TEXT');

const subCols = db.prepare('PRAGMA table_info(submissions)').all().map(c => c.name);
if (!subCols.includes('feedback')) db.exec('ALTER TABLE submissions ADD COLUMN feedback TEXT');

const exCols = db.prepare('PRAGMA table_info(exercises)').all().map(c => c.name);
if (!exCols.includes('questions'))  db.exec('ALTER TABLE exercises ADD COLUMN questions TEXT');
if (!exCols.includes('image_url'))  db.exec('ALTER TABLE exercises ADD COLUMN image_url TEXT');
if (!exCols.includes('audio_url'))  db.exec('ALTER TABLE exercises ADD COLUMN audio_url TEXT');
if (!exCols.includes('is_private')) db.exec('ALTER TABLE exercises ADD COLUMN is_private INTEGER NOT NULL DEFAULT 0');
if (!exCols.includes('task_type'))  db.exec('ALTER TABLE exercises ADD COLUMN task_type TEXT');
if (!exCols.includes('metadata'))   db.exec('ALTER TABLE exercises ADD COLUMN metadata TEXT');

db.exec(`
CREATE TABLE IF NOT EXISTS assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  exercise_id INTEGER NOT NULL,
  student_email TEXT NOT NULL,
  assigned_by INTEGER NOT NULL,
  deadline TEXT,
  note TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  teacher_id INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS group_members (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id INTEGER,
  invited_email TEXT,
  added_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(group_id, user_id)
);
`);

const assignCols = db.prepare('PRAGMA table_info(assignments)').all().map(c => c.name);
if (!assignCols.includes('group_id'))      db.exec('ALTER TABLE assignments ADD COLUMN group_id INTEGER');
if (!assignCols.includes('reminder_sent')) db.exec('ALTER TABLE assignments ADD COLUMN reminder_sent INTEGER NOT NULL DEFAULT 0');

// ===== Bảng Messages =====
db.exec(`
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  read_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_messages_thread ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, read_at);
`);

// ===== Bảng Annotation & Push Subscription =====
db.exec(`
CREATE TABLE IF NOT EXISTS annotations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  submission_id INTEGER NOT NULL REFERENCES submissions(id) ON DELETE CASCADE,
  teacher_id INTEGER NOT NULL,
  start_offset INTEGER NOT NULL,
  end_offset INTEGER NOT NULL,
  selected_text TEXT NOT NULL,
  note TEXT,
  color TEXT NOT NULL DEFAULT '#fbbf24',
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`);

// ===== Indexes — tăng tốc query thường dùng =====
db.exec(`
CREATE INDEX IF NOT EXISTS idx_exercises_program    ON exercises(program);
CREATE INDEX IF NOT EXISTS idx_exercises_created_by ON exercises(created_by);
CREATE INDEX IF NOT EXISTS idx_exercises_private    ON exercises(is_private);
CREATE INDEX IF NOT EXISTS idx_submissions_user     ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_exercise ON submissions(exercise_id);
CREATE INDEX IF NOT EXISTS idx_submissions_user_ex  ON submissions(user_id, exercise_id);
CREATE INDEX IF NOT EXISTS idx_assignments_email    ON assignments(student_email);
CREATE INDEX IF NOT EXISTS idx_assignments_exercise ON assignments(exercise_id);
CREATE INDEX IF NOT EXISTS idx_assignments_reminder ON assignments(reminder_sent, deadline);
CREATE INDEX IF NOT EXISTS idx_sessions_user        ON sessions(user_id);
`);

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

  console.log('✓ Đã tạo tài khoản ban đầu (admin@ewt.vn / tom@ewt.vn)');
}
seed();

// ===== Xoá đề mẫu cũ (migration một lần) =====
;(function removeDemoExercises() {
  const demoTitles = [
    'IELTS Reading — Test 3 (The History of Tea)',
    'IELTS Listening — Test 2',
    'IELTS Writing Task 2 — Chủ đề Môi trường',
    'PET Reading — Part 4',
  ];
  const del = db.prepare('DELETE FROM exercises WHERE title=?');
  let removed = 0;
  demoTitles.forEach(function(t){ removed += del.run(t).changes; });
  if (removed > 0) console.log('✓ Đã xoá ' + removed + ' đề mẫu cũ khỏi database.');
})();

// ===== Đề thật bổ sung (idempotent) =====

// ---------- KET WRITING (28 đề được yêu cầu) ----------
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
const KET_READING = [];

// ---------- KET LISTENING ----------
const KET_LISTENING = [];

// ---------- PET WRITING ----------
const PET_WRITING = [];

// ---------- PET READING ----------
const PET_READING = [];

// ---------- PET LISTENING ----------
const PET_LISTENING = [];

// ---------- FCE WRITING ----------
const FCE_WRITING = [];

// ---------- FCE READING ----------
const FCE_READING = [];

// ---------- FCE LISTENING ----------
const FCE_LISTENING = [];

// ---------- IELTS WRITING (thêm ngoài đề mẫu ban đầu) ----------
const IELTS_WRITING_EXTRA = [];

// ---------- IELTS READING ----------
const IELTS_READING = [];

// ---------- IELTS LISTENING ----------
const IELTS_LISTENING = [];

// ---------- APTIS WRITING ----------
const APTIS_WRITING = [];

// ---------- APTIS READING ----------
const APTIS_READING = [];

// ---------- APTIS LISTENING ----------
const APTIS_LISTENING = [];

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

// ===== Migration: xóa đề hệ thống tự thêm không được yêu cầu =====
db.exec(`CREATE TABLE IF NOT EXISTS migrations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE NOT NULL,
  run_at TEXT NOT NULL DEFAULT (datetime('now'))
)`);

const TITLES_TO_DELETE = [
  // KET Writing Part 2 — câu chuyện (không phải tranh)
  'KET Writing Part 2 — Câu chuyện: một ngày ở biển',
  'KET Writing Part 2 — Câu chuyện: bất ngờ sau cánh cửa',
  'KET Writing Part 2 — Câu chuyện: buổi sáng trời mưa',
  // KET Reading
  'KET Reading Part 4 — Life on a Houseboat',
  'KET Reading Part 4 — My Favourite Sport: Swimming',
  'KET Reading Part 4 — Westfield City Library',
  // KET Listening
  'KET Listening Part 1 — Short Dialogues (5 conversations)',
  'KET Listening Part 2 — School Trip Announcement',
  // PET Writing
  'PET Writing Part 1 — Email: Chuyến đi cắm trại cuối tuần',
  'PET Writing Part 1 — Email: Kế hoạch làm dự án nhóm',
  'PET Writing Part 2 — Article: My favourite way to relax',
  'PET Writing Part 2 — Story: The unexpected visitor',
  // PET Reading
  'PET Reading Part 4 — The History of the Internet',
  'PET Reading Part 4 — Why People Choose to Go Vegetarian',
  'PET Reading Part 5 — Technology in the Classroom',
  // PET Listening
  'PET Listening Part 1 — Multiple choice: Short extracts',
  'PET Listening Part 4 — Interview with a young musician',
  // FCE Writing
  'FCE Writing Part 1 — Essay: The benefits of social media',
  'FCE Writing Part 1 — Essay: Living in cities vs the countryside',
  'FCE Writing Part 2 — Article: A memorable journey',
  'FCE Writing Part 2 — Review: A book that changed your life',
  // FCE Reading
  'FCE Reading Part 5 — The Art of Forgetting',
  'FCE Reading Part 5 — Urban Beekeeping: A Growing Trend',
  // FCE Listening
  'FCE Listening Part 1 — Multiple choice: Short extracts',
  'FCE Listening Part 3 — Multiple matching: People talk about hobbies',
  // IELTS Writing
  'IELTS Writing Task 1 — Bar Chart: Leisure Activities by Age Group',
  'IELTS Writing Task 2 — Online learning vs traditional education',
  'IELTS Writing Task 2 — Traffic congestion in cities',
  // IELTS Reading
  'IELTS Reading — Passage 1: The Science of Sleep',
  'IELTS Reading — Passage 2: The Rise of Vertical Farming',
  // IELTS Listening
  'IELTS Listening Section 1 — Sports centre membership enquiry',
  'IELTS Listening Section 3 — University research project discussion',
  // APTIS Writing
  'APTIS Writing Component 1 — Short answers about yourself',
  "APTIS Writing Component 2 — Reply to a friend's email",
  'APTIS Writing Component 4 — Essay: The importance of lifelong learning',
  // APTIS Reading
  'APTIS Reading Part 1 — Word meaning matching',
  'APTIS Reading Part 4 — Remote Work and Productivity',
  // APTIS Listening
  'APTIS Listening Part 1 — Short extracts: Multiple choice',
];

const migKey = 'cleanup_preset_exercises_v1';
const migDone = db.prepare('SELECT id FROM migrations WHERE name=?').get(migKey);
if (!migDone) {
  const del = db.prepare('DELETE FROM exercises WHERE title=?');
  TITLES_TO_DELETE.forEach(t => del.run(t));
  db.prepare('INSERT INTO migrations (name) VALUES (?)').run(migKey);
  console.log('✓ Migration cleanup_preset_exercises_v1: đã xóa đề không được yêu cầu');
}

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
module.exports = { db, hashPassword, verifyPassword, now };
