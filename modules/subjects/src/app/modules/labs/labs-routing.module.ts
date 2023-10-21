import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { JobProtectionComponent } from './components/job-protection/job-protection.component'
import { LabsWorkComponent } from './components/labs-work/labs-work.component'
import { ProtectionScheduleComponent } from './components/protection-schedule/protection-schedule.component'
import { ResultsComponent } from './components/results/results.component'
import { VisitStatisticsComponent } from './components/visit-statistics/visit-statistics.component'
import { LabsComponent } from './labs.component'

const routes: Routes = [
  {
    path: '',
    component: LabsComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'list',
      },
      {
        path: 'list',
        component: LabsWorkComponent,
      },
      {
        path: 'schedule',
        component: ProtectionScheduleComponent,
      },
      {
        path: 'visit-statistics',
        component: VisitStatisticsComponent,
      },
      {
        path: 'results',
        component: ResultsComponent,
      },
      {
        path: 'job-protection',
        component: JobProtectionComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LabsRoutingModule {}
