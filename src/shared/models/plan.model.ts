export interface IPlan {
  name: string;
  id: 'starter' | 'regular' | 'pro' | 'super' | 'ultra';
  paddlePlanId: string;
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
    paddlePlanId: '591305',
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
    paddlePlanId: '591305',
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
    paddlePlanId: '591305',
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
    paddlePlanId: '591305',
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
    paddlePlanId: '591305',
    ramSize: 5,
    ramClock: 2400,
    cpuCount: 4,
    cpuClock: 2.4,
    recommendedPlayers: '20-30',
    price: 40
  }
];
