import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DocumentPreview } from 'src/app/models/DocumentPreview';

@Component({
  selector: 'crud-document-menu',
  templateUrl: './crud-document-menu.component.html',
  styleUrls: ['./crud-document-menu.component.scss']
})
export class CrudDocumentMenuComponent implements OnInit {

  @Input() document : DocumentPreview;
  @Output() onAddEvent = new EventEmitter();
  @Output() onRemoveEvent = new EventEmitter();
  @Output() onEditContentEvent = new EventEmitter();
  @Output() onEditStructureEvent = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
