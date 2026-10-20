export function mountConstellation(root,sourceTeams){
const cleanups=[];
const addEventListener=(type,handler,options)=>{window.addEventListener(type,handler,options);cleanups.push(()=>window.removeEventListener(type,handler,options))};
const $=s=>root.querySelector(s),$$=s=>[...root.querySelectorAll(s)];
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
teams.forEach((team,t)=>{for(let i=0;i<5;i++){const p=team.members[i];players.push({team:t,slot:i,name:p?.name||'Player '+String(t*5+i+1).padStart(2,'0'),number:p?.number||String(t*5+i+1).padStart(2,'0'),image:p?.image,reserved:!p})}});
function xy(n){const p=shapes[n.team][n.slot];if(innerWidth>700)return {x:p[0],y:p[1]};const bounds=[ [12,37,18,46],[63,94,17,49],[8,38,58,92],[56,92,61,92] ][n.team];return {x:12+(p[0]-bounds[0])/(bounds[1]-bounds[0])*75,y:n.team*25+5+(p[1]-bounds[2])/(bounds[3]-bounds[2])*17};}

function visible(){return players.map((p,i)=>({p,i})).filter(x=>filter==='all'||String(x.p.team)===filter).map(x=>x.i)}
function renderMap(){
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
$('#profile').onclick=()=>{const p=players[selected];$('#dialog-team').textContent=`TEAM 0${p.team+1} / ${p.reserved?'RESERVED POSITION':'PLAYER '+p.number}`;$('#dialog-name').textContent=p.name;$('#dialog-description').textContent=p.reserved?'This is Player '+p.number+' in Team 0'+(p.team+1)+'. The confirmed name and portrait have not been supplied yet.':`${p.name} is part of Exalted Era’s Team 0${p.team+1} Valorant Mobile roster. Full biography and role details have not been supplied yet.`;$('#dialog-photo').hidden=!p.image;const image=$('#dialog-image'),status=$('#dialog-image-status');image.hidden=true;status.hidden=false;status.textContent=p.image?'Loading portrait…':'Portrait to be revealed';image.alt=p.name+' — Team 0'+(p.team+1)+' player portrait';image.onload=()=>{image.hidden=false;status.hidden=true};image.onerror=()=>{image.hidden=true;status.hidden=false;status.textContent='The portrait could not load from Google Drive. Use Open Original Portrait below.'};if(p.image){image.src=p.image;const id=new URL(p.image).searchParams.get('id');$('#dialog-photo').href=id?'https://drive.google.com/file/d/'+encodeURIComponent(id)+'/view':p.image}else{image.removeAttribute('src')}$('#dialog').showModal()};$('#close').onclick=()=>$('#dialog').close();$('#dialog').onclick=e=>{if(e.target===$('#dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close()}};
const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
const canvas=$('#sky'),ctx=canvas.getContext('2d');let width=0,height=0,tick=0,frame=0;const dust=Array.from({length:120},(_,i)=>({x:Math.sin(i*127.1)*43758.5453%1,y:Math.sin(i*311.7)*12345.678%1,r:i%9===0?1.1:.5}));
function resize(){width=canvas.clientWidth;height=canvas.clientHeight;const d=Math.min(devicePixelRatio||1,2);canvas.width=width*d;canvas.height=height*d;ctx.setTransform(d,0,0,d,0,0);renderMap();draw()}
function draw(){ctx.clearRect(0,0,width,height);dust.forEach((p,i)=>{ctx.globalAlpha=.16+(Math.sin(tick*.008+i)+1)*.15;ctx.fillStyle='#b9c6e1';ctx.beginPath();ctx.arc(Math.abs(p.x)*width,Math.abs(p.y)*height,p.r,0,Math.PI*2);ctx.fill()});tick++}
function loop(){if(!paused&&!document.hidden)draw();frame=requestAnimationFrame(loop)}
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
chart.addEventListener('pointerdown',e=>{if(e.target.closest('button,a,#tour-panel')||(e.pointerType==='touch'&&!touchPan))return;dragging={x:e.clientX,y:e.clientY,px:panX,py:panY};chart.setPointerCapture(e.pointerId);chart.classList.add('dragging')});
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

return ()=>{cancelAnimationFrame(frame);cleanups.forEach(fn=>fn());motionQuery.removeEventListener('change',motionChange);const dialog=$('#dialog');if(dialog?.open)dialog.close();};
}
