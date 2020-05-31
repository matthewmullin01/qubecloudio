import { Component, OnInit, ViewChild } from '@angular/core';
import { NbStepperComponent } from '@nebular/theme';
import { CreateServerService } from './create-server.service';
import { serverLocations } from 'src/shared/models/server.model';

@Component({
  selector: 'app-create-server',
  templateUrl: './create-server.component.html',
  styleUrls: ['./create-server.component.scss'],
})
export class CreateServerComponent implements OnInit {
  @ViewChild('stepper') stepper: NbStepperComponent;

  constructor(private createServerSvc: CreateServerService) {}

  async ngOnInit() {
    await new Promise((_) => setTimeout(_, 10));
    this.createServerSvc.stepper = this.stepper;
  }
}
