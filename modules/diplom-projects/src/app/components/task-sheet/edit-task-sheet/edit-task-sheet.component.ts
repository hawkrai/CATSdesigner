import { Component, Inject, OnInit } from '@angular/core'
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
  MatSelectChange,
  MatSnackBar,
} from '@angular/material'
import { TaskSheet } from '../../../models/task-sheet.model'
import { FormControl, Validators } from '@angular/forms'
import { Template } from '../../../models/template.model'
import { TaskSheetService } from '../../../services/task-sheet.service'
import { TaskSheetTemplate } from '../../../models/task-sheet-template.model'
import { Project } from 'src/app/models/project.model'
import { ProjectsService } from 'src/app/services/projects.service'
import { Student } from 'src/app/models/student.model'
import { TranslatePipe } from 'educats-translate'
import { ToastrService } from 'ngx-toastr'
import { HelpPopoverScheduleComponent } from 'src/app/shared/help-popover/help-popover-schedule.component'
import { PercentageResultsService } from 'src/app/services/percentage-results.service'
import { Subject } from 'rxjs'

interface DialogData {
  isSecretary: boolean
  taskSheet: TaskSheet
  students: Student[]
  taskSheetTemplate: Template
}

interface Help {
  message: string
  action: string
}

@Component({
  selector: 'app-edit-task-sheet',
  templateUrl: './edit-task-sheet.component.html',
  styleUrls: ['./edit-task-sheet.component.less'],
})
export class EditTaskSheetComponent implements OnInit {
  private readonly destroy$: Subject<void> = new Subject<void>()

  private COUNT = 1000000
  private PAGE = 1
  private searchString = ''
  private sorting = 'Id'
  private direction = 'desc'

  helpMessage: Help = {
    message: this.translatePipe.transform(
      'text.diplomProject.list.help.message',
      'Выберите готовый шаблон, чтобы применить его к листу задания. Шаблон можно изменить и применить к указанным группам'
    ),
    action: this.translatePipe.transform(
      'text.diplomProject.help.clear',
      'Понятно'
    ),
  }

  private templateNameControl: FormControl = new FormControl(null, [
    Validators.maxLength(30),
    Validators.required,
  ])

  private inputDataControl: FormControl = new FormControl(
    this.data.taskSheet.InputData,
    [Validators.maxLength(999)]
  )

  private contentControl: FormControl = new FormControl(
    this.data.taskSheet.RpzContent,
    [Validators.maxLength(999)]
  )

  private drawContentControl: FormControl = new FormControl(
    this.data.taskSheet.DrawMaterials,
    [Validators.maxLength(999)]
  )

  private univerControl: FormControl = new FormControl(
    this.data.taskSheet.Univer,
    [Validators.maxLength(255)]
  )

  private facultyControl: FormControl = new FormControl(
    this.data.taskSheet.Faculty,
    [Validators.maxLength(255)]
  )

  private headCathedraControl: FormControl = new FormControl(
    this.data.taskSheet.HeadCathedra,
    [Validators.maxLength(255)]
  )

  private computerConsultantControl: FormControl = new FormControl(
    this.data.taskSheet.ComputerConsultant,
    [Validators.maxLength(255)]
  )

  private healthAndSafetyConsultantControl: FormControl = new FormControl(
    this.data.taskSheet.HealthAndSafetyConsultant,
    [Validators.maxLength(255)]
  )

  private econimicsConsultantControl: FormControl = new FormControl(
    this.data.taskSheet.EconimicsConsultant,
    [Validators.maxLength(255)]
  )

  private normocontrolConsultantControl: FormControl = new FormControl(
    this.data.taskSheet.NormocontrolConsultant,
    [Validators.maxLength(255)]
  )

  private decreeNumberControl: FormControl = new FormControl(
    this.data.taskSheet.DecreeNumber,
    [Validators.maxLength(30)]
  )

  private startDateControl = new FormControl(
    this.data.taskSheet.DateStart != null
      ? new Date(this.data.taskSheet.DateStart)
      : new Date()
  )

  private endDateControl = new FormControl(this.data.taskSheet.DateEnd)

  private decreeDateControl = new FormControl(
    this.data.taskSheet.DecreeDate != null
      ? new Date(this.data.taskSheet.DecreeDate)
      : new Date()
  )

  private templates: Template[]
  private selectedStudents: any[]
  private projects: Project[]
  private taskSheets: TaskSheet[]
  private selectedTemplate = 'data.taskSheetTemplate'

  templateId: number = undefined

  constructor(
    private taskSheetService: TaskSheetService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<EditTaskSheetComponent>,
    private projectsService: ProjectsService,
    public translatePipe: TranslatePipe,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.taskSheetService
      .getTemplateList({ entity: 'DiplomProjectTaskSheetTemplate' })
      .subscribe((res) => (this.templates = res))
    this.retrieveProjects()
    this.retrieveTaskSheets()
  }

  onCancelClick(): void {
    this.dialogRef.close()
  }

  showHelp(): void {
    const dialogRef = this.dialog.open(HelpPopoverScheduleComponent, {
      data: {
        message: this.helpMessage.message,
        action: this.helpMessage.action,
      },
      disableClose: true,
      hasBackdrop: true,
      backdropClass: 'backdrop-help',
      panelClass: 'help-popover',
    })

    dialogRef.afterClosed().subscribe((result) => {})
  }

