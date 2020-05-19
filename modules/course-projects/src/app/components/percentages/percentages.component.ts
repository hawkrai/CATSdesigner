import { Component, OnInit } from '@angular/core';
import {Percentage} from '../../models/percentage.model';
import {PercentagesService} from '../../services/percentages.service';
import {CourseUser} from '../../models/course-user.model';
import {CourseUserService} from '../../services/course-user.service';
import {MatDialog} from '@angular/material';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {AddStageDialogComponent} from './add-stage-dialog/add-stage-dialog.component';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {getSubjectId} from '../../store/selectors/subject.selector';

@Component({
  selector: 'app-percentages',
  templateUrl: './percentages.component.html',
  styleUrls: ['./percentages.component.less']
})
export class PercentagesComponent implements OnInit {

  private COUNT = 1000;
  private PAGE = 1;

  private percentages: Percentage[];

  private courseUser: CourseUser;
  private subjectId: string;

  constructor(private courseUserService: CourseUserService,
              private percentagesService: PercentagesService,
              public dialog: MatDialog,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.courseUserService.getUser().subscribe(res => this.courseUser = res);
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      this.retrievePercentages();
    });
  }

  retrievePercentages() {
    this.percentagesService.getPercentages({
      count: this.COUNT,
      page: this.PAGE,
      filter: '{"subjectId":"' + this.subjectId + '"}',
    })
      .subscribe(res => this.percentages = res.Items);
  }

  public getCourseUser() {
    return this.courseUser;
  }

  addStage() {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      width: '600px',
      data: { }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const date = new Date(result.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        this.percentagesService.editStage(null, date.toISOString(), this.subjectId, result.name, result.percentage)
          .subscribe(res => this.ngOnInit());
      }
    });
  }

  editStage(stage: Percentage) {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      width: '600px',
      data: {
        name: stage.Name,
        percentage: stage.Percentage,
        date: stage.Date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const date = new Date(result.date);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        this.percentagesService.editStage(stage.Id, date.toISOString(), this.subjectId, result.name, result.percentage)
          .subscribe(res => this.ngOnInit());
      }
    });
  }

  deleteStage(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        label: 'Удаление этапа процентовки',
        message: 'Вы действительно хотите удалить этап?',
        actionName: 'Удалить'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.percentagesService.deleteStage({id}).subscribe(res => this.ngOnInit());
      }
    });
  }

}
