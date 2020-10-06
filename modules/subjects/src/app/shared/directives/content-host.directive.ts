import {ComponentFactoryResolver, Directive, ElementRef, Input, OnInit, Type, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appContentHost]'
})
export class ContentHostDirective implements OnInit {

  @Input() component: Type<any>;
  @Input() props: any[];
  constructor(
    private resolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) { }

  ngOnInit(): void {
    this.viewContainerRef.clear();
    const factory = this.resolver.resolveComponentFactory(this.component);
    const componentRef = this.viewContainerRef.createComponent(factory);
    for (const prop of this.props) {
      componentRef.instance[prop.name] = prop.value;
    }
  }

  // createComponent(type) {
  //   const factory = this.resolver.resolveComponentFactory(SubjectComponent)
  // }

}
