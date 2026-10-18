// Beds view: grid, select mode, drag & drop, plant sheet, plant picker, custom plant form.
'use strict';
const CELL_KEYS=['p','v','s','d','st','picks'];
const cellData=c=>Object.fromEntries(CELL_KEYS.map(k=>[k,c[k]??null]));

// ── Grid ──
function renderBeds(){
  const w=$('beds-wrap');w.classList.toggle('sel-mode',selectMode);
  $('view-beds').classList.toggle('no-beds',!ST.beds.length);
  if(!ST.beds.length){
    w.innerHTML=`<div class="setup"><div class="setup-e">🌱</div><div class="setup-t">Start your garden plan</div>
      <div class="setup-s">Add each bed, patch or pot group, then tap a spot to plant it.</div>
      <button class="btn btn-seed" onclick="openAddChoice()">＋ Add your first bed or tree</button>
      ${ST.wx?'':'<button class="btn btn-cancel" onclick="openSettings()">📍 Set your location for watering advice</button>'}
      <button class="link-btn" onclick="openSettings()">Have a backup? Import it in Settings</button></div>`;
    return;
  }
  w.innerHTML=ST.beds.map((bed,bi)=>isTreeBed(bed)?'':`<div class="bed-wrap"><div class="bed-card"><div class="bed-top bt${bi%3+1}"><div class="bed-name">${esc(bed.name)}${bed.low?' <span class="bed-tag">low crops</span>':''}</div>${selectMode?'':`<button class="bed-edit" aria-label="Edit ${esc(bed.name)}" onclick="openBedEditor(${bi})">✏️</button>`}</div><div class="grid-bg${(bed.rows[0]?.length||0)>=8?' dense':''}">${bed.rows.map((row,ri)=>`<div class="grid-row">${row.map((cell,ci)=>renderCell(cell,bi,ri,ci)).join('')}</div>`).join('')}</div></div></div>`).join('')
    +treesSectionHtml()+(selectMode?'':'<button class="add-bed" onclick="openAddChoice()">＋ Add a bed or fruit tree</button>');
}

// ── Summary ── weather at a glance, how things are growing, links to Jobs and Pests
const SUM_ST=[['seed','🌱','Seeds'],['seedling','🪴','Seedlings'],['growing','🌿','Growing'],['ready','✨','Ready'],['bolting','⚠️','Bolting'],['done','✅','Finished']];
function renderSummary(){
  const el=$('beds-summary');
  if(!ST.beds.length){el.innerHTML='';return;}
  const cells=plantedCells().filter(x=>!isTreeBed(x.bed)),empty=allCells().length-plantedCells().length,trees=treeBeds().reduce((n,x)=>n+(x.bed.n||1),0);
  const counts=SUM_ST.map(([s,e,l])=>[s,e,l,cells.filter(x=>x.cell.s===s).length]).filter(x=>x[3]);
  const urgent=urgentItems().length,jobs=jobCount(),pests=pestsToWatch().length,mode=maint();
  el.innerHTML=`<div class="sum">
    ${wxLoc()?weatherLineHtml():`<button class="sum-wx sum-link" onclick="openSettings()">📍 Set your location for watering advice ›</button>`}
    <div class="sum-counts">${counts.map(([s,e,l,n])=>`<span class="sum-c sc-${s}"><b>${n}</b> ${e} ${l}</span>`).join('')}${empty?`<span class="sum-c sc-empty"><b>${empty}</b> ▫️ Empty</span>`:''}${trees?`<span class="sum-c sc-tree"><b>${trees}</b> 🌳 ${trees===1?'Tree':'Trees'}</span>`:''}</div>
    <div class="sum-links">
      <button class="sum-go${urgent?' hot':''}" onclick="setView('jobs')">🐝 ${mode==='none'?(jobs?`${jobs} to pick or water`:'Nothing to pick yet'):jobs?`${plural(jobs,'job')}${urgent?` · ${urgent} urgent`:''}`:'No jobs'} ›</button>
      <button class="sum-go" onclick="setView('pests')">🐛 ${pests&&mode==='std'?`${plural(pests,'pest')} to watch`:'Pest guide'} ›</button>
    </div></div>`;
}

