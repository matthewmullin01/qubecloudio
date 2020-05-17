import { Component, OnInit } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { SharedService } from 'src/shared/services/shared.service';
import { IUser } from 'src/shared/models/user.model';
import { Observable } from 'rxjs';
import { ServersService } from './servers.service';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss'],
})
export class ServersComponent implements OnInit {
  servers$: Observable<IServer[]>;
  user: IUser;

  constructor(private ss: SharedService, private serversService: ServersService) {}

  async ngOnInit() {
    this.user = await this.ss.getUser();
    this.servers$ = this.serversService.usersServers$;
  }
}
