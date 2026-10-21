// Weekly garden notes: friendly, specific to your garden, never nagging.
// Five kinds, best first: ready to enjoy · milestones · protect the harvest · good time to plant · seasonal moments.
// The rule: every note is about something good the garden can give you soon — never a chore or a guilt trip.
'use strict';

// Why each crop is worth planting — finishes "Now’s a great time for …, "
const NUDGE_WHY={
  'tomatoes':['cherry tomatoes','they’re great in summer salads'],'lettuce':['lettuce','fresh salad leaves in about 6 weeks'],
  'basil':['basil','pesto and tomato’s best friend'],'zucchini':['zucchini','one plant feeds a family all summer'],
  'beans':['beans','pick a handful every couple of days'],'cucumber':['cucumbers','crunchy and cool straight off the vine'],
  'capsicum':['capsicum','sweet and colourful in everything'],'chilli':['chillies','one plant gives you a year of heat'],
  'eggplant':['eggplant','silky in curries and on the barbecue'],'sweet-corn':['sweet corn','nothing beats it picked an hour before dinner'],
  'pumpkin':['pumpkin','soup and roast veg all winter'],'kale':['kale','pick leaves for months'],'spinach':['spinach','quick, tender and full of goodness'],
  'chard':['silverbeet','colourful, easy and keeps on giving'],'beetroot':['beetroot','sweet roots and tasty leaves too'],
  'carrots':['carrots','homegrown ones are wonderfully sweet'],'radish':['radishes','ready in about a month — the fastest crop there is'],
  'spring-onions':['spring onions','snip what you need, when you need it'],'peas':['peas','sweet enough to eat straight off the plant'],
  'broad-beans':['broad beans','buttery spring beans and they feed the soil'],'garlic':['garlic','plant a few cloves now for a year of garlic'],
  'broccoli':['broccoli','side shoots keep coming after the first head'],'cauliflower':['cauliflower','a proud harvest for winter roasts'],
  'cabbage':['cabbage','slaw, stir-fries and soups'],'asian-greens':['Asian greens','stir-fry ready in weeks'],'bok-choy':['bok choy','ready for stir-fries in about 6 weeks'],
  'coriander':['coriander','fresh for curries, salsas and noodles'],'parsley':['parsley','a handful in everything for months'],
  'strawberry':['strawberries','sun-warm berries from your own patch'],'potato':['potatoes','digging them up is like a treasure hunt'],
  'sweet-potato':['sweet potato','easy, sprawling and generous'],'rocket':['rocket','peppery leaves in just a few weeks'],
  'watermelon':['watermelon','the taste of a backyard summer'],'sunflower':['sunflowers','big, cheerful and loved by bees'],
  'leek':['leeks','soups and pies all winter'],'onions':['onions','a kitchen staple that stores for months'],'mint':['mint','mojitos, teas and salads'],
  'chives':['chives','snip them over eggs and potatoes'],'dill':['dill','lovely with fish and potatoes'],'okra':['okra','loves the heat when other things flag'],
  };
// Prevention jobs, told as the reward
const GUARD_NUDGE={
  'net-brassica':['🥦 Keep your greens perfect','A light net now means caterpillar-free leaves all season.'],
  'flowers-aphids':['🌼 Invite the good bugs in','A few alyssum or daisies now bring ladybirds to guard your veg.'],
  'snail-traps':['🐌 Get ahead of the snails','A couple of beer traps before the rain keeps your seedlings safe.'],
  'collars':['🌱 Give your seedlings a head start','A toilet-roll collar keeps cutworms off young plants.'],
  'medfly-traps':['🍑 Protect this year’s fruit','Fruit fly traps up now mean cleaner, tastier fruit later.'],
  'mite-mulch':['🍂 Tuck the garden in for summer','A thick layer of mulch keeps roots cool and plants happy.'],
  'sticky-traps':['🟡 A simple early warning','One yellow sticky trap per bed spots whitefly before they spread.'],
  'mildew-space':['🥒 Keep your zucchini cropping','A little more air between leaves keeps mildew away.'],
  'net-fruit':['🍓 Strawberries on the way','A net over them now means you get the berries, not the birds.'],
  'leaf-curl-spray':['🍑 Set up a great peach year','One spray at bud swell keeps the leaves healthy all season.'],
  'gall-wasp-prune':['🍋 Give your citrus a tidy','Snip off any lumpy stems now for a healthier tree in spring.'],
  'ant-bands':['🌳 A quick win for your fruit trees','A sticky band round the trunk keeps ants and scale away.'],
};
// Date helpers
function ndMonthStart(off=0){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+off);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`;}
function ndMonthEnd(off=0){const d=new Date();d.setDate(1);d.setMonth(d.getMonth()+off+1);d.setDate(0);return`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function ndLater(a,b){return a>b?a:b;}

