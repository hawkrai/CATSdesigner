import { Component, Input, OnInit } from '@angular/core'
import { Sort } from '@angular/material'
import { ProjectsComponent } from '../projects.component'
import { CourseUser } from '../../../models/course-user.model'
import { Project } from '../../../models/project.model'

@Component({
  selector: 'app-projects-list',
  templateUrl: './projects-list.component.html',
  styleUrls: ['./projects-list.component.less'],
})
export class ProjectsListComponent implements OnInit {
  @Input() projects: Project[]
  @Input() courseUser: CourseUser

  private _isUserHaveSubjectCourseProject = false

  constructor(private projectsComponent: ProjectsComponent) {}

  ngOnInit(): void {
    if (this.projects) {
      this._isUserHaveSubjectCourseProject = this.projects.some(
        (project: Project) => project.StudentId === +this.courseUser.UserId
      )
    } else {
      this._isUserHaveSubjectCourseProject = false
    }
  }

  sortData(sort: Sort) {
    this.projectsComponent.sort(sort.active, sort.direction)
  }

  get isUserHaveSubjectCourseProject(): boolean {
    return this._isUserHaveSubjectCourseProject
  }

  set isUserHaveSubjectCourseProject(value) {
    this._isUserHaveSubjectCourseProject = value
  }
}
