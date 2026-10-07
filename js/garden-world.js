/* EWT Garden — phong cảnh dựng sẵn cho từng khu (nhà, cung điện, sông, hồ, chòi lá…). Tự vẽ bằng SVG, không dùng hình bên ngoài.
   Mỗi khu là lưới 7×5 ô, mỗi ô 100 đơn vị; học sinh chỉ xây trên các ô còn trống (xem ZONES trong garden-data.js). */
(function (root) {
  'use strict';
  var W = 700, H = 500;

  function rnd(seed) { var s = seed || 1; return function () { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; }; }
  function T(x, y, inner, extra) { return '<g transform="translate(' + x + ' ' + y + ')"' + (extra || '') + '>' + inner + '</g>'; }
  function shadow(cx, cy, rx, ry) { return '<ellipse cx="' + cx + '" cy="' + cy + '" rx="' + rx + '" ry="' + ry + '" fill="rgba(20,60,20,.28)"/>'; }

  /* ───────── từng loại phong cảnh ───────── */
  var ART = {
    house: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(100, 188, 98, 12) +
        '<rect x="14" y="84" width="172" height="98" rx="4" fill="#FFE9C7"/><rect x="14" y="84" width="172" height="10" fill="#F2D3A0"/><path d="M14 120h172M14 150h172" stroke="#F0D6A8" stroke-width="2"/>' +
        '<rect x="138" y="22" width="24" height="56" fill="#B5553C"/><rect x="134" y="16" width="32" height="9" rx="2" fill="#8F3F2B"/>' +
        '<polygon points="0,96 100,8 200,96" fill="#E5584F"/><polygon points="0,96 100,8 100,22 20,96" fill="#F27A70" opacity=".6"/><polyline points="0,96 100,8 200,96" fill="none" stroke="#B93A32" stroke-width="6" stroke-linejoin="round"/>' +
        '<circle cx="100" cy="62" r="12" fill="#6F4421"/><circle cx="100" cy="62" r="8" class="win"/>' +
        '<rect x="84" y="128" width="32" height="54" rx="16" ry="16" fill="#8A5A2E"/><circle cx="108" cy="158" r="3" fill="#FFD23F"/><rect x="76" y="180" width="48" height="8" rx="3" fill="#C9B79A"/>' +
        '<rect x="28" y="110" width="40" height="36" rx="4" fill="#fff"/><rect x="33" y="115" width="30" height="26" class="win"/><path d="M48 115v26M33 128h30" stroke="#fff" stroke-width="3"/><rect x="24" y="146" width="48" height="8" rx="3" fill="#8A5A2E"/><circle cx="34" cy="143" r="5" fill="#FF6B8A"/><circle cx="48" cy="141" r="5" fill="#FFD23F"/><circle cx="62" cy="143" r="5" fill="#B57BFF"/>' +
        '<rect x="132" y="110" width="40" height="36" rx="4" fill="#fff"/><rect x="137" y="115" width="30" height="26" class="win"/><path d="M152 115v26M137 128h30" stroke="#fff" stroke-width="3"/><rect x="128" y="146" width="48" height="8" rx="3" fill="#8A5A2E"/><circle cx="138" cy="143" r="5" fill="#FF8FB8"/><circle cx="152" cy="141" r="5" fill="#fff"/><circle cx="166" cy="143" r="5" fill="#FF6B8A"/>' +
        '<circle class="smoke" cx="150" cy="14" r="8" fill="#fff"/><circle class="smoke" style="animation-delay:-1.4s" cx="150" cy="14" r="7" fill="#F2F2F2"/><circle class="smoke" style="animation-delay:-2.7s" cx="150" cy="14" r="8" fill="#fff"/>');
    },
    pathv: function (b) { return stonePath(b, true); },
    pathh: function (b) { return stonePath(b, false); },
    gate: function (b) {
      return T(b.x * 100, b.y * 100,
        '<rect x="2" y="18" width="14" height="80" rx="3" fill="#8A5A2E"/><rect x="84" y="18" width="14" height="80" rx="3" fill="#8A5A2E"/>' +
        '<path d="M-6 26 Q50 -14 106 26 L106 38 Q50 0 -6 38Z" fill="#B9824A"/><path d="M-6 26 Q50 -14 106 26" fill="none" stroke="#6F4421" stroke-width="4"/>' +
        '<rect x="26" y="2" width="48" height="18" rx="5" fill="#FFF3D6" stroke="#6F4421" stroke-width="2.5"/><text x="50" y="15" text-anchor="middle" font-family="Be Vietnam Pro, sans-serif" font-weight="800" font-size="10" fill="#2E8B57">EWT</text>' +
        '<circle cx="9" cy="14" r="6" fill="#FFE27A"/><circle cx="91" cy="14" r="6" fill="#FFE27A"/><g class="lampg"><circle cx="9" cy="14" r="20" fill="#FFD76A" opacity=".5"/><circle cx="91" cy="14" r="20" fill="#FFD76A" opacity=".5"/></g>');
    },
    well: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(50, 90, 36, 8) + '<rect x="22" y="20" width="6" height="52" fill="#8A5A2E"/><rect x="72" y="20" width="6" height="52" fill="#8A5A2E"/>' +
        '<polygon points="12,26 50,4 88,26" fill="#B5553C"/><polyline points="12,26 50,4 88,26" fill="none" stroke="#8F3F2B" stroke-width="3"/>' +
        '<rect x="20" y="52" width="60" height="34" rx="6" fill="#B8BFC9"/><ellipse cx="50" cy="52" rx="30" ry="9" fill="#6F8FA8"/><ellipse cx="50" cy="52" rx="30" ry="9" fill="none" stroke="#98A1AD" stroke-width="4"/>' +
        '<path d="M26 62h48M32 72h36" stroke="#A3ABB6" stroke-width="2"/><path d="M50 26v24" stroke="#6F4421" stroke-width="2"/><rect x="44" y="46" width="12" height="9" rx="2" fill="#8A5A2E"/>');
    },
    windmill: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(100, 288, 84, 12) +
        '<polygon points="52,118 148,118 134,284 66,284" fill="#F4E6CA"/><path d="M58 156h84M62 196h76M65 236h70" stroke="#E2CFA6" stroke-width="3"/><polygon points="52,118 100,118 88,284 66,284" fill="#E9D8B4" opacity=".6"/>' +
        '<polygon points="38,122 100,50 162,122" fill="#C0443B"/><polyline points="38,122 100,50 162,122" fill="none" stroke="#8F2F28" stroke-width="5" stroke-linejoin="round"/>' +
        '<rect x="82" y="238" width="36" height="46" rx="18" fill="#8A5A2E"/><rect x="86" y="170" width="28" height="30" rx="14" fill="#fff"/><rect x="90" y="174" width="20" height="22" rx="10" class="win"/>' +
        '<g class="spin"><g transform="translate(100 76)">' +
        [0, 90, 180, 270].map(function (a) { return '<g transform="rotate(' + a + ')"><rect x="-4" y="-96" width="8" height="96" fill="#8A5A2E"/><rect x="4" y="-92" width="34" height="62" rx="2" fill="#FFF6E2" stroke="#8A5A2E" stroke-width="3"/><path d="M4 -76h34M4 -60h34M4 -44h34M21 -92v62" stroke="#E2CFA6" stroke-width="2"/></g>'; }).join('') +
        '<circle r="9" fill="#6F4421"/></g></g>');
    },
    river: function (b) {
      var x = b.x * 100, y = b.y * 100, h = b.h * 100, br = y + 200, f = '';
      f += '<rect x="' + (x - 7) + '" y="' + y + '" width="114" height="' + h + '" fill="#EAD9A6"/><rect x="' + x + '" y="' + y + '" width="100" height="' + h + '" fill="url(#zw-water)"/>';
      f += '<g fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".65"><path class="flow" d="M' + (x + 22) + ' ' + y + ' q12 60 0 120 t0 120 t0 120 t0 120"/><path class="flow" style="animation-delay:-1.1s" d="M' + (x + 58) + ' ' + y + ' q-12 60 0 120 t0 120 t0 120 t0 120"/><path class="flow" style="animation-delay:-2.1s" d="M' + (x + 84) + ' ' + y + ' q10 60 0 120 t0 120 t0 120 t0 120"/></g>';
      f += lily(x + 30, y + 52) + lily(x + 72, y + 410) + lily(x + 64, y + 160);
      f += T(x - 12, br + 14, '<rect x="0" y="6" width="124" height="68" rx="6" fill="#B9824A"/><rect x="0" y="6" width="124" height="9" rx="4" fill="#D9A566"/><path d="M20 6v68M40 6v68M60 6v68M80 6v68M100 6v68" stroke="#8A5A2E" stroke-width="3"/><rect x="0" y="0" width="124" height="8" rx="3" fill="#7A4A1E"/><rect x="0" y="70" width="124" height="8" rx="3" fill="#7A4A1E"/><rect x="4" y="-8" width="9" height="32" fill="#6F4421"/><rect x="111" y="-8" width="9" height="32" fill="#6F4421"/><rect x="4" y="60" width="9" height="30" fill="#6F4421"/><rect x="111" y="60" width="9" height="30" fill="#6F4421"/>');
      return f;
    },
    willow: function (b) {
      var x = b.x * 100, y = b.y * 100, f = shadow(x + 50, y + 92, 40, 8) + '<g class="sway b" style="transform-origin:' + (x + 50) + 'px ' + (y + 92) + 'px"><rect x="' + (x + 43) + '" y="' + (y + 40) + '" width="14" height="54" rx="4" fill="#8A5A2E"/><ellipse cx="' + (x + 50) + '" cy="' + (y + 34) + '" rx="46" ry="30" fill="#5DB35B"/><ellipse cx="' + (x + 38) + '" cy="' + (y + 26) + '" rx="22" ry="14" fill="#7BCB6F" opacity=".7"/>';
      for (var i = 0; i < 9; i++) f += '<path d="M' + (x + 10 + i * 10) + ' ' + (y + 46) + ' q' + (i % 2 ? 4 : -4) + ' 24 0 44" stroke="#4FA050" stroke-width="4" fill="none" stroke-linecap="round"/>';
      return f + '</g>';
    },
    dock: function (b) {
      var x = b.x * 100, y = b.y * 100;
      return T(x - 92, y + 22, '<rect x="0" y="6" width="130" height="38" rx="5" fill="#B9824A"/><path d="M18 6v38M36 6v38M54 6v38M72 6v38M90 6v38M108 6v38" stroke="#8A5A2E" stroke-width="3"/><rect x="0" y="0" width="130" height="7" rx="3" fill="#D9A566"/>') +
        T(x - 74, y + 66, '<g class="boat"><path d="M0 6 Q40 36 84 6 L72 0 Q40 18 12 0Z" fill="#C0392B"/><path d="M12 0 Q40 18 72 0" fill="none" stroke="#F4E3C0" stroke-width="3"/><rect x="38" y="-34" width="4" height="34" fill="#6F4421"/><path d="M42 -34 L68 -12 L42 -12Z" fill="#fff"/></g>');
    },
    pond: function (b) {
      var x = b.x * 100, y = b.y * 100, cx = x + 150, cy = y + 150, f = '', i, a;
      f += '<path d="M' + (cx - 138) + ' ' + cy + ' C' + (cx - 138) + ' ' + (cy - 100) + ' ' + (cx - 40) + ' ' + (cy - 140) + ' ' + cx + ' ' + (cy - 132) + ' C' + (cx + 60) + ' ' + (cy - 140) + ' ' + (cx + 140) + ' ' + (cy - 80) + ' ' + (cx + 136) + ' ' + (cy + 10) + ' C' + (cx + 132) + ' ' + (cy + 100) + ' ' + (cx + 50) + ' ' + (cy + 136) + ' ' + (cx - 10) + ' ' + (cy + 130) + ' C' + (cx - 90) + ' ' + (cy + 126) + ' ' + (cx - 138) + ' ' + (cy + 80) + ' ' + (cx - 138) + ' ' + cy + 'Z" fill="url(#zw-water)" stroke="#C9B58A" stroke-width="10"/>';
      var R = rnd(7);
      for (i = 0; i < 20; i++) { a = i / 20 * Math.PI * 2; f += '<ellipse cx="' + (cx + Math.cos(a) * (138 + R() * 6)) + '" cy="' + (cy + Math.sin(a) * (130 + R() * 6)) + '" rx="' + (11 + R() * 6) + '" ry="' + (8 + R() * 4) + '" fill="' + ['#B8BFC9', '#A3ABB6', '#C8D0D8'][i % 3] + '"/>'; }
      f += '<g fill="none" stroke="#fff" stroke-width="3" opacity=".7"><circle class="ripple" cx="' + (cx - 20) + '" cy="' + (cy + 20) + '" r="20"/><circle class="ripple" style="animation-delay:-1.3s" cx="' + (cx + 50) + '" cy="' + (cy - 30) + '" r="16"/></g>';
      [[-70, -40], [10, -60], [60, 30], [-30, 50], [-80, 40], [20, 0], [80, -20]].forEach(function (p, k) { f += '<ellipse cx="' + (cx + p[0]) + '" cy="' + (cy + p[1]) + '" rx="22" ry="13" fill="#4FAE4A"/><path d="M' + (cx + p[0]) + ' ' + (cy + p[1]) + 'l14 -6" stroke="#E8F7E0" stroke-width="2"/>'; if (k % 2 === 0) f += '<g transform="translate(' + (cx + p[0] - 2) + ' ' + (cy + p[1] - 8) + ')"><path d="M0 0q-10 -6 -6 -14q8 2 6 14zM0 0q10 -6 6 -14q-8 2 -6 14zM0 0q-2 -10 0 -16q2 6 0 16z" fill="#FF8FB8"/><circle cy="-4" r="3" fill="#FFD23F"/></g>'; });
      f += '<g class="duck"><g transform="translate(' + (cx + 20) + ' ' + (cy + 60) + ')"><ellipse rx="14" ry="9" fill="#fff"/><circle cx="11" cy="-7" r="6" fill="#fff"/><path d="M16 -7l8 2-8 2z" fill="#FF8A3D"/><circle cx="13" cy="-8" r="1.5" fill="#222"/></g></g>';
      f += cattail(cx - 120, cy + 100) + cattail(cx - 104, cy + 112) + cattail(cx + 112, cy - 96);
      return f;
    },
    pavilion: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(100, 188, 90, 12) + '<ellipse cx="100" cy="164" rx="82" ry="22" fill="#B9824A"/><ellipse cx="100" cy="158" rx="82" ry="22" fill="#D9A566"/>' +
        '<rect x="34" y="78" width="9" height="78" fill="#8A5A2E"/><rect x="157" y="78" width="9" height="78" fill="#8A5A2E"/><rect x="72" y="86" width="8" height="78" fill="#6F4421"/><rect x="120" y="86" width="8" height="78" fill="#6F4421"/>' +
        '<path d="M60 150h80" stroke="#8A5A2E" stroke-width="7" stroke-linecap="round"/>' +
        '<path d="M0 86 Q100 -26 200 86 Q150 70 100 74 Q50 70 0 86Z" fill="#D9B46A"/><path d="M0 86 Q100 -26 200 86" fill="none" stroke="#A8823C" stroke-width="5"/>' +
        '<g stroke="#B58F46" stroke-width="2.5" fill="none">' + [20, 45, 70, 100, 130, 155, 180].map(function (xx) { return '<path d="M' + (100 + (xx - 100) * .15) + ' 12 L' + xx + ' 84"/>'; }).join('') + '</g>' +
        '<circle cx="100" cy="14" r="7" fill="#8A5A2E"/>');
    },
    hut: function (b) {
      return T(b.x * 100, b.y * 100,
        shadow(100, 186, 92, 12) +
        '<rect x="30" y="90" width="140" height="92" rx="12" fill="#C98E55"/><path d="M30 118h140M30 148h140" stroke="#A9733E" stroke-width="3"/><path d="M60 90v92M100 90v92M140 90v92" stroke="#B5803E" stroke-width="2" opacity=".6"/>' +
        '<rect x="82" y="124" width="36" height="58" rx="18" fill="#6F4421"/><rect x="40" y="110" width="26" height="24" rx="4" fill="#FFF6E2"/><rect x="44" y="114" width="18" height="16" class="win"/><rect x="134" y="110" width="26" height="24" rx="4" fill="#FFF6E2"/><rect x="138" y="114" width="18" height="16" class="win"/>' +
        '<path d="M6 100 Q100 -34 194 100 Q150 88 100 90 Q50 88 6 100Z" fill="#DDB765"/><path d="M6 100 Q100 -34 194 100" fill="none" stroke="#A8823C" stroke-width="5"/>' +
        '<g stroke="#B58F46" stroke-width="2.5" fill="none">' + [22, 50, 80, 120, 150, 178].map(function (xx) { return '<path d="M' + (100 + (xx - 100) * .12) + ' 20 L' + xx + ' 98"/>'; }).join('') + '</g>' +
        '<circle class="smoke" cx="150" cy="40" r="7" fill="#fff"/><circle class="smoke" style="animation-delay:-2s" cx="150" cy="40" r="6" fill="#F2F2F2"/>');
    },
    campfire: function (b) {
      var x = b.x * 100, y = b.y * 100;
      return T(x, y, shadow(50, 84, 34, 8) + '<g class="lampg"><circle cx="50" cy="56" r="52" fill="#FFB23F" opacity=".4"/></g>' +
        [0, 45, 90, 135, 180, 225, 270, 315].map(function (a) { return '<circle cx="' + (50 + Math.cos(a * Math.PI / 180) * 32) + '" cy="' + (66 + Math.sin(a * Math.PI / 180) * 14) + '" r="7" fill="#A9B2BC"/>'; }).join('') +
        '<rect x="22" y="62" width="56" height="9" rx="4" fill="#6F4421" transform="rotate(-14 50 66)"/><rect x="22" y="62" width="56" height="9" rx="4" fill="#8A5A2E" transform="rotate(14 50 66)"/>' +
        '<g class="flame"><path d="M50 22 Q70 46 62 64 Q50 72 38 64 Q30 46 50 22Z" fill="#FF8A3D"/><path d="M50 38 Q62 54 56 64 Q50 68 44 64 Q38 54 50 38Z" fill="#FFD23F"/></g>' +
        '<rect x="4" y="74" width="26" height="9" rx="4" fill="#B9824A"/><rect x="72" y="76" width="26" height="9" rx="4" fill="#B9824A"/>');
    },
    palace: function (b) {
      var x = b.x * 100, y = b.y * 100, f = '', i;
      f += shadow(250, 192, 246, 10);
      f += '<rect x="0" y="96" width="500" height="94" rx="4" fill="#F6EEDC"/><rect x="0" y="96" width="500" height="10" fill="#E5D8BC"/>';
      for (i = 0; i < 5; i++) { f += '<rect x="' + (28 + i * 40) + '" y="122" width="22" height="40" rx="10" fill="#7DB5E8"/><rect x="' + (32 + i * 40) + '" y="126" width="14" height="32" rx="7" class="win"/>'; f += '<rect x="' + (300 + 20 + i * 40) + '" y="122" width="22" height="40" rx="10" fill="#7DB5E8"/><rect x="' + (324 + i * 40 - 0) + '" y="126" width="14" height="32" rx="7" class="win"/>'; }
      // tháp hai bên
      [[40, 0], [400, 0]].forEach(function (t) {
        f += '<rect x="' + t[0] + '" y="42" width="60" height="150" rx="3" fill="#FBF4E4"/><polygon points="' + (t[0] - 8) + ',46 ' + (t[0] + 30) + ',-18 ' + (t[0] + 68) + ',46" fill="#5B7CE8"/><polyline points="' + (t[0] - 8) + ',46 ' + (t[0] + 30) + ',-18 ' + (t[0] + 68) + ',46" fill="none" stroke="#3D5BC4" stroke-width="4" stroke-linejoin="round"/><rect x="' + (t[0] + 22) + '" y="64" width="16" height="28" rx="8" class="win"/><rect x="' + (t[0] + 22) + '" y="110" width="16" height="28" rx="8" class="win"/>' +
          '<path d="M' + (t[0] + 30) + ' -18v-22" stroke="#6F4421" stroke-width="3"/><path d="M' + (t[0] + 30) + ' -40l22 7-22 8z" fill="#E5334B" class="flag"/>';
      });
      // chính điện
      f += '<rect x="170" y="38" width="160" height="154" rx="4" fill="#FFFAEC"/><path d="M170 66h160" stroke="#E5D8BC" stroke-width="3"/>';
      f += '<path d="M190 38 Q250 -44 310 38Z" fill="#E8C24A"/><path d="M190 38 Q250 -44 310 38" fill="none" stroke="#C99A1E" stroke-width="4"/><path d="M250 -22v-24" stroke="#6F4421" stroke-width="3"/><path d="M250 -46l24 7-24 8z" fill="#E5334B" class="flag"/>';
      for (i = 0; i < 5; i++) f += '<rect x="' + (176 + i * 31) + '" y="70" width="10" height="122" fill="#F1E6C8"/>';
      f += '<path d="M212 192v-62a38 38 0 0 1 76 0v62z" fill="#8A5A2E"/><path d="M250 98v94" stroke="#6F4421" stroke-width="3"/><circle cx="240" cy="160" r="3" fill="#FFD23F"/><circle cx="260" cy="160" r="3" fill="#FFD23F"/>';
      f += '<rect x="192" y="76" width="22" height="34" rx="11" fill="#7DB5E8"/><rect x="286" y="76" width="22" height="34" rx="11" fill="#7DB5E8"/><circle cx="250" cy="60" r="12" fill="#fff" stroke="#E8C24A" stroke-width="4"/>';
      f += '<path d="M222 192h56l10 8h-76z" fill="#E5334B"/><rect x="150" y="184" width="200" height="12" rx="3" fill="#E5D8BC"/>';
      return T(x, y, f);
    },
    fountain: function (b) {
      var x = b.x * 100, y = b.y * 100;
      return T(x, y, shadow(50, 88, 40, 8) + '<ellipse cx="50" cy="68" rx="42" ry="20" fill="#B8BFC9"/><ellipse cx="50" cy="64" rx="36" ry="15" fill="url(#zw-water)"/><ellipse cx="50" cy="64" rx="36" ry="15" fill="none" stroke="#98A1AD" stroke-width="4"/>' +
        '<rect x="45" y="38" width="10" height="28" fill="#B8BFC9"/><ellipse cx="50" cy="40" rx="18" ry="6" fill="#C8D0D8"/>' +
        '<g fill="#BFE9FF" opacity=".95"><circle class="jet" cx="50" cy="30" r="3.5"/><circle class="jet" style="animation-delay:-.4s" cx="50" cy="30" r="3"/><circle class="jet" style="animation-delay:-.8s" cx="50" cy="30" r="3.5"/><circle class="jet j2" cx="50" cy="30" r="3"/><circle class="jet j2" style="animation-delay:-.6s" cx="50" cy="30" r="3"/></g>');
    }
  };
  function lily(x, y) { return '<ellipse cx="' + x + '" cy="' + y + '" rx="14" ry="8" fill="#4FAE4A"/><path d="M' + x + ' ' + y + 'l10 -4" stroke="#E8F7E0" stroke-width="2"/><circle cx="' + (x - 3) + '" cy="' + (y - 4) + '" r="4" fill="#FF8FB8"/>'; }
  function cattail(x, y) { return '<g class="sway b" style="transform-origin:' + x + 'px ' + y + 'px"><path d="M' + x + ' ' + y + 'v-44" stroke="#4E8A3A" stroke-width="4"/><rect x="' + (x - 4) + '" y="' + (y - 62) + '" width="8" height="24" rx="4" fill="#7A4A1E"/></g>'; }
  function stonePath(b, vertical) {
    var x = b.x * 100, y = b.y * 100, w = b.w * 100, h = b.h * 100, f = '', R = rnd(x * 7 + y * 13 + 3), i, n;
    f += '<rect x="' + (x + 6) + '" y="' + (y + 6) + '" width="' + (w - 12) + '" height="' + (h - 12) + '" rx="14" fill="#E8D2A6" stroke="#CDAA6E" stroke-width="5"/>';
    n = Math.round((vertical ? h : w) / 22);
    for (i = 0; i < n; i++) {
      var a = vertical ? x + 26 + R() * (w - 52) : x + 14 + i * 22 + R() * 6, c = vertical ? y + 14 + i * 22 + R() * 6 : y + 26 + R() * (h - 52);
      f += '<ellipse cx="' + a + '" cy="' + c + '" rx="' + (9 + R() * 5) + '" ry="' + (6 + R() * 3) + '" fill="' + ['#F3E4C0', '#DFC48F', '#EAD3A2'][i % 3] + '" stroke="#CDAA6E" stroke-width="1.5"/>';
      f += '<ellipse cx="' + (vertical ? x + 20 + R() * (w - 40) : x + 20 + i * 22) + '" cy="' + (vertical ? y + 22 + i * 22 : y + 20 + R() * (h - 40)) + '" rx="7" ry="5" fill="' + ['#DFC48F', '#F3E4C0'][i % 2] + '"/>';
    }
    return f;
  }

  /* ───────── nền từng khu + lắp ráp ───────── */
  var THEME = {
    cottage: { g1: '#7FCB62', g2: '#62B24F', edge: '#B98046' },
    hill: { g1: '#8ED36A', g2: '#6EBD57', edge: '#B98046' },
    river: { g1: '#7BC966', g2: '#5DAF55', edge: '#B98046' },
    pond: { g1: '#78C06A', g2: '#5BA85A', edge: '#9A7B4B' },
    forest: { g1: '#5DA659', g2: '#468F4B', edge: '#7A5230' },
    palace: { g1: '#8FD27E', g2: '#6FBA68', edge: '#C9B58A' }
  };
  var cache = {}, uidN = 0;
  // Mỗi lần vẽ dùng mã gradient riêng để nhiều bản vẽ cùng khu (bản đồ + khu đang xem) không giẫm lên nhau
  function zoneSvg(z) { var n = ++uidN; return build(z).replace(/zw-(ground-[a-z]+|water)/g, function (m) { return m + '-' + n; }); }
  function build(z) {
    if (cache[z.id]) return cache[z.id];
    var th = THEME[z.id] || THEME.cottage, R = rnd(z.i * 977 + 11), s = '', i;
    s += '<svg class="gd-zsvg" viewBox="0 0 ' + W + ' ' + H + '" preserveAspectRatio="none" aria-hidden="true"><defs>' +
      '<linearGradient id="zw-ground-' + z.id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + th.g1 + '"/><stop offset="1" stop-color="' + th.g2 + '"/></linearGradient>' +
      '<linearGradient id="zw-water" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#62C6F6"/><stop offset="1" stop-color="#A8E4FF"/></linearGradient></defs>';
    s += '<rect width="' + W + '" height="' + H + '" fill="url(#zw-ground-' + z.id + ')"/>';
    for (i = 0; i < 90; i++) { var gx = R() * W, gy = R() * H; s += '<path d="M' + gx + ' ' + gy + 'l-3 -8m3 8l0 -10m0 10l3 -8" stroke="rgba(30,100,30,.35)" stroke-width="2" stroke-linecap="round"/>'; }
    for (i = 0; i < 36; i++) s += '<circle cx="' + (R() * W) + '" cy="' + (R() * H) + '" r="3.4" fill="' + ['#fff', '#FFE14D', '#FF9EBD', '#C9A8FF'][i % 4] + '"/>';
    // phong cảnh dựng sẵn: vẽ theo thứ tự từ trên xuống dưới để che nhau đúng
    z.blocks.slice().sort(function (a, b) { return (a.y + a.h) - (b.y + b.h) || a.x - b.x; }).forEach(function (b) { if (ART[b.k]) s += ART[b.k](b); });
    s += '</svg>';
    return (cache[z.id] = s);
  }

  var API = { zoneSvg: zoneSvg, THEME: THEME, ART: ART };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTGardenWorld = API;
})(typeof window !== 'undefined' ? window : this);
