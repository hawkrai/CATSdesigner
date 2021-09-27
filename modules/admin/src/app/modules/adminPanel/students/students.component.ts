import {Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../../../model/student';
import {StudentService} from '../../../service/student.service';
import {Router} from '@angular/router';
import {MessageComponent} from '../../../component/message/message.component';
import {DeleteItemComponent} from '../modal/delete-person/delete-person.component';
import {EditStudentComponent} from '../modal/edit-student/edit-student.component';
import {StatisticComponent} from '../modal/statistic/statistic.component';
import {SubjectListComponent} from '../modal/subject-list/subject-list.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
//import { AppToastrService } from 'src/app/service/toastr.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  isLoad: boolean;
  student = new Student();
  displayedColumns: string[] = ['position', 'GroupName', 'FullName', 'UserName', 'action'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isDelete = false;

  constructor(private dialog: MatDialog, /*private toastr: AppToastrService,*/ private studentService: StudentService, private router: Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadStudent();
  }

  navigateToProfile(id) {
    this.router.navigate(['profile', id]);
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
      this.dialog.open(MessageComponent, {
        data: 'Студент успешно изменен.',
        position: {
          bottom: '0px',
          right: '0px'
        }
      });
     // this.toastr.addSuccessFlashMessage('Студент успешно изменен.');
      this.loadStudent();
    }, err => {
      if ( err.status === 500) {
        // we do it because db have some issue. After fixing, delete this function, please
        this.loadStudent();
        this.dialog.open(MessageComponent, {
          data: 'Студент успешно изменен.',
          position: {
            bottom: '0px',
            right: '0px'
          }
        });
      } else {
        this.dialog.open(MessageComponent, {
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
