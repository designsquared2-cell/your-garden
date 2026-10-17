// Problems tab: pests + growing problems, the beginner finder, prevention, remedies, pest-check jobs.
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

// ── Prevention ── act before a pest arrives. Several pests can share one action (one net covers both caterpillars).
//   months: when the job shows (lead-up + while it's still worth doing); before: months it's still "on its way"
//   on: (optional) the plants the action is for, when narrower than the pests' own list
const GUARDS={
  'net-brassica':{pests:['cabbage-white','diamondback'],months:[7,8,9,10,11,0,1,2,3],before:[7],
    act:'Net your brassicas',how:'Cover them with fine insect netting held off the leaves on hoops, edges pinned down. Butterflies and moths can\'t lay eggs on what they can\'t reach.'},
  'flowers-aphids':{pests:['aphids'],months:[6,7],before:[6,7],
    act:'Plant flowers for aphid-eaters',how:'Sow alyssum, calendula or native daisies near your veg now, so ladybirds and hoverflies are already living there when aphids arrive in spring.'},
  'snail-traps':{pests:['snails'],months:[2,3,4],before:[2],
    act:'Set snail traps before the rain',how:'Sink beer traps and clear hiding spots (boards, pots, weedy edges) before the wet season starts.'},
  'collars':{pests:['cutworm'],on:['*seedlings'],months:[7,8,9,10],before:[7],
    act:'Put collars on new seedlings',how:'Slip a cardboard tube (a toilet-roll inner) over each seedling, pushed 2cm into the soil.'},
  'medfly-traps':{pests:['medfly'],months:[7,8,9],before:[7,8],
    act:'Hang Medfly bait traps',how:'Hang traps in spring as the weather warms, before fruit starts to colour. Control is mandatory in the Kalamunda and Mundaring shires.'},
  'mite-mulch':{pests:['two-spot-mite','russet-mite'],months:[9,10],before:[9],
    act:'Mulch thickly before summer',how:'Spread 5–7cm of mulch and water deeply. Mites boom on dry, dusty, stressed plants.'},
  'sticky-traps':{pests:['whitefly'],months:[9,10],before:[9],
    act:'Hang yellow sticky traps',how:'One trap per bed shows you the moment whitefly arrive, while they\'re still easy to deal with.'},
  'mildew-space':{pests:['powdery-mildew'],on:['cucurbit'],months:[11,0,1],before:[11],
    act:'Give zucchini and pumpkins air',how:'Thin out crowded leaves and water the soil, not the leaves. Start a weekly milk spray before mildew shows up.'},
  'net-fruit':{pests:['birds'],on:['strawberry'],months:[8,9,10],before:[8],
    act:'Net strawberries before they colour',how:'Net over a frame as soon as flowers appear, so birds can\'t reach through.'},
};
const GUARD_DONE_DAYS=150; // one job done covers the season

// ── Remedies ── 🌿 home-made · 🛒 organic from the shop · 🌏 native helpers
const REMEDIES={
  'cabbage-white':{nat:['Pick off caterpillars and the tiny yellow eggs under leaves every couple of days','Garlic & chilli spray discourages egg-laying'],org:['Bt (Dipel) every 7 days — it only affects caterpillars','Spinosad if Bt isn\'t working'],native:'Native daisies (Brachyscome) and paper daisies feed the tiny wasps that attack caterpillars.'},
  'diamondback':{nat:['Squash caterpillars and check inside the heads','Remove and bin badly infested plants'],org:['Bt and spinosad, alternated — they quickly become resistant to any one spray'],native:'Native daisies (Brachyscome) and paper daisies feed the tiny wasps that attack caterpillars.'},
  'aphids':{nat:['Squash or wipe them off','Blast off with a strong jet of water','Soap spray: 1 tablespoon of pure soap (not detergent) per litre of water'],org:['Eco-oil or an insecticidal soap'],native:'Native daisies, paper daisies and native bluebells bring in hoverflies and ladybirds, which eat hundreds of aphids.'},
  'snails':{nat:['Torch patrol after dark or after rain','Beer traps sunk to soil level','A ring of coarse sand or copper tape around seedlings'],org:['Iron-based pellets (iron EDTA) — safer for pets and wildlife'],native:'A log, rock pile or clump of Lomandra shelters blue-tongue lizards and frogs, which eat snails.'},
  'cutworm':{nat:['Dig gently around damaged plants at dusk and remove the grubs','Cardboard collars around seedlings'],org:['Bt watered onto the soil around seedlings'],native:'Magpies dig for grubs — leave open soil between crops for them to forage.'},
  'earwigs':{nat:['Rolled-up damp newspaper or an oil trap, emptied each morning','Pull mulch back from seedlings'],org:['Rarely needed — earwigs also eat aphids']},
  'medfly':{nat:['Pick fruit as it colours','Bag or bin stung and fallen fruit sealed — never compost it'],org:['Bait traps or protein bait spray from a nursery','Fine netting or fruit bags over fruiting plants']},
  'two-spot-mite':{nat:['Hose leaf undersides every day or two','Remove the worst leaves','Keep plants watered and mulched'],org:['Eco-oil, or wettable sulphur (never above about 30°C)','Predatory mites for big outbreaks'],native:'Native daisies feed mite-eating ladybirds (tiny black Stethorus).'},
  'russet-mite':{nat:['Remove affected lower leaves early and bin them'],org:['Wettable sulphur — never above about 30°C']},
  'whitefly':{nat:['Yellow sticky traps','Hose leaf undersides'],org:['Eco-oil weekly while they\'re bad'],native:'Native daisies feed the lacewings and ladybirds that eat whitefly.'},
  'heliothis':{nat:['Pick off caterpillars and damaged fruit'],org:['Bt while caterpillars are small'],native:'Native daisies feed the tiny wasps that attack caterpillars.'},
  'shield-bugs':{nat:['Early morning, knock them into a bucket of soapy water','Squash the neat egg rafts under leaves'],org:['Pyrethrum — a last resort, as it also kills helpful insects']},
  'powdery-mildew':{nat:['Milk spray: 1 part milk to 9 parts water, weekly','Remove the worst leaves','Water the soil, not the leaves'],org:['Potassium bicarbonate (e.g. Eco-Fungicide)','Wettable sulphur (not in heat)']},
  'birds':{nat:['Netting over a frame','Reflective tape or old CDs (works for a while)'],native:'Grevilleas and kangaroo paws planted away from the veg give honeyeaters a better option.'},
};
PESTS.forEach(p=>Object.assign(p,{kind:'pest',rem:REMEDIES[p.id]||{nat:[p.fix]}}));

