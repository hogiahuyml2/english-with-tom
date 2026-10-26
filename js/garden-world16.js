/* EWT Garden — 6 NÔNG TRẠI mới (cảnh dựng sẵn): Nhật Bản, Trung Quốc, Brazil, Ý, Ấn Độ, Thái Lan.
   Mỗi nông trại: công trình biểu tượng (3×3), cảnh canh tác (2×2), cột cờ chuẩn (1×1; Brazil dùng bao cà phê vì chưa dùng cờ) và một vật phẩm (1×1).
   Đây là tranh phẳng cho chế độ Phẳng; chế độ 2.5D dùng khối đặc trong garden-lm.js. Nạp SAU garden-world15.js. */
(function (root) {
  'use strict';
  var API = root.EWTGardenWorld, FL = root.EWTFlags; if (!API || !API.H || !FL) return;
  var ART = API.ART, THEME = API.THEME, DTH = API.DTH, H = API.H;
  var T = H.T, shadow = H.shadow, circ = H.circ, ell = H.ell, rect = H.rect, poly = H.poly, path = H.path, scatter = H.scatter, f0 = H.f0, flagPole = H.flagPole;
  function tuft(c1, c2) { return function (R, W, H2) { return scatter(R, W, H2, 26, function (x, y, r, i) { return '<path d="M' + f0(x) + ' ' + f0(y) + 'q4 -9 8 0q4 -9 8 0" stroke="' + (i % 2 ? c1 : c2) + '" stroke-width="2.6" fill="none" stroke-linecap="round"/>'; }); }; }
  function zone(id, g1, g2, c1, c2, dth) { THEME[id] = { g1: g1, g2: g2, ground: tuft(c1, c2) }; DTH[id] = dth; }
  function win(x, y, w, h) { return rect(x, y, w, h, '#CFE8F5', '#6A8AA0', 2) + path('M' + (x + w / 2) + ' ' + y + 'v' + h + 'M' + x + ' ' + (y + h / 2) + 'h' + w, '', '#6A8AA0', 1.6); }
  function tree(x, y, s, c1, c2) { return rect(x - 4 * s, y - 6 * s, 8 * s, 36 * s, '#8A5A2E') + circ(x, y - 18 * s, 22 * s, c1) + circ(x - 14 * s, y - 8 * s, 14 * s, c2) + circ(x + 15 * s, y - 6 * s, 14 * s, c2); }
  var DT = function (leaf, bush, rock) { return { leaf: leaf, bush: bush, rock: rock || ['#9AA3AE', '#B9C1CB'], post: '#C9A66A', rail: '#B8873A' }; };

  // nhà: kiểu M = minka mái tranh · T = nhà sân vườn ngói · H = nhà trại có hiên · S = nhà sàn trên nước · V = biệt thự đá · U = nhà đất làng quê
  function house(wall, roof, kind) {
    return function (b) {
      var s = '', i;
      if (kind === 'S') {
        s += rect(0, 252, 300, 38, '#5BA8D8', '#2E7FB0') + path('M10 266q30 -8 60 0t60 0t60 0t60 0', '', 'rgba(255,255,255,.5)', 3);
        for (i = 0; i < 4; i++) s += rect(80 + i * 46, 170, 9, 92, '#6A4A2A');
        s += rect(70, 110, 160, 66, wall, '#6A4A2A', 3) + win(86, 124, 26, 28) + win(188, 124, 26, 28) + rect(130, 128, 40, 48, '#5A3A1E', '', 3) + poly('50,114 150,44 250,114 236,118 150,62 64,118', roof, '#5A3A1A', 3) + path('M70 176h160', '', '#6A4A2A', 6);
      } else if (kind === 'T') {
        s += rect(24, 150, 252, 100, wall, '#8A7A6A', 3) + poly('4,156 36,120 264,120 296,156', roof, '#5A6470', 3) + poly('40,120 80,86 220,86 260,120', sh2(roof), '#5A6470', 3) + rect(130, 176, 40, 74, '#B8402F', '#6A2A1A', 3) + win(52, 176, 34, 34) + win(214, 176, 34, 34) + path('M4 156q30 -8 60 0M236 156q30 -8 60 0', '', '#5A6470', 3);
      } else if (kind === 'H') {
        s += rect(20, 140, 260, 112, wall, '#9A7A2A', 3) + poly('4,146 150,70 296,146', roof, '#7A2A1A', 3) + rect(20, 226, 260, 10, '#C9A06A') + win(44, 164, 28, 36) + win(116, 164, 28, 36) + win(190, 164, 28, 36) + rect(236, 168, 34, 70, '#5A3A1E', '', 3);
        for (i = 0; i < 6; i++) s += rect(28 + i * 46, 200, 8, 52, '#F2E8D0');
      } else if (kind === 'V') {
        s += rect(24, 130, 250, 122, wall, '#9A8A6A', 3) + poly('8,136 150,72 292,136', roof, '#7A3A1A', 3) + rect(214, 80, 56, 62, wall, '#9A8A6A', 3) + poly('206,84 242,52 278,84', roof, '#7A3A1A', 3) + win(48, 160, 28, 40) + win(100, 160, 28, 40) + win(172, 160, 28, 40) + rect(130, 196, 36, 56, '#5A3A1E', '', 3);
        s += path('M290 252Q282 180 290 120Q298 180 290 252Z', '#2E6A3A', '#1A4A28', 2) + path('M262 252Q254 190 262 140Q270 190 262 252Z', '#2E6A3A', '#1A4A28', 2);
      } else if (kind === 'U') {
        s += rect(40, 150, 220, 100, wall, '#8A5A3A', 3) + poly('20,156 150,76 280,156', roof, '#8A6A2A', 3) + rect(128, 186, 44, 64, '#5A3A1E', '', 3) + circ(70, 190, 12, '#F2842E') + circ(230, 190, 12, '#F2842E') + rect(48, 226, 204, 10, '#B8885A');
      } else {   // M minka
        for (i = 0; i < 3; i++) s += path('M' + (i * 8) + ' ' + (200 + i * 24) + 'Q150 ' + (180 + i * 24) + ' ' + (300 - i * 8) + ' ' + (200 + i * 24) + 'V' + (216 + i * 24) + 'H' + (i * 8) + 'Z', i % 2 ? '#C8D860' : '#8CC84A', '#5E9A2E', 2);
        s += rect(70, 120, 160, 90, wall, '#8A7A5A', 3) + poly('40,128 150,34 260,128 244,132 150,56 56,132', roof, '#7A5A1A', 3) + path('M70 132L150 56L230 132', '', 'rgba(110,70,20,.4)', 3) + win(88, 148, 28, 34) + win(184, 148, 28, 34) + rect(130, 150, 40, 60, '#4A3A2A', '', 3);
      }
      return T(b.x * 100, b.y * 100, shadow(150, 292, 140, 7) + s);
    };
  }
  function sh2(c) { return c; }
  // cảnh canh tác / mặt nước 2×2
  function big(kind, c) {
    return function (b) {
      var s = '', i, j;
      if (kind === 'pond') {
        s += ell(100, 120, 92, 56, '#C9B88A', '#8A7A5A') + ell(100, 120, 80, 46, c, '#3E7FA0') + path('M40 112q20 -8 40 0t40 0', '', 'rgba(255,255,255,.5)', 3) + ell(80, 118, 14, 6, '#F2842E') + ell(122, 130, 12, 5, '#FFFFFF') + ell(104, 108, 10, 4, '#E5334B') + circ(40, 90, 10, '#9AA3AE') + circ(168, 96, 9, '#9AA3AE');
        s += rect(150, 60, 6, 40, '#9AA3AE') + rect(142, 52, 22, 10, '#B8B0A0');
      } else if (kind === 'tea') {
        for (i = 0; i < 4; i++) s += path('M' + (6 + i * 6) + ' ' + (60 + i * 36) + 'Q100 ' + (44 + i * 36) + ' ' + (194 - i * 6) + ' ' + (60 + i * 36) + 'V' + (84 + i * 36) + 'H' + (6 + i * 6) + 'Z', '#5FA04A', '#3F7A32', 2);
        for (i = 0; i < 4; i++) for (j = 0; j < 7; j++) s += circ(24 + i * 6 + j * 22, 70 + i * 36, 8, i % 2 ? '#7AC25A' : '#4F9A3A');
        s += rect(150, 30, 6, 30, '#8A5A2E') + poly('136,34 153,16 170,34', '#C9503C');
      } else if (kind === 'coffee') {
        s += rect(10, 50, 180, 130, '#8A5A3A', '#5A3A1E', 4);
        for (i = 0; i < 3; i++) for (j = 0; j < 6; j++) s += circ(26 + j * 28, 78 + i * 38, 11, '#2E7A3A') + circ(24 + j * 28, 74 + i * 38, 3, '#E5334B') + circ(30 + j * 28, 80 + i * 38, 3, '#E5334B');
        s += rect(150, 130, 24, 28, '#C9A66A', '#6A4A2E', 3) + rect(170, 138, 22, 22, '#C9A66A', '#6A4A2E', 3);
      } else if (kind === 'vine') {
        s += rect(10, 50, 180, 130, '#B8D880', '#6A9A3A', 4);
        for (i = 0; i < 4; i++) { s += path('M18 ' + (68 + i * 30) + 'H182', '', '#8A5A2E', 3); for (j = 0; j < 8; j++) s += circ(26 + j * 22, 62 + i * 30, 8, j % 2 ? '#5A9A3A' : '#7AB24A') + circ(26 + j * 22, 74 + i * 30, 4, '#8A3A9A'); }
      } else if (kind === 'wheat') {
        s += rect(10, 50, 180, 130, '#E8C75A', '#9A7A2A', 4);
        for (i = 0; i < 5; i++) for (j = 0; j < 12; j++) s += path('M' + (20 + j * 14) + ' ' + (80 + i * 22) + 'v-18', '', '#C98A1A', 3) + circ(20 + j * 14, 60 + i * 22, 3.4, '#F2C94C');
        s += rect(150, 20, 8, 30, '#9A7A3A') + rect(140, 14, 28, 8, '#9A7A3A');
      } else {   // chợ nổi
        s += rect(0, 40, 200, 150, c, '#2E8FB0') + path('M10 60q20 -8 40 0t40 0t40 0t40 0', '', 'rgba(255,255,255,.5)', 3);
        [[20, 100], [100, 140]].forEach(function (q, k) { s += poly((q[0]) + ',' + q[1] + ' ' + (q[0] + 76) + ',' + q[1] + ' ' + (q[0] + 66) + ',' + (q[1] + 24) + ' ' + (q[0] + 10) + ',' + (q[1] + 24), '#C9503C', '#6A2A1A', 2) + poly((q[0] + 14) + ',' + (q[1] - 2) + ' ' + (q[0] + 38) + ',' + (q[1] - 30) + ' ' + (q[0] + 62) + ',' + (q[1] - 2), k ? '#F2C94C' : '#E5334B', '#6A2A1A', 2) + circ(q[0] + 22, q[1] - 8, 8, '#F2842E') + circ(q[0] + 40, q[1] - 10, 8, '#F2D84A') + circ(q[0] + 56, q[1] - 8, 8, '#E5334B'); });
      }
      return T(b.x * 100, b.y * 100, shadow(100, 190, 90, 6) + s);
    };
  }
  function icon(kind) {
    return function (b) {
      var s = shadow(50, 90, 28, 5);
      if (kind === 'onigiri') s += poly('50,34 82,80 18,80', '#FFFFFF', '#B8B0A0', 3) + rect(36, 62, 28, 18, '#1A1A22', '', 2) + circ(50, 54, 2.4, '#C9B88A');
      else if (kind === 'teapot') s += ell(50, 66, 28, 20, '#C9503C', '#7A2A1A') + rect(40, 40, 20, 8, '#C9503C', '#7A2A1A', 3) + circ(50, 38, 4, '#F2C94C') + path('M76 62q16 -4 10 -22', '', '#7A2A1A', 5) + path('M24 62q-14 0 -12 -14', '', '#7A2A1A', 4);
      else if (kind === 'coffee') s += rect(30, 52, 40, 30, '#F6F0E4', '#9A8A6A', 6) + path('M70 58q16 0 14 12q-2 8 -14 8', '', '#9A8A6A', 4) + ell(50, 54, 20, 5, '#5A3A1E') + path('M42 44q-4 -8 2 -12M54 44q-4 -8 2 -12', '', 'rgba(255,255,255,.7)', 3);
      else if (kind === 'sack') s += path('M26 82Q20 54 34 42Q50 34 66 42Q80 54 74 82Z', '#C9A66A', '#6A4A2E', 3) + path('M36 42q14 -8 28 0', '', '#6A4A2E', 3) + circ(50, 64, 8, '#8A5A3A');
      else if (kind === 'oil') s += rect(38, 44, 24, 38, '#8A9A3A', '#4A5A1A', 6) + rect(44, 30, 12, 16, '#8A9A3A', '#4A5A1A', 3) + circ(50, 28, 4, '#6A4A2A') + ell(50, 66, 8, 4, '#F2E48A');
      else if (kind === 'milk') s += path('M30 52h40l-6 30H36Z', '#C9D0D9', '#6A7A88', 3) + ell(50, 52, 20, 5, '#F6F6F6', '#6A7A88') + path('M32 62h36', '', '#8A94A8', 2);
      else s += ell(50, 66, 22, 18, '#F2A32C', '#B8701A') + path('M50 48q10 -10 20 -6', '', '#4FAE62', 4) + ell(44, 60, 6, 3, 'rgba(255,255,255,.5)');
      return T(b.x * 100, b.y * 100, s);
    };
  }
  function farm(id, pre, theme, dth, hs, bg, itemKind, third, item2Kind) {
    zone(id, theme[0], theme[1], theme[2], theme[3], dth);
    ART[pre + '_house'] = house(hs[0], hs[1], hs[2]);
    ART[pre + '_big'] = big(bg[0], bg[1]);
    if (third) ART[pre + '_flag'] = flagPole(third); else ART[pre + '_item2'] = icon(item2Kind);
    ART[pre + '_item'] = icon(itemKind);
  }
  farm('farmjp', 'fjp', ['#B6E08A', '#9CD070', 'rgba(70,140,60,.5)', 'rgba(240,170,200,.5)'], DT(['#4FB04A', '#7FD36B', '#FFB6D0'], ['#3C9A44', '#5DBE55']), ['#F2E8D0', '#C9A55A', 'M'], ['pond', '#6FB8D8'], 'onigiri', 'jp');
  farm('farmcn', 'fcn', ['#A8DC7A', '#8CCB60', 'rgba(60,140,60,.5)', 'rgba(120,180,60,.5)'], DT(['#4FB04A', '#3C9A44', '#7FD36B'], ['#3C9A44', '#5DBE55']), ['#F0E6D2', '#8A94A0', 'T'], ['tea', '#4F9A3A'], 'teapot', 'cn');
  farm('farmbr', 'fbr', ['#B4E08A', '#98D070', 'rgba(70,140,50,.5)', 'rgba(200,150,60,.5)'], DT(['#4FB04A', '#2E8A3A', '#7FD36B'], ['#3C9A44', '#5DBE55']), ['#F2C94C', '#C9503C', 'H'], ['coffee', '#8A5A3A'], 'coffee', null, 'sack');
  farm('farmit', 'fit', ['#C2E08A', '#A8D070', 'rgba(100,140,50,.5)', 'rgba(170,120,200,.5)'], DT(['#6A9A4A', '#8AB06A', '#B4C88A'], ['#5A8A4A', '#7AA05A']), ['#EAD9B8', '#C9703A', 'V'], ['vine', '#B8D880'], 'oil', 'it');
  farm('farmin', 'fin', ['#C8DC84', '#B2CC6A', 'rgba(130,140,50,.5)', 'rgba(230,160,60,.5)'], DT(['#8AAA4A', '#A8C060', '#C8D080'], ['#7A9A3A', '#9AB04A']), ['#D9A070', '#C9A55A', 'U'], ['wheat', '#E8C75A'], 'milk', 'in');
  farm('farmth', 'fth', ['#9EDC74', '#82C85A', 'rgba(50,140,60,.5)', 'rgba(255,200,60,.5)'], DT(['#3FB04A', '#2E9A3C', '#6FD36B'], ['#2E9A3C', '#4DBE55']), ['#C9A06A', '#8A5A2E', 'S'], ['market', '#5BC6E8'], 'mango', 'th');
})(typeof window !== 'undefined' ? window : this);
