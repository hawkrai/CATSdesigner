import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListOfGroupsComponent } from './list-of-groups.component';

describe('ListOfGroupsComponent', () => {
  let component: ListOfGroupsComponent;
  let fixture: ComponentFixture<ListOfGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListOfGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListOfGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
