import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../../../../models/dialog-data.model';
import {DatePipe} from '@angular/common';
import {FormControl} from '@angular/forms';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';

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
  selector: 'app-news-popover',
  templateUrl: './labs-mark-popover.component.html',
  styleUrls: ['./labs-mark-popover.component.less'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },

    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ],
})
export class LabsMarkPopoverComponent implements OnInit{

  date = new FormControl(new Date());

  constructor(
    public dialogRef: MatDialogRef<LabsMarkPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe) {
  }

  ngOnInit(): void {
    this.setDate(this.date.value);
  }

  onClick(): void {
    this.dialogRef.close();
  }

  setDate(date) {
    this.data.body.date = this.datePipe.transform(date, 'dd.MM.yyyy');
  }

}
