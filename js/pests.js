// Pests & bugs: library, which ones are active this month, pest-check jobs, "spotted it" reports.
// Timing is typical for Perth / the Perth Hills; it shifts with the weather each year.
//   on:    plant keys, family names (see FAMILY), or '*seedlings' for anything at seed/seedling stage
//   months: when to watch (0 = Jan); peak: when it's worst
'use strict';
const PESTS=[
  {id:'cabbage-white',e:'🐛',n:'Cabbage white caterpillars',on:['brassica','nasturtium'],months:[8,9,10,11,0,1,2,3,4],peak:[8,9,10,2,3],
   look:'Velvety green caterpillars lying along the leaf veins, ragged holes, green droppings in the leaf joints. White butterflies with black spots hovering over the bed mean eggs are being laid.',
   where:'Undersides of leaves and the heart of the plant.',
   fix:'Pick them off and squash. Spray Bt (Dipel — only harms caterpillars) every 7 days while they\'re about. Strip badly eaten outer leaves.',
   prevent:'Cover brassicas with insect netting from planting day — it\'s the one thing that really works.'},
  {id:'diamondback',e:'🐛',n:'Diamondback moth caterpillars',on:['brassica'],months:[9,10,11,0,1,2,3],peak:[10,11,0,1],
   look:'Small pale-green caterpillars (to 1cm) that wriggle backwards and drop on a silk thread when touched. Leaves get see-through "windowpane" patches.',
   where:'Undersides of leaves, growing tips and inside heads.',
   fix:'Bt or spinosad sprays, alternated — they quickly become resistant to any one spray. Remove heavily infested plants.',
   prevent:'Fine insect netting. Flares up as the weather warms, so net early.'},
  {id:'aphids',e:'🐜',n:'Aphids',on:['brassica','leafy','legume','nightshade','cucurbit','basil','coriander','parsley','dill','calendula','nasturtium'],months:[7,8,9,10,2,3,4],peak:[8,9],
   look:'Clusters of tiny green, black or grey-waxy insects. Curled or puckered new leaves, sticky honeydew, and ants running up the stems.',
   where:'New shoots, flower buds and leaf undersides. Grey waxy ones hide deep in cabbage and kale leaves.',
   fix:'Blast off with the hose, squash by hand, or spray soap/eco-oil. Ladybirds and hoverflies will clean up the rest if you don\'t spray broad insecticides.',
   prevent:'Marigolds, alyssum and calendula nearby bring in the predators. Avoid over-feeding with nitrogen — soft growth attracts them.'},
  {id:'snails',e:'🐌',n:'Snails & slugs',on:['*seedlings','leafy','brassica','strawberry','basil'],months:[3,4,5,6,7,8,9],peak:[4,5,6,7],
   look:'Ragged holes, shiny slime trails, and seedlings that vanish overnight.',
   where:'Out at night and after rain; hiding under pots, boards and thick mulch by day.',
   fix:'Torch patrol after dark, beer traps, or iron-based pellets (safe around pets and wildlife).',
   prevent:'Protect new seedlings with collars or cloches through the wet months.'},
  {id:'cutworm',e:'🐛',n:'Cutworms',on:['*seedlings','tomatoes','cherry-tomato','capsicum','sweet-corn'],months:[7,8,9,10],peak:[8,9],
   look:'Seedlings chewed through at soil level overnight. Fat grey-brown grubs that curl into a C when dug up.',
   where:'Just under the soil surface around the stem.',
   fix:'Scratch the soil around damaged plants at dusk and remove the grubs.',
   prevent:'A cardboard collar (a toilet-roll tube) around each new seedling.'},
  {id:'earwigs',e:'🪳',n:'Earwigs',on:['*seedlings','basil','strawberry','leafy','dwarf-beans','climbing-beans'],months:[8,9,10,11,0,1,2],peak:[9,10,11],
   look:'Ragged holes in leaves and petals appearing overnight, with nothing visible during the day.',
   where:'Hiding in mulch, under pots and in tight leaf joints.',
   fix:'Trap them in rolled-up damp newspaper or a small tin of oil sunk to soil level; empty each morning.',
   prevent:'Pull mulch back from new seedlings until they\'re established.'},
  {id:'medfly',e:'🪰',n:'Mediterranean fruit fly (Medfly)',on:['tomatoes','cherry-tomato','capsicum','chilli','eggplant','strawberry'],months:[9,10,11,0,1,2,3,4],peak:[0,1,2,3],
   look:'Tiny sting marks on ripening fruit, soft sunken patches, then maggots inside. Mostly a fruit-tree pest, but fruiting veg can be stung.',
   where:'Ripening fruit, and fruit that\'s fallen to the ground.',
   fix:'Pick fruit as it ripens. Bag or bin stung and fallen fruit sealed — never compost it.',
   prevent:'Start bait traps in spring as the weather warms. Medfly control is mandatory in the Kalamunda and Mundaring shires.'},
  {id:'two-spot-mite',e:'🕷️',n:'Two-spotted mite',on:['legume','cucurbit','eggplant','tomatoes','cherry-tomato','strawberry'],months:[10,11,0,1,2],peak:[11,0,1],
   look:'Fine yellow or silvery speckling on leaves, then fine webbing underneath. Leaves turn bronze and dry out.',
   where:'Undersides of leaves — use a magnifier. Worst on dusty, water-stressed plants.',
   fix:'Hose the undersides of leaves every day or two (they hate humidity). Remove the worst leaves. Eco-oil if needed.',
   prevent:'Keep plants well watered and mulched through heatwaves, and keep dust down.'},
  {id:'russet-mite',e:'🕷️',n:'Tomato russet mite',on:['tomatoes','cherry-tomato','eggplant'],months:[11,0,1,2],peak:[0,1],
   look:'Lower leaves yellow, curl and dry; stems turn bronze and greasy-looking, working up the plant. Fruit skin goes leathery. Too small to see without a hand lens.',
   where:'Starts on the lowest leaves and stems.',
   fix:'Remove affected lower leaves early. Wettable sulphur controls them — but never spray it above about 30°C.',
   prevent:'Check the lower stems of tomatoes weekly from December.'},
  {id:'whitefly',e:'🦟',n:'Whitefly',on:['tomatoes','cherry-tomato','legume','cucurbit','brassica','eggplant'],months:[10,11,0,1,2,3],peak:[0,1,2],
   look:'Clouds of tiny white insects fly up when you brush the plant. Sticky leaves and black sooty mould.',
   where:'Undersides of leaves.',
   fix:'Yellow sticky traps, hose the undersides, eco-oil every week while they\'re bad.',
   prevent:'Hang a yellow sticky trap early in summer so you see them arrive.'},
  {id:'heliothis',e:'🐛',n:'Heliothis (tomato grub)',on:['tomatoes','cherry-tomato','sweet-corn','legume','capsicum','chilli'],months:[9,10,11,0,1,2,3],peak:[11,0,1],
   look:'Neat round holes bored into fruit and pods, droppings nearby, caterpillars in corn silks and flower buds.',
   where:'Fruit, pods, cobs and buds.',
   fix:'Bt sprayed while caterpillars are small; pick off larger ones; remove damaged fruit.',
   prevent:'Check fruit weekly once flowering starts.'},
  {id:'shield-bugs',e:'🪲',n:'Green vegetable bugs',on:['legume','tomatoes','cherry-tomato','capsicum','chilli','sweet-corn','eggplant'],months:[10,11,0,1,2],peak:[0,1],
   look:'Green shield-shaped bugs and clusters of spotty black-and-white nymphs. Wilting shoots, blemished fruit, pods that drop.',
   where:'Tips, pods and fruit — sunny side of the plant.',
   fix:'Early morning, while they\'re sluggish, knock them into a bucket of soapy water.',
   prevent:'Check and squash egg rafts (neat hexagon clusters) on leaf undersides.'},
  {id:'powdery-mildew',e:'🍄',n:'Powdery mildew',disease:true,on:['cucurbit','snow-peas','garden-peas'],months:[8,9,0,1,2,3],peak:[1,2],
   look:'White, flour-like patches on leaves that spread until leaves yellow and die.',
   where:'Older leaves first, especially in crowded, humid spots.',
   fix:'Remove the worst leaves. Spray weekly with 1 part milk to 9 parts water, or potassium bicarbonate.',
   prevent:'Water the soil, not the leaves, and give plants room for air to move.'},
  {id:'birds',e:'🐦',n:'Birds',on:['strawberry','snow-peas','garden-peas','brassica','*seedlings'],months:[8,9,10,11],peak:[9,10],
   look:'Fruit pecked as it colours, seedlings pulled out, pea shoots stripped.',
   where:'Ripening strawberries and fresh seedlings.',
   fix:'Net over a frame (so they can\'t reach through) as soon as fruit starts colouring.',
   prevent:'Net strawberries from flowering, and cover new seedlings for their first couple of weeks.'},
];
const PEST_BY_ID=Object.fromEntries(PESTS.map(p=>[p.id,p]));
const PEST_SNOOZE_DAYS=7,PEST_RECHECK_DAYS=3;

