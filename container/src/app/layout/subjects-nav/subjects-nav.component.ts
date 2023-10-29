import { AfterViewChecked, Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ChangeDetectorRef } from '@angular/core'

import { CoreService } from '../../core/services/core.service'
import { Subject } from '../../core/models/subject'
import { AuthenticationService } from './../../core/services/auth.service'
import { switchMap } from 'rxjs/operators'
import { MenuService } from 'src/app/core/services/menu.service'

@Component({
  selector: 'app-subjects-nav',
  templateUrl: './subjects-nav.component.html',
  styleUrls: ['./subjects-nav.component.less'],
})
export class SubjectsNavComponent implements OnInit, AfterViewChecked {
  opened: boolean
  subjects: Subject[]
  subjectId: number
  public isLector: boolean = false
  constructor(
    public coreService: CoreService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    public menuService: MenuService,
    private autService: AuthenticationService
  ) {}

  ngAfterViewChecked() {
    this.cdref.detectChanges()
  }

  ngOnInit(): void {
    this.isLector = this.autService.currentUserValue.role == 'lector'
    this.coreService.getUserSubjects().subscribe((subjects) => {
      this.subjects = subjects
      if (this.subjects.length > 0) {
        const urlParts = this.router.url.split('#')[0].split('/')
        const subjectId = +urlParts[urlParts.length - 1]
        this.coreService.selectedSubject = this.subjects.find(
          (element) => element.Id == subjectId
        )
        if (this.coreService.selectedSubject) {
          this.subjectId = subjectId
          this.setupLocalInfo(this.coreService.selectedSubject)
        }
      }
    })

    this.coreService.onNewSubjectId().subscribe((subjectId) => {
      this.changeSubject(subjectId)
    })

    this.coreService
      .onUpdateSubjects()
      .pipe(switchMap(() => this.coreService.getUserSubjects()))
      .subscribe((subjects) => {
        this.subjects = subjects
        if (this.coreService.selectedSubject) {
          const selectedSubject = this.subjects.find(
            (s) => s.Id === this.coreService.selectedSubject.Id
          )
          this.changeSubject(selectedSubject ? selectedSubject.Id : -1)
        }
      })
  }
  setupLocalInfo(subject: Subject): void {
    this.coreService.setCurrentSubject({
      id: subject.Id,
      Name: subject.Name,
      color: subject.Color,
    })
  }

  changeSubject(id: number): void {
    this.subjectId = id
    this.coreService.selectedSubject = this.subjects.find(
      (element) => element.Id == id
    )
    this.setupLocalInfo(this.coreService.selectedSubject)
    this.redirectToSelected()
  }

  redirectToSelected() {
    if (
      this.coreService.selectedSubject !== undefined &&
      this.coreService.selectedSubject !== null
    ) {
      this.router.navigateByUrl(
        `/web/viewer/subject/${this.coreService.selectedSubject.Id}`
      )
    }
  }

  onSubjects() {
    this.router.navigateByUrl(`web/viewer/subjects`)
  }

  onToggleClick(): void {
    this.menuService.toogleSidenav()
  }

  getSubjectTooltip(subject: Subject): string {
    const hasDuplicateNames = this.subjects.some(
      (x) =>
        x.Name.toLowerCase() === subject.Name.toLowerCase() &&
        x.Id !== subject.Id
    )
    return hasDuplicateNames
      ? `${subject.Name}\n${subject.Lector?.FullName}`
      : subject.Name
  }
}
