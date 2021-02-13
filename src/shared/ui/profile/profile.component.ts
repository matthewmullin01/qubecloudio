import { Component, OnInit, Input } from '@angular/core';
import { NbDialogService, NbDialogRef, NbToastrService } from '@nebular/theme';
import { IUser } from 'src/shared/models/user.model';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  @Input()
  user: IUser;

  formData: {
    email: string;
    name: string;
  } = {
    email: '',
    name: '',
  };

  constructor(
    protected dialog: NbDialogService,
    protected dialogRef: NbDialogRef<ProfileComponent>,
    private afs: AngularFirestore,
    private toastr: NbToastrService
  ) {}

  ngOnInit() {
    this.formData = {
      email: this.user.email,
      name: this.user.name,
    };
  }

  closeClicked() {
    this.dialogRef.close();
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const user = {
      name: `${this.formData.name}`,
    };

    this.dialogRef.close();
    await this.afs.doc<IUser>(`users/${this.user.uid}`).update(user);
    this.toastr.info(`Profile updated`, 'Success');
  }
}
