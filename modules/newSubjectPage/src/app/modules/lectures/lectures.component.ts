import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {LecturesService} from '../../services/lectures.service';
import {Lecture} from '../../models/lecture.model';
import {ConverterService} from "../../services/converter.service";
import {Calendar} from "../../models/calendar.model";

@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.less']
})
export class LecturesComponent implements OnInit {

  public tab = 1;
  public lectures: Lecture[];
  public calendar: Calendar[];

  private subjectId: string;

  constructor(private lecturesService: LecturesService,
              private converterService: ConverterService,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.subjectId = this.route.snapshot.params.subjectId;

    this.lecturesService.getAllLectures(this.subjectId).subscribe(res => {
      this.lectures = this.converterService.lecturesModelConverter(res.Lectures);
    });

    this.lecturesService.getCalendar(this.subjectId).subscribe(res => {
      this.calendar = this.converterService.calendarModelsConverter(res.Calendar);
    });
  }

}
