import {useEffect,useState} from 'react';
import {ArrowUp} from 'lucide-react';
export function BackToTop(){
 const [visible,setVisible]=useState(false);
 useEffect(()=>{const update=()=>setVisible(window.scrollY>=360);update();addEventListener('scroll',update,{passive:true});return()=>removeEventListener('scroll',update);},[]);
 return <button className="back-to-top" type="button" aria-label="Back to top" title="Back to top" hidden={!visible} onClick={()=>{window.scrollTo({top:0,behavior:'instant'});document.querySelector<HTMLAnchorElement>('.brand')?.focus({preventScroll:true});setVisible(false);}}><ArrowUp size={19}/></button>;
}
