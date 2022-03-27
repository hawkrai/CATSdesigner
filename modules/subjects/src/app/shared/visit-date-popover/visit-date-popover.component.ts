import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import * as moment from 'moment';

import { DialogService } from './../../services/dialog.service';
import { DialogData } from '../../models/dialog-data.model';
import { DeletePopoverComponent } from '../delete-popover/delete-popover.component';
import { timeValidator } from '../validators/time.validator';
import { TranslatePipe } from "educats-translate";

export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'app-visit-date-popover',
  templateUrl: 'visit-date-popover.component.html',
  styleUrls: ['./visit-date-popover.component.less'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_LOCALE, useValue: 'ru'},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class VisitDatePopoverComponent {

  @Input() schedule: { Date: string,   
    StartTime: string;
    EndTime: string; 
    Audience: string;
  }[];
  @Output() createDate = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() deleteDay = new EventEmitter<any>();
  @Input() data: { title: string, buttonText: string };
  constructor(
    protected dialogService: DialogService,
    private translate: TranslatePipe,
    dateAdapter: DateAdapter<any>
    ) {
      dateAdapter.setLocale(localStorage.getItem("locale") || "ru");
    }

  onClick(): void {
    this.close.emit();
  }

  private time = (control: AbstractControl) => {
    return timeValidator(this.dateForm ? this.dateForm.get('startTime').value : null, control.value);
  }

  dateForm: FormGroup = new FormGroup({
    date: new FormControl(moment(), [Validators.required]),
    startTime: new FormControl(moment().format("HH:mm"), [Validators.required]),
    endTime: new FormControl(moment().add(1, 'hour').add(30, 'minutes').format("HH:mm"), [Validators.required, this.time]),
    building: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(5)]),
    audience: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(5)])
  });


  ngOnInit(): void {
    if (this.schedule && this.schedule.length) {
      const lastDay = this.schedule[this.schedule.length - 1];
      const now = moment().format('yyyy-MM-DD');

      this.dateForm.patchValue({
        startTime: moment(`${now} ${lastDay.StartTime}`).format('HH:mm'),
        endTime: moment(`${now} ${lastDay.EndTime}`).format('HH:mm'),
        audience: lastDay.Audience
      });
    }
  }

  onCreateDate(): void {
    if (this.dateForm.invalid) {
      return;
    }
    this.createDate.emit({ 
      ...this.dateForm.value, 
      date: moment(this.dateForm.get('date').value).format('DD/MM/YYYY'), 
      buildingNumber:  this.dateForm.get('building').value.toUpperCase()
    });
  }

  onDeleteDate(day: any): void {
    this.deleteDay.emit(day);
  }

  deletePopover(day: any) {
    const dialogData: DialogData = {
      title: this.translate.transform('date.delete', 'Удаление даты'),
      body: this.translate.transform('text.schedule.date.and.connected.data', 'дату и все связанные с ней данные'),
      buttonText: this.translate.transform('button.delete', 'Удалить')
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteDate(day);
      }
    });
  }
}
