import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTaskSheetComponent } from './edit-task-sheet.component';

describe('EditTaskSheetComponent', () => {
  let component: EditTaskSheetComponent;
  let fixture: ComponentFixture<EditTaskSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditTaskSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTaskSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
