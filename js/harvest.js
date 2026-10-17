// Harvest tab: what you've grown is worth, what's ready, coming up and growing — tap a plant for tips & recipes.
'use strict';

// Typical Australian supermarket price (A$) for one picking — a bunch, a handful, a head or a few fruit.
// Estimates only; people can set their own in the Harvest tab.
const PRICE={
  'broad-beans':4,'snow-peas':4,'garden-peas':3,'kale':4,'silverbeet':3.5,'rainbow-chard':4,'cos-lettuce':3,'spinach':3,
  'asian-greens':3,'red-cabbage':5,'broccoli':3.5,'cauliflower':6,'coriander':3,'parsley':3,'garlic-chives':3,'bok-choy':3,
  'beetroot':2,'carrots':1.5,'turnip':2,'potato':4,'onions':1.2,'shallots':3,'spring-onions':2.5,'leek':3,'garlic':2,
  'dwarf-beans':3,'radish':2.5,'strawberry':4,'tomatoes':3,'cherry-tomato':4,'basil':3,'zucchini':2,'cucumber':1.5,
  'capsicum':2.5,'eggplant':3,'climbing-beans':3,'snake-beans':3,'sweet-corn':1.5,'pumpkin':6,'chilli':2,'sweet-potato':4,
  'thyme':3,'rosemary':3,'sage':3,'mint':3,'oregano':3,'dill':3,'lemongrass':3,'chives':3,'nasturtium':2,
};
// How to tell it's ready — the thing beginners most often get wrong
const READY_SIGN={
  'broad-beans':'Pods are plump with the beans showing as bumps — pick before the pods turn leathery.',
  'snow-peas':'Pods are flat, bright green and 6–8cm long, before the peas inside swell.',
  'garden-peas':'Pods are round, full and still bright green.',
  'kale':'Leaves are about hand-sized. Take the lower, outer leaves and leave the top growing.',
  'silverbeet':'Outer stems are 25–30cm long. Twist a few off at the base at a time.',
  'rainbow-chard':'Outer stems are 25–30cm long. Twist a few off at the base at a time.',
  'cos-lettuce':'Pick outer leaves any time, or cut the whole head when it feels firm.',
  'spinach':'Leaves are 8–10cm. Pick outer leaves before it starts to flower.',
  'asian-greens':'About 20cm tall — cut the whole plant or just the outer leaves.',
  'red-cabbage':'The head feels solid and heavy when you squeeze it.',
  'broccoli':'The head is tight, dark green and fist-sized or bigger — cut before yellow flowers open.',
  'cauliflower':'The head is white, firm and about 15cm across.',
  'coriander':'Over 15cm tall. Pick outer stems before a flower stalk appears.',
  'parsley':'Stems have three leaf sections. Cut outer stems at the base.',
  'garlic-chives':'Leaves are 20cm or more. Cut a clump down to 5cm and it regrows.',
  'bok-choy':'15–25cm tall with thick white stems — cut at the base.',
  'beetroot':'The tops of the roots poke out of the soil at golf-ball to tennis-ball size.',
  'carrots':'Tops are bushy and the shoulder is 2cm or more across — pull one to check.',
  'turnip':'Roots are 5–8cm across. Bigger ones go woody.',
  'potato':'New potatoes once they flower; storing potatoes after the tops die back.',
  'onions':'The tops flop over and start to yellow.',
  'shallots':'The leaves turn yellow and fall over.',
  'spring-onions':'Pencil-thick or bigger — pull as you need them.',
  'leek':'Stems are 2–3cm thick.',
  'garlic':'The lower half of the leaves have browned, usually in late spring.',
  'dwarf-beans':'Pods are pencil-thick and snap cleanly, before the beans bulge.',
  'radish':'The tops of the roots show at 2–3cm across — usually about 4 weeks.',
  'strawberry':'Fully red right up to the stalk.',
  'tomatoes':'Full colour and slightly soft when you gently squeeze.',
  'cherry-tomato':'Full colour, and they come away easily in your hand.',
  'basil':'Six or more pairs of leaves. Pinch the tips just above a pair of leaves.',
  'zucchini':'15–20cm long — check every day, they grow fast.',
  'cucumber':'Firm, evenly green and 15–20cm long, before any yellow shows.',
  'capsicum':'Firm and glossy. Leave longer for red, sweeter fruit.',
  'eggplant':'The skin is glossy. Dull skin means it\'s overripe and seedy.',
  'climbing-beans':'Pods are long and smooth and snap cleanly.',
  'snake-beans':'About pencil-thick and 30–40cm long, before the seeds bulge.',
  'sweet-corn':'The silks are brown and dry, and a kernel pierced with a fingernail gives milky juice.',
  'pumpkin':'The stem has dried and the skin doesn\'t dent when pressed with a fingernail.',
  'chilli':'Full colour — or pick them green for milder heat.',
  'sweet-potato':'Leaves start yellowing in autumn. Dig carefully about 4–5 months after planting.',
  'thyme':'Snip sprigs any time — never take more than a third of the plant.',
  'rosemary':'Snip sprigs any time — never take more than a third of the plant.',
  'sage':'Snip leaves any time — never take more than a third of the plant.',
  'oregano':'Snip sprigs any time — never take more than a third of the plant.',
  'mint':'Pick tips any time. Regular picking keeps it bushy.',
  'dill':'Pick fronds once it\'s 20cm tall; collect seed when the heads turn brown.',
  'lemongrass':'Stalks are 1–2cm thick — cut or twist them off at the base.',
  'chives':'Leaves are 15cm or more. Cut to 5cm and they regrow.',
  'calendula':'Pick flowers when fully open — more will follow.',
  'nasturtium':'Pick flowers and young leaves any time.',
  'borage':'Pick the blue flowers when fully open.',
};
// One more idea to go with each plant's own harvest idea
const RECIPES={
  'broad-beans':'Smash with mint, lemon and feta on toast.','snow-peas':'Slice thinly into a noodle salad.','garden-peas':'Pea and ham soup, with the pods simmered in the stock.',
  'kale':'Kale chips — tear, oil, salt and bake at 150°C until crisp.','silverbeet':'A spanakopita-style pie with feta and filo.','rainbow-chard':'Chard and potato gratin.',
  'cos-lettuce':'Grill halved hearts and drizzle with dressing.','spinach':'Stir into dhal or a coconut curry at the end.','asian-greens':'Wilt into miso soup.',
  'red-cabbage':'Braise slowly with apple, vinegar and a pinch of sugar.','broccoli':'Blitz the stalks into soup — don\'t waste them.','cauliflower':'Roast thick cauliflower "steaks" with spices.',
  'coriander':'Green chutney with mint, chilli and lime.','parsley':'Tabbouleh — more parsley than you think.','bok-choy':'Steam and drizzle with oyster sauce and fried garlic.',
  'beetroot':'Beetroot dip with yoghurt, garlic and cumin.','carrots':'Roast with cumin, then toss with yoghurt and herbs.','turnip':'Quick pickled turnip, the pink Lebanese way.',
  'potato':'Smashed potatoes: boil, squash, roast until crisp.','onions':'Caramelised onion jam.','shallots':'Crispy fried shallots for everything.',
  'spring-onions':'Spring onion pancakes.','leek':'Leek and cheese tart.','garlic':'Roast whole heads and squeeze onto toast.',
  'dwarf-beans':'Green beans with garlic, chilli and soy.','radish':'Quick pickle in rice vinegar and sugar.','strawberry':'Strawberries with balsamic and black pepper.',
  'tomatoes':'Panzanella — tomato and torn-bread salad.','cherry-tomato':'Slow-roasted cherry tomatoes kept in olive oil.','basil':'Pesto: basil, garlic, pine nuts, parmesan, oil.',
  'zucchini':'Zucchini fritters with feta and dill.','cucumber':'Smashed cucumber salad with sesame and garlic.','capsicum':'Stuffed capsicums with rice and mince.',
  'eggplant':'Eggplant parmigiana.','climbing-beans':'Slow-braised beans in tomato and olive oil.','snake-beans':'Stir-fry with pork mince and chilli.',
  'sweet-corn':'Corn fritters with smashed avocado.','pumpkin':'Pumpkin soup with ginger and coconut.','chilli':'Homemade chilli oil.',
  'sweet-potato':'Sweet potato wedges with smoked paprika.','mint':'Mint sauce for lamb, or fresh mint tea.','dill':'Dill pickles in a quick brine.',
  'rosemary':'Rosemary salt for roast potatoes.','thyme':'Thyme and honey roasted carrots.','lemongrass':'Lemongrass and ginger tea.',
};
function priceOf(k){return ST.prices[k]??PRICE[k]??(P[k]?.custom?2:0);}
function logValue(l){return priceOf(l.p)*(l.n||1);}
function money(v){return'$'+(v>=100?Math.round(v):v.toFixed(v%1?2:0));}

