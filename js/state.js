// Saved state (localStorage), undo, and helpers shared by every view.
'use strict';
const SK='gdn_v4';
let ST;

// ── Helpers ──
function dc(o){return JSON.parse(JSON.stringify(o));}
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
  s.beds??=[];s.customPlants??={};s.alertDone??={};s.log??=[];
  delete s.taskState;
  s.beds.forEach(b=>{
    b.id??=newId();
    b.low??=/low/i.test(b.hint||'');delete b.hint;delete b.dir;delete b.cls;
    b.rows.forEach(r=>r.forEach(c=>{c.picks??=0;}));
  });
  // Harvest log used to store the bed's position; store its id so deleting a bed can't mislabel entries
  s.log.forEach(l=>{if(l.bid==null&&l.b!=null){l.bid=s.beds[l.b]?.id||null;delete l.b;}});
  s.v=5;return s;
}
function newId(){return'b'+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function bedById(id){return ST.beds.find(b=>b.id===id);}
function freshState(){return migrate(dc(DEFAULT));}
function loadState(){
  try{const r=localStorage.getItem(SK);ST=r?JSON.parse(r):dc(DEFAULT);}catch(e){ST=dc(DEFAULT);}
  migrate(ST);saveState();
}
function saveState(){try{localStorage.setItem(SK,JSON.stringify(ST));}catch(e){}}

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
function clearCell(bi,ri,ci){setCell(bi,ri,ci,{p:null,s:'empty',d:null,st:null,picks:0});}
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
    Object.values(CATS).forEach(a=>{const i=a.indexOf(k);if(i>-1)a.splice(i,1);});
    (CATS[c.cat]||COOL_VEG).push(k);
  });
}
function plantName(k){return ST.customPlants[k]?.n??P[k]?.n??k;}
function timing(k){return TIMING[k]||{};}
function inSeason(k,m=curMonth()){const t=TIMING[k];return t?.sow?t.sow.includes(m):true;}
function keepsProducing(k){return!!timing(k).pick;}
function familyOf(k){return Object.keys(FAMILY).find(f=>FAMILY[f].includes(k));}
// Expected first harvest. Seedlings (st !== 'seed', including the starting layout) are ~3 weeks ahead.
function expectedDate(cell){
  const t=timing(cell.p);if(!t.days||!cell.d)return null;
  return addDays(cell.d,cell.st==='seed'?t.days:Math.max(14,t.days-21));
}

// Short "when" label, shared by the plant sheet, This Month recap and Plants tab
function readyLabel(cell,short){
  const pl=P[cell.p],exp=expectedDate(cell);
  if(cell.s==='ready'||cell.s==='bolting')return'Ready now';
  if(cell.s==='done')return'Finished';
  if(!exp||COMPANIONS.includes(cell.p))return short?'—':pl.h;
  if(exp<=localDate())return keepsProducing(cell.p)?'Picking season':'Ready about now';
  return(short?'':'Ready ~')+fmtDate(exp);
}
// One-off crops that should be ready by now but aren't marked Ready
function overdueOneOff(cell){
  if(!['seed','seedling','growing'].includes(cell.s)||keepsProducing(cell.p)||COMPANIONS.includes(cell.p))return false;
  const exp=expectedDate(cell);return!!exp&&exp<=localDate();
}

// ── Harvest log ──
function logHarvest(p,bi,final){
  ST.log.push({d:localDate(),p,bid:ST.beds[bi].id,f:final?1:0});
  if(ST.log.length>1000)ST.log=ST.log.slice(-1000);
}
