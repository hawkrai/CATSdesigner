import { Directive, OnDestroy } from '@angular/core'
@Directive()
export class AutoUnsubscribeBase implements OnDestroy {
  public ngOnDestroy(): void {}
}
