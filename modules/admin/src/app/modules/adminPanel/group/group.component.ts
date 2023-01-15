import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource, Sort, PageEvent } from '@angular/material';
import { AddGroupComponent } from '../modal/add-group/add-group.component';
import { GroupService } from 'src/app/service/group.service';
import { DeleteItemComponent } from '../modal/delete-person/delete-person.component';
import { Group } from 'src/app/model/group';
import { ListOfStudentsComponent } from '../modal/list-of-students/list-of-students.component';
import {MessageComponent} from '../../../component/message/message.component';
import { AppToastrService } from 'src/app/service/toastr.service';
import { SubjectListComponent } from '../modal/subject-list/subject-list.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  dataGroup  = new Group();
  displayedColumns: string[] = ['number',  'Name', 'StartYear', 'GraduationYear', 'studentsCount','subjectsCount', 's'];
  dataSource = new MatTableDataSource<Group>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoad = false;

  filter: string = null;

  orderBy: string = null;
  sortDirection: number = 0;

  pageIndexDelta: number = 0;
  prevPageData: Group[] = null;
  nextPageData: Group[] = null;

  orderByMap = {
    'Name': 'Name',
    'StartYear': 'StartYear',
    'GraduationYear': 'GraduationYear'
  }

  constructor(private groupService: GroupService, private dialog: MatDialog, private toastr: AppToastrService) { }

  ngOnInit(): void {
    this.dataSource.sort = this.sort;
    this.paginator.pageSize = 20;
    
    this.loadGroupsPaged(false);
  }
  
  applyFilter(filterValue: string) {
    this.filter = filterValue.trim().toLowerCase();
    this.paginator.pageIndex = 0;
    
    this.loadGroupsPaged(false);
  }

  applySort(sort: Sort) {
    this.orderBy = null;

    if (sort.direction != '') {
      this.orderBy = this.orderByMap.hasOwnProperty(sort.active) ? this.orderByMap[sort.active] : null;
    }

    this.sortDirection = sort.direction == "desc" ? 1 : 0;

    this.loadGroupsPaged(false);
  }

  pageChanged(event: PageEvent) {
    this.pageIndexDelta = event.pageIndex - event.previousPageIndex;
    this.loadGroupsPaged();
  }

  loadGroupsPaged(usePreloaded: boolean = true) {
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

    this.groupService.getGroupsPaged(this.paginator.pageIndex, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
      this.dataSource.data = items.Items;
      this.paginator.length = items.TotalCount;
      this.isLoad = true;

      this.preloadGroups();
    });
  }

  preloadGroups(loadPrevPage: boolean = true, loadNextPage: boolean = true) {
    if (loadPrevPage && this.paginator.hasPreviousPage()) {
      this.groupService.getGroupsPaged(this.paginator.pageIndex - 1, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
        this.prevPageData = items.Items;
      });
    }

    if (loadNextPage && this.paginator.hasNextPage()) {
      this.groupService.getGroupsPaged(this.paginator.pageIndex + 1, this.paginator.pageSize, this.filter, this.orderBy, this.sortDirection).subscribe(items => {
        this.nextPageData = items.Items;
      });
    }
  }

  loadPrevPagePreloaded() {
    this.nextPageData = this.dataSource.data;
    this.dataSource.data = this.prevPageData;
    this.prevPageData = null;

    this.preloadGroups(true, false);
  }

  loadNextPagePreloaded() {
    this.prevPageData = this.dataSource.data;
    this.dataSource.data = this.nextPageData;
    this.nextPageData = null;

    this.preloadGroups(false, true);
  }

  openListOfSubject(group) {
    const dialogRef = this.dialog.open(SubjectListComponent, {
      data: group
    });
    dialogRef.afterClosed();
  }

  saveGroup(group: Group) {
    this.groupService.addGroup(group).subscribe(() => {
      this.loadGroupsPaged(false);
      this.dataGroup = new Group();
      this.toastr.addSuccessFlashMessage("Группа успешна сохранена!");
    }, err => {
      if (err.status === 500) {
        this.loadGroupsPaged(false);
        this.toastr.addSuccessFlashMessage("Группа успешна сохранена!");
      } else {
        this.toastr.addErrorFlashMessage('Произошла ошибка при сохранении. Повторите попытку');
      }
    });
  }

  addGroup(group) {
    const dialogRef = this.dialog.open( AddGroupComponent, {
       data: group
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveGroup(result.data);
      }
    });
  }

  deleteGroup(id, subCount, studCount) {
    const dialogRef = this.dialog.open(DeleteItemComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeGroup(id, subCount, studCount);
      }
    });
  }

  removeGroup(id, subCount, studCount) {
    this.groupService.deleteGroup(id).subscribe(() => {
      this.loadGroupsPaged(false);
      this.toastr.addSuccessFlashMessage("Группа удалена!");
    }, 
    err => {
        var msg = 'Произошла ошибка!\n';
        if (studCount != 0) {
          msg = msg + 'Нельзя удалить группу со студентами!\n'
        } 

        if (subCount != 0) {
          msg = msg + 'Нельзя удалить группу за которой закреплены предметы!\n'
        }

        this.toastr.addErrorFlashMessage(msg);

        this.loadGroupsPaged(false);
    });
  }

  editGroup(group: Group) {
    const dialogRef = this.dialog.open(AddGroupComponent, {
        data: group
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveGroup(result.data);
      }
    });
  }

  async openListOfStudents(group) {
    const dialogRef = this.dialog.open(ListOfStudentsComponent, 
      {data: group},
    );
    dialogRef.afterClosed();
  }
}
