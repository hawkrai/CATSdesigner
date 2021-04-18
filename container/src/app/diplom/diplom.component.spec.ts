import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomComponent } from './diplom.component';

describe('DiplomComponent', () => {
  let component: DiplomComponent;
  let fixture: ComponentFixture<DiplomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiplomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiplomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
