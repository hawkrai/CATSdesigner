import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Lector } from '../../../../../../subjects/src/app/models/lector.model'
import { VisitStatsService } from '../../../services/visit-stats.service'
import { ToastrService } from 'ngx-toastr'
import { UpdatedDay } from '../../../models/updated-day.model'
import { TranslatePipe } from 'educats-translate'

@Component({
  selector: 'app-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.less'],
})
export class EditPopoverComponent implements OnInit {
  dateForm: FormGroup

  @Output() close = new EventEmitter<void>()
  @Output() dataUpdated = new EventEmitter<UpdatedDay>()

  @Input() day!: UpdatedDay
  @Input() lectors!: Lector[]

  constructor(
    private fb: FormBuilder,
    private CourseRestService: VisitStatsService,
    private toastr: ToastrService,
    private translatePipe: TranslatePipe,
  ) {}

  ngOnInit() {
    this.initForm()
    this.setFormData()
  }

  initForm() {
    this.dateForm = this.fb.group({
      id: ['', Validators.required],
      date: ['', Validators.required],
      lecturerId: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      building: [
        '',
        [Validators.required, Validators.minLength(1), Validators.maxLength(5)],
      ],
      audience: [''],
    })
  }

  setFormData() {
    if (this.day) {
      const formattedDate = this.parseDate(this.day.Day)

      this.dateForm.patchValue({
        id: this.day.Id,
        date: formattedDate,
        lecturerId: this.day.Teacher.LectorId,
        startTime: this.day.StartTime,
        endTime: this.day.EndTime,
        building: this.day.Building,
        audience: this.day.Audience,
      })
    }
  }

  fixTimezone(date: Date): Date {
    const corrected = new Date(date)
    corrected.setMinutes(corrected.getMinutes() - corrected.getTimezoneOffset())
    return corrected
  }

  onSubmit() {
    if (this.dateForm.invalid) {
      this.dateForm.markAllAsTouched()
      return
    }

    const formValue = this.dateForm.value

    const id = this.day.Id
    const date = this.fixTimezone(formValue.date) 

    const lecturerId = formValue.lecturerId
    const start = formValue.startTime
    const end = formValue.endTime
    const audience = formValue.audience
    const building = formValue.building

    const isoLocalDate = date.toISOString().split('T')[0] + 'T00:00:00'

    this.CourseRestService.addDate(
      id,
      isoLocalDate,
      String(this.day.Subject.Id),
      String(this.day.GroupId),
      start,
      end,
      audience,
      building,
      lecturerId
    ).subscribe(
      () => {
        this.toastr.success(
          this.translatePipe.transform(
        'text.course.list.dialog.consultations.apply.edit',
        'Данные успешно обновлены'
      ))

        const selectedLector = this.lectors.find(
          (l) => l.LectorId === lecturerId
        )

        const updatedDay: UpdatedDay = {
          ...this.day,
          StartTime: start,
          EndTime: end,
          Building: building,
          Audience: audience,
          Day: this.formatDate(date),
          Teacher: selectedLector
            ? {
                LectorId: selectedLector.LectorId,
                FullName: selectedLector.FullName,
                UserName: selectedLector.UserName,
              }
            : this.day.Teacher,
        }

        this.dataUpdated.emit(updatedDay)
        this.close.emit()
      },
      (error) => {
        this.toastr.error('Ошибка при обновлении данных')
      }
    )
  }

  onClose() {
    this.close.emit()
  }

  resetForm() {
    this.dateForm.reset()
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.')
    return new Date(+year, +month - 1, +day)
  }

  formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}.${month}.${year}`
  }
}
