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
    if(isTree(cell.p)||pickingOver(cell))return; // trees have their own reminder; spent plants get "probably finished"
    if(!ALERT_ST.includes(cell.s)||COMPANIONS.includes(cell.p))return;const k=cell.p+':'+cell.s;if(seen.has(k)||alertDone(k))return;seen.add(k);
    const pl=P[cell.p],ready=cell.s==='ready';
    out.push({kind:'plant',id:k,type:'urgent',cb:true,
      title:ready?`🌾 Pick ${pl.n.toLowerCase()} · ${esc(bed.name)}`:`⚠️ ${pl.n} bolting · ${esc(bed.name)}`,
      detail:ready?(isLifted(cell.p)?'Tick once you\'ve pulled them — the spots are freed up to replant.':cellKeepsProducing(cell)?'Tick when you\'ve picked some — it keeps producing.':'Tick once harvested — it\'s completed, ready to pull out.'):isLifted(cell.p)?'Pull them all now. Tick and the spots are freed up to replant.':'Harvest everything now. Tick and it\'s completed, ready to pull out.'});
  });
  return out;
}
// Tender plants: warm-season and heat-loving crops, and young frost-tender fruit trees
function frostTender(){return plantedCells().filter(x=>x.cell.s!=='done'&&(isTree(x.cell.p)?FRUIT[x.cell.p].frost&&treeYears(x.cell)<3:WARM_VEG.includes(x.cell.p)||HEAT_LOVERS.includes(x.cell.p)));}
function frostItem(){
  const f=frostRisk();if(!f)return null;const id='frost:'+f.date;if(ST.alertDone[id])return null;
  const xs=frostTender();if(!xs.length)return null;
  return{kind:'frost',id,type:'urgent',cb:true,title:`❄️ Frost ${f.when} (${f.min}°)`,short:`Cover your ${plantList(xs,4)} this afternoon.`,
    detail:`Cover them with frost cloth or an old sheet over stakes (not plastic, and not touching the leaves), and water the soil — damp soil holds more warmth. Tick once they’re covered. <span class="task-where">${bedList(xs)}</span>`};
}
function urgentItems(){
  const out=[...plantAlertItems(),...treatItems()],v=wxVerdict(),fr=frostItem();
  if(fr)out.push(fr);
  if(v?.lv==='r'&&(maint()!=='none'||v.urgent)){
    // beds on drip or a timer don't need hand watering; in a heatwave, just check the system is running
    const veg=ST.beds.filter(b=>!isTreeBed(b)),hand=veg.filter(b=>!b.auto),auto=veg.filter(b=>b.auto),pots=hand.some(b=>b.pots);
    const why=v.msg.replace(/^💧 Water today — /,'');
    if(hand.length||!veg.length)out.push({kind:'water',id:'water',type:'urgent',cb:true,title:auto.length?`💧 Water ${hand.map(b=>esc(b.name)).join(', ')} today`:'💧 Water the beds today',
      detail:`${why}${pots?' Pots dry out fastest — soak them until water runs out the bottom.':''}${auto.length?` ${auto.map(b=>esc(b.name)).join(', ')} ${auto.length>1?'are':'is'} on drip — just check it’s running.`:''} Tick when done.`});
    else if(v.urgent)out.push({kind:'water',id:'water',type:'urgent',cb:true,title:'🕒 Hot and dry — check your watering timer',detail:`${why} Your beds water themselves; make sure the timer is on and the drippers aren’t blocked, and consider an extra run today. Tick once checked.`});
  }
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
      title:`Pull out ${P[g.p].n.toLowerCase()} · ${esc(g.bed.name)}`,
      detail:`Pull ${many?'them':'it'} out roots and all. ${nx?`${P[nx].n} is a good follow-on.`:'Top up with compost before replanting.'} Tick to clear the ${many?'spots':'spot'}.`});
  });
  groupCells(x=>x.cell.s!=='done'&&pickingOver(x.cell)).forEach(g=>{
    const wk=PICK_WEEKS[g.p]??16,many=g.cells.length>1;
    out.push({kind:'auto',id:`spent:${g.bi}:${g.p}`,type:'soon',cb:true,icon:'🍂',
      title:`🍂 ${P[g.p].n} finished? · ${esc(g.bed.name)}`,short:`Pull ${many?'them':'it'} out once ${many?'they stop':'it stops'} cropping.`,
      detail:`${many?'They’ve':'It’s'} been cropping for about ${wk} weeks — most plants are spent by now. Pull ${many?'them':'it'} out once ${many?'they stop':'it stops'} producing, and tick to clear the ${many?'spots':'spot'}. Still going strong? Leave this for now.`});
  });
  groupCells(x=>overdueOneOff(x.cell)).forEach(g=>{
    const exp=g.cells.map(x=>expectedDate(x.cell)).sort()[0],late=daysBetween(exp,td);
    if(late<=LATE_DAYS){
      out.push({kind:'auto',id:`ready:${g.bi}:${g.p}`,type:'soon',cb:true,
        title:`Check ${P[g.p].n.toLowerCase()} · ${esc(g.bed.name)}`,
        detail:`Due around ${fmtDate(exp)}.`});
      return;
    }
    const id=`late:${g.bi}:${g.p}`;if(lateChecked(id))return;
    const why=lateCauses(g.p),planted=g.cells.map(x=>x.cell.d).filter(Boolean).sort()[0];
    out.push({kind:'auto',id,type:'soon',cb:true,icon:'🤔',
      title:`🤔 ${P[g.p].n} running late · ${esc(g.bed.name)}`,
      detail:`${planted?`${daysBetween(planted,td)} days in — `:''}expected around ${fmtDate(exp)}.${why.length?` Most likely: ${why.map(p=>p.n.toLowerCase()).join(' or ')}.`:''} Tick if you've checked it — we'll ask again in 2 weeks.`,
      btn:{label:'What\'s wrong? ›',js:`openGrowing('${g.p}',true)`}});
  });
  ST.beds.forEach((bed,bi)=>{
    const n=emptyCells(bi).length;if(!n)return;
    const rest=ST.alertDone['rest:'+bed.id];if(rest&&daysBetween(rest,td)<REST_DAYS)return;
    const sug=suggestForBed(bi).map(s=>P[s.k].n);
    out.push({kind:'auto',id:`fill:${bi}`,type:'soon',cb:true,icon:'🌱',
      title:`Fill ${plural(n,'empty spot')} · ${esc(bed.name)}`,short:sug.length?`Try ${sug.join(', ')}.`:'Nothing in season suits it now.',
      detail:`Not planting? Tick to rest it for ${REST_DAYS/7} weeks — mulch it, or sow a green manure like broad beans or mustard.`,
      btn:{label:'Plant ›',js:`goToEmpty(${bi})`}});
  });
  groupCells(x=>['seed','seedling','growing'].includes(x.cell.s)&&!COMPANIONS.includes(x.cell.p)).forEach(g=>{
    const exp=g.cells.map(x=>expectedDate(x.cell)).filter(Boolean).sort()[0];if(!exp)return;
    const due=daysBetween(td,exp);
    if(due>0&&due<=21)out.push({kind:'auto',id:`soon:${g.bi}:${g.p}`,type:'coming',cb:false,icon:P[g.p].e,
      title:`${P[g.p].n} · ${esc(g.bed.name)}: ready ~${fmtDate(exp)}`,short:'',detail:P[g.p].tip});
  });
  const nm=(m+1)%12;
  const opening=[...COOL_VEG,...WARM_VEG].filter(k=>!P[k].custom&&inSeason(k,nm)&&!inSeason(k,m));
  if(opening.length)out.push({kind:'auto',id:'next-month',type:'coming',cb:false,icon:'📆',
    title:`Sow from ${MONTHS[nm]}`,detail:opening.slice(0,8).map(k=>P[k].n).join(', ')+'.'});
  const fruit=FRUIT_KEYS.filter(k=>!treeBadHere(k)&&inSeason(k,nm)&&!inSeason(k,m));
  if(fruit.length){const bare=fruit.filter(k=>FRUIT[k].dec).length>fruit.length/2;
    out.push({kind:'auto',id:'fruit-season',type:'coming',cb:false,icon:'🌳',
      title:bare?`Bare-root season from ${MONTHS[nm]}`:`Plant fruit from ${MONTHS[nm]}`,
      detail:`${fruit.map(k=>P[k].n).join(', ')}.${bare?' Bare-root trees are cheapest and settle in before spring.':''}`,
      btn:{label:'See fruit ›',js:"setView('beds');openTreePicker()"}});}
  out.push(...seedItems(m));
  return out;
}

