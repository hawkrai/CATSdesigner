import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorManualComponent } from './lector-manual.component';

describe('AboutSystemComponent', () => {
  let component: LectorManualComponent;
  let fixture: ComponentFixture<LectorManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectorManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectorManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
