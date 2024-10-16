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
        id: this.day.id,
        date: formattedDate,
        lecturerId: this.day.Teacher.LectorId,
        startTime: this.day.StartTime,
        endTime: this.day.EndTime,
        building: this.day.Building,
        audience: this.day.Audience,
      })
    }
  }

  get formControls() {
    return this.dateForm.controls
  }

  onSubmit() {
    const id = this.day.id
    const date = this.dateForm.value.date
    const lecturerId = this.dateForm.value.lecturerId
    const start = this.dateForm.value.startTime
    const end = this.dateForm.value.endTime
    const audience = this.dateForm.value.audience
    const building = this.dateForm.value.building

    this.CourseRestService.addDate(
      id,
      date.toISOString(),
      this.day.Subject.Id,
      this.day.GroupId,
      start,
      end,
      audience,
      building,
      lecturerId
    ).subscribe(
      (response) => {
        console.log('Данные успешно обновлены', response)
        this.addFlashMessage('Данные успешно обновлены')
        this.day.LecturerId = lecturerId
        this.day.StartTime = start
        this.day.EndTime = end
        this.day.Building = building
        this.day.Audience = audience
        this.day.Day = date.toISOString()
        this.day.Lector = this.lectors.find(
          (lector) => lector.LectorId === lecturerId
        )

        this.close.emit()
      },
      (error) => {
        console.error('Произошла ошибка при обновлении данных', error)
      }
    )
  }
  addFlashMessage(msg: string) {
    this.toastr.success(msg)
  }
  onClose() {
    this.close.emit()
  }

  resetForm() {
    this.dateForm.reset()
  }

  parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('.')

    const dayNum = parseInt(day, 10)
    const monthNum = parseInt(month, 10) - 1
    const yearNum = parseInt(year, 10)

    return new Date(yearNum, monthNum, dayNum)
  }
}
