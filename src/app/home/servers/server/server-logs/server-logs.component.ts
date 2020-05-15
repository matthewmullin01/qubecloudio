import { Component, OnInit, Input } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-server-logs',
  templateUrl: './server-logs.component.html',
  styleUrls: ['./server-logs.component.scss'],
})
export class ServerLogsComponent implements OnInit {
  @Input()
  server: IServer;

  logs: string;

  constructor(
    // protected dialogRef: NbDialogRef<ServerLogsComponent>,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    await this.updateLogs();
  }

  async updateLogs() {
    const rawLogs = await this.getLogs();
    this.logs = rawLogs
      .split('\n')
      .reverse()
      .join('\n') // reverse to have newest on top
      .replace('\n', '<br />')
      .replace(/(\[\d{2}:\d{2}:\d{2}\])/g, '<span style="color: #666666">$1</span>')
      .replace(/(\[\D.*INFO.*\]:?)/g, '<span style="color: #8be9fd">$1</span>')
      .replace(/(\[\D.*ERR.*\]:?)/g, '<span style="color: #df1426">$1</span>')
      .replace(/(\[\D.*WARN.*\]:?)/g, '<span style="color: #f1fa8c">$1</span>');
  }

  async getLogs() {
    return ((await this.http.get(`http://${this.server.vmInfo.publicIP}:4000/logs`).toPromise()) as { logs: string }).logs;
  }
}
