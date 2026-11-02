
import React,{useEffect,useRef,useState} from 'react';
import {teams} from '../data/teams';
import '../styles/sphere.css';

const SIDE=420,COLS=6,ROWS=4,CW=166,CH=216;
const SLOTS=[0,1,2,3,4,5,6,7,8,9,10,11,12,13,-1,14,15,16,17,18,19,-1,-1,-1];
const roster=Array.from({length:20},(_,i)=>{
 const existing=teams.flatMap(team=>team.members)[i];
 return {name:existing?.name||`PLAYER ${String(i+1).padStart(2,'0')}`,image:existing?.image||'',number:String(i+1).padStart(2,'0'),team:Math.floor(i/5)};
});
const placeholder='data:image/svg+xml;charset=UTF-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 420"><defs><linearGradient id="g" x2="0" y2="1"><stop stop-color="#b4c6c8"/><stop offset="1" stop-color="#70858c"/></linearGradient></defs><rect width="300" height="420" fill="url(#g)"/><circle cx="150" cy="137" r="64" fill="#536c73"/><path d="M22 395 Q30 228 150 228 Q270 228 278 395Z" fill="#465b66"/></svg>');
function portrait(i:number){return roster[i].image||placeholder;}
function sphereUV(x:number,y:number,yaw:number,pitch:number){
 const nx=(x-SIDE/2)/(SIDE*.475),ny=(SIDE/2-y)/(SIDE*.475);
 const rr=nx*nx+ny*ny;if(rr>1)return null;
 const nz=Math.sqrt(1-rr),cp=Math.cos(pitch),sp=Math.sin(pitch),cy=Math.cos(yaw),sy=Math.sin(yaw);
 const py=ny*cp+nz*sp,pz=nz*cp-ny*sp;
 const px=nx*cy-pz*sy,pzz=nx*sy+pz*cy;
 let u=(Math.atan2(px,pzz)/(2*Math.PI)+.5)%1;if(u<0)u+=1;
 const v=.5-Math.asin(Math.max(-1,Math.min(1,py)))/Math.PI;
 return {u,v,z:nz};
}
function loadImage(src:string){return new Promise<HTMLImageElement|null>(resolve=>{const im=new Image();im.onload=()=>resolve(im);im.onerror=()=>resolve(null);im.src=src;});}
function atlasFrom(images:(HTMLImageElement|null)[]){
 const cv=document.createElement('canvas');cv.width=COLS*CW;cv.height=ROWS*CH;
 const c=cv.getContext('2d',{willReadFrequently:true})!;
 for(let n=0;n<COLS*ROWS;n++){
  const x=n%COLS*CW,y=Math.floor(n/COLS)*CH,id=SLOTS[n];
  c.fillStyle='#344c55';c.fillRect(x,y,CW,CH);
  c.fillStyle='#9baeb2';c.fillRect(x+5,y+5,CW-10,CH-10);
  if(id<0){
   c.fillStyle='#cfdad6';c.fillRect(x+8,y+8,CW-16,CH-16);
   c.strokeStyle='#526b74';c.lineWidth=2;c.beginPath();c.moveTo(x+CW/2,y+38);c.lineTo(x+CW-35,y+CH/2);c.lineTo(x+CW/2,y+CH-39);c.lineTo(x+35,y+CH/2);c.closePath();c.stroke();
   c.fillStyle='#415a63';c.font='bold 39px Arial';c.textAlign='center';c.fillText('EE',x+CW/2,y+CH/2+14);
   continue;
  }
  const im=images[id];
  if(im){
   const ratio=Math.max((CW-14)/im.width,(CH-14)/im.height),w=im.width*ratio,h=im.height*ratio;
   c.save();c.beginPath();c.rect(x+7,y+7,CW-14,CH-14);c.clip();c.filter='grayscale(100%) contrast(.92)';c.drawImage(im,x+CW/2-w/2,y+CH/2-h/2,w,h);c.restore();
  }else{
   c.fillStyle='#667d85';c.beginPath();c.arc(x+CW/2,y+69,35,0,Math.PI*2);c.fill();
   c.beginPath();c.ellipse(x+CW/2,y+183,85,78,0,0,Math.PI*2);c.fill();
  }
  const grad=c.createLinearGradient(0,y+126,0,y+CH);grad.addColorStop(0,'#22353c00');grad.addColorStop(1,'#263944f2');c.fillStyle=grad;c.fillRect(x+7,y+110,CW-14,CH-117);
  c.strokeStyle='#d7e1d9';c.lineWidth=2;c.strokeRect(x+6,y+6,CW-12,CH-12);
  c.font='bold 22px Arial';c.textAlign='center';c.fillStyle='#f1f5f0';c.fillText(roster[id].number,x+CW/2,y+CH-43);
  c.font='bold 11px Arial';c.fillText(roster[id].name.toUpperCase().slice(0,16),x+CW/2,y+CH-23);
 }
 return cv.getContext('2d',{willReadFrequently:true})!.getImageData(0,0,cv.width,cv.height);
}
function drawSphere(canvas:HTMLCanvasElement,atlas:ImageData,yaw:number,pitch:number){
 const ctx=canvas.getContext('2d');if(!ctx)return;
 const out=ctx.createImageData(SIDE,SIDE),dst=out.data,src=atlas.data,W=atlas.width;
 for(let y=0;y<SIDE;y++)for(let x=0;x<SIDE;x++){
  const ii=(y*SIDE+x)*4,uv=sphereUV(x,y,yaw,pitch);
  if(!uv){dst[ii+3]=0;continue;}
  const sx=Math.min(W-1,Math.floor(uv.u*W)),sy=Math.min(atlas.height-1,Math.floor(uv.v*atlas.height));
  const si=(sy*W+sx)*4;
  const light=.69+.28*uv.z;
  dst[ii]=src[si]*light;dst[ii+1]=src[si+1]*light;dst[ii+2]=src[si+2]*light;dst[ii+3]=255;
 }
 ctx.putImageData(out,0,0);
}
export function SpherePage(){
 const canvas=useRef<HTMLCanvasElement>(null),atlas=useRef<ImageData|null>(null);
 const rotate=useRef({yaw:-.34,pitch:.1}),drag=useRef<{x:number,y:number,startX:number,startY:number,moved:boolean}|null>(null);
 const focusedRef=useRef<number|null>(null),playRef=useRef(true),speedRef=useRef(35);
 const [focused,setFocused]=useState<number|null>(null),[selected,setSelected]=useState(3),[shown,setShown]=useState(false),[playing,setPlaying]=useState(true),[speed,setSpeed]=useState(35);
 const currentTeam=focused??Math.floor(selected/5);
 useEffect(()=>{focusedRef.current=focused;setShown(false);if(focused!==null){const id=requestAnimationFrame(()=>requestAnimationFrame(()=>setShown(true)));return ()=>cancelAnimationFrame(id);}},[focused]);
 useEffect(()=>{playRef.current=playing;},[playing]);
 useEffect(()=>{speedRef.current=speed;},[speed]);
 useEffect(()=>{let active=true;Promise.all(roster.map(p=>loadImage(p.image||placeholder))).then(images=>{if(active)atlas.current=atlasFrom(images);});
 let id=0,last=0;const tick=(t:number)=>{if(!active)return;id=requestAnimationFrame(tick);if(t-last<40)return;const elapsed=Math.min(90,t-last||40);last=t;
  if(focusedRef.current===null&&playRef.current&&!drag.current)rotate.current.yaw+=elapsed*.00015*speedRef.current/35;
  if(canvas.current&&atlas.current)drawSphere(canvas.current,atlas.current,rotate.current.yaw,rotate.current.pitch);
 };
 id=requestAnimationFrame(tick);return()=>{active=false;cancelAnimationFrame(id);};},[]);
 const selectByPoint=(clientX:number,clientY:number)=>{
  const rect=canvas.current?.getBoundingClientRect();if(!rect)return;
  const uv=sphereUV((clientX-rect.left)/rect.width*SIDE,(clientY-rect.top)/rect.height*SIDE,rotate.current.yaw,rotate.current.pitch);
  if(!uv)return;const n=Math.floor(uv.v*ROWS)*COLS+Math.floor(uv.u*COLS),id=SLOTS[n];
  if(id>=0){setSelected(id);setFocused(Math.floor(id/5));}
 };
 const pointerDown=(e:React.PointerEvent<HTMLCanvasElement>)=>{drag.current={x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY,moved:false};e.currentTarget.setPointerCapture(e.pointerId);};
 const pointerMove=(e:React.PointerEvent<HTMLCanvasElement>)=>{const d=drag.current;if(!d||focusedRef.current!==null)return;
  const dx=e.clientX-d.x,dy=e.clientY-d.y;d.x=e.clientX;d.y=e.clientY;
  if(Math.hypot(e.clientX-d.startX,e.clientY-d.startY)>5)d.moved=true;
  rotate.current.yaw+=dx*.006;rotate.current.pitch=Math.max(-.7,Math.min(.7,rotate.current.pitch-dy*.004));
 };
 const pointerUp=(e:React.PointerEvent<HTMLCanvasElement>)=>{const d=drag.current;drag.current=null;if(d&&!d.moved)selectByPoint(e.clientX,e.clientY);};
 const focusTeam=(n:number)=>{setSelected(n*5);setFocused(n);};
 const returnSphere=()=>setFocused(null);
 return <div className="sphere-page">
  <header className="sphere-header"><a className="sphere-brand" href="/"><img src="/ee-official-emblem-v2.png" alt="Exalted Era emblem"/><span>EXALTED<br/>ERA<small>THE SPHERE / BLACKSTAR</small></span></a><div className="sphere-head-right"><span className="edition">VALORANT MOBILE / ESPORTS</span><a href="/">RETURN TO WEBSITE ↗</a></div></header>
  <nav className="sphere-nav" aria-label="Website navigation"><a href="/">HOME</a><a href="/#about">ABOUT US</a><a href="/#staff">STAFF</a><a href="/#roster">PLAYERS</a><a className="active" href="/sphere" aria-current="page">SPHERE</a><a href="/scrims">SCRIM TRACKER</a><a href="/recruitment">RECRUITMENT</a></nav>
  <main className="sphere-layout">
   <section className={`sphere-scene ${focused!==null?'focused':''}`} aria-label="Interactive player globe">
    <div className="sphere-index">04 / OFFICIAL ROSTER<strong>THE SPHERE<span> / 20</span></strong></div>
    <div className="sphere-medallion" aria-hidden="true"/>
    <canvas ref={canvas} className="sphere-canvas" width={SIDE} height={SIDE} role="img" aria-label="3D globe made of player portrait cards. Drag to rotate or tap a player to reveal their team." onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={()=>drag.current=null} onWheel={e=>{e.preventDefault();rotate.current.pitch=Math.max(-.7,Math.min(.7,rotate.current.pitch+Math.sign(e.deltaY)*.07));}}/>
    {focused!==null&&<><button className="sphere-back" type="button" onClick={returnSphere}>← BACK TO SPHERE</button><div className="sphere-team-reveal" aria-label={`Team ${focused+1} lineup`}>{roster.slice(focused*5,focused*5+5).map((p,j)=><button type="button" key={p.number} onClick={()=>setSelected(focused*5+j)} className={`sphere-big-card ${shown?'show':''} ${selected===focused*5+j?'selected':''}`} style={{transitionDelay:shown?`${j*65}ms`:'0ms'}} title={p.name}><img src={portrait(focused*5+j)} alt={p.name}/><span className="foot"><small>{p.number} / TEAM 0{focused+1}</small>{p.name}</span></button>)}</div><div className="sphere-selected-label">TEAM 0{focused+1} — FIVE AS ONE</div></>}
    <div className="sphere-tip">{focused===null?'✧ DRAG TO ROTATE · CLICK A CARD TO REVEAL THE TEAM':'✧ SELECTED TEAM HAS MOVED FORWARD FROM THE SPHERE'}</div><div className="sphere-footer-no">BLACKSTAR / FIG—02</div>
   </section>
   <aside className="sphere-panel">
    <div className="sphere-eyebrow">EXALTED ERA / THE COLLECTIVE</div><h1>{focused===null?'SELECT A PLAYER.':`TEAM 0${focused+1}.`}</h1><p>{focused===null?'Twenty players. Four teams. Select a card on the Sphere and its full five-member team moves forward.':'Five members form one horizontal lineup. Select a portrait to highlight a player, or return to the Sphere.'}</p>
    <div className="sphere-tabs" aria-label="Select a team">{Array.from({length:4},(_,n)=><button key={n} type="button" aria-pressed={currentTeam===n} onClick={()=>focusTeam(n)}>0{n+1}</button>)}</div>
    <div className="sphere-teammeta"><strong>TEAM 0{currentTeam+1}</strong><span>05 / 05 MEMBERS</span></div>
    <div className="sphere-minirow">{roster.slice(currentTeam*5,currentTeam*5+5).map((p,j)=><button type="button" className={`sphere-mini ${selected===currentTeam*5+j?'selected':''}`} key={p.number} aria-label={`Show ${p.name} team`} onClick={()=>{setSelected(currentTeam*5+j);setFocused(currentTeam);}}><img src={portrait(currentTeam*5+j)} alt=""/><b>{p.number}</b></button>)}</div>
    <button type="button" className="sphere-cta" onClick={()=>focused===null?focusTeam(currentTeam):returnSphere()}>{focused===null?'VIEW TEAM':'RETURN TO SPHERE'}<span>↗</span></button>
    <div className="sphere-controls"><div className="sphere-eyebrow">SPHERE / MOTION SETTINGS</div><div className="sphere-controlrow"><span>Rotation speed</span><span>{speed}%</span></div><div className="sphere-controlrow"><input type="range" min="0" max="100" step="5" value={speed} onChange={e=>setSpeed(Number(e.target.value))} aria-label="Rotation speed"/></div><div className="sphere-controlrow"><button type="button" onClick={()=>setPlaying(!playing)}>{playing?'❚❚ PAUSE':'▶ PLAY'}</button><button type="button" onClick={()=>{rotate.current={yaw:-.34,pitch:.1};setFocused(null);}}>↺ RESET</button></div></div>
    <div className="sphere-note">DEMO ROSTER / Initial players are from the current website. Remaining slots use placeholders until the full 20-member roster is uploaded.</div>
   </aside>
  </main>
 </div>;
}
