import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormControl, Validators} from '@angular/forms';

export interface DialogData {
  subjectId: string;
}

@Component({
  selector: 'app-plagiarism-check-dialog',
  templateUrl: './plagiarism-check-dialog.component.html',
  styleUrls: ['./plagiarism-check-dialog.component.less']
})
export class PlagiarismCheckDialogComponent {

  private methods = [
    {id: 0, name: 'Векторный метод'},
    {id: 1, name: 'Метод шинглов'}
  ];

  private method = this.methods[0].id;

  private percentageControl = new FormControl(50, [Validators.min(50), Validators.max(100),
    Validators.required]);

  constructor(public dialogRef: MatDialogRef<PlagiarismCheckDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  exportPlagiarism() {
    location.href = 'http://localhost:8080/Statistic/ExportPlagiarism?subjectId=' + this.data.subjectId + '&type=' + this.method +
      '&threshold=' + this.percentageControl.value;
  }
}
