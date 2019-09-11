import { Component, Input, OnInit } from '@angular/core';
import { Lecture } from '../../../../models/lecture.model';

@Component({
  selector: 'app-lectures-list',
  templateUrl: './lectures-list.component.html',
  styleUrls: ['./lectures-list.component.less']
})
export class LecturesListComponent implements OnInit {

  @Input() lectures: Lecture[];

  constructor() { }

  ngOnInit() {
  }

}
