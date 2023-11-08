import { Component, OnDestroy, OnInit } from '@angular/core'
import { Store } from '@ngrx/store'
import { Observable, combineLatest } from 'rxjs'
import { DialogService } from 'src/app/services/dialog.service'

import { MediaMatcher } from '@angular/cdk/layout'
import { TranslatePipe } from 'educats-translate'
import { map, take } from 'rxjs/operators'
import { Group } from 'src/app/models/group.model'
import { Help } from 'src/app/models/help.model'
import { Message } from 'src/app/models/message.model'
import { SubjectLector } from 'src/app/models/subject-letor.model'
import { User } from 'src/app/models/user.model'
import { DeletePopoverComponent } from 'src/app/shared/delete-popover/delete-popover.component'
import { FilterOp } from 'src/app/shared/pipes/filter.pipe'
import { SubSink } from 'subsink'
import { DialogData } from '../../models/dialog-data.model'
import { Subject } from '../../models/subject.model'
import * as catsActions from '../../store/actions/cats.actions'
import * as subjectActions from '../../store/actions/subject.actions'
import * as subjectSelectors from '../../store/selectors/subject.selector'
import { IAppState } from '../../store/state/app.state'
import { SubjectLectorComponent } from './subject-lector/subject-lector.component'
import { SubjectManagementComponent } from './subject-managment/subject-management.component'

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.less'],
})
export class SubjectComponent implements OnInit, OnDestroy {
  state$: Observable<{
    subjects: Subject[]
    user: User
  }>

  searchValue: string = ''
  filterOps = FilterOp
  private subs = new SubSink()
  actionsMatcher: MediaQueryList
  listViewMatcher: MediaQueryList
  mobileViewMatcher: MediaQueryList

  public displayedColumns = [
    'name',
    'shortName',
    'groups',
    'students',
    'lectors',
    'actions',
  ]

  constructor(
    private store: Store<IAppState>,
    private dialogService: DialogService,
    private translate: TranslatePipe,
    public mediaMatcher: MediaMatcher
  ) {}
  ngOnDestroy(): void {
    this.store.dispatch(subjectActions.resetSubjects())
    this.cleanMediaMatchers()
  }

  ngOnInit() {
    this.addMediaMatchers()
    this.store.dispatch(subjectActions.loadSubjects())
    this.state$ = combineLatest([
      this.store.select(subjectSelectors.getSubjects),
      this.store.select(subjectSelectors.getUser),
    ]).pipe(map(([subjects, user]) => ({ subjects, user })))
  }

  private matcherListener(event: MediaQueryListEvent): void {}

  private addMediaMatchers(): void {
    this.actionsMatcher = this.mediaMatcher.matchMedia('(max-width: 832px)')
    this.listViewMatcher = this.mediaMatcher.matchMedia('(max-width: 680px)')
    this.mobileViewMatcher = this.mediaMatcher.matchMedia('(max-width: 540px)')
    this.actionsMatcher.addEventListener('change', this.matcherListener)
    this.listViewMatcher.addEventListener('change', this.matcherListener)
    this.mobileViewMatcher.addEventListener('change', this.matcherListener)
  }

  private cleanMediaMatchers(): void {
    this.actionsMatcher.removeEventListener('change', this.matcherListener)
    this.listViewMatcher.removeEventListener('change', this.matcherListener)
    this.mobileViewMatcher.removeEventListener('change', this.matcherListener)
  }

  constructorSubject(subjects: Subject[], subjectId?: number) {
    const dialogData: DialogData = {
      model: { subjectId },
      body: subjects,
    }
    const dialogRef = this.dialogService.openDialog(
      SubjectManagementComponent,
      dialogData
    )
    this.subs.add(
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.store.dispatch(subjectActions.saveSubject({ subject: result }))
        }
      })
    )
  }

  lector(subjectId: string, subjectName: string) {
    const dialogData: DialogData = {
      title: this.translate.transform(
        'text.subjects.lector.joining',
        'Присоединение преподавателя к предмету'
      ),
      body: { subjectName },
      model: { subjectId },
    }
    const dialog = this.dialogService.openDialog(
      SubjectLectorComponent,
      dialogData
    )

    dialog
      .afterClosed()
      .pipe(take(1))
      .subscribe(() => {
        this.store.dispatch(
          subjectActions.loadSubject({ subjectId: +subjectId })
        )
      })
  }

  deleteSubject(subject : Subject) {
    // Если subject.GroupCount <= 0, тогда можно удалять
    // Иначе сообщить пользователю о том, что это сделать нельзя

    const dialogData: DialogData = {
      title: this.translate.transform('subject.deleting', 'Удаление предмета'),
      body: `${this.translate.transform('subject.singular', 'предмет').toLowerCase()} "${subject.DisplayName}"`,
      buttonText: this.translate.transform('button.delete', 'Удалить')
    };

    const dialogRef = this.dialogService.openDialog(DeletePopoverComponent, dialogData);

    this.subs.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.store.dispatch(subjectActions.deleteSubejctById({ subjectId: subject.SubjectId }));
        }
      })
    );
  }

  navigateToSubject(subjectId: number): void {
    this.store.dispatch(
      catsActions.sendMessage({
        message: new Message('SubjectId', subjectId.toString()),
      })
    )
  }

  getSubjectGroupsTooltip(groups: Group[]): string {
    return groups.map((x) => x.GroupName).join('\n')
  }

  getLectorsTooltip(lectors: SubjectLector[]): string {
    return lectors
      .map((x) => `${x.LastName} ${x.FirstName} ${x.MiddleName}`)
      .join('\n')
  }

  subjectsHelp: Help = {
    message: this.translate.transform(
      'text.help.popover.subject',
      'Нажмите на кнопку «Добавить предмет» для создания нового предмета. Затем выберите нужные модули и присоедините группы.'
    ),
    action: this.translate.transform('button.understand', 'Понятно'),
  }
}
