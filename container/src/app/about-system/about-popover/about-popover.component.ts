import {Component } from '@angular/core';
import {MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'about-popover',
  templateUrl: './about-popover.component.html',
  styleUrls: ['./about-popover.component.less']
})
export class AboutSystemPopoverComponent{

  constructor (
    private dialogRef: MatDialogRef<AboutSystemPopoverComponent>
    ) {
      dialogRef.disableClose = true;
    }


  ngOnInit(): void {
    
  }

  onClose(){
    this.dialogRef.close();
  }

}
