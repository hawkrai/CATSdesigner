import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Lector } from "../../../../../../subjects/src/app/models/lector.model";
import { VisitStatsService } from "../../../services/visit-stats.service";

@Component({
  selector: 'app-edit',
  templateUrl: 'edit.component.html',
  styleUrls: ['edit.component.less']
})
export class EditPopoverComponent implements OnInit {
  dateForm: FormGroup;
  @Output() close = new EventEmitter();
  @Input() day: any;
  @Input() lectors: Lector[];

  constructor(private fb: FormBuilder, private CourseRestService: VisitStatsService) { }

  ngOnInit() {
    this.initForm();
    this.setFormData();
  }

  initForm() {
    this.dateForm = this.fb.group({
      id: ['', Validators.required], // Добавим поле для id
      date: ['', Validators.required],
      lecturerId: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      building: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]],
      audience: ['']
    });
  }

  setFormData() {
    if (this.day) {
      const formattedDate = new Date(this.day.Day);

      this.dateForm.patchValue({
        id: this.day.id,
        date: formattedDate,
        lecturerId: this.day.Teacher.LectorId,
        startTime: this.day.StartTime,
        endTime: this.day.EndTime,
        building: this.day.Building,
        audience: this.day.Audience
      });
    }
  }

  get formControls() {
    return this.dateForm.controls;
  }

  onSubmit() {

    const id = this.day.Id;
    const date = this.dateForm.value.date;
    const lecturerId = this.dateForm.value.lecturerId;
    const start = this.dateForm.value.startTime;
    const end = this.dateForm.value.endTime;
    const audience = this.dateForm.value.audience;
    const building = this.dateForm.value.building;

    if (this.day.SubjectId === undefined)

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
    ).subscribe(response => {

      this.close.emit();
    }, error => {

      console.error(error);
    });


  }

  onClose() {
    this.close.emit();
  }

  resetForm() {
    this.dateForm.reset();
  }
}
