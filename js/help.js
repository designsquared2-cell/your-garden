// First-time welcome, the Help & tips page, and tester feedback (saved to Supabase — see supabase/feedback.sql).
'use strict';

// ── Welcome ── shown once per device, when the garden is empty: where are you → how hands-on → first bed
const WELCOME_K='gdn_welcomed';
function welcomed(){try{return!!localStorage.getItem(WELCOME_K);}catch(e){return true;}}
function markWelcomed(){try{localStorage.setItem(WELCOME_K,localDate());}catch(e){}}
function isInstalled(){return matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;}
function isIOS(){return/iPhone|iPad|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}
function welcomeDots(n){return`<div class="wl-dots">${[1,2,3].map(i=>`<span class="${i===n?'on':''}"></span>`).join('')}</div>`;}
function openWelcome(step=1){
  if(step===1){
    _onLoc=()=>openWelcome(2);
    showSheet(`<div class="sh-body wl">${welcomeDots(1)}<div class="wl-e">🌱</div><div class="wl-h">Welcome to Your Garden</div>
      <div class="wl-s">A planting guide for your own patch — what to plant, when it’s ready, and what needs doing. Three quick steps.</div>
      <div class="fm-lbl">📍 Where’s your garden?</div>
      <div class="set-txt">Sets your watering advice and climate, which decide all the planting times.</div>
      <div class="fm-emoji-row"><input class="fm-in" id="loc-q" placeholder="Your suburb or town" onkeydown="if(event.key==='Enter')searchLoc()"><button class="btn btn-seed btn-inline" onclick="searchLoc()">Search</button></div>
      <div id="loc-res"></div>
      <button class="btn btn-cancel btn-full" style="margin-top:7px" onclick="useMyLoc()">📍 Use my current location</button>
      <button class="link-btn" onclick="_onLoc=null;openWelcome(2)">Skip for now</button>
      <div class="wl-alt">Already using the app on another device? <button class="link-btn" onclick="_onLoc=null;markWelcomed();openAccount()">Sign in</button></div></div>`);
    return;
  }
  if(step===2){
    const loc=wxLoc();
    showSheet(`<div class="sh-body wl">${welcomeDots(2)}
      ${loc?`<div class="wl-ok">📍 ${esc(loc.name)}</div><div class="fm-lbl">Your climate — change it if this doesn’t sound right</div><select class="fm-in" id="wl-zone" onchange="ST.zone=this.value;saveState();refreshAll()">${Object.entries(ZONES).map(([k,z])=>`<option value="${k}"${zone()===k?' selected':''}>${z.n} — ${z.ex}</option>`).join('')}</select>`:''}
      <div class="wl-h">How hands-on do you want to be?</div>
      <div class="wl-s">You can change this any time in ⚙️ Settings.</div>
      <div class="maint-opts">${Object.entries(MAINT).map(([k,o])=>`<button class="maint-opt${maint()===k?' on':''}" onclick="welcomeMaint('${k}')"><span class="maint-e">${o.e}</span><span><b>${o.n}</b><span>${o.d}</span></span></button>`).join('')}</div>
      <button class="link-btn" onclick="openWelcome(1)">← Back</button></div>`);
    return;
  }
  markWelcomed();
  showSheet(`<div class="sh-body wl">${welcomeDots(3)}<div class="wl-e">🧺</div><div class="wl-h">You’re ready to grow</div>
    <div class="wl-tips">
      ${isInstalled()?'':`<div class="trait"><span class="trait-e">📲</span><div><b>Add it to your home screen</b><div>${isIOS()?'In Safari, tap the Share button, then <b>Add to Home Screen</b>. On iPhone this also stops your garden being cleared if you don’t open it for a week.':'In Chrome, tap ⋮ then <b>Install app</b> or <b>Add to Home screen</b>.'}</div></div></div>`}
      <div class="trait"><span class="trait-e">☁️</span><div><b>Back it up</b><div>Your garden saves on this device. Sign in (⚙️ → Sign in) to keep it safe and see it on other devices.</div></div></div>
      <div class="trait"><span class="trait-e">💡</span><div><b>Stuck?</b><div>⚙️ → Help & tips explains everything, and ⚙️ → Send feedback goes straight to us.</div></div></div>
    </div>
    <button class="btn btn-seed btn-full" style="margin-top:14px" onclick="openAddChoice()">＋ Add your first bed or tree</button>
    <button class="link-btn" onclick="closeSheet()">I’ll look around first</button></div>`);
}

