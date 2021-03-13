import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

interface DialogData {
  title: string,
  name: string;
  percentage: number;
  date: any;
}

@Component({
  selector: 'app-add-stage-dialog',
  templateUrl: './add-stage-dialog.component.html',
  styleUrls: ['./add-stage-dialog.component.less']
})
export class AddStageDialogComponent {

  private nameControl: FormControl = new FormControl(this.data.name,
    [Validators.minLength(3), Validators.maxLength(100), Validators.required, this.noWhitespaceValidator]);

  private percentageControl: FormControl = new FormControl(this.data.percentage,
    [Validators.min(0), Validators.max(100), Validators.pattern('^\\d*$'), Validators.required]);

  private dateControl = new FormControl(this.data.date != null ? new Date(this.data.date) : new Date());

  constructor(public dialogRef: MatDialogRef<AddStageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.data.date = this.dateControl.value;
  }

  onDateChange(date: any) {
    this.data.date = date;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
  
}
