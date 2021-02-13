import { firestore } from 'firebase';

export interface IUser {
  email: string;
  uid: string;
  name: string;
  registeredDate: firestore.Timestamp;

  isAdmin?: boolean;
}
