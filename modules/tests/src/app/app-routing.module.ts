import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageComponent} from './page/page.component';
import {TestComponent} from './test/test.component';
import {TestExecutionComponent} from './test-execution/test-execution.component';
import {TestControlPageComponent} from './test-control-page/test-control-page.component';
import {EditTestPopupComponent} from "./test-control-page/components/edit-test-popup/edit-test-popup.component";
import {QuestionsPageComponent} from "./questions-page/questions-page.component";
import {ResultPupilComponent} from "./result-pupil/result-pupil.component";
import {ResultTeacherComponent} from "./result-teacher/result-teacher.component";
import {ControlCompletingComponent} from "./control-completing/control-completing.component";


const routes: Routes = [
  {path: 'page', component: PageComponent},
  {path: 'test/:id', component: TestComponent},
  {path: 'test-passing/:id', component: TestExecutionComponent},
  {path: 'questions/:id', component: QuestionsPageComponent},
  {path: 'popup', component: EditTestPopupComponent},
  {path: 'result-pupil/:id', component: ResultPupilComponent},
  {path: 'control-completing', component: ControlCompletingComponent},
  {path: 'test-control', component: TestControlPageComponent},
  {path: 'result-teacher', component: ResultTeacherComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
