import { IPlan } from './plan.model';

export interface IServer {
  name: string;
  description: string;
  plan: IPlan;
}
