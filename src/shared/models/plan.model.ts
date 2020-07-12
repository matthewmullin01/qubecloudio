export interface IPlan {
  name: string;
  id: 'starter' | 'regular' | 'pro' | 'super' | 'ultra' | 'diamond';
  index: number;
  paddlePlanId: string;
  ramSize: number;
  cpuCount: number;
  recommendedPlayers: string;
  price: number;
  discountPercent?: number;
}

export const plans: IPlan[] = [
  {
    name: 'Starter',
    id: 'starter',
    paddlePlanId: '594607',
    index: 0,
    ramSize: 1.75,
    cpuCount: 0.5,
    recommendedPlayers: '1 - 2',
    price: 29,
  },
  {
    name: 'Regular',
    id: 'regular',
    paddlePlanId: '595335',
    index: 1,
    ramSize: 2,
    cpuCount: 1,
    recommendedPlayers: '2 - 5',
    price: 39,
  },
  {
    name: 'Pro',
    id: 'pro',
    paddlePlanId: '594609',
    index: 2,
    ramSize: 3,
    cpuCount: 1,
    recommendedPlayers: '5 - 10',
    price: 44,
    discountPercent: 25,
  },
  {
    name: 'Super',
    id: 'super',
    paddlePlanId: '594610',
    index: 3,
    ramSize: 4,
    cpuCount: 2,
    recommendedPlayers: '10 - 20',
    price: 59,
  },
  {
    name: 'Ultra',
    id: 'ultra',
    paddlePlanId: '594611',
    index: 4,
    ramSize: 6,
    cpuCount: 4,
    recommendedPlayers: '20 - 30',
    price: 99,
  },
  // {
  //   name: 'Diamond',
  //   id: 'diamond',
  //   paddlePlanId: '594611',
  //   index: 5,
  //   ramSize: 10,
  //   cpuCount: 4,
  //   recommendedPlayers: '30 - 50',
  //   price: 129,
  // },
];
