import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLectorComponent } from './edit-lector.component';

describe('EditLectorComponent', () => {
  let component: EditLectorComponent;
  let fixture: ComponentFixture<EditLectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditLectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
