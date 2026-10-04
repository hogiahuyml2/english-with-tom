/* English With Tom — Galaxy & Stars: hiệu ứng nền + bộ chọn bảng màu.
   Chạy trên mọi trang (nạp từ main.js). Không phụ thuộc thư viện.
   Cài đặt lưu localStorage: ewt-palette (tên bảng màu) và ewt-fx (JSON {stars,trail,motion}).
   Tôn trọng prefers-reduced-motion (mặc định tắt) và tự dừng khi tab bị ẩn để tiết kiệm pin. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;

  var PALETTES = [
    { k: '', n: 'Tím pastel', c: ['#6F58EE', '#4F8BF0'] },
    { k: 'galaxy', n: 'Thiên hà', c: ['#5B3FE0', '#E04BC8'] },
    { k: 'aurora', n: 'Cực quang', c: ['#0E9F7E', '#4C86EE'] },
    { k: 'nebula', n: 'Tinh vân', c: ['#D93A78', '#F7A23B'] },
    { k: 'ocean', n: 'Đại dương', c: ['#1D6FE0', '#2CC9B6'] },
    { k: 'sunrise', n: 'Bình minh', c: ['#E07A10', '#F5CB5C'] }
  ];

  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var fx;
  try { fx = JSON.parse(get('ewt-fx', 'null')); } catch (e) { fx = null; }
  if (!fx || typeof fx !== 'object') fx = { stars: !reduce, trail: !reduce && !coarse, motion: !reduce };
  function saveFx() { set('ewt-fx', JSON.stringify(fx)); }

  function palette() { return root.getAttribute('data-palette') || ''; }
  function setPalette(k) {
    if (k) root.setAttribute('data-palette', k); else root.removeAttribute('data-palette');
    set('ewt-palette', k);
    readColor();
    syncPopover();
  }
  function isDark() { return root.getAttribute('data-theme') === 'dark'; }

  /* ───────── CSS hiệu ứng ───────── */
  var css = '' +
    '#fx-layer{position:fixed;inset:0;z-index:-1;pointer-events:none;overflow:hidden}' +
    '#fx-canvas{position:absolute;inset:0;width:100%;height:100%}' +
    '.fx-blob{position:absolute;border-radius:50%;background:radial-gradient(circle at center,var(--primary) 0%,transparent 65%);opacity:.10;will-change:transform}' +
    '[data-theme="dark"] .fx-blob{opacity:.16}' +
    '.fx-blob.b1{width:60vmax;height:60vmax;left:-18vmax;top:-22vmax;animation:fxDrift1 38s ease-in-out infinite alternate}' +
    '.fx-blob.b2{width:52vmax;height:52vmax;right:-16vmax;top:18vh;background:radial-gradient(circle at center,var(--primary-2) 0%,transparent 65%);animation:fxDrift2 46s ease-in-out infinite alternate}' +
    '.fx-blob.b3{width:44vmax;height:44vmax;left:24vw;bottom:-26vmax;animation:fxDrift1 52s ease-in-out infinite alternate-reverse}' +
    '@keyframes fxDrift1{to{transform:translate3d(9vmax,7vmax,0) scale(1.12)}}' +
    '@keyframes fxDrift2{to{transform:translate3d(-8vmax,10vmax,0) scale(.92)}}' +
    /* hero trong suốt một phần để thấy sao */
    'html.fx-stars .hero{background:linear-gradient(180deg,color-mix(in srgb,var(--primary) 9%,transparent),transparent)}' +
    /* hiệu ứng chuyển động CSS */
    'html.fx-motion .course-card,html.fx-motion .sc-card,html.fx-motion .stat-card,html.fx-motion .feature,html.fx-motion .card{animation:fxRise .55s cubic-bezier(.2,.7,.2,1) backwards}' +
    'html.fx-motion .grid>*:nth-child(2){animation-delay:.06s}html.fx-motion .grid>*:nth-child(3){animation-delay:.12s}html.fx-motion .grid>*:nth-child(4){animation-delay:.18s}html.fx-motion .grid>*:nth-child(5){animation-delay:.24s}html.fx-motion .grid>*:nth-child(6){animation-delay:.3s}' +
    '@keyframes fxRise{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}' +
    'html.fx-motion .course-card:hover,html.fx-motion .sc-card:hover{box-shadow:0 10px 34px rgba(var(--star-rgb),.28),0 0 0 1.5px var(--primary)}' +
    'html.fx-motion .hero h1 .grad{background-size:220% 100%;animation:fxShine 6s linear infinite}' +
    '@keyframes fxShine{to{background-position:-220% 0}}' +
    'html.fx-motion .btn-primary,html.fx-motion .lv-btn:not(.ghost):not(.line),html.fx-motion .sl-btn:not(.ghost){position:relative;overflow:hidden}' +
    'html.fx-motion .btn-primary::after,html.fx-motion .lv-btn:not(.ghost):not(.line)::after,html.fx-motion .sl-btn:not(.ghost)::after{content:"";position:absolute;top:0;left:-70%;width:45%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.38),transparent);transform:skewX(-20deg);animation:fxSweep 4.5s ease-in-out infinite;pointer-events:none}' +
    '@keyframes fxSweep{0%,60%{left:-70%}100%{left:130%}}' +
    'html.fx-motion .brand-logo{animation:fxGlow 3.6s ease-in-out infinite}' +
    '@keyframes fxGlow{0%,100%{box-shadow:0 0 0 rgba(var(--star-rgb),0)}50%{box-shadow:0 0 18px rgba(var(--star-rgb),.55)}}' +
    'html.fx-motion .hero-badge{animation:fxFloat 4s ease-in-out infinite}' +
    '@keyframes fxFloat{50%{transform:translateY(-5px)}}' +
    'html.fx-motion .course-ico,html.fx-motion .sc-card .ico{transition:transform .3s}' +
    'html.fx-motion .course-card:hover .course-ico,html.fx-motion .sc-card:hover .ico{transform:rotate(-8deg) scale(1.12)}' +
    /* bảng chọn */
    '.pal-pop{display:none}.pal-pop.open{display:block;animation:fxRise .25s ease backwards}' +
    '.pal-pop h4{font-size:14px;margin:0 0 10px}.pal-sec{font-size:11.5px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px;margin:12px 0 7px}' +
    '.pal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}' +
    '.pal-sw{border:2px solid var(--border);background:var(--surface);color:var(--text);border-radius:12px;padding:6px;cursor:pointer;font:600 11.5px inherit;font-family:inherit;text-align:center}' +
    '.pal-sw i{display:block;height:26px;border-radius:8px;margin-bottom:5px}' +
    '.pal-sw.on{border-color:var(--primary);box-shadow:0 0 0 2px var(--primary-soft)}' +
    '.pal-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 0;font-size:13.5px}' +
    '.pal-switch{position:relative;width:42px;height:24px;border-radius:99px;border:none;background:var(--border);cursor:pointer;flex-shrink:0;transition:background .2s}' +
    '.pal-switch::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}' +
    '.pal-switch.on{background:var(--gradient)}.pal-switch.on::after{transform:translateX(18px)}' +
    '.pal-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.pal-modes button{padding:8px;border-radius:10px;border:2px solid var(--border);background:var(--surface);color:var(--text);font:600 13px inherit;font-family:inherit;cursor:pointer}.pal-modes button.on{border-color:var(--primary);background:var(--primary-soft)}' +
    '@media (prefers-reduced-motion:reduce){html.fx-motion *{animation:none!important}.fx-blob{animation:none!important}}';
  var st = document.createElement('style'); st.id = 'fx-style'; st.textContent = css; document.head.appendChild(st);

  /* ───────── Lớp nền: blobs + canvas ───────── */
  var layer = document.createElement('div'); layer.id = 'fx-layer'; layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<div class="fx-blob b1"></div><div class="fx-blob b2"></div><div class="fx-blob b3"></div><canvas id="fx-canvas"></canvas>';
  document.body.appendChild(layer);
  var cv = layer.querySelector('canvas'), ctx = cv.getContext('2d');
  var W = 0, H = 0, DPR = 1, stars = [], shoots = [], sparks = [];
  var rgb = '123,110,246', scrollY = 0, mx = 0, my = 0, running = false, last = 0, nextShoot = 0, lastSpark = 0;

  function readColor() {
    var v = getComputedStyle(root).getPropertyValue('--star-rgb').trim();
    if (v) rgb = v.replace(/\s+/g, '');
  }
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    var n = Math.min(W < 700 ? 70 : 150, Math.round(W * H / 9500));
    stars = [];
    for (var i = 0; i < n; i++) {
      var d = Math.random();
      stars.push({ x: Math.random() * W, y: Math.random() * H, r: 0.5 + d * 1.5, d: d, ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.8 });
    }
  }
  function sparkle(x, y, r, a) {
    ctx.fillStyle = 'rgba(' + rgb + ',' + a + ')';
    ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    if (r > 1.45) { // lấp lánh 4 cánh cho sao lớn
      var l = r * 4.2;
      ctx.strokeStyle = 'rgba(' + rgb + ',' + (a * 0.6) + ')'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.moveTo(x - l, y); ctx.lineTo(x + l, y); ctx.moveTo(x, y - l); ctx.lineTo(x, y + l); ctx.stroke();
    }
  }
  function frame(t) {
    if (!running) return;
    requestAnimationFrame(frame);
    var dt = Math.min(50, t - last); if (dt < 16) return; last = t;
    ctx.clearRect(0, 0, W, H);
    var dark = isDark(), base = dark ? 1 : 0.55;
    if (fx.stars) {
      var tt = t / 1000;
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        var a = (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(tt * s.sp + s.ph))) * base * (0.35 + s.d * 0.65);
        var y = ((s.y - scrollY * 0.08 * s.d) % H + H) % H;
        sparkle(s.x + mx * s.d * 14, y + my * s.d * 14, dark ? s.r : s.r * 0.9, a);
      }
      // sao băng
      if (t > nextShoot) {
        nextShoot = t + 4500 + Math.random() * 6500;
        var ang = 0.55 + Math.random() * 0.35, sp = 0.9 + Math.random() * 0.6;
        shoots.push({ x: Math.random() * W * 0.9, y: Math.random() * H * 0.45, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: 900 + Math.random() * 500, len: 90 + Math.random() * 90 });
      }
      for (var j = shoots.length - 1; j >= 0; j--) {
        var m = shoots[j]; m.life += dt; m.x += m.vx * dt; m.y += m.vy * dt;
        var p = m.life / m.max; if (p >= 1) { shoots.splice(j, 1); continue; }
        var al = (p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8) * (dark ? 0.95 : 0.6);
        var mag = Math.hypot(m.vx, m.vy), tx = m.x - m.vx / mag * m.len, ty = m.y - m.vy / mag * m.len;
        var g = ctx.createLinearGradient(m.x, m.y, tx, ty);
        g.addColorStop(0, 'rgba(' + rgb + ',' + al + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
        ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
        ctx.fillStyle = 'rgba(' + rgb + ',' + al + ')'; ctx.beginPath(); ctx.arc(m.x, m.y, 1.8, 0, 6.2832); ctx.fill();
      }
    }
    // vệt sao theo con trỏ
    for (var k = sparks.length - 1; k >= 0; k--) {
      var q = sparks[k]; q.life += dt;
      if (q.life >= q.max) { sparks.splice(k, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 0.00003 * dt;
      var f = 1 - q.life / q.max;
      sparkle(q.x, q.y, q.r * (0.5 + f), f * (dark ? 0.95 : 0.8));
    }
  }
  function loop() {
    var want = (fx.stars || fx.trail) && !document.hidden;
    if (want && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    if (!want && running) { running = false; ctx.clearRect(0, 0, W, H); }
  }
  function applyFx() {
    root.classList.toggle('fx-stars', !!fx.stars);
    root.classList.toggle('fx-motion', !!fx.motion);
    layer.style.display = (fx.stars || fx.motion || fx.trail) ? '' : 'none';
    layer.querySelectorAll('.fx-blob').forEach(function (b) { b.style.display = fx.motion || fx.stars ? '' : 'none'; });
    if (!fx.motion) layer.querySelectorAll('.fx-blob').forEach(function (b) { b.style.animation = 'none'; }); else layer.querySelectorAll('.fx-blob').forEach(function (b) { b.style.animation = ''; });
    if (!fx.stars) shoots.length = 0;
    loop();
  }

  window.addEventListener('resize', function () { clearTimeout(resize._t); resize._t = setTimeout(resize, 150); });
  window.addEventListener('scroll', function () { scrollY = window.pageYOffset; }, { passive: true });
  document.addEventListener('visibilitychange', loop);
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    mx = (e.clientX / W - 0.5); my = (e.clientY / H - 0.5);
    if (!fx.trail) return;
    var n = performance.now(); if (n - lastSpark < 28 || sparks.length > 45) return; lastSpark = n;
    sparks.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 0.06, vy: 0.01 + Math.random() * 0.04, r: 1 + Math.random() * 1.6, life: 0, max: 600 + Math.random() * 500 });
  }, { passive: true });
  new MutationObserver(readColor).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-palette'] });

  /* ───────── Bảng chọn giao diện ───────── */
  var pop = document.createElement('div'); pop.className = 'pal-pop'; pop.id = 'palPop'; pop.setAttribute('role', 'dialog'); pop.setAttribute('aria-label', 'Tuỳ chỉnh giao diện');
  document.body.appendChild(pop);
  function sw(on, id) { return '<button type="button" class="pal-switch' + (on ? ' on' : '') + '" data-fx="' + id + '" role="switch" aria-checked="' + !!on + '"></button>'; }
  function render() {
    var cur = palette();
    pop.innerHTML = '<h4>🎨 Giao diện của bạn</h4>' +
      '<div class="pal-sec">Bảng màu</div><div class="pal-grid">' + PALETTES.map(function (p) {
        return '<button type="button" class="pal-sw' + (p.k === cur ? ' on' : '') + '" data-pal="' + p.k + '"><i style="background:linear-gradient(135deg,' + p.c[0] + ',' + p.c[1] + ')"></i>' + p.n + '</button>';
      }).join('') + '</div>' +
      '<div class="pal-sec">Chế độ</div><div class="pal-modes"><button type="button" data-mode="light" class="' + (isDark() ? '' : 'on') + '">☀️ Sáng</button><button type="button" data-mode="dark" class="' + (isDark() ? 'on' : '') + '">🌙 Tối</button></div>' +
      '<div class="pal-sec">Hiệu ứng</div>' +
      '<div class="pal-row"><span>✨ Sao lấp lánh &amp; sao băng</span>' + sw(fx.stars, 'stars') + '</div>' +
      '<div class="pal-row"><span>🖱️ Vệt sao theo con trỏ</span>' + sw(fx.trail, 'trail') + '</div>' +
      '<div class="pal-row"><span>🎞️ Chuyển động mềm mại</span>' + sw(fx.motion, 'motion') + '</div>';
  }
  function syncPopover() { if (pop.classList.contains('open')) render(); }
  function place(btn) {
    var r = btn.getBoundingClientRect(), w = Math.min(300, window.innerWidth - 24);
    pop.style.top = Math.min(r.bottom + 8, window.innerHeight - 40) + 'px';
    pop.style.left = Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12)) + 'px';
  }
  document.addEventListener('click', function (e) {
    var t = e.target, btn = t.closest && t.closest('#paletteToggle');
    if (btn) { e.stopPropagation(); if (pop.classList.contains('open')) pop.classList.remove('open'); else { render(); place(btn); pop.classList.add('open'); } return; }
    if (!pop.contains(t)) { pop.classList.remove('open'); return; }
    var p = t.closest('[data-pal]'); if (p) { setPalette(p.getAttribute('data-pal')); return; }
    var m = t.closest('[data-mode]');
    if (m) {
      var wantDark = m.getAttribute('data-mode') === 'dark';
      if (wantDark !== isDark()) { var tb = document.getElementById('darkToggle') || document.getElementById('darkToggle2'); if (tb) tb.click(); }
      setTimeout(render, 60); return;
    }
    var f = t.closest('[data-fx]');
    if (f) { var key = f.getAttribute('data-fx'); fx[key] = !fx[key]; saveFx(); applyFx(); render(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') pop.classList.remove('open'); });
  window.addEventListener('scroll', function () { pop.classList.remove('open'); }, { passive: true });

  resize(); readColor(); applyFx();
})();
