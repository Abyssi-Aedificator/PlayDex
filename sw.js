/* PlayDex service worker */
const CACHE_NAME = 'playdex-v1';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin GET requests (never intercept Dropbox API calls).
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;

  // For navigations (page loads): network-first with cache fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('./index.html', copy));
          return res;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  // For static assets: cache-first, then network, and cache the response.
  event.respondWith(
    caches.match(request).then(cached => {
      const fetched = fetch(request).then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || fetched;
    })
  );
});