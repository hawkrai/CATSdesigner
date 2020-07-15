import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-delete-confirmation-popup',
  templateUrl: './delete-question-confirmation-popup.component.html',
  styleUrls: ['./delete-question-confirmation-popup.component.less']
})
export class DeleteQuestionConfirmationPopupComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DeleteQuestionConfirmationPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
