import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewerComponent } from './pages/viewer/viewer.component';
import { SubjectComponent } from './pages/subject/subject.component';



@NgModule({
  declarations: [
    ViewerComponent, 
    SubjectComponent]
  ,
  imports: [
    CommonModule
  ]
})
export class ViewerModule { }
