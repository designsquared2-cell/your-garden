// Spacing per spot, and crop rotation: remembering what grew in each spot, warning when the same family
// goes back too soon, and a per-bed "new season" view.
'use strict';

// ── Spacing ──
function perSpotFor(k,vid){return varietyOf(k,vid)?.perSpot||PER_SPOT[k]||1;}
function spotsFor(k,vid){return varietyOf(k,vid)?.spots||SPOTS[k]||1;}
// "16 per spot — about 7cm apart", scaled to the bed's spot size
function spacingText(k,vid,bi){
  const spot=ST.beds[bi]?.spot||30,spots=spotsFor(k,vid);
  if(spots>1)return`One plant needs about ${spots} spots — leave the spots around it empty.`;
  // bigger spots fit more small plants — but a plant that needs a whole spot still gets one
  const base=perSpotFor(k,vid),n=base===1?1:Math.max(1,Math.round(base*(spot/30)**2));
  return n===1?`1 per spot (spots are ${spot}cm)`:`${n} per spot — about ${Math.round(spot/Math.sqrt(n))}cm apart`;
}
function spacingHtml(k,vid,bi){return`<div class="spacing">📏 <b>Spacing:</b> ${spacingText(k,vid,bi)}</div>`;}

// ── Rotation ──
const ROTATE_DAYS=365*2; // same family back in the same spot within 2 years → warn
// The classic 4-step rotation: legumes feed the soil → leafy brassicas use it → roots & onions → fruiting crops
const ROTATION_NEXT={legume:['brassica','leafy'],brassica:['root','allium'],leafy:['root','allium'],root:['nightshade','cucurbit'],allium:['nightshade','cucurbit'],nightshade:['legume'],cucurbit:['legume']};
function spotHistory(bi,ri,ci){const id=ST.beds[bi].id;return ST.history.filter(h=>h.bid===id&&h.ri===ri&&h.ci===ci);}
function bedHistory(bi,days=ROTATE_DAYS){const id=ST.beds[bi].id;return ST.history.filter(h=>h.bid===id&&daysBetween(h.end,localDate())<=days);}
// Same family in this spot recently? Returns the history entry, or null
function rotationClash(k,bi,ri,ci){
  const f=familyOf(k);if(!f||ri==null)return null;
  return spotHistory(bi,ri,ci).filter(h=>familyOf(h.p)===f&&daysBetween(h.end,localDate())<=ROTATE_DAYS).sort((a,b)=>b.end.localeCompare(a.end))[0]||null;
}
function rotationHeadsUpHtml(k,bi,ri,ci){
  const h=rotationClash(k,bi,ri,ci);if(!h)return'';
  const f=familyOf(k),next=(ROTATION_NEXT[f]||[]).map(x=>FAM_LBL[x]).join(' or ');
  return`<div class="hu-row bad">🔄 ${h.p===k?P[k].n:`${P[h.p].n} — the same family as ${P[k].n.toLowerCase()} —`} grew in this spot until ${fmtDate(h.end)}. Swapping families each season stops pests and diseases building up${next?` — ${next} would suit this spot better`:''}.</div>`;
}
// Families grown in a bed recently (history + what's in it now)
function bedFamilies(bi){
  const fams=new Map();
  bedHistory(bi).forEach(h=>{const f=familyOf(h.p);if(f&&(!fams.has(f)||fams.get(f)<h.end))fams.set(f,h.end);});
  plantedCells().filter(x=>x.bi===bi).forEach(x=>{const f=familyOf(x.cell.p);if(f)fams.set(f,'now');});
  return fams;
}
// The per-bed season sheet: what grew here, what should come next, and a one-tap end-of-season clear
function openRotation(bi){
  const bed=ST.beds[bi],fams=bedFamilies(bi),here=[...fams.keys()];
  const next=[...new Set(here.flatMap(f=>ROTATION_NEXT[f]||[]))].filter(f=>!here.includes(f));
  const hist=bedHistory(bi).slice().reverse();const byCrop=new Map();hist.forEach(h=>{if(!byCrop.has(h.p))byCrop.set(h.p,h.end);});
  const planted=plantedCells().filter(x=>x.bi===bi).length;
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">🔄 ${esc(bed.name)} — rotation</div><div class="sh-sub">Moving plant families around stops pests and diseases building up in the soil</div></div><button class="sh-cancel" onclick="openBedEditor(${bi})">✕ Back</button></div></div>
    <div class="stat-lbl">Grown here (last 2 years)</div>
    ${here.length?`<div class="rot-list">${here.map(f=>`<div class="rot-row"><span>${FAM_LBL[f][0].toUpperCase()+FAM_LBL[f].slice(1)}</span><span class="hlog-d">${fams.get(f)==='now'?'growing now':'until '+fmtDate(fams.get(f))}</span></div>`).join('')}</div>`:'<div class="set-txt">Nothing recorded yet — the app remembers each spot from now on.</div>'}
    ${byCrop.size?`<div class="set-txt" style="margin-top:6px">Past crops: ${[...byCrop.keys()].map(k=>P[k]?`${P[k].e} ${P[k].n}`:'').filter(Boolean).join(', ')}</div>`:''}
    <div class="stat-lbl" style="margin-top:12px">👍 Good to grow here next</div>
    <div class="set-txt">${next.length?next.map(f=>`<b>${FAM_LBL[f]}</b>`).join(', ')+' — '+[...COOL_VEG,...WARM_VEG].filter(k=>next.includes(familyOf(k))&&inSeason(k)).slice(0,6).map(k=>P[k].n).join(', ')+(next.length?' are in season now.':''):'Anything — there\'s no recent history to avoid.'}</div>
    <div class="set-txt"><b>The cycle:</b> beans & peas → leafy greens & brassicas → roots & onions → tomatoes, zucchini & friends → back to beans.</div>
    ${planted?`<button class="btn btn-reset btn-full" style="margin-top:12px" onclick="endSeason(${bi})">🧹 End of season — clear this bed</button><div class="sh-hint">Clears all ${plural(planted,'plant')}. They're remembered for rotation, and you can undo.</div>`:''}
  </div>`);
}
function endSeason(bi){
  snapshot();let n=0;
  ST.beds[bi].rows.forEach((row,ri)=>row.forEach((c,ci)=>{if(!isEmpty(c)){clearCell(bi,ri,ci);n++;}}));
  closeSheet();refreshAll();toast(`🧹 ${ST.beds[bi].name} cleared for the new season (${plural(n,'plant')})`,{undo:true});
}
