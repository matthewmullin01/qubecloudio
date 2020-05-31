import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateServerAComponent } from './create-server-a.component';

describe('CreateServerAComponent', () => {
  let component: CreateServerAComponent;
  let fixture: ComponentFixture<CreateServerAComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateServerAComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateServerAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
