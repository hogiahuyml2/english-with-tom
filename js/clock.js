/* Đồng hồ + lịch của English With Tom — thanh mỏng trên đầu mọi trang, bấm vào để mở đồng hồ kim lớn và lịch tháng.
   Ngày giờ hiển thị bằng tiếng Anh; mặc định theo giờ Việt Nam (GMT+7), có thể chuyển sang giờ thiết bị. */
(function () {
  'use strict';
  var host = document.getElementById('ewtClock'); if (!host || host.getAttribute('data-ready')) return; host.setAttribute('data-ready', '1');

  var VN = 'Asia/Ho_Chi_Minh', store = function (k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; };
  var S = { h24: store('ewt-clock-24') !== '0', tz: store('ewt-clock-tz') === 'local' ? 'local' : 'vn' };
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ───── thời gian theo múi giờ đang chọn ───── */
  var fmtCache = {};
  function parts(d) {
    var tz = S.tz === 'vn' ? VN : undefined, key = tz || 'local', f = fmtCache[key];
    if (!f) f = fmtCache[key] = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', year: 'numeric', month: 'numeric', day: 'numeric', weekday: 'short', hour: 'numeric', minute: 'numeric', second: 'numeric' });
    var o = {}; f.formatToParts(d).forEach(function (p) { o[p.type] = p.value; });
    var wd = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(o.weekday);
    return { y: +o.year, mo: +o.month, d: +o.day, wd: wd, h: +o.hour % 24, mi: +o.minute, s: +o.second };
  }
  function tzLabel() {
    if (S.tz === 'vn') return 'GMT+7';
    var off = -new Date().getTimezoneOffset(), a = Math.abs(off); return 'GMT' + (off >= 0 ? '+' : '−') + Math.floor(a / 60) + (a % 60 ? ':' + pad(a % 60) : '');
  }
  function greet(h) { return h >= 5 && h < 12 ? 'Good morning' : h >= 12 && h < 17 ? 'Good afternoon' : h >= 17 && h < 21 ? 'Good evening' : 'Good night'; }
  function phase(h) { return h >= 6 && h < 17 ? 'day' : h >= 17 && h < 19 ? 'dusk' : 'night'; }
  function dayOfYear(p) { return Math.round((Date.UTC(p.y, p.mo - 1, p.d) - Date.UTC(p.y, 0, 1)) / 864e5) + 1; }
  function isoWeek(p) { var d = new Date(Date.UTC(p.y, p.mo - 1, p.d)), n = (d.getUTCDay() + 6) % 7; d.setUTCDate(d.getUTCDate() - n + 3); var f = new Date(Date.UTC(d.getUTCFullYear(), 0, 4)); return 1 + Math.round(((d - f) / 864e5 - 3 + ((f.getUTCDay() + 6) % 7)) / 7); }
  function leap(y) { return (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0; }
  function clock12(h) { return { h: h % 12 === 0 ? 12 : h % 12, ap: h < 12 ? 'AM' : 'PM' }; }

  /* ───── hình ───── */
  function icon(ph) {
    if (ph === 'night') return '<svg class="ck-ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="#FDE68A" stroke="#F59E0B" stroke-width="1.2" stroke-linejoin="round"/><circle class="ck-tw" cx="18" cy="5" r="1.1" fill="#FDE68A"/><circle class="ck-tw ck-tw2" cx="21" cy="9" r=".8" fill="#FDE68A"/></svg>';
    if (ph === 'dusk') return '<svg class="ck-ico" viewBox="0 0 24 24" aria-hidden="true"><g class="ck-spin"><circle cx="12" cy="14" r="5" fill="#FB923C"/><path d="M12 4v2.5M4 14H1.5M22.5 14H20M6 8l-1.8-1.8M18 8l1.8-1.8" stroke="#F97316" stroke-width="1.8" stroke-linecap="round"/></g><path d="M2 19.5h20" stroke="#F97316" stroke-width="1.8" stroke-linecap="round"/></svg>';
    return '<svg class="ck-ico" viewBox="0 0 24 24" aria-hidden="true"><g class="ck-spin"><circle cx="12" cy="12" r="4.6" fill="#FBBF24"/><path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.3 5.3l1.8 1.8M16.9 16.9l1.8 1.8M5.3 18.7l1.8-1.8M16.9 7.1l1.8-1.8" stroke="#F59E0B" stroke-width="1.9" stroke-linecap="round"/></g></svg>';
  }
  function face(uid, big) {
    var t = '', i, a, x1, y1, x2, y2, r;
    for (i = 0; i < 60; i++) { a = i * 6 * Math.PI / 180; var major = i % 5 === 0; r = major ? 82 : 87; if (!big && !major) continue; x1 = 100 + Math.sin(a) * 92; y1 = 100 - Math.cos(a) * 92; x2 = 100 + Math.sin(a) * r; y2 = 100 - Math.cos(a) * r; t += '<line x1="' + x1.toFixed(1) + '" y1="' + y1.toFixed(1) + '" x2="' + x2.toFixed(1) + '" y2="' + y2.toFixed(1) + '" stroke="' + (major ? 'var(--text)' : 'var(--text-faint,#9aa)') + '" stroke-width="' + (major ? (big ? 3.4 : 7) : 1.6) + '" stroke-linecap="round"/>'; }
    var nums = big ? [[12, 100, 62], [3, 138, 105], [6, 100, 148], [9, 62, 105]].map(function (n) { return '<text x="' + n[1] + '" y="' + n[2] + '" text-anchor="middle" font-size="20" font-weight="800" fill="var(--text)" font-family="inherit">' + n[0] + '</text>'; }).join('') : '';
    return '<circle cx="100" cy="100" r="97" fill="var(--surface)" stroke="var(--primary)" stroke-width="' + (big ? 5 : 9) + '"/><circle cx="100" cy="100" r="90" fill="url(#' + uid + 'g)"/>' + t + nums +
      '<g class="ck-hh" style="transform-origin:100px 100px"><line x1="100" y1="106" x2="100" y2="' + (big ? 56 : 52) + '" stroke="var(--text)" stroke-width="' + (big ? 7 : 12) + '" stroke-linecap="round"/></g>' +
      '<g class="ck-mh" style="transform-origin:100px 100px"><line x1="100" y1="108" x2="100" y2="' + (big ? 34 : 28) + '" stroke="var(--primary)" stroke-width="' + (big ? 5 : 9) + '" stroke-linecap="round"/></g>' +
      (big ? '<g class="ck-sh" style="transform-origin:100px 100px"><line x1="100" y1="120" x2="100" y2="26" stroke="#F97316" stroke-width="2.4" stroke-linecap="round"/><circle cx="100" cy="30" r="4.5" fill="#F97316"/></g>' : '') +
      '<circle cx="100" cy="100" r="' + (big ? 6.5 : 10) + '" fill="var(--text)"/><circle cx="100" cy="100" r="' + (big ? 2.6 : 4) + '" fill="#F97316"/>';
  }
  function analog(cls, big) {
    var uid = 'ck' + Math.random().toString(36).slice(2, 7);
    return '<svg class="' + cls + '" viewBox="0 0 200 200" aria-hidden="true"><defs><radialGradient id="' + uid + 'g" cx="50%" cy="38%" r="70%"><stop offset="0" stop-color="var(--surface)"/><stop offset="1" stop-color="var(--primary-soft)"/></radialGradient></defs>' + face(uid, big) + '</svg>';
  }

  /* ───── CSS ───── */
  var css = '#ewtClock{min-height:36px;position:relative;z-index:101}' +
    '.ck-bar{background:linear-gradient(90deg,var(--primary-soft),var(--surface) 50%,var(--primary-soft));border-bottom:1px solid var(--border);font-size:12.5px;color:var(--text)}' +
    '.ck-in{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:36px}' +
    '.ck-left{display:flex;align-items:center;gap:8px;min-width:0;white-space:nowrap;overflow:hidden}' +
    '.ck-ico{width:20px;height:20px;flex:none}.ck-spin{transform-origin:12px 12px;animation:ckSpin 24s linear infinite}@keyframes ckSpin{to{transform:rotate(360deg)}}' +
    '.ck-tw{animation:ckTw 2.4s ease-in-out infinite}.ck-tw2{animation-delay:1.1s}@keyframes ckTw{0%,100%{opacity:.25}50%{opacity:1}}' +
    '.ck-greet{font-weight:800;color:var(--primary)}.ck-sep{opacity:.4}.ck-date{font-weight:600;color:var(--text-muted)}.ck-date b{color:var(--text);font-weight:800}' +
    '.ck-btn{display:inline-flex;align-items:center;gap:8px;border:1.5px solid var(--border);background:var(--surface);color:var(--text);border-radius:99px;padding:3px 12px 3px 5px;font:inherit;font-family:inherit;cursor:pointer;min-height:28px;transition:box-shadow .15s,border-color .15s}' +
    '.ck-btn:hover,.ck-btn[aria-expanded=true]{border-color:var(--primary);box-shadow:0 2px 10px rgba(111,88,238,.2)}.ck-mini{width:22px;height:22px;flex:none}' +
    '.ck-time{font-weight:800;font-variant-numeric:tabular-nums;letter-spacing:.2px;font-size:14px}.ck-time i{font-style:normal;opacity:.55;font-weight:700;font-size:12px}.ck-colon{animation:ckBlink 1s steps(2,jump-none) infinite}@keyframes ckBlink{50%{opacity:.25}}.ck-tz{font-size:10.5px;font-weight:800;color:var(--primary);background:var(--primary-soft);border-radius:6px;padding:1px 6px}' +
    '.ck-pop{position:absolute;right:max(12px,calc((100vw - var(--cw,1200px))/2));top:40px;width:min(560px,calc(100vw - 24px));background:var(--surface);color:var(--text);border:1.5px solid var(--border);border-radius:22px;box-shadow:0 24px 60px rgba(40,25,100,.28);padding:18px;display:none;gap:18px;grid-template-columns:200px 1fr;animation:ckIn .28s cubic-bezier(.2,.9,.3,1.2)}.ck-pop.on{display:grid}@keyframes ckIn{from{opacity:0;transform:translateY(-8px) scale(.97)}}' +
    '.ck-big{width:100%;aspect-ratio:1;filter:drop-shadow(0 8px 16px rgba(80,60,160,.18))}.ck-dig{text-align:center;margin-top:8px;font-weight:800;font-size:26px;font-variant-numeric:tabular-nums}.ck-dig small{font-size:13px;opacity:.6;margin-left:4px}' +
    '.ck-full{font-weight:800;font-size:17px;line-height:1.3}.ck-full span{display:block;color:var(--primary);font-size:13px;margin-bottom:2px}' +
    '.ck-meta{font-size:12px;color:var(--text-muted);margin:4px 0 8px}.ck-prog{height:8px;border-radius:99px;background:var(--primary-soft);overflow:hidden}.ck-prog i{display:block;height:100%;border-radius:99px;background:var(--gradient);transition:width .6s}' +
    '.ck-cal{display:grid;grid-template-columns:repeat(7,1fr);gap:2px;margin-top:10px;text-align:center;font-size:12px}.ck-cal b{font-size:10.5px;color:var(--text-faint);font-weight:800;padding:3px 0}.ck-cal span{padding:5px 0;border-radius:9px;font-weight:600}.ck-cal .we{color:var(--text-muted)}.ck-cal .today{background:var(--gradient);color:#fff;font-weight:800;box-shadow:0 3px 8px rgba(111,88,238,.35)}' +
    '.ck-opts{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:8px;justify-content:space-between;border-top:1px dashed var(--border);padding-top:12px}.ck-seg{display:inline-flex;background:var(--primary-soft);border-radius:99px;padding:3px}.ck-seg button{border:none;background:none;font:700 12px inherit;font-family:inherit;color:var(--text-muted);padding:5px 12px;border-radius:99px;cursor:pointer;min-height:28px}.ck-seg button.on{background:var(--surface);color:var(--primary);box-shadow:0 1px 4px rgba(0,0,0,.12)}' +
    '@media (max-width:640px){.ck-greet,.ck-sep,.ck-tz{display:none}.ck-date{font-size:12px}.ck-pop{grid-template-columns:1fr;right:12px;left:12px;width:auto}.ck-big{max-width:190px;margin:0 auto;display:block}}' +
    '@media (prefers-reduced-motion:reduce){.ck-spin,.ck-tw,.ck-colon,.ck-pop{animation:none!important}.ck-prog i{transition:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ───── khung ───── */
  host.innerHTML = '<div class="ck-bar"><div class="container ck-in"><div class="ck-left"><span id="ckIco"></span><span class="ck-greet" id="ckGreet"></span><span class="ck-sep">·</span><span class="ck-date" id="ckDate"></span></div>' +
    '<button type="button" class="ck-btn" id="ckBtn" aria-haspopup="dialog" aria-expanded="false" aria-label="Open clock and calendar">' + analog('ck-mini', false) + '<span class="ck-time" id="ckTime"></span><span class="ck-tz" id="ckTz"></span></button></div></div>' +
    '<div class="ck-pop" id="ckPop" role="dialog" aria-label="Clock and calendar"><div><div id="ckBigBox">' + analog('ck-big', true) + '</div><div class="ck-dig" id="ckDig"></div></div><div><div class="ck-full" id="ckFull"></div><div class="ck-meta" id="ckMeta"></div><div class="ck-prog"><i id="ckProg"></i></div><div class="ck-cal" id="ckCal"></div></div>' +
    '<div class="ck-opts"><div class="ck-seg" id="ckSegFmt"><button type="button" data-f="24">24-hour</button><button type="button" data-f="12">12-hour</button></div><div class="ck-seg" id="ckSegTz"><button type="button" data-z="vn">Vietnam</button><button type="button" data-z="local">My device</button></div></div></div>';
  var $ = function (id) { return document.getElementById(id); };
  var cont = document.querySelector('.container'); if (cont) host.querySelector('#ckPop').style.setProperty('--cw', Math.round(cont.getBoundingClientRect().width) + 'px');

  var secDeg = null, lastPhase = '', lastDay = '', open = false;
  function rot(el, deg, smooth) { if (!el) return; el.style.transition = smooth ? 'transform .28s cubic-bezier(.4,2.2,.6,1)' : 'none'; el.style.transform = 'rotate(' + deg + 'deg)'; }
  function fmt(p) {
    if (S.h24) return { t: pad(p.h) + '<span class="ck-colon">:</span>' + pad(p.mi), s: ':' + pad(p.s), ap: '' };
    var c = clock12(p.h); return { t: c.h + '<span class="ck-colon">:</span>' + pad(p.mi), s: ':' + pad(p.s), ap: c.ap };
  }
  function calendar(p) {
    var first = new Date(Date.UTC(p.y, p.mo - 1, 1)).getUTCDay(), lead = (first + 6) % 7, dim = [31, leap(p.y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][p.mo - 1], h = '';
    ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].forEach(function (d) { h += '<b>' + d + '</b>'; });
    for (var i = 0; i < lead; i++) h += '<span></span>';
    for (var d = 1; d <= dim; d++) { var col = (lead + d - 1) % 7; h += '<span class="' + (d === p.d ? 'today' : col >= 5 ? 'we' : '') + '">' + d + '</span>'; }
    return h;
  }
  function tick() {
    var now = new Date(), p = parts(now), f = fmt(p), ph = phase(p.h), dayKey = p.y + '-' + p.mo + '-' + p.d;
    $('ckTime').innerHTML = f.t + '<i>' + f.s + '</i>' + (f.ap ? ' <i>' + f.ap + '</i>' : '');
    $('ckTz').textContent = tzLabel();
    if (ph !== lastPhase) { lastPhase = ph; $('ckIco').innerHTML = icon(ph); }
    $('ckGreet').textContent = greet(p.h);
    if (dayKey !== lastDay) { lastDay = dayKey; $('ckDate').innerHTML = '<b>' + DAYS[p.wd] + '</b>, ' + MONTHS[p.mo - 1] + ' ' + p.d + ', ' + p.y; $('ckFull').innerHTML = '<span>' + greet(p.h) + '!</span>' + DAYS[p.wd] + ',<br>' + MONTHS[p.mo - 1] + ' ' + p.d + ', ' + p.y; $('ckMeta').textContent = MONTHS[p.mo - 1] + ' ' + p.y + ' · Day ' + dayOfYear(p) + ' of ' + (leap(p.y) ? 366 : 365) + ' · Week ' + isoWeek(p); $('ckCal').innerHTML = calendar(p); }
    var hAng = (p.h % 12) * 30 + p.mi * 0.5, mAng = p.mi * 6 + p.s * 0.1;
    var mini = host.querySelector('.ck-mini'); rot(mini.querySelector('.ck-hh'), hAng); rot(mini.querySelector('.ck-mh'), mAng);
    if (open) {
      var big = host.querySelector('.ck-big'); rot(big.querySelector('.ck-hh'), hAng); rot(big.querySelector('.ck-mh'), mAng);
      secDeg = secDeg === null ? p.s * 6 : (p.s === 0 ? Math.ceil(secDeg / 360) * 360 : Math.floor(secDeg / 360) * 360 + p.s * 6);
      rot(big.querySelector('.ck-sh'), secDeg, true);
      $('ckDig').innerHTML = f.t + f.s + (f.ap ? '<small>' + f.ap + '</small>' : '');
      $('ckProg').style.width = ((p.h * 3600 + p.mi * 60 + p.s) / 864).toFixed(1) + '%';
      var sf = $('ckSegFmt'), sz = $('ckSegTz'); [].forEach.call(sf.children, function (b) { b.classList.toggle('on', (b.getAttribute('data-f') === '24') === S.h24); }); [].forEach.call(sz.children, function (b) { b.classList.toggle('on', b.getAttribute('data-z') === S.tz); });
    }
  }
  var timer = null;
  function loop() { clearTimeout(timer); tick(); timer = setTimeout(loop, 1000 - (Date.now() % 1000) + 8); }
  document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else loop(); });

  function setOpen(v) { open = v; $('ckPop').classList.toggle('on', v); $('ckBtn').setAttribute('aria-expanded', v ? 'true' : 'false'); secDeg = null; if (v) tick(); }
  $('ckBtn').addEventListener('click', function (e) { e.stopPropagation(); setOpen(!open); });
  document.addEventListener('click', function (e) { if (open && !e.target.closest('#ckPop')) setOpen(false); var b = e.target.closest('#ckPop [data-f],#ckPop [data-z]'); if (!b) return; if (b.hasAttribute('data-f')) { S.h24 = b.getAttribute('data-f') === '24'; store('ewt-clock-24', S.h24 ? '1' : '0'); } else { S.tz = b.getAttribute('data-z'); store('ewt-clock-tz', S.tz); lastDay = ''; } tick(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && open) { setOpen(false); $('ckBtn').focus(); } });
  loop();
})();