function pestOnPlant(pest,k){return pest.on.some(t=>t===k||FAMILY[t]?.includes(k));}
function pestHitsCell(pest,cell){
  if(isEmpty(cell)||cell.s==='done')return false;
  return pestOnPlant(pest,cell.p)||(pest.on.includes('*seedlings')&&(cell.s==='seed'||cell.s==='seedling'));
}
function pestsFor(k){return PESTS.filter(p=>pestOnPlant(p,k));}
function pestActive(pest,m=curMonth()){return pest.months.includes(m);}
function pestPeak(pest,m=curMonth()){return pest.peak.includes(m);}
function pestCells(pest){return plantedCells().filter(x=>pestHitsCell(pest,x.cell));}
// Pests active this month that could be on something you're growing now, peak first
function pestsToWatch(m=curMonth()){
  return PESTS.filter(p=>pestActive(p,m)&&pestCells(p).length).sort((a,b)=>pestPeak(b,m)-pestPeak(a,m));
}
function monthsText(ms){
  const runs=[];let s=null,prev=null;
  const order=[...ms].sort((a,b)=>a-b);
  // join consecutive months, wrapping Dec→Jan
  const has=m=>ms.includes((m+12)%12);
  let start=order.find(m=>!has(m-1));if(start==null)return'All year';
  for(let i=0,m=start;i<12;i++,m=(m+1)%12){if(has(m)){if(s==null)s=m;prev=m;}else if(s!=null){runs.push([s,prev]);s=null;}}
  if(s!=null)runs.push([s,prev]);
  return runs.map(([a,b])=>a===b?MONTHS[a].slice(0,3):`${MONTHS[a].slice(0,3)}–${MONTHS[b].slice(0,3)}`).join(', ');
}
function plantList(cells,max=3){
  const names=[...new Set(cells.map(x=>x.cell.p))].map(k=>P[k].n);
  return names.length>max?names.slice(0,max).join(', ')+` +${names.length-max} more`:names.join(', ');
}
function bedList(cells){return[...new Set(cells.map(x=>x.bed.name))].map(esc).join(', ');}

