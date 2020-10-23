import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubjectNewsComponent } from './modules/subject-news/subject-news.component';
import { LecturesComponent } from './modules/lectures/lectures.component';
import { LabsComponent } from './modules/labs/labs.component';
import {FilesComponent} from './modules/files/files.component';
import {PracticalComponent} from './modules/practical/practical.component';
import {SubSettingsComponent} from './components/sub-settings/sub-settings.component';
import {SubjectComponent} from './modules/subject/subject.component';



const routes: Routes = [
  {
    path: '',
    redirectTo: 'subject',
    pathMatch: 'full'
  },
  { path: 'news', component: SubjectNewsComponent},
  { path: 'lectures', component: LecturesComponent},
  { path: 'labs', component: LabsComponent},
  { path: 'practical', component: PracticalComponent},
  { path: 'files', component: FilesComponent},
  { path: 'settings', component: SubSettingsComponent},
  { path: 'subject', component: SubjectComponent},
  // { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
