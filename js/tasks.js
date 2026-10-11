// Tasks: one list feeds both "Needs attention" (Beds) and "This Month".
// Sources: plant alerts (ready/bolting), hand-written TASKS for the month, generated tasks
// (expected harvests, finished plants to clear, empty spots, next month's sowing), and watering.
// Item: {kind:'plant'|'task'|'auto'|'water', id, type:'urgent'|'soon'|'coming'|'rest', title, detail, cb, btn, fo}
'use strict';
const ALERT_SNOOZE_DAYS=3;
const ALERT_ST=['ready','bolting'];
let _newlyRevealed=new Set();

function getTaskState(m){return ST.taskState[m]??={done:[],revealed:[]};}
function findTask(m,id){for(const t of TASKS[m]||[]){if(t.id===id)return t;if(t.followOn?.id===id)return t.followOn;}return null;}
function openHandTasks(m){
  const ts=getTaskState(m),out=[];
  (TASKS[m]||[]).forEach(t=>{
    if(!ts.done.includes(t.id))out.push(t);
    const fo=t.followOn;if(fo&&ts.revealed.includes(fo.id)&&!ts.done.includes(fo.id))out.push({...fo,_fo:true});
  });
  return out;
}

// ── Plant alerts ── ticked alerts snooze for a few days, then return if still needed
function alertDone(k){const d=ST.alertDone[k];return!!d&&daysBetween(d,localDate())<ALERT_SNOOZE_DAYS;}
function plantAlerting(p){return ALERT_ST.some(s=>plantHas(p,s));}
function plantCleared(p){return ALERT_ST.every(s=>!plantHas(p,s)||alertDone(`${p}:${s}`));}
function plantAlertItems(){
  const out=[],seen=new Set();
  plantedCells().forEach(({bed,cell})=>{
    if(!ALERT_ST.includes(cell.s))return;const k=cell.p+':'+cell.s;if(seen.has(k)||alertDone(k))return;seen.add(k);
    const pl=P[cell.p],ready=cell.s==='ready';
    out.push({kind:'plant',id:k,type:'urgent',cb:true,
      title:ready?`🌾 ${pl.n} in ${bed.name} — ready to harvest`:`⚠️ ${pl.n} in ${bed.name} — bolting, harvest now!`,
      detail:ready?(keepsProducing(cell.p)?'Tick when you\'ve picked — it stays in the bed and keeps producing.':'Tick once harvested — it\'s marked finished, ready to clear.'):'Harvest everything now. Tick and it\'s marked finished, ready to clear.'});
  });
  return out;
}

function urgentItems(){
  const m=curMonth(),out=plantAlertItems();
  openHandTasks(m).forEach(t=>{if(t.type==='urgent'&&!t._fo&&!(t.plants||[]).some(plantAlerting))out.push({kind:'task',id:t.id,type:'urgent',cb:true,title:`📋 ${t.text}`,detail:t.detail});});
  const v=wxVerdict();
  if(v?.lv==='r')out.push({kind:'water',id:'water',type:'urgent',cb:true,title:'💧 Water the beds today',detail:v.msg.replace(/^💧 Water today — /,'')+' Tick when done.'});
  return out;
}

