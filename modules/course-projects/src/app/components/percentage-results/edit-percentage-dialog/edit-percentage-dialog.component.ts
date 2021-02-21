import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

interface DialogData {
  mark: number;
  min: number;
  max: number;
  regex: string;
  errorMsg: string;
  label: string;
  symbol: string;
  notEmpty: boolean;
  comment: string;
  lecturer: string;
  date: string;
  total: boolean;
  showForStudent: boolean;
  expected: number;
}

@Component({
  selector: 'app-edit-percentage-dialog',
  templateUrl: './edit-percentage-dialog.component.html',
  styleUrls: ['./edit-percentage-dialog.component.less']
})
export class EditPercentageDialogComponent {

  private percentageControl: FormControl = new FormControl(this.data.mark);
  private commentControl: FormControl = new FormControl(this.data.comment, [Validators.maxLength(255)]);
  private date = new FormControl(this.data.date != null ? new Date(this.data.date) : new Date());

  constructor(public dialogRef: MatDialogRef<EditPercentageDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    const validators = [];
    if (this.data.min != null) { validators.push(Validators.min(this.data.min)); }
    if (this.data.max != null) { validators.push(Validators.max(this.data.max)); }
    if (this.data.regex != null) { validators.push(Validators.pattern(this.data.regex)); }
    if (this.data.notEmpty) { validators.push(Validators.required); }
    this.percentageControl.setValidators(validators);
    this.data.date = this.date.value;
  }

  onDateChange() {
    this.data.date = this.date.value;
  }

  showForStudentChange(showForStudent: boolean) {
    this.data.showForStudent = showForStudent
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  isFormInvalid(): boolean {
    return this.percentageControl.invalid || this.commentControl.invalid || (this.data.total && this.date.invalid);
  }

}
