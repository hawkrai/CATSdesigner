import { MatOptionSelectionChange } from '@angular/material';
import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Store} from '@ngrx/store';

import * as subjectSelectors from '../../store/selectors/subject.selector';
import * as groupsSelectors from '../../store/selectors/groups.selectors';
import * as groupsActions from '../../store/actions/groups.actions';
import * as lecturesActions from '../../store/actions/lectures.actions';
import {IAppState} from '../../store/state/app.state';
import { Group } from 'src/app/models/group.model';
import { TranslatePipe } from '../../../../../../container/src/app/pipe/translate.pipe';


@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.less']
})
export class LecturesComponent implements OnInit, OnDestroy {

  selectedTab = 0;
  state$: Observable<{ isTeacher: boolean, subjectId: number, groups: Group[], groupId: number }>;
  tabs: string[] = [];

  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe
    ) {

  }
  ngOnDestroy(): void {
    this.store.dispatch(groupsActions.resetGroups());
  }

  selectTab(tab: number): void {
    this.selectedTab = tab;
  }

  ngOnInit() {
    this.tabs = [
      this.translate.transform('text.lectures.plural', 'Лекции'), 
      this.translate.transform('text.subjects.lectures.attending', 'Посещение лекций')
    ];
    this.store.dispatch(groupsActions.loadGroups());
    const isTeacher$ = this.store.select(subjectSelectors.isTeacher);
    const subjectId$ = this.store.select(subjectSelectors.getSubjectId);
    const groups$ = this.store.select(groupsSelectors.getGroups);
    const selectedGroupId$ = this.store.select(groupsSelectors.getCurrentGroupId);
    this.state$ = combineLatest(isTeacher$, subjectId$, groups$, selectedGroupId$).pipe(
      map(([isTeacher, subjectId, groups, groupId]) => ({ isTeacher, subjectId, groups, groupId }))
    );
  }

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.store.dispatch(groupsActions.setCurrentGroupById({ id: event.source.value }));
    }
  }

  getExcelFile() {
    this.store.dispatch(lecturesActions.getVisitingExcel());
  }
}
