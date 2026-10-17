// Garden data: plant library, categories, seasonal stories, timing. A fresh install has no beds.
'use strict';
const P={
  'broad-beans':   {e:'🫘',n:'Broad Beans',    h:'Oct–Nov',   nx:'tomatoes',       tip:'Stake rows at 30cm. Fixes nitrogen — great handoff for next crop.',                          idea:'Blanch fresh pods for 2 minutes, butter generously and season with sea salt. Freeze a batch for winter soups. Eat them within hours of picking.'},
  'peas':          {e:'🫛',n:'Peas',            h:'Aug–Oct',   nx:'beans',          tip:'Pick every 2 days — pods left on the vine tell the plant to stop. Most need a trellis.',            idea:'Eat straight off the vine first — that sweetness is incomparable. The rest: a quick stir-fry with garlic and ginger, or tossed raw into salads.'},
  'kale':          {e:'🥬',n:'Kale',            h:'Jul → on',  nx:null,             tip:'Pick the lower outer leaves only. It will run for months if you keep picking.',                     idea:'Massage leaves with olive oil, lemon and salt for a winter salad that holds up. Or roast leaves at high heat until crispy — genuinely surprising as a snack.'},
  'chard':         {e:'🌈',n:'Silverbeet & chard', h:'Jul → on', nx:null,           tip:'Twist off outer stems and it keeps producing for months. The most forgiving leafy green.',           idea:'Sauté the stems first, then add the leaves with garlic and olive oil. Piled onto toast with a fried egg, this is a perfect meal.'},
  'lettuce':       {e:'🥗',n:'Lettuce',         h:'Jun–Oct',   nx:'basil',          tip:'Bolts once the weather warms. Loose-leaf types can be picked for weeks; heading types are cut once.', idea:'Homegrown Caesar — tear leaves, add anchovies, parmesan and a proper dressing. You will never want bagged lettuce again.'},
  'spinach':       {e:'🍃',n:'Spinach',         h:'Jun–Oct',   nx:'basil',          tip:'English spinach bolts in heat — grow it in the cool months, and Warrigal greens or Malabar spinach for summer.',                                             idea:'Wilt briefly with garlic for pasta, or use raw in salads while it lasts. Freeze excess in batches for winter smoothies.'},
  'asian-greens':  {e:'🥬',n:'Asian Greens',   h:'Jul–Oct',   nx:'basil',          tip:'Fast growing in cool weather. Bok choy, pak choy, mizuna.',                                    idea:'Quick stir-fry with oyster sauce and a little sesame oil. Ready in 3 minutes. The freshness is the whole point.'},
  'cabbage':       {e:'🥬',n:'Cabbage',         h:'Jul–Nov',   nx:'capsicum',       tip:'Needs 40cm of space. Harvest when the head feels solid and firm.',                                  idea:'Pickle it — red cabbage pickles in 24 hours and lasts months. Or shred finely into a crunchy slaw.'},
  'broccoli':      {e:'🥦',n:'Broccoli',       h:'Jul–Sept',  nx:null,             tip:'Cut the main head, then wait for side shoots for weeks more harvest.',                         idea:'Roast in a hot oven with olive oil and garlic until the edges char. That bitterness and char is the best version of broccoli.'},
  'cauliflower':   {e:'🥦',n:'Cauliflower',    h:'Aug–Oct',   nx:null,             tip:'Needs consistent water and nutrients. One big head per plant.',                                idea:'Whole roasted cauliflower with tahini and herbs makes a proper centrepiece. Worth the growing time.'},
  'coriander':     {e:'🌿',n:'Coriander',      h:'Aug–Oct',   nx:'basil',          tip:'Harvest before flowers open — flavour goes bitter fast once it bolts.',                        idea:'Blitz with lime juice, garlic, chilli and olive oil for a salsa verde that lifts any grilled meat or fish. Use it this week.'},
  'parsley':       {e:'🌱',n:'Parsley',         h:'Aug → on',  nx:null,             tip:'Pick outer stems often. Flavour drops once it flowers — harvest hard before it bolts.',                       idea:'Make a batch of gremolata — parsley, lemon zest, garlic. Keeps a week in the fridge and lifts everything from roasted veg to grilled fish.'},
  'garlic-chives': {e:'🌾',n:'Garlic Chives',  h:'Aug → on',  nx:null,             tip:'Perennial. Trim regularly to keep productive.',                                                idea:'Chop into scrambled eggs, fold into dumplings, or finish a soup. Milder than regular chives with a gentle garlic note.'},
  'bok-choy':      {e:'🥬',n:'Bok Choy',       h:'Sept–Oct',  nx:'basil',          tip:'When it starts to bolt, pull it out.',                                                          idea:'Halve and char in a screaming hot pan with sesame oil and soy. Two minutes. Done.'},
  'marigold':      {e:'🌼',n:'Marigolds',      h:'Companion', nx:null,             tip:'Repels aphids, attracts beneficial insects. Leave them all season.',                           idea:'Scatter petals on salads for colour. Mostly here for the garden — keeping aphids off everything else.'},
  'beetroot':      {e:'🟣',n:'Beetroot',       h:'Sept–Oct',  nx:'capsicum',       tip:'Consistent water = no woody beet. Pull when golf-ball to tennis-ball size.',                                      idea:'Roast whole in foil for an hour, slip the skins, slice with goat\'s cheese and walnuts. Or pickle — they last months and go with everything.'},
  'carrots':       {e:'🥕',n:'Carrots',        h:'Oct–Nov',   nx:null,             tip:'Slow grower. Don\'t disturb. Inconsistent water = forked roots.',                              idea:'Roast with honey and thyme. Homegrown carrots have a sweetness supermarket ones never match. Or grate into a carrot cake that\'ll be worth every week they took.'},
  'turnip':        {e:'⬜',n:'Turnip',         h:'Aug–Oct',   nx:null,             tip:'Fast crop — 6–8 weeks.',                                                                        idea:'Roast with butter and thyme, or add to a winter soup. Often underrated — properly grown, they are genuinely delicious.'},
  'potato':        {e:'🥔',n:'Potato',         h:'Nov–Dec',   nx:'basil',          tip:'Plant Jul–Aug. Mound soil up as stems grow.',                                                   idea:'New potatoes need nothing but butter and salt. Boil fresh from the ground and you will understand why people grow them.'},
  'onions':        {e:'🧅',n:'Onion Sets',     h:'Dec–Jan',   nx:null,             tip:'Harvest when tops fall over naturally. Don\'t rush.',                                           idea:'Cure in a cool dry spot for a week after lifting. They will last months in a net bag and form the base of almost every dish you cook.'},
  'shallots':      {e:'🧅',n:'Shallot Sets',   h:'Nov–Dec',   nx:null,             tip:'Lift when foliage yellows. Cure in a dry shed for a few days.',                                idea:'Finely slice into vinaigrettes and dressings. Or roast whole alongside a chicken. Far more complex flavour than onions.'},
  'spring-onions': {e:'🌿',n:'Spring Onions',  h:'Sept',      nx:null,             tip:'Quick crop.',                                                                                   idea:'Slice into everything raw — noodle dishes, scrambled eggs, salads. Eat them while young and fresh.'},
  'leek':          {e:'🧅',n:'Leek',           h:'Jun–Aug',   nx:null,             tip:'Long growing season. Start in March for June harvest.',                                         idea:'Braised leeks with white wine and butter. Or a proper winter potato and leek soup. They reward the patience.'},
  'garlic':        {e:'🧄',n:'Garlic',         h:'Nov–Dec',   nx:null,             tip:'Plant cloves around Anzac Day (April). Lift when half the leaves have browned.',                                                       idea:'Cure for 2 weeks after lifting. Roast a whole head in olive oil and spread on crusty bread. You will have garlic for months.'},
  'radish':        {e:'🔴',n:'Radish',         h:'Every 4wks',nx:'beans',    tip:'Resow every 3–4 weeks for continuous quick harvests.',                                          idea:'Eat immediately — thinly sliced on good butter and bread. The freshness is the whole point.'},
  'strawberry':    {e:'🍓',n:'Strawberry',     h:'Oct–Dec',   nx:null,             tip:'Keep mulched. Net against birds.',                                                              idea:'Eat in the garden, still warm. Macerate with a little sugar and pile onto yoghurt. Don\'t make jam until you have too many to eat fresh.'},
  'tomatoes':      {e:'🍅',n:'Tomato',          h:'Dec–Mar',   nx:null,             tip:'Plant from mid-Sept. Cherry types are the most reliable first tomato; most need staking.',            idea:'Let them ripen fully on the vine. A rough sauce — tomatoes, garlic, basil, olive oil, nothing else. Freeze batches for winter.'},
  'basil':         {e:'🌿',n:'Basil',          h:'Nov+',      nx:null,             tip:'Great follow-on for bolted cool-season herbs. Pinch out flowers to keep leaves going.',                               idea:'Make pesto while you have it in abundance — freeze in ice cube trays and you will have summer in the middle of July. Or simply tear over tomatoes with good olive oil and salt flakes.'},
  'zucchini':      {e:'🥒',n:'Zucchini',       h:'Dec+',      nx:null,             tip:'One plant is plenty. Wait for warm nights — late October in the Hills.',                                            idea:'Pick at 15–20cm for the best flavour. Slice thinly with lemon and mint for a raw salad, or roast halved with parmesan. Once it gets huge, stuff and bake it.'},
  'cucumber':      {e:'🥒',n:'Cucumber',       h:'Dec+',      nx:null,             tip:'Late Sept earliest. Needs something to climb.',                                                 idea:'Thinly sliced with yoghurt, mint and garlic — tzatziki. Or smash roughly and dress with sesame and rice vinegar.'},
  'capsicum':      {e:'🫑',n:'Capsicum',       h:'Jan+',      nx:null,             tip:'Oct planting gives Dec/Jan fruit. Slow starter but worth it.',                                 idea:'Roast whole over a flame until charred. Let steam in a bag, peel and dress with olive oil and garlic. One of the best things you can do in a kitchen.'},
  'eggplant':      {e:'🍆',n:'Eggplant',       h:'Jan+',      nx:null,             tip:'Low-growing. Loves heat.',                                                                      idea:'Char directly over a gas flame until collapsed — the smoky flesh becomes baba ganoush with tahini, lemon and garlic.'},
  'beans':         {e:'🫘',n:'Beans',           h:'Dec–Mar',   nx:null,             tip:'Sow once the soil has warmed. Bush types need no support; climbing types need a 2m trellis.',       idea:'Pick young and often. Blanch and toss with butter and almonds, or garlic, chilli and soy.'},
  'sweet-corn':    {e:'🌽',n:'Sweet Corn',     h:'Jan–Feb',   nx:null,             tip:'Plant in blocks of 4x4 for good pollination.',                                                  idea:'Eat the day it\'s picked — sugars convert to starch within hours. Grill in husks over coals for something properly good.'},
  'pumpkin':       {e:'🎃',n:'Pumpkin',        h:'Feb–Apr',   nx:null,             tip:'Needs 2m+ spread. Plant Nov–Dec.',                                                              idea:'Roast with brown butter and sage. Cure for 2 weeks after picking to intensify the flavour.'},
  'chilli':        {e:'🌶️',n:'Chilli',         h:'Jan–Mar',   nx:null,             tip:'Treat like capsicum. Loves heat.',                                                              idea:'Dry a batch — hang in a sunny spot. Make your own chilli flakes. Or ferment into a hot sauce that lasts all year.'},
  'sweet-potato':  {e:'🍠',n:'Sweet Potato',   h:'Mar–May',   nx:null,             tip:'Needs a full summer. Plant Oct–Nov.',                                                           idea:'Roast whole until the skin crisps and the inside caramelises. Eat with butter and salt. No recipe needed.'},
  'thyme':         {e:'🌿',n:'Thyme',          h:'Year-round',nx:null,             tip:'Perennial. Drought-tolerant. Thrives in the Hills.',                                            idea:'Add a bunch to roasting vegetables and meat. Strip leaves and mix into compound butter. It never really runs out.'},
  'rosemary':      {e:'🌿',n:'Rosemary',       h:'Year-round',nx:null,             tip:'Perennial shrub. Very low water once established.',                                             idea:'Infuse in olive oil for a week. Use to roast potatoes, focaccia, lamb. Keeps in the pantry for months.'},
  'sage':          {e:'🌿',n:'Sage',           h:'Year-round',nx:null,             tip:'Perennial. Great in the Hills. Repels some pests.',                                             idea:'Fry leaves in brown butter until crisp — pour over gnocchi, pumpkin or anything rich and starchy.'},
  'mint':          {e:'🌿',n:'Mint',           h:'Year-round',nx:null,             tip:'KEEP IN A POT — it will take over your beds.',                                                  idea:'Muddle into drinks, chop into salads, steep for tea. Mint is endlessly useful. Keep it contained and it produces all year.'},
  'oregano':       {e:'🌿',n:'Oregano',        h:'Year-round',nx:null,             tip:'Very hardy. Thrives on neglect.',                                                               idea:'Dry a bunch in summer for the fullest flavour. Crumble over pizza, pasta, roasted vegetables.'},
  'dill':          {e:'🌿',n:'Dill',           h:'Cool season',nx:null,            tip:'Attracts beneficial insects. Bolts in heat.',                                                   idea:'Chop into yoghurt dressings, scatter over smoked salmon, mix into potato salad. Use fresh — it loses character when dried.'},
  'lemongrass':    {e:'🌾',n:'Lemongrass',     h:'Year-round',nx:null,             tip:'Grows 1m+. Keep watered in summer.',                                                            idea:'Bruise the stalk and add to curries, soups and broths. Make a tea. Freeze extra stalks for later.'},
  'chives':        {e:'🌾',n:'Chives',         h:'Year-round',nx:null,             tip:'Perennial. Regular cutting keeps them productive.',                                             idea:'Snip into scrambled eggs, soups, dressings. One of the most useful everyday herbs you can grow.'},
  'calendula':     {e:'🌸',n:'Calendula',      h:'Companion', nx:null,             tip:'Attracts pollinators. Edible flowers.',                                                         idea:'Scatter petals on salads. Steep in oil for a skin balm. Mostly here for the garden\'s benefit.'},
  'nasturtium':    {e:'🌺',n:'Nasturtium',     h:'Companion', nx:null,             tip:'Trap crop for aphids. Flowers and leaves are edible.',                                          idea:'The peppery flowers and leaves are brilliant in salads. The seed pods can be pickled like capers.'},
  'borage':        {e:'💙',n:'Borage',         h:'Companion', nx:null,             tip:'Attracts bees. Self-sows freely.',                                                              idea:'Float the blue flowers in drinks for something visually stunning. The leaves taste like cucumber — add to salads.'},
};
const COOL_VEG=['broad-beans','peas','kale','chard','lettuce','spinach','asian-greens','cabbage','broccoli','cauliflower','coriander','parsley','garlic-chives','bok-choy','beetroot','carrots','turnip','potato','onions','shallots','spring-onions','leek','garlic','beans','radish','strawberry'];
const WARM_VEG=['tomatoes','basil','zucchini','cucumber','capsicum','eggplant','beans','sweet-corn','pumpkin','chilli','sweet-potato'];
const HERBS=['thyme','rosemary','sage','mint','oregano','dill','lemongrass','chives'];
const COMPANIONS=['marigold','calendula','nasturtium','borage'];

