import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CreateServerService } from '../create-server.service';
import { IServer } from 'src/shared/models/server.model';

declare let paypal: any;

@Component({
  selector: 'app-create-server-pay',
  templateUrl: './create-server-pay.component.html',
  styleUrls: ['./create-server-pay.component.scss']
})
export class CreateServerPayComponent implements OnInit {
  server: IServer;
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;

  constructor(private createServerSvc: CreateServerService) {
    console.log('INIT');
  }

  ngOnInit(): void {
    paypal
      .Buttons({
        enableStandardCardFields: true,
        experience_profile_id: 'XP-G837-A8WT-6PMR-28FP',

        createSubscription: (data, actions) => {
          return actions.subscription.create({
            plan_id: this.server.plan.paypalId,
            application_context: {
              brand_name: 'QubeCloud',
              locale: 'en-US',
              shipping_preference: 'NO_SHIPPING',
              user_action: 'CONTINUE'
            }
          });
        },

        onApprove(data, actions) {
          alert('You have successfully created subscription ' + data.subscriptionID);
        }
      })
      .render(this.paypalElement.nativeElement);

    this.server = this.createServerSvc.server;
  }
}
