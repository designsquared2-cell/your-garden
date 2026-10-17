// Plants tab: plant information only — what to plant now, guides for what you're growing, and the plant library.
'use strict';

// ── Bed-aware suggestions ── scores in-season plants by what already grows in the same bed
function suggestForBed(bi,n=3){
  const here=[...new Set(plantedCells().filter(x=>x.bi===bi).map(x=>x.cell.p))];
  const fams=new Set(here.map(familyOf).filter(Boolean));
  const lowOnly=!!ST.beds[bi].low;
  const sc={};
  const add=(k,pts,why)=>{if(!P[k]||!inSeason(k)||(lowOnly&&TALL.includes(k)))return;(sc[k]??={k,s:0,why:[]}).s+=pts;sc[k].why.push(why);};
  here.forEach(k=>{if(P[k].nx)add(P[k].nx,3,`follows ${plantName(k)}`);});
  Object.keys(P).forEach(k=>{const f=familyOf(k);if(f&&fams.has(f)&&!here.includes(k))add(k,2,`fits with the ${FAM_LBL[f]}`);});
  here.forEach(k=>add(k,1,`matches the ${plantName(k)} already here`));
  if(!here.some(k=>COMPANIONS.includes(k)))add('marigold',1,'companion to keep pests down');
  const past=new Set(bedHistory(bi,365).map(h=>familyOf(h.p)).filter(Boolean));
  Object.values(sc).forEach(x=>{if(past.has(familyOf(x.k)))x.s-=3;});
  const ok=Object.values(sc).filter(x=>x.s>0);
  // after a bed's history, the next family in the rotation is a good fit
  if(past.size)[...COOL_VEG,...WARM_VEG].forEach(k=>{const f=familyOf(k);if(f&&!past.has(f)&&[...past].some(p=>(ROTATION_NEXT[p]||[]).includes(f))&&inSeason(k)&&!(lowOnly&&TALL.includes(k))&&!ok.some(x=>x.k===k))ok.push({k,s:1.5,why:['good rotation for this bed']});});
  return ok.sort((a,b)=>b.s-a.s).slice(0,n).map(x=>({k:x.k,why:x.why[0]}));
}
function goToEmpty(bi){
  const e=emptyCells(bi)[0];if(!e)return;
  closeSheet();setView('beds');
  const el=$(`cell-${bi}-${e.ri}-${e.ci}`);
  el?.scrollIntoView({behavior:'smooth',block:'center'});el?.classList.add('selected');
  setTimeout(()=>{el?.classList.remove('selected');openPicker(bi,e.ri,e.ci);},450);
}

