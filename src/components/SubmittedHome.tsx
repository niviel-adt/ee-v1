import {useEffect,useRef} from 'react';
import {teams} from '../data/teams';
import {staff} from '../data/staff';
import markup from '../submitted/home.html?raw';
import {mountSubmittedHome} from '../submitted/behavior';
import '../submitted/base.css';
import '../submitted/comfort.css';

export function SubmittedHome(){
 const host=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  if(!host.current)return;
  const players=teams.flatMap((team,index)=>team.members.map(player=>({...player,team:index+1})));
  return mountSubmittedHome(host.current,players,staff);
 },[]);
 return <div ref={host} dangerouslySetInnerHTML={{__html:markup}}/>;
}
