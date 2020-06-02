import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../models/dialog-data.model';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-news-popover',
  templateUrl: './subject-management.component.html',
  styleUrls: ['./subject-management.component.less']
})
export class SubjectManagementComponent {

  public abbreviation = '';
  public name = '';
  public color = '#a46161';
  groups = new FormControl();

  groupList: string[] = ['10701117', '10701117'];

  constructor(
    public dialogRef: MatDialogRef<SubjectManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onClick(): void {
    this.dialogRef.close();
  }
}
