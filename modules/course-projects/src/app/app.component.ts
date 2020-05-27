import {Component, OnInit} from '@angular/core';
import {IAppState} from './store/state/app.state';
import {select, Store} from '@ngrx/store';
import {Group} from './models/group.model';
import {MatOptionSelectionChange} from '@angular/material';
import {getSubjectId} from './store/selectors/subject.selector';
import {CourseUser} from './models/course-user.model';
import {CourseUserService} from './services/course-user.service';
import {GroupService} from './services/group.service';
import {ProjectGroupService} from './services/project-group.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  public tab = 1;
  public groups: Group[];
  public selectedGroup: Group;

  private subjectId: string;
  private courseUser: CourseUser;

  constructor(private courseUserService: CourseUserService,
              private projectGroupService: ProjectGroupService,
              private groupService: GroupService,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.courseUserService.getUser().subscribe(res => this.courseUser = res);

      this.retrieveGroups();
    });
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.Id === event.source.value);
    }
  }

  retrieveGroups() {
    this.projectGroupService.getGroups(this.subjectId).subscribe(res => {
      this.groups = res;
    });
  }

  getExcelFile() {
    const url = 'http://localhost:8080/Statistic/';
    if (this.tab === 4) {
      location.href = url + 'GetPercentageCP?subjectId=' + this.subjectId + '&groupId=' + this.selectedGroup.Id;
    } else if (this.tab === 5) {
      location.href = url + 'GetVisitCP?subjectId=' + this.subjectId + '&groupId=' + this.selectedGroup.Id;
    }
  }

}
