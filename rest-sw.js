/* rest-sw.js – powiadomienie o końcu przerwy między seriami.
   Działa niezależnie od głównego sw.js (osobny zakres ./rest-notif/),
   dzięki czemu nie trzeba nic zmieniać w istniejącym sw.js. */

let timer = 0;       // zaplanowany czas powiadomienia
let release = null;  // zwalnia event.waitUntil, gdy plan jest anulowany / nadpisany
let lastFired = 0;   // ostatni wyświetlony koniec przerwy (ochrona przed dublem)
const MAX_WAIT = 290000; // przeglądarki pozwalają trzymać workera ok. 5 min

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

function stopPending() {
  clearTimeout(timer);
  timer = 0;
  if (release) { const r = release; release = null; r(); }
}

async function show(d) {
  // Jeśli aplikacja jest na wierzchu, sama zagra dźwięk i zawibruje – bez powiadomienia
  if (!d.force) {
    const cl = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    if (cl.some((c) => c.visibilityState === 'visible' && c.focused)) return;
  }
  await self.registration.showNotification(d.title || 'Koniec przerwy', {
    body: d.body || 'Do dzieła! Czas na kolejną serię.',
    tag: 'rest',
    renotify: true,
    vibrate: [500, 160, 500, 160, 900],
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    data: { end: d.end },
  });
}

self.addEventListener('message', (e) => {
  const d = e.data || {};
  if (d.t === 'cancel') { stopPending(); return; }
  if (d.t !== 'rest' || !d.end) return;
  if (d.end === lastFired) return;          // ten koniec przerwy już obsłużony
  stopPending();                             // nowy plan zastępuje poprzedni
  const wait = Math.max(0, d.end - Date.now());
  if (wait > MAX_WAIT) return;
  e.waitUntil(new Promise((resolve) => {
    release = resolve;
    timer = setTimeout(async () => {
      timer = 0;
      release = null;
      lastFired = d.end;
      try { await show(d); } catch (err) { /* brak uprawnień – nic nie robimy */ }
      resolve();
    }, wait);
  }));
});

self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((cl) => {
      const c = cl.find((w) => 'focus' in w);
      return c ? c.focus() : self.clients.openWindow('./');
    })
  );
});
