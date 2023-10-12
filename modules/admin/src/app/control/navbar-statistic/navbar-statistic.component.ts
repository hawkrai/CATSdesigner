import { Component, OnInit, Output } from '@angular/core'
import { MatDialog } from '@angular/material'
import { SearchGroupComponent } from '../modal/search-group/search-group.component'
import { SubjectService } from 'src/app/service/subject.service'
import { SubjectResponse } from 'src/app/model/subject.response'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-navbar-statistic',
  templateUrl: './navbar-statistic.component.html',
  styleUrls: ['./navbar-statistic.component.css'],
})
export class NavbarStatisticComponent implements OnInit {
  subjectResponse: SubjectResponse
  isLoad = false
  isWrongGroup = false
  groupName: string
  surname: string
  groupId: number
  start: string
  end: string

  constructor(
    private dialog: MatDialog,
    private subjectService: SubjectService,
    private activateRoute: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.groupName = this.activateRoute.snapshot.firstChild.params.groupName
    this.surname = this.activateRoute.snapshot.firstChild.params.surname
    this.start = this.activateRoute.snapshot.firstChild.params.start
    this.end = this.activateRoute.snapshot.firstChild.params.end
    if (this.groupName !== '0') {
      this.getSubjectName(this.groupName)
    }
  }

  getSubjectName(groupName) {
    this.subjectService.getSubjects(groupName).subscribe((subjectResponse) => {
      this.subjectResponse = subjectResponse
      this.groupId = this.subjectResponse.GroupId
      this.isLoad = true
      if (
        this.groupName &&
        subjectResponse.Subjects !== null &&
        subjectResponse.Subjects.length !== 0
      ) {
        if (
          this.surname !== undefined &&
          this.start !== undefined &&
          this.end !== undefined
        ) {
          this.router.navigate([
            '/control/statistic',
            this.groupName,
            this.surname,
            this.start,
            this.end,
          ])
        } else if (this.start !== undefined && this.end !== undefined) {
          this.router.navigate([
            '/control/statistic',
            this.groupName,
            this.start,
            this.end,
          ])
        } else if (this.surname !== undefined) {
          this.router.navigate([
            '/control/statistic',
            this.groupName,
            this.surname,
          ])
        } else {
          this.router.navigate(['/control/statistic', this.groupName])
        }
      } else {
        this.isWrongGroup = true
      }
    })
  }

  isSubject() {
    return this.subjectResponse.Subjects.length !== 0
  }

  openControlGroupDialog() {
    const ref = this.dialog.open(SearchGroupComponent)
    ref.afterClosed().subscribe(() => {
      this.ngOnInit()
    })
  }
}
