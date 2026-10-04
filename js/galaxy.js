/* English With Tom — Giao diện sống động: nền động nhiều chủ đề + bảng màu + hiệu ứng.
   Chạy trên mọi trang (nạp từ main.js). Không phụ thuộc thư viện.
   Cài đặt lưu localStorage: ewt-palette (bảng màu) và ewt-fx (JSON {stars,trail,motion,scene}).
   Tôn trọng prefers-reduced-motion (mặc định tắt) và tự dừng khi tab bị ẩn để tiết kiệm pin. */
(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var coarse = window.matchMedia && matchMedia('(pointer: coarse)').matches;

  var PALETTES = [
    { k: '', n: 'Tím pastel', c: ['#6F58EE', '#4F8BF0'], scene: 'stars' },
    { k: 'galaxy', n: 'Thiên hà', c: ['#5B3FE0', '#E04BC8'], scene: 'stars' },
    { k: 'aurora', n: 'Cực quang', c: ['#0E9F7E', '#4C86EE'], scene: 'aurora' },
    { k: 'nebula', n: 'Tinh vân', c: ['#D93A78', '#F7A23B'], scene: 'stars' },
    { k: 'ocean', n: 'Đại dương', c: ['#1D6FE0', '#2CC9B6'], scene: 'bubbles' },
    { k: 'sunrise', n: 'Bình minh', c: ['#E07A10', '#F5CB5C'], scene: 'fireflies' },
    { k: 'sakura', n: 'Hoa anh đào', c: ['#E8668B', '#F9B7C9'], scene: 'petals' },
    { k: 'forest', n: 'Rừng xanh', c: ['#1F8F4E', '#9CCC65'], scene: 'fireflies' },
    { k: 'candy', n: 'Kẹo ngọt', c: ['#FF5CA8', '#35C6F4'], scene: 'bubbles' },
    { k: 'midnight', n: 'Đêm xanh vàng', c: ['#1E2A78', '#D4A017'], scene: 'doodle' }
  ];
  var SCENES = [
    { k: 'stars', n: 'Sao & sao băng', e: '✨' }, { k: 'aurora', n: 'Cực quang', e: '🌌' }, { k: 'bubbles', n: 'Bong bóng', e: '🫧' },
    { k: 'letters', n: 'Chữ cái bay', e: '🔤' }, { k: 'petals', n: 'Cánh hoa', e: '🌸' }, { k: 'fireflies', n: 'Đom đóm', e: '🪔' },
    { k: 'snow', n: 'Tuyết rơi', e: '❄️' }, { k: 'doodle', n: 'Đồ dùng học tập', e: '🎒' }
  ];

  function get(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : v; } catch (e) { return d; } }
  function set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }

  var fx;
  try { fx = JSON.parse(get('ewt-fx', 'null')); } catch (e) { fx = null; }
  if (!fx || typeof fx !== 'object') fx = { stars: !reduce, trail: !reduce && !coarse, motion: !reduce };
  if (!fx.scene) fx.scene = 'stars';
  function saveFx() { set('ewt-fx', JSON.stringify(fx)); }

  function palette() { return root.getAttribute('data-palette') || ''; }
  function setPalette(k) {
    if (k) root.setAttribute('data-palette', k); else root.removeAttribute('data-palette');
    set('ewt-palette', k);
    var p = PALETTES.filter(function (x) { return x.k === k; })[0];
    if (p && fx.stars) { fx.scene = p.scene; saveFx(); initScene(); } // mỗi bảng màu có sẵn một nền động hợp tông (vẫn đổi được riêng)
    readColor(); syncPopover();
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
    'html.fx-stars .hero{background:linear-gradient(180deg,color-mix(in srgb,var(--primary) 9%,transparent),transparent)}' +
    /* trang vào mượt */
    'html.fx-motion body{animation:fxPage .5s ease both}@keyframes fxPage{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    /* thẻ xuất hiện + nghiêng 3D theo con trỏ */
    'html.fx-motion .course-card,html.fx-motion .sc-card,html.fx-motion .stat-card,html.fx-motion .feature,html.fx-motion .card,html.fx-motion .ar-game{animation:fxRise .55s cubic-bezier(.2,.7,.2,1) backwards}' +
    'html.fx-motion .grid>*:nth-child(2){animation-delay:.06s}html.fx-motion .grid>*:nth-child(3){animation-delay:.12s}html.fx-motion .grid>*:nth-child(4){animation-delay:.18s}html.fx-motion .grid>*:nth-child(5){animation-delay:.24s}html.fx-motion .grid>*:nth-child(6){animation-delay:.3s}' +
    '@keyframes fxRise{from{opacity:0;transform:translateY(18px) scale(.985)}to{opacity:1;transform:none}}' +
    'html.fx-motion .course-card:hover,html.fx-motion .sc-card:hover,html.fx-motion .ar-game:hover{transform:perspective(800px) rotateX(var(--rx,0deg)) rotateY(var(--ry,0deg)) translateY(-5px);box-shadow:0 12px 36px rgba(var(--star-rgb),.30),0 0 0 1.5px var(--primary)}' +
    'html.fx-motion .course-card:hover .course-ico,html.fx-motion .sc-card:hover .ico{transform:rotate(-8deg) scale(1.14)}html.fx-motion .course-ico,html.fx-motion .sc-card .ico{transition:transform .3s}' +
    /* cuộn đến đâu hiện đến đó */
    'html.fx-motion .fx-rv{opacity:0;transform:translateY(26px);transition:opacity .6s ease,transform .6s cubic-bezier(.2,.7,.2,1)}html.fx-motion .fx-rv.fx-in{opacity:1;transform:none}' +
    /* chữ chuyển màu, nút lóe sáng, logo phát sáng */
    'html.fx-motion .hero h1 .grad{background-size:220% 100%;animation:fxShine 6s linear infinite}@keyframes fxShine{to{background-position:-220% 0}}' +
    'html.fx-motion .btn-primary,html.fx-motion .lv-btn:not(.ghost):not(.line),html.fx-motion .sl-btn:not(.ghost),html.fx-motion .mq-btn:not(.ghost):not(.line){position:relative;overflow:hidden}' +
    'html.fx-motion .btn-primary::after,html.fx-motion .lv-btn:not(.ghost):not(.line)::after,html.fx-motion .sl-btn:not(.ghost)::after,html.fx-motion .mq-btn:not(.ghost):not(.line)::after{content:"";position:absolute;top:0;left:-70%;width:45%;height:100%;background:linear-gradient(100deg,transparent,rgba(255,255,255,.38),transparent);transform:skewX(-20deg);animation:fxSweep 4.5s ease-in-out infinite;pointer-events:none}' +
    '@keyframes fxSweep{0%,60%{left:-70%}100%{left:130%}}' +
    'html.fx-motion .brand-logo{animation:fxGlow 3.6s ease-in-out infinite}@keyframes fxGlow{0%,100%{box-shadow:0 0 0 rgba(var(--star-rgb),0)}50%{box-shadow:0 0 18px rgba(var(--star-rgb),.55)}}' +
    'html.fx-motion .hero-badge{animation:fxFloat 4s ease-in-out infinite}@keyframes fxFloat{50%{transform:translateY(-5px)}}' +
    /* hình nổi trang trí ở đầu trang */
    '.hero,.page-hero{position:relative;overflow:hidden}.hero>.container,.page-hero>.container{position:relative;z-index:1}' +
    '.fx-deco{position:absolute;pointer-events:none;user-select:none;opacity:.55;filter:drop-shadow(0 6px 10px rgba(var(--star-rgb),.25));animation:fxBob 7s ease-in-out infinite}' +
    '@keyframes fxBob{0%,100%{transform:translateY(0) rotate(-6deg)}50%{transform:translateY(-14px) rotate(6deg)}}' +
    '@media (max-width:700px){.fx-deco{opacity:.3;font-size:22px!important}}' +
    '.fx-glow{position:fixed;width:340px;height:340px;margin:-170px 0 0 -170px;border-radius:50%;pointer-events:none;z-index:-1;background:radial-gradient(circle,rgba(var(--star-rgb),.14),transparent 65%);transition:opacity .3s;opacity:0}' +
    /* bảng chọn */
    '.pal-pop{display:none;max-height:calc(100vh - 90px);overflow-y:auto}.pal-pop.open{display:block;animation:fxRise .25s ease backwards}' +
    '.pal-pop h4{font-size:14px;margin:0 0 10px}.pal-sec{font-size:11.5px;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:.4px;margin:12px 0 7px}' +
    '.pal-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}' +
    '.pal-sw{border:2px solid var(--border);background:var(--surface);color:var(--text);border-radius:12px;padding:6px;cursor:pointer;font:600 11.5px inherit;font-family:inherit;text-align:center}' +
    '.pal-sw i{display:block;height:26px;border-radius:8px;margin-bottom:5px}' +
    '.pal-sw.on{border-color:var(--primary);box-shadow:0 0 0 2px var(--primary-soft)}' +
    '.pal-sc{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.pal-sc button{border:2px solid var(--border);background:var(--surface);color:var(--text);border-radius:11px;padding:6px 2px;cursor:pointer;font:600 10.5px inherit;font-family:inherit;line-height:1.25}.pal-sc button b{display:block;font-size:20px;font-weight:400}.pal-sc button.on{border-color:var(--primary);background:var(--primary-soft)}' +
    '.pal-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:7px 0;font-size:13.5px}' +
    '.pal-switch{position:relative;width:42px;height:24px;border-radius:99px;border:none;background:var(--border);cursor:pointer;flex-shrink:0;transition:background .2s}' +
    '.pal-switch::after{content:"";position:absolute;top:3px;left:3px;width:18px;height:18px;border-radius:50%;background:#fff;transition:transform .2s;box-shadow:0 1px 3px rgba(0,0,0,.3)}' +
    '.pal-switch.on{background:var(--gradient)}.pal-switch.on::after{transform:translateX(18px)}' +
    '.pal-modes{display:grid;grid-template-columns:1fr 1fr;gap:8px}' +
    '.pal-modes button{padding:8px;border-radius:10px;border:2px solid var(--border);background:var(--surface);color:var(--text);font:600 13px inherit;font-family:inherit;cursor:pointer}.pal-modes button.on{border-color:var(--primary);background:var(--primary-soft)}' +
    '@media (prefers-reduced-motion:reduce){html.fx-motion *{animation:none!important}.fx-blob{animation:none!important}.fx-rv{opacity:1!important;transform:none!important}}';
  var st = document.createElement('style'); st.id = 'fx-style'; st.textContent = css; document.head.appendChild(st);

  /* ───────── Lớp nền: blobs + canvas ───────── */
  var layer = document.createElement('div'); layer.id = 'fx-layer'; layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML = '<div class="fx-blob b1"></div><div class="fx-blob b2"></div><div class="fx-blob b3"></div><canvas id="fx-canvas"></canvas>';
  document.body.appendChild(layer);
  var cv = layer.querySelector('canvas'), ctx = cv.getContext('2d');
  var W = 0, H = 0, DPR = 1, shoots = [], sparks = [], P = [], S = null;
  var rgb = '123,110,246', c1 = '123,110,246', c2 = '79,139,240', scrollY = 0, mx = 0, my = 0, running = false, last = 0, nextShoot = 0, lastSpark = 0;

  function hex2rgb(h) { h = String(h || '').trim(); var m = /^#?([0-9a-f]{6})$/i.exec(h); if (!m) return null; var n = parseInt(m[1], 16); return (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255); }
  function readColor() {
    var cs = getComputedStyle(root), v = cs.getPropertyValue('--star-rgb').trim();
    if (v) rgb = v.replace(/\s+/g, '');
    c1 = hex2rgb(cs.getPropertyValue('--primary')) || rgb; c2 = hex2rgb(cs.getPropertyValue('--primary-2')) || rgb;
  }
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
  function density() { return Math.max(0.45, Math.min(1.2, (W * H) / (1280 * 720))) * (W < 700 ? 0.8 : 1); }
  function resize() {
    DPR = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    initScene();
  }

  /* ═════════ CÁC NỀN ĐỘNG ═════════ */
  var LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghkmnrstuw?!&'.split('').concat(['Hello', 'Yes!', 'Go', 'ABC', 'Wow', 'Hi', 'Good', 'Read', 'Fun', 'Smile', 'Learn', 'Star']);
  var EMOJI = ['✏️', '📚', '🎒', '🔤', '⭐', '🧠', '💡', '🌍', '📖', '🎓', '🖍️', '🔔'];
  var SC = {
    stars: {
      init: function () { P = []; var n = Math.min(W < 700 ? 70 : 150, Math.round(W * H / 9500)); for (var i = 0; i < n; i++) { var d = Math.random(); P.push({ x: Math.random() * W, y: Math.random() * H, r: 0.5 + d * 1.5, d: d, ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.8 }); } },
      draw: function (dt, t, dark) {
        var base = dark ? 1 : 0.55;
        P.forEach(function (s) {
          var a = (0.25 + 0.75 * (0.5 + 0.5 * Math.sin(t * s.sp + s.ph))) * base * (0.35 + s.d * 0.65), y = ((s.y - scrollY * 0.08 * s.d) % H + H) % H;
          sparkle(s.x + mx * s.d * 14, y + my * s.d * 14, dark ? s.r : s.r * 0.9, a);
        });
        if (t * 1000 > nextShoot) {
          nextShoot = t * 1000 + 4500 + Math.random() * 6500;
          var ang = 0.55 + Math.random() * 0.35, sp = 0.9 + Math.random() * 0.6;
          shoots.push({ x: Math.random() * W * 0.9, y: Math.random() * H * 0.45, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 0, max: 900 + Math.random() * 500, len: 90 + Math.random() * 90 });
        }
        for (var j = shoots.length - 1; j >= 0; j--) {
          var m = shoots[j]; m.life += dt * 1000; m.x += m.vx * dt * 1000; m.y += m.vy * dt * 1000;
          var p = m.life / m.max; if (p >= 1) { shoots.splice(j, 1); continue; }
          var al = (p < 0.2 ? p / 0.2 : 1 - (p - 0.2) / 0.8) * (dark ? 0.95 : 0.6), mag = Math.hypot(m.vx, m.vy), tx = m.x - m.vx / mag * m.len, ty = m.y - m.vy / mag * m.len;
          var g = ctx.createLinearGradient(m.x, m.y, tx, ty); g.addColorStop(0, 'rgba(' + rgb + ',' + al + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
          ctx.strokeStyle = g; ctx.lineWidth = 1.8; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(m.x, m.y); ctx.lineTo(tx, ty); ctx.stroke();
          ctx.fillStyle = 'rgba(' + rgb + ',' + al + ')'; ctx.beginPath(); ctx.arc(m.x, m.y, 1.8, 0, 6.2832); ctx.fill();
        }
      }
    },
    aurora: {
      init: function () { P = []; for (var i = 0; i < 4; i++) P.push({ base: H * (0.18 + i * 0.12), amp: rnd(30, 70), f: rnd(0.002, 0.005), sp: rnd(0.25, 0.6), ph: rnd(0, 6), c: i % 2 ? 1 : 0, h: rnd(160, 260) }); P.stars = []; for (var k = 0; k < 40; k++) P.stars.push({ x: Math.random() * W, y: Math.random() * H * 0.7, ph: Math.random() * 6 }); },
      draw: function (dt, t, dark) {
        var a0 = dark ? 0.34 : 0.18;
        ctx.save(); if (dark) ctx.globalCompositeOperation = 'lighter';
        P.forEach(function (r) {
          var col = r.c ? c2 : c1, g = ctx.createLinearGradient(0, r.base - r.amp, 0, r.base + r.h);
          g.addColorStop(0, 'rgba(' + col + ',0)'); g.addColorStop(0.35, 'rgba(' + col + ',' + a0 + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H);
          for (var x = 0; x <= W + 20; x += 20) { var y = r.base + Math.sin(x * r.f + t * r.sp + r.ph) * r.amp + Math.sin(x * r.f * 2.3 - t * r.sp * 0.7) * r.amp * 0.4 - scrollY * 0.03; ctx.lineTo(x, y); }
          ctx.lineTo(W + 20, H); ctx.closePath(); ctx.fill();
        });
        ctx.restore();
        P.stars.forEach(function (s) { sparkle(s.x, s.y, 1, (0.3 + 0.5 * Math.sin(t + s.ph)) * (dark ? 0.8 : 0.35)); });
      }
    },
    bubbles: {
      init: function () { P = []; var n = Math.round(30 * density()); for (var i = 0; i < n; i++) P.push(newBubble(true)); },
      draw: function (dt, t, dark) {
        P.forEach(function (b, i) {
          b.y -= b.v * dt; b.x += Math.sin(t * b.sw + b.ph) * 0.25 + (mx * b.r * 0.01);
          if (b.y < -b.r * 2) P[i] = newBubble(false);
          var col = b.c ? c2 : c1, a = (dark ? 0.30 : 0.22) * b.a;
          var g = ctx.createRadialGradient(b.x - b.r * 0.35, b.y - b.r * 0.35, b.r * 0.1, b.x, b.y, b.r);
          g.addColorStop(0, 'rgba(255,255,255,' + (a * 1.6) + ')'); g.addColorStop(0.6, 'rgba(' + col + ',' + (a * 0.35) + ')'); g.addColorStop(1, 'rgba(' + col + ',' + a + ')');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, 6.2832); ctx.fill();
          ctx.strokeStyle = 'rgba(' + col + ',' + (a * 1.4) + ')'; ctx.lineWidth = 1.2; ctx.stroke();
        });
      }
    },
    letters: {
      init: function () { P = []; var n = Math.round(34 * density()); for (var i = 0; i < n; i++) P.push(newLetter(true)); },
      draw: function (dt, t, dark) {
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        P.forEach(function (l, i) {
          l.y += l.v * dt; l.x += Math.sin(t * l.sw + l.ph) * 0.35; l.rot += l.vr * dt;
          if (l.y > H + 60) P[i] = newLetter(false);
          ctx.save(); ctx.translate(l.x, l.y); ctx.rotate(l.rot); ctx.font = '700 ' + l.s + 'px "Be Vietnam Pro",sans-serif';
          ctx.fillStyle = 'rgba(' + (l.c ? c2 : c1) + ',' + (dark ? l.a * 1.5 : l.a) + ')'; ctx.fillText(l.t, 0, 0); ctx.restore();
        });
      }
    },
    petals: {
      init: function () { P = []; var n = Math.round(30 * density()); for (var i = 0; i < n; i++) P.push(newPetal(true)); },
      draw: function (dt, t, dark) {
        P.forEach(function (p, i) {
          p.y += p.v * dt; p.x += Math.sin(t * p.sw + p.ph) * 0.9 + 6 * dt; p.rot += p.vr * dt;
          if (p.y > H + 20 || p.x > W + 30) P[i] = newPetal(false);
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(0.5 + 0.5 * Math.abs(Math.sin(t * p.sw * 1.6 + p.ph)), 1);
          var g = ctx.createLinearGradient(-p.s, 0, p.s, 0); g.addColorStop(0, 'rgba(255,170,195,' + (dark ? 0.75 : 0.65) + ')'); g.addColorStop(1, 'rgba(255,214,226,' + (dark ? 0.7 : 0.6) + ')');
          ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, -p.s * 0.8); ctx.bezierCurveTo(p.s * 1.3, -p.s * 0.9, p.s * 1.1, p.s * 0.8, 0, p.s * 0.8); ctx.bezierCurveTo(-p.s * 0.3, p.s * 0.2, -p.s * 0.3, -p.s * 0.2, 0, -p.s * 0.8); ctx.fill(); ctx.restore();
        });
      }
    },
    fireflies: {
      init: function () { P = []; var n = Math.round(46 * density()); for (var i = 0; i < n; i++) P.push({ x: Math.random() * W, y: Math.random() * H, r: rnd(1.6, 3.6), a: Math.random() * 6.28, sp: rnd(8, 26), ph: Math.random() * 6.28, tw: rnd(0.6, 1.8) }); },
      draw: function (dt, t, dark) {
        ctx.save(); if (dark) ctx.globalCompositeOperation = 'lighter';
        P.forEach(function (f) {
          f.a += Math.sin(t * 0.5 + f.ph) * dt * 1.4; f.x += Math.cos(f.a) * f.sp * dt; f.y += Math.sin(f.a) * f.sp * dt - 3 * dt;
          if (f.x < -10) f.x = W + 10; if (f.x > W + 10) f.x = -10; if (f.y < -10) f.y = H + 10; if (f.y > H + 10) f.y = -10;
          var pulse = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t * f.tw + f.ph)), col = dark ? '255,235,140' : c1, R = f.r * 7;
          var g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, R); g.addColorStop(0, 'rgba(' + col + ',' + (0.9 * pulse * (dark ? 1 : 0.6)) + ')'); g.addColorStop(0.25, 'rgba(' + col + ',' + (0.35 * pulse) + ')'); g.addColorStop(1, 'rgba(' + col + ',0)');
          ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f.x, f.y, R, 0, 6.2832); ctx.fill();
        });
        ctx.restore();
      }
    },
    snow: {
      init: function () { P = []; var n = Math.round(110 * density()); for (var i = 0; i < n; i++) P.push(newFlake(true)); },
      draw: function (dt, t, dark) {
        P.forEach(function (f, i) {
          f.y += f.v * dt; f.x += Math.sin(t * f.sw + f.ph) * 0.4 + mx * f.r * 0.05; if (f.y > H + 6) P[i] = newFlake(false);
          ctx.fillStyle = dark ? 'rgba(255,255,255,' + f.a + ')' : 'rgba(' + c1 + ',' + (f.a * 0.7) + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, 6.2832); ctx.fill();
        });
      }
    },
    doodle: {
      init: function () { P = []; var n = Math.round(20 * density()); for (var i = 0; i < n; i++) P.push({ x: Math.random() * W, y: Math.random() * H, s: rnd(22, 42), e: pick(EMOJI), v: rnd(6, 18), sw: rnd(0.3, 0.8), ph: Math.random() * 6.28, rot: rnd(-0.4, 0.4), vr: rnd(-0.15, 0.15), a: rnd(0.12, 0.24) }); },
      draw: function (dt, t, dark) {
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        P.forEach(function (d) {
          d.y -= d.v * dt; d.x += Math.sin(t * d.sw + d.ph) * 0.3; d.rot += d.vr * dt;
          if (d.y < -50) { d.y = H + 50; d.x = Math.random() * W; d.e = pick(EMOJI); }
          ctx.save(); ctx.globalAlpha = dark ? d.a + 0.06 : d.a; ctx.translate(d.x, d.y); ctx.rotate(d.rot); ctx.font = d.s + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; ctx.fillText(d.e, 0, 0); ctx.restore();
        });
      }
    }
  };
  function newBubble(init) { return { x: Math.random() * W, y: init ? Math.random() * H : H + rnd(20, 120), r: rnd(6, 36), v: rnd(12, 42), sw: rnd(0.4, 1.2), ph: Math.random() * 6.28, c: Math.random() < 0.5 ? 0 : 1, a: rnd(0.5, 1) }; }
  function newLetter(init) { return { x: Math.random() * W, y: init ? Math.random() * H : -rnd(20, 80), s: rnd(16, 40), t: pick(LETTERS), v: rnd(14, 40), sw: rnd(0.3, 0.9), ph: Math.random() * 6.28, rot: rnd(-0.5, 0.5), vr: rnd(-0.25, 0.25), c: Math.random() < 0.5 ? 0 : 1, a: rnd(0.08, 0.2) }; }
  function newPetal(init) { return { x: Math.random() * W, y: init ? Math.random() * H : -rnd(10, 60), s: rnd(7, 14), v: rnd(22, 48), sw: rnd(0.8, 1.8), ph: Math.random() * 6.28, rot: Math.random() * 6.28, vr: rnd(-1.2, 1.2) }; }
  function newFlake(init) { return { x: Math.random() * W, y: init ? Math.random() * H : -6, r: rnd(1, 3.4), v: rnd(24, 70), sw: rnd(0.5, 1.5), ph: Math.random() * 6.28, a: rnd(0.4, 0.95) }; }
  function sparkle(x, y, r, a) {
    ctx.fillStyle = 'rgba(' + rgb + ',' + a + ')'; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.2832); ctx.fill();
    if (r > 1.45) { var l = r * 4.2; ctx.strokeStyle = 'rgba(' + rgb + ',' + (a * 0.6) + ')'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.moveTo(x - l, y); ctx.lineTo(x + l, y); ctx.moveTo(x, y - l); ctx.lineTo(x, y + l); ctx.stroke(); }
  }
  function initScene() { S = SC[fx.scene] || SC.stars; shoots.length = 0; if (W) S.init(); }

  function frame(t) {
    if (!running) return;
    requestAnimationFrame(frame);
    var dt = Math.min(50, t - last); if (dt < 16) return; last = t;
    ctx.clearRect(0, 0, W, H);
    var dark = isDark();
    if (fx.stars && S) S.draw(dt / 1000, t / 1000, dark);
    // vệt sao theo con trỏ
    for (var k = sparks.length - 1; k >= 0; k--) {
      var q = sparks[k]; q.life += dt;
      if (q.life >= q.max) { sparks.splice(k, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.vy += 0.00003 * dt;
      var f = 1 - q.life / q.max; sparkle(q.x, q.y, q.r * (0.5 + f), f * (dark ? 0.95 : 0.8));
    }
  }
  function loop() {
    var want = (fx.stars || fx.trail) && !document.hidden;
    if (want && !running) { running = true; last = performance.now(); requestAnimationFrame(frame); }
    if (!want && running) { running = false; ctx.clearRect(0, 0, W, H); }
  }

  /* ───────── Trang trí trang & hiệu ứng cuộn ───────── */
  var glow = null, io = null;
  function decorate() {
    // hình nổi ở đầu trang (chỉ tạo 1 lần)
    var em = ['🔤', '📚', '✏️', '⭐', '🎓', '💡', '🌈'];
    Array.prototype.forEach.call(document.querySelectorAll('.hero, .page-hero'), function (h) {
      if (h.querySelector('.fx-deco')) return;
      for (var i = 0; i < 6; i++) {
        var d = document.createElement('span'); d.className = 'fx-deco'; d.setAttribute('aria-hidden', 'true'); d.textContent = em[(i + h.offsetHeight) % em.length];
        d.style.cssText = 'left:' + (6 + i * 16 + Math.random() * 6) + '%;top:' + (8 + (i % 3) * 28 + Math.random() * 10) + '%;font-size:' + (22 + Math.random() * 18) + 'px;animation-delay:' + (-i * 1.3) + 's;animation-duration:' + (6 + i) + 's';
        h.insertBefore(d, h.firstChild);
      }
    });
    // cuộn đến đâu hiện đến đó: chỉ ẩn những phần đang nằm DƯỚI màn hình (phần đã thấy không bị ảnh hưởng)
    if (window.IntersectionObserver && !io) {
      io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('fx-in'); io.unobserve(e.target); } }); }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
      Array.prototype.forEach.call(document.querySelectorAll('.section-head, .feature, .stat-card, .course-card, .sc-card, .ar-game, .wh-card, .mq-card, .lv-card, .card'), function (el) {
        var r = el.getBoundingClientRect(); if (r.top > window.innerHeight * 0.92) { el.classList.add('fx-rv'); io.observe(el); }
      });
    }
  }
  var tiltEl = null;
  document.addEventListener('pointermove', function (e) {
    if (!fx.motion || e.pointerType === 'touch') return;
    var el = e.target.closest && e.target.closest('.course-card, .sc-card, .ar-game');
    if (el) { var r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.setProperty('--ry', (x * 9).toFixed(2) + 'deg'); el.style.setProperty('--rx', (-y * 9).toFixed(2) + 'deg'); tiltEl = el; }
    else if (tiltEl) { tiltEl.style.setProperty('--rx', '0deg'); tiltEl.style.setProperty('--ry', '0deg'); tiltEl = null; }
    if (fx.trail && glow) { glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; glow.style.opacity = 1; }
  }, { passive: true });
  document.addEventListener('pointerleave', function () { if (glow) glow.style.opacity = 0; });

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
  new MutationObserver(function () { readColor(); }).observe(root, { attributes: true, attributeFilter: ['data-theme', 'data-palette'] });

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
      '<div class="pal-sec">Nền động</div><div class="pal-sc">' + SCENES.map(function (s) { return '<button type="button" data-sc="' + s.k + '" class="' + (fx.stars && fx.scene === s.k ? 'on' : '') + '"><b>' + s.e + '</b>' + s.n + '</button>'; }).join('') + '</div>' +
      '<div class="pal-sec">Chế độ</div><div class="pal-modes"><button type="button" data-mode="light" class="' + (isDark() ? '' : 'on') + '">☀️ Sáng</button><button type="button" data-mode="dark" class="' + (isDark() ? 'on' : '') + '">🌙 Tối</button></div>' +
      '<div class="pal-sec">Hiệu ứng</div>' +
      '<div class="pal-row"><span>🌠 Nền động (hạt, sao, cánh hoa...)</span>' + sw(fx.stars, 'stars') + '</div>' +
      '<div class="pal-row"><span>🖱️ Vệt sáng theo con trỏ</span>' + sw(fx.trail, 'trail') + '</div>' +
      '<div class="pal-row"><span>🎞️ Chuyển động mềm mại (hiện dần, nghiêng thẻ)</span>' + sw(fx.motion, 'motion') + '</div>';
  }
  function syncPopover() { if (pop.classList.contains('open')) render(); }
  function place(btn) {
    var r = btn.getBoundingClientRect(), w = Math.min(300, window.innerWidth - 24);
    pop.style.top = Math.min(r.bottom + 8, window.innerHeight - 40) + 'px';
    pop.style.left = Math.max(12, Math.min(r.right - w, window.innerWidth - w - 12)) + 'px';
  }
  function applyFx() {
    root.classList.toggle('fx-stars', !!fx.stars);
    root.classList.toggle('fx-motion', !!fx.motion);
    layer.style.display = (fx.stars || fx.motion || fx.trail) ? '' : 'none';
    var blobs = layer.querySelectorAll('.fx-blob');
    Array.prototype.forEach.call(blobs, function (b) { b.style.display = fx.motion || fx.stars ? '' : 'none'; b.style.animation = fx.motion ? '' : 'none'; });
    if (!fx.stars) shoots.length = 0;
    if (fx.motion) decorate();
    if (fx.trail && !glow) { glow = document.createElement('div'); glow.className = 'fx-glow'; document.body.appendChild(glow); }
    if (glow) glow.style.display = fx.trail ? '' : 'none';
    loop();
  }
  document.addEventListener('click', function (e) {
    var t = e.target, btn = t.closest && t.closest('#paletteToggle');
    if (btn) { e.stopPropagation(); if (pop.classList.contains('open')) pop.classList.remove('open'); else { render(); place(btn); pop.classList.add('open'); } return; }
    if (!pop.contains(t)) { pop.classList.remove('open'); return; }
    var p = t.closest('[data-pal]'); if (p) { setPalette(p.getAttribute('data-pal')); return; }
    var sc = t.closest('[data-sc]'); if (sc) { fx.scene = sc.getAttribute('data-sc'); fx.stars = true; saveFx(); initScene(); applyFx(); render(); return; }
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

  readColor(); resize(); applyFx();
})();
