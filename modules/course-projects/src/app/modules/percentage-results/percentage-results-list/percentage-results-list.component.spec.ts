import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageResultsListComponent } from './percentage-results-list.component';

describe('PercentageResultsListComponent', () => {
  let component: PercentageResultsListComponent;
  let fixture: ComponentFixture<PercentageResultsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageResultsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageResultsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
