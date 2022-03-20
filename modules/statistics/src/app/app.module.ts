import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainPageComponent } from './main-page/main-page.component';
import {ChartsModule, ThemeService} from 'ng2-charts';
import { NgApexchartsModule } from 'ng-apexcharts';
import {HttpClientModule} from '@angular/common/http';
import { TranslateModule, TranslatePipe } from 'educats-translate';
import * as dataRu from './core/translate/translations_ru.json';
import * as dataEn from './core/translate/translations_en.json';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';


@NgModule({
  declarations: [
    AppComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ChartsModule,
    NgApexchartsModule,
    MatSlideToggleModule,
    HttpClientModule,
    TranslateModule.forRoot({
      localizationMap: {
        ru: dataRu,
        en: dataEn
      }
    })
  ],
  providers: [ThemeService, TranslatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
