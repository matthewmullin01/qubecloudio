export interface IPlan {
  name: string;
  id: 'starter' | 'regular' | 'pro' | 'super' | 'ultra';
  paddlePlanId: string;
  ramSize: number;
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
    ramSize: 1.75,
    cpuCount: 1,
    cpuClock: 1.2,
    recommendedPlayers: '1 - 2',
    price: 30,
  },
  {
    name: 'Regular',
    id: 'regular',
    paddlePlanId: '591305',
    ramSize: 2,
    cpuCount: 1,
    cpuClock: 1.2,
    recommendedPlayers: '2 - 3',
    price: 40,
  },
  {
    name: 'Pro',
    id: 'pro',
    paddlePlanId: '591305',
    ramSize: 3,
    cpuCount: 1,
    cpuClock: 1.2,
    recommendedPlayers: '5 - 10',
    price: 50,
  },
  {
    name: 'Super',
    id: 'super',
    paddlePlanId: '591305',
    ramSize: 4,
    cpuCount: 2,
    cpuClock: 2.2,
    recommendedPlayers: '10 - 20',
    price: 70,
  },
  {
    name: 'Ultra',
    id: 'ultra',
    paddlePlanId: '591305',
    ramSize: 6,
    cpuCount: 4,
    cpuClock: 4.2,
    recommendedPlayers: '20 - 30',
    price: 100,
  },
];
