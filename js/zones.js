// Climate zones (Australia). All planting and pest data is written for a temperate / Mediterranean climate
// like Perth; other zones adjust it. These are broad rules — local conditions vary.
'use strict';
const ZONES={
  temperate:  {n:'Temperate / Mediterranean',ex:'Perth, Adelaide, Sydney',pest:0},
  cool:       {n:'Cool',ex:'Melbourne, Hobart, Canberra, highlands',pest:1},
  subtropical:{n:'Subtropical',ex:'Brisbane, Gold Coast, northern NSW',pest:-1},
  arid:       {n:'Arid / inland',ex:'Alice Springs, Kalgoorlie, Broken Hill',pest:-1},
  tropical:   {n:'Tropical',ex:'Darwin, Cairns, Broome, Townsville',pest:0},
};
// Crops that love heat — in hot zones they're planted through the warm/wet season
const HEAT_LOVERS=['sweet-potato','eggplant','chilli','lemongrass','basil','pumpkin'];
function zone(){return ZONES[ST.zone]?ST.zone:'temperate';}
function catOf(k){return Object.keys(CATS).find(c=>CATS[c].includes(k));}
const span=(...ms)=>ms;
// Adjust a crop's (or variety's) planting months for the climate zone
function zoneSow(k,sow,heat){
  const z=zone();if(z==='temperate'||!sow)return sow;
  const cat=catOf(k),hot=heat||HEAT_LOVERS.includes(k);
  if(cat==='fruit')return fruitZoneSow(k,sow,z);
  const keep=(ms,allowed)=>{const r=ms.filter(m=>allowed.includes(m));return r.length?r:allowed;};
  if(z==='cool'){
    if(cat==='warm')return keep(sow,span(9,10,11));                       // short frost-free summer
    if(cat==='cool')return[...new Set([...sow,7,8])].sort((a,b)=>a-b);     // also spring sowings
    return sow.filter(m=>![5,6].includes(m));                              // nothing in mid-winter
  }
  if(z==='subtropical'){
    if(cat==='warm')return hot?span(7,8,9,10,11,0,1,2):span(1,2,3,6,7,8);  // avoid the wet, humid peak
    if(cat==='cool')return span(2,3,4,5,6);                                // winter is the cool season
    return sow;
  }
  if(z==='arid'){
    if(cat==='warm')return hot?span(7,8,9,10,1,2):span(7,8,9,1,2);       // avoid planting into Dec–Jan heat
    if(cat==='cool')return span(2,3,4,5);
    return sow.filter(m=>![11,0].includes(m));
  }
  if(z==='tropical'){
    if(cat==='warm')return hot?span(8,9,10,11,0,1,3,4):span(3,4,5,6);     // most veg in the dry season
    if(cat==='cool')return span(4,5);
    return span(3,4,5,6,7);
  }
  return sow;
}
// Pests run a month later in cool zones and a month earlier in warm ones
function pestShift(){return ZONES[zone()].pest;}
function zoneMonthsOut(ms){const s=pestShift();return ms.map(m=>(m+s+12)%12);}   // for display
function pestMonthIn(ms,m){const s=pestShift();return ms.includes((m-s+12)%12);}  // is month m in a pest's season?
// Suggest a zone from the weather location (latitude/longitude)
// Towns where the broad rules below get it wrong (tropical coast, inland, tablelands and hills)
const ZONE_TOWNS=[['Townsville',-19.26,146.82,'tropical'],['Mackay',-21.14,149.18,'tropical'],['Proserpine',-20.40,148.58,'tropical'],['Bowen',-20.01,148.25,'tropical'],
  ['Karratha',-20.74,116.85,'arid'],['Port Hedland',-20.31,118.58,'arid'],['Carnarvon',-24.88,113.66,'arid'],['Mildura',-34.19,142.16,'arid'],['Broken Hill',-31.95,141.45,'arid'],['Renmark',-34.18,140.75,'arid'],
  ['Orange',-33.28,149.10,'cool'],['Bathurst',-33.42,149.58,'cool'],['Armidale',-30.51,151.67,'cool'],['Goulburn',-34.75,149.72,'cool'],['Lithgow',-33.48,150.16,'cool'],['Oberon',-33.70,149.86,'cool'],
  ['Adelaide Hills',-35.00,138.80,'cool'],['Mount Barker',-35.07,138.86,'cool'],['Stirling SA',-35.00,138.72,'cool'],['Toowoomba',-27.56,151.95,'temperate'],['Stanthorpe',-28.65,151.93,'cool'],
  ['Coffs Harbour',-30.30,153.11,'subtropical'],['Port Macquarie',-31.43,152.91,'subtropical'],['Atherton',-17.27,145.48,'subtropical'],['Dubbo',-32.25,148.60,'temperate'],['Tamworth',-31.09,150.93,'temperate']];
function townZone(lat,lon){
  let best=null,bd=1e9;
  ZONE_TOWNS.forEach(([,a,o,z])=>{const d=Math.hypot((lat-a)*111,(lon-o)*111*Math.cos(lat*Math.PI/180));if(d<bd){bd=d;best=z;}});
  return bd<=35?best:null;
}
// Height matters too: 500m+ is a step cooler (Toowoomba gets frosts; the Atherton Tablelands aren't tropical lowlands)
function zoneFromLatLon(lat,lon,elev){
  const t=townZone(lat,lon);if(t)return t;
  let z='temperate';
  if(lat>-19)z='tropical';
  else if(lat>-29&&lon>150)z='subtropical';
  else if(lon>119&&lon<149&&lat>-32.5&&lat<-19)z='arid';
  else if(lat<-36.5||(lat<-35&&lon>145&&lon<150))z='cool';
  if(elev>=500)z={tropical:'subtropical',subtropical:'temperate',temperate:elev>=700?'cool':'temperate'}[z]||z;
  return z;
}
