import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';
import { TranslatePipe } from 'educats-translate';
import { Consultation } from 'src/app/models/consultation.model';
import { VisitStatsService } from 'src/app/services/visit-stats.service';
import { ToastrService } from 'ngx-toastr';

interface DialogData {
  consultations: Consultation[];
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

  public audienceControl: FormControl = new FormControl(this.data.audience,
    [Validators.minLength(1), Validators.maxLength(3), Validators.required, this.noWhitespaceValidator]);

  public buildingControl: FormControl = new FormControl(this.data.building,
    [Validators.minLength(1), Validators.maxLength(3), Validators.required, this.noWhitespaceValidator]);

  public startTimeControl: FormControl = new FormControl(this.data.start, [Validators.required, this.noWhitespaceValidator]);

  public endTimeControl: FormControl = new FormControl(this.data.end, [Validators.required, this.noWhitespaceValidator]);

  public dateControl = new FormControl(this.data.date != null ? new Date(this.data.date) : new Date());

  constructor(public dialogRef: MatDialogRef<AddDateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private visitStatsService: VisitStatsService,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe) {
    this.data.date = this.dateControl.value;
    this.initControls();
  }

  initControls(): void {
    const data = this.data.consultations[0];
    if (data) {
      this.data.audience = data.Audience;
      this.data.building = data.Building;
      this.data.end = data.EndTime;
      this.data.start = data.StartTime;
    }
  }

  onDateChange(date: any) {
    this.data.date = date;
  }

  onCancelClick(): void {
    const date = new Date(this.data.date);
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    const consultation: any = {
      start: this.data.start,
      end: this.data.end,
      building: this.data.building,
      audience: this.data.audience,
      isClose: true
    }
    this.dialogRef.close(consultation);
  }

  onAddClick(): void {
    if (this.data != null) {
      const date = new Date(this.data.date);
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
      const consultation: Consultation = {
        Id: this.data.consultations[this.data.consultations.length - 1].Id + 1,
        LecturerId: this.data.consultations[this.data.consultations.length - 1].LecturerId,
        Day: date.toISOString(),
        StartTime: this.data.start,
        EndTime: this.data.end,
        Building: this.data.building,
        Audience: this.data.audience,
      }
      this.data.consultations.push(consultation);
      this.data.consultations = this.data.consultations.sort((a, b) => (a.Day > b.Day) ? 1 : ((b.Day > a.Day) ? -1 : 0));
      this.visitStatsService.addDate(date.toISOString(), this.data.start,
        this.data.end, this.data.audience, this.data.building).subscribe(() => {
          this.addFlashMessage(this.translatePipe.transform('text.course.visit.dialog.add.save.success', 'Дата консультации успешно добавлена'));
        });
    }
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg);
  }

  deleteDate(id: string): void {
    const index: number = this.data.consultations.map(item => +item.Id).indexOf(+id);
    this.data.consultations.splice(index, 1);
    this.visitStatsService.deleteDate(id).subscribe(() => { });
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0;
    const isValid = !isWhitespace;
    return isValid ? null : { 'whitespace': true };
  }
}
