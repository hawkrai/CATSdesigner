import {Component, EventEmitter, OnInit} from '@angular/core';
import {Group} from "../../models/group.model";
import {MatOptionSelectionChange} from "@angular/material/core";
import {select, Store} from '@ngrx/store';
import {getSubjectId, getUser} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {GroupsService} from '../../services/groups/groups.service';
import {getCurrentGroup} from '../../store/selectors/groups.selectors';
import {filter} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DialogData} from '../../models/dialog-data.model';
import {ComponentType} from '@angular/cdk/typings/portal';
import {CheckPlagiarismPopoverComponent} from '../../shared/check-plagiarism-popover/check-plagiarism-popover.component';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.less']
})
export class LabsComponent implements OnInit {

  tabs = ['Лабораторные работы', 'График защиты', 'Статистика посещения', 'Результаты', 'Защита работ'];
  tab = 0;
  public groups: Group[];
  public selectedGroup: Group;

  private subjectId: number;
  public teacher = false;
  public detachedGroup = false;

  public refreshJobProtection = new EventEmitter();

  constructor(private groupsService: GroupsService,
              public dialog: MatDialog,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.groupsService.loadDate();

    this.store.pipe(select(getUser)).subscribe(user => {
      if (user && user.role.toLowerCase() === 'lector') {
        this.teacher = true;
      }
    });
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.loadGroup();
    });
  }

  loadGroup() {
    if (this.detachedGroup) {
      this.groupsService.getAllOldGroups(this.subjectId).subscribe(res => {
        this.groups = res;
        this.groupsService.setCurrentGroup(res[0]);
      });
    } else {
      this.groupsService.getAllGroups().subscribe(res => {
        this.groups = res;
        this.groupsService.setCurrentGroup(res[0]);
      });
    }
  }

  groupStatusChange(event) {
    this.detachedGroup = event.checked;
    this.loadGroup()
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.groupId === event.source.value);
      this.groupsService.setCurrentGroup(this.selectedGroup);
    }
  }

  downloadAll() {
    location.href = 'http://localhost:8080/Subject/GetZipLabs?id=' +  this.selectedGroup.groupId + '&subjectId=' + this.subjectId;
  }

  getExcelFile() {
    this.store.pipe(select(getCurrentGroup))
      .pipe(
        filter(group => !!group)
      )
      .subscribe(group => {
        const url = 'http://localhost:8080/Statistic/';
        if (this.tab === 2) {
          location.href = url + 'GetVisitLabs?subjectId=' +  this.subjectId + '&groupId=' + group.groupId +
            '&subGroupOneId=' + group.subGroupsOne.subGroupId + '&subGroupTwoId=' + group.subGroupsTwo.subGroupId;
        } else if (this.tab === 3) {
          location.href = url + 'GetLabsMarks?subjectId=' +  this.subjectId + '&groupId=' + group.groupId;
        }
      });
  }

  _refreshJobProtection() {
    this.refreshJobProtection.emit(new Date());
  }

  checkPlagiarism() {
    const dialogData: DialogData = {
      body: this.subjectId
    };
    this.openDialog(dialogData, CheckPlagiarismPopoverComponent);
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
