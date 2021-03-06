import { map } from 'rxjs/operators';
import { Observable, combineLatest, VirtualTimeScheduler } from 'rxjs';
import {Store} from '@ngrx/store';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {MatOptionSelectionChange} from '@angular/material/core';

import {Group} from '../../models/group.model';
import * as subjectSelectors from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import * as groupActions from '../../store/actions/groups.actions';
import * as groupSelectors from '../../store/selectors/groups.selectors';
import { TranslatePipe } from '../../../../../../container/src/app/pipe/translate.pipe';
import * as practicalsActions from '../../store/actions/practicals.actions';

interface State {
  groups: Group[];
  group: Group;
  isTeacher: boolean;
  detachedGroup: boolean;
}

@Component({
  selector: 'app-practical',
  templateUrl: './practical.component.html',
  styleUrls: ['./practical.component.less']
})
export class PracticalComponent implements OnInit, OnDestroy {

  tabs: string[] = []

  state$: Observable<State>;

  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe
    ) { }
  selectedTab = 0;

  
  ngOnDestroy(): void {
    this.store.dispatch(groupActions.resetGroups());
  }

  ngOnInit(): void {
    this.tabs = [
      this.translate.transform('text.subjects.practicals.plural', 'Практические занятия'), 
      this.translate.transform('schedule.protection', 'График защиты'), 
      this.translate.transform('visit.statistics', 'Статистика посещения'),
      this.translate.transform('results', 'Результаты')
    ];
    this.store.dispatch(groupActions.loadGroups());
    this.state$ = combineLatest(
      this.store.select(groupSelectors.getGroups), 
      this.store.select(groupSelectors.getCurrentGroup), 
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(groupSelectors.isActiveGroup))
    .pipe(map(([groups, group, isTeacher, isActive]) => ({ groups, group, isTeacher, detachedGroup: !isActive })));
  }

  groupStatusChange(event) {
    this.store.dispatch(groupActions.setActiveState({ isActive: !event.checked }));

  }

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.store.dispatch(groupActions.setCurrentGroupById({ id: event.source.value }));
    }
  }

  getExcelFile(): void {
    if (this.selectedTab === 2) {
      this.store.dispatch(practicalsActions.getVisitingExcel());
    } else if (this.selectedTab === 3) {
      this.store.dispatch(practicalsActions.getMarksExcel());
    }
  }

}
