import type {Member} from './staff';

const playerOverrides: Record<string, Partial<Member>> = {
  '05': {
    name: 'Vinc',
    image: '/portraits/1hryV3ooItzqMkTw5t23YW_iAv6zMzUn2.webp',
  },
  '04': {
    name: 'Omi',
    image: '/portraits/1LPtpq5Ij8UEo6MrAN19u2DjpZ7K8UaJT.webp',
  },
  '03': {
    name: 'Maliyah',
    image: '/portraits/1R6dxvCOU1puHJcuTwU1i6Exof_06NXgJ.webp',
  },
  '02': {
    name: 'Ja',
    image: '/portraits/1vz2z-10wMT4qW2Q7S4U-tFB4Dt6K5FHd.webp',
  },
  '01': {
    name: 'Ceazar',
    image: '/portraits/1qRT-UFsZxP-fqDGuNA9oA-ywU1i1eWt-.webp',
  },
  '10': {
    name: 'Simetra',
    image: '/portraits/16gyVlLCQgTrm3dh9-HmbEVTZvg_33bY6.webp',
  },
  '09': {
    name: 'Squalo',
    image: '/portraits/team2-squalo.webp',
  },
  '08': {
    name: 'Ichi',
    image: '/portraits/1I7EN3BK8fZYoficXcx1_uT_ZzbK6mM3N.webp',
  },
  '07': {
    name: 'Hamzah',
    image: '/portraits/18wZIMaqsn3gF_u_vRZM3YC6XoYIjZeS3.webp',
  },
  '06': {
    name: 'Alfonso',
    image: '/portraits/126qmZbkbXAX0VZ-WLtZdMVgtNOQgei-C.webp',
  },
};

export const teams: {id: string; name: string; members: Member[]}[] = [0, 1].map(t => ({
  id: `team-${t + 1}`,
  name: `TEAM 0${t + 1}`,
  members: Array.from({length: 5}, (_, i) => {
    const number = String(t * 5 + i + 1).padStart(2, '0');
    return {name: `PLAYER ${number}`, number, ...playerOverrides[number]};
  }),
}));

// Team 03 portraits imported from the team’s shared Google Drive folder.
teams.push({
  id: 'team-3',
  name: 'TEAM 03',
  members: [
    {name: 'Bert', number: '11', image: '/portraits/team3-bert.webp'},
    {name: 'Chifu', number: '12', image: '/portraits/team3-chifu.webp'},
    {name: 'Dragonide', number: '13', image: '/portraits/team3-dragonide.webp'},
    {name: 'Ikabu', number: '14', image: '/portraits/team3-ikabu.webp'},
    {name: 'Yezuee', number: '15', image: '/portraits/team3-yezuee.webp'},
  ],
});

// Team 04: full five-player roster.
teams.push({
  id: 'team-4',
  name: 'TEAM 04',
  members: [
    {name: 'Garboy', number: '16', image: '/portraits/team4-garboy.webp'},
    {name: 'Gelow', number: '17', image: '/portraits/team4-gelow.webp'},
    {name: 'Kishouu', number: '18', image: '/portraits/team4-kishouu.webp'},
    {name: 'Tomaso', number: '19', image: '/portraits/team4-tomaso.webp'},
    {name: 'Reaper', number: '20', image: '/portraits/1F0TjyU7-XAaRsAi6Tl2KWIygbmKfjQpj.webp'},
  ],
});
