import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetThePasswordComponent } from './modules/adminPanel/reset-the-password/reset-the-password.component';
import { LoginComponent } from './modules/login/login.component';
import { MainContolComponent } from './control/main/main.component';
import { SignupComponent } from './modules/signup/signup.component';
import { ItemComponent } from './control/item/item.component';
import { GeneralComponent } from './control/general/general.component';
import { StatsComponent } from './control/stats/stats.component';
import { AdminGenerateComponent } from './modules/adminPanel/admin-generate/admin-generate.component';
import { GroupNotFoundComponent } from './control/group-not-found/group-not-found.component';
import {ProfileComponent} from './modules/adminPanel/profile/profile.component';
import {ChangePasswordComponent} from './modules/change-password/change-password.component';

const routes: Routes = [
  { path: '', redirectTo: 'admin', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'resetPassword/student/:studentId', component: ResetThePasswordComponent },
  { path: 'resetPassword/lector/:lectorId', component: ResetThePasswordComponent },
  { path: 'register', component: SignupComponent },
  { path: 'forgot', component: ChangePasswordComponent },
  { path: 'profile/:id', component: ProfileComponent },
  {
    path: 'admin', component: AdminGenerateComponent, children: [
      { path: '', redirectTo: 'main/0', pathMatch: 'full' },
      { path: 'main', redirectTo: 'main/0', pathMatch: 'full' },
      { path: 'main/:tab', component: AdminGenerateComponent},
    ]
  },
  {
    path: 'control', component: GeneralComponent, children: [
      { path: '', redirectTo: 'main', pathMatch: 'full' },
      { path: 'main/:groupName', component: MainContolComponent },
      { path: 'main/:groupName/', component: MainContolComponent },
      { path: 'main/:groupName/:surname/', component: MainContolComponent },
      { path: 'main/:groupName/:surname/:start/:end', component: MainContolComponent },
      { path: 'main/:groupName/:start/:end', component: MainContolComponent },
      { path: 'item/:groupName/:subjectId', component: ItemComponent },
      { path: 'statistic/:groupName', component: StatsComponent },
      { path: 'statistic/:groupName/:surname', component: StatsComponent },
      { path: 'statistic/:groupName/:surname/:start/:end', component: StatsComponent },
      { path: 'statistic/:groupName/:start/:end', component: StatsComponent },
      { path: 'groupNotFound', component: GroupNotFoundComponent }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
