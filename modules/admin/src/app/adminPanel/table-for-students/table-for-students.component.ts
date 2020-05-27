import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { StudentService } from 'src/app/service/student.service';
import { DeleteItemComponent } from '../modal/delete-person/delete-person.component';
import { SubjectListComponent } from '../modal/subject-list/subject-list.component';
import { Student } from 'src/app/model/student';
import { EditStudentComponent } from '../modal/edit-student/edit-student.component';
import { StatisticComponent } from '../modal/statistic/statistic.component';
import { Router } from '@angular/router';
import { SuccessMessageComponent } from 'src/app/success-message/success-message.component';

@Component({
  selector: 'app-table-for-students',
  templateUrl: './table-for-students.component.html',
  styleUrls: ['./table-for-students.component.css']
})
export class TableForStudentsComponent implements OnInit {

  isLoad: boolean;
  student = new Student();
  displayedColumns: string[] = ['position', 'GroupName', 'FullName', 'UserName', 'action'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isDelete = false;

  constructor(private dialog: MatDialog, private studentService: StudentService, private router: Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadStudent();
  }

  navigateToProfile(login) {
    this.router.navigate(['admin/profile', login]);
  }

  loadStudent() {
    this.studentService.getStudents().subscribe(items => {
      this.dataSource.data = items;
      this.isLoad = true;
    });
  }

  editStudent(student): void {
    this.studentService.editStudents(student).subscribe(() => {
      student = new Student();
      this.dialog.open(SuccessMessageComponent, {
        data: 'Студент успешно изменен.',
        position: {
          bottom: '0px',
          right: '0px'
        }
      });
      this.loadStudent();
    }, err => {
      if ( err.status === 500) {
        this.dialog.open(SuccessMessageComponent, {
          data: 'Студент успешно изменен.',
          position: {
            bottom: '0px',
            right: '0px'
          }
        });
      } else {
        this.dialog.open(SuccessMessageComponent, {
          data: 'Произошла ошибка при изменении студента.Попробуйте заново.',
          position: {
            bottom: '0px',
            right: '0px'
          }
        });
      }
    });
  }


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  openDialogDelete(id) {
    const dialogRef = this.dialog.open(DeleteItemComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(id).subscribe(() => {
          this.loadStudent();
        });
      }
    });
  }

  openDialogEdit(person) {
    const dialogRef = this.dialog.open(EditStudentComponent, {
      data: person
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result.data);
        this.editStudent(result.data);
      }
    });
  }

  openDiagram(userId) {
    const dialogRef = this.dialog.open(StatisticComponent, {
      data: userId
    });
    dialogRef.afterClosed();
  }

  openListOfSubject(studentId) {
    const dialogRef = this.dialog.open(SubjectListComponent, {
      data: studentId
    });
    dialogRef.afterClosed();
  }
}
