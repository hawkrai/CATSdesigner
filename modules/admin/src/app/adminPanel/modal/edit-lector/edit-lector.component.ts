import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LectorData } from 'src/app/adminPanel/lectors/lectors.component';

@Component({
  selector: 'app-edit-lector',
  templateUrl: './edit-lector.component.html',
  styleUrls: ['./edit-lector.component.css']
})
export class EditLectorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<EditLectorComponent>,
    @Inject(MAT_DIALOG_DATA) public dataLector: LectorData) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
