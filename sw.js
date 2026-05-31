const CACHE_NAME = "world-clock-v14-6-30-language-fab-subtle";
const APP_SHELL = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./manifest-en.webmanifest",
  "./manifest-tr.webmanifest",
  "./icon-192-v14627.png",
  "./icon-512-v14627.png",
  "./apple-touch-icon-v14627.png",
  "https://code.jquery.com/jquery-3.7.1.min.js"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone)).catch(() => null);
        return response;
      });
    }).catch(() => caches.match("./index.html"))
  );
});
