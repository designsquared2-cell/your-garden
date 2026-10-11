// Plants tab: seasonal stories, guides for what's in the beds, empty-spot suggestions, harvest log.
'use strict';

// ── Bed-aware suggestions ── scores in-season plants by what already grows in the same bed
function suggestForBed(bi,n=3){
  const here=[...new Set(plantedCells().filter(x=>x.bi===bi).map(x=>x.cell.p))];
  const fams=new Set(here.map(familyOf).filter(Boolean));
  const lowOnly=/low/i.test(ST.beds[bi].hint||'');
  const sc={};
  const add=(k,pts,why)=>{if(!P[k]||!inSeason(k)||(lowOnly&&TALL.includes(k)))return;(sc[k]??={k,s:0,why:[]}).s+=pts;sc[k].why.push(why);};
  here.forEach(k=>{if(P[k].nx)add(P[k].nx,3,`follows ${plantName(k)}`);});
  Object.keys(P).forEach(k=>{const f=familyOf(k);if(f&&fams.has(f)&&!here.includes(k))add(k,2,`fits with the ${FAM_LBL[f]}`);});
  here.forEach(k=>add(k,1,`matches the ${plantName(k)} already here`));
  if(!here.some(k=>COMPANIONS.includes(k)))add('marigold',1,'companion to keep pests down');
  return Object.values(sc).sort((a,b)=>b.s-a.s).slice(0,n).map(x=>({k:x.k,why:x.why[0]}));
}
function goToEmpty(bi){
  const e=emptyCells(bi)[0];if(!e)return;
  closeSheet();setView('beds');
  const el=$(`cell-${bi}-${e.ri}-${e.ci}`);
  el?.scrollIntoView({behavior:'smooth',block:'center'});el?.classList.add('selected');
  setTimeout(()=>{el?.classList.remove('selected');openPicker(bi,e.ri,e.ci);},450);
}

