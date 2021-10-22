import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appListItemHeader]'
})
export class ListItemHeaderDirective {

  constructor(public templateRef: TemplateRef<any>) { }

}
