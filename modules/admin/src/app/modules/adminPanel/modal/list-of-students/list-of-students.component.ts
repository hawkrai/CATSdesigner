/* eslint-disable prettier/prettier */
import { Component, OnInit, Inject } from '@angular/core'
import {
  MatTableDataSource,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material'
import { GroupService } from 'src/app/service/group.service'
import { Student } from '../../../../model/student'

@Component({
  selector: 'app-list-of-students',
  templateUrl: './list-of-students.component.html',
  styleUrls: ['./list-of-students.component.css'],
})
export class ListOfStudentsComponent implements OnInit {
  displayedColumns: string[] = ['student', 'confimed']
  dataSource = new MatTableDataSource<object>()
  isLoad = false

  constructor(
    private groupService: GroupService,
    public dialogRef: MatDialogRef<ListOfStudentsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit() {
    this.loadStudentById(this.data.Id)
  }

  isStudents() {
    return this.data.length !== 0
  }

  async loadStudentById(groupId) {
    await this.groupService
      .getStudentsByGroupId(groupId)
      .subscribe((result) => {
        this.dataSource.data = result.Students
        this.isLoad = true
      })
  }

  isConfimed(student: Student) {
    if (
      student.Confirmed &&
      student.ConfirmedBy != null &&
      student.ConfirmationDate != '-'
    ) {
      return true;

      return false;
    }
  }

  isDeleted(student: Student) {
    if (!student.IsActive) {
      if (student.DeletedOn != null) {
        return true;
      }
    }

    return false;
  }

  onNoClick(): void {
    this.dialogRef.close()
  }

}
