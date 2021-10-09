import { ModuleWithProviders, NgModule } from '@angular/core';
import { LOCALIZATION } from '../tokens';
import { TranslateSettings } from './models/translate-settings.model';
import { TranslatePipe } from './pipes/translate.pipe';


@NgModule({
  declarations: [
    TranslatePipe
  ],
  imports: [
  ],
  exports: [
    TranslatePipe
  ]
})
export class TranslateModule {
  static forRoot(transalteSettings: TranslateSettings): ModuleWithProviders {
    return {
      ngModule: TranslateModule,
      providers: [
        { provide: LOCALIZATION, useValue: transalteSettings.localizationMap }
      ]
    }
  }
 }
