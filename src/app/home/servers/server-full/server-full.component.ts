import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { IServer } from 'src/shared/models/server.model';
import { NbToastrService, NbDialogService } from '@nebular/theme';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { AngularFirestore } from '@angular/fire/firestore';
import { ServerPropertiesComponent } from '../server/server-properties/server-properties.component';
import { take, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ServersService, ServerStatusEnum } from '../servers.service';

@Component({
  selector: 'app-server-full',
  templateUrl: './server-full.component.html',
  styleUrls: ['./server-full.component.scss'],
})
export class ServerFullComponent implements OnInit {
  server$: Observable<IServer>;
  server: IServer;
  status$: Observable<ServerStatusEnum>;
  statusBadgeUI$: Observable<{ status: string; text: string }>;

  // TODO move duplicated code (dialogs and restart/delete server into a jobs service)
  constructor(private route: ActivatedRoute, private serversService: ServersService) {}

  async ngOnInit() {
    this.server$ = this.route.snapshot.data.server$; // Retrieved from serverResolver
    this.server = await this.server$.pipe(take(1)).toPromise();
    this.status$ = this.serversService.getStatus$(this.server);
    this.statusBadgeUI$ = this.getStatusBadgeUI$();
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

  async openDeleteDialog() {
    this.serversService.openDeleteDialog(this.server);
  }

  async openRestartDialog() {
    this.serversService.openRestartDialog(this.server);
  }

  openPropertiesDialog() {
    this.serversService.openPropertiesDialog(this.server);
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
