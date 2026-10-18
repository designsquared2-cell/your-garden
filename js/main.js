// Startup.
'use strict';
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&sheetOpen())closeSheet();});
// Leaving the app (switching tabs, locking the phone): remember where we were.
// Coming back: only redraw if the day has changed — redrawing would collapse whatever was open.
let _shownDay=localDate();
document.addEventListener('visibilitychange',()=>{
  if(document.hidden){saveUI();return;}
  loadWeather();if(typeof pullGarden==='function')pullGarden();
  if(localDate()!==_shownDay){_shownDay=localDate();updateHeader();refreshAll();}
});
addEventListener('pagehide',saveUI);

loadState();applyCustomPlants();updateHeader();refreshAll();restoreUI();loadWeather();
// Signed in on this device? Catch up with other devices, and retry pending changes when back online
if(signedIn())pullGarden();
finishLinkSignIn(); // arrived from the sign-in email's link?
// First time here with an empty garden: a quick welcome (location → how hands-on → first bed)
if(!ST.beds.length&&!welcomed()&&!signedIn()&&!/access_token|error_description/.test(location.hash))setTimeout(()=>{if(!sheetOpen()){setView('beds');openWelcome();}},300);
addEventListener('online',()=>{if(signedIn())pushGarden();});

// Offline support + home-screen install (needs https or localhost)
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))
  navigator.serviceWorker.register('sw.js').catch(()=>{});
