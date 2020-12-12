import {Component, EventEmitter, Input, Output} from "@angular/core";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter} from '@angular/material-moment-adapter';

import { DialogService } from './../../services/dialog.service';
import { DialogData } from '../../models/dialog-data.model';
import { DeletePopoverComponent } from '../delete-popover/delete-popover.component';


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

  @Input() schedule: { Date: string }[];
  @Output() createDate = new EventEmitter<string>();
  @Output() close = new EventEmitter<void>();
  @Output() deleteDay = new EventEmitter<any>();
  @Input() data: { title: string, buttonText: string };
  constructor(
    protected dialogService: DialogService
    ) {}

  onClick(): void {
    this.close.emit();
  }

  onCreateDate(date: string): void {
    this.createDate.emit(date.replace(/\./g, '/'));
  }

  onDeleteDate(day: any): void {
    this.deleteDay.emit(day);
  }

  deletePopover(day: any) {
    const dialogData: DialogData = {
      title: 'Удаление даты',
      body: 'дату и все связанные с ней данные',
      buttonText: 'Удалить'
    };
    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.onDeleteDate(day);
      }
    });
  }
}
