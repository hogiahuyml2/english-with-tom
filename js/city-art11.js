/* EWT City — ĐỒ HOẠ phần 11: ĐỢT MỚI ~100 món: nhà (dãy Pastel, nhà kênh, biệt thự…), cửa hàng, dịch vụ, trường, vui chơi, thể thao, công viên, giao thông,
   15 KỲ QUAN THẾ GIỚI + 12 NÔNG TRẠI QUỐC TẾ (dùng lại khối 3D của Garden: garden-lm.js) và 12 đồ trang trí mới. R('mã','kiểu',{tham số}) ở cuối file. Nạp SAU city-art10.js. */
(function (root) {
  'use strict';
  var A = root.EWTCityArt; if (!A || !A.kit || !A.kit6 || !A.kit9) return;
  var K = A.kit, def = K.def, INK = K.INK, K6 = A.kit6, D = K6.deco, Q = A.kit9, TAU = Math.PI * 2;
  var sh = function (g, c, r) { g.ell(c[0], c[1] + 2, r, r * .42, 'rgba(30,60,30,.25)'); };
  var dot = function (g, x, y, r, c) { g.ell(x, y, r, r, c, INK); };

  /* khối 3D của Garden dùng lại trong City: style 'lm_<khoá>' */
  var L = root.EWTGardenLM; if (L && L.LM) Object.keys(L.LM).forEach(function (k) { Q['lm_' + k] = function (g, rw, rh, lv, p) { L.LM[k](A, g, rw, rh, p || {}); }; });

  /* ───── đồ trang trí mới ───── */
  D.topiary = function (g, rw, rh, c) {   // cây tỉa: cầu, nón, 2 tầng trong chậu
    var x = c[0], y = c[1]; sh(g, c, 15);
    [[-10, 3, 'ball'], [0, -2, 'cone'], [11, 3, 'tier']].forEach(function (s) {
      var px = x + s[0], py = y + s[1];
      g.poly([[px - 5, py], [px + 5, py], [px + 4, py - 5], [px - 4, py - 5]], '#B8885A', INK); g.line([px, py - 5], [px, py - 9], '#6B4A2E', 1.6);
      if (s[2] === 'ball') g.ell(px, py - 15, 7, 7, '#3F9A3A', INK);
      else if (s[2] === 'cone') g.poly([[px - 7, py - 9], [px + 7, py - 9], [px, py - 28]], '#2E8A3A', INK);
      else { g.ell(px, py - 12, 7, 5, '#3F9A3A', INK); g.ell(px, py - 19, 4.6, 4, '#4FAE4A', INK); }
    });
  };
  D.wishwell = function (g, rw, rh, c) {   // giếng đá có mái nhỏ
    var x = c[0], y = c[1]; sh(g, c, 11); g.ell(x, y - 4, 10, 4.5, '#9A9488', INK); g.ell(x, y - 6, 8, 3.2, '#4F9ED8', false);
    g.poly([[x - 10, y - 4], [x + 10, y - 4], [x + 10, y - 9], [x - 10, y - 9]], '#B9B3A6', INK); g.ell(x, y - 9, 10, 4.5, '#D9D3C4', INK); g.ell(x, y - 9, 7.5, 3, '#4F9ED8', false);
    g.line([x - 9, y - 9], [x - 9, y - 22], '#8A5A33', 2); g.line([x + 9, y - 9], [x + 9, y - 22], '#8A5A33', 2);
    g.poly([[x - 13, y - 22], [x + 13, y - 22], [x, y - 32]], '#C9503C', INK); dot(g, x, y - 18, 1.8, '#F2C94C');
  };
  D.streetclock = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 7); g.line([x, y], [x, y - 32], '#3A3F4C', 3); g.ell(x, y - 36, 8.5, 8.5, '#F6F0E0', INK);
    g.line([x, y - 36], [x, y - 41], '#3A3F4C', 1.2); g.line([x, y - 36], [x + 4, y - 34], '#3A3F4C', 1.2); dot(g, x, y - 46, 1.6, '#C9503C'); g.ell(x, y - 29, 5, 2, '#3A3F4C', false);
  };
  D.bellpost = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 9); g.line([x - 8, y], [x - 8, y - 26], '#8A5A33', 2.6); g.line([x + 8, y], [x + 8, y - 26], '#8A5A33', 2.6); g.line([x - 10, y - 26], [x + 10, y - 26], '#8A5A33', 3);
    g.poly([[x - 4, y - 25], [x + 4, y - 25], [x + 6, y - 15], [x - 6, y - 15]], '#D9A22A', INK); dot(g, x, y - 13, 1.6, '#6B4A2E');
  };
  D.tierfountain = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 16); g.ell(x, y - 3, 16, 6.5, '#D9D3C4', INK); g.ell(x, y - 4.5, 13.5, 5, '#6FC8F2', false);
    g.line([x, y - 4], [x, y - 20], '#D9D3C4', 3.6); g.ell(x, y - 20, 9, 3.6, '#E8E4D8', INK); g.ell(x, y - 21, 7, 2.6, '#6FC8F2', false);
    g.line([x, y - 21], [x, y - 32], '#D9D3C4', 2.6); g.ell(x, y - 32, 5, 2.2, '#E8E4D8', INK); [-1, 1].forEach(function (d) { g.line([x + d * 3, y - 33], [x + d * 8, y - 24], 'rgba(150,210,245,.9)', 1.2); }); g.line([x, y - 34], [x, y - 42], 'rgba(150,210,245,.9)', 1.4);
  };
  D.marketumb = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 15); [[-10, 2, '#E9573F'], [9, -2, '#F2C94C'], [0, 6, '#4F9ED8']].forEach(function (u) {
      var px = x + u[0], py = y + u[1]; g.line([px, py], [px, py - 22], '#8A5A33', 1.8); g.poly([[px - 12, py - 20], [px, py - 30], [px + 12, py - 20], [px + 7, py - 18], [px, py - 20], [px - 7, py - 18]], u[2], INK); g.poly([[px - 5, py - 27], [px, py - 30], [px + 5, py - 27], [px, py - 22]], '#fff', false);
    });
  };
  D.fruitstall = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 14); g.poly([[x - 12, y - 6], [x + 12, y - 6], [x + 10, y - 14], [x - 10, y - 14]], '#B58555', INK);
    [[-7, '#E9573F'], [-2, '#F28B2B'], [3, '#F2D84A'], [8, '#8FDB6A']].forEach(function (f) { dot(g, x + f[0], y - 16, 2.8, f[1]); });
    g.line([x - 10, y - 14], [x - 10, y - 30], '#8A5A33', 1.6); g.line([x + 10, y - 14], [x + 10, y - 30], '#8A5A33', 1.6); g.poly([[x - 14, y - 30], [x + 14, y - 30], [x + 10, y - 24], [x - 10, y - 24]], '#4FAE4A', INK);
    dot(g, x - 8, y - 4, 3.4, '#4A4F5C'); dot(g, x + 8, y - 4, 3.4, '#4A4F5C');
  };
  D.windchimes = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 7); g.line([x, y], [x, y - 30], '#8A5A33', 2.2); g.line([x - 9, y - 30], [x + 9, y - 30], '#8A5A33', 2.2);
    [[-7, 10, '#9AD0E8'], [-2, 15, '#F2C94C'], [3, 12, '#9AD0E8'], [8, 17, '#F2A0B0']].forEach(function (t) { g.line([x + t[0], y - 29], [x + t[0], y - 29 + t[1]], t[2], 2.4); });
  };
  D.bikestand = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 14); g.line([x - 14, y], [x + 14, y], '#6B7686', 2); [[-8, '#E9573F'], [0, '#4F9ED8'], [8, '#F2C94C']].forEach(function (b) {
      var px = x + b[0]; g.ell(px - 3, y - 4, 3.4, 3.6, 'rgba(0,0,0,0)', INK); g.ell(px + 3, y - 4, 3.4, 3.6, 'rgba(0,0,0,0)', INK); g.line([px - 3, y - 4], [px, y - 10], b[1], 1.6); g.line([px, y - 10], [px + 3, y - 4], b[1], 1.6); g.line([px - 1, y - 10], [px + 2, y - 12], '#2E2E3A', 1.4);
    });
  };
  D.freelibrary = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 8); g.line([x, y], [x, y - 12], '#8A5A33', 3); g.poly([[x - 9, y - 12], [x + 9, y - 12], [x + 9, y - 26], [x - 9, y - 26]], '#4F9ED8', INK);
    g.poly([[x - 11, y - 26], [x + 11, y - 26], [x, y - 33]], '#C9503C', INK); g.poly([[x - 6, y - 15], [x + 6, y - 15], [x + 6, y - 23], [x - 6, y - 23]], '#F6F0E0', false);
    [['#E9573F', -5], ['#F2C94C', -2], ['#4FAE4A', 1], ['#7C6FE0', 4]].forEach(function (b) { g.line([x + b[1], y - 16], [x + b[1], y - 22], b[0], 2.2); });
  };
  D.giantlantern = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 10); g.line([x, y], [x, y - 8], '#6B4A2E', 3); g.ell(x, y - 24, 11, 15, '#E9573F', INK); g.ell(x, y - 24, 4.5, 15, '#FFD84A', false);
    g.line([x - 8, y - 14], [x + 8, y - 14], 'rgba(120,30,20,.5)', 1); g.line([x - 8, y - 34], [x + 8, y - 34], 'rgba(120,30,20,.5)', 1); g.poly([[x - 5, y - 40], [x + 5, y - 40], [x + 3, y - 38], [x - 3, y - 38]], '#F2C94C', INK); g.line([x - 3, y - 9], [x - 4, y - 3], '#F2C94C', 1.4); g.line([x + 3, y - 9], [x + 4, y - 3], '#F2C94C', 1.4);
  };
  D.angelstatue = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 10); g.poly([[x - 8, y], [x + 8, y], [x + 6, y - 8], [x - 6, y - 8]], '#B9B3A6', INK);
    g.poly([[x - 4, y - 8], [x + 4, y - 8], [x + 3, y - 22], [x - 3, y - 22]], '#E8E4D8', INK); g.ell(x, y - 26, 3.6, 3.8, '#F4F0E8', INK);
    g.poly([[x - 3, y - 20], [x - 13, y - 30], [x - 9, y - 16]], 'rgba(244,240,232,.95)', INK); g.poly([[x + 3, y - 20], [x + 13, y - 30], [x + 9, y - 16]], 'rgba(244,240,232,.95)', INK);
  };

  D.coconutstand = function (g, rw, rh, c) {
    var x = c[0], y = c[1]; sh(g, c, 12); g.poly([[x - 10, y - 1], [x + 10, y - 1], [x + 9, y - 10], [x - 9, y - 10]], '#C9A06A', INK);
    [[-6, '#6B4A2E'], [0, '#8A5A33'], [6, '#6B4A2E']].forEach(function (n) { g.ell(x + n[0], y - 13, 3.4, 3.4, n[1], INK); });
    g.line([x - 9, y - 10], [x - 9, y - 26], '#8A5A33', 1.8); g.line([x + 9, y - 10], [x + 9, y - 26], '#8A5A33', 1.8); g.poly([[x - 13, y - 26], [x + 13, y - 26], [x + 9, y - 20], [x - 9, y - 20]], '#E8C86A', INK);
  };
  var reg = function (key, style, p) { var f = Q[style]; if (!f) return; p = p || {}; p.id = key; def(key, function (g, rw, rh, lv) { f(g, rw, rh, lv || 1, p); }); };
  var R = reg;
  R('pastelrow', 'row', {"cols": ["#F6CBA2", "#C3DCF3", "#F3B9B9", "#D8F0C8"], "roofs": ["#B8708A"], "h": 30});
  R('canalhouses', 'row', {"cols": ["#8A4A3A", "#C9503C", "#E8D7B5", "#6B7686"], "roofs": ["#4A4F5C"], "h": 40});
  R('bamboocottage', 'k6_cottage', {"wall": "#C8DC9A", "roof": "#6B9E3A"});
  R('sunrisevilla', 'k6_med', {"wall": "#FBE8C8", "roof": "#E9573F"});
  R('rosecottage', 'k6_cottage', {"wall": "#FFD0E0", "roof": "#B8485E"});
  R('pinelodge', 'k6_cabin', {"wall": "#8A5A33", "roof": "#3F6A3A"});
  R('skyhive', 'k6_condo2', {"wall": "#F2D27A", "roof": "#8A5A33", "band": "#C9503C"});
  R('stonemanor', 'k6_tudor', {"wall": "#B9B3A6", "roof": "#4A3A2E"});
  R('ecodome', 'k6_domehome', {"wall": "#E8F4E0", "door": "#4F9A3A"});
  R('hillterrace', 'k6_terrace', {"wall": "#F6E2B8"});
  R('turretmanor', 'k6_turret', {"wall": "#E8DCC0", "roof": "#6B4A8A"});
  R('cubeloft', 'k6_cube', {"wall": "#F4F6F8", "wall2": "#5BA8D8"});
  R('bookcafe', 'k6_townhouse', {"wall": "#E8DCC0", "roof": "#6B4A2E", "acc": "#C9503C"});
  R('floraboutique', 'k6_townhouse', {"wall": "#FFD0E4", "roof": "#4F9A6A", "acc": "#FF7AA8"});
  R('chocolatier', 'k6_townhouse', {"wall": "#6B4A3A", "roof": "#C9A22A", "acc": "#F2D27A"});
  R('techstore', 'k6_modern', {"wall": "#F4F6F8", "roof": "#2A2F44", "glass": "#8FD0FF"});
  R('glassmall', 'k6_glasshome', {"glass": "#BFE6F5", "roof": "#4F80BA"});
  R('harborfishhall', 'k6_boathouse', {"wall": "#F6E2B8", "roof": "#2B8AD0", "boat": "#E9573F"});
  R('alpineinn', 'k6_alpine', {"wall": "#B58555", "roof": "#8A3A2E"});
  R('beachboutique', 'k6_cottage', {"wall": "#BFE6F5", "roof": "#FF8A5A"});
  R('sunsetgrill', 'k6_ranch', {"wall": "#F2C94C", "roof": "#B8452E", "wall2": "#8A5A33"});
  R('grandluxhotel', 'skyscraper', {"wall": "#E8DCC0", "glass": "#BFE6F5"});
  R('tealounge', 'asia', {"wall": "#F2E8D0", "roof": "#4A5A3A", "fl": 2, "sign": "#C9503C"});
  R('marketarcade', 'row', {"cols": ["#F5E6C8", "#D9B885", "#C3DCF3", "#F3B9B9"], "roofs": ["#8A5A33"], "h": 26});
  R('cityarchive', 'k6_colonial', {"wall": "#E8DCC0", "roof": "#4A4F5C"});
  R('rescuecenter', 'k6_modern', {"wall": "#F6F8FB", "roof": "#D9302B", "glass": "#8FD0FF"});
  R('healthclinic', 'k6_cottage', {"wall": "#F6F8FB", "roof": "#4F9ED8"});
  R('conventionhall', 'k6_glasshome', {"glass": "#BFE6F5", "roof": "#7C6FE0"});
  R('weatherstation', 'k6_lighthouse', {"stripe": "#4F80BA", "roof": "#E9573F"});
  R('grandhall', 'k6_castle', {"wall": "#E8DCC0", "roof": "#6B7686", "flag": "#4F80BA"});
  R('artstudio', 'k6_colonial', {"wall": "#F6E2B8", "roof": "#C9503C"});
  R('sciencehall', 'k6_modern', {"wall": "#F4F6F8", "roof": "#4F80BA", "glass": "#8FD0FF"});
  R('musicacademy', 'k6_tudor', {"wall": "#F5ECD7", "roof": "#6B4A8A"});
  R('greenschool', 'k6_glasshome', {"glass": "#CFEFC0", "roof": "#4F9A3A"});
  R('langhub', 'k6_townhouse', {"wall": "#E8F0FA", "roof": "#3A5A8A", "acc": "#E9573F"});
  R('robotworkshop', 'k6_cube', {"wall": "#F4F6F8", "wall2": "#7C6FE0"});
  R('giantcarousel', 'k8_carousel', {});
  R('grandcircus', 'k8_circus', {});
  R('lanternfair', 'k8_lanterns', {"c1": "#E9573F"});
  R('icecreamhouse', 'k6_cottage', {"wall": "#FFD0E4", "roof": "#8A5A33"});
  R('waterslidepark', 'k6_park_lagoon', {});
  R('minivillage', 'k6_park_kids', {});
  R('candycastle', 'k6_castle', {"wall": "#FFD0E4", "roof": "#FF7AA8", "flag": "#FFD84A"});
  R('carnivalstreet', 'row', {"cols": ["#F2C94C", "#E9573F", "#4F9ED8", "#8FDB6A"], "roofs": ["#D9302B"], "h": 24});
  R('skatearena', 'k6_park_skate', {});
  R('ministadium', 'stadium', {});
  R('swimhall', 'k6_modern', {"wall": "#BFE6F5", "roof": "#2B8AD0", "glass": "#8FD0FF"});
  R('climbingwall', 'k6_cliff', {"wall": "#8A8F99", "roof": "#4F9A3A"});
  R('butterflygarden', 'k6_park_glade', {});
  R('tulipfields', 'k6_park_field', {});
  R('lakepavilion', 'k6_park_lake', {});
  R('moonkoipond', 'k6_park_koi', {});
  R('sakuraorchard', 'k6_park_orchard', {"tree": "cherry", "fruit": "#FF7AA8"});
  R('cascadepark', 'k6_park_falls', {});
  R('yachtharbor', 'k6_boathouse', {"wall": "#F4F6F8", "roof": "#2B8AD0", "boat": "#FFD84A"});
  R('cablecarstation', 'k8_s_glass', {});
  R('ferryterminal', 'k8_s_bus', {});
  R('grandtrainhall', 'k8_s_clock', {"c1": "#F2D27A", "roof": "#C9503C", "train": "#E9573F"});
  R('belemtower', 'lm_pt_house', {});
  R('hallgrim', 'lm_is_house', {});
  R('atomiumx', 'lm_be_big', {});
  R('angkorwat', 'lm_kh_house', {});
  R('twintowersx', 'lm_my_house', {});
  R('boudhastupa', 'lm_np_house', {});
  R('petratreasury', 'lm_jo_house', {});
  R('edinburghcastle', 'lm_sct_house', {});
  R('sandsresort', 'lm_sg_house', {});
  R('merlionstatue', 'lm_sg_big', {});
  R('guildhall', 'lm_be_house', {});
  R('seawalls', 'lm_hr_house', {});
  R('bayonfaces', 'lm_kh_big', {});
  R('nyhavnrow', 'lm_dk_house', {});
  R('mermaidrock', 'lm_dk_big', {});
  R('minkafarm', 'lm_fjp_house', {});
  R('koipondfarm', 'lm_fjp_big', {});
  R('courtyardfarm', 'lm_fcn_house', {});
  R('teaterrace2', 'lm_fcn_big', {});
  R('fazendahouse', 'lm_fbr_house', {});
  R('coffeehill', 'lm_fbr_big', {});
  R('tuscanvilla', 'lm_fit_house', {});
  R('vineyardrows', 'lm_fit_big', {});
  R('mudvillage', 'lm_fin_house', {});
  R('wheatfieldx', 'lm_fin_big', {});
  R('stilthomeriver', 'lm_fth_house', {});
  R('floatingmarketx', 'lm_fth_big', {});
  R('topiaryx', 'deco', {"t": "topiary"});
  R('wishwell', 'deco', {"t": "wishwell"});
  R('streetclockx', 'deco', {"t": "streetclock"});
  R('bellpost', 'deco', {"t": "bellpost"});
  R('tierfountain', 'deco', {"t": "tierfountain"});
  R('marketumbrella', 'deco', {"t": "marketumb"});
  R('fruitstall', 'deco', {"t": "fruitstall"});
  R('windchimes', 'deco', {"t": "windchimes"});
  R('bikestand', 'deco', {"t": "bikestand"});
  R('littlelibrary', 'deco', {"t": "freelibrary"});
  R('giantlantern', 'deco', {"t": "giantlantern"});
  R('angelstatue', 'deco', {"t": "angelstatue"});
  R('tikibar', 'stilt', {"wall": "#C9A06A", "roof": "#B8452E"});
  R('snorkelhut', 'k6_cottage', {"wall": "#BFE6F5", "roof": "#2B8AD0"});
  R('kayakrental', 'k6_boathouse', {"wall": "#F6E2B8", "roof": "#E9573F", "boat": "#F2C94C"});
  R('coconutstand', 'deco', {"t": "coconutstand"});
  R('beachfirepit', 'deco', {"t": "campfire"});
  R('surfschool', 'k6_cottage', {"wall": "#FFD84A", "roof": "#E9573F"});
  R('windsurfshop', 'k6_cottage', {"wall": "#E8F4FA", "roof": "#4F9ED8"});
  R('pierrestaurant', 'k6_boathouse', {"wall": "#F4F6F8", "roof": "#2B8AD0", "boat": "#FFD84A"});
  R('seashellmuseum', 'k6_domehome', {"wall": "#FFE8D8"});
  R('beachclub', 'k6_modern', {"wall": "#F4F6F8", "roof": "#2B8AD0", "glass": "#8FD0FF"});
  R('sandcastlestage', 'k6_castle', {"wall": "#E8C788", "roof": "#D9A441", "flag": "#E9573F"});
  R('sunsetchalet', 'k6_ranch', {"wall": "#FFE0B8", "roof": "#E9573F", "wall2": "#C98A55"});
  R('lagoonhotel', 'k6_glasshome', {"glass": "#BFE6F5", "roof": "#2BA8C8"});
})(typeof window !== 'undefined' ? window : this);
