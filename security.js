// Lớp bảo vệ chống tấn công DoS / dò mật khẩu cho English With Tom — không cần thư viện ngoài.
//
// Các lớp phòng thủ (từ ngoài vào trong):
//  1. Xác định đúng IP người dùng sau proxy Railway (không tin tưởng X-Forwarded-For do khách tự gửi).
//  2. Cấm tạm thời IP gửi request quá dày (rejected rất rẻ — trước cả khi đọc body hay chạm vào DB).
//  3. Giới hạn tần suất toàn cục theo IP + giới hạn riêng cho đăng nhập / đăng ký / quên mật khẩu / AI / tải file.
//  4. Tự "xả tải" (503) khi vòng lặp sự kiện bị nghẽn, ưu tiên người đã đăng nhập.
//  5. Timeout kết nối (chống Slowloris), vá lỗi async không bắt được (một request lỗi không được làm sập cả server).
//  6. Chỉ phục vụ file công khai (không lộ mã nguồn server.js, db.js, OPERATIONS.md...).
'use strict';

const path = require('path');
const express = require('express');

// ───────────────────────── Bộ đếm tần suất (cửa sổ cố định, tự dọn dẹp) ─────────────────────────
const MAX_KEYS = 150000;           // trần bộ nhớ: kẻ tấn công không thể làm phình RAM bằng cách đổi IP/email
const counters = new Map();        // key -> { n, reset }
const bans = new Map();            // ip -> thời điểm hết cấm

function hit(key, limit, windowMs) {
  const t = Date.now();
  let c = counters.get(key);
  if (!c || c.reset <= t) {
    if (!c && counters.size >= MAX_KEYS) sweep(true);
    c = { n: 0, reset: t + windowMs };
    counters.set(key, c);
  }
  c.n++;
  return { ok: c.n <= limit, n: c.n, retry: Math.max(1, Math.ceil((c.reset - t) / 1000)) };
}
function peek(key) {
  const c = counters.get(key);
  return c && c.reset > Date.now() ? c.n : 0;
}
function clearKey(key) { counters.delete(key); }
function sweep(force) {
  const t = Date.now();
  for (const [k, c] of counters) if (c.reset <= t) counters.delete(k);
  for (const [k, u] of bans) if (u <= t) bans.delete(k);
  if (force && counters.size >= MAX_KEYS) counters.clear(); // tình huống cực đoan: bị tấn công đổi IP hàng loạt
}
setInterval(() => sweep(false), 60 * 1000).unref();

// ───────────────────────── IP khách thật ─────────────────────────
// Railway (và mọi reverse proxy) THÊM IP kết nối vào CUỐI X-Forwarded-For. Phần đứng trước là do khách tự
// khai và có thể giả mạo → luôn lấy phần tử tính từ bên phải (PROXY_HOPS = số proxy tin cậy, mặc định 1).
const HOPS = Math.max(1, parseInt(process.env.PROXY_HOPS || '1', 10) || 1);
function clientIp(req) {
  const xff = String(req.headers['x-forwarded-for'] || '').split(',').map(s => s.trim()).filter(Boolean);
  if (xff.length) return xff[Math.max(0, xff.length - HOPS)].slice(0, 64);
  return (req.socket && req.socket.remoteAddress) || 'unknown';
}

// ───────────────────────── Đo độ nghẽn vòng lặp sự kiện ─────────────────────────
let lag = 0;
let _last = Date.now();
setInterval(() => { const t = Date.now(); lag = Math.max(0, t - _last - 500); _last = t; }, 500).unref();
const overloaded = () => lag > 900;

// ───────────────────────── Vá lỗi async của Express 4 ─────────────────────────
// Express 4 không bắt Promise bị reject → Node 24 sẽ làm sập tiến trình. Vá để mọi lỗi chuyển thành HTTP 500.
function patchAsyncErrors() {
  let Layer;
  try { Layer = require('express/lib/router/layer'); } catch { return; }
  if (Layer.prototype.__ewtPatched) return;
  Layer.prototype.__ewtPatched = true;
  Layer.prototype.handle_request = function (req, res, next) {
    const fn = this.handle;
    if (fn.length > 3) return next();
    try {
      const r = fn(req, res, next);
      if (r && typeof r.then === 'function') r.then(undefined, next);
    } catch (err) { next(err); }
  };
}

// ───────────────────────── Chỉ phục vụ file công khai ─────────────────────────
const PUBLIC_DIR_RE = /^\/(css|js|images|data\/school)\//;
const PUBLIC_ROOT_FILES = new Set(['/sw.js', '/manifest.json', '/favicon.png', '/favicon.svg', '/favicon.ico', '/vocab-data.js', '/']);
function isPublicPath(p) {
  if (PUBLIC_ROOT_FILES.has(p)) return true;
  if (/^\/[A-Za-z0-9_-]+\.html$/.test(p)) return true;
  return PUBLIC_DIR_RE.test(p) && !p.includes('..');
}

