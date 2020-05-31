import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NbToastrService } from '@nebular/theme';
import { IUser } from 'src/shared/models/user.model';
import { firestore, auth as fbAuth } from 'firebase';
import { AuthService } from 'src/shared/services/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  loading = false;

  formData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  } = {
    email: null,
    password: null,
    firstName: null,
    lastName: null
  };

  constructor(private toastr: NbToastrService, private router: Router, private afAuth: AngularFireAuth, private auth: AuthService) {}

  ngOnInit() {}

  async authWithProvider(provider: 'google') {
    try {
      await this.auth.handleAuthProvider(provider);
      this.router.navigate(['/home']);
    } catch (error) {
      this.toastr.warning(error.message || error, 'Oops ...');
      console.error(error);
    }
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.loading = true;
    try {
      const userCredentials = await this.afAuth.createUserWithEmailAndPassword(this.formData.email, this.formData.password);
      const user: IUser = {
        email: this.formData.email,
        uid: userCredentials.user.uid,
        name: `${this.formData.firstName} ${this.formData.lastName}`,
        registeredDate: firestore.Timestamp.now()
      };

      await firestore()
        .doc(`users/${user.uid}`)
        .set(user);

      this.router.navigate(['/home']);
    } catch (error) {
      this.toastr.warning(error.message || error, 'Oops ...');
      console.error(error);
    }
    this.loading = false;
  }
}
