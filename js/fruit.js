// Fruit trees, berries and vines. Each type is one card on the Beds page (however many trees), stored as a
// bed with kind:'tree' holding a single cell — so harvest, pests, Plants and Jobs pick them up like any plant.
// Months are typical for Perth (0 = Jan) and shift a month with the climate zone, like pest seasons.
//   grp: card group   dec: loses its leaves in winter   sow: best planting months   pick: fruit season
//   flower: flowering months   yrs: years from planting to first real crop   unit/us: what you count (one/many)
//   g: grams per unit   kg: typical shop price per kg   prune/pruneHow, thin/thinHow   net: needs bird netting
//   feed: feeding months   frost: young trees are frost-tender   bad: zones where it struggles (badWhy)
'use strict';
const FRUIT={
  lemon:{e:'🍋',n:'Lemon',grp:'citrus',sow:[2,3,8,9,10],pick:[4,5,6,7,8,9],flower:[7,8,9],yrs:2,unit:'lemon',us:'lemons',g:120,kg:6,
    prune:[9,10],pruneHow:'Lightly, after the main crop: cut out dead wood, crossing branches and anything below knee height. Citrus need very little pruning.',
    feed:[7,2],frost:true,size:'3–5m, or 1.5–2m on dwarf rootstock',
    tip:'Citrus are hungry and thirsty: feed in late winter and autumn, water deeply in summer, and keep mulch off the trunk.',
    idea:'Preserved lemons — quartered lemons packed in salt in a jar for a month. They lift tagines, salads and roast chicken all year.',
    ready:'Fully yellow and slightly soft when squeezed. Lemons hold on the tree for weeks, so pick as you need them.',recipe:'Lemon curd: lemons, sugar, butter and eggs, stirred over low heat.'},
  lime:{e:'🍋',n:'Lime',grp:'citrus',sow:[8,9,10],pick:[1,2,3,4,5,6],flower:[8,9,10],yrs:2,unit:'lime',us:'limes',g:70,kg:10,
    prune:[9,10],pruneHow:'Lightly in spring: thin crowded branches so light reaches the middle, and remove dead wood.',
    feed:[7,2],frost:true,bad:['cool'],badWhy:'Limes are more frost-tender than lemons — they need the warmest, most sheltered spot you have.',size:'2–4m',
    tip:'Tahitian limes are the easiest. Feed like a lemon and protect young trees from frost.',
    idea:'Squeeze over everything — tacos, curries, grilled fish. Freeze juice in ice-cube trays for the months without fruit.',
    ready:'Full-sized and glossy. Pick green for sharp flavour, or wait until pale yellow for more juice.',recipe:'Lime pickle, or a classic lime and coconut cake.'},
  orange:{e:'🍊',n:'Orange',grp:'citrus',sow:[2,3,8,9,10],pick:[5,6,7,8],flower:[8,9],yrs:3,unit:'orange',us:'oranges',g:220,kg:4,
    prune:[9,10],pruneHow:'Lightly after harvest: remove dead wood, crossing branches and low branches touching the ground.',
    feed:[7,2],frost:true,size:'4–6m, or 2m on dwarf rootstock',
    tip:'Washington Navel is the classic winter orange; Valencia fruits later and holds on the tree for months.',
    idea:'Fresh juice, of course — or segments with fennel, olives and red onion for a winter salad.',
    ready:'Full colour and they twist off easily. Taste one — oranges colour up before they sweeten.',recipe:'Whole-orange cake: boil two oranges, blend and bake with almond meal.'},
  mandarin:{e:'🍊',n:'Mandarin',grp:'citrus',sow:[2,3,8,9,10],pick:[4,5,6,7],flower:[8,9],yrs:3,unit:'mandarin',us:'mandarins',g:100,kg:5,
    prune:[8,9],pruneHow:'Lightly after harvest: thin crowded branches and remove dead wood. Heavy crops can snap branches — thin the fruit if needed.',
    feed:[7,2],frost:true,size:'3–4m',
    tip:'Mandarins often crop heavily one year and lightly the next. Thinning a heavy crop evens it out.',
    idea:'The perfect lunchbox fruit. Dry the peel to add to stews and Chinese braises.',
    ready:'Deep orange, slightly puffy and easy to peel. Snip or twist them off so the skin doesn\'t tear.',recipe:'Candied mandarin peel, dipped in dark chocolate.'},
  apple:{e:'🍎',n:'Apple',grp:'pome',dec:true,sow:[5,6,7],pick:[1,2,3,4],flower:[8,9],yrs:3,unit:'apple',us:'apples',g:170,kg:5,
    prune:[5,6],pruneHow:'In winter while it\'s bare: open up the centre so light gets in, shorten long whippy shoots by a third, and cut out dead or crossing branches.',
    thin:[10],thinHow:'When the apples are marble-sized, thin to one per cluster, about 15cm apart. You get bigger, better apples and no snapped branches.',
    net:true,feed:[7,2],bad:['tropical','subtropical'],badWhy:'Most apples need winter cold to flower. In warm areas choose a low-chill type like Anna or Dorsett Golden.',size:'3–5m, or 2m on dwarf rootstock',
    tip:'Most apples need a second apple variety nearby to pollinate them — check the label, or choose a self-fertile one.',
    idea:'Crunch them fresh, or slow-cook with cinnamon into a chunky sauce for porridge and pork.',
    ready:'The pips inside have turned brown, and the apple comes away when you lift and gently twist it.',recipe:'Apple crumble with oats, butter and brown sugar.'},
  pear:{e:'🍐',n:'Pear',grp:'pome',dec:true,sow:[5,6,7],pick:[1,2,3],flower:[8],yrs:4,unit:'pear',us:'pears',g:180,kg:5,
    prune:[5,6],pruneHow:'In winter while it\'s bare: shorten new shoots by a third and remove crowded or crossing branches. Pears grow upright — keep the centre open.',
    net:true,feed:[7,2],bad:['tropical','subtropical'],badWhy:'Pears need winter cold to fruit well.',size:'4–6m, or 2.5m on dwarf rootstock',
    tip:'Most pears need a second variety nearby for pollination. Long-lived and tough once established.',
    idea:'Poach in red wine with a cinnamon stick, or slice thinly with blue cheese and walnuts.',
    ready:'Pick when full-sized and the stalk snaps off as you lift the pear sideways. Pears ripen off the tree — leave them on the bench for a few days.',recipe:'Pear and ginger upside-down cake.'},
  peach:{e:'🍑',n:'Peach',grp:'stone',dec:true,sow:[5,6,7],pick:[10,11,0,1],flower:[7],yrs:3,unit:'peach',us:'peaches',g:150,kg:7,
    prune:[1,2],pruneHow:'Straight after harvest: peaches fruit on last year\'s shoots, so cut back about a third of the branches that fruited and keep the centre open.',
    thin:[9],thinHow:'When the fruit is the size of a 5c coin, thin to one every 15–20cm. Fewer peaches, but much bigger and sweeter.',
    net:true,feed:[7,2],bad:['tropical'],badWhy:'Peaches need some winter cold — choose a low-chill variety like Tropic Snow in warm areas.',size:'3–4m',
    tip:'Spray copper at bud swell in late winter to stop leaf curl — the most common peach problem.',
    idea:'Grill halved peaches until caramelised and serve with ice cream, or tear them through a salad with burrata.',
    ready:'The green background colour has turned yellow or cream, and the fruit gives slightly near the stalk.',recipe:'Peach and raspberry cobbler.'},
  nectarine:{e:'🍑',n:'Nectarine',grp:'stone',dec:true,sow:[5,6,7],pick:[10,11,0,1],flower:[7],yrs:3,unit:'nectarine',us:'nectarines',g:140,kg:7,
    prune:[1,2],pruneHow:'Straight after harvest: cut back about a third of the branches that fruited, and keep the centre open.',
    thin:[9],thinHow:'When the fruit is the size of a 5c coin, thin to one every 15–20cm.',
    net:true,feed:[7,2],bad:['tropical'],badWhy:'Nectarines need some winter cold — choose a low-chill variety in warm areas.',size:'3–4m',
    tip:'Grown just like a peach — spray copper at bud swell in late winter to stop leaf curl.',
    idea:'Slice into salads with prosciutto, or bake into a frangipane tart.',
    ready:'The background colour has turned from green to yellow, and it smells like a nectarine.',recipe:'Nectarine salsa with chilli and mint, for grilled fish.'},
  plum:{e:'🟣',n:'Plum',grp:'stone',dec:true,sow:[5,6,7],pick:[11,0,1],flower:[7,8],yrs:3,unit:'plum',us:'plums',g:60,kg:7,
    prune:[1,2],pruneHow:'After harvest: thin out crowded branches and shorten long ones. Plums need less pruning than peaches.',
    net:true,feed:[7,2],bad:['tropical'],badWhy:'Plums need some winter cold to fruit.',size:'3–5m',
    tip:'Japanese plums (Santa Rosa, Satsuma) suit warmer areas. Many need a second variety nearby to pollinate.',
    idea:'Stew with a little sugar and star anise and keep in the fridge for breakfasts.',
    ready:'Full colour, slightly soft, with a powdery bloom on the skin.',recipe:'Plum jam — the easiest jam there is.'},
  apricot:{e:'🟠',n:'Apricot',grp:'stone',dec:true,sow:[5,6,7],pick:[10,11],flower:[6,7],yrs:3,unit:'apricot',us:'apricots',g:45,kg:9,
    prune:[1,2],pruneHow:'In late summer or early autumn, in dry weather — winter cuts let in gummosis disease. Thin crowded branches and keep the centre open.',
    net:true,feed:[7,2],bad:['tropical','subtropical'],badWhy:'Apricots need a dry spring and winter cold to set fruit.',size:'3–5m',
    tip:'They flower early, so a late frost can take the crop. Most are self-fertile.',
    idea:'Halve, stone and bake with honey and thyme, or dry them in a low oven.',
    ready:'Fully orange (no green at the stalk) and slightly soft.',recipe:'Apricot chicken — the real version, with fresh apricots.'},
  cherry:{e:'🍒',n:'Cherry',grp:'stone',dec:true,sow:[5,6,7],pick:[10,11],flower:[8],yrs:4,unit:'bowl',us:'bowls',g:250,kg:14,
    prune:[1,2],pruneHow:'After harvest, in dry weather: keep the tree low enough to net, and thin out crowded branches.',
    net:true,feed:[7,2],bad:['subtropical','tropical','arid'],badWhy:'Cherries need a cold winter. In warm areas they rarely fruit — try a low-chill variety like Minnie Royal and Royal Lee together.',size:'3–5m on dwarf rootstock',
    tip:'Birds love cherries more than you do — plan to net from the day they start to colour. Choose a self-fertile variety like Stella if you only have room for one.',
    idea:'Eat them straight from the tree. Pit a bowl for a clafoutis.',
    ready:'Deep colour and they taste sweet — cherries don\'t ripen after picking.',recipe:'Cherry clafoutis — a custardy French baked pudding.'},
  fig:{e:'🟤',n:'Fig',grp:'other',dec:true,sow:[5,6,7],pick:[0,1,2,3],flower:[9,10],yrs:2,unit:'fig',us:'figs',g:50,kg:15,
    prune:[6],pruneHow:'In winter: keep it to a size you can net and reach. Figs are very forgiving — you can cut them back hard.',
    net:true,feed:[8],size:'3–6m (keeps smaller with pruning)',
    tip:'Tough and drought-hardy once established. Birds and fruit fly love ripe figs — net, and pick daily in season.',
    idea:'Tear open and eat warm from the tree, or wrap in prosciutto and grill.',
    ready:'Soft, drooping on the stalk, sometimes with a tiny split in the skin. Figs don\'t ripen after picking.',recipe:'Figs baked with honey and goat\'s cheese.'},
  avocado:{e:'🥑',n:'Avocado',grp:'sub',sow:[2,8,9,10],pick:[7,8,9,10,11,0],flower:[8,9],yrs:4,unit:'avocado',us:'avocados',g:200,kg:8,
    prune:[9,10],pruneHow:'Very lightly after harvest — just keep it to a size you can pick. Avocados don\'t need regular pruning.',
    feed:[8,2],frost:true,bad:['cool'],badWhy:'Frost kills young avocados — they need a warm, frost-free spot.',size:'6–10m, or 3–4m for dwarf Wurtz',
    tip:'Avocados need perfect drainage — plant on a mound. Wet feet causes root rot. Mulch thickly, but keep it off the trunk.',
    idea:'Smashed on toast with lemon and chilli, of course — or blitzed into a green goddess dressing.',
    ready:'Avocados don\'t soften on the tree. Pick one full-sized fruit and leave it on the bench: if it softens in about a week without shrivelling, the rest are ready.',recipe:'Guacamole with lime, coriander and chilli.'},
  mango:{e:'🥭',n:'Mango',grp:'sub',sow:[8,9,10],pick:[11,0,1,2],trop:[8,9,10,11],flower:[6,7,8],yrs:4,unit:'mango',us:'mangoes',g:350,kg:6,
    prune:[2,3],pruneHow:'After harvest: tip-prune to keep it bushy and low enough to pick.',
    feed:[7,1],frost:true,bad:['cool','temperate'],badWhy:'Mangoes need warmth. In Perth and similar climates they can fruit in a hot, sheltered, north-facing spot; in cooler areas they rarely fruit.',size:'5–10m, or 2–3m for dwarf types',
    tip:'Water well while fruit is forming, then ease off in autumn and winter.',
    idea:'Cheeks straight from the fruit — or a mango salsa with red onion, chilli and lime.',
    ready:'It smells sweet at the stalk end and gives slightly when squeezed. Colour depends on the variety.',recipe:'Mango lassi: mango, yoghurt, milk and a pinch of cardamom.'},
  olive:{e:'🫒',n:'Olive',grp:'other',sow:[2,3,8,9],pick:[3,4,5],flower:[9,10],yrs:4,unit:'bowl',us:'bowls',g:500,kg:12,
    prune:[7,8],pruneHow:'In late winter: thin out the centre so light gets in, and keep it to a pickable height.',
    feed:[8],bad:['tropical'],badWhy:'Olives need a cool winter to flower.',size:'4–8m',
    tip:'Very tough and drought-hardy. Olives have to be cured in brine before eating — straight off the tree they\'re bitter.',
    idea:'Brine your own: crack or slit them, soak in water (changed daily) for a week or two, then store in salted brine with lemon and herbs.',
    ready:'Green olives once full-sized; black olives once they\'ve turned dark purple-black.',recipe:'Warm olives with orange zest, garlic and fennel seeds.'},
  pomegranate:{e:'🔴',n:'Pomegranate',grp:'other',dec:true,sow:[5,6,7],pick:[2,3,4],flower:[9,10,11],yrs:3,unit:'pomegranate',us:'pomegranates',g:300,kg:8,
    prune:[6,7],pruneHow:'In winter: remove suckers from the base and thin crowded stems.',
    feed:[8],size:'3–4m, or 1m for dwarf types',
    tip:'Loves hot, dry summers and handles drought. Steady watering in summer stops the fruit splitting.',
    idea:'Scatter the jewel-like seeds over salads, yoghurt and roast lamb.',
    ready:'Deep colour, slightly flattened sides, and a metallic sound when you tap it. Pick before autumn rain splits them.',recipe:'Pomegranate molasses — the juice simmered down to a syrup.'},
  mulberry:{e:'🟪',n:'Mulberry',grp:'vine',dec:true,sow:[5,6,7],pick:[9,10,11],flower:[8],yrs:2,unit:'bowl',us:'bowls',g:250,kg:20,
    prune:[11,0],pruneHow:'After fruiting, cut back hard to keep it small enough to net — mulberries fruit on new growth.',
    net:true,feed:[8],size:'4–10m, or 1–2m for dwarf types',
    tip:'One of the easiest fruit trees. Dwarf varieties grow happily in big pots.',
    idea:'Eat by the handful, or spoon over yoghurt. Freeze the extras for smoothies.',
    ready:'Fully dark (or fully coloured for red and white types) and they drop into your hand.',recipe:'Mulberry and apple pie.'},
  blueberry:{e:'🫐',n:'Blueberry',grp:'vine',sow:[5,6,7,8],pick:[10,11,0],flower:[7,8],yrs:2,unit:'bowl',us:'bowls',g:125,kg:25,
    prune:[6],pruneHow:'In winter: remove a few of the oldest, thickest canes at the base each year so new ones replace them.',
    net:true,feed:[8,11],size:'1–1.5m bush',
    tip:'Blueberries need acid soil — easiest in a pot of azalea & camellia mix. Two varieties side by side fruit better than one.',
    idea:'Straight from the bush. Freeze them on a tray for smoothies and muffins.',
    ready:'Fully blue with no red at the stalk, and they drop off with a gentle touch. Wait a few days after they turn blue for full sweetness.',recipe:'Blueberry pancakes, or a quick blueberry compote.'},
  raspberry:{e:'🍓',n:'Raspberry',grp:'vine',dec:true,sow:[5,6,7],pick:[10,11,0,1,2],flower:[8,9],yrs:1,unit:'bowl',us:'bowls',g:125,kg:30,
    prune:[6],pruneHow:'In winter: cut canes that fruited down to the ground. For autumn-fruiting types, cut all the canes down.',
    net:true,feed:[8],bad:['tropical','subtropical'],badWhy:'Raspberries prefer a cool climate — in warm areas choose a low-chill type and give afternoon shade.',size:'Canes 1.5–2m, spreading',
    tip:'Grows as canes — give them a wire or fence to lean on, and pull out suckers that wander.',
    idea:'Eat them warm from the cane. A handful makes any dessert.',
    ready:'Deep colour, and they slip off the white core easily.',recipe:'Raspberry and white chocolate muffins.'},
  passionfruit:{e:'🌺',n:'Passionfruit',grp:'vine',sow:[8,9,10],pick:[0,1,2,3,4,5],flower:[8,9,10],yrs:1,unit:'passionfruit',us:'passionfruit',g:40,kg:15,
    prune:[8],pruneHow:'In early spring: trim it back to keep it tidy — fruit forms on new growth. Never prune hard in winter.',
    feed:[8,11,2],frost:true,bad:['cool'],badWhy:'Passionfruit needs a warm, sunny spot — frost kills it.',size:'Vine, 5m+ along a fence',
    tip:'A vigorous vine for a sunny fence. Grafted Panama types sucker from the roots — pull those out, or they take over.',
    idea:'Scoop over pavlova, yoghurt or ice cream. Freeze the pulp in ice-cube trays.',
    ready:'They fall from the vine when ripe — collect them every day or two. Wrinkly skin is fine; they\'re sweeter.',recipe:'Passionfruit slice, or passionfruit butter.'},
  grape:{e:'🍇',n:'Grape',grp:'vine',dec:true,sow:[5,6,7],pick:[0,1,2],flower:[9,10],yrs:2,unit:'bowl',us:'bowls',g:500,kg:6,
    prune:[6,7],pruneHow:'In winter: cut each of last season\'s canes back to 2 buds. Grapes fruit on new shoots, so a hard prune means more fruit.',
    net:true,feed:[8],size:'Vine — needs a pergola or wires',
    tip:'Needs a strong pergola or wire. Powdery mildew is the big problem — keep air moving through the leaves.',
    idea:'Freeze grapes for a summer snack, or roast them with sausages and rosemary.',
    ready:'Taste them — grapes don\'t ripen after picking. Seeds turn brown when they\'re ready.',recipe:'Roast grapes with sausages, rosemary and a splash of balsamic.'},
};
const FRUIT_KEYS=Object.keys(FRUIT);
// Used in pest "on" lists alongside the veg families
const FRUIT_GROUPS={citrus:['lemon','lime','orange','mandarin'],stone:['peach','nectarine','plum','apricot','cherry'],pome:['apple','pear'],berries:['mulberry','blueberry','raspberry'],fruit:FRUIT_KEYS};
const FRUIT_GRP=[['citrus','🍋 Citrus'],['pome','🍎 Apples & pears'],['stone','🍑 Stone fruit'],['sub','🥭 Subtropical'],['other','🌳 Other trees'],['vine','🍇 Berries & vines']];
const FRUIT_VARIETIES={
  lemon:[{id:'eureka',n:'Eureka',s:'Eureka',tags:['b'],note:'Fruits on and off all year — the classic backyard lemon.'},{id:'lisbon',n:'Lisbon',s:'Lisbon',tags:['h'],note:'Vigorous and thorny; handles heat and wind well.'},{id:'meyer',n:'Meyer',s:'Meyer',tags:['c'],note:'Sweeter, less acidic, smaller tree — great in a pot.'}],
  lime:[{id:'tahitian',n:'Tahitian',s:'Tahitian',tags:['b'],note:'Seedless, juicy and the most reliable lime.'},{id:'kaffir',n:'Kaffir (makrut)',s:'Kaffir',tags:['c'],note:'Grown mostly for its fragrant leaves, used in Thai cooking.'},{id:'finger',n:'Finger lime',s:'Finger',note:'Native Australian lime with caviar-like pearls inside.'}],
  orange:[{id:'navel',n:'Washington Navel',s:'Navel',tags:['b'],note:'Sweet, seedless winter oranges for eating.'},{id:'valencia',n:'Valencia',s:'Valencia',pk:[8,9,10,11,0],note:'The juicing orange — ripens in spring and holds on the tree for months.'},{id:'blood',n:'Blood orange',s:'Blood',note:'Red flesh with a berry flavour; colours best after cold nights.'}],
  mandarin:[{id:'imperial',n:'Imperial',s:'Imperial',tags:['b'],note:'Early, easy-peel and sweet.'},{id:'afourer',n:'Afourer',s:'Afourer',pk:[6,7,8],note:'Late season, mostly seedless.'},{id:'emperor',n:'Emperor',s:'Emperor',note:'Large, easy to peel, mid-season.'}],
  apple:[{id:'pink-lady',n:'Pink Lady',s:'Pink Lady',pk:[3,4],note:'Crisp and sweet-tart; late season.'},{id:'gala',n:'Gala',s:'Gala',pk:[1,2],note:'Sweet and early.'},{id:'granny-smith',n:'Granny Smith',s:'Granny',pk:[3,4],note:'Tart and great for cooking.'},{id:'anna',n:'Anna (low chill)',s:'Anna',tags:['w'],pk:[0,1],note:'Fruits in warm areas with mild winters. Plant with Dorsett Golden to pollinate.'},{id:'dorsett',n:'Dorsett Golden (low chill)',s:'Dorsett',tags:['w'],pk:[0,1],note:'Low-chill partner for Anna.'}],
  pear:[{id:'williams',n:'Williams (Bartlett)',s:'Williams',tags:['b'],note:'The classic summer pear.'},{id:'packhams',n:'Packham\'s Triumph',s:'Packham\'s',pk:[2,3],note:'Stores well; late season.'},{id:'nashi',n:'Nashi',s:'Nashi',note:'Crisp, juicy Asian pear — eaten firm, like an apple.'}],
  peach:[{id:'tropic-snow',n:'Tropic Snow (low chill)',s:'Tropic Snow',tags:['w','b'],pk:[10,11],note:'White-fleshed, early, suits warm winters.'},{id:'golden-queen',n:'Golden Queen',s:'Golden Q.',pk:[1,2],note:'Classic yellow clingstone for preserving.'},{id:'dwarf-peach',n:'Dwarf (e.g. Pixzee)',s:'Dwarf',tags:['c'],note:'Grows 1.5m — perfect in a pot.'}],
  nectarine:[{id:'sunwright',n:'Sunwright (low chill)',s:'Sunwright',tags:['w'],note:'Yellow-fleshed, suits warm areas.'},{id:'fantasia',n:'Fantasia',s:'Fantasia',note:'Large, sweet, freestone fruit.'},{id:'dwarf-nect',n:'Dwarf (e.g. Nectazee)',s:'Dwarf',tags:['c'],note:'Compact, for pots.'}],
  plum:[{id:'santa-rosa',n:'Santa Rosa',s:'Santa Rosa',tags:['b'],note:'Self-fertile and pollinates other Japanese plums.'},{id:'satsuma',n:'Satsuma',s:'Satsuma',note:'Dark red flesh, great for jam. Needs a partner.'},{id:'mariposa',n:'Mariposa',s:'Mariposa',note:'Large blood plum. Needs a partner.'}],
  apricot:[{id:'trevatt',n:'Trevatt',s:'Trevatt',tags:['b'],note:'The classic Australian apricot.'},{id:'moorpark',n:'Moorpark',s:'Moorpark',note:'Large, rich-flavoured fruit.'}],
  cherry:[{id:'stella',n:'Stella',s:'Stella',tags:['b'],note:'Self-fertile — fruits on its own.'},{id:'minnie-royal',n:'Minnie Royal & Royal Lee (low chill)',s:'Low chill',tags:['w'],note:'A pair bred for warm winters — plant both.'}],
  fig:[{id:'brown-turkey',n:'Brown Turkey',s:'Brown T.',tags:['b'],note:'Reliable and heavy-cropping.'},{id:'black-genoa',n:'Black Genoa',s:'Black G.',note:'Large purple-black figs.'},{id:'white-adriatic',n:'White Adriatic',s:'White A.',note:'Green skin, strawberry-red inside; good for drying.'}],
  avocado:[{id:'hass',n:'Hass',s:'Hass',tags:['b'],note:'The classic dark, pebbly avocado.'},{id:'reed',n:'Reed',s:'Reed',pk:[0,1,2,3],note:'Large round fruit in summer — extends the season.'},{id:'wurtz',n:'Wurtz (dwarf)',s:'Wurtz',tags:['c'],note:'Grows 3–4m — the backyard avocado.'}],
  mango:[{id:'kp',n:'Kensington Pride (Bowen)',s:'KP',tags:['b'],note:'The classic Aussie mango.'},{id:'r2e2',n:'R2E2',s:'R2E2',note:'Huge fruit, few fibres.'},{id:'dwarf-mango',n:'Dwarf (e.g. Irwin)',s:'Dwarf',tags:['c'],note:'Smaller tree for backyards and big pots.'}],
  olive:[{id:'kalamata',n:'Kalamata',s:'Kalamata',note:'The classic black table olive.'},{id:'manzanillo',n:'Manzanillo',s:'Manzanillo',tags:['b'],note:'Good for green or black olives and oil.'}],
  mulberry:[{id:'black-english',n:'Black English',s:'Black',tags:['b'],note:'Big, rich-flavoured black berries.'},{id:'dwarf-mulberry',n:'Dwarf Red Shahtoot',s:'Dwarf',tags:['c'],note:'Long red berries on a compact plant.'}],
  blueberry:[{id:'sunshine-blue',n:'Sunshine Blue',s:'Sunshine',tags:['b','c'],note:'Compact, low-chill and self-fertile — the easiest blueberry for pots.'},{id:'misty',n:'Misty',s:'Misty',note:'Southern highbush; suits mild winters.'},{id:'brightwell',n:'Brightwell (rabbiteye)',s:'Brightwell',tags:['h'],note:'Tough and heat-tolerant; plant with another rabbiteye.'}],
  raspberry:[{id:'heritage',n:'Heritage (autumn)',s:'Heritage',tags:['b'],pk:[1,2,3],note:'Fruits on new canes in late summer and autumn — easy pruning.'},{id:'chilcotin',n:'Chilcotin (summer)',s:'Chilcotin',pk:[10,11],note:'Big summer crop on last year\'s canes.'}],
  passionfruit:[{id:'panama-red',n:'Panama Red',s:'Panama',tags:['h'],note:'Large, tangy fruit; grafted, so pull out suckers.'},{id:'nellie-kelly',n:'Nellie Kelly (black)',s:'Nellie K.',tags:['b'],note:'The classic sweet black passionfruit.'}],
  grape:[{id:'thompson',n:'Thompson Seedless',s:'Thompson',tags:['b'],note:'Sweet green seedless grapes.'},{id:'crimson',n:'Crimson Seedless',s:'Crimson',note:'Crunchy red seedless grapes, late season.'},{id:'red-globe',n:'Red Globe',s:'Red Globe',note:'Large red grapes with seeds.'}],
};

