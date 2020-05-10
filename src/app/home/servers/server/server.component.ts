import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { IServer, serverLocations } from 'src/shared/models/server.model';
import { filter, map, take } from 'rxjs/operators';
import { NbMenuService, NbDialogService, NbToastrService } from '@nebular/theme';
import { AngularFirestore } from '@angular/fire/firestore';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { HttpClient } from '@angular/common/http';
import { ServerLogsComponent } from './server-logs/server-logs.component';
import { ServerPropertiesComponent } from './server-properties/server-properties.component';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss'],
})
export class ServerComponent implements OnInit {
  @Input() server: IServer;

  fullLocation: string;
  extraOptions: { title: ExtraOptionsMenuEnum }[] = [{ title: 'Delete' }, { title: 'Restart' }, { title: 'Configure' }];

  constructor(
    private nbMenuService: NbMenuService,
    private afs: AngularFirestore,
    private http: HttpClient,
    private toastr: NbToastrService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.fullLocation = this.mapGoogleLocationToArea(this.server.location);

    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === `server-menu-${this.server.uid}`),
        map(({ item: { title } }) => title)
      )
      .subscribe(async (title: ExtraOptionsMenuEnum) => {
        console.log(title);

        switch (title) {
          case 'Delete':
            this.openDeleteDialog();
            break;
          case 'Restart':
            this.restartServer();
            break;
          case 'Configure':
            this.openPropertiesDialog();
            break;
        }
      });
  }

  async openDeleteDialog() {
    const result = await this.dialogService
      .open(DialogComponent, {
        context: {
          title: 'Delete Server',
          body: `Deleting this server will remove it from you list of active servers and access to the server will be terminated. You will not be
          billed for this server from the end of the current billing cycle.
          <br><br> We will keep a backup of your game world for the next three months
          in case you change your mind.`,
          cancel: 'Go Back',
          confirm: `Delete Server`,
          confirmClickDelay: 1000,
        },
      })
      .onClose.pipe(take(1))
      .toPromise();

    if (result === 'confirm') {
      try {
        await this.deleteServer();
        this.toastr.info(`Server has been closed`, 'Removed');
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  }

  openLogsDialog() {
    this.dialogService.open(ServerLogsComponent, {
      context: {
        server: this.server,
      },
    });
  }

  openPropertiesDialog() {
    this.dialogService.open(ServerPropertiesComponent, {
      context: {
        server: this.server,
      },
    });
  }

  async getStatus() {
    const status = (await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/status`).toPromise()) as IStatusResult;
    console.log(status);
  }

  async restartServer() {
    const res = await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/restart`).toPromise();
    console.log(res);
  }

  async deleteServer() {
    const partialUpdate: Partial<IServer> = { status: 'deleted' };
    return await this.afs.doc(`/servers/${this.server.uid}`).update(partialUpdate);
  }

  mapGoogleLocationToArea(location: string) {
    const flattened = serverLocations.flatMap((a) => a.servers);

    return flattened.find((a) => a.id === location).location;
  }

  ipClicked(ip: string) {
    this.copyToClipboard(ip);
  }

  copyToClipboard(text: string) {
    const dummy = document.createElement('textarea');
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
  }
}

type ExtraOptionsMenuEnum = 'Delete' | 'Restart' | 'Configure';

interface IStatusResult {
  host: string;
  port: number;
  version: string;
  protocolVersion: number;
  onlinePlayers: number;
  maxPlayers: number;
  samplePlayers: { id: string; name: string }[];
  descriptionText: string;
  favicon?: any;
  modList?: any;
}
