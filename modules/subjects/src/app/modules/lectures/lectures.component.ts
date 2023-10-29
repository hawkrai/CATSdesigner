import { MatOptionSelectionChange } from '@angular/material'
import { first, map } from 'rxjs/operators'
import { Observable, combineLatest } from 'rxjs'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { Store } from '@ngrx/store'

import * as subjectSelectors from '../../store/selectors/subject.selector'
import * as groupsSelectors from '../../store/selectors/groups.selectors'
import * as groupsActions from '../../store/actions/groups.actions'
import { IAppState } from '../../store/state/app.state'
import { Group } from 'src/app/models/group.model'
import { MediaMatcher } from '@angular/cdk/layout'
import { TranslatePipe } from 'educats-translate'
import { ActivatedRoute, Router } from '@angular/router'

@Component({
  selector: 'app-lectures',
  templateUrl: './lectures.component.html',
  styleUrls: ['./lectures.component.less'],
})
export class LecturesComponent implements OnInit, OnDestroy {
  state$: Observable<{
    isTeacher: boolean
    subjectId: number
    groups: Group[]
    groupId: number
    group: Group
  }>

  tabs: { tab: string; route: string }[] = []
  public mobileMatcher: MediaQueryList

  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe,
    private mediaMatcher: MediaMatcher,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngOnDestroy(): void {
    this.mobileMatcher.removeEventListener('change', this.emptyListener)
  }

  ngOnInit() {
    this.tabs = [
      {
        tab: this.translate.transform('text.lectures.plural', 'Лекции'),
        route: 'list',
      },
      {
        tab: this.translate.transform(
          'text.subjects.lectures.attending',
          'Посещение лекций'
        ),
        route: 'visit-statistics',
      },
    ]

    const isTeacher$ = this.store.select(subjectSelectors.isTeacher)
    const subjectId$ = this.store.select(subjectSelectors.getSubjectId)
    const groups$ = this.store.select(groupsSelectors.getGroups)
    const selectedGroupId$ = this.store.select(
      groupsSelectors.getCurrentGroupId
    )
    const selectedGroup$ = this.store.select(groupsSelectors.getCurrentGroup)
    this.state$ = combineLatest(
      isTeacher$,
      subjectId$,
      groups$,
      selectedGroupId$,
      selectedGroup$
    ).pipe(
      map(([isTeacher, subjectId, groups, groupId, group]) => ({
        isTeacher,
        subjectId,
        groups,
        groupId,
        group,
      }))
    )
    this.mobileMatcher = this.mediaMatcher.matchMedia('(max-width: 400px)')
    this.mobileMatcher.addEventListener('change', this.emptyListener)
  }

  private emptyListener() {}

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { groupId: event.source.value },
        queryParamsHandling: 'merge',
      })
    }
  }
}
