import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupNotFoundComponent } from './group-not-found.component';

describe('GroupNotFoundComponent', () => {
  let component: GroupNotFoundComponent;
  let fixture: ComponentFixture<GroupNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupNotFoundComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
