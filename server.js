// Máy chủ web English With Tom — Giai đoạn 2: đăng nhập, phân quyền, lưu bài
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const webpush = require('web-push');
const { db, hashPassword, verifyPassword, now } = require('./db');
const { aiEnabled, gradeWriting, gradeAptisWriting, getWritingHints, provider } = require('./ai');

// ===== Web Push VAPID =====
// Tạo keys bằng: node -e "const wp=require('web-push');const k=wp.generateVAPIDKeys();console.log(k);"
// Rồi set VAPID_PUBLIC và VAPID_PRIVATE trong Railway environment variables
const VAPID_PUBLIC  = process.env.VAPID_PUBLIC  || '';
const VAPID_PRIVATE = process.env.VAPID_PRIVATE || '';
if (VAPID_PUBLIC && VAPID_PRIVATE) {
  webpush.setVapidDetails('mailto:' + (process.env.FROM_EMAIL || 'admin@english-with-tom.com'), VAPID_PUBLIC, VAPID_PRIVATE);
}

async function sendPushToUser(userId, title, body, url) {
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return;
  const subs = db.prepare('SELECT * FROM push_subscriptions WHERE user_id=?').all(userId);
  const payload = JSON.stringify({ title, body, url: url || '/' });
  for (const s of subs) {
    try {
      await webpush.sendNotification({ endpoint: s.endpoint, keys: { p256dh: s.p256dh, auth: s.auth } }, payload);
    } catch (e) {
      if (e.statusCode === 410 || e.statusCode === 404) {
        db.prepare('DELETE FROM push_subscriptions WHERE id=?').run(s.id);
      }
    }
  }
}

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

// Detect HTTPS — cần để set Secure flag trên cookie
function isHttps(req) {
  return (req.headers['x-forwarded-proto'] || req.protocol) === 'https';
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
function startSession(res, userId, req) {
  const token = crypto.randomBytes(24).toString('hex');
  db.prepare('INSERT INTO sessions (token,user_id,created_at) VALUES (?,?,?)').run(token, userId, now());
  const secure = req && isHttps(req) ? '; Secure' : '';
  res.setHeader('Set-Cookie',
    `ewt_session=${token}; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=Lax${secure}`);
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
  const newId = Number(r.lastInsertRowid);
  // Nếu email này đã được mời vào lớp trước khi đăng ký, tự động liên kết
  db.prepare('UPDATE group_members SET user_id=?, invited_email=NULL WHERE invited_email=?').run(newId, mail);
  startSession(res, newId, req);
  res.json({ user: { id: newId, name, email: mail, role: 'student' }, needVerify });
});

// Đăng nhập — học sinh và giáo viên đều dùng
app.post('/api/login', (req, res) => {
  const { email, password } = req.body || {};
  const u = db.prepare('SELECT * FROM users WHERE email=?').get((email || '').toLowerCase());
  if (!u || !verifyPassword(password || '', u.pass))
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
  startSession(res, u.id, req);
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

// Health check — dùng để keep-alive, tránh Railway cold start
app.get('/api/ping', (req, res) => res.json({ ok: true, t: Date.now() }));

// Cho giao diện biết tính năng nào đã bật
app.get('/api/config', (req, res) => {
  res.json({ googleEnabled: !!process.env.GOOGLE_CLIENT_ID, emailEnabled: emailEnabled(), aiEnabled: aiEnabled(), aiProvider: provider() });
});

// AI kiểm tra câu viết của học sinh (Sentence Practice)
app.post('/api/sentence-check', requireAuth, async (req, res) => {
  const { prompt_vi, student_answer, level } = req.body || {};
  if (!prompt_vi || !student_answer || !student_answer.trim())
    return res.status(400).json({ error: 'Thiếu dữ liệu.' });

  const levelLabel = { easy: 'A2 – câu đơn giản', medium: 'B1/B2 – câu ghép có liên từ', advanced: 'C1 – câu phức, câu ghép phức' }[level] || level;

  const schema = {
    type: 'OBJECT',
    properties: {
      acceptable: { type: 'BOOLEAN' },
      score:      { type: 'INTEGER' },
      feedback_vi:{ type: 'STRING' },
      errors:     { type: 'ARRAY', items: { type: 'STRING' } },
      suggestions:{ type: 'ARRAY', items: {
        type: 'OBJECT',
        properties: { text: { type: 'STRING' }, note: { type: 'STRING' } },
        required: ['text', 'note']
      }}
    },
    required: ['acceptable', 'score', 'feedback_vi', 'errors', 'suggestions']
  };

  const systemInstruction = `Bạn là giáo viên tiếng Anh đang chấm câu dịch của học sinh Việt Nam.
Cấp độ bài: ${levelLabel}

QUY TẮC QUAN TRỌNG:
• Chấp nhận MỌI cách dịch truyền đạt đúng ý nghĩa — KHÔNG yêu cầu dịch từng từ
• Đánh giá: (1) ý nghĩa có đúng không, (2) ngữ pháp, (3) từ vựng phù hợp cấp độ
• feedback_vi: nhận xét ngắn 1-2 câu, xây dựng, bằng tiếng Việt
• errors: danh sách lỗi cụ thể (rỗng nếu không có lỗi)
• suggestions: 2-3 cách diễn đạt tham khảo (từ tự nhiên đến formal), mỗi cái kèm ghi chú ngắn
• score: 0-100 (90-100 = xuất sắc, 70-89 = tốt, 50-69 = cần cải thiện, <50 = sai nghĩa/sai ngữ pháp nặng)`;

  const userText = `Câu tiếng Việt: ${prompt_vi}\nCâu tiếng Anh của học sinh: ${student_answer.trim()}`;

  try {
    const model = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
    const url   = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': process.env.GEMINI_API_KEY },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ role: 'user', parts: [{ text: userText }] }],
        generationConfig: {
          responseMimeType: 'application/json',
          responseSchema: schema,
          maxOutputTokens: 1200,
          thinkingConfig: { thinkingBudget: 0 }
        }
      })
    });
    if (!r.ok) throw new Error('Gemini ' + r.status);
    const data = await r.json();
    const text = (data?.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('');
    if (!text) throw new Error('Gemini: empty response');
    res.json(JSON.parse(text));
  } catch (err) {
    console.error('sentence-check:', err.message);
    res.status(500).json({ error: 'Không thể chấm bài lúc này, vui lòng thử lại.' });
  }
});

