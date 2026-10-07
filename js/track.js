/* Gửi tín hiệu lượt xem trang (ẩn danh bằng mã ngẫu nhiên của trình duyệt) để quản trị xem thống kê truy cập. Không chặn trang, lỗi thì bỏ qua. */
(function () {
  try {
    var vid = null;
    try { vid = localStorage.getItem('ewt_vid'); } catch (e) {}
    if (!vid || !/^[a-z0-9]{8,32}$/.test(vid)) {
      vid = ''; var c = 'abcdefghijklmnopqrstuvwxyz0123456789';
      try { var a = new Uint8Array(16); crypto.getRandomValues(a); for (var i = 0; i < 16; i++) vid += c[a[i] % 36]; } catch (e) { for (var j = 0; j < 16; j++) vid += c[Math.floor(Math.random() * 36)]; }
      try { localStorage.setItem('ewt_vid', vid); } catch (e) {}
    }
    var ref = ''; try { if (document.referrer) { var u = new URL(document.referrer); if (u.host !== location.host) ref = u.host; } } catch (e) {}
    var send = function () {
      try {
        fetch('/api/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', keepalive: true,
          body: JSON.stringify({ p: location.pathname, v: vid, t: document.title, r: ref }) }).catch(function () {});
      } catch (e) {}
    };
    if (document.visibilityState === 'prerender') document.addEventListener('visibilitychange', send, { once: true }); else send();
  } catch (e) {}
})();
