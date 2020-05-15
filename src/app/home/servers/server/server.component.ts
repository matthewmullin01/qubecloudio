import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { IServer, serverLocations } from 'src/shared/models/server.model';
import { filter, map, take, catchError, switchMap } from 'rxjs/operators';
import { NbMenuService, NbDialogService, NbToastrService } from '@nebular/theme';
import { AngularFirestore } from '@angular/fire/firestore';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerLogsComponent } from './server-logs/server-logs.component';
import { ServerPropertiesComponent } from './server-properties/server-properties.component';
import { Observable, interval, of, throwError, timer } from 'rxjs';
import { ServerResourcesComponent } from './server-resources/server-resources.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss'],
})
export class ServerComponent implements OnInit {
  @Input() server: IServer;

  fullLocation: string;
  extraOptions: { title: ExtraOptionsMenuEnum }[] = [{ title: 'Settings' }, { title: 'Restart' }, { title: 'Delete' }];

  status$: Observable<StatusEnum>;
  statusBadgeUI$: Observable<{ status: string; text: string }>;

  constructor(
    private nbMenuService: NbMenuService,
    private afs: AngularFirestore,
    private http: HttpClient,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fullLocation = this.mapGoogleLocationToArea(this.server.location);
    this.handleMenu();
    this.status$ = this.getStatus$();
    this.statusBadgeUI$ = this.getStatusBadgeUI$();
  }

  private getStatusBadgeUI$() {
    console.log('Initing');

    return this.status$.pipe(
      map((status) => {
        console.log({ status });

        switch (status) {
          case 'offline':
            return { status: 'warning', text: 'Offline' };
          case 'online':
            return { status: 'success', text: 'Online' };
          case 'starting':
            return { status: 'info', text: 'Starting' };
        }
      })
    );
  }

  getStatus$() {
    return timer(0, 1000).pipe(
      switchMap((counter) => {
        return this.http.get(`http://${this.server.vmInfo.publicIP}:4000/status`).pipe<StatusEnum>(
          map((data: IStatusResult) => {
            console.log(data);

            return data.version ? 'online' : 'starting';
          })
        );
      }),
      catchError((error) => {
        console.log(error);
        return of('offline') as Observable<StatusEnum>;
      })
    );
  }

  handleMenu() {
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
            this.openRestartDialog();
            break;
          case 'Settings':
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
          confirmClickDelay: 200,
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

  async openRestartDialog() {
    const result = await this.dialogService
      .open(DialogComponent, {
        context: {
          title: 'Restart Server',
          body: `Are you sure you want to restart the server. It may take a few minutes to come back online`,
          cancel: 'Go Back',
          confirm: `Restart Server`,
          confirmClickDelay: 200,
        },
      })
      .onClose.pipe(take(1))
      .toPromise();

    if (result === 'confirm') {
      try {
        await this.restartServer();
        this.toastr.info(`Server is restarting`, 'Restarted');
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
      dialogClass: 'myadialog',
      context: {
        server: this.server,
      },
    });
  }

  openResourcesDialog() {
    this.dialogService.open(ServerResourcesComponent, {
      context: {
        server: this.server,
      },
    });
  }

  async restartServer() {
    const res = await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/restart`, { responseType: 'text' }).toPromise();
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

type ExtraOptionsMenuEnum = 'Delete' | 'Restart' | 'Settings';
type StatusEnum = 'starting' | 'offline' | 'online' | null;

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
