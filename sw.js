// Service worker: lets the app open offline.
// App files: network first (so updates show straight away), falling back to the cache.
// Weather and fonts are left to the network; the app keeps its own weather cache.
const CACHE='garden-v1';
const SHELL=['./','index.html','css/styles.css','manifest.webmanifest',
  'js/data.js','js/state.js','js/ui.js','js/weather.js','js/tasks.js','js/plants-view.js','js/beds.js','js/settings.js','js/main.js',
  'icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==location.origin)return;
  e.respondWith(fetch(e.request).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});
