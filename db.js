// Cơ sở dữ liệu + xác thực mật khẩu — dùng SQLite tích hợp sẵn của Node
const { DatabaseSync } = require('node:sqlite');
const crypto = require('crypto');
const path = require('path');

// Trên Railway dữ liệu cần nằm ở ổ đĩa bền vững (đặt qua biến DATA_DIR=/data).
// Chạy local thì lưu ngay trong thư mục dự án.
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

// ===== Migration: thêm cột cho database đã tạo từ trước (Railway) =====
const userCols = db.prepare('PRAGMA table_info(users)').all().map(c => c.name);
if (!userCols.includes('email_verified')) db.exec('ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0');
if (!userCols.includes('verify_token')) db.exec('ALTER TABLE users ADD COLUMN verify_token TEXT');
const subCols = db.prepare('PRAGMA table_info(submissions)').all().map(c => c.name);
if (!subCols.includes('feedback')) db.exec('ALTER TABLE submissions ADD COLUMN feedback TEXT');

// ===== Băm & kiểm tra mật khẩu (scrypt, an toàn, không cần thư viện ngoài) =====
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

// ===== Tạo dữ liệu ban đầu (admin, giáo viên Tom, vài đề mẫu) =====
function seed() {
  const count = db.prepare('SELECT COUNT(*) AS c FROM users').get().c;
  if (count > 0) return;

  const insUser = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,created_at) VALUES (?,?,?,?,1,?)');
  insUser.run('Quản trị viên', 'admin@ewt.vn', hashPassword('Admin@123'), 'admin', now());
  const tom = insUser.run('Thầy Tom', 'tom@ewt.vn', hashPassword('Tom@1234'), 'teacher', now());
  const teacherId = Number(tom.lastInsertRowid);

  const insEx = db.prepare(
    'INSERT INTO exercises (program,skill,title,content,answer_key,auto_grade,created_by,created_at) VALUES (?,?,?,?,?,?,?,?)'
  );
  insEx.run('IELTS', 'Reading', 'IELTS Reading — Test 3 (The History of Tea)',
    'Đọc đoạn văn về lịch sử trà và chọn đáp án đúng cho 4 câu hỏi.',
    JSON.stringify(['B', 'C', 'A', 'B']), 1, teacherId, now());
  insEx.run('IELTS', 'Listening', 'IELTS Listening — Test 2',
    'Nghe và chọn đáp án đúng.',
    JSON.stringify(['A', 'C', 'B', 'A', 'B']), 1, teacherId, now());
  insEx.run('IELTS', 'Writing', 'IELTS Writing Task 2 — Chủ đề Môi trường',
    'Viết bài luận tối thiểu 250 từ về chủ đề bảo vệ môi trường.',
    null, 0, teacherId, now());
  insEx.run('PET', 'Reading', 'PET Reading — Part 4',
    'Đọc và chọn đáp án đúng.',
    JSON.stringify(['B', 'A', 'C', 'B', 'A']), 1, teacherId, now());

  console.log('✓ Đã tạo dữ liệu ban đầu (admin@ewt.vn / tom@ewt.vn + 4 đề mẫu)');
}
seed();

module.exports = { db, hashPassword, verifyPassword, now };
