import {ArrowUpRight,ArrowLeft,Check,MessageCircle} from 'lucide-react';
import {Brand} from './Brand';
import {site} from '../data/site';
import {communitySlotsOpen} from '../data/stats';
import {Starfield} from './Starfield';
import {Counter,Magnetic,Reveal,SplitHeading,Stagger,StaggerItem,TiltCard} from './fx';

const preparation=['Your in-game name and a short introduction','Your region, time zone, and usual availability','Your preferred role and relevant experience','Gameplay clips or a portfolio, if you have them'];

export function Recruitment(){
 return <>
  <header className="nav recruitment-nav"><Brand/><a className="text-link" href="/"><ArrowLeft size={16}/> Back to the team</a></header>
  <main id="recruitment-main" className="recruitment">
   <section className="recruitment-hero" aria-labelledby="recruitment-title">
    <Starfield className="hero-stars" density={9000}/>
    <div className="recruitment-hero-inner">
    <a href="/#players" className="recruitment-back">EXPLORE THE ROSTER <ArrowUpRight size={14}/></a>
    <p className="eyebrow">EXALTED ERA / RECRUITMENT</p>
    <SplitHeading as="h1" immediate delay={.1} id="recruitment-title" lines={['YOUR NEXT','ERA STARTS',{text:'WITH YOU.',accent:true}]}/>
    <p className="recruitment-lead">Bring your ambition. Get to know the collective. Talk to us about where you could belong.</p>
    <div className="recruitment-status"><span className="live-dot" aria-hidden="true"/> <Counter value={communitySlotsOpen}/> COMMUNITY SLOTS OPEN</div>
    <p className="recruitment-note">We’re welcoming 10 new community members to Exalted Era. Join our Discord and tell the team you’re interested in a community slot. The team will confirm availability and next steps.</p>
    <Magnetic><a className="button button-glow" href={site.discordUrl} target="_blank" rel="noopener noreferrer">Ask About a Community Slot <ArrowUpRight size={17}/><span className="sr-only"> on Discord (opens in a new tab)</span></a></Magnetic>
    </div>
   </section>
   <section className="recruitment-content" aria-labelledby="recruitment-process">
    <Reveal y={12}><p className="eyebrow">/01 THE FIRST STEP</p></Reveal><SplitHeading id="recruitment-process" lines={['START A','CONVERSATION.']}/>
    <Stagger className="recruitment-steps">
     {[['01','Meet the community','Join our Discord and get to know Exalted Era.'],['02','Ask what’s available','Ask the team about the 10 community slots and any joining requirements.'],['03','Follow the team’s guidance','If an opportunity fits, the team can explain the application process and next steps.']].map(([number,title,text])=><StaggerItem key={number}><TiltCard as="article"><span>{number}</span><h3>{title}</h3><p>{text}</p></TiltCard></StaggerItem>)}
    </Stagger>
   </section>
   <section className="recruitment-prep" aria-labelledby="recruitment-prepare">
    <div><Reveal y={12}><p className="eyebrow">/02 BE READY TO INTRODUCE YOURSELF</p></Reveal><SplitHeading id="recruitment-prepare" lines={['LET US','MEET YOU.']}/><Reveal><p>These are useful details to have ready for a conversation. The team will confirm any formal requirements.</p></Reveal></div>
    <ul>{preparation.map((item,i)=><Reveal as="li" key={item} delay={i*.08} y={16}><Check size={18} aria-hidden="true"/>{item}</Reveal>)}</ul>
   </section>
   <section className="recruitment-faq" aria-labelledby="recruitment-questions">
    <Reveal y={12}><p className="eyebrow">/03 BEFORE YOU REACH OUT</p></Reveal><SplitHeading id="recruitment-questions" lines={['GOOD QUESTIONS.','CLEAR NEXT STEPS.']}/>
    <details><summary>What is recruitment open for?</summary><p>We have 10 community slots open. This announcement is for community membership; competitive player positions have not been announced here. Contact the team on Discord to confirm remaining availability.</p></details>
    <details><summary>Is there a rank, age, or region requirement?</summary><p>No official eligibility criteria are published here yet. Confirm the requirements for a specific opportunity with the team before applying.</p></details>
    <details><summary>Does joining Discord count as an application?</summary><p>Joining introduces you to the community. It does not submit an application or guarantee a place on the team. Ask about the next steps for a community slot.</p></details>
   </section>
   <section className="recruitment-end"><div className="closing-glow" aria-hidden="true"/><MessageCircle size={28} aria-hidden="true"/><SplitHeading lines={['MAKE YOUR','INTRODUCTION.']}/><Magnetic><a className="button button-glow" href={site.discordUrl} target="_blank" rel="noopener noreferrer">Join Our Discord <ArrowUpRight size={17}/><span className="sr-only"> (opens in a new tab)</span></a></Magnetic><a className="text-link" href={site.facebookUrl} target="_blank" rel="noopener noreferrer">Prefer Facebook? Message the team <ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a></section>
  </main>
  <footer className="recruitment-footer"><span>EXALTED ERA / BUILT ON DISCIPLINE.</span><a href="/">Back to the homepage ↑</a></footer>
 </>;
}
