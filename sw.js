// Service Worker — English With Tom (PWA + Push Notifications)

var CACHE = 'ewt-v1';
var SHELL = [
  '/offline.html',
  '/css/style.css',
  '/js/main.js',
  '/images/logo-icon.png',
  '/images/logo-seal.png',
  '/images/icon-192.png',
  '/images/icon-512.png',
  '/manifest.json'
];

// ===== Install: precache shell =====
self.addEventListener('install', function(event) {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return cache.addAll(SHELL);
    })
  );
});

// ===== Activate: cleanup old caches =====
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

// ===== Fetch: cache strategy =====
self.addEventListener('fetch', function(event) {
  var req = event.request;
  var url = new URL(req.url);

  // Bỏ qua non-GET và cross-origin
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;

  // API calls: network only (không cache)
  if (url.pathname.startsWith('/api/')) return;

  // Static assets (CSS/JS/images/fonts): cache-first
  if (url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|svg|woff2?|ico)(\?|$)/)) {
    event.respondWith(
      caches.match(req).then(function(cached) {
        if (cached) return cached;
        return fetch(req).then(function(res) {
          if (res.ok) {
            var clone = res.clone();
            caches.open(CACHE).then(function(c) { c.put(req, clone); });
          }
          return res;
        });
      })
    );
    return;
  }

  // HTML pages: network-first, fallback to cache, fallback to offline
  event.respondWith(
    fetch(req).then(function(res) {
      if (res.ok) {
        var clone = res.clone();
        caches.open(CACHE).then(function(c) { c.put(req, clone); });
      }
      return res;
    }).catch(function() {
      return caches.match(req).then(function(cached) {
        return cached || caches.match('/offline.html');
      });
    })
  );
});

// ===== Push Notifications =====
self.addEventListener('push', function(event) {
  if (!event.data) return;
  var data = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'English With Tom', body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title || 'English With Tom', {
      body: data.body || '',
      icon: '/images/icon-192.png',
      badge: '/images/icon-192.png',
      data: { url: data.url || '/' },
      vibrate: [200, 100, 200]
    })
  );
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  var url = (event.notification.data && event.notification.data.url) || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(list) {
      for (var i = 0; i < list.length; i++) {
        if (list[i].url.includes(self.location.origin)) {
          list[i].focus();
          list[i].navigate(url);
          return;
        }
      }
      return clients.openWindow(url);
    })
  );
});
