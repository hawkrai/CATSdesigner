import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfSubjectComponent } from './list-of-subject.component';

describe('ListOfSubjectComponent', () => {
  let component: ListOfSubjectComponent;
  let fixture: ComponentFixture<ListOfSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
