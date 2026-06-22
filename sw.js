// Service Worker — English With Tom Push Notifications
self.addEventListener('push', function(event) {
  if (!event.data) return;
  var data = {};
  try { data = event.data.json(); } catch(e) { data = { title: 'English With Tom', body: event.data.text() }; }

  event.waitUntil(
    self.registration.showNotification(data.title || 'English With Tom', {
      body: data.body || '',
      icon: '/images/logo.png',
      badge: '/images/logo.png',
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
