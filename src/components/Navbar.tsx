import {useEffect,useRef,useState} from 'react';
import {AnimatePresence,motion} from 'motion/react';
import {Menu,X,ArrowUpRight} from 'lucide-react';
import {navigation,site} from '../data/site';
import {Brand} from './Brand';

export function Navbar(){
 const [open,setOpen]=useState(false),[active,setActive]=useState('home'),[progress,setProgress]=useState(0),[scrolled,setScrolled]=useState(false);
 const menuButton=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null);
 useEffect(()=>{let pending=false;const update=()=>{const y=window.scrollY;setScrolled(y>24);setProgress(y/Math.max(1,document.documentElement.scrollHeight-innerHeight));let id='home';for(const [,key] of navigation){const el=document.getElementById(key);if(el&&el.getBoundingClientRect().top<=150)id=key;}setActive(id);pending=false;};const scroll=()=>{if(!pending){pending=true;requestAnimationFrame(update)}};update();addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);return()=>{removeEventListener('scroll',scroll);removeEventListener('resize',scroll)}},[]);
 useEffect(()=>{
  if(!open)return;
  const old=document.body.style.overflow;document.body.style.overflow='hidden';
  const focusFirst=setTimeout(()=>panel.current?.querySelector<HTMLAnchorElement>('a')?.focus(),60);
  const key=(e:KeyboardEvent)=>{
   if(e.key==='Escape'){setOpen(false);menuButton.current?.focus();return}
   if(e.key==='Tab'&&panel.current&&menuButton.current){const f=[menuButton.current,...panel.current.querySelectorAll<HTMLElement>('a')];const i=f.indexOf(document.activeElement as HTMLElement);if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}
  };
  const wide=()=>{if(innerWidth>900)setOpen(false)};
  addEventListener('keydown',key);addEventListener('resize',wide);
  return()=>{clearTimeout(focusFirst);document.body.style.overflow=old;removeEventListener('keydown',key);removeEventListener('resize',wide)};
 },[open]);
 return <header className={`nav ${scrolled?'is-scrolled':''} ${open?'menu-open':''}`}>
  <div className="nav-inner">
   <Brand/>
   <nav aria-label="Main navigation" className="nav-links">
    {navigation.map(([label,id])=><a key={id} href={`#${id}`} aria-current={id===active?'location':undefined}>{id===active&&<motion.span layoutId="nav-pill" className="nav-pill" transition={{type:'spring',stiffness:420,damping:34}}/>}<span>{label}</span></a>)}
    <a href="/scrims"><span>Scrim Tracker</span></a>
    <a href="/recruitment"><span>Recruitment</span></a>
   </nav>
   <a className="nav-contact" href="/recruitment"><span className="live-dot" aria-hidden="true"/>JOIN THE ERA <ArrowUpRight size={14}/></a>
   <button ref={menuButton} className="menu" aria-controls="mobile-navigation" aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button>
  </div>
  <div className="scroll-progress" aria-hidden="true" style={{transform:`scaleX(${progress})`}}/>
  <AnimatePresence>
   {open&&<motion.div ref={panel} id="mobile-navigation" className="mobile-menu" initial={{opacity:0,clipPath:'inset(0 0 100% 0)'}} animate={{opacity:1,clipPath:'inset(0 0 0% 0)'}} exit={{opacity:0,clipPath:'inset(0 0 100% 0)'}} transition={{duration:.45,ease:[0.22,1,0.36,1]}}>
    <nav aria-label="Mobile navigation">
     <motion.ol initial="hidden" animate="show" variants={{hidden:{},show:{transition:{staggerChildren:.05,delayChildren:.12}}}}>
      {[...navigation,['Scrim Tracker','/scrims'],['Recruitment','/recruitment']].map(([label,id],i)=><motion.li key={id} variants={{hidden:{opacity:0,y:24},show:{opacity:1,y:0}}}><a href={id.startsWith('/')?id:`#${id}`} aria-current={id===active?'location':undefined} onClick={()=>setOpen(false)}><small>{String(i+1).padStart(2,'0')}</small>{label}</a></motion.li>)}
     </motion.ol>
    </nav>
    <div className="mobile-menu-foot"><a href={site.discordUrl} target="_blank" rel="noopener noreferrer">Discord <ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a><a href={site.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook <ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a></div>
   </motion.div>}
  </AnimatePresence>
 </header>;
}
