import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {getSubjectId} from '../../../../store/selectors/subject.selector';
import {getCurrentGroup} from '../../../../store/selectors/groups.selectors';
import {MatDialog} from '@angular/material/dialog';
import {IAppState} from '../../../../store/state/app.state';
import {PracticalRestService} from '../../../../services/practical/practical-rest.service';
import {Group} from '../../../../models/group.model';
import {ScheduleProtectionLab} from '../../../../models/lab.model';

@Component({
  selector: 'app-visit-statistic',
  templateUrl: './visit-statistic.component.html',
  styleUrls: ['./visit-statistic.component.less']
})
export class VisitStatisticComponent implements OnInit {

  @Input() isTeacher: boolean;

  private subjectId: number;
  private group: Group;
  student: any[];
  public displayColumn = [];


  constructor(public dialog: MatDialog,
              private store: Store<IAppState>,
              private practicalService: PracticalRestService) { }

  ngOnInit() {
    this.store.pipe(select(getSubjectId)).subscribe(subjectId => {
      this.subjectId = subjectId;

      this.store.pipe(select(getCurrentGroup)).subscribe(group => {
        this.group = group;
        // this.practicalService.loadData();
        
        // this.practicalService.getCalendar().subscribe(res => {
        //   this.scheduleProtection = res;
        // });
        this.displayColumn = [];
        if (this.subjectId && this.group) {
          this.refreshMarks();
        }
      });
    });
  }

  refreshMarks() {
    this.practicalService.getMarks(this.subjectId, this.group.groupId).subscribe(res => {
      this.student = res;
      res && this.setDisplayColumn(res);
    })
  }

  setDisplayColumn(students) {
    this.displayColumn = ['position', 'name'];
    students.forEach(student => {
      this.displayColumn.push(student.PracticalVisitingMarkId + student.Date);
    })
  }

}
