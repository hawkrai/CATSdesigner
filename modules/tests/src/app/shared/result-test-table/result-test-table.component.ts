import {Component, Input, OnInit} from '@angular/core';


@Component({
  selector: 'app-result-test-table',
  templateUrl: './result-test-table.component.html',
  styleUrls: ['./result-test-table.component.less']
})
export class ResultTestTableComponent implements OnInit {

  @Input()
  public tests: any;

  public scareThing: any = [];
  public testSize: number;

  displayedColumns: string[] = ['Id', 'Name'];

  constructor() {
  }

  ngOnInit() {
    console.log("ngOnInit");
    console.log(this.tests);
    for (let i = 0; i < 3; i++) {
      console.log(Array.from(this.tests[i].entries()));
      this.scareThing.push(Array.from(this.tests[i].entries()));
    }
    this.testSize = this.scareThing && this.scareThing[0] && this.scareThing[0][0] && this.scareThing[0][0][1] && this.scareThing[0][0][1].test && this.scareThing[0][0][1].test.length;
    console.log(this.testSize);
    for (let i = 0; i < this.testSize; i++) {
      this.displayedColumns.push("test" + i);
    }
    this.displayedColumns.push("average");

  }//todo average marks from backend


}
