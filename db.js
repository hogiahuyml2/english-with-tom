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
]);

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

safeAlter('PRAGMA table_info(assignments)', [
  ['group_id',      'ALTER TABLE assignments ADD COLUMN group_id INTEGER'],
  ['reminder_sent', 'ALTER TABLE assignments ADD COLUMN reminder_sent INTEGER NOT NULL DEFAULT 0'],
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
`, 'indexes');

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

function now() { return new Date().toISOString(); }

module.exports = { db, hashPassword, verifyPassword, now };
