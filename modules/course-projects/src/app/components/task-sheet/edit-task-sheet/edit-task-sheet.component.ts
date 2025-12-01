import { Component, Inject, OnDestroy, OnInit } from '@angular/core'
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatSelectChange,
} from '@angular/material'
import { TaskSheet } from '../../../models/task-sheet.model'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Template } from '../../../models/template.model'
import { TaskSheetService } from '../../../services/task-sheet.service'
import { TaskSheetTemplate } from '../../../models/task-sheet-template.model'
import { Project } from 'src/app/models/project.model'
import { ProjectsService } from 'src/app/services/projects.service'
import { CoreGroup } from 'src/app/models/core-group.model'
import { Help } from '../../../models/help.model'
import { HelpPopoverScheduleComponent } from '../../../shared/help-popover/help-popover-schedule.component'
import { MatDialog } from '@angular/material/dialog'
import { ToastrService } from 'ngx-toastr'
import { TranslatePipe } from 'educats-translate'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'

interface DialogData {
  subjectId: string
  taskSheet: TaskSheet
  groups: CoreGroup[]
  taskSheetTemplate: Template
  userId: number
}

function createEmptyTaskSheet(courseProjectId: string): TaskSheet {
  return {
    CourseProjectId: courseProjectId,
    InputData: '',
    Faculty: '',
    CathedraName: '',
    HeadCathedra: '',
    RpzContent: '',
    DrawMaterials: '',
    Univer: '',
    DateEnd: '',
    DateEndString: '',
    DateStart: '',
    DateStartString: ''
  };
}