VAR_TAGS.w=['❄️','Low chill — fruits after mild winters'];
// ── Plug fruit into the shared plant data ──
FRUIT_KEYS.forEach(k=>{
  const f=FRUIT[k];
  P[k]={e:f.e,n:f.n,h:monthsText(f.pick),nx:null,tip:f.tip,idea:f.idea};
  TIMING[k]={sow:f.sow,pick:true};
  PRICE[k]=f.kg;READY_SIGN[k]=f.ready;RECIPES[k]=f.recipe;
  TRAITS[k]=['passionfruit','grape'].includes(k)?['climb','perennial']:['perennial'];
  if(FRUIT_VARIETIES[k])VARIETIES[k]=FRUIT_VARIETIES[k];
});
CATS.fruit=[...FRUIT_KEYS];CAT_LBL.fruit='Fruit trees, berries & vines';CAT_SOW.fruit=ALL_YEAR;

// ── Planting season by climate zone ── the FRUIT months are for temperate (Perth) gardens.
//   Deciduous trees go in bare-root while dormant everywhere; evergreens dodge each zone's hardest season.
function fruitZoneSow(k,sow,z){
  const f=FRUIT[k];
  if(f.dec)return z==='tropical'||z==='subtropical'?[5,6]:z==='cool'?[5,6,7]:sow;      // bare-root, shorter in warm winters
  if(z==='cool')return[8,9,10];                                                      // spring only — no frost on new roots
  if(z==='subtropical')return f.frost?[2,3,8,9,10]:[2,3,4,8,9];                      // autumn or spring, not the wet summer
  if(z==='tropical')return[10,11,0];                                                 // start of the wet season
  if(z==='arid')return f.frost?[2,3,8]:[2,3,7,8];                                    // autumn or late winter, never into summer heat
  return sow;
}
// Months until it's next a good time to plant (0 = now)
function monthsToPlant(k,m=curMonth()){const sow=timing(k).sow||ALL_YEAR;return Math.min(...sow.map(s=>(s-m+12)%12));}

