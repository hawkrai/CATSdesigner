/* eslint-disable prettier/prettier */
import { Component, OnInit, Inject } from '@angular/core'
import {
  MatTableDataSource,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material'
import { GroupService } from 'src/app/service/group.service'
import { Student, Students } from '../../../../model/student'

@Component({
  selector: 'app-list-of-students',
  templateUrl: './list-of-students.component.html',
  styleUrls: ['./list-of-students.component.css'],
})
export class ListOfStudentsComponent implements OnInit {
  displayedColumns: string[] = ['student', 'confimed']
  dataSource = new MatTableDataSource<object>()
  isLoad = false
 /* students: Students[] = [
    {  FullName: 'Иван Иванов', Confirmed: true, IsActive: false, DeletedOn: null },
    {  FullName: 'Петр Петров', Confirmed: true, IsActive: true, DeletedOn: null },
    {  FullName: 'Сергей Сергеев', Confirmed: false, IsActive: true, DeletedOn: '2024-01-01' },
    {  FullName: 'Анна Аннова', Confirmed: null, IsActive: null, DeletedOn: null },
    {  FullName: 'Мария Мариева', Confirmed: null, IsActive: null, DeletedOn: '2024-01-01' },
  ];*/

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

  isDeleted(student: Students): boolean {
    return student.isActive === false; 
  }

  isConfirmed(student: Students): boolean {
    if (student.Confirmed === true) {
      return true; 
    }
    if (student.Confirmed === false) {
      return false; 
    }
    if (student.Confirmed === null && student.DeletedOn === null) {
      return true; 
    }
    if (student.Confirmed === null && student.DeletedOn) {
      return false; 
    }
    return false; 
  }



  onNoClick(): void {
    this.dialogRef.close()
  }

}
