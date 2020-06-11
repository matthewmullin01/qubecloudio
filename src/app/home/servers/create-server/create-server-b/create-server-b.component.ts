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
import { ICurseforgeData } from 'src/shared/models/curseforge.model';

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
    serverTypeSelection: 'java' | 'curseforge';
    jarUid?: string;
    curseforgeUid?: string;
  } = {
    name: null,
    description: null,
    location: 'us-west2',
    serverTypeSelection: 'java',
    jarUid: null,
    curseforgeUid: null,
  };

  jars$: Observable<IJar[]>;
  curseforgeData$: Observable<ICurseforgeData[]>;

  constructor(private createServerSvc: CreateServerService, private afs: AngularFirestore, private ss: SharedService) {}

  async ngOnInit() {
    this.user = await this.ss.getUser();
    this.jars$ = this.getJars();
    this.curseforgeData$ = this.getCurseforgeData();
    this.setDefaults();
  }

  async setDefaults() {
    this.formData.jarUid = (await this.jars$.pipe(take(1)).toPromise())[0].uid;
    this.formData.curseforgeUid = (await this.curseforgeData$.pipe(take(1)).toPromise())[0].uid;
  }

  getJars(): Observable<IJar[]> {
    return this.afs
      .collection<IJar>('/jars', (ref) => ref.orderBy('version', 'desc'))
      .valueChanges();
  }

  getCurseforgeData(): Observable<ICurseforgeData[]> {
    return this.afs
      .collection<ICurseforgeData>('/curseforge', (ref) => ref.orderBy('displayOrder', 'desc'))
      .valueChanges();
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const selectedJar =
      this.formData.serverTypeSelection === 'java'
        ? (await this.jars$.pipe(take(1)).toPromise()).find((a) => a.uid === this.formData.jarUid)
        : null;

    const selectedCurseforge =
      this.formData.serverTypeSelection === 'curseforge'
        ? (await this.curseforgeData$.pipe(take(1)).toPromise()).find((a) => a.uid === this.formData.curseforgeUid)
        : null;

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
      serverType: this.formData.serverTypeSelection === 'java' ? 'VANILLA' : 'CURSEFORGE',
      curseforge:
        this.formData.serverTypeSelection === 'curseforge'
          ? { modPackUrl: selectedCurseforge.modpackUrl, modPackVersion: selectedCurseforge.version, name: selectedCurseforge.displayName }
          : null,
      vanilla:
        this.formData.serverTypeSelection === 'java'
          ? {
              jarVersion: selectedJar.version,
              jarType: selectedJar.type,
              jarUrl: selectedJar.url,
              jarUid: selectedJar.uid,
            }
          : null,
      planId: this.createServerSvc.plan.id,
      paddleSubscriptionId: null, // This is set via paddle webhook in CF
      paddlePlanId: this.createServerSvc.plan.paddlePlanId,
      vmInfo: null, // This is set via createSever webhook
    };

    this.createServerSvc.stepper.next();
  }
}
