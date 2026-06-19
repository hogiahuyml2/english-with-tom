// Máy chủ web English With Tom — Giai đoạn 2: đăng nhập, phân quyền, lưu bài
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { db, hashPassword, verifyPassword, now } = require('./db');
const { aiEnabled, gradeWriting, provider } = require('./ai');

const app = express();
app.set('trust proxy', true); // chạy sau proxy của Railway (để lấy đúng https)
app.use(express.json());

// ===== Tải file ảnh/âm thanh — lưu trên ổ đĩa bền vững (/data/uploads trên Railway) =====
const DATA_DIR = process.env.DATA_DIR || __dirname;
const uploadsDir = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    filename: (req, file, cb) => {
      const ext = (path.extname(file.originalname) || '').slice(0, 8).replace(/[^.a-zA-Z0-9]/g, '');
      cb(null, crypto.randomBytes(12).toString('hex') + ext);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // tối đa 20MB
  fileFilter: (req, file, cb) => {
    if (/^(image|audio)\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Chỉ chấp nhận tệp ảnh hoặc âm thanh.'));
  }
});

// URL gốc của web (để tạo redirect_uri cho Google, link xác thực email...)
function baseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol;
  return process.env.PUBLIC_URL || (proto + '://' + req.get('host'));
}

// ===== Gửi email qua Brevo (HTTP API, không cần thư viện) =====
function emailEnabled() { return !!process.env.BREVO_API_KEY && !!process.env.FROM_EMAIL; }

async function sendBrevoEmail(to, subject, htmlContent) {
  if (!emailEnabled()) return { ok: false, detail: 'Email chưa cấu hình' };
  try {
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: { 'api-key': process.env.BREVO_API_KEY, 'Content-Type': 'application/json', accept: 'application/json' },
      body: JSON.stringify({
        sender: { name: process.env.SENDER_NAME || 'English With Tom', email: process.env.FROM_EMAIL },
        to: [{ email: to.email, name: to.name }],
        subject, htmlContent
      })
    });
    if (r.ok) return { ok: true };
    const detail = await r.text();
    console.error('Brevo error', r.status, detail);
    return { ok: false, status: r.status, detail };
  } catch (e) {
    console.error('Brevo exception', e.message);
    return { ok: false, detail: e.message };
  }
}

async function sendVerificationEmail(user, link) {
  const html =
    '<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.6">' +
    '<h2 style="color:#6F58EE">Chào ' + user.name + '! 👋</h2>' +
    '<p>Cảm ơn bạn đã đăng ký <b>English With Tom</b>. Bấm nút bên dưới để xác thực email của bạn:</p>' +
    '<p style="margin:22px 0"><a href="' + link + '" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Xác thực email</a></p>' +
    '<p style="font-size:13px;color:#888">Hoặc mở liên kết: <a href="' + link + '">' + link + '</a></p>' +
    '<p style="font-size:13px;color:#888">Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email.</p>' +
    '</div>';
  return sendBrevoEmail(user, 'Xác thực email — English With Tom', html);
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
    if (s) req.user = db.prepare('SELECT id,name,email,role,email_verified FROM users WHERE id=?').get(s.user_id);
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
app.post('/api/register', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ error: 'Vui lòng nhập đủ họ tên, email và mật khẩu.' });
  if (password.length < 6) return res.status(400).json({ error: 'Mật khẩu cần tối thiểu 6 ký tự.' });
  const mail = email.toLowerCase();
  if (db.prepare('SELECT id FROM users WHERE email=?').get(mail))
    return res.status(409).json({ error: 'Email này đã được đăng ký.' });

  const needVerify = emailEnabled();
  const token = needVerify ? crypto.randomBytes(24).toString('hex') : null;
  const r = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,verify_token,created_at) VALUES (?,?,?,?,?,?,?)')
    .run(name, mail, hashPassword(password), 'student', needVerify ? 0 : 1, token, now());

  if (needVerify) await sendVerificationEmail({ name, email: mail }, baseUrl(req) + '/api/verify-email?token=' + token);
  startSession(res, Number(r.lastInsertRowid));
  res.json({ user: { id: Number(r.lastInsertRowid), name, email: mail, role: 'student' }, needVerify });
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

