import React,{useCallback,useEffect,useRef,useState} from 'react';
import {teams} from '../data/teams';
import '../styles/sphere.css';

type Player={id:number;name:string;image:string;team:number;x:number;y:number;z:number};
const current=teams.flatMap(team=>team.members);
const players:Player[]=Array.from({length:20},(_,i)=>{
 const v=1-2*(i+.5)/20,angle=i*Math.PI*(3-Math.sqrt(5)),radius=Math.sqrt(1-v*v);
 return {id:i,name:current[i]?.name||'PLAYER '+String(i+1).padStart(2,'0'),
 image:current[i]?.image||'',team:Math.floor(i/5),x:Math.cos(angle)*radius,y:v,z:Math.sin(angle)*radius};
});
const pad=(n:number)=>String(n).padStart(2,'0');
function Placeholder({number}:{number:number}){return <div className="gold-placeholder"><span className="gold-monogram">EE</span><span>{pad(number)}</span></div>;}
function Portrait({player}:{player:Player}){return player.image?<img src={player.image} loading="eager" alt="" draggable={false}/>:<Placeholder number={player.id+1}/>;}
function layout(stage:HTMLElement){
 const {width:w,height:h}=stage.getBoundingClientRect();
 const mobile=w<620;
 const radius=Math.min(w*(mobile?.36:.315),h*(mobile?.34:.365),mobile?210:285);
 const cw=mobile?85:Math.min(138,Math.max(104,w*.143));
 const ch=cw*1.45;
 return {w,h,cx:w*.5,cy:h*(mobile?.55:.50),radius,cw,ch,mobile};
}
export function SpherePage(){
 const stage=useRef<HTMLDivElement>(null),cards=useRef<Array<HTMLButtonElement|null>>([]);
 const orientation=useRef({yaw:-.35,pitch:-.1});
 const drag=useRef<{x:number;y:number;sx:number;sy:number}|null>(null),moved=useRef(false),mode=useRef<number|null>(null);
 const speedRef=useRef(35),playingRef=useRef(true),returning=useRef(false);
 const [team,setTeam]=useState(0),[selected,setSelected]=useState(3),[focused,setFocused]=useState<number|null>(null);
 const [playing,setPlaying]=useState(true),[speed,setSpeed]=useState(35);
 const panelTeam=focused??team;
 const applyGlobe=useCallback((animate=false)=>{
  if(!stage.current)return;
  const m=layout(stage.current),{yaw,pitch}=orientation.current;
  const cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
  players.forEach((p,i)=>{
   const el=cards.current[i];if(!el)return;
   const xx=p.x*cy+p.z*sy,zz=-p.x*sy+p.z*cy;
   const yy=p.y*cp-zz*sp,z2=p.y*sp+zz*cp;
   const depth=(z2+1)*.5,scale=.48+.66*depth;
   const x=m.cx+xx*m.radius-m.cw/2,y=m.cy-yy*m.radius-m.ch/2;
   el.style.width=m.cw+'px';el.style.height=m.ch+'px';
   el.style.transition=animate?'transform 1080ms cubic-bezier(.19,1,.22,1),opacity 870ms ease,width 1080ms ease,height 1080ms ease,filter 870ms ease':'none';
   el.style.transform='translate3d('+x+'px,'+y+'px,0) scale('+scale.toFixed(3)+') rotate('+(-xx*6).toFixed(2)+'deg)';
   el.style.zIndex=String(10+Math.round(depth*80));
   el.style.opacity=(.27+.73*depth).toFixed(3);
   el.style.filter='brightness('+(0.58+depth*.57).toFixed(2)+')';
   el.style.pointerEvents='auto';
   el.classList.remove('is-selected');
  });
 },[]);
 const applyTeam=useCallback((target:number,pick:number)=>{
  if(!stage.current)return;
  const m=layout(stage.current);
  const gap=m.mobile?4:Math.min(14,m.w*.014);
  const cw=Math.min(m.mobile?87:168,(m.w-42-gap*4)/5),ch=cw*1.45;
  const span=cw*5+gap*4,start=(m.w-span)/2;
  players.forEach((p,i)=>{
   const el=cards.current[i];if(!el)return;
   const match=p.team===target,rank=i%5;
   const x=match?start+rank*(cw+gap):m.cx-m.cw/2;
   const y=match?m.cy-ch/2+(i===pick?(m.mobile?-10:-22):0):m.cy-ch/2;
   el.style.transition='transform 1100ms cubic-bezier(.19,1,.22,1),opacity 750ms ease,width 1100ms cubic-bezier(.19,1,.22,1),height 1100ms cubic-bezier(.19,1,.22,1),filter 700ms ease';
   el.style.width=cw+'px';el.style.height=ch+'px';
   el.style.transform='translate3d('+x+'px,'+y+'px,0) scale('+(match?(i===pick?1.07:1):.25)+') rotate(0deg)';
   el.style.opacity=match?'1':'.055';
   el.style.filter=match?'brightness(1)':'brightness(.2)';
   el.style.pointerEvents=match?'auto':'none';
   el.style.zIndex=match?String(200+rank):'2';
   el.classList.toggle('is-selected',i===pick);
  });
 },[]);
 const choose=useCallback((i:number)=>{
  if(moved.current)return;
  setSelected(i);setTeam(players[i].team);setFocused(players[i].team);
  mode.current=players[i].team;returning.current=false;
  requestAnimationFrame(()=>applyTeam(players[i].team,i));
 },[applyTeam]);
 const pickTeam=useCallback((n:number)=>{
  const i=n*5;setSelected(i);setTeam(n);setFocused(n);mode.current=n;returning.current=false;
  requestAnimationFrame(()=>applyTeam(n,i));
 },[applyTeam]);
 const back=useCallback(()=>{
  setFocused(null);mode.current=null;returning.current=true;applyGlobe(true);
  window.setTimeout(()=>{returning.current=false;},1140);
 },[applyGlobe]);
 useEffect(()=>{speedRef.current=speed;},[speed]);
 useEffect(()=>{playingRef.current=playing;},[playing]);
 useEffect(()=>{
  applyGlobe(true);
  let id=0,last=0;let alive=true;
  const tick=(now:number)=>{
   if(!alive)return;id=requestAnimationFrame(tick);
   if(now-last<25)return;
   const dt=Math.min(60,now-last||25);last=now;
   if(mode.current!==null||returning.current)return;
   if(playingRef.current&&!drag.current)orientation.current.yaw+=dt*.00017*(speedRef.current/35);
   applyGlobe();
  };
  id=requestAnimationFrame(tick);
  const resized=()=>{
   if(mode.current===null)applyGlobe(true);else applyTeam(mode.current,Number(stage.current?.dataset.selected||3));
  };
  window.addEventListener('resize',resized);
  return()=>{alive=false;cancelAnimationFrame(id);window.removeEventListener('resize',resized);};
 },[applyGlobe,applyTeam]);
 useEffect(()=>{if(stage.current)stage.current.dataset.selected=String(selected);},[selected]);
 const down=(e:React.PointerEvent<HTMLDivElement>)=>{if(mode.current!==null)return;drag.current={x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY};moved.current=false;};
 const move=(e:React.PointerEvent<HTMLDivElement>)=>{
  if(!drag.current||mode.current!==null)return;
  const d=drag.current;const dx=e.clientX-d.x,dy=e.clientY-d.y;
  if(Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>5)moved.current=true;
  d.x=e.clientX;d.y=e.clientY;
  orientation.current.yaw+=dx*.007;
  orientation.current.pitch=Math.max(-.8,Math.min(.8,orientation.current.pitch-dy*.005));
  applyGlobe();
 };
 const up=()=>{drag.current=null;window.setTimeout(()=>{moved.current=false;},80);};
 return <div className="gold-page">
  <header className="gold-header">
   <a className="gold-brand" href="/"><img src="/ee-official-emblem-v2.png" alt="Exalted Era emblem"/><span><b>EXALTED ERA</b><small>THE SPHERE / GOLD EDITION</small></span></a>
   <div className="gold-top-status"><span className="gold-status-dot"/> SPHERE EXPERIENCE <span className="gold-divider">/</span> 20 OFFICIAL MEMBERS</div>
   <a className="gold-home" href="/">RETURN TO WEBSITE ↗</a>
  </header>
  <main className="gold-layout">
   <section className={'gold-stage '+(focused!==null?'in-focus':'')} aria-label="Interactive 3D sphere with 20 player cards">
    <div className="gold-stage-kicker">EXALTED ERA <i/> INTERACTIVE ROSTER</div>
    <div className="gold-title"><span>THE</span> SPHERE <em>20</em></div>
    <div className="gold-orbit gold-orbit-1"/><div className="gold-orbit gold-orbit-2"/><div className="gold-orbit gold-orbit-3"/>
    <div className="gold-core"><img src="/ee-official-emblem-v2.png" alt=""/></div>
    <div className="gold-card-stage" ref={stage} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onPointerLeave={up}>
     {players.map((p,i)=><button key={p.id} ref={el=>{cards.current[i]=el;}} type="button" className="gold-player-card" title={p.name+' — Team '+pad(p.team+1)} aria-label={'Select '+p.name+' and show Team '+pad(p.team+1)} onClick={()=>choose(i)}>
      <span className="gold-frame"><span className="gold-card-meta">EE <span>{pad(i+1)} / 20</span></span><span className="gold-portrait"><Portrait player={p}/></span><span className="gold-card-bottom"><b>{p.name}</b><small>TEAM {pad(p.team+1)}</small></span></span>
     </button>)}
    </div>
    {focused!==null&&<><button type="button" className="gold-back" onClick={back}>← BACK TO SPHERE</button><div className="gold-focus-title"><small>EXALTED ERA / THE SELECTED FIVE</small><strong>TEAM {pad(focused+1)}</strong><span>FIVE PLAYERS · ONE ERA</span></div></>}
    <div className="gold-stage-footer"><span><b>20</b> OFFICIAL MEMBERS <i/> FOUR TEAMS</span><span>{focused===null?'DRAG TO ROTATE · SELECT A PLAYER':'TEAM FOCUS · SELECT A TEAMMATE'}</span></div>
   </section>
   <aside className="gold-panel">
    <div className="gold-panel-crest">✦</div><div className="gold-panel-kicker">EXALTED ERA / THE COLLECTIVE</div>
    <h1>{focused===null?'SELECT A PLAYER':'THE SELECTED FIVE'}</h1>
    <div className="gold-subtitle">{focused===null?'VIEW THEIR TEAM':'ONE TEAM · ONE ERA'}</div>
    <div className="gold-rule"><span/></div>
    <div className="gold-team-tabs" aria-label="Choose team">{Array.from({length:4},(_,i)=><button type="button" key={i} aria-pressed={panelTeam===i} onClick={()=>focused===null?setTeam(i):pickTeam(i)}>TEAM {pad(i+1)}</button>)}</div>
    <div className="gold-thumbs">{players.slice(panelTeam*5,panelTeam*5+5).map(p=><button key={p.id} type="button" aria-label={'Select '+p.name} className={selected===p.id?'gold-active':''} onClick={()=>choose(p.id)}><Portrait player={p}/><span>{pad(p.id+1)}</span></button>)}</div>
    <div className="gold-team-name">TEAM {pad(panelTeam+1)}</div><div className="gold-team-desc">05 MEMBERS / 01 TEAM</div>
    <button type="button" className="gold-cta" onClick={()=>focused===null?pickTeam(team):back()}>{focused===null?'VIEW TEAM':'RETURN TO SPHERE'} <span>{focused===null?'→':'↩'}</span></button>
    <p className="gold-help">{focused===null?'Drag to rotate. Click any portrait and its teammates will glide forward into a horizontal lineup.':'Click a teammate to highlight them, select another team above, or return to the rotating globe.'}</p>
    <div className="gold-motion"><span>ROTATION SPEED</span><input type="range" min="0" max="100" step="5" value={speed} onChange={e=>setSpeed(Number(e.target.value))} aria-label="Rotation speed"/><b>{speed}%</b></div>
    <button type="button" className="gold-pause" onClick={()=>setPlaying(!playing)}>{playing?'❚❚ PAUSE ROTATION':'▶ RESUME ROTATION'}</button>
    <div className="gold-panel-footer">THE ERA IS HERE. THE EXALTED ENTERS.</div>
   </aside>
  </main>
 </div>;
}
