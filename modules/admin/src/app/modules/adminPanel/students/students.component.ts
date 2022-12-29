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
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
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
  displayedColumns: string[] = ['position', 'FullName', 'GroupName', 'UserName', 'LastLogin', 'Confirmed', 'Subjects', 'action'];
  dataSource = new MatTableDataSource<Student>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isDelete = false;

  filter: string = null;

  orderBy: string = null;
  sortDirection: number = 0;

  pageIndexDelta: number = 0;
  prevPageData: Student[] = null;
  nextPageData: Student[] = null;

  orderByMap = {
    'FullName': 'LastName',
    'UserName': 'User.UserName',
    'GroupName': 'Group.Name',
    'Confirmed': 'Confirmed'
  }

  constructor(private dialog: MatDialog, private toastr: AppToastrService, private studentService: StudentService, private router: Router) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 20;
    
    this.loadStudentsPaged(false);
  }

  applyFilter(filterValue: string) {
    this.filter = filterValue.trim().toLowerCase();
    
    this.loadStudentsPaged(false);
  }

  applySort(sort: Sort) {
    this.orderBy = null;

    if (sort.direction != '') {
      this.orderBy = this.orderByMap.hasOwnProperty(sort.active) ? this.orderByMap[sort.active] : null;
    }

    this.sortDirection = sort.direction == "desc" ? 1 : 0;

    this.loadStudentsPaged(false);
  }

  pageChanged(event: PageEvent) {
    this.pageIndexDelta = event.pageIndex - event.previousPageIndex;
    this.loadStudentsPaged();
  }

  loadStudentsPaged(usePreloaded: boolean = true) {
    let isDataLoaded = false;

    if (usePreloaded) {
      if (this.pageIndexDelta == -1 && this.prevPageData != null) {
        this.loadPrevPagePreloaded();
        isDataLoaded = true;
      }
      else if (this.pageIndexDelta == 1 && this.nextPageData != null) {
        this.loadNextPagePreloaded();
        isDataLoaded = true;
      }
    }

    if (isDataLoaded) {
      return;
    }

    this.dataSource.data = [];
    this.isLoad = false;
    
    this.nextPageData = null;
    this.prevPageData = null;

    this.studentService.getStudentsPaged(this.paginator.pageIndex, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
      this.dataSource.data = items.Items;
      this.paginator.length = items.TotalCount;
      this.isLoad = true;

      this.preloadStudents();
    });
  }

  preloadStudents(loadPrevPage: boolean = true, loadNextPage: boolean = true) {
    if (loadPrevPage && this.paginator.hasPreviousPage()) {
      this.studentService.getStudentsPaged(this.paginator.pageIndex - 1, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
        this.prevPageData = items.Items;
      });
    }

    if (loadNextPage && this.paginator.hasNextPage()) {
      this.studentService.getStudentsPaged(this.paginator.pageIndex + 1, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
        this.nextPageData = items.Items;
      });
    }
  }

  loadPrevPagePreloaded() {
    this.nextPageData = this.dataSource.data;
    this.dataSource.data = this.prevPageData;
    this.prevPageData = null;

    this.preloadStudents(true, false);
  }

  loadNextPagePreloaded() {
    this.prevPageData = this.dataSource.data;
    this.dataSource.data = this.nextPageData;
    this.nextPageData = null;

    this.preloadStudents(false, true);
  }

  navigateToProfile(id) {
    this.router.navigate(['profile', id]);
  }

  loadStudentById(id){
    this.studentService.getStudentById(id).subscribe(item => {
      let data = this.dataSource.data;
      let index = data.findIndex(value => value.Id == item.Id);

      if (index == -1) {
        return;
      }

      data[index] = item;
      this.isLoad = true;
    })
  }

  editStudent(student): void {
    this.studentService.editStudents(student).subscribe(() => {
      this.loadStudentsPaged(false);
      this.dataStudent = new Student();
      this.toastr.addSuccessFlashMessage('Студент успешно изменен!');
    });
  }

  restoreStudent(id): void {
    this.studentService.restoreStudent(id).subscribe(() => {
      this.loadStudentById(id);
      this.toastr.addSuccessFlashMessage('Студент успешно восстановлен!');
    },
    () => {
      this.toastr.addErrorFlashMessage('Не удалость восстановить студента!');
    });
  }

  isActive(student){
    return student.IsActive;
  }

  openDialogDelete(id) {
    const dialogRef = this.dialog.open(DeleteItemComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(id).subscribe(() => {
          this.loadStudentById(id);
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

  getStudentStatus(student){
    if (!student.IsActive){
      return "Удален"
    }
    
    if(student.Confirmed){
        return "Подтвержден"
    }

    return "Не подтвержден"
  }
}
