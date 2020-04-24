import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { CreateServerService } from '../create-server.service';

@Component({
  selector: 'app-create-server-b',
  templateUrl: './create-server-b.component.html',
  styleUrls: ['./create-server-b.component.scss']
})
export class CreateServerBComponent implements OnInit {
  formData: {
    name: string;
    description: string;
  } = {
    name: null,
    description: null
  };

  constructor(private createServerSvc: CreateServerService) {}

  ngOnInit(): void {}

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.createServerSvc.server = {
      name: this.formData.name,
      description: this.formData.description,
      plan: this.createServerSvc.server.plan // Already set in previous step
    };

    console.log(this.createServerSvc.server);

    this.createServerSvc.stepper.next();
  }
}