// Every note that could be worth sending over the next 8 weeks, each with the dates it's good for
function buildNudges(){
  const td=localDate(),m=curMonth(),out=[],add=n=>{if(n.from<=n.to)out.push(n);};
  const lc=s=>s.toLowerCase();
  // 1. Ready to enjoy (veg)
  const seen=new Set();
  plantedCells().forEach(({bed,cell})=>{
    if(isTree(cell.p)||cell.s==='done'||pickingOver(cell)||COMPANIONS.includes(cell.p))return;
    const k=cell.p,key=k+bed.id;if(seen.has(key))return;seen.add(key);
    const pl=P[k],exp=expectedDate(cell),ready=['ready','bolting'].includes(cell.s);
    if(!ready&&(!exp||daysBetween(td,exp)>56))return;
    const from=ready?td:ndLater(td,addDays(exp,-1));
    add({id:`ready:${k}:${bed.id}:${from.slice(0,7)}`,topic:`ready:${k}`,pri:1,from,to:addDays(from,10),
      title:`${pl.e} Fresh ${lc(plantName(k))} ready in ${unesc(bed.name)}`,body:`Try this: ${RECIPES[k]||firstSentence(pl.idea)}`,go:`pick:${k}`});
  });
  // 1b. Fruit trees: picking season, and a net just before the fruit colours
  treeBeds().forEach(({bed})=>{
    const c=treeCell(bed),f=FRUIT[c.p],pl=P[c.p],pk=treePick(c);if(!treeBearing(c)||treeRested(c))return;
    for(let o=0;o<=2;o++){
      const mm=(m+o)%12,from=o?ndMonthStart(o):td;
      if(fruitMonthIn(pk,mm)&&!fruitMonthIn(pk,(mm+11)%12)||(o===0&&treeStage(c)==='ready'))
        add({id:`tree:${bed.id}:${from.slice(0,7)}`,topic:`tree:${bed.id}`,pri:1,from,to:addDays(from,14),
          title:`${pl.e} It’s ${pl.n.toLowerCase()} picking time!`,body:`Try this: ${RECIPES[c.p]||firstSentence(pl.idea)}`,go:`tree:${bed.id}`});
      if(f.net&&fruitMonthIn(pk,(mm+1)%12)&&!fruitMonthIn(pk,mm))
        add({id:`net:${bed.id}:${from.slice(0,7)}`,topic:`net:${bed.id}`,pri:2,from,to:ndMonthEnd(o),
          title:`${pl.e} ${pl.n} season is nearly here`,body:'A net this weekend means they’re yours, not the birds’.',go:`tree:${bed.id}`});
    }
  });
  // 2. Milestones: harvests and value this year
  const yr=td.slice(0,4),logs=ST.log.filter(l=>l.d.startsWith(yr)),n=logs.length,val=logs.reduce((s,l)=>s+logValue(l),0);
  const hitN=n===1?1:[100,50,25,10].find(t=>n>=t),hitV=[1000,500,250,100,50,20].find(t=>val>=t);
  if(hitV)add({id:`ms:v:${yr}:${hitV}`,topic:'milestone',pri:1.5,once:true,from:td,to:addDays(td,14),title:`🎉 Over ${money(hitV)} of food from your garden`,body:'That’s this year so far — all grown by you. Lovely work!',go:'harvest'});
  else if(hitN)add({id:`ms:n:${yr}:${hitN}`,topic:'milestone',pri:1.5,once:true,from:td,to:addDays(td,14),title:hitN===1?'🎉 Your first harvest of the year!':`🎉 ${hitN} harvests this year`,body:hitN===1?'The first of many. Enjoy every bite.':'Every one picked by you. Keep it up!',go:'harvest'});
  // 3. Protect the harvest (only in Standard)
  if(maint()==='std')for(let o=0;o<=1;o++){const mm=(m+o)%12;
    Object.entries(GUARDS).forEach(([id,g])=>{if(!GUARD_NUDGE[id]||!pestMonthIn(g.months,mm)||guardDone(id)||!guardCells(g).length)return;
      add({id:`guard:${id}:${ndMonthStart(o).slice(0,7)}`,topic:'guard',pri:2.5,from:o?ndMonthStart(o):td,to:ndMonthEnd(o),title:GUARD_NUDGE[id][0],body:GUARD_NUDGE[id][1],go:'jobs'});});}
  // 4. Good time to plant: beds with room
  ST.beds.forEach((bed,bi)=>{
    if(isTreeBed(bed)||!emptyCells(bi).length)return;
    const sug=suggestForBed(bi,6).map(s=>s.k).filter(x=>!COMPANIONS.includes(x)),k=sug.find(x=>NUDGE_WHY[x])||sug[0];if(!k)return;
    const[name,why]=NUDGE_WHY[k]||[lc(plantName(k)),'easy to grow and lovely picked fresh'];
    add({id:`plant:${bed.id}:${k}:${td.slice(0,7)}`,topic:`plant:${bed.id}`,pri:3,from:td,to:ndMonthEnd(0),
      title:`🌱 Got room in ${unesc(bed.name)}?`,body:`Now’s a great time for ${name} — ${why}.`,go:`plant:${bi}`});
  });
  // …and next month, something that's only just coming into season
  const nm=(m+1)%12,fresh=Object.keys(NUDGE_WHY).filter(k=>P[k]&&inSeason(k,nm)&&!inSeason(k,m));
  ST.beds.forEach((bed,bi)=>{if(isTreeBed(bed)||!emptyCells(bi).length||!fresh.length)return;const k=fresh[bi%fresh.length],[name,why]=NUDGE_WHY[k];
    add({id:`plant:${bed.id}:${k}:${ndMonthStart(1).slice(0,7)}`,topic:`plant:${bed.id}`,pri:3,from:ndMonthStart(1),to:ndMonthEnd(1),
      title:`🌱 Got room in ${unesc(bed.name)}?`,body:`It’s ${name} time — ${why}.`,go:`plant:${bi}`});});
  if(!ST.beds.length)add({id:`start:${td.slice(0,7)}`,topic:'start',pri:3,from:td,to:ndMonthEnd(0),title:'🌱 Ready to start your garden?',body:'Add a bed and we’ll suggest what’s great to grow this month.',go:'beds'});
  // 5. Seasonal moments, this month and next
  for(let o=0;o<=2;o++)storiesFor((m+o)%12).slice(0,2).forEach(s=>add({id:`story:${s.id}`,topic:`story:${s.id}`,pri:4,once:true,
    from:o?ndMonthStart(o):td,to:ndMonthEnd(o),title:`${s.emoji.split(' ')[0]} ${s.title}`,body:firstSentence(s.story),go:'plants'}));
  // 6. Something in season, so there's always a friendly note
  for(let o=0;o<=2;o++){const mm=(m+o)%12,now=[...COOL_VEG,...WARM_VEG].filter(k=>P[k]&&!P[k].custom&&inSeason(k,mm)).slice(0,3).map(k=>lc(plantName(k)));
    if(now.length)add({id:`season:${mm}`,topic:`season:${mm}`,pri:8,from:o?ndMonthStart(o):td,to:ndMonthEnd(o),title:`🌱 Good to plant in ${MONTHS[mm]}`,body:`${now.join(', ')} and more — take a look.`,go:'plants'});}
  return out;
}

