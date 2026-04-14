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

  onSave(): void {
  if (this.isFormInvalid) return;

  const date = new Date(this.dateControl.value);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());

  this.visitStatsService
    .addDate(
      date.toISOString(),
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
        );

        const updated: Consultation = {
          ...this.day,
          Day: date.toISOString(),
          StartTime: this.startTimeControl.value,
          EndTime: this.endTimeControl.value,
          Building: this.buildingControl.value,
          Audience: this.audienceControl.value,
        };

        this.dataUpdated.emit(updated);
      },
      (err) => {
        this.toastr.error(
          this.translatePipe.transform(
            'text.diplomProject.editDate.error',
            'Ошибка при обновлении даты'
          )
        );
      }
    );
}

  onClose(): void {
    this.close.emit(false)
  }

  parseDate(dateString: string): Date {
    if (dateString.includes('.')) {
      const [day, month, year] = dateString.split('.')
      return new Date(+year, +month - 1, +day)
    }
    return new Date(dateString)
  }
}
