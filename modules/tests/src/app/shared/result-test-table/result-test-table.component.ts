import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { MatDialog } from "@angular/material";
import { AnswersPopupComponent } from "./components/answers-popup/answers-popup.component";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { Label } from "ng2-charts";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { AutoUnsubscribe } from "../../decorator/auto-unsubscribe";
import { AutoUnsubscribeBase } from "../../core/auto-unsubscribe-base";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { TestPassingService } from "../../service/test-passing.service";
import { TranslatePipe } from "educats-translate";


@AutoUnsubscribe
@Component({
  selector: "app-result-test-table",
  templateUrl: "./result-test-table.component.html",
  styleUrls: ["./result-test-table.component.less"]
})
export class ResultTestTableComponent extends AutoUnsubscribeBase implements OnInit, OnChanges {
  public barChartColors: any[] = [
    { backgroundColor: "#1976D2" },
  ];
  // indigo #3f51b5
  public barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{
      }], yAxes: [{
        ticks: {
          min: 0,
          max: 10,
        }
      }]
    },
    aspectRatio: 6,
    tooltips: {
      backgroundColor: '#fff',
      bodyFontColor: '#000',
      titleFontColor: '#000',
    },
    plugins: {
      datalabels: {
        anchor: "end",
        align: "end",
      },
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
  public showAsSubGroup: boolean;
  @Input()
  public name: string;

  @Input()
  public testName: string;
  public scareThing: any = [];
  @Input()
  public loading: boolean;
  public testSize: number;
  public averageMarkForTest: any;

  displayedColumns: string[] = ["Id", "Name"];
  @Output()
  public sendAverageMarks: EventEmitter<any> = new EventEmitter();
  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(public dialog: MatDialog,
    private translatePipe: TranslatePipe,
    private cdr: ChangeDetectorRef,
    private testPassingService: TestPassingService,
    private translate: TranslatePipe) {
    super();
  }

  ngOnInit() {
    this.barChartData = [
      { data: [], label: this.translatePipe.transform("text.test.average_mark", " Средняя оценка") }
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
    this.averageMarkForTest = this.getAverageMarkForTest();

    for (const subGroup of this.scareThing) {
      if (subGroup.length) {
        subGroup.push(subGroup[0]);
      }
    }
  }//todo average marks from backend

  public openAnswersDialog(openDialog: boolean, name: string, testName: string, event?: any, id?: any): void {
    if (openDialog) {
      const dialogRef = this.dialog.open(AnswersPopupComponent, {
        width: "800px",
        data: { event, id, name, testName },
        disableClose: false,
        autoFocus: false,
        panelClass: 'test-modal-container',
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
          const testSize = pupil[1].test.filter(x => Number.isInteger(x.points)).length;
          entire.push(this.getShortName(pupil));
          const averageMark = testSize > 0 ? (sumOfMarks / testSize).toFixed(1) : '0';
          entire.push(averageMark);
          mass.push(entire);
          pupil.push(averageMark);
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

  private getAverageMarkForTest(): any {
    const result = [];
    for (let subGroup of this.scareThing) {
      if (subGroup.length !== 0) {
        const sumOfMarks = {};
        let countOfValidResults = {};
        for (let pupil of subGroup) {
          for (let test of pupil[1].test) {
            if (test.percent === undefined && test.points === undefined ||
              (test.percent === null && test.points === null)
            ) {
              continue;
            }
            if (sumOfMarks[test.testId] === undefined) {
              sumOfMarks[test.testId] = 0;
              countOfValidResults[test.testId] = 0;
            }
            countOfValidResults[test.testId]++;
            // tslint:disable-next-line:no-magic-numbers
            sumOfMarks[test.testId] += test.percent !== undefined ? test.percent / 10 : test.points;
          }
        }
        let sumOfAverageMarks = 0;
        let amountOfTests = 0;
        for (let [testId, value] of Object.entries(sumOfMarks)) {
          if (!countOfValidResults[testId]) {
            sumOfMarks[testId] = null;
          } else {
            amountOfTests++;
            sumOfAverageMarks += sumOfMarks[testId] / countOfValidResults[testId];
            sumOfMarks[testId] = sumOfMarks[testId] / countOfValidResults[testId];
          }
        }

        sumOfMarks["average"] = sumOfAverageMarks / amountOfTests;

        result.push(sumOfMarks);
      }
    }

    return result;
  }

  private getShortName(pupil): string {
    const pupilName: string[] = pupil[1].name.split(" ");
    return pupilName[0] + " " + pupilName[1][0] + "." + (pupilName[2] ? (pupilName[2][0] + ".") : "");
  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  getAverageTooltip(element) {
    const testsArray = element[1].test;
    const testsCount = testsArray.length;
    const passedTests = testsArray.filter(x => Number.isInteger(x.points)).length;
    return this.translate.transform('text.tests.written', `Написано ${passedTests} тестов из ${testsCount}`, { actualCount: passedTests.toString(), testsCount: testsCount.toString() });
  }
}
