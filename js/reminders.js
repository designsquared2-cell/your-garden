// Calendar reminders: export upcoming garden dates as a calendar file (.ics) the phone's calendar imports,
// with an alert on each. Works without any server. It's a snapshot — export again after big changes.
'use strict';
const WEEKDAYS=[['MO','Monday'],['TU','Tuesday'],['WE','Wednesday'],['TH','Thursday'],['FR','Friday'],['SA','Saturday'],['SU','Sunday']];

function openReminders(){
  const r=ST.prefs.reminders||{weekly:true,day:'SA',time:'08:00',harvest:true,prevent:true,seeds:true};
  showSheet(`<div class="sh-body"><div class="sh-sticky"><div class="sh-toprow"><div><div class="sh-heading">📅 Add reminders to my calendar</div><div class="sh-sub">Puts garden dates in your phone's calendar, with alerts</div></div><button class="sh-cancel" onclick="closeSheet()">✕ Cancel</button></div></div>
    <label class="fm-check"><input type="checkbox" id="rm-weekly"${r.weekly?' checked':''}> Weekly garden check — a nudge to open Jobs</label>
    <div class="fm-2col" style="margin:6px 0 4px 26px"><select class="fm-in" id="rm-day">${WEEKDAYS.map(([c,n])=>`<option value="${c}"${r.day===c?' selected':''}>${n}</option>`).join('')}</select><input class="fm-in date-in" id="rm-time" type="time" value="${r.time}"></div>
    <label class="fm-check"><input type="checkbox" id="rm-harvest"${r.harvest?' checked':''}> When each crop should be ready to harvest</label>
    <label class="fm-check"><input type="checkbox" id="rm-prevent"${r.prevent?' checked':''}> Pest prevention — net, trap or mulch before pests arrive</label>
    <label class="fm-check"><input type="checkbox" id="rm-seeds"${r.seeds?' checked':''}> When to sow the packets in your seed box</label>
    <button class="btn btn-seed btn-full" style="margin-top:16px" onclick="exportReminders()">📅 Download calendar file</button>
    <div class="set-txt" style="margin-top:10px"><b>iPhone:</b> tap the downloaded file, then <b>Add All</b>. <b>Android:</b> open it with Google Calendar.<br>It's a snapshot of today's plan — download again after big changes (new plantings, new seed packets).</div></div>`);
}
// ── Building the file ──
const pad=n=>String(n).padStart(2,'0');
function icsDate(iso,time){return iso.replace(/-/g,'')+(time?'T'+time.replace(':','')+'00':'');}
function icsText(s){return String(s).replace(/\\/g,'\\\\').replace(/;/g,'\\;').replace(/,/g,'\\,').replace(/\n/g,'\\n');}
// Fold long lines to 75 characters, as the calendar format expects
function icsFold(line){let out='';while(line.length>74){out+=line.slice(0,74)+'\r\n ';line=line.slice(74);}return out+line;}
function icsEvent({id,date,time,mins=30,title,desc,rrule}){
  const now=new Date(),stamp=`${now.getUTCFullYear()}${pad(now.getUTCMonth()+1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}00Z`;
  const [h,mi]=time.split(':').map(Number),endM=h*60+mi+mins,end=`${pad(Math.floor(endM/60)%24)}:${pad(endM%60)}`;
  return['BEGIN:VEVENT',`UID:${id}@garden-app`,`DTSTAMP:${stamp}`,`DTSTART:${icsDate(date,time)}`,`DTEND:${icsDate(date,end)}`,
    `SUMMARY:${icsText(title)}`,`DESCRIPTION:${icsText(desc||'')}`,...(rrule?[`RRULE:${rrule}`]:[]),
    'BEGIN:VALARM','ACTION:DISPLAY',`DESCRIPTION:${icsText(title)}`,'TRIGGER:-PT0M','END:VALARM','END:VEVENT'].map(icsFold).join('\r\n');
}
// First day of each month in the next 12 where a season (a set of months) starts
function seasonStarts(inSeason){
  const d=new Date(),out=[];
  for(let i=1;i<=12;i++){const t=new Date(d.getFullYear(),d.getMonth()+i,1),m=t.getMonth(),prev=(m+11)%12;if(inSeason(m)&&!inSeason(prev))out.push(localDate(t));}
  return out;
}
function reminderEvents(r){
  const ev=[],td=localDate(),time=r.time||'08:00';
  if(r.weekly){
    const want=WEEKDAYS.findIndex(([c])=>c===r.day),d=new Date();const jsDay=(want+1)%7;d.setDate(d.getDate()+((jsDay-d.getDay()+7)%7||7));
    ev.push({id:'weekly',date:localDate(d),time,title:'🌱 Garden check',desc:'Open the Garden app — Jobs shows what needs doing this week.',rrule:`FREQ=WEEKLY;BYDAY=${r.day};COUNT=52`});
  }
  if(r.harvest){
    const groups=new Map();
    plantedCells().forEach(x=>{
      if(!['seed','seedling','growing'].includes(x.cell.s))return;const exp=expectedDate(x.cell);if(!exp||exp<=td||daysBetween(td,exp)>200)return;
      const k=x.bi+':'+x.cell.p+':'+(x.cell.v||'');if(!groups.has(k)||exp<groups.get(k).exp)groups.set(k,{exp,x});
    });
    groups.forEach(({exp,x},k)=>ev.push({id:'harvest-'+k.replace(/[^a-z0-9]+/gi,'-'),date:exp,time,title:`🧺 ${unesc(cellName(x.cell))} should be ready`,desc:`${x.bed.name}. ${READY_SIGN[x.cell.p]||'Check if it looks ready to pick.'}`}));
  }
  if(r.prevent)Object.entries(GUARDS).forEach(([id,g])=>{
    if(!guardCells(g).length)return;
    seasonStarts(m=>pestMonthIn(g.months,m)).forEach(date=>ev.push({id:`guard-${id}-${date}`,date,time,title:`🛡️ ${g.act}`,desc:g.how}));
  });
  if(r.seeds)ST.seeds.filter(s=>P[s.p]).forEach(s=>{
    const sow=seedSow(s);if(sow)seasonStarts(m=>sow.includes(m)).forEach(date=>ev.push({id:`seed-${s.id}-${date}`,date,time,title:`🌰 Time to sow ${seedName(s)}`,desc:'From your seed box.'}));
  });
  return ev;
}
function exportReminders(){
  const r={weekly:$('rm-weekly').checked,day:$('rm-day').value,time:$('rm-time').value||'08:00',harvest:$('rm-harvest').checked,prevent:$('rm-prevent').checked,seeds:$('rm-seeds').checked};
  ST.prefs.reminders=r;saveState();
  const ev=reminderEvents(r);
  if(!ev.length){toast('Nothing to add yet — tick at least one option');return;}
  const ics=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Your Garden//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','X-WR-CALNAME:Your Garden',...ev.map(icsEvent),'END:VCALENDAR'].join('\r\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([ics],{type:'text/calendar'}));a.download=`garden-reminders-${localDate()}.ics`;
  document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  closeSheet();toast(`📅 Calendar file ready — ${plural(ev.length,'reminder')}`);
}
