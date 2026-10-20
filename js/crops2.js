// More crops — the ones testers searched for most and couldn't find (round-2 tester panel).
// Each entry: crop data (P), category, timing, family, spacing, behaviour, price, "ready when" and a recipe.
// Months are for temperate (Perth) gardens; heat lovers also suit the tropics' wet season (zones.js).
'use strict';
(function(){
// key: [emoji, name, harvest text, category, sow months, days, keeps producing, family, per spot, traits, price, tip, idea, ready, recipe, extras]
const NEW={
  'rocket':['🥬','Rocket','Year-round','cool',[1,2,3,4,5,6,7,8],35,true,'brassica',4,['bolts','selfseeds'],3,
    'Fast and easy — pick leaves from 3 weeks. Bolts in summer heat, so sow little and often in the cooler months.',
    'Pile onto pizza straight from the oven, or toss with pear, parmesan and a sharp dressing.',
    'Leaves are 8–10cm long. Pick outer leaves; younger leaves are milder.','Rocket and walnut pesto.'],
  'sunflower':['🌻','Sunflower','Jan–Mar','warm',[8,9,10,11],80,false,null,1,['tall'],2,
    'Kids love them — sow seed straight into the bed after the last frost. Plant on the south side so they don’t shade the veg.',
    'Roast the seeds with a little salt, or leave the heads for the birds and bees.',
    'The back of the head turns yellow-brown and the seeds are plump and striped. Cover heads with a paper bag if birds are beating you to it.','Roasted sunflower seeds with tamari.'],
  'watermelon':['🍉','Watermelon','Jan–Mar','warm',[9,10,11],90,false,'cucurbit',1,['sprawl','big','heavy'],8,
    'Needs heat, sun and room to roam — about 2m per plant. Water deeply while fruit swell, then ease off as they ripen for sweeter melons.',
    'Chilled wedges on a hot day. Blitz with mint and lime for a slushie.',
    'The curly tendril closest to the melon has dried brown, the spot on the ground has turned creamy yellow, and it sounds hollow when tapped.','Watermelon, feta and mint salad.',{spots:3}],
  'okra':['🌿','Okra','Jan–Apr','warm',[9,10,11,0],60,true,null,1,['tall'],5,
    'Loves heat — sow once nights are warm. Pick pods every couple of days or they turn woody and the plant stops.',
    'Slice into a curry or bhindi masala, or fry whole until crisp.',
    'Pods are 7–10cm long and snap cleanly. Bigger pods are stringy.','Bhindi masala with onion, tomato and spices.',{heat:true}],
  'amaranth':['🥬','Amaranth','Dec–Apr','warm',[9,10,11,0],45,true,'leafy',4,['selfseeds'],3,
    'A summer leafy green that thrives in heat when spinach can’t. Pick young leaves and tips often.',
    'Stir-fry the leaves with garlic, or add to dhal and stews like spinach.',
    'Plants are 20–30cm tall. Pinch out the tips and young leaves; it branches and keeps going.','Amaranth leaves with garlic and chilli.',{heat:true}],
  'comfrey':['🌿','Comfrey','Year-round','comp',[2,3,8,9],90,true,null,1,['spreads','perennial','big'],0,
    'A gardener’s helper, not a vegetable — its leaves make a rich liquid fertiliser and compost booster. Plant it in its own corner; any root left behind regrows.',
    'Soak a bucket of leaves in water for 3–4 weeks for a potash-rich liquid feed (it smells strong). Not for eating.',
    'Cut leaves when it’s about 60cm tall, up to 4–5 times a year. Wear gloves — the leaves are bristly.',''],
  'artichoke':['🥦','Globe artichoke','Sep–Nov','cool',[2,3,4,7,8],300,true,null,1,['perennial','big'],5,
    'A big, silvery perennial that crops for years. Plant offsets in autumn or winter; the first spring crop is small.',
    'Steam whole and dip the leaves in garlic butter, or braise the hearts with lemon and olive oil.',
    'Buds are fat and tight, before the scales start to open. Cut with 5cm of stem.','Braised artichokes alla Romana.',{spots:2}],
  'fennel':['🌿','Fennel','Jun–Nov','cool',[1,2,3,7,8],90,false,null,4,['bolts'],3,
    'Grow bulb (Florence) fennel in the cool months — it bolts in heat. Keep it well watered for fat bulbs, and away from other veg it can stunt.',
    'Shave thinly with orange and olives, or roast in wedges until sweet.',
    'Bulbs are tennis-ball size and firm. Cut at soil level; the stump may regrow small shoots.','Roast fennel with parmesan.',{lifted:true}],
  'choy-sum':['🥬','Choy sum','Year-round','cool',[1,2,3,4,5,8,9],45,true,'brassica',4,['bolts'],4,
    'Quick-growing Chinese green with yellow flowers — the stems, leaves and buds are all eaten. Best in the cooler months.',
    'Blanch and drizzle with oyster sauce and garlic oil.',
    'Flower buds are just forming, with one or two open. Cut stems 15–20cm long; side shoots follow.','Choy sum with oyster sauce and garlic.'],
  'gai-lan':['🥦','Gai lan (Chinese broccoli)','Year-round','cool',[1,2,3,4,5,7,8],60,true,'brassica',2,[],5,
    'Grown for its thick stems and buds. Cut the main stem before the flowers open and side shoots keep coming.',
    'Steam and serve with oyster sauce, yum cha style.',
    'Stems are pencil-thick or more, with flower buds formed but not open.','Gai lan with ginger and oyster sauce.'],
  'bitter-melon':['🥒','Bitter melon','Jan–Apr','warm',[9,10,11,0],75,true,'cucurbit',1,['climb'],6,
    'A heat-loving climber — give it a strong trellis. Pick young, before the fruit yellows.',
    'Stuff with pork mince and braise, or stir-fry with egg and black beans.',
    'Fruit is firm, green and 15–20cm long. Yellowing fruit is overripe and very bitter.','Bitter melon and egg stir-fry.',{heat:true}],
  'fenugreek':['🌱','Fenugreek (methi)','Year-round','herb',[2,3,4,5,8],30,true,'legume',9,[],3,
    'Fast and easy from seed — leaves are ready in a month. Grows best in the cooler months.',
    'Add fresh leaves to aloo methi, parathas or dhal.',
    'Plants are 10–15cm tall. Cut the tops and it regrows once or twice.','Aloo methi — potatoes with fenugreek leaves.'],
  'curry-leaf':['🌿','Curry leaf','Year-round','herb',[8,9,10],180,true,null,1,['perennial'],4,
    'A small evergreen tree for warm, frost-free spots — grow it in a pot where winters are cold. Slow to start, then leafy for years.',
    'Fry a sprig in hot oil at the start of a curry or dhal — the smell is the whole point.',
    'Pick whole sprigs from established plants once they’re 50cm or taller.','Tempered dhal with curry leaves and mustard seeds.',{heat:true}],
  'brussels-sprouts':['🥬','Brussels sprouts','Jun–Sep','cool',[0,1,2],120,true,'brassica',1,['big','heavy','tall'],5,
    'Needs a long cool season — plant in late summer so sprouts form in the cold. Firm the soil well; loose soil gives loose sprouts.',
    'Halve and roast hard with bacon and maple, or shave raw into a slaw.',
    'Sprouts are firm, 2–4cm across. Pick from the bottom up as they size up.','Roast sprouts with bacon.'],
  'taro':['🥔','Taro','Jun–Sep','warm',[8,9,10,11],240,false,'root',1,['big'],6,
    'A tropical root that loves heat, water and rich soil — almost boggy is fine. Needs a long warm season.',
    'Always cook it — raw taro irritates the mouth. Boil and serve with coconut cream, or make chips.',
    'Leaves yellow and die back, usually 8–10 months after planting. Dig the corms gently.','Taro in coconut cream.',{heat:true,lifted:true}],
  'cassava':['🍠','Cassava','Jun–Sep','warm',[8,9,10],300,false,'root',1,['tall','big'],5,
    'Grows from stem cuttings in warm, frost-free areas. Very drought-hardy once established.',
    'Always peel and cook it well — raw cassava is toxic. Boil, then fry or mash.',
    'Roots are ready 8–12 months after planting. Dig the whole plant and use the roots within a few days.','Cassava chips.',{heat:true,lifted:true,spots:2}],
  'island-cabbage':['🥬','Island cabbage (bele)','Year-round','warm',[8,9,10,11,0,1],60,true,'leafy',1,['perennial','tall'],4,
    'A leafy shrub from the Pacific Islands, grown from cuttings. Loves warmth and water; frost kills it.',
    'Cook the leaves like spinach — in coconut cream with onion is the classic.',
    'Pick young leaves from the tips once it’s knee-high. Regular picking keeps it bushy.','Bele in coconut cream.',{heat:true}],
  'kang-kong':['🍃','Kang kong (water spinach)','Dec–Apr','warm',[9,10,11,0,1],40,true,'leafy',2,['spreads'],4,
    'A fast summer green that loves water — grow it in a wet spot or a tub. Cut the tips and it regrows quickly.',
    'Stir-fry hard and fast with garlic, chilli and shrimp paste.',
    'Shoots are 25–30cm long. Cut 10cm above the base.','Stir-fried kang kong with garlic and chilli.',{heat:true}],
  'vietnamese-mint':['🌿','Vietnamese mint','Year-round','herb',[8,9,10,11,0,1,2],60,true,null,1,['spreads','perennial'],3,
    'Loves moisture and part shade. Spreads like mint, so keep it in a pot. Dies back in frost.',
    'Essential in laksa and Vietnamese salads, with chicken and lime.',
    'Pick sprigs any time once it’s bushy.','Chicken and Vietnamese mint salad.',{heat:true}],
  'perilla':['🍁','Perilla (shiso)','Dec–Apr','herb',[8,9,10,11],60,true,null,2,['selfseeds'],3,
    'Easy summer herb with green or purple leaves. Pinch out flower spikes to keep leaves coming.',
    'Wrap grilled meat in the leaves, or shred into rice and noodle dishes.',
    'Pick leaves once the plant has 6 or more pairs.','Perilla leaf wraps with grilled pork.'],
  'chicory':['🥬','Chicory & radicchio','Jun–Oct','cool',[1,2,3,7,8],80,false,'leafy',2,['bolts'],4,
    'Bitter Italian leaves — radicchio forms tight red heads, chicory loose leaves. Cool weather brings out the colour and sweetness.',
    'Grill radicchio wedges with olive oil and balsamic, or toss bitter leaves with orange and walnuts.',
    'Radicchio heads feel firm; leaf chicory can be picked as soon as leaves are a hand long.','Grilled radicchio with balsamic.'],
  'rosella':['🌺','Rosella','Apr–Jun','warm',[9,10,11],150,true,null,1,['tall'],6,
    'A tall, heat-loving hibiscus grown for its red calyces. Needs a long hot season.',
    'Make rosella jam or cordial — tart, ruby red and very Australian.',
    'Calyces are plump, red and crisp, about 10 days after the flower drops.','Rosella jam.',{heat:true}],
};
Object.entries(NEW).forEach(([k,[e,n,h,cat,sow,days,pick,fam,per,traits,price,tip,idea,ready,recipe,x={}]])=>{
  if(P[k])return;
  P[k]={e,n,h,nx:null,tip,idea};
  TIMING[k]={sow,days,pick};
  ({cool:COOL_VEG,warm:WARM_VEG,herb:HERBS,comp:COMPANIONS})[cat].push(k);
  if(fam)FAMILY[fam].push(k);
  PER_SPOT[k]=per;if(traits.length)TRAITS[k]=traits;
  if(x.spots)SPOTS[k]=x.spots;if(x.lifted)LIFTED.add(k);if(x.heat)HEAT_LOVERS.push(k);
  if(traits.includes('tall'))TALL.push(k);
  if(price)PRICE[k]=price;if(ready)READY_SIGN[k]=ready;if(recipe)RECIPES[k]=recipe;
});
// New varieties of crops already in the app (found by searching their name)
const add=(k,v)=>{(VARIETIES[k]??=[]).push(v);};
add('sweet-corn',{id:'popcorn',n:'Popcorn',s:'Popcorn',days:110,note:'Leave the cobs to dry on the plant, then pop the kernels. Grow it well away from sweet corn — they cross and spoil each other.'});
add('sweet-corn',{id:'golden-bantam',n:'Sweet corn — Golden Bantam',s:'Bantam',days:80,tags:['b'],note:'Reliable, sweet yellow cobs.'});
add('radish',{id:'daikon',n:'Daikon (Japanese radish)',s:'Daikon',days:60,sow:[1,2,3,4,5],perSpot:4,note:'Long white radish for pickles, soups and kimchi. Needs deep, loose soil.'});
add('radish',{id:'cherry-belle',n:'Cherry Belle (round red)',s:'Cherry Belle',days:28,tags:['b','f'],note:'The classic quick round radish.'});
add('cabbage',{id:'wombok',n:'Wombok (Chinese cabbage)',s:'Wombok',days:70,sow:[1,2,3,4,7],note:'Tall, tender heads for stir-fries, dumplings and kimchi. Grows fast in the cool months.'});
add('beans',{id:'runner',perSpot:4,n:'Runner beans (Scarlet runner)',s:'Runner',days:80,sow:[8,9,10,11],traits:['climb','tall','nfix'],note:'Red flowers bees love, and long flat pods. Climbs 2–3m; prefers mild summers.'});
add('basil',{id:'sweet',n:'Sweet basil (Genovese)',s:'Sweet',days:40,tags:['b'],note:'The classic for pesto and tomatoes.'});
add('basil',{id:'thai',n:'Thai basil',s:'Thai',days:45,tags:['h'],note:'Aniseed flavour and purple stems — for pho, curries and stir-fries.'});
add('kale',{id:'collard',n:'Collard greens',s:'Collard',days:60,tags:['h'],note:'Big, flat, tough leaves that handle heat better than most kale. Slow-cook them.'});
})();
