import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PercentagesComponent } from './components/percentages/percentages.component';
import { PercentagesListComponent } from './components/percentages/percentages-list/percentages-list.component';
import { PercentageResultsComponent} from './components/percentage-results/percentage-results.component';
import { PercentageResultsListComponent } from './components/percentage-results/percentage-results-list/percentage-results-list.component';
import {
  MAT_DATE_LOCALE,
  MatButtonModule, MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule, MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatNativeDateModule,
  MatSelectModule, MatSidenavModule,
  MatSnackBarModule,
  MatSortModule,
  MatTableModule,
  MatTabsModule, MatToolbarModule,
  MatTooltipModule
} from '@angular/material';
import { TaskSheetComponent} from './components/task-sheet/task-sheet.component';
import { VisitStatsComponent } from './components/visit-stats/visit-stats.component';
import { VisitStatsListComponent } from './components/visit-stats/visit-stats-list/visit-stats-list.component';
import { EditPercentageDialogComponent } from './components/percentage-results/edit-percentage-dialog/edit-percentage-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddDateDialogComponent } from './components/visit-stats/add-date-dialog/add-date-dialog.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { AddStageDialogComponent } from './components/percentages/add-stage-dialog/add-stage-dialog.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { ProjectsListComponent } from './components/projects/projects-list/projects-list.component';
import { AddProjectDialogComponent } from './components/projects/add-project-dialog/add-project-dialog.component';
import { AssignProjectDialogComponent } from './components/projects/assign-project-dialog/assign-project-dialog.component';
import { EditTaskSheetComponent } from './components/task-sheet/edit-task-sheet/edit-task-sheet.component';
import { DefenseComponent } from './components/defense/defense.component';
import { VisitingPopoverComponent } from './shared/visiting-popover/visiting-popover.component';
import { StoreModule } from '@ngrx/store';
import { appReducers } from './store/reducers/app.reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

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
    DefenseComponent,
    VisitingPopoverComponent
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
    StoreModule.forRoot(appReducers),
    StoreDevtoolsModule.instrument()
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}
  ],
  entryComponents: [EditPercentageDialogComponent, AddDateDialogComponent, ConfirmDialogComponent, AddStageDialogComponent,
    AddProjectDialogComponent, AssignProjectDialogComponent, EditTaskSheetComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