// ── Add / edit beds ──
const BED_MAX_ROWS=8,BED_MAX_COLS=10;
function vegBedCount(){return ST.beds.filter(b=>!isTreeBed(b)).length;}
const emptyCell=()=>({p:null,s:'empty',d:null,st:null,picks:0});
function openBedEditor(bi){
  const bed=bi==null?null:ST.beds[bi];
  const v=bed?{name:bed.name,r:bed.rows.length,c:bed.rows[0]?.length||1,low:bed.low,spot:bed.spot||30}:{name:`Bed ${vegBedCount()+1}`,r:2,c:6,low:false,spot:30};
  const stepper=(id,val,max)=>`<div class="stepper"><button onclick="stepNum('${id}',-1,${max})" aria-label="Fewer">−</button><input class="fm-in" id="${id}" type="number" inputmode="numeric" min="1" max="${max}" value="${val}"><button onclick="stepNum('${id}',1,${max})" aria-label="More">+</button></div>`;
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">${bed?'✏️ Edit bed':'＋ New bed'}</div><div class="sh-sub">${bed?'Shrinking a bed removes plants outside the new size':'You can change this any time'}</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Cancel</button></div></div>
    <div class="fm-lbl">Name</div><input class="fm-in" id="bed-n" maxlength="30" placeholder="e.g. Bed 1 — South" value="${esc(v.name)}">
    <div class="fm-2col"><div><div class="fm-lbl">Rows</div>${stepper('bed-r',v.r,BED_MAX_ROWS)}</div><div><div class="fm-lbl">Spots per row</div>${stepper('bed-c',v.c,BED_MAX_COLS)}</div></div>
    <div class="fm-lbl">Each spot is about</div><div class="fm-emoji-row"><input class="fm-in" id="bed-spot" type="number" inputmode="numeric" min="10" max="200" value="${v.spot}" style="max-width:90px"><span class="set-txt" style="margin:0">cm square — used for how many plants fit in a spot</span></div>
    <label class="fm-check"><input type="checkbox" id="bed-low"${v.low?' checked':''}> Low crops only — don't suggest tall or climbing plants</label>
    ${bed?`<button class="btn btn-cancel btn-full" style="margin-top:12px" onclick="openRotation(${bi})">🔄 Rotation & new season</button>`:''}
    <button class="btn btn-seed btn-full" style="margin-top:16px" onclick="saveBed(${bi??'null'})">${bed?'💾 Save bed':'＋ Add bed'}</button>
    ${bed?`<button class="btn btn-remove btn-full" style="margin-top:8px" onclick="deleteBed(${bi})">🗑️ Delete this bed</button>`:''}
  </div>`);
  if(!bed&&!('ontouchstart' in window))setTimeout(()=>$('bed-n')?.select(),50);
}
function stepNum(id,d,max){const el=$(id);el.value=Math.min(max,Math.max(1,(+el.value||1)+d));}
function saveBed(bi){
  const name=$('bed-n').value.trim()||(bi==null?`Bed ${vegBedCount()+1}`:ST.beds[bi].name);
  const r=Math.min(BED_MAX_ROWS,Math.max(1,+$('bed-r').value||1)),c=Math.min(BED_MAX_COLS,Math.max(1,+$('bed-c').value||1));
  const low=$('bed-low').checked,spot=Math.min(200,Math.max(10,parseInt($('bed-spot').value,10)||30));
  if(bi==null){
    ST.beds.push({id:newId(),name,low,spot,rows:Array.from({length:r},()=>Array.from({length:c},emptyCell))});
    saveState();closeSheet();refreshAll();toast(`＋ Added ${name}`);
    [...document.querySelectorAll('#beds-wrap .bed-wrap')].at(-1)?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  snapshot();const bed=ST.beds[bi];
  const lost=bed.rows.flatMap((row,ri)=>row.filter((cell,ci)=>(ri>=r||ci>=c)&&!isEmpty(cell))).length;
  bed.name=name;bed.low=low;bed.spot=spot;
  bed.rows=Array.from({length:r},(_,ri)=>Array.from({length:c},(_,ci)=>bed.rows[ri]?.[ci]||emptyCell()));
  saveState();closeSheet();refreshAll();
  toast(lost?`Saved — ${plural(lost,'plant')} removed`:`Saved ${name}`,{undo:!!lost});
}
function deleteBed(bi){
  snapshot();const name=ST.beds[bi].name;ST.beds.splice(bi,1);saveState();closeSheet();refreshAll();
  toast(`Deleted ${name}`,{undo:true});
}
function renderCell(cell,bi,ri,ci){
  const pl=isEmpty(cell)?null:P[cell.p];const s=pl?cell.s:'empty';const sel=selectMode&&selected.has(`${bi}-${ri}-${ci}`);
  const pip={ready:'pip-r',bolting:'pip-b',done:'pip-d'}[s];
  return `<div class="cell s-${s}${sel?' selected':''}" id="cell-${bi}-${ri}-${ci}" data-bi="${bi}" data-ri="${ri}" data-ci="${ci}" role="button" tabindex="0" aria-label="${pl?cellName(cell)+', '+STATUS_LBL[s]:'Empty — tap to plant'}" onpointerdown="cellPD(event,${bi},${ri},${ci})" onclick="cellClick(${bi},${ri},${ci})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();cellClick(${bi},${ri},${ci});}"><div class="cell-chk">${sel?'✓':''}</div>${pip?`<div class="cell-pip ${pip}"></div>`:''}<div class="cell-e">${pl?cellEmoji(cell):'＋'}</div><div class="cell-n">${pl?cellShort(cell):''}</div></div>`;
}
function cellClick(bi,ri,ci){if(suppressClick)return;if(selectMode)toggleSelect(bi,ri,ci);else if(isEmpty(getCell(bi,ri,ci)))openPicker(bi,ri,ci);else openCellSheet(bi,ri,ci);}

// ── Select mode ──
let selectMode=false;
const selected=new Set();
function toggleSelectMode(){
  selectMode=!selectMode;selected.clear();updateSelCount();
  const fab=$('sel-fab');fab.classList.toggle('on',selectMode);fab.textContent=selectMode?'✓ Selecting':'✓ Select';
  $('sel-bar').classList.toggle('on',selectMode);$('main-nav').style.display=selectMode?'none':'flex';
  renderBeds();
}
function exitSelectMode(){if(selectMode)toggleSelectMode();}
function updateSelCount(){$('sel-count').textContent=selected.size+' selected';}
function toggleSelect(bi,ri,ci){const k=`${bi}-${ri}-${ci}`;selected.has(k)?selected.delete(k):selected.add(k);renderBeds();updateSelCount();}
function selectedCells(){return[...selected].map(k=>k.split('-').map(Number)).filter(([bi,ri,ci])=>!isEmpty(getCell(bi,ri,ci)));}
function openMultiStatus(){
  const n=selectedCells().length;if(!n){toast('Select some plants first');return;}
  showSheet(`<div class="sh-body"><div class="sh-heading">Update ${plural(n,'plant')}</div><div class="sh-sub">Set the status for all selected spots</div><div class="stat-grid">${STATUSES.map(s=>`<button class="stat-opt so-${s}" onclick="doMultiStatus('${s}')">${STATUS_LBL[s]}</button>`).join('')}</div><button class="btn btn-cancel btn-full" onclick="closeSheet()">Cancel</button></div>`);
}
function openMultiDate(){
  const cs=selectedCells();if(!cs.length){toast('Select some plants first');return;}
  // Start from their shared date if they all match, otherwise today
  const ds=[...new Set(cs.map(([bi,ri,ci])=>getCell(bi,ri,ci).d).filter(Boolean))];
  showSheet(`<div class="sh-body"><div class="sh-heading">📅 Planted date</div><div class="sh-sub">${ds.length===1?`${plural(cs.length,'plant')} — currently ${fmtDate(ds[0])}`:`For all ${plural(cs.length,'selected plant')}${ds.length>1?' (they have different dates now)':''}`}</div>
    <div class="date-wrap">${datePickHtml('multi-d',ds.length===1?ds[0]:null)}</div>
    <div class="fm-help" style="margin-bottom:12px">Expected harvest dates and jobs update to match.</div>
    <button class="btn btn-seed btn-full" style="margin-bottom:8px" onclick="doMultiDate()">Set planted date</button>
    <button class="btn btn-cancel btn-full" onclick="closeSheet()">Cancel</button></div>`);
}
function doMultiDate(){
  const d=readDate('multi-d'),cs=selectedCells();
  cs.forEach(([bi,ri,ci])=>{const c=getCell(bi,ri,ci);setCell(bi,ri,ci,{d,s:['seed','seedling'].includes(c.s)?statusForAge(c.st||c.s,d):c.s});});
  closeSheet();exitSelectMode();refreshAll();toast(`📅 ${plural(cs.length,'plant')} set to planted ${fmtDate(d)}`);
}
function doMultiStatus(s){const cs=selectedCells();cs.forEach(([bi,ri,ci])=>setCell(bi,ri,ci,{s}));closeSheet();exitSelectMode();renderAlerts();toast(`Updated ${plural(cs.length,'plant')}`);}
function doMultiRemove(){
  const cs=selectedCells();if(!cs.length){toast('Select some plants first');return;}
  snapshot();cs.forEach(([bi,ri,ci])=>clearCell(bi,ri,ci));exitSelectMode();renderAlerts();
  toast(`Removed ${plural(cs.length,'plant')}`,{undo:true});
}

// ── Drag to move/swap ── Mouse: starts after a small move. Touch: press-and-hold 300ms so normal swipes still scroll.
let DS=null,suppressClick=false;
function cellPD(e,bi,ri,ci){
  if(selectMode||e.button>0||isEmpty(getCell(bi,ri,ci)))return;
  DS={src:{bi,ri,ci},x:e.clientX,y:e.clientY,active:false,ghost:null,touch:e.pointerType!=='mouse',timer:null};
  if(DS.touch)DS.timer=setTimeout(()=>startDrag(DS.x,DS.y),300);
}
function startDrag(x,y){
  if(!DS||DS.active)return;
  DS.active=true;const{bi,ri,ci}=DS.src;
  const g=document.createElement('div');g.className='drag-ghost';g.textContent=cellEmoji(getCell(bi,ri,ci));
  g.style.left=(x-28)+'px';g.style.top=(y-28)+'px';document.body.appendChild(g);DS.ghost=g;
  $(`cell-${bi}-${ri}-${ci}`)?.classList.add('dragging');navigator.vibrate?.(15);
}
function dropTarget(x,y){return document.elementFromPoint(x,y)?.closest?.('.cell[data-bi]')||null;}
function endDrag(){
  if(!DS)return;clearTimeout(DS.timer);DS.ghost?.remove();
  document.querySelectorAll('.cell.drag-over,.cell.dragging').forEach(c=>c.classList.remove('drag-over','dragging'));
  DS=null;
}
document.addEventListener('pointermove',e=>{
  if(!DS)return;
  if(!DS.active){
    if(Math.hypot(e.clientX-DS.x,e.clientY-DS.y)<8)return;
    if(DS.touch){endDrag();return;} // moved before the hold finished → it's a scroll
    startDrag(e.clientX,e.clientY);
  }
  DS.ghost.style.left=(e.clientX-28)+'px';DS.ghost.style.top=(e.clientY-28)+'px';
  document.querySelectorAll('.cell.drag-over').forEach(c=>c.classList.remove('drag-over'));
  const tc=dropTarget(e.clientX,e.clientY);const{bi,ri,ci}=DS.src;
  if(tc&&tc.id!==`cell-${bi}-${ri}-${ci}`)tc.classList.add('drag-over');
});
document.addEventListener('pointerup',e=>{
  if(!DS)return;
  if(DS.active){
    suppressClick=true;setTimeout(()=>suppressClick=false,0);
    const src=DS.src,tc=dropTarget(e.clientX,e.clientY);
    if(tc&&tc.id!==`cell-${src.bi}-${src.ri}-${src.ci}`){
      const tbi=+tc.dataset.bi,tri=+tc.dataset.ri,tci=+tc.dataset.ci;
      const a=cellData(getCell(src.bi,src.ri,src.ci)),b=cellData(getCell(tbi,tri,tci));
      setCell(src.bi,src.ri,src.ci,b);setCell(tbi,tri,tci,a);
      endDrag();renderBeds();renderAlerts();toast(isEmpty(b)?'Moved '+plantName(a.p):'Plants swapped ↔');return;
    }
  }
  endDrag();
});
document.addEventListener('pointercancel',endDrag);
// Once a touch drag is live, stop the page scrolling under the finger
document.addEventListener('touchmove',e=>{if(DS?.active)e.preventDefault();},{passive:false});
document.addEventListener('contextmenu',e=>{if(DS)e.preventDefault();});

// ── Plant sheet ──
function openCellSheet(bi,ri,ci){
  const cell=getCell(bi,ri,ci),pl=P[cell.p],td=localDate();
  const days=cell.d?daysBetween(cell.d,td):null;
  const readyTxt={'Ready now':'Now','Picking season':'Picking','Ready about now':'Any day','Finished':'—'}[readyLabel(cell,true)]??readyLabel(cell,true);
  const canPick=['growing','ready','bolting'].includes(cell.s);
  const a=`${bi},${ri},${ci}`;
  showSheet(`<div class="sh-plant-hdr"><div class="sh-pe">${cellEmoji(cell)}</div><div><div class="sh-pn">${cellName(cell)}</div><span class="sh-stag tg-${cell.s}">${STATUS_LBL[cell.s]}</span>${cell.picks?`<span class="sh-picks">🧺 ${plural(cell.picks,'pick')}</span>`:''}</div></div>
  <div class="sh-body">
    <div class="sh-chips"><div class="sh-chip"><div class="sh-cl">Season</div><div class="sh-cv" style="color:#C49010">${pl.h}</div></div><div class="sh-chip"><div class="sh-cl">In ground</div><div class="sh-cv">${days!==null?days+'d':'—'}</div></div><div class="sh-chip"><div class="sh-cl">Ready</div><div class="sh-cv">${readyTxt}</div></div></div>
    ${varietiesOf(cell.p).length?`<div class="planted-row"><span class="sh-cl">🏷️ Variety</span><button class="var-btn" onclick="openVarietyStep(${a},'${cell.p}',true)">${cellVariety(cell)?esc(cellVariety(cell).n):'Not set — choose'} ›</button></div>`:''}
    <div class="planted-row"><span class="sh-cl">📅 Planted</span><input class="fm-in date-in" type="date" id="cell-d" max="${td}" value="${cell.d||td}" onchange="setPlanted(${a})"></div>
    <div class="sh-tip">💡 ${pl.tip}</div>
    ${spacingHtml(cell.p,cell.v,bi)}
    ${pl.nx&&P[pl.nx]?`<div class="sh-next"><div class="sh-nl">→ Plant next</div><div class="sh-nv">${P[pl.nx].e} ${P[pl.nx].n} — ${P[pl.nx].h}</div></div>`:''}
    ${cell.s==='done'?`<button class="btn btn-seed btn-full" onclick="clearSpot(${a})">🧹 Pulled it out — clear this spot</button><div class="sh-hint">Completed. Pull out what's left, then clear the spot to replant.</div>`
      :canPick?(isLifted(cell.p)?`<button class="btn btn-harvest btn-full" onclick="harvestCell(${a},true)">🧺 Harvest — pull it up</button><div class="sh-hint">Pulled whole, so the spot is free to replant straight away.</div>`
        :`<div class="btn-row"><button class="btn btn-harvest" onclick="harvestSome(${a})">🧺 Harvest some</button><button class="btn btn-seed" onclick="harvestCell(${a},true)">✅ Harvest all</button></div><div class="sh-hint">${harvestHint(cell.p)}</div>`):''}
    <div class="btn-row" style="margin-bottom:12px"><button class="btn btn-cancel" onclick="openGrowing('${cell.p}')">📖 Tips & recipes</button><button class="btn btn-cancel" onclick="openPestsFor('${cell.p}')">🐛 Something wrong?</button></div>
    <div class="stat-lbl">Status</div>
    <div class="stat-grid">${STATUSES.map(s=>`<button class="stat-opt so-${s}${cell.s===s?' sel':''}" onclick="doUpdateStatus(${a},'${s}')">${STATUS_LBL[s]}</button>`).join('')}</div>
    <div class="btn-row">
      ${pl.custom?`<button class="btn btn-cancel" onclick="openNewPlant('${cell.p}',${a})">✏️ Edit plant</button>`:''}
      <button class="btn btn-cancel${pl.custom?'':' btn-full'}" onclick="removePlant(${a})">🗑️ Remove</button>
    </div>
    <button class="btn btn-cancel btn-full" onclick="closeSheet()">Close</button>
  </div>`);
}
function doUpdateStatus(bi,ri,ci,s){setCell(bi,ri,ci,{s});closeSheet();refreshAll();toast(`${plantName(getCell(bi,ri,ci).p)} → ${STATUS_LBL[s]}`);}
// One plant's final harvest (or pulling a whole-harvest crop) from the Beds sheet
function harvestCell(bi,ri,ci,all){
  snapshot();const x=plantedCells().find(y=>y.bi===bi&&y.ri===ri&&y.ci===ci);
  const msg=doHarvest([x],all);celebrate();closeSheet();refreshAll();toast(msg,{undo:true});
}
// A completed plant has been pulled out — free the spot (already counted in the harvest)
function clearSpot(bi,ri,ci){
  snapshot();const p=getCell(bi,ri,ci).p,nx=P[p].nx;clearCell(bi,ri,ci);closeSheet();refreshAll();
  toast(nx?`🧹 Spot cleared — ${plantName(nx)} would be a good next crop`:'🧹 Spot cleared — ready to replant',{undo:true});
}
function removePlant(bi,ri,ci){snapshot();const p=getCell(bi,ri,ci).p;clearCell(bi,ri,ci);closeSheet();refreshAll();toast('Removed '+plantName(p),{undo:true});}

// ── Picker ──
let _pk=null;
function openPicker(bi,ri,ci,q=''){
  _pk={bi,ri,ci};
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">🌱 Plant here</div><div class="sh-sub">${esc(ST.beds[bi].name)}</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Cancel</button></div><input class="pick-search" id="pick-q" type="search" placeholder="🔍 Search plants…" autocomplete="off" value="${esc(q)}" oninput="renderPickerGrid(this.value)" onkeydown="if(event.key==='Enter'){event.preventDefault();pickEnter();}"></div><div class="picker-grid" id="pick-grid"></div></div>`);
  renderPickerGrid(q);
  if(!('ontouchstart' in window))setTimeout(()=>$('pick-q')?.focus(),280);
}
function pickerMatches(q){const t=q.trim().toLowerCase();return seasonCats().map(([cat,keys])=>[cat,keys.filter(k=>P[k]&&(!t||plantName(k).toLowerCase().includes(t)))]);}
function pickTile(k,why,extra=''){const{bi,ri,ci}=_pk;return `<button class="pick-item${extra}" onclick="choosePlant(${bi},${ri},${ci},'${k}')"><div class="pick-e">${P[k].e}</div><div class="pick-n">${P[k].n}</div>${why?`<div class="pick-why">${esc(why)}</div>`:''}</button>`;}
function renderPickerGrid(q){
  const{bi}=_pk,t=q.trim();
  const groups=pickerMatches(t),total=groups.reduce((n,[,ks])=>n+ks.length,0);
  let html='';
  // Packets in your seed box that can go in now come first
  if(!t){const sd=seedsReady();if(sd.length)html+=`<div class="picker-cat">🌰 From your seed box</div>${sd.map(s=>{const v=seedVariety(s);return`<button class="pick-item pick-on pick-seed" onclick="choosePlant(${_pk.bi},${_pk.ri},${_pk.ci},'${s.p}',${s.v?`'${s.v}'`:'null'})"><div class="pick-e">${v?.e||P[s.p].e}</div><div class="pick-n">${P[s.p].n}${v?` › ${esc(v.s||v.n)}`:s.vn?` › ${esc(s.vn)}`:''}</div><div class="pick-why">your seeds</div></button>`;}).join('')}`;}
  if(!t){const sug=suggestForBed(bi);if(sug.length)html+=`<div class="picker-cat">✨ Suggested for this bed</div>${sug.map(s=>pickTile(s.k,s.why,' pick-sug')).join('')}`;}
  // In-season plants first (current season's group leading), then everything out of season at the bottom
  html+=groups.map(([cat,ks])=>[cat,ks.filter(k=>inSeason(k))]).filter(([,ks])=>ks.length).map(([cat,ks])=>`<div class="picker-cat">🟢 ${CAT_LBL[cat]} — plant now</div>${ks.map(k=>pickTile(k,'',' pick-on')).join('')}`).join('');
  const off=groups.flatMap(([,ks])=>ks.filter(k=>!inSeason(k)));
  if(off.length)html+=`<div class="picker-cat pick-off-hdr">💤 Out of season — better planted later</div>${off.map(k=>pickTile(k,timing(k).sow?'Plant '+monthsText(timing(k).sow):'Out of season',' pick-off')).join('')}`;
  // Varieties whose name matches the search (e.g. "Grosse Lisse" → Tomato › Grosse Lisse)
  const vm=t?Object.keys(P).flatMap(k=>varietiesOf(k).filter(v=>v.n.toLowerCase().includes(t.toLowerCase())).map(v=>[k,v])):[];
  if(vm.length)html=`<div class="picker-cat">🏷️ Varieties</div>${vm.map(([k,v])=>`<button class="pick-item pick-on" onclick="choosePlant(${_pk.bi},${_pk.ri},${_pk.ci},'${k}','${v.id}')"><div class="pick-e">${v.e||P[k].e}</div><div class="pick-n">${P[k].n} › ${esc(v.n)}</div></button>`).join('')}`+html;
  if(t&&!total&&!vm.length)html=`<div class="pick-empty">No “${esc(t)}” in your list yet — add it below.</div>`;
  const exact=groups.some(([,ks])=>ks.some(k=>plantName(k).toLowerCase()===t.toLowerCase()));
  if(!exact&&!vm.length)html+=`<div class="picker-cat">${total?'Not in the list?':'New plant'}</div><button class="pick-item pick-new" onclick="openNewPlant()"><div class="pick-e">＋</div><div class="pick-n">${t?`Add “${esc(t)}”`:'Add a new plant'}</div></button>`;
  $('pick-grid').innerHTML=html;
}
function pickEnter(){
  const t=$('pick-q').value.trim();if(!t)return;
  const ks=pickerMatches(t).flatMap(([,k])=>k);
  if(ks.length===1)choosePlant(_pk.bi,_pk.ri,_pk.ci,ks[0]);else if(!ks.length)openNewPlant();
}
// ── Planted date ── lets existing plants be entered with their real (past) planting date
const DATE_QUICK=[['Today',0],['1 week ago',7],['2 weeks ago',14],['1 month ago',30],['2 months ago',61],['3 months ago',91]];
function datePickHtml(id,val){
  const td=localDate();
  return `<input class="fm-in date-in" type="date" id="${id}" max="${td}" value="${val||td}" onchange="markQuick('${id}')"><div class="date-quick">${DATE_QUICK.map(([l,n])=>`<button class="date-q${(val||td)===addDays(td,-n)?' on':''}" data-d="${addDays(td,-n)}" onclick="setQuick('${id}',this.dataset.d)">${l}</button>`).join('')}</div>`;
}
function setQuick(id,d){$(id).value=d;markQuick(id);}
function markQuick(id){const v=$(id).value;$(id).parentElement.querySelectorAll('.date-q').forEach(b=>b.classList.toggle('on',b.dataset.d===v));}
// Read a date input, refusing future dates
function readDate(id){const v=$(id).value,td=localDate();return!v?td:v>td?td:v;}
// A plant that went in more than a couple of weeks ago is past the seed/seedling stage
function statusForAge(st,d){return daysBetween(d,localDate())>=14?'growing':st;}

