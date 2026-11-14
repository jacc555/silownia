const CACHE = "silownia-v3";
const FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./icons/favicon-32.png",
  "./icons/apple-touch-icon.png",
  "./icons/badge-96.png"
];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(CACHE)
      // każdy plik osobno: brak jednego nie blokuje instalacji
      .then(c => Promise.all(FILES.map(f => c.add(new Request(f, { cache: "reload" })).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys()
      .then(k => Promise.all(k.filter(n => n !== CACHE).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

// Strategia: odpowiedz od razu z pamięci podręcznej (start bez czekania na sieć),
// a w tle pobierz świeżą wersję. Jeśli strona się zmieniła, aplikacja pokaże „Dostępna nowa wersja”.
self.addEventListener("fetch", e => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;

  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    let cached = await cache.match(req);
    if (!cached && req.mode === "navigate") cached = await cache.match("./index.html");

    const refresh = fetch(req, { cache: "no-cache" })
      .then(async r => {
        if (r && r.ok) {
          if (cached && req.mode === "navigate") {
            const a = cached.headers.get("etag") || cached.headers.get("last-modified");
            const b = r.headers.get("etag") || r.headers.get("last-modified");
            if (a && b && a !== b) {
              const cs = await self.clients.matchAll({ type: "window" });
              cs.forEach(c => c.postMessage({ type: "sw-updated" }));
            }
          }
          await cache.put(req, r.clone());
        }
        return r;
      })
      .catch(() => null);

    if (cached) { e.waitUntil(refresh); return cached; }
    const r = await refresh;
    return r || Response.error();
  })());
});
