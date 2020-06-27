import { Injectable } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { Observable, timer, of, BehaviorSubject } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAnalytics } from '@angular/fire/analytics';
import { SharedService } from 'src/shared/services/shared.service';
import { IUser } from 'src/shared/models/user.model';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { take, switchMap, map, catchError, tap, retryWhen, delay } from 'rxjs/operators';
import { ServerPropertiesComponent } from './server/server-properties/server-properties.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServersService {
  private user: IUser;
  usersServers$: Observable<IServer[]>;

  serverStatuses: { serverUid: string; status: BehaviorSubject<ServerStatusEnum> }[] = [];

  constructor(
    private afs: AngularFirestore,
    private ss: SharedService,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
    private http: HttpClient,
    private router: Router,
    private analytics: AngularFireAnalytics
  ) {
    this.onInit();
  }

  async onInit() {
    this.user = await this.ss.getUser();
    this.usersServers$ = this.getUsersServers();

    // (await this.usersServers$.pipe(take(1)).toPromise()).forEach((server, i) => {
    //   console.log(i, server.uid);
    //   this.serverStatuses.push({ serverUid: server.uid, status: new BehaviorSubject(null) });
    //   this.pollServerStatus(server);
    // });

    this.usersServers$
      .pipe(
        map((servers) => {
          servers.forEach((server, i) => {
            console.log(i, server.uid);
            if (!this.serverStatuses.find((a) => a.serverUid === server.uid)) {
              this.serverStatuses.push({ serverUid: server.uid, status: new BehaviorSubject(null) });
              this.pollServerStatus(server.uid);
            }
          });
        })
      )
      .subscribe();
  }

  private getUsersServers(): Observable<IServer[]> {
    return this.afs
      .collection<IServer>('/servers', (ref) => ref.where('userUid', '==', this.user.uid).where('status', '==', 'active'))
      .valueChanges();
  }

  private pollServerStatus(serverUid: string, initDelay: number = 0) {
    const index = this.serverStatuses.findIndex((a) => a.serverUid === serverUid);
    const statusObservable = this.serverStatuses[index].status;
    timer(initDelay, 5000)
      .pipe(
        tap(() => console.log('Polling Server Statuses')),
        switchMap(async () => {
          const servers = await this.usersServers$.pipe(take(1)).toPromise();

          const server = servers.find((a) => a.uid === serverUid) as IServer;

          if (!server.vmInfo?.publicIP) {
            statusObservable.next('offline');
            // return of<ServerStatusEnum>('offline');
          }

          this.http
            .get(`${environment.functions.getStatusProxy}?publicIP=${server.vmInfo.publicIP}`)
            // Success Handler
            .pipe(
              tap((data: IStatusResult) => {
                statusObservable.next(data.Status === 'healthy' ? 'online' : 'starting');
              })
            )
            // Error Handler
            .pipe(
              catchError((error) => {
                console.warn(error);
                statusObservable.next('offline');
                return error;
              })
            )
            // Final Return Handler
            .pipe((status) => status)
            .pipe(take(1))
            .subscribe();
        }),
        retryWhen((errors) => errors.pipe(delay(15000), take(10)))
      )
      .subscribe();
  }

  getStatus$(server: IServer, initDelay: number = 0) {
    if (!server) {
      return of(null);
    }
    return this.serverStatuses?.find((a) => a.serverUid === server.uid)?.status;

    // return timer(initDelay, 5000).pipe(
    //   tap(() => console.log('Polling Server Status')),
    //   switchMap(() => {
    //     if (!server.vmInfo?.publicIP) {
    //       return of<ServerStatusEnum>('offline');
    //     }

    //     return (
    //       this.http
    //         .get(`${environment.functions.getStatusProxy}?publicIP=${server.vmInfo.publicIP}`)
    //         // Success Handler
    //         .pipe<ServerStatusEnum>(
    //           map((data: IStatusResult) => {
    //             return data.Status === 'healthy' ? 'online' : 'starting';
    //           })
    //         )
    //         // Error Handler
    //         .pipe<ServerStatusEnum>(
    //           catchError<any, Observable<ServerStatusEnum>>((error) => {
    //             console.warn(error);
    //             return of<ServerStatusEnum>('offline');
    //           })
    //         )
    //         // Final Return Handler
    //         .pipe((status) => status)
    //     );
    //   }),
    //   retryWhen((errors) => errors.pipe(delay(15000), take(10)))
    // );
  }

  async openDeleteDialog(server: IServer) {
    const result = await this.dialogService
      .open(DialogComponent, {
        context: {
          title: 'Delete Server',
          body: `Deleting this server will remove it from you list of active servers and access to the server will be terminated. You will not be
          billed for this server from the end of the current billing cycle.
          `,
          // <br><br> We will keep a backup of your game world for the next three months
          // in case you change your mind.
          cancel: 'Go Back',
          confirm: `Delete Server`,
          confirmClickDelay: 1000,
        },
      })
      .onClose.pipe(take(1))
      .toPromise();

    if (result === 'confirm') {
      try {
        await this.deleteServer(server);
        this.toastr.info(`Server has been closed`, 'Removed');
        this.router.navigate(['/home/servers']);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  }

  async openRestartDialog(server: IServer) {
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
        await this.restartServer(server);
        this.toastr.info(`Server is restarting`, 'Restarting');
        this.router.navigate(['/home/servers']);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  }

  openPropertiesDialog(server: IServer) {
    this.dialogService.open(ServerPropertiesComponent, {
      context: {
        server,
      },
    });
  }

  private async restartServer(server: IServer) {
    this.analytics.logEvent('server_restart');
    const res = await this.http
      .get(`${environment.functions.restartProxy}?publicIP=${server.vmInfo.publicIP}`, { responseType: 'text' })
      .toPromise();
    console.log(res);
  }

  private async deleteServer(server: IServer) {
    this.analytics.logEvent('server_delete');
    const partialUpdate: Partial<IServer> = { status: 'deleted' };
    return await this.afs.doc(`/servers/${server.uid}`).update(partialUpdate);
  }
}

export type ServerStatusEnum = 'starting' | 'offline' | 'online' | null;

interface IStatusResult {
  Status: 'healthy' | 'starting' | 'unhealthy';
  FailingStreak: number;
  Log: { Start: Date; End: Date; ExitCode: number; Output: string }[];
}
