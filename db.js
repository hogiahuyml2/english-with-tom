// Cơ sở dữ liệu + xác thực mật khẩu — dùng SQLite tích hợp sẵn của Node
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');

const DATA_DIR = process.env.DATA_DIR || __dirname;
const DB_PATH  = path.join(DATA_DIR, 'data.db');

// Xoá WAL/SHM rác (không block nếu fail)
for (const ext of ['-wal', '-shm']) {
  try {
    const f = DB_PATH + ext;
    if (fs.existsSync(f)) { fs.unlinkSync(f); console.log('[DB] Removed', f); }
  } catch (e) { console.warn('[DB] Cannot remove stale file:', e.message); }
}

// Mở DB — nếu thất bại, dùng :memory: để server vẫn khởi động được
let db;
let dbPath = DB_PATH;
try {
  db = new DatabaseSync(DB_PATH);
  console.log('[DB] Opened:', DB_PATH);
} catch (e) {
  console.error('[DB] CRITICAL: Cannot open', DB_PATH, '—', e.message);
  console.error('[DB] Falling back to in-memory DB. DATA WILL NOT PERSIST ACROSS RESTARTS.');
  db = new DatabaseSync(':memory:');
  dbPath = ':memory:';
}

// Pragmas connection-level (không cần ghi vào DB file)
const PRAGMAS = [
  'PRAGMA busy_timeout=5000',
  'PRAGMA synchronous=NORMAL',
  'PRAGMA cache_size=-8000',
  'PRAGMA temp_store=MEMORY',
];
for (const p of PRAGMAS) {
  try { db.exec(p); }
  catch (e) { console.warn('[DB] PRAGMA failed:', p, e.message); }
}

// Khởi tạo schema — bọc trong try/catch để server không crash nếu một lệnh nào đó bị treo
function tryExec(sql, label) {
  try { db.exec(sql); }
  catch (e) { console.error('[DB] Schema error (' + label + '):', e.message); }
}

tryExec(`
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
CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  read_at TEXT
);
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
CREATE TABLE IF NOT EXISTS notifications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link TEXT,
  read_at TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
`, 'create tables');

// Migrations — mỗi cái trong try/catch riêng
function safeAlter(check, alter) {
  try {
    const cols = db.prepare(check).all().map(c => c.name);
    for (const [col, sql] of alter) {
      if (!cols.includes(col)) {
        try { db.exec(sql); console.log('[DB] Migration:', sql.slice(0, 60)); }
        catch (e) { console.warn('[DB] Migration failed:', e.message); }
      }
    }
  } catch (e) { console.warn('[DB] Migration check failed:', e.message); }
}

safeAlter('PRAGMA table_info(users)', [
  ['email_verified',    'ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0'],
  ['verify_token',      'ALTER TABLE users ADD COLUMN verify_token TEXT'],
  ['reset_token',       'ALTER TABLE users ADD COLUMN reset_token TEXT'],
  ['reset_token_expiry','ALTER TABLE users ADD COLUMN reset_token_expiry TEXT'],
  ['verify_token_expiry','ALTER TABLE users ADD COLUMN verify_token_expiry TEXT'],
  ['reset_code_hash',   'ALTER TABLE users ADD COLUMN reset_code_hash TEXT'],
  ['reset_code_expiry', 'ALTER TABLE users ADD COLUMN reset_code_expiry TEXT'],
  ['reset_code_tries',  'ALTER TABLE users ADD COLUMN reset_code_tries INTEGER NOT NULL DEFAULT 0'],
  ['avatar',           'ALTER TABLE users ADD COLUMN avatar TEXT'], // cấu hình nhân vật (JSON) — xem js/avatar.js
  ['auto_remind',      'ALTER TABLE users ADD COLUMN auto_remind INTEGER NOT NULL DEFAULT 1'], // giáo viên: 1 = tự động nhắc học sinh về bài mình giao
  ['class_choice',      'ALTER TABLE users ADD COLUMN class_choice TEXT'], // NULL = chưa chọn · free = xác nhận tự do · class = đã chọn lớp
]);

