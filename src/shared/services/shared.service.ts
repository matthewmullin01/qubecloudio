import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { IUser } from 'src/shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private user: IUser;
  private user$: Observable<IUser>;

  constructor(private afs: AngularFirestore, private afAuth: AngularFireAuth) {
    afAuth.user.subscribe(u => {
      if (u) {
        this.updateUserObservable(u.uid);
      } else {
        console.log('Were in the else');
        this.user$ = null;
      }
    });
  }

  private updateUserObservable(userUid: string) {
    this.user$ = this.afs.doc<IUser>(`users/${userUid}`).valueChanges();
  }

  public getUser(): Promise<IUser> {
    return this.user$.pipe(first()).toPromise();
  }
}
