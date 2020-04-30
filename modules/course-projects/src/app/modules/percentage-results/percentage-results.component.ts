import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ProjectGroupService} from '../../services/project-group.service';
import {Group} from '../../models/group.model';
import {PercentageResultsService} from '../../services/percentage-results.service';
import {Subscription} from 'rxjs';
import {StudentPercentageResults} from '../../models/student-percentage-results.model';
import {PercentageGraph} from '../../models/percentage-graph.model';
import {PercentageResult} from '../../models/percentage-result.model';
import {CourseUser} from '../../models/course-user.model';
import {CourseUserService} from '../../services/course-user.service';
import {MatDialog} from '@angular/material';
import {EditPercentageDialogComponent} from './edit-percentage-dialog/edit-percentage-dialog.component';

@Component({
  selector: 'app-percentage-results',
  templateUrl: './percentage-results.component.html',
  styleUrls: ['./percentage-results.component.less']
})
export class PercentageResultsComponent implements OnInit {

  private COUNT = 1000;
  private PAGE = 1;

  private courseUser: CourseUser;
  private percentageResults: StudentPercentageResults[];
  private percentageGraphs: PercentageGraph[];
  private groups: Group[];

  private percentageResultsSubscription: Subscription;

  private subjectId: string;
  private groupId: number;
  private searchString = '';

  constructor(private courseUserService: CourseUserService,
              private projectGroupService: ProjectGroupService,
              private percentageResultsService: PercentageResultsService,
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
      this.retrievePercentageResults();
    });
  }

  retrievePercentageResults() {
    this.percentageResultsSubscription = this.percentageResultsService.getPercentageResults({
      count: this.COUNT,
      page: this.PAGE,
      filter: '{"groupId":' + this.groupId +
        ',"subjectId":"' + this.subjectId + '",' +
        '"secretaryId":' + this.groupId + ',' +
        '"searchString":"' + this.searchString + '"}',
    })
      .subscribe(res => {
        this.percentageResults = this.assignResults(res.Students.Items, res.PercentageGraphs);
        this.percentageGraphs = res.PercentageGraphs;
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
    if (this.percentageResultsSubscription) {
      this.percentageResultsSubscription.unsubscribe();
    }
    this.retrievePercentageResults();
  }

  public getCourseUser() {
    return this.courseUser;
  }

  assignResults(studentPercentageResults: StudentPercentageResults[], percentageGraphs: PercentageGraph[]): StudentPercentageResults[] {
    for (const student of studentPercentageResults) {
      const results: PercentageResult[] = [];
      for (const percentageGraph of percentageGraphs) {
        const result = student.PercentageResults.find(pr => pr.PercentageGraphId === percentageGraph.Id);
        if (result != null) {
          if (result.Mark == null) {
            result.Mark = '-';
          }
          results.push(result);
        } else {
          // @ts-ignore
          const pr: PercentageResult = {StudentId: student.Id, PercentageGraphId: percentageGraph.Id, Mark: '-'};
          results.push(pr);
        }
      }
      student.PercentageResults = results;
      if (student.Mark == null) {
        student.Mark = '-';
      }
    }
    return studentPercentageResults;
  }

  setResult(pr: PercentageResult) {
    const dialogRef = this.dialog.open(EditPercentageDialogComponent, {
      width: '200px',
      data: {
        mark: pr.Mark !== '-' ? pr.Mark : null,
        min: 0,
        max: 100,
        regex: '^\\d*$',
        errorMsg: 'Введите число от 0 до 100',
        label: 'Результат',
        symbol: '%'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null && !(result === '' && pr.Id == null)) {
        if (pr.Id == null) {
          this.percentageResultsService.setPercentage(pr.StudentId, pr.PercentageGraphId, result).subscribe(res => this.ngOnInit());
        } else {
          this.percentageResultsService.editPercentage(pr.Id, pr.StudentId, pr.PercentageGraphId, result).subscribe(res => this.ngOnInit());
        }
      }
    });
  }

  setMark(student: StudentPercentageResults) {
    const dialogRef = this.dialog.open(EditPercentageDialogComponent, {
      width: '200px',
      data: {
        mark: student.Mark !== '-' ? student.Mark : null,
        min: 1,
        max: 10,
        regex: '^\\d*$',
        errorMsg: 'Введите число от 1 до 10',
        label: 'Оценка',
        notEmpty: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.percentageResultsService.setMark(student.AssignedCourseProjectId, result).subscribe(res => this.ngOnInit());
    });
  }

}
