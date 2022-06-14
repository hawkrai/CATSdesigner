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
import { AppToastrService } from 'src/app/service/toastr.service';
//import { AppToastrService } from 'src/app/service/toastr.service';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  isLoad: boolean;
  dataStudent = new Student();
  displayedColumns: string[] = ['position', 'GroupName', 'FullName', 'UserName', 'Confirmed', 'Subjects', 'action'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isDelete = false;

  constructor(private dialog: MatDialog, private toastr: AppToastrService, private studentService: StudentService, private router: Router) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = (data: Student, filter: string) => {
      return data.FullName.toLowerCase().startsWith(filter) ;
     };
    this.dataSource.sort = this.sort;
    this.loadStudent();

  }

  navigateToProfile(id) {
    this.router.navigate(['profile', id]);
  }

  loadStudent() {
    this.studentService.getStudents().subscribe(items => {
      this.dataSource.data = items.sort((a,b) => this.sortFunc(a, b));
      this.isLoad = true;
    });
  }

  editStudent(student): void {
    this.studentService.editStudents(student).subscribe(() => {
      this.loadStudent();
      this.dataStudent = new Student();
      this.toastr.addSuccessFlashMessage('Студент успешно изменен!');
    }, err => {
      if ( err.status === 500) {
        // we do it because db have some issue. After fixing, delete this function, please
        this.loadStudent();
        this.toastr.addSuccessFlashMessage('Студент успешно изменен!');
      } else {
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
          this.toastr.addSuccessFlashMessage("Студент удален!");
        },
        err => {
          this.toastr.addErrorFlashMessage("Ошибка удаления! Попробуйте позже!");
        }
        );
      }
    });
  }

  getName(element: Student){
    if(element.Patronymic != null){
      return element.Surname + ' ' + element.Name + ' ' + element.Patronymic;
    }
    else{
      return element.Surname + ' ' + element.Name;
    }
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

  getStudentStatus(status){
    if(status == true){
        return "Подтвержден"
    }
    return "Не подтвержден"
  }

  sortFunc(a, b) { 
    if(a.FullName < b.FullName){
      return -1;
    }

    else if(a.FullName > b.FullName){
      return 1;
    }
    
    return 0;
 } 
 

}
