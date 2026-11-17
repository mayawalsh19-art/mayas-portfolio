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
 chev:'<path d="M9 6l6 6-6 6"/>',
 tag:'<path d="M3 12.5V4.5A1.5 1.5 0 0 1 4.5 3h8l8.5 8.5-9.5 9.5z"/><circle cx="8" cy="8" r="1.6"/>'
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
 'Headspace':{home:'https://www.headspace.com/'},
 'YouTube TV':{cancel:'https://tv.youtube.com/settings/membership',home:'https://tv.youtube.com/',addons:'https://tv.youtube.com/settings/membership'},
 'Amazon Prime':{cancel:'https://www.amazon.com/gp/primecentral',home:'https://www.amazon.com/amazonprime',addons:'https://www.amazon.com/gp/video/settings/channels'}
};
// Add-ons each service really sells, with typical US monthly prices (late 2026). Prices fill in
// the form but stay editable, since promos and plan tiers vary. [] = the service sells no add-ons.
const CH={hbo:['HBO Max',10.99],starz:['Starz',10.99],ppp:['Paramount+ Premium',13.99],amc:['AMC+',9.99],mgm:['MGM+',6.99],brit:['BritBox',8.99],acorn:['Acorn TV',8.99],shudder:['Shudder',8.99],cinemax:['Cinemax',9.99]};
const ADDON_OPTIONS={
 'Amazon Prime':[['Prime Video Ultra (no ads)',4.99],CH.hbo,CH.starz,CH.ppp,['Paramount+ Essential',8.99],CH.amc,CH.mgm,['Apple TV',12.99],['Peacock Premium Plus',16.99],['Crunchyroll',7.99],CH.cinemax,CH.brit,CH.acorn,CH.shudder,['discovery+',4.99],['Hallmark+',7.99],['PBS Masterpiece',5.99]],
 'Hulu':[CH.hbo,CH.starz,CH.ppp,CH.cinemax,['Unlimited Screens',9.99]],
 'YouTube TV':[['4K Plus',9.99],['Sports Plus',10.99],['Spanish Plus',14.99],CH.hbo,CH.starz,CH.ppp,CH.cinemax,CH.amc],
 'YouTube Premium':[CH.hbo,CH.starz,CH.ppp,CH.amc,CH.mgm,CH.shudder],
 'Apple TV+':[CH.starz,CH.ppp,CH.amc,CH.mgm,CH.brit,CH.acorn,CH.shudder],
 'Netflix':[['Extra member (with ads)',7.99],['Extra member (no ads)',9.99]],
 'Disney+':[['Extra member (with ads)',6.99],['Extra member (no ads)',9.99]],
 'Max':[['Extra member',7.99]],
 'Spotify':[['Audiobooks+',11.99]],
 'Peacock':[],'Paramount+':[],'iCloud+':[],'Google One':[],'Audible':[],'Peloton App':[],'Duolingo':[],'Calm':[],'Crunchyroll':[],'Headspace':[]
};
// Match whatever the user typed ("prime video", "hbo max", "youtube tv") to a known service.
const ALIAS=[[/amazon prime|prime video|^amazon$|^prime$/i,'Amazon Prime'],[/youtube ?tv/i,'YouTube TV'],[/youtube|yt premium/i,'YouTube Premium'],[/apple ?tv/i,'Apple TV+'],[/hbo|^max$/i,'Max'],[/netflix/i,'Netflix'],[/hulu/i,'Hulu'],[/disney/i,'Disney+'],[/spotify/i,'Spotify'],[/peacock/i,'Peacock'],[/paramount/i,'Paramount+'],[/icloud/i,'iCloud+'],[/google one/i,'Google One'],[/audible/i,'Audible'],[/peloton/i,'Peloton App'],[/duolingo/i,'Duolingo'],[/calm/i,'Calm'],[/crunchyroll/i,'Crunchyroll'],[/headspace/i,'Headspace']];
const canon=n=>{const t=String(n||'').trim();for(const [re,name] of ALIAS)if(re.test(t))return name;return t;};
const addonOptions=n=>ADDON_OPTIONS[canon(n)];
/* =========================================================================
   Discounts: cheaper plans for students, educators, military and people on
   government assistance. Typical US prices, late 2026. The service verifies
   eligibility (UNiDAYS, SheerID, ID.me...); Plot never asks for proof.
   price = monthly price on the discount plan, pct = share off, 0 = free.
   ========================================================================= */
const WHO={student:{label:'Student',sub:'College or university',short:'student'},educator:{label:'Teacher or school staff',sub:'K–12 educators and staff',short:'educator'},military:{label:'Military or veteran',sub:'Service members, veterans, families',short:'military'},assist:{label:'Government assistance',sub:'EBT, SNAP, Medicaid, SSI or WIC',short:'assistance'}};
const DISCOUNTS={
 'Spotify':[{who:'student',plan:'Spotify Premium Student',price:6.99,note:'and it includes Hulu (with ads)',url:'https://www.spotify.com/us/student/'}],
 'YouTube Premium':[{who:'student',plan:'YouTube Premium Student',price:8.99,url:'https://www.youtube.com/premium/student'}],
 'Amazon Prime':[{who:'student',plan:'Prime Student',price:7.49,note:'after 6 free months',url:'https://www.amazon.com/amazonprime?planOptimizationId=WLPStudentMonthlyEligiblePlans'},{who:'assist',plan:'Prime Access',price:6.99,note:'with EBT, SNAP, Medicaid or SSI',url:'https://www.amazon.com/primeaccess'}],
 'Hulu':[{who:'student',plan:'Hulu Student',price:1.99,note:'on the plan with ads',url:'https://www.hulu.com/student'}],
 'Max':[{who:'student',plan:'HBO Max Student',price:4.99,note:'on Basic with Ads',url:SEARCH('HBO Max student discount UNiDAYS')}],
 'Peacock':[{who:'student',plan:'Peacock Premium for students',price:5.99,note:'for 12 months',url:SEARCH('Peacock student discount')},{who:'military',plan:'Peacock Premium military pricing',price:6.99,url:SEARCH('Peacock military discount')}],
 'Paramount+':[{who:'military',plan:'Paramount+ military discount',pct:.5,url:SEARCH('Paramount+ military discount SheerID')}],
 'Disney+':[{who:'military',plan:'Disney+ military offer',pct:null,url:'https://press.disneyplus.com/disney+-military-discount-now-available-to-veterans-service-members-and-families'}],
 'Apple TV+':[{who:'student',plan:'Apple Music Student',price:5.99,note:'and Apple TV+ comes free with it',url:'https://www.apple.com/apple-music/'}],
 'Headspace':[{who:'educator',plan:'Headspace for Educators',price:0,url:'https://www.headspace.com/educators'}]
};
const myWho=()=>S.profile.discounts||[];
// Best discount for this subscription given who the user said they are.
function cheaperFor(s,who=myWho()){if(s.bundle)return null;const opts=(DISCOUNTS[canon(s.name)]||[]).filter(d=>who.includes(d.who));let best=null;
 for(const d of opts){const now=monthly(s);const p=d.price!=null?d.price:(d.pct!=null?Math.round(now*(1-d.pct)*100)/100:null);if(p!=null&&p>=now)continue;const save=p==null?null:Math.round((now-p)*12*100)/100;if(!best||(save??0)>(best.save??0))best={...d,newPrice:p,save};}
 return best;}
const yearlySavings=(who=myWho())=>S.subs.reduce((a,s)=>a+(cheaperFor(s,who)?.save||0),0);
// ---------- Services you can search for and add ----------
// Typical US prices (late 2026). Shown as "about": the add screen keeps the price editable.
const SERVICES=[
 ['Streaming',[
  ['Netflix',[['Standard with ads',8.99],['Standard',19.99],['Premium',26.99]]],
  ['Hulu',[['Hulu',11.99]]],
  ['Disney+',[['Disney+ with ads',11.99]]],
  ['Max',[['Basic with ads',10.99],['Standard',18.49]],'HBO Max'],
  ['Peacock',[['Select',7.99],['Premium',10.99]]],
  ['Paramount+',[['Essential',8.99]]],
  ['Apple TV+',[['Monthly',14.99],['Yearly',119,'yearly']]],
  ['Amazon Prime',[['Monthly',14.99],['Yearly',139,'yearly']]],
  ['YouTube TV',[['Base plan',82.99]]],
  ['Crunchyroll',[['Fan',7.99]]],
  ['Disney+/Hulu bundle',[['With ads',12.99]]],
  ['Disney+/Hulu/HBO Max bundle',[['With ads',19.99]]]]],
 ['Music & audio',[
  ['Spotify',[['Premium Individual',11.99]]],
  ['YouTube Premium',[['Individual',13.99]]],
  ['Apple Music',[['Individual',10.99]]],
  ['Audible',[['Premium Plus',14.95],['Yearly',149.50,'yearly']]]]],
 ['Storage & software',[
  ['iCloud+',[['50 GB',0.99],['200 GB',2.99],['2 TB',9.99]]],
  ['Google One',[['100 GB',1.99],['2 TB',9.99]]],
  ['Apple One',[['Individual',21.95]]],
  ['Microsoft 365',[['Personal',9.99]]],
  ['ChatGPT',[['Plus',20]]],
  ['Claude',[['Pro',20]]]]],
 ['Fitness & wellness',[
  ['Peloton App',[['App One',12.99]]],
  ['Strava',[['Subscription',11.99]]],
  ['Calm',[['Monthly',14.99],['Yearly',69.99,'yearly']]],
  ['Headspace',[['Monthly',12.99],['Yearly',69.99,'yearly']]]]],
 ['Learning',[
  ['Duolingo',[['Super',12.99]]]]],
 ['Shopping & delivery',[
  ['Uber One',[['Monthly',9.99]]],
  ['DashPass',[['Monthly',9.99]],'DoorDash'],
  ['Instacart+',[['Monthly',9.99]]],
  ['Walmart+',[['Monthly',12.95]]]]],
 ['Gaming',[
  ['PlayStation Plus',[['Essential',9.99]]],
  ['Nintendo Switch Online',[['Individual',3.99]]],
  ['Xbox Game Pass',[['Ultimate',29.99]]]]]];
const SVC_LIST=SERVICES.flatMap(([cat,list])=>list.map(([name,plans,alt])=>({name,plans,alt,cat})));
function svcRow(v){const have=S.subs.some(s=>canon(s.name)===canon(v.name)&&!s.bundle)||S.subs.some(s=>s.name===v.name);const from=Math.min(...v.plans.filter(p=>p[2]!=='yearly').map(p=>p[1]).concat([Infinity]));
 return `<button class="svcrow" ${have?'disabled':act('pickSvc',v.name)}><span class="logo-tile" style="background:${svcColor(v.name)};color:${svcInk(v.name)}">${esc(letter(v.alt||v.name))}</span><span class="stack-s grow" style="gap:1px;min-width:0;text-align:left"><span class="t-strong">${esc(v.alt||v.name)}</span><span class="t-cap c-plum">${esc(v.cat)}${from<Infinity?` · about ${m(from)}/mo`:''}</span></span>${have?`<span class="chip bg-moss">On your list</span>`:`<span class="plus" aria-hidden="true">+</span>`}</button>`;}
function svcResults(q){q=(q||'').trim().toLowerCase();
 if(!q)return SERVICES.map(([cat,list])=>`<span class="section-label">${esc(cat)}</span><div class="stack" style="gap:8px">${list.map(([name])=>svcRow(SVC_LIST.find(v=>v.name===name))).join('')}</div>`).join('');
 const hits=SVC_LIST.filter(v=>(v.name+' '+(v.alt||'')+' '+v.cat).toLowerCase().includes(q));
 return `<div class="stack" style="gap:8px">${hits.map(svcRow).join('')}<button class="svcrow custom" ${act('pickCustom',q)}><span class="logo-tile dim">+</span><span class="stack-s grow" style="gap:1px;text-align:left"><span class="t-strong">Add “${esc(q)}” by hand</span><span class="t-cap c-plum">Name it, price it, done.</span></span></button></div>`;}
// ---------- Every cheaper way Plot can find, beyond who-you-are discounts ----------
// Typical US prices, late 2026. Shown as "about"; the service's own page has the final price.
const AD_PLANS={'Netflix':{plan:'Standard with ads',price:8.99},'Max':{plan:'Basic with ads',price:10.99},'Disney+':{plan:'Disney+ with ads',price:11.99},'Spotify':{plan:'Spotify Free',price:0,note:'It has ads and shuffle, but costs nothing'}};
const YEARLY={'Amazon Prime':{monthly:14.99,yearly:139},'Apple TV+':{monthly:14.99,yearly:119},'Calm':{monthly:14.99,yearly:69.99},'Headspace':{monthly:12.99,yearly:69.99},'Audible':{monthly:14.95,yearly:149.50}};
const BUNDLES=[
 {name:'Disney+, Hulu and HBO Max bundle (with ads)',short:'Disney+/Hulu/HBO Max bundle',has:['Disney+','Hulu','Max'],price:19.99,min:2,url:SEARCH('Disney+ Hulu HBO Max bundle')},
 {name:'Disney+ and Hulu bundle (with ads)',short:'Disney+/Hulu bundle',has:['Disney+','Hulu'],price:12.99,min:2,url:SEARCH('Disney+ Hulu bundle Duo Basic')},
 {name:'Apple One Individual',short:'Apple One',has:['Apple TV+','iCloud+'],price:21.95,min:2,note:'and it adds Apple Music and Arcade',url:'https://www.apple.com/apple-one/'}];
