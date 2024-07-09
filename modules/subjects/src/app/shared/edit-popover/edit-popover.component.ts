import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { Lector } from '../../models/lector.model'
import { LabsRestService } from '../../services/labs/labs-rest.service'
import { PracticalRestService } from '../../services/practical/practical-rest.service'
import { LecturesRestService } from '../../services/lectures/lectures-rest.service'

@Component({
  selector: 'app-edit-popover',
  templateUrl: 'edit-popover.component.html',
  styleUrls: ['edit-popover.component.less'],
})
export class EditPopoverComponent implements OnInit {
  dateForm: FormGroup
  @Output() close = new EventEmitter()
  @Input() day: any
  @Input() lectors: Lector[]

  constructor(
    private fb: FormBuilder,
    private labsRestService: LabsRestService,

    private lecturesRestService: LecturesRestService,
    private practicalRestService: PracticalRestService
  ) {}

  ngOnInit() {
    this.initForm()
    this.setFormData()
  }

  initForm() {
    this.dateForm = this.fb.group({
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
      const dateParts = this.day.Date.split('.')
      const formattedDate = new Date(
        +dateParts[2],
        +dateParts[1] - 1,
        +dateParts[0]
      )

      this.dateForm.patchValue({
        date: formattedDate,
        lecturerId: this.day.Lector ? this.day.Lector.LectorId : null,
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
    if (this.dateForm.valid) {
      const date = this.dateForm.get('date').value
      const parsedDate = new Date(date)
      const day = parsedDate.getDate().toString().padStart(2, '0')
      const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0')
      const year = parsedDate.getFullYear().toString()
      const formattedDate = `${day}/${month}/${year}`

      const formData = {
        ...this.dateForm.value,
        date: formattedDate,
        buildingNumber: this.day.Building,
        subjectId: this.day.SubjectId,
        groupId: this.day.GroupId,
        id:
          this.day.ScheduleProtectionLabId ||
          this.day.ScheduleProtectionPracticalId ||
          this.day.Id,
        lecturerId: this.dateForm.get('lecturerId').value,
        subGroupId: this.day.SubGroupId,
      }

      if (this.day.ScheduleProtectionLabId) {
        this.labsRestService.updateLabs(formData).subscribe(
          (response) => {
            console.log(
              'Данные успешно обновлены (Лабораторная работа)',
              response
            )
            this.day.Lector = this.lectors.find(
              (lector) => lector.LectorId === formData.lecturerId
            )
            this.day.StartTime = formData.startTime
            this.day.EndTime = formData.endTime
            this.day.Building = formData.building
            this.day.Audience = formData.audience

            this.close.emit()
          },
          (error) => {
            console.error(
              'Произошла ошибка при обновлении данных (Лабораторная работа)',
              error
            )
          }
        )
      } else if (this.day.ScheduleProtectionPracticalId) {
        this.practicalRestService.updatePractical(formData).subscribe(
          (response) => {
            console.log(
              'Данные успешно обновлены (Практическая работа)',
              response
            )
            this.day.Lector = this.lectors.find(
              (lector) => lector.LectorId === formData.lecturerId
            )
            this.day.StartTime = formData.startTime
            this.day.EndTime = formData.endTime
            this.day.Building = formData.building
            this.day.Audience = formData.audience

            this.close.emit()
          },
          (error) => {
            console.error(
              'Произошла ошибка при обновлении данных (Практическая работа)',
              error
            )
          }
        )
      } else {
        this.lecturesRestService.updateLectures(formData).subscribe(
          (response) => {
            this.day.Lector = this.lectors.find(
              (lector) => lector.LectorId === formData.lecturerId
            )
            this.day.StartTime = formData.startTime
            this.day.EndTime = formData.endTime
            this.day.Building = formData.building
            this.day.Audience = formData.audience

            this.close.emit()
          },
          (error) => {
            console.error(
              'Произошла ошибка при обновлении данных (Практическая работа)',
              error
            )
          }
        )
      }
    } else {
      this.dateForm.markAllAsTouched()
    }
  }

  onClose() {
    this.close.emit()
  }

  resetForm() {
    this.dateForm.reset()
  }
}
