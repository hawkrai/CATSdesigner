import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import {Store} from '@ngrx/store';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatOptionSelectionChange} from '@angular/material/core';

import {Group} from '../../models/group.model';
import * as subjectSelectors from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import * as groupActions from '../../store/actions/groups.actions';
import * as groupSelectors from '../../store/selectors/groups.selectors';

interface State {
  groups: Group[];
  group: Group;
  isTeacher: boolean;
}

@Component({
  selector: 'app-practical',
  templateUrl: './practical.component.html',
  styleUrls: ['./practical.component.less']
})
export class PracticalComponent implements OnInit, OnDestroy {

  tabs = ['Практические занятия', 'График защиты', 'Статистика посещения', 'Результаты']

  state$: Observable<State>;
  public detachedGroup = false;

  constructor(private store: Store<IAppState>) { }
  selectedTab = 0;

  
  ngOnDestroy(): void {
    this.store.dispatch(groupActions.resetGroups());
  }

  ngOnInit(): void {
    this.loadGroup();
    this.state$ = combineLatest(
      this.store.select(groupSelectors.getGroups), 
      this.store.select(groupSelectors.getCurrentGroup), 
      this.store.select(subjectSelectors.isTeacher))
    .pipe(map(([groups, group, isTeacher]) => ({ groups, group, isTeacher })));
  }

  loadGroup(): void {
    if (this.detachedGroup) {
      this.store.dispatch(groupActions.loadOldGroups());
    } else {
      this.store.dispatch(groupActions.loadGroups());
    }
  }

  groupStatusChange(event) {
    this.detachedGroup = event.checked;
    this.loadGroup()
  }

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.store.dispatch(groupActions.setCurrentGroupById({ id: event.source.value }));
    }
  }

}
