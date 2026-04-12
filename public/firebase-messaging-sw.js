/* eslint-disable no-undef */
// Firebase Messaging Service Worker
// Handles background push notifications (when tab is not focused or browser is in background)

importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: 'AIzaSyCb33rq5m2GAdf0ln4T05ZHHvY8FwwOgBk',
  authDomain: 'royalwebdeveloping-2beda.firebaseapp.com',
  projectId: 'royalwebdeveloping-2beda',
  storageBucket: 'royalwebdeveloping-2beda.firebasestorage.app',
  messagingSenderId: '741920745658',
  appId: '1:741920745658:web:7a7f4df8d68bea3174fa83',
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification?.title || 'New Insurance Lead!';
  const notificationOptions = {
    body: payload.notification?.body || 'A new lead has been submitted.',
    icon: '/logo.png',
    badge: '/logo.png',
    tag: 'new-lead-' + (payload.data?.leadId || Date.now()),
    data: payload.data || {},
    requireInteraction: true,
    vibrate: [300, 100, 300, 100, 300, 100, 500],
    actions: [
      { action: 'view', title: 'View Lead' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const leadId = event.notification.data?.leadId;
  let targetUrl = '/admin';

  if (event.action === 'view' && leadId) {
    targetUrl = '/admin/leads/' + leadId;
  } else if (leadId) {
    targetUrl = '/admin/leads/' + leadId;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // If admin panel is already open, focus it and navigate
      for (const client of clientList) {
        if (client.url.includes('/admin') && 'focus' in client) {
          client.focus();
          client.navigate(targetUrl);
          return;
        }
      }
      // Otherwise open a new window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
