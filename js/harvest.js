// Harvest tab: what you've grown is worth, what's ready, coming up and growing — tap a plant for tips & recipes.
'use strict';

// Typical Australian supermarket price (A$) for one picking — a bunch, a handful, a head or a few fruit.
// Estimates only; people can set their own in the Harvest tab.
const PRICE={
  'broad-beans':4,'peas':4,'kale':4,'chard':3.5,'lettuce':3,'spinach':3,
  'asian-greens':3,'cabbage':5,'broccoli':3.5,'cauliflower':6,'coriander':3,'parsley':3,'garlic-chives':3,'bok-choy':3,
  'beetroot':2,'carrots':1.5,'turnip':2,'potato':4,'onions':1.2,'shallots':3,'spring-onions':2.5,'leek':3,'garlic':2,
  'radish':2.5,'strawberry':4,'tomatoes':3,'basil':3,'zucchini':2,'cucumber':1.5,
  'capsicum':2.5,'eggplant':3,'beans':3,'sweet-corn':1.5,'pumpkin':6,'chilli':2,'sweet-potato':4,
  'thyme':3,'rosemary':3,'sage':3,'mint':3,'oregano':3,'dill':3,'lemongrass':3,'chives':3,'nasturtium':2,
};
// How to tell it's ready — the thing beginners most often get wrong
const READY_SIGN={
  'broad-beans':'Pods are plump with the beans showing as bumps — pick before the pods turn leathery.',
  'peas':'Pods are flat, bright green and 6–8cm long, before the peas inside swell.',
  'kale':'Leaves are about hand-sized. Take the lower, outer leaves and leave the top growing.',
  'chard':'Outer stems are 25–30cm long. Twist a few off at the base at a time.',
  'lettuce':'Pick outer leaves any time, or cut the whole head when it feels firm.',
  'spinach':'Leaves are 8–10cm. Pick outer leaves before it starts to flower.',
  'asian-greens':'About 20cm tall — cut the whole plant or just the outer leaves.',
  'cabbage':'The head feels solid and heavy when you squeeze it.',
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
  'radish':'The tops of the roots show at 2–3cm across — usually about 4 weeks.',
  'strawberry':'Fully red right up to the stalk.',
  'tomatoes':'Full colour and slightly soft when you gently squeeze.',
  'basil':'Six or more pairs of leaves. Pinch the tips just above a pair of leaves.',
  'zucchini':'15–20cm long — check every day, they grow fast.',
  'cucumber':'Firm, evenly green and 15–20cm long, before any yellow shows.',
  'capsicum':'Firm and glossy. Leave longer for red, sweeter fruit.',
  'eggplant':'The skin is glossy. Dull skin means it\'s overripe and seedy.',
  'beans':'Pods are long and smooth and snap cleanly.',
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
  'broad-beans':'Smash with mint, lemon and feta on toast.','peas':'Slice thinly into a noodle salad.',
  'kale':'Kale chips — tear, oil, salt and bake at 150°C until crisp.','chard':'A spanakopita-style pie with feta and filo.',
  'lettuce':'Grill halved hearts and drizzle with dressing.','spinach':'Stir into dhal or a coconut curry at the end.','asian-greens':'Wilt into miso soup.',
  'cabbage':'Braise slowly with apple, vinegar and a pinch of sugar.','broccoli':'Blitz the stalks into soup — don\'t waste them.','cauliflower':'Roast thick cauliflower "steaks" with spices.',
  'coriander':'Green chutney with mint, chilli and lime.','parsley':'Tabbouleh — more parsley than you think.','bok-choy':'Steam and drizzle with oyster sauce and fried garlic.',
  'beetroot':'Beetroot dip with yoghurt, garlic and cumin.','carrots':'Roast with cumin, then toss with yoghurt and herbs.','turnip':'Quick pickled turnip, the pink Lebanese way.',
  'potato':'Smashed potatoes: boil, squash, roast until crisp.','onions':'Caramelised onion jam.','shallots':'Crispy fried shallots for everything.',
  'spring-onions':'Spring onion pancakes.','leek':'Leek and cheese tart.','garlic':'Roast whole heads and squeeze onto toast.',
  'radish':'Quick pickle in rice vinegar and sugar.','strawberry':'Strawberries with balsamic and black pepper.',
  'tomatoes':'Panzanella — tomato and torn-bread salad.','basil':'Pesto: basil, garlic, pine nuts, parmesan, oil.',
  'zucchini':'Zucchini fritters with feta and dill.','cucumber':'Smashed cucumber salad with sesame and garlic.','capsicum':'Stuffed capsicums with rice and mince.',
  'eggplant':'Eggplant parmigiana.','beans':'Slow-braised beans in tomato and olive oil.',
  'sweet-corn':'Corn fritters with smashed avocado.','pumpkin':'Pumpkin soup with ginger and coconut.','chilli':'Homemade chilli oil.',
  'sweet-potato':'Sweet potato wedges with smoked paprika.','mint':'Mint sauce for lamb, or fresh mint tea.','dill':'Dill pickles in a quick brine.',
  'rosemary':'Rosemary salt for roast potatoes.','thyme':'Thyme and honey roasted carrots.','lemongrass':'Lemongrass and ginger tea.',
};
function priceOf(k){return ST.prices[k]??PRICE[k]??(P[k]?.custom?2:0);}
// Fruit is priced per kg: count × typical weight
function logValue(l){return priceOf(l.p)*(isTree(l.p)?(l.kg??(l.n||1)*FRUIT[l.p].g/1000):(l.n||1));}
function logKg(l){return l.kg??(isTree(l.p)?(l.n||1)*FRUIT[l.p].g/1000:0);}
function fruitKg(ls){return ls.reduce((s,l)=>s+logKg(l),0);}
function money(v){return'$'+(v>=100?Math.round(v):v.toFixed(v%1?2:0));}

