import { Component, OnInit, Input, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { IServer } from 'src/shared/models/server.model';
import { NbDialogRef } from '@nebular/theme';
import { HttpClient } from '@angular/common/http';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { interval, of, Observable, timer, Subscription } from 'rxjs';
import { switchMap, map, take, tap } from 'rxjs/operators';
import * as moment from 'moment';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-server-resources',
  templateUrl: './server-resources.component.html',
  styleUrls: ['./server-resources.component.scss'],
})
export class ServerResourcesComponent implements OnInit, OnDestroy {
  @Input()
  server: IServer;

  @ViewChild('resourceChart') resourceChart: ElementRef;

  resources$: Observable<IResourceUsage[]>;

  selectedTime: 5 | 10 | 30 | 60 = 10;

  emptyChartData: ChartDataSets[] = [
    { label: 'CPU', data: [] },
    { label: 'RAM', data: [] },
  ];

  chartData: ChartDataSets[] = this.emptyChartData;

  loading = false;

  TICKS = 50;

  getInitialResources$: Subscription;
  startPollingResources$: Subscription;

  chartOptions: ChartOptions = {
    scales: {
      xAxes: [
        {
          type: 'time',
          ticks: {
            display: true,
            autoSkip: true,
            maxTicksLimit: 4,
          },
        },
      ],
    },
    responsive: true,
  };

  constructor(
    // protected dialogRef: NbDialogRef<ServerResourcesComponent>,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.getInitialResources$ = this.getInitialResources().subscribe();
    this.startPollingResources$ = this.startPollingResources().subscribe();
  }

  ngOnDestroy(): void {
    this.getInitialResources$.unsubscribe();
    this.startPollingResources$.unsubscribe();
  }

  getInitialResources() {
    this.loading = true;
    return of('').pipe(
      switchMap(() =>
        this.server.vmInfo?.publicIP
          ? (this.http.get(`${environment.functions.getResourcesProxy}?publicIP=${this.server.vmInfo.publicIP}`) as Observable<
              IResourceUsage[]
            >)
          : (of(null) as null)
      ),
      map((data) => data && this.getInitialChartData(data)),
      tap((a) => (this.loading = false))
    );
  }

  startPollingResources() {
    const pollingInterval = ((this.selectedTime * 60) / this.TICKS) * 1000;

    return timer(pollingInterval - 2000, pollingInterval).pipe(
      tap((_) => console.log('Polling Graph Data')),
      switchMap(() =>
        this.server.vmInfo?.publicIP
          ? (this.http.get(`${environment.functions.getResourcesNewestProxy}?publicIP=${this.server.vmInfo.publicIP}`) as Observable<
              IResourceUsage
            >)
          : (of(null) as null)
      ),
      map((data) => data && this.updateChartData(data))
    );
  }

  getInitialChartData(data: IResourceUsage[]) {
    const lowerDateRange = moment().subtract(this.selectedTime, 'minutes');
    const dateLimited = data.filter((a) => moment(a.date) > lowerDateRange);
    const mod = Math.round(dateLimited.length / this.TICKS); // 50 ticks

    const countLimited = dateLimited.filter((a, index) => index % mod === 0);

    const cpuData = countLimited.map((a) => {
      return {
        x: new Date(a.date),
        y: +a.cpu.replace('%', ''),
      };
    });

    const ramData = countLimited.map((a) => {
      return {
        x: new Date(a.date),
        y: +a.ram.replace('%', ''),
      };
    });

    this.chartData = [
      {
        label: 'CPU',
        data: cpuData,
      },
      {
        label: 'RAM',
        data: ramData,
      },
    ];
  }

  updateChartData(data: IResourceUsage) {
    const cpuData = {
      x: new Date(data.date),
      y: +data.cpu.replace('%', ''),
    };

    const ramData = {
      x: new Date(data.date),
      y: +data.ram.replace('%', ''),
    };

    this.chartData.find((a) => a.label === 'CPU').data.push(cpuData as any);
    this.chartData.find((a) => a.label === 'RAM').data.push(ramData as any);
  }

  selectTime(minutes: 5 | 10 | 30 | 60) {
    this.selectedTime = minutes;
    this.getInitialResources$.unsubscribe();
    this.getInitialResources$ = this.getInitialResources().subscribe();
    this.startPollingResources$.unsubscribe();
    this.startPollingResources$ = this.startPollingResources().subscribe();
  }
}

interface IResourceUsage {
  date: string;
  cpu: string;
  ram: string;
  hdd: string;
}
