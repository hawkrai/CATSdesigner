import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudDocumentMenuComponent } from './crud-document-menu.component';

describe('CrudDocumentMenuComponent', () => {
  let component: CrudDocumentMenuComponent;
  let fixture: ComponentFixture<CrudDocumentMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudDocumentMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudDocumentMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