const KIND={discount:{label:'Discount',cls:'k-discount'},overlap:{label:'Paying twice',cls:'k-overlap'},yearly:{label:'Pay yearly',cls:'k-yearly'},ads:{label:'Plan with ads',cls:'k-ads'},bundle:{label:'Bundle',cls:'k-bundle'}};
const r2=n=>Math.round(n*100)/100;
function allTips(){const tips=[];const subs=S.subs.filter(x=>!x.bundle);const by=n=>subs.find(s=>canon(s.name)===n);const who=myWho();
 // 1. discounts for who you are
 for(const s of subs){const d=cheaperFor(s,who);if(!d)continue;const w=WHO[d.who].short;
  tips.push({id:'disc:'+s.id,kind:'discount',subs:[s.name],save:d.save,url:d.url,cta:`Get the ${w} price`,sw:{subId:s.id,plan:d.plan,price:d.newPrice,verify:w},
   title:`${d.plan}`,text:`You pay ${m(monthly(s))}. ${esc(d.plan)} is ${d.newPrice===0?'free for you':d.newPrice!=null?m(d.newPrice)+'/mo':'cheaper'}${d.note?' '+esc(d.note):''}.${d.save?` That’s ${m(d.save)} a year back.`:' Check the price on their page.'}`});}
 // 2. paying twice
 const sp=by('Spotify'),hu=by('Hulu');
 if(sp&&hu&&sp.plan==='Spotify Premium Student')tips.push({id:'ov:spotify-hulu-done',kind:'overlap',subs:[sp.name,hu.name],save:r2(monthly(hu)*12),bury:hu.id,title:'Hulu already comes with your Spotify',text:`Spotify Premium Student includes Hulu (with ads). The separate Hulu is ${m(monthly(hu)*12)} a year you don’t need.`});
 else if(who.includes('student')&&sp&&hu)tips.push({id:'ov:spotify-hulu',kind:'overlap',subs:[sp.name,hu.name],save:r2(monthly(hu)*12),url:'https://www.spotify.com/us/student/',cta:'See Spotify Student',sw:{subId:sp.id,plan:'Spotify Premium Student',price:6.99,verify:'student',thenBury:hu.id},
  title:'Hulu comes with Spotify Student',text:`Spotify Premium Student includes Hulu (with ads). Switch Spotify to Student and you can bury Hulu: ${m(monthly(hu)*12)} a year.`});
 for(const s of subs)for(const a of addonsOf(s)){const twin=subs.find(x=>x!==s&&canon(x.name)===canon(a.name));if(twin)tips.push({id:'ov:addon:'+s.id+a.id,kind:'overlap',subs:[s.name,twin.name],save:r2(Math.min(a.price,monthly(twin))*12),act:['openSub',s.id],cta:`Open ${s.name}`,bury:twin.id,
  title:`You pay for ${a.name} twice`,text:`${esc(a.name)} is an add-on inside ${esc(s.name)} and its own subscription too. Keep one: ${m(Math.min(a.price,monthly(twin))*12)} a year.`});}
 const ic=by('iCloud+'),go=by('Google One');
 if(ic&&go){const low=monthly(ic)<monthly(go)?ic:go;tips.push({id:'ov:storage',kind:'overlap',subs:[ic.name,go.name],save:r2(monthly(low)*12),act:['openSub',low.id],bury:low.id,cta:`Open ${low.name}`,title:'Two cloud storage plans',text:`You pay for iCloud+ and Google One. If one is enough, that’s ${m(monthly(low)*12)} a year.`});}
 const yt=by('YouTube Premium');
 if(yt&&sp&&!(who.includes('student')))tips.push({id:'ov:ytmusic',kind:'overlap',subs:[yt.name,sp.name],save:r2(monthly(sp)*12),act:['openSub',sp.id],bury:sp.id,cta:'Open Spotify',title:'YouTube Premium includes YouTube Music',text:`If YouTube Music works for you, Spotify is ${m(monthly(sp)*12)} a year you don’t need.`});
 // 3. pay yearly
 for(const s of subs){const y=YEARLY[canon(s.name)];if(!y||s.cadence==='yearly'||Math.abs(s.price-y.monthly)>y.monthly*.1)continue;const save=r2(s.price*12-y.yearly);if(save<5)continue;
  tips.push({id:'yr:'+s.id,kind:'yearly',subs:[s.name],save,url:cancelUrl(s.name),cta:`Switch on ${s.name}`,sw:{subId:s.id,plan:'Yearly plan',price:y.yearly,cadence:'yearly'},title:`${s.name}, paid yearly`,text:`Monthly costs ${m(s.price*12)} a year. The yearly plan is ${m(y.yearly)}. Same thing, ${m(save)} less.`});}
 // 4. plans with ads, only for things you barely use
 for(const s of subs){const a=AD_PLANS[canon(s.name)];if(!a||!(s.rating==='barely'||s.rating==='sometimes')||monthly(s)-a.price<1)continue;const save=r2((monthly(s)-a.price)*12);
  tips.push({id:'ads:'+s.id,kind:'ads',subs:[s.name],save,url:cancelUrl(s.name),cta:`Change plan on ${s.name}`,sw:{subId:s.id,plan:a.plan,price:a.price},title:`${s.name}: ${a.plan}`,text:`You ${s.rating==='barely'?'barely use':'only sometimes use'} ${esc(s.name)}. ${esc(a.plan)} is ${a.price?m(a.price)+'/mo':'free'}${a.note?'. '+esc(a.note):''}. That’s ${m(save)} a year.`});}
 // 5. bundles: the biggest one you qualify for that beats what you pay now
 for(const b of BUNDLES){const mine=b.has.map(by).filter(Boolean);if(mine.length<b.min)continue;const now=mine.reduce((t,s)=>t+monthly(s),0);if(now<=b.price)continue;
  if(tips.some(t=>t.kind==='bundle'&&mine.every(s=>t.subs.includes(s.name))))continue;const save=r2((now-b.price)*12);
  tips.push({id:'bn:'+b.name,kind:'bundle',subs:mine.map(s=>s.name),save,url:b.url,cta:'See the bundle',sw:{subId:mine[0].id,merge:mine.map(s=>s.id),plan:b.name,price:b.price,bundleName:b.short},title:b.name,text:`${mine.map(s=>esc(s.name)).join(' + ')} cost you ${m(now)} a month. The ${esc(b.name)} is ${m(b.price)}${b.note?' '+esc(b.note):''}. That’s ${m(save)} a year.`});}
 return tips.filter(t=>t.save==null||t.save>0);}
// ---------- Switching to a cheaper plan ----------
// Plot can't change a plan for you: it hands you to the service, then asks if it worked and updates the bill.
function savedSoFar(){return r2(graveTotal()+(S.switches||[]).reduce((a,x)=>a+(x.save||0)/12*Math.floor(daysBetween(x.at.slice(0,10),today())/30.44),0));}
function switchedTotal(){return r2((S.switches||[]).reduce((a,x)=>a+(x.save||0),0));}
function applySwitch(t,price){const sw=t.sw;const s=getSub(sw.subId);if(!s)return null;const before=sw.merge?sw.merge.map(getSub).filter(Boolean):[s];
 const oldMonthly=before.reduce((a,x)=>a+monthly(x),0);let target=s;
 if(sw.merge){const b={id:uid(),name:sw.bundleName,plan:sw.plan,price,cadence:'monthly',next:s.next||null,last:null,first:today(),charges:[],addons:before.flatMap(addonsOf),members:before.map(x=>x.name),bundle:true,source:'switch',rating:null};
  S.subs=S.subs.filter(x=>!sw.merge.includes(x.id));S.subs.push(b);target=b;}
 else{s.was={plan:s.plan||null,price:s.price,cadence:s.cadence};s.plan=sw.plan;s.price=price;if(sw.cadence)s.cadence=sw.cadence;}
 const newMonthly=sw.cadence==='yearly'?price/12:price;const saving=r2(Math.max(0,(oldMonthly-newMonthly)*12));
 (S.switches||=[]).push({at:new Date().toISOString(),name:target.name,plan:sw.plan,save:saving});S.log.unshift({at:new Date().toISOString(),type:'switched',name:target.name,plan:sw.plan});
 delete target.switchRemind;save();return {target,save:saving};}
// A total that never counts the same subscription twice: take the biggest wins first.
function tipsTotal(tips=allTips()){const used=new Set();let total=0,n=0;for(const t of [...tips].sort((a,b)=>(b.save||0)-(a.save||0))){if(t.subs.some(x=>used.has(x)))continue;t.subs.forEach(x=>used.add(x));total+=t.save||0;n++;}return {total:r2(total),n};}
function tipCard(t,showSubs){const k=KIND[t.kind];const bs=t.bury&&getSub(t.bury);
 const btn=t.sw?`<button class="btn primary sm" ${act('startSwitch',t.id)}>Switch${t.sw.merge?' to the bundle':t.sw.cadence==='yearly'?' to yearly':''}</button>`:bs?`<button class="btn bury sm" ${act('buryOne',bs.id)}>Bury ${esc(bs.name)}</button>`:t.url?`<a class="btn light sm" href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">${esc(t.cta)} ↗</a>`:t.act?`<button class="btn light sm" ${act(t.act[0],t.act[1])}>${esc(t.cta)}</button>`:'';
 return `<div class="card thick tip ${k.cls}" style="gap:8px"><span class="row between" style="gap:8px"><span class="t-cap c-dirt">${k.label.toUpperCase()}${showSubs?' · '+t.subs.map(x=>esc(x.toUpperCase())).join(' + '):''}</span>${t.save?`<span class="chip bg-paper">${m(t.save)}/yr</span>`:''}</span><span class="t-strong">${esc(t.title)}</span><span class="t-dp">${t.text}</span>${btn}</div>`;}
const cancelUrl=n=>CATALOG[n]?.cancel||SEARCH(`how to cancel ${n} subscription`);
const homeUrl=n=>CATALOG[n]?.home||SEARCH(`${n} subscribe`);
const hasDirectCancel=n=>!!CATALOG[n]?.cancel;
// Add-ons (a channel bought inside Prime, etc.) are cancelled from the parent's add-on page.
const ADDON_PAGES={'Hulu':'https://secure.hulu.com/account/addons','Apple TV+':APPLE_SUBS,'YouTube Premium':'https://www.youtube.com/paid_memberships','Netflix':'https://www.netflix.com/account/extra-member','Spotify':'https://www.spotify.com/account/','Disney+':'https://www.disneyplus.com/account','Max':'https://auth.max.com/subscription'};
const addonCancelUrl=(parent,name)=>CATALOG[canon(parent)]?.addons||ADDON_PAGES[canon(parent)]||SEARCH(`how to cancel ${name} add-on in ${parent}`);

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
const blank=()=>({v:1,profile:{name:'',discounts:[]},prefs:{checkinNudge:false,trialAlerts:true,trialWarn:'48',sort:'least',reduceMotion:false},onboarded:false,bank:null,scan:null,removed:{},subs:[],trials:[],graves:[],log:[],bounces:{},checkins:{},lastAlert:null});
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
const addonsOf=s=>s.addons||[];
const addonMonthly=s=>addonsOf(s).reduce((a,x)=>a+monthly(x),0);
const withAddons=s=>monthly(s)+addonMonthly(s);
const total=()=>S.subs.reduce((a,s)=>a+withAddons(s),0);
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
// Log months: the newest month starts open, older ones start folded.
const monthOpen=k=>{const o=T.logOpen||{};if(k in o)return o[k];const newest=S.log.map(e=>e.at.slice(0,7)).sort().pop();return k===newest;};
const urgentTrial=()=>[...S.trials].sort((x,y)=>x.ends.localeCompare(y.ends)).find(t=>trialDaysLeft(t)<=3);
const tName=t=>t.parent?`${t.name} (in ${t.parent})`:t.name;
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
    const found=(x.addons||[]).filter(a=>!S.graves.some(g=>g.via===x.name&&g.name===a.name)).map(a=>({id:uid(),name:a.name,price:a.price,cadence:a.cadence,next:a.next,last:a.last,first:a.first,charges:a.charges,source:'bank'}));
    if(existing){const mine=addonsOf(existing).filter(a=>a.source!=='bank'&&!found.some(f=>f.name===a.name));Object.assign(existing,{price:x.price,next:x.next,last:x.last,first:x.first,charges:x.charges,cadence:x.cadence,addons:[...found,...mine]});continue;}
    if(S.graves.some(g=>g.name===x.name&&!g.via))continue;
    S.subs.push({id:uid(),name:x.name,price:x.price,cadence:x.cadence,next:x.next,last:x.last,first:x.first,charges:x.charges,addons:found,source:'bank',rating:null});
  }
  for(const x of r.stopped||[]){
    if(S.removed[x.name]||S.graves.some(g=>g.name===x.name)||S.subs.some(s=>s.name===x.name))continue;
    S.graves.push({id:uid(),name:x.name,price:x.price,cadence:x.cadence,from:x.first,lastCharge:x.last,buriedAt:addDays(x.last,Math.round(x.cadence==='yearly'?365:30)),source:'bank'});
    S.log.push({at:addDays(x.last,30)+'T12:00:00.000Z',type:'buried',name:x.name,auto:true});
    bounce(x.name).buried++;
  }
  for(const t of r.trials||[]){
    const parent=t.parent||null;
    if(S.trials.some(x=>x.name===t.name&&(x.parent||null)===parent))continue;
    if(parent?S.subs.some(s=>s.name===parent&&addonsOf(s).some(a=>a.name===t.name)):S.subs.some(s=>s.name===t.name))continue;
    S.trials.push({id:uid(),name:t.name,parent,price:t.price||CATALOG[t.name]?.price||9.99,ends:t.ends||addDays(t.started,7),warn:S.prefs.trialWarn||'48',started:t.started,source:'bank'});
  }
  S.log.sort((a,b)=>b.at.localeCompare(a.at));
  save();
}

/* =========================================================================
   Building blocks
   ========================================================================= */
const act=(a,arg='')=>`data-act="${a}" data-arg="${esc(arg)}"`;
function subRow(s,opts={}){const c=chipFor(s);const dim=s.rating==='barely'||!s.rating;return `<button class="subrow${T.flash===s.id?' flash':''}" ${act(opts.act||'openSub',s.id)}><span class="logo-tile${dim?' dim':''}">${esc(letter(s.name))}${s.rating==='barely'?COBWEB:''}</span><span class="info"><span class="t-strong">${esc(s.name)}</span><span class="chip ${c.c}">${esc(c.t)}</span></span><span class="price"><span class="t-strong">${m(s.price+addonsOf(s).reduce((a,x)=>a+x.price,0))}</span><span class="t-cap c-dirt">${addonsOf(s).length?`incl. ${addonsOf(s).length} add-on${addonsOf(s).length>1?'s':''}`:s.next?'next: '+fmtDay(s.next):s.cadence==='yearly'?'yearly':'monthly'}</span></span></button>`;}
function tomb(g,u=1,cls='',showSaved=true){const saved=savedFor(g);return `<div class="tomb ${cls}" style="--u:${u}px"><div class="well"><div class="stone"><span class="rip">R.I.P.</span><span class="nm">${esc(g.name)}</span><span class="dt">${esc(tombDates(g))}</span></div></div><div class="dirtbar"></div>${showSaved?`<span class="chip saved ${saved?'bg-moss':'bg-candle'}">${saved?'+'+m(saved)+' saved':'Just buried'}</span>`:''}</div>`;}
/* =========================================================================
   Graveyard effects: every service gets its own particles and one-liners
   ========================================================================= */
