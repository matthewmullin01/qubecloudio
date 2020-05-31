import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServerPayComponent } from './create-server-pay.component';

describe('CreateServerPayComponent', () => {
  let component: CreateServerPayComponent;
  let fixture: ComponentFixture<CreateServerPayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServerPayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServerPayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
