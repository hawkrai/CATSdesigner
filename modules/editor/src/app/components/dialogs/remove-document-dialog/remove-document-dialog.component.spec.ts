import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveDocumentDialogComponent } from './remove-document-dialog.component';

describe('RemoveDocumentDialogComponent', () => {
  let component: RemoveDocumentDialogComponent;
  let fixture: ComponentFixture<RemoveDocumentDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveDocumentDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveDocumentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
