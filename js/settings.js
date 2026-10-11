// Settings sheet: weather location, backup/restore, reset.
'use strict';
function openSettings(){
  showSheet(`<div class="sh-body"><div class="sh-heading">⚙️ Settings</div>
    <div class="fm-lbl">Weather location</div>
    <div class="set-txt">Currently: <b>${esc(wxLoc().name)}</b></div>
    <div class="fm-emoji-row"><input class="fm-in" id="loc-q" placeholder="Search a town or suburb" onkeydown="if(event.key==='Enter')searchLoc()"><button class="btn btn-seed btn-inline" onclick="searchLoc()">Search</button></div>
    <div id="loc-res"></div>
    <button class="btn btn-cancel btn-full" style="margin-top:7px" onclick="useMyLoc()">📍 Use my current location</button>

    <div class="fm-lbl" style="margin-top:18px">Backup</div>
    <div class="set-txt">Your garden is saved on this device only. Export a backup to keep it safe or move it to another phone.</div>
    <div class="btn-row"><button class="btn btn-cancel" onclick="exportBackup()">⬇️ Export</button><button class="btn btn-cancel" onclick="$('imp-file').click()">⬆️ Import</button></div>
    <input type="file" id="imp-file" accept="application/json,.json" hidden onchange="importBackup(this.files[0])">

    <div class="fm-lbl" style="margin-top:18px">Start over</div>
    <div class="set-txt">Reset the beds to the October 2026 layout. Your own plants and location are kept.</div>
    <button class="btn btn-reset btn-full" onclick="doReset()">🔄 Reset beds</button>
    <button class="btn btn-cancel btn-full" style="margin-top:8px" onclick="closeSheet()">Close</button>
  </div>`);
}
function exportBackup(){
  const blob=new Blob([JSON.stringify({app:'garden',exported:new Date().toISOString(),state:ST},null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`garden-backup-${localDate()}.json`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  toast('⬇️ Backup saved');
}
async function importBackup(file){
  if(!file)return;
  try{
    const j=JSON.parse(await file.text()),s=j.state||j;
    if(!Array.isArray(s.beds)||!s.beds.every(b=>Array.isArray(b.rows)))throw new Error('not a garden backup');
    snapshot();ST=migrate(s);saveState();applyCustomPlants();closeSheet();refreshAll();loadWeather(true);
    toast('⬆️ Backup restored',{undo:true});
  }catch(e){toast('That file isn\'t a garden backup');}
}
function doReset(){
  snapshot();
  const keep={customPlants:ST.customPlants,wx:ST.wx,lastWatered:ST.lastWatered,log:ST.log};
  ST=migrate(Object.assign(dc(DEFAULT),keep));saveState();closeSheet();refreshAll();
  toast('🔄 Beds reset',{undo:true});
}
