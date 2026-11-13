/* rest-sw.js – powiadomienie o końcu przerwy między seriami.
   Działa niezależnie od głównego sw.js (osobny zakres ./rest-notif/),
   dzięki czemu nie trzeba nic zmieniać w istniejącym sw.js. */

let timer = 0;       // zaplanowany czas powiadomienia
let release = null;  // zwalnia event.waitUntil, gdy plan jest anulowany / nadpisany
let lastFired = 0;   // ostatni wyświetlony koniec przerwy (ochrona przed dublem)
const BADGE = 'data:image/png;base64,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'; // biała sylwetka bicepsa (kanał alfa) – ikona w pasku powiadomień
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
    badge: BADGE,
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
