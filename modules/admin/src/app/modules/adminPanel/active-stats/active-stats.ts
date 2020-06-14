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
  isLoad = false;

  constructor(private userService: UserService) {
  }

  ngOnInit() {
    this.loadActivity();
  }

  loadActivity() {
    this.userService.getUserActivity().subscribe(result => {
      this.users = this.convertJsonToArray(['Сервисные аккаунты', 'Аккаунты преподавателей', 'Аккаунты студентов', 'Всего аккаунтов'],
      Object.values(result));
      this.userActivity = result;
      const obj = JSON.parse(result.UserActivityJson);
      this.times = this.convertJsonToArray(Object.keys(obj), Object.values(obj));
      this.isLoad = true;
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
