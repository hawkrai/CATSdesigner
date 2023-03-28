import {Component, OnInit, ViewChild} from '@angular/core';
import {Student} from '../../../model/student';
import {StudentService} from '../../../service/student.service';
import {Router} from '@angular/router';
import {DeleteItemComponent} from '../modal/delete-person/delete-person.component';
import {EditStudentComponent} from '../modal/edit-student/edit-student.component';
import {StatisticComponent} from '../modal/statistic/statistic.component';
import {SubjectListComponent} from '../modal/subject-list/subject-list.component';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator, PageEvent} from '@angular/material/paginator';
import {MatSort, Sort} from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import { AppToastrService } from 'src/app/service/toastr.service';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css']
})
export class StudentsComponent implements OnInit {

  isLoad: boolean;
  dataStudent = new Student();
  displayedColumns: string[] = ['position', 'FullName', 'GroupName', 'UserName', 'LastLogin', 'RegistrationDate', 'Confirmed', 'Subjects', 'action'];
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

  constructor(
    private dialog: MatDialog,
    private toastr: AppToastrService,
    private studentService: StudentService,
    private router: Router,
    private translatePipe: TranslatePipe
    ) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 20;
    
    this.loadStudentsPaged(false);
  }

  applyFilter() {
    this.filter = this.filter.trim().toLowerCase();
    this.paginator.pageIndex = 0;
    
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
      this.dataSource.data = data;
      this.isLoad = true;
    })
  }

  editStudent(student): void {
    this.studentService.editStudents(student).subscribe(() => {
      this.loadStudentsPaged(false);
      this.dataStudent = new Student();
      this.toastr.addSuccessFlashMessage(this.translatePipe.transform("text.adminPanel.students.edit.success", ""));
    });
  }

  restoreStudent(id): void {
    this.studentService.restoreStudent(id).subscribe(() => {
      this.loadStudentById(id);
      this.toastr.addSuccessFlashMessage(this.translatePipe.transform("text.adminPanel.students.restore.success", ""));
    },
    () => {
      this.toastr.addErrorFlashMessage(this.translatePipe.transform("text.adminPanel.students.restore.error", ""));
    });
  }

  isActive(student){
    return student.IsActive;
  }

  openDialogDelete(id) {
    const dialogRef = this.dialog.open(DeleteItemComponent, {
      hasBackdrop: true,
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.studentService.deleteStudent(id).subscribe(() => {
          this.loadStudentById(id);
          this.toastr.addSuccessFlashMessage(this.translatePipe.transform("text.adminPanel.students.delete.success", ""));
        },
        err => {
          this.toastr.addErrorFlashMessage(this.translatePipe.transform("text.adminPanel.students.delete.error", ""));
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
      hasBackdrop: true,
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
      hasBackdrop: true,
      data: userId
    });
    dialogRef.afterClosed();
  }

  openListOfSubject(studentId) {
    const dialogRef = this.dialog.open(SubjectListComponent, {
      hasBackdrop: true,
      data: studentId
    });
    dialogRef.afterClosed();
  }

  getStudentStatus(student){
    if (!student.IsActive){
      return this.translatePipe.transform("text.adminPanel.students.status.deleted", "")
    }
    
    if(student.Confirmed){
        return this.translatePipe.transform("text.adminPanel.students.status.confirmed", "")
    }

    return this.translatePipe.transform("text.adminPanel.students.status.notConfirmed", "")
  }

  formatDate(dateString) {
    if (!dateString || dateString == '-') {
      return '';
    }

    let date = new Date(dateString + 'Z');

    let year = date.getFullYear();
    let month = (date.getMonth() < 9) ? ("0" + (date.getMonth() + 1)) : (date.getMonth() + 1); //months are 0 based
    let day = (date.getDate() < 10) ? ("0" + date.getDate()) : date.getDate();
    let time = date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
    return `${day}.${month}.${year}, ${time}`;
  }

  getStatusTooltip(student: Student) {
    let tooltip = "";
    
    if (!student.IsActive) {
      if (student.DeletedOn != null) {
        return this.translatePipe.transform("text.adminPanel.students.tooltips.deletedOn", "") + "\r\n" +
          `${this.formatDate(student.DeletedOn)}\r\n`;
      }

      return;
    }

    if (student.Confirmed && student.ConfirmedBy != null && student.ConfirmationDate != '-') {
      return this.translatePipe.transform("text.adminPanel.students.tooltips.confirmedOn", "") + "\r\n" +
        `${this.formatDate(student.ConfirmationDate)}\r\n` +
        `${student.ConfirmedBy}\r\n`
    }

    if (!student.Confirmed && student.ConfirmedBy != null && student.ConfirmationDate != '-') {
      return this.translatePipe.transform("text.adminPanel.students.tooltips.confirmationCancelledOn", "") + "\r\n" +
        `${this.formatDate(student.ConfirmationDate)}\r\n` +
        `${student.ConfirmedBy}\r\n`;
    }
  }
}
