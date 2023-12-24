import { Component, Inject, OnInit } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { TranslatePipe } from 'educats-translate'
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexPlotOptions,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexYAxis,
} from 'ng-apexcharts'
import { LessonService } from '../service/lesson.service'

interface ApexXAxis {
  type?: 'category' | 'datetime' | 'numeric'
  categories?: any
  labels?: {
    style?: {
      colors?: string | string[]
      fontSize?: string
    }
  }
}

export interface ChartOptions {
  series: ApexAxisChartSeries
  chart: ApexChart
  dataLabels: ApexDataLabels
  plotOptions: ApexPlotOptions
  yaxis: ApexYAxis
  xaxis: ApexXAxis
  grid: ApexGrid
  colors: string[]
  legend: ApexLegend
}

export interface ChartOptions3 {
  series: ApexAxisChartSeries
  chart: ApexChart
  dataLabels: ApexDataLabels
  plotOptions: ApexPlotOptions
  xaxis: ApexXAxis
  yaxis: ApexYAxis
  stroke: ApexStroke
  title: ApexTitleSubtitle
  tooltip: ApexTooltip
  fill: ApexFill
  colors: string[]
  legend: ApexLegend
}

@Component({
  selector: 'app-schedule-statistics',
  templateUrl: './schedule-statistics.component.html',
  styleUrls: ['./schedule-statistics.component.css'],
})
export class ScheduleStatisticsComponent implements OnInit {
  lectCount = 0
  labCount = 0
  practCount = 0
  diplomCount = 0
  couseCount = 0

  mondayCount = 0
  tuesdayCount = 0
  wednesdayCount = 0
  thursdayCount = 0
  fridayCount = 0
  saturdayCount = 0
  sundayCount = 0

  chartOptions: any
  chartOptions1: any
  startDate: Date
  endDate: Date
  lessonMarks: number[] = []
  lessons: string[] = []
  series: any[] = []
  lessonDayMarks: any[][] = []

  weekDays: string[] = [
    this.translatePipe.transform('text.schedule.monday', 'Понедельник'),
    this.translatePipe.transform('text.schedule.tuesday', 'Вторник'),
    this.translatePipe.transform('text.schedule.wednesday', 'Среда'),
    this.translatePipe.transform('text.schedule.thursday', 'Четверг'),
    this.translatePipe.transform('text.schedule.friday', 'Пятница'),
    this.translatePipe.transform('text.schedule.saturday', 'Суббота'),
    this.translatePipe.transform('text.schedule.sunday', 'Воскресенье'),
  ]

  lessonTypes: string[] = [
    this.translatePipe.transform('text.schedule.lecture', 'Лекция'),
    this.translatePipe.transform(
      'text.schedule.workshop',
      'Практическое занятие'
    ),
    this.translatePipe.transform('text.schedule.lab', 'Лабораторная работа'),
    this.translatePipe.transform(
      'text.schedule.course.project',
      'Консультация по курсовому проектированию'
    ),
    this.translatePipe.transform(
      'text.schedule.graduation.project',
      'Консультация по дипломному проектированию'
    ),
  ]

  public typeColors: string[] = [
    '#0000FF',
    '#FFA500',
    '#ff0000',
    '#006400',
    '#7F00FF',
  ]
  public lessonColors: string[] = []
  public chartOptions2: Partial<ChartOptions>
  public chartOptions3: Partial<ChartOptions3>

