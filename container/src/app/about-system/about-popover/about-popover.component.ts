import {Component, Inject, OnInit } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {MatDialog} from '@angular/material/dialog'

@Component({
  selector: 'about-popover',
  templateUrl: './about-popover.component.html',
  styleUrls: ['./about-popover.component.less']
})
export class AboutSystemPopoverComponent{

  constructor (
    private dialogRef: MatDialogRef<AboutSystemPopoverComponent>,) {
      dialogRef.disableClose = true;
    }


  ngOnInit(): void {
    
  }

  onClose(){
    this.dialogRef.close();
  }

}
