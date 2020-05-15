import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { IServer } from 'src/shared/models/server.model';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { ServerPropertiesComponent } from '../server/server-properties/server-properties.component';
import { take } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-server-full',
  templateUrl: './server-full.component.html',
  styleUrls: ['./server-full.component.scss'],
})
export class ServerFullComponent implements OnInit {
  server$: Observable<IServer>;
  server: IServer;

  // TODO move duplicated code (dialogs and restart/delete server into a jobs service)
  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
    private http: HttpClient
  ) {
    this.server$ = this.route.snapshot.data.server$; // Retrieved from serverResolver
  }

  async ngOnInit() {
    this.server = await this.server$.pipe(take(1)).toPromise();
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

  openPropertiesDialog() {
    this.dialogService.open(ServerPropertiesComponent, {
      dialogClass: 'myadialog',
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
}