  constructor(
    public dialogRef: MatDialogRef<ScheduleStatisticsComponent>,
    private lessonservice: LessonService,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    this.startDate = new Date(this.data.start)
    this.endDate = new Date(this.data.end + ' 23:59:59')
    this.data.schedule.forEach((event) => {
      if (!(event.start < this.startDate || event.end > this.endDate)) {
        if (event.meta == 'lesson') {
          let type = this.lessonservice.getType(event.title)
          type = type.replaceAll(' ', '')
          if (type == 'Лекция' || type == 'Lect.') {
            this.lectCount += 1
          }
          if (type == 'Лаб.работа' || type == 'Lab') {
            this.labCount += 1
          }
          if (type == 'Практ.зан.' || type == 'WS') {
            this.practCount += 1
          }
          if (type == 'ДП' || type == 'GP') {
            this.diplomCount += 1
          }
          if (type == 'КП' || type == 'CP') {
            this.couseCount += 1
          }
          let day = event.start.getDay()
          if (day == 0) {
            this.sundayCount += 1
            day = 7
          }
          if (day == 1) {
            this.mondayCount += 1
          }
          if (day == 2) {
            this.tuesdayCount += 1
          }
          if (day == 3) {
            this.wednesdayCount += 1
          }
          if (day == 4) {
            this.thursdayCount += 1
          }
          if (day == 5) {
            this.fridayCount += 1
          }
          if (day == 6) {
            this.saturdayCount += 1
          }
          let lessonType = this.lessonservice
            .getTitlePart(event.title, 3)
            .replaceAll(' ', '')
          let color = this.lessonservice.getColorLesson(event)
          if (lessonType == '') {
            lessonType = this.translatePipe.transform(
              'text.schedule.graduation.project.cut',
              'ДП'
            )
            color = '#7F00FF'
          }
          const index = this.lessons.indexOf(lessonType)
          if (index == -1) {
            this.lessons.push(lessonType)
            this.lessonColors.push(color)
            this.lessonMarks.push(1)
            const marksTemp = [0, 0, 0, 0, 0, 0, 0]
            marksTemp[day - 1] = 1
            this.lessonDayMarks.push(marksTemp)
          } else {
            this.lessonMarks[index] = this.lessonMarks[index] + 1
            this.lessonDayMarks[index][day - 1] =
              this.lessonDayMarks[index][day - 1] + 1
          }
        }
      }
    })

    this.lessons.forEach((lesson) => {
      this.series.push({
        name: lesson,
        data: this.lessonDayMarks[this.lessons.indexOf(lesson)],
      })
    })

    this.chartOptions = {
      series: [
        this.lectCount,
        this.practCount,
        this.labCount,
        this.couseCount,
        this.diplomCount,
      ],
      chart: {
        type: 'donut',
      },
      colors: this.typeColors,
      labels: this.lessonTypes,
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200,
              height: 200,
            },
            legend: {
              position: 'bottom',
            },
          },
        },
      ],
    }

    this.chartOptions1 = {
      series: [
        {
          name: this.translatePipe.transform('text.schedule.lesson', 'Занятие'),
          data: [
            this.mondayCount,
            this.tuesdayCount,
            this.wednesdayCount,
            this.thursdayCount,
            this.fridayCount,
            this.saturdayCount,
            this.sundayCount,
          ],
        },
      ],
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          tools: {
            download: '⇩',
          },
        },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'straight',
      },
      title: {
        text: '',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: this.weekDays,
      },
    }

    this.chartOptions2 = {
      series: [
        {
          name: this.translatePipe.transform(
            'text.schedule.count',
            'Количество'
          ),
          data: this.lessonMarks,
        },
      ],
      chart: {
        height: 350,
        type: 'bar',
      },
      colors: this.lessonColors,
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: {
        enabled: false,
      },
      legend: {
        show: false,
      },
      grid: {
        show: false,
      },
      xaxis: {
        categories: this.lessons,
        labels: {
          style: {
            colors: this.lessonColors,
            fontSize: '12px',
          },
        },
      },
    }

    this.chartOptions3 = {
      series: this.series,
      chart: {
        type: 'bar',
        height: 350,
        stacked: true,
      },
      colors: this.lessonColors,
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      stroke: {
        width: 1,
        colors: ['#fff'],
      },
      title: {
        text: '',
      },
      xaxis: {
        categories: this.weekDays,
      },
      yaxis: {
        title: {
          text: undefined,
        },
      },
      tooltip: {
        y: {
          formatter(val) {
            return val + ''
          },
        },
      },
      fill: {
        opacity: 1,
      },
      legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
      },
    }
  }

  onCancelClick() {
    this.dialogRef.close(null)
  }
}
