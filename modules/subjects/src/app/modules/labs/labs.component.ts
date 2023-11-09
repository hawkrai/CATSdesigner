import { DialogService } from './../../services/dialog.service'
import { Observable, combineLatest } from 'rxjs'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { map } from 'rxjs/operators'

import * as subjectSelectors from '../../store/selectors/subject.selector'
import { IAppState } from '../../store/state/app.state'
import * as groupsSelectors from '../../store/selectors/groups.selectors'
import * as groupsActions from '../../store/actions/groups.actions'
import { Group } from '../../models/group.model'
import { CheckPlagiarismPopoverComponent } from '../../shared/check-plagiarism-popover/check-plagiarism-popover.component'

import * as labsActions from '../../store/actions/labs.actions'
import * as labsSelectors from '../../store/selectors/labs.selectors'
import {
  MatOptionSelectionChange,
  MatSlideToggleChange,
} from '@angular/material'
import { HasJobProtection } from 'src/app/models/job-protection/has-job-protection.model'
import { HasGroupJobProtection } from 'src/app/models/job-protection/has-group-job-protection.model'
import { Help } from 'src/app/models/help.model'
import { SubdivisionComponent } from 'src/app/shared/subdivision/subdivision.component'
import { TranslatePipe } from 'educats-translate'
import { ActivatedRoute, Router } from '@angular/router'
import { DialogData } from 'src/app/models/dialog-data.model'
import { SubSink } from 'subsink'

interface State {
  groups: Group[]
  subjectId: number
  hasJobProtections: HasJobProtection[]
  detachedGroup: boolean
  isTeacher: boolean
  group: Group
  hasInactiveGroups: boolean
}

@Component({
  selector: 'app-labs',
  templateUrl: './labs.component.html',
  styleUrls: ['./labs.component.less'],
})
export class LabsComponent implements OnInit, OnDestroy {
  tabs: { tab: string; route: string }[] = []
  public state$: Observable<State>
  private subs = new SubSink()
  constructor(
    private dialogService: DialogService,
    private translate: TranslatePipe,
    private store: Store<IAppState>,
    public router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }

  ngOnInit() {
    this.tabs = [
      {
        tab: this.translate.transform(
          'text.subjects.labs.plural',
          'Лабораторные работы'
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
        tab: this.translate.transform('works.protection', 'Защита работ'),
        route: 'job-protection',
      },
    ]

    this.store.dispatch(labsActions.checkJobProtections())

    this.state$ = combineLatest(
      this.store.select(groupsSelectors.getGroups),
      this.store.select(subjectSelectors.getSubjectId),
      this.store.select(labsSelectors.hasJobProtections),
      this.store.select(groupsSelectors.isActiveGroup),
      this.store.select(subjectSelectors.isTeacher),
      this.store.select(groupsSelectors.getCurrentGroup),
      this.store.select(groupsSelectors.hasInactiveGroups)
    ).pipe(
      map(
        ([
          groups,
          subjectId,
          hasJobProtections,
          isActive,
          isTeacher,
          group,
          hasInactiveGroups,
        ]) => ({
          groups,
          subjectId,
          hasJobProtections,
          detachedGroup: !isActive,
          isTeacher,
          group,
          hasInactiveGroups,
        })
      )
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

  groupStatusChange(event: MatSlideToggleChange): void {
    this.store.dispatch(
      groupsActions.setActiveState({ isActive: !event.checked })
    )
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

  downloadAll() {
    this.store.dispatch(labsActions.getLabsAsZip())
  }

  getVisitingExcelFile(): void {
    this.store.dispatch(labsActions.getVisitingExcel())
  }

  getResultsExcelFile(): void {
    this.store.dispatch(labsActions.getMarksExcel())
  }

  refreshJobProtection() {
    this.store.dispatch(labsActions.loadGroupJobProtection())
  }

  checkPlagiarism() {
    const dialogData: DialogData = {
      body: { isLab: true },
    }
    this.dialogService.openDialog(CheckPlagiarismPopoverComponent, dialogData)
  }

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
      'text.help.labs.protection.schedule',
      'Нажмите на кнопку «Управление датами», чтобы добавить или удалить даты лабораторных занятий. Расчет рекомендуемых оценок произойдет автоматически.'
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

  subdivision(groupId: number) {
    const dialogData: DialogData = {
      model: groupId,
    }
    const dialogRef = this.dialogService.openDialog(
      SubdivisionComponent,
      dialogData
    )
    this.subs.add(
      dialogRef.afterClosed().subscribe((obj) => {
        if (obj && obj.updated) {
          this.store.dispatch(labsActions.loadLabsSubGroups())

          if (
            this.router.url.startsWith('/labs/visit-statistics') ||
            this.router.url.startsWith('/labs/results')
          ) {
            this.store.dispatch(labsActions.loadLabStudents())
          }
        }
      })
    )
  }
}
