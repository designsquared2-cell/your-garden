// Varieties: a crop (P) holds everything shared — pests, family, neighbours, recipes. A variety holds only
// what's different. Fields (all optional except id/n/s):
//   n: full name   s: short label for bed tiles   days: days from seed to first harvest
//   sow: months to plant (0 = Jan)   pick: keeps producing   traits: replaces the crop's TRAITS
//   spots: spots one plant needs   e: emoji   note: one line for beginners
//   tags: b = beginner pick, h = handles Perth heat, c = compact / pots, r = heirloom, f = fast
// Days are typical seed-catalogue figures and vary by supplier and season — the app shows them as approximate.
'use strict';
const VARIETIES={
  tomatoes:[
    {id:'tommy-toe',n:'Cherry — Tommy Toe',s:'Cherry',days:70,tags:['b','h'],note:'The most reliable first tomato in Perth — heavy crops of sweet cherry tomatoes.'},
    {id:'sweet-100',n:'Cherry — Sweet 100',s:'Cherry',days:65,tags:['f'],note:'Long trusses of very sweet small fruit.'},
    {id:'roma',n:'Roma (paste)',s:'Roma',days:75,tags:['h'],note:'Meaty, few seeds — the one for sauce and passata.'},
    {id:'grosse-lisse',n:'Grosse Lisse',s:'Grosse L.',days:80,note:'The classic Aussie slicing tomato. Needs good staking.'},
    {id:'black-krim',n:'Black Krim (heirloom)',s:'Black Krim',days:85,tags:['r'],note:'Dark, rich-flavoured heirloom. Fussier than hybrids but worth it.'},
    {id:'tiny-tim',perSpot:1,n:'Tiny Tim (dwarf)',s:'Tiny Tim',days:60,traits:['heavy'],tags:['c','f'],note:'Only 30–40cm tall — perfect for pots, no staking.'},
  ],
  beans:[
    {id:'dwarf',n:'Dwarf / bush bean',s:'Dwarf',days:55,traits:['nfix'],tags:['b','f'],note:'No support needed — crops fast and all at once. Sow again every 4 weeks.'},
    {id:'blue-lake',perSpot:8,n:'Climbing — Blue Lake',s:'Climbing',days:65,traits:['climb','tall','nfix'],note:'Crops for months up a 2m trellis. Pick every few days.'},
    {id:'purple-king',perSpot:8,n:'Climbing — Purple King',s:'Purple',days:70,traits:['climb','tall','nfix'],tags:['h'],note:'Purple pods (turn green when cooked) — easy to spot when picking.'},
    {id:'butter',n:'Butter bean (yellow dwarf)',s:'Butter',days:55,traits:['nfix'],tags:['c'],note:'Tender yellow pods on a compact bush.'},
    {id:'snake',perSpot:4,n:'Snake bean',s:'Snake',days:75,sow:[9,10,11,0],traits:['climb','tall','nfix'],tags:['h'],note:'Loves Perth summer heat — pods up to 40cm.'},
  ],
  peas:[
    {id:'snow',n:'Snow pea — Oregon Giant',s:'Snow',days:70,tags:['b'],note:'Flat pods eaten whole. Very productive on a trellis.'},
    {id:'sugar-snap',n:'Sugar snap',s:'Snap',days:70,note:'Plump, crunchy pods eaten whole — sweetest of all.'},
    {id:'shelling',n:'Shelling — Greenfeast',s:'Shelling',days:75,note:'Classic garden peas to pod. Needs more water than snow peas.'},
    {id:'dwarf-snow',n:'Dwarf snow pea',s:'Dwarf',days:65,traits:['nfix'],tags:['c'],note:'Bushy, about 60cm — little or no support needed.'},
  ],
  chard:[
    {id:'fordhook',n:'Silverbeet — Fordhook Giant',s:'Silverbeet',days:60,e:'🥬',tags:['b','h'],note:'The toughest leafy green there is — handles heat and keeps going for a year.'},
    {id:'rainbow',n:'Rainbow chard — Bright Lights',s:'Rainbow',days:60,tags:['b'],note:'Red, yellow, pink and orange stems. Pretty and productive.'},
    {id:'ruby',n:'Ruby (rhubarb) chard',s:'Ruby',days:60,note:'Deep red stems, slightly earthier flavour.'},
    {id:'perpetual',n:'Perpetual spinach',s:'Perpetual',days:55,e:'🍃',tags:['h'],note:'Tastes like spinach but doesn\'t bolt in the heat like real spinach.'},
  ],
  lettuce:[
    {id:'cos',perSpot:2,n:'Cos',s:'Cos',days:60,note:'Crisp upright heads. Pick outer leaves, or cut the whole head.'},
    {id:'loose-leaf',n:'Loose-leaf — Mignonette / Oakleaf',s:'Loose-leaf',days:45,tags:['b','f'],note:'Pick a few leaves at a time for weeks — the easiest lettuce.'},
    {id:'butterhead',perSpot:1,n:'Butterhead — Buttercrunch',s:'Butterhead',days:55,pick:false,note:'Soft, buttery heads. Harvest whole.'},
    {id:'iceberg',perSpot:1,n:'Iceberg',s:'Iceberg',days:75,pick:false,note:'Needs cool weather to heart up — plant early in autumn.'},
    {id:'mesclun',perSpot:16,n:'Salad mix (mesclun)',s:'Salad mix',days:35,tags:['f','c'],note:'Cut with scissors when 10cm tall — it regrows two or three times.'},
  ],
  cabbage:[
    {id:'mini',perSpot:1,n:'Mini — Golden Acre',s:'Mini',days:80,traits:['heavy'],tags:['b','f','c'],note:'Small, quick heads — the easiest cabbage for beginners.'},
    {id:'sugarloaf',n:'Sugarloaf (pointed)',s:'Sugarloaf',days:100,note:'Sweet, tender pointed heads; less fussy about heat.'},
    {id:'red',n:'Red cabbage',s:'Red',days:150,e:'🫐',note:'Slow — often 120–150 days. Beautiful in slaws and pickles.'},
    {id:'savoy',n:'Savoy',s:'Savoy',days:120,note:'Crinkly leaves, mild flavour, very cold-hardy.'},
    {id:'drumhead',n:'Drumhead (large)',s:'Drumhead',days:130,note:'Big, heavy heads that store well.'},
  ],
  spinach:[
    {id:'english',n:'English spinach',s:'English',days:45,tags:['b'],note:'The classic soft-leaved spinach. Bolts quickly once it warms up — a cool-season crop.'},
    {id:'bloomsdale',n:'Bloomsdale (savoy, heirloom)',s:'Bloomsdale',days:50,tags:['r'],note:'Crinkly, thicker leaves and a little slower to bolt.'},
    {id:'baby-leaf',perSpot:16,n:'Baby leaf',s:'Baby leaf',days:30,tags:['f','c'],note:'Pick at 8–10cm — it regrows for a few more cuts.'},
    {id:'warrigal',perSpot:1,n:'Warrigal greens (native)',s:'Warrigal',days:60,sow:[8,9,10,11,0],traits:['sprawl','selfseeds'],tags:['h'],note:'An Australian native that loves heat — summer\'s spinach. Blanch the leaves for a minute before eating.'},
    {id:'malabar',perSpot:1,n:'Malabar spinach (climbing)',s:'Malabar',days:70,sow:[9,10,11,0],traits:['climb'],tags:['h'],note:'A glossy climbing vine that thrives in Perth summers. Needs a trellis.'},
  ],
  kale:[
    {id:'tuscan',n:'Tuscan (cavolo nero)',s:'Tuscan',days:60,tags:['b'],note:'Dark, bumpy leaves — the best for cooking.'},
    {id:'curly',n:'Curly — Scotch / Vates',s:'Curly',days:55,note:'Frilly leaves, great for kale chips.'},
    {id:'red-russian',n:'Red Russian',s:'Red Russian',days:50,tags:['f'],note:'Tender, slightly sweet leaves — good raw in salads.'},
  ],
  zucchini:[
    {id:'blackjack',n:'Blackjack (dark green)',s:'Blackjack',days:50,tags:['b'],note:'The standard — very productive. One plant feeds a family.'},
    {id:'gold-rush',n:'Gold Rush (yellow)',s:'Gold Rush',days:50,note:'Bright yellow fruit, easy to see when picking.'},
    {id:'lebanese',n:'Lebanese (pale green)',s:'Lebanese',days:50,tags:['h'],note:'Pale, nutty and tender; copes well with heat.'},
    {id:'eight-ball',n:'Round — Eight Ball',s:'Round',days:45,tags:['c','f'],note:'Cricket-ball fruit — perfect for stuffing.'},
  ],
  pumpkin:[
    {id:'butternut',n:'Butternut',s:'Butternut',days:110,tags:['b'],note:'Sweet, smooth and keeps for months.'},
    {id:'kent',n:'Kent / Jap',s:'Kent',days:100,note:'Nutty orange flesh — the classic roasting pumpkin.'},
    {id:'qld-blue',n:'Queensland Blue',s:'Qld Blue',days:120,tags:['r'],note:'Big blue-grey heirloom that stores for up to a year.'},
    {id:'golden-nugget',n:'Golden Nugget (bush)',s:'Nugget',days:85,traits:['big','heavy'],spots:2,tags:['c','f'],note:'Compact bush — no sprawling vines. Small single-serve fruit.'},
  ],
  cucumber:[
    {id:'lebanese',n:'Lebanese',s:'Lebanese',days:55,tags:['b','h'],note:'Thin-skinned, no peeling needed. Most productive in Perth summers.'},
    {id:'continental',n:'Continental / telegraph',s:'Continental',days:60,note:'Long, smooth fruit. Best grown up a trellis so they hang straight.'},
    {id:'apple',n:'Apple cucumber',s:'Apple',days:60,tags:['r'],note:'Round, pale and crisp — an old Aussie favourite.'},
    {id:'snacking',n:'Mini snacking',s:'Mini',days:50,tags:['c','f'],note:'Small lunchbox cucumbers on a compact plant.'},
  ],
  capsicum:[
    {id:'californian',n:'Californian Wonder',s:'Bell',days:85,tags:['b'],note:'Classic blocky bell — pick green, or wait for red and sweeter.'},
    {id:'sweet-banana',n:'Sweet Banana',s:'Banana',days:75,tags:['h'],note:'Long pale-yellow fruit; crops heavily even in heat.'},
    {id:'snacking',n:'Mini snacking',s:'Mini',days:70,tags:['c','f'],note:'Small sweet capsicums, great in pots.'},
  ],
  chilli:[
    {id:'jalapeno',n:'Jalapeño',s:'Jalapeño',days:75,tags:['b'],note:'Medium heat — the most useful all-rounder.'},
    {id:'cayenne',n:'Cayenne',s:'Cayenne',days:80,note:'Long thin red chillies — hot, and easy to dry.'},
    {id:'birdseye',n:'Bird\'s eye (Thai)',s:'Bird\'s eye',days:90,tags:['h','c'],note:'Tiny and very hot. Often lives for several years.'},
    {id:'habanero',n:'Habanero',s:'Habanero',days:100,tags:['h'],note:'Fruity and extremely hot — handle with gloves.'},
  ],
  potato:[
    {id:'dutch-cream',n:'Dutch Cream',s:'Dutch Cream',days:110,tags:['b'],note:'Buttery yellow flesh — brilliant mashed or roasted.'},
    {id:'kipfler',n:'Kipfler',s:'Kipfler',days:120,tags:['r'],note:'Small finger-shaped waxy potatoes — perfect for salads.'},
    {id:'nicola',n:'Nicola',s:'Nicola',days:110,note:'Waxy all-rounder; good disease resistance.'},
    {id:'desiree',n:'Désirée',s:'Désirée',days:110,note:'Red skin, creamy flesh — roasts and mashes well.'},
  ],
  carrots:[
    {id:'all-seasons',n:'All Seasons',s:'All Seasons',days:100,tags:['b'],note:'Reliable, can be sown most of the year in Perth.'},
    {id:'nantes',n:'Nantes',s:'Nantes',days:80,tags:['f'],note:'Sweet, blunt-ended and crunchy.'},
    {id:'paris-market',perSpot:9,n:'Paris Market (round)',s:'Round',days:70,tags:['c','f'],note:'Golf-ball carrots — great in pots or shallow, heavy soil.'},
    {id:'purple-dragon',n:'Purple Dragon',s:'Purple',days:90,note:'Purple outside, orange inside — kids love them.'},
  ],
  strawberry:[
    {id:'albion',n:'Albion (everbearing)',s:'Albion',days:150,tags:['b'],note:'Fruits on and off from spring to autumn.'},
    {id:'red-gauntlet',n:'Red Gauntlet',s:'Red Gauntlet',days:150,tags:['h'],note:'Heavy-cropping and tolerant of warm weather.'},
    {id:'chandler',n:'Chandler',s:'Chandler',days:150,note:'Large, sweet berries in a big spring flush.'},
    {id:'temptation',n:'Temptation',s:'Temptation',days:120,tags:['c'],note:'Compact and great in pots or hanging baskets.'},
  ],
};
const VAR_TAGS={b:['🌱','Beginner pick'],h:['☀️','Handles Perth heat'],c:['📦','Compact / pots'],r:['🏷️','Heirloom'],f:['⚡','Quick']};

