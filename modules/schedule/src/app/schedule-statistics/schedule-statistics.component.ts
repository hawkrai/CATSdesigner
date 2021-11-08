import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LessonService} from '../service/lesson.service';
import {
  ApexChart,
  ApexAxisChartSeries,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexFill
} from 'ng-apexcharts';


interface ApexXAxis {
  type?: 'category' | 'datetime' | 'numeric';
  categories?: any;
  labels?: {
    style?: {
      colors?: string | string[];
      fontSize?: string;
    };
  };
}

export interface ChartOptions {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  grid: ApexGrid;
  colors: string[];
  legend: ApexLegend;
}


export interface ChartOptions3 {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  tooltip: ApexTooltip;
  fill: ApexFill;
  legend: ApexLegend;
}

@Component({
  selector: 'app-schedule-statistics',
  templateUrl: './schedule-statistics.component.html',
  styleUrls: ['./schedule-statistics.component.css']
})
export class ScheduleStatisticsComponent implements OnInit {

  lectCount = 0;
  labCount = 0;
  practCount = 0;
  diplomCount = 0;
  couseCount = 0;

  mondayCount = 0;
  tuesdayCount = 0;
  wednesdayCount = 0;
  thursdayCount = 0;
  fridayCount = 0;
  saturdayCount = 0;
  sundayCount = 0;

  chartOptions: any;
  chartOptions1: any;

  lessonMarks: number[] = [];
  lessons: string[] = [];
  series: any[] = [];
  lessonDayMarks: any [][] = [];

  weekDays: string[] = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

  public chartOptions2: Partial<ChartOptions>;
  public chartOptions3: Partial<ChartOptions3>;

  constructor(public dialogRef: MatDialogRef<ScheduleStatisticsComponent>, private lessonservice: LessonService,
              @Inject(MAT_DIALOG_DATA) private data: any) { }

  ngOnInit() {
    this.data.schedule.forEach(event => {
      if (event.meta == 'lesson') {
        let type = this.lessonservice.getType(event.title);
        type = type.replaceAll(' ', '');
        if (type == 'Лекция' || type == 'Lect.') {
          this.lectCount += 1;
        }
        if (type == 'Лаб.работа' || type == 'Lab') {
          this.labCount += 1;
        }
        if (type == 'Практ.зан.' || type == 'WS') {
          this.practCount += 1;
        }
        if (type == 'ДП' || type == 'GP') {
          this.diplomCount += 1;
        }
        if (type == 'КП' || type == 'CP') {
          this.couseCount += 1;
        }
        let day = event.start.getDay();
        if (day == 0) {
          this.sundayCount += 1;
          day = 7;
        }
        if (day == 1) {
          this.mondayCount += 1;
        }
        if (day == 2) {
          this.tuesdayCount += 1;
        }
        if (day == 3) {
          this.wednesdayCount += 1;
        }
        if (day == 4) {
          this.thursdayCount += 1;
        }
        if (day == 5) {
          this.fridayCount += 1;
        }
        if (day == 6) {
          this.saturdayCount += 1;
        }
        let lessonType = this.lessonservice.getTitelPart(event.title,  3).replaceAll(' ', '');
        if (lessonType == '') {
          lessonType = 'ДП';
        }
        const index = this.lessons.indexOf(lessonType);
        if (index == -1 ) {
            this.lessons.push(lessonType);
            this.lessonMarks.push(1);
            const marksTemp = [0, 0, 0, 0, 0, 0, 0];
            marksTemp[day - 1] = 1;
            this.lessonDayMarks.push(marksTemp);
        } else {
            this.lessonMarks[index] = this.lessonMarks[index] + 1;
            this.lessonDayMarks[index][day - 1] = this.lessonDayMarks[index][day - 1] + 1;
        }
      }
    });

    this.lessons.forEach(lesson => {
      this.series.push({name: lesson, data: this.lessonDayMarks[this.lessons.indexOf(lesson)] });
    });

    this.chartOptions = {
      series: [this.lectCount, this.labCount, this.practCount, this.diplomCount, this.couseCount],
      chart: {
        type: 'donut'
      },
      labels: ['Лекции', 'Лабораторные работы ', 'Практичесие занятия', 'Дипломный проект', 'Курсовой проект'],
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: 'bottom'
            }
          }
        }
      ]
    };

    this.chartOptions1 = {
      series: [
        {
          name: 'Занятия',
          data: [this.mondayCount, this.tuesdayCount, this.wednesdayCount, this.thursdayCount, this.fridayCount, this.saturdayCount, this.sundayCount]
        }
      ],
      chart: {
        height: 350,
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
        text: 'Занятия каждый день',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.weekDays
      }
    };


    this.chartOptions2 = {
      series: [
        {
          name: 'Количество',
          data: this.lessonMarks
        }
      ],
      chart: {
        height: 350,
        type: 'bar'
      },
      colors: [
        '#008FFB',
        '#00E396',
        '#FEB019',
        '#FF4560',
        '#775DD0',
        '#546E7A',
        '#26a69a',
        '#D10CE8'
      ],
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true
        }
      },
      dataLabels: {
        enabled: false
      },
      legend: {
        show: false
      },
      grid: {
        show: false
      },
      xaxis: {
        categories: this.lessons,
        labels: {
          style: {
            colors: [
              '#008FFB',
              '#00E396',
              '#FEB019',
              '#FF4560',
              '#775DD0',
              '#546E7A',
              '#26a69a',
              '#D10CE8'
            ],
            fontSize: '12px'
          }
        }
      }
    };


    this.chartOptions3 = {
      series: this.series,
      chart: {
        type: 'bar',
        height: 350,
        stacked: true
      },
      plotOptions: {
        bar: {
          horizontal: true
        }
      },
      stroke: {
        width: 1,
        colors: ['#fff']
      },
      title: {
        text: 'Предметы каждый день'
      },
      xaxis: {
        categories: this.weekDays
      },
      yaxis: {
        title: {
          text: undefined
        }
      },
      tooltip: {
        y: {
          formatter(val) {
            return val + '';
          }
        }
      },
      fill: {
        opacity: 1
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40
      }
    };
  }

}
