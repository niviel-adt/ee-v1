import type {Member} from './staff';

const playerOverrides: Record<string, Partial<Member>> = {
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
