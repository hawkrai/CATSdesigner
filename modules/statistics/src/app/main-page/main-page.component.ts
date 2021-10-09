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

  public categoriesConst: string[]  = [this.translatePipe.transform('text.statistics.avg.test', 'Средняя оценка за лабораторные работу') ,
                                   this.translatePipe.transform('text.statistics.avg.test', 'Средняя оценка за тесты'),
                                  this.translatePipe.transform('text.statistics.avg.rating', 'Рейтинговая оценка'),
                                  this.translatePipe.transform('text.statistics.avg.pract', 'Средняя оценка за практические занятия'),
                                  this.translatePipe.transform('text.statistics.avg.course', 'Оценка за курсовой проект') ];

  colors: string [] = ['red', 'blue', 'orange', 'purple' , 'green'];

  constructor(private serviceService: StatisitcsServiceService, private translatePipe: TranslatePipe ) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user.role == 'student') {
      this.serviceService.getUserInfo(this.user.id).subscribe(res => {
        this.serviceService.getAllSubjects(this.user.userName).subscribe(subjects => {
          subjects.forEach(subject => {
            this.serviceService.getLabsStastics(subject.Id, res.GroupId).subscribe(result => {
              this.categoriesTemp = [];
              this.temp = [];
              this.tempAvg = 0;
              if (result.Message.length == 0) {
                this.testSum = 0;
                this.practSum = 0;
                this.labSum = 0;
                result.Students.forEach(student => {
                  if (student.StudentId == this.user.id) {
                    this.testSum = +student.TestMark;
                    this.practSum = +student.PracticalsMarkTotal;
                    this.labSum = +student.LabsMarkTotal;
                  }
                });
                this.temp.push(this.courseMark);
                this.categoriesTemp.push(this.categoriesConst[4]);
                if (this.testSum != 0) {
                  this.temp.push(this.testSum);
                  this.categoriesTemp.push(this.categoriesConst[1]);
                }
                if (this.labSum != 0) {
                  this.temp.push(this.labSum);
                  this.categoriesTemp.push(this.categoriesConst[0]);
                }
                this.temp.push(8);
                this.categoriesTemp.push(this.categoriesConst[0]);
                if (this.practSum != 0) {
                  this.temp.push(this.practSum);
                  this.categoriesTemp.push(this.categoriesConst[3]);
                }
                this.temp.forEach(el => {
                  this.tempAvg += el;
                });
                this.temp.push(this.tempAvg / this.temp.length);
                this.categoriesTemp.push(this.categoriesConst[2]);
                this.addChart(this.temp, subject.Name, this.categoriesTemp);
              }
            });
          });
        });
      });
    } else {
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
          min: 0,
          max: 10
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
