// Weather & watering. Open-Meteo (free, no key).
// Water balance = evaporation (ET₀) − effective rain, counted since the last watering or soaking rain.
'use strict';
const WX_K='gdn_wx';
let WX=null,WX_ERR=false;
function wxLoc(){return ST.wx||null;}
function wxIcon(c){return c==null?'🌡️':c===0?'☀️':c<=2?'🌤️':c===3?'☁️':c<=48?'🌫️':c<=57?'🌦️':c<=67?'🌧️':c<=77?'❄️':c<=82?'🌦️':'⛈️';}
function dayName(iso){const off=daysBetween(localDate(),iso);return off===-1?'yesterday':off===1?'tomorrow':off===0?'today':new Date(iso+'T00:00').toLocaleDateString('en-AU',{weekday:'long'});}
// Index of "today" in the forecast. The API uses the garden's timezone; fall back to the
// past_days offset (7) if the device's date differs, rather than refetching in a loop.
function wxToday(d){const i=d.time.indexOf(localDate());return i>=0?i:Math.min(7,d.time.length-1);}

async function loadWeather(force){
  const loc=wxLoc();let c=null;
  if(!loc){WX=null;renderWeather();return;}
  try{c=JSON.parse(localStorage.getItem(WX_K));}catch(e){}
  const same=c&&c.lat===loc.lat&&c.lon===loc.lon;
  if(same){WX=c;renderWeather();if(!force&&Date.now()-c.t<3600e3)return;}else{WX=null;renderWeather();}
  try{
    const u=`https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&daily=weather_code,temperature_2m_max,precipitation_sum,precipitation_probability_max,et0_fao_evapotranspiration&timezone=auto&past_days=7&forecast_days=4`;
    const r=await fetch(u);if(!r.ok)throw new Error(r.status);
    const j=await r.json();WX={t:Date.now(),lat:loc.lat,lon:loc.lon,daily:j.daily};WX_ERR=false;
    try{localStorage.setItem(WX_K,JSON.stringify(WX));}catch(e){}
  }catch(e){WX_ERR=true;}
  renderWeather();renderAlerts();renderView();
}

