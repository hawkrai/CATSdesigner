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
import {FormsModule} from '@angular/forms';
import {LabsMarkPopoverComponent} from './components/results/labs-mark-popover/labs-mark-popover.component';


@NgModule({
  declarations: [
    LabsComponent,
    LabsWorkComponent,
    ProtectionScheduleComponent,
    VisitStatisticsComponent,
    ResultsComponent,
    JobProtectionComponent,
    LabWorkPopoverComponent,
    LabsMarkPopoverComponent,
  ],
  entryComponents: [
    LabWorkPopoverComponent,
    LabsMarkPopoverComponent
  ],
  imports: [
    CommonModule,
    MatModule,
    FormsModule,
  ]
})
export class LabsModule { }
