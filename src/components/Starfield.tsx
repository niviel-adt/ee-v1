import {useEffect,useRef} from 'react';

/** Lightweight canvas starfield with twinkle and pointer parallax. Pauses off-screen, renders a single static frame with reduced motion. */
export function Starfield({className='',density=7000}:{className?:string;density?:number}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  type S={x:number;y:number;z:number;r:number;t:number;s:number};
  let stars:S[]=[],w=0,h=0,raf=0,visible=true,mx=0,my=0,tx=0,ty=0,shoot:{x:number;y:number;vx:number;vy:number;life:number}|null=null;
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,2);const r=canvas.getBoundingClientRect();w=r.width;h=r.height;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
   const n=Math.min(260,Math.round(w*h/density));stars=Array.from({length:n},()=>({x:Math.random()*w,y:Math.random()*h,z:Math.random()*.9+.1,r:Math.random()*1.15+.25,t:Math.random()*Math.PI*2,s:Math.random()*.02+.004}));if(reduced)draw(0)};
  const draw=(time:number)=>{
   ctx.clearRect(0,0,w,h);tx+=(mx-tx)*.04;ty+=(my-ty)*.04;
   for(const s of stars){const a=reduced?.55*s.z+.15:(.35+.65*(Math.sin(s.t+time*s.s*.06)*.5+.5))*s.z;const x=s.x+tx*s.z*18,y=s.y+ty*s.z*18;
    ctx.globalAlpha=a;ctx.fillStyle=s.z>.8?'#dfe7f5':'#f2f0e9';ctx.beginPath();ctx.arc(x,y,s.r*(s.z>.85?1.4:1),0,Math.PI*2);ctx.fill();
    if(s.z>.93){ctx.globalAlpha=a*.25;ctx.beginPath();ctx.arc(x,y,s.r*4,0,Math.PI*2);ctx.fill()}}
   if(!reduced){if(!shoot&&Math.random()<.0025)shoot={x:Math.random()*w*.7,y:Math.random()*h*.4,vx:5+Math.random()*3,vy:2+Math.random()*1.5,life:1};
    if(shoot){const g=ctx.createLinearGradient(shoot.x,shoot.y,shoot.x-shoot.vx*14,shoot.y-shoot.vy*14);g.addColorStop(0,`rgba(242,240,233,${.8*shoot.life})`);g.addColorStop(1,'rgba(242,240,233,0)');ctx.globalAlpha=1;ctx.strokeStyle=g;ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(shoot.x,shoot.y);ctx.lineTo(shoot.x-shoot.vx*14,shoot.y-shoot.vy*14);ctx.stroke();shoot.x+=shoot.vx;shoot.y+=shoot.vy;shoot.life-=.012;if(shoot.life<=0||shoot.x>w||shoot.y>h)shoot=null}}
   ctx.globalAlpha=1;
  };
  const loop=(t:number)=>{if(visible&&!document.hidden)draw(t);raf=requestAnimationFrame(loop)};
  const onMove=(e:PointerEvent)=>{if(e.pointerType!=='mouse')return;mx=(e.clientX/innerWidth-.5)*-1;my=(e.clientY/innerHeight-.5)*-1};
  const io=new IntersectionObserver(([e])=>{visible=e.isIntersecting});io.observe(canvas);
  const ro=new ResizeObserver(resize);ro.observe(canvas);resize();
  if(!reduced){raf=requestAnimationFrame(loop);addEventListener('pointermove',onMove,{passive:true})}
  return()=>{cancelAnimationFrame(raf);io.disconnect();ro.disconnect();removeEventListener('pointermove',onMove)};
 },[density]);
 return <canvas ref={ref} className={`starfield ${className}`} aria-hidden="true"/>;
}