// Nhật ký gửi email — để quản trị viên biết vì sao email lỗi (hết hạn mức, sai khóa API, chưa xác minh người gửi...)
tryExec(`
CREATE TABLE IF NOT EXISTS email_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  to_email TEXT,
  subject TEXT,
  ok INTEGER NOT NULL DEFAULT 0,
  status INTEGER,
  detail TEXT,
  created_at TEXT NOT NULL
)`, 'email_log');

safeAlter('PRAGMA table_info(submissions)', [
  ['feedback', 'ALTER TABLE submissions ADD COLUMN feedback TEXT'],
]);

safeAlter('PRAGMA table_info(exercises)', [
  ['questions',  'ALTER TABLE exercises ADD COLUMN questions TEXT'],
  ['image_url',  'ALTER TABLE exercises ADD COLUMN image_url TEXT'],
  ['audio_url',  'ALTER TABLE exercises ADD COLUMN audio_url TEXT'],
  ['is_private', 'ALTER TABLE exercises ADD COLUMN is_private INTEGER NOT NULL DEFAULT 0'],
  ['task_type',  'ALTER TABLE exercises ADD COLUMN task_type TEXT'],
  ['metadata',   'ALTER TABLE exercises ADD COLUMN metadata TEXT'],
]);

// Ghi nhớ bài đã giao cho CẢ LỚP (để học sinh vào lớp sau vẫn nhận được bài còn hạn)
tryExec(`
CREATE TABLE IF NOT EXISTS group_assignments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  assigned_by INTEGER NOT NULL,
  deadline TEXT,
  note TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(group_id, exercise_id)
)`, 'group_assignments');

// Lớp cho học sinh tự chọn trong Hồ sơ (self_join) + nguồn thêm thành viên (teacher | self | invite)
tryExec(`
CREATE TABLE IF NOT EXISTS notebook_state (
  user_id INTEGER NOT NULL,
  key TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  tries INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (user_id, key)
);
CREATE TABLE IF NOT EXISTS achievements (
  user_id INTEGER NOT NULL,
  key TEXT NOT NULL,
  tier INTEGER NOT NULL,
  unlocked_at TEXT NOT NULL,
  seen INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, key, tier)
);
`, 'notebook + achievements');
tryExec(`
CREATE TABLE IF NOT EXISTS dictation_runs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  level TEXT NOT NULL,
  kind TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'dictate',
  items TEXT NOT NULL,
  created_at TEXT NOT NULL,
  finished_at TEXT,
  score INTEGER
);
CREATE INDEX IF NOT EXISTS idx_dictation_runs_user ON dictation_runs(user_id, id);
CREATE TABLE IF NOT EXISTS dictation_seen (
  user_id INTEGER NOT NULL,
  item_id TEXT NOT NULL,
  times INTEGER NOT NULL DEFAULT 0,
  best INTEGER,
  last_at TEXT,
  PRIMARY KEY (user_id, item_id)
);
`, 'dictation tables');
safeAlter('PRAGMA table_info(group_assignments)', [
  ['strict',     'ALTER TABLE group_assignments ADD COLUMN strict INTEGER NOT NULL DEFAULT 0'],
  ['max_leaves', 'ALTER TABLE group_assignments ADD COLUMN max_leaves INTEGER NOT NULL DEFAULT 3'],
]);
tryExec(`
CREATE TABLE IF NOT EXISTS exam_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  type TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_exam_events_ue ON exam_events(user_id, exercise_id);
`, 'exam_events');
safeAlter('PRAGMA table_info(groups)', [
  ['self_join', 'ALTER TABLE groups ADD COLUMN self_join INTEGER NOT NULL DEFAULT 0'],
]);
safeAlter('PRAGMA table_info(groups)', [
  ['lb_on',          'ALTER TABLE groups ADD COLUMN lb_on INTEGER NOT NULL DEFAULT 0'],   // 1 = học sinh trong lớp xem được bảng xếp hạng lớp
  ['lb_anon',        'ALTER TABLE groups ADD COLUMN lb_anon INTEGER NOT NULL DEFAULT 0'], // 1 = ẩn tên các bạn khác (chỉ thấy tên mình)
  ['needs_approval', 'ALTER TABLE groups ADD COLUMN needs_approval INTEGER NOT NULL DEFAULT 0'], // 1 = học sinh tự chọn lớp phải chờ giáo viên duyệt
]);
tryExec(`
CREATE TABLE IF NOT EXISTS group_join_requests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  created_at TEXT NOT NULL,
  UNIQUE(group_id, user_id)
);
CREATE TABLE IF NOT EXISTS saved_filters (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  page TEXT NOT NULL,
  name TEXT NOT NULL,
  data TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_saved_filters_user ON saved_filters(user_id, page);
`, 'join requests + saved filters');
safeAlter('PRAGMA table_info(group_members)', [
  ['source', "ALTER TABLE group_members ADD COLUMN source TEXT NOT NULL DEFAULT 'teacher'"],
]);

