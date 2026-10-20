// Saved state (localStorage), undo, and helpers shared by every view.
'use strict';
const SK='gdn_v4';
let ST;

// ── Helpers ──
function dc(o){return JSON.parse(JSON.stringify(o));}
function unesc(s){const d=document.createElement('textarea');d.innerHTML=s;return d.value;}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function localDate(d=new Date()){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;}
function addDays(iso,n){const d=new Date(iso+'T00:00');d.setDate(d.getDate()+n);return localDate(d);}
function daysBetween(a,b){return Math.round((new Date(b+'T00:00')-new Date(a+'T00:00'))/864e5);}
function fmtDate(iso){return new Date(iso+'T00:00').toLocaleDateString('en-AU',{day:'numeric',month:'short'});}
function curMonth(){return new Date().getMonth();}
function plural(n,w){return `${n} ${w}${n===1?'':'s'}`;}

// ── Load / save ──
// Fill in fields added since older saves, so old data keeps working.
function migrate(s){
  s.beds??=[];s.customPlants??={};s.alertDone??={};s.log??=[];s.pestDone??={};s.pestReports??=[];s.guardDone??={};s.prefs??={};s.prices??={};
  delete s.taskState;
  s.beds.forEach(b=>{
    b.id??=newId();
    b.low??=/low/i.test(b.hint||'');delete b.hint;delete b.dir;delete b.cls;
    b.rows.forEach(r=>r.forEach(c=>{c.picks??=0;}));
  });
  // Harvest log used to store the bed's position; store its id so deleting a bed can't mislabel entries
  s.log.forEach(l=>{if(l.bid==null&&l.b!=null){l.bid=s.beds[l.b]?.id||null;delete l.b;}});
  s.customVarieties??={};s.history??=[];s.seeds??=[];s.treeDone??={};s.fed??={};s.projDone??={};
  s.beds.forEach(b=>{b.spot??=30;}); // spot size in cm
  // v6: plants that were really varieties became one crop each (Cherry Tomato → Tomato › Cherry, …)
  if((s.v||0)<6){
    const crop=k=>CROP_ALIAS[k]?.[0]||k;
    s.beds.forEach(b=>b.rows.forEach(r=>r.forEach(c=>{
      const a=CROP_ALIAS[c.p];if(a){c.p=a[0];c.v??=a[1];}
      else if(c.p==='kale')c.v??='tuscan'; // the old "Tuscan Kale"
    })));
    s.log.forEach(l=>{l.p=crop(l.p);});
    s.pestReports.forEach(r=>{r.p=crop(r.p);});
    Object.keys(s.prices).forEach(k=>{const c=crop(k);if(c!==k){s.prices[c]??=s.prices[k];delete s.prices[k];}});
    Object.keys(s.alertDone).forEach(k=>{const[p,st]=k.split(':');const c=crop(p);if(c!==p){s.alertDone[c+':'+st]=s.alertDone[k];delete s.alertDone[k];}});
    Object.values(s.customPlants).forEach(c=>{if(c.nx)c.nx=crop(c.nx);});
  }
  s.v=6;return s;
}
// Old plant keys → [crop, variety], for saves and backups from before varieties
const CROP_ALIAS={'cherry-tomato':['tomatoes','tommy-toe'],'dwarf-beans':['beans','dwarf'],'climbing-beans':['beans','blue-lake'],'snake-beans':['beans','snake'],
  'snow-peas':['peas','snow'],'garden-peas':['peas','shelling'],'silverbeet':['chard','fordhook'],'rainbow-chard':['chard','rainbow'],
  'red-cabbage':['cabbage','red'],'cos-lettuce':['lettuce','cos']};