// ── Settings (per device) ──
const NUDGE_K='gdn_nudge';
function nudgePref(){try{return{on:false,dow:0,hour:8,...JSON.parse(localStorage.getItem(NUDGE_K)||'{}')};}catch(e){return{on:false,dow:0,hour:8};}}
function setNudgePref(p){try{localStorage.setItem(NUDGE_K,JSON.stringify({...nudgePref(),...p}));}catch(e){}}
let _nudgeHist=[];
// Save the next 8 weeks of notes for the service worker; called on start and whenever the app is put away
let _nqT;
function queueNudges(){clearTimeout(_nqT);_nqT=setTimeout(()=>{try{nudgeSet('queue',{list:buildNudges(),at:localDate()});}catch(e){}},300);}
async function loadNudgeHist(){_nudgeHist=(await nudgeGet('hist'))||[];if(curView==='jobs')renderJobs();}
function noteNudge(n,opened){_nudgeHist.push({id:n.id,topic:n.topic,at:localDate(),opened});_nudgeHist=_nudgeHist.slice(-80);nudgeSet('hist',_nudgeHist);}

// ── In the app: this week's note at the top of Jobs ──
// In the app, harvests are already in Jobs — so the card offers ideas instead
function weekNudge(push){try{return pickNudge(buildNudges().filter(n=>push||!/^(ready|tree):/.test(n.topic)),_nudgeHist,localDate());}catch(e){return null;}}
function nudgeCardHtml(){
  const n=weekNudge();if(!n)return'';
  return `<div class="nudge-card"><button class="nudge-x" aria-label="Hide" onclick="nudgeHide('${n.id}')">✕</button><div class="nudge-k">This week</div><div class="nudge-t">${esc(n.title)}</div><div class="nudge-b">${esc(n.body)}</div><button class="task-btn" onclick="nudgeOpen('${n.id}')">Show me ›</button></div>`;
}
function nudgeById(id){return buildNudges().find(n=>n.id===id);}
function nudgeHide(id){const n=nudgeById(id);if(n)noteNudge(n,false);renderJobs();}
function nudgeOpen(id){const n=nudgeById(id);if(!n)return;noteNudge(n,true);nudgeGo(n.go);}
// Where a note's "Show me" (or a tapped notification) takes you
function nudgeGo(go){
  const[a,b]=String(go||'').split(':');
  if(a==='pick'&&P[b]){setView('harvest');openGrowing(b);}
  else if(a==='plant'&&ST.beds[+b])goToEmpty(+b);
  else if(a==='tree'){const bi=ST.beds.findIndex(x=>String(x.id)===b);setView('beds');if(bi>=0)openTreeSheet(bi);}
  else if(['jobs','plants','beds','harvest','pests'].includes(a))setView(a);
}

