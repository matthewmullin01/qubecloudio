import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CreateServerService } from '../create-server.service';
import { IServer } from 'src/shared/models/server.model';
import { SharedService } from 'src/shared/services/shared.service';
import { IUser } from 'src/shared/models/user.model';
import { IPassthrough } from 'src/shared/models/passthrough.model';
import { IPlan } from 'src/shared/models/plan.model';
import { HttpClient } from '@angular/common/http';
import { firestore } from 'firebase';

declare let Paddle: any;

@Component({
  selector: 'app-create-server-pay',
  templateUrl: './create-server-pay.component.html',
  styleUrls: ['./create-server-pay.component.scss'],
})
export class CreateServerPayComponent implements OnInit {
  server: IServer;
  plan: IPlan;
  user: IUser;
  @ViewChild('paddle', { static: true }) paddleElement: ElementRef;

  constructor(private createServerSvc: CreateServerService, private ss: SharedService) {
    console.log('INIT');
  }

  async ngOnInit() {
    this.server = this.createServerSvc.server;
    this.plan = this.createServerSvc.plan;
    this.user = await this.ss.getUser();
  }

  payClicked() {
    firestore()
      .doc(`servers/${this.server.uid}`)
      .set(this.server)
      .catch((e) => alert(e))
      .then((_) => console.log('success'));

    return;

    const passthrough: IPassthrough = { server: this.server, user: this.user };

    console.log(JSON.stringify(passthrough));

    Paddle.Checkout.open({
      product: this.server.paddlePlanId,
      email: this.user.email,
      passthrough,
      // closeCallback: 'checkoutClosed',
      successCallback: (data: PaddleData, error) => {
        if (error) {
          this.erroredPayment(error);
        } else {
          this.successfulPayment(data);
        }
      },
    });
  }

  successfulPayment(data: PaddleData) {
    // TODO - Listen for server vmInfo to be on firestore
  }

  erroredPayment(error: any) {
    // TODO - add nice error handler
  }
}

interface Coupon {
  coupon_code?: any;
}

interface Customer {
  currency: string;
  unit: string;
  unit_tax: string;
  total: string;
  total_tax: string;
}

interface Vendor {
  currency: string;
  unit: string;
  unit_tax: string;
  total: string;
  total_tax: string;
}

interface Prices {
  customer: Customer;
  vendor: Vendor;
}

interface Customer2 {
  currency: string;
  unit: string;
  unit_tax: string;
  total: string;
  total_tax: string;
}

interface Interval {
  length: number;
  type: string;
}

interface Vendor2 {
  currency: string;
  unit: string;
  unit_tax: string;
  total: string;
  total_tax: string;
}

interface RecurringPrices {
  customer: Customer2;
  interval: Interval;
  vendor: Vendor2;
}

interface Checkout {
  created_at: string;
  completed: boolean;
  id: string;
  coupon: Coupon;
  passthrough?: any;
  prices: Prices;
  redirect_url?: any;
  test_variant: string;
  recurring_prices: RecurringPrices;
}

interface Product {
  quantity: number;
  id: number;
  name: string;
}

interface User {
  id: string;
  email: string;
  country: string;
}

interface PaddleData {
  checkout: Checkout;
  product: Product;
  user: User;
}
