import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServerBComponent } from './create-server-b.component';

describe('CreateServerBComponent', () => {
  let component: CreateServerBComponent;
  let fixture: ComponentFixture<CreateServerBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServerBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServerBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
