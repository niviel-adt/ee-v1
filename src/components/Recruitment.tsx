import {ArrowUpRight,ArrowLeft,Check,MessageCircle} from 'lucide-react';
import {Brand} from './Brand';
import {site} from '../data/site';

const preparation=['Your in-game name and a short introduction','Your region, time zone, and usual availability','Your preferred role and relevant experience','Gameplay clips or a portfolio, if you have them'];

export function Recruitment(){
 return <>
  <header className="nav recruitment-nav"><Brand/><a className="text-link" href="/"><ArrowLeft size={16}/> Back to the team</a></header>
  <main id="recruitment-main" className="recruitment">
   <section className="recruitment-hero" aria-labelledby="recruitment-title">
    <a href="/#players" className="recruitment-back">EXPLORE THE ROSTER <ArrowUpRight size={14}/></a>
    <p className="eyebrow">EXALTED ERA / RECRUITMENT</p>
    <h1 id="recruitment-title">YOUR NEXT<br/>ERA STARTS<br/><span>WITH YOU.</span></h1>
    <p className="recruitment-lead">Bring your ambition. Get to know the collective. Talk to us about where you could belong.</p>
    <div className="recruitment-status"><span/> 10 COMMUNITY SLOTS OPEN</div>
    <p className="recruitment-note">We’re welcoming 10 new community members to Exalted Era. Join our Discord and tell the team you’re interested in a community slot. The team will confirm availability and next steps.</p>
    <a className="button" href={site.discordUrl} target="_blank" rel="noopener noreferrer">Ask About a Community Slot <ArrowUpRight size={17}/><span className="sr-only"> on Discord (opens in a new tab)</span></a>
   </section>
   <section className="recruitment-content" aria-labelledby="recruitment-process">
    <p className="eyebrow">/01 THE FIRST STEP</p><h2 id="recruitment-process">START A<br/>CONVERSATION.</h2>
    <div className="recruitment-steps">
     {[['01','Meet the community','Join our Discord and get to know Exalted Era.'],['02','Ask what’s available','Ask the team about the 10 community slots and any joining requirements.'],['03','Follow the team’s guidance','If an opportunity fits, the team can explain the application process and next steps.']].map(([number,title,text])=><article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p></article>)}
    </div>
   </section>
   <section className="recruitment-prep" aria-labelledby="recruitment-prepare">
    <div><p className="eyebrow">/02 BE READY TO INTRODUCE YOURSELF</p><h2 id="recruitment-prepare">LET US<br/>MEET YOU.</h2><p>These are useful details to have ready for a conversation. The team will confirm any formal requirements.</p></div>
    <ul>{preparation.map(item=><li key={item}><Check size={18} aria-hidden="true"/>{item}</li>)}</ul>
   </section>
   <section className="recruitment-faq" aria-labelledby="recruitment-questions">
    <p className="eyebrow">/03 BEFORE YOU REACH OUT</p><h2 id="recruitment-questions">GOOD QUESTIONS.<br/>CLEAR NEXT STEPS.</h2>
    <details><summary>What is recruitment open for?</summary><p>We have 10 community slots open. This announcement is for community membership; competitive player positions have not been announced here. Contact the team on Discord to confirm remaining availability.</p></details>
    <details><summary>Is there a rank, age, or region requirement?</summary><p>No official eligibility criteria are published here yet. Confirm the requirements for a specific opportunity with the team before applying.</p></details>
    <details><summary>Does joining Discord count as an application?</summary><p>Joining introduces you to the community. It does not submit an application or guarantee a place on the team. Ask about the next steps for a community slot.</p></details>
   </section>
   <section className="recruitment-end"><MessageCircle size={28} aria-hidden="true"/><h2>MAKE YOUR<br/>INTRODUCTION.</h2><a className="button" href={site.discordUrl} target="_blank" rel="noopener noreferrer">Join Our Discord <ArrowUpRight size={17}/><span className="sr-only"> (opens in a new tab)</span></a><a className="text-link" href={site.facebookUrl} target="_blank" rel="noopener noreferrer">Prefer Facebook? Message the team <ArrowUpRight size={14}/><span className="sr-only"> (opens in a new tab)</span></a></section>
  </main>
  <footer className="recruitment-footer"><span>EXALTED ERA / BUILT ON DISCIPLINE.</span><a href="/">Back to the homepage ↑</a></footer>
 </>;
}