// ── Variety lookups ── custom varieties (yours) live in ST.customVarieties[crop]
function varietiesOf(k){return[...(VARIETIES[k]||[]),...(ST.customVarieties?.[k]||[])];}
function varietyOf(k,vid){return vid?varietiesOf(k).find(v=>v.id===vid)||null:null;}
function cellVariety(cell){return varietyOf(cell.p,cell.v);}
// Full display name: "Tomato · Cherry — Tommy Toe"; tile label: "Cherry" (or the crop name if no variety)
function cellName(cell){const v=cellVariety(cell);return v?`${P[cell.p].n} · ${esc(v.n)}`:P[cell.p].n;}
function cellShort(cell){const v=cellVariety(cell);return v?esc(v.s||v.n):P[cell.p].n;}
function cellEmoji(cell){return cellVariety(cell)?.e||P[cell.p].e;}
// Variety overrides on top of the crop's timing and traits
function cellTiming(cell){const t=timing(cell.p),v=cellVariety(cell);if(!v)return t;return{...t,...(v.days?{days:v.days}:{}),...(v.sow?{sow:varietySow(cell.p,v)}:{}),...('pick' in v?{pick:v.pick}:{})};}
function cellTraits(cell){const v=cellVariety(cell);return v?.traits||TRAITS[cell.p]||[];}
function cellKeepsProducing(cell){return!!cellTiming(cell).pick;}
function tagsHtml(v){return(v.tags||[]).map(t=>`<span class="vtag" title="${VAR_TAGS[t][1]}">${VAR_TAGS[t][0]} ${VAR_TAGS[t][1]}</span>`).join('');}
