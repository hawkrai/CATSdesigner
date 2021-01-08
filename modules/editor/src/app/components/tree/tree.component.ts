import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IDocumentTree } from 'src/app/models/DocumentTree';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input() treeControl : NestedTreeControl<IDocumentTree>;
  @Input() dataSource : MatTreeNestedDataSource<IDocumentTree>;
  @Input() hasChild;
  @Input() isReadOnly;
  @Input() currentNodeId;

  @Output() onActivateTreeNodeEvent = new EventEmitter();
  @Output() onExpandOrCollapseNode = new EventEmitter();

  @Output() onAddEvent = new EventEmitter();
  @Output() onRemoveEvent = new EventEmitter();
  @Output() onEditContentEvent = new EventEmitter();
  @Output() onEditStructureEvent = new EventEmitter();

  constructor() {
  }

  ngOnInit(): void {
  }

  isActive(nodeId) {
    return this.currentNodeId == nodeId;
  }
}
