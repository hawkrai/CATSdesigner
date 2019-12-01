import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material";
import {AnswersPopupComponent} from "./components/answers-popup/answers-popup.component";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { Label } from 'ng2-charts';
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";

@Component({
  selector: "app-result-test-table",
  templateUrl: "./result-test-table.component.html",
  styleUrls: ["./result-test-table.component.less"]
})
export class ResultTestTableComponent implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], label: 'Оценка' }
  ];

  @Input()
  public tests: any;

  @Input()
  public name: string;

  public scareThing: any = [];
  public testSize: number;

  displayedColumns: string[] = ['Id', 'Name'];

  @Output()
  public sendAverageMarks: EventEmitter<any> = new EventEmitter();

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
    let mass = [];
    for (let subGroup of this.scareThing) {
      if (subGroup.length != 0) {
        for (let pupil of subGroup) {
          let sumOfMarks: number = 0;
          for (let test of pupil[1].test) {
            sumOfMarks += test.points;
          }
          let entire = [];
          entire.push(pupil[1].StudentShortName);
          entire.push(sumOfMarks / this.testSize);
          mass.push(entire);
          pupil.push(sumOfMarks / this.testSize);
        }
      }
    }let sortedDescPoints = mass.sort((a, b) => {
      return b[1] - a[1];
    });
    for(let entire of sortedDescPoints){
      this.barChartLabels.push(entire[0]);
      this.barChartData[0].data.push(entire[1]);
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
