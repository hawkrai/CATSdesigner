import { Subject } from "rxjs";

// If use this decorator in component then necessary
// to implement OnDestroy interface
// or to extend AutoUnsubscribeBase class
// or to extend PortletComponentBase class
// (AOT specific problem)
export function AutoUnsubscribe(target) {
  const destroyFn = target.prototype.ngOnDestroy;

  target.prototype.ngOnDestroy = function () {
    const unsubscribeStream$: Subject<void> = this.unsubscribeStream$;
    if (unsubscribeStream$) {
      unsubscribeStream$.next();
      unsubscribeStream$.complete();
    }
    if (destroyFn && typeof destroyFn === "function") {
      destroyFn.apply(this, arguments);
    }
  };
}
