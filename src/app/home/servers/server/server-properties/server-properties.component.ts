import { Component, OnInit, Input } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { NbDialogRef, NbToastrService, NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-server-properties',
  templateUrl: './server-properties.component.html',
  styleUrls: ['./server-properties.component.scss'],
})
export class ServerPropertiesComponent implements OnInit {
  @Input()
  server: IServer;

  properties: {};
  formData: {};

  loading = false;

  constructor(
    // protected dialogRef: NbDialogRef<ServerPropertiesComponent>,
    private http: HttpClient,
    private toastr: NbToastrService,
    private dialogService: NbDialogService
  ) {}

  async ngOnInit() {
    const rawProps = await this.getServerProps();
    this.properties = rawProps;
    this.formData = this.properties;
  }

  async onSubmit(form: NgForm) {
    console.log('onSubmit: ', form.invalid);

    if (form.invalid) {
      return;
    }

    const result = await this.openUpdateDialog();

    if (result === 'confirm') {
      try {
        await this.updateServerProps(form.value);
        await this.restartServer();
        this.toastr.info(`Server has updated and restarted`, 'Restarted');
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  }

  async openUpdateDialog() {
    return await this.dialogService
      .open(DialogComponent, {
        context: {
          title: 'Apply Changes',
          body: `To apply these changes we will need to restart the server. This may take a few minutes.`,
          cancel: 'Go Back',
          confirm: `Apply and Restart Server`,
          confirmClickDelay: 200,
        },
      })
      .onClose.pipe(take(1))
      .toPromise();
  }

  async getServerProps() {
    if (!this.server.vmInfo?.publicIP) {
      return {};
    }
    return (await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/props`).toPromise()) as { [key: string]: string };
  }

  async updateServerProps(props: {}) {
    console.log(JSON.stringify(props));

    const res = await this.http
      .post(`http://${this.server.vmInfo.publicIP}:4000/props`, { data: props }, { responseType: 'text' })
      .toPromise();
    console.log('updateServerProps: ', res);
  }

  async restartServer() {
    const res = await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/restart`, { responseType: 'text' }).toPromise();
    console.log(res);
  }
}
