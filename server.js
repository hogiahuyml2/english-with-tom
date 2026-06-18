// Máy chủ web English With Tom — Giai đoạn 2: đăng nhập, phân quyền, lưu bài
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const { db, hashPassword, verifyPassword, now } = require('./db');

const app = express();
app.set('trust proxy', true); // chạy sau proxy của Railway (để lấy đúng https)
app.use(express.json());

// URL gốc của web (để tạo redirect_uri cho Google, link xác thực email...)
function baseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  return process.env.PUBLIC_URL || (proto + '://' + req.get('host'));
}

// ===== Phân tích cookie thủ công (không cần thư viện) =====
function parseCookies(req) {
  const out = {};
  (req.headers.cookie || '').split(';').forEach(p => {
    const i = p.indexOf('=');
    if (i > -1) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}

// ===== Middleware: gắn người dùng hiện tại vào req.user =====
app.use((req, res, next) => {
  const token = parseCookies(req).ewt_session;
  if (token) {
    const s = db.prepare('SELECT user_id FROM sessions WHERE token=?').get(token);
    if (s) req.user = db.prepare('SELECT id,name,email,role FROM users WHERE id=?').get(s.user_id);
  }
  next();
});

function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
  next();
}
function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      return res.status(403).json({ error: 'Bạn không có quyền thực hiện thao tác này.' });
    next();
  };
}
function startSession(res, userId) {
  const token = crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO sessions (token,user_id,created_at) VALUES (?,?,?)').run(token, userId, now());
  res.setHeader('Set-Cookie',
    `ewt_session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax`);
}

// ===================== API XÁC THỰC =====================

// Đăng ký — CHỈ tạo tài khoản học sinh (giáo viên do admin cấp)
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Vui lòng nhập đủ họ tên, email và mật khẩu.' });
  if (password.length < 6) return res.status(400).json({ error: 'Mật khẩu cần tối thiểu 6 ký tự.' });
  const exists = db.prepare('SELECT id FROM users WHERE email=?').get(email.toLowerCase());
  if (exists) return res.status(409).json({ error: 'Email này đã được đăng ký.' });
  const r = db.prepare('INSERT INTO users (name,email,pass,role,created_at) VALUES (?,?,?,?,?)')
    .run(name, email.toLowerCase(), hashPassword(password), 'student', now());
  startSession(res, Number(r.lastInsertRowid));
  res.json({ user: { id: Number(r.lastInsertRowid), name, email: email.toLowerCase(), role: 'student' } });
});

// Đăng nhập — học sinh và giáo viên đều dùng
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const u = db.prepare('SELECT * FROM users WHERE email=?').get((email || '').toLowerCase());
  if (!u || !verifyPassword(password || '', u.pass))
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
  startSession(res, u.id);
  res.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role } });
});

app.post('/api/logout', (req, res) => {
  const token = parseCookies(req).ewt_session;
  if (token) db.prepare('DELETE FROM sessions WHERE token=?').run(token);
  res.setHeader('Set-Cookie', 'ewt_session=; HttpOnly; Path=/; Max-Age=0');
  res.json({ ok: true });
});

app.get('/api/me', (req, res) => res.json({ user: req.user || null }));

// Đổi mật khẩu (cho người đang đăng nhập)
app.post('/api/me/change-password', requireAuth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: 'Mật khẩu mới cần tối thiểu 6 ký tự.' });
  const u = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (!verifyPassword(currentPassword || '', u.pass))
    return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng.' });
  db.prepare('UPDATE users SET pass=? WHERE id=?').run(hashPassword(newPassword), req.user.id);
  res.json({ ok: true });
});

// Cho giao diện biết tính năng nào đã bật
app.get('/api/config', (req, res) => {
  res.json({ googleEnabled: !!process.env.GOOGLE_CLIENT_ID });
});

// ===================== ĐĂNG NHẬP GOOGLE (OAuth 2.0) =====================

app.get('/api/auth/google', (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID)
    return res.redirect('/login.html?error=' + encodeURIComponent('Đăng nhập Google chưa được cấu hình.'));
  const state = crypto.randomBytes(16).toString('hex');
  res.setHeader('Set-Cookie', `ewt_oauth=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax`);
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: baseUrl(req) + '/api/auth/google/callback',
    response_type: 'code',
    scope: 'openid email profile',
    state, access_type: 'online', prompt: 'select_account'
  });
  res.redirect('https://accounts.google.com/o/oauth2/v2/auth?' + params);
});

