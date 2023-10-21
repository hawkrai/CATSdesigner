import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core'

@Directive({
  selector: '[var]',
})
export class VarDirective {
  @Input()
  set var(context: any) {
    this.context.$implicit = this.context.var = context
    this.updateView()
  }

  context: any = {}

  constructor(
    private vcRef: ViewContainerRef,
    private templateRef: TemplateRef<any>
  ) {}

  updateView() {
    this.vcRef.clear()
    this.vcRef.createEmbeddedView(this.templateRef, this.context)
  }
}
