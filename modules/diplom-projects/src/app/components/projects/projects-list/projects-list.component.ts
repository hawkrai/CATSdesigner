import {Component, OnInit, Input} from '@angular/core';
import {Sort} from '@angular/material';
import {ProjectsComponent} from '../projects.component';
import { MatTable } from '@angular/material';
import {DiplomUser} from '../../../models/diplom-user.model';
import {Project} from '../../../models/project.model';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.less']
})
export class ProjectsListComponent implements OnInit {

  @Input() filteredProjects: Project[];
  @Input() courseUser: DiplomUser;

  constructor(private projectsComponent: ProjectsComponent) {
  }

  ngOnInit(): void {
  }

  sortData(sort: Sort) {
    this.projectsComponent.sort(sort.active, sort.direction);
  }

}
