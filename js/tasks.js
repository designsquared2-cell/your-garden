// Tasks: one list feeds the Jobs tab, the header urgent pill and the Jobs badge.
// Everything is generated from the beds, plant timing and weather, so it works in any month for any garden:
// plant alerts (ready/bolting), watering, finished plants to clear, one-off crops due, empty spots, upcoming harvests, next month's sowing.
// Item: {kind:'plant'|'auto'|'water', id, type:'urgent'|'soon'|'coming', title, detail, cb, btn, icon}
'use strict';
const ALERT_SNOOZE_DAYS=3;
const ALERT_ST=['ready','bolting'];

// ── Plant alerts ── ticked alerts snooze for a few days, then return if still needed
function alertDone(k){const d=ST.alertDone[k];return!!d&&daysBetween(d,localDate())<ALERT_SNOOZE_DAYS;}
function plantAlertItems(){
  const out=[],seen=new Set();
  plantedCells().forEach(({bed,cell})=>{
    if(!ALERT_ST.includes(cell.s)||COMPANIONS.includes(cell.p))return;const k=cell.p+':'+cell.s;if(seen.has(k)||alertDone(k))return;seen.add(k);
    const pl=P[cell.p],ready=cell.s==='ready';
    out.push({kind:'plant',id:k,type:'urgent',cb:true,
      title:ready?`🌾 ${pl.n} in ${esc(bed.name)} — ready to harvest`:`⚠️ ${pl.n} in ${esc(bed.name)} — bolting, harvest now!`,
      detail:ready?(isLifted(cell.p)?'Tick once you\'ve pulled them — the spots are freed up to replant.':cellKeepsProducing(cell)?'Tick when you\'ve picked some — it keeps producing.':'Tick once harvested — it\'s completed, ready to pull out.'):isLifted(cell.p)?'Pull them all now. Tick and the spots are freed up to replant.':'Harvest everything now. Tick and it\'s completed, ready to pull out.'});
  });
  return out;
}
function urgentItems(){
  const out=[...plantAlertItems(),...treatItems()],v=wxVerdict();
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
  groupCells(x=>x.cell.s==='done').forEach(g=>{
    const nx=P[g.p].nx,many=g.cells.length>1;
    out.push({kind:'auto',id:`clear:${g.bi}:${g.p}`,type:'soon',cb:true,
      title:`Pull out the completed ${P[g.p].n} in ${esc(g.bed.name)}`,
      detail:`Pull ${many?'them':'it'} out roots and all. ${nx?`${P[nx].n} is a good follow-on.`:'Top up with compost before replanting.'} Tick to clear the ${many?'spots':'spot'}.`});
  });
  groupCells(x=>overdueOneOff(x.cell)).forEach(g=>{
    const exp=g.cells.map(x=>expectedDate(x.cell)).sort()[0],late=daysBetween(exp,td);
    if(late<=LATE_DAYS){
      out.push({kind:'auto',id:`ready:${g.bi}:${g.p}`,type:'soon',cb:true,
        title:`Check ${P[g.p].n} in ${esc(g.bed.name)} — should be ready`,
        detail:`Expected around ${fmtDate(exp)}. Tick when it's ready and it moves to your harvest list.`});
      return;
    }
    const id=`late:${g.bi}:${g.p}`;if(lateChecked(id))return;
    const why=lateCauses(g.p),planted=g.cells.map(x=>x.cell.d).filter(Boolean).sort()[0];
    out.push({kind:'auto',id,type:'soon',cb:true,icon:'🤔',
      title:`🤔 ${P[g.p].n} in ${esc(g.bed.name)} is running late`,
      detail:`${planted?`${daysBetween(planted,td)} days in — `:''}expected around ${fmtDate(exp)}.${why.length?` Most likely: ${why.map(p=>p.n.toLowerCase()).join(' or ')}.`:''} Tick if you've checked it — we'll ask again in 2 weeks.`,
      btn:{label:'What\'s wrong? ›',js:`openGrowing('${g.p}',true)`}});
  });
  ST.beds.forEach((bed,bi)=>{
    const n=emptyCells(bi).length;if(!n)return;
    const sug=suggestForBed(bi).map(s=>P[s.k].n);
    out.push({kind:'auto',id:`fill:${bi}`,type:'soon',cb:false,icon:'🌱',
      title:`Fill ${plural(n,'empty spot')} in ${esc(bed.name)}`,
      detail:sug.length?`Good fits right now: ${sug.join(', ')}.`:'Nothing in season suits this bed right now.',
      btn:{label:'Plant ›',js:`goToEmpty(${bi})`}});
  });
  groupCells(x=>['seed','seedling','growing'].includes(x.cell.s)&&!COMPANIONS.includes(x.cell.p)).forEach(g=>{
    const exp=g.cells.map(x=>expectedDate(x.cell)).filter(Boolean).sort()[0];if(!exp)return;
    const due=daysBetween(td,exp);
    if(due>0&&due<=21)out.push({kind:'auto',id:`soon:${g.bi}:${g.p}`,type:'coming',cb:false,icon:P[g.p].e,
      title:`${P[g.p].n} in ${esc(g.bed.name)} — ready around ${fmtDate(exp)}`,detail:P[g.p].tip});
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
    if(kind==='water'){snapshot();logWatered(true);toast('💧 Watering logged',{undo:true});return;}
    snapshot();
    const msg=kind==='plant'?harvestFromAlert(id):kind==='pest'?tickPest(id):kind==='treat'?tickTreat(id):kind==='guard'?tickGuard(id):runAuto(id);
    saveState();refreshAll();toast(msg,{undo:true});
  });
}
// Ticking a ready/bolting alert = a harvest. Repeat croppers stay put; one-off and bolting crops become "finished".
function harvestFromAlert(k){
  const[p,s]=k.split(':');
  const xs=plantedCells().filter(x=>x.cell.p===p&&x.cell.s===s);
  return doHarvest(xs,s==='bolting'||!xs.every(x=>cellKeepsProducing(x.cell)));
}
// Running late: more than LATE_DAYS past the expected date. Ticking snoozes it for LATE_SNOOZE days.
const LATE_DAYS=21,LATE_SNOOZE=14;
function lateChecked(id){const d=ST.pestDone[id];return!!d&&daysBetween(d,localDate())<LATE_SNOOZE;}
// "Not producing" problems that apply to this plant, most specific first
function lateCauses(k){return DISORDERS.filter(d=>d.late&&pestOnPlant(d,k)&&!d.on.includes('*')).slice(0,2);}
function runAuto(id){
  const[type,bi,p]=id.split(':');
  const cells=plantedCells().filter(x=>x.bi===+bi&&x.cell.p===p);
  if(type==='clear'){cells.filter(x=>x.cell.s==='done').forEach(x=>clearCell(x.bi,x.ri,x.ci));const nx=P[p].nx;return nx?`Cleared — try ${plantName(nx)} next`:'Cleared — spot ready to replant';}
  if(type==='late'){ST.pestDone[id]=localDate();return`👍 Checked — we'll look again in ${LATE_SNOOZE} days`;}
  if(type==='ready'){cells.forEach(x=>{if(['seed','seedling','growing'].includes(x.cell.s))x.cell.s='ready';});return`✨ ${plantName(p)} marked ready`;}
  return'✓ Done';
}

