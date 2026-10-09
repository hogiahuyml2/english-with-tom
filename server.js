// Máy chủ web English With Tom — Giai đoạn 2: đăng nhập, phân quyền, lưu bài
const express = require('express');
const crypto = require('crypto');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const webpush = require('web-push');
const initSqlJs = require('sql.js');
const { db, hashPassword, verifyPassword, hashPasswordAsync, verifyPasswordAsync, now } = require('./db');
const security = require('./security');
const { aiEnabled, gradeWriting, gradeAptisWriting, getWritingHints, getVocabSuggestions, provider } = require('./ai');

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
security.install(app);          // chống DoS: giới hạn tần suất, cấm tạm, xả tải, chỉ phục vụ file công khai
app.use(express.static(__dirname)); // file tĩnh phục vụ TRƯỚC (đã lọc ở security.install) — không tốn truy vấn phiên
app.use(express.json({ limit: '100kb' }));

// ===== Thông báo trong ứng dụng (chuông 🔔) — dành cho giáo viên/admin =====
// Tạo bản ghi + gửi kèm push (nếu người dùng đã đăng ký push). Không throw —
// lỗi tạo thông báo không được làm hỏng luồng chính (nộp bài, tạo đề...).
function notifyUser(userId, type, title, body, link) {
  try {
    db.prepare('INSERT INTO notifications (user_id,type,title,body,link,created_at) VALUES (?,?,?,?,?,?)')
      .run(userId, type, title, body || null, link || null, now());
  } catch (e) { console.error('[notify] insert lỗi:', e.message); }
  sendPushToUser(userId, title, body || '', link || '/').catch(() => {});
}

// Gửi thông báo cho MỌI giáo viên + admin, trừ (tuỳ chọn) người vừa thực hiện hành động
function notifyAllStaff(type, title, body, link, exceptUserId) {
  try {
    const staff = db.prepare("SELECT id FROM users WHERE role IN ('teacher','admin')").all();
    for (const u of staff) {
      if (exceptUserId && u.id === exceptUserId) continue;
      notifyUser(u.id, type, title, body, link);
    }
  } catch (e) { console.error('[notify] notifyAllStaff lỗi:', e.message); }
}

// Đường link mở ĐÚNG trang làm bài của 1 đề theo skill — dùng để chuông thông báo
// đưa học sinh vào thẳng bài, không phải trang danh sách chung chung.
function practiceUrlFor(skill, exerciseId, assigned) {
  const suffix = assigned ? '&assigned=1' : '';
  if (skill === 'Speaking') return 'practice-speaking.html?id=' + exerciseId + suffix;
  if (skill === 'Writing')  return 'practice-writing.html?id=' + exerciseId + suffix;
  return 'practice-quiz.html?id=' + exerciseId + suffix;
}

