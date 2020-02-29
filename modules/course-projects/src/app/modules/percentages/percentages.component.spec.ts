import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PercentagesComponent } from './percentages.component';

describe('PercentagesComponent', () => {
  let component: PercentagesComponent;
  let fixture: ComponentFixture<PercentagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PercentagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PercentagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
