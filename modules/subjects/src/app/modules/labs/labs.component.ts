import { first } from 'rxjs/operators';
import { DialogService } from './../../services/dialog.service';
import { HasJobProtection } from './../../models/has-job-protection.model';
import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatOptionSelectionChange} from "@angular/material/core";
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
import { MatSlideToggleChange } from '@angular/material';
import { TranslatePipe } from '../../../../../../container/src/app/pipe/translate.pipe';

interface State {
  groups: Group[];
  group: Group;
  isTeacher: boolean;
  subjectId: number;
  hasJobProtections: HasJobProtection[]
}

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.less']
})
export class LabsComponent implements OnInit, OnDestroy {

  tabs: string[] = [];
  selectedTab = 0;
  public state$: Observable<State>;
  public detachedGroup = false;

  constructor(
    private dialogService: DialogService,
    private translate: TranslatePipe,
    private store: Store<IAppState>) {
  }
  ngOnDestroy(): void {
    this.store.dispatch(groupsActions.resetGroups());
  }

  ngOnInit() {
    this.tabs = [
      this.translate.transform('text.subjects.labs.plural', 'Лабораторные работы'),
      this.translate.transform('schedule.protection', 'График защиты'),
      this.translate.transform('visit.statistics', 'Статистика посещения'),
      this.translate.transform('results', 'Результаты'),
      this.translate.transform('works.protection', 'Защита работ')
    ];
    this.state$ = combineLatest(
      this.store.select(groupsSelectors.getGroups),
      this.store.select(groupsSelectors.getCurrentGroup),
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(subjectSelectors.getSubjectId),
      this.store.select(labsSelectors.HasJobProtections)
      ).pipe(
        map(([groups, group, isTeacher, subjectId, hasJobProtections]) => ({ groups, group, isTeacher, subjectId, hasJobProtections })),
      );

  
    this.store.select(subjectSelectors.isTeacher).pipe(
      first()
    ).subscribe(isTeacher => {
      if (isTeacher) {
        this.loadGroup();
        this.store.dispatch(labsActions.checkJobProtections());
      } else {
        this.store.dispatch(groupsActions.loadStudentGroup());
      }
    });

  }

  loadGroup(): void {
    if (this.detachedGroup) {
      this.store.dispatch(groupsActions.loadOldGroups());
    } else {
      this.store.dispatch(groupsActions.loadGroups());
    }
  }

  groupStatusChange(event: MatSlideToggleChange): void {
    this.detachedGroup = event.checked;
    this.loadGroup()
  }

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.store.dispatch(groupsActions.setCurrentGroupById({ id: event.source.value }));
    }
  }

  downloadAll() {
    this.store.dispatch(labsActions.getLabsAsZip());
  }

  getExcelFile(): void {
    if (this.selectedTab === 2) {
      this.store.dispatch(labsActions.getVisitingExcel());
    } else if (this.selectedTab === 3) {
      this.store.dispatch(labsActions.getMarksExcel());
    }
  }

  refreshJobProtection() {
    this.store.dispatch(labsActions.refreshJobProtection());
  }

  checkPlagiarism() {
    this.dialogService.openDialog(CheckPlagiarismPopoverComponent);
  }

}
