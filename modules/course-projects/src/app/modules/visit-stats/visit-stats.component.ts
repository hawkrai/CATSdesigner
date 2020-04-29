import {Component, OnInit} from '@angular/core';
import {VisitStats} from '../../models/visit-stats.model';
import {ProjectGroupService} from '../../services/project-group.service';
import {ActivatedRoute} from '@angular/router';
import {Group} from '../../models/group.model';
import {VisitStatsService} from '../../services/visit-stats.service';
import {Subscription} from 'rxjs';
import {DownloadVisitCpService} from '../../services/download-visit-cp.service';
import {Consultation} from '../../models/consultation.model';
import {ConsultationMark} from '../../models/consultation-mark.model';
import {CourseUser} from '../../models/course-user.model';
import {CourseUserService} from '../../services/course-user.service';
import {AddDateDialogComponent} from './add-date-dialog/add-date-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-visit-stats',
  templateUrl: './visit-stats.component.html',
  styleUrls: ['./visit-stats.component.less']
})
export class VisitStatsComponent implements OnInit {

  private COUNT = 1000;
  private PAGE = 1;

  private visitStatsSubscription: Subscription;

  private courseUser: CourseUser;
  private visitStatsList: VisitStats[];
  private consultations: Consultation[];
  private groups: Group[];

  private subjectId: string;
  private groupId: number;
  private searchString = '';

  constructor(private courseUserService: CourseUserService,
              private projectGroupService: ProjectGroupService,
              private visitStatsService: VisitStatsService,
              private downloadVisitCpService: DownloadVisitCpService,
              public dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.courseUserService.getUser().subscribe(res => this.courseUser = res);
    this.subjectId = this.route.snapshot.params.subjectId;
    this.projectGroupService.getGroups(this.subjectId).subscribe(res => {
      this.groups = res;
      if (this.groupId == null) {
        this.groupId = this.groups[0].Id;
      }
      this.retrieveVisitStats();
    });
  }

  public getCourseUser() {
    return this.courseUser;
  }

  retrieveVisitStats() {
    this.visitStatsSubscription = this.visitStatsService.getVisitStats({
      count: this.COUNT, page: this.PAGE,
      filter: '{"groupId":' + this.groupId + ',"subjectId":' + this.subjectId + ',"searchString":"' + this.searchString + '"}'
    })
      .subscribe(res => {
        this.visitStatsList = this.assignResults(res.Students.Items, res.CourseProjectConsultationDates);
        this.consultations = res.CourseProjectConsultationDates;
      });
  }

  onSearchChange(searchText: string) {
    this.searchString = searchText;
    this.updateStats();
  }

  onGroupChange(groupId: number) {
    this.groupId = groupId;
    this.updateStats();
  }

  updateStats() {
    if (this.visitStatsSubscription) {
      this.visitStatsSubscription.unsubscribe();
    }
    this.retrieveVisitStats();
  }

  downloadExcel() {
    this.downloadVisitCpService.download({subjectId: this.subjectId, groupId: this.groupId}).subscribe(
      res => {

      }
    );
  }

  assignResults(visitStats: VisitStats[], consultations: Consultation[]): VisitStats[] {
    for (const student of visitStats) {
      const results: ConsultationMark[] = [];
      for (const consultation of consultations) {
        const result = student.CourseProjectConsultationMarks.find(cm => cm.ConsultationDateId === consultation.Id);
        if (result != null) {
          result.Mark = this.translateMark(result.Mark);
          results.push(result);
        } else {
          // @ts-ignore
          const cm: ConsultationMark = {StudentId: student.Id, ConsultationDateId: consultation.Id};
          results.push(cm);
        }
      }
      student.CourseProjectConsultationMarks = results;
    }
    return visitStats;
  }

  translateMark(mark: string) {
    if (mark != null) {
      mark = mark.trim();
      if (mark === '-') {
        mark = '–';
      }
    }
    return mark;
  }

  setMark(consultationMark: ConsultationMark) {
    if (!(consultationMark.Mark === '' && consultationMark.Id == null)) {
      if (consultationMark.Mark === '–') {
        consultationMark.Mark = '-';
      }
      if (consultationMark.Id == null) {
        this.visitStatsService
          .setMark(consultationMark.StudentId, consultationMark.ConsultationDateId, consultationMark.Mark)
          .subscribe(res => this.ngOnInit());
      } else {
        this.visitStatsService
          .editMark(consultationMark.Id, consultationMark.StudentId, consultationMark.ConsultationDateId, consultationMark.Mark)
          .subscribe(res => this.ngOnInit());
      }
    }
  }

  addDate() {
    const dialogRef = this.dialog.open(AddDateDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        const date = new Date(result);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        this.visitStatsService.addDate(date.toISOString(), this.subjectId).subscribe(res => this.ngOnInit());
      }
    });
  }

}
