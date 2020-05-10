import { Component, OnInit, Input } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';

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

  constructor(protected dialogRef: NbDialogRef<ServerPropertiesComponent>, private http: HttpClient) {}

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

    await this.updateServerProps(form.value);
    await this.restartServer();
  }

  async getServerProps() {
    return (await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/props`).toPromise()) as {};
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
