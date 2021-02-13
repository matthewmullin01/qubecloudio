import { Component, OnInit } from '@angular/core';
import { NbDialogService, NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {
  constructor(protected dialog: NbDialogService, protected dialogRef: NbDialogRef<ContactUsComponent>) {}

  ngOnInit() {}

  closeClicked() {
    this.dialogRef.close();
  }
}