function wxVerdict(){
  if(!WX?.daily)return null;
  const d=WX.daily,td=localDate(),ti=wxToday(d);
  const rain=i=>d.precipitation_sum[i]||0,et=i=>d.et0_fao_evapotranspiration[i]||0;
  const tmax=d.temperature_2m_max[ti];
  const shallow=plantedCells().some(x=>x.cell.s==='seed'||x.cell.s==='seedling');
  const lw=ST.lastWatered;
  if(lw===td)return{lv:'g',msg:'Watered today ✓ — nothing more to do.'};
  // Start counting from the last watering, or the last soaking rain (≥10mm), whichever is later
  let si=lw?d.time.indexOf(lw):-1;
  if(si<0)si=lw&&lw>d.time[0]?ti-1:Math.max(0,ti-3);
  let since=lw&&d.time.indexOf(lw)>=0?`since you watered ${dayName(lw)}`:lw?'since your last watering':'over the last 3 days';
  for(let i=ti;i>si;i--)if(rain(i)>=10){si=i;since=`since ${Math.round(rain(i))}mm of rain ${dayName(d.time[i])}`;break;}
  let lost=0,got=0;for(let i=si;i<=ti;i++){lost+=et(i);got+=Math.max(0,rain(i)-1);}
  const def=Math.round(lost-got);
  const hi=shallow?8:15,mid=shallow?4:8;
  const tmrRain=rain(ti+1),tmrProb=d.precipitation_probability_max[ti+1]||0;
  const sd=shallow?' Seeds and seedlings have shallow roots — they dry out first.':'';
  if(def>=mid&&tmrRain>=6&&tmrProb>=70)return{lv:'y',msg:`Beds are drying (${def}mm short ${since}), but ${Math.round(tmrRain)}mm of rain is likely tomorrow — hold off.`};
  if(def>=hi||(tmax>=35&&def>=mid))return{lv:'r',msg:`💧 Water today — about ${def}mm lost to evaporation ${since}${tmax>=35?`, and it's ${Math.round(tmax)}° today`:''}.${sd}`};
  if(def>=mid)return{lv:'y',msg:`💧 Water tomorrow morning — beds are ${def}mm short ${since}.${sd}`};
  return{lv:'g',msg:`Soil moisture looks fine ${since} (${Math.max(0,def)}mm short).`};
}

function renderWeather(){
  const w=$('wx-wrap');const loc=wxLoc();
  if(!loc){w.innerHTML=ST.beds.length?`<button class="wx wx-setup" onclick="openSettings()"><span class="wx-ico">📍</span><span><span class="wx-loc">Set your location</span><span class="wx-sum">Get watering advice from your local weather</span></span><span class="nudge-cnt">›</span></button>`:'';return;}
  if(!WX?.daily){w.innerHTML=`<div class="wx"><div class="wx-top"><div class="wx-ico">🌡️</div><div><div class="wx-loc">${esc(loc.name)}</div><div class="wx-sum">${WX_ERR?'Couldn\'t reach the weather service — check your connection.':'Loading weather…'}</div></div></div></div>`;return;}
  const d=WX.daily,ti=wxToday(d);
  const r3=[ti-3,ti-2,ti-1].reduce((s,i)=>s+(d.precipitation_sum[i]||0),0);
  const v=wxVerdict();const watered=ST.lastWatered===localDate();
  const heat=[ti+1,ti+2,ti+3].filter(i=>d.temperature_2m_max[i]>=35).map(i=>`${dayName(d.time[i])} ${Math.round(d.temperature_2m_max[i])}°`);
  const tmr=d.precipitation_sum[ti+1]||0;
  const rows=[`<div class="wx-row"><div class="adot a${v.lv}"></div><div>${v.msg}</div></div>`];
  if(heat.length)rows.push(`<div class="wx-row"><div class="adot ay"></div><div>🔥 Hot days ahead: ${heat.join(', ')}. Water deeply the morning before and mulch well.</div></div>`);
  w.innerHTML=`<div class="wx"><div class="wx-top"><div class="wx-ico">${wxIcon(d.weather_code[ti])}</div><div><div class="wx-loc">${esc(loc.name)} · ${Math.round(d.temperature_2m_max[ti])}° today</div><div class="wx-sum">${r3.toFixed(1)}mm rain last 3 days · ${tmr>=1?`${Math.round(tmr)}mm`:'dry'} tomorrow</div></div><button class="wx-btn${watered?' done':''}" onclick="logWatered()">${watered?'✓ Watered':'💧 Watered'}</button></div>${rows.join('')}<div class="wx-foot">Updated ${new Date(WX.t).toLocaleTimeString('en-AU',{hour:'numeric',minute:'2-digit'})} · Open-Meteo</div></div>`;
}

function logWatered(){
  const td=localDate();
  if(ST.lastWatered===td){ST.lastWatered=ST.prevWatered||null;toast('Watering log undone');}
  else{ST.prevWatered=ST.lastWatered||null;ST.lastWatered=td;toast('💧 Logged — clock reset');}
  saveState();renderWeather();renderAlerts();renderView();
}

// ── Location (Settings) ──
let _locRes=[];
async function searchLoc(){
  const q=$('loc-q').value.trim();const out=$('loc-res');if(!q)return;
  out.innerHTML='<div class="sh-sub" style="margin-top:6px">Searching…</div>';
  try{
    const r=await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`);
    _locRes=(await r.json()).results||[];
    out.innerHTML=_locRes.length?_locRes.map((p,i)=>`<button class="loc-res" onclick="setLoc(${i})">📍 ${esc(p.name)}${p.admin1?', '+esc(p.admin1):''}${p.country_code?' · '+esc(p.country_code):''}</button>`).join(''):'<div class="sh-sub" style="margin-top:6px">No places found.</div>';
  }catch(e){out.innerHTML='<div class="sh-sub" style="margin-top:6px">Couldn\'t search — check your connection.</div>';}
}
function applyLoc(loc,msg){ST.wx=loc;saveState();closeSheet();toast(msg);WX=null;renderWeather();loadWeather(true);}
function setLoc(i){const p=_locRes[i];applyLoc({name:p.name+(p.admin1?', '+p.admin1:''),lat:Math.round(p.latitude*100)/100,lon:Math.round(p.longitude*100)/100},'📍 '+p.name);}
function useMyLoc(){
  if(!navigator.geolocation){toast('Location not available');return;}
  navigator.geolocation.getCurrentPosition(
    pos=>applyLoc({name:'My location',lat:Math.round(pos.coords.latitude*100)/100,lon:Math.round(pos.coords.longitude*100)/100},'📍 Using your location'),
    ()=>toast('Location permission denied'));
}
