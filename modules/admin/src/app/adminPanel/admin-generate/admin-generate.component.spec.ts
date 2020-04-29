import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGenerateComponent } from './admin-generate.component';

describe('AdminGenerateComponent', () => {
  let component: AdminGenerateComponent;
  let fixture: ComponentFixture<AdminGenerateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminGenerateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminGenerateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
