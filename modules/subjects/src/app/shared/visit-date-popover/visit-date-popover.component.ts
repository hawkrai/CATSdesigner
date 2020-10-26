import {Component, Inject, OnInit} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from '../../models/dialog-data.model';
import {DatePipe} from '@angular/common';
import {DeletePopoverComponent} from '../delete-popover/delete-popover.component';
import {ComponentType} from '@angular/cdk/typings/portal';
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
export class VisitDatePopoverComponent implements OnInit{

  newDate: string;
  calendar: any[];

  date = new FormControl(new Date());

  constructor(
    public dialogRef: MatDialogRef<VisitDatePopoverComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.setDate(this.date.value);
    this.data.body.service.getCalendar().subscribe(res => {
      this.calendar = this.data.model ? this.getCalendarForSubGroup(res) : res;
    })
  }

  private  getCalendarForSubGroup(calendar) {
    return calendar.filter(res => res.subGroup === this.data.model);
  }

  onClick(): void {
    this.dialogRef.close();
  }

  setDate(date) {
    this.newDate = this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  createDate(): void {
    if (this.newDate) {
      this.data.body.service.createDateVisit({...this.data.body.restBody, date: this.newDate});
    }
  }

  deleteDate(dateToDelete): void {
    if (dateToDelete) {
      this.data.body.service.deleteDateVisit({id: dateToDelete.id});
    }
  }

  deletePopover(dateToDelete) {
    const dialogData: DialogData = {
      title: 'Удаление даты',
      body: 'дату и все связанные с ней данные',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDate(dateToDelete);
      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
