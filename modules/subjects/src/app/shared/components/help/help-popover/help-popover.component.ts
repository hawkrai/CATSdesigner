import { Component, HostListener, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'help-popover',
  templateUrl: './help-popover.component.html',
  styleUrls: ['./help-popover.component.less']
})
export class HelpPopoverComponent implements OnInit {

  

  constructor(
    private dialogRef: MatDialogRef<HelpPopoverComponent>, @Inject (MAT_DIALOG_DATA) public data: any) {

      dialogRef.backdropClick().subscribe(() => {
        dialogRef.close();
     })
    }
    
  ngOnInit() {
  }

}
