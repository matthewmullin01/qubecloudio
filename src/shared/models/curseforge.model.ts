import { IPlan } from './plan.model';

export interface ICurseforgeData {
  version: string;
  displayOrder: number;
  displayName: string;
  uid: string;
  modpackUrl: string;
  minPlanId: IPlan['id'];
  enabled: boolean;
}
