import { Component, OnInit } from '@angular/core';
import { IAppState } from './store/state/app.state';
import { select, Store } from '@ngrx/store';
import { MatOptionSelectionChange } from '@angular/material';
import { getSubjectId } from './store/selectors/subject.selector';
import { CourseUser } from './models/course-user.model';
import { CourseUserService } from './services/course-user.service';
import { GroupService } from './services/group.service';
import { ProjectGroupService } from './services/project-group.service';
import { Observable } from 'rxjs';
import { CoreGroup } from './models/core-group.model';
import { switchMap } from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {

  public tab = 1;
  public groups: CoreGroup[];
  public selectedGroup: CoreGroup;
  public detachedGroup = false;
  groupNumber: number;

  private subjectId: string;
  public courseUser: CourseUser;

  constructor(private courseUserService: CourseUserService,
    private groupService: GroupService,
    private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.tab = Number(localStorage.getItem('courseProject_tab')) || 1;
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;
      this.courseUserService.getUser().pipe(switchMap(res => {
        this.courseUser = res;
        return this.courseUserService.getUserInfo(res.UserId);
      })).subscribe(res => {
        this.groupNumber = res.Group;
      });
      // this.courseUserService.getUser().subscribe(res => this.courseUser = res);
      this.retrieveGroups(false);
    });
  }

  onChangeTab(tabNumber: number): void {
    localStorage.setItem('courseProject_tab', String(tabNumber));
    this.tab = tabNumber;
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.GroupId === event.source.value);
    }
  }

  groupStatusChange(event) {
    this.detachedGroup = event.checked;
    this.retrieveGroups(true);
  }

  retrieveGroups(groupStatusChanged: boolean) {
    if (this.detachedGroup) {
      this.groupService.getDetachedGroups(this.subjectId).subscribe(res => {
        this.processGroupsResponse(res, groupStatusChanged);
      });
    } else {
      this.groupService.getGroups(this.subjectId).subscribe(res => {
        this.processGroupsResponse(res, groupStatusChanged);
      });
    }
  }

  processGroupsResponse(res: any, groupStatusChanged: boolean) {
    this.groups = res.Groups;
    if (this.selectedGroup == null || groupStatusChanged) {
      if (this.groups.length > 0) {
        this.selectedGroup = this.groups[0];
      } else {
        this.selectedGroup = null;
      }
    }
  }

  getExcelFile() {
    // const url = 'http://localhost:8080/Statistic/';

    if (this.tab === 4) {
      location.href = location.origin + '/api/CpStatistic?group=' + this.selectedGroup.GroupId + '&subjectId=' + this.subjectId;
    } else if (this.tab === 5) {
      location.href = location.origin + '/api/CpStatistic?groupId=' + this.selectedGroup.GroupId + '&subjectId=' + this.subjectId;
    }
  }

  downloadArchive() {
    location.href = location.origin + '/api/CPTaskSheetDownload?groupId=' + this.selectedGroup.GroupId + '&subjectId=' + this.subjectId;
  }

}
