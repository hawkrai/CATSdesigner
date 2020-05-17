import {Component, OnInit} from '@angular/core';
import {Group} from "../../models/group.model";
import {MatOptionSelectionChange} from "@angular/material/core";
import {select, Store} from '@ngrx/store';
import {getSubjectId, getUser} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';
import {GroupsService} from '../../services/groups/groups.service';
import {getCurrentGroup} from '../../store/selectors/groups.selectors';
import {filter} from 'rxjs/operators';
import {DownloadsServer} from '../../services/downloads.server';
import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.less']
})
export class LabsComponent implements OnInit {

  public tab = 1;
  public groups: Group[];
  public selectedGroup: Group;

  private subjectId: string;
  public teacher = false;

  constructor(private groupsService: GroupsService,
              private downloadsServer: DownloadsServer,
              private store: Store<IAppState>) {
  }

  ngOnInit() {
    this.store.pipe(select(getUser)).subscribe(user => {
      if (user && user.role.toLowerCase() === 'lector') {
        this.teacher = true;
      }
    });
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.groupsService.getAllGroups().subscribe(res => {
        this.groups = res;
        console.log(res)
      });
    });
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.groupId === event.source.value);
      this.groupsService.setCurrentGroup(this.selectedGroup);
    }
  }

  getExcelFile() {
    this.store.pipe(select(getCurrentGroup))
      .pipe(
        filter(group => !!group)
      )
      .subscribe(group => {

        if (this.tab === 3) {
          this.downloadsServer.getVisitLabsExcel(this.subjectId, group.groupId, group.subGroupsOne.subGroupId,
            group.subGroupsTwo.subGroupId).subscribe(res => this.downLoadFile(res, "application/vnd.ms-excel"));
        } else if (this.tab === 4) {

        }
      });
  }

  downLoadFile(data: any, type: string) {
    // var FileSaver = require('file-saver');
    const blob = new Blob([data._body], { type: type});
    const file = new File([blob], 'LabVisiting.xlsx',
      { type: type});

    FileSaver.saveAs(file);
    // let blob = new Blob([data], { type: type});
    // let url = window.URL.createObjectURL(blob);
    // let pwa = window.open(url);
    // if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
    //   alert( 'Please disable your Pop-up blocker and try again.');
    // }
  }

}
