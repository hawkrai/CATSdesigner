import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentageResultsComponent } from './percentage-results.component';

describe('PercentageResultsComponent', () => {
  let component: PercentageResultsComponent;
  let fixture: ComponentFixture<PercentageResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentageResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentageResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