const FXS={
 note:'<path d="M9 17V5l10-2v12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="6.5" cy="17.5" r="3"/><circle cx="16.5" cy="15.5" r="3"/>',
 star:'<path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z"/>',
 spark:'<path d="M12 1c.9 6 3 9.1 9 11-6 1.9-8.1 5-9 11-.9-6-3-9.1-9-11 6-1.9 8.1-5 9-11z"/>',
 cloud:'<path d="M7 19a5 5 0 0 1-.6-10A6 6 0 0 1 18 8.5 4.5 4.5 0 0 1 17.5 19z"/>',
 play:'<path d="M7 4.5v15l12.5-7.5z"/>',
 dot:'<circle cx="12" cy="12" r="8"/>',
 feather:'<path d="M12 1.5c5.5 5.5 5.5 14.5 0 21-5.5-6.5-5.5-15.5 0-21z"/><circle cx="12" cy="9" r="2.6" fill="#1E1B2E"/>',
 flame:'<path d="M12 1.5c1.2 4.2 6.5 6.4 6.5 12.5a6.5 6.5 0 0 1-13 0c0-3.2 2-5.4 3.2-6.4 0 2.2 1 3.4 2.2 3.4 0-4.2-1-6.5 1.1-9.5z"/>',
 box:'<rect x="3" y="6" width="18" height="14" rx="1.5"/><path d="M3 10.5h18M12 6v4.5" stroke="#1E1B2E" stroke-width="1.6"/>',
 film:'<rect x="3" y="3.5" width="18" height="17" rx="2"/><path d="M6.5 6.5v1M6.5 11.5v1M6.5 16.5v1M17.5 6.5v1M17.5 11.5v1M17.5 16.5v1" stroke="#1E1B2E" stroke-width="2" stroke-linecap="round"/>',
 tv:'<rect x="2.5" y="6" width="19" height="13" rx="2.5"/><path d="M9 2.5l3 3 3-3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>',
 ring:'<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2.6"/>',
 wheel:'<circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2.4"/><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" stroke="currentColor" stroke-width="1.4"/>',
 wave:'<path d="M3.5 11v2M7.5 8v8M11.5 4.5v15M15.5 8v8M19.5 10v4" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/>',
 heart:'<path d="M12 21s-8.5-5.3-8.5-11.2A4.8 4.8 0 0 1 12 6.6a4.8 4.8 0 0 1 8.5 3.2C20.5 15.7 12 21 12 21z"/>'
};
// c: colors · s: shapes · mo: burst (explodes out), rise (floats up), rain (falls from above)
const SVC_FX={
 'Netflix':{c:['#E50914','#F6F1E7','#B20710'],s:['film','spark'],mo:'burst',bury:'No more “are you still watching?”',back:'Okay. One more episode.'},
 'Hulu':{c:['#1CE783','#F6F1E7'],s:['tv','spark'],mo:'burst',bury:'Channel changed.',back:'Back on the couch.'},
 'Spotify':{c:['#1DB954','#F6F1E7'],s:['note','wave'],mo:'rise',bury:'The music stopped.',back:'Drop the beat. Again.'},
 'Disney+':{c:['#7FD3FF','#FFD166','#F6F1E7','#113CCF'],s:['star','spark'],mo:'burst',bury:'The fireworks are over.',back:'Wishes were made.'},
 'YouTube Premium':{c:['#FF0000','#F6F1E7'],s:['play'],mo:'rise',bury:'Ads are back. Worth it.',back:'Skip ad? Skip nothing.'},
 'YouTube TV':{c:['#FF0000','#F6F1E7'],s:['play','tv'],mo:'rise',bury:'Cable, cut twice.',back:'Live from the grave.'},
 'iCloud+':{c:['#8FD3FF','#F6F1E7'],s:['cloud'],mo:'rise',bury:'Floated away.',back:'Back in the cloud.'},
 'Apple TV+':{c:['#F6F1E7','#C9C4D6'],s:['tv','spark'],mo:'burst',bury:'Screen goes dark.',back:'Now playing.'},
 'Google One':{c:['#4285F4','#EA4335','#FBBC05','#34A853'],s:['dot'],mo:'burst',bury:'Storage, unstored.',back:'Backed up.'},
 'Paramount+':{c:['#0064FF','#F6F1E7','#8FD3FF'],s:['star'],mo:'burst',bury:'The stars dimmed.',back:'The stars came out.'},
 'Peacock':{c:['#FFD166','#FF8A3D','#FF9EC4','#7FD67A','#8FD3FF','#B48CFF'],s:['feather'],mo:'burst',bury:'Feathers ruffled.',back:'Strutting back in.'},
 'Audible':{c:['#FF9900','#F6F1E7'],s:['wave','note'],mo:'rise',bury:'The end. Literally.',back:'Chapter two.'},
 'Peloton App':{c:['#E30613','#F6F1E7'],s:['wheel'],mo:'burst',bury:'Off the bike.',back:'Back in the saddle.'},
 'Duolingo':{c:['#58CC02','#FF9600','#FFD166'],s:['flame'],mo:'rise',bury:'Streak: lost.',back:'Streak: revived.'},
 'Calm':{c:['#8FD3FF','#F6F1E7','#4A90E2'],s:['ring'],mo:'rise',bury:'Breathe out.',back:'Breathe in.'},
 'Crunchyroll':{c:['#F47521','#F6F1E7'],s:['spark','star'],mo:'burst',bury:'Season finale.',back:'Sequel unlocked.'},
 'Max':{c:['#002BE7','#B48CFF','#F6F1E7'],s:['spark','film'],mo:'burst',bury:'Credits rolled.',back:'Previously on…'},
 'Headspace':{c:['#FF8A3D','#FFD166'],s:['dot','ring'],mo:'rise',bury:'Mind: cleared.',back:'Back to center.'},
 'Amazon Prime':{c:['#FF9900','#C68B59','#E8C39E'],s:['box'],mo:'rain',bury:'Returned to sender.',back:'Arriving today.'},
 _:{c:['#FF9EC4','#FFD166','#7FD67A','#8FD3FF'],s:['spark','heart','dot'],mo:'burst',bury:'Gone but not forgotten.',back:'It’s alive!'}
};
const fxFor=n=>SVC_FX[canon(n)]||SVC_FX._;
const motionOK=()=>!S.prefs.reduceMotion&&!(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches);
const rnd=(a,b)=>a+Math.random()*(b-a);
function burstFx(host,name,{n=18,delay=0,mo}={}){if(!host||!motionOK())return 0;const f=fxFor(name);mo=mo||f.mo;
 return setTimeout(()=>{for(let i=0;i<n;i++){const p=document.createElement('span');p.className='fx fx-'+mo;const st=p.style;
  st.setProperty('--c',f.c[i%f.c.length]);st.setProperty('--s',`${Math.round(rnd(14,26))}px`);st.setProperty('--r',`${Math.round(rnd(-300,300))}deg`);
  if(mo==='burst'){const a=Math.PI*2*i/n+rnd(-.2,.2),R=rnd(70,135);st.setProperty('--dx',`${Math.cos(a)*R}px`);st.setProperty('--dy',`${Math.sin(a)*R-40}px`);st.setProperty('--t',`${rnd(1,1.5)}s`);st.setProperty('--d',`${i*12}ms`);}
  else if(mo==='rise'){st.setProperty('--x0',`${rnd(-100,100)}px`);st.setProperty('--dx',`${rnd(-30,30)}px`);st.setProperty('--dy',`${-rnd(150,240)}px`);st.setProperty('--t',`${rnd(1.8,2.6)}s`);st.setProperty('--d',`${i*80}ms`);}
  else{st.setProperty('--x0',`${rnd(-120,120)}px`);st.setProperty('--dy',`${rnd(40,90)}px`);st.setProperty('--t',`${rnd(1.2,1.7)}s`);st.setProperty('--d',`${i*70}ms`);}
  p.innerHTML=`<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${FXS[f.s[i%f.s.length]]}</svg>`;host.appendChild(p);
  p.addEventListener('animationend',()=>p.remove());}},delay);}
function dirtFx(host,{n=12,delay=0,spread=110}={}){if(!host||!motionOK())return 0;return setTimeout(()=>{for(let i=0;i<n;i++){const p=document.createElement('i');p.className='dust';const a=Math.PI*(i/(n-1));p.style.left=`${Math.cos(a)*30-5}px`;p.style.top='0px';p.style.setProperty('--dx',`${Math.cos(a)*spread}px`);p.style.setProperty('--dy',`${-Math.sin(a)*60-10}px`);host.appendChild(p);p.addEventListener('animationend',()=>p.remove());}},delay);}
const HAND='<svg viewBox="0 0 30 34" aria-hidden="true"><path d="M6 33V17c0-2 1-3 2.5-3S11 15 11 17v-9c0-2 1-3 2.5-3S16 6 16 8v-4c0-2 1-3 2.5-3S21 2 21 4v6c0-2 1-3 2.5-3S26 8 26 10v13c0 6-4 10-10 10z" fill="#C9C4D6" stroke="#1E1B2E" stroke-width="2.4" stroke-linejoin="round"/></svg>';
// A little ghost: what a free trial looks like in Plot's world.
function ghostSvg(size,cls='',label=''){return `<svg class="ghosty ${cls}" width="${size}" height="${Math.round(size*70/60)}" viewBox="0 0 60 70" aria-hidden="true"><path d="M6 64V30a24 24 0 0 1 48 0v34l-8-6-8 6-8-6-8 6-8-6z" fill="#F6F1E7" stroke="#1E1B2E" stroke-width="3" stroke-linejoin="round"/><ellipse cx="23" cy="29" rx="3.5" ry="5" fill="#1E1B2E"/><ellipse cx="37" cy="29" rx="3.5" ry="5" fill="#1E1B2E"/><ellipse cx="16" cy="38" rx="4" ry="2.4" fill="#FF9EC4" opacity=".7"/><ellipse cx="44" cy="38" rx="4" ry="2.4" fill="#FF9EC4" opacity=".7"/>${label?`<text x="30" y="52" text-anchor="middle" font-family="Bagel Fat One, sans-serif" font-size="13" fill="#3B2F5C">${esc(label)}</text>`:''}</svg>`;}
// Zombie that climbs out on a comeback, wearing the service as a T-shirt.
function zombie(name){const c=svcColor(name),ink=svcInk(name),L=esc(letter(name));
 const hand=x=>`<path d="M${x-9} 30c-1-6 0-12 2-17 1-3 4-3 4 0l0 7 1-11c0-3 4-3 4 0l0 10 1-10c0-3 4-3 4 0l0 11 1-7c0-3 4-3 4 0 0 6-1 12-3 17z" fill="#A8C98F" stroke="#1E1B2E" stroke-width="3" stroke-linejoin="round"/>`;
 return `<svg class="zombie" viewBox="0 0 120 172" aria-hidden="true">
  <g class="z-arm l"><path d="M38 98L24 34" stroke="#1E1B2E" stroke-width="15" stroke-linecap="round"/><path d="M38 98L24 34" stroke="#A8C98F" stroke-width="9" stroke-linecap="round"/><path d="M38 98L32 72" stroke="${c}" stroke-width="13" stroke-linecap="round"/>${hand(24)}</g>
  <g class="z-arm r"><path d="M82 98L96 34" stroke="#1E1B2E" stroke-width="15" stroke-linecap="round"/><path d="M82 98L96 34" stroke="#A8C98F" stroke-width="9" stroke-linecap="round"/><path d="M82 98L88 72" stroke="${c}" stroke-width="13" stroke-linecap="round"/>${hand(96)}</g>
  <path d="M30 172V108c0-10 8-16 18-16h24c10 0 18 6 18 16v64z" fill="${c}" stroke="#1E1B2E" stroke-width="3.5" stroke-linejoin="round"/>
  <path d="M44 172l4-8 5 6 4-9 5 8 5-7 4 10" fill="none" stroke="#1E1B2E" stroke-width="2.5" stroke-linejoin="round" opacity=".55"/>
  <text x="60" y="146" text-anchor="middle" font-family="Bagel Fat One, Arial Rounded MT Bold, sans-serif" font-size="30" fill="${ink}">${L}</text>
  <g class="z-head"><path d="M34 62c0-18 10-28 26-28s26 10 26 28v14c0 10-8 18-18 18H52c-10 0-18-8-18-18z" fill="#A8C98F" stroke="#1E1B2E" stroke-width="3.5" stroke-linejoin="round"/>
   <path d="M46 34l4-7 4 6 5-8 3 8 6-5-1 7" fill="#6B8A5E" stroke="#1E1B2E" stroke-width="2.5" stroke-linejoin="round"/>
   <path d="M64 44l12 6M67 42l-2 5M71 44l-2 5M75 46l-2 5" stroke="#1E1B2E" stroke-width="2" stroke-linecap="round"/>
   <g class="z-eye"><circle cx="49" cy="62" r="8" fill="#fff" stroke="#1E1B2E" stroke-width="3"/><circle cx="51" cy="64" r="3" fill="#1E1B2E"/></g>
   <circle cx="72" cy="63" r="5" fill="#fff" stroke="#1E1B2E" stroke-width="3"/><path d="M66 58h12" stroke="#1E1B2E" stroke-width="3.5" stroke-linecap="round"/><circle cx="72" cy="64.5" r="2" fill="#1E1B2E"/>
   <path d="M47 81q8-4 16 0t10-1" fill="none" stroke="#1E1B2E" stroke-width="3" stroke-linecap="round"/><path d="M55 80.5l2 4 2-4" fill="#fff" stroke="#1E1B2E" stroke-width="1.5" stroke-linejoin="round"/>
   <ellipse cx="40" cy="74" rx="4" ry="2.5" fill="#FF9EC4" opacity=".55"/></g>
 </svg>`;}
// Bats that burst out of the grave on a burial. The lead bat wears the service color.
function bat(name,lead){const c=svcColor(name);return `<svg viewBox="0 0 60 36" aria-hidden="true"><path class="wl" d="M30 15C22 5 10 3 2 9c6 1 8 5 7 9 4-3 8-1 9 3 3-4 8-3 12 0z" fill="#1E1B2E" stroke="#F6F1E7" stroke-width="1.2" stroke-linejoin="round"/><path class="wr" d="M30 15c8-10 20-12 28-6-6 1-8 5-7 9-4-3-8-1-9 3-3-4-8-3-12 0z" fill="#1E1B2E" stroke="#F6F1E7" stroke-width="1.2" stroke-linejoin="round"/><path d="M24.5 12L24 4l4.5 5.5zM35.5 12l.5-8-4.5 5.5z" fill="#1E1B2E"/><ellipse cx="30" cy="18" rx="7.5" ry="9.5" fill="#1E1B2E"/>${lead?`<circle cx="30" cy="22" r="4.6" fill="${c}"/><text x="30" y="24.6" text-anchor="middle" font-family="Bagel Fat One, sans-serif" font-size="7" fill="${svcInk(name)}">${esc(letter(name))}</text>`:''}<circle cx="27" cy="15.5" r="1.8" fill="#FFD166"/><circle cx="33" cy="15.5" r="1.8" fill="#FFD166"/><path d="M28.3 19.5l.8 1.8.8-1.8M30.1 19.5l.8 1.8.8-1.8" fill="#fff"/></svg>`;}
const BATS=[{x:-120,y:-150,d:1.55,s:1.25,lead:1},{x:110,y:-170,d:1.7,s:.9},{x:-60,y:-210,d:1.85,s:.75},{x:140,y:-90,d:2.0,s:.8},{x:20,y:-230,d:2.1,s:.65}];
const svcColor=n=>fxFor(n)===SVC_FX._?'var(--blush)':fxFor(n).c[0];
const svcInk=n=>{const c=svcColor(n);if(!c.startsWith('#'))return 'var(--ink)';const v=parseInt(c.slice(1),16);const L=(0.299*(v>>16)+0.587*(v>>8&255)+0.114*(v&255))/255;return L>.6?'var(--ink)':'var(--bone)';};
// ---------- Little brand pieces used around the app ----------
const NIGHT=`<svg class="sky" viewBox="0 0 120 70" aria-hidden="true"><path d="M92 14a16 16 0 1 0 14 24 13 13 0 1 1-14-24z" fill="#FFD166"/><g fill="#F6F1E7"><path class="tw" d="M60 12l1.2 2.6 2.8.4-2 2 .5 2.8-2.5-1.3-2.5 1.3.5-2.8-2-2 2.8-.4z"/><circle class="tw d2" cx="40" cy="30" r="1.4"/><circle class="tw d3" cx="78" cy="50" r="1.2"/><circle class="tw d4" cx="112" cy="58" r="1.4"/><circle class="tw d2" cx="22" cy="10" r="1"/></g></svg>`;
const COBWEB=`<svg class="cobweb" viewBox="0 0 24 24" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"><path d="M24 0L10 14M24 0L6 4M24 0L20 18M24 0L15 9"/><path d="M14 1.5q1.5 2 3.6 1.4M19 6.4q-2 .6-2.4 2.7M21.8 11q-1.4-.4-2.6.8M8.6 2.6q1.6 1.4 1 3.8M16.5 13.3q-2-.3-3.5 1.4"/></g><path d="M18.5 15.5v4" stroke="currentColor" stroke-width="1"/><circle cx="18.5" cy="20.6" r="1.4" fill="currentColor"/></svg>`;
const DIG=`<div class="dig" aria-hidden="true">${plot('Content',110)}<svg class="shovel" viewBox="0 0 40 80"><rect x="18" y="2" width="4" height="46" rx="2" fill="#6B4A3A" stroke="#1E1B2E" stroke-width="2"/><rect x="12" y="2" width="16" height="6" rx="3" fill="#6B4A3A" stroke="#1E1B2E" stroke-width="2"/><path d="M10 48h20v14c0 8-4 14-10 16-6-2-10-8-10-16z" fill="#C9C4D6" stroke="#1E1B2E" stroke-width="2.5" stroke-linejoin="round"/></svg><i class="clod c1"></i><i class="clod c2"></i><i class="clod c3"></i><span class="mound"></span></div>`;
function fence(line){return `<div class="fence" aria-hidden="false"><svg viewBox="0 0 320 40" preserveAspectRatio="none" aria-hidden="true"><path d="M0 34q40-6 80 0t80 0 80 0 80 0V40H0z" fill="#6B4A3A"/><path d="M6 33l3-8 3 8M60 32l2-7 3 7M150 34l3-9 2 9M232 33l2-6 3 6M300 33l3-8 2 8" stroke="#7FD67A" stroke-width="2.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/><g fill="#C9C4D6" stroke="#1E1B2E" stroke-width="2"><path d="M96 33V20a8 8 0 0 1 16 0v13z"/><path d="M176 34V16a10 10 0 0 1 20 0v18z"/><path d="M262 33V22a7 7 0 0 1 14 0v11z"/></g></svg><span class="t-cap c-plum">${esc(line)}</span></div>`;}
const MOONSKY=`<svg class="moonsky" viewBox="0 0 160 90" aria-hidden="true"><circle cx="118" cy="38" r="26" fill="#FFD166" opacity=".16"/><path d="M118 16a22 22 0 1 0 20 32 18 18 0 1 1-20-32z" fill="#FFD166"/><g class="cloud c1" fill="#F6F1E7" opacity=".22"><ellipse cx="60" cy="56" rx="26" ry="8"/><ellipse cx="72" cy="50" rx="14" ry="9"/></g><g class="cloud c2" fill="#F6F1E7" opacity=".16"><ellipse cx="128" cy="70" rx="22" ry="6"/><ellipse cx="136" cy="65" rx="11" ry="7"/></g></svg>`;
function ironFence(line){const posts=Array.from({length:13},(_,i)=>{const x=6+i*25.5;return `<path d="M${x} 44V14l4-8 4 8v30" />`;}).join('');
 return `<div class="ironfence"><svg viewBox="0 0 330 50" preserveAspectRatio="none" aria-hidden="true"><path d="M0 46q80-5 165 0t165 0V50H0z" fill="#6B4A3A"/><g fill="#1E1B2E" stroke="#1E1B2E" stroke-width="1.5" stroke-linejoin="round">${posts}<rect x="0" y="20" width="330" height="3" rx="1.5"/><rect x="0" y="36" width="330" height="3" rx="1.5"/></g></svg>${line?`<span class="t-cap c-stone">${esc(line)}</span>`:''}</div>`;}
