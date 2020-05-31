import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServerPropertiesUiComponent } from './server-properties-ui.component';

describe('ServerPropertiesUiComponent', () => {
  let component: ServerPropertiesUiComponent;
  let fixture: ComponentFixture<ServerPropertiesUiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServerPropertiesUiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServerPropertiesUiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
