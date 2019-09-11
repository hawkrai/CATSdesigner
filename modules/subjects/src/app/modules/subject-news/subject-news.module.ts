import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubjectNewsComponent } from './subject-news.component';



@NgModule({
  declarations: [SubjectNewsComponent],
  imports: [
    CommonModule
  ],
  exports: [SubjectNewsComponent]
})
export class SubjectNewsModule { }
