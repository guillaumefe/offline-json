const CACHE_NAME = 'offline-jsonlint-cache-v1';
const ASSETS = [
  './',
  'index.html',
  'manifest.json',
  'sw.js'
  // Add icon-192.png and icon-512.png if you include them locally
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  // Serve only from cache, never fetch from network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      // If not in cache, return a fallback Response
      return new Response('Ressource non disponible hors-ligne.', { status: 503, statusText: 'Service Unavailable' });
    })
  );
});

