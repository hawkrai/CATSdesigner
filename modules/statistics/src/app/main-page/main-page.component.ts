import {Component, OnInit} from '@angular/core';

import {StatisitcsServiceService} from '../service/statisitcs-service.service';

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
  user: any;
  testSum = 0;
  practSum = 0;
  labSum = 0;
  ratingAvg = 0;

  public categories: string[][]  = [['1', '4.1', 'Средняя оценка за лабораторную работу'],
                                  ['2', '3.4', 'Средняя оценка за тесты'],
                                  ['3', '4.5', 'Рейтинговая оценка'],
                                  ['4', '4.3',  'Средняя оценка за практические работы'],
                                  ['5', '3.8', 'Оценка за курсовой проект']];

  colors: string [] = ['red', 'blue', 'yellow', 'purple' , 'green'];

  constructor(private serviceService: StatisitcsServiceService) {
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    if (this.user.role == 'student') {
      this.serviceService.getUserInfo(this.user.id).subscribe(res => {
        this.serviceService.getAllSubjects(this.user.userName).subscribe(subjects => {
          subjects.forEach(subject => {
            this.serviceService.getLabsStastics(subject.Id, res.GroupId).subscribe(result => {
              if (result.Message.length == 0) {
                this.testSum = 0;
                this.practSum = 0;
                this.labSum = 0;
                result.Students.forEach(student => {
                  if (student.StudentId == this.user.id) {
                    this.testSum += student.TestMark;
                    this.practSum += student.PracticalsMarkTotal;
                    this.labSum += student.LabsMarkTotal;
                  }
                });
                if (this.practSum == 0) {
                  this.ratingAvg = (this.testSum + this.labSum) / 2;
                } else {
                  this.ratingAvg = (this.testSum + this.labSum + this.practSum) / 3;
                }
                this.addChart(this.labSum, this.testSum, this.ratingAvg, this.practSum, subject.Name);
              }
            });
          });
        });
      });
    } else {
      this.addChart(7, 6, 9, 5, 'Test');
    }
  }

  addChart(lab: number, test: number, rating: number, pract: number, name: string) {
    this.listChartOptions.push(
      this.chartOptions = {
        series: [
          {
            name: 'Средняя оценка',
            data: [lab, test, rating, pract, 3.8]
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
