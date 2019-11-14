import {Component, Input, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material";
import {AnswersPopupComponent} from "./components/answers-popup/answers-popup.component";


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

  constructor(public dialog: MatDialog) {
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
    this.getAverageMark();
  }//todo average marks from backend

  private getAverageMark(): void {
    for (let subGroup of this.scareThing) {
      if (subGroup.length != 0) {
        for (let pupil of subGroup) {
          let sumOfMarks: number = 0;
          for (let test of pupil[1].test) {
            sumOfMarks += test.points;
          }
          pupil.push(sumOfMarks / this.testSize);
        }
      }
    }
  }


  public openAnswersDialog(event?: any): void {
    const dialogRef = this.dialog.open(AnswersPopupComponent, {
      width: '800px',
      data: {event}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
    });
  }
}
