import { WidthPipe } from './pipes/width.pipe'
import { AnyPipe } from './pipes/any.pipe'
import { FindPipe } from './pipes/find.pipe'
import { PluckPipe } from './pipes/pluck.pipe'
import { UniquePipe } from './pipes/unique.pipe'
import { VarDirective } from './directives/var.directive'
import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TranslateModule, TranslatePipe } from 'educats-translate'
import { PopoverModule } from 'ngx-smart-popover'

import { FilterPipe } from './pipes/filter.pipe'
import { PluralPipe } from './pipes/plural.pipe'
import { MatModule } from '../mat.module'
import { FirstLetterUppercasePipe } from './pipes/first-letter-uppercase.pipe'
import { ToColumnPipe } from './pipes/to-column.pipe'
import { FileUploaderComponent } from './components/file-uploader/file-uploader.component'
import { LoaderComponent } from './components/loader/loader.component'
import { VisitDatePopoverComponent } from './visit-date-popover/visit-date-popover.component'
import { InitialsPipe } from './pipes/initials.pipe'
import { OrderByPipe } from './pipes/order-by.pipe'
import { DeletePopoverComponent } from './delete-popover/delete-popover.component'
import { VisitingPopoverComponent } from './visiting-popover/visiting-popover.component'
import { FileDownloadPopoverComponent } from './file-download-popover/file-download-popover.component'
import { CheckPlagiarismPopoverComponent } from './check-plagiarism-popover/check-plagiarism-popover.component'
import { SortByPipe } from './pipes/sort-by.pipe'
import { MarkPopoverComponent } from './mark-popover/mark-popover.component'
import { PopoverDialogComponent } from './popover-dialog/popover-dialog.component'
import { FileComponent } from './components/file/file.component'
import { HelpComponent } from './components/help/help.component'
import { SubjectNameFreeDirective } from './validators/subject-name-free.validator'
import { SubjectAbbreviationFreeDirective } from './validators/subject-abbreviation-free.validator'
import { WhitespaceDirective } from './validators/whitespace.validator'
import { FileViewerComponent } from './components/file-viewer/file-viewer.component'
import { SubdivisionComponent } from './subdivision/subdivision.component'
import { ListComponent } from './components/list/list.component'
import { ListItemComponent } from './components/list/list-item/list-item.component'
import { ListItemHeaderDirective } from './components/list/directives/list-item-header.directive'
import { ListItemBodyDirective } from './components/list/directives/list-item-body.directive'
import { ListItemActionsDirective } from './components/list/directives/list-item-actions.directive'
import * as dataEn from '../core/translation/translations_en.json'
import * as dataRu from '../core/translation/translations_ru.json'
import { SomePipe } from './pipes/some.pipe'
import { StartWithPipe } from './pipes/start-with.pipe'
import { FirstLetterPipe } from './pipes/first-letter.pipe'
import { CheckPlagiarismStudentComponent } from './check-plagiarism-student/check-plagiarism-student.component'

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
    FileComponent,
    HelpComponent,
    SubjectNameFreeDirective,
    SubjectAbbreviationFreeDirective,
    WhitespaceDirective,
    FileViewerComponent,
    SubdivisionComponent,
    ListComponent,
    ListItemComponent,
    ListItemHeaderDirective,
    ListItemBodyDirective,
    ListItemActionsDirective,
    SomePipe,
    StartWithPipe,
    FirstLetterPipe,
    CheckPlagiarismStudentComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatModule,
    ReactiveFormsModule,
    PopoverModule,
    TranslateModule.forRoot({
      localizationMap: {
        ru: dataRu,
        en: dataEn,
      },
    }),
  ],
  entryComponents: [
    DeletePopoverComponent,
    VisitingPopoverComponent,
    FileDownloadPopoverComponent,
    CheckPlagiarismPopoverComponent,
    MarkPopoverComponent,
    SubdivisionComponent,
    CheckPlagiarismStudentComponent,
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
    WhitespaceDirective,
    PopoverModule,
    ListComponent,
    ListItemHeaderDirective,
    ListItemBodyDirective,
    ListItemActionsDirective,
    SomePipe,
    StartWithPipe,
    FirstLetterPipe,
    CheckPlagiarismStudentComponent,
  ],
  providers: [TranslatePipe],
})
export class SharedModule {}
