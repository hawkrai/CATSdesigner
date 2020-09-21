import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {PageComponent} from "./page/page.component";
import {TestComponent} from "./test/test.component";
import {TestExecutionComponent} from "./test-execution/test-execution.component";
import {TestControlPageComponent} from "./test-control-page/test-control-page.component";
import {QuestionsPageComponent} from "./questions-page/questions-page.component";
import {ResultPupilComponent} from "./result-pupil/result-pupil.component";
import {ResultTeacherComponent} from "./result-teacher/result-teacher.component";
import {ControlCompletingComponent} from "./control-completing/control-completing.component";
import {TestResultComponent} from "./test-result/test-result.component";
import {RedirectPupilGuard} from "./core/guard/redirect-pupil.guard";
import {RedirectTeacherGuard} from "./core/guard/redirect-teacher.guard";
import {LoginComponent} from "./login/login.component";


const routes: Routes = [
  {path: '', redirectTo: '/page', pathMatch: 'full'},
  {path: "page", component: PageComponent, canActivate: [RedirectPupilGuard]},
  {path: "test/:id", component: TestComponent},
  {path: "test-passing/:id", component: TestExecutionComponent},
  {path: "questions/:id", component: QuestionsPageComponent},
  {path: "result-pupil/:id", component: ResultPupilComponent},
  {path: "control-completing", component: ControlCompletingComponent},
  {path: "test-control", component: TestControlPageComponent, canActivate: [RedirectTeacherGuard]},
  {path: "test-result", component: TestResultComponent},
  {path: "result-teacher", component: ResultTeacherComponent},
  {path: "login", component: LoginComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