const CANDLE=`<svg class="candle" width="30" height="46" viewBox="0 0 30 46" aria-hidden="true"><ellipse cx="15" cy="12" rx="9" ry="11" fill="#FFD166" opacity=".25" class="glow"/><path class="flame" d="M15 3c3 4 5 6 5 9a5 5 0 0 1-10 0c0-3 2-5 5-9z" fill="#FF8A3D" stroke="#1E1B2E" stroke-width="1.5"/><path d="M15 9c1.4 2 2 3 2 4.2a2 2 0 0 1-4 0c0-1.2.6-2.2 2-4.2z" fill="#FFD166"/><rect x="8" y="19" width="14" height="24" rx="3" fill="#F6F1E7" stroke="#1E1B2E" stroke-width="2"/><path d="M8 24q3 3 5 0t4 2 5-2" fill="none" stroke="#C9C4D6" stroke-width="2"/><rect x="5" y="42" width="20" height="3.5" rx="1.75" fill="#1E1B2E"/></svg>`;
const EV_ICON={
 buried:'<svg viewBox="0 0 24 24"><path d="M6 20V10a6 6 0 0 1 12 0v10z" fill="#C9C4D6" stroke="#1E1B2E" stroke-width="2" stroke-linejoin="round"/><path d="M3 21h18" stroke="#6B4A3A" stroke-width="3" stroke-linecap="round"/><path d="M10 12h4M12 10v5" stroke="#1E1B2E" stroke-width="1.6" stroke-linecap="round"/></svg>',
 res:'<svg viewBox="0 0 24 24"><path d="M8 22v-7c0-1 .6-1.6 1.4-1.6S11 14 11 15V7.5c0-1 .6-1.6 1.4-1.6s1.4.6 1.4 1.6V13l.6-4c.2-.9.8-1.3 1.6-1.1.8.2 1.1.9.9 1.8L15.6 17c-.4 2.5-1.6 5-3.6 5z" fill="#A8C98F" stroke="#1E1B2E" stroke-width="1.6" stroke-linejoin="round"/><path d="M4 22h16" stroke="#6B4A3A" stroke-width="3" stroke-linecap="round"/></svg>',
 switched:'<svg viewBox="0 0 24 24"><path d="M5 8h12l-3-3M19 16H7l3 3" fill="none" stroke="#1E1B2E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>'};
// ---------- Folding sections, so long lists stay short ----------
const CHEVD='<svg class="chevd" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 9l6 6 6-6"/></svg>';
const isCollapsed=k=>!!(S.prefs.collapse||{})[k];
function secHead(key,title,right=''){const c=isCollapsed(key);return `<div class="sechead"><button class="sectoggle" ${act('toggleSec',key)} aria-expanded="${!c}"><span class="t-title" style="font-size:16px">${title}</span>${CHEVD}</button>${c?'':right}</div>`;}
function capped(items,key,limit,render,label){const all=T.showAll?.[key];const shown=all?items:items.slice(0,limit);const more=items.length-shown.length;
 return shown.map(render).join('')+(more>0?`<button class="morebtn" ${act('showMore',key)}>Show ${more} more ${label}${CHEVD}</button>`:all&&items.length>limit?`<button class="morebtn up" ${act('showMore',key)}>Show less${CHEVD}</button>`:'');}
function tabbar(active){const tabs=[['home','Home'],['graveyard','Graveyard'],['log','Log']];const from=Math.max(0,tabs.findIndex(t=>t[0]===T.tab));const to=tabs.findIndex(t=>t[0]===active);
 return `<nav class="tabbar" aria-label="Tabs"><span class="pill" data-to="${to}" style="transform:translateX(calc(${from} * (100% + 4px)))"></span>${tabs.map(([k,l],i)=>`<button class="${i===to?'on':''}" ${act('tab',k)} aria-current="${i===to?'page':'false'}">${ICON[k]}<span>${l}</span></button>`).join('')}</nav>`;}
function countUp(el,from,to,ms=900){if(!el)return;const t0=performance.now();const step=t=>{const p=Math.min(1,(t-t0)/ms);el.textContent=m(from+(to-from)*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(step);};requestAnimationFrame(step);}
let toastTimer;
function toast(msg){const ph=$('#phone');ph.querySelectorAll('.toast').forEach(t=>t.remove());const t=document.createElement('div');t.className='toast';t.setAttribute('role','status');t.innerHTML=`${plot('Content',28)}<span>${esc(msg)}</span>`;ph.appendChild(t);clearTimeout(toastTimer);toastTimer=setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300);},2800);}

/* =========================================================================
   Screens
   ========================================================================= */
