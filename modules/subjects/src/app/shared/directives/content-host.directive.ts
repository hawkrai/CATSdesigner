import {ComponentFactoryResolver, Directive, ElementRef, Input, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appContentHost]'
})
export class ContentHostDirective {

  @Input() component
  constructor(
    private resolver: ComponentFactoryResolver,
    private elementRef: ElementRef
  ) { }

  createComponent(type) {
    const factory = this.resolver.resolveComponentFactory(SubjectComponent)
  }

}
