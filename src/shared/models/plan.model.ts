export interface IPlan {
  name: string;
  id: 'starter' | 'regular' | 'pro' | 'super' | 'ultra';
  paddlePlanId: string;
  ramSize: number;
  cpuCount: number;
  recommendedPlayers: string;
  price: number;
}

export const plans: IPlan[] = [
  {
    name: 'Starter',
    id: 'starter',
    paddlePlanId: '594607',
    ramSize: 1.75,
    cpuCount: 0.5,
    recommendedPlayers: '1 - 2',
    price: 29,
  },
  {
    name: 'Regular',
    id: 'regular',
    paddlePlanId: '595335',
    ramSize: 2,
    cpuCount: 1,
    recommendedPlayers: '2 - 5',
    price: 39,
  },
  {
    name: 'Pro',
    id: 'pro',
    paddlePlanId: '594609',
    ramSize: 3,
    cpuCount: 1,
    recommendedPlayers: '5 - 10',
    price: 44,
  },
  {
    name: 'Super',
    id: 'super',
    paddlePlanId: '594610',
    ramSize: 4,
    cpuCount: 2,
    recommendedPlayers: '10 - 20',
    price: 59,
  },
  {
    name: 'Ultra',
    id: 'ultra',
    paddlePlanId: '594611',
    ramSize: 6,
    cpuCount: 4,
    recommendedPlayers: '20 - 50',
    price: 99,
  },
];
