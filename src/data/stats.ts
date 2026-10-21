import {staff} from './staff';
import {teams} from './teams';

// Every value here is derived from existing site data, never invented.
// The constellation roster renders four teams of five positions (see components/constellation/runtime.js).
const constellationTeams=4,positionsPerTeam=5;
const confirmedPlayers=teams.flatMap(t=>t.members).filter(m=>!/^PLAYER \d+$/.test(m.name)).length;

export const stats=[
 {value:confirmedPlayers,label:'Confirmed players'},
 {value:constellationTeams*positionsPerTeam,label:'Roster positions'},
 {value:constellationTeams,label:'Constellation teams'},
 {value:staff.length,label:'Staff leads'},
];

/** Open community slots announced on /recruitment. Update alongside Recruitment.tsx. */
export const communitySlotsOpen=10;
