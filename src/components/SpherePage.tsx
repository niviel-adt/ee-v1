import React from 'react';
import sphereGoldHtml from '../data/SphereGoldHtml';
import {teams} from '../data/teams';

const members=teams.flatMap(team=>team.members);
const roster=Array.from({length:20},(_,i)=>({
 name:members[i]?.name||'PLAYER '+String(i+1).padStart(2,'0'),
 image:members[i]?.image||''
}));
const html=sphereGoldHtml.replace('__SPHERE_ROSTER__',JSON.stringify(roster).replace(/</g,'\\u003c'));

/** The Sphere Gold Edition uses confirmed website roster portraits and names. */
export function SpherePage(){
 return <iframe title="Exalted Era — The Sphere Gold Edition" srcDoc={html} style={{position:'fixed',inset:0,width:'100vw',height:'100dvh',border:0,display:'block',background:'#050505'}} allow="fullscreen"/>;
}
