import {Component, ElementRef, Inject, ViewContainerRef} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from '../../models/dialog-data.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-visiting-popover',
  templateUrl: 'visiting-popover.component.html',
  styleUrls: ['./visiting-popover.component.less']
})
export class VisitingPopoverComponent {

  public displayedColumns = ['position', 'name', 'mark', 'comment'];
  possibleMarks = [1, 2, 3, 4]
  constructor(
    public dialogRef: MatDialogRef<VisitingPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.dialogRef.disableClose = true;
  }

  onClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    this.dialogRef.close(this.data.body);
  }


}
