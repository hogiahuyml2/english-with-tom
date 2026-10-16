/* EWT Garden — CÔNG TRÌNH KHỐI ĐẶC cho chế độ 2.5D: dùng bộ vẽ khối đẳng cự của EWT City (tường, mái, cửa sổ, bóng đổ) để dựng nhà/tháp/chùa/lâu đài… thành
   khối có thể tích thật thay vì tấm tranh phẳng. Tải bộ vẽ City theo yêu cầu (chỉ khi bật 2.5D). API: EWTGardenIso.load() → Promise · .ready() · .bigHtml(item) · .blockHtml(block)
   Hình sprite được tạo 1 lần mỗi (kiểu, màu, kích thước) rồi dùng lại dưới dạng ảnh; đặt thẳng đứng (billboard) tại tâm chân công trình. */
(function (root) {
  'use strict';
  var SCRIPTS = ['js/city-art.js?v=9', 'js/city-art3.js?v=3', 'js/city-art6.js?v=3', 'js/city-art7.js?v=2', 'js/city-art8.js?v=2', 'js/city-art9.js?v=1'], loading = null, okay = false, urlC = {}, HW = 32, HH = 16, K = 1.41421356 / 64;
  function load() {
    if (loading) return loading;
    loading = SCRIPTS.reduce(function (p, src) { return p.then(function () { return new Promise(function (res) { var s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = res; document.head.appendChild(s); }); }); }, Promise.resolve())
      .then(function () { var A = root.EWTCityArt; okay = !!(A && A.kit && A.kit6 && A.kit9 && A.getSprite); return okay; });
    return loading;
  }
  // kiểu của Garden → hàm vẽ khối của City ('k6' art6, 'k7' art7, 'k8' art8, 'q' art9) + tham số cố định
  var MAP = {
    house: ['k6', 'cottage'], shop: ['k6', 'townhouse'], hut: ['k6', 'yurt'], barn: ['k6', 'farm'], cabin: ['k6', 'cabin'], castle: ['k6', 'castle'], tower: ['q', 'skyscraper'], temple: ['q', 'temple'], pavilion: ['q', 'asia'],
    pagoda: ['q', 'tiers', { n: 4 }], dome: ['k6', 'domehome'], cave: ['k6', 'cliff'], stilt: ['q', 'stilt'], lighthouse: ['k6', 'lighthouse'], dock: ['k6', 'boathouse'], tent: ['k6', 'yurt'], mill: ['k6', 'mill'], ship: ['k6', 'boathouse'],
    tech: ['k6', 'modern'], igloo: ['k6', 'domehome'], pyramid: ['q', 'stupa', { k: 'candi' }], school: ['k6', 'colonial'], campus: ['k6', 'condo2'], academy: ['k6', 'colonial'], kinder: ['k6', 'cottage'], library: ['k6', 'colonial'],
    villa: ['k6', 'med'], treehouse: ['q', 'stilt'], bungalow: ['k6', 'ranch'], glasshouse: ['k6', 'glasshome'], ziggurat: ['k7', 'ziggur'], amphi: ['k7', 'wave'], bubble: ['k6', 'domehome'], mansion: ['k6', 'colonial'],
    skyrise: ['q', 'skyscraper'], gate: ['q', 'gate'], clocktower: ['k8', 'clock2'], lotushouse: ['k7', 'petal'], windmill2: ['k6', 'mill']
  };
  // khối phong cảnh dựng sẵn (khoá ART của khu) → kiểu + màu mặc định
  var SCN = {
    house: ['house', '#F6E7C8', '#D95A42'], gate: ['gate', '#C9503C', '#2E8A6A'], cabin: ['cabin', '#B58555', '#7A4B2A'], hut: ['hut', '#D9B885', '#C69C5E'], barn: ['barn', '#C9503C', '#6B4A2E'], windmill: ['mill', '#F2EAD8', '#D95A42'], tavern: ['house', '#F5ECD7', '#7A4B2A'],
    palace: ['castle', '#F2E6C8', '#B8485E'], pagoda: ['pagoda', '#C9503C', '#2E8A6A'], lighthouse: ['lighthouse', '#F2F2F2', '#E9573F'], tikihut: ['stilt', '#C9A06A', '#B8452E'], mushhouse: ['dome', '#F6F0E0', '#E9573F'],
    candyhouse: ['house', '#FFD0E4', '#FF7AA8'], bamboohouse: ['stilt', '#C8DC9A', '#6B9E3A'], wizard: ['tower', '#DCCFF2', '#6B4AA8'], tent: ['tent', '#F6F0E0', '#E9573F'], pyramid: ['pyramid', '#E8C080', '#D9A441'],
    jungletemple: ['temple', '#9AA88A', '#4E6B3A'], safaritower: ['stilt', '#C9A06A', '#8A5A33'], neontower: ['tower', '#3C2E6B', '#6FD0FF'], cloudcastle: ['castle', '#FFFFFF', '#B9A0F0'], moonbase: ['dome', '#E8EDF2', '#8FA3BD'],
    onepillar: ['pagoda', '#C9503C', '#8A5A33'], hoianhouse: ['shop', '#F2D27A', '#C9503C'], wat: ['temple', '#F2D27A', '#C9503C'], japancastle: ['pagoda', '#F6F6F6', '#3A3F4C'], chinapagoda: ['pagoda', '#C9503C', '#2E8A6A'],
    borobudur: ['pyramid', '#9AA3AE', '#B9B3A6'], tajmahal: ['dome', '#FBF7EE', '#4F80BA'], bigben: ['clocktower', '#E8D7B5', '#4A4F5C'], hagiasophia: ['dome', '#E8D7B5', '#B8452E'], sydneyopera: ['amphi', '#FFFFFF', '#E8EDF2'],
    giza: ['pyramid', '#E8C080', '#D9A441'], stbasil: ['pagoda', '#E9573F', '#2E8A6A'], stavechurch: ['temple', '#6B4A2E', '#3A2A1A'], hanok: ['pavilion', '#F2EAD8', '#4A4F5C'], gyeongbok: ['temple', '#C9503C', '#2E8A6A'],
    swisschalet: ['house', '#EAD9B8', '#6B4A2E'], logcabin: ['cabin', '#A67444', '#4E6B3A'], irishcottage: ['house', '#F6F0E0', '#C9A55A'], bavarianhouse: ['house', '#F5ECD7', '#B8452E'], dutchwindmill: ['mill', '#F2EAD8', '#B8452E'],
    hacienda: ['villa', '#F6E7C8', '#C9703A'], pueblo: ['hut', '#E3B98A', '#C9703A'], riad: ['villa', '#F6E7C8', '#2E8A8A'], santorini: ['villa', '#FFFFFF', '#4F80BA'], redcottage: ['house', '#F6E7C8', '#C9503C'], lalibela: ['temple', '#B9A27A', '#8A7A55'],
    tukul: ['hut', '#C9A06A', '#C9A55A'], maasaiboma: ['hut', '#C9A06A', '#8A5A33'], palafito: ['stilt', '#E8D7B5', '#4F80BA'], andeanhouse: ['hut', '#E3B98A', '#B8452E'], outbackhouse: ['bungalow', '#F6EAD2', '#C9503C'],
    cafe: ['shop', '#F6E7C8', '#E9573F'], pizzeria: ['shop', '#F2D27A', '#C9503C'], tower: ['tower', '#E8E4D8', '#6B7686'], koutoubia: ['tower', '#E3B98A', '#2E8A6A'], cntower: ['tower', '#DCE3EC', '#8FA3BD'],
    colosseum: ['amphi', '#E3C9A0', '#9A7A55'], greatwall: ['castle', '#B9B3A6', '#8A7A55'], matterhorn: ['pyramid', '#E8EDF2', '#9AA3AE']
  };
  var ring = ['wall', 'roof'];
  function reg(style, wall, roof, acc) {
    var A = root.EWTCityArt, m = MAP[style]; if (!A || !m) return null;
    var tbl = m[0] === 'k6' ? A.kit6.styles : m[0] === 'k7' ? A.kit7 : m[0] === 'k8' ? A.kit8 : A.kit9, fn = tbl && tbl[m[1]]; if (!fn) return null;
    var key = 'gdn|' + style + '|' + wall + '|' + roof + '|' + (acc || '');
    if (!A.ART[key]) {
      A.ART[key] = function (g, rw, rh, lv) {
        var p = {}; Object.keys(m[2] || {}).forEach(function (q) { p[q] = m[2][q]; });
        p.wall = wall; p.roof = roof; p.c1 = wall; p.c2 = roof; p.acc = acc || roof; p.door = acc || '#7A4B2A'; p.stripe = roof; p.base = wall; p.lot = 'rgba(0,0,0,0)'; p.id = key; p.glass = '#BFE6F5';
        fn(g, rw, rh, 2, p, A.kit6.rng(A.kit6.hashS(key)));
      };
    }
    return key;
  }

  /* chuồng / khu nuôi (pen*): sàn + hàng rào thấp (mặt trước thấp để thấy thú bên trong), cột góc, có mái lán / ao tuỳ kiểu */
  var PENS = { pen: 1, penger: 1, penst: 1, pencoop: 1, penshed: 1, penhut: 1, penpond: 1 };
  function penKey(style, wall, roof, acc) {
    var A = root.EWTCityArt, key = 'gdn|' + style + '|' + wall + '|' + roof + '|' + (acc || '');
    if (A.ART[key]) return key;
    A.ART[key] = function (g, rw, rh, lv) {
      var K6 = A.kit6, lot = A.kit.lot, sh = A.shade, wd = wall || '#B58555', fl = style === 'pencoop' ? '#E8D7A0' : style === 'penpond' ? '#8FD06A' : '#B9D87A', t = .09, hb = 16, hf = 8, i;
      lot(g, rw, rh, fl); g.poly(g.faceT(.06, .06, rw - .12, rh - .12, 0), sh(fl, .95), false);
      if (style === 'penpond') { var c = g.P(rw / 2, rh / 2, 0); g.ell(c[0], c[1], (rw + rh) / 2 * 20, (rw + rh) / 2 * 9.5, '#5FB7E8', 'rgba(20,50,90,.35)'); g.ell(c[0] - 6, c[1] - 2, (rw + rh) / 2 * 8, (rw + rh) / 2 * 3, 'rgba(255,255,255,.35)'); }
      if (style === 'penshed' || style === 'pencoop' || style === 'penhut') {   // lán / chuồng nhỏ ở góc sau
        var sw = Math.min(rw * .5, 1.6), sd = Math.min(rh * .45, 1.2), sx = .18, sy = .18, zh = 20;
        g.box(sx, sy, sw, sd, 0, zh, sh(wd, 1.08)); g.winsL(sx, sy, sw, sd, 6, zh - 3, 1, 1, { m: .3 });
        g.gable(sx - .05, sy - .05, sw + .1, sd + .1, zh, zh + 9, true, roof || '#B8452E', { wall: sh(wd, 1.08) }); g.doorL(sx, sy, sw, sd, .7, 0, .26, 10, acc || '#6B4A2B');
      }
      var Z = function (x, y, w, h, z, col) { g.box(x, y, w, h, 0, z, col || wd); };
      Z(.04, .04, rw - .08, t, hb); Z(.04, .04, t, rh - .08, hb);                 // rào sau (cao)
      Z(.04, rh - .04 - t, rw - .08, t, hf); Z(rw - .04 - t, .04, t, rh - .08, hf);   // rào trước (thấp)
      [[.04, .04], [rw - .04 - t, .04], [.04, rh - .04 - t], [rw - .04 - t, rh - .04 - t]].forEach(function (q) { g.box(q[0] - .02, q[1] - .02, t + .04, t + .04, 0, hb + 4, sh(wd, .8)); });
      for (i = 1; i < Math.round(rw * 2); i++) g.box(.04 + i * (rw - .08) / Math.round(rw * 2) - .015, rh - .04 - t - .005, .03, t + .01, hf, hf + 5, sh(wd, .85));
    };
    return key;
  }
  // sinh sprite + địa chỉ ảnh (1 lần)
  function spriteFor(style, wall, roof, acc, w, h) {
    if (!okay) return null; var A = root.EWTCityArt, key;
    if (wall && roof && wall.toLowerCase() === roof.toLowerCase()) roof = A.shade(roof, .72);   // tường & mái cùng màu → tối mái cho rõ
    key = PENS[style] ? penKey(style, wall, roof, acc) : reg(style, wall, roof, acc); if (!key) return null;
    var ck = key + '|' + w + 'x' + h; if (urlC[ck]) return urlC[ck];
    var sp; try { sp = A.getSprite('b', key, 2, w, h, '', 0); } catch (e) { return (urlC[ck] = null); }
    if (!sp || !sp.c || !sp.c.width) return (urlC[ck] = null);
    var r = { url: sp.c.toDataURL('image/png'), w: sp.w, h: sp.h, ax: sp.ox + (w - h) * HW, ay: sp.oy + (w + h) * HH };   // mốc = GÓC TRƯỚC của chân công trình (điểm thấp nhất) → dựng thẳng từ đó, không bị lún xuống mặt đất
    return (urlC[ck] = r);
  }
  function imgHtml(r, w, h) {
    var X = (w - r.ax * K), Y = (h - r.ay * K);
    return '<img class="gd-b3d" alt="" draggable="false" src="' + r.url + '" style="width:calc(var(--ts) * ' + (r.w * K).toFixed(4) + ');height:calc(var(--ts) * ' + (r.h * K).toFixed(4) + ');left:calc(var(--ts) * ' + X.toFixed(4) + ');top:calc(var(--ts) * ' + Y.toFixed(4) + ');transform-origin:calc(var(--ts) * ' + (r.ax * K).toFixed(4) + ') calc(var(--ts) * ' + (r.ay * K).toFixed(4) + ')">';
  }
  var API = {
    load: load, ready: function () { return okay; },
    // công trình lớn người chơi đặt: item {id,w,h}; spec = EWTGardenCatalog.SPEC[id] = ['b', w, h, kiểu, tường, mái, nhấn, …]
    bigHtml: function (it) {
      var CAT = root.EWTGardenCatalog, e = CAT && CAT.SPEC && CAT.SPEC[it.id], sp = e && e[1]; if (!okay || !e || e[0] !== 'b' || !sp) return '';
      var r = spriteFor(sp[3], sp[4], sp[5], sp[6], sp[1], sp[2]); return r ? imgHtml(r, sp[1], sp[2]) : '';
    },
    // khối phong cảnh dựng sẵn: block {k,x,y,w,h}
    blockHtml: function (b) {
      var m = SCN[b.k]; if (!okay || !m) return ''; var w = Math.max(1, b.w), h = Math.max(1, b.h), r = spriteFor(m[0], m[1], m[2], m[3] || '', w, h); return r ? imgHtml(r, w, h) : '';
    },
    has: function (k) { return !!SCN[k]; }
  };
  root.EWTGardenIso = API;
})(typeof window !== 'undefined' ? window : this);