// ── Jobs ──
function pestDoneRecently(id){const d=ST.pestDone[id];return!!d&&daysBetween(d,localDate())<PEST_SNOOZE_DAYS;}
function pestCheckItems(m){
  return pestsToWatch(m).filter(p=>!pestDoneRecently(p.id)&&!ST.pestReports.some(r=>r.pest===p.id)).map(p=>{
    const cells=pestCells(p);
    return{kind:'pest',id:p.id,type:'pest',cb:true,icon:p.e,
      title:`${p.e} Check for ${p.n.toLowerCase()} on ${plantList(cells)}${pestPeak(p,m)?' <span class="peak-tag">peak</span>':''}`,
      detail:`<b>Look for:</b> ${p.look} <b>Where:</b> ${p.where} <span class="task-where">${bedList(cells)}</span>`,
      btn:{label:'🐛 Found some',js:`openPestReport('${p.id}')`}};
  });
}
function treatItems(){
  return ST.pestReports.map((r,i)=>{
    const p=PEST_BY_ID[r.pest],bed=bedById(r.bid);if(!p)return null;
    return{kind:'treat',id:String(i),type:'urgent',cb:true,
      title:`${p.e} Treat ${p.n.toLowerCase()} on ${plantName(r.p)}${bed?` — ${esc(bed.name)}`:''}`,
      detail:`${p.fix} Tick once treated — we'll remind you to check again in ${PEST_RECHECK_DAYS} days.`};
  }).filter(Boolean);
}
function tickPest(id){ST.pestDone[id]=localDate();return`✓ All clear — next ${PEST_BY_ID[id].n.toLowerCase()} check in a week`;}
function tickTreat(i){
  const r=ST.pestReports.splice(+i,1)[0];if(!r)return'✓ Done';
  // back-date the check so it comes round again in PEST_RECHECK_DAYS
  ST.pestDone[r.pest]=addDays(localDate(),PEST_RECHECK_DAYS-PEST_SNOOZE_DAYS);
  return`✓ Treated — re-check in ${PEST_RECHECK_DAYS} days`;
}

