import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { PercentagesComponent } from './modules/percentages/percentages.component';
import {ProjectNewsModule} from './modules/project-news/project-news.module';
import { PercentagesListComponent } from './modules/percentages/percentages-list/percentages-list.component';
import { PercentageResultsComponent } from './modules/percentage-results/percentage-results.component';
import { PercentageResultsListComponent } from './modules/percentage-results/percentage-results-list/percentage-results-list.component';
import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule, MatListModule,
  MatNativeDateModule,
  MatSelectModule, MatTableModule, MatTabsModule, MatTooltipModule
} from '@angular/material';
import { TaskSheetComponent } from './modules/task-sheet/task-sheet.component';
import { VisitStatsComponent } from './modules/visit-stats/visit-stats.component';
import { VisitStatsListComponent } from './modules/visit-stats/visit-stats-list/visit-stats-list.component';
import { EditPercentageDialogComponent } from './modules/percentage-results/edit-percentage-dialog/edit-percentage-dialog.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AddDateDialogComponent } from './modules/visit-stats/add-date-dialog/add-date-dialog.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { AddStageDialogComponent } from './modules/percentages/add-stage-dialog/add-stage-dialog.component';
import {ProjectsComponent} from './modules/projects/projects.component';
import {ProjectsListComponent} from './modules/projects/projects-list/projects-list.component';
import {AddProjectDialogComponent} from './modules/projects/add-project-dialog/add-project-dialog.component';
import { AssignProjectDialogComponent } from './modules/projects/assign-project-dialog/assign-project-dialog.component';
import { EditTaskSheetComponent } from './modules/task-sheet/edit-task-sheet/edit-task-sheet.component';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
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
    EditTaskSheetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ProjectNewsModule,
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
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'ru-RU'}
  ],
  entryComponents: [EditPercentageDialogComponent, AddDateDialogComponent, ConfirmDialogComponent, AddStageDialogComponent,
    AddProjectDialogComponent, AssignProjectDialogComponent, EditTaskSheetComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