// ── Growing problems ── not bugs: water, food and weather. No season; weather can make them more likely.
const DISORDERS=[
  {id:'overwater',e:'💦',n:'Too much water',on:['*'],
   what:'Roots need air as well as water. Soil that stays soggy drowns them, so the plant yellows and droops even though it\'s wet.',
   look:'Yellowing older leaves, soft droopy growth, soil wet a few centimetres down, a sour smell, tiny black flies around the soil.',
   rem:{nat:['Stop watering until the top 3–5cm is dry','Loosen or pull back thick mulch so the soil can breathe','Pull out plants that have rotted at the base']},
   prevent:'Water by feel, not by the calendar — and use the watering card in Jobs.'},
  {id:'underwater',e:'🏜️',n:'Not enough water',on:['*'],
   what:'Short of water, plants shut down to survive: leaves droop, edges dry out, and leafy crops rush to flower.',
   look:'Leaves droop in the afternoon and perk up overnight, crisp brown edges, dry dusty soil, leafy greens bolting, woody roots.',
   rem:{nat:['Water deeply in the early morning so it soaks 20cm down','Mulch 5–7cm thick to hold the water in','Shade cloth over the hottest afternoons']},
   prevent:'Mulch before summer and follow the watering card in Jobs.'},
  {id:'uneven-water',e:'🍅',n:'Uneven watering',on:['nightshade','cucurbit'],
   what:'When soil swings between dry and soaked, fruit can\'t take up calcium evenly (black bottoms) or swells too fast and splits.',
   look:'A dark, leathery, sunken patch on the bottom of tomatoes, capsicums or zucchini; fruit cracking after rain or a big water.',
   rem:{nat:['Pick off the damaged fruit — the next ones will be fine','Water on a steady schedule and keep the mulch thick']},
   prevent:'Deep, regular watering and thick mulch from flowering onwards.'},
  {id:'hungry',e:'🍂',n:'Hungry plants (low nitrogen)',on:['*'],
   what:'When the soil runs short, plants move food from old leaves to new growth — so the oldest leaves turn yellow first and growth slows.',
   look:'A pale green or yellowish plant, oldest leaves yellowing first, small slow growth.',
   rem:{nat:['Water in a liquid feed every 2 weeks — worm tea, fish emulsion or seaweed + fish','Spread compost or aged manure around the plant'],org:['A balanced organic pelleted fertiliser']},
   prevent:'Dig compost in before planting, and grow beans or peas first to feed the soil.'},
  {id:'heat',e:'🌡️',n:'Heat stress & sunscald',on:['*'],
   what:'On 35°C-plus days leaves and fruit can literally burn, and plants drop their flowers instead of making fruit.',
   look:'Bleached, papery patches on leaves and fruit facing the afternoon sun; flowers falling off without fruit.',
   rem:{nat:['30–50% shade cloth over the hottest afternoons','Water deeply the morning before a heatwave']},
   prevent:'Mulch, water in the morning, and have shade cloth ready before summer.'},
  {id:'bolting',e:'🌼',n:'Bolting (running to seed)',on:['leafy','brassica','coriander','parsley','dill','bok-choy','asian-greens'],
   what:'Leafy crops and herbs flower when days get long and hot. It\'s the natural end of their season, not a disease.',
   look:'A tall flower stalk shooting up from the middle; leaves turning small, tough and bitter.',
   rem:{nat:['Harvest everything worth eating now','Pull it out and plant a warm-season crop in its place','Let one plant flower for the bees, or to save seed']},
   prevent:'Sow cool-season leafy crops early so they finish before the heat, and pick often.'},
];
// Not producing / running late — late:true marks these for the "running late" job and plant sheets
DISORDERS.push(
  {id:'no-heading',e:'🥬',n:'Not heading up',late:true,on:['red-cabbage','cauliflower','broccoli'],
   what:'Cabbage, broccoli and cauliflower only form a head after a lot of leaf growth, and best in cool weather. Big outer leaves with no head usually means it\'s still building up, it was stressed when young, it\'s had too much nitrogen, or the weather warmed up before it could head.',
   look:'Large, healthy outer leaves but no firm head in the centre — or only a tiny, loose "button" head.',
   rem:{nat:['Give it time — red cabbage can take 120–150 days from a seedling','Feed for heads, not leaves: compost or sulphate of potash, not manure or blood & bone','Keep the soil evenly moist — dry spells stall heading','If it still hasn\'t headed as the weather warms, eat the leaves like kale — they\'re good braised or in slaw']},
   prevent:'In Perth, plant brassica seedlings Feb–Apr so they head in the cool months, and don\'t let young plants dry out or sit too long in their punnet.'},
  {id:'all-leaves',e:'🌳',n:'All leaves, no fruit',late:true,on:['nightshade','cucurbit','legume','strawberry'],
   what:'Too much nitrogen makes plants grow lush leaves instead of flowers and fruit.',
   look:'Big, dark green, bushy plants with few flowers or fruit.',
   rem:{nat:['Stop high-nitrogen feeds (manure, blood & bone, lawn food)','Feed with potash or a tomato/flowering food instead','On tomatoes, pinch out some leafy side shoots']},
   prevent:'Go easy on manure for fruiting crops — compost is enough.'},
  {id:'no-fruit-set',e:'🐝',n:'Flowers but no fruit',late:true,on:['cucurbit','nightshade','legume','strawberry'],
   what:'Fruit only forms when flowers are pollinated. Too few bees, heat over about 32°C, or (for zucchini and pumpkins) only male flowers early in the season all stop fruit from setting.',
   look:'Plenty of flowers that fall off; baby zucchini that shrivel and rot at the tip.',
   rem:{nat:['Zucchini & pumpkin: in the morning, brush pollen from a male flower onto the female flowers (the ones with a tiny fruit behind them)','Tomatoes & capsicum: gently shake the plants while flowering','Plant borage, alyssum or native daisies nearby to bring in bees']},
   prevent:'Grow bee-friendly flowers in every bed, and shade plants in heatwaves.'},
  {id:'roots-thin',e:'🥕',n:'Roots not swelling',late:true,on:['beetroot','carrots','turnip','radish','onions','shallots','garlic','potato','sweet-potato','leek'],
   what:'Root crops swell when they have loose soil, room and even watering. Crowding, rich nitrogen feeds and hard soil keep them thin — and stones or fresh manure make carrots fork.',
   look:'Plenty of leaf but thin or small roots; forked, twisted or hairy carrots.',
   rem:{nat:['Thin them so each has room — beetroot 10cm apart, carrots 5cm','Stop nitrogen feeds; use potash instead','Water deeply and evenly']},
   prevent:'Sow into loose, stone-free soil with old compost — never fresh manure.'},
  {id:'not-ripening',e:'🍅',n:'Fruit not ripening',late:true,on:['tomatoes','cherry-tomato','capsicum','chilli','eggplant','pumpkin'],
   what:'Tomatoes and capsicums colour up best between about 20 and 30°C. In cool weather — or very hot spells over about 32°C — they stall green.',
   look:'Full-sized fruit that stays green for weeks.',
   rem:{nat:['Be patient — they ripen as temperatures settle','Late in the season, pick full-sized green fruit and ripen it indoors in a paper bag with a banana','Late in the season, nip off new flowers so the plant ripens what it has']},
   prevent:'Plant warm-season crops in Sept–Oct so fruit ripens through summer.'},
  {id:'slow',e:'🐌',n:'Growing very slowly',late:true,on:['*'],
   what:'Plants almost stop in cold weather, and warm-season crops planted too early sulk until nights warm up. Hungry or compacted soil slows everything too.',
   look:'Plants that have barely changed in weeks, often pale or small.',
   rem:{nat:['Water in a liquid seaweed or worm-tea feed every week or two','Loosen the soil surface and add compost around (not against) the stems','Be patient — growth picks up as the season turns']},
   prevent:'Plant in season, into compost-rich soil.'},
);
DISORDERS.forEach(d=>d.kind='growing');
const PROBLEMS=[...PESTS,...DISORDERS];
const PEST_BY_ID=Object.fromEntries(PROBLEMS.map(p=>[p.id,p]));
const PEST_SNOOZE_DAYS=7,PEST_RECHECK_DAYS=3;