function renderPlants(){
  const m=curMonth(),td=localDate();
  const here=new Set(plantedCells().map(x=>x.cell.p));
  const stories=(STORIES[m]||[]).map(s=>storyCardHtml(s,here)).join('')||upcomingCardHtml(td);
  const guides=[...here].map(k=>plantGuideHtml(k,td)).join('');
  const empties=allCells().filter(x=>isEmpty(x.cell)).length;
  $('plants-content').innerHTML=`${stories}
    ${guides?`<div class="pv-sec-title">🌿 What's in your beds</div>${guides}`:'<div class="pv-none">Nothing planted yet. Tap an empty spot in Beds to get started.</div>'}
    ${empties?nudgeHtml(empties):''}
    ${harvestLogHtml()}`;
}

function storyCardHtml(story,here){
  const on=story.checkBeds.some(k=>here.has(k))&&story.trackTitle;
  const cls=on?'sb-track':story.badgeType==='harvest'?'sb-harvest':'sb-plant';
  return `<div class="story-card"><span class="story-badge ${cls}">${on?'ON TRACK':story.badge}</span><div class="story-emojis">${story.emoji}</div><div class="story-title">${on?story.trackTitle:story.title}</div><div class="story-text">${on?story.trackStory:story.story}</div><div class="story-harvest">${story.harvest}</div></div>`;
}
// Months without a hand-written story get a "coming up" card built from expected harvest dates
function upcomingCardHtml(td){
  const soon=new Map();
  plantedCells().forEach(({cell})=>{
    if(['ready','bolting','done'].includes(cell.s))return;
    const exp=expectedDate(cell);if(!exp||daysBetween(td,exp)>45)return;
    if(!soon.has(cell.p)||exp<soon.get(cell.p))soon.set(cell.p,exp);
  });
  const ready=[...new Set(plantedCells().filter(x=>x.cell.s==='ready').map(x=>x.cell.p))];
  if(!soon.size&&!ready.length)return'';
  const list=[...soon].sort((a,b)=>a[1]<b[1]?-1:1);
  return `<div class="story-card"><span class="story-badge sb-track">COMING UP</span><div class="story-emojis">${[...ready,...list.map(x=>x[0])].slice(0,4).map(k=>P[k].e).join(' ')}</div><div class="story-title">${ready.length?`${ready.map(k=>P[k].n).join(', ')} ready now`:'Your next harvests'}</div><div class="story-text">${list.length?list.map(([k,d])=>`${P[k].n} — around ${fmtDate(d)}`).join('<br>'):'Keep picking what\'s ready — the more you pick, the more you get.'}</div></div>`;
}
function plantGuideHtml(k,td){
  const pl=P[k],cells=plantedCells().filter(x=>x.cell.p===k);
  const picks=ST.log.filter(l=>l.p===k).length;
  // Most advanced cell wins: ready beats picking season beats a future date
  const rank=c=>['ready','bolting'].includes(c.s)?0:c.s==='done'?3:expectedDate(c)&&expectedDate(c)<=td?1:2;
  const lead=cells.map(x=>x.cell).sort((a,b)=>rank(a)-rank(b)||(expectedDate(a)||'z').localeCompare(expectedDate(b)||'z'))[0];
  const when=readyLabel(lead);
  return `<div class="bpc"><div class="bpc-top"><div class="bpc-emoji">${pl.e}</div><div><div class="bpc-name">${pl.n}</div><div class="bpc-hw">${when}${picks?` · 🧺 ${plural(picks,'pick')}`:''}</div></div></div><div class="bpc-body"><div class="bpc-tip">${pl.tip}</div><div class="bpc-harvest"><div class="bpc-harvest-lbl">When you harvest, try…</div><div class="bpc-harvest-txt">${pl.idea}</div></div></div></div>`;
}
function nudgeHtml(count){
  const rows=ST.beds.map((bed,bi)=>{
    const n=emptyCells(bi).length;if(!n)return'';
    const sug=suggestForBed(bi);
    return `<button class="nudge-bed" onclick="goToEmpty(${bi})"><div class="nudge-bed-top"><span>${bed.name}</span><span class="nudge-cnt">${n} empty ›</span></div>${sug.length?`<div class="nudge-plants">${sug.map(s=>`<div class="nudge-plant"><div>${P[s.k].e}</div><div>${P[s.k].n}</div><div class="nudge-why">${esc(s.why)}</div></div>`).join('')}</div>`:''}</button>`;
  }).join('');
  return `<div class="nudge"><div class="nudge-title">You've got ${plural(count,'empty spot')} 🌱</div><div class="nudge-sub">Suggestions based on what's already growing in each bed</div>${rows}<div class="nudge-hint">Tap a bed to jump to its empty spot</div></div>`;
}
function harvestLogHtml(){
  if(!ST.log.length)return'';
  const mk=localDate().slice(0,7),month=ST.log.filter(l=>l.d.startsWith(mk));
  const counts={};month.forEach(l=>counts[l.p]=(counts[l.p]||0)+1);
  const recent=ST.log.slice(-8).reverse();
  return `<div class="pv-sec-title" style="margin-top:16px">🧺 Harvest log</div><div class="hlog">
    <div class="hlog-sum">${month.length?`${MONTHS[curMonth()]}: ${Object.entries(counts).map(([k,n])=>`${P[k]?.e||'🌱'} ${plantName(k)} ×${n}`).join(' · ')}`:'Nothing picked yet this month.'}</div>
    ${recent.map(l=>`<div class="hlog-row"><span>${P[l.p]?.e||'🌱'} ${P[l.p]?.n||esc(l.p)}${l.f?' <span class="hlog-f">finished</span>':''}</span><span class="hlog-d">${fmtDate(l.d)} · ${esc(ST.beds[l.b]?.name.split(' — ')[0]||'')}</span></div>`).join('')}
  </div>`;
}
