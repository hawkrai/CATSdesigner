import { Component, OnInit } from '@angular/core'

import { StatisitcsServiceService } from '../service/statisitcs-service.service'
import { TranslatePipe } from 'educats-translate'
import { Message } from '../../../../../container/src/app/core/models/message'

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
})
export class MainPageComponent implements OnInit {
  public chartOptions: any
  public chartOptions1: any
  public chartOptionsArchive: any
  public radarChartType = 'radar'

  public listChartOptions: any[] = []
  public listChartOptionsArchive: any[] = []
  public temp: any[] = []
  tempAvg
  user: any
  testSum = 0
  practSum = 0
  labSum = 0
  ratingAvg = 0
  courseMark = 0

  practMarks: any[] = []
  labMarks: any[] = []
  testMarks: any[] = []
  conMarks: any[] = []
  ratingMarksArchive: any[] = []
  practMarksArchive: any[] = []
  labMarksArchive: any[] = []
  testMarksArchive: any[] = []
  conMarksArchive: any[] = []
  ratingMarks: any[] = []
  subjectName: any[] = []
  subjectNameArchive: any[] = []
  categories: string[][] = [[]]
  categoriesTemp: string[] = []
  series: any[] = []
  seriesArchive: any[] = []
  colorsTemp: any[] = []
  checked: any[] = [false, false, false, false]
  isArchived = false
  isArchiveTeacher = false
  charts: any[] = []

  colors: string[] = ['#FFA500', '#D32F2F', '#1976D2', '#7F00FF', '#3F51B5']

  public categoriesConst: string[] = [
    this.translatePipe.transform(
      'text.statistics.avg.pract',
      'Средний балл за практические занятия'
    ),
    this.translatePipe.transform(
      'text.statistics.avg.lab',
      'Средний балл за лабораторные работы'
    ),
    this.translatePipe.transform(
      'text.statistics.avg.test',
      'Средняя оценка за тесты'
    ),
    this.translatePipe.transform(
      'text.statistics.avg.course',
      'Оценка за курсовой проект'
    ),
    this.translatePipe.transform(
      'text.statistics.avg.rating',
      'Рейтинговая оценка'
    ),
  ]

