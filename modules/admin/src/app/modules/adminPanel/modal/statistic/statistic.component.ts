import { Component, OnInit, Inject } from '@angular/core';
import { StatisticService } from 'src/app/service/statistic.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { VirtualTimeScheduler } from 'rxjs';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css']
})
export class StatisticComponent implements OnInit {
  
  series = {
    name: '',
    data: []
  }

  chartOptions = {
    series: [this.series],
    chart: {
      width: 550,
      height: 400,
      type: 'line',
      zoom: {
        enabled: false
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: "",
      align: "left"
    },
    grid: {
      row: {
        colors: ["#f3f3f3", "transparent"],
        opacity: 0.5
      }
    },
    xaxis: {
      tickPlacement: 'between',
      labels: {
        rotate: -60
      }
    },
    yaxis: {
      min: 0,
      max: 6, 
      labels: {
        formatter: function(val) {
          return val.toFixed(0);
        }
      }
    },
    tooltip: {
      y: {
        formatter: function(value, { series, seriesIndex, dataPointIndex, w }) {
          return `Кол-во: ${value}`
        }
      }
    }
  }
  isLoad = false;

  constructor(private statisticService: StatisticService, public dialogRef: MatDialogRef<object>,
              @Inject(MAT_DIALOG_DATA) public value: any) { }

  ngOnInit() {
    this.loadStatistic(this.value);
  }

  async loadStatistic(userId) {
    await this.statisticService.getStatistics(userId).subscribe( result => {
      if (result.attendance.length > 0) {
        this.convertData(result.attendance);
      }
      else {
        this.series.data.push({ x: "", y: 0 });
      }
      this.chartOptions.title.text = result.resultMessage;
      this.isLoad = true;
    });
  }

  convertData(array) {
    const MAX_COUNT = 30;

    this.series.data = [];
    
    for (const item of array) {
      this.series.data.push({ x: item.day, y: item.count });
    }
    
    const length = array.length;
    
    if (length > 30) {
      this.series.data = this.series.data.slice(length - MAX_COUNT, length);
    }

    let maxCount = array[0].count;

    for (const item of this.series.data) {
      if (item.y > maxCount) {
        maxCount = item.y;
      }
    }

    this.chartOptions.yaxis.max = maxCount + 1;
  }

}