// ── "That's it" / "Found some" → treatment job ──
function plantGroups(cells){const g=new Map();cells.forEach(x=>{const k=x.bi+':'+x.cell.p;if(!g.has(k))g.set(k,x);});return[...g.values()];}
function openPestReport(id,plant){
  const p=PEST_BY_ID[id];
  // Plants this pest usually attacks; if none (or a beginner's guess doesn't fit), let them pick any plant
  let opts=plantGroups(pestCells(p));
  if(plant)opts=opts.filter(x=>x.cell.p===plant);
  if(!opts.length)opts=plantGroups(plantedCells().filter(x=>!plant||x.cell.p===plant));
  if(opts.length===1){reportPest(id,opts[0].cell.p,opts[0].bi);return;}
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">${p.e} Where did you find it?</div><div class="sh-sub">We'll add a treatment job to Jobs</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Cancel</button></div></div>
    ${opts.map(x=>`<button class="loc-res" onclick="reportPest('${id}','${x.cell.p}',${x.bi})">${P[x.cell.p].e} ${P[x.cell.p].n} <span class="hlog-d">· ${esc(x.bed.name)}</span></button>`).join('')||'<div class="set-txt">Nothing planted yet.</div>'}
    <div class="pest-fix"><b>What to do:</b> ${p.fix}</div></div>`);
}
function reportPest(id,p,bi){
  const bid=ST.beds[bi].id;
  if(!ST.pestReports.some(r=>r.pest===id&&r.p===p&&r.bid===bid))ST.pestReports.push({pest:id,p,bid,d:localDate()});
  saveState();closeSheet();refreshAll();
  toast(`${PEST_BY_ID[id].e} Treatment job added to Jobs`);
}

// ── "What are you seeing?" ── beginners describe what they see; we suggest what it probably is
const SYMPTOMS=[
  {id:'green-cat',g:'see',e:'🐛',t:'Small green caterpillars'},
  {id:'white-fly-about',g:'see',e:'🦋',t:'White butterflies or small moths'},
  {id:'tiny-clusters',g:'see',e:'🐜',t:'Clusters of tiny insects'},
  {id:'ants',g:'see',e:'🐜',t:'Ants running up stems'},
  {id:'white-flies',g:'see',e:'🤍',t:'Tiny white flies when brushed'},
  {id:'snail',g:'see',e:'🐌',t:'Snails, slugs or slime trails'},
  {id:'grey-grub',g:'see',e:'🪱',t:'Fat grey grubs in the soil'},
  {id:'earwig',g:'see',e:'🪳',t:'Brown bugs with tail pincers'},
  {id:'shield-bug',g:'see',e:'🪲',t:'Green shield-shaped bugs'},
  {id:'webbing',g:'see',e:'🕸️',t:'Fine webbing under leaves'},
  {id:'maggots',g:'see',e:'🪰',t:'Maggots inside fruit'},
  {id:'birds',g:'see',e:'🐦',t:'Birds hanging around'},
  {id:'holes',g:'dmg',e:'🍃',t:'Holes chewed in leaves'},
  {id:'window',g:'dmg',e:'🪟',t:'See-through patches on leaves'},
  {id:'droppings',g:'dmg',e:'⚫',t:'Little green or dark droppings'},
  {id:'overnight',g:'dmg',e:'🌙',t:'Damage appears overnight'},
  {id:'seedling-cut',g:'dmg',e:'✂️',t:'Seedlings cut off or vanished'},
  {id:'curled',g:'dmg',e:'🌀',t:'Curled or puckered new leaves'},
  {id:'sticky',g:'dmg',e:'🍯',t:'Sticky leaves or black mould'},
  {id:'speckled',g:'dmg',e:'⚪',t:'Pale speckles on leaves'},
  {id:'bronze',g:'dmg',e:'🟤',t:'Bronze, dried-out lower leaves'},
  {id:'powder',g:'dmg',e:'🌫️',t:'White powder on leaves'},
  {id:'fruit-holes',g:'dmg',e:'🍅',t:'Holes or soft spots in fruit'},
  {id:'wilting',g:'dmg',e:'🥀',t:'Wilting tips or dropping pods'},
  {id:'pecked',g:'dmg',e:'🍓',t:'Pecked fruit or pulled seedlings'},
];
const SYM_BY_ID=Object.fromEntries(SYMPTOMS.map(s=>[s.id,s]));
// signs: which symptoms point to each pest; what: plain-language "what am I looking at?"
const PEST_ID={
  'cabbage-white':{signs:['green-cat','white-fly-about','holes','droppings'],what:'The baby stage of the white butterflies you see fluttering around in spring. Each butterfly lays tiny yellow eggs under leaves, and they hatch into very hungry green caterpillars.'},
  'diamondback':{signs:['green-cat','white-fly-about','window','holes'],what:'Caterpillars of a small grey-brown moth. They\'re smaller and twitchier than cabbage white caterpillars — touch one and it wriggles backwards and drops on a silk thread.'},
  'aphids':{signs:['tiny-clusters','ants','curled','sticky'],what:'Tiny soft-bodied insects, about the size of a pinhead, that suck sap. They breed incredibly fast — a few become hundreds in a week. Ants "farm" them for their sweet honeydew.'},
  'snails':{signs:['snail','holes','overnight','seedling-cut'],what:'Snails and slugs feed at night and hide during the day, so you usually see the damage before you see them.'},
  'cutworm':{signs:['grey-grub','seedling-cut','overnight'],what:'Moth caterpillars that live in the soil and come up at night to chew through young stems right at ground level.'},
  'earwigs':{signs:['earwig','holes','overnight'],what:'Brown insects with pincers on their tail. They\'re partly helpful (they eat aphids) but chew soft seedlings, leaves and petals at night.'},
  'medfly':{signs:['maggots','fruit-holes'],what:'A small fly that lays its eggs just under the skin of ripening fruit. The eggs hatch into maggots that rot the fruit from the inside.'},
  'two-spot-mite':{signs:['webbing','speckled','bronze'],what:'Not insects but tiny spiders — barely visible without a magnifier. They suck leaves dry in hot, dry weather.'},
  'russet-mite':{signs:['bronze'],what:'A microscopic mite that attacks tomatoes and their relatives. You\'ll see the bronzed, dried-out lower stems long before you could ever see the mites.'},
  'whitefly':{signs:['white-flies','sticky','speckled'],what:'Tiny white moth-like insects that suck sap from leaf undersides and leave sticky honeydew, which grows black mould.'},
  'heliothis':{signs:['green-cat','fruit-holes','droppings','holes'],what:'Caterpillars of a brown moth. Unlike leaf-eaters, they bore into tomatoes, beans and corn cobs.'},
  'shield-bugs':{signs:['shield-bug','wilting','fruit-holes'],what:'Sap-sucking bugs shaped like a little shield. Their babies are round and spotty black, white and orange — they look like a different bug.'},
  'powdery-mildew':{signs:['powder'],what:'Not a bug at all — a fungus. It loves warm days, cool nights and crowded, leafy plants.'},
  'birds':{signs:['birds','pecked','seedling-cut'],what:'Wattlebirds and parrots love ripe strawberries; blackbirds scratch up fresh seedlings looking for worms.'},
};
PESTS.forEach(p=>Object.assign(p,PEST_ID[p.id]));

let _idSel=new Set(),_idPlant=null;
function idToggle(s){_idSel.has(s)?_idSel.delete(s):_idSel.add(s);renderPests();}
function idPlant(k){_idPlant=_idPlant===k?null:k;renderPests();}
function idClear(){_idSel.clear();_idPlant=null;renderPests();}
// From a plant sheet: "Something wrong with this plant?"
function openPestsFor(k){closeSheet();_idSel.clear();_idPlant=k;setView('pests');}
function idMatches(){
  if(!_idSel.size)return[];
  const m=curMonth();
  return PESTS.map(p=>{
    const hit=p.signs.filter(s=>_idSel.has(s)).length;if(!hit)return null;
    let score=hit*3;
    if(_idPlant)score+=pestOnPlant(p,_idPlant)?3:-2;
    if(pestActive(p,m))score+=1;if(pestPeak(p,m))score+=1;
    return{p,hit,score};
  }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,3);
}
function photosUrl(p){return'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(p.n+' garden pest Australia');}
function idResultHtml({p,hit},i){
  const fits=_idPlant&&!pestOnPlant(p,_idPlant);
  return `<div class="id-res${i===0?' top':''}"><div class="pest-hdr"><span class="pest-e">${p.e}</span><div><div class="id-lead">${i===0?'Most likely':'Could also be'}</div><div class="pest-n">${p.n}</div></div></div>
    <div class="id-what">${p.what}</div>
    <div class="pest-txt"><b>How to tell:</b> ${p.look}</div>
    <div class="pest-txt"><b>What to do:</b> ${p.fix}</div>
    ${fits?`<div class="pest-txt id-warn">It doesn't usually attack ${plantName(_idPlant)}, so check the photos.</div>`:''}
    <div class="id-btns"><a class="id-photos" href="${photosUrl(p)}" target="_blank" rel="noopener">📷 See photos ↗</a>${plantedCells().length?`<button class="task-btn" onclick="openPestReport('${p.id}',${_idPlant?`'${_idPlant}'`:'null'})">✓ That's it — add a job</button>`:''}</div></div>`;
}
function renderPests(){
  const m=curMonth(),matches=idMatches();
  const chips=g=>SYMPTOMS.filter(s=>s.g===g).map(s=>`<button class="sym${_idSel.has(s.id)?' on':''}" onclick="idToggle('${s.id}')">${s.e} ${s.t}</button>`).join('');
  const mine=[...new Set(plantedCells().map(x=>x.cell.p))];
  if(_idPlant&&!mine.includes(_idPlant))mine.unshift(_idPlant);
  const watch=pestsToWatch(m);
  $('pests-content').innerHTML=`<div class="mv-heading">Pests & problems</div>
    <div class="mv-intro">Not sure what's eating your plants? Tap what you can see and we'll help work out what it is.</div>
    <div class="mv-section" id="pest-id"><div class="mv-st">🔍 What are you seeing?</div>
      <div class="sym-grp">Bugs you can see</div><div class="sym-wrap">${chips('see')}</div>
      <div class="sym-grp">Damage you can see</div><div class="sym-wrap">${chips('dmg')}</div>
      ${mine.length?`<div class="sym-grp">Which plant? (optional)</div><div class="sym-wrap">${mine.map(k=>`<button class="sym${_idPlant===k?' on':''}" onclick="idPlant('${k}')">${P[k].e} ${P[k].n}</button>`).join('')}</div>`:''}
      ${_idSel.size||_idPlant?`<button class="link-btn" onclick="idClear()">Clear and start again</button>`:''}
      ${matches.length?`<button class="id-bar" onclick="$('id-results').scrollIntoView({behavior:'smooth',block:'start'})">See ${matches.length===1?'the likely match':`${matches.length} likely matches`} ↓</button>`:''}
      <div id="id-results">${matches.length?matches.map(idResultHtml).join(''):_idSel.size?'<div class="set-txt">Nothing in the guide matches that — try fewer signs, or check the guide below.</div>':_idPlant?`<div class="set-txt">Now tap what you can see on your ${plantName(_idPlant)}.</div>`:''}</div>
    </div>
    ${watch.length?`<div class="mv-section"><div class="mv-st">👀 Watch out for in ${MONTHS[m]}</div>${watch.map(p=>{const cells=pestCells(p);return `<div class="pest-card${pestPeak(p,m)?' peak':''}"><div class="pest-hdr"><span class="pest-e">${p.e}</span><div><div class="pest-n">${p.n}${pestPeak(p,m)?' <span class="peak-tag">peak</span>':''}</div><div class="pest-on">Likely on your ${plantList(cells,4)}</div></div></div><div class="id-what">${p.what}</div><div class="pest-txt"><b>Look for:</b> ${p.look}</div><div class="pest-txt"><b>Prevent:</b> ${p.prevent}</div></div>`;}).join('')}</div>`:''}
    <div class="mv-section"><div class="mv-st">📖 Pest & bug guide</div><div class="pest-guide">${PESTS.map(p=>`<details class="pg"><summary><span>${p.e} ${p.n}${p.disease?' <span class="hlog-d">(disease)</span>':''}</span><span class="${pestActive(p,m)?'now-tag':'hlog-d'}">${pestActive(p,m)?'active now':monthsText(p.months)}</span></summary>
      <div class="pg-body"><div class="id-what">${p.what}</div><div class="pest-txt"><b>When:</b> ${monthsText(p.months)} · worst ${monthsText(p.peak)}</div><div class="pest-txt"><b>Signs:</b> ${p.signs.map(s=>SYM_BY_ID[s].t.toLowerCase()).join(' · ')}</div><div class="pest-txt"><b>Look for:</b> ${p.look}</div><div class="pest-txt"><b>Where:</b> ${p.where}</div><div class="pest-txt"><b>What to do:</b> ${p.fix}</div><div class="pest-txt"><b>Prevent:</b> ${p.prevent}</div><a class="id-photos" href="${photosUrl(p)}" target="_blank" rel="noopener">📷 See photos ↗</a></div></details>`).join('')}</div>
    <div class="pg-note">Timing is typical for Perth and shifts with each season's weather. For declared pests like Medfly, check DPIRD for current advice.</div></div>`;
}

