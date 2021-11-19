import { DialogService } from './../../services/dialog.service';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import {Store} from '@ngrx/store';
import { map } from 'rxjs/operators';

import * as subjectSelectors from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import * as groupsSelectors from '../../store/selectors/groups.selectors';
import * as groupsActions from '../../store/actions/groups.actions';
import {Group} from '../../models/group.model';
import {CheckPlagiarismPopoverComponent} from '../../shared/check-plagiarism-popover/check-plagiarism-popover.component';

import * as labsActions from '../../store/actions/labs.actions';
import * as labsSelectors from '../../store/selectors/labs.selectors';
import { MatOptionSelectionChange, MatSlideToggleChange } from '@angular/material';
import { HasJobProtection } from 'src/app/models/job-protection/has-job-protection.model';
import { HasGroupJobProtection } from 'src/app/models/job-protection/has-group-job-protection.model';
import { Help } from 'src/app/models/help.model';
import { SubdivisionComponent } from 'src/app/shared/subdivision/subdivision.component';
import { TranslatePipe } from 'educats-translate';
import { ActivatedRoute, Router } from '@angular/router';

interface State {
  groups: Group[];
  subjectId: number;
  hasJobProtections: HasJobProtection[];
  detachedGroup: boolean;
  isTeacher: boolean;
  group: Group;
}

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.less']
})
export class LabsComponent implements OnInit {

  tabs: { tab: string, route: string }[] = [];
  public state$: Observable<State>;

  constructor(
    private dialogService: DialogService,
    private translate: TranslatePipe,
    private store: Store<IAppState>,
    public router: Router,
    private route: ActivatedRoute) {}

  ngOnInit() {
    this.tabs = [
      { tab: this.translate.transform('text.subjects.labs.plural', 'Лабораторные работы'), route: 'list' },
      { tab: this.translate.transform('schedule.protection', 'График защиты'), route: 'schedule' },
      { tab: this.translate.transform('visit.statistics', 'Статистика посещения'), route: 'visit-statistics' },
      { tab: this.translate.transform('results', 'Результаты'), route: 'results' },
      { tab: this.translate.transform('works.protection', 'Защита работ'), route: 'job-protection' }
    ];

    this.state$ = combineLatest(
      this.store.select(groupsSelectors.getGroups),
      this.store.select(subjectSelectors.getSubjectId),
      this.store.select(labsSelectors.hasJobProtections),
      this.store.select(groupsSelectors.isActiveGroup),
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(groupsSelectors.getCurrentGroup)
      ).pipe(
        map(([groups, subjectId, hasJobProtections, isActive, isTeacher, group]) => ({ groups, subjectId, hasJobProtections, detachedGroup: !isActive, isTeacher, group })),
      );

  }

  groupHasJobProtection(hasGroupJobProtection: HasGroupJobProtection[], group: Group): boolean {
    const hasJobProtection = hasGroupJobProtection.find(x => group &&  x.GroupId === group.GroupId);
    return hasJobProtection ? hasJobProtection.HasJobProtection : false;
  }

  groupStatusChange(event: MatSlideToggleChange): void {
    this.store.dispatch(groupsActions.setActiveState({ isActive: !event.checked }))
  }

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.router.navigate([], { relativeTo: this.route, queryParams: { groupId: event.source.value }, queryParamsHandling: 'merge' });
    }
  }


  downloadAll() {
    this.store.dispatch(labsActions.getLabsAsZip());
  }

  getVisitingExcelFile(): void {
    this.store.dispatch(labsActions.getVisitingExcel());
  }

  getResultsExcelFile(): void {
    this.store.dispatch(labsActions.getMarksExcel());
  }

  refreshJobProtection() {
    this.store.dispatch(labsActions.refreshJobProtection());
  }

  checkPlagiarism() {
    this.dialogService.openDialog(CheckPlagiarismPopoverComponent);
  }

  visitingHelp: Help = {
    message: this.translate.transform('text.help.visit.statistic', 'Нажмите 2 раза на ячейку напротив любого студента в нужную дату, чтобы отметить посещаемость и оставить комментарии.'), 
    action: this.translate.transform('button.understand','Понятно')
  };

  resultsHelp: Help = {
    message: this.translate.transform ('text.help.results','Нажмите 2 раза на ячейку напротив любого студента в нужную дату, чтобы выставить оценку.'), 
    action: this.translate.transform ('button.understand','Понятно')
  }

  protectionScheduleHelp: Help = {
    message: this.translate.transform ('text.help.labs.protection.schedule','Нажмите на кнопку "Управление датами", чтобы добавить или удалить даты лабораторных занятий.'),
    action: this.translate.transform ('button.understand','Понятно')
  }

  subdivision() {
    this.dialogService.openDialog(SubdivisionComponent);
  }
}
