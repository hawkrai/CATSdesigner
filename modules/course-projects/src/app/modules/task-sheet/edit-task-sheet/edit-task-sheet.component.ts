import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectChange} from '@angular/material';
import {TaskSheet} from '../../../models/task-sheet.model';
import {FormControl, Validators} from '@angular/forms';
import {Template} from '../../../models/template.model';
import {TaskSheetService} from '../../../services/task-sheet.service';

interface DialogData {
  subjectId: string;
  taskSheet: TaskSheet;
}

@Component({
  selector: 'app-edit-task-sheet',
  templateUrl: './edit-task-sheet.component.html',
  styleUrls: ['./edit-task-sheet.component.less']
})
export class EditTaskSheetComponent implements OnInit {

  private templateNameControl: FormControl = new FormControl(null,
    [Validators.maxLength(30)]);

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

  private headCathedraControl: FormControl = new FormControl(this.data.taskSheet.HeadCathedra,
    [Validators.maxLength(255)]);

  private startDateControl = new FormControl(this.data.taskSheet.DateStart != null ? new Date(this.data.taskSheet.DateStart) : new Date());

  private endDateControl = new FormControl(this.data.taskSheet.DateEnd);

  private templates: Template[];

  constructor(private taskSheetService: TaskSheetService,
              public dialogRef: MatDialogRef<EditTaskSheetComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.taskSheetService.getTemplateList({entity: 'CourseProjectTaskSheetTemplate', subjectId: this.data.subjectId})
      .subscribe(res => this.templates = res);
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

}
