import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {PageComponent} from './page/page.component';
import {TestComponent} from './test/test.component';
import {TestExecutionComponent} from './test-execution/test-execution.component';
import {TestControlPageComponent} from './test-control-page/test-control-page.component';
import {EditTestPopupComponent} from "./test-control-page/components/edit-test-popup/edit-test-popup.component";
import {QuestionsPageComponent} from "./questions-page/questions-page.component";


const routes: Routes = [
  {path: 'page', component: PageComponent},
  {path: 'test/:id', component: TestComponent},
  {path: 'test-passing/:id', component: TestExecutionComponent},
  {path: 'test-control', component: TestControlPageComponent},
  {path: 'questions/:id', component: QuestionsPageComponent},
  {path: 'popup', component: EditTestPopupComponent},
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
