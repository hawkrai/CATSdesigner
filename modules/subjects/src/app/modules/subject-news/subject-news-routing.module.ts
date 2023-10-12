import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { SubjectNewsComponent } from './subject-news.component'

const routes: Routes = [
  {
    path: '',
    component: SubjectNewsComponent,
  },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectNewsRoutingModule {}
