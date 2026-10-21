// Service worker: lets the app open offline.
// App files: network first, always revalidated (so updates show straight away), falling back to the cache.
// index.html adds ?v=N to each file; bump it together with CACHE on every release.
// Weather and fonts are left to the network; the app keeps its own weather cache.
const CACHE='garden-v59';
const SHELL=['./','index.html','css/styles.css','manifest.webmanifest',
  'js/data.js','js/state.js','js/varieties.js','js/zones.js','js/ui.js','js/weather.js','js/pests.js','js/tasks.js','js/harvest.js','js/plants-view.js','js/behaviour.js','js/rotation.js','js/fruit.js','js/feeding.js','js/crops2.js','js/seasons.js','js/seeds.js','js/reminders.js','js/beds.js','js/settings.js','js/help.js','js/nudge-pick.js','js/notify.js','js/config.js','js/sync.js','js/main.js',
  'icons/icon-192.png','icons/icon-512.png','icons/apple-touch-icon.png'];

importScripts('js/config.js','js/nudge-pick.js');

// ── Weekly garden note ── the push carries no data: we pick the note here, from what the app saved on this phone
function nudgeRpc(fn,args){return fetch(`${SB_URL}/rest/v1/rpc/${fn}`,{method:'POST',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(args)}).catch(()=>{});}
async function nudgeEndpoint(){try{return(await self.registration.pushManager.getSubscription())?.endpoint;}catch(e){return null;}}
self.addEventListener('push',e=>e.waitUntil((async()=>{
  const q=(await nudgeGet('queue'))||{},hist=(await nudgeGet('hist'))||[];
  const n=pickNudge(q.list,hist)||NUDGE_FALLBACK;
  hist.push({id:n.id,topic:n.topic,at:nudgeToday(),opened:false});await nudgeSet('hist',hist.slice(-80));
  await self.registration.showNotification(n.title,{body:n.body,icon:'icons/icon-192.png',badge:'icons/icon-192.png',tag:'garden-note',data:{go:n.go,id:n.id}});
  // Three unopened in a row: ease off to fortnightly
  const last=hist.slice(-3);if(last.length===3&&last.every(h=>!h.opened)){const ep=await nudgeEndpoint();if(ep)await nudgeRpc('push_interval',{p_endpoint:ep,p_days:14});}
})()));
self.addEventListener('notificationclick',e=>{
  e.notification.close();const{go,id}=e.notification.data||{};
  e.waitUntil((async()=>{
    const hist=(await nudgeGet('hist'))||[],h=[...hist].reverse().find(x=>x.id===id);
    if(h){h.opened=true;await nudgeSet('hist',hist);}
    const ep=await nudgeEndpoint();if(ep)nudgeRpc('push_interval',{p_endpoint:ep,p_days:7});
    const url=new URL('./?go='+encodeURIComponent(go||'jobs'),self.registration.scope).href;
    const cs=await clients.matchAll({type:'window',includeUncontrolled:true});
    if(cs.length){try{const c=await cs[0].navigate(url);return(c||cs[0]).focus();}catch(err){}}
    return clients.openWindow(url);
  })());
});

self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  const url=new URL(e.request.url);
  if(e.request.method!=='GET'||url.origin!==location.origin)return;
  e.respondWith(fetch(e.request,{cache:'no-cache'}).then(r=>{const copy=r.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return r;})
    .catch(()=>caches.match(e.request,{ignoreSearch:true}).then(r=>r||caches.match('index.html'))));
});
