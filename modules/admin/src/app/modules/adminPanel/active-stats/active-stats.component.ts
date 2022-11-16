import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/userService';
import { NgApexchartsModule } from "ng-apexcharts";

@Component({
  selector: 'app-active-stats',
  templateUrl: './active-stats.component.html',
  styleUrls: ['./active-stats.component.css']
})
export class ActiveStatsComponent implements OnInit {
  userActivity: any;
  isLoadActive = false;

  usersSeries = [];
  usersLabels = [];
  
  timesSeries = [];
  timesLabels = [];

  chartOptions = {
    chart: {
      width: 750,
      height: 600,
      type: 'pie'
    },
    legend: {
      floating: true,
      position: 'left'
    }
  }

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.loadActivity();
  }

  loadActivity() {
    this.userService.getUserActivity().subscribe(result => {
      this.usersSeries = [result.TotalStudentsCount, result.TotalLecturersCount, result.ServiceAccountsCount];
      this.usersLabels = ['Аккаунты студентов', 'Аккаунты преподавателей', 'Сервисные аккаунты']
      this.userActivity = result;
      const obj = JSON.parse(result.UserActivityJson);
      this.timesSeries = Object.values(obj);
      this.timesLabels = Object.keys(obj);
      this.isLoadActive = true;
    });
  }

  convertJsonToArray(keys: Array<any>, values: Array<any>) {
    const ob = [];
    for ( let i = 0; i < keys.length; i++) {
      ob.push([keys[i], values[i]]);
    }
    return ob;
  }

}
