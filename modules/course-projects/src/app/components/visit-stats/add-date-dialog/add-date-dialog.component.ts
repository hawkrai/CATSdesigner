import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';
import { Time } from '@angular/common';

interface DialogData {
  building: string;
  audience: string;
  start: any;
  end: any;
  date: any;
}

@Component({
  selector: 'app-add-date-dialog',
  templateUrl: './add-date-dialog.component.html',
  styleUrls: ['./add-date-dialog.component.less']
})
export class AddDateDialogComponent {

  private audienceControl: FormControl = new FormControl(this.data.audience,
    [Validators.minLength(1), Validators.maxLength(3), Validators.required, this.noWhitespaceValidator]);

  private buildingControl: FormControl = new FormControl(this.data.building,
    [Validators.minLength(1), Validators.maxLength(3), Validators.required, this.noWhitespaceValidator]);
  
  private startTimeControl: FormControl = new FormControl(this.data.start, [Validators.required, this.noWhitespaceValidator]);

  private endTimeControl: FormControl = new FormControl(this.data.end, [Validators.required, this.noWhitespaceValidator]);

  private dateControl = new FormControl(this.data.date != null ? new Date(this.data.date) : new Date());

  constructor(public dialogRef: MatDialogRef<AddDateDialogComponent>,
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
