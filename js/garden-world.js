/* EWT Garden — phong cảnh dựng sẵn cho từng khu và các công trình lớn (nhà, cung điện, sông, hồ, chòi, cầu…).
   Tự vẽ bằng SVG (có đổ bóng, chuyển màu, viền), không dùng hình bên ngoài.
   Mỗi khu là lưới 7×5 ô, mỗi ô 100 đơn vị; học sinh chỉ xây trên các ô còn trống (xem ZONES trong garden-data.js). */
(function (root) {
  'use strict';
  var W = 700, H = 500;

  function rnd(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function T(x, y, inner, extra) { return '<g transform="translate(' + x + ' ' + y + ')"' + (extra || '') + '>' + inner + '</g>'; }
  function shadow(cx, cy, rx, ry, c) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="' + (c || 'rgba(20,50,20,.3)') + '"/>'; }
  function F(id) { return 'url(#bg-' + id + ')'; }
  var OUT = '#6B4A2B';

  /* ───────── bảng chuyển màu dùng chung ───────── */
  var GRADS = [['roofR', '#F77F70', '#BE362F'], ['roofB', '#86A0F8', '#3C58C4'], ['roofG', '#74CB86', '#2C8A4C'], ['wall', '#FFF8E8', '#EBD2A2'], ['wood', '#DDA56A', '#8F5A2B'], ['woodD', '#BC8650', '#6B4121'],
    ['stone', '#E8ECF1', '#98A3B2'], ['thatch', '#F4D98C', '#C09440'], ['gold', '#FFEA90', '#DDA51A'], ['glass', '#E8F9FF', '#93D0EC'], ['snow', '#FFFFFF', '#CFE1F3'], ['water', '#92DFFF', '#2D9CDD'],
    ['white', '#FFFFFF', '#DFE6EE'], ['purple', '#CDA8FF', '#6538CE'], ['ice', '#EDFBFF', '#9AD6F0'], ['red', '#FF8D7C', '#D6433A'], ['sand', '#FCEBB6', '#E7CD84'], ['teal', '#86E8D8', '#27A596'], ['brick', '#EBB48A', '#B7694B'], ['night', '#6A4CC0', '#2E1F72']];
  var DEFS = GRADS.map(function (g) { return '<linearGradient id="bg-' + g[0] + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + g[1] + '"/><stop offset="1" stop-color="' + g[2] + '"/></linearGradient>'; }).join('') +
    '<linearGradient id="bg-ray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6C8" stop-opacity=".42"/><stop offset="1" stop-color="#FFF6C8" stop-opacity="0"/></linearGradient>' +
    '<radialGradient id="bg-glow"><stop offset="0" stop-color="#FFF3B0" stop-opacity=".95"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="bg-glowP"><stop offset="0" stop-color="#F0D8FF" stop-opacity=".95"/><stop offset="1" stop-color="#B07CFF" stop-opacity="0"/></radialGradient>' +
    '<radialGradient id="bg-vortex"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#E4C8FF"/><stop offset=".75" stop-color="#8E5CF0"/><stop offset="1" stop-color="#4B2AA8"/></radialGradient>';

  /* hình khối tự nhiên: đường cong khép kín đi qua các điểm quanh elip (dùng cho hồ, hồ băng, hồ phép thuật…) */
  function blob(cx, cy, rx, ry, seed) {
    var R = rnd(seed || 5), n = 10, pts = [], i, a, k;
    for (i = 0; i < n; i++) { a = i / n * Math.PI * 2; k = 0.9 + R() * 0.16; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
    var d = 'M' + pts[0][0].toFixed(1) + ' ' + pts[0][1].toFixed(1);
    for (i = 0; i < n; i++) {
      var p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      d += ' C' + (p1[0] + (p2[0] - p0[0]) / 6).toFixed(1) + ' ' + (p1[1] + (p2[1] - p0[1]) / 6).toFixed(1) + ' ' + (p2[0] - (p3[0] - p1[0]) / 6).toFixed(1) + ' ' + (p2[1] - (p3[1] - p1[1]) / 6).toFixed(1) + ' ' + p2[0].toFixed(1) + ' ' + p2[1].toFixed(1);
    }
    return d + 'Z';
  }
  function rimStones(cx, cy, rx, ry, n, seed, cols) {
    var R = rnd(seed || 9), f = '', i, a; cols = cols || ['#B8BFC9', '#A3ABB6', '#CBD2DA'];
    for (i = 0; i < n; i++) { a = i / n * Math.PI * 2; f += '<ellipse cx="' + (cx + Math.cos(a) * (rx + R() * 6)) + '" cy="' + (cy + Math.sin(a) * (ry + R() * 6)) + '" rx="' + (rx / 12 + R() * 5) + '" ry="' + (rx / 17 + R() * 3) + '" fill="' + cols[i % cols.length] + '" stroke="rgba(60,70,90,.35)" stroke-width="1.2"/>'; }
    return f;
  }
  function lily(x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="15" ry="8.5" fill="#4FAE4A" stroke="#2F7E34" stroke-width="1.4"/><path d="M' + x + ' ' + y + 'l11 -4" stroke="#E8F7E0" stroke-width="2"/><g transform="translate(' + (x - 3) + ' ' + (y - 5) + ')"><path d="M0 0q-9 -5 -5 -13q7 2 5 13zM0 0q9 -5 5 -13q-7 2 -5 13zM0 0q-2 -9 0 -15q2 6 0 15z" fill="#FF8FB8" stroke="#E0558D" stroke-width="1"/><circle cy="-3" r="2.6" fill="#FFD23F"/></g>'; }
  function cattail(x, y) { return '<g class="sway b" style="transform-origin:' + x + 'px ' + y + 'px"><path d="M' + x + ' ' + y + 'v-44" stroke="#4E8A3A" stroke-width="4" stroke-linecap="round"/><rect x="' + (x - 4) + '" y="' + (y - 62) + '" width="8" height="24" rx="4" fill="#7A4A1E"/></g>'; }
  function duck(x, y, c) { return '<g class="duck"><g transform="translate(' + x + ' ' + y + ')"><ellipse rx="14" ry="9" fill="' + (c || '#fff') + '" stroke="rgba(0,0,0,.18)"/><circle cx="11" cy="-7" r="6.5" fill="' + (c || '#fff') + '" stroke="rgba(0,0,0,.18)"/><path d="M16 -7l8 2-8 2z" fill="#FF8A3D"/><circle cx="13" cy="-8" r="1.5" fill="#222"/></g></g>'; }
  function snowOn(x, y, w) { return '<path d="M' + x + ' ' + y + ' q' + (w * .12) + ' -10 ' + (w * .25) + ' -4 q' + (w * .12) + ' -12 ' + (w * .25) + ' -3 q' + (w * .13) + ' -10 ' + (w * .25) + ' -2 q' + (w * .12) + ' -8 ' + (w * .25) + ' 6 q-' + (w * .12) + ' 8 -' + (w * .25) + ' 2 q-' + (w * .13) + ' 6 -' + (w * .25) + ' 1 q-' + (w * .12) + ' 6 -' + (w * .25) + ' 0z" fill="url(#bg-snow)" stroke="#BCD2E8" stroke-width="1.4"/>'; }

  /* ───────── từng loại phong cảnh / công trình (toạ độ trong khung của chính nó, đặt bằng T(b.x*100, b.y*100)) ───────── */
  var ART = {
    house: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(100, 190, 98, 12) +
        '<rect x="14" y="84" width="172" height="98" rx="5" fill="' + F('wall') + '" stroke="#D2B47C" stroke-width="2"/><path d="M14 118h172M14 150h172" stroke="#E5C998" stroke-width="2"/><path d="M14 84v98M186 84v98M100 84v98" stroke="#C99E5E" stroke-width="5" opacity=".55"/>' +
        '<rect x="138" y="18" width="26" height="58" fill="' + F('brick') + '" stroke="#8F4F3A" stroke-width="2"/><rect x="133" y="12" width="36" height="10" rx="2" fill="#8F4F3A"/><path d="M138 34h26M138 48h26M138 62h26" stroke="#A55A44" stroke-width="1.5"/>' +
        '<polygon points="-4,98 100,6 204,98" fill="' + F('roofR') + '" stroke="#962B25" stroke-width="3" stroke-linejoin="round"/><path d="M14 90L100 14M30 94L100 24M46 98L100 36M186 90L100 14M170 94L100 24M154 98L100 36" stroke="#C43E36" stroke-width="2" opacity=".55"/><polygon points="-4,98 100,6 100,18 14,98" fill="#fff" opacity=".18"/>' +
        '<circle cx="100" cy="62" r="13" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><circle cx="100" cy="62" r="8.5" class="win"/><path d="M100 54v16M92 62h16" stroke="#fff" stroke-width="2"/>' +
        '<rect x="82" y="126" width="36" height="56" rx="18" ry="18" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/><path d="M100 120v62" stroke="' + OUT + '" stroke-width="1.5"/><circle cx="111" cy="158" r="3" fill="#FFD23F"/><rect x="72" y="180" width="56" height="9" rx="3" fill="#CDBFA3" stroke="#A89878"/><path d="M82 126q18 -20 36 0" fill="none" stroke="#fff" stroke-width="5"/>' +
        '<rect x="26" y="108" width="44" height="40" rx="4" fill="#fff" stroke="' + OUT + '" stroke-width="2"/><rect x="31" y="113" width="34" height="30" class="win"/><path d="M48 113v30M31 128h34" stroke="#fff" stroke-width="3"/><rect x="20" y="148" width="56" height="10" rx="3" fill="' + F('woodD') + '"/><circle cx="32" cy="145" r="5.5" fill="#FF6B8A"/><circle cx="46" cy="142" r="5.5" fill="#FFD23F"/><circle cx="60" cy="145" r="5.5" fill="#B57BFF"/>' +
        '<rect x="130" y="108" width="44" height="40" rx="4" fill="#fff" stroke="' + OUT + '" stroke-width="2"/><rect x="135" y="113" width="34" height="30" class="win"/><path d="M152 113v30M135 128h34" stroke="#fff" stroke-width="3"/><rect x="124" y="148" width="56" height="10" rx="3" fill="' + F('woodD') + '"/><circle cx="136" cy="145" r="5.5" fill="#FF8FB8"/><circle cx="150" cy="142" r="5.5" fill="#fff" stroke="#ddd"/><circle cx="164" cy="145" r="5.5" fill="#FF6B8A"/>' +
        '<circle class="smoke" cx="150" cy="10" r="8" fill="#fff"/><circle class="smoke" style="animation-delay:-1.4s" cx="150" cy="10" r="7" fill="#F2F2F2"/><circle class="smoke" style="animation-delay:-2.7s" cx="150" cy="10" r="8" fill="#fff"/>');
    },
    cabin: function (b) {
      var sn = b.snow, roof = sn ? F('roofG') : F('roofR'), logs = '';
      for (var i = 0; i < 6; i++) logs += '<path d="M18 ' + (96 + i * 15) + 'h164" stroke="#7A4A22" stroke-width="2.2"/>';
      return T(b.x * 100, b.y * 100,
        shadow(100, 190, 96, 12, sn ? 'rgba(60,90,140,.3)' : null) +
        '<rect x="16" y="86" width="168" height="98" rx="5" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/>' + logs +
        '<g fill="#A6703A" stroke="#7A4A22" stroke-width="1.5"><circle cx="16" cy="100" r="5"/><circle cx="16" cy="130" r="5"/><circle cx="16" cy="160" r="5"/><circle cx="184" cy="115" r="5"/><circle cx="184" cy="145" r="5"/><circle cx="184" cy="175" r="5"/></g>' +
        '<rect x="136" y="26" width="24" height="54" fill="' + F('stone') + '" stroke="#7C8796" stroke-width="2"/><rect x="132" y="20" width="32" height="9" rx="2" fill="#8794A4"/>' +
        '<polygon points="-6,100 100,10 206,100" fill="' + roof + '" stroke="' + (sn ? '#1F6B3B' : '#962B25') + '" stroke-width="3" stroke-linejoin="round"/><path d="M20 92L100 22M44 96L100 34M180 92L100 22M156 96L100 34" stroke="rgba(0,0,0,.18)" stroke-width="2"/>' +
        (sn ? '<path d="M-8 100 L100 8 L208 100 q-14 -4 -26 -10 q-10 10 -24 4 q-12 10 -26 2 q-14 -10 -32 -6 q-16 6 -30 -2 q-12 8 -30 6 q-20 -4 -34 6z" fill="url(#bg-snow)" stroke="#BCD2E8" stroke-width="2" transform="translate(0 -2)"/><path d="M136 26q12 -14 24 0z" fill="url(#bg-snow)" stroke="#BCD2E8"/>' : '') +
        '<rect x="84" y="128" width="34" height="56" rx="4" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2.5"/><path d="M101 128v56" stroke="' + OUT + '" stroke-width="1.5"/><circle cx="111" cy="158" r="3" fill="#FFD23F"/>' +
        '<rect x="30" y="112" width="40" height="38" rx="3" fill="#fff" stroke="' + OUT + '" stroke-width="2"/><rect x="35" y="117" width="30" height="28" class="win"/><path d="M50 117v28M35 131h30" stroke="#fff" stroke-width="3"/>' +
        '<rect x="132" y="112" width="40" height="38" rx="3" fill="#fff" stroke="' + OUT + '" stroke-width="2"/><rect x="137" y="117" width="30" height="28" class="win"/><path d="M152 117v28M137 131h30" stroke="#fff" stroke-width="3"/>' +
        '<rect x="70" y="182" width="62" height="9" rx="3" fill="' + F('woodD') + '"/>' +
        '<circle class="smoke" cx="148" cy="16" r="8" fill="#fff"/><circle class="smoke" style="animation-delay:-1.5s" cx="148" cy="16" r="7" fill="#EEF"/><circle class="smoke" style="animation-delay:-2.8s" cx="148" cy="16" r="8" fill="#fff"/>');
    },
    pathv: function (b) { return stonePath(b, true); },
    pathh: function (b) { return stonePath(b, false); },
    gate: function (b) {
      return T(b.x * 100, b.y * 100,
        '<rect x="2" y="18" width="14" height="80" rx="3" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2"/><rect x="84" y="18" width="14" height="80" rx="3" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2"/>' +
        '<path d="M-6 26 Q50 -14 106 26 L106 40 Q50 2 -6 40Z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/>' +
        '<rect x="26" y="2" width="48" height="19" rx="5" fill="#FFF3D6" stroke="' + OUT + '" stroke-width="2.5"/><text x="50" y="15.5" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="800" font-size="10.5" fill="#2E8B57">EWT</text>' +
        '<circle cx="9" cy="14" r="6" fill="#FFE27A" stroke="#C99A1E"/><circle cx="91" cy="14" r="6" fill="#FFE27A" stroke="#C99A1E"/><g class="lampg"><circle cx="9" cy="14" r="22" fill="#FFD76A" opacity=".5"/><circle cx="91" cy="14" r="22" fill="#FFD76A" opacity=".5"/></g>');
    },
    well: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(50, 90, 36, 8) + '<rect x="21" y="20" width="7" height="54" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="72" y="20" width="7" height="54" fill="' + F('woodD') + '" stroke="' + OUT + '"/>' +
        '<polygon points="10,28 50,3 90,28" fill="' + F('roofR') + '" stroke="#962B25" stroke-width="2.5" stroke-linejoin="round"/>' +
        '<rect x="18" y="52" width="64" height="36" rx="7" fill="' + F('stone') + '" stroke="#7C8796" stroke-width="2"/><ellipse cx="50" cy="52" rx="32" ry="10" fill="#5E86A6" stroke="#8794A4" stroke-width="4"/><ellipse cx="50" cy="52" rx="24" ry="6" fill="#8CC6E8"/>' +
        '<path d="M24 64h52M32 76h36M40 58v30M60 58v30" stroke="#A3ABB6" stroke-width="1.8"/><path d="M50 28v22" stroke="' + OUT + '" stroke-width="2"/><rect x="43" y="46" width="14" height="10" rx="2.5" fill="' + F('wood') + '" stroke="' + OUT + '"/>');
    },
    windmill: function (b) {
      return T(b.x * 100, b.y * 100,
        '<g transform="translate(10 26) scale(.9)">' + shadow(100, 290, 88, 12) +
        '<polygon points="50,118 150,118 136,286 64,286" fill="' + F('wall') + '" stroke="#C6A66E" stroke-width="2.5"/><path d="M56 158h88M60 198h80M63 238h74" stroke="#D9BC86" stroke-width="2.5"/><polygon points="50,118 96,118 84,286 64,286" fill="rgba(160,120,60,.18)"/>' +
        '<polygon points="34,124 100,48 166,124" fill="' + F('roofR') + '" stroke="#962B25" stroke-width="3.5" stroke-linejoin="round"/><path d="M60 118L100 62M140 118L100 62" stroke="#C43E36" stroke-width="2"/>' +
        '<rect x="80" y="236" width="40" height="50" rx="20" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/><rect x="84" y="168" width="32" height="34" rx="16" fill="#fff" stroke="' + OUT + '" stroke-width="2"/><rect x="88" y="172" width="24" height="26" rx="12" class="win"/>' +
        '<g class="spin"><g transform="translate(100 78)">' +
        [0, 90, 180, 270].map(function (a) { return '<g transform="rotate(' + a + ')"><rect x="-4" y="-98" width="8" height="98" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="4" y="-94" width="36" height="64" rx="2" fill="#FFF8E8" stroke="' + OUT + '" stroke-width="2.5"/><path d="M4 -78h36M4 -62h36M4 -46h36M22 -94v64" stroke="#E2CFA6" stroke-width="2"/></g>'; }).join('') +
        '<circle r="10" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><circle r="4" fill="#FFD23F"/></g></g></g>');
    },
    river: function (b) {
      var x = b.x * 100, y = b.y * 100, h = b.h * 100, br = y + 200, f = '';
      f += '<rect x="' + (x - 8) + '" y="' + y + '" width="116" height="' + h + '" fill="#EAD9A6"/><rect x="' + (x - 3) + '" y="' + y + '" width="106" height="' + h + '" fill="#D8C48C" opacity=".6"/><rect x="' + x + '" y="' + y + '" width="100" height="' + h + '" fill="' + F('water') + '"/>';
      f += '<g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".7"><path class="flow" d="M' + (x + 22) + ' ' + y + ' q12 60 0 120 t0 120 t0 120 t0 120"/><path class="flow" style="animation-delay:-1.1s" d="M' + (x + 58) + ' ' + y + ' q-12 60 0 120 t0 120 t0 120 t0 120"/><path class="flow" style="animation-delay:-2.1s" d="M' + (x + 84) + ' ' + y + ' q10 60 0 120 t0 120 t0 120 t0 120"/></g>';
      f += lily(x + 30, y + 52) + lily(x + 72, y + 410) + lily(x + 64, y + 160);
      f += T(x - 14, br + 12, '<rect x="0" y="8" width="128" height="70" rx="6" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/><path d="M21 8v70M42 8v70M63 8v70M84 8v70M105 8v70" stroke="' + OUT + '" stroke-width="2"/><rect x="0" y="0" width="128" height="9" rx="3" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="0" y="76" width="128" height="9" rx="3" fill="' + F('woodD') + '" stroke="' + OUT + '"/><g fill="' + OUT + '"><rect x="4" y="-10" width="10" height="34"/><rect x="114" y="-10" width="10" height="34"/><rect x="4" y="62" width="10" height="30"/><rect x="114" y="62" width="10" height="30"/></g><circle cx="9" cy="-12" r="6" fill="#FFE27A"/><circle cx="119" cy="-12" r="6" fill="#FFE27A"/>');
      return f;
    },
    willow: function (b) {
      var x = b.x * 100, y = b.y * 100, f = shadow(x + 50, y + 92, 42, 9) + '<g class="sway b" style="transform-origin:' + (x + 50) + 'px ' + (y + 92) + 'px"><path d="M' + (x + 43) + ' ' + (y + 94) + ' q2 -30 -3 -52 h20 q-5 22 -3 52z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><ellipse cx="' + (x + 50) + '" cy="' + (y + 34) + '" rx="48" ry="31" fill="#4FA85A" stroke="#2F7A3A" stroke-width="2"/><ellipse cx="' + (x + 38) + '" cy="' + (y + 24) + '" rx="26" ry="15" fill="#7BCB6F" opacity=".75"/>';
      for (var i = 0; i < 10; i++) f += '<path d="M' + (x + 8 + i * 9.5) + ' ' + (y + 46) + ' q' + (i % 2 ? 5 : -5) + ' 24 0 46" stroke="' + (i % 2 ? '#4FA050' : '#6BBE66') + '" stroke-width="4.5" fill="none" stroke-linecap="round"/>';
      return f + '</g>';
    },
    dock: function (b) {
      var x = b.x * 100, y = b.y * 100;
      return T(x - 92, y + 22, '<rect x="0" y="8" width="134" height="40" rx="5" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/><path d="M19 8v40M38 8v40M57 8v40M76 8v40M95 8v40M114 8v40" stroke="' + OUT + '" stroke-width="2"/><rect x="0" y="0" width="134" height="9" rx="3" fill="' + F('woodD') + '"/>') +
        T(x - 76, y + 70, '<g class="boat"><path d="M0 6 Q42 38 88 6 L76 0 Q42 20 12 0Z" fill="' + F('red') + '" stroke="#962B25" stroke-width="2"/><path d="M12 0 Q42 20 76 0" fill="none" stroke="#F4E3C0" stroke-width="3"/><rect x="40" y="-36" width="4" height="36" fill="' + OUT + '"/><path d="M44 -36 L72 -12 L44 -12Z" fill="#fff" stroke="#ccd" stroke-width="1.5"/></g>');
    },
    pond: function (b) {
      var x = b.x * 100, y = b.y * 100, cx = x + 150, cy = y + 150, f = '';
      f += '<path d="' + blob(cx, cy, 142, 134, 3) + '" fill="#D8C79A"/><path d="' + blob(cx, cy, 134, 126, 3) + '" fill="' + F('water') + '" stroke="#C9B58A" stroke-width="3"/><path d="' + blob(cx - 6, cy - 8, 96, 84, 11) + '" fill="#fff" opacity=".12"/>';
      f += rimStones(cx, cy, 138, 130, 20, 7);
      f += '<g fill="none" stroke="#fff" stroke-width="3" opacity=".75"><circle class="ripple" cx="' + (cx - 20) + '" cy="' + (cy + 20) + '" r="20"/><circle class="ripple" style="animation-delay:-1.3s" cx="' + (cx + 50) + '" cy="' + (cy - 30) + '" r="16"/></g>';
      [[-70, -40], [10, -62], [60, 30], [-30, 50], [-84, 38], [22, 0], [82, -22]].forEach(function (p, k) { f += (k % 2 === 0) ? lily(cx + p[0], cy + p[1]) : '<ellipse cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" rx="22" ry="13" fill="#4FAE4A" stroke="#2F7E34" stroke-width="1.5"/><path d="M' + (cx + p[0]) + ' ' + (cy + p[1]) + 'l14 -6" stroke="#E8F7E0" stroke-width="2"/>'; });
      f += duck(cx + 20, cy + 62) + cattail(cx - 120, cy + 100) + cattail(cx - 104, cy + 112) + cattail(cx + 112, cy - 96);
      return f;
    },
    pavilion: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(100, 190, 92, 12) + '<ellipse cx="100" cy="166" rx="84" ry="22" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><ellipse cx="100" cy="158" rx="84" ry="22" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2"/>' +
        '<rect x="34" y="78" width="10" height="80" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="156" y="78" width="10" height="80" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="72" y="88" width="9" height="78" fill="' + F('wood') + '" stroke="' + OUT + '"/><rect x="119" y="88" width="9" height="78" fill="' + F('wood') + '" stroke="' + OUT + '"/>' +
        '<path d="M58 150h84" stroke="' + OUT + '" stroke-width="8" stroke-linecap="round"/><path d="M58 150h84" stroke="#C98E55" stroke-width="4" stroke-linecap="round"/>' +
        '<path d="M-2 90 Q100 -30 202 90 Q150 72 100 76 Q50 72 -2 90Z" fill="' + F('thatch') + '" stroke="#9A7432" stroke-width="3"/>' +
        '<g stroke="#B58F46" stroke-width="2.5" fill="none">' + [14, 40, 68, 100, 132, 160, 186].map(function (xx) { return '<path d="M' + (100 + (xx - 100) * .14) + ' 12 L' + xx + ' 86"/>'; }).join('') + '</g><path d="M-2 90 Q100 -30 202 90" fill="none" stroke="#fff" stroke-width="3" opacity=".25"/>' +
        '<circle cx="100" cy="12" r="8" fill="' + F('woodD') + '" stroke="' + OUT + '"/>');
    },
    hut: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(100, 188, 94, 12) +
        '<rect x="28" y="90" width="144" height="94" rx="14" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/><path d="M28 118h144M28 148h144" stroke="#9A6A36" stroke-width="3"/><path d="M60 90v94M100 90v94M140 90v94" stroke="#B5803E" stroke-width="2" opacity=".6"/>' +
        '<rect x="80" y="124" width="40" height="60" rx="20" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2.5"/><circle cx="110" cy="156" r="3" fill="#FFD23F"/><rect x="38" y="108" width="28" height="26" rx="4" fill="#FFF6E2" stroke="' + OUT + '" stroke-width="2"/><rect x="42" y="112" width="20" height="18" class="win"/><rect x="134" y="108" width="28" height="26" rx="4" fill="#FFF6E2" stroke="' + OUT + '" stroke-width="2"/><rect x="138" y="112" width="20" height="18" class="win"/>' +
        '<path d="M2 102 Q100 -38 198 102 Q150 88 100 90 Q50 88 2 102Z" fill="' + F('thatch') + '" stroke="#9A7432" stroke-width="3"/>' +
        '<g stroke="#B58F46" stroke-width="2.5" fill="none">' + [20, 48, 78, 122, 152, 180].map(function (xx) { return '<path d="M' + (100 + (xx - 100) * .12) + ' 18 L' + xx + ' 98"/>'; }).join('') + '</g><path d="M2 102 Q100 -38 198 102" fill="none" stroke="#fff" stroke-width="3" opacity=".25"/>' +
        '<circle class="smoke" cx="152" cy="38" r="7" fill="#fff"/><circle class="smoke" style="animation-delay:-2s" cx="152" cy="38" r="6" fill="#F2F2F2"/>');
    },
    campfire: function (b) {
      var x = b.x * 100, y = b.y * 100;
      return T(x, y, shadow(50, 86, 36, 8) + '<g class="lampg"><circle cx="50" cy="56" r="54" fill="#FFB23F" opacity=".4"/></g>' +
        [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<ellipse cx="' + (50 + Math.cos(a * Math.PI / 180) * 32) + '" cy="' + (66 + Math.sin(a * Math.PI / 180) * 14) + '" rx="8" ry="6" fill="#A9B2BC" stroke="#7C8796"/>'; }).join('') +
        '<rect x="20" y="62" width="60" height="10" rx="5" fill="' + F('woodD') + '" stroke="' + OUT + '" transform="rotate(-14 50 66)"/><rect x="20" y="62" width="60" height="10" rx="5" fill="' + F('wood') + '" stroke="' + OUT + '" transform="rotate(14 50 66)"/>' +
        '<g class="flame"><path d="M50 18 Q72 46 63 65 Q50 74 37 65 Q28 46 50 18Z" fill="#FF8A3D"/><path d="M50 36 Q63 54 57 65 Q50 70 43 65 Q37 54 50 36Z" fill="#FFD23F"/></g>' +
        '<rect x="2" y="74" width="28" height="10" rx="5" fill="' + F('wood') + '" stroke="' + OUT + '"/><rect x="70" y="76" width="28" height="10" rx="5" fill="' + F('wood') + '" stroke="' + OUT + '"/>');
    },
    palace: function (b) {
      var x = b.x * 100, y = b.y * 100, f = '', i;
      f += shadow(250, 194, 250, 10);
      f += '<rect x="0" y="96" width="500" height="96" rx="5" fill="' + F('wall') + '" stroke="#CDB57E" stroke-width="2.5"/><rect x="0" y="96" width="500" height="11" fill="#E3D2A8"/>';
      for (i = 0; i < 4; i++) { f += '<rect x="' + (14 + i * 38) + '" y="124" width="22" height="42" rx="11" fill="' + F('glass') + '" stroke="#5E8DB0" stroke-width="2"/><rect x="' + (18 + i * 38) + '" y="128" width="14" height="34" rx="7" class="win"/>'; f += '<rect x="' + (334 + i * 38) + '" y="124" width="22" height="42" rx="11" fill="' + F('glass') + '" stroke="#5E8DB0" stroke-width="2"/><rect x="' + (338 + i * 38) + '" y="128" width="14" height="34" rx="7" class="win"/>'; }
      [[38], [402]].forEach(function (t) {
        var tx = t[0];
        f += '<rect x="' + tx + '" y="40" width="62" height="152" rx="3" fill="' + F('wall') + '" stroke="#CDB57E" stroke-width="2.5"/><polygon points="' + (tx - 9) + ',46 ' + (tx + 31) + ',-22 ' + (tx + 71) + ',46" fill="' + F('roofB') + '" stroke="#2F479E" stroke-width="3.5" stroke-linejoin="round"/><path d="M' + (tx + 31) + ' -22L' + (tx + 8) + ' 44M' + (tx + 31) + ' -22L' + (tx + 54) + ' 44" stroke="#9CB1FF" stroke-width="1.8" opacity=".8"/><rect x="' + (tx + 22) + '" y="62" width="18" height="30" rx="9" fill="' + F('glass') + '" stroke="#5E8DB0" stroke-width="2"/><rect x="' + (tx + 25) + '" y="65" width="12" height="24" rx="6" class="win"/><rect x="' + (tx + 22) + '" y="108" width="18" height="30" rx="9" fill="' + F('glass') + '" stroke="#5E8DB0" stroke-width="2"/><rect x="' + (tx + 25) + '" y="111" width="12" height="24" rx="6" class="win"/>' +
          '<path d="M' + (tx + 31) + ' -22v-22" stroke="' + OUT + '" stroke-width="3"/><path class="flag" d="M' + (tx + 31) + ' -44l24 7-24 8z" fill="#E5334B" stroke="#962B25"/><circle cx="' + (tx + 31) + '" cy="-24" r="4" fill="#FFD23F"/>';
      });
      f += '<rect x="170" y="36" width="160" height="156" rx="4" fill="' + F('white') + '" stroke="#CDB57E" stroke-width="2.5"/><path d="M170 66h160" stroke="#E5D8BC" stroke-width="3"/>';
      f += '<path d="M188 38 Q250 -50 312 38Z" fill="' + F('gold') + '" stroke="#B88510" stroke-width="3.5"/><path d="M206 36 Q250 -26 294 36" fill="none" stroke="#fff" stroke-width="3" opacity=".5"/><path d="M250 -26v-26" stroke="' + OUT + '" stroke-width="3"/><path class="flag" d="M250 -52l26 8-26 9z" fill="#E5334B" stroke="#962B25"/><circle cx="250" cy="-28" r="4.5" fill="#FFD23F"/>';
      for (i = 0; i < 5; i++) f += '<rect x="' + (175 + i * 32) + '" y="70" width="11" height="122" rx="2" fill="url(#bg-white)" stroke="#CDB57E"/><rect x="' + (172 + i * 32) + '" y="66" width="17" height="7" rx="2" fill="#E5D8BC"/>';
      f += '<path d="M212 192v-62a38 38 0 0 1 76 0v62z" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="3"/><path d="M250 92v100M226 140q24 -20 48 0" stroke="' + OUT + '" stroke-width="2" fill="none"/><circle cx="240" cy="160" r="3.5" fill="#FFD23F"/><circle cx="260" cy="160" r="3.5" fill="#FFD23F"/>';
      f += '<rect x="191" y="76" width="22" height="36" rx="11" fill="' + F('glass') + '" stroke="#5E8DB0" stroke-width="2"/><rect x="286" y="76" width="22" height="36" rx="11" fill="' + F('glass') + '" stroke="#5E8DB0" stroke-width="2"/><circle cx="250" cy="58" r="13" fill="#fff" stroke="#DDA51A" stroke-width="4"/><path d="M250 58l0 -8M250 58l6 3" stroke="#6B4A2B" stroke-width="2" stroke-linecap="round"/>';
      f += '<path d="M220 192h60l12 9h-84z" fill="' + F('red') + '" stroke="#962B25" stroke-width="2"/><rect x="148" y="184" width="204" height="12" rx="3" fill="#E5D8BC" stroke="#CDB57E"/>';
      return T(x + 50, y + 44, '<g transform="scale(.8)">' + f + '</g>');
    },
    fountain: function (b) { return T(b.x * 100, b.y * 100, fountainSvg()); },
    /* ── khu mùa đông ── */
    snowman: function (b) {
      return T(b.x * 100, b.y * 100, shadow(50, 90, 32, 7, 'rgba(70,100,150,.3)') +
        '<circle cx="50" cy="70" r="22" fill="' + F('snow') + '" stroke="#A9C4DE" stroke-width="2"/><circle cx="50" cy="46" r="16" fill="' + F('snow') + '" stroke="#A9C4DE" stroke-width="2"/><circle cx="50" cy="26" r="12.5" fill="' + F('snow') + '" stroke="#A9C4DE" stroke-width="2"/>' +
        '<path d="M32 44 L12 34M68 44 L88 36" stroke="#6F4421" stroke-width="3.5" stroke-linecap="round"/><circle cx="46" cy="24" r="1.8" fill="#222"/><circle cx="55" cy="24" r="1.8" fill="#222"/><path d="M50 28 l11 3 -11 3z" fill="#FF8A3D"/>' +
        '<circle cx="50" cy="52" r="2" fill="#333"/><circle cx="50" cy="62" r="2" fill="#333"/><circle cx="50" cy="72" r="2" fill="#333"/><path d="M38 36q12 7 24 0l2 7q-14 8 -28 0z" fill="#E5334B" stroke="#962B25"/><path d="M58 38l6 14" stroke="#E5334B" stroke-width="5" stroke-linecap="round"/>' +
        '<rect x="39" y="8" width="22" height="9" rx="2" fill="#2E2E3A"/><rect x="34" y="15" width="32" height="4" rx="2" fill="#2E2E3A"/>');
    },
    snowpine: function (b) {
      return T(b.x * 100, b.y * 100, shadow(50, 92, 34, 7, 'rgba(70,100,150,.3)') + '<rect x="44" y="72" width="12" height="20" rx="3" fill="' + F('woodD') + '"/>' +
        '<g class="sway b" style="transform-origin:50px 92px"><polygon points="50,6 22,44 78,44" fill="#2E8B57" stroke="#1F6B41" stroke-width="2" stroke-linejoin="round"/><polygon points="50,24 16,62 84,62" fill="#359A63" stroke="#1F6B41" stroke-width="2" stroke-linejoin="round"/><polygon points="50,42 10,80 90,80" fill="#2E8B57" stroke="#1F6B41" stroke-width="2" stroke-linejoin="round"/>' +
        '<path d="M50 6 L36 26 q6 -5 14 0 q8 -5 14 0z" fill="#fff"/><path d="M50 24 L30 48 q10 -6 20 0 q10 -6 20 0z" fill="#fff"/><path d="M50 42 L22 72 q14 -8 28 0 q14 -8 28 0z" fill="#fff"/><circle cx="40" cy="62" r="3" fill="#E5334B"/><circle cx="60" cy="48" r="3" fill="#FFD23F"/></g>');
    },
    icepond: function (b) {
      var x = b.x * 100, y = b.y * 100, cx = x + 150, cy = y + 100;
      return '<path d="' + blob(cx, cy, 148, 92, 4) + '" fill="#F4F9FF" stroke="#BCD2E8" stroke-width="3"/><path d="' + blob(cx, cy, 134, 80, 4) + '" fill="' + F('ice') + '" stroke="#9AC3E0" stroke-width="3"/><path d="' + blob(cx - 10, cy - 12, 92, 46, 13) + '" fill="#fff" opacity=".28"/>' +
        '<g fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".85"><path d="M' + (cx - 80) + ' ' + (cy - 20) + ' l40 10 l20 -14"/><path d="M' + (cx + 10) + ' ' + (cy + 30) + ' l30 -12 l24 10 l16 -10"/><path d="M' + (cx - 40) + ' ' + (cy + 20) + ' q30 14 60 -4" stroke-opacity=".6"/></g>' +
        '<g class="spk" fill="#fff"><path d="M' + (cx - 60) + ' ' + (cy - 30) + 'l4 8l8 4l-8 4l-4 8l-4 -8l-8 -4l8 -4z"/><path d="M' + (cx + 60) + ' ' + (cy + 10) + 'l3 6l6 3l-6 3l-3 6l-3 -6l-6 -3l6 -3z"/></g>' +
        rimStones(cx, cy, 150, 92, 18, 5, ['#E8EEF5', '#D3DEEA', '#F6FAFF']) +
        '<g transform="translate(' + (cx + 70) + ' ' + (cy - 6) + ')"><ellipse cx="0" cy="10" rx="14" ry="5" fill="rgba(60,80,120,.25)"/><path d="M-10 4 l20 -6 l-4 8z" fill="#E5334B"/><path d="M-12 8h24" stroke="#4A4A55" stroke-width="3" stroke-linecap="round"/></g>';
    },
    /* ── khu biển ── */
    sea: function (b) {
      var x = b.x * 100, y = b.y * 100, w = b.w * 100, f = '', i;
      f += '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="100" fill="' + F('water') + '"/><rect x="' + x + '" y="' + y + '" width="' + w + '" height="30" fill="#fff" opacity=".12"/>';
      for (i = 0; i < 5; i++) f += '<path class="wave" style="animation-delay:' + (-i * .7) + 's" d="M' + (x - 20) + ' ' + (y + 18 + i * 16) + ' q15 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity="' + (0.35 + i * .08) + '"/>';
      f += '<path class="wave" d="M' + (x - 20) + ' ' + (y + 94) + ' q12 -12 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".9"/>';
      f += '<g class="boat"><g transform="translate(' + (x + 70) + ' ' + (y + 46) + ')"><path d="M0 8 Q30 30 62 8 L52 0 Q30 14 10 0Z" fill="' + F('red') + '" stroke="#962B25" stroke-width="2"/><rect x="29" y="-30" width="3.5" height="30" fill="' + OUT + '"/><path d="M33 -30 L56 -8 L33 -8Z" fill="#fff" stroke="#ccd" stroke-width="1.2"/><path d="M28 -26 L12 -8 L28 -8Z" fill="#FFE27A" stroke="#C99A1E" stroke-width="1.2"/></g></g>';
      f += '<g transform="translate(' + (x + 330) + ' ' + (y + 30) + ')" class="duck"><path d="M0 0 q10 -10 20 0 q10 -10 20 0" stroke="#fff" stroke-width="3" fill="none" stroke-linecap="round"/></g>';
      return f;
    },
    lighthouse: function (b) {
      var f = shadow(100, 192, 92, 12, 'rgba(30,60,90,.3)');
      f += '<path d="M10 188 q8 -34 40 -38 h100 q32 4 40 38 q-10 8 -90 8 q-80 0 -90 -8z" fill="#9AA3AE" stroke="#6C7683" stroke-width="3"/><path d="M40 176q20 -8 40 0M110 172q22 -8 44 2" stroke="#7C8796" stroke-width="2" fill="none"/>';
      f += '<path d="M68 150 L132 150 L120 44 L80 44Z" fill="url(#bg-white)" stroke="#9AA3AE" stroke-width="2.5"/>';
      f += '<path d="M72 122 L128 122 L126 100 L74 100Z" fill="' + F('red') + '"/><path d="M78 74 L122 74 L120 58 L80 58Z" fill="' + F('red') + '"/><path d="M69 148 L131 148 L129 134 L71 134Z" fill="' + F('red') + '"/>';
      f += '<rect x="64" y="42" width="72" height="10" rx="3" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><rect x="78" y="20" width="44" height="24" rx="4" fill="' + F('glass') + '" stroke="#5E8DB0" stroke-width="2.5"/><circle cx="100" cy="32" r="9" class="win" fill="#FFF3B8"/>';
      f += '<g class="beam"><path d="M100 32 L-30 4 L-30 60Z" fill="#FFF3B8" opacity=".55"/></g>';
      f += '<polygon points="72,22 100,0 128,22" fill="' + F('roofR') + '" stroke="#962B25" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="-2" r="4" fill="#FFD23F"/>';
      f += '<rect x="92" y="108" width="16" height="26" rx="8" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2"/>';
      f += '<path d="M6 190 q16 -10 30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" class="wave" opacity=".95"/>';
      return T(b.x * 100, b.y * 100 + 8, '<g transform="scale(.96)">' + f + '</g>');
    },
    pier: function (b) {
      var x = b.x * 100, y = b.y * 100, f = '', i;
      f += '<rect x="' + (x + 18) + '" y="' + y + '" width="64" height="200" rx="4" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/>';
      for (i = 1; i < 10; i++) f += '<path d="M' + (x + 18) + ' ' + (y + i * 20) + 'h64" stroke="' + OUT + '" stroke-width="1.8"/>';
      for (i = 0; i < 4; i++) f += '<rect x="' + (x + 8) + '" y="' + (y + 6 + i * 52) + '" width="12" height="40" rx="3" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="' + (x + 80) + '" y="' + (y + 6 + i * 52) + '" width="12" height="40" rx="3" fill="' + F('woodD') + '" stroke="' + OUT + '"/>';
      f += '<path d="M' + (x + 14) + ' ' + (y + 16) + ' q-4 30 0 56 M' + (x + 86) + ' ' + (y + 16) + ' q4 30 0 56" stroke="#F4D98C" stroke-width="3" fill="none"/>';
      f += '<g transform="translate(' + (x + 50) + ' ' + (y + 180) + ')"><circle r="12" fill="#fff" stroke="#E5334B" stroke-width="5"/><circle r="12" fill="none" stroke="#fff" stroke-width="5" stroke-dasharray="9 28"/></g>';
      return f;
    },
    tikihut: function (b) {
      var f = shadow(100, 192, 94, 12);
      f += '<rect x="34" y="96" width="10" height="92" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="156" y="96" width="10" height="92" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="34" y="150" width="132" height="34" rx="5" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2"/><path d="M60 150v34M100 150v34M140 150v34" stroke="' + OUT + '" stroke-width="1.8"/>';
      f += '<rect x="76" y="118" width="48" height="32" rx="4" fill="#FFF6E2" stroke="' + OUT + '" stroke-width="2"/><path d="M76 134h48" stroke="#E5334B" stroke-width="3"/><path d="M82 118v-10l18 8 18 -8v10" fill="#FF6B8A" stroke="#C03561" stroke-width="1.5"/>';
      f += '<path d="M8 104 L100 18 L192 104 Q150 92 100 96 Q50 92 8 104Z" fill="#6EC25A" stroke="#2F7E34" stroke-width="3" stroke-linejoin="round"/>';
      for (var i = 0; i < 9; i++) f += '<path d="M' + (100 + (i - 4) * 4) + ' 20 Q' + (100 + (i - 4) * 14) + ' 70 ' + (14 + i * 21) + ' 102" fill="none" stroke="' + (i % 2 ? '#4FA050' : '#8DD870') + '" stroke-width="5" stroke-linecap="round"/>';
      f += '<g transform="translate(18 120) rotate(-10)"><rect x="0" y="0" width="16" height="64" rx="8" fill="#FF8A3D" stroke="#B85A1A" stroke-width="2"/><path d="M8 4v56" stroke="#fff" stroke-width="2"/></g><g transform="translate(168 118) rotate(10)"><rect x="0" y="0" width="16" height="62" rx="8" fill="#5BB6FF" stroke="#2B7DC0" stroke-width="2"/><path d="M8 4v54" stroke="#fff" stroke-width="2"/></g>';
      f += '<g class="lampg"><circle cx="56" cy="104" r="24" fill="#FFD76A" opacity=".5"/><circle cx="144" cy="104" r="24" fill="#FFD76A" opacity=".5"/></g><circle cx="56" cy="104" r="6" fill="#FFE27A" stroke="#C99A1E"/><circle cx="144" cy="104" r="6" fill="#FFE27A" stroke="#C99A1E"/>';
      return T(b.x * 100, b.y * 100, f);
    },
    palm: function (b) {
      return T(b.x * 100, b.y * 100, shadow(50, 94, 30, 7) + '<g class="sway b" style="transform-origin:50px 94px"><path d="M46 94 q-6 -30 4 -60 q6 30 4 60z" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2"/><path d="M45 80h10M46 66h8M47 52h6" stroke="' + OUT + '" stroke-width="1.5"/>' +
        '<path d="M50 34 q-34 -18 -42 6 q22 -14 42 -6z" fill="#5DBE55" stroke="#2F7E34" stroke-width="2"/><path d="M50 34 q34 -18 42 6 q-22 -14 -42 -6z" fill="#5DBE55" stroke="#2F7E34" stroke-width="2"/><path d="M50 34 q-6 -26 -26 -26 q14 8 26 26z" fill="#6CC85F" stroke="#2F7E34" stroke-width="2"/><path d="M50 34 q6 -26 26 -26 q-14 8 -26 26z" fill="#6CC85F" stroke="#2F7E34" stroke-width="2"/><path d="M50 34 q-24 6 -30 26 q18 -8 30 -26z" fill="#4FB04A" stroke="#2F7E34" stroke-width="2"/><path d="M50 34 q24 6 30 26 q-18 -8 -30 -26z" fill="#4FB04A" stroke="#2F7E34" stroke-width="2"/><circle cx="46" cy="38" r="5" fill="#7A4A1E"/><circle cx="55" cy="39" r="5" fill="#7A4A1E"/></g>');
    },
    /* ── khu phép thuật ── */
    wizard: function (b) {
      var f = shadow(100, 292, 84, 12, 'rgba(40,20,90,.4)');
      f += '<g class="lampg"><circle cx="100" cy="130" r="120" fill="url(#bg-glowP)" opacity=".5"/></g>';
      f += '<path d="M54 290 L66 110 L134 110 L146 290Z" fill="' + F('purple') + '" stroke="#3E2290" stroke-width="3"/><path d="M60 250h80M62 210h76M64 170h72M66 130h68" stroke="#E4D4FF" stroke-width="2.2" opacity=".7"/><path d="M80 250v-20M110 250v-20M90 210v-20M120 210v-20M76 170v-20M106 170v-20" stroke="#E4D4FF" stroke-width="2" opacity=".5"/><path d="M54 290 L66 110 L96 110 L88 290Z" fill="rgba(30,10,90,.22)"/>';
      f += '<rect x="58" y="96" width="84" height="18" rx="4" fill="' + F('purple') + '" stroke="#4B2AA8" stroke-width="2.5"/>';
      f += '<rect x="72" y="48" width="56" height="52" rx="3" fill="' + F('purple') + '" stroke="#3E2290" stroke-width="3"/>';
      f += '<polygon points="60,52 100,-34 140,52" fill="' + F('night') + '" stroke="#2E1F72" stroke-width="3.5" stroke-linejoin="round"/><path d="M60 52q40 14 80 0" fill="none" stroke="#FFD23F" stroke-width="3"/><path d="M100 -34 q16 -10 28 4 q-14 -2 -24 10z" fill="#4B2AA8" stroke="#2E1F72" stroke-width="2"/>';
      f += '<g fill="#FFE27A"><path class="spk" d="M96 6l3 7l7 3l-7 3l-3 7l-3 -7l-7 -3l7 -3z"/><circle cx="84" cy="30" r="2.4"/><circle cx="114" cy="22" r="2.4"/></g>';
      f += '<rect x="90" y="62" width="20" height="28" rx="10" fill="#fff" stroke="#4B2AA8" stroke-width="2.5"/><rect x="94" y="66" width="12" height="20" rx="6" fill="#FFE27A"/>';
      f += '<rect x="86" y="230" width="28" height="60" rx="14" fill="' + F('woodD') + '" stroke="' + OUT + '" stroke-width="2.5"/><circle cx="106" cy="262" r="3" fill="#FFD23F"/>';
      f += '<rect x="86" y="140" width="28" height="36" rx="14" fill="#fff" stroke="#4B2AA8" stroke-width="2.5"/><rect x="91" y="145" width="18" height="26" rx="9" class="win"/>';
      f += '<g class="float1"><path d="M24 80l8 -16l8 16l-8 16z" fill="' + F('teal') + '" stroke="#1B7A6E" stroke-width="2"/></g><g class="float2"><path d="M166 120l7 -14l7 14l-7 14z" fill="' + F('purple') + '" stroke="#4B2AA8" stroke-width="2"/></g>';
      return T(b.x * 100 + 12, b.y * 100 + 38, '<g transform="scale(.88)">' + f + '</g>');
    },
    glowpool: function (b) {
      var x = b.x * 100, y = b.y * 100, cx = x + 150, cy = y + 100;
      return '<g class="lampg"><ellipse cx="' + cx + '" cy="' + cy + '" rx="170" ry="120" fill="url(#bg-glowP)" opacity=".55"/></g>' +
        '<path d="' + blob(cx, cy, 148, 92, 8) + '" fill="#4B2AA8" stroke="#2E1F72" stroke-width="3"/><path d="' + blob(cx, cy, 138, 82, 8) + '" fill="' + F('teal') + '"/><path d="' + blob(cx, cy, 108, 60, 12) + '" fill="#B8F7EC" opacity=".45"/><path d="' + blob(cx, cy, 66, 36, 15) + '" fill="#fff" opacity=".4"/>' +
        '<g fill="none" stroke="#fff" stroke-width="3" opacity=".8"><circle class="ripple" cx="' + (cx - 30) + '" cy="' + (cy + 10) + '" r="22"/><circle class="ripple" style="animation-delay:-1.4s" cx="' + (cx + 50) + '" cy="' + (cy - 14) + '" r="18"/></g>' +
        rimStones(cx, cy, 150, 94, 16, 6, ['#9C86D8', '#7C66C0', '#B4A2E8']) +
        [[-100, -50], [-70, 50], [100, 56], [120, -40]].map(function (p) { return '<g transform="translate(' + (cx + p[0]) + ' ' + (cy + p[1]) + ')"><path d="M-8 6 L-4 -22 L2 6z" fill="' + F('purple') + '" stroke="#4B2AA8" stroke-width="1.8"/><path d="M0 6 L8 -14 L14 6z" fill="' + F('teal') + '" stroke="#1B7A6E" stroke-width="1.8"/></g>'; }).join('') +
        '<g class="spk" fill="#FFF3B0"><circle cx="' + (cx - 60) + '" cy="' + (cy - 20) + '" r="3"/><circle cx="' + (cx + 20) + '" cy="' + (cy + 20) + '" r="2.6"/><circle cx="' + (cx + 80) + '" cy="' + (cy - 30) + '" r="3"/></g>';
    },
    mushhouse: function (b) {
      var f = shadow(100, 192, 90, 12, 'rgba(40,20,90,.35)');
      f += '<rect x="64" y="92" width="72" height="96" rx="18" fill="' + F('wall') + '" stroke="#CDB57E" stroke-width="3"/><path d="M64 120h72M64 150h72" stroke="#E5D2A2" stroke-width="2"/>';
      f += '<path d="M6 100 Q8 6 100 4 Q192 6 194 100 Q150 84 100 88 Q50 84 6 100Z" fill="' + F('red') + '" stroke="#962B25" stroke-width="3.5"/><path d="M26 58 Q50 20 96 14" fill="none" stroke="#fff" stroke-width="5" opacity=".35" stroke-linecap="round"/>';
      f += '<g fill="#fff" stroke="#E0D6D0" stroke-width="1.5"><circle cx="46" cy="52" r="13"/><circle cx="104" cy="34" r="16"/><circle cx="154" cy="56" r="12"/><circle cx="78" cy="74" r="8"/><circle cx="130" cy="78" r="8"/><circle cx="26" cy="82" r="6"/><circle cx="176" cy="84" r="6"/></g>';
      f += '<rect x="86" y="130" width="28" height="58" rx="14" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/><circle cx="106" cy="160" r="3" fill="#FFD23F"/><rect x="70" y="104" width="22" height="22" rx="11" fill="#fff" stroke="' + OUT + '" stroke-width="2"/><rect x="74" y="108" width="14" height="14" rx="7" class="win"/><rect x="108" y="104" width="22" height="22" rx="11" fill="#fff" stroke="' + OUT + '" stroke-width="2"/><rect x="112" y="108" width="14" height="14" rx="7" class="win"/>';
      f += '<g class="lampg"><circle cx="100" cy="110" r="70" fill="url(#bg-glowP)" opacity=".5"/></g><circle class="smoke" cx="160" cy="20" r="7" fill="#EFE0FF"/><circle class="smoke" style="animation-delay:-2s" cx="160" cy="20" r="6" fill="#EFE0FF"/>';
      f += '<g transform="translate(150 150)"><path d="M0 40 Q6 18 16 10 Q20 28 14 40z" fill="#B57BFF" stroke="#6538CE" stroke-width="2"/><circle cx="12" cy="8" r="4" fill="#FFD23F"/></g>';
      return T(b.x * 100, b.y * 100, f);
    },
    portal: function (b) {
      return T(b.x * 100, b.y * 100, shadow(50, 92, 36, 7, 'rgba(40,20,90,.35)') + '<g class="lampg"><circle cx="50" cy="50" r="52" fill="url(#bg-glowP)" opacity=".6"/></g>' +
        '<ellipse cx="50" cy="50" rx="28" ry="36" fill="url(#bg-vortex)"/><g class="spin"><path d="M50 50 q12 -14 22 -4 q-8 -22 -22 -22 q-18 4 -16 22 q4 14 16 12 q6 -2 4 -8z" fill="none" stroke="#fff" stroke-width="2.5" opacity=".75"/></g>' +
        '<ellipse cx="50" cy="50" rx="31" ry="39" fill="none" stroke="' + F('stone') + '" stroke-width="9"/><ellipse cx="50" cy="50" rx="31" ry="39" fill="none" stroke="#8D7BC4" stroke-width="2" stroke-dasharray="6 6"/>' +
        '<g class="spk" fill="#FFF3B0"><circle cx="20" cy="26" r="2.4"/><circle cx="80" cy="34" r="2.4"/><circle cx="74" cy="76" r="2.2"/></g>');
    },
    crystals: function (b) {
      return T(b.x * 100, b.y * 100, shadow(50, 90, 34, 7, 'rgba(40,20,90,.35)') + '<g class="lampg"><circle cx="50" cy="56" r="46" fill="url(#bg-glowP)" opacity=".6"/></g>' +
        '<path d="M30 90 L26 46 L40 14 L52 46 L50 90z" fill="' + F('purple') + '" stroke="#4B2AA8" stroke-width="2.5" stroke-linejoin="round"/><path d="M40 14 L52 46 L50 90 L42 90z" fill="rgba(255,255,255,.25)"/>' +
        '<path d="M52 90 L50 56 L66 30 L78 58 L74 90z" fill="' + F('teal') + '" stroke="#1B7A6E" stroke-width="2.5" stroke-linejoin="round"/><path d="M66 30 L78 58 L74 90 L66 90z" fill="rgba(255,255,255,.25)"/>' +
        '<path d="M16 90 L14 70 L24 54 L32 72 L30 90z" fill="#FF9EDD" stroke="#C0489D" stroke-width="2" stroke-linejoin="round"/>');
    }
  };

  function fountainSvg() {
    return shadow(50, 90, 42, 8) + '<ellipse cx="50" cy="70" rx="44" ry="21" fill="' + F('stone') + '" stroke="#7C8796" stroke-width="2.5"/><ellipse cx="50" cy="65" rx="37" ry="15.5" fill="' + F('water') + '" stroke="#98A3B2" stroke-width="4"/>' +
      '<rect x="44" y="36" width="12" height="30" fill="' + F('stone') + '" stroke="#7C8796" stroke-width="2"/><ellipse cx="50" cy="40" rx="20" ry="7" fill="' + F('stone') + '" stroke="#7C8796" stroke-width="2"/><ellipse cx="50" cy="38" rx="15" ry="4.5" fill="' + F('water') + '"/>' +
      '<g fill="#CFF0FF" opacity=".95"><circle class="jet" cx="50" cy="30" r="3.5"/><circle class="jet" style="animation-delay:-.4s" cx="50" cy="30" r="3"/><circle class="jet" style="animation-delay:-.8s" cx="50" cy="30" r="3.5"/><circle class="jet j2" cx="50" cy="30" r="3"/><circle class="jet j2" style="animation-delay:-.6s" cx="50" cy="30" r="3"/></g>';
  }
  function stonePath(b, vertical) {
    var x = b.x * 100, y = b.y * 100, w = b.w * 100, h = b.h * 100, f = '', R = rnd(x * 7 + y * 13 + 3), i, n, sn = b.snow;
    f += '<rect x="' + (x + 6) + '" y="' + (y + 6) + '" width="' + (w - 12) + '" height="' + (h - 12) + '" rx="14" fill="' + (sn ? '#EAF2FA' : '#E8D2A6') + '" stroke="' + (sn ? '#B7CBE0' : '#CDAA6E') + '" stroke-width="5"/>';
    n = Math.round((vertical ? h : w) / 22);
    for (i = 0; i < n; i++) {
      var a = vertical ? x + 26 + R() * (w - 52) : x + 14 + i * 22 + R() * 6, c = vertical ? y + 14 + i * 22 + R() * 6 : y + 26 + R() * (h - 52);
      f += '<ellipse cx="' + a + '" cy="' + c + '" rx="' + (9 + R() * 5) + '" ry="' + (6 + R() * 3) + '" fill="' + (sn ? ['#fff', '#DCE9F5', '#F2F8FF'][i % 3] : ['#F6E8C6', '#DFC48F', '#EAD3A2'][i % 3]) + '" stroke="' + (sn ? '#B7CBE0' : '#CDAA6E') + '" stroke-width="1.5"/>';
      f += '<ellipse cx="' + (vertical ? x + 20 + R() * (w - 40) : x + 20 + i * 22) + '" cy="' + (vertical ? y + 22 + i * 22 : y + 20 + R() * (h - 40)) + '" rx="7" ry="5" fill="' + (sn ? ['#DCE9F5', '#fff'][i % 2] : ['#DFC48F', '#F3E4C0'][i % 2]) + '"/>';
    }
    return f;
  }

  /* ───────── công trình lớn đặt được trong vườn (kích thước theo ô: w×h) ───────── */
  var BIG = {
    hutbig: function () { return ART.hut({ x: 0, y: 0 }); },
    cabinbig: function () { return ART.cabin({ x: 0, y: 0 }); },
    pondbig: function () {
      return '<path d="' + blob(100, 100, 94, 90, 21) + '" fill="#D8C79A"/><path d="' + blob(100, 100, 88, 84, 21) + '" fill="' + F('water') + '" stroke="#C9B58A" stroke-width="3"/><path d="' + blob(94, 92, 62, 54, 4) + '" fill="#fff" opacity=".13"/>' + rimStones(100, 100, 92, 88, 14, 3) +
        '<g fill="none" stroke="#fff" stroke-width="3" opacity=".75"><circle class="ripple" cx="84" cy="116" r="16"/><circle class="ripple" style="animation-delay:-1.3s" cx="124" cy="82" r="12"/></g>' + lily(70, 76) + lily(128, 124) + lily(104, 100) + duck(138, 76) + cattail(24, 150) + cattail(36, 160);
    },
    bridge: function () {
      var f = shadow(150, 92, 140, 8);
      f += '<path d="M0 82 Q150 -4 300 82 L300 94 L0 94Z" fill="' + F('stone') + '" stroke="#98A3B2" stroke-width="2.5"/><path d="M40 94 Q150 30 260 94" fill="#5B8FB8" opacity=".65"/>';
      f += '<path d="M6 66 Q150 -22 294 66 L294 82 Q150 8 6 82Z" fill="' + F('white') + '" stroke="#98A3B2" stroke-width="3"/>';
      f += '<path d="M16 60 Q150 -20 284 60" fill="none" stroke="#fff" stroke-width="5" opacity=".7"/>';
      for (var i = 0; i < 9; i++) { var tx = 30 + i * 30, ty = 70 - Math.sin((i + 0.5) / 9 * Math.PI) * 60 + 4; f += '<rect x="' + (tx - 3) + '" y="' + (ty - 14) + '" width="6" height="22" rx="2" fill="#fff" stroke="#98A3B2"/>'; }
      f += '<path d="M24 42 Q150 -42 276 42" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/><path d="M24 42 Q150 -42 276 42" fill="none" stroke="#98A3B2" stroke-width="2"/>';
      [[30, 54], [150, 4], [270, 54]].forEach(function (p) { f += '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><rect x="-4" y="-22" width="8" height="32" fill="url(#bg-white)" stroke="#98A3B2"/><rect x="-9" y="-36" width="18" height="16" rx="4" fill="#FFF3B8" stroke="#98A3B2" stroke-width="2"/><circle cx="0" cy="-28" r="4" class="win" fill="#FFF3B8"/><g class="lampg"><circle cx="0" cy="-28" r="20" fill="#FFD76A" opacity=".5"/></g></g>'; });
      [[70, 40], [230, 40]].forEach(function (p) { f += '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><rect x="-16" y="0" width="32" height="12" rx="3" fill="' + F('woodD') + '" stroke="' + OUT + '"/><circle cx="-8" cy="-3" r="5.5" fill="#FF6B8A"/><circle cx="2" cy="-6" r="5.5" fill="#FFD23F"/><circle cx="10" cy="-2" r="5.5" fill="#FF8FB8"/></g>'; });
      return f;
    },
    flowerarch: function () {
      var f = shadow(150, 94, 140, 7);
      f += '<g fill="url(#bg-white)" stroke="#98A3B2" stroke-width="2.5"><rect x="10" y="22" width="14" height="72" rx="3"/><rect x="276" y="22" width="14" height="72" rx="3"/><path d="M10 28 Q150 -50 290 28 L290 42 Q150 -26 10 42Z"/></g>';
      var cols = ['#FF6B8A', '#FFD23F', '#B57BFF', '#FF9EDD', '#fff', '#FF8A3D'], R = rnd(42), i;
      for (i = 0; i < 46; i++) { var t = i / 45, px = 8 + t * 284, py = 34 - Math.sin(t * Math.PI) * 56 + 24; f += '<circle cx="' + px.toFixed(1) + '" cy="' + (py + R() * 10 - 4).toFixed(1) + '" r="' + (5 + R() * 4).toFixed(1) + '" fill="' + cols[i % cols.length] + '" stroke="rgba(0,0,0,.12)"/><circle cx="' + (px + 1).toFixed(1) + '" cy="' + (py + R() * 10 - 4).toFixed(1) + '" r="3.5" fill="#4FB04A"/>'; }
      for (i = 0; i < 10; i++) { f += '<circle cx="' + (17 + R() * 4) + '" cy="' + (34 + i * 7) + '" r="5" fill="' + cols[i % cols.length] + '"/><circle cx="' + (283 - R() * 4) + '" cy="' + (34 + i * 7) + '" r="5" fill="' + cols[(i + 2) % cols.length] + '"/>'; }
      var fl = '<path d="M0 14 q-4 -22 4 -36 q8 6 4 -2 q4 14 6 38z" fill="#FF8FB8" stroke="#C0489D" stroke-width="1.5"/><circle cx="2" cy="-30" r="6" fill="#FF8FB8" stroke="#C0489D"/><path d="M8 -30l12 3" stroke="#FF8A3D" stroke-width="3" stroke-linecap="round"/><path d="M5 14v14M10 14v14" stroke="#E0A0C0" stroke-width="2"/>';
      f += '<g transform="translate(46 80)">' + fl + '</g><g transform="translate(254 82) scale(-1 1)">' + fl + '</g>';
      return f;
    },
    gazebo: function () {
      var f = shadow(100, 188, 94, 12);
      f += '<ellipse cx="100" cy="168" rx="86" ry="22" fill="url(#bg-white)" stroke="#98A3B2" stroke-width="2.5"/><ellipse cx="100" cy="160" rx="86" ry="22" fill="url(#bg-stone)" stroke="#98A3B2" stroke-width="2.5"/>';
      [[30, 92], [64, 100], [136, 100], [170, 92]].forEach(function (p) { f += '<rect x="' + p[0] + '" y="' + p[1] + '" width="9" height="74" fill="url(#bg-white)" stroke="#98A3B2" stroke-width="2"/>'; });
      f += '<path d="M30 124 Q100 136 170 124 M30 148 Q100 158 170 148" fill="none" stroke="#98A3B2" stroke-width="3"/><path d="M34 126 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0 q8 12 16 0" fill="none" stroke="#fff" stroke-width="3.5"/>';
      f += '<path d="M-2 96 L100 8 L202 96 Q150 80 100 84 Q50 80 -2 96Z" fill="' + F('roofB') + '" stroke="#2F479E" stroke-width="3.5" stroke-linejoin="round"/><path d="M100 8 L40 90M100 8 L100 86M100 8 L160 90" stroke="#A9BCFF" stroke-width="2.2" opacity=".8"/>';
      f += '<circle cx="100" cy="10" r="8" fill="' + F('gold') + '" stroke="#B88510" stroke-width="2"/><path d="M100 2v-14" stroke="#B88510" stroke-width="3"/>';
      f += '<g transform="translate(78 138)"><rect x="0" y="0" width="44" height="10" rx="3" fill="' + F('woodD') + '" stroke="' + OUT + '"/><rect x="4" y="10" width="5" height="12" fill="' + OUT + '"/><rect x="35" y="10" width="5" height="12" fill="' + OUT + '"/></g><circle cx="48" cy="120" r="5" fill="#FF8FB8"/><circle cx="154" cy="122" r="5" fill="#B57BFF"/>';
      return f;
    },
    clocktower: function () {
      var f = shadow(50, 192, 44, 9);
      f += '<rect x="18" y="62" width="64" height="130" rx="3" fill="' + F('brick') + '" stroke="#8F4F3A" stroke-width="3"/><path d="M18 90h64M18 120h64M18 150h64M18 176h64M34 62v28M62 90v30M34 120v30M62 150v26" stroke="#9A5A44" stroke-width="2"/>';
      f += '<rect x="10" y="40" width="80" height="26" rx="4" fill="' + F('wall') + '" stroke="#CDB57E" stroke-width="2.5"/>';
      f += '<circle cx="50" cy="48" r="26" fill="#fff" stroke="' + F('gold') + '" stroke-width="7"/><circle cx="50" cy="48" r="26" fill="none" stroke="#B88510" stroke-width="1.5"/><g stroke="#4A4A55" stroke-width="2.5" stroke-linecap="round"><path d="M50 48V30"/><path d="M50 48l12 8"/></g><circle cx="50" cy="48" r="3.5" fill="#4A4A55"/><path d="M50 24v4M50 68v4M26 48h4M70 48h4" stroke="#4A4A55" stroke-width="2.5"/>';
      f += '<polygon points="8,34 50,-16 92,34" fill="' + F('roofR') + '" stroke="#962B25" stroke-width="3.5" stroke-linejoin="round"/><circle cx="50" cy="-18" r="5" fill="' + F('gold') + '" stroke="#B88510" stroke-width="2"/>';
      f += '<rect x="38" y="150" width="24" height="42" rx="12" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="2.5"/><rect x="40" y="86" width="20" height="30" rx="10" fill="' + F('glass') + '" stroke="#5E8DB0" stroke-width="2"/><rect x="43" y="90" width="14" height="22" rx="7" class="win"/>';
      return f;
    },
    fountainbig: function () {
      var f = shadow(100, 190, 94, 12);
      f += '<ellipse cx="100" cy="148" rx="92" ry="40" fill="url(#bg-stone)" stroke="#7C8796" stroke-width="3"/><ellipse cx="100" cy="138" rx="78" ry="30" fill="' + F('water') + '" stroke="#98A3B2" stroke-width="5"/>';
      f += '<g fill="none" stroke="#fff" stroke-width="2.5" opacity=".7"><circle class="ripple" cx="62" cy="140" r="14"/><circle class="ripple" style="animation-delay:-1.2s" cx="140" cy="146" r="12"/></g>';
      f += '<rect x="90" y="82" width="20" height="60" fill="url(#bg-stone)" stroke="#7C8796" stroke-width="2.5"/><ellipse cx="100" cy="96" rx="40" ry="14" fill="url(#bg-stone)" stroke="#7C8796" stroke-width="2.5"/><ellipse cx="100" cy="92" rx="32" ry="9" fill="' + F('water') + '"/>';
      f += '<rect x="94" y="52" width="12" height="40" fill="url(#bg-stone)" stroke="#7C8796" stroke-width="2"/><ellipse cx="100" cy="56" rx="22" ry="8" fill="url(#bg-stone)" stroke="#7C8796" stroke-width="2"/><ellipse cx="100" cy="54" rx="16" ry="5" fill="' + F('water') + '"/><circle cx="100" cy="42" r="8" fill="' + F('gold') + '" stroke="#B88510" stroke-width="2"/>';
      f += '<g fill="#CFF0FF" opacity=".95" transform="translate(50 -2)"><circle class="jet" cx="50" cy="40" r="4"/><circle class="jet" style="animation-delay:-.4s" cx="50" cy="40" r="3.4"/><circle class="jet" style="animation-delay:-.8s" cx="50" cy="40" r="4"/><circle class="jet j2" cx="50" cy="40" r="3.4"/><circle class="jet j2" style="animation-delay:-.6s" cx="50" cy="40" r="3.4"/></g>';
      return f;
    },
    glasshouse: function () {
      var f = shadow(150, 192, 140, 12);
      f += '<rect x="14" y="70" width="272" height="118" rx="4" fill="url(#bg-glass)" stroke="#5E8DB0" stroke-width="3" opacity=".95"/><rect x="14" y="70" width="272" height="118" fill="#7ED87A" opacity=".18"/>';
      f += '<g stroke="#fff" stroke-width="4"><path d="M14 110h272M14 150h272M62 70v118M110 70v118M158 70v118M206 70v118M254 70v118"/></g>';
      f += '<path d="M2 76 L90 8 L210 8 L298 76 Z" fill="url(#bg-glass)" stroke="#5E8DB0" stroke-width="3.5" stroke-linejoin="round"/><g stroke="#fff" stroke-width="3.5"><path d="M30 52 L112 8M60 30 L130 8M270 52 L188 8M240 30 L170 8M150 8 L150 76M96 8 L84 76M204 8 L216 76"/></g><path d="M2 76 H298" stroke="#5E8DB0" stroke-width="5"/>';
      [[44, 168, '#FF6B8A'], [92, 160, '#FFD23F'], [140, 170, '#B57BFF'], [188, 160, '#FF8FB8'], [236, 168, '#FF8A3D']].forEach(function (p) { f += '<g transform="translate(' + p[0] + ' ' + p[1] + ')"><path d="M0 0 q-2 -18 0 -32" stroke="#2E8B57" stroke-width="3.5" fill="none"/><path d="M0 -14 q-12 -2 -14 -12 q10 0 14 12zM0 -20 q12 -2 14 -12 q-10 0 -14 12z" fill="#4FB04A"/><circle cx="0" cy="-36" r="8" fill="' + p[2] + '" stroke="rgba(0,0,0,.15)"/><circle cx="0" cy="-36" r="3" fill="#FFE14D"/></g>'; });
      f += '<rect x="126" y="130" width="48" height="58" rx="3" fill="url(#bg-glass)" stroke="#5E8DB0" stroke-width="3"/><path d="M150 130v58" stroke="#5E8DB0" stroke-width="3"/><circle cx="144" cy="162" r="3" fill="#FFD23F"/><circle cx="156" cy="162" r="3" fill="#FFD23F"/>';
      f += '<path d="M20 76 Q60 40 110 20" fill="none" stroke="#fff" stroke-width="4" opacity=".6"/><rect x="0" y="184" width="300" height="12" rx="3" fill="url(#bg-stone)" stroke="#98A3B2"/>';
      return f;
    },
    castle: function () {
      var f = shadow(150, 194, 146, 12);
      f += '<rect x="30" y="96" width="240" height="96" rx="4" fill="url(#bg-stone)" stroke="#7C8796" stroke-width="3"/><path d="M30 126h240M30 158h240M70 96v30M130 126v32M190 96v30M250 126v32M90 158v34M210 158v34" stroke="#A3ABB6" stroke-width="2"/>';
      f += '<g fill="url(#bg-stone)" stroke="#7C8796" stroke-width="2.5">' + [34, 62, 90, 118, 178, 206, 234].map(function (x) { return '<rect x="' + x + '" y="84" width="18" height="16"/>'; }).join('') + '</g>';
      [[0, 60], [248, 60]].forEach(function (t) { var tx = t[0]; f += '<rect x="' + tx + '" y="46" width="52" height="146" rx="3" fill="url(#bg-stone)" stroke="#7C8796" stroke-width="3"/><polygon points="' + (tx - 6) + ',50 ' + (tx + 26) + ',-14 ' + (tx + 58) + ',50" fill="' + F('roofB') + '" stroke="#2F479E" stroke-width="3.5" stroke-linejoin="round"/><path d="M' + (tx + 26) + ' -14v-22" stroke="' + OUT + '" stroke-width="3"/><path class="flag" d="M' + (tx + 26) + ' -36l22 7-22 8z" fill="#E5334B" stroke="#962B25"/><rect x="' + (tx + 17) + '" y="70" width="18" height="30" rx="9" fill="#fff" stroke="#5E4A9E" stroke-width="2.5"/><rect x="' + (tx + 21) + '" y="74" width="10" height="22" rx="5" class="win"/><rect x="' + (tx + 17) + '" y="120" width="18" height="30" rx="9" fill="#fff" stroke="#5E4A9E" stroke-width="2.5"/><rect x="' + (tx + 21) + '" y="124" width="10" height="22" rx="5" class="win"/>'; });
      f += '<rect x="106" y="44" width="88" height="148" rx="3" fill="url(#bg-white)" stroke="#7C8796" stroke-width="3"/><polygon points="98,50 150,-34 202,50" fill="' + F('roofR') + '" stroke="#962B25" stroke-width="3.5" stroke-linejoin="round"/><path d="M150 -34v-24" stroke="' + OUT + '" stroke-width="3"/><path class="flag" d="M150 -58l26 8-26 9z" fill="#FFD23F" stroke="#B88510"/>';
      f += '<circle cx="150" cy="86" r="14" fill="#fff" stroke="#5E4A9E" stroke-width="3"/><circle cx="150" cy="86" r="9" class="win"/><path d="M150 77v18M141 86h18" stroke="#fff" stroke-width="2"/>';
      f += '<path d="M120 192v-52a30 30 0 0 1 60 0v52z" fill="' + F('wood') + '" stroke="' + OUT + '" stroke-width="3.5"/><path d="M150 110v82M130 150h40M130 170h40" stroke="' + OUT + '" stroke-width="2.2"/><circle cx="140" cy="168" r="3.5" fill="#FFD23F"/><circle cx="160" cy="168" r="3.5" fill="#FFD23F"/>';
      f += '<path d="M120 192h60l8 8h-76z" fill="' + F('red') + '" stroke="#962B25" stroke-width="2"/>';
      return f;
    }
  };
  var BIGSIZE = { hutbig: [2, 2], cabinbig: [2, 2], pondbig: [2, 2], bridge: [3, 1], flowerarch: [3, 1], gazebo: [2, 2], clocktower: [1, 2], fountainbig: [2, 2], glasshouse: [3, 2], castle: [3, 2] };
  var DEFSTAG = '<defs>' + DEFS + '</defs>';

  // Bọc hình bằng bộ lọc ánh sáng (class bvL/bvM — chỉ bật ở chế độ đồ hoạ cao); vầng sáng đèn và khói được tách ra ngoài để không bị đổ khối
  function lit(raw, cls) {
    var ex = [];
    raw = raw.replace(/<g class="lampg">[\s\S]*?<\/g>|<circle class="smoke"[^>]*\/>/g, function (m) { ex.push(m); return ''; });
    return '<g class="' + cls + '">' + raw + '</g>' + ex.join('');
  }
  var NOBEVEL = { willow: 1, sea: 1, campfire: 1, river: 1 };
  var uidN = 0;
  function uniq(s) { var n = ++uidN; return s.replace(/(zw-(?:ground-[a-z]+|water)|bg-[A-Za-z0-9]+)/g, function (m) { return m + '-' + n; }); }

  /* svg của một công trình lớn (dùng trong khu và trong cửa hàng) */
  function bigSvg(id) {
    var sz = BIGSIZE[id], fn = BIG[id]; if (!sz || !fn) return '';
    var vb = id === 'castle' ? '0 -66 300 276' : id === 'clocktower' ? '0 -30 100 230' : id === 'gazebo' ? '0 -20 200 220' : id === 'hutbig' || id === 'cabinbig' ? '0 -6 200 204' : '0 -10 ' + sz[0] * 100 + ' ' + (sz[1] * 100 + 10);
    return uniq('<svg class="gd-bigsvg" viewBox="' + vb + '" preserveAspectRatio="xMidYMax meet" aria-hidden="true">' + DEFSTAG + lit(fn(), 'bvM') + '</svg>');
  }

  /* ───────── nền từng khu + lắp ráp ───────── */
  var THEME = {
    cottage: { g1: '#7FCB62', g2: '#62B24F' }, hill: { g1: '#8ED36A', g2: '#6EBD57' }, river: { g1: '#7BC966', g2: '#5DAF55' }, pond: { g1: '#78C06A', g2: '#5BA85A' },
    forest: { g1: '#5DA659', g2: '#468F4B' }, palace: { g1: '#8FD27E', g2: '#6FBA68' }, winter: { g1: '#F4F9FF', g2: '#CDE0F2' }, beach: { g1: '#FBE8AE', g2: '#E7CB80' }, magic: { g1: '#5E43A6', g2: '#33236F' }
  };
  var cache = {};
  function build(z) {
    if (cache[z.id]) return cache[z.id];
    var th = THEME[z.id] || THEME.cottage, R = rnd(z.i * 977 + 11), s = '', i, gx, gy;
    s += '<svg class="gd-zsvg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs>' + DEFS +
      '<linearGradient id="zw-ground-' + z.id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + th.g1 + '"/><stop offset="1" stop-color="' + th.g2 + '"/></linearGradient>' +
      '<filter id="bg-noiseA" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .018" numOctaves="3" seed="' + (z.i * 7 + 3) + '"/><feColorMatrix type="matrix" values="0 0 0 0 .05  0 0 0 0 .2  0 0 0 0 .05  0 0 0 1.1 -.42"/></filter>' +
      '<filter id="bg-noiseB" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".5" numOctaves="2" seed="' + (z.i * 5 + 1) + '"/><feColorMatrix type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .9 -.45"/></filter></defs>';
    s += '<rect width="' + W + '" height="' + H + '" fill="url(#zw-ground-' + z.id + ')"/>';
    s += '<rect width="' + W + '" height="' + H + '" filter="url(#bg-noiseA)" opacity="' + (z.id === 'winter' ? '.22' : z.id === 'magic' ? '.5' : '.34') + '" style="mix-blend-mode:multiply"/><rect width="' + W + '" height="' + H + '" filter="url(#bg-noiseB)" opacity=".16"/>';
    for (i = 0; i < 9; i++) s += '<ellipse cx="' + (R() * W) + '" cy="' + (R() * H) + '" rx="' + (50 + R() * 90) + '" ry="' + (30 + R() * 50) + '" fill="' + (z.id === 'magic' ? 'rgba(160,120,255,.14)' : z.id === 'winter' ? 'rgba(150,185,225,.22)' : z.id === 'beach' ? 'rgba(210,170,90,.18)' : 'rgba(255,255,255,.1)') + '"/>';
    if (z.id === 'winter') { for (i = 0; i < 60; i++) { gx = R() * W; gy = R() * H; s += '<circle cx="' + gx + '" cy="' + gy + '" r="2.4" fill="#fff"/>'; } }
    else if (z.id === 'beach') { for (i = 0; i < 40; i++) { gx = R() * W; gy = 100 + R() * 400; s += '<path d="M' + gx + ' ' + gy + 'q8 -5 16 0" stroke="rgba(190,150,70,.5)" stroke-width="2" fill="none" stroke-linecap="round"/>'; } for (i = 0; i < 7; i++) s += '<path d="M' + (R() * W) + ' ' + (130 + R() * 340) + 'l5 -9l5 9z" fill="#FF8FB8" opacity=".85"/>'; }
    else if (z.id === 'magic') { for (i = 0; i < 70; i++) s += '<circle class="spk" style="animation-delay:' + (-R() * 3).toFixed(2) + 's" cx="' + (R() * W) + '" cy="' + (R() * H) + '" r="' + (1.2 + R() * 2).toFixed(1) + '" fill="#E9D8FF"/>'; }
    else if (!th.noGrass) { for (i = 0; i < 90; i++) { gx = R() * W; gy = R() * H; s += '<path d="M' + gx + ' ' + gy + 'l-3 -8m3 8l0 -10m0 10l3 -8" stroke="rgba(30,100,30,.35)" stroke-width="2" stroke-linecap="round"/>'; } for (i = 0; i < 36; i++) s += '<circle cx="' + (R() * W) + '" cy="' + (R() * H) + '" r="3.4" fill="' + ['#fff', '#FFE14D', '#FF9EBD', '#C9A8FF'][i % 4] + '"/>'; }
    if (th.ground) s += th.ground(R, W, H);   // hoạ tiết nền riêng của khu mới (không nằm trong phong cảnh)
    if (z.id === 'winter') for (i = 0; i < 34; i++) s += '<circle class="snowf" style="animation-delay:' + (-R() * 7).toFixed(2) + 's;animation-duration:' + (5 + R() * 4).toFixed(1) + 's" cx="' + (R() * W).toFixed(0) + '" cy="-10" r="' + (2 + R() * 2.4).toFixed(1) + '" fill="#fff" opacity=".9"/>';
    s += '</svg>';
    // lớp phong cảnh: chỉ phủ vùng đất gốc 7×5 (đất mở rộng là đất trống để học sinh xây)
    s += '<svg class="gd-zscn" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs>' + DEFS + '<linearGradient id="zw-water" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#62C6F6"/><stop offset="1" stop-color="#A8E4FF"/></linearGradient></defs>';
    // phong cảnh dựng sẵn: vẽ theo thứ tự từ trên xuống dưới để che nhau đúng
    z.blocks.slice().sort(function (a, b) { return (a.y + a.h) - (b.y + b.h) || a.x - b.x; }).forEach(function (b) { if (ART[b.k]) s += lit(ART[b.k](b), NOBEVEL[b.k] ? '' : 'bvL'); });
    s += lights(z, R);
    s += '</svg>';
    return (cache[z.id] = s);
  }
  // Ánh nắng xuyên tán lá / ánh sáng lung linh tuỳ khu (vẽ mờ, đặt trên cùng)
  function lights(z, R) {
    var f = '', i;
    if (z.id === 'forest' || z.id === 'cottage' || z.id === 'pond' || z.id === 'hill') {
      f += '<g class="rays" pointer-events="none">';
      for (i = 0; i < 4; i++) { var rx = 80 + i * 150 + R() * 40; f += '<polygon points="' + rx + ',0 ' + (rx + 46) + ',0 ' + (rx + 150) + ',500 ' + (rx + 40) + ',500" fill="url(#bg-ray)" style="animation-delay:' + (-i * 1.7) + 's"/>'; }
      f += '</g>';
    }
    return f;
  }
  function zoneSvg(z) { return uniq(build(z)); }

  var API = { DEFS: DEFS, uniq: uniq, lit: lit, zoneSvg: zoneSvg, bigSvg: bigSvg, BIGSIZE: BIGSIZE, THEME: THEME, ART: ART, BIG: BIG };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenWorld = API;
})(typeof window !== 'undefined' ? window : this);
