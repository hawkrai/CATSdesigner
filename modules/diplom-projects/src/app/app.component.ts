import {Component, OnInit} from '@angular/core';
import {MatOptionSelectionChange} from '@angular/material';
import {DiplomUser} from './models/diplom-user.model';
import {DiplomUserService} from './services/diplom-user.service';
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

  private diplomUser: DiplomUser;

  constructor(private diplomUserService: DiplomUserService,
              private projectGroupService: ProjectGroupService,
              private groupService: GroupService) {
  }

  ngOnInit() {
    this.diplomUserService.getUser().subscribe(res => {this.diplomUser = res; this.retrieveGroups();});
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.GroupId === event.source.value);
    }
  }

  retrieveGroups() {
    this.groupService.getGroupsByUser(this.diplomUser.UserId).subscribe(res => {
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
