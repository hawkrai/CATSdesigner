import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { MatFormFieldModule } from '@angular/material/form-field'
import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { FlatpickrModule } from 'angularx-flatpickr'
import {
  CalendarModule,
  CalendarNativeDateFormatter,
  CalendarDateFormatter,
} from 'angular-calendar'
import { DateAdapter } from 'angular-calendar'
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns'
import { ScheduleMainComponent } from './schedule-main/schedule-main.component'
import {
  BrowserAnimationsModule,
  NoopAnimationsModule,
} from '@angular/platform-browser/animations'
import { registerLocaleData } from '@angular/common'
import localeRu from '@angular/common/locales/ru'
import { HttpClientModule } from '@angular/common/http'
import { DateFormatterParams } from 'angular-calendar'
import { MatDialogModule } from '@angular/material/dialog'
import { MatTooltipModule } from '@angular/material/tooltip'
import { CreateLessonComponent } from './modal/create-lesson/create-lesson.component'
import { ReactiveFormsModule } from '@angular/forms'
import { MatSelectModule } from '@angular/material/select'
import { MatInputModule } from '@angular/material/input'
import { ConfirmationComponent } from './modal/confirmation/confirmation.component'
import { MatMenuModule } from '@angular/material/menu'
import { NewsComponent } from './news/news.component'
import { NewsInfoComponent } from './modal/news-info/news-info.component'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatButtonModule } from '@angular/material/button'
import { MatRadioModule } from '@angular/material/radio'
import { MatTabsModule } from '@angular/material/tabs'
import { AllNewsComponent } from './modal/all-news/all-news.component'
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker'
import { MatDatepickerModule } from '@angular/material/datepicker'
import { TranslateModule, TranslatePipe } from 'educats-translate'
import { MatIconModule } from '@angular/material/icon'
import { HelpPopoverScheduleComponent } from './schedule-main/help-popover/help-popover-schedule.component'
import { MatDividerModule } from '@angular/material/divider'
import * as dataRu from './core/translate/translations_ru.json'
import * as dataEn from './core/translate/translations_en.json'
import { ScheduleStatisticsComponent } from './schedule-statistics/schedule-statistics.component'
import { NgApexchartsModule } from 'ng-apexcharts'
import { StoreModule } from '@ngrx/store'
import { appReducers } from '../../../complex/src/app/store/reducers/app.reducers'
import { EffectsModule } from '@ngrx/effects'
import { FilesEffects } from './service/files.effects'
import { NotifierModule, NotifierOptions } from 'angular-notifier'

registerLocaleData(localeRu)

class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({ date, locale }: DateFormatterParams): string {
    return new Intl.DateTimeFormat('ca', {
      hour: 'numeric',
      minute: 'numeric',
    }).format(date)
  }
}

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'right',
      distance: 10,
    },
  },
}

@NgModule({
  declarations: [
    AppComponent,
    ScheduleMainComponent,
    CreateLessonComponent,
    ConfirmationComponent,
    NewsComponent,
    NewsInfoComponent,
    AllNewsComponent,
    HelpPopoverScheduleComponent,
    ScheduleStatisticsComponent,
  ],
  imports: [
    BrowserModule,
    MatButtonModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MatDialogModule,
    HttpClientModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    NotifierModule.withConfig(customNotifierOptions),
    MatFormFieldModule,
    ReactiveFormsModule,
    NgxMaterialTimepickerModule,
    NgApexchartsModule,
    FlatpickrModule.forRoot(),
    StoreModule.forRoot(appReducers, {
      runtimeChecks: {
        strictStateImmutability: false,
        strictActionImmutability: false,
      },
    }),
    EffectsModule.forRoot([FilesEffects]),
    CalendarModule.forRoot(
      {
        provide: DateAdapter,
        useFactory: adapterFactory,
      },
      {
        dateFormatter: {
          provide: CalendarDateFormatter,
          useClass: CustomDateFormatter,
        },
      }
    ),
    MatSelectModule,
    MatMenuModule,
    MatRadioModule,
    MatTabsModule,
    MatDatepickerModule,
    MatIconModule,
    MatDividerModule,
    TranslateModule.forRoot({
      localizationMap: {
        ru: dataRu,
        en: dataEn,
      },
    }),
  ],
  providers: [DatePipe, MatDatepickerModule, TranslatePipe],
  exports: [AppComponent, MatTooltipModule],
  bootstrap: [AppComponent],
  entryComponents: [
    AllNewsComponent,
    CreateLessonComponent,
    ConfirmationComponent,
    NewsInfoComponent,
    HelpPopoverScheduleComponent,
    ScheduleStatisticsComponent,
  ],
})
export class AppModule {}
