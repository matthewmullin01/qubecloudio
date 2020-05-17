import { Component, OnInit, Input, ViewChild, ElementRef, TemplateRef, OnDestroy } from '@angular/core';
import { IServer, serverLocations } from 'src/shared/models/server.model';
import { filter, map, take, catchError, switchMap, takeUntil } from 'rxjs/operators';
import { NbMenuService, NbDialogService, NbToastrService } from '@nebular/theme';
import { AngularFirestore } from '@angular/fire/firestore';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ServerLogsComponent } from './server-logs/server-logs.component';
import { ServerPropertiesComponent } from './server-properties/server-properties.component';
import { Observable, interval, of, throwError, timer, ReplaySubject } from 'rxjs';
import { ServerResourcesComponent } from './server-resources/server-resources.component';
import { Router } from '@angular/router';
import { ServersService, ServerStatusEnum } from '../servers.service';

@Component({
  selector: 'app-server',
  templateUrl: './server.component.html',
  styleUrls: ['./server.component.scss'],
})
export class ServerComponent implements OnInit, OnDestroy {
  @Input() server: IServer;

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  fullLocation: string;
  extraOptions: { title: ExtraOptionsMenuEnum }[] = [{ title: 'Settings' }, { title: 'Restart' }, { title: 'Delete' }];

  status$: Observable<ServerStatusEnum>;
  statusBadgeUI$: Observable<{ status: string; text: string }>;

  constructor(
    private nbMenuService: NbMenuService,
    private http: HttpClient,
    private serversService: ServersService,
    private dialogService: NbDialogService
  ) {}

  ngOnInit(): void {
    this.fullLocation = this.mapGoogleLocationToArea(this.server.location);
    this.handleMenu();
    this.status$ = this.serversService.getStatus$(this.server);
    this.statusBadgeUI$ = this.getStatusBadgeUI$();
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  private getStatusBadgeUI$() {
    return this.status$.pipe(
      map((status) => {
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

  handleMenu() {
    this.nbMenuService
      .onItemClick()
      .pipe(
        filter(({ tag }) => tag === `server-menu-${this.server.uid}`),
        map(({ item: { title } }) => title),
        takeUntil(this.destroyed$)
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
    this.serversService.openDeleteDialog(this.server);
  }

  async openRestartDialog() {
    this.serversService.openRestartDialog(this.server);
  }

  openPropertiesDialog() {
    this.serversService.openPropertiesDialog(this.server);
  }

  openLogsDialog() {
    this.dialogService.open(ServerLogsComponent, {
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
