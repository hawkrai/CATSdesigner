import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProjectsComponent } from './modules/projects/projects.component';
import {ProjectNewsComponent} from './modules/project-news/project-news.component';
import {PercentagesComponent} from './modules/percentages/percentages.component';
import {PercentageResultsComponent} from './modules/percentage-results/percentage-results.component';
import {TaskSheetComponent} from './modules/task-sheet/task-sheet.component';
import {VisitStatsComponent} from './modules/visit-stats/visit-stats.component';


const routes: Routes = [
  { path: ':subjectId/news', component: ProjectNewsComponent },
  { path: ':subjectId/projects', component: ProjectsComponent },
  { path: ':subjectId/percentages', component: PercentagesComponent },
  { path: ':subjectId/percentageResults', component: PercentageResultsComponent },
  { path: ':subjectId/taskSheet', component: TaskSheetComponent },
  { path: ':subjectId/visitStats', component: VisitStatsComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
