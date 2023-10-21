import { Component, OnInit } from '@angular/core'
import { IAppState } from './store/states/app.state'
import { Store } from '@ngrx/store'
import { SetSubject, SetUser } from './store/actions/subject.actions'
import { User } from './models/User'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit {
  title = 'complex'

  user: User
  subject: { id: ''; Name: '' }

  constructor(private store: Store<IAppState>) {}

  ngOnInit(): void {
    //localStorage.setItem('currentSubject', JSON.stringify({id: "3", Name:"Тестирование ПО"}));
    //localStorage.setItem('currentUser', JSON.stringify({id: 2, role: 'lector', userName: 'popova'}));
    this.subject = JSON.parse(localStorage.getItem('currentSubject'))
    this.user = JSON.parse(localStorage.getItem('currentUser'))
    this.subject && this.store.dispatch(new SetSubject(this.subject))
    this.store.dispatch(new SetUser(this.user))
  }
}
