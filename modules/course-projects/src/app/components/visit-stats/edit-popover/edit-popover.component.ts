import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Lector } from '../../../../../../subjects/src/app/models/lector.model'
import { VisitStatsService } from '../../../services/visit-stats.service'
import { ToastrService } from 'ngx-toastr'

@Component({
  selector: 'app-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.less'],
})
export class EditPopoverComponent implements OnInit {
  dateForm: FormGroup

  @Output() close = new EventEmitter()
  @Output() dataUpdated = new EventEmitter<any>()
  @Input() day: any
  @Input() lectors: Lector[]

  constructor(
    private fb: FormBuilder,
    private CourseRestService: VisitStatsService,
    private toastr: ToastrService
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

  onSubmit() {
    if (this.dateForm.invalid) {
      this.dateForm.markAllAsTouched()
      return
    }

    const id = this.day.Id
    const date: Date = this.dateForm.value.date
    const lecturerId = this.dateForm.value.lecturerId
    const start = this.dateForm.value.startTime
    const end = this.dateForm.value.endTime
    const audience = this.dateForm.value.audience
    const building = this.dateForm.value.building

    const isoLocalDate =
      `${date.getFullYear()}-` +
      `${(date.getMonth() + 1).toString().padStart(2, '0')}-` +
      `${date.getDate().toString().padStart(2, '0')}T00:00:00`

    this.CourseRestService.addDate(
      id,
      isoLocalDate,
      this.day.Subject.Id,
      this.day.GroupId,
      start,
      end,
      audience,
      building,
      lecturerId
    ).subscribe(
      (response) => {
        this.toastr.success('Данные успешно обновлены')

        const selectedLector = this.lectors.find(
          (l) => l.LectorId === lecturerId
        )

        const updatedDay = {
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
        console.error('Ошибка при обновлении данных', error)
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
