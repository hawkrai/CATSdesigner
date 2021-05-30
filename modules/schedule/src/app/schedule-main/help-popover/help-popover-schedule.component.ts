import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'help-popover-schedule',
  templateUrl: './help-popover-schedule.component.html',
  styleUrls: ['./help-popover-schedule.component.less']
})
export class HelpPopoverScheduleComponent implements OnInit {

  constructor(
    private dialogRef: MatDialogRef<HelpPopoverScheduleComponent>, @Inject (MAT_DIALOG_DATA) public data: any) {
      
      dialogRef.backdropClick().subscribe(() => {
        dialogRef.close();
      })

    }

  ngOnInit() {
  }
  

}
