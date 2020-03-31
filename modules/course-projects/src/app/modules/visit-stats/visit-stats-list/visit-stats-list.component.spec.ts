import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitStatsListComponent } from './visit-stats-list.component';

describe('VisitStatsListComponent', () => {
  let component: VisitStatsListComponent;
  let fixture: ComponentFixture<VisitStatsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisitStatsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisitStatsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
