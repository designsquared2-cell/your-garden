// This Month: what's in the beds — each bed's plants, their stage and when they'll be ready.
// (Jobs live in Jobs, plant information in Plants, pests in Pests.)
'use strict';
function monthIntro(){
  if(!ST.beds.length)return'No beds yet — add one on the Beds tab to start planning.';
  const cells=plantedCells(),n=cells.length;
  if(!n)return'Nothing planted yet.';
  const ready=cells.filter(x=>['ready','bolting'].includes(x.cell.s)).length;
  const soon=cells.filter(x=>{const e=expectedDate(x.cell);return['seed','seedling','growing'].includes(x.cell.s)&&e&&daysBetween(localDate(),e)>0&&daysBetween(localDate(),e)<=30;}).length;
  return `${plural(n,'plant')} in the ground${ready?` · ${ready} ready to pick`:''}${soon?` · ${soon} ready within a month`:''}.`;
}
function bedRecapHtml(){
  return ST.beds.map((bed,bi)=>{
    const groups=new Map();
    plantedCells().filter(x=>x.bi===bi).forEach(({cell})=>{
      const k=cell.p+':'+cell.s;if(!groups.has(k))groups.set(k,{cell,n:0,picks:0});
      const g=groups.get(k);g.n++;g.picks+=cell.picks||0;
    });
    const rows=[...groups.values()].map(({cell,n,picks})=>{
      const pl=P[cell.p],days=cell.d?daysBetween(cell.d,localDate()):null;
      const hw={ready:'harvest now',bolting:'harvest now!',done:'finished'}[cell.s]||readyLabel(cell);
      const meta=[STLBL[cell.s],n>1?`×${n}`:'',days==null?'':days===0?'planted today':days===1?'1 day in':`${days} days in`,picks?`🧺 ${plural(picks,'pick')}`:''].filter(Boolean).join(' · ');
      return `<div class="recap-row"><div class="recap-ico">${pl.e}</div><div><div class="recap-nm">${pl.n}</div><div class="recap-st">${meta}</div></div><div class="recap-hw">${hw}</div></div>`;
    });
    const e=emptyCells(bi).length;
    if(e)rows.push(`<div class="recap-row"><div class="recap-ico">▫️</div><div><div class="recap-nm">${plural(e,'empty spot')}</div><div class="recap-st">available to plant</div></div></div>`);
    return `<div class="recap-block"><div class="recap-hdr rh${bi%3+1}">${esc(bed.name)}</div>${rows.join('')}</div>`;
  }).join('');
}
function renderMonthly(){
  const m=curMonth(),recap=bedRecapHtml();
  $('month-content').innerHTML=`<div class="mv-heading">${MONTHS[m]}</div><div class="mv-intro">${monthIntro()}</div>
    ${recap?`<div class="mv-section"><div class="mv-st">🌿 What's in the beds</div>${recap}</div>`:''}`;
}
