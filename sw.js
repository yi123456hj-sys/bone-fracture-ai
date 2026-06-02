/* BoneScan AI — Service Worker v2
   Full offline support for iOS & Android PWA */

const CACHE_NAME = 'bonescan-v2';
const BASE = '/bone-fracture-ai';

const PRECACHE_URLS = [
  BASE + '/',
  BASE + '/index.html',
  BASE + '/css/style.css',
  BASE + '/js/app.js',
  BASE + '/js/extra.js',
  BASE + '/manifest.json',
  BASE + '/icons/icon-192.png',
  BASE + '/icons/icon-512.png',
  BASE + '/icons/icon-152.png',
  BASE + '/images/spiral.jpg',
  BASE + '/images/hairline.jpg',
  BASE + '/images/comminuted.jpg',
  BASE + '/images/avulsion.jpg',
  BASE + '/images/greenstick.jpg',
  BASE + '/images/oblique.jpg',
];

const CDN_CACHE = 'bonescan-cdn-v2';
const CDN_PATTERNS = [
  'cdn.jsdelivr.net',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── Install ──────────────────────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll(PRECACHE_URLS).catch(() => {})
    )
  );
});

// ── Activate ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys =>
        Promise.all(
          keys
            .filter(k => k !== CACHE_NAME && k !== CDN_CACHE)
            .map(k => caches.delete(k))
        )
      ),
      self.clients.claim(),
    ])
  );
});

// ── Fetch ─────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // CDN: stale-while-revalidate
  if (CDN_PATTERNS.some(p => url.hostname.includes(p))) {
    event.respondWith(
      caches.open(CDN_CACHE).then(cache =>
        cache.match(req).then(cached => {
          const fresh = fetch(req).then(res => {
            if (res && res.status === 200)
              cache.put(req, res.clone()).catch(() => {});
            return res;
          }).catch(() => cached);
          return cached || fresh;
        })
      )
    );
    return;
  }

  // HTML pages: network-first (always fresh), fallback to cache
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME)
            .then(c => c.put(req, clone))
            .catch(() => {});
          return res;
        })
        .catch(() =>
          caches.match(req).then(r => r || caches.match(BASE + '/index.html'))
        )
    );
    return;
  }

  // Everything else: cache-first
  event.respondWith(
    caches.match(req).then(cached =>
      cached ||
      fetch(req).then(res => {
        if (res && res.status === 200 && res.type !== 'opaque') {
          const clone = res.clone();
          caches.open(CACHE_NAME)
            .then(c => c.put(req, clone))
            .catch(() => {});
        }
        return res;
      }).catch(() => caches.match(BASE + '/index.html'))
    )
  );
});

// ── Push Notifications ────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() || {};
  event.waitUntil(
    self.registration.showNotification(data.title || 'BoneScan AI', {
      body: data.body || '您有新的提醒 You have a new reminder',
      icon: BASE + '/icons/icon-192.png',
      badge: BASE + '/icons/icon-72.png',
      vibrate: [200, 100, 200],
      data: { url: data.url || BASE + '/' },
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || BASE + '/')
  );
});
