// Service Worker for caching Minecraft Wiki icons
const CACHE_NAME = 'mc-tracker-icons-v1';
const ICON_CACHE_DURATION = 60 * 60 * 24 * 365; // 1 year in seconds

// Install event - cache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name.startsWith('mc-tracker-') && name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache Minecraft Wiki images
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Only cache Minecraft Wiki images
  if (url.hostname === 'minecraft.wiki' && url.pathname.startsWith('/images/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            // Return cached version
            return cachedResponse;
          }

          // Fetch and cache
          return fetch(event.request).then((networkResponse) => {
            if (networkResponse.ok) {
              // Clone the response before caching
              cache.put(event.request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => {
            // Return nothing if fetch fails (fallback emoji will show)
            return new Response('', { status: 404 });
          });
        });
      })
    );
  }
});
