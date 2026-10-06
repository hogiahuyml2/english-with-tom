/* Bộ sticker chuyển động của English With Tom.
   Ảnh: Microsoft Fluent Emoji (3D) — giấy phép MIT, xem images/stickers/LICENSE-FluentEmoji.txt.
   Dùng: EWTStickers.html('trophy', { size: 64, anim: 'shake' }) · EWTStickers.burst(['star','party-popper']) · EWTStickers.parse('[stk:fire]') */
(function (root) {
  'use strict';
  var CATS = [['kid', '🧒 Bạn học bài'], ['reward', '🏆 Khen thưởng'], ['feel', '😊 Cảm xúc'], ['study', '📚 Học tập'], ['pal', '🐾 Bạn đồng hành'], ['fun', '🎁 Vui vẻ']];
  // [id, tên tiếng Việt, nhóm, kiểu chuyển động]
  var LIST = [
    ['trophy', 'Cúp vô địch', 'reward', 'shake'], ['1st-place-medal', 'Huy chương vàng', 'reward', 'swing'], ['sports-medal', 'Huy chương', 'reward', 'swing'], ['crown', 'Vương miện', 'reward', 'bob'],
    ['star', 'Ngôi sao', 'reward', 'twinkle'], ['glowing-star', 'Sao lấp lánh', 'reward', 'twinkle'], ['sparkles', 'Lấp lánh', 'reward', 'twinkle'], ['fire', 'Ngọn lửa', 'reward', 'flicker'],
    ['rocket', 'Tên lửa', 'reward', 'launch'], ['party-popper', 'Pháo giấy', 'reward', 'pop'], ['clapping-hands', 'Vỗ tay', 'reward', 'clap'], ['thumbs-up', 'Giơ ngón cái', 'reward', 'pop'],
    ['flexed-biceps', 'Cố lên!', 'reward', 'pop'], ['raising-hands', 'Hoan hô', 'reward', 'bob'], ['victory-hand', 'Chiến thắng', 'reward', 'swing'], ['gem-stone', 'Kim cương', 'reward', 'twinkle'], ['rainbow', 'Cầu vồng', 'reward', 'bob'],
    ['smiling-face-with-sunglasses', 'Ngầu', 'feel', 'bob'], ['star-struck', 'Choáng ngợp', 'feel', 'twinkle'], ['grinning-face-with-big-eyes', 'Vui quá', 'feel', 'pop'], ['face-with-tears-of-joy', 'Cười ra nước mắt', 'feel', 'shake'],
    ['partying-face', 'Ăn mừng', 'feel', 'bob'], ['smiling-face-with-hearts', 'Yêu thích', 'feel', 'beat'], ['hugging-face', 'Ôm', 'feel', 'pop'], ['thinking-face', 'Đang nghĩ', 'feel', 'swing'],
    ['nerd-face', 'Mọt sách', 'feel', 'bob'], ['sleeping-face', 'Buồn ngủ', 'feel', 'float'], ['face-with-symbols-on-mouth', 'Hết chịu nổi', 'feel', 'shake'], ['face-savoring-food', 'Ngon quá', 'feel', 'bob'],
    ['red-heart', 'Trái tim', 'feel', 'beat'], ['heart-suit', 'Cơ', 'feel', 'beat'], ['waving-hand', 'Xin chào', 'feel', 'wave'], ['folded-hands', 'Cảm ơn', 'feel', 'pop'],
    ['books', 'Chồng sách', 'study', 'bob'], ['open-book', 'Sách mở', 'study', 'swing'], ['pencil', 'Bút chì', 'study', 'swing'], ['memo', 'Ghi chú', 'study', 'bob'],
    ['graduation-cap', 'Mũ tốt nghiệp', 'study', 'pop'], ['light-bulb', 'Ý tưởng', 'study', 'twinkle'], ['brain', 'Bộ não', 'study', 'beat'], ['headphone', 'Tai nghe', 'study', 'bob'],
    ['microphone', 'Micro', 'study', 'bob'], ['megaphone', 'Loa', 'study', 'shake'], ['speech-balloon', 'Hội thoại', 'study', 'pop'], ['alarm-clock', 'Đồng hồ báo thức', 'study', 'ring'],
    ['hourglass-not-done', 'Đồng hồ cát', 'study', 'swing'], ['calendar', 'Lịch', 'study', 'bob'], ['check-mark-button', 'Đúng rồi', 'study', 'pop'], ['cross-mark', 'Chưa đúng', 'study', 'shake'],
    ['cat-face', 'Mèo', 'pal', 'bob'], ['dog-face', 'Chó', 'pal', 'bob'], ['bear', 'Gấu', 'pal', 'bob'], ['panda', 'Gấu trúc', 'pal', 'bob'], ['rabbit-face', 'Thỏ', 'pal', 'bob'], ['fox', 'Cáo', 'pal', 'bob'],
    ['lion', 'Sư tử', 'pal', 'bob'], ['penguin', 'Cánh cụt', 'pal', 'swing'], ['owl', 'Cú', 'pal', 'bob'], ['unicorn', 'Kỳ lân', 'pal', 'bob'], ['robot', 'Robot', 'pal', 'shake'],
    ['wrapped-gift', 'Quà tặng', 'fun', 'shake'], ['balloon', 'Bóng bay', 'fun', 'float'], ['money-bag', 'Túi tiền', 'fun', 'bob'], ['coin', 'Đồng xu', 'fun', 'spin'], ['key', 'Chìa khoá', 'fun', 'swing'],
    ['bell', 'Chuông', 'fun', 'ring'], ['seedling', 'Mầm cây', 'fun', 'swing'], ['rose', 'Hoa hồng', 'fun', 'swing'], ['sun', 'Mặt trời', 'fun', 'spin'], ['crescent-moon', 'Trăng khuyết', 'fun', 'swing'], ['zzz', 'Zzz', 'fun', 'float']
  ];
  // Bộ "Bạn học bài": nhân vật gốc vẽ bằng SVG (js/kid.js) — 8 trạng thái × 2 bạn
  var KID_POSES = [['think', 'Đang suy nghĩ', 'swing'], ['idea', 'Nảy ra ý tưởng', 'twinkle'], ['worry', 'Lo lắng', 'shake'], ['fire', 'Cháy hết mình', 'flicker'], ['sleepy', 'Buồn ngủ', 'float'], ['cheer', 'Hoan hô!', 'bob'], ['tired', 'Mệt quá', 'float'], ['hand', 'Em xin phát biểu', 'wave']];
  var KID_LIST = []; [['boy', 'Bạn nam'], ['girl', 'Bạn nữ']].forEach(function (w) { KID_POSES.forEach(function (p) { KID_LIST.push(['kid-' + w[0] + '-' + p[0], p[1] + ' (' + w[1] + ')', 'kid', p[2]]); }); });
  LIST = KID_LIST.concat(LIST);
  var BY = {}; LIST.forEach(function (r) { BY[r[0]] = { id: r[0], name: r[1], cat: r[2], anim: r[3] }; var m = /^kid-(boy|girl)-([a-z]+)$/.exec(r[0]); if (m) { BY[r[0]].who = m[1]; BY[r[0]].pose = m[2]; } });
  function kidSvg(s, size) { return root.EWTKid ? root.EWTKid.pose(s.pose, s.who, { size: size, label: s.name }) : ''; }
  var KINDS = 'bob pop beat spin shake twinkle launch flicker swing clap ring float wave'.split(' ');

  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function parse(text) { var m = /^\[stk:([a-z0-9-]{1,40})\]$/.exec(String(text || '').trim()); return m && BY[m[1]] ? m[1] : null; }
  function token(id) { return '[stk:' + id + ']'; }
  function html(id, o) {
    var s = BY[id]; if (!s) return ''; o = o || {}; var size = o.size || 64;
    if (s.who) { var ka = o.anim === false ? '' : ' ewt-stk-' + (KINDS.indexOf(o.anim) >= 0 ? o.anim : s.anim); return '<span class="ewt-stk' + ka + '" style="width:' + size + 'px;height:' + size + 'px" role="img" aria-label="' + esc(s.name) + '">' + kidSvg(s, size) + '</span>'; }
    var a = o.anim === false ? '' : ' ewt-stk-' + (KINDS.indexOf(o.anim) >= 0 ? o.anim : s.anim);
    return '<img class="ewt-stk' + a + '" src="images/stickers/' + s.id + '.png" alt="' + esc(s.name) + '" width="' + size + '" height="' + size + '" draggable="false"' + (o.lazy === false ? '' : ' loading="lazy"') + '>';
  }

  if (typeof document !== 'undefined' && !document.getElementById('ewt-stk-css')) {
    var st = document.createElement('style'); st.id = 'ewt-stk-css';
    st.textContent = '.ewt-stk{display:inline-block;vertical-align:middle;transform-origin:50% 80%;user-select:none;-webkit-user-drag:none}' +
      '.ewt-stk-bob{animation:stkBob 2.4s ease-in-out infinite}.ewt-stk-pop{animation:stkPop 2.6s ease-in-out infinite}.ewt-stk-beat{animation:stkBeat 1.3s ease-in-out infinite}.ewt-stk-spin{animation:stkSpin 3.2s cubic-bezier(.5,0,.5,1) infinite}' +
      '.ewt-stk-shake{animation:stkShake 2.2s ease-in-out infinite}.ewt-stk-twinkle{animation:stkTwinkle 1.8s ease-in-out infinite}.ewt-stk-launch{animation:stkLaunch 2.2s ease-in-out infinite}.ewt-stk-flicker{animation:stkFlicker 1s ease-in-out infinite}' +
      '.ewt-stk-swing{animation:stkSwing 2.6s ease-in-out infinite}.ewt-stk-clap{animation:stkClap 1.2s ease-in-out infinite}.ewt-stk-ring{animation:stkRing 2.2s ease-in-out infinite}.ewt-stk-float{animation:stkFloat 3.4s ease-in-out infinite}.ewt-stk-wave{animation:stkWave 1.8s ease-in-out infinite;transform-origin:70% 80%}' +
      '@keyframes stkBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-8%)}}@keyframes stkPop{0%,60%,100%{transform:scale(1)}72%{transform:scale(1.22)}84%{transform:scale(.94)}92%{transform:scale(1.06)}}' +
      '@keyframes stkBeat{0%,100%{transform:scale(1)}14%{transform:scale(1.18)}28%{transform:scale(1)}42%{transform:scale(1.12)}70%{transform:scale(1)}}@keyframes stkSpin{0%,30%{transform:rotateY(0)}70%,100%{transform:rotateY(360deg)}}' +
      '@keyframes stkShake{0%,55%,100%{transform:rotate(0)}62%{transform:rotate(-12deg)}70%{transform:rotate(10deg)}78%{transform:rotate(-8deg)}86%{transform:rotate(5deg)}}@keyframes stkTwinkle{0%,100%{transform:scale(1) rotate(0);filter:brightness(1)}50%{transform:scale(1.15) rotate(12deg);filter:brightness(1.25)}}' +
      '@keyframes stkLaunch{0%,50%,100%{transform:translate(0,0)}65%{transform:translate(-3%,6%)}80%{transform:translate(8%,-14%)}90%{transform:translate(2%,-3%)}}@keyframes stkFlicker{0%,100%{transform:scale(1,1)}25%{transform:scale(.94,1.08)}50%{transform:scale(1.05,.96)}75%{transform:scale(.97,1.05)}}' +
      '@keyframes stkSwing{0%,100%{transform:rotate(-7deg)}50%{transform:rotate(7deg)}}@keyframes stkClap{0%,100%{transform:scale(1) rotate(0)}30%{transform:scale(1.12) rotate(-8deg)}60%{transform:scale(.96) rotate(6deg)}}' +
      '@keyframes stkRing{0%,50%,100%{transform:rotate(0)}56%{transform:rotate(-14deg)}62%{transform:rotate(12deg)}68%{transform:rotate(-10deg)}74%{transform:rotate(8deg)}80%{transform:rotate(-4deg)}}@keyframes stkFloat{0%,100%{transform:translate(0,0);opacity:1}50%{transform:translate(4%,-12%);opacity:.8}}' +
      '@keyframes stkWave{0%,100%{transform:rotate(0)}25%{transform:rotate(18deg)}50%{transform:rotate(-8deg)}75%{transform:rotate(14deg)}}' +
      '.ewt-stk-burst{position:fixed;left:0;top:0;z-index:9999;pointer-events:none;will-change:transform,opacity;animation:stkBurst var(--d,1.6s) cubic-bezier(.2,.7,.3,1) both}' +
      '@keyframes stkBurst{0%{transform:translate(var(--x0),var(--y0)) scale(.3) rotate(0);opacity:0}12%{opacity:1}100%{transform:translate(var(--x1),var(--y1)) scale(var(--s,1)) rotate(var(--r,0deg));opacity:0}}' +
      '@media (prefers-reduced-motion:reduce){.ewt-stk{animation:none!important}.ewt-stk-burst{display:none}}';
    document.head.appendChild(st);
  }

  // Chùm sticker bay lên ăn mừng; from = phần tử xuất phát (mặc định giữa màn hình)
  function burst(ids, o) {
    if (typeof document === 'undefined' || (root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches)) return;
    o = o || {}; ids = (ids && ids.length ? ids : ['party-popper', 'star', 'sparkles', 'trophy', 'glowing-star']).filter(function (i) { return BY[i]; });
    var n = o.count || 14, W = root.innerWidth, H = root.innerHeight, cx = W / 2, cy = H * 0.62;
    if (o.from && o.from.getBoundingClientRect) { var b = o.from.getBoundingClientRect(); cx = b.left + b.width / 2; cy = b.top + b.height / 2; }
    for (var i = 0; i < n; i++) {
      var el = document.createElement('img'), id = ids[i % ids.length], ang = (-Math.PI / 2) + (Math.random() - 0.5) * 2.2, dist = 120 + Math.random() * Math.min(260, H * 0.4), sz = 28 + Math.random() * 26;
      el.src = BY[id].who ? 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(kidSvg(BY[id], 96)) : 'images/stickers/' + id + '.png'; el.alt = ''; el.setAttribute('aria-hidden', 'true'); el.className = 'ewt-stk-burst'; el.width = el.height = Math.round(sz);
      el.style.cssText = '--x0:' + (cx - sz / 2) + 'px;--y0:' + (cy - sz / 2) + 'px;--x1:' + (cx - sz / 2 + Math.cos(ang) * dist) + 'px;--y1:' + (cy - sz / 2 + Math.sin(ang) * dist + 40) + 'px;--s:' + (0.9 + Math.random() * 0.8).toFixed(2) + ';--r:' + Math.round((Math.random() - 0.5) * 120) + 'deg;--d:' + (1.2 + Math.random() * 0.9).toFixed(2) + 's;animation-delay:' + (Math.random() * 0.25).toFixed(2) + 's';
      document.body.appendChild(el); setTimeout(function (e) { return function () { e.remove(); }; }(el), 2600);
    }
  }

  var API = { CATS: CATS, LIST: LIST, BY: BY, KINDS: KINDS, html: html, parse: parse, token: token, burst: burst };
  if (typeof module !== 'undefined' && module.exports) module.exports = API; else root.EWTStickers = API;
})(typeof window !== 'undefined' ? window : this);
