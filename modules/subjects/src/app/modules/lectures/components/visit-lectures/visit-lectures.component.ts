import { Component, Input, OnInit } from '@angular/core';
import {MatOptionSelectionChange} from "@angular/material/core";
import {ActivatedRoute} from "@angular/router";
import { Calendar } from '../../../../models/calendar.model';
import { GroupsRestService } from "../../../../services/groups/groups-rest.service";
import { LecturesService } from "../../../../services/lectures.service";
import {Group} from "../../../../models/group.model";
import {GroupsVisiting} from "../../../../models/groupsVisiting.model";
import {GroupsService} from '../../../../services/groups/groups.service';
import {DialogData} from '../../../../models/dialog-data.model';
import {LecturePopoverComponent} from '../lecture-popover/lecture-popover.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {VisitDatePopoverComponent} from '../../../../shared/visit-date-popover/visit-date-popover.component';
import {ComponentType} from '@angular/cdk/typings/portal';

@Component({
  selector: 'app-visit-lectures',
  templateUrl: './visit-lectures.component.html',
  styleUrls: ['./visit-lectures.component.less']
})
export class VisitLecturesComponent implements OnInit {

  @Input()  subjectId: string;
  @Input() teacher: boolean;

  public calendar: Calendar[];
  public groups: Group[];
  public groupsVisiting: GroupsVisiting;
  public displayedColumns: string[] = ['position', 'name'];
  public newDate: string;
  public dateToDelete: Calendar;

  constructor(private groupsService: GroupsService,
              private lecturesService: LecturesService,
              public dialog: MatDialog,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.groupsService.getAllGroups().subscribe(res => {
      this.groups = res;
      console.log(res);
    });

    this.refreshData();

  }

  refreshData() {
    this.lecturesService.getCalendar(this.subjectId).subscribe(res => {
      this.calendar = res;
      this.displayedColumns = [...this.displayedColumns, ...this.calendar.map(res => res.date.toString() + res.id)];
      console.log(res)
    });
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.lecturesService.getLecturesMarkVisiting(this.subjectId, event.source.value).subscribe(res => {
        this.groupsVisiting = res ? res[0] : null;
      })
    }
  }

  settingVisitDate() {
    const dialogData: DialogData = {
      title: 'График посещения',
      buttonText: 'Добавить',
      body: {service: this.lecturesService, subjectId: this.subjectId},
      model: this.calendar
    };
    const dialogRef = this.openDialog(dialogData, VisitDatePopoverComponent);
    console.log(dialogRef)
    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      if (result) {
        console.log(result)
      }
    });
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
