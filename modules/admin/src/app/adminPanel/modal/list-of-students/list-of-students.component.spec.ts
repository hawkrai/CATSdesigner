import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfStudentsComponent } from './list-of-students.component';

describe('ListOfStudentsComponent', () => {
  let component: ListOfStudentsComponent;
  let fixture: ComponentFixture<ListOfStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
