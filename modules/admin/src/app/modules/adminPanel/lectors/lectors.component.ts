import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator, MatSort, PageEvent, Sort } from '@angular/material';
import { LectorModalComponent } from '../modal/lector-modal/lector-modal.component';
import { Professor, EditProfessor } from 'src/app/model/professor';
import { ProfessorService } from 'src/app/service/professor.service';
import { AppToastrService } from 'src/app/service/toastr.service';
import { DeleteItemComponent } from '../modal/delete-person/delete-person.component';
import { EditLectorComponent } from '../modal/edit-lector/edit-lector.component';
import { ListOfGroupsComponent } from '../modal/list-of-groups/list-of-groups.component';
import { StatisticComponent } from '../modal/statistic/statistic.component';
import { Router } from '@angular/router';
import { last } from 'rxjs/operators';
import { TranslatePipe } from 'educats-translate';

@Component({
  selector: 'app-lectors',
  templateUrl: './lectors.component.html',
  styleUrls: ['./lectors.component.css']
})

export class LectorsComponent implements OnInit {

  isLoad: boolean;
  dataLector = new Professor();
  displayedColumns: string[] = ['position', 'FullName', 'Login', 'LastLogin', 'RegistrationDate', 'status', 'subjects', 'action'];
  dataSource = new MatTableDataSource<Professor>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  filter: string = null;

  orderBy: string = null;
  sortDirection: number = 0;

  pageIndexDelta: number = 0;
  prevPageData: Professor[] = null;
  nextPageData: Professor[] = null;

  orderByMap = {
    'FullName': 'LastName',
    'Login': 'User.UserName'
  }

  constructor(
    private dialog: MatDialog,
    private professorService: ProfessorService,
    private router: Router,
    private toastr: AppToastrService,
    private translatePipe: TranslatePipe) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 20;
    
