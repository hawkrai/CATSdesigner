import {Component, Input, OnInit} from '@angular/core';
import {TestAvailable} from "../../models/test-available.model";

@Component({
  selector: 'app-result-test-table-pupil',
  templateUrl: './result-test-table-pupil.component.html',
  styleUrls: ['./result-test-table-pupil.component.less']
})
export class ResultTestTablePupilComponent implements OnInit {

  @Input()
  public tests: TestAvailable[];

  displayedColumns: string[] = ['Id', 'Title', 'action'];

  constructor() { }

  ngOnInit() {
  }

}
