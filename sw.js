// Version and cache configuration
const CACHE_NAME    = 'offline-jsonlint-cache-v2';
const PRECACHE_URLS = [
  './',               // root – serves index.html
  './index.html',      // main HTML entry point
  './manifest.json',   // PWA manifest
  './icon-192.png',    // app icons
  './icon-512.png',
  './sw.js'            // this service worker script
];

// INSTALL event: pre-cache all essential assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())  // activate worker immediately
  );
});

// ACTIVATE event: remove any old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      )
    ).then(() => self.clients.claim())  // take control of uncontrolled clients
  );
});

// FETCH event: serve requests from cache, fall back to network, or return offline response
self.addEventListener('fetch', event => {
  const request = event.request;

  // For navigation requests (HTML pages), attempt network first
  if (request.mode === 'navigate' ||
      (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'))) {
    event.respondWith(
      fetch(request)
        .then(networkResponse => {
          // Update cache with latest HTML
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          // If network fails, return cached HTML or a generic offline message
          return caches.match(request).then(cached => 
            cached ||
            new Response('<h1>Offline</h1><p>Page is not available offline.</p>', {
              headers: { 'Content-Type': 'text/html' },
              status: 503,
              statusText: 'Service Unavailable'
            })
          );
        })
    );
    return;
  }

  // For other assets (CSS, JS, images): cache-first strategy
  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(request)
        .then(networkResponse => {
          // Cache the new resource for future visits
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          // If both cache and network fail, return a minimal 503 response
          return new Response('Resource not available offline.', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        });
    })
  );
});
