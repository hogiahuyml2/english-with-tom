/* Bạn nhỏ hoạt hình — nhân vật gốc của English With Tom, vẽ hoàn toàn bằng SVG (không dùng ảnh ngoài).
   Dùng cho: avatar kiểu "Bạn nhỏ hoạt hình" (EWTKid.avatar) và bộ sticker "Bạn học bài" (EWTKid.pose).
   Chạy được cả trình duyệt (window.EWTKid) lẫn máy chủ (require). */
(function (root) {
  'use strict';
  var INK = '#4A3434';
  var SKIN = ['#FFE0C7', '#F6C9A0', '#E3A877', '#C98A5B', '#9A6240', '#6B4229'];
  var HAIRC = ['#2B1B12', '#6B3E1E', '#B86F2E', '#F0B73A', '#E2602E', '#C94F7C', '#6C5CE7', '#8D99AE'];
  var HAIR = [{ id: 'short', name: 'Tóc ngắn' }, { id: 'spiky', name: 'Tóc dựng' }, { id: 'bob', name: 'Tóc bob' }, { id: 'long', name: 'Tóc dài' }, { id: 'curly', name: 'Tóc xoăn' }, { id: 'pigtails', name: 'Hai bím' }, { id: 'bun', name: 'Búi tóc' }, { id: 'pony', name: 'Đuôi ngựa' }];
  var EYES = [{ id: 'open', name: 'Mắt tròn' }, { id: 'big', name: 'Mắt to' }, { id: 'happy', name: 'Mắt cười' }];
  var MOUTH = [{ id: 'smile', name: 'Mỉm cười' }, { id: 'grin', name: 'Cười tươi' }, { id: 'o', name: 'Ngạc nhiên' }];
  var HAT = [{ id: 'none', name: 'Không' }, { id: 'witch', name: 'Mũ phù thuỷ' }, { id: 'cap', name: 'Mũ lưỡi trai' }, { id: 'crown', name: 'Vương miện' }, { id: 'beanie', name: 'Mũ len' }, { id: 'bow', name: 'Nơ' }, { id: 'grad', name: 'Mũ tốt nghiệp' }, { id: 'santa', name: 'Mũ ông già Noel' }, { id: 'catears', name: 'Tai mèo' }];
  var OUTFIT = [{ id: 'tee', name: 'Áo thun' }, { id: 'shirt', name: 'Sơ mi + cà vạt' }, { id: 'hoodie', name: 'Áo hoodie' }, { id: 'stripe', name: 'Áo sọc' }];
  var BG = [{ id: 'solid', name: 'Trơn' }, { id: 'leaf', name: 'Lá cây' }, { id: 'dots', name: 'Chấm bi' }];

  function rgb(h) { return [parseInt(h.substr(1, 2), 16), parseInt(h.substr(3, 2), 16), parseInt(h.substr(5, 2), 16)]; }
  function shade(h, f) { var a = rgb(h), t = f < 0 ? 0 : 255, k = Math.abs(f); return '#' + a.map(function (v) { v = Math.round(v + (t - v) * k); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }

  /* ───── tóc: [lớp sau đầu, lớp trước] ───── */
  function hair(id, c) {
    var d = shade(c, -0.2), l = shade(c, 0.28), sw = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"';
    var P = function (dd, fill, extra) { return '<path d="' + dd + '" fill="' + (fill || c) + '"' + sw + (extra || '') + '/>'; };
    var fringe = 'M45 92 C40 40 82 24 100 24 C120 24 162 40 155 92 C150 70 138 58 118 56 C110 66 90 68 78 60 C62 62 50 74 45 92Z';
    var hl = '<path d="M70 38 Q84 30 98 32" stroke="' + l + '" stroke-width="5" stroke-linecap="round" fill="none" opacity=".7"/>';
    switch (id) {
      case 'spiky': return ['', P('M44 90 L46 54 L62 64 L66 30 L84 50 L100 20 L116 50 L136 30 L138 64 L154 54 L156 90 C150 72 132 62 100 62 C68 62 50 72 44 90Z') + hl];
      case 'bob': return [P('M40 96 C36 40 78 22 100 22 C122 22 164 40 160 96 L162 142 Q162 156 148 156 L52 156 Q38 156 38 142Z', d), P(fringe) + hl];
      case 'long': return [P('M38 96 C34 38 78 20 100 20 C122 20 166 38 162 96 L168 176 Q168 190 150 190 L50 190 Q32 190 32 176Z', d), P('M45 92 C40 40 82 24 100 24 C120 24 162 40 155 92 C152 72 142 58 126 56 C116 68 98 70 84 58 C64 62 50 74 45 92Z') + hl];
      case 'curly': return [[[52, 56], [74, 40], [100, 34], [126, 40], [148, 56], [44, 86], [156, 86], [48, 112], [152, 112]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="21" fill="' + d + '"' + sw + '/>'; }).join(''), [[62, 54], [84, 44], [108, 44], [132, 52], [146, 66]].map(function (p) { return '<circle cx="' + p[0] + '" cy="' + p[1] + '" r="17" fill="' + c + '"' + sw + '/>'; }).join('')];
      case 'pigtails': return ['<ellipse cx="36" cy="118" rx="15" ry="30" transform="rotate(14 36 118)" fill="' + d + '"' + sw + '/><ellipse cx="164" cy="118" rx="15" ry="30" transform="rotate(-14 164 118)" fill="' + d + '"' + sw + '/>', P(fringe) + hl + '<circle cx="44" cy="86" r="8" fill="#F472B6"' + sw + '/><circle cx="156" cy="86" r="8" fill="#F472B6"' + sw + '/>'];
      case 'bun': return ['<circle cx="100" cy="20" r="19" fill="' + d + '"' + sw + '/>', P(fringe) + hl];
      case 'pony': return [P('M148 60 C186 60 196 112 170 150 C176 118 166 96 148 88Z', d), P(fringe) + hl];
      default: return ['', P(fringe) + hl]; // short
    }
  }
  function hat(id, oc) {
    var sw = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"';
    switch (id) {
      case 'witch': return '<ellipse cx="100" cy="52" rx="66" ry="13" fill="#4C2A7A"' + sw + '/><path d="M64 50 C78 36 92 20 118 4 C112 22 120 38 138 50Z" fill="#6B3FA0"' + sw + '/><rect x="70" y="40" width="64" height="11" rx="3" fill="#F59E0B"' + sw + '/>';
      case 'cap': return '<path d="M48 70 C48 30 152 30 152 70Z" fill="#EF4444"' + sw + '/><path d="M110 64 Q170 60 176 72 Q150 76 110 72Z" fill="#B91C1C"' + sw + '/><circle cx="100" cy="36" r="5" fill="#B91C1C"/>';
      case 'crown': return '<path d="M58 54 L54 14 L78 32 L100 8 L122 32 L146 14 L142 54Z" fill="#FBBF24"' + sw + '/><circle cx="100" cy="30" r="5.5" fill="#EF4444"/><circle cx="72" cy="40" r="4" fill="#38BDF8"/><circle cx="128" cy="40" r="4" fill="#38BDF8"/>';
      case 'beanie': return '<path d="M46 68 C46 24 154 24 154 68Z" fill="' + oc + '"' + sw + '/><rect x="44" y="60" width="112" height="16" rx="8" fill="' + shade(oc, -0.2) + '"' + sw + '/><circle cx="100" cy="22" r="10" fill="#fff"' + sw + '/>';
      case 'bow': return '<path d="M128 40 L158 24 L158 58Z M128 40 L106 22 L106 58Z" fill="#F472B6"' + sw + '/><circle cx="128" cy="40" r="8" fill="#EC4899"' + sw + '/>';
      case 'grad': return '<path d="M100 18 L168 40 L100 62 L32 40Z" fill="#1F2937"' + sw + '/><path d="M64 54 V74 Q100 90 136 74 V54 L100 66Z" fill="#374151"' + sw + '/><path d="M160 43 V76" stroke="#F59E0B" stroke-width="3.5"/><circle cx="160" cy="80" r="5" fill="#F59E0B"/>';
      case 'santa': return '<path d="M52 60 C54 28 92 12 128 20 C150 24 160 40 170 58 L150 62Z" fill="#E5333B"' + sw + '/><rect x="44" y="54" width="112" height="20" rx="10" fill="#fff"' + sw + '/><circle cx="172" cy="60" r="11" fill="#fff"' + sw + '/>';
      case 'catears': return '<path d="M58 62 L62 16 L96 44Z" fill="#2B2B3A"' + sw + '/><path d="M142 62 L138 16 L104 44Z" fill="#2B2B3A"' + sw + '/><path d="M66 50 L67 28 L84 44Z M134 50 L133 28 L116 44Z" fill="#F9A8D4"/><path d="M52 66 Q100 36 148 66" fill="none" stroke="#2B2B3A" stroke-width="6" stroke-linecap="round"/>';
      default: return '';
    }
  }
  function brows(kind, hc) {
    var s = ' stroke="' + shade(hc, -0.1) + '" stroke-width="4.5" stroke-linecap="round" fill="none"';
    if (kind === 'up') return '<path d="M68 76 Q78 68 90 74"' + s + '/><path d="M112 70 Q124 64 132 72"' + s + '/>';
    if (kind === 'sad') return '<path d="M68 80 Q78 74 90 70"' + s + '/><path d="M110 70 Q122 74 132 80"' + s + '/>';
    if (kind === 'angry') return '<path d="M66 70 Q80 76 92 82"' + s + '/><path d="M108 82 Q120 76 134 70"' + s + '/>';
    if (kind === 'think') return '<path d="M68 78 Q78 74 90 77"' + s + '/><path d="M110 68 Q122 62 132 68"' + s + '/>';
    return '';
  }
  function eyes(kind, look) {
    var ox = look === 'up' ? 3 : 0, oy = look === 'up' ? -4 : 0, e = '';
    if (kind === 'happy') return '<path d="M66 100 Q78 88 90 100" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M110 100 Q122 88 134 100" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>';
    if (kind === 'closed') return '<path d="M67 98 Q78 106 90 98" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round" fill="none"/><path d="M110 98 Q122 106 134 98" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round" fill="none"/>';
    if (kind === 'half') return '<path d="M66 98 H90 M110 98 H134" stroke="' + INK + '" stroke-width="4.5" stroke-linecap="round"/><path d="M68 98 Q78 106 88 98 M112 98 Q122 106 132 98" fill="#2B1B12" opacity=".9"/>';
    if (kind === 'big') { [78, 122].forEach(function (x) { e += '<ellipse cx="' + x + '" cy="96" rx="12.5" ry="14" fill="#fff" stroke="' + INK + '" stroke-width="3"/><ellipse cx="' + (x + ox) + '" cy="' + (98 + oy) + '" rx="8" ry="9.5" fill="#3B2A2A"/><circle cx="' + (x + ox - 3) + '" cy="' + (94 + oy) + '" r="3.2" fill="#fff"/>'; }); return e; }
    [78, 122].forEach(function (x) { e += '<ellipse cx="' + (x + ox) + '" cy="' + (97 + oy) + '" rx="7.5" ry="9" fill="#3B2A2A"/><circle cx="' + (x + ox - 2.5) + '" cy="' + (93 + oy) + '" r="2.8" fill="#fff"/>'; }); return e;
  }
  function mouth(kind) {
    var s = ' stroke="' + INK + '" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"';
    if (kind === 'grin') return '<path d="M80 116 Q100 144 120 116Z" fill="#8A2E3B"' + s + '/><path d="M90 130 Q100 124 110 130 Q100 140 90 130Z" fill="#F4727F"/>';
    if (kind === 'o') return '<ellipse cx="100" cy="126" rx="8" ry="10" fill="#8A2E3B"' + s + '/>';
    if (kind === 'flat') return '<path d="M89 125 H111"' + s + ' fill="none"/>';
    if (kind === 'frown') return '<path d="M86 130 Q100 118 114 130"' + s + ' fill="none"/>';
    if (kind === 'small') return '<ellipse cx="100" cy="124" rx="6" ry="5" fill="#8A2E3B"' + s + '/>';
    if (kind === 'tight') return '<path d="M86 128 Q100 122 114 128"' + s + ' fill="none"/>';
    return '<path d="M84 118 Q100 134 116 118"' + s + ' fill="none"/>'; // smile
  }
  function body(o) {
    var oc = o.oc, sk = o.skin, sw = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"', s = '';
    s += '<rect x="86" y="132" width="28" height="22" rx="8" fill="' + shade(sk, -0.08) + '"' + sw + '/>';
    s += '<path d="M40 204 C40 164 64 148 100 148 C136 148 160 164 160 204Z" fill="' + oc + '"' + sw + '/>';
    if (o.outfit === 'stripe') s += '<g clip-path="url(#' + o.uid + 'b)">' + [160, 172, 184, 196].map(function (y) { return '<rect x="30" y="' + y + '" width="140" height="6" fill="' + shade(oc, -0.2) + '"/>'; }).join('') + '</g><defs><clipPath id="' + o.uid + 'b"><path d="M40 204 C40 164 64 148 100 148 C136 148 160 164 160 204Z"/></clipPath></defs>';
    if (o.outfit === 'hoodie') s += '<path d="M66 156 Q100 182 134 156 Q128 146 100 146 Q72 146 66 156Z" fill="' + shade(oc, -0.15) + '"' + sw + '/><path d="M90 170 V190 M110 170 V190" stroke="#fff" stroke-width="3" stroke-linecap="round"/>';
    else if (o.outfit === 'shirt') s += '<path d="M84 150 L100 172 L116 150 L108 146 L100 154 L92 146Z" fill="#fff"' + sw + '/><path d="M96 168 L100 192 L104 168 L100 162Z" fill="#EF4444"' + sw + '/>';
    else s += '<path d="M82 150 Q100 166 118 150" fill="none" stroke="' + shade(oc, -0.25) + '" stroke-width="3.5" stroke-linecap="round"/>';
    return s;
  }
  // Đầu + mặt + tóc + mũ + áo, trong hệ toạ độ 200×200
  function bust(o) {
    o.uid = o.uid || 'k0';
    var h = hair(o.hair, o.hairc), sk = o.skin, sw = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"', s = '';
    s += h[0];
    s += body(o);
    s += '<circle cx="46" cy="100" r="10.5" fill="' + sk + '"' + sw + '/><circle cx="154" cy="100" r="10.5" fill="' + sk + '"' + sw + '/>';
    s += '<ellipse cx="100" cy="94" rx="56" ry="52" fill="' + sk + '"' + sw + '/>';
    s += h[1];
    if (o.blush !== 0) s += '<ellipse cx="62" cy="116" rx="9" ry="6" fill="#FF7B7B" opacity=".42"/><ellipse cx="138" cy="116" rx="9" ry="6" fill="#FF7B7B" opacity=".42"/>';
    s += brows(o.brow, o.hairc) + eyes(o.eyes, o.look);
    s += '<path d="M97 108 Q100 112 103 108" stroke="' + shade(sk, -0.3) + '" stroke-width="3" stroke-linecap="round" fill="none"/>';
    if (o.glasses) s += '<circle cx="78" cy="97" r="17" fill="#fff" fill-opacity=".22" stroke="' + INK + '" stroke-width="3.5"/><circle cx="122" cy="97" r="17" fill="#fff" fill-opacity=".22" stroke="' + INK + '" stroke-width="3.5"/><path d="M95 95 Q100 91 105 95" fill="none" stroke="' + INK + '" stroke-width="3.5"/>';
    s += mouth(o.mouth);
    s += hat(o.hat, o.oc);
    return s;
  }

  var UID = 0;
  function bgLayer(kind, c) {
    var p = shade(c, rgb(c)[0] * 0.299 + rgb(c)[1] * 0.587 + rgb(c)[2] * 0.114 > 160 ? -0.1 : 0.2), s = '<rect width="200" height="200" fill="' + c + '"/>';
    if (kind === 'leaf') s += '<path d="M150 200 C140 160 160 120 188 100 C190 140 176 176 150 200Z" fill="#7FD6A8"/><path d="M168 200 C170 170 186 150 200 142 L200 200Z" fill="#59B88A"/><path d="M130 200 C116 176 124 146 146 130 C156 152 150 180 130 200Z" fill="#B6A4F0"/><path d="M20 200 C14 170 26 140 52 126 C60 150 50 182 20 200Z" fill="' + p + '"/>';
    if (kind === 'dots') for (var i = 0; i < 20; i++) s += '<circle cx="' + (22 + (i % 5) * 38 + (Math.floor(i / 5) % 2) * 19) + '" cy="' + (20 + Math.floor(i / 5) * 46) + '" r="5" fill="' + p + '"/>';
    return s;
  }
  // Avatar hình vuông 200×200 từ cấu hình đã làm sạch
  function avatar(cfg, size, shape, cls, label) {
    var uid = 'kd' + (++UID), rad = shape === 'circle' ? 100 : shape === 'round' ? 40 : 0;
    var o = { skin: cfg.kk, hair: cfg.kh, hairc: cfg.khc, eyes: cfg.ke, mouth: cfg.km, glasses: cfg.kg, blush: cfg.kb, hat: cfg.kt, outfit: cfg.ko, oc: cfg.oc, uid: uid, brow: 'none' };
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="' + size + '" height="' + size + '"' + (cls || '') + ' role="img" aria-label="' + (label || 'Bạn nhỏ hoạt hình') + '"><defs><clipPath id="' + uid + 'c"><rect width="200" height="200" rx="' + rad + '"/></clipPath></defs><g clip-path="url(#' + uid + 'c)">' + bgLayer(cfg.kbg, cfg.bgc) + '<g transform="translate(0 14) scale(.93) translate(7 0)">' + bust(o) + '</g></g></svg>';
  }

  /* ───── Sticker "Bạn học bài": nhân vật ngồi bàn với 8 trạng thái ───── */
  var KIDS = {
    boy: { name: 'Bạn nam', cfg: { skin: SKIN[1], hair: 'short', hairc: HAIRC[1], eyes: 'open', glasses: 0, blush: 1, hat: 'none', outfit: 'tee', oc: '#F2745A' } },
    girl: { name: 'Bạn nữ', cfg: { skin: SKIN[0], hair: 'pigtails', hairc: HAIRC[0], eyes: 'open', glasses: 0, blush: 1, hat: 'none', outfit: 'tee', oc: '#FBBF24' } }
  };
  var POSES = [
    { id: 'think', name: 'Đang suy nghĩ', eyes: 'open', look: 'up', brow: 'think', mouth: 'flat', arms: 'chin', deco: 'q', anim: 'swing' },
    { id: 'idea', name: 'Nảy ra ý tưởng', eyes: 'open', brow: 'up', mouth: 'grin', arms: 'write', deco: 'bulb', anim: 'twinkle' },
    { id: 'worry', name: 'Lo lắng', eyes: 'open', brow: 'sad', mouth: 'frown', arms: 'write', deco: 'sweat', anim: 'shake' },
    { id: 'fire', name: 'Cháy hết mình', eyes: 'open', brow: 'angry', mouth: 'tight', arms: 'write', deco: 'fire', anim: 'flicker' },
    { id: 'sleepy', name: 'Buồn ngủ', eyes: 'closed', brow: 'none', mouth: 'small', arms: 'sleep', deco: 'zzz', anim: 'float', tilt: 9 },
    { id: 'cheer', name: 'Hoan hô!', eyes: 'happy', brow: 'none', mouth: 'grin', arms: 'cheer', deco: 'sparks', anim: 'bob' },
    { id: 'tired', name: 'Mệt quá', eyes: 'half', brow: 'sad', mouth: 'flat', arms: 'cheekhand', deco: 'sweat', anim: 'float', tilt: -6 },
    { id: 'hand', name: 'Em xin phát biểu', eyes: 'open', brow: 'up', mouth: 'smile', arms: 'raise', deco: 'none', anim: 'wave' }
  ];
  function arm(x1, y1, x2, y2, bend, oc, sk) {
    var cx = (x1 + x2) / 2 + bend[0], cy = (y1 + y2) / 2 + bend[1];
    return '<path d="M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + INK + '" stroke-width="17" stroke-linecap="round"/><path d="M' + x1 + ' ' + y1 + ' Q' + cx + ' ' + cy + ' ' + x2 + ' ' + y2 + '" fill="none" stroke="' + oc + '" stroke-width="11" stroke-linecap="round"/><circle cx="' + x2 + '" cy="' + y2 + '" r="8.5" fill="' + sk + '" stroke="' + INK + '" stroke-width="3"/>';
  }
  function pose(poseId, who, o) {
    o = o || {}; var P = POSES.filter(function (x) { return x.id === poseId; })[0], K = KIDS[who || 'boy']; if (!P || !K) return '';
    var uid = 'ks' + (++UID), c = Object.assign({}, K.cfg, { eyes: P.eyes, mouth: P.mouth, brow: P.brow, look: P.look, uid: uid }), oc = c.oc, sk = c.skin, s = '';
    var sw = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"';
    if (P.deco === 'fire') s += '<path d="M100 10 C110 34 140 38 134 74 C150 62 156 82 150 100 C170 120 150 150 100 150 C50 150 30 120 50 100 C44 82 50 62 66 74 C60 38 90 34 100 10Z" fill="#FF8A1F" stroke="#E5531B" stroke-width="3"/><path d="M100 46 C106 62 124 68 120 90 C132 92 134 112 126 124 C116 140 84 140 74 124 C66 112 70 94 80 90 C76 70 94 62 100 46Z" fill="#FFD23F"/>';
    var tx = 34, ty = 36, sc = 0.66, head = '<g transform="translate(' + tx + ' ' + ty + ') scale(' + sc + ')"><g transform="' + (P.tilt ? 'rotate(' + P.tilt + ' 100 150)' : '') + '">' + bust(c) + '</g></g>';
    if (P.arms === 'sleep') head = '<g transform="translate(0 6)">' + head + '</g>';
    var desk = '<rect x="12" y="132" width="176" height="14" rx="5" fill="#E2B27A"' + sw + '/><rect x="22" y="146" width="156" height="30" fill="#C98F4E"' + sw + '/><rect x="26" y="176" width="10" height="18" rx="3" fill="#8F6A3B"' + sw + '/><rect x="164" y="176" width="10" height="18" rx="3" fill="#8F6A3B"' + sw + '/>';
    var book = '<path d="M66 134 L100 128 L134 134 L134 142 L100 136 L66 142Z" fill="#fff"' + sw + '/><path d="M100 128 V136" stroke="' + INK + '" stroke-width="2.5"/>';
    var arms = '';
    if (P.arms === 'write') arms = arm(72, 134, 88, 136, [-4, 8], oc, sk) + arm(128, 134, 112, 136, [4, 8], oc, sk) + '<path d="M112 136 L126 124" stroke="#FBBF24" stroke-width="4.5" stroke-linecap="round"/>';
    if (P.arms === 'sleep') arms = arm(70, 138, 96, 140, [0, 6], oc, sk) + arm(130, 138, 104, 140, [0, 6], oc, sk);
    if (P.arms === 'cheer') arms = arm(72, 132, 44, 70, [-12, 6], oc, sk) + arm(128, 132, 156, 70, [12, 6], oc, sk);
    if (P.arms === 'raise') arms = arm(72, 134, 88, 136, [-4, 8], oc, sk) + arm(128, 132, 148, 66, [10, 4], oc, sk);
    if (P.arms === 'chin') arms = arm(72, 134, 88, 136, [-4, 8], oc, sk) + arm(128, 134, 114, 122, [8, 6], oc, sk);
    if (P.arms === 'cheekhand') arms = arm(72, 134, 88, 136, [-4, 8], oc, sk) + arm(128, 134, 134, 112, [14, 4], oc, sk);
    var deco = '';
    if (P.deco === 'q') deco = '<text x="154" y="52" font-family="Arial Black,Arial,sans-serif" font-size="40" font-weight="900" fill="#3B82F6" stroke="#fff" stroke-width="3" paint-order="stroke">?</text>';
    if (P.deco === 'bulb') deco = '<g transform="translate(100 24)"><path d="M0-16 V-24 M-18-8 L-26-14 M18-8 L26-14 M-22 6 H-30 M22 6 H30" stroke="#F59E0B" stroke-width="3.5" stroke-linecap="round"/><circle cx="0" cy="4" r="14" fill="#FDE047"' + sw + '/><rect x="-6" y="16" width="12" height="9" rx="2" fill="#9CA3AF"' + sw + '/></g>';
    if (P.deco === 'sweat') deco = '<path d="M150 70 C142 84 140 92 150 96 C160 92 158 84 150 70Z" fill="#7DD3FC" stroke="#38BDF8" stroke-width="2.5"/>';
    if (P.deco === 'zzz') deco = '<g font-family="Arial Black,Arial,sans-serif" font-weight="900" fill="#6366F1" stroke="#fff" stroke-width="2.5" paint-order="stroke"><text x="130" y="60" font-size="26">Z</text><text x="148" y="44" font-size="20">z</text><text x="162" y="30" font-size="15">z</text></g>';
    if (P.deco === 'sparks') deco = '<g fill="#FBBF24" stroke="#F59E0B" stroke-width="2"><path d="M100 18 l5 11 12 1 -9 8 3 12 -11 -7 -11 7 3 -12 -9 -8 12 -1z"/><circle cx="26" cy="44" r="5"/><circle cx="176" cy="44" r="5"/></g>';
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="16 18 168 168" width="' + (o.size || 96) + '" height="' + (o.size || 96) + '" role="img" aria-label="' + (o.label || P.name) + '">' + s + head + desk + book + arms + deco + '</svg>';
  }

  /* ───── Sticker mùa lễ hội (Halloween, Giáng sinh) ───── */
  var SEASON = [
    ['hw-witch', 'Phù thuỷ nhỏ', 'swing'], ['hw-trick', 'Cho kẹo hay bị ghẹo!', 'bob'], ['hw-ghost', 'Bú! Bạn ma', 'float'], ['hw-vampire', 'Ma cà rồng nhí', 'shake'],
    ['xm-santa-boy', 'Ông già Noel nhí (nam)', 'bob'], ['xm-santa-girl', 'Ông già Noel nhí (nữ)', 'bob'], ['xm-gift', 'Quà Giáng sinh', 'pop'], ['xm-snow', 'Bạn tuyết', 'swing']
  ];
  function bat(x, y, k) { return '<path transform="translate(' + x + ' ' + y + ') scale(' + k + ')" d="M0 0 C-6 -8 -16 -8 -22 -2 C-18 -2 -14 0 -12 4 C-8 1 -4 2 0 6 C4 2 8 1 12 4 C14 0 18 -2 22 -2 C16 -8 6 -8 0 0Z" fill="#3B2F4F" stroke="#fff" stroke-width="1.5"/>'; }
  function flake(x, y, r) { var d = ''; for (var i = 0; i < 3; i++) { var a = i * Math.PI / 3; d += 'M' + (x - Math.cos(a) * r).toFixed(1) + ' ' + (y - Math.sin(a) * r).toFixed(1) + ' L' + (x + Math.cos(a) * r).toFixed(1) + ' ' + (y + Math.sin(a) * r).toFixed(1) + ' '; } return '<path d="' + d + '" stroke="#7DD3FC" stroke-width="3" stroke-linecap="round" fill="none"/><circle cx="' + x + '" cy="' + y + '" r="2.5" fill="#E0F2FE"/>'; }
  function season(id, o) {
    o = o || {}; var sw = ' stroke="' + INK + '" stroke-width="3" stroke-linejoin="round"', u = 'ss' + (++UID);
    var base = { eyes: 'big', mouth: 'grin', brow: 'none', blush: 1, glasses: 0, outfit: 'tee', uid: u }, inner = '', pre = '', post = '', name = '';
    var put = function (cfg) { return '<g transform="translate(22 14) scale(.78)">' + bust(Object.assign({}, base, cfg)) + '</g>'; };
    if (id === 'hw-witch') { name = 'Phù thuỷ nhỏ'; inner = put({ skin: SKIN[0], hair: 'long', hairc: HAIRC[0], hat: 'witch', oc: '#6B3FA0', mouth: 'smile' }); post = bat(30, 44, 1) + bat(170, 36, .8) + '<path d="M168 70 l4 9 10 1 -8 6 3 10 -9 -6 -9 6 3 -10 -8 -6 10 -1z" fill="#FBBF24" stroke="#F59E0B" stroke-width="2"/>'; }
    if (id === 'hw-trick') { name = 'Cho kẹo hay bị ghẹo'; inner = put({ skin: SKIN[1], hair: 'short', hairc: HAIRC[0], hat: 'catears', oc: '#F97316' }); post = '<g transform="translate(36 128)"><path d="M0 8 C-2 -12 56 -12 54 8 L50 44 C50 52 4 52 4 44Z" fill="#F97316"' + sw + '/><path d="M-2 4 C16 -34 38 -34 56 4" fill="none" stroke="' + INK + '" stroke-width="4" stroke-linecap="round"/><path d="M14 18 l6 8 -12 0z M40 18 l6 8 -12 0z" fill="#2B2B3A"/><path d="M12 36 Q27 46 42 36 L38 32 L33 38 L27 32 L21 38 L16 32Z" fill="#2B2B3A"/><circle cx="-2" cy="4" r="9" fill="' + SKIN[1] + '"' + sw + '/></g>' + '<g><circle cx="158" cy="150" r="9" fill="#EC4899"' + sw + '/><path d="M149 150 l-9 -6 v12z M167 150 l9 -6 v12z" fill="#EC4899"' + sw + '/></g>'; }
    if (id === 'hw-ghost') { name = 'Bạn ma'; inner = '<path d="M38 188 L38 92 C38 36 162 36 162 92 L162 188 L142 172 L121 190 L100 172 L79 190 L58 172Z" fill="#fff"' + sw + '/><ellipse cx="78" cy="98" rx="9" ry="12" fill="#2B2B3A"/><ellipse cx="122" cy="98" rx="9" ry="12" fill="#2B2B3A"/><ellipse cx="100" cy="128" rx="9" ry="12" fill="#2B2B3A"/><ellipse cx="62" cy="118" rx="8" ry="5" fill="#FF9DB0" opacity=".6"/><ellipse cx="138" cy="118" rx="8" ry="5" fill="#FF9DB0" opacity=".6"/><path d="M38 130 C20 126 14 110 22 100 C28 118 36 120 40 122Z M162 130 C180 126 186 110 178 100 C172 118 164 120 160 122Z" fill="#fff"' + sw + '/>'; post = '<text x="112" y="34" font-family="Arial Black,Arial,sans-serif" font-size="25" font-weight="900" fill="#F97316" stroke="#fff" stroke-width="4" paint-order="stroke" transform="rotate(8 140 28)">BOO!</text>'; }
    if (id === 'hw-vampire') { name = 'Ma cà rồng nhí'; pre = '<path d="M14 200 L40 112 L100 150 L160 112 L186 200Z" fill="#7F1D1D"' + sw + '/>'; inner = '<g transform="translate(22 14) scale(.78)">' + bust(Object.assign({}, base, { skin: '#F4E6E1', hair: 'short', hairc: '#1F1B2E', hat: 'none', oc: '#1F2937', outfit: 'shirt', mouth: 'grin', blush: 0 })) + '<path d="M90 120 l5 12 5 -12Z M100 120 l5 12 5 -12Z" fill="#fff"' + sw + '/><path d="M64 156 L52 118 L92 152Z M136 156 L148 118 L108 152Z" fill="#B91C1C"' + sw + '/></g>'; post = bat(32, 40, 1) + bat(170, 60, .75); }
    if (id === 'xm-santa-boy' || id === 'xm-santa-girl') { var g = id === 'xm-santa-girl'; name = 'Ông già Noel nhí'; inner = put({ skin: g ? SKIN[0] : SKIN[1], hair: g ? 'pigtails' : 'short', hairc: g ? HAIRC[3] : HAIRC[1], hat: 'santa', oc: '#E5333B', mouth: 'grin' }); post = flake(30, 50, 9) + flake(172, 40, 11) + flake(160, 120, 7) + flake(36, 118, 8); }
    if (id === 'xm-gift') { name = 'Quà Giáng sinh'; inner = put({ skin: SKIN[2], hair: 'curly', hairc: HAIRC[0], hat: 'santa', oc: '#16A34A', eyes: 'happy' }); post = '<g transform="translate(60 128)"><rect width="80" height="62" rx="6" fill="#E5333B"' + sw + '/><rect x="34" width="12" height="62" fill="#FBBF24"' + sw + '/><rect y="20" width="80" height="12" fill="#FBBF24"' + sw + '/><path d="M40 0 C20 -26 4 -14 22 -2 Z M40 0 C60 -26 76 -14 58 -2 Z" fill="#FBBF24"' + sw + '/></g><circle cx="62" cy="150" r="9" fill="' + SKIN[2] + '"' + sw + '/><circle cx="138" cy="150" r="9" fill="' + SKIN[2] + '"' + sw + '/>' + flake(30, 56, 9) + flake(174, 52, 9); }
    if (id === 'xm-snow') { name = 'Bạn tuyết'; inner = put({ skin: SKIN[1], hair: 'bob', hairc: HAIRC[5], hat: 'beanie', oc: '#38BDF8', eyes: 'open', mouth: 'smile' }); post = '<g' + sw + '><path d="M54 150 Q100 176 146 150 L144 168 Q100 192 56 168Z" fill="#E5333B"/><path d="M62 160 V176 M80 168 V184 M100 170 V188 M120 168 V184 M138 160 V176" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>' + flake(26, 40, 10) + flake(176, 30, 8) + flake(30, 120, 8) + flake(172, 110, 10); }
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="' + (o.size || 96) + '" height="' + (o.size || 96) + '" role="img" aria-label="' + (o.label || name) + '">' + pre + inner + post + '</svg>';
  }

  var API = { season: season, SEASON: SEASON, SKIN: SKIN, HAIRC: HAIRC, HAIR: HAIR, EYES: EYES, MOUTH: MOUTH, HAT: HAT, OUTFIT: OUTFIT, BG: BG, POSES: POSES, KIDS: KIDS, avatar: avatar, pose: pose, shade: shade };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTKid = API;
})(typeof window !== 'undefined' ? window : this);
