import { Component, HostListener, Inject, Input, OnInit } from '@angular/core'
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog'

@Component({
  selector: 'help-popover-progress-control',
  templateUrl: './help-popover-progress-control.component.html',
  styleUrls: ['./help-popover-progress-control.component.less'],
})
export class HelpPopoverProgressControlComponent implements OnInit {
  constructor(
    private dialogRef: MatDialogRef<HelpPopoverProgressControlComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.backdropClick().subscribe(() => {
      dialogRef.close()
    })
  }

  ngOnInit() {}
}
