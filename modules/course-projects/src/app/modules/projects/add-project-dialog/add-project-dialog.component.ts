import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef, MatListOption} from '@angular/material';
import {Group} from '../../../models/group.model';

interface DialogData {
  name: string;
  groups: Group[];
  selectedGroups: Group[];
}

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.less']
})
export class AddProjectDialogComponent {

  private nameControl: FormControl = new FormControl(this.data.name,
    [Validators.minLength(3), Validators.maxLength(255), Validators.required]);

  constructor(public dialogRef: MatDialogRef<AddProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
