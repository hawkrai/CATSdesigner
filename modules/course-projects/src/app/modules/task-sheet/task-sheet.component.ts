import {Component, OnInit} from '@angular/core';
import {Theme} from '../../models/theme.model';
import {ProjectThemeService} from '../../services/project-theme.service';
import {ActivatedRoute} from '@angular/router';
import {TaskSheetService} from '../../services/task-sheet.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-task-sheet',
  templateUrl: './task-sheet.component.html',
  styleUrls: ['./task-sheet.component.less']
})
export class TaskSheetComponent implements OnInit {

  private themes: Theme[];
  private taskSheetHtml: any;
  private taskSheetSubscription: Subscription;

  private subjectId: string;
  private courseProjectId: number;

  constructor(private projectThemeService: ProjectThemeService,
              private taskSheetService: TaskSheetService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;
    this.projectThemeService.getThemes({entity: 'CourseProject', subjectId: this.subjectId})
      .subscribe(res => this.themes = res);

  }

  onThemeChange(themeId: number) {
    this.courseProjectId = themeId;
    if (this.taskSheetSubscription) {
      this.taskSheetSubscription.unsubscribe();
    }
    this.retrieveTaskSheet();
  }

  retrieveTaskSheet() {
    this.taskSheetSubscription = this.taskSheetService.getTaskSheet({courseProjectId: this.courseProjectId})
      .subscribe(res => {
        this.taskSheetHtml = res;
        const div = document.getElementById('task-sheet');
        div.insertAdjacentHTML('afterbegin', res);
      });
  }

}
