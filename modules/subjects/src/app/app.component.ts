import {Component, OnInit} from '@angular/core';
import {GroupsService} from './services/groups/groups.service';
import {IAppState} from './store/state/app.state';
import {Store} from '@ngrx/store';
import {SetSubject, SetUser} from './store/actions/subject.actions';
import {User} from './models/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit{

  title = 'lmsNew';
  user: User;
  group: {id: '', Name: ''};

  constructor(private groupsService: GroupsService,
              private store: Store<IAppState>) { }

  ngOnInit(): void {
    localStorage.setItem('currentSubject', JSON.stringify({id: "2026", Name:"Тестирование ПО"}));
    // localStorage.setItem('currentUser', JSON.stringify({id: 2, role: 'lector', userName: 'popova'}));
    this.group = JSON.parse(localStorage.getItem('currentSubject'));
    this.user = JSON.parse(localStorage.getItem('currentUser'));
    this.group && this.store.dispatch(new SetSubject(this.group));
    this.store.dispatch(new SetUser(this.user));
    this.groupsService.loadDate();

  }
}
