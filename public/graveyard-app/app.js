// Subscription Graveyard: the app.
// Everything the user does is saved on this device (localStorage). The bank connection
// is a Plaid Sandbox demo handled by the /api routes. No real bank data is ever used.

/* =========================================================================
   Plot (exported from the "Mascot / Plot" component in Figma) and tab icons
   ========================================================================= */
const P_STONE='<path d="M55 168V82C55 51.3333 70 36 100 36C130 36 145 51.3333 145 82V168H55Z" fill="#C9C4D6" stroke="#1E1B2E" stroke-width="5" stroke-linejoin="round"/><path d="M68 82C68 64 75.6667 52.6667 91 48" stroke="white" stroke-opacity="0.75" stroke-width="5" stroke-linecap="round"/><path d="M131 58L124 67L130 72" stroke="#1E1B2E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M84 128H116M89 139H111" stroke="#8E88A3" stroke-width="3.5" stroke-linecap="round"/>';
const P_BLUSH='<ellipse cx="76" cy="106" rx="8" ry="4.5" fill="#FF9EC4"/><ellipse cx="124" cy="106" rx="8" ry="4.5" fill="#FF9EC4"/>';
const P_DIRT='<path d="M14 172C30 152 58.6667 144.667 100 150C141.333 144.667 170 152 186 172C187.333 184 158.667 190 100 190C41.3333 190 12.6667 184 14 172Z" fill="#6B4A3A" stroke="#1E1B2E" stroke-width="5" stroke-linejoin="round"/><circle cx="48" cy="174" r="3" fill="#8C6550"/><circle cx="140" cy="179" r="3.5" fill="#8C6550"/><circle cx="100" cy="172" r="2.5" fill="#8C6550"/><circle cx="162" cy="168" r="2.5" fill="#8C6550"/><circle cx="76" cy="181" r="2" fill="#8C6550"/>';
const P_HANDS='<ellipse cx="62" cy="153" rx="10" ry="7.5" fill="#C9C4D6" stroke="#1E1B2E" stroke-width="4"/><ellipse cx="138" cy="153" rx="10" ry="7.5" fill="#C9C4D6" stroke="#1E1B2E" stroke-width="4"/><path d="M26 166L29 155L32 163L36 150L38 164" stroke="#7FD67A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M164 163L167 153L170 160L173 149L175 162" stroke="#7FD67A" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>';
const P_FACE={
 Content:'<ellipse cx="85" cy="92" rx="5.5" ry="7" fill="#1E1B2E"/><ellipse cx="115" cy="92" rx="5.5" ry="7" fill="#1E1B2E"/><circle cx="87" cy="89" r="2" fill="white"/><circle cx="117" cy="89" r="2" fill="white"/><path d="M93 106C97.6667 110.667 102.333 110.667 107 106" stroke="#1E1B2E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
 Sleepy:'<path d="M78 93C82.6667 97 87.3333 97 92 93" stroke="#1E1B2E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M108 93C112.667 97 117.333 97 122 93" stroke="#1E1B2E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M96 109H104" stroke="#1E1B2E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>',
 Alarmed:'<circle cx="84" cy="91" r="9" fill="white" stroke="#1E1B2E" stroke-width="3"/><circle cx="116" cy="91" r="9" fill="white" stroke="#1E1B2E" stroke-width="3"/><circle cx="84" cy="92" r="3.5" fill="#1E1B2E"/><circle cx="116" cy="92" r="3.5" fill="#1E1B2E"/><ellipse cx="100" cy="113" rx="5" ry="7" fill="#1E1B2E"/>',
 Resurrected:'<path d="M78 96C82.6667 90.6667 87.3333 90.6667 92 96" stroke="#1E1B2E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M108 96C112.667 90.6667 117.333 90.6667 122 96" stroke="#1E1B2E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M90 104C96.6667 112.667 103.333 112.667 110 104" stroke="#1E1B2E" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>'
};
const P_EXTRA={
 Content:'',
 Sleepy:'<path d="M152 44H163L152 56H163" stroke="#1E1B2E" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/><path d="M170 24H177L170 32H177" stroke="#1E1B2E" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>',
 Alarmed:'<path d="M152 66C156.667 74 156.667 80.3333 152 85C147.333 80.3333 147.333 74 152 66Z" fill="#8FD3FF" stroke="#1E1B2E" stroke-width="2.5" stroke-linejoin="round"/><path d="M158 42L168 30M164 56L178 52M40 42L30 30M36 56L22 52" stroke="#FF8A3D" stroke-width="4" stroke-linecap="round"/>',
 Resurrected:'<ellipse cx="100" cy="20" rx="28" ry="7" stroke="#FFD166" stroke-width="5"/><path d="M162 42L165 50L173 52L165 54L162 62L159 54L151 52L159 50L162 42Z" fill="#FFD166"/><path d="M36 60L38 65L43 66L38 67L36 72L34 67L29 66L34 65L36 60Z" fill="#FFD166"/>'
};
let clipN=0;
function plot(mood,size,cls=''){const id='pc'+(++clipN);return `<svg class="plot mood-${mood} ${cls}" width="${size}" height="${size}" viewBox="0 0 200 200" fill="none" aria-hidden="true"><defs><clipPath id="${id}"><rect x="0" y="-40" width="200" height="205"/></clipPath></defs><g class="plot-extra">${P_EXTRA[mood]}</g><g clip-path="url(#${id})"><g class="plot-body">${P_STONE}${P_FACE[mood]}${P_BLUSH}</g></g>${P_DIRT}${P_HANDS}</svg>`;}
const ICON={
 home:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 11.5L12 5L20 11.5V19C20 19.6667 19.6667 20 19 20H5C4.33333 20 4 19.6667 4 19V11.5Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 20V15H14V20" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 checkin:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12.5 7H7.5C5.84315 7 4.5 8.34315 4.5 10V17.5C4.5 19.1569 5.84315 20.5 7.5 20.5H12.5C14.1569 20.5 15.5 19.1569 15.5 17.5V10C15.5 8.34315 14.1569 7 12.5 7Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M8.5 3.5H16.5C18.5 3.5 19.5 4.5 19.5 6.5V16.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 graveyard:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 19V10C7 6.66667 8.66667 5 12 5C15.3333 5 17 6.66667 17 10V19" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3.5 20.5C9.16667 17.8333 14.8333 17.8333 20.5 20.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M10 11.5H14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
 log:'<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M6 3.5H18V20.5L15.5 19L13 20.5L10.5 19L8 20.5L6 19V3.5Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 8H15M9 11.5H15M9 15H13" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
};

const SI={
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 20c1.5-4 4.5-6 8-6s6.5 2 8 6"/>',
 bank:'<path d="M3 10l9-6 9 6M5 10v8M9.5 10v8M14.5 10v8M19 10v8M3 20h18"/>',
 scan:'<path d="M20 12a8 8 0 1 1-2.3-5.7M20 4v4h-4"/>',
 unlink:'<path d="M10 14a4 4 0 0 1 0-5.6l2-2a4 4 0 0 1 5.6 5.6l-1 1M14 10a4 4 0 0 1 0 5.6l-2 2a4 4 0 0 1-5.6-5.6l1-1M4 4l16 16"/>',
 bell:'<path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0"/>',
 alarm:'<circle cx="12" cy="13" r="7"/><path d="M12 10v3l2 2M5 4L3 6M19 4l2 2"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 sort:'<path d="M7 4v16M4 17l3 3 3-3M17 20V4M14 7l3-3 3 3"/>',
 motion:'<path d="M3 12h4l2-5 4 10 2-5h6"/>',
 cal:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 download:'<path d="M12 4v11M7 11l5 5 5-5M5 20h14"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/>',
 trash:'<path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5v.5"/>',
 phone:'<rect x="7" y="3" width="10" height="18" rx="2.5"/><path d="M11 18h2"/>',
 chev:'<path d="M9 6l6 6-6 6"/>'
};
const sicon=(k,bg)=>`<span class="set-ic" style="background:var(--${bg})"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SI[k]}</svg></span>`;
const chev=`<svg class="chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SI.chev}</svg>`;
function srow({icon,bg,label,sub,value,a,arg,toggle,on,danger,link,id}){const inner=`${sicon(icon,bg)}<span class="set-label"><span${danger?' class="c-danger"':''}>${label}</span>${sub?`<span class="set-sub">${sub}</span>`:''}</span>${value!==undefined?`<span class="set-val">${value}</span>`:''}${toggle?`<span class="toggle" role="switch" aria-checked="${!!on}" aria-hidden="true"></span>`:''}${(a&&!toggle&&!danger)||link?chev:''}`;
 if(link)return `<a class="set-row" href="${link}" target="_blank" rel="noopener noreferrer">${inner}</a>`;
 return a?`<button class="set-row" ${act(a,arg||'')}${toggle?` role="switch" aria-checked="${!!on}"`:''}${id?` id="${id}"`:''}>${inner}</button>`:`<div class="set-row">${inner}</div>`;}

/* =========================================================================
   Real services: where "cancel" and "re-subscribe" go
   ========================================================================= */
const SEARCH=q=>'https://www.google.com/search?q='+encodeURIComponent(q);
const APPLE_SUBS='https://apps.apple.com/account/subscriptions';
const CATALOG={
 'Netflix':{cancel:'https://www.netflix.com/cancelplan',home:'https://www.netflix.com/'},
 'Hulu':{cancel:'https://secure.hulu.com/account',home:'https://www.hulu.com/'},
 'Spotify':{cancel:'https://www.spotify.com/account/',home:'https://www.spotify.com/premium/'},
 'Disney+':{cancel:'https://www.disneyplus.com/account',home:'https://www.disneyplus.com/'},
 'YouTube Premium':{cancel:'https://www.youtube.com/paid_memberships',home:'https://www.youtube.com/premium'},
 'iCloud+':{cancel:APPLE_SUBS,home:'https://www.icloud.com/',apple:true},
 'Apple TV+':{cancel:APPLE_SUBS,home:'https://tv.apple.com/',apple:true},
 'Google One':{cancel:'https://one.google.com/',home:'https://one.google.com/'},
 'Paramount+':{cancel:'https://www.paramountplus.com/account/',home:'https://www.paramountplus.com/'},
 'Peacock':{cancel:'https://www.peacocktv.com/account',home:'https://www.peacocktv.com/',price:7.99},
 'Audible':{cancel:'https://www.audible.com/account',home:'https://www.audible.com/'},
 'Peloton App':{home:'https://www.onepeloton.com/app'},
 'Duolingo':{home:'https://www.duolingo.com/'},
 'Calm':{home:'https://www.calm.com/'},
 'Crunchyroll':{home:'https://www.crunchyroll.com/'},
 'Max':{home:'https://www.max.com/'},
 'Headspace':{home:'https://www.headspace.com/'}
};
const cancelUrl=n=>CATALOG[n]?.cancel||SEARCH(`how to cancel ${n} subscription`);
const homeUrl=n=>CATALOG[n]?.home||SEARCH(`${n} subscribe`);
const hasDirectCancel=n=>!!CATALOG[n]?.cancel;

/* =========================================================================
   Dates and money
   ========================================================================= */
