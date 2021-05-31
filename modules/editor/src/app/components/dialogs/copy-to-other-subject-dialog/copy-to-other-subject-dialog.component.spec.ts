/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CopyToOtherSubjectDialogComponent } from './copy-to-other-subject-dialog.component';

describe('CopyToOtherSubjectDialogComponent', () => {
  let component: CopyToOtherSubjectDialogComponent;
  let fixture: ComponentFixture<CopyToOtherSubjectDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CopyToOtherSubjectDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CopyToOtherSubjectDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
