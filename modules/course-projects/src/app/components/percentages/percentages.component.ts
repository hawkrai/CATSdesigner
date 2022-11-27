import {Component, Input, OnInit} from '@angular/core';
import {Percentage} from '../../models/percentage.model';
import {PercentagesService} from '../../services/percentages.service';
import {CourseUser} from '../../models/course-user.model';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ConfirmDialogComponent} from '../../shared/confirm-dialog/confirm-dialog.component';
import {AddStageDialogComponent} from './add-stage-dialog/add-stage-dialog.component';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-percentages',
  templateUrl: './percentages.component.html',
  styleUrls: ['./percentages.component.less']
})
export class PercentagesComponent implements OnInit {

  @Input() courseUser: CourseUser;

  private COUNT = 1000;
  private PAGE = 1;

  private percentages: Percentage[];

  private subjectId: string;

  constructor(private percentagesService: PercentagesService,
              public dialog: MatDialog,
              private snackBar: MatSnackBar,
              private toastr: ToastrService,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
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
      width: '548px',
      data: {
        title: 'Добавление этапа процентовки'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.name != null) {
        result.name = result.name.replace('\n', '');
        const checkTheme = this.percentages.find((i) => i.Name === result.name);

        if (checkTheme === undefined) {
          const date = new Date(result.date);
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          this.percentagesService.editStage(null, date.toISOString(), this.subjectId, result.name, result.percentage)
            .subscribe(() => {
              this.ngOnInit();
              this.toastr.success('Этап успешно сохранен');
            });
        } else {
          this.toastr.error('Этап с таким названием уже существует');
        }
      }
    });
  }

  editStage(stage: Percentage) {
    const dialogRef = this.dialog.open(AddStageDialogComponent, {
      width: '548px',
      data: {
        title: 'Редактирование этапа',
        name: stage.Name,
        percentage: stage.Percentage,
        date: stage.Date
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result.name != null) {
        result.name = result.name.replace('\n', '');
        const checkTheme = this.percentages.find((i) => i.Name === result.name && i.Percentage === +result.percentage);
        if (checkTheme === undefined) {
          const date = new Date(result.date);
          date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
          this.percentagesService.editStage(stage.Id, date.toISOString(), this.subjectId, result.name, result.percentage)
            .subscribe(() => {
              this.ngOnInit();
              this.toastr.success('Этап успешно изменен');
            });
        } else {
          this.toastr.error('Этап с таким названием уже существует');
        }
      }
    });
  }

  deleteStage(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      autoFocus: false,
      width: '548px',
      data: {
        label: 'Удаление этапа процентовки',
        message: 'Вы действительно хотите удалить этап?',
        actionName: 'Удалить',
        color: 'primary'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && result) {
        this.percentagesService.deleteStage(id).subscribe(() => {
          this.ngOnInit();
          this.toastr.success('Этап успешно удален');

        });
      }
    });
  }
}
