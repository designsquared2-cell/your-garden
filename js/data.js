// Garden data: plant library, categories, seasonal stories, hand-written tasks and the starting layout.
'use strict';
const P={
  'broad-beans':   {e:'🫘',n:'Broad Beans',    h:'Oct–Nov',   nx:'tomatoes',       tip:'Stake rows at 30cm. Fixes nitrogen — great handoff for next crop.',                          idea:'Blanch fresh pods for 2 minutes, butter generously and season with sea salt. Freeze a batch for winter soups. Eat them within hours of picking.'},
  'snow-peas':     {e:'🫛',n:'Snow Peas',      h:'Sept–Oct',  nx:'climbing-beans', tip:'Pick every 2 days. Leaving pods on the vine stops production entirely.',                       idea:'Eat straight off the vine first — that sweetness is incomparable. The rest: a quick stir-fry with garlic and ginger, or tossed raw into salads.'},
  'garden-peas':   {e:'🫛',n:'Garden Peas',    h:'Sept–Oct',  nx:null,             tip:'Shell peas need more water than snow peas. Pick pods when full and round.',                    idea:'Shell and boil briefly, eat with butter and salt. This is why people grow vegetables.'},
  'kale':          {e:'🥬',n:'Tuscan Kale',    h:'Sept → on', nx:null,             tip:'Outer leaves only. Will run for months if you keep picking.',                                  idea:'Massage leaves with olive oil, lemon and salt for a winter salad that holds up. Or roast leaves at high heat until crispy — genuinely surprising as a snack.'},
  'silverbeet':    {e:'🥬',n:'Silverbeet',     h:'Jul → on',  nx:null,             tip:'Tougher than chard in heat. Classic cut-and-come-again.',                                      idea:'Sauté with garlic and olive oil, finish with lemon. Piled onto toast with a fried egg, this is a perfect meal.'},
  'rainbow-chard': {e:'🌈',n:'Rainbow Chard',  h:'Aug → on',  nx:null,             tip:'Cut outer leaves and it keeps producing. The beds workhorse.',                                 idea:'Sauté the coloured stems first, then add leaves. The stems hold up beautifully alongside eggs, pasta, or anything that needs a vegetable.'},
  'cos-lettuce':   {e:'🥗',n:'Cos Lettuce',    h:'Aug–Sept',  nx:'basil',          tip:'Will bolt in Oct heat. Harvest everything you can and swap for basil.',                        idea:'Homegrown Caesar — tear leaves, add anchovies, parmesan and a proper dressing. You will never want bagged lettuce again.'},
  'spinach':       {e:'🍃',n:'English Spinach', h:'Aug–Sept',  nx:'basil',          tip:'Bolt-prone in heat. Harvest everything this week.',                                             idea:'Wilt briefly with garlic for pasta, or use raw in salads while it lasts. Freeze excess in batches for winter smoothies.'},
  'asian-greens':  {e:'🥬',n:'Asian Greens',   h:'Jul–Oct',   nx:'basil',          tip:'Fast growing in cool weather. Bok choy, pak choy, mizuna.',                                    idea:'Quick stir-fry with oyster sauce and a little sesame oil. Ready in 3 minutes. The freshness is the whole point.'},
  'red-cabbage':   {e:'🫐',n:'Red Cabbage',    h:'Oct–Nov',   nx:'capsicum',       tip:'Needs 40cm space. Harvest when the head feels solid and firm.',                                idea:'Pickle it. Red cabbage pickles in 24 hours and lasts months in the fridge — brilliant alongside almost everything.'},
  'broccoli':      {e:'🥦',n:'Broccoli',       h:'Jul–Sept',  nx:null,             tip:'Cut the main head, then wait for side shoots for weeks more harvest.',                         idea:'Roast in a hot oven with olive oil and garlic until the edges char. That bitterness and char is the best version of broccoli.'},
  'cauliflower':   {e:'🥦',n:'Cauliflower',    h:'Aug–Oct',   nx:null,             tip:'Needs consistent water and nutrients. One big head per plant.',                                idea:'Whole roasted cauliflower with tahini and herbs makes a proper centrepiece. Worth the growing time.'},
  'coriander':     {e:'🌿',n:'Coriander',      h:'Aug–Oct',   nx:'basil',          tip:'Harvest before flowers open — flavour goes bitter fast once it bolts.',                        idea:'Blitz with lime juice, garlic, chilli and olive oil for a salsa verde that lifts any grilled meat or fish. Use it this week.'},
  'parsley':       {e:'🌱',n:'Parsley',         h:'Aug → on',  nx:null,             tip:'Strip what you want now. Bolting soon — flavour drops when it flowers.',                       idea:'Make a batch of gremolata — parsley, lemon zest, garlic. Keeps a week in the fridge and lifts everything from roasted veg to grilled fish.'},
  'garlic-chives': {e:'🌾',n:'Garlic Chives',  h:'Aug → on',  nx:null,             tip:'Perennial. Trim regularly to keep productive.',                                                idea:'Chop into scrambled eggs, fold into dumplings, or finish a soup. Milder than regular chives with a gentle garlic note.'},
  'bok-choy':      {e:'🥬',n:'Bok Choy',       h:'Sept–Oct',  nx:'basil',          tip:'When it starts to bolt, pull it out.',                                                          idea:'Halve and char in a screaming hot pan with sesame oil and soy. Two minutes. Done.'},
  'marigold':      {e:'🌼',n:'Marigolds',      h:'Companion', nx:null,             tip:'Repels aphids, attracts beneficial insects. Leave them all season.',                           idea:'Scatter petals on salads for colour. Mostly here for the garden — keeping aphids off everything else.'},
  'beetroot':      {e:'🟣',n:'Beetroot',       h:'Sept–Oct',  nx:'capsicum',       tip:'Needs 6–8 more weeks. Consistent water = no woody beet.',                                      idea:'Roast whole in foil for an hour, slip the skins, slice with goat\'s cheese and walnuts. Or pickle — they last months and go with everything.'},
  'carrots':       {e:'🥕',n:'Carrots',        h:'Oct–Nov',   nx:null,             tip:'Slow grower. Don\'t disturb. Inconsistent water = forked roots.',                              idea:'Roast with honey and thyme. Homegrown carrots have a sweetness supermarket ones never match. Or grate into a carrot cake that\'ll be worth every week they took.'},
  'turnip':        {e:'⬜',n:'Turnip',         h:'Aug–Oct',   nx:null,             tip:'Fast crop — 6–8 weeks.',                                                                        idea:'Roast with butter and thyme, or add to a winter soup. Often underrated — properly grown, they are genuinely delicious.'},
  'potato':        {e:'🥔',n:'Potato',         h:'Nov–Dec',   nx:'basil',          tip:'Plant Jul–Aug. Mound soil up as stems grow.',                                                   idea:'New potatoes need nothing but butter and salt. Boil fresh from the ground and you will understand why people grow them.'},
  'onions':        {e:'🧅',n:'Onion Sets',     h:'Dec–Jan',   nx:null,             tip:'Harvest when tops fall over naturally. Don\'t rush.',                                           idea:'Cure in a cool dry spot for a week after lifting. They will last months in a net bag and form the base of almost every dish you cook.'},
  'shallots':      {e:'🧅',n:'Shallot Sets',   h:'Nov–Dec',   nx:null,             tip:'Lift when foliage yellows. Cure in a dry shed for a few days.',                                idea:'Finely slice into vinaigrettes and dressings. Or roast whole alongside a chicken. Far more complex flavour than onions.'},
  'spring-onions': {e:'🌿',n:'Spring Onions',  h:'Sept',      nx:null,             tip:'Quick crop.',                                                                                   idea:'Slice into everything raw — noodle dishes, scrambled eggs, salads. Eat them while young and fresh.'},
  'leek':          {e:'🧅',n:'Leek',           h:'Jun–Aug',   nx:null,             tip:'Long growing season. Start in March for June harvest.',                                         idea:'Braised leeks with white wine and butter. Or a proper winter potato and leek soup. They reward the patience.'},
  'garlic':        {e:'🧄',n:'Garlic',         h:'Dec 2027',  nx:null,             tip:'DO NOT PLANT NOW. Anzac Day April 2027.',                                                       idea:'Cure for 2 weeks after lifting. Roast a whole head in olive oil and spread on crusty bread. You will have garlic for months.'},
  'dwarf-beans':   {e:'🫘',n:'Dwarf Beans',    h:'Dec+',      nx:null,             tip:'October is perfect timing. Into the old radish strip.',                                         idea:'Blanch briefly and toss with olive oil, lemon and good salt. Or pickle in a brine for the fridge — brilliant alongside cheese.'},
  'radish':        {e:'🔴',n:'Radish',         h:'Every 4wks',nx:'dwarf-beans',    tip:'Resow every 3–4 weeks for continuous quick harvests.',                                          idea:'Eat immediately — thinly sliced on good butter and bread. The freshness is the whole point.'},
  'strawberry':    {e:'🍓',n:'Strawberry',     h:'Oct–Dec',   nx:null,             tip:'Keep mulched. Net against birds.',                                                              idea:'Eat in the garden, still warm. Macerate with a little sugar and pile onto yoghurt. Don\'t make jam until you have too many to eat fresh.'},
  'tomatoes':      {e:'🍅',n:'Tomatoes',       h:'Dec–Feb',   nx:null,             tip:'Plant mid-Sept. Cherry varieties most reliable for first season.',                              idea:'Let them ripen fully on the vine. A rough sauce — tomatoes, garlic, basil, olive oil, nothing else. Freeze batches for winter.'},
  'cherry-tomato': {e:'🍅',n:'Cherry Tomato',  h:'Dec–Feb',   nx:null,             tip:'Easier and more productive than full-size. Indeterminate — needs staking.',                   idea:'Roast in a tray with olive oil and garlic until they burst and caramelise. Toss through pasta with fresh basil. This is what the season was for.'},
  'basil':         {e:'🌿',n:'Basil',          h:'Nov+',      nx:null,             tip:'Replaces bolted herbs. Pinch out flowers to keep leaves going.',                               idea:'Make pesto while you have it in abundance — freeze in ice cube trays and you will have summer in the middle of July. Or simply tear over tomatoes with good olive oil and salt flakes.'},
  'zucchini':      {e:'🥒',n:'Zucchini',       h:'Dec+',      nx:null,             tip:'ONE plant only. Late Oct in the Hills, not before.',                                            idea:'Pick at 15–20cm for the best flavour. Slice thinly with lemon and mint for a raw salad, or roast halved with parmesan. Once it gets huge, stuff and bake it.'},
  'cucumber':      {e:'🥒',n:'Cucumber',       h:'Dec+',      nx:null,             tip:'Late Sept earliest. Needs something to climb.',                                                 idea:'Thinly sliced with yoghurt, mint and garlic — tzatziki. Or smash roughly and dress with sesame and rice vinegar.'},
  'capsicum':      {e:'🫑',n:'Capsicum',       h:'Jan+',      nx:null,             tip:'Oct planting gives Dec/Jan fruit. Slow starter but worth it.',                                 idea:'Roast whole over a flame until charred. Let steam in a bag, peel and dress with olive oil and garlic. One of the best things you can do in a kitchen.'},
  'eggplant':      {e:'🍆',n:'Eggplant',       h:'Jan+',      nx:null,             tip:'Low-growing. Loves heat.',                                                                      idea:'Char directly over a gas flame until collapsed — the smoky flesh becomes baba ganoush with tahini, lemon and garlic.'},
  'climbing-beans':{e:'🫘',n:'Climbing Beans', h:'Dec+',      nx:null,             tip:'Replace snow peas on the Bed 1 trellis in October.',                                            idea:'Pick young and often. Blanch and toss with butter and almonds. Or char in a hot pan with a little miso butter.'},
  'snake-beans':   {e:'🫘',n:'Snake Beans',    h:'Dec–Feb',   nx:null,             tip:'Very productive in summer heat.',                                                               idea:'Stir-fry with chilli and garlic, or add to a Thai curry. Far more productive than regular beans in the summer heat.'},
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
const COOL_VEG=['broad-beans','snow-peas','garden-peas','kale','silverbeet','rainbow-chard','cos-lettuce','spinach','asian-greens','red-cabbage','broccoli','cauliflower','coriander','parsley','garlic-chives','bok-choy','beetroot','carrots','turnip','potato','onions','shallots','spring-onions','leek','garlic','dwarf-beans','radish','strawberry'];
const WARM_VEG=['tomatoes','cherry-tomato','basil','zucchini','cucumber','capsicum','eggplant','climbing-beans','snake-beans','sweet-corn','pumpkin','chilli','sweet-potato'];
const HERBS=['thyme','rosemary','sage','mint','oregano','dill','lemongrass','chives'];
const COMPANIONS=['marigold','calendula','nasturtium','borage'];

const STORIES={
  9:[
    {id:'oct-christmas',badge:'PLANT NOW',badgeType:'plant',emoji:'🍅 🌿 🥒',
     title:'Your Christmas dinner starts this week',
     story:'Get cherry tomatoes, basil and one zucchini plant in the ground this week. In 10–12 weeks they will all be producing at once — everything you need for a backyard pasta sauce that makes the whole season worthwhile.',
     harvest:'🍝 Roast cherry tomatoes with garlic until they burst. Toss through pasta with torn fresh basil and sautéed zucchini. That\'s the dish the garden was built for.',
     checkBeds:['cherry-tomato','tomatoes'],
     trackTitle:'The Christmas trio is in 🎄',
     trackStory:'Cherry tomatoes, basil and zucchini are all on their way. In 10–12 weeks you will have more produce than you can eat at once. Think pasta sauce, bruschetta, and a ratatouille that\'ll make the whole garden worthwhile.',
    },
    {id:'oct-coolseason',badge:'ENJOY NOW',badgeType:'harvest',emoji:'🫛 🫘',
     title:'Cool season\'s last few weeks',
     story:'Snow peas and broad beans are in their best weeks — pick snow peas every two days and eat them before they even make it inside. When the broad beans are done and pulled, those nitrogen-fixing roots quietly prepare the soil for summer. This is what the whole winter was for.',
     harvest:'🧈 Broad beans blanched for 2 minutes, butter, sea salt. Snow peas raw, straight from the vine. Simple is exactly right here.',
     checkBeds:['snow-peas','broad-beans'],
     trackTitle:'Cool season\'s last hurrah 🫛',
     trackStory:'Snow peas and broad beans are in their prime. Pick peas every 2 days. When the beans are done and pulled, the soil is already prepared for summer. This is what the whole winter was for.',
    }
  ],
  10:[
    {id:'nov-summer',badge:'BUILDING NOW',badgeType:'track',emoji:'🍅 🫑 🥒',
     title:'The summer harvest is taking shape',
     story:'If tomatoes, capsicum and zucchini are in the ground and growing, December is going to reward you properly. Keep watering consistently and feed tomatoes weekly — they are hungry plants.',
     harvest:'🫑 Char capsicum over a flame, peel and dress with olive oil and garlic alongside fresh tomatoes. One of the best things you can eat in a Perth summer.',
     checkBeds:['tomatoes','cherry-tomato','capsicum'],
     trackTitle:'Summer is building nicely 🌞',
     trackStory:'Your summer crops are establishing. The December harvest is coming — keep the water up and the tomatoes and capsicum will reward every week of waiting.',
    }
  ],
  11:[
    {id:'dec-peak',badge:'PEAK SEASON',badgeType:'harvest',emoji:'🍅 🥒 🫘',
     title:'This is what all the work was for',
     story:'Tomatoes, zucchini and beans producing at once — eat fresh every day. Make a big batch of passata to freeze and you will have summer in the middle of July.',
     harvest:'🍅 Fill a big pot with cherry tomatoes, garlic and olive oil. Simmer down, blend, bottle. Freeze in portions — that\'s a year\'s worth of pasta sauce from one afternoon.',
     checkBeds:['tomatoes','cherry-tomato'],
     trackTitle:'Peak season — enjoy it 🌟',
     trackStory:'Everything is producing at once. Eat fresh daily. Make passata. Freeze what you can\'t use. This is the whole point.',
    }
  ]
};

const TASKS={
  9:[
    {id:'oct-herbs',plants:['coriander','parsley'],text:'Harvest coriander and parsley — this week',detail:'Both are shooting. Strip everything before flowers open. Once bolted, the flavour is gone and the plants are spent.',type:'urgent',
     followOn:{id:'oct-basil',text:'Get basil into the cleared herb spaces in Bed 1',detail:'The spot is warm and ready. Basil loves exactly this position. You\'ll have leaves within a few weeks.',type:'soon',followOn:null}},
    {id:'oct-peas',plants:['snow-peas'],text:'Pick snow peas every 2 days',detail:'Frequency of picking is what keeps them producing. Leave pods on the vine and the plant thinks its job is done.',type:'urgent',followOn:null},
    {id:'oct-tomatoes',text:'Get tomato seedlings from the nursery mid-month',detail:'Cherry tomatoes are your best bet for a first season. Mid-October in the Hills — not before. The cold nights are still around early in the month.',type:'soon',
     followOn:{id:'oct-plant-tomatoes',text:'Plant tomatoes into Bed 1 as snow peas wind down',detail:'The trellis comes off, the tomatoes go on. The soil is primed from months of peas — they will love it.',type:'soon',followOn:null}},
    {id:'oct-aphids',text:'Quick aphid check under kale and chard',detail:'October is when they arrive. Check the underside of leaves. A blast of water knocks them off early — your marigolds are already helping but stay ahead of it.',type:'soon',followOn:null},
    {id:'oct-beans-watch',plants:['broad-beans'],text:'Watch broad beans for harvest — pods should be swelling',detail:'Pick when plump and green. Pull plants when done — roots and all. Those nitrogen-fixing roots are a gift to the next crop.',type:'coming',
     followOn:{id:'oct-rest-bed1',text:'Give Bed 1 a week\'s rest after the beans come out',detail:'Water it in, light mulch, leave it alone for a week before planting again. The soil has worked hard since July.',type:'rest',followOn:null}},
    {id:'oct-rest',text:'Take a week off from the garden',detail:'October is a big transition month and you\'ve done the work. Walk around, notice what\'s growing. The worms are working even when you\'re not.',type:'rest',followOn:null}
  ],
  10:[
    {id:'nov-beans',plants:['broad-beans'],text:'Harvest and pull the last broad beans',detail:'Pick remaining pods, then pull the whole plant roots and all. The nitrogen stays in the soil as a gift to whatever comes next.',type:'urgent',
     followOn:{id:'nov-rest-bed',text:'Rest Bed 1 for a week before the next planting',detail:'Light mulch, a good soak, then leave it alone. One week is all it needs before tomatoes or zucchini go in.',type:'rest',followOn:null}},
    {id:'nov-shallots',plants:['shallots'],text:'Check shallots — lift when foliage falls over',detail:'That flopping over is the signal. Lift gently, brush off soil. Don\'t wash them.',type:'urgent',
     followOn:{id:'nov-cure-shallots',text:'Cure shallots in a dry airy spot for 3–4 days',detail:'A wire rack in the shed, out of direct sun. The skins dry and they\'ll keep for months.',type:'soon',followOn:null}},
    {id:'nov-water',text:'Consistent watering — roots need it now',detail:'Inconsistent moisture at this stage means woody beetroot and forked carrots. Regular, even watering from here makes all the difference.',type:'urgent',followOn:null},
    {id:'nov-basil',plants:['basil'],text:'Pinch out basil flower heads as they appear',detail:'Once basil flowers, the leaves lose their flavour. Pinch the tops weekly and it keeps producing for months.',type:'soon',followOn:null},
    {id:'nov-rest',text:'Step back and enjoy what\'s growing',detail:'November is when the summer garden comes alive. You don\'t always need to be doing something. Sometimes just watching is enough.',type:'rest',followOn:null}
  ],
  11:[
    {id:'dec-water',text:'Water every 2–3 days in the morning',detail:'December heat in the Hills is serious. Deep, infrequent watering beats shallow and often. Early morning means less evaporation.',type:'urgent',followOn:null},
    {id:'dec-onions',plants:['onions'],text:'Lift onions when tops fall over naturally',detail:'That\'s the signal — don\'t rush it. Lifting early means smaller bulbs. Ease them out gently.',type:'urgent',
     followOn:{id:'dec-cure-onions',text:'Cure onions in a cool dry place',detail:'Hang in a net bag in the shed. They\'ll last months and you\'ll reach for them every week.',type:'soon',followOn:null}},
    {id:'dec-zucchini',plants:['zucchini'],text:'Harvest zucchini at 15–20cm — don\'t let them grow huge',detail:'A giant zucchini tastes of nothing and stresses the plant. Pick early and often and you\'ll have them all summer.',type:'soon',followOn:null},
    {id:'dec-tomatoes',plants:['cherry-tomato','tomatoes'],text:'First cherry tomatoes appearing — check daily',detail:'Once they start, they come fast. Pick fully coloured. Eat them in the garden before they make it inside.',type:'soon',followOn:null},
    {id:'dec-rest',text:'Take a proper break from the garden this week',detail:'It\'s December. The garden is producing. You\'ve done everything right. Eat the food, enjoy the season, rest.',type:'rest',followOn:null}
  ]
};

const DEFAULT={v:4,
  beds:[
    {id:'bed1',name:'Bed 1 — South',hint:'Tallest crops · Trellis south edge',dir:'N↑\nS↓',cls:'bt1',
     rows:[
      [{p:'coriander',s:'bolting',d:'2026-07-15'},{p:'coriander',s:'bolting',d:'2026-07-15'},{p:'parsley',s:'bolting',d:'2026-07-15'},{p:'parsley',s:'bolting',d:'2026-07-15'},{p:'marigold',s:'growing',d:'2026-07-15'},{p:'marigold',s:'growing',d:'2026-07-15'}],
      [{p:'snow-peas',s:'ready',d:'2026-07-15'},{p:'snow-peas',s:'ready',d:'2026-07-15'},{p:'snow-peas',s:'ready',d:'2026-07-15'},{p:'broad-beans',s:'growing',d:'2026-07-15'},{p:'broad-beans',s:'growing',d:'2026-07-15'},{p:'broad-beans',s:'growing',d:'2026-07-15'}]
     ]},
    {id:'bed2',name:'Bed 2 — Middle',hint:'Leafy greens · North & south strips',dir:'N↑\nS↓',cls:'bt2',
     rows:[
      [{p:'cos-lettuce',s:'growing',d:'2026-07-15'},{p:'cos-lettuce',s:'growing',d:'2026-07-15'},{p:'spinach',s:'growing',d:'2026-07-15'},{p:'garlic-chives',s:'growing',d:'2026-07-15'},{p:'bok-choy',s:'done',d:'2026-07-15'},{p:null,s:'empty',d:null}],
      [{p:'kale',s:'growing',d:'2026-07-15'},{p:'kale',s:'growing',d:'2026-07-15'},{p:'rainbow-chard',s:'growing',d:'2026-07-15'},{p:'rainbow-chard',s:'growing',d:'2026-07-15'},{p:'red-cabbage',s:'growing',d:'2026-07-15'},{p:'red-cabbage',s:'growing',d:'2026-07-15'}]
     ]},
    {id:'bed3',name:'Bed 3 — North',hint:'Low crops only · Alliums + roots',dir:'N↑\nS↓',cls:'bt3',
     rows:[
      [{p:'dwarf-beans',s:'seed',d:'2026-10-01'},{p:'dwarf-beans',s:'seed',d:'2026-10-01'},{p:'beetroot',s:'growing',d:'2026-07-15'},{p:'beetroot',s:'growing',d:'2026-07-15'},{p:null,s:'empty',d:null},{p:null,s:'empty',d:null}],
      [{p:'carrots',s:'growing',d:'2026-07-15'},{p:'carrots',s:'growing',d:'2026-07-15'},{p:'onions',s:'growing',d:'2026-07-15'},{p:'onions',s:'growing',d:'2026-07-15'},{p:'shallots',s:'growing',d:'2026-07-15'},{p:'shallots',s:'growing',d:'2026-07-15'}]
     ]}
  ],
  taskState:{}
};

// Perth Hills timing, used for year-round tasks and expected harvest dates.
//   sow:  months it can go in (0 = Jan)
//   days: typical days from sowing seed to first harvest (seedlings are ~3 weeks quicker)
//   pick: keeps producing after the first harvest (pick some, don't pull)
const ALL_YEAR=[0,1,2,3,4,5,6,7,8,9,10,11];
const TIMING={
  'broad-beans':   {sow:[2,3,4,5],days:120,pick:true},
  'snow-peas':     {sow:[2,3,4,5,6],days:70,pick:true},
  'garden-peas':   {sow:[3,4,5,6],days:75,pick:true},
  'kale':          {sow:[1,2,3,4,5,6],days:60,pick:true},
  'silverbeet':    {sow:[1,2,3,4,5,6,7,8,9],days:60,pick:true},
  'rainbow-chard': {sow:[1,2,3,4,5,6,7,8,9],days:60,pick:true},
  'cos-lettuce':   {sow:[2,3,4,5,6,7,8],days:60,pick:true},
  'spinach':       {sow:[2,3,4,5,6],days:45,pick:true},
  'asian-greens':  {sow:[2,3,4,5,6,7],days:40},
  'red-cabbage':   {sow:[1,2,3,4],days:110},
  'broccoli':      {sow:[1,2,3,4],days:90,pick:true},
  'cauliflower':   {sow:[1,2,3],days:110},
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
  'dwarf-beans':   {sow:[8,9,10,11,0,1],days:60,pick:true},
  'radish':        {sow:ALL_YEAR,days:28},
  'strawberry':    {sow:[3,4,5],days:180,pick:true},
  'tomatoes':      {sow:[8,9,10],days:85,pick:true},
  'cherry-tomato': {sow:[8,9,10,11],days:70,pick:true},
  'basil':         {sow:[8,9,10,11,0],days:40,pick:true},
  'zucchini':      {sow:[9,10,11,0],days:55,pick:true},
  'cucumber':      {sow:[8,9,10,11,0],days:60,pick:true},
  'capsicum':      {sow:[8,9,10],days:90,pick:true},
  'eggplant':      {sow:[8,9,10],days:100,pick:true},
  'climbing-beans':{sow:[8,9,10,11,0],days:70,pick:true},
  'snake-beans':   {sow:[9,10,11,0],days:75,pick:true},
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
  legume:['broad-beans','snow-peas','garden-peas','dwarf-beans','climbing-beans','snake-beans'],
  brassica:['kale','red-cabbage','broccoli','cauliflower','bok-choy','asian-greens','turnip','radish'],
  leafy:['silverbeet','rainbow-chard','cos-lettuce','spinach'],
  allium:['onions','shallots','spring-onions','leek','garlic','garlic-chives','chives'],
  root:['beetroot','carrots','potato','sweet-potato'],
  nightshade:['tomatoes','cherry-tomato','capsicum','eggplant','chilli'],
  cucurbit:['zucchini','cucumber','pumpkin'],
};
const FAM_LBL={legume:'beans & peas',brassica:'brassicas',leafy:'leafy greens',allium:'alliums',root:'root crops',nightshade:'tomato family',cucurbit:'cucurbits'};
const TALL=['climbing-beans','snake-beans','sweet-corn','tomatoes','cherry-tomato','cucumber','broad-beans','snow-peas','garden-peas','lemongrass'];

const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTH_INTRO={9:'The big switchover month. Cool season finishing, warm season beginning. Hills nights still cold — be patient with new warm-season seedlings.',10:'Full summer mode. Most cool-season crops finishing. Big space opens as broad beans lift.',11:'Full summer. Garden should be producing well. Watering is the main job now.'};
const STATUSES=['seed','seedling','growing','ready','bolting','done'];
const STATUS_LBL={seed:'Seed',seedling:'Seedling',growing:'Growing',ready:'Ready',bolting:'Bolting!',done:'Done'};
const STLBL={seed:'🌱 Seed',seedling:'🪴 Seedling',growing:'🌿 Growing',ready:'✨ Ready',bolting:'⚠️ Bolting',done:'✅ Done',empty:'▫️ Empty'};
const NP_EMOJI=['🌱','🌿','🥬','🥕','🍅','🫑','🌶️','🥒','🫘','🧅','🥔','🌽','🍓','🍉','🌸','🌻'];

