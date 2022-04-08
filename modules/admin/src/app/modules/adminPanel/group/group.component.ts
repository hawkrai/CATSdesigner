import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { AddGroupComponent } from '../modal/add-group/add-group.component';
import { GroupService } from 'src/app/service/group.service';
import { DeleteItemComponent } from '../modal/delete-person/delete-person.component';
import { Group } from 'src/app/model/group';
import { ListOfStudentsComponent } from '../modal/list-of-students/list-of-students.component';
import {MessageComponent} from '../../../component/message/message.component';
import { AppToastrService } from 'src/app/service/toastr.service';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  dataGroup  = new Group();
  displayedColumns: string[] = ['number',  'Name', 'StartYear', 'GraduationYear', 'studentsCount','subjectsCount', 's'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isLoad = false;

  constructor(private groupService: GroupService, private dialog: MatDialog, private toastr: AppToastrService) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loadGroup();
  }

  loadGroup() {
    this.groupService.getGroups().subscribe(items => {
      this.dataSource.data = items.sort((a,b) => this.sortFunc(a, b));
      this.isLoad = true;
    });
  }

  sortFunc(a, b) { 
    if(a.Name < b.Name){
      return -1;
    }

    else if(a.Name > b.Name){
      return 1;
    }
    
    return 0;
 } 

  saveGroup(group: Group) {
    this.groupService.addGroup(group).subscribe(() => {
      this.loadGroup();
      this.dataGroup = new Group();
      this.toastr.addSuccessFlashMessage("Группа успешна сохранена!");
    }, err => {
      if (err.status === 500) {
        this.loadGroup();
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

  deleteGroup(id) {
    const dialogRef = this.dialog.open(DeleteItemComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.removeGroup(id);
      }
    });
  }

  removeGroup(id) {
    this.groupService.deleteGroup(id).subscribe(() => {
      this.loadGroup();
      this.toastr.addSuccessFlashMessage("Группа удалена!");
    }, 
    err => {
      this.toastr.addErrorFlashMessage('Произошла ошибка! Повторите попытку!');
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

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
