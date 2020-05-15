import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreateServerService } from '../create-server.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { IUser } from 'src/shared/models/user.model';
import { SharedService } from 'src/shared/services/shared.service';
import { serverLocations as _serverLocations } from 'src/shared/models/server.model';
import { firestore } from 'firebase';
import { IJar } from 'src/shared/models/jar.model';
import { Observable } from 'rxjs';
import { take, find } from 'rxjs/operators';

@Component({
  selector: 'app-create-server-b',
  templateUrl: './create-server-b.component.html',
  styleUrls: ['./create-server-b.component.scss'],
})
export class CreateServerBComponent implements OnInit {
  user: IUser;

  serverLocations = _serverLocations;
  formData: {
    name: string;
    description: string;
    location: string;
    jarUid: string;
  } = {
    name: null,
    description: null,
    location: 'us-west2',
    jarUid: null,
  };

  jars$: Observable<IJar[]>;

  constructor(private createServerSvc: CreateServerService, private afs: AngularFirestore, private ss: SharedService) {}

  async ngOnInit() {
    this.user = await this.ss.getUser();
    this.jars$ = this.getJars();
    this.setDefaults();
  }

  async setDefaults() {
    this.formData.jarUid = (await this.jars$.pipe(take(1)).toPromise())[0].uid;
  }

  getJars(): Observable<IJar[]> {
    return this.afs
      .collection<IJar>('/jars', (ref) => ref.orderBy('version', 'desc'))
      .valueChanges();
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const selectedJar = (await this.jars$.pipe(take(1)).toPromise()).find((a) => a.uid === this.formData.jarUid);

    this.createServerSvc.server = {
      uid: this.afs.createId(),
      status: 'active',
      userUid: this.user.uid,
      userName: this.user.name,
      userEmail: this.user.email,
      name: this.formData.name,
      description: this.formData.description,
      location: this.formData.location,
      createdTime: firestore.Timestamp.now(),
      jarVersion: selectedJar.version,
      jarType: selectedJar.type,
      jarUrl: selectedJar.url,
      jarUid: selectedJar.uid,
      planId: this.createServerSvc.plan.id,
      paddleSubscriptionId: null, // This is set via paddle webhook in CF
      paddlePlanId: this.createServerSvc.plan.paddlePlanId,
      vmInfo: null, // This is set via createSever webhook
    };

    console.log(this.createServerSvc.server);

    this.createServerSvc.stepper.next();
  }
}
