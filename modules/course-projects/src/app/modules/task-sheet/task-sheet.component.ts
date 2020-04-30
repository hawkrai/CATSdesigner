import {Component, OnInit} from '@angular/core';
import {Theme} from '../../models/theme.model';
import {ProjectThemeService} from '../../services/project-theme.service';
import {ActivatedRoute} from '@angular/router';
import {TaskSheetService} from '../../services/task-sheet.service';
import {Observable, Subscription} from 'rxjs';
import {CourseUser} from '../../models/course-user.model';
import {CourseUserService} from '../../services/course-user.service';
import {EditTaskSheetComponent} from './edit-task-sheet/edit-task-sheet.component';
import {MatDialog} from '@angular/material';
import {Template} from '../../models/template.model';

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
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.courseUserService.getUser().subscribe(res => this.courseUser = res);
    this.subjectId = this.route.snapshot.params.subjectId;
    this.projectThemeService.getThemes({entity: 'CourseProject', subjectId: this.subjectId})
      .subscribe(res => this.themes = res);

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
        }
      });
    });
  }

  getTemplateList(): Observable<Template[]> {
    return this.taskSheetService.getTemplateList({entity: 'CourseProjectTaskSheetTemplate', subjectId: this.subjectId});
  }

}
