import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormControl, Validators } from '@angular/forms'
import { TranslatePipe } from 'educats-translate'
import { Consultation } from 'src/app/models/consultation.model'
import { VisitStatsService } from 'src/app/services/visit-stats.service'
import { ToastrService } from 'ngx-toastr'

interface DialogData {
  consultations: Consultation[]
  building: string
  audience: string
  start: any
  end: any
  date: any
}

@Component({
  selector: 'app-add-date-dialog',
  templateUrl: './add-date-dialog.component.html',
  styleUrls: ['./add-date-dialog.component.less'],
})
export class AddDateDialogComponent {
  public audienceControl: FormControl = new FormControl(this.data.audience, [
    Validators.minLength(1),
    Validators.maxLength(3),
    Validators.required,
    this.noWhitespaceValidator,
  ])

  public buildingControl: FormControl = new FormControl(this.data.building, [
    Validators.minLength(1),
    Validators.maxLength(3),
    Validators.required,
    this.noWhitespaceValidator,
  ])

  public startTimeControl: FormControl = new FormControl(this.data.start, [
    Validators.required,
    this.noWhitespaceValidator,
  ])

  public endTimeControl: FormControl = new FormControl(this.data.end, [
    Validators.required,
    this.noWhitespaceValidator,
  ])

  public dateControl = new FormControl(
    this.data.date != null ? new Date(this.data.date) : new Date()
  )

  isEditing = false
  showEditPopover = false
  selectedDayId: string | null = null

  constructor(
    public dialogRef: MatDialogRef<AddDateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private visitStatsService: VisitStatsService,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe
  ) {
    this.data.date = this.dateControl.value
    this.initControls()
  }

  initControls(): void {
    const data = this.data.consultations[0]
    if (data) {
      this.data.audience = data.Audience
      this.data.building = data.Building
      this.data.end = data.EndTime
      this.data.start = data.StartTime
    }
  }

  onDateChange(date: any) {
    this.data.date = date
  }

  onCancelClick(): void {
    const date = new Date(this.data.date)
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset())
    const consultation: any = {
      start: this.data.start,
      end: this.data.end,
      building: this.data.building,
      audience: this.data.audience,
      isClose: true,
    }
    this.dialogRef.close(consultation)
  }

  onAddClick(): void {
    if (this.data != null) {
      const date = new Date(this.data.date)
      date.setMinutes(date.getMinutes() - date.getTimezoneOffset())

      const lastConsultation = this.data.consultations.length
        ? this.data.consultations[this.data.consultations.length - 1]
        : null

      const consultation: Consultation = {
        Id: lastConsultation
          ? String(Number(lastConsultation.Id) + 1)
          : '1',
        LecturerId: lastConsultation
          ? String(lastConsultation.LecturerId)
          : this.getCurrentLecturerIdAsString(),
        Day: date.toISOString(),
        StartTime: String(this.data.start),
        EndTime: String(this.data.end),
        Building: String(this.data.building),
        Audience: String(this.data.audience),
      }

      this.data.consultations.push(consultation)
      this.data.consultations = this.data.consultations.sort((a, b) =>
        a.Day > b.Day ? 1 : b.Day > a.Day ? -1 : 0
      )

      this.visitStatsService
        .addDate(
          date.toISOString(),
          String(this.data.start),
          String(this.data.end),
          String(this.data.audience),
          String(this.data.building)
        )
        .subscribe(() => {
          this.addFlashMessage(
            this.translatePipe.transform(
              'text.course.visit.dialog.add.save.success',
              'Дата консультации успешно добавлена'
            )
          )
        })
    }
  }

  private getCurrentLecturerIdAsString(): string {
    if (this.data.consultations && this.data.consultations.length > 0) {
      return String(this.data.consultations[0].LecturerId)
    } else {
      return '0'
    }
  }

  addFlashMessage(msg: string) {
    this.toastr.success(msg)
  }

  deleteDate(id: string): void {
    const index: number = this.data.consultations
      .map((item) => +item.Id)
      .indexOf(+id)
    this.data.consultations.splice(index, 1)
    this.visitStatsService.deleteDate(id).subscribe(() => {})
  }

  editPopover(day: Consultation): void {
    this.selectedDayId = day.Id
    this.isEditing = true
    this.showEditPopover = true
  }

  closeEditPopover(event: any): void {
    this.isEditing = false
    this.showEditPopover = false
    this.selectedDayId = null
  }

  onDataUpdated(updatedDay: Consultation): void {
    const index = this.data.consultations.findIndex(
      c => String(c.Id) === String(updatedDay.Id)
    )
    if (index !== -1) {
      Object.assign(this.data.consultations[index], updatedDay)
    }
    this.data.consultations.sort(
      (a, b) => new Date(a.Day).getTime() - new Date(b.Day).getTime()
    )
    this.isEditing = false
    this.showEditPopover = false
    this.selectedDayId = null
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.')
    return new Date(+year, +month - 1, +day)
  }

  public noWhitespaceValidator(control: FormControl) {
    const isWhitespace = (control.value || '').trim().length === 0
    const isValid = !isWhitespace
    return isValid ? null : { whitespace: true }
  }
}
