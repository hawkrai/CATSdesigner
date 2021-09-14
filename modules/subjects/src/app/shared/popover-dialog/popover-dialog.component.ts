import { Component, ElementRef, HostListener, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-popover-dialog',
  templateUrl: './popover-dialog.component.html',
  styleUrls: ['./popover-dialog.component.less']
})
export class PopoverDialogComponent implements OnInit {

  @Input() width: number = 500;

  constructor(
    private dialogRef: MatDialogRef<PopoverDialogComponent>
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}
