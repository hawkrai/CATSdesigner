import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Lector} from "../../../../../../subjects/src/app/models/lector.model";

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

  constructor(private fb: FormBuilder,) {}

  ngOnInit() {
    this.initForm();
    this.setFormData();
  }

  initForm() {
    this.dateForm = this.fb.group({
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
        date: formattedDate,
        lecturerId: this.day.LecturerId,
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

  }


  onClose() {
    this.close.emit();
  }

  resetForm() {
    this.dateForm.reset();
  }
}

