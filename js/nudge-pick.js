// Weekly garden notes — shared by the app and the service worker (no app globals in here).
// The app works out the next few weeks of possible notes and saves them on the phone;
// when the weekly push arrives, the service worker picks the best one that's still valid.
// Nothing about the garden ever leaves the device.
'use strict';
const NUDGE_DB='gdn-nudge',NUDGE_GAP_DAYS=21;
function nudgeDb(){return new Promise((res,rej)=>{const r=indexedDB.open(NUDGE_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore('kv');r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
async function nudgeGet(k){try{const db=await nudgeDb();return await new Promise(res=>{const q=db.transaction('kv').objectStore('kv').get(k);q.onsuccess=()=>res(q.result);q.onerror=()=>res(undefined);});}catch(e){return undefined;}}
async function nudgeSet(k,v){try{const db=await nudgeDb();return await new Promise(res=>{const tx=db.transaction('kv','readwrite');tx.objectStore('kv').put(v,k);tx.oncomplete=()=>res(true);tx.onerror=()=>res(false);});}catch(e){return false;}}
function nudgeToday(){const d=new Date();return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function nudgeDays(a,b){return Math.round((new Date(b+'T00:00')-new Date(a+'T00:00'))/864e5);}
// list: [{id,topic,pri,from,to,title,body,go,once}] · hist: [{id,topic,at,opened}]
// Best note for today: valid now, topic not used in the last 3 weeks, one-offs never repeated; lowest pri wins
function pickNudge(list,hist,today=nudgeToday()){
  hist=hist||[];
  const recent=t=>hist.some(h=>h.topic===t&&nudgeDays(h.at,today)<NUDGE_GAP_DAYS),ever=id=>hist.some(h=>h.id===id);
  return(list||[]).filter(n=>n.from<=today&&today<=n.to&&!recent(n.topic)&&!(n.once&&ever(n.id)))
    .sort((a,b)=>a.pri-b.pri||a.from.localeCompare(b.from))[0]||null;
}
const NUDGE_FALLBACK={id:'fallback',topic:'fallback',pri:9,title:'🌱 Your garden this week',body:'See what’s in season and what’s nearly ready.',go:'jobs'};
