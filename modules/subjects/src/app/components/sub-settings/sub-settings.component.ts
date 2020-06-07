import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {SubgroupingComponent} from '../subgrouping/subgrouping.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {SubjectManagementComponent} from '../subject-managment/subject-management.component';

@Component({
  selector: 'sub-group-page',
  templateUrl: './sub-settings.component.html',
  styleUrls: ['./sub-settings.component.less']
})
export class SubSettingsComponent implements OnInit {

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {      
  }

  supgrouping() {
    const dialogRef = this.openDialog(null, SubgroupingComponent);
    let that = this;
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        
      }
    });
  }

  subjectEdit() {
    const dialogRef = this.openDialog(null, SubjectManagementComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
