'use strict';
// Nhân vật (avatar) của học sinh: lưu cấu hình, mở khoá món bằng xu 🪙 (kiếm ở mục Luyện từ).
// Danh mục + vẽ SVG nằm ở js/avatar.js (dùng chung trình duyệt và máy chủ để kiểm tra dữ liệu hợp lệ).
const AV = require('./js/avatar.js');

// Nhân vật người: DiceBear (MIT) + 4 phong cách đều giấy phép CC0 (Open Peeps, Lorelei, Notionists, Thumbs) — không cần ghi công
const { createAvatar } = require('@dicebear/core');
const HUMAN_STYLES = { peeps: require('@dicebear/open-peeps'), lorelei: require('@dicebear/lorelei'), notion: require('@dicebear/notionists'), thumbs: require('@dicebear/thumbs') };
const humanCache = new Map();
function humanSvg(style, seed) {
  const key = style + ':' + seed; let svg = humanCache.get(key);
  if (!svg) {
    svg = createAvatar(HUMAN_STYLES[style], { seed, backgroundColor: ['transparent'] }).toString();
    if (humanCache.size > 3000) humanCache.clear();
    humanCache.set(key, svg);
  }
  return svg;
}

module.exports = function (app, { db, requireAuth, now }) {
  // Ảnh SVG nhân vật người — công khai, kết quả theo (style, seed) luôn cố định nên cho cache lâu
  app.get('/api/avatar/human.svg', (req, res) => {
    const s = String(req.query.s || ''), seed = String(req.query.seed || '');
    if (!HUMAN_STYLES[s] || !/^[A-Za-z0-9]{1,16}$/.test(seed)) return res.status(400).type('text/plain').send('bad request');
    res.set({ 'Content-Type': 'image/svg+xml; charset=utf-8', 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff', 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox" });
    res.send(humanSvg(s, seed));
  });

  const J = (s, d) => { try { return JSON.parse(s); } catch (_) { return d; } };
  const isStaff = (u) => u.role === 'teacher' || u.role === 'admin';
  const ownedKeys = (uid) => db.prepare("SELECT item_id FROM word_inventory WHERE user_id=? AND item_id LIKE 'ac\\_%' ESCAPE '\\'").all(uid).map((r) => r.item_id.slice(3));
  const coinsOf = (uid) => { const g = db.prepare('SELECT coins FROM word_game WHERE user_id=?').get(uid); return g ? g.coins : 0; };

  app.get('/api/me/avatar', requireAuth, (req, res) => {
    const row = db.prepare('SELECT avatar FROM users WHERE id=?').get(req.user.id);
    res.json({ cfg: row && row.avatar ? AV.normalize(J(row.avatar, null)) : null, owned: ownedKeys(req.user.id), coins: coinsOf(req.user.id), all_free: isStaff(req.user) });
  });

  // Lưu nhân vật. Món có giá phải đã mở khoá (giáo viên/quản trị dùng thử không cần).
  app.put('/api/me/avatar', requireAuth, (req, res) => {
    const cfg = AV.normalize((req.body || {}).cfg);
    if (!isStaff(req.user)) {
      const have = new Set(ownedKeys(req.user.id));
      const miss = AV.paidItems(cfg).filter((x) => !have.has(x.key));
      if (miss.length) return res.status(403).json({ error: 'Bạn chưa mở khoá: ' + miss.map((x) => x.name).join(', ') + '.', missing: miss.map((x) => x.key) });
    }
    db.prepare('UPDATE users SET avatar=? WHERE id=?').run(JSON.stringify(cfg), req.user.id);
    res.json({ ok: true, cfg });
  });

  // Mở khoá một món bằng xu
  app.post('/api/avatar/buy', requireAuth, (req, res) => {
    const it = AV.priceOfKey((req.body || {}).key);
    if (!it) return res.status(400).json({ error: 'Món này không cần mở khoá hoặc không tồn tại.' });
    if (isStaff(req.user)) return res.json({ ok: true, owned: ownedKeys(req.user.id), coins: coinsOf(req.user.id) });
    try {
      db.exec('BEGIN');
      if (db.prepare('SELECT 1 FROM word_inventory WHERE user_id=? AND item_id=?').get(req.user.id, 'ac_' + it.key)) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Bạn đã mở khoá món này rồi.' }); }
      const r = db.prepare('UPDATE word_game SET coins=coins-? WHERE user_id=? AND coins>=?').run(it.price, req.user.id, it.price);
      if (!r.changes) { db.exec('ROLLBACK'); return res.status(400).json({ error: 'Chưa đủ xu (cần ' + it.price + ' 🪙, bạn có ' + coinsOf(req.user.id) + '). Học từ ở mục Luyện từ để kiếm thêm xu nhé!', need: it.price, coins: coinsOf(req.user.id) }); }
      db.prepare('INSERT INTO word_inventory (user_id,item_id,acquired_at) VALUES (?,?,?)').run(req.user.id, 'ac_' + it.key, now());
      db.exec('COMMIT');
      res.json({ ok: true, owned: ownedKeys(req.user.id), coins: coinsOf(req.user.id) });
    } catch (e) { try { db.exec('ROLLBACK'); } catch (_) {} console.error('[avatar/buy]', e.message); res.status(500).json({ error: 'Không mở khoá được, hãy thử lại.' }); }
  });
};
