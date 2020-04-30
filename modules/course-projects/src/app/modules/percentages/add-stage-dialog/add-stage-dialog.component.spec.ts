import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStageDialogComponent } from './add-stage-dialog.component';

describe('AddStageDialogComponent', () => {
  let component: AddStageDialogComponent;
  let fixture: ComponentFixture<AddStageDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStageDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
