import { firestore } from 'firebase';
import { IPlan } from './plan.model';

export interface IServer {
  uid: string;
  status: 'active' | 'deleted';
  userUid: string;
  userName: string;
  userEmail: string;
  name: string;
  description: string;
  location: string;
  createdTime: firestore.Timestamp;
  serverType: 'VANILLA' | 'CURSEFORGE';

  vanilla?: {
    jarVersion: string;
    jarType: string;
    jarUrl: string;
    jarUid: string;
  };

  curseforge?: {
    name: string;
    modPackUrl: string;
    modPackVersion: string;
  };

  planId: IPlan['id'];
  paddleSubscriptionId: string;
  paddlePlanId: IPlan['paddlePlanId'];

  vmInfo: IVMConfig;
}

export interface IVMConfig {
  vmName: string;
  zone: string;
  region: string;
  machineType: string;
  allocatedJVMMemory: string;
  publicIP: string;
  diskName: string;
  addressName: string;
}

export const serverLocations = [
  {
    continent: 'North America',
    servers: [
      { id: 'northamerica-northeast1', location: 'Montreal' },
      { id: 'us-central1', location: 'Iowa' },
      { id: 'us-east1', location: 'South Carolina' },
      { id: 'us-east4', location: 'Northern Virginia' },
      { id: 'us-west1', location: 'Oregon' },
      { id: 'us-west2', location: 'Los Angeles' },
      { id: 'us-west3', location: 'Salt Lake City' },
      { id: 'us-west4', location: 'Las Vegas' },
    ],
  },
  {
    continent: 'Europe',
    servers: [
      { id: 'europe-north1', location: 'Finland' },
      { id: 'europe-west1', location: 'Belgium' },
      { id: 'europe-west2', location: 'London' },
      { id: 'europe-west3', location: 'Frankfurt' },
      { id: 'europe-west4', location: 'Netherlands' },
      { id: 'europe-west6', location: 'Zurich' },
    ],
  },
  {
    continent: 'Asia',
    servers: [
      { id: 'asia-east1', location: 'Taiwan' },
      { id: 'asia-east2', location: 'Hong Kong' },
      { id: 'asia-northeast1', location: 'Tokyo' },
      { id: 'asia-northeast2', location: 'Osaka' },
      { id: 'asia-northeast3', location: 'Seoul' },
      { id: 'asia-south1', location: 'Mumbai' },
      { id: 'asia-southeast1', location: 'Singapore' },
    ],
  },
  {
    continent: 'South America',
    servers: [{ id: 'southamerica-east1', location: 'Sao Paulo' }],
  },
  {
    continent: 'Australasia',
    servers: [{ id: 'australia-southeast1', location: 'Sydney' }],
  },
];
