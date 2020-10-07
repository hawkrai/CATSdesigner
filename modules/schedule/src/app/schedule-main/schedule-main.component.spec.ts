import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMainComponent } from './schedule-main.component';

describe('ScheduleMainComponent', () => {
  let component: ScheduleMainComponent;
  let fixture: ComponentFixture<ScheduleMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
