import {Component, Input, OnInit} from '@angular/core';
import {TestAvailable} from "../../models/test-available.model";

@Component({
  selector: 'app-result-test-table-teacher',
  templateUrl: './result-test-table-teacher.component.html',
  styleUrls: ['./result-test-table-teacher.component.less']
})
export class ResultTestTableTeacherComponent implements OnInit {

  @Input()
  public tests: TestAvailable[];

  displayedColumns: string[] = ['Id', 'Title', 'action'];

  constructor() { }

  ngOnInit() {
  }

}