// ===== Tải file ảnh/âm thanh — lưu trên ổ đĩa bền vững (/data/uploads trên Railway) =====
const DATA_DIR = process.env.DATA_DIR || __dirname;
const uploadsDir = path.join(DATA_DIR, 'uploads');
fs.mkdirSync(uploadsDir, { recursive: true });
// File tải lên có thể do người dùng tạo → luôn phục vụ trong "sandbox" (không chạy được script dù là file HTML đội lốt) + không đoán kiểu
app.use('/uploads', express.static(uploadsDir, { maxAge: '7d', dotfiles: 'ignore', index: false, setHeaders: (res) => { res.setHeader('Content-Security-Policy', "default-src 'none'; sandbox"); res.setHeader('X-Content-Type-Options', 'nosniff'); } }));
const upload = multer({
  storage: multer.diskStorage({
    destination: uploadsDir,
    // Không dùng đuôi file do người dùng khai — đuôi thật được quyết định sau khi kiểm tra "chữ ký" nội dung (xem checkUpload)
    filename: (req, file, cb) => cb(null, crypto.randomBytes(12).toString('hex') + '.upload')
  }),
  limits: { fileSize: 20 * 1024 * 1024 }, // tối đa 20MB
  fileFilter: (req, file, cb) => {
    if (/^(image|audio)\//.test(file.mimetype)) cb(null, true);
    else cb(new Error('Chỉ chấp nhận tệp ảnh hoặc âm thanh.'));
  }
});

// Kiểm tra nội dung thật của file (magic bytes) — chặn file HTML/SVG/script đội lốt ảnh hoặc âm thanh
const UPLOAD_TYPES = [
  { ext: '.jpg',  kind: 'image', ok: b => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: '.png',  kind: 'image', ok: b => b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { ext: '.gif',  kind: 'image', ok: b => b.slice(0, 4).toString('latin1') === 'GIF8' },
  { ext: '.webp', kind: 'image', ok: b => b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WEBP' },
  { ext: '.mp3',  kind: 'audio', ok: b => b.slice(0, 3).toString('latin1') === 'ID3' || (b[0] === 0xff && (b[1] & 0xe0) === 0xe0) },
  { ext: '.wav',  kind: 'audio', ok: b => b.slice(0, 4).toString('latin1') === 'RIFF' && b.slice(8, 12).toString('latin1') === 'WAVE' },
  { ext: '.ogg',  kind: 'audio', ok: b => b.slice(0, 4).toString('latin1') === 'OggS' },
  { ext: '.webm', kind: 'audio', ok: b => b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3 },
  { ext: '.m4a',  kind: 'audio', ok: b => b.slice(4, 8).toString('latin1') === 'ftyp' },
  { ext: '.flac', kind: 'audio', ok: b => b.slice(0, 4).toString('latin1') === 'fLaC' }
];
function checkUpload(file, allowedKinds) {
  try {
    const fd = fs.openSync(file.path, 'r'), buf = Buffer.alloc(16); fs.readSync(fd, buf, 0, 16, 0); fs.closeSync(fd);
    const t = UPLOAD_TYPES.find(x => allowedKinds.includes(x.kind) && x.ok(buf));
    if (!t) { fs.unlink(file.path, () => {}); return null; }
    const name = path.basename(file.path, '.upload') + t.ext;
    fs.renameSync(file.path, path.join(uploadsDir, name));
    return name;
  } catch (e) { try { fs.unlinkSync(file.path); } catch (_) {} return null; }
}

// URL gốc của web (để tạo redirect_uri cho Google, link xác thực email...)
function baseUrl(req) {
  if (process.env.PUBLIC_URL) return process.env.PUBLIC_URL.replace(/\/+$/, '');
  // Không tin header Host do khách gửi (kẻ xấu có thể làm link đặt lại mật khẩu trỏ về trang giả) — chỉ nhận tên miền của mình
  const host = String(req.get('host') || '').toLowerCase();
  const ok = /^(www\.)?engwithtom\.online$/.test(host) || /\.up\.railway\.app$/.test(host) || /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host);
  if (!ok) return 'https://www.engwithtom.online';
  const proto = /^localhost|^127\./.test(host) ? 'http' : 'https';
  return proto + '://' + host;
}

// Detect HTTPS — cần để set Secure flag trên cookie
function isHttps(req) {
  return (req.headers['x-forwarded-proto'] || req.protocol) === 'https';
}

// ===== Gửi email qua Brevo (HTTP API, không cần thư viện) =====
// Làm sạch giá trị biến môi trường: người dùng hay dán thừa dấu cách/xuống dòng/dấu nháy → Brevo từ chối ngầm
// Escape HTML cho nội dung chèn vào email; làm sạch tên hiển thị (chống XSS lưu trữ: bỏ < > " ` { } \ & ... khỏi tên)
const htmlEsc = (x) => String(x == null ? '' : x).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function cleanName(v, fallback) {
  const s = String(v == null ? '' : v).normalize('NFC').replace(/[\u0000-\u001f\u007f<>"`{}\\&$%^*=|;]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60);
  return /\p{L}/u.test(s) ? s : (fallback || '');
}
const envClean = (v) => String(v || '').trim().replace(/^["']|["']$/g, '').trim();
const brevoKey = () => envClean(process.env.BREVO_API_KEY);
const fromEmail = () => envClean(process.env.FROM_EMAIL);
function emailEnabled() { return !!brevoKey() && !!fromEmail(); }

function fmtDeadline(iso) {
  if (!iso) return '';
  try {
    const hasTime = iso.includes('T');
    const d = new Date(iso);
    const date = `${String(d.getDate()).padStart(2,'0')}/${String(d.getMonth()+1).padStart(2,'0')}/${d.getFullYear()}`;
    return hasTime ? `${date} ${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}` : date;
  } catch { return iso; }
}

// Gợi ý nguyên nhân bằng tiếng Việt từ mã lỗi Brevo (hiển thị cho quản trị viên)
function explainBrevoError(status, detail) {
  const d = String(detail || '').toLowerCase();
  if (/unrecognised ip|unrecognized ip|ip address/.test(d))
    return 'Brevo chặn vì địa chỉ IP của máy chủ chưa được cho phép. Vào Brevo → Security → Authorised IPs → TẮT chế độ chặn IP (Railway đổi IP liên tục).';
  if (status === 401 || /invalid.*key|api-key|key not found/.test(d))
    return 'Khóa BREVO_API_KEY sai hoặc đã bị thu hồi. Tạo khóa mới ở Brevo → SMTP & API → API Keys rồi cập nhật trong Railway.';
  if (/sender/.test(d))
    return 'Người gửi (FROM_EMAIL) chưa được xác minh trong Brevo. Vào Brevo → Senders & IP → thêm và xác minh đúng địa chỉ email này.';
  if (status === 402 || status === 429 || /limit|quota|credit/.test(d))
    return 'Đã hết hạn mức gửi email (gói miễn phí 300 email/ngày) hoặc bị giới hạn tạm thời. Chờ sang ngày mới hoặc nâng gói.';
  if (status === 403 || /account|suspend|block/.test(d))
    return 'Tài khoản Brevo bị tạm khóa hoặc chưa kích hoạt gửi email giao dịch. Đăng nhập Brevo kiểm tra thông báo từ Brevo.';
  if (!status) return 'Không kết nối được tới Brevo (mạng/hết thời gian chờ): ' + String(detail || '');
  return 'Brevo trả về lỗi ' + status + '.';
}

let _mailLogN = 0;
function logEmail(to, subject, ok, status, detail) {
  try {
    db.prepare('INSERT INTO email_log (to_email,subject,ok,status,detail,created_at) VALUES (?,?,?,?,?,?)')
      .run(String(to || '').slice(0, 120), String(subject || '').slice(0, 160), ok ? 1 : 0, status || null, String(detail || '').slice(0, 500), now());
    if (++_mailLogN % 50 === 0) db.exec('DELETE FROM email_log WHERE id < (SELECT MAX(id) - 500 FROM email_log)');
  } catch (e) { /* nhật ký không được làm hỏng luồng chính */ }
}

// Báo cho giáo viên/admin (chuông 🔔) khi email lỗi — tối đa 1 lần mỗi giờ để không spam
let _lastMailAlert = 0;
function alertEmailFailure(status, detail) {
  if (Date.now() - _lastMailAlert < 60 * 60 * 1000) return;
  _lastMailAlert = Date.now();
  try { notifyAllStaff('email_failed', '⚠️ Gửi email đang bị lỗi', explainBrevoError(status, detail), 'admin.html'); } catch (e) {}
}

async function sendBrevoEmail(to, subject, htmlContent) {
  if (!emailEnabled()) return { ok: false, detail: 'Email chưa cấu hình' };
  let last = { ok: false, detail: 'unknown' };
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const r = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: { 'api-key': brevoKey(), 'Content-Type': 'application/json', accept: 'application/json' },
        body: JSON.stringify({
          sender: { name: envClean(process.env.SENDER_NAME) || 'English With Tom', email: fromEmail() },
          to: [{ email: to.email, name: to.name }],
          subject, htmlContent
        }),
        signal: AbortSignal.timeout(12000) // không để một lần gửi mail treo mãi
      });
      if (r.ok) { logEmail(to.email, subject, true, r.status, ''); return { ok: true }; }
      const detail = (await r.text()).slice(0, 500);
      console.error('Brevo error', r.status, detail);
      last = { ok: false, status: r.status, detail };
      if (r.status < 500 && r.status !== 429) break; // lỗi cấu hình: gửi lại cũng vô ích
    } catch (e) {
      console.error('Brevo exception', e.message);
      last = { ok: false, detail: e.message };
    }
    await new Promise(res => setTimeout(res, 700));
  }
  logEmail(to.email, subject, false, last.status, last.detail);
  alertEmailFailure(last.status, last.detail);
  return last;
}

async function sendVerificationCode(user, code) {
  const html =
    '<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.6;max-width:480px">' +
    '<div style="background:linear-gradient(135deg,#6F58EE,#4F8BF0);padding:24px;border-radius:12px 12px 0 0;text-align:center">' +
      '<h2 style="color:#fff;margin:0;font-size:22px">English With Tom ✨</h2>' +
    '</div>' +
    '<div style="background:#fff;padding:28px;border-radius:0 0 12px 12px;border:1px solid #e8e6f2">' +
    '<h3 style="color:#2E2B45;margin-bottom:8px">Xin chào ' + htmlEsc(user.name) + '! 👋</h3>' +
    '<p style="color:#6B6880">Đây là mã xác thực tài khoản của bạn trên <b>English With Tom</b>:</p>' +
    '<div style="text-align:center;margin:24px 0">' +
      '<div style="display:inline-block;background:linear-gradient(135deg,#6F58EE,#4F8BF0);color:#fff;font-size:38px;font-weight:700;letter-spacing:10px;padding:18px 32px;border-radius:14px;box-shadow:0 8px 24px rgba(111,88,238,.3)">' + code + '</div>' +
    '</div>' +
    '<p style="color:#6B6880;font-size:14px">Mã có hiệu lực trong <strong style="color:#6F58EE">15 phút</strong>.</p>' +
    '<div style="background:#fff8e1;border-left:4px solid #f0b429;padding:12px 16px;border-radius:8px;margin:16px 0;font-size:13.5px;color:#7a6000">' +
      '📬 <strong>Không thấy email?</strong> Hãy kiểm tra thư mục <strong>Spam / Thư rác</strong> — email đôi khi bị lọc nhầm.' +
    '</div>' +
    '<p style="color:#9C99AE;font-size:12.5px;margin-top:16px">Nếu bạn không đăng ký tài khoản này, hãy bỏ qua email này.</p>' +
    '</div></div>';
  return sendBrevoEmail(user, 'Mã xác thực tài khoản — English With Tom', html);
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
// Bộ nhớ đệm phiên 20 giây: mỗi request không phải truy vấn DB 2 lần (giảm tải rất nhiều khi bị dồn request)
const _sessCache = new Map(); // token -> { user, exp }
const SESS_TTL = 20 * 1000;
function dropSessionCache(token) { if (token) _sessCache.delete(token); }
function dropUserSessionCache(userId) { for (const [k, v] of _sessCache) if (v.user && v.user.id === userId) _sessCache.delete(k); }
setInterval(() => { const t = Date.now(); for (const [k, v] of _sessCache) if (v.exp <= t) _sessCache.delete(k); }, 60 * 1000).unref();
app.use((req, res, next) => {
  try {
    const token = parseCookies(req).ewt_session;
    if (token && /^[a-f0-9]{48}$/.test(token)) {
      const c = _sessCache.get(token);
      if (c && c.exp > Date.now()) { req.user = c.user; return next(); }
      const s = db.prepare('SELECT user_id FROM sessions WHERE token=?').get(token);
      if (s) {
        req.user = db.prepare('SELECT id,name,email,role,email_verified FROM users WHERE id=?').get(s.user_id);
        if (req.user && _sessCache.size < 5000) _sessCache.set(token, { user: req.user, exp: Date.now() + SESS_TTL });
      }
    }
  } catch (e) {
    console.error('Auth middleware error:', e.message);
  }
  next();
});

// ===== Giới hạn tần suất theo route (chống dò mật khẩu, spam email, đốt hạn mức AI, tải file ồ ạt) =====
const mins = (n) => n * 60 * 1000;
const rlLogin    = security.limiter({ name: 'login',    max: 120, windowMs: mins(10) });   // theo IP (cả lớp học chung 1 IP vẫn đủ)
const rlRegister = security.limiter({ name: 'register', max: 30,  windowMs: mins(60) });
const rlRegAll   = security.limiter({ name: 'registerAll', max: 300, windowMs: mins(60), by: () => 'all' });
const rlForgot   = security.limiter({ name: 'forgot',   max: 12,  windowMs: mins(15) });
const rlReset    = security.limiter({ name: 'reset',    max: 40,  windowMs: mins(15) });
const rlAiStudent = security.limiter({ name: 'aiS', max: 40,  windowMs: mins(60), by: 'user', message: 'Bạn đã dùng AI quá nhiều trong 1 giờ. Vui lòng thử lại sau.' });
const rlAiTeacher = security.limiter({ name: 'aiT', max: 200, windowMs: mins(60), by: 'user', message: 'Đã đạt giới hạn AI trong 1 giờ. Vui lòng thử lại sau.' });
const rlUpload   = security.limiter({ name: 'upload', max: 80,  windowMs: mins(60), by: 'user', message: 'Bạn tải tệp lên quá nhiều. Vui lòng thử lại sau.' });
const rlWrite    = security.limiter({ name: 'write',  max: 400, windowMs: mins(1),  by: 'user' }); // mọi thao tác ghi của 1 tài khoản
const onlyPost = (mw) => (req, res, next) => (req.method === 'POST' ? mw(req, res, next) : next());
app.use('/api', (req, res, next) => (['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method) ? rlWrite(req, res, next) : next()));
app.use(['/api/grade-writing', '/api/grade-aptis-writing', '/api/writing-hints', '/api/writing-vocab'], onlyPost(rlAiStudent));
app.use(['/api/teacher/ai-grade', '/api/teacher/model-answer', '/api/lesson-vocab/ai-cards', '/api/lesson-vocab/ai-questions', '/api/lesson-vocab/extract'], onlyPost(rlAiTeacher));
app.use([/^\/api\/essay\/teacher\/sub\/\d+\/ai$/, '/api/essay/teacher/ocr'], onlyPost(rlAiTeacher));
app.use(['/api/upload', '/api/upload-recording'], onlyPost(rlUpload));
try { require('./access')(app, { db, requireRole }); } catch (e) { console.error('[access] Không khởi động được:', e.message); } // nhật ký truy cập (phải đặt trước các route /api để ghi được thao tác)

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

// Bật xác thực email bằng OTP khi đăng ký (chỉ hiệu lực khi đã cấu hình email gửi được): đặt biến môi trường REQUIRE_EMAIL_VERIFY=1
const REQUIRE_VERIFY = process.env.REQUIRE_EMAIL_VERIFY === '1' && emailEnabled();
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
const str = (v, max) => (typeof v === 'string' ? v : '').slice(0, max);
function busy(res) { return res.status(503).json({ error: 'Máy chủ đang bận, vui lòng thử lại sau vài giây.' }); }

// Đăng ký — CHỈ tạo tài khoản học sinh (giáo viên do admin cấp)
app.post('/api/register', rlRegister, rlRegAll, async (req, res) => {
  const b = req.body || {};
  const name = cleanName(b.name), email = str(b.email, 254).trim(), password = str(b.password, 129);
  if (!String(b.name || '').trim() || !email || !password) return res.status(400).json({ error: 'Vui lòng nhập đủ họ tên, email và mật khẩu.' });
  if (!name) return res.status(400).json({ error: 'Họ tên cần có chữ cái và không chứa ký tự đặc biệt như < > " & .' });
  if (password.length < 6) return res.status(400).json({ error: 'Mật khẩu cần tối thiểu 6 ký tự.' });
  if (password.length > 128) return res.status(400).json({ error: 'Mật khẩu tối đa 128 ký tự.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Email không hợp lệ.' });
  const mail = email.toLowerCase();
  if (db.prepare('SELECT id FROM users WHERE email=?').get(mail))
    return res.status(409).json({ error: 'Email này đã được đăng ký.' });

  let hashed;
  try { hashed = await hashPasswordAsync(password); } catch (e) { return busy(res); }
  let newId;
  try {
    const r = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,created_at) VALUES (?,?,?,?,?,?)')
      .run(name, mail, hashed, 'student', REQUIRE_VERIFY ? 0 : 1, now());
    newId = Number(r.lastInsertRowid);
  } catch (e) { return res.status(409).json({ error: 'Email này đã được đăng ký.' }); }

  // Bật REQUIRE_EMAIL_VERIFY=1 (và email đã cấu hình) → bắt buộc xác thực email bằng mã OTP trước khi dùng tài khoản
  if (REQUIRE_VERIFY) {
    const code = String(crypto.randomInt(100000, 1000000));
    db.prepare('UPDATE users SET verify_token=?, verify_token_expiry=? WHERE id=?').run(code, new Date(Date.now() + 15 * 60 * 1000).toISOString(), newId);
    const sent = await sendVerificationCode({ name, email: mail }, code);
    return res.json({ needVerify: true, email: mail, mailOk: !!sent.ok });
  }
  onStudentActivated(newId, name, mail);
  startSession(res, newId, req);
  res.json({ needVerify: false });
});

// Việc làm khi tài khoản học sinh bắt đầu được dùng (sau đăng ký, hoặc sau khi xác thực email nếu bật REQUIRE_EMAIL_VERIFY)
function onStudentActivated(id, name, mail) {
  try { db.prepare('UPDATE group_members SET user_id=?, invited_email=NULL WHERE invited_email=?').run(id, mail); } catch (e) {}
  // Báo cho giáo viên tối đa 30 học sinh mới/giờ — tránh bị spam đăng ký làm ngập chuông thông báo
  if (security.hit('notify:newstudent', 30, mins(60)).ok)
    notifyAllStaff('new_student', '🎓 Học sinh mới: ' + name, mail + ' vừa đăng ký tài khoản.', 'teacher.html?tab=students');
}

// Đăng nhập — học sinh và giáo viên đều dùng
// Chống dò mật khẩu: tối đa 8 lần sai / 15 phút cho mỗi cặp (email, IP) và 40 lần sai cho mỗi email (nhiều IP khác nhau).
app.post('/api/login', rlLogin, async (req, res) => {
  const email = str((req.body || {}).email, 254).trim().toLowerCase();
  const password = str((req.body || {}).password, 129);
  if (!email || !password) return res.status(400).json({ error: 'Vui lòng nhập email và mật khẩu.' });
  const kPair = 'fail:' + email + '|' + req.clientIp, kEmail = 'failE:' + email;
  if (security.peek(kPair) >= 8 || security.peek(kEmail) >= 40)
    return res.status(429).json({ error: 'Bạn đã nhập sai quá nhiều lần. Vui lòng đợi 15 phút hoặc dùng "Quên mật khẩu".' });
  const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  let ok = false;
  if (u && password.length <= 128) {
    try { ok = await verifyPasswordAsync(password, u.pass); } catch (e) { return busy(res); }
  }
  if (!ok) {
    security.hit(kPair, 1e9, mins(15)); security.hit(kEmail, 1e9, mins(15));
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
  }
  security.clearKey(kPair);
  if (REQUIRE_VERIFY && u.role === 'student' && !u.email_verified) return res.status(403).json({ error: 'Tài khoản chưa xác thực email. Hãy nhập mã OTP đã gửi tới email của bạn.', needVerify: true, email: u.email });
  startSession(res, u.id, req);
  res.json({ user: { id: u.id, name: u.name, email: u.email, role: u.role } });
});

app.post('/api/logout', (req, res) => {
  const token = parseCookies(req).ewt_session;
  if (token) { db.prepare('DELETE FROM sessions WHERE token=?').run(token); dropSessionCache(token); }
  res.setHeader('Set-Cookie', 'ewt_session=; HttpOnly; Path=/; Max-Age=0');
  res.json({ ok: true });
});

// class_nudge = học sinh chưa có lớp và chưa xác nhận "tự do" (và đang có lớp mở để chọn) → web hiện lời nhắc chọn lớp
app.get('/api/me', (req, res) => {
  const u = req.user || null; let nudge = false;
  try {
    if (u && u.role === 'student') {
      const ch = db.prepare('SELECT class_choice FROM users WHERE id=?').get(u.id);
      const stillPending = ch && ch.class_choice === 'pending' && db.prepare('SELECT 1 FROM group_join_requests WHERE user_id=?').get(u.id);
      if (!ch || !ch.class_choice || (ch.class_choice === 'pending' && !stillPending)) nudge = !db.prepare('SELECT 1 FROM group_members WHERE user_id=? LIMIT 1').get(u.id)
        && !!db.prepare('SELECT 1 FROM groups WHERE self_join=1 LIMIT 1').get();
    }
  } catch (_) {}
  let avatar = null;
  try { if (u) { const r = db.prepare('SELECT avatar FROM users WHERE id=?').get(u.id); if (r && r.avatar) avatar = JSON.parse(r.avatar); } } catch (_) {}
  res.json({ user: u, class_nudge: nudge, avatar });
});

// ===== QUÊN MẬT KHẨU =====
// Email gồm CẢ mã OTP 6 số lẫn nút bấm (link). Người dùng chọn 1 trong 2. Hiệu lực 30 phút, nhập sai mã tối đa 5 lần.
const RESET_MINUTES = 30;
const sha256 = (x) => crypto.createHash('sha256').update(x).digest('hex');
const resetCodeHash = (code, userId) => sha256(String(code).trim() + ':' + userId + ':' + (process.env.RESET_PEPPER || 'ewt'));

// Tạo link + mã OTP mới cho 1 tài khoản (dùng cho email và cho nút "Cấp mã" của giáo viên/admin)
function issueResetCredentials(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  const code = String(crypto.randomInt(100000, 1000000));
  const exp = new Date(Date.now() + RESET_MINUTES * 60 * 1000).toISOString();
  db.prepare('UPDATE users SET reset_token=?, reset_token_expiry=?, reset_code_hash=?, reset_code_expiry=?, reset_code_tries=0 WHERE id=?')
    .run(token, exp, resetCodeHash(code, userId), exp, userId);
  return { token, code, exp };
}

// Bước 1: Gửi email chứa mã OTP + link đặt lại mật khẩu
app.post('/api/forgot-password', rlForgot, async (req, res) => {
  const email = str((req.body || {}).email, 254).trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Vui lòng nhập email.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Email không hợp lệ.' });
  if (!emailEnabled()) return res.status(503).json({ error: 'Chưa gửi được email đặt lại mật khẩu. Vui lòng nhờ thầy Tom cấp mã đặt lại mật khẩu cho bạn.' });

  // Mỗi email chỉ nhận tối đa 3 email/15 phút (chống dùng web để spam hộp thư người khác, chống cạn hạn mức Brevo)
  if (!security.hit('forgotEmail:' + email, 3, mins(15)).ok) return res.json({ ok: true });
  if (!security.hit('forgotAll', 150, mins(60)).ok) return res.status(429).json({ error: 'Hệ thống đang nhận quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.' });

  const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  // Luôn trả ok để không lộ thông tin tài khoản có tồn tại hay không
  if (!u || u.pass === 'google-oauth') return res.json({ ok: true });

  const { token, code } = issueResetCredentials(u.id);
  const link = baseUrl(req) + '/reset-password.html?token=' + token;
  const html =
    '<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.6;max-width:480px">' +
    '<h2 style="color:#6F58EE">Đặt lại mật khẩu 🔑</h2>' +
    '<p>Bạn (hoặc ai đó) đã yêu cầu đặt lại mật khẩu cho tài khoản <b>' + htmlEsc(u.email) + '</b> trên English With Tom.</p>' +
    '<p style="margin:18px 0 6px">Mã xác nhận (OTP) của bạn:</p>' +
    '<div style="text-align:center;margin:8px 0 18px"><span style="display:inline-block;background:#6F58EE;color:#fff;font-size:34px;font-weight:700;letter-spacing:9px;padding:14px 26px;border-radius:12px">' + code + '</span></div>' +
    '<p style="margin:6px 0">Hoặc bấm nút bên dưới:</p>' +
    '<p style="margin:16px 0"><a href="' + link + '" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">Đặt lại mật khẩu</a></p>' +
    '<p style="font-size:13px;color:#888">Mã và link có hiệu lực trong <b>' + RESET_MINUTES + ' phút</b>. Tuyệt đối không chia sẻ mã này cho ai.</p>' +
    '<p style="font-size:13px;color:#888">Nếu bạn không yêu cầu điều này, hãy bỏ qua email — tài khoản của bạn vẫn an toàn.</p>' +
    '</div>';
  await sendBrevoEmail({ email: u.email, name: u.name }, 'Mã đặt lại mật khẩu — English With Tom', html);
  res.json({ ok: true });
});

// Bước 2: đặt mật khẩu mới — bằng link {token} HOẶC bằng mã OTP {email, code}
app.post('/api/reset-password', rlReset, async (req, res) => {
  const b = req.body || {};
  const token = str(b.token, 100).trim(), code = str(b.code, 12).replace(/\s/g, ''), email = str(b.email, 254).trim().toLowerCase();
  const newPassword = str(b.newPassword, 129);
  if ((!token && !(email && code)) || !newPassword) return res.status(400).json({ error: 'Thiếu thông tin.' });
  if (newPassword.length < 6) return res.status(400).json({ error: 'Mật khẩu mới cần tối thiểu 6 ký tự.' });
  if (newPassword.length > 128) return res.status(400).json({ error: 'Mật khẩu tối đa 128 ký tự.' });

  let u;
  if (token) {
    u = db.prepare('SELECT * FROM users WHERE reset_token=?').get(token);
    if (!u) return res.status(400).json({ error: 'Link đặt lại mật khẩu không hợp lệ hoặc đã được dùng.' });
    if (!u.reset_token_expiry || new Date(u.reset_token_expiry) < new Date())
      return res.status(400).json({ error: 'Link đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu mới.' });
  } else {
    if (!/^\d{6}$/.test(code)) return res.status(400).json({ error: 'Mã OTP gồm 6 chữ số.' });
    u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if (!u || !u.reset_code_hash) return res.status(400).json({ error: 'Mã không đúng hoặc đã hết hạn. Hãy yêu cầu mã mới.' });
    if (!u.reset_code_expiry || new Date(u.reset_code_expiry) < new Date())
      return res.status(400).json({ error: 'Mã đã hết hạn. Vui lòng yêu cầu mã mới.' });
    if ((u.reset_code_tries || 0) >= 5) {
      db.prepare('UPDATE users SET reset_code_hash=NULL, reset_code_expiry=NULL, reset_token=NULL, reset_token_expiry=NULL WHERE id=?').run(u.id);
      return res.status(400).json({ error: 'Bạn đã nhập sai quá 5 lần. Vui lòng yêu cầu mã mới.' });
    }
    const good = crypto.timingSafeEqual(Buffer.from(resetCodeHash(code, u.id)), Buffer.from(u.reset_code_hash));
    if (!good) {
      db.prepare('UPDATE users SET reset_code_tries=reset_code_tries+1 WHERE id=?').run(u.id);
      const left = 4 - (u.reset_code_tries || 0);
      return res.status(400).json({ error: left > 0 ? 'Mã không đúng. Bạn còn ' + left + ' lần thử.' : 'Mã không đúng. Hãy yêu cầu mã mới.' });
    }
  }

  let hashed;
  try { hashed = await hashPasswordAsync(newPassword); } catch (e) { return busy(res); }
  db.prepare('UPDATE users SET pass=?, reset_token=NULL, reset_token_expiry=NULL, reset_code_hash=NULL, reset_code_expiry=NULL, reset_code_tries=0 WHERE id=?')
    .run(hashed, u.id);
  // Đăng xuất mọi thiết bị đang dùng mật khẩu cũ
  db.prepare('DELETE FROM sessions WHERE user_id=?').run(u.id);
  dropUserSessionCache(u.id);
  res.json({ ok: true });
});

// Đổi mật khẩu (cho người đang đăng nhập)
app.post('/api/me/change-password', requireAuth, security.limiter({ name: 'chpw', max: 10, windowMs: mins(15), by: 'user' }), async (req, res) => {
  const currentPassword = str((req.body || {}).currentPassword, 129), newPassword = str((req.body || {}).newPassword, 129);
  if (!newPassword || newPassword.length < 6)
    return res.status(400).json({ error: 'Mật khẩu mới cần tối thiểu 6 ký tự.' });
  if (newPassword.length > 128) return res.status(400).json({ error: 'Mật khẩu tối đa 128 ký tự.' });
  const u = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  let okPw, hashed;
  try { okPw = await verifyPasswordAsync(currentPassword, u.pass); } catch (e) { return busy(res); }
  if (!okPw) return res.status(400).json({ error: 'Mật khẩu hiện tại không đúng.' });
  try { hashed = await hashPasswordAsync(newPassword); } catch (e) { return busy(res); }
  db.prepare('UPDATE users SET pass=? WHERE id=?').run(hashed, req.user.id);
  res.json({ ok: true });
});

// Favicon
app.get('/favicon.ico', (req, res) => res.redirect('/favicon.png'));
app.get('/favicon.png', (req, res) => {
  res.setHeader('Content-Type', 'image/png');
  res.setHeader('Cache-Control', 'public, max-age=604800');
  res.sendFile(path.join(__dirname, 'favicon.png'));
});

// Health check — dùng để keep-alive, tránh Railway cold start
app.get('/api/ping', (req, res) => {
  try {
    db.prepare('SELECT 1').get();
    res.json({ ok: true, t: Date.now(), db: 'ok' });
  } catch(e) {
    console.error('[ping]', e.message); res.status(500).json({ ok: false, t: Date.now(), db: 'error' });
  }
});

// Chẩn đoán warmup RAM — không cần auth, không lộ dữ liệu nhạy cảm
app.get('/api/health', (req, res) => {
  res.json({
    warmup: _warmupState,          // pending | ready | failed
    exercises: _exById.size,       // số đề đã nạp vào RAM
    assigned: _assignedSet.size,
    submitted: _submittedSet.size,
    t: Date.now(),
    disk: _diskInfo(),
    dbWrite: _dbWriteProbe(),
    repaired: require('./db').repairLog || []
  });
});
// Chẩn đoán đĩa & khả năng ghi database (không lộ dữ liệu người dùng)
function _diskInfo() {
  try {
    const f = fs.statfsSync(DATA_DIR), mb = x => Math.round(x * f.bsize / 1048576);
    let up = 0, bk = 0;
    try { up = fs.readdirSync(uploadsDir).length; } catch (e) {}
    try { bk = fs.readdirSync(path.join(DATA_DIR, 'backups')).length; } catch (e) {}
    const dirMB = (d) => { let n = 0; try { for (const x of fs.readdirSync(d)) { try { n += fs.statSync(path.join(d, x)).size; } catch (e) {} } } catch (e) {} return Math.round(n / 1048576 * 10) / 10; };
    return { freeMB: mb(f.bavail), totalMB: mb(f.blocks), uploadFiles: up, backupFiles: bk, uploadsMB: dirMB(uploadsDir), backupsMB: dirMB(path.join(DATA_DIR, 'backups')), rootFilesMB: dirMB(DATA_DIR) };
  } catch (e) { return { error: e.message }; }
}
function _dbWriteProbe() {
  try {
    db.exec('BEGIN IMMEDIATE'); db.exec('ROLLBACK'); // thử xin quyền ghi nhưng không ghi gì (không làm đổi dữ liệu)
    return 'ok';
  } catch (e) { return 'ERROR: ' + e.message; }
}

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
  if (essayTaskOfExercise(exercise_id)) return res.status(409).json({ error: 'Bài tự luận được làm tại trang Bài tự luận.', link: 'essay.html?id=' + essayTaskOfExercise(exercise_id) });
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
    res.status(500).json({ error: 'Chấm bài tự động thất bại, vui lòng thử lại sau.' });
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

// Gợi ý TỪ VỰNG & COLLOCATIONS theo đề (đọc đề từ RAM cache — không đụng NFS)
app.post('/api/writing-vocab', requireAuth, async (req, res) => {
  const id = parseInt((req.body || {}).exercise_id, 10);
  if (!id) return res.status(400).json({ error: 'ID đề không hợp lệ.' });
  if (!aiEnabled()) return res.status(503).json({ error: 'Hệ thống AI chưa sẵn sàng.' });
  let ex;
  try {
    ex = await fetchExerciseById(id);
  } catch (fetchErr) {
    return res.status(503).json({ error: 'Server đang khởi động, thử lại sau vài giây.' });
  }
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  try {
    const vocab = await getVocabSuggestions(ex);
    res.json({ vocab });
  } catch (e) {
    console.error('Writing vocab error', e.message);
    res.status(500).json({ error: 'Không thể tạo gợi ý từ vựng lúc này, thử lại sau.' });
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
    res.status(500).json({ error: 'Chấm bài tự động thất bại, vui lòng thử lại sau.' });
  }
});

// ===================== XÁC THỰC EMAIL =====================

// Người dùng bấm link trong email
app.get('/api/verify-email', rlReset, (req, res) => {
  const { token } = req.query;
  if (!token) return res.redirect('/login.html?error=' + encodeURIComponent('Link xác thực không hợp lệ.'));
  const u = db.prepare('SELECT id FROM users WHERE verify_token=?').get(token);
  if (!u) return res.redirect('/login.html?error=' + encodeURIComponent('Link xác thực đã hết hạn hoặc không đúng.'));
  db.prepare('UPDATE users SET email_verified=1, verify_token=NULL WHERE id=?').run(u.id);
  res.redirect('/login.html?verified=1');
});

// Xác thực email bằng mã OTP (6 chữ số) — chỉ dành cho tài khoản CHƯA xác thực.
// (Tài khoản đã xác thực KHÔNG được tạo phiên từ đây — trước kia lỗ hổng này cho phép đăng nhập chỉ bằng email.)
app.post('/api/verify-code', security.limiter({ name: 'vcode', max: 20, windowMs: mins(15) }), (req, res) => {
  const email = str((req.body || {}).email, 254).trim().toLowerCase(), code = str((req.body || {}).code, 12).trim();
  if (!email || !code) return res.status(400).json({ error: 'Thiếu thông tin xác thực.' });
  if (!security.hit('vcodeE:' + email, 6, mins(15)).ok) return res.status(429).json({ error: 'Nhập sai quá nhiều lần. Vui lòng đợi 15 phút.' });
  const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  const bad = () => res.status(400).json({ error: 'Mã xác thực không đúng hoặc đã hết hạn.' });
  if (!u || u.email_verified || !u.verify_token || !/^\d{6}$/.test(code)) return bad();
  const a = Buffer.from(String(u.verify_token)), b2 = Buffer.from(code);
  if (a.length !== b2.length || !crypto.timingSafeEqual(a, b2)) return bad();
  if (!u.verify_token_expiry || new Date(u.verify_token_expiry) < new Date()) return bad();
  db.prepare('UPDATE users SET email_verified=1, verify_token=NULL, verify_token_expiry=NULL WHERE id=?').run(u.id);
  if (u.role === 'student') onStudentActivated(u.id, u.name, u.email);
  startSession(res, u.id, req);
  res.json({ ok: true });
});

// Gửi lại mã OTP xác thực email (tài khoản cũ chưa xác thực)
app.post('/api/resend-verify-code', security.limiter({ name: 'rvcode', max: 10, windowMs: mins(15) }), async (req, res) => {
  const email = str((req.body || {}).email, 254).trim().toLowerCase();
  if (!email) return res.status(400).json({ error: 'Vui lòng nhập email.' });
  if (!emailEnabled()) return res.status(503).json({ error: 'Hệ thống email chưa được cấu hình.' });
  if (!security.hit('rvcodeE:' + email, 3, mins(15)).ok) return res.json({ ok: true });
  const u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
  if (!u || u.email_verified) return res.json({ ok: true }); // không lộ tài khoản có tồn tại hay không
  const code = String(crypto.randomInt(100000, 1000000));
  const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  db.prepare('UPDATE users SET verify_token=?, verify_token_expiry=? WHERE id=?').run(code, expiry, u.id);
  const result = await sendVerificationCode({ name: u.name, email: u.email }, code);
  return result.ok ? res.json({ ok: true })
    : res.status(500).json({ error: 'Gửi email thất bại. Vui lòng thử lại sau.' });
});

// Gửi lại xác thực cho người đã đăng nhập chưa verify
app.post('/api/me/resend-verification', requireAuth, async (req, res) => {
  const u = db.prepare('SELECT * FROM users WHERE id=?').get(req.user.id);
  if (u.email_verified) return res.json({ ok: true, already: true });
  if (!emailEnabled()) return res.status(400).json({ error: 'Hệ thống email chưa được cấu hình.' });
  const code = String(crypto.randomInt(100000, 1000000));
  const expiry = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  db.prepare('UPDATE users SET verify_token=?, verify_token_expiry=? WHERE id=?').run(code, expiry, u.id);
  const result = await sendVerificationCode({ name: u.name, email: u.email }, code);
  return result.ok ? res.json({ ok: true })
    : res.status(500).json({ error: 'Gửi email thất bại. Vui lòng thử lại sau.' });
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
    if (info.verified_email === false) return fail('Email Google này chưa được xác minh, không thể đăng nhập.');
    if (!email) {
      console.error('[Google OAuth] No email in userinfo:', JSON.stringify(info));
      return fail('Không lấy được email từ tài khoản Google.');
    }

    let u = db.prepare('SELECT * FROM users WHERE email=?').get(email);
    if (!u) {
      const r2 = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,created_at) VALUES (?,?,?,?,1,?)')
        .run(cleanName(info.name, email.split('@')[0]) || email.split('@')[0], email, 'google-oauth', 'student', now());
      u = { id: Number(r2.lastInsertRowid) };
      notifyAllStaff('new_student', '🎓 Học sinh mới: ' + cleanName(info.name, email), email + ' vừa đăng ký qua Google.', 'teacher.html?tab=students');
    } else if (!u.email_verified) {
      // Tài khoản này từng được đăng ký bằng mật khẩu nhưng chưa xác minh email: có thể do người khác đăng ký trước bằng email của bạn.
      // Chủ email thật vừa chứng minh qua Google → vô hiệu mật khẩu cũ và đăng xuất mọi phiên cũ.
      const lock = crypto.randomBytes(24).toString('hex');
      db.prepare("UPDATE users SET email_verified=1, pass=CASE WHEN pass='google-oauth' THEN pass ELSE ? END WHERE id=?").run('locked:' + lock, u.id);
      db.prepare('DELETE FROM sessions WHERE user_id=?').run(u.id); dropUserSessionCache(u.id);
    }
    startSession(res, u.id, req);
    res.redirect('/dashboard.html');
  } catch (e) {
    console.error('[Google OAuth] Exception:', e);
    fail('Đăng nhập Google thất bại: ' + e.message);
  }
});

// ===================== API ĐỀ BÀI =====================

// Cache exercise list trong RAM — TTL 60s, invalidate khi thêm/sửa/xóa
const _exCache = new Map(); // key=cacheKey, value={data, ts}
const EX_CACHE_TTL = 60_000;
function exCacheKey(q, role) {
  return `${role}|${q.program||''}|${q.skill||''}|${q.private_only||''}|${q.type||''}`;
}
function exCacheInvalidate() { _exCache.clear(); }
app.locals.exCacheInvalidate = exCacheInvalidate;

// Cache từng bài tập theo ID — lazy: populate khi học sinh vào lần đầu, serve từ RAM sau đó
const _exById = new Map(); // id → exercise row
app.locals.exRamSync = (id) => { try { const r = db.prepare('SELECT id,program,skill,title,content,questions,answer_key,image_url,audio_url,task_type,metadata,auto_grade,is_private,created_at FROM exercises WHERE id=?').get(Number(id)); if (r) _exById.set(Number(id), r); else _exById.delete(Number(id)); } catch (_) {} };

// Cache quyền truy cập đề riêng — key "exerciseId|email(lowercase)" và "exerciseId|userId".
// Đọc từ RAM để check private KHÔNG BAO GIỜ đụng NFS → không thể treo.
const _assignedSet  = new Set(); // "exId|email"  — học sinh được giao đề
// ── Bài tự luận (essay.js) phản chiếu vào hệ thống đề/giao bài/bài nộp chung: các thao tác cũ KHÔNG được sửa/chấm trực tiếp bài loại này ──
const essayTaskOfExercise = (exId) => { try { const r = db.prepare("SELECT metadata FROM exercises WHERE id=? AND task_type='essay'").get(Number(exId)); return r ? (JSON.parse(r.metadata || '{}').essay_task || 0) : 0; } catch (_) { return 0; } };
const essayTaskOfSub = (subId) => { try { const r = db.prepare('SELECT exercise_id FROM submissions WHERE id=?').get(Number(subId)); return r ? essayTaskOfExercise(r.exercise_id) : 0; } catch (_) { return 0; } };
const essayLock = (res, taskId) => res.status(409).json({ error: 'Đây là bài tự luận — hãy chấm / sửa / xoá trong “Giao bài tự luận viết”.', essay_task: taskId, link: 'teacher-essay.html?task=' + taskId });
const _submittedSet = new Set(); // "exId|userId" — học sinh đã từng nộp đề
const _assignmentDeadlines = new Map(); // "exId|email" → deadline (string) — để khoá bài quá hạn
app.locals.addAssigned = (exId, email, deadline) => { _assignedSet.add(Number(exId) + '|' + email); if (deadline) _assignmentDeadlines.set(Number(exId) + '|' + email, deadline); };

// ── Load DB vào RAM qua sql.js (WASM, không cần native addon) ────────────────
// fs.readFile đọc DB file bất đồng bộ (không block event loop dù NFS chậm).
// sql.js parse toàn bộ file trong bộ nhớ → mọi read phục vụ từ RAM, không đụng NFS.
const DATA_DIR_PATH = process.env.DATA_DIR || __dirname;
const DB_FILE_PATH  = path.join(DATA_DIR_PATH, 'data.db');

// 'pending' → warmup chưa xong; 'ready' → OK; 'failed' → lỗi load file
let _warmupState = 'pending';

async function warmExerciseCacheFromFile() {
  try {
    // Nếu DB đang ở chế độ WAL (dù db.js không chủ động bật, file có thể đã ở WAL
    // từ trước), dữ liệu mới nhất nằm trong data.db-wal, KHÔNG nằm trong data.db.
    // fs.readFile bên dưới chỉ đọc data.db → sẽ đọc dữ liệu CŨ nếu không checkpoint
    // trước. PASSIVE không khoá độc quyền, không chờ reader khác → an toàn, không
    // có rủi ro "treo" như khi đổi journal_mode.
    try { db.exec('PRAGMA wal_checkpoint(PASSIVE);'); } catch (e) { /* không sao nếu DB không ở WAL */ }
    const SQL  = await initSqlJs();
    const buf  = await fs.promises.readFile(DB_FILE_PATH); // async — không block event loop
    const memDb = new SQL.Database(new Uint8Array(buf));

    // 1) Đề bài
    const stmt = memDb.prepare(
      'SELECT id,program,skill,title,content,questions,answer_key,' +
      'image_url,audio_url,task_type,metadata,auto_grade,is_private,created_at FROM exercises'
    );
    let exCount = 0;
    while (stmt.step()) {
      const row = stmt.getAsObject();
      _exById.set(Number(row.id), row);
      exCount++;
    }
    stmt.free();

    // 2) Quyền: assignments (exercise_id, student_email) → làm mới toàn bộ Set
    // Đồng thời nạp deadline để khoá bài quá hạn (đề giao riêng).
    _assignedSet.clear();
    _assignmentDeadlines.clear();
    try {
      const aStmt = memDb.prepare('SELECT exercise_id, student_email, deadline FROM assignments');
      while (aStmt.step()) {
        const r = aStmt.getAsObject();
        if (r.exercise_id != null && r.student_email) {
          const key = Number(r.exercise_id) + '|' + String(r.student_email).toLowerCase();
          _assignedSet.add(key);
          if (r.deadline) _assignmentDeadlines.set(key, r.deadline);
        }
      }
      aStmt.free();
    } catch (e) { console.error('[sqljs] load assignments lỗi:', e.message); }

    // 3) Quyền: submissions (exercise_id, user_id) → học sinh đã nộp thì luôn xem lại được
    _submittedSet.clear();
    try {
      const sStmt = memDb.prepare('SELECT exercise_id, user_id FROM submissions');
      while (sStmt.step()) {
        const r = sStmt.getAsObject();
        if (r.exercise_id != null && r.user_id != null)
          _submittedSet.add(Number(r.exercise_id) + '|' + Number(r.user_id));
      }
      sStmt.free();
    } catch (e) { console.error('[sqljs] load submissions lỗi:', e.message); }

    memDb.close();
    _warmupState = 'ready';
    console.log('[sqljs] RAM: ' + exCount + ' đề, ' + _assignedSet.size + ' lượt giao, ' + _submittedSet.size + ' lượt nộp.');
  } catch (e) {
    _warmupState = 'failed';
    console.error('[sqljs] Warm-up thất bại:', e.message);
  }
}

// ── Sao lưu dữ liệu tự động — tránh mất dữ liệu khi có lỗi/redeploy ─────────
// Định kỳ copy nguyên file data.db sang thư mục backups/ (cùng Volume /data,
// sống sót qua redeploy). Có integrity_check trước mỗi lần lưu — nếu DB đang
// lỗi thì KHÔNG ghi đè bản lưu tốt trước đó bằng bản lỗi, đồng thời báo động
// ngay cho admin/giáo viên qua chuông thông báo + email (nếu đã cấu hình).
const BACKUP_DIR = path.join(DATA_DIR_PATH, 'backups');
fs.mkdirSync(BACKUP_DIR, { recursive: true });
const MAX_BACKUPS = 5; // chỉ giữ 5 bản gần nhất (mỗi ngày tối đa 1 bản, và chỉ khi dữ liệu có thay đổi) để không nặng ổ đĩa
const BACKUP_MARK = path.join(BACKUP_DIR, '.last.json');
function pruneBackups() {
  try {
    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('data-') && f.endsWith('.db')).sort();
    while (files.length > MAX_BACKUPS) { const old = files.shift(); try { fs.unlinkSync(path.join(BACKUP_DIR, old)); } catch (e) {} }
    return files.length;
  } catch (e) { return 0; }
}

function runBackup(reason, force) {
  try {
    db.exec('PRAGMA wal_checkpoint(FULL);'); // đẩy hết dữ liệu từ WAL vào file chính trước khi copy
    // Chỉ sao lưu khi cần: dữ liệu đã thay đổi kể từ lần sao lưu trước (bấm tay thì luôn sao lưu)
    let sig = ''; try { const stt = fs.statSync(DB_FILE_PATH); sig = stt.size + ':' + Math.round(stt.mtimeMs); } catch (e) {}
    if (!force) { try { const mk = JSON.parse(fs.readFileSync(BACKUP_MARK, 'utf8')); if (mk && mk.sig === sig) { return { ok: true, skipped: true, reason: 'no_change' }; } } catch (e) {} }
    const check = db.prepare('PRAGMA integrity_check').get();
    const ok = check && check.integrity_check === 'ok';
    if (!ok) {
      console.error('[backup] ⚠️ integrity_check THẤT BẠI — KHÔNG tạo bản sao lưu mới để tránh ghi đè bản tốt trước đó:', check);
      try {
        notifyAllStaff('data_integrity_alert', '⚠️ CẢNH BÁO: dữ liệu có dấu hiệu lỗi',
          'Kiểm tra tính toàn vẹn database thất bại lúc sao lưu tự động. Vui lòng liên hệ kỹ thuật ngay.', null);
      } catch (e) {}
      return { ok: false, reason: 'integrity_check_failed', detail: check };
    }
    const ts = new Date().toISOString().replace(/[:.]/g, '-');
    const destName = `data-${ts}.db`;
    const destPath = path.join(BACKUP_DIR, destName);
    fs.copyFileSync(DB_FILE_PATH, destPath);
    try { fs.writeFileSync(BACKUP_MARK, JSON.stringify({ sig, t: Date.now() })); } catch (e) {}

    // Dọn bớt bản cũ, chỉ giữ MAX_BACKUPS bản gần nhất
    const kept = pruneBackups();
    console.log(`[backup] ✅ Đã sao lưu (${reason || 'định kỳ'}): ${destName} (${kept} bản đang giữ)`);
    return { ok: true, name: destName };
  } catch (e) {
    console.error('[backup] Lỗi sao lưu:', e.message);
    return { ok: false, reason: 'exception', detail: e.message };
  }
}

// Check quyền truy cập đề riêng từ RAM (tức thì, không đụng NFS)
function canAccessPrivate(exId, user) {
  if (!user) return false;
  if (['teacher','admin'].includes(user.role)) return true;
  const email = String(user.email || '').toLowerCase();
  if (_assignedSet.has(exId + '|' + email)) return true;
  if (_submittedSet.has(exId + '|' + user.id)) return true;
  return false;
}

// Lấy deadline (nếu có) của 1 học sinh cho 1 đề giao riêng — từ RAM, không đụng NFS
function getAssignmentDeadline(exId, user) {
  if (!user) return null;
  const email = String(user.email || '').toLowerCase();
  return _assignmentDeadlines.get(exId + '|' + email) || null;
}
function deadlineMs(deadlineStr) {
  if (!deadlineStr) return 0;
  const hasZone = /[+-]\d{2}:?\d{2}$|Z$/i.test(deadlineStr);
  const t = Date.parse(hasZone ? deadlineStr : String(deadlineStr).replace(' ', 'T') + '+07:00');
  return isNaN(t) ? 0 : t;
}
// "2026-10-06T23:59" → "23:59 06/10/2026" (hạn nhập theo giờ Việt Nam, không đổi múi giờ)
function fmtDeadlineVN(s) {
  const m = /^(\d{4})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2}))?/.exec(String(s || ''));
  return m ? (m[4] ? m[4] + ':' + m[5] + ' ' : '') + m[3] + '/' + m[2] + '/' + m[1] : String(s || '');
}
function isPastDeadline(deadlineStr) {
  if (!deadlineStr) return false;
  // Giáo viên nhập deadline qua <input type="datetime-local"> trên trình duyệt ở Việt Nam
  // (giờ ICT, UTC+7) — chuỗi lưu KHÔNG có timezone (vd "2026-07-15T23:59"). Server (Railway)
  // chạy giờ UTC, nên phải tự gắn +07:00 khi so sánh, nếu không sẽ lệch 7 tiếng.
  const hasZone = /[+-]\d{2}:?\d{2}$|Z$/i.test(deadlineStr);
  const iso = hasZone ? deadlineStr : deadlineStr.replace(' ', 'T') + '+07:00';
  return new Date(iso) < new Date();
}

