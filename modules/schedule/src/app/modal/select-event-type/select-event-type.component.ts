import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {CreateLessonComponent} from '../create-lesson/create-lesson.component';
import {AddNoteComponent} from '../add-note/add-note.component';

@Component({
  selector: 'app-select-event-type',
  templateUrl: './select-event-type.component.html',
  styleUrls: ['./select-event-type.component.css']
})
export class SelectEventTypeComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SelectEventTypeComponent>,
              private dialog: MatDialog,
              @Inject(MAT_DIALOG_DATA) private data: any, ) { }

  type = '1';

  ngOnInit() {
  }


  onCancelClick() {
    this.dialogRef.close(null);
  }

  select() {
    if (this.type === '1') {
      const dialogRef = this.dialog.open(CreateLessonComponent, {width: '500px', disableClose: true, data: {userName: this.data.userName}});
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.dialogRef.close({lesson: result, type: 'lesson'});
        }
      });
    } else if (this.type === '2') {
      const dialogRef = this.dialog.open(AddNoteComponent,
        {width: '500px', disableClose: true, data: { event: null}, position: {top: '11%'}});
      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.dialogRef.close({note: result, type: 'note'});
        }
      });
    }

  }
}