// ===== QUÊN MẬT KHẨU =====

// Bước 1: Gửi email chứa link reset
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Vui lòng nhập email.' });
  if (!emailEnabled()) return res.status(400).json({ error: 'Tính năng đặt lại mật khẩu yêu cầu cấu hình email. Vui lòng liên hệ quản trị viên.' });

  const u = db.prepare('SELECT * FROM users WHERE email=?').get(email.toLowerCase());
  // Luôn trả ok để không lộ thông tin tài khoản có tồn tại hay không
  if (!u || u.pass === 'google-oauth') return res.json({ ok: true });

  const token = crypto.randomBytes(24).toString('hex');
  const expiry = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // hết hạn sau 1 giờ
  db.prepare('UPDATE users SET reset_token=?, reset_token_expiry=? WHERE id=?').run(token, expiry, u.id);

  const link = baseUrl(req) + '/reset-password.html?token=' + token;
  const html =
    '<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.6">' +
    '<h2 style="color:#6F58EE">Đặt lại mật khẩu 🔑</h2>' +
    '<p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản <b>' + u.email + '</b> trên English With Tom.</p>' +
    '<p style="margin:22px 0"><a href="' + link + '" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Đặt lại mật khẩu</a></p>' +
    '<p style="font-size:13px;color:#888">Link có hiệu lực trong <b>1 giờ</b>. Sau đó bạn cần yêu cầu lại.</p>' +
    '<p style="font-size:13px;color:#888">Nếu bạn không yêu cầu điều này, hãy bỏ qua email này — tài khoản của bạn vẫn an toàn.</p>' +
    '</div>';
  await sendBrevoEmail({ email: u.email, name: u.name }, 'Đặt lại mật khẩu — English With Tom', html);
  res.json({ ok: true });
});

// Bước 2: Xác thực token và đặt mật khẩu mới
app.post('/api/reset-password', (req, res) => {
  const { token, newPassword } = req.body || {};
  if (!token || !newPassword) return res.status(400).json({ error: 'Thiếu thông tin.' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Mật khẩu mới cần tối thiểu 6 ký tự.' });

  const u = db.prepare('SELECT * FROM users WHERE reset_token=?').get(token);
  if (!u) return res.status(400).json({ error: 'Link đặt lại mật khẩu không hợp lệ hoặc đã được dùng.' });
  if (new Date(u.reset_token_expiry) < new Date())
    return res.status(400).json({ error: 'Link đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.' });

  db.prepare('UPDATE users SET pass=?, reset_token=NULL, reset_token_expiry=NULL WHERE id=?')
    .run(hashPassword(newPassword), u.id);
  res.json({ ok: true });
});

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
  res.json({ googleEnabled: !!process.env.GOOGLE_CLIENT_ID, emailEnabled: emailEnabled(), aiEnabled: aiEnabled(), aiProvider: provider() });
});

