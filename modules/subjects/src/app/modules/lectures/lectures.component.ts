import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {Store} from '@ngrx/store';

import * as subjectSelectors from '../../store/selectors/subject.selector';
import * as groupActions from '../../store/actions/groups.actions';
import {IAppState} from '../../store/state/app.state';
import {GroupsService} from '../../services/groups/groups.service';


@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.less']
})
export class LecturesComponent implements OnInit, OnDestroy {

  selectedTab = 0;
  state$: Observable<{ isTeacher: boolean, subjectId: number }>;
  tabs = ['Лекции', 'Посещение лекций'];

  constructor(private store: Store<IAppState>,
              private groupsService: GroupsService) {
  }
  ngOnDestroy(): void {
    this.store.dispatch(groupActions.resetGroups());
  }

  ngOnInit() {
    this.store.dispatch(groupActions.loadGroups());
    const isTeacher$ = this.store.select(subjectSelectors.isTeacher);
    const subjectId$ = this.store.select(subjectSelectors.getSubjectId);
    this.state$ = combineLatest(isTeacher$, subjectId$).pipe(
      map(([isTeacher, subjectId]) => ({ isTeacher, subjectId }))
    );
  }
}