function welcomeMaint(k){try{localStorage.setItem(MAINT_K,k);}catch(e){}refreshAll();openWelcome(3);}

// ── Help & tips ──
const HELP=[
  ['🌱','Getting started',[
    ['Add a bed or fruit tree','On the Beds tab, tap <b>＋ Add a bed or fruit tree</b>. A bed is a grid of spots (rows × spots per row) — set the spot size so the app knows how many plants fit. Fruit trees, berries and vines get one card per type, however many you have.'],
    ['Set your suburb','⚙️ Settings → Weather location. It powers the watering advice and suggests your climate zone, which shifts every planting time and pest season.'],
    ['Choose how hands-on','⚙️ Settings → How hands-on? <b>No maintenance</b> only tells you what’s ready to pick. <b>Low</b> adds the essentials. <b>Standard</b> is the full guide with pest checks, feeding and netting.']]],
  ['🌿','Planting',[
    ['Plant a spot','Tap an empty spot. Plants that suit the season (and that bed) come first; faded ones are better planted later. Search finds plants and varieties.'],
    ['Already in the ground?','When planting, pick the date you really planted it — “1 month ago” and so on. Harvest dates and jobs are worked out from that date. Change it later from the plant’s sheet.'],
    ['Varieties','Tomatoes, beans, lettuce and more ask which variety. Not sure? Pick “any” — you can change it later.'],
    ['Your own plants & seeds','Not in the list? Search for it and tap <b>Add</b>. Keep your seed packets in the Plants tab → Seed box, and the app tells you when to sow them.']]],
  ['✋','Moving & editing',[
    ['Move a plant','Press and hold a plant for a moment, then drag it to another spot. Dropping it on another plant swaps them.'],
    ['Change several at once','Tap <b>✓ Select</b> above the beds, tap the plants, then use the bar at the bottom to set their status, planted date, or remove them.'],
    ['Resize or rename a bed','Tap ✏️ on the bed. Shrinking a bed removes the plants outside the new size (you can undo).'],
    ['Made a mistake?','Most changes show a message with <b>Undo</b> for a few seconds.']]],
  ['🧺','Harvesting',[
    ['Harvest some vs Harvest all','<b>Harvest some</b> — you picked a few leaves or fruit and it keeps growing. <b>Harvest all</b> — the final harvest: the plant is finished and a job reminds you to pull it out. Root crops like carrots free their spot straight away.'],
    ['Fruit trees','Tap the tree’s card and log what you picked: +1, +5 or a bowl. The app turns it into kilograms and dollars.'],
    ['What it’s all worth','At the bottom of the Harvest tab, tap the total to see what each bed and tree has grown this year.']]],
  ['🐝','Jobs & reminders',[
    ['What shows in Jobs','Everything to do, made from what you’re growing, the season and your weather: harvests, watering, feeding, pest checks and seasonal jobs. Tick a job when it’s done.'],
    ['Too many jobs?','Switch to Low or No maintenance in ⚙️ Settings.'],
    ['Calendar reminders','Jobs → <b>📅 Add reminders to my calendar</b> adds a weekly garden check and upcoming harvests to your phone’s calendar.']]],
  ['🐛','Pests & problems',[
    ['Identify a problem','Pests tab → Identify: say where the problem is, tap what you can see, and it suggests the most likely causes with photos and fixes.'],
    ['Natural remedies only','⚙️ Settings → Remedies hides shop-bought options.']]],
  ['🎨','What the colours mean',[
    ['Spots in a bed','Dark green: seed or seedling. Green: growing. Glowing gold: ready to pick. Orange: bolting — pick now. Grey: finished, ready to pull out. Brown with ＋: empty.'],
    ['Fruit tree cards','Gold glow: picking season. The line under the name says what it’s doing — young, flowering, fruit forming, resting or dormant.']]],
  ['☁️','Saving & sharing',[
    ['Where your garden is saved','On this device, automatically. Sign in (⚙️ → Sign in) to back it up and see it on your other devices.'],
    ['Share with your household','Once signed in: ⚙️ → Account & sync → Invite. They sign in with that email and see the same garden.'],
    ['iPhone users','Add the app to your home screen (Safari → Share → Add to Home Screen). Otherwise Safari can clear website data you haven’t opened for a week.']]],
];
function openHelp(){
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">❓ Help & tips</div><div class="sh-sub">Tap a question</div></div><button class="sh-cancel" onclick="openSettings()">✕ Back</button></div></div>
    ${HELP.map(([e,t,qs])=>`<div class="stat-lbl" style="margin-top:12px">${e} ${t}</div><div class="pest-guide">${qs.map(([q,a])=>`<details class="pg"><summary><span>${q}</span></summary><div class="pg-body"><div class="pest-txt">${a}</div></div></details>`).join('')}</div>`).join('')}
    <div class="set-txt" style="margin-top:14px">Still stuck, or found something broken?</div>
    <button class="btn btn-seed btn-full" onclick="openFeedback()">💬 Send feedback</button></div>`);
}

// ── Feedback ── saved to the Supabase "feedback" table; only the app owner can read it
const FB_K='gdn_fb_draft';
const FB_KINDS=[['bug','🐛','Something’s broken'],['confusing','🤔','Confusing'],['idea','💡','An idea'],['other','💬','Something else']];
let _fbKind='bug';
function fbDraft(){try{return JSON.parse(localStorage.getItem(FB_K))||{};}catch(e){return{};}}
function fbSaveDraft(){try{localStorage.setItem(FB_K,JSON.stringify({k:_fbKind,m:$('fb-m')?.value||'',e:$('fb-e')?.value||''}));}catch(e){}}
function openFeedback(){
  const d=fbDraft();_fbKind=d.k||_fbKind;
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">💬 Send feedback</div><div class="sh-sub">Goes straight to the people making the app</div></div><button class="sh-cancel" onclick="fbSaveDraft();openSettings()">✕ Back</button></div></div>
    <div class="fm-lbl">What’s it about?</div>
    <div class="fb-kinds">${FB_KINDS.map(([k,e,l])=>`<button class="fm-cat${_fbKind===k?' sel':''}" data-k="${k}" onclick="_fbKind='${k}';document.querySelectorAll('.fb-kinds .fm-cat').forEach(b=>b.classList.toggle('sel',b.dataset.k==='${k}'));fbSaveDraft()">${e} ${l}</button>`).join('')}</div>
    <div class="fm-lbl">Tell us more</div>
    <textarea class="fm-in" id="fb-m" rows="5" maxlength="2000" placeholder="What happened, or what would make it better? If something broke, what were you doing just before?" oninput="fbSaveDraft()">${esc(d.m||'')}</textarea>
    <div class="fm-lbl">Your email (optional)</div>
    <input class="fm-in" id="fb-e" type="email" maxlength="200" placeholder="Only if you’d like a reply" value="${esc(d.e||SYNC.email||'')}" oninput="fbSaveDraft()">
    <div class="fm-help">We also send which tab you were on, the app version and your type of phone — nothing from your garden except its size.</div>
    <button class="btn btn-seed btn-full" id="fb-send" style="margin-top:12px" onclick="sendFeedback()">Send</button></div>`);
}
function requestPlant(name){
  try{localStorage.setItem(FB_K,JSON.stringify({k:'idea',m:`Please add ${name||'…'} to the plant list.`,e:SYNC.email||''}));}catch(e){}
  _fbKind='idea';openFeedback();
}
function appVersion(){return(document.querySelector('script[src*="main.js"]')?.src.match(/v=(\d+)/)||[])[1]||'?';}
async function sendFeedback(){
  const message=$('fb-m').value.trim(),email=$('fb-e').value.trim();
  if(!message){toast('Write a few words first');$('fb-m').focus();return;}
  if(email&&!/^\S+@\S+\.\S+$/.test(email)){toast('That email doesn’t look right — or leave it blank');return;}
  fbSaveDraft();$('fb-send').disabled=true;
  try{
    const c=await sb();
    const{error}=await c.from('feedback').insert({kind:_fbKind,message:message.slice(0,2000),email:email||null,view:curView,app_version:appVersion(),
      device:navigator.userAgent.slice(0,300),meta:{zone:zone(),mode:maint(),beds:vegBedCount(),trees:ST.beds.length-vegBedCount(),plants:plantedCells().length,installed:isInstalled(),signedIn:signedIn()}});
    if(error)throw error;
    try{localStorage.removeItem(FB_K);}catch(e){}
    closeSheet();toast('💚 Thanks — feedback sent');
  }catch(e){$('fb-send')&&($('fb-send').disabled=false);toast(e.message==='offline'?'You’re offline — your message is saved, send it later':'Couldn’t send just now — your message is saved, try again');}
}