safeAlter('PRAGMA table_info(assignments)', [
  ['group_id',      'ALTER TABLE assignments ADD COLUMN group_id INTEGER'],
  ['reminder_sent', 'ALTER TABLE assignments ADD COLUMN reminder_sent INTEGER NOT NULL DEFAULT 0'],
  ['strict',        'ALTER TABLE assignments ADD COLUMN strict INTEGER NOT NULL DEFAULT 0'],     // 1 = chế độ thi (chống gian lận)
  ['max_leaves',    'ALTER TABLE assignments ADD COLUMN max_leaves INTEGER NOT NULL DEFAULT 3'], // số lần được rời trang trước khi tự nộp
  ['overdue_sent',  'ALTER TABLE assignments ADD COLUMN overdue_sent INTEGER NOT NULL DEFAULT 0'], // đã nhắc sau khi quá hạn
]);

// Indexes — trong 1 try/catch, không critical nếu fail
tryExec(`
CREATE INDEX IF NOT EXISTS idx_messages_thread   ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id, read_at);
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
CREATE INDEX IF NOT EXISTS idx_notifications_user    ON notifications(user_id, read_at);
`, 'indexes');

// ── Góc Từ Vựng: kho từ + tiến độ ôn tập ngắt quãng + XP/chuỗi ngày/nhiệm vụ/huy hiệu ──
// Chỉ THÊM bảng mới (IF NOT EXISTS) — không đụng tới dữ liệu cũ.
tryExec(`
CREATE TABLE IF NOT EXISTS vocab_words (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL,
  topic TEXT NOT NULL,
  word TEXT NOT NULL,
  pos TEXT,
  meaning_vi TEXT NOT NULL,
  example_en TEXT,
  example_vi TEXT,
  created_by INTEGER,
  created_at TEXT NOT NULL,
  UNIQUE(level, word)
);
CREATE TABLE IF NOT EXISTS word_progress (
  user_id INTEGER NOT NULL,
  word_id INTEGER NOT NULL,
  box INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  wrong INTEGER NOT NULL DEFAULT 0,
  last_seen TEXT,
  due_day TEXT,
  hit_day TEXT,
  hit_n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, word_id)
);
CREATE TABLE IF NOT EXISTS word_game (
  user_id INTEGER PRIMARY KEY,
  xp INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  streak INTEGER NOT NULL DEFAULT 0,
  best_streak INTEGER NOT NULL DEFAULT 0,
  last_day TEXT,
  freezes INTEGER NOT NULL DEFAULT 0,
  total_reviews INTEGER NOT NULL DEFAULT 0,
  sessions INTEGER NOT NULL DEFAULT 0,
  best_combo INTEGER NOT NULL DEFAULT 0,
  quests_done INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS word_daily (
  user_id INTEGER NOT NULL,
  day TEXT NOT NULL,
  xp INTEGER NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  new_words INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  sessions INTEGER NOT NULL DEFAULT 0,
  modes TEXT NOT NULL DEFAULT '{}',
  best_combo INTEGER NOT NULL DEFAULT 0,
  claimed TEXT NOT NULL DEFAULT '',
  PRIMARY KEY (user_id, day)
);
CREATE TABLE IF NOT EXISTS word_badges (
  user_id INTEGER NOT NULL,
  badge_id TEXT NOT NULL,
  earned_at TEXT NOT NULL,
  PRIMARY KEY (user_id, badge_id)
);
CREATE TABLE IF NOT EXISTS word_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  word_ids TEXT NOT NULL,
  deadline TEXT,
  note TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS word_set_assign (
  set_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  assigned_at TEXT NOT NULL,
  reminded INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (set_id, user_id)
);
CREATE TABLE IF NOT EXISTS word_dialogues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level TEXT NOT NULL,
  title TEXT NOT NULL,
  scene TEXT,
  script TEXT NOT NULL,
  blanks INTEGER NOT NULL DEFAULT 0,
  created_by INTEGER,
  created_at TEXT NOT NULL,
  UNIQUE(level, title)
);
CREATE TABLE IF NOT EXISTS word_dialog_progress (
  user_id INTEGER NOT NULL,
  dialogue_id INTEGER NOT NULL,
  best INTEGER NOT NULL DEFAULT 0,
  plays INTEGER NOT NULL DEFAULT 0,
  last_day TEXT,
  day_n INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, dialogue_id)
);
CREATE TABLE IF NOT EXISTS word_inventory (
  user_id INTEGER NOT NULL,
  item_id TEXT NOT NULL,
  acquired_at TEXT NOT NULL,
  PRIMARY KEY (user_id, item_id)
);
CREATE TABLE IF NOT EXISTS lesson_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  cards TEXT NOT NULL,
  questions TEXT NOT NULL,
  deadline TEXT,
  note TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS lesson_assign (
  set_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  assigned_at TEXT NOT NULL,
  PRIMARY KEY (set_id, user_id)
);
CREATE TABLE IF NOT EXISTS lesson_results (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  set_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers TEXT NOT NULL,
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_lesson_assign_user ON lesson_assign(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_results_set ON lesson_results(set_id, user_id);
CREATE INDEX IF NOT EXISTS idx_wsa_user ON word_set_assign(user_id);
CREATE INDEX IF NOT EXISTS idx_vocab_level_topic ON vocab_words(level, topic);
CREATE INDEX IF NOT EXISTS idx_word_progress_user ON word_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_word_daily_day ON word_daily(day);
`, 'word game tables');

