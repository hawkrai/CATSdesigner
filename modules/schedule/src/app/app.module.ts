import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, CalendarNativeDateFormatter, CalendarDateFormatter } from 'angular-calendar';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { ScheduleMainComponent } from './schedule-main/schedule-main.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { registerLocaleData } from '@angular/common';
import localeRu from '@angular/common/locales/ru';
import {HttpClientModule} from '@angular/common/http';
import {DateFormatterParams} from 'angular-calendar';
import {MatDialogModule} from '@angular/material/dialog';
import {AddNoteComponent} from './modal/add-note/add-note.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import { CreateLessonComponent } from './modal/create-lesson/create-lesson.component';
import { ReactiveFormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { ConfirmationComponent } from './modal/confirmation/confirmation.component';
import {MatMenuModule} from '@angular/material/menu';
import { NewsComponent } from './news/news.component';
import { NewsInfoComponent } from './modal/news-info/news-info.component';
registerLocaleData(localeRu);

class CustomDateFormatter extends CalendarNativeDateFormatter {
  public dayViewHour({date, locale}: DateFormatterParams): string {
    return new Intl.DateTimeFormat('ca', {
      hour: 'numeric',
      minute: 'numeric'
    }).format(date);
  }
}

@NgModule({
  declarations: [
    AppComponent,
    ScheduleMainComponent,
    AddNoteComponent,
    CreateLessonComponent,
    ConfirmationComponent,
    NewsComponent,
    NewsInfoComponent
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    AppRoutingModule,
    MatDialogModule,
    HttpClientModule,
    MatInputModule,
    MatTooltipModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }, {
      dateFormatter: {
        provide: CalendarDateFormatter,
        useClass: CustomDateFormatter
      }
    }),
    MatSelectModule,
    MatMenuModule,
  ],
  providers: [],
  exports: [AppComponent, MatTooltipModule],
  bootstrap: [AppComponent],
  entryComponents: [AddNoteComponent, CreateLessonComponent, ConfirmationComponent, NewsInfoComponent]
})
export class AppModule {

}