// ── Plants tab ──
let _libQ='';
function renderPlants(){
  const m=curMonth(),td=localDate();
  const here=new Set(plantedCells().map(x=>x.cell.p));
  const stories=(STORIES[m]||[]).map(s=>storyCardHtml(s,here)).join('');
  const now=[...COOL_VEG,...WARM_VEG,...HERBS].filter(k=>!P[k].custom&&inSeason(k,m));
  const guides=[...here].map(k=>plantGuideHtml(k,td)).join('');
  $('plants-content').innerHTML=`<div class="mv-heading">Plants</div>
    <div class="mv-intro">What to plant now, how your plants are doing, and everything in the plant library.</div>
    ${stories}
    ${now.length?`<div class="mv-section"><div class="mv-st">🌱 Plant now in ${MONTHS[m]}</div><div class="sow-chips">${now.map(k=>`<button class="sow-chip" onclick="openPlantInfo('${k}')">${P[k].e} ${P[k].n}</button>`).join('')}</div></div>`:''}
    ${seedBoxHtml()}
    <div class="mv-section"><div class="mv-st">🌿 What you're growing</div>${guides||`<div class="pv-none">${ST.beds.length?'Nothing planted yet — tap an empty spot in Beds to plant.':'No beds yet — add one on the Beds tab.'}</div>`}</div>
    <div class="mv-section"><div class="mv-st">📚 Plant library</div>
      <input class="pick-search" id="lib-q" type="search" placeholder="🔍 Search all plants…" autocomplete="off" value="${esc(_libQ)}" oninput="_libQ=this.value;renderLibrary()">
      <div id="lib-list"></div></div>`;
  renderLibrary();
}
function storyCardHtml(story,here){
  const on=story.checkBeds.some(k=>here.has(k))&&story.trackTitle;
  const cls=on?'sb-track':story.badgeType==='harvest'?'sb-harvest':'sb-plant';
  return `<div class="story-card"><span class="story-badge ${cls}">${on?'ON TRACK':story.badge}</span><div class="story-emojis">${story.emoji}</div><div class="story-title">${on?story.trackTitle:story.title}</div><div class="story-text">${on?story.trackStory:story.story}</div><div class="story-harvest">${story.harvest}</div></div>`;
}
function plantGuideHtml(k,td){
  const pl=P[k],cells=plantedCells().filter(x=>x.cell.p===k);
  const picks=ST.log.filter(l=>l.p===k),last=picks.at(-1);
  // Most advanced cell wins: ready beats picking season beats a future date
  const rank=c=>['ready','bolting'].includes(c.s)?0:c.s==='done'?3:expectedDate(c)&&expectedDate(c)<=td?1:2;
  const lead=cells.map(x=>x.cell).sort((a,b)=>rank(a)-rank(b)||(expectedDate(a)||'z').localeCompare(expectedDate(b)||'z'))[0];
  return `<div class="bpc" onclick="openGrowing('${k}')"><div class="bpc-top"><div class="bpc-emoji">${pl.e}</div><div><div class="bpc-name">${pl.n}</div><div class="bpc-hw">${readyLabel(lead)}${picks.length?` · 🧺 ${plural(picks.length,'pick')}, last ${fmtDate(last.d)}`:''}</div></div></div><div class="bpc-body"><div class="bpc-tip">${pl.tip}</div><div class="bpc-harvest"><div class="bpc-harvest-lbl">When you harvest, try…</div><div class="bpc-harvest-txt">${pl.idea}</div></div></div></div>`;
}
function renderLibrary(){
  const t=_libQ.trim().toLowerCase(),m=curMonth();
  const groups=seasonCats(m).map(([cat,keys])=>{
    const ks=keys.filter(k=>P[k]&&(!t||plantName(k).toLowerCase().includes(t)));
    return ks.length?`<div class="lib-cat">${CAT_LBL[cat]}</div><div class="lib-grid">${ks.map(k=>`<button class="lib-item" onclick="openPlantInfo('${k}')"><span>${P[k].e}</span><span class="lib-n">${P[k].n}</span>${inSeason(k,m)?'<span class="lib-dot" aria-label="plant now"></span>':''}</button>`).join('')}</div>`:'';
  }).join('');
  $('lib-list').innerHTML=groups?`<div class="lib-key"><span class="lib-dot"></span> plant now in ${MONTHS[m]}</div>${groups}`
    :`<div class="set-txt">No plants match “${esc(_libQ)}”. You can add your own when planting an empty spot.</div>`;
}
// Plant info sheet: everything about one plant
function openPlantInfo(k){
  const pl=P[k],t=timing(k),m=curMonth();
  const growing=plantedCells().filter(x=>x.cell.p===k);
  const fam=familyOf(k);
  const facts=[
    ['When to plant',t.sow?(t.sow.length===12?'All year':monthsText(t.sow)):'—'],
    ['Ready in',t.days?`about ${t.days} days from seed`:'—'],
    ['Harvest',pl.h],
    ['Harvesting',t.pick?'Keeps producing — pick often':'One harvest, then pull'],
  ];
  const pests=pestsFor(k);
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div class="pi-hdr"><span class="sh-pe">${pl.e}</span><div><div class="sh-pn">${pl.n}</div><div class="sh-sub">${inSeason(k,m)?'<span class="now-tag">plant now</span>':`Not the season to plant`}${fam?` · ${FAM_LBL[fam]}`:''}${growing.length?` · growing in ${[...new Set(growing.map(x=>esc(x.bed.name)))].join(', ')}`:''}</div></div></div><button class="sh-cancel" onclick="closeSheet()">✕ Close</button></div></div>
    <div class="pi-facts">${facts.map(([a,b])=>`<div><div class="sh-cl">${a}</div><div class="pi-v">${b}</div></div>`).join('')}</div>
    <div class="sh-tip">💡 ${pl.tip}</div>
    ${spacingHtml(k,null,ST.beds.length?0:-1)}
    ${readySignHtml(k)}
    ${recipesHtml(k)}
    ${pl.nx&&P[pl.nx]?`<div class="sh-next"><div class="sh-nl">→ Plant next</div><div class="sh-nv">${P[pl.nx].e} ${P[pl.nx].n} — ${P[pl.nx].h}</div></div>`:''}
    ${varietyListHtml(k)}
    ${behaviourHtml(k)}
    ${pests.length?`<div class="set-txt">🐛 Can be bothered by ${pests.map(p=>p.n.toLowerCase()).join(', ')}. <button class="link-btn" onclick="openPestsFor('${k}')">See the Pests tab ›</button></div>`:''}
  </div>`);
}
// Plant details: the varieties of this crop, beginner pick first
function varietyListHtml(k){
  const vs=[...varietiesOf(k)].sort((a,b)=>(b.tags||[]).includes('b')-(a.tags||[]).includes('b'));
  if(!vs.length)return'';
  return `<div class="stat-lbl">🏷️ Varieties</div><div class="var-list compact">${vs.map(v=>`<div class="var-card static"><div class="var-top"><span class="var-n">${esc(v.n)}</span><span class="var-d">~${v.days||timing(k).days} days</span></div>${v.tags?.length?`<div class="var-tags">${tagsHtml(v)}</div>`:''}<div class="var-note">${esc(v.note||'')}</div></div>`).join('')}</div>`;
}
