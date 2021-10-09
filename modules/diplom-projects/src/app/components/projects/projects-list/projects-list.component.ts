import {Component, OnInit, Input} from '@angular/core';
import {Sort} from '@angular/material';
import {ProjectsComponent} from '../projects.component';
import { MatTable } from '@angular/material';
import {DiplomUser} from '../../../models/diplom-user.model';
import {Project} from '../../../models/project.model';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.less']
})
export class ProjectsListComponent implements OnInit {

  @Input() filteredProjects: Project[];
  @Input() diplomUser: DiplomUser;
  private component: ProjectsComponent

  constructor(private projectsComponent: ProjectsComponent, public translatePipe: TranslatePipe) {
    this.component = projectsComponent
  }

  ngOnInit(): void {
  }

  sortData(sort: Sort) {
    this.projectsComponent.sort(sort.active, sort.direction);
  }

}
