import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { AddGroupComponent } from '../modal/add-group/add-group.component';
import { GroupService } from 'src/app/service/group.service';
import { DeleteItemComponent } from '../modal/delete-person/delete-person.component';
import { Group } from 'src/app/model/group';
import { ListOfStudentsComponent } from '../modal/list-of-students/list-of-students.component';
import { SuccessMessageComponent } from 'src/app/success-message/success-message.component';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {

  group = new Group();
  displayedColumns: string[] = ['number',  'Name', 'StartYear', 'GraduationYear', 'studentsCount', 's'];
  dataSource = new MatTableDataSource<object>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  isDelete = false;
  isLoad = false;
  isLoadStudent = false;

  constructor(private groupService: GroupService, private dialog: MatDialog) { }

  ngOnInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.loadGroup();
  }

  loadGroup() {
    this.groupService.getGroups().subscribe(items => {
      this.dataSource.data = items;
      this.isLoad = true;
    });
  }

  saveGroup(group: Group) {
    this.groupService.addGroup(group).subscribe(() => {
      this.group = new Group();
      this.dialog.open(SuccessMessageComponent, {
        data: 'Группа успешно сохранена.',
        position: {
          bottom: '0px',
          right: '0px'
        }
      });
      this.loadGroup();
    }, err => {
      this.dialog.open(SuccessMessageComponent, {
        data: 'Произошла ошибка при сохранении.Попробуйте заново.',
        position: {
          bottom: '0px',
          right: '0px'
        }
      });
    });
  }

  editGroupJson(group: Group) {
    this.groupService.editGroup(group).subscribe(() => {
      this.dialog.open(SuccessMessageComponent, {
        data: 'Группа успешно изменена.',
        position: {
          bottom: '0px',
          right: '0px'
        }
      });
      this.loadGroup();
    }, () => {
      this.dialog.open(SuccessMessageComponent, {
        data: 'Произошла ошибка при изменении.Попробуйте заново.',
        position: {
          bottom: '0px',
          right: '0px'
        }
      });
    });
  }

  addGroup(group) {
    const dialogRef = this.dialog.open( AddGroupComponent, {
       data: group
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveGroup(result);
      }
    });
  }

  deleteGroup(id) {
    const dialogRef = this.dialog.open(DeleteItemComponent);
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      if (result) {
        this.groupService.deleteGroup(id).subscribe(() => {
          this.loadGroup();
        });
      }
    });
  }

  editGroup(group: Group) {
    const dialogRef = this.dialog.open(AddGroupComponent, {
      data: {
        data: group
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.editGroupJson(result.data);
      }
    });
  }

  async openListOfStudents(groupId) {
    const dialogRef = this.dialog.open(ListOfStudentsComponent, {
      data: {
        data: groupId
      }
    });
    dialogRef.afterClosed();
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
