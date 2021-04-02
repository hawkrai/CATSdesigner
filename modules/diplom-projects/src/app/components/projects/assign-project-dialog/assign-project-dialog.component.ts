import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatOptionSelectionChange} from '@angular/material';
import {Student} from '../../../models/student.model';

interface DialogData {
  students: Student[];
}

@Component({
  selector: 'app-assign-project-dialog',
  templateUrl: './assign-project-dialog.component.html',
  styleUrls: ['./assign-project-dialog.component.less']
})
export class AssignProjectDialogComponent {

  displayedColumns: string[] = ['position', 'name', 'group', 'action'];
  private groups: String[];
  private filteredStudents: Student[];
  private selectedGroup: String;

  constructor(public dialogRef: MatDialogRef<AssignProjectDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) {
                console.log(data.students)
                this.groups = data.students.map(a => a.Group).filter((v, i, a) => a.indexOf(v) === i);       
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = event.source.value;
      this.filteredStudents = this.data.students.filter(x => x.Group == this.selectedGroup);
    }
  }

  onSearchChange(searchText: string) {
    searchText = searchText.toLowerCase();
    this.filteredStudents = this.data.students.filter(x => x.Group == this.selectedGroup && 
      x.Name.toLowerCase().indexOf(searchText) != -1);
  }
}
