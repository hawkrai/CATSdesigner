import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableForStudentsComponent } from './table-for-students.component';

describe('TableForStudentsComponent', () => {
  let component: TableForStudentsComponent;
  let fixture: ComponentFixture<TableForStudentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableForStudentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableForStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
