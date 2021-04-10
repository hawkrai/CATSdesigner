import { ComponentType } from '@angular/cdk/portal';
import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Store } from '@ngrx/store';
import { DialogData } from 'src/app/models/dialog-data.model';
import { IAppState } from 'src/app/store/state/app.state';
import { SubSink } from 'subsink';
import { SubjectLectorComponent } from '../subject/subject-lector/subject-lector.component';
import { SubjectManagementComponent } from '../subject/subject-managment/subject-management.component';
import {getSubjectId} from '../../store/selectors/subject.selector';
import * as subjectActions from '../../store/actions/subject.actions';
import { SubdivisionComponent } from './components/subdivision/subdivision.component';
import { TranslatePipe } from '../../../../../../container/src/app/pipe/translate.pipe';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less']
})
export class SettingsComponent implements OnInit {

  private subs = new SubSink();
  constructor(
    public dialog: MatDialog,
    private store: Store<IAppState>,
    private translate: TranslatePipe) {
  }

  ngOnInit(): void {
  }

  supgrouping() {
    const dialogRef = this.openDialog(null, SubdivisionComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {

      }
    });
  }

  subjectEdit() {
    this.subs.add(
      this.store.select(getSubjectId).subscribe(subjectId => {
        const dialogData: DialogData = {
          model: {subjectId: subjectId}
        };
        const dialogRef = this.openDialog(dialogData, SubjectManagementComponent);
  
          this.subs.add(
            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.store.dispatch(subjectActions.saveSubject({ subject: result }))
              }
            })
          );
      }));
  }

  addProfes() {
    const dialogData: DialogData = {
      title: this.translate.transform('text.subjects.lector.joining', 'Присоединение преподавателя к предмету') 
    };
    this.openDialog(dialogData, SubjectLectorComponent);
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
