/* EWT Garden — thư viện quốc kỳ vẽ bằng SVG, đúng tỉ lệ, bố cục và màu chính thức của từng nước.
   QUAN TRỌNG: chỉ sửa khi đã đối chiếu với nguồn chính thức. Mỗi cờ có khung (w×h) riêng theo tỉ lệ cờ thật.
   Dùng: EWTFlags.draw('vn', x, y, width) → chuỗi SVG (nhóm <g>) đặt cờ có chiều rộng `width` tại (x, y). EWTFlags.RATIO[id] = chiều cao/chiều rộng. */
(function (root) {
  'use strict';
  function star(cx, cy, R, rot, fill) {
    var r = R * 0.381966, pts = [], i, a;   // sao 5 cánh đều: bán kính trong / ngoài = 0,381966
    for (i = 0; i < 10; i++) { a = (-90 + rot + i * 36) * Math.PI / 180; pts.push((cx + Math.cos(a) * (i % 2 ? r : R)).toFixed(3) + ',' + (cy + Math.sin(a) * (i % 2 ? r : R)).toFixed(3)); }
    return '<polygon points="' + pts.join(' ') + '" fill="' + fill + '"/>';
  }
  function rc(x, y, w, h, f) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + f + '"/>'; }
  // Mỗi cờ: { w, h, body() } trong hệ đơn vị riêng (w×h)
  var D = {
    // Việt Nam (2:3): nền đỏ, sao vàng năm cánh ở chính giữa, đường kính đường tròn ngoại tiếp sao = 2/3 chiều cao
    vn: { w: 300, h: 200, body: function () { return rc(0, 0, 300, 200, '#DA251D') + star(150, 100, 200 / 3, 0, '#FFFF00'); } },
    // Thái Lan (2:3): 5 sọc ngang tỉ lệ 1:1:2:1:1 — đỏ, trắng, xanh dương đậm (gấp đôi), trắng, đỏ
    th: { w: 300, h: 200, body: function () { var u = 200 / 6; return rc(0, 0, 300, u, '#A51931') + rc(0, u, 300, u, '#F4F5F8') + rc(0, 2 * u, 300, 2 * u, '#2D2A4A') + rc(0, 4 * u, 300, u, '#F4F5F8') + rc(0, 5 * u, 300, u, '#A51931'); } },
    // Nhật Bản (2:3): nền trắng, hình tròn đỏ ở giữa, đường kính = 3/5 chiều cao
    jp: { w: 300, h: 200, body: function () { return rc(0, 0, 300, 200, '#FFFFFF') + '<circle cx="150" cy="100" r="60" fill="#BC002D"/>'; } },
    // Trung Quốc (2:3): nền đỏ; lưới 30×20: sao lớn tâm (5,5) bán kính 3; bốn sao nhỏ bán kính 1 tại (10,2) (12,4) (12,7) (10,9), mỗi sao có một cánh hướng về tâm sao lớn
    cn: { w: 300, h: 200, body: function () {
      var s = rc(0, 0, 300, 200, '#EE1C25') + star(50, 50, 30, 0, '#FFFF00');
      [[100, 20], [120, 40], [120, 70], [100, 90]].forEach(function (p) { s += star(p[0], p[1], 10, Math.atan2(50 - p[1], 50 - p[0]) * 180 / Math.PI + 90, '#FFFF00'); });
      return s; } },
    // Ấn Độ (2:3): ba dải ngang bằng nhau — cam nghệ tây, trắng, xanh lá; bánh xe Ashoka 24 nan màu xanh navy ở giữa dải trắng (đường kính = 3/4 bề rộng dải)
    in: { w: 300, h: 200, body: function () {
      var s = rc(0, 0, 300, 200 / 3, '#FF9933') + rc(0, 200 / 3, 300, 200 / 3, '#FFFFFF') + rc(0, 400 / 3, 300, 200 / 3, '#138808'), i, a, r = 25;
      s += '<circle cx="150" cy="100" r="' + r + '" fill="none" stroke="#000080" stroke-width="2.4"/><circle cx="150" cy="100" r="3.6" fill="#000080"/>';
      for (i = 0; i < 24; i++) { a = i * 15 * Math.PI / 180; s += '<line x1="150" y1="100" x2="' + (150 + Math.cos(a) * r).toFixed(2) + '" y2="' + (100 + Math.sin(a) * r).toFixed(2) + '" stroke="#000080" stroke-width="1.1"/>'; }
      return s; } },
    // Pháp (2:3): ba dải dọc bằng nhau — xanh (sát cán cờ), trắng, đỏ
    fr: { w: 300, h: 200, body: function () { return rc(0, 0, 100, 200, '#0055A4') + rc(100, 0, 100, 200, '#FFFFFF') + rc(200, 0, 100, 200, '#EF4135'); } },
    // Ý (2:3): ba dải dọc bằng nhau — xanh lá (sát cán cờ), trắng, đỏ
    it: { w: 300, h: 200, body: function () { return rc(0, 0, 100, 200, '#009246') + rc(100, 0, 100, 200, '#FFFFFF') + rc(200, 0, 100, 200, '#CE2B37'); } },
    // Vương quốc Anh (1:2): Union Jack — chữ thập St George đỏ viền trắng, chéo St Andrew trắng, chéo St Patrick đỏ lệch (counterchanged)
    uk: { w: 600, h: 300, body: function () {
      return '<defs><clipPath id="fl-uks"><path d="M0,0 v30 h60 v-30 z"/></clipPath><clipPath id="fl-ukt"><path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z"/></clipPath></defs>' +
        '<g transform="scale(10)"><g clip-path="url(#fl-uks)"><path d="M0,0 v30 h60 v-30 z" fill="#012169"/><path d="M0,0 L60,30 M60,0 L0,30" stroke="#FFFFFF" stroke-width="6"/><path d="M0,0 L60,30 M60,0 L0,30" clip-path="url(#fl-ukt)" stroke="#C8102E" stroke-width="4"/><path d="M30,0 v30 M0,15 h60" stroke="#FFFFFF" stroke-width="10"/><path d="M30,0 v30 M0,15 h60" stroke="#C8102E" stroke-width="6"/></g></g>'; } },
    // Hoa Kỳ (10:19): 13 sọc ngang (7 đỏ, 6 trắng, đỏ ở trên cùng); ô xanh phủ 7 sọc, rộng 0,76 chiều cao; 50 sao xếp 9 hàng (6 và 5 sao xen kẽ)
    us: { w: 190, h: 100, body: function () {
      var s = rc(0, 0, 190, 100, '#FFFFFF'), i, j, n, h13 = 100 / 13;
      for (i = 0; i < 13; i += 2) s += rc(0, i * h13, 190, h13, '#B22234');
      s += rc(0, 0, 76, 7 * h13, '#3C3B6E');
      for (i = 0; i < 9; i++) { n = i % 2 ? 5 : 6; for (j = 0; j < n; j++) s += star((i % 2 ? 12.6 : 6.3) + j * 12.6, 5.4 * (i + 1), 3.08, 0, '#FFFFFF'); }
      return s; } },
    // Đức (3:5): ba dải ngang bằng nhau — đen, đỏ, vàng
    de: { w: 250, h: 150, body: function () { return rc(0, 0, 250, 50, '#000000') + rc(0, 50, 250, 50, '#DD0000') + rc(0, 100, 250, 50, '#FFCE00'); } },
    // Hà Lan (2:3): ba dải ngang bằng nhau — đỏ, trắng, xanh dương
    nl: { w: 300, h: 200, body: function () { return rc(0, 0, 300, 200 / 3, '#AE1C28') + rc(0, 200 / 3, 300, 200 / 3, '#FFFFFF') + rc(0, 400 / 3, 300, 200 / 3, '#21468B'); } },
    // Hy Lạp (2:3): 9 sọc ngang xanh – trắng xen kẽ (bắt đầu bằng sọc xanh); ô vuông xanh góc trên bên cán rộng bằng 5 sọc, có chữ thập trắng bề rộng bằng một sọc
    gr: { w: 300, h: 200, body: function () {
      var u = 200 / 9, s = rc(0, 0, 300, 200, '#FFFFFF'), i;
      for (i = 0; i < 9; i += 2) s += rc(0, i * u, 300, u, '#0D5EAF');
      return s + rc(0, 0, 5 * u, 5 * u, '#0D5EAF') + rc(2 * u, 0, u, 5 * u, '#FFFFFF') + rc(0, 2 * u, 5 * u, u, '#FFFFFF'); } },
    // Thụy Điển (5:8): nền xanh, chữ thập vàng lệch về phía cán cờ (lưới 16×10: thanh dọc x 5–7, thanh ngang y 4–6)
    se: { w: 160, h: 100, body: function () { return rc(0, 0, 160, 100, '#006AA7') + rc(50, 0, 20, 100, '#FECC02') + rc(0, 40, 160, 20, '#FECC02'); } },
    // Thụy Sĩ (1:1): nền đỏ, chữ thập trắng vuông (lưới 32: tay rộng 6, dài 7 mỗi bên từ ô vuông giữa → thanh từ 6 đến 26)
    ch: { w: 100, h: 100, body: function () { var k = 100 / 32; return rc(0, 0, 100, 100, '#DA291C') + rc(6 * k, 13 * k, 20 * k, 6 * k, '#FFFFFF') + rc(13 * k, 6 * k, 6 * k, 20 * k, '#FFFFFF'); } },

    // Hàn Quốc (2:3) — hình học lấy từ bản vẽ chuẩn công khai: đường kính Thái Cực = 1/2 chiều cao; quẻ nghiêng 33,69° theo đường chéo (Càn ☰ trên-trái, Khôn ☷ dưới-phải, Khảm ☵ trên-phải, Ly ☲ dưới-trái); nét quẻ dày D/12, hở D/24
    kr: { w: 300, h: 200, body: function () {
      return '<rect width="300" height="200" fill="#FFFFFF"/><g transform="translate(150 100) scale(2.0833333)"><g stroke="#000" stroke-width="4"><path transform="rotate(33.69006752598)" d="M-50-12v24m6 0v-24m6 0v24m76 0V1m0-2v-11m6 0v11m0 2v11m6 0V1m0-2v-11"/><path transform="rotate(-33.69006752598)" d="M-50-12v24m6 0V1m0-2v-11m6 0v24m76 0V1m0-2v-11m6 0v24m6 0V1m0-2v-11"/></g><g transform="rotate(33.69006752598)"><path fill="#CD2E3A" d="M12 0a18 18 0 11-36 0 24 24 0 1148 0"/><path fill="#0047A0" d="M-24 0a24 24 0 1048 0A12 12 0 100 0a12 12 0 11-24 0"/></g></g>'; } },
    // Canada (1:2): ba phần 1:2:1 — đỏ, ô vuông trắng, đỏ; lá phong cách điệu 11 nhọn màu đỏ ở chính giữa
    ca: { w: 960, h: 480, body: function () {
      return '<g transform="scale(.1)"><path fill="#D52B1E" d="m0 0h2400l99 99h4602l99-99h2400v4800h-2400l-99-99h-4602l-99 99H0z"/><path fill="#FFFFFF" d="m2400 0h4800v4800h-4800zm2490 4430-45-863a95 95 0 0 1 111-98l859 151-116-320a65 65 0 0 1 20-73l941-762-212-99a65 65 0 0 1-34-79l186-572-542 115a65 65 0 0 1-73-38l-105-247-423 454a65 65 0 0 1-111-57l204-1052-327 189a65 65 0 0 1-91-27l-332-652-332 652a65 65 0 0 1-91 27l-327-189 204 1052a65 65 0 0 1-111 57l-423-454-105 247a65 65 0 0 1-73 38l-542-115 186 572a65 65 0 0 1-34 79l-212 99 941 762a65 65 0 0 1 20 73l-116 320 859-151a95 95 0 0 1 111 98l-45 863z"/></g>'; } },
    // Thổ Nhĩ Kỳ (2:3): nền đỏ #E30A17; trăng lưỡi liềm và sao năm cánh trắng (đường tròn ngoài r=15000, trong r=12000 lệch về phía đuôi cờ; sao nội tiếp đường kính 1/4)
    tr: { w: 300, h: 200, body: function () {
      return '<g transform="scale(.0033333333) translate(0 30000)"><path fill="#E30A17" d="m0-30000h90000v60000H0z"/><path fill="#FFFFFF" d="m41750 0 13568-4408-8386 11541V-7133l8386 11541zm925 8021a15000 15000 0 1 1 0-16042 12000 12000 0 1 0 0 16042z"/></g>'; } },
    // Úc (1:2): nền xanh #012169; góc trên-trái là Union Jack; Sao Liên bang 7 cánh dưới góc cờ; chòm Nam Thập: 4 sao 7 cánh + 1 sao nhỏ 5 cánh
    au: { w: 1008, h: 504, body: function () {
      var S7 = 'M0,-360 69.421398,-144.155019 281.459334,-224.456329 155.988466,-35.603349 350.974048,80.107536 125.093037,99.758368 156.198146,324.348792 0,160 -156.198146,324.348792 -125.093037,99.758368 -350.974048,80.107536 -155.988466,-35.603349 -281.459334,-224.456329 -69.421398,-144.155019z',
        S5 = 'M0,-210 54.859957,-75.508253 199.721868,-64.893569 88.765275,28.841586 123.434903,169.893569 0,93.333333 -123.434903,169.893569 -88.765275,28.841586 -199.721868,-64.893569 -54.859957,-75.508253z';
      return '<g transform="scale(.1)"><defs><clipPath id="fl-auc1"><path d="M0,0H6V3H0z"/></clipPath><clipPath id="fl-auc2"><path d="M0,0V1.5H6V3H6zM6,0H3V3H0V3z"/></clipPath></defs><g transform="scale(840)"><rect width="12" height="6" fill="#012169"/><path d="M0,0 6,3M6,0 0,3" stroke="#fff" stroke-width="0.6" clip-path="url(#fl-auc1)"/><path d="M0,0 6,3M6,0 0,3" stroke="#E4002B" stroke-width="0.4" clip-path="url(#fl-auc2)"/><path d="M3,0V3M0,1.5H6" stroke="#fff"/><path d="M3,0V3M0,1.5H6" stroke="#E4002B" stroke-width="0.6"/></g><g fill="#fff"><path transform="translate(2520 3780) scale(2.1)" d="' + S7 + '"/><path transform="translate(7560 4200)" d="' + S7 + '"/><path transform="translate(6300 2205)" d="' + S7 + '"/><path transform="translate(7560 840)" d="' + S7 + '"/><path transform="translate(8680 1869)" d="' + S7 + '"/><path transform="translate(8064 2730)" d="' + S5 + '"/></g></g>'; } },
    // Ma-rốc (2:3): nền đỏ #C1272D; sao năm cánh xanh lá #006233 chỉ vẽ nét viền (ngôi sao Solomon) ở chính giữa
    ma: { w: 300, h: 200, body: function () {
      return '<g transform="scale(.0033333333)"><path fill="#C1272D" d="m0 0h90000v60000H0z"/><path fill="none" stroke="#006233" stroke-width="1426" d="m45000 17308 7460 22960-19531-14190h24142L37540 40268z"/></g>'; } },
    // Indonesia (2:3): hai dải ngang bằng nhau — đỏ ở trên, trắng ở dưới
    id: { w: 300, h: 200, body: function () { return rc(0, 0, 300, 100, '#CE1126') + rc(0, 100, 300, 100, '#FFFFFF'); } }
  };
  var RATIO = {}; Object.keys(D).forEach(function (k) { RATIO[k] = D[k].h / D[k].w; });
  // Vẽ cờ có chiều rộng `width` tại (x, y); thêm viền mảnh để cờ trắng không chìm vào nền
  function draw(id, x, y, width) {
    var f = D[id]; if (!f) return '';
    var k = width / f.w;
    return '<g transform="translate(' + x + ' ' + y + ') scale(' + k + ')">' + f.body() + '<rect width="' + f.w + '" height="' + f.h + '" fill="none" stroke="rgba(0,0,0,.28)" stroke-width="' + (1.4 / k).toFixed(2) + '"/></g>';
  }
  var API = { draw: draw, RATIO: RATIO, IDS: Object.keys(D), star: star };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTFlags = API;
})(typeof window !== 'undefined' ? window : this);
