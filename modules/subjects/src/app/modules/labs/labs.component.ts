import { Observable, combineLatest } from 'rxjs';
import { Component, EventEmitter, OnInit, OnDestroy } from '@angular/core';
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

  public refreshJobProtection = new EventEmitter();

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

  groupStatusChange(event) {
    this.detachedGroup = event.checked;
    this.loadGroup()
  }

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.store.dispatch(groupsActions.setCurrentGroupById({ id: event.source.value }));
      this.store.dispatch(labsActions.loadLabsSchedule());
    }
  }

  downloadAll(group: Group, subjectId: number) {
    location.href = 'http://localhost:8080/Subject/GetZipLabs?id=' +  group.GroupId + '&subjectId=' + subjectId;
  }

  getExcelFile(group: Group, subjectId: number): void {
    if (!group) {
      return;
    }
    const url = 'http://localhost:8080/Statistic/';
    if (this.selectedTab === 2) {
      location.href = url + 'GetVisitLabs?subjectId=' +  subjectId + '&groupId=' + group.GroupId +
        '&subGroupOneId=' + group.subGroupsOne.SubGroupId + '&subGroupTwoId=' + group.subGroupsTwo.SubGroupId;
    } else if (this.selectedTab === 3) {
      location.href = url + 'GetLabsMarks?subjectId=' +  subjectId + '&groupId=' + group.GroupId;
    }
  }

  _refreshJobProtection() {
    this.refreshJobProtection.emit(new Date());
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
