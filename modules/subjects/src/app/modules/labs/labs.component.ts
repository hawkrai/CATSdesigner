import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group.model";
import {MatOptionSelectionChange} from "@angular/material/core";
import {select, Store} from '@ngrx/store';
import {getSubjectId, getUser} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {GroupsService} from '../../services/groups/groups.service';
import {getCurrentGroup} from '../../store/selectors/groups.selectors';
import {filter} from 'rxjs/operators';
import {DownloadsServer} from '../../services/downloads.server';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.less']
})
export class LabsComponent implements OnInit {

  public tab = 1;
  public groups: Group[];
  public selectedGroup: Group;

  private subjectId: string;
  public teacher = false;
  public detachedGroup = false;

  constructor(private groupsService: GroupsService,
              private downloadsServer: DownloadsServer,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getUser)).subscribe(user => {
      if (user && user.role.toLowerCase() === 'lector') {
        this.teacher = true;
      }
    });
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.loadGroup();
    });
  }

  loadGroup() {
    if (this.detachedGroup) {
      this.groupsService.getAllOldGroups(this.subjectId).subscribe(res => {
        this.groups = res;
        this.groupsService.setCurrentGroup(res[0]);
        console.log('old', res)
      });
    } else {
      this.groupsService.getAllGroups().subscribe(res => {
        this.groups = res;
        this.groupsService.setCurrentGroup(res[0]);
        console.log(res)
      });
    }
  }

  groupStatusChange(event) {
    this.detachedGroup = event.checked;
    this.loadGroup()
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.groupId === event.source.value);
      this.groupsService.setCurrentGroup(this.selectedGroup);
    }
  }

  getExcelFile() {
    this.store.pipe(select(getCurrentGroup))
      .pipe(
        filter(group => !!group)
      )
      .subscribe(group => {
        const url = 'http://localhost:8080/Statistic/';
        if (this.tab === 3) {
          location.href = url + 'GetVisitLabs?subjectId=' +  this.subjectId + '&groupId=' + group.groupId +
            '&subGroupOneId=' + group.subGroupsOne.subGroupId + '&subGroupTwoId=' + group.subGroupsTwo.subGroupId;
        } else if (this.tab === 4) {
          location.href = url + 'GetLabsMarks?subjectId=' +  this.subjectId + '&groupId=' + group.groupId;
        }
      });
  }


}
