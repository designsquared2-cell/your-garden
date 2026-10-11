// Shared UI: bottom sheet, toast (with optional Undo), confetti, navigation.
'use strict';
const $=id=>document.getElementById(id);

function showSheet(html){if(html!=null)$('sh-content').innerHTML=html;$('overlay').classList.add('on');$('sheet').classList.add('on');$('sheet').scrollTop=0;}
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

let curView='beds';
function setView(name){
  curView=name;
  document.querySelectorAll('.view').forEach(v=>v.classList.toggle('on',v.id==='view-'+name));
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active',b.dataset.view===name));
  renderView();window.scrollTo(0,0);
}
function renderView(){({jobs:renderJobs,month:renderMonthly,plants:renderPlants})[curView]?.();}
// Re-render everything that depends on state
function refreshAll(){renderBeds();renderWeather();renderAlerts();renderView();}
function updateHeader(){const d=new Date();$('hdr-sub').textContent=`${MONTHS[d.getMonth()]} ${d.getFullYear()} · saved on this device`;}
