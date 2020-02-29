import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SubjectNewsComponent} from './subject-news.component';
import {MatModule} from "../../mat.module";

@NgModule({
  declarations: [SubjectNewsComponent],
  imports: [
    CommonModule,
    MatModule,
  ],
  exports: [SubjectNewsComponent]
})
export class SubjectNewsModule { }