  constructor(
    private serviceService: StatisitcsServiceService,
    private translatePipe: TranslatePipe
  ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    if (this.user.role == 'student') {
      this.serviceService.getUserInfo(this.user.id).subscribe((res) => {
        this.serviceService.getUserStastics().subscribe((result) => {
          if (result.Message == 'Ok') {
            this.serviceService
              .getAllSubjects(this.user.userName)
              .subscribe((subjects) => {
                this.performData(subjects, result, this.listChartOptions, false)
                this.serviceService
                  .getArchiveStatistics(res.GroupId)
                  .subscribe((resultArchive) => {
                    this.serviceService
                      .getAllArchiveSubjects(this.user.userName)
                      .subscribe((subjectsArchive) => {
                        this.performData(
                          subjectsArchive,
                          resultArchive,
                          this.listChartOptionsArchive,
                          true
                        )
                      })
                  })
              })
          }
        })
      })
    } else {
      this.charts = []
      this.serviceService.getTeacherStatistics().subscribe((res) => {
        let i = 0
        res.SubjectStatistics.sort((a, b) =>
          a.SubjectName.localeCompare(b.SubjectName)
        )
        res.SubjectStatistics.forEach((subject) => {
          this.serviceService
            .getGroupsBySubjectId(subject.SubjectId)
            .subscribe((groups) => {
              this.serviceService
                .getCheckedType(subject.SubjectId)
                .subscribe((types) => {
                  i += 1
                  this.isArchiveTeacher = false
                  if (groups.Groups.length == 0) {
                    this.isArchiveTeacher = true
                  }
                  this.checked = [false, false, false, false]
                  types.forEach((type) => {
                    if (type.ModuleId == 13) {
                      this.checked[0] = true
                    }
                    if (type.ModuleId == 3) {
                      this.checked[1] = true
                    }
                    if (type.ModuleId == 8) {
                      this.checked[2] = true
                    }
                    if (type.ModuleId == 4) {
                      this.checked[3] = true
                    }
                  })
                  this.temp = []
                  this.categoriesTemp = []
                  this.colorsTemp = []
                  this.tempAvg = 0
                  if (this.checked[0]) {
                    if (this.isArchiveTeacher) {
                      this.practMarksArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = this.serviceService.round(
                        +subject.AveragePracticalsMark
                      )
                    } else {
                      console.log(subject.SubjectName)
                      this.practMarks[res.SubjectStatistics.indexOf(subject)] =
                        this.serviceService.round(
                          +subject.AveragePracticalsMark
                        )
                    }
                    this.colorsTemp.push(this.colors[0])
                    this.temp.push(
                      this.serviceService.round(+subject.AveragePracticalsMark)
                    )
                    this.categoriesTemp.push(this.categoriesConst[0])
                  } else {
                    if (this.isArchiveTeacher) {
                      this.practMarksArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = 0
                    } else {
                      this.practMarks[res.SubjectStatistics.indexOf(subject)] =
                        0
                    }
                  }

                  if (this.checked[1]) {
                    if (this.isArchiveTeacher) {
                      this.labMarksArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = this.serviceService.round(+subject.AverageLabsMark)
                    } else {
                      this.labMarks[res.SubjectStatistics.indexOf(subject)] =
                        this.serviceService.round(+subject.AverageLabsMark)
                    }
                    this.colorsTemp.push(this.colors[1])
                    this.categoriesTemp.push(this.categoriesConst[1])
                    this.temp.push(
                      this.serviceService.round(+subject.AverageLabsMark)
                    )
                  } else {
                    if (this.isArchiveTeacher) {
                      this.labMarksArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = 0
                    } else {
                      this.labMarks[res.SubjectStatistics.indexOf(subject)] = 0
                    }
                  }

                  if (this.checked[2]) {
                    if (this.isArchiveTeacher) {
                      this.testMarksArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = this.serviceService.round(+subject.AverageTestsMark)
                    } else {
                      this.testMarks[res.SubjectStatistics.indexOf(subject)] =
                        this.serviceService.round(+subject.AverageTestsMark)
                    }
                    this.colorsTemp.push(this.colors[2])
                    this.temp.push(
                      this.serviceService.round(+subject.AverageTestsMark)
                    )
                    this.categoriesTemp.push(this.categoriesConst[2])
                  } else {
                    if (this.isArchiveTeacher) {
                      this.testMarksArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = 0
                    } else {
                      this.testMarks[res.SubjectStatistics.indexOf(subject)] = 0
                    }
                  }

                  if (this.checked[3]) {
                    if (this.isArchiveTeacher) {
                      this.conMarksArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = this.serviceService.round(
                        +subject.AverageCourceProjectMark
                      )
                    } else {
                      this.conMarks[res.SubjectStatistics.indexOf(subject)] =
                        this.serviceService.round(
                          +subject.AverageCourceProjectMark
                        )
                    }
                    this.colorsTemp.push(this.colors[3])
                    this.temp.push(
                      this.serviceService.round(
                        +subject.AverageCourceProjectMark
                      )
                    )
                    this.categoriesTemp.push(this.categoriesConst[3])
                  } else {
                    if (this.isArchiveTeacher) {
                      this.conMarksArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = 0
                    } else {
                      this.conMarks[res.SubjectStatistics.indexOf(subject)] = 0
                    }
                  }
                  if (this.categoriesTemp.length != 0) {
                    this.temp.forEach((el) => {
                      this.tempAvg += el
                    })
                    const rating = this.serviceService.round(
                      this.tempAvg / this.temp.length
                    )
                    this.ratingMarks[res.SubjectStatistics.indexOf(subject)] =
                      rating
                    this.temp.push(rating)
                    this.categoriesTemp.push(this.categoriesConst[4])
                    this.colorsTemp.push(this.colors[4])
                    if (this.isArchiveTeacher) {
                      this.charts[res.SubjectStatistics.indexOf(subject)] = [
                        this.temp,
                        subject.SubjectName,
                        this.categoriesTemp,
                        subject.SubjectId,
                        this.listChartOptionsArchive,
                        this.colorsTemp,
                      ]
                      this.subjectNameArchive[
                        res.SubjectStatistics.indexOf(subject)
                      ] = subject.SubjectName
                    } else {
                      this.charts[res.SubjectStatistics.indexOf(subject)] = [
                        this.temp,
                        subject.SubjectName,
                        this.categoriesTemp,
                        subject.SubjectId,
                        this.listChartOptions,
                        this.colorsTemp,
                      ]
                      this.subjectName[res.SubjectStatistics.indexOf(subject)] =
                        subject.SubjectName
                    }
                  } else {
                    this.practMarks[res.SubjectStatistics.indexOf(subject)] =
                      null
                    this.labMarks[res.SubjectStatistics.indexOf(subject)] = null
                    this.testMarks[res.SubjectStatistics.indexOf(subject)] =
                      null
                    this.conMarks[res.SubjectStatistics.indexOf(subject)] = null
                    this.ratingMarks[res.SubjectStatistics.indexOf(subject)] =
                      null
                  }
                  if (i == res.SubjectStatistics.length) {
                    this.practMarks = this.practMarks.filter((x) => x !== null)
                    this.labMarks = this.labMarks.filter((x) => x !== null)
                    this.testMarks = this.testMarks.filter((x) => x !== null)
                    this.conMarks = this.conMarks.filter((x) => x !== null)
                    this.ratingMarks = this.ratingMarks.filter(
                      (x) => x !== null
                    )
                    this.subjectName = this.subjectName.filter(
                      (x) => x !== null
                    )
                    this.subjectNameArchive = this.subjectNameArchive.filter(
                      (x) => x !== null
                    )
                    this.series.push({
                      name: this.categoriesConst[0],
                      data: this.practMarks,
                    })
                    this.series.push({
                      name: this.categoriesConst[1],
                      data: this.labMarks,
                    })
                    this.series.push({
                      name: this.categoriesConst[2],
                      data: this.testMarks,
                    })
                    this.series.push({
                      name: this.categoriesConst[3],
                      data: this.conMarks,
                    })
                    this.series.push({
                      name: this.categoriesConst[4],
                      data: this.ratingMarks,
                    })
                    this.seriesArchive.push({
                      name: this.categoriesConst[0],
                      data: this.practMarksArchive,
                    })
                    this.seriesArchive.push({
                      name: this.categoriesConst[1],
                      data: this.labMarksArchive,
                    })
                    this.seriesArchive.push({
                      name: this.categoriesConst[2],
                      data: this.testMarksArchive,
                    })
                    this.seriesArchive.push({
                      name: this.categoriesConst[3],
                      data: this.conMarksArchive,
                    })
                    this.seriesArchive.push({
                      name: this.categoriesConst[4],
                      data: this.ratingMarksArchive,
                    })
                    // this.series.push({name: this.categoriesConst[0], data: [7.4, 5.5, 0,   0,   6.7 ]});
                    // this.series.push({name: this.categoriesConst[1], data: [0,   0,   6.3, 7.7, 6.5 ]});
                    // this.series.push({name: this.categoriesConst[2], data: [6.7, 8.2, 6.2, 5.9, 0  ]});
                    // this.series.push({name: this.categoriesConst[3], data: [0,   0,   0,   0,   6 ]});
                    // this.series.push({name: this.categoriesConst[4], data: [7.1, 6.9, 6.3, 6.8, 6.4 ]});
                    // this.addMarksChart(this.series, ['Базы данных', 'Модульное тестирование',
                    // 'Методы и алгоритмы принятия решений', 'Основы защиты информации', 'Английский язык в профдеятельности']);
                    this.addMarksChart(this.series, this.subjectName)
                    this.addArchiveMarksChart(
                      this.seriesArchive,
                      this.subjectNameArchive
                    )
                    this.charts.forEach((chart) => {
                      this.addChart(
                        chart[0],
                        chart[1],
                        chart[2],
                        chart[3],
                        chart[4],
                        chart[5]
                      )
                    })
                  }
                })
            })
        })
      })
      // this.addChart([ 7.4, 6.7, 7.1], 'Базы данных', this.categoriesLabFree, 4112, this.listChartOptions);
      // this.addChart([5.5, 8.2, 6.9], 'Модульное тестирование', this.categoriesLabFree, 4112,  this.listChartOptions);
      // this.addChart([6.3, 6.2,  6.3], 'Методы и алгоритмы принятия решений', this.categoriesPractFree, 4112, this.listChartOptions);
      // this.addChart([7.7, 5.9, 6.8], 'Основы защиты информации', this.categoriesPractFree, 4112, this.listChartOptions);
      // this.addChart([6.7, 6.5, 6, 6.4], 'Английский язык в профдеятельности', this.categoriesPractCourse, 4112, this.listChartOptions);
    }
  }

