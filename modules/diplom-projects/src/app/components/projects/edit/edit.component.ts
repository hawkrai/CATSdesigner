import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { FormControl, Validators } from '@angular/forms'
import { Consultation } from 'src/app/models/consultation.model'
import { VisitStatsService } from 'src/app/services/visit-stats.service'
import { ToastrService } from 'ngx-toastr'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.less'],
})
export class EditComponent implements OnInit {
  @Input() day: Consultation
  @Input() consultations: Consultation[] = []
  @Output() close = new EventEmitter<boolean>()
  @Output() dataUpdated = new EventEmitter<Consultation>()

  public dateControl: FormControl
  public startTimeControl: FormControl
  public endTimeControl: FormControl
  public buildingControl: FormControl
  public audienceControl: FormControl

  constructor(
    private visitStatsService: VisitStatsService,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe
  ) {}

  ngOnInit(): void {
    this.dateControl = new FormControl(
      this.day.Day ? this.parseDate(this.day.Day) : new Date()
    )

    this.startTimeControl = new FormControl(
      this.day.StartTime ? this.day.StartTime.slice(0, 5) : '',
      [Validators.required]
    )

    this.endTimeControl = new FormControl(
      this.day.EndTime ? this.day.EndTime.slice(0, 5) : '',
      [Validators.required]
    )

    this.buildingControl = new FormControl(this.day.Building || '', [
      Validators.minLength(1),
      Validators.maxLength(3),
      Validators.required,
    ])

    this.audienceControl = new FormControl(this.day.Audience || '', [
      Validators.minLength(1),
      Validators.maxLength(3),
      Validators.required,
    ])
  }

  get isFormInvalid(): boolean {
    return (
      this.dateControl.invalid ||
      this.startTimeControl.invalid ||
      this.endTimeControl.invalid ||
      this.buildingControl.invalid ||
      this.audienceControl.invalid
    )
  }

  private toMinutes(time: string): number {
    const parts = time.slice(0, 5).split(':')
    return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10)
  }

  onSave(): void {
  if (this.isFormInvalid) return

  const localDate = new Date(this.dateControl.value)

  const serverDate = new Date(localDate)
  serverDate.setMinutes(serverDate.getMinutes() - serverDate.getTimezoneOffset())

  const newStart = this.toMinutes(this.startTimeControl.value)
  const newEnd = this.toMinutes(this.endTimeControl.value)
  const newEndAdj = newEnd <= newStart ? newEnd + 1440 : newEnd

  const isDuplicate = this.consultations.some(c => {
    if (String(c.Id) === String(this.day.Id)) return false

    const sameDay = new Date(c.Day).toDateString() === localDate.toDateString()
    if (!sameDay) return false

    const existStart = this.toMinutes(c.StartTime)
    const existEnd = this.toMinutes(c.EndTime)
    const existEndAdj = existEnd <= existStart ? existEnd + 1440 : existEnd

    const isOverlap = newStart < existEndAdj && newEndAdj > existStart

    const samePlace =
      c.Building === this.buildingControl.value &&
      c.Audience === this.audienceControl.value

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
      serverDate.toISOString(),
      this.startTimeControl.value,
      this.endTimeControl.value,
      this.audienceControl.value,
      this.buildingControl.value,
      this.day.Id
    )
    .subscribe(
      () => {
        this.toastr.success(
          this.translatePipe.transform(
            'text.diplomProject.editDate.success',
            'Дата консультации успешно обновлена'
          )
        )

        const updated: Consultation = {
          ...this.day,
          Day: serverDate.toISOString(),
          StartTime: this.startTimeControl.value,
          EndTime: this.endTimeControl.value,
          Building: this.buildingControl.value,
          Audience: this.audienceControl.value,
        }

        this.dataUpdated.emit(updated)
      },
      () => {
        this.toastr.error(
          this.translatePipe.transform(
            'text.diplomProject.editDate.error',
            'Ошибка при обновлении даты'
          )
        )
      }
    )
}

  onClose(): void {
    this.close.emit(false)
  }

  parseDate(dateString: string): Date {
  if (!dateString.includes('T') && dateString.includes('.')) {
    const [day, month, year] = dateString.split('.')
    return new Date(+year, +month - 1, +day)
  }
  const d = new Date(dateString)
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}
}
