import { first, map } from 'rxjs/operators';
import { Observable, combineLatest, VirtualTimeScheduler } from 'rxjs';
import {Store} from '@ngrx/store';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import {MatOptionSelectionChange} from '@angular/material/core';

import {Group} from '../../models/group.model';
import * as subjectSelectors from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import * as groupActions from '../../store/actions/groups.actions';
import * as groupSelectors from '../../store/selectors/groups.selectors';
import * as practicalsActions from '../../store/actions/practicals.actions';
import { Help } from 'src/app/models/help.model';
import { SubdivisionComponent } from 'src/app/shared/subdivision/subdivision.component';
import { DialogService } from 'src/app/services/dialog.service';
import { TranslatePipe } from 'educats-translate';

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
    private translate: TranslatePipe,
    private dialogService: DialogService
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
    this.state$ = combineLatest(
      this.store.select(groupSelectors.getGroups), 
      this.store.select(groupSelectors.getCurrentGroup), 
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(groupSelectors.isActiveGroup))
    .pipe(map(([groups, group, isTeacher, isActive]) => ({ groups, group, isTeacher, detachedGroup: !isActive })));

    this.store.select(subjectSelectors.isTeacher).pipe(
      first()
    ).subscribe(isTeacher => {
      if (isTeacher) {
        this.store.dispatch(groupActions.loadGroups());
      } else {
        this.store.dispatch(groupActions.loadStudentGroup());
      }
    });
  }

  groupStatusChange(event) {
    this.store.dispatch(groupActions.setActiveState({ isActive: !event.checked }));

  }

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.store.dispatch(groupActions.setCurrentGroupById({ id: event.source.value }));
    }
  }

  visitingHelp: Help = {
    message: this.translate.transform('text.help.visit.statistic', 'Нажмите 2 раза на ячейку напротив любого студента в нужную дату, чтобы отметить посещаемость и оставить комментарии.'), 
    action: this.translate.transform('button.understand','Понятно')
  };

  getVisitingExcelFile(): void {
    this.store.dispatch(practicalsActions.getVisitingExcel());
  }

  resultsHelp: Help = {
    message: this.translate.transform ('text.help.results','Нажмите 2 раза на ячейку напротив любого студента в нужную дату, чтобы выставить оценку.'), 
    action: this.translate.transform ('button.understand','Понятно')
  };

  protectionScheduleHelp: Help = {
    message: this.translate.transform ('text.help.practicals.protection.schedule','Нажмите на кнопку "Управление датами", чтобы добавить или удалить даты практических занятий.'),
    action: this.translate.transform ('button.understand','Понятно')
  }

  getResultsExcelFile(): void {
    this.store.dispatch(practicalsActions.getMarksExcel());
  }
  
  subdivision() {
    this.dialogService.openDialog(SubdivisionComponent);
  }
}
