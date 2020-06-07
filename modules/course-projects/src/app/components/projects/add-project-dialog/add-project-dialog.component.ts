import {Component, Inject} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Group} from '../../../models/group.model';

interface DialogData {
  name: string;
  groups: Group[];
  selectedGroups: Group[];
  edit: boolean;
}

@Component({
  selector: 'app-add-project-dialog',
  templateUrl: './add-project-dialog.component.html',
  styleUrls: ['./add-project-dialog.component.less']
})
export class AddProjectDialogComponent {

  private nameControl: FormControl = new FormControl(this.data.name,
    [Validators.minLength(3), Validators.maxLength(255), Validators.required]);

  private groups: Group[];

  constructor(public dialogRef: MatDialogRef<AddProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.groups = data.groups.filter(g => !data.selectedGroups.find(sg => sg.Id === g.Id));
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  move(i: number, origin: Group[], dest: Group[]) {
    const group = origin.splice(i, 1)[0];
    const destIndex = dest.findIndex(g => g.Name > group.Name);
    if (destIndex < 0) {
      dest.push(group);
    } else {
      dest.splice(destIndex, 0, group);
    }
  }

  includeAll() {
    this.data.selectedGroups = this.data.groups.slice();
    this.groups = [];
  }

  includeNone() {
    this.data.selectedGroups = [];
    this.groups = this.data.groups.slice();
  }

  trackByFn(index, item) {
    return item.Id;
  }

}