// AI chấm bài Writing (Claude)
app.post('/api/grade-writing', requireAuth, async (req, res) => {
  const { exercise_id, essay, student_image } = req.body || {};
  const isImageMode = !!student_image;

  // Kiểm tra đầu vào: nếu nộp ảnh thì bỏ qua word-count; nếu gõ text thì kiểm tra độ dài
  if (!isImageMode && (!essay || essay.trim().split(/\s+/).length < 20))
    return res.status(400).json({ error: 'Bài viết quá ngắn (tối thiểu khoảng 20 từ).' });
  if (isImageMode && (!student_image.base64 || !student_image.mimeType))
    return res.status(400).json({ error: 'Dữ liệu ảnh không hợp lệ.' });

  const ex = db.prepare('SELECT * FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (ex.is_private && req.user.role === 'student')
    return res.status(403).json({ error: 'Đề bài riêng này do giáo viên trực tiếp chấm.' });

  const savedAnswers = isImageMode
    ? { submission_type: 'image', image_mime: student_image.mimeType }
    : { essay };

  if (!aiEnabled()) {
    db.prepare('INSERT INTO submissions (user_id,exercise_id,answers,status,submitted_at) VALUES (?,?,?,?,?)')
      .run(req.user.id, exercise_id, JSON.stringify(savedAnswers), 'pending', now());
    return res.json({ pending: true });
  }
  try {
    const result = await gradeWriting(ex, essay || '', isImageMode ? student_image : null);
    const r = db.prepare('INSERT INTO submissions (user_id,exercise_id,answers,status,feedback,submitted_at) VALUES (?,?,?,?,?,?)')
      .run(req.user.id, exercise_id, JSON.stringify(savedAnswers), 'graded', JSON.stringify(result), now());
    res.json({ id: Number(r.lastInsertRowid), result });
  } catch (e) {
    console.error('AI grading error', e.message);
    res.status(500).json({ error: 'Chấm bài tự động thất bại, vui lòng thử lại sau.', detail: String(e.message).slice(0, 400) });
  }
});

// ===================== WRITING HINTS — gợi ý làm bài theo đề =====================

app.post('/api/writing-hints', requireAuth, async (req, res) => {
  const { exercise_id } = req.body || {};
  const ex = db.prepare('SELECT * FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (!aiEnabled()) return res.status(503).json({ error: 'Hệ thống AI chưa sẵn sàng.' });
  try {
    const hints = await getWritingHints(ex);
    res.json({ hints });
  } catch (e) {
    console.error('Writing hints error', e.message);
    res.status(500).json({ error: 'Không thể tạo gợi ý lúc này, thử lại sau.' });
  }
});

// ===================== NHẮN GIÁO VIÊN VỀ BÀI CHẤM =====================

app.post('/api/student-message', requireAuth, async (req, res) => {
  const { exercise_id, submission_id, message } = req.body || {};
  if (!message || !message.trim()) return res.status(400).json({ error: 'Nội dung không được để trống.' });
  const ex = db.prepare('SELECT e.*, u.email AS teacher_email, u.name AS teacher_name FROM exercises e LEFT JOIN users u ON u.id=e.user_id WHERE e.id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (!ex.teacher_email) return res.status(400).json({ error: 'Không tìm thấy email giáo viên.' });
  if (!emailEnabled()) return res.status(503).json({ error: 'Hệ thống email chưa được cấu hình.' });

  const student = req.user;
  const result = await sendBrevoEmail(
    ex.teacher_email,
    `[English With Tom] Học sinh ${student.name} hỏi về bài chấm — ${ex.title}`,
    `<div style="font-family:sans-serif;max-width:560px;">
      <p>Học sinh <b>${student.name}</b> (<a href="mailto:${student.email}">${student.email}</a>) có câu hỏi về bài chấm của đề: <b>${ex.title}</b>${submission_id ? ` (bài nộp #${submission_id})` : ''}.</p>
      <div style="background:#f5f5f8;padding:14px 18px;border-radius:8px;margin:14px 0;border-left:4px solid #7B6EF6;">
        <p style="margin:0;white-space:pre-wrap;font-size:15px;">${message.trim().replace(/</g,'&lt;').replace(/>/g,'&gt;')}</p>
      </div>
      <p style="color:#888;font-size:13px;">Bạn có thể trả lời trực tiếp qua email trên hoặc qua <a href="https://englishwithtom.com/teacher.html">Teacher Panel</a>.</p>
    </div>`
  );
  return result.ok ? res.json({ ok: true })
    : res.status(500).json({ error: 'Gửi tin nhắn thất bại. Thử lại sau.' });
});

// ===================== APTIS WRITING FULL TEST — chấm 4 components =====================

app.post('/api/grade-aptis-writing', requireAuth, async (req, res) => {
  const { exercise_id, answers } = req.body || {};
  if (!answers) return res.status(400).json({ error: 'Thiếu dữ liệu bài làm.' });

  const ex = db.prepare('SELECT * FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });

  let testContent;
  try {
    testContent = typeof ex.content === 'object' ? ex.content : JSON.parse(ex.content || '{}');
  } catch (e) {
    return res.status(400).json({ error: 'Nội dung đề không hợp lệ.' });
  }
  if (!testContent._aptis_full) return res.status(400).json({ error: 'Đề này không phải APTIS Full Test.' });

  // Kiểm tra học sinh có ít nhất bài viết Part 4 Task 2
  const hasContent = (answers.part4 && answers.part4.task2 && answers.part4.task2.trim().split(/\s+/).length >= 10)
    || (answers.part2 && answers.part2.trim().split(/\s+/).length >= 5);
  if (!hasContent) return res.status(400).json({ error: 'Bài viết quá ngắn. Hãy hoàn thành ít nhất Part 2 và Part 4.' });

  if (!aiEnabled()) {
    db.prepare('INSERT INTO submissions (user_id,exercise_id,answers,status,submitted_at) VALUES (?,?,?,?,?)')
      .run(req.user.id, exercise_id, JSON.stringify(answers), 'pending', now());
    return res.json({ pending: true });
  }

  try {
    const result = await gradeAptisWriting(ex, testContent, answers);
    db.prepare('INSERT INTO submissions (user_id,exercise_id,answers,status,feedback,submitted_at) VALUES (?,?,?,?,?,?)')
      .run(req.user.id, exercise_id, JSON.stringify(answers), 'graded', JSON.stringify(result), now());
    res.json({ result });
  } catch (e) {
    console.error('APTIS grading error', e.message);
    res.status(500).json({ error: 'Chấm bài tự động thất bại, vui lòng thử lại sau.', detail: String(e.message).slice(0, 400) });
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
  const secureFlag = isHttps(req) ? '; Secure' : '';
  res.setHeader('Set-Cookie', `ewt_oauth=${state}; HttpOnly; Path=/; Max-Age=600; SameSite=Lax${secureFlag}`);
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
  const { code, state, error: oauthError } = req.query;

  // Google trả về lỗi (user từ chối, tài khoản bị chặn...)
  if (oauthError) {
    console.error('[Google OAuth] Google error:', oauthError);
    return fail('Google từ chối xác thực: ' + oauthError);
  }

  const cookieState = parseCookies(req).ewt_oauth;
  if (!code || !state) return fail('Thiếu code hoặc state từ Google.');
  if (!cookieState) return fail('Phiên xác thực hết hạn, vui lòng thử lại.');
  if (state !== cookieState) return fail('Xác thực Google thất bại (state mismatch), vui lòng thử lại.');

  try {
    const callbackUrl = baseUrl(req) + '/api/auth/google/callback';
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code, client_id: process.env.GOOGLE_CLIENT_ID, client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: callbackUrl, grant_type: 'authorization_code'
      })
    });
    const tok = await tokenRes.json();
    if (!tok.access_token) {
      console.error('[Google OAuth] Token exchange failed:', JSON.stringify(tok));
      return fail('Không lấy được token Google. Lỗi: ' + (tok.error_description || tok.error || 'unknown'));
    }

    const info = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: 'Bearer ' + tok.access_token }
    }).then(r => r.json());

    const email = (info.email || '').toLowerCase();
    if (!email) {
      console.error('[Google OAuth] No email in userinfo:', JSON.stringify(info));
      return fail('Không lấy được email từ tài khoản Google.');
    }

    let u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if (!u) {
      const r2 = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,created_at) VALUES (?,?,?,?,1,?)')
        .run(info.name || email, email, 'google-oauth', 'student', now());
      u = { id: Number(r2.lastInsertRowid) };
    } else if (!u.email_verified) {
      db.prepare('UPDATE users SET email_verified=1 WHERE id=?').run(u.id);
    }
    startSession(res, u.id, req);
    res.redirect('/dashboard.html');
  } catch (e) {
    console.error('[Google OAuth] Exception:', e);
    fail('Đăng nhập Google thất bại: ' + e.message);
  }
});

// ===================== API ĐỀ BÀI =====================

app.get('/api/exercises', requireAuth, (req, res) => {
  const { program, skill, private_only, type } = req.query;
  const isTeacher = req.user && ['teacher','admin'].includes(req.user.role);
  /* Trả thêm content khi lọc aptis_full để client parse JSON metadata */
  const cols = type === 'aptis_full'
    ? 'id,program,skill,title,content,task_type,metadata,image_url,auto_grade,is_private,created_at,(questions IS NOT NULL) AS has_questions'
    : 'id,program,skill,title,task_type,metadata,image_url,auto_grade,is_private,created_at,SUBSTR(content,1,200) AS excerpt,(questions IS NOT NULL) AS has_questions';
  let sql = 'SELECT ' + cols + ' FROM exercises';
  const cond = [], params = [];
  if (program) { cond.push('program=?'); params.push(program); }
  if (skill)   { cond.push('skill=?');   params.push(skill); }
  if (type === 'aptis_full') {
    cond.push("content LIKE '%\"_aptis_full\":true%'");
  }
  if (private_only === '1' && isTeacher) {
    cond.push('is_private=1'); cond.push('created_by=?'); params.push(req.user.id);
  } else if (!isTeacher) {
    cond.push('is_private=0');
  }
  if (cond.length) sql += ' WHERE ' + cond.join(' AND ');
  sql += ' ORDER BY id ASC';
  res.json({ exercises: db.prepare(sql).all(...params) });
});

app.get('/api/exercises/:id', requireAuth, (req, res) => {
  const ex = db.prepare('SELECT id,program,skill,title,content,questions,answer_key,image_url,audio_url,task_type,metadata,auto_grade,is_private,created_at FROM exercises WHERE id=?').get(req.params.id);
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
  const { program, skill, title, content, type, questions, answer_key, image_url, audio_url, is_private, task_type, metadata } = req.body || {};
  if (!program || !skill || !title) return res.status(400).json({ error: 'Thiếu chương trình, kỹ năng hoặc tên đề.' });

  let key = null, qJson = null, auto = 0;
  if (type === 'quiz') {
    if (!Array.isArray(questions) || !questions.length) return res.status(400).json({ error: 'Đề trắc nghiệm cần ít nhất 1 câu hỏi.' });
    key = JSON.stringify(questions.map(q => String(q.answer || '').trim().toUpperCase()));
    qJson = JSON.stringify(questions.map(q => ({ q: q.q, options: q.options })));
    auto = 1;
  } else if (answer_key && String(answer_key).trim()) {
    key = JSON.stringify(String(answer_key).split(',').map(s => s.trim().toUpperCase()).filter(Boolean));
    auto = 1;
  }
  const metaJson = metadata ? JSON.stringify(metadata) : null;
  const r = db.prepare('INSERT INTO exercises (program,skill,title,content,answer_key,questions,image_url,audio_url,auto_grade,is_private,created_by,created_at,task_type,metadata) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
    .run(program, skill, title, content || '', key, qJson, image_url || null, audio_url || null, auto, is_private ? 1 : 0, req.user.id, now(), task_type || null, metaJson);
  res.json({ id: Number(r.lastInsertRowid) });
});

// Giáo viên/Admin cập nhật đề
app.put('/api/exercises/:id', requireRole('teacher', 'admin'), (req, res) => {
  const ex = db.prepare('SELECT * FROM exercises WHERE id=?').get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (req.user.role !== 'admin' && ex.created_by !== req.user.id)
    return res.status(403).json({ error: 'Bạn không có quyền sửa đề này.' });

  const { program, skill, title, content, image_url, is_private, questions, task_type, metadata } = req.body || {};
  if (!title || !title.trim()) return res.status(400).json({ error: 'Tên đề không được để trống.' });

  let qJson = ex.questions, keyJson = ex.answer_key;
  if (Array.isArray(questions) && questions.length) {
    keyJson = JSON.stringify(questions.map(q => String(q.answer || '').trim().toUpperCase()));
    qJson   = JSON.stringify(questions.map(q => ({ q: q.q, options: q.options })));
  }

  const newImg     = image_url  !== undefined ? (image_url  || null) : ex.image_url;
  const newType    = task_type  !== undefined ? (task_type  || null) : ex.task_type;
  const newMeta    = metadata   !== undefined ? (metadata ? JSON.stringify(metadata) : null) : ex.metadata;

  db.prepare(`UPDATE exercises
    SET program=?,skill=?,title=?,content=?,image_url=?,is_private=?,questions=?,answer_key=?,task_type=?,metadata=?
    WHERE id=?`)
    .run(
      program  || ex.program,
      skill    || ex.skill,
      title.trim(),
      content  ?? ex.content,
      newImg,
      is_private ? 1 : 0,
      qJson, keyJson,
      newType, newMeta,
      ex.id
    );
  res.json({ ok: true });
});

// Giáo viên/Admin xoá đề
app.delete('/api/exercises/:id', requireRole('teacher', 'admin'), (req, res) => {
  const ex = db.prepare('SELECT id,created_by FROM exercises WHERE id=?').get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (req.user.role !== 'admin' && ex.created_by !== req.user.id)
    return res.status(403).json({ error: 'Bạn không có quyền xoá đề này.' });
  db.prepare('DELETE FROM exercises WHERE id=?').run(ex.id);
  res.json({ ok: true });
});

// Bulk delete exercises (teacher xóa đề của mình; admin xóa bất kỳ)
app.post('/api/exercises/bulk-delete', requireRole('teacher', 'admin'), (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'Thiếu danh sách ids.' });
  const isAdmin = req.user.role === 'admin';
  const del = db.prepare('DELETE FROM exercises WHERE id=?' + (isAdmin ? '' : ' AND created_by=?'));
  let count = 0;
  ids.forEach(id => {
    const r = isAdmin ? del.run(Number(id)) : del.run(Number(id), req.user.id);
    count += r.changes;
  });
  res.json({ deleted: count });
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

// Lịch sử các lần nộp bài của tôi cho 1 đề cụ thể
app.get('/api/exercises/:id/my-submissions', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT s.id, s.score, s.max_score, s.status, s.feedback, s.submitted_at, s.answers
    FROM submissions s
    WHERE s.user_id = ? AND s.exercise_id = ?
    ORDER BY s.id DESC LIMIT 20
  `).all(req.user.id, req.params.id);
  res.json({ submissions: rows });
});

// Lịch sử bài làm của tôi (kèm exercise_id để link "Làm lại")
app.get('/api/me/submissions', requireAuth, (req, res) => {
  const { program, skill, limit } = req.query;
  let cond = ['s.user_id = ?'], params = [req.user.id];
  if (program) { cond.push('e.program = ?'); params.push(program); }
  if (skill)   { cond.push('e.skill = ?');   params.push(skill); }
  const lim = Math.min(parseInt(limit) || 100, 200);
  const rows = db.prepare(`
    SELECT s.id, s.exercise_id, s.score, s.max_score, s.status, s.feedback, s.submitted_at,
           e.title, e.program, e.skill
    FROM submissions s JOIN exercises e ON e.id = s.exercise_id
    WHERE ${cond.join(' AND ')} ORDER BY s.id DESC LIMIT ?
  `).all(...params, lim);
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

// Tiến độ học tập — streak, weekly trend, by-program, week comparison
app.get('/api/me/progress', requireAuth, (req, res) => {
  const userId = req.user.id;
  const MAX_SCALE = { IELTS: 9, KET: 5, PET: 5, FCE: 5, APTIS: 50 };

  const subs = db.prepare(`
    SELECT s.feedback, s.submitted_at, s.score, s.max_score, e.program
    FROM submissions s JOIN exercises e ON e.id = s.exercise_id
    WHERE s.user_id = ? AND s.status = 'graded'
    ORDER BY s.submitted_at ASC
  `).all(userId);

  function toDate(raw) {
    return new Date(raw.includes('T') ? raw : raw.replace(' ', 'T') + 'Z');
  }

  function parseScore(sub) {
    if (sub.feedback) {
      try {
        const fb = JSON.parse(sub.feedback);
        if (fb.overall_score != null) {
          const raw = parseFloat(fb.overall_score);
          const maxScale = MAX_SCALE[sub.program] || 9;
          return { raw, pct: Math.round(raw / maxScale * 100) };
        }
      } catch (e) {}
    }
    if (sub.max_score > 0) {
      const pct = Math.round(sub.score / sub.max_score * 100);
      return { raw: pct, pct };
    }
    return null;
  }

  // Unique days set
  const daySet = new Set(subs.map(s => toDate(s.submitted_at).toISOString().slice(0, 10)));

  // Streak (consecutive days backward from today)
  const today = new Date(); today.setUTCHours(0, 0, 0, 0);
  let streak = 0;
  const cur = new Date(today);
  for (let i = 0; i < 365; i++) {
    if (daySet.has(cur.toISOString().slice(0, 10))) { streak++; cur.setUTCDate(cur.getUTCDate() - 1); }
    else break;
  }

  // Last 14 calendar days (dot strip)
  const calDays = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today); d.setUTCDate(today.getUTCDate() - i);
    const ds = d.toISOString().slice(0, 10);
    calDays.push({ date: ds, active: daySet.has(ds) });
  }

  // Weekly (last 10 Mon-weeks)
  const weekMap = {};
  subs.forEach(sub => {
    const d = toDate(sub.submitted_at);
    const dow = (d.getUTCDay() + 6) % 7;
    const mon = new Date(d); mon.setUTCDate(d.getUTCDate() - dow); mon.setUTCHours(0, 0, 0, 0);
    const key = mon.toISOString().slice(0, 10);
    if (!weekMap[key]) weekMap[key] = { pcts: [], count: 0 };
    weekMap[key].count++;
    const sc = parseScore(sub);
    if (sc) weekMap[key].pcts.push(sc.pct);
  });
  const weekly = Object.keys(weekMap).sort().slice(-10).map(key => {
    const w = weekMap[key];
    const avg = w.pcts.length ? Math.round(w.pcts.reduce((a, b) => a + b, 0) / w.pcts.length) : null;
    const dt = new Date(key);
    return { week: key, label: ('0' + dt.getUTCDate()).slice(-2) + '/' + ('0' + (dt.getUTCMonth() + 1)).slice(-2), count: w.count, avg_pct: avg };
  });

  // By program
  const progMap = {};
  subs.forEach(sub => {
    const p = sub.program;
    if (!progMap[p]) progMap[p] = { raws: [], pcts: [], count: 0, best_raw: null, best_pct: null };
    progMap[p].count++;
    const sc = parseScore(sub);
    if (sc) {
      progMap[p].raws.push(sc.raw); progMap[p].pcts.push(sc.pct);
      if (progMap[p].best_raw === null || sc.raw > progMap[p].best_raw) {
        progMap[p].best_raw = sc.raw; progMap[p].best_pct = sc.pct;
      }
    }
  });
  const by_program = Object.entries(progMap).map(([program, d]) => ({
    program, count: d.count, max_scale: MAX_SCALE[program] || 9,
    avg_raw: d.raws.length ? Math.round(d.raws.reduce((a, b) => a + b, 0) / d.raws.length * 10) / 10 : null,
    avg_pct: d.pcts.length ? Math.round(d.pcts.reduce((a, b) => a + b, 0) / d.pcts.length) : null,
    best_raw: d.best_raw, best_pct: d.best_pct
  }));

  // This week vs last week
  const dow0 = (today.getUTCDay() + 6) % 7;
  const thisMon = new Date(today); thisMon.setUTCDate(today.getUTCDate() - dow0);
  const lastMon = new Date(thisMon); lastMon.setUTCDate(thisMon.getUTCDate() - 7);
  const nextMon = new Date(thisMon); nextMon.setUTCDate(thisMon.getUTCDate() + 7);

  function wkStats(from, to) {
    const f = from.toISOString().slice(0, 10), t = to.toISOString().slice(0, 10);
    const ws = subs.filter(s => { const ds = toDate(s.submitted_at).toISOString().slice(0, 10); return ds >= f && ds < t; });
    const pcts = ws.map(parseScore).filter(Boolean).map(s => s.pct);
    return { count: ws.length, avg_pct: pcts.length ? Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length) : null };
  }

  res.json({
    streak, cal_days: calDays, total_days: daySet.size,
    weekly, by_program,
    this_week: wkStats(thisMon, nextMon),
    last_week: wkStats(lastMon, thisMon)
  });
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

// Bulk delete users (admin)
app.post('/api/admin/users/bulk-delete', requireRole('admin'), (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'Thiếu danh sách ids.' });
  const filtered = ids.map(Number).filter(id => id !== req.user.id);
  let count = 0;
  filtered.forEach(id => {
    if (!db.prepare('SELECT id FROM users WHERE id=?').get(id)) return;
    db.prepare('DELETE FROM submissions WHERE user_id=?').run(id);
    db.prepare('DELETE FROM sessions WHERE user_id=?').run(id);
    db.prepare('DELETE FROM users WHERE id=?').run(id);
    count++;
  });
  res.json({ deleted: count });
});

// Bulk role change (admin)
app.post('/api/admin/users/bulk-role', requireRole('admin'), (req, res) => {
  const { ids, role } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'Thiếu danh sách ids.' });
  if (!['student','teacher','admin'].includes(role)) return res.status(400).json({ error: 'Role không hợp lệ.' });
  const upd = db.prepare('UPDATE users SET role=? WHERE id=?');
  let count = 0;
  ids.map(Number).forEach(id => { count += upd.run(role, id).changes; });
  res.json({ updated: count });
});

// Bulk delete exercises (admin)
app.post('/api/admin/exercises/bulk-delete', requireRole('admin'), (req, res) => {
  const { ids } = req.body || {};
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'Thiếu danh sách ids.' });
  let count = 0;
  ids.map(Number).forEach(id => { count += db.prepare('DELETE FROM exercises WHERE id=?').run(id).changes; });
  res.json({ deleted: count });
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
  const { exercise_id, student_emails, group_id, deadline, note } = req.body || {};
  if (!exercise_id) return res.status(400).json({ error: 'Thiếu thông tin đề.' });
  const ex = db.prepare('SELECT id,title,is_private FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });

  // Xây dựng danh sách email cần giao
  let emails = [];
  let groupName = null;
  if (group_id) {
    const grp = db.prepare('SELECT id,name FROM groups WHERE id=? AND teacher_id=?').get(group_id, req.user.id);
    if (!grp) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
    groupName = grp.name;
    const members = db.prepare('SELECT u.email FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? AND gm.user_id IS NOT NULL').all(group_id);
    emails = members.map(m => m.email);
  } else if (Array.isArray(student_emails) && student_emails.length) {
    emails = student_emails.map(e => e.trim().toLowerCase()).filter(Boolean);
  } else {
    return res.status(400).json({ error: 'Thiếu danh sách học sinh hoặc lớp.' });
  }

  const ins = db.prepare('INSERT INTO assignments (exercise_id,student_email,assigned_by,deadline,note,created_at,group_id) VALUES (?,?,?,?,?,?,?)');
  let count = 0;
  for (const email of emails) {
    const exists = db.prepare('SELECT id FROM assignments WHERE exercise_id=? AND student_email=?').get(exercise_id, email);
    if (!exists) { ins.run(exercise_id, email, req.user.id, deadline || null, note || null, now(), group_id || null); count++; }
    const u = db.prepare('SELECT id,name FROM users WHERE email=?').get(email);
    const assignLink = baseUrl(req) + '/assigned.html';
    if (emailEnabled()) {
      const dline = deadline ? `<p>⏰ Hạn nộp: <b>${deadline}</b></p>` : '';
      const noteHtml = note ? `<p>📌 Ghi chú: ${note}</p>` : '';
      const classHtml = groupName ? `<p>🏫 Lớp: <b>${groupName}</b></p>` : '';
      await sendBrevoEmail({ email, name: u ? u.name : email },
        'Bạn có bài tập mới — English With Tom',
        `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7">
          <h2 style="color:#6F58EE">📝 Thầy/Cô vừa giao bài cho bạn!</h2>
          <p>Bài tập: <b>${ex.title}</b></p>
          ${classHtml}${dline}${noteHtml}
          <p style="margin:22px 0"><a href="${assignLink}" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Xem bài tập ngay</a></p>
          <p style="font-size:13px;color:#888">Đăng nhập bằng đúng email này để xem bài được giao.</p>
        </div>`
      ).catch(() => {});
    }
    // Gửi push notification cho học sinh (nếu đã có tài khoản)
    if (u) sendPushToUser(u.id, '📝 Bạn có bài tập mới!', ex.title, assignLink).catch(() => {});
  }
  res.json({ ok: true, assigned: count, group_name: groupName });
});

