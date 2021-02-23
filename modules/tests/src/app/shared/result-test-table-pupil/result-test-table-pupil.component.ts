import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Test} from "../../models/test.model";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import {TranslatePipe} from "../../../../../../container/src/app/pipe/translate.pipe";


@Component({
  selector: "app-result-test-table-pupil",
  templateUrl: "./result-test-table-pupil.component.html",
  styleUrls: ["./result-test-table-pupil.component.less"]
})
export class ResultTestTablePupilComponent implements OnChanges {

  @Input()
  public tests: Test[];
  public loading: boolean = true;

  displayedColumns: string[] = ["Id", "Title", "action"];

  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      xAxes: [{}], yAxes: [{
        ticks: {
          min: 0,
          max: 100,
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

  constructor(private translatePipe: TranslatePipe) {

  }

  public ngOnChanges(changes: SimpleChanges): void {
    this.barChartLabels = [];
    this.barChartData = [
      {data: [], label: this.translatePipe.transform('text.text.percent',"Проценты")}
    ];
    this.barChartData[0].data = [];
    this.tests && this.tests.forEach((test: Test) => {
      var sliced = test.Title.slice(0, 40);
      if (sliced.length < test.Title.length) {
        sliced += "...";
      }
      this.barChartLabels.push(sliced);
      this.barChartData[0].data.push(test.Percent);
    });
    this.loading = false;
  }

}
