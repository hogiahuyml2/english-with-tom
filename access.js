// Quản lý truy cập: lượt truy cập mỗi ngày, ai truy cập, người dùng làm gì trên web.
// - Lượt xem trang: trang web gửi tín hiệu nhẹ (js/track.js → POST /api/track), máy chủ gắn với tài khoản đang đăng nhập (nếu có).
// - Thao tác: máy chủ tự ghi các thao tác ghi dữ liệu quan trọng của người dùng đã đăng nhập (đăng nhập, nộp bài, làm đề, chơi game…).
// - Giáo viên chỉ thấy học sinh trong các lớp của mình; quản trị thấy tất cả (kể cả khách chưa đăng nhập).
// Không lưu địa chỉ IP thật: chỉ lưu mã băm ngắn để nhận ra cùng một thiết bị/mạng.
'use strict';
const crypto = require('crypto');

const TZ = 7 * 3600 * 1000;                       // giờ Việt Nam
const dayOf = (ms) => new Date(ms + TZ).toISOString().slice(0, 10);
const SESSION_GAP = 30 * 60 * 1000;               // cách nhau > 30 phút = lượt truy cập mới
const ONLINE_MS = 5 * 60 * 1000;
const KEEP_DAYS = 120;
const SALT = process.env.ACCESS_SALT || process.env.SESSION_SECRET || 'ewt-access';

const PAGE_NAMES = {
  '/index.html': 'Trang chủ', '/login.html': 'Đăng nhập / Đăng ký', '/forgot-password.html': 'Quên mật khẩu', '/reset-password.html': 'Đặt lại mật khẩu',
  '/today.html': 'Hôm nay mình học gì?', '/dashboard.html': 'Tiến trình học', '/assigned.html': 'Bài tập được giao', '/account.html': 'Tài khoản',
  '/avatar.html': 'Nhân vật', '/stickers.html': 'Sticker', '/achievements.html': 'Thành tích', '/notebook.html': 'Sổ lỗi sai', '/chat.html': 'Tin nhắn',
  '/word-hub.html': 'Học & ôn từ', '/vocabulary.html': 'Flashcard chủ đề', '/arcade.html': 'Trò chơi từ vựng', '/practice.html': 'Luyện câu',
  '/dictation.html': 'Chép chính tả', '/reading.html': 'Đọc hiểu (danh sách)', '/reading-text.html': 'Đọc hiểu (bài đọc)', '/lesson-vocab.html': 'Bộ từ được giao',
  '/garden.html': 'EWT Garden', '/speaking.html': 'Luyện Speaking', '/speaking-result.html': 'Kết quả Speaking', '/placement.html': 'Kiểm tra đầu vào',
  '/school.html': 'Tiếng Anh phổ thông', '/school-lesson.html': 'Bài ngữ pháp phổ thông', '/exercises.html': 'Ngân hàng đề', '/mcq.html': 'Đề trắc nghiệm',
  '/ket.html': 'KET', '/pet.html': 'PET', '/fce.html': 'FCE', '/aptis.html': 'APTIS', '/ielts.html': 'IELTS', '/ket-writing.html': 'KET Writing',
  '/aptis-writing.html': 'APTIS Writing', '/aptis-writing-test.html': 'APTIS Writing (làm bài)', '/writing-exercises.html': 'Bài Writing',
  '/practice-quiz.html': 'Luyện trắc nghiệm', '/practice-reading.html': 'Luyện đọc', '/practice-writing.html': 'Luyện viết', '/practice-speaking.html': 'Luyện nói',
  '/practice-sentence-arrange.html': 'Sắp xếp câu', '/sentence-practice.html': 'Luyện viết câu', '/game-flip.html': 'Game lật thẻ', '/game-match.html': 'Game nối từ', '/game-spell.html': 'Game đánh vần',
  '/teacher.html': 'Giáo viên: Quản lý', '/teacher-track.html': 'Giáo viên: Theo dõi bài nộp', '/teacher-grades.html': 'Giáo viên: Sổ điểm', '/teacher-writing.html': 'Giáo viên: Chấm Writing',
  '/teacher-speaking.html': 'Giáo viên: Speaking', '/teacher-parents.html': 'Giáo viên: Báo cáo phụ huynh', '/teacher-student.html': 'Giáo viên: Hồ sơ học sinh',
  '/admin.html': 'Quản trị', '/access.html': 'Quản lý truy cập', '/school-admin.html': 'Quản lý bài phổ thông', '/placement-admin.html': 'Quản lý kiểm tra đầu vào', '/offline.html': 'Ngoại tuyến',
};
const CATS = { auth: 'Tài khoản', learn: 'Học & luyện tập', submit: 'Làm & nộp bài', game: 'Trò chơi & vườn', social: 'Tin nhắn', teach: 'Giáo viên', admin: 'Quản trị' };

