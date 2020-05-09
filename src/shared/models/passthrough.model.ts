import { IServer } from './server.model';
import { IUser } from './user.model';

export interface IPassthrough {
  server: IServer;
  user: IUser;
}