// Học sinh xem bài tập được giao cho mình
app.get('/api/my-assignments', requireAuth, (req, res) => {
  const rows = db.prepare(`
    SELECT a.id, a.deadline, a.note, a.created_at AS assigned_at,
           e.id AS exercise_id, e.title, e.program, e.skill, e.is_private, e.auto_grade,
           u.name AS teacher_name,
           g.name AS group_name,
           sub.id AS submission_id, sub.status AS submission_status,
           sub.score AS submission_score, sub.max_score AS submission_max,
           sub.feedback AS submission_feedback, sub.submitted_at
    FROM assignments a
    JOIN exercises e ON e.id = a.exercise_id
    JOIN users u ON u.id = a.assigned_by
    LEFT JOIN groups g ON g.id = a.group_id
    LEFT JOIN submissions sub ON sub.exercise_id = e.id AND sub.user_id = ?
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
           u.id AS student_id, u.name AS student_name,
           g.name AS group_name,
           sub.id AS sub_id, sub.status, sub.score, sub.max_score, sub.submitted_at
    FROM assignments a
    JOIN exercises e ON e.id = a.exercise_id
    LEFT JOIN users u ON u.email = a.student_email
    LEFT JOIN groups g ON g.id = a.group_id
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
app.post('/api/teacher/grade/:id', requireRole('teacher','admin'), async (req, res) => {
  const { score, max_score, feedback } = req.body || {};
  const subId = Number(req.params.id);
  const sub = db.prepare(`
    SELECT s.*, u.name AS student_name, u.email AS student_email, e.title AS exercise_title
    FROM submissions s JOIN users u ON u.id=s.user_id JOIN exercises e ON e.id=s.exercise_id
    WHERE s.id=?
  `).get(subId);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy bài nộp.' });
  db.prepare('UPDATE submissions SET score=?, max_score=?, status=?, feedback=? WHERE id=?')
    .run(score ?? null, max_score ?? 10, 'graded', feedback || null, subId);
  const link = baseUrl(req) + '/assigned.html';
  // Gửi email thông báo kết quả cho học sinh
  if (emailEnabled()) {
    const scoreText = (score !== undefined && score !== null) ? `${score}/${max_score ?? 10}` : 'Đã chấm';
    const fbHtml = feedback ? `<p style="margin:14px 0;padding:12px;background:#f5f3ff;border-left:3px solid #7B6EF6;border-radius:6px">${feedback}</p>` : '';
    sendBrevoEmail(
      { email: sub.student_email, name: sub.student_name },
      `Bài của bạn đã được chấm — ${sub.exercise_title}`,
      `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7">
        <h2 style="color:#6F58EE">✅ Bài của bạn đã được chấm!</h2>
        <p>Bài tập: <b>${sub.exercise_title}</b></p>
        <p>Điểm số: <b style="font-size:20px;color:#6F58EE">${scoreText}</b></p>
        ${fbHtml}
        <p style="margin:22px 0"><a href="${link}" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Xem kết quả chi tiết</a></p>
      </div>`
    ).catch(() => {});
  }
  // Gửi push notification cho học sinh
  sendPushToUser(sub.user_id, '✅ Bài của bạn đã được chấm!', sub.exercise_title, link).catch(() => {});
  res.json({ ok: true });
});

// Giáo viên chấm bài bằng AI (dùng lại gradeWriting đã có)
app.post('/api/teacher/ai-grade/:id', requireRole('teacher','admin'), async (req, res) => {
  const subId = Number(req.params.id);
  const { task_type_override } = req.body || {};
  const sub = db.prepare(`
    SELECT s.*, u.name AS student_name, u.email AS student_email,
           e.title AS exercise_title, e.program, e.skill,
           e.content, e.image_url, e.task_type, e.metadata
    FROM submissions s
    JOIN users u ON u.id = s.user_id
    JOIN exercises e ON e.id = s.exercise_id
    WHERE s.id = ?
  `).get(subId);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy bài nộp.' });

  let essay = '';
  try {
    const ans = typeof sub.answers === 'string' ? JSON.parse(sub.answers) : sub.answers;
    essay = ans.essay || '';
  } catch (e) { essay = sub.answers || ''; }

  if (!essay.trim()) return res.status(400).json({ error: 'Bài nộp không có nội dung text để chấm AI.' });
  if (!aiEnabled()) return res.status(503).json({ error: 'Hệ thống AI chưa sẵn sàng.' });

  try {
    const ex = {
      program: sub.program, skill: sub.skill, content: sub.content,
      image_url: sub.image_url, task_type: sub.task_type, metadata: sub.metadata,
      title: sub.exercise_title,
      _task_override: task_type_override || null
    };
    const result = await gradeWriting(ex, essay, null);
    // Tính max_score từ scale_label (ví dụ "A2 Key (0–5)" → 5)
    let maxScore = 5;
    if (result.scale_label) {
      const m = result.scale_label.match(/\(0[–\-](\d+)\)/);
      if (m) maxScore = parseInt(m[1]);
    }
    // Lưu kết quả với status='pending_review' — chưa gửi cho học sinh
    db.prepare('UPDATE submissions SET feedback=?, score=?, max_score=?, status=? WHERE id=?')
      .run(JSON.stringify(result), result.overall_score ?? null, maxScore, 'pending_review', subId);
    res.json({ ok: true, result, max_score: maxScore });
  } catch (e) {
    console.error('[teacher/ai-grade]', e.message);
    res.status(500).json({ error: 'Chấm AI thất bại: ' + String(e.message).slice(0, 300) });
  }
});

// Giáo viên lưu chỉnh sửa (không gửi cho học sinh, giữ pending_review)
app.post('/api/teacher/save-draft/:id', requireRole('teacher','admin'), (req, res) => {
  const subId = Number(req.params.id);
  const { score, max_score, summary } = req.body || {};
  const sub = db.prepare('SELECT id, feedback FROM submissions WHERE id=?').get(subId);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy.' });
  // Merge summary vào feedback JSON nếu có
  let feedbackJson = sub.feedback;
  if (summary !== undefined) {
    try {
      const fb = typeof sub.feedback === 'string' ? JSON.parse(sub.feedback) : (sub.feedback || {});
      fb.summary = summary;
      feedbackJson = JSON.stringify(fb);
    } catch(e) { feedbackJson = summary; }
  }
  db.prepare('UPDATE submissions SET score=?, max_score=?, feedback=?, status=? WHERE id=?')
    .run(score ?? null, max_score ?? null, feedbackJson, 'pending_review', subId);
  res.json({ ok: true });
});

// Giáo viên xác nhận & gửi kết quả chấm cho học sinh
app.post('/api/teacher/send-grade/:id', requireRole('teacher','admin'), async (req, res) => {
  const subId = Number(req.params.id);
  const { score, max_score, feedback } = req.body || {};
  const sub = db.prepare(`
    SELECT s.*, u.name AS student_name, u.email AS student_email, e.title AS exercise_title
    FROM submissions s JOIN users u ON u.id=s.user_id JOIN exercises e ON e.id=s.exercise_id
    WHERE s.id=?
  `).get(subId);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy bài nộp.' });
  // Cập nhật score/feedback nếu giáo viên có chỉnh sửa
  db.prepare('UPDATE submissions SET score=?, max_score=?, feedback=?, status=? WHERE id=?')
    .run(score ?? sub.score, max_score ?? sub.max_score, feedback ?? sub.feedback, 'graded', subId);
  const link = baseUrl(req) + '/assigned.html';
  const scoreText = (score !== undefined && score !== null) ? `${score}/${max_score ?? sub.max_score ?? 5}` : 'Đã chấm';
  if (emailEnabled()) {
    const fbHtml = feedback ? `<p style="margin:14px 0;padding:12px;background:#f5f3ff;border-left:3px solid #7B6EF6;border-radius:6px">${feedback}</p>` : '';
    sendBrevoEmail(
      { email: sub.student_email, name: sub.student_name },
      `Bài của bạn đã được chấm — ${sub.exercise_title}`,
      `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7">
        <h2 style="color:#6F58EE">✅ Bài của bạn đã được chấm!</h2>
        <p>Bài tập: <b>${sub.exercise_title}</b></p>
        <p>Điểm số: <b style="font-size:20px;color:#6F58EE">${scoreText}</b></p>
        ${fbHtml}
        <p style="margin:22px 0"><a href="${link}" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Xem kết quả chi tiết</a></p>
      </div>`
    ).catch(() => {});
  }
  sendPushToUser(sub.user_id, '✅ Bài của bạn đã được chấm!', sub.exercise_title, link).catch(() => {});
  res.json({ ok: true });
});

// Giáo viên lấy bài mẫu AI cho một đề (từ submission_id)
app.post('/api/teacher/model-answer/:id', requireRole('teacher','admin'), async (req, res) => {
  const subId = Number(req.params.id);
  const sub = db.prepare(`
    SELECT e.* FROM submissions s JOIN exercises e ON e.id=s.exercise_id WHERE s.id=?
  `).get(subId);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy.' });
  if (!aiEnabled()) return res.status(503).json({ error: 'AI chưa sẵn sàng.' });
  try {
    const hints = await getWritingHints(sub);
    res.json({ hints });
  } catch (e) {
    res.status(500).json({ error: 'Không thể tạo bài mẫu: ' + String(e.message).slice(0, 200) });
  }
});

// Giáo viên sửa bài đã giao (deadline + note)
app.put('/api/teacher/assignments/:id', requireRole('teacher','admin'), (req, res) => {
  const { deadline, note } = req.body || {};
  const id = Number(req.params.id);
  const row = db.prepare('SELECT id FROM assignments WHERE id=? AND assigned_by=?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Không tìm thấy bài đã giao.' });
  db.prepare('UPDATE assignments SET deadline=?, note=? WHERE id=?')
    .run(deadline || null, note || null, id);
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

// ===================== QUẢN LÝ LỚP (GROUPS) =====================

// Danh sách lớp của giáo viên (kèm số học sinh)
app.get('/api/groups', requireRole('teacher','admin'), (req, res) => {
  const rows = db.prepare(`
    SELECT g.id, g.name, g.created_at,
      COUNT(CASE WHEN gm.user_id IS NOT NULL THEN 1 END) AS member_count,
      COUNT(CASE WHEN gm.user_id IS NULL THEN 1 END) AS pending_count
    FROM groups g
    LEFT JOIN group_members gm ON gm.group_id = g.id
    WHERE g.teacher_id = ?
    GROUP BY g.id ORDER BY g.id DESC
  `).all(req.user.id);
  res.json({ groups: rows });
});

// Tạo lớp mới
app.post('/api/groups', requireRole('teacher','admin'), (req, res) => {
  const { name } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'Tên lớp không được để trống.' });
  const r = db.prepare('INSERT INTO groups (name,teacher_id,created_at) VALUES (?,?,?)').run(name.trim(), req.user.id, now());
  res.json({ ok: true, id: Number(r.lastInsertRowid), name: name.trim() });
});

// Đổi tên lớp
app.put('/api/groups/:id', requireRole('teacher','admin'), (req, res) => {
  const { name } = req.body || {};
  if (!name || !name.trim()) return res.status(400).json({ error: 'Tên lớp không được để trống.' });
  const r = db.prepare('UPDATE groups SET name=? WHERE id=? AND teacher_id=?').run(name.trim(), Number(req.params.id), req.user.id);
  if (!r.changes) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  res.json({ ok: true });
});

// Xoá lớp (cascade xoá members nhờ ON DELETE CASCADE)
app.delete('/api/groups/:id', requireRole('teacher','admin'), (req, res) => {
  const r = db.prepare('DELETE FROM groups WHERE id=? AND teacher_id=?').run(Number(req.params.id), req.user.id);
  if (!r.changes) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  res.json({ ok: true });
});

// Danh sách thành viên của lớp
app.get('/api/groups/:id/members', requireRole('teacher','admin'), (req, res) => {
  const grp = db.prepare('SELECT id,name FROM groups WHERE id=? AND teacher_id=?').get(Number(req.params.id), req.user.id);
  if (!grp) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  const members = db.prepare(`
    SELECT gm.id, gm.user_id, gm.invited_email, gm.added_at,
           u.name, u.email
    FROM group_members gm
    LEFT JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY gm.id ASC
  `).all(Number(req.params.id));
  res.json({ group: grp, members });
});

// Thêm thành viên vào lớp (theo email)
app.post('/api/groups/:id/members', requireRole('teacher','admin'), async (req, res) => {
  const groupId = Number(req.params.id);
  const grp = db.prepare('SELECT id,name FROM groups WHERE id=? AND teacher_id=?').get(groupId, req.user.id);
  if (!grp) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  const { email } = req.body || {};
  if (!email || !email.trim()) return res.status(400).json({ error: 'Vui lòng nhập email.' });
  const mail = email.trim().toLowerCase();
  const user = db.prepare('SELECT id,name FROM users WHERE email=?').get(mail);
  if (user) {
    // Đã có tài khoản → thêm ngay
    try {
      db.prepare('INSERT INTO group_members (group_id,user_id,added_at) VALUES (?,?,?)').run(groupId, user.id, now());
    } catch (e) {
      return res.status(409).json({ error: 'Học sinh này đã có trong lớp.' });
    }
    res.json({ ok: true, status: 'added', name: user.name, email: mail });
  } else {
    // Chưa có tài khoản → lưu lời mời, gửi email
    const existing = db.prepare('SELECT id FROM group_members WHERE group_id=? AND invited_email=?').get(groupId, mail);
    if (existing) return res.status(409).json({ error: 'Email này đã được mời vào lớp.' });
    db.prepare('INSERT INTO group_members (group_id,invited_email,added_at) VALUES (?,?,?)').run(groupId, mail, now());
    if (emailEnabled()) {
      const link = baseUrl(req) + '/login.html';
      sendBrevoEmail({ email: mail, name: mail },
        `Bạn được mời tham gia lớp ${grp.name} — English With Tom`,
        `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7">
          <h2 style="color:#6F58EE">Lời mời tham gia lớp học</h2>
          <p>Giáo viên đã mời bạn tham gia lớp <b>${grp.name}</b> trên <b>English With Tom</b>.</p>
          <p>Hãy đăng ký tài khoản với đúng địa chỉ email này để tự động vào lớp:</p>
          <p style="margin:22px 0"><a href="${link}" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Đăng ký / Đăng nhập</a></p>
        </div>`
      ).catch(() => {});
    }
    res.json({ ok: true, status: 'invited', email: mail });
  }
});

// Xoá thành viên khỏi lớp
app.delete('/api/groups/:id/members/:memberId', requireRole('teacher','admin'), (req, res) => {
  const groupId = Number(req.params.id);
  const grp = db.prepare('SELECT id FROM groups WHERE id=? AND teacher_id=?').get(groupId, req.user.id);
  if (!grp) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  const r = db.prepare('DELETE FROM group_members WHERE id=? AND group_id=?').run(Number(req.params.memberId), groupId);
  if (!r.changes) return res.status(404).json({ error: 'Không tìm thấy thành viên.' });
  res.json({ ok: true });
});

// Danh sách học sinh đã đăng ký (để teacher tìm kiếm khi thêm vào lớp)
app.get('/api/students', requireRole('teacher','admin'), (req, res) => {
  const q = (req.query.q || '').trim().toLowerCase();
  const rows = q
    ? db.prepare("SELECT id,name,email FROM users WHERE role='student' AND (LOWER(name) LIKE ? OR LOWER(email) LIKE ?) ORDER BY name LIMIT 20").all('%'+q+'%', '%'+q+'%')
    : db.prepare("SELECT id,name,email FROM users WHERE role='student' ORDER BY name LIMIT 50").all();
  res.json({ students: rows });
});

// Giáo viên xem tất cả học sinh đã làm đề của mình
app.get('/api/teacher/my-students', requireRole('teacher','admin'), (req, res) => {
  const tid = req.user.id;
  const q = (req.query.q || '').trim().toLowerCase();
  const filterProg = req.query.program || '';
  const filterGroup = req.query.group || ''; // 'in' | 'out' | ''

  // All students who have submitted to this teacher's exercises
  const students = db.prepare(`
    SELECT u.id, u.name, u.email, u.created_at,
           COUNT(s.id) AS sub_count,
           COUNT(CASE WHEN s.status='graded' THEN 1 END) AS graded_count,
           ROUND(AVG(CASE WHEN s.score IS NOT NULL AND s.max_score > 0
                 THEN CAST(s.score AS REAL) * 100.0 / s.max_score END)) AS avg_pct,
           MAX(s.submitted_at) AS last_active,
           MAX(CASE WHEN gm.user_id IS NOT NULL THEN 1 ELSE 0 END) AS in_group
    FROM submissions s
    JOIN exercises e ON e.id = s.exercise_id
    JOIN users u ON u.id = s.user_id
    LEFT JOIN group_members gm ON gm.user_id = u.id
          AND gm.group_id IN (SELECT id FROM groups WHERE teacher_id = ?)
    WHERE e.created_by = ?
    GROUP BY u.id
    ORDER BY last_active DESC
  `).all(tid, tid);

  // Per-student group names
  const groupRows = db.prepare(`
    SELECT gm.user_id, g.name
    FROM group_members gm
    JOIN groups g ON g.id = gm.group_id
    WHERE g.teacher_id = ? AND gm.user_id IS NOT NULL
  `).all(tid);
  const groupMap = {};
  groupRows.forEach(r => {
    if (!groupMap[r.user_id]) groupMap[r.user_id] = [];
    groupMap[r.user_id].push(r.name);
  });

  // Per-student programs practiced
  const progRows = db.prepare(`
    SELECT s.user_id, e.program, COUNT(*) AS cnt
    FROM submissions s
    JOIN exercises e ON e.id = s.exercise_id
    WHERE e.created_by = ?
    GROUP BY s.user_id, e.program
  `).all(tid);
  const progMap = {};
  progRows.forEach(r => {
    if (!progMap[r.user_id]) progMap[r.user_id] = [];
    progMap[r.user_id].push({ program: r.program, count: r.cnt });
  });

  let result = students.map(s => ({
    ...s,
    group_names: groupMap[s.id] || [],
    programs: (progMap[s.id] || []).sort((a,b) => b.count - a.count)
  }));

  if (q) result = result.filter(s =>
    (s.name||'').toLowerCase().includes(q) || (s.email||'').toLowerCase().includes(q));
  if (filterProg) result = result.filter(s => s.programs.some(p => p.program === filterProg));
  if (filterGroup === 'in')  result = result.filter(s => s.in_group);
  if (filterGroup === 'out') result = result.filter(s => !s.in_group);

  res.json({
    students: result,
    total: result.length,
    in_group: result.filter(s => s.in_group).length,
    out_group: result.filter(s => !s.in_group).length
  });
});

// Giáo viên xem profile chi tiết học sinh
app.get('/api/teacher/student/:id', requireRole('teacher','admin'), (req, res) => {
  const userId = Number(req.params.id);
  const student = db.prepare("SELECT id, name, email, created_at FROM users WHERE id=? AND role='student'").get(userId);
  if (!student) return res.status(404).json({ error: 'Không tìm thấy học sinh.' });

  const subs = db.prepare(`
    SELECT s.id, s.submitted_at, s.status, s.score, s.max_score, s.feedback,
           e.title, e.program, e.skill
    FROM submissions s
    JOIN exercises e ON e.id = s.exercise_id
    WHERE s.user_id = ?
    ORDER BY s.submitted_at DESC
  `).all(userId);

  const MAX_SCALE = { IELTS: 9, KET: 5, PET: 5, FCE: 5, APTIS: 50 };
  const criteriaMap = {};
  const progMap = {};
  const timeline = [];

  const submissions = subs.map(s => {
    const maxScale = MAX_SCALE[s.program] || 10;
    const pct = (s.score != null && s.max_score) ? Math.round(s.score / s.max_score * 100) : null;

    let criteria = [];
    let summary = '';
    try {
      const fb = typeof s.feedback === 'string' ? JSON.parse(s.feedback) : (s.feedback || {});
      if (fb && Array.isArray(fb.criteria)) {
        criteria = fb.criteria.map(c => ({
          name: c.name, score: c.score, max: c.max,
          pct: c.max ? Math.round(c.score / c.max * 100) : null
        }));
        fb.criteria.forEach(c => {
          const shortName = c.name.split('(')[0].trim();
          if (!criteriaMap[shortName]) criteriaMap[shortName] = { total_pct: 0, count: 0 };
          if (c.max) { criteriaMap[shortName].total_pct += (c.score / c.max * 100); criteriaMap[shortName].count++; }
        });
      }
      if (fb && fb.summary) summary = fb.summary;
    } catch(e) {}

    if (pct !== null) {
      if (!progMap[s.program]) progMap[s.program] = { total_pct: 0, count: 0, best_pct: 0, total_raw: 0, max_scale: maxScale };
      const p = progMap[s.program];
      p.total_pct += pct; p.total_raw += (s.score || 0); p.count++;
      if (pct > p.best_pct) p.best_pct = pct;
    }
    if (pct !== null && s.submitted_at) {
      timeline.push({ date: s.submitted_at.slice(0, 10), pct, program: s.program });
    }

    return { id: s.id, title: s.title, program: s.program, skill: s.skill,
             submitted_at: s.submitted_at, status: s.status, score: s.score,
             max_score: s.max_score, pct, summary, criteria };
  });

  const weak_criteria = Object.entries(criteriaMap)
    .map(([name, v]) => ({ name, avg_pct: Math.round(v.total_pct / v.count), count: v.count }))
    .sort((a, b) => a.avg_pct - b.avg_pct)
    .slice(0, 5);

  const by_program = Object.entries(progMap)
    .map(([program, v]) => ({
      program, count: v.count,
      avg_pct: Math.round(v.total_pct / v.count),
      avg_raw: Math.round(v.total_raw / v.count * 10) / 10,
      best_pct: v.best_pct, max_scale: v.max_scale
    }))
    .sort((a, b) => b.count - a.count);

  const graded_subs = submissions.filter(s => s.pct !== null);
  const overall_avg_pct = graded_subs.length
    ? Math.round(graded_subs.reduce((sum, s) => sum + s.pct, 0) / graded_subs.length) : null;

  res.json({
    student,
    submissions,
    stats: { total: subs.length, graded: submissions.filter(s => s.status==='graded').length,
             overall_avg_pct, by_program, weak_criteria,
             timeline: timeline.slice().reverse() }
  });
});

// ===================== ANNOTATIONS =====================

// Lấy tất cả annotation của 1 submission
app.get('/api/submissions/:id/annotations', requireAuth, (req, res) => {
  const subId = Number(req.params.id);
  const sub = db.prepare('SELECT user_id FROM submissions WHERE id=?').get(subId);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy.' });
  // Học sinh chỉ xem annotation bài của mình; giáo viên/admin xem tất cả
  if (req.user.role === 'student' && sub.user_id !== req.user.id)
    return res.status(403).json({ error: 'Không có quyền.' });
  const rows = db.prepare('SELECT a.*, u.name AS teacher_name FROM annotations a JOIN users u ON u.id=a.teacher_id WHERE a.submission_id=? ORDER BY a.start_offset').all(subId);
  res.json({ annotations: rows });
});

// Giáo viên thêm annotation mới
app.post('/api/submissions/:id/annotations', requireRole('teacher','admin'), (req, res) => {
  const subId = Number(req.params.id);
  const { start_offset, end_offset, selected_text, note, color } = req.body || {};
  if (start_offset == null || end_offset == null || !selected_text)
    return res.status(400).json({ error: 'Thiếu thông tin annotation.' });
  const r = db.prepare(
    'INSERT INTO annotations (submission_id,teacher_id,start_offset,end_offset,selected_text,note,color,created_at) VALUES (?,?,?,?,?,?,?,?)'
  ).run(subId, req.user.id, start_offset, end_offset, selected_text, note||null, color||'#fbbf24', now());
  res.json({ annotation: { id: r.lastInsertRowid, submission_id: subId, start_offset, end_offset, selected_text, note, color: color||'#fbbf24' } });
});

// Giáo viên xoá annotation
app.delete('/api/annotations/:id', requireRole('teacher','admin'), (req, res) => {
  db.prepare('DELETE FROM annotations WHERE id=? AND teacher_id=?').run(Number(req.params.id), req.user.id);
  res.json({ ok: true });
});

// Giáo viên cập nhật note của annotation
app.patch('/api/annotations/:id', requireRole('teacher','admin'), (req, res) => {
  const { note, color } = req.body || {};
  db.prepare('UPDATE annotations SET note=?, color=? WHERE id=? AND teacher_id=?')
    .run(note||null, color||'#fbbf24', Number(req.params.id), req.user.id);
  res.json({ ok: true });
});

// ===================== PUSH NOTIFICATIONS =====================

// Trả về VAPID public key để client đăng ký
app.get('/api/push/vapid-public-key', (req, res) => {
  res.json({ key: VAPID_PUBLIC });
});

// Học sinh đăng ký nhận push notification
app.post('/api/push/subscribe', requireAuth, (req, res) => {
  const { endpoint, keys } = req.body || {};
  if (!endpoint || !keys?.p256dh || !keys?.auth)
    return res.status(400).json({ error: 'Thiếu thông tin subscription.' });
  db.prepare(
    'INSERT INTO push_subscriptions (user_id,endpoint,p256dh,auth,created_at) VALUES (?,?,?,?,?) ON CONFLICT(endpoint) DO UPDATE SET user_id=excluded.user_id, p256dh=excluded.p256dh, auth=excluded.auth'
  ).run(req.user.id, endpoint, keys.p256dh, keys.auth, now());
  res.json({ ok: true });
});

// Học sinh huỷ đăng ký push notification
app.post('/api/push/unsubscribe', requireAuth, (req, res) => {
  const { endpoint } = req.body || {};
  if (endpoint) db.prepare('DELETE FROM push_subscriptions WHERE user_id=? AND endpoint=?').run(req.user.id, endpoint);
  res.json({ ok: true });
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

  // Self-ping mỗi 4 phút để Railway không cho app ngủ (cold start làm trang quay vòng 15-30s)
  if (process.env.PUBLIC_URL) {
    const pingUrl = process.env.PUBLIC_URL + '/api/ping';
    setInterval(() => {
      fetch(pingUrl).catch(() => {});
    }, 4 * 60 * 1000);
    console.log('🔔 Keep-alive ping mỗi 4 phút →', pingUrl);
  }
});