@Component({
  selector: 'app-edit-task-sheet',
  templateUrl: './edit-task-sheet.component.html',
  styleUrls: ['./edit-task-sheet.component.less'],
})
export class EditTaskSheetComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject<void>()

  formGroup: FormGroup
  templateId: number = undefined

  private COUNT = 1000000
  private PAGE = 1
  hasChange = false

  private templates: Template[]
  selectedGroups: string[] = []
  private projects: Project[]
  private taskSheets: TaskSheet[]
  selectedTemplate = 'data.taskSheetTemplate'

  constructor(
    private taskSheetService: TaskSheetService,
    public dialogRef: MatDialogRef<EditTaskSheetComponent>,
    private projectsService: ProjectsService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private translatePipe: TranslatePipe,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.initForm()
    this.getTemplates()
    this.retrieveProjects()
    this.retrieveTaskSheets()
    this.onCreateGroupFormValueChange()
  }

  ngOnDestroy(): void {
    if (!this.destroy$.closed) {
      this.destroy$.next()
      this.destroy$.unsubscribe()
    }
  }

  close(): void {
    this.dialogRef.close()
  }

  getTemplates(): void {
    this.taskSheetService
      .getTemplateList({
        entity: 'CourseProjectTaskSheetTemplate',
        subjectId: this.data.subjectId,
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.templates = res))
  }

  private initForm(): void {
    if (!this.formGroup) {
      this.formGroup = this.formBuilder.group({
        templateNameControl: new FormControl(null, [
          Validators.maxLength(30),
          Validators.required,
          this.noWhitespaceValidator,
        ]),
        inputDataControl: new FormControl(this.data.taskSheet.InputData, [
          Validators.maxLength(999),
        ]),
        contentControl: new FormControl(this.data.taskSheet.RpzContent, [
          Validators.maxLength(999),
        ]),
        drawContentControl: new FormControl(this.data.taskSheet.DrawMaterials, [
          Validators.maxLength(999),
        ]),
        univerControl: new FormControl(this.data.taskSheet.Univer, [
          Validators.maxLength(255),
        ]),
        facultyControl: new FormControl(this.data.taskSheet.Faculty, [
          Validators.maxLength(255),
        ]),
        departmentControl: new FormControl(this.data.taskSheet.CathedraName, [
          Validators.maxLength(255),
        ]),
        headCathedraControl: new FormControl(
          this.data.taskSheet.HeadCathedra,
          [Validators.maxLength(255)]
        ),
        startDateControl: new FormControl(
          this.data.taskSheet.DateStart != null
            ? new Date(this.data.taskSheet.DateStart)
            : new Date()
        ),
        endDateControl: new FormControl(this.data.taskSheet.DateEnd),
      })
    }
  }

  noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0
    return !isWhitespace ? null : { whitespace: true }
  }

  onCreateGroupFormValueChange() {
    const initialValue = this.formGroup.value
    this.formGroup.valueChanges.subscribe((value) => {
      this.hasChange = JSON.stringify(initialValue) !== JSON.stringify(value)
    })
  }

  onCancelClick(): void {
    this.dialogRef.close()
  }

  onTemplateChange(event: MatSelectChange) {
    this.templateId = event.value.Id
    this.taskSheetService
      .getTemplate({ templateId: event.value.Id })
      .subscribe((res) => {
        this.formGroup.controls.templateNameControl.setValue(event.value.Name)
        this.formGroup.controls.inputDataControl.setValue(res.InputData)
        this.formGroup.controls.contentControl.setValue(res.RpzContent)
        this.formGroup.controls.drawContentControl.setValue(res.DrawMaterials)
        this.formGroup.controls.univerControl.setValue(res.Univer)
        this.formGroup.controls.facultyControl.setValue(res.Faculty)
        this.formGroup.controls.departmentControl.setValue(res.CathedraName)
        this.formGroup.controls.headCathedraControl.setValue(res.HeadCathedra)
        this.formGroup.controls.startDateControl.setValue(res.DateStart)
        this.formGroup.controls.endDateControl.setValue(res.DateEnd)
      })
  }

  isSelectedGroupsInvalid(): boolean {
    return !this.selectedGroups || this.selectedGroups.length < 1
  }

  saveTemplate(): void {
    if (!this.selectedGroups) {
      this.selectedGroups = []
    }

    const template = new TaskSheetTemplate()
    template.Name = this.formGroup.get('templateNameControl').value
    template.GroupsId = []

    if (this.selectedGroups.length > 0) {
      this.selectedGroups.forEach((groupName) => {
        const found = this.data.groups.find(
          (g) => g.GroupName === groupName
        )

        if (found) {
          template.GroupsId.push(found.GroupId)
        }
      })
    }

    this.populateSheet(template)

    this.taskSheetService
      .editTemplate(template)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.getTemplates()
          this.toastr.success(
            this.translatePipe.transform(
              'text.course.list.dialog.template.save.success',
              'Шаблон успешно сохранен'
            )
          )
        },
        error: () => {
          this.toastr.error(
            this.translatePipe.transform(
              'text.course.list.dialog.template.save.error',
              'Ошибка при сохранении шаблона'
            )
          )
        },
      })
  }

  deleteTemplate() {
  this.taskSheetService
    .deleteTemplate({
      taskSheetId: this.templateId,
      userId: this.data.userId,
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.getTemplates();

        this.toastr.success(
          this.translatePipe.transform(
            'text.course.list.dialog.template.delete.success',
            'Шаблон успешно удалён'
          )
        );
      },
      error: () => {
        this.toastr.error(
          this.translatePipe.transform(
            'text.course.list.dialog.template.delete.error',
            'Ошибка при удалении шаблона'
          )
        );
      }
    });
}


  applyTemplate() {
    const normalize = (v: string) => (v || '').trim().toLowerCase();

    const normalizedSelected = this.selectedGroups.map(g => normalize(g));

    this.projects.forEach(project => {
      if (!project.Group) return;

      const projectGroupNormalized = normalize(project.Group);

      if (!normalizedSelected.includes(projectGroupNormalized)) return;

      let taskSheet = this.taskSheets.find(
        t => t.CourseProjectId === project.Id
      );

      if (!taskSheet) {
        taskSheet = createEmptyTaskSheet(project.Id);
      }

      this.populateSheet(taskSheet);

      this.taskSheetService
        .editTaskSheet(taskSheet)
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
        });
    });

    this.toastr.success(
      this.translatePipe.transform(
        'text.course.list.dialog.template.apply.success',
        'Шаблон успешно применен'
      )
    );
  }

  getResultForm(): TaskSheet {
    this.populateSheet(this.data.taskSheet)
    return this.data.taskSheet
  }

  populateSheet(taskSheet: TaskSheet): void {
    taskSheet.InputData = this.formGroup.get('inputDataControl').value
    taskSheet.RpzContent = this.formGroup.get('contentControl').value
    taskSheet.DrawMaterials = this.formGroup.get('drawContentControl').value
    taskSheet.Univer = this.formGroup.get('univerControl').value
    taskSheet.CathedraName = this.formGroup.get('departmentControl').value
    taskSheet.Faculty = this.formGroup.get('facultyControl').value
    taskSheet.HeadCathedra = this.formGroup.get('headCathedraControl').value
    taskSheet.DateStart = this.getDate(
      this.formGroup.get('startDateControl').value
    )
    taskSheet.DateEnd = this.getDate(this.formGroup.get('endDateControl').value)
  }

  getDate(date: string): string {
    const startDate: Date = new Date(date)
    return new Date(
      startDate.setMinutes(
        startDate.getMinutes() - startDate.getTimezoneOffset()
      )
    ).toISOString()
  }

  retrieveProjects() {
    this.projectsService
      .getProjects(
        'count=' +
          this.COUNT +
          '&page=' +
          this.PAGE +
          '&filter={"subjectId":"' +
          this.data.subjectId +
          '","searchString":"' +
          '' +
          '"}' +
          '&filter[subjectId]=' +
          this.data.subjectId +
          '&sorting[' +
          'Id' +
          ']=' +
          'desc'
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
          '&filter={"subjectId":"' +
          this.data.subjectId +
          '","searchString":"' +
          '' +
          '"}' +
          '&filter[subjectId]=' +
          this.data.subjectId +
          '&sorting[' +
          'Id' +
          ']=' +
          'desc'
      )
      .subscribe((res) => (this.taskSheets = res))
  }

  get isFormInvalid(): boolean {
    return (
      this.formGroup.controls.inputDataControl.invalid ||
      this.formGroup.controls.contentControl.invalid ||
      this.formGroup.controls.drawContentControl.invalid ||
      this.formGroup.controls.univerControl.invalid ||
      this.formGroup.controls.facultyControl.invalid ||
      this.formGroup.controls.headCathedraControl.invalid ||
      this.formGroup.controls.startDateControl.invalid ||
      this.formGroup.controls.endDateControl.invalid ||
      this.formGroup.controls.departmentControl.invalid
    )
  }
}
