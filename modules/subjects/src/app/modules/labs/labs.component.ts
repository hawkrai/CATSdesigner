import { Component, OnInit } from '@angular/core';
import {Lecture} from "../../models/lecture.model";
import {Group} from "../../models/group.model";
import {GroupsRestService} from "../../services/groups/groups-rest.service";
import {ActivatedRoute} from "@angular/router";
import {MatOptionSelectionChange} from "@angular/material/core";
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../store/selectors/subject.selector';
import {IAppState} from '../../store/state/app.state';

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
  public teacher = true;

  constructor(private groupsService: GroupsRestService,
              private store: Store<IAppState>,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.groupsService.getAllGroups(this.subjectId).subscribe(res => {
        this.groups = res;
      });
    });
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.groupId === event.source.value);
    }
  }

}