// Thời gian học của học sinh theo từng bộ từ (cộng dồn theo ngày, giờ Việt Nam)
tryExec(`
CREATE TABLE IF NOT EXISTS lesson_time (
  set_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  day TEXT NOT NULL,
  seconds INTEGER NOT NULL DEFAULT 0,
  opens INTEGER NOT NULL DEFAULT 0,
  last_at TEXT,
  PRIMARY KEY (set_id, user_id, day)
);
CREATE INDEX IF NOT EXISTS idx_lesson_time_user ON lesson_time(user_id);
`, 'lesson_time');

// Đoán từ mỗi ngày (kiểu Wordle): mỗi học sinh 1 dòng/ngày
tryExec(`
CREATE TABLE IF NOT EXISTS word_wordle (
  user_id INTEGER NOT NULL,
  day TEXT NOT NULL,
  word_id INTEGER NOT NULL,
  guesses TEXT NOT NULL DEFAULT '[]',
  done INTEGER NOT NULL DEFAULT 0,
  win INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, day)
)`, 'word_wordle');

// Thống kê trò chơi (huy hiệu), điểm xếp hạng tuần, người thắng tuần và trận đấu 1-1
tryExec(`
CREATE TABLE IF NOT EXISTS arcade_stats (
  user_id INTEGER NOT NULL,
  mode TEXT NOT NULL,
  ok INTEGER NOT NULL DEFAULT 0,
  n INTEGER NOT NULL DEFAULT 0,
  plays INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id, mode)
);
CREATE TABLE IF NOT EXISTS arcade_weekly (
  week TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  plays INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (week, user_id)
);
CREATE TABLE IF NOT EXISTS arcade_week_winners (
  week TEXT NOT NULL,
  rank INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  points INTEGER NOT NULL DEFAULT 0,
  coins INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (week, rank)
);
CREATE TABLE IF NOT EXISTS word_duels (
  code TEXT PRIMARY KEY,
  host_id INTEGER NOT NULL,
  guest_id INTEGER,
  level TEXT NOT NULL DEFAULT 'all',
  status TEXT NOT NULL DEFAULT 'waiting',
  questions TEXT NOT NULL,
  start_at INTEGER,
  host_ans TEXT NOT NULL DEFAULT '[]',
  guest_ans TEXT NOT NULL DEFAULT '[]',
  winner_id INTEGER,
  result TEXT,
  created_at INTEGER NOT NULL,
  finished_day TEXT
);
CREATE INDEX IF NOT EXISTS idx_duel_host ON word_duels(host_id, status);
CREATE INDEX IF NOT EXISTS idx_duel_guest ON word_duels(guest_id, status);
CREATE INDEX IF NOT EXISTS idx_arcade_week ON arcade_weekly(week, points);
`, 'arcade tables');

