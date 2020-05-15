import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IServer } from 'src/shared/models/server.model';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class ServerResolver implements Resolve<Observable<IServer>> {
  constructor(private activatedRoute: ActivatedRoute, private afs: AngularFirestore) {}

  async resolve(route: ActivatedRouteSnapshot) {
    const serverUid = route.params.serverUid;
    const server$ = this.afs.doc<IServer>(`servers/${serverUid}`).valueChanges();
    return server$;
  }
}
