export interface IPlan {
  name: string;
  id: string;
  paypalId: string;
  ramSize: number;
  ramClock: number;
  cpuCount: number;
  cpuClock: number;
  recommendedPlayers: string;
  price: number;
}

export const plans: IPlan[] = [
  {
    name: 'Starter',
    id: 'starter',
    paypalId: 'P-9VP00213B1495674JL2O5MOA',
    ramSize: 0.75,
    ramClock: 2400,
    cpuCount: 1,
    cpuClock: 2.4,
    recommendedPlayers: '1-2',
    price: 10
  },
  {
    name: 'Regular',
    id: 'regular',
    paypalId: 'P-6C255962Y4563525JL2O5MTQ',
    ramSize: 1.2,
    ramClock: 2400,
    cpuCount: 1,
    cpuClock: 2.4,
    recommendedPlayers: '2-3',
    price: 14
  },
  {
    name: 'Pro',
    id: 'pro',
    paypalId: 'P-6C255962Y4563525JL2O5MTQ',
    ramSize: 3,
    ramClock: 2666,
    cpuCount: 2,
    cpuClock: 2.4,
    recommendedPlayers: '5-10',
    price: 20
  },
  {
    name: 'Super',
    id: 'super',
    paypalId: 'P-87T666506T359562JL2O5MXA',
    ramSize: 4,
    ramClock: 2400,
    cpuCount: 2,
    cpuClock: 3.2,
    recommendedPlayers: '10-20',
    price: 30
  },
  {
    name: 'Ultra',
    id: 'ultra',
    paypalId: 'P-87T666506T359562JL2O5MXA',
    ramSize: 5,
    ramClock: 2400,
    cpuCount: 4,
    cpuClock: 2.4,
    recommendedPlayers: '20-30',
    price: 40
  }
];
