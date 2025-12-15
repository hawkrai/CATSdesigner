import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { Theme } from '../../models/theme.model'
import { TaskSheetService } from '../../services/task-sheet.service'
import { Subscription } from 'rxjs'
import { CourseUser } from '../../models/course-user.model'
import { EditTaskSheetComponent } from './edit-task-sheet/edit-task-sheet.component'
import { MatDialog } from '@angular/material'
import { select, Store } from '@ngrx/store'
import { IAppState } from '../../store/state/app.state'
import { getSubjectId } from '../../store/selectors/subject.selector'
import { CoreGroup } from 'src/app/models/core-group.model'
import { Template } from 'src/app/models/template.model'
import { ToastrService } from 'ngx-toastr'
import { TranslatePipe } from 'educats-translate'
import { ProjectsService } from 'src/app/services/projects.service'
import { map } from 'rxjs/operators'
import { LanguageService } from '../../services/language.service'

@Component({
  selector: 'app-task-sheet',
  templateUrl: './task-sheet.component.html',
  styleUrls: ['./task-sheet.component.less'],
})
export class TaskSheetComponent implements OnInit, OnDestroy {
  @Input() courseUser: CourseUser
  @Input() groups: CoreGroup[]

  private themes: Theme[]
  private taskSheetHtml: string
  private taskSheetSubscription: Subscription
  private subjectSubscription: Subscription
  private languageSubscription: Subscription

  private subjectId: string
  private courseProjectId: number
  private templates: any[]
  private template: Template

  constructor(
    private projectsService: ProjectsService,
    private taskSheetService: TaskSheetService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe,
    private languageService: LanguageService,
    private store: Store<IAppState>
  ) {}

  ngOnInit() {
    this.subjectSubscription = this.store
      .pipe(select(getSubjectId))
      .subscribe((subjectId) => {
        this.subjectId = subjectId
        this.loadProjects()
      })

    this.languageSubscription = this.languageService.observe().subscribe(lang => {
      if (this.courseProjectId) {
        this.retrieveTaskSheetHtml(lang)
      }
    })
  }

  ngOnDestroy() {
    if (this.taskSheetSubscription) this.taskSheetSubscription.unsubscribe()
    if (this.subjectSubscription) this.subjectSubscription.unsubscribe()
    if (this.languageSubscription) this.languageSubscription.unsubscribe()
  }

  private loadProjects() {
    this.projectsService
      .getProjects(
        'count=' +
        1000000 +
        '&page=' +
        1 +
        '&filter={"subjectId":"' +
        this.subjectId +
        '","searchString":""}' +
        '&filter[subjectId]=' +
        this.subjectId +
        '&sorting[Id]=' +
        'desc'
      )
      .pipe(map((res: any) => res.Items))
      .subscribe((res) => {
        if (res.length > 0) {
          this.themes = res.sort((a, b) => (a.Theme < b.Theme ? -1 : 1))
          if (!this.courseProjectId) this.courseProjectId = res[0].Id

          if (this.courseUser.IsStudent) {
            const project = res.find(item => item.StudentId === this.courseUser.UserId)
            if (project) this.courseProjectId = project.Id
          }

          this.retrieveTaskSheetHtml(this.languageService.current)
          this.retrieveTemplates()
        }
      })
  }

  onThemeChange(themeId: number) {
    this.courseProjectId = themeId
    if (this.taskSheetSubscription) this.taskSheetSubscription.unsubscribe()
    this.retrieveTaskSheetHtml(this.languageService.current)
  }

  retrieveTaskSheetHtml(lang: string) {
    this.taskSheetHtml = null
    this.taskSheetSubscription = this.taskSheetService
      .getTaskSheetHtml({
        courseProjectId: this.courseProjectId,
        language: lang
      })
      .subscribe(res => {
        if (res) {
          this.taskSheetHtml = res
          const div = document.getElementById('task-sheet')
          if (div) div.innerHTML = res
        }
      })
  }

  getTaskSheetTemplate(taskSheet: any): Template | undefined {
    if (!this.templates) return undefined
    const found = this.templates.find(
      i =>
        i.InputData === taskSheet.InputData &&
        i.Faculty === taskSheet.Faculty &&
        i.HeadCathedra === taskSheet.HeadCathedra &&
        i.RpzContent === taskSheet.RpzContent &&
        i.DrawMaterials === taskSheet.DrawMaterials &&
        i.Univer === taskSheet.Univer &&
        i.DateEnd === taskSheet.DateEnd &&
        i.DateStart === taskSheet.DateStart
    )
    if (!found) return undefined

    this.template = new Template()
    this.template.Id = String(found.Id)
    this.template.Name = found.Name
    return this.template
  }

  editTaskSheet() {
    this.taskSheetService
      .getTaskSheet({ courseProjectId: this.courseProjectId })
      .subscribe(response => {
        const dialogRef = this.dialog.open(EditTaskSheetComponent, {
          width: '548px',
          data: {
            subjectId: this.subjectId,
            taskSheet: response,
            groups: this.groups,
            userId: this.courseUser.UserId,
            taskSheetTemplate: this.getTaskSheetTemplate(response)
          }
        })

        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.taskSheetService.editTaskSheet(result).subscribe(() => {
              this.retrieveTaskSheetHtml(this.languageService.current)
              this.toastr.success(
                this.translatePipe.transform(
                  'text.list.changed.successfully',
                  'Лист задания успешно сохранен'
                )
              )
            })
          } else {
            this.retrieveTaskSheetHtml(this.languageService.current)
          }
        })
      })
  }

  retrieveTemplates() {
    this.taskSheetService
      .getTemplates(
        'count=1000000' +
        '&page=1' +
        '&filter={"lecturerId":"' +
        this.courseUser.UserId +
        '","searchString":"' +
        '' +
        '"}' +
        '&filter[lecturerId]=' +
        this.courseUser.UserId +
        '&sorting[' +
        'Id' +
        ']=' +
        'desc'
      )
      .subscribe(res => (this.templates = res.Items))
  }

  downloadTaskSheet() {
    const lang = this.languageService.current
    location.href =
      `${location.origin}/api/CPTaskSheetDownload` +
      `?courseProjectId=${this.courseProjectId}` +
      `&lang=${lang}`
  }

  get isSelectDisabled(): boolean {
    return this.courseUser.IsStudent && !this.courseUser.IsLecturer
  }
}
