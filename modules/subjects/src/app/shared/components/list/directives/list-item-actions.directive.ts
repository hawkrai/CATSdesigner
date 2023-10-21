import { Directive, TemplateRef } from '@angular/core'

@Directive({
  selector: '[appListItemActions]',
})
export class ListItemActionsDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
