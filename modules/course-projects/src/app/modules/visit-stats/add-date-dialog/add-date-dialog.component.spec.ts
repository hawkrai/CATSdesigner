import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDateDialogComponent } from './add-date-dialog.component';

describe('AddDateDialogComponent', () => {
  let component: AddDateDialogComponent;
  let fixture: ComponentFixture<AddDateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
