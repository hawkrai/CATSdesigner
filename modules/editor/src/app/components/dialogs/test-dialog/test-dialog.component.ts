import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Test } from 'src/app/models/tests/Test';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-test-dialog',
  templateUrl: './test-dialog.component.html',
  styleUrls: ['./test-dialog.component.scss']
})
export class TestDialogComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TestDialogComponent>,
    public translatePipe: TranslatePipe,
    @Inject(MAT_DIALOG_DATA) public data: Test) { }

  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  getCloseButtonText() {
    return `${this.translatePipe.transform('text.editor.cancel', 'Закрыть')}`;
  }
}
