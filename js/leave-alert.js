/* Cảnh báo rời trang khi làm BÀI ĐƯỢC GIAO / quiz của lớp (kể cả khi giáo viên KHÔNG bật chế độ thi).
   Khi học sinh chuyển tab, thu nhỏ cửa sổ, chuyển sang ứng dụng khác hoặc thoát app, lúc quay lại sẽ hiện thông báo to, rõ:
   “bạn vừa chuyển tab” / “bạn vừa thoát ứng dụng” / “bạn vừa chuyển sang cửa sổ khác” + số giây vắng mặt + số lần.
   Dùng: EWTLeaveAlert.start({ exerciseId, onLeave: function (kind, info) {} }); xong bài thì EWTLeaveAlert.stop().
   EWTLeaveAlert.describe(kind, ms) trả { icon, title, what } để các trang khác dùng chung lời lẽ. */
(function (root) {
  'use strict';
  var S = null, MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') || (navigator.maxTouchPoints > 1 && /Mac/.test(navigator.platform || ''));
  var CSS = '#ewtlaOv{position:fixed;inset:0;z-index:9500;display:grid;place-items:center;padding:16px;background:rgba(15,23,42,.82)}#ewtlaOv .c{max-width:480px;width:100%;background:#fff;color:#2E2B45;border-radius:20px;padding:24px 26px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.4);animation:ewtlaIn .3s cubic-bezier(.2,.9,.3,1.2)}#ewtlaOv .i{font-size:46px;line-height:1}#ewtlaOv h3{margin:8px 0 6px;font-size:20px}#ewtlaOv p{margin:0 0 8px;font-size:14.5px;line-height:1.65;color:#5b5873}#ewtlaOv .n{display:inline-block;margin:4px 0 8px;padding:4px 16px;border-radius:99px;background:#fee2e2;color:#b91c1c;font-weight:800;font-size:15px}#ewtlaOv button{margin-top:8px;border:0;border-radius:12px;padding:12px 26px;font:700 15px inherit;font-family:inherit;color:#fff;cursor:pointer;background:linear-gradient(135deg,#f59e0b,#ef4444)}@keyframes ewtlaIn{from{opacity:0;transform:translateY(20px) scale(.94)}to{opacity:1;transform:none}}';
  function describe(kind, ms) {
    var sec = Math.max(1, Math.round((ms || 0) / 1000)), dur = sec >= 60 ? Math.floor(sec / 60) + ' phút ' + (sec % 60) + ' giây' : sec + ' giây';
    if (kind === 'reopen') return { icon: '🔄', title: 'Bạn vừa đóng rồi mở lại trang làm bài', what: 'đóng hoặc tải lại trang', dur: dur };
    if (kind === 'blur') return { icon: '🪟', title: 'Bạn vừa chuyển sang cửa sổ hoặc ứng dụng khác', what: 'chuyển sang cửa sổ / ứng dụng khác', dur: dur };
    return MOBILE ? { icon: '📱', title: 'Bạn vừa thoát khỏi ứng dụng (hoặc chuyển sang ứng dụng khác)', what: 'thoát / chuyển ứng dụng', dur: dur } : { icon: '🔀', title: 'Bạn vừa chuyển sang tab khác (hoặc thu nhỏ cửa sổ)', what: 'chuyển tab / thu nhỏ cửa sổ', dur: dur };
  }
  function show(kind, ms, count) {
    var d = describe(kind, ms), old = document.getElementById('ewtlaOv'); if (old) old.remove();
    var o = document.createElement('div'); o.id = 'ewtlaOv'; o.innerHTML = '<div class="c"><div class="i">' + d.icon + '</div><h3>' + d.title + '</h3><p>Bạn đã rời khỏi trang làm bài khoảng <b>' + d.dur + '</b>.</p><div class="n">Lần rời trang thứ ' + count + '</div><p>Việc này <b>được ghi nhận và giáo viên có thể thấy</b>. Hãy ở lại trang này cho đến khi nộp bài nhé!</p><button type="button" id="ewtlaOk">Tôi đã hiểu — tiếp tục làm bài</button></div>';
    document.body.appendChild(o); document.getElementById('ewtlaOk').onclick = function () { o.remove(); };
  }
  function post(type) { if (!S || !S.id) return; try { fetch('/api/exam-guard/event', { method: 'POST', credentials: 'same-origin', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ exercise_id: S.id, type: type }), keepalive: true }); } catch (e) {} }
  function away(kind) { if (!S || S.t0) return; S.t0 = Date.now(); S.kind = kind; S.title = document.title; if (kind === 'tab') document.title = '⚠️ Quay lại làm bài!'; post(kind); }
  function back() {
    if (!S || !S.t0) return; if (document.visibilityState !== 'visible') return;
    var ms = Date.now() - S.t0, kind = S.kind; S.t0 = 0; try { document.title = S.title; } catch (e) {} if (ms < 800) return;   // thoáng qua (bấm nhầm) thì bỏ qua
    S.count++; show(kind, ms, S.count); if (S.onLeave) { try { S.onLeave(kind, { count: S.count, ms: ms }); } catch (e) {} }
  }
  var H = { vis: function () { if (document.visibilityState === 'hidden') away('tab'); else setTimeout(back, 80); }, blur: function () { setTimeout(function () { if (S && !S.t0 && !document.hasFocus() && document.visibilityState === 'visible') away('blur'); }, 450); }, focus: function () { setTimeout(back, 120); }, hide: function () { away('tab'); } };
  function start(o) {
    stop(); o = o || {}; if (!document.getElementById('ewtlaCss')) { var st = document.createElement('style'); st.id = 'ewtlaCss'; st.textContent = CSS; document.head.appendChild(st); }
    S = { id: o.exerciseId || 0, onLeave: o.onLeave, count: 0, t0: 0, kind: 'tab', title: document.title };
    document.addEventListener('visibilitychange', H.vis); window.addEventListener('blur', H.blur); window.addEventListener('focus', H.focus); window.addEventListener('pagehide', H.hide);
  }
  function stop() { if (!S) return; document.removeEventListener('visibilitychange', H.vis); window.removeEventListener('blur', H.blur); window.removeEventListener('focus', H.focus); window.removeEventListener('pagehide', H.hide); var o = document.getElementById('ewtlaOv'); if (o) o.remove(); S = null; }
  root.EWTLeaveAlert = { start: start, stop: stop, describe: describe, mobile: MOBILE };
})(typeof window !== 'undefined' ? window : this);
