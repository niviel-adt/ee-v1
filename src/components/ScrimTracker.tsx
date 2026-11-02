import {ArrowLeft} from 'lucide-react';
import {Brand} from './Brand';
const tracker='https://exalted-scrim-tracker.briskpetal32.chatgpt.site';
export function ScrimTracker(){return <>
<header className="nav recruitment-nav scrim-site-header"><Brand href="/#home"/><a className="text-link" href="/"><ArrowLeft size={16}/> Back to the team</a></header>
<main id="scrim-main" className="scrim-page"><div className="scrim-intro"><div><p className="eyebrow">EXALTED ERA / PERFORMANCE ROOM</p><h1>Scrim Tracker</h1><p>Four teams. Every game. One higher standard.</p></div><p className="scrim-access">Members can view freely. Officers can sign in below to manage teams and scrims.</p></div><iframe title="Exalted Era scrim tracker — team averages and match history" src={tracker} className="scrim-frame"/></main></>}
