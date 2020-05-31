import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerPropertiesComponent } from './server-properties.component';

describe('ServerPropertiesComponent', () => {
  let component: ServerPropertiesComponent;
  let fixture: ComponentFixture<ServerPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