// ───────────────────────── Cài đặt chính ─────────────────────────
function install(app, opts) {
  opts = opts || {};
  const log = opts.log || console.warn;
  patchAsyncErrors();

  // Header an toàn (nhẹ, không phá inline script của trang)
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    next();
  });

  // Lớp 1: cấm tạm + giới hạn toàn cục theo IP
  const API_PER_MIN = parseInt(process.env.RL_API_PER_MIN || '900', 10);     // ~15 req/giây/IP (cả lớp học chung 1 IP vẫn thoải mái)
  const ALL_PER_MIN = parseInt(process.env.RL_ALL_PER_MIN || '3000', 10);    // trang + ảnh + css/js
  const BAN_FACTOR = 3;                                                       // vượt ngưỡng ×3 → cấm 10 phút
  app.use((req, res, next) => {
    const ip = clientIp(req);
    req.clientIp = ip;
    const until = bans.get(ip);
    if (until && until > Date.now()) {
      // Từ chối rẻ nhất có thể: không đọc body, không chạm DB
      res.setHeader('Retry-After', String(Math.ceil((until - Date.now()) / 1000)));
      res.setHeader('Connection', 'close');
      return res.status(429).end('Too many requests');
    }
    const isApi = req.path.startsWith('/api/');
    const a = hit('all:' + ip, ALL_PER_MIN, 60 * 1000);
    const b = isApi ? hit('api:' + ip, API_PER_MIN, 60 * 1000) : { ok: true };
    if (a.n > ALL_PER_MIN * BAN_FACTOR || (isApi && b.n > API_PER_MIN * BAN_FACTOR)) {
      bans.set(ip, Date.now() + 10 * 60 * 1000);
      log('[security] Cấm tạm 10 phút IP', ip, '(gửi request quá dày)');
      res.setHeader('Connection', 'close');
      return res.status(429).end('Too many requests');
    }
    if (!a.ok || !b.ok) {
      res.setHeader('Retry-After', String(Math.max(a.retry, b.retry || 0)));
      return res.status(429).json({ error: 'Bạn thao tác quá nhanh. Vui lòng đợi một chút rồi thử lại.' });
    }
    next();
  });

  // Lớp 2: xả tải khi server nghẽn — chỉ chặn request ẩn danh/tốn kém, giữ chỗ cho người đang học
  app.use((req, res, next) => {
    if (!overloaded()) return next();
    if (req.path === '/api/ping') return next();
    const hasSession = /(?:^|;\s*)ewt_session=/.test(req.headers.cookie || '');
    const cheapStatic = req.method === 'GET' && !req.path.startsWith('/api/');
    if (hasSession || cheapStatic) return next();
    res.setHeader('Retry-After', '5');
    return res.status(503).json({ error: 'Máy chủ đang quá tải, vui lòng thử lại sau vài giây.' });
  });

  // Chỉ phục vụ file công khai; mọi đường dẫn khác ngoài /api và /uploads → 404 (không lộ mã nguồn)
  app.use((req, res, next) => {
    const p = req.path;
    if (p.startsWith('/api/') || p.startsWith('/uploads/')) return next();
    if (req.method !== 'GET' && req.method !== 'HEAD') return res.status(405).end();
    if (!isPublicPath(p)) return res.status(404).type('text/plain').send('Not found');
    next();
  });
}

// ───────────────────────── Middleware giới hạn theo route ─────────────────────────
// limiter({ name, max, windowMs, by: 'ip'|'user'|(req)=>key, message })
function limiter(o) {
  return (req, res, next) => {
    let who;
    if (typeof o.by === 'function') who = o.by(req);
    else if (o.by === 'user') who = req.user ? 'u' + req.user.id : 'ip' + (req.clientIp || clientIp(req));
    else who = 'ip' + (req.clientIp || clientIp(req));
    if (!who) return next();
    const r = hit('rl:' + o.name + ':' + who, o.max, o.windowMs);
    if (r.ok) return next();
    res.setHeader('Retry-After', String(r.retry));
    return res.status(429).json({ error: o.message || 'Bạn thao tác quá nhiều lần. Vui lòng thử lại sau ' + Math.ceil(r.retry / 60) + ' phút.' });
  };
}

// Xử lý lỗi cuối cùng: không bao giờ làm sập server, không lộ chi tiết nội bộ
function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (res.headersSent) { try { res.end(); } catch {} return; }
  const status = err && (err.status || err.statusCode);
  if (err && err.type === 'entity.too.large') return res.status(413).json({ error: 'Dữ liệu gửi lên quá lớn.' });
  if (err && (err.type === 'entity.parse.failed' || status === 400)) return res.status(400).json({ error: 'Dữ liệu gửi lên không hợp lệ.' });
  console.error('[error]', req.method, req.path, err && err.message);
  res.status(500).json({ error: 'Có lỗi xảy ra phía máy chủ. Vui lòng thử lại.' });
}

// Áp dụng timeout cho http.Server (chống Slowloris & kết nối treo)
function hardenServer(server) {
  server.keepAliveTimeout = 65 * 1000;   // lớn hơn idle-timeout của proxy → tránh lỗi 502 ngẫu nhiên
  server.headersTimeout = 20 * 1000;     // gửi header quá chậm → ngắt
  server.requestTimeout = 120 * 1000;    // nhận toàn bộ request (kể cả upload 20MB trên mạng chậm) tối đa 2 phút
  server.setTimeout(0);
}

module.exports = { install, limiter, hit, peek, clearKey, clientIp, errorHandler, hardenServer, isPublicPath, overloaded, express };
