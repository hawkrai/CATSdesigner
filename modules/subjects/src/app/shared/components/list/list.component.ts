import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core'
import { ListItemActionsDirective } from './directives/list-item-actions.directive'
import { ListItemBodyDirective } from './directives/list-item-body.directive'
import { ListItemHeaderDirective } from './directives/list-item-header.directive'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.less'],
})
export class ListComponent implements OnInit {
  @Input() items: any[]
  @Input() gap: string
  @Input() columns: number
  @ContentChild(ListItemHeaderDirective, { static: false })
  itemHeaderTemplateDirective: ListItemHeaderDirective
  @ContentChild(ListItemBodyDirective, { static: false })
  itemBodyTemplateDirective: ListItemBodyDirective
  @ContentChild(ListItemActionsDirective, { static: false })
  itemActionsTemplateDirective: ListItemBodyDirective

  itemHeaderTemplateRef: TemplateRef<any>
  itemBodyTemplateRef: TemplateRef<any>
  itemActionsTemplateRef: TemplateRef<any>

  constructor() {}
  ngAfterContentInit(): void {
    this.itemHeaderTemplateRef = this.itemHeaderTemplateDirective
      ? this.itemHeaderTemplateDirective.templateRef
      : null
    this.itemBodyTemplateRef = this.itemBodyTemplateDirective
      ? this.itemBodyTemplateDirective.templateRef
      : null
    this.itemActionsTemplateRef = this.itemActionsTemplateDirective
      ? this.itemActionsTemplateDirective.templateRef
      : null
  }

  ngOnInit(): void {}
}
