import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/service/userService';

@Component({
  selector: 'app-active-stats',
  templateUrl: './active-stats.component.html',
  styleUrls: ['./active-stats.component.css']
})
export class ActiveStatsComponent implements OnInit {

  users = [];
  times = [];
  type = 'PieChart';
  options = {
    legend: {position: 'left'}
  };
  userActivity: any;
  isLoadActive = false;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.loadActivity();
  }

  loadActivity() {
    this.userService.getUserActivity().subscribe(result => {
      this.users = this.convertJsonToArray(['Аккаунты студентов', 'Аккаунты преподавателей', 'Сервисные аккаунты',],
      [result.TotalStudentsCount, result.TotalLecturersCount, result.ServiceAccountsCount]);
      this.userActivity = result;
      const obj = JSON.parse(result.UserActivityJson);
      this.times = this.convertJsonToArray(Object.keys(obj), Object.values(obj));
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
