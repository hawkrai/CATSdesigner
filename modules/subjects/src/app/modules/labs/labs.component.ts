import { Observable, combineLatest } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import {MatOptionSelectionChange} from "@angular/material/core";
import {Store} from '@ngrx/store';
import {ComponentType} from '@angular/cdk/typings/portal';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {map} from 'rxjs/operators';

import * as subjectSelectors from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import * as groupsSelectors from '../../store/selectors/groups.selectors';
import * as groupsActions from '../../store/actions/groups.actions';
import {Group} from '../../models/group.model';
import {DialogData} from '../../models/dialog-data.model';
import {CheckPlagiarismPopoverComponent} from '../../shared/check-plagiarism-popover/check-plagiarism-popover.component';

import * as labsActions from '../../store/actions/labs.actions';
import * as filesActions from '../../store/actions/files.actions';
import { MatSlideToggleChange } from '@angular/material';

interface State {
  groups: Group[];
  group: Group;
  isTeacher: boolean;
  subjectId: number;
}

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.less']
})
export class LabsComponent implements OnInit, OnDestroy {

  tabs = ['Лабораторные работы', 'График защиты', 'Статистика посещения', 'Результаты', 'Защита работ'];
  selectedTab = 0;
  public state$: Observable<State>;
  public detachedGroup = false;

  constructor(
    public dialog: MatDialog,
    private store: Store<IAppState>) {
  }
  ngOnDestroy(): void {
    this.store.dispatch(groupsActions.resetGroups());
  }

  ngOnInit() {
    this.state$ = combineLatest(
      this.store.select(groupsSelectors.getGroups),
      this.store.select(groupsSelectors.getCurrentGroup),
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(subjectSelectors.getSubjectId)
      ).pipe(map(([groups, group, isTeacher, subjectId]) => ({ groups, group, isTeacher, subjectId })));

    this.loadGroup();
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
      this.store.dispatch(labsActions.loadLabsSchedule());
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

  checkPlagiarism(subjectId: number) {
    const dialogData: DialogData = {
      body: subjectId
    };
    this.openDialog(dialogData, CheckPlagiarismPopoverComponent);
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
