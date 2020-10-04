import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';

import * as subjectSelectors from '../../store/selectors/subject.selector';
import {getSubjectId, getUser} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {GroupsService} from '../../services/groups/groups.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.less']
})
export class LecturesComponent implements OnInit {

  selectedTab = 0;
  isTeacher$: Observable<boolean>;
  tabs = ['Лекции', 'Посещение лекций']
  subjectId$: Observable<number>;

  constructor(private store: Store<IAppState>,
              private groupsService: GroupsService,) {
  }

  ngOnInit() {
    this.groupsService.loadDate();
    this.isTeacher$ = this.store.select(subjectSelectors.isUserLector);
    this.subjectId$ = this.store.select(getSubjectId);
  }
}
