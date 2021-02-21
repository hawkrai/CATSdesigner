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
import { PracticalProtectionScheduleComponent } from './components/practical-protection-schedule/practical-protection-schedule.component';
import { VisitDatePracticalsPopoverComponent } from './components/practical-protection-schedule/visit-date-practicals-popover/visit-date-practicals-popover.component';

@NgModule({
  declarations: [
    PracticalComponent, 
    PracticalLessonsComponent, 
    PracticalLessonPopoverComponent, 
    VisitStatisticComponent, 
    PracticalProtectionScheduleComponent, 
    VisitDatePracticalsPopoverComponent],
  imports: [
    CommonModule,
    MatModule,
    FormsModule,
    SharedModule,
    DragDropModule,
  ],
  entryComponents: [
    PracticalLessonPopoverComponent,
    VisitDatePracticalsPopoverComponent
  ],
})
export class PracticalModule { }
