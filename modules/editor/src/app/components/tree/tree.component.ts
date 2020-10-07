import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss']
})
export class TreeComponent implements OnInit {

  @Input() treeControl;
  @Input() dataSource;
  @Input() hasChild;
  @Output() onActivateTreeNodeEvent = new EventEmitter();

  @Output() onAddEvent = new EventEmitter();
  @Output() onRemoveEvent = new EventEmitter();
  @Output() onEditContentEvent = new EventEmitter();
  @Output() onEditStructureEvent = new EventEmitter();

  currentNodeId: Number;

  constructor() { this.currentNodeId = 0; }

  ngOnInit(): void {
  }

  nodeSelected(nodeId) {
    this.currentNodeId = nodeId;
  }

  isActive(nodeId) {
    return this.currentNodeId == nodeId;
  }

  drop($event) {

  }
}
