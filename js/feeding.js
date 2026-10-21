// Feeding jobs: what each bed needs, worked out from what's growing in it.
//   leafy: liquid feed every 2 weeks · fruiting: potash-rich feed every 2 weeks once flowering
//   root: one light feed · herb: once in spring · tree: on each fruit's own months (fruit.js)
// Beans, peas and companion flowers aren't fed — beans and peas make their own nitrogen.
// Products are named generically, with natural options first; the shop option is hidden with "natural remedies only".
'use strict';
const FEEDS={
  leafy:{act:'Liquid-feed leafy greens',why:'Leafy crops grow on nitrogen — a liquid feed every 2 weeks keeps fresh leaves coming.',
    nat:'worm tea, fish emulsion, or liquid seaweed mixed with fish',org:'a soluble all-purpose plant food',every:14,start:21},
  fruiting:{act:'Feed fruiting crops',why:'Once they\'re flowering, a potash-rich feed means more fruit and less leaf.',
    nat:'liquid seaweed with a teaspoon of sulphate of potash per watering can, or comfrey tea',org:'a liquid tomato & vegetable food',every:14,start:35},
  root:{act:'Light feed for root crops',why:'Roots swell on potash, not nitrogen — one light feed is plenty. Too much nitrogen makes leaves instead of roots.',
    nat:'liquid seaweed',org:'a light sprinkle of sulphate of potash, watered in',once:true,start:35,end:100},
  herb:{act:'Light feed for herbs',why:'Woody herbs need very little — one feed in spring keeps them leafy.',
    nat:'a handful of compost or worm castings around each plant',org:'a sprinkle of pelletised chicken manure',months:[8]},
};
// Trees: citrus and blueberries have their own foods; the rest share a general fruit-tree feed
function treeFeed(k){
  const f=FRUIT[k];
  if(FRUIT_GROUPS.citrus.includes(k))return{why:'Citrus are hungry — feeding in late winter and autumn keeps leaves green and fruit coming.',nat:'pelletised chicken manure plus a dose of liquid seaweed',org:'a citrus food (it has the trace elements citrus need)'};
  if(k==='blueberry')return{why:'Blueberries need acid soil and a light feed in spring and early summer.',nat:'a pine-bark or pine-needle mulch and a little blood & bone',org:'an azalea & camellia food (made for acid-loving plants)'};
  return{why:f.dec?'A feed as it wakes up in spring (and after harvest) powers the new growth that carries next year\'s fruit.':'A feed now powers the new growth that carries the fruit.',nat:'pelletised chicken manure or compost, spread out to the edge of the branches and watered in',org:'a fruit-tree fertiliser'};
}
const PERENNIAL_HERBS=['thyme','rosemary','sage','oregano','mint','chives','lemongrass','garlic-chives'];
function feedTypeOf(k){
  if(isTree(k))return'tree';
  if(COMPANIONS.includes(k)||FAMILY.legume.includes(k))return null;
  if(PERENNIAL_HERBS.includes(k))return'herb';
  const f=familyOf(k);
  if(f==='root'||f==='allium')return'root';
  if(f==='nightshade'||f==='cucurbit'||['strawberry','sweet-corn'].includes(k))return'fruiting';
  if(P[k]?.custom&&!f)return null; // we don't know enough about it
  return'leafy';
}
function feedProducts(nat,org){return`Use ${nat}${ST.prefs.naturalOnly?'':`, or ${org}`}. Water the soil first, then feed.`;}
function feedDue(type,xs,key,m){
  const td=localDate(),last=ST.fed[key],F=FEEDS[type];
  if(type==='tree'){const c=xs[0].cell;return fruitMonthIn(FRUIT[c.p].feed,m)&&treeYears(c)>=0.25&&!(last&&daysBetween(last,td)<45);}
  if(F.months)return fruitMonthIn(F.months,m)&&!(last&&daysBetween(last,td)<120);
  const age=x=>x.cell.d?daysBetween(x.cell.d,td):0;
  if(F.once){const el=xs.filter(x=>age(x)>=F.start&&age(x)<=F.end);if(!el.length)return false;const first=el.map(x=>x.cell.d).sort()[0];return!(last&&last>=first);}
  return xs.some(x=>age(x)>=F.start)&&!(last&&daysBetween(last,td)<F.every);
}
// Standard mode: one job per bed and feed type that's due
function feedItems(m){
  const out=[];
  ST.beds.forEach((bed,bi)=>{
    const g=new Map();
    plantedCells().filter(x=>x.bi===bi&&!['done','seed'].includes(x.cell.s)).forEach(x=>{const t=feedTypeOf(x.cell.p);if(!t)return;if(!g.has(t))g.set(t,[]);g.get(t).push(x);});
    g.forEach((xs,type)=>{
      const key=`${bed.id}:${type}`;if(!feedDue(type,xs,key,m))return;
      if(type==='tree'){const tf=treeFeed(xs[0].cell.p);
        out.push({kind:'feed',id:key,type:'soon',cb:true,icon:'🍽️',title:`🍽️ Feed ${esc(bed.name)}`,detail:`${tf.why} ${feedProducts(tf.nat,tf.org)}`});return;}
      const F=FEEDS[type];
      out.push({kind:'feed',id:key,type:'soon',cb:true,icon:'🍽️',title:`🍽️ ${F.act} · ${esc(bed.name)}`,detail:`Your ${plantList(xs)}. ${F.why} ${feedProducts(F.nat,F.org)}`});
    });
  });
  return out;
}
// Low maintenance: just a spring and an autumn feed for everything
function lowFeedItems(m){
  if(!plantedCells().length||!fruitMonthIn([2,8],m)||(ST.fed.all&&daysBetween(ST.fed.all,localDate())<60))return[];
  const citrus=plantedCells().some(x=>FRUIT_GROUPS.citrus.includes(x.cell.p));
  return[{kind:'feed',id:'all',type:'soon',cb:true,icon:'🍽️',title:`🍽️ ${fruitMonthIn([8],m)?'Spring':'Autumn'} feed for the whole garden`,
    detail:`Scatter ${ST.prefs.naturalOnly?'pelletised chicken manure':'pelletised chicken manure or a complete organic fertiliser'} thinly around everything and water it in. Skip beans and peas — they feed themselves.${citrus?' Give citrus a citrus food instead.':''}`}];
}
function tickFeed(id){ST.fed[id]=localDate();return id==='all'?'🍽️ Fed — next one in 6 months':`🍽️ Fed — ${FEEDS[id.split(':')[1]]?.every?'next feed in 2 weeks':'all done for now'}`;}
