export function mountConstellation(root,sourceTeams){
const cleanups=[];
const addEventListener=(type,handler,options)=>{window.addEventListener(type,handler,options);cleanups.push(()=>window.removeEventListener(type,handler,options))};
const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
let cardsReady=false,cardsMode=false,profileFocusFrame=0;
const teams=sourceTeams.map(t=>({...t,members:[...t.members]}));
while(teams.length<4)teams.push({name:'TEAM 0'+(teams.length+1),members:[]});
const shapes=[
 [[12,18],[23,33],[34,21],[16,46],[37,43]],
 [[63,17],[74,32],[90,22],[76,49],[94,43]],
 [[8,71],[18,58],[27,74],[38,84],[22,92]],
 [[56,67],[68,80],[78,61],[92,77],[82,92]]
];
const connections=[[[0,1],[1,2],[1,3],[3,4]],[[0,1],[1,2],[1,3],[3,4]],[[0,1],[1,2],[2,3],[2,4]],[[0,1],[1,2],[2,3],[3,4]]];
const labels=[[10,8],[65,7],[6,53],[60,57]];
let filter='all',selected=0,paused=matchMedia('(prefers-reduced-motion: reduce)').matches;const players=[];let buttons=[];
teams.forEach((team,t)=>{for(let i=0;i<5;i++){const p=team.members[i];players.push({team:t,slot:i,name:p?.name||'Player '+String(t*5+i+1).padStart(2,'0'),number:p?.number||String(t*5+i+1).padStart(2,'0'),image:p?.image,position:p?.position,reserved:!p})}});
function xy(n){const p=shapes[n.team][n.slot];if(innerWidth>700)return {x:p[0],y:p[1]};const bounds=[ [12,37,18,46],[63,94,17,49],[8,38,58,92],[56,92,61,92] ][n.team];return {x:12+(p[0]-bounds[0])/(bounds[1]-bounds[0])*75,y:n.team*25+5+(p[1]-bounds[2])/(bounds[3]-bounds[2])*17};}

function visible(){return players.map((p,i)=>({p,i})).filter(x=>filter==='all'||String(x.p.team)===filter).map(x=>x.i)}
function renderMap(){
 if(cardsReady)renderCards();
 const mobile=innerWidth<=700;
 let svg=`<defs><radialGradient id="haze"><stop stop-color="#b6c7e5" stop-opacity=".09"/><stop offset="1" stop-color="#b6c7e5" stop-opacity="0"/></radialGradient><linearGradient id="trail"><stop stop-color="#c7d4e7" stop-opacity="0"/><stop offset=".55" stop-color="#c7d4e7" stop-opacity=".25"/><stop offset="1" stop-color="#c7d4e7" stop-opacity="0"/></linearGradient></defs>`;
 if(!mobile)svg+=`<path class="celestial-trail" d="M-80 540C220 680 590-110 1080 120"/><path class="celestial-trail trail-two" d="M-100 130C480-80 440 710 1120 490"/><circle class="atlas-ring" cx="505" cy="355" r="235"/><circle class="atlas-ring outer" cx="505" cy="355" r="290"/><path class="axis-ticks" d="M505 106v8M505 596v8M260 355h8M742 355h8"/>`;
 teams.forEach((t,team)=>{
 svg+=`<g class="cluster" data-team="${team}">`;
 const center=xy({team,slot:1});svg+=`<ellipse cx="${center.x*10}" cy="${center.y*6.6}" rx="190" ry="145" fill="url(#haze)"/>`;
 const pts=shapes[team];
 if(!mobile){const [lx,ly]=labels[team];svg+=`<path id="caption-${team}" d="M${lx*10} ${ly*6.6}q100 -30 220 5" fill="none"/><text class="arc-caption"><textPath href="#caption-${team}">0${team+1} / TEAM 0${team+1} — ${team<2?'THE COLLECTIVE':'AWAITING REVEAL'}</textPath></text>`;}
 connections[team].forEach(([a,b],k)=>{const x=xy({team,slot:a}),y=xy({team,slot:b});svg+=`<line style="--delay:${k*.12}s" class="link ${selected===team*5+a||selected===team*5+b?'selected':''}" x1="${x.x*10}" y1="${x.y*6.6}" x2="${y.x*10}" y2="${y.y*6.6}"/>`});
 const anchor=xy({team,slot:4});svg+=`<circle class="satellite" cx="${anchor.x*10+24}" cy="${anchor.y*6.6-19}" r="2"/><path class="ghost-line" d="M${anchor.x*10} ${anchor.y*6.6}l24 -19 30 9"/>`;
 svg+='</g>';
 });
 $('#lines').innerHTML=svg;
 buttons.forEach((b,i)=>{const pt=xy(players[i]);b.style.left=pt.x+'%';b.style.top=pt.y+'%';b.hidden=filter!=='all'&&String(players[i].team)!==filter;b.classList.toggle('selected',selected===i);b.classList.toggle('same-team',players[i].team===players[selected].team);b.setAttribute('aria-pressed',String(selected===i))});
 $$('.cluster').forEach(el=>{el.style.opacity=filter==='all'||el.dataset.team===filter?'1':'.06';el.classList.toggle('active-cluster',Number(el.dataset.team)===players[selected].team)});
 $$('.team-label').forEach((el,i)=>el.style.opacity=filter==='all'||String(i)===filter?'1':'.2');
}

players.forEach((p,i)=>{const b=document.createElement('button');b.className='star'+(p.reserved?' empty':'');b.setAttribute('aria-label',p.reserved?`Team ${p.team+1}, reserved position ${p.slot+1}`:`${p.name}, Team ${p.team+1}, Player ${p.number}`);b.innerHTML=`<span class="glyph" aria-hidden="true"></span><span class="star-name">${p.reserved?'PLAYER '+p.number:p.name}</span>`;b.onclick=()=>{select(i);if(typeof cameraReady!=='undefined'&&cameraReady)syncSelection()};b.onkeydown=e=>{if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const list=visible(),at=list.indexOf(i);const target=e.key==='Home'?list[0]:e.key==='End'?list.at(-1):list[(at+(['ArrowRight','ArrowDown'].includes(e.key)?1:-1)+list.length)%list.length];select(target);buttons[target].focus()}};$('#stars').append(b);buttons.push(b)});
function select(i){selected=i;$('#quick-name').textContent=players[i].name;const p=players[i];$('#index').textContent=String(i+1).padStart(2,'0')+' / 20';$('#name').textContent=p.name;$('#team-name').textContent=`TEAM 0${p.team+1} / ${p.reserved?'PLAYER '+p.number+' / TO BE REVEALED':'PLAYER '+p.number}`;$('#code').textContent=p.reserved?'RESERVED':'EE / '+p.number;$('#description').textContent=p.reserved?'Team 0'+(p.team+1)+' · Player '+p.number+'. Name and portrait to be revealed.':'One star in the collective. Select View Profile to explore this player.';$('#photo-status').textContent=p.reserved?'FUTURE PLAYER':'PORTRAIT LOADING';const img=$('#portrait');img.hidden=true;img.onload=()=>{img.hidden=false};img.onerror=()=>{img.hidden=true;$('#photo-status').textContent='PORTRAIT UNAVAILABLE'};if(p.image){img.referrerPolicy='no-referrer';img.src=p.image}else img.removeAttribute('src');$('#profile').innerHTML=(p.reserved?'EXPLORE THIS POSITION':'VIEW PROFILE')+' <span>↗</span>';$('#hint').textContent=p.reserved?`TEAM 0${p.team+1} · RESERVED POSITION`:`${p.name.toUpperCase()} · TEAM 0${p.team+1} · STAR SELECTED`;renderMap()}
$$('[data-filter]').forEach(b=>b.onclick=()=>{filter=b.dataset.filter;$$('[data-filter]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));if(!visible().includes(selected))select(visible()[0]);else renderMap()});
function step(d){const list=visible();select(list[(list.indexOf(selected)+d+list.length)%list.length])}$('#prev').onclick=()=>step(-1);$('#next').onclick=()=>step(1);
$('#profile').onclick=()=>{const p=players[selected];$('#dialog-team').textContent=`TEAM 0${p.team+1} / ${p.reserved?'RESERVED POSITION':'PLAYER '+p.number}`;$('#dialog-name').textContent=p.name;$('#dialog-description').textContent=p.reserved?'This is Player '+p.number+' in Team 0'+(p.team+1)+'. The confirmed name and portrait have not been supplied yet.':`${p.name} is part of Exalted Era’s Team 0${p.team+1} Valorant Mobile roster. Full biography and role details have not been supplied yet.`;$('#dialog-photo').hidden=!p.image;const image=$('#dialog-image'),status=$('#dialog-image-status');image.hidden=true;status.hidden=false;status.textContent=p.image?'Loading portrait…':'Portrait to be revealed';image.alt=p.name+' — Team 0'+(p.team+1)+' player portrait';image.onload=()=>{image.hidden=false;status.hidden=true};image.onerror=()=>{image.hidden=true;status.hidden=false;status.textContent='The portrait could not load. Try opening the portrait below.'};if(p.image){image.src=p.image;const id=new URL(p.image,window.location.origin).searchParams.get('id');$('#dialog-photo').href=id?'https://drive.google.com/file/d/'+encodeURIComponent(id)+'/view':p.image}else{image.removeAttribute('src')}$('#dialog').showModal()};$('#close').onclick=()=>$('#dialog').close();$('#dialog').onclick=e=>{if(e.target===$('#dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const canvas=$('#sky'),ctx=canvas.getContext('2d');let width=0,height=0,tick=0,frame=0;const dust=Array.from({length:120},(_,i)=>({x:Math.sin(i*127.1)*43758.5453%1,y:Math.sin(i*311.7)*12345.678%1,r:i%9===0?1.1:.5}));
function resize(){width=canvas.clientWidth;height=canvas.clientHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);renderMap();draw()}
function draw(){ctx.clearRect(0,0,width,height);dust.forEach((p,i)=>{ctx.globalAlpha=.16+(Math.sin(tick*.008+i)+1)*.15;ctx.fillStyle='#b9c6e1';ctx.beginPath();ctx.arc(Math.abs(p.x)*width,Math.abs(p.y)*height,p.r,0,Math.PI*2);ctx.fill()});tick++}
function loop(){if(!paused&&!document.hidden&&!cardsMode)draw();frame=requestAnimationFrame(loop)}
function motionLabel(){root.host.classList.toggle('paused',paused);$('#motion').textContent=paused?'RESUME STARFIELD ▷':'PAUSE STARFIELD Ⅱ';$('#motion').setAttribute('aria-pressed',String(paused))}$('#motion').onclick=()=>{paused=!paused;motionLabel()};const motionChange=e=>{paused=e.matches;motionLabel()};motionQuery.addEventListener('change',motionChange);addEventListener('resize',resize);select(0);resize();motionLabel();loop();

// Camera controls are independent of player data and the live website.
let cameraReady=true, zoom=1, panX=0, panY=0, dragging=null, tourStep=-1, touchPan=false, isolated=false;
const chart=$('.chart'),map=$('.map');
function camera(){const w=chart.clientWidth,h=chart.clientHeight;panX=Math.min(60,Math.max(w*(1-zoom)-60,panX));panY=Math.min(60,Math.max(h*(1-zoom)-60,panY));map.style.transform=`translate(${panX}px,${panY}px) scale(${zoom})`;$('#zoom-level').textContent=Math.round(zoom*100)+'%';$('#zoom-in').disabled=zoom>=2.2;$('#zoom-out').disabled=zoom<=1;}
function centerPoint(x,y,z){zoom=z;panX=chart.clientWidth*.5-x*.01*chart.clientWidth*zoom;panY=chart.clientHeight*.5-y*.01*chart.clientHeight*zoom;camera()}
function setZoom(z){const old=zoom;zoom=Math.max(1,Math.min(2.2,z));const cx=chart.clientWidth/2,cy=chart.clientHeight/2;panX=cx-(cx-panX)*zoom/old;panY=cy-(cy-panY)*zoom/old;if(zoom===1){panX=0;panY=0}camera()}
function resetCamera(){zoom=1;panX=panY=0;camera()}
$('#zoom-in').onclick=()=>setZoom(zoom+.3);$('#zoom-out').onclick=()=>setZoom(zoom-.3);$('#reset-map').onclick=()=>{endTour();resetCamera()};
function applyFilter(value){filter=value;$$('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter===value)));renderMap()}
function syncSelection(){if(isolated)applyFilter(String(players[selected].team));}
$('#isolate').onclick=()=>{isolated=!isolated;$('#isolate').setAttribute('aria-pressed',String(isolated));$('#isolate').textContent=isolated?'SHOW ALL TEAMS':'ISOLATE TEAM';applyFilter(isolated?String(players[selected].team):'all')};
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{isolated=false;$('#isolate').setAttribute('aria-pressed','false');$('#isolate').textContent='ISOLATE TEAM';endTour();resetCamera()}));
$('#touch-pan').onclick=()=>{touchPan=!touchPan;chart.classList.toggle('touch-pan',touchPan);$('#touch-pan').setAttribute('aria-pressed',String(touchPan));$('#touch-pan').textContent=touchPan?'DONE PANNING':'PAN MAP'};
chart.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,#tour-panel,#hover-preview')||(e.pointerType==='touch'&&!touchPan))return;dragging={x:e.clientX,y:e.clientY,px:panX,py:panY};chart.setPointerCapture(e.pointerId);chart.classList.add('dragging')});
chart.addEventListener('pointermove',e=>{if(!dragging)return;panX=dragging.px+e.clientX-dragging.x;panY=dragging.py+e.clientY-dragging.y;camera()});
function release(){dragging=null;chart.classList.remove('dragging')}chart.addEventListener('pointerup',release);chart.addEventListener('pointercancel',release);
chart.addEventListener('keydown',e=>{if(e.target.closest('.star'))return;if(e.key==='+'||e.key==='='){e.preventDefault();setZoom(zoom+.3)}if(e.key==='-'){e.preventDefault();setZoom(zoom-.3)}if(e.key==='0'){e.preventDefault();resetCamera()}});
chart.tabIndex=0;chart.setAttribute('aria-label','Interactive constellation map. Drag to pan, use plus or minus to zoom, zero to reset. Select a star to view its player.');
$('#quick-profile').onclick=()=>$('#profile').click();
function showTour(n){tourStep=(n+4)%4;isolated=false;$('#isolate').setAttribute('aria-pressed','false');$('#isolate').textContent='ISOLATE TEAM';applyFilter('all');select(tourStep*5);$('#tour-panel').hidden=false;$('#tour-start').textContent='END TOUR ×';$('#tour-step').textContent=`CONSTELLATION ${tourStep+1} / 4`;$('#tour-title').textContent=`TEAM 0${tourStep+1}`;$('#tour-copy').textContent=tourStep<2?teams[tourStep].members.map(m=>m.name).join(' · '):'Five stars for the next chapter. Player names and portraits are yet to be revealed.';const pts=Array.from({length:5},(_,slot)=>xy({team:tourStep,slot}));const xs=pts.map(p=>p.x),ys=pts.map(p=>p.y);centerPoint((Math.min(...xs)+Math.max(...xs))/2,(Math.min(...ys)+Math.max(...ys))/2,innerWidth<=700?1.25:1.6);$('#tour-next').textContent=tourStep===3?'FINISH TOUR ✓':'NEXT TEAM →'}
function endTour(){tourStep=-1;$('#tour-panel').hidden=true;$('#tour-start').textContent='TAKE A TOUR ↗'}
$('#tour-start').onclick=()=>{if(tourStep<0){showTour(0)}else{endTour();resetCamera()}};$('#tour-prev').onclick=()=>showTour(tourStep-1);$('#tour-next').onclick=()=>{if(tourStep===3){endTour();resetCamera()}else showTour(tourStep+1)};$('#tour-close').onclick=()=>{endTour();resetCamera()};
addEventListener('keydown',e=>{if(e.key==='Escape'&&!$('#dialog').open){endTour();touchPan=false;chart.classList.remove('touch-pan');$('#touch-pan').setAttribute('aria-pressed','false');$('#touch-pan').textContent='PAN MAP';resetCamera()}});
addEventListener('resize',resetCamera);camera();


// Player discovery and team focus.
let hoverIndex=0,hidePreviewTimer=0,focusedTeam=null;
const preview=$('#hover-preview'),search=$('#player-search'),results=$('#search-results');
function hidePreview(){clearTimeout(hidePreviewTimer);preview.hidden=true;}
function scheduleHide(){clearTimeout(hidePreviewTimer);hidePreviewTimer=setTimeout(hidePreview,180)}
function showPreview(i){
 clearTimeout(hidePreviewTimer);hoverIndex=i;const player=players[i];$('#hover-name').textContent=player.name;$('#hover-team').textContent=`TEAM 0${player.team+1} / PLAYER ${player.number}`;
 const image=$('#hover-image'),status=$('#hover-image-status');image.hidden=true;status.hidden=false;status.textContent=player.image?'PORTRAIT LOADING':'PORTRAIT TO BE REVEALED';image.alt=player.name+' portrait';image.onload=()=>{image.hidden=false;status.hidden=true};image.onerror=()=>{image.hidden=true;status.hidden=false;status.textContent='PORTRAIT UNAVAILABLE'};if(player.image){image.referrerPolicy='no-referrer';if(image.src!==player.image)image.src=player.image;else if(image.complete&&image.naturalWidth){image.hidden=false;status.hidden=true}}else image.removeAttribute('src');
 preview.hidden=false;const r=buttons[i].getBoundingClientRect(),c=chart.getBoundingClientRect();const width=preview.offsetWidth,height=preview.offsetHeight;
 let x=r.right-c.left+10,y=r.top-c.top-height*.3;if(x+width>c.width-10)x=r.left-c.left-width-10;
 preview.style.left=Math.max(8,Math.min(c.width-width-8,x))+'px';preview.style.top=Math.max(8,Math.min(c.height-height-8,y))+'px';
}
buttons.forEach((button,i)=>{
 button.setAttribute('aria-controls','hover-preview');
 button.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch'&&!dragging)showPreview(i)});
 button.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')scheduleHide()});
 button.addEventListener('focus',()=>showPreview(i));
 button.addEventListener('blur',e=>{if(!preview.contains(e.relatedTarget))scheduleHide()});
 button.addEventListener('click',()=>showPreview(i));
});
preview.addEventListener('pointerenter',()=>clearTimeout(hidePreviewTimer));preview.addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')scheduleHide()});preview.addEventListener('focusout',e=>{if(!preview.contains(e.relatedTarget))scheduleHide()});
$('#hover-profile').onclick=()=>{select(hoverIndex);syncSelection();hidePreview();$('#profile').click()};
chart.addEventListener('pointerdown',e=>{if(!e.target.closest('.star,#hover-preview'))hidePreview()});
function matches(){const q=search.value.trim().toLowerCase();return q?players.map((p,i)=>({p,i})).filter(({p})=>p.name.toLowerCase().includes(q)||('player '+p.number).includes(q)):[]}
function renderSearch(){
 const query=search.value.trim();results.replaceChildren();if(!query){results.hidden=true;$('#search-status').textContent='';buttons.forEach(b=>b.classList.remove('search-match'));return}
 const found=matches();$('#search-status').textContent=found.length?`${found.length} player${found.length===1?'':'s'} found`:'No matching players. Try an IGN or player number.';results.hidden=false;
 buttons.forEach((b,i)=>b.classList.toggle('search-match',found.some(x=>x.i===i)));
 found.forEach(({p,i})=>{const b=document.createElement('button');b.className='search-result';b.innerHTML=`<span>${p.name}</span><small>TEAM 0${p.team+1} / ${p.number}</small>`;b.onclick=()=>choosePlayer(i);b.onkeydown=e=>{const all=[...results.querySelectorAll('button')],n=all.indexOf(b);if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();all[(n+(e.key==='ArrowDown'?1:-1)+all.length)%all.length].focus()}if(e.key==='Escape'){results.hidden=true;search.focus()}};results.append(b)});
}
function choosePlayer(i){
 hidePreview();endTour();focusedTeam=null;$('#team-focus').hidden=true;isolated=false;$('#isolate').setAttribute('aria-pressed','false');$('#isolate').textContent='ISOLATE TEAM';applyFilter('all');select(i);const point=xy(players[i]);centerPoint(point.x,point.y,innerWidth<=700?1.3:1.7);results.hidden=true;$('#search-status').textContent=`${players[i].name} selected in Team 0${players[i].team+1}`;const target=cardsMode?$('#roster-cards'):chart;target.scrollIntoView({behavior:motionQuery.matches?'instant':'smooth',block:'nearest'});(cardsMode?$(`[data-player-card="${players[i].number}"]`):buttons[i])?.focus({preventScroll:true});hidePreview();
}
search.addEventListener('input',renderSearch);search.addEventListener('focus',()=>{if(search.value.trim())renderSearch()});search.addEventListener('keydown',e=>{const first=results.querySelector('button');if(e.key==='ArrowDown'&&first){e.preventDefault();first.focus()}if(e.key==='Enter'&&matches().length){e.preventDefault();choosePlayer(matches()[0].i)}if(e.key==='Escape'){results.hidden=true}});
$('#clear-search').onclick=()=>{search.value='';renderSearch();search.focus()};
function focusTeam(team){
 hidePreview();endTour();results.hidden=true;focusedTeam=team;isolated=false;$('#isolate').setAttribute('aria-pressed','false');$('#isolate').textContent='ISOLATE TEAM';applyFilter(String(team));if(players[selected].team!==team)select(team*5);
 $('#team-focus').hidden=false;$('#focus-kicker').textContent=`CONSTELLATION 0${team+1} / 05 PLAYER POSITIONS`;$('#focus-title').textContent=`TEAM 0${team+1}`;$('#focus-description').textContent=team<2?'Five players. One shared pursuit of excellence.':'The next chapter of the collective. Player names and portraits to be revealed.';
 const roster=$('#focus-roster');roster.replaceChildren();players.forEach((p,i)=>{if(p.team!==team)return;const b=document.createElement('button');b.textContent=p.name;b.setAttribute('aria-label',`Select ${p.name} in focused team`);b.onclick=()=>{select(i);showPreview(i)};roster.append(b)});
 const pts=Array.from({length:5},(_,slot)=>xy({team,slot}));centerPoint((Math.min(...pts.map(p=>p.x))+Math.max(...pts.map(p=>p.x)))/2,(Math.min(...pts.map(p=>p.y))+Math.max(...pts.map(p=>p.y)))/2,innerWidth<=700?1.12:1.5);
}
$('#focus-selected').onclick=()=>focusTeam(players[selected].team);$('#focus-exit').onclick=()=>{$('[data-filter="all"]').click();$('#focus-selected').focus()};
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{hidePreview();results.hidden=true;if(b.dataset.filter==='all'){focusedTeam=null;$('#team-focus').hidden=true}else focusTeam(Number(b.dataset.filter))}));
$('#tour-start').addEventListener('click',()=>{hidePreview();focusedTeam=null;$('#team-focus').hidden=true;results.hidden=true});
addEventListener('keydown',e=>{if(e.key==='Escape'){hidePreview();results.hidden=true}});
const dismissSearch=e=>{if(!e.target.closest('.search-wrap'))results.hidden=true};root.addEventListener('pointerdown',dismissSearch);cleanups.push(()=>root.removeEventListener('pointerdown',dismissSearch));
cleanups.push(()=>clearTimeout(hidePreviewTimer));


// Cards use the same roster and profile dialog as the constellation map.
function renderCards(){
 const query=search.value.trim().toLowerCase();
 const found=players.map((p,i)=>({p,i})).filter(({p})=>!p.reserved&&(filter==='all'||String(p.team)===filter)&&(!query||`${p.name} ${p.number} team 0${p.team+1}`.toLowerCase().includes(query)));
 const grid=$('#cards-grid');grid.replaceChildren();
 $('#cards-status').textContent=found.length?`${found.length} player${found.length===1?'':'s'}`:filter==='2'||filter==='3'?'This team’s roster has not been announced.':'No matching players. Try another name or team.';
 found.forEach(({p,i})=>{
  const card=document.createElement('button');card.type='button';card.className='roster-card';card.dataset.playerCard=p.number;card.setAttribute('aria-label',`View ${p.name} profile, Team 0${p.team+1}`);card.setAttribute('aria-haspopup','dialog');
  const portrait=document.createElement('span');portrait.className='roster-card-photo';
  const fallback=document.createElement('span');fallback.className='roster-card-fallback';fallback.textContent=p.number;fallback.setAttribute('aria-hidden','true');portrait.append(fallback);
  if(p.image){const img=document.createElement('img');img.src=p.image;img.alt='';img.loading='lazy';img.decoding='async';img.addEventListener('error',()=>img.remove(),{once:true});portrait.append(img)}
  const body=document.createElement('span');body.className='roster-card-body';
  const team=document.createElement('span');team.className='roster-card-team';team.textContent=`TEAM 0${p.team+1} / ${p.number}`;
  const name=document.createElement('strong');name.textContent=p.name;
  const role=document.createElement('span');role.className='roster-card-role';role.textContent=p.position||'Valorant Mobile';
  const cta=document.createElement('span');cta.className='roster-card-cta';cta.textContent='VIEW PROFILE ↗';
  body.append(team,name,role,cta);card.append(portrait,body);
  card.onclick=()=>{select(i);$(`[data-player-card="${p.number}"]`)?.focus({preventScroll:true});$('#profile').click()};grid.append(card);
 });
}
function setRosterView(mode){
 cardsMode=mode==='cards';hidePreview();endTour();
 root.host.classList.toggle('cards-mode',cardsMode);
 $('#view-map').setAttribute('aria-pressed',String(!cardsMode));$('#view-cards').setAttribute('aria-pressed',String(cardsMode));
 $('#roster-map').hidden=cardsMode;$('#roster-cards').hidden=!cardsMode;
 $('#tour-start').hidden=cardsMode;$('#motion').hidden=cardsMode;$('#focus-selected').hidden=cardsMode;
 $('#team-focus').hidden=true;
 if(cardsMode)renderCards();else{resize();camera()}
}
$('#view-map').onclick=()=>setRosterView('map');$('#view-cards').onclick=()=>setRosterView('cards');
search.addEventListener('input',()=>{if(cardsMode){renderCards();results.hidden=true}});
$('#clear-search').addEventListener('click',()=>{if(cardsMode)renderCards()});
$$('[data-filter]').forEach(b=>b.addEventListener('click',()=>{if(cardsMode){$('#team-focus').hidden=true;renderCards()}}));
cardsReady=true;setRosterView(innerWidth<=700?'cards':'map');
$('#dialog').addEventListener('close',()=>{if(cardsMode)$(`[data-player-card="${players[selected].number}"]`)?.focus({preventScroll:true})});

// Player numbers are stable across display-name changes; reserved positions have no public profile.
const profileDialog=$('#dialog');
const originalOpenProfile=$('#profile').onclick;
const profileUrl=p=>{const url=new URL(window.location.href);url.searchParams.set('player',p.number);url.hash='players';return url};
let openingFromUrl=false;
$('#profile').onclick=()=>{
 const p=players[selected];
 $('#share-status').textContent='';$('#profile-link').hidden=true;$('#copy-profile').hidden=p.reserved;
 if(!p.reserved&&!openingFromUrl){
  const url=profileUrl(p);
  if(window.location.href!==url.href)history.pushState({...history.state,eePlayerProfile:true},'',url);
 }
 originalOpenProfile();
};
function removeProfileUrl(){
 const url=new URL(window.location.href);
 if(!url.searchParams.has('player'))return;
 if(history.state?.eePlayerProfile){history.back()}else{url.searchParams.delete('player');history.replaceState(history.state,'',url)}
}
profileDialog.addEventListener('close',()=>{if(!openingFromUrl)removeProfileUrl()});
$('#copy-profile').onclick=async()=>{
 const url=profileUrl(players[selected]).href;
 try{await navigator.clipboard.writeText(url);$('#share-status').textContent='Profile link copied.'}
 catch{const field=$('#profile-link');field.value=url;field.hidden=false;field.focus();field.select();$('#share-status').textContent='Copy the selected profile link.'}
};
function syncProfileUrl(){
 const number=new URL(window.location.href).searchParams.get('player');
 const index=players.findIndex(p=>!p.reserved&&p.number===number);
 openingFromUrl=true;
 try{
  if(index>=0){choosePlayer(index);$('#profile').click()}
  else if(profileDialog.open){profileDialog.close();buttons[selected].focus({preventScroll:true})}
 }finally{openingFromUrl=false}
 if(index<0&&cardsMode){cancelAnimationFrame(profileFocusFrame);profileFocusFrame=requestAnimationFrame(()=>$(`[data-player-card="${players[selected].number}"]`)?.focus({preventScroll:true}))}
}
addEventListener('popstate',syncProfileUrl);
addEventListener('hashchange',syncProfileUrl);
// Wait until all controls are initialized, including React StrictMode's remount.
let profileUrlFrame=requestAnimationFrame(syncProfileUrl);
cleanups.push(()=>{cancelAnimationFrame(profileUrlFrame);cancelAnimationFrame(profileFocusFrame)});

return ()=>{cancelAnimationFrame(frame);cleanups.forEach(fn=>fn());motionQuery.removeEventListener('change',motionChange);const dialog=$('#dialog');if(dialog?.open)dialog.close();};
}
