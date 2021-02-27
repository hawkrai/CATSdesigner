import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LabsComponent} from './labs.component';
import {LabsWorkComponent} from './components/labs-work/labs-work.component';
import {ProtectionScheduleComponent} from './components/protection-schedule/protection-schedule.component';
import {VisitStatisticsComponent} from './components/visit-statistics/visit-statistics.component';
import {ResultsComponent} from './components/results/results.component';
import {JobProtectionComponent} from './components/job-protection/job-protection.component';
import {MatModule} from '../../mat.module';
import {LabWorkPopoverComponent} from './components/labs-work/lab-work-popover/lab-work-popover.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AddLabPopoverComponent} from './components/job-protection/add-lab-popover/add-lab-popover.component';
import {SharedModule} from '../../shared/shared.module';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {ResultPipe} from './components/results/result.pipe/result.pipe';
import {MarkPropertyPipe} from './components/results/mark-property.pipe/mark-property.pipe';
import {VisitPipe} from './components/results/visit.pipe/visit.pipe';
import {CheckPlagiarismStudentComponent} from './components/job-protection/check-plagiarism-student/check-plagiarism-student.component';
import { VisitDateLabsPopoverComponent } from './components/protection-schedule/visit-date-labs-popover/visit-date-labs-popover.component';
import { StudentJobProtectionComponent } from './components/job-protection/student-job-protection/student-job-protection.component';
import { TeacherJobProtectionComponent } from './components/job-protection/teacher-job-protection/teacher-job-protection.component';
import { JobProtectionContentComponent } from './components/job-protection/job-protection-content/job-protection-content.component';
import { JobProtectionItemComponent } from './components/job-protection/job-protection-item/job-protection-item.component';


@NgModule({
  declarations: [
    LabsComponent,
    LabsWorkComponent,
    ProtectionScheduleComponent,
    VisitStatisticsComponent,
    ResultsComponent,
    JobProtectionComponent,
    LabWorkPopoverComponent,
    AddLabPopoverComponent,
    CheckPlagiarismStudentComponent,
    ResultPipe,
    MarkPropertyPipe,
    VisitPipe,
    VisitDateLabsPopoverComponent,
    StudentJobProtectionComponent,
    TeacherJobProtectionComponent,
    JobProtectionContentComponent,
    JobProtectionItemComponent
  ],
  entryComponents: [
    LabWorkPopoverComponent,
    AddLabPopoverComponent,
    CheckPlagiarismStudentComponent,
    VisitDateLabsPopoverComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    DragDropModule
  ],
})
export class LabsModule { }
