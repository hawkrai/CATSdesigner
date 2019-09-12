import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableForStudentsAndLectorsComponent } from './table-for-students-and-lectors.component';

describe('TableForStudentsAndLectorsComponent', () => {
  let component: TableForStudentsAndLectorsComponent;
  let fixture: ComponentFixture<TableForStudentsAndLectorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableForStudentsAndLectorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableForStudentsAndLectorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
