import { Component, OnInit, Inject } from '@angular/core';
import { StatisticService } from 'src/app/service/statistic.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

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
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        let date = this.parseDate(this.series.data[dataPointIndex].x);
        let times = this.logins.get(date).map(val => this.formatTime(new Date(val)));
    
        let html =
          '<div class="tooltip" style="margin-right:20px">' +
            `<p style="margin-left:20px"><strong>Количество авторизаций:</strong> ${times.length}</p>` +
            '<p style="margin-left:20px;line-height:0px"><strong>Время авторизаций:</strong></p>' +
            '<ol>' +
              times
                .map(val => `<li>${val}</li>`)
                .join("\n") +
            '</ol>' +
          '</div>'
    
        return html;
      }
    }
  }
  isLoad = false;

  logins: Map<number, number[]>;

  constructor(private statisticService: StatisticService, public dialogRef: MatDialogRef<object>,
              @Inject(MAT_DIALOG_DATA) public value: any) { }

  ngOnInit() {
    this.loadStatistic(this.value);
  }

  async loadStatistic(userId) {
    await this.statisticService.getStatistics(userId).subscribe( result => {
      if (result.Logins.length > 0) {
        this.convertData(result.Logins);
        this.initChart();
      }
      else {
        this.series.data.push({ x: "", y: 0 });
      }

      this.chartOptions.title.text = result.FullName;
      this.isLoad = true;
    });
  }

  convertData(data) {
    this.logins = new Map();

    for (const item of data) {
      let datetime = new Date(item);
      let date = Date.parse(datetime.toDateString());
      let time = datetime.getTime();

      if (!this.logins.has(date)) {
        this.logins.set(date, []);
      }

      this.logins.get(date).push(time);
    }
  }

  initChart()
  {
    const MAX_COUNT = 30;

    this.series.data = [];
    
    for (const item of this.logins.entries()) {
      this.series.data.push({ x: this.formatDate(new Date(item[0])), y: item[1].length });
    }
    
    const length = this.logins.size;
    
    if (length > 30) {
      this.series.data = this.series.data.slice(length - MAX_COUNT, length);
    }

    let maxCount = this.series.data[0].y;

    for (const item of this.series.data) {
      if (item.y > maxCount) {
        maxCount = item.y;
      }
    }

    this.chartOptions.yaxis.max = maxCount + 1;
  }

  parseDate(dateString) {
    let parts = dateString.split(".");

    if (parts.length != 3) {
      return NaN;
    }

    let [dd, mm, yyyy] = parts;
    return Date.parse(`${mm}/${dd}/${yyyy}`);
  }

  formatDate(date) {
    let yyyy = date.toLocaleDateString('en-GB', { year: 'numeric' });
    let mm = date.toLocaleDateString('en-GB', { month: '2-digit' });
    let dd = date.toLocaleDateString('en-GB', { day: '2-digit' });
    return `${dd}.${mm}.${yyyy}`;
  }

  formatTime(date) {
    return date.toLocaleTimeString('en-GB');
  }
}
