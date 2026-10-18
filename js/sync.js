// Account & sync (Supabase). Local-first: the garden always saves on the device, then syncs a couple of
// seconds later. Other devices' changes are pulled when the app opens or comes back to the front.
// Conflicts: whichever change was made most recently wins (fine for a household; noted in Settings).
'use strict';
const SYNC_K='gdn_sync';
let SYNC=(()=>{try{return JSON.parse(localStorage.getItem(SYNC_K))||{};}catch(e){return{};}})();
// SYNC: {email, gid, name, base (server updated_at we last saw), dirtyAt (when local changed since), lastSync, status}
function saveSync(){try{localStorage.setItem(SYNC_K,JSON.stringify(SYNC));}catch(e){}}
let _sb=null,_pushT=null,_applying=false;

// Load the Supabase library only when sync is used, so the app still opens offline
function loadLib(){
  if(window.supabase)return Promise.resolve();
  return new Promise((ok,fail)=>{const s=document.createElement('script');s.src=SB_LIB;s.onload=ok;s.onerror=()=>fail(new Error('offline'));document.head.appendChild(s);});
}
async function sb(){
  if(_sb)return _sb;
  await loadLib();
  _sb=window.supabase.createClient(SB_URL,SB_KEY,{auth:{persistSession:true,autoRefreshToken:true,storageKey:'gdn_auth',detectSessionInUrl:true,flowType:'implicit'}});
  return _sb;
}
const signedIn=()=>!!SYNC.gid&&!!SYNC.email;
function setSyncStatus(s){SYNC.status=s;saveSync();updateHeader();}

// Called by saveState(): queue a push
function syncAfterSave(){
  if(_applying||!signedIn())return;
  SYNC.dirtyAt=new Date().toISOString();saveSync();setSyncStatus('pending');
  clearTimeout(_pushT);_pushT=setTimeout(pushGarden,1500);
}
async function pushGarden(){
  if(!signedIn()||!SYNC.dirtyAt)return;
  try{
    const c=await sb();setSyncStatus('syncing');
    let {data:ts,error}=await c.rpc('save_garden',{p_id:SYNC.gid,p_data:ST,p_base:SYNC.base||null});
    if(error)throw error;
    if(!ts){ // someone else saved since we last pulled — newest change wins
      const remote=await fetchGarden();
      if(remote&&remote.updated_at>SYNC.dirtyAt){applyRemote(remote,'🔄 Another device had newer changes — updated');return;}
      ({data:ts,error}=await c.rpc('save_garden',{p_id:SYNC.gid,p_data:ST,p_base:null}));if(error)throw error;
    }
    SYNC.base=ts;SYNC.dirtyAt=null;SYNC.lastSync=new Date().toISOString();setSyncStatus('synced');
  }catch(e){setSyncStatus('offline');}
}
async function fetchGarden(){
  const c=await sb();const{data,error}=await c.from('gardens').select('id,name,data,updated_at').eq('id',SYNC.gid).maybeSingle();
  if(error)throw error;return data;
}
// Pull on open / return: take newer changes from other devices, push ours if they're newer
async function pullGarden(){
  if(!signedIn())return;
  try{
    setSyncStatus('syncing');
    const remote=await fetchGarden();
    if(!remote){SYNC={};saveSync();updateHeader();toast('You no longer have access to that garden — signed out of sync');return;}
    SYNC.name=remote.name;
    if(SYNC.base&&remote.updated_at<=SYNC.base){if(SYNC.dirtyAt)await pushGarden();else setSyncStatus('synced');return;}
    if(SYNC.dirtyAt&&SYNC.dirtyAt>remote.updated_at){await pushGarden();return;}
    applyRemote(remote,SYNC.base?'🔄 Updated with changes from another device':null);
  }catch(e){setSyncStatus('offline');}
}
function applyRemote(remote,msg){
  _applying=true;
  try{ST=migrate(remote.data&&remote.data.beds?remote.data:freshState());saveState();applyCustomPlants();}finally{_applying=false;}
  SYNC.base=remote.updated_at;SYNC.dirtyAt=null;SYNC.name=remote.name;SYNC.lastSync=new Date().toISOString();setSyncStatus('synced');
  refreshAll();if(msg)toast(msg);
}

