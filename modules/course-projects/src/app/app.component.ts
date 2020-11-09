import {Component, OnInit} from '@angular/core';
import {IAppState} from './store/state/app.state';
import {select, Store} from '@ngrx/store';
import {MatOptionSelectionChange} from '@angular/material';
import {getSubjectId} from './store/selectors/subject.selector';
import {CourseUser} from './models/course-user.model';
import {CourseUserService} from './services/course-user.service';
import {GroupService} from './services/group.service';
import {ProjectGroupService} from './services/project-group.service';
import {Observable} from 'rxjs';
import { CoreGroup } from './models/core-group.model';

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
      this.retrieveGroups(false);
    });
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
    //const url = 'http://localhost:8080/Statistic/';

    if (this.tab === 4) {
      location.href = location.origin + '/Statistic/GetPercentageCP?subjectId=' + this.subjectId + '&groupId=' + this.selectedGroup.GroupId;
    } else if (this.tab === 5) {
      location.href = location.origin + '/Statistic/GetVisitCP?subjectId=' + this.subjectId + '&groupId=' + this.selectedGroup.GroupId;
    }
  }

  downloadArchive() {
    //const url = 'http://localhost:8080/Cp/';
    location.href = location.origin + '/Cp/GetZipTaskSheet?id=' + this.selectedGroup.GroupId + '&subjectId=' + this.subjectId;
  }

}
