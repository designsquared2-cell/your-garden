// Shared UI: bottom sheet, toast (with optional Undo), confetti, navigation.
'use strict';
const $=id=>document.getElementById(id);

function showSheet(html){if(html!=null)$('sh-content').innerHTML=html;$('overlay').classList.add('on');$('sheet').classList.add('on');$('sheet').scrollTop=0;}
// First sentence of a longer text, for short summaries
function firstSentence(s){s=s||'';const i=s.search(/[.!?](\s|$)/);return i<0?s:s.slice(0,i+1);}
function moreFold(html,label='More ›'){return html?`<details class="task-more"><summary>${label}</summary><div class="task-detail">${html}</div></details>`:'';}
function closeSheet(){$('overlay').classList.remove('on');$('sheet').classList.remove('on');}
function sheetOpen(){return $('sheet').classList.contains('on');}

let _tt;
function toast(msg,opts={}){
  const el=$('toast');el.textContent=msg;
  if(opts.undo){const b=document.createElement('button');b.className='toast-undo';b.textContent='Undo';b.onclick=undo;el.appendChild(b);}
  el.classList.toggle('act',!!opts.undo);el.classList.add('on');
  clearTimeout(_tt);_tt=setTimeout(()=>el.classList.remove('on','act'),opts.undo?5000:2600);
}

function confettiAt(cx,cy,n=16,spread=100){
  const wrap=$('confetti');const cols=['#FFD54F','#8BAA6B','#B85C38','#FF8C42','#F0E6CC','#7AD47A'];
  for(let i=0;i<n;i++){
    const el=document.createElement('div');el.className='cp';const sz=5+Math.random()*5;
    el.style.cssText=`left:${cx+(Math.random()-.5)*spread}px;top:${cy-10+(Math.random()-.5)*20}px;background:${cols[i%cols.length]};width:${sz}px;height:${sz}px;animation-delay:${Math.random()*.1}s;animation-duration:${.7+Math.random()*.5}s;`;
    wrap.appendChild(el);setTimeout(()=>el.remove(),1500);
  }
}
function celebrate(){confettiAt(innerWidth/2,innerHeight*.35,26,260);}
// Slide a ticked row away, then run fn
function tickAway(btn,fn){
  const r=btn.getBoundingClientRect();confettiAt(r.left+r.width/2,r.top+r.height/2);
  btn.closest('.alert-row,.task-card')?.classList.add('completing');
  setTimeout(fn,350);
}

// ── Where you were ── phones often unload a backgrounded page (e.g. while you look at photos in another
// tab) and reload it when you come back. Remember the tab, Problems finder answers and scroll position so
// a reload puts you back in the same place. Kept for an hour.
const UI_K='gdn_ui',UI_KEEP_MS=3600e3;
function saveUI(){
  try{localStorage.setItem(UI_K,JSON.stringify({t:Date.now(),v:curView,y:scrollY,pt:_pTab,ia:_idArea,is:[..._idSel],ip:_idPlant,
    open:[...document.querySelectorAll('.view.on details[open][id]')].map(d=>d.id)}));}catch(e){}
}
function restoreUI(){
  let u=null;try{u=JSON.parse(localStorage.getItem(UI_K));}catch(e){}
  if(!u||Date.now()-u.t>UI_KEEP_MS)return;
  _pTab=u.pt||'id';_idArea=u.ia||null;_idSel=new Set(u.is||[]);_idPlant=u.ip||null;
  setView(u.v||'beds');
  (u.open||[]).forEach(id=>{const d=$(id);if(d)d.open=true;});
  requestAnimationFrame(()=>window.scrollTo(0,u.y||0));
}
// Open links (photos, recipes) in a separate tab so the app stays where it is
function openLink(e,a){e.preventDefault();saveUI();window.open(a.href,'_blank','noopener');return false;}
// Re-render a container without collapsing the <details> the user had open
function keepOpen(el,render){const open=[...el.querySelectorAll('details[open][id]')].map(d=>d.id);render();open.forEach(id=>{const d=$(id);if(d)d.open=true;});}

let curView='beds';
function setView(name){
  curView=name;if(typeof _allJobs!=='undefined')_allJobs=false;
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id==='view-'+name));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  renderView();window.scrollTo(0,0);saveUI();
}
// Each tab has one job: Beds = summary + layout, Jobs = everything to do, Harvest = what's ready & what it's worth,
// Plants = plant information, Pests = identifying and learning about pests.
function renderView(){({jobs:renderJobs,harvest:renderHarvest,plants:renderPlants,pests:renderPests})[curView]?.();}
// Re-render everything that depends on state
function refreshAll(){advanceStatuses();if(typeof syncTrees==='function')syncTrees();renderBeds();renderSummary();renderAlerts();renderView();}
function updateHeader(){const d=new Date();$('hdr-sub').textContent=`${MONTHS[d.getMonth()]} ${d.getFullYear()} · ${typeof syncLabel==='function'?syncLabel():'saved on this device'}`;}
