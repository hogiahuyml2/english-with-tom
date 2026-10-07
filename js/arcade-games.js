/* English With Tom — 4 trò chơi từ vựng theo chủ đề: Đua xe, Cứu công chúa, Bong bóng chữ, Thủ môn.
   Nạp từ arcade.html; mỗi trò là hàm G.<id>(X, pool, host, hud, done, opts) → { destroy }.
   X = bộ tiện ích của arcade.html (api, esc, shuffle, beep, speak, confetti, makeCanvas, loop, heartsStr, pickWords, allWords).
   done(results, {score}) — results: [{ id, ok, w }]. Điểm/XP/huy hiệu do máy chủ tính từ kết quả từng từ. */
(function () {
  'use strict';
  var G = window.ARXGAMES = {};

  /* ───────── Tiện ích chung ───────── */
  function norm(s) { return String(s || '').toLowerCase().replace(/[’‘`]/g, "'").replace(/[^a-z0-9' -]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function normVi(s) { return String(s || '').toLowerCase().replace(/\s+/g, ' ').trim(); }
  function div(cls, html) { var d = document.createElement('div'); if (cls) d.className = cls; if (html != null) d.innerHTML = html; return d; }
  function rr(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.quadraticCurveTo(x + w, y, x + w, y + r); ctx.lineTo(x + w, y + h - r); ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h); ctx.lineTo(x + r, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - r); ctx.lineTo(x, y + r); ctx.quadraticCurveTo(x, y, x + r, y); ctx.closePath(); }
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function ease(k) { return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }
  function rnd(a, b) { return a + Math.random() * (b - a); }

  // Câu hỏi trắc nghiệm nghĩa: dir 0 = từ Anh → nghĩa Việt, dir 1 = nghĩa Việt → từ Anh. 3 phương án, không trùng nghĩa/từ.
  function makeMcq(X, w, pool, dir, n) {
    n = n || 3;
    var seenVi = {}, seenW = {}; seenVi[normVi(w.vi)] = 1; seenW[norm(w.word)] = 1;
    var VC = window.EWTVocabConflict;
    function usable(x) { return x.id !== w.id && x.kind === 'word' && x.vi && !seenVi[normVi(x.vi)] && !seenW[norm(x.word)] && !(VC && VC.conflict(w, x)); }
    var cands = X.shuffle(pool.filter(usable));
    var same = cands.filter(function (x) { return x.pos && x.pos === w.pos; });
    var rest = cands.filter(function (x) { return !(x.pos && x.pos === w.pos); });
    var chosen = [];
    var order = same.concat(rest);
    if (order.length < n - 1) order = order.concat(X.shuffle(X.allWords().filter(usable)));
    for (var i = 0; i < order.length && chosen.length < n - 1; i++) {
      var x = order[i]; if (seenVi[normVi(x.vi)] || seenW[norm(x.word)]) continue;
      seenVi[normVi(x.vi)] = 1; seenW[norm(x.word)] = 1; chosen.push(x);
    }
    var opts = X.shuffle([w].concat(chosen)).map(function (o) { return { text: dir === 0 ? o.vi : o.word, ok: o.id === w.id, w: o }; });
    return { w: w, dir: dir, opts: opts, prompt: dir === 0 ? w.word : w.vi, sub: (w.pos ? w.pos + ' · ' : '') + (dir === 0 ? 'chọn nghĩa tiếng Việt đúng' : 'chọn từ tiếng Anh đúng'), speak: dir === 0 ? w.word : null };
  }
  // Câu điền từ: lấy câu ví dụ của từ, thay từ khoá bằng chỗ trống; kèm bản dịch tiếng Việt để tránh nhập nhằng.
  function gapRe(word) { return new RegExp('(^|[^A-Za-z])(' + String(word).replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![A-Za-z])', 'i'); }
  function gapable(w) { return w.kind === 'word' && w.ex && w.vi && gapRe(w.word).test(w.ex); }
  function makeGap(X, w, pool, n) {
    n = n || 3;
    var m = gapRe(w.word).exec(w.ex); if (!m) return null;
    var shown = m[2], cap = /^[A-Z]/.test(shown), start = m.index + m[1].length;
    var sentence = w.ex.slice(0, start) + '_____' + w.ex.slice(start + shown.length);
    var exLow = w.ex.toLowerCase(), nWords = w.word.split(' ').length;
    var VC = window.EWTVocabConflict;
    function usable(x) { return x.id !== w.id && x.kind === 'word' && norm(x.word) !== norm(w.word) && !gapRe(x.word).test(w.ex) && exLow.indexOf(x.word.toLowerCase()) < 0 && x.pos === w.pos && !(VC && VC.conflict(w, x)); }
    var cands = X.shuffle(pool.filter(usable));
    var near = cands.filter(function (x) { return x.word.split(' ').length === nWords; });
    var order = near.concat(cands.filter(function (x) { return near.indexOf(x) < 0; }));
    if (order.length < n - 1) order = order.concat(X.shuffle(X.allWords().filter(usable)));
    var chosen = [], seen = {}; seen[norm(w.word)] = 1;
    for (var i = 0; i < order.length && chosen.length < n - 1; i++) { var k = norm(order[i].word); if (seen[k]) continue; seen[k] = 1; chosen.push(order[i]); }
    if (chosen.length < n - 1) return null;
    function show(t) { return cap ? t.charAt(0).toUpperCase() + t.slice(1) : t; }
    var opts = X.shuffle([w].concat(chosen)).map(function (o) { return { text: o.id === w.id ? shown : show(o.word), ok: o.id === w.id, w: o }; });
    return { w: w, opts: opts, prompt: sentence, sub: w.exVi || '', isGap: true };
  }

  // Dựng bộ nút đáp án (DOM) — hỗ trợ phím 1-4. onPick(index) chỉ gọi 1 lần cho mỗi câu.
  function optionsBar(host) {
    var box = div('ax-opts'); host.appendChild(box);
    var api = { box: box, locked: true, q: null, cb: null };
    api.show = function (q, cb) {
      api.q = q; api.cb = cb; api.locked = false;
      box.innerHTML = q.opts.map(function (o, i) { return '<button type="button" class="ax-opt" data-i="' + i + '"><span class="k">' + (i + 1) + '</span><span class="t"></span></button>'; }).join('');
      Array.prototype.forEach.call(box.querySelectorAll('.ax-opt'), function (b, i) { b.querySelector('.t').textContent = q.opts[i].text; b.onclick = function () { pick(i); }; });
    };
    function pick(i) { if (api.locked || !api.q || !api.q.opts[i]) return; api.locked = true; var cb = api.cb; if (cb) cb(i); }
    api.mark = function (picked) {
      Array.prototype.forEach.call(box.querySelectorAll('.ax-opt'), function (b, i) {
        var o = api.q.opts[i]; b.disabled = true;
        if (o.ok) b.classList.add('ok'); else if (i === picked) b.classList.add('no'); else b.classList.add('dim');
      });
    };
    api.clear = function () { api.locked = true; api.q = null; box.innerHTML = ''; };
    api.key = function (e) { if (e.ctrlKey || e.metaKey || e.altKey) return; var i = '1234'.indexOf(e.key); if (i >= 0) pick(i); };
    document.addEventListener('keydown', api.key);
    api.destroy = function () { document.removeEventListener('keydown', api.key); };
    return api;
  }
  function timerBar(host) { var b = div('ax-time', '<i></i>'); host.appendChild(b); return { el: b, set: function (f) { b.firstChild.style.width = clamp(f, 0, 1) * 100 + '%'; b.firstChild.style.background = f < .25 ? '#ef4444' : f < .5 ? '#f59e0b' : '#22c55e'; } }; }
  function promptHtml(X, q) {
    if (q.isGap) return '<div class="big ax-gap">' + X.esc(q.prompt).replace('_____', '<span class="ax-blank">_____</span>') + '</div><div class="sub">🇻🇳 ' + X.esc(q.sub) + '</div>';
    return '<div class="big">' + X.esc(q.prompt) + (q.speak ? ' <button class="ar-snd" type="button" data-snd="1" title="Nghe">🔊</button>' : '') + '</div><div class="sub">' + X.esc(q.sub) + '</div>';
  }
  function wireSnd(X, el, q) { var b = el.querySelector('[data-snd]'); if (b && q.speak) b.onclick = function () { X.speak(q.speak); }; }

  /* ═════════ 1. ĐUA XE — trả lời đúng để xe vượt chướng ngại vật ═════════ */
  G.racing = function (X, poolW, host, hud, done, opts) {
    var C = X.makeCanvas(host), ctx = C.ctx, W2 = C.W, H = C.H;
    var promptEl = div('ar-prompt'); host.insertBefore(promptEl, C.cv);
    var tb = timerBar(host), ob = optionsBar(host);
    var N = 10, words = X.pickWords('racing', poolW, N, null), qi = 0, lives = 3, score = 0, combo = 0, best = 0, results = [], dead = false, timer = null;
    var ROAD_Y = 318, ROAD_H = 120, CAR_X = 150, CAR_W = 96;
    var car = { y: 0, vy: 0, air: 0, crash: 0, spin: 0 }, obs = null, q = null, state = 'idle', scroll = 0, speed = 90, tgtSpeed = 90, qT = 0, qMax = 11, smoke = [], parts = [];
    var clouds = []; for (var i = 0; i < 5; i++) clouds.push({ x: Math.random() * W2, y: 30 + Math.random() * 110, s: .6 + Math.random() * .8, v: 6 + Math.random() * 8 });
    var trees = []; for (var t = 0; t < 14; t++) trees.push({ x: t * 90 + Math.random() * 40, s: .7 + Math.random() * .7 });
    var KINDS = ['cone', 'barrel', 'rock', 'log'];
    function setHud() { hud.textContent = X.heartsStr(lives) + '  ⭐ ' + score + '  ' + Math.min(qi + 1, N) + '/' + N; }
    function nextQ() {
      if (dead) return;
      if (qi >= N || lives <= 0) return finish();
      var w = words[qi]; q = makeMcq(X, w, poolW, qi % 2, 3);
      obs = { x: W2 + 330, kind: KINDS[Math.floor(Math.random() * KINDS.length)], hit: false, gone: false };
      var D = obs.x - (CAR_X + CAR_W - 8); speed = tgtSpeed = (D - 200) / qMax; qT = 0; state = 'ask'; // hết giờ khi chướng ngại còn cách xe 200px (đủ chỗ để nhảy/đâm)
      promptEl.innerHTML = promptHtml(X, q); wireSnd(X, promptEl, q); if (q.speak) X.speak(q.speak);
      ob.show(q, onAnswer); setHud();
    }
    function onAnswer(i) {
      if (state !== 'ask') return;
      var ok = q.opts[i].ok; ob.mark(i); results.push({ id: q.w.id, ok: ok, w: q.w });
      if (ok) { combo++; best = Math.max(best, combo); score += 100 + combo * 10 + Math.round(Math.max(0, 1 - qT / qMax) * 60); X.beep('ok'); if (q.dir === 1) X.speak(q.w.word); state = 'boost'; speed = tgtSpeed = 330; }
      else { combo = 0; X.beep('bad'); state = 'doom'; speed = tgtSpeed = 240; }
      setHud();
    }
    function timeout() { // hết giờ → coi như sai
      if (state !== 'ask') return; ob.mark(-1); results.push({ id: q.w.id, ok: false, w: q.w }); combo = 0; X.beep('bad'); state = 'doom'; speed = tgtSpeed = 240; setHud();
    }
    function finish() { if (dead) return; dead = true; ob.clear(); done(results, { score: score }); }
    function after(ms) { timer = setTimeout(function () { qi++; nextQ(); }, ms); }
    var stop = X.loop(function (dt, tt) {
      speed += (tgtSpeed - speed) * Math.min(1, dt * 3.2); scroll += speed * dt;
      clouds.forEach(function (c) { c.x -= (c.v + speed * .05) * dt; if (c.x < -90) c.x = W2 + 60; });
      if (state === 'ask') { qT += dt; tb.set(1 - qT / qMax); if (qT >= qMax) timeout(); }
      else tb.set(0);
      if (obs) {
        obs.x -= speed * dt; var front = CAR_X + CAR_W - 8;
        if (state === 'boost' && !obs.jumped && obs.x - front < 134) { obs.jumped = true; car.air = .0001; car.vy = -640; }
        if (state === 'doom' && !obs.hit && obs.x <= front) { // đâm
          obs.hit = true; car.crash = 1; lives--; for (var i = 0; i < 18; i++) parts.push({ x: obs.x, y: ROAD_Y + 60, vx: rnd(-120, 160), vy: rnd(-220, -40), t: 0, life: .8, c: i % 2 ? '#f59e0b' : '#9ca3af' });
          tgtSpeed = 0; speed = 0; setHud(); X.beep('bad');
          timer = setTimeout(function () { obs = null; car.crash = 0; if (lives <= 0) return finish(); qi++; tgtSpeed = 120; nextQ(); }, 1100);
        }
        if (state === 'boost' && obs && !obs.gone && obs.x < CAR_X - 70) { obs.gone = true; state = 'between'; tgtSpeed = 120; after(450); }
      }
      if (car.air) { car.vy += 1150 * dt; car.y += car.vy * dt; car.air += dt; if (car.y >= 0) { car.y = 0; car.vy = 0; car.air = 0; } }
      if (car.crash) car.spin = Math.sin(tt * 40) * 2;
      parts.forEach(function (p) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 500 * dt; }); parts = parts.filter(function (p) { return p.t < p.life; });
      draw(tt);
    });
    function draw(tt) {
      var g = ctx.createLinearGradient(0, 0, 0, ROAD_Y); g.addColorStop(0, '#38bdf8'); g.addColorStop(1, '#e0f2fe'); ctx.fillStyle = g; ctx.fillRect(0, 0, W2, H);
      ctx.fillStyle = '#fde68a'; ctx.beginPath(); ctx.arc(540, 70, 30, 0, 6.3); ctx.fill();
      clouds.forEach(function (c) { ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.beginPath(); ctx.arc(c.x, c.y, 18 * c.s, 0, 6.3); ctx.arc(c.x + 20 * c.s, c.y + 4, 14 * c.s, 0, 6.3); ctx.arc(c.x - 20 * c.s, c.y + 5, 13 * c.s, 0, 6.3); ctx.fill(); });
      // núi xa (cuộn chậm) + đồi gần
      ctx.fillStyle = '#7dd3a8'; ctx.beginPath(); ctx.moveTo(0, ROAD_Y); for (var x = 0; x <= W2 + 20; x += 20) ctx.lineTo(x, ROAD_Y - 70 - Math.sin((x + scroll * .08) / 70) * 26 - Math.sin((x + scroll * .08) / 31) * 8); ctx.lineTo(W2, ROAD_Y); ctx.fill();
      ctx.fillStyle = '#4ade80'; ctx.beginPath(); ctx.moveTo(0, ROAD_Y); for (x = 0; x <= W2 + 20; x += 20) ctx.lineTo(x, ROAD_Y - 28 - Math.sin((x + scroll * .25) / 45) * 12); ctx.lineTo(W2, ROAD_Y); ctx.fill();
      trees.forEach(function (t) { var tx = ((t.x - scroll * .55) % (14 * 90) + 14 * 90) % (14 * 90) - 60; ctx.fillStyle = '#92400e'; ctx.fillRect(tx - 3, ROAD_Y - 38 * t.s, 6, 38 * t.s); ctx.fillStyle = '#16a34a'; ctx.beginPath(); ctx.arc(tx, ROAD_Y - 44 * t.s, 18 * t.s, 0, 6.3); ctx.fill(); });
      ctx.fillStyle = '#4ade80'; ctx.fillRect(0, ROAD_Y + ROAD_H, W2, H - ROAD_Y - ROAD_H); ctx.fillStyle = '#22c55e'; for (x = -((scroll * .9) % 60); x < W2; x += 60) ctx.fillRect(x, ROAD_Y + ROAD_H + 24, 28, 5);
      ctx.fillStyle = '#475569'; ctx.fillRect(0, ROAD_Y, W2, ROAD_H); ctx.fillStyle = '#334155'; ctx.fillRect(0, ROAD_Y, W2, 6); ctx.fillRect(0, ROAD_Y + ROAD_H - 6, W2, 6);
      ctx.fillStyle = '#f8fafc'; for (x = -((scroll) % 80); x < W2; x += 80) ctx.fillRect(x, ROAD_Y + ROAD_H / 2 - 3, 44, 6);
      if (obs) drawObs(obs);
      drawCar();
      parts.forEach(function (p) { ctx.globalAlpha = Math.max(0, 1 - p.t / p.life); ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 5, 5); }); ctx.globalAlpha = 1;
      if (state === 'boost') { ctx.strokeStyle = 'rgba(255,255,255,.55)'; ctx.lineWidth = 2; for (var s = 0; s < 6; s++) { var sy = ROAD_Y + 12 + s * 18, sx = (scroll * 2 + s * 97) % W2; ctx.beginPath(); ctx.moveTo(W2 - sx, sy); ctx.lineTo(W2 - sx + 60, sy); ctx.stroke(); } }
      if (car.crash) { ctx.fillStyle = 'rgba(239,68,68,.18)'; ctx.fillRect(0, 0, W2, H); ctx.font = '800 34px "Be Vietnam Pro",sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#b91c1c'; ctx.lineWidth = 5; ctx.strokeText('Rầm! 💥', W2 / 2, 120); ctx.fillText('Rầm! 💥', W2 / 2, 120); }
      if (state === 'boost' && car.air) { ctx.font = '800 26px "Be Vietnam Pro",sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#16a34a'; ctx.fillText('Vượt qua! ✨', W2 / 2, 120); }
    }
    function drawObs(o) {
      var x = o.x, y = ROAD_Y + 52; ctx.save(); ctx.translate(x, y);
      if (o.kind === 'cone') { ctx.fillStyle = '#f97316'; ctx.beginPath(); ctx.moveTo(-18, 44); ctx.lineTo(18, 44); ctx.lineTo(7, -22); ctx.lineTo(-7, -22); ctx.fill(); ctx.fillStyle = '#fff'; ctx.fillRect(-12, 8, 24, 7); ctx.fillStyle = '#c2410c'; ctx.fillRect(-22, 44, 44, 6); }
      else if (o.kind === 'barrel') { ctx.fillStyle = '#b45309'; rr(ctx, -22, -22, 44, 66, 9); ctx.fill(); ctx.fillStyle = '#78350f'; ctx.fillRect(-22, -6, 44, 6); ctx.fillRect(-22, 22, 44, 6); ctx.fillStyle = '#fde68a'; ctx.fillRect(-4, -22, 8, 66); ctx.globalAlpha = .0; }
      else if (o.kind === 'rock') { ctx.fillStyle = '#6b7280'; ctx.beginPath(); ctx.moveTo(-28, 44); ctx.lineTo(-20, -6); ctx.lineTo(-4, -22); ctx.lineTo(16, -14); ctx.lineTo(28, 14); ctx.lineTo(24, 44); ctx.closePath(); ctx.fill(); ctx.fillStyle = '#9ca3af'; ctx.beginPath(); ctx.moveTo(-4, -22); ctx.lineTo(16, -14); ctx.lineTo(4, 6); ctx.closePath(); ctx.fill(); }
      else { ctx.fillStyle = '#92400e'; rr(ctx, -34, 14, 68, 30, 12); ctx.fill(); ctx.fillStyle = '#d97706'; ctx.beginPath(); ctx.ellipse(34, 29, 7, 15, 0, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#78350f'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(34, 29, 4, 0, 6.3); ctx.stroke(); }
      ctx.restore();
    }
    function drawCar() {
      var x = CAR_X, y = ROAD_Y + 38 + car.y; ctx.save(); ctx.translate(x + CAR_W / 2, y + 30); ctx.rotate(car.air ? clamp(car.vy / 1400, -.35, .35) : (car.crash ? car.spin * .05 : 0)); ctx.translate(-CAR_W / 2, -30);
      ctx.fillStyle = 'rgba(0,0,0,.25)'; if (!car.air) { ctx.beginPath(); ctx.ellipse(CAR_W / 2, 66, 46, 7, 0, 0, 6.3); ctx.fill(); }
      ctx.fillStyle = '#ef4444'; rr(ctx, 0, 22, CAR_W, 32, 9); ctx.fill();
      ctx.fillStyle = '#dc2626'; rr(ctx, 20, 2, 54, 28, 10); ctx.fill();
      ctx.fillStyle = '#bae6fd'; rr(ctx, 27, 8, 18, 16, 4); ctx.fill(); rr(ctx, 49, 8, 18, 16, 4); ctx.fill();
      ctx.fillStyle = '#fde047'; ctx.fillRect(CAR_W - 8, 30, 8, 8); ctx.fillStyle = '#fff'; ctx.fillRect(0, 36, 6, 6);
      [22, 72].forEach(function (wx) { ctx.fillStyle = '#111827'; ctx.beginPath(); ctx.arc(wx, 56, 12, 0, 6.3); ctx.fill(); ctx.fillStyle = '#d1d5db'; ctx.beginPath(); ctx.arc(wx, 56, 5, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#6b7280'; ctx.lineWidth = 2; ctx.beginPath(); var a = scroll / 9; ctx.moveTo(wx + Math.cos(a) * 5, 56 + Math.sin(a) * 5); ctx.lineTo(wx - Math.cos(a) * 5, 56 - Math.sin(a) * 5); ctx.stroke(); });
      ctx.restore();
    }
    nextQ();
    return { destroy: function () { dead = true; stop(); clearTimeout(timer); ob.destroy(); C.off(); } };
  };

  /* ═════════ 2. CỨU CÔNG CHÚA — chọn đúng cánh cửa để tìm đường tới lâu đài ═════════ */
  G.princess = function (X, poolW, host, hud, done, opts) {
    var C = X.makeCanvas(host), ctx = C.ctx, W2 = C.W, H = C.H;
    var promptEl = div('ar-prompt'); host.insertBefore(promptEl, C.cv);
    var ob = optionsBar(host);
    var N = 8, words = X.pickWords('princess', poolW, N, null), qi = 0, lives = 3, score = 0, combo = 0, best = 0, results = [], dead = false, timer = null;
    var STEP = 200, X0 = 320, LANES = [130, 320, 510], LETTERS = ['A', 'B', 'C'];
    var knight = { x: X0, y: 0, walk: 0 }, camY = -330, camT = -330, q = null, state = 'idle', plan = null, right = 1, flash = 0, msg = '', msgT = 0, hearts = [], rescued = false, trapFx = 0;
    var treesDeco = []; for (var i = 0; i < 40; i++) treesDeco.push({ x: Math.random() * W2, y: -Math.random() * (N + 1) * STEP - 60, s: .6 + Math.random() * .8, k: Math.random() < .5 ? 0 : 1 });
    function nodeY(k) { return -k * STEP; }
    function setHud() { hud.textContent = X.heartsStr(lives) + '  ⭐ ' + score + '  ' + Math.min(qi + 1, N) + '/' + N; }
    // đường đi của một làn: từ nút k-1 → nút k (đúng) hoặc ngõ cụt giữa chừng (sai)
    function lanePoint(k, lane, t, deadEnd) {
      var y0 = nodeY(k - 1), y1 = nodeY(k), lx = LANES[lane];
      var tt2 = deadEnd ? t * .62 : t, yy = y0 + (y1 - y0) * tt2, bulge = Math.sin(Math.min(1, tt2) * Math.PI);
      return { x: X0 + (lx - X0) * (lane === 1 ? 0 : bulge), y: yy };
    }
    function nextQ() {
      if (dead) return;
      if (lives <= 0) { state = 'over'; say('Hiệp sĩ bị bắt rồi… 😢'); msgT = 1.6; timer = setTimeout(finish, 1700); return; }
      if (qi >= N) { // tới lâu đài: cứu được công chúa
        state = 'win'; rescued = true; X.beep('win'); X.confetti(34); say('Cứu được công chúa! 👸'); msgT = 2.6;
        for (var h = 0; h < 6; h++) hearts.push({ x: knight.x + 12 + (h - 3) * 8, y: knight.y - 30 - h * 6, t: -h * .15 });
        timer = setTimeout(finish, 2700); return;
      }
      var w = words[qi]; q = makeMcq(X, w, poolW, qi % 2, 3);
      right = 0; for (var j = 0; j < q.opts.length; j++) if (q.opts[j].ok) right = j;
      state = 'ask'; promptEl.innerHTML = promptHtml(X, q); wireSnd(X, promptEl, q); if (q.speak) X.speak(q.speak);
      ob.show(q, onAnswer); setHud();
    }
    function onAnswer(i) {
      if (state !== 'ask') return;
      var ok = q.opts[i].ok; ob.mark(i); results.push({ id: q.w.id, ok: ok, w: q.w }); state = 'walk';
      if (ok) {
        combo++; best = Math.max(best, combo); score += 100 + combo * 10; X.beep('ok'); if (q.dir === 1) X.speak(q.w.word);
        plan = { steps: [{ lane: i, from: 0, to: 1, dead: false, end: 'node' }] };
      } else {
        combo = 0; X.beep('bad'); lives--;
        plan = { steps: [{ lane: i, from: 0, to: 1, dead: true, end: 'trap' }, { lane: i, from: 1, to: 0, dead: true, end: 'back' }] };
        if (lives > 0) plan.steps.push({ lane: right, from: 0, to: 1, dead: false, end: 'node' }); else plan.stay = true; // hết mạng: không đi tiếp
      }
      plan.i = 0; plan.t = 0; setHud();
    }
    function finish() { if (dead) return; dead = true; ob.clear(); done(results, { score: score + (lives > 0 && qi >= N ? 200 : 0) }); }
    function say(t) { msg = t; msgT = 1.3; }
    var stop = X.loop(function (dt, tt) {
      camT = knight.y - 330; camY += (camT - camY) * Math.min(1, dt * 6); if (flash > 0) flash -= dt; if (msgT > 0) msgT -= dt;
      if (state === 'walk' && plan) {
        var s = plan.steps[plan.i], dur = s.dead ? .9 : 1.15; plan.t += dt / dur;
        var k = clamp(plan.t, 0, 1), e = ease(k), tpos = s.from + (s.to - s.from) * e, p = lanePoint(qi + 1, s.lane, tpos, s.dead);
        knight.x = p.x; knight.y = p.y; knight.walk += dt * 9;
        if (k >= 1) {
          if (s.end === 'trap') { flash = .45; trapFx = 1; say('Bẫy! Mất 1 mạng 💥'); }
          plan.i++; plan.t = 0;
          if (plan.i >= plan.steps.length) { // đến nút mới
            var stay = plan.stay; plan = null; knight.x = X0; knight.y = nodeY(stay ? qi : qi + 1); if (!stay) qi++; state = 'between';
            timer = setTimeout(nextQ, 650);
          } else if (s.end === 'trap') { /* nán lại một nhịp rồi quay về */ plan.t = -0.35; }
        }
      }
      if (trapFx > 0) trapFx -= dt;
      hearts.forEach(function (h) { h.t += dt; h.y -= 30 * dt; }); hearts = hearts.filter(function (h) { return h.t < 1.4; });
      draw(tt);
    });
    function draw(tt) {
      ctx.save(); ctx.translate(0, -camY);
      var top = camY - 40, bot = camY + H + 40;
      var g = ctx.createLinearGradient(0, camY, 0, camY + H); g.addColorStop(0, '#86efac'); g.addColorStop(1, '#bbf7d0'); ctx.fillStyle = g; ctx.fillRect(0, top, W2, bot - top);
      // hồ nước 2 bên
      ctx.fillStyle = 'rgba(56,189,248,.35)'; for (var b = 0; b <= N + 1; b++) { var by = nodeY(b) - 100; ctx.beginPath(); ctx.ellipse(36, by, 42, 24, 0, 0, 6.3); ctx.ellipse(W2 - 36, by + 70, 46, 24, 0, 0, 6.3); ctx.fill(); }
      treesDeco.forEach(function (t) { if (t.y < top - 60 || t.y > bot + 60) return; var nearPath = Math.abs(t.x - 130) < 40 || Math.abs(t.x - 320) < 40 || Math.abs(t.x - 510) < 40; if (nearPath) return; ctx.fillStyle = '#92400e'; ctx.fillRect(t.x - 3, t.y, 6, 18 * t.s); ctx.fillStyle = t.k ? '#15803d' : '#166534'; ctx.beginPath(); ctx.moveTo(t.x, t.y - 34 * t.s); ctx.lineTo(t.x + 18 * t.s, t.y + 4); ctx.lineTo(t.x - 18 * t.s, t.y + 4); ctx.fill(); });
      // các đoạn đường
      for (var k = 1; k <= N; k++) {
        var yTop = nodeY(k), yBot = nodeY(k - 1); if (yTop > bot || yBot < top) continue;
        for (var l = 0; l < 3; l++) pathStroke(k, l);
      }
      // nút (ngã ba)
      for (var n = 0; n <= N; n++) { var ny = nodeY(n); if (ny > bot || ny < top) continue; ctx.fillStyle = '#d6b88a'; ctx.beginPath(); ctx.ellipse(X0, ny, 44, 20, 0, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#a16207'; ctx.lineWidth = 3; ctx.stroke(); }
      // biển cửa A/B/C ở làn đang hỏi
      if (state === 'ask' || state === 'walk') {
        var kk = qi + 1; for (var ln = 0; ln < 3; ln++) { var sp = lanePoint(kk, ln, .22, false); drawSign(sp.x, sp.y, LETTERS[ln], ln === right && state === 'walk' && plan && plan.i === plan.steps.length - 1 ? '#22c55e' : '#7c3aed'); }
      }
      // bẫy ở cuối ngõ cụt (hiện khi hiệp sĩ chạm bẫy)
      if (plan && plan.steps[plan.i] && plan.steps[plan.i].dead) { var dp = lanePoint(qi + 1, plan.steps[plan.i].lane, 1, true); drawTrap(dp.x, dp.y - 6, tt, trapFx); }
      // lâu đài
      drawCastle(X0, nodeY(N) - 60, tt);
      drawKnight(knight.x, knight.y - 10, tt);
      if (rescued) drawPrincess(knight.x + 30, knight.y - 10, tt);
      hearts.forEach(function (h) { ctx.globalAlpha = 1 - h.t / 1.4; ctx.font = '22px sans-serif'; ctx.textAlign = 'center'; ctx.fillText('💖', h.x, h.y); }); ctx.globalAlpha = 1;
      ctx.restore();
      if (flash > 0) { ctx.fillStyle = 'rgba(239,68,68,' + flash * .8 + ')'; ctx.fillRect(0, 0, W2, H); }
      if (msgT > 0) { ctx.font = '800 22px "Be Vietnam Pro",sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#fff'; ctx.strokeStyle = '#7c2d12'; ctx.lineWidth = 5; ctx.strokeText(msg, W2 / 2, 60); ctx.fillText(msg, W2 / 2, 60); }
    }
    function pathStroke(k, l) {
      ctx.lineCap = 'round'; ctx.strokeStyle = '#e7c98f'; ctx.lineWidth = 26;
      ctx.beginPath(); for (var t = 0; t <= 1.001; t += .04) { var p = lanePoint(k, l, t, false); if (t === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y); } ctx.stroke();
      ctx.strokeStyle = '#c9a46a'; ctx.lineWidth = 2; ctx.setLineDash([6, 10]); ctx.beginPath(); for (t = 0; t <= 1.001; t += .04) { var q2 = lanePoint(k, l, t, false); if (t === 0) ctx.moveTo(q2.x, q2.y); else ctx.lineTo(q2.x, q2.y); } ctx.stroke(); ctx.setLineDash([]);
    }
    function drawSign(x, y, ch, col) { ctx.save(); ctx.translate(x, y); ctx.fillStyle = '#92400e'; ctx.fillRect(-3, -2, 6, 30); ctx.fillStyle = col; rr(ctx, -18, -30, 36, 32, 8); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2.5; ctx.stroke(); ctx.fillStyle = '#fff'; ctx.font = '800 20px "Be Vietnam Pro",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(ch, 0, -13); ctx.restore(); }
    function drawTrap(x, y, tt, fx) { ctx.save(); ctx.translate(x, y); ctx.font = (30 + (fx > 0 ? 10 : 0)) + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(fx > 0 ? '🔥' : '🕳️', 0, 0); ctx.restore(); }
    function drawKnight(x, y, tt) {
      ctx.save(); ctx.translate(x, y); var bob = Math.sin(knight.walk) * (state === 'walk' ? 2.5 : 0);
      ctx.fillStyle = 'rgba(0,0,0,.2)'; ctx.beginPath(); ctx.ellipse(0, 20, 14, 5, 0, 0, 6.3); ctx.fill();
      ctx.translate(0, bob); ctx.fillStyle = '#9ca3af'; rr(ctx, -10, -2, 20, 22, 6); ctx.fill(); // thân giáp
      ctx.fillStyle = '#6b7280'; ctx.fillRect(-9, 14, 7, 8); ctx.fillRect(2, 14, 7, 8);
      ctx.fillStyle = '#d1d5db'; ctx.beginPath(); ctx.arc(0, -10, 11, 0, 6.3); ctx.fill(); // mũ
      ctx.fillStyle = '#111827'; ctx.fillRect(-7, -12, 14, 5); ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.moveTo(0, -21); ctx.quadraticCurveTo(10, -30 + Math.sin(tt * 6) * 2, 16, -18); ctx.lineTo(0, -19); ctx.fill();
      ctx.fillStyle = '#2563eb'; ctx.beginPath(); ctx.arc(-14, 6, 8, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke(); // khiên
      ctx.strokeStyle = '#e5e7eb'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(14, 8); ctx.lineTo(14, -16); ctx.stroke();
      ctx.restore();
    }
    function drawPrincess(x, y, tt) {
      ctx.save(); ctx.translate(x, y + Math.sin(tt * 6) * 2);
      ctx.fillStyle = '#f472b6'; ctx.beginPath(); ctx.moveTo(-5, -2); ctx.lineTo(5, -2); ctx.lineTo(13, 22); ctx.lineTo(-13, 22); ctx.closePath(); ctx.fill();
      ctx.fillStyle = '#fcd9b6'; ctx.beginPath(); ctx.arc(0, -10, 8, 0, 6.3); ctx.fill(); ctx.fillStyle = '#92400e'; ctx.beginPath(); ctx.arc(0, -12, 8, Math.PI, 0); ctx.fill();
      ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.moveTo(-6, -18); ctx.lineTo(-3, -24); ctx.lineTo(0, -19); ctx.lineTo(3, -24); ctx.lineTo(6, -18); ctx.fill();
      ctx.restore();
    }
    function drawCastle(x, y, tt) {
      ctx.save(); ctx.translate(x, y);
      ctx.fillStyle = '#e5e7eb'; ctx.fillRect(-70, -10, 140, 70); ctx.fillStyle = '#cbd5e1'; ctx.fillRect(-100, -40, 44, 100); ctx.fillRect(56, -40, 44, 100);
      ctx.fillStyle = '#f43f5e'; [[-100, -40], [56, -40]].forEach(function (c) { ctx.beginPath(); ctx.moveTo(c[0] - 6, c[1]); ctx.lineTo(c[0] + 22, c[1] - 38); ctx.lineTo(c[0] + 50, c[1]); ctx.fill(); });
      ctx.fillStyle = '#e5e7eb'; ctx.fillRect(-26, -64, 52, 56); ctx.fillStyle = '#8b5cf6'; ctx.beginPath(); ctx.moveTo(-32, -64); ctx.lineTo(0, -108); ctx.lineTo(32, -64); ctx.fill();
      ctx.fillStyle = '#7c2d12'; rr(ctx, -16, 20, 32, 40, 14); ctx.fill(); ctx.fillStyle = '#fde68a'; ctx.fillRect(-4, -48, 8, 14);
      ctx.fillStyle = '#facc15'; ctx.beginPath(); ctx.arc(0, -112, 4, 0, 6.3); ctx.fill();
      // công chúa ở cửa sổ tháp
      if (!rescued) { var wave = Math.sin(tt * 5) * 6; ctx.fillStyle = '#f9a8d4'; ctx.beginPath(); ctx.arc(0, -42, 9, 0, 6.3); ctx.fill(); ctx.fillStyle = '#facc15'; ctx.fillRect(-7, -54, 14, 4);
        ctx.strokeStyle = '#f9a8d4'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(8, -40); ctx.lineTo(18 + wave * .3, -50); ctx.stroke(); }
      ctx.restore();
    }
    nextQ();
    return { destroy: function () { dead = true; stop(); clearTimeout(timer); ob.destroy(); C.off(); } };
  };

  /* ═════════ 3. BONG BÓNG CHỮ — gõ từ tiếng Anh cho nghĩa tiếng Việt trong bong bóng ═════════ */
  G.bubble = function (X, poolW, host, hud, done, opts) {
    var C = X.makeCanvas(host), ctx = C.ctx, W2 = C.W, H = C.H;
    var N = 14, words = X.pickWords('bubble', poolW.filter(function (w) { return w.word.length <= 14 && w.vi.length <= 30; }), N, function (list) { // tránh 2 từ cùng nghĩa trong 1 ván
      var seen = {}; return list.filter(function (w) { var k = normVi(w.vi); if (seen[k]) return false; seen[k] = 1; return true; });
    });
    N = words.length;
    var wrap = div('ax-typebox'); host.appendChild(wrap);
    wrap.innerHTML = '<input class="ax-in" id="axIn" type="text" inputmode="text" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" placeholder="Gõ từ tiếng Anh rồi nhấn Enter…" aria-label="Gõ từ tiếng Anh"><div class="ax-hint" id="axHint">Gõ đúng từ tiếng Anh của bong bóng — đánh vỡ trước khi chạm đáy. 3 bong bóng chạm đáy là thua.</div>';
    var inp = wrap.querySelector('#axIn'), hint = wrap.querySelector('#axHint');
    var GROUND = H - 42, spawned = 0, alive = [], misses = 0, score = 0, combo = 0, best = 0, results = [], dead = false, spawnT = 1.2, pops = [], waves = 0, shake = 0, floaters = [], timer = null, ended = false;
    // đáp án chấp nhận: mọi từ trong kho có cùng nghĩa tiếng Việt (đồng nghĩa)
    var all = X.allWords().filter(function (w) { return w.kind === 'word' && w.vi; });
    var accepts = {}; all.forEach(function (w) { var k = normVi(w.vi); (accepts[k] = accepts[k] || {})[norm(w.word)] = 1; });
    function setHud() { hud.textContent = '💧 ' + (3 - misses) + '/3  ⭐ ' + score + '  🫧 ' + Math.min(spawned, N) + '/' + N; }
    function spawn() {
      var w = words[spawned]; spawned++;
      var fall = Math.max(9.5, 18.5 - spawned * .5), r = 54, x = rnd(r + 8, W2 - r - 8);
      for (var tries = 0; tries < 8; tries++) { var ok = alive.every(function (b) { return b.y < 90 ? Math.abs(b.x - x) > r * 1.7 : true; }); if (ok) break; x = rnd(r + 8, W2 - r - 8); }
      alive.push({ w: w, x: x, y: -r, r: r, v: (GROUND + r) / fall, ph: Math.random() * 6, sw: rnd(.5, 1.1), hue: Math.floor(rnd(170, 290)), born: 0 });
      setHud();
    }
    function submit(raw, force) {
      var t = norm(raw); if (!t || !alive.length) return false;
      var cands = alive.filter(function (b) { var set = accepts[normVi(b.w.vi)] || {}; set[norm(b.w.word)] = 1; return set[t]; });
      if (!cands.length) return false;
      if (!force) { // nếu còn từ khác dài hơn bắt đầu bằng cụm đang gõ → chờ Enter để khỏi nổ nhầm
        var longer = alive.some(function (b) { var set = accepts[normVi(b.w.vi)] || {}; for (var k in set) if (k !== t && k.indexOf(t) === 0) return true; return false; });
        if (longer) return false;
      }
      cands.sort(function (a, b) { return b.y - a.y; }); var b = cands[0];
      alive.splice(alive.indexOf(b), 1); combo++; best = Math.max(best, combo); score += 100 + combo * 10 + Math.round(Math.max(0, 1 - b.y / GROUND) * 50);
      results.push({ id: b.w.id, ok: true, w: b.w });
      for (var i = 0; i < 16; i++) { var a = rnd(0, 6.28), sp = rnd(60, 200); pops.push({ x: b.x, y: b.y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, t: 0, life: rnd(.4, .8), c: 'hsl(' + b.hue + ',90%,75%)' }); }
      floaters.push({ x: b.x, y: b.y, t: 0, text: '✓ ' + b.w.word }); X.beep('ok'); X.speak(b.w.word);
      inp.value = ''; setHud(); checkEnd(); return true;
    }
    function checkEnd() { if (ended) return; if (misses >= 3) { ended = true; timer = setTimeout(finish, 900); } else if (spawned >= N && !alive.length) { ended = true; timer = setTimeout(finish, 700); } }
    function finish() { if (dead) return; dead = true; done(results, { score: score }); }
    inp.addEventListener('input', function () { if (inp.value.length > 1) submit(inp.value, false); });
    inp.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { e.preventDefault(); if (!submit(inp.value, true)) { inp.classList.add('bad'); X.beep('bad'); combo = 0; setTimeout(function () { inp.classList.remove('bad'); }, 350); if (inp.value) inp.select(); } }
    });
    setTimeout(function () { try { inp.focus(); } catch (e) {} }, 80);
    C.cv.addEventListener('pointerdown', function () { try { inp.focus(); } catch (e) {} });
    var stars = []; for (var s = 0; s < 40; s++) stars.push({ x: Math.random() * W2, y: Math.random() * H, r: Math.random() * 1.6 + .3 });
    var stop = X.loop(function (dt, tt) {
      if (!ended) { spawnT -= dt; if (spawned < N && spawnT <= 0 && alive.length < 5) { spawn(); spawnT = Math.max(1.7, 3.8 - spawned * .14); } }
      alive.slice().forEach(function (b) {
        if (ended && misses >= 3) return;
        b.y += b.v * dt; b.x += Math.sin(tt * b.sw + b.ph) * 14 * dt; b.x = clamp(b.x, b.r, W2 - b.r); b.born += dt;
        if (b.y + b.r * .8 >= GROUND && !ended) { // chạm đáy
          alive.splice(alive.indexOf(b), 1); misses++; combo = 0; shake = .3; X.beep('bad'); results.push({ id: b.w.id, ok: false, w: b.w });
          for (var i = 0; i < 10; i++) pops.push({ x: b.x, y: GROUND, vx: rnd(-90, 90), vy: rnd(-120, -20), t: 0, life: .6, c: 'rgba(147,197,253,.9)' });
          floaters.push({ x: b.x, y: GROUND - 20, t: 0, text: b.w.word, miss: true }); setHud(); checkEnd();
        }
      });
      pops.forEach(function (p) { p.t += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 260 * dt; }); pops = pops.filter(function (p) { return p.t < p.life; });
      floaters.forEach(function (f) { f.t += dt; f.y -= 24 * dt; }); floaters = floaters.filter(function (f) { return f.t < 1.4; });
      if (shake > 0) shake -= dt; waves += dt;
      draw(tt);
    });
    function draw(tt) {
      ctx.save(); if (shake > 0) ctx.translate((Math.random() - .5) * 7, (Math.random() - .5) * 7);
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1e1b4b'); g.addColorStop(.65, '#3730a3'); g.addColorStop(1, '#0e7490'); ctx.fillStyle = g; ctx.fillRect(-10, -10, W2 + 20, H + 20);
      stars.forEach(function (s) { ctx.fillStyle = 'rgba(255,255,255,' + (.3 + .5 * Math.abs(Math.sin(tt + s.x))) + ')'; ctx.fillRect(s.x, s.y, s.r, s.r); });
      // mặt biển (đáy)
      ctx.fillStyle = 'rgba(56,189,248,.35)'; ctx.beginPath(); ctx.moveTo(0, H); for (var x = 0; x <= W2; x += 16) ctx.lineTo(x, GROUND + 8 + Math.sin(x / 38 + waves * 2) * 4); ctx.lineTo(W2, H); ctx.fill();
      ctx.fillStyle = 'rgba(14,116,144,.75)'; ctx.fillRect(0, GROUND + 18, W2, H - GROUND - 18);
      ctx.strokeStyle = 'rgba(248,113,113,.45)'; ctx.setLineDash([8, 8]); ctx.beginPath(); ctx.moveTo(0, GROUND); ctx.lineTo(W2, GROUND); ctx.stroke(); ctx.setLineDash([]);
      alive.forEach(drawBubble);
      pops.forEach(function (p) { ctx.globalAlpha = Math.max(0, 1 - p.t / p.life); ctx.fillStyle = p.c; ctx.beginPath(); ctx.arc(p.x, p.y, 3, 0, 6.3); ctx.fill(); }); ctx.globalAlpha = 1;
      floaters.forEach(function (f) { ctx.globalAlpha = Math.max(0, 1 - f.t / 1.4); ctx.font = '800 18px "Be Vietnam Pro",sans-serif'; ctx.textAlign = 'center'; ctx.fillStyle = f.miss ? '#fca5a5' : '#86efac'; ctx.strokeStyle = 'rgba(0,0,0,.6)'; ctx.lineWidth = 4; ctx.strokeText(f.text, f.x, f.y); ctx.fillText(f.text, f.x, f.y); }); ctx.globalAlpha = 1;
      ctx.restore();
    }
    function drawBubble(b) {
      var pulse = 1 + Math.sin(b.born * 3 + b.ph) * .015;
      ctx.save(); ctx.translate(b.x, b.y); ctx.scale(pulse, 1 / pulse);
      var gr = ctx.createRadialGradient(-b.r * .35, -b.r * .4, b.r * .1, 0, 0, b.r); gr.addColorStop(0, 'rgba(255,255,255,.95)'); gr.addColorStop(.55, 'hsla(' + b.hue + ',85%,72%,.55)'); gr.addColorStop(1, 'hsla(' + b.hue + ',85%,55%,.75)');
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(0, 0, b.r, 0, 6.3); ctx.fill(); ctx.strokeStyle = 'rgba(255,255,255,.85)'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.beginPath(); ctx.ellipse(-b.r * .38, -b.r * .45, b.r * .16, b.r * .09, -.6, 0, 6.3); ctx.fill();
      // chữ tiếng Việt, tự xuống dòng & thu nhỏ cho vừa
      var fs = 19, lines; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      for (; fs >= 10; fs--) { ctx.font = '800 ' + fs + 'px "Be Vietnam Pro",sans-serif'; lines = wrapLines(b.w.vi, b.r * 1.55); if (lines.length <= 3 && lines.every(function (l) { return ctx.measureText(l).width <= b.r * 1.62; })) break; }
      ctx.fillStyle = '#0b1020'; var lh = fs * 1.15; lines.forEach(function (ln, i) { ctx.fillText(ln, 0, (i - (lines.length - 1) / 2) * lh); });
      ctx.restore();
    }
    function wrapLines(text, maxW) {
      var words2 = String(text).split(/\s+/), lines = [], cur = '';
      words2.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (ctx.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; });
      if (cur) lines.push(cur); return lines;
    }
    setHud(); host._dbg = { alive: function () { return alive; } }; // móc kiểm thử (không ảnh hưởng người dùng)
    return { destroy: function () { dead = true; stop(); clearTimeout(timer); C.off(); } };
  };

  /* ═════════ 4. THỦ MÔN BẮT BÓNG — chọn từ đúng điền vào chỗ trống để cản phá cú sút ═════════ */
  G.keeper = function (X, poolW, host, hud, done, opts) {
    var C = X.makeCanvas(host), ctx = C.ctx, W2 = C.W, H = C.H;
    var promptEl = div('ar-prompt'); host.insertBefore(promptEl, C.cv);
    var tb = timerBar(host), ob = optionsBar(host);
    var N = 10, gapPool = poolW.filter(gapable), words = X.pickWords('keeper', gapPool, N, null), qi = 0, conceded = 0, score = 0, combo = 0, best = 0, results = [], dead = false, timer = null;
    var GX = [W2 * .27, W2 * .5, W2 * .73], GOAL = { x: 130, y: 70, w: 380, h: 170 }, BALL0 = { x: W2 / 2, y: 410 };
    var keeper = { x: W2 / 2, y: GOAL.y + GOAL.h - 28, dive: 0, dir: 0, t: 0, catchT: 0 }, ball = { x: BALL0.x, y: BALL0.y, z: 0, t: 0, fly: false, to: null, saved: false }, q = null, state = 'idle', qT = 0, qMax = 20, shot = 1, msg = '', msgT = 0, net = 0, flash = 0;
    var crowd = []; for (var i = 0; i < 90; i++) crowd.push({ x: Math.random() * W2, y: 10 + Math.random() * 46, c: ['#f87171', '#fbbf24', '#60a5fa', '#a78bfa', '#34d399', '#f472b6'][i % 6], ph: Math.random() * 6 });
    function setHud() { hud.textContent = '🥅 ' + (3 - conceded) + '/3  ⭐ ' + score + '  ⚽ ' + Math.min(qi + 1, N) + '/' + N; }
    function nextQ() {
      if (dead) return;
      if (qi >= N || conceded >= 3) return finish();
      var w = words[qi], tries = 0; q = null;
      while (!q && tries < 6) { q = makeGap(X, w, poolW, 3); if (!q) { w = X.pickWords('keeper', gapPool, 1, null)[0]; tries++; } }
      if (!q) { results.push({ id: w.id, ok: false, w: w }); qi++; return nextQ(); }
      shot = Math.floor(Math.random() * 3); ball = { x: BALL0.x, y: BALL0.y, z: 0, t: 0, fly: false, to: null, saved: false }; keeper.x = W2 / 2; keeper.dive = 0; keeper.catchT = 0;
      promptEl.innerHTML = promptHtml(X, q); ob.show(q, onAnswer); qT = 0; state = 'ask'; setHud();
    }
    function kick(saveIt) { // cầu thủ sút về làn "shot"; thủ môn bay theo (cản được) hoặc bay sai hướng
      state = 'shoot'; ball.fly = true; ball.t = 0; ball.to = { x: GX[shot], y: GOAL.y + GOAL.h * (.45 + Math.random() * .25) }; ball.saved = saveIt;
      keeper.dir = saveIt ? shot : (shot === 1 ? (Math.random() < .5 ? 0 : 2) : (Math.random() < .5 ? 1 : (shot === 0 ? 2 : 0)));
      keeper.t = 0; keeper.dive = 1;
    }
    function onAnswer(i) {
      if (state !== 'ask') return; var ok = q.opts[i].ok; ob.mark(i); results.push({ id: q.w.id, ok: ok, w: q.w });
      if (ok) { combo++; best = Math.max(best, combo); score += 100 + combo * 10 + Math.round(Math.max(0, 1 - qT / qMax) * 50); X.speak(q.w.word); } else { combo = 0; conceded++; }
      kick(ok); setHud();
    }
    function timeout() { if (state !== 'ask') return; ob.mark(-1); results.push({ id: q.w.id, ok: false, w: q.w }); combo = 0; conceded++; kick(false); setHud(); }
    function finish() { if (dead) return; dead = true; ob.clear(); done(results, { score: score }); }
    var stop = X.loop(function (dt, tt) {
      if (state === 'ask') { qT += dt; tb.set(1 - qT / qMax); if (qT >= qMax) timeout(); } else tb.set(0);
      if (msgT > 0) msgT -= dt; if (flash > 0) flash -= dt; if (net > 0) net -= dt;
      if (ball.fly) {
        ball.t += dt / .7; var k = Math.min(1, ball.t), e = k; ball.x = lerp(BALL0.x, ball.to.x, e); ball.y = lerp(BALL0.y, ball.to.y, e) - Math.sin(k * Math.PI) * 40; ball.z = k;
        if (k >= 1) { ball.fly = false; state = 'result';
          if (ball.saved) { msg = 'CẢN PHÁ! 🧤'; X.beep('ok'); } else { msg = 'VÀO! ⚽'; net = .7; flash = .3; X.beep('bad'); }
          msgT = 1.3; timer = setTimeout(function () { qi++; nextQ(); }, 1400); }
      }
      if (keeper.dive) { keeper.t += dt; var kk = Math.min(1, keeper.t / .45); keeper.x = lerp(W2 / 2, GX[keeper.dir], ease(kk)); }
      draw(tt);
    });
    function draw(tt) {
      var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#1e3a8a'); g.addColorStop(.3, '#14532d'); g.addColorStop(1, '#166534'); ctx.fillStyle = g; ctx.fillRect(0, 0, W2, H);
      crowd.forEach(function (c) { ctx.fillStyle = c.c; ctx.fillRect(c.x, c.y + Math.sin(tt * 4 + c.ph) * (msgT > 0 && ball.saved ? 4 : 1), 6, 8); });
      ctx.fillStyle = 'rgba(0,0,0,.18)'; ctx.fillRect(0, 62, W2, 8);
      for (var s = 0; s < 8; s++) { ctx.fillStyle = s % 2 ? 'rgba(255,255,255,.04)' : 'rgba(0,0,0,.05)'; ctx.fillRect(0, 70 + s * 50, W2, 50); }
      ctx.strokeStyle = 'rgba(255,255,255,.7)'; ctx.lineWidth = 3; ctx.strokeRect(GOAL.x - 40, GOAL.y + GOAL.h - 8, GOAL.w + 80, 190);
      ctx.beginPath(); ctx.arc(W2 / 2, 410, 4, 0, 6.3); ctx.fillStyle = '#fff'; ctx.fill();
      // lưới
      ctx.fillStyle = 'rgba(255,255,255,.08)'; ctx.fillRect(GOAL.x, GOAL.y, GOAL.w, GOAL.h);
      ctx.strokeStyle = 'rgba(255,255,255,' + (net > 0 ? .55 : .22) + ')'; ctx.lineWidth = 1; for (var gx = GOAL.x; gx <= GOAL.x + GOAL.w; gx += 20) { ctx.beginPath(); ctx.moveTo(gx + (net > 0 ? Math.sin(tt * 30) * 2 : 0), GOAL.y); ctx.lineTo(gx, GOAL.y + GOAL.h); ctx.stroke(); } for (var gy = GOAL.y; gy <= GOAL.y + GOAL.h; gy += 20) { ctx.beginPath(); ctx.moveTo(GOAL.x, gy); ctx.lineTo(GOAL.x + GOAL.w, gy); ctx.stroke(); }
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 7; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(GOAL.x, GOAL.y + GOAL.h); ctx.lineTo(GOAL.x, GOAL.y); ctx.lineTo(GOAL.x + GOAL.w, GOAL.y); ctx.lineTo(GOAL.x + GOAL.w, GOAL.y + GOAL.h); ctx.stroke();
      // hướng sút gợi ý (mũi tên mờ) khi chờ
      drawKeeper(tt); drawBall(tt);
      if (flash > 0) { ctx.fillStyle = 'rgba(239,68,68,' + flash * .5 + ')'; ctx.fillRect(0, 0, W2, H); }
      if (msgT > 0) { ctx.font = '800 38px "Be Vietnam Pro",sans-serif'; ctx.textAlign = 'center'; ctx.lineWidth = 7; ctx.strokeStyle = '#052e16'; ctx.fillStyle = ball.saved ? '#bbf7d0' : '#fecaca'; ctx.strokeText(msg, W2 / 2, 300); ctx.fillText(msg, W2 / 2, 300); }
    }
    function drawKeeper(tt) {
      var kx = keeper.x, ky = keeper.y, dive = keeper.dive ? ease(Math.min(1, keeper.t / .45)) : 0, dirx = keeper.dir === 0 ? -1 : keeper.dir === 2 ? 1 : 0;
      ctx.save(); ctx.translate(kx, ky); ctx.rotate(dirx * dive * 1.1); var idle = keeper.dive ? 0 : Math.sin(tt * 4) * 2;
      ctx.fillStyle = 'rgba(0,0,0,.25)'; ctx.beginPath(); ctx.ellipse(0, 30, 22, 6, 0, 0, 6.3); ctx.fill();
      ctx.fillStyle = '#facc15'; rr(ctx, -13, -20, 26, 36, 8); ctx.fill(); // áo
      ctx.fillStyle = '#1e293b'; ctx.fillRect(-12, 14, 10, 18); ctx.fillRect(2, 14, 10, 18); // quần
      ctx.fillStyle = '#fcd9b6'; ctx.beginPath(); ctx.arc(0, -30, 10, 0, 6.3); ctx.fill(); ctx.fillStyle = '#7c2d12'; ctx.beginPath(); ctx.arc(0, -34, 10, Math.PI, 0); ctx.fill(); // đầu
      var armUp = keeper.dive ? -1.2 : -0.5 + idle * .05; ctx.strokeStyle = '#facc15'; ctx.lineWidth = 7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(-12, -14); ctx.lineTo(-26, -14 + armUp * -22 + 8); ctx.stroke(); ctx.beginPath(); ctx.moveTo(12, -14); ctx.lineTo(26, -14 + armUp * -22 + 8); ctx.stroke();
      ctx.fillStyle = '#22c55e'; ctx.beginPath(); ctx.arc(-26, -14 + armUp * -22 + 8, 7, 0, 6.3); ctx.arc(26, -14 + armUp * -22 + 8, 7, 0, 6.3); ctx.fill(); // găng
      ctx.restore();
    }
    function drawBall(tt) {
      var sc = 1 - ball.z * .45, bx = ball.x, by = ball.y;
      if (ball.saved && !ball.fly && state === 'result') { bx = lerp(ball.to.x, keeper.x, .6); by = lerp(ball.to.y, keeper.y - 10, .6); }
      ctx.save(); ctx.translate(bx, by); ctx.rotate(tt * 8 * (ball.fly ? 1 : 0)); ctx.scale(sc, sc);
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(0, 0, 15, 0, 6.3); ctx.fill(); ctx.strokeStyle = '#111827'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = '#111827'; ctx.beginPath(); for (var i = 0; i < 5; i++) { var a = i / 5 * 6.283 - 1.57; ctx.lineTo(Math.cos(a) * 6, Math.sin(a) * 6); } ctx.fill();
      ctx.restore();
    }
    nextQ();
    return { destroy: function () { dead = true; stop(); clearTimeout(timer); ob.destroy(); C.off(); } };
  };
  G.gapable = gapable; G._mk = { makeMcq: makeMcq, makeGap: makeGap };
})();
