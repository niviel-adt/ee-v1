import {site} from '../data/site';export function Brand(){return <a className="brand" href="#home" aria-label="Exalted Era home">{site.logo&&<img src={site.logo} alt="Exalted Era logo"/>}<span>EXALTED<small>ERA</small></span></a>}
export function Star({className=''}:{className?:string}){return <img className={className} src={site.logo || undefined} alt="" aria-hidden="true"/>}