const STORIES={
  9:[
    {id:'oct-christmas',badge:'PLANT NOW',badgeType:'plant',emoji:'🍅 🌿 🥒',
     title:'Your Christmas dinner starts this week',
     story:'Get cherry tomatoes, basil and one zucchini plant in the ground this week. In 10–12 weeks they will all be producing at once — everything you need for a backyard pasta sauce that makes the whole season worthwhile.',
     harvest:'🍝 Roast cherry tomatoes with garlic until they burst. Toss through pasta with torn fresh basil and sautéed zucchini. That\'s the dish the garden was built for.',
     checkBeds:['tomatoes'],
     trackTitle:'The Christmas trio is in 🎄',
     trackStory:'Cherry tomatoes, basil and zucchini are all on their way. In 10–12 weeks you will have more produce than you can eat at once. Think pasta sauce, bruschetta, and a ratatouille that\'ll make the whole garden worthwhile.',
    },
    {id:'oct-coolseason',badge:'ENJOY NOW',badgeType:'harvest',emoji:'🫛 🫘',
     title:'Cool season\'s last few weeks',
     story:'Snow peas and broad beans are in their best weeks — pick snow peas every two days and eat them before they even make it inside. When the broad beans are done and pulled, those nitrogen-fixing roots quietly prepare the soil for summer. This is what the whole winter was for.',
     harvest:'🧈 Broad beans blanched for 2 minutes, butter, sea salt. Snow peas raw, straight from the vine. Simple is exactly right here.',
     checkBeds:['peas','broad-beans'],
     trackTitle:'Cool season\'s last hurrah 🫛',
     trackStory:'Snow peas and broad beans are in their prime. Pick peas every 2 days. When the beans are done and pulled, the soil is already prepared for summer. This is what the whole winter was for.',
    }
  ],
  10:[
    {id:'nov-summer',badge:'BUILDING NOW',badgeType:'track',emoji:'🍅 🫑 🥒',
     title:'The summer harvest is taking shape',
     story:'If tomatoes, capsicum and zucchini are in the ground and growing, December is going to reward you properly. Keep watering consistently and feed tomatoes weekly — they are hungry plants.',
     harvest:'🫑 Char capsicum over a flame, peel and dress with olive oil and garlic alongside fresh tomatoes. One of the best things you can eat in a Perth summer.',
     checkBeds:['tomatoes','capsicum'],
     trackTitle:'Summer is building nicely 🌞',
     trackStory:'Your summer crops are establishing. The December harvest is coming — keep the water up and the tomatoes and capsicum will reward every week of waiting.',
    }
  ],
  11:[
    {id:'dec-peak',badge:'PEAK SEASON',badgeType:'harvest',emoji:'🍅 🥒 🫘',
     title:'This is what all the work was for',
     story:'Tomatoes, zucchini and beans producing at once — eat fresh every day. Make a big batch of passata to freeze and you will have summer in the middle of July.',
     harvest:'🍅 Fill a big pot with cherry tomatoes, garlic and olive oil. Simmer down, blend, bottle. Freeze in portions — that\'s a year\'s worth of pasta sauce from one afternoon.',
     checkBeds:['tomatoes'],
     trackTitle:'Peak season — enjoy it 🌟',
     trackStory:'Everything is producing at once. Eat fresh daily. Make passata. Freeze what you can\'t use. This is the whole point.',
    }
  ]
};

