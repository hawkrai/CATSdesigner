import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { ProjectsListComponent } from './projects-list/projects-list.component';
import {MatButtonModule, MatIconModule, MatInputModule, MatSortModule, MatTooltipModule} from '@angular/material';

@NgModule({
  declarations: [ProjectsComponent, ProjectsListComponent],
    imports: [
        CommonModule,
        MatInputModule,
        MatIconModule,
        MatButtonModule,
        MatSortModule,
        MatTooltipModule
    ],
  exports: [ProjectsComponent, ProjectsListComponent]
})
export class ProjectsModule { }
