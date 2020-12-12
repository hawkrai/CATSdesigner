import { SharedModule } from './../../shared/shared.module';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubjectNewsComponent} from './subject-news.component';
import {MatModule} from "../../mat.module";
import {NewsPopoverComponent} from './news-popover/news-popover.component';
import {FormsModule} from '@angular/forms';
import {CKEditorModule} from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [SubjectNewsComponent, NewsPopoverComponent],
  imports: [
    CommonModule,
    MatModule,
    FormsModule,
    CKEditorModule,
    SharedModule
  ],
  entryComponents: [
    NewsPopoverComponent
  ],
  exports: [SubjectNewsComponent]
})
export class SubjectNewsModule { }
