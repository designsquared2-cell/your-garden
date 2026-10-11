// This Month: the seasonal picture — what's happening, pests to watch, what to sow, what's in the beds.
// (Things to tick off live in the Jobs tab.)
'use strict';
function monthIntro(m){
  const n=plantedCells().length,ready=plantedCells().filter(x=>x.cell.s==='ready').length;
  if(!ST.beds.length)return'No beds yet — add one on the Beds tab to start planning.';
  return n?`${plural(n,'plant')} in the ground${ready?`, ${ready} ready to pick`:''}.`:'Nothing planted yet — see what you can sow below.';
}
function sowNowHtml(m){
  const ks=[...COOL_VEG,...WARM_VEG,...HERBS].filter(k=>!P[k].custom&&inSeason(k,m));
  if(!ks.length)return'';
  return `<div class="mv-section"><div class="mv-st">🌱 Sow & plant now</div><div class="sow-chips">${ks.map(k=>`<span class="sow-chip">${P[k].e} ${P[k].n}</span>`).join('')}</div></div>`;
}
function bedRecapHtml(){
  return ST.beds.map((bed,bi)=>{
    const rows=[],seen=new Set();
    plantedCells().filter(x=>x.bi===bi).forEach(({cell})=>{
      const k=cell.p+':'+cell.s;if(seen.has(k))return;seen.add(k);
      const pl=P[cell.p];
      const hw={ready:'harvest now',bolting:'harvest now!',done:'clear when ready'}[cell.s]||readyLabel(cell);
      rows.push(`<div class="recap-row"><div class="recap-ico">${pl.e}</div><div><div class="recap-nm">${pl.n}</div><div class="recap-st">${STLBL[cell.s]}</div></div><div class="recap-hw">${hw}</div></div>`);
    });
    const e=emptyCells(bi).length;
    if(e)rows.push(`<div class="recap-row"><div class="recap-ico">▫️</div><div><div class="recap-nm">${plural(e,'empty spot')}</div><div class="recap-st">available to plant</div></div></div>`);
    return `<div class="recap-block"><div class="recap-hdr rh${bi%3+1}">${esc(bed.name)}</div>${rows.join('')}</div>`;
  }).join('');
}
function renderMonthly(){
  const m=curMonth(),n=jobCount(),recap=bedRecapHtml();
  $('month-content').innerHTML=`<div class="mv-heading">${MONTHS[m]}</div><div class="mv-intro">${monthIntro(m)}</div>
    ${n?`<button class="jobs-link" onclick="setView('jobs')"><span>🐝 ${plural(n,'job')} to do</span><span>›</span></button>`:''}
    ${pestWatchHtml(m)}
    ${sowNowHtml(m)}
    ${recap?`<div class="mv-section"><div class="mv-st">🌿 What's in the beds</div>${recap}</div>`:''}`;
}
