import {useEffect,useMemo,useRef,useState} from 'react';
import {AnimatePresence,motion} from 'motion/react';
import {ArrowUpRight,BookOpen,Check,Link2,X} from 'lucide-react';
import {news,type NewsPost} from '../data/news';
import {site} from '../data/site';
import {Star} from './Brand';
import {Label} from './Sections';
import {Reveal,SplitHeading,TiltCard} from './fx';

const ease=[0.22,1,0.36,1] as const;
const toDate=(date:string)=>new Date(`${date}T00:00:00Z`);
const fmt=(date:string,o:Intl.DateTimeFormatOptions)=>new Intl.DateTimeFormat('en',{...o,timeZone:'UTC'}).format(toDate(date));
const formatDate=(date:string)=>fmt(date,{month:'long',day:'numeric',year:'numeric'});
const shortDate=(date:string)=>fmt(date,{month:'short',day:'numeric',year:'numeric'}).toUpperCase();
/** Reading time derived from the post's own text (~200 words per minute). */
const readTime=(p:NewsPost)=>Math.max(1,Math.round([p.summary,...p.paragraphs].join(' ').split(/\s+/).length/200));
const permalink=(id:string)=>`${window.location.origin}/#${id}`;

function CopyLink({post,className=''}:{post:NewsPost;className?:string}){
 const [copied,setCopied]=useState(false);
 useEffect(()=>{if(!copied)return;const t=setTimeout(()=>setCopied(false),2200);return()=>clearTimeout(t)},[copied]);
 const copy=async()=>{try{await navigator.clipboard.writeText(permalink(post.id));setCopied(true)}catch{window.location.hash=post.id}};
 return <button type="button" className={`news-copy ${copied?'is-copied':''} ${className}`} onClick={copy}>
  {copied?<Check size={14} aria-hidden="true"/>:<Link2 size={14} aria-hidden="true"/>}
  <span aria-live="polite">{copied?'LINK COPIED':'COPY LINK'}</span><span className="sr-only">{copied?'':`: ${post.title}`}</span>
 </button>;
}

function Tag({children}:{children:string}){return <span className="news-tag"><i aria-hidden="true"/>{children}</span>}

function Featured({post,onOpen,isLatest,isTarget}:{post:NewsPost;onOpen:(p:NewsPost,el:HTMLElement)=>void;isLatest:boolean;isTarget:boolean}){
 const d=toDate(post.date);
 return <TiltCard as="article" max={4} className={`news-feature ${isTarget?'is-target':''}`} aria-labelledby={`${post.id}-title`}>
  <span className="news-anchor" id={post.id} aria-hidden="true"/>
  <div className="news-feature-visual" aria-hidden="true">
   <div className="news-orbit"><span/><span/><span/></div>
   <Star className="news-feature-star"/>
   <div className="news-datestamp"><span className="news-day">{String(d.getUTCDate()).padStart(2,'0')}</span><span className="news-month">{fmt(post.date,{month:'short'}).toUpperCase()} / {d.getUTCFullYear()}</span></div>
   <span className="news-visual-index">EE / NEWS</span>
  </div>
  <div className="news-feature-copy">
   <div className="news-meta">
    {isLatest&&<span className="news-latest"><i aria-hidden="true"/>LATEST</span>}
    <Tag>{post.category}</Tag>
    <time dateTime={post.date}>{formatDate(post.date)}</time>
    <span className="news-read">{readTime(post)} MIN READ</span>
   </div>
   <h3 id={`${post.id}-title`}>{post.title}</h3>
   <p className="news-summary">{post.summary}</p>
   <div className="news-actions">
    <button type="button" className="button button-glow news-open" data-readmore aria-haspopup="dialog" onClick={e=>onOpen(post,e.currentTarget)}><BookOpen size={16} aria-hidden="true"/>Read announcement<span className="sr-only">: {post.title}</span></button>
    <a className="text-link" href={post.link.href}>{post.link.label} <ArrowUpRight size={16} aria-hidden="true"/></a>
    <CopyLink post={post} className="news-copy-end"/>
   </div>
  </div>
 </TiltCard>;
}

function TimelineItem({post,onOpen,isTarget}:{post:NewsPost;onOpen:(p:NewsPost,el:HTMLElement)=>void;isTarget:boolean}){
 return <TiltCard as="article" max={5} className={`news-item ${isTarget?'is-target':''}`} aria-labelledby={`${post.id}-title`}>
  <span className="news-anchor" id={post.id} aria-hidden="true"/>
  <span className="news-node" aria-hidden="true"/>
  <div className="news-meta"><Tag>{post.category}</Tag><time dateTime={post.date}>{shortDate(post.date)}</time></div>
  <h3 id={`${post.id}-title`}>{post.title}</h3>
  <p className="news-summary">{post.summary}</p>
  <div className="news-item-actions">
   <button type="button" className="news-more" data-readmore aria-haspopup="dialog" onClick={e=>onOpen(post,e.currentTarget)}>READ<span className="sr-only"> announcement: {post.title}</span><ArrowUpRight size={14} aria-hidden="true"/></button>
   <span className="news-read">{readTime(post)} MIN</span>
  </div>
 </TiltCard>;
}

