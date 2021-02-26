import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";

import {AppRoutingModule} from "./app-routing.module";
import {AppComponent} from "./app.component";

import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HeaderComponent} from "./header/header.component";
import {PageComponent} from "./page/page.component";
import {MainPageComponent} from "./shared/main-page/main-page.component";
import {MainTableTestsComponent} from "./shared/main-table-tests/main-table-tests.component";
import {TestPassingService} from "./service/test-passing.service";
import {HttpClientModule} from "@angular/common/http";
import {TestComponent} from "./test/test.component";
import {TestDescriptionComponent} from "./test-description/test-description.component";
import {DemoMaterialModule} from "./material-module";
import {TestExecutionComponent} from "./test-execution/test-execution.component";
import {QuestionComponent} from "./test-execution/components/question/question.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {TestControlPageComponent} from "./test-control-page/test-control-page.component";
import {TestService} from "./service/test.service";
import {EditTestPopupComponent} from "./test-control-page/components/edit-test-popup/edit-test-popup.component";
import {DeleteConfirmationPopupComponent} from "./test-control-page/components/delete-confirmation-popup/delete-confirmation-popup.component";
import {EditAvailabilityPopupComponent} from "./test-control-page/components/edit-availability-popup/edit-availability-popup.component";
import {StudentsTableComponent} from "./test-control-page/components/edit-availability-popup/components/students-table/students-table.component";
import {QuestionsPageComponent} from "./questions-page/questions-page.component";
import {TableQuestionsComponent} from "./shared/table-questions/table-questions.component";
import {QuestionPopupComponent} from "./questions-page/components/question-popup/question-popup.component";
import {ResultPupilComponent} from "./result-pupil/result-pupil.component";
import {ResultTestTableComponent} from "./shared/result-test-table/result-test-table.component";
import {AngularEditorComponent} from "./questions-page/components/question-popup/components/angular-editor/angular-editor.component";
import {AngularEditorService} from "./questions-page/components/question-popup/components/angular-editor/angular-editor.service";
import {AngularEditorToolbarComponent} from "./questions-page/components/question-popup/components/angular-editor-toolbar/angular-editor-toolbar.component";
import {AeSelectComponent} from "./questions-page/components/question-popup/components/ae-select/ae-select.component";
import {ResultTeacherComponent} from "./result-teacher/result-teacher.component";
import {StudentMarksTableComponent} from "./shared/student-marks-table/student-marks-table.component";
import {ResultTestTablePupilComponent} from "./shared/result-test-table-pupil/result-test-table-pupil.component";
import {AnswersPopupComponent} from "./shared/result-test-table/components/answers-popup/answers-popup.component";
import {ControlCompletingComponent} from "./control-completing/control-completing.component";
import {ChartsModule} from "ng2-charts";
import {CKEditorModule} from "ckeditor4-angular";
import {QuestionOtherTestComponent} from "./questions-page/components/question-other-test/question-other-test.component";
import {TestResultComponent} from "./test-result/test-result.component";
import {TranslatePipe} from "../../../../container/src/app/pipe/translate.pipe";
import {AutocompleteFormComponent} from "./shared/autocomplete-form/autocomplete-form.component";
import {SelectAutocompleteModule} from "mat-select-autocomplete";
import {LoginComponent} from "./login/login.component";
import {DeleteQuestionConfirmationPopupComponent} from "./questions-page/components/delete-question-confirmation-popup/delete-question-confirmation-popup.component";
import {MenuItemComponent} from "./questions-page/components/question-popup/components/menu-item/menu-item.component";
import {NeuralNetworkPopupComponent} from "./questions-page/components/neural-network-popup/neural-network-popup.component";


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
    MenuItemComponent,
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
    DeleteQuestionConfirmationPopupComponent,
    TestResultComponent,
    TranslatePipe,
    AutocompleteFormComponent,
    LoginComponent,
    NeuralNetworkPopupComponent
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
    CKEditorModule,
    SelectAutocompleteModule
  ],
  providers: [
    TestPassingService,
    TestService,
    AngularEditorService,
    TranslatePipe
  ],
  entryComponents: [DeleteConfirmationPopupComponent,
    EditAvailabilityPopupComponent,
    EditTestPopupComponent,
    QuestionPopupComponent,
    QuestionOtherTestComponent,
    DeleteQuestionConfirmationPopupComponent,
    NeuralNetworkPopupComponent,
    AnswersPopupComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
}