function fetchExerciseById(id) {
  if (_exById.has(id)) return Promise.resolve(_exById.get(id));
  if (_warmupState === 'pending') {
    // Warmup chưa xong — trả lỗi ngay, client sẽ retry sau vài giây
    return Promise.reject(Object.assign(new Error('warming-up'), { warmingUp: true }));
  }
  // Warmup xong (ready hoặc failed) mà không có → bài không tồn tại
  return Promise.resolve(null);
}
// ───────────────────────────────────────────────────────────────────────────

app.get('/api/exercises', requireAuth, (req, res) => {
  const { program, skill, private_only, type } = req.query;
  const isTeacher = req.user && ['teacher','admin'].includes(req.user.role);
  const role = isTeacher ? 'teacher' : 'student';
  const ck = exCacheKey(req.query, role);
  const cached = _exCache.get(ck);
  if (cached && Date.now() - cached.ts < EX_CACHE_TTL) {
    return res.json(cached.data);
  }
  /* Trả thêm content khi lọc aptis_full để client parse JSON metadata */
  const cols = type === 'aptis_full'
    ? 'e.id,e.program,e.skill,e.title,e.content,e.task_type,e.metadata,e.image_url,e.auto_grade,e.is_private,e.created_at,e.created_by,(e.questions IS NOT NULL) AS has_questions,u.name AS creator_name'
    : 'e.id,e.program,e.skill,e.title,e.task_type,e.metadata,e.image_url,e.auto_grade,e.is_private,e.created_at,e.created_by,SUBSTR(e.content,1,200) AS excerpt,(e.questions IS NOT NULL) AS has_questions,u.name AS creator_name';
  let sql = 'SELECT ' + cols + ' FROM exercises e LEFT JOIN users u ON u.id = e.created_by';
  const cond = [], params = [];
  if (program) { cond.push('e.program=?'); params.push(program); }
  if (skill)   { cond.push('e.skill=?');   params.push(skill); }
  if (type === 'aptis_full') {
    cond.push("(e.task_type='aptis_full' OR e.content LIKE '%\"_aptis_full\":true%')");
  }
  if (private_only === '1' && isTeacher) {
    cond.push('e.is_private=1');
  } else if (!isTeacher) {
    cond.push('e.is_private=0');
  }
  if (cond.length) sql += ' WHERE ' + cond.join(' AND ');
  sql += ' ORDER BY e.id ASC';
  const result = { exercises: db.prepare(sql).all(...params) };
  _exCache.set(ck, { data: result, ts: Date.now() });
  res.json(result);
});