// AI chấm bài Writing (Claude)
app.post('/api/grade-writing', requireAuth, async (req, res) => {
  const { exercise_id, essay } = req.body || {};
  if (!essay || essay.trim().split(/\s+/).length < 20)
    return res.status(400).json({ error: 'Bài viết quá ngắn (tối thiểu khoảng 20 từ).' });
  const ex = db.prepare('SELECT * FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (ex.is_private && req.user.role === 'student')
    return res.status(403).json({ error: 'Đề bài riêng này do giáo viên chấm, không dùng AI.' });

  if (!aiEnabled()) {
    db.prepare('INSERT INTO submissions (user_id,exercise_id,answers,status,submitted_at) VALUES (?,?,?,?,?)')
      .run(req.user.id, exercise_id, JSON.stringify({ essay }), 'pending', now());
    return res.json({ pending: true });
  }
  try {
    const result = await gradeWriting(ex, essay);
    const r = db.prepare('INSERT INTO submissions (user_id,exercise_id,answers,status,feedback,submitted_at) VALUES (?,?,?,?,?,?)')
      .run(req.user.id, exercise_id, JSON.stringify({ essay }), 'graded', JSON.stringify(result), now());
    res.json({ id: Number(r.lastInsertRowid), result });
  } catch (e) {
    console.error('AI grading error', e.message);
    res.status(500).json({ error: 'AI chấm bài thất bại, thử lại sau.', detail: String(e.message).slice(0, 400) });
  }
});

// ===================== XÁC THỰC EMAIL =====================

// Người dùng bấm link trong email
app.get('/api/verify-email', (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect('/login.html?error=' + encodeURIComponent('Link xác thực không hợp lệ.'));
  const u = db.prepare('SELECT id FROM users WHERE verify_token=?').get(token);
  if (!u) return res.redirect('/login.html?error=' + encodeURIComponent('Link xác thực đã hết hạn hoặc không đúng.'));
  db.prepare('UPDATE users SET email_verified=1, verify_token=NULL WHERE id=?').run(u.id);
  res.redirect('/login.html?verified=1');
});

// Gửi lại email xác thực (cho người đang đăng nhập, chưa xác thực)
app.post('/api/me/resend-verification', requireAuth, async (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (u.email_verified) return res.json({ ok: true, already: true });
  if (!emailEnabled()) return res.status(400).json({ error: 'Hệ thống email chưa được cấu hình.' });
  let token = u.verify_token;
  if (!token) {
    token = crypto.randomBytes(24).toString('hex');
    db.prepare('UPDATE users SET verify_token=? WHERE id=?').run(token, u.id);
  }
  const result = await sendVerificationEmail({ name: u.name, email: u.email }, baseUrl(req) + '/api/verify-email?token=' + token);
  return result.ok ? res.json({ ok: true })
    : res.status(500).json({ error: 'Gửi email thất bại.', status: result.status, detail: result.detail });
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
  const { program, skill, private_only } = req.query;
  const isTeacher = req.user && ['teacher','admin'].includes(req.user.role);
  let sql = 'SELECT id,program,skill,title,auto_grade,is_private,created_at,(questions IS NOT NULL) AS has_questions FROM exercises';
  const cond = [], params = [];
  if (program) { cond.push('program=?'); params.push(program); }
  if (skill)   { cond.push('skill=?');   params.push(skill); }
  if (private_only === '1' && isTeacher) {
    cond.push('is_private=1'); cond.push('created_by=?'); params.push(req.user.id);
  } else if (!isTeacher) {
    cond.push('is_private=0');
  }
  if (cond.length) sql += ' WHERE ' + cond.join(' AND ');
  sql += ' ORDER BY id ASC';
  res.json({ exercises: db.prepare(sql).all(...params) });
});

app.get('/api/exercises/:id', (req, res) => {
  const ex = db.prepare('SELECT id,program,skill,title,content,questions,image_url,audio_url,auto_grade,is_private,created_at FROM exercises WHERE id=?').get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (ex.is_private) {
    if (!req.user) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
    if (!['teacher','admin'].includes(req.user.role)) {
      const ok = db.prepare('SELECT id FROM assignments WHERE exercise_id=? AND student_email=?').get(req.params.id, req.user.email);
      if (!ok) return res.status(403).json({ error: 'Đề này được giao riêng — bạn chưa được giao.' });
    }
  }
  ex.questions = ex.questions ? JSON.parse(ex.questions) : null;
  res.json({ exercise: ex });
});

// Giáo viên/Admin tải ảnh hoặc âm thanh, trả về đường dẫn để gắn vào đề
app.post('/api/upload', requireRole('teacher', 'admin'), (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: err.message });
    if (!req.file) return res.status(400).json({ error: 'Thiếu tệp.' });
    res.json({ url: '/uploads/' + req.file.filename });
  });
});