// ── Push: one note a week, at the time you choose ──
function pushSupported(){return'serviceWorker' in navigator&&'PushManager' in window&&'Notification' in window;}
function needsInstallForPush(){return isIOS()&&!isInstalled();}
function b64uBytes(s){const p='='.repeat((4-s.length%4)%4),b=atob((s+p).replace(/-/g,'+').replace(/_/g,'/'));return Uint8Array.from(b,c=>c.charCodeAt(0));}
function nudgeRpc(fn,args){return fetch(`${SB_URL}/rest/v1/rpc/${fn}`,{method:'POST',headers:{apikey:SB_KEY,Authorization:`Bearer ${SB_KEY}`,'Content-Type':'application/json'},body:JSON.stringify(args)}).then(r=>r.ok);}
function nudgeTz(){try{return Intl.DateTimeFormat().resolvedOptions().timeZone||'Australia/Perth';}catch(e){return'Australia/Perth';}}
async function pushSubscription(create){
  const reg=await navigator.serviceWorker.ready;let sub=await reg.pushManager.getSubscription();
  if(!sub&&create&&VAPID_PUB)sub=await reg.pushManager.subscribe({userVisibleOnly:true,applicationServerKey:b64uBytes(VAPID_PUB)});
  return sub;
}
// Safari used to take a callback instead of returning a promise
function askPermission(){return new Promise(res=>{try{const r=Notification.requestPermission(res);if(r&&r.then)r.then(res);}catch(e){res(Notification.permission);}});}
let _nudgeErr='';
async function enableNudges(){
  _nudgeErr='';
  if(needsInstallForPush()){openNudgeInstall();return;}
  if(!pushSupported()){_nudgeErr='This browser can’t show notifications. You’ll still see your weekly idea at the top of Jobs.';setNudgePref({on:true});refreshNudgeSettings();return;}
  const perm=await askPermission();
  if(perm!=='granted'){_nudgeErr=perm==='denied'?'Notifications are blocked for this app. Allow them in your phone’s settings (Notifications → Your Garden), then tap Turn on again.':'You didn’t allow notifications — tap Turn on to try again.';refreshNudgeSettings();return;}
  setNudgePref({on:true});queueNudges();
  try{
    const sub=await pushSubscription(true),p=nudgePref();
    if(!sub)throw new Error('no subscription');
    const ok=await nudgeRpc('push_subscribe',{p_endpoint:sub.endpoint,p_tz:nudgeTz(),p_dow:p.dow,p_hour:p.hour});
    if(!ok)throw new Error('server said no');
    setNudgePref({linked:true});toast(`🔔 Lovely — your garden note comes ${NUDGE_DAYS[p.dow]} mornings`);
  }catch(e){setNudgePref({linked:false});_nudgeErr=`Couldn’t connect to the notification service (${esc(e.message||String(e))}). Check you’re online and tap Try again.`;}
  refreshNudgeSettings();
}
function refreshNudgeSettings(){if(sheetOpen()&&$('nudge-set'))openSettings();else if(_nudgeErr)toast(_nudgeErr);}
async function disableNudges(){
  setNudgePref({on:false});
  try{const sub=await pushSubscription(false);if(sub){await nudgeRpc('push_unsubscribe',{p_endpoint:sub.endpoint});await sub.unsubscribe();}}catch(e){}
  setNudgePref({linked:false});_nudgeErr='';toast('🔕 Weekly notes off');refreshNudgeSettings();
}
async function setNudgeDay(dow){
  setNudgePref({dow:+dow});const p=nudgePref();
  try{const sub=await pushSubscription(false);if(sub)await nudgeRpc('push_subscribe',{p_endpoint:sub.endpoint,p_tz:nudgeTz(),p_dow:p.dow,p_hour:p.hour});}catch(e){}
  toast(`🔔 Notes on ${NUDGE_DAYS[p.dow]} mornings`);
}
// Show this week's note now, so you can see what they look like
async function sampleNudge(){
  const n=weekNudge(true)||NUDGE_FALLBACK;
  if(pushSupported()&&Notification.permission==='granted'){const reg=await navigator.serviceWorker.ready;reg.showNotification(n.title,{body:n.body,icon:'icons/icon-192.png',badge:'icons/icon-192.png',tag:'garden-note',data:{go:n.go,id:n.id}});}
  else toast(`${n.title} — ${n.body}`);
}
const NUDGE_DAYS=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
function nudgeSettingsHtml(){
  const p=nudgePref(),perm=pushSupported()?Notification.permission:'n/a',on=p.on&&(perm==='granted'||perm==='n/a');
  const status=!on?'':!pushSupported()?'⚪ In-app only on this browser':p.linked?'🟢 On — connected':'🟠 On here, but not connected yet';
  return `<div class="fm-lbl" style="margin-top:18px">🔔 Weekly garden note</div><div id="nudge-set">
    ${on?`<div class="nudge-status">${status}</div>`:''}
    <div class="set-txt">${on?`One friendly note each <b>${NUDGE_DAYS[p.dow]}</b> morning: what’s ready, what’s worth planting.`:'One friendly note a week: what’s ready and what’s worth planting. No nagging.'}</div>
    ${_nudgeErr?`<div class="hu-row bad" style="margin-bottom:8px">${_nudgeErr}</div>`:''}
    ${on?`<select class="fm-in" style="margin-bottom:7px" onchange="setNudgeDay(this.value)">${NUDGE_DAYS.map((d,i)=>`<option value="${i}"${p.dow===i?' selected':''}>${d} morning</option>`).join('')}</select>
      ${pushSupported()&&!p.linked?`<button class="btn btn-seed btn-full" style="margin-bottom:7px" onclick="enableNudges()">🔄 Try again</button>`:''}
      <div class="btn-row"><button class="btn btn-cancel" onclick="sampleNudge()">👀 Show me one now</button><button class="btn btn-cancel" onclick="disableNudges()">🔕 Turn off</button></div>`
    :`<button class="btn btn-seed btn-full" onclick="enableNudges()">🔔 Turn on</button>`}</div>`;
}

