// Service worker: lets the app open offline.
// App files: network first, always revalidated (so updates show straight away), falling back to the cache.
// index.html adds ?v=N to each file; bump it together with CACHE on every release.
// Weather and fonts are left to the network; the app keeps its own weather cache.
const CACHE='garden-v6';
const SHELL=['./','index.html','css/styles.css','manifest.webmanifest',
  'js/data.js','js/state.js','js/ui.js','js/weather.js','js/pests.js','js/tasks.js','js/month.js','js/plants-view.js','js/beds.js','js/settings.js','js/main.js',
  'icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