let _pend=null;
// vid: undefined = ask which variety (if the crop has any); null = "not sure"; otherwise the chosen variety
function choosePlant(bi,ri,ci,key,vid){
  if(vid===undefined&&varietiesOf(key).length){openVarietyStep(bi,ri,ci,key);return;}
  vid=vid||null;_pend={bi,ri,ci,key,vid};const pl=P[key],v=varietyOf(key,vid);
  showSheet(`<div class="sh-body"><div class="ptc-emoji">${v?.e||pl.e}</div><div class="ptc-name">${pl.n}</div>
    ${varietiesOf(key).length?`<div class="ptc-var">${v?esc(v.n):'Any variety'} · <button class="link-btn" onclick="openVarietyStep(${bi},${ri},${ci},'${key}')">change</button></div>`:''}
    <div class="ptc-hw">Harvest: ${pl.h}${(v?varietyInSeason(key,v):inSeason(key))?'':' · <span style="color:#FF9060">out of season now</span>'}</div>
    ${plantingHeadsUpHtml(key,bi,vid,ri,ci)}
    ${spacingHtml(key,vid,bi)}
    <div class="ptc-q">When was it planted?</div>
    <div class="date-wrap">${datePickHtml('plant-d')}</div>
    <div class="fm-help" style="text-align:center;margin-bottom:12px">Already in the ground? Pick the date you planted it.</div>
    <div class="ptc-q">How did you start it?</div>
    <div class="btn-row"><button class="btn btn-seed" onclick="confirmPlant('seed')">🌱 From seed</button><button class="btn btn-sdlng" onclick="confirmPlant('seedling')">🪴 Seedling</button></div>
    <button class="btn btn-cancel btn-full" style="margin-top:8px" onclick="openPicker(${bi},${ri},${ci})">← Back</button></div>`);
}
function confirmPlant(st){
  if(!_pend)return;const{bi,ri,ci,key,vid}=_pend;_pend=null;
  const d=readDate('plant-d'),s=statusForAge(st,d);
  setCell(bi,ri,ci,{p:key,v:vid,s,st,d,picks:0});closeSheet();refreshAll();
  const c=getCell(bi,ri,ci),exp=expectedDate(c);
  toast(`🌱 ${d===localDate()?'Planted':`Added (planted ${fmtDate(d)})`} ${unesc(cellName(c))}${exp?` — ready ${exp<=localDate()?'about now':'~'+fmtDate(exp)}`:''}`);
}
function setPlanted(bi,ri,ci){
  const c=getCell(bi,ri,ci),d=readDate('cell-d');if(d===c.d)return;
  const s=['seed','seedling'].includes(c.s)?statusForAge(c.st||c.s,d):c.s;
  setCell(bi,ri,ci,{d,s});refreshAll();openCellSheet(bi,ri,ci);toast(`📅 Planted date set to ${fmtDate(d)}`);
}

