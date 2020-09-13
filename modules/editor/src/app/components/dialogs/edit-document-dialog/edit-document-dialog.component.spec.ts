import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDocumentDialogComponent } from './edit-document-dialog.component';

describe('EditDocumentDialogComponent', () => {
  let component: EditDocumentDialogComponent;
  let fixture: ComponentFixture<EditDocumentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDocumentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
