// Plant behaviour: how each plant grows (spreads, climbs, sprawls…) and which neighbours help or hinder it.
// Shown in the plant details (Plants tab) and as a heads-up when planting a spot.
'use strict';
const TRAIT_DEF={
  spreads:  {e:'🌀',t:'Spreads underground',  d:'Runs through the whole bed by underground stems. Grow it in a pot — sink the pot into the bed if you like.',warn:true},
  runners:  {e:'🍓',t:'Sends out runners',     d:'Makes baby plants on long runners. Pinch them off to keep fruit coming, or pot them up for free plants.'},
  selfseeds:{e:'🌼',t:'Self-seeds',            d:'Drops seed and pops up again next season. Pull the extras, or let a few grow.'},
  tall:     {e:'📏',t:'Grows tall',            d:'Grows over 1m. Plant it on the south side of the bed so it doesn\'t shade shorter crops.',warn:true},
  sprawl:   {e:'🎃',t:'Sprawls',               d:'Vines spread 1–2m or more. Give it an edge or corner it can spill over.',warn:true},
  climb:    {e:'🪜',t:'Needs something to climb',d:'Put up a trellis, frame or teepee when you plant, not later.',warn:true},
  stake:    {e:'🦯',t:'Needs staking',         d:'Add a stake or cage at planting time — pushing one in later damages the roots.',warn:true},
  big:      {e:'↔️',t:'Needs room',            d:'One plant fills more than one spot. Leave the spots next to it empty.',warn:true},
  heavy:    {e:'🍽️',t:'Hungry feeder',        d:'Dig in compost before planting, then liquid-feed every 2 weeks once it flowers.'},
  nfix:     {e:'🫘',t:'Feeds the soil',        d:'Adds nitrogen to the soil through its roots — a great crop to grow before hungry leafy plants.'},
  perennial:{e:'♾️',t:'Comes back every year', d:'Lives for years. Give it a permanent spot where it won\'t be dug up.'},
  bolts:    {e:'⏱️',t:'Bolts in heat',         d:'Runs to flower and seed when it gets hot. Sow in the cool months and pick often.'},
};
const TRAITS={
  'broad-beans':['tall','stake','nfix'],'snow-peas':['climb','nfix'],'garden-peas':['climb','nfix'],
  'kale':['heavy'],'cos-lettuce':['bolts'],'spinach':['bolts'],'asian-greens':['bolts'],'bok-choy':['bolts'],
  'red-cabbage':['big','heavy'],'broccoli':['big','heavy'],'cauliflower':['big','heavy'],
  'coriander':['bolts','selfseeds'],'parsley':['selfseeds'],'garlic-chives':['perennial','selfseeds'],'dill':['tall','bolts','selfseeds'],
  'potato':['big','heavy'],'dwarf-beans':['nfix'],'strawberry':['runners','perennial'],
  'tomatoes':['tall','stake','heavy'],'cherry-tomato':['tall','stake','heavy'],'capsicum':['stake'],'eggplant':['stake','heavy'],
  'zucchini':['big','heavy'],'cucumber':['climb'],'climbing-beans':['climb','tall','nfix'],'snake-beans':['climb','tall','nfix'],
  'sweet-corn':['tall','heavy'],'pumpkin':['sprawl','big','heavy'],'sweet-potato':['sprawl','big'],
  'thyme':['perennial'],'rosemary':['perennial'],'sage':['perennial'],'oregano':['perennial'],'chives':['perennial'],
  'mint':['spreads','perennial'],'lemongrass':['perennial','big'],
  'marigold':['selfseeds'],'calendula':['selfseeds'],'nasturtium':['sprawl','selfseeds'],'borage':['big','selfseeds'],
};
// Harvested by pulling the whole plant up — nothing left to clear afterwards
const LIFTED=new Set(['beetroot','carrots','radish','turnip','onions','shallots','spring-onions','leek','garlic','potato','sweet-potato','cos-lettuce','bok-choy','asian-greens']);
function isLifted(k){return LIFTED.has(k);}
// Spots one plant really needs (default 1)
const SPOTS={'pumpkin':4,'sweet-potato':3,'zucchini':2,'borage':2};

