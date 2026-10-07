/* EWT Garden — 15 khu văn hoá quốc gia (phần 1: Việt Nam, Thái Lan, Nhật Bản, Trung Quốc, Ấn Độ).
   Mỗi khu có: công trình biểu tượng (3×3), công trình văn hoá (2×2), cột cờ với QUỐC KỲ ĐÚNG CHUẨN (1×1, dùng garden-flags.js) và một vật phẩm văn hoá (1×1).
   Hai vật 1×1 vẽ bằng màu phẳng (không dùng gradient) để dùng lại làm đồ trang trí trong cửa hàng. Nạp SAU garden-world3.js và garden-flags.js. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.DTH || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, BIG = API.BIG, BIGSIZE = API.BIGSIZE;
  function T(x, y, inner, extra) { return '<g transform="translate(' + x + ' ' + y + ')"' + (extra || '') + '>' + inner + '</g>'; }
  function shadow(cx, cy, rx, ry, c) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + (c || 'rgba(20,50,20,.3)') + '"/>'; }
  function F(id) { return 'url(#bg-' + id + ')'; }
  function circ(cx, cy, r, f, st) { return '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function ell(cx, cy, rx, ry, f, st) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function rect(x, y, w, h, f, st, rx) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2"' : '') + '/>'; }
  function poly(pts, f, st) { return '<polygon points="' + pts + '" fill="' + f + '"' + (st ? ' stroke="' + st + '" stroke-width="2.4" stroke-linejoin="round"' : '') + '/>'; }
  function path(d, f, st, sw) { return '<path d="' + d + '" fill="' + (f || 'none') + '"' + (st ? ' stroke="' + st + '" stroke-width="' + (sw || 2.4) + '" stroke-linecap="round" stroke-linejoin="round"' : '') + '/>'; }
  function scatter(R, W, H, n, fn) { var s = '', i; for (i = 0; i < n; i++) s += fn(R() * W, R() * H, R, i); return s; }
  function f0(n) { return n.toFixed(0); }
  // cột cờ 1×1 với quốc kỳ chính xác (id cờ trong EWTFlags)
  function flagPole(id) {
    return function (b) {
      var r = FL.RATIO[id], w = Math.min(62, 46 / r);
      return T(b.x * 100, b.y * 100, shadow(30, 92, 22, 5) + rect(18, 10, 5, 82, '#8A8F9A', '#5A6070', 2) + circ(20.5, 9, 4.6, '#F2C94C', '#C99A1B') + FL.draw(id, 23, 14, w));
    };
  }
  API.H = { T: T, shadow: shadow, F: F, circ: circ, ell: ell, rect: rect, poly: poly, path: path, scatter: scatter, f0: f0, flagPole: flagPole };
  function big(id, art, w, h) { BIG[id] = function () { return ART[art]({ x: 0, y: 0 }); }; BIGSIZE[id] = [w, h]; }
  API.bigOf = big;

  /* ═════════ VIỆT NAM — Vietnam Cultural Park ═════════ */
  THEME.vietnam = { g1: '#9ED97A', g2: '#74BD5C', ground: function (R, W, H) { return scatter(R, W, H, 24, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q10 -8 20 0q-10 -3 -20 0" stroke="rgba(60,130,60,.45)" stroke-width="3" fill="none" stroke-linecap="round"/>'; }); } };
  DTH.vietnam = { leaf: ['#4FB04A', '#3C9A44', '#7FD36B'], bush: ['#3C9A44', '#5DBE55'], rock: ['#9AA3AE', '#B9C1CB'], post: '#C9A66A', rail: '#B8873A' };
  ART.onepillar = function (b) {
    var s = '', i;
    s += ell(150, 262, 138, 34, '#5FC4C0', '#2E8F90') + ell(150, 262, 120, 26, '#7FD6D0') + ell(104, 270, 14, 6, '#4FAE62') + ell(206, 272, 16, 7, '#4FAE62');
    s += circ(100, 262, 6, '#FF9EC4') + circ(214, 266, 6, '#FF9EC4');
    s += rect(128, 150, 44, 118, F('stone'), '#7E8A9A', 6) + rect(122, 144, 56, 14, '#C9D0D9', '#7E8A9A', 4) + path('M138 170h24M138 196h24M138 222h24', '', '#9AA6B6', 2);
    s += rect(96, 88, 108, 58, '#C8402F', '#7A241B', 3) + rect(104, 96, 12, 50, '#8A5A2E', '', 2) + rect(184, 96, 12, 50, '#8A5A2E', '', 2) + rect(120, 100, 60, 46, '#3A2A1A', '', 3) + path('M128 104h44M128 112h44', '', '#F2C94C', 2);
    s += path('M70 90Q150 56 230 90L222 98Q150 70 78 98Z', '#B8532E', '#6B2A16', 2.6) + path('M92 60Q150 22 208 60L200 68Q150 38 100 68Z', '#B8532E', '#6B2A16', 2.6) + path('M150 22v-12', '', '#F2C94C', 4) + circ(150, 8, 5, '#F2C94C');
    return T(b.x * 100, b.y * 100, shadow(150, 292, 138, 8) + s);
  };
  ART.hoianhouse = function (b) {
    var s = '', i, c = ['#E23B3B', '#F2C94C', '#E23B3B', '#F2C94C'];
    s += rect(24, 70, 152, 120, '#F2C54B', '#B8932E', 3) + rect(24, 126, 152, 6, '#D9A82A') + poly('10,76 100,26 190,76 176,80 100,42 24,80', '#B8532E', '#6B2A16');
    s += rect(36, 84, 28, 34, '#2E7D4F', '#1B4F30', 2) + rect(136, 84, 28, 34, '#2E7D4F', '#1B4F30', 2) + path('M50 84v34M142 84v34M150 84v34', '', '#1B4F30', 2) + rect(80, 134, 40, 56, '#8A4A22', '#5A2A10', 3) + rect(36, 140, 28, 30, '#2E7D4F', '#1B4F30', 2) + rect(136, 140, 28, 30, '#2E7D4F', '#1B4F30', 2);
    for (i = 0; i < 4; i++) s += path('M' + (44 + i * 36) + ' 64v10', '', '#6B4A2B', 1.6) + ell(44 + i * 36, 84, 8, 10, c[i], '#8A1E1E') + path('M' + (44 + i * 36) + ' 94v8', '', '#F2C94C', 2);
    return T(b.x * 100, b.y * 100, shadow(100, 192, 84, 7) + s);
  };
  ART.vnflag = flagPole('vn');
  ART.conicalhat = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 30, 6) + '<path d="M12 78Q50 -4 88 78Q50 92 12 78Z" fill="#EBDCA2" stroke="#B89A4A" stroke-width="2.4"/><path d="M26 74Q50 16 74 74M38 78Q50 40 62 78" stroke="#C9AE5E" stroke-width="2" fill="none"/><path d="M34 80Q50 90 66 80" stroke="#D93A2E" stroke-width="3" fill="none"/>');
  };
  big('onepillar', 'onepillar', 3, 3);

  /* ═════════ THÁI LAN — Thailand Culture Park ═════════ */
  THEME.thailand = { g1: '#A8DC74', g2: '#80C25A', ground: function (R, W, H) { return scatter(R, W, H, 50, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="3" fill="' + (i % 2 ? '#FFD23F' : '#FF9EC4') + '" opacity=".7"/>'; }); } };
  DTH.thailand = { leaf: ['#3FAE4A', '#2F9A3E', '#6FCB66'], bush: ['#FFB02E', '#3FAE4A'], rock: ['#B9A47A', '#D8C49A'], post: '#F2C94C', rail: '#C9431F' };
  ART.wat = function (b) {
    var s = '', i;
    s += rect(20, 214, 260, 20, F('stone'), '#7E8A9A', 3) + rect(36, 190, 90, 26, '#F7F1E1', '#B8A878', 2) + rect(174, 190, 90, 26, '#F7F1E1', '#B8A878', 2);
    // sảnh chính hai bên: mái nhiều tầng đỏ cam – xanh
    [[44, 110], [178, 110]].forEach(function (p) { s += rect(p[0] + 8, p[1] + 50, 64, 40, '#F7F1E1', '#B8A878', 2) + poly((p[0] - 6) + ',' + (p[1] + 54) + ' ' + (p[0] + 40) + ',' + (p[1] + 16) + ' ' + (p[0] + 86) + ',' + (p[1] + 54), '#E8541E', '#8A2A10') + poly((p[0] + 6) + ',' + (p[1] + 34) + ' ' + (p[0] + 40) + ',' + (p[1] + 6) + ' ' + (p[0] + 74) + ',' + (p[1] + 34), '#2E9A6A', '#14573A') + path('M' + (p[0] + 40) + ' ' + (p[1] + 6) + 'v-14', '', '#F2C94C', 3); });
    // chedi vàng ở giữa
    s += poly('112,214 188,214 176,184 124,184', '#F2C94C', '#B8861B') + poly('124,184 176,184 166,150 134,150', '#F7D86A', '#B8861B') + path('M134 150Q130 112 150 66Q170 112 166 150Z', '#F2C94C', '#B8861B', 2.6) + path('M150 66V26', '', '#F2C94C', 6) + path('M142 54h16M144 44h12M146 36h8', '', '#B8861B', 3) + circ(150, 22, 5, '#F2C94C', '#B8861B');
    for (i = 0; i < 4; i++) s += path('M' + (138 + i * 8) + ' ' + (150 - i * 4) + 'Q' + (138 + i * 8) + ' 120 ' + (146 + i * 3) + ' 96', '', 'rgba(255,255,255,.4)', 2);
    return T(b.x * 100, b.y * 100, shadow(150, 238, 140, 8) + s);
  };
  ART.floatmarket = function (b) {
    var s = '';
    s += ell(100, 168, 92, 20, '#6FC4D8', '#2E8FB0') + path('M20 150Q100 190 180 150L170 168Q100 192 30 168Z', F('wood'), '#6B4121', 2.6) + path('M20 150Q100 172 180 150', '', '#8A5A2E', 4);
    s += ell(60, 140, 18, 9, '#F28A24', '#C9631A') + ell(80, 138, 14, 7, '#3FAE4A', '#2F7E34') + ell(120, 140, 16, 8, '#E23B3B', '#8A1E1E') + ell(142, 142, 12, 6, '#F2C94C', '#B8861B');
    s += rect(96, 100, 10, 42, '#3A6EA8', '#1F3F6A', 3) + circ(100, 90, 11, '#F1C58F', '#B8894F') + path('M80 90Q100 44 120 90Q100 96 80 90Z', '#EBDCA2', '#B89A4A', 2) + path('M92 118l-14 18M108 118l14 18', '', '#F1C58F', 4);
    return T(b.x * 100, b.y * 100, shadow(100, 188, 90, 6) + s);
  };
  ART.thflag = flagPole('th');
  ART.thelephant = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 34, 6) + '<path d="M18 80Q14 50 36 42Q62 36 78 50Q86 62 80 80Z" fill="#8FA8D8" stroke="#4F6AA8" stroke-width="2.4"/><path d="M22 52Q8 54 8 72Q8 84 16 88" fill="none" stroke="#8FA8D8" stroke-width="9" stroke-linecap="round"/><path d="M22 52Q8 54 8 72Q8 84 16 88" fill="none" stroke="#4F6AA8" stroke-width="1.6"/><ellipse cx="34" cy="52" rx="12" ry="14" fill="#B6C8EC" stroke="#4F6AA8" stroke-width="2"/><circle cx="26" cy="46" r="2.4" fill="#222"/><path d="M26 56q-4 6 -2 10" stroke="#fff" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M38 44Q56 40 70 52L64 66Q50 56 38 58Z" fill="#E23B3B" stroke="#8A1E1E" stroke-width="1.6"/><path d="M42 48Q56 46 66 54" stroke="#F2C94C" stroke-width="3" fill="none"/><rect x="26" y="78" width="12" height="12" rx="3" fill="#8FA8D8" stroke="#4F6AA8" stroke-width="2"/><rect x="62" y="78" width="12" height="12" rx="3" fill="#8FA8D8" stroke="#4F6AA8" stroke-width="2"/>');
  };
  big('wat', 'wat', 3, 3);

  /* ═════════ NHẬT BẢN — Japan Culture Park ═════════ */
  THEME.japan = { g1: '#CDEBB0', g2: '#A8D68E', ground: function (R, W, H) { return scatter(R, W, H, 70, function (x, y, r, i) { return '<ellipse cx="' + f0(x) + '" cy="' + f0(y) + '" rx="5" ry="3" transform="rotate(' + f0(r() * 180) + ' ' + f0(x) + ' ' + f0(y) + ')" fill="' + (i % 3 ? '#FFC2D8' : '#FFE0EC') + '" opacity=".8"/>'; }); } };
  DTH.japan = { leaf: ['#FFB7D0', '#FF9FC0', '#FFD3E3'], bush: ['#4F9A4A', '#6FB866'], rock: ['#9AA3AE', '#C9D0D9'], post: '#3A2A2A', rail: '#C9432F' };
  ART.fuji = function (b) {
    var s = '', i;
    s += poly('10,250 112,96 150,52 188,96 290,250', '#6E86B8', '#3F5488') + poly('150,52 188,96 290,250 220,250 170,110', 'rgba(0,0,40,.18)') + path('M118 90Q128 100 134 84Q142 104 150 82Q158 104 166 84Q172 100 184 90L150 52Z', '#FFFFFF', '#CFE0F4', 1.6) + path('M112 96Q130 112 150 96Q170 112 188 96', '', '#E8F2FF', 4);
    s += ell(150, 262, 140, 22, '#7CC4E8') + path('M30 262Q150 246 270 262', '', 'rgba(255,255,255,.5)', 3);
    [[40, 232], [78, 238], [236, 234], [266, 240]].forEach(function (p) { s += rect(p[0] - 3, p[1], 6, 24, '#7A4A3A') + circ(p[0], p[1] - 4, 20, '#FFB7D0') + circ(p[0] - 12, p[1] + 4, 12, '#FF9FC0') + circ(p[0] + 12, p[1] + 2, 12, '#FFD3E3'); });
    for (i = 0; i < 5; i++) s += rect(214, 190 - i * 14, 40 - i * 4, 12, i % 2 ? '#F2E8D0' : '#C9432F', '#6B2A16', 1.6).replace('x="214"', 'x="' + (214 + i * 2) + '"');
    return T(b.x * 100, b.y * 100, shadow(150, 290, 138, 8) + s);
  };
  ART.japancastle = function (b) {
    var s = '', i, y = 188, w = 150;
    s += poly('14,196 186,196 176,176 24,176', '#8A929C', '#4F5A68');
    for (i = 0; i < 3; i++) { w = 140 - i * 36; s += rect(100 - w / 2 + 6, y - 40 - i * 36, w - 12, 36, '#FFFFFF', '#CFC8B8', 2) + poly((100 - w / 2 - 10) + ',' + (y - 38 - i * 36) + ' ' + (100 + w / 2 + 10) + ',' + (y - 38 - i * 36) + ' ' + (100 + w / 2 - 12) + ',' + (y - 56 - i * 36) + ' ' + (100 - w / 2 + 12) + ',' + (y - 56 - i * 36), '#4A5058', '#23282E') + rect(94 - 0, y - 28 - i * 36, 12, 12, '#3A3A44', '', 2); }
    s += poly('72,30 128,30 100,4', '#4A5058', '#23282E') + circ(100, 4, 3.6, '#F2C94C');
    return T(b.x * 100, b.y * 100, shadow(100, 198, 90, 6) + s);
  };
  ART.jpflag = flagPole('jp');
  ART.maneki = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 91, 24, 5) + '<path d="M26 90Q22 62 50 58Q78 62 74 90Z" fill="#FFFFFF" stroke="#C9CFD8" stroke-width="2"/><circle cx="50" cy="40" r="22" fill="#FFFFFF" stroke="#C9CFD8" stroke-width="2"/><path d="M32 26L30 8L46 20Z M68 26L70 8L54 20Z" fill="#FFFFFF" stroke="#C9CFD8" stroke-width="2"/><path d="M34 22L33 14L41 20Z M66 22L67 14L59 20Z" fill="#F2A0B0"/><circle cx="42" cy="38" r="2.6" fill="#222"/><circle cx="58" cy="38" r="2.6" fill="#222"/><path d="M50 44v3M46 50q4 3 8 0" stroke="#222" stroke-width="1.6" fill="none"/><path d="M30 56Q50 66 70 56" stroke="#D93A2E" stroke-width="5" fill="none"/><circle cx="50" cy="64" r="4" fill="#F2C94C"/><path d="M70 66Q86 56 82 36" stroke="#FFFFFF" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M70 66Q86 56 82 36" stroke="#C9CFD8" stroke-width="2" fill="none"/><rect x="38" y="70" width="24" height="14" rx="3" fill="#F2C94C" stroke="#B8861B" stroke-width="1.6"/>');
  };
  big('fuji', 'fuji', 3, 3);

  /* ═════════ TRUNG QUỐC — China Culture Park ═════════ */
  THEME.china = { g1: '#C9E2A0', g2: '#A6CE86', ground: function (R, W, H) { return scatter(R, W, H, 22, function (x, y, r) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q10 -10 20 0q10 -10 20 0" stroke="rgba(180,60,40,.28)" stroke-width="3" fill="none" stroke-linecap="round"/>'; }); } };
  DTH.china = { leaf: ['#4FA04A', '#3C8A3E', '#79C262'], bush: ['#3C8A3E', '#E85A5A'], rock: ['#8A929C', '#AAB2BC'], post: '#D93A2E', rail: '#F2C94C' };
  ART.greatwall = function (b) {
    var s = '', i, x, y;
    s += path('M6 272Q30 196 110 214Q150 144 220 190Q268 164 292 272Z', '#6FAF5C', '#4F8A44', 2) + path('M20 284Q80 244 140 262Q210 238 284 280Z', '#5FA050');
    // tường thành uốn lượn từ trái dưới lên phải trên, có lỗ châu mai
    var pts = [[10, 262], [70, 232], [120, 238], [170, 196], [214, 190], [250, 150], [292, 132]];
    s += path('M' + pts.map(function (p) { return p[0] + ' ' + (p[1] + 14); }).join('L') + 'L292 150L250 168L214 208L170 214L120 256L70 250L10 280Z', '#8A4A3A', '#5A2A1E', 2);
    s += path('M' + pts.map(function (p) { return p[0] + ' ' + p[1]; }).join('L') + 'L292 150L250 168L214 208L170 214L120 256L70 250L10 280Z', '#C9805A', '#8A4A3A', 2.4);
    for (i = 0; i < pts.length - 1; i++) { x = pts[i][0]; y = pts[i][1]; s += rect(x + 6, y - 8, 10, 9, '#B8704A', '#8A4A3A', 1) + rect(x + 26, y - 12, 10, 9, '#B8704A', '#8A4A3A', 1); }
    // tháp canh
    s += rect(104, 150, 64, 88, '#B8704A', '#8A4A3A', 3) + rect(116, 170, 14, 22, '#3A2A1A', '', 2) + rect(142, 170, 14, 22, '#3A2A1A', '', 2) + path('M108 150h56', '', '#8A4A3A', 3) + poly('92,152 180,152 168,128 104,128', '#5A8A6A', '#2A4A38') + path('M92 152Q136 138 180 152', '', '#F2C94C', 3) + poly('112,128 160,128 136,104', '#5A8A6A', '#2A4A38') + path('M136 104V94', '', '#F2C94C', 3);
    return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 8) + s);
  };
  ART.chinapagoda = function (b) {
    var s = '', i;
    s += rect(34, 186, 132, 12, '#CFC8B8', '#8A8470', 2) + rect(44, 120, 112, 66, '#C9301F', '#7A1E14', 3) + rect(56, 124, 10, 62, '#E8B83A', '', 2) + rect(134, 124, 10, 62, '#E8B83A', '', 2) + rect(88, 146, 24, 40, '#3A1A10', '', 3) + circ(96, 166, 2, '#F2C94C') + circ(104, 166, 2, '#F2C94C');
    s += path('M24 124Q100 96 176 124L164 116Q100 90 36 116Z', '#F2C94C', '#B8861B', 2.6) + path('M44 100Q100 72 156 100L146 92Q100 66 54 92Z', '#F2C94C', '#B8861B', 2.6) + rect(66, 78, 68, 24, '#C9301F', '#7A1E14', 2) + path('M52 78Q100 40 148 78L138 70Q100 36 62 70Z', '#F2C94C', '#B8861B', 2.6) + path('M100 40v-14', '', '#B8861B', 4) + circ(100, 24, 4, '#F2C94C', '#B8861B');
    for (i = 0; i < 4; i++) s += circ(34 + i * 44, 126, 3, '#E23B3B');
    return T(b.x * 100, b.y * 100, shadow(100, 198, 86, 6) + s);
  };
  ART.cnflag = flagPole('cn');
  ART.cnlantern = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 91, 22, 5) + '<path d="M50 6v14" stroke="#8A5A2E" stroke-width="3"/><rect x="38" y="18" width="24" height="8" rx="3" fill="#F2C94C" stroke="#B8861B" stroke-width="1.6"/><ellipse cx="50" cy="48" rx="26" ry="24" fill="#E23B3B" stroke="#8A1E1E" stroke-width="2.4"/><path d="M50 24v48M36 26Q26 48 36 70M64 26Q74 48 64 70" stroke="#B02424" stroke-width="2" fill="none"/><rect x="38" y="70" width="24" height="8" rx="3" fill="#F2C94C" stroke="#B8861B" stroke-width="1.6"/><path d="M42 78v12M50 78v14M58 78v12" stroke="#F2C94C" stroke-width="3" stroke-linecap="round"/><text x="50" y="54" text-anchor="middle" font-size="18" font-weight="800" fill="#F2C94C" font-family="serif">福</text>');
  };
  big('greatwall', 'greatwall', 3, 3);

  /* ═════════ ẤN ĐỘ — India Culture Park ═════════ */
  THEME.india = { g1: '#E8D49A', g2: '#D4B974', ground: function (R, W, H) { return scatter(R, W, H, 20, function (x, y, r, i) { return '<circle cx="' + f0(x) + '" cy="' + f0(y) + '" r="' + f0(5 + r() * 7) + '" fill="none" stroke="' + (i % 2 ? 'rgba(200,90,40,.35)' : 'rgba(180,60,100,.3)') + '" stroke-width="2.4"/>'; }); } };
  DTH.india = { leaf: ['#5DA04A', '#4A8A3E', '#7FC062'], bush: ['#FF9933', '#5DA04A'], rock: ['#C9A66A', '#E0C28A'], post: '#FF9933', rail: '#138808' };
  ART.tajmahal = function (b) {
    var s = '', i;
    s += rect(30, 252, 240, 12, '#7FD0E0', '#4F9FB0', 2) + path('M30 264h240', '', 'rgba(255,255,255,.6)', 3) + rect(40, 236, 220, 20, '#F4F0E6', '#C9C2AC', 2);
    [[50, 90], [230, 90]].forEach(function (p) { s += rect(p[0], p[1] + 20, 20, 128, '#F8F4EA', '#C9C2AC', 3) + rect(p[0] - 4, p[1] + 12, 28, 10, '#E8E2D0', '#C9C2AC', 2) + poly((p[0] + 2) + ',' + (p[1] + 12) + ' ' + (p[0] + 10) + ',' + (p[1] - 6) + ' ' + (p[0] + 18) + ',' + (p[1] + 12), '#F8F4EA', '#C9C2AC') + path('M' + (p[0] + 10) + ' ' + (p[1] - 6) + 'v-10', '', '#C9C2AC', 3); });
    s += rect(84, 150, 132, 86, '#FBF8EE', '#C9C2AC', 3) + path('M122 236V186Q150 156 178 186V236Z', '#8A8470', '#6A6450', 2) + path('M92 236V190Q100 170 108 190V236ZM192 236V190Q200 170 208 190V236Z', '#9A947E');
    s += path('M104 150Q150 56 196 150Z', '#FFFFFF', '#C9C2AC', 2.6) + path('M132 92Q150 64 168 92', '', 'rgba(0,0,0,.08)', 3) + path('M150 70V50', '', '#C9A22A', 3) + circ(150, 48, 4, '#C9A22A');
    [[92, 140], [208, 140]].forEach(function (p) { s += path('M' + (p[0] - 12) + ' ' + p[1] + 'Q' + p[0] + ' ' + (p[1] - 26) + ' ' + (p[0] + 12) + ' ' + p[1] + 'Z', '#FFFFFF', '#C9C2AC', 2); });
    return T(b.x * 100, b.y * 100, shadow(150, 268, 138, 7) + s);
  };
  ART.tuktuk = function (b) {
    var s = '';
    s += path('M30 150Q34 100 70 92H128Q158 96 168 128V150Z', '#2E9A4A', '#14572A', 2.6) + path('M24 96Q100 66 176 96L170 108Q100 82 30 108Z', '#F2C94C', '#B8861B', 2.4) + rect(34, 100, 130, 8, '#14572A') + rect(52, 112, 34, 28, F('glass'), '#14572A', 3) + rect(100, 112, 34, 28, F('glass'), '#14572A', 3);
    s += circ(50, 156, 16, '#2A2A34', '#555') + circ(50, 156, 6, '#CFC8B8') + circ(150, 156, 16, '#2A2A34', '#555') + circ(150, 156, 6, '#CFC8B8') + path('M24 126h14M162 130h10', '', '#F2C94C', 5) + circ(170, 128, 5, '#FFE36B');
    return T(b.x * 100, b.y * 100, shadow(100, 176, 82, 6) + s);
  };
  ART.inflag = flagPole('in');
  ART.diya = function (b) {
    return T(b.x * 100, b.y * 100, shadow(50, 90, 28, 5) + '<path d="M18 62Q22 86 50 86Q78 86 82 62Z" fill="#C9631A" stroke="#7A3A0E" stroke-width="2.4"/><path d="M18 62Q50 54 82 62" fill="#E8841E" stroke="#7A3A0E" stroke-width="2"/><path d="M82 62Q96 56 94 48Q86 52 78 58Z" fill="#C9631A" stroke="#7A3A0E" stroke-width="2"/><path d="M50 56Q38 38 50 14Q62 38 50 56Z" fill="#FF9A2A"/><path d="M50 54Q44 42 50 28Q56 42 50 54Z" fill="#FFE36B"/><circle cx="50" cy="40" r="22" fill="#FFD23F" opacity=".16"/><path d="M30 72q4 4 8 0M46 76q4 4 8 0M62 72q4 4 8 0" stroke="#F2C94C" stroke-width="2" fill="none"/>');
  };
  big('tajmahal', 'tajmahal', 3, 3);
})(typeof window !== 'undefined' ? window : this);
