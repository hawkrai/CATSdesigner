import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableForStatsSubjectComponent } from './table-for-stats-subject.component';

describe('TableForStatsSubjectComponent', () => {
  let component: TableForStatsSubjectComponent;
  let fixture: ComponentFixture<TableForStatsSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableForStatsSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableForStatsSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