// ── Tree helpers ──
function isTree(k){return!!FRUIT[k];}
function isTreeBed(bed){return bed?.kind==='tree';}
function treeCell(bed){return bed.rows[0][0];}
function treeYears(c){return c.d?Math.max(0,daysBetween(c.d,localDate()))/365.25:0;}
// trop: the fruit season in the tropics, earlier than the zone shift allows (Darwin mangoes: Sep–Dec)
function fruitPick(k){const f=FRUIT[k];return zone()==='tropical'&&f.trop||f.pick;}
function treePick(c){return cellVariety(c)?.pk||fruitPick(c.p);}
function treeBearing(c){return treeYears(c)>=FRUIT[c.p].yrs-0.25;}
function firstFruitYear(c){return new Date((c.d||localDate())+'T00:00').getFullYear()+FRUIT[c.p].yrs;}
// Fruit seasons shift with the climate zone, the same way pest seasons do
function fruitMonthIn(ms,m){return pestMonthIn(ms,m);}
function treeRested(c){return!!c.rest&&daysBetween(c.rest,localDate())<150;}
const TREE_SHORT={young:'Young',ready:'Picking',forming:'Fruit forming',flowering:'Flowering',dormant:'Dormant',rest:'Resting'};
const TREE_STAGE={young:['🌱','Growing up'],ready:['🧺','Picking season'],forming:['🟢','Fruit forming'],flowering:['🌸','Flowering'],dormant:['💤','Dormant'],rest:['🌿','Resting']};
function treeStage(c,m=curMonth()){
  const f=FRUIT[c.p],pk=treePick(c);
  if(!treeBearing(c))return'young';
  if(fruitMonthIn(pk,m))return treeRested(c)?'rest':'ready';
  if(fruitMonthIn(pk,(m+1)%12)||fruitMonthIn(pk,(m+2)%12))return'forming';
  if(f.flower&&fruitMonthIn(f.flower,m))return'flowering';
  return f.dec&&fruitMonthIn([5,6,7],m)?'dormant':'rest';
}
// Keep each tree's status in step with the season (ready in picking season, otherwise growing)
function syncTrees(){ST.beds.forEach(b=>{if(!isTreeBed(b))return;const c=treeCell(b);c.s=treeStage(c)==='ready'?'ready':'growing';});}
function treeSeason(c){return monthsText(zoneMonthsOut(treePick(c)));}
function treeReadyLabel(c,short){
  const st=treeStage(c);
  if(st==='young')return short?'Young':`First fruit ~${firstFruitYear(c)}`;
  if(st==='ready')return short?'Picking':'Picking season';
  return short?treeSeason(c):`Fruit ${treeSeason(c)}`;
}
function treeAgeText(c){const y=treeYears(c);return y<1?(y*12<1?'Just planted':`${Math.round(y*12)} months`):plural(Math.floor(y),'year');}
function fruitUnits(k,n){const f=FRUIT[k];return`${n} ${n===1?f.unit:f.us}`;}
function treeBadHere(k){return(FRUIT[k].bad||[]).includes(zone());}
function treeBeds(){return ST.beds.map((bed,bi)=>({bed,bi})).filter(x=>isTreeBed(x.bed));}

