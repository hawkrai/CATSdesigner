import { Component, Input, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-popover',
  templateUrl: './popover.component.html',
  styleUrls: ['./popover.component.less']
})
export class PopoverComponent implements OnInit {

  @Input() width: number = 500;
  constructor(
    private dialogRef: MatDialogRef<PopoverComponent>
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.dialogRef.close();
  }
}
