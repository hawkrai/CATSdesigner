import { WidthPipe } from './pipes/width.pipe';
import { AnyPipe } from './pipes/any.pipe';
import { FindPipe } from './pipes/find.pipe';
import { PluckPipe } from './pipes/pluck.pipe';
import { UniquePipe } from './pipes/unique.pipe';
import { VarDirective } from './directives/var.directive';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {FilterPipe} from './pipes/filter.pipe';
import { PluralPipe } from './pipes/plural.pipe';
import { MatModule } from '../mat.module';
import { FirstLetterUppercasePipe } from './pipes/first-letter-uppercase.pipe';
import { ToColumnPipe } from './pipes/to-column.pipe';
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component';
import { LoaderComponent } from './components/loader/loader.component';
import { VisitDatePopoverComponent } from './visit-date-popover/visit-date-popover.component';
import { InitialsPipe } from './pipes/initials.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { DeletePopoverComponent } from './delete-popover/delete-popover.component';
import { VisitingPopoverComponent } from './visiting-popover/visiting-popover.component';
import { FileDownloadPopoverComponent } from './file-download-popover/file-download-popover.component';
import { CheckPlagiarismPopoverComponent } from './check-plagiarism-popover/check-plagiarism-popover.component';
import { SortByPipe } from './pipes/sort-by.pipe';
import { MarkPopoverComponent } from './mark-popover/mark-popover.component';
import { PopoverDialogComponent } from './popover-dialog/popover-dialog.component';
import { TranslatePipe } from '../../../../../container/src/app/pipe/translate.pipe';
import { FileComponent } from './components/file/file.component';
import { HelpComponent } from './components/help/help.component';
import { HelpPopoverComponent } from './components/help/help-popover/help-popover.component';
import { SubjectNameFreeDirective } from './validators/subject-name-free.validator';
import { SubjectAbbreviationFreeDirective } from './validators/subject-abbreviation-free.validator';
import { WhitespaceDirective } from './validators/whitespace.validator';

@NgModule({
  declarations: [
    FilterPipe,
    FirstLetterUppercasePipe,
    PluralPipe,
    VarDirective,
    ToColumnPipe,
    FileUploaderComponent,
    LoaderComponent,
    VisitDatePopoverComponent,
    UniquePipe,
    PluckPipe,
    InitialsPipe,
    OrderByPipe,
    DeletePopoverComponent,
    VisitingPopoverComponent,
    FileDownloadPopoverComponent,
    CheckPlagiarismPopoverComponent,
    FindPipe,
    AnyPipe,
    WidthPipe,
    SortByPipe,
    MarkPopoverComponent,
    PopoverDialogComponent,
    TranslatePipe,
    FileComponent,
    HelpComponent,
    HelpPopoverComponent,
    SubjectNameFreeDirective,
    SubjectAbbreviationFreeDirective,
    WhitespaceDirective
    ],
  imports: [
    CommonModule,
    FormsModule,
    MatModule,
    ReactiveFormsModule
  ],
  entryComponents: [
    DeletePopoverComponent,
    VisitingPopoverComponent,
    FileDownloadPopoverComponent,
    CheckPlagiarismPopoverComponent,
    MarkPopoverComponent,
    HelpPopoverComponent
  ],
  exports: [
    FilterPipe,
    PluralPipe,
    FirstLetterUppercasePipe,
    CommonModule,
    VarDirective,
    ToColumnPipe,
    FileUploaderComponent,
    VisitDatePopoverComponent,
    UniquePipe,
    PluckPipe,
    InitialsPipe,
    OrderByPipe,
    FindPipe,
    AnyPipe,
    WidthPipe,
    SortByPipe,
    PopoverDialogComponent,
    TranslatePipe,
    FileComponent,
    HelpComponent,
    SubjectNameFreeDirective,
    SubjectAbbreviationFreeDirective,
    WhitespaceDirective
  ],
  providers: [TranslatePipe]
})
export class SharedModule { }
