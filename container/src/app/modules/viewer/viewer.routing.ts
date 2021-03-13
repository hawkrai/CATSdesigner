import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubjectComponent } from './pages/subject/subject.component';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { SubjectsNavComponent } from '../../layout/subjects-nav/subjects-nav.component';
import { NoAuthGuard } from '../../core/no-auth.guard';
import { SubjectsComponent } from './pages/subjects/subjects.component';
import { UserAssignedToSubjectGuard } from 'src/app/core/guards/user-assigned-to-subject.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'main',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SubjectsNavComponent,
    canActivate: [NoAuthGuard], // Should be replaced with actual auth guard
    children: [
      {
        path: 'main',
        component: ViewerComponent
      },
      {
        path: 'subject/:id',
        component: SubjectComponent,
        canActivate: [UserAssignedToSubjectGuard]
      },
      {
        path: 'subjects',
        component: SubjectsComponent
      }
    ]
  },
    
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ViewerRoutingModule {}
