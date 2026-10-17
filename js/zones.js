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
function zoneFromLatLon(lat,lon){
  if(lat>-19)return'tropical';
  if(lat>-29&&lon>150)return'subtropical';
  if(lon>119&&lon<149&&lat>-32.5&&lat<-19)return'arid';
  if(lat<-36.5||(lat<-35&&lon>145&&lon<150))return'cool';
  return'temperate';
}