// A fresh install starts with no beds; the user adds their own.
const DEFAULT={v:5,beds:[]};

// Perth Hills timing, used for year-round tasks and expected harvest dates.
//   sow:  months it can go in (0 = Jan)
//   days: typical days from sowing seed to first harvest (seedlings are ~3 weeks quicker)
//   pick: keeps producing after the first harvest (pick some, don't pull)
const ALL_YEAR=[0,1,2,3,4,5,6,7,8,9,10,11];
const TIMING={
  'broad-beans':   {sow:[2,3,4,5],days:120,pick:true},
  'peas':          {sow:[2,3,4,5,6],days:70,pick:true},
  'kale':          {sow:[1,2,3,4,5,6],days:60,pick:true},
  'chard':    {sow:[1,2,3,4,5,6,7,8,9],days:60,pick:true},
  'lettuce':   {sow:[2,3,4,5,6,7,8],days:60,pick:true},
  'spinach':       {sow:[2,3,4,5,6],days:45,pick:true},
  'asian-greens':  {sow:[2,3,4,5,6,7],days:40},
  'cabbage':       {sow:[1,2,3,4],days:120},
  'broccoli':      {sow:[1,2,3,4],days:90,pick:true},
  'cauliflower':   {sow:[1,2,3],days:130},
  'coriander':     {sow:[2,3,4,5,6],days:45,pick:true},
  'parsley':       {sow:[1,2,3,4,7,8,9],days:70,pick:true},
  'garlic-chives': {sow:[8,9,10],days:90,pick:true},
  'bok-choy':      {sow:[2,3,4,5,6,7],days:45},
  'beetroot':      {sow:[1,2,3,4,5,6,7,8,9],days:70},
  'carrots':       {sow:[1,2,3,4,5,6,7,8,9],days:100},
  'turnip':        {sow:[2,3,4,5],days:50},
  'potato':        {sow:[6,7,8],days:110},
  'onions':        {sow:[3,4,5],days:180},
  'shallots':      {sow:[3,4,5,6],days:150},
  'spring-onions': {sow:ALL_YEAR,days:60},
  'leek':          {sow:[2,3,9,10],days:140},
  'garlic':        {sow:[3,4],days:210},
  'radish':        {sow:ALL_YEAR,days:28},
  'strawberry':    {sow:[3,4,5],days:180,pick:true},
  'tomatoes':      {sow:[8,9,10,11],days:80,pick:true},
  'basil':         {sow:[8,9,10,11,0],days:40,pick:true},
  'zucchini':      {sow:[9,10,11,0],days:55,pick:true},
  'cucumber':      {sow:[8,9,10,11,0],days:60,pick:true},
  'capsicum':      {sow:[8,9,10],days:90,pick:true},
  'eggplant':      {sow:[8,9,10],days:100,pick:true},
  'beans':         {sow:[8,9,10,11,0,1],days:65,pick:true},
  'sweet-corn':    {sow:[8,9,10,11],days:85},
  'pumpkin':       {sow:[9,10,11],days:110},
  'chilli':        {sow:[8,9,10],days:90,pick:true},
  'sweet-potato':  {sow:[9,10],days:140},
  'thyme':         {sow:[2,3,8,9],days:90,pick:true},
  'rosemary':      {sow:[2,3,8,9],days:120,pick:true},
  'sage':          {sow:[2,3,8,9],days:90,pick:true},
  'mint':          {sow:ALL_YEAR,days:60,pick:true},
  'oregano':       {sow:[2,3,8,9],days:80,pick:true},
  'dill':          {sow:[2,3,4,7,8],days:50,pick:true},
  'lemongrass':    {sow:[8,9,10],days:100,pick:true},
  'chives':        {sow:[1,2,3,8,9,10],days:70,pick:true},
  'marigold':      {sow:[8,9,10,11,0,1,2],days:60,pick:true},
  'calendula':     {sow:[2,3,4,5,6,7],days:60,pick:true},
  'nasturtium':    {sow:[2,3,4,7,8,9],days:60,pick:true},
  'borage':        {sow:[2,3,8,9],days:60,pick:true},
};

