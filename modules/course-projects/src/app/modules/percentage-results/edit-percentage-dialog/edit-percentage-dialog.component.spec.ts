import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPercentageDialogComponent } from './edit-percentage-dialog.component';

describe('EditPercentageDialogComponent', () => {
  let component: EditPercentageDialogComponent;
  let fixture: ComponentFixture<EditPercentageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPercentageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPercentageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
