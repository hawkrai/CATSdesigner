import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectEventTypeComponent } from './select-event-type.component';

describe('SelectEventTypeComponent', () => {
  let component: SelectEventTypeComponent;
  let fixture: ComponentFixture<SelectEventTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectEventTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectEventTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