// ── Ticking ──
function tickItem(kind,id,btn){
  tickAway(btn,()=>{
    if(kind==='water'){snapshot();logWatered(true);toast('💧 Watering logged',{undo:true});return;}
    snapshot();
    if(kind==='frost'){ST.alertDone[id]=localDate();saveState();refreshAll();toast('❄️ Covered — fingers crossed for a mild night',{undo:true});return;}
    const msg=kind==='plant'?harvestFromAlert(id):kind==='pest'?tickPest(id):kind==='treat'?tickTreat(id):kind==='guard'?tickGuard(id):kind==='tree'?tickTree(id):kind==='feed'?tickFeed(id):kind==='project'?tickProject(id):kind==='fold'?tickFold(id):runAuto(id);
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
const LATE_DAYS=21,LATE_SNOOZE=14,REST_DAYS=42;
function lateChecked(id){const d=ST.pestDone[id];return!!d&&daysBetween(d,localDate())<LATE_SNOOZE;}
// "Not producing" problems that apply to this plant, most specific first
function lateCauses(k){return DISORDERS.filter(d=>d.late&&pestOnPlant(d,k)&&!d.on.includes('*')).slice(0,2);}
function runAuto(id){
  const[type,bi,p]=id.split(':');
  const cells=plantedCells().filter(x=>x.bi===+bi&&x.cell.p===p);
  if(type==='fill'){ST.alertDone['rest:'+ST.beds[+bi].id]=localDate();return`😴 ${ST.beds[+bi].name} is resting — we’ll remind you in ${REST_DAYS/7} weeks`;}
  if(type==='spent'){cells.forEach(x=>clearCell(x.bi,x.ri,x.ci));const nx=P[p].nx;return`🧹 Cleared — ${nx?`try ${plantName(nx)} next`:'spot ready to replant'}`;}
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

// Short line under the title; everything else folds under "How ›". "Tick when…" lines go — the tick box says it.
function splitDetail(it){
  let where='',d=(it.detail||'').replace(/\s*Tick (?:when|once|if|to clear)[^.]*\./g,'')
    .replace(/<span class="task-where">[\s\S]*?<\/span>/,m=>{where=m;return'';}).trim();
  if(it.short!=null)return{short:it.short,more:d,where};
  const i=d.search(/[.!?](\s|$)/),tag=d.indexOf('<');
  if(i<0)return d.length<90&&tag<0?{short:d,more:'',where}:{short:'',more:d,where};
  if(tag>=0&&tag<i)return{short:'',more:d,where};
  return{short:d.slice(0,i+1),more:d.slice(i+1).trim(),where};
}
function cardHtml(it){
  const cls=['task-card',{urgent:'tc-urgent',soon:'tc-soon',pest:'tc-pest',guard:'tc-guard'}[it.type]||''].join(' ');
  const lead=it.cb?`<button class="task-cb-area" aria-label="Mark done" onclick="tickItem('${it.kind}','${it.id}',this)"><div class="task-cb">○</div></button>`:`<div class="task-cb-area"><div class="task-ico">${it.icon||'•'}</div></div>`;
  const{short,more,where}=splitDetail(it);
  return `<div class="${cls}">${lead}<div class="task-content"><div class="task-title">${it.title}</div>${short?`<div class="task-detail">${short}</div>`:''}${where}${more?`<details class="task-more"><summary>How ›</summary><div class="task-detail">${more}</div></details>`:''}${it.btn?`<button class="task-btn" onclick="${it.btn.js}">${it.btn.label}</button>`:''}</div></div>`;
}
// Jobs tab: everything to do, grouped by urgency. How much shows depends on the maintenance level (Settings):
//   none: only what's ready to pick, and watering in a heatwave
//   low:  harvesting, clearing, planting, watering, a spring & autumn feed and the yearly prune — no pest jobs
//   std:  everything
// Three or more "ready to pick" reminders become one card
function foldHarvest(items){
  const r=items.filter(t=>(t.kind==='plant'&&t.id.endsWith(':ready'))||(t.kind==='tree'&&t.id.startsWith('tree:')));
  if(r.length<3)return items;
  const names=r.map(t=>t.kind==='plant'?P[t.id.split(':')[0]]?.n:ST.beds.find(b=>'tree:'+b.id===t.id)?.name).filter(Boolean);
  return[{kind:'fold',id:r.map(t=>t.kind+'|'+t.id).join(','),type:'urgent',cb:true,icon:'🧺',title:`🧺 ${r.length} ready to pick`,
    detail:`${names.map(esc).join(', ')}. Tick once you’ve picked them all, or open Harvest to log each one.`,btn:{label:'Open Harvest ›',js:"setView('harvest')"}},...items.filter(t=>!r.includes(t))];
}
function tickFold(id){
  let n=0;id.split(',').forEach(part=>{const[k,i]=part.split('|');if(k==='plant'){harvestFromAlert(i);n++;}else if(k==='tree'){tickTree(i);n++;}});
  return`🧺 Picked — ${plural(n,'harvest')} logged`;
}
function jobSections(){
  const m=curMonth(),mode=maint();
  if(mode==='none')return[['🧺 Ready to pick',foldHarvest([...urgentItems(),...treeReadyItems()])]];
  const auto=autoItems(m),soon=auto.filter(t=>t.type==='soon'),coming=['🟢 Coming up',auto.filter(t=>t.type==='coming')];
  if(mode==='low')return[['🔴 Do this week',foldHarvest([...urgentItems(),...treeReadyItems()])],['🟡 This month',[...soon.filter(t=>!t.id.startsWith('late:')),...treeJobItems(m),...lowFeedItems(m)]],['🗓️ Seasonal projects',projectItems(m)],coming];
  const g=guardItems(m),now=g.filter(x=>x.id==='snails-rain');
  return[['🔴 Do this week',foldHarvest([...urgentItems(),...treeReadyItems(),...now])],['🐛 Pest checks',pestCheckItems(m)],['🟡 This month',[...g.filter(x=>!now.includes(x)),...soon,...treeJobItems(m),...feedItems(m)]],['🗓️ Seasonal projects',projectItems(m)],coming];
}
// Everything you can tick, apart from the optional ones: "coming up", seasonal projects and "fill empty spots"
function jobCount(){return jobSections().filter(([l])=>!/Coming up|Seasonal projects/.test(l)).reduce((n,[,ts])=>n+ts.filter(t=>t.cb&&!String(t.id).startsWith('fill:')).length,0);}
// Show "Do this week" in full, then the next few jobs; the rest wait behind "show more" so busy weeks don't overwhelm
const JOBS_SHOWN=6;let _allJobs=false;
function visibleJobCount(){let left=JOBS_SHOWN;return jobSections().reduce((n,[l,ts])=>{if(/Do this week|Ready to pick/.test(l))return n+ts.length;const k=Math.min(left,ts.length);left-=k;return n+k;},0);}
function renderJobs(){
  const m=curMonth(),secs=jobSections();let left=_allJobs?1e9:JOBS_SHOWN,hidden=0;
  const body=secs.map(([lbl,ts])=>{
    if(!ts.length)return'';
    const full=/Do this week|Ready to pick/.test(lbl),show=full?ts:ts.slice(0,Math.max(0,left));
    if(!full){left-=show.length;hidden+=ts.length-show.length;}
    return show.length?`<div class="task-section"><div class="task-sec-title">${lbl}</div>${show.map(cardHtml).join('')}</div>`:'';
  }).join('')+(hidden?`<button class="btn btn-cancel btn-full" onclick="_allJobs=true;renderJobs()">Show ${plural(hidden,'more job')}</button>`:'')
    ||(ST.beds.length?`<div class="all-done">All done for now 🐝<br><span>The garden is doing its thing.</span></div>`
      :cardHtml({type:'soon',icon:'🌱',title:'Add your first bed',detail:'Jobs, harvest dates, pest checks and watering advice appear here once you start planting.',btn:{label:'＋ Add a bed',js:"setView('beds');openAddChoice()"}}));
  const n=jobCount();
  const none=maint()==='none';
  $('jobs-content').innerHTML=`<div class="mv-heading">${none?'Ready to pick':'Jobs to do'}</div><div class="mv-intro">${none?`<b>No maintenance</b>: harvests and heatwave watering only. <button class="link-btn" onclick="openSettings()">Change</button>`:n?`${plural(n,'job')} this month.`:'Nothing needs doing right now.'}</div>${ST.beds.length?nudgeCardHtml():''}${!none||wxVerdict()?.urgent?weatherCardHtml():''}${monthCardHtml(n)}${ST.beds.length?'<button class="jobs-link" onclick="openReminders()"><span>📅 Add reminders to my calendar</span><span>›</span></button>':''}${body}`;
}