// Giáo viên/Admin tạo đề mới (Writing = AI chấm; Quiz = trắc nghiệm tự chấm)
app.post('/api/exercises', requireRole('teacher', 'admin'), (req, res) => {
  const { program, skill, title, content, type, questions, answer_key, image_url, audio_url, is_private } = req.body || {};
  if (!program || !skill || !title) return res.status(400).json({ error: 'Thiếu chương trình, kỹ năng hoặc tên đề.' });

  let key = null, qJson = null, auto = 0;
  if (type === 'quiz') {
    if (!Array.isArray(questions) || !questions.length) return res.status(400).json({ error: 'Đề trắc nghiệm cần ít nhất 1 câu hỏi.' });
    key = JSON.stringify(questions.map(q => String(q.answer || '').trim().toUpperCase()));
    qJson = JSON.stringify(questions.map(q => ({ q: q.q, options: q.options })));
    auto = 1;
  } else if (answer_key && String(answer_key).trim()) {
    // tương thích cũ: nhập đáp án bằng chuỗi phân cách dấu phẩy
    key = JSON.stringify(String(answer_key).split(',').map(s => s.trim().toUpperCase()).filter(Boolean));
    auto = 1;
  }
  const r = db.prepare('INSERT INTO exercises (program,skill,title,content,answer_key,questions,image_url,audio_url,auto_grade,is_private,created_by,created_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(program, skill, title, content || '', key, qJson, image_url || null, audio_url || null, auto, is_private ? 1 : 0, req.user.id, now());
  res.json({ id: Number(r.lastInsertRowid) });
});

// ===================== API NỘP BÀI =====================

app.post('/api/submissions', requireAuth, (req, res) => {
  const { exercise_id, answers } = req.body || {};
  const ex = db.prepare('SELECT * FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (ex.is_private && req.user.role === 'student') {
    const ok = db.prepare('SELECT id FROM assignments WHERE exercise_id=? AND student_email=?').get(exercise_id, req.user.email);
    if (!ok) return res.status(403).json({ error: 'Đề này được giao riêng — bạn chưa được giao.' });
  }

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
    SELECT s.id, s.score, s.max_score, s.status, s.feedback, s.submitted_at,
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
  const r = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,created_at) VALUES (?,?,?,?,1,?)')
    .run(name, email.toLowerCase(), hashPassword(password), 'teacher', now());
  res.json({ id: Number(r.lastInsertRowid) });
});

