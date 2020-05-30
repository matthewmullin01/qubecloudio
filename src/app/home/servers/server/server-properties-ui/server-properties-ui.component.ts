import { Component, OnInit, Input } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { NbDialogRef, NbToastrService, NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { take } from 'rxjs/operators';
import { ServerPropertiesComponent } from '../server-properties/server-properties.component';
import { IMinecraftServerProps } from 'src/shared/models/minecraft-server-properties.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-server-properties-ui',
  templateUrl: './server-properties-ui.component.html',
  styleUrls: ['./server-properties-ui.component.scss'],
})
export class ServerPropertiesUiComponent implements OnInit {
  @Input()
  server: IServer;

  properties: IMinecraftServerProps | {};
  formData: {};

  loading = false;

  constructor(
    // protected dialogRef: NbDialogRef<ServerPropertiesComponent>,
    private http: HttpClient,
    private dialogService: NbDialogService
  ) {}

  async ngOnInit() {
    const rawProps: IMinecraftServerProps | {} = await this.getServerProps();
    this.properties = rawProps;
    this.formData = this.properties;
  }

  async editForm() {
    this.dialogService.open(ServerPropertiesComponent, {
      context: {
        server: this.server,
      },
    });
  }

  async getServerProps(): Promise<IMinecraftServerProps | {}> {
    if (!this.server.vmInfo?.publicIP) {
      return {};
    }
    return (await this.http
      .get(`${environment.functions.getPropsProxy}?publicIP=${this.server.vmInfo.publicIP}`)
      .toPromise()) as IMinecraftServerProps;
  }
}