// ── Generated tasks ──
function groupCells(filter){
  const g=new Map();
  plantedCells().filter(filter).forEach(x=>{const k=x.bi+':'+x.cell.p;if(!g.has(k))g.set(k,{bi:x.bi,bed:x.bed,p:x.cell.p,cells:[]});g.get(k).cells.push(x);});
  return[...g.values()];
}
function autoItems(m){
  const td=localDate(),out=[];
  const covered=new Set(openHandTasks(m).flatMap(t=>t.plants||[]));
  groupCells(x=>x.cell.s==='done').forEach(g=>{
    const nx=P[g.p].nx;
    out.push({kind:'auto',id:`clear:${g.bi}:${g.p}`,type:'soon',cb:true,
      title:`Clear the finished ${P[g.p].n} from ${g.bed.name}`,
      detail:`Pull ${g.cells.length>1?'them':'it'} out roots and all. ${nx?`${P[nx].n} is a good follow-on.`:'Top up with compost before replanting.'} Tick to clear the ${g.cells.length>1?'spots':'spot'}.`});
  });
  groupCells(x=>overdueOneOff(x.cell)).forEach(g=>{
    if(covered.has(g.p))return;
    const exp=g.cells.map(x=>expectedDate(x.cell)).sort()[0];
    out.push({kind:'auto',id:`ready:${g.bi}:${g.p}`,type:'soon',cb:true,
      title:`Check ${P[g.p].n} in ${g.bed.name} — should be ready`,
      detail:`Expected around ${fmtDate(exp)}. Tick when it's ready and it moves to your harvest list.`});
  });
  groupCells(x=>['seed','seedling','growing'].includes(x.cell.s)&&!COMPANIONS.includes(x.cell.p)).forEach(g=>{
    if(covered.has(g.p))return;
    const exp=g.cells.map(x=>expectedDate(x.cell)).filter(Boolean).sort()[0];if(!exp)return;
    const due=daysBetween(td,exp);
    if(due>0&&due<=21)out.push({kind:'auto',id:`soon:${g.bi}:${g.p}`,type:'coming',cb:false,icon:P[g.p].e,
      title:`${P[g.p].n} in ${g.bed.name} — ready around ${fmtDate(exp)}`,detail:P[g.p].tip});
  });
  ST.beds.forEach((bed,bi)=>{
    const n=emptyCells(bi).length;if(!n)return;
    const sug=suggestForBed(bi).map(s=>P[s.k].n);
    out.push({kind:'auto',id:`fill:${bi}`,type:'soon',cb:false,icon:'🌱',
      title:`Fill ${plural(n,'empty spot')} in ${bed.name}`,
      detail:sug.length?`Good fits right now: ${sug.join(', ')}.`:'Nothing in season suits this bed right now.',
      btn:{label:'Plant ›',js:`goToEmpty(${bi})`}});
  });
  const nm=(m+1)%12;
  const opening=[...COOL_VEG,...WARM_VEG].filter(k=>!P[k].custom&&inSeason(k,nm)&&!inSeason(k,m));
  if(opening.length)out.push({kind:'auto',id:'next-month',type:'coming',cb:false,icon:'📆',
    title:`From ${MONTHS[nm]} you can start sowing`,detail:opening.slice(0,8).map(k=>P[k].n).join(', ')+'.'});
  return out;
}

// ── Ticking ──
function tickItem(kind,id,btn){
  tickAway(btn,()=>{
    const m=curMonth();let msg='✓ Done',undoable=false;
    if(kind==='plant'){snapshot();undoable=true;msg=harvestFromAlert(id,m);}
    else if(kind==='task'){markTaskDone(m,id);msg='✓ Done';}
    else if(kind==='water'){logWatered();return;}
    else if(kind==='auto'){snapshot();undoable=true;msg=runAuto(id);}
    saveState();refreshAll();toast(msg,{undo:undoable});
  });
}
// Ticking a ready/bolting alert = a harvest. Repeat croppers stay put; one-off and bolting crops become "finished".
function harvestFromAlert(k,m){
  const[p,s]=k.split(':');const finish=s==='bolting'||!keepsProducing(p);
  const beds=new Set();
  plantedCells().filter(x=>x.cell.p===p&&x.cell.s===s).forEach(x=>{x.cell.picks++;if(finish)x.cell.s='done';beds.add(x.bi);});
  beds.forEach(bi=>logHarvest(p,bi,finish));
  ST.alertDone[k]=localDate();
  const closed=openHandTasks(m).filter(t=>(t.plants||[]).includes(p)&&t.plants.every(plantCleared));
  closed.forEach(t=>markTaskDone(m,t.id));
  if(closed.length)return`✓ Ticked off “${closed[0].text}”`;
  return finish?`🧺 Harvested ${plantName(p)} — marked finished`:`🧺 Logged a pick of ${plantName(p)}`;
}
function runAuto(id){
  const[type,bi,p]=id.split(':');
  const cells=plantedCells().filter(x=>x.bi===+bi&&x.cell.p===p);
  if(type==='clear'){cells.filter(x=>x.cell.s==='done').forEach(x=>clearCell(x.bi,x.ri,x.ci));const nx=P[p].nx;return nx?`Cleared — try ${plantName(nx)} next`:'Cleared — spot ready to replant';}
  if(type==='ready'){cells.forEach(x=>{if(['seed','seedling','growing'].includes(x.cell.s))x.cell.s='ready';});return`✨ ${plantName(p)} marked ready`;}
  return'✓ Done';
}
// Shared by This Month checkboxes and Needs attention ticks; also snoozes the plant alerts the task covers.
function markTaskDone(m,id){
  const task=findTask(m,id);if(!task)return null;
  const ts=getTaskState(m);
  if(!ts.done.includes(id))ts.done.push(id);
  if(task.followOn&&!ts.revealed.includes(task.followOn.id)){ts.revealed.push(task.followOn.id);_newlyRevealed.add(task.followOn.id);}
  (task.plants||[]).forEach(p=>ALERT_ST.forEach(s=>{if(plantHas(p,s))ST.alertDone[`${p}:${s}`]=localDate();}));
  saveState();return task;
}