// Danh sách người dùng
app.get('/api/admin/users', requireRole('admin'), (req, res) => {
  const rows = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.email_verified, u.created_at,
           (SELECT COUNT(*) FROM submissions s WHERE s.user_id = u.id) AS submissions
    FROM users u ORDER BY u.id DESC`).all();
  res.json({ users: rows });
});

// Đổi vai trò
app.post('/api/admin/users/:id/role', requireRole('admin'), (req, res) => {
  const { role } = req.body || {};
  if (!['student', 'teacher', 'admin'].includes(role)) return res.status(400).json({ error: 'Vai trò không hợp lệ.' });
  const id = Number(req.params.id);
  if (id === req.user.id) return res.status(400).json({ error: 'Không thể đổi vai trò của chính bạn.' });
  db.prepare('UPDATE users SET role=? WHERE id=?').run(role, id);
  res.json({ ok: true });
});

// Xoá người dùng (kèm phiên & bài làm)
app.delete('/api/admin/users/:id', requireRole('admin'), (req, res) => {
  const id = Number(req.params.id);
  if (id === req.user.id) return res.status(400).json({ error: 'Không thể xoá chính bạn.' });
  if (!db.prepare('SELECT id FROM users WHERE id=?').get(id)) return res.status(404).json({ error: 'Không tìm thấy.' });
  db.prepare('DELETE FROM submissions WHERE user_id=?').run(id);
  db.prepare('DELETE FROM sessions WHERE user_id=?').run(id);
  db.prepare('DELETE FROM users WHERE id=?').run(id);
  res.json({ ok: true });
});

// Dọn nhanh các tài khoản test (email kết thúc bằng ewt-test.com)
app.post('/api/admin/cleanup-test', requireRole('admin'), (req, res) => {
  const ids = db.prepare("SELECT id FROM users WHERE email LIKE '%ewt-test.com'").all().map(r => r.id);
  ids.forEach(id => {
    db.prepare('DELETE FROM submissions WHERE user_id=?').run(id);
    db.prepare('DELETE FROM sessions WHERE user_id=?').run(id);
    db.prepare('DELETE FROM users WHERE id=?').run(id);
  });
  res.json({ deleted: ids.length });
});

// Xoá đề
app.delete('/api/admin/exercises/:id', requireRole('admin'), (req, res) => {
  db.prepare('DELETE FROM exercises WHERE id=?').run(Number(req.params.id));
  res.json({ ok: true });
});

// ===================== API GIAO BÀI RIÊNG =====================

// Giáo viên giao đề cho học sinh theo email
app.post('/api/assignments', requireRole('teacher','admin'), async (req, res) => {
  const { exercise_id, student_emails, deadline, note } = req.body || {};
  if (!exercise_id || !Array.isArray(student_emails) || !student_emails.length)
    return res.status(400).json({ error: 'Thiếu thông tin đề hoặc danh sách học sinh.' });
  const ex = db.prepare('SELECT id,title,is_private FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });

  const ins = db.prepare('INSERT INTO assignments (exercise_id,student_email,assigned_by,deadline,note,created_at) VALUES (?,?,?,?,?,?)');
  let count = 0;
  for (const raw of student_emails) {
    const email = raw.trim().toLowerCase();
    if (!email) continue;
    const exists = db.prepare('SELECT id FROM assignments WHERE exercise_id=? AND student_email=?').get(exercise_id, email);
    if (!exists) { ins.run(exercise_id, email, req.user.id, deadline || null, note || null, now()); count++; }
    if (emailEnabled()) {
      const u = db.prepare('SELECT name FROM users WHERE email=?').get(email);
      const dline = deadline ? `<p>⏰ Hạn nộp: <b>${deadline}</b></p>` : '';
      const noteHtml = note ? `<p>📌 Ghi chú: ${note}</p>` : '';
      const link = (process.env.PUBLIC_URL || '') + '/assigned.html';
      await sendBrevoEmail({ email, name: u ? u.name : email },
        'Bạn có bài tập mới — English With Tom',
        `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7">
          <h2 style="color:#6F58EE">📝 Thầy/Cô vừa giao bài cho bạn!</h2>
          <p>Bài tập: <b>${ex.title}</b></p>
          ${dline}${noteHtml}
          <p style="margin:22px 0"><a href="${link}" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Xem bài tập ngay</a></p>
          <p style="font-size:13px;color:#888">Đăng nhập bằng đúng email này để xem bài được giao.</p>
        </div>`
      ).catch(() => {});
    }
  }
  res.json({ ok: true, assigned: count });
});

// Học sinh xem bài tập được giao cho mình
app.get('/api/my-assignments', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT a.id, a.deadline, a.note, a.created_at AS assigned_at,
           e.id AS exercise_id, e.title, e.program, e.skill, e.is_private, e.auto_grade,
           u.name AS teacher_name,
           (SELECT COUNT(*) FROM submissions s WHERE s.exercise_id=e.id AND s.user_id=?) AS submitted
    FROM assignments a
    JOIN exercises e ON e.id = a.exercise_id
    JOIN users u ON u.id = a.assigned_by
    WHERE a.student_email = ?
    ORDER BY a.id DESC
  `).all(req.user.id, req.user.email);
  res.json({ assignments: rows });
});

