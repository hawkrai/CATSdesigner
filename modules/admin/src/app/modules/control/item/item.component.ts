import {Component, OnInit} from '@angular/core';
import { LectureService } from 'src/app/service/lecture.service';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material';
import { LabService } from 'src/app/service/lab.service';
import { flatMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css'],
})
export class ItemComponent implements OnInit {

  dataSourceForLab = new MatTableDataSource<object>();
  dataSourceForLecture = new MatTableDataSource<object>();
  isLoadData = false;

  constructor(private lectureService: LectureService, private labService: LabService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getParamIdFromUrl();
  }

  isDataSourceForLecture() {
    const data = this.dataSourceForLecture.data;
    return data && data.length !== 0;
  }

  isDataSourceForLab() {
    const data = this.dataSourceForLab.data;
    return data && data.length !== 0;
  }

  getParamIdFromUrl() {
    this.isLoadData = false;
    this.route.params.pipe(
     flatMap(({subjectId}) => forkJoin([
       this.lectureService.getLectures(subjectId),
       this.labService.getLabs(subjectId),
      ])),
    )
    .subscribe(([lectures, labs]) => {
      this.dataSourceForLecture.data = lectures.Lectures;
      this.dataSourceForLab.data = labs.Labs;
      this.isLoadData = true;
    });
  }
}
