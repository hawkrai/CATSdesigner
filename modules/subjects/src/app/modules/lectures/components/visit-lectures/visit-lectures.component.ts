import { Component, Input, OnInit } from '@angular/core';
import {MatOptionSelectionChange} from "@angular/material/core";
import {ActivatedRoute} from "@angular/router";
import { Calendar } from '../../../../models/calendar.model';
import { GroupsService } from "../../../../services/groups.service";
import { LecturesService } from "../../../../services/lectures.service";
import {Group} from "../../../../models/group.model";
import {GroupsVisiting} from "../../../../models/groupsVisiting.model";

@Component({
  selector: 'app-visit-lectures',
  templateUrl: './visit-lectures.component.html',
  styleUrls: ['./visit-lectures.component.less']
})
export class VisitLecturesComponent implements OnInit {

  public calendar: Calendar[];
  public groups: Group[];
  public groupsVisiting: GroupsVisiting;
  public displayedColumns: string[] = ['position', 'name'];

  private subjectId: string;

  constructor(private groupsService: GroupsService,
              private lecturesService: LecturesService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;

    this.groupsService.getAllGroups(this.subjectId).subscribe(res => {
      this.groups = res;
      console.log(res);
    });


    this.lecturesService.getCalendar(this.subjectId).subscribe(res => {
      this.calendar = res;
      this.displayedColumns = [...this.displayedColumns, ...this.calendar.map(res => res.date.toString())];
      console.log(res)
      console.log(this.displayedColumns)
    });
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    console.log(event);
    if (event.isUserInput) {
      this.lecturesService.getLecturesMarkVisiting(this.subjectId, event.source.value).subscribe(res => {
        this.groupsVisiting = res ? res[0] : null;
        console.log(res)
      })
    }
  }

}
