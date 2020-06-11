import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { NbToastrService } from '@nebular/theme';
import { AuthService } from 'src/shared/services/auth.service';
import { AngularFireAnalytics } from '@angular/fire/analytics';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loading = false;

  formData: {
    email: string;
    password: string;
  } = {
    email: null,
    password: null,
  };

  constructor(
    private toastr: NbToastrService,
    private analytics: AngularFireAnalytics,
    private router: Router,
    private afAuth: AngularFireAuth,
    private auth: AuthService
  ) {}

  ngOnInit() {}

  async authWithProvider(provider: 'google') {
    try {
      await this.auth.handleAuthProvider(provider);
      this.analytics.logEvent(`login`, { method: 'Google' });
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
      const userCredentials = await this.afAuth.signInWithEmailAndPassword(this.formData.email, this.formData.password);
      this.analytics.logEvent(`login`, { method: 'Email' });
      this.router.navigate(['/home']);
    } catch (error) {
      this.toastr.warning(error.message || error, 'Oops ...');
      console.error(error);
    }
    this.loading = false;
  }
}
