/* EWT Garden — SỰ KIỆN THEO MÙA (Tết Nguyên Đán, Trung thu, Giáng sinh): lịch, món giới hạn, từ vựng tiếng Anh theo lễ hội.
   Dùng chung cho máy chủ và trình duyệt. Mỗi sự kiện có 16 món giới hạn (3 hoa, 3 cây, 5 trang trí, 2 công trình, 3 thú cưng):
   chỉ MUA / nhận nuôi được trong thời gian sự kiện; món đã có (đang đặt hoặc trong giỏ) thì giữ mãi.
   Ngày Tết và Rằm tháng 8 lấy từ lịch âm Việt Nam (tra sẵn đến 2035); khung thời gian rộng nên lệch 1 ngày cũng không ảnh hưởng. */
(function (root) {
  'use strict';
  var DAY = 86400000;
  var ANCHOR = {   // ngày chính của lễ (dương lịch): Mùng 1 Tết, Rằm tháng 8 (Trung thu), 25/12
    tet: { 2026: '2026-02-17', 2027: '2027-02-06', 2028: '2028-01-26', 2029: '2029-02-13', 2030: '2030-02-03', 2031: '2031-01-23', 2032: '2032-02-11', 2033: '2033-01-31', 2034: '2034-02-19', 2035: '2035-02-08' },
    trungthu: { 2026: '2026-09-25', 2027: '2027-09-15', 2028: '2028-10-03', 2029: '2029-09-22', 2030: '2030-09-12', 2031: '2031-10-01', 2032: '2032-09-19', 2033: '2033-09-08', 2034: '2034-09-27', 2035: '2035-09-16' }
  };
  var EVENTS = [
    { id: 'tet', name: 'Tết Nguyên Đán', short: 'Tết', icon: '🧧', before: 14, after: 10, col: ['#D6212F', '#FFD23F'], en: 'Lunar New Year',
      blurb: 'Tết là dịp lớn nhất năm của người Việt: cả nhà sum họp, trang trí hoa đào, hoa mai, gói bánh chưng và nhận lì xì đầu năm.',
      gift: 'Lì xì may mắn', vocab: [['Lunar New Year', 'Tết Nguyên Đán'], ['red envelope', 'bao lì xì'], ['peach blossom', 'hoa đào'], ['apricot blossom', 'hoa mai'], ['sticky rice cake', 'bánh chưng'], ['lion dance', 'múa lân']] },
    { id: 'trungthu', name: 'Tết Trung thu', short: 'Trung thu', icon: '🏮', before: 14, after: 3, col: ['#F59E0B', '#7C3AED'], en: 'Mid-Autumn Festival',
      blurb: 'Rằm tháng 8 là Tết của thiếu nhi: các em rước đèn ông sao, xem múa lân, ngắm trăng tròn và cùng nhau phá cỗ.',
      gift: 'Quà Rằm', vocab: [['Mid-Autumn Festival', 'Tết Trung thu'], ['mooncake', 'bánh Trung thu'], ['lantern', 'lồng đèn'], ['full moon', 'trăng tròn'], ['jade rabbit', 'thỏ ngọc'], ['star-shaped lantern', 'đèn ông sao']] },
    { id: 'noel', name: 'Giáng sinh', short: 'Giáng sinh', icon: '🎄', before: 17, after: 7, col: ['#C62828', '#2E7D32'], en: 'Christmas',
      blurb: 'Giáng sinh (25/12) là dịp trang trí cây thông, tặng quà cho nhau, ngắm tuyết rơi và gặp ông già Noel cùng chú tuần lộc.',
      gift: 'Quà Noel', vocab: [['Christmas tree', 'cây thông Noel'], ['Santa Claus', 'ông già Noel'], ['reindeer', 'tuần lộc'], ['snowman', 'người tuyết'], ['gingerbread house', 'nhà bánh gừng'], ['present', 'món quà']] }
  ];
  var EBY = {}; EVENTS.forEach(function (e) { EBY[e.id] = e; });

  function toMs(s) { var p = String(s).split('-'); return Date.UTC(+p[0], +p[1] - 1, +p[2]); }
  function fmt(ms) { return new Date(ms).toISOString().slice(0, 10); }
  function anchorOf(id, year) { return id === 'noel' ? year + '-12-25' : (ANCHOR[id] || {})[year] || null; }
  // Các khung thời gian (theo năm) của một sự kiện
  function windowsOf(id) {
    var e = EBY[id], out = [], y;
    if (!e) return out;
    for (y = 2025; y <= 2036; y++) { var a = anchorOf(id, y); if (a) out.push({ key: id + '-' + y, from: fmt(toMs(a) - e.before * DAY), to: fmt(toMs(a) + e.after * DAY), anchor: a }); }
    return out;
  }
  // Sự kiện đang diễn ra vào ngày `day` (YYYY-MM-DD, giờ Việt Nam). `force`: { id: {from,to} } do thầy cô mở sớm / đóng
  function activeOn(day, force) {
    var res = [], t = toMs(day);
    EVENTS.forEach(function (e) {
      var f = force && force[e.id], w = null;
      if (f && f.closed) return;
      if (f && f.from && f.to && day >= f.from && day <= f.to) w = { key: e.id + '-' + f.from.slice(0, 4), from: f.from, to: f.to, anchor: f.from, forced: true };
      else windowsOf(e.id).forEach(function (x) { if (day >= x.from && day <= x.to) w = x; });
      if (w) res.push({ id: e.id, key: w.key, from: w.from, to: w.to, left: Math.round((toMs(w.to) - t) / DAY), forced: !!w.forced });
    });
    return res;
  }
  function upcomingOn(day) {
    var t = toMs(day), best = null;
    EVENTS.forEach(function (e) { windowsOf(e.id).forEach(function (w) { var d = Math.round((toMs(w.from) - t) / DAY); if (d > 0 && (!best || d < best.days)) best = { id: e.id, key: w.key, from: w.from, days: d }; }); });
    return best;
  }

  /* ───────── 48 món giới hạn ───────── */
  // [id, tên, c1, c2, giá, cấp, thời gian lớn (phút, hoa/cây), xu thu hoạch, điểm đẹp]
  var F = {
    tet: [['f1', 'Thủy tiên', '#FFFFFF', '#FFC83D', 70, 1, 80, 10, 4], ['f2', 'Lay ơn đỏ', '#E5334B', '#2E8B57', 90, 2, 100, 13, 5], ['f3', 'Mào gà đỏ', '#D61F3A', '#8E1228', 80, 2, 90, 12, 5]],
    trungthu: [['f1', 'Hoa quỳnh', '#FFFFFF', '#FFF3B0', 90, 2, 100, 13, 5], ['f2', 'Hoa bưởi', '#FFFFFF', '#F7E27A', 70, 1, 80, 10, 4], ['f3', 'Hoa lồng đèn', '#FF8A1F', '#FFD08A', 90, 2, 100, 13, 5]],
    noel: [['f1', 'Trạng nguyên', '#D8283A', '#2E8B57', 80, 1, 90, 12, 5], ['f2', 'Tầm gửi', '#3FA45B', '#FFFFFF', 70, 1, 80, 10, 4], ['f3', 'Hồng Giáng sinh', '#F6F1FF', '#B9C9A2', 90, 2, 100, 13, 5]]
  };
  var T = {
    tet: [['t1', 'Cây đào Tết', '#FF8FB8', '#E5334B', 380, 3, 360, 60, 16], ['t2', 'Cây mai vàng', '#FFD23F', '#C98A00', 380, 3, 360, 60, 16], ['t3', 'Cây quất cảnh', '#3E9B4F', '#FF9A1F', 300, 2, 300, 50, 14]],
    trungthu: [['t1', 'Cây đa Chú Cuội', '#3E8F4A', '#7A4A22', 420, 3, 360, 65, 17], ['t2', 'Cây bưởi Rằm', '#4FA84F', '#F2D84A', 320, 2, 300, 52, 14], ['t3', 'Cây quế Cung Hằng', '#7DBB5A', '#FFD86B', 460, 3, 360, 70, 18]],
    noel: [['t1', 'Thông Noel lấp lánh', '#2E8B57', '#E5334B', 400, 3, 360, 62, 17], ['t2', 'Thông tuyết trắng Noel', '#2F7F5A', '#F4FAFF', 340, 2, 300, 54, 15], ['t3', 'Ô rô Giáng sinh', '#2B7A45', '#E5334B', 280, 2, 280, 46, 13]]
  };
  var D = {   // trang trí
    tet: [['d1', 'Mâm ngũ quả', 180, 2, 8], ['d2', 'Bánh chưng', 120, 1, 6], ['d3', 'Lồng đèn đỏ', 90, 1, 5], ['d4', 'Câu đối đỏ', 140, 2, 7], ['d5', 'Pháo hoa Xuân', 220, 3, 9]],
    trungthu: [['d1', 'Đèn ông sao', 110, 1, 6], ['d2', 'Đèn kéo quân Rằm', 240, 3, 10], ['d3', 'Bánh Trung thu', 100, 1, 5], ['d4', 'Mâm cỗ Rằm', 200, 2, 8], ['d5', 'Tò he', 90, 1, 5]],
    noel: [['d1', 'Hộp quà Noel', 100, 1, 6], ['d2', 'Người tuyết', 150, 2, 8], ['d3', 'Tất Giáng sinh', 80, 1, 5], ['d4', 'Vòng nguyệt quế', 130, 2, 7], ['d5', 'Gậy kẹo đỏ trắng', 90, 1, 5]]
  };
  var B = {   // công trình lớn: [id, tên, rộng, cao, giá, cấp, điểm đẹp]
    tet: [['b1', 'Cổng chào Xuân', 3, 1, 900, 3, 40], ['b2', 'Chợ hoa Tết', 2, 2, 1400, 4, 55]],
    trungthu: [['b1', 'Cổng đèn lồng', 3, 1, 850, 3, 38], ['b2', 'Lầu ngắm trăng', 2, 2, 1500, 4, 58]],
    noel: [['b1', 'Nhà bánh gừng', 2, 2, 1300, 4, 52], ['b2', 'Xưởng ông già Noel', 3, 2, 2200, 5, 80]]
  };
  var P = {   // thú cưng: [id, tên, giá, cấp]
    tet: [['p1', 'Lân con', 500, 2], ['p2', 'Mèo thần tài', 600, 3], ['p3', 'Én báo xuân', 450, 2]],
    trungthu: [['p1', 'Thỏ ngọc', 520, 2], ['p2', 'Cá chép đèn lồng', 480, 2], ['p3', 'Rồng đèn con', 700, 3]],
    noel: [['p1', 'Tuần lộc mũi đỏ', 560, 2], ['p2', 'Gấu Bắc cực con', 620, 3], ['p3', 'Cú tuyết Noel', 480, 2]]
  };
  var PFX = { tet: 'tet_', trungthu: 'tt_', noel: 'nl_' };

  // Thêm các món sự kiện vào danh sách món / thú cưng của cửa hàng (mỗi món có `ev` = mã sự kiện)
  function build(ctx) {
    EVENTS.forEach(function (e) {
      var px = PFX[e.id];
      F[e.id].forEach(function (s) { ctx.items.push({ id: px + s[0], name: s[1], kind: 'plant', cost: s[4], lvl: s[5], grow: s[6], y: s[7], b: s[8], c: s[2], c2: s[3], ev: e.id }); });
      T[e.id].forEach(function (s) { ctx.items.push({ id: px + s[0], name: s[1], kind: 'tree', cost: s[4], lvl: s[5], grow: s[6], y: s[7], b: s[8], c: s[2], c2: s[3], ev: e.id }); });
      D[e.id].forEach(function (s) { ctx.items.push({ id: px + s[0], name: s[1], kind: 'deco', cost: s[2], lvl: s[3], b: s[4], ev: e.id }); });
      B[e.id].forEach(function (s) { ctx.items.push({ id: px + s[0], name: s[1], kind: 'big', w: s[2], h: s[3], cost: s[4], lvl: s[5], b: s[6], ev: e.id }); });
      P[e.id].forEach(function (s) { ctx.pets.push({ id: px + s[0], name: s[1], cost: s[2], lvl: s[3], ev: e.id }); });
    });
  }
  function itemsOf(id, ctx) {   // id các món của một sự kiện (để đếm bộ sưu tập)
    var px = PFX[id], out = [];
    [F, T, D, B, P].forEach(function (g) { (g[id] || []).forEach(function (s) { out.push(px + s[0]); }); });
    return out;
  }
  var MILES = [[8, { xu: 300, chest: 1 }, '8 món'], [16, { xu: 800, chest: 2, free: { big: 1 } }, 'đủ 16 món']];

  var API = { EVENTS: EVENTS, EBY: EBY, windowsOf: windowsOf, activeOn: activeOn, upcomingOn: upcomingOn, build: build, itemsOf: itemsOf, MILES: MILES, PFX: PFX };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenEvents = API;
})(typeof window !== 'undefined' ? window : this);
