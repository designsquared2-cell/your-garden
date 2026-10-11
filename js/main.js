// Startup.
'use strict';
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheetOpen())closeSheet();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden){updateHeader();loadWeather();refreshAll();}});

loadState();applyCustomPlants();updateHeader();refreshAll();loadWeather();

// Offline support + home-screen install (needs https or localhost)
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))
  navigator.serviceWorker.register('sw.js').catch(()=>{});
