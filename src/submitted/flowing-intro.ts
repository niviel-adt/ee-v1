export function mountFlowingIntro(root: HTMLElement) {
 const main=root.querySelector('main');
 const legacyHero=root.querySelector<HTMLElement>('#home');
 if(!main||!legacyHero)return()=>{};
 legacyHero.id='ee-legacy-home';
 root.classList.add('ee8-active');
 const section=document.createElement('div');
 section.className='ee8-experience';
 section.innerHTML=String.raw\`
 <section class="ee8-hero" id="home" aria-label="Exalted Era introduction">
  <div class="ee8-sticky">
   <div class="ee8-grid"></div><div class="ee8-ring" aria-hidden="true"></div>
   <svg class="ee8-filament" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="ee8-gold"><stop stop-color="#74502c"/><stop offset=".45" stop-color="#f1d39c"/><stop offset="1" stop-color="#76502d"/></linearGradient></defs>
    <path d="M -80 620 C 270 340,350 720,700 450 S 1180 140,1510 390" pathLength="1"/>
    <path d="M -80 300 C 220 570,355 150,720 430 S 1215 790,1500 560" pathLength="1"/>
    <path class="ee8-ghost" d="M -120 670 C 280 410,365 800,700 480 S 1160 200,1510 445" pathLength="1"/>
    <path class="ee8-ghost" d="M -100 250 C 240 510,310 90,720 410 S 1220 740,1480 510" pathLength="1"/>
   </svg>
   <div class="ee8-emblem"><div class="ee8-glow"></div><img src="/ee-official-emblem-v2.png" alt="Exalted Era emblem"></div>
   <span class="ee8-toplabel">EST. MMXXVI &nbsp; / &nbsp; THE SPHERE</span>
   <span class="ee8-rightlabel">A LEGACY FORGED IN MOTION</span>
   <div class="ee8-caption"><span>AN ERA OF EXCELLENCE</span><h1>Beyond <em>ordinary.</em></h1></div>
   <a class="ee8-cue" href="#about">SCROLL TO DISCOVER <span aria-hidden="true">↓</span></a>
  </div>
 </section>
 <section class="ee8-chapter" id="ee8-philosophy">
  <div class="ee8-wrap"><p class="ee8-meta">01 &nbsp; / &nbsp; THE PHILOSOPHY</p>
   <h2>Not simply a team.<br>A <em>standard</em> to uphold.<br>A legacy to <em>become.</em></h2>
   <div class="ee8-chapter-bottom"><p>An elite competitive community shaped by discipline, artistry, and ambition. Every detail is purposeful. Every place is earned.</p><span>THE ERA IS HERE.<br><i>The exalted enters.</i></span></div>
  </div>
 </section>
 <section class="ee8-interlude" aria-label="The Sphere">
  <div class="ee8-interlude-pin">
   <svg viewBox="0 0 1500 900" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
    <defs><linearGradient id="ee8-ribbon"><stop stop-color="#3a2413"/><stop offset=".5" stop-color="#ecc88b"/><stop offset="1" stop-color="#50351a"/></linearGradient></defs>
    <path d="M-150 540 Q320 100 750 445 T1650 250" pathLength="1"/>
    <path d="M-150 550 Q320 120 750 450 T1650 260" pathLength="1"/>
    <path d="M-150 560 Q320 140 750 455 T1650 270" pathLength="1"/>
    <path d="M-150 570 Q320 160 750 460 T1650 280" pathLength="1"/>
    <path d="M-150 580 Q320 180 750 465 T1650 290" pathLength="1"/>
   </svg>
   <div class="ee8-sphere-copy"><span>TWENTY PLACES. ONE LEGACY.</span><h2>The <em>Sphere.</em></h2><p>WHERE DEDICATION BECOMES DISTINCTION</p><a href="/sphere">ENTER THE SPHERE ↗</a></div>
  </div>
 </section>\`;
 main.insertBefore(section,legacyHero);
 const reveal=Array.from(root.querySelectorAll<HTMLElement>('.ee8-chapter h2,.ee8-chapter-bottom,.ee8-sphere-copy,.roster-header,.player-card,.staff-row,.news-story,.highlight-link,.join-main'));
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ee8-visible');observer.unobserve(e.target)}}),{rootMargin:'0px 0px -30px 0px',threshold:.08});
 reveal.forEach(e=>{e.classList.add('ee8-reveal');observer.observe(e)});
 const hero=section.querySelector<HTMLElement>('.ee8-hero')!;
 const emblem=section.querySelector<HTMLElement>('.ee8-emblem')!;
 const caption=section.querySelector<HTMLElement>('.ee8-caption')!;
 const ring=section.querySelector<HTMLElement>('.ee8-ring')!;
 const strokes=Array.from(section.querySelectorAll<SVGPathElement>('.ee8-filament path'));
 const interlude=section.querySelector<HTMLElement>('.ee8-interlude')!;
 const ribbons=Array.from(section.querySelectorAll<SVGPathElement>('.ee8-interlude path'));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let frame=0;
 const clamp=(x:number)=>Math.max(0,Math.min(1,x));
 const render=()=>{
  frame=0;
  if(reduced.matches)return;
  const h=hero.getBoundingClientRect();
  const p=clamp(-h.top/Math.max(1,hero.offsetHeight-innerHeight));
  emblem.style.transform=\`translate(-50%,-50%) translateY(\${(-p*85).toFixed(1)}px) scale(\${(1-p*.24).toFixed(3)}) rotate(\${(p*5).toFixed(2)}deg)\`;
  caption.style.transform=\`translateY(\${p*75}px)\`;
  caption.style.opacity=String(1-clamp(p*1.35));
  ring.style.transform=\`translate(-50%,-50%) rotate(\${p*160}deg) scale(\${1+p*.15})\`;
  strokes.forEach((path,i)=>{path.style.strokeDashoffset=String(1-clamp(p*1.6-i*.07))});
  const r=interlude.getBoundingClientRect();
  const q=clamp(-r.top/Math.max(1,interlude.offsetHeight-innerHeight));
  ribbons.forEach((path,i)=>path.style.strokeDashoffset=String(1-clamp(q*1.35-i*.05)));
 };
 const tick=()=>{if(!frame)frame=requestAnimationFrame(render)};
 window.addEventListener('scroll',tick,{passive:true});window.addEventListener('resize',tick);
 render();
 return()=>{window.removeEventListener('scroll',tick);window.removeEventListener('resize',tick);if(frame)cancelAnimationFrame(frame);observer.disconnect();section.remove();legacyHero.id='home';root.classList.remove('ee8-active')};
}
