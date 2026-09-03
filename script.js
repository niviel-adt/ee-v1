gsap.registerPlugin(ScrollTrigger);

const portal = document.querySelector('.portal-section');
const portalSticky = document.querySelector('#portalSticky');
const doorWrap = document.querySelector('#doorWrap');
const left = document.querySelector('.crest-left');
const right = document.querySelector('.crest-right');
const intro = document.querySelector('#introCopy');
const hint = document.querySelector('#scrollHint');
const glimpse = document.querySelector('#insideGlimpse');
const line = document.querySelector('#energyLine');
const core = document.querySelector('#energyCore');

// 1) Closed crest
// 2) Scroll zooms toward it
// 3) Energy builds along the center seam
// 4) The crest splits and opens like a door
// 5) Camera pushes through into the real site
const entry = gsap.timeline({
  scrollTrigger:{
    trigger:portal,
    start:'top top',
    end:'bottom bottom',
    scrub:1.15
  }
});

entry
  .to(doorWrap,{scale:1.48,yPercent:1.5,ease:'none',duration:3.15},0)
  .to(intro,{opacity:0,y:-35,ease:'none',duration:1.2},.55)
  .to(hint,{opacity:0,y:18,ease:'none',duration:.8},.7)
  .to(line,{opacity:1,width:3,boxShadow:'0 0 18px #fff4c2,0 0 85px #e5a42c',ease:'none',duration:1.2},1.35)
  .to(core,{opacity:1,scale:2.7,textShadow:'0 0 18px #fff,0 0 90px #e5a42c',ease:'none',duration:1.1},1.35)
  .to(glimpse,{opacity:1,scale:1,ease:'none',duration:.8},1.75)
  .to(left,{xPercent:-58,rotateY:-34,rotateZ:-1.5,ease:'none',duration:2.2},2.05)
  .to(right,{xPercent:58,rotateY:34,rotateZ:1.5,ease:'none',duration:2.2},2.05)
  .to(line,{opacity:0,ease:'none',duration:.6},2.35)
  .to(core,{opacity:0,scale:5,ease:'none',duration:.7},2.45)
  .to(doorWrap,{scale:3.45,ease:'power1.in',duration:1.5},3.4)
  .to(glimpse,{scale:2.35,filter:'blur(0px)',ease:'power1.in',duration:1.45},3.4)
  .to(portalSticky,{opacity:0,ease:'none',duration:.65},4.45);

// Section reveals.
gsap.utils.toArray('.reveal').forEach(el=>{
  gsap.to(el,{opacity:1,y:0,duration:1,ease:'power3.out',scrollTrigger:{trigger:el,start:'top 86%',once:true}});
});

// Card tilt.
document.querySelectorAll('.tilt').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(900px) rotateY(${x*7}deg) rotateX(${y*-7}deg)`;
  });
  card.addEventListener('mouseleave',()=>card.style.transform='perspective(900px) rotateY(0deg) rotateX(0deg)');
});

// Header background after scroll.
const topbar=document.querySelector('#topbar');
window.addEventListener('scroll',()=>topbar.classList.toggle('scrolled',scrollY>50),{passive:true});

// Trailer placeholder.
const modal=document.querySelector('#modal');
document.querySelector('#watchBtn').addEventListener('click',()=>{modal.classList.add('open');modal.setAttribute('aria-hidden','false')});
document.querySelector('#closeModal').addEventListener('click',()=>{modal.classList.remove('open');modal.setAttribute('aria-hidden','true')});


// Galaxy starfield particles.
const canvas=document.querySelector('#embers');
const ctx=canvas.getContext('2d');
let w=0,h=0,dpr=1,particles=[];
const palette=[
  '234,199,109', // gold
  '255,245,220', // warm white
  '146,169,255', // blue
  '191,139,255'  // violet
];
function resize(){
  dpr=Math.min(devicePixelRatio||1,2);w=innerWidth;h=innerHeight;
  canvas.width=w*dpr;canvas.height=h*dpr;canvas.style.width=w+'px';canvas.style.height=h+'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  particles=Array.from({length:Math.min(155,Math.floor(w/9))},()=>({
    x:Math.random()*w,
    y:Math.random()*h,
    r:Math.random()*1.7+.25,
    vy:Math.random()*.14+.015,
    vx:(Math.random()-.5)*.06,
    a:Math.random()*.65+.08,
    tw:Math.random()*Math.PI*2,
    c:palette[Math.floor(Math.random()*palette.length)]
  }));
}
function draw(){
  ctx.clearRect(0,0,w,h);
  for(const p of particles){
    p.y-=p.vy;p.x+=p.vx;p.tw += .02;
    if(p.y<-8){p.y=h+8;p.x=Math.random()*w}
    if(p.x<-8)p.x=w+8;
    if(p.x>w+8)p.x=-8;
    const alpha=p.a*(0.65+Math.sin(p.tw)*0.35);
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(${p.c},${alpha})`;
    ctx.shadowBlur=10;
    ctx.shadowColor=`rgba(${p.c},${alpha*.8})`;
    ctx.fill();
  }
  ctx.shadowBlur=0;
  requestAnimationFrame(draw);
}
resize();draw();window.addEventListener('resize',resize);
