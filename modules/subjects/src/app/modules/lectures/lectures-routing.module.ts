import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { LecturesListComponent } from './components/lectures-list/lectures-list.component'
import { VisitLecturesComponent } from './components/visit-lectures/visit-lectures.component'
import { LecturesComponent } from './lectures.component'

const routes: Routes = [
  {
    path: '',
    component: LecturesComponent,
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: LecturesListComponent,
      },
      {
        path: 'visit-statistics',
        component: VisitLecturesComponent,
      },
    ],
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LecturesRoutingModule {}
