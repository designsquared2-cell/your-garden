// Startup.
'use strict';
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheetOpen())closeSheet();});
// Leaving the app (switching tabs, locking the phone): remember where we were.
// Coming back: only redraw if the day has changed — redrawing would collapse whatever was open.
let _shownDay=localDate();
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){saveUI();return;}
  loadWeather();
  if(localDate()!==_shownDay){_shownDay=localDate();updateHeader();refreshAll();}
});
addEventListener('pagehide',saveUI);

loadState();applyCustomPlants();updateHeader();refreshAll();restoreUI();loadWeather();

// Offline support + home-screen install (needs https or localhost)
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))
  navigator.serviceWorker.register('sw.js').catch(()=>{});
