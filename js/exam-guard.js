/* Chế độ thi (chống gian lận) — dùng cho bài được giao có bật "chế độ thi".
   Trình duyệt KHÔNG cho trang web chặn tuyệt đối việc đổi tab hay đóng cửa sổ, nên thư viện này:
   • phát hiện + ghi nhận ở máy chủ mỗi lần rời trang (đổi tab, Alt-Tab, thu nhỏ cửa sổ, tải lại / đóng rồi mở lại trang)
   • cảnh báo to, rõ ngay khi học sinh quay lại; quá số lần cho phép thì TỰ ĐỘNG NỘP BÀI
   • chặn dán / sao chép / cắt / chuột phải / bôi đen / in / lưu / xem mã nguồn, hỏi lại trước khi đóng hoặc tải lại trang
   Dùng: EWTGuard.start({ exerciseId, maxLeaves, onForce: function () { …nộp bài… } }); nộp xong thì EWTGuard.stop(). */
(function () {
  'use strict';
  var S = null;
  var CSS = '' +
    '.ewtg-on, .ewtg-on *:not(input):not(textarea):not([contenteditable="true"]):not([contenteditable=""]) { -webkit-user-select: none !important; user-select: none !important; -webkit-touch-callout: none; }' +
    '.ewtg-on input, .ewtg-on textarea, .ewtg-on [contenteditable] { -webkit-user-select: text !important; user-select: text !important; }' +
    '#ewtgBar { position: fixed; top: 0; left: 0; right: 0; z-index: 9000; display: flex; gap: 10px; align-items: center; justify-content: center; flex-wrap: wrap; padding: 6px 12px; font: 700 13px/1.3 inherit; font-family: inherit; color: #fff; background: linear-gradient(90deg, #4f46e5, #7B6EF6); box-shadow: 0 2px 10px rgba(0,0,0,.2); }' +
    '#ewtgBar.warn { background: linear-gradient(90deg, #d97706, #f59e0b); } #ewtgBar.bad { background: linear-gradient(90deg, #b91c1c, #ef4444); }' +
    '#ewtgBar i { font-style: normal; background: rgba(255,255,255,.22); border-radius: 99px; padding: 1px 10px; }' +
    '.ewtg-ov { position: fixed; inset: 0; z-index: 9999; display: grid; place-items: center; padding: 16px; background: var(--bg, #f7f6fd); }' +
    '.ewtg-ov.dim { background: rgba(15,23,42,.88); }' +
    '.ewtg-card { max-width: 520px; width: 100%; background: var(--surface, #fff); color: var(--text, #2E2B45); border-radius: 20px; padding: 24px 26px; box-shadow: 0 20px 60px rgba(0,0,0,.35); text-align: center; animation: ewtgIn .35s cubic-bezier(.2,.9,.3,1.2) both; }' +
    '.ewtg-card h3 { margin: 6px 0 10px; font-size: 20px; } .ewtg-card p { margin: 0 0 10px; font-size: 14.5px; line-height: 1.65; color: var(--text-muted, #6B6880); } .ewtg-card ul { text-align: left; margin: 10px auto 14px; padding-left: 20px; font-size: 14px; line-height: 1.8; max-width: 440px; }' +
    '.ewtg-ico { font-size: 44px; line-height: 1; } .ewtg-btn { margin-top: 8px; border: none; border-radius: 12px; padding: 12px 26px; font: 700 15px inherit; font-family: inherit; color: #fff; cursor: pointer; background: var(--gradient, linear-gradient(135deg, #7B6EF6, #6FA8F5)); }' +
    '.ewtg-big { font-size: 34px; font-weight: 800; color: #dc2626; margin: 4px 0; }' +
    '#ewtgToast { position: fixed; left: 50%; bottom: 26px; transform: translateX(-50%); z-index: 9998; background: #111827; color: #fff; padding: 10px 18px; border-radius: 12px; font-size: 14px; max-width: 92vw; opacity: 0; transition: opacity .2s; pointer-events: none; } #ewtgToast.on { opacity: 1; }' +
    '@keyframes ewtgIn { from { opacity: 0; transform: translateY(20px) scale(.94); } to { opacity: 1; transform: none; } }' +
    '@media print { body { display: none !important; } }';

  function el(tag, attrs, html) { var e = document.createElement(tag); if (attrs) for (var k in attrs) e.setAttribute(k, attrs[k]); if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function api(url, method, body) {
    return fetch(url, { method: method || 'GET', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined }).then(function (r) { return r.json(); });
  }
  function toast(t) { var x = document.getElementById('ewtgToast'); if (!x) { x = el('div', { id: 'ewtgToast' }); document.body.appendChild(x); } x.textContent = t; x.classList.add('on'); clearTimeout(x._t); x._t = setTimeout(function () { x.classList.remove('on'); }, 2600); }
  function mark(key, on) { try { if (on) localStorage.setItem(key, String(Date.now())); else localStorage.removeItem(key); } catch (e) {} }
  function hasMark(key) { try { return !!localStorage.getItem(key); } catch (e) { return false; } }

  function bar() {
    var b = document.getElementById('ewtgBar'); if (!b) { b = el('div', { id: 'ewtgBar' }); document.body.appendChild(b); document.body.style.paddingTop = '34px'; }
    var left = Math.max(0, S.max - S.leaves);
    b.className = S.leaves >= S.max ? 'bad' : S.leaves > 0 ? 'warn' : '';
    b.innerHTML = '🔒 Chế độ thi — không chuyển tab, không thoát trang <i>Đã rời trang: ' + S.leaves + '/' + S.max + '</i>' + (S.leaves > 0 && left > 0 ? ' <i>Còn ' + left + ' lần</i>' : '');
  }
  function overlay(html, dim) { closeOv(); var o = el('div', { class: 'ewtg-ov' + (dim ? ' dim' : ''), id: 'ewtgOv' }, '<div class="ewtg-card">' + html + '</div>'); document.body.appendChild(o); S.ov = o; return o; }
  function closeOv() { var o = document.getElementById('ewtgOv'); if (o) o.remove(); if (S) S.ov = null; }

  function report(type) {
    if (!S || S.done) return Promise.resolve();
    return api('/api/exam-guard/event', 'POST', { exercise_id: S.id, type: type }).then(function (d) {
      if (!S || !d || !d.strict) return d;
      S.leaves = d.leaves; S.max = d.max || S.max; bar(); return d;
    }).catch(function () {});
  }
  function force() {
    if (!S || S.done) return; S.done = true; var cb = S.onForce;
    overlay('<div class="ewtg-ico">⏱️</div><h3>Bài đang được tự động nộp</h3><p>Bạn đã rời khỏi trang làm bài quá số lần cho phép (' + S.max + ' lần). Hệ thống đang nộp phần bài bạn đã làm. Giáo viên sẽ nhìn thấy ghi nhận này.</p>', true);
    detach();
    setTimeout(function () { try { if (cb) cb('leave'); } catch (e) {} }, 400);
  }
  function onLeave(type) {
    if (!S || S.done || S.intro) return;
    report(type).then(function (d) {
      if (!S || S.done) return;
      if (d && d.force) { force(); return; }
      var left = Math.max(0, S.max - S.leaves);
      overlay('<div class="ewtg-ico">⚠️</div><h3>Bạn vừa rời khỏi trang làm bài</h3><div class="ewtg-big">' + S.leaves + ' / ' + S.max + '</div><p>Việc rời trang đã được <b>ghi nhận và gửi cho giáo viên</b>. Bạn chỉ còn <b>' + left + ' lần</b> nữa — khi hết lượt, bài sẽ <b>tự động nộp</b>.</p><button class="ewtg-btn" id="ewtgOk">Tôi hiểu, tiếp tục làm bài</button>', true);
      var ok = document.getElementById('ewtgOk'); if (ok) ok.onclick = closeOv;
    });
  }

  var H = {};
  function attach() {
    H.vis = function () { if (document.visibilityState === 'hidden') onLeave('tab'); };
    H.blur = function () { setTimeout(function () { if (S && !S.done && !S.intro && !document.hasFocus() && document.visibilityState === 'visible' && !S.ov) onLeave('blur'); }, 500); };
    H.unload = function (e) { if (S && !S.done) { e.preventDefault(); e.returnValue = ''; return ''; } };
    var last = 0;
    H.block = function (e) {
      if (!S || S.done || S.intro) return;
      var t = e.target, editable = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
      if (e.type === 'selectstart' && editable) return;
      e.preventDefault();
      if ((e.type === 'paste' || e.type === 'copy' || e.type === 'cut' || e.type === 'drop') && Date.now() - last > 3000) {
        last = Date.now(); toast('🔒 Chế độ thi: không được dán / sao chép nội dung.'); report(e.type === 'paste' || e.type === 'drop' ? 'paste' : 'copy');
      }
    };
    H.key = function (e) {
      if (!S || S.done || S.intro) return;
      var k = String(e.key || '').toLowerCase();
      if ((e.ctrlKey || e.metaKey) && ['c', 'v', 'x', 'p', 's', 'u', 'a'].indexOf(k) >= 0) {
        var t = e.target, editable = t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable);
        if (editable && (k === 'a' || k === 'x' || k === 'c')) return; // cho phép chọn / cắt / chép ngay trong ô đang gõ bài của mình
        e.preventDefault(); if (k === 'v') { toast('🔒 Chế độ thi: không được dán nội dung.'); report('paste'); }
      }
      if (k === 'f12' || ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].indexOf(k) >= 0)) { e.preventDefault(); report('key'); }
      if (k === 'printscreen') { try { navigator.clipboard.writeText(''); } catch (x) {} report('key'); }
    };
    document.addEventListener('visibilitychange', H.vis); window.addEventListener('blur', H.blur); window.addEventListener('beforeunload', H.unload);
    ['contextmenu', 'copy', 'cut', 'paste', 'selectstart', 'dragstart', 'drop'].forEach(function (ev) { document.addEventListener(ev, H.block, true); });
    document.addEventListener('keydown', H.key, true);
    document.documentElement.classList.add('ewtg-on');
  }
  function detach() {
    document.removeEventListener('visibilitychange', H.vis); window.removeEventListener('blur', H.blur); window.removeEventListener('beforeunload', H.unload);
    ['contextmenu', 'copy', 'cut', 'paste', 'selectstart', 'dragstart', 'drop'].forEach(function (ev) { document.removeEventListener(ev, H.block, true); });
    document.removeEventListener('keydown', H.key, true); document.documentElement.classList.remove('ewtg-on');
  }

  window.EWTGuard = {
    active: function () { return !!S && !S.done; },
    start: function (o) {
      if (S || !o || !o.exerciseId) return;
      var st = document.createElement('style'); st.id = 'ewtgCss'; st.textContent = CSS; document.head.appendChild(st);
      S = { id: o.exerciseId, max: o.maxLeaves || 3, leaves: 0, done: false, intro: true, onForce: o.onForce, key: 'ewtg:' + o.exerciseId, ov: null };
      // che nội dung đề cho tới khi học sinh đọc quy định và bấm bắt đầu
      overlay('<div class="ewtg-ico">🔒</div><h3>Bài làm ở chế độ thi</h3><p>Giáo viên đã bật chế độ chống gian lận cho bài này. Vui lòng đọc kỹ:</p><ul>' +
        '<li><b>Không chuyển tab</b>, không mở cửa sổ khác, không thu nhỏ trình duyệt.</li>' +
        '<li>Mỗi lần rời trang được <b>ghi nhận và báo cho giáo viên</b>. Rời quá <b>' + S.max + ' lần</b> thì bài <b>tự động nộp</b>.</li>' +
        '<li>Tải lại hoặc đóng rồi mở lại trang cũng tính là rời trang.</li>' +
        '<li>Không thể dán / sao chép nội dung trong lúc làm bài.</li></ul><p id="ewtgInfo" style="font-size:13px"></p><button class="ewtg-btn" id="ewtgGo" disabled>Đang kiểm tra…</button>');
      var go = document.getElementById('ewtgGo');
      api('/api/exam-guard/status?exercise_id=' + encodeURIComponent(o.exerciseId)).then(function (d) {
        if (!S) return;
        if (!d || !d.strict) { // không còn ở chế độ thi (giáo viên đã tắt) → gỡ
          closeOv(); window.EWTGuard.stop(); return;
        }
        S.leaves = d.leaves; S.max = d.max || S.max;
        var pre = Promise.resolve(d);
        if (hasMark(S.key)) { S.intro = false; pre = report('reopen'); S.intro = true; } // lần trước đóng/tải lại trang giữa chừng
        return pre.then(function (d2) {
          d2 = d2 || d; if (!S) return; S.leaves = d2.leaves != null ? d2.leaves : S.leaves; mark(S.key, true);
          var info = document.getElementById('ewtgInfo'); if (info && S.leaves > 0) info.innerHTML = '⚠️ Bạn đã rời trang <b>' + S.leaves + '/' + S.max + '</b> lần trong bài này.';
          if (S.leaves >= S.max) { S.intro = false; force(); return; }
          go.disabled = false; go.textContent = 'Tôi đã hiểu — Bắt đầu làm bài';
          go.onclick = function () { S.intro = false; closeOv(); attach(); bar(); };
        });
      }).catch(function () { go.disabled = false; go.textContent = 'Bắt đầu làm bài'; go.onclick = function () { S.intro = false; closeOv(); attach(); bar(); }; });
    },
    stop: function () {
      if (!S) return; mark(S.key, false); detach(); S.done = true; closeOv();
      var b = document.getElementById('ewtgBar'); if (b) { b.remove(); document.body.style.paddingTop = ''; }
      var c = document.getElementById('ewtgCss'); if (c) c.remove(); S = null;
    }
  };
})();
