import {Component, OnInit} from '@angular/core';
import {MatOptionSelectionChange} from '@angular/material';
import {DiplomUser} from './models/diplom-user.model';
import {CourseUserService} from './services/course-user.service';
import {GroupService} from './services/group.service';
import {ProjectGroupService} from './services/project-group.service';
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

  private courseUser: DiplomUser;

  constructor(private courseUserService: CourseUserService,
              private projectGroupService: ProjectGroupService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.courseUserService.getUser().subscribe(res => {this.courseUser = res; this.retrieveGroups();});
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.GroupId === event.source.value);
    }
  }

  retrieveGroups() {
    this.groupService.getGroupsByUser(this.courseUser.UserId).subscribe(res => {
      this.processGroupsResponse(res);
    });
  }

  processGroupsResponse(res: any) {
    this.groups = res.Groups;
    if (this.selectedGroup == null) {
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
      location.href = location.origin + '/Statistic/GetPercentageCP?groupId=' + this.selectedGroup.GroupId;
    } else if (this.tab === 5) {
      location.href = location.origin + '/Statistic/GetVisitCP?groupId=' + this.selectedGroup.GroupId;
    }
  }

  downloadArchive() {
    location.href = location.origin + '/api/CPTaskSheetDownload?groupId=' + this.selectedGroup.GroupId;
  }

}
