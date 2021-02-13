import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent implements OnInit {
  @Input()
  title = 'Confirm';
  @Input()
  body = 'Are you sure?';
  @Input()
  cancel = 'Cancel';
  @Input()
  confirm = 'Confirm';
  @Input()
  confirmClickDelay = 0;

  confirmLoading = false;

  constructor(protected dialogRef: NbDialogRef<DialogComponent>) {}

  ngOnInit() {}

  cancelClicked() {
    this.dialogRef.close('cancel');
  }
  confirmClicked() {
    this.confirmLoading = true;
    setTimeout(() => {
      this.confirmLoading = false;
      this.dialogRef.close('confirm');
    }, this.confirmClickDelay);
  }
}
