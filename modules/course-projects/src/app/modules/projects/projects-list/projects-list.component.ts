import {Component, OnInit, Input} from '@angular/core';
import {Project} from 'src/app/models/project.model';
import {Sort} from '@angular/material';
import {ProjectsComponent} from '../projects.component';
import {CourseUser} from '../../../models/course-user.model';

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.less']
})
export class ProjectsListComponent implements OnInit {

  @Input() projects: Project[];
  @Input() courseUser: CourseUser;

  constructor(private projectsComponent: ProjectsComponent) {
  }

  ngOnInit(): void {
  }

  sortData(sort: Sort) {
    this.projectsComponent.sort(sort.active, sort.direction);
  }

}
