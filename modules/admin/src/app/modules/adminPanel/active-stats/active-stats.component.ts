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
      this.users = this.convertJsonToArray(['Аккаунты преподавателей', 'Аккаунты студентов', 'Сервисные аккаунты', 'Всего аккаунтов'],
      Object.values(result)).slice(0, 2);
      this.userActivity = result;
      const obj = JSON.parse(result.UserActivityJson);
      this.times = this.convertJsonToArray(Object.keys(obj), Object.values(obj));
      this.isLoadActive = true;
    });
  }

  convertJsonToArray(keys, values) {
    const ob = [];
    for ( let i = 0; i < values.length - 1; i++) {
      ob.push([keys[i], values[i]]);
    }
    return ob;
  }

}
