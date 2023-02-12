import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatSnackBar } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { Time } from '@angular/common';
import { VisitStatsService } from 'src/app/services/visit-stats.service';
import { Consultation } from 'src/app/models/consultation.model';
import { TranslatePipe } from 'educats-translate';

interface DialogData {
  consultations: Consultation[];
  subjectId: string;
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
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private visitStatsService: VisitStatsService,
    private snackBar: MatSnackBar,
    private translatePipe: TranslatePipe) {
    this.data.date = this.dateControl.value;
  }

  onDateChange(date: any) {
    this.data.date = date;
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  onAddClick(): void {
    if (this.data != null) {
      const date = new Date(this.data.date);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      const consultation: Consultation = {
        Id: this.data.consultations[this.data.consultations.length - 1].Id + 1,
        LecturerId: this.data.consultations[this.data.consultations.length - 1].LecturerId,
        Day: date.toISOString(),
        SubjectId: this.data.subjectId,
        StartTime: this.data.start,
        EndTime: this.data.end,
        Building: this.data.building,
        Audience: this.data.audience,
      }
      this.data.consultations.push(consultation);
      this.data.consultations = this.data.consultations.sort((a, b) => (a.Day > b.Day) ? 1 : ((b.Day > a.Day) ? -1 : 0));
      this.visitStatsService.addDate(date.toISOString(), this.data.subjectId, this.data.start,
        this.data.end, this.data.audience, this.data.building).subscribe(() => {
          this.addFlashMessage(this.translatePipe.transform('text.course.visit.dialog.add.save.success', 'Дата консультации успешно добавлена'));
        });
    }
  }

  addFlashMessage(msg: string) {
    this.snackBar.open(msg, null, {
      duration: 2000
    });
  }

  deleteDate(id: string): void {
    const index: number = this.data.consultations.map(item => +item.Id).indexOf(+id);
    this.data.consultations.splice(index, 1);
    console.log(id, index);
    this.visitStatsService.deleteDate(id).subscribe(() => { });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}