app.get('/api/exercises/:id', requireAuth, async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (!id) return res.status(400).json({ error: 'ID đề không hợp lệ.' });

    let ex;
    try {
      ex = await fetchExerciseById(id);
    } catch (fetchErr) {
      if (fetchErr.warmingUp) {
        return res.status(503).set('Retry-After', '5').json({
          error: 'Server đang khởi động, vui lòng chờ 5–10 giây rồi thử lại.',
          warmingUp: true
        });
      }
      console.error('fetchExerciseById error:', fetchErr.message);
      return res.status(503).json({ error: 'Máy chủ đang bận, vui lòng thử lại sau vài giây.' });
    }

    if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
    if (ex.is_private) {
      if (!req.user) return res.status(401).json({ error: 'Bạn cần đăng nhập.' });
      // Check quyền từ RAM — KHÔNG đụng NFS nên không thể treo
      if (!canAccessPrivate(id, req.user)) {
        return res.status(403).json({ error: 'Đề này được giao riêng — bạn chưa được giao.' });
      }
    }
    const result = Object.assign({}, ex);
    result.questions = result.questions ? JSON.parse(result.questions) : null;
    // Đề giao riêng có hạn nộp đã qua → khoá, học sinh không làm bài được nữa
    if (req.user && req.user.role === 'student') {
      try { // chế độ thi do giáo viên bật khi giao bài
        const as = db.prepare('SELECT strict, max_leaves FROM assignments WHERE exercise_id=? AND student_email=? ORDER BY id DESC LIMIT 1').get(id, req.user.email);
        if (as && as.strict) { result.strict = 1; result.max_leaves = as.max_leaves || 3; }
      } catch (_) {}
    }
    if (ex.is_private && req.user && req.user.role === 'student') {
      const dl = getAssignmentDeadline(id, req.user);
      result.deadline = dl;
      result.deadline_locked = isPastDeadline(dl);
    }
    res.json({ exercise: result });
  } catch (err) {
    console.error('GET /api/exercises/:id error:', err);
    res.status(500).json({ error: 'Lỗi tải đề.' });
  }
});

// Giáo viên/Admin tải ảnh hoặc âm thanh, trả về đường dẫn để gắn vào đề
app.post('/api/upload', requireRole('teacher', 'admin'), (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: 'Tệp không hợp lệ hoặc quá lớn (tối đa 20MB, chỉ ảnh hoặc âm thanh).' });
    if (!req.file) return res.status(400).json({ error: 'Thiếu tệp.' });
    const name = checkUpload(req.file, ['image', 'audio']);
    if (!name) return res.status(400).json({ error: 'Nội dung tệp không phải ảnh (JPG, PNG, GIF, WEBP) hoặc âm thanh (MP3, WAV, OGG, M4A, WEBM) hợp lệ.' });
    res.json({ url: '/uploads/' + name });
  });
});

