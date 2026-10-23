import {ArrowUpRight,MessageCircle,Radio} from 'lucide-react';
import {site} from '../data/site';
import {Label} from './Sections';
import {Reveal,SplitHeading,Stagger,StaggerItem,TiltCard} from './fx';

export function Highlights(){
 return <section id="highlights" className="section highlights" aria-labelledby="highlights-title">
  <Label number="06">BEYOND THE ROSTER</Label>
  <div className="section-heading"><SplitHeading id="highlights-title" lines={['FOLLOW','THE ERA.']}/><Reveal delay={.2}><p>The people. The plays. The community.<br/>Stay connected with Exalted Era.</p></Reveal></div>
   <Stagger className="highlights-grid">
    <StaggerItem><TiltCard as="a" max={5} className="highlight-card" href={site.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label="Follow Exalted Era on Facebook (opens in a new tab)">
     <div className="highlight-top"><Radio size={23}/><span>TEAM UPDATES</span><ArrowUpRight size={20}/></div>
     <h3>Off the map.<br/>Into your feed.</h3><p>Follow our Facebook page for team posts, shared moments, and announcements.</p><span className="highlight-link">Follow on Facebook <ArrowUpRight size={16}/></span>
    </TiltCard></StaggerItem>
    <StaggerItem><TiltCard as="a" max={5} className="highlight-card" href={site.discordUrl} target="_blank" rel="noopener noreferrer" aria-label="Join Our Discord (opens in a new tab)">
     <div className="highlight-top"><MessageCircle size={23}/><span>THE COMMUNITY</span><ArrowUpRight size={20}/></div>
     <h3>Your next squad<br/>starts here.</h3><p>Meet the community, talk Valorant Mobile, and stay in the conversation on Discord.</p><span className="highlight-link">Join Our Discord <ArrowUpRight size={16}/></span>
    </TiltCard></StaggerItem>
   </Stagger>
 </section>;
}
