import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { EditorComponent } from './components/editor/editor.component';
import {TranslatePipe} from "../../../../container/src/app/pipe/translate.pipe";

import { ModalService } from './services/modal.service';
import { TreeComponent } from './components/tree/tree.component';
import { RemoveDocumentDialogComponent } from './components/dialogs/remove-document-dialog/remove-document-dialog.component';
import { AddDocumentDialogComponent } from './components/dialogs/add-document-dialog/add-document-dialog.component';
import { EditDocumentDialogComponent } from './components/dialogs/edit-document-dialog/edit-document-dialog.component';
import { TestDialogComponent } from './components/dialogs/test-dialog/test-dialog.component';
import { TestExecutionComponent } from './components/adaptiveLearningTests/adaptive-learning-test.component';
import { QuestionComponent } from './components/adaptiveLearningTests/components/question/question.component';
import { CopyToOtherSubjectDialogComponent } from './components/dialogs/copy-to-other-subject-dialog/copy-to-other-subject-dialog.component';
import { CopyFromOtherSubjectDialogComponent } from './components/dialogs/copy-from-other-subject-dialog/copy-from-other-subject-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    EditorComponent,
    TreeComponent,
    RemoveDocumentDialogComponent,
    AddDocumentDialogComponent,
    EditDocumentDialogComponent,
    TestDialogComponent,
    TranslatePipe,
    TestExecutionComponent,
    QuestionComponent,
    CopyToOtherSubjectDialogComponent,
    CopyFromOtherSubjectDialogComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CKEditorModule
  ],
  providers: [
    ModalService,
    TranslatePipe
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