// ── Rendering ──
// Urgent count on the header pill and the Jobs tab badge (the jobs themselves live only in Jobs)
function renderAlerts(){
  const n=urgentItems().length;
  const pill=$('alert-pill');pill.textContent=n+' urgent';pill.style.display=n?'inline-block':'none';
  const badge=$('jobs-badge');badge.textContent=n;badge.hidden=!n;
}
function goToAlerts(){setView('jobs');}

function cardHtml(it){
  const cls=['task-card',{urgent:'tc-urgent',soon:'tc-soon',pest:'tc-pest',guard:'tc-guard'}[it.type]||''].join(' ');
  const lead=it.cb?`<button class="task-cb-area" aria-label="Mark done" onclick="tickItem('${it.kind}','${it.id}',this)"><div class="task-cb">○</div></button>`:`<div class="task-cb-area"><div class="task-ico">${it.icon||'•'}</div></div>`;
  return `<div class="${cls}">${lead}<div class="task-content"><div class="task-title">${it.title}</div><div class="task-detail">${it.detail||''}</div>${it.btn?`<button class="task-btn" onclick="${it.btn.js}">${it.btn.label}</button>`:''}</div></div>`;
}
// Jobs tab: everything to do, grouped by urgency
function jobSections(){
  const m=curMonth(),auto=autoItems(m);
  const g=guardItems(m),now=g.filter(x=>x.id==='snails-rain');
  return[['🔴 Do this week',[...urgentItems(),...now]],['🐛 Pest checks',pestCheckItems(m)],['🟡 This month',[...g.filter(x=>!now.includes(x)),...auto.filter(t=>t.type==='soon')]],['🟢 Coming up',auto.filter(t=>t.type==='coming')]];
}
function jobCount(){const[[,u],[,p],[,s]]=jobSections();return u.length+p.length+s.filter(t=>t.cb).length;}
function renderJobs(){
  const m=curMonth(),secs=jobSections();
  const body=secs.map(([lbl,ts])=>ts.length?`<div class="task-section"><div class="task-sec-title">${lbl}</div>${ts.map(cardHtml).join('')}</div>`:'').join('')
    ||(ST.beds.length?`<div class="all-done">All done for now 🐝<br><span>The garden is doing its thing.</span></div>`
      :cardHtml({type:'soon',icon:'🌱',title:'Add your first bed',detail:'Jobs, harvest dates, pest checks and watering advice appear here once you start planting.',btn:{label:'＋ Add a bed',js:"setView('beds');openBedEditor()"}}));
  const n=jobCount();
  $('jobs-content').innerHTML=`<div class="mv-heading">Jobs to do</div><div class="mv-intro">${n?`${plural(n,'job')} for ${MONTHS[m]}. Tick them off as you go.`:'Nothing needs doing right now.'}</div>${weatherCardHtml()}${body}`;
}
