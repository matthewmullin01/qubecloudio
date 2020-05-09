import { Component, OnInit } from '@angular/core';
import { plans as _plans, IPlan } from 'src/shared/models/plan.model';
import { CreateServerService } from '../create-server.service';

// TODO - Make UI of plan selection prettier (see https://cubedhost.com/plans)
@Component({
  selector: 'app-create-server-a',
  templateUrl: './create-server-a.component.html',
  styleUrls: ['./create-server-a.component.scss']
})
export class CreateServerAComponent implements OnInit {
  plans = _plans;

  constructor(private createServerSvc: CreateServerService) {}

  ngOnInit(): void {}

  selectClicked(plan: IPlan) {
    console.log('clicked');

    this.createServerSvc.plan = plan;
    this.createServerSvc.stepper.next();
  }
}
