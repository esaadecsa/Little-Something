const CACHE = "hbd-v28";
const CORE = ["./", "./index.html", "./style.css", "./style-enhance.css", "./script.js", "./living-story-engine.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // Always try fresh app code first; cache is the offline fallback.
  // { cache: "no-store" } penting: tanpa ini, fetch() di dalam Service
  // Worker masih bisa kena cache HTTP biasa dari browser/CDN GitHub
  // Pages, jadi walau logikanya "network-first", isinya bisa tetap
  // basi. no-store memaksa permintaan baru ke server setiap kali.
  const isAppCode = /\.(html?|css|js)$/i.test(url.pathname) || url.pathname.endsWith("/");
  event.respondWith(
    isAppCode
      ? fetch(req, { cache: "no-store" }).then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        }).catch(() => caches.match(req).then((r) => r || caches.match("./index.html")))
      : caches.match(req).then((cached) => cached || fetch(req).then((res) => {
          if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
          return res;
        }))
  );
});
