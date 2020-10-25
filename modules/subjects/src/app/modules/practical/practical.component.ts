import { Observable } from 'rxjs';
import * as subjectSelectors from '../../store/selectors/subject.selector';
import { Component, OnInit } from '@angular/core';
import {MatOptionSelectionChange} from '@angular/material/core';
import {Group} from '../../models/group.model';
import {GroupsService} from '../../services/groups/groups.service';
import {select, Store} from '@ngrx/store';
import {IAppState} from '../../store/state/app.state';

@Component({
  selector: 'app-practical',
  templateUrl: './practical.component.html',
  styleUrls: ['./practical.component.less']
})
export class PracticalComponent implements OnInit {

  tabs = ['Практические занятия', 'Статистика посещения', 'Результаты']
  public groups: Group[];
  public selectedGroup: Group;

  private subjectId: number;
  isTeacher$: Observable<boolean>;
  public detachedGroup = false;

  constructor(private groupsService: GroupsService,
              private store: Store<IAppState>) { }

  ngOnInit(): void {
    this.groupsService.loadDate();
    this.isTeacher$ = this.store.select(subjectSelectors.isTeacher);
    this.store.pipe(select(subjectSelectors.getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.loadGroup();
    });
  }

  loadGroup(): void {
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