// ── Asking: right after the first planting, never on first launch ──
const NUDGE_ASKED='gdn_nudge_asked';
function maybeAskNudges(k){
  try{if(localStorage.getItem(NUDGE_ASKED)||nudgePref().on)return;localStorage.setItem(NUDGE_ASKED,localDate());}catch(e){return;}
  setTimeout(()=>{if(sheetOpen())return;openNudgeAsk(k);},1400);
}
function openNudgeAsk(k){
  const name=k&&P[k]?plantName(k).toLowerCase():'your plants';
  showSheet(`<div class="sh-body wl"><div class="wl-e">🔔</div><div class="wl-h">Want a heads-up when your ${esc(name)} ${/s$/.test(name)?'are':'is'} ready?</div>
    <div class="wl-s">One friendly note a week — what’s ready to pick and what’s worth planting. No nagging.</div>
    <button class="btn btn-seed btn-full" style="margin-top:12px" onclick="closeSheet();enableNudges()">Yes please</button>
    <button class="link-btn" onclick="closeSheet()">Not now</button></div>`);
}
function openNudgeInstall(){
  showSheet(`<div class="sh-body wl"><div class="wl-e">📲</div><div class="wl-h">First, add Your Garden to your Home Screen</div>
    <div class="wl-s">iPhone only allows notifications for apps on your Home Screen. In Safari, tap Share → <b>Add to Home Screen</b>, open it from there, then turn notes on in ⚙️ Settings.</div>
    <button class="btn btn-seed btn-full" style="margin-top:12px" onclick="closeSheet()">Got it</button></div>`);
}
