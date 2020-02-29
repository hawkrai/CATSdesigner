import { Component, OnInit } from '@angular/core';
import {Lecture} from "../../models/lecture.model";
import {Group} from "../../models/group.model";
import {GroupsService} from "../../services/groups.service";
import {ActivatedRoute} from "@angular/router";
import {MatOptionSelectionChange} from "@angular/material/core";

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

  constructor(private groupsService: GroupsService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;

    this.groupsService.getAllGroups(this.subjectId).subscribe(res => {
      this.groups = res;
      console.log(res);
    });
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectedGroup = this.groups.find(res => res.groupId === event.source.value);
    }
  }

}
