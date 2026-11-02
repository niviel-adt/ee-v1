import React from 'react';
import ReactDOM from 'react-dom/client';
import {MotionConfig} from 'motion/react';
import {ScrimTracker} from './components/ScrimTracker';
import {Recruitment} from './components/Recruitment';
import {BackToTop} from './components/BackToTop';
import '@fontsource-variable/inter-tight';
import '@fontsource-variable/jetbrains-mono';

const root=ReactDOM.createRoot(document.getElementById('root')!);
const path=window.location.pathname.replace(/\/$/,'');
const isScrims=path==='/scrims',isRecruitment=path==='/recruitment',isSphere=path==='/sphere';
if(isSphere){
 document.title='Sphere — EXALTED ERA';
 import('./components/SpherePage').then(({SpherePage})=>root.render(<React.StrictMode><SpherePage/></React.StrictMode>));
}else if(isScrims||isRecruitment){
 document.title=isScrims?'Scrim Tracker — EXALTED ERA':'Recruitment — EXALTED ERA';
 import('./route-styles').then(()=>root.render(<React.StrictMode><MotionConfig reducedMotion="always"><a className="skip-link" href={isScrims?'#scrim-main':'#recruitment-main'}>Skip to content</a>{isScrims?<ScrimTracker/>:<Recruitment/>}<BackToTop/></MotionConfig></React.StrictMode>));
}else{
 document.title='Exalted Era — Beyond Ordinary';
 import('./components/SubmittedHome').then(({SubmittedHome})=>root.render(<React.StrictMode><SubmittedHome/></React.StrictMode>));
}
