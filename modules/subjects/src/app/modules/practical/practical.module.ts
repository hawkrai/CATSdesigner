import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PracticalComponent } from './practical.component';
import {MatModule} from '../../mat.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { PracticalLessonsComponent } from './components/practical-lessons/practical-lessons.component';
import {PracticalLessonPopoverComponent} from './components/practical-lesson-popover/practical-lesson-popover.component';
import { VisitStatisticComponent } from './components/visit-statistic/visit-statistic.component';
import { PracticalProtectionScheduleComponent } from './components/practical-protection-schedule/practical-protection-schedule.component';
import { VisitDatePracticalsPopoverComponent } from './components/practical-protection-schedule/visit-date-practicals-popover/visit-date-practicals-popover.component';
import { ResultsComponent } from './components/results/results.component';
import { MarkPropertyPipe } from './pipes/mark-property.pipe';
import { ResultPipe } from './pipes/result.pipe';
import { VisitPipe } from './pipes/visit.pipe';
import { PracticalRoutingModule } from './practical-routing.module';
import { AddPracticalPopoverComponent } from './components/job-protection/add-practical-popover/add-practical-popover.component';
import { StudentJobProtectionComponent } from './components/job-protection/student-job-protection/student-job-protection.component';
import { JobProtectionContentComponent } from './components/job-protection/job-protection-content/job-protection-content.component';
import { TeacherJobProtectionComponent } from './components/job-protection/teacher-job-protection/teacher-job-protection.component';
import { JobProtectionComponent } from './components/job-protection/job-protection.component';

@NgModule({
  declarations: [
    PracticalComponent, 
    PracticalLessonsComponent, 
    PracticalLessonPopoverComponent, 
    VisitStatisticComponent, 
    PracticalProtectionScheduleComponent, 
    VisitDatePracticalsPopoverComponent, 
    ResultsComponent, 
    MarkPropertyPipe,
    ResultPipe, 
    VisitPipe,
    AddPracticalPopoverComponent,
    JobProtectionContentComponent,
    StudentJobProtectionComponent,
    TeacherJobProtectionComponent,
    JobProtectionComponent
  ],
  imports: [
    PracticalRoutingModule,
    CommonModule,
    MatModule,
    FormsModule,
    SharedModule,
    DragDropModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    PracticalLessonPopoverComponent,
    VisitDatePracticalsPopoverComponent,
    AddPracticalPopoverComponent
  ],
})
export class PracticalModule { }
