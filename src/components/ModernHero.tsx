import {ArrowDown,ArrowUpRight} from 'lucide-react';
import {stats} from '../data/stats';

export function ModernHero(){
 return <>
  <section className="hero modern-hero" id="home" aria-labelledby="hero-title">
   <div className="modern-hero-top"><p className="eyebrow"><i aria-hidden="true"/>VALORANT MOBILE / ESPORTS & COMMUNITY</p><span>BLACKSTAR / FORM—01</span></div>
   <div className="modern-hero-body">
    <div className="modern-hero-copy"><p className="modern-kicker">EXALTED ERA — THE COLLECTIVE</p><h1 id="hero-title">BEYOND<br/><span>ORDINARY.</span></h1><p className="modern-description">Individual talent. Collective force.<br/>A new era of Valorant Mobile,<br/>built on discipline and ambition.</p><div className="hero-actions"><a className="button" href="#players">Explore the roster <ArrowUpRight size={18}/></a><a className="text-link" href="#about">Our story <ArrowUpRight size={16}/></a></div></div>
    <div className="modern-hero-art" aria-hidden="true"><span>FIG. 01 / THE BLACKSTAR</span><img className="modern-geometry" src="/geometry.svg" alt=""/><div className="modern-emblem"/><small>DISCIPLINE / AMBITION / EXCELLENCE</small></div>
   </div>
   <div className="modern-hero-bottom"><span>// &nbsp; THE ERA IS HERE. THE EXALTED ENTERS.</span><a href="#about">DISCOVER THE ERA <ArrowDown size={17}/></a><span aria-hidden="true">/////</span></div>
  </section>
  <div className="modern-values" aria-label="Our values">{['DISCIPLINE','CHARACTER','AMBITION','TOGETHERNESS','EXCELLENCE'].map((value,i)=><span key={value}>{i>0&&<i aria-hidden="true">✧</i>}{value}</span>)}</div>
  <section className="stats-band" aria-label="Exalted Era at a glance"><dl className="stats">{stats.map(stat=><div className="stat" key={stat.label}><dt>{stat.label}</dt><dd>{stat.value}</dd></div>)}</dl></section>
 </>;
}
