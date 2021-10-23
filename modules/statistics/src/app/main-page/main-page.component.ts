import {Component, OnInit} from '@angular/core';

import {StatisitcsServiceService} from '../service/statisitcs-service.service';
import {TranslatePipe} from 'educats-translate';


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

  public listChartOptions: any[] = [];
  public temp: any[] = [];
  tempAvg;
  user: any;
  testSum = 0;
  practSum = 0;
  labSum = 0;
  ratingAvg = 0;
  courseMark = 3.8;

  categories: string[][] = [[]];
  categoriesTemp: string[] = [];

  public categoriesConst: string[]  = [this.translatePipe.transform('text.statistics.avg.pract', 'Средняя оценка за практические занятия'),
                                      this.translatePipe.transform('text.statistics.avg.test', 'Средняя оценка за лабораторные работу') ,
                                   this.translatePipe.transform('text.statistics.avg.test', 'Средняя оценка за тесты'),
                                  this.translatePipe.transform('text.statistics.avg.course', 'Оценка за курсовой проект'),
                                  this.translatePipe.transform('text.statistics.avg.rating', 'Рейтинговая оценка')];

  colors: string [] = ['red', 'blue', 'orange', 'purple' , 'green'];

  constructor(private serviceService: StatisitcsServiceService, private translatePipe: TranslatePipe ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user.role == 'student') {
      this.serviceService.getUserInfo(this.user.id).subscribe(res => {
        this.serviceService.getAllSubjects(this.user.userName).subscribe(subjects => {
          subjects.forEach(subject => {
            this.serviceService.getLabsStastics(res.GroupId).subscribe(result => {
              this.categoriesTemp = [];
              this.temp = [];
              this.tempAvg = 0;
              console.log(result);
              if (result.Message == 'Ok') {
                this.testSum = 0;
                this.practSum = 0;
                this.labSum = 0;
                result.Students.forEach(student => {
                  if (student.Id == this.user.id) {
                    this.testSum = +student.UserAvgTestMarks.find(({Key}) => Key === subject.Id)!.Value;
                    this.practSum = 0;
                    this.labSum = +student.UserAvgLabMarks.find(({Key}) => Key === subject.Id)!.Value;
                  }
                });
                this.temp.push(this.practSum);
                if (this.practSum != 0) {
                  this.categoriesTemp.push(this.categoriesConst[0]);
                } else {
                  this.categoriesTemp.push('');
                }
                this.temp.push(this.labSum);
                if (this.labSum != 0) {
                  this.categoriesTemp.push(this.categoriesConst[1]);
                } else {
                  this.categoriesTemp.push('');
                }
                this.temp.push(this.testSum);
                if (this.testSum != 0) {
                  this.categoriesTemp.push(this.categoriesConst[2]);
                } else {
                  this.categoriesTemp.push('');
                }

                this.temp.push(this.courseMark);
                this.categoriesTemp.push(this.categoriesConst[3]);
                this.temp.forEach(el => {
                  this.tempAvg += el;
                });
                this.temp.push(Math.round(this.tempAvg / this.temp.length * 100) / 100);
                this.categoriesTemp.push(this.categoriesConst[4]);
                this.addChart(this.temp, subject.Name, this.categoriesTemp);
              }
            });
          });
        });
      });
    } else {
      this.serviceService.getTeacherStatistics().subscribe(res => {
        console.log(res);
      });
      this.addChart([7, 6, 9, 5, 7], 'Test', this.categoriesConst);
    }
  }

  addChart(marks: any, name: string, cat: any) {
    this.listChartOptions.push(
      this.chartOptions = {
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

  ngOnInit() {
  }

}
