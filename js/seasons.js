// The year-round garden: seasonal stories for every month, seasonal projects in Jobs,
// a "plan next season" sheet, and a "this month in your garden" card for quiet weeks.
// Stories with zones:[…] only show in those climates; the Oct–Dec ones in data.js are temperate.
'use strict';
const COOLER=['temperate','cool','arid'],WARMER=['subtropical','tropical'];
['9','10','11'].forEach(m=>(STORIES[m]||[]).forEach(s=>{s.zones??=COOLER;}));
const MORE_STORIES={
  0:[{id:'jan-pick',zones:COOLER,badge:'ENJOY NOW',badgeType:'harvest',emoji:'🍅 🥒 🫘',title:'Pick every day, water every morning',
    story:'Summer crops are at full speed. Pick zucchini, beans and cucumbers every day or two — the more you pick, the more they make. Water deeply in the early morning, and throw shade cloth over tender plants on 35°C days.',
    harvest:'🥗 A summer bowl straight from the bed: sliced tomatoes, cucumber, torn basil, olive oil and salt flakes.',checkBeds:['tomatoes','zucchini','beans'],
    trackTitle:'Peak picking season 🌞',trackStory:'Your summer crops are cropping. Daily picking keeps them going, and deep morning watering gets them through the heat.'}],
  1:[{id:'feb-preserve',zones:COOLER,badge:'ENJOY NOW',badgeType:'harvest',emoji:'🍅 🫙',title:'Passata season',
    story:'Tomatoes are at their best and most plentiful. It’s the weekend to bottle or freeze a batch of sauce. Late February is also when to raise brassica seedlings for autumn — broccoli, cabbage and cauliflower.',
    harvest:'🫙 Simmer tomatoes with garlic and basil, blitz, bottle. A taste of summer in July.',checkBeds:['tomatoes'],
    trackTitle:'Sauce weekend 🫙',trackStory:'Your tomatoes are in full swing — pick, cook down and freeze the extras. Start autumn brassica seedlings now so they’re ready to go in next month.'}],
  2:[{id:'mar-autumn',zones:COOLER,badge:'PLANT NOW',badgeType:'plant',emoji:'🥦 🥬 🧅',title:'Autumn planting starts',
    story:'As the heat breaks, plant broccoli, cabbage, cauliflower and kale seedlings, and sow beetroot, carrots, coriander and leeks. Warm soil and cooling air make this the easiest planting window of the year.',
    harvest:'🥦 By winter: roast broccoli with chilli and garlic, and a big pot of minestrone.',checkBeds:['broccoli','cabbage','kale'],
    trackTitle:'Winter veg is on its way 🥦',trackStory:'Your brassicas are in. Net them against cabbage white butterflies while they’re young — that one job saves the crop.'},
   {id:'mar-subtrop',zones:['subtropical'],badge:'PLANT NOW',badgeType:'plant',emoji:'🍅 🫘 🥬',title:'The best planting season in the subtropics',
    story:'The wet is easing, and autumn is prime time: tomatoes, beans, capsicum, zucchini and lettuce all go in now, along with the first Asian greens and brassicas.',
    harvest:'🍅 Winter tomatoes in the subtropics are sweet and fruit-fly free — a real treat.',checkBeds:['tomatoes','beans'],
    trackTitle:'Autumn crops are in 🍅',trackStory:'Your autumn plantings will crop right through the mild winter. Keep an eye out for caterpillars on the brassicas.'}],
  3:[{id:'apr-garlic',zones:COOLER,badge:'PLANT NOW',badgeType:'plant',emoji:'🧄 🫘 🫛',title:'Garlic goes in around Anzac Day',
    story:'Plant garlic cloves now for a harvest in late spring. It’s also time for broad beans, peas, onions and the last brassica seedlings.',
    harvest:'🧄 Next summer: roast a whole head of your own garlic and squeeze it onto toast.',checkBeds:['garlic'],
    trackTitle:'The long game 🧄',trackStory:'Your garlic is in for its long, slow grow. Keep it weeded and don’t over-water — it’s ready when half the leaves have browned.'}],
  4:[{id:'may-beans',zones:COOLER,badge:'PLANT NOW',badgeType:'plant',emoji:'🫘 🫛',title:'Broad beans and peas — the winter workhorses',
    story:'Sow broad beans and peas now; they grow through the cold and crop in spring, and their roots leave nitrogen behind for summer crops. A great use for empty beds.',
    harvest:'🫛 Spring: snow peas eaten raw off the vine, and broad beans smashed with mint and feta.',checkBeds:['broad-beans','peas'],
    trackTitle:'Feeding next summer’s soil 🫘',trackStory:'Your beans and peas are growing — and fixing nitrogen for whatever goes in that bed next summer.'},
   {id:'may-dry',zones:['tropical'],badge:'PLANT NOW',badgeType:'plant',emoji:'🍅 🥒 🥬',title:'Dry season: plant the veg garden',
    story:'The dry is the tropics’ main veg season. Plant tomatoes, cucumbers, beans, lettuce, capsicum and zucchini now, while it’s mild and dry.',
    harvest:'🥗 Salad season in the Top End — fresh tomatoes and crisp lettuce through to September.',checkBeds:['tomatoes','cucumber'],
    trackTitle:'Dry-season garden is growing 🌤️',trackStory:'Your dry-season crops are in. Water deeply and mulch — it won’t rain again for months.'}],
  5:[{id:'jun-soup',zones:COOLER,badge:'ENJOY NOW',badgeType:'harvest',emoji:'🥬 🧅 🍋',title:'The soup garden',
    story:'Winter greens are cropping: silverbeet, kale and leeks don’t mind the cold. Citrus is colouring up, too. Pick outer leaves often and the plants keep going until spring.',
    harvest:'🍲 A pot of soup from the bed: leek and potato, or minestrone loaded with silverbeet and kale.',checkBeds:['kale','chard','leek'],
    trackTitle:'Winter greens on tap 🥬',trackStory:'Your winter greens are producing. Pick outer leaves weekly; a liquid feed every few weeks keeps them leafy.'}],
  6:[{id:'jul-bareroot',zones:COOLER,badge:'PLANT NOW',badgeType:'plant',emoji:'🍎 🍑 🍇',title:'Bare-root season: the cheapest fruit trees all year',
    story:'Nurseries are full of dormant, bare-root apples, pears, stone fruit, figs and grapes — cheaper than potted trees and quick to settle in. It’s also pruning time for deciduous trees and vines.',
    harvest:'🍑 Plant a peach now and you could be picking it in three summers’ time.',checkBeds:['apple','peach','grape','fig'],
    trackTitle:'Pruning time ✂️',trackStory:'Your deciduous trees are asleep — the perfect time to prune. Check each tree’s card for how.'}],
  7:[{id:'aug-seeds',zones:COOLER,badge:'GET READY',badgeType:'plant',emoji:'🍅 🫑 🍆',title:'Start summer seeds indoors',
    story:'Sow tomato, capsicum and eggplant seeds in punnets on a warm, sunny windowsill now, and they’ll be strong seedlings when the soil warms up in 6–8 weeks. Then plan which bed each crop goes in.',
    harvest:'🍅 Home-raised seedlings mean the varieties you want, not just what the shop has.',checkBeds:[],trackTitle:null,trackStory:null}],
  8:[{id:'sep-spring',zones:COOLER,badge:'PLANT NOW',badgeType:'plant',emoji:'🥔 🫘 🥒',title:'Spring planting begins',
    story:'Plant potatoes, and as the soil warms, beans, cucumbers and the first tomatoes in sheltered spots. Wait for warm nights before chillies, eggplant and basil. Strawberries are flowering — net them now.',
    harvest:'🍓 The first strawberries of the year, eaten in the garden.',checkBeds:['strawberry','potato'],
    trackTitle:'Spring is go 🌱',trackStory:'Your spring plantings are in. Watch for snails on new seedlings and aphids on fresh growth.'},
   {id:'sep-subtrop',zones:['subtropical'],badge:'PLANT NOW',badgeType:'plant',emoji:'🌽 🎃 🍉',title:'Get the summer crops in before the wet',
    story:'Sweet corn, pumpkin, melons, cucumbers and capsicum go in now so they crop before the heaviest wet. Snake beans, okra and sweet potato carry on right through summer.',
    harvest:'🌽 Christmas corn on the cob, straight from the garden to the barbecue.',checkBeds:['sweet-corn','pumpkin'],
    trackTitle:'Summer crops racing the wet 🌽',trackStory:'Your summer crops are growing fast. Mulch well and keep an eye out for mildew once the humidity arrives.'}],
};
const SUB_WINTER={id:'sub-winter',zones:['subtropical'],badge:'PLANT NOW',badgeType:'plant',emoji:'🥗 🍅 🫛',title:'Winter is salad season in the subtropics',
  story:'Mild, sunny days and few pests make this the easiest growing time of the year. Keep planting lettuce, Asian greens, beans, peas, carrots and brassicas, and a late round of tomatoes in August.',
  harvest:'🥗 Big winter salads with your own lettuce, tomatoes and snow peas.',checkBeds:['lettuce','tomatoes','peas'],
  trackTitle:'Cool-season crops cruising 🥗',trackStory:'Your winter crops are in their happiest season. Water when the top few centimetres are dry — winters here are dry.'};
