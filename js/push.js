// Push Notification helper — English With Tom
(function() {
  'use strict';

  function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
    var rawData = atob(base64);
    var outputArray = new Uint8Array(rawData.length);
    for (var i = 0; i < rawData.length; i++) outputArray[i] = rawData.charCodeAt(i);
    return outputArray;
  }

  async function registerSW() {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return null;
    try {
      return await navigator.serviceWorker.register('/sw.js');
    } catch(e) { return null; }
  }

  async function subscribePush() {
    var reg = await registerSW();
    if (!reg) return false;

    // Lấy VAPID key từ server
    var resp = await fetch('/api/push/vapid-public-key', { credentials: 'same-origin' });
    if (!resp.ok) return false;
    var { key } = await resp.json();

    try {
      var sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(key)
      });
      // Gửi subscription lên server
      await fetch('/api/push/subscribe', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sub.toJSON())
      });
      localStorage.setItem('pushSubscribed', '1');
      return true;
    } catch(e) { return false; }
  }

  async function unsubscribePush() {
    var reg = await registerSW();
    if (!reg) return;
    var sub = await reg.pushManager.getSubscription();
    if (sub) {
      await fetch('/api/push/unsubscribe', {
        method: 'POST', credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: sub.endpoint })
      });
      await sub.unsubscribe();
    }
    localStorage.removeItem('pushSubscribed');
  }

  async function initPushBanner() {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;
    if (Notification.permission === 'granted' && localStorage.getItem('pushSubscribed')) return;
    if (Notification.permission === 'denied') return;
    if (localStorage.getItem('pushDismissed')) return;

    // Tạo banner gợi ý bật thông báo
    var banner = document.createElement('div');
    banner.id = 'push-banner';
    banner.innerHTML =
      '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">' +
        '<span style="font-size:20px;">🔔</span>' +
        '<span style="flex:1;font-size:14px;">Bật thông báo để nhận ngay khi có bài mới hoặc kết quả chấm điểm.</span>' +
        '<button id="push-allow-btn" style="background:#6F58EE;color:#fff;border:none;border-radius:8px;padding:8px 18px;font-size:13px;font-weight:700;cursor:pointer;">Bật thông báo</button>' +
        '<button id="push-dismiss-btn" style="background:transparent;border:1px solid #c7d2fe;border-radius:8px;padding:7px 14px;font-size:13px;cursor:pointer;color:#6366f1;">Để sau</button>' +
      '</div>';
    banner.style.cssText = 'position:fixed;bottom:20px;left:50%;transform:translateX(-50%);background:#fff;border:1.5px solid #c7d2fe;border-radius:14px;padding:14px 20px;box-shadow:0 8px 32px rgba(0,0,0,.15);z-index:9999;max-width:520px;width:calc(100% - 32px);';
    document.body.appendChild(banner);

    document.getElementById('push-allow-btn').addEventListener('click', async function() {
      var perm = await Notification.requestPermission();
      if (perm === 'granted') {
        var ok = await subscribePush();
        banner.remove();
        if (ok) showToast('✅ Đã bật thông báo!');
      } else {
        banner.remove();
        localStorage.setItem('pushDismissed', '1');
      }
    });
    document.getElementById('push-dismiss-btn').addEventListener('click', function() {
      banner.remove();
      localStorage.setItem('pushDismissed', '1');
    });
  }

  function showToast(msg) {
    var t = document.createElement('div');
    t.textContent = msg;
    t.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#1e1b4b;color:#fff;padding:10px 22px;border-radius:10px;font-size:14px;z-index:99999;pointer-events:none;';
    document.body.appendChild(t);
    setTimeout(function(){ t.remove(); }, 3000);
  }

  // Auto-subscribe nếu permission đã được cấp nhưng chưa subscribe
  async function autoResubscribe() {
    if (Notification.permission === 'granted' && !localStorage.getItem('pushSubscribed')) {
      await subscribePush();
    }
  }

  window.PushHelper = { subscribePush, unsubscribePush, initPushBanner, autoResubscribe };
})();
