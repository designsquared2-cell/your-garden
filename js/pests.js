// Problems tab: pests + growing problems, the beginner finder, prevention, remedies, pest-check jobs.
// Timing is typical for Perth / the Perth Hills; it shifts with the weather each year.
//   on:    plant keys, family names (see FAMILY), fruit groups (FRUIT_GROUPS, fruit.js), or '*seedlings' for anything at seed/seedling stage
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
  {id:'aphids',e:'🐜',n:'Aphids',on:['brassica','leafy','legume','nightshade','cucurbit','basil','coriander','parsley','dill','calendula','nasturtium','citrus','stone'],months:[7,8,9,10,2,3,4],peak:[8,9],
   look:'Clusters of tiny green, black or grey-waxy insects. Curled or puckered new leaves, sticky honeydew, and ants running up the stems.',
   where:'New shoots, flower buds and leaf undersides. Grey waxy ones hide deep in cabbage and kale leaves.',
   fix:'Blast off with the hose, squash by hand, or spray soap/eco-oil. Ladybirds and hoverflies will clean up the rest if you don\'t spray broad insecticides.',
   prevent:'Marigolds, alyssum and calendula nearby bring in the predators. Avoid over-feeding with nitrogen — soft growth attracts them.'},
  {id:'snails',e:'🐌',n:'Snails & slugs',on:['*seedlings','leafy','brassica','strawberry','basil'],months:[3,4,5,6,7,8,9],peak:[4,5,6,7],
   look:'Ragged holes, shiny slime trails, and seedlings that vanish overnight.',
   where:'Out at night and after rain; hiding under pots, boards and thick mulch by day.',
   fix:'Torch patrol after dark, beer traps, or iron-based pellets (safe around pets and wildlife).',
   prevent:'Protect new seedlings with collars or cloches through the wet months.'},
  {id:'cutworm',e:'🐛',n:'Cutworms',on:['*seedlings','tomatoes','capsicum','sweet-corn'],months:[7,8,9,10],peak:[8,9],
   look:'Seedlings chewed through at soil level overnight. Fat grey-brown grubs that curl into a C when dug up.',
   where:'Just under the soil surface around the stem.',
   fix:'Scratch the soil around damaged plants at dusk and remove the grubs.',
   prevent:'A cardboard collar (a toilet-roll tube) around each new seedling.'},
  {id:'earwigs',e:'🪳',n:'Earwigs',on:['*seedlings','basil','strawberry','leafy','beans'],months:[8,9,10,11,0,1,2],peak:[9,10,11],
   look:'Ragged holes in leaves and petals appearing overnight, with nothing visible during the day.',
   where:'Hiding in mulch, under pots and in tight leaf joints.',
   fix:'Trap them in rolled-up damp newspaper or a small tin of oil sunk to soil level; empty each morning.',
   prevent:'Pull mulch back from new seedlings until they\'re established.'},
  {id:'medfly',e:'🪰',n:'Fruit fly',on:['tomatoes','capsicum','chilli','eggplant','strawberry','citrus','stone','pome','fig','mango','grape','guava','persimmon','loquat','feijoa','pawpaw'],months:[9,10,11,0,1,2,3,4],peak:[0,1,2,3],
   look:'Tiny sting marks on ripening fruit, soft sunken patches, then maggots inside. Mostly a fruit-tree pest — stone fruit, figs, apples and citrus — but fruiting veg can be stung too.',
   where:'Ripening fruit, and fruit that\'s fallen to the ground.',
   fix:'Pick fruit as it ripens. Bag or bin stung and fallen fruit sealed — never compost it.',
   prevent:'Start bait traps in spring as the weather warms, and pick up fallen fruit every few days. Medfly is the WA species; Queensland fruit fly is the one in the eastern states. Medfly control is mandatory in the Kalamunda and Mundaring shires.'},
  {id:'two-spot-mite',e:'🕷️',n:'Two-spotted mite',on:['legume','cucurbit','eggplant','tomatoes','strawberry'],months:[10,11,0,1,2],peak:[11,0,1],
   look:'Fine yellow or silvery speckling on leaves, then fine webbing underneath. Leaves turn bronze and dry out.',
   where:'Undersides of leaves — use a magnifier. Worst on dusty, water-stressed plants.',
   fix:'Hose the undersides of leaves every day or two (they hate humidity). Remove the worst leaves. Eco-oil if needed.',
   prevent:'Keep plants well watered and mulched through heatwaves, and keep dust down.'},
  {id:'russet-mite',e:'🕷️',n:'Tomato russet mite',on:['tomatoes','eggplant'],months:[11,0,1,2],peak:[0,1],
   look:'Lower leaves yellow, curl and dry; stems turn bronze and greasy-looking, working up the plant. Fruit skin goes leathery. Too small to see without a hand lens.',
   where:'Starts on the lowest leaves and stems.',
   fix:'Remove affected lower leaves early. Wettable sulphur controls them — but never spray it above about 30°C.',
   prevent:'Check the lower stems of tomatoes weekly from December.'},
  {id:'whitefly',e:'🦟',n:'Whitefly',on:['tomatoes','legume','cucurbit','brassica','eggplant'],months:[10,11,0,1,2,3],peak:[0,1,2],
   look:'Clouds of tiny white insects fly up when you brush the plant. Sticky leaves and black sooty mould.',
   where:'Undersides of leaves.',
   fix:'Yellow sticky traps, hose the undersides, eco-oil every week while they\'re bad.',
   prevent:'Hang a yellow sticky trap early in summer so you see them arrive.'},
  {id:'heliothis',e:'🐛',n:'Heliothis (tomato grub)',on:['tomatoes','sweet-corn','legume','capsicum','chilli'],months:[9,10,11,0,1,2,3],peak:[11,0,1],
   look:'Neat round holes bored into fruit and pods, droppings nearby, caterpillars in corn silks and flower buds.',
   where:'Fruit, pods, cobs and buds.',
   fix:'Bt sprayed while caterpillars are small; pick off larger ones; remove damaged fruit.',
   prevent:'Check fruit weekly once flowering starts.'},
  {id:'shield-bugs',e:'🪲',n:'Green vegetable bugs',on:['legume','tomatoes','capsicum','chilli','sweet-corn','eggplant'],months:[10,11,0,1,2],peak:[0,1],
   look:'Green shield-shaped bugs and clusters of spotty black-and-white nymphs. Wilting shoots, blemished fruit, pods that drop.',
   where:'Tips, pods and fruit — sunny side of the plant.',
   fix:'Early morning, while they\'re sluggish, knock them into a bucket of soapy water.',
   prevent:'Check and squash egg rafts (neat hexagon clusters) on leaf undersides.'},
  {id:'powdery-mildew',e:'🍄',n:'Powdery mildew',disease:true,on:['cucurbit','peas','grape'],months:[8,9,0,1,2,3],peak:[1,2],
   look:'White, flour-like patches on leaves that spread until leaves yellow and die.',
   where:'Older leaves first, especially in crowded, humid spots.',
   fix:'Remove the worst leaves. Spray weekly with 1 part milk to 9 parts water, or potassium bicarbonate.',
   prevent:'Water the soil, not the leaves, and give plants room for air to move.'},
  {id:'birds',e:'🐦',n:'Birds',on:['strawberry','peas','brassica','*seedlings','stone','pome','fig','grape','berries'],months:[8,9,10,11,0,1,2,3],peak:[9,10,0,1],
   look:'Fruit pecked as it colours, seedlings pulled out, pea shoots stripped.',
   where:'Ripening strawberries and tree fruit, and fresh seedlings.',
   fix:'Net over a frame (so they can\'t reach through) as soon as fruit starts colouring.',
   prevent:'Net strawberries from flowering, and cover new seedlings for their first couple of weeks.'},
  {id:'gall-wasp',e:'🐝',n:'Citrus gall wasp',on:['citrus'],months:[7,8,9,10],peak:[8,9],
   look:'Lumpy, swollen woody lumps (galls) on young stems, sometimes with tiny exit holes. Branches beyond a gall weaken and fruit poorly.',
   where:'Thin stems that grew last spring.',
   fix:'Cut out galls in winter, before the tiny wasps hatch in spring. Bag and bin them — don\'t compost.',
   prevent:'Check stems every winter, and go easy on spring feeding — it grows the soft shoots they lay eggs in.'},
  {id:'scale',e:'🟤',n:'Scale insects',on:['citrus','olive','mango','avocado','fig','stone','grape','blueberry'],months:[9,10,11,0,1,2,3],peak:[11,0,1],
   look:'Small brown, white or waxy bumps stuck to stems and leaf undersides, sticky leaves, black sooty mould, and ants running up the trunk.',
   where:'Stems and the undersides of leaves, often along the middle vein.',
   fix:'Scrape off light infestations. Spray eco-oil or horticultural oil, covering every bump, two or three times two weeks apart.',
   prevent:'Stop ants farming them — a sticky band around the trunk keeps the ants, and so the scale, down.'},
  {id:'leafminer',e:'〰️',n:'Citrus leafminer',on:['citrus'],months:[1,2,3,9,10],peak:[2,3],
   look:'Silvery, wiggly trails inside soft new leaves, which curl and twist. Older, hardened leaves aren\'t touched.',
   where:'New growth flushes, mainly late summer and autumn.',
   fix:'Mostly cosmetic on established trees — you can leave it. On young trees, spray soft new growth with eco-oil weekly.',
   prevent:'Avoid pruning or heavy feeding in late summer, which pushes out soft new leaves just as leafminer peaks.'},
  {id:'lbam',e:'🐛',n:'Light brown apple moth',on:['pome','grape','citrus','stone','blueberry'],months:[8,9,10,2,3],peak:[9,10],
   look:'Small green caterpillars that wriggle fast when disturbed, hiding in leaves webbed or rolled together. Shallow scarred patches on fruit where a leaf touches it.',
   where:'Rolled leaves, and where a leaf or another fruit touches the fruit.',
   fix:'Squash the caterpillars inside rolled leaves. Spray Bt while they\'re small.',
   prevent:'Check for rolled leaves in spring, and keep weeds down under the tree.'},
  // Animals: they're obvious once they visit, so they're in Identify and the Guide but not the weekly pest walk (noWatch)
  {id:'possums',e:'🐾',n:'Possums',noWatch:true,on:['fruit','tomatoes','leafy','brassica','strawberry','beans','sweet-corn'],months:[0,1,2,3,4,8,9,10,11],peak:[0,1,2],
   look:'Fruit half-eaten or gone overnight, new shoots and leaves stripped from the tops of plants, snapped branches, and dark pellet droppings. You may hear them on the roof or fence at night.',
   where:'Fruit trees, tomatoes, roses and leafy veg — anything they can reach from a fence, roof or tree.',
   fix:'Possums are protected native animals — you can’t harm or move them without a permit. Net fruit trees completely, gathered at the trunk, and cover veg beds with netting or a wire cage at night.',
   prevent:'Keeping them out is the only thing that really works: netting over trees, a roof of netting or wire over beds, and trimming branches that give them a bridge in.'},
  {id:'rats',e:'🐀',n:'Rats & mice',noWatch:true,on:['sweet-corn','tomatoes','strawberry','pumpkin','fruit','*seedlings'],months:[1,2,3,4,5],peak:[3,4],
   look:'Gnawed fruit with small teeth marks, corn cobs stripped, pumpkins hollowed out from underneath, seeds dug up, small dark droppings and burrows near the compost.',
   where:'Low fruit, corn cobs, compost bins and under decking.',
   fix:'Pick fruit as it ripens and clear fallen fruit. Rat-proof the compost with wire mesh underneath, and use snap traps inside a covered box, away from pets and wildlife.',
   prevent:'Keep compost enclosed, don’t leave food scraps in open heaps, and clear the clutter where they nest.'},
  {id:'roos',e:'🦘',n:'Kangaroos, wallabies & rabbits',noWatch:true,on:['*'],months:[0,1,2,3,4,5,6,7,8,9,10,11],peak:[11,0,1,2],
   look:'Plants grazed to the ground overnight, seedlings gone, neatly clipped stems (rabbits) or trampled beds, and droppings — small round pellets for rabbits, larger oval ones for kangaroos.',
   where:'Gardens near bush, paddocks or open space, especially in dry spells.',
   fix:'Fencing is the answer: about 1.8m high for kangaroos, and wire mesh buried 30cm deep for rabbits. Native wildlife is protected — scare it, don’t harm it.',
   prevent:'Fence or net beds before planting out seedlings.'},
  {id:'curl-grubs',e:'🪱',n:'Curl grubs',noWatch:true,on:['*'],months:[1,2,3,4],peak:[2,3],
   look:'Plants wilt and die even though they’re watered. Dig around them and you find fat, white, C-shaped grubs with brown heads eating the roots.',
   where:'In the soil around the roots — especially beds near lawn or with lots of fresh manure.',
   fix:'Dig through the soil and pick out the grubs (chooks love them). For a bad patch, water in a beneficial-nematode treatment from a garden centre.',
   prevent:'Turn the soil before planting, use well-rotted compost rather than fresh manure, and keep beds away from lawn edges.'},
  {id:'mealybugs',e:'☁️',n:'Mealybugs',on:['citrus','basil','chilli','capsicum','tomatoes','mint','curry-leaf','passionfruit'],months:[0,1,2,3,9,10,11],peak:[0,1],
   look:'White cottony fluff in leaf joints and under leaves, with small oval white bugs inside. Leaves get sticky, and ants run up the stems.',
   where:'Leaf joints, stems and sometimes roots — worst on potted plants and in sheltered spots.',
   fix:'Dab them with a cotton bud dipped in methylated spirits, or spray eco-oil or soap spray. Repeat weekly — eggs hide in the fluff.',
   prevent:'Check new plants before you bring them home, and keep ants down.'},
  {id:'leaf-spot',e:'🟠',n:'Rust & leaf spot',disease:true,on:['legume','chard','beetroot','spinach','lettuce','garlic','onions','leek','strawberry'],months:[2,3,4,8,9,10],peak:[3,9],
   look:'Rusty orange or brown powdery spots under the leaves (rust), or round brown or grey spots with darker rims (leaf spot). On broad beans, chocolate-brown spots on leaves and stems after damp weather (chocolate spot). The spots join up, and leaves yellow and die.',
   where:'Older leaves first, in humid or showery weather.',
   fix:'Pick off spotted leaves and bin them (not the compost). Water the soil, not the leaves, and do it in the morning.',
   prevent:'Give plants room for air to move, don’t water leaves late in the day, and rotate crops.'},
  {id:'harlequin',e:'🪲',n:'Harlequin bugs',on:['brassica','tomatoes','fruit','okra','sunflower','amaranth','beans'],months:[10,11,0,1,2],peak:[11,0],
   look:'Clusters of bright orange-and-black (or red-and-blue) shield-shaped bugs bunched on stems. Shoots wilt and young fruit drops.',
   where:'Stems and fruit in hot weather, often in big groups.',
   fix:'Early in the morning, while they’re sluggish, knock them into a bucket of soapy water. Squash egg clusters.',
   prevent:'Clear weeds around the garden, especially marshmallow weed, where they breed.'},
  {id:'bronze-bug',e:'🟫',n:'Bronze orange bug',on:['citrus'],months:[7,8,9,10,11],peak:[8,9],
   look:'Large shield-shaped bugs (about 2.5cm), bronze to black, on citrus shoots. The young are flat and green-pink. They squirt a stinging, smelly liquid, and shoots wilt and fruit drops.',
   where:'New citrus shoots and stems in late winter, spring and early summer — mostly Queensland and NSW.',
   fix:'Wear gloves and eye protection — the spray burns. Knock them into a bucket of soapy water or vacuum them off. Eco-oil works on the flat young nymphs in late winter.',
   prevent:'Check citrus in late winter, when the young are easy to target.'},
  {id:'leaf-curl',e:'🍑',n:'Peach leaf curl',disease:true,on:['peach','nectarine'],months:[7,8,9],peak:[8],
   look:'New spring leaves thicken, pucker and blister, turning red or purple, then drop. Badly hit trees fruit poorly.',
   where:'New leaves as they open in spring.',
   fix:'Once you can see it, it\'s too late to spray this year. Pick off and bin affected leaves, then feed and water so the tree regrows.',
   prevent:'Spray copper (or lime sulphur) over the whole tree at bud swell in late winter, before the buds open.'},
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
    act:'Hang fruit fly bait traps',how:'Hang traps in spring as the weather warms, before fruit starts to colour. Control is mandatory in the Kalamunda and Mundaring shires.'},
  'mite-mulch':{pests:['two-spot-mite','russet-mite'],months:[9,10],before:[9],
    act:'Mulch thickly before summer',how:'Spread 5–7cm of mulch and water deeply. Mites boom on dry, dusty, stressed plants.'},
  'sticky-traps':{pests:['whitefly'],months:[9,10],before:[9],
    act:'Hang yellow sticky traps',how:'One trap per bed shows you the moment whitefly arrive, while they\'re still easy to deal with.'},
  'mildew-space':{pests:['powdery-mildew'],on:['cucurbit'],months:[11,0,1],before:[11],
    act:'Give zucchini and pumpkins air',how:'Thin out crowded leaves and water the soil, not the leaves. Start a weekly milk spray before mildew shows up.'},
  'net-fruit':{pests:['birds'],on:['strawberry'],months:[8,9,10],before:[8],
    act:'Net strawberries before they colour',how:'Net over a frame as soon as flowers appear, so birds can\'t reach through.'},
  'leaf-curl-spray':{pests:['leaf-curl'],months:[6,7],before:[6,7],
    act:'Spray peaches & nectarines for leaf curl',how:'Spray copper over every branch at bud swell — when the buds are fat but not yet open. Once the leaves curl it\'s too late for this year.'},
  'gall-wasp-prune':{pests:['gall-wasp'],months:[5,6,7],before:[5,6],
    act:'Cut out citrus gall wasp galls',how:'Look along the stems for lumpy swellings and cut them out before the wasps hatch in spring. Bag and bin them.'},
  'ant-bands':{pests:['scale'],months:[8,9],before:[8],
    act:'Put sticky bands on fruit tree trunks',how:'A band of horticultural glue or tape around each trunk stops ants carrying scale and aphids up into the tree.'},
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
  'birds':{nat:['Netting over a frame — use wildlife-safe netting you can\'t poke a finger through','Reflective tape or old CDs (works for a while)'],native:'Grevilleas and kangaroo paws planted away from the veg give honeyeaters a better option.'},
  'gall-wasp':{nat:['Cut out galls in winter and bag them for the bin'],org:['There\'s no effective home spray — pruning is the cure']},
  'scale':{nat:['Scrape off small patches with a fingernail or soft brush','A sticky band around the trunk to stop ants'],org:['Eco-oil or horticultural oil, 2–3 sprays two weeks apart'],native:'Ladybirds and tiny parasitic wasps eat scale — avoid broad-spectrum sprays that kill them.'},
  'leafminer':{nat:['Leave it on established trees — it\'s mostly cosmetic','Pick off badly curled new shoots on young trees'],org:['Eco-oil on soft new growth, weekly, on young trees']},
  'lbam':{nat:['Squash caterpillars in rolled leaves','Keep weeds down under the tree'],org:['Bt while caterpillars are small'],native:'Native daisies feed the tiny wasps that attack caterpillars.'},
  'leaf-curl':{nat:['Pick off and bin curled leaves','Feed and water well so the tree regrows'],org:['Copper or lime sulphur at bud swell in late winter (prevention only)']},
  'possums':{nat:['Net fruit trees completely and gather the net at the trunk','Cover beds with a netting or wire cage at night','Trim branches that give them a bridge from trees or roofs','Motion-activated lights or sprinklers help for a while'],native:'Possums are protected native animals. A possum nest box high in a tree away from the veg can give them somewhere else to be.'},
  'rats':{nat:['Pick fruit as it ripens and clear fallen fruit','Wire mesh under the compost bin','Snap traps inside a covered box, away from pets and wildlife'],native:'Rat poisons also kill owls, kookaburras and pets that eat poisoned rats — traps are safer.'},
  'roos':{nat:['A 1.8m fence for kangaroos and wallabies','Wire mesh buried 30cm deep for rabbits','Net or cage beds while seedlings are young'],native:'Kangaroos and wallabies are protected — fence them out rather than harming them.'},
  'curl-grubs':{nat:['Dig through the soil and remove the grubs','Let chooks scratch over the bed before planting'],org:['Beneficial nematodes watered into moist soil']},
  'mealybugs':{nat:['Dab with methylated spirits on a cotton bud','Hose them off','Soap spray: 1 tablespoon of pure soap per litre of water'],org:['Eco-oil, weekly until gone'],native:'Ladybirds (including the mealybug ladybird) eat them — avoid broad sprays.'},
  'leaf-spot':{nat:['Pick off spotted leaves and bin them','Water the soil in the morning, not the leaves','Thin crowded plants'],org:['Copper-based fungicide for leaf spot','Wettable sulphur for rust (not above about 30°C)']},
  'harlequin':{nat:['Knock them into soapy water early in the morning','Squash the egg clusters','Clear marshmallow weed nearby']},
  'bronze-bug':{nat:['Gloves and eye protection on — then knock them into soapy water','Vacuum them off with a hand-held vacuum'],org:['Eco-oil on the young nymphs in late winter']},
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
  {id:'uneven-water',e:'🍅',n:'Uneven watering',on:['nightshade','cucurbit','citrus','pomegranate'],
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
  {id:'frost',e:'❄️',n:'Frost damage',on:['*'],
   what:'On clear, still winter nights the air at ground level can drop below 0°C. Water inside tender leaves freezes, the cells burst, and the leaves collapse.',
   look:'Leaves go dark, limp and watery the morning after a cold night, then turn black or brown and crisp. Worst on the tops of plants and in low spots.',
   rem:{nat:['Leave frost-damaged leaves on until spring — they protect the growth underneath','Cover tender plants on frosty nights with frost cloth or an old sheet (not plastic)','Water the soil the day before a frost — damp soil holds more warmth']},
   prevent:'Plant tender crops after the last frost, and watch for the frost alert in Jobs.'},
  {id:'collar-rot',e:'🪵',n:'Collar rot',on:['citrus','avocado'],
   what:'A fungus that rots the bark at the base of the trunk when soil or mulch stays wet against it.',
   look:'Gum oozing from cracked, darkened bark at the base of the trunk; yellowing leaves; a tree that slowly goes downhill.',
   rem:{nat:['Pull mulch and soil 10cm back from the trunk','Scrape off rotten bark back to healthy wood and let it dry out','Water less often but more deeply'],org:['Paint the cleaned area with a copper-based paste']},
   prevent:'Keep mulch a hand-width from the trunk and make sure water drains away.'},
];
// Not producing / running late — late:true marks these for the "running late" job and plant sheets
DISORDERS.push(
  {id:'no-heading',e:'🥬',n:'Not heading up',late:true,on:['cabbage','cauliflower','broccoli'],
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
  {id:'pods-poor',e:'🫘',n:'Beans & peas not podding',late:true,on:['legume'],
   what:'Broad beans and peas set pods best in cool weather with bees about. Hot spells (over about 25°C for broad beans and peas, 30°C for beans), dry soil at flowering, too much nitrogen, and windy or bee-free weather all stop pods forming or filling.',
   look:'Plenty of flowers that drop off, or small pods that never fill out.',
   rem:{nat:['Water deeply while they’re flowering','Broad beans: once the first pods have set, pinch out the top 10cm of each stem — it sends energy to the pods and gets rid of the black aphids that cluster there','Plant bee-friendly flowers nearby (borage, alyssum, native daisies)','Go easy on manure — beans and peas make their own nitrogen','Late-sown broad beans and peas often fail as spring heats up — keep picking what forms, and sow earlier next year']},
   prevent:'Sow broad beans and peas in autumn (April–May in most of southern Australia) so they flower before the spring heat.'},
  {id:'roots-thin',e:'🥕',n:'Roots not swelling',late:true,on:['beetroot','carrots','turnip','radish','onions','shallots','garlic','potato','sweet-potato','leek'],
   what:'Root crops swell when they have loose soil, room and even watering. Crowding, rich nitrogen feeds and hard soil keep them thin — and stones or fresh manure make carrots fork.',
   look:'Plenty of leaf but thin or small roots; forked, twisted or hairy carrots.',
   rem:{nat:['Thin them so each has room — beetroot 10cm apart, carrots 5cm','Stop nitrogen feeds; use potash instead','Water deeply and evenly']},
   prevent:'Sow into loose, stone-free soil with old compost — never fresh manure.'},
  {id:'not-ripening',e:'🍅',n:'Fruit not ripening',late:true,on:['tomatoes','capsicum','chilli','eggplant','pumpkin'],
   what:'Tomatoes and capsicums colour up best between about 20 and 30°C. In cool weather — or very hot spells over about 32°C — they stall green.',
   look:'Full-sized fruit that stays green for weeks.',
   rem:{nat:['Be patient — they ripen as temperatures settle','Late in the season, pick full-sized green fruit and ripen it indoors in a paper bag with a banana','Late in the season, nip off new flowers so the plant ripens what it has']},
   prevent:'Plant warm-season crops in Sept–Oct so fruit ripens through summer.'},
  {id:'fruit-drop',e:'🍂',n:'Fruit dropping early',late:true,on:['citrus','stone','pome','avocado','mango'],
   what:'Trees drop some baby fruit naturally to thin themselves. Lots of drop usually means stress — a dry spell, a heatwave or a hungry tree.',
   look:'Small green fruit falling, sometimes masses of it after hot weather.',
   rem:{nat:['Some drop is normal — the tree is thinning itself','Water deeply once a week through summer, and mulch','Feed on time — see the tree\'s card for when']},
   prevent:'Deep, regular summer watering and thick mulch.'},
  {id:'tree-no-fruit',e:'🌳',n:'Tree not fruiting',late:true,on:['fruit'],
   what:'Young trees take a few years to fruit. Older trees may be missing a pollination partner or enough winter cold, or have had too much nitrogen. Some (mandarins, apples) crop heavily one year and lightly the next.',
   look:'A healthy-looking tree with few or no flowers, or flowers that don\'t turn into fruit.',
   rem:{nat:['Check its age — most trees fruit 2–4 years after planting','Plant a second variety nearby if it needs a pollination partner','Stop high-nitrogen feeds (manure, lawn food) and use a fruit-tree or citrus food','Avoid hard pruning — it swaps fruit for leafy growth']},
   prevent:'Choose varieties that suit your climate (low-chill in warm areas) and check the label for pollination needs.'},
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

function pestOnPlant(pest,k){return pest.on.some(t=>t==='*'||t===k||FAMILY[t]?.includes(k)||FRUIT_GROUPS[t]?.includes(k));}
// Pests that go for the fruit itself only matter on a tree while it has fruit on it —
// but prevention (early=true, e.g. spring fruit fly traps) starts on any tree old enough to fruit
const FRUIT_EATERS=['medfly','birds'];
function pestHitsCell(pest,cell,early){
  if(isEmpty(cell)||cell.s==='done')return false;
  if(isTree(cell.p)&&FRUIT_EATERS.includes(pest.id)&&!(early?treeBearing(cell):['forming','ready'].includes(treeStage(cell))))return false;
  return pestOnPlant(pest,cell.p)||(pest.on.includes('*seedlings')&&(cell.s==='seed'||cell.s==='seedling'));
}
function pestsFor(k){return PESTS.filter(p=>pestOnPlant(p,k));}
// Pest seasons shift with the climate zone (zones.js)
function pestActive(pest,m=curMonth()){return pest.months?pestMonthIn(pest.months,m):true;}
function pestPeak(pest,m=curMonth()){return!!pest.peak&&pestMonthIn(pest.peak,m);}
function pestCells(pest){return plantedCells().filter(x=>pestHitsCell(pest,x.cell));}
// Pests active this month that could be on something you're growing now, peak first
function pestsToWatch(m=curMonth()){
  // animals (noWatch) are obvious once they arrive: they stay in Identify and the Guide, not the weekly walk
  return PESTS.filter(p=>!p.noWatch&&pestActive(p,m)&&pestCells(p).length).sort((a,b)=>pestPeak(b,m)-pestPeak(a,m));
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
// One weekly "pest walk" instead of a card per pest: the worst few to look for, the rest on the Pests tab
const WALK_SHOW=4;
function pestCheckItems(m){
  const ps=pestsToWatch(m).filter(p=>!pestDoneRecently(p.id)&&!ST.pestReports.some(r=>r.pest===p.id));
  if(!ps.length)return[];
  const show=ps.slice(0,WALK_SHOW),more=ps.length-show.length;
  return[{kind:'pest',id:'walk',type:'pest',cb:true,icon:'🔍',
    title:`🔍 Weekly pest walk: ${show.map(p=>p.n.toLowerCase()).join(', ')}${more?` +${more} more`:''}`,
    detail:`${show.map(p=>`<b>${p.e} ${p.n}${pestPeak(p,m)?' <span class="peak-tag">peak</span>':''}</b> — ${p.look.split('. ')[0].replace(/\.$/,'')}. <span class="task-where">${plantList(pestCells(p),2)}</span>`).join('<br>')}<br>Tick once you’ve had a look around.${more?' The rest are on the Pests tab → This month.':''}`,
    btn:{label:'🐛 Found something',js:"openPestsFor(null)"}}];
}
function guardDone(id){const d=ST.guardDone[id];return!!d&&daysBetween(d,localDate())<GUARD_DONE_DAYS;}
function guardCells(g){const ps=g.on?[{on:g.on}]:g.pests.map(id=>PEST_BY_ID[id]);return plantedCells().filter(x=>ps.some(p=>pestHitsCell(p,x.cell,true)));}
function recentRain(days){if(!WX?.daily)return 0;const d=WX.daily,ti=wxToday(d);let s=0;for(let i=Math.max(0,ti-days+1);i<=ti;i++)s+=d.precipitation_sum[i]||0;return s;}
// Prevention jobs: in the lead-up to (and early in) each pest's season, for plants you're growing
function guardItems(m){
  const out=Object.entries(GUARDS).filter(([id,g])=>pestMonthIn(g.months,m)&&!guardDone(id)).map(([id,g])=>{
    const cells=guardCells(g);if(!cells.length)return null;
    const p=PEST_BY_ID[g.pests[0]],coming=pestMonthIn(g.before,m)&&!pestActive(p,m);
    return{kind:'guard',id,type:'guard',cb:true,icon:'🛡️',title:`🛡️ ${g.act}`,
      detail:`${coming?`${p.n}: season starts in ${MONTHS[zoneMonthsOut(p.months)[0]]} — get ahead of it.`:`${p.n}: season has started.`} ${g.how} <span class="task-where">For your ${plantList(cells)} · ${bedList(cells)}</span>`};
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
function tickPest(id){
  if(id==='walk'){pestsToWatch(curMonth()).forEach(p=>{ST.pestDone[p.id]=localDate();});return'🔍 Pest walk done — next one in a week';}
  ST.pestDone[id]=localDate();return`✓ All clear — next ${PEST_BY_ID[id].n.toLowerCase()} check in a week`;
}
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
const AREAS=[['bugs','🐛','Bugs I can see'],['animals','🦘','Animals or big bites'],['leaves','🍃','Leaves'],['fruit','🍅','Fruit or pods'],['seedlings','🌱','Seedlings'],['whole','🥀','The whole plant'],['late','🧺','Not producing / slow']];
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
  {id:'birds',a:['bugs','fruit','seedlings','animals'],e:'🐦',t:'Birds hanging around'},
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
  {id:'pecked',a:['fruit','seedlings','animals'],e:'🍓',t:'Pecked fruit or pulled-up seedlings'},
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
  {id:'flowers-drop',a:['late','fruit','whole'],e:'🥀',t:'Flowers dropping off'},
  {id:'empty-pods',a:['late','fruit'],e:'🫛',t:'Pods small, empty or not filling'},
  {id:'scale-bumps',a:['bugs','leaves'],e:'🟤',t:'Small bumps stuck to stems or leaves'},
  {id:'rolled',a:['leaves','bugs'],e:'🌯',t:'Leaves rolled or webbed together'},
  {id:'trails',a:['leaves'],e:'〰️',t:'Silvery wiggly trails in new leaves'},
  {id:'blisters',a:['leaves'],e:'🔴',t:'Red, puckered, blistered new leaves'},
  {id:'galls',a:['whole'],e:'🪵',t:'Woody lumps on stems'},
  {id:'bark-gum',a:['whole'],e:'🟫',t:'Gum or rotten bark at the base of the trunk'},
  {id:'fruit-falling',a:['fruit','late'],e:'🍂',t:'Fruit falling before it\'s ripe'},
  {id:'tree-barren',a:['late'],e:'🌳',t:'Tree grows but doesn\'t fruit'},
  {id:'eaten-high',a:['animals','fruit'],e:'🌳',t:'Fruit or plant tops eaten overnight'},
  {id:'broken-branches',a:['animals'],e:'🪵',t:'Snapped branches or stripped shoots'},
  {id:'droppings-big',a:['animals'],e:'⚫',t:'Droppings left in the garden'},
  {id:'gnawed',a:['animals','fruit'],e:'🦷',t:'Gnawed fruit with small teeth marks'},
  {id:'grazed',a:['animals','seedlings'],e:'✂️',t:'Plants grazed to the ground'},
  {id:'burrows',a:['animals'],e:'🕳️',t:'Burrows or holes near the garden'},
  {id:'cotton',a:['bugs','leaves'],e:'☁️',t:'White cottony fluff on stems'},
  {id:'c-grub',a:['bugs','whole','seedlings'],e:'🪱',t:'Fat white C-shaped grubs in the soil'},
  {id:'rust-spots',a:['leaves'],e:'🟠',t:'Orange or brown spots on leaves'},
  {id:'orange-black',a:['bugs'],e:'🪲',t:'Orange-and-black bugs in clusters'},
  {id:'stink-bug',a:['bugs'],e:'🟫',t:'Big brown stink bugs on citrus'},
  {id:'frost-black',a:['leaves','whole'],e:'❄️',t:'Leaves blackened after a cold night'},
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
  'birds':{signs:['birds','pecked','seedling-cut'],what:'Wattlebirds and parrots love ripe strawberries and tree fruit; blackbirds scratch up fresh seedlings looking for worms.'},
  'gall-wasp':{signs:['galls'],what:'A tiny native wasp that lays its eggs inside young citrus stems. The stem swells into a woody gall around the growing grubs.'},
  'scale':{signs:['scale-bumps','sticky','ants'],what:'Sap-sucking insects that glue themselves to stems under a protective shell, so they look more like bumps than bugs. Ants guard them for their sweet honeydew.'},
  'leafminer':{signs:['trails','curled'],what:'The tiny caterpillar of a moth, tunnelling between the top and bottom surface of soft new citrus leaves.'},
  'lbam':{signs:['rolled','green-cat','fruit-holes'],what:'Caterpillars of a small brown moth that roll leaves together with silk to hide, and graze the skin of fruit underneath.'},
  'leaf-curl':{signs:['blisters','curled'],what:'A fungus that infects peach and nectarine buds over winter. By the time leaves curl in spring, it can\'t be sprayed away.'},
  'collar-rot':{signs:['bark-gum','yellow-lower']},
  'fruit-drop':{signs:['fruit-falling']},
  'tree-no-fruit':{signs:['tree-barren','flowers-no-fruit']},
  'possums':{signs:['eaten-high','broken-branches','droppings-big','pecked'],what:'Brushtail and ringtail possums feed at night, eating fruit, buds and soft leaves — often from the top of the plant down. They’re protected native animals.'},
  'rats':{signs:['gnawed','burrows','droppings-big','fruit-holes'],what:'Rats and mice raid gardens for fruit, corn and seed, especially in autumn. They nest in compost, woodpiles and under decks.'},
  'roos':{signs:['grazed','droppings-big','seedling-cut'],what:'Kangaroos, wallabies and rabbits graze gardens near bush and paddocks, mostly at night and in dry spells.'},
  'curl-grubs':{signs:['c-grub','wilt-midday','slow'],what:'The larvae of beetles (including Christmas beetles). They live in the soil and eat roots, so plants wilt with no obvious damage above ground.'},
  'mealybugs':{signs:['cotton','sticky','ants'],what:'Small sap-sucking insects covered in white wax, so they look like tiny bits of cotton wool. Ants farm them for their honeydew.'},
  'leaf-spot':{signs:['rust-spots','yellow-lower','crispy']},
  'harlequin':{signs:['orange-black','wilting'],what:'Brightly coloured sap-sucking bugs related to stink bugs. They gather in clusters in hot weather.'},
  'bronze-bug':{signs:['stink-bug','wilting'],what:'A large native stink bug that feeds on citrus shoots. Its defensive spray can burn skin and eyes.'},
  'frost':{signs:['frost-black','scorched']},
  'overwater':{signs:['yellow-lower','wilt-wet','stem-rot','gnats']},
  'underwater':{signs:['wilt-midday','crispy','yellow-lower']},
  'uneven-water':{signs:['black-bottom','split']},
  'hungry':{signs:['pale-all','yellow-lower','slow']},
  'heat':{signs:['scorched','wilt-midday','crispy','flowers-drop']},
  'bolting':{signs:['bolting']},
  'no-heading':{signs:['no-head','button','leafy-only']},
  'all-leaves':{signs:['leafy-only','flowers-no-fruit']},
  'no-fruit-set':{signs:['flowers-no-fruit','baby-rot','flowers-drop']},
  'pods-poor':{signs:['flowers-drop','empty-pods','flowers-no-fruit']},
  'roots-thin':{signs:['thin-roots','forked','leafy-only']},
  'not-ripening':{signs:['green-fruit']},
  'slow':{signs:['slow']},
};
PROBLEMS.forEach(p=>Object.assign(p,PEST_ID[p.id]));

let _pTab='id',_idArea=null,_idSel=new Set(),_idPlant=null;
function pTab(t){_pTab=t;renderPests();window.scrollTo(0,0);}
let _idQ='';
function idArea(a){_idArea=a;idTidy();renderPests();}
function idToggle(s){_idSel.has(s)?_idSel.delete(s):_idSel.add(s);renderPests();}
function idPlant(k){_idPlant=k;_idQ='';idTidy();renderPests();setTimeout(()=>$('id-step3')?.scrollIntoView({behavior:'smooth',block:'start'}),50);}
function idClear(){_idSel.clear();_idPlant=null;_idArea=null;_idQ='';renderPests();}
// Seedling pests (snails, cutworms) can hit any young plant
function idOnPlant(p,k){return pestOnPlant(p,k)||p.on.includes('*seedlings');}
// Symptoms worth offering: in this area, and a sign of something this plant can actually get
function idSymptoms(){
  if(!_idArea||!_idPlant)return[];
  const signs=new Set(PROBLEMS.filter(p=>idOnPlant(p,_idPlant)).flatMap(p=>p.signs));
  return SYMPTOMS.filter(s=>s.a.includes(_idArea)&&signs.has(s.id));
}
// Drop ticks that no longer fit after changing area or plant
function idTidy(){if(!_idPlant)return;const ok=new Set(PROBLEMS.filter(p=>idOnPlant(p,_idPlant)).flatMap(p=>p.signs));[..._idSel].forEach(s=>{if(!ok.has(s))_idSel.delete(s);});}
// Beans and peas have pods, not fruit
function symText(s){const pods=FAMILY.legume.includes(_idPlant)||_idPlant==='okra';return pods?s.t.replace('Fruit or pods','Pods').replace(/\bfruit\b/g,'pods').replace(/\bFruit\b/g,'Pods'):s.t;}
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
    if(_idPlant&&!idOnPlant(p,_idPlant))return null;
    const hit=p.signs.filter(s=>_idSel.has(s)).length;if(!hit)return null;
    let score=hit*3+2*hit/p.signs.length+weatherBoost(p);
    if(_idPlant&&pestOnPlant(p,_idPlant))score+=1; // named for this plant, not just any seedling
    if(p.months&&pestActive(p,m))score+=1;if(pestPeak(p,m))score+=1;
    return{p,score};
  }).filter(Boolean).sort((a,b)=>b.score-a.score).slice(0,3);
}
function photosUrl(p){return'https://www.google.com/search?tbm=isch&q='+encodeURIComponent(p.n+(p.kind==='growing'?' plant symptoms':' garden pest Australia'));}
function idResultHtml({p},i){
  const fits=false;
  return `<div class="id-res${i===0?' top':''}"><div class="pest-hdr"><span class="pest-e">${p.e}</span><div><div class="id-lead">${i===0?'Most likely':'Could also be'}</div><div class="pest-n">${p.n}</div></div></div>
    <div class="id-what">${p.what}</div>
    ${weatherBoost(p)>=3?'<div class="pest-txt id-wx">🌦️ Your recent weather makes this more likely.</div>':''}
    <div class="pest-txt"><b>How to tell:</b> ${p.look}</div>
    ${remedyHtml(p)}
    ${fits?`<div class="pest-txt id-warn">It doesn't usually affect ${plantName(_idPlant)}, so compare the photos.</div>`:''}
    <div class="id-btns"><a class="id-photos" href="${photosUrl(p)}" target="_blank" rel="noopener" onclick="return openLink(event,this)">📷 See photos ↗</a>${plantedCells().length?`<button class="task-btn" onclick="openPestReport('${p.id}',${_idPlant?`'${_idPlant}'`:'null'})">✓ That's it — add a job</button>`:''}</div></div>`;
}
function identifyHtml(){
  const matches=idMatches(),mine=[...new Set(plantedCells().map(x=>x.cell.p))].filter(k=>P[k]);
  const q=_idQ.trim().toLowerCase(),found=q?Object.keys(P).filter(k=>plantName(k).toLowerCase().includes(q)&&!mine.includes(k)).slice(0,12):[];
  const syms=idSymptoms(),areaLbl=(AREAS.find(x=>x[0]===_idArea)||[])[2];
  const others=[..._idSel].map(s=>SYM_BY_ID[s]).filter(s=>!s.a.includes(_idArea));
  const chip=k=>`<button class="sym${_idPlant===k?' on':''}" onclick="idPlant('${k}')">${P[k].e} ${P[k].n}</button>`;
  return `<div class="id-step"><span class="id-num">1</span> Where’s the problem?</div>
    <div class="area-grid">${AREAS.map(([a,e,l])=>`<button class="area${_idArea===a?' on':''}" onclick="idArea('${a}')"><span>${e}</span>${l}</button>`).join('')}</div>
    ${_idArea?`<div class="id-step"><span class="id-num">2</span> Which plant?</div>
      ${mine.length?`<div class="sym-wrap">${mine.map(chip).join('')}</div>`:''}
      <input class="pick-search" id="id-q" type="search" placeholder="🔍 ${mine.length?'Another plant…':'Type the plant’s name…'}" autocomplete="off" value="${esc(_idQ)}" oninput="_idQ=this.value;renderPests();setTimeout(()=>{const e=$('id-q');if(e){e.focus();e.setSelectionRange(e.value.length,e.value.length);}},0)">
      ${found.length?`<div class="sym-wrap">${found.map(chip).join('')}</div>`:q?'<div class="set-txt">No plant by that name — try another spelling.</div>':''}`:''}
    ${_idArea&&_idPlant?`<div class="id-step" id="id-step3"><span class="id-num">3</span> What can you see on the ${esc(plantName(_idPlant).toLowerCase())}? <span class="hlog-d">tap all that fit</span></div>
      ${syms.length?`<div class="sym-wrap">${syms.map(s=>`<button class="sym${_idSel.has(s.id)?' on':''}" onclick="idToggle('${s.id}')">${s.e} ${symText(s)}</button>`).join('')}</div>`
        :`<div class="set-txt">Nothing in our guide for ${esc(plantName(_idPlant).toLowerCase())} under “${areaLbl}”. Try another area above, or <button class="link-btn" onclick="openFeedback()">tell us what you’re seeing</button>.</div>`}`:''}
    ${others.length?`<div class="id-picked"><span class="hlog-d">Also ticked:</span> ${others.map(s=>`<button class="sym on mini" onclick="idToggle('${s.id}')">${s.e} ${symText(s)} ✕</button>`).join('')}</div>`:''}
    ${_idSel.size||_idPlant||_idArea?'<button class="link-btn" onclick="idClear()">Start again</button>':''}
    ${matches.length?`<button class="id-bar" onclick="$('id-results').scrollIntoView({behavior:'smooth',block:'start'})">See ${matches.length===1?'the likely answer':`${matches.length} likely answers`} ↓</button>`:''}
    <div id="id-results">${matches.length?matches.map(idResultHtml).join(''):_idSel.size?`<div class="set-txt">Nothing in the guide matches that for ${esc(plantName(_idPlant).toLowerCase())} — try fewer signs, or <button class="link-btn" onclick="openFeedback()">tell us about it</button>.</div>`:_idPlant&&!_idArea?`<div class="set-txt">Looking at your ${esc(plantName(_idPlant).toLowerCase())} — where’s the problem?</div>`:''}</div>`;
}
function thisMonthHtml(m){
  const guards=maint()==='std'?guardItems(m):[],watch=pestsToWatch(m);
  return `${guards.length?`<div class="mv-st">🛡️ Prevent now</div><div class="pm-list">${guards.map(g=>`<div class="pm-row"><span class="pm-e">${g.icon}</span><div><b>${g.title.replace(/^\S+ /,'')}</b><div class="pm-d">${g.detail}</div></div></div>`).join('')}<button class="link-btn" onclick="setView('jobs')">Tick these off in Jobs ›</button></div>`:''}
    ${watch.length?`<div class="mv-st"${guards.length?' style="margin-top:14px"':''}>👀 Watch out for in ${MONTHS[m]}</div><div class="pest-guide">${watch.map(p=>`<details class="pg" id="pw-${p.id}"><summary><span>${p.e} ${p.n}${pestPeak(p,m)?' <span class="peak-tag">peak</span>':''}</span><span class="hlog-d">${plantList(pestCells(p),2)}</span></summary><div class="pg-body"><div class="id-what">${p.what}</div><div class="pest-txt"><b>Look for:</b> ${p.look}</div><div class="pest-txt"><b>Prevent:</b> ${p.prevent}</div></div></details>`).join('')}</div>`
      :'<div class="set-txt">Nothing to watch for on your current plants this month. 🎉</div>'}`;
}
function guideHtml(m){
  const row=p=>`<details class="pg" id="pg-${p.id}"><summary><span>${p.e} ${p.n}</span><span class="${p.months&&pestActive(p,m)?'now-tag':'hlog-d'}">${p.months?(pestActive(p,m)?'active now':monthsText(zoneMonthsOut(p.months))):''}</span></summary>
    <div class="pg-body"><div class="id-what">${p.what}</div>${p.months?`<div class="pest-txt"><b>When:</b> ${monthsText(zoneMonthsOut(p.months))}${p.peak?` · worst ${monthsText(zoneMonthsOut(p.peak))}`:''}</div>`:''}<div class="pest-txt"><b>Signs:</b> ${p.signs.map(s=>SYM_BY_ID[s].t.toLowerCase()).join(' · ')}</div><div class="pest-txt"><b>Look for:</b> ${p.look}</div>${remedyHtml(p)}<div class="pest-txt"><b>Prevent:</b> ${p.prevent}</div><a class="id-photos" href="${photosUrl(p)}" target="_blank" rel="noopener" onclick="return openLink(event,this)">📷 See photos ↗</a></div></details>`;
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
  const m=curMonth(),g=maint()==='std'?guardItems(m).length:0;
  const tabs=[['id','🔍 Identify'],['month',`📅 This month${g?` · ${g}`:''}`],['guide','📖 Guide']];
  keepOpen($('pests-content'),()=>$('pests-content').innerHTML=`<div class="mv-heading">Pests & problems</div>
    <div class="seg">${tabs.map(([t,l])=>`<button class="seg-b${_pTab===t?' on':''}" onclick="pTab('${t}')">${l}</button>`).join('')}</div>
    <div class="mv-section">${_pTab==='id'?identifyHtml():_pTab==='month'?thisMonthHtml(m):guideHtml(m)}</div>`);
  saveUI();
}