  addChart(
    marks: any,
    name: string,
    cat: any,
    subjectId: any,
    list: any[],
    colorsTemp: any[]
  ) {
    list.push(
      (this.chartOptions = {
        subject: subjectId,
        colors: colorsTemp,
        categories: cat,
        series: [
          {
            name: 'Средняя оценка',
            data: marks,
          },
        ],
        chart: {
          height: 200,
          type: 'radar',
          width: 200,
        },
        title: {
          text: name,
        },
        xaxis: {
          categories: ['', '', '', '', ''],
        },
        yaxis: {
          max: 10,
          min: 0,
          tickAmount: 5,
          floating: true,
          decimalsInFloat: 0,
        },
        fill: {
          type: 'solid',
          opacity: 0,
        },
        markers: {
          discrete: [
            {
              seriesIndex: 0,
              dataPointIndex: 0,
              fillColor: colorsTemp[0],
              strokeColor: '#fff',
              size: 5,
            },
            {
              seriesIndex: 0,
              dataPointIndex: 1,
              fillColor: colorsTemp[1],
              strokeColor: '#eee',
              size: 5,
            },
            {
              seriesIndex: 0,
              dataPointIndex: 2,
              fillColor: colorsTemp[2],
              strokeColor: '#eee',
              size: 5,
            },
            {
              seriesIndex: 0,
              dataPointIndex: 3,
              fillColor: colorsTemp[3],
              strokeColor: '#eee',
              size: 5,
            },
            {
              seriesIndex: 0,
              dataPointIndex: 4,
              fillColor: colorsTemp[4],
              strokeColor: '#eee',
              size: 5,
            },
          ],
        },
        stroke: {
          show: true,
          width: 0.3,
          colors: ['black'],
          dashArray: 0,
        },
        legend: {
          show: 'true',
          position: 'bottom',
          horizontalAlign: 'center',
          floating: false,
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial',
          fontWeight: 400,
        },
      })
    )
  }

