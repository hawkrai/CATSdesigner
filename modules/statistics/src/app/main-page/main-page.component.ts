import {Component, OnInit} from '@angular/core';
import { NgApexchartsModule } from 'ng-apexcharts';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})


export class MainPageComponent implements OnInit {

  public chartOptions: any;
  public chartOptions1: any;
  public chartOptions2: any;
  public radarChartType = 'radar';

  public categories: string[][]  = [['1', '4.1', 'Средняя оценка за лабораторную работу'],
                                  ['2', '3.4', 'Средняя оценка за тесты'],
                                  ['3', '4.5', 'Рейтинговая оценка'],
                                  ['4', '4.3',  'Средняя оценка за практические работы'],
                                  ['5', '3.8', 'Оценка за курсовой проект']];

  colors: string [] = ['red', 'blue', 'yellow', 'purple' , 'green'];

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: 'Средняя оценка',
          data: [4.1, 3.4, 4.5, 4.3, 3.8]
        }
      ],
      chart: {
        height: 200,
        type: 'radar',
        width: 200
      },
      title: {
        text: ''
      },
      xaxis: {
        categories: ['', '', '', '', '']
      },
      fill: {
        type: 'solid',
        opacity: 0,
      },
      markers: {
        discrete: [{
          seriesIndex: 0,
          dataPointIndex: 0,
          fillColor: this.colors[0],
          strokeColor: '#fff',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 1,
          fillColor: this.colors[1],
          strokeColor: '#eee',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 2,
          fillColor: this.colors[2],
          strokeColor: '#eee',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 3,
          fillColor: this.colors[3],
          strokeColor: '#eee',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 4,
          fillColor: this.colors[4],
          strokeColor: '#eee',
          size: 5
        }]
      },
      stroke: {
        show: true,
        width: 0.3,
        colors: ['black'],
        dashArray: 0
      },
      legend: {
        show: 'true',
        position: 'bottom',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
      }
    };

    this.chartOptions1 = {
      series: [
        {
          name: 'Средняя оценка',
          data: [4.1, 3.4, 4.5, 4.3]
        }
      ],
      chart: {
        height: 200,
        type: 'radar',
        width: 200
      },
      title: {
        text: ''
      },
      xaxis: {
        categories: ['', '', '', '']
      },
      fill: {
        type: 'solid',
        opacity: 0,
      },
      markers: {
        discrete: [{
          seriesIndex: 0,
          dataPointIndex: 0,
          fillColor: this.colors[0],
          strokeColor: '#fff',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 1,
          fillColor: this.colors[1],
          strokeColor: '#eee',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 2,
          fillColor: this.colors[2],
          strokeColor: '#eee',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 3,
          fillColor: this.colors[3],
          strokeColor: '#eee',
          size: 5
        }]
      },
      stroke: {
        show: true,
        width: 0.3,
        colors: ['black'],
        dashArray: 0
      },
      legend: {
        show: 'true',
        position: 'bottom',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
      }
    };

    this.chartOptions2 = {
      series: [
        {
          name: 'Средняя оценка',
          data: [4.1, 3.4, 4.5]
        }
      ],
      chart: {
        height: 200,
        type: 'radar',
        width: 200
      },
      title: {
        text: ''
      },
      xaxis: {
        categories: ['', '', '', '']
      },
      fill: {
        type: 'solid',
        opacity: 0,
      },
      markers: {
        discrete: [{
          seriesIndex: 0,
          dataPointIndex: 0,
          fillColor: this.colors[0],
          strokeColor: '#fff',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 1,
          fillColor: this.colors[1],
          strokeColor: '#eee',
          size: 5
        }, {
          seriesIndex: 0,
          dataPointIndex: 2,
          fillColor: this.colors[2],
          strokeColor: '#eee',
          size: 5
        }]
      },
      stroke: {
        show: true,
        width: 0.3,
        colors: ['black'],
        dashArray: 0
      },
      legend: {
        show: 'true',
        position: 'bottom',
        horizontalAlign: 'center',
        floating: false,
        fontSize: '14px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 400,
      }
    };
  }

  ngOnInit() {
  }

}
