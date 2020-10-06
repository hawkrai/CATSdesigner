import {Component, OnInit} from '@angular/core';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {Store} from '@ngrx/store';
import {Router} from '@angular/router';
import {Observable} from 'rxjs';

import * as subjectActions from '../../store/actions/subject.actions';
import {Subject} from '../../models/subject.model';
import {IAppState} from '../../store/state/app.state';
import {DeletePopoverComponent} from '../../shared/delete-popover/delete-popover.component';
import {SubjectLectorComponent} from './subject-lector/subject-lector.component';
import {SubjectService} from '../../services/subject.service';
import {SubjectManagementComponent} from './subject-managment/subject-management.component';
import {DialogData} from '../../models/dialog-data.model';
import * as subjectSelectors from '../../store/selectors/subject.selector';
import { tap } from 'rxjs/operators';
import {SubjectForm} from '../../models/subject-form.model';


@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit {
  subjects$: Observable<Subject[]>;
  public displayedColumns = ['name', 'shortName', 'actions'];

  constructor(
              private store: Store<IAppState>,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.store.dispatch(subjectActions.loadSubjects());
    this.subjects$ = this.store.select(subjectSelectors.getSubjects);
  }


  constructorSubject(subjectId?) {
    const dialogData: DialogData = {
      model: {subjectId: subjectId}
    };
    const dialogRef = this.openDialog(dialogData, SubjectManagementComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(subjectActions.saveSubject({ subject: result as SubjectForm }));
      }
    });
  }

  lector(subjectId: string) {
    const dialogData: DialogData = {
      title: 'Присоединение преподавателя к предмету',
      model: {subjectId: subjectId}
    };
    this.openDialog(dialogData, SubjectLectorComponent);
  }

  deleteSubject(subject : Subject) {
    const dialogData: DialogData = {
      title: 'Удаление предмета',
      body: `предмет "${subject.DisplayName}"`,
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.store.dispatch(subjectActions.deleteSubject({ id: subject.SubjectId }))
      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  setSubject(subject: Subject): void {
    if (subject && subject.SubjectId) {
      this.store.dispatch(subjectActions.setSubjectId({ id: subject.SubjectId }));
      localStorage.setItem('currentSubject', JSON.stringify(subject));
      this.router.navigate(['/news']);
    }
  }

}
