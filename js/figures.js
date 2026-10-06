/* Bộ sưu tập nhân vật gốc của English With Tom — 9 bộ, vẽ bằng SVG (không dùng ảnh ngoài).
   Dùng làm avatar (EWTFigures.avatar) và sticker (EWTFigures.svg). Mỗi nhân vật vẽ trong khung 100×100. */
(function (root) {
  'use strict';
  var INK = '#2B2B3A';

  function mk(st) {
    var S = st ? ' stroke="' + st.c + '" stroke-width="' + st.w + '" stroke-linejoin="round" stroke-linecap="round"' : '';
    return {
      S: S,
      c: function (x, y, r, f, n) { return '<circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="' + f + '"' + (n ? '' : S) + '/>'; },
      e: function (x, y, rx, ry, f, rot, n) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx + '" ry="' + ry + '" fill="' + f + '"' + (rot ? ' transform="rotate(' + rot + ' ' + x + ' ' + y + ')"' : '') + (n ? '' : S) + '/>'; },
      r: function (x, y, w, h, rx, f, n) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="' + (rx || 0) + '" fill="' + f + '"' + (n ? '' : S) + '/>'; },
      p: function (d, f, n) { return '<path d="' + d + '" fill="' + f + '"' + (n ? '' : S) + '/>'; },
      l: function (d, col, w) { return '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="' + (w || 2) + '" stroke-linecap="round" stroke-linejoin="round"/>'; }
    };
  }

  /* ─────────── Bộ 1: Ông bà vui vẻ (phẳng, tông màu dịu) ─────────── */
  var ELDER_BG = ['#C4636A', '#675B55', '#8FAE8B', '#C4636A', '#B79A7B', '#B79A7B', '#4F8E96', '#C4636A', '#8FAE8B', '#675B55'];
  var HAIRW = '#FBF2DE';
  function elder(id) {
    var h = mk(null), s = '', sk = '#F5C3A0', sk2 = '#F0A58A';
    var cfg = {
      'ong-kinh': { hair: 'side', gl: 'rect', gc: '#8E8E9B', beard: '', eyes: 'open', who: 'm' },
      'ong-hoi-rau': { hair: 'bald', gl: 'round', gc: '#5FB7C8', beard: 'full', eyes: 'closed', who: 'm' },
      'ba-xoan': { hair: 'curly', gl: '', beard: '', eyes: 'closed', who: 'f', blush: 1 },
      'ba-kinh-meo': { hair: 'wavy', gl: 'cat', gc: '#2B2B3A', beard: '', eyes: 'open', who: 'f' },
      'ba-nham-mat': { hair: 'pixie', gl: '', beard: '', eyes: 'closed', who: 'f', blush: 1 },
      'ong-ria-mep': { hair: 'short', gl: '', beard: 'stache', eyes: 'open', who: 'm' },
      'ba-dai': { hair: 'long', gl: 'rect', gc: '#2B2B3A', beard: '', eyes: 'open', who: 'f', ear: 1, blush: 1 },
      'ong-kinh-xanh': { hair: 'swoop', gl: 'rect', gc: '#4FB2C9', beard: 'full', eyes: 'open', who: 'm' },
      'ba-bui': { hair: 'bun', gl: 'round', gc: '#C88F63', beard: '', eyes: 'open', who: 'f' },
      'ong-toc-bong': { hair: 'swoop', gl: '', beard: 'stache', eyes: 'closed', who: 'm' }
    }[id];
    // cổ + bóng dưới cằm
    s += h.r(40, 66, 20, 36, 0, sk, 1) + h.p('M40 76 Q50 86 60 76 L60 90 L40 90Z', sk2, 1);
    // tóc phía sau
    if (cfg.hair === 'wavy') s += h.p('M24 30 C20 56 24 74 34 80 C40 70 34 52 36 34Z M76 30 C80 56 76 74 66 80 C60 70 66 52 64 34Z', HAIRW, 1);
    if (cfg.hair === 'long') s += h.p('M22 28 C14 60 22 86 36 90 C40 72 32 50 34 32Z M78 28 C86 60 78 86 64 90 C60 72 68 50 66 32Z', HAIRW, 1);
    if (cfg.hair === 'curly') [[26, 30], [36, 20], [50, 16], [64, 20], [74, 30], [22, 46], [78, 46], [26, 62], [74, 62]].forEach(function (p) { s += h.c(p[0], p[1], 11, HAIRW, 1); });
    // mặt + tai
    s += h.c(28, 46, 5, sk, 1) + h.c(72, 46, 5, sk, 1) + h.p('M29 40 C29 18 71 18 71 40 C71 58 64 74 50 78 C36 74 29 58 29 40Z', sk, 1);
    // mũi, nếp nhăn, má
    s += h.p('M50 38 L43 57 L53 58Z', sk2, 1);
    s += h.l('M33 54 q2 4 6 5 M67 54 q-2 4 -6 5 M36 36 q3 -2 6 0 M58 36 q3 -2 6 0', '#E39A82', 1.1);
    if (cfg.blush) s += h.e(36, 56, 5, 3.4, '#F58C8C', 0, 1).replace('/>', ' opacity=".6"/>') + h.e(64, 56, 5, 3.4, '#F58C8C', 0, 1).replace('/>', ' opacity=".6"/>');
    // lông mày + mắt
    s += h.l('M35 40 q6 -5 13 -1', HAIRW, 3.4) + h.l('M52 39 q7 -4 13 1', HAIRW, 3.4);
    if (cfg.eyes === 'open') s += h.c(41, 45, 2.2, INK, 1) + h.c(59, 45, 2.2, INK, 1);
    else s += h.l('M37 46 q4 -4 8 0 M55 46 q4 -4 8 0', INK, 1.8);
    // miệng
    s += h.l('M41 65 Q50 72 59 65', INK, 2);
    if (cfg.who === 'f' && cfg.ear) s += h.e(27, 56, 2, 4.5, 'none', 0, 1).replace('fill="none"', 'fill="none" stroke="#2B2B3A" stroke-width="1.6"') + h.e(73, 56, 2, 4.5, 'none', 0, 1).replace('fill="none"', 'fill="none" stroke="#2B2B3A" stroke-width="1.6"');
    // râu
    if (cfg.beard === 'full') s += h.p('M34 56 C32 72 40 84 50 86 C60 84 68 72 66 56 C62 62 58 62 50 62 C42 62 38 62 34 56Z', HAIRW, 1) + h.l('M43 66 Q50 71 57 66', INK, 2);
    if (cfg.beard === 'stache') s += h.p('M38 61 C42 55 48 58 50 60 C52 58 58 55 62 61 C58 66 52 63 50 62 C48 63 42 66 38 61Z', HAIRW, 1);
    // tóc phía trước
    var hr = { side: 'M28 38 C24 14 66 8 72 30 C66 22 52 20 44 22 C36 24 30 30 28 38Z', short: 'M29 36 C27 14 73 14 71 36 C68 26 58 22 50 22 C42 22 32 26 29 36Z', swoop: 'M27 40 C20 12 52 4 70 14 C80 20 74 34 71 40 C66 28 52 22 44 24 C36 26 30 32 27 40Z', pixie: 'M26 42 C20 14 60 6 74 24 C78 32 74 40 72 44 C68 34 60 28 52 28 C46 30 40 34 34 38 C32 40 28 42 26 42Z', bun: 'M29 36 C27 14 73 14 71 36 C68 26 58 22 50 22 C42 22 32 26 29 36Z', wavy: 'M27 40 C22 14 60 6 74 22 C78 30 76 40 73 44 C68 30 56 26 48 28 C40 30 32 34 27 40Z', long: 'M27 40 C22 12 62 6 74 22 C78 32 76 42 73 44 C68 30 56 26 48 28 C40 30 32 34 27 40Z', curly: '' };
    if (cfg.hair === 'curly') [[34, 26], [46, 20], [58, 20], [68, 28], [30, 38], [72, 38]].forEach(function (p) { s += h.c(p[0], p[1], 9, HAIRW, 1); });
    else if (cfg.hair === 'bald') s += h.p('M29 44 C26 28 34 24 36 30 C34 38 34 42 36 46Z M71 44 C74 28 66 24 64 30 C66 38 66 42 64 46Z', HAIRW, 1);
    else s += h.p(hr[cfg.hair], HAIRW, 1);
    if (cfg.hair === 'bun') s += h.c(50, 12, 10, HAIRW, 1);
    // kính
    if (cfg.gl === 'rect') s += '<rect x="33" y="39" width="15" height="11" rx="2" fill="#fff" fill-opacity=".25" stroke="' + cfg.gc + '" stroke-width="2"/><rect x="52" y="39" width="15" height="11" rx="2" fill="#fff" fill-opacity=".25" stroke="' + cfg.gc + '" stroke-width="2"/><path d="M48 43 H52" stroke="' + cfg.gc + '" stroke-width="2"/>';
    if (cfg.gl === 'round') s += '<circle cx="41" cy="45" r="7.5" fill="#fff" fill-opacity=".25" stroke="' + cfg.gc + '" stroke-width="2"/><circle cx="59" cy="45" r="7.5" fill="#fff" fill-opacity=".25" stroke="' + cfg.gc + '" stroke-width="2"/><path d="M48 44 H52" stroke="' + cfg.gc + '" stroke-width="2"/>';
    if (cfg.gl === 'cat') s += '<path d="M31 41 Q40 37 48 42 Q46 51 38 51 Q31 50 31 41Z M69 41 Q60 37 52 42 Q54 51 62 51 Q69 50 69 41Z" fill="#fff" fill-opacity=".25" stroke="' + cfg.gc + '" stroke-width="2.2"/><path d="M48 43 H52" stroke="' + cfg.gc + '" stroke-width="2"/>';
    return s;
  }

  /* ─────────── Bộ 2 & 3: Pixel (nghề nghiệp, chibi mắt to) ─────────── */
  var PXB = ['................', '................', '................', '....SSSSSSSS....', '....SSSSSSSS....', '....SSSSSSSS....', '...SSSSSSSSSS...', '...SSSSSSSSSS...', '....SSSSSSSS....', '....SSSSSSSS....', '.....SSSSSS.....', '......SSSS......', '..OOOOSSSSOOOO..', '.OOOOOOOOOOOOOO.', 'OOOOOOOOOOOOOOOO', 'OOOOOOOOOOOOOOOO'];
  var PXJ = {
    'zombie': { n: 'Zombie', pal: { S: '#8DBE5B', O: '#7A5C3A', R: '#2F5D62', B: '#E0525B', W: '#fff', E: INK, M: '#4B2A2A' }, ov: ['................', '................', '....RR.RRR.R....', '...RRRRRRRRRR...', '...RR..B.B.RR...'], f: function (g, put) { put(6, 5, 'E'); put(6, 10, 'W'); put(6, 11, 'E'); put(9, 5, 'M'); put(9, 6, 'W'); put(9, 7, 'M'); put(9, 8, 'W'); put(9, 9, 'M'); put(9, 10, 'W'); put(14, 6, 'S'); put(15, 10, 'S'); put(13, 4, 'S'); } },
    'cuop-bien': { n: 'Cướp biển', pal: { S: '#F0C193', O: '#6B3A2A', P: '#F3E9D2', H: '#D33A3A', R: '#5A3320', K: INK, E: INK, M: '#8A2E3B', W: '#fff' }, ov: ['................', '................', '....HHHHHHHH.H..', '...HHHHHHHHHHHH.', '....SSSSSSSS....', '....SSSSSKKS....', '...SSSSSSSKKSS..', '................', '................', '....RRRRRRRR....', '.....RRRRRR.....', '......RRRR......', '..OOOOPPPPOOOO..', '.OOOOOOPPOOOOOO.'], f: function (g, put) { put(6, 5, 'E'); put(10, 7, 'M'); put(10, 8, 'M'); } },
    'nguoi-ngoai-hanh-tinh': { n: 'Người ngoài hành tinh', pal: { S: '#5BB4E8', O: '#2F5DA8', E: INK, W: '#fff', M: '#1E3A66' }, ov: ['................', '................', '................', '................', '................', '.....WW..WW.....', '....WEEWWEEW....'], f: function (g, put) { put(5, 5, 'E'); put(5, 6, 'W'); put(5, 9, 'W'); put(5, 10, 'E'); put(6, 5, 'E'); put(6, 6, 'E'); put(6, 9, 'E'); put(6, 10, 'E'); put(4, 7, 'W'); put(4, 8, 'E'); put(9, 7, 'M'); put(9, 8, 'M'); put(5, 3, 'S'); put(5, 12, 'S'); put(4, 3, 'S'); put(4, 12, 'S'); } },
    'sieu-nhan': { n: 'Siêu nhân', pal: { S: '#F0C193', O: '#D62F3A', R: '#1F1B2E', K: '#1F2E6B', W: '#fff', Y: '#FFD23F', E: INK, M: '#B04A4A', C: '#2F57C9' }, ov: ['................', '................', '....RRRRRRRR....', '...RRRRRRRRRR...', '...RR......RR...', '....KKKKKKKK....', '...SKWKSSKWKS...'], f: function (g, put) { put(9, 6, 'M'); put(9, 9, 'M'); put(10, 7, 'M'); put(10, 8, 'M'); put(12, 7, 'Y'); put(12, 8, 'Y'); put(13, 7, 'Y'); put(13, 8, 'Y'); put(13, 0, 'C'); put(14, 0, 'C'); put(14, 1, 'C'); put(15, 1, 'C'); put(13, 15, 'C'); put(14, 15, 'C'); put(14, 14, 'C'); put(15, 14, 'C'); put(6, 5, 'W'); put(6, 10, 'W'); } },
    'linh-cuu-hoa': { n: 'Lính cứu hoả', pal: { S: '#E3A877', O: '#C99E3E', H: '#D83A3A', Y: '#FFD23F', K: '#4B4B55', E: INK, M: '#9A3B3B' }, ov: ['................', '.....HHHHHH.....', '....HHHYYHHH....', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..'], f: function (g, put) { put(6, 5, 'E'); put(6, 10, 'E'); put(9, 6, 'M'); put(9, 9, 'M'); put(10, 7, 'M'); put(10, 8, 'M'); put(8, 5, 'K'); put(14, 3, 'Y'); put(14, 4, 'Y'); put(14, 11, 'Y'); put(14, 12, 'Y'); put(13, 6, 'Y'); put(13, 9, 'Y'); } },
    'ong-gia-noel': { n: 'Ông già Noel', pal: { S: '#F2C29B', O: '#D83A3A', H: '#D83A3A', W: '#FFFFFF', N: '#F29A9A', E: INK }, ov: ['................', '..............W.', '.....HHHHHH.WW..', '....HHHHHHHHH...', '...WWWWWWWWWW...', '................', '................', '................', '....WWWWWWWW....', '...WWWWWWWWWW...', '...WWWWWWWWWW...', '....WWWWWWWW....', '...WWWWWWWWWW...'], f: function (g, put) { put(6, 5, 'E'); put(6, 10, 'E'); put(8, 7, 'N'); put(8, 8, 'N'); put(5, 4, 'W'); put(5, 5, 'W'); put(5, 10, 'W'); put(5, 11, 'W'); } },
    'canh-sat': { n: 'Cảnh sát', pal: { S: '#C98A5B', O: '#2F4F8F', H: '#1F3566', Y: '#FFD23F', W: '#fff', E: INK, M: '#7A3030' }, ov: ['................', '................', '....HHHHHHHH....', '...HHHHYYHHHH...', '..HHHHHHHHHHHH..'], f: function (g, put) { put(6, 5, 'E'); put(6, 10, 'E'); put(9, 7, 'M'); put(9, 8, 'M'); put(12, 6, 'W'); put(12, 9, 'W'); put(13, 10, 'Y'); put(13, 11, 'Y'); } },
    'bac-si-khau-trang': { n: 'Bác sĩ khẩu trang', pal: { S: '#F0C193', O: '#2FA39B', H: '#2FA39B', L: '#BFE7F0', K: '#3A3A4A', E: INK, W: '#fff', R: '#5A3A20' }, ov: ['................', '................', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHSSSSSSHH...', '................', '................', '................', '....LLLLLLLL....', '....LLLLLLLL....', '.....LLLLLL.....', '......SSSS......', '..OOOOSSSSOOOO..', '.OOOOOWSSWOOOO..'], f: function (g, put) { put(6, 5, 'E'); put(6, 10, 'E'); put(13, 4, 'K'); put(14, 4, 'K'); put(15, 5, 'K'); } },
    'hiep-si': { n: 'Hiệp sĩ', pal: { S: '#F0C193', O: '#8E97A8', H: '#B7C0CF', R: '#D83A3A', Y: '#F2B93A', K: '#4F5663', E: INK, M: '#8A3B3B' }, ov: ['.......RR.......', '.......RR.......', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HHSSSSSSHH...', '...HSSSSSSSSH...', '...HSSSSSSSSH...', '...HSSSSSSSSH...', '...HHSSSSSSHH...', '....HHHHHHHH....', '.....HHHHHH.....', '..OOOYYYYOOOO...'], f: function (g, put) { put(6, 5, 'E'); put(6, 10, 'E'); put(9, 7, 'M'); put(9, 8, 'M'); } },
    'robot': { n: 'Robot', pal: { H: '#B7BCC6', D: '#7F8694', G: '#4DE0A0', K: '#33384A', R: '#E5484D', O: '#9AA1AF', S: '#B7BCC6' }, ov: ['.......R........', '.......K........', '................', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HGGHHHHGGH...', '...HGGHHHHGGH...', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HKKKKKKKKH...', '...HKHKHKHKHH...', '....DDDDDDDD....', '..OOOODDDDOOOO..', '.OOOOOOGGOOOOOO.'], f: function (g, put) {}, noBase: 1 },
    'phu-thuy': { n: 'Phù thuỷ', pal: { S: '#F2C29B', O: '#6B3FA0', H: '#7B4FC2', Y: '#F5C431', W: '#fff', E: INK }, ov: ['......HH........', '.....HHHH.......', '....HHHHHH......', '....YYYYYYYY....', '..HHHHHHHHHHHH..', '................', '................', '................', '....WWWWWWWW....', '...WWWWWWWWWW...', '...WWWWWWWWWW...', '....WWWWWWWW....', '...WWWWWWWWWW...'], f: function (g, put) { put(6, 5, 'E'); put(6, 10, 'E'); put(5, 4, 'W'); put(5, 5, 'W'); put(5, 10, 'W'); put(5, 11, 'W'); } },
    'cong-chua': { n: 'Công chúa', pal: { S: '#FBD3B0', O: '#F27AB0', R: '#F6D463', Y: '#FFD23F', W: '#fff', E: INK, M: '#C85A6A', C: '#F59AA8' }, ov: ['................', '.....Y.Y.Y......', '....YYYYYYYY....', '...RRRRRRRRRR...', '...RRRRRRRRRR...', '...RR......RR...', '...RR......RR...', '...RR......RR...', '...RR......RR...', '...RR......RR...', '...RRR....RRR...', '...RRR....RRR...', '..OOWWSSSSWWOO..'], f: function (g, put) { put(6, 5, 'E'); put(6, 10, 'E'); put(9, 6, 'M'); put(9, 9, 'M'); put(10, 7, 'M'); put(10, 8, 'M'); put(8, 4, 'C'); put(8, 11, 'C'); } }
  };
  function pixelJob(id) {
    var d = PXJ[id], g = PXB.map(function (r) { return r.split(''); }), r, c;
    function put(y, x, ch) { if (y >= 0 && y < 16 && x >= 0 && x < 16) g[y][x] = ch; }
    if (d.noBase) { g = []; for (r = 0; r < 16; r++) g.push('................'.split('')); }
    d.ov.forEach(function (row, y) { for (c = 0; c < 16; c++) { var ch = row.charAt(c); if (ch !== '.') put(y, c, ch); } });
    if (!d.noBase) { put(6, 5, 'E'); put(6, 10, 'E'); put(9, 6, 'M'); put(9, 9, 'M'); put(10, 7, 'M'); put(10, 8, 'M'); }
    d.f(g, put);
    return pxRender(g, d.pal);
  }
  function pxRender(g, pal) {
    var N = 18, big = [], out = [], r, c, rects = '';
    for (r = 0; r < N; r++) { big.push([]); for (c = 0; c < N; c++) big[r].push('.'); }
    for (r = 0; r < 16; r++) for (c = 0; c < 16; c++) big[r + 1][c + 1] = g[r][c];
    out = big.map(function (row) { return row.slice(); });
    for (r = 0; r < N; r++) for (c = 0; c < N; c++) if (big[r][c] === '.') {
      if ((r > 0 && big[r - 1][c] !== '.') || (r < N - 1 && big[r + 1][c] !== '.') || (c > 0 && big[r][c - 1] !== '.') || (c < N - 1 && big[r][c + 1] !== '.')) out[r][c] = '#';
    }
    for (r = 0; r < N; r++) { c = 0; while (c < N) { var ch = out[r][c]; if (ch === '.') { c++; continue; } var e = c; while (e < N && out[r][e] === ch) e++; rects += '<rect x="' + c + '" y="' + r + '" width="' + (e - c + 0.03) + '" height="1.03" fill="' + (ch === '#' ? '#2A2A38' : (pal[ch] || '#f0f')) + '"/>'; c = e; } }
    return '<g transform="translate(-1 -1) scale(5.7)" shape-rendering="crispEdges">' + rects + '</g>';
  }

  // Pixel chibi mắt to
  var PXC = {
    'bob-den': { n: 'Bob đen', hs: 'bob', hc: '#2A2230', ec: '#C8442F', sk: '#FBD9BD' }, 'vang-bob': { n: 'Tóc vàng', hs: 'long', hc: '#F2CF63', ec: '#4A7FD8', sk: '#FBD9BD' },
    'da-nau': { n: 'Da nâu tóc dài', hs: 'long', hc: '#1E1A22', ec: '#3A2B22', sk: '#8D5A3A' }, 'tai-meo': { n: 'Tai mèo', hs: 'bobcat', hc: '#2A2230', ec: '#4A7FD8', sk: '#FBD9BD' },
    'kinh-ram': { n: 'Kính râm', hs: 'short', hc: '#5A3A2A', ec: '#4A7FD8', sk: '#FBD9BD', sun: 1 }, 'toc-bui': { n: 'Tóc búi', hs: 'bun', hc: '#F2CF63', ec: '#D8483A', sk: '#FBD9BD' },
    'toc-xanh': { n: 'Tóc xanh', hs: 'bob', hc: '#3E88E0', ec: '#2A2230', sk: '#FBD9BD' }, 'toc-do': { n: 'Tóc đỏ xoăn', hs: 'curly', hc: '#E04B35', ec: '#2F8F6A', sk: '#FBD9BD' },
    'afro': { n: 'Afro', hs: 'afro', hc: '#1E1A22', ec: '#3A2B22', sk: '#6B4229' }, 'toc-nhon': { n: 'Tóc nhọn bạc', hs: 'spiky', hc: '#D9DDE6', ec: '#4A7FD8', sk: '#FBD9BD' },
    'dau-bang': { n: 'Băng đô', hs: 'short', hc: '#2A2230', ec: '#4A7FD8', sk: '#E8B58A', band: 1 }, 'toc-nau': { n: 'Tóc nâu hai bím', hs: 'twin', hc: '#7A4A2A', ec: '#4A7FD8', sk: '#FBD9BD' },
    'dau-hoi': { n: 'Đầu trọc', hs: 'bald', hc: '#2A2230', ec: '#3A2B22', sk: '#E8B58A' }, 'toc-cam': { n: 'Tóc cam', hs: 'swoop', hc: '#F29A3A', ec: '#4A7FD8', sk: '#FBD9BD' },
    'toc-ngan-nau': { n: 'Tóc ngắn nâu', hs: 'short', hc: '#6B3E1E', ec: '#2F8F6A', sk: '#F1C27D' }, 'toc-hong': { n: 'Tóc hồng', hs: 'long', hc: '#F27AB0', ec: '#8A4FD8', sk: '#FBD9BD' }
  };
  var PXH = {
    bob: ['................', '................', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HH......HH...', '...HH......HH...', '...HH......HH...', '...HH......HH...'],
    long: ['................', '................', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HH......HH...', '...HH......HH...', '...HH......HH...', '...HH......HH...', '...HH......HH...', '...HHH....HHH...', '...HHH....HHH...'],
    bobcat: ['................', '...HH......HH...', '...HHH....HHH...', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HH......HH...', '...HH......HH...', '...HH......HH...'],
    short: ['................', '................', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HH......HH...'],
    bun: ['......HHHH......', '......HHHH......', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '...HH......HH...'],
    curly: ['................', '...H.HHHHHH.H...', '..HHHHHHHHHHHH..', '..HHHHHHHHHHHH..', '..HHH......HHH..', '..HHH......HHH..', '..HH........HH..'],
    afro: ['................', '...HHHHHHHHHH...', '..HHHHHHHHHHHH..', '.HHHHHHHHHHHHHH.', '.HHHHHHHHHHHHHH.', '.HHHH......HHHH.', '..HH........HH..'],
    spiky: ['................', '...H..HH..H.....', '..HHHHHHHHHHHH..', '...HHHHHHHHHH...', '....HH.HH.HH....'],
    twin: ['................', '................', '....HHHHHHHH....', '...HHHHHHHHHH...', '...HHHHHHHHHH...', '.HH.HH....HH.HH.', '.HH.HH....HH.HH.', '.HH.........HH..'],
    bald: [],
    swoop: ['................', '....HHHHHHHH....', '..HHHHHHHHHHH...', '..HHHHHHHHHHHH..', '...HHHHHHH.HH...', '...HHH......HH..']
  };
  function pixelChibi(id) {
    var d = PXC[id], g = PXB.map(function (r) { return r.split(''); }), pal = { S: d.sk, O: '#6C8CD8', H: d.hc, E: INK, W: '#fff', I: d.ec, M: '#C0505A', C: '#F59AA8', K: '#1E1A22', B: '#E5484D', G: '#2A2A38' }, r, c;
    function put(y, x, ch) { if (y >= 0 && y < 16 && x >= 0 && x < 16) g[y][x] = ch; }
    (PXH[d.hs] || []).forEach(function (row, y) { for (c = 0; c < 16; c++) if (row.charAt(c) !== '.') put(y, c, 'H'); });
    if (d.hs === 'bobcat') { put(1, 3, 'B'); put(1, 12, 'B'); }
    // mắt to: 2 cột × 3 hàng nằm trong mặt (cột 5-6 và 9-10)
    put(6, 5, 'E'); put(6, 6, 'E'); put(7, 5, 'W'); put(7, 6, 'I'); put(8, 5, 'I'); put(8, 6, 'I');
    put(6, 9, 'E'); put(6, 10, 'E'); put(7, 9, 'I'); put(7, 10, 'W'); put(8, 9, 'I'); put(8, 10, 'I');
    put(9, 4, 'C'); put(9, 11, 'C'); put(10, 7, 'M'); put(10, 8, 'M');
    if (d.sun) { for (c = 3; c <= 12; c++) { put(6, c, 'K'); put(7, c, 'K'); } put(6, 8, 'K'); put(8, 3, 'S'); }
    if (d.band) for (c = 3; c <= 12; c++) put(4, c, 'B');
    if (d.hs === 'bald') { for (c = 4; c <= 11; c++) put(3, c, 'S'); }
    return pxRender(g, pal);
  }

  /* ─────────── Bộ 4: Anh hùng RPG (toàn thân, nét mảnh) ─────────── */
  function faceDots(h, o) {
    o = o || {}; var s = '', ey = o.ey || 40, c = o.c || INK;
    if (o.eyes === 'angry') s += h.e(43, ey, 2.4, 2.8, c, 0, 1) + h.e(57, ey, 2.4, 2.8, c, 0, 1) + h.l('M38 ' + (ey - 5) + ' L47 ' + (ey - 3) + ' M62 ' + (ey - 5) + ' L53 ' + (ey - 3), c, 2);
    else if (o.eyes === 'happy') s += h.l('M39 ' + ey + ' q4 -5 8 0 M53 ' + ey + ' q4 -5 8 0', c, 2);
    else if (o.eyes === 'hollow') s += h.e(43, ey, 4, 4.6, '#1B1B24', 0, 1) + h.e(57, ey, 4, 4.6, '#1B1B24', 0, 1);
    else if (o.eyes === 'slit') s += h.l('M39 ' + ey + ' h8 M53 ' + ey + ' h8', c, 2.4);
    else s += h.e(43, ey, 2.3, 3, c, 0, 1) + h.e(57, ey, 2.3, 3, c, 0, 1);
    if (o.cheek !== 0) s += '<ellipse cx="37" cy="' + (ey + 7) + '" rx="3.4" ry="2.2" fill="#F58C8C" opacity=".5"/><ellipse cx="63" cy="' + (ey + 7) + '" rx="3.4" ry="2.2" fill="#F58C8C" opacity=".5"/>';
    if (o.mouth === 'frown') s += h.l('M45 ' + (ey + 10) + ' q5 -4 10 0', c, 1.8);
    else if (o.mouth === 'open') s += h.p('M44 ' + (ey + 8) + ' Q50 ' + (ey + 18) + ' 56 ' + (ey + 8) + 'Z', '#8A2E3B', 1);
    else if (o.mouth === 'none') s += '';
    else s += h.l('M45 ' + (ey + 8) + ' q5 4 10 0', c, 1.8);
    return s;
  }
  function chibi(h, o) {
    var s = o.back || '';
    s += h.r(38, 78, 9, 14, 3, o.pants || '#5A4A6A') + h.r(53, 78, 9, 14, 3, o.pants || '#5A4A6A');
    s += h.e(42, 93, 7, 3.4, o.boots || '#3A2E3F') + h.e(58, 93, 7, 3.4, o.boots || '#3A2E3F');
    s += h.p('M36 60 Q36 56 42 56 H58 Q64 56 64 60 V78 H36Z', o.body || '#7A8CD8');
    if (o.bodyX) s += o.bodyX;
    s += h.e(31, 68, 5, 8, o.arm || o.body || '#7A8CD8', 18) + h.e(69, 68, 5, 8, o.arm || o.body || '#7A8CD8', -18);
    s += h.c(30, 76, 4.2, o.skin || '#F5C9A0') + h.c(70, 76, 4.2, o.skin || '#F5C9A0');
    s += h.c(50, 38, 21, o.skin || '#F5C9A0');
    s += o.mid || '';
    s += o.face;
    s += o.front || '';
    s += o.prop || '';
    return s;
  }
  function rpg(id) {
    var h = mk({ c: '#3A2E3F', w: 1.6 }), s = '';
    switch (id) {
      case 'chien-binh': s = chibi(h, { body: '#9AA3B5', pants: '#5B6275', skin: '#F2C29B', face: faceDots(h, {}),
        front: h.p('M28 40 C26 14 74 14 72 40 L72 44 L64 44 L64 34 L36 34 L36 44 L28 44Z', '#B9C1D1') + h.p('M44 14 Q50 2 56 14Z', '#D83A3A') + h.r(48, 30, 4, 14, 1, '#B9C1D1'),
        prop: h.c(78, 70, 12, '#8A5A2E') + h.c(78, 70, 5, '#F2B93A') + h.p('M20 74 L22 40 L26 74Z', '#E6E9F2') + h.r(17, 72, 12, 3, 1, '#8A5A2E') }); break;
      case 'phap-su': s = chibi(h, { body: '#7B4FC2', pants: '#4B2F82', skin: '#F2C29B', face: faceDots(h, { eyes: 'happy' }),
        front: h.p('M26 28 H74 L68 22 L56 4 L52 4 L44 22 L32 22Z', '#6B3FA0') + h.p('M20 30 Q50 22 80 30 Q50 38 20 30Z', '#4C2A7A') + h.r(33, 24, 34, 5, 1, '#F2B93A'),
        prop: h.r(80, 28, 3, 62, 1, '#8A5A2E') + h.c(81, 24, 7, '#52D6F4') + h.c(79, 22, 2, '#fff', 1) }); break;
      case 'cung-thu': s = chibi(h, { body: '#7DA35A', pants: '#6B5A3A', skin: '#F2C29B', face: faceDots(h, {}),
        front: h.p('M28 40 C26 12 74 12 72 40 C66 28 34 28 28 40Z', '#4E8B3A') + h.p('M40 14 L50 2 L60 14Z', '#4E8B3A'),
        prop: h.p('M78 36 Q96 66 78 96', 'none') + h.l('M80 34 Q98 66 80 96', '#8A5A2E', 3) + h.l('M80 34 L80 96', '#E6E9F2', 1) + h.r(60, 54, 14, 3, 1, '#C9A06B') + '<path d="M22 56 L22 82" stroke="#8A5A2E" stroke-width="2"/><path d="M19 58 L22 52 L25 58Z" fill="#B9C1D1"/>' }); break;
      case 'thay-thuoc': s = chibi(h, { body: '#F4F6FB', pants: '#8FB4E8', skin: '#F2C29B', face: faceDots(h, { eyes: 'happy' }),
        bodyX: h.r(46, 58, 8, 18, 1, '#6FA8E8', 1),
        front: h.p('M27 44 C24 12 76 12 73 44 L66 44 L66 34 C56 28 44 28 34 34 L34 44Z', '#EAF1FF') + h.r(46, 14, 8, 3, 1, '#E05A5A'),
        prop: h.r(79, 28, 3, 62, 1, '#C9A06B') + h.r(73, 34, 15, 4, 1, '#F2B93A') + h.r(78, 29, 5, 14, 1, '#F2B93A') }); break;
      case 'viking': s = chibi(h, { body: '#B05A2E', pants: '#6B4A32', skin: '#F2C29B', face: faceDots(h, { eyes: 'angry', mouth: 'none', cheek: 0 }),
        mid: h.p('M32 46 C34 62 66 62 68 46 C60 52 40 52 32 46Z', '#E58A3A'),
        front: h.p('M28 34 C26 12 74 12 72 34 C60 28 40 28 28 34Z', '#B9C1D1') + h.p('M28 30 C16 28 14 14 16 8 C20 18 26 22 30 24Z', '#F4EBD6') + h.p('M72 30 C84 28 86 14 84 8 C80 18 74 22 70 24Z', '#F4EBD6') + h.r(46, 26, 8, 8, 1, '#9AA3B5'),
        prop: h.r(80, 36, 3, 56, 1, '#8A5A2E') + h.p('M82 38 Q96 30 94 52 Q90 46 82 46Z', '#B9C1D1') + h.c(22, 70, 11, '#C9A06B') + h.c(22, 70, 4, '#D8D8E0') }); break;
      case 'bo-xuong': s = chibi(h, { body: '#E9E6DA', pants: '#E9E6DA', boots: '#D6D2C2', skin: '#EFEBDD', arm: '#EFEBDD', face: faceDots(h, { eyes: 'hollow', mouth: 'none', cheek: 0 }),
        bodyX: h.l('M42 62 H58 M42 67 H58 M42 72 H58 M50 58 V78', '#8A8676', 1.6),
        mid: h.p('M42 54 H58 V60 H42Z', '#EFEBDD') + h.l('M46 54 V60 M50 54 V60 M54 54 V60', '#8A8676', 1.4) + h.p('M48 46 L50 50 L52 46Z', '#1B1B24', 1),
        prop: h.r(80, 40, 3, 50, 1, '#C9CFD9') + h.r(75, 62, 13, 3, 1, '#8A5A2E') + h.c(22, 72, 10, '#8A5A2E') + h.c(22, 72, 4, '#C9CFD9') }); break;
      case 'orc': s = chibi(h, { body: '#8A4A2E', pants: '#5A3A2A', skin: '#7FB04F', arm: '#7FB04F', face: faceDots(h, { eyes: 'angry', mouth: 'none', cheek: 0, c: '#2A3A1A' }),
        mid: h.p('M42 50 H58 L58 56 L42 56Z', '#8A4A2E', 1) + h.p('M43 50 L45 44 L47 50Z M57 50 L55 44 L53 50Z', '#F4EBD6') + h.l('M44 52 H56', '#2A3A1A', 1.8),
        front: h.p('M30 26 C32 14 68 14 70 26 C60 22 40 22 30 26Z', '#2E3A1F'),
        prop: h.r(80, 22, 3, 70, 1, '#8A5A2E') + h.p('M77 24 L81 8 L85 24Z', '#C9CFD9') }); break;
      case 'ke-trom': s = chibi(h, { body: '#3A3F55', pants: '#2A2E40', boots: '#1F2230', skin: '#F2C29B', face: faceDots(h, { eyes: 'slit', mouth: 'none', cheek: 0 }),
        mid: h.p('M30 40 C30 54 70 54 70 40 L70 46 C70 58 30 58 30 46Z', '#2F3347', 1),
        front: h.p('M26 40 C22 10 78 10 74 40 C70 28 30 28 26 40Z', '#3A3F55') + h.p('M30 38 C34 32 66 32 70 38 C66 44 34 44 30 38Z', '#F2C29B', 1) + faceDots(h, { eyes: 'slit', mouth: 'none', cheek: 0, ey: 39 }),
        prop: h.p('M82 56 L86 76 L82 78 L78 76Z', '#C9CFD9') + h.r(80, 76, 4, 8, 1, '#8A5A2E') }); break;
    }
    return s;
  }

  /* ─────────── Bộ 5: Huy hiệu tròn bóng dài ─────────── */
  var BADGE = {
    'phu-thuy': { n: 'Phù thuỷ sao', bg: '#5B3A9A' }, 'tien-ru': { n: 'Xạ thủ tinh linh', bg: '#334C3A' }, 'viking': { n: 'Viking', bg: '#4A2F22' },
    'ninja': { n: 'Ninja', bg: '#9A867B' }, 'y-ta': { n: 'Y tá', bg: '#F28AB6' }, 'samurai': { n: 'Nón lá', bg: '#1E4B6E' },
    'bang-trang': { n: 'Băng đô đỏ', bg: '#B81F2C' }, 'nha-su': { n: 'Nhà sư', bg: '#F5B03B' }, 'cuop-bien': { n: 'Cướp biển', bg: '#2AA3DE' }
  };
  function badge(id) {
    var h = mk(null), s = '', sk = '#F9D5BE', eye = h.c(43, 52, 2.3, INK, 1) + h.c(57, 52, 2.3, INK, 1);
    switch (id) {
      case 'phu-thuy':
        s = h.p('M30 100 L34 74 Q50 68 66 74 L70 100Z', '#6A6FC9', 1) + h.p('M32 56 Q50 108 68 56 Q70 78 50 82 Q30 78 32 56Z', '#E8E8F0', 1) + h.c(50, 52, 15, sk, 1) + eye + h.p('M36 44 C40 40 60 40 64 44 L50 40Z', '#E8E8F0', 1)
          + h.p('M18 44 Q50 36 82 44 Q50 52 18 44Z', '#4B5BC0', 1) + h.p('M32 44 L44 8 Q48 2 52 8 L70 44Z', '#4B5BC0', 1) + '<g fill="#FFD23F"><path d="M46 20 l1.6 3.4 3.6.4 -2.7 2.4.8 3.6 -3.3-1.9 -3.3 1.9.8-3.6 -2.7-2.4 3.6-.4z"/><circle cx="58" cy="30" r="2"/><circle cx="40" cy="34" r="1.6"/></g>'; break;
      case 'tien-ru':
        s = h.p('M32 100 L34 78 Q50 70 66 78 L68 100Z', '#C28F5A', 1) + h.p('M24 70 L26 50 Q50 20 74 50 L76 70 Q50 56 24 70Z', '#7ED04F', 1) + h.c(50, 52, 14, sk, 1) + eye + h.p('M36 52 L28 46 L34 58Z M64 52 L72 46 L66 58Z', sk, 1) + h.p('M32 48 Q50 28 68 48 L64 40 Q50 24 36 40Z', '#7ED04F', 1) + h.l('M72 62 L88 54 M72 66 L88 62 M72 70 L88 70', '#E8E8F0', 2.4); break;
      case 'viking':
        s = h.p('M26 100 L28 76 Q50 66 72 76 L74 100Z', '#9AA3B5', 1) + h.c(50, 54, 16, sk, 1) + h.p('M34 58 Q50 92 66 58 Q50 70 34 58Z', '#D9782B', 1) + h.c(43, 52, 2.2, INK, 1) + h.c(57, 52, 2.2, INK, 1) + h.l('M45 62 q5 3 10 0', INK, 1.6)
          + h.p('M30 52 C30 22 70 22 70 52 L62 50 C60 42 40 42 38 50Z', '#E6E8EE', 1) + h.r(47, 38, 6, 16, 2, '#B7C0CF', 1) + h.p('M32 34 C18 32 12 18 16 4 C24 18 30 26 40 30Z M68 34 C82 32 88 18 84 4 C76 18 70 26 60 30Z', '#F4EBD6', 1); break;
      case 'ninja':
        s = h.p('M26 100 L30 72 Q50 62 70 72 L74 100Z', '#262630', 1) + h.c(50, 48, 22, '#262630', 1) + h.p('M34 44 Q50 36 66 44 L66 54 Q50 60 34 54Z', sk, 1) + eye.replace(/cy="52"/g, 'cy="49"') + h.p('M44 74 L56 74 L50 82Z', '#6B6B77', 1) + h.r(66, 72, 22, 5, 2, '#33333F', 1).replace('/>', ' transform="rotate(-30 66 72)"/>'); break;
      case 'y-ta':
        s = h.p('M28 100 L30 78 Q50 70 70 78 L72 100Z', '#FFFFFF', 1) + h.c(50, 54, 15, sk, 1) + h.p('M34 52 C32 36 68 36 66 52 C60 44 40 44 34 52Z', '#F7D75B', 1) + h.p('M32 48 C32 38 40 34 50 34 C60 34 68 38 68 48 C62 42 38 42 32 48Z', '#F7D75B', 1) + eye.replace(/cy="52"/g, 'cy="55"') + h.r(36, 28, 28, 14, 3, '#FFFFFF', 1) + h.r(48, 29, 4, 11, 1, '#E5484D', 1) + h.r(45, 32, 10, 4, 1, '#E5484D', 1) + h.c(50, 40, 3, '#F2B93A', 1); break;
      case 'samurai':
        s = h.p('M26 100 L28 74 Q50 66 72 74 L74 100Z', '#E8E1D0', 1) + h.p('M26 78 L40 70 L40 100 L26 100Z', '#F07A2B', 1) + h.c(50, 56, 14, sk, 1) + eye.replace(/cy="52"/g, 'cy="57"') + h.p('M8 54 Q50 18 92 54 Q50 64 8 54Z', '#D9CDB0', 1) + h.r(48, 40, 8, 8, 1, '#F07A2B', 1); break;
      case 'bang-trang':
        s = h.p('M30 100 L32 76 Q50 70 68 76 L70 100Z', '#8B5A3C', 1) + h.r(46, 74, 8, 8, 1, '#E53A3A', 1) + h.c(50, 52, 17, sk, 1) + h.p('M32 44 C34 30 66 30 68 44 C62 38 38 38 32 44Z', '#6B4229', 1) + h.r(30, 42, 40, 9, 2, '#1E1E26', 1) + h.r(60, 42, 14, 3, 1, '#E53A3A', 1).replace('/>', ' transform="rotate(20 60 42)"/>') + eye.replace(/cy="52"/g, 'cy="56"') + h.r(36, 66, 8, 3, 1, '#F2B93A', 1).replace('/>', ' transform="rotate(10 36 66)"/>'); break;
      case 'nha-su':
        s = h.p('M28 100 L30 76 Q50 70 70 76 L72 100Z', '#E5853A', 1) + h.c(50, 54, 17, '#F6D7C0', 1) + h.c(50, 40, 2.6, '#E5484D', 1) + eye.replace(/cy="52"/g, 'cy="55"') + '<g>' + [0, 1, 2, 3, 4, 5, 6, 7].map(function (i) { return '<circle cx="' + (34 + i * 4.6) + '" cy="' + (80 + Math.abs(3.5 - i) * -1.4 + 4) + '" r="2.4" fill="#E5484D"/>'; }).join('') + '</g>'; break;
      case 'cuop-bien':
        s = h.p('M28 100 L30 76 Q50 70 70 76 L72 100Z', '#B8272D', 1) + h.r(46, 78, 8, 22, 1, '#F2B93A', 1) + h.c(50, 56, 15, '#8D5A3A', 1) + h.p('M36 66 Q50 82 64 66 Q64 76 50 78 Q36 76 36 66Z', '#3A2A20', 1) + h.c(43, 54, 2, INK, 1) + h.r(53, 50, 10, 8, 3, '#1E1E26', 1) + h.l('M30 40 L68 52', '#1E1E26', 1.6)
          + h.p('M12 34 Q20 14 50 18 Q80 14 88 34 Q70 38 50 36 Q30 38 12 34Z', '#1E1E26', 1) + '<circle cx="50" cy="26" r="6" fill="#fff"/><path d="M44 34 L56 34 L50 38Z" fill="#fff"/><circle cx="48" cy="25" r="1.6" fill="#1E1E26"/><circle cx="53" cy="25" r="1.6" fill="#1E1E26"/>'; break;
    }
    return s;
  }
  function badgeBack(id) { // bóng đổ dài chéo (vẽ trước nhân vật)
    return '<path d="M50 40 L140 130 L140 160 L30 160Z" fill="#000" opacity=".16"/>';
  }

  /* ─────────── Bộ 6: Nhà giả kim ─────────── */
  var ALCH = {
    'do': { n: 'Áo đỏ', cl: '#E85A3C', hat: 'hood', pot: '#E5484D' }, 'xanh-la': { n: 'Mũ nhọn xanh lá', cl: '#6FB05A', hat: 'cone', pot: '#6BD07A' }, 'xanh-duong': { n: 'Mũ nhọn xanh dương', cl: '#6FB8E8', hat: 'cone', pot: '#5AA6FF' },
    'tim': { n: 'Mũ tím', cl: '#8E5FC4', hat: 'cone', pot: '#B36BF0' }, 'kinh-bay': { n: 'Kính bay', cl: '#E8A33D', hat: 'goggle', pot: '#F2B93A' }, 'khan-quan': { n: 'Khăn quấn', cl: '#E0B070', hat: 'turban', pot: '#E58A3A' },
    'nau': { n: 'Áo nâu', cl: '#9A6A44', hat: 'hood', pot: '#8A5A2E' }, 'tai-meo': { n: 'Tai mèo', cl: '#EFA05A', hat: 'cat', pot: '#E58A3A' }, 'vuong-mien': { n: 'Vương miện', cl: '#E8A33D', hat: 'crown', pot: '#F2B93A' }
  };
  function alch(id) {
    var d = ALCH[id], h = mk(null), cl = d.cl, dk = shade(cl, -0.22), s = '', sk = '#F6D2B3';
    s += h.r(36, 76, 9, 14, 3, '#5A3B2A', 1) + h.r(55, 76, 9, 14, 3, '#5A3B2A', 1);
    s += h.p('M30 62 Q30 54 40 54 H60 Q70 54 70 62 L74 82 H26Z', cl, 1) + h.r(30, 70, 40, 5, 1, '#7A4A2E', 1) + h.r(46, 69, 8, 7, 2, '#F2B93A', 1);
    s += h.e(28, 66, 6, 9, dk, 16, 1) + h.e(72, 66, 6, 9, dk, -16, 1) + h.c(26, 76, 4.4, sk, 1) + h.c(74, 76, 4.4, sk, 1);
    // bình thuốc
    s += h.c(74, 70, 9, d.pot, 1).replace('/>', ' opacity=".95"/>') + h.r(71, 56, 6, 9, 2, '#EAF6FF', 1) + h.c(79, 58, 1.8, '#fff', 1) + '<circle cx="84" cy="52" r="2" fill="' + d.pot + '" opacity=".6"/><circle cx="80" cy="46" r="1.5" fill="' + d.pot + '" opacity=".5"/>';
    s += h.c(50, 40, 20, sk, 1);
    s += h.e(43, 44, 2.2, 3, INK, 0, 1) + h.e(57, 44, 2.2, 3, INK, 0, 1) + h.e(37, 50, 3.4, 2, '#F58C8C', 0, 1).replace('/>', ' opacity=".5"/>') + h.e(63, 50, 3.4, 2, '#F58C8C', 0, 1).replace('/>', ' opacity=".5"/>') + h.l('M46 52 q4 3 8 0', INK, 1.6);
    if (d.hat === 'cone') s += h.p('M24 38 Q50 26 76 38 Q50 44 24 38Z', shade(cl, -0.1), 1) + h.p('M30 36 L44 6 Q50 -2 56 6 L70 36Z', cl, 1) + h.r(33, 30, 34, 5, 1, '#F2B93A', 1);
    if (d.hat === 'hood') s += h.p('M26 50 C22 6 78 6 74 50 L68 52 C70 32 62 26 50 26 C38 26 30 32 32 52Z', cl, 1);
    if (d.hat === 'goggle') s += h.p('M26 40 C26 12 74 12 74 40 C68 28 32 28 26 40Z', cl, 1) + '<circle cx="40" cy="24" r="7" fill="#8FD4F0" stroke="#3A2E3F" stroke-width="1.8"/><circle cx="60" cy="24" r="7" fill="#8FD4F0" stroke="#3A2E3F" stroke-width="1.8"/><rect x="26" y="29" width="48" height="4" fill="#7A4A2E"/>';
    if (d.hat === 'turban') s += h.p('M28 36 C26 8 74 8 72 36 C62 30 38 30 28 36Z', cl, 1) + h.l('M32 26 Q50 16 68 26 M30 32 Q50 22 70 32', dk, 2) + h.c(50, 14, 4, '#E5484D', 1);
    if (d.hat === 'cat') s += h.p('M28 36 C26 10 74 10 72 36 C62 30 38 30 28 36Z', cl, 1) + h.p('M30 22 L28 4 L44 14Z M70 22 L72 4 L56 14Z', cl, 1) + h.p('M32 18 L31 9 L39 14Z M68 18 L69 9 L61 14Z', '#F7B6C4', 1);
    if (d.hat === 'crown') s += h.p('M32 24 L28 4 L40 14 L50 2 L60 14 L72 4 L68 24Z', '#F2B93A', 1) + h.p('M30 24 Q50 30 70 24 L70 30 Q50 36 30 30Z', cl, 1) + h.c(50, 12, 3, '#E5484D', 1);
    return s;
  }

  /* ─────────── Bộ 7–9: Nhân vật game viền đậm, quái vật Halloween, quái vật dễ thương ─────────── */
  function gamer(id) {
    var h = mk({ c: INK, w: 2.8 }), s = '';
    switch (id) {
      case 'cau-thu': s = chibi(h, { body: '#D83A3A', pants: '#F4F4F8', boots: '#2A2A38', skin: '#F5C9A0', face: faceDots(h, {}), bodyX: '<text x="50" y="72" text-anchor="middle" font-family="Arial Black,Arial" font-size="13" font-weight="900" fill="#fff" stroke="none">14</text>',
        front: h.p('M28 40 C26 10 74 10 72 40 L72 46 Q50 36 28 46Z', '#F4F4F8') + h.r(44, 14, 12, 4, 2, '#D83A3A') + h.r(28, 36, 5, 12, 2, '#9AA3B5'), prop: h.e(78, 74, 9, 6, '#8A4A2E', -30) + h.l('M72 74 L84 70', '#fff', 1.6) }); break;
      case 'mam-cay': s = chibi(h, { body: '#7ED04F', pants: '#5FB03B', boots: '#5FB03B', skin: '#8FD96A', arm: '#8FD96A', face: faceDots(h, { cheek: 0 }),
        bodyX: h.p('M50 62 q6 6 0 12 q-6 -6 0 -12Z', '#E8FBD8', 1), front: h.l('M50 17 Q50 8 50 6', INK, 2.8) + h.p('M50 8 Q36 -2 28 8 Q40 14 50 8Z', '#6BD07A') + h.p('M50 8 Q64 -2 72 8 Q60 14 50 8Z', '#6BD07A') }); break;
      case 'hoa-si': s = chibi(h, { body: '#7EC8F2', pants: '#F2D84A', boots: '#F2D84A', skin: '#F9E0CC', face: faceDots(h, { mouth: 'open', cheek: 0 }), bodyX: h.r(36, 56, 28, 6, 3, '#4A7FD8', 1).replace('/>', ' opacity="0"/>'),
        mid: h.c(50, 42, 5.5, '#E5484D') + h.p('M42 48 Q50 56 58 48 Q50 52 42 48Z', '#E5484D'),
        front: [[34, 24], [42, 18], [50, 15], [58, 18], [66, 24], [30, 34], [70, 34]].map(function (p) { return h.c(p[0], p[1], 8, '#F7D54A'); }).join('') + h.p('M42 44 Q50 52 58 44', 'none', 1) }); break;
      case 'ma': s = h.p('M20 92 L20 44 C20 12 80 12 80 44 L80 92 L70 82 L60 92 L50 82 L40 92 L30 82Z', '#F2F2F7') + h.e(36, 56, 5, 7, '#C9C9D6', 0, 1) + h.e(62, 70, 4, 5, '#C9C9D6', 0, 1) + h.e(40, 44, 4, 5, '#8A7F73') + h.e(60, 44, 4, 5, '#8A7F73') + h.e(50, 60, 5, 4, '#8A7F73') + h.l('M24 60 q-8 6 -4 14 M76 60 q8 6 4 14', INK, 2.4); break;
      case 'ma-ca-rong': s = chibi(h, { body: '#2A2A38', pants: '#2A2A38', skin: '#F6E9E4', face: faceDots(h, { mouth: 'none' }), back: h.p('M20 90 L34 50 L66 50 L80 90 Q50 80 20 90Z', '#C9323C'), bodyX: h.p('M40 56 L50 70 L60 56Z', '#F4F4F8', 1) + h.p('M48 70 L50 78 L52 70Z', '#C9323C'),
        mid: h.l('M44 49 Q50 54 56 49', INK, 1.8) + h.p('M45 49 l2 5 2 -5Z M51 49 l2 5 2 -5Z', '#fff'),
        front: h.p('M29 36 C26 12 74 12 71 36 C64 24 58 22 50 28 C42 22 36 24 29 36Z', '#2A2A38') }); break;
      case 'bi-ngo': s = chibi(h, { body: '#F29A3A', pants: '#E58A2A', boots: '#E58A2A', skin: '#F6A940', arm: '#F29A3A', face: '',
        bodyX: '', mid: '', front: '',
        prop: '' });
        s = h.r(38, 80, 9, 12, 3, '#E58A2A') + h.r(53, 80, 9, 12, 3, '#E58A2A') + h.p('M36 62 Q36 58 42 58 H58 Q64 58 64 62 V82 H36Z', '#F29A3A') + h.e(31, 70, 5, 8, '#F29A3A', 18) + h.e(69, 70, 5, 8, '#F29A3A', -18)
          + h.e(50, 38, 27, 24, '#F6A940') + h.l('M38 16 Q30 38 38 60 M50 14 Q46 38 50 62 M62 16 Q70 38 62 60', '#D9781F', 2) + h.p('M48 14 Q50 4 56 2 L54 12Z', '#7A9A3A') + h.p('M37 38 L42 30 L47 38Z M53 38 L58 30 L63 38Z', INK) + h.p('M40 48 L44 52 L50 48 L56 52 L60 48 L58 56 Q50 58 42 56Z', INK); break;
      case 'cuop-bien-nhi': s = chibi(h, { body: '#F4F4F8', pants: '#3A3A4A', skin: '#F5C9A0', face: faceDots(h, { eyes: 'angry', mouth: 'frown' }), bodyX: h.r(36, 62, 28, 4, 0, '#D83A3A', 1) + h.r(36, 70, 28, 4, 0, '#D83A3A', 1),
        front: h.p('M28 36 C26 14 74 14 72 36 C62 26 38 26 28 36Z', '#6B3E1E') + h.p('M28 30 C28 16 72 16 72 30 L72 34 C62 26 38 26 28 34Z', '#D83A3A') + h.p('M70 30 L84 22 L80 38Z', '#D83A3A') + h.c(40, 24, 3.4, '#fff', 1),
        prop: h.l('M78 50 L90 84', '#8A5A2E', 4) + h.r(72, 62, 14, 4, 1, '#8A5A2E').replace('/>', ' transform="rotate(-20 79 64)"/>') }); break;
      case 'be-di-hoc': s = chibi(h, { body: '#7EC8F2', pants: '#4A63B0', boots: '#2A2A38', skin: '#F5C9A0', face: faceDots(h, {}), back: h.r(26, 58, 48, 24, 8, '#F2B93A'),
        front: h.p('M28 38 C24 10 76 10 72 38 C66 22 56 20 48 22 C40 18 34 26 28 38Z', '#6B3E1E') + h.l('M44 22 q6 -8 12 -2', '#6B3E1E', 2.8) }); break;
      case 'ong-cau-ca': s = chibi(h, { body: '#4F9AA8', pants: '#E2A93B', boots: '#8A5A2E', skin: '#F5C9A0', face: faceDots(h, { cheek: 0 }),
        mid: h.p('M30 44 C30 66 70 66 70 44 C64 54 36 54 30 44Z', '#B4602E') + h.l('M44 55 q6 3 12 0', INK, 1.8), bodyX: h.r(40, 66, 20, 10, 2, '#E2A93B', 1),
        front: h.p('M28 36 C26 12 74 12 72 36 C64 26 36 26 28 36Z', '#B4602E'), prop: h.l('M78 80 L92 28', '#8A5A2E', 2.6) + h.l('M92 28 Q96 40 88 60', '#6E6E7E', 1.2) + h.c(88, 62, 2, '#fff', 1) }); break;
      case 'quai-gai': s = chibi(h, { body: '#2F3A4F', pants: '#2F3A4F', boots: '#1E2430', skin: '#52707F', arm: '#52707F', face: faceDots(h, { eyes: 'angry', mouth: 'none', cheek: 0, c: '#CDEFF5' }),
        mid: h.l('M43 50 h14', '#CDEFF5', 2),
        front: h.p('M30 24 L26 8 L38 18 L44 4 L50 16 L56 4 L62 18 L74 8 L70 24Z', '#52707F') }); break;
    }
    return s;
  }
  function hwm(id) {
    var h = mk({ c: INK, w: 2.6 }), s = '';
    switch (id) {
      case 'frankenstein': s = chibi(h, { body: '#2E2E3A', pants: '#2E2E3A', skin: '#7ED04F', arm: '#2E2E3A', face: faceDots(h, { cheek: 0, mouth: 'none' }), bodyX: h.p('M44 56 L50 70 L56 56Z', '#F4F4F8', 1),
        mid: h.l('M43 50 h14', INK, 2), front: h.p('M29 30 C28 12 72 12 71 30 L71 24 L29 24Z', '#24242E') + h.r(24, 36, 6, 8, 2, '#9AA3B5') + h.r(70, 36, 6, 8, 2, '#9AA3B5') + h.l('M44 26 l2 -4 l2 4 M52 26 l2 -4 l2 4', '#7ED04F', 1.4) }); break;
      case 'soi': s = chibi(h, { body: '#7A8A4A', pants: '#4B3A2A', skin: '#C77A32', arm: '#C77A32', face: faceDots(h, { cheek: 0, mouth: 'none', c: '#2A1A10' }),
        mid: h.e(50, 50, 8, 6, '#F4D9B0') + h.e(50, 47, 3.2, 2.2, INK, 0, 1) + h.l('M45 53 q5 3 10 0', INK, 1.6),
        front: h.p('M30 30 L26 6 L42 20Z M70 30 L74 6 L58 20Z', '#C77A32') + h.p('M33 24 L31 12 L39 20Z M67 24 L69 12 L61 20Z', '#F29AA8', 1) + h.p('M28 30 C28 14 72 14 72 30 C62 22 38 22 28 30Z', '#B4602E') }); break;
      case 'xac-uop': s = chibi(h, { body: '#E8DFC8', pants: '#E8DFC8', boots: '#E8DFC8', skin: '#E8DFC8', arm: '#E8DFC8', face: '', bodyX: h.l('M38 62 H62 M38 68 H62 M38 74 H62', INK, 1.6),
        mid: h.r(32, 32, 36, 14, 6, '#2A2A38', 1) + h.c(42, 39, 3, '#F4F4F8', 1) + h.c(58, 39, 3, '#F4F4F8', 1), front: h.l('M32 22 L68 28 M30 30 L70 22 M34 50 L66 52 M32 46 L68 44', INK, 2) + h.p('M28 46 L72 46 L70 52 L30 52Z', '#E8DFC8', 1).replace('/>', ' opacity="0"/>') }); break;
      case 'zombie': s = chibi(h, { body: '#7B5CC4', pants: '#4B4B5A', boots: '#2A2A38', skin: '#8FD96A', arm: '#8FD96A', face: faceDots(h, { cheek: 0, mouth: 'open' }),
        mid: h.l('M36 32 l6 2 M60 32 l6 -2', INK, 1.6), front: h.p('M28 28 C26 12 74 12 72 28 C60 20 40 20 28 28Z', '#4A4A5A') + h.c(36, 18, 5.5, '#E56B8A') + h.p('M30 36 L34 40', 'none', 1), prop: '' }); break;
      case 'ma-ca-rong': s = chibi(h, { body: '#7B4FC2', pants: '#2A2A38', skin: '#F6E9E4', arm: '#7B4FC2', face: faceDots(h, { mouth: 'none' }), back: h.p('M18 86 L32 50 L68 50 L82 86 Q50 74 18 86Z', '#C9323C'),
        mid: h.l('M44 49 Q50 54 56 49', INK, 1.8) + h.p('M45 49 l2 5 2 -5Z M51 49 l2 5 2 -5Z', '#fff'), front: h.p('M28 34 C26 10 74 10 72 34 C64 22 58 20 50 26 C42 20 36 22 28 34Z', '#2A2A38') }); break;
      case 'than-chet': s = h.p('M22 92 L28 50 C24 14 76 14 72 50 L78 92Z', '#6B3FA0') + h.c(50, 42, 16, '#F4F1E8') + h.e(44, 40, 3.4, 4.4, INK, 0, 1) + h.e(56, 40, 3.4, 4.4, INK, 0, 1) + h.p('M48 46 L50 50 L52 46Z', INK, 1) + h.l('M44 53 h12 M46 53 v3 M50 53 v3 M54 53 v3', INK, 1.6) + h.r(80, 14, 3, 80, 1, '#8A5A2E') + h.p('M82 14 Q64 6 62 22 Q70 14 82 22Z', '#C9CFD9') + h.p('M24 30 C26 10 74 10 76 30 C66 22 34 22 24 30Z', '#6B3FA0', 1).replace('/>', ' opacity="0"/>'); break;
      case 'ma-gian': s = h.p('M20 92 L20 44 C20 12 80 12 80 44 L80 92 L70 82 L60 92 L50 82 L40 92 L30 82Z', '#F4F4FA') + h.p('M36 40 L46 44 L36 50Z M64 40 L54 44 L64 50Z', INK, 1) + h.l('M34 36 L46 42 M66 36 L54 42', INK, 2.4) + h.p('M38 58 L42 54 L46 58 L50 54 L54 58 L58 54 L62 58 Q50 70 38 58Z', INK) + h.p('M22 62 Q8 66 10 78 Q18 70 24 70Z M78 62 Q92 66 90 78 Q82 70 76 70Z', '#F4F4FA'); break;
      case 'bo-xuong': s = chibi(h, { body: '#E9E6DA', pants: '#E9E6DA', boots: '#D6D2C2', skin: '#F4F1E8', arm: '#F4F1E8', face: faceDots(h, { eyes: 'hollow', mouth: 'none', cheek: 0 }),
        bodyX: h.l('M42 62 H58 M42 67 H58 M42 72 H58 M50 58 V78', '#8A8676', 1.6), mid: h.p('M48 46 L50 50 L52 46Z', INK, 1) + h.l('M42 56 h16 M45 56 v4 M50 56 v4 M55 56 v4', INK, 1.6), front: h.p('M47 16 Q50 8 56 10 Q54 14 52 18Z', '#7ED04F') }); break;
    }
    return s;
  }
  function cutem(id) {
    var h = mk({ c: INK, w: 2.2 }), s = '';
    switch (id) {
      case 'ma-no': s = h.p('M22 90 L22 44 C22 14 78 14 78 44 L78 90 L68 80 L58 90 L50 80 L42 90 L32 80Z', '#fff') + h.l('M38 46 q4 -5 8 0 M54 46 q4 -5 8 0', INK, 2.2) + h.l('M42 54 Q50 62 58 54', INK, 2.2) + h.p('M40 70 L50 66 L60 70 L50 74Z', '#8E5FC4') + h.e(34, 54, 4, 2.6, '#F7B6C4', 0, 1) + h.e(66, 54, 4, 2.6, '#F7B6C4', 0, 1); break;
      case 'ma-ca-rong': s = chibi(h, { body: '#7B4FC2', pants: '#2A2A38', skin: '#FBD8BF', arm: '#7B4FC2', face: faceDots(h, { mouth: 'none' }), back: h.p('M16 88 L32 50 L68 50 L84 88 Q50 76 16 88Z', '#E5622A'),
        mid: h.p('M44 49 Q50 55 56 49 L54 55 L50 52 L46 55Z', '#fff'), front: h.p('M30 32 C28 12 72 12 70 32 C62 22 56 20 50 26 C44 20 38 22 30 32Z', '#2A2A38') }); break;
      case 'zombie': s = chibi(h, { body: '#7B4FC2', pants: '#4B8F4B', skin: '#8FD96A', arm: '#8FD96A', face: faceDots(h, { mouth: 'open', eyes: 'happy' }), front: h.p('M28 32 C26 12 74 12 72 32 C62 22 38 22 28 32Z', '#3D5A3A'), prop: h.l('M78 66 l6 -8 M82 58 l4 -4', INK, 1.6) }); break;
      case 'frankenstein': s = chibi(h, { body: '#7B4FC2', pants: '#E5822A', skin: '#7ED04F', arm: '#7ED04F', face: faceDots(h, { eyes: 'happy' }), front: h.p('M29 32 C28 12 72 12 71 32 L71 26 L29 26Z', '#24242E') + h.r(22, 38, 6, 8, 2, '#9AA3B5') + h.r(72, 38, 6, 8, 2, '#9AA3B5') }); break;
      case 'xac-uop': s = chibi(h, { body: '#F4F1E6', pants: '#F4F1E6', boots: '#F4F1E6', skin: '#F4F1E6', arm: '#F4F1E6', face: '', bodyX: h.l('M38 62 H62 M38 68 H62 M38 74 H62', INK, 1.6),
        mid: h.r(32, 32, 36, 14, 6, '#2A2A38', 1) + h.c(42, 39, 3.2, '#fff', 1) + h.c(58, 39, 3.2, '#fff', 1) + h.l('M36 24 L64 30 M34 50 L66 52', INK, 2), prop: h.c(80, 62, 5, '#E5622A') + h.l('M80 67 L80 78', INK, 2) }); break;
      case 'soi': s = chibi(h, { body: '#6FB05A', pants: '#E5622A', skin: '#F29A3A', arm: '#F29A3A', face: faceDots(h, { eyes: 'happy', mouth: 'open' }),
        mid: h.e(50, 49, 8, 5, '#FBE3C0', 0, 1) + h.e(50, 46, 3, 2, INK, 0, 1), front: h.p('M30 30 L26 6 L42 20Z M70 30 L74 6 L58 20Z', '#F29A3A') + h.p('M33 24 L31 12 L39 20Z M67 24 L69 12 L61 20Z', '#F7B6C4', 1) + h.p('M28 30 C28 14 72 14 72 30 C62 22 38 22 28 30Z', '#E5622A') }); break;
      case 'quy-nho': s = chibi(h, { body: '#E5622A', pants: '#E5622A', boots: '#C9441A', skin: '#F2793A', arm: '#F2793A', face: faceDots(h, { eyes: 'angry', mouth: 'none', cheek: 0, c: INK }), back: h.l('M60 80 Q84 76 84 92 Q88 96 92 94', INK, 2.2),
        mid: h.p('M42 50 Q50 57 58 50 L56 54 L50 52 L44 54Z', '#fff'), front: h.p('M32 26 L26 6 L42 20Z M68 26 L74 6 L58 20Z', '#8E5FC4'), prop: h.r(18, 52, 3, 40, 1, '#6E6E7E') + h.p('M14 50 L18 38 L19.5 48 L21 38 L25 50Z', '#6E6E7E', 1) }); break;
      case 'bo-xuong': s = chibi(h, { body: '#F4F4F8', pants: '#F4F4F8', boots: '#F4F4F8', skin: '#fff', arm: '#fff', face: faceDots(h, { eyes: 'hollow', mouth: 'none', cheek: 0 }), bodyX: h.l('M42 62 H58 M42 67 H58 M42 72 H58 M50 58 V78', INK, 1.6),
        mid: h.p('M48 46 L50 50 L52 46Z', INK, 1) + h.l('M42 56 h16', INK, 1.6), front: h.p('M42 66 L50 70 L58 66 L50 64Z', '#8E5FC4', 1) }); break;
      case 'mat-than': s = h.e(50, 50, 40, 36, '#fff') + h.c(50, 50, 24, '#7ED04F') + h.c(50, 50, 12, INK) + h.c(45, 45, 4, '#fff', 1) + h.p('M12 40 Q50 8 88 40 Q50 24 12 40Z', '#8E5FC4') + h.p('M12 60 Q50 92 88 60 Q50 76 12 60Z', '#E5822A'); break;
    }
    return s;
  }
  function shade(hx, f) { var a = [1, 3, 5].map(function (i) { return parseInt(hx.substr(i, 2), 16); }), t = f < 0 ? 0 : 255, k = Math.abs(f); return '#' + a.map(function (v) { v = Math.round(v + (t - v) * k); return (v < 16 ? '0' : '') + v.toString(16); }).join(''); }

  /* ─────────── Danh mục các bộ ─────────── */
  var SETS = [
    { id: 'elder', name: 'Ông bà vui vẻ', sub: 'Chân dung phẳng, tông màu dịu', kind: 'tile', chars: [['ong-kinh', 'Ông kính chữ nhật'], ['ong-hoi-rau', 'Ông hói râu trắng'], ['ba-xoan', 'Bà tóc xoăn'], ['ba-kinh-meo', 'Bà kính mắt mèo'], ['ba-nham-mat', 'Bà cười nhắm mắt'], ['ong-ria-mep', 'Ông ria mép'], ['ba-dai', 'Bà tóc dài'], ['ong-kinh-xanh', 'Ông râu kính xanh'], ['ba-bui', 'Bà tóc búi'], ['ong-toc-bong', 'Ông tóc bồng']], draw: elder, bg: function (i) { return ELDER_BG[i]; }, crop: '0 0 100 100' },
    { id: 'pxjob', name: 'Nghề nghiệp pixel', sub: 'Pixel viền đen, nhiều nghề', kind: 'pixel', chars: Object.keys(PXJ).map(function (k) { return [k, PXJ[k].n]; }), draw: pixelJob, bgc: '#F7F3E3', crop: '0 0 100 100' },
    { id: 'pxchibi', name: 'Pixel chibi mắt to', sub: 'Khuôn mặt anime pixel', kind: 'pixel', chars: Object.keys(PXC).map(function (k) { return [k, PXC[k].n]; }), draw: pixelChibi, bgc: '#FBEFEF', crop: '0 0 100 100' },
    { id: 'rpg', name: 'Anh hùng RPG', sub: 'Chiến binh, pháp sư, xạ thủ…', kind: 'full', chars: [['chien-binh', 'Chiến binh'], ['phap-su', 'Pháp sư'], ['cung-thu', 'Cung thủ'], ['thay-thuoc', 'Thầy thuốc'], ['viking', 'Viking'], ['bo-xuong', 'Bộ xương'], ['orc', 'Orc'], ['ke-trom', 'Kẻ trộm']], draw: rpg, bgc: '#3C2F3F', crop: '8 4 84 84' },
    { id: 'badge', name: 'Huy hiệu bóng dài', sub: 'Biểu tượng tròn, bóng đổ chéo', kind: 'badge', chars: Object.keys(BADGE).map(function (k) { return [k, BADGE[k].n]; }), draw: badge, bg: function (i, id) { return BADGE[id].bg; }, crop: '0 0 100 100' },
    { id: 'alch', name: 'Nhà giả kim', sub: 'Chibi cầm bình thuốc', kind: 'full', chars: Object.keys(ALCH).map(function (k) { return [k, ALCH[k].n]; }), draw: alch, bgc: '#FFF4E6', crop: '6 2 88 88' },
    { id: 'gamer', name: 'Bạn game viền đậm', sub: 'Nhân vật trò chơi nét đậm', kind: 'full', chars: [['cau-thu', 'Cầu thủ'], ['mam-cay', 'Bé mầm cây'], ['hoa-si', 'Chú hề'], ['ma', 'Bạn ma'], ['ma-ca-rong', 'Ma cà rồng'], ['bi-ngo', 'Bí ngô'], ['cuop-bien-nhi', 'Cướp biển nhí'], ['be-di-hoc', 'Bé đi học'], ['ong-cau-ca', 'Bác câu cá'], ['quai-gai', 'Quái gai']], draw: gamer, bgc: '#F4F7FF', crop: '8 4 84 84' },
    { id: 'hwm', name: 'Quái vật Halloween', sub: 'Frankenstein, người sói, xác ướp…', kind: 'full', chars: [['frankenstein', 'Frankenstein'], ['soi', 'Người sói'], ['xac-uop', 'Xác ướp'], ['zombie', 'Zombie'], ['ma-ca-rong', 'Ma cà rồng'], ['than-chet', 'Thần chết'], ['ma-gian', 'Ma giận dữ'], ['bo-xuong', 'Bộ xương']], draw: hwm, bgc: '#2F2840', crop: '8 4 84 84' },
    { id: 'cutem', name: 'Quái vật dễ thương', sub: 'Quái vật tí hon vui nhộn', kind: 'full', chars: [['ma-no', 'Ma nơ tím'], ['ma-ca-rong', 'Ma cà rồng nhí'], ['zombie', 'Zombie vẫy tay'], ['frankenstein', 'Frankenstein cười'], ['xac-uop', 'Xác ướp'], ['soi', 'Người sói'], ['quy-nho', 'Quỷ nhỏ'], ['bo-xuong', 'Bộ xương nhảy'], ['mat-than', 'Mắt thần']], draw: cutem, bgc: '#FFF7EE', crop: '8 4 84 84' }
  ];
  var BYSET = {}; SETS.forEach(function (s) { BYSET[s.id] = s; s.chars = s.chars.map(function (c) { return { id: c[0], name: c[1] }; }); });

  function find(setId, charId) { var s = BYSET[setId]; if (!s) return null; for (var i = 0; i < s.chars.length; i++) if (s.chars[i].id === charId) return { set: s, ch: s.chars[i], i: i }; return null; }
  function defaultBg(set, i, id) { return set.bg ? set.bg(i, id) : set.bgc; }
  var UID = 0;
  // SVG sticker/nhân vật nguyên khung (nền trong suốt cho bộ toàn thân, có ô nền cho bộ chân dung)
  function svg(setId, charId, o) {
    o = o || {}; var f = find(setId, charId); if (!f) return '';
    var inner = f.set.draw(charId), size = o.size || 96, vb = o.crop ? f.set.crop : '0 0 100 100', bg = o.bg || (o.withBg === false ? null : null);
    var body = (f.set.kind === 'badge' ? '<circle cx="50" cy="50" r="50" fill="' + (o.bg || defaultBg(f.set, f.i, charId)) + '"/><g clip-path="url(#fgc' + (++UID) + ')">' + badgeBack() + inner + '</g><defs><clipPath id="fgc' + UID + '"><circle cx="50" cy="50" r="50"/></clipPath></defs>' : inner);
    if (f.set.kind === 'tile' && o.withBg !== false) body = '<rect width="100" height="100" fill="' + (o.bg || defaultBg(f.set, f.i, charId)) + '"/>' + inner;
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" width="' + size + '" height="' + size + '" role="img" aria-label="' + (o.label || f.ch.name) + '">' + body + '</svg>';
  }
  // Avatar vuông/tròn có nền (cfg: fs = bộ, fc = nhân vật, fo = 1 nếu tự chọn màu nền bgc)
  function avatar(cfg, size, shape, cls, label) {
    var f = find(cfg.fs, cfg.fc); if (!f) return '';
    var uid = 'fa' + (++UID), rad = shape === 'circle' ? 100 : shape === 'round' ? 40 : 0, bg = cfg.fo === 1 ? cfg.bgc : defaultBg(f.set, f.i, cfg.fc), inner = f.set.draw(cfg.fc), vb = f.set.crop;
    var content = f.set.kind === 'badge' ? badgeBack() + inner : inner;
    // Với bộ badge dùng nền riêng; viewBox con 100×100 được co về 200×200
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="' + size + '" height="' + size + '"' + (cls || '') + ' role="img" aria-label="' + (label || f.ch.name) + '"><defs><clipPath id="' + uid + 'c"><rect width="200" height="200" rx="' + rad + '"/></clipPath></defs><g clip-path="url(#' + uid + 'c)"><rect width="200" height="200" fill="' + bg + '"/><svg x="0" y="0" width="200" height="200" viewBox="' + vb + '" preserveAspectRatio="xMidYMid slice">' + content + '</svg></g></svg>';
  }

  var API = { SETS: SETS, find: find, svg: svg, avatar: avatar, defaultBg: defaultBg };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTFigures = API;
})(typeof window !== 'undefined' ? window : this);
