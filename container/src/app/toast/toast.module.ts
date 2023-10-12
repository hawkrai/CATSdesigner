import { NgModule, ModuleWithProviders } from '@angular/core'
import { OverlayModule } from '@angular/cdk/overlay'
import { MatIconModule } from '@angular/material/icon'

import { ToastComponent } from './toast.component'
import { defaultToastConfig, TOAST_CONFIG_TOKEN } from './toast-config'

@NgModule({
  imports: [OverlayModule, MatIconModule],
  declarations: [ToastComponent],
  entryComponents: [ToastComponent],
})
export class ToastModule {
  public static forRoot(config = defaultToastConfig): ModuleWithProviders {
    return {
      ngModule: ToastModule,
      providers: [
        {
          provide: TOAST_CONFIG_TOKEN,
          useValue: { ...defaultToastConfig, ...config },
        },
      ],
    }
  }
}
