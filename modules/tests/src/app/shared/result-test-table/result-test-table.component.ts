import {Component, Input, OnInit} from '@angular/core';
import {TestAvailable} from "../../models/test-available.model";


@Component({
  selector: 'app-result-test-table',
  templateUrl: './result-test-table.component.html',
  styleUrls: ['./result-test-table.component.less']
})
export class ResultTestTableComponent implements OnInit {

  @Input()
  public tests: TestAvailable[];

  displayedColumns: string[] = ['Id', 'Title', 'action'];

  constructor() {
  }

  ngOnInit() {
  }

}
