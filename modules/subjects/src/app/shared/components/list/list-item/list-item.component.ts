import { Component, Input, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-list-item',
  templateUrl: './list-item.component.html',
  styleUrls: ['./list-item.component.less']
})
export class ListItemComponent implements OnInit {
  @Input() headerTemplate: TemplateRef<any>;
  @Input() contentTemplate: TemplateRef<any>;
  @Input() actionsTemplate: TemplateRef<any>;
  @Input() item: any;
  constructor() { }

  ngOnInit() {
  }

}