    this.loadLectorsPaged(false);
  }
  
  applyFilter(filterValue: string) {
    this.filter = filterValue.trim().toLowerCase();
    this.paginator.pageIndex = 0;
    
    this.loadLectorsPaged(false);
  }

  applySort(sort: Sort) {
    this.orderBy = null;

    if (sort.direction != '') {
      this.orderBy = this.orderByMap.hasOwnProperty(sort.active) ? this.orderByMap[sort.active] : null;
    }

    this.sortDirection = sort.direction == "desc" ? 1 : 0;

    this.loadLectorsPaged(false);
  }

  pageChanged(event: PageEvent) {
    this.pageIndexDelta = event.pageIndex - event.previousPageIndex;
    this.loadLectorsPaged();
  }

  loadLectorsPaged(usePreloaded: boolean = true) {
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

    this.professorService.getProfessorsPaged(this.paginator.pageIndex, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
      this.dataSource.data = items.Items;
      this.paginator.length = items.TotalCount;
      this.isLoad = true;

      this.preloadLectors();
    });
  }

  preloadLectors(loadPrevPage: boolean = true, loadNextPage: boolean = true) {
    if (loadPrevPage && this.paginator.hasPreviousPage()) {
      this.professorService.getProfessorsPaged(this.paginator.pageIndex - 1, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
        this.prevPageData = items.Items;
      });
    }

    if (loadNextPage && this.paginator.hasNextPage()) {
      this.professorService.getProfessorsPaged(this.paginator.pageIndex + 1, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
        this.nextPageData = items.Items;
      });
    }
  }

  loadPrevPagePreloaded() {
    this.nextPageData = this.dataSource.data;
    this.dataSource.data = this.prevPageData;
    this.prevPageData = null;

    this.preloadLectors(true, false);
  }

  loadNextPagePreloaded() {
    this.prevPageData = this.dataSource.data;
    this.dataSource.data = this.nextPageData;
    this.nextPageData = null;

    this.preloadLectors(false, true);
  }

  isNotActive(professor) {
    return !professor.IsActive;
  }

  restoreProfessor(professor) {
    const newProfessorObject = new EditProfessor();
    newProfessorObject.Surname = professor.LastName;
    newProfessorObject.Name = professor.FirstName;
    newProfessorObject.Patronymic = professor.MiddleName || '';
    newProfessorObject.About = professor.About || '';
    newProfessorObject.Avatar = professor.Avatar || '';
    newProfessorObject.Email = professor.Email || '';
    newProfessorObject.Groups = professor.Groups || [];
    newProfessorObject.IsActive = true;
    newProfessorObject.IsLecturerHasGraduateStudents =
    professor.IsLecturerHasGraduateStudents || false;
    newProfessorObject.IsSecretary = professor.IsSecretary || false;
    newProfessorObject.LecturerId = professor.Id;
    newProfessorObject.Phone = professor.Phone || '';
    newProfessorObject.Skill = professor.Skill || '';
    newProfessorObject.SkypeContact = professor.SkypeContact || '';
    newProfessorObject.SelectedGroupIds = professor.SecretaryGroupsIds || [];
    newProfessorObject.UserName = professor.Login || '';
    professor.isActive = true;
    this.editLector(newProfessorObject);
  }

  navigateToProfile(id) {
    this.router.navigate(['profile', id]);
  }

  deleteProfessor(id) {
    const dialogRef = this.dialog.open(DeleteItemComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteLector(id);
      }
    });
  }

  openDialogEdit(dataLector) {
    const dialogRef = this.dialog.open(EditLectorComponent, {
      data: dataLector
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.editLector(result.data);
      }
    });
  }

  openListOfGroup(lectorId) {
    const dialogRef = this.dialog.open(ListOfGroupsComponent, {
      data: lectorId
    });
    dialogRef.afterClosed();
  }

  openDiagram(userId) {
    const dialogRef = this.dialog.open(StatisticComponent, {
      data: userId
    });
    dialogRef.afterClosed();
  }

  saveProfessor() {
    const dialogRef = this.dialog.open(LectorModalComponent, {
      data:  this.dataLector
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.addLector(result.data);
      }
    });
  }

  loadChangedLector(userName) {
    this.professorService.getProfessorByName(userName).subscribe(item => {
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

  loadDeletedLector(id) {
    this.professorService.getProfessorById(id).subscribe(item => {
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

  addLector(professor): void {
    this.professorService.addProfessor(professor).subscribe(() => {
      this.loadLectorsPaged(false);
      this.dataLector = new Professor();
      this.toastr.addSuccessFlashMessage(this.translatePipe.transform("text.adminPanel.lectors.add.success", ""));}
      );
  }

  editLector(professor): void {
    this.professorService.editProfessor(professor).subscribe(() => {
      this.loadChangedLector(professor.UserName);
      this.dataLector = new Professor();
      this.toastr.addSuccessFlashMessage(this.translatePipe.transform("text.adminPanel.lectors.edit.success", ""));
    }, 
    err => {
      if ( err.status === 500) {
        this.loadChangedLector(professor.UserName);
        this.toastr.addSuccessFlashMessage(this.translatePipe.transform("text.adminPanel.lectors.edit.success", ""));
      } else {
      }
    });
  }

  deleteLector(id) {
    this.professorService.deleteProfessor(id).subscribe(() => {
      this.loadDeletedLector(id);
      this.toastr.addSuccessFlashMessage(this.translatePipe.transform("text.adminPanel.lectors.delete.success", ""));
    });
  }

  formatDate(dateString) {
    if (dateString == '-') {
      return '';
    }

    let date = new Date(dateString + 'Z');

    let year = date.toLocaleDateString('en-US', { year: 'numeric' });
    let month = date.toLocaleDateString('en-US', { month: '2-digit' });
    let day = date.toLocaleDateString('en-US', { day: '2-digit' });
    let time = date.toLocaleTimeString('en-US', { hour12: false });
    return `${day}.${month}.${year}, ${time}`;
  }

  getStatusTooltip(lecturer: Professor) {
    let tooltip = "";
    
    if (lecturer.IsActive) {
      return;
    }

    if (lecturer.DeletedOn != null) {
      return this.translatePipe.transform("text.adminPanel.lectors.status.deleted", "") + "\r\n" +
        `${this.formatDate(lecturer.DeletedOn)}\r\n`;
    }
  }
}
