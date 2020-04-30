import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubjectNewsComponent} from './subject-news.component';
import {MatModule} from "../../mat.module";
import {NewsPopoverComponent} from './news-popover/news-popover.component';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [SubjectNewsComponent, NewsPopoverComponent],
  imports: [
    CommonModule,
    MatModule,
    FormsModule,
  ],
  entryComponents: [
    NewsPopoverComponent
  ],
  exports: [SubjectNewsComponent]
})
export class SubjectNewsModule { }
