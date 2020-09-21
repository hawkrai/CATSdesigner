import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {SubjectManagementComponent} from '../../modules/subject/subject-managment/subject-management.component';
import {SubgroupingComponent} from '../subgrouping/subgrouping.component';


@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.less']
})
export class SideMenuComponent implements OnInit {

  menuElements;
  pageName;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.pageName = window.location.pathname;

    this.menuElements = [
      { name: 'Новости', tab: '/news'},
      { name: 'Лекции', tab: '/lectures'},
      { name: 'Лабораторные работы', tab: '/labs'},
      { name: 'Практические занятия', tab: '/practical'},
      { name: 'Файлы', tab: '/files'},
      { name: 'Настройки', tab: '/settings'},
    ];

  }

  selectedTab(menuElement) {
    this.pageName = menuElement.tab;
  }

  subjectManagement() {
    const dialogRef = this.openDialog(null, SubjectManagementComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  supgrouping() {
    const dialogRef = this.openDialog(null, SubgroupingComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }
}