// Đề trắc nghiệm (giáo viên tải file Word → giao cho học sinh làm có đếm ngược, theo dõi chuyển tab)
tryExec(`
CREATE TABLE IF NOT EXISTS mcq_tests (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  teacher_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  note TEXT,
  questions TEXT NOT NULL,
  duration_min INTEGER NOT NULL DEFAULT 0,
  max_leaves INTEGER NOT NULL DEFAULT 3,
  shuffle_q INTEGER NOT NULL DEFAULT 1,
  shuffle_o INTEGER NOT NULL DEFAULT 1,
  reveal INTEGER NOT NULL DEFAULT 0,
  deadline TEXT,
  source_name TEXT,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS mcq_assign (
  test_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  assigned_at TEXT NOT NULL,
  PRIMARY KEY (test_id, user_id)
);
CREATE TABLE IF NOT EXISTS mcq_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  test_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  started_at INTEGER NOT NULL,
  ends_at INTEGER NOT NULL DEFAULT 0,
  finished_at INTEGER,
  perm TEXT NOT NULL,
  answers TEXT NOT NULL DEFAULT '[]',
  score INTEGER,
  total INTEGER,
  leaves INTEGER NOT NULL DEFAULT 0,
  leave_log TEXT NOT NULL DEFAULT '[]',
  away_ms INTEGER NOT NULL DEFAULT 0,
  last_leave_at INTEGER,
  auto_submit TEXT,
  voided INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_mcq_assign_user ON mcq_assign(user_id);
CREATE INDEX IF NOT EXISTS idx_mcq_att ON mcq_attempts(test_id, user_id);
`, 'mcq tables');

// Mở rộng kho từ: loại mục (word / colloc / upgrade) + các trường phụ
safeAlter('PRAGMA table_info(vocab_words)', [
  ['kind',          "ALTER TABLE vocab_words ADD COLUMN kind TEXT NOT NULL DEFAULT 'word'"],
  ['basic',         'ALTER TABLE vocab_words ADD COLUMN basic TEXT'],
  ['extra',         'ALTER TABLE vocab_words ADD COLUMN extra TEXT'],
  ['example_basic', 'ALTER TABLE vocab_words ADD COLUMN example_basic TEXT'],
]);

safeAlter('PRAGMA table_info(word_game)', [
  ['reminded_day', 'ALTER TABLE word_game ADD COLUMN reminded_day TEXT'],
  ['avatar',       'ALTER TABLE word_game ADD COLUMN avatar TEXT'],
  ['frame',        'ALTER TABLE word_game ADD COLUMN frame TEXT'],
  ['boss_wins',    'ALTER TABLE word_game ADD COLUMN boss_wins INTEGER NOT NULL DEFAULT 0'],
  ['chests',       'ALTER TABLE word_game ADD COLUMN chests INTEGER NOT NULL DEFAULT 0'],
]);

