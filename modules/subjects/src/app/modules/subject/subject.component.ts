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
import {SubSink} from 'subsink';


@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit {
  subjects$: Observable<Subject[]>;
  private subs = new SubSink();
  public displayedColumns = ['name', 'shortName', 'actions'];

  constructor(
              private subjectService: SubjectService,
              private store: Store<IAppState>,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.refreshSubjects();
  }

  refreshSubjects(): void {
    this.subjects$ = this.subjectService.getSubjects();
  }


  constructorSubject(subjectId?) {
    const dialogData: DialogData = {
      model: { subjectId }
    };
    const dialogRef = this.openDialog(dialogData, SubjectManagementComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subs.add(
          this.subjectService.saveSubject(result).subscribe(() => this.refreshSubjects())
        )
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
        this.subs.add(
          this.subjectService.deleteSubjects(subject.SubjectId).subscribe(
            () => this.refreshSubjects())
        );
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

  navigateToSubject(subjectId: number): void {
    // window.location.href = `/web/viewer/subject/${subjectId}`;
  }
}
