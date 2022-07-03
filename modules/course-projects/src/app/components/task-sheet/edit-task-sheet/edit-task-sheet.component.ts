import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectChange, MatSnackBar} from '@angular/material';
import {TaskSheet} from '../../../models/task-sheet.model';
import {FormControl, Validators} from '@angular/forms';
import {Template} from '../../../models/template.model';
import {TaskSheetService} from '../../../services/task-sheet.service';
import {TaskSheetTemplate} from '../../../models/task-sheet-template.model';
import { Project } from 'src/app/models/project.model';
import { ProjectsService } from 'src/app/services/projects.service';
import { CoreGroup } from 'src/app/models/core-group.model';
import {Help} from '../../../models/help.model';
import {HelpPopoverScheduleComponent} from '../../../shared/help-popover/help-popover-schedule.component';
import {MatDialog} from '@angular/material/dialog';

interface DialogData {
  subjectId: string;
  taskSheet: TaskSheet;
  groups: CoreGroup[];
  taskSheetTemplate: Template;
}

@Component({
  selector: 'app-edit-task-sheet',
  templateUrl: './edit-task-sheet.component.html',
  styleUrls: ['./edit-task-sheet.component.less']
})
export class EditTaskSheetComponent implements OnInit {

  helpMessage: Help = {
    message: 'Выберите готовый шаблон, чтобы применить его к листу задания. Шаблон можно изменить и применить к указанным группам',
    action: 'Понятно'
  };

  private COUNT = 1000000;
  private PAGE = 1;

  private templateNameControl: FormControl = new FormControl(null,
    [Validators.maxLength(30), Validators.required]);

  private inputDataControl: FormControl = new FormControl(this.data.taskSheet.InputData,
    [Validators.maxLength(999)]);

  private contentControl: FormControl = new FormControl(this.data.taskSheet.RpzContent,
    [Validators.maxLength(999)]);

  private drawContentControl: FormControl = new FormControl(this.data.taskSheet.DrawMaterials,
    [Validators.maxLength(999)]);

  private univerControl: FormControl = new FormControl(this.data.taskSheet.Univer,
    [Validators.maxLength(255)]);

  private facultyControl: FormControl = new FormControl(this.data.taskSheet.Faculty,
    [Validators.maxLength(255)]);

  private departmentControl: FormControl = new FormControl(this.data.taskSheet.Faculty,
    [Validators.maxLength(255)]);

  private headCathedraControl: FormControl = new FormControl(this.data.taskSheet.HeadCathedra,
    [Validators.maxLength(255)]);

  private startDateControl = new FormControl(this.data.taskSheet.DateStart != null ? new Date(this.data.taskSheet.DateStart) : new Date());

  private endDateControl = new FormControl(this.data.taskSheet.DateEnd);

  private templates: Template[];
  private selectedGroups: any[];
  private projects: Project[];
  private taskSheets: TaskSheet[];
  private selectedTemplate = 'data.taskSheetTemplate';

  constructor(private taskSheetService: TaskSheetService,
              private snackBar: MatSnackBar,
              public dialogRef: MatDialogRef<EditTaskSheetComponent>,
              private projectsService: ProjectsService,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.taskSheetService.getTemplateList({entity: 'CourseProjectTaskSheetTemplate', subjectId: this.data.subjectId})
      .subscribe(res => this.templates = res);
    this.retrieveProjects();
    this.retrieveTaskSheets();
  }

  showHelp(): void {
    const dialogRef = this.dialog.open(HelpPopoverScheduleComponent,
      {data: {message: this.helpMessage.message,
          action: this.helpMessage.action},
        disableClose: true,
        hasBackdrop: true,
        backdropClass: 'backdrop-help',
        panelClass: 'help-popover'
      });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onTemplateChange(event: MatSelectChange) {
    this.taskSheetService.getTemplate({templateId: event.value.Id}).subscribe(res => {
      this.templateNameControl.setValue(event.value.Name);
      this.inputDataControl.setValue(res.InputData);
      this.contentControl.setValue(res.RpzContent);
      this.drawContentControl.setValue(res.DrawMaterials);
      this.univerControl.setValue(res.Univer);
      this.facultyControl.setValue(res.Faculty);
      this.headCathedraControl.setValue(res.HeadCathedra);
      this.startDateControl.setValue(res.DateStart);
      this.endDateControl.setValue(res.DateEnd);
    });
  }

  isFormInvalid(): boolean {
    return this.inputDataControl.invalid || this.contentControl.invalid || this.drawContentControl.invalid || this.univerControl.invalid ||
      this.facultyControl.invalid || this.headCathedraControl.invalid || this.startDateControl.invalid || this.endDateControl.invalid || this.departmentControl.invalid;
  }

  isSelectedGroupsInvalid(): boolean {
    if (this.selectedGroups === undefined) {
      return true;
    }
    return this.selectedGroups.length < 1;
  }

  saveTemplate() {
    const template = new TaskSheetTemplate();
    template.Name = this.templateNameControl.value;
    this.populateSheet(template);
    this.taskSheetService.editTemplate(template).subscribe(() => {
      this.ngOnInit();
      this.snackBar.open('Шаблон успешно сохранен', null, {
        duration: 2000
      });
    });
  }

  applyTemplate() {
    this.projects.forEach(element => {
      if (element.Group != null) {
        if (this.selectedGroups.includes(element.Group)) {
          const taskSheet = this.taskSheets.find(i => i.CourseProjectId === element.Id);
          this.populateSheet(taskSheet);
          this.taskSheetService.editTaskSheet(taskSheet).subscribe();
        }
      }

      this.snackBar.open('Шаблон успешно применен', null, {
        duration: 2000
      });
    });
  }

  getResultForm(): TaskSheet {
    this.populateSheet(this.data.taskSheet);
    return this.data.taskSheet;
  }

  populateSheet(taskSheet: TaskSheet): void {
    taskSheet.InputData = this.inputDataControl.value;
    taskSheet.RpzContent = this.contentControl.value;
    taskSheet.DrawMaterials = this.drawContentControl.value;
    taskSheet.Univer = this.univerControl.value;
    taskSheet.Faculty = this.facultyControl.value;
    taskSheet.HeadCathedra = this.headCathedraControl.value;
    taskSheet.DateStart = this.startDateControl.value;
    taskSheet.DateEnd = this.endDateControl.value;
  }

  retrieveProjects() {
    this.projectsService.getProjects(
      'count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter={"subjectId":"' + this.data.subjectId + '","searchString":"' + '' + '"}' +
      '&filter[subjectId]=' + this.data.subjectId +
      '&sorting[' + 'Id' + ']=' + 'desc'
    )
      .subscribe(res => this.projects = res.Items);
  }

  retrieveTaskSheets() {
    this.taskSheetService.getTaskSheets(
      'count=' + this.COUNT +
      '&page=' + this.PAGE +
      '&filter={"subjectId":"' + this.data.subjectId + '","searchString":"' + '' + '"}' +
      '&filter[subjectId]=' + this.data.subjectId +
      '&sorting[' + 'Id' + ']=' + 'desc'
    )
      .subscribe(res => this.taskSheets = res);
  }

}
