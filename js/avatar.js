/* Nhân vật (avatar) tự phối — vẽ bằng SVG, không dùng ảnh.
   6 nhân vật gốc (Mimi mèo, Bobo gấu, Lulu thỏ, Hoot cú, Rex khủng long, Bolt robot) + màu tự chọn + trang phục + phụ kiện.
   Dùng chung cho trình duyệt (window.EWTAvatar) và máy chủ (require) để kiểm tra dữ liệu hợp lệ.
   cfg = { ch, c1, c2, ex, cheek, outfit, oc, hat, hc, glasses, neck, nc, phones, pc, held, bg, bgc } */
(function (root) {
  'use strict';

  var CHARS = [
    { id: 'cat', name: 'Mimi', sub: 'Mèo' }, { id: 'bear', name: 'Bobo', sub: 'Gấu' }, { id: 'bunny', name: 'Lulu', sub: 'Thỏ' },
    { id: 'owl', name: 'Hoot', sub: 'Cú' }, { id: 'dino', name: 'Rex', sub: 'Khủng long' }, { id: 'robot', name: 'Bolt', sub: 'Robot' }
  ];
  // price = số xu (🪙 kiếm được ở mục Luyện từ) để mở khoá; 0 = miễn phí
  var OPT = {
    ex: [{ id: 'smile', name: 'Mỉm cười' }, { id: 'grin', name: 'Cười tươi' }, { id: 'wink', name: 'Nháy mắt' }, { id: 'wow', name: 'Ngạc nhiên' }],
    cheek: [{ id: 'none', name: 'Không' }, { id: 'blush', name: 'Má hồng' }, { id: 'freckles', name: 'Tàn nhang' }],
    outfit: [{ id: 'none', name: 'Không mặc' }, { id: 'tee', name: 'Áo thun' }, { id: 'hoodie', name: 'Áo hoodie' }, { id: 'uniform', name: 'Đồng phục' }, { id: 'dress', name: 'Váy' }, { id: 'overalls', name: 'Yếm', price: 40 }, { id: 'vest', name: 'Áo vest', price: 60 }, { id: 'hero', name: 'Siêu nhân', price: 150 }],
    hat: [{ id: 'none', name: 'Không' }, { id: 'cap', name: 'Mũ lưỡi trai' }, { id: 'beanie', name: 'Mũ len' }, { id: 'bow', name: 'Nơ' }, { id: 'flower', name: 'Hoa' }, { id: 'party', name: 'Mũ tiệc', price: 40 }, { id: 'grad', name: 'Mũ tốt nghiệp', price: 80 }, { id: 'wizard', name: 'Mũ phù thuỷ', price: 100 }, { id: 'crown', name: 'Vương miện', price: 120 }],
    glasses: [{ id: 'none', name: 'Không' }, { id: 'round', name: 'Kính tròn' }, { id: 'heart', name: 'Kính tim', price: 40 }, { id: 'sun', name: 'Kính râm', price: 60 }],
    neck: [{ id: 'none', name: 'Không' }, { id: 'scarf', name: 'Khăn' }, { id: 'bowtie', name: 'Nơ cổ' }, { id: 'pearls', name: 'Vòng ngọc', price: 40 }, { id: 'medal', name: 'Huy chương', price: 80 }],
    phones: [{ id: 'none', name: 'Không' }, { id: 'on', name: 'Tai nghe', price: 60 }],
    held: [{ id: 'none', name: 'Không' }, { id: 'book', name: 'Sách' }, { id: 'pencil', name: 'Bút chì' }, { id: 'star', name: 'Ngôi sao', price: 40 }, { id: 'trophy', name: 'Cúp', price: 100 }],
    bg: [{ id: 'solid', name: 'Trơn' }, { id: 'dots', name: 'Chấm bi' }, { id: 'stars', name: 'Ngôi sao' }, { id: 'stripes', name: 'Sọc' }, { id: 'rays', name: 'Tia sáng' }, { id: 'blob', name: 'Đốm màu' }]
  };
  var PALETTE = ['#F4A261', '#E9C46A', '#F28482', '#CDB4DB', '#90CAF9', '#B8E0D2', '#FFF1E0', '#A0522D', '#8D99AE', '#6D597A', '#4A4E69', '#E76F51'];
  var OUTFIT_PALETTE = ['#EF4444', '#F59E0B', '#22C55E', '#06B6D4', '#3B82F6', '#8B5CF6', '#EC4899', '#1F2937', '#FFFFFF', '#14B8A6'];
  var BG_PALETTE = ['#DBEAFE', '#FCE7F3', '#DCFCE7', '#FEF3C7', '#EDE9FE', '#FFE4E6', '#CFFAFE', '#E2E8F0', '#FDE68A', '#C7D2FE'];

  function keyOf(kind, id) { return kind + '_' + id; }
  function find(kind, id) { var a = OPT[kind] || []; for (var i = 0; i < a.length; i++) if (a[i].id === id) return a[i]; return null; }
  var HEX = /^#[0-9a-fA-F]{6}$/;
  function color(v, d) { return typeof v === 'string' && HEX.test(v) ? v.toUpperCase() : d; }
  function pick(kind, v, d) { return find(kind, v) ? v : d; }

  function defaults() {
    return { ch: 'cat', c1: '#F4A261', c2: '#FFF1E0', ex: 'smile', cheek: 'blush', outfit: 'tee', oc: '#3B82F6', hat: 'none', hc: '#EF4444', glasses: 'none', neck: 'none', nc: '#F59E0B', phones: 'none', pc: '#8B5CF6', held: 'none', bg: 'dots', bgc: '#DBEAFE' };
  }
  // Làm sạch dữ liệu bất kỳ → cấu hình hợp lệ (chỉ cho phép id và màu trong danh mục)
  function normalize(c) {
    c = c && typeof c === 'object' ? c : {}; var d = defaults(), o = {};
    o.ch = CHARS.some(function (x) { return x.id === c.ch; }) ? c.ch : d.ch;
    o.c1 = color(c.c1, d.c1); o.c2 = color(c.c2, d.c2); o.oc = color(c.oc, d.oc); o.hc = color(c.hc, d.hc); o.nc = color(c.nc, d.nc); o.pc = color(c.pc, d.pc); o.bgc = color(c.bgc, d.bgc);
    ['ex', 'cheek', 'outfit', 'hat', 'glasses', 'neck', 'phones', 'held', 'bg'].forEach(function (k) { o[k] = pick(k, c[k], d[k]); });
    return o;
  }
  // Các món CÓ GIÁ mà cấu hình đang dùng: [{ key, kind, id, name, price }]
  function paidItems(cfg) {
    cfg = normalize(cfg); var out = [];
    ['outfit', 'hat', 'glasses', 'neck', 'phones', 'held'].forEach(function (k) { var it = find(k, cfg[k]); if (it && it.price) out.push({ key: keyOf(k, it.id), kind: k, id: it.id, name: it.name, price: it.price }); });
    return out;
  }
  function priceOfKey(key) {
    var m = /^([a-z]+)_([a-z]+)$/.exec(String(key)); if (!m) return null; var it = find(m[1], m[2]); return it && it.price ? { key: key, kind: m[1], id: m[2], name: it.name, price: it.price } : null;
  }
  function random() {
    var r = function (a) { return a[Math.floor(Math.random() * a.length)]; }, free = function (kind) { return r(OPT[kind].filter(function (x) { return !x.price; })).id; };
    return normalize({ ch: r(CHARS).id, c1: r(PALETTE), c2: r(['#FFF1E0', '#FFFFFF', '#FDE68A', '#FBCFE8', '#BFDBFE']), ex: free('ex'), cheek: free('cheek'), outfit: free('outfit'), oc: r(OUTFIT_PALETTE), hat: free('hat'), hc: r(OUTFIT_PALETTE), glasses: free('glasses'), neck: free('neck'), nc: r(OUTFIT_PALETTE), phones: 'none', pc: r(OUTFIT_PALETTE), held: free('held'), bg: free('bg'), bgc: r(BG_PALETTE) });
  }

  /* ───────────── màu ───────────── */
  function rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function hex(a) { return '#' + a.map(function (v) { v = Math.max(0, Math.min(255, Math.round(v))); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }
  function shade(h, f) { var a = rgb(h), t = f < 0 ? 0 : 255, k = Math.abs(f); return hex(a.map(function (v) { return v + (t - v) * k; })); }
  function lum(h) { var a = rgb(h); return (0.299 * a[0] + 0.587 * a[1] + 0.114 * a[2]) / 255; }
  var INK = '#2D2A3E';

  var UID = 0;
  /* ───────────── vẽ ───────────── */
  function render(cfgIn, opts) {
    var cfg = normalize(cfgIn); opts = opts || {}; var uid = 'av' + (++UID), size = opts.size || 160;
    var c1 = cfg.c1, c2 = cfg.c2, dk = shade(c1, -0.18), ch = cfg.ch, s = [];
    var shape = opts.shape || 'circle', rad = shape === 'circle' ? 100 : shape === 'round' ? 40 : 0;

    /* nền */
    s.push('<defs><clipPath id="' + uid + 'c"><rect width="200" height="200" rx="' + rad + '"/></clipPath></defs><g clip-path="url(#' + uid + 'c)">');
    s.push('<rect width="200" height="200" fill="' + cfg.bgc + '"/>');
    var pc = shade(cfg.bgc, lum(cfg.bgc) > 0.6 ? -0.1 : 0.18), i;
    if (cfg.bg === 'dots') for (i = 0; i < 24; i++) s.push('<circle cx="' + (18 + (i % 6) * 34 + (Math.floor(i / 6) % 2) * 17) + '" cy="' + (16 + Math.floor(i / 6) * 40) + '" r="5" fill="' + pc + '"/>');
    else if (cfg.bg === 'stars') for (i = 0; i < 9; i++) s.push('<path transform="translate(' + (24 + (i % 3) * 66 + (i % 2) * 14) + ' ' + (22 + Math.floor(i / 3) * 62) + ') scale(' + (0.7 + (i % 3) * 0.15) + ')" d="M0-11 3-3.5 11-3 5 2.5 7 10 0 5.5-7 10-5 2.5-11-3-3-3.5Z" fill="' + pc + '"/>');
    else if (cfg.bg === 'stripes') for (i = 0; i < 8; i++) s.push('<rect x="' + (i * 28 - 8) + '" y="-20" width="14" height="260" fill="' + pc + '" transform="rotate(18 100 100)"/>');
    else if (cfg.bg === 'rays') for (i = 0; i < 12; i++) s.push('<path d="M100 104 L' + (100 + 220 * Math.cos(i * Math.PI / 6 - 0.13)).toFixed(1) + ' ' + (104 + 220 * Math.sin(i * Math.PI / 6 - 0.13)).toFixed(1) + ' L' + (100 + 220 * Math.cos(i * Math.PI / 6 + 0.13)).toFixed(1) + ' ' + (104 + 220 * Math.sin(i * Math.PI / 6 + 0.13)).toFixed(1) + 'Z" fill="' + pc + '"/>');
    else if (cfg.bg === 'blob') { s.push('<circle cx="34" cy="150" r="46" fill="' + pc + '"/><circle cx="176" cy="40" r="38" fill="' + pc + '"/><circle cx="170" cy="168" r="22" fill="' + pc + '"/>'); }

    s.push('<g transform="translate(8 14) scale(.92)">');
    /* áo choàng (phía sau) */
    if (cfg.outfit === 'hero') s.push('<path d="M54 148 Q30 186 22 204 L178 204 Q170 186 146 148Z" fill="' + shade(cfg.oc, -0.28) + '"/>');
    /* tai / ăng-ten phía sau đầu */
    if (ch === 'cat') s.push('<path d="M54 66 L46 18 L90 46Z" fill="' + c1 + '"/><path d="M146 66 L154 18 L110 46Z" fill="' + c1 + '"/><path d="M58 56 L55 30 L80 46Z" fill="' + c2 + '"/><path d="M142 56 L145 30 L120 46Z" fill="' + c2 + '"/>');
    if (ch === 'bear') s.push('<circle cx="56" cy="50" r="19" fill="' + c1 + '"/><circle cx="144" cy="50" r="19" fill="' + c1 + '"/><circle cx="56" cy="50" r="10" fill="' + c2 + '"/><circle cx="144" cy="50" r="10" fill="' + c2 + '"/>');
    if (ch === 'bunny') s.push('<g transform="rotate(-9 72 40)"><ellipse cx="72" cy="22" rx="15" ry="38" fill="' + c1 + '"/><ellipse cx="72" cy="26" rx="7.5" ry="27" fill="' + c2 + '"/></g><g transform="rotate(9 128 40)"><ellipse cx="128" cy="22" rx="15" ry="38" fill="' + c1 + '"/><ellipse cx="128" cy="26" rx="7.5" ry="27" fill="' + c2 + '"/></g>');
    if (ch === 'owl') s.push('<path d="M52 58 L44 22 L88 44Z" fill="' + dk + '"/><path d="M148 58 L156 22 L112 44Z" fill="' + dk + '"/>');
    if (ch === 'dino') s.push('<path d="M64 48 L74 20 L88 40Z" fill="' + c2 + '"/><path d="M86 42 L100 14 L114 42Z" fill="' + c2 + '"/><path d="M112 40 L126 20 L136 48Z" fill="' + c2 + '"/>');
    if (ch === 'robot') s.push('<rect x="97" y="14" width="6" height="30" rx="3" fill="' + dk + '"/><circle cx="100" cy="13" r="8" fill="' + c2 + '" stroke="' + dk + '" stroke-width="3"/><rect x="34" y="82" width="16" height="30" rx="8" fill="' + dk + '"/><rect x="150" y="82" width="16" height="30" rx="8" fill="' + dk + '"/>');

    /* thân + tay */
    var armL = 'M58 152 C40 164 36 190 40 204 L62 204 C62 182 66 168 74 158Z', armR = 'M142 152 C160 164 164 190 160 204 L138 204 C138 182 134 168 126 158Z';
    s.push('<path d="' + armL + '" fill="' + dk + '"/><path d="' + armR + '" fill="' + dk + '"/>');
    s.push('<path d="M48 204 C48 160 70 140 100 140 C130 140 152 160 152 204Z" fill="' + c1 + '"/>');
    if (ch === 'robot') s.push('<rect x="76" y="160" width="48" height="30" rx="8" fill="' + c2 + '" opacity=".9"/><circle cx="90" cy="175" r="4" fill="#7CF7D4"/><circle cx="110" cy="175" r="4" fill="#FDE68A"/>');
    else if (ch === 'owl') s.push('<ellipse cx="100" cy="176" rx="30" ry="30" fill="' + c2 + '"/><path d="M82 162 q6 8 12 0 M94 162 q6 8 12 0 M106 162 q6 8 12 0 M88 176 q6 8 12 0 M100 176 q6 8 12 0 M94 190 q6 8 12 0" stroke="' + shade(c2, -0.18) + '" stroke-width="2.5" fill="none" stroke-linecap="round"/>');
    else s.push('<ellipse cx="100" cy="178" rx="27" ry="28" fill="' + c2 + '"/>');
    if (ch === 'dino') s.push('<path d="M62 168 l-6 8 l8 2Z M140 168 l6 8 l-8 2Z" fill="' + c2 + '"/>');

    /* trang phục */
    var oc = cfg.oc, od = shade(oc, -0.2), sleeveL = 'M58 152 C42 162 38 178 40 192 L64 196 C62 178 66 164 74 158Z', sleeveR = 'M142 152 C158 162 162 178 160 192 L136 196 C138 178 134 164 126 158Z';
    var longL = armL, longR = armR, torso = 'M48 204 C48 160 70 140 100 140 C130 140 152 160 152 204Z';
    var O = cfg.outfit;
    if (O === 'tee') s.push('<path d="' + torso + '" fill="' + oc + '"/><path d="' + sleeveL + '" fill="' + oc + '"/><path d="' + sleeveR + '" fill="' + oc + '"/><path d="M82 142 Q100 158 118 142" fill="none" stroke="' + od + '" stroke-width="3.5" stroke-linecap="round"/><path d="M58 152 C42 162 38 178 40 192" fill="none" stroke="' + od + '" stroke-width="2" opacity=".5"/>');
    if (O === 'hoodie') s.push('<path d="' + torso + '" fill="' + oc + '"/><path d="' + longL + '" fill="' + oc + '"/><path d="' + longR + '" fill="' + oc + '"/><path d="M70 146 Q100 172 130 146 Q126 162 100 166 Q74 162 70 146Z" fill="' + od + '"/><path d="M72 184 L128 184 L136 204 L64 204Z" fill="' + shade(oc, -0.12) + '"/><path d="M92 164 L90 180 M108 164 L110 180" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/><path d="M64 198 h8 M128 198 h8" stroke="' + od + '" stroke-width="5" stroke-linecap="round"/>');
    if (O === 'uniform') s.push('<path d="' + torso + '" fill="#FFFFFF"/><path d="' + sleeveL + '" fill="#FFFFFF"/><path d="' + sleeveR + '" fill="#FFFFFF"/><path d="M82 142 L100 164 L84 156Z M118 142 L100 164 L116 156Z" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2" stroke-linejoin="round"/><path d="M94 156 L106 156 L104 164 L96 164Z" fill="' + od + '"/><path d="M96 164 L104 164 L110 196 L100 204 L90 196Z" fill="' + oc + '"/><path d="M58 152 C42 162 38 178 40 192" fill="none" stroke="#CBD5E1" stroke-width="2"/>');
    if (O === 'dress') s.push('<path d="M54 204 C56 172 76 148 100 148 C124 148 144 172 146 204Z" fill="' + oc + '"/><circle cx="62" cy="158" r="12" fill="' + oc + '"/><circle cx="138" cy="158" r="12" fill="' + oc + '"/><path d="M66 178 Q100 190 134 178 L136 188 Q100 200 64 188Z" fill="' + od + '"/><path d="M82 148 Q100 164 118 148" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-dasharray="1 7"/>');
    if (O === 'overalls') s.push('<path d="' + torso + '" fill="#F8FAFC"/><path d="' + sleeveL + '" fill="#F8FAFC"/><path d="' + sleeveR + '" fill="#F8FAFC"/><path d="M68 166 L132 166 L140 204 L60 204Z" fill="' + oc + '"/><path d="M70 166 L78 142 L90 142 L86 166Z M130 166 L122 142 L110 142 L114 166Z" fill="' + oc + '"/><circle cx="84" cy="164" r="3.5" fill="#FBBF24"/><circle cx="116" cy="164" r="3.5" fill="#FBBF24"/><rect x="86" y="176" width="28" height="18" rx="4" fill="' + od + '"/>');
    if (O === 'vest') s.push('<path d="' + torso + '" fill="#F8FAFC"/><path d="' + sleeveL + '" fill="#F8FAFC"/><path d="' + sleeveR + '" fill="#F8FAFC"/><path d="M60 204 L64 156 L86 144 L100 172 L114 144 L136 156 L140 204Z" fill="' + oc + '"/><path d="M86 144 L100 172 L114 144" fill="none" stroke="' + od + '" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="184" r="3" fill="#FBBF24"/><circle cx="100" cy="196" r="3" fill="#FBBF24"/>');
    if (O === 'hero') s.push('<path d="' + torso + '" fill="' + oc + '"/><path d="' + longL + '" fill="' + oc + '"/><path d="' + longR + '" fill="' + oc + '"/><path d="M82 142 Q100 156 118 142" fill="none" stroke="' + od + '" stroke-width="3.5" stroke-linecap="round"/><path transform="translate(100 176) scale(1.15)" d="M0-14 4-4.5 14-4 6.5 3 9 13 0 7.5-9 13-6.5 3-14-4-4-4.5Z" fill="#FDE047" stroke="' + od + '" stroke-width="1.5" stroke-linejoin="round"/><rect x="40" y="186" width="22" height="7" rx="3" fill="#FDE047"/><rect x="138" y="186" width="22" height="7" rx="3" fill="#FDE047"/>');

    /* đồ vật quanh cổ */
    var nc = cfg.nc, nd = shade(nc, -0.18), N = cfg.neck;
    if (N === 'scarf') s.push('<path d="M66 144 Q100 168 134 144 L138 156 Q100 182 62 156Z" fill="' + nc + '"/><path d="M112 164 L128 160 L134 198 L116 196Z" fill="' + nd + '"/><path d="M70 150 Q100 172 130 150" fill="none" stroke="' + nd + '" stroke-width="2" stroke-dasharray="3 6"/>');
    if (N === 'bowtie') s.push('<path d="M100 156 L78 144 L78 168Z M100 156 L122 144 L122 168Z" fill="' + nc + '" stroke="' + nd + '" stroke-width="2" stroke-linejoin="round"/><rect x="94" y="150" width="12" height="12" rx="4" fill="' + nd + '"/>');
    if (N === 'pearls') for (i = 0; i < 9; i++) { var t = i / 8, px = 70 + 60 * t, py = 144 + 22 * Math.sin(Math.PI * t); s.push('<circle cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="4.2" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5"/>'); }
    if (N === 'medal') s.push('<path d="M86 144 L100 170 L114 144 L106 144 L100 156 L94 144Z" fill="' + nc + '"/><circle cx="100" cy="178" r="12" fill="#FBBF24" stroke="#D97706" stroke-width="2.5"/><path transform="translate(100 178) scale(.55)" d="M0-11 3-3.5 11-3 5 2.5 7 10 0 5.5-7 10-5 2.5-11-3-3-3.5Z" fill="#FFF7D6"/>');

    /* đầu */
    if (ch === 'robot') s.push('<rect x="46" y="40" width="108" height="104" rx="30" fill="' + c1 + '"/><rect x="56" y="64" width="88" height="62" rx="22" fill="#1F2937"/>');
    else if (ch === 'owl') s.push('<ellipse cx="100" cy="92" rx="57" ry="53" fill="' + c1 + '"/>');
    else if (ch === 'dino') s.push('<ellipse cx="100" cy="92" rx="56" ry="53" fill="' + c1 + '"/>');
    else s.push('<circle cx="100" cy="92" r="54" fill="' + c1 + '"/>');

    /* mặt */
    var ex = cfg.ex, eyeL = [78, 92], eyeR = [122, 92], er = ex === 'wow' ? 10 : 8.5;
    if (ch === 'robot') {
      var led = '#7CF7D4';
      if (ex === 'wink') s.push('<path d="M66 94 Q76 86 88 94" stroke="' + led + '" stroke-width="5" fill="none" stroke-linecap="round"/>'); else s.push('<rect x="' + (ex === 'wow' ? 66 : 68) + '" y="' + (ex === 'wow' ? 78 : 82) + '" width="' + (ex === 'wow' ? 20 : 16) + '" height="' + (ex === 'wow' ? 22 : 18) + '" rx="6" fill="' + led + '"/>');
      s.push('<rect x="' + (ex === 'wow' ? 114 : 116) + '" y="' + (ex === 'wow' ? 78 : 82) + '" width="' + (ex === 'wow' ? 20 : 16) + '" height="' + (ex === 'wow' ? 22 : 18) + '" rx="6" fill="' + led + '"/>');
      if (ex === 'grin') s.push('<rect x="80" y="108" width="40" height="12" rx="6" fill="' + led + '"/><path d="M90 108 v12 M100 108 v12 M110 108 v12" stroke="#1F2937" stroke-width="2.5"/>');
      else if (ex === 'wow') s.push('<rect x="92" y="108" width="16" height="14" rx="7" fill="' + led + '"/>');
      else s.push('<path d="M84 112 Q100 124 116 112" stroke="' + led + '" stroke-width="5" fill="none" stroke-linecap="round"/>');
    } else {
      if (ch === 'owl') s.push('<circle cx="78" cy="92" r="21" fill="#FFFFFF" stroke="' + dk + '" stroke-width="3"/><circle cx="122" cy="92" r="21" fill="#FFFFFF" stroke="' + dk + '" stroke-width="3"/>');
      if (ch === 'bear') s.push('<ellipse cx="100" cy="112" rx="21" ry="16" fill="' + c2 + '"/>');
      if (ch === 'dino') s.push('<ellipse cx="100" cy="114" rx="25" ry="18" fill="' + c2 + '"/>');
      // mắt
      function eye(p, wink) {
        if (wink) return '<path d="M' + (p[0] - 9) + ' ' + (p[1] + 2) + ' Q' + p[0] + ' ' + (p[1] - 8) + ' ' + (p[0] + 9) + ' ' + (p[1] + 2) + '" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
        return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="' + er + '" fill="' + INK + '"/><circle cx="' + (p[0] - 2.8) + '" cy="' + (p[1] - 3) + '" r="2.8" fill="#fff"/>';
      }
      s.push(eye(eyeL, ex === 'wink') + eye(eyeR, false));
      if (ch === 'owl') s.push('<path d="M92 103 L108 103 L100 119Z" fill="#F4B942" stroke="#D99A1F" stroke-width="2" stroke-linejoin="round"/>');
      else {
        if (ch === 'cat') s.push('<path d="M95 103 L105 103 L100 110Z" fill="#F28482"/><path d="M62 106 L34 100 M62 112 L34 114 M138 106 L166 100 M138 112 L166 114" stroke="' + INK + '" stroke-width="1.8" stroke-linecap="round" opacity=".55"/>');
        if (ch === 'bear') s.push('<ellipse cx="100" cy="104" rx="6.5" ry="4.8" fill="' + INK + '"/>');
        if (ch === 'bunny') s.push('<path d="M95 103 L105 103 L100 110Z" fill="#F28482"/>');
        if (ch === 'dino') s.push('<circle cx="92" cy="104" r="2.6" fill="' + shade(c1, -0.4) + '"/><circle cx="108" cy="104" r="2.6" fill="' + shade(c1, -0.4) + '"/>');
        var my = ch === 'bear' ? 116 : 113;
        if (ex === 'grin') s.push('<path d="M86 ' + (my - 2) + ' Q100 ' + (my + 22) + ' 114 ' + (my - 2) + 'Z" fill="' + INK + '"/><path d="M94 ' + (my + 9) + ' Q100 ' + (my + 15) + ' 106 ' + (my + 9) + ' Q100 ' + (my + 6) + ' 94 ' + (my + 9) + 'Z" fill="#F28482"/>');
        else if (ex === 'wow') s.push('<ellipse cx="100" cy="' + (my + 5) + '" rx="6.5" ry="8.5" fill="' + INK + '"/>');
        else s.push('<path d="M88 ' + my + ' Q100 ' + (my + 11) + ' 112 ' + my + '" stroke="' + INK + '" stroke-width="3.2" fill="none" stroke-linecap="round"/>');
        if (ch === 'bunny' && ex !== 'wow') s.push('<path d="M95 ' + (my + 5) + ' L95 ' + (my + 13) + ' L105 ' + (my + 13) + ' L105 ' + (my + 5) + 'Z" fill="#fff" stroke="' + INK + '" stroke-width="1.5" stroke-linejoin="round"/>');
      }
    }
    if (ch !== 'robot' && cfg.cheek === 'blush') s.push('<circle cx="62" cy="108" r="9" fill="#FF8FA3" opacity=".55"/><circle cx="138" cy="108" r="9" fill="#FF8FA3" opacity=".55"/>');
    if (ch !== 'robot' && cfg.cheek === 'freckles') s.push('<g fill="' + shade(c1, -0.35) + '" opacity=".55"><circle cx="60" cy="106" r="2"/><circle cx="68" cy="110" r="2"/><circle cx="66" cy="102" r="2"/><circle cx="140" cy="106" r="2"/><circle cx="132" cy="110" r="2"/><circle cx="134" cy="102" r="2"/></g>');

    /* kính */
    var G = cfg.glasses;
    if (G === 'round') s.push('<circle cx="78" cy="92" r="15" fill="#fff" fill-opacity=".28" stroke="' + INK + '" stroke-width="3.5"/><circle cx="122" cy="92" r="15" fill="#fff" fill-opacity=".28" stroke="' + INK + '" stroke-width="3.5"/><path d="M93 92 H107 M63 90 L50 86 M137 90 L150 86" stroke="' + INK + '" stroke-width="3.5" stroke-linecap="round"/>');
    if (G === 'sun') s.push('<path d="M60 82 H96 Q96 108 78 108 Q60 108 60 82Z M104 82 H140 Q140 108 122 108 Q104 108 104 82Z" fill="#1F2937"/><path d="M96 86 H104 M60 84 L48 82 M140 84 L152 82" stroke="#1F2937" stroke-width="4" stroke-linecap="round"/><path d="M66 88 L74 88 M110 88 L118 88" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".5"/>');
    if (G === 'heart') s.push('<path d="M78 106 C62 95 60 80 71 78 C75 77.5 78 80 78 83 C78 80 81 77.5 85 78 C96 80 94 95 78 106Z M122 106 C106 95 104 80 115 78 C119 77.5 122 80 122 83 C122 80 125 77.5 129 78 C140 80 138 95 122 106Z" fill="#FDA4AF" fill-opacity=".55" stroke="#E11D48" stroke-width="3" stroke-linejoin="round"/><path d="M94 88 Q100 84 106 88" stroke="#E11D48" stroke-width="3" fill="none"/>');

    /* tai nghe */
    var pcol = cfg.pc;
    if (cfg.phones === 'on') s.push('<path d="M45 96 C42 36 158 36 155 96" fill="none" stroke="' + pcol + '" stroke-width="9" stroke-linecap="round"/><rect x="34" y="84" width="19" height="34" rx="9" fill="' + pcol + '"/><rect x="147" y="84" width="19" height="34" rx="9" fill="' + pcol + '"/><rect x="38" y="90" width="9" height="22" rx="4.5" fill="' + shade(pcol, -0.25) + '"/><rect x="153" y="90" width="9" height="22" rx="4.5" fill="' + shade(pcol, -0.25) + '"/>');

    /* mũ / phụ kiện đầu */
    var hc = cfg.hc, hd = shade(hc, -0.2), hl = shade(hc, 0.35), H = cfg.hat;
    if (H === 'cap') s.push('<path d="M50 70 Q48 28 100 28 Q152 28 150 70Z" fill="' + hc + '"/><path d="M96 66 Q150 60 172 74 Q134 82 96 76Z" fill="' + hd + '"/><circle cx="100" cy="28" r="5" fill="' + hd + '"/><path d="M52 66 H148" stroke="' + hd + '" stroke-width="3"/>');
    if (H === 'beanie') s.push('<path d="M48 72 Q46 24 100 24 Q154 24 152 72Z" fill="' + hc + '"/><path d="M46 62 L154 62 L154 80 Q100 88 46 80Z" fill="' + hd + '"/><path d="M62 64 v18 M78 64 v20 M94 64 v22 M110 64 v22 M126 64 v20 M142 64 v18" stroke="' + shade(hc, -0.32) + '" stroke-width="2" opacity=".6"/><circle cx="100" cy="20" r="11" fill="' + hl + '"/>');
    if (H === 'bow') s.push('<path d="M64 46 L38 30 L38 62Z M64 46 L90 30 L90 62Z" fill="' + hc + '" stroke="' + hd + '" stroke-width="2.5" stroke-linejoin="round"/><circle cx="64" cy="46" r="8" fill="' + hd + '"/>');
    if (H === 'flower') { var fx = 138, fy = 50; for (i = 0; i < 5; i++) s.push('<circle cx="' + (fx + 11 * Math.cos(i * 1.2566 - 1.57)).toFixed(1) + '" cy="' + (fy + 11 * Math.sin(i * 1.2566 - 1.57)).toFixed(1) + '" r="9" fill="' + hc + '" stroke="' + hd + '" stroke-width="1.5"/>'); s.push('<circle cx="' + fx + '" cy="' + fy + '" r="7" fill="#FDE047" stroke="#EAB308" stroke-width="1.5"/>'); }
    if (H === 'party') s.push('<g transform="rotate(-10 100 64)"><path d="M100 0 L134 60 Q100 70 66 60Z" fill="' + hc + '"/><path d="M92 16 L120 62 M104 8 L80 58" stroke="' + hl + '" stroke-width="7" opacity=".7"/><circle cx="100" cy="2" r="8" fill="#FDE047"/></g>');
    if (H === 'grad') s.push('<path d="M72 54 L72 74 Q100 86 128 74 L128 54Z" fill="' + hd + '"/><path d="M38 46 L100 24 L162 46 L100 68Z" fill="' + hc + '" stroke="' + hd + '" stroke-width="2.5" stroke-linejoin="round"/><path d="M100 46 L150 52 L150 76" stroke="#FBBF24" stroke-width="3" fill="none" stroke-linecap="round"/><circle cx="150" cy="80" r="5" fill="#FBBF24"/>');
    if (H === 'wizard') s.push('<path d="M100 -14 L142 60 Q100 72 58 60Z" fill="' + hc + '"/><path d="M42 62 Q100 78 158 62 Q100 50 42 62Z" fill="' + hd + '"/><path transform="translate(96 30) scale(.7)" d="M0-11 3-3.5 11-3 5 2.5 7 10 0 5.5-7 10-5 2.5-11-3-3-3.5Z" fill="#FDE047"/><circle cx="112" cy="46" r="3" fill="#FDE047"/><circle cx="86" cy="50" r="2.5" fill="#fff"/>');
    if (H === 'crown') s.push('<path d="M54 60 L58 20 L80 40 L100 12 L120 40 L142 20 L146 60Z" fill="' + hc + '" stroke="' + hd + '" stroke-width="3" stroke-linejoin="round"/><rect x="54" y="56" width="92" height="12" rx="4" fill="' + hd + '"/><circle cx="58" cy="20" r="5" fill="#fff"/><circle cx="100" cy="12" r="5.5" fill="#F43F5E"/><circle cx="142" cy="20" r="5" fill="#fff"/><circle cx="100" cy="62" r="3.5" fill="#fff"/><circle cx="76" cy="62" r="3" fill="#60A5FA"/><circle cx="124" cy="62" r="3" fill="#60A5FA"/>');

    /* vật cầm tay */
    var Hd = cfg.held, hs = [], hand = '<circle cx="146" cy="178" r="11" fill="' + c1 + '" stroke="' + dk + '" stroke-width="2"/>';
    if (Hd === 'book') hs.push('<path d="M126 150 L172 150 L172 190 L126 190Z" fill="#3B82F6" stroke="#1E40AF" stroke-width="2.5" stroke-linejoin="round"/><path d="M126 150 L134 150 L134 190 L126 190Z" fill="#1E40AF"/><path d="M142 162 H164 M142 170 H164 M142 178 H156" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"/>' + hand);
    if (Hd === 'pencil') hs.push('<g transform="rotate(32 150 168)"><rect x="143" y="132" width="14" height="52" rx="2" fill="#FBBF24" stroke="#D97706" stroke-width="2"/><path d="M143 184 L157 184 L150 198Z" fill="#FDE7C0" stroke="#D97706" stroke-width="2" stroke-linejoin="round"/><path d="M148 194 L152 194 L150 198Z" fill="' + INK + '"/><rect x="143" y="126" width="14" height="10" rx="2" fill="#F87171" stroke="#DC2626" stroke-width="2"/></g>' + hand);
    if (Hd === 'star') hs.push('<path transform="translate(150 158) scale(2)" d="M0-14 4-4.5 14-4 6.5 3 9 13 0 7.5-9 13-6.5 3-14-4-4-4.5Z" fill="#FDE047" stroke="#EAB308" stroke-width="2" stroke-linejoin="round"/>' + hand);
    if (Hd === 'trophy') hs.push('<path d="M134 140 H166 V160 Q166 176 150 178 Q134 176 134 160Z" fill="#FBBF24" stroke="#D97706" stroke-width="2.5" stroke-linejoin="round"/><path d="M134 146 H124 Q124 162 136 164 M166 146 H176 Q176 162 164 164" fill="none" stroke="#D97706" stroke-width="3"/><rect x="146" y="178" width="8" height="8" fill="#D97706"/><rect x="138" y="186" width="24" height="7" rx="2" fill="#92400E"/>' + hand);

    if (hs.length) s.push('<g transform="translate(-26 -14) scale(1.08)">' + hs.join('') + '</g>');
    s.push('</g></g>');
    var label = opts.label || 'Nhân vật ' + (CHARS.filter(function (x) { return x.id === ch; })[0] || {}).name;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="' + size + '" height="' + size + '" role="img" aria-label="' + label + '">' + s.join('') + '</svg>';
  }

  var API = { CHARS: CHARS, OPT: OPT, PALETTE: PALETTE, OUTFIT_PALETTE: OUTFIT_PALETTE, BG_PALETTE: BG_PALETTE, defaults: defaults, normalize: normalize, random: random, render: render, paidItems: paidItems, priceOfKey: priceOfKey, keyOf: keyOf, shade: shade };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTAvatar = API;
})(typeof window !== 'undefined' ? window : this);
