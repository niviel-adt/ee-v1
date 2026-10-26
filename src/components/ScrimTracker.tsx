import {ArrowLeft,ArrowUpRight} from 'lucide-react';
import {Brand} from './Brand';
const tracker='https://exalted-scrim-tracker.briskpetal32.chatgpt.site';
export function ScrimTracker(){return <>
<header className="nav recruitment-nav"><Brand href="/#home"/><a className="text-link" href="/"><ArrowLeft size={16}/> Back to the team</a></header>
<main id="scrim-main" className="scrim-page"><div className="scrim-intro"><div><p className="eyebrow">EXALTED ERA / PERFORMANCE ROOM</p><h1>Scrim Tracker</h1><p>Four teams. Every game. One higher standard.</p></div><div><a className="button button-outline" href={tracker} target="_blank" rel="noopener noreferrer">Open tracker <ArrowUpRight size={16}/><span className="sr-only"> (opens in a new tab)</span></a><p className="scrim-access">Members can view here. Officers can open the tracker to sign in and edit.</p></div></div><iframe title="Exalted Era scrim tracker — team averages and match history" src={tracker} className="scrim-frame"/><p className="scrim-fallback">Having trouble loading? <a href={tracker} target="_blank" rel="noopener noreferrer">Open the tracker in a new tab ↗</a></p></main></>}