// ── New / edit custom plant ──
let _np=null;
function openNewPlant(editKey,bi,ri,ci){
  const q=$('pick-q')?.value.trim()||'';
  const c=editKey?ST.customPlants[editKey]:{n:q,e:'',cat:inSeason('tomatoes')?'warm':'cool',h:'',tip:'',idea:'',nx:'',days:'',pick:false};
  _np=editKey?{key:editKey,bi,ri,ci,cat:c.cat}:{key:null,..._pk,cat:c.cat};
  const nxOpts=Object.keys(P).filter(k=>k!==editKey).sort((a,b)=>plantName(a).localeCompare(plantName(b)));
  const back=editKey?`openCellSheet(${bi},${ri},${ci})`:`openPicker(${_pk.bi},${_pk.ri},${_pk.ci},$('np-n').value)`;
  showSheet(`<div class="sh-body">
    <div class="sh-heading">${editKey?'✏️ Edit plant':'＋ New plant'}</div>
    <div class="sh-sub">${editKey?'Changes show everywhere this plant appears':'Saved to your plant list for next time'}</div>
    <div class="fm-lbl">Name</div><input class="fm-in" id="np-n" maxlength="40" placeholder="e.g. Purple Sprouting Broccoli" value="${esc(c.n)}">
    <div class="fm-lbl">Icon</div>
    <div class="fm-emoji-row"><input class="fm-in fm-emoji-in" id="np-e" maxlength="8" placeholder="🌱" value="${esc(c.e)}"><div class="fm-emojis">${NP_EMOJI.map(e=>`<button class="fm-emo" onclick="$('np-e').value='${e}'">${e}</button>`).join('')}</div></div>
    <div class="fm-lbl">Type</div>
    <div class="fm-cats">${Object.entries(CAT_LBL).map(([k,l])=>`<button class="fm-cat${c.cat===k?' sel':''}" data-cat="${k}" onclick="npCat('${k}')">${l}</button>`).join('')}</div>
    <div class="fm-2col"><div><div class="fm-lbl">Harvest window</div><input class="fm-in" id="np-h" maxlength="20" placeholder="e.g. Dec–Feb" value="${esc(c.h)}"></div>
    <div><div class="fm-lbl">Days to harvest</div><input class="fm-in" id="np-days" type="number" min="7" max="400" inputmode="numeric" placeholder="e.g. 60" value="${esc(c.days)}"></div></div>
    <label class="fm-check"><input type="checkbox" id="np-pick"${c.pick?' checked':''}> Keeps producing — pick from it repeatedly</label>
    <div class="fm-lbl">Plant family (optional)</div>
    <select class="fm-in" id="np-fam"><option value="">— Not sure —</option>${Object.entries(FAM_LBL).map(([k,l])=>`<option value="${k}"${c.fam===k?' selected':''}>${l[0].toUpperCase()+l.slice(1)}</option>`).join('')}</select>
    <div class="fm-help">Used for pest checks and bed suggestions — e.g. kale and cabbage are brassicas.</div>
    <div class="fm-lbl">Growing tip</div><textarea class="fm-in" id="np-tip" rows="2" placeholder="Spacing, watering, when to pick…">${esc(c.tip)}</textarea>
    <div class="fm-lbl">When you harvest, try…</div><textarea class="fm-in" id="np-idea" rows="2" placeholder="Your favourite way to eat it">${esc(c.idea)}</textarea>
    <div class="fm-lbl">Plant next (optional)</div>
    <select class="fm-in" id="np-nx"><option value="">— None —</option>${nxOpts.map(k=>`<option value="${k}"${c.nx===k?' selected':''}>${P[k].n}</option>`).join('')}</select>
    <div class="btn-row" style="margin-top:16px"><button class="btn btn-cancel" onclick="${back}">← Back</button><button class="btn btn-seed" onclick="saveNewPlant()">${editKey?'💾 Save':'🌱 Save & plant'}</button></div>
  </div>`);
  if(!editKey&&!('ontouchstart' in window))setTimeout(()=>$(q?'np-h':'np-n')?.focus(),50);
}
function npCat(k){_np.cat=k;document.querySelectorAll('.fm-cat').forEach(b=>b.classList.toggle('sel',b.dataset.cat===k));}
function saveNewPlant(){
  const v=id=>$(id).value.trim();
  const n=v('np-n');if(!n){toast('Give your plant a name');$('np-n').focus();return;}
  if(!_np.key){
    const dup=Object.keys(P).find(k=>plantName(k).toLowerCase()===n.toLowerCase());
    if(dup){toast(`${plantName(dup)} is already in your list`);choosePlant(_np.bi,_np.ri,_np.ci,dup);return;}
  }
  let key=_np.key;
  if(!key){const base='c-'+(n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'plant');key=base;let i=2;while(P[key])key=base+'-'+i++;}
  ST.customPlants[key]={n,e:v('np-e')||'🌱',cat:_np.cat,h:v('np-h'),days:v('np-days'),pick:$('np-pick').checked,fam:v('np-fam'),tip:v('np-tip'),idea:v('np-idea'),nx:v('np-nx')};
  saveState();applyCustomPlants();
  if(_np.key){const{bi,ri,ci}=_np;refreshAll();openCellSheet(bi,ri,ci);toast('Saved '+n);}
  else choosePlant(_np.bi,_np.ri,_np.ci,key);
}

