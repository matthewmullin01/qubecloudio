import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerFullComponent } from './server-full.component';

describe('ServerFullComponent', () => {
  let component: ServerFullComponent;
  let fixture: ComponentFixture<ServerFullComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerFullComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerFullComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
