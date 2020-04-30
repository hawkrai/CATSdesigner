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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TestControlPageComponent} from './test-control-page/test-control-page.component';
import {TestService} from './service/test.service';
import {EditTestPopupComponent} from './test-control-page/components/edit-test-popup/edit-test-popup.component';
import {DeleteConfirmationPopupComponent} from './test-control-page/components/delete-confirmation-popup/delete-confirmation-popup.component';
import {EditAvailabilityPopupComponent} from './test-control-page/components/edit-availability-popup/edit-availability-popup.component';
import {StudentsTableComponent} from './test-control-page/components/edit-availability-popup/components/students-table/students-table.component';
import {QuestionsPageComponent} from './questions-page/questions-page.component';
import {TableQuestionsComponent} from './shared/table-questions/table-questions.component';
import {QuestionPopupComponent} from './questions-page/components/question-popup/question-popup.component';
import {ResultPupilComponent} from './result-pupil/result-pupil.component';
import {ResultTestTableComponent} from './shared/result-test-table/result-test-table.component';
import {AngularEditorComponent} from './questions-page/components/question-popup/components/angular-editor/angular-editor.component';
import {AngularEditorService} from "./questions-page/components/question-popup/components/angular-editor/angular-editor.service";
import {AngularEditorToolbarComponent} from './questions-page/components/question-popup/components/angular-editor-toolbar/angular-editor-toolbar.component';
import {AeSelectComponent} from './questions-page/components/question-popup/components/ae-select/ae-select.component';
import {ResultTeacherComponent} from './result-teacher/result-teacher.component';
import {StudentMarksTableComponent} from './shared/student-marks-table/student-marks-table.component';
import {ResultTestTablePupilComponent} from './shared/result-test-table-pupil/result-test-table-pupil.component';
import {AnswersPopupComponent} from './shared/result-test-table/components/answers-popup/answers-popup.component';
import {ControlCompletingComponent} from './control-completing/control-completing.component';
import {ChartsModule} from 'ng2-charts';
import {CKEditorModule} from 'ckeditor4-angular';
import {QuestionOtherTestComponent} from './questions-page/components/question-other-test/question-other-test.component';
import {TestResultComponent} from './test-result/test-result.component';
import {DateFormatPipe} from "./pipe/date-format.pipe";
import {TranslatePipe} from "./pipe/translate.pipe";


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
    TableQuestionsComponent,
    QuestionPopupComponent,
    ResultPupilComponent,
    ResultTestTableComponent,
    AngularEditorComponent,
    AngularEditorToolbarComponent,
    AeSelectComponent,
    ResultTeacherComponent,
    StudentMarksTableComponent,
    ResultTestTablePupilComponent,
    AnswersPopupComponent,
    ControlCompletingComponent,
    QuestionOtherTestComponent,
    TestResultComponent,
    DateFormatPipe,
    TranslatePipe
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule,
    ChartsModule,
    CKEditorModule
  ],
  providers: [
    TestPassingService,
    TestService,
    AngularEditorService,
    DateFormatPipe,
    TranslatePipe
  ],
  entryComponents: [DeleteConfirmationPopupComponent,
    EditAvailabilityPopupComponent,
    QuestionPopupComponent,
    QuestionOtherTestComponent,
    AnswersPopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
