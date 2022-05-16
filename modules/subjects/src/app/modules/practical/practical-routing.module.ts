import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { JobProtectionComponent } from "./components/job-protection/job-protection.component";
import { PracticalLessonsComponent } from "./components/practical-lessons/practical-lessons.component";
import { PracticalProtectionScheduleComponent } from "./components/practical-protection-schedule/practical-protection-schedule.component";
import { ResultsComponent } from "./components/results/results.component";
import { VisitStatisticComponent } from "./components/visit-statistic/visit-statistic.component";
import { PracticalComponent } from "./practical.component";

const routes: Routes = [
    {
        path: '',
        component: PracticalComponent,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list'
            },
            {
                path: 'list',
                component: PracticalLessonsComponent
            },
            {
                path: 'schedule',
                component: PracticalProtectionScheduleComponent
            },
            {
                path: 'visit-statistics',
                component: VisitStatisticComponent
            },
            {
                path: 'results',
                component: ResultsComponent
            },
            {
                path: 'job-protection',
                component: JobProtectionComponent
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class PracticalRoutingModule {}