const TROP=[
 [[2,3],{id:'trop-endwet',zones:['tropical'],badge:'GET READY',badgeType:'plant',emoji:'🌱 🍅',title:'The wet is ending: get seedlings ready',
  story:'Raise tomato, capsicum, lettuce and bean seedlings in punnets now, so they’re ready to plant the moment the rain stops and the humidity drops.',
  harvest:'🍅 Good seedlings now mean tomatoes by June.',checkBeds:[],trackTitle:null,trackStory:null}],
 [[5,6,7],{id:'trop-dryharvest',zones:['tropical'],badge:'ENJOY NOW',badgeType:'harvest',emoji:'🍅 🥒 🥗',title:'Dry-season harvest',
  story:'This is the Top End’s best eating: tomatoes, cucumbers, beans and lettuce. Pick often, water deeply in the mornings, and keep sowing salad greens every few weeks.',
  harvest:'🍅 Tomato, cucumber and herb salad with lime and chilli.',checkBeds:['tomatoes','cucumber','beans'],
  trackTitle:'Dry-season crops cropping 🌤️',trackStory:'Your dry-season garden is producing — pick daily and keep the water up.'}],
 [[8,9],{id:'trop-buildup',zones:['tropical'],badge:'GET READY',badgeType:'plant',emoji:'🍠 🌺',title:'The build-up: last harvests, then the heat-lovers',
  story:'Pick the last of the dry-season crops, mulch thickly, and plant the crops that love the wet: sweet potato, snake beans, okra, rosella and kang kong.',
  harvest:'🥭 Mango season is here, too.',checkBeds:['mango','sweet-potato'],trackTitle:'Ready for the wet 🌧️',trackStory:'Your heat-lovers are in. Make sure beds drain before the first big storms.'}],
];
const WET={id:'wet-season',zones:WARMER,badge:'PLANT NOW',badgeType:'plant',emoji:'🍠 🫘 🌺',title:'Wet-season garden: grow the heat-lovers',
  story:'Most veg struggles in the steamy wet, but some crops love it: sweet potato, snake beans, okra, rosella, kang kong, eggplant, chillies and amaranth. Tomatoes and lettuce can wait for autumn. Raised beds and shade cloth help everything else.',
  harvest:'🌺 Rosella jam and stir-fried kang kong — the wet season’s own harvest.',checkBeds:['sweet-potato','okra','kang-kong'],
  trackTitle:'Thriving in the wet 🌧️',trackStory:'Your heat-lovers are in their element. Keep paths and beds draining, and mulch to stop soil splashing onto leaves.'};
