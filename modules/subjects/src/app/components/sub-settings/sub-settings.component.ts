import {Component, OnInit} from '@angular/core';
import {SubgroupingComponent} from '../subgrouping/subgrouping.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {SubjectLectorComponent} from '../../modules/subject/subject-lector/subject-lector.component';
import {SubjectManagementComponent} from '../../modules/subject/subject-managment/subject-management.component';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {getSubjectId} from '../../store/selectors/subject.selector';

@Component({
  selector: 'sub-group-page',
  templateUrl: './sub-settings.component.html',
  styleUrls: ['./sub-settings.component.less']
})
export class SubSettingsComponent implements OnInit {

  constructor(public dialog: MatDialog,
              private store: Store<IAppState>) {
  }

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
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      const dialogData: DialogData = {
        model: {subjectId: subjectId}
      };
      this.openDialog(dialogData, SubjectManagementComponent);
    });
  }

  addProfes() {
    const dialogData: DialogData = {
      title: 'Присоединение преподавателя к предмету'
    };
    this.openDialog(dialogData, SubjectLectorComponent);
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
