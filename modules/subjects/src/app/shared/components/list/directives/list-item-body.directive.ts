import { Directive, TemplateRef } from '@angular/core'

@Directive({
  selector: '[appListItemBody]',
})
export class ListItemBodyDirective {
  constructor(public templateRef: TemplateRef<any>) {}
}
