import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { HttpClientModule } from '@angular/common/http'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { PercentagesComponent } from './components/percentages/percentages.component'
import { PercentagesListComponent } from './components/percentages/percentages-list/percentages-list.component'
import { PercentageResultsComponent } from './components/percentage-results/percentage-results.component'
import { PercentageResultsListComponent } from './components/percentage-results/percentage-results-list/percentage-results-list.component'
import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  DateAdapter,
} from '@angular/material'
import { TaskSheetComponent } from './components/task-sheet/task-sheet.component'
import { VisitStatsComponent } from './components/visit-stats/visit-stats.component'
import { VisitStatsListComponent } from './components/visit-stats/visit-stats-list/visit-stats-list.component'
import { EditPercentageDialogComponent } from './components/percentage-results/edit-percentage-dialog/edit-percentage-dialog.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { AddDateDialogComponent } from './components/visit-stats/add-date-dialog/add-date-dialog.component'
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component'
import { AddStageDialogComponent } from './components/percentages/add-stage-dialog/add-stage-dialog.component'
import { ProjectsComponent } from './components/projects/projects.component'
import { ProjectsListComponent } from './components/projects/projects-list/projects-list.component'
import { AddProjectDialogComponent } from './components/projects/add-project-dialog/add-project-dialog.component'
import { AssignProjectDialogComponent } from './components/projects/assign-project-dialog/assign-project-dialog.component'
import { EditTaskSheetComponent } from './components/task-sheet/edit-task-sheet/edit-task-sheet.component'
import { VisitingPopoverComponent } from './shared/visiting-popover/visiting-popover.component'
import { StoreDevtoolsModule } from '@ngrx/store-devtools'
import { CustomDateAdapter } from './custom-date-adapter'
import { TranslateModule, TranslatePipe } from 'educats-translate'
import * as dataEn from './data/translations_en.json'
import * as dataRu from './data/translations_ru.json'
import { ToastrModule } from 'ngx-toastr'
import { HelpPopoverScheduleComponent } from './shared/help-popover/help-popover-schedule.component'
import { HelpComponent } from './shared/help/help.component'
import { PopoverModule } from 'ngx-smart-popover'

@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    ProjectsListComponent,
    PercentagesComponent,
    PercentagesListComponent,
    PercentageResultsComponent,
    PercentageResultsListComponent,
    TaskSheetComponent,
    VisitStatsComponent,
    VisitStatsListComponent,
    EditPercentageDialogComponent,
    AddDateDialogComponent,
    ConfirmDialogComponent,
    AddStageDialogComponent,
    AddProjectDialogComponent,
    AssignProjectDialogComponent,
    EditTaskSheetComponent,
    VisitingPopoverComponent,
    HelpComponent,
    HelpPopoverScheduleComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatListModule,
    MatTableModule,
    MatTabsModule,
    MatExpansionModule,
    MatSortModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatToolbarModule,
    MatDividerModule,
    FormsModule,
    StoreDevtoolsModule.instrument(),
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-right',
    }),
    PopoverModule,
    TranslateModule.forRoot({
      localizationMap: {
        en: dataEn,
        ru: dataRu,
      },
    }),
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'ru-RU' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    TranslatePipe,
  ],
  entryComponents: [
    EditPercentageDialogComponent,
    AddDateDialogComponent,
    ConfirmDialogComponent,
    AddStageDialogComponent,
    AddProjectDialogComponent,
    AssignProjectDialogComponent,
    EditTaskSheetComponent,
    VisitingPopoverComponent,
    HelpComponent,
    HelpPopoverScheduleComponent,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
