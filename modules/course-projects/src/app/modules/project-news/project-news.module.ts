import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectNewsComponent } from './project-news.component';



@NgModule({
  declarations: [ProjectNewsComponent],
  imports: [
    CommonModule
  ],
  exports: [ProjectNewsComponent]
})
export class ProjectNewsModule { }
