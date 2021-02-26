import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {MatDialog} from "@angular/material";
import {AnswersPopupComponent} from "./components/answers-popup/answers-popup.component";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import {Label} from "ng2-charts";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {AutoUnsubscribe} from "../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../core/auto-unsubscribe-base";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {TestPassingService} from "../../service/test-passing.service";
import {TranslatePipe} from "../../../../../../container/src/app/pipe/translate.pipe";


@AutoUnsubscribe
@Component({
  selector: "app-result-test-table",
  templateUrl: "./result-test-table.component.html",
  styleUrls: ["./result-test-table.component.less"]
})
export class ResultTestTableComponent extends AutoUnsubscribeBase implements OnInit {

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          min: 0,
          max: 10,
        }
      }]
    },
    aspectRatio: 6,
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
      }
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[];
  public showChart: boolean = false;
  @Input()
  public tests: any;
  @Input()
  public size: number;

  @Input()
  public group: string;

  @Input()
  public groupId: string;
  @Input()
  public forSelf: boolean = false;
  @Input()
  public name: string;

  @Input()
  public testName: string;
  public scareThing: any = [];
  @Input()
  public loading: boolean;
  public testSize: number;
  displayedColumns: string[] = ["Id", "Name"];
  @Output()
  public sendAverageMarks: EventEmitter<any> = new EventEmitter();
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(public dialog: MatDialog,
              private translatePipe: TranslatePipe,
              private testPassingService: TestPassingService) {
    super();
  }

  ngOnInit() {
    this.barChartData = [
      {data: [], label: this.translatePipe.transform("text.test.mark", "Оценка")}
    ];
    for (let i = 0; i < 3; i++) {
      this.scareThing.push(Array.from(this.tests[i].entries()));
    }
    this.testSize = this.scareThing &&
      ((this.scareThing[0] && this.scareThing[0][0] && this.scareThing[0][0][1] && this.scareThing[0][0][1].test && this.scareThing[0][0][1].test.length) ||
        (this.scareThing[1] && this.scareThing[1][0] && this.scareThing[1][0][1] && this.scareThing[1][0][1].test && this.scareThing[1][0][1].test.length) ||
        (this.scareThing[2] && this.scareThing[2][0] && this.scareThing[2][0][1] && this.scareThing[2][0][1].test && this.scareThing[2][0][1].test.length));
    for (let i = 0; i < this.testSize; i++) {
      this.displayedColumns.push("test" + i);
    }
    this.displayedColumns.push("average");
    this.getAverageMark();
  }//todo average marks from backend

  public openAnswersDialog(openDialog: boolean, name: string, testName: string, event?: any, id?: any): void {
    if (openDialog) {
      const dialogRef = this.dialog.open(AnswersPopupComponent, {
        width: "800px",
        data: {event, id, name, testName}
      });

      dialogRef.afterClosed()
        .pipe(
          takeUntil(this.unsubscribeStream$)
        )
        .subscribe();
    }
  }

  public downloadExcel(): void {
    const subject = JSON.parse(localStorage.getItem("currentSubject"));
    this.testPassingService.downloadExcel(this.groupId, subject.id, this.forSelf).pipe(takeUntil(this.unsubscribeStream$)).subscribe();
  }

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
          entire.push(this.getShortName(pupil));
          entire.push((sumOfMarks / this.testSize).toFixed(2));
          mass.push(entire);
          pupil.push((sumOfMarks / this.testSize).toFixed(2));
          if (this.size) {
            pupil.push(pupil[1].test.length === this.size && pupil[1].test.every((test) => test.percent));
          }
        }
      }
    }
    let sortedDescPoints = mass.sort((a, b) => {
      return b[1] - a[1];
    });
    for (let entire of sortedDescPoints) {
      this.barChartLabels.push(entire[0]);
      this.barChartData[0].data.push(entire[1]);
    }
    this.showChart = (<number[]>this.barChartData[0]?.data).some(value => value.toString() != "NaN");
  }

  private getShortName(pupil): string {
    const pupilName: string[] = pupil[1].name.split(" ");
    return pupilName[0] + " " + pupilName[1][0] + "." + (pupilName[2] ? (pupilName[2][0] + ".") : "");
  }
}
