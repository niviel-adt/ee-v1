import {useEffect,useRef} from 'react';
import {teams} from '../data/teams';
import markup from './constellation/markup.html?raw';
import styles from './constellation/style.css?inline';
import {mountConstellation} from './constellation/runtime.js';

export function PlayersSection(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!host.current)return;
  const shadow=host.current.shadowRoot||host.current.attachShadow({mode:'open'});
  shadow.innerHTML=`<style>${styles}</style>${markup}`;
  const cleanup=mountConstellation(shadow,teams);
  return ()=>{cleanup();shadow.replaceChildren()};
 },[]);
 return <section id="players" aria-label="Exalted Era player constellations" style={{borderTop:'1px solid var(--line)'}}><div ref={host}/></section>;
}
