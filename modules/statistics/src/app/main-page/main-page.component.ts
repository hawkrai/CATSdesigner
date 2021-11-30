import {Component, OnInit} from '@angular/core';

import {StatisitcsServiceService} from '../service/statisitcs-service.service';
import {TranslatePipe} from 'educats-translate';
import {Message} from '../../../../../container/src/app/core/models/message';


@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})


export class MainPageComponent implements OnInit {

  public chartOptions: any;
  public chartOptions1: any;
  public radarChartType = 'radar';

  public listChartOptions: any[] = [];
  public temp: any[] = [];
  tempAvg;
  user: any;
  testSum = 0;
  practSum = 0;
  labSum = 0;
  ratingAvg = 0;
  courseMark = 3.8;

  practMarks: any[] = [];
  labMarks: any[] = [];
  testMarks: any[] = [];
  conMarks: any[] = [];
  ratingMarks: any[] = [];
  subjectName: any[] = [];
  categories: string[][] = [[]];
  categoriesTemp: string[] = [];
  series: any[] = [];

  public categoriesConst: string[]  = [this.translatePipe.transform('text.statistics.avg.pract', 'Средний балл за практические занятия'),
                                      this.translatePipe.transform('text.statistics.avg.test', 'Средний балл за лабораторные работы') ,
                                   this.translatePipe.transform('text.statistics.avg.test', 'Средняя оценка за тесты'),
                                  this.translatePipe.transform('text.statistics.avg.course', 'Оценка за курсовой проект'),
                                  this.translatePipe.transform('text.statistics.avg.rating', 'Рейтинговая оценка')];

  colors: string [] = [ 'orange', 'red', 'blue', 'purple' , 'green'];

  constructor(private serviceService: StatisitcsServiceService, private translatePipe: TranslatePipe ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user.role == 'student') {
      this.serviceService.getUserInfo(this.user.id).subscribe(res => {
        this.serviceService.getLabsStastics(res.GroupId).subscribe(result => {
          if (result.Message == 'Ok') {
            this.serviceService.getAllSubjects(this.user.userName).subscribe(subjects => {
              subjects.sort((a, b) => a.Name.localeCompare(b.Name));
              subjects.forEach(subject => {
                this.categoriesTemp = [];
                this.temp = [];
                this.tempAvg = 0;
                this.testSum = 0;
                this.practSum = 0;
                this.labSum = 0;
                result.Students.forEach(student => {
                  if (student.Id == this.user.id) {
                    this.testSum = (Math.round(+student.UserAvgTestMarks.find(({Key}) => Key === subject.Id)!.Value * 10) / 10) ;
                    this.practSum = 5;
                    this.labSum = (Math.round(+student.UserAvgLabMarks.find(({Key}) => Key === subject.Id)!.Value * 10) / 10) ;
                  }
                });
                if (this.practSum != null && this.practSum != undefined) {
                  this.temp.push(this.practSum);
                  this.practMarks.push(this.practSum);
                  this.categoriesTemp.push(this.categoriesConst[0]);
                } else {
                  this.categoriesTemp.push('');
                }
                if (this.labSum != null && this.labSum != undefined) {
                  this.categoriesTemp.push(this.categoriesConst[1]);
                  this.temp.push(this.labSum);
                  this.labMarks.push(this.labSum);
                } else {
                  this.categoriesTemp.push('');
                }
                if (this.testSum != null && this.testSum != undefined) {
                  this.temp.push(this.testSum);
                  this.categoriesTemp.push(this.categoriesConst[2]);
                  this.testMarks.push(this.testSum);
                } else {
                  this.categoriesTemp.push('');
                }

                this.temp.push(this.courseMark);
                this.categoriesTemp.push(this.categoriesConst[3]);
                this.conMarks.push(this.courseMark);
                this.temp.forEach(el => {
                  this.tempAvg += el;
                });
                const rating = Math.round(this.tempAvg / this.temp.length * 10) / 10;
                this.temp.push(rating);
                this.ratingMarks.push(rating);
                this.subjectName.push(subject.Name);
                this.categoriesTemp.push(this.categoriesConst[4]);
                this.addChart(this.temp, subject.Name, this.categoriesTemp, subject.Id);
              });
              this.series.push({name: this.categoriesConst[0], data: this.practMarks});
              this.series.push({name: this.categoriesConst[1], data: this.labMarks});
              this.series.push({name: this.categoriesConst[2], data: this.testMarks});
              this.series.push({name: this.categoriesConst[3], data: this.conMarks});
              this.series.push({name: this.categoriesConst[4], data: this.ratingMarks});
              this.addMarksChart(this.series, this.subjectName);
            });

          }
        });
      });
    } else {
      this.serviceService.getTeacherStatistics().subscribe(res => {
        console.log(res);
      });
      this.addChart([7, 6, 9, 5, 7], 'Test', this.categoriesConst, 4112);
    }
  }

  addChart(marks: any, name: string, cat: any, subjectId: any) {
    this.listChartOptions.push(
      this.chartOptions = {
        subject : subjectId,
        categories: cat,
        series: [
          {
            name: 'Средняя оценка',
            data: marks
          }
        ],
        chart: {
          height: 200,
          type: 'radar',
          width: 200
        },
        title: {
          text: name
        },
        xaxis: {
          categories: ['', '', '', '', '']

        },
        yaxis: {
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
      }
    );
  }

  addMarksChart(seriesMarks: any, subjects: any) {
    this.chartOptions1 = {
      series: seriesMarks,
      chart: {
        type: 'bar',
        height: Math.round(subjects.length * 35 + 90),
        stacked: true
      },
      colors: ['#FFA500', '#ff0000', '#0000FF',    '#7F00FF' , '#006400'],
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
        text: ''
      },
      xaxis: {
        categories: subjects
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

  ngOnInit() {
  }

  public rerouteToSubject(subjectId: any) {
    const message: Message = new Message();
    message.Value = '/web/viewer/subject/' + subjectId;
    message.Type = 'Route';
    this.sendMessage(message);
  }

  public sendMessage(message: Message): void {
    window.parent.postMessage([{channel: message.Type, value: message.Value}], '*');
  }

}