function newId(){return'b'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function bedById(id){return ST.beds.find(b=>b.id===id);}
function freshState(){return migrate(dc(DEFAULT));}
function loadState(){
  try{const r=localStorage.getItem(SK);ST=r?JSON.parse(r):dc(DEFAULT);}catch(e){ST=dc(DEFAULT);}
  // save the migrated copy locally only — opening the app isn't a change to sync
  migrate(ST);try{localStorage.setItem(SK,JSON.stringify(ST));}catch(e){}
}
function saveState(){try{localStorage.setItem(SK,JSON.stringify(ST));}catch(e){}if(typeof syncAfterSave==='function')syncAfterSave();}

// ── Undo (one step) ── call snapshot() before a destructive change, then toast(msg,{undo:true})
let _undo=null;
function snapshot(){_undo=JSON.stringify(ST);}
function undo(){
  if(!_undo)return;
  ST=migrate(JSON.parse(_undo));_undo=null;saveState();applyCustomPlants();
  closeSheet();refreshAll();if(!WX)loadWeather();toast('↩ Undone');
}

// ── Cells ──
function getCell(bi,ri,ci){return ST.beds[bi].rows[ri][ci];}
function setCell(bi,ri,ci,d){Object.assign(ST.beds[bi].rows[ri][ci],d);saveState();}
function clearCell(bi,ri,ci){
  const c=getCell(bi,ri,ci);
  if(c.p&&P[c.p]){ST.history.push({bid:ST.beds[bi].id,ri,ci,p:c.p,v:c.v||null,d:c.d||null,end:localDate()});if(ST.history.length>3000)ST.history=ST.history.slice(-3000);}
  setCell(bi,ri,ci,{p:null,v:null,s:'empty',d:null,st:null,picks:0});
}
function isEmpty(c){return!c.p||c.s==='empty';}
function allCells(){const out=[];ST.beds.forEach((bed,bi)=>bed.rows.forEach((row,ri)=>row.forEach((cell,ci)=>out.push({bed,bi,ri,ci,cell}))));return out;}
function plantedCells(){return allCells().filter(x=>!isEmpty(x.cell)&&P[x.cell.p]);}
function emptyCells(bi){return allCells().filter(x=>x.bi===bi&&isEmpty(x.cell));}
function plantHas(p,s){return allCells().some(x=>x.cell.p===p&&x.cell.s===s);}

// ── Plants ──
const CATS={cool:COOL_VEG,warm:WARM_VEG,herb:HERBS,comp:COMPANIONS};
const CAT_LBL={cool:'Cool Season',warm:'Warm Season',herb:'Herbs',comp:'Companions'};
const CAT_SOW={cool:[2,3,4,5,6,7],warm:[8,9,10,11,0],herb:ALL_YEAR,comp:ALL_YEAR};
// User-created plants live in ST.customPlants (raw text) and are merged into P (escaped) so every view picks them up.
function applyCustomPlants(){
  const cp=ST.customPlants;
  Object.entries(cp).forEach(([k,c])=>{
    P[k]={e:esc(c.e)||'🌱',n:esc(c.n),h:esc(c.h)||'—',nx:c.nx&&(P[c.nx]||cp[c.nx])?c.nx:null,
      tip:esc(c.tip)||'Your own addition — add growing notes as you learn.',
      idea:esc(c.idea)||'Add a harvest idea by editing this plant.',custom:true};
    TIMING[k]={sow:CAT_SOW[c.cat]||ALL_YEAR,days:+c.days||null,pick:!!c.pick};
    [...Object.values(CATS),...Object.values(FAMILY)].forEach(a=>{const i=a.indexOf(k);if(i>-1)a.splice(i,1);});
    (CATS[c.cat]||COOL_VEG).push(k);
    if(FAMILY[c.fam])FAMILY[c.fam].push(k); // drives pest checks and bed suggestions
  });
}
// Plant categories in season order: warm-season crops first in spring/summer, cool-season first in autumn/winter
function warmSeasonNow(m=curMonth()){return[8,9,10,11,0,1].includes(m);}
function seasonCats(m=curMonth()){return(warmSeasonNow(m)?['warm','herb','comp','cool']:['cool','herb','comp','warm']).map(c=>[c,CATS[c]]);}
function plantName(k){return ST.customPlants[k]?.n??P[k]?.n??k;}
// Planting months are adjusted for the climate zone (see zones.js)
function timing(k){const t=TIMING[k];return t?{...t,sow:zoneSow(k,t.sow)}:{};}
function varietySow(k,v){return v?.sow?zoneSow(k,v.sow,(v.tags||[]).includes('h'),true):null;}
// A crop is in season if it — or any of its varieties (e.g. summer spinaches) — can be planted this month
// warmOnly crops (taro, cassava) only grow in the subtropics and tropics
function warmOnlyHere(k){return!!P[k]?.warmOnly&&!['subtropical','tropical'].includes(zone());}
function inSeason(k,m=curMonth()){if(warmOnlyHere(k))return false;const t=timing(k);return(t.sow?t.sow.includes(m):true)||varietiesOf(k).some(v=>varietySow(k,v)?.includes(m));}
function varietyInSeason(k,v,m=curMonth()){const sow=varietySow(k,v)||timing(k).sow;return sow?sow.includes(m):true;}
function keepsProducing(k){return!!timing(k).pick;}
function familyOf(k){return Object.keys(FAMILY).find(f=>FAMILY[f].includes(k));}
// Expected first harvest. Seedlings (st !== 'seed', including the starting layout) are ~3 weeks ahead.
function expectedDate(cell){
  const t=cellTiming(cell);if(!t.days||!cell.d)return null;
  return addDays(cell.d,cell.st==='seed'?t.days:Math.max(14,t.days-21));
}

// Seeds and seedlings move on by themselves once they've had time to establish.
// Saved on this device only — every device works out the same thing.
function advanceStatuses(){
  let changed=false;const td=localDate();
  ST.beds.forEach(b=>{if(b.kind==='tree')return;b.rows.forEach(r=>r.forEach(c=>{
    if(!c.d||!['seed','seedling'].includes(c.s))return;
    const a=daysBetween(c.d,td),s=c.s==='seed'?(a>=21?'growing':a>=10?'seedling':'seed'):(a>=14?'growing':'seedling');
    if(s!==c.s){c.s=s;changed=true;}
  }));});
  if(changed)try{localStorage.setItem(SK,JSON.stringify(ST));}catch(e){}
}
// Plants you pick from don't crop forever: roughly how many weeks of picking before they're spent.
// Perennials (herbs, strawberries) keep going.
const PICK_WEEKS={'broad-beans':8,'peas':8,'kale':20,'chard':40,'lettuce':6,'spinach':6,'coriander':6,'parsley':30,'dill':8,'basil':16,
  'tomatoes':16,'zucchini':12,'cucumber':10,'beans':8,'capsicum':20,'eggplant':20,'chilli':26,'broccoli':6};
function pickingOver(cell){
  if(isTree(cell.p)||!cellKeepsProducing(cell)||cellTraits(cell).includes('perennial')||COMPANIONS.includes(cell.p))return false;
  const exp=expectedDate(cell);return!!exp&&daysBetween(exp,localDate())>(PICK_WEEKS[cell.p]??16)*7;
}

// Short "when" label, shared by the plant sheet, Harvest and Plants tabs
function readyLabel(cell,short){
  if(isTree(cell.p))return treeReadyLabel(cell,short);
  if(cell.s!=='done'&&pickingOver(cell))return short?'Done?':'Probably finished';
  const pl=P[cell.p],exp=expectedDate(cell);
  if(cell.s==='ready'||cell.s==='bolting')return'Ready now';
  if(cell.s==='done')return'Finished';
  if(!exp||COMPANIONS.includes(cell.p))return short?'—':pl.h;
  if(exp<=localDate())return cellKeepsProducing(cell)?'Picking season':'Ready about now';
  return(short?'':'Ready ~')+fmtDate(exp);
}
// One-off crops that should be ready by now but aren't marked Ready
function overdueOneOff(cell){
  if(!['seed','seedling','growing'].includes(cell.s)||cellKeepsProducing(cell)||COMPANIONS.includes(cell.p))return false;
  const exp=expectedDate(cell);return!!exp&&exp<=localDate();
}

// ── Harvest log ──
// n = how many plants this harvest came from (for the harvest value)
function logHarvest(p,bi,final,n=1,kg=null){
  ST.log.push({d:localDate(),p,bid:ST.beds[bi].id,f:final?1:0,n,...(kg>0?{kg:Math.round(kg*1000)/1000}:{})});
  if(ST.log.length>1000)ST.log=ST.log.slice(-1000);
}
