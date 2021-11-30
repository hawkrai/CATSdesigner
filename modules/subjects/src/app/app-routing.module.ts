import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {FilesComponent} from './modules/files/files.component';
import {SubjectComponent} from './modules/subject/subject.component';
import { SettingsComponent } from './modules/settings/settings.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'news',
    pathMatch: 'full'
  },
  { path: 'news', loadChildren: () => import('./modules/subject-news/subject-news.module').then(m => m.SubjectNewsModule) },
  { path: 'lectures',  loadChildren: () => import('./modules/lectures/lectures.module').then(m => m.LecturesModule) },
  { path: 'labs', loadChildren: () => import('./modules/labs/labs.module').then(m => m.LabsModule) },
  { path: 'practical', loadChildren: () => import('./modules/practical/practical.module').then(m => m.PracticalModule) },
  { path: 'files', component: FilesComponent},
  { path: 'settings', component: SettingsComponent},
  { path: 'subject', component: SubjectComponent},
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
