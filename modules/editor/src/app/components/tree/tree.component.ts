import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { IDocumentTree } from 'src/app/models/DocumentTree';4
import { MatTreeNestedDataSource } from '@angular/material/tree';
import * as san from './../../helpers/string-helper'
import { MatMenuTrigger } from '@angular/material/menu';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @ViewChild(MatMenuTrigger, {static: true}) matMenuTrigger: MatMenuTrigger;

  @Input() treeControl : NestedTreeControl<IDocumentTree>;
  @Input() dataSource : MatTreeNestedDataSource<IDocumentTree>;
  @Input() hasChild;
  @Input() isReadOnly;
  @Input() currentNodeId;
  @Input() documentsList;

  @Output() onActivateTreeNodeEvent = new EventEmitter();

  @Output() onAddEvent = new EventEmitter();
  @Output() onRemoveEvent = new EventEmitter();
  @Output() onEditContentEvent = new EventEmitter();
  @Output() onEditStructureEvent = new EventEmitter();
  @Output() changeLockState = new EventEmitter();

  menuTopLeftPosition =  {x: '0', y: '0'}

  constructor() {
  }

  ngOnInit(): void {
  }

  sanitizeHtml(row) {
    return san.helper.sanitizeHtml(row);
  }

  onRightClick(ob) {
    ob.event.preventDefault();

    if(this.isReadOnly)
      return;

    // we record the mouse position in our object
    this.menuTopLeftPosition.x = ob.event.clientX + 'px';
    this.menuTopLeftPosition.y = ob.event.clientY + 'px';

    this.matMenuTrigger.menuData = {item: this.documentsList.find(x => x.Id == ob.node.Id)};

    this.matMenuTrigger.openMenu();
  }
}