// ── Varieties ── "Which tomato?" when planting, and to change a planted one's variety.
// change=true: called from a plant sheet (bi,ri,ci is the planted spot) — picking updates it instead of planting.
function openVarietyStep(bi,ri,ci,k,change){
  const pl=P[k],cur=change?getCell(bi,ri,ci).v:null;
  const vs=[...varietiesOf(k)].sort((a,b)=>varietyInSeason(k,b)-varietyInSeason(k,a)||(b.tags||[]).includes('b')-(a.tags||[]).includes('b'));
  const pick=vid=>change?`setVariety(${bi},${ri},${ci},${vid?`'${vid}'`:'null'})`:`choosePlant(${bi},${ri},${ci},'${k}',${vid?`'${vid}'`:'null'})`;
  const card=v=>{const t={...timing(k),...(v.days?{days:v.days}:{}),...('pick' in v?{pick:v.pick}:{})},now=varietyInSeason(k,v);
    return `<button class="var-card${cur===v.id?' on':''}${now?'':' later'}" onclick="${pick(v.id)}"><div class="var-top"><span class="var-e">${v.e||pl.e}</span><span class="var-n">${esc(v.n)}</span><span class="var-d">~${t.days} days</span></div>
      ${v.tags?.length?`<div class="var-tags">${tagsHtml(v)}</div>`:''}<div class="var-note">${esc(v.note||'')}</div>${now?'':`<div class="var-later">💤 Plant ${monthsText(varietySow(k,v)||timing(k).sow)}</div>`}</button>`;};
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">${pl.e} Which ${pl.n.toLowerCase()}?</div><div class="sh-sub">Not sure? Any is fine — you can change it later</div></div><button class="sh-cancel" onclick="${change?`openCellSheet(${bi},${ri},${ci})`:'closeSheet()'}">✕ ${change?'Back':'Cancel'}</button></div></div>
    <div class="var-list">${vs.map(card).join('')}
      <button class="var-card any${change&&!cur?' on':''}" onclick="${pick(null)}"><div class="var-top"><span class="var-e">🤷</span><span class="var-n">Not sure — any ${pl.n.toLowerCase()}</span></div><div class="var-note">Uses typical timing for ${pl.n.toLowerCase()}.</div></button>
      <button class="var-card mine" onclick="openMyVariety(${bi},${ri},${ci},'${k}',${!!change})"><div class="var-top"><span class="var-e">＋</span><span class="var-n">My own variety</span></div><div class="var-note">From a seed packet or nursery label — just the name, and days if it says.</div></button>
    </div>
    ${change?'':`<button class="btn btn-cancel btn-full" style="margin-top:10px" onclick="openPicker(${bi},${ri},${ci})">← Back to plants</button>`}</div>`);
}
function setVariety(bi,ri,ci,vid){
  setCell(bi,ri,ci,{v:vid});refreshAll();openCellSheet(bi,ri,ci);
  toast(`🏷️ ${vid?esc(varietyOf(getCell(bi,ri,ci).p,vid).n):'Variety cleared'}`);
}
// Your own variety: only a name (and optionally days); everything else comes from the crop
function openMyVariety(bi,ri,ci,k,change){
  const pl=P[k];
  showSheet(`<div class="sh-body"><div class="sh-heading">＋ My own ${pl.n.toLowerCase()}</div><div class="sh-sub">Everything else — pests, tips, recipes — comes from ${pl.n.toLowerCase()}</div>
    <div class="fm-lbl">Variety name</div><input class="fm-in" id="mv-n" maxlength="40" placeholder="e.g. Mortgage Lifter">
    <div class="fm-lbl">Days to harvest (optional)</div><input class="fm-in" id="mv-d" type="number" inputmode="numeric" min="7" max="400" placeholder="From the seed packet, e.g. 75">
    <label class="fm-check"><input type="checkbox" id="mv-p"${timing(k).pick?' checked':''}> Keeps producing — pick from it repeatedly</label>
    <div class="btn-row" style="margin-top:16px"><button class="btn btn-cancel" onclick="openVarietyStep(${bi},${ri},${ci},'${k}',${change})">← Back</button><button class="btn btn-seed" onclick="saveMyVariety(${bi},${ri},${ci},'${k}',${change})">Save</button></div></div>`);
  if(!('ontouchstart' in window))setTimeout(()=>$('mv-n')?.focus(),50);
}
function saveMyVariety(bi,ri,ci,k,change){
  const n=$('mv-n').value.trim();if(!n){toast('Give it a name');$('mv-n').focus();return;}
  const list=ST.customVarieties[k]??=[];
  const same=varietiesOf(k).find(v=>v.n.toLowerCase()===n.toLowerCase());
  let id=same?.id;
  if(!id){const base='cv-'+(n.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'variety');id=base;let i=2;while(varietyOf(k,id))id=base+'-'+i++;
    const d=parseInt($('mv-d').value,10);
    list.push({id,n,s:n.length>12?n.slice(0,11)+'…':n,...(d>0?{days:d}:{}),pick:$('mv-p').checked,note:'Your own variety'});saveState();}
  change?setVariety(bi,ri,ci,id):choosePlant(bi,ri,ci,k,id);
}
