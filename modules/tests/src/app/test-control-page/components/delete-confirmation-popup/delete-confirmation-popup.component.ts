import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-delete-confirmation-popup',
  templateUrl: './delete-confirmation-popup.component.html',
  styleUrls: ['./delete-confirmation-popup.component.less']
})
export class DeleteConfirmationPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteConfirmationPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
