import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticalComponent } from './practical.component';
import {MatModule} from '../../mat.module';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PracticalLessonsComponent } from './components/practical-lessons/practical-lessons.component';
import {PracticalLessonPopoverComponent} from './components/practical-lesson-popover/practical-lesson-popover.component';
import { VisitStatisticComponent } from './components/visit-statistic/visit-statistic.component';



@NgModule({
  declarations: [PracticalComponent, PracticalLessonsComponent, PracticalLessonPopoverComponent, VisitStatisticComponent],
  imports: [
    CommonModule,
    MatModule,
    FormsModule,
    SharedModule,
    DragDropModule,
  ],
  entryComponents: [
    PracticalLessonPopoverComponent
  ],
})
export class PracticalModule { }