// [phương thức, mẫu đường dẫn, nhóm, nhãn]
const RULES = [
  ['POST', /^\/api\/login$/, 'auth', 'Đăng nhập'], ['POST', /^\/api\/logout$/, 'auth', 'Đăng xuất'], ['POST', /^\/api\/register$/, 'auth', 'Đăng ký tài khoản'],
  ['POST', /^\/api\/verify-code$/, 'auth', 'Xác thực email'], ['POST', /^\/api\/forgot-password$/, 'auth', 'Yêu cầu đặt lại mật khẩu'], ['POST', /^\/api\/reset-password$/, 'auth', 'Đặt lại mật khẩu'],
  ['POST', /^\/api\/me\/change-password$/, 'auth', 'Đổi mật khẩu'], ['PUT', /^\/api\/me\/class$/, 'auth', 'Chọn / đổi lớp'], ['PUT', /^\/api\/me\/avatar$/, 'auth', 'Lưu nhân vật'],
  ['POST', /^\/api\/avatar\/buy$/, 'game', 'Mua đồ nhân vật'], ['POST', /^\/api\/push\/subscribe$/, 'auth', 'Bật thông báo đẩy'],
  ['POST', /^\/api\/mcq\/\d+\/start$/, 'submit', 'Bắt đầu làm đề trắc nghiệm'], ['POST', /^\/api\/mcq\/attempt\/\d+\/submit$/, 'submit', 'Nộp đề trắc nghiệm'],
  ['POST', /^\/api\/submissions$/, 'submit', 'Nộp bài làm'], ['POST', /^\/api\/(grade-writing|grade-aptis-writing)$/, 'submit', 'Chấm Writing bằng AI'],
  ['POST', /^\/api\/speaking\/start$/, 'submit', 'Bắt đầu bài Speaking'], ['POST', /^\/api\/speaking\/\d+\/submit$/, 'submit', 'Nộp bài Speaking'],
  ['POST', /^\/api\/placement\/start$/, 'submit', 'Bắt đầu kiểm tra đầu vào'], ['POST', /^\/api\/placement\/attempt\/\d+\/section\/[a-z]+\/submit$/, 'submit', 'Nộp một phần kiểm tra đầu vào'],
  ['POST', /^\/api\/lesson-vocab\/\d+\/submit$/, 'submit', 'Nộp bộ từ được giao'], ['POST', /^\/api\/reading\/text\/[^/]+\/submit$/, 'learn', 'Nộp bài đọc hiểu'],
  ['POST', /^\/api\/reading\/save-word$/, 'learn', 'Lưu từ khi đọc'], ['POST', /^\/api\/dictation\/run$/, 'learn', 'Bắt đầu chép chính tả'], ['POST', /^\/api\/dictation\/finish$/, 'learn', 'Hoàn thành chép chính tả'],
  ['POST', /^\/api\/sentence-check$/, 'learn', 'Luyện viết câu'], ['POST', /^\/api\/word-game\/session$/, 'learn', 'Hoàn thành phiên học từ / chơi game từ vựng'],
  ['POST', /^\/api\/word-game\/dialogue$/, 'learn', 'Làm hội thoại từ vựng'], ['POST', /^\/api\/word-game\/wordle\/guess$/, 'game', 'Chơi Wordle'],
  ['POST', /^\/api\/word-game\/quest\/claim$/, 'game', 'Nhận thưởng nhiệm vụ'], ['POST', /^\/api\/word-game\/chest\/open$/, 'game', 'Mở rương'],
  ['POST', /^\/api\/word-game\/shop\/(buy|equip)$/, 'game', 'Mua / dùng đồ trong cửa hàng'],
  ['POST', /^\/api\/notebook\/(check|mark)$/, 'learn', 'Ôn Sổ lỗi sai'], ['POST', /^\/api\/duel(\/.*)?$/, 'game', 'Chơi đối kháng'],
  ['POST', /^\/api\/garden\/quiz\/answer$/, 'game', 'EWT Garden: trả lời câu hỏi'], ['POST', /^\/api\/garden\/quiz\/flip$/, 'game', 'EWT Garden: lật thẻ thưởng'],
  ['POST', /^\/api\/garden\/(place|remove|water|harvest|harvest-all|zone\/unlock|bundle\/buy|outfit\/buy|place-many|remove-many|water-many|harvest-many|grow-many|clear|blueprint\/quote|blueprint\/apply|stock\/buy|xu\/send|parcel\/(send|respond|cancel)|note|note\/delete)$/, 'game', 'EWT Garden: chăm vườn'], ['POST', /^\/api\/garden\/pet\/.+$/, 'game', 'EWT Garden: thú cưng'],
  ['POST', /^\/api\/garden\/(name|share)$/, 'game', 'EWT Garden: đặt tên / chia sẻ vườn'],
  ['POST', /^\/api\/garden\/(quests\/claim|inbox\/claim|class\/contribute|culture\/answer|event\/daily|event\/milestone|trade\/send|trade\/respond|trade\/cancel)$/, 'game', 'EWT Garden: nhiệm vụ / quà / sự kiện / tặng-đổi quà / hộ chiếu'],
  ['POST', /^\/api\/garden\/teacher\/event$/, 'teach', 'EWT Garden: mở / đóng sự kiện theo mùa'],
  ['POST', /^\/api\/messages\/\d+$/, 'social', 'Gửi tin nhắn'], ['POST', /^\/api\/student-message$/, 'social', 'Gửi tin nhắn cho giáo viên'], ['POST', /^\/api\/upload(-recording)?$/, 'submit', 'Tải tệp / bản ghi âm lên'],
  ['POST', /^\/api\/assignments$/, 'teach', 'Giao bài tập'], ['POST', /^\/api\/exercises$/, 'teach', 'Tạo bài tập'], ['PUT', /^\/api\/exercises\/\d+$/, 'teach', 'Sửa bài tập'], ['DELETE', /^\/api\/exercises\/\d+$/, 'teach', 'Xoá bài tập'],
  ['POST', /^\/api\/mcq$/, 'teach', 'Tạo đề trắc nghiệm'], ['POST', /^\/api\/mcq\/\d+\/(assign|reset)$/, 'teach', 'Giao thêm / cho làm lại đề trắc nghiệm'], ['PATCH', /^\/api\/mcq\/\d+$/, 'teach', 'Đổi cài đặt đề trắc nghiệm'], ['DELETE', /^\/api\/mcq\/\d+$/, 'teach', 'Xoá đề trắc nghiệm'],
  ['POST', /^\/api\/teacher\/(grade|send-grade|ai-grade|model-answer|save-draft)\/\d+$/, 'teach', 'Chấm / gửi điểm bài làm'], ['POST', /^\/api\/teacher\/send-grade-batch$/, 'teach', 'Gửi điểm hàng loạt'],
  ['POST', /^\/api\/teacher\/remind$/, 'teach', 'Nhắc học sinh'], ['POST', /^\/api\/groups$/, 'teach', 'Tạo lớp'], ['POST', /^\/api\/groups\/(\d+\/members.*|members\/move|requests\/decide|\d+\/promote)$/, 'teach', 'Quản lý học sinh trong lớp'],
  ['POST', /^\/api\/lesson-vocab$/, 'teach', 'Tạo bộ từ theo bài học'], ['POST', /^\/api\/lesson-vocab\/\d+\/assign$/, 'teach', 'Giao bộ từ'], ['POST', /^\/api\/teacher\/speaking\/assign$/, 'teach', 'Giao bài Speaking'],
  ['POST', /^\/api\/parent-report\/.+$/, 'teach', 'Báo cáo phụ huynh'], ['POST', /^\/api\/school\/admin\/.+$/, 'teach', 'Quản lý bài ngữ pháp phổ thông'],
  ['POST', /^\/api\/admin\/create-teacher$/, 'admin', 'Tạo tài khoản giáo viên'], ['POST', /^\/api\/admin\/users\/.+$/, 'admin', 'Quản trị người dùng'], ['DELETE', /^\/api\/admin\/users\/\d+$/, 'admin', 'Xoá người dùng'],
  ['POST', /^\/api\/admin\/backups\/run$/, 'admin', 'Chạy sao lưu'], ['POST', /^\/api\/admin\/.+$/, 'admin', 'Thao tác quản trị khác'],
];
const labelOf = (method, p) => { for (const r of RULES) if (r[0] === method && r[1].test(p)) return r; return null; };

