import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TranslateModule, TranslatePipe } from "educats-translate";
import * as dataEn from '../core/translations/translations_en.json';
import * as dataRu from '../core/translations/translations_en.json';


@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forRoot({
            localizationMap: {
                en: dataEn,
                ru: dataRu
            }
        })
    ],
    exports: [
        TranslatePipe
    ],
    providers: [
        TranslatePipe
    ]
})
export class SharedModule {}