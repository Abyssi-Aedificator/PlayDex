/* PlayDex service worker */
const SW_VERSION = '3.4.0';
const CACHE_NAME = 'playdex-v0382';
const UPDATE_CACHE = 'playdex-update-control';
const APPROVED_KEY = new URL('./__approved-version__', self.registration.scope).href;
const APP_SHELL = ['./', './index.html', './changelog.txt', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png', './icon-maskable-512.png', './assets/material/RobotoFlex.ttf'];

async function approvedCache() {
  const control = await caches.open(UPDATE_CACHE);
  const saved = await control.match(APPROVED_KEY);
  if (saved) return saved.text();
  // Migrate installations that predate confirmation-based updates.
  const previous = (await caches.keys()).filter(key => /^playdex-v\d+$/.test(key) && key !== CACHE_NAME)
    .sort((a,b) => Number(b.slice(9)) - Number(a.slice(9)))[0];
  const name = previous || CACHE_NAME;
  await control.put(APPROVED_KEY, new Response(name));
  return name;
}
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    await approvedCache();
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    // No automatic skipWaiting: approval is sent by the Update now button.
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const approved = await approvedCache();
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => /^playdex-v\d+$/.test(key) && key !== CACHE_NAME && key !== approved).map(key => caches.delete(key)));
    // Never claim clients or touch sibling apps' caches.
  })());
});
self.addEventListener('message', event => {
  if (!event.data || !event.ports[0]) return;
  const port = event.ports[0];
  event.waitUntil((async () => {
    try {
      if (event.data.type === 'PLAYDEX_UPDATE_INFO') {
        port.postMessage({ version:SW_VERSION, cache:CACHE_NAME, pending:(await approvedCache()) !== CACHE_NAME });
      } else if (event.data.type === 'PLAYDEX_CHANGELOG') {
        const cache=await caches.open(CACHE_NAME),notes=await cache.match('./changelog.txt');
        if(!notes)throw new Error('Release notes are not available for this update.');
        port.postMessage({version:SW_VERSION,text:await notes.text()});
      } else if (event.data.type === 'PLAYDEX_APPROVE_UPDATE' && event.data.cache === CACHE_NAME) {
        const cache = await caches.open(CACHE_NAME);
        if (!await cache.match('./index.html')) throw new Error('Update download is incomplete. Try again online.');
        await (await caches.open(UPDATE_CACHE)).put(APPROVED_KEY,new Response(CACHE_NAME));
        await self.skipWaiting();
        port.postMessage({ok:true});
      }
    } catch(error) { port.postMessage({error:error.message}); }
  })());
});
self.addEventListener('fetch', event => {
  const request=event.request, url=new URL(request.url), scope=new URL(self.registration.scope);
  if (request.method !== 'GET' || url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(await approvedCache());
    // Keep the approved app shell stable even when a newer worker activates
    // naturally after all tabs close. Approval changes the persistent pointer.
    const cached = await cache.match(request.mode === 'navigate' ? './index.html' : request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      // A missing cached shell must not trap the user on the offline error page
      // after connectivity returns. Fetch the page and restore the shell cache
      // so the app is available offline again on the next visit.
      let response;
      try {
        response = await fetch(request);
      } catch {
        return new Response('PlayDex is unavailable offline. Reconnect to recover the app.',{status:503,headers:{'Content-Type':'text/plain'}});
      }
      if (response.ok) {
        try { await cache.put('./index.html', response.clone()); } catch { /* Network response still recovers this visit. */ }
      }
      return response;
    }
    return fetch(request);
  })());
});
