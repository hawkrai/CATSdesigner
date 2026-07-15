import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'

@Component({
  selector: 'app-placement-confirmation-popup',
  templateUrl: './placement-confirmation-popup.component.html',
  styleUrls: ['./placement-confirmation-popup.component.less'],
})
export class PlacementConfirmationPopupComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<PlacementConfirmationPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {}

  onNoClick(): void {
    this.dialogRef.close()
  }
}
