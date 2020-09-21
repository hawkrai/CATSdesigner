import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressControlComponent } from './progress-control.component';

describe('ProgressControlComponent', () => {
  let component: ProgressControlComponent;
  let fixture: ComponentFixture<ProgressControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
