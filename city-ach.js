'use strict';
// 🏅 EWT City — Huy hiệu & thành tựu: mốc dân số, cấp, số công trình, số quận, độ đa dạng, trang trí, đường, hạnh phúc.
// Đạt mốc thì bấm NHẬN để lấy xu thưởng (mỗi huy hiệu nhận một lần). Chỉ đọc trạng thái thành phố, không đổi dữ liệu thành phố ngoài tiền thưởng.
const C = require('./js/city-data.js');

module.exports = function (app, { db, requireAuth }) {
  db.exec(`CREATE TABLE IF NOT EXISTS city_ach (user_id INTEGER NOT NULL, id TEXT NOT NULL, ts TEXT, PRIMARY KEY (user_id, id))`);
  const K = () => app.locals.city, DECOR = { tree: 1, flower: 1, bench: 1, lamp: 1, orna: 1 };
  // chuỗi huy hiệu: [nhóm, biểu tượng, mô tả đơn vị, [mốc], [xu], [tên từng bậc]]
  const CH = [
    ['pop', '👥', 'dân cư', [50, 200, 500, 1000, 3000, 10000], [100, 300, 800, 2000, 6000, 20000], ['Xóm nhỏ', 'Làng xinh', 'Thị trấn', 'Thành phố sầm uất', 'Đô thị lớn', 'Siêu đô thị']],
    ['level', '⭐', 'cấp thành phố', [3, 6, 10, 15, 20], [150, 400, 1000, 2500, 6000], ['Tân binh', 'Kiến trúc sư', 'Thị trưởng', 'Nhà quy hoạch', 'Huyền thoại']],
    ['bcount', '🏗️', 'công trình', [10, 50, 150, 400], [120, 500, 1500, 4000], ['Thợ xây', 'Nhà thầu', 'Tổng thầu', 'Ông trùm xây dựng']],
    ['dist', '🗺️', 'quận đã mở', [2, 4, 7, 12], [200, 600, 1800, 5000], ['Mở rộng', 'Khai phá', 'Nhà thám hiểm', 'Chủ cả vùng']],
    ['kinds', '🎨', 'loại công trình khác nhau', [10, 30, 60, 120], [150, 500, 1500, 4000], ['Tò mò', 'Nhà sưu tập', 'Bảo tàng sống', 'Bách khoa toàn thư']],
    ['decor', '🌳', 'món cây, hoa, ghế, đèn, trang trí', [10, 50, 150], [100, 400, 1200], ['Người làm vườn', 'Nhà thiết kế cảnh quan', 'Thành phố vườn']],
    ['roads', '🛣️', 'ô đường tự xây', [20, 100, 300], [100, 400, 1200], ['Thợ đường', 'Kỹ sư giao thông', 'Mạng lưới vàng']],
    ['happy', '😄', '% hạnh phúc', [80, 95], [300, 1000], ['Dân vui vẻ', 'Thành phố hạnh phúc nhất']]
  ];
  const LIST = []; CH.forEach((c) => c[3].forEach((g, i) => LIST.push({ id: c[0] + (i + 1), grp: c[0], ic: c[1], vi: c[5][i], unit: c[2], goal: g, xu: c[4][i], tier: i + 1 })));
  const BY = {}; LIST.forEach((a) => { BY[a.id] = a; });

  function metrics(st) {
    const s = K().stats(st), built = st.bs.filter((b) => b.lv > 0), kinds = {}; let decor = 0;
    built.forEach((b) => { kinds[b.k] = 1; const it = C.BY[b.k]; if (it && DECOR[it.cat]) decor++; });
    return { pop: s.pop, level: s.level, bcount: built.length, dist: st.districts.length, kinds: Object.keys(kinds).length, decor, roads: Object.keys(st.roads || {}).length, happy: s.happy };
  }
  const claimedOf = (uid) => { const o = {}; db.prepare('SELECT id FROM city_ach WHERE user_id=?').all(uid).forEach((r) => { o[r.id] = 1; }); return o; };

  app.get('/api/city/ach', requireAuth, (req, res) => {
    const st = K().peek(req.user.id), m = st ? metrics(st) : {}, cl = claimedOf(req.user.id);
    const list = LIST.map((a) => { const cur = m[a.grp] | 0; return { id: a.id, grp: a.grp, ic: a.ic, vi: a.vi, unit: a.unit, goal: a.goal, xu: a.xu, tier: a.tier, cur: Math.min(cur, a.goal), done: cur >= a.goal, claimed: !!cl[a.id] }; });
    res.json({ list, ready: list.filter((a) => a.done && !a.claimed).length, claimed: list.filter((a) => a.claimed).length, total: list.length });
  });
  app.post('/api/city/ach/claim', requireAuth, (req, res) => {
    const a = BY[String((req.body || {}).id)], uid = req.user.id; if (!a) return res.status(400).json({ error: 'Huy hiệu không tồn tại.' });
    const out = K().tx(() => {
      const st = K().load(uid), m = metrics(st); if ((m[a.grp] | 0) < a.goal) return { err: 'Bạn chưa đạt mốc này.' };
      if (db.prepare('SELECT 1 FROM city_ach WHERE user_id=? AND id=?').get(uid, a.id)) return { err: 'Bạn đã nhận huy hiệu này rồi.' };
      db.prepare('INSERT INTO city_ach (user_id,id,ts) VALUES (?,?,?)').run(uid, a.id, new Date().toISOString()); K().addCoins(uid, a.xu); return { ok: 1 };
    });
    if (out.err) return res.status(400).json({ error: out.err });
    res.json({ ok: true, xu: a.xu, coins: K().coinsOf(uid) });
  });
};
