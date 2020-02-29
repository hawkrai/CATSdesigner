import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitStatsComponent } from './visit-stats.component';

describe('VisitStatsComponent', () => {
  let component: VisitStatsComponent;
  let fixture: ComponentFixture<VisitStatsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitStatsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
