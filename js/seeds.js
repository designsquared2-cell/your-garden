// Seed box: the seed packets you own. The app tells you when they're in season, puts them first when
// planting, and warns before they expire. Packet: {id,p,v,vn,sowBy:'YYYY-MM',note,added}
'use strict';
function seedVariety(s){return varietyOf(s.p,s.v);}
function seedName(s){const v=seedVariety(s);return`${P[s.p]?.n||s.p}${v?` — ${v.n}`:s.vn?` — ${s.vn}`:''}`;}
function seedSow(s){return varietySow(s.p,seedVariety(s))||timing(s.p).sow;}
function seedInSeason(s,m=curMonth()){const sow=seedSow(s);return sow?sow.includes(m):true;}
// Use-by: months left until the end of the sow-by month (negative = expired)
function seedMonthsLeft(s){if(!s.sowBy)return null;const[y,mo]=s.sowBy.split('-').map(Number),d=new Date();return(y-d.getFullYear())*12+(mo-1-d.getMonth());}
function seedsReady(){return ST.seeds.filter(s=>P[s.p]&&seedInSeason(s)&&(seedMonthsLeft(s)??1)>=0);}

function seedRowHtml(s){
  const left=seedMonthsLeft(s),now=seedInSeason(s);
  const use=left==null?'':left<0?'<span class="seed-warn">⚠️ Past its sow-by date</span>':left<=2?`<span class="seed-warn">⏳ Sow by ${MONTHS[+s.sowBy.split('-')[1]-1].slice(0,3)} ${s.sowBy.split('-')[0]}</span>`:'';
  return`<button class="hv-row" onclick="openSeed('${s.id}')"><span class="hv-e">${seedVariety(s)?.e||P[s.p].e}</span><span class="hv-mid"><span class="hv-n">${esc(seedName(s))}</span><span class="hv-m">${now?'✅ Sow now':`Sow ${monthsText(seedSow(s))}`}${use?' · ':''}${use}${s.note?` · ${esc(s.note)}`:''}</span></span><span class="hv-go">›</span></button>`;
}
// Plants tab section
function seedBoxHtml(){
  const list=[...ST.seeds].filter(s=>P[s.p]).sort((a,b)=>seedInSeason(b)-seedInSeason(a)||seedName(a).localeCompare(seedName(b)));
  return`<div class="mv-section" id="seed-box"><div class="mv-st">🌰 My seed box</div>
    ${list.length?`<div class="hv-list">${list.map(seedRowHtml).join('')}</div>`:'<div class="set-txt">Keep track of the seed packets you own — we\'ll tell you when to sow them and warn you before they expire.</div>'}
    <button class="add-bed" style="margin-top:8px" onclick="openSeedForm()">＋ Add a seed packet</button></div>`;
}
function openSeedBox(){setView('plants');setTimeout(()=>$('seed-box')?.scrollIntoView({behavior:'smooth',block:'start'}),60);}

