import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScheduleMainComponent} from './schedule-main/schedule-main.component';


const routes: Routes = [
  {path: '', redirectTo: '/page', pathMatch: 'full'},
  {path: 'page', component: ScheduleMainComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
