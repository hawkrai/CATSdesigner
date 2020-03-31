import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSheetComponent } from './task-sheet.component';

describe('TaskSheetComponent', () => {
  let component: TaskSheetComponent;
  let fixture: ComponentFixture<TaskSheetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSheetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSheetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
