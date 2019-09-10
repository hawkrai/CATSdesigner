import { Component, Input, OnInit } from '@angular/core';
import { Calendar } from '../../../../models/calendar.model';

@Component({
  selector: 'app-visit-lectures',
  templateUrl: './visit-lectures.component.html',
  styleUrls: ['./visit-lectures.component.less']
})
export class VisitLecturesComponent implements OnInit {

  @Input() calendar: Calendar[];

  constructor() { }

  ngOnInit() {
    console.log(this.calendar);
  }

}
