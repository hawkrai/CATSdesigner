import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmationComponent } from './confirmation/confirmation.component';
import {ConfirmationService} from "./services/confirmation.service";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpClientModule} from "@angular/common/http";
import {DemoMaterialModule} from "./material-module";
import { TranslateModule } from 'educats-translate';
import * as dataEn from './core/translate/translate_en.json';
import * as dataRu from './core/translate/translate_ru.json';
import { SharedModule } from './shared/shared.module';
import { CatsMessageService } from './services/cats-message.service';
import { GroupSortPipe } from './pipes/group-sort.pipe';
import { AspNetDatePipe } from './pipes/asp-net-date.pipe';


@NgModule({
  declarations: [
    AppComponent,
    ConfirmationComponent,
    GroupSortPipe,
    AspNetDatePipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule,
    TranslateModule.forRoot({
      localizationMap: {
        ru: dataRu,
        en: dataEn
      }
    }),
    SharedModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
