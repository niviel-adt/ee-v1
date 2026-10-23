import {useRef} from 'react';
import {motion,useReducedMotion,useScroll,useTransform} from 'motion/react';
import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {Star} from './Brand';
import {Starfield} from './Starfield';
import {Counter,Magnetic,Marquee,SplitHeading} from './fx';
import {stats} from '../data/stats';

const ease=[0.22,1,0.36,1] as const;

export function Hero(){
 const ref=useRef<HTMLElement>(null);const reduced=useReducedMotion();
 const {scrollYProgress}=useScroll({target:ref,offset:['start start','end start']});
 const artY=useTransform(scrollYProgress,[0,1],['0%',reduced?'0%':'18%']);
 const copyY=useTransform(scrollYProgress,[0,1],['0%',reduced?'0%':'-12%']);
 const fade=useTransform(scrollYProgress,[0,.8],[1,reduced?1:.15]);
 return <>
 <section ref={ref} className="hero" id="home" onPointerMove={e=>{if(reduced||e.pointerType!=='mouse')return;const box=e.currentTarget.getBoundingClientRect();const x=(e.clientX-box.left)/box.width,y=(e.clientY-box.top)/box.height;e.currentTarget.style.setProperty('--px',`${x*100}%`);e.currentTarget.style.setProperty('--py',`${y*100}%`);e.currentTarget.style.setProperty('--dx',`${(x-.5)*24}px`);e.currentTarget.style.setProperty('--dy',`${(y-.5)*24}px`)}} onPointerLeave={()=>{ref.current?.style.setProperty('--dx','0px');ref.current?.style.setProperty('--dy','0px')}}>
  <Starfield className="hero-stars"/>
  <div className="hero-spotlight" aria-hidden="true"/>
  <div className="hero-grid" aria-hidden="true"/>
  <motion.div className="hero-art" style={{y:artY}} aria-hidden="true">
   <div className="hero-art-inner">
    <motion.div className="orbit" initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{duration:1.6,ease}}/>
    <motion.div className="orbit second" initial={{opacity:0,scale:.85}} animate={{opacity:1,scale:1}} transition={{duration:1.6,delay:.15,ease}}/>
    <div className="orbit-ring"><i/><i/><i/></div>
    <div className="hero-halo"/>
    <motion.div className="hero-star-wrap" initial={{opacity:0,scale:.9,rotate:-8}} animate={{opacity:1,scale:1,rotate:0}} transition={{duration:1.8,ease}}><Star className="hero-star"/></motion.div>
   </div>
   <span className="art-caption">DISCIPLINE / AMBITION / EXCELLENCE</span>
  </motion.div>
  <motion.div className="hero-content" style={{y:copyY,opacity:fade}}>
   <motion.div className="eyebrow" initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.7,ease}}><i/>VALORANT MOBILE · ESPORTS & COMMUNITY</motion.div>
   <motion.p className="hero-name" initial={{opacity:0,letterSpacing:'.2em'}} animate={{opacity:1,letterSpacing:'.62em'}} transition={{duration:1.4,delay:.1,ease}}>EXALTED ERA</motion.p>
   <SplitHeading as="h1" immediate delay={.2} lines={['BEYOND THE',{text:'ORDINARY.',accent:true}]}/>
   <motion.p className="hero-description" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.55,ease}}>A collective built on discipline, ambition, and the relentless pursuit of excellence. This is our era.</motion.p>
   <motion.div className="hero-actions" initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:.8,delay:.7,ease}}>
    <Magnetic><a className="button button-glow" href="#players">Explore Our Roster <ArrowUpRight size={17}/></a></Magnetic>
    <a className="text-link" href="#about">Discover Our Story <ArrowUpRight size={15}/></a>
   </motion.div>
  </motion.div>
  <motion.div className="hero-bottom" initial={{opacity:0}} animate={{opacity:1}} transition={{duration:1,delay:1}}>
   <span>THE ERA IS HERE. THE EXALTED ENTERS.</span>
   <a href="#about" className="scroll-cue">SCROLL TO EXPLORE <span className="scroll-line" aria-hidden="true"><ArrowDown size={14}/></span></a>
   <span className="edition">BLACKSTAR — VOL. 01</span>
  </motion.div>
 </section>
 <section className="stats-band" aria-label="Exalted Era at a glance">
  <dl className="stats">{stats.map((s,i)=><motion.div key={s.label} className="stat" initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.5}} transition={{duration:.7,delay:i*.08,ease}}><dt>{s.label}</dt><dd><Counter value={s.value}/></dd></motion.div>)}</dl>
  <Marquee items={['DISCIPLINE','AMBITION','EXCELLENCE','CHARACTER','TOGETHERNESS','BEYOND THE ORDINARY']}/>
 </section>
 </>;
}
