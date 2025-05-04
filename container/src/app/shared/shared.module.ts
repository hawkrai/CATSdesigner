import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { TranslateModule, TranslatePipe } from 'educats-translate'
import * as dataEn from '../core/translations/translations_en.json'
import * as dataRu from '../core/translations/translations_ru.json'
import { SafeHtmlPipe } from './pipes/safe-html.pipe'
import { MarkdownService } from './utils/markdown.service'
import { TextFormatService } from './utils/text-format.service'

@NgModule({
  imports: [
    CommonModule,
    TranslateModule.forRoot({
      localizationMap: {
        en: dataEn,
        ru: dataRu,
      },
    }),
  ],
  declarations: [SafeHtmlPipe],
  exports: [TranslatePipe, SafeHtmlPipe],
  providers: [TranslatePipe, TextFormatService, MarkdownService],
})
export class SharedModule {}
