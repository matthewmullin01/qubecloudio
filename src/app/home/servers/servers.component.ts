import { Component, OnInit } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { SharedService } from 'src/shared/services/shared.service';
import { IUser } from 'src/shared/models/user.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.scss']
})
export class ServersComponent implements OnInit {
  servers$: Observable<IServer[]>;
  user: IUser;

  constructor(private afs: AngularFirestore, private ss: SharedService) {}

  async ngOnInit() {
    this.user = await this.ss.getUser();
    console.log(this.user.uid);

    this.servers$ = this.getServers();
  }

  getServers(): Observable<IServer[]> {
    return this.afs
      .collection<IServer>('/servers', ref => ref.where('userUid', '==', this.user.uid).where('status', '==', 'active'))
      .valueChanges();
  }
}