app.get('/api/auth/google/callback', async (req, res) => {
  const fail = (m) => res.redirect('/login.html?error=' + encodeURIComponent(m));
  const { code, state } = req.query;
  if (!code || !state || state !== parseCookies(req).ewt_oauth) return fail('Xác thực Google thất bại, thử lại nhé.');
  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: baseUrl(req) + '/api/auth/google/callback', grant_type: 'authorization_code'
      })
    });
    const tok = await tokenRes.json();
    if (!tok.access_token) throw new Error('no token');
    const info = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: 'Bearer ' + tok.access_token }
    }).then(r => r.json());
    const email = (info.email || '').toLowerCase();
    if (!email) throw new Error('no email');

    let u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if (!u) {
      const r2 = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,created_at) VALUES (?,?,?,?,1,?)')
        .run(info.name || email, email, 'google-oauth', 'student', now());
      u = { id: Number(r2.lastInsertRowid) };
    } else if (!u.email_verified) {
      db.prepare('UPDATE users SET email_verified=1 WHERE id=?').run(u.id); // Google đã xác thực email
    }
    startSession(res, u.id);
    res.redirect('/dashboard.html');
  } catch (e) {
    fail('Đăng nhập Google thất bại, thử lại nhé.');
  }
});

// ===================== API ĐỀ BÀI =====================

app.get('/api/exercises', (req, res) => {
  const { program } = req.query;
  const rows = program
    ? db.prepare('SELECT id,program,skill,title,auto_grade,created_at FROM exercises WHERE program=? ORDER BY id DESC').all(program)
    : db.prepare('SELECT id,program,skill,title,auto_grade,created_at FROM exercises ORDER BY id DESC').all();
  res.json({ exercises: rows });
});

app.get('/api/exercises/:id', (req, res) => {
  const ex = db.prepare('SELECT id,program,skill,title,content,auto_grade,created_at FROM exercises WHERE id=?').get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  res.json({ exercise: ex }); // không trả đáp án cho học sinh
});

// Giáo viên/Admin tạo đề mới
app.post('/api/exercises', requireRole('teacher', 'admin'), (req, res) => {
  const { program, skill, title, content, answer_key } = req.body || {};
  if (!program || !skill || !title) return res.status(400).json({ error: 'Thiếu chương trình, kỹ năng hoặc tên đề.' });
  let key = null, auto = 0;
  if (answer_key && answer_key.trim()) {
    key = JSON.stringify(answer_key.split(',').map(s => s.trim().toUpperCase()).filter(Boolean));
    auto = 1;
  }
  const r = db.prepare('INSERT INTO exercises (program,skill,title,content,answer_key,auto_grade,created_by,created_at) VALUES (?,?,?,?,?,?,?,?)')
    .run(program, skill, title, content || '', key, auto, req.user.id, now());
  res.json({ id: Number(r.lastInsertRowid) });
});

// ===================== API NỘP BÀI =====================

app.post('/api/submissions', requireAuth, (req, res) => {
  const { exercise_id, answers } = req.body || {};
  const ex = db.prepare('SELECT * FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });

  let score = null, max = null, status = 'pending';
  if (ex.auto_grade && ex.answer_key) {
    const key = JSON.parse(ex.answer_key);
    const ans = Array.isArray(answers) ? answers : [];
    max = key.length;
    score = key.reduce((acc, k, i) => acc + ((ans[i] || '').toUpperCase() === k ? 1 : 0), 0);
    status = 'graded';
  }
  const r = db.prepare('INSERT INTO submissions (user_id,exercise_id,answers,score,max_score,status,submitted_at) VALUES (?,?,?,?,?,?,?)')
    .run(req.user.id, exercise_id, JSON.stringify(answers || []), score, max, status, now());
  res.json({ id: Number(r.lastInsertRowid), score, max_score: max, status });
});

// Lịch sử bài làm của tôi
app.get('/api/me/submissions', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT s.id, s.score, s.max_score, s.status, s.submitted_at,
           e.title, e.program, e.skill
    FROM submissions s JOIN exercises e ON e.id = s.exercise_id
    WHERE s.user_id = ? ORDER BY s.id DESC`).all(req.user.id);
  res.json({ submissions: rows });
});

// Thống kê tiến trình của tôi
app.get('/api/me/stats', requireAuth, (req, res) => {
  const subs = db.prepare('SELECT score,max_score,status FROM submissions WHERE user_id=?').all(req.user.id);
  const done = subs.length;
  const graded = subs.filter(s => s.status === 'graded').length;
  const pcts = subs.filter(s => s.status === 'graded' && s.max_score > 0).map(s => s.score / s.max_score);
  const avg = pcts.length ? Math.round((pcts.reduce((a, b) => a + b, 0) / pcts.length) * 1000) / 10 : null;
  res.json({ done, graded, avgPercent: avg });
});

// ===================== API ADMIN =====================

// Admin tạo tài khoản giáo viên
app.post('/api/admin/create-teacher', requireRole('admin'), (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Thiếu thông tin.' });
  if (db.prepare('SELECT id FROM users WHERE email=?').get(email.toLowerCase()))
    return res.status(409).json({ error: 'Email đã tồn tại.' });
  const r = db.prepare('INSERT INTO users (name,email,pass,role,created_at) VALUES (?,?,?,?,?)')
    .run(name, email.toLowerCase(), hashPassword(password), 'teacher', now());
  res.json({ id: Number(r.lastInsertRowid) });
});

// ===================== TĨNH =====================
app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log('English With Tom đang chạy tại cổng ' + port));