  onTemplateChange(event: MatSelectChange) {
    this.templateId = event.value.Id
    this.taskSheetService
      .getTemplate({ templateId: event.value.Id })
      .subscribe((res) => {
        this.templateNameControl.setValue(event.value.Name)
        this.inputDataControl.setValue(res.InputData)
        this.contentControl.setValue(res.RpzContent)
        this.drawContentControl.setValue(res.DrawMaterials)
        this.univerControl.setValue(res.Univer)
        this.facultyControl.setValue(res.Faculty)
        this.headCathedraControl.setValue(res.HeadCathedra)
        this.startDateControl.setValue(res.DateStart)
        this.endDateControl.setValue(res.DateEnd)
        this.computerConsultantControl.setValue(res.ComputerConsultant)
        this.healthAndSafetyConsultantControl.setValue(
          res.HealthAndSafetyConsultant
        )
        this.econimicsConsultantControl.setValue(res.EconimicsConsultant)
        this.normocontrolConsultantControl.setValue(res.NormocontrolConsultant)
        this.decreeNumberControl.setValue(res.DecreeNumber)
        this.decreeDateControl.setValue(res.DecreeDate)
      })
  }

  isFormInvalid(): boolean {
    return (
      this.inputDataControl.invalid ||
      this.contentControl.invalid ||
      this.drawContentControl.invalid ||
      this.univerControl.invalid ||
      this.facultyControl.invalid ||
      this.headCathedraControl.invalid ||
      this.startDateControl.invalid ||
      this.endDateControl.invalid ||
      this.computerConsultantControl.invalid ||
      this.healthAndSafetyConsultantControl.invalid ||
      this.econimicsConsultantControl.invalid ||
      this.normocontrolConsultantControl.invalid ||
      this.decreeNumberControl.invalid ||
      this.decreeDateControl.invalid
    )
  }

  isSelectedGroupsInvalid(): boolean {
    if (this.selectedStudents == undefined) {
      return true
    }
    return this.selectedStudents.length < 1
  }

  saveTemplate() {
    const template = new TaskSheetTemplate()
    template.Name = this.templateNameControl.value
    this.populateSheet(template)
    this.taskSheetService.editTemplate(template).subscribe(() => {
      this.ngOnInit()
      this.toastr.success(
        this.translatePipe.transform(
          'text.editor.edit.patternSave',
          'Шаблон успешно сохранен'
        )
      )
    })
  }

  applyTemplate() {
    this.projects.forEach((element) => {
      if (element.Id != null) {
        if (this.selectedStudents.includes(element.Student)) {
          let taskSheet = this.taskSheets.find(
            (i) => i.DiplomProjectId === element.Id
          )
          this.populateSheet(taskSheet)
          this.taskSheetService.editTaskSheet(taskSheet).subscribe()
        }
      }

      this.toastr.success(
        this.translatePipe.transform(
          'text.editor.edit.patternApply',
          'Шаблон успешно применен'
        )
      )
    })
  }

  getResultForm(): TaskSheet {
    this.populateSheet(this.data.taskSheet)
    return this.data.taskSheet
  }

  deleteTemplate() {
    this.taskSheetService
      .deleteTemplate({ taskSheetId: this.templateId })
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.retrieveTaskSheets()
      })
  }

  populateSheet(taskSheet: TaskSheet): void {
    taskSheet.InputData = this.inputDataControl.value
    taskSheet.RpzContent = this.contentControl.value
    taskSheet.DrawMaterials = this.drawContentControl.value
    taskSheet.Univer = this.univerControl.value
    taskSheet.Faculty = this.facultyControl.value
    taskSheet.HeadCathedra = this.headCathedraControl.value
    taskSheet.DateStart = this.startDateControl.value
    taskSheet.DateEnd = this.endDateControl.value
    taskSheet.ComputerConsultant = this.computerConsultantControl.value
    taskSheet.HealthAndSafetyConsultant =
      this.healthAndSafetyConsultantControl.value
    taskSheet.EconimicsConsultant = this.econimicsConsultantControl.value
    taskSheet.NormocontrolConsultant = this.normocontrolConsultantControl.value
    taskSheet.DecreeNumber = this.decreeNumberControl.value
    taskSheet.DecreeDate = this.decreeDateControl.value
  }

  retrieveProjects() {
    this.projectsService
      .getProjects(
        'count=' +
          this.COUNT +
          '&page=' +
          this.PAGE +
          '&filter={"isSecretary":"' +
          'true' +
          '","searchString":"' +
          this.searchString +
          '"}' +
          '&sorting[' +
          this.sorting +
          ']=' +
          this.direction
      )
      .subscribe((res) => (this.projects = res.Items))
  }

  retrieveTaskSheets() {
    this.taskSheetService
      .getTaskSheets(
        'count=' +
          this.COUNT +
          '&page=' +
          this.PAGE +
          '&filter={"searchString":"' +
          this.searchString +
          '"}' +
          '&sorting[' +
          'Id' +
          ']=' +
          'desc'
      )
      .subscribe((res) => (this.taskSheets = res))
  }
}
function takeUntil(
  destroy$: any
): import('rxjs').OperatorFunction<any, unknown> {
  throw new Error('Function not implemented.')
}
