import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentagesListComponent } from './percentages-list.component';

describe('PercentagesListComponent', () => {
  let component: PercentagesListComponent;
  let fixture: ComponentFixture<PercentagesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentagesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentagesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
