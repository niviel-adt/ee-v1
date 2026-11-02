import React from 'react';
import sphereGoldHtml from '../data/SphereGoldHtml';

/** Embed the approved Gold Edition directly, bypassing Railway static-server clean-URL rewrites. */
export function SpherePage(){
 return <iframe
  title="Exalted Era — The Sphere Gold Edition"
  srcDoc={sphereGoldHtml}
  style={{position:'fixed',inset:0,width:'100vw',height:'100dvh',border:0,display:'block',background:'#050505'}}
  allow="fullscreen"
 />;
}
