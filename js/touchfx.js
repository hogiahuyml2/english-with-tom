/* EWT — hiệu ứng CHẠM / BẤM & CHUYỂN TRANG dùng chung cho toàn bộ web (nạp từ galaxy.js).
   1) Mọi nút / thẻ / liên kết khi bấm: gợn sóng tỏa ra từ điểm chạm (màu theo bảng màu đang dùng) + "nảy" nhẹ như lò xo.
   2) Chuyển trang mượt: dùng View Transitions (Chrome/Edge/Android/Safari mới); trình duyệt cũ thì mờ dần + trượt nhẹ trước khi sang trang.
   Tự tắt khi người dùng chọn "giảm chuyển động" của hệ điều hành hoặc tắt "Chuyển động mềm mại" trong bảng Giao diện. */
(function () {
  'use strict';
  if (window.__ewtTouchFx) return; window.__ewtTouchFx = 1;
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fxOn() { return !reduce && !root.classList.contains('fx-nomotion'); }
  function lite() { return root.classList.contains('fx-lite'); }
  var css = '' +
    /* (View Transitions nằm sẵn trong css/style.css để trang mới nhận ngay từ lần vẽ đầu) */
    'html.fx-leave body{animation:ewtLeave .19s cubic-bezier(.4,0,1,1) both!important}' +
    '@keyframes ewtLeave{to{opacity:0;transform:translateY(-6px) scale(.992);filter:blur(2px)}}' +
    '.ewt-rip{position:fixed;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;pointer-events:none;z-index:2147483000;will-change:transform,opacity}' +
    '.ewt-rip.g{background:radial-gradient(circle,var(--ewt-rip,rgba(111,88,238,.55)) 0%,transparent 70%)}' +
    '.ewt-rip.r{border:2px solid var(--ewt-rip,rgba(111,88,238,.7));box-sizing:border-box}' +
    '@media (prefers-reduced-motion:reduce){.ewt-rip{display:none}}';
  var st = document.createElement('style'); st.id = 'ewt-touchfx-style'; st.textContent = css; document.head.appendChild(st);

  var SEL = 'a[href],button,.btn,[role=button],[role=tab],.card,.course-card,.sc-card,.stat-card,.feature,.gd-it,.gd-zcard,.gd-tool,.gd-pill,.gd-tab,.gd-zbtn,.ewt-tab,.adm-tab,.lv-btn,.ar-game,summary,[data-ripple]';
  function rippleColor() { var c = getComputedStyle(root).getPropertyValue('--primary').trim(); return c || '#6F58EE'; }
  function toRgba(c, a) { var m = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(c); if (!m) return c; var h = m[1]; if (h.length === 3) h = h.split('').map(function (x) { return x + x; }).join(''); return 'rgba(' + parseInt(h.slice(0, 2), 16) + ',' + parseInt(h.slice(2, 4), 16) + ',' + parseInt(h.slice(4, 6), 16) + ',' + a + ')'; }
  function burst(x, y, big) {
    var base = rippleColor(), mk = function (cls, to, dur, delay) {
      var d = document.createElement('div'); d.className = 'ewt-rip ' + cls; d.style.left = x + 'px'; d.style.top = y + 'px'; d.style.setProperty('--ewt-rip', toRgba(base, cls === 'g' ? .5 : .75)); document.body.appendChild(d);
      var a = d.animate ? d.animate([{ transform: 'scale(.4)', opacity: .95 }, { transform: 'scale(' + to + ')', opacity: 0 }], { duration: dur, delay: delay || 0, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }) : null;
      if (a) a.onfinish = function () { d.remove(); }; else setTimeout(function () { d.remove(); }, dur);
    };
    mk('r', big ? 11 : 8, 560); if (!lite()) { mk('g', big ? 16 : 12, 700); mk('r', big ? 7 : 5, 520, 90); }
  }
  function bounce(el) {
    if (!el.animate || lite()) return;
    try { el.animate([{ scale: '1' }, { scale: '.955' }, { scale: '1.02' }, { scale: '1' }], { duration: 340, easing: 'cubic-bezier(.34,1.56,.64,1)' }); } catch (e) {}
  }
  document.addEventListener('pointerdown', function (e) {
    if (!fxOn() || (e.button != null && e.button > 0)) return;
    var t = e.target; if (!t || !t.closest) return;
    var el = t.closest(SEL); if (!el || el.disabled || el.getAttribute('aria-disabled') === 'true' || el.closest('[data-no-fx]')) return;
    if (/^(INPUT|SELECT|TEXTAREA)$/.test(t.tagName)) return;
    var r = el.getBoundingClientRect(), big = r.width * r.height > 40000;
    burst(e.clientX, e.clientY, big); bounce(el);
  }, { passive: true, capture: true });

  /* Chuyển trang: trình duyệt chưa có View Transitions giữa các trang thì tự làm hiệu ứng thoát */
  var vt = typeof CSSViewTransitionRule !== 'undefined';
  document.addEventListener('click', function (e) {
    if (vt || !fxOn() || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href]'); if (!a || a.target === '_blank' || a.hasAttribute('download') || a.hasAttribute('data-no-fx')) return;
    var href = a.getAttribute('href') || ''; if (!href || href.charAt(0) === '#' || /^(javascript:|mailto:|tel:)/i.test(href)) return;
    var u; try { u = new URL(a.href, location.href); } catch (er) { return; }
    if (u.origin !== location.origin || (u.pathname === location.pathname && u.search === location.search)) return;
    e.preventDefault(); root.classList.add('fx-leave'); setTimeout(function () { location.href = u.href; }, 170);
  }, false);
  window.addEventListener('pageshow', function () { root.classList.remove('fx-leave'); });
})();