const DAY=864e5;
const MONS=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const pad=n=>String(n).padStart(2,'0');
const isoOf=d=>`${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const parse=s=>{if(!s)return null;const [y,m,d]=s.slice(0,10).split('-').map(Number);return new Date(y,m-1,d);};
const today=()=>isoOf(new Date());
const addDays=(iso,n)=>{const d=parse(iso);d.setDate(d.getDate()+n);return isoOf(d);};
const daysBetween=(a,b)=>Math.round((parse(b)-parse(a))/DAY);
const fmtDay=iso=>{const d=parse(iso);return `${MONS[d.getMonth()]} ${d.getDate()}`;};
const fmtCaps=iso=>{const d=parse(iso);return `${MONS[d.getMonth()].toUpperCase()} ${d.getDate()}`;};
const monthKey=()=>{const d=new Date();return `${d.getFullYear()}-${pad(d.getMonth()+1)}`;};
const m=n=>'$'+(Math.round(n*100)/100).toFixed(2);
const uid=()=>Math.random().toString(36).slice(2,10);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $=(s,r=document)=>r.querySelector(s);

/* =========================================================================
   State (saved on this device)
   ========================================================================= */
const KEY='sg-state-v1';
const blank=()=>({v:1,profile:{name:''},prefs:{checkinNudge:false,trialAlerts:true,trialWarn:'48',sort:'least',reduceMotion:false},onboarded:false,bank:null,scan:null,removed:{},subs:[],trials:[],graves:[],log:[],bounces:{},checkins:{},lastAlert:null});
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return blank();const b=blank(),d=JSON.parse(raw);return {...b,...d,profile:{...b.profile,...d.profile},prefs:{...b.prefs,...d.prefs}};}catch{return blank();}}
if(new URLSearchParams(location.search).has('fresh')){try{localStorage.removeItem(KEY);}catch{}history.replaceState(null,'',location.pathname);}
let S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch{}}
// "Logging out" parks your data under a separate key on this phone; logging in brings it back.
const ACCOUNT_KEY='sg-account-v1';
function savedAccount(){try{const raw=localStorage.getItem(ACCOUNT_KEY);if(!raw)return null;const b=blank(),d=JSON.parse(raw);return {...b,...d,profile:{...b.profile,...d.profile},prefs:{...b.prefs,...d.prefs}};}catch{return null;}}
// Things that only matter while the app is open
const T={tab:'home',method:'bank',graveFilter:'all',logFilter:'All',queue:[],target:null,buried:null,tombId:null,revived:null,subId:null,trialId:null,deck:null,deckIndex:0,returnTo:'home',pendingReturn:false,flash:null,scanMsg:'',scanError:null,eraseArmed:false};

const monthly=s=>s.cadence==='yearly'?s.price/12:s.price;
const total=()=>S.subs.reduce((a,s)=>a+monthly(s),0);
const letter=n=>(n.match(/[A-Za-z0-9]/)||['?'])[0].toUpperCase();
const RATE={barely:{label:'Barely used',cls:'bg-pumpkin',uses:1,said:'barely touched it'},sometimes:{label:'Here and there',cls:'bg-candle',uses:4,said:'here and there'},constantly:{label:'Worth it',cls:'bg-moss',uses:20,said:'couldn’t live without it'}};
function chipFor(s){
  if(s.remindAt) return {t:`Reminder ${parse(s.remindAt)<=parse(today())?'today':DOW[parse(s.remindAt).getDay()].slice(0,3)}`,c:'bg-stone'};
  if(s.back&&!s.rating) return {t:'Back from the dead',c:'bg-blush'};
  if(s.rating) return {t:RATE[s.rating].label,c:RATE[s.rating].cls};
  return {t:'Not rated yet',c:'bg-stone'};
}
const order={barely:0,sometimes:1,undefined:2,null:2,constantly:3};
function cycleDays(c){return c.cadence==='yearly'?365:30.44;}
function savedFor(g){const since=g.lastCharge||g.buriedAt.slice(0,10);return Math.max(0,Math.floor(daysBetween(since,today())/cycleDays(g)))*g.price;}
const graveTotal=()=>S.graves.reduce((a,g)=>a+savedFor(g),0);
function tombDates(g){const a=parse(g.from||g.buriedAt),b=parse(g.buriedAt);if(a.getFullYear()===b.getFullYear()&&a.getMonth()===b.getMonth())return `${MONS[b.getMonth()].toUpperCase()} ${b.getFullYear()}`;return a.getFullYear()===b.getFullYear()?`${MONS[a.getMonth()].toUpperCase()}–${MONS[b.getMonth()].toUpperCase()} ${b.getFullYear()}`:`${MONS[a.getMonth()].toUpperCase()} ${a.getFullYear()}–${MONS[b.getMonth()].toUpperCase()} ${b.getFullYear()}`;}
function bounce(name){return S.bounces[name]||(S.bounces[name]={buried:0,res:0,spent:0});}
function logEvent(type,name){S.log.unshift({at:new Date().toISOString(),type,name});}
function trialEnds(t){const d=parse(t.ends);d.setHours(23,59,59);return d;}
function trialDaysLeft(t){return Math.max(0,daysBetween(today(),t.ends));}
const getSub=id=>S.subs.find(s=>s.id===id);
const getTrial=id=>S.trials.find(t=>t.id===id);
function target(){const t=T.target;if(!t)return null;return t.kind==='trial'?getTrial(t.id):getSub(t.id);}

/* =========================================================================
   Server (Plaid Sandbox) calls
   ========================================================================= */
async function api(name,body={}){
  let res;
  try{res=await fetch('/api/graveyard/'+name,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});}
  catch{throw new Error('Can’t reach the Graveyard server. Check your connection and try again.');}
  const data=await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error||'The server had a problem. Try again.');
  return data;
}
let plaidReady;
function loadPlaid(){return plaidReady||(plaidReady=new Promise((ok,fail)=>{const s=document.createElement('script');s.src='https://cdn.plaid.com/link/v2/stable/link-initialize.js';s.onload=ok;s.onerror=()=>{plaidReady=null;fail(new Error('Plaid didn’t load. Check your connection.'));};document.head.appendChild(s);}));}

async function connectBank(btn,force){
  if(btn){btn.disabled=true;btn.textContent='Opening the demo bank…';}
  try{
    if(!force){const st=await api('status');if(!st.plaid){if(btn){btn.disabled=false;btn.textContent='Link my bank';}go('banksetup');return;}}
    const [{link_token}]=await Promise.all([api('link-token'),loadPlaid()]);
    const handler=window.Plaid.create({token:link_token,
      onSuccess:async(public_token,meta)=>{
        T.scanError=null;S.scan=null;T.scanMsg='Connecting to '+(meta?.institution?.name||'the demo bank')+'…';go('found');
        try{const ex=await api('exchange',{public_token,institution:meta?.institution?.name,account_mask:meta?.accounts?.[0]?.mask});
          S.bank={name:ex.institution,mask:ex.account_mask,token:ex.token,connectedAt:new Date().toISOString()};save();await scan();}
        catch(e){T.scanError=e.message;rerender();}
      },
      onExit:err=>{if(btn){btn.disabled=false;btn.textContent='Link my bank';}if(err)toast(err.display_message||err.error_message||'Plaid closed before the bank connected.');}
    });
    toast('Plaid test login: user_good / pass_good (code 1234 if asked).');handler.open();
  }catch(e){if(btn){btn.disabled=false;btn.textContent='Link my bank';}toast(e.message);}
}
async function scan(){
  T.scanMsg='Reading a year of charges…';rerender();
  if(S.bank?.demo){const r=await api('demo-bank');S.scan=r;save();T.scanMsg='';if(cur.id==='found')rerender();return r;}
  for(let i=0;i<20;i++){
    const r=await api('subscriptions',{token:S.bank.token});
    if(r.ready){S.scan=r;save();T.scanMsg='';if(cur.id==='found')rerender();return r;}
    T.scanMsg=`The bank is still sending transactions… (${i+1})`;if(cur.id==='found')rerender();
    await new Promise(ok=>setTimeout(ok,2500));
  }
  throw new Error('The demo bank is taking too long. Try Rescan in a minute.');
}
function applyScan(){
  const r=S.scan;if(!r)return;
  for(const x of r.subscriptions){
    if(S.removed[x.name])continue;
    const existing=S.subs.find(s=>s.name===x.name);
    if(existing){Object.assign(existing,{price:x.price,next:x.next,last:x.last,first:x.first,charges:x.charges,cadence:x.cadence});continue;}
    if(S.graves.some(g=>g.name===x.name))continue;
    S.subs.push({id:uid(),name:x.name,price:x.price,cadence:x.cadence,next:x.next,last:x.last,first:x.first,charges:x.charges,source:'bank',rating:null});
  }
  for(const x of r.stopped||[]){
    if(S.removed[x.name]||S.graves.some(g=>g.name===x.name)||S.subs.some(s=>s.name===x.name))continue;
    S.graves.push({id:uid(),name:x.name,price:x.price,cadence:x.cadence,from:x.first,lastCharge:x.last,buriedAt:addDays(x.last,Math.round(x.cadence==='yearly'?365:30)),source:'bank'});
    S.log.push({at:addDays(x.last,30)+'T12:00:00.000Z',type:'buried',name:x.name,auto:true});
    bounce(x.name).buried++;
  }
  for(const t of r.trials||[]){
    if(S.trials.some(x=>x.name===t.name)||S.subs.some(s=>s.name===t.name))continue;
    S.trials.push({id:uid(),name:t.name,price:CATALOG[t.name]?.price||9.99,ends:addDays(t.started,7),warn:'48',started:t.started,source:'bank'});
  }
  S.log.sort((a,b)=>b.at.localeCompare(a.at));
  save();
}

/* =========================================================================
   Building blocks
   ========================================================================= */
const act=(a,arg='')=>`data-act="${a}" data-arg="${esc(arg)}"`;
function subRow(s,opts={}){const c=chipFor(s);const dim=s.rating==='barely'||!s.rating;return `<button class="subrow${T.flash===s.id?' flash':''}" ${act(opts.act||'openSub',s.id)}><span class="logo-tile${dim?' dim':''}">${esc(letter(s.name))}</span><span class="info"><span class="t-strong">${esc(s.name)}</span><span class="chip ${c.c}">${esc(c.t)}</span></span><span class="price"><span class="t-strong">${m(s.price)}</span><span class="t-cap c-dirt">${s.next?'next: '+fmtDay(s.next):s.cadence==='yearly'?'yearly':'monthly'}</span></span></button>`;}
function tomb(g,u=1,cls='',showSaved=true){const saved=savedFor(g);return `<div class="tomb ${cls}" style="--u:${u}px"><div class="well"><div class="stone"><span class="rip">R.I.P.</span><span class="nm">${esc(g.name)}</span><span class="dt">${esc(tombDates(g))}</span></div></div><div class="dirtbar"></div>${showSaved?`<span class="chip saved ${saved?'bg-moss':'bg-candle'}">${saved?'+'+m(saved)+' saved':'Just buried'}</span>`:''}</div>`;}
function tabbar(active){const tabs=[['home','Home'],['checkin','Check-in'],['graveyard','Graveyard'],['log','Log']];const from=Math.max(0,tabs.findIndex(t=>t[0]===T.tab));const to=tabs.findIndex(t=>t[0]===active);
 return `<nav class="tabbar" aria-label="Tabs"><span class="pill" data-to="${to}" style="transform:translateX(calc(${from} * (100% + 4px)))"></span>${tabs.map(([k,l],i)=>`<button class="${i===to?'on':''}" ${act('tab',k)} aria-current="${i===to?'page':'false'}">${ICON[k]}<span>${l}</span></button>`).join('')}</nav>`;}
function countUp(el,from,to,ms=900){if(!el)return;const t0=performance.now();const step=t=>{const p=Math.min(1,(t-t0)/ms);el.textContent=m(from+(to-from)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);}
let toastTimer;
function toast(msg){const ph=$('#phone');ph.querySelectorAll('.toast').forEach(t=>t.remove());const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.textContent=msg;ph.appendChild(t);clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300);},2800);}

/* =========================================================================
   Screens
   ========================================================================= */
const SCREENS={
/* ---------- first launch ---------- */
welcome:{night:true,render:()=>`<div class="content mid"><div class="grow"></div>
  <div class="stagger" style="display:flex;flex-direction:column;align-items:center;gap:14px">
   <div class="bob">${plot('Content',150,'emerge')}</div>
   <div class="t-xl c-blush" style="font-size:44px;line-height:.95">subscription</div><div class="t-xl c-bone" style="margin-top:-12px">graveyard</div>
   <p class="t-dp c-stone" style="margin-top:6px">Every subscription you forgot about,<br>in one quiet place.</p></div>
  <div class="grow"></div><button class="btn light" ${act('go','meet')}>Get started</button><button class="btn ghost" ${act('skipToHome')}>I already have an account</button></div>`},
meet:{render:()=>`<div class="content mid"><div style="height:8px"></div>
  <div class="wave">${plot('Content',170)}</div><h2 class="t-l">Meet Plot.</h2>
  <p class="t-body c-plum">Plot keeps watch over your subscriptions. It notices what you stop using and asks, politely, if it can bury it.</p>
  <div class="card stagger" style="width:100%;gap:12px">${[['Content','A 2-minute check-in, once a month'],['Sleepy','Bury what you don’t use'],['Resurrected','Bring anything back, no judgment']].map(([md,t])=>`<div class="row">${plot(md,36)}<span class="t-strong">${t}</span></div>`).join('')}</div>
  <div class="grow"></div><button class="btn primary" ${S.onboarded?act('back','settings'):act('go','add')}>${S.onboarded?'Back to Settings':'Nice to meet you'}</button></div>`},
add:{render:()=>{const b=T.method==='bank';return `<div class="content">
  <span class="t-cap c-dirt">STEP 1 OF 2</span><h2 class="t-l">Add your subscriptions</h2>
  <p class="t-body c-plum">Plot needs to know what you pay for before it can judge any of it.</p>
  <button class="card option" aria-pressed="${b}" ${act('method','bank')}><span class="row"><span class="t-title">Link your bank</span><span class="chip bg-moss">Recommended</span></span><span class="t-body c-plum">Plot finds recurring charges for you.</span></button>
  <button class="card option" aria-pressed="${!b}" ${act('method','hand')}><span class="t-title">Add them by hand</span><span class="t-body c-plum">Type in each one. Slower, but very private.</span></button>
  <div class="card dash"><span class="t-dp">Plot can’t move money. It can only judge.</span></div>
  <div class="grow"></div><button class="btn primary" ${act(b?'connectBank':'go',b?'':'byhand')}>${b?'Link my bank':'Add by hand'}</button></div>`;}},
banksetup:{render:()=>{const local=['localhost','127.0.0.1'].includes(location.hostname);const open=T.showPlaid;
  return `<div class="content">
  <button class="backlink" ${act('back',S.onboarded?'settings':'add')}>←&nbsp; ${S.onboarded?'Settings':'Back'}</button>
  <h2 class="t-l">Link a bank</h2>
  <p class="t-body c-plum">Both options are pretend banks. Neither one can see your real accounts.</p>

  <div class="set-sec"><span class="set-h">Choose a demo bank</span><div class="set-group">
   ${srow({icon:'bank',bg:'moss',label:'Plot’s demo bank',sub:'A year of made-up charges · no sign-up',value:'<span class="chip bg-moss">Works now</span>',a:'useDemoBank'})}
   ${srow({icon:'shield',bg:'stone',label:'Plaid test bank',sub:'Plaid’s real “connect your bank” screens',value:open?'Hide':'Needs keys',a:'togglePlaidKeys'})}
  </div><span class="set-note">Read-only. Plot can look at charges but can’t move money.</span></div>

  ${open?(local?`<div class="set-sec"><span class="set-h">Plaid keys</span><div class="set-group">
   <label class="set-row set-input" for="pId">${sicon('user','stone')}<span class="set-label">client_id</span><input id="pId" placeholder="Paste here" autocomplete="off" spellcheck="false"></label>
   <label class="set-row set-input" for="pSecret">${sicon('shield','stone')}<span class="set-label">Sandbox secret</span><input id="pSecret" type="password" placeholder="Paste here" autocomplete="off" spellcheck="false"></label>
   ${srow({icon:'scan',bg:'candle',label:'Save and connect',a:'savePlaidKeys'})}
  </div><span class="set-note">Get both from a free account at <a href="https://dashboard.plaid.com/signup" target="_blank" rel="noopener">dashboard.plaid.com</a> → <a href="https://dashboard.plaid.com/developers/keys" target="_blank" rel="noopener">Developers → Keys</a>. Use the Sandbox secret. Plot checks them with Plaid and saves them on this computer only.</span></div>`
   :`<div class="set-sec"><span class="set-h">Plaid keys</span><div class="set-group">${srow({icon:'info',bg:'stone',label:'Add keys in Vercel',sub:'Project → Settings → Environment Variables'})}</div></div>`):''}
  </div>`;}},
byhand:{render:()=>`<div class="content">
  <button class="backlink" ${act('back',S.onboarded?'home':'add')}>←&nbsp; ${S.onboarded?'Dashboard':'Add subscriptions'}</button><h2 class="t-l">Add one</h2>
  <form class="stack" id="manualForm" style="gap:16px" novalidate>
  <div class="field"><label for="fName">Name</label><input id="fName" placeholder="Netflix" autocomplete="off" required></div>
  <div class="row" style="gap:12px;align-items:flex-start"><div class="field grow"><label for="fPrice">Price</label><input id="fPrice" placeholder="15.99" inputmode="decimal" autocomplete="off" required></div><div class="field grow"><label for="fNext">Next charge</label><input id="fNext" type="date" value="${addDays(today(),9)}"></div></div>
  <div class="field"><label id="cycLbl">Billing</label><div class="seg" role="group" aria-labelledby="cycLbl"><button type="button" aria-pressed="true" data-cycle="monthly">Monthly</button><button type="button" aria-pressed="false" data-cycle="yearly">Yearly</button></div></div>
  <div class="card row" style="flex-direction:row"><div class="stack-s grow" style="gap:2px"><span class="t-strong">This is a free trial</span><span class="t-cap c-plum">Plot will count down to the first charge.</span></div><button type="button" class="toggle" role="switch" aria-checked="false" aria-label="This is a free trial" id="fTrial"></button></div>
  </form>
  <div class="grow"></div><button class="btn primary" ${act('saveManual')}>Save</button><button class="btn ghost" ${act('saveManual','again')}>Save and add another</button></div>`,
  mount(el){const tg=$('#fTrial',el);tg.addEventListener('click',()=>tg.setAttribute('aria-checked',tg.getAttribute('aria-checked')!=='true'));el.querySelectorAll('[data-cycle]').forEach(b=>b.addEventListener('click',()=>el.querySelectorAll('[data-cycle]').forEach(x=>x.setAttribute('aria-pressed',x===b))));$('#fName',el).focus({preventScroll:true});}},
found:{render:()=>{const r=S.scan;
  if(T.scanError) return `<div class="content mid"><div class="grow"></div>${plot('Alarmed',140)}<h2 class="t-m">Plot couldn’t read the bank.</h2><p class="t-body c-plum">${esc(T.scanError)}</p><div class="grow"></div><button class="btn primary" ${act('rescan')}>Try again</button><button class="btn ghost" ${act('go','byhand')}>Add them by hand instead</button></div>`;
  if(!r) return `<div class="content mid"><div class="grow"></div>${plot('Sleepy',120,'bob')}<h2 class="t-m">Plot is reading your statements.</h2><div class="loadbar"><i></i></div><p class="t-dp c-plum">${esc(T.scanMsg||'Waiting for the demo bank…')}</p><div class="grow"></div></div>`;
  const subs=r.subscriptions,stopped=r.stopped||[];
  return `<div class="content"><span class="t-cap c-dirt">STEP 1 OF 2 · ${esc(S.bank?.name||'Demo bank')}${S.bank?.mask?' ••'+esc(S.bank.mask):''}</span>
  <h2 class="t-l">Plot found ${subs.length}.</h2>
  <p class="t-body c-plum">Plot read ${r.scanned} transactions and kept the ones that repeat. Tap anything that isn’t a subscription to remove it.</p>
  <div class="stack stagger" style="gap:8px">${subs.map(x=>`<button class="subrow${S.removed[x.name]?' off':''}" ${act('toggleFound',x.name)} aria-pressed="${!S.removed[x.name]}"><span class="logo-tile">${esc(letter(x.name))}</span><span class="info"><span class="t-strong">${esc(x.name)}</span><span class="chip bg-stone">${S.removed[x.name]?'Removed':`${x.charges.length} charges · ${x.cadence}`}</span></span><span class="price"><span class="t-strong">${m(x.price)}</span><span class="t-cap c-dirt">next: ${fmtDay(x.next)}</span></span></button>`).join('')}</div>
  ${stopped.length?`<span class="section-label" style="margin-top:6px">Already cancelled (${stopped.length})</span><div class="card dash" style="gap:8px"><span class="t-dp">These stopped charging a while ago. Plot will give them a proper burial in your Graveyard.</span>${stopped.map(x=>`<span class="row between"><span class="t-strong">${esc(x.name)}</span><span class="t-cap c-dirt">last charge ${fmtDay(x.last)}</span></span>`).join('')}</div>`:''}
  <div class="grow"></div><button class="btn primary" ${act('acceptScan')}>Looks right</button></div>`;}},
trials:{render:()=>`<div class="content">
  <span class="t-cap c-dirt">STEP 2 OF 2</span><h2 class="t-l">Any free trials?</h2>
  <p class="t-body c-plum">Plot counts down and warns you before a trial turns into a charge.</p>
  <div class="stack stagger">${S.subs.slice(0,8).map(s=>`<div class="card row" style="flex-direction:row"><div class="stack-s grow" style="gap:2px"><span class="t-strong">${esc(s.name)}</span><span class="t-cap c-plum">Not a trial</span></div><button class="toggle" role="switch" aria-checked="false" aria-label="${esc(s.name)} is a free trial" ${act('markTrial',s.id)}></button></div>`).join('')}${S.trials.map(t=>`<div class="card row" style="flex-direction:row;background:var(--pumpkin);border-width:3px">${plot('Alarmed',40)}<div class="stack-s grow" style="gap:2px"><span class="t-strong">${esc(t.name)}</span><span class="t-dp">Ends ${fmtDay(t.ends)} · then ${m(t.price)}/mo${t.source==='bank'?' · spotted in your bank':''}</span></div><button class="toggle" role="switch" aria-checked="true" aria-label="Stop watching ${esc(t.name)}" ${act('removeTrial',t.id)}></button></div>`).join('')}${!S.trials.length&&!S.subs.length?`<div class="card"><span class="t-body c-plum">No trials yet.</span></div>`:''}</div>
  <button class="card dash" style="align-items:center" ${act('go','addtrial')}><span class="t-strong">+&nbsp; Add a trial Plot missed</span></button>
  <div class="grow"></div><button class="btn primary" ${act('go','nudge')}>Done</button></div>`},
addtrial:{render:()=>`<div class="content">
  <button class="backlink" ${act('back',S.onboarded?'home':'trials')}>←&nbsp; ${S.onboarded?'Dashboard':'Any free trials?'}</button><h2 class="t-l">Add a trial</h2>
  <p class="t-body c-plum">Plot starts counting down the moment you save.</p>
  <div class="field"><label for="tName">Service</label><input id="tName" placeholder="Apple TV+" autocomplete="off"></div>
  <div class="row" style="gap:12px;align-items:flex-start"><div class="field grow"><label for="tEnds">Trial ends</label><input id="tEnds" type="date" value="${addDays(today(),8)}" min="${today()}"></div><div class="field grow"><label for="tPrice">Then costs ($/mo)</label><input id="tPrice" placeholder="9.99" inputmode="decimal" autocomplete="off"></div></div>
  <div class="field"><label id="warnLbl">Warn me</label><div class="seg" role="group" aria-labelledby="warnLbl"><button type="button" aria-pressed="true" data-warn="48">48 hours before</button><button type="button" aria-pressed="false" data-warn="week">1 week before</button></div></div>
  <span class="section-label">Preview on your Dashboard</span>
  <div class="trialcard">${plot('Alarmed',40)}<span class="stack-s" style="gap:2px"><span class="t-strong" id="pvTitle"></span><span class="t-cap" id="pvSub"></span></span></div>
  <div class="card dash"><span class="t-dp" id="pvWarn"></span></div>
  <div class="grow"></div><button class="btn primary" ${act('saveTrial')}>Save trial</button><button class="btn ghost" ${act('back',S.onboarded?'home':'trials')}>Cancel</button></div>`,
  mount(el){const upd=()=>{const name=$('#tName',el).value.trim()||'Apple TV+';const ends=$('#tEnds',el).value;const price=parseFloat($('#tPrice',el).value)||9.99;const warn=$('[data-warn][aria-pressed="true"]',el).dataset.warn;
    const left=ends?daysBetween(today(),ends):null;$('#pvTitle',el).textContent=left===null?`${name} trial charges soon`:left<=0?`${name} trial charges today`:`${name} trial charges in ${left} day${left===1?'':'s'}`;$('#pvSub',el).textContent=`${m(price)}/mo after`;
    if(ends){const w=addDays(ends,warn==='week'?-7:-2);$('#pvWarn',el).textContent=parse(w)<=parse(today())?'That’s soon. Plot is already getting dramatic.':`Plot will get dramatic on ${fmtDay(w)}. That’s the deal.`;}else $('#pvWarn',el).textContent='Pick the day the trial ends.';};
   el.querySelectorAll('input').forEach(i=>i.addEventListener('input',upd));el.querySelectorAll('[data-warn]').forEach(b=>b.addEventListener('click',()=>{el.querySelectorAll('[data-warn]').forEach(x=>x.setAttribute('aria-pressed',x===b));upd();}));upd();}},

nudge:{night:true,render:()=>{const d=new Date();const first=new Date(d.getFullYear(),d.getMonth()+1,1);return `<div class="content mid"><div style="height:18px"></div>
  <span class="t-strong c-stone">${DOW[first.getDay()]}, ${['January','February','March','April','May','June','July','August','September','October','November','December'][first.getMonth()]} 1</span><span class="t-xl c-bone" style="font-size:84px">9:41</span>
  <p class="t-dp c-stone">This is how Plot will nudge you on the 1st of every month.</p><div class="grow"></div>
  <div class="card" style="width:100%;border:0;gap:8px;color:var(--ink);box-shadow:0 16px 40px -12px rgba(0,0,0,.45);animation:rise .7s cubic-bezier(.2,.9,.3,1.2) .5s both"><span class="row" style="gap:8px"><span style="width:28px;height:28px;border-radius:8px;background:var(--plum);display:grid;place-items:center;overflow:hidden">${plot('Content',26)}</span><span class="t-cap c-plum grow">SUBSCRIPTION GRAVEYARD</span><span class="t-cap c-plum">now</span></span><span class="t-title">Monthly check-in is ready</span><span class="t-dp">${Math.max(S.subs.length,1)} subscription${S.subs.length===1?'':'s'}. 2 minutes. Plot has questions.</span></div>
  <div class="grow"></div><button class="btn light" ${act('enableNudges')}>Turn on reminders</button><button class="btn ghost" ${act('finishOnboard')}>Not now</button></div>`;}},

/* ---------- everyday ---------- */
home:{tab:'home',render:()=>{const h=new Date().getHours();const hi=(h<12?'Good morning':h<18?'Good afternoon':'Good evening')+(S.profile.name?`, ${esc(S.profile.name)}`:'');const sus=S.subs.filter(s=>s.rating==='barely'||s.rating==='sometimes').length;
  const list=[...S.subs].sort(S.prefs.sort==='price'?(a,b)=>b.price-a.price:(a,b)=>order[a.rating]-order[b.rating]||b.price-a.price);const due=!S.checkins[monthKey()];
  const reminders=S.subs.filter(s=>s.remindAt&&parse(s.remindAt)<=parse(today()));
  return `<div class="content tabs">
  <div class="row between"><div class="stack-s" style="gap:2px"><span class="t-cap c-plum" style="font-size:13px">${hi}</span><h1 class="t-m">Your subscriptions</h1></div><button aria-label="Settings" ${act('go','settings')}>${plot('Content',56)}</button></div>
  <div class="card" style="background:var(--ink);border:0;color:var(--bone);gap:4px"><span class="t-cap c-blush">THIS MONTH</span><span class="t-l" id="dashTotal">${m(total())}</span><span class="t-dp c-stone">${S.subs.length} active${S.subs.length?` · ${sus} look suspicious`:''}</span></div>
  ${reminders.map(s=>`<button class="card thick row" style="flex-direction:row;background:var(--candle)" ${act('checkReminder',s.id)}>${plot('Sleepy',40)}<span class="stack-s grow" style="gap:2px"><span class="t-strong">Did ${esc(s.name)} let you go?</span><span class="t-cap">Plot said it would check back today.</span></span></button>`).join('')}
  ${S.subs.length?(due?`<div class="card thick row" style="flex-direction:row;padding:14px 14px 14px 18px"><div class="stack-s grow" style="gap:2px"><span class="t-strong">Monthly check-in is ready</span><span class="t-cap c-plum">${S.subs.length} subs · about 2 minutes</span></div><button class="btn primary fit sm" ${act('go','intro')}>Start</button></div>`:`<div class="card thick row" style="flex-direction:row"><div class="stack-s grow"><span class="t-strong">Check-in done</span><span class="t-cap c-plum">Plot will ask again on ${MONS[(new Date().getMonth()+1)%12]} 1.</span></div>${plot('Content',40)}</div>`):''}
  ${S.trials.map(t=>{const d=trialDaysLeft(t);return `<button class="trialcard" ${act('openTrial',t.id)}>${plot('Alarmed',40)}<span class="stack-s" style="gap:2px"><span class="t-strong">${esc(t.name)} trial charges ${d<=0?'today':d===1?'tomorrow':`in ${d} days`}</span><span class="t-cap">${m(t.price)}/mo after</span></span></button>`;}).join('')}
  ${S.subs.length?`<div class="row between"><span class="t-title" style="font-size:16px">Active (${S.subs.length})</span><button class="t-cap c-plum" ${act('cycleSort')}>Sort: ${S.prefs.sort==='price'?'price':'least used'}</button></div>
  <div class="stack stagger" style="gap:8px">${list.map(s=>subRow(s)).join('')}</div>`:`<div class="card dash" style="align-items:center;text-align:center;gap:10px">${plot('Sleepy',90)}<span class="t-title">Nothing to watch yet</span><span class="t-body c-plum">Link the demo bank or add a subscription and Plot gets to work.</span></div>`}
  <div class="row" style="gap:8px"><button class="btn ghost sm" ${act('go','byhand')}>+ Subscription</button><button class="btn ghost sm" ${act('go','addtrial')}>+ Free trial</button></div>
  </div>${tabbar('home')}`;},
  mount(el){const t=$('#dashTotal',el);const now=total();if(T.lastTotal===undefined)countUp(t,0,now,800);else if(T.lastTotal!==now)countUp(t,T.lastTotal,now);T.lastTotal=now;setTimeout(()=>{T.flash=null;},1700);}},
settings:{render:()=>{const name=S.profile.name;const due=S.checkins[monthKey()];const n=new Date();const next=new Date(n.getFullYear(),n.getMonth()+1,1);
  return `<div class="content">
  <div class="row between"><button class="backlink" ${act('back','home')}>←&nbsp; Dashboard</button></div>
  <h2 class="t-l">Settings</h2>
  <button class="set-profile" ${act('go','editName')}>${plot('Content',64)}<span class="stack-s" style="gap:2px;flex:1;min-width:0;text-align:left"><span class="t-title">${name?esc(name):'Add your name'}</span><span class="t-cap c-plum">${S.subs.length} watched · ${S.graves.length} buried · ${m(graveTotal())} saved</span></span>${chev}</button>

  <div class="set-sec"><span class="set-h">Bank</span><div class="set-group">
   ${S.bank?srow({icon:'bank',bg:'moss',label:esc(S.bank.name),sub:`${S.bank.mask?'••'+esc(S.bank.mask)+' · ':''}${S.bank.demo?'Demo bank':'Plaid test mode'} · linked ${fmtDay(S.bank.connectedAt.slice(0,10))}`})
   +srow({icon:'scan',bg:'candle',label:'Rescan for subscriptions',a:'rescanFromSettings'})
   +srow({icon:'unlink',bg:'pumpkin',label:'Disconnect bank',a:'disconnect',danger:true})
   :srow({icon:'bank',bg:'stone',label:'Link a bank',sub:'Let Plot find your subscriptions',a:'connectBank'})}
  </div><span class="set-note">Read-only. Plot can look at charges but can’t move money.</span></div>

  <div class="set-sec"><span class="set-h">Notifications</span><div class="set-group">
   ${srow({icon:'bell',bg:'blush',label:'Monthly check-in reminder',sub:'On the 1st of every month',a:'togglePref',arg:'checkinNudge',toggle:true,on:S.prefs.checkinNudge})}
   ${srow({icon:'alarm',bg:'pumpkin',label:'Free trial alerts',sub:'Before a trial turns into a charge',a:'togglePref',arg:'trialAlerts',toggle:true,on:S.prefs.trialAlerts})}
   ${srow({icon:'clock',bg:'candle',label:'Warn me',value:S.prefs.trialWarn==='week'?'1 week before':'48 hours before',a:'cycleWarn'})}
  </div></div>

  <div class="set-sec"><span class="set-h">Check-in</span><div class="set-group">
   ${srow({icon:'cal',bg:'stone',label:'This month',value:due?(typeof due==='string'?'Done '+fmtDay(due):'Done'):'Ready'})}
   ${srow({icon:'cal',bg:'stone',label:'Next check-in',value:`${MONS[next.getMonth()]} 1`})}
   ${due?srow({icon:'scan',bg:'candle',label:'Reopen this month’s check-in',sub:'Run it again this month',a:'reopenCheckin'}):''}
  </div></div>

  <div class="set-sec"><span class="set-h">Display</span><div class="set-group">
   ${srow({icon:'sort',bg:'stone',label:'Sort Dashboard by',value:S.prefs.sort==='price'?'Price':'Least used',a:'cycleSort'})}
   ${srow({icon:'motion',bg:'blush',label:'Reduce motion',sub:'Fewer animations',a:'togglePref',arg:'reduceMotion',toggle:true,on:S.prefs.reduceMotion})}
  </div></div>

  <div class="set-sec"><span class="set-h">Your data</span><div class="set-group">
   ${srow({icon:'download',bg:'moss',label:'Export my data',sub:'Download everything as a file',a:'exportData'})}
   ${srow({icon:'shield',bg:'stone',label:'Privacy',a:'go',arg:'privacy'})}
   ${srow({icon:'trash',bg:'pumpkin',label:T.eraseArmed?'Tap again to erase everything':'Erase all data',a:'erase',danger:true})}
  </div><span class="set-note">Everything is stored on this phone only.</span></div>

  <div class="set-sec"><span class="set-h">About</span><div class="set-group">
   ${srow({icon:'phone',bg:'stone',label:'Add to Home Screen',sub:'In Safari: Share → Add to Home Screen'})}
   ${srow({icon:'info',bg:'stone',label:'How Plot works',a:'go',arg:'meet'})}
   ${srow({icon:'info',bg:'stone',label:'Version',value:'1.0 (demo)'})}
  </div></div>
  <div class="stack-s" style="gap:8px;margin-top:6px"><button class="btn logout${T.logoutArmed?' armed':''}" ${act('logout')}>${T.logoutArmed?'Tap again to log out':'Log out'}</button><span class="set-note center">${T.logoutArmed?'Your data stays saved on this phone.':(name?`Signed in as ${esc(name)}`:'Your data stays saved on this phone.')}</span></div>
  <div class="stack-s" style="align-items:center;padding:8px 0 4px">${plot('Sleepy',44)}<span class="t-cap c-plum">Subscription Graveyard · made by Maya Walsh</span></div>
  </div>`;}},
editName:{render:()=>`<div class="content">
  <button class="backlink" ${act('back','settings')}>←&nbsp; Settings</button><h2 class="t-l">Your name</h2>
  <p class="t-body c-plum">Plot uses it to say hello on the Dashboard.</p>
  <div class="field"><label for="nm">Name</label><input id="nm" value="${esc(S.profile.name)}" placeholder="Maya" autocomplete="given-name" maxlength="30"></div>
  <div class="grow"></div><button class="btn primary" ${act('saveName')}>Save</button></div>`,
  mount(el){const i=$('#nm',el);i.focus({preventScroll:true});i.addEventListener('keydown',e=>{if(e.key==='Enter')ACT.saveName();});}},
privacy:{render:()=>`<div class="content">
  <button class="backlink" ${act('back','settings')}>←&nbsp; Settings</button><h2 class="t-l">Privacy</h2>
  <div class="card stack" style="gap:12px"><span class="t-title">What Plot keeps</span><span class="t-body">Your subscriptions, ratings, burials and settings. They stay in this phone’s storage and are never uploaded.</span></div>
  <div class="card stack" style="gap:12px"><span class="t-title">The bank connection</span><span class="t-body">This demo only connects to pretend banks: Plot’s demo bank or Plaid’s test mode. Real bank accounts can’t be linked.</span></div>
  <div class="card stack" style="gap:12px"><span class="t-title">Cancel links</span><span class="t-body">“Open Netflix” and similar buttons go straight to that company’s website. Plot never sees your logins there.</span></div>
  </div>`},
sub:{render:()=>{const s=getSub(T.subId);if(!s)return SCREENS.home.render();const r=s.rating?RATE[s.rating]:null;const cpu=r?s.price/r.uses:null;
  const now=new Date();const months=[];for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const key=`${d.getFullYear()}-${pad(d.getMonth()+1)}`;const amt=(s.charges||[]).filter(c=>c.date.startsWith(key)).reduce((a,c)=>a+c.amount,0);months.push([MONS[d.getMonth()].toUpperCase(),amt,i===0]);}
  const mx=Math.max(...months.map(x=>x[1]),1);const yr=String(now.getFullYear());const paid=(s.charges||[]).filter(c=>c.date.startsWith(yr)).reduce((a,c)=>a+c.amount,0);const count=(s.charges||[]).filter(c=>c.date.startsWith(yr)).length;
  const meter=r?{barely:10,sometimes:40,constantly:95}[s.rating]:0;
  return `<div class="content"><button class="backlink" ${act('back','home')}>←&nbsp; ${esc(s.name)}</button>
  ${r?`<div class="card thick" style="padding:22px 24px;gap:8px"><span class="t-cap c-dirt">COST PER USE · ${esc(s.name.toUpperCase())}</span><span class="t-dl">${m(cpu)} / use</span><span class="t-dp c-plum">${m(s.price)} a month ÷ about ${r.uses} use${r.uses>1?'s':''} (you said “${r.said}”).</span><div class="meter"><i style="width:${meter}%"></i></div><span class="t-cap c-dirt">Worth-it meter: ${meter<35?'low':meter<70?'meh':'high'}</span></div>`
  :`<div class="card thick" style="gap:10px"><span class="t-cap c-dirt">COST PER USE · ${esc(s.name.toUpperCase())}</span><span class="t-body">How much did you use ${esc(s.name)} this month? Plot will do the math.</span>${['barely','sometimes','constantly'].map(k=>`<button class="ratechip" ${act('rateOne',k)}><i class="${RATE[k].cls}"></i>${k==='barely'?'Barely touched it':k==='sometimes'?'Here and there':'Couldn’t live without it'}</button>`).join('')}</div>`}
  ${s.charges?.length?`<div class="card thick" style="gap:12px"><span class="t-cap c-dirt">CHARGES · LAST 6 MONTHS</span><div class="bars">${months.map(([mo,v,isNow],i)=>`<div><span class="b${isNow?' now':''}${v?'':' zero'}" style="height:${Math.max(6,v/mx*84)}px;animation-delay:${i*.07}s"></span><span class="t-cap c-plum">${mo}</span></div>`).join('')}</div></div>`:''}
  <div class="row" style="gap:8px;align-items:stretch"><div class="stat"><span class="t-cap c-plum">Paid in ${yr}</span><span class="t-title">${s.charges?.length?m(paid):'—'}</span></div><div class="stat"><span class="t-cap c-plum">Charges</span><span class="t-title">${s.charges?.length?count:'—'}</span></div><div class="stat"><span class="t-cap c-plum">Next charge</span><span class="t-title">${s.next?fmtDay(s.next):'—'}</span></div></div>
  ${r?`<div class="card dash"><span class="t-dp">“You paid ${m(s.price)} for ${esc(s.name)} and ${s.rating==='barely'?'barely touched it':s.rating==='sometimes'?'used it here and there':'used it constantly'}. That’s ${m(cpu)} a use.”</span></div>`:''}
  <div class="grow"></div><div class="row" style="gap:8px"><button class="btn ghost" ${act('back','home')}>Keep it</button><button class="btn bury" ${act('buryOne',s.id)}>Bury it</button></div></div>`;}},

/* ---------- check-in ---------- */
intro:{tab:'checkin',render:()=>{const done=S.checkins[monthKey()];if(done&&S.subs.length){const n=new Date();const next=new Date(n.getFullYear(),n.getMonth()+1,1);const left=daysBetween(today(),isoOf(next));const FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `<div class="content mid tabs"><div class="grow"></div>${plot('Sleepy',170,'bob')}<h2 class="t-l">Check-in done for ${FULL[n.getMonth()]}.</h2>
  <p class="t-body c-plum">${typeof done==='string'?`You checked in on ${fmtDay(done)}. `:''}Plot opens the next one on ${FULL[next.getMonth()]} 1. That’s ${left} day${left===1?'':'s'} away.</p>
  <div class="grow"></div><button class="btn primary" ${act('go','verdict')}>See this month’s verdict</button></div>${tabbar('checkin')}`;}
  return S.subs.length?`<div class="content mid"><div class="grow"></div>
  <div class="bob">${plot('Content',190)}</div><h2 class="t-l">It’s that time.</h2>
  <p class="t-body c-plum">Rate how much you actually used each subscription this month. Be honest. Plot already knows.</p>
  <span class="t-cap c-plum" style="font-size:13px">${S.subs.length} subscription${S.subs.length>1?'s':''} · about ${Math.max(1,Math.round(S.subs.length*12/60))} minute${S.subs.length*12/60>1.5?'s':''}</span><div class="grow"></div>
  <button class="btn primary" ${act('startCheckin')}>Begin check-in</button><button class="btn ghost" ${act('remindTonight')}>Remind me tonight</button></div>${tabbar('checkin')}`
  :`<div class="content mid tabs"><div class="grow"></div>${plot('Sleepy',150)}<h2 class="t-m">Nothing to check in on.</h2><p class="t-body c-plum">Add a subscription first.</p><div class="grow"></div></div>${tabbar('checkin')}`;}},
swipe:{render:()=>`<div class="content" style="gap:14px">
  <div class="row"><button aria-label="Close check-in" ${act('back','home')} style="font-size:26px;font-weight:700;line-height:1;padding:4px">×</button><div class="progress"><i id="prog" style="width:${T.deckIndex/T.deck.length*100}%"></i></div><span class="t-cap" style="font-weight:700;font-size:13px" id="progTxt">${Math.min(T.deckIndex+1,T.deck.length)} of ${T.deck.length}</span></div>
  <div class="deck" id="deck"><div class="ghostcard g2"></div><div class="ghostcard g1"></div></div>
  <div class="hints"><span>← Barely</span><span>↑ Can’t live without</span><span>Here and there →</span></div>
  <span class="t-cap c-plum center">or tap</span>
  <div class="stack" style="gap:10px">${[['barely','Barely touched it','var(--pumpkin)'],['sometimes','Here and there','var(--candle)'],['constantly','Couldn’t live without it','var(--moss)']].map(([k,l,c])=>`<button class="ratechip" ${act('rate',k)}><i style="background:${c}"></i>${l}</button>`).join('')}</div></div>`,
  mount(el){drawCard(el);}},
verdict:{render:()=>{const worth=S.subs.filter(s=>s.rating==='constantly'),thin=S.subs.filter(s=>s.rating==='sometimes'),shall=S.subs.filter(s=>s.rating==='barely');const save=shall.reduce((a,s)=>a+monthly(s)*12,0);
  return `<div class="content"><h2 class="t-l">The verdict.</h2><p class="t-body c-plum" style="margin-top:-8px">${S.subs.length} rated. Here’s what Plot thinks.</p>
  <div class="stack stagger">
  <div class="card thick" style="background:var(--moss)"><span class="t-title">Worth it (${worth.length})</span><span class="t-cap" style="font-size:13px">${worth.map(s=>esc(s.name)).join(' · ')||'None this month.'}</span></div>
  <div class="card thick" style="background:var(--candle)"><span class="t-title">On thin ice (${thin.length})</span><span class="t-cap" style="font-size:13px">${thin.map(s=>`${esc(s.name)} ${m(s.price/4)}/use`).join(' · ')||'None this month.'}</span></div>
  <div class="card dash" style="gap:10px"><span class="t-title">Shall we? (${shall.length})</span>${shall.length?shall.map(s=>`<div class="row"><span class="logo-tile dim">${esc(letter(s.name))}</span><span class="stack-s grow" style="gap:2px;min-width:0"><span class="t-strong">${esc(s.name)}</span><span class="t-cap c-plum">Barely touched · ${m(s.price)}/mo</span></span><button class="btn bury fit sm" ${act('buryOne',s.id)}>Bury</button></div>`).join(''):`<span class="t-dp">Nothing to bury. Plot is almost disappointed.</span>`}</div></div>
  <div class="grow"></div>${shall.length?`<p class="t-dp center">Burying ${shall.length===1?'it':shall.length===2?'both':'all '+shall.length} saves ${m(save)} a year.</p><button class="btn bury" ${act('buryAll')}>${shall.length===1?'Bury it':shall.length===2?'Bury both':'Bury all '+shall.length}</button>`:''}
  <button class="btn ghost" ${act('back','home')}>Done for now</button></div>`;}},

/* ---------- trial alert ---------- */
trial:{night:true,render:()=>{const t=getTrial(T.trialId);if(!t)return SCREENS.home.render();return `<div class="content mid"><div style="height:30px"></div>
  <span class="t-cap c-blush">FREE TRIAL ENDING</span>${plot('Alarmed',170)}<span class="t-xl c-pumpkin" id="cd" style="font-variant-numeric:tabular-nums">--:--:--</span>
  <span class="t-body c-stone">until ${esc(t.name)} charges you ${m(t.price)}/mo</span>
  <div class="card" style="background:var(--ink);border:0;width:100%"><span class="t-dp c-bone">${t.source==='bank'?`Plot spotted a $0.00 ${esc(t.name)} charge on ${fmtDay(t.started)}.`:`You added this trial. It ends ${fmtDay(t.ends)}.`}</span></div>
  <div class="grow"></div><button class="btn bury" ${act('cancelTrial',t.id)}>Cancel the trial</button><button class="btn ghost" ${act('letCharge',t.id)}>Let it charge</button><button class="linkbtn c-stone" ${act('snooze',t.id)}>Remind me tomorrow</button></div>`;},
  mount(el){const t=getTrial(T.trialId);if(!t)return;const cd=$('#cd',el);const tick=()=>{const s=Math.max(0,Math.round((trialEnds(t)-Date.now())/1000));const h=Math.floor(s/3600),mi=Math.floor(s%3600/60),se=s%60;cd.textContent=`${h}:${pad(mi)}:${pad(se)}`;cd.style.fontSize=h>=100?'48px':'';};tick();const i=setInterval(tick,1000);return()=>clearInterval(i);}},

/* ---------- bury flow ---------- */
sheet:{night:true,render:()=>{const s=target();if(!s)return SCREENS.home.render();const yearly=s.cadence==='yearly'?s.price:s.price*12;
  const line=s.rating==='barely'?`${esc(s.name)} barely got used this month. Shall we?`:s.rating==='sometimes'?`${esc(s.name)} only gets used here and there. Shall we?`:`${esc(s.name)} costs ${m(s.price)} a ${s.cadence==='yearly'?'year':'month'}. Shall we?`;
  return `<div class="backdrop"></div><div class="content" style="padding:0;justify-content:flex-end"><div class="sheet"><div class="handle"></div>${plot('Sleepy',110)}<h2 class="t-m">${line}</h2><p class="t-dp c-plum">Burying it saves ${m(yearly)} a year.</p>
  <div class="card stack-s" style="width:100%;border-color:var(--stone);gap:8px"><span class="t-body">1&nbsp;&nbsp; We open ${esc(s.name)}’s cancel page</span><span class="t-body">2&nbsp;&nbsp; You hit cancel there</span><span class="t-body">3&nbsp;&nbsp; ${esc(s.name)} gets a tombstone and the savings counter starts</span></div>
  <button class="btn bury" ${act('go','handoff')}>Bury it</button><button class="btn ghost" ${act('keepIt')}>Keep it (for now)</button></div></div>`;}},
handoff:{render:()=>{const s=target();if(!s)return SCREENS.home.render();const apple=CATALOG[s.name]?.apple;const direct=hasDirectCancel(s.name);
  return `<div class="content mid"><div style="height:8px"></div>${plot('Content',140,'bob')}
  <h2 class="t-l">Off to ${esc(s.name)}’s cancel page.</h2><p class="t-body c-plum">Plot will wait right here. Come back when it’s done.</p>
  <div class="card" style="width:100%;gap:10px"><span class="t-cap c-dirt">WHAT TO EXPECT</span>${apple?`<span class="t-body">1&nbsp;&nbsp; This opens your Apple subscriptions</span><span class="t-body">2&nbsp;&nbsp; Tap ${esc(s.name)} → Cancel subscription</span>`:`<span class="t-body">1&nbsp;&nbsp; Log in to ${esc(s.name)}</span><span class="t-body">2&nbsp;&nbsp; Account → Cancel subscription</span><span class="t-body">3&nbsp;&nbsp; Say no to the “stay” offer</span>`}${direct?'':`<span class="t-cap c-plum">Plot doesn’t have a direct cancel link for ${esc(s.name)}, so this searches for the official steps.</span>`}</div>
  <div class="card" style="width:100%;background:var(--blush)"><span class="t-dp">${esc(s.name)} will offer you a discount. Plot says stay strong.</span></div>
  <div class="grow"></div>
  <a class="btn bury" href="${esc(cancelUrl(s.name))}" target="_blank" rel="noopener noreferrer" ${act('leftForCancel')}>Open ${esc(s.name)} ↗</a>
  <button class="btn ${T.pendingReturn?'primary':'ghost'}" ${act(T.pendingReturn?'go':'neverMind','didwork')}>${T.pendingReturn?'I’m back':'Never mind'}</button></div>`;}},
didwork:{render:()=>{const s=target();if(!s)return SCREENS.home.render();return `<div class="content mid"><div class="grow"></div>${plot('Alarmed',170)}
  <h2 class="t-l">Did it work?</h2><p class="t-body c-plum">Did ${esc(s.name)} actually let you go? Plot only buries things that are really cancelled.</p>
  <div class="grow"></div><button class="btn bury" ${act('confirmBury')}>Yes, it’s cancelled</button><button class="btn ghost" ${act('notYet')}>Not yet, remind me in 3 days</button><button class="linkbtn" ${act('neverMind')}>I changed my mind</button></div>`;}},
reminder:{render:()=>{const s=target()||{name:'It'};const d=parse(addDays(today(),3));return `<div class="content mid"><div class="grow"></div>${plot('Sleepy',170)}
  <h2 class="t-l">Plot will check back ${DOW[d.getDay()]}.</h2><p class="t-body c-plum">${esc(s.name)} stays on your list until it’s gone. Plot will ask about it on the Dashboard in 3 days.</p>
  <div class="card dash" style="width:100%"><span class="t-dp">${esc(s.name)} still costs ${m(s.price||0)} a month. Plot is patient.</span></div>
  <div class="grow"></div><button class="btn primary" ${act('back','home')}>Back to Dashboard</button></div>`;}},
rip:{night:true,render:()=>{const g=T.buried;if(!g)return SCREENS.graveyard.render();const next=T.queue.length?getSub(T.queue[0]):null;const yearly=g.cadence==='yearly'?g.price:g.price*12;
  return `<div class="content mid"><div style="height:10px"></div>${tomb(g,1.1,'rising',false)}<div class="dustwrap" id="dust"></div><span class="chip bg-moss" style="font-size:16px;padding:4px 12px;margin-top:-4px;animation:pop .45s cubic-bezier(.3,1.6,.5,1) 1.35s both">+${m(yearly)} a year</span>
  <h2 class="t-l c-bone">Rest in peace, ${esc(g.name)}.</h2><p class="t-dp c-stone">${g.nextDue?`The next charge was due ${fmtDay(g.nextDue)}. Plot will count it as saved.`:`The savings counter starts now.`}</p>
  <div class="card" style="width:100%;background:var(--ink);border:0;gap:2px"><span class="t-cap c-blush">GRAVEYARD TOTAL · ${S.graves.length} RESTING</span><span class="t-l c-moss">${m(graveTotal())}</span></div>
  <div class="grow"></div>${next?`<button class="btn bury" ${act('nextBury')}>Next: bury ${esc(next.name)}</button>`:''}<button class="btn light" ${act('tab','graveyard')}>See the Graveyard</button><button class="btn ghost" ${act('back','home')}>Back to Dashboard</button></div>`;},
  mount(el){const d=$('#dust',el);const t=setTimeout(()=>{for(let i=0;i<10;i++){const p=document.createElement('i');p.className='dust';const a=Math.PI*(i/9);p.style.left=`calc(50% + ${Math.cos(a)*30-5}px)`;p.style.top='-30px';p.style.setProperty('--dx',`${Math.cos(a)*90}px`);p.style.setProperty('--dy',`${-Math.sin(a)*40-10}px`);d.appendChild(p);}},350);return()=>clearTimeout(t);}},

/* ---------- graveyard ---------- */
graveyard:{night:true,tab:'graveyard',render:()=>{let g=[...S.graves];if(T.graveFilter==='recent')g.sort((a,b)=>b.buriedAt.localeCompare(a.buriedAt));if(T.graveFilter==='saved')g.sort((a,b)=>savedFor(b)-savedFor(a));
  return `<div class="content tabs"><h1 class="t-l c-bone">The Graveyard</h1>
  <div class="card" style="background:var(--ink);border:0;padding:24px 28px;gap:4px"><span class="t-cap c-blush">SAVED SINCE THE BURIALS BEGAN</span><span class="t-xl c-moss" id="gTotal">${m(graveTotal())}</span><span class="t-dp c-stone">${S.graves.length} subscription${S.graves.length===1?'':'s'} resting peacefully.</span></div>
  ${g.length?`<div class="filters" role="group" aria-label="Sort tombstones">${[['all','All'],['recent','Recently buried'],['saved','Most saved']].map(([k,l])=>`<button aria-pressed="${T.graveFilter===k}" ${act('graveFilter',k)}>${l}</button>`).join('')}</div>
  <div class="graves stagger">${g.map(x=>`<button ${act('openTomb',x.id)} aria-label="Open ${esc(x.name)}">${tomb(x,.8)}</button>`).join('')}</div>`
  :`<div class="stack" style="align-items:center;text-align:center;padding-top:20px">${plot('Sleepy',120)}<span class="t-m c-bone">Nothing buried yet.</span><span class="t-body c-stone">When you cancel something, its tombstone shows up here.</span></div>`}</div>${tabbar('graveyard')}`;},
  mount(el){countUp($('#gTotal',el),0,graveTotal(),900);}},
tomb:{night:true,render:()=>{const g=S.graves.find(x=>x.id===T.tombId);if(!g)return SCREENS.graveyard.render();const b=S.bounces[g.name];
  return `<div class="content"><button class="backlink c-bone" ${act('tab','graveyard')}>←&nbsp; Graveyard</button>
  <div style="display:flex;justify-content:center">${tomb(g,1.2,'',false)}</div>
  <div class="row" style="gap:8px;align-items:stretch"><div class="stat"><span class="t-cap c-stone">Saved so far</span><span class="t-m c-moss">${m(savedFor(g))}</span></div><div class="stat"><span class="t-cap c-stone">Resting for</span><span class="t-m c-bone">${Math.max(0,daysBetween(g.buriedAt.slice(0,10),today()))} days</span></div></div>
  <div class="card dash" style="border-color:var(--stone);background:transparent"><span class="t-title c-bone">Bounce history</span><span class="t-cap c-stone" style="font-size:13px">${b&&b.res?`Buried ${b.buried}× · Resurrected ${b.res}×`:'Buried once. Never came back.'}</span>${b&&b.res?`<span class="t-dp c-blush">Plot has started a tally.</span>`:''}</div>
  <div class="grow"></div><button class="btn res" ${act('resurrect',g.id)}>Resurrect</button><span class="t-cap c-stone center">Resurrecting logs a bounce and stops the savings counter.</span><button class="btn ghost" ${act('tab','graveyard')}>Leave it in peace</button></div>`;}},
back:{render:()=>{const g=T.revived;if(!g)return SCREENS.home.render();const b=bounce(g.name);
  return `<div class="content mid"><div class="grow"></div>${plot('Resurrected',180,'emerge')}
  <h2 class="t-l">${esc(g.name)} is back.</h2><p class="t-body c-plum">The savings counter stopped and the comeback is in your log. That’s ${b.res} so far.</p>
  <div class="card" style="width:100%;background:var(--candle)"><span class="t-dp">Plot is not judging. Plot is counting.</span></div>
  <div class="grow"></div><a class="btn res" href="${esc(homeUrl(g.name))}" target="_blank" rel="noopener noreferrer">Re-subscribe on ${esc(g.name)} ↗</a><button class="btn ghost" ${act('back','home')}>Back to active list</button></div>`;}},
log:{tab:'log',render:()=>{const names=[...new Set(S.log.map(e=>e.name))];const top=Object.entries(S.bounces).filter(([,b])=>b.res).sort((a,b)=>b[1].res-a[1].res)[0];const ev=S.log.filter(e=>T.logFilter==='All'||e.name===T.logFilter);
  return `<div class="content tabs"><h1 class="t-l">Resurrection log</h1><p class="t-body c-plum" style="margin-top:-8px">Every burial and every comeback.</p>
  ${top?`<div class="card thick" style="background:var(--blush)"><span class="t-cap">PATTERN SPOTTED</span><span class="t-strong">${esc(top[0])} keeps coming back. ${top[1].res} comeback${top[1].res>1?'s':''} so far, ${m(top[1].spent)} a month back on the bill.</span></div>`:''}
  ${S.log.length?`<div class="filters" role="group" aria-label="Filter log">${['All',...names.slice(0,4)].map(n=>`<button aria-pressed="${T.logFilter===n}" ${act('logFilter',n)}>${esc(n)}</button>`).join('')}</div>
  <div class="timeline">${ev.map(e=>`<div class="event"><i style="background:${e.type==='buried'?'var(--dirt)':'var(--moss)'}"></i><span class="stack-s" style="gap:1px"><span class="t-cap c-plum">${fmtCaps(e.at.slice(0,10))}${e.auto?' · found in your bank':''}</span><span class="t-strong">${e.type==='buried'?'Buried':'Resurrected'} ${esc(e.name)}</span></span></div>`).join('')}</div>`
  :`<div class="card dash"><span class="t-dp">Nothing logged yet. Bury something and it shows up here.</span></div>`}</div>${tabbar('log')}`;}}
};

/* =========================================================================
   Check-in deck
   ========================================================================= */
let scaleNow=1;
function drawCard(el){const deck=$('#deck',el);if(!deck)return;deck.querySelectorAll('.swcard').forEach(c=>c.remove());const s=getSub(T.deck[T.deckIndex]);if(!s)return;
 const c=document.createElement('div');c.className='swcard in';c.setAttribute('aria-label',`${s.name}: how much did you use it?`);
 c.innerHTML=`<span class="stamp l">BARELY</span><span class="stamp r">HERE &amp; THERE</span><span class="stamp u">KEEPER</span><span class="logo-tile">${esc(letter(s.name))}</span><span class="t-m">${esc(s.name)}</span><span class="t-body c-plum">${m(s.price)} ${s.cadence==='yearly'?'a year':'this month'}</span><hr><span class="t-title" style="font-size:18px">How much did you use it?</span><div class="said"><span class="t-dp c-plum">${s.rating?`Last time you said: “${RATE[s.rating].said}”`:'First check-in for this one.'}</span></div>`;
 deck.appendChild(c);
 let sx,sy,dx=0,dy=0,drag=false;const st=c.querySelectorAll('.stamp');
 const paint=()=>{c.style.transform=`translate(${dx}px,${dy}px) rotate(${dx/18}deg)`;st[0].style.opacity=Math.max(0,-dx/90);st[1].style.opacity=Math.max(0,dx/90);st[2].style.opacity=Math.abs(dx)<60?Math.max(0,-dy/90):0;};
 c.addEventListener('pointerdown',e=>{drag=true;sx=e.clientX;sy=e.clientY;c.classList.remove('settle','in');c.setPointerCapture(e.pointerId);});
 c.addEventListener('pointermove',e=>{if(!drag)return;dx=(e.clientX-sx)/scaleNow;const ry=(e.clientY-sy)/scaleNow;dy=ry<0?ry:ry*.2;paint();});
 const end=()=>{if(!drag)return;drag=false;if(dx<-90)rate('barely');else if(dx>90)rate('sometimes');else if(dy<-90)rate('constantly');else{c.classList.add('settle');dx=0;dy=0;paint();}};
 c.addEventListener('pointerup',end);c.addEventListener('pointercancel',end);
}
let rateLock=false;
function rate(k){if(rateLock)return;const el=cur.el;const c=$('.swcard',el);if(!c)return;rateLock=true;const s=getSub(T.deck[T.deckIndex]);if(s){s.rating=k;s.ratedAt=today();save();}
 c.style.transition='transform .42s cubic-bezier(.4,0,.6,1)';c.style.transform={barely:'translate(-460px,40px) rotate(-26deg)',sometimes:'translate(460px,40px) rotate(26deg)',constantly:'translate(0,-640px) rotate(-4deg)'}[k];
 c.querySelector({barely:'.stamp.l',sometimes:'.stamp.r',constantly:'.stamp.u'}[k]).style.opacity=1;
 el.querySelectorAll('.ratechip').forEach(b=>b.classList.toggle('on',b.dataset.arg===k));
 setTimeout(()=>{T.deckIndex++;rateLock=false;el.querySelectorAll('.ratechip').forEach(b=>b.classList.remove('on'));
  const p=$('#prog',el),pt=$('#progTxt',el);if(p)p.style.width=(T.deckIndex/T.deck.length*100)+'%';
  if(T.deckIndex>=T.deck.length){S.checkins[monthKey()]=today();save();go('verdict','zoom');}
  else{if(pt)pt.textContent=`${T.deckIndex+1} of ${T.deck.length}`;drawCard(el);}},420);
}

/* =========================================================================
   Actions
   ========================================================================= */
function startBury(ids){T.queue=ids.slice(1);T.target={kind:'sub',id:ids[0]};T.pendingReturn=false;go('sheet');}
function doBury(){const s=target();if(!s)return;const isTrial=T.target.kind==='trial';
 if(isTrial)S.trials=S.trials.filter(x=>x.id!==s.id);else S.subs=S.subs.filter(x=>x.id!==s.id);
 const g={id:uid(),name:s.name,price:s.price,cadence:s.cadence||'monthly',from:s.first||s.started||today(),lastCharge:isTrial?addDays(s.ends,-30):(s.last||today()),buriedAt:new Date().toISOString(),source:'app',nextDue:isTrial?s.ends:(s.next||null)};
 S.graves.unshift(g);T.buried=g;logEvent('buried',s.name);bounce(s.name).buried++;save();}
const ACT={
 go(arg){go(arg);},
 back(arg){go(arg||'home','back');},
 tab(k){go({home:'home',checkin:'intro',graveyard:'graveyard',log:'log'}[k],'tab');},
 method(k){T.method=k;rerender();},
 connectBank(_,btn){connectBank(btn);},
 useDemoBank(){S.bank={name:'Plot Demo Bank',mask:'4242',demo:true,connectedAt:new Date().toISOString()};S.scan=null;T.scanError=null;T.scanMsg='Connecting to Plot Demo Bank…';save();go('found');scan().catch(e=>{T.scanError=e.message;rerender();});},
 togglePlaidKeys(){T.showPlaid=!T.showPlaid;rerender();if(T.showPlaid)setTimeout(()=>$('#pId',cur.el)?.focus({preventScroll:false}),50);},
 async savePlaidKeys(_,btn){const el=cur.el;const client_id=$('#pId',el).value,secret=$('#pSecret',el).value;if(!client_id||!secret){toast('Paste both keys first.');return;}
  const lab=btn.querySelector('.set-label > span')||btn;btn.disabled=true;lab.textContent='Checking with Plaid…';
  try{const r=await fetch('/dev/setup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({client_id,secret})});const d=await r.json().catch(()=>({}));if(!r.ok)throw new Error(d.error||'Couldn’t save the keys.');
   toast('Plaid accepted the keys.');connectBank(null,true);}
  catch(e){toast(e.message);btn.disabled=false;lab.textContent='Save and connect';}},
 async rescan(){T.scanError=null;S.scan=null;rerender();try{await scan();}catch(e){T.scanError=e.message;rerender();}},
 async rescanFromSettings(_,btn){btn.disabled=true;btn.textContent='Scanning…';try{await scan();const before=S.subs.length;applyScan();toast(S.subs.length>before?`Plot found ${S.subs.length-before} new.`:'Nothing new. Plot checked twice.');}catch(e){toast(e.message);}rerender();},
 disconnect(){S.bank=null;S.scan=null;save();toast('Demo bank disconnected. Your list stays.');rerender();},
 erase(){if(!T.eraseArmed){T.eraseArmed=true;rerender();setTimeout(()=>{T.eraseArmed=false;},4000);return;}try{localStorage.removeItem(KEY);}catch{}S=blank();T.eraseArmed=false;T.lastTotal=undefined;applyPrefs();go('welcome','fade');},
 toggleFound(name,b){S.removed[name]=!S.removed[name];save();b.classList.toggle('off',!!S.removed[name]);b.setAttribute('aria-pressed',!S.removed[name]);const x=S.scan.subscriptions.find(y=>y.name===name);b.querySelector('.chip').textContent=S.removed[name]?'Removed':`${x.charges.length} charges · ${x.cadence}`;},
 acceptScan(){applyScan();go(S.onboarded?'home':'trials');},
 saveManual(again){const el=cur.el;const name=$('#fName',el).value.trim();const price=parseFloat($('#fPrice',el).value.replace(/[^0-9.]/g,''));
  if(!name){toast('Give it a name first.');$('#fName',el).focus();return;}if(!(price>0)){toast('Add the price, like 15.99.');$('#fPrice',el).focus();return;}
  const cadence=$('[data-cycle][aria-pressed="true"]',el).dataset.cycle;
  if($('#fTrial',el).getAttribute('aria-checked')==='true'){S.trials.push({id:uid(),name,price,ends:$('#fNext',el).value||addDays(today(),7),warn:'48',started:today(),source:'manual'});save();toast(`Plot is watching the ${name} trial.`);if(again==='again')rerender();else go(S.onboarded?'home':'trials');return;}
  S.subs.push({id:uid(),name,price,cadence,next:$('#fNext',el).value||null,last:null,first:today(),charges:[],source:'manual',rating:null});save();
  if(again==='again'){toast(`Saved ${name}. Add another.`);rerender();}else{toast(`Saved ${name}.`);go(S.onboarded?'home':'trials');}},
 removeTrial(id){S.trials=S.trials.filter(t=>t.id!==id);save();rerender();},
 saveTrial(){const el=cur.el;const name=$('#tName',el).value.trim();const ends=$('#tEnds',el).value;const price=parseFloat($('#tPrice',el).value.replace(/[^0-9.]/g,''));
  if(!name){toast('Which service is the trial for?');$('#tName',el).focus();return;}if(!ends){toast('Pick the day the trial ends.');return;}
  S.trials.push({id:uid(),name,price:price>0?price:9.99,ends,warn:$('[data-warn][aria-pressed="true"]',el).dataset.warn,started:today(),source:'manual'});save();toast(`Plot is watching ${name}.`);go(S.onboarded?'home':'trials','back');},
 finishOnboard(){S.onboarded=true;save();go('home','fade');},
 skipToHome(){const saved=savedAccount();
  if(saved){S=saved;try{localStorage.removeItem(ACCOUNT_KEY);}catch{}S.onboarded=true;save();applyPrefs();T.lastTotal=undefined;toast(`Welcome back${S.profile.name?', '+S.profile.name:''}.`);go('home','fade');return;}
  S.onboarded=true;save();go('home','fade');},
 logout(){if(!T.logoutArmed){T.logoutArmed=true;rerender();setTimeout(()=>{T.logoutArmed=false;},4000);return;}
  T.logoutArmed=false;try{localStorage.setItem(ACCOUNT_KEY,JSON.stringify(S));localStorage.removeItem(KEY);}catch{}
  S=blank();T.lastTotal=undefined;applyPrefs();go('welcome','fade');toast('Logged out. Tap “I already have an account” to come back.');},
 markTrial(id){const s=getSub(id);if(!s)return;S.subs=S.subs.filter(x=>x.id!==id);S.trials.push({id:uid(),name:s.name,price:s.price,ends:s.next||addDays(today(),7),warn:'48',started:today(),source:s.source});save();toast(`Plot will count down to ${s.name}’s first charge.`);rerender();},
 async enableNudges(_,btn){
  if(!('Notification' in window)){toast('This browser can’t show reminders. On iPhone, add Plot to your Home Screen first.');ACT.finishOnboard();return;}
  btn.disabled=true;const p=await Notification.requestPermission().catch(()=>'denied');
  if(p==='granted'){try{const reg=await navigator.serviceWorker?.ready;const body=`${Math.max(S.subs.length,1)} subscriptions. 2 minutes. Plot has questions.`;if(reg)await reg.showNotification('Monthly check-in is ready',{body,icon:'/icons/icon-192.png',badge:'/icons/icon-192.png',tag:'checkin'});else new Notification('Monthly check-in is ready',{body,icon:'/icons/icon-192.png'});}catch{}S.nudges=true;save();toast('Reminders are on. Plot just sent a test one.');}
  else toast('Reminders are off. You can turn them on in your phone’s settings.');
  ACT.finishOnboard();},
 startCheckin(){if(S.checkins[monthKey()]){toast('You already checked in this month.');go('intro','fade');return;}T.deck=S.subs.map(s=>s.id);T.deckIndex=0;go('swipe');},
 saveName(){const v=($('#nm',cur.el)?.value||'').trim();S.profile.name=v;save();toast(v?`Plot will call you ${v}.`:'Name cleared.');go('settings','back');},
 async togglePref(k,btn){const on=!S.prefs[k];
  if(on&&(k==='checkinNudge'||k==='trialAlerts')){if(!('Notification' in window)){toast('This browser can’t send notifications. On iPhone, add Plot to your Home Screen first.');return;}const p=await Notification.requestPermission().catch(()=>'denied');if(p!=='granted'){toast('Notifications are blocked. Turn them on in your phone’s settings.');return;}}
  S.prefs[k]=on;save();applyPrefs();btn.setAttribute('aria-checked',on);btn.querySelector('.toggle').setAttribute('aria-checked',on);},
 cycleWarn(){S.prefs.trialWarn=S.prefs.trialWarn==='week'?'48':'week';S.trials.forEach(t=>t.warn=S.prefs.trialWarn);save();rerender();},
 cycleSort(){S.prefs.sort=S.prefs.sort==='price'?'least':'price';save();rerender();},
 exportData(){const blob=new Blob([JSON.stringify({exported:new Date().toISOString(),...S,bank:S.bank?{name:S.bank.name,mask:S.bank.mask,demo:!!S.bank.demo}:null},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`subscription-graveyard-${today()}.json`;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove();},500);toast('Saved your data as a file.');},
 reopenCheckin(){delete S.checkins[monthKey()];save();toast('This month’s check-in is open again.');go('intro','fade');},
 rate(k){rate(k);},
 rateOne(k){const s=getSub(T.subId);if(s){s.rating=k;s.ratedAt=today();save();rerender();}},
 remindTonight(){toast('Plot will ask again tonight.');go('home','back');},
 openSub(id){T.subId=id;go('sub');},
 buryOne(id){startBury([id]);},
 buryAll(){startBury(S.subs.filter(s=>s.rating==='barely').map(s=>s.id));},
 keepIt(){T.queue=[];toast('Kept. Plot will ask again next month.');go('home','fade');},
 leftForCancel(){T.pendingReturn=true;setTimeout(()=>{if(cur.id==='handoff')rerender();},400);},
 neverMind(){T.queue=[];T.pendingReturn=false;toast('Nothing was cancelled.');go('home','fade');},
 confirmBury(){doBury();T.pendingReturn=false;go('rip','zoom');},
 notYet(){const s=target();if(s&&T.target.kind==='sub'){s.remindAt=addDays(today(),3);save();}T.pendingReturn=false;go('reminder');},
 checkReminder(id){const s=getSub(id);if(!s)return;delete s.remindAt;save();T.target={kind:'sub',id};T.queue=[];go('didwork');},
 nextBury(){const id=T.queue.shift();T.target={kind:'sub',id};T.pendingReturn=false;go('sheet');},
 openTrial(id){T.trialId=id;go('trial','zoom');},
 cancelTrial(id){T.queue=[];T.target={kind:'trial',id};T.pendingReturn=false;go('handoff');},
 letCharge(id){const t=getTrial(id);if(!t)return;S.trials=S.trials.filter(x=>x.id!==id);const s={id:uid(),name:t.name,price:t.price,cadence:'monthly',next:t.ends,last:null,first:t.started||today(),charges:[],source:'trial',rating:null};S.subs.push(s);save();T.flash=s.id;toast(`${t.name} becomes ${m(t.price)}/mo on ${fmtDay(t.ends)}. Plot noticed.`);go('home','fade');},
 snooze(id){const t=getTrial(id);if(t){t.snoozed=today();save();}toast('Plot will sound the alarm again tomorrow.');go('home','fade');},
 openTomb(id){T.tombId=id;go('tomb');},
 graveFilter(k){T.graveFilter=k;rerender();},
 logFilter(n){T.logFilter=n;rerender();},
 resurrect(id){const g=S.graves.find(x=>x.id===id);if(!g)return;S.graves=S.graves.filter(x=>x!==g);const b=bounce(g.name);b.res++;b.spent=g.price;
  logEvent('res',g.name);const s={id:uid(),name:g.name,price:g.price,cadence:g.cadence||'monthly',next:addDays(today(),g.cadence==='yearly'?365:30),last:today(),first:today(),charges:[],source:'resurrected',rating:null,back:true};S.subs.push(s);save();T.revived=g;T.flash=s.id;go('back','zoom');}
};

/* =========================================================================
   Router
   ========================================================================= */
let cur={id:null,el:null,cleanup:null};
const phone=$('#phone');
function build(id){const sc=SCREENS[id];const el=document.createElement('section');el.className='screen'+(sc.night?' night':'');el.innerHTML=sc.render();return el;}
function settlePill(el,animate){const pill=el.querySelector('.tabbar .pill');if(!pill)return;const set=()=>{pill.style.transform=`translateX(calc(${pill.dataset.to} * (100% + 4px)))`;};animate?requestAnimationFrame(()=>requestAnimationFrame(set)):set();}
function go(id,anim='push'){if(!SCREENS[id])id='home';const sc=SCREENS[id];if(cur.cleanup)cur.cleanup();const el=build(id);const old=cur.el;
 el.classList.add('enter-'+anim);phone.appendChild(el);
 if(old){old.classList.add('exit-'+anim);setTimeout(()=>old.remove(),anim==='tab'?220:420);}
 setTimeout(()=>el.classList.remove('enter-'+anim),520);
 settlePill(el,true);if(sc.tab)T.tab=sc.tab;
 cur={id,el,cleanup:sc.mount?sc.mount(el)||null:null};
 const c=el.querySelector('.content');if(c)c.scrollTop=0;
}
function rerender(){if(!cur.id)return;const sc=SCREENS[cur.id];const scroll=cur.el.querySelector('.content')?.scrollTop||0;if(cur.cleanup)cur.cleanup();const el=build(cur.id);cur.el.replaceWith(el);el.querySelectorAll('.stagger').forEach(s=>s.classList.remove('stagger'));const c=el.querySelector('.content');if(c)c.scrollTop=scroll;settlePill(el,false);cur={id:cur.id,el,cleanup:sc.mount?sc.mount(el)||null:null};}
phone.addEventListener('click',e=>{const t=e.target.closest('[data-act]');if(!t||!phone.contains(t)||t.disabled)return;const f=ACT[t.dataset.act];if(!f)return;if(t.tagName!=='A')e.preventDefault();f(t.dataset.arg,t);});
// Coming back from a cancel page: ask whether it worked.
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'&&T.pendingReturn&&cur.id==='handoff'){setTimeout(()=>go('didwork','fade'),350);}});

/* =========================================================================
   Phone frame on laptops, full screen on phones
   ========================================================================= */
const stage=$('#stage'),device=$('#device'),holder=$('#holder');
function layout(){const standalone=matchMedia('(display-mode: standalone)').matches||navigator.standalone;const full=standalone||innerWidth<600;
 stage.classList.toggle('full',full);stage.classList.toggle('framed',!full);
 if(full){scaleNow=1;device.style.transform='';holder.style.width=holder.style.height='';return;}
 scaleNow=Math.min(1,(innerHeight-90)/880,(innerWidth-32)/417);device.style.transform=`scale(${scaleNow})`;holder.style.width=417*scaleNow+'px';holder.style.height=880*scaleNow+'px';}
addEventListener('resize',layout);layout();
function applyPrefs(){document.documentElement.classList.toggle('calm',!!S.prefs.reduceMotion);}
applyPrefs();

/* =========================================================================
   Start
   ========================================================================= */
if(!S.onboarded){go('welcome','fade');}
else{go('home','fade');
  // A trial inside its warning window gets the dramatic alert once a day.
  const due=S.prefs.trialAlerts&&S.trials.find(t=>{const left=(trialEnds(t)-Date.now())/DAY;return left<=(t.warn==='week'?7:2)&&t.snoozed!==today();});
  if(due&&S.lastAlert!==today()){S.lastAlert=today();save();setTimeout(()=>{T.trialId=due.id;go('trial','zoom');},900);}
}
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost')){navigator.serviceWorker.register('/graveyard-app/sw.js',{scope:'/graveyard-app/'}).catch(()=>{});}
