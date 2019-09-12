import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-delete-lector',
  templateUrl: './delete-lector.component.html',
  styleUrls: ['./delete-lector.component.css']
})
export class DeleteLectorComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<DeleteLectorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