function NewsDialog({post,onClose}:{post:NewsPost|null;onClose:()=>void}){
 const ref=useRef<HTMLDialogElement>(null);
 useEffect(()=>{const el=ref.current;if(!el||!post)return;el.showModal();const old=document.body.style.overflow;document.body.style.overflow='hidden';return()=>{document.body.style.overflow=old;if(el.open)el.close()}},[post]);
 return <dialog ref={ref} className="news-dialog" aria-labelledby="news-dialog-title" onCancel={e=>{e.preventDefault();onClose()}} onClick={e=>{const el=ref.current;if(e.target!==el||!el)return;const r=el.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)onClose()}}>
  {post&&<>
   <button type="button" className="dialog-close" onClick={onClose} aria-label="Close announcement" autoFocus><X size={20}/></button>
   <div className="news-dialog-head">
    <div className="eyebrow"><i/>EXALTED ERA / ANNOUNCEMENT</div>
    <div className="news-meta"><Tag>{post.category}</Tag><time dateTime={post.date}>{formatDate(post.date)}</time><span className="news-read">{readTime(post)} MIN READ</span></div>
    <h2 id="news-dialog-title">{post.title}</h2>
    <p className="news-dialog-lead">{post.summary}</p>
   </div>
   <div className="news-dialog-body">{post.paragraphs.map(p=><p key={p}>{p}</p>)}</div>
   <div className="news-dialog-foot"><a className="button button-outline" href={post.link.href}>{post.link.label} <ArrowUpRight size={16} aria-hidden="true"/></a><CopyLink post={post}/></div>
  </>}
 </dialog>;
}

export function News(){
 const posts=useMemo(()=>[...news].sort((a,b)=>b.date.localeCompare(a.date)),[]);
 const categories=useMemo(()=>[...new Set(posts.map(p=>p.category))],[posts]);
 const [filter,setFilter]=useState('All');
 const [open,setOpen]=useState<NewsPost|null>(null);
 const opener=useRef<HTMLElement|null>(null);
 const [target,setTarget]=useState('');
 // Post permalinks (/#post-id): the page renders after load, so scroll to and highlight the post ourselves.
 useEffect(()=>{const sync=()=>{const id=decodeURIComponent(window.location.hash.slice(1));if(!posts.some(p=>p.id===id))return;setFilter('All');setTarget(id);requestAnimationFrame(()=>document.getElementById(id)?.scrollIntoView({block:'start'}))};sync();window.addEventListener('hashchange',sync);return()=>window.removeEventListener('hashchange',sync)},[posts]);
 if(!posts.length)return null;
 const shown=filter==='All'?posts:posts.filter(p=>p.category===filter);
 const [lead,...rest]=shown;
 const openPost=(p:NewsPost,el:HTMLElement)=>{opener.current=el;setOpen(p)};
 const close=()=>{setOpen(null);requestAnimationFrame(()=>opener.current?.focus())};
 const count=(c:string)=>c==='All'?posts.length:posts.filter(p=>p.category===c).length;
 return <section id="news" className="section news" aria-labelledby="news-title">
  <div className="news-aura" aria-hidden="true"/>
  <Label number="05">FROM THE COLLECTIVE</Label>
  <div className="section-heading"><SplitHeading id="news-title" lines={['THE LATEST',{text:'FROM THE ERA.',accent:true}]}/><Reveal delay={.2}><p>Announcements and stories.<br/>Straight from Exalted Era.</p></Reveal></div>
  <Reveal y={16} className="news-toolbar">
   {categories.length>1?<div className="news-filters" role="group" aria-label="Filter news by category">
    {['All',...categories].map(c=><button type="button" key={c} className="news-chip" aria-pressed={filter===c} onClick={()=>setFilter(c)}>
     {filter===c&&<motion.span layoutId="news-chip-bg" className="news-chip-bg" transition={{duration:.45,ease}}/>}<span>{c}</span><small>{String(count(c)).padStart(2,'0')}</small>
    </button>)}
   </div>:<span className="news-toolbar-label">ALL ANNOUNCEMENTS</span>}
   <p className="news-status" aria-live="polite"><span>{String(shown.length).padStart(2,'0')}</span> {shown.length===1?'POST':'POSTS'}<i aria-hidden="true"/>UPDATED {shortDate(posts[0].date)}</p>
  </Reveal>
  <div className={`news-layout ${rest.length>1?'is-split':rest.length?'has-rest':'is-solo'}`}>
   <AnimatePresence mode="popLayout" initial={false}>
    <motion.div key={lead.id} className="news-lead" layout initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.15}} exit={{opacity:0,y:-12}} transition={{duration:.8,ease}}>
     <Featured post={lead} onOpen={openPost} isLatest={lead.id===posts[0].id} isTarget={target===lead.id}/>
    </motion.div>
   </AnimatePresence>
   {rest.length>0&&<motion.ol layout className="news-timeline" aria-label="More news">
    <AnimatePresence mode="popLayout" initial={false}>
     {rest.map((p,i)=><motion.li layout key={p.id} initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true,amount:.2}} exit={{opacity:0,x:-12}} transition={{duration:.7,delay:Math.min(i,4)*.08,ease}}>
      <TimelineItem post={p} onOpen={openPost} isTarget={target===p.id}/>
     </motion.li>)}
    </AnimatePresence>
   </motion.ol>}
  </div>
  {posts.length<3&&<Reveal y={16} delay={.1} className="news-follow">
   <span className="news-follow-pulse" aria-hidden="true"/>
   <p><strong>New announcements will appear here.</strong> Follow along on our Discord between posts.</p>
   <a className="text-link" href={site.discordUrl} target="_blank" rel="noopener noreferrer" aria-label="Join our Discord for updates (opens in a new tab)">Join our Discord <ArrowUpRight size={16} aria-hidden="true"/></a>
  </Reveal>}
  <NewsDialog post={open} onClose={close}/>
 </section>;
}