// Neighbours. Terms are plant keys or family names (see FAMILY).
const GOOD_PAIRS=[
  ['tomatoes','basil','Basil is said to improve flavour and its scent confuses pests.'],
  ['cherry-tomato','basil','Basil is said to improve flavour and its scent confuses pests.'],
  ['nightshade','marigold','Marigolds draw in hoverflies and help deter whitefly.'],
  ['brassica','dill','Dill flowers feed the tiny wasps that attack caterpillars.'],
  ['brassica','nasturtium','Nasturtiums lure cabbage whites and aphids away from your brassicas.'],
  ['cucurbit','nasturtium','Nasturtiums act as a decoy for aphids.'],
  ['carrots','spring-onions','Onion scent helps mask carrots from pests.'],
  ['carrots','chives','Chive scent helps mask carrots from pests.'],
  ['sweet-corn','climbing-beans','Beans climb the corn and feed the soil it needs.'],
  ['sweet-corn','pumpkin','Pumpkin leaves shade the soil and keep moisture in for the corn.'],
  ['strawberry','borage','Borage brings in bees, so more fruit sets.'],
  ['leafy','legume','Beans and peas leave nitrogen behind for hungry leafy greens.'],
];
const BAD_PAIRS=[
  ['legume','allium','Onions, garlic and chives slow the growth of beans and peas.'],
  ['potato','nightshade','Potatoes share diseases with tomatoes, capsicum and eggplant.'],
  ['sweet-corn','tomatoes','Both attract the same tomato grub (heliothis).'],
  ['sweet-corn','cherry-tomato','Both attract the same tomato grub (heliothis).'],
];
function traitsOf(k){return(TRAITS[k]||[]).map(t=>({id:t,...TRAIT_DEF[t]}));}
function isTerm(k,term){return k===term||!!FAMILY[term]?.includes(k);}
// Pairs that involve plant k and plant o (either way round)
function pairNote(list,k,o){for(const[a,b,why]of list){if((isTerm(k,a)&&isTerm(o,b))||(isTerm(k,b)&&isTerm(o,a)))return why;}return null;}
function neighbourGuide(k){
  const others=Object.keys(P).filter(o=>o!==k&&!P[o].custom);
  const good=others.filter(o=>pairNote(GOOD_PAIRS,k,o)),bad=others.filter(o=>pairNote(BAD_PAIRS,k,o));
  return{good,bad};
}
// What's already in bed bi that plant k gets on (or doesn't get on) with
function bedNeighbours(k,bi){
  const here=[...new Set(plantedCells().filter(x=>x.bi===bi&&x.cell.p!==k).map(x=>x.cell.p))];
  return{
    good:here.map(o=>({o,why:pairNote(GOOD_PAIRS,k,o)})).filter(x=>x.why),
    bad:here.map(o=>({o,why:pairNote(BAD_PAIRS,k,o)})).filter(x=>x.why),
  };
}

// Plant details sheet: how it grows + neighbours
function behaviourHtml(k){
  const ts=traitsOf(k),{good,bad}=neighbourGuide(k),sp=SPOTS[k];
  if(!ts.length&&!good.length&&!bad.length)return'';
  const names=ks=>ks.map(o=>`${P[o].e} ${P[o].n}`).join(', ');
  return `<div class="stat-lbl">🌿 How it grows</div>
    ${ts.length?`<div class="trait-list">${ts.map(t=>`<div class="trait"><span class="trait-e">${t.e}</span><div><b>${t.t}${t.id==='big'&&sp?` — about ${sp} spots`:''}</b><div>${t.d}</div></div></div>`).join('')}</div>`:''}
    ${good.length?`<div class="nb good"><b>👍 Good neighbours:</b> ${names(good)}</div>`:''}
    ${bad.length?`<div class="nb bad"><b>✋ Keep apart from:</b> ${names(bad)}</div>`:''}`;
}
function groupWhy(xs){const g=new Map();xs.forEach(x=>{if(!g.has(x.why))g.set(x.why,[]);g.get(x.why).push(x.o);});return[...g];}
function andList(ks){const n=ks.map(k=>P[k].n);return n.length>1?n.slice(0,-1).join(', ')+' and '+n.at(-1):n[0];}
// Planting sheet: only the things worth knowing before it goes in this bed
function plantingHeadsUpHtml(k,bi){
  const warn=traitsOf(k).filter(t=>t.warn),{good,bad}=bedNeighbours(k,bi),sp=SPOTS[k];
  const low=ST.beds[bi].low&&TRAITS[k]?.includes('tall');
  if(!warn.length&&!good.length&&!bad.length&&!low)return'';
  return `<div class="heads-up"><div class="hu-t">Heads up</div>
    ${low?`<div class="hu-row bad">📏 This bed is set to low crops only — ${P[k].n} grows tall.</div>`:''}
    ${groupWhy(bad).map(([why,os])=>`<div class="hu-row bad">✋ ${andList(os)} ${os.length>1?'are':'is'} in this bed — ${why.charAt(0).toLowerCase()+why.slice(1)}</div>`).join('')}
    ${warn.map(t=>`<div class="hu-row">${t.e} <b>${t.t}${t.id==='big'&&sp?` (about ${sp} spots)`:''}.</b> ${t.d}</div>`).join('')}
    ${groupWhy(good).map(([why,os])=>`<div class="hu-row good">👍 Good next to your ${andList(os)}. ${why}</div>`).join('')}
  </div>`;
}
