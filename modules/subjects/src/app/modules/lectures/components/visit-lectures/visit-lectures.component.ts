import { Component, Input, OnInit } from '@angular/core';
import {MatOptionSelectionChange} from "@angular/material/core";
import {ActivatedRoute} from "@angular/router";
import { Calendar } from '../../../../models/calendar.model';
import { GroupsRestService } from "../../../../services/groups/groups-rest.service";
import { LecturesService } from "../../../../services/lectures/lectures.service";
import {Group} from "../../../../models/group.model";
import {GroupsVisiting, LecturesMarksVisiting} from "../../../../models/groupsVisiting.model";
import {GroupsService} from '../../../../services/groups/groups.service';
import {DialogData} from '../../../../models/dialog-data.model';
import {LecturePopoverComponent} from '../lecture-popover/lecture-popover.component';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {VisitDatePopoverComponent} from '../../../../shared/visit-date-popover/visit-date-popover.component';
import {ComponentType} from '@angular/cdk/typings/portal';
import {of} from 'rxjs';
import {DeletePopoverComponent} from '../../../../shared/delete-popover/delete-popover.component';
import {ScheduleProtectionLab} from '../../../../models/lab.model';
import {VisitingPopoverComponent} from '../../../../shared/visiting-popover/visiting-popover.component';

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
  public displayedColumns: string[] = [];
  public selectGroupId: string;

  constructor(private groupsService: GroupsService,
              private lecturesService: LecturesService,
              public dialog: MatDialog) { }

  ngOnInit() {
    this.groupsService.getAllGroups().subscribe(res => {
      this.groups = res;
      console.log(res);
      this.selectGroupId = res[0].groupId;
    });

    this.lecturesService.loadCalendar();
    this.refreshDataCalendar();

  }

  private refreshDataCalendar() {
    this.lecturesService.getCalendar().subscribe(res => {
      this.calendar = res;
      this.displayedColumns = ['position', 'name', ...this.calendar.map(res => res.date.toString() + res.id)];
      this.refreshDataGroupVisitMark();
      console.log(res)
    });
  }

  private refreshDataGroupVisitMark() {
    this.lecturesService.getLecturesMarkVisiting(this.subjectId, this.selectGroupId).subscribe(res => {
      this.groupsVisiting = res ? res[0] : null;
      console.log(res[0])
    })
  }

  _selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.selectGroupId = event.source.value;
      this.refreshDataGroupVisitMark();
    }
  }

  deleteAllDate() {
    const dateIds = [];
    this.calendar.forEach(res => {
      dateIds.push(res.id);
    });
    this.lecturesService.deleteAllDate({dateIds});
  }

  settingVisitDate() {
    const dialogData: DialogData = {
      title: 'График посещения',
      buttonText: 'Добавить',
      body: {service: this.lecturesService, restBody: { subjectId: this.subjectId}},
    };

    this.openDialog(dialogData, VisitDatePopoverComponent);
  }

  deletePopover() {
    const dialogData: DialogData = {
      title: 'Удаление дат',
      body: 'даты и все связанные с ними данные',
      buttonText: 'Удалить'
    };
    const dialogRef = this.openDialog(dialogData, DeletePopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteAllDate();
      }
    });
  }

  setVisitMarks(date, index) {
    const visits = {date: date.date, students: []};
    this.groupsVisiting.lecturesMarksVisiting.forEach(res => {
      const visit = {
        name: res.StudentName,
        mark: res.Marks[index].Mark,
        comment: ''
      };
      visits.students.push(visit);
    });

    const dialogData: DialogData = {
      title: 'Посещаемость студентов',
      buttonText: 'Сохранить',
      body: visits
    };
    const dialogRef = this.openDialog(dialogData, VisitingPopoverComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.lecturesService.setLecturesVisitingDate(
          {lecturesMarks: this.getModelVisitLabs(JSON.parse(JSON.stringify(this.groupsVisiting.lecturesMarksVisiting)), index, result.students)})
      }
    });
  }

  getModelVisitLabs(lecturesMarksVisiting: LecturesMarksVisiting[], index, visits) {
    for (let i = 0; i < visits.length; i++) {
      lecturesMarksVisiting[i].Marks[index].Mark = visits[i].mark ? visits[i].mark.toString() : '';
    }
    return lecturesMarksVisiting
  }

  openDialog(data: DialogData, popover: ComponentType<any>): MatDialogRef<any> {
    return this.dialog.open(popover, {data});
  }

}