// Học sinh tải BẢN GHI ÂM Speaking của mình (chỉ audio) — dùng khi nộp bài nói
app.post('/api/upload-recording', requireAuth, (req, res) => {
  upload.single('file')(req, res, (err) => {
    if (err) return res.status(400).json({ error: 'Tệp không hợp lệ hoặc quá lớn (tối đa 20MB).' });
    if (!req.file) return res.status(400).json({ error: 'Thiếu tệp ghi âm.' });
    const name = checkUpload(req.file, ['audio']);
    if (!name) return res.status(400).json({ error: 'Chỉ chấp nhận tệp âm thanh hợp lệ.' });
    res.json({ url: '/uploads/' + name });
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
  const newId = Number(r.lastInsertRowid);
  // Cập nhật cache theo ID cụ thể
  const newEx = db.prepare('SELECT id,program,skill,title,content,questions,answer_key,image_url,audio_url,task_type,metadata,auto_grade,is_private,created_at FROM exercises WHERE id=?').get(newId);
  if (newEx) _exById.set(newId, newEx);
  exCacheInvalidate();
  // Báo các giáo viên/admin khác biết có đề mới (trừ người vừa tạo)
  notifyAllStaff('exercise_created', '📚 Đề mới: ' + title, program + ' · ' + skill + ' · Tạo bởi ' + req.user.name, 'teacher.html?tab=bank', req.user.id);
  res.json({ id: newId });
});

// Giáo viên/Admin cập nhật đề
app.put('/api/exercises/:id', requireRole('teacher', 'admin'), (req, res) => {
  { const et = essayTaskOfExercise(req.params.id); if (et) return essayLock(res, et); }
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
  // Cập nhật cache theo ID cụ thể
  const updatedEx = db.prepare('SELECT id,program,skill,title,content,questions,answer_key,image_url,audio_url,task_type,metadata,auto_grade,is_private,created_at FROM exercises WHERE id=?').get(ex.id);
  if (updatedEx) _exById.set(ex.id, updatedEx); else _exById.delete(ex.id);
  exCacheInvalidate();
  res.json({ ok: true });
});

// Giáo viên/Admin xoá đề
app.delete('/api/exercises/:id', requireRole('teacher', 'admin'), (req, res) => {
  { const et = essayTaskOfExercise(req.params.id); if (et) return essayLock(res, et); }
  const ex = db.prepare('SELECT id,created_by FROM exercises WHERE id=?').get(req.params.id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (req.user.role !== 'admin' && ex.created_by !== req.user.id)
    return res.status(403).json({ error: 'Bạn không có quyền xoá đề này.' });
  db.prepare('DELETE FROM exercises WHERE id=?').run(ex.id);
  _exById.delete(ex.id);
  exCacheInvalidate();
  res.json({ ok: true });
});

// Bulk delete exercises (teacher xóa đề của mình; admin xóa bất kỳ)
app.post('/api/exercises/bulk-delete', requireRole('teacher', 'admin'), (req, res) => {
  const { ids: rawIds } = req.body || {}; const ids = Array.isArray(rawIds) ? rawIds.filter(i => !essayTaskOfExercise(i)) : rawIds;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'Thiếu danh sách ids.' });
  const isAdmin = req.user.role === 'admin';
  const del = db.prepare('DELETE FROM exercises WHERE id=?' + (isAdmin ? '' : ' AND created_by=?'));
  let count = 0;
  ids.forEach(id => {
    const r = isAdmin ? del.run(Number(id)) : del.run(Number(id), req.user.id);
    if (r.changes) _exById.delete(Number(id));
    count += r.changes;
  });
  exCacheInvalidate();
  res.json({ deleted: count });
});

// ===================== API NỘP BÀI =====================

app.post('/api/submissions', requireAuth, (req, res) => {
  const { exercise_id, answers } = req.body || {};
  if (essayTaskOfExercise(exercise_id)) return res.status(409).json({ error: 'Bài tự luận được làm tại trang Bài tự luận.', link: 'essay.html?id=' + essayTaskOfExercise(exercise_id) });
  const ex = db.prepare('SELECT * FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });
  if (ex.is_private && req.user.role === 'student') {
    const ok = db.prepare('SELECT id, deadline FROM assignments WHERE exercise_id=? AND student_email=? ORDER BY id DESC LIMIT 1').get(exercise_id, req.user.email);
    if (!ok) return res.status(403).json({ error: 'Đề này được giao riêng — bạn chưa được giao.' });
    if (isPastDeadline(ok.deadline)) {
      return res.status(403).json({ error: 'Đã quá hạn nộp bài (hạn: ' + fmtDeadline(ok.deadline) + '). Bạn không thể nộp bài này nữa.', deadline_locked: true });
    }
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
  const newSubId = Number(r.lastInsertRowid);
  // Cập nhật RAM cache NGAY (giống assignments) — học sinh vừa nộp có thể xem lại ngay
  _submittedSet.add(Number(exercise_id) + '|' + req.user.id);

  // Bài cần giáo viên chấm tay (Writing riêng / Speaking) → báo cho giáo viên phụ trách, mở thẳng bài cần chấm
  if (status === 'pending') {
    let teacherId = null;
    if (ex.is_private) {
      const asg = db.prepare('SELECT assigned_by FROM assignments WHERE exercise_id=? AND student_email=? ORDER BY id DESC LIMIT 1')
        .get(exercise_id, req.user.email);
      teacherId = asg ? asg.assigned_by : null;
    } else {
      teacherId = ex.created_by || null;
    }
    const notifTitle = '📤 Bài nộp mới: ' + ex.title;
    const notifBody  = req.user.name + ' vừa nộp bài ' + ex.skill + ' — cần chấm.';
    const gradeLink  = 'teacher.html?tab=grade&sub=' + newSubId;
    if (teacherId) notifyUser(teacherId, 'submission_received', notifTitle, notifBody, gradeLink);
    else notifyAllStaff('submission_received', notifTitle, notifBody, gradeLink);
  }

  res.json({ id: newSubId, score, max_score: max, status });
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
    SELECT s.id, s.exercise_id, s.score, s.max_score, s.status, s.feedback, s.answers, s.submitted_at,
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
  const MAX_SCALE = { IELTS: 9, KET: 15, PET: 20, FCE: 20, APTIS: 50 };

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
          // Ưu tiên max_score thực từ submission (chính xác hơn hằng số)
          const denom = sub.max_score > 0 ? sub.max_score : (MAX_SCALE[sub.program] || 9);
          return { raw, pct: Math.round(raw / denom * 100) };
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
  const b = req.body || {};
  const name = cleanName(b.name), email = str(b.email, 254).trim().toLowerCase(), password = str(b.password, 129);
  if (!name || !email || !password) return res.status(400).json({ error: 'Thiếu thông tin (họ tên cần có chữ cái, không chứa ký tự đặc biệt).' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Email không hợp lệ.' });
  if (password.length < 8) return res.status(400).json({ error: 'Mật khẩu giáo viên cần tối thiểu 8 ký tự.' });
  if (db.prepare('SELECT id FROM users WHERE email=?').get(email))
    return res.status(409).json({ error: 'Email đã tồn tại.' });
  const r = db.prepare('INSERT INTO users (name,email,pass,role,email_verified,created_at) VALUES (?,?,?,?,1,?)')
    .run(name, email, hashPassword(password), 'teacher', now());
  res.json({ id: Number(r.lastInsertRowid) });
});

// Danh sách người dùng (phân trang + tìm kiếm phía máy chủ — hàng chục nghìn tài khoản vẫn nhẹ)
app.get('/api/admin/users', requireRole('admin'), (req, res) => {
  const q = String(req.query.q || '').trim().toLowerCase().slice(0, 80);
  const limit = Math.max(1, Math.min(200, parseInt(req.query.limit, 10) || 50)), offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
  const where = q ? "WHERE LOWER(u.name) LIKE ? ESCAPE '\\' OR LOWER(u.email) LIKE ? ESCAPE '\\'" : '';
  const like = '%' + q.replace(/[\\%_]/g, (c) => '\\' + c) + '%', args = q ? [like, like] : [];
  const rows = db.prepare(`
    SELECT u.id, u.name, u.email, u.role, u.email_verified, u.created_at,
           (SELECT COUNT(*) FROM submissions s WHERE s.user_id = u.id) AS submissions
    FROM users u ${where} ORDER BY u.id DESC LIMIT ? OFFSET ?`).all(...args, limit, offset);
  const total = db.prepare(`SELECT COUNT(*) c FROM users u ${where}`).get(...args).c;
  const counts = {}; db.prepare('SELECT role, COUNT(*) c FROM users GROUP BY role').all().forEach((r) => { counts[r.role] = r.c; });
  res.json({ users: rows, total, counts, offset, limit });
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
  const { ids: rawIds } = req.body || {}; const ids = Array.isArray(rawIds) ? rawIds.filter(i => !essayTaskOfExercise(i)) : rawIds;
  if (!Array.isArray(ids) || !ids.length) return res.status(400).json({ error: 'Thiếu danh sách ids.' });
  let count = 0;
  ids.map(Number).forEach(id => { count += db.prepare('DELETE FROM exercises WHERE id=?').run(id).changes; });
  exCacheInvalidate();
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
  const strict = (req.body || {}).strict ? 1 : 0, maxLeaves = Math.max(1, Math.min(10, parseInt((req.body || {}).max_leaves, 10) || 3));
  if (!exercise_id) return res.status(400).json({ error: 'Thiếu thông tin đề.' });
  const ex = db.prepare('SELECT id,title,skill,is_private FROM exercises WHERE id=?').get(exercise_id);
  if (!ex) return res.status(404).json({ error: 'Không tìm thấy đề.' });

  // Xây dựng danh sách email cần giao
  let emails = [];
  let groupName = null;
  if (group_id) {
    const grp = db.prepare('SELECT id,name FROM groups WHERE id=?').get(group_id);
    if (!grp) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
    groupName = grp.name;
    const members = db.prepare('SELECT u.email FROM group_members gm JOIN users u ON u.id=gm.user_id WHERE gm.group_id=? AND gm.user_id IS NOT NULL').all(group_id);
    emails = members.map(m => m.email);
  } else if (Array.isArray(student_emails) && student_emails.length) {
    emails = student_emails.map(e => e.trim().toLowerCase()).filter(Boolean);
  } else {
    return res.status(400).json({ error: 'Thiếu danh sách học sinh hoặc lớp.' });
  }

  if (group_id) {
    try { db.prepare('INSERT INTO group_assignments (group_id,exercise_id,assigned_by,deadline,note,created_at,strict,max_leaves) VALUES (?,?,?,?,?,?,?,?) ON CONFLICT(group_id,exercise_id) DO UPDATE SET deadline=excluded.deadline, note=excluded.note, assigned_by=excluded.assigned_by, strict=excluded.strict, max_leaves=excluded.max_leaves')
      .run(group_id, exercise_id, req.user.id, deadline || null, note || null, now(), strict, maxLeaves); } catch (e) { console.error('[group_assignments]', e.message); }
  }
  const ins = db.prepare('INSERT INTO assignments (exercise_id,student_email,assigned_by,deadline,note,created_at,group_id,strict,max_leaves) VALUES (?,?,?,?,?,?,?,?,?)');
  let count = 0;
  for (const email of emails) {
    const exists = db.prepare('SELECT id FROM assignments WHERE exercise_id=? AND student_email=?').get(exercise_id, email);
    if (exists && (req.body || {}).strict !== undefined) db.prepare('UPDATE assignments SET strict=?, max_leaves=? WHERE id=?').run(strict, maxLeaves, exists.id); // giao lại để bật/tắt chế độ thi
    if (!exists) {
      ins.run(exercise_id, email, req.user.id, deadline || null, note || null, now(), group_id || null, strict, maxLeaves);
      count++;
      if (deadline) _assignmentDeadlines.set(Number(exercise_id) + '|' + email, deadline);
    }
    // Cập nhật RAM cache NGAY — không chờ chu kỳ làm mới 20s (tránh học sinh bấm vào
    // bài vừa được giao mà bị báo "chưa được giao" do cache chưa kịp cập nhật)
    _assignedSet.add(Number(exercise_id) + '|' + email);
    const u = db.prepare('SELECT id,name FROM users WHERE email=?').get(email);
    const assignLink = baseUrl(req) + '/assigned.html';
    if (emailEnabled()) {
      const dline = deadline ? `<p>⏰ Hạn nộp: <b>${fmtDeadline(deadline)}</b></p>` : '';
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
    // Thông báo trong ứng dụng + push cho học sinh (nếu đã có tài khoản) — mở thẳng vào bài
    if (u) notifyUser(u.id, 'assignment_created', '📝 Bạn có bài tập mới!', ex.title + (groupName ? ' · Lớp ' + groupName : ''), practiceUrlFor(ex.skill, ex.id, true));
  }
  res.json({ ok: true, assigned: count, group_name: groupName });
});

// Học sinh xem bài tập được giao cho mình
app.get('/api/my-assignments', requireAuth, (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT a.id, a.deadline, a.note, a.created_at AS assigned_at,
             e.id AS exercise_id, e.title, e.program, e.skill, e.is_private, e.auto_grade, e.task_type, e.metadata,
             e.content AS exercise_content, e.image_url AS exercise_image_url, e.audio_url AS exercise_audio_url,
             u.id AS teacher_id, u.name AS teacher_name,
             g.name AS group_name,
             sub.id AS submission_id, sub.status AS submission_status,
             sub.score AS submission_score, sub.max_score AS submission_max,
             sub.feedback AS submission_feedback, sub.answers AS submission_answers,
             sub.submitted_at
      FROM assignments a
      JOIN exercises e ON e.id = a.exercise_id
      JOIN users u ON u.id = a.assigned_by
      LEFT JOIN groups g ON g.id = a.group_id
      LEFT JOIN submissions sub ON sub.exercise_id = e.id AND sub.user_id = ?
      WHERE a.student_email = ?
      ORDER BY a.id DESC
    `).all(req.user.id, req.user.email);
    res.json({ assignments: rows });
  } catch (err) {
    console.error('my-assignments error:', err);
    res.status(500).json({ error: 'Lỗi tải bài tập.' });
  }
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
  // Lớp thật của từng học sinh (theo danh sách lớp của giáo viên) → để lọc / nhóm theo lớp, không phụ thuộc cách giao bài
  const admin = req.user.role === 'admin';
  const groups = (admin ? db.prepare('SELECT id,name FROM groups ORDER BY name').all() : db.prepare('SELECT id,name FROM groups WHERE teacher_id=? ORDER BY name').all(req.user.id))
    .map(g => ({ id: g.id, name: g.name, members: db.prepare('SELECT COUNT(*) c FROM group_members WHERE group_id=? AND user_id IS NOT NULL').get(g.id).c }));
  const gset = new Set(groups.map(g => g.id)), byUser = new Map();
  if (groups.length) {
    const ph = groups.map(() => '?').join(',');
    for (const m of db.prepare(`SELECT gm.user_id, gm.group_id FROM group_members gm WHERE gm.user_id IS NOT NULL AND gm.group_id IN (${ph})`).all(...groups.map(g => g.id))) {
      if (!byUser.has(m.user_id)) byUser.set(m.user_id, []);
      byUser.get(m.user_id).push(m.group_id);
    }
  }
  for (const r of rows) r.class_ids = (byUser.get(r.student_id) || []).filter(id => gset.has(id));
  res.json({ assignments: rows, groups });
});

// Giáo viên xem chi tiết bài nộp của học sinh (kèm nội dung bài viết)
app.get('/api/teacher/submission/:id', requireRole('teacher','admin'), (req, res) => {
  const sub = db.prepare(`
    SELECT s.*, u.name AS student_name, u.email AS student_email,
           e.title, e.program, e.skill, e.content AS exercise_content,
           e.image_url AS exercise_image_url, e.audio_url AS exercise_audio_url
    FROM submissions s
    JOIN users u ON u.id = s.user_id
    JOIN exercises e ON e.id = s.exercise_id
    WHERE s.id = ?
  `).get(Number(req.params.id));
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy.' });
  sub.essay_task = essayTaskOfExercise(sub.exercise_id) || 0;
  try {
    const st = db.prepare('SELECT strict, max_leaves FROM assignments WHERE exercise_id=? AND student_email=? ORDER BY id DESC LIMIT 1').get(sub.exercise_id, sub.student_email);
    if (st && st.strict) {
      const ev = db.prepare('SELECT type, created_at FROM exam_events WHERE user_id=? AND exercise_id=? ORDER BY id ASC LIMIT 60').all(sub.user_id, sub.exercise_id);
      sub.integrity = { strict: true, max_leaves: st.max_leaves, leaves: ev.filter(e => ['tab','blur','reopen'].includes(e.type)).length, pastes: ev.filter(e => ['paste','copy'].includes(e.type)).length, events: ev };
    }
  } catch (_) {}
  res.json({ submission: sub });
});

// Giáo viên chấm thủ công bài nộp
app.post('/api/teacher/grade/:id', requireRole('teacher','admin'), async (req, res) => {
  { const et = essayTaskOfSub(req.params.id); if (et) return essayLock(res, et); }
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
  // Thông báo trong ứng dụng + push cho học sinh — mở thẳng kết quả bài nộp này
  notifyUser(sub.user_id, 'grade_received', '✅ Bài của bạn đã được chấm!', sub.exercise_title, 'assigned.html?open=' + subId);
  res.json({ ok: true });
});

const _aiGradeHits = new Map();
// Giáo viên chấm bài bằng AI (dùng lại gradeWriting đã có)
app.post('/api/teacher/ai-grade/:id', requireRole('teacher','admin'), async (req, res) => {
  { const et = essayTaskOfSub(req.params.id); if (et) return essayLock(res, et); }
  const subId = Number(req.params.id);
  const { task_type_override, teacher_note } = req.body || {};
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

  // Khi chấm lại (có teacher_note), lấy kết quả chấm cũ để AI so sánh và điều chỉnh đúng chỗ
  let previousResult = null;
  if (teacher_note && sub.feedback) {
    try { previousResult = typeof sub.feedback === 'string' ? JSON.parse(sub.feedback) : sub.feedback; } catch (e) { previousResult = null; }
    if (previousResult) { previousResult.teacher_score = sub.score; previousResult.teacher_max = sub.max_score; } // điểm giáo viên đã chỉnh tay (nếu có)
  }
  { // chặn chấm AI quá nhiều trong 1 giờ (tránh tốn phí khi bấm nhầm hàng loạt)
    const arr = (_aiGradeHits.get(req.user.id) || []).filter(t => Date.now() - t < 3600e3);
    if (arr.length >= 300) return res.status(429).json({ error: 'Bạn đã chấm AI 300 bài trong 1 giờ qua. Hãy nghỉ một lát rồi chấm tiếp nhé.' });
    arr.push(Date.now()); _aiGradeHits.set(req.user.id, arr);
  }

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
    const result = await gradeWriting(ex, essay, null, teacher_note || null, previousResult);
    // Tính max_score từ scale_label (ví dụ "A2 Key (0–15)" → 15, "B2 First (0–20)" → 20)
    let maxScore = 5;
    if (result.scale_label) {
      const m = result.scale_label.match(/\(0[–\-](\d+)\)/);
      if (m) maxScore = parseInt(m[1]);
    }
    // Lịch sử các lần chấm: lần này là lần mấy, và tóm tắt các lần trước (kèm góp ý của giáo viên)
    if (previousResult) {
      result.rounds = (Array.isArray(previousResult.rounds) ? previousResult.rounds : []).concat([{
        round: previousResult.round || 1, overall_score: previousResult.overall_score ?? null, scale_label: previousResult.scale_label || null,
        final_score: previousResult.teacher_score ?? null, summary: previousResult.summary || '', teacher_comment: previousResult.teacher_comment || '',
        teacher_note: String(teacher_note || '').slice(0, 2000), at: now(),
      }]).slice(-5);
      result.round = (previousResult.round || 1) + 1;
      if (previousResult.visibility !== undefined) result.visibility = previousResult.visibility;
      if (previousResult.teacher_comment) result.teacher_comment = previousResult.teacher_comment; // giữ nhận xét giáo viên đã viết cho học sinh
    } else result.round = 1;
    // Lưu kết quả với status='pending_review' — chưa gửi cho học sinh
    db.prepare('UPDATE submissions SET feedback=?, score=?, max_score=?, status=? WHERE id=?')
      .run(JSON.stringify(result), result.overall_score ?? null, maxScore, 'pending_review', subId);
    res.json({ ok: true, result, max_score: maxScore });
  } catch (e) {
    console.error('[teacher/ai-grade]', e.message);
    console.error('[ai-grade]', e.message); res.status(500).json({ error: 'Chấm AI thất bại, vui lòng thử lại sau.' });
  }
});

// Cambridge 2-part grade conversion (chỉ dùng khi có điểm tổng 2 part)
// KET: tổng tối đa 30 (2×15), PET/FCE: tổng tối đa 40 (2×20)
function cambridgeTwoPartGrade(program, totalScore, totalMax) {
  if (!['KET', 'PET', 'FCE'].includes(program)) return null;
  const pct = totalScore / totalMax;
  if (program === 'KET') {
    // KET A2 Key: tổng 2 part = 0–30
    if (pct >= 0.90) return { grade: 'A', label: 'Merit — Xuất sắc' };
    if (pct >= 0.75) return { grade: 'B', label: 'Pass with Merit' };
    if (pct >= 0.60) return { grade: 'C', label: 'Pass — Đạt' };
    if (pct >= 0.45) return { grade: 'A1', label: 'A1 — Gần đạt' };
    return { grade: 'F', label: 'Fail — Chưa đạt' };
  }
  if (program === 'PET') {
    // PET B1 Preliminary: tổng 2 part = 0–40
    if (pct >= 0.90) return { grade: 'A', label: 'Distinction — Xuất sắc' };
    if (pct >= 0.80) return { grade: 'B', label: 'Merit — Giỏi' };
    if (pct >= 0.70) return { grade: 'C', label: 'Pass — Đạt' };
    if (pct >= 0.55) return { grade: 'B1-', label: 'B1 (gần đạt)' };
    return { grade: 'F', label: 'Fail — Chưa đạt' };
  }
  // FCE B2 First: tổng 2 part = 0–40
  if (pct >= 0.90) return { grade: 'A', label: 'Grade A — Xuất sắc' };
  if (pct >= 0.75) return { grade: 'B', label: 'Grade B — Giỏi' };
  if (pct >= 0.60) return { grade: 'C', label: 'Grade C — Đạt' };
  if (pct >= 0.45) return { grade: 'B1', label: 'B1 (gần đạt)' };
  return { grade: 'F', label: 'Fail — Chưa đạt' };
}

// Giáo viên lưu chỉnh sửa (không gửi cho học sinh, giữ pending_review)
// Helper: merge teacher edits (comment + visibility + error_list + bài mẫu đã sửa) vào feedback JSON
function mergeTeacherEdits(existingFeedback, { teacher_comment, visibility, error_list, suggested_writing, criteria } = {}) {
  let fb = {};
  try { fb = typeof existingFeedback === 'string' ? JSON.parse(existingFeedback) : (existingFeedback || {}); } catch(e) {}
  if (teacher_comment !== undefined) fb.teacher_comment = teacher_comment;
  if (visibility      !== undefined) fb.visibility      = visibility;
  if (Array.isArray(error_list)) fb.error_list = error_list;
  if (suggested_writing !== undefined) fb.suggested_writing = suggested_writing;
  if (Array.isArray(criteria)) fb.criteria = criteria;
  return JSON.stringify(fb);
}

app.post('/api/teacher/save-draft/:id', requireRole('teacher','admin'), (req, res) => {
  { const et = essayTaskOfSub(req.params.id); if (et) return essayLock(res, et); }
  const subId = Number(req.params.id);
  const { score, max_score, teacher_comment, visibility, error_list, suggested_writing, criteria } = req.body || {};
  const sub = db.prepare('SELECT id, feedback FROM submissions WHERE id=?').get(subId);
  if (!sub) return res.status(404).json({ error: 'Không tìm thấy.' });
  const feedbackJson = mergeTeacherEdits(sub.feedback, { teacher_comment, visibility, error_list, suggested_writing, criteria });
  db.prepare('UPDATE submissions SET score=?, max_score=?, feedback=?, status=? WHERE id=?')
    .run(score ?? null, max_score ?? null, feedbackJson, 'pending_review', subId);
  res.json({ ok: true });
});

// Giáo viên xác nhận & gửi kết quả chấm cho học sinh (dùng cho cả gửi 1 bài và gửi hàng loạt)
function finalizeGrade(subId, edits, req) {
  const { score, max_score, teacher_comment, visibility, error_list, suggested_writing, criteria } = edits || {};
  const sub = db.prepare(`
    SELECT s.*, u.name AS student_name, u.email AS student_email, e.title AS exercise_title
    FROM submissions s JOIN users u ON u.id=s.user_id JOIN exercises e ON e.id=s.exercise_id
    WHERE s.id=?
  `).get(subId);
  if (!sub) return { status: 404, error: 'Không tìm thấy bài nộp.' };
  const feedbackJson = mergeTeacherEdits(sub.feedback, { teacher_comment, visibility, error_list, suggested_writing, criteria });
  const finalScore    = score    ?? sub.score;
  const finalMaxScore = max_score ?? sub.max_score ?? 5;
  db.prepare('UPDATE submissions SET score=?, max_score=?, feedback=?, status=? WHERE id=?')
    .run(finalScore, finalMaxScore, feedbackJson, 'graded', subId);
  const link = baseUrl(req) + '/assigned.html';
  const scoreText = finalScore != null ? `${finalScore}/${finalMaxScore}` : 'Đã chấm';
  if (emailEnabled()) {
    const commentHtml = teacher_comment
      ? `<p style="margin:14px 0;padding:12px;background:#f5f3ff;border-left:3px solid #7B6EF6;border-radius:6px">${htmlEsc(teacher_comment)}</p>` : '';
    sendBrevoEmail(
      { email: sub.student_email, name: sub.student_name },
      `Bài của bạn đã được chấm — ${sub.exercise_title}`,
      `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7">
        <h2 style="color:#6F58EE">✅ Bài của bạn đã được chấm!</h2>
        <p>Bài tập: <b>${htmlEsc(sub.exercise_title)}</b></p>
        <p>Điểm số: <b style="font-size:20px;color:#6F58EE">${scoreText}</b></p>
        ${commentHtml}
        <p style="margin:22px 0"><a href="${link}" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Xem kết quả chi tiết</a></p>
      </div>`
    ).catch(() => {});
  }
  notifyUser(sub.user_id, 'grade_received', '✅ Bài của bạn đã được chấm!', sub.exercise_title, 'assigned.html?open=' + subId);
  return { ok: true };
}
app.post('/api/teacher/send-grade/:id', requireRole('teacher','admin'), async (req, res) => {
  { const et = essayTaskOfSub(req.params.id); if (et) return essayLock(res, et); }
  const r = finalizeGrade(Number(req.params.id), req.body || {}, req);
  if (r.error) return res.status(r.status || 400).json({ error: r.error });
  res.json({ ok: true });
});

// ───────────── CHẤM HÀNG LOẠT BÀI WRITING: hàng đợi + gửi nhiều bài một lúc ─────────────
// Hàng đợi bài Writing của giáo viên (đề mình tạo hoặc mình giao; quản trị viên thấy tất cả)
app.get('/api/teacher/writing-queue', requireRole('teacher','admin'), (req, res) => {
  const admin = req.user.role === 'admin';
  const scope = admin ? '' : 'AND (e.created_by = ? OR EXISTS (SELECT 1 FROM assignments a WHERE a.exercise_id = s.exercise_id AND a.assigned_by = ?))';
  const sa = admin ? [] : [req.user.id, req.user.id];
  const base = `FROM submissions s JOIN exercises e ON e.id = s.exercise_id JOIN users u ON u.id = s.user_id
    WHERE LOWER(e.skill) = 'writing' AND UPPER(e.program) <> 'APTIS' AND COALESCE(e.task_type,'') <> 'essay' AND s.answers LIKE '%essay%' ${scope}`;
  const cnt = {};
  for (const r of db.prepare(`SELECT s.status AS st, COUNT(*) AS c ${base} AND (s.status IN ('pending','pending_review') OR (s.status='graded' AND s.submitted_at >= datetime('now','-14 days'))) GROUP BY s.status`).all(...sa)) cnt[r.st] = r.c;
  const want = String(req.query.status || 'todo');
  const only = Number(req.query.only) || 0;
  const stCond = only ? ('s.id = ' + only) : want === 'draft' ? "s.status = 'pending_review'" : want === 'sent' ? "s.status = 'graded' AND s.submitted_at >= datetime('now','-14 days')" : "s.status = 'pending'";
  const exId = Number(req.query.exercise) || 0, gid = Number(req.query.class) || 0;
  const rows = db.prepare(`SELECT s.id, s.user_id, s.exercise_id, s.answers, s.score, s.max_score, s.status, s.feedback, s.submitted_at,
      u.name AS student_name, u.email AS student_email, e.title, e.program, e.task_type
    ${base} AND ${stCond} ${exId ? 'AND s.exercise_id = ' + exId : ''}
    ${gid ? 'AND EXISTS (SELECT 1 FROM group_members gm WHERE gm.group_id = ' + gid + ' AND gm.user_id = s.user_id)' : ''}
    ORDER BY s.submitted_at ASC LIMIT 300`).all(...sa);
  const uids = [...new Set(rows.map(r => r.user_id))], cls = new Map();
  for (let i = 0; i < uids.length; i += 400) {
    const part = uids.slice(i, i + 400);
    for (const m of db.prepare(`SELECT gm.user_id, g.name FROM group_members gm JOIN groups g ON g.id = gm.group_id WHERE gm.user_id IN (${part.map(() => '?').join(',')})`).all(...part)) {
      if (!cls.has(m.user_id)) cls.set(m.user_id, []); cls.get(m.user_id).push(m.name);
    }
  }
  const items = rows.map(r => {
    let essay = ''; try { const a = JSON.parse(r.answers); essay = String(a.essay || ''); } catch (_) {}
    let fb = null; try { fb = r.feedback ? JSON.parse(r.feedback) : null; } catch (_) {}
    return {
      id: r.id, student: { id: r.user_id, name: r.student_name, email: r.student_email }, classes: cls.get(r.user_id) || [],
      exercise: { id: r.exercise_id, title: r.title, program: r.program }, submitted_at: r.submitted_at, status: r.status,
      essay, words: essay.split(/\s+/).filter(Boolean).length, score: r.score, max_score: r.max_score,
      leaves: db.prepare("SELECT COUNT(*) AS c FROM exam_events WHERE user_id=? AND exercise_id=? AND type IN ('tab','blur','reopen')").get(r.user_id, r.exercise_id).c,
      pastes: db.prepare("SELECT COUNT(*) AS c FROM exam_events WHERE user_id=? AND exercise_id=? AND type IN ('paste','copy')").get(r.user_id, r.exercise_id).c,
      ai: fb ? {
        overall_score: fb.overall_score ?? null, scale_label: fb.scale_label || '', summary: fb.summary || '',
        criteria: Array.isArray(fb.criteria) ? fb.criteria.map(c => ({ name: c.name, score: c.score, max: c.max, comment: c.comment || '' })) : [],
        error_count: Array.isArray(fb.error_list) ? fb.error_list.length : 0, teacher_comment: fb.teacher_comment || '',
        round: fb.round || 1, rounds: Array.isArray(fb.rounds) ? fb.rounds : [],
      } : null,
    };
  });
  const exMap = new Map(); for (const r of db.prepare(`SELECT e.id, e.title, COUNT(*) AS c ${base} AND ${stCond} GROUP BY e.id ORDER BY e.title`).all(...sa)) exMap.set(r.id, { id: r.id, title: r.title, count: r.c });
  res.json({ counts: { todo: cnt.pending || 0, draft: cnt.pending_review || 0, sent: cnt.graded || 0 }, items, exercises: [...exMap.values()], ai_ready: aiEnabled() });
});
// Duyệt & gửi hàng loạt: chỉ các bài đã có điểm nháp (AI hoặc giáo viên) và đang ở trạng thái chờ duyệt
app.post('/api/teacher/send-grade-batch', requireRole('teacher','admin'), (req, res) => {
  const ids = Array.isArray((req.body || {}).ids) ? req.body.ids.map(Number).filter(Boolean).slice(0, 100) : [];
  if (!ids.length) return res.status(400).json({ error: 'Chưa chọn bài nào.' });
  let sent = 0; const skipped = [];
  for (const id of ids) {
    const s = db.prepare("SELECT s.id, s.status, s.score, e.created_by FROM submissions s JOIN exercises e ON e.id=s.exercise_id WHERE s.id=?").get(id);
    if (essayTaskOfSub(id)) { skipped.push(id); continue; }
    if (!s || s.status !== 'pending_review' || s.score == null) { skipped.push(id); continue; }
    if (req.user.role !== 'admin' && s.created_by !== req.user.id && !db.prepare('SELECT 1 FROM assignments a JOIN submissions x ON x.exercise_id=a.exercise_id WHERE x.id=? AND a.assigned_by=? LIMIT 1').get(id, req.user.id)) { skipped.push(id); continue; }
    const r = finalizeGrade(id, {}, req); if (r.ok) sent++; else skipped.push(id);
  }
  res.json({ ok: true, sent, skipped });
});

// Giáo viên lấy bài mẫu AI cho một đề (từ submission_id)
app.post('/api/teacher/model-answer/:id', requireRole('teacher','admin'), async (req, res) => {
  { const et = essayTaskOfSub(req.params.id); if (et) return essayLock(res, et); }
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
    console.error('[model-answer]', e.message); res.status(500).json({ error: 'Không thể tạo bài mẫu, vui lòng thử lại sau.' });
  }
});

// Giáo viên sửa bài đã giao (deadline + note)
app.put('/api/teacher/assignments/:id', requireRole('teacher','admin'), (req, res) => {
  const { deadline, note } = req.body || {};
  const id = Number(req.params.id);
  const row = db.prepare('SELECT id, exercise_id, student_email FROM assignments WHERE id=? AND assigned_by=?').get(id, req.user.id);
  if (!row) return res.status(404).json({ error: 'Không tìm thấy bài đã giao.' });
  db.prepare('UPDATE assignments SET deadline=?, note=? WHERE id=?')
    .run(deadline || null, note || null, id);
  // Cập nhật RAM cache NGAY để khoá/mở khoá bài phản ánh đúng ngay lập tức
  const key = Number(row.exercise_id) + '|' + String(row.student_email).toLowerCase();
  if (deadline) _assignmentDeadlines.set(key, deadline); else _assignmentDeadlines.delete(key);
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

// Admin tải về bản sao database (backup) — bản LIVE hiện tại
// ===== Quản trị email: xem nhật ký + gửi thử + cấp mã đặt lại mật khẩu khi email không tới =====
app.get('/api/admin/email-status', requireRole('admin'), async (req, res) => {
  const out = { configured: emailEnabled(), from: fromEmail() || null, keyLength: brevoKey().length, account: null, hint: '', log: [] };
  try { out.log = db.prepare('SELECT id,to_email,subject,ok,status,detail,created_at FROM email_log ORDER BY id DESC LIMIT 20').all(); } catch (e) {}
  if (out.configured) {
    try {
      const r = await fetch('https://api.brevo.com/v3/account', { headers: { 'api-key': brevoKey(), accept: 'application/json' }, signal: AbortSignal.timeout(10000) });
      const txt = await r.text();
      if (r.ok) {
        let j = {}; try { j = JSON.parse(txt); } catch (e) {}
        const credits = (j.plan || []).map(p => ({ type: p.type, credits: p.credits }));
        out.account = { ok: true, email: j.email || null, plan: credits };
      } else {
        out.account = { ok: false, status: r.status, detail: txt.slice(0, 300) };
        out.hint = explainBrevoError(r.status, txt);
      }
    } catch (e) { out.account = { ok: false, detail: e.message }; out.hint = explainBrevoError(0, e.message); }
  } else {
    out.hint = 'Chưa có BREVO_API_KEY hoặc FROM_EMAIL trong Railway → Variables.';
  }
  const lastFail = out.log.find(l => !l.ok);
  if (!out.hint && lastFail && out.log[0] && !out.log[0].ok) out.hint = explainBrevoError(lastFail.status, lastFail.detail);
  res.json(out);
});

app.post('/api/admin/email-test', requireRole('admin'), security.limiter({ name: 'mailtest', max: 6, windowMs: mins(10), by: 'user' }), async (req, res) => {
  const to = str((req.body || {}).to, 254).trim().toLowerCase() || req.user.email;
  if (!EMAIL_RE.test(to)) return res.status(400).json({ error: 'Email nhận thử không hợp lệ.' });
  const r = await sendBrevoEmail({ email: to, name: 'Quản trị' }, 'Email thử — English With Tom',
    '<div style="font-family:sans-serif;font-size:15px">✅ Nếu bạn đọc được email này, hệ thống gửi email của English With Tom đang hoạt động bình thường.</div>');
  res.json(r.ok ? { ok: true, to } : { ok: false, status: r.status || null, detail: r.detail || '', hint: explainBrevoError(r.status, r.detail) });
});

// Cấp mã OTP đặt lại mật khẩu thủ công (khi email không tới) — gửi cho học sinh qua Zalo/nhắn tin
app.post('/api/admin/users/:id/reset-code', requireRole('admin', 'teacher'), security.limiter({ name: 'rcode', max: 30, windowMs: mins(60), by: 'user' }), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const u = db.prepare('SELECT id,name,email,role,pass FROM users WHERE id=?').get(id);
  if (!u) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
  if (req.user.role === 'teacher' && u.role !== 'student') return res.status(403).json({ error: 'Giáo viên chỉ cấp mã cho học sinh.' });
  if (u.pass === 'google-oauth') return res.status(400).json({ error: 'Tài khoản này đăng nhập bằng Google, không có mật khẩu để đặt lại.' });
  const c = issueResetCredentials(u.id);
  res.json({ ok: true, name: u.name, email: u.email, code: c.code, link: baseUrl(req) + '/reset-password.html?token=' + c.token, minutes: RESET_MINUTES });
});

app.get('/api/admin/backup-db', requireRole('admin'), (req, res) => {
  const dbPath = path.join(DATA_DIR, 'data.db');
  const stamp = new Date().toISOString().slice(0,10);
  res.download(dbPath, 'ewt-backup-' + stamp + '.db', (err) => {
    if (err) res.status(500).json({ error: 'Không thể tải file backup.' });
  });
});

// Danh sách các bản sao lưu tự động (mỗi 6 tiếng, giữ 30 bản gần nhất)
app.get('/api/admin/backups', requireRole('admin'), (req, res) => {
  try {
    const files = fs.readdirSync(BACKUP_DIR).filter(f => f.startsWith('data-') && f.endsWith('.db'));
    const list = files.map(f => {
      const st = fs.statSync(path.join(BACKUP_DIR, f));
      return { name: f, size: st.size, mtime: st.mtime };
    }).sort((a, b) => new Date(b.mtime) - new Date(a.mtime));
    res.json({ backups: list });
  } catch (e) {
    console.error('[backups]', e.message); res.status(500).json({ error: 'Không đọc được danh sách backup.' });
  }
});

// Tải về 1 bản sao lưu tự động cụ thể theo tên file
app.get('/api/admin/backups/:name', requireRole('admin'), (req, res) => {
  const name = req.params.name;
  if (!/^data-[\w.-]+\.db$/.test(name)) return res.status(400).json({ error: 'Tên file không hợp lệ.' });
  const p = path.join(BACKUP_DIR, name);
  if (!fs.existsSync(p)) return res.status(404).json({ error: 'Không tìm thấy bản sao lưu này.' });
  res.download(p, name);
});

// Kích hoạt sao lưu ngay lập tức (trước khi làm việc rủi ro)
app.post('/api/admin/backups/run', requireRole('admin'), (req, res) => {
  const result = runBackup('admin yêu cầu thủ công', true);
  res.json(result);
});

// ===================== QUẢN LÝ LỚP (GROUPS) =====================

// Danh sách lớp của giáo viên (kèm số học sinh)
app.get('/api/groups', requireRole('teacher','admin'), (req, res) => {
  const rows = db.prepare(`
    SELECT g.id, g.name, g.created_at, g.teacher_id,
      u.name AS teacher_name,
      COUNT(CASE WHEN gm.user_id IS NOT NULL THEN 1 END) AS member_count,
      COUNT(CASE WHEN gm.id IS NOT NULL AND gm.user_id IS NULL THEN 1 END) AS pending_count,
      COUNT(CASE WHEN gm.source = 'self' THEN 1 END) AS self_count,
      g.self_join AS self_join, g.needs_approval AS needs_approval, g.lb_on AS lb_on, g.lb_anon AS lb_anon,
      (SELECT COUNT(*) FROM group_join_requests r WHERE r.group_id=g.id) AS request_count
    FROM groups g
    LEFT JOIN users u ON u.id = g.teacher_id
    LEFT JOIN group_members gm ON gm.group_id = g.id
    GROUP BY g.id ORDER BY g.id DESC
  `).all();
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
  const r = db.prepare('UPDATE groups SET name=? WHERE id=?').run(name.trim(), Number(req.params.id));
  if (!r.changes) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  res.json({ ok: true });
});

// Xoá lớp (cascade xoá members nhờ ON DELETE CASCADE)
app.delete('/api/groups/:id', requireRole('teacher','admin'), (req, res) => {
  const grpCheck = db.prepare('SELECT teacher_id FROM groups WHERE id=?').get(Number(req.params.id));
  if (!grpCheck) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  if (req.user.role !== 'admin' && grpCheck.teacher_id !== req.user.id)
    return res.status(403).json({ error: 'Chỉ giáo viên tạo lớp hoặc quản trị viên mới có thể xoá lớp.' });
  db.prepare('DELETE FROM group_join_requests WHERE group_id=?').run(Number(req.params.id));
  const r = db.prepare('DELETE FROM groups WHERE id=?').run(Number(req.params.id));
  if (!r.changes) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  res.json({ ok: true });
});

// Danh sách thành viên của lớp
app.get('/api/groups/:id/members', requireRole('teacher','admin'), (req, res) => {
  const grp = db.prepare('SELECT id,name FROM groups WHERE id=?').get(Number(req.params.id));
  if (!grp) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  const members = db.prepare(`
    SELECT gm.id, gm.user_id, gm.invited_email, gm.added_at, gm.source,
           u.name, u.email
    FROM group_members gm
    LEFT JOIN users u ON u.id = gm.user_id
    WHERE gm.group_id = ?
    ORDER BY gm.id ASC
  `).all(Number(req.params.id));
  res.json({ group: grp, members });
});

// Thêm thành viên vào lớp (theo email)
function sendInviteEmail(req, mail, groupName) {
  if (!emailEnabled()) return;
  const link = baseUrl(req) + '/login.html';
  sendBrevoEmail({ email: mail, name: mail },
    `Bạn được mời tham gia lớp ${groupName} — English With Tom`,
    `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7">
      <h2 style="color:#6F58EE">Lời mời tham gia lớp học</h2>
      <p>Giáo viên đã mời bạn tham gia lớp <b>${htmlEsc(groupName)}</b> trên <b>English With Tom</b>.</p>
      <p>Hãy đăng ký tài khoản với đúng địa chỉ email này để tự động vào lớp:</p>
      <p style="margin:22px 0"><a href="${link}" style="display:inline-block;background:#6F58EE;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Đăng ký / Đăng nhập</a></p>
    </div>`
  ).catch(() => {});
}
app.post('/api/groups/:id/members', requireRole('teacher','admin'), async (req, res) => {
  const groupId = Number(req.params.id);
  const grp = db.prepare('SELECT id,name FROM groups WHERE id=?').get(groupId);
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
    sendInviteEmail(req, mail, grp.name);
    res.json({ ok: true, status: 'invited', email: mail });
  }
});

// Xoá thành viên khỏi lớp
app.delete('/api/groups/:id/members/:memberId', requireRole('teacher','admin'), (req, res) => {
  const groupId = Number(req.params.id);
  const grp = db.prepare('SELECT id FROM groups WHERE id=?').get(groupId);
  if (!grp) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  const r = db.prepare('DELETE FROM group_members WHERE id=? AND group_id=?').run(Number(req.params.memberId), groupId);
  if (!r.changes) return res.status(404).json({ error: 'Không tìm thấy thành viên.' });
  res.json({ ok: true });
});

// ───────────── Học sinh tự chọn lớp trong Hồ sơ ─────────────
// Giáo viên bật "cho học sinh tự chọn" ở từng lớp; học sinh chọn lớp mình học → vào lớp ngay (không cần thêm thủ công)
// và tự nhận các bài đã giao cho lớp đó còn hạn.
app.put('/api/groups/:id/selfjoin', requireRole('teacher','admin'), (req, res) => {
  const g = db.prepare('SELECT id,teacher_id FROM groups WHERE id=?').get(Number(req.params.id));
  if (!g) return res.status(404).json({ error: 'Không tìm thấy lớp.' });
  if (req.user.role !== 'admin' && g.teacher_id !== req.user.id) return res.status(403).json({ error: 'Chỉ giáo viên tạo lớp hoặc quản trị viên mới đổi được cài đặt này.' });
  db.prepare('UPDATE groups SET self_join=? WHERE id=?').run((req.body || {}).on ? 1 : 0, g.id);
  res.json({ ok: true, self_join: (req.body || {}).on ? 1 : 0 });
});
function openClasses() {
  return db.prepare(`SELECT g.id, g.name, g.needs_approval, u.name AS teacher_name,
      (SELECT COUNT(*) FROM group_members m WHERE m.group_id=g.id AND m.user_id IS NOT NULL) AS member_count
    FROM groups g LEFT JOIN users u ON u.id=g.teacher_id WHERE g.self_join=1 ORDER BY g.name COLLATE NOCASE`).all();
}
app.get('/api/me/classes', requireAuth, (req, res) => {
  const mine = db.prepare('SELECT g.id, g.name, gm.source FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id=? ORDER BY g.name').all(req.user.id);
  const ch = db.prepare('SELECT class_choice FROM users WHERE id=?').get(req.user.id);
  const pend = db.prepare('SELECT g.id, g.name FROM group_join_requests r JOIN groups g ON g.id=r.group_id WHERE r.user_id=?').get(req.user.id) || null;
  res.json({ open: openClasses(), mine, pending: pend, can_choose: req.user.role === 'student', choice: (ch && ch.class_choice) || null });
});
// Giao lại cho học sinh mới vào lớp các bài đã giao cho lớp (còn hạn hoặc không có hạn)
function backfillGroupAssignments(user, groupId, groupName) {
  const byEx = new Map();
  for (const r of db.prepare('SELECT exercise_id, assigned_by, deadline, note, strict, max_leaves FROM assignments WHERE group_id=? ORDER BY id').all(groupId)) byEx.set(r.exercise_id, r);
  for (const r of db.prepare('SELECT exercise_id, assigned_by, deadline, note, strict, max_leaves FROM group_assignments WHERE group_id=?').all(groupId)) byEx.set(r.exercise_id, r); // bản ghi cấp lớp là chuẩn nhất
  const rows = [...byEx.values()];
  const ins = db.prepare('INSERT INTO assignments (exercise_id,student_email,assigned_by,deadline,note,created_at,group_id,strict,max_leaves) VALUES (?,?,?,?,?,?,?,?,?)');
  let n = 0; const titles = [];
  for (const r of rows) {
    if (r.deadline && Date.parse(r.deadline) < Date.now() - 24 * 3600e3) continue; // bài đã quá hạn từ lâu thì không giao lại
    if (db.prepare('SELECT id FROM assignments WHERE exercise_id=? AND student_email=?').get(r.exercise_id, user.email)) continue;
    ins.run(r.exercise_id, user.email, r.assigned_by, r.deadline || null, r.note || null, now(), groupId, r.strict ? 1 : 0, r.max_leaves || 3);
    _assignedSet.add(Number(r.exercise_id) + '|' + user.email);
    if (r.deadline) _assignmentDeadlines.set(Number(r.exercise_id) + '|' + user.email, r.deadline);
    const ex = db.prepare('SELECT title FROM exercises WHERE id=?').get(r.exercise_id); if (ex) titles.push(ex.title); n++;
  }
  if (n) notifyUser(user.id, 'assignment_created', '📝 Bạn có ' + n + ' bài tập của lớp ' + groupName, titles.slice(0, 3).join(' · ') + (n > 3 ? '…' : ''), '/assigned.html');
  return n;
}
// Đưa học sinh vào lớp (nguồn 'self'): bỏ lớp tự chọn cũ, thêm thành viên, gộp lời mời theo email, giao lại bài còn hạn. Gọi bên trong BEGIN/COMMIT.
function applySelfJoin(user, g) {
  db.prepare("DELETE FROM group_members WHERE user_id=? AND source='self' AND group_id<>?").run(user.id, g.id);
  if (!db.prepare('SELECT id FROM group_members WHERE group_id=? AND user_id=?').get(g.id, user.id))
    db.prepare("INSERT INTO group_members (group_id,user_id,added_at,source) VALUES (?,?,?,'self')").run(g.id, user.id, now());
  db.prepare('DELETE FROM group_members WHERE group_id=? AND user_id IS NULL AND invited_email=?').run(g.id, user.email);
  db.prepare('DELETE FROM group_join_requests WHERE user_id=?').run(user.id);
  db.prepare("UPDATE users SET class_choice='class' WHERE id=?").run(user.id);
  return backfillGroupAssignments(user, g.id, g.name);
}
app.put('/api/me/class', requireAuth, (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ error: 'Chỉ học sinh mới chọn lớp theo học.' });
  const gid = (req.body || {}).group_id ? Number((req.body || {}).group_id) : null;
  try {
    db.exec('BEGIN');
    let name = null, backfilled = 0, pending = false;
    if (gid) {
      const g = db.prepare('SELECT id,name,self_join,needs_approval,teacher_id FROM groups WHERE id=?').get(gid);
      if (!g || !g.self_join) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Lớp này không mở cho học sinh tự chọn.' }); }
      name = g.name;
      const already = db.prepare('SELECT id FROM group_members WHERE group_id=? AND user_id=?').get(gid, req.user.id);
      if (g.needs_approval && !already) {
        // lớp cần giáo viên duyệt: chỉ gửi yêu cầu, chưa vào lớp (mỗi học sinh chỉ có 1 yêu cầu đang chờ)
        db.prepare('DELETE FROM group_join_requests WHERE user_id=?').run(req.user.id);
        db.prepare('INSERT INTO group_join_requests (group_id,user_id,created_at) VALUES (?,?,?)').run(gid, req.user.id, now());
        db.prepare("UPDATE users SET class_choice='pending' WHERE id=?").run(req.user.id);
        pending = true;
        notifyUser(g.teacher_id, 'class_request', '🙋 ' + req.user.name + ' xin vào lớp ' + g.name, 'Bấm để duyệt trong "Việc cần làm hôm nay".', '/teacher.html');
      } else backfilled = applySelfJoin(req.user, g);
    } else {
      db.prepare("DELETE FROM group_members WHERE user_id=? AND source='self'").run(req.user.id);
      db.prepare('DELETE FROM group_join_requests WHERE user_id=?').run(req.user.id);
      db.prepare("UPDATE users SET class_choice='free' WHERE id=?").run(req.user.id);
    }
    db.exec('COMMIT');
    res.json({ ok: true, class: name, backfilled, pending });
  } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} console.error('[me/class]', e.message); res.status(500).json({ error: 'Không lưu được lớp, hãy thử lại.' }); }
});
require('./avatar')(app, { db, requireAuth, now });
require('./notebook')(app, { db, requireAuth, now });
require('./achievements')(app, { db, requireAuth, now });
require('./reading')(app, { db, requireAuth, now });
require('./today')(app, { db, requireAuth, now });
require('./garden')(app, { db, requireAuth, requireRole, now, notifyUser });
require('./city-daily')(app, { db, requireAuth, now });   // EWT City: nhiệm vụ hằng ngày (phải nạp trước city.js)
require('./city')(app, { db, requireAuth, now, notifyUser });   // EWT City
require('./city-social')(app, { db, requireAuth, requireRole, now, notifyUser });   // EWT City: bạn bè, xếp hạng, dự án lớp
require('./dictation')(app, { db, requireAuth, now });
require('./exam-guard')(app, { db, requireAuth, requireRole, now });
require('./speaking')(app, { db, requireAuth, requireRole, now, notifyUser, upload, checkUpload, uploadsDir });
require('./parent-report')(app, { db, requireRole, notifyUser, now, sendBrevoEmail, emailEnabled, htmlEsc });
require('./essay')(app, { db, requireAuth, requireRole, now, notifyUser, ai: require('./ai') });   // bài tự luận viết do giáo viên ra đề
require('./teacher-tools')(app, { db, requireRole, notifyUser, now, applySelfJoin, backfillGroupAssignments, sendInviteEmail });

// ───────────── Bảng theo dõi bài nộp (bộ lọc thông minh) ─────────────
app.get('/api/teacher/tracker', requireRole('teacher','admin'), (req, res) => {
  const admin = req.user.role === 'admin';
  const rows = db.prepare(`
    SELECT a.id AS aid, a.student_email, a.deadline, a.created_at AS assigned_at, a.group_id,
           e.id AS exercise_id, e.title, e.program, e.skill,
           u.id AS student_id, u.name AS student_name,
           a.strict,
           (SELECT COUNT(*) FROM exam_events ev WHERE ev.user_id = u.id AND ev.exercise_id = a.exercise_id AND ev.type IN ('tab','blur','reopen')) AS leaves,
           (SELECT COUNT(*) FROM exam_events ev WHERE ev.user_id = u.id AND ev.exercise_id = a.exercise_id AND ev.type IN ('paste','copy')) AS pastes,
           sub.id AS sub_id, sub.status, sub.score, sub.max_score, sub.submitted_at
    FROM assignments a
    JOIN exercises e ON e.id = a.exercise_id
    LEFT JOIN users u ON u.email = a.student_email
    LEFT JOIN submissions sub ON sub.id = (SELECT s2.id FROM submissions s2 WHERE s2.user_id = u.id AND s2.exercise_id = a.exercise_id ORDER BY s2.id DESC LIMIT 1)
    ${admin ? '' : 'WHERE a.assigned_by = ?'}
    ORDER BY a.id DESC LIMIT 20000
  `).all(...(admin ? [] : [req.user.id]));
  const ids = [...new Set(rows.map(r => r.student_id).filter(Boolean))];
  const cls = new Map();
  if (ids.length) {
    for (let i = 0; i < ids.length; i += 500) {
      const part = ids.slice(i, i + 500);
      for (const m of db.prepare(`SELECT gm.user_id, g.id, g.name FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE gm.user_id IN (${part.map(() => '?').join(',')})`).all(...part)) {
        if (!cls.has(m.user_id)) cls.set(m.user_id, []); cls.get(m.user_id).push({ id: m.id, name: m.name });
      }
    }
  }
  const groups = db.prepare(`SELECT g.id, g.name, g.self_join, (SELECT COUNT(*) FROM group_members m WHERE m.group_id=g.id AND m.user_id IS NOT NULL) AS members FROM groups g ORDER BY g.name COLLATE NOCASE`).all();
  res.json({ now: Date.now(), groups, rows: rows.map(r => ({ ...r, classes: cls.get(r.student_id) || [] })) });
});
const _remindAt = new Map();
app.post('/api/teacher/remind', requireRole('teacher','admin'), (req, res) => {
  const ids = Array.isArray((req.body || {}).ids) ? req.body.ids.map(Number).filter(Boolean).slice(0, 300) : [];
  if (!ids.length) return res.status(400).json({ error: 'Chưa chọn bài nào.' });
  let sent = 0, skipped = 0;
  for (const id of ids) {
    const a = db.prepare('SELECT a.id,a.student_email,a.assigned_by,a.exercise_id,a.deadline,e.title,e.skill FROM assignments a JOIN exercises e ON e.id=a.exercise_id WHERE a.id=?').get(id);
    if (!a || (req.user.role !== 'admin' && a.assigned_by !== req.user.id)) { skipped++; continue; }
    const u = db.prepare('SELECT id FROM users WHERE email=?').get(a.student_email); if (!u) { skipped++; continue; }
    if (db.prepare('SELECT id FROM submissions WHERE user_id=? AND exercise_id=?').get(u.id, a.exercise_id)) { skipped++; continue; }
    if (Date.now() - (_remindAt.get(id) || 0) < 6 * 3600e3) { skipped++; continue; }
    _remindAt.set(id, Date.now());
    notifyUser(u.id, 'assignment_reminder', '⏰ Nhắc làm bài: ' + a.title, a.deadline ? 'Hạn nộp: ' + a.deadline.replace('T', ' ') : 'Thầy/Cô nhắc bạn hoàn thành bài này nhé.', practiceUrlFor(a.skill, a.exercise_id, true));
    sent++;
  }
  res.json({ ok: true, sent, skipped });
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

  const MAX_SCALE = { IELTS: 9, KET: 15, PET: 20, FCE: 20, APTIS: 50 };
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

// ===================== MESSAGES =====================

// Danh sách liên hệ: giáo viên thấy học sinh của mình, học sinh thấy giáo viên giao bài
app.get('/api/messages/contacts', requireAuth, (req, res) => {
  const me = req.user.id;
  let contacts;
  if (req.user.role === 'student') {
    contacts = db.prepare(`
      SELECT DISTINCT u.id, u.name, u.role,
        (SELECT content FROM messages WHERE (sender_id=u.id AND receiver_id=?) OR (sender_id=? AND receiver_id=u.id) ORDER BY created_at DESC LIMIT 1) AS last_msg,
        (SELECT created_at FROM messages WHERE (sender_id=u.id AND receiver_id=?) OR (sender_id=? AND receiver_id=u.id) ORDER BY created_at DESC LIMIT 1) AS last_at,
        (SELECT COUNT(*) FROM messages WHERE sender_id=u.id AND receiver_id=? AND read_at IS NULL) AS unread
      FROM assignments a
      JOIN users u ON u.id = a.assigned_by
      WHERE a.student_email = ?
      ORDER BY CASE WHEN last_at IS NULL THEN 1 ELSE 0 END, last_at DESC, u.name
    `).all(me, me, me, me, me, req.user.email);
  } else {
    contacts = db.prepare(`
      SELECT DISTINCT u.id, u.name, u.role,
        (SELECT content FROM messages WHERE (sender_id=u.id AND receiver_id=?) OR (sender_id=? AND receiver_id=u.id) ORDER BY created_at DESC LIMIT 1) AS last_msg,
        (SELECT created_at FROM messages WHERE (sender_id=u.id AND receiver_id=?) OR (sender_id=? AND receiver_id=u.id) ORDER BY created_at DESC LIMIT 1) AS last_at,
        (SELECT COUNT(*) FROM messages WHERE sender_id=u.id AND receiver_id=? AND read_at IS NULL) AS unread
      FROM assignments a
      JOIN users u ON u.email = a.student_email
      WHERE a.assigned_by = ?
      ORDER BY CASE WHEN last_at IS NULL THEN 1 ELSE 0 END, last_at DESC, u.name
    `).all(me, me, me, me, me, req.user.id);
  }
  // Thêm những người đã nhắn tin nhưng chưa có trong danh sách trên
  const msgContacts = db.prepare(`
    SELECT DISTINCT u.id, u.name, u.role,
      (SELECT content FROM messages WHERE (sender_id=u.id AND receiver_id=?) OR (sender_id=? AND receiver_id=u.id) ORDER BY created_at DESC LIMIT 1) AS last_msg,
      (SELECT created_at FROM messages WHERE (sender_id=u.id AND receiver_id=?) OR (sender_id=? AND receiver_id=u.id) ORDER BY created_at DESC LIMIT 1) AS last_at,
      (SELECT COUNT(*) FROM messages WHERE sender_id=u.id AND receiver_id=? AND read_at IS NULL) AS unread
    FROM messages m
    JOIN users u ON u.id = CASE WHEN m.sender_id=? THEN m.receiver_id ELSE m.sender_id END
    WHERE (m.sender_id=? OR m.receiver_id=?) AND u.id != ?
  `).all(me, me, me, me, me, me, me, me, me);

  const seen = new Set(contacts.map(c => c.id));
  msgContacts.forEach(c => { if (!seen.has(c.id)) { seen.add(c.id); contacts.push(c); } });
  contacts.sort((a, b) => (b.last_at || '').localeCompare(a.last_at || '') || a.name.localeCompare(b.name));
  contacts.forEach((c) => { c.avatar = avatarCfgOf(c.id); });
  res.json({ contacts });
});

// Cấu hình nhân vật (avatar) đã làm sạch của một người dùng — hiện trong tin nhắn
const _avLib = require('./js/avatar.js');
function avatarCfgOf(id) { try { const r = db.prepare('SELECT avatar FROM users WHERE id=?').get(id); return r && r.avatar ? _avLib.normalize(JSON.parse(r.avatar)) : null; } catch (_) { return null; } }
// Tổng số tin nhắn chưa đọc
app.get('/api/messages/unread-count', requireAuth, (req, res) => {
  const row = db.prepare('SELECT COUNT(*) AS cnt FROM messages WHERE receiver_id=? AND read_at IS NULL').get(req.user.id);
  res.json({ count: row.cnt });
});

// ===================== THÔNG BÁO (chuông 🔔) =====================

// Số thông báo chưa đọc
app.get('/api/notifications/unread-count', requireAuth, (req, res) => {
  const row = db.prepare('SELECT COUNT(*) AS cnt FROM notifications WHERE user_id=? AND read_at IS NULL').get(req.user.id);
  res.json({ count: row.cnt });
});

// Danh sách thông báo gần nhất (mới nhất trước)
app.get('/api/notifications', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT id,type,title,body,link,read_at,created_at FROM notifications WHERE user_id=? ORDER BY id DESC LIMIT 30')
    .all(req.user.id);
  res.json({ notifications: rows });
});

// Đánh dấu 1 thông báo đã đọc
app.post('/api/notifications/:id/read', requireAuth, (req, res) => {
  db.prepare('UPDATE notifications SET read_at=? WHERE id=? AND user_id=? AND read_at IS NULL')
    .run(now(), Number(req.params.id), req.user.id);
  res.json({ ok: true });
});

// Đánh dấu tất cả đã đọc
app.post('/api/notifications/read-all', requireAuth, (req, res) => {
  db.prepare('UPDATE notifications SET read_at=? WHERE user_id=? AND read_at IS NULL').run(now(), req.user.id);
  res.json({ ok: true });
});

// Lấy lịch sử tin nhắn với một người dùng
app.get('/api/messages/:userId', requireAuth, (req, res) => {
  const me = req.user.id;
  const other = Number(req.params.userId);
  if (!other) return res.status(400).json({ error: 'Invalid userId' });
  const msgs = db.prepare(`
    SELECT m.id, m.sender_id, m.receiver_id, m.content, m.created_at, m.read_at,
           s.name AS sender_name, r.name AS receiver_name
    FROM messages m
    JOIN users s ON s.id = m.sender_id
    JOIN users r ON r.id = m.receiver_id
    WHERE (m.sender_id=? AND m.receiver_id=?) OR (m.sender_id=? AND m.receiver_id=?)
    ORDER BY m.created_at ASC
  `).all(me, other, other, me);
  // Đánh dấu đã đọc
  db.prepare('UPDATE messages SET read_at=? WHERE receiver_id=? AND sender_id=? AND read_at IS NULL')
    .run(new Date().toISOString(), me, other);
  const otherUser = db.prepare('SELECT id, name, role FROM users WHERE id=?').get(other);
  if (otherUser) otherUser.avatar = avatarCfgOf(other);
  res.json({ messages: msgs, other: otherUser, me_avatar: avatarCfgOf(me) });
});

// Gửi tin nhắn
app.post('/api/messages/:userId', requireAuth, (req, res) => {
  const me = req.user.id;
  const other = Number(req.params.userId);
  const { content } = req.body || {};
  if (!other || !content || !content.trim()) return res.status(400).json({ error: 'Thiếu nội dung.' });
  const otherUser = db.prepare('SELECT id, name, role FROM users WHERE id=?').get(other);
  if (!otherUser) return res.status(404).json({ error: 'Người dùng không tồn tại.' });
  // Học sinh chỉ được nhắn cho giáo viên/quản trị (tránh nhắn tin quấy rối giữa các học sinh)
  if (req.user.role === 'student' && otherUser.role === 'student') return res.status(403).json({ error: 'Học sinh chỉ có thể nhắn tin cho giáo viên.' });
  if (String(content).length > 3000) return res.status(400).json({ error: 'Tin nhắn quá dài (tối đa 3000 ký tự).' });
  const r = db.prepare('INSERT INTO messages (sender_id, receiver_id, content, created_at) VALUES (?,?,?,?)')
    .run(me, other, content.trim(), new Date().toISOString());
  const msg = db.prepare('SELECT * FROM messages WHERE id=?').get(r.lastInsertRowid);
  // Push notification cho người nhận
  const assignLink = (process.env.BASE_URL || 'https://engwithtom.online') + '/chat.html?u=' + me;
  const pushBody = /^\[stk:[a-z0-9-]{1,40}\]$/.test(content.trim()) ? '🎟️ Đã gửi một sticker' : content.trim().slice(0, 80);
  sendPushToUser(other, '💬 ' + req.user.name, pushBody, assignLink).catch(() => {});
  res.json({ ok: true, message: msg });
});

// ===================== NHẮC DEADLINE =====================
// Tự động nhắc học sinh: (1) còn dưới 24 giờ là hết hạn mà chưa nộp; (2) đã quá hạn mà chưa nộp (trong 48 giờ đầu) — kèm tổng kết cho giáo viên.
// Kênh: thông báo trong web (🔔) + thông báo đẩy (nếu học sinh đã bật) + email (nếu đã cấu hình). Mỗi bài chỉ nhắc 1 lần mỗi loại.
let _autoRemindBusy = false;
async function sendDeadlineReminders() {
  if (_autoRemindBusy) return { pre: 0, overdue: 0, skipped: 'busy' };
  _autoRemindBusy = true;
  const stat = { pre: 0, overdue: 0, teachers: 0 };
  try {
    const t0 = Date.now();
    const rows = db.prepare(`
      SELECT a.id, a.student_email, a.deadline, a.assigned_by, a.group_id, a.reminder_sent, a.overdue_sent,
             e.title, e.program, e.id AS exercise_id, e.skill,
             u.id AS student_id, u.name AS student_name, g.name AS group_name,
             COALESCE(t.auto_remind, 1) AS auto_on
      FROM assignments a
      JOIN exercises e ON e.id = a.exercise_id
      JOIN users u ON u.email = a.student_email
      LEFT JOIN users t ON t.id = a.assigned_by
      LEFT JOIN groups g ON g.id = a.group_id
      WHERE a.deadline IS NOT NULL AND (a.reminder_sent = 0 OR a.overdue_sent = 0)
        AND substr(a.deadline, 1, 10) >= date('now', '-4 days')
        AND NOT EXISTS (SELECT 1 FROM submissions s WHERE s.user_id = u.id AND s.exercise_id = a.exercise_id)
      LIMIT 3000`).all();
    const digest = new Map(); // giáo viên|đề|lớp → danh sách học sinh quá hạn
    const assignLink = (process.env.BASE_URL || 'https://engwithtom.online') + '/assigned.html';
    for (const r of rows) {
      if (!r.auto_on) continue;
      const d = deadlineMs(r.deadline); if (!d) continue;
      const name = r.student_name || r.student_email, dline = fmtDeadlineVN(r.deadline);
      const left = d - t0;
      if (!r.reminder_sent && left > 0 && left <= 24 * 3600e3) {
        db.prepare('UPDATE assignments SET reminder_sent=1 WHERE id=?').run(r.id);
        const hrs = Math.max(1, Math.round(left / 3600e3));
        notifyUser(r.student_id, 'deadline_reminder', '⏰ Còn khoảng ' + hrs + ' giờ: ' + r.title, 'Hạn nộp ' + dline + ' — bạn chưa nộp bài. Làm ngay nhé!', practiceUrlFor(r.skill, r.exercise_id, true));
        stat.pre++;
        if (emailEnabled()) await sendBrevoEmail({ email: r.student_email, name }, `⏰ Nhắc nhở: Bài tập "${r.title}" sắp đến hạn — English With Tom`,
          `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7"><h2 style="color:#E57C2B">⏰ Nhắc nhở nộp bài</h2><p>Xin chào <b>${htmlEsc(name)}</b>,</p><p>Bài tập <b>${htmlEsc(r.title)}</b>${r.program ? ` (${htmlEsc(r.program)})` : ''} sẽ <b>hết hạn vào ${dline}</b> (còn khoảng ${hrs} giờ).</p><p>Bạn chưa nộp bài này. Hãy hoàn thành trước khi hết giờ nhé!</p><p style="margin:22px 0"><a href="${assignLink}" style="display:inline-block;background:#E57C2B;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Nộp bài ngay</a></p><p style="font-size:13px;color:#888">Đăng nhập bằng đúng email này (${htmlEsc(r.student_email)}) để xem bài được giao.</p></div>`).catch(() => {});
      } else if (!r.overdue_sent && left <= 0) {
        db.prepare('UPDATE assignments SET overdue_sent=1, reminder_sent=1 WHERE id=?').run(r.id);
        if (-left > 48 * 3600e3) continue; // quá hạn đã lâu (vd. bài cũ lúc mới bật tính năng) thì không nhắc nữa
        notifyUser(r.student_id, 'overdue_reminder', '⚠️ Đã quá hạn: ' + r.title, 'Hạn nộp là ' + dline + '. Bạn chưa nộp — hãy nhắn thầy/cô để xin thêm thời gian nếu cần nhé.', '/assigned.html');
        stat.overdue++;
        const key = r.assigned_by + '|' + r.exercise_id + '|' + (r.group_id || 0);
        const o = digest.get(key) || { teacher: r.assigned_by, title: r.title, exercise_id: r.exercise_id, group: r.group_name, group_id: r.group_id, names: [] };
        o.names.push(name); digest.set(key, o);
        if (emailEnabled()) await sendBrevoEmail({ email: r.student_email, name }, `⚠️ Bài tập "${r.title}" đã quá hạn — English With Tom`,
          `<div style="font-family:sans-serif;font-size:15px;color:#2E2B45;line-height:1.7"><h2 style="color:#dc2626">⚠️ Bài tập đã quá hạn</h2><p>Xin chào <b>${htmlEsc(name)}</b>,</p><p>Bài tập <b>${htmlEsc(r.title)}</b> đã hết hạn nộp vào <b>${dline}</b> nhưng bạn chưa nộp.</p><p>Nếu bạn cần thêm thời gian, hãy nhắn cho thầy/cô để được hỗ trợ nhé.</p><p style="margin:22px 0"><a href="${assignLink}" style="display:inline-block;background:#7B6EF6;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600">Xem bài tập của tôi</a></p></div>`).catch(() => {});
      }
    }
    for (const o of digest.values()) {
      if (!o.teacher) continue;
      notifyUser(o.teacher, 'overdue_digest', '📋 ' + o.names.length + ' học sinh chưa nộp “' + o.title + '”' + (o.group ? ' (lớp ' + o.group + ')' : '') + ' đã quá hạn',
        o.names.slice(0, 5).join(', ') + (o.names.length > 5 ? '…' : '') + ' — đã tự động nhắc các em.', '/teacher-track.html?ex=' + o.exercise_id + (o.group_id ? '&class=' + o.group_id : '') + '&status=overdue');
      stat.teachers++;
    }
    if (stat.pre || stat.overdue) console.log(`📬 Tự động nhắc: ${stat.pre} sắp hết hạn, ${stat.overdue} quá hạn, ${stat.teachers} tổng kết cho giáo viên`);
  } finally { _autoRemindBusy = false; }
  return stat;
}
app.post('/api/admin/auto-remind/run', requireRole('admin'), async (req, res) => {
  try { res.json({ ok: true, ...(await sendDeadlineReminders()) }); } catch (e) { console.error('[auto-remind]', e.message); res.status(500).json({ error: 'Chạy nhắc thất bại.' }); }
});

// Chạy ngay sau khi server khởi động (trễ 30s) rồi mỗi 15 phút
setTimeout(() => {
  sendDeadlineReminders().catch(console.error);
  setInterval(() => sendDeadlineReminders().catch(console.error), 15 * 60 * 1000); // mỗi 15 phút
}, 30_000);

// ===================== GÓC TỪ VỰNG (kho từ, ôn tập ngắt quãng, XP, chuỗi ngày, nhiệm vụ) =====================
try {
  require('./wordgame')(app, { db, requireAuth, requireRole, now, notifyUser });
} catch (e) {
  // Lỗi ở tính năng mới không được làm sập cả trang web
  console.error('[wordgame] Không khởi động được:', e.message);
}

// ===================== BỘ TỪ THEO BÀI HỌC (AI tạo thẻ từ + 10 câu trắc nghiệm, giáo viên duyệt rồi giao) =====================
try {
  require('./lessonvocab')(app, { db, requireAuth, requireRole, now, notifyUser, ai: require('./ai') });
} catch (e) {
  console.error('[lesson-vocab] Không khởi động được:', e.message);
}

// ===================== ĐỀ TRẮC NGHIỆM (tải file Word → giao → làm bài có đếm giờ) =====================
try {
  require('./mcq')(app, { db, requireAuth, requireRole, now, notifyUser });
} catch (e) {
  console.error('[mcq] Không khởi động được:', e.message);
}

// ===================== KIỂM TRA ĐẦU VÀO (đề cố định cấu trúc, rút ngẫu nhiên từ ngân hàng Cambridge; quy đổi CEFR; lộ trình học) =====================
try {
  require('./templates')(app, { requireRole });
require('./school-admin')(app, { db, requireAuth, requireRole, now, ai: require('./ai') });
require('./placement')(app, { db, requireAuth, requireRole, now, notifyUser, ai: require('./ai') });
} catch (e) {
  console.error('[placement] Không khởi động được:', e.message);
}

// ===================== TĨNH =====================
app.use(express.static(__dirname));

// Làm sạch tên người dùng cũ có ký tự nguy hiểm (< > \" ...) — chạy mỗi lần khởi động, chỉ đụng tới dòng cần sửa
try {
  const bad = db.prepare("SELECT id,name,email FROM users WHERE name GLOB '*[<>\"`{}&$|;=*^%]*' OR name GLOB '*\\*'").all();
  for (const u of bad) { const nn = cleanName(u.name, String(u.email).split('@')[0]); db.prepare('UPDATE users SET name=? WHERE id=?').run(nn, u.id); }
  if (bad.length) console.log('[security] Đã làm sạch tên của ' + bad.length + ' tài khoản có ký tự đặc biệt.');
} catch (e) { console.error('[security] làm sạch tên lỗi:', e.message); }

// ===================== XỬ LÝ LỖI CUỐI + CHỐNG SẬP =====================
app.use(security.errorHandler);
// Một lỗi bất ngờ ở bất kỳ request nào cũng KHÔNG được làm sập cả website
process.on('uncaughtException', (e) => console.error('[uncaughtException]', e && e.stack || e));
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e && e.stack || e));

// Phiên đăng nhập hết hạn thật sự sau 30 ngày (cookie đã hết hạn nhưng mã phiên cũ không được còn dùng được nếu bị lộ)
function purgeOldSessions() {
  try { const n = db.prepare('DELETE FROM sessions WHERE created_at < ?').run(new Date(Date.now() - 30 * 86400e3).toISOString()).changes; if (n) console.log('[security] Đã xoá ' + n + ' phiên quá 30 ngày.'); }
  catch (e) { console.error('[security] dọn phiên lỗi:', e.message); }
}
purgeOldSessions(); setInterval(purgeOldSessions, 6 * 3600e3).unref();

// Lần chạy đầu sau bản vá bảo mật: đăng xuất toàn bộ phiên cũ một lần (phòng khi có phiên bị chiếm bằng lỗ hổng đã vá)
try {
  const marker = path.join(DATA_DIR, '.sessions_purged_v1');
  if (!fs.existsSync(marker)) {
    const n = db.prepare('DELETE FROM sessions').run().changes;
    fs.writeFileSync(marker, new Date().toISOString());
    console.log('[security] Đã đăng xuất ' + n + ' phiên cũ (một lần, sau khi vá lỗ hổng xác thực).');
  }
} catch (e) { console.error('[security] purge phiên lỗi:', e.message); }

const port = process.env.PORT || 3000;
const httpServer = app.listen(port, () => {
  console.log('English With Tom đang chạy tại cổng ' + port);
  // Đọc DB file vào RAM qua sql.js (async, không block event loop dù NFS chậm).
  // Server đã lắng nghe port rồi → Railway health check pass → warmup chạy nền.
  warmExerciseCacheFromFile();
  // Làm mới RAM mỗi 20s: đề mới, lượt giao/nộp mới xuất hiện trong ≤20s mà không cần đọc NFS lúc học sinh mở đề.
  setInterval(warmExerciseCacheFromFile, 20 * 1000);

  console.log('📁 Database:', path.join(DATA_DIR, 'data.db'));
  if (DATA_DIR === __dirname)
    console.warn('⚠️  DATA_DIR chưa set — database nằm trong thư mục app, SẼ MẤT khi Railway redeploy! Hãy tạo Volume trong Railway và set DATA_DIR=/data');
  else
    console.log('✅ DATA_DIR =', DATA_DIR, '— dữ liệu an toàn qua các lần deploy');

  // Sao lưu tự động: chạy 1 lần sau 2 phút (đợi warmup xong), sau đó mỗi ngày (chỉ khi dữ liệu đổi).
  // Giữ 5 bản gần nhất trong Volume /data/backups — sống sót qua mọi lần redeploy.
  setTimeout(() => {
    pruneBackups(); // dọn ngay các bản cũ thừa (trước đây giữ tới 30 bản)
    runBackup('khởi động server');
    setInterval(() => runBackup('hằng ngày'), 24 * 60 * 60 * 1000);
  }, 2 * 60 * 1000);

  // Self-ping mỗi 4 phút để Railway không cho app ngủ (cold start làm trang quay vòng 15-30s)
  if (process.env.PUBLIC_URL) {
    const pingUrl = process.env.PUBLIC_URL + '/api/ping';
    setInterval(() => {
      fetch(pingUrl).catch(() => {});
    }, 4 * 60 * 1000);
    console.log('🔔 Keep-alive ping mỗi 4 phút →', pingUrl);
  }
});
security.hardenServer(httpServer);
