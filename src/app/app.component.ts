import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { User } from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'QubeCloud';

  constructor(private afAuth: AngularFireAuth, private router: Router) {
    this.afAuth.authState.subscribe((user: User) => {
      if (user) {
        if (this.router.url.startsWith('/auth')) {
          console.log('Logged In: Routing to Home');
          this.router.navigate(['/home/dashboard']);
        }
      } else {
        if (!this.router.url.startsWith('/auth')) {
          console.log('Not Logged In: Routing to Login');
          this.router.navigate(['auth/login']);
        }
      }
    });
  }
}