// ── Value ──
function harvestTotals(){
  const td=localDate(),mk=td.slice(0,7),yk=td.slice(0,4);
  const sum=ls=>ls.reduce((s,l)=>s+logValue(l),0);
  const year=ST.log.filter(l=>l.d.startsWith(yk));
  const by={};year.forEach(l=>{by[l.p]=(by[l.p]||0)+logValue(l);});
  return{month:sum(ST.log.filter(l=>l.d.startsWith(mk))),year:sum(year),all:sum(ST.log),picks:year.reduce((s,l)=>s+(l.n||1),0),kg:fruitKg(year),
    top:Object.entries(by).sort((a,b)=>b[1]-a[1]).slice(0,3)};
}
// A quiet line at the bottom of the Harvest tab — useful, but the plants come first
function valueLineHtml(){
  if(!ST.log.length)return'';
  const t=harvestTotals();
  return `<div class="hv-value"><button class="hv-value-go" onclick="openHarvestReport()">🧺 About <b>${money(t.year)}</b> of food grown this year${t.month&&t.month!==t.year?` · ${money(t.month)} this month`:''}${t.kg>=0.1?` · ${t.kg<10?t.kg.toFixed(1):Math.round(t.kg)}kg weighed or counted`:''} <span class="hv-more">See it bed by bed ›</span></button>
    <button class="link-btn" onclick="openPrices()">Based on typical shop prices — adjust</button></div>`;
}
// ── Harvest report ── what each bed and tree grew, and what it was worth
const kgText=kg=>kg<1?Math.round(kg*1000)+'g':(kg<10?kg.toFixed(1):Math.round(kg))+'kg';
function amountText(k,n,kg){
  if(isTree(k))return`${fruitUnits(k,n)} · ${kgText(kg)}`;
  return plural(n,'picking')+(kg>0?` · ${kgText(kg)}`:'');
}
function openHarvestReport(all){
  const yk=localDate().slice(0,4),older=ST.log.some(l=>!l.d.startsWith(yk));
  const logs=all?ST.log:ST.log.filter(l=>l.d.startsWith(yk));
  // Group by bed/tree, then by crop. Entries from deleted beds are kept together at the end.
  const g=new Map();
  logs.filter(l=>P[l.p]).forEach(l=>{
    const bed=bedById(l.bid),key=bed?bed.id:'gone';
    if(!g.has(key))g.set(key,{bed,crops:new Map(),total:0});
    const x=g.get(key),c=x.crops.get(l.p)||{n:0,v:0,kg:0};
    c.n+=l.n||1;c.v+=logValue(l);c.kg+=logKg(l);x.crops.set(l.p,c);x.total+=logValue(l);
  });
  const groups=[...g.values()].sort((a,b)=>(!a.bed)-(!b.bed)||b.total-a.total),max=Math.max(...groups.map(x=>x.total),1);
  const total=groups.reduce((s,x)=>s+x.total,0),kg=fruitKg(logs),picks=logs.reduce((s,l)=>s+(isTree(l.p)?0:l.n||1),0);
  const icon=bed=>!bed?'🗂️':isTreeBed(bed)?cellEmoji(treeCell(bed)):'🥕';
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">🧺 ${all?'Everything you’ve grown':'Grown this year'}</div><div class="sh-sub">By bed and tree, at typical shop prices</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Close</button></div>
    ${older?`<div class="seg">${[[0,'This year'],[1,'All time']].map(([a,l])=>`<button class="seg-b${!!a===!!all?' on':''}" onclick="openHarvestReport(${a})">${l}</button>`).join('')}</div>`:''}</div>
    <div class="pi-facts"><div><div class="sh-cl">Worth</div><div class="pi-v">${money(total)}</div></div><div><div class="sh-cl">Veg pickings</div><div class="pi-v">${picks||'—'}</div></div><div><div class="sh-cl">Kilos</div><div class="pi-v">${kg>=0.1?(kg<10?kg.toFixed(1):Math.round(kg))+'kg':'—'}</div></div></div>
    ${groups.length?groups.map(x=>`<div class="hr-card"><div class="hr-top"><span class="hr-name">${icon(x.bed)} ${x.bed?esc(x.bed.name):'Beds you’ve removed'}${x.bed&&isTreeBed(x.bed)&&x.bed.n>1?` <span class="hlog-d">×${x.bed.n}</span>`:''}</span><span class="hr-val">${money(x.total)}</span></div>
      <div class="hr-bar"><span style="width:${Math.max(3,Math.round(x.total/max*100))}%"></span></div>
      ${[...x.crops].sort((a,b)=>b[1].v-a[1].v).map(([k,c])=>`<div class="hr-row"><span>${x.bed&&isTreeBed(x.bed)?'🧺 Picked':`${P[k].e} ${P[k].n}`}</span><span class="hlog-d">${amountText(k,c.n,c.kg)}</span><span class="hr-v">${money(c.v)}</span></div>`).join('')}</div>`).join('')
      :`<div class="set-txt">Nothing harvested ${all?'yet':'this year yet'}. Use “Harvest some” on a plant, or log fruit on a tree's card, and it shows up here.</div>`}
    ${groups.length?'<button class="btn btn-cancel btn-full" style="margin-top:10px" onclick="exportHarvestCSV()">⬇️ Download as a spreadsheet (CSV)</button>':''}
    <button class="link-btn" style="margin-top:10px" onclick="openPrices()">Prices are typical shop prices — adjust them</button>
  </div>`);
}
// Every harvest as a spreadsheet: date, plant, bed or tree, how many, kilos, value
function exportHarvestCSV(){
  const q=s=>`"${String(s??'').replace(/"/g,'""')}"`;
  const rows=[['Date','Plant','Bed or tree','Count','Unit','Weight (kg)','Weight measured?','Estimated value ($)','Final harvest']]
    .concat(ST.log.filter(l=>P[l.p]).map(l=>[l.d,plantName(l.p),bedById(l.bid)?.name||'(removed bed)',l.n||1,isTree(l.p)?FRUIT[l.p].us:'pickings',
      logKg(l)?Math.round(logKg(l)*1000)/1000:'',l.kg!=null?'yes':isTree(l.p)?'estimated':'',Math.round(logValue(l)*100)/100,l.f?'yes':'']));
  const blob=new Blob(['\ufeff'+rows.map(r=>r.map(q).join(',')).join('\r\n')],{type:'text/csv'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`harvests-${localDate()}.csv`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast(`⬇️ ${plural(ST.log.length,'harvest')} saved as a spreadsheet`);
}
function openPrices(){
  const ks=[...new Set([...ST.log.map(l=>l.p),...plantedCells().map(x=>x.cell.p)])].filter(k=>P[k]);
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">🏷️ Your prices</div><div class="sh-sub">What one picking would cost you at the shops</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Close</button></div></div>
    ${ks.map(k=>`<label class="price-row"><span>${P[k].e} ${P[k].n}</span><span class="price-in">$<input class="fm-in" type="number" inputmode="decimal" min="0" step="0.5" value="${priceOf(k)}" onchange="setPrice('${k}',this.value)">${isTree(k)?'<span class="hlog-d">/kg</span>':''}</span></label>`).join('')||'<div class="set-txt">Plant something first.</div>'}
    <div class="fm-help" style="margin-top:10px">A "picking" is one bunch, handful, head or a few fruit. Fruit from trees is priced per kg.</div></div>`);
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
  if(isTree(c.p))return{ready:'ready',forming:'soon'}[treeStage(c)]||'growing';
  if(c.s==='done'||pickingOver(c))return'done';
  if(COMPANIONS.includes(c.p))return'growing'; // companion flowers aren't a harvest
  if(['ready','bolting'].includes(c.s))return'ready';
  const e=expectedDate(c),td=localDate();
  if(e&&e<=td)return COMPANIONS.includes(c.p)?'growing':'ready';
  return e&&daysBetween(td,e)<=45?'soon':'growing';
}
function harvestRowHtml({k,xs,lead}){
  // a tree card's name is usually just the fruit's name — only show it if it's been renamed
  const pl=P[k],beds=[...new Set(xs.map(x=>x.bed.name))].filter(b=>b!==pl.n).map(esc).join(', '),n=xs.reduce((s,x)=>s+(isTreeBed(x.bed)?x.bed.n||1:1),0);
  const vs=[...new Set(xs.map(x=>cellVariety(x.cell)?.s).filter(Boolean))].map(esc);
  return `<button class="hv-row" onclick="openGrowing('${k}')"><span class="hv-e">${pl.e}</span><span class="hv-mid"><span class="hv-n">${pl.n}${n>1?` <span class="hlog-d">×${n}</span>`:''}</span><span class="hv-m">${[vs.join(', '),beds].filter(Boolean).join(' · ')}</span></span><span class="hv-w">${readyLabel(lead,false).replace('Ready ~','~')}</span><span class="hv-go">›</span></button>`;
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
    ${sec('✅ Finished',by('done'),maint()==='none'?'Tap one in Beds and clear the spot when you\'ve pulled it out.':'Clear these when you\'re ready — Jobs has a reminder.')}
    ${valueLineHtml()}`;
}

// ── Harvest some / Harvest all ──
// Some: pick a few outer leaves or fruit and the plant keeps growing — except crops pulled whole
//       (beetroot, carrots…), where "some" pulls one plant and frees its spot.
// All:  the final harvest — the plant is completed. Pulled-whole crops leave nothing behind, so their
//       spots are cleared; everything else is marked Finished, with a "pull it out" job in Jobs.
// One picking is counted per plant harvested.
function harvestable(k){return plantedCells().filter(x=>x.cell.p===k&&['growing','ready','bolting'].includes(x.cell.s));}
// Shared by the plant sheet, the Beds sheet and ticked jobs. Returns the confirmation message.
function doHarvest(xs,all){
  if(!xs.length)return'';
  const k=xs[0].cell.p,lifted=isLifted(k),done=all||lifted,beds=new Map();
  xs.forEach(x=>{
    beds.set(x.bi,(beds.get(x.bi)||0)+1);
    if(lifted)clearCell(x.bi,x.ri,x.ci);else{x.cell.picks++;if(all)x.cell.s='done';}
  });
  // optional weight from the sheet (kg or g), shared across the beds it came from
  const kg=readWeight(),total=xs.length;beds.forEach((n,bi)=>logHarvest(k,bi,done,n,kg?kg*n/total:null));
  ST.alertDone[`${k}:ready`]=ST.alertDone[`${k}:bolting`]=localDate();
  saveState();
  const n=xs.length,v=priceOf(k)*n,val=v?` (+${money(v)})`:'';
  if(lifted)return`🧺 Pulled ${n>1?`${n} `:''}${plantName(k)}${val} — ${n>1?'spots':'spot'} ready to replant`;
  if(all)return`🧺 Final harvest: ${n>1?`all ${n} `:''}${plantName(k)}${val} — completed`;
  return`🧺 Harvested some ${plantName(k)}${val} — it keeps growing`;
}
function harvestSome(bi,ri,ci){snapshot();const x=plantedCells().find(y=>y.bi===bi&&y.ri===ri&&y.ci===ci);const msg=doHarvest([x],false);confettiAt(innerWidth/2,innerHeight*.6);closeSheet();refreshAll();toast(msg,{undo:true});}
function harvestAll(k){const xs=harvestable(k);if(!xs.length)return;snapshot();const msg=doHarvest(xs,true);celebrate();closeSheet();refreshAll();toast(msg,{undo:true});}
// "Weight (optional)" next to the harvest buttons
function weighHtml(){return`<div class="hv-weigh"><input class="fm-in" id="hv-w" type="number" inputmode="decimal" min="0" step="0.1" placeholder="Weight, if you weighed it" aria-label="Weight"><select class="fm-in" id="hv-u" aria-label="Unit"><option value="kg">kg</option><option value="g">g</option></select></div>`;}
function readWeight(){if(!sheetOpen())return null;const w=parseFloat($('hv-w')?.value);if(!(w>0))return null;return $('hv-u')?.value==='g'?w/1000:w;}
function harvestHint(k){
  return isLifted(k)?'Some = one plant. All = the lot.':'Some: it keeps growing. All: last pick, plant comes out.';
}

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
  const ts=[...new Set(xs.flatMap(x=>cellTraits(x.cell)))];
  ts.forEach(t=>{if(TRAIT_NOW[t]&&lead.s!=='done')tips.push([TRAIT_DEF[t].e,TRAIT_NOW[t]]);});
  if(ts.includes('bolts')&&[9,10,11,0,1].includes(m)&&lead.s!=='done')tips.push(['⏱️','Warm weather — if a flower stalk shoots up, harvest everything worth eating.']);
  pestsFor(k).filter(p=>pestActive(p,m)).forEach(p=>tips.push([p.e,`<b>${p.n}${pestPeak(p,m)?' (peak now)':''}:</b> ${p.look.split('. ')[0].replace(/\.$/,'')}.`]));
  return tips.length?`<div class="stat-lbl">👀 Look out for now</div><div class="trait-list">${tips.map(([e,t])=>`<div class="trait"><span class="trait-e">${e}</span><div>${t}</div></div>`).join('')}</div>`:'';
}
function recipesHtml(k){
  const pl=P[k],more=RECIPES[k];
  if(COMPANIONS.includes(k)&&!more)return'';
  return `<div class="stat-lbl">🍳 Recipe ideas</div><div class="bpc-harvest" style="margin-bottom:12px">
    <div class="bpc-harvest-txt">${firstSentence(pl.idea)}</div>${more?`<div class="bpc-harvest-txt" style="margin-top:6px">${more}</div>`:''}
    <a class="id-photos" href="https://www.google.com/search?q=${encodeURIComponent(plantName(k)+' recipes')}" target="_blank" rel="noopener" onclick="return openLink(event,this)">More ${pl.n.toLowerCase()} recipes ↗</a></div>`;
}
// "Not doing what it should?" — the not-producing problems that apply to this plant, most specific first
function troubleHtml(k){
  const ps=DISORDERS.filter(d=>d.late&&pestOnPlant(d,k)).sort((a,b)=>a.on.includes('*')-b.on.includes('*'));
  if(!ps.length)return'';
  const xs=plantedCells().filter(x=>x.cell.p===k),lead=xs.length?leadCell(xs):null,exp=lead&&expectedDate(lead);
  const late=exp&&['seed','seedling','growing'].includes(lead.s)&&daysBetween(exp,localDate())>0?daysBetween(exp,localDate()):0;
  return `<div class="stat-lbl" id="trouble">🤔 Not doing what it should?</div>
    ${late?`<div class="hu-row bad" style="margin-bottom:6px">It's ${plural(late,'day')} past when we'd expect it to be ready.</div>`:''}
    <div class="pest-guide" style="margin-bottom:12px">${ps.map((p,i)=>`<details class="pg"${late&&i===0?' open':''}><summary><span>${p.e} ${p.n}</span></summary><div class="pg-body"><div class="id-what">${p.what}</div><div class="pest-txt"><b>Looks like:</b> ${p.look}</div>${remedyHtml(p)}<div class="pest-txt"><b>Next time:</b> ${p.prevent}</div></div></details>`).join('')}</div>`;
}
function readySignHtml(k){return READY_SIGN[k]?`<div class="sh-next"><div class="sh-nl">✅ Ready when</div><div class="sh-nv">${READY_SIGN[k]}</div></div>`:'';}
// focusTrouble: jump straight to "Not doing what it should?" (from a running-late job)
// Secondary sections on a plant sheet stay folded until tapped, so the harvest comes first
function foldHtml(title,html,open,id){return html?`<details class="pg sheet-fold"${id?` id="${id}"`:''}${open?' open':''}><summary><span>${title}</span></summary><div class="pg-body">${html.replace(/<div class="stat-lbl"[^>]*>[^<]*<\/div>/,'')}</div></details>`:'';}
function openGrowing(k,focusTrouble){
  if(focusTrouble)setTimeout(()=>$('trouble')?.scrollIntoView({behavior:'smooth',block:'start'}),300);
  const xs=plantedCells().filter(x=>x.cell.p===k);if(!xs.length){openPlantInfo(k);return;}
  if(isTree(k)){openTreeSheet(xs[0].bi);return;}
  const pl=P[k],lead=leadCell(xs),beds=[...new Set(xs.map(x=>x.bed.name))].map(esc).join(', ');
  const planted=xs.map(x=>x.cell.d).filter(Boolean).sort()[0];
  const picks=ST.log.filter(l=>l.p===k).reduce((s,l)=>s+(l.n||1),0);
  const pickable=xs.find(x=>['growing','ready','bolting'].includes(x.cell.s));
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div class="pi-hdr"><span class="sh-pe">${pl.e}</span><div><div class="sh-pn">${pl.n}</div><div class="sh-sub">${[...new Set(xs.map(x=>cellVariety(x.cell)?.n).filter(Boolean))].map(esc).join(', ')||''}${xs.some(x=>cellVariety(x.cell))?' · ':''}${xs.length>1?`${xs.length} plants · `:''}${beds}</div></div></div><button class="sh-cancel" onclick="closeSheet()">✕ Close</button></div></div>
    <div class="pi-facts"><div><div class="sh-cl">Planted</div><div class="pi-v">${planted?fmtDate(planted):'—'}</div></div><div><div class="sh-cl">Ready</div><div class="pi-v">${readyLabel(lead,false)}</div></div>
      <div><div class="sh-cl">Picked</div><div class="pi-v">${picks?plural(picks,'time'):'Not yet'}</div></div></div>
    ${pickable?`${weighHtml()}<div class="btn-row"><button class="btn btn-harvest" onclick="harvestSome(${pickable.bi},${pickable.ri},${pickable.ci})">🧺 Harvest some</button><button class="btn btn-seed" onclick="harvestAll('${k}')">✅ Harvest all${harvestable(k).length>1?` (${harvestable(k).length})`:''}</button></div>
    <div class="sh-hint">${harvestHint(k)}</div>`:''}
    ${readySignHtml(k)}
    ${recipesHtml(k)}
    ${foldHtml('👀 What to look out for',lookOutHtml(k,xs),false)}
    ${foldHtml('🤔 Not doing what it should?',troubleHtml(k),!!focusTrouble,'trouble')}
    <button class="btn btn-cancel btn-full" onclick="openPlantInfo('${k}')">📚 How it grows & neighbours</button>
  </div>`);
}
