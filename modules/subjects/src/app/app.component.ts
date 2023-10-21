import { Component, OnDestroy, OnInit } from '@angular/core'
import { IAppState } from './store/state/app.state'
import { Store } from '@ngrx/store'
import * as subjectActions from './store/actions/subject.actions'
import * as catsActions from './store/actions/cats.actions'
import { User } from './models/user.model'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { Message } from './models/message.model'
import { SubSink } from 'subsink'
import * as groupsActions from './store/actions/groups.actions'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less'],
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'lmsNew'
  subs = new SubSink()

  constructor(
    private store: Store<IAppState>,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngOnInit(): void {
    this.store.dispatch(catsActions.setupMessageCommunication())
    const subject = JSON.parse(localStorage.getItem('currentSubject'))
    const user = JSON.parse(localStorage.getItem('currentUser')) as User
    if (subject) {
      this.store.dispatch(
        subjectActions.setSubject({
          subject: {
            id: subject.id,
            color: subject.color,
            subjectName: subject.name,
          },
        })
      )
    }
    this.store.dispatch(subjectActions.setUser({ user }))

    const isTeacher = user.role.toLowerCase() === 'lector'
    let isLoaded = false
    this.subs.add(
      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          if (!isLoaded) {
            const groupId = Number.isNaN(
              +this.route.snapshot.queryParams.groupId
            )
              ? null
              : +this.route.snapshot.queryParams.groupId
            if (isTeacher) {
              this.store.dispatch(groupsActions.loadGroups({ groupId }))
            } else {
              this.store.dispatch(groupsActions.loadStudentGroup())
            }
            isLoaded = true
          }
          if (subject) {
            this.store.dispatch(
              catsActions.sendMessage({
                message: new Message(
                  'Location',
                  `web/viewer/subject/${subject.id}#${event.url.slice(1)}`
                ),
              })
            )
          }
        }
      }),
      this.route.queryParams.subscribe((params) => {
        if (params.groupId && isTeacher) {
          this.store.dispatch(
            groupsActions.setCurrentGroupById({ id: +params.groupId })
          )
        }
      })
    )
  }
}
