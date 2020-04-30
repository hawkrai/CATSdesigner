import {Component, OnInit} from '@angular/core';
import {GroupsService} from './services/groups/groups.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{
  title = 'lmsNew';

  constructor(private groupsService: GroupsService) { }

  ngOnInit(): void {
    this.groupsService.loadDate();
  }
}
