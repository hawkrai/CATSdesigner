import { map } from 'rxjs/operators'
import { Observable, combineLatest } from 'rxjs'
import { Store } from '@ngrx/store'
import { Component, OnInit, OnDestroy } from '@angular/core'
import { MatOptionSelectionChange } from '@angular/material/core'

import { Group } from '../../models/group.model'
import * as subjectSelectors from '../../store/selectors/subject.selector'
import { IAppState } from '../../store/state/app.state'
import * as groupActions from '../../store/actions/groups.actions'
import * as groupSelectors from '../../store/selectors/groups.selectors'
import * as practicalsActions from '../../store/actions/practicals.actions'
import * as practicalsSelectors from '../../store/selectors/practicals.selectors'
import { Help } from 'src/app/models/help.model'
import { SubdivisionComponent } from 'src/app/shared/subdivision/subdivision.component'
import { DialogService } from 'src/app/services/dialog.service'
import { TranslatePipe } from 'educats-translate'
import { ActivatedRoute, Router } from '@angular/router'
import { DialogData } from 'src/app/models/dialog-data.model'
import { HasJobProtection } from 'src/app/models/job-protection/has-job-protection.model'
import { HasGroupJobProtection } from 'src/app/models/job-protection/has-group-job-protection.model'
import { CheckPlagiarismPopoverComponent } from 'src/app/shared/check-plagiarism-popover/check-plagiarism-popover.component'

interface State {
  groups: Group[]
  group: Group
  isTeacher: boolean
  detachedGroup: boolean
  hasJobProtections: HasJobProtection[]
  hasInactiveGroups: boolean
}

@Component({
  selector: 'app-practical',
  templateUrl: './practical.component.html',
  styleUrls: ['./practical.component.less'],
})
export class PracticalComponent implements OnInit {
  constructor(
    private store: Store<IAppState>,
    private translate: TranslatePipe,
    private dialogService: DialogService,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  tabs: { tab: string; route: string }[] = []

  state$: Observable<State>

  visitingHelp: Help = {
    message: this.translate.transform(
      'text.help.visit.statistic',
      'Нажмите 2 раза на ячейку напротив любого студента в нужную дату, чтобы отметить посещаемость и оставить комментарии.'
    ),
    action: this.translate.transform('button.understand', 'Понятно'),
  }

  resultsHelp: Help = {
    message: this.translate.transform(
      'text.help.results',
      'Нажмите 2 раза на ячейку напротив любого студента в нужную дату, чтобы выставить оценку.'
    ),
    action: this.translate.transform('button.understand', 'Понятно'),
  }

  protectionScheduleHelp: Help = {
    message: this.translate.transform(
      'text.help.practicals.protection.schedule',
      'Нажмите на кнопку «Управление датами», чтобы добавить или удалить даты практических занятий. Расчет рекомендуемых оценок произойдет автоматически.'
    ),
    action: this.translate.transform('button.understand', 'Понятно'),
  }

  protectionStudentHelp: Help = {
    message: this.translate.transform(
      'text.help.protection.student',
      'Нажмите на кнопку «Загрузить работу», чтобы отправить выполненную работу на проверку.'
    ),
    action: this.translate.transform('button.understand', 'Понятно'),
  }

  ngOnInit(): void {
    this.tabs = [
      {
        tab: this.translate.transform(
          'text.subjects.practicals.plural',
          'Практические занятия'
        ),
        route: 'list',
      },
      {
        tab: this.translate.transform('submission.protection', 'График защиты'),
        route: 'schedule',
      },
      {
        tab: this.translate.transform(
          'lesson.attendance',
          'Статистика посещения'
        ),
        route: 'visit-statistics',
      },
      {
        tab: this.translate.transform('results', 'Результаты'),
        route: 'results',
      },
      {
        tab: this.translate.transform('works.submission', 'Защита работ'),
        route: 'job-protection',
      },
    ]
    this.store.dispatch(practicalsActions.checkJobProtections())

    this.state$ = combineLatest(
      this.store.select(groupSelectors.getGroups),
      this.store.select(groupSelectors.getCurrentGroup),
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(groupSelectors.isActiveGroup),
      this.store.select(practicalsSelectors.hasJobProtections),
      this.store.select(groupSelectors.hasInactiveGroups)
    ).pipe(
      map(
        ([
          groups,
          group,
          isTeacher,
          isActive,
          hasJobProtections,
          hasInactiveGroups,
        ]) => ({
          groups,
          group,
          isTeacher,
          detachedGroup: !isActive,
          hasJobProtections,
          hasInactiveGroups,
        })
      )
    )
  }

  groupStatusChange(event) {
    this.store.dispatch(
      groupActions.setActiveState({ isActive: !event.checked })
    )
  }

  groupHasJobProtection(
    hasGroupJobProtection: HasGroupJobProtection[],
    group: Group
  ): boolean {
    const hasJobProtection = hasGroupJobProtection.find(
      (x) => group && x.GroupId === group.GroupId
    )
    return hasJobProtection ? hasJobProtection.HasJobProtection : false
  }

  selectedGroup(event: MatOptionSelectionChange) {
    if (event.isUserInput) {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { groupId: event.source.value },
        queryParamsHandling: 'merge',
      })
    }
  }

  getVisitingExcelFile(): void {
    this.store.dispatch(practicalsActions.getVisitingExcel())
  }

  getResultsExcelFile(): void {
    this.store.dispatch(practicalsActions.getMarksExcel())
  }

  subdivision(groupId: number) {
    const dialogData: DialogData = {
      model: groupId,
    }
    this.dialogService.openDialog(SubdivisionComponent, dialogData)
  }

  downloadAll() {
    this.store.dispatch(practicalsActions.getAsZip())
  }

  checkPlagiarism() {
    const dialogData: DialogData = {
      body: { isPractical: true },
    }
    this.dialogService.openDialog(CheckPlagiarismPopoverComponent, dialogData)
  }

  refreshJobProtection() {
    this.store.dispatch(practicalsActions.loadGroupJobProtection())
  }
}
