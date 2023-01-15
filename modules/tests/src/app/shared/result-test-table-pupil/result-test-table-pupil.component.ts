import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {Test} from "../../models/test.model";
import {ChartDataSets, ChartOptions, ChartType} from "chart.js";
import {Label} from "ng2-charts";
import * as pluginDataLabels from "chartjs-plugin-datalabels";

@Component({
  selector: "app-result-test-table-pupil",
  templateUrl: "./result-test-table-pupil.component.html",
  styleUrls: ["./result-test-table-pupil.component.less"]
})
export class ResultTestTablePupilComponent implements OnChanges {

  @Input()
  public tests: Test[];
  public loading: boolean = true;

  public barChartColors: any[] = [
    { backgroundColor: "#3f51b5" },
  ];

  displayedColumns: string[] = ["Id", "Title", "action"];

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
    },
    legend: {
      display: false
    }
  };
  public barChartLabels: Label[] = [];
  public barChartType: ChartType = "bar";
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[];

  public ngOnChanges(changes: SimpleChanges): void {
    this.barChartLabels = [];
    this.barChartData = [
      {data: [] }
    ];
    this.barChartData[0].data = [];
    this.tests && this.tests.forEach((test: Test) => {
      var sliced = test.Title.slice(0, 40);
      if (sliced.length < test.Title.length) {
        sliced += "...";
      }
      this.barChartLabels.push(sliced);
      this.barChartData[0].data.push(test.Points);
    });
    this.loading = false;
  }

}
