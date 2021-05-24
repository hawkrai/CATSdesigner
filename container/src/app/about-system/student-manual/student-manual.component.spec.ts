import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentManualComponent } from './student-manual.component';

describe('AboutSystemComponent', () => {
  let component: StudentManualComponent;
  let fixture: ComponentFixture<StudentManualComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StudentManualComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentManualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
