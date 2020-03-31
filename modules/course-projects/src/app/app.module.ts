import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ProjectsModule } from './modules/projects/projects.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideMenuComponent } from './components/side-menu/side-menu.component';
import { PercentagesComponent } from './modules/percentages/percentages.component';
import {ProjectNewsModule} from './modules/project-news/project-news.module';
import { PercentagesListComponent } from './modules/percentages/percentages-list/percentages-list.component';
import { PercentageResultsComponent } from './modules/percentage-results/percentage-results.component';
import { PercentageResultsListComponent } from './modules/percentage-results/percentage-results-list/percentage-results-list.component';
import {MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule} from '@angular/material';
import { TaskSheetComponent } from './modules/task-sheet/task-sheet.component';
import { VisitStatsComponent } from './modules/visit-stats/visit-stats.component';
import { VisitStatsListComponent } from './modules/visit-stats/visit-stats-list/visit-stats-list.component';

@NgModule({
  declarations: [
    AppComponent,
    SideMenuComponent,
    PercentagesComponent,
    PercentagesListComponent,
    PercentageResultsComponent,
    PercentageResultsListComponent,
    TaskSheetComponent,
    VisitStatsComponent,
    VisitStatsListComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ProjectsModule,
        BrowserAnimationsModule,
        ProjectNewsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