function pestOnPlant(pest,k){return pest.on.some(t=>t==='*'||t===k||FAMILY[t]?.includes(k));}
function pestHitsCell(pest,cell){
  if(isEmpty(cell)||cell.s==='done')return false;
  return pestOnPlant(pest,cell.p)||(pest.on.includes('*seedlings')&&(cell.s==='seed'||cell.s==='seedling'));
}
function pestsFor(k){return PESTS.filter(p=>pestOnPlant(p,k));}
function pestActive(pest,m=curMonth()){return pest.months?pest.months.includes(m):true;}
function pestPeak(pest,m=curMonth()){return!!pest.peak?.includes(m);}
function pestCells(pest){return plantedCells().filter(x=>pestHitsCell(pest,x.cell));}
// Pests active this month that could be on something you're growing now, peak first
function pestsToWatch(m=curMonth()){
  return PESTS.filter(p=>pestActive(p,m)&&pestCells(p).length).sort((a,b)=>pestPeak(b,m)-pestPeak(a,m));
}
function monthsText(ms){
  const has=m=>ms.includes((m+12)%12);
  const start=[...ms].sort((a,b)=>a-b).find(m=>!has(m-1));if(start==null)return'All year';
  const runs=[];let s=null,prev=null;
  for(let i=0,m=start;i<12;i++,m=(m+1)%12){if(has(m)){if(s==null)s=m;prev=m;}else if(s!=null){runs.push([s,prev]);s=null;}}
  if(s!=null)runs.push([s,prev]);
  return runs.map(([a,b])=>a===b?MONTHS[a].slice(0,3):`${MONTHS[a].slice(0,3)}–${MONTHS[b].slice(0,3)}`).join(', ');
}
function plantList(cells,max=3){
  const names=[...new Set(cells.map(x=>x.cell.p))].map(k=>P[k].n);
  return names.length>max?names.slice(0,max).join(', ')+` +${names.length-max} more`:names.join(', ');
}
function bedList(cells){return[...new Set(cells.map(x=>x.bed.name))].map(esc).join(', ');}