// ── Rendering ──
function renderAlerts(){
  const all=urgentItems(),al=all.filter(a=>a.kind!=='water');
  const pill=$('alert-pill');pill.textContent=all.length+' urgent';pill.style.display=all.length?'inline-block':'none';
  $('alerts-wrap').innerHTML=al.length?`<div class="alerts"><div class="alerts-hdr">⚡ Needs attention</div>${al.map(a=>`<div class="alert-row"><button class="al-cb" aria-label="Mark done" onclick="tickItem('${a.kind}','${a.id}',this)">✓</button><div>${a.title}</div></div>`).join('')}</div>`:'';
}
function goToAlerts(){setView(curView==='beds'?'beds':'month');}

function cardHtml(it){
  const cls=['task-card',{urgent:'tc-urgent',soon:'tc-soon',rest:'tc-rest'}[it.type]||'',it.fo?'tc-followon':'',_newlyRevealed.has(it.id)?'appearing':''].join(' ');
  const lead=it.cb?`<button class="task-cb-area" aria-label="Mark done" onclick="tickItem('${it.kind}','${it.id}',this)"><div class="task-cb">○</div></button>`:`<div class="task-cb-area"><div class="task-ico">${it.icon||'•'}</div></div>`;
  return `<div class="${cls}">${lead}<div class="task-content"><div class="task-title">${it.fo?'↪ ':''}${it.title}</div><div class="task-detail">${it.detail||''}</div>${it.btn?`<button class="task-btn" onclick="${it.btn.js}">${it.btn.label}</button>`:''}</div></div>`;
}
function monthIntro(m){
  if(MONTH_INTRO[m])return MONTH_INTRO[m];
  const n=plantedCells().length,ready=plantedCells().filter(x=>x.cell.s==='ready').length;
  const sow=[...COOL_VEG,...WARM_VEG].filter(k=>!P[k].custom&&inSeason(k,m)).slice(0,5).map(k=>P[k].n);
  return `${plural(n,'plant')} in the ground${ready?`, ${ready} ready to pick`:''}.${sow.length?` In season to sow now: ${sow.join(', ')}.`:''}`;
}
function renderMonthly(){
  const m=curMonth();
  const hand=openHandTasks(m).map(t=>({kind:'task',id:t.id,type:t._fo&&t.type!=='rest'?'soon':t.type,cb:true,title:t.text,detail:t.detail,fo:t._fo}));
  const auto=autoItems(m);
  const urgent=urgentItems();
  const by=type=>[...hand.filter(t=>t.type===type&&type!=='urgent'),...auto.filter(t=>t.type===type)];
  const sec=(lbl,ts)=>ts.length?`<div class="task-section"><div class="task-sec-title">${lbl}</div>${ts.map(cardHtml).join('')}</div>`:'';
  const tasksHtml=[sec('🔴 Do this week',urgent),sec('🟡 This month',by('soon')),sec('🟢 Coming up',by('coming')),sec('🌿 Rest',by('rest'))].join('')
    ||`<div class="all-done">All done for ${MONTHS[m]} 🌿<br><span>The garden is doing its thing.</span></div>`;
  const td=localDate();
  const recapHtml=ST.beds.map((bed,bi)=>{
    const rows=[],seen=new Set();
    plantedCells().filter(x=>x.bi===bi).forEach(({cell})=>{
      const k=cell.p+':'+cell.s;if(seen.has(k))return;seen.add(k);
      const pl=P[cell.p];
      const hw={ready:'harvest now',bolting:'harvest now!',done:'clear when ready'}[cell.s]||readyLabel(cell);
      rows.push(`<div class="recap-row"><div class="recap-ico">${pl.e}</div><div><div class="recap-nm">${pl.n}</div><div class="recap-st">${STLBL[cell.s]}</div></div><div class="recap-hw">${hw}</div></div>`);
    });
    const e=emptyCells(bi).length;
    if(e)rows.push(`<div class="recap-row"><div class="recap-ico">▫️</div><div><div class="recap-nm">${plural(e,'empty spot')}</div><div class="recap-st">available to plant</div></div></div>`);
    return `<div class="recap-block"><div class="recap-hdr rh${bi%3+1}">${bed.name}</div>${rows.join('')}</div>`;
  }).join('');
  $('month-content').innerHTML=`<div class="mv-heading">${MONTHS[m]}</div><div class="mv-intro">${monthIntro(m)}</div><div class="mv-section"><div class="mv-st">📋 Tasks</div>${tasksHtml}</div><div class="mv-section"><div class="mv-st">🌱 What's in the beds</div>${recapHtml}</div>`;
  _newlyRevealed.clear();
}