const SCREENS={
/* ---------- first launch ---------- */
welcome:{night:true,render:()=>`<div class="content mid"><div class="grow"></div>
  <div class="stagger" style="display:flex;flex-direction:column;align-items:center;gap:14px">
   <div class="bob">${plot('Content',140,'emerge')}</div>
   <div class="t-xl c-blush" style="font-size:44px;line-height:.95">subscription</div><div class="t-xl c-bone" style="margin-top:-12px">graveyard</div>
   </div>
  <div class="grow"></div><button class="btn light" ${act('go','add')}>Get started</button><button class="btn ghost" ${act('skipToHome')}>I already have an account</button></div>`},
meet:{render:()=>`<div class="content mid"><div style="height:8px"></div>
  <div class="wave">${plot('Content',170)}</div><h2 class="t-l">Meet Plot.</h2>
  <p class="t-body c-plum">Plot keeps watch over your subscriptions. It notices what you stop using and asks, politely, if it can bury it.</p>
  <div class="card stagger" style="width:100%;gap:12px">${[['Content','A 2-minute check-in, once a month'],['Sleepy','Bury what you don’t use'],['Resurrected','Bring anything back, no judgment']].map(([md,t])=>`<div class="row">${plot(md,36)}<span class="t-strong">${t}</span></div>`).join('')}</div>
  <div class="grow"></div><button class="btn primary" ${S.onboarded?act('back','settings'):act('go','add')}>${S.onboarded?'Back to Settings':'Nice to meet you'}</button></div>`},
add:{render:()=>`<div class="content">
  <span class="t-cap c-dirt">STEP 1 OF 3</span><h2 class="t-l">Link your bank</h2>
  <p class="t-body c-plum">Plot reads a year of charges and finds everything that repeats. It takes about 5 seconds.</p>
  <div class="card thick" style="gap:10px;align-items:center;text-align:center">${plot('Sleepy',80,'bob')}<span class="t-strong">Plot’s demo bank</span><span class="t-cap c-plum">A pretend bank with a year of made-up charges. Plot can’t see real accounts, and it can’t move money.</span></div>
  <div class="grow"></div><button class="btn primary" ${act('useDemoBank')}>Link the demo bank</button>
  <button class="btn ghost" ${act('openSearch')}>Search and add them instead</button>
  <button class="linkbtn" ${act('go','banksetup')}>Use Plaid’s test bank</button></div>`},
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
search:{render:()=>`<div class="content">
  <button class="backlink" ${act('back',S.onboarded?'home':'add')}>←&nbsp; ${S.onboarded?'Dashboard':'Back'}</button>
  <h2 class="t-l">Add a subscription</h2>
  <label class="searchbox">${'<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2.5"/><path d="M16.5 16.5L21 21" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/></svg>'}<input id="q" type="search" placeholder="Search Netflix, Spotify, iCloud…" autocomplete="off" value="${esc(T.q||'')}" aria-label="Search subscriptions"></label>
  <div id="svcRes" class="stack" style="gap:12px">${svcResults(T.q)}</div>
  ${fence('Not here? Search it and add it by hand.')}</div>`,
  mount(el){const q=$('#q',el),res=$('#svcRes',el);q.addEventListener('input',()=>{T.q=q.value;res.innerHTML=svcResults(T.q);});}},
byhand:{render:()=>`<div class="content">
  <button class="backlink" ${act('back','search')}>←&nbsp; Search</button><h2 class="t-l">${T.prefill?esc(T.prefill.alt||T.prefill.name):'Add one'}</h2>
  <form class="stack" id="manualForm" style="gap:16px" novalidate>
  <div class="field"${T.prefill?' hidden':''}><label for="fName">Name</label><input id="fName" placeholder="Netflix" autocomplete="off" required value="${esc(T.prefill?.name||T.customName||'')}"></div>
  ${T.prefill?`<div class="field"><label id="planLbl">Which plan?</label><div class="addon-opts" role="group" aria-labelledby="planLbl">${T.prefill.plans.map(([p,pr,cad],i)=>`<button type="button" class="optchip" data-plan="${esc(p)}" data-price="${pr}" data-cad="${cad||'monthly'}" aria-pressed="${i===0}">${esc(p)} <b>${m(pr)}${cad==='yearly'?'/yr':''}</b></button>`).join('')}</div><span class="t-cap c-plum">Typical prices. Change it below if your bill says otherwise.</span></div>`:''}
  <div class="row" style="gap:12px;align-items:flex-start"><div class="field grow"><label for="fPrice">Price</label><input id="fPrice" placeholder="15.99" inputmode="decimal" autocomplete="off" required value="${T.prefill?T.prefill.plans[0][1].toFixed(2):''}"></div><div class="field grow"><label for="fNext">Next charge</label><input id="fNext" type="date" value="${addDays(today(),9)}"></div></div>
  <div class="field" id="hAddWrap" hidden><label id="hAddLbl">Any add-ons inside it?</label><div class="addon-opts" id="hAdd" role="group" aria-labelledby="hAddLbl"></div></div>
  <div class="field"><label id="cycLbl">Billing</label><div class="seg" role="group" aria-labelledby="cycLbl"><button type="button" aria-pressed="${T.prefill?.plans[0][2]!=='yearly'}" data-cycle="monthly">Monthly</button><button type="button" aria-pressed="${T.prefill?.plans[0][2]==='yearly'}" data-cycle="yearly">Yearly</button></div></div>
  <div class="card row" style="flex-direction:row"><div class="stack-s grow" style="gap:2px"><span class="t-strong">This is a free trial</span><span class="t-cap c-plum">Plot will count down to the first charge.</span></div><button type="button" class="toggle" role="switch" aria-checked="false" aria-label="This is a free trial" id="fTrial"></button></div>
  </form>
  <div class="grow"></div><button class="btn primary" ${act('saveManual')}>Save</button><button class="btn ghost" ${act('saveManual','again')}>Save and add another</button></div>`,
  mount(el){const tg=$('#fTrial',el);tg.addEventListener('click',()=>tg.setAttribute('aria-checked',tg.getAttribute('aria-checked')!=='true'));el.querySelectorAll('[data-cycle]').forEach(b=>b.addEventListener('click',()=>el.querySelectorAll('[data-cycle]').forEach(x=>x.setAttribute('aria-pressed',x===b))));if(!T.prefill)$('#fName',el).focus({preventScroll:true});
  el.querySelectorAll('[data-plan]').forEach(b=>b.addEventListener('click',()=>{el.querySelectorAll('[data-plan]').forEach(x=>x.setAttribute('aria-pressed',x===b));$('#fPrice',el).value=(+b.dataset.price).toFixed(2);el.querySelectorAll('[data-cycle]').forEach(x=>x.setAttribute('aria-pressed',x.dataset.cycle===b.dataset.cad));}));
  const wrap=$('#hAddWrap',el),box=$('#hAdd',el);let shown='';
  const upd=()=>{const svc=canon($('#fName',el).value);const opts=ADDON_OPTIONS[svc];if(svc===shown)return;shown=svc;wrap.hidden=!opts?.length;box.innerHTML=(opts||[]).map(([n,p])=>`<button type="button" class="optchip" aria-pressed="false" data-name="${esc(n)}" data-price="${p}">${esc(n)} <b>${m(p)}</b></button>`).join('');};
  $('#fName',el).addEventListener('input',upd);upd();box.addEventListener('click',e=>{const b=e.target.closest('.optchip');if(b)b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')!=='true');});}},
found:{mount(){if(!S.scan||T.scanError||T.autoAdv===S.scan)return;const r=S.scan;T.autoAdv=r;setTimeout(()=>{if(cur.id!=='found')return;applyScan();if(S.onboarded){toast(`Plot found ${S.subs.length} subscriptions.`);go('home','fade');}else go('trials','fade');},900);},
  render:()=>{const r=S.scan;
  if(T.scanError) return `<div class="content mid"><div class="grow"></div>${plot('Alarmed',140)}<h2 class="t-m">Plot couldn’t read the bank.</h2><p class="t-body c-plum">${esc(T.scanError)}</p><div class="grow"></div><button class="btn primary" ${act('rescan')}>Try again</button><button class="btn ghost" ${act('go','byhand')}>Add them by hand instead</button></div>`;
  if(!r) return `<div class="content mid"><div class="grow"></div>${DIG}<h2 class="t-m">Plot is digging through your statements.</h2><p class="t-dp c-plum">${esc(T.scanMsg||'Waiting for the demo bank…')}</p><div class="grow"></div></div>`;
  return `<div class="content mid"><div class="grow"></div>${plot('Resurrected',130,'emerge')}<h2 class="t-l">Plot found ${r.subscriptions.length}.</h2><p class="t-dp c-plum">Out of ${r.scanned} charges.</p><div class="grow"></div></div>`;}},
trials:{render:()=>{
  const rows=[...S.subs.map(x=>({x,on:false})),...S.trials.map(t=>({x:t,on:true}))].sort((a,b)=>a.x.name.localeCompare(b.x.name));
  const ghosts=S.trials.length,paying=S.subs.length,stopped=(S.scan?.stopped||[]).length;
  return `<div class="content">
  <span class="t-cap c-dirt">STEP 2 OF 3</span><h2 class="t-l">${S.scan?`Plot found ${rows.length}.`:'Spot the ghosts.'}</h2>
  <p class="t-body c-plum" style="margin-top:-6px">Any still on a free trial? Tap to make it a ghost.</p>
  <div class="tally" aria-live="polite"><span><i class="tl-solid"></i><b>${paying}</b> paying</span><span><i class="tl-ghost">${ghostSvg(16)}</i><b>${ghosts}</b> ${ghosts===1?'ghost':'ghosts'}</span></div>
  ${rows.length?`<div class="tlist">${rows.map(({x,on})=>{const d=on?trialDaysLeft(x):0;const spotted=on&&!x.fromSub&&x.source==='bank';
   return `<button class="trow${on?' on':''}${T.justGhost===x.id?' just':''}" ${act(on?'unmarkTrial':'markTrial',x.id)} aria-pressed="${on}" aria-label="${esc(x.name)}: ${on?'free trial':'paying'}. Tap to switch.">
    ${on?`<span class="tr-ic">${ghostSvg(34,'bob')}</span>`:`<span class="logo-tile">${esc(letter(x.name))}</span>`}
    <span class="stack-s grow" style="gap:1px;min-width:0;text-align:left"><span class="t-strong tr-name">${esc(on?tName(x):x.name)}</span><span class="t-cap tr-sub">${on?`${spotted?'Found in your bank · ':''}charges ${d<=0?'today':d===1?'tomorrow':`in ${d} days`} · then ${m(x.price)}`:`Paying ${m(x.price)}${x.cadence==='yearly'?'/yr':'/mo'}`}</span></span>
    ${on?`<span class="tr-tag">Ghost ✓</span>`:`<span class="tr-hint" aria-hidden="true">${ghostSvg(16)}Trial?</span>`}</button>`;}).join('')}</div>`
   :`<div class="card"><span class="t-body c-plum">Nothing here yet.</span></div>`}
  <button class="linkbtn" style="align-self:flex-start" ${act('go','addtrial')}>+ Add a trial Plot missed</button>
  <div class="grow"></div>${stopped?`<p class="t-cap c-plum center" style="margin:0">${stopped} you already cancelled went straight to the Graveyard.</p>`:''}
  <button class="btn primary" ${act('go','discounts')}>${ghosts?`Continue with ${ghosts} ghost${ghosts===1?'':'s'}`:'No free trials, continue'}</button></div>`;},
  mount(){setTimeout(()=>{T.justGhost=null;},700);}},
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

discounts:{render:()=>{const edit=S.onboarded;const who=myWho();const save=yearlySavings(who);
  return `<div class="content">${edit?`<button class="backlink" ${act('back','settings')}>←&nbsp; Settings</button>`:`<span class="t-cap c-dirt">STEP 3 OF 3</span>`}
  <h2 class="t-l">${edit?'Discounts':'Any of these you?'}</h2>
  <p class="t-body c-plum">Some services charge students, teachers and the military less. Tap what fits and Plot will check your list for a cheaper plan.</p>
  <div class="stack" style="gap:8px">${Object.entries(WHO).map(([k,w])=>`<button class="whochip${who.includes(k)?' on':''}" ${act('toggleWho',k)} aria-pressed="${who.includes(k)}"><span class="stack-s grow" style="gap:2px;text-align:left"><span class="t-strong">${w.label}</span><span class="t-cap">${w.sub}</span></span><span class="tick" aria-hidden="true"></span></button>`).join('')}</div>
  ${!edit?(()=>{const top=allTips().filter(t=>t.sw).sort((a,b)=>(b.save||0)-(a.save||0)).slice(0,3);const {total}=tipsTotal();if(!top.length)return '';
    return `<div class="card thick" style="gap:10px"><span class="row between"><span class="t-cap c-dirt">CHEAPER PLANS PLOT FOUND</span><span class="chip bg-moss">${m(total)}/yr</span></span>${top.map(t=>`<button class="dealrow" ${act('startSwitch',t.id)}><span class="stack-s grow" style="gap:1px;text-align:left;min-width:0"><span class="t-strong">${esc(t.title)}</span><span class="t-cap c-plum">${esc(t.subs.join(' + '))} · saves ${m(t.save)}/yr</span></span><span class="chip bg-ink">Switch</span></button>`).join('')}<span class="t-cap c-plum">The rest wait on your dashboard.</span></div>`;})():''}
  ${edit||!who.length||!allTips().some(t=>t.sw)?`<div class="card dash" style="gap:6px">${who.length?(save>0?`<span class="t-title">Plot found ${m(save)} a year in cheaper plans.</span><span class="t-cap c-plum">${S.subs.filter(x=>cheaperFor(x)).map(x=>esc(x.name)).join(', ')}. Each one’s page shows how to switch.</span>`:`<span class="t-dp">Nothing on your list has a cheaper plan for that yet. Plot will keep checking.</span>`):`<span class="t-dp">Plot doesn’t need proof. The services will ask for that. This stays on your phone.</span>`}</div>`:''}
  <div class="grow"></div>${edit?`<button class="btn primary" ${act('back','settings')}>Done</button>`:`<button class="btn primary" ${act('go','nudge')}>${who.length?'Continue':'None of these'}</button>`}</div>`;}},
savings:{render:()=>{const tips=allTips().sort((a,b)=>(b.save||0)-(a.save||0));const {total}=tipsTotal(tips);const groups=Object.keys(KIND).map(k=>[k,tips.filter(t=>t.kind===k)]).filter(([,l])=>l.length);
  return `<div class="content"><button class="backlink" ${act('back','home')}>←&nbsp; Dashboard</button>
  <h2 class="t-l">Cheaper plans</h2>
  <div class="card" style="background:var(--ink);border:0;color:var(--bone);gap:4px"><span class="t-cap c-blush">UP TO, EVERY YEAR</span><span class="t-l c-moss">${m(total)}</span><span class="t-dp c-stone">Same subscriptions. Smaller bill. Plot never counts one subscription twice.</span>${(S.switches||[]).length?`<span class="t-cap c-moss" style="margin-top:6px">Already saving ${m(switchedTotal())} a year from ${(S.switches||[]).length} switch${(S.switches||[]).length>1?'es':''}.</span>`:''}</div>
  ${groups.length?groups.map(([k,l])=>`<span class="section-label">${KIND[k].label} (${l.length})</span><div class="stack" style="gap:10px">${l.map(t=>tipCard(t,true)).join('')}</div>`).join(''):`<div class="card dash" style="align-items:center;text-align:center;gap:8px">${plot('Content',80)}<span class="t-title">Already the cheapest</span><span class="t-body c-plum">Plot checked every plan. Nothing to switch.</span></div>`}
  ${myWho().length?'':`<button class="card dash hint" style="text-align:left;gap:4px" ${act('go','discounts')}><span class="t-strong">Student, teacher or military?</span><span class="t-cap c-plum">Tell Plot and it checks for discounts too.</span></button>`}
  <p class="t-cap c-plum center">Prices are typical US prices. The service’s own page has the final word.</p></div>`;}},
switchto:{render:()=>{const t=T.sw;if(!t)return SCREENS.home.render();const sw=t.sw;const s=getSub(sw.subId);if(!s)return SCREENS.home.render();
  const who=sw.merge?sw.merge.map(getSub).filter(Boolean).map(x=>x.name).join(' + '):s.name;const site=sw.merge?'the bundle page':s.name;
  if(!T.pendingReturn) return `<div class="content mid"><div style="height:8px"></div>${plot('Content',130,'bob')}
  <h2 class="t-l">Off to ${esc(site)}.</h2><p class="t-body c-plum">${esc(who)} → ${esc(sw.plan)}${sw.price!=null?' · '+m(sw.price)+(sw.cadence==='yearly'?'/yr':'/mo'):''}. Plot will wait right here.</p>
  <div class="card" style="width:100%;gap:10px"><span class="t-cap c-dirt">WHAT TO EXPECT</span>${sw.merge?`<span class="t-body">1&nbsp;&nbsp; Sign up for the bundle with the same email</span><span class="t-body">2&nbsp;&nbsp; It replaces the separate plans (cancel any that don’t merge)</span>`:`<span class="t-body">1&nbsp;&nbsp; Log in to ${esc(s.name)}</span><span class="t-body">2&nbsp;&nbsp; Account → Change plan → ${esc(sw.plan)}</span>`}${sw.verify?`<span class="t-body">3&nbsp;&nbsp; They’ll check you’re a ${esc(sw.verify)} (usually an email or ID)</span>`:''}${sw.thenBury?`<span class="t-body">${sw.verify?4:3}&nbsp;&nbsp; Then Plot helps you bury ${esc(getSub(sw.thenBury)?.name||'')}</span>`:''}</div>
  <div class="grow"></div><a class="btn primary" href="${esc(t.url||cancelUrl(s.name))}" target="_blank" rel="noopener noreferrer" ${act('leftForSwitch')}>Open ${esc(site)} ↗</a><button class="btn ghost" ${act('switchNever')}>Never mind</button></div>`;
  return `<div class="content mid"><div class="grow"></div>${plot('Alarmed',150)}
  <h2 class="t-l">Did you switch?</h2><p class="t-body c-plum">Plot only changes your bill once ${esc(site)} has.</p>
  <div class="field" style="width:100%"><label for="swPrice">New price${sw.cadence==='yearly'?' (per year)':' (per month)'}</label><input id="swPrice" inputmode="decimal" autocomplete="off" value="${sw.price!=null?sw.price.toFixed(2):''}" placeholder="0.00"></div>
  <div class="grow"></div><button class="btn primary" ${act('confirmSwitch')}>Yes, I switched</button><button class="btn ghost" ${act('switchLater')}>Not yet, remind me in 3 days</button><button class="linkbtn" ${act('switchNever')}>I changed my mind</button></div>`;}},
switched:{render:()=>{const r=T.swDone;if(!r)return SCREENS.home.render();return `<div class="content mid"><div class="grow"></div>${plot('Resurrected',150,'emerge')}
  <h2 class="t-l">Switched.</h2><p class="t-body c-plum">${esc(r.target.name)} is now ${esc(r.target.plan)} at ${m(r.target.price)}${r.target.cadence==='yearly'?' a year':' a month'}.</p>
  <div class="card" style="width:100%;background:var(--ink);border:0;color:var(--bone);gap:2px"><span class="t-cap c-blush">SAVED BY SWITCHING</span><span class="t-l c-moss">+${m(r.save)} a year</span><span class="t-dp c-stone">${m(switchedTotal())} a year so far. Same stuff, smaller bill.</span></div>
  <div class="grow"></div>${r.next?`<button class="btn bury" ${act('buryOne',r.next)}>Now bury ${esc(getSub(r.next)?.name||'')}</button>`:''}<button class="btn ${r.next?'ghost':'primary'}" ${act('switchBack')}>${T.swReturn==='deals'||T.swReturn==='discounts'?'Back':'Done'}</button></div>`;}},
deals:{render:()=>{const tips=allTips().sort((a,b)=>(b.save||0)-(a.save||0));const {total}=tipsTotal(tips);const done=S.switches||[];
  return `<div class="content"><span class="t-cap c-dirt">STEP 4 OF 4</span><h2 class="t-l">${tips.length?'Plot found cheaper plans.':'You’re already on the cheapest plans.'}</h2>
  <p class="t-body c-plum">${tips.length?`Same subscriptions, up to ${m(total)} a year less. Tap Switch and Plot walks you through it.`:'Plot checked every plan. Nothing to switch.'}</p>
  ${done.length?`<div class="card" style="background:var(--ink);border:0;color:var(--bone);gap:2px"><span class="t-cap c-blush">SWITCHED (${done.length})</span><span class="t-strong c-moss">+${m(switchedTotal())} a year</span><span class="t-cap c-stone">${done.map(x=>esc(x.name)+' → '+esc(x.plan)).join(' · ')}</span></div>`:''}
  <div class="stack" style="gap:10px">${tips.map(t=>tipCard(t,true)).join('')}</div>
  <div class="grow"></div><button class="btn primary" ${act('go','nudge')}>${done.length||!tips.length?'Continue':'Maybe later'}</button></div>`;}},
nudge:{night:true,render:()=>{const d=new Date();const first=new Date(d.getFullYear(),d.getMonth()+1,1);return `<div class="content mid"><div style="height:18px"></div>
  <span class="t-strong c-stone">${DOW[first.getDay()]}, ${['January','February','March','April','May','June','July','August','September','October','November','December'][first.getMonth()]} 1</span><span class="t-xl c-bone" style="font-size:84px">9:41</span>
  <p class="t-dp c-stone">This is how Plot will nudge you on the 1st of every month.</p><div class="grow"></div>
  <div class="card" style="width:100%;border:0;gap:8px;color:var(--ink);box-shadow:0 16px 40px -12px rgba(0,0,0,.45);animation:rise .7s cubic-bezier(.2,.9,.3,1.2) .5s both"><span class="row" style="gap:8px"><span style="width:28px;height:28px;border-radius:8px;background:var(--plum);display:grid;place-items:center;overflow:hidden">${plot('Content',26)}</span><span class="t-cap c-plum grow">SUBSCRIPTION GRAVEYARD</span><span class="t-cap c-plum">now</span></span><span class="t-title">Monthly check-in is ready</span><span class="t-dp">${Math.max(S.subs.length,1)} subscription${S.subs.length===1?'':'s'}. 2 minutes. Plot has questions.</span></div>
  <div class="grow"></div><button class="btn light" ${act('enableNudges')}>Turn on reminders</button><button class="btn ghost" ${act('finishOnboard')}>Not now</button></div>`;}},

/* ---------- everyday ---------- */
home:{tab:'home',render:()=>{const h=new Date().getHours();const hi=(h<12?'Good morning':h<18?'Good afternoon':'Good evening')+(S.profile.name?`, ${esc(S.profile.name)}`:'');const sus=S.subs.filter(s=>s.rating==='barely'||s.rating==='sometimes').length;
  const list=[...S.subs].sort(S.prefs.sort==='price'?(a,b)=>b.price-a.price:(a,b)=>order[a.rating]-order[b.rating]||b.price-a.price);const due=!S.checkins[monthKey()];
  const reminders=S.subs.filter(s=>s.remindAt&&parse(s.remindAt)<=parse(today()));const swRem=S.subs.filter(s=>s.switchRemind&&parse(s.switchRemind.at)<=parse(today()));
  return `<div class="content tabs">
  <div class="row between"><div class="stack-s" style="gap:2px"><span class="t-cap c-plum" style="font-size:13px">${hi}</span><h1 class="t-m">Your subscriptions</h1></div><button aria-label="Settings" ${act('go','settings')}>${plot('Content',56)}</button></div>
  <div class="card nightsky" style="background:var(--ink);border:0;color:var(--bone);gap:4px">${NIGHT}<span class="t-cap c-blush">THIS MONTH</span><span class="t-l" id="dashTotal">${m(total())}</span><span class="t-dp c-stone">${S.subs.length} active${S.subs.length?` · ${sus} look suspicious`:''}</span>${savedSoFar()>0||(S.switches||[]).length?`<span class="t-cap c-moss" style="font-size:13px;margin-top:4px">You’ve saved ${m(savedSoFar())} so far${(S.switches||[]).length?` · +${m(switchedTotal())}/yr from switching`:''}</span>`:''}</div>
  ${(()=>{ // only the single most urgent thing, so the dashboard never stacks alerts
   const soon=urgentTrial();const slim=S.subs.length&&due?`<button class="slimrow" ${act('go','intro')}><span>Monthly check-in is ready · about 2 minutes</span>${chev}</button>`:'';
   if(soon){const d=trialDaysLeft(soon);return `<button class="trialcard" ${act('openTrial',soon.id)}>${plot('Alarmed',40)}<span class="stack-s" style="gap:2px"><span class="t-strong">${esc(tName(soon))} trial charges ${d<=0?'today':d===1?'tomorrow':`in ${d} days`}</span><span class="t-cap">${m(soon.price)}/mo after · tap to decide</span></span></button>`+slim;}
   if(swRem[0]){const x=swRem[0];return slim+`<button class="card thick row" style="flex-direction:row;background:var(--moss)" ${act('checkSwitch',x.id)}>${plot('Content',40)}<span class="stack-s grow" style="gap:2px"><span class="t-strong">Did you switch ${esc(x.name)}?</span><span class="t-cap">Plot said it would check back today.</span></span></button>`;}
   if(reminders[0]){const x=reminders[0];return slim+`<button class="card thick row" style="flex-direction:row;background:var(--candle)" ${act('checkReminder',x.id)}>${plot('Sleepy',40)}<span class="stack-s grow" style="gap:2px"><span class="t-strong">Did ${esc(x.name)} let you go?</span><span class="t-cap">Plot said it would check back today.</span></span></button>`;}
   if(S.subs.length&&due)return `<div class="card thick row" style="flex-direction:row;padding:14px 14px 14px 18px"><div class="stack-s grow" style="gap:2px"><span class="t-strong">Monthly check-in is ready</span><span class="t-cap c-plum">${S.subs.length} subs · about 2 minutes</span></div><button class="btn primary fit sm" ${act('go','intro')}>Start</button></div>`;
   return '';})()}
  ${(()=>{const {total,n}=tipsTotal();return total>0?`<button class="card thick savecard" ${act('go','savings')}><span class="stack-s grow" style="gap:2px;text-align:left"><span class="t-strong">Plot found ${m(total)} a year in cheaper plans</span><span class="t-cap">${n} ${n===1?'swap':'swaps'} · same subscriptions, smaller bill</span></span>${chev}</button>`:'';})()}
  ${S.trials.filter(t=>t!==urgentTrial()).length?`${secHead('trials',`Free trials (${S.trials.length})`)}${isCollapsed('trials')?'':`<div class="stack" style="gap:8px">${[...S.trials].filter(t=>t!==urgentTrial()).sort((x,y)=>x.ends.localeCompare(y.ends)).map(t=>{const d=trialDaysLeft(t);return `<button class="ghostrow" ${act('openTrial',t.id)}>${ghostSvg(30,'bob')}<span class="stack-s grow" style="gap:1px;min-width:0;text-align:left"><span class="t-strong">${esc(tName(t))}</span><span class="t-cap c-plum">Charges ${d<=0?'today':d===1?'tomorrow':`in ${d} days`} · then ${m(t.price)}/mo</span></span>${chev}</button>`;}).join('')}</div>`}`:''}
  ${S.subs.length?`${secHead('active',`Active (${S.subs.length}) · ${m(total())}/mo`,`<button class="t-cap c-plum" ${act('cycleSort')}>Sort: ${S.prefs.sort==='price'?'price':'least used'}</button>`)}
  ${isCollapsed('active')?'':`<div class="stack stagger" style="gap:8px">${capped(list,'active',6,x=>subRow(x),'subscriptions')}</div>${list.length<=6||T.showAll?.active?fence('That’s everything. Plot checked twice.'):''}`}`:`<div class="card dash" style="align-items:center;text-align:center;gap:10px">${plot('Sleepy',90)}<span class="t-title">Nothing to watch yet</span><span class="t-body c-plum">Link the demo bank or add a subscription and Plot gets to work.</span></div>`}
  <div class="row" style="gap:8px"><button class="btn ghost sm" ${act('openSearch')}>+ Subscription</button><button class="btn ghost sm" ${act('go','addtrial')}>+ Free trial</button></div>
  </div>${tabbar('home')}`;},
  mount(el){const t=$('#dashTotal',el);const now=total();if(T.lastTotal===undefined)countUp(t,0,now,800);else if(T.lastTotal!==now)countUp(t,T.lastTotal,now);T.lastTotal=now;setTimeout(()=>{T.flash=null;},1700);}},
settings:{render:()=>{const name=S.profile.name;const due=S.checkins[monthKey()];const n=new Date();const next=new Date(n.getFullYear(),n.getMonth()+1,1);
  return `<div class="content">
  <div class="row between"><button class="backlink" ${act('back','home')}>←&nbsp; Dashboard</button></div>
  <h2 class="t-l">Settings</h2>
  <button class="set-profile" ${act('go','editName')}>${plot('Content',64)}<span class="stack-s" style="gap:2px;flex:1;min-width:0;text-align:left"><span class="t-title">${name?esc(name):'Add your name'}</span><span class="t-cap c-plum">${S.subs.length} watched · ${S.graves.length} buried · ${m(graveTotal())} saved${switchedTotal()?` · ${m(switchedTotal())}/yr switched`:''}</span></span>${chev}</button>

  <div class="set-sec"><span class="set-h">Bank</span><div class="set-group">
   ${S.bank?srow({icon:'bank',bg:'moss',label:esc(S.bank.name),sub:`${S.bank.mask?'••'+esc(S.bank.mask)+' · ':''}${S.bank.demo?'Demo bank':'Plaid test mode'} · linked ${fmtDay(S.bank.connectedAt.slice(0,10))}`})
   +srow({icon:'scan',bg:'candle',label:'Rescan for subscriptions',a:'rescanFromSettings'})
   +srow({icon:'unlink',bg:'pumpkin',label:'Disconnect bank',a:'disconnect',danger:true})
   :srow({icon:'bank',bg:'stone',label:'Link a bank',sub:'Let Plot find your subscriptions',a:'connectBank'})}
  </div><span class="set-note">Read-only. Plot can look at charges but can’t move money.</span></div>

  <div class="set-sec"><span class="set-h">Discounts</span><div class="set-group">
   ${srow({icon:'tag',bg:'moss',label:'Who you are',sub:myWho().length?myWho().map(k=>WHO[k].label).join(', '):'Student, teacher, military…',value:yearlySavings()>0?m(yearlySavings())+'/yr':undefined,a:'go',arg:'discounts'})}
  </div><span class="set-note">Plot uses this to find cheaper student, teacher and military plans. It never leaves your phone.</span></div>

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
sub:{render:()=>{const s=getSub(T.subId);if(!s)return SCREENS.home.render();const r=s.rating?RATE[s.rating]:null;const ads=addonsOf(s);const price=s.price+ads.reduce((a,x)=>a+x.price,0);const cpu=r?price/r.uses:null;
  const charges=[...(s.charges||[]),...ads.flatMap(a=>a.charges||[])];
  const now=new Date();const months=[];for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const key=`${d.getFullYear()}-${pad(d.getMonth()+1)}`;const amt=charges.filter(c=>c.date.startsWith(key)).reduce((a,c)=>a+c.amount,0);months.push([MONS[d.getMonth()].toUpperCase(),amt,i===0]);}
  const mx=Math.max(...months.map(x=>x[1]),1);const yr=String(now.getFullYear());const paid=charges.filter(c=>c.date.startsWith(yr)).reduce((a,c)=>a+c.amount,0);const count=charges.filter(c=>c.date.startsWith(yr)).length;
  const tAds=S.trials.filter(t=>t.parent===s.name);
  const addonCard=`<div class="card thick" style="gap:12px"><span class="t-cap c-dirt">ADD-ONS INSIDE ${esc(s.name.toUpperCase())}</span>
  ${tAds.map(t=>{const d=trialDaysLeft(t);return `<button class="addon" style="text-align:left" ${act('openTrial',t.id)}><span class="logo-tile sm" style="background:var(--pumpkin);color:var(--ink)">${esc(letter(t.name))}</span><span class="stack-s grow" style="gap:2px;min-width:0"><span class="t-strong">${esc(t.name)}</span><span class="t-cap c-plum">Free trial · then ${m(t.price)}/mo</span></span><span class="chip bg-pumpkin">${d<=0?'Charges today':d===1?'Charges tomorrow':`Charges in ${d} days`}</span></button>`;}).join('')}
  ${ads.length||tAds.length?ads.map(a=>`<div class="addon"><span class="logo-tile sm">${esc(letter(a.name))}</span><span class="stack-s grow" style="gap:2px;min-width:0"><span class="t-strong">${esc(a.name)}</span><span class="t-cap c-plum">${m(a.price)}/${a.cadence==='yearly'?'yr':'mo'} · billed through ${esc(s.name)}</span></span>${T.addonArmed===a.id?'':`<button class="btn ghost fit sm" ${act('armAddon',a.id)}>Bury</button>`}</div>
   ${T.addonArmed===a.id?`<div class="card dash" style="gap:8px"><span class="t-dp">Cancel ${esc(a.name)} on ${esc(s.name)}’s add-on page. ${esc(s.name)} itself stays.</span><a class="btn light sm" href="${esc(addonCancelUrl(s.name,a.name))}" target="_blank" rel="noopener noreferrer">Open ${esc(s.name)} add-ons ↗</a><div class="row" style="gap:8px"><button class="btn ghost sm" ${act('armAddon','')}>Never mind</button><button class="btn bury sm" ${act('buryAddon',a.id)}>I cancelled it</button></div></div>`:''}`).join('')
 :`<span class="t-body c-plum">${addonOptions(s.name)&&!addonOptions(s.name).length?`${esc(s.name)} doesn’t sell add-ons. If you pay for something extra inside it anyway, add it here.`:`Bought a channel or extra inside ${esc(s.name)}? Add it so Plot counts it too.`}</span>`}
  ${T.addonForm&&addonOptions(s.name)?.length?`<div class="addon-opts" role="group" aria-label="${esc(s.name)} add-ons">${addonOptions(s.name).filter(([n])=>!ads.some(a=>a.name===n)).map(([n,p])=>`<button type="button" class="optchip" data-pick="${esc(n)}" data-price="${p}">${esc(n)} <b>${m(p)}</b></button>`).join('')}</div>`:''}
  ${T.addonForm?`<div class="row" style="gap:8px;align-items:flex-end"><div class="field grow"><label for="aName">Add-on</label><input id="aName" placeholder="Or type your own" autocomplete="off"></div><div class="field" style="width:96px"><label for="aPrice">Price</label><input id="aPrice" placeholder="10.99" inputmode="decimal" autocomplete="off"></div></div><div class="row" style="gap:8px"><button class="btn ghost sm" ${act('toggleAddonForm')}>Cancel</button><button class="btn primary sm" ${act('saveAddon')}>Add it</button></div>`
   :`<button class="t-cap c-plum" style="align-self:flex-start" ${act('toggleAddonForm')}>+ Add an add-on</button>`}
  ${ads.length?`<span class="t-dp" style="border-top:1.5px dashed var(--stone);padding-top:10px">Altogether ${esc(s.name)} costs ${m(price)} a ${s.cadence==='yearly'?'year':'month'}.</span>`:''}</div>`;
  const meter=r?{barely:10,sometimes:40,constantly:95}[s.rating]:0;
  return `<div class="content"><button class="backlink" ${act('back','home')}>←&nbsp; ${esc(s.name)}</button>${s.plan||s.members?`<span class="t-cap c-plum" style="margin-top:-10px">${s.plan?esc(s.plan)+(s.was?` · was ${m(s.was.price)}`:''):''}${s.members?' · includes '+s.members.map(esc).join(', '):''}</span>`:''}
  ${r?`<div class="card thick" style="padding:22px 24px;gap:8px"><span class="t-cap c-dirt">COST PER USE · ${esc(s.name.toUpperCase())}</span><span class="t-dl">${m(cpu)} / use</span><span class="t-dp c-plum">${m(price)} a month${ads.length?' with add-ons':''} ÷ about ${r.uses} use${r.uses>1?'s':''} (you said “${r.said}”).</span><div class="meter"><i style="width:${meter}%"></i></div><span class="t-cap c-dirt">Worth-it meter: ${meter<35?'low':meter<70?'meh':'high'}</span></div>`
  :`<div class="card thick" style="gap:10px"><span class="t-cap c-dirt">COST PER USE · ${esc(s.name.toUpperCase())}</span><span class="t-body">How much did you use ${esc(s.name)} this month? Plot will do the math.</span>${['barely','sometimes','constantly'].map(k=>`<button class="ratechip" ${act('rateOne',k)}><i class="${RATE[k].cls}"></i>${k==='barely'?'Barely touched it':k==='sometimes'?'Here and there':'Couldn’t live without it'}</button>`).join('')}</div>`}
  ${ads.length||tAds.length||T.addonForm?addonCard:''}
  ${(()=>{const all=allTips().filter(t=>t.subs.includes(s.name)).sort((x,y)=>(y.save||0)-(x.save||0));if(all.length)return tipCard(all[0],all[0].subs.length>1)+(all.length>1?`<button class="linkbtn" style="align-self:flex-start" ${act('go','savings')}>${all.length-1} more way${all.length>2?'s':''} to save on ${esc(s.name)} →</button>`:'');
   const any=(DISCOUNTS[canon(s.name)]||[]).length;if(any&&!myWho().length)return `<button class="card dash hint" style="text-align:left;gap:4px" ${act('go','discounts')}><span class="t-strong">Student, teacher or military?</span><span class="t-cap c-plum">${esc(s.name)} might have a cheaper plan for you. Tell Plot in Discounts.</span></button>`;return '';})()}
  ${s.charges?.length?`<div class="card thick" style="gap:12px"><span class="t-cap c-dirt">CHARGES · LAST 6 MONTHS</span><div class="bars">${months.map(([mo,v,isNow],i)=>`<div><span class="b${isNow?' now':''}${v?'':' zero'}" style="height:${Math.max(6,v/mx*84)}px;animation-delay:${i*.07}s"></span><span class="t-cap c-plum">${mo}</span></div>`).join('')}</div></div>`:''}
  <div class="row" style="gap:8px;align-items:stretch"><div class="stat"><span class="t-cap c-plum">Paid in ${yr}</span><span class="t-title">${s.charges?.length?m(paid):'—'}</span></div><div class="stat"><span class="t-cap c-plum">Charges</span><span class="t-title">${s.charges?.length?count:'—'}</span></div><div class="stat"><span class="t-cap c-plum">Next charge</span><span class="t-title">${s.next?fmtDay(s.next):'—'}</span></div></div>
  ${ads.length||tAds.length||T.addonForm?'':`<button class="linkbtn" style="align-self:flex-start" ${act('toggleAddonForm')}>+ Add an add-on inside ${esc(s.name)}</button>`}
  <div class="grow"></div><div class="row" style="gap:8px"><button class="btn ghost" ${act('back','home')}>Keep it</button><button class="btn bury" ${act('buryOne',s.id)}>Bury it</button></div>
  <button class="linkbtn" ${act('notASub',s.id)}>This isn’t a subscription</button></div>`;},
  mount(el){el.querySelectorAll('[data-pick]').forEach(b=>b.addEventListener('click',()=>{$('#aName',el).value=b.dataset.pick;$('#aPrice',el).value=b.dataset.price;el.querySelectorAll('[data-pick]').forEach(x=>x.setAttribute('aria-pressed',x===b));}));}},

/* ---------- check-in ---------- */
intro:{render:()=>{const done=S.checkins[monthKey()];if(done&&S.subs.length){const n=new Date();const next=new Date(n.getFullYear(),n.getMonth()+1,1);const left=daysBetween(today(),isoOf(next));const FULL=['January','February','March','April','May','June','July','August','September','October','November','December'];
  return `<div class="content mid"><button class="backlink" style="align-self:flex-start" ${act('back','home')}>←&nbsp; Dashboard</button><div class="grow"></div>${plot('Sleepy',170,'bob')}<h2 class="t-l">Check-in done for ${FULL[n.getMonth()]}.</h2>
  <p class="t-body c-plum">${typeof done==='string'?`You checked in on ${fmtDay(done)}. `:''}Plot opens the next one on ${FULL[next.getMonth()]} 1. That’s ${left} day${left===1?'':'s'} away.</p>
  <div class="grow"></div><button class="btn primary" ${act('go','verdict')}>See this month’s verdict</button></div>`;}
  return S.subs.length?`<div class="content mid"><button class="backlink" style="align-self:flex-start" ${act('back','home')}>←&nbsp; Dashboard</button><div class="grow"></div>
  <div class="bob">${plot('Content',190)}</div><h2 class="t-l">It’s that time.</h2>
  <p class="t-body c-plum">Rate how much you actually used each subscription this month. Be honest. Plot already knows.</p>
  <span class="t-cap c-plum" style="font-size:13px">${S.subs.length} subscription${S.subs.length>1?'s':''} · about ${Math.max(1,Math.round(S.subs.length*12/60))} minute${S.subs.length*12/60>1.5?'s':''}</span><div class="grow"></div>
  <button class="btn primary" ${act('startCheckin')}>Begin check-in</button><button class="btn ghost" ${act('remindTonight')}>Remind me tonight</button></div>`
  :`<div class="content mid"><button class="backlink" style="align-self:flex-start" ${act('back','home')}>←&nbsp; Dashboard</button><div class="grow"></div>${plot('Sleepy',150)}<h2 class="t-m">Nothing to check in on.</h2><p class="t-body c-plum">Add a subscription first.</p><div class="grow"></div></div>`;}},
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
  ${(()=>{const {total}=tipsTotal();return total>0?`<button class="card savecard" ${act('go','savings')}><span class="stack-s grow" style="gap:2px;text-align:left"><span class="t-strong">Keeping some? Plot found ${m(total)} a year in cheaper plans.</span></span>${chev}</button>`:'';})()}
  <button class="btn ghost" ${act('back','home')}>Done for now</button></div>`;}},

/* ---------- trial alert ---------- */
trial:{night:true,render:()=>{const t=getTrial(T.trialId);if(!t)return SCREENS.home.render();return `<div class="content mid"><div style="height:30px"></div>
  <span class="t-cap c-blush">FREE TRIAL ENDING</span>${plot('Alarmed',170)}<span class="t-xl c-pumpkin" id="cd" style="font-variant-numeric:tabular-nums">--:--:--</span>
  <span class="t-body c-stone">until ${esc(tName(t))} charges you ${m(t.price)}/mo</span>
  <div class="card" style="background:var(--ink);border:0;width:100%"><span class="t-dp c-bone">${t.source==='bank'?`Plot spotted a free-trial ${esc(tName(t))} charge on ${fmtDay(t.started)}.`:`You added this trial. It ends ${fmtDay(t.ends)}.`}</span></div>
  <div class="grow"></div><button class="btn bury" ${act('cancelTrial',t.id)}>Cancel the trial</button><button class="btn ghost" ${act('letCharge',t.id)}>Let it charge</button><button class="linkbtn c-stone" ${act('snooze',t.id)}>Remind me tomorrow</button></div>`;},
  mount(el){const t=getTrial(T.trialId);if(!t)return;const cd=$('#cd',el);const tick=()=>{const s=Math.max(0,Math.round((trialEnds(t)-Date.now())/1000));const h=Math.floor(s/3600),mi=Math.floor(s%3600/60),se=s%60;cd.textContent=`${h}:${pad(mi)}:${pad(se)}`;cd.style.fontSize=h>=100?'48px':'';};tick();const i=setInterval(tick,1000);return()=>clearInterval(i);}},

/* ---------- bury flow ---------- */
sheet:{night:true,render:()=>{const s=target();if(!s)return SCREENS.home.render();const ads=addonsOf(s);const yearly=(s.cadence==='yearly'?s.price:s.price*12)+ads.reduce((a,x)=>a+(x.cadence==='yearly'?x.price:x.price*12),0);
  const line=s.rating==='barely'?`${esc(s.name)} barely got used this month. Shall we?`:s.rating==='sometimes'?`${esc(s.name)} only gets used here and there. Shall we?`:`${esc(s.name)} costs ${m(s.price)} a ${s.cadence==='yearly'?'year':'month'}. Shall we?`;
  return `<div class="backdrop"></div><div class="content" style="padding:0;justify-content:flex-end"><div class="sheet"><div class="handle"></div>${plot('Sleepy',110)}<h2 class="t-m">${line}</h2><p class="t-dp c-plum">Burying it saves ${m(yearly)} a year.${ads.length?` Its add-on${ads.length>1?'s':''} (${ads.map(a=>esc(a.name)).join(', ')}) go${ads.length>1?'':'es'} with it.`:''}</p>
  <div class="card stack-s" style="width:100%;border-color:var(--stone);gap:8px"><span class="t-body">1&nbsp;&nbsp; We open ${esc(s.name)}’s cancel page</span><span class="t-body">2&nbsp;&nbsp; You hit cancel there</span><span class="t-body">3&nbsp;&nbsp; ${esc(s.name)} gets a tombstone and the savings counter starts</span></div>
  <button class="btn bury" ${act('go','handoff')}>Bury it</button><button class="btn ghost" ${act('keepIt')}>Keep it (for now)</button></div></div>`;}},
handoff:{render:()=>{const s=target();if(!s)return SCREENS.home.render();const via=s.parent;const apple=!via&&CATALOG[s.name]?.apple;const direct=via?true:hasDirectCancel(s.name);const url=via?addonCancelUrl(via,s.name):cancelUrl(s.name);
  return `<div class="content mid"><div style="height:8px"></div>${plot('Content',140,'bob')}
  <h2 class="t-l">Off to ${esc(via||s.name)}’s ${via?'add-ons':'cancel'} page.</h2><p class="t-body c-plum">Plot will wait right here. Come back when it’s done.</p>
  <div class="card" style="width:100%;gap:10px"><span class="t-cap c-dirt">WHAT TO EXPECT</span>${via?`<span class="t-body">1&nbsp;&nbsp; Log in to ${esc(via)}</span><span class="t-body">2&nbsp;&nbsp; Find ${esc(s.name)} in your add-ons or channels</span><span class="t-body">3&nbsp;&nbsp; Cancel it. ${esc(via)} itself stays.</span>`:apple?`<span class="t-body">1&nbsp;&nbsp; This opens your Apple subscriptions</span><span class="t-body">2&nbsp;&nbsp; Tap ${esc(s.name)} → Cancel subscription</span>`:`<span class="t-body">1&nbsp;&nbsp; Log in to ${esc(s.name)}</span><span class="t-body">2&nbsp;&nbsp; Account → Cancel subscription</span><span class="t-body">3&nbsp;&nbsp; Say no to the “stay” offer</span>`}${direct?'':`<span class="t-cap c-plum">Plot doesn’t have a direct cancel link for ${esc(s.name)}, so this searches for the official steps.</span>`}</div>
  <div class="card" style="width:100%;background:var(--blush)"><span class="t-dp">${esc(s.name)} will offer you a discount. Plot says stay strong.</span></div>
  <div class="grow"></div>
  <a class="btn bury" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${act('leftForCancel')}>Open ${esc(via||s.name)} ↗</a>
  <button class="btn ${T.pendingReturn?'primary':'ghost'}" ${act(T.pendingReturn?'go':'neverMind','didwork')}>${T.pendingReturn?'I’m back':'Never mind'}</button></div>`;}},
didwork:{render:()=>{const s=target();if(!s)return SCREENS.home.render();return `<div class="content mid"><div class="grow"></div>${plot('Alarmed',170)}
  <h2 class="t-l">Did it work?</h2><p class="t-body c-plum">Did ${esc(s.name)} actually let you go? Plot only buries things that are really cancelled.</p>
  <div class="grow"></div><button class="btn bury" ${act('confirmBury')}>Yes, it’s cancelled</button><button class="btn ghost" ${act('notYet')}>Not yet, remind me in 3 days</button><button class="linkbtn" ${act('neverMind')}>I changed my mind</button></div>`;}},
reminder:{render:()=>{const s=target()||{name:'It'};const d=parse(addDays(today(),3));return `<div class="content mid"><div class="grow"></div>${plot('Sleepy',170)}
  <h2 class="t-l">Plot will check back ${DOW[d.getDay()]}.</h2><p class="t-body c-plum">${esc(s.name)} stays on your list until it’s gone. Plot will ask about it on the Dashboard in 3 days.</p>
  <div class="card dash" style="width:100%"><span class="t-dp">${esc(s.name)} still costs ${m(s.price||0)} a month. Plot is patient.</span></div>
  <div class="grow"></div><button class="btn primary" ${act('back','home')}>Back to Dashboard</button></div>`;}},
rip:{night:true,render:()=>{const g=T.buried;if(!g)return SCREENS.graveyard.render();const next=T.queue.length?getSub(T.queue[0]):null;const yearly=g.cadence==='yearly'?g.price:g.price*12;
  const fx=fxFor(g.name);
  return `<div class="content mid"><div style="height:10px"></div><div class="ripstage">${tomb(g,1.1,'rising',false)}<span class="dropper" style="background:${svcColor(g.name)};color:${svcInk(g.name)}">${esc(letter(g.name))}</span><span class="bats" aria-hidden="true">${BATS.map((b,k)=>`<span class="bat" style="--bx:${b.x}px;--by:${b.y}px;--bd:${b.d}s;--bs:${b.s}">${bat(g.name,b.lead)}</span>`).join('')}</span><div class="fxhost" id="fxRip"></div></div><div class="dustwrap" id="dust"></div><span class="chip bg-moss" style="font-size:16px;padding:4px 12px;margin-top:-4px;animation:pop .45s cubic-bezier(.3,1.6,.5,1) 1.75s both">+${m(yearly)} a year</span>
  <h2 class="t-l c-bone">Rest in peace, ${esc(g.name)}.</h2><p class="t-dp c-blush quip">${esc(fx.bury)}</p><p class="t-dp c-stone">${g.nextDue?`The next charge was due ${fmtDay(g.nextDue)}. Plot will count it as saved.`:`The savings counter starts now.`}</p>
  <div class="card" style="width:100%;background:var(--ink);border:0;gap:2px"><span class="t-cap c-blush">GRAVEYARD TOTAL · ${S.graves.length} RESTING</span><span class="t-l c-moss">${m(graveTotal())}</span></div>
  <div class="grow"></div>${next?`<button class="btn bury" ${act('nextBury')}>Next: bury ${esc(next.name)}</button>`:''}<button class="btn light" ${act('tab','graveyard')}>See the Graveyard</button><button class="btn ghost" ${act('back','home')}>Back to Dashboard</button></div>`;},
  mount(el){const d=$('#dust',el);const t=setTimeout(()=>{for(let i=0;i<10;i++){const p=document.createElement('i');p.className='dust';const a=Math.PI*(i/9);p.style.left=`calc(50% + ${Math.cos(a)*30-5}px)`;p.style.top='-30px';p.style.setProperty('--dx',`${Math.cos(a)*90}px`);p.style.setProperty('--dy',`${-Math.sin(a)*40-10}px`);d.appendChild(p);}},motionOK()?750:0);
   const t2=burstFx($('#fxRip',el),T.buried?.name,{delay:1350});return()=>{clearTimeout(t);clearTimeout(t2);};}},

/* ---------- graveyard ---------- */
graveyard:{night:true,tab:'graveyard',render:()=>{let g=[...S.graves];if(T.graveFilter==='recent')g.sort((a,b)=>b.buriedAt.localeCompare(a.buriedAt));if(T.graveFilter==='saved')g.sort((a,b)=>savedFor(b)-savedFor(a));
  return `<div class="content tabs"><div class="night-fx" aria-hidden="true">${Array.from({length:7},(_,i)=>`<i class="firefly" style="left:${8+i*13}%;top:${12+((i*37)%60)}%;animation-delay:${-i*1.3}s,${-i*.7}s"></i>`).join('')}<i class="fog a"></i><i class="fog b"></i>${MOONSKY}<span class="flyby">${bat('',false)}</span></div><h1 class="t-l c-bone">The Graveyard</h1>
  <div class="card" style="background:var(--ink);border:0;padding:24px 28px;gap:4px"><span class="t-cap c-blush">SAVED SINCE THE BURIALS BEGAN</span><span class="t-xl c-moss" id="gTotal">${m(graveTotal())}</span><span class="t-dp c-stone">${S.graves.length} subscription${S.graves.length===1?'':'s'} resting peacefully.</span></div>
  ${g.length?`<div class="row between" style="gap:8px;align-items:center"><div class="filters" role="group" aria-label="Sort tombstones">${[['all','All'],['recent','Recent'],['saved','Most saved']].map(([k,l])=>`<button aria-pressed="${T.graveFilter===k}" ${act('graveFilter',k)}>${l}</button>`).join('')}</div>
   <div class="viewsw" role="group" aria-label="View">${[['stones','Stones',EV_ICON.buried],['list','List','<svg viewBox="0 0 24 24"><path d="M5 7h14M5 12h14M5 17h14" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>']].map(([k,l,ic])=>`<button aria-pressed="${(S.prefs.graveView||'stones')===k}" aria-label="${l}" ${act('graveView',k)}>${ic}</button>`).join('')}</div></div>
  ${(S.prefs.graveView||'stones')==='list'?`<div class="stack" style="gap:8px">${capped(g,'graves-list',12,x=>`<button class="graverow" ${act('openTomb',x.id)}><span class="ev-ic ev-buried">${EV_ICON.buried}</span><span class="stack-s grow" style="gap:1px;min-width:0;text-align:left"><span class="t-strong">${esc(x.name)}</span><span class="t-cap c-stone">${esc(tombDates(x))}</span></span><span class="chip ${savedFor(x)?'bg-moss':'bg-candle'}">${savedFor(x)?'+'+m(savedFor(x)):'Just buried'}</span></button>`,'tombstones')}</div>`
   :`<div class="graves stagger">${capped(g,'graves',6,x=>`<button ${act('openTomb',x.id)} aria-label="Open ${esc(x.name)}">${tomb(x,.8)}</button>`,'tombstones')}</div>`}${ironFence('Rest in peace. Your wallet thanks them.')}`
  :`<div class="stack" style="align-items:center;text-align:center;padding-top:20px">${plot('Sleepy',120,'bob')}<span class="t-m c-bone">Nothing buried yet.</span><span class="t-body c-stone">The plots are open. When you cancel something, its tombstone shows up here.</span></div>${ironFence('')}`}</div>${tabbar('graveyard')}`;},
  mount(el){countUp($('#gTotal',el),0,graveTotal(),900);}},
tomb:{night:true,render:()=>{const g=S.graves.find(x=>x.id===T.tombId);if(!g)return SCREENS.graveyard.render();const b=S.bounces[g.name];
  return `<div class="content"><button class="backlink c-bone" ${act('tab','graveyard')}>←&nbsp; Graveyard</button>
  <div style="display:flex;justify-content:center"><div class="peekstage">${tomb(g,1.2,'',false)}<span class="peekwell" aria-hidden="true"><span class="peekhand">${HAND}</span></span></div></div>
  <p class="epitaph">Here lies ${esc(g.name)}${g.via?`, once of ${esc(g.via)}`:''}. ${esc(fxFor(g.name).bury)}</p>
  <div class="row" style="gap:8px;align-items:stretch"><div class="stat"><span class="t-cap c-stone">Saved so far</span><span class="t-m c-moss">${m(savedFor(g))}</span></div><div class="stat"><span class="t-cap c-stone">Resting for</span><span class="t-m c-bone">${Math.max(0,daysBetween(g.buriedAt.slice(0,10),today()))} days</span></div></div>
  <div class="card dash" style="border-color:var(--stone);background:transparent"><span class="t-title c-bone">Bounce history</span><span class="t-cap c-stone" style="font-size:13px">${b&&b.res?`Buried ${b.buried}× · Resurrected ${b.res}×`:'Buried once. Never came back.'}</span>${b&&b.res?`<span class="t-dp c-blush">Plot has started a tally.</span>`:''}</div>
  <div class="grow"></div><button class="btn res" ${act('resurrect',g.id)}>Resurrect</button><span class="t-cap c-stone center">Resurrecting logs a bounce and stops the savings counter.</span><button class="btn ghost" ${act('tab','graveyard')}>Leave it in peace</button></div>`;}},
back:{render:()=>{const g=T.revived;if(!g)return SCREENS.home.render();const b=bounce(g.name);
const fx=fxFor(g.name);
  return `<div class="content mid"><div class="grow"></div><div class="climb" aria-hidden="true">
   <div class="climb-stone"><span>R.I.P.</span></div>
   <div class="climb-well"><div class="climber"><div class="zsway">${zombie(g.name)}</div></div></div>
   <div class="climb-dirt"></div><div class="fxhost" id="fxBack"></div><div class="fxhost low" id="dirtBack"></div></div>
  <h2 class="t-l">${esc(g.name)} is back.</h2><p class="t-dp c-dirt quip">${esc(fx.back)}</p><p class="t-body c-plum">The savings counter stopped and the comeback is in your log. That’s ${b.res} so far.</p>
  <div class="card" style="width:100%;background:var(--candle)"><span class="t-dp">Plot is not judging. Plot is counting.</span></div>
  <div class="grow"></div><a class="btn res" href="${esc(homeUrl(g.name))}" target="_blank" rel="noopener noreferrer">Re-subscribe on ${esc(g.name)} ↗</a><button class="btn ghost" ${act('back','home')}>Back to active list</button></div>`;},
  mount(el){const n=T.revived?.name;const a=dirtFx($('#dirtBack',el),{delay:350,n:8,spread:70}),b=dirtFx($('#dirtBack',el),{delay:1000,n:14}),c=burstFx($('#fxBack',el),n,{delay:1500});return()=>{clearTimeout(a);clearTimeout(b);clearTimeout(c);};}},
log:{tab:'log',render:()=>{const names=[...new Set(S.log.map(e=>e.name))];const top=Object.entries(S.bounces).filter(([,b])=>b.res).sort((a,b)=>b[1].res-a[1].res)[0];const ev=S.log.filter(e=>T.logFilter==='All'||e.name===T.logFilter);
  return `<div class="content tabs"><div class="row" style="gap:10px;align-items:flex-end">${CANDLE}<h1 class="t-l">The log</h1></div><p class="t-body c-plum" style="margin-top:-8px">Every burial, comeback and switch. Plot writes it all down.</p>
  ${top?`<div class="card thick" style="background:var(--blush)"><span class="t-cap">PATTERN SPOTTED</span><span class="t-strong">${esc(top[0])} keeps coming back. ${top[1].res} comeback${top[1].res>1?'s':''} so far, ${m(top[1].spent)} a month back on the bill.</span></div>`:''}
  ${S.log.length?`<div class="filters" role="group" aria-label="Filter log">${['All',...names.slice(0,4)].map(n=>`<button aria-pressed="${T.logFilter===n}" ${act('logFilter',n)}>${esc(n)}</button>`).join('')}</div>
  <div class="timeline">${ev.map((e,i)=>{const mk=e.at.slice(0,7);const head=i===0||ev[i-1].at.slice(0,7)!==mk;const d=new Date(e.at);const open=T.logFilter!=='All'||monthOpen(mk);
   const inMonth=ev.filter(x=>x.at.slice(0,7)===mk);const cnt=k=>inMonth.filter(x=>x.type===k).length;const sum=[cnt('buried')&&cnt('buried')+' buried',cnt('res')&&cnt('res')+' back',cnt('switched')&&cnt('switched')+' switched'].filter(Boolean).join(', ');
   return (head?`<button class="logmonth" ${act('toggleMonth',mk)} aria-expanded="${open}"><span>${['January','February','March','April','May','June','July','August','September','October','November','December'][d.getMonth()]} ${d.getFullYear()}</span><span class="t-cap c-plum lm-sum">${open?'':sum}</span>${CHEVD}</button>`:'')+(open?`<div class="event"><span class="ev-ic ev-${e.type}">${EV_ICON[e.type]||EV_ICON.buried}</span><span class="stack-s" style="gap:1px"><span class="t-cap c-plum">${fmtCaps(e.at.slice(0,10))}${e.auto?' · found in your bank':''}</span><span class="t-strong">${e.type==='buried'?'Buried '+esc(e.name):e.type==='switched'?'Switched '+esc(e.name)+' to '+esc(e.plan||'a cheaper plan'):'Resurrected '+esc(e.name)}</span></span></div>`:'');}).join('')}</div>${fence('That’s the whole story so far.')}`
  :`<div class="stack" style="align-items:center;text-align:center;gap:10px;padding-top:16px"><div class="row" style="gap:6px;align-items:flex-end">${plot('Content',90)}${CANDLE}</div><span class="t-title">Nothing logged yet.</span><span class="t-body c-plum">Plot keeps a candle lit for the first entry. Bury, resurrect or switch something and it’s written here.</span></div>`}</div>${tabbar('log')}`;}}
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
 const g={id:uid(),name:s.name,...(s.parent?{via:s.parent}:{}),price:s.price,cadence:s.cadence||'monthly',from:s.first||s.started||today(),lastCharge:isTrial?addDays(s.ends,-30):(s.last||today()),buriedAt:new Date().toISOString(),source:'app',nextDue:isTrial?s.ends:(s.next||null)};
 for(const a of addonsOf(s)){S.graves.unshift(addonGrave(a,s.name));logEvent('buried',a.name);}
 S.graves.unshift(g);T.buried=g;logEvent('buried',s.name);bounce(s.name).buried++;save();}
function addonGrave(a,parent){return {id:uid(),name:a.name,via:parent,price:a.price,cadence:a.cadence||'monthly',from:a.first||today(),lastCharge:a.last||today(),buriedAt:new Date().toISOString(),source:'app',nextDue:a.next||null};}
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
  const addons=[...el.querySelectorAll('#hAdd .optchip[aria-pressed="true"]')].map(b=>({id:uid(),name:b.dataset.name,price:+b.dataset.price,cadence:'monthly',first:today(),charges:[],source:'manual'}));
  const plan=$('[data-plan][aria-pressed="true"]',el)?.dataset.plan;const shown=T.prefill?.alt||name;
  S.subs.push({id:uid(),name:canon(name),...(plan&&T.prefill.plans.length>1?{plan}:{}),price,cadence,next:$('#fNext',el).value||null,last:null,first:today(),charges:[],addons,source:'manual',rating:null});save();
  T.prefill=null;T.customName='';
  if(again==='again'){toast(`Saved ${shown}. Add another.`);T.q='';go('search','back');}else{toast(`Saved ${shown}.`);go(S.onboarded?'home':'trials');}},
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
 markTrial(id){const s=getSub(id);if(!s)return;S.subs=S.subs.filter(x=>x.id!==id);if(s.wasTrial){S.trials.push(s.wasTrial);T.justGhost=s.wasTrial.id;save();toast(`${s.name} is a ghost again.`);rerender();return;}const t={id:s.id,name:s.name,price:s.price,ends:s.next||addDays(today(),7),warn:'48',started:today(),source:s.source,fromSub:s};S.trials.push(t);T.justGhost=t.id;save();toast(`${s.name} is a ghost now. Plot counts down to ${fmtDay(t.ends)}.`);rerender();},
 unmarkTrial(id){const t=getTrial(id);if(!t)return;if(!t.fromSub){S.trials=S.trials.filter(x=>x.id!==id);const sub={id:t.id,name:t.name,price:t.price,cadence:'monthly',next:t.ends,last:null,first:t.started||today(),charges:[],source:t.source||'manual',rating:null,wasTrial:t};S.subs.push(sub);T.justGhost=sub.id;save();toast(`${t.name} is a paying subscription now.`);rerender();return;}S.trials=S.trials.filter(x=>x.id!==id);S.subs.push(t.fromSub);T.justGhost=t.fromSub.id;save();toast(`${t.name} is back to paying.`);rerender();},
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
 startSwitch(id){const t=allTips().find(x=>x.id===id);if(!t||!t.sw)return;T.sw=t;T.pendingReturn=false;T.swReturn=cur.id==='discounts'?'discounts':cur.id==='deals'?'deals':cur.id==='sub'?'sub':cur.id==='savings'?'savings':'home';go('switchto');},
 leftForSwitch(){T.pendingReturn=true;setTimeout(()=>{if(cur.id==='switchto')rerender();},400);},
 confirmSwitch(){const v=parseFloat(($('#swPrice',cur.el)?.value||'').replace(/[^0-9.]/g,''));if(!(v>=0)||isNaN(v)){toast('Add the new price, like 6.99.');return;}
  const r=applySwitch(T.sw,v);if(!r)return;T.pendingReturn=false;T.swDone={...r,next:T.sw.sw.thenBury&&getSub(T.sw.sw.thenBury)?T.sw.sw.thenBury:null};T.flash=r.target.id;T.subId=r.target.id;go('switched','zoom');},
 switchLater(){const s=getSub(T.sw?.sw.subId);if(s){s.switchRemind={at:addDays(today(),3),tip:T.sw.id};save();}T.pendingReturn=false;toast('Plot will ask again in 3 days.');ACT.switchBack();},
 switchNever(){T.pendingReturn=false;toast('Nothing was changed.');ACT.switchBack();},
 switchBack(){const r=T.swReturn||'home';T.sw=null;go(r==='sub'&&!getSub(T.subId)?'home':r,'back');},
 checkSwitch(id){const s=getSub(id);if(!s||!s.switchRemind)return;const t=allTips().find(x=>x.id===s.switchRemind.tip);delete s.switchRemind;save();if(!t){toast('That deal isn’t available anymore.');rerender();return;}T.sw=t;T.swReturn='home';T.pendingReturn=true;go('switchto');},
 notASub(id){const s=getSub(id);if(!s)return;S.subs=S.subs.filter(x=>x.id!==id);S.removed[s.name]=true;save();toast(`Removed ${s.name}. Plot won’t add it again.`);go('home','back');},
 openSearch(){T.q='';T.prefill=null;T.customName='';go('search');},
 pickSvc(name){const v=SVC_LIST.find(x=>x.name===name);if(!v)return;T.prefill=v;T.customName='';go('byhand');},
 pickCustom(q){T.prefill=null;T.customName=q.replace(/\b\w/g,c=>c.toUpperCase());go('byhand');},
 toggleSec(k){const c={...(S.prefs.collapse||{})};c[k]=!c[k];S.prefs.collapse=c;save();rerender();},
 showMore(k){T.showAll={...(T.showAll||{}),[k]:!T.showAll?.[k]};rerender();},
 graveView(v){S.prefs.graveView=v;save();rerender();},
 toggleMonth(k){const o={...(T.logOpen||{})};o[k]=!monthOpen(k);T.logOpen=o;rerender();},
 toggleWho(k){const w=new Set(myWho());w.has(k)?w.delete(k):w.add(k);S.profile.discounts=[...w];save();rerender();},
 openSub(id){T.subId=id;T.addonForm=false;T.addonArmed=null;go('sub');},
 toggleAddonForm(){T.addonForm=!T.addonForm;rerender();if(T.addonForm)setTimeout(()=>$('#aName',cur.el)?.focus({preventScroll:true}),50);},
 saveAddon(){const s=getSub(T.subId);if(!s)return;const el=cur.el;const name=$('#aName',el).value.trim();const price=parseFloat($('#aPrice',el).value.replace(/[^0-9.]/g,''));
  if(!name){toast('Name the add-on, like Starz.');$('#aName',el).focus();return;}if(!(price>0)){toast('Add the price, like 10.99.');$('#aPrice',el).focus();return;}
  (s.addons||=[]).push({id:uid(),name,price,cadence:s.cadence||'monthly',first:today(),charges:[],source:'manual'});T.addonForm=false;save();toast(`Plot will count ${name} inside ${s.name}.`);rerender();},
 armAddon(id){T.addonArmed=id||null;rerender();},
 buryAddon(id){const s=getSub(T.subId);const a=addonsOf(s||{}).find(x=>x.id===id);if(!a)return;s.addons=s.addons.filter(x=>x!==a);S.graves.unshift(addonGrave(a,s.name));logEvent('buried',a.name);bounce(a.name).buried++;T.addonArmed=null;save();toast(`${a.name} is buried. ${s.name} stays.`);rerender();},
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
 letCharge(id){const t=getTrial(id);if(!t)return;S.trials=S.trials.filter(x=>x.id!==id);
  const par=t.parent&&S.subs.find(x=>x.name===t.parent);if(par){(par.addons||=[]).push({id:uid(),name:t.name,price:t.price,cadence:'monthly',next:t.ends,first:t.started||today(),charges:[],source:'trial'});save();T.flash=par.id;toast(`${t.name} joins ${par.name} at ${m(t.price)}/mo on ${fmtDay(t.ends)}.`);go('home','fade');return;}const s={id:uid(),name:t.name,price:t.price,cadence:'monthly',next:t.ends,last:null,first:t.started||today(),charges:[],source:'trial',rating:null};S.subs.push(s);save();T.flash=s.id;toast(`${t.name} becomes ${m(t.price)}/mo on ${fmtDay(t.ends)}. Plot noticed.`);go('home','fade');},
 snooze(id){const t=getTrial(id);if(t){t.snoozed=today();save();}toast('Plot will sound the alarm again tomorrow.');go('home','fade');},
 openTomb(id){T.tombId=id;go('tomb');},
 graveFilter(k){T.graveFilter=k;rerender();},
 logFilter(n){T.logFilter=n;rerender();},
 resurrect(id){const g=S.graves.find(x=>x.id===id);if(!g)return;S.graves=S.graves.filter(x=>x!==g);const b=bounce(g.name);b.res++;b.spent=g.price;
  logEvent('res',g.name);const parent=g.via&&S.subs.find(x=>x.name===g.via);if(parent){(parent.addons||=[]).push({id:uid(),name:g.name,price:g.price,cadence:g.cadence||'monthly',first:today(),last:today(),next:addDays(today(),30),charges:[],source:'resurrected'});save();T.revived=g;T.flash=parent.id;go('back','zoom');return;}const s={id:uid(),name:g.name,price:g.price,cadence:g.cadence||'monthly',next:addDays(today(),g.cadence==='yearly'?365:30),last:today(),first:today(),charges:[],source:'resurrected',rating:null,back:true};S.subs.push(s);save();T.revived=g;T.flash=s.id;go('back','zoom');}
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
// Pick up new versions in tabs that stay open: check when you come back to the tab, and once a
// new version has taken over, reload the next time the tab is hidden (so nothing jumps mid-tap).
if('serviceWorker' in navigator){let had=!!navigator.serviceWorker.controller,pending=false;
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(!had){had=true;return;}pending=true;if(document.visibilityState==='hidden')location.reload();});
 document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{});else if(pending)location.reload();});
 setInterval(()=>navigator.serviceWorker.getRegistration().then(r=>r&&r.update()).catch(()=>{}),30*60*1000);}
