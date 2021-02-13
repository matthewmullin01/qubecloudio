import { isNullOrUndefined } from 'util';
import { Observable } from 'rxjs';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { SharedService } from './shared.service';
import { auth, firestore } from 'firebase';
import { IUser } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService implements CanActivate {
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router, private shared: SharedService) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.afAuth.authState.pipe(
      map(auth => {
        this.shared.getUser();
        if (auth === null || auth === undefined) {
          console.log('Router Guard activated - Please log in');
          this.router.navigate(['auth/login']);
          return false;
        } else {
          return true;
        }
      })
    );
  }

  async handleAuthProvider(provider: 'google') {
    const credential = await this.afAuth.signInWithPopup(new auth.GoogleAuthProvider());

    if (!credential.additionalUserInfo.isNewUser) {
      return;
    }

    const user: IUser = {
      email: credential.user.email,
      uid: credential.user.uid,
      name: credential.user.displayName,
      registeredDate: firestore.Timestamp.now()
    };

    await firestore()
      .doc(`users/${user.uid}`)
      .set(user);

    return;
  }
}
