import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LectorModalComponent } from './lector-modal.component';

describe('LectorModalComponent', () => {
  let component: LectorModalComponent;
  let fixture: ComponentFixture<LectorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LectorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LectorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