function parseUA(ua) {
  ua = String(ua || '');
  const bot = /bot|crawl|spider|slurp|facebookexternalhit|preview|monitor|uptime|curl|wget|python|headless|lighthouse|pingdom|go-http|node-fetch/i.test(ua);
  const device = /iPad|Tablet/i.test(ua) ? 'tablet' : /Mobi|Android|iPhone|iPod/i.test(ua) ? 'mobile' : 'desktop';
  const browser = /Zalo/i.test(ua) ? 'Zalo' : /FBAN|FBAV/i.test(ua) ? 'Facebook' : /EdgA?\//.test(ua) ? 'Edge' : /OPR\//.test(ua) ? 'Opera' : /Firefox|FxiOS/.test(ua) ? 'Firefox' : /Chrome|CriOS/.test(ua) ? 'Chrome' : /Safari/.test(ua) ? 'Safari' : 'Khác';
  return { bot, device, browser };
}
const ipHash = (ip) => crypto.createHash('sha256').update(SALT + '|' + String(ip || '')).digest('hex').slice(0, 8);

module.exports = function registerAccess(app, { db, requireRole }) {
  const J = (s, d) => { try { return JSON.parse(s); } catch (e) { return d; } };
  const clientIp = (req) => req.clientIp || req.ip || (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || '';
  const recent = new Map();   // chống ghi trùng: cùng thiết bị + trang trong 3 giây

  // ───────────── ghi lượt xem trang ─────────────
  app.post('/api/track', (req, res) => {
    res.status(204).end();
    try {
      const b = req.body || {};
      const ua = parseUA(req.headers['user-agent']);
      if (ua.bot) return;
      let p = String(b.p || '').split('?')[0].split('#')[0];
      if (!/^\/[A-Za-z0-9_\-./]{0,100}$/.test(p)) return;
      if (p === '/' || p === '') p = '/index.html';
      const vid = /^[a-z0-9]{8,32}$/.test(String(b.v || '')) ? String(b.v) : null;
      const ip = ipHash(clientIp(req));
      const key = (vid || ip) + '|' + p, t = Date.now();
      if (recent.get(key) && t - recent.get(key) < 3000) return;
      recent.set(key, t);
      if (recent.size > 5000) for (const [k, v] of recent) if (t - v > 10000) recent.delete(k);
      const country = String(req.headers['cf-ipcountry'] || '').slice(0, 2).toUpperCase() || null;
      let ref = null; try { ref = b.r ? String(b.r).slice(0, 60).replace(/[^A-Za-z0-9.\-]/g, '') || null : null; } catch (e) {}
      db.prepare('INSERT INTO access_views (ts,day,user_id,vid,path,title,ref,device,browser,country,ip) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
        .run(t, dayOf(t), req.user ? req.user.id : null, vid, p, String(b.t || '').slice(0, 120) || null, ref, ua.device, ua.browser, country, ip);
    } catch (e) { /* không bao giờ làm hỏng trang */ }
  });

  // ───────────── ghi thao tác của người dùng ─────────────
  app.use('/api', (req, res, next) => {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') return next();
    const p = req.originalUrl.split('?')[0];
    const rule = labelOf(req.method, p);
    if (!rule) return next();
    const userBefore = req.user || null;
    res.on('finish', () => {
      try {
        let uid = userBefore ? userBefore.id : (req.user ? req.user.id : null), label = rule[3], st = res.statusCode;
        if (/^\/api\/(login|register)$/.test(p)) {
          const em = String((req.body || {}).email || '').trim().toLowerCase();
          const u = em ? db.prepare('SELECT id FROM users WHERE lower(email)=?').get(em) : null;
          uid = u ? u.id : null;
          if (p === '/api/login' && st >= 400) { if (!uid) return; label = st === 429 ? 'Đăng nhập bị chặn (sai quá nhiều lần)' : 'Đăng nhập thất bại (sai mật khẩu)'; }
          else if (st >= 400) return;
        } else if (st >= 400 || !uid) return;
        const t = Date.now();
        db.prepare('INSERT INTO access_actions (ts,day,user_id,cat,label,path,status,ip) VALUES (?,?,?,?,?,?,?,?)').run(t, dayOf(t), uid, rule[2], label, p.slice(0, 120), st, ipHash(clientIp(req)));
      } catch (e) {}
    });
    next();
  });

  // ───────────── dọn dữ liệu cũ (mỗi ngày một lần) ─────────────
  const purge = () => { try { const cut = Date.now() - KEEP_DAYS * 86400000; db.prepare('DELETE FROM access_views WHERE ts<?').run(cut); db.prepare('DELETE FROM access_actions WHERE ts<?').run(cut); } catch (e) {} };
  setTimeout(purge, 60 * 1000).unref(); setInterval(purge, 24 * 3600 * 1000).unref();

  // ───────────── API xem thống kê (giáo viên: chỉ học sinh trong lớp mình) ─────────────
  const staff = requireRole('teacher', 'admin');
  function scope(req) {
    const onlyStudents = req.query.students === '1';
    if (req.user.role === 'admin') return { all: !onlyStudents, onlyStudents, ids: null };
    const ids = db.prepare('SELECT DISTINCT gm.user_id AS id FROM group_members gm JOIN groups g ON g.id=gm.group_id WHERE g.teacher_id=? AND gm.user_id IS NOT NULL').all(req.user.id).map((r) => Number(r.id));
    return { all: false, onlyStudents: true, ids };
  }
  // điều kiện lọc theo người dùng, dùng cho cả bảng views và actions (cột user_id)
  function filt(sc, alias) {
    const col = (alias ? alias + '.' : '') + 'user_id';
    if (sc.ids) { if (!sc.ids.length) return { sql: ' AND 0', params: [] }; return { sql: ' AND ' + col + ' IN (' + sc.ids.map(() => '?').join(',') + ')', params: sc.ids }; }
    if (sc.onlyStudents) return { sql: " AND " + col + " IN (SELECT id FROM users WHERE role='student')", params: [] };
    return { sql: '', params: [] };
  }
  const validDay = (d) => /^\d{4}-\d{2}-\d{2}$/.test(String(d || '')) ? String(d) : dayOf(Date.now());
  const userInfo = (ids) => { const m = new Map(); if (!ids.length) return m; for (const u of db.prepare('SELECT id,name,email,role FROM users WHERE id IN (' + ids.map(() => '?').join(',') + ')').all(...ids)) m.set(Number(u.id), u); return m; };
  const pageName = (p) => PAGE_NAMES[p] || p;

  // Gom lượt xem thành "lượt truy cập" (cách nhau > 30 phút = lượt mới)
  function sessionsOf(rows) {
    const by = new Map();
    for (const r of rows) { const k = r.vid || ('ip' + r.ip); if (!by.has(k)) by.set(k, []); by.get(k).push(r); }
    const out = [];
    for (const [k, arr] of by) {
      arr.sort((a, b) => a.ts - b.ts);
      let cur = null;
      for (const r of arr) {
        if (!cur || r.ts - cur.last > SESSION_GAP) { cur = { key: k, first: r.ts, last: r.ts, views: 0, logged: false, users: new Set() }; out.push(cur); }
        cur.last = r.ts; cur.views++; if (r.user_id) { cur.logged = true; cur.users.add(Number(r.user_id)); }
      }
    }
    return out;
  }

  app.get('/api/access/summary', staff, (req, res) => {
    try {
      const sc = scope(req), f = filt(sc);
      const days = Math.max(1, Math.min(90, parseInt(req.query.days, 10) || 14));
      const end = Date.now(), list = []; for (let i = days - 1; i >= 0; i--) list.push(dayOf(end - i * 86400000));
      const from = list[0];
      const views = db.prepare('SELECT ts,day,user_id,vid,ip FROM access_views WHERE day>=?' + f.sql).all(from, ...f.params);
      const acts = db.prepare('SELECT day,user_id FROM access_actions WHERE day>=?' + f.sql).all(from, ...f.params);
      const byDay = new Map(list.map((d) => [d, { day: d, views: 0, vids: new Set(), users: new Set(), actors: new Set(), actions: 0, rows: [] }]));
      for (const r of views) { const d = byDay.get(r.day); if (!d) continue; d.views++; d.vids.add(r.vid || ('ip' + r.ip)); if (r.user_id) d.users.add(Number(r.user_id)); d.rows.push(r); }
      for (const a of acts) { const d = byDay.get(a.day); if (!d) continue; d.actions++; if (a.user_id) d.actors.add(Number(a.user_id)); }
      let newUsers = new Map();
      if (req.user.role === 'admin') for (const r of db.prepare("SELECT substr(datetime(created_at,'+7 hours'),1,10) AS d, COUNT(*) AS c FROM users WHERE created_at>=? GROUP BY d").all(new Date(Date.parse(from) - TZ).toISOString())) newUsers.set(r.d, Number(r.c));
      const out = list.map((k) => {
        const d = byDay.get(k), ss = sessionsOf(d.rows);
        return { day: k, visits: ss.length, loggedVisits: ss.filter((s) => s.logged).length, guestVisits: ss.filter((s) => !s.logged).length, views: d.views, visitors: d.vids.size, users: d.users.size, actors: d.actors.size, actions: d.actions, newUsers: newUsers.get(k) || 0 };
      });
      const cutOn = Date.now() - ONLINE_MS;
      const on = db.prepare('SELECT user_id,vid,ip FROM access_views WHERE ts>=?' + f.sql).all(cutOn, ...f.params);
      res.json({ days: out, online: { visitors: new Set(on.map((r) => r.vid || ('ip' + r.ip))).size, users: new Set(on.filter((r) => r.user_id).map((r) => r.user_id)).size }, scope: sc.ids ? 'teacher' : (sc.onlyStudents ? 'students' : 'all'), keepDays: KEEP_DAYS });
    } catch (e) { console.error('[access/summary]', e.message); res.status(500).json({ error: 'Không tải được thống kê.' }); }
  });

  app.get('/api/access/day', staff, (req, res) => {
    try {
      const sc = scope(req), f = filt(sc), day = validDay(req.query.date);
      const views = db.prepare('SELECT ts,user_id,vid,path,device,browser,country,ip FROM access_views WHERE day=?' + f.sql + ' ORDER BY ts').all(day, ...f.params);
      const acts = db.prepare('SELECT ts,user_id,cat,label FROM access_actions WHERE day=?' + f.sql).all(day, ...f.params);
      // gộp theo người: cùng một thiết bị đã đăng nhập thì lượt xem trước khi đăng nhập cũng tính cho người đó
      const vidUser = new Map(); for (const r of views) if (r.user_id && r.vid) vidUser.set(r.vid, Number(r.user_id));
      const keyOf = (r) => { const u = r.user_id ? Number(r.user_id) : (r.vid && vidUser.get(r.vid)); return u ? 'u' + u : 'g' + (r.vid || ('ip' + r.ip)); };
      const vis = new Map();
      for (const r of views) {
        const k = keyOf(r); let v = vis.get(k);
        if (!v) { v = { key: k, userId: k[0] === 'u' ? Number(k.slice(1)) : null, vid: k[0] === 'g' ? k.slice(1) : null, views: 0, first: r.ts, last: r.ts, devices: new Set(), browsers: new Set(), country: r.country, ips: new Set(), pages: new Map(), rows: [], actions: 0 }; vis.set(k, v); }
        v.views++; v.last = r.ts; v.devices.add(r.device); v.browsers.add(r.browser); v.ips.add(r.ip); v.pages.set(r.path, (v.pages.get(r.path) || 0) + 1); v.rows.push(r);
      }
      for (const a of acts) { const v = a.user_id ? vis.get('u' + a.user_id) : null; if (v) v.actions++; else if (a.user_id) { vis.set('u' + a.user_id, { key: 'u' + a.user_id, userId: Number(a.user_id), vid: null, views: 0, first: a.ts, last: a.ts, devices: new Set(), browsers: new Set(), country: null, ips: new Set(), pages: new Map(), rows: [], actions: 1 }); } }
      const info = userInfo([...vis.values()].filter((v) => v.userId).map((v) => v.userId));
      const visitors = [...vis.values()].map((v) => {
        const u = v.userId ? info.get(v.userId) : null, ss = sessionsOf(v.rows);
        return { key: v.key, type: v.userId ? 'user' : 'guest', userId: v.userId, vid: v.vid, name: u ? u.name : null, email: u ? u.email : null, role: u ? u.role : null, views: v.views, visits: ss.length, first: v.first, last: v.last,
          device: [...v.devices].join('/'), browser: [...v.browsers].join('/'), country: v.country, ip: [...v.ips][0] || null, actions: v.actions,
          topPages: [...v.pages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(([p, c]) => ({ path: p, name: pageName(p), n: c })) };
      }).sort((a, b) => (b.userId ? 1 : 0) - (a.userId ? 1 : 0) || b.last - a.last);
      const pg = new Map(); for (const r of views) { let x = pg.get(r.path); if (!x) { x = { path: r.path, name: pageName(r.path), views: 0, who: new Set() }; pg.set(r.path, x); } x.views++; x.who.add(keyOf(r)); }
      const hours = Array(24).fill(0); for (const r of views) hours[new Date(r.ts + TZ).getUTCHours()]++;
      const byLabel = new Map(), byCat = {};
      for (const a of acts) { byCat[a.cat] = (byCat[a.cat] || 0) + 1; const k = a.cat + '|' + a.label; let x = byLabel.get(k); if (!x) { x = { cat: a.cat, label: a.label, n: 0, who: new Set() }; byLabel.set(k, x); } x.n++; if (a.user_id) x.who.add(a.user_id); }
      const ss = sessionsOf(views), devs = { mobile: 0, desktop: 0, tablet: 0 };
      for (const v of visitors) { const d = v.device.split('/')[0]; if (devs[d] !== undefined) devs[d]++; }
      res.json({ day, totals: { views: views.length, visits: ss.length, loggedVisits: ss.filter((s) => s.logged).length, guestVisits: ss.filter((s) => !s.logged).length, visitors: new Set(views.map((r) => r.vid || ('ip' + r.ip))).size,
        users: visitors.filter((v) => v.userId && v.views).length, actors: new Set(acts.filter((a) => a.user_id).map((a) => a.user_id)).size, actions: acts.length, guests: visitors.filter((v) => !v.userId).length },
        visitors, pages: [...pg.values()].map((x) => ({ path: x.path, name: x.name, views: x.views, who: x.who.size })).sort((a, b) => b.views - a.views).slice(0, 40), hours,
        labels: [...byLabel.values()].map((x) => ({ cat: x.cat, catName: CATS[x.cat], label: x.label, n: x.n, who: x.who.size })).sort((a, b) => b.n - a.n), cats: Object.entries(byCat).map(([k, n]) => ({ cat: k, name: CATS[k], n })), devices: devs, cats_all: CATS });
    } catch (e) { console.error('[access/day]', e.message); res.status(500).json({ error: 'Không tải được dữ liệu ngày này.' }); }
  });

  // Dòng thời gian của một người (hoặc một khách) trong một ngày: lượt xem trang + thao tác xen kẽ
  app.get('/api/access/timeline', staff, (req, res) => {
    try {
      const sc = scope(req), f = filt(sc), day = validDay(req.query.date);
      const uid = parseInt(req.query.user, 10), vid = /^[a-z0-9]{8,32}$/.test(String(req.query.vid || '')) ? String(req.query.vid) : null;
      if (!uid && !vid) return res.status(400).json({ error: 'Thiếu người dùng.' });
      let views, acts, user = null;
      if (uid) {
        if (sc.ids && !sc.ids.includes(uid)) return res.status(403).json({ error: 'Chỉ xem được học sinh trong lớp của bạn.' });
        user = db.prepare('SELECT id,name,email,role FROM users WHERE id=?').get(uid);
        const vids = db.prepare('SELECT DISTINCT vid FROM access_views WHERE day=? AND user_id=? AND vid IS NOT NULL').all(day, uid).map((r) => r.vid);
        views = db.prepare('SELECT ts,path,title,device,browser,user_id,vid FROM access_views WHERE day=? AND (user_id=?' + (vids.length ? ' OR vid IN (' + vids.map(() => '?').join(',') + ')' : '') + ') ORDER BY ts').all(day, uid, ...vids);
        acts = db.prepare('SELECT ts,cat,label,path,status FROM access_actions WHERE day=? AND user_id=? ORDER BY ts').all(day, uid);
      } else {
        if (sc.ids || sc.onlyStudents) return res.status(403).json({ error: 'Chỉ quản trị xem được khách chưa đăng nhập.' });
        views = db.prepare('SELECT ts,path,title,device,browser,user_id,vid FROM access_views WHERE day=? AND vid=? ORDER BY ts').all(day, vid); acts = [];
      }
      const ev = views.map((r) => ({ ts: r.ts, type: 'view', label: 'Xem trang: ' + pageName(r.path), path: r.path, cat: null, device: r.device, browser: r.browser, anon: !r.user_id }))
        .concat(acts.map((a) => ({ ts: a.ts, type: 'action', label: a.label, path: a.path, cat: a.cat, catName: CATS[a.cat] }))).sort((a, b) => a.ts - b.ts);
      res.json({ day, user, events: ev });
    } catch (e) { console.error('[access/timeline]', e.message); res.status(500).json({ error: 'Không tải được nhật ký.' }); }
  });

  // Nhật ký hoạt động (lọc theo ngày, nhóm, người dùng, từ khoá)
  app.get('/api/access/actions', staff, (req, res) => {
    try {
      const sc = scope(req), f = filt(sc, 'a'), day = validDay(req.query.date), cat = CATS[req.query.cat] ? String(req.query.cat) : '';
      const q = String(req.query.q || '').trim().toLowerCase().slice(0, 60), uid = parseInt(req.query.user, 10) || 0;
      const limit = Math.max(20, Math.min(500, parseInt(req.query.limit, 10) || 200)), offset = Math.max(0, parseInt(req.query.offset, 10) || 0);
      let sql = 'FROM access_actions a LEFT JOIN users u ON u.id=a.user_id WHERE a.day=?' + f.sql; const params = [day, ...f.params];
      if (cat) { sql += ' AND a.cat=?'; params.push(cat); }
      if (uid) { sql += ' AND a.user_id=?'; params.push(uid); }
      if (q) { sql += ' AND (lower(a.label) LIKE ? OR lower(u.name) LIKE ? OR lower(u.email) LIKE ?)'; const l = '%' + q.replace(/[%_]/g, '') + '%'; params.push(l, l, l); }
      const total = Number(db.prepare('SELECT COUNT(*) c ' + sql).get(...params).c);
      const rows = db.prepare('SELECT a.ts,a.cat,a.label,a.path,a.status,a.user_id,u.name,u.email,u.role ' + sql + ' ORDER BY a.ts DESC LIMIT ? OFFSET ?').all(...params, limit, offset);
      res.json({ day, total, rows: rows.map((r) => ({ ts: r.ts, cat: r.cat, catName: CATS[r.cat], label: r.label, path: r.path, status: r.status, userId: r.user_id, name: r.name, email: r.email, role: r.role })) });
    } catch (e) { console.error('[access/actions]', e.message); res.status(500).json({ error: 'Không tải được nhật ký hoạt động.' }); }
  });
};
