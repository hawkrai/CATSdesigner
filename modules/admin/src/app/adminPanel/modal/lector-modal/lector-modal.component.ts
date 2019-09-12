import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LectorData } from '../../table-for-students-and-lectors/table-for-students-and-lectors.component';


@Component({
  selector: 'app-lector-modal',
  templateUrl: './lector-modal.component.html',
  styleUrls: ['./lector-modal.component.css']
})
export class LectorModalComponent implements OnInit {

  ngOnInit(): void {
  }

  constructor(
    public dialogRef: MatDialogRef<LectorModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: LectorData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


}