// ── Beds page cards ──
function treeCardHtml(bed,bi){
  const c=treeCell(bed),st=treeStage(c),[se,sl]=TREE_STAGE[st],v=cellVariety(c);
  return `<button class="tree-card ts-${st}" onclick="openTreeSheet(${bi})"${selectMode?' disabled':''} aria-label="${esc(bed.name)}${bed.n>1?`, ${bed.n} trees`:''}, ${sl}">${bed.n>1?`<span class="tree-count">×${bed.n}</span>`:''}${st==='ready'?'<span class="cell-pip pip-r"></span>':''}
    <span class="tree-e">${cellEmoji(c)}</span><span class="tree-name">${esc(bed.name)}</span>${v?`<span class="tree-sub">${esc(v.s||v.n)}</span>`:''}<span class="tree-st">${se} ${TREE_SHORT[st]}</span></button>`;
}
function treesSectionHtml(){
  const ts=treeBeds();if(!ts.length)return'';
  return `<div class="tree-sec"><div class="tree-hdr">🌳 Fruit trees, berries & vines</div><div class="tree-grid">${ts.map(({bed,bi})=>treeCardHtml(bed,bi)).join('')}</div></div>`;
}

// ── Adding ── "Add to your garden" → veg bed, or fruit → variety, how many, how long in the ground
function openAddChoice(){
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">＋ Add to your garden</div><div class="sh-sub">What are you adding?</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Cancel</button></div></div>
    <button class="add-opt" onclick="openBedEditor()"><span class="add-opt-e">🥕</span><span><b>A veg bed, patch or pots</b><span>A grid of spots for veg, herbs and flowers</span></span></button>
    <button class="add-opt" onclick="openTreePicker()"><span class="add-opt-e">🌳</span><span><b>A fruit tree, berry or vine</b><span>One card per type, however many you have</span></span></button></div>`);
}
let _tq='';
function openTreePicker(q=''){
  _tq=q;
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">🌳 Add fruit</div><div class="sh-sub">Choose the type — you'll pick the variety next</div></div><button class="sh-cancel" onclick="openAddChoice()">← Back</button></div><input class="pick-search" id="tree-q" type="search" placeholder="🔍 Search fruit…" autocomplete="off" value="${esc(q)}" oninput="renderTreePicker(this.value)"></div><div class="picker-grid" id="tree-grid"></div></div>`);
  renderTreePicker(q);
}
function renderTreePicker(q){
  const t=q.trim().toLowerCase(),m=curMonth();
  const html=FRUIT_GRP.map(([g,l])=>{
    const ks=FRUIT_KEYS.filter(k=>FRUIT[k].grp===g&&(!t||P[k].n.toLowerCase().includes(t)||varietiesOf(k).some(v=>v.n.toLowerCase().includes(t))))
      .sort((a,b)=>monthsToPlant(a,m)-monthsToPlant(b,m));
    return ks.length?`<div class="picker-cat">${l}</div>${ks.map(k=>{const away=monthsToPlant(k,m);
      return`<button class="pick-item ${away?'pick-off':'pick-on'}"${away?` style="opacity:${away<=1?.8:away<=3?.6:.42}"`:''} onclick="openTreeForm('${k}')"><div class="pick-e">${P[k].e}</div><div class="pick-n">${P[k].n}</div><div class="pick-why">${treeBadHere(k)?'⚠️ tricky here':!away?'plant now':away===1?'plant next month':'plant '+monthsText(timing(k).sow)}</div></button>`;}).join('')}`:'';
  }).join('');
  $('tree-grid').innerHTML=html||`<div class="pick-empty">No fruit called “${esc(q)}” — try another name.</div>`;
}
const TREE_AGE=[['0','Planting it now'],['1','About a year'],['2','2 years'],['3','3 years'],['4','4 years'],['6','5–7 years'],['10','8+ years']];
// bi given = editing an existing tree card
function openTreeForm(k,bi){
  const bed=bi==null?null:ST.beds[bi],c=bed?treeCell(bed):null,f=FRUIT[k],vs=varietiesOf(k),m=curMonth();
  const back=bed?`openTreeSheet(${bi})`:`openTreePicker(_tq)`;
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">${f.e} ${bed?'Edit '+esc(bed.name):f.n}</div><div class="sh-sub">${bed?'Changes update the card and its jobs':'One card for all your '+f.n.toLowerCase()+' trees'}</div></div><button class="sh-cancel" onclick="${back}">${bed?'✕ Back':'← Back'}</button></div></div>
    ${treeBadHere(k)?`<div class="hu-row bad" style="margin-bottom:8px">⚠️ ${f.badWhy}</div>`:''}
    ${!bed&&!inSeason(k,m)?`<div class="set-txt">Best planted ${monthsText(timing(k).sow)}${f.dec?' (bare-root, while it\'s dormant)':''}. A potted tree can go in now if you keep it well watered.</div>`:''}
    ${vs.length?`<div class="fm-lbl">Variety</div><div class="var-list compact">${vs.map(v=>`<label class="var-card tree-var"><input type="radio" name="tf-v" value="${v.id}"${c?.v===v.id?' checked':''}><div><div class="var-top"><span class="var-n">${esc(v.n)}</span></div>${v.tags?.length?`<div class="var-tags">${tagsHtml(v)}</div>`:''}<div class="var-note">${esc(v.note||'')}</div></div></label>`).join('')}
      <label class="var-card tree-var"><input type="radio" name="tf-v" value=""${c&&!c.v?' checked':''}><div><div class="var-top"><span class="var-n">Not sure / another variety</span></div></div></label></div>`:''}
    <div class="fm-2col"><div><div class="fm-lbl">How many?</div><div class="stepper"><button onclick="stepNum('tf-n',-1,50)" aria-label="Fewer">−</button><input class="fm-in" id="tf-n" type="number" inputmode="numeric" min="1" max="50" value="${bed?.n||1}"><button onclick="stepNum('tf-n',1,50)" aria-label="More">+</button></div></div>
      <div><div class="fm-lbl">In the ground for</div><select class="fm-in" id="tf-age">${bed?`<option value="keep" selected>${treeAgeText(c)} (no change)</option>`:''}${TREE_AGE.map(([v,l])=>`<option value="${v}">${l}</option>`).join('')}</select></div></div>
    <div class="fm-help">Used to work out when it should start fruiting — most ${f.n.toLowerCase()} trees fruit about ${plural(f.yrs,'year')} after planting.</div>
    ${bed?`<div class="fm-lbl">Name on the card</div><input class="fm-in" id="tf-name" maxlength="30" value="${esc(bed.name)}">`:''}
    <div class="spacing">📏 <b>Size:</b> ${f.size}</div>
    <button class="btn btn-seed btn-full" style="margin-top:14px" onclick="saveTree('${k}',${bi??'null'})">${bed?'💾 Save':'🌳 Add to my garden'}</button>
    ${bed?`<button class="btn btn-remove btn-full" style="margin-top:8px" onclick="deleteBed(${bi})">🗑️ Remove ${esc(bed.name)}</button>`:''}</div>`);
}
function saveTree(k,bi){
  const vid=document.querySelector('input[name="tf-v"]:checked')?.value||null;
  const n=Math.min(50,Math.max(1,parseInt($('tf-n').value,10)||1)),age=$('tf-age').value;
  const d=age==='keep'?null:addDays(localDate(),-Math.round(+age*365.25));
  if(bi==null){
    const name=P[k].n;
    ST.beds.push({id:newId(),kind:'tree',name,n,rows:[[{p:k,v:vid,s:'growing',d,st:'tree',picks:0}]]});
    saveState();closeSheet();refreshAll();toast(`🌳 Added ${n>1?n+' ':''}${name}${n>1?' trees':''}`);
    document.querySelector('.tree-grid')?.lastElementChild?.scrollIntoView({behavior:'smooth',block:'center'});
    return;
  }
  snapshot();const bed=ST.beds[bi],c=treeCell(bed);
  bed.n=n;bed.name=$('tf-name').value.trim()||P[k].n;c.v=vid;if(d)c.d=d;
  saveState();refreshAll();openTreeSheet(bi);toast(`Saved ${bed.name}`,{undo:true});
}

// ── Tree sheet: season, harvest logging, this month's jobs ──
const TREE_QUICK={fruit:[1,5,10,20],bowl:[1,2,5]};
function openTreeSheet(bi){
  const bed=ST.beds[bi],c=treeCell(bed),k=c.p,f=FRUIT[k],st=treeStage(c),[se,sl]=TREE_STAGE[st],v=cellVariety(c);
  const yk=localDate().slice(0,4),logs=ST.log.filter(l=>l.bid===bed.id&&l.d.startsWith(yk)),got=logs.reduce((s,l)=>s+(l.n||1),0);
  const bowl=f.unit==='bowl',x={bed,bi,ri:0,ci:0,cell:c},jobs=treeJobItems(curMonth(),'std').filter(j=>j.bis?.includes(bi));
  showSheet(`<div class="sh-plant-hdr"><div class="sh-pe">${cellEmoji(c)}</div><div><div class="sh-pn">${esc(bed.name)}${bed.n>1?` <span class="hlog-d">×${bed.n}</span>`:''}</div><span class="sh-stag tg-${st==='ready'?'ready':'growing'}">${se} ${sl}</span>${v?`<span class="sh-picks">${esc(v.n)}</span>`:''}</div></div>
  <div class="sh-body">
    <div class="sh-chips"><div class="sh-chip"><div class="sh-cl">Fruit</div><div class="sh-cv" style="color:#C49010">${treeSeason(c)}</div></div><div class="sh-chip"><div class="sh-cl">In ground</div><div class="sh-cv">${treeAgeText(c)}</div></div><div class="sh-chip"><div class="sh-cl">This year</div><div class="sh-cv">${got?fruitUnits(k,got):'—'}</div></div></div>
    ${st==='young'?`<div class="sh-tip">🌱 Most ${f.n.toLowerCase()} trees fruit about ${plural(f.yrs,'year')} after planting — expect the first real crop around ${firstFruitYear(c)}. Until then it's building roots and branches.</div>`:''}
    ${treeBadHere(k)?`<div class="hu-row bad" style="margin-bottom:10px">⚠️ ${f.badWhy}</div>`:''}
    ${st!=='young'?`<div class="stat-lbl">🧺 Log a harvest${bowl?' (bowls)':''}</div>
      <div class="tree-quick">${TREE_QUICK[bowl?'bowl':'fruit'].map(n=>`<button class="btn btn-harvest" onclick="logTreePick(${bi},${n})">+${n}</button>`).join('')}</div>
      <div class="tree-quick"><input class="fm-in" id="tp-n" type="number" inputmode="numeric" min="1" max="999" placeholder="Or type how many"><button class="btn btn-seed" onclick="logTreePick(${bi},+$('tp-n').value)">Add</button></div>
      <div class="sh-hint">${bowl?'A bowl is about '+(f.g>=500?'half a kilo':f.g+'g')+'.':'Count the '+f.us+' you picked.'} Totals go into your harvest value.</div>
      ${st==='ready'?`<button class="btn btn-cancel btn-full" style="margin-bottom:10px" onclick="restTree(${bi})">✅ Finished picking for this season</button>`:''}`:''}
    ${readySignHtml(k)}
    ${jobs.length?`<div class="stat-lbl">📅 This month</div><div class="trait-list">${jobs.map(j=>`<div class="trait"><span class="trait-e">${j.icon}</span><div><b>${j.title.replace(/^\S+ /,'')}</b><div>${j.how}</div></div></div>`).join('')}</div><button class="link-btn" style="margin:-4px 0 10px" onclick="closeSheet();setView('jobs')">Tick these off in Jobs ›</button>`:''}
    ${lookOutHtml(k,[x])}
    ${recipesHtml(k)}
    <div class="btn-row" style="margin-bottom:12px"><button class="btn btn-cancel" onclick="openPlantInfo('${k}')">📖 About ${f.n.toLowerCase()}</button><button class="btn btn-cancel" onclick="openPestsFor('${k}')">🐛 Something wrong?</button></div>
    <div class="btn-row"><button class="btn btn-cancel" onclick="openTreeForm('${k}',${bi})">✏️ Edit</button><button class="btn btn-cancel" onclick="closeSheet()">Close</button></div>
  </div>`);
}
function logTreePick(bi,n){
  n=Math.round(n);if(!(n>0)){toast('How many did you pick?');return;}
  snapshot();const bed=ST.beds[bi],c=treeCell(bed),f=FRUIT[c.p];
  c.picks=(c.picks||0)+n;ST.log.push({d:localDate(),p:c.p,bid:bed.id,f:0,n});if(ST.log.length>1000)ST.log=ST.log.slice(-1000);
  ST.alertDone['tree:'+bed.id]=localDate();saveState();
  const kg=n*f.g/1000,val=priceOf(c.p)*kg;
  confettiAt(innerWidth/2,innerHeight*.5);refreshAll();openTreeSheet(bi);
  toast(`🧺 ${fruitUnits(c.p,n)} (~${kg<1?Math.round(kg*1000)+'g':kg.toFixed(1)+'kg'}${val?`, +${money(val)}`:''})`,{undo:true});
}
function restTree(bi){snapshot();const c=treeCell(ST.beds[bi]);c.rest=localDate();saveState();refreshAll();openTreeSheet(bi);toast('🌿 Season done — see you next year',{undo:true});}

// ── Tree jobs ── mode 'std' = everything; 'low' = just the yearly prune
const TREE_DONE={prune:120,net:150,thin:120,flowers:60,frost:60,water:6,mulch:150};
function treeJobDone(id,days){const d=ST.treeDone[id];return!!d&&daysBetween(d,localDate())<days;}
function treeJobItems(m,mode=maint()){
  const out=[],td=localDate(),ts=treeBeds();if(!ts.length||mode==='none')return out;
  const job=(id,kind,bis,icon,title,how)=>{if(treeJobDone(id,TREE_DONE[kind]))return;
    out.push({kind:'tree',id,type:'soon',cb:true,icon,bis,how,title:`${icon} ${title}`,detail:`${how} <span class="task-where">${bis.map(bi=>esc(ST.beds[bi].name)).join(', ')}</span>`});};
  ts.forEach(({bed,bi})=>{
    const c=treeCell(bed),f=FRUIT[c.p],y=treeYears(c),st=treeStage(c,m),nm=bed.name;
    if(fruitMonthIn(f.prune,m)&&y>=0.5)job(`prune:${bed.id}`,'prune',[bi],'✂️',`Prune your ${esc(nm)}`,f.pruneHow);
    if(mode!=='std')return;
    const pk=treePick(c),start=pk.find(x=>!pk.includes((x+11)%12))??pk[0];
    if(f.net&&treeBearing(c)&&!treeRested(c)&&(fruitMonthIn([(start+11)%12],m)||fruitMonthIn([start],m)))
      job(`net:${bed.id}`,'net',[bi],'🕸️',`Net your ${esc(nm)} before the fruit colours`,'Birds go for fruit as it colours. Throw netting over the tree and gather it at the trunk so they can\'t get underneath. Use wildlife-safe netting — you shouldn\'t be able to poke a finger through it.');
    if(f.thin&&treeBearing(c)&&fruitMonthIn(f.thin,m))job(`thin:${bed.id}`,'thin',[bi],'👐',`Thin the fruit on your ${esc(nm)}`,f.thinHow);
    if(f.yrs>=2&&y<1&&fruitMonthIn(f.flower||[],m))job(`flowers:${bed.id}`,'flowers',[bi],'🌸',`Pick the flowers off your young ${esc(nm)}`,'In its first year, let it put its energy into roots and branches. Pick off flowers and tiny fruit — you\'ll get far more fruit later.');
    if(f.frost&&y<3&&fruitMonthIn([5,6,7],m)&&!['tropical','subtropical'].includes(zone()))
      job(`frost:${bed.id}`,'frost',[bi],'❄️',`Protect your young ${esc(nm)} from frost`,'On clear, still nights, cover it with frost cloth or an old sheet over stakes (not touching the leaves). Water the soil the day before — damp soil holds more warmth.');
  });
  if(mode!=='std')return out;
  const all=ts.map(x=>x.bi);
  if(fruitMonthIn([11,0,1,2],m))job('water:trees','water',all,'💧','Deep-soak your fruit trees this week','A long, slow soak once a week beats a daily sprinkle — about 20–40 litres for a young tree, more for big ones. Fruit swells with water, so dry spells mean small or split fruit.');
  if(fruitMonthIn([8,9],m))job('mulch:trees','mulch',all,'🍂','Mulch under your fruit trees','Spread 5–7cm of mulch out to the edge of the branches, keeping it a hand-width from the trunk — mulch against the trunk causes collar rot.');
  return out;
}
// Fruit in season: one gentle reminder per tree, snoozed for 2 weeks once you've picked or ticked it
function treeReadyItems(){
  return treeBeds().filter(({bed})=>treeStage(treeCell(bed))==='ready'&&!(ST.alertDone['tree:'+bed.id]&&daysBetween(ST.alertDone['tree:'+bed.id],localDate())<14)).map(({bed,bi})=>{
    const c=treeCell(bed),f=FRUIT[c.p];
    return{kind:'tree',id:'tree:'+bed.id,type:'soon',cb:true,icon:'🧺',
      title:`🧺 ${esc(bed.name)} — ${f.unit==='bowl'?'ready to pick':`${f.us} are ripening`}`,
      detail:`${f.ready} Tick if you've checked it — we'll remind you again in 2 weeks.`,btn:{label:'🧺 Log a harvest ›',js:`openTreeSheet(${bi})`}};
  });
}
function tickTree(id){
  if(id.startsWith('tree:')){ST.alertDone[id]=localDate();return'🧺 Checked — we\'ll remind you in 2 weeks';}
  ST.treeDone[id]=localDate();
  return{prune:'✂️ Pruned — done for this year',net:'🕸️ Netted — the birds will have to look elsewhere',thin:'👐 Thinned — bigger fruit on the way',flowers:'🌸 Done — it\'ll thank you later',frost:'❄️ Covered — snug for the cold nights',water:'💧 Soaked — see you next week',mulch:'🍂 Mulched'}[id.split(':')[0]]||'✓ Done';
}
