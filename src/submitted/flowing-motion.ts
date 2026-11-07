export function mountFlowingGold(root: HTMLElement) {
 const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
 const progress=document.createElement('div');progress.className='ee-scroll-progress';document.body.appendChild(progress);
 const nodes=Array.from(root.querySelectorAll<HTMLElement>('.about-grid,.purpose-grid,.roster-header,.player-card,.people-grid,.staff-row,.news-heading,.news-story,.highlights-grid,.highlight-link,.join-main'));
 const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
  if(entry.isIntersecting){entry.target.classList.add('ee-visible');observer.unobserve(entry.target);}
 }),{threshold:.08,rootMargin:'0px 0px 50px 0px'});
 if(!reduce.matches)nodes.forEach(el=>{el.setAttribute('data-ee-reveal','');observer.observe(el);});
 const logo=root.querySelector<HTMLElement>('.hero-art');
 const hero=root.querySelector<HTMLElement>('.hero');
 const lines=Array.from({length:6},(_,i)=>{
  const line=document.createElement('i');
  line.className='ee-flow-line';
  line.style.setProperty('--i',String(i));
  hero?.appendChild(line);return line;
 });
 let frame=0;
 const update=()=>{
  frame=0;const total=Math.max(1,document.documentElement.scrollHeight-innerHeight);
  progress.style.transform=`scaleX(${Math.min(1,Math.max(0,scrollY/total))})`;
  if(reduce.matches||!logo||!hero)return;
  const rect=hero.getBoundingClientRect();const fraction=Math.max(0,Math.min(1,-rect.top/Math.max(1,hero.clientHeight)));
  logo.style.setProperty('--ee-scroll',String(fraction));
  lines.forEach((line,i)=>line.style.setProperty('--ee-drift',`${(fraction*(i%2===0?1:-1)*80).toFixed(1)}px`));
 };
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update);};
 window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule);update();
 const onTeams=()=>{if(reduce.matches)return;root.querySelectorAll<HTMLElement>('.player-card').forEach((card,i)=>{
  card.animate([{opacity:0,transform:'translateY(25px)'},{opacity:1,transform:'translateY(0)'}],{duration:670,delay:i*85,easing:'cubic-bezier(.2,.7,.2,1)'});
 });};
 root.querySelectorAll('[data-team]').forEach(tab=>tab.addEventListener('click',onTeams));
 return ()=>{window.removeEventListener('scroll',schedule);window.removeEventListener('resize',schedule);if(frame)cancelAnimationFrame(frame);observer.disconnect();progress.remove();lines.forEach(l=>l.remove());root.querySelectorAll('[data-team]').forEach(tab=>tab.removeEventListener('click',onTeams));};
}