// ── Remedies display ── honours Settings → "natural remedies only"
function remedyHtml(p){
  const r=p.rem||{},only=!!ST.prefs.naturalOnly,li=xs=>xs.map(x=>`<li>${x}</li>`).join('');
  return `<div class="rem">${r.nat?.length?`<div class="rem-t">🌿 Natural & home-made</div><ul>${li(r.nat)}</ul>`:''}
    ${!only&&r.org?.length?`<div class="rem-t">🛒 Organic, from the shop</div><ul>${li(r.org)}</ul>`:''}
    ${r.native?`<div class="rem-t">🌏 Native helpers</div><div class="rem-n">${r.native}</div>`:''}</div>`;
}
function remedyText(p){const r=p.rem||{};return[...(r.nat||[]).slice(0,2),...(ST.prefs.naturalOnly?[]:(r.org||[]).slice(0,1))].join('. ')+'.';}

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
function guardDone(id){const d=ST.guardDone[id];return!!d&&daysBetween(d,localDate())<GUARD_DONE_DAYS;}
function guardCells(g){const ps=g.on?[{on:g.on}]:g.pests.map(id=>PEST_BY_ID[id]);return plantedCells().filter(x=>ps.some(p=>pestHitsCell(p,x.cell)));}
function recentRain(days){if(!WX?.daily)return 0;const d=WX.daily,ti=wxToday(d);let s=0;for(let i=Math.max(0,ti-days+1);i<=ti;i++)s+=d.precipitation_sum[i]||0;return s;}
// Prevention jobs: in the lead-up to (and early in) each pest's season, for plants you're growing
function guardItems(m){
  const out=Object.entries(GUARDS).filter(([id,g])=>g.months.includes(m)&&!guardDone(id)).map(([id,g])=>{
    const cells=guardCells(g);if(!cells.length)return null;
    const p=PEST_BY_ID[g.pests[0]],coming=g.before.includes(m);
    return{kind:'guard',id,type:'guard',cb:true,icon:'🛡️',title:`🛡️ ${g.act}`,
      detail:`${coming?`${p.n} usually arrive from ${MONTHS[p.months[0]]} — get ahead of them.`:`${p.n} are about now.`} ${g.how} <span class="task-where">For your ${plantList(cells)} · ${bedList(cells)}</span>`};
  }).filter(Boolean);
  // Weather trigger: after a soaking, snails are out tonight
  const cells=pestCells(PEST_BY_ID.snails),rain=recentRain(3);
  if(cells.length&&rain>=10&&!pestDoneRecently('snails-rain'))
    out.unshift({kind:'guard',id:'snails-rain',type:'guard',cb:true,icon:'🐌',title:'🐌 Snail patrol tonight',
      detail:`About ${Math.round(rain)}mm of rain in the last few days — snails and slugs will be out after dark. Check your ${plantList(cells)} with a torch, or set beer traps. <span class="task-where">${bedList(cells)}</span>`});
  return out;
}
function treatItems(){
  return ST.pestReports.map((r,i)=>{
    const p=PEST_BY_ID[r.pest],bed=bedById(r.bid);if(!p)return null;
    return{kind:'treat',id:String(i),type:'urgent',cb:true,
      title:`${p.e} ${p.kind==='growing'?'Fix':'Treat'} ${p.n.toLowerCase()} on ${plantName(r.p)}${bed?` — ${esc(bed.name)}`:''}`,
      detail:`${remedyText(p)} Tick once done — we'll remind you to check again in ${PEST_RECHECK_DAYS} days.`};
  }).filter(Boolean);
}
function tickPest(id){ST.pestDone[id]=localDate();return`✓ All clear — next ${PEST_BY_ID[id].n.toLowerCase()} check in a week`;}
function tickGuard(id){
  if(id==='snails-rain'){ST.pestDone[id]=localDate();return'🐌 Patrol done — good work';}
  ST.guardDone[id]=localDate();return'🛡️ Done — your plants are protected';
}
function tickTreat(i){
  const r=ST.pestReports.splice(+i,1)[0];if(!r)return'✓ Done';
  // back-date the check so it comes round again in PEST_RECHECK_DAYS
  if(PEST_BY_ID[r.pest]?.kind==='pest')ST.pestDone[r.pest]=addDays(localDate(),PEST_RECHECK_DAYS-PEST_SNOOZE_DAYS);
  return`✓ Done — check again in ${PEST_RECHECK_DAYS} days`;
}

