import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteLectorComponent } from './delete-lector.component';

describe('DeleteLectorComponent', () => {
  let component: DeleteLectorComponent;
  let fixture: ComponentFixture<DeleteLectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteLectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteLectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
