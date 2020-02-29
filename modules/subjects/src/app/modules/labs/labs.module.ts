import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabsComponent } from './labs.component';
import { LabsWorkComponent } from './components/labs-work/labs-work.component';
import { ProtectionScheduleComponent } from './components/protection-schedule/protection-schedule.component';
import { VisitStatisticsComponent } from './components/visit-statistics/visit-statistics.component';
import { ResultsComponent } from './components/results/results.component';
import { JobProtectionComponent } from './components/job-protection/job-protection.component';
import {MatTableModule} from "@angular/material/table";
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [LabsComponent, LabsWorkComponent, ProtectionScheduleComponent, VisitStatisticsComponent, ResultsComponent, JobProtectionComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatSelectModule
  ]
})
export class LabsModule { }