// Giáo viên xem tất cả bài đã giao kèm trạng thái nộp
app.get('/api/teacher/assignments', requireRole('teacher','admin'), (req, res) => {
  const rows = db.prepare(`
    SELECT a.id, a.student_email, a.deadline, a.note, a.created_at,
           e.id AS exercise_id, e.title, e.program, e.skill,
           u.name AS student_name,
           sub.id AS sub_id, sub.status, sub.score, sub.max_score, sub.submitted_at
    FROM assignments a
    JOIN exercises e ON e.id = a.exercise_id
    LEFT JOIN users u ON u.email = a.student_email
    LEFT JOIN submissions sub ON sub.exercise_id = a.exercise_id AND sub.user_id = u.id
    WHERE a.assigned_by = ?
    ORDER BY a.id DESC
  `).all(req.user.id);
  res.json({ assignments: rows });
});

// Giáo viên xem chi tiết bài nộp của học sinh (kèm nội dung bài viết)
app.get('/api/teacher/submission/:id', requireRole('teacher','admin'), (req, res) => {
  const sub = db.prepare(`
    SELECT s.*, u.name AS student_name, u.email AS student_email,
           e.title, e.program, e.skill, e.content AS exercise_content
    FROM submissions s
    JOIN users u ON u.id = s.user_id
    JOIN exercises e ON e.id = s.exercise_id
    WHERE s.id = ?
  `).get(Number(req.params.id));
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy.' });
  res.json({ submission: sub });
});

// Giáo viên chấm thủ công bài nộp
app.post('/api/teacher/grade/:id', requireRole('teacher','admin'), (req, res) => {
  const { score, max_score, feedback } = req.body || {};
  const sub = db.prepare('SELECT id FROM submissions WHERE id=?').get(Number(req.params.id));
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy bài nộp.' });
  db.prepare('UPDATE submissions SET score=?, max_score=?, status=?, feedback=? WHERE id=?')
    .run(score ?? null, max_score ?? 10, 'graded', feedback || null, Number(req.params.id));
  res.json({ ok: true });
});

// Giáo viên xoá bài đã giao
app.delete('/api/teacher/assignments/:id', requireRole('teacher','admin'), (req, res) => {
  db.prepare('DELETE FROM assignments WHERE id=? AND assigned_by=?').run(Number(req.params.id), req.user.id);
  res.json({ ok: true });
});

// Giáo viên xoá đề do mình tạo
app.delete('/api/teacher/exercises/:id', requireRole('teacher','admin'), (req, res) => {
  db.prepare('DELETE FROM exercises WHERE id=? AND created_by=?').run(Number(req.params.id), req.user.id);
  res.json({ ok: true });
});

// Thống kê cho giáo viên
app.get('/api/teacher/stats', requireRole('teacher','admin'), (req, res) => {
  const studentCount = db.prepare("SELECT COUNT(*) AS c FROM users WHERE role='student'").get().c;
  const exerciseCount = db.prepare('SELECT COUNT(*) AS c FROM exercises WHERE created_by=?').get(req.user.id).c;
  const pendingCount = db.prepare(`
    SELECT COUNT(*) AS c FROM submissions s
    JOIN exercises e ON e.id=s.exercise_id
    WHERE e.created_by=? AND s.status='pending'
  `).get(req.user.id).c;
  res.json({ studentCount, exerciseCount, pendingCount });
});

// Admin tải về bản sao database (backup)
app.get('/api/admin/backup-db', requireRole('admin'), (req, res) => {
  const dbPath = path.join(DATA_DIR, 'data.db');
  const stamp = new Date().toISOString().slice(0,10);
  res.download(dbPath, 'ewt-backup-' + stamp + '.db', (err) => {
    if (err) res.status(500).json({ error: 'Không thể tải file backup.' });
  });
});

// ===================== TĨNH =====================
app.use(express.static(__dirname));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('English With Tom đang chạy tại cổng ' + port);
  console.log('📁 Database:', path.join(DATA_DIR, 'data.db'));
  if (DATA_DIR === __dirname)
    console.warn('⚠️  DATA_DIR chưa set — database nằm trong thư mục app, SẼ MẤT khi Railway redeploy! Hãy tạo Volume trong Railway và set DATA_DIR=/data');
  else
    console.log('✅ DATA_DIR =', DATA_DIR, '— dữ liệu an toàn qua các lần deploy');
});
