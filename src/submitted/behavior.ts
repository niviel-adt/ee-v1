import type {Member} from '../data/staff';
type Player=Member & {team:number};
const escape=(value:string)=>value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');

export function mountSubmittedHome(root:HTMLElement,players:Player[],staff:Member[]){
 const controller=new AbortController();
 const options={signal:controller.signal};
 const find=<T extends Element>(selector:string)=>root.querySelector<T>(selector)!;
 const grid=find<HTMLElement>('#player-grid');
 const tabs=Array.from(root.querySelectorAll<HTMLButtonElement>('[data-team]'));
 const dialog=find<HTMLDialogElement>('#profile-dialog');
 const close=find<HTMLButtonElement>('.dialog-close');
 let lastProfileTrigger:HTMLElement|null=null;

 function showTeam(team:number,focusTab=false){
  tabs.forEach(tab=>{const selected=Number(tab.dataset.team)===team;tab.setAttribute('aria-selected',String(selected));tab.tabIndex=selected?0:-1;if(selected){grid.setAttribute('aria-labelledby',tab.id);if(focusTab)tab.focus();}});
  grid.innerHTML=players.map((player,index)=>({player,index})).filter(({player})=>player.team===team).map(({player,index})=>`<button class="player-card" type="button" data-player="${index}" aria-label="View ${escape(player.name)} profile"><div class="player-image"><img src="${escape(player.image||'')}" alt="${escape(player.name)}" loading="lazy" width="480" height="640"><span class="player-number">${escape(player.number)}</span><span class="profile-plus" aria-hidden="true">↗</span></div><div class="player-info"><span class="player-team">TEAM 0${team}</span><h3>${escape(player.name)}</h3></div></button>`).join('');
 }
 tabs.forEach(tab=>{
  tab.addEventListener('click',()=>showTeam(Number(tab.dataset.team)),options);
  tab.addEventListener('keydown',event=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(event.key)){event.preventDefault();showTeam(event.key==='Home'?1:event.key==='End'?2:Number(tab.dataset.team)===1?2:1,true);}},options);
 });

 function openProfile(person:Member|Player,trigger:HTMLElement,isStaff=false){
  lastProfileTrigger=trigger;
  find<HTMLElement>('#profile-name').textContent=person.name;
  const image=find<HTMLImageElement>('#profile-image');image.src=person.image||'';image.alt=`${person.name} — Exalted Era ${isStaff?'staff':'player'} portrait`;
  const team='team' in person?person.team:0;
  find<HTMLElement>('#profile-meta').textContent=isStaff?`THE FOUNDATION / ${(person.position||'Staff').toUpperCase()}`:`VALORANT MOBILE / TEAM 0${team} / PLAYER ${person.number}`;
  find<HTMLElement>('#profile-description').textContent=isStaff?`${person.name} is part of the people behind Exalted Era, with a focus on ${(person.position||'the organization').toLowerCase()}.`:`${person.name} is part of Exalted Era’s Team 0${team} Valorant Mobile roster. Individual talent, united by the collective.`;
  find<HTMLAnchorElement>('#profile-original').href=person.image||'/';
  if(!dialog.open)dialog.showModal();document.body.classList.add('dialog-open');close.focus();
 }
 grid.addEventListener('click',event=>{const trigger=(event.target as Element).closest<HTMLButtonElement>('[data-player]');if(trigger){const person=players[Number(trigger.dataset.player)];if(person)openProfile(person,trigger);}},options);
 root.querySelectorAll<HTMLButtonElement>('[data-staff]').forEach(trigger=>{
  const person=staff[Number(trigger.dataset.staff)];if(!person)return;
  trigger.setAttribute('aria-label',`View ${person.name} profile`);
  trigger.querySelector('img')!.src=person.image||'';
  trigger.querySelector('strong')!.textContent=person.name;
  trigger.querySelector('.small-index')!.textContent=`${person.number} / ${(person.position||'Staff').toUpperCase()}`;
  trigger.addEventListener('click',()=>openProfile(person,trigger,true),options);
 });
 close.addEventListener('click',()=>dialog.close(),options);
 dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}},options);
 dialog.addEventListener('close',()=>{if(dialog.open)return;document.body.classList.remove('dialog-open');if(lastProfileTrigger?.isConnected)lastProfileTrigger.focus();const url=new URL(location.href);if(url.searchParams.has('player')){url.searchParams.delete('player');history.replaceState(history.state,'',url);}},options);

 const menu=find<HTMLButtonElement>('.menu-toggle');
 const navigation=find<HTMLElement>('#navigation');
 const closeNavigation=()=>{navigation.classList.remove('is-open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Open navigation');};
 menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close navigation':'Open navigation');navigation.classList.toggle('is-open',open);},options);
 navigation.querySelectorAll('a').forEach(link=>link.addEventListener('click',closeNavigation,options));
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu.getAttribute('aria-expanded')==='true'){closeNavigation();menu.focus();}},options);
 const desktop=window.matchMedia('(min-width:761px)');
 desktop.addEventListener('change',event=>{if(event.matches)closeNavigation();},options);

 const top=find<HTMLButtonElement>('#back-to-top');
 const updateTop=()=>{top.hidden=window.scrollY<360;};
 window.addEventListener('scroll',updateTop,{...options,passive:true});window.addEventListener('pageshow',updateTop,options);
 top.addEventListener('click',()=>{window.scrollTo({top:0,behavior:'auto'});find<HTMLAnchorElement>('.brand').focus({preventScroll:true});updateTop();},options);
 showTeam(1);updateTop();
 // Keep previously shared player URLs working with the restored roster.
 const linkedPlayer=players.find(player=>player.number===new URL(location.href).searchParams.get('player'));
 if(linkedPlayer){showTeam(linkedPlayer.team);const trigger=find<HTMLButtonElement>(`[data-player="${players.indexOf(linkedPlayer)}"]`);openProfile(linkedPlayer,trigger);}
 return()=>{controller.abort();if(dialog.open)dialog.close();document.body.classList.remove('dialog-open');};
}
