import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LecturesComponent } from './lectures.component';
import { LecturesListComponent } from './components/lectures-list/lectures-list.component';
import { VisitLecturesComponent } from './components/visit-lectures/visit-lectures.component';
import {MatSelectModule} from '@angular/material/select';
import {MatTableModule} from '@angular/material/table';

@NgModule({
  declarations: [LecturesComponent, LecturesListComponent, VisitLecturesComponent],
  imports: [
    CommonModule,
    MatSelectModule,
    MatTableModule
  ],
  exports: [LecturesComponent, LecturesListComponent, VisitLecturesComponent]
})
export class LecturesModule { }
