import {useState,useEffect} from 'react';
import {Menu,X,ArrowUpRight} from 'lucide-react';
import {navigation} from '../data/site';
import {Brand} from './Brand';
export function Navbar(){
 const [open,setOpen]=useState(false),[active,setActive]=useState('home'),[progress,setProgress]=useState(0);
 useEffect(()=>{let pending=false;const update=()=>{const y=window.scrollY;setProgress(y/Math.max(1,document.documentElement.scrollHeight-innerHeight));let id='home';for(const [,key] of navigation){const el=document.getElementById(key);if(el&&el.getBoundingClientRect().top<=150)id=key;}setActive(id);pending=false;};const scroll=()=>{if(!pending){pending=true;requestAnimationFrame(update)}};update();addEventListener('scroll',scroll,{passive:true});addEventListener('resize',scroll);return()=>{removeEventListener('scroll',scroll);removeEventListener('resize',scroll)}},[]);
 useEffect(()=>{if(!open)return;const close=(e:KeyboardEvent)=>{if(e.key==='Escape'){setOpen(false);document.querySelector<HTMLButtonElement>('.menu')?.focus()}};addEventListener('keydown',close);return()=>removeEventListener('keydown',close)},[open]);
 return <header className="nav"><Brand/><nav id="main-navigation" aria-label="Main navigation" className={`nav-links ${open?'open':''}`}>{navigation.map(([label,id])=><a key={id} href={`#${id}`} aria-current={id===active?'location':undefined} onClick={()=>setOpen(false)}>{label}</a>)}</nav><a className="nav-contact" href="#contact">ENTER THE ERA <ArrowUpRight size={14}/></a><button className="menu" aria-controls="main-navigation" aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><div className="scroll-progress" aria-hidden="true" style={{transform:`scaleX(${progress})`}}/></header>
}
