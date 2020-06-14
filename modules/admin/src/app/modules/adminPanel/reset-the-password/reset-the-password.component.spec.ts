import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetThePasswordComponent } from './reset-the-password.component';

describe('ResetThePasswordComponent', () => {
  let component: ResetThePasswordComponent;
  let fixture: ComponentFixture<ResetThePasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetThePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetThePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
