import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDocumentDialogComponent } from './add-document-dialog.component';

describe('AddDocumentDialogComponent', () => {
  let component: AddDocumentDialogComponent;
  let fixture: ComponentFixture<AddDocumentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDocumentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
