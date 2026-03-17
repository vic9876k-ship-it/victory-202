// PurposePartner Service Worker
const CACHE_NAME = 'app-cache-v2';

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing.');
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating.');
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  clients.claim();
});

// Push event - handle incoming notifications
self.addEventListener('push', (event) => {
  console.log('Push received:', event);

  let notificationData = {};

  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (e) {
      console.error('Error parsing push data:', e);
      notificationData = {
        title: 'PurposePartner',
        body: 'You have a new message from your accountability partner.',
        icon: 'icons/icon-192.png'
      };
    }
  }

  const options = {
    body: notificationData.body || 'New notification from PurposePartner',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: 'purposepartner-notification',
    renotify: true,
    actions: [
      {
        action: 'open',
        title: 'Open PurposePartner',
        icon: 'icons/icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    data: {
      url: notificationData.url || 'dashboard.html'
    }
  };

  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'PurposePartner',
      options
    )
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);

  event.notification.close();

  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((clientList) => {
        // Check if app is already open
        for (let client of clientList) {
          if (client.url.includes(new URL(event.notification.data.url, self.location.origin).pathname)) {
            return client.focus();
          }
        }

        // Open new window
        return clients.openWindow(event.notification.data.url);
      })
    );
  }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync:', event.tag);

  if (event.tag === 'send-encouragement') {
    event.waitUntil(sendPendingEncouragement());
  }
});

// Function to send pending encouragement messages when back online
async function sendPendingEncouragement() {
  try {
    // TODO: Implement sending pending messages from IndexedDB
    console.log('Sending pending encouragement messages...');
  } catch (error) {
    console.error('Error sending pending messages:', error);
  }
}

// Cache management
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) return;

  // Network-first for HTML to prevent cached redirect loops
  if (event.request.url.endsWith('.html')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached version if available
      if (response) {
        return response;
      }

      // Fetch from network
      return fetch(event.request).then((response) => {
        // Don't cache non-successful responses
        if (!response.ok) {
          return response;
        }

        // Clone the response before caching
        const responseToCache = response.clone();

        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('offline.html');
        }
      });
    })
  );
});
