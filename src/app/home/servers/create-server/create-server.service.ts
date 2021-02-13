import { Injectable } from '@angular/core';
import { IPlan } from 'src/shared/models/plan.model';
import { NbStepperComponent } from '@nebular/theme';
import { IServer } from 'src/shared/models/server.model';

@Injectable({
  providedIn: 'root'
})
export class CreateServerService {
  server: IServer = {} as any;
  plan: IPlan = {} as any;
  stepper: NbStepperComponent;

  constructor() {}
}
