import { Component, Inject } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material'
import { FormControl, Validators } from '@angular/forms'
import { TranslatePipe } from 'educats-translate'
import { Consultation } from 'src/app/models/consultation.model'
import { VisitStatsService } from 'src/app/services/visit-stats.service'
import { ToastrService } from 'ngx-toastr'
import { TimePickerComponent } from '../../time-picker/time-picker.component'

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
  this.initControls()

  this.audienceControl.setValue(this.data.audience)
  this.buildingControl.setValue(this.data.building)
  this.startTimeControl.setValue(this.data.start)
  this.endTimeControl.setValue(this.data.end)

  this.dateControl.setValue(
    this.data.date ? new Date(this.data.date) : new Date()
  )

  this.data.date = this.dateControl.value

  this.audienceControl.updateValueAndValidity()
  this.buildingControl.updateValueAndValidity()
  this.startTimeControl.updateValueAndValidity()
  this.endTimeControl.updateValueAndValidity()
  this.dateControl.updateValueAndValidity()
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

    const toMinutes = (time: string): number => {
      const parts = time.slice(0, 5).split(':')
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
    }

    const isDuplicate = this.data.consultations.some(c => {
      const sameDay = new Date(c.Day).toDateString() === date.toDateString()
      if (!sameDay) return false

      const newStart = toMinutes(String(this.data.start))
      const newEnd = toMinutes(String(this.data.end))
      const existStart = toMinutes(c.StartTime)
      const existEnd = toMinutes(c.EndTime)

      const newEndAdj = newEnd <= newStart ? newEnd + 1440 : newEnd
      const existEndAdj = existEnd <= existStart ? existEnd + 1440 : existEnd

      const isOverlap = newStart < existEndAdj && newEndAdj > existStart

      const samePlace =
        c.Building === String(this.data.building) &&
        c.Audience === String(this.data.audience)

      return isOverlap && samePlace
    })

    if (isDuplicate) {
      this.toastr.warning(
        this.translatePipe.transform(
          'text.consultation.duplicate',
          'В этой аудитории уже есть консультация в указанное время'
        )
      )
      return
    }

    this.visitStatsService
      .addDate(
        date.toISOString(),
        String(this.data.start),
        String(this.data.end),
        String(this.data.audience),
        String(this.data.building)
      )
      .subscribe(() => {
        this.visitStatsService.getVisitStats({
          count: 1000,
          page: 1,
          filter: '{"isSecretary":"false","searchString":""}',
        }).subscribe((res: any) => {
          if (res && res.DiplomProjectConsultationDates) {
            this.data.consultations = res.DiplomProjectConsultationDates.sort(
              (a, b) => a.Day > b.Day ? 1 : b.Day > a.Day ? -1 : 0
            )
          }
        })

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
