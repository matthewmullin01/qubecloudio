import { Component, OnInit, Input, Injector } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { NbDialogRef, NbToastrService, NbDialogService } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { DialogComponent } from 'src/shared/ui/dialog/dialog.component';
import { take } from 'rxjs/operators';
import { Router } from '@angular/router';
import { IMinecraftServerProps, IEditableMinecraftServerProps } from 'src/shared/models/minecraft-server-properties.model';

@Component({
  selector: 'app-server-properties',
  templateUrl: './server-properties.component.html',
  styleUrls: ['./server-properties.component.scss'],
})
export class ServerPropertiesComponent implements OnInit {
  @Input()
  server: IServer;

  properties: IEditableMinecraftServerProps | {};
  formData: {};

  loading = false;
  dialogRef;

  constructor(
    private injector: Injector,
    // protected dialogRef: NbDialogRef<ServerPropertiesComponent>,
    // protected dialogRef: NbDialogRef,
    private http: HttpClient,
    private toastr: NbToastrService,
    private dialogService: NbDialogService,
    private router: Router
  ) {
    if (true) {
      this.dialogRef = this.injector.get(NbDialogRef) as NbDialogRef<ServerPropertiesComponent>;
    }
  }

  async ngOnInit() {
    const rawProps: IMinecraftServerProps | {} = await this.getServerProps();
    const editableProps: IEditableMinecraftServerProps | {} = this.remapRawProps(rawProps);
    this.properties = editableProps;
    this.formData = this.properties;
  }

  async onSubmit(form: NgForm) {
    console.log('onSubmit: ', form.invalid);

    if (form.invalid) {
      return;
    }

    const result = await this.openUpdateDialog();

    if (result === 'confirm') {
      this.loading = true;
      try {
        await this.updateServerProps(form.value);
        await this.restartServer();
        this.dialogRef.close();
        this.toastr.info(`Server has updated and restarted`, 'Restarted');
        this.router.navigate(['/home/servers']);
        this.loading = false;
      } catch (error) {
        console.error(error);
        alert(error);
      }
    }
  }

  remapRawProps(rawProps: IMinecraftServerProps | {}): IEditableMinecraftServerProps | {} {
    if (Object.keys(rawProps).length === 0) {
      return {};
    }
    const p = rawProps as IMinecraftServerProps;

    const res: IEditableMinecraftServerProps = {
      'spawn-protection': p['spawn-protection'],
      // 'max-tick-time': p[// 'max-tick-time'],
      // 'query.port': p[// 'query.port'],
      // 'generator-settings': p[// 'generator-settings'],
      'force-gamemode': p['force-gamemode'],
      'allow-nether': p['allow-nether'],
      // 'enforce-whitelist': p[// 'enforce-whitelist'],
      gamemode: p.gamemode,
      'broadcast-console-to-ops': p['broadcast-console-to-ops'],
      // 'enable-query': p[// 'enable-query'],
      'player-idle-timeout': p['player-idle-timeout'],
      difficulty: p.difficulty,
      'spawn-monsters': p['spawn-monsters'],
      'broadcast-rcon-to-ops': p['broadcast-rcon-to-ops'],
      'op-permission-level': p['op-permission-level'],
      pvp: p.pvp,
      // 'snooper-enabled': p[// 'snooper-enabled'],
      'level-type': p['level-type'],
      hardcore: p.hardcore,
      'enable-command-block': p['enable-command-block'],
      'max-players': p['max-players'],
      'network-compression-threshold': p['network-compression-threshold'],
      // 'resource-pack-sha1': p['resource-pack-sha1'],
      'max-world-size': p['max-world-size'],
      'function-permission-level': p['function-permission-level'],
      // 'rcon.port': p[// 'rcon.port'],
      // 'server-port': p[// 'server-port'],
      // 'texture-pack': p[// 'texture-pack'],
      // 'server-ip': p[// 'server-ip'],
      'spawn-npcs': p['spawn-npcs'],
      'allow-flight': p['allow-flight'],
      'level-name': p['level-name'],
      'view-distance': p['view-distance'],
      // 'resource-pack': p[// 'resource-pack'],
      'spawn-animals': p['spawn-animals'],
      'white-list': p['white-list'],
      // 'rcon.password': p[// 'rcon.password'],
      'generate-structures': p['generate-structures'],
      'online-mode': p['online-mode'],
      'max-build-height': p['max-build-height'],
      'level-seed': p['level-seed'],
      // 'use-native-transport': p[// 'use-native-transport'],
      // 'prevent-proxy-connections': p[// 'prevent-proxy-connections'],
      motd: p.motd,
      // 'enable-rcon': p[// 'enable-rcon'],
    };

    return res;
  }

  async openUpdateDialog() {
    return await this.dialogService
      .open(DialogComponent, {
        context: {
          title: 'Apply Changes',
          body: `To apply these changes we will need to restart the server. This may take a few minutes.`,
          cancel: 'Go Back',
          confirm: `Apply and Restart Server`,
          confirmClickDelay: 200,
        },
      })
      .onClose.pipe(take(1))
      .toPromise();
  }

  async getServerProps(): Promise<IMinecraftServerProps | {}> {
    if (!this.server.vmInfo?.publicIP) {
      return {};
    }
    return (await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/props`).toPromise()) as IMinecraftServerProps;
  }

  async updateServerProps(props: {}) {
    console.log(JSON.stringify(props));

    const res = await this.http
      .post(`http://${this.server.vmInfo.publicIP}:4000/props`, { data: props }, { responseType: 'text' })
      .toPromise();
    console.log('updateServerProps: ', res);
  }

  async restartServer() {
    const res = await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/restart`, { responseType: 'text' }).toPromise();
    console.log(res);
  }
}
