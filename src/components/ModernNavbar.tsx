import {useEffect,useRef,useState} from 'react';
import {ArrowUpRight,Menu,X} from 'lucide-react';
import {navigation,site} from '../data/site';
import {Brand} from './Brand';

const links=[...navigation,['Scrim Tracker','/scrims'],['Recruitment','/recruitment']];
const href=(id:string)=>id.startsWith('/')||id.startsWith('https:')?id:`#${id}`;

export function ModernNavbar(){
 const [open,setOpen]=useState(false),[active,setActive]=useState('home');
 const toggle=useRef<HTMLButtonElement>(null),panel=useRef<HTMLDivElement>(null);
 useEffect(()=>{const update=()=>{let id='home';for(const [,key] of navigation){const section=document.getElementById(key);if(section&&section.getBoundingClientRect().top<=160)id=key;}setActive(id);};update();addEventListener('scroll',update,{passive:true});return()=>removeEventListener('scroll',update);},[]);
 useEffect(()=>{
  if(!open)return;
  const overflow=document.body.style.overflow;document.body.style.overflow='hidden';
  panel.current?.querySelector<HTMLAnchorElement>('a')?.focus();
  const key=(event:KeyboardEvent)=>{
   if(event.key==='Escape'){setOpen(false);toggle.current?.focus();}
   if(event.key==='Tab'&&panel.current&&toggle.current){const targets=[toggle.current,...panel.current.querySelectorAll<HTMLAnchorElement>('a')];const index=targets.indexOf(document.activeElement as HTMLButtonElement);if(event.shiftKey&&index<=0){event.preventDefault();targets[targets.length-1].focus();}else if(!event.shiftKey&&index===targets.length-1){event.preventDefault();targets[0].focus();}}
  };
  const resize=()=>{if(innerWidth>900)setOpen(false);};
  addEventListener('keydown',key);addEventListener('resize',resize);
  return()=>{document.body.style.overflow=overflow;removeEventListener('keydown',key);removeEventListener('resize',resize);};
 },[open]);
 const items=links.map(([label,id])=><a key={id} href={href(id)} aria-current={id===active?'location':undefined} onClick={()=>setOpen(false)}>{label}</a>);
 return <header className={`nav modern-nav ${open?'menu-open':''}`}><div className="nav-inner"><Brand/><div className="modern-nav-actions"><a className="text-link modern-tracker-link" href="/scrims">Scrim tracker <ArrowUpRight size={16}/></a><a className="button" href="/recruitment">Join us <ArrowUpRight size={16}/></a><button ref={toggle} className="menu" aria-controls="mobile-navigation" aria-expanded={open} aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X size={20}/>:<Menu size={20}/>}</button></div></div><nav className="nav-links" aria-label="Main navigation">{items}</nav>{open&&<div className="mobile-menu" id="mobile-navigation" ref={panel}><nav aria-label="Mobile navigation">{items}</nav><div className="mobile-menu-foot"><a href={site.discordUrl} target="_blank" rel="noopener noreferrer">Discord <ArrowUpRight size={14}/></a><a href={site.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook <ArrowUpRight size={14}/></a></div></div>}</header>;
}
