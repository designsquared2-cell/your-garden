// Settings sheet: weather location, backup/restore, reset.
'use strict';
function openSettings(){
  showSheet(`<div class="sh-body"><div class="sh-heading">⚙️ Settings</div>
    <div class="fm-lbl">Weather location</div>
    <div class="set-txt">${wxLoc()?`Currently: <b>${esc(wxLoc().name)}</b>`:'Not set yet — search for your suburb to get watering advice.'}</div>
    <div class="fm-emoji-row"><input class="fm-in" id="loc-q" placeholder="Search a town or suburb" onkeydown="if(event.key==='Enter')searchLoc()"><button class="btn btn-seed btn-inline" onclick="searchLoc()">Search</button></div>
    <div id="loc-res"></div>
    <button class="btn btn-cancel btn-full" style="margin-top:7px" onclick="useMyLoc()">📍 Use my current location</button>

    <div class="fm-lbl" style="margin-top:18px">Climate zone</div>
    <div class="set-txt">Adjusts planting times and pest seasons.${wxLoc()?` Suggested for ${esc(wxLoc().name)}: <b>${ZONES[zoneFromLatLon(wxLoc().lat,wxLoc().lon)].n}</b>.`:''}</div>
    <select class="fm-in" onchange="ST.zone=this.value;saveState();refreshAll();toast('🌏 Climate zone: '+ZONES[this.value].n)">${Object.entries(ZONES).map(([k,z])=>`<option value="${k}"${zone()===k?' selected':''}>${z.n} — ${z.ex}</option>`).join('')}</select>

    <div class="fm-lbl" style="margin-top:18px">Remedies</div>
    <label class="fm-check"><input type="checkbox" id="pref-nat"${ST.prefs.naturalOnly?' checked':''} onchange="ST.prefs.naturalOnly=this.checked;saveState();renderView();toast(this.checked?'🌿 Showing natural remedies only':'Showing all remedies')"> Show natural & home-made remedies only</label>

    <div class="fm-lbl" style="margin-top:18px">Backup</div>
    <div class="set-txt">Your garden is saved on this device only. Export a backup to keep it safe or move it to another phone.</div>
    <div class="btn-row"><button class="btn btn-cancel" onclick="exportBackup()">⬇️ Export</button><button class="btn btn-cancel" onclick="$('imp-file').click()">⬆️ Import</button></div>
    <input type="file" id="imp-file" accept="application/json,.json" hidden onchange="importBackup(this.files[0])">

    <div class="fm-lbl" style="margin-top:18px">Start fresh</div>
    <div class="set-txt">Clear everything and plan a new garden from scratch.</div>
    <button class="btn btn-reset btn-full" onclick="confirmStartFresh()">🧹 Start a fresh garden</button>
    <button class="btn btn-cancel btn-full" style="margin-top:8px" onclick="closeSheet()">Close</button>
  </div>`);
}
function confirmStartFresh(){
  const n=plantedCells().length,own=Object.keys(ST.customPlants).length;
  showSheet(`<div class="sh-body"><div class="sh-heading">🧹 Start a fresh garden?</div>
    <div class="set-txt" style="margin-top:8px">This deletes everything saved on this device:</div>
    <ul class="fresh-list">
      <li>${plural(ST.beds.length,'bed')} and ${plural(n,'plant')}</li>
      <li>${plural(own,'plant')} you added to the plant list</li>
      <li>Your seed box (${plural(ST.seeds.length,'packet')}) and the planting history used for rotation</li>
      <li>Your harvest log (${ST.log.length} ${ST.log.length===1?'entry':'entries'}), watering log and weather location</li>
    </ul>
    <div class="set-txt">Want a copy first? Export a backup — you can import it again later.</div>
    <button class="btn btn-cancel btn-full" onclick="exportBackup()">⬇️ Export a backup first</button>
    <button class="btn btn-reset btn-full" style="margin-top:8px" onclick="startFresh()">Delete everything & start fresh</button>
    <button class="btn btn-cancel btn-full" style="margin-top:8px" onclick="openSettings()">← Back</button>
  </div>`);
}
function startFresh(){
  snapshot();
  Object.keys(ST.customPlants).forEach(k=>{delete P[k];delete TIMING[k];[...Object.values(CATS),...Object.values(FAMILY)].forEach(a=>{const i=a.indexOf(k);if(i>-1)a.splice(i,1);});});
  ST=freshState();saveState();
  try{localStorage.removeItem(WX_K);}catch(e){}
  WX=null;exitSelectMode();closeSheet();setView('beds');refreshAll();
  toast('🧹 Fresh start — add your first bed',{undo:true});
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
