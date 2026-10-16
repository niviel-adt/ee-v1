import type {Member} from './staff';

const playerOverrides: Record<string, Partial<Member>> = {
  '02': {
    name: 'Ja',
    image: 'https://drive.google.com/thumbnail?id=1vz2z-10wMT4qW2Q7S4U-tFB4Dt6K5FHd&sz=w1600&v=ja-1',
  },
  '01': {
    name: 'Ceazar',
    image: 'https://drive.google.com/thumbnail?id=1qRT-UFsZxP-fqDGuNA9oA-ywU1i1eWt-&sz=w1600&v=ceazar-1',
  },
  '10': {
    name: 'Simetra',
    image: 'https://drive.google.com/thumbnail?id=16gyVlLCQgTrm3dh9-HmbEVTZvg_33bY6&sz=w1600&v=simetra-1',
  },
  '09': {
    name: 'Reaper',
    image: 'https://drive.google.com/thumbnail?id=1F0TjyU7-XAaRsAi6Tl2KWIygbmKfjQpj&sz=w1600&v=reaper-1',
  },
  '08': {
    name: 'Ichi',
    image: 'https://drive.google.com/thumbnail?id=1I7EN3BK8fZYoficXcx1_uT_ZzbK6mM3N&sz=w1600&v=ichi-1',
  },
  '07': {
    name: 'Hamzah',
    image: 'https://drive.google.com/thumbnail?id=18wZIMaqsn3gF_u_vRZM3YC6XoYIjZeS3&sz=w1600&v=hamzah-1',
  },
  '06': {
    name: 'Alfonso',
    image: 'https://drive.google.com/thumbnail?id=126qmZbkbXAX0VZ-WLtZdMVgtNOQgei-C&sz=w1600&v=alfonso-1',
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
