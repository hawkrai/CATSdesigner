import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LectorsComponent } from './adminPanel/lectors/lectors.component';
import { MainComponent } from './adminPanel/main/main.component';
import { GroupComponent } from './adminPanel/group/group.component';
import { StudentsComponent } from './adminPanel/students/students.component';
import { ResetThePasswordComponent } from './adminPanel/reset-the-password/reset-the-password.component';
import { LoginComponent } from './login/login.component';
import { MainContolComponent } from './control/main/main.component';


const routes: Routes = [
  {path: 'main', component: MainComponent},
  {path: 'lectors', component: LectorsComponent },
  {path: 'students', component: StudentsComponent },
  {path: 'resetPassword', component: ResetThePasswordComponent},
  {path: 'groups', component: GroupComponent},
  {path: 'login', component: LoginComponent},
  {path: 'control', component: MainContolComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
