import {Component, OnInit} from '@angular/core';
import {SubjectService} from '../../services/subject.service';
import {SubjectManagementComponent} from './subject-managment/subject-management.component';
import {DialogData} from '../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeletePopoverComponent} from '../../shared/delete-popover/delete-popover.component';
import {SubjectLectorComponent} from './subject-lector/subject-lector.component';
import {SetSubject} from '../../store/actions/subject.actions';
import {Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {Router} from '@angular/router';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less']
})
export class SubjectComponent implements OnInit {

  public subjects;
  public displayedColumns = ['name', 'shortName', 'actions'];

  constructor(private subjectService: SubjectService,
              private store: Store<IAppState>,
              private router: Router,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.refreshDate();
  }

  refreshDate() {
    this.subjectService.getSubjects().subscribe(res => {
      this.subjects = res;
    })
  }

  constructorSubject(subjectId?) {
    const dialogData: DialogData = {
      model: {subjectId: subjectId}
    };
    const dialogRef = this.openDialog(dialogData, SubjectManagementComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.refreshDate();
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

  deleteSubject(subject) {
    const dialogData: DialogData = {
      title: 'Удаление предмета',
      body: 'предмет "' + subject.DisplayName + '"',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectService.deleteSubjects(subject.SubjectId)
          .subscribe(() => this.refreshDate());
      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

  setSubject(subject) {
    const currentSubject = {id: subject.SubjectId, Name: subject.DisplayName};
    if (currentSubject.id) {
      this.store.dispatch(new SetSubject(currentSubject));
      localStorage.setItem('currentSubject', JSON.stringify(currentSubject));
      this.router.navigate(['/news']);
    }
  }

}