// Returning from the email link: the address carries the session (#access_token=…) or an error
async function finishLinkSignIn(){
  const h=location.hash;
  if(!/access_token=|error_description=/.test(h))return;
  const clean=()=>history.replaceState(null,'',location.pathname+location.search);
  if(/error_description=/.test(h)){const m=decodeURIComponent((h.match(/error_description=([^&]+)/)||[])[1]||'').replace(/\+/g,' ');clean();toast('Sign-in link didn\'t work: '+(m||'it may have expired — send a new one'));return;}
  try{
    const c=await sb();const{data:{session}}=await c.auth.getSession();clean();
    if(!session)throw new Error('no session');
    SYNC.email=session.user.email;delete SYNC.pendingEmail;saveSync();
    await afterSignIn();
  }catch(e){clean();toast('Couldn\'t finish signing in — try sending a new link');}
}

// ── Sign in with an emailed link or 6-digit code ──
async function sendCode(){
  const email=$('ac-email').value.trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(email)){toast('Enter your email address');return;}
  try{
    const c=await sb();$('ac-send').disabled=true;
    // The email has a link back to this app (and a 6-digit code too, once the template includes {{ .Token }})
    const{error}=await c.auth.signInWithOtp({email,options:{shouldCreateUser:true,emailRedirectTo:location.origin+location.pathname}});
    if(error)throw error;
    SYNC.pendingEmail=email;saveSync();openAccount();toast('📧 Sent — check your email');
  }catch(e){$('ac-send')&&($('ac-send').disabled=false);toast(e.message==='offline'?'Can\'t reach the sync service — check your connection':'Couldn\'t send the code: '+(e.message||'try again'));}
}
async function verifyCode(){
  const email=SYNC.pendingEmail,token=$('ac-code').value.replace(/\D/g,'');
  if(token.length<6){toast('Enter the 6-digit code from the email');return;}
  try{
    const c=await sb();const{data,error}=await c.auth.verifyOtp({email,token,type:'email'});
    if(error)throw error;
    SYNC.email=data.user.email;delete SYNC.pendingEmail;saveSync();
    await afterSignIn();
  }catch(e){toast('That code didn\'t work — check it, or send a new one');}
}
// First sign-in on this device: join invited gardens, then pick or create the garden to sync
async function afterSignIn(){
  const c=await sb();
  await c.rpc('claim_invites');
  const{data:rows,error}=await c.from('garden_members').select('garden_id,role,gardens(id,name,updated_at)').eq('user_id',(await c.auth.getUser()).data.user.id);
  if(error)throw error;
  const gardens=(rows||[]).map(r=>({...r.gardens,role:r.role})).filter(g=>g.id);
  const hasLocal=ST.beds.length>0;
  if(!gardens.length){
    const{data:gid,error:e2}=await c.rpc('create_garden',{p_name:'My garden',p_data:ST});if(e2)throw e2;
    SYNC.gid=gid;SYNC.name='My garden';SYNC.base=null;SYNC.dirtyAt=new Date().toISOString();saveSync();
    await pushGarden();closeSheet();toast('☁️ Signed in — your garden is backed up');return;
  }
  if(gardens.length===1&&!hasLocal){SYNC.gid=gardens[0].id;SYNC.base=null;saveSync();await pullGarden();closeSheet();toast('☁️ Signed in — garden loaded');return;}
  chooseGarden(gardens,hasLocal);
}
// Choose which cloud garden to use, and what to do with this device's garden
function chooseGarden(gardens,hasLocal){
  showSheet(`<div class="sh-body"><div class="sh-heading">☁️ Which garden?</div><div class="sh-sub">${hasLocal?'This device already has a garden. Choose how to combine them.':'Choose a garden to open on this device.'}</div>
    ${gardens.map(g=>`<div class="var-card static" style="margin-top:8px"><div class="var-top"><span class="var-e">🌱</span><span class="var-n">${esc(g.name)}</span><span class="var-d">${g.role==='owner'?'yours':'shared with you'}</span></div>
      <div class="btn-row" style="margin-top:8px"><button class="btn btn-seed" onclick="useGarden('${g.id}','cloud')">Open it here</button>${hasLocal?`<button class="btn btn-cancel" onclick="useGarden('${g.id}','upload')">Replace it with this device's</button>`:''}</div></div>`).join('')}
    ${hasLocal?`<button class="btn btn-cancel btn-full" style="margin-top:10px" onclick="useGarden(null,'new')">Keep this device's garden as a new one</button>`:''}
    <div class="set-txt" style="margin-top:8px">"Open it here" replaces what's on this device. Export a backup first in Settings if you're unsure.</div></div>`);
}
async function useGarden(gid,how){
  try{
    const c=await sb();
    if(how==='new'){const{data,error}=await c.rpc('create_garden',{p_name:'My garden',p_data:ST});if(error)throw error;gid=data;}
    SYNC.gid=gid;SYNC.base=null;saveSync();
    if(how==='cloud')await pullGarden();else{SYNC.dirtyAt=new Date().toISOString();saveSync();await pushGarden();}
    closeSheet();toast('☁️ Sync is on');
  }catch(e){toast('Couldn\'t set up sync — try again');}
}
async function signOut(){
  try{const c=await sb();await c.auth.signOut();}catch(e){}
  SYNC={};saveSync();updateHeader();closeSheet();toast('Signed out — your garden stays on this device');
}
async function inviteMember(){
  const email=$('ac-invite').value.trim().toLowerCase();
  if(!/^\S+@\S+\.\S+$/.test(email)){toast('Enter their email address');return;}
  try{const c=await sb();const{error}=await c.rpc('invite_member',{p_garden:SYNC.gid,p_email:email});if(error)throw error;
    toast('✉️ Invite saved — ask them to sign in with that email');openAccount();}
  catch(e){toast('Couldn\'t save the invite — try again');}
}

// ── The account sheet (from Settings) ──
async function openAccount(){
  if(!signedIn()){
    const p=SYNC.pendingEmail;
    showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">☁️ Sign in to sync</div><div class="sh-sub">Back up your garden and share it with your household</div></div><button class="sh-cancel" onclick="openSettings()">✕ Back</button></div></div>
      ${p?`<div class="set-txt">📧 We emailed <b>${esc(p)}</b>. <b>Tap the link in the email</b> — it opens the app signed in. Open it on this device.</div>
        <div class="set-txt">If the email has a 6-digit code instead, type it here:</div>
        <input class="fm-in" id="ac-code" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="123456" style="font-size:22px;letter-spacing:6px;text-align:center">
        <button class="btn btn-seed btn-full" style="margin-top:10px" onclick="verifyCode()">Sign in</button>
        <button class="link-btn" onclick="delete SYNC.pendingEmail;saveSync();openAccount()">Use a different email / send a new code</button>`
      :`<div class="fm-lbl">Your email</div><input class="fm-in" id="ac-email" type="email" autocomplete="email" placeholder="you@example.com">
        <button class="btn btn-seed btn-full" id="ac-send" style="margin-top:10px" onclick="sendCode()">📧 Email me a sign-in link</button>
        <div class="set-txt" style="margin-top:8px">No password — we email you a sign-in link each time you sign in on a new device.</div>`}
    </div>`);
    return;
  }
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">☁️ Account & sync</div><div class="sh-sub">${esc(SYNC.email)}</div></div><button class="sh-cancel" onclick="openSettings()">✕ Back</button></div></div>
    <div class="pi-facts"><div><div class="sh-cl">Garden</div><div class="pi-v">${esc(SYNC.name||'My garden')}</div></div><div><div class="sh-cl">Last synced</div><div class="pi-v">${SYNC.lastSync?new Date(SYNC.lastSync).toLocaleString('en-AU',{day:'numeric',month:'short',hour:'numeric',minute:'2-digit'}):'—'}</div></div></div>
    <button class="btn btn-cancel btn-full" onclick="pullGarden().then(()=>{toast('🔄 Synced');openAccount();})">🔄 Sync now</button>
    <div class="fm-lbl" style="margin-top:16px">Share with your household</div>
    <div class="fm-emoji-row"><input class="fm-in" id="ac-invite" type="email" placeholder="their@email.com"><button class="btn btn-seed btn-inline" onclick="inviteMember()">Invite</button></div>
    <div class="set-txt" id="ac-people" style="margin-top:6px">Loading…</div>
    <div class="set-txt" style="margin-top:10px">If two people change the garden at the same moment, the most recent change wins.</div>
    <button class="btn btn-cancel btn-full" style="margin-top:12px" onclick="signOut()">Sign out on this device</button></div>`);
  try{
    const c=await sb();
    const[{data:m},{data:inv}]=await Promise.all([c.from('garden_members').select('user_id,role').eq('garden_id',SYNC.gid),c.from('garden_invites').select('email').eq('garden_id',SYNC.gid)]);
    if($('ac-people'))$('ac-people').innerHTML=`${(m||[]).length===1?'Just you':`${(m||[]).length} people`} in this garden${(inv||[]).length?` · waiting for: ${inv.map(i=>esc(i.email)).join(', ')}`:''}`;
  }catch(e){if($('ac-people'))$('ac-people').textContent='Can\'t load members while offline.';}
}
function syncLabel(){
  if(!signedIn())return'saved on this device';
  return{synced:'synced ✓',syncing:'syncing…',pending:'saving…',offline:'offline — will sync'}[SYNC.status]||'synced';
}