  addMarksChart(seriesMarks: any, subjects: any) {
    this.chartOptions1 = {
      series: seriesMarks,
      chart: {
        type: 'bar',
        height: Math.round(subjects.length * 35 + 90),
        stacked: true,
      },
      colors: ['#FFA500', '#D32F2F', '#1976D2', '#7F00FF', '#388E3C'],
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
        categories: subjects,
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

  addArchiveMarksChart(seriesMarks: any, subjects: any) {
    this.chartOptionsArchive = {
      series: seriesMarks,
      chart: {
        type: 'bar',
        height: Math.round(subjects.length * 35 + 90),
        stacked: true,
      },
      colors: ['#FFA500', '#D32F2F', '#1976D2', '#7F00FF', '#388E3C'],
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
        categories: subjects,
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

  ngOnInit() {}

  public rerouteToSubject(subjectId: any) {
    const message: Message = new Message()
    message.Value = '/web/viewer/subject/' + subjectId + '#news'
    message.Type = 'Route'
    this.sendMessage(message)
  }

  public sendMessage(message: Message): void {
    window.parent.postMessage(
      [{ channel: message.Type, value: message.Value }],
      '*'
    )
  }

  subjectsStatusChange(event) {
    this.isArchived = false
    if (event.checked) {
      this.isArchived = true
    }
  }

  performData(subjects: any, result: any, chartList1: any, isArchive: boolean) {
    subjects = subjects.sort((a, b) => a.Name.localeCompare(b.Name))
    this.subjectName = []
    this.series = []
    this.practMarks = []
    this.labMarks = []
    this.testMarks = []
    this.conMarks = []
    this.ratingMarks = []
    this.charts = []
    let i = 0

    subjects.forEach((subject) => {
      this.serviceService.getCheckedType(subject.Id).subscribe((types) => {
        i += 1
        this.checked = [false, false, false, false]
        types.forEach((type) => {
          if (type.ModuleId == 13) {
            this.checked[0] = true
          }
          if (type.ModuleId == 3) {
            this.checked[1] = true
          }
          if (type.ModuleId == 8) {
            this.checked[2] = true
          }
          if (type.ModuleId == 4) {
            this.checked[3] = true
          }
        })
        this.categoriesTemp = []
        this.temp = []
        this.colorsTemp = []
        this.tempAvg = 0
        this.testSum = 0
        this.practSum = 0
        this.labSum = 0
        result.Students.forEach((student) => {
          if (student.Id == this.user.id) {
            if (
              student.UserAvgTestMarks.find(({ Key }) => Key === subject.Id) !=
              undefined
            ) {
              this.testSum = this.serviceService.round(
                +student.UserAvgTestMarks.find(({ Key }) => Key === subject.Id)!
                  .Value
              )
              this.practSum = this.serviceService.round(
                +student.UserAvgPracticalMarks.find(
                  ({ Key }) => Key === subject.Id
                )!.Value
              )
              this.labSum = this.serviceService.round(
                +student.UserAvgLabMarks.find(({ Key }) => Key === subject.Id)!
                  .Value
              )
              this.courseMark = this.serviceService.round(
                +student.UserCoursePass.find(({ Key }) => Key === subject.Id)!
                  .Value
              )
            }
          }
        })
        if (this.checked[0]) {
          this.colorsTemp.push(this.colors[0])
          this.temp.push(this.practSum)
          this.practMarks[subjects.indexOf(subject)] = this.practSum
          this.categoriesTemp.push(this.categoriesConst[0])
        } else {
          this.practMarks[subjects.indexOf(subject)] = 0
        }

        if (this.checked[1]) {
          this.colorsTemp.push(this.colors[1])
          this.categoriesTemp.push(this.categoriesConst[1])
          this.temp.push(this.labSum)
          this.labMarks[subjects.indexOf(subject)] = this.labSum
        } else {
          this.labMarks[subjects.indexOf(subject)] = 0
        }

        if (this.checked[2]) {
          this.colorsTemp.push(this.colors[2])
          this.temp.push(this.testSum)
          this.categoriesTemp.push(this.categoriesConst[2])
          this.testMarks[subjects.indexOf(subject)] = this.testSum
        } else {
          this.testMarks[subjects.indexOf(subject)] = 0
        }

        if (this.checked[3]) {
          this.colorsTemp.push(this.colors[3])
          this.temp.push(this.courseMark)
          this.categoriesTemp.push(this.categoriesConst[3])
          this.conMarks[subjects.indexOf(subject)] = this.courseMark
        } else {
          this.conMarks[subjects.indexOf(subject)] = 0
        }

        this.temp.forEach((el) => {
          this.tempAvg += el
        })
        const rating = this.serviceService.round(
          this.tempAvg / this.temp.length
        )
        this.temp.push(rating)
        this.colorsTemp.push(this.colors[4])
        this.ratingMarks[subjects.indexOf(subject)] = rating
        this.subjectName[subjects.indexOf(subject)] = subject.Name
        this.categoriesTemp.push(this.categoriesConst[4])
        this.charts[subjects.indexOf(subject)] = [
          this.temp,
          subject.Name,
          this.categoriesTemp,
          subject.Id,
          chartList1,
          this.colorsTemp,
        ]
        if (i == subjects.length) {
          this.series.push({
            name: this.categoriesConst[0],
            data: this.practMarks,
          })
          this.series.push({
            name: this.categoriesConst[1],
            data: this.labMarks,
          })
          this.series.push({
            name: this.categoriesConst[2],
            data: this.testMarks,
          })
          this.series.push({
            name: this.categoriesConst[3],
            data: this.conMarks,
          })
          this.series.push({
            name: this.categoriesConst[4],
            data: this.ratingMarks,
          })
          // this.addMarksChart(this.series, this.subjectName);
          this.charts.forEach((chart) => {
            this.addChart(
              chart[0],
              chart[1],
              chart[2],
              chart[3],
              chart[4],
              chart[5]
            )
          })
          if (isArchive) {
            this.addArchiveMarksChart(this.series, this.subjectName)
          } else {
            this.addMarksChart(this.series, this.subjectName)
          }
        }
      })
    })
  }
}
