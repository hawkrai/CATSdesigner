import {Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, ViewContainerRef} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from '../../models/dialog-data.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-visit-date-popover',
  templateUrl: 'visit-date-popover.component.html',
  styleUrls: ['./visit-date-popover.component.less']
})
export class VisitDatePopoverComponent {

  // @Input() popoverData: DialogData;
  // @Output() addDate = new EventEmitter();

  newDate: string;

  constructor(
    public dialogRef: MatDialogRef<VisitDatePopoverComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private datePipe: DatePipe) {
  }

  onClick(): void {
    this.dialogRef.close();
  }

  setDate(date) {
    this.newDate = this.datePipe.transform(date, 'dd/MM/yyyy');
  }

  // createDate(): void {
  //   console.log(this.newDate)
  //   if (this.newDate) {
  //     this.data.service.createDateVisit({subjectId: this.subjectId, date: this.newDate})
  //       .subscribe(res => res.Code === "200" && this.refreshData())
  //   }
  // }
  //
  // deleteDate(dateToDelete): void {
  //   if (dateToDelete) {
  //     this.data.service.deleteDateVisit({id: dateToDelete.id})
  //       .subscribe(res => res.Code === "200" && this.refreshData())
  //   }
  // }

}
