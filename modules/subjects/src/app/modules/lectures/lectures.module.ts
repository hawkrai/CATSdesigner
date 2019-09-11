import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LecturesComponent } from './lectures.component';
import { LecturesListComponent } from './components/lectures-list/lectures-list.component';
import { VisitLecturesComponent } from './components/visit-lectures/visit-lectures.component';



@NgModule({
  declarations: [LecturesComponent, LecturesListComponent, VisitLecturesComponent],
  imports: [
    CommonModule
  ],
  exports: [LecturesComponent, LecturesListComponent, VisitLecturesComponent]
})
export class LecturesModule { }