// Plant families and heights, for bed-aware suggestions
const FAMILY={
  legume:['broad-beans','peas','beans'],
  brassica:['kale','cabbage','broccoli','cauliflower','bok-choy','asian-greens','turnip','radish'],
  leafy:['chard','lettuce','spinach'],
  allium:['onions','shallots','spring-onions','leek','garlic','garlic-chives','chives'],
  root:['beetroot','carrots','potato','sweet-potato'],
  nightshade:['tomatoes','capsicum','eggplant','chilli'],
  cucurbit:['zucchini','cucumber','pumpkin'],
};
const FAM_LBL={legume:'beans & peas',brassica:'brassicas',leafy:'leafy greens',allium:'alliums',root:'root crops',nightshade:'tomato family',cucurbit:'cucurbits'};
const TALL=['beans','sweet-corn','tomatoes','cucumber','broad-beans','peas','lemongrass'];

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const STATUSES=['seed','seedling','growing','ready','bolting','done'];
const STATUS_LBL={seed:'Seed',seedling:'Seedling',growing:'Growing',ready:'Ready',bolting:'Bolting!',done:'Done'};
const STLBL={seed:'🌱 Seed',seedling:'🪴 Seedling',growing:'🌿 Growing',ready:'✨ Ready',bolting:'⚠️ Bolting',done:'✅ Done',empty:'▫️ Empty'};
const NP_EMOJI=['🌱','🌿','🥬','🥕','🍅','🫑','🌶️','🥒','🫘','🧅','🥔','🌽','🍓','🍉','🌸','🌻'];


// How many plants fit in one spot, for a 30cm square spot (square-foot gardening counts).
// Plants that need more than one spot are in SPOTS (behaviour.js) and count as 1 per their area.
const PER_SPOT={
  'broad-beans':4,'peas':8,'kale':1,'chard':4,'lettuce':4,'spinach':9,'asian-greens':4,'cabbage':1,'broccoli':1,'cauliflower':1,
  'coriander':4,'parsley':4,'garlic-chives':4,'bok-choy':4,'marigold':4,'beetroot':9,'carrots':16,'turnip':9,'potato':1,'onions':9,
  'shallots':4,'spring-onions':16,'leek':9,'garlic':9,'radish':16,'strawberry':1,'tomatoes':1,'basil':2,'zucchini':1,'cucumber':2,
  'capsicum':1,'eggplant':1,'beans':9,'sweet-corn':4,'pumpkin':1,'chilli':1,'sweet-potato':1,'thyme':2,'rosemary':1,'sage':1,
  'mint':1,'oregano':1,'dill':1,'lemongrass':1,'chives':4,'calendula':1,'nasturtium':1,'borage':1,
};
