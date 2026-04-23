import { Component, Input, OnInit, OnDestroy } from '@angular/core'
import { Theme } from '../../models/theme.model'
import { ProjectThemeService } from '../../services/project-theme.service'
import { TaskSheetService } from '../../services/task-sheet.service'
import { Subscription } from 'rxjs'
import { DiplomUser } from '../../models/diplom-user.model'
import { EditTaskSheetComponent } from './edit-task-sheet/edit-task-sheet.component'
import { MatDialog } from '@angular/material'
import { Template } from 'src/app/models/template.model'
import { Student } from 'src/app/models/student.model'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'
import { PercentageResultsService } from 'src/app/services/percentage-results.service'
import { LanguageService } from 'src/app/services/language.service'

@Component({
  selector: 'app-task-sheet',
  templateUrl: './task-sheet.component.html',
  styleUrls: ['./task-sheet.component.less'],
})
export class TaskSheetComponent implements OnInit, OnDestroy {
  @Input() diplomUser: DiplomUser

  public isEmpty = false

  private COUNT = 1000
  private PAGE = 1
  private searchString = ''
  private sorting = 'Id'
  private direction = 'desc'

  private themesList: Theme[]
  private taskSheetHtml: any
  private taskSheetSubscription: Subscription
  private langSubscription: Subscription

  private diplomProjectId: number
  private templates: any[]
  private tepmlate: Template
  private students: Student[]

  public isLecturer = false
  public themes = [
    {
      name: this.translatePipe.transform(
        'text.diplomProject.head',
        'Руководитель проекта'
      ),
      value: true,
    },
    {
      name: this.translatePipe.transform(
        'text.diplomProject.secretary',
        'Секретарь ГЭК'
      ),
      value: false,
    },
  ]
  public theme = undefined

  constructor(
    private projectThemeService: ProjectThemeService,
    private taskSheetService: TaskSheetService,
    private percentageResultsService: PercentageResultsService,
    private dialog: MatDialog,
    private toastr: ToastrService,
    public translatePipe: TranslatePipe,
    private languageService: LanguageService
  ) {}

  ngOnInit() {
    const toggleValue: string = localStorage.getItem('toggle')
    if (toggleValue && this.diplomUser.IsLecturer) {
      this.isLecturer = toggleValue === 'false' ? false : true
    } else {
      this.isLecturer = this.diplomUser.IsLecturer
    }
    this.theme = this.isLecturer ? this.themes[0] : this.themes[1]

    this.getStudents()
    this.loadThemes()

    this.langSubscription = this.languageService.observe().subscribe(() => {
      this.retrieveTaskSheetHtml()
    })
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe()
    }
    if (this.taskSheetSubscription) {
      this.taskSheetSubscription.unsubscribe()
    }
  }

  loadThemes() {
    const params: any = { entity: 'DiplomProject' }
    if (!this.isLecturer) {
      params.isSecretary = true
    }

    this.projectThemeService.getThemes(params).subscribe((res) => {
      this.themesList = res
      this.diplomProjectId = res[0] ? res[0].Id : null
      this.retrieveTaskSheetHtml()
      this.retrieveTemplates()
    })
  }

  lecturerStatusChange(event: any) {
    this.isLecturer = event.value.value
    localStorage.setItem('toggle', String(event.value.value))
    this.loadThemes()
  }

  onThemeChange(themeId: number) {
    this.diplomProjectId = themeId
    if (this.taskSheetSubscription) {
      this.taskSheetSubscription.unsubscribe()
    }
    this.retrieveTaskSheetHtml()
  }

  retrieveTaskSheetHtml() {
    if (this.diplomProjectId == null) {
      this.isEmpty = true
      return
    }

    this.taskSheetHtml = null
    this.isEmpty = false

    const lang = this.languageService.current

    this.taskSheetSubscription = this.taskSheetService
      .getTaskSheetHtml({
        diplomProjectId: this.diplomProjectId,
        lang: lang,
      })
      .subscribe(
        (res) => {
          if (!res) {
            this.isEmpty = true
          }
          this.taskSheetHtml = res
          const div = document.getElementById('task-sheet')
          div.innerHTML = res
        },
        () => {
          this.isEmpty = true
        }
      )
  }

  getTaskSheetTemplate(taskSheet: any): object {
    var checkTheme = this.templates.find(
      (i) =>
        i.InputData == taskSheet.InputData &&
        i.Faculty == i.Faculty &&
        i.HeadCathedra == i.HeadCathedra &&
        i.RpzContent == i.RpzContent &&
        i.DrawMaterials == i.DrawMaterials &&
        i.Univer == i.Univer &&
        i.DateEnd == i.DateEnd &&
        i.DateStart == i.DateStart
    )

    if (checkTheme != undefined) {
      this.tepmlate = new Template()
      this.tepmlate.Id = String(checkTheme.Id)
      this.tepmlate.Name = checkTheme.Name
      return this.tepmlate
    } else {
      return undefined
    }
  }

  editTaskSheet() {
    this.taskSheetService
      .getTaskSheet({ diplomProjectId: this.diplomProjectId })
      .subscribe((response) => {
        const dialogRef = this.dialog.open(EditTaskSheetComponent, {
          autoFocus: false,
          width: '600px',
          height: '100%',
          position: {
            top: '0px',
          },
          data: {
            isSecretary: this.diplomUser.IsSecretary,
            taskSheet: response,
            students: this.students,
            taskSheetTemplate: this.getTaskSheetTemplate(response),
          },
        })

        dialogRef.afterClosed().subscribe((result) => {
          if (result != null) {
            this.taskSheetService.editTaskSheet(result).subscribe(() => {
              this.ngOnInit()
              this.toastr.success(
                this.translatePipe.transform(
                  'text.editor.edit.saveTaskSheet',
                  'Лист задания успешно сохранен'
                )
              )
            })
          } else {
            this.ngOnInit()
          }
        })
      })
  }

  getStudents() {
    if (this.diplomUser.IsLecturer) {
      this.percentageResultsService
        .getPercentageResults(
          'count=' +
            this.COUNT +
            '&page=' +
            this.PAGE +
            '&filter={"isSecretary":"' +
            true +
            '","searchString":"' +
            '' +
            '"}' +
            '&sorting[' +
            'Id' +
            ']=' +
            'desc'
        )
        .subscribe((res) => {
          this.students = res.Students.Items.sort((a, b) =>
            a.Name < b.Name ? -1 : 1
          )
        })
    }
  }

  retrieveTemplates() {
    this.taskSheetService
      .getTemplates(
        'count=' +
          this.COUNT +
          '&page=' +
          this.PAGE +
          '&filter={"lecturerId":"' +
          this.diplomUser.UserId +
          '","searchString":"' +
          this.searchString +
          '"}'
      )
      .subscribe((res) => (this.templates = res.Items))
  }

  downloadTaskSheet() {
    const lang = this.languageService.current
    location.href =
      location.origin +
      '/api/DpTaskSheetDownload?diplomProjectId=' +
      this.diplomProjectId +
      '&lang=' +
      lang
  }

  downloadArchive() {
    const lang = this.languageService.current
    location.href = location.origin + '/api/DpTaskSheetDownload?lang=' + lang
  }
}
