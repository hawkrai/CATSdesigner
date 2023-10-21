import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core'
import { ToastAnimationState, toastAnimations } from './toast-animation'
import { ToastConfig, ToastData, TOAST_CONFIG_TOKEN } from './toast-config'
import { ToastRef } from './toast-ref'

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.less'],
  animations: [toastAnimations.fadeToast],
  encapsulation: ViewEncapsulation.None,
})
export class ToastComponent implements OnInit {
  animationState: ToastAnimationState = 'default'
  iconType: string

  private intervalId: any

  constructor(
    readonly data: ToastData,
    readonly ref: ToastRef,
    @Inject(TOAST_CONFIG_TOKEN) public toastConfig: ToastConfig
  ) {
    this.iconType = data.type === 'success' ? 'done' : data.type
  }

  ngOnInit() {
    this.intervalId = setTimeout(() => (this.animationState = 'closing'), 1000)
  }

  ngOnDestroy() {
    clearTimeout(this.intervalId)
  }

  close() {
    this.ref.close()
  }

  onFadeFinished(event) {
    const { toState } = event
    const isFadeOut = (toState as ToastAnimationState) === 'closing'
    const itFinished = this.animationState === 'closing'

    if (isFadeOut && itFinished) {
      this.close()
    }
  }
}