// ── "That's it" / "Found some" → a job ──
function plantGroups(cells){const g=new Map();cells.forEach(x=>{const k=x.bi+':'+x.cell.p;if(!g.has(k))g.set(k,x);});return[...g.values()];}
function openPestReport(id,plant){
  const p=PEST_BY_ID[id];
  // Plants this problem usually affects; if none (or a beginner's guess doesn't fit), let them pick any plant
  let opts=plantGroups(pestCells(p));
  if(plant)opts=opts.filter(x=>x.cell.p===plant);
  if(!opts.length)opts=plantGroups(plantedCells().filter(x=>!plant||x.cell.p===plant));
  if(opts.length===1){reportPest(id,opts[0].cell.p,opts[0].bi);return;}
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">${p.e} Where is it?</div><div class="sh-sub">We'll add a job to Jobs</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Cancel</button></div></div>
    ${opts.map(x=>`<button class="loc-res" onclick="reportPest('${id}','${x.cell.p}',${x.bi})">${P[x.cell.p].e} ${P[x.cell.p].n} <span class="hlog-d">· ${esc(x.bed.name)}</span></button>`).join('')||'<div class="set-txt">Nothing planted yet.</div>'}
    ${remedyHtml(p)}</div>`);
}
function reportPest(id,p,bi){
  const bid=ST.beds[bi].id;
  if(!ST.pestReports.some(r=>r.pest===id&&r.p===p&&r.bid===bid))ST.pestReports.push({pest:id,p,bid,d:localDate()});
  saveState();closeSheet();refreshAll();
  toast(`${PEST_BY_ID[id].e} Job added to Jobs`);
}

// ── Finder: "What are you seeing?" ── 1 where → 2 what (any number of signs) → 3 which plant (optional)
const AREAS=[['bugs','🐛','Bugs I can see'],['leaves','🍃','Leaves'],['fruit','🍅','Fruit or pods'],['seedlings','🌱','Seedlings'],['whole','🥀','The whole plant'],['late','🧺','Not producing / slow']];
const SYMPTOMS=[
  {id:'green-cat',a:['bugs','leaves'],e:'🐛',t:'Small green caterpillars'},
  {id:'white-fly-about',a:['bugs'],e:'🦋',t:'White butterflies or small moths'},
  {id:'tiny-clusters',a:['bugs','leaves'],e:'🐜',t:'Clusters of tiny insects'},
  {id:'ants',a:['bugs'],e:'🐜',t:'Ants running up stems'},
  {id:'white-flies',a:['bugs','leaves'],e:'🤍',t:'Tiny white flies when brushed'},
  {id:'snail',a:['bugs','seedlings'],e:'🐌',t:'Snails, slugs or slime trails'},
  {id:'grey-grub',a:['bugs','seedlings'],e:'🪱',t:'Fat grey grubs in the soil'},
  {id:'earwig',a:['bugs'],e:'🪳',t:'Brown bugs with tail pincers'},
  {id:'shield-bug',a:['bugs'],e:'🪲',t:'Green shield-shaped bugs'},
  {id:'gnats',a:['bugs','whole'],e:'🦟',t:'Tiny black flies around the soil'},
  {id:'birds',a:['bugs','fruit','seedlings'],e:'🐦',t:'Birds hanging around'},
  {id:'holes',a:['leaves'],e:'🍃',t:'Holes chewed in leaves'},
  {id:'window',a:['leaves'],e:'🪟',t:'See-through patches'},
  {id:'droppings',a:['leaves'],e:'⚫',t:'Little green or dark droppings'},
  {id:'curled',a:['leaves'],e:'🌀',t:'Curled or puckered new leaves'},
  {id:'sticky',a:['leaves'],e:'🍯',t:'Sticky leaves or black mould'},
  {id:'speckled',a:['leaves'],e:'⚪',t:'Pale speckles or dots'},
  {id:'webbing',a:['leaves'],e:'🕸️',t:'Fine webbing underneath'},
  {id:'powder',a:['leaves'],e:'🌫️',t:'White powder'},
  {id:'yellow-lower',a:['leaves','whole'],e:'🟡',t:'Older, lower leaves turning yellow'},
  {id:'pale-all',a:['leaves','whole'],e:'🫥',t:'Pale or yellowish all over'},
  {id:'crispy',a:['leaves'],e:'🍂',t:'Crispy brown edges'},
  {id:'scorched',a:['leaves','fruit'],e:'☀️',t:'Bleached or scorched patches'},
  {id:'bronze',a:['leaves','whole'],e:'🟤',t:'Bronze, dried-out lower leaves'},
  {id:'fruit-holes',a:['fruit'],e:'🕳️',t:'Holes or soft spots'},
  {id:'maggots',a:['fruit'],e:'🪰',t:'Maggots inside'},
  {id:'black-bottom',a:['fruit'],e:'⚫',t:'Black sunken patch on the bottom'},
  {id:'split',a:['fruit'],e:'💔',t:'Split or cracked fruit'},
  {id:'pecked',a:['fruit','seedlings'],e:'🍓',t:'Pecked fruit or pulled-up seedlings'},
  {id:'seedling-cut',a:['seedlings'],e:'✂️',t:'Cut off at the base, or vanished'},
  {id:'overnight',a:['seedlings','leaves'],e:'🌙',t:'Damage appears overnight'},
  {id:'wilt-wet',a:['whole','seedlings'],e:'💧',t:'Droopy even though the soil is wet'},
  {id:'wilt-midday',a:['whole'],e:'🥵',t:'Droops in the afternoon, perks up overnight'},
  {id:'stem-rot',a:['whole','seedlings'],e:'🟫',t:'Soft, dark rot at the base'},
  {id:'bolting',a:['whole'],e:'🌼',t:'Shooting up a flower stalk early'},
  {id:'wilting',a:['whole','fruit'],e:'🥀',t:'Wilting tips or pods dropping'},
  {id:'no-head',a:['late'],e:'🥬',t:'No head forming (cabbage, broccoli, cauli)'},
  {id:'button',a:['late'],e:'🔘',t:'Tiny, loose heads'},
  {id:'leafy-only',a:['late','whole'],e:'🌳',t:'Lots of leaves, few flowers or fruit'},
  {id:'flowers-no-fruit',a:['late','fruit'],e:'🌼',t:'Flowers but no fruit'},
  {id:'baby-rot',a:['late','fruit'],e:'🥒',t:'Baby fruit shrivels and rots'},
  {id:'thin-roots',a:['late'],e:'🥕',t:'Roots small or not swelling'},
  {id:'forked',a:['late'],e:'🍴',t:'Forked or twisted carrots'},
  {id:'green-fruit',a:['late','fruit'],e:'🟢',t:'Fruit staying green'},
  {id:'slow',a:['late','whole'],e:'🐢',t:'Barely grown in weeks'},
];
const SYM_BY_ID=Object.fromEntries(SYMPTOMS.map(s=>[s.id,s]));
// signs: which symptoms point to each problem; what: plain-language "what am I looking at?"
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
  'overwater':{signs:['yellow-lower','wilt-wet','stem-rot','gnats']},
  'underwater':{signs:['wilt-midday','crispy','bolting','yellow-lower']},
  'uneven-water':{signs:['black-bottom','split']},
  'hungry':{signs:['pale-all','yellow-lower','slow']},
  'heat':{signs:['scorched','wilt-midday','crispy']},
  'bolting':{signs:['bolting']},
  'no-heading':{signs:['no-head','button','leafy-only']},
  'all-leaves':{signs:['leafy-only','flowers-no-fruit']},
  'no-fruit-set':{signs:['flowers-no-fruit','baby-rot']},
  'roots-thin':{signs:['thin-roots','forked','leafy-only']},
  'not-ripening':{signs:['green-fruit']},
  'slow':{signs:['slow']},
};
PROBLEMS.forEach(p=>Object.assign(p,PEST_ID[p.id]));

let _pTab='id',_idArea=null,_idSel=new Set(),_idPlant=null;
function pTab(t){_pTab=t;renderPests();window.scrollTo(0,0);}
function idArea(a){_idArea=a;renderPests();}
function idToggle(s){_idSel.has(s)?_idSel.delete(s):_idSel.add(s);renderPests();}
function idPlant(k){_idPlant=_idPlant===k?null:k;renderPests();}
function idClear(){_idSel.clear();_idPlant=null;_idArea=null;renderPests();}
// From a plant sheet: "Something wrong with this plant?"
function openPestsFor(k){closeSheet();_idSel.clear();_idArea=null;_idPlant=k;_pTab='id';setView('pests');}
// Recent weather makes some growing problems more likely
function weatherBoost(p){
  if(!WX?.daily)return 0;
  const wet=recentRain(7),v=wxVerdict(),d=WX.daily,ti=wxToday(d);
  const hot=[ti-2,ti-1,ti].some(i=>(d.temperature_2m_max[i]||0)>=35);
  return{overwater:wet>=25?3:wet>=10?1:0,underwater:v?.lv==='r'?3:v?.lv==='y'?1:0,heat:hot?3:0}[p.id]||0;
}
function idMatches(){
  if(!_idSel.size)return[];
  const m=curMonth();
  return PROBLEMS.map(p=>{
    const hit=p.signs.filter(s=>_idSel.has(s)).length;if(!hit)return null;
    let score=hit*3+weatherBoost(p);
    if(_idPlant)score+=pestOnPlant(p,_idPlant)?3:-2;
    if(p.months&&pestActive(p,m))score+=1;if(pestPeak(p,m))score+=1;
    return{p,score};
  }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,3);
}
function photosUrl(p){return'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(p.n+(p.kind==='growing'?' vegetable plant symptoms':' garden pest Australia'));}
function idResultHtml({p},i){
  const fits=_idPlant&&!pestOnPlant(p,_idPlant);
  return `<div class="id-res${i===0?' top':''}"><div class="pest-hdr"><span class="pest-e">${p.e}</span><div><div class="id-lead">${i===0?'Most likely':'Could also be'}</div><div class="pest-n">${p.n}</div></div></div>
    <div class="id-what">${p.what}</div>
    ${weatherBoost(p)>=3?'<div class="pest-txt id-wx">🌦️ Your recent weather makes this more likely.</div>':''}
    <div class="pest-txt"><b>How to tell:</b> ${p.look}</div>
    ${remedyHtml(p)}
    ${fits?`<div class="pest-txt id-warn">It doesn't usually affect ${plantName(_idPlant)}, so compare the photos.</div>`:''}
    <div class="id-btns"><a class="id-photos" href="${photosUrl(p)}" target="_blank" rel="noopener" onclick="return openLink(event,this)">📷 See photos ↗</a>${plantedCells().length?`<button class="task-btn" onclick="openPestReport('${p.id}',${_idPlant?`'${_idPlant}'`:'null'})">✓ That's it — add a job</button>`:''}</div></div>`;
}
function identifyHtml(){
  const matches=idMatches();
  const mine=[...new Set(plantedCells().map(x=>x.cell.p))];
  if(_idPlant&&!mine.includes(_idPlant))mine.unshift(_idPlant);
  const others=[..._idSel].map(s=>SYM_BY_ID[s]).filter(s=>!s.a.includes(_idArea));
  return `<div class="id-step"><span class="id-num">1</span> Where's the problem?</div>
    <div class="area-grid">${AREAS.map(([a,e,l])=>`<button class="area${_idArea===a?' on':''}" onclick="idArea('${a}')"><span>${e}</span>${l}</button>`).join('')}</div>
    ${_idArea?`<div class="id-step"><span class="id-num">2</span> What can you see? <span class="hlog-d">tap all that fit</span></div>
      <div class="sym-wrap">${SYMPTOMS.filter(s=>s.a.includes(_idArea)).map(s=>`<button class="sym${_idSel.has(s.id)?' on':''}" onclick="idToggle('${s.id}')">${s.e} ${s.t}</button>`).join('')}</div>`:''}
    ${others.length?`<div class="id-picked"><span class="hlog-d">Also ticked:</span> ${others.map(s=>`<button class="sym on mini" onclick="idToggle('${s.id}')">${s.e} ${s.t} ✕</button>`).join('')}</div>`:''}
    ${_idArea&&mine.length?`<details class="id-plant" id="id-plant"${_idPlant?' open':''}><summary><span class="id-num">3</span> Which plant? <span class="hlog-d">${_idPlant?plantName(_idPlant):'optional'}</span></summary><div class="sym-wrap">${mine.map(k=>`<button class="sym${_idPlant===k?' on':''}" onclick="idPlant('${k}')">${P[k].e} ${P[k].n}</button>`).join('')}</div></details>`:''}
    ${_idSel.size||_idPlant||_idArea?'<button class="link-btn" onclick="idClear()">Start again</button>':''}
    ${matches.length?`<button class="id-bar" onclick="$('id-results').scrollIntoView({behavior:'smooth',block:'start'})">See ${matches.length===1?'the likely answer':`${matches.length} likely answers`} ↓</button>`:''}
    <div id="id-results">${matches.length?matches.map(idResultHtml).join(''):_idSel.size?'<div class="set-txt">Nothing in the guide matches that — try fewer signs, or browse the Guide.</div>':_idPlant&&!_idArea?`<div class="set-txt">Looking at your ${plantName(_idPlant)} — where's the problem?</div>`:''}</div>`;
}
function thisMonthHtml(m){
  const guards=guardItems(m),watch=pestsToWatch(m);
  return `${guards.length?`<div class="mv-st">🛡️ Prevent now</div><div class="pm-list">${guards.map(g=>`<div class="pm-row"><span class="pm-e">${g.icon}</span><div><b>${g.title.replace(/^\S+ /,'')}</b><div class="pm-d">${g.detail}</div></div></div>`).join('')}<button class="link-btn" onclick="setView('jobs')">Tick these off in Jobs ›</button></div>`:''}
    ${watch.length?`<div class="mv-st"${guards.length?' style="margin-top:14px"':''}>👀 Watch out for in ${MONTHS[m]}</div><div class="pest-guide">${watch.map(p=>`<details class="pg" id="pw-${p.id}"><summary><span>${p.e} ${p.n}${pestPeak(p,m)?' <span class="peak-tag">peak</span>':''}</span><span class="hlog-d">${plantList(pestCells(p),2)}</span></summary><div class="pg-body"><div class="id-what">${p.what}</div><div class="pest-txt"><b>Look for:</b> ${p.look}</div><div class="pest-txt"><b>Prevent:</b> ${p.prevent}</div></div></details>`).join('')}</div>`
      :'<div class="set-txt">Nothing to watch for on your current plants this month. 🎉</div>'}`;
}
function guideHtml(m){
  const row=p=>`<details class="pg" id="pg-${p.id}"><summary><span>${p.e} ${p.n}</span><span class="${p.months&&pestActive(p,m)?'now-tag':'hlog-d'}">${p.months?(pestActive(p,m)?'active now':monthsText(p.months)):''}</span></summary>
    <div class="pg-body"><div class="id-what">${p.what}</div>${p.months?`<div class="pest-txt"><b>When:</b> ${monthsText(p.months)}${p.peak?` · worst ${monthsText(p.peak)}`:''}</div>`:''}<div class="pest-txt"><b>Signs:</b> ${p.signs.map(s=>SYM_BY_ID[s].t.toLowerCase()).join(' · ')}</div><div class="pest-txt"><b>Look for:</b> ${p.look}</div>${remedyHtml(p)}<div class="pest-txt"><b>Prevent:</b> ${p.prevent}</div><a class="id-photos" href="${photosUrl(p)}" target="_blank" rel="noopener" onclick="return openLink(event,this)">📷 See photos ↗</a></div></details>`;
  return `<div class="mv-st">🐛 Pests & diseases</div><div class="pest-guide">${PESTS.map(row).join('')}</div>
    <div class="mv-st" style="margin-top:14px">💧 Growing problems</div><div class="pest-guide">${DISORDERS.filter(d=>!d.late).map(row).join('')}</div>
    <div class="mv-st" style="margin-top:14px">🧺 Not producing or slow</div><div class="pest-guide">${DISORDERS.filter(d=>d.late).map(row).join('')}</div>
    <div class="mv-st" style="margin-top:14px">🌏 Native plants that fight pests</div><div class="native-card">
      <div><b>Native daisies (Brachyscome), paper daisies, native bluebells</b> — small flowers that feed hoverflies, ladybirds and tiny wasps, which eat aphids and caterpillars.</div>
      <div><b>Lomandra, logs and rock piles</b> — shelter for blue-tongue lizards and frogs, which eat snails and slugs.</div>
      <div><b>Grevilleas and kangaroo paws</b> — planted away from the veg, they give honeyeaters a better option than your strawberries.</div></div>
    <div class="pg-note">Pest timing is typical for Perth and shifts with each season's weather. For declared pests like Medfly, check DPIRD for current advice.</div>`;
}
function renderPests(){
  const m=curMonth(),g=guardItems(m).length;
  const tabs=[['id','🔍 Identify'],['month',`📅 This month${g?` · ${g}`:''}`],['guide','📖 Guide']];
  keepOpen($('pests-content'),()=>$('pests-content').innerHTML=`<div class="mv-heading">Pests & problems</div>
    <div class="seg">${tabs.map(([t,l])=>`<button class="seg-b${_pTab===t?' on':''}" onclick="pTab('${t}')">${l}</button>`).join('')}</div>
    <div class="mv-section">${_pTab==='id'?identifyHtml():_pTab==='month'?thisMonthHtml(m):guideHtml(m)}</div>`);
  saveUI();
}