[10,11,0,1].forEach(m=>(MORE_STORIES[m]??=[]).push(WET));
[4,5,6,7].forEach(m=>(MORE_STORIES[m]??=[]).push(SUB_WINTER));
(MORE_STORIES[3]??=[]).push(MORE_STORIES[2].find(s=>s.id==='mar-subtrop'));
(MORE_STORIES[9]??=[]).push(MORE_STORIES[8].find(s=>s.id==='sep-subtrop'));
TROP.forEach(([ms,s])=>ms.forEach(m=>(MORE_STORIES[m]??=[]).push(s)));
Object.entries(MORE_STORIES).forEach(([m,ss])=>{(STORIES[m]??=[]).push(...ss);});
function storiesFor(m){return(STORIES[m]||[]).filter(s=>!s.zones||s.zones.includes(zone()));}

// ── Seasonal projects ── in Jobs (Standard: all; Low: planning and soil only). Ticked = done for this year.
const PROJECTS=[
  {id:'plan-spring',months:[6,7],zones:COOLER,low:true,icon:'🗓️',title:'Plan your spring beds',how:'Ten minutes now saves a muddle in spring: see what each bed should grow next so pests and diseases don’t build up.',btn:['Plan it ›','openSeasonPlan()']},
  {id:'plan-autumn',months:[1,2],zones:COOLER,low:true,icon:'🗓️',title:'Plan your autumn beds',how:'Summer crops are winding down. See what each bed should grow next, and which seeds or seedlings to get.',btn:['Plan it ›','openSeasonPlan()']},
  {id:'plan-wet',months:[8,9],zones:WARMER,low:true,icon:'🗓️',title:'Plan your wet-season beds',how:'Pick which beds get the heat-lovers, and which rest under mulch or a green manure through the wet.',btn:['Plan it ›','openSeasonPlan()']},
  {id:'plan-dry',months:[2,3],zones:WARMER,low:true,icon:'🗓️',title:'Plan your dry-season beds',how:'The best growing months are coming. See what each bed should grow next.',btn:['Plan it ›','openSeasonPlan()']},
  {id:'soil',months:[4,5,6],zones:COOLER,low:true,needEmpty:true,icon:'🪱',title:'Feed the soil in your empty beds',how:'Dig in compost or aged manure now, or sow a green manure (broad beans, oats or mustard) and dig it in 3–4 weeks before spring planting. Rested, fed soil grows far better crops.'},
  {id:'soil-wet',months:[10,11],zones:WARMER,low:true,needEmpty:true,icon:'🪱',title:'Rest empty beds through the wet',how:'Cover them with thick mulch or sow a green manure like cowpea, so heavy rain doesn’t wash the soil away.'},
  {id:'seeds',months:[6,7],zones:COOLER,icon:'🌰',title:'Sort your seed box for spring',how:'Check sow-by dates, see what’s missing, and order seeds now — the good varieties sell out by September.',btn:['Seed box ›','openSeedBox()']},
  {id:'indoors',months:[7],zones:['temperate','cool'],icon:'🏠',title:'Start tomato, capsicum and eggplant seeds indoors',how:'Sow in punnets of seed-raising mix on a warm, sunny windowsill (or a heat mat). They need 6–8 weeks before planting out once the soil warms.'},
  {id:'tools',months:[5,6],icon:'🧰',title:'Winter tune-up',how:'Sharpen and oil your secateurs, scrub old pots so diseases don’t carry over, and fix trellises and stakes before spring growth starts.'},
  {id:'wet-prep',months:[9,10],zones:WARMER,icon:'☔',title:'Get ready for the wet',how:'Check beds drain, put up shade cloth over tender crops, top up mulch, and plant the heat-lovers that thrive in the wet.'},
];
function projectItems(m,mode=maint()){
  if(mode==='none'||!ST.beds.some(b=>!isTreeBed(b)))return[];
  const yr=localDate().slice(0,4),empty=ST.beds.some((b,i)=>!isTreeBed(b)&&emptyCells(i).length);
  return PROJECTS.filter(p=>fruitMonthIn(p.months,m)&&(!p.zones||p.zones.includes(zone()))&&(mode==='std'||p.low)&&(!p.needEmpty||empty)&&!ST.projDone[p.id+':'+yr])
    .map(p=>({kind:'project',id:p.id,type:'soon',cb:true,icon:p.icon,title:`${p.icon} ${p.title}`,detail:p.how,btn:p.btn?{label:p.btn[0],js:p.btn[1]}:null}));
}
function tickProject(id){ST.projDone[id+':'+localDate().slice(0,4)]=localDate();return'✓ Done for this year — nice work';}