// One packet: plant it, edit it, or mark it used up
function openSeed(id){
  const s=ST.seeds.find(x=>x.id===id);if(!s)return;
  const left=seedMonthsLeft(s);
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div class="pi-hdr"><span class="sh-pe">${seedVariety(s)?.e||P[s.p].e}</span><div><div class="sh-pn">${esc(seedName(s))}</div><div class="sh-sub">${seedInSeason(s)?'<span class="now-tag">sow now</span>':`Sow ${monthsText(seedSow(s))}`}</div></div></div><button class="sh-cancel" onclick="closeSheet()">✕ Close</button></div></div>
    <div class="pi-facts"><div><div class="sh-cl">Sow by</div><div class="pi-v">${s.sowBy?`${MONTHS[+s.sowBy.split('-')[1]-1].slice(0,3)} ${s.sowBy.split('-')[0]}${left<0?' ⚠️':''}`:'—'}</div></div><div><div class="sh-cl">Ready in</div><div class="pi-v">~${(seedVariety(s)?.days||timing(s.p).days||'?')} days</div></div></div>
    ${s.note?`<div class="sh-tip">📝 ${esc(s.note)}</div>`:''}
    ${left!=null&&left<0?'<div class="set-txt">Old seed often still comes up, just less reliably — sow a little more thickly than usual.</div>':''}
    ${allCells().some(x=>isEmpty(x.cell))?`<button class="btn btn-seed btn-full" style="margin-bottom:8px" onclick="plantFromSeed('${s.id}')">🌱 Plant from this packet</button>`:'<div class="set-txt">No empty spots right now — clear or add a bed to plant it.</div>'}
    <div class="btn-row"><button class="btn btn-cancel" onclick="openSeedForm('${s.id}')">✏️ Edit</button><button class="btn btn-cancel" onclick="removeSeed('${s.id}')">🗑️ Used up</button></div></div>`);
}
// Plant into the best empty spot: a bed that suggests this crop, otherwise the first empty spot
function plantFromSeed(id){
  const s=ST.seeds.find(x=>x.id===id);if(!s)return;
  const beds=ST.beds.map((b,bi)=>bi).filter(bi=>emptyCells(bi).length);if(!beds.length)return;
  const bi=beds.find(bi=>suggestForBed(bi,6).some(x=>x.k===s.p))??beds[0],e=emptyCells(bi)[0];
  closeSheet();setView('beds');
  const el=$(`cell-${bi}-${e.ri}-${e.ci}`);el?.scrollIntoView({behavior:'smooth',block:'center'});el?.classList.add('selected');
  setTimeout(()=>{el?.classList.remove('selected');choosePlant(bi,e.ri,e.ci,s.p,s.v||null);},450);
}
function removeSeed(id){snapshot();ST.seeds=ST.seeds.filter(x=>x.id!==id);saveState();closeSheet();renderView();toast('🌰 Packet removed',{undo:true});}

// Add / edit a packet
function openSeedForm(id){
  const s=id?ST.seeds.find(x=>x.id===id):{p:'',v:null,vn:'',sowBy:'',note:''};
  const crops=Object.keys(P).sort((a,b)=>P[a].n.localeCompare(P[b].n));
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">🌰 ${id?'Edit packet':'Add a seed packet'}</div><div class="sh-sub">Everything's on the back of the packet</div></div><button class="sh-cancel" onclick="${id?`openSeed('${id}')`:'closeSheet()'}">✕ Cancel</button></div></div>
    <div class="fm-lbl">Plant</div><select class="fm-in" id="sd-p" onchange="seedVarOptions()"><option value="">Choose a plant…</option>${crops.map(k=>`<option value="${k}"${s.p===k?' selected':''}>${P[k].e} ${P[k].n}</option>`).join('')}</select>
    <div id="sd-vwrap"></div>
    <div class="fm-lbl">Sow by (optional)</div><input class="fm-in date-in" id="sd-by" type="month" value="${s.sowBy||''}">
    <div class="fm-lbl">Note (optional)</div><input class="fm-in" id="sd-note" maxlength="60" placeholder="e.g. half a packet, from Diggers" value="${esc(s.note||'')}">
    <button class="btn btn-seed btn-full" style="margin-top:16px" onclick="saveSeed(${id?`'${id}'`:'null'})">${id?'💾 Save':'＋ Add to seed box'}</button></div>`);
  seedVarOptions(s.v||(s.vn?'__own':''),s.vn);
}
function seedVarOptions(sel,own){
  const k=$('sd-p').value,vs=k?varietiesOf(k):[];
  $('sd-vwrap').innerHTML=k?`<div class="fm-lbl">Variety (optional)</div><select class="fm-in" id="sd-v" onchange="$('sd-vn').style.display=this.value==='__own'?'block':'none'"><option value="">Not sure / not listed</option>${vs.map(v=>`<option value="${v.id}"${sel===v.id?' selected':''}>${esc(v.n)}</option>`).join('')}<option value="__own"${sel==='__own'?' selected':''}>Type a variety name…</option></select>
    <input class="fm-in" id="sd-vn" maxlength="40" placeholder="Variety name from the packet" value="${esc(own||'')}" style="margin-top:6px;display:${sel==='__own'?'block':'none'}">`:'';
}
function saveSeed(id){
  const p=$('sd-p').value;if(!p){toast('Choose a plant first');return;}
  const vsel=$('sd-v')?.value||'',vn=vsel==='__own'?$('sd-vn').value.trim():'';
  const data={p,v:vsel&&vsel!=='__own'?vsel:null,vn,sowBy:$('sd-by').value||'',note:$('sd-note').value.trim()};
  if(id)Object.assign(ST.seeds.find(x=>x.id===id),data);else ST.seeds.push({id:newId(),added:localDate(),...data});
  saveState();closeSheet();renderView();toast(`🌰 ${id?'Saved':'Added'} ${seedName(data)}`);
}

// Jobs: what to sow from the box now, and packets about to go out of date
function seedItems(m){
  const out=[],ready=seedsReady(),empties=allCells().filter(x=>isEmpty(x.cell)).length;
  if(ready.length)out.push({kind:'auto',id:'seeds-now',type:'soon',cb:false,icon:'🌰',
    title:`🌰 Sow from your seed box: ${ready.slice(0,3).map(s=>esc(seedName(s))).join(', ')}${ready.length>3?` +${ready.length-3} more`:''}`,
    detail:empties?`In season now, and you have ${plural(empties,'empty spot')}.`:'In season now — clear a spot or add a bed to sow them.',
    btn:{label:'Seed box ›',js:'openSeedBox()'}});
  const old=ST.seeds.filter(s=>P[s.p]&&seedMonthsLeft(s)!=null&&seedMonthsLeft(s)>=0&&seedMonthsLeft(s)<=2&&!seedInSeason(s));
  if(old.length)out.push({kind:'auto',id:'seeds-old',type:'coming',cb:false,icon:'⏳',
    title:`⏳ ${old.length===1?'A packet is near its':`${old.length} packets are near their`} sow-by date`,
    detail:`${old.map(s=>esc(seedName(s))).join(', ')} — they're out of season now, so plan to swap them or sow next season knowing they may be less reliable.`,
    btn:{label:'Seed box ›',js:'openSeedBox()'}});
  return out;
}
