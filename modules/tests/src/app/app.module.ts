import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './header/header.component';
import {PageComponent} from './page/page.component';
import {MainPageComponent} from './shared/main-page/main-page.component';
import {MainTableTestsComponent} from './shared/main-table-tests/main-table-tests.component';
import {TestPassingService} from './service/test-passing.service';
import {HttpClientModule} from '@angular/common/http';
import {TestComponent} from './test/test.component';
import {TestDescriptionComponent} from './test-description/test-description.component';
import {DemoMaterialModule} from './material-module';
import {TestExecutionComponent} from './test-execution/test-execution.component';
import {QuestionComponent} from './test-execution/components/question/question.component';
import {FormsModule} from '@angular/forms';
import {TestControlPageComponent} from './test-control-page/test-control-page.component';
import {TestService} from './service/test.service';
import {EditTestPopupComponent} from './test-control-page/components/edit-test-popup/edit-test-popup.component';
import {DeleteConfirmationPopupComponent} from './test-control-page/components/delete-confirmation-popup/delete-confirmation-popup.component';
import { EditAvailabilityPopupComponent } from './test-control-page/components/edit-availability-popup/edit-availability-popup.component';
import { StudentsTableComponent } from './test-control-page/components/edit-availability-popup/components/students-table/students-table.component';
import { QuestionsPageComponent } from './questions-page/questions-page.component';
import { TableQuestionsComponent } from './shared/table-questions/table-questions.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageComponent,
    MainPageComponent,
    MainTableTestsComponent,
    TestComponent,
    TestDescriptionComponent,
    TestExecutionComponent,
    QuestionComponent,
    TestControlPageComponent,
    EditTestPopupComponent,
    DeleteConfirmationPopupComponent,
    EditAvailabilityPopupComponent,
    StudentsTableComponent,
    QuestionsPageComponent,
    TableQuestionsComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule
  ],
  providers: [TestPassingService,
    TestService],
  entryComponents: [ DeleteConfirmationPopupComponent, EditAvailabilityPopupComponent ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