// ── Plan next season ── per bed: what grew there, what should follow, and what's in season in the next 3 months
function nextMonths(n=3){const m=curMonth();return Array.from({length:n},(_,i)=>(m+1+i)%12);}
function openSeasonPlan(){
  const ms=nextMonths(),vegBeds=ST.beds.map((bed,bi)=>({bed,bi})).filter(x=>!isTreeBed(x.bed));
  const coming=k=>ms.some(m=>inSeason(k,m));
  const cards=vegBeds.map(({bed,bi})=>{
    const fams=bedFamilies(bi),here=[...fams.keys()];
    const next=[...new Set(here.flatMap(f=>ROTATION_NEXT[f]||[]))].filter(f=>!here.includes(f));
    const pool=[...new Set([...COOL_VEG,...WARM_VEG])].filter(k=>P[k]&&!P[k].custom&&coming(k)&&!(bed.low&&TALL.includes(k)));
    const fits=pool.filter(k=>{const f=familyOf(k);return next.length?next.includes(f):!here.includes(f);});
    const pick=(fits.length?fits:pool.filter(k=>!here.includes(familyOf(k)))).slice(0,6);
    const seeds=ST.seeds.filter(s=>P[s.p]&&pick.includes(s.p));
    const empty=emptyCells(bi).length;
    return `<div class="plan-bed"><div class="plan-top"><b>${esc(bed.name)}</b><span class="hlog-d">${empty?plural(empty,'empty spot'):'full'}</span></div>
      <div class="set-txt">${next.length?`Next: <b>${next.map(f=>FAM_LBL[f]).join(', ')}</b>`:''}</div>
      <div class="sow-chips">${pick.map(k=>`<button class="sow-chip" onclick="openPlantInfo('${k}')">${P[k].e} ${P[k].n}</button>`).join('')||'<span class="set-txt">Nothing suits this bed in the next few months — rest it under mulch or a green manure.</span>'}</div>
      ${seeds.length?`<div class="set-txt">🌰 From your seed box: ${seeds.map(s=>esc(seedName(s))).join(', ')}</div>`:''}</div>`;
  }).join('');
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">🗓️ Plan next season</div><div class="sh-sub">${MONTHS[ms[0]]} to ${MONTHS[ms[2]]}</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Close</button></div></div>
    ${cards||'<div class="set-txt">Add a veg bed first.</div>'}
    ${moreFold('Rotating plant families keeps pests and diseases down. The cycle: beans & peas → leafy greens & brassicas → roots & onions → tomatoes, zucchini & friends → back to beans.','Why rotate? ›')}</div>`);
}

// ── "This month in your garden" ── shown at the top of Jobs when there's little to do
function monthCardHtml(n){
  if(n>3||!ST.beds.length)return'';
  const m=curMonth(),now=[...new Set([...COOL_VEG,...WARM_VEG,...HERBS])].filter(k=>P[k]&&!P[k].custom&&inSeason(k,m));
  const st=storiesFor(m)[0],soon=plantedCells().filter(x=>stageOf(x.cell)==='soon').length;
  return `<div class="month-card"><div class="month-h">📅 ${MONTHS[m]} in your garden</div>
    ${st?`<div class="month-st"><b>${st.title}</b><div>${st.story.split('. ')[0]}.</div></div>`:''}
    <div class="sow-chips">${now.slice(0,6).map(k=>`<button class="sow-chip" onclick="openPlantInfo('${k}')">${P[k].e} ${P[k].n}</button>`).join('')}${now.length>6?`<button class="sow-chip" onclick="setView('plants')">+${now.length-6} more ›</button>`:''}</div>
    <div class="month-links">${soon?`<span>⏳ ${plural(soon,'plant')} nearly ready</span>`:''}<button class="link-btn" onclick="openSeasonPlan()">🗓️ Plan next season ›</button></div></div>`;
}