console.log('[DB] Init complete. DB path:', dbPath);

// ===== Tiện ích mật khẩu =====
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return salt + ':' + hash;
}

function verifyPassword(password, stored) {
  try {
    const [salt, hash] = stored.split(':');
    return crypto.timingSafeEqual(
      Buffer.from(hash, 'hex'),
      crypto.scryptSync(password, salt, 64)
    );
  } catch { return false; }
}

// Kiểm tra đầu vào (placement): trạng thái từng câu trong ngân hàng + các lượt làm bài
tryExec(`
CREATE TABLE IF NOT EXISTS placement_items (
  id TEXT PRIMARY KEY,
  enabled INTEGER NOT NULL DEFAULT 1,
  reviewed INTEGER NOT NULL DEFAULT 0,
  note TEXT,
  lv_override TEXT,
  key_override TEXT,
  shown INTEGER NOT NULL DEFAULT 0,
  correct INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT
);
CREATE TABLE IF NOT EXISTS placement_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'in_progress',
  created_at INTEGER NOT NULL,
  finished_at INTEGER,
  form TEXT NOT NULL,
  answers TEXT NOT NULL DEFAULT '{}',
  sec_state TEXT NOT NULL DEFAULT '{}',
  plays TEXT NOT NULL DEFAULT '{}',
  writing TEXT NOT NULL DEFAULT '{}',
  result TEXT,
  voided INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX IF NOT EXISTS idx_placement_att_user ON placement_attempts(user_id, id);
`, 'placement tables');

// Bản bất đồng bộ — scrypt chạy ở thread phụ, KHÔNG chặn vòng lặp sự kiện (bản Sync mất ~60ms mỗi lần,
// bị gọi dồn dập sẽ làm cả website đứng). Có hạn mức hàng đợi để không bị dồn ứ.
let _hashQueue = 0;
const HASH_QUEUE_MAX = 64;
function scryptAsync(password, salt) {
  if (_hashQueue >= HASH_QUEUE_MAX) {
    const e = new Error('busy'); e.code = 'BUSY'; return Promise.reject(e);
  }
  _hashQueue++;
  return new Promise((resolve, reject) => {
    crypto.scrypt(String(password), salt, 64, (err, key) => { _hashQueue--; err ? reject(err) : resolve(key); });
  });
}
async function hashPasswordAsync(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const key = await scryptAsync(password, salt);
  return salt + ':' + key.toString('hex');
}
async function verifyPasswordAsync(password, stored) {
  try {
    const [salt, hash] = String(stored).split(':');
    const key = await scryptAsync(password, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), key);
  } catch (e) { if (e && e.code === 'BUSY') throw e; return false; }
}

// Báo cáo tuần cho phụ huynh: email phụ huynh + bật/tắt + lời nhắn của giáo viên (xoá sau khi gửi) + mã huỷ đăng ký
safeAlter('PRAGMA table_info(users)', [
  ['parent_email',  'ALTER TABLE users ADD COLUMN parent_email TEXT'],
  ['parent_name',   'ALTER TABLE users ADD COLUMN parent_name TEXT'],
  ['parent_report', 'ALTER TABLE users ADD COLUMN parent_report INTEGER NOT NULL DEFAULT 0'],
  ['parent_note',   'ALTER TABLE users ADD COLUMN parent_note TEXT'],
  ['parent_token',  'ALTER TABLE users ADD COLUMN parent_token TEXT'],
  ['parent_unsub_at','ALTER TABLE users ADD COLUMN parent_unsub_at TEXT'],
]);
tryExec(`
CREATE TABLE IF NOT EXISTS parent_reports (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  to_email TEXT NOT NULL,
  kind TEXT NOT NULL DEFAULT 'auto',
  ok INTEGER NOT NULL DEFAULT 1,
  sent_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_parent_reports_user ON parent_reports(user_id, id);
`, 'parent_reports');

function now() { return new Date().toISOString(); }

module.exports = { db, hashPassword, verifyPassword, hashPasswordAsync, verifyPasswordAsync, now };
