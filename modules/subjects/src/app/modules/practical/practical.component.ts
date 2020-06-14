import { Component, OnInit } from '@angular/core';
import {MatOptionSelectionChange} from '@angular/material/core';
import {Group} from '../../models/group.model';
import {GroupsService} from '../../services/groups/groups.service';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';
import {getSubjectId, getUser} from '../../store/selectors/subject.selector';

@Component({
  selector: 'app-practical',
  templateUrl: './practical.component.html',
  styleUrls: ['./practical.component.less']
})
export class PracticalComponent implements OnInit {

  public tab = 1;
  public groups: Group[];
  public selectedGroup: Group;

  private subjectId: string;
  public teacher = false;
  public detachedGroup = false;

  constructor(private groupsService: GroupsService,
              private store: Store<IAppState>) { }

  ngOnInit() {
    this.groupsService.loadDate();
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
      });
    } else {
      this.groupsService.getAllGroups().subscribe(res => {
        this.groups = res;
        this.groupsService.setCurrentGroup(res[0]);
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

}
