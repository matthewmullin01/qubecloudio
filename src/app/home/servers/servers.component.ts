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

  // async createCFs() {
  //   const curseForges: ICurseforgeData[] = [
  //     {
  //       displayName: 'RLCraft',
  //       displayOrder: 10,
  //       modpackUrl: 'https://media.forgecdn.net/files/2935/323/RLCraft+Server+Pack+1.12.2+-+Beta+v2.8.2.zip',
  //       version: '1.12.2',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'SkyFactory 4',
  //       displayOrder: 20,
  //       modpackUrl: 'https://media.forgecdn.net/files/2787/18/SkyFactory_4_Server_4.1.0.zip',
  //       version: '4.1.0',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'Valhelsia 2',
  //       displayOrder: 30,
  //       modpackUrl: 'https://media.forgecdn.net/files/2973/985/Valhelsia_SERVER-2.2.2a.zip',
  //       version: '2.2.2a',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'MC Eternal',
  //       displayOrder: 40,
  //       modpackUrl: 'https://media.forgecdn.net/files/2932/890/MCEternal(ServerPack1.3.5.3).zip',
  //       version: '1.3.5.3',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'Roguelike Adventures and Dungeons',
  //       displayOrder: 50,
  //       modpackUrl: 'https://media.forgecdn.net/files/2948/426/RAD-Serverpack-1.38.zip',
  //       version: '1.3.8',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'SevTech: Ages',
  //       displayOrder: 60,
  //       modpackUrl: 'https://media.forgecdn.net/files/2788/614/SevTech_Ages_Server_3.1.2-hotfix.1.zip',
  //       version: '3.1.2',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'Stoneblock 2',
  //       displayOrder: 70,
  //       modpackUrl: 'https://media.forgecdn.net/files/2727/712/FTBPresentsStoneblock2Server_1.15.0.zip',
  //       version: '1.15.0',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'SkyFactory 3',
  //       displayOrder: 80,
  //       modpackUrl: 'https://media.forgecdn.net/files/2481/284/FTBPresentsSkyfactory3Server_3.0.15.zip',
  //       version: '3.0.15',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'FTB Infinity Evolved',
  //       displayOrder: 90,
  //       modpackUrl: 'https://media.forgecdn.net/files/2731/545/FTBInfinityServer_3.1.0.zip',
  //       version: '3.1.0',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'StoneBlock',
  //       displayOrder: 100,
  //       modpackUrl: 'https://media.forgecdn.net/files/2699/533/StoneBlock-1.0.35-Server.zip',
  //       version: '1.0.35',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'Life in the Village',
  //       displayOrder: 110,
  //       modpackUrl: 'https://media.forgecdn.net/files/2967/675/LITV-Serverpack-1.20.zip',
  //       version: '1.20',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'Farming Valley',
  //       displayOrder: 120,
  //       modpackUrl: 'https://media.forgecdn.net/files/2928/843/FarmingValleyServer_0991.zip',
  //       version: '0991',
  //       uid: this.afs.createId(),
  //     },
  //     {
  //       displayName: 'FTB Revelation',
  //       displayOrder: 130,
  //       modpackUrl: 'https://media.forgecdn.net/files/2746/968/FTBRevelationServer_3.1.0.zip',
  //       version: '3.1.0',
  //       uid: this.afs.createId(),
  //     },
  //   ];

  //   curseForges.forEach((c) => {
  //     this.afs.doc(`curseforge/${c.uid}`).set(c);
  //   });
  // }
}
