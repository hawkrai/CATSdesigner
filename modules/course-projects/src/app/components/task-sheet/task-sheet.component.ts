import {Component, OnInit} from '@angular/core';
import {Theme} from '../../models/theme.model';
import {ProjectThemeService} from '../../services/project-theme.service';
import {TaskSheetService} from '../../services/task-sheet.service';
import {Subscription} from 'rxjs';
import {CourseUser} from '../../models/course-user.model';
import {CourseUserService} from '../../services/course-user.service';
import {EditTaskSheetComponent} from './edit-task-sheet/edit-task-sheet.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {getSubjectId} from '../../store/selectors/subject.selector';

@Component({
  selector: 'app-task-sheet',
  templateUrl: './task-sheet.component.html',
  styleUrls: ['./task-sheet.component.less']
})
export class TaskSheetComponent implements OnInit {

  private themes: Theme[];
  private taskSheetHtml: any;
  private taskSheetSubscription: Subscription;

  private courseUser: CourseUser;
  private subjectId: string;
  private courseProjectId: number;

  constructor(private courseUserService: CourseUserService,
              private projectThemeService: ProjectThemeService,
              private taskSheetService: TaskSheetService,
              private dialog: MatDialog,
              private snackBar: MatSnackBar,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.courseUserService.getUser().subscribe(res => this.courseUser = res);
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      this.projectThemeService.getThemes({entity: 'CourseProject', subjectId: this.subjectId})
        .subscribe(res => {
          this.themes = res;
          if (this.courseProjectId == null) {
            this.courseProjectId = res[0].Id;
          }
          this.retrieveTaskSheetHtml();
        });
    });
  }

  onThemeChange(themeId: number) {
    this.courseProjectId = themeId;
    if (this.taskSheetSubscription) {
      this.taskSheetSubscription.unsubscribe();
    }
    this.retrieveTaskSheetHtml();
  }

  retrieveTaskSheetHtml() {
    this.taskSheetSubscription = this.taskSheetService.getTaskSheetHtml({courseProjectId: this.courseProjectId})
      .subscribe(res => {
        this.taskSheetHtml = res;
        const div = document.getElementById('task-sheet');
        div.innerHTML = res;
      });
  }

  editTaskSheet() {
    this.taskSheetService.getTaskSheet({courseProjectId: this.courseProjectId}).subscribe(response => {
      const dialogRef = this.dialog.open(EditTaskSheetComponent, {
        width: '700px',
        data: {
          subjectId: this.subjectId,
          taskSheet: response
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result != null) {
          this.taskSheetService.editTaskSheet(result).subscribe(() => {
            this.ngOnInit();
            this.snackBar.open('Лист задания успешно сохранен', null, {
              duration: 2000
            });
          });
        }
      });
    });
  }

}
