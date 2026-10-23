import {useEffect,useRef,useState,type CSSProperties,type ElementType,type PointerEvent as ReactPointerEvent,type ReactNode} from 'react';
import {animate,motion,useInView,useReducedMotion} from 'motion/react';

const ease=[0.22,1,0.36,1] as const;

/** Fades and lifts content into view once. */
export function Reveal({children,className='',delay=0,y=28,as='div'}:{children:ReactNode;className?:string;delay?:number;y?:number;as?:'div'|'section'|'article'|'li'}){
 const Comp=motion[as] as typeof motion.div;
 return <Comp className={className} initial={{opacity:0,y}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} transition={{duration:.8,delay,ease}}>{children}</Comp>;
}

/** Container whose direct <StaggerItem> children cascade into view. */
export function Stagger({children,className='',gap=.09,amount=.15}:{children:ReactNode;className?:string;gap?:number;amount?:number}){
 return <motion.div className={className} initial="hidden" whileInView="show" viewport={{once:true,amount}} variants={{hidden:{},show:{transition:{staggerChildren:gap}}}}>{children}</motion.div>;
}
export function StaggerItem({children,className='',style}:{children:ReactNode;className?:string;style?:CSSProperties}){
 return <motion.div className={className} style={style} variants={{hidden:{opacity:0,y:32},show:{opacity:1,y:0,transition:{duration:.75,ease}}}}>{children}</motion.div>;
}

/** Headline whose lines slide up from behind a mask. Pass lines as an array; use {accent:true} for the muted line. */
export function SplitHeading({lines,as='h2',className='',id,delay=0,immediate=false}:{lines:(string|{text:string;accent?:boolean})[];as?:'h1'|'h2';className?:string;id?:string;delay?:number;immediate?:boolean}){
 const Tag=as as ElementType;
 const label=lines.map(l=>typeof l==='string'?l:l.text).join(' ');
 const trigger=immediate?{animate:'show'}:{whileInView:'show',viewport:{once:true,amount:.4}};
 return <Tag className={`split-heading ${className}`} id={id} aria-label={label}>
  <motion.span aria-hidden="true" className="split-lines" initial="hidden" {...trigger} variants={{hidden:{},show:{transition:{staggerChildren:.1,delayChildren:delay}}}}>
   {lines.map((l,i)=>{const t=typeof l==='string'?{text:l}:l;return <span className="split-mask" key={i}><motion.span className={`split-line ${t.accent?'accent':''}`} variants={{hidden:{y:'110%'},show:{y:'0%',transition:{duration:.95,ease}}}}>{t.text}</motion.span></span>})}
  </motion.span>
 </Tag>;
}

const finePointer=()=>typeof window!=='undefined'&&window.matchMedia('(hover: hover) and (pointer: fine)').matches;

/** 3D tilt with a cursor-following glow. Inert on touch devices and with reduced motion. */
export function TiltCard({children,className='',max=7,as='div',...rest}:{children:ReactNode;className?:string;max?:number;as?:'div'|'article'|'a';href?:string;target?:string;rel?:string;'aria-label'?:string}){
 const ref=useRef<HTMLElement>(null);const reduced=useReducedMotion();
 const move=(e:ReactPointerEvent<HTMLElement>)=>{
  const el=ref.current;if(!el||e.pointerType!=='mouse')return;
  const r=el.getBoundingClientRect(),px=(e.clientX-r.left)/r.width,py=(e.clientY-r.top)/r.height;
  el.style.setProperty('--gx',`${px*100}%`);el.style.setProperty('--gy',`${py*100}%`);
  if(!reduced&&finePointer()){el.style.setProperty('--rx',`${(.5-py)*max}deg`);el.style.setProperty('--ry',`${(px-.5)*max}deg`)}
 };
 const leave=()=>{const el=ref.current;if(!el)return;el.style.setProperty('--rx','0deg');el.style.setProperty('--ry','0deg')};
 const Tag=as as ElementType;
 return <Tag ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={leave} {...rest}><span className="tilt-glow" aria-hidden="true"/>{children}</Tag>;
}

/** Element that leans toward the cursor. */
export function Magnetic({children,strength=.25}:{children:ReactNode;strength?:number}){
 const ref=useRef<HTMLSpanElement>(null);const reduced=useReducedMotion();
 return <span ref={ref} className="magnetic" onPointerMove={e=>{if(reduced||e.pointerType!=='mouse'||!ref.current)return;const r=ref.current.getBoundingClientRect();ref.current.style.transform=`translate(${(e.clientX-r.left-r.width/2)*strength}px,${(e.clientY-r.top-r.height/2)*strength}px)`}} onPointerLeave={()=>{if(ref.current)ref.current.style.transform=''}}>{children}</span>;
}

/** Counts up to a real value when scrolled into view. */
export function Counter({value,pad=2,duration=1.6}:{value:number;pad?:number;duration?:number}){
 const ref=useRef<HTMLSpanElement>(null);const inView=useInView(ref,{once:true,amount:.6});const reduced=useReducedMotion();
 const [shown,setShown]=useState(reduced?value:0);
 useEffect(()=>{if(!inView)return;if(reduced){setShown(value);return}const c=animate(0,value,{duration,ease:[0.16,1,0.3,1],onUpdate:v=>setShown(Math.round(v))});return()=>c.stop()},[inView,reduced,value,duration]);
 return <span ref={ref} className="counter"><span aria-hidden="true">{String(shown).padStart(pad,'0')}</span><span className="sr-only">{value}</span></span>;
}

/** Endless ticker of words; pauses on hover; static with reduced motion. */
export function Marquee({items}:{items:string[]}){
 const row=<div className="marquee-row" aria-hidden="true">{items.map((t,i)=><span key={i}>{t}<i/></span>)}</div>;
 return <div className="marquee" role="presentation">{row}{row}</div>;
}
