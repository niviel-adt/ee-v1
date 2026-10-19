import type {Member} from '../../data/staff';
export function mountConstellation(root:ShadowRoot,teams:{id:string;name:string;members:Member[]}[]):()=>void;