// ── Value ──
function harvestTotals(){
  const td=localDate(),mk=td.slice(0,7),yk=td.slice(0,4);
  const sum=ls=>ls.reduce((s,l)=>s+logValue(l),0);
  const year=ST.log.filter(l=>l.d.startsWith(yk));
  const by={};year.forEach(l=>{by[l.p]=(by[l.p]||0)+logValue(l);});
  return{month:sum(ST.log.filter(l=>l.d.startsWith(mk))),year:sum(year),all:sum(ST.log),picks:year.reduce((s,l)=>s+(l.n||1),0),
    top:Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,3)};
}
// A quiet line at the bottom of the Harvest tab — useful, but the plants come first
function valueLineHtml(){
  if(!ST.log.length)return'';
  const t=harvestTotals();
  return `<div class="hv-value">🧺 About <b>${money(t.year)}</b> of food grown this year${t.month&&t.month!==t.year?` · ${money(t.month)} this month`:''}
    <button class="link-btn" onclick="openPrices()">Based on typical shop prices — adjust</button></div>`;
}
function openPrices(){
  const ks=[...new Set([...ST.log.map(l=>l.p),...plantedCells().map(x=>x.cell.p)])].filter(k=>P[k]);
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">🏷️ Your prices</div><div class="sh-sub">What one picking would cost you at the shops</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Close</button></div></div>
    ${ks.map(k=>`<label class="price-row"><span>${P[k].e} ${P[k].n}</span><span class="price-in">$<input class="fm-in" type="number" inputmode="decimal" min="0" step="0.5" value="${priceOf(k)}" onchange="setPrice('${k}',this.value)"></span></label>`).join('')||'<div class="set-txt">Plant something first.</div>'}
    <div class="fm-help" style="margin-top:10px">A "picking" is one bunch, handful, head or a few fruit.</div></div>`);
}
function setPrice(k,v){const n=parseFloat(v);if(isNaN(n)||n<0)return;ST.prices[k]=Math.round(n*100)/100;saveState();renderView();}

// ── Tab ──
// Group planted cells by plant, across beds
function plantGroupsByKey(){
  const g=new Map();
  plantedCells().forEach(x=>{if(!g.has(x.cell.p))g.set(x.cell.p,[]);g.get(x.cell.p).push(x);});
  return[...g].map(([k,xs])=>({k,xs,lead:leadCell(xs)}));
}
// The most advanced cell decides the group's stage: ready beats picking season beats a future date
function leadCell(xs){const td=localDate(),rank=c=>['ready','bolting'].includes(c.s)?0:c.s==='done'?3:expectedDate(c)&&expectedDate(c)<=td?1:2;
  return xs.map(x=>x.cell).sort((a,b)=>rank(a)-rank(b)||(expectedDate(a)||'z').localeCompare(expectedDate(b)||'z'))[0];}
function stageOf(c){
  if(['ready','bolting'].includes(c.s))return'ready';if(c.s==='done')return'done';
  const e=expectedDate(c),td=localDate();
  if(e&&e<=td)return COMPANIONS.includes(c.p)?'growing':'ready';
  return e&&daysBetween(td,e)<=45?'soon':'growing';
}
function harvestRowHtml({k,xs,lead}){
  const pl=P[k],beds=[...new Set(xs.map(x=>x.bed.name))].map(esc).join(', ');
  return `<button class="hv-row" onclick="openGrowing('${k}')"><span class="hv-e">${pl.e}</span><span class="hv-mid"><span class="hv-n">${pl.n}${xs.length>1?` <span class="hlog-d">×${xs.length}</span>`:''}</span><span class="hv-m">${beds}</span></span><span class="hv-w">${readyLabel(lead,false).replace('Ready ~','~')}</span><span class="hv-go">›</span></button>`;
}
function renderHarvest(){
  const groups=plantGroupsByKey();
  const by=st=>groups.filter(g=>stageOf(g.lead)===st);
  const sec=(t,gs,note)=>gs.length?`<div class="mv-section"><div class="mv-st">${t}</div>${note?`<div class="hv-note">${note}</div>`:''}<div class="hv-list">${gs.map(harvestRowHtml).join('')}</div></div>`:'';
  $('harvest-content').innerHTML=`<div class="mv-heading">Harvest</div>
    <div class="mv-intro">${!ST.beds.length?'No beds yet — add one on the Beds tab to start.':groups.length?'Tap any plant for how to tell it\'s ready, what to look out for, and recipe ideas.':'Nothing planted yet.'}</div>
    ${sec('✨ Ready to pick',by('ready'))}
    ${sec('⏳ Coming up',by('soon').sort((a,b)=>(expectedDate(a.lead)||'').localeCompare(expectedDate(b.lead)||'')),'Ready within about 6 weeks')}
    ${sec('🌿 Growing',by('growing'))}
    ${sec('✅ Finished',by('done'),'Clear these when you\'re ready — Jobs has a reminder.')}
    ${valueLineHtml()}`;
}

// ── Harvest some / Harvest all ──
// "Some" = one picking from one plant. "All" = a picking from every plant of this kind; one-off crops
// (and bolting ones) are then finished, repeat croppers keep growing. Values follow the same count.
function harvestable(k){return plantedCells().filter(x=>x.cell.p===k&&['growing','ready','bolting'].includes(x.cell.s));}
function allFinishes(k){return!keepsProducing(k)||harvestable(k).every(x=>x.cell.s==='bolting');}
function harvestAll(k){
  const xs=harvestable(k);if(!xs.length)return;
  snapshot();
  const beds=new Map();
  xs.forEach(x=>{
    const fin=!keepsProducing(k)||x.cell.s==='bolting';
    x.cell.picks++;if(fin)x.cell.s='done';
    ST.alertDone[`${k}:ready`]=ST.alertDone[`${k}:bolting`]=localDate();
    const key=x.bi+':'+fin;beds.set(key,{bi:x.bi,fin,n:(beds.get(key)?.n||0)+1});
  });
  beds.forEach(({bi,fin,n})=>logHarvest(k,bi,fin,n));
  saveState();celebrate();closeSheet();refreshAll();
  const n=xs.length,v=priceOf(k)*n;
  toast(`🧺 Harvested ${n>1?`all ${n} `:''}${plantName(k)}${v?` (+${money(v)})`:''}${allFinishedNow(xs)?' — marked finished':''}`,{undo:true});
}
function allFinishedNow(xs){return xs.every(x=>x.cell.s==='done');}

// ── Plant-in-your-garden sheet: ready signs, what to look out for now, recipes ──
const TRAIT_NOW={
  runners:'Pinch off runners to keep fruit coming — or root them in pots for free plants.',
  stake:'Tie the main stem to its stake every week or so as it grows.',
  climb:'Guide new shoots onto the trellis — they\'ll grab on from there.',
  spreads:'Check it hasn\'t escaped its pot — pull any runners popping up in the bed.',
  sprawl:'Turn wandering vines back into their space.',
  selfseeds:'Pull seedlings that pop up where you don\'t want them.',
  heavy:'Liquid-feed every 2 weeks once it\'s flowering.',
  tall:'It grows tall — check it isn\'t shading the shorter plants beside it.',
};
function lookOutHtml(k,xs){
  const lead=leadCell(xs),m=curMonth(),tips=[];
  if(xs.some(x=>['seed','seedling'].includes(x.cell.s)))tips.push(['🌱','Keep the soil just moist until it\'s established, and watch for snails at night.']);
  (TRAITS[k]||[]).forEach(t=>{if(TRAIT_NOW[t]&&lead.s!=='done')tips.push([TRAIT_DEF[t].e,TRAIT_NOW[t]]);});
  if(TRAITS[k]?.includes('bolts')&&[9,10,11,0,1].includes(m)&&lead.s!=='done')tips.push(['⏱️','Warm weather — if a flower stalk shoots up, harvest everything worth eating.']);
  pestsFor(k).filter(p=>pestActive(p,m)).forEach(p=>tips.push([p.e,`<b>${p.n}${pestPeak(p,m)?' (peak now)':''}:</b> ${p.look.split('. ')[0].replace(/\.$/,'')}.`]));
  return tips.length?`<div class="stat-lbl">👀 Look out for now</div><div class="trait-list">${tips.map(([e,t])=>`<div class="trait"><span class="trait-e">${e}</span><div>${t}</div></div>`).join('')}</div>`:'';
}
function recipesHtml(k){
  const pl=P[k],more=RECIPES[k];
  if(COMPANIONS.includes(k)&&!more)return'';
  return `<div class="stat-lbl">🍳 Recipe ideas</div><div class="bpc-harvest" style="margin-bottom:12px">
    <div class="bpc-harvest-txt">${pl.idea}</div>${more?`<div class="bpc-harvest-txt" style="margin-top:6px">${more}</div>`:''}
    <a class="id-photos" href="https://www.google.com/search?q=${encodeURIComponent(plantName(k)+' recipes')}" target="_blank" rel="noopener">More ${pl.n.toLowerCase()} recipes ↗</a></div>`;
}
function readySignHtml(k){return READY_SIGN[k]?`<div class="sh-next"><div class="sh-nl">✅ Ready when</div><div class="sh-nv">${READY_SIGN[k]}</div></div>`:'';}
function openGrowing(k){
  const xs=plantedCells().filter(x=>x.cell.p===k);if(!xs.length){openPlantInfo(k);return;}
  const pl=P[k],lead=leadCell(xs),beds=[...new Set(xs.map(x=>x.bed.name))].map(esc).join(', ');
  const planted=xs.map(x=>x.cell.d).filter(Boolean).sort()[0];
  const picks=ST.log.filter(l=>l.p===k).reduce((s,l)=>s+(l.n||1),0);
  const pickable=xs.find(x=>['growing','ready','bolting'].includes(x.cell.s));
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div class="pi-hdr"><span class="sh-pe">${pl.e}</span><div><div class="sh-pn">${pl.n}</div><div class="sh-sub">${xs.length>1?`${xs.length} plants · `:''}${beds}</div></div></div><button class="sh-cancel" onclick="closeSheet()">✕ Close</button></div></div>
    <div class="pi-facts"><div><div class="sh-cl">Planted</div><div class="pi-v">${planted?fmtDate(planted):'—'}</div></div><div><div class="sh-cl">Ready</div><div class="pi-v">${readyLabel(lead,false)}</div></div>
      <div><div class="sh-cl">Picked</div><div class="pi-v">${picks?plural(picks,'time'):'Not yet'}</div></div></div>
    ${readySignHtml(k)}
    ${lookOutHtml(k,xs)}
    ${recipesHtml(k)}
    ${pickable?`<div class="btn-row"><button class="btn btn-harvest" onclick="pickSome(${pickable.bi},${pickable.ri},${pickable.ci})">🧺 Harvest some</button><button class="btn btn-harvest" onclick="harvestAll('${k}')">🧺 Harvest all${harvestable(k).length>1?` (${harvestable(k).length})`:''}</button></div>
    <div class="sh-hint">${allFinishes(k)?'Harvest all marks them finished, ready to clear.':'Both keep the plants growing — they\'ll produce more.'}</div>`:''}
    <button class="btn btn-cancel btn-full" onclick="openPlantInfo('${k}')">📚 How it grows & neighbours</button>
  </div>`);
}